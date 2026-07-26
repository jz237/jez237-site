#!/usr/bin/env node

import { cp, mkdir, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workerDir = dirname(fileURLToPath(import.meta.url));
const sourceDir = resolve(
  workerDir,
  "../../games/2026-07-17/stunt-car-racer",
);
const outputDir = resolve(workerDir, process.argv[2] || ".assets");
const destination = resolve(
  outputDir,
  "games/2026-07-17/stunt-car-racer",
);

try {
  if ((await readdir(outputDir)).length > 0) {
    throw new Error(`Refusing to reuse non-empty asset directory: ${outputDir}`);
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

await mkdir(dirname(destination), { recursive: true });
await cp(sourceDir, destination, {
  recursive: true,
  preserveTimestamps: true,
});

console.log(`Staged Stunt Car Racer assets in ${outputDir}`);
