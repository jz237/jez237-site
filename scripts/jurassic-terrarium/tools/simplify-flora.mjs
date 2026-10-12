// Halves the triangle count of the planting meshes (meshoptimizer's simplifier, borders locked so frond
// outlines keep their shape). The ferns are drawn thousands of times, so this is most of the planting's
// GPU cost.   node tools/simplify-flora.mjs [ratio=0.5] [kind ...]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '../../../demos/jurassic-terrarium/models');
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const ratio = Number(process.argv[2] || 0.5);
const kinds = process.argv.slice(3).length ? process.argv.slice(3) : ['fern', 'fernlet', 'horsetail', 'treefern', 'cycad'];
const tris = (doc) => doc.getRoot().listMeshes().reduce((n, m) => n + m.listPrimitives().reduce((a, p) => a + (p.getIndices()?.getCount() ?? 0) / 3, 0), 0);
for (const k of kinds) {
  const path = join(dir, `${k}.glb`);
  const doc = await io.read(path);
  const before = tris(doc);
  await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.004, lockBorder: true }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(path, doc);
  console.log(`${k}: ${before} -> ${tris(doc)} triangles`);
}
