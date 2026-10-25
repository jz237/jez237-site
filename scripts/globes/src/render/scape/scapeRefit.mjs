// The betta bowl's plants moving inside the furnishings' BVH (its page only). Every frame the GPU
// moves the plants' vertices (plantMotion.mjs), rewrites their triangles' corners and refits the
// boxes of the tree's nodes above them, bottom up, in place in the texture packScape filled
// (scapeBVH.mjs). The tree's shape and numbering, and everything not over a moving triangle, stay
// as packed: the driftwood's and the rocks' texels are never written.
//
// refitPlan works out, once on the CPU after packScape, what moves and what each kernel does; the
// kernels (scapeRefitWGSL) then run every frame, in this order (64 threads a workgroup):
//   1. plantSkin    ceil(plan.moving / 64) workgroups: each moving vertex displaced and collided
//                   into dPos (the positions of all the BVH's vertices; the still ones uploaded once,
//                   from plan.dPos), its normal into its vertex texel.
//   2. plantTris    ceil(plan.slotCount / 64): each triangle of a leaf of the tree that has a moving
//                   corner (and its leaf-mates) rewritten from dPos, its corners' w words as packed.
//   3. plantRefit   once a level of plan.levels (deepest first; the level's range in a uniform at
//                   a dynamic offset, PLANT_LEVEL_STRIDE bytes apart): ceil(level.count / 64) each.
//                   Each node of the level rewrites its two children's boxes (a leaf's from its
//                   triangles' corners in dPos, padded outward; a node below's from nodeBox; one
//                   that does not move as packed) and keeps its own in nodeBox; the root also writes
//                   the header's box (texels 1, 2).
// Before them each frame, the integrator writes each leaf's phases (plantPhase: leafPhases(plan.
// leaves, t), t in seconds as a JS number, from any origin) and its lean (plantLean: a vec4 a leaf,
// in plan.leaves' order; zeros for none, and zeros to begin with). All three in one compute pass
// is fine (each dispatch sees the last one's storage writes); the trace then reads the texture as
// before (texture_2d<f32>). The texture needs STORAGE_BINDING as well as TEXTURE_BINDING usage
// (rgba32float storage textures are write-only in core WebGPU, which is all these kernels need).
// refitBuffers and refitLayouts have what to allocate and the bind group layouts (plantRefit's
// uniform takes a dynamic offset, so its layout cannot be 'auto'); plan.leafTips, where to sample
// the water for each leaf's lean. On an RTX 5090 a frame of the three, its phases' upload with it,
// takes about 0.1 ms (34,912 vertices, 64,805 triangles, 20,847 nodes over 22 levels).

import { LEAF_STRIDE, MOTION_VERTEX_STRIDE, forgetMotion, leafPhases, moveVertex, plantCollide, plantSolids, tamedLeaves } from './plantMotion.mjs';

/** Floats a moving vertex takes in plan.verts (seven vec4s: [rest.xyz, vertex id] [n.xyz, attrs.x]
 *  and its motion's five, plantMotion.mjs). */
export const PLANT_VERT_FLOATS = 8 + MOTION_VERTEX_STRIDE;
/** u32s a node record takes in plan.nodes (three vec4u: [node, child word 0's bits, child word 1's
 *  bits, 0], then each child [kind, a, b, 0]: kind 0 a box that does not move (plan.statics[a],
 *  two vec4s: lo, hi), 1 a node refitted a level below (its record a: nodeBox[2a], [2a + 1]), 2 a
 *  leaf of the tree (b triangles, their entries plan.slots[a ..])). */
export const PLANT_NODE_U32 = 12;
/** Bytes between the levels' uniforms (a dynamic offset must be a multiple of 256). */
export const PLANT_LEVEL_STRIDE = 256;
/** The workgroup size of every kernel. */
export const PLANT_WORKGROUP = 64;

const fr = Math.fround;
const f32b = new Float32Array(1);
const u32b = new Uint32Array(f32b.buffer);
const bitsOf = (x) => {
  f32b[0] = x;
  return u32b[0];
};

/**
 * What moves, and the kernels' work, for the BVH packScape(meshes) made (layout 'stack').
 * isMoving(mesh, index): whether a mesh's vertices move (by default, a mesh with motion: the plants).
 * options.obstacles (the driftwood's and the rocks'; the plants' own are passed over): each leaf
 * whose motion would carry it into their solids or the glass is calmed (plantMotion.mjs's
 * tamedLeaves, options.allow and options.minScale its own) in the plan's copy of the leaf tables
 * (the meshes are left as they are); plan.scales has each leaf's. Without them the leaves keep
 * their full motion: the page passes them.
 * Returns (typed arrays to upload once, as their names say):
 *   verts     Float32Array, PLANT_VERT_FLOATS a moving vertex          -> plantVerts
 *   leaves    Float32Array, LEAF_STRIDE a leaf (the moving meshes' in turn; a vertex's leaf is its
 *             index here)                                              -> plantLeaves
 *   slots     Uint32Array, four a triangle: [slot, va * 8 + material, vb, vc]  -> plantSlots
 *   nodes     Uint32Array, PLANT_NODE_U32 a node record, deepest level first   -> plantNodes
 *   statics   Float32Array, eight a box that does not move (one of zeros if none) -> plantStatic
 *   dPos      Float32Array, four a vertex of the whole BVH (its rest position) -> dPos's start
 * and moving, leafCount, slotCount, touched (the slots with a moving corner), nodeCount, levels
 * ([{ depth, first, count }], deepest first), ids (each moving vertex's id), rest (their rest
 * positions, xyz each: for plantMotionWGSL), solids (plantSolids(obstacles, rest): what
 * plantMotionWGSL(obstacles, rest) bakes), scales (each leaf's calming, 1 for none), leafTips
 * (Float32Array, four a leaf: its blade's tip at rest and the blade's length; where to sample the
 * water for its lean), triBase, vertBase, vertexCount, meshLeaves (each moving mesh's { mesh,
 * first, count } of the leaves).
 */
export function refitPlan(packed, meshes, isMoving = (m) => !!m.motion, options = {}) {
  const D = packed.data;
  if (D[12] !== 2) throw new Error('refitPlan: the BVH is not in the shader\'s layout (packScape layout "stack")');
  const nodeCount = D[0], triBase = D[1], N = D[2], vertBase = D[7], V = D[11];
  const root = D[3];
  if (N === 0 || root < 0 || nodeCount === 0) throw new Error('refitPlan: the tree has no internal node to refit');

  // The moving vertices, their leaves (the tables in turn) and the positions of all.
  const dPos = new Float32Array(V * 4);
  const moving = new Int32Array(V).fill(-1);
  const meshLeaves = [];
  let vo = 0, leafCount = 0, count = 0;
  meshes.forEach((m, mi) => {
    const vc = m.positions.length / 3;
    for (let v = 0; v < vc; v++) dPos.set([m.positions[v * 3], m.positions[v * 3 + 1], m.positions[v * 3 + 2], 0], (vo + v) * 4);
    if (isMoving(m, mi) && m.motion) {
      const n = m.motion.leaves.length / LEAF_STRIDE;
      meshLeaves.push({ mesh: mi, first: leafCount, count: n, vo });
      for (let v = 0; v < vc; v++) if (m.motion.vertex[v * MOTION_VERTEX_STRIDE] >= 0) moving[vo + v] = count++;
      leafCount += n;
    }
    vo += vc;
  });
  if (vo !== V) throw new Error(`refitPlan: the meshes have ${vo} vertices, the BVH ${V}`);
  const verts = new Float32Array(count * PLANT_VERT_FLOATS);
  const ids = new Uint32Array(count);
  const rest = new Float32Array(count * 3);
  const leaves = new Float32Array(leafCount * LEAF_STRIDE);
  const leafTips = new Float32Array(leafCount * 4);
  const scales = new Array(leafCount).fill(1);
  meshLeaves.forEach(({ mesh: mi, first, vo: o }) => {
    const m = meshes[mi];
    for (let v = 0; v < m.positions.length / 3; v++) {
      const i = moving[o + v];
      if (i < 0) continue;
      const mv = m.motion.vertex.subarray(v * MOTION_VERTEX_STRIDE, (v + 1) * MOTION_VERTEX_STRIDE);
      const at = i * PLANT_VERT_FLOATS;
      const p = [m.positions[v * 3], m.positions[v * 3 + 1], m.positions[v * 3 + 2]];
      verts.set([...p, o + v], at);
      verts.set([m.normals[v * 3], m.normals[v * 3 + 1], m.normals[v * 3 + 2], m.attrs[v * 4]], at + 4);
      verts.set(mv, at + 8);
      verts[at + 8] = mv[0] + first;
      ids[i] = o + v;
      rest.set(p, i * 3);
      // (A blade's tip: its one vertex at u = 1.)
      if (mv[2] === 1) leafTips.set([...p, m.motion.leaves[mv[0] * LEAF_STRIDE + 11]], (first + mv[0]) * 4);
    }
  });
  // Each leaf calmed against the solids the shader keeps it out of (all the moving meshes' rest
  // poses keeping them clear), in the plan's copy of its table.
  const solids = plantSolids(options.obstacles ?? [], rest);
  meshLeaves.forEach(({ mesh: mi, first }) => {
    const m = meshes[mi];
    let L = m.motion.leaves;
    if (options.obstacles) {
      const calm = tamedLeaves(m, options.obstacles, { ...options, solids });
      L = calm.leaves;
      calm.scales.forEach((x, i) => (scales[first + i] = x));
    }
    leaves.set(L, first * LEAF_STRIDE);
  });

  // The triangles with a moving corner.
  const word = (t, c) => D[(triBase + t * 3 + c) * 4 + 3];
  const touched = new Uint8Array(N);
  let touchedCount = 0;
  for (let t = 0; t < N; t++) {
    const va = Math.floor(word(t, 0) / 8), vb = word(t, 1), vc = word(t, 2);
    if (moving[va] >= 0 || moving[vb] >= 0 || moving[vc] >= 0) {
      touched[t] = 1;
      touchedCount++;
    }
  }

  // The tree from its texels (preorder: a node's children come after it), the nodes over them.
  const childWords = (k) => [D[(4 + k * 4) * 4 + 3], D[(5 + k * 4) * 4 + 3]];
  const leafRange = (w) => {
    const p = -w - 1;
    return [Math.floor(p / 4), (p % 4) + 1];
  };
  const leafMoves = (w) => {
    const [s, c] = leafRange(w);
    for (let t = s; t < s + c && t < N; t++) if (touched[t]) return true;
    return false;
  };
  const depth = new Int32Array(nodeCount).fill(-1);
  depth[root] = 0;
  for (let k = 0; k < nodeCount; k++) {
    if (depth[k] < 0) continue;
    for (const w of childWords(k)) if (w >= 0) depth[w] = depth[k] + 1;
  }
  const dirty = new Uint8Array(nodeCount);
  for (let k = nodeCount - 1; k >= 0; k--) {
    if (depth[k] < 0) continue;
    dirty[k] = childWords(k).some((w) => (w < 0 ? leafMoves(w) : dirty[w] === 1)) ? 1 : 0;
  }
  const order = [];
  for (let k = 0; k < nodeCount; k++) if (dirty[k]) order.push(k);
  order.sort((a, b) => depth[b] - depth[a] || a - b);
  const record = new Int32Array(nodeCount).fill(-1);
  order.forEach((k, r) => (record[k] = r));
  const nodes = new Uint32Array(order.length * PLANT_NODE_U32);
  const slots = [], statics = [];
  order.forEach((k, r) => {
    const ws = childWords(k);
    nodes.set([k, bitsOf(ws[0]), bitsOf(ws[1]), 0], r * PLANT_NODE_U32);
    ws.forEach((w, c) => {
      const at = r * PLANT_NODE_U32 + 4 + c * 4;
      if (w < 0 && leafMoves(w)) {
        const [s, n] = leafRange(w);
        nodes.set([2, slots.length / 4, n, 0], at);
        for (let t = s; t < s + n; t++) slots.push(t, Math.round(word(t, 0)), word(t, 1), word(t, 2));
      } else if (w >= 0 && dirty[w]) {
        nodes.set([1, record[w], 0, 0], at);
      } else {
        // (As packed: the parent's texels for this child.)
        const lo = (4 + k * 4 + c * 2) * 4, hi = lo + 4;
        nodes.set([0, statics.length / 8, 0, 0], at);
        statics.push(D[lo], D[lo + 1], D[lo + 2], 0, D[hi], D[hi + 1], D[hi + 2], 0);
      }
    });
  });
  const levels = [];
  order.forEach((k, r) => {
    const d = depth[k];
    if (!levels.length || levels[levels.length - 1].depth !== d) levels.push({ depth: d, first: r, count: 0 });
    levels[levels.length - 1].count++;
  });
  // (A buffer may not be empty: a box of zeros no record reads, if every child moves.)
  if (!statics.length) statics.push(0, 0, 0, 0, 0, 0, 0, 0);
  return {
    moving: count,
    verts,
    ids,
    rest,
    solids,
    leaves,
    leafCount,
    leafTips,
    scales,
    meshLeaves: meshLeaves.map(({ mesh, first, count: n }) => ({ mesh, first, count: n })),
    slots: Uint32Array.from(slots),
    slotCount: slots.length / 4,
    touched: touchedCount,
    nodes,
    nodeCount: order.length,
    statics: Float32Array.from(statics),
    levels,
    dPos,
    triBase,
    vertBase,
    vertexCount: V,
  };
}

/** The kernels' uniforms as the plan has them, all written once: skin (16 bytes: count, vertBase),
 *  tris (16 bytes: count, triBase) and levels (PLANT_LEVEL_STRIDE bytes a level, in plan.levels'
 *  order: first, count, vertBase, vertexCount). */
export function refitUniforms(plan) {
  const skin = new ArrayBuffer(16);
  new Uint32Array(skin).set([plan.moving, plan.vertBase, 0, 0]);
  const tris = new ArrayBuffer(16);
  new Uint32Array(tris).set([plan.slotCount, plan.triBase, 0, 0]);
  const levels = new ArrayBuffer(Math.max(1, plan.levels.length) * PLANT_LEVEL_STRIDE);
  plan.levels.forEach((l, i) => new Uint32Array(levels, i * PLANT_LEVEL_STRIDE, 4).set([l.first, l.count, plan.vertBase, plan.vertexCount]));
  return { skin, tris, levels };
}

/**
 * The kernels' buffers, by their WGSL names: { data (to upload once; null: zeros to begin with),
 * size (bytes: never 0, a multiple of 16), usage ('uniform' | 'storage') }. plantLean and
 * plantPhase are written every frame (COPY_DST), dPos starts as plan.dPos; nodeBox is the
 * kernels' own. Uniforms: plantSkinParams, plantTrisParams, plantLevel (the levels, one a dynamic
 * offset: PLANT_LEVEL_STRIDE bytes apart, bound 16 bytes at a time).
 */
export function refitBuffers(plan, t = 0) {
  const u = refitUniforms(plan);
  const at = (data, usage, bytes = data.byteLength) => ({ data, size: Math.max(32, Math.ceil(bytes / 16) * 16), usage });
  return {
    plantSkinParams: at(new Uint8Array(u.skin), 'uniform'),
    plantTrisParams: at(new Uint8Array(u.tris), 'uniform'),
    plantLevel: at(new Uint8Array(u.levels), 'uniform'),
    plantVerts: at(plan.verts, 'storage'),
    plantLeaves: at(plan.leaves, 'storage'),
    plantLean: at(null, 'storage', plan.leafCount * 16),
    plantPhase: at(leafPhases(plan.leaves, t), 'storage'),
    plantSlots: at(plan.slots, 'storage'),
    plantNodes: at(plan.nodes, 'storage'),
    plantStatic: at(plan.statics, 'storage'),
    dPos: at(plan.dPos, 'storage'),
    nodeBox: at(null, 'storage', plan.nodeCount * 32),
  };
}

/**
 * The three kernels' bind group layouts (for device.createBindGroupLayout({ entries }), group 0;
 * their pipelines' layouts from these, not 'auto'): { skin, tris, refit }, each its entries, in the
 * bindings' order scapeRefitWGSL gives (visibility 4: GPUShaderStage.COMPUTE).
 */
export function refitLayouts() {
  const C = 4;
  const uniform = (binding, dynamic = false) => ({ binding, visibility: C, buffer: { type: 'uniform', hasDynamicOffset: dynamic, minBindingSize: 16 } });
  const read = (binding) => ({ binding, visibility: C, buffer: { type: 'read-only-storage' } });
  const write = (binding) => ({ binding, visibility: C, buffer: { type: 'storage' } });
  const tex = (binding) => ({ binding, visibility: C, storageTexture: { access: 'write-only', format: 'rgba32float', viewDimension: '2d' } });
  return {
    skin: [uniform(0), read(1), read(2), read(3), read(4), write(5), tex(6)],
    tris: [uniform(0), read(1), read(2), tex(3)],
    refit: [uniform(0, true), read(1), read(2), read(3), read(4), write(5), tex(6)],
  };
}

// ---- the CPU mirror ---------------------------------------------------------------------------------

/**
 * plantSkin on the CPU: dPos (a copy of plan.dPos, or into opts.dPos) with every moving vertex moved
 * to time t (lean: 4 floats a leaf of plan.leaves, or null) and pushed out of solids (by default
 * plan.solids, as plantMotionWGSL bakes them; null: the glass only); each moving vertex's texel
 * [n, attrs.x] written into packed.data. Returns { dPos, normals } (normals: three a moving vertex).
 * stats (optional): the pushes, as plantMotion.mjs's movePlant counts them.
 */
export function skinCPU(packed, plan, t, { lean = null, solids = plan.solids, dPos = null, stats = null } = {}) {
  const out = dPos ?? Float32Array.from(plan.dPos);
  const D = packed.data, W = plan.verts;
  const normals = new Float32Array(plan.moving * 3);
  const p = [0, 0, 0];
  forgetMotion();
  for (let i = 0; i < plan.moving; i++) {
    const o = i * PLANT_VERT_FLOATS;
    moveVertex(W, o, W, o + 4, W, o + 8, plan.leaves, lean, t, p, 0, normals.subarray(i * 3, i * 3 + 3));
    const d = plantCollide(p, 0, solids);
    if (stats) {
      stats.points++;
      if (d > 0) {
        stats.pushed++;
        stats.sum += d;
        stats.max = Math.max(stats.max, d);
      }
    }
    const id = W[o + 3];
    out[id * 4] = p[0];
    out[id * 4 + 1] = p[1];
    out[id * 4 + 2] = p[2];
    const at = (plan.vertBase + id * 2) * 4;
    D[at] = normals[i * 3];
    D[at + 1] = normals[i * 3 + 1];
    D[at + 2] = normals[i * 3 + 2];
    D[at + 3] = W[o + 7];
  }
  return { dPos: out, normals };
}

/** plantTris on the CPU: the plan's triangles rewritten into packed.data from dPos. */
export function trisCPU(packed, plan, dPos) {
  const D = packed.data, S = plan.slots;
  for (let e = 0; e < plan.slotCount; e++) {
    const at = (plan.triBase + S[e * 4] * 3) * 4;
    const vs = [S[e * 4 + 1] >>> 3, S[e * 4 + 2], S[e * 4 + 3]];
    const ws = [S[e * 4 + 1], S[e * 4 + 2], S[e * 4 + 3]];
    for (let c = 0; c < 3; c++) {
      D[at + c * 4] = dPos[vs[c] * 4];
      D[at + c * 4 + 1] = dPos[vs[c] * 4 + 1];
      D[at + c * 4 + 2] = dPos[vs[c] * 4 + 2];
      D[at + c * 4 + 3] = ws[c];
    }
  }
}

/** A box's bound padded outward (f32, as plant_childBox): 2e-6 + 1e-6 |x| each way. */
const PAD0 = fr(2e-6), PAD1 = fr(1e-6);
const padDown = (x) => fr(x - fr(PAD0 + fr(PAD1 * Math.abs(x))));
const padUp = (x) => fr(x + fr(PAD0 + fr(PAD1 * Math.abs(x))));

/**
 * plantRefit on the CPU, every level in turn: the plan's nodes' texels and the header's box written
 * into packed.data from dPos (after trisCPU), as the kernel does. Returns nodeBox (eight floats a
 * record: lo, 0, hi, 0).
 */
export function refitCPU(packed, plan, dPos) {
  const D = packed.data, R = plan.nodes, S = plan.slots, B = plan.statics;
  const nodeBox = new Float32Array(plan.nodeCount * 8);
  const box = (c, out) => {
    const kind = R[c], a = R[c + 1], b = R[c + 2];
    if (kind === 1) {
      for (let k = 0; k < 3; k++) {
        out[k] = nodeBox[a * 8 + k];
        out[3 + k] = nodeBox[a * 8 + 4 + k];
      }
    } else if (kind === 2) {
      out.fill(Infinity, 0, 3);
      out.fill(-Infinity, 3, 6);
      for (let e = a; e < a + b; e++) {
        for (const v of [S[e * 4 + 1] >>> 3, S[e * 4 + 2], S[e * 4 + 3]]) {
          for (let k = 0; k < 3; k++) {
            const x = dPos[v * 4 + k];
            if (x < out[k]) out[k] = x;
            if (x > out[3 + k]) out[3 + k] = x;
          }
        }
      }
      for (let k = 0; k < 3; k++) {
        out[k] = padDown(out[k]);
        out[3 + k] = padUp(out[3 + k]);
      }
    } else {
      for (let k = 0; k < 3; k++) {
        out[k] = B[a * 8 + k];
        out[3 + k] = B[a * 8 + 4 + k];
      }
    }
  };
  const b0 = new Float64Array(6), b1 = new Float64Array(6);
  for (const level of plan.levels) {
    for (let r = level.first; r < level.first + level.count; r++) {
      const o = r * PLANT_NODE_U32;
      const k = R[o];
      box(o + 4, b0);
      box(o + 8, b1);
      const at = (4 + k * 4) * 4;
      u32b[0] = R[o + 1];
      const w0 = f32b[0];
      u32b[0] = R[o + 2];
      const w1 = f32b[0];
      D.set([b0[0], b0[1], b0[2], w0, b0[3], b0[4], b0[5], w1, b1[0], b1[1], b1[2], 0, b1[3], b1[4], b1[5], 0], at);
      for (let j = 0; j < 3; j++) {
        nodeBox[r * 8 + j] = Math.min(b0[j], b1[j]);
        nodeBox[r * 8 + 4 + j] = Math.max(b0[3 + j], b1[3 + j]);
      }
      if (k === 0) {
        D.set([nodeBox[r * 8], nodeBox[r * 8 + 1], nodeBox[r * 8 + 2], plan.vertBase], 4);
        D.set([nodeBox[r * 8 + 4], nodeBox[r * 8 + 5], nodeBox[r * 8 + 6], plan.vertexCount], 8);
      }
    }
  }
  return nodeBox;
}

// ---- the kernels --------------------------------------------------------------------------------------

/**
 * The kernels' WGSL, one module each (motionWGSL: plantMotionWGSL's, built with the driftwood's and
 * the rocks' obstacles and plan.rest). Their bindings, all @group(0):
 *   skin  (entry point plantSkin)
 *     0  var<uniform> plantSkinParams: PlantSkinParams { count: u32, vertBase: u32, pad0: u32, pad1: u32 }
 *     1  var<storage, read> plantVerts: array<vec4f>          plan.verts
 *     2  var<storage, read> plantLeaves: array<vec4f>         plan.leaves
 *     3  var<storage, read> plantLean: array<vec4f>           a leaf's lean (xyz), every frame
 *     4  var<storage, read> plantPhase: array<vec4f>          leafPhases(plan.leaves, t), every frame
 *     5  var<storage, read_write> dPos: array<vec4f>          every vertex's position (plan.dPos first)
 *     6  var scapeTex: texture_storage_2d<rgba32float, write>  the BVH's texture
 *   tris  (plantTris)
 *     0  var<uniform> plantTrisParams: PlantTrisParams { count: u32, triBase: u32, pad0: u32, pad1: u32 }
 *     1  var<storage, read> plantSlots: array<vec4u>          plan.slots
 *     2  var<storage, read> dPos: array<vec4f>
 *     3  var scapeTex: texture_storage_2d<rgba32float, write>
 *   refit (plantRefit)
 *     0  var<uniform> plantLevel: PlantLevel { first: u32, count: u32, vertBase: u32, vertCount: u32 }
 *        (bound with a dynamic offset: refitUniforms(plan).levels, PLANT_LEVEL_STRIDE a level)
 *     1  var<storage, read> plantNodes: array<vec4u>          plan.nodes
 *     2  var<storage, read> plantSlots: array<vec4u>          plan.slots
 *     3  var<storage, read> plantStatic: array<vec4f>         plan.statics
 *     4  var<storage, read> dPos: array<vec4f>
 *     5  var<storage, read_write> nodeBox: array<vec4f>       two a node record (plan.nodeCount * 2)
 *     6  var scapeTex: texture_storage_2d<rgba32float, write>
 */
export function scapeRefitWGSL(motionWGSL) {
  const texel = /* wgsl */ `
fn plant_texel(i: u32) -> vec2i {
  return vec2i(i32(i & 1023u), i32(i >> 10u));
}
`;
  const skin = /* wgsl */ `
// ---- the plants' vertices moved (src/render/scape/scapeRefit.mjs) ------------------------------
struct PlantSkinParams {
  count: u32,
  vertBase: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> plantSkinParams: PlantSkinParams;
@group(0) @binding(1) var<storage, read> plantVerts: array<vec4f>;
@group(0) @binding(2) var<storage, read> plantLeaves: array<vec4f>;
@group(0) @binding(3) var<storage, read> plantLean: array<vec4f>;
@group(0) @binding(4) var<storage, read> plantPhase: array<vec4f>;
@group(0) @binding(5) var<storage, read_write> dPos: array<vec4f>;
@group(0) @binding(6) var scapeTex: texture_storage_2d<rgba32float, write>;
${motionWGSL}
${texel}
// One moving vertex: displaced, kept out of the solids, its normal to its texel.
@compute @workgroup_size(${PLANT_WORKGROUP})
fn plantSkin(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantSkinParams.count) { return; }
  let o = i * 7u;
  let r = plantVerts[o];
  let n = plantVerts[o + 1u];
  let m = plant_move(r.xyz, n.xyz, PlantMV(plantVerts[o + 2u], plantVerts[o + 3u], plantVerts[o + 4u], plantVerts[o + 5u], plantVerts[o + 6u]));
  let id = u32(r.w);
  dPos[id] = vec4f(plant_collide(m.p), 0.0);
  textureStore(scapeTex, plant_texel(plantSkinParams.vertBase + id * 2u), vec4f(m.n, n.w));
}
`;
  const tris = /* wgsl */ `
// ---- the plants' triangles rewritten (src/render/scape/scapeRefit.mjs) -------------------------
struct PlantTrisParams {
  count: u32,
  triBase: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> plantTrisParams: PlantTrisParams;
@group(0) @binding(1) var<storage, read> plantSlots: array<vec4u>;
@group(0) @binding(2) var<storage, read> dPos: array<vec4f>;
@group(0) @binding(3) var scapeTex: texture_storage_2d<rgba32float, write>;
${texel}
// One triangle: its corners from dPos (so corners it shares are bit for bit its neighbours'), their
// words as packed (va * 8 + material, vb, vc).
@compute @workgroup_size(${PLANT_WORKGROUP})
fn plantTris(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantTrisParams.count) { return; }
  let e = plantSlots[i];
  let at = plantTrisParams.triBase + e.x * 3u;
  textureStore(scapeTex, plant_texel(at), vec4f(dPos[e.y >> 3u].xyz, f32(e.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(dPos[e.z].xyz, f32(e.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(dPos[e.w].xyz, f32(e.w)));
}
`;
  const refit = /* wgsl */ `
// ---- the boxes over the plants refitted, one level of the tree (src/render/scape/scapeRefit.mjs) --
struct PlantLevel {
  first: u32,
  count: u32,
  vertBase: u32,
  vertCount: u32,
}

struct PlantBox {
  lo: vec3f,
  hi: vec3f,
}

@group(0) @binding(0) var<uniform> plantLevel: PlantLevel;
@group(0) @binding(1) var<storage, read> plantNodes: array<vec4u>;
@group(0) @binding(2) var<storage, read> plantSlots: array<vec4u>;
@group(0) @binding(3) var<storage, read> plantStatic: array<vec4f>;
@group(0) @binding(4) var<storage, read> dPos: array<vec4f>;
@group(0) @binding(5) var<storage, read_write> nodeBox: array<vec4f>;
@group(0) @binding(6) var scapeTex: texture_storage_2d<rgba32float, write>;
${texel}
// A child's box: a node's refitted a level below, a leaf's from its triangles' corners (padded
// outward a little, as packScape's), or one that does not move, as packed.
fn plant_childBox(c: vec4u) -> PlantBox {
  if (c.x == 1u) {
    return PlantBox(nodeBox[c.y * 2u].xyz, nodeBox[c.y * 2u + 1u].xyz);
  }
  if (c.x == 2u) {
    var lo = vec3f(3.0e38);
    var hi = vec3f(-3.0e38);
    for (var j = 0u; j < c.z; j++) {
      let e = plantSlots[c.y + j];
      let a = dPos[e.y >> 3u].xyz;
      let b = dPos[e.z].xyz;
      let d = dPos[e.w].xyz;
      lo = min(lo, min(a, min(b, d)));
      hi = max(hi, max(a, max(b, d)));
    }
    return PlantBox(lo - (vec3f(2e-6) + 1e-6 * abs(lo)), hi + (vec3f(2e-6) + 1e-6 * abs(hi)));
  }
  return PlantBox(plantStatic[c.y * 2u].xyz, plantStatic[c.y * 2u + 1u].xyz);
}

// One node of the level: its children's boxes into its texels, its own into nodeBox (and the
// header's at the root).
@compute @workgroup_size(${PLANT_WORKGROUP})
fn plantRefit(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x >= plantLevel.count) { return; }
  let r = plantLevel.first + gid.x;
  let h = plantNodes[r * 3u];
  let b0 = plant_childBox(plantNodes[r * 3u + 1u]);
  let b1 = plant_childBox(plantNodes[r * 3u + 2u]);
  let at = 4u + h.x * 4u;
  textureStore(scapeTex, plant_texel(at), vec4f(b0.lo, bitcast<f32>(h.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(b0.hi, bitcast<f32>(h.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(b1.lo, 0.0));
  textureStore(scapeTex, plant_texel(at + 3u), vec4f(b1.hi, 0.0));
  let lo = min(b0.lo, b1.lo);
  let hi = max(b0.hi, b1.hi);
  nodeBox[r * 2u] = vec4f(lo, 0.0);
  nodeBox[r * 2u + 1u] = vec4f(hi, 0.0);
  if (h.x == 0u) {
    textureStore(scapeTex, vec2i(1i, 0i), vec4f(lo, f32(plantLevel.vertBase)));
    textureStore(scapeTex, vec2i(2i, 0i), vec4f(hi, f32(plantLevel.vertCount)));
  }
}
`;
  return { skin, tris, refit };
}

