import { defineConfig } from "vite";
import { resolve } from "node:path";
export default defineConfig({
  base: "./",
  build: {
    outDir: resolve(
      import.meta.dirname,
      "../../games/2026-05-30/subway-siege/ironline",
    ),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    target: "es2022",
  },
});
