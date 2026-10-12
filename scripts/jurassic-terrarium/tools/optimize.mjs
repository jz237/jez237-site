// Shrinks the exported GLBs for the web: dedupes and prunes, resamples the baked animation curves,
// then compresses geometry and animation with EXT_meshopt_compression (decoded in dinos.js by
// three's MeshoptDecoder). Textures are already WebP from the Blender exporter.
//
//   node tools/optimize.mjs [model ...]     (default: every .glb in demos/jurassic-terrarium/models)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, prune, resample, meshopt, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '../../../demos/jurassic-terrarium/models');
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

const names = process.argv.slice(2);
const files = (names.length ? names.map((n) => `${n}.glb`) : readdirSync(dir).filter((f) => f.endsWith('.glb')));
for (const f of files) {
  const path = join(dir, f);
  const before = statSync(path).size;
  const doc = await io.read(path);
  if (doc.getRoot().listExtensionsUsed().some((e) => e.extensionName === 'EXT_meshopt_compression')) {
    console.log(`${f}: already compressed`);
    continue;
  }
  await doc.transform(dedup(), prune(), resample({ tolerance: 1e-4 }), weld(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(path, doc);
  const after = statSync(path).size;
  console.log(`${f}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}
