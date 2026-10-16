// Puts a species' rebaked skin (blender/bake_detail.py) into its finished GLB, leaving the mesh, rig and
// animation exactly as they were: the skin material's base colour and normal map images are replaced.
//
//   node tools/swap-skin.mjs <species> [--from <dir>]   (default dir: ~/.cache/jurassic-terrarium/work/<sp>/tex)
// expects albedo_detail.webp and normal_detail.webp there.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sp = process.argv[2];
if (!sp) throw new Error('usage: swap-skin.mjs <species>');
const fi = process.argv.indexOf('--from');
const src = fi > 0 ? process.argv[fi + 1] : join(homedir(), '.cache/jurassic-terrarium/work', sp, 'tex');
const path = join(here, '../../../demos/jurassic-terrarium/models', `${sp}.glb`);
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(path);
const before = statSync(path).size;
let done = 0;
for (const m of doc.getRoot().listMaterials()) {
  if (!/_skin(\.\d+)?$/.test(m.getName())) continue;
  const col = m.getBaseColorTexture(), nrm = m.getNormalTexture();
  if (col) col.setImage(readFileSync(join(src, 'albedo_detail.webp'))).setMimeType('image/webp');
  if (nrm) nrm.setImage(readFileSync(join(src, 'normal_detail.webp'))).setMimeType('image/webp');
  done += !!col + !!nrm;
}
if (!done) throw new Error(`no skin material in ${sp}.glb`);
await io.write(path, doc);
console.log(`${sp}.glb: ${done} images swapped, ${(before / 1024) | 0} -> ${(statSync(path).size / 1024) | 0} KB`);
