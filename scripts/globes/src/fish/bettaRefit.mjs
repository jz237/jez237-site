// The betta's BVH refitted on the GPU (Betta.ts). Every frame the CPU uploads the skinned vertices
// (12 bytes a vertex: 81 KB, where the whole texture was 1.2 MB) and two kernels rewrite the BVH
// texture (triangleBVH.mjs's layout) in place, in one compute pass:
//   1. bettaLeaves  ceil(plan.leafCount / 64) workgroups: each leaf of the tree copies its triangles'
//                   corners into their texels (their w words as packed) and fits its box round them,
//                   padded, into its node's texels and bettaNodeBox.
//   2. bettaNodes   one workgroup of 256: the inner nodes a level at a time, deepest first (a
//                   storage barrier between levels), each box round its two children's, padded
//                   again, into its texels and bettaNodeBox.
// What never moves (the header, but for its visible flag, which the CPU writes when it changes;
// the nodes' escape links and leaf words, written again with their boxes; the triangles' uv texels;
// the fin side table) is written once, with the rest of the texture as TriangleBVH packed it.
//
// The boxes are TriangleBVH.refit's but for the padding, which is taken in float32 here (x - 1e-6
// rounded once, not 1e-6 subtracted in float64 and the difference rounded): now and then a face
// lies a hair off the CPU's (under 1e-12), inside the same margin. The corners are the uploaded
// floats, bit for bit.
// bettaRefitPlan works out the kernels' tables once; refitCPU is the kernels on the CPU (the tests'
// reference). The texture needs STORAGE_BINDING as well as TEXTURE_BINDING usage (rgba32float storage
// textures are write-only in core WebGPU, which is all these kernels need).

/** The workgroup size of bettaLeaves; bettaNodes runs one workgroup of BETTA_NODE_THREADS. */
export const BETTA_LEAF_WORKGROUP = 64;
export const BETTA_NODE_THREADS = 256;
/** Bytes of the kernels' uniform (bettaRefitUniform). */
export const BETTA_REFIT_UNIFORM_BYTES = 32;

/**
 * The kernels' tables for a TriangleBVH (as built: its order, nodes and packed words) over
 * vertexCount vertices. Returns (typed arrays to upload once, as their names say):
 *   slots    Uint32Array, four a triangle slot (bvh.order's): its corners' vertex ids, 0  -> bettaSlots
 *   words    Float32Array, four a slot: its three corner texels' w words (material, uv0.x,
 *            uv0.y), 0; then four a node: its two texels' w words (escape, leaf word), 0, 0  -> bettaWords
 *   records  Uint32Array, four a record: the leaves [node, first slot, count, 0], then the inner
 *            nodes [node, right child, 0, 0] deepest first, then the levels of those [first record,
 *            count, 0, 0] (records counted from the first inner one)  -> bettaRecords
 * and leafCount, innerCount, levelCount, levels ([{ depth, first, count }] deepest first),
 * vertexCount, triOffset, nodeCount, slotCount.
 */
export function bettaRefitPlan(bvh, vertexCount) {
  const d = bvh.data, N = bvh.order.length, M = bvh.nodes.length;
  const slots = new Uint32Array(N * 4);
  const words = new Float32Array((N + M) * 4);
  for (let i = 0; i < N; i++) {
    for (let v = 0; v < 3; v++) {
      slots[i * 4 + v] = bvh.corners[i * 3 + v] / 3;
      words[i * 4 + v] = d[(bvh.triOffset + i * 4 + v) * 4 + 3];
    }
  }
  for (let n = 0; n < M; n++) {
    words[(N + n) * 4] = d[(1 + n * 2) * 4 + 3];
    words[(N + n) * 4 + 1] = d[(2 + n * 2) * 4 + 3];
  }
  // (Preorder: a node's children come after it.)
  const depth = new Int32Array(M);
  const leaves = [], inner = [];
  for (let n = 0; n < M; n++) {
    if (bvh.starts[n] >= 0) leaves.push(n);
    else {
      depth[n + 1] = depth[bvh.rights[n]] = depth[n] + 1;
      inner.push(n);
    }
  }
  inner.sort((a, b) => depth[b] - depth[a] || a - b);
  const levels = [];
  inner.forEach((n, r) => {
    if (!levels.length || levels[levels.length - 1].depth !== depth[n]) levels.push({ depth: depth[n], first: r, count: 0 });
    levels[levels.length - 1].count++;
  });
  const records = new Uint32Array((leaves.length + inner.length + levels.length) * 4);
  leaves.forEach((n, r) => records.set([n, bvh.starts[n], bvh.counts[n], 0], r * 4));
  inner.forEach((n, r) => records.set([n, bvh.rights[n], 0, 0], (leaves.length + r) * 4));
  levels.forEach((l, r) => records.set([l.first, l.count, 0, 0], (leaves.length + inner.length + r) * 4));
  return {
    slots,
    words,
    records,
    leafCount: leaves.length,
    innerCount: inner.length,
    levelCount: levels.length,
    levels,
    vertexCount,
    triOffset: bvh.triOffset,
    nodeCount: M,
    slotCount: N,
  };
}

/** The kernels' uniform, written once (BETTA_REFIT_UNIFORM_BYTES): leafCount, triOffset, the first
 *  inner record, the first level record, levelCount, where the node words start in bettaWords. */
export function bettaRefitUniform(plan) {
  const u = new Uint32Array(BETTA_REFIT_UNIFORM_BYTES / 4);
  u.set([plan.leafCount, plan.triOffset, plan.leafCount, plan.leafCount + plan.innerCount, plan.levelCount, plan.slotCount]);
  return u;
}

/**
 * The kernels' buffers, by their WGSL names: { data (to upload once; null: written each frame, or
 * the kernels' own), size (bytes: a multiple of 16), usage ('uniform' | 'storage') }. bettaVerts is
 * written every frame (COPY_DST): the vertices, three floats each.
 */
export function bettaRefitBuffers(plan) {
  const at = (data, usage, bytes = data.byteLength) => ({ data, size: Math.max(32, Math.ceil(bytes / 16) * 16), usage });
  return {
    bettaRefit: at(bettaRefitUniform(plan), 'uniform'),
    bettaVerts: at(null, 'storage', plan.vertexCount * 12),
    bettaSlots: at(plan.slots, 'storage'),
    bettaWords: at(plan.words, 'storage'),
    bettaRecords: at(plan.records, 'storage'),
    bettaNodeBox: at(null, 'storage', plan.nodeCount * 32),
  };
}

/** The bind group layout's entries (group 0, both kernels; visibility 4: GPUShaderStage.COMPUTE),
 *  in the bindings' order: bettaRefit, bettaVerts, bettaSlots, bettaWords, bettaRecords,
 *  bettaNodeBox, then the BVH texture. */
export function bettaRefitLayout() {
  const C = 4;
  const read = (binding) => ({ binding, visibility: C, buffer: { type: 'read-only-storage' } });
  return [
    { binding: 0, visibility: C, buffer: { type: 'uniform' } },
    read(1), read(2), read(3), read(4),
    { binding: 5, visibility: C, buffer: { type: 'storage' } },
    { binding: 6, visibility: C, storageTexture: { access: 'write-only', format: 'rgba32float', viewDimension: '2d' } },
  ];
}

// ---- the CPU mirror ---------------------------------------------------------------------------------

const fr = Math.fround;
const PAD = fr(1e-6);

/** Both kernels on the CPU: data (a copy of the texture, as packed) rewritten from vertices as the
 *  GPU rewrites it. Returns nodeBox (eight floats a node: lo, 0, hi, 0). */
export function refitCPU(data, plan, vertices) {
  const { slots, words, records } = plan;
  const nodeBox = new Float32Array(plan.nodeCount * 8);
  const box = (n, lo, hi) => {
    const w = (plan.slotCount + n) * 4;
    for (let k = 0; k < 3; k++) {
      data[(1 + n * 2) * 4 + k] = nodeBox[n * 8 + k] = fr(lo[k] - PAD);
      data[(2 + n * 2) * 4 + k] = nodeBox[n * 8 + 4 + k] = fr(hi[k] + PAD);
    }
    data[(1 + n * 2) * 4 + 3] = words[w];
    data[(2 + n * 2) * 4 + 3] = words[w + 1];
  };
  const lo = [0, 0, 0], hi = [0, 0, 0];
  for (let r = 0; r < plan.leafCount; r++) {
    const n = records[r * 4], start = records[r * 4 + 1], count = records[r * 4 + 2];
    lo.fill(3e38);
    hi.fill(-3e38);
    for (let i = start; i < start + count; i++) {
      for (let v = 0; v < 3; v++) {
        const s = slots[i * 4 + v], at = (plan.triOffset + i * 4 + v) * 4;
        for (let k = 0; k < 3; k++) {
          const x = vertices[s * 3 + k];
          data[at + k] = x;
          lo[k] = Math.min(lo[k], x);
          hi[k] = Math.max(hi[k], x);
        }
        data[at + 3] = words[i * 4 + v];
      }
    }
    box(n, lo, hi);
  }
  for (let l = 0; l < plan.levelCount; l++) {
    const at = (plan.leafCount + plan.innerCount + l) * 4, first = records[at], count = records[at + 1];
    for (let r = first; r < first + count; r++) {
      const o = (plan.leafCount + r) * 4, n = records[o], right = records[o + 1];
      for (let k = 0; k < 3; k++) {
        lo[k] = Math.min(nodeBox[(n + 1) * 8 + k], nodeBox[right * 8 + k]);
        hi[k] = Math.max(nodeBox[(n + 1) * 8 + 4 + k], nodeBox[right * 8 + 4 + k]);
      }
      box(n, lo, hi);
    }
  }
  return nodeBox;
}

// ---- the kernels --------------------------------------------------------------------------------------

/**
 * Both kernels' WGSL, one module (entry points bettaLeaves and bettaNodes). Bindings, @group(0):
 *   0  var<uniform> bettaRefit: BettaRefit { leafCount, triOffset, innerAt, levelsAt, levelCount,
 *      wordsAt, pad0, pad1: u32 }                                bettaRefitUniform(plan)
 *   1  var<storage, read> bettaVerts: array<f32>                 the vertices, every frame
 *   2  var<storage, read> bettaSlots: array<vec4u>               plan.slots
 *   3  var<storage, read> bettaWords: array<vec4f>               plan.words
 *   4  var<storage, read> bettaRecords: array<vec4u>             plan.records
 *   5  var<storage, read_write> bettaNodeBox: array<vec4f>       two a node (plan.nodeCount * 2)
 *   6  var bettaTex: texture_storage_2d<rgba32float, write>      the BVH's texture
 */
export const bettaRefitWGSL = /* wgsl */ `
// ---- the betta's BVH refitted (src/fish/bettaRefit.mjs) ----------------------------------------
struct BettaRefit {
  leafCount: u32,
  triOffset: u32,
  innerAt: u32,
  levelsAt: u32,
  levelCount: u32,
  wordsAt: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> bettaRefit: BettaRefit;
@group(0) @binding(1) var<storage, read> bettaVerts: array<f32>;
@group(0) @binding(2) var<storage, read> bettaSlots: array<vec4u>;
@group(0) @binding(3) var<storage, read> bettaWords: array<vec4f>;
@group(0) @binding(4) var<storage, read> bettaRecords: array<vec4u>;
@group(0) @binding(5) var<storage, read_write> bettaNodeBox: array<vec4f>;
@group(0) @binding(6) var bettaTex: texture_storage_2d<rgba32float, write>;

const BETTA_PAD = 1e-6;

fn betta_texel(i: u32) -> vec2i {
  return vec2i(i32(i & 1023u), i32(i >> 10u));
}

fn betta_vertex(v: u32) -> vec3f {
  return vec3f(bettaVerts[v * 3u], bettaVerts[v * 3u + 1u], bettaVerts[v * 3u + 2u]);
}

// A node's box, padded outward, into its two texels (with their words) and bettaNodeBox.
fn betta_box(n: u32, lo: vec3f, hi: vec3f) {
  let w = bettaWords[bettaRefit.wordsAt + n];
  let a = lo - vec3f(BETTA_PAD);
  let b = hi + vec3f(BETTA_PAD);
  textureStore(bettaTex, betta_texel(1u + n * 2u), vec4f(a, w.x));
  textureStore(bettaTex, betta_texel(2u + n * 2u), vec4f(b, w.y));
  bettaNodeBox[n * 2u] = vec4f(a, 0.0);
  bettaNodeBox[n * 2u + 1u] = vec4f(b, 0.0);
}

// One leaf: its triangles' corners into their texels, its box round them.
@compute @workgroup_size(${BETTA_LEAF_WORKGROUP})
fn bettaLeaves(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x >= bettaRefit.leafCount) { return; }
  let leaf = bettaRecords[gid.x];
  var lo = vec3f(3e38);
  var hi = vec3f(-3e38);
  for (var i = leaf.y; i < leaf.y + leaf.z; i++) {
    let s = bettaSlots[i];
    let w = bettaWords[i];
    let at = bettaRefit.triOffset + i * 4u;
    let a = betta_vertex(s.x);
    let b = betta_vertex(s.y);
    let c = betta_vertex(s.z);
    textureStore(bettaTex, betta_texel(at), vec4f(a, w.x));
    textureStore(bettaTex, betta_texel(at + 1u), vec4f(b, w.y));
    textureStore(bettaTex, betta_texel(at + 2u), vec4f(c, w.z));
    lo = min(lo, min(a, min(b, c)));
    hi = max(hi, max(a, max(b, c)));
  }
  betta_box(leaf.x, lo, hi);
}

// The inner nodes, a level at a time (deepest first): each box round its children's.
@compute @workgroup_size(${BETTA_NODE_THREADS})
fn bettaNodes(@builtin(local_invocation_index) lid: u32) {
  for (var l = 0u; l < bettaRefit.levelCount; l++) {
    let level = bettaRecords[bettaRefit.levelsAt + l];
    for (var k = lid; k < level.y; k += ${BETTA_NODE_THREADS}u) {
      let r = bettaRecords[bettaRefit.innerAt + level.x + k];
      let left = (r.x + 1u) * 2u;
      let right = r.y * 2u;
      betta_box(r.x, min(bettaNodeBox[left].xyz, bettaNodeBox[right].xyz), max(bettaNodeBox[left + 1u].xyz, bettaNodeBox[right + 1u].xyz));
    }
    storageBarrier();
  }
}
`;
