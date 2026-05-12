import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@shared",
        replacement: fileURLToPath(new URL("./src/shared", import.meta.url)),
      },
      {
        find: "@user",
        replacement: fileURLToPath(new URL("./src/user", import.meta.url)),
      },
      {
        find: "@admin",
        replacement: fileURLToPath(new URL("./src/admin", import.meta.url)),
      },
      {
        find: "@auth",
        replacement: fileURLToPath(new URL("./src/auth", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
