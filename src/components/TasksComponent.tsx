import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useDeleteAllMutation,
} from "../features/notes/notesApi";
import { useAuth } from "react-oidc-context";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  type CalendarDate,
  Card,
  CardBody,
  DatePicker,
  Input,
  Switch,
  Tab,
  Tabs,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

const schema = z.object({
  taskInput: z
    .string()
    .min(3, { message: "Tresc musi miec conajmniej 3 znaki" })
    .max(100, { message: "Tresc moze miec maksymalnie 100 znakow" }),
  taskEnd: z
    .any()
    .refine(
      (value: CalendarDate | null) => value !== null,
      "Prosze wybrac date",
    ),
  isWork: z.boolean(),
});

type FormFields = z.infer<typeof schema>;

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

  const formatter = useDateFormatter({
    dateStyle: "medium",
    timeStyle: "short",
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      taskInput: "",
      isWork: false,
      taskEnd: today(getLocalTimeZone()),
    },
  });

  const handleAddNote = async (data: FormFields) => {
    try {
      await addNote({
        title: data.taskInput,
        author: user?.profile.email,
        // taskCreated: today(getLocalTimeZone()).toString(),
        taskCreated: new Date().toISOString(),
        taskEnd: data.taskEnd.toString(),
        kind: data.isWork ? "work" : "private",
      }).unwrap();
      reset();
    } catch (error) {
      setError("taskInput", {
        message: "E R R O R: Nie mozna dodac notatki",
      });
      console.error("Błąd dodawania notatki:", error);
    }
  };

  if (isLoading) {
    return <div>Ładowanie zadań...</div>;
  }

  if (error) {
    return <div>Błąd podczas ładowania zadań</div>;
  }

  const renderNotes = (
    <div className="flex flex-col gap-4">
      {notes?.map((note) => (
        <Card
          key={note.id}
          className={`border-l-3 ${
            note.kind === "private"
              ? "border-primary-500"
              : "border-success-500"
          }`}
        >
          <CardBody>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-tiny uppercase font-bold">{note.kind}</p>
                <small className="text-default-500">
                  Created: {formatter.format(new Date(note.taskCreated))}
                </small>
                <p>Deadline: {note.taskEnd}</p>
                <h4 className="font-bold text-large">{note.title}</h4>
              </div>
              <Button color="danger" onPress={() => deleteNote(note.id)}>
                Remove
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex w-1/2 mx-auto gap-4">
      <div className="flex flex-col gap-4 flex-1">
        <Card>
          <CardBody className="flex flex-col gap-4">
            <form onSubmit={handleSubmit(handleAddNote)}>
              <Input
                isInvalid={!!errors.taskInput}
                errorMessage={errors?.taskInput && errors.taskInput.message}
                data-testid="task-input"
                {...register("taskInput")}
                disabled={isSubmitting}
                type="text"
                placeholder="Input your task and press Enter"
              />
            </form>

            <Controller
              name="taskEnd"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Task end date"
                  // HeroUI DatePicker potrzebuje onChange przekazanego bezpośrednio
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />

            <Controller
              name="isWork"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  size="sm"
                >
                  Work
                </Switch>
              )}
            />
          </CardBody>
        </Card>

        <Tabs aria-label="Options" className="flex" fullWidth>
          <Tab key="all" title="All tasks">
            {renderNotes}
          </Tab>
          <Tab key="private" title="Private">
            hoho private
          </Tab>
          <Tab key="work" title="Work">
            hoho work
          </Tab>
        </Tabs>
      </div>

      <div className="flex rounded-md">
        <Button
          color="danger"
          isDisabled={!notes || notes.length === 0}
          onPress={() => deleteAllNotes(notes)}
        >
          Remove all
        </Button>
      </div>
    </div>
  );
};

/*
TODO:
1. Adjust task end date callendar
2. adjust displaying date format
3. display task end date in tas too
4. implement filtering tasks in tabs


...


4. add edit task functionality


 */
