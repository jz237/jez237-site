// Check the exported road's actual attributes against its authored data, without a GPU.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = fs.readFileSync(path.join(root, 'public/models/quarry-road-approach.glb'));
const authored = JSON.parse(fs.readFileSync(path.join(root, 'source/models/quarry-road-approach-data.json'), 'utf8')).surface;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'source/models/quarry-road-approach-manifest.json'), 'utf8'));
let gltf, binary;
assert.equal(file.readUInt32LE(0), 0x46546c67);
assert.equal(file.readUInt32LE(4), 2);
assert.equal(file.readUInt32LE(8), file.length);
for (let at = 12; at < file.length;) {
  const length = file.readUInt32LE(at), kind = file.readUInt32LE(at + 4);
  if (kind === 0x4e4f534a) gltf = JSON.parse(file.subarray(at + 8, at + 8 + length).toString());
  if (kind === 0x004e4942) binary = file.subarray(at + 8, at + 8 + length);
  at += length + 8;
}
const sha256 = createHash('sha256').update(file).digest('hex');
assert.equal(sha256, manifest.assets.find(asset => asset.file.endsWith('.glb')).sha256);
const formats = { 5120: [1, 'readInt8'], 5121: [1, 'readUInt8'], 5122: [2, 'readInt16LE'], 5123: [2, 'readUInt16LE'], 5125: [4, 'readUInt32LE'], 5126: [4, 'readFloatLE'] };
const widths = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
function values(index) {
  const access = gltf.accessors[index], view = gltf.bufferViews[access.bufferView];
  assert.ok(!access.sparse);
  const [bytes, read] = formats[access.componentType], width = widths[access.type];
  const stride = view.byteStride || bytes * width, offset = (view.byteOffset || 0) + (access.byteOffset || 0);
  const denominator = access.normalized ? ({ 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 })[access.componentType] : 1;
  return Array.from({ length: access.count }, (_, i) => Array.from({ length: width }, (_, j) => {
    const value = binary[read](offset + i * stride + j * bytes) / denominator;
    assert.ok(Number.isFinite(value));
    return value;
  }));
}
// Blender converts double authored coordinates to Float32, as does glTF.
const key = point => point.map(Math.fround).join(',');
const authoredByPoint = new Map();
for (let i = 0; i < authored.positions.length / 3; i++) {
  const position = authored.positions.slice(i * 3, i * 3 + 3);
  const row = { position, uv: authored.uv.slice(i * 2, i * 2 + 2), color: authored.colors.slice(i * 4, i * 4 + 4) };
  const k = key(position);
  if (!authoredByPoint.has(k)) authoredByPoint.set(k, []);
  authoredByPoint.get(k).push(row);
}
const meshes = new Map(), report = { sha256, bytes: file.length, meshCount: 0, images: gltf.images?.length ?? 0, meshes: [], errors: [] };
const check = (condition, message) => { if (!condition) report.errors.push(message); };
check(report.images === 0 && !gltf.textures?.length, 'Road GLB embeds textures');
for (const node of gltf.nodes) {
  for (const [name, identity] of Object.entries({ translation: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1], matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] })) {
    check(!node[name] || node[name].every((v, i) => Math.abs(v - identity[i]) < 1e-7), `${node.name} has nonidentity ${name}`);
  }
  if (node.mesh === undefined) continue;
  const primitives = gltf.meshes[node.mesh].primitives;
  check(primitives.length === 1, `${node.name} has extra material draws`);
  const primitive = primitives[0];
  for (const attr of ['POSITION', 'NORMAL', 'TEXCOORD_0', 'COLOR_0']) assert.ok(attr in primitive.attributes, `${node.name} missing ${attr}`);
  const attributes = Object.fromEntries(Object.entries(primitive.attributes).map(([name, index]) => [name, values(index)]));
  const triangles = values(primitive.indices).length / 3;
  check(triangles === manifest.meshes.find(mesh => mesh.name === node.name)?.triangles, `${node.name} triangle count differs from manifest`);
  const result = { name: node.name, vertices: attributes.POSITION.length, triangles, material: primitive.material };
  if (node.name === 'RoadLane' || node.name === 'RoadSkirt') {
    let maxUVError = 0, maxMaskError = 0, unmatched = 0;
    let coreMinCoverage = 1, endpointMaxCoverage = 0, endpoints = 0;
    const uvRange = [[Infinity, -Infinity], [Infinity, -Infinity]], maskRange = Array.from({ length: 3 }, () => [Infinity, -Infinity]);
    const points = new Map();
    for (let i = 0; i < attributes.POSITION.length; i++) {
      const position = attributes.POSITION[i], uv = [attributes.TEXCOORD_0[i][0], 1 - attributes.TEXCOORD_0[i][1]], color = attributes.COLOR_0[i];
      const candidates = authoredByPoint.get(key(position)) ?? [];
      const source = candidates.find(row => Math.abs(row.uv[0] - uv[0]) < .0001 && Math.abs(row.uv[1] - uv[1]) < .0001);
      if (!source) unmatched++;
      else {
        maxUVError = Math.max(maxUVError, ...uv.map((v, j) => Math.abs(v - source.uv[j])));
        maxMaskError = Math.max(maxMaskError, ...color.slice(0, 3).map((v, j) => Math.abs(v - source.color[j])));
      }
      uv.forEach((v, j) => { uvRange[j][0] = Math.min(uvRange[j][0], v); uvRange[j][1] = Math.max(uvRange[j][1], v); });
      color.slice(0, 3).forEach((v, j) => { maskRange[j][0] = Math.min(maskRange[j][0], v); maskRange[j][1] = Math.max(maskRange[j][1], v); });
      if (uv[0] < .0001 || uv[0] > manifest.lengthMetres - .0001) { endpoints++; endpointMaxCoverage = Math.max(endpointMaxCoverage, color[0]); }
      // Original half-cell vertices interpolate the 5m fade up to the following
      // row; test the core after6m rather than misclassifying that final fade row.
      if (node.name === 'RoadLane' && uv[0] >= 6 && uv[0] <= manifest.lengthMetres - 6) coreMinCoverage = Math.min(coreMinCoverage, color[0]);
      points.set(key(position), { uv, color, normal: attributes.NORMAL[i] });
    }
    check(unmatched === 0, `${node.name}: ${unmatched} exported positions/UVs do not match authored source`);
    check(maxMaskError < .0001, `${node.name}: color masks changed in export by ${maxMaskError}`);
    check(endpointMaxCoverage < .0001 && endpoints > 0, `${node.name}: endpoints fail to expose old base material`);
    if (node.name === 'RoadLane') check(coreMinCoverage > .9999, 'Lane core coverage is not one');
    check(maskRange.every(([min, max]) => min >= 0 && max <= 1), `${node.name}: masks outside0..1`);
    Object.assign(result, { maxUVError, maxMaskError, unmatched, endpoints, endpointMaxCoverage, coreMinCoverage, uvRange, maskRange });
    meshes.set(node.name, points);
  }
  report.meshes.push(result);
}
report.meshCount = report.meshes.length;
check(report.meshCount === 6, `Expected6 meshes, got${report.meshCount}`);
const lane = meshes.get('RoadLane'), skirt = meshes.get('RoadSkirt');
let shared = 0, coreShared = 0, maxMaskGap = 0, maxUVGap = 0, maxNormalGap = 0, joinCoreMinCoverage = 1;
for (const [position, a] of lane) {
  const b = skirt.get(position);
  if (!b) continue;
  shared++;
  maxUVGap = Math.max(maxUVGap, ...a.uv.map((v, i) => Math.abs(v - b.uv[i])));
  maxMaskGap = Math.max(maxMaskGap, ...a.color.map((v, i) => Math.abs(v - b.color[i])));
  maxNormalGap = Math.max(maxNormalGap, Math.hypot(...a.normal.map((v, i) => v - b.normal[i])));
  if (a.uv[0] >= 5.01 && a.uv[0] <= manifest.lengthMetres - 5.01) { coreShared++; joinCoreMinCoverage = Math.min(joinCoreMinCoverage, a.color[0], b.color[0]); }
}
report.join = { shared, coreShared, joinCoreMinCoverage, maxUVGap, maxMaskGap, maxNormalGap };
check(shared > 100 && coreShared > 100, 'No continuous lane/skirt shared border');
check(joinCoreMinCoverage > .9999, 'Lane/skirt join exposes differing base materials inside core');
// Blender's custom-normal encoding introduces ~.008deg variation across copies;
// .0002 vector distance remains below .012deg and catches a meaningful seam.
check(maxUVGap < .0001 && maxMaskGap < .0001 && maxNormalGap < .0002, 'Lane/skirt join has an attribute mismatch');
report.status = report.errors.length ? 'failed' : 'passed';
const output = path.join(root, 'outputs/road-material-cpu');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'asset-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exitCode = 1;
