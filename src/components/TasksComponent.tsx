import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
} from "../features/notes/notesApi";
import { useAuth } from "react-oidc-context";
import { type ChangeEvent, type KeyboardEvent, useState } from "react";

export const TasksComponent = () => {
  const { user } = useAuth();
  const authorId = user?.profile.email as string;
  const {
    data: notes,
    error,
    isLoading,
  } = useGetNotesQuery(authorId, { skip: !authorId });

  const [deleteNote] = useDeleteNoteMutation();
  const [addNote] = useAddNoteMutation();
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddNote = async () => {
    if (inputValue.trim()) {
      try {
        await addNote({
          title: inputValue,
          author: user?.profile.email,
        }).unwrap();
        setInputValue("");
      } catch (error) {
        console.error("Błąd dodawania notatki:", error);
      }
    }
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // addNote({ title: inputValue, author: user?.profile.sid });
      await handleAddNote();
      setInputValue("");
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  if (isLoading) {
    return <div>Ładowanie zadań...</div>;
  }

  if (error) {
    return <div>Błąd podczas ładowania zadań</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-1/2 mx-auto gap-4">
      <input
        type="text"
        className="rounded-md p-3 shadow-sm outline outline-gray-300 focus:outline-gray-400"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
        placeholder="Input your task and press Enter"
      />
      {notes?.map((note) => (
        <div
          className="flex justify-between gap-2 px-6 py-4 rounded-md bg-white shadow-sm"
          key={note.id}
        >
          <div>
            <h2 className="font-bold">{note.title}</h2>
            <p>ID: {note.id}</p>
          </div>
          <button
            className="text-white bg-red-600 px-12 py-2 hover:cursor-pointer hover:bg-red-700 rounded-md"
            onClick={() => deleteNote(note.id)}
          >
            Usun
          </button>
        </div>
      ))}
    </div>
  );
};
