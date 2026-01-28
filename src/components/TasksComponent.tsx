import {
  useAddNoteMutation,
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
  Spinner,
  Switch,
  Tab,
  Tabs,
  Tooltip,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

import { type Key, useState } from "react";
import { Plus } from "lucide-react";
import { NotesComponent } from "./NotesComponent.tsx";

const schema = z.object({
  taskInput: z
    .string()
    .min(3, { message: "Must be at least 3 characters long" })
    .max(100, { message: "Cannot exceed 100 characters" }),
  taskEnd: z
    .any()
    .refine(
      (value: CalendarDate | null) => value !== null,
      "Date field is required",
    ),
  isWork: z.boolean(),
});

type FormFields = z.infer<typeof schema>;
enum TabOptions {
  ALL = "all",
  PRIVATE = "private",
  WORK = "work",
}

export const TasksComponent = () => {
  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.ALL);

  const { user } = useAuth();
  const email = user?.profile.email as string;
  const {
    data: notes,
    error,
    isLoading,
  } = useGetNotesQuery({ email, selectedTab }, { skip: !email });

  const [addNote] = useAddNoteMutation();
  const [deleteAllNotes] = useDeleteAllMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,

    formState: { errors, isSubmitting, isValid },
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

  return (
    <div className="flex w-full max-w-5xl px-6 flex-col gap-4 flex-1 mx-auto">
      <Card shadow="sm">
        <CardBody>
          <h2 className="font-extrabold text-3xl mb-4">Create task</h2>
          <form onSubmit={handleSubmit(handleAddNote)}>
            <Input
              className="h-18"
              isInvalid={!!errors.taskInput}
              errorMessage={errors?.taskInput && errors.taskInput.message}
              data-testid="task-input"
              {...register("taskInput")}
              disabled={isSubmitting}
              type="text"
              placeholder="Input your task and press Enter"
              size="lg"
            />
          </form>

          <div className="flex justify-between">
            <Controller
              name="taskEnd"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-48"
                  {...field}
                  label="Task end date"
                  // HeroUI DatePicker potrzebuje onChange przekazanego bezpośrednio
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />

            <div className="flex justify-end items-center gap-4">
              <Controller
                name="isWork"
                control={control}
                render={({ field }) => (
                  <Tooltip
                    content="Is this task work related?"
                    color="primary"
                    closeDelay={50}
                  >
                    <Switch
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      size="sm"
                    >
                      Work
                    </Switch>
                  </Tooltip>
                )}
              />
              <Button
                color="primary"
                isDisabled={!isValid}
                endContent={<Plus size={18} />}
                onPress={handleSubmit(handleAddNote)}
                isLoading={isLoading}
              >
                Create task
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <Tabs
        fullWidth
        aria-label="Options"
        className="flex"
        size="lg"
        onSelectionChange={(key: Key) => setSelectedTab(key as TabOptions)}
      >
        <Tab key={TabOptions["ALL"]} title="All tasks">
          {isLoading ? <Spinner size="lg" /> : <NotesComponent notes={notes} />}
        </Tab>
        <Tab key={TabOptions["PRIVATE"]} title="Private">
          <NotesComponent notes={notes} />
        </Tab>
        <Tab key={TabOptions["WORK"]} title="Work">
          <NotesComponent notes={notes} />
        </Tab>
      </Tabs>

      <Button
        className="w-min"
        color="danger"
        isDisabled={!notes || notes.length === 0}
        onPress={() => deleteAllNotes(notes)}
        isLoading={isLoading}
        hidden={!notes || notes.length === 0}
      >
        Remove all
      </Button>
    </div>
  );
};

/*
TODO:
-> add edit task functionality
-> use enum for setSelectedTab
 */
