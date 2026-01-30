import { Button, Card, CardBody, Chip, Input, Tooltip } from "@heroui/react";
import {
  Briefcase,
  Calendar,
  Clock,
  FilePenLine,
  Trash2,
  User,
} from "lucide-react";
import { useDateFormatter } from "@react-aria/i18n";
import {
  type Note,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@features/notes/notesApi.ts";
import { type FC, useState } from "react";

type TNoteComponent = {
  note: Note;
};
export const NoteComponent: FC<TNoteComponent> = ({ note }) => {
  const formatter = useDateFormatter({
    dateStyle: "medium",
    timeStyle: "short",
  });
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation();

  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(note.title);

  const toggleEditMode = () => {
    setIsEditMode((oldValue) => !oldValue);
    if (isEditMode) {
      handleEditSubmit().then();
    }
  };

  const handleFormSubmit = (e: React.FormEventHandler<HTMLFormElement>) => {
    handleEditSubmit().then();
    setIsEditMode(false);
  };

  const handleEditSubmit = async () => {
    const mutatedNote = { ...note, title: value };
    updateNote({ id: note.id, note: mutatedNote });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Card shadow="sm" className="border-none">
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
                  className={`text-xs font-semibold ${isEditMode && "blur-xs"}`}
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
                  className={`text-xs font-semibold ${isEditMode && "blur-xs"}`}
                >
                  Deadline: <b>{note.taskEnd}</b>
                </Chip>
              </div>

              <div className="flex items-center gap-1 text-default-400">
                <Clock size={12} />
                <span
                  className={`text-xs font-semibold ${isEditMode && "blur-xs"}`}
                >
                  {formatter.format(new Date(note.taskCreated))}
                </span>

                <Tooltip
                  content="Edit this task"
                  color="primary"
                  closeDelay={0}
                >
                  <Button
                    data-testid="edit"
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    className={`hover:text-primary ${isEditMode ? "text-primary" : "text-default-400"}`}
                    onPress={() => toggleEditMode()}
                  >
                    <FilePenLine size={18} />
                  </Button>
                </Tooltip>

                <Tooltip
                  content="Remove this task"
                  color="danger"
                  closeDelay={0}
                >
                  <Button
                    data-testid="remove"
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    className="text-default-400 hover:text-danger"
                    onPress={() => deleteNote(note.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </Tooltip>
              </div>
            </div>

            {isEditMode ? (
              <form onSubmit={handleFormSubmit}>
                <Input value={value} onChange={handleInputChange} />
              </form>
            ) : (
              <h4 className="text-lg font-bold">{note.title}</h4>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
