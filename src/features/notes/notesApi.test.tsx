import { renderHook, waitFor } from "@testing-library/react";
import {
  type Note,
  useDeleteAllMutation,
  useGetNotesQuery,
  useAddNoteMutation,
  useDeleteNoteMutation,
} from "./notesApi";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { describe, it, expect } from "vitest";
import { act } from "react";

const email = "test@test.com";
const selectedTab = "all";

export const mockNotes: Note[] = [
  {
    id: 1,
    title: "Title 1",
    author: email,
    kind: "work",
    taskEnd: "2024-12-31",
    taskCreated: "2024-01-01T12:00:00.000Z",
  },
  {
    id: 2,
    title: "Title 2",
    author: email,
    kind: "work",
    taskEnd: "2024-12-31",
    taskCreated: "2024-01-01T12:00:00.000Z",
  },
];

vi.mock("@react-aria/i18n", () => ({
  useDateFormatter: () => ({
    format: () => "2024-01-01 12:00",
  }),
}));

describe("notesApi", () => {
  it("should delete a note", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useDeleteNoteMutation(), { wrapper });
    await act(async () => {
      await result.current[0](1);
    });

    await waitFor(() => {
      expect(result.current[1].isSuccess).toBe(true);
      expect(result.current[1].isLoading).toBe(false);
      expect(result.current[1].isError).toBe(false);
      expect(result.current[1].error).toBeUndefined();
      expect(result.current[1].data).toBeNull();
    });
  });

  it("should delete all notes", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useDeleteAllMutation(), { wrapper });
    await act(async () => {
      await result.current[0]([
        { id: 1, title: "Title 1", author: "test@test.com" },
        { id: 2, title: "Title 2", author: "test@test.com" },
      ] as Note[]);
    });

    await waitFor(() => {
      expect(result.current[1].isSuccess).toBe(true);
      expect(result.current[1].isLoading).toBe(false);
      expect(result.current[1].isError).toBe(false);
      expect(result.current[1].error).toBeUndefined();
      expect(result.current[1].data).toBeUndefined();
    });
  });

  it("should get all notes for author", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(
      () => useGetNotesQuery({ email, selectedTab }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeUndefined();
      expect(result.current.data).toEqual(mockNotes);
    });
  });

  it("should add new note", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useAddNoteMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current[0]({
        title: "Title",
        author: "test@test.com",
      } as Partial<Note>);
    });

    await waitFor(() => {
      expect(result.current[1].isSuccess).toBe(true);
      expect(result.current[1].isLoading).toBe(false);
      expect(result.current[1].isError).toBe(false);
      expect(result.current[1].error).toBeUndefined();
      expect(result.current[1].data).toEqual({
        title: "Title",
        author: "test@test.com",
        id: 1,
      });
    });
  });
});
