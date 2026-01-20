import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: (headers) => {
      // TODO: dodasz token z OIDC później
      return headers;
    },
  }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      query: () => "/notes",
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
  }),
});

export const { useGetNotesQuery, useAddNoteMutation } = notesApi;
