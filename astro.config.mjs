// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// No React. Nothing on this site needs a component framework — v1 shipped
// 187 KB of it to play a one-time intro that returned null on every later
// visit (REDESIGN-BRIEF defect #13). Astro islands + vanilla JS only.
export default defineConfig({
  site: "https://sempornaparadise.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  vite: {
    plugins: [tailwindcss()],
  },
});
