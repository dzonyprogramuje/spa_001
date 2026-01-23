import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useDeleteAllMutation,
} from "../features/notes/notesApi";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";

type FormFields = {
  taskInput: string;
};

export const TasksComponent = () => {
  const { user } = useAuth();
  const email = user?.profile.email as string;
  const {
    data: notes,
    error,
    isLoading,
  } = useGetNotesQuery(email, { skip: !email });

  const [deleteNote] = useDeleteNoteMutation();
  const [addNote] = useAddNoteMutation();
  const [deleteAllNotes] = useDeleteAllMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const handleAddNote = async (data: FormFields) => {
    try {
      await addNote({
        title: data?.taskInput,
        author: user?.profile.email,
      }).unwrap();
      reset();
    } catch (error) {
      console.error("Błąd dodawania notatki:", error);
    }
  };

  if (isLoading) {
    return <div>Ładowanie zadań...</div>;
  }

  if (error) {
    return <div>Błąd podczas ładowania zadań</div>;
  }

  return (
    <div className="flex w-1/2 mx-auto">
      <div className="flex flex-col gap-4 flex-1">
        <form onSubmit={handleSubmit(handleAddNote)}>
          <input
            data-testid="task-input"
            {...register("taskInput", {
              required: "Tresc nie moze byc pusta",
              minLength: {
                value: 3,
                message: "Tresc musi miec conajmniej 3 znaki",
              },
              maxLength: {
                value: 100,
                message: "Tresc moze miec maksymalnie 100 znakow",
              },
            })}
            disabled={isSubmitting}
            type="text"
            className="w-full rounded-md p-3 shadow-sm outline outline-gray-300 focus:outline-gray-400 disabled:outline-amber-200"
            placeholder="Input your task and press Enter"
          />
          {errors.taskInput && (
            <p className="text-red-600 mt-1">{errors.taskInput.message}</p>
          )}
        </form>

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
      <div className="flex px-8 rounded-md">
        <button
          disabled={!notes || notes.length === 0}
          onClick={() => deleteAllNotes(notes)}
          className="h-min text-white bg-red-600 px-12 py-3 hover:cursor-pointer hover:bg-red-700 rounded-md disabled:bg-gray-300 disabled:cursor-default"
        >
          Remove all
        </button>
      </div>
    </div>
  );
};
