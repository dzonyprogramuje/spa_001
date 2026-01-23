import { Provider } from "react-redux";
import { store } from "../store/store.ts";
import { render, screen } from "@testing-library/react";
import { TasksComponent } from "./TasksComponent.tsx";
import { useAuth } from "react-oidc-context";
import type { User } from "oidc-client-ts";
import { useGetNotesQuery } from "../features/notes/notesApi.ts";
import { mockNotes } from "../features/notes/notesApi.test.tsx";
import userEvent from "@testing-library/user-event";

vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../features/notes/notesApi", () => ({
  useGetNotesQuery: vi.fn(),
  useAddNoteMutation: vi.fn(() => [vi.fn(), {}]),
  useDeleteNoteMutation: vi.fn(() => [vi.fn(), {}]),
  useDeleteAllMutation: vi.fn(() => [vi.fn(), {}]),
}));

describe("TasksComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: { profile: { email: "abc@test.com" } } as Partial<User>,
    } as ReturnType<typeof useAuth>);
  });

  it("should call useGetNotesQuery by initial render", async () => {
    const api = await import("../features/notes/notesApi");
    vi.mocked(useGetNotesQuery).mockReturnValue({
      data: mockNotes,
      error: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetNotesQuery>);

    render(
      <Provider store={store}>
        <TasksComponent />
      </Provider>,
    );

    expect(api.useGetNotesQuery).toHaveBeenCalled();
    expect(api.useGetNotesQuery).toHaveBeenCalledWith("abc@test.com", {
      skip: false,
    });
  });

  it("should render loading state", () => {
    vi.mocked(useGetNotesQuery).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useGetNotesQuery>);

    render(
      <Provider store={store}>
        <TasksComponent />
      </Provider>,
    );

    expect(screen.getByText("Ładowanie zadań...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { useGetNotesQuery } = await import("../features/notes/notesApi.ts");

    vi.mocked(useGetNotesQuery).mockReturnValue({
      data: undefined,
      error: { status: 500 },
      isLoading: false,
    } as unknown as ReturnType<typeof useGetNotesQuery>);

    render(
      <Provider store={store}>
        <TasksComponent />
      </Provider>,
    );

    expect(
      screen.getByText("Błąd podczas ładowania zadań"),
    ).toBeInTheDocument();
  });

  it("should render tasks component", () => {
    vi.mocked(useGetNotesQuery).mockReturnValue({
      data: mockNotes,
      error: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetNotesQuery>);

    render(
      <Provider store={store}>
        <TasksComponent />
      </Provider>,
    );

    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  it("should delete note on delete button click", async () => {
    const api = await import("../features/notes/notesApi");
    const deleteNoteTrigger = vi.fn();
    vi.mocked(api.useDeleteNoteMutation).mockReturnValue([
      deleteNoteTrigger,
      {},
    ] as unknown as ReturnType<typeof api.useDeleteNoteMutation>);

    vi.mocked(useGetNotesQuery).mockReturnValue({
      data: mockNotes,
      error: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useGetNotesQuery>);

    render(
      <Provider store={store}>
        <TasksComponent />
      </Provider>,
    );

    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /Usun/i });

    await user.click(deleteButtons[0]!);

    expect(deleteNoteTrigger).toHaveBeenCalledWith(mockNotes[0]!.id);
  });

  it("should add note on form submit", async () => {
    const api = await import("../features/notes/notesApi");

    const addNoteTrigger = vi.fn().mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });

    vi.mocked(api.useAddNoteMutation).mockReturnValue([
      addNoteTrigger,
      {},
    ] as unknown as ReturnType<typeof api.useAddNoteMutation>);

    render(
      <Provider store={store}>
        <TasksComponent />
      </Provider>,
    );

    const user = userEvent.setup();
    const input = screen.getByTestId("task-input");

    await user.type(input, "New Task");
    await user.keyboard("{Enter}");

    expect(addNoteTrigger).toHaveBeenCalledWith({
      title: "New Task",
      author: "abc@test.com",
    });
  });
});

/*
TODO:
1. Add tests for deleting all notes functionality.
2. Add tests for form validation (e.g., submitting empty input).
3. Add tests for edge cases, such as no notes available.
 */
