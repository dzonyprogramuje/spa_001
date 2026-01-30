import { type Note } from "../features/notes/notesApi.ts";
import { NoteComponent } from "@components";

export const NotesComponent = ({ notes }: { notes: Note[] | undefined }) => {
  return (
    <div className="flex flex-col gap-4">
      {notes?.map((note) => (
        <NoteComponent note={note} key={note.id} />
      ))}
    </div>
  );
};
