import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import "@testing-library/jest-dom";
import { afterEach, beforeAll, afterAll } from "vitest";

export const server = setupServer(
  http.delete("/api/notes/:id", () => {
    return HttpResponse.json(null, { status: 204 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
