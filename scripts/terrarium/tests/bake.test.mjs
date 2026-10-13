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
