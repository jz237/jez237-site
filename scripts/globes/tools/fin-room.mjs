// Measures the room the betta's fins keep round the driftwood and the rocks (src/render/scape/finRoom.mjs)
// on the pieces as made at full detail and at the phones' (0.5), and writes it into FIN_ROOM there.
// Run (from scripts/globes) after changing the wood or the rocks: node tools/fin-room.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildScapePieces } from '../src/render/scape/scene.mjs';
import { BED_LEVEL } from '../src/render/scape/mesh.mjs';
import { finCapsulesFrom } from '../src/render/scape/finRoom.mjs';

const file = fileURLToPath(new URL('../src/render/scape/finRoom.mjs', import.meta.url));
const lines = [];
for (const name of ['wood', 'rocks']) {
  const [full] = buildScapePieces({ detail: 1, only: [name] }), [low] = buildScapePieces({ detail: 0.5, only: [name] });
  // (Its own fin capsules are left out of what it measures from: only its solid cores.)
  const cores = full.obstacles.filter((o) => o.solid > 0);
  const positions = Float32Array.from([...full.meshes.flatMap((m) => [...m.positions]), ...low.meshes.flatMap((m) => [...m.positions])]);
  const caps = finCapsulesFrom(cores, positions, BED_LEVEL);
  lines.push(`  ${name}: [\n${caps.map((c) => `    [${[...c.a, ...c.b, c.fin].join(', ')}],`).join('\n')}\n  ],`);
  console.log(name, caps.length, 'fin capsules; widest beyond its core', Math.max(...caps.map((c, k) => c.fin)).toFixed(3));
}
const src = readFileSync(file, 'utf8').replace(/export const FIN_ROOM = \{[\s\S]*?\n\};/, `export const FIN_ROOM = {\n${lines.join('\n')}\n};`);
writeFileSync(file, src);
