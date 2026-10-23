import test from 'node:test';
import assert from 'node:assert/strict';
import { TriangleBVH } from './src/fish/triangleBVH.mjs';

test('packed leaves cover each triangle once; refits enclose every moving vertex', () => {
  for (const count of [1, 4, 5, 17, 511]) {
    const p = Float32Array.from({ length: count * 9 }, (_, i) => Math.sin(i * 1.43));
    const indices = Uint32Array.from({ length: count * 3 }, (_, i) => i);
    const uv = new Float32Array(count * 6);
    const b = new TriangleBVH(p, indices, uv, Array(count).fill(2));
    assert.equal(new Set(b.order).size, count);
    for (let pose = 0; pose < 3; pose++) {
      for (let i = 0; i < p.length; i++) p[i] = Math.sin(i * 1.43 + pose) * (pose + 1);
      b.refit(p);
      const d = b.data;
      for (let n = 0; n < b.nodes.length; n++) {
        const node = b.nodes[n], at = 4 + n * 8;
        assert.ok(node.escape > n && node.escape <= b.nodes.length);
        if (node.start < 0) continue;
        const packed = d[at + 7] - 1;
        assert.equal(Math.floor(packed / 4), node.start);
        assert.equal(packed % 4 + 1, node.count);
        for (let j = node.start; j < node.start + node.count; j++) {
          for (let v = 0; v < 3; v++) for (let k = 0; k < 3; k++) {
            const value = p[indices[b.order[j] * 3 + v] * 3 + k];
            assert.ok(value >= d[at + k] && value <= d[at + 4 + k]);
            assert.ok(value >= d[4 + k] && value <= d[8 + k]);
          }
        }
      }
    }
    assert.ok(dFinite(b.data));
  }
});
function dFinite(d) { return d.every(Number.isFinite); }
