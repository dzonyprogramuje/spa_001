import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  resolve: {
    alias: {
      "@components": fileURLToPath(
        new URL("./src/components/index.ts", import.meta.url),
      ),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@store": fileURLToPath(new URL("./src/store", import.meta.url)),
      "@providers": fileURLToPath(new URL("./src/providers", import.meta.url)),
      "@router": fileURLToPath(
        new URL("./src/router/index.tsx", import.meta.url),
      ),
    },
  },
  plugins: [react(), tailwindcss()],
});
