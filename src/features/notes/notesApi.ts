import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Note {
  id: number;
  title: string;
  author: string;
  kind: "private" | "work";
  taskCreated: string;
  taskEnd: string;
}

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: (headers) => {
      // TODO: add auth token if needed later
      return headers;
    },
  }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], { email: string; selectedTab: string }>({
      query: ({ email, selectedTab }) =>
        `/notes?author=${email}&kind=${selectedTab !== "all" ? selectedTab : ""}`,
      providesTags: ["Notes"],
    }),
    addNote: builder.mutation<Note, Partial<Note>>({
      query: (note) => ({
        url: "/notes",
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNote: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteAll: builder.mutation<void, Note[] | undefined>({
      queryFn: async (notes, _queryApi, _extraOptions, fetchWithBQ) => {
        if (!notes || notes.length === 0) {
          return { data: undefined };
        }

        try {
          await Promise.all(
            notes.map((note) =>
              fetchWithBQ({
                url: `/notes/${note.id}`,
                method: "DELETE",
              }),
            ),
          );
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNoteMutation,
  useDeleteNoteMutation,
  useDeleteAllMutation,
} = notesApi;
