import test from 'node:test';
import assert from 'node:assert/strict';
import { TriangleBVH } from './src/fish/triangleBVH.mjs';

test('packed leaves cover each triangle once; refits enclose every moving vertex', () => {
  for (const count of [1, 4, 5, 17, 511]) {
    const p = Float32Array.from({ length: count * 9 }, (_, i) => Math.sin(i * 1.43));
    const indices = Uint32Array.from({ length: count * 3 }, (_, i) => i);
    const uv = new Float32Array(count * 6);
    const finUV = Float32Array.from({ length: count * 6 }, (_, i) => (i % 7) / 6);
    const b = new TriangleBVH(p, indices, uv, Array(count).fill(2), finUV);
    assert.equal(new Set(b.order).size, count);
    for (let i = 0; i < count; i++) {
      const t = b.order[i], side = (b.triOffset + count * 4 + i) * 4;
      for (let v = 0; v < 3; v++) {
        const packed = b.data[side + v], at = indices[t * 3 + v] * 2;
        assert.equal(Math.floor(packed / 4096) / 4095, Math.round(finUV[at] * 4095) / 4095);
        assert.equal((packed % 4096) / 4095, Math.round(finUV[at + 1] * 4095) / 4095);
      }
    }
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

test('the one-pass refit writes what a refit of the corners first, then each box axis by axis, writes', () => {
  // (The refit as first written, for the comparison.)
  const plain = (b, p) => {
    const d = Float32Array.from(b.data);
    for (let i = 0; i < b.order.length; i++) {
      const t = b.order[i], o = (b.triOffset + i * 4) * 4;
      for (let v = 0; v < 3; v++) for (let k = 0; k < 3; k++) d[o + v * 4 + k] = p[b.indices[t * 3 + v] * 3 + k];
    }
    for (let n = b.nodes.length - 1; n >= 0; n--) {
      const node = b.nodes[n], o = 4 + n * 8;
      for (let k = 0; k < 3; k++) {
        let lo = Infinity, hi = -Infinity;
        if (node.start >= 0) {
          for (let i = node.start; i < node.start + node.count; i++) {
            const t = (b.triOffset + i * 4) * 4;
            for (let v = 0; v < 3; v++) { lo = Math.min(lo, d[t + v * 4 + k]); hi = Math.max(hi, d[t + v * 4 + k]); }
          }
        } else {
          lo = Math.min(d[4 + (n + 1) * 8 + k], d[4 + node.right * 8 + k]);
          hi = Math.max(d[8 + (n + 1) * 8 + k], d[8 + node.right * 8 + k]);
        }
        d[o + k] = lo - 0.000001; d[o + 4 + k] = hi + 0.000001;
      }
    }
    return d;
  };
  const count = 777, verts = 500;
  const p = Float32Array.from({ length: verts * 3 }, (_, i) => Math.sin(i * 0.731));
  const indices = Uint32Array.from({ length: count * 3 }, (_, i) => (i * 7919 + (i % 3) * 13) % verts);
  const b = new TriangleBVH(p, indices, new Float32Array(verts * 2), Array(count).fill(1), null);
  for (let pose = 0; pose < 4; pose++) {
    // (Float64 positions too: the boxes hold the float32 corners as stored.)
    const q = (pose % 2 ? Float64Array : Float32Array).from(p, (x, i) => x * (1 + pose) + Math.cos(i * 0.37 + pose) * 0.1);
    const want = plain(b, q);
    b.refit(q);
    assert.deepEqual(new Uint32Array(b.data.buffer), new Uint32Array(want.buffer));
  }
});
