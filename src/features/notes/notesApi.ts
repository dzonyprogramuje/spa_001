import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Note {
  id: number;
  title: string;
  author: string;
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
    getNotes: builder.query<Note[], string>({
      query: (authorId) => `/notes?author=${authorId}`,
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
  }),
});

export const { useGetNotesQuery, useAddNoteMutation, useDeleteNoteMutation } =
  notesApi;
