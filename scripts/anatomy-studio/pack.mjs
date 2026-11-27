/**
 * Pack the model files for the web: smaller normals, then gzip.
 *
 *   node pack.mjs            for every file in manifest.json (and its detail tier): assets/x.glb -> assets/x.glb.gz
 *
 * Two savings, neither visible:
 *   1. Normals are stored with meshopt's octahedral filter at 10 bits (the same precision prepare.mjs quantizes them
 *      to) instead of as plain 10-bit components. The filtered values compress far better. Only the normal buffers
 *      change: every other buffer keeps its exact bytes, so positions, indices and piece names are untouched.
 *   2. The result is gzipped. Cloudflare does not compress model/gltf-binary on the way out, so without this the
 *      models (over half the bytes of a visit) travel raw; the studio unzips them with the browser's own
 *      DecompressionStream as they arrive (studio.js, fetchModel).
 * Together they roughly halve the download. Run after prepare.mjs (which writes the .glb files and manifest.json),
 * then stamp.mjs. The .glb files are not kept: the .glb.gz files are what the studio loads.
 */
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEMO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../demos/anatomy-studio');
const BITS = 10;
await MeshoptEncoder.ready; await MeshoptDecoder.ready;

function repack(glb) {
  if (glb.readUInt32LE(0) !== 0x46546c67) throw new Error('not a glb');
  const jsonLength = glb.readUInt32LE(12), json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'));
  const binStart = 20 + jsonLength + 8, bin = glb.subarray(binStart, binStart + glb.readUInt32LE(20 + jsonLength));
  // which buffer views hold normals
  const normalViews = new Set();
  for (const mesh of json.meshes || []) for (const prim of mesh.primitives) if (prim.attributes.NORMAL !== undefined) normalViews.add(json.accessors[prim.attributes.NORMAL].bufferView);
  const pieces = []; let offset = 0, changed = 0;
  for (const [i, view] of json.bufferViews.entries()) {
    const ext = view.extensions?.EXT_meshopt_compression;
    const source = ext ? bin.subarray(ext.byteOffset || 0, (ext.byteOffset || 0) + ext.byteLength) : bin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength);
    let bytes = source;
    if (ext && normalViews.has(i) && ext.mode === 'ATTRIBUTES' && !ext.filter && ext.byteStride === 8) {
      const accessor = json.accessors.find(a => a.bufferView === i);
      if (accessor.componentType !== 5122 || !accessor.normalized) throw new Error(`view ${i}: normals are not normalized shorts`);
      const raw = new Uint8Array(ext.count * 8); MeshoptDecoder.decodeGltfBuffer(raw, ext.count, 8, source, ext.mode);
      const shorts = new Int16Array(raw.buffer), floats = new Float32Array(ext.count * 4);
      for (let v = 0; v < ext.count; v++) for (let c = 0; c < 3; c++) floats[v * 4 + c] = Math.max(shorts[v * 4 + c] / 32767, -1);
      const filtered = MeshoptEncoder.encodeFilterOct(floats, ext.count, 8, BITS);
      bytes = Buffer.from(MeshoptEncoder.encodeGltfBuffer(filtered, ext.count, 8, 'ATTRIBUTES'));
      ext.filter = 'OCTAHEDRAL'; changed++;
    }
    while (offset % 4) { pieces.push(Buffer.alloc(1)); offset++; }
    if (ext) { ext.byteOffset = offset; ext.byteLength = bytes.length; } else { view.byteOffset = offset; }
    pieces.push(Buffer.from(bytes)); offset += bytes.length;
  }
  while (offset % 4) { pieces.push(Buffer.alloc(1)); offset++; }
  // buffer 0 is the glb's own binary chunk; the meshopt fallback buffer has no data of its own
  const own = json.buffers.findIndex(b => b.uri === undefined && !b.extensions?.EXT_meshopt_compression?.fallback);
  json.buffers[own].byteLength = offset;
  let text = Buffer.from(JSON.stringify(json), 'utf8'); text = Buffer.concat([text, Buffer.alloc((4 - text.length % 4) % 4, 0x20)]);
  const header = Buffer.alloc(12), jsonHead = Buffer.alloc(8), binHead = Buffer.alloc(8);
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + text.length + 8 + offset, 8);
  jsonHead.writeUInt32LE(text.length, 0); jsonHead.writeUInt32LE(0x4e4f534a, 4); binHead.writeUInt32LE(offset, 0); binHead.writeUInt32LE(0x004e4942, 4);
  return { glb: Buffer.concat([header, jsonHead, text, binHead, ...pieces]), changed };
}

const manifestPath = path.join(DEMO, 'manifest.json'), manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
let before = 0, after = 0;
for (const entry of manifest.files.flatMap(f => [f, f.hi].filter(Boolean))) {
  const glbPath = entry.path.replace(/\.gz$/, '');
  if (!existsSync(path.join(DEMO, glbPath))) { console.log(`${entry.path}: already packed`); continue; }
  const input = readFileSync(path.join(DEMO, glbPath)), { glb, changed } = repack(input), packed = gzipSync(glb, { level: 9 });
  writeFileSync(path.join(DEMO, `${glbPath}.gz`), packed); unlinkSync(path.join(DEMO, glbPath));
  entry.path = `${glbPath}.gz`; entry.bytes = packed.length;
  before += input.length; after += packed.length;
  console.log(`${glbPath}: ${input.length} -> ${glb.length} (${changed} normal buffers) -> gzip ${packed.length}`);
}
manifest.stats.bytes = manifest.files.reduce((n, f) => n + f.bytes + (f.hi?.bytes || 0), 0);
writeFileSync(manifestPath, JSON.stringify(manifest));
if (before) console.log(`total ${before} -> ${after} bytes (${Math.round((1 - after / before) * 100)}% smaller)`);
