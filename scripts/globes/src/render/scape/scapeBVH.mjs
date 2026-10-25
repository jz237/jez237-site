// The betta bowl's furnishings traced as triangles (its page only): every triangle of every piece
// (wood.mjs, rocks.mjs, plants.mjs; their mesh format in mesh.mjs) in one static BVH, packed into a
// 1024-wide rgba32float texture the bowl's shader reads with textureLoad, like the betta's mesh
// (src/fish/triangleBVH.mjs). Built once at load (binned SAH); only the moving plants' triangles
// and the boxes over them are refitted in place, every frame (scapeRefit.mjs).
//
// The texture, in texels (rgba32float, row-major, 1024 a row; index i is at (i % 1024, i / 1024)).
// Every integer is stored as an exactly representable float (all stay below 2^24):
//   0          internal node count, triangle base texel, triangle count, the root's child word
//   1          the whole tree's box lo.xyz (padded), vertex base texel
//   2          its hi.xyz, vertex count
//   3          layout (2: the shader's), depth (root 0), leaf count, the first row's texel (0: none)
//   4 + 4k     internal node k (depth-first preorder): its two children's boxes, nearest-first
//              friendly (the parent holds them, so a node is read only when its box is met):
//                [lo0.xyz, word0] [hi0.xyz, word1] [lo1.xyz, 0] [hi1.xyz, 0]
//              A child word w >= 0 is an internal node's index; w < 0 is a leaf of the triangles
//              start .. start + count - 1 (count 1..4), -w - 1 = start * 4 + count - 1.
//   tb + 3t    triangle t (the leaves' order), its three corners as the mesh has them (shared
//              corners bit-identical, so the watertight test leaves no cracks):
//                [a.xyz, va * 8 + material] [b.xyz, vb] [c.xyz, vc]     (va, vb, vc: vertex ids)
//   vb + 2v    vertex v, for shading: [n.xyz, attrs.x] [attrs.yzw, 0]
//   rb + r     row r of what the shader reads alongside (packScape's rows: the bubble nest's, nest.mjs)
//
// (A second layout, 1, the betta's stackless escape-link preorder, two texels a node with its own
// box, is built only to measure it against layout 2 on the CPU: see scape-bvh.test.mjs. The shader
// reads layout 2 only.)
//
// Why this walk: on the real pieces (~377k triangles), per ray from the glass into the furnishings
// (CPU mirror, scape-bvh.test.mjs), the stackless walk visits 51 nodes and tests 9.1 triangles
// (132 texel loads); the short stack, nearest child first, reads 15.5 nodes (31 boxes) and tests 3.1
// triangles (74 loads). Shadow segments cost both about the same (~87 loads). Keeping each stack
// entry's distance saves another ~6% of loads but was slower on the GPU (a second private array);
// handling leaf children at once changed nothing. On an RTX 5090 (WebGPU in Chromium, 1M
// incoherent rays) the short stack ran 270-290 M nearest-hit rays/s against 180-230 M stackless.
// On the phones' pieces (detail 0.5: ~98k triangles, 20 deep), per walk of the bowl's own rays (a
// CPU model of the phone's camera through the bowl, 445k walks, those missing the whole box
// included), the short stack reads 8.3 nodes and 41 texels in 9.9 dependent rounds, its stack at
// most 11 deep. Walks without its array (every one the same nearest hit on 845k rays): a bit trail
// of the levels left to visit, climbing parent links on a pop, 46 texels in 15.3 rounds; the same
// re-descending from the root (Laine's restart trail), 52.5 in 21.4; escape links ordered by the
// ray's octant (eight layouts: eight times the node texels), 40 in 17.9. On a Radeon iGPU (RDNA 2,
// D3D12) the restart trail drew the phone's bowl in the same time as the stack, at every ratio.
//
// Triangles are met with Woop, Benthin & Wald's watertight test (2013) in f32: no ray aimed at a
// shared edge or corner of a closed mesh slips through (where f32 Moller-Trumbore with a 1e-6
// slack lets ~8% of such rays through from a unit or two away; see the test). The nearest-hit walk
// keeps a slack of 1e-6 of the triangle's scale on the edge functions (covering a fused multiply-add
// a rounding apart on the GPU); the shadow walk keeps none, and where an edge function is exactly 0
// (the ray runs exactly through an edge or a corner) only one of the triangles round it takes the
// ray (scape_meshOwns), so a leaf is darkened once there, not twice or six times (a dark speck).
//
// Bad rays: an origin or direction that is not finite (NaN or infinite), a zero direction, or a NaN
// tEnd is a miss at once, tested on the bits (scape_meshBad: a compiler may take floats as never
// NaN and drop x != x). Without it, the GPU's min and max drop a NaN operand, so the slab test let
// such a ray into every box: a walk of the whole tree (~235k steps on the real pieces, ~190 ms a
// warp). And no walk takes more than SCAPE_MAX_STEPS steps (nodes and leaves) whatever it is given:
// finite rays take at most a few hundred (see the test).

import { MAT, SCAPE_WGSL_COMMON } from './mesh.mjs';

export const SCAPE_TEX_WIDTH = 1024;
export const SCAPE_MAX_HEIGHT = 8192;
/** The tree is never deeper than this (root 0), so the shader's stack of this size cannot overflow. */
export const SCAPE_MAX_DEPTH = 32;
/** The most steps (an internal node or a leaf each) one walk takes, in the shader and the mirror. */
export const SCAPE_MAX_STEPS = 4096;
/** Nearest distance a hit counts at (ray origins sit on surfaces). */
export const SCAPE_T_MIN = 1e-5;
/** Light one leaf blade lets through (each LEAF_BIG / LEAF_SMALL triangle a shadow ray crosses). */
export const LEAF_PASS = [0.18, 0.3, 0.06];
/** A shadow ray's light is taken as gone once its brightest channel falls below this. */
export const SHADOW_CUTOFF = 2e-4;
/** Slack of the triangle test's edge functions (a share of the triangle's own scale). */
const EDGE_EPS = 1e-6;
const LEAF_MAX = 4;
const LAYOUT_STACKLESS = 1;
const LAYOUT_STACK = 2;
const FAR = 3.0e38;
const NONE = 0xffffffff;
/** World units every box grows by, each way (covers f32 rounding of the slab test). */
const BOX_PAD = 2e-6;

// ---- conservative rounding to f32 -----------------------------------------------------------
const f32b = new Float32Array(1);
const u32b = new Uint32Array(f32b.buffer);
/** The largest f32 <= x. */
function f32Down(x) {
  const y = Math.fround(x);
  if (y <= x) return y;
  f32b[0] = y;
  if (y > 0) u32b[0]--;
  else if (y === 0) return -1.401298464324817e-45;
  else u32b[0]++;
  return f32b[0];
}
/** The smallest f32 >= x. */
function f32Up(x) {
  return -f32Down(-x);
}

// ---- building ----------------------------------------------------------------------------------
/** Splits needed below a node of n triangles to reach leaves of LEAF_MAX by halving. */
function levels(n) {
  let l = 0;
  while (n > LEAF_MAX) {
    n = Math.ceil(n / 2);
    l++;
  }
  return l;
}

/**
 * A binned-SAH BVH over N boxes (box: min xyz, max xyz a triangle; cen: their centres). Leaves of
 * at most LEAF_MAX; no leaf deeper than maxDepth (where an SAH split would go deeper, the node is
 * halved at its median instead). idx: the triangles in leaf order; nodes in build order.
 */
function buildTree(box, cen, N, maxDepth, binsLarge, binsSmall) {
  const idx = new Uint32Array(N);
  for (let i = 0; i < N; i++) idx[i] = i;
  const cap = Math.max(1, 2 * N);
  const lo = new Float64Array(cap * 3), hi = new Float64Array(cap * 3);
  const left = new Int32Array(cap).fill(-1), right = new Int32Array(cap).fill(-1);
  const start = new Int32Array(cap), count = new Int32Array(cap), depthOf = new Int32Array(cap);
  let nodes = 1, depth = 0, leaves = 0, forced = 0;
  const NBM = Math.max(binsLarge, binsSmall);
  const bc = new Int32Array(3 * NBM);
  const bb = new Float64Array(3 * NBM * 6);
  const rArea = new Float64Array(NBM), rCount = new Int32Array(NBM);
  const tasks = [[0, 0, N, 0]];
  while (tasks.length) {
    const [node, s, e, d] = tasks.pop();
    depthOf[node] = d;
    if (d > depth) depth = d;
    let lx = Infinity, ly = Infinity, lz = Infinity, hx = -Infinity, hy = -Infinity, hz = -Infinity;
    let cx0 = Infinity, cy0 = Infinity, cz0 = Infinity, cx1 = -Infinity, cy1 = -Infinity, cz1 = -Infinity;
    for (let i = s; i < e; i++) {
      const t = idx[i], b = t * 6, c = t * 3;
      if (box[b] < lx) lx = box[b];
      if (box[b + 1] < ly) ly = box[b + 1];
      if (box[b + 2] < lz) lz = box[b + 2];
      if (box[b + 3] > hx) hx = box[b + 3];
      if (box[b + 4] > hy) hy = box[b + 4];
      if (box[b + 5] > hz) hz = box[b + 5];
      const x = cen[c], y = cen[c + 1], z = cen[c + 2];
      if (x < cx0) cx0 = x;
      if (x > cx1) cx1 = x;
      if (y < cy0) cy0 = y;
      if (y > cy1) cy1 = y;
      if (z < cz0) cz0 = z;
      if (z > cz1) cz1 = z;
    }
    lo[node * 3] = lx; lo[node * 3 + 1] = ly; lo[node * 3 + 2] = lz;
    hi[node * 3] = hx; hi[node * 3 + 1] = hy; hi[node * 3 + 2] = hz;
    const n = e - s;
    if (n <= LEAF_MAX) {
      start[node] = s;
      count[node] = n;
      leaves++;
      continue;
    }
    // Bin the centres on all three axes in one pass.
    const NB = n > 4096 ? binsLarge : binsSmall;
    const ext = [cx1 - cx0, cy1 - cy0, cz1 - cz0];
    const c0 = [cx0, cy0, cz0];
    const sc = ext.map((x) => (x > 1e-12 ? NB / x : 0));
    bc.fill(0, 0, 3 * NB);
    for (let k = 0; k < 3 * NB; k++) {
      const o = k * 6;
      bb[o] = bb[o + 1] = bb[o + 2] = Infinity;
      bb[o + 3] = bb[o + 4] = bb[o + 5] = -Infinity;
    }
    const sx = sc[0], sy = sc[1], sz = sc[2];
    for (let i = s; i < e; i++) {
      const t = idx[i], b = t * 6, c = t * 3;
      const b0 = box[b], b1 = box[b + 1], b2 = box[b + 2], b3 = box[b + 3], b4 = box[b + 4], b5 = box[b + 5];
      for (let a = 0; a < 3; a++) {
        const s_ = a === 0 ? sx : a === 1 ? sy : sz;
        if (s_ === 0) continue;
        let k = ((cen[c + a] - c0[a]) * s_) | 0;
        if (k >= NB) k = NB - 1;
        k += a * NB;
        bc[k]++;
        const o = k * 6;
        if (b0 < bb[o]) bb[o] = b0;
        if (b1 < bb[o + 1]) bb[o + 1] = b1;
        if (b2 < bb[o + 2]) bb[o + 2] = b2;
        if (b3 > bb[o + 3]) bb[o + 3] = b3;
        if (b4 > bb[o + 4]) bb[o + 4] = b4;
        if (b5 > bb[o + 5]) bb[o + 5] = b5;
      }
    }
    let bestAxis = -1, bestBin = -1, bestCost = Infinity, bestNL = 0;
    for (let a = 0; a < 3; a++) {
      if (sc[a] === 0) continue;
      // From the right: the area and count of bins k .. NB-1.
      let qx = Infinity, qy = Infinity, qz = Infinity, px = -Infinity, py = -Infinity, pz = -Infinity, cnt = 0;
      for (let k = NB - 1; k > 0; k--) {
        const o = (a * NB + k) * 6;
        cnt += bc[a * NB + k];
        if (bb[o] < qx) qx = bb[o];
        if (bb[o + 1] < qy) qy = bb[o + 1];
        if (bb[o + 2] < qz) qz = bb[o + 2];
        if (bb[o + 3] > px) px = bb[o + 3];
        if (bb[o + 4] > py) py = bb[o + 4];
        if (bb[o + 5] > pz) pz = bb[o + 5];
        rCount[k] = cnt;
        const dx = px - qx, dy = py - qy, dz = pz - qz;
        rArea[k] = cnt ? dx * dy + dy * dz + dz * dx : 0;
      }
      qx = qy = qz = Infinity;
      px = py = pz = -Infinity;
      cnt = 0;
      for (let k = 0; k < NB - 1; k++) {
        const o = (a * NB + k) * 6;
        cnt += bc[a * NB + k];
        if (bb[o] < qx) qx = bb[o];
        if (bb[o + 1] < qy) qy = bb[o + 1];
        if (bb[o + 2] < qz) qz = bb[o + 2];
        if (bb[o + 3] > px) px = bb[o + 3];
        if (bb[o + 4] > py) py = bb[o + 4];
        if (bb[o + 5] > pz) pz = bb[o + 5];
        if (cnt === 0 || rCount[k + 1] === 0) continue;
        const dx = px - qx, dy = py - qy, dz = pz - qz;
        const cost = cnt * (dx * dy + dy * dz + dz * dx) + rCount[k + 1] * rArea[k + 1];
        if (cost < bestCost) {
          bestCost = cost;
          bestAxis = a;
          bestBin = k;
          bestNL = cnt;
        }
      }
    }
    let mid;
    if (bestAxis >= 0 && d + 1 + levels(Math.max(bestNL, n - bestNL)) <= maxDepth) {
      const a = bestAxis, s_ = sc[a], m0 = c0[a];
      let i = s, j = e - 1;
      while (i <= j) {
        const t = idx[i];
        let k = ((cen[t * 3 + a] - m0) * s_) | 0;
        if (k >= NB) k = NB - 1;
        if (k <= bestBin) i++;
        else {
          idx[i] = idx[j];
          idx[j] = t;
          j--;
        }
      }
      mid = i;
    } else {
      // (Halved at the median of the widest axis: no centres apart, or too deep for SAH's split.)
      if (bestAxis >= 0) forced++;
      const a = ext[0] >= ext[1] && ext[0] >= ext[2] ? 0 : ext[1] >= ext[2] ? 1 : 2;
      const sub = Array.from(idx.subarray(s, e));
      sub.sort((p, q) => cen[p * 3 + a] - cen[q * 3 + a]);
      idx.set(sub, s);
      mid = s + (n >> 1);
    }
    const l = nodes++, r = nodes++;
    left[node] = l;
    right[node] = r;
    tasks.push([r, mid, e, d + 1], [l, s, mid, d + 1]);
  }
  return { idx, lo, hi, left, right, start, count, depthOf, nodes, depth, leaves, forced };
}

/**
 * Packs the furnishings' meshes into one BVH texture (see the top of this file).
 * @param {import('./mesh.mjs').ScapeMesh[]} meshes
 * @param {{ layout?: 'stack' | 'stackless', bins?: number, maxDepth?: number, rows?: Float32Array }} [options]
 *   layout 'stackless' only for measuring on the CPU (the shader reads 'stack', the default).
 *   rows: texels to append after the vertices, 4 floats each (room for the nest's: nest.mjs).
 *   maxDepth: the deepest a leaf may sit (a whole number; above SCAPE_MAX_DEPTH it is that). It
 *   throws when halving the triangles down to leaves of 4 needs more levels than that.
 */
export function packScape(meshes, options = {}) {
  const t0 = performance.now();
  const layout = options.layout === 'stackless' ? LAYOUT_STACKLESS : LAYOUT_STACK;
  const askedDepth = options.maxDepth ?? SCAPE_MAX_DEPTH;
  if (!Number.isInteger(askedDepth) || askedDepth < 0) throw new Error(`packScape: maxDepth ${askedDepth} (a whole number, 0 or more)`);
  const maxDepth = Math.min(askedDepth, SCAPE_MAX_DEPTH);
  const binsLarge = options.bins ?? 32;
  const binsSmall = Math.min(binsLarge, 16);
  let V = 0, N = 0;
  for (const m of meshes) {
    V += m.positions.length / 3;
    N += m.indices.length / 3;
  }
  if (V >= 1 << 21) throw new Error(`packScape: ${V} vertices (at most ${(1 << 21) - 1})`);
  // (The limit holds only from the root down when halving fits under it: a node at depth d of n
  // triangles always keeps d + levels(n) <= maxDepth, by SAH or else by a median split.)
  if (levels(N) > maxDepth) {
    throw new Error(`packScape: ${N} triangles need a tree ${levels(N)} deep at least (leaves of ${LEAF_MAX}); maxDepth is ${maxDepth}`);
  }
  const pos = new Float32Array(V * 3), nrm = new Float32Array(V * 3), att = new Float32Array(V * 4);
  const tri = new Uint32Array(N * 3), mat = new Uint8Array(N);
  let vo = 0, to = 0;
  for (const m of meshes) {
    const vc = m.positions.length / 3, tc = m.indices.length / 3;
    const label = m.name ?? '(mesh)';
    if (!Number.isInteger(vc) || !Number.isInteger(tc)) throw new Error(`packScape: ${label}: ragged positions or indices`);
    if (m.normals.length !== vc * 3 || m.attrs.length !== vc * 4 || m.materials.length !== tc) throw new Error(`packScape: ${label}: normals/attrs/materials of the wrong length`);
    pos.set(m.positions, vo * 3);
    nrm.set(m.normals, vo * 3);
    att.set(m.attrs, vo * 4);
    for (let i = 0; i < tc * 3; i++) {
      const v = m.indices[i];
      if (!(v >= 0 && v < vc)) throw new Error(`packScape: ${label}: index ${v} out of range`);
      tri[to * 3 + i] = v + vo;
    }
    for (let i = 0; i < tc; i++) {
      const k = m.materials[i];
      if (!(k >= 0 && k <= 7)) throw new Error(`packScape: ${label}: material ${k} (0..7)`);
      mat[to + i] = k;
    }
    vo += vc;
    to += tc;
  }
  for (let i = 0; i < pos.length; i++) if (!Number.isFinite(pos[i])) throw new Error('packScape: a position is not finite');

  // Each triangle's box and its centre.
  const box = new Float64Array(N * 6), cen = new Float64Array(N * 3);
  for (let t = 0; t < N; t++) {
    const a = tri[t * 3] * 3, b = tri[t * 3 + 1] * 3, c = tri[t * 3 + 2] * 3;
    for (let k = 0; k < 3; k++) {
      const mn = Math.min(pos[a + k], pos[b + k], pos[c + k]), mx = Math.max(pos[a + k], pos[b + k], pos[c + k]);
      box[t * 6 + k] = mn;
      box[t * 6 + 3 + k] = mx;
      cen[t * 3 + k] = 0.5 * (mn + mx);
    }
  }
  const tree = buildTree(box, cen, N, maxDepth, binsLarge, binsSmall);
  const buildMs = performance.now() - t0;

  // Number the nodes depth-first, left first: all of them (stackless), or the internal ones (stack).
  const order = [];
  const walk = [0];
  while (walk.length) {
    const n = walk.pop();
    if (layout === LAYOUT_STACKLESS || tree.left[n] >= 0) order.push(n);
    if (tree.left[n] >= 0) walk.push(tree.right[n], tree.left[n]);
  }
  const id = new Int32Array(tree.nodes).fill(-1);
  order.forEach((n, i) => (id[n] = i));
  const recs = order.length;
  const nodeBase = 4;
  const triBase = nodeBase + recs * (layout === LAYOUT_STACK ? 4 : 2);
  const vertBase = triBase + N * 3;
  const rows = options.rows ?? new Float32Array(0);
  if (rows.length % 4 !== 0) throw new Error(`packScape: rows of ${rows.length} floats (4 a texel)`);
  const rowBase = vertBase + V * 2;
  const texels = rowBase + rows.length / 4;
  const width = SCAPE_TEX_WIDTH;
  const height = Math.max(1, Math.ceil(texels / width));
  if (height > SCAPE_MAX_HEIGHT) throw new Error(`packScape: ${height} rows (at most ${SCAPE_MAX_HEIGHT})`);
  const data = new Float32Array(width * height * 4);
  const word = (n) => (tree.left[n] >= 0 ? id[n] : -(tree.start[n] * 4 + tree.count[n] - 1) - 1);
  const putBox = (texel, n) => {
    for (let k = 0; k < 3; k++) {
      data[texel * 4 + k] = f32Down(tree.lo[n * 3 + k] - BOX_PAD);
      data[(texel + 1) * 4 + k] = f32Up(tree.hi[n * 3 + k] + BOX_PAD);
    }
  };
  const lo = [0, 0, 0], hi = [0, 0, 0];
  if (N > 0) {
    putBox(1, 0);
    for (let k = 0; k < 3; k++) {
      lo[k] = data[4 + k];
      hi[k] = data[8 + k];
    }
  } else {
    // (Nothing to meet: a box far outside the bowl, and no triangles.)
    for (let k = 0; k < 3; k++) {
      lo[k] = data[4 + k] = 1e6;
      hi[k] = data[8 + k] = 1e6;
    }
  }
  data.set([recs, triBase, N, layout === LAYOUT_STACK && N > 0 ? word(0) : 0], 0);
  data[7] = vertBase;
  data[11] = V;
  data.set([layout, tree.depth, tree.leaves, rows.length ? rowBase : 0], 12);
  if (layout === LAYOUT_STACK) {
    for (const n of order) {
      const at = nodeBase + id[n] * 4;
      const l = tree.left[n], r = tree.right[n];
      putBox(at, l);
      putBox(at + 2, r);
      data[at * 4 + 3] = word(l);
      data[(at + 1) * 4 + 3] = word(r);
    }
  } else {
    // Escape link: the node after its subtree in preorder (its parent's right child, or further up).
    const escape = new Int32Array(tree.nodes).fill(recs);
    for (const n of order) {
      if (tree.left[n] >= 0) {
        escape[tree.left[n]] = id[tree.right[n]];
        escape[tree.right[n]] = escape[n];
      }
    }
    for (const n of order) {
      const at = nodeBase + id[n] * 2;
      putBox(at, n);
      data[at * 4 + 3] = escape[n];
      data[(at + 1) * 4 + 3] = tree.left[n] >= 0 ? 0 : tree.start[n] * 4 + tree.count[n] - 1 + 1;
    }
  }
  for (let i = 0; i < N; i++) {
    const t = tree.idx[i], o = (triBase + i * 3) * 4;
    for (let v = 0; v < 3; v++) {
      const vi = tri[t * 3 + v];
      data[o + v * 4] = pos[vi * 3];
      data[o + v * 4 + 1] = pos[vi * 3 + 1];
      data[o + v * 4 + 2] = pos[vi * 3 + 2];
      data[o + v * 4 + 3] = v === 0 ? vi * 8 + mat[t] : vi;
    }
  }
  for (let v = 0; v < V; v++) {
    const o = (vertBase + v * 2) * 4;
    data[o] = nrm[v * 3];
    data[o + 1] = nrm[v * 3 + 1];
    data[o + 2] = nrm[v * 3 + 2];
    data[o + 3] = att[v * 4];
    data[o + 4] = att[v * 4 + 1];
    data[o + 5] = att[v * 4 + 2];
    data[o + 6] = att[v * 4 + 3];
  }
  data.set(rows, rowBase * 4);
  return {
    data,
    width,
    height,
    triangles: N,
    vertices: V,
    /** Every node of the tree (internal and leaves). */
    nodes: tree.nodes,
    internal: tree.nodes - tree.leaves,
    leaves: tree.leaves,
    depth: tree.depth,
    lo,
    hi,
    /** The first texel of the rows (packScape's options.rows), if any. */
    rowBase: rows.length ? rowBase : 0,
    /** The original triangle (all the meshes' triangles in turn) of each packed slot. */
    order: tree.idx,
    layout: layout === LAYOUT_STACK ? 'stack' : 'stackless',
    /** Median splits forced by the depth limit (SAH would have gone deeper). */
    forcedSplits: tree.forced,
    buildMs,
    packMs: performance.now() - t0 - buildMs,
  };
}

// ---- the CPU mirror of the shader -------------------------------------------------------------
// Reads the same texels and does the same f32 arithmetic in the same order as the WGSL below (each
// operation rounded with Math.fround; the GPU may fuse a multiply and an add, a rounding apart).
const fr = Math.fround;
const F_EDGE = fr(EDGE_EPS);
const F_TMIN = fr(SCAPE_T_MIN);
/** The smallest normal f32 (2^-126): a direction with no part this large is taken as zero. */
const F_MIN_NORMAL = 1.1754943508222875e-38;

function texel(D, i, c) {
  return D[i * 4 + c];
}

/** As scape_meshBad: o or d not finite in f32 (NaN or infinite), d zero (or subnormal in every
 *  part), or tEnd NaN. Such a ray meets nothing, and nothing is read for it. */
function rayBad(o, d, tEnd) {
  for (let k = 0; k < 3; k++) if (!Number.isFinite(fr(o[k])) || !Number.isFinite(fr(d[k]))) return true;
  if (Number.isNaN(fr(tEnd))) return true;
  return Math.max(Math.abs(fr(d[0])), Math.abs(fr(d[1])), Math.abs(fr(d[2]))) < F_MIN_NORMAL;
}

/** The ray as the shader sets it up: its origin, 1/d for the slabs (tiny components kept off 0),
 *  and the watertight test's frame (kz: d's largest axis; s: the shear and 1/d along it). */
function makeRay(o, d) {
  const ox = fr(o[0]), oy = fr(o[1]), oz = fr(o[2]);
  const dx = fr(d[0]), dy = fr(d[1]), dz = fr(d[2]);
  const nz = (x) => (Math.abs(x) < fr(1e-8) ? fr(1e-8) : x);
  const ix = fr(1 / nz(dx)), iy = fr(1 / nz(dy)), iz = fr(1 / nz(dz));
  const ax = Math.abs(dx), ay = Math.abs(dy), az = Math.abs(dz);
  const kz = ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
  const p = perm(dx, dy, dz, kz);
  const rz = fr(1 / p[2]);
  return { ox, oy, oz, ix, iy, iz, kz, sx: fr(p[0] * rz), sy: fr(p[1] * rz), sz: rz };
}

/** (v[kx], v[ky], v[kz]): kz 0 -> yzx, 1 -> zxy, 2 -> xyz. */
function perm(x, y, z, kz) {
  return kz === 0 ? [y, z, x] : kz === 1 ? [z, x, y] : [x, y, z];
}

/** The slab test: where the ray enters the box (lo at texel i, hi at i + 1) before tMax, or FAR. */
function boxCPU(r, D, i, tMax) {
  const ax = fr(fr(texel(D, i, 0) - r.ox) * r.ix), bx = fr(fr(texel(D, i + 1, 0) - r.ox) * r.ix);
  const ay = fr(fr(texel(D, i, 1) - r.oy) * r.iy), by = fr(fr(texel(D, i + 1, 1) - r.oy) * r.iy);
  const az = fr(fr(texel(D, i, 2) - r.oz) * r.iz), bz = fr(fr(texel(D, i + 1, 2) - r.oz) * r.iz);
  const tn = Math.max(Math.max(Math.min(ax, bx), Math.min(ay, by)), Math.max(Math.min(az, bz), 0));
  const tf = Math.min(Math.min(Math.max(ax, bx), Math.max(ay, by)), Math.min(Math.max(az, bz), tMax));
  return tn <= tf ? tn : FAR;
}

const triOut = [0, 0, 0];
/** As scape_meshOwns: whether a triangle whose edge p -> q (sheared, in its corners' order) the
 *  ray runs exactly through takes the ray (neg: its det < 0). */
function ownsCPU(p, q, neg) {
  const ex = fr(q[0] - p[0]), ey = fr(q[1] - p[1]);
  return neg !== (ey > 0 || (ey === 0 && ex < 0));
}

/** The watertight test (Woop, Benthin & Wald 2013) on the triangle at texel i: sets triOut to
 *  (t, b, c weights) and returns true when the ray's line meets it (t not yet checked). exact:
 *  false for a trace (the edge functions' slack F_EDGE of the triangle's scale), true for a shadow
 *  (no slack; an edge or corner the ray runs exactly through taken by one triangle only). */
function triCPU(r, D, i, exact) {
  const P = (t, k) => {
    const v = perm(fr(texel(D, t, 0) - r.ox), fr(texel(D, t, 1) - r.oy), fr(texel(D, t, 2) - r.oz), r.kz);
    return [fr(v[0] - fr(r.sx * v[2])), fr(v[1] - fr(r.sy * v[2])), v[2]];
  };
  const A = P(i), B = P(i + 1), C = P(i + 2);
  const u = fr(fr(C[0] * B[1]) - fr(C[1] * B[0]));
  const v = fr(fr(A[0] * C[1]) - fr(A[1] * C[0]));
  const w = fr(fr(B[0] * A[1]) - fr(B[1] * A[0]));
  const det = fr(fr(u + v) + w);
  const tol = exact ? 0 : fr(F_EDGE * Math.abs(det));
  const lo = Math.min(u, Math.min(v, w)), hi = Math.max(u, Math.max(v, w));
  if (det === 0 || (lo < -tol && hi > tol)) return false;
  if (exact) {
    const neg = det < 0;
    if ((u === 0 && !ownsCPU(B, C, neg)) || (v === 0 && !ownsCPU(C, A, neg)) || (w === 0 && !ownsCPU(A, B, neg))) return false;
  }
  const rd = fr(1 / det);
  triOut[0] = fr(fr(fr(fr(fr(fr(u * A[2]) + fr(v * B[2])) + fr(w * C[2])) * r.sz) * rd));
  triOut[1] = fr(v * rd);
  triOut[2] = fr(w * rd);
  return true;
}

function childWord(w) {
  return w < 0 ? (0x80000000 | (-w - 1)) >>> 0 : w;
}

/** Counters for traceCPU / shadowCPU (opts.stats): rays; nodes, boxes, triangles and texels read;
 *  the deepest stack; steps (nodes and leaves, as the shader's loop counts them), the most one ray
 *  took, and the rays cut off at SCAPE_MAX_STEPS; rays refused as bad (scape_meshBad). */
const newStats = () => ({ rays: 0, nodes: 0, boxes: 0, tris: 0, loads: 0, maxStack: 0, steps: 0, maxSteps: 0, capped: 0, bad: 0 });
export { newStats as scapeStats };

/**
 * Walks the tree along (o, d) up to tEnd, calling leaf(slot, t, b, c, material) for every triangle
 * met in (SCAPE_T_MIN, tMax()); leaf returns false to stop. tMax is read again at every box (the
 * nearest hit so far for a trace, the segment's end for a shadow). exact: the triangle test's mode
 * (see triCPU). Bad rays and segments no longer than SCAPE_T_MIN read nothing, as in the shader.
 * variant (layout 2 only): 'stack' (the shader's: nearest child first, a stack of child words),
 * 'stackT' (each stack entry keeps its entry distance and is dropped when popped beyond the hit),
 * 'leafFirst' (a node's leaf children met at once, only internal nodes stacked).
 */
function walkCPU(P, o, d, tEnd, leaf, tMax, stats, variant, exact) {
  const D = P.data;
  if (stats) stats.rays++;
  if (rayBad(o, d, tEnd)) {
    if (stats) stats.bad++;
    return;
  }
  // (A segment no longer than SCAPE_T_MIN meets nothing.)
  if (fr(tEnd) <= F_TMIN) return;
  const r = makeRay(o, d);
  if (stats) stats.loads += 2;
  if (boxCPU(r, D, 1, fr(tEnd)) >= FAR) return;
  if (stats) stats.loads++;
  const nodeCount = texel(D, 0, 0) >>> 0, triBase = texel(D, 0, 1) >>> 0, triCount = texel(D, 0, 2) >>> 0;
  if (triCount === 0) return;
  const layout = texel(D, 3, 0);
  const leafTris = (packed) => {
    const startT = packed >>> 2, cnt = (packed & 3) + 1;
    for (let j = 0; j < cnt; j++) {
      const k = startT + j;
      if (k >= triCount) break;
      const at = triBase + k * 3;
      if (stats) {
        stats.tris++;
        stats.loads += 3;
      }
      if (triCPU(r, D, at, exact) && triOut[0] > F_TMIN && triOut[0] < tMax()) {
        if (leaf(k, triOut[0], triOut[1], triOut[2], (texel(D, at, 3) >>> 0) & 7) === false) return false;
      }
    }
    return true;
  };
  if (layout === LAYOUT_STACKLESS) {
    let node = 0;
    for (let steps = 0; steps < nodeCount; steps++) {
      if (node >= nodeCount) break;
      const at = 4 + node * 2;
      if (stats) {
        stats.steps++;
        if (steps + 1 > stats.maxSteps) stats.maxSteps = steps + 1;
        stats.nodes++;
        stats.boxes++;
        stats.loads += 2;
      }
      if (boxCPU(r, D, at, tMax()) >= FAR) {
        node = texel(D, at, 3);
        continue;
      }
      const lw = texel(D, at + 1, 3);
      if (lw < 0.5) {
        node++;
        continue;
      }
      if (leafTris(lw - 1) === false) return;
      node = texel(D, at, 3);
    }
    return;
  }
  const stack = [], stackT = [];
  let cur = childWord(texel(D, 0, 3));
  // (As the shader's loop: each node and leaf is taken at most once, and never more than
  // SCAPE_MAX_STEPS steps in all.)
  const bound = Math.min(Math.min(nodeCount, 4194304) * 2 + 2, SCAPE_MAX_STEPS);
  const pop = () => {
    while (stack.length) {
      const c = stack.pop(), t = stackT.pop();
      if (variant !== 'stackT' || t < tMax()) return c;
    }
    return -1;
  };
  for (let it = 0; it < bound; it++) {
    if (stats) {
      stats.steps++;
      if (it + 1 > stats.maxSteps) stats.maxSteps = it + 1;
    }
    if (cur >= 0x80000000) {
      if (leafTris(cur & 0x7fffffff) === false) return;
      cur = pop();
      if (cur < 0) return;
      continue;
    }
    if (cur >= nodeCount) return;
    const at = 4 + cur * 4;
    if (stats) {
      stats.nodes++;
      stats.boxes += 2;
      stats.loads += 4;
    }
    const tm = tMax();
    const t0 = boxCPU(r, D, at, tm), t1 = boxCPU(r, D, at + 2, tm);
    const c0 = childWord(texel(D, at, 3)), c1 = childWord(texel(D, at + 1, 3));
    const h0 = t0 < FAR, h1 = t1 < FAR;
    if (variant === 'leafFirst') {
      // Leaves at once; internal children nearest first.
      let n0 = h0, n1 = h1;
      if (h0 && c0 >= 0x80000000) {
        if (leafTris(c0 & 0x7fffffff) === false) return;
        n0 = false;
      }
      if (h1 && c1 >= 0x80000000) {
        if (leafTris(c1 & 0x7fffffff) === false) return;
        n1 = false;
      }
      if (n0 && n1) {
        const swap = t1 < t0;
        stack.push(swap ? c0 : c1);
        stackT.push(swap ? t0 : t1);
        cur = swap ? c1 : c0;
      } else if (n0) cur = c0;
      else if (n1) cur = c1;
      else {
        cur = pop();
        if (cur < 0) return;
      }
    } else if (h0 && h1) {
      const swap = t1 < t0;
      if (stack.length < SCAPE_MAX_DEPTH) {
        stack.push(swap ? c0 : c1);
        stackT.push(swap ? t0 : t1);
      }
      cur = swap ? c1 : c0;
    } else if (h0) cur = c0;
    else if (h1) cur = c1;
    else {
      cur = pop();
      if (cur < 0) return;
    }
    if (stats && stack.length > stats.maxStack) stats.maxStack = stack.length;
  }
  // (Cut off: what was found so far stands, as in the shader.)
  if (stats) stats.capped++;
}

/**
 * The nearest triangle along (o, d) in (SCAPE_T_MIN, tEnd), as scape_meshHit finds it:
 * { t, tri, bary } (tri NONE = 0xffffffff and t = tEnd when nothing is met; bary: the weights of
 * the triangle's second and third corners). opts: { stats, variant } (see walkCPU).
 */
export function traceCPU(packed, o, d, tEnd, opts = {}) {
  const hit = { t: fr(tEnd), tri: NONE, bary: [0, 0] };
  walkCPU(packed, o, d, tEnd, (k, t, b, c) => {
    hit.t = t;
    hit.tri = k;
    hit.bary = [b, c];
  }, () => hit.t, opts.stats, opts.variant ?? 'stack', false);
  return hit;
}

/** The light let through along (o, d) up to tEnd, as scape_meshShadow finds it: [r, g, b]
 *  (the triangle test without slack: see the top of this file). */
export function shadowCPU(packed, o, d, tEnd, opts = {}) {
  let T = [1, 1, 1];
  const tE = fr(tEnd);
  walkCPU(packed, o, d, tEnd, (k, t, b, c, material) => {
    if (material !== MAT.LEAF_BIG && material !== MAT.LEAF_SMALL) {
      T = [0, 0, 0];
      return false;
    }
    T = T.map((x, i) => fr(x * fr(LEAF_PASS[i])));
    if (Math.max(T[0], T[1], T[2]) < fr(SHADOW_CUTOFF)) {
      T = [0, 0, 0];
      return false;
    }
    return true;
  }, () => tE, opts.stats, opts.variant ?? 'stack', true);
  return T;
}

const triTexels = new Float32Array(12);
/** The tracer's triangle test on its own (scape_meshTri, as walkCPU meets each triangle), for
 *  checking a walk against every triangle: the ray (o, d) against the corners a, b, c (each [x, y,
 *  z], taken as f32); its distance t along the ray when its line meets the triangle (t not yet held
 *  to any range), else null. exact: the shadow's mode (see triCPU). */
export function triangleCPU(o, d, a, b, c, exact = false) {
  for (let k = 0; k < 3; k++) {
    triTexels[k] = a[k];
    triTexels[4 + k] = b[k];
    triTexels[8 + k] = c[k];
  }
  return triCPU(makeRay(o, d), triTexels, 0, exact) ? triOut[0] : null;
}

/** What scape_meshSurface reads for a hit: { n, ng, attrs, material, vertices: [va, vb, vc] }. */
export function surfaceCPU(packed, hit) {
  const D = packed.data;
  const triBase = texel(D, 0, 1), vertBase = texel(D, 1, 3);
  const at = triBase + hit.tri * 3;
  const wa = texel(D, at, 3) >>> 0;
  const vs = [wa >>> 3, texel(D, at + 1, 3), texel(D, at + 2, 3)];
  const w = [1 - hit.bary[0] - hit.bary[1], hit.bary[0], hit.bary[1]];
  const n = [0, 0, 0], attrs = [0, 0, 0, 0];
  vs.forEach((v, j) => {
    const o = (vertBase + v * 2) * 4;
    for (let k = 0; k < 3; k++) n[k] += D[o + k] * w[j];
    attrs[0] += D[o + 3] * w[j];
    for (let k = 0; k < 3; k++) attrs[k + 1] += D[o + 4 + k] * w[j];
  });
  const p = [0, 1, 2].map((v) => [0, 1, 2].map((k) => texel(D, at + v, k)));
  const e1 = p[1].map((x, k) => x - p[0][k]), e2 = p[2].map((x, k) => x - p[0][k]);
  const g = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const gl = Math.hypot(...g), nl = Math.hypot(...n);
  const ng = gl > 1e-20 ? g.map((x) => x / gl) : [0, 1, 0];
  return { n: nl > 1e-6 ? n.map((x) => x / nl) : ng, ng, attrs, material: wa & 7, vertices: vs };
}

// ---- the shader ---------------------------------------------------------------------------------
const MAT_FN = [
  ['BARK', 'bark', 'vec3f(0.16, 0.09, 0.045)', '0.75', '0.02', 'vec3f(0.0)'],
  ['WOOD_END', 'woodEnd', 'vec3f(0.30, 0.20, 0.11)', '0.8', '0.02', 'vec3f(0.0)'],
  ['ROCK', 'rock', 'vec3f(0.05, 0.05, 0.055)', '0.5', '0.04', 'vec3f(0.0)'],
  ['LEAF_BIG', 'leafBig', 'vec3f(0.02, 0.06, 0.015)', '0.35', '0.04', 'vec3f(0.05, 0.12, 0.02)'],
  ['LEAF_SMALL', 'leafSmall', 'vec3f(0.03, 0.09, 0.02)', '0.4', '0.04', 'vec3f(0.06, 0.14, 0.03)'],
  ['STEM', 'stem', 'vec3f(0.04, 0.09, 0.025)', '0.5', '0.03', 'vec3f(0.0)'],
  ['ROOT', 'root', 'vec3f(0.06, 0.045, 0.03)', '0.7', '0.02', 'vec3f(0.0)'],
];
const f = (x) => {
  const s = String(x);
  return /[.eE]/.test(s) ? s : `${s}.0`;
};

/** WGSL with its comments blanked: line comments, and block comments, which nest in WGSL. */
function stripWGSLComments(src) {
  let out = '', depth = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (c === '/' && n === '*') {
      depth++;
      i++;
      out += '  ';
    } else if (depth > 0 && c === '*' && n === '/') {
      depth--;
      i++;
      out += '  ';
    } else if (depth > 0) {
      out += c === '\n' ? '\n' : ' ';
    } else if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') {
        out += ' ';
        i++;
      }
      if (i < src.length) out += '\n';
    } else out += c;
  }
  return out;
}

/**
 * The furnishings' WGSL: SCAPE_WGSL_COMMON, the pieces' material functions, and the tracer:
 *   struct ScapeMeshHit { t: f32, tri: u32, bary: vec2f }   (tri 0xffffffffu when nothing is met)
 *   fn scape_meshHit(tex, o, d, tEnd) -> ScapeMeshHit       nearest hit in (1e-5, tEnd)
 *   fn scape_meshShadow(tex, o, d, tEnd) -> vec3f           light let through along the segment
 *   struct ScapeSurface { n: vec3f, ng: vec3f, attrs: vec4f, material: u32 }
 *   fn scape_meshSurface(tex, h) -> ScapeSurface
 *   fn scape_meshMaterial(s, p, foot, front) -> ScapeMat
 * (o, d in the bowl's frame, d of unit length; tex the texture packScape filled.) A material no
 * piece defines gets a plain stand-in, so the shader always compiles.
 * @param {string[]} pieces each a piece's WGSL (functions named scape_mat_<name>, see mesh.mjs)
 */
export function scapeMeshWGSL(pieces = []) {
  const src = pieces.filter((p) => typeof p === 'string' && p.length);
  // (Definitions are counted in the code only: one left in a comment is none.)
  const all = stripWGSLComments(src.join('\n'));
  const stubs = [];
  for (const [, name, albedo, rough, spec, trans] of MAT_FN) {
    const defs = all.match(new RegExp(`\\bfn\\s+scape_mat_${name}\\s*\\(`, 'g'));
    if (defs && defs.length > 1) throw new Error(`scapeMeshWGSL: scape_mat_${name} is defined ${defs.length} times`);
    if (!defs) {
      stubs.push(`fn scape_mat_${name}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  return ScapeMat(${albedo}, n, ${rough}, ${spec}, ${trans}, clamp(attrs.w, 0.0, 1.0));
}`);
    }
  }
  const mats = Object.entries(MAT).map(([k, v]) => `const SCAPE_MAT_${k}: u32 = ${v}u;`).join('\n');
  const cases = MAT_FN.map(([key, name]) => `    case ${MAT[key]}u: { m = scape_mat_${name}(s.attrs, p, s.n, foot, front); }`).join('\n');

  // One walk of the tree, nearest child first, for both the trace and the shadow: LEAF is the
  // body run on each triangle met in (SCAPE_MESH_TMIN, TMAX), with a (corners' texel 0), x (t, b, c
  // weights) and k (its slot) in scope; TMAX the bound boxes are tested against; EXACT the triangle
  // test's mode (false for the trace, true for the shadow: see scape_meshTri).
  const walk = (LEAF, TMAX, EXACT) => /* wgsl */ `
  let h0 = scape_meshTexel(tex, 0u);
  let triCount = u32(h0.z);
  if (triCount == 0u) { return OUT; }
  let nodeCount = min(u32(h0.x), 4194304u);
  let triBase = u32(h0.y);
  var stack: array<u32, 32>;
  var sp = 0u;
  var cur = scape_meshChild(h0.w);
  // (Each node and leaf is taken at most once, and a finite ray takes a few hundred steps at most:
  // the bound guards against a bad texture or a ray scape_meshBad let by.)
  let steps = min(nodeCount * 2u + 2u, SCAPE_MESH_STEPS);
  for (var it = 0u; it < steps; it++) {
    if (cur >= 0x80000000u) {
      let start = (cur & 0x7fffffffu) >> 2u;
      let count = (cur & 3u) + 1u;
      for (var j = 0u; j < count; j++) {
        let k = start + j;
        if (k >= triCount) { break; }
        let at = triBase + k * 3u;
        let a = scape_meshTexel(tex, at);
        let x = scape_meshTri(r, a.xyz, scape_meshTexel(tex, at + 1u).xyz, scape_meshTexel(tex, at + 2u).xyz, ${EXACT});
        if (x.x > SCAPE_MESH_TMIN && x.x < ${TMAX}) {
${LEAF}
        }
      }
      if (sp == 0u) { break; }
      sp -= 1u;
      cur = stack[sp];
      continue;
    }
    if (cur >= nodeCount) { break; }
    let at = 4u + cur * 4u;
    let n0 = scape_meshTexel(tex, at);
    let n1 = scape_meshTexel(tex, at + 1u);
    let t0 = scape_meshBox(r, n0.xyz, n1.xyz, ${TMAX});
    let t1 = scape_meshBox(r, scape_meshTexel(tex, at + 2u).xyz, scape_meshTexel(tex, at + 3u).xyz, ${TMAX});
    let c0 = scape_meshChild(n0.w);
    let c1 = scape_meshChild(n1.w);
    if (t0 < SCAPE_MESH_FAR && t1 < SCAPE_MESH_FAR) {
      let swap = t1 < t0;
      if (sp < SCAPE_MESH_STACK) {
        stack[sp] = select(c1, c0, swap);
        sp += 1u;
      }
      cur = select(c0, c1, swap);
    } else if (t0 < SCAPE_MESH_FAR) {
      cur = c0;
    } else if (t1 < SCAPE_MESH_FAR) {
      cur = c1;
    } else {
      if (sp == 0u) { break; }
      sp -= 1u;
      cur = stack[sp];
    }
  }`;

  const tracer = /* wgsl */ `
// ---- the furnishings' triangles (src/render/scape/scapeBVH.mjs) ------------------------------
${mats}
const SCAPE_MESH_NONE: u32 = 0xffffffffu;
const SCAPE_MESH_STACK: u32 = ${SCAPE_MAX_DEPTH}u;
const SCAPE_MESH_STEPS: u32 = ${SCAPE_MAX_STEPS}u;
const SCAPE_MESH_TMIN: f32 = ${f(SCAPE_T_MIN)};
const SCAPE_MESH_EDGE: f32 = ${f(EDGE_EPS)};
const SCAPE_MESH_FAR: f32 = 3.0e38;
const SCAPE_LEAF_PASS: vec3f = vec3f(${LEAF_PASS.map(f).join(', ')});
const SCAPE_SHADOW_CUTOFF: f32 = ${f(SHADOW_CUTOFF)};

struct ScapeMeshHit {
  t: f32,
  tri: u32,
  bary: vec2f,
}

struct ScapeSurface {
  n: vec3f,
  ng: vec3f,
  attrs: vec4f,
  material: u32,
}

// A ray set up for the walk: its origin, 1/d for the slabs (tiny components kept off zero), and
// the watertight test's frame: kz, d's largest axis; s, the shear (d.kx / d.kz, d.ky / d.kz) and
// 1 / d.kz.
struct ScapeRay {
  o: vec3f,
  inv: vec3f,
  s: vec3f,
  kz: u32,
}

fn scape_meshTexel(tex: texture_2d<f32>, i: u32) -> vec4f {
  return textureLoad(tex, vec2i(i32(i & 1023u), i32(i >> 10u)), 0);
}

// (v.kx, v.ky, v.kz): kz 0 -> yzx, 1 -> zxy, 2 -> xyz.
fn scape_meshPerm(v: vec3f, kz: u32) -> vec3f {
  return select(select(v.zxy, v.yzx, kz == 0u), v, kz == 2u);
}

// A ray the walk must not take: o or d not finite (NaN or infinite), d zero (no part of it a
// normal f32), or tEnd NaN. Tested on the bits: a compiler may take floats as never NaN and drop
// x != x, and the GPU's min and max drop a NaN operand, so the slab test would let such a ray into
// every box.
fn scape_meshBad(o: vec3f, d: vec3f, tEnd: f32) -> bool {
  let m = vec3u(0x7fffffffu);
  let inf = vec3u(0x7f800000u);
  let ad = bitcast<vec3u>(d) & m;
  return any((bitcast<vec3u>(o) & m) >= inf) || any(ad >= inf) || all(ad < vec3u(0x00800000u))
      || (bitcast<u32>(tEnd) & 0x7fffffffu) > 0x7f800000u;
}

fn scape_meshRay(o: vec3f, d: vec3f) -> ScapeRay {
  let ad = abs(d);
  var kz = 2u;
  if (ad.x >= ad.y && ad.x >= ad.z) {
    kz = 0u;
  } else if (ad.y >= ad.z) {
    kz = 1u;
  }
  let pd = scape_meshPerm(d, kz);
  let rz = 1.0 / pd.z;
  let inv = 1.0 / select(d, vec3f(1e-8), ad < vec3f(1e-8));
  return ScapeRay(o, inv, vec3f(pd.x * rz, pd.y * rz, rz), kz);
}

// Where the ray enters the box before tMax, or SCAPE_MESH_FAR if it misses it.
fn scape_meshBox(r: ScapeRay, lo: vec3f, hi: vec3f, tMax: f32) -> f32 {
  let a = (lo - r.o) * r.inv;
  let b = (hi - r.o) * r.inv;
  let tn = max(max(min(a.x, b.x), min(a.y, b.y)), max(min(a.z, b.z), 0.0));
  let tf = min(min(max(a.x, b.x), max(a.y, b.y)), min(max(a.z, b.z), tMax));
  return select(SCAPE_MESH_FAR, tn, tn <= tf);
}

// Whether a triangle owns its edge p -> q (sheared corners, in the triangle's order; neg: its det
// < 0) when the ray runs exactly through it: when the triangle lies on the side of the edge its
// normal points to, the normal turned to x > 0 (or x = 0, y > 0). A neighbour gets the same normal
// from the same corners (q - p exactly negated if it runs the edge the other way) and lies on the
// other side, so just one of them owns it (and at a corner, just one of those round it: the rule
// is that of the point nudged along +x, then +y).
fn scape_meshOwns(p: vec2f, q: vec2f, neg: bool) -> bool {
  let e = q - p;
  return neg != (e.y > 0.0 || (e.y == 0.0 && e.x < 0.0));
}

// The ray against a triangle, either face (Woop, Benthin & Wald's watertight test: each corner is
// sheared into the ray's frame on its own, so triangles sharing an edge compute that edge's
// function from the same numbers and no ray slips between them). exact false (a trace): the edge
// functions get a slack of SCAPE_MESH_EDGE of the triangle's scale, so no crack opens even where
// the GPU fuses a multiply and an add. exact true (a shadow): no slack, and an edge or corner the
// ray runs exactly through (an edge function exactly 0) is taken by one of the triangles round it
// only (scape_meshOwns), so a leaf is never darkened twice there. (t, b, c): the distance and the
// second and third corners' weights; t = SCAPE_MESH_FAR when the line misses it.
fn scape_meshTri(r: ScapeRay, a: vec3f, b: vec3f, c: vec3f, exact: bool) -> vec3f {
  let A = scape_meshPerm(a - r.o, r.kz);
  let B = scape_meshPerm(b - r.o, r.kz);
  let C = scape_meshPerm(c - r.o, r.kz);
  let a2 = A.xy - r.s.xy * A.z;
  let b2 = B.xy - r.s.xy * B.z;
  let c2 = C.xy - r.s.xy * C.z;
  let u = c2.x * b2.y - c2.y * b2.x;
  let v = a2.x * c2.y - a2.y * c2.x;
  let w = b2.x * a2.y - b2.y * a2.x;
  let det = u + v + w;
  let tol = select(SCAPE_MESH_EDGE * abs(det), 0.0, exact);
  let lo = min(u, min(v, w));
  let hi = max(u, max(v, w));
  if (det == 0.0 || (lo < -tol && hi > tol)) {
    return vec3f(SCAPE_MESH_FAR, 0.0, 0.0);
  }
  if (exact) {
    let neg = det < 0.0;
    if ((u == 0.0 && !scape_meshOwns(b2, c2, neg)) || (v == 0.0 && !scape_meshOwns(c2, a2, neg)) || (w == 0.0 && !scape_meshOwns(a2, b2, neg))) {
      return vec3f(SCAPE_MESH_FAR, 0.0, 0.0);
    }
  }
  let rd = 1.0 / det;
  let t = (u * A.z + v * B.z + w * C.z) * r.s.z * rd;
  return vec3f(t, v * rd, w * rd);
}

// A child word from the texture: an internal node's index, or 0x80000000 | (start * 4 + count - 1)
// for a leaf.
fn scape_meshChild(w: f32) -> u32 {
  if (w < 0.0) {
    return 0x80000000u | u32(-w - 1.0);
  }
  return u32(w);
}

// The nearest triangle along the ray in (SCAPE_MESH_TMIN, tEnd); o, d in the bowl's frame, d of
// unit length. t = tEnd and tri = SCAPE_MESH_NONE when there is none (or the ray is bad: see
// scape_meshBad).
fn scape_meshHit(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> ScapeMeshHit {
  var hit = ScapeMeshHit(tEnd, SCAPE_MESH_NONE, vec2f(0.0));
  if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return hit; }
  let r = scape_meshRay(o, d);
  // (Most segments miss the furnishings altogether: their box first.)
  if (scape_meshBox(r, scape_meshTexel(tex, 1u).xyz, scape_meshTexel(tex, 2u).xyz, tEnd) >= SCAPE_MESH_FAR) { return hit; }
${walk(`          hit = ScapeMeshHit(x.x, k, x.yz);`, 'hit.t', 'false').replaceAll('OUT', 'hit')}
  return hit;
}

// The light let through along the segment (o, d up to tEnd): none at any opaque triangle, a green
// share at each leaf blade crossed (all of it for a bad ray: see scape_meshBad).
fn scape_meshShadow(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> vec3f {
  var T = vec3f(1.0);
  if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return T; }
  let r = scape_meshRay(o, d);
  if (scape_meshBox(r, scape_meshTexel(tex, 1u).xyz, scape_meshTexel(tex, 2u).xyz, tEnd) >= SCAPE_MESH_FAR) { return T; }
${walk(`          let m = u32(a.w) & 7u;
          if (m != SCAPE_MAT_LEAF_BIG && m != SCAPE_MAT_LEAF_SMALL) { return vec3f(0.0); }
          T *= SCAPE_LEAF_PASS;
          if (max(T.x, max(T.y, T.z)) < SCAPE_SHADOW_CUTOFF) { return vec3f(0.0); }`, 'tEnd', 'true').replaceAll('OUT', 'T')}
  return T;
}

// What the hit triangle is at the hit: its smooth normal (the corners' normals interpolated and
// renormalised; the geometric one where they cancel), its geometric normal (the side its corners
// run counter-clockwise round), the corners' attributes interpolated, its material.
fn scape_meshSurface(tex: texture_2d<f32>, h: ScapeMeshHit) -> ScapeSurface {
  let h0 = scape_meshTexel(tex, 0u);
  if (h.tri >= u32(h0.z)) {
    return ScapeSurface(vec3f(0.0, 1.0, 0.0), vec3f(0.0, 1.0, 0.0), vec4f(0.0, 0.0, 0.0, 1.0), 0u);
  }
  let vb = u32(scape_meshTexel(tex, 1u).w);
  let at = u32(h0.y) + h.tri * 3u;
  let a = scape_meshTexel(tex, at);
  let b = scape_meshTexel(tex, at + 1u);
  let c = scape_meshTexel(tex, at + 2u);
  let wa = u32(a.w);
  let ia = vb + (wa >> 3u) * 2u;
  let ib = vb + u32(b.w) * 2u;
  let ic = vb + u32(c.w) * 2u;
  let a0 = scape_meshTexel(tex, ia);
  let a1 = scape_meshTexel(tex, ia + 1u);
  let b0 = scape_meshTexel(tex, ib);
  let b1 = scape_meshTexel(tex, ib + 1u);
  let c0 = scape_meshTexel(tex, ic);
  let c1 = scape_meshTexel(tex, ic + 1u);
  let wb = h.bary.x;
  let wc = h.bary.y;
  let w0 = 1.0 - wb - wc;
  let g = cross(b.xyz - a.xyz, c.xyz - a.xyz);
  let gl = length(g);
  let ng = select(vec3f(0.0, 1.0, 0.0), g / max(gl, 1e-30), gl > 1e-20);
  let ni = a0.xyz * w0 + b0.xyz * wb + c0.xyz * wc;
  let nl = length(ni);
  let n = select(ng, ni / max(nl, 1e-30), nl > 1e-6);
  let attrs = vec4f(a0.w, a1.xyz) * w0 + vec4f(b0.w, b1.xyz) * wb + vec4f(c0.w, c1.xyz) * wc;
  return ScapeSurface(n, ng, attrs, wa & 7u);
}

// The surface's material at p (foot: a pixel's size there; front: the ray meets the side s.n
// points to).
fn scape_meshMaterial(s: ScapeSurface, p: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m = ScapeMat(vec3f(0.18), s.n, 0.8, 0.02, vec3f(0.0), clamp(s.attrs.w, 0.0, 1.0));
  switch (s.material) {
${cases}
    default: {}
  }
  return m;
}
`;
  return [SCAPE_WGSL_COMMON, ...src, stubs.length ? `// (Stand-ins for the materials no piece defines yet.)\n${stubs.join('\n\n')}` : '', tracer].filter(Boolean).join('\n');
}
