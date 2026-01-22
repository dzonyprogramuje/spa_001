import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import "@testing-library/jest-dom";
import { afterEach, beforeAll, afterAll } from "vitest";
import { mockNotes } from "./src/features/notes/notesApi.test";

export const server = setupServer(
  http.delete("http://localhost:3001/notes/:id", () => {
    return new HttpResponse(undefined, { status: 204 });
  }),

  http.post("http://localhost:3001/notes", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...body, id: 1 });
  }),

  http.get("http://localhost:3001/notes", ({ request }) => {
    const url = new URL(request.url);
    const author = url.searchParams.get("author");
    const data = author
      ? mockNotes.filter((n) => n.author === author)
      : mockNotes;
    return HttpResponse.json(data, { status: 200 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
