// The furnishings' BVH refitted round the moving plants (src/render/scape/scapeRefit.mjs, on the
// texture packScape fills: scapeBVH.mjs): the plan covers every moving vertex, triangle and node
// above them; after the plants are moved (the kernels' CPU mirror, at several times and leans)
// every node's boxes hold its triangles, the tracer's walk over the refitted texels meets what a
// test of every triangle meets, and nothing of the driftwood's or the rocks' is written.
// Run: node --test scape-refit.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { packScape, traceCPU, triangleCPU, SCAPE_T_MIN } from './src/render/scape/scapeBVH.mjs';
import { stream } from './src/render/scape/mesh.mjs';
import { LEAF_STRIDE, MOTION_VERTEX_STRIDE as MS, leafPhases, plantMotionWGSL, plantSolids } from './src/render/scape/plantMotion.mjs';
import {
  PLANT_LEVEL_STRIDE, PLANT_NODE_U32, PLANT_VERT_FLOATS, refitBuffers, refitCPU, refitLayouts, refitPlan, refitUniforms, scapeRefitWGSL, skinCPU, trisCPU,
} from './src/render/scape/scapeRefit.mjs';

const fr = Math.fround;
const pieces = buildScapePieces();
const meshes = pieces.flatMap((p) => p.meshes);
const obstacles = pieces.filter((p) => p.name !== 'plants').flatMap((p) => p.obstacles);
const packed = packScape(meshes);
const rest = Float32Array.from(packed.data);
const t0 = performance.now();
const plan = refitPlan(packed, meshes, undefined, { obstacles });
const planMs = performance.now() - t0;
const solids = plantSolids(obstacles, plan.rest);
const D = packed.data;
const triBase = D[1], N = D[2], nodeCount = D[0];

/** Each slot's corners' vertex ids, as packed. */
const slotVerts = (X, t) => [Math.floor(X[(triBase + t * 3) * 4 + 3] / 8), X[(triBase + t * 3 + 1) * 4 + 3], X[(triBase + t * 3 + 2) * 4 + 3]];

/** The plants moved to time t (or by the leaves' phases, as the GPU has them; lean: a vec4 a leaf,
 *  or null), and the refit, into packed.data. */
function pose(t, lean = null) {
  const { dPos } = skinCPU(packed, plan, t, { lean, solids });
  trisCPU(packed, plan, dPos);
  refitCPU(packed, plan, dPos);
  return dPos;
}

/** A lean for every leaf: k times a direction of its own, mostly along +x. */
function leans(k, seed) {
  const rand = stream(seed), out = new Float32Array(plan.leafCount * 4);
  for (let i = 0; i < plan.leafCount; i++) out.set([k * (0.8 + 0.4 * rand()), k * 0.3 * (rand() - 0.5), k * 0.6 * (rand() - 0.5), 0], i * 4);
  return out;
}

/** Walks the tree from the texels: every node's two boxes against the corners of all the triangles
 *  under each (as the texels have them); returns the worst a box falls short (<= 0 when all hold),
 *  and the header's against the whole. */
function boxesHold(X) {
  let worst = -Infinity;
  const ext = (w) => {
    if (w < 0) {
      const p = -w - 1, s = Math.floor(p / 4), c = (p % 4) + 1;
      const e = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
      for (let t = s; t < s + c; t++) {
        for (let j = 0; j < 3; j++) {
          const o = (triBase + t * 3 + j) * 4;
          for (let k = 0; k < 3; k++) {
            e[k] = Math.min(e[k], X[o + k]);
            e[3 + k] = Math.max(e[3 + k], X[o + k]);
          }
        }
      }
      return e;
    }
    const at = (4 + w * 4) * 4;
    const e = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    for (let c = 0; c < 2; c++) {
      const sub = ext(X[at + c * 4 + 3]);
      const lo = at + c * 8, hi = lo + 4;
      for (let k = 0; k < 3; k++) {
        worst = Math.max(worst, X[lo + k] - sub[k], sub[3 + k] - X[hi + k]);
        e[k] = Math.min(e[k], sub[k]);
        e[3 + k] = Math.max(e[3 + k], sub[3 + k]);
      }
    }
    return e;
  };
  const all = ext(X[3]);
  for (let k = 0; k < 3; k++) worst = Math.max(worst, X[4 + k] - all[k], all[3 + k] - X[8 + k]);
  return worst;
}

/** The nearest triangle along (o, d) in (SCAPE_T_MIN, tEnd) by testing every one (the tracer's
 *  triangle test, a box round each first): { t, tri }. */
function bruteForce(boxes, X, o, d, tEnd) {
  const tE = fr(tEnd);
  let best = { t: tE, tri: 0xffffffff };
  const inv = d.map((x) => 1 / (Math.abs(x) < 1e-12 ? 1e-12 : x));
  for (let t = 0; t < N; t++) {
    const b = t * 6;
    let tn = 0, tf = tE * 1.0001 + 1e-6;
    for (let k = 0; k < 3; k++) {
      let a = (boxes[b + k] - 1e-6 - o[k]) * inv[k], c = (boxes[b + 3 + k] + 1e-6 - o[k]) * inv[k];
      if (a > c) [a, c] = [c, a];
      tn = Math.max(tn, a);
      tf = Math.min(tf, c);
    }
    if (tn > tf) continue;
    const at = (triBase + t * 3) * 4;
    const hit = triangleCPU(o, d, [X[at], X[at + 1], X[at + 2]], [X[at + 4], X[at + 5], X[at + 6]], [X[at + 8], X[at + 9], X[at + 10]]);
    if (hit !== null && hit > fr(SCAPE_T_MIN) && hit < best.t) best = { t: hit, tri: t };
  }
  return best;
}

function triangleBoxes(X) {
  const boxes = new Float64Array(N * 6);
  for (let t = 0; t < N; t++) {
    for (let k = 0; k < 3; k++) {
      const a = X[(triBase + t * 3) * 4 + k], b = X[(triBase + t * 3 + 1) * 4 + k], c = X[(triBase + t * 3 + 2) * 4 + k];
      boxes[t * 6 + k] = Math.min(a, b, c);
      boxes[t * 6 + 3 + k] = Math.max(a, b, c);
    }
  }
  return boxes;
}

test('the plan covers every moving vertex, the triangles they touch, and the nodes above them', () => {
  const movingIds = new Set();
  let vo = 0;
  for (const m of meshes) {
    if (m.motion) for (let v = 0; v < m.positions.length / 3; v++) if (m.motion.vertex[v * MS] >= 0) movingIds.add(vo + v);
    vo += m.positions.length / 3;
  }
  assert.equal(plan.moving, movingIds.size);
  for (let i = 0; i < plan.moving; i++) assert.ok(movingIds.has(plan.verts[i * PLANT_VERT_FLOATS + 3]) && plan.ids[i] === plan.verts[i * PLANT_VERT_FLOATS + 3]);
  // Every triangle with a moving corner is among the plan's slots, its words as packed.
  const inPlan = new Map();
  for (let e = 0; e < plan.slotCount; e++) inPlan.set(plan.slots[e * 4], e);
  let touched = 0;
  for (let t = 0; t < N; t++) {
    const vs = slotVerts(D, t);
    if (!vs.some((v) => movingIds.has(v))) continue;
    touched++;
    const e = inPlan.get(t);
    assert.ok(e !== undefined, `slot ${t} has a moving corner but is not in the plan`);
    assert.deepEqual([plan.slots[e * 4 + 1] >>> 3, plan.slots[e * 4 + 2], plan.slots[e * 4 + 3]], vs);
    assert.equal(plan.slots[e * 4 + 1], D[(triBase + t * 3) * 4 + 3]);
  }
  assert.equal(touched, plan.touched);
  // The levels: deepest first, each a run of records of one depth, the root's (node 0) last.
  let next = 0;
  plan.levels.forEach((l, i) => {
    assert.equal(l.first, next);
    next += l.count;
    if (i) assert.equal(l.depth, plan.levels[i - 1].depth - 1);
  });
  assert.equal(next, plan.nodeCount);
  assert.equal(plan.levels.at(-1).depth, 0);
  assert.equal(plan.nodes[(plan.nodeCount - 1) * PLANT_NODE_U32], 0);
  // A record's node words are its texels', and its refitted children were refitted a level below.
  for (let r = 0; r < plan.nodeCount; r++) {
    const o = r * PLANT_NODE_U32, k = plan.nodes[o];
    const f = new Float32Array(new Uint32Array([plan.nodes[o + 1], plan.nodes[o + 2]]).buffer);
    assert.equal(f[0], D[(4 + k * 4) * 4 + 3]);
    assert.equal(f[1], D[(5 + k * 4) * 4 + 3]);
    for (const c of [o + 4, o + 8]) if (plan.nodes[c] === 1) assert.ok(plan.nodes[c + 1] < r, `record ${r}'s child ${plan.nodes[c + 1]} is not refitted before it`);
  }
  const u = refitUniforms(plan);
  assert.equal(u.levels.byteLength, plan.levels.length * PLANT_LEVEL_STRIDE);
  console.log(`  ${plan.moving} moving vertices (${plan.leafCount} leaves), ${plan.slotCount} triangles rewritten (${plan.touched} with a moving corner), ${plan.nodeCount} of ${nodeCount} nodes refitted over ${plan.levels.length} levels; planned in ${planMs.toFixed(0)} ms`);
  const bytes = plan.verts.byteLength + plan.leaves.byteLength + plan.slots.byteLength + plan.nodes.byteLength + plan.statics.byteLength + plan.dPos.byteLength + plan.nodeCount * 32;
  console.log(`  the kernels' buffers: ${(bytes / 1048576).toFixed(1)} MB`);
});

test('moved and refitted: every box holds its triangles, the walk meets what every triangle meets, and the driftwood and the rocks are untouched', () => {
  const rand = stream(2024);
  // (The texels the kernels may write: the moving vertices' first texels, the plan's slots, the
  // refitted nodes' and the header's boxes.)
  const writable = new Uint8Array(D.length / 4);
  for (const id of plan.ids) writable[plan.vertBase + id * 2] = 1;
  for (let e = 0; e < plan.slotCount; e++) for (let j = 0; j < 3; j++) writable[triBase + plan.slots[e * 4] * 3 + j] = 1;
  for (let r = 0; r < plan.nodeCount; r++) for (let j = 0; j < 4; j++) writable[4 + plan.nodes[r * PLANT_NODE_U32] * 4 + j] = 1;
  writable[1] = writable[2] = 1;
  const movingSet = new Set(plan.ids);
  const poses = [[0.7, null], [3.1, leans(0.012, 1)], [8.4, null], [20.2, leans(0.035, 2)], [47.9, leans(-0.02, 3)], [leafPhases(plan.leaves, 86400.3), leans(0.02, 4)]];
  let rays = 0, agree = 0, ties = 0, hits = 0, plantHits = 0;
  for (const [t, lean] of poses) {
    const dPos = pose(t, lean);
    // Boxes.
    const short = boxesHold(D);
    assert.ok(short <= 0, `t ${t}: a box falls ${short} short of its triangles`);
    // Nothing else written; the slots with no moving corner rewritten as they were.
    for (let i = 0; i < D.length / 4; i++) {
      for (let c = 0; c < 4; c++) {
        if (writable[i] || Object.is(D[i * 4 + c], rest[i * 4 + c])) continue;
        assert.fail(`t ${t}: texel ${i} (.${c}) was written: ${rest[i * 4 + c]} -> ${D[i * 4 + c]}`);
      }
    }
    for (let e = 0; e < plan.slotCount; e++) {
      const s = plan.slots[e * 4];
      if (slotVerts(rest, s).some((v) => movingSet.has(v))) continue;
      for (let j = 0; j < 12; j++) assert.ok(Object.is(D[(triBase + s * 3) * 4 + j], rest[(triBase + s * 3) * 4 + j]), `t ${t}: still slot ${s} changed`);
    }
    // A corner shared by triangles is the same in all (bit for bit): its dPos.
    for (let e = 0; e < plan.slotCount; e++) {
      const s = plan.slots[e * 4], vs = slotVerts(D, s);
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) assert.ok(Object.is(D[(triBase + s * 3 + j) * 4 + k], dPos[vs[j] * 4 + k]));
    }
    // Rays through the plants: short ones from just off a moved vertex, and long ones from across
    // the bowl at one; the walk against every triangle.
    const boxes = triangleBoxes(D);
    for (let r = 0; r < 420; r++) {
      const id = plan.ids[Math.floor(rand() * plan.moving)];
      const target = [dPos[id * 4], dPos[id * 4 + 1], dPos[id * 4 + 2]];
      let d = [rand() - 0.5, rand() - 0.5, rand() - 0.5];
      const dl = Math.hypot(...d);
      d = d.map((x) => x / dl);
      let o, tEnd;
      if (r % 6) {
        const back = 0.02 + 0.15 * rand();
        o = target.map((x, k) => x - d[k] * back);
        tEnd = back + 0.05 + 0.2 * rand();
      } else {
        const a = rand() * 2 * Math.PI, z = rand() * 1.4 - 0.7;
        o = [0.9 * Math.cos(a) * Math.sqrt(1 - z * z), 0.9 * z * 0.6 - 0.1, 0.9 * Math.sin(a) * Math.sqrt(1 - z * z)];
        const to = target.map((x, k) => x - o[k] + (rand() - 0.5) * 0.004);
        const l = Math.hypot(...to);
        d = to.map((x) => x / l);
        tEnd = 3;
      }
      const walk = traceCPU(packed, o, d, tEnd);
      const brute = bruteForce(boxes, D, o, d, tEnd);
      rays++;
      if (walk.t === brute.t && walk.tri === brute.tri) agree++;
      else if (walk.t === brute.t) ties++;
      else assert.fail(`t ${typeof t === 'number' ? t : 'a day'}: ray ${r} from ${o.map((x) => x.toFixed(4))} along ${d.map((x) => x.toFixed(4))}: the walk met ${walk.tri} at ${walk.t}, every triangle ${brute.tri} at ${brute.t}`);
      if (brute.tri !== 0xffffffff) {
        hits++;
        if (slotVerts(D, brute.tri).some((v) => movingSet.has(v))) plantHits++;
      }
    }
  }
  console.log(`  ${poses.length} poses, ${rays} rays: the walk agrees with every triangle on ${agree} (and on ${ties} more but for which of two triangles at the same t); ${hits} hit, ${plantHits} of them a plant`);
  assert.ok(plantHits > rays * 0.5, 'too few rays met the plants');
});

test('the refitted boxes stay tight round the moved plants', () => {
  const area = (X) => {
    let a = 0;
    for (let r = 0; r < plan.nodeCount; r++) {
      const at = (4 + plan.nodes[r * PLANT_NODE_U32] * 4) * 4;
      for (const c of [0, 8]) {
        const dx = X[at + c + 4] - X[at + c], dy = X[at + c + 5] - X[at + c + 1], dz = X[at + c + 6] - X[at + c + 2];
        a += dx * dy + dy * dz + dz * dx;
      }
    }
    return a;
  };
  const a0 = area(rest);
  const ratios = [3.3, 11.6, 27.4].map((t) => (pose(t), area(D) / a0));
  console.log(`  the refitted nodes' boxes' area, moved against at rest: ${ratios.map((x) => x.toFixed(3)).join(', ')}`);
  for (const x of ratios) assert.ok(x < 1.35, `the refitted boxes grew ${x} times`);
});

test('the kernels\' WGSL, their bindings\' layouts and buffers, and only f32 literals in their arithmetic', () => {
  const w = scapeRefitWGSL(plantMotionWGSL(obstacles, plan.rest));
  assert.match(w.skin, /@compute @workgroup_size\(64\)\s*fn plantSkin\(/);
  assert.match(w.tris, /fn plantTris\(/);
  assert.match(w.refit, /fn plantRefit\(/);
  const layouts = refitLayouts(), buffers = refitBuffers(plan);
  for (const [src, names, layout] of [[w.skin, ['plantSkinParams', 'plantVerts', 'plantLeaves', 'plantLean', 'plantPhase', 'dPos', 'scapeTex'], layouts.skin],
    [w.tris, ['plantTrisParams', 'plantSlots', 'dPos', 'scapeTex'], layouts.tris],
    [w.refit, ['plantLevel', 'plantNodes', 'plantSlots', 'plantStatic', 'dPos', 'nodeBox', 'scapeTex'], layouts.refit]]) {
    assert.equal(layout.length, names.length);
    names.forEach((n, i) => {
      const m = src.match(new RegExp(`@group\\(0\\) @binding\\(${i}\\) var(<[^>]+>)? ${n}\\b`));
      assert.ok(m, `binding ${i}: ${n}`);
      // (Each layout's entry as the WGSL declares it, and a buffer for each but the texture.)
      const e = layout[i], kind = m[1] ?? '';
      assert.equal(e.binding, i);
      if (n === 'scapeTex') assert.equal(e.storageTexture?.format, 'rgba32float');
      else {
        assert.equal(e.buffer.type, kind === '<uniform>' ? 'uniform' : kind.includes('read_write') ? 'storage' : 'read-only-storage', `${n}'s layout`);
        const b = buffers[n];
        assert.ok(b && b.size >= 32 && b.size % 16 === 0 && (!b.data || b.data.byteLength <= b.size), `${n}'s buffer`);
      }
    });
  }
  assert.match(w.skin, /texture_storage_2d<rgba32float, write>/);
  assert.equal(layouts.refit[0].buffer.hasDynamicOffset, true);
  assert.equal(buffers.plantLevel.size, plan.levels.length * PLANT_LEVEL_STRIDE);
  assert.equal(buffers.plantLean.data, null);
  assert.equal(buffers.plantLean.size, plan.leafCount * 16);
  // (No integer literal left to be taken as abstract, in any kernel: every number has a point, an
  // exponent or a suffix, but a matrix's column index and the attributes' numbers.)
  for (const src of [w.skin, w.tris, w.refit]) {
    const code = src.replace(/\/\/[^\n]*/g, '').replace(/@\w+\([^)]*\)/g, '');
    const bare = code.match(/(?<![\w.[]|[eE][-+])\d+(?![\w.\]])/g) ?? [];
    assert.deepEqual(bare, [], `bare integer literals: ${bare.join(' ')}`);
  }
});

test('the plan has the solids the shader bakes, and where each leaf\'s tip is for its lean', () => {
  assert.deepEqual(plan.solids, plantSolids(obstacles, plan.rest));
  assert.ok(plan.statics.length >= 8);
  // (Each leaf's tip: its blade's vertex at u = 1, and the blade's length.)
  let seen = 0;
  for (const ml of plan.meshLeaves) {
    const m = meshes[ml.mesh];
    for (let v = 0; v < m.positions.length / 3; v++) {
      if (m.motion.vertex[v * MS] < 0 || m.motion.vertex[v * MS + 2] !== 1) continue;
      const li = ml.first + m.motion.vertex[v * MS];
      assert.deepEqual(Array.from(plan.leafTips.subarray(li * 4, li * 4 + 3)), Array.from(m.positions.subarray(v * 3, v * 3 + 3)));
      assert.equal(plan.leafTips[li * 4 + 3], plan.leaves[li * LEAF_STRIDE + 11]);
      seen++;
    }
  }
  assert.equal(seen, plan.leafCount);
});
