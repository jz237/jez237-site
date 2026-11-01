import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: { outDir: "../../demos/betta-atelier", emptyOutDir: true },
  // (The colour varieties are the Betta Bowl's own: ../globes/src/fish.)
  server: { fs: { allow: ["..", "../globes"] } },
});
