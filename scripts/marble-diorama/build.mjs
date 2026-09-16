import { build } from "esbuild";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
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
await writeFile(
  new URL("style.css", out),
  (await readFile(new URL("src/style.css", import.meta.url), "utf8")).replace(/\r\n/g, "\n"),
);
let html = await readFile(new URL("src/index.html", import.meta.url), "utf8");
for (const asset of ["game.js", "style.css"]) {
  const bytes = await readFile(new URL(asset, out));
  const version = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
  html = html.replace(`"${asset}"`, `"${asset}?v=${version}"`);
}
await writeFile(new URL("index.html", out), html);
await writeFile(
  new URL("THIRD-PARTY-LICENSES.txt", out),
  `Three.js 0.186.0\n${await readFile("node_modules/three/LICENSE", "utf8")}\nRapier 0.20.0\n${await readFile("node_modules/@dimforge/rapier3d-compat/LICENSE", "utf8")}`,
);
console.log("Built locally bundled Three.js + Rapier:", fileURLToPath(out));
