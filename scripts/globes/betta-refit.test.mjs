// The betta's BVH refitted on the GPU (src/fish/bettaRefit.mjs), checked through the kernels' CPU
// mirror against TriangleBVH.refit, which the GPU replaces each frame: a membrane-like sheet and a
// tube (two meshes, as the fish has several), bent into several poses. The plan visits every
// triangle and node once, each inner node after its children; the corners and every w word come
// out bit for bit; the boxes differ only by the padding's float32 rounding and still hold what they
// must; betta_trace's walk over either texture meets the same triangles.
// Run: node --test betta-refit.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { TriangleBVH } from './src/fish/triangleBVH.mjs';
import { bettaRefitPlan, bettaRefitUniform, refitCPU } from './src/fish/bettaRefit.mjs';

// A sheet of 48 x 24 quads and a tube of 40 x 16 round it.
const positions = [], indices = [];
const grid = (nu, nv, at) => {
  const o = positions.length / 3;
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) positions.push(...at(i / nu, j / nv));
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = o + i * (nv + 1) + j, b = a + nv + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
};
grid(48, 24, (u, v) => [u * 1.6 - 0.8, v * 0.9 - 0.2, 0.02 * Math.sin(u * 40) * v]);
grid(40, 16, (u, v) => [u * 1.2 - 0.7, 0.12 * Math.cos(v * Math.PI * 2), 0.09 * Math.sin(v * Math.PI * 2)]);
const rest = Float32Array.from(positions);
const V = rest.length / 3, T = indices.length / 3;
const uv = Float32Array.from({ length: V * 2 }, (_, i) => (i % 97) / 96);
const finUV = Float32Array.from({ length: V * 2 }, (_, i) => (i % 89) / 88);
const materials = Array.from({ length: T }, (_, t) => t % 5);

/** The sheet and tube bent and swept at time t (a swimming fish's kind of motion), as float32. */
const pose = (t) => {
  const p = new Float32Array(rest.length);
  for (let i = 0; i < V; i++) {
    const x = rest[i * 3], y = rest[i * 3 + 1], z = rest[i * 3 + 2];
    const bend = 0.3 * Math.sin(t * 2.1 + x * 3) * (x + 0.8);
    p[i * 3] = x * Math.cos(bend * 0.4) + 0.15 * t;
    p[i * 3 + 1] = y + 0.05 * Math.sin(t + x * 5);
    p[i * 3 + 2] = z + bend * 0.25 + 0.04 * Math.sin(t * 3 + y * 7);
  }
  return p;
};

/** betta_trace (bettaWGSL.ts) on the CPU, over a texture's floats: the closest hit's texel and t. */
function trace(d, ro, rd, end) {
  const N = d[0], triBase = d[1];
  const inv = rd.map((v) => 1 / (Math.abs(v) < 1e-8 ? 1e-8 : v));
  let node = 0, hitT = end, hit = -1;
  for (let steps = 0; steps < N && node < N; steps++) {
    const lo = (1 + node * 2) * 4, hi = (2 + node * 2) * 4;
    let tmin = 0, tmax = hitT;
    for (let k = 0; k < 3; k++) {
      const a = (d[lo + k] - ro[k]) * inv[k], b = (d[hi + k] - ro[k]) * inv[k];
      tmin = Math.max(tmin, Math.min(a, b));
      tmax = Math.min(tmax, Math.max(a, b));
    }
    if (!(tmin <= tmax)) { node = d[lo + 3]; continue; }
    if (d[hi + 3] < 0.5) { node++; continue; }
    const packed = d[hi + 3] - 1, start = Math.floor(packed / 4), count = (packed % 4) + 1;
    for (let j = 0; j < count; j++) {
      const at = triBase + (start + j) * 4;
      const A = [0, 1, 2].map((k) => d[at * 4 + k]);
      const e1 = [0, 1, 2].map((k) => d[(at + 1) * 4 + k] - A[k]), e2 = [0, 1, 2].map((k) => d[(at + 2) * 4 + k] - A[k]);
      const h = [rd[1] * e2[2] - rd[2] * e2[1], rd[2] * e2[0] - rd[0] * e2[2], rd[0] * e2[1] - rd[1] * e2[0]];
      const det = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
      if (Math.abs(det) < 1e-10) continue;
      const s = [0, 1, 2].map((k) => ro[k] - A[k]);
      const u = (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]) / det;
      const q = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]];
      const v = (rd[0] * q[0] + rd[1] * q[1] + rd[2] * q[2]) / det;
      const t = (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]) / det;
      if (u >= 0 && v >= 0 && u + v <= 1 && t > 0.00001 && t < hitT) { hitT = t; hit = at; }
    }
    node = d[lo + 3];
  }
  return { hit, hitT };
}

const bvh = new TriangleBVH(rest, Uint32Array.from(indices), uv, materials, finUV);
const plan = bettaRefitPlan(bvh, V);
const packed = Float32Array.from(bvh.data);

test('the plan visits every triangle and node once, each inner node after its children', () => {
  const M = bvh.nodes.length, N = bvh.order.length, R = plan.records;
  assert.equal(plan.leafCount + plan.innerCount, M);
  const slot = new Uint8Array(N), node = new Uint8Array(M), done = new Uint8Array(M);
  for (let r = 0; r < plan.leafCount; r++) {
    const [n, start, count] = R.subarray(r * 4, r * 4 + 3);
    assert.ok(count >= 1 && count <= 4);
    node[n]++;
    done[n] = 1;
    for (let i = start; i < start + count; i++) slot[i]++;
  }
  assert.ok(slot.every((x) => x === 1));
  let depth = Infinity;
  for (let l = 0; l < plan.levelCount; l++) {
    const at = (plan.leafCount + plan.innerCount + l) * 4, first = R[at], count = R[at + 1];
    assert.ok(plan.levels[l].depth < depth);
    depth = plan.levels[l].depth;
    // (Within a level the nodes are independent: their children are all done before it starts.)
    for (let r = first; r < first + count; r++) {
      const [n, right] = R.subarray((plan.leafCount + r) * 4, (plan.leafCount + r) * 4 + 2);
      assert.equal(right, bvh.rights[n]);
      assert.ok(done[n + 1] && done[right], `node ${n} before its children`);
      node[n]++;
    }
    for (let r = first; r < first + count; r++) done[R[(plan.leafCount + r) * 4]] = 1;
  }
  assert.ok(node.every((x) => x === 1));
  for (let i = 0; i < N; i++) for (let v = 0; v < 3; v++) assert.equal(plan.slots[i * 4 + v] * 3, bvh.corners[i * 3 + v]);
  assert.deepEqual([...bettaRefitUniform(plan)].slice(0, 6), [plan.leafCount, bvh.triOffset, plan.leafCount, plan.leafCount + plan.innerCount, plan.levelCount, N]);
});

test('the kernels write the corners and words bit for bit, the boxes within the padding\'s rounding', () => {
  const gpu = Float32Array.from(packed);
  let differ = 0, rays = 0, hits = 0;
  for (const t of [0, 0.7, 1.9, 3.3, 5.2]) {
    const p = pose(t);
    bvh.refit(p);
    refitCPU(gpu, plan, p);
    const cpu = bvh.data, A = new Uint32Array(cpu.buffer), B = new Uint32Array(gpu.buffer);
    // The header, the triangles' texels and the side table; every node's two w words.
    for (let i = 0; i < 4; i++) assert.equal(B[i], A[i]);
    for (let i = bvh.triOffset * 4; i < A.length; i++) assert.equal(B[i], A[i], `texel ${i >> 2}`);
    for (let n = 0; n < bvh.nodes.length; n++) {
      for (const at of [(1 + n * 2) * 4, (2 + n * 2) * 4]) {
        assert.equal(B[at + 3], A[at + 3]);
        for (let k = 0; k < 3; k++) {
          if (A[at + k] !== B[at + k]) differ++;
          assert.ok(Math.abs(cpu[at + k] - gpu[at + k]) < 1e-12);
        }
      }
      // A leaf's box holds its corners, a node's its children's boxes.
      const lo = (1 + n * 2) * 4, hi = (2 + n * 2) * 4, start = bvh.starts[n];
      for (let k = 0; k < 3; k++) {
        if (start >= 0) {
          for (let i = start; i < start + bvh.counts[n]; i++) for (let v = 0; v < 3; v++) {
            const x = gpu[(bvh.triOffset + i * 4 + v) * 4 + k];
            assert.ok(x > gpu[lo + k] && x < gpu[hi + k]);
          }
        } else {
          for (const c of [n + 1, bvh.rights[n]]) assert.ok(gpu[(1 + c * 2) * 4 + k] > gpu[lo + k] && gpu[(2 + c * 2) * 4 + k] < gpu[hi + k]);
        }
      }
    }
    // Rays from five directions over the root box: the same closest triangle at the same t.
    const lo = [0, 1, 2].map((k) => cpu[4 + k]), hi = [0, 1, 2].map((k) => cpu[8 + k]);
    for (const dir of [[0, 0, -1], [0.6, -0.3, -0.74], [0, -1, 0.0001], [-1, 0, 0.0001], [0.3, 0.5, 0.81]]) {
      const L = Math.hypot(...dir), rd = dir.map((v) => v / L);
      for (let i = 0; i < 32; i++) for (let j = 0; j < 32; j++) {
        const ro = [0, 1, 2].map((k) => lo[k] + (hi[k] - lo[k]) * [i / 31, j / 31, (i + j) / 62][k] - rd[k] * 2);
        const a = trace(cpu, ro, rd, 4), b = trace(gpu, ro, rd, 4);
        assert.equal(b.hit, a.hit);
        assert.equal(b.hitT, a.hitT);
        rays++;
        if (a.hit >= 0) hits++;
      }
    }
  }
  // (Only a few faces' last bits: the padding taken in float32.)
  assert.ok(differ < bvh.nodes.length * 6 * 5 * 0.01, `${differ} box faces differ`);
  assert.ok(hits > rays * 0.2);
});
