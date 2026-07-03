import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Builds straight into the deployed ../stock-market directory. emptyOutDir is
// off so data/, favicon.svg, icons.svg, and the standalone root scripts
// survive; stale hashed bundles are removed here instead.
function cleanHashedAssets() {
  return {
    name: "clean-hashed-assets",
    buildStart() {
      const assetsDir = path.resolve(__dirname, "../stock-market/assets");
      if (!fs.existsSync(assetsDir)) return;
      for (const file of fs.readdirSync(assetsDir)) {
        if (/^index-[\w-]+\.(js|css)$/.test(file)) {
          fs.rmSync(path.join(assetsDir, file));
        }
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), cleanHashedAssets()],
  build: {
    outDir: "../stock-market",
    emptyOutDir: false,
  },
});
