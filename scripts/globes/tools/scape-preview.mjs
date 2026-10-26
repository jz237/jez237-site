// Renders the betta bowl's furnishings (src/render/scape/*.mjs) offline with Blender, to see them
// while building them: each module's build() is written out as OBJ and rendered in a stand-in of
// the bowl (its sand bed, optionally its glass) from a few viewpoints.
//
//   node tools/scape-preview.mjs <out-dir> <module.mjs>... [--views front,three,top,side,app]
//        [--glass] [--samples 64] [--size 1000x800]
//
// Writes <out-dir>/scape.obj and <out-dir>/<view>.png (and prints each mesh's triangle count and
// checkMesh's findings). Blender: BLENDER, else C:/Program Files/Blender Foundation/Blender 5.2.

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BED_LEVEL, BED_RADIUS, MAT, checkMesh } from '../src/render/scape/mesh.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
};
const views = opt('--views', 'front,three,top');
const samples = opt('--samples', '64');
const size = opt('--size', '1000x800');
const glass = flag('--glass');
const [outDir, ...modules] = args;
if (!outDir || !modules.length) {
  console.error('usage: node tools/scape-preview.mjs <out-dir> <module.mjs>... [--views ...] [--glass]');
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });

const lines = ['mtllib scape.mtl'];
let base = 1;
let total = 0;
for (const m of modules) {
  const mod = await import(pathToFileURL(resolve(m)).href);
  const piece = mod.build();
  for (const mesh of piece.meshes) {
    const problems = checkMesh(mesh);
    const tris = mesh.indices.length / 3;
    total += tris;
    console.log(`${mesh.name}: ${tris} triangles, ${mesh.positions.length / 3} vertices${problems.length ? ' -- ' + problems.join('; ') : ''}`);
    lines.push(`o ${mesh.name}`);
    const vc = mesh.positions.length / 3;
    for (let v = 0; v < vc; v++) {
      const ao = mesh.attrs[v * 4 + 3];
      lines.push(`v ${mesh.positions[v * 3].toFixed(5)} ${mesh.positions[v * 3 + 1].toFixed(5)} ${mesh.positions[v * 3 + 2].toFixed(5)} ${ao.toFixed(3)} ${ao.toFixed(3)} ${ao.toFixed(3)}`);
    }
    for (let v = 0; v < vc; v++) lines.push(`vn ${mesh.normals[v * 3].toFixed(4)} ${mesh.normals[v * 3 + 1].toFixed(4)} ${mesh.normals[v * 3 + 2].toFixed(4)}`);
    let current = -1;
    for (let t = 0; t < tris; t++) {
      const mat = mesh.materials[t];
      if (mat !== current) {
        lines.push(`usemtl mat_${mat}`);
        current = mat;
      }
      const [a, b, c] = [mesh.indices[t * 3] + base, mesh.indices[t * 3 + 1] + base, mesh.indices[t * 3 + 2] + base];
      lines.push(`f ${a}//${a} ${b}//${b} ${c}//${c}`);
    }
    base += vc;
  }
  if (piece.obstacles?.length) console.log(`${m}: ${piece.obstacles.length} obstacles`);
}
console.log(`total: ${total} triangles`);
const obj = resolve(outDir, 'scape.obj');
writeFileSync(obj, lines.join('\n') + '\n');
writeFileSync(resolve(outDir, 'scape.mtl'), Array.from({ length: Math.max(...Object.values(MAT)) + 1 }, (_, i) => `newmtl mat_${i}\nKd 0.8 0.8 0.8\n`).join('\n'));

const blender = process.env.BLENDER ?? 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe';
execFileSync(blender, ['-b', '--factory-startup', '-P', resolve(here, 'scape_render.py'), '--', obj, resolve(outDir), views, glass ? '1' : '0', samples, size, String(BED_LEVEL), String(BED_RADIUS)], { stdio: ['ignore', 'ignore', 'inherit'] });
for (const v of views.split(',')) console.log(resolve(outDir, `${v}.png`));
