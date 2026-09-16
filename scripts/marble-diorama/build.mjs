import { build } from "esbuild";
import { mkdir, copyFile, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const out = new URL(
  "../../games/2026-07-13/marble-madness/diorama/",
  import.meta.url,
);
await mkdir(out, { recursive: true });
await build({
  entryPoints: ["src/main.mjs"],
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2022",
  outfile: fileURLToPath(new URL("game.js", out)),
  legalComments: "linked",
});
for (const f of ["index.html", "style.css"])
  await copyFile(new URL("src/" + f, import.meta.url), new URL(f, out));
await writeFile(
  new URL("THIRD-PARTY-LICENSES.txt", out),
  `Three.js 0.186.0\n${await readFile("node_modules/three/LICENSE", "utf8")}\nRapier 0.20.0\n${await readFile("node_modules/@dimforge/rapier3d-compat/LICENSE", "utf8")}`,
);
console.log("Built locally bundled Three.js + Rapier:", fileURLToPath(out));
