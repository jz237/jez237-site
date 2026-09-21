// Build the same original mesh for Cesium, without a runtime loader in Three.js.
import { shipGeometry } from '../src/ship-model.js';
import { writeFile } from 'node:fs/promises';
const mesh = shipGeometry(), buffers = [], bufferViews = [], accessors = [];
let offset = 0;
for (const [key, values] of Object.entries(mesh)) {
  const data = Buffer.from(new Float32Array(values).buffer);
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  values.forEach((v, i) => { min[i % 3] = Math.min(min[i % 3], v); max[i % 3] = Math.max(max[i % 3], v); });
  buffers.push(data); bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: data.length });
  accessors.push({ bufferView: accessors.length, componentType: 5126, count: values.length / 3,
    type: 'VEC3', ...(key === 'positions' ? { min, max } : {}) }); offset += data.length;
}
const bin = Buffer.concat(buffers);
const doc = { asset: { version: '2.0', generator: 'Philadelphia Relief original ship' },
  scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1, COLOR_0: 2 }, material: 0 }] }],
  materials: [{ doubleSided: true, pbrMetallicRoughness: { metallicFactor: .15, roughnessFactor: .65 } }],
  buffers: [{ byteLength: bin.length }], bufferViews, accessors };
const text = Buffer.from(JSON.stringify(doc)), json = Buffer.alloc(Math.ceil(text.length / 4) * 4, 32);
text.copy(json);
const header = Buffer.alloc(12); header.writeUInt32LE(0x46546c67); header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + json.length + bin.length, 8);
const chunk = (length, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(length); b.writeUInt32LE(type, 4); return b; };
await writeFile(new URL('../data/ship.glb', import.meta.url), Buffer.concat([
  header, chunk(json.length, 0x4e4f534a), json, chunk(bin.length, 0x004e4942), bin,
]));
