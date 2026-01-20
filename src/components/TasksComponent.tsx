import { useGetNotesQuery } from "../features/notes/notesApi";

export const TasksComponent = () => {
  const { data: notes, error, isLoading } = useGetNotesQuery();

  if (isLoading) {
    return <div>Ładowanie zadań...</div>;
  }

  if (error) {
    return <div>Błąd podczas ładowania zadań</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-1/2 mx-auto gap-4">
      {notes?.map((note) => (
        <div
          className="flex flex-col gap-2 border border-gray-300 px-2 py-6 rounded-xs"
          key={note.id}
        >
          <h2 className="font-bold">{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};
