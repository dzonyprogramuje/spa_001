import { Button, Card, CardBody, Chip, Tooltip } from "@heroui/react";
import { Briefcase, Calendar, Clock, Trash2, User } from "lucide-react";
import {
  type Note,
  useDeleteNoteMutation,
} from "../features/notes/notesApi.ts";
import { useDateFormatter } from "@react-aria/i18n";

export const NotesComponent = ({ notes }: { notes: Note[] | undefined }) => {
  const formatter = useDateFormatter({
    dateStyle: "medium",
    timeStyle: "short",
  });
  const [deleteNote] = useDeleteNoteMutation();

  return (
    <div className="flex flex-col gap-4">
      {notes?.map((note) => (
        <Card key={note.id} shadow="sm" className="border-none">
          <CardBody className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Chip
                      startContent={
                        note.kind === "private" ? (
                          <User size={12} />
                        ) : (
                          <Briefcase size={12} />
                        )
                      }
                      variant="flat"
                      color={note.kind === "private" ? "primary" : "success"}
                      className="text-xs font-semibold"
                      radius="sm"
                      size="sm"
                    >
                      {note.kind}
                    </Chip>

                    <Chip
                      size="sm"
                      variant="flat"
                      radius="sm"
                      startContent={<Calendar size={14} />}
                      className="text-xs font-semibold"
                    >
                      Deadline: <b>{note.taskEnd}</b>
                    </Chip>
                  </div>

                  <div className="flex items-center gap-1 text-default-400">
                    <Clock size={12} />
                    <span className="text-tiny italic">
                      {formatter.format(new Date(note.taskCreated))}
                    </span>

                    <Tooltip
                      content="Remove this task"
                      color="danger"
                      closeDelay={0}
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        className="text-default-400 hover:text-danger min-w-unit-8"
                        onPress={() => deleteNote(note.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                <h4 className="text-lg font-bold">{note.title}</h4>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
