import { Provider } from "react-redux";
import { store } from "../store/store.ts";
import { render, screen } from "@testing-library/react";
import { TasksPage } from "../pages/TasksPage";
import { useAuth } from "react-oidc-context";
import type { User } from "oidc-client-ts";
import { mockNotes } from "../features/notes/notesApi.test.tsx";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { MemoryRouter } from "react-router";

import * as api from "../features/notes/notesApi.ts";

class ResizeObserverMock implements ResizeObserver {
  observe: ResizeObserver["observe"] = () => {};
  unobserve: ResizeObserver["unobserve"] = () => {};
  disconnect: ResizeObserver["disconnect"] = () => {};
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

const mockGetNotes = (opts: {
  data?: unknown;
  error?: unknown;
  isLoading: boolean;
}) => {
  vi.mocked(api.useGetNotesQuery).mockReturnValue({
    data: opts.data,
    error: opts.error,
    isLoading: opts.isLoading,
  } as unknown as ReturnType<typeof api.useGetNotesQuery>);
};

const mockMutation = (
  hook: any,
  triggerImpl: (...args: any[]) => any = () => {},
) => {
  const trigger = vi.fn(triggerImpl);
  vi.mocked(hook).mockReturnValue([trigger, {}] as any);
  return trigger;
};

vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../features/notes/notesApi", () => ({
  useGetNotesQuery: vi.fn(),
  useAddNoteMutation: vi.fn(() => [vi.fn(), {}]),
  useDeleteNoteMutation: vi.fn(() => [vi.fn(), {}]),
  useDeleteAllMutation: vi.fn(() => [vi.fn(), {}]),
}));

vi.mock("@react-aria/i18n", () => ({
  useDateFormatter: () => ({
    format: () => "2024-01-01 12:00",
  }),
}));

const renderWithProvider = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/tasks"]}>
        <TasksPage />
      </MemoryRouter>
    </Provider>,
  );

describe("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2026-01-01T12:00:00Z");
    // vi.useFakeTimers();
    vi.setSystemTime(date);

    vi.mocked(useAuth).mockReturnValue({
      user: { profile: { email: "abc@test.com" } } as Partial<User>,
    } as ReturnType<typeof useAuth>);
  });

  it("should call useGetNotesQuery by initial render", async () => {
    mockGetNotes({ data: mockNotes, error: undefined, isLoading: false });

    renderWithProvider();

    expect(api.useGetNotesQuery).toHaveBeenCalled();
    expect(api.useGetNotesQuery).toHaveBeenCalledWith(
      {
        email: "abc@test.com",
        selectedTab: "all",
      },
      {
        skip: false,
      },
    );
  });

  it("should render loading state", () => {
    mockGetNotes({ data: undefined, error: undefined, isLoading: true });

    renderWithProvider();

    expect(screen.getByText("Ładowanie zadań...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    mockGetNotes({ data: undefined, error: { status: 500 }, isLoading: false });

    renderWithProvider();

    expect(
      screen.getByText("Błąd podczas ładowania zadań"),
    ).toBeInTheDocument();
  });

  it("should render tasks component", () => {
    mockGetNotes({ data: mockNotes, error: undefined, isLoading: false });

    renderWithProvider();

    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  it("should delete all notes", async () => {
    const deleteAllTrigger = mockMutation(api.useDeleteAllMutation);
    mockGetNotes({ data: mockNotes, error: undefined, isLoading: false });

    renderWithProvider();

    const user = userEvent.setup();
    const deleteAllButton = screen.getByRole("button", { name: /Remove all/i });
    await user.click(deleteAllButton);

    expect(deleteAllTrigger).toHaveBeenCalledTimes(1);
    expect(deleteAllTrigger).toHaveBeenCalledWith(mockNotes);
  });

  it("should delete note on delete button click", async () => {
    const deleteNoteTrigger = mockMutation(api.useDeleteNoteMutation);
    mockGetNotes({ data: mockNotes, error: undefined, isLoading: false });

    renderWithProvider();

    const user = userEvent.setup();
    const deleteButtons = screen.getAllByTestId("remove");

    await user.click(deleteButtons[0]!);

    expect(deleteNoteTrigger).toHaveBeenCalledWith(mockNotes[0]!.id);
  });

  it("should add note on form submit", async () => {
    const addNoteTrigger = mockMutation(api.useAddNoteMutation, () => ({
      unwrap: () => Promise.resolve({}),
    }));

    renderWithProvider();

    const user = userEvent.setup();
    const input = screen.getByTestId("task-input");

    await user.type(input, "New Task");
    await user.keyboard("{Enter}");

    expect(addNoteTrigger).toHaveBeenCalledWith({
      title: "New Task",
      author: "abc@test.com",
      kind: "private",
      taskCreated: "2026-01-01T12:00:00.000Z",
      taskEnd: "2026-01-01",
    });
  });

  describe("Form Validation", () => {
    const setupAddMock = () =>
      mockMutation(api.useAddNoteMutation, () => ({
        unwrap: () => Promise.resolve({}),
      }));

    const submitWithValue = async (value?: string) => {
      renderWithProvider();
      const user = userEvent.setup();
      const input = screen.getByTestId("task-input");
      if (value) await user.type(input, value);
      await user.keyboard("{Enter}");
    };

    it("should not submit empty input", async () => {
      const addNoteTrigger = setupAddMock();
      await submitWithValue();

      expect(addNoteTrigger).not.toHaveBeenCalled();
    });

    it("should not submit to short input", async () => {
      const addNoteTrigger = setupAddMock();
      await submitWithValue("A");

      expect(addNoteTrigger).not.toHaveBeenCalled();
    });

    it("should not submit to short input", async () => {
      const addNoteTrigger = setupAddMock();
      await submitWithValue("A".repeat(101));

      expect(addNoteTrigger).not.toHaveBeenCalled();
    });
  });
});
