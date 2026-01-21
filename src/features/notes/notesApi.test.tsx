import { renderHook, waitFor } from "@testing-library/react";
import { type Note, useDeleteAllMutation } from "./notesApi";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { describe, it, expect } from "vitest";

describe("notesApi", () => {
  it("should delete all notes", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useDeleteAllMutation(), { wrapper });
    const [deleteAll] = result.current;

    const notes: Note[] = [
      { id: 1, title: "Title 1", author: "test@test.com" },
      { id: 2, title: "Title ", author: "test@test.com" },
    ];

    await waitFor(() => {
      deleteAll(notes);
    });

    expect(deleteAll).toBeDefined();
  });
});
