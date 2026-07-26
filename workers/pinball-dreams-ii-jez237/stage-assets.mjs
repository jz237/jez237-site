#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workerDir = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  await readFile(resolve(workerDir, "asset-manifest.json"), "utf8"),
);
const outputDir = resolve(workerDir, process.argv[2] || ".assets");
const basePath = "/games/2026-07-14/pinball-dreams-ii/";

if (existsSync(outputDir) && (await readdir(outputDir)).length > 0) {
  throw new Error(`Refusing to reuse non-empty asset directory: ${outputDir}`);
}

await mkdir(outputDir, { recursive: true });

function localPath(assetPath) {
  if (!assetPath.startsWith(basePath)) {
    throw new Error(`Asset is outside the Pinball route: ${assetPath}`);
  }
  return resolve(outputDir, assetPath.slice(basePath.length));
}

async function download(asset) {
  const destination = localPath(asset.path);
  const temporary = `${destination}.part`;
  await mkdir(dirname(destination), { recursive: true });

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(asset.url, {
        headers: { "user-agent": "jez237-site asset recovery" },
        redirect: "follow",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const digest = createHash("sha256").update(bytes).digest("hex");
      if (bytes.length !== asset.bytes || digest !== asset.sha256) {
        throw new Error(
          `hash/size mismatch (${bytes.length}, ${digest})`,
        );
      }
      await writeFile(temporary, bytes);
      await rename(temporary, destination);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`${asset.path}: ${lastError?.message || lastError}`);
}

const queue = [...manifest.assets];
const concurrency = 12;
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const asset = queue.shift();
      if (asset) await download(asset);
    }
  }),
);

await writeFile(
  resolve(outputDir, "_headers"),
  await readFile(resolve(workerDir, "assets-headers.txt")),
);

console.log(
  `Staged ${manifest.asset_count} verified assets (${manifest.total_bytes} bytes) in ${outputDir}`,
);
