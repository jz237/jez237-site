// Integrity of the baked lizard and peaks.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', 'public');
const load = (dir, name) => {
  const json = JSON.parse(readFileSync(path.join(root, dir, `${name}.json`), 'utf8'));
  const bin = readFileSync(path.join(root, dir, json.file));
  const buf = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
  return {json, buf};
};

test('lizard mesh is finite, indexed in range and fully skinned', () => {
  const {json, buf} = load('lizard', 'lizard');
  const V = json.vertexCount;
  const pos = new Float32Array(buf, json.offsets.position, V * 3);
  const ji = new Uint8Array(buf, json.offsets.skinIndex, V * 4);
  const jw = new Uint8Array(buf, json.offsets.skinWeight, V * 4);
  const idx = new Uint32Array(buf, json.offsets.index, json.indexCount);
  assert.ok(V > 30000 && json.indexCount / 3 > 60000, 'detailed mesh');
  for (const v of pos) assert.ok(Number.isFinite(v));
  for (const i of idx) assert.ok(i < V);
  const used = new Set();
  for (let v = 0; v < V; v++) {
    let sum = 0;
    for (let k = 0; k < 4; k++) {
      sum += jw[v * 4 + k];
      assert.ok(ji[v * 4 + k] < json.bones.length);
      if (jw[v * 4 + k] > 20) used.add(ji[v * 4 + k]);
    }
    assert.equal(sum, 255, `weights of vertex ${v} sum to one`);
  }
  // every bone moves some skin (the gular, jaw, every digit, every tail joint)
  json.bones.forEach((b, i) => assert.ok(used.has(i), `bone ${b.name} has influence`));
});

test('lizard proportions are plausible for a 30 cm agamid', () => {
  const {json, buf} = load('lizard', 'lizard');
  const pos = new Float32Array(buf, json.offsets.position, json.vertexCount * 3);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxZ = 0;
  for (let i = 0; i < pos.length; i += 3) {
    minX = Math.min(minX, pos[i]); maxX = Math.max(maxX, pos[i]);
    minY = Math.min(minY, pos[i + 1]); maxZ = Math.max(maxZ, Math.abs(pos[i + 2]));
  }
  const length = maxX - minX;
  assert.ok(length > 27 && length < 31, `length ${length.toFixed(1)} cm`);
  assert.ok(minY > -0.05 && minY < 0.12, 'feet reach the ground plane in the bind pose');
  assert.ok(maxZ > 5 && maxZ < 7.5, 'sprawled limb span');
  // limbs: four with five digits each, bones in range
  assert.equal(json.limbs.length, 4);
  for (const l of json.limbs) {
    assert.equal(l.digits.length, 5);
    assert.ok(l.upperLength > 1.5 && l.lowerLength > 1);
  }
});

test('peaks are a closed, finite rock mesh standing inside the case', () => {
  const {json, buf} = load('peaks', 'peaks');
  const V = json.vertexCount;
  const pos = new Float32Array(buf, json.offsets.position, V * 3);
  const idx = new Uint32Array(buf, json.offsets.index, json.indexCount);
  let maxY = 0;
  for (let i = 0; i < pos.length; i += 3) {
    assert.ok(Number.isFinite(pos[i]) && Number.isFinite(pos[i + 1]) && Number.isFinite(pos[i + 2]));
    assert.ok(Math.abs(pos[i]) < 0.6 && Math.abs(pos[i + 2]) < 0.25 && pos[i + 1] < 0.66, 'inside the glass');
    maxY = Math.max(maxY, pos[i + 1]);
  }
  for (const i of idx) assert.ok(i < V);
  assert.ok(maxY > 0.42, 'the tallest peak rises well above the planting');
  assert.equal(json.ledges.length, 4, 'four cascade ledges');
  for (let i = 1; i < json.ledges.length; i++) assert.ok(json.ledges[i].top < json.ledges[i - 1].top, 'ledges step down');
});
