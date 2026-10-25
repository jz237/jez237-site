// The betta bowl's plants in motion (src/render/scape/plantMotion.mjs, the data plants.mjs puts on
// their meshes): the stalks' feet, the crowns and the roots stay put and the blades stay on their
// stalks; the tips move clearly but never wildly; nothing leaves the glass or goes into the
// driftwood or the rocks over a minute of it (plant_collide, seldom needed); the normals follow
// the surface; nothing stretches, not even under a strong lean; the lean bends a leaf its way; the
// phases the shader is given in place of the time keep their precision however long the page is
// open; all of it the same every time and at any detail; and the WGSL has what the kernels need.
// Run: node --test plant-motion.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as plants from './src/render/scape/plants.mjs';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { BED_LEVEL, GLASS_CLEAR, MAT } from './src/render/scape/mesh.mjs';
import { packScape, traceCPU } from './src/render/scape/scapeBVH.mjs';
import {
  COLLIDE_SOFT, FLOOR, LEAF_STRIDE, LEAN_CAP, MOTION_VERTEX_STRIDE as MS, PHASE_STRIDE, PLANT_MOTION,
  displacePlantVertex, forgetMotion, leafPhases, leafReach, moveVertex, movePlant, plantCollide, plantMotionWGSL, plantNormal, plantSolids, tamedLeaves,
} from './src/render/scape/plantMotion.mjs';

const piece = plants.build();
const [tall, small] = piece.meshes;
const pieces = buildScapePieces();
const obstacles = pieces.filter((p) => p.name !== 'plants').flatMap((p) => p.obstacles);
const fmt = (p) => Array.from(p, (x) => x.toFixed(3)).join(', ');
/** Both plants' moving vertices at rest, xyz each, and the solids the shader bakes from them. */
const rest = [];
for (const m of piece.meshes) {
  for (let v = 0; v < m.positions.length / 3; v++) if (m.motion.vertex[v * MS] >= 0) rest.push(m.positions[v * 3], m.positions[v * 3 + 1], m.positions[v * 3 + 2]);
}
const solids = plantSolids(obstacles, rest);

/** Each vertex's material (of a triangle it is a corner of). */
function vertexMaterials(m) {
  const out = new Uint8Array(m.positions.length / 3);
  for (let t = 0; t < m.materials.length; t++) for (let j = 0; j < 3; j++) out[m.indices[t * 3 + j]] = m.materials[t];
  return out;
}

/** A mesh's moving vertices moved to time t (positions only, no collide): a new array. */
function moved(m, t, leaves = m.motion.leaves, lean = null) {
  const out = Float32Array.from(m.positions);
  forgetMotion();
  for (let v = 0; v < m.positions.length / 3; v++) moveVertex(m.positions, v * 3, null, 0, m.motion.vertex, v * MS, leaves, lean, t, out, v * 3, null);
  return out;
}

/** The vertices of a leaf's blade tip (u = 1), by leaf. */
function tips(m) {
  const mv = m.motion.vertex, out = [];
  for (let v = 0; v < m.positions.length / 3; v++) if (mv[v * MS] >= 0 && mv[v * MS + 2] === 1) out[mv[v * MS]] = v;
  return out;
}

test('every vertex has its motion: the leaves and stalks move, the crowns and roots do not', () => {
  for (const m of piece.meshes) {
    const vc = m.positions.length / 3, mv = m.motion.vertex, L = m.motion.leaves;
    assert.equal(mv.length, vc * MS, `${m.name}: motion.vertex's length`);
    assert.equal(L.length % LEAF_STRIDE, 0);
    const leaves = L.length / LEAF_STRIDE;
    assert.ok(leaves > 0 && L.every(Number.isFinite), `${m.name}: its leaf table`);
    const mat = vertexMaterials(m);
    let moving = 0;
    for (let v = 0; v < vc; v++) {
      const o = v * MS, li = mv[o];
      assert.ok(mv.subarray(o, o + MS).every(Number.isFinite), `${m.name}: vertex ${v}'s motion is not finite`);
      if (mat[v] === MAT.ROOT) {
        assert.equal(li, -1, `${m.name}: a crown or root vertex (${v}) moves`);
        continue;
      }
      assert.ok(Number.isInteger(li) && li >= 0 && li < leaves, `${m.name}: vertex ${v} (material ${mat[v]}) has no leaf`);
      moving++;
      const [v0, u, s] = [mv[o + 1], mv[o + 2], mv[o + 3]];
      assert.ok(v0 >= 0 && v0 <= 1 + 1e-6, `${m.name}: v ${v0}`);
      assert.ok(u === -1 || (u >= 0 && u <= 1), `${m.name}: u ${u}`);
      if (u === -1) assert.equal(s, 0);
      if (mat[v] === MAT.LEAF_BIG || mat[v] === MAT.LEAF_SMALL) assert.ok(u >= 0, `${m.name}: a blade's vertex on its stalk`);
      assert.ok(Math.abs(Math.hypot(mv[o + 4], mv[o + 5], mv[o + 6], mv[o + 7]) - 1) < 1e-5, `${m.name}: its frame is not a unit quaternion`);
    }
    for (let i = 0; i < leaves; i++) {
      const b = i * LEAF_STRIDE;
      assert.ok(L[b + 3] > 0.1 && L[b + 3] < 0.9, `${m.name}: leaf ${i}'s vb ${L[b + 3]}`);
      assert.ok(Math.abs(Math.hypot(L[b + 8], L[b + 9], L[b + 10]) - 1) < 1e-5 && Math.abs(Math.hypot(L[b + 12], L[b + 13], L[b + 14]) - 1) < 1e-5);
      assert.ok(Math.abs(L[b + 8] * L[b + 12] + L[b + 9] * L[b + 13] + L[b + 10] * L[b + 14]) < 1e-5, `${m.name}: leaf ${i}'s flap is not square to its stalk`);
    }
    console.log(`  ${m.name}: ${leaves} leaves, ${moving} of ${vc} vertices move`);
  }
});

test('the stalks\' feet, the crowns and the roots stay put, and the blades stay on their stalks', () => {
  for (const m of piece.meshes) {
    const P = m.positions, mv = m.motion.vertex, vc = P.length / 3;
    // (Each blade's base, and the ring of its stalk's tip.)
    const bases = [], tops = [];
    for (let v = 0; v < vc; v++) {
      const li = mv[v * MS];
      if (li < 0) continue;
      if (mv[v * MS + 2] === 0) bases[li] = v;
      if (mv[v * MS + 2] === -1 && mv[v * MS + 1] === m.motion.leaves[li * LEAF_STRIDE + 3]) (tops[li] ??= []).push(v);
    }
    let foot = 0, still = 0, apart = 0;
    for (const t of [0.37, 2.9, 7.3, 13.1, 29.5]) {
      const Q = moved(m, t);
      const d = (v) => [Q[v * 3] - P[v * 3], Q[v * 3 + 1] - P[v * 3 + 1], Q[v * 3 + 2] - P[v * 3 + 2]];
      for (let v = 0; v < vc; v++) {
        if (mv[v * MS] < 0) still = Math.max(still, Math.hypot(...d(v)));
        else if (mv[v * MS + 1] === 0 || P[v * 3 + 1] < BED_LEVEL - 0.005) foot = Math.max(foot, Math.hypot(...d(v)));
      }
      // (How much nearer or further a blade's base comes to the ring at its stalk's tip.)
      const dist = (X, a, c) => Math.hypot(X[a * 3] - X[c * 3], X[a * 3 + 1] - X[c * 3 + 1], X[a * 3 + 2] - X[c * 3 + 2]);
      bases.forEach((b, li) => {
        for (const v of tops[li]) apart = Math.max(apart, Math.abs(dist(Q, b, v) - dist(P, b, v)));
      });
    }
    console.log(`  ${m.name}: feet and buried parts move ${foot.toExponential(1)}; a blade's base keeps its distance to its stalk's tip within ${apart.toExponential(1)}`);
    assert.equal(still, 0, `${m.name}: a crown or root vertex moved`);
    assert.ok(foot < 2e-4, `${m.name}: a stalk's foot (or a buried part) moved ${foot}`);
    assert.ok(apart < 4e-4, `${m.name}: a blade's base came ${apart} nearer to or further from its stalk's tip`);
  }
});

test('the tips move clearly, and never wildly', () => {
  for (const [m, kind, lo, hi, most] of [[tall, 'tall', 0.75, 2.2, 0.085], [small, 'small', 0.25, 0.8, 0.025]]) {
    const P = m.positions, L = m.motion.leaves, T = tips(m), mv = m.motion.vertex;
    const box = T.map(() => [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]);
    const reach = T.map((_, li) => leafReach(L, li));
    let far = 0;
    for (let t = 0; t < 60; t += 0.2) {
      const Q = moved(m, t);
      for (let v = 0; v < P.length / 3; v++) {
        const li = mv[v * MS];
        if (li < 0) continue;
        const d = Math.hypot(Q[v * 3] - P[v * 3], Q[v * 3 + 1] - P[v * 3 + 1], Q[v * 3 + 2] - P[v * 3 + 2]);
        far = Math.max(far, d);
        assert.ok(d <= reach[li], `${m.name}: leaf ${li} moved ${d}, beyond its reach ${reach[li]}`);
      }
      T.forEach((v, i) => {
        for (let k = 0; k < 3; k++) {
          box[i][k] = Math.min(box[i][k], Q[v * 3 + k]);
          box[i][3 + k] = Math.max(box[i][3 + k], Q[v * 3 + k]);
        }
      });
    }
    const travel = box.map((b) => 12 * Math.hypot(b[3] - b[0], b[4] - b[1], b[5] - b[2]));
    console.log(`  ${m.name}: tips travel ${travel.map((x) => x.toFixed(2)).join(' ')} cm; nothing moves more than ${(12 * far).toFixed(2)} cm`);
    assert.ok(far < most, `${m.name}: a vertex moved ${far}`);
    // (The meshes' tables have every leaf's full motion: the tall plant's big blades, and the
    // small plant's.)
    const m0 = PLANT_MOTION[kind];
    travel.forEach((x, i) => {
      const b = i * LEAF_STRIDE;
      assert.ok(Math.abs(L[b + 18] - Math.min(m0.cap * L[b + 11], m0.k)) < 1e-6, `${m.name}: leaf ${i} is calmed in the mesh's own table`);
      if (kind === 'tall' && L[b + 11] < 0.28) return;
      assert.ok(x >= lo && x <= hi, `${m.name}: leaf ${i}'s tip travels ${x.toFixed(2)} cm (${lo} .. ${hi})`);
    });
  }
});

test('nothing goes out through the glass or into the driftwood or the rocks over a minute, and plant_collide seldom has to push', () => {
  let points = 0, pushed = 0, sum = 0, max = 0;
  assert.ok(solids.length > 0, 'no solids from the driftwood and the rocks');
  for (const m of piece.meshes) {
    // (Calmed, and collided, against the solids the shader bakes: both plants' rest poses kept
    // clear of them.)
    const { leaves, scales } = tamedLeaves(m, obstacles, { solids });
    const P = m.positions, mv = m.motion.vertex, out = [0, 0, 0];
    // (Each vertex's solids within its leaf's reach: the others it cannot come near.)
    const near = [];
    for (let v = 0; v < P.length / 3; v++) {
      const li = mv[v * MS];
      if (li < 0) continue;
      const reach = leafReach(leaves, li);
      near[v] = solids.filter((c) => {
        const ab = [c.b[0] - c.a[0], c.b[1] - c.a[1], c.b[2] - c.a[2]], ap = [P[v * 3] - c.a[0], P[v * 3 + 1] - c.a[1], P[v * 3 + 2] - c.a[2]];
        const h = Math.min(Math.max((ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2), 0), 1);
        return Math.hypot(ap[0] - ab[0] * h, ap[1] - ab[1] * h, ap[2] - ab[2] * h) < c.r + reach;
      });
    }
    let deep = 0, glass = 0, floor = 0;
    for (let t = 0; t < 60; t += 1 / 10) {
      forgetMotion();
      for (let v = 0; v < P.length / 3; v++) {
        if (!moveVertex(P, v * 3, null, 0, mv, v * MS, leaves, null, t, out, 0, null)) continue;
        if (out[1] <= FLOOR && P[v * 3 + 1] > FLOOR) floor++;
        const d = plantCollide(out, 0, near[v]);
        points++;
        if (d > 0) {
          pushed++;
          sum += d;
          max = Math.max(max, d);
        }
        glass = Math.max(glass, Math.hypot(out[0], out[1], out[2]));
        for (const c of near[v]) {
          const ab = [c.b[0] - c.a[0], c.b[1] - c.a[1], c.b[2] - c.a[2]], ap = [out[0] - c.a[0], out[1] - c.a[1], out[2] - c.a[2]];
          const h = Math.min(Math.max((ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2), 0), 1);
          deep = Math.max(deep, c.r - COLLIDE_SOFT - Math.hypot(ap[0] - ab[0] * h, ap[1] - ab[1] * h, ap[2] - ab[2] * h));
        }
      }
    }
    console.log(`  ${m.name}: calmed ${scales.filter((s) => s < 1).length} of ${scales.length} leaves (to ${scales.filter((s) => s < 1).map((s) => s.toFixed(2)).join(', ') || '-'}); held at the sand ${floor} times`);
    assert.ok(glass <= GLASS_CLEAR + 1e-6, `${m.name}: a vertex reached ${glass} from the centre`);
    assert.ok(deep <= 1e-6, `${m.name}: a vertex lay ${deep} inside a solid after plant_collide`);
  }
  console.log(`  plant_collide pushed ${pushed} of ${points} vertex-frames (${(100 * pushed / points).toFixed(4)}%), ${(12 * sum / Math.max(pushed, 1)).toFixed(3)} cm on average, ${(12 * max).toFixed(3)} cm at most`);
  assert.ok(pushed / points < 2e-4, `plant_collide pushed ${pushed} of ${points}`);
  assert.ok(max < 0.012, `plant_collide pushed a vertex ${max}`);
});

test('the normals are of unit length, on the rest normal\'s side, and follow the moved surface', () => {
  for (const m of piece.meshes) {
    const P = m.positions, N0 = m.normals, I = m.indices, mv = m.motion.vertex, vc = P.length / 3;
    // How far each vertex's normal lies from its faces' (area weighted), at rest and moved: the
    // moved normals must follow the moved faces as the rest ones do the rest faces.
    const faces = (Q) => {
      const out = new Float64Array(vc * 3);
      for (let t = 0; t < I.length; t += 3) {
        const [a, b, c] = [I[t], I[t + 1], I[t + 2]];
        const e1 = [Q[b * 3] - Q[a * 3], Q[b * 3 + 1] - Q[a * 3 + 1], Q[b * 3 + 2] - Q[a * 3 + 2]];
        const e2 = [Q[c * 3] - Q[a * 3], Q[c * 3 + 1] - Q[a * 3 + 1], Q[c * 3 + 2] - Q[a * 3 + 2]];
        const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
        for (const v of [a, b, c]) for (let k = 0; k < 3; k++) out[v * 3 + k] += n[k];
      }
      return out;
    };
    const off = (N, F, v) => {
      const l = Math.hypot(F[v * 3], F[v * 3 + 1], F[v * 3 + 2]);
      return Math.acos(Math.min(1, Math.abs(N[v * 3] * F[v * 3] + N[v * 3 + 1] * F[v * 3 + 1] + N[v * 3 + 2] * F[v * 3 + 2]) / l));
    };
    const F0 = faces(P);
    let worst = 0, side = 1, unit = 0, follow = 0, count = 0;
    for (const t of [1.1, 5.7, 12.4, 33.3]) {
      const { positions: Q, normals: N } = movePlant(m, t);
      const F = faces(Q);
      for (let v = 0; v < vc; v++) {
        if (mv[v * MS] < 0) continue;
        unit = Math.max(unit, Math.abs(Math.hypot(N[v * 3], N[v * 3 + 1], N[v * 3 + 2]) - 1));
        side = Math.min(side, N[v * 3] * N0[v * 3] + N[v * 3 + 1] * N0[v * 3 + 1] + N[v * 3 + 2] * N0[v * 3 + 2]);
        const d = off(N, F, v) - off(N0, F0, v);
        follow += Math.abs(d);
        count++;
        worst = Math.max(worst, d);
      }
    }
    console.log(`  ${m.name}: |n| - 1 within ${unit.toExponential(1)}; n . n0 at least ${side.toFixed(3)}; from the faces' as at rest within ${(follow / count * 180 / Math.PI).toFixed(3)} deg on average, ${(worst * 180 / Math.PI).toFixed(2)} deg at most`);
    assert.ok(unit < 1e-5, `${m.name}: a normal's length is off by ${unit}`);
    assert.ok(side > 0.9, `${m.name}: a normal turned to ${side} of its rest`);
    assert.ok(follow / count < 0.2 * Math.PI / 180 && worst < 3 * Math.PI / 180, `${m.name}: the normals do not follow the faces`);
  }
  // (The single-vertex calls agree with the mesh's.)
  const mv = tall.motion.vertex;
  let v = 0;
  while (mv[v * MS] < 0 || mv[v * MS + 2] < 0.5) v++;
  const rest = Array.from(tall.positions.subarray(v * 3, v * 3 + 3)), n0 = Array.from(tall.normals.subarray(v * 3, v * 3 + 3));
  const { positions: Q, normals: N } = movePlant(tall, 4.2);
  const p = displacePlantVertex(rest, mv.subarray(v * MS, v * MS + MS), tall.motion.leaves, 4.2);
  const n = plantNormal(rest, n0, mv.subarray(v * MS, v * MS + MS), tall.motion.leaves, 4.2);
  for (let k = 0; k < 3; k++) {
    assert.ok(Math.abs(p[k] - Q[v * 3 + k]) < 1e-6 && Math.abs(n[k] - N[v * 3 + k]) < 1e-6, `vertex ${v}: ${fmt(p)} / ${fmt(n)}`);
  }
});

test('the leaves bend without stretching', () => {
  for (const m of piece.meshes) {
    const P = m.positions, I = m.indices, mv = m.motion.vertex;
    let worst = 0, sum = 0, n = 0;
    for (const t of [0.9, 6.6, 18.2, 41.7]) {
      const Q = moved(m, t);
      for (let e = 0; e < I.length; e += 3) {
        for (const [a, b] of [[I[e], I[e + 1]], [I[e + 1], I[e + 2]], [I[e + 2], I[e]]]) {
          if (mv[a * MS] < 0 || a > b) continue;
          const l0 = Math.hypot(P[a * 3] - P[b * 3], P[a * 3 + 1] - P[b * 3 + 1], P[a * 3 + 2] - P[b * 3 + 2]);
          if (l0 < 0.002) continue;
          const l1 = Math.hypot(Q[a * 3] - Q[b * 3], Q[a * 3 + 1] - Q[b * 3 + 1], Q[a * 3 + 2] - Q[b * 3 + 2]);
          worst = Math.max(worst, Math.abs(l1 / l0 - 1));
          sum += Math.abs(l1 / l0 - 1);
          n++;
        }
      }
    }
    console.log(`  ${m.name}: its edges (2 mm and longer) change length by ${(100 * sum / n).toFixed(3)}% on average, ${(100 * worst).toFixed(2)}% at most`);
    assert.ok(sum / n < 0.007 && worst < 0.08, `${m.name}: edges stretch ${sum / n} on average, ${worst} at most`);
  }
});

/** A mesh's stalks' rings: by leaf, each ring's vertices (u = -1, one v), foot first. */
function stalkRings(m) {
  const mv = m.motion.vertex, out = Array.from({ length: m.motion.leaves.length / LEAF_STRIDE }, () => new Map());
  for (let v = 0; v < m.positions.length / 3; v++) {
    if (mv[v * MS] < 0 || mv[v * MS + 2] !== -1) continue;
    const rings = out[mv[v * MS]], key = mv[v * MS + 1];
    (rings.get(key) ?? rings.set(key, []).get(key)).push(v);
  }
  return out.map((r) => [...r].sort((a, b) => a[0] - b[0]).map(([, vs]) => vs));
}

const centre = (X, vs) => [0, 1, 2].map((k) => vs.reduce((s, v) => s + X[v * 3 + k], 0) / vs.length);

test('a strong lean bends the leaves without stretching them, and carries no stalk\'s tip past its cap', () => {
  for (const m of piece.meshes) {
    const P = m.positions, I = m.indices, mv = m.motion.vertex, L = m.motion.leaves, nL = L.length / LEAF_STRIDE;
    const rings = stalkRings(m);
    // (A stalk's centre line's length: from ring to ring.)
    const line = (X, li) => {
      let s = 0;
      for (let i = 1; i < rings[li].length; i++) {
        const a = centre(X, rings[li][i - 1]), b = centre(X, rings[li][i]);
        s += Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      }
      return s;
    };
    const rest = rings.map((_, li) => line(P, li));
    let blade = 0, stalk = 0;
    for (const dir of [[1, 0, 0], [0, 0, 1], [-0.7, 0, 0.7], [0, -1, 0]]) {
      const lean = new Float32Array(nL * 4);
      for (let i = 0; i < nL; i++) lean.set([0.05 * dir[0], 0.05 * dir[1], 0.05 * dir[2], 0], i * 4);
      for (const t of [0.9, 18.2]) {
        const Q = moved(m, t, L, lean);
        for (let li = 0; li < nL; li++) stalk = Math.max(stalk, Math.abs(line(Q, li) / rest[li] - 1));
        for (let e = 0; e < I.length; e += 3) {
          for (const [a, b] of [[I[e], I[e + 1]], [I[e + 1], I[e + 2]], [I[e + 2], I[e]]]) {
            if (mv[a * MS] < 0 || a > b || mv[a * MS + 2] < 0 || mv[b * MS + 2] < 0) continue;
            const l0 = Math.hypot(P[a * 3] - P[b * 3], P[a * 3 + 1] - P[b * 3 + 1], P[a * 3 + 2] - P[b * 3 + 2]);
            if (l0 < 0.002) continue;
            const l1 = Math.hypot(Q[a * 3] - Q[b * 3], Q[a * 3 + 1] - Q[b * 3 + 1], Q[a * 3 + 2] - Q[b * 3 + 2]);
            blade = Math.max(blade, Math.abs(l1 / l0 - 1));
          }
        }
      }
    }
    // (A lean far past the cap on every leaf: its stalk's tip goes no further than the cap allows.)
    const huge = new Float32Array(nL * 4);
    for (let i = 0; i < nL; i++) huge.set([1, 0.3, -0.5, 0], i * 4);
    const a = moved(m, 5.5), c = moved(m, 5.5, L, huge);
    let over = 0;
    rings.forEach((r, li) => {
      const p = centre(a, r.at(-1)), q = centre(c, r.at(-1));
      over = Math.max(over, Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) / (LEAN_CAP * L[li * LEAF_STRIDE + 7]));
    });
    console.log(`  ${m.name}, a lean of 0.05: its blades' edges change length by ${(100 * blade).toFixed(2)}% at most, its stalks' centre lines by ${(100 * stalk).toFixed(2)}%; a huge lean carries a stalk's tip ${over.toFixed(2)} of its cap`);
    assert.ok(blade < 0.07, `${m.name}: a blade's edge stretches ${blade} under the lean`);
    assert.ok(stalk < 0.045, `${m.name}: a stalk stretches ${stalk} under the lean`);
    assert.ok(over < 1.2, `${m.name}: a huge lean carries a stalk's tip ${over} of its cap`);
  }
});

/** How many of a mesh's blade edges (moved to Q) pass through another leaf's blade or stalk, and
 *  which pairs of leaves. */
function crossings(m, Q) {
  const I = m.indices, mv = m.motion.vertex, tris = [], leafOf = [];
  for (let t = 0; t < I.length; t += 3) {
    if (mv[I[t] * MS] < 0) continue;
    tris.push(I[t], I[t + 1], I[t + 2]);
    leafOf.push(mv[I[t] * MS]);
  }
  const pk = packScape([{ ...m, positions: Q, indices: Uint32Array.from(tris), materials: new Uint8Array(tris.length / 3).fill(MAT.LEAF_BIG) }]);
  let n = 0;
  const pairs = new Set(), seen = new Set();
  for (let t = 0; t < tris.length; t += 3) {
    for (const [a, b] of [[tris[t], tris[t + 1]], [tris[t + 1], tris[t + 2]], [tris[t + 2], tris[t]]]) {
      const la = mv[a * MS];
      if (mv[a * MS + 2] < 0 || mv[b * MS + 2] < 0 || mv[b * MS] !== la || seen.has(a * 1e6 + b) || seen.has(b * 1e6 + a)) continue;
      seen.add(a * 1e6 + b);
      const A = [Q[a * 3], Q[a * 3 + 1], Q[a * 3 + 2]], d = [Q[b * 3] - A[0], Q[b * 3 + 1] - A[1], Q[b * 3 + 2] - A[2]];
      const l = Math.hypot(...d), u = d.map((x) => x / l);
      const h = traceCPU(pk, A.map((x, k) => x + u[k] * 1e-4 * l), u, l * (1 - 2e-4));
      if (h.tri === 0xffffffff || leafOf[pk.order[h.tri]] === la) continue;
      n++;
      pairs.add(`${Math.min(la, leafOf[pk.order[h.tri]])}-${Math.max(la, leafOf[pk.order[h.tri]])}`);
    }
  }
  return { n, pairs };
}

test('no blade passes through another leaf, at rest or as they move', () => {
  for (const m of piece.meshes) {
    let worst = 0;
    const pairs = new Set();
    for (const t of [null, 1.3, 6.1, 10.9, 15.7, 20.5, 25.3, 30.1, 34.9, 39.7, 44.5, 49.3, 54.1]) {
      const c = crossings(m, t === null ? m.positions : moved(m, t));
      worst = Math.max(worst, c.n);
      for (const p of c.pairs) pairs.add(t === null ? `${p} at rest` : p);
    }
    console.log(`  ${m.name}: at most ${worst} blade edges through another leaf in a pose${pairs.size ? ` (${[...pairs].join(' ')})` : ''}`);
    assert.equal(worst, 0, `${m.name}: blades pass through other leaves: ${[...pairs].join(' ')}`);
  }
});

test('the phases stand in for the time, as precise after a day (or from 1970) as at the start', () => {
  const L = tall.motion.leaves, n = L.length / LEAF_STRIDE;
  for (const t of [0.5, 3600.5, 86400.5, 1.7e9 + 0.5]) {
    const ph = leafPhases(L, t);
    assert.ok(ph instanceof Float32Array && ph.length === n * PHASE_STRIDE);
    for (let i = 0; i < n; i++) {
      for (const k of [0, 1, 2, 3, 4, 5]) assert.ok(ph[i * PHASE_STRIDE + k] >= 0 && ph[i * PHASE_STRIDE + k] <= 2 * Math.PI + 1e-6, `t ${t}: leaf ${i}'s angle ${k} is ${ph[i * PHASE_STRIDE + k]}`);
      const surge = ph[i * PHASE_STRIDE + 6];
      assert.ok(surge >= 0.7 - 1e-6 && surge <= 1 + 1e-6);
    }
    // (Moved by the phases as the GPU has them, f32, against the time in f64.)
    const { positions: A, normals: NA } = movePlant(tall, t);
    const { positions: B, normals: NB } = movePlant(tall, ph);
    let dp = 0, dn = 0;
    for (let v = 0; v < A.length / 3; v++) {
      dp = Math.max(dp, Math.hypot(A[v * 3] - B[v * 3], A[v * 3 + 1] - B[v * 3 + 1], A[v * 3 + 2] - B[v * 3 + 2]));
      // (The angle between them, well conditioned when it is small.)
      const a = [NA[v * 3], NA[v * 3 + 1], NA[v * 3 + 2]], b = [NB[v * 3], NB[v * 3 + 1], NB[v * 3 + 2]];
      const c = Math.hypot(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]);
      dn = Math.max(dn, Math.atan2(c, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    }
    assert.ok(dp < 2e-6 && dn < (0.01 * Math.PI) / 180, `t ${t}: the f32 phases move a vertex ${dp} and turn a normal ${(dn * 180) / Math.PI} deg`);
  }
});

test('the lean bends a leaf its way, the stalk\'s foot staying put', () => {
  for (const m of piece.meshes) {
    const L = m.motion.leaves, nL = L.length / LEAF_STRIDE, T = tips(m), P = m.positions;
    for (const li of [0, Math.floor(nL / 2), nL - 1]) {
      const b = li * LEAF_STRIDE, S = [L[b + 8], L[b + 9], L[b + 10]];
      // (Square to the stalk's tip, as the lean's share the leaf takes.)
      let w = [S[1], -S[0], 0.4];
      const k = w[0] * S[0] + w[1] * S[1] + w[2] * S[2];
      w = w.map((x, i) => x - S[i] * k);
      const wl = Math.hypot(...w);
      const lam = w.map((x) => (0.02 * x) / wl);
      const lean = new Float32Array(nL * 4);
      lean.set([...lam, 0], li * 4);
      const a = moved(m, 3.3), c = moved(m, 3.3, L, lean);
      const v = T[li];
      const dt = [0, 1, 2].map((j) => c[v * 3 + j] - a[v * 3 + j]);
      const along = (dt[0] * lam[0] + dt[1] * lam[1] + dt[2] * lam[2]) / 0.0004;
      assert.ok(along > 0.7 && along < 1.6, `${m.name}: leaf ${li}'s tip took ${along.toFixed(2)} of its lean (${fmt(dt)} for ${fmt(lam)})`);
      let foot = 0;
      for (let u = 0; u < P.length / 3; u++) if (m.motion.vertex[u * MS] === li && m.motion.vertex[u * MS + 1] === 0) foot = Math.max(foot, Math.hypot(c[u * 3] - a[u * 3], c[u * 3 + 1] - a[u * 3 + 1], c[u * 3 + 2] - a[u * 3 + 2]));
      assert.ok(foot < 1e-7, `${m.name}: leaf ${li}'s foot moved ${foot} with its lean`);
    }
  }
});

test('the motion is the same every time, and at any detail the same leaves in the same places', () => {
  const again = plants.build();
  piece.meshes.forEach((m, i) => {
    assert.deepEqual(again.meshes[i].motion.vertex, m.motion.vertex, `${m.name}: motion.vertex differs between builds`);
    assert.deepEqual(again.meshes[i].motion.leaves, m.motion.leaves, `${m.name}: motion.leaves differs between builds`);
    assert.deepEqual(moved(again.meshes[i], 9.9), moved(m, 9.9));
  });
  const half = plants.build({ detail: 0.5 });
  assert.deepEqual(half.obstacles, piece.obstacles, 'the obstacles differ at detail 0.5');
  let tris = 0, tris1 = 0;
  piece.meshes.forEach((m, i) => {
    const h = half.meshes[i];
    tris1 += m.indices.length / 3;
    tris += h.indices.length / 3;
    assert.equal(h.motion.leaves.length, m.motion.leaves.length, `${m.name}: its leaves at detail 0.5`);
    // (The same leaves: their feet, stalks, blades, phases, rates and amplitudes alike.)
    for (let li = 0; li < m.motion.leaves.length / LEAF_STRIDE; li++) {
      const a = m.motion.leaves.subarray(li * LEAF_STRIDE, (li + 1) * LEAF_STRIDE), b = h.motion.leaves.subarray(li * LEAF_STRIDE, (li + 1) * LEAF_STRIDE);
      for (let k = 0; k < LEAF_STRIDE; k++) assert.ok(Math.abs(a[k] - b[k]) <= 1e-6, `${m.name}: leaf ${li}'s entry ${k}: ${a[k]} at detail 1, ${b[k]} at 0.5`);
    }
    // (The same places: the coarse mesh's box within a millimetre or so of the fine one's.)
    const box = (P) => [0, 1, 2].flatMap((k) => { let lo = Infinity, hi = -Infinity; for (let v = k; v < P.length; v += 3) { lo = Math.min(lo, P[v]); hi = Math.max(hi, P[v]); } return [lo, hi]; });
    const b1 = box(m.positions), b2 = box(h.positions);
    b1.forEach((x, k) => assert.ok(Math.abs(x - b2[k]) < 0.012, `${m.name}: its box at detail 0.5 (${fmt(b2)} against ${fmt(b1)})`));
  });
  console.log(`  ${tris1} triangles at detail 1, ${tris} at 0.5 (${(100 * tris / tris1).toFixed(1)}%)`);
  assert.ok(tris / tris1 > 0.2 && tris / tris1 < 0.32, `detail 0.5 has ${tris} triangles against ${tris1}`);
});

test('the WGSL keeps out every solid and uses only f32 literals in its arithmetic', () => {
  const src = plantMotionWGSL(obstacles, rest);
  for (const name of ['plant_displace', 'plant_normal', 'plant_move', 'plant_collide']) assert.match(src, new RegExp(`\\bfn ${name}\\(`));
  assert.equal(src.match(/q = plant_pushOut\(/g)?.length ?? 0, solids.length);
  assert.match(src, /plantLeaves\[/);
  assert.match(src, /plantLean\[/);
  assert.match(src, /plantPhase\[/);
  // (The time is never used: the phases come from the CPU.)
  assert.doesNotMatch(src, /\bt: f32\b|\btime\b/);
  // (No integer literal left to be taken as abstract: every number has a point, an exponent or a
  // u suffix, but a matrix's column index.)
  const code = src.replace(/\/\/[^\n]*/g, '');
  const bare = code.match(/(?<![\w.[]|[eE][-+])\d+(?![\w.\]])/g) ?? [];
  assert.deepEqual(bare, [], `bare integer literals: ${bare.join(' ')}`);
  // (The moving parts' materials read nothing of where they are in the bowl, only their own charts,
  // so their patterns move with them.)
  for (const name of ['leafBig', 'leafSmall', 'stem']) {
    const at = plants.WGSL.indexOf(`fn scape_mat_${name}(`), end = plants.WGSL.indexOf('\nfn ', at + 1);
    const body = plants.WGSL.slice(at, end < 0 ? undefined : end).replace(/\/\/[^\n]*/g, '');
    assert.ok(at >= 0 && !/[^\w.]p\b(?!:)/.test(body), `scape_mat_${name} reads the point p`);
  }
  // The plants' own obstacles (their stalks', inside which they lie) are passed over.
  assert.equal(plantSolids([...obstacles, ...piece.obstacles], rest).length, solids.length);
});
