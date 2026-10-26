// The furnishings' mesh tracer (src/render/scape/scapeBVH.mjs): the packed tree is sound, its CPU
// mirror (the shader's walk, f32 arithmetic) agrees with a brute-force test of every triangle, bad
// rays are refused at once and no walk runs past its bound, and the measurements that chose the
// shader's traversal. Run: node --test scape-bvh.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import {
  packScape, traceCPU, shadowCPU, surfaceCPU, scapeMeshWGSL, scapeStats,
  LEAF_PASS, SHADOW_CUTOFF, SCAPE_MAT_BITS, SCAPE_T_MIN, SCAPE_MAX_DEPTH, SCAPE_MAX_HEIGHT, SCAPE_MAX_STEPS,
} from './src/render/scape/scapeBVH.mjs';
import { MAT, MeshBuilder, stream, fbm3, SCAPE_WGSL_COMMON } from './src/render/scape/mesh.mjs';

const NONE = 0xffffffff;
const MATS = Object.values(MAT);
const fr = Math.fround;
const PASS = LEAF_PASS.map(fr);

/** Splits needed below n triangles to reach leaves of 4 by halving (the least depth a tree has). */
function levels(n) {
  let l = 0;
  while (n > 4) {
    n = Math.ceil(n / 2);
    l++;
  }
  return l;
}

// ---- scenes ------------------------------------------------------------------------------------
/** n random triangles (sizes from 0.001 to ~0.1) in the furnishings' part of the bowl, as one or
 *  more meshes, each corner its own vertex; materials at random (many of them leaves). */
function soup(n, seed, meshes = 1) {
  const rand = stream(seed);
  const out = [];
  for (let m = 0; m < meshes; m++) {
    const count = Math.floor(n / meshes) + (m < n % meshes ? 1 : 0);
    const positions = new Float32Array(count * 9), normals = new Float32Array(count * 9), attrs = new Float32Array(count * 12);
    const indices = new Uint32Array(count * 3), materials = new Uint8Array(count);
    for (let t = 0; t < count; t++) {
      const c = [(rand() * 2 - 1) * 0.7, -0.66 + rand() * 0.5, (rand() * 2 - 1) * 0.7];
      const size = 0.001 * Math.pow(100, rand());
      for (let v = 0; v < 3; v++) {
        for (let k = 0; k < 3; k++) positions[t * 9 + v * 3 + k] = c[k] + (rand() * 2 - 1) * size;
        const nn = [rand() - 0.5, rand() - 0.5, rand() - 0.5], l = Math.hypot(...nn) || 1;
        for (let k = 0; k < 3; k++) normals[t * 9 + v * 3 + k] = nn[k] / l;
        for (let k = 0; k < 4; k++) attrs[t * 12 + v * 4 + k] = rand();
        indices[t * 3 + v] = t * 3 + v;
      }
      materials[t] = rand() < 0.45 ? (rand() < 0.5 ? MAT.LEAF_BIG : MAT.LEAF_SMALL) : MATS[Math.floor(rand() * MATS.length)];
    }
    out.push({ name: `soup${m}`, positions, normals, attrs, indices, materials });
  }
  return out;
}

/** A closed geodesic sphere (icosahedron subdivided `level` times), shared vertices, lumpy if asked. */
function icosphere(name, centre, radius, level, material, lumps = 0, seed = 1) {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((v) => {
    const l = Math.hypot(...v);
    return v.map((x) => x / l);
  });
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (let l = 0; l < level; l++) {
    const cache = new Map();
    const mid = (a, b) => {
      const key = a < b ? `${a},${b}` : `${b},${a}`;
      if (cache.has(key)) return cache.get(key);
      const m = verts[a].map((x, k) => x + verts[b][k]), len = Math.hypot(...m);
      verts.push(m.map((x) => x / len));
      cache.set(key, verts.length - 1);
      return verts.length - 1;
    };
    faces = faces.flatMap(([a, b, c]) => {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]];
    });
  }
  const mb = new MeshBuilder(name);
  for (const v of verts) {
    const r = radius * (1 + lumps * fbm3(v[0] * 3 + seed, v[1] * 3, v[2] * 3, 4));
    mb.vertex([centre[0] + v[0] * r, centre[1] + v[1] * r * 0.7, centre[2] + v[2] * r], [seed, 0, 0, 1]);
  }
  for (const [a, b, c] of faces) mb.tri(a, b, c, material);
  return mb.finish();
}

/** A closed tube along a bent path (caps fanned to their middles). */
function tube(mb, p0, p1, bend, r0, r1, around, along, material, seed) {
  const base = mb.vertexCount;
  const axis = p1.map((x, k) => x - p0[k]);
  const len = Math.hypot(...axis);
  const ax = axis.map((x) => x / len);
  const ref = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nz = (v) => v.map((x) => x / Math.hypot(...v));
  const e1 = nz(cr(ax, ref)), e2 = cr(ax, e1);
  const centre = (s) => p0.map((x, k) => x + axis[k] * s + bend[k] * Math.sin(Math.PI * s));
  for (let j = 0; j <= along; j++) {
    const s = j / along, c = centre(s);
    for (let i = 0; i < around; i++) {
      const a = (i / around) * Math.PI * 2;
      const r = (r0 + (r1 - r0) * s) * (1 + 0.15 * fbm3(s * 8 + seed, Math.cos(a) * 2, Math.sin(a) * 2, 3));
      mb.vertex(c.map((x, k) => x + (e1[k] * Math.cos(a) + e2[k] * Math.sin(a)) * r), [s * len, a, 0.5, 1]);
    }
  }
  const at = (i, j) => base + j * around + (i % around);
  for (let j = 0; j < along; j++) for (let i = 0; i < around; i++) mb.quad(at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1), material);
  const c0 = mb.vertex(centre(0), [0, 0, 0, 1]), c1 = mb.vertex(centre(1), [len, 0, 0, 1]);
  for (let i = 0; i < around; i++) {
    mb.tri(c0, at(i + 1, 0), at(i, 0), material);
    mb.tri(c1, at(i, along), at(i + 1, along), material);
  }
}

/** A leaf blade: a curved sheet, one layer, ovate. */
function blade(mb, base, along, side, length, width, nu, nv, material, id) {
  const first = mb.vertexCount;
  const up = [along[1] * side[2] - along[2] * side[1], along[2] * side[0] - along[0] * side[2], along[0] * side[1] - along[1] * side[0]];
  for (let j = 0; j <= nu; j++) {
    const s = j / nu, w = width * Math.sin(Math.PI * Math.min(1, s * 1.05 + 0.02)) * (1 - 0.3 * s);
    for (let i = 0; i <= nv; i++) {
      const v = (i / nv) * 2 - 1;
      const lift = -0.15 * length * s * s + 0.2 * width * v * v;
      mb.vertex([0, 1, 2].map((k) => base[k] + along[k] * s * length + side[k] * v * w + up[k] * lift), [s, v, id, 1]);
    }
  }
  const at = (i, j) => first + j * (nv + 1) + i;
  for (let j = 0; j < nu; j++) for (let i = 0; i < nv; i++) mb.quad(at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1), material);
}

/** Something like the furnishings at their full size (~300k triangles, shared vertices): driftwood
 *  tubes, lumpy stones, a plant of blades on stalks. */
function furnishingsLike(seed) {
  const rand = stream(seed);
  const wood = new MeshBuilder('wood');
  tube(wood, [-0.62, -0.66, -0.15], [-0.05, -0.62, -0.38], [0, 0.05, -0.04], 0.055, 0.025, 48, 380, MAT.BARK, 1);
  tube(wood, [-0.4, -0.63, -0.28], [-0.36, -0.42, -0.26], [0.03, 0, 0.02], 0.03, 0.012, 32, 260, MAT.BARK, 2);
  tube(wood, [-0.2, -0.62, -0.36], [0.2, -0.5, -0.5], [0, 0.04, 0.03], 0.035, 0.015, 40, 300, MAT.BARK, 3);
  const rocks = [
    icosphere('rock0', [-0.4, -0.62, 0.32], 0.12, 5, MAT.ROCK, 0.08, 1),
    icosphere('rock1', [0.17, -0.63, 0.24], 0.085, 5, MAT.ROCK, 0.06, 2),
    icosphere('rock2', [0.4, -0.63, 0.1], 0.075, 5, MAT.ROCK, 0.08, 3),
    icosphere('rock3', [0.62, -0.64, 0.12], 0.045, 5, MAT.ROCK, 0.06, 4),
  ];
  const plant = new MeshBuilder('plant');
  for (let k = 0; k < 60; k++) {
    const root = [-0.5 + rand() * 0.45, -0.6, -0.25 - rand() * 0.12];
    const az = rand() * Math.PI * 2, rise = 0.5 + rand() * 0.9;
    const dir = [Math.cos(rise) * Math.cos(az), Math.sin(rise), Math.cos(rise) * Math.sin(az)];
    const tip = root.map((x, i) => x + dir[i] * (0.05 + rand() * 0.15));
    tube(plant, root, tip, [0, 0.01, 0], 0.004, 0.003, 8, 24, k % 5 === 0 ? MAT.ROOT : MAT.STEM, k);
    const side = [-dir[2], 0, dir[0]].map((x, _, a) => x / (Math.hypot(...a) || 1));
    const along = [dir[0], dir[1] * 0.4, dir[2]].map((x, _, a) => x / Math.hypot(...a));
    blade(plant, tip, along, side, 0.12 + rand() * 0.1, 0.03 + rand() * 0.02, 32, 16, k % 3 ? MAT.LEAF_BIG : MAT.LEAF_SMALL, k);
  }
  return [wood.finish(), ...rocks, plant.finish()];
}

/** The real pieces, those present: a module that is missing is skipped, but one that is there and
 *  does not load, or has no piece in its exports, fails the test (built once, shared by the tests). */
let piecesOnce = null;
function realPieces() {
  piecesOnce ??= (async () => {
    const out = [];
    for (const name of ['wood', 'rocks', 'plants', 'equipment']) {
      const url = new URL(`./src/render/scape/${name}.mjs`, import.meta.url);
      if (!existsSync(url)) continue;
      let mod, piece;
      try {
        mod = await import(url.href);
        piece = Object.values(mod).find((v) => v && typeof v === 'object' && Array.isArray(v.meshes));
        if (!piece) {
          const builder = Object.entries(mod).find(([k, v]) => typeof v === 'function' && /^build/i.test(k));
          if (builder) piece = builder[1]();
        }
      } catch (err) {
        assert.fail(`${name}.mjs is there but does not load or build: ${err.message}`);
      }
      assert.ok(piece && Array.isArray(piece.meshes), `${name}.mjs is there but exports no piece (an object with meshes, or a build function)`);
      out.push({ name, meshes: piece.meshes, wgsl: typeof mod.WGSL === 'string' ? mod.WGSL : '' });
    }
    return out;
  })();
  return piecesOnce;
}

// ---- brute force (f64 Moller-Trumbore, every triangle) --------------------------------------
function brute(meshes) {
  let N = 0;
  for (const m of meshes) N += m.indices.length / 3;
  const A = new Float64Array(N * 9), S = new Float64Array(N * 4), M = new Uint8Array(N);
  const corners = [];
  let t = 0;
  for (const m of meshes) {
    for (let i = 0; i < m.indices.length / 3; i++, t++) {
      const p = [0, 1, 2].map((v) => [0, 1, 2].map((k) => m.positions[m.indices[i * 3 + v] * 3 + k]));
      corners.push(m.indices[i * 3], m.indices[i * 3 + 1], m.indices[i * 3 + 2]);
      for (let k = 0; k < 3; k++) {
        A[t * 9 + k] = p[0][k];
        A[t * 9 + 3 + k] = p[1][k] - p[0][k];
        A[t * 9 + 6 + k] = p[2][k] - p[0][k];
      }
      const c = [0, 1, 2].map((k) => (p[0][k] + p[1][k] + p[2][k]) / 3);
      S.set([...c, Math.max(...p.map((q) => Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]))) * 1.0001 + 1e-9], t * 4);
      M[t] = m.materials[i];
    }
  }
  return { N, A, S, M };
}

/** The f64 crossing of one triangle's plane, its weights (u: second corner, v: third). */
function mt(B, t, o, d) {
  const A = B.A, i = t * 9;
  const e1x = A[i + 3], e1y = A[i + 4], e1z = A[i + 5], e2x = A[i + 6], e2y = A[i + 7], e2z = A[i + 8];
  const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x;
  const det = e1x * px + e1y * py + e1z * pz;
  if (det === 0) return null;
  const sx = o[0] - A[i], sy = o[1] - A[i + 1], sz = o[2] - A[i + 2];
  const u = (sx * px + sy * py + sz * pz) / det;
  const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x;
  const v = (d[0] * qx + d[1] * qy + d[2] * qz) / det;
  const tt = (e2x * qx + e2y * qy + e2z * qz) / det;
  return { t: tt, u, v, edge: Math.min(u, v, 1 - u - v) };
}

/** The cosine between d and triangle t's plane normal (0: the ray runs along it). */
function cosine(B, t, d) {
  const A = B.A, i = t * 9;
  const nx = A[i + 4] * A[i + 8] - A[i + 5] * A[i + 7], ny = A[i + 5] * A[i + 6] - A[i + 3] * A[i + 8], nz = A[i + 3] * A[i + 7] - A[i + 4] * A[i + 6];
  return (nx * d[0] + ny * d[1] + nz * d[2]) / (Math.hypot(nx, ny, nz) || 1);
}

/** Every triangle the segment (tMin, tEnd) crosses: [{ tri, t, u, v, edge }]. */
function bruteAll(B, o, d, tEnd) {
  const out = [];
  const S = B.S;
  const ox = o[0], oy = o[1], oz = o[2], dx = d[0], dy = d[1], dz = d[2];
  for (let t = 0; t < B.N; t++) {
    const j = t * 4, r = S[j + 3];
    const wx = S[j] - ox, wy = S[j + 1] - oy, wz = S[j + 2] - oz;
    const b = wx * dx + wy * dy + wz * dz;
    if (b + r < SCAPE_T_MIN || b - r > tEnd) continue;
    if (wx * wx + wy * wy + wz * wz - b * b > r * r) continue;
    const h = mt(B, t, o, d);
    if (!h || h.edge < -1e-4 || h.t <= SCAPE_T_MIN - 1e-6 || h.t >= tEnd + 1e-6) continue;
    out.push({ tri: t, ...h });
  }
  return out;
}

/** Brute force's nearest hit, and whether the answer is marginal (a crossing within a whisker of a
 *  triangle's edge or the segment's ends, where f32 and f64 may honestly differ). */
function bruteNearest(B, o, d, tEnd, all = bruteAll(B, o, d, tEnd)) {
  let best = null, marginal = false;
  for (const h of all) {
    const inside = h.edge >= 0 && h.t > SCAPE_T_MIN && h.t < tEnd;
    if (Math.abs(h.edge) < 1e-4 || Math.abs(h.t - SCAPE_T_MIN) < 1e-5 || Math.abs(h.t - tEnd) < 1e-5) marginal = true;
    if (inside && (!best || h.t < best.t)) best = h;
  }
  return { best, marginal, all };
}

function bruteShadow(B, o, d, tEnd, all = bruteAll(B, o, d, tEnd)) {
  let T = [1, 1, 1], marginal = false, crossings = 0;
  for (const h of all) {
    if (Math.abs(h.edge) < 1e-4 || Math.abs(h.t - SCAPE_T_MIN) < 1e-5 || Math.abs(h.t - tEnd) < 1e-5) marginal = true;
    if (!(h.edge >= 0 && h.t > SCAPE_T_MIN && h.t < tEnd)) continue;
    crossings++;
    if (B.M[h.tri] !== MAT.LEAF_BIG && B.M[h.tri] !== MAT.LEAF_SMALL) T = [0, 0, 0];
    else T = T.map((x, i) => x * LEAF_PASS[i]);
  }
  if (Math.max(...T) < SHADOW_CUTOFF) T = [0, 0, 0];
  return { T, marginal, crossings };
}

// ---- rays ---------------------------------------------------------------------------------------
const norm = (v) => {
  const l = Math.hypot(...v);
  return v.map((x) => x / l);
};

/** Rays through the box (lo, hi): from inside or outside it to a point in it, some segments cut
 *  short; and rays that miss it. */
function boxRays(lo, hi, n, misses, seed) {
  const rand = stream(seed);
  const size = hi.map((x, k) => x - lo[k]);
  const inBox = (grow) => lo.map((x, k) => x - grow * size[k] + rand() * size[k] * (1 + 2 * grow));
  const rays = [];
  for (let i = 0; i < n; i++) {
    const o = inBox(i % 4 === 0 ? 0 : 0.6);
    const d = norm(inBox(0).map((x, k) => x - o[k] + 1e-9));
    const tEnd = i % 3 === 0 ? 0.05 + rand() * 1.5 : 10;
    rays.push({ o, d, tEnd });
  }
  const out = [];
  while (out.length < misses) {
    const o = inBox(1.5);
    const d = norm([rand() - 0.5, rand() - 0.5, rand() - 0.5]);
    // (Keep only those that miss the box altogether.)
    let tn = 0, tf = Infinity;
    for (let k = 0; k < 3; k++) {
      const a = (lo[k] - o[k]) / d[k], b = (hi[k] - o[k]) / d[k];
      tn = Math.max(tn, Math.min(a, b));
      tf = Math.min(tf, Math.max(a, b));
    }
    if (tn > tf) out.push({ o, d, tEnd: 10, miss: true });
  }
  return [...rays, ...out];
}

/** Rays like the shader's: from the inside of the glass at the front and above, into the
 *  furnishings' box; and shadow rays from where they land (or from the bed) towards the sun. */
function viewRays(P, n, seed) {
  const rand = stream(seed);
  const rays = [];
  while (rays.length < n) {
    const o = norm([rand() * 2 - 1, rand() * 1.2 - 0.3, rand() * 2 - 1]).map((x) => x * 0.98);
    if (o[2] < 0.25) continue;
    const target = P.lo.map((x, k) => x + rand() * (P.hi[k] - x));
    rays.push({ o, d: norm(target.map((x, k) => x - o[k])), tEnd: 2.5 });
  }
  return rays;
}
const SUN = norm([0.25, 1, 0.15]);
function shadowRays(P, rays, seed) {
  const rand = stream(seed);
  return rays.map((r) => {
    const h = traceCPU(P, r.o, r.d, r.tEnd);
    if (h.tri === NONE) {
      const a = rand() * Math.PI * 2, q = Math.sqrt(rand()) * 0.75;
      return { o: [Math.cos(a) * q, -0.6, Math.sin(a) * q], d: SUN, tEnd: 2 };
    }
    const s = surfaceCPU(P, h);
    const side = Math.sign(s.ng[0] * SUN[0] + s.ng[1] * SUN[1] + s.ng[2] * SUN[2]) || 1;
    return { o: r.o.map((x, k) => x + r.d[k] * h.t + s.ng[k] * side * 2e-4), d: SUN, tEnd: 2 };
  });
}

// ---- checks -------------------------------------------------------------------------------------
/** The texture as the shader reads it: every triangle in exactly one leaf, every box round what it
 *  holds, the corners, materials and vertex table as the meshes have them. */
function checkPacked(P, meshes) {
  const D = P.data, tx = (i, c) => D[i * 4 + c];
  assert.equal(P.width, 1024);
  assert.ok(P.height >= 1 && P.height <= SCAPE_MAX_HEIGHT);
  assert.equal(D.length, P.width * P.height * 4);
  assert.ok(D.every(Number.isFinite));
  const nodeCount = tx(0, 0), triBase = tx(0, 1), N = tx(0, 2), vertBase = tx(1, 3);
  assert.equal(N, P.triangles);
  assert.equal(tx(3, 0), 2);
  assert.ok(P.depth <= SCAPE_MAX_DEPTH);
  assert.equal(triBase, 4 + nodeCount * 4);
  assert.equal(vertBase, triBase + N * 3);
  // The order is a permutation.
  const perm = new Uint8Array(N);
  for (const t of P.order) {
    assert.equal(perm[t], 0);
    perm[t] = 1;
  }
  if (N === 0) return;
  const seen = new Uint8Array(N), nodesSeen = new Uint8Array(nodeCount);
  let maxDepth = 0;
  const inside = (p, lo, hi) => p.every((x, k) => x >= lo[k] && x <= hi[k]);
  const encloses = (lo0, hi0, lo1, hi1) => lo1.every((x, k) => x >= lo0[k] && hi1[k] <= hi0[k]);
  const visit = (w, lo, hi, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    assert.ok(depth <= SCAPE_MAX_DEPTH);
    if (w < 0) {
      const packed = -w - 1, start = packed >> 2, count = (packed & 3) + 1;
      for (let k = start; k < start + count; k++) {
        assert.ok(k < N, 'leaf past the triangles');
        assert.equal(seen[k], 0, 'triangle in two leaves');
        seen[k] = 1;
        for (let v = 0; v < 3; v++) assert.ok(inside([0, 1, 2].map((c) => tx(triBase + k * 3 + v, c)), lo, hi), 'corner outside its leaf box');
      }
      return;
    }
    assert.ok(Number.isInteger(w) && w < nodeCount);
    assert.equal(nodesSeen[w], 0, 'node reached twice');
    nodesSeen[w] = 1;
    const at = 4 + w * 4;
    const box = (i) => [[0, 1, 2].map((c) => tx(i, c)), [0, 1, 2].map((c) => tx(i + 1, c))];
    const [l0, h0] = box(at), [l1, h1] = box(at + 2);
    assert.ok(encloses(lo, hi, l0, h0) && encloses(lo, hi, l1, h1), 'child box outside its parent');
    visit(tx(at, 3), l0, h0, depth + 1);
    visit(tx(at + 1, 3), l1, h1, depth + 1);
  };
  visit(tx(0, 3), P.lo, P.hi, 0);
  assert.ok(seen.every((x) => x === 1), 'a triangle in no leaf');
  assert.ok(nodesSeen.every((x) => x === 1), 'a node never reached');
  assert.equal(maxDepth, P.depth);
  // Corners, materials and the vertex table.
  const vOff = [], tOff = [];
  let vo = 0, to = 0;
  for (const m of meshes) {
    vOff.push(vo);
    tOff.push(to);
    vo += m.positions.length / 3;
    to += m.indices.length / 3;
  }
  const locate = (t) => {
    let i = tOff.length - 1;
    while (tOff[i] > t) i--;
    return [meshes[i], t - tOff[i], vOff[i]];
  };
  for (let k = 0; k < N; k++) {
    const [m, i, off] = locate(P.order[k]);
    const at = triBase + k * 3;
    const wa = tx(at, 3);
    assert.equal(wa & ((1 << SCAPE_MAT_BITS) - 1), m.materials[i]);
    const ids = [wa >>> SCAPE_MAT_BITS, tx(at + 1, 3), tx(at + 2, 3)];
    for (let v = 0; v < 3; v++) {
      const vi = m.indices[i * 3 + v];
      assert.equal(ids[v], vi + off);
      for (let c = 0; c < 3; c++) assert.equal(tx(at + v, c), m.positions[vi * 3 + c]);
      const vt = vertBase + ids[v] * 2;
      for (let c = 0; c < 3; c++) assert.equal(tx(vt, c), m.normals[vi * 3 + c]);
      assert.equal(tx(vt, 3), m.attrs[vi * 4]);
      for (let c = 0; c < 3; c++) assert.equal(tx(vt + 1, c), m.attrs[vi * 4 + 1 + c]);
    }
  }
}

/** traceCPU and shadowCPU against brute force on the rays; returns how many answers were marginal. */
function checkRays(P, B, rays, label, mostSteps = SCAPE_MAX_STEPS / 4) {
  let marginal = 0, hits = 0, shadowsLit = 0, crossings = 0;
  const st = scapeStats();
  for (const r of rays) {
    const h = traceCPU(P, r.o, r.d, r.tEnd, { stats: st });
    const all = bruteAll(B, r.o, r.d, r.tEnd);
    const b = bruteNearest(B, r.o, r.d, r.tEnd, all);
    if (r.miss) {
      assert.equal(h.tri, NONE, `${label}: a ray missing the box hit something`);
      assert.equal(b.best, null);
    }
    const agree = h.tri === NONE ? !b.best : !!b.best && Math.abs(h.t - b.best.t) <= 1e-5;
    if (!agree) {
      // (Only where brute force itself sits on an edge or an end of the segment; or where the ray
      // all but runs along the triangle it hits, so that f32's rounding of where it crosses (a few
      // units in the last place of its distance, sideways) moves the hit along the ray by that over
      // the cosine: e.g. 1.3e-5 at 0.68 away, cos 2.7e-3, on a plant blade.)
      const mine = h.tri === NONE ? null : b.all.find((x) => x.tri === P.order[h.tri]);
      const grazeTol = mine ? 1e-5 + (4 * 6e-8 * Math.max(1, mine.t)) / Math.max(Math.abs(cosine(B, mine.tri, r.d)), 1e-9) : 0;
      const grazing = !!mine && !!b.best && Math.abs(h.t - mine.t) <= grazeTol && h.t - b.best.t <= grazeTol;
      const ok = b.marginal || (mine && Math.abs(mine.edge) < 1e-4) || grazing;
      assert.ok(ok, `${label}: trace disagrees: cpu ${h.t} tri ${h.tri} (orig ${P.order[h.tri]}), brute ${b.best?.t} tri ${b.best?.tri}`);
      marginal++;
    } else if (h.tri !== NONE) {
      hits++;
      if (P.order[h.tri] === b.best.tri) {
        assert.ok(Math.abs(h.bary[0] - b.best.u) < 2e-3 && Math.abs(h.bary[1] - b.best.v) < 2e-3, `${label}: weights ${h.bary} vs ${b.best.u},${b.best.v}`);
      }
      assert.equal(h.t, Math.fround(h.t));
    } else assert.equal(h.t, Math.fround(r.tEnd));
    const s = shadowCPU(P, r.o, r.d, r.tEnd, { stats: st });
    const bs = bruteShadow(B, r.o, r.d, r.tEnd, all);
    crossings += bs.crossings;
    const same = s.every((x, i) => Math.abs(x - bs.T[i]) <= 1e-5);
    if (!same) {
      assert.ok(bs.marginal, `${label}: shadow ${s} vs brute ${bs.T}`);
      marginal++;
    }
    if (s.some((x) => x > 0)) shadowsLit++;
  }
  // (No finite ray is cut off by the walk's bound, or taken for a bad one; on scenes like the
  // furnishings none comes near the bound: the real pieces' worst is ~125 steps. A chain of 20,000
  // triangles nested round a point takes up to ~2,900.)
  assert.equal(st.capped, 0, `${label}: a walk cut off at ${SCAPE_MAX_STEPS} steps`);
  assert.equal(st.bad, 0, `${label}: a finite ray refused`);
  assert.ok(st.maxSteps <= mostSteps, `${label}: a walk of ${st.maxSteps} steps`);
  return { marginal, hits, shadowsLit, crossings, maxSteps: st.maxSteps };
}

/** Average work a ray of each traversal does. */
function measure(meshes, rays, label) {
  const out = {};
  const packs = { stackless: packScape(meshes, { layout: 'stackless' }), stack: packScape(meshes) };
  for (const [name, P, variant] of [['stackless (betta)', packs.stackless, 'stack'], ['short stack', packs.stack, 'stack'], ['short stack + entry t', packs.stack, 'stackT'], ['short stack, leaves first', packs.stack, 'leafFirst']]) {
    for (const kind of ['trace', 'shadow']) {
      const st = scapeStats();
      const list = kind === 'trace' ? rays.view : rays.shadow;
      for (const r of list) (kind === 'trace' ? traceCPU : shadowCPU)(P, r.o, r.d, r.tEnd, { stats: st, variant });
      out[`${name} ${kind}`] = { nodes: st.nodes / st.rays, boxes: st.boxes / st.rays, tris: st.tris / st.rays, loads: st.loads / st.rays, stack: st.maxStack, steps: st.steps / st.rays, maxSteps: st.maxSteps, capped: st.capped };
    }
  }
  const P = packs.stack;
  const viewHits = rays.view.filter((r) => traceCPU(P, r.o, r.d, r.tEnd).tri !== NONE).length;
  const shadowLit = rays.shadow.filter((r) => shadowCPU(P, r.o, r.d, r.tEnd).some((x) => x > 0)).length;
  console.log(`  ${label}: per ray (view rays ${rays.view.length}, ${viewHits} hitting; shadow rays ${rays.shadow.length}, ${shadowLit} lit at all; deepest stack ${out['short stack trace'].stack})`);
  console.log('    traversal                       kind    nodes   boxes    tris   texel loads   steps (most)');
  for (const [k, v] of Object.entries(out)) {
    const [name, kind] = [k.slice(0, k.lastIndexOf(' ')), k.slice(k.lastIndexOf(' ') + 1)];
    console.log(`    ${name.padEnd(31)} ${kind.padEnd(6)} ${v.nodes.toFixed(1).padStart(6)} ${v.boxes.toFixed(1).padStart(7)} ${v.tris.toFixed(1).padStart(7)} ${v.loads.toFixed(1).padStart(10)} ${v.steps.toFixed(1).padStart(9)} (${v.maxSteps})`);
  }
  // (The shader's walk: no ray near the bound.)
  for (const kind of ['trace', 'shadow']) {
    assert.equal(out[`short stack ${kind}`].capped, 0);
    assert.ok(out[`short stack ${kind}`].maxSteps <= SCAPE_MAX_STEPS / 4);
  }
  return out;
}

function describe(P, label) {
  console.log(`  ${label}: ${P.triangles} triangles, ${P.vertices} vertices; build ${P.buildMs.toFixed(0)} ms + pack ${P.packMs.toFixed(0)} ms; ` +
    `${P.nodes} nodes (${P.internal} internal, ${P.leaves} leaves, ${(P.triangles / Math.max(P.leaves, 1)).toFixed(2)} a leaf), depth ${P.depth}` +
    `${P.forcedSplits ? ` (${P.forcedSplits} median splits forced)` : ''}; texture 1024 x ${P.height} (${(P.data.byteLength / 1048576).toFixed(1)} MB)`);
}

// ---- tests --------------------------------------------------------------------------------------
test('small and odd trees: empty, a root leaf, duplicates, flat and degenerate triangles, a deep chain', () => {
  const empty = packScape([]);
  assert.equal(empty.triangles, 0);
  assert.equal(traceCPU(empty, [0, 0, 0], [0, -1, 0], 3).tri, NONE);
  assert.deepEqual(shadowCPU(empty, [0, 0, 0], [0, -1, 0], 3), [1, 1, 1]);
  for (const n of [1, 3, 4, 5, 9, 17, 64]) {
    const meshes = soup(n, 100 + n, n > 5 ? 2 : 1);
    const P = packScape(meshes);
    checkPacked(P, meshes);
    checkRays(P, brute(meshes), boxRays(P.lo, P.hi, 300, 50, n), `soup ${n}`);
  }
  // 200 copies of one triangle (no centres apart: halved by index), axis-aligned flat ones,
  // degenerate slivers and points.
  const mb = new MeshBuilder('odd');
  for (let i = 0; i < 200; i++) mb.tri(mb.vertex([0, -0.5, 0]), mb.vertex([0.1, -0.5, 0]), mb.vertex([0, -0.4, 0.1]), MAT.LEAF_BIG);
  const rand = stream(5);
  for (let i = 0; i < 300; i++) {
    const c = [rand() - 0.5, -0.6 + rand() * 0.3, rand() - 0.5], s = 0.02 * rand();
    mb.tri(mb.vertex(c), mb.vertex([c[0] + s, c[1], c[2]]), mb.vertex([c[0], c[1], c[2] + s]), MAT.ROCK);
    mb.tri(mb.vertex(c), mb.vertex([c[0] + s, c[1] + s, c[2] + s]), mb.vertex([c[0] + 2 * s, c[1] + 2 * s, c[2] + 2 * s]), MAT.STEM);
    mb.tri(mb.vertex(c), mb.vertex(c), mb.vertex(c), MAT.ROOT);
  }
  const odd = [mb.finish()];
  const P = packScape(odd);
  checkPacked(P, odd);
  checkRays(P, brute(odd), boxRays(P.lo, P.hi, 1000, 100, 9), 'odd');
  // A pile of the one triangle: a shadow through it is a stack of 200 leaves (cut off to 0).
  assert.deepEqual(shadowCPU(P, [0.02, -0.45, 0.02], [0, -1, 0], 1), [0, 0, 0]);
  // Sizes halving away from a point: SAH peels them off one at a time; the depth limit holds.
  const chain = new MeshBuilder('chain');
  for (let i = 0; i < 4000; i++) {
    const x = 0.5 * Math.pow(0.995, i), s = 0.3 * x;
    chain.tri(chain.vertex([x, -0.5, 0]), chain.vertex([x + s, -0.5, 0.01]), chain.vertex([x, -0.5 + s, 0.02]), MAT.BARK);
  }
  const deep = [chain.finish()];
  const C = packScape(deep);
  checkPacked(C, deep);
  assert.ok(C.depth <= SCAPE_MAX_DEPTH);
  checkRays(C, brute(deep), boxRays(C.lo, C.hi, 1000, 100, 13), 'chain');
  describe(C, 'deep chain');
});

test('random soups: traceCPU and shadowCPU agree with brute force (3000 rays through the box, 1000 missing it)', () => {
  for (const [n, meshes] of [[2000, 1], [20000, 3]]) {
    const scene = soup(n, 7 + n, meshes);
    const P = packScape(scene);
    describe(P, `soup of ${n}`);
    checkPacked(P, scene);
    const r = checkRays(P, brute(scene), boxRays(P.lo, P.hi, 3000, 1000, n), `soup ${n}`);
    console.log(`    ${r.hits} hits agree; ${r.marginal} marginal answers (on an edge); ${r.shadowsLit} shadow rays lit, ${r.crossings} crossings`);
    assert.ok(r.marginal <= 6);
    assert.ok(r.hits > 500);
  }
});

test('no cracks: rays aimed at the shared edges and corners of closed meshes all hit (f32, from afar)', () => {
  const ball = [icosphere('ball', [0.1, -0.5, -0.05], 0.06, 6, MAT.ROCK, 0.05, 3)];
  const P = packScape(ball);
  checkPacked(P, ball);
  const m = ball[0];
  const rand = stream(77);
  let misses = 0, mtMisses = 0, n = 0;
  const fr = Math.fround;
  // (Moller-Trumbore in f32 with a 1e-6 slack on its weights, the usual test, for comparison.)
  const mtF32 = (o, d, a, b, c) => {
    const e1 = b.map((x, k) => fr(x - a[k])), e2 = c.map((x, k) => fr(x - a[k]));
    const p = [fr(fr(d[1] * e2[2]) - fr(d[2] * e2[1])), fr(fr(d[2] * e2[0]) - fr(d[0] * e2[2])), fr(fr(d[0] * e2[1]) - fr(d[1] * e2[0]))];
    const det = fr(fr(fr(e1[0] * p[0]) + fr(e1[1] * p[1])) + fr(e1[2] * p[2]));
    if (det === 0) return false;
    const inv = fr(1 / det);
    const s = o.map((x, k) => fr(x - a[k]));
    const u = fr(fr(fr(fr(s[0] * p[0]) + fr(s[1] * p[1])) + fr(s[2] * p[2])) * inv);
    const q = [fr(fr(s[1] * e1[2]) - fr(s[2] * e1[1])), fr(fr(s[2] * e1[0]) - fr(s[0] * e1[2])), fr(fr(s[0] * e1[1]) - fr(s[1] * e1[0]))];
    const v = fr(fr(fr(fr(d[0] * q[0]) + fr(d[1] * q[1])) + fr(d[2] * q[2])) * inv);
    return u >= -1e-6 && v >= -1e-6 && u + v <= 1 + 1e-6;
  };
  const tris = m.indices.length / 3;
  const corner = (v) => [0, 1, 2].map((k) => m.positions[v * 3 + k]);
  const round = new Map();
  for (let u = 0; u < tris; u++) {
    for (let v = 0; v < 3; v++) {
      const id = m.indices[u * 3 + v];
      if (!round.has(id)) round.set(id, []);
      round.get(id).push(u);
    }
  }
  for (let i = 0; i < 6000; i++) {
    const t = Math.floor(rand() * tris);
    const [a, b, c] = [0, 1, 2].map((v) => corner(m.indices[t * 3 + v]));
    // A point on an edge (or a corner), seen from 0.5 to 2.5 away, from the side it faces.
    const s = i % 10 === 0 ? 0 : rand();
    const target = a.map((x, k) => x + (b[k] - x) * s);
    const dirOut = norm(target.map((x, k) => x - [0.1, -0.5, -0.05][k]));
    const off = norm(dirOut.map((x) => x + (rand() - 0.5) * 1.2));
    const dist = 0.5 + rand() * 2;
    const o = target.map((x, k) => x + off[k] * dist);
    const d = norm(target.map((x, k) => x - o[k]));
    if (d[0] * dirOut[0] + d[1] * dirOut[1] + d[2] * dirOut[2] > -0.05) continue;
    n++;
    if (traceCPU(P, o, d, 10).tri === NONE) misses++;
    // Of the triangles sharing that edge, does any f32 Moller-Trumbore test take the ray?
    let any = false;
    for (const u of round.get(m.indices[t * 3])) {
      const ids = [m.indices[u * 3], m.indices[u * 3 + 1], m.indices[u * 3 + 2]];
      if (s > 0 && !ids.includes(m.indices[t * 3 + 1])) continue;
      if ((any = mtF32(o.map(fr), d.map(fr), ...ids.map(corner)))) break;
    }
    if (!any) mtMisses++;
  }
  console.log(`  ${n} rays at shared edges and corners of a closed ${tris}-triangle ball: watertight test ${misses} through; f32 Moller-Trumbore (1e-6 slack) would let ${mtMisses} through`);
  assert.equal(misses, 0);
});

test('the shader: the API, the pieces\' materials and stand-ins for those missing', async () => {
  const pieces = await realPieces();
  const wgsl = scapeMeshWGSL(pieces.map((p) => p.wgsl));
  assert.ok(wgsl.startsWith(SCAPE_WGSL_COMMON));
  for (const sig of [
    'struct ScapeMeshHit {\n  t: f32,\n  tri: u32,\n  bary: vec2f,\n}',
    'fn scape_meshHit(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> ScapeMeshHit',
    'fn scape_meshShadow(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> vec3f',
    'struct ScapeSurface {\n  n: vec3f,\n  ng: vec3f,\n  attrs: vec4f,\n  material: u32,\n}',
    'fn scape_meshSurface(tex: texture_2d<f32>, h: ScapeMeshHit) -> ScapeSurface',
    'fn scape_meshMaterial(s: ScapeSurface, p: vec3f, foot: f32, front: bool) -> ScapeMat',
  ]) assert.ok(wgsl.includes(sig), sig);
  for (const name of ['bark', 'woodEnd', 'rock', 'leafBig', 'leafSmall', 'stem', 'root', 'heater', 'heaterLamp', 'sponge', 'tube', 'suction']) {
    assert.equal(wgsl.match(new RegExp(`fn scape_mat_${name}\\(`, 'g'))?.length, 1, name);
  }
  // Every function once; braces and parentheses balance.
  const fns = [...wgsl.matchAll(/\bfn\s+(\w+)/g)].map((x) => x[1]);
  assert.equal(new Set(fns).size, fns.length);
  const code = wgsl.replace(/\/\/[^\n]*/g, '');
  for (const [a, b] of [['{', '}'], ['(', ')'], ['[', ']']]) assert.equal(code.split(a).length, code.split(b).length, `${a}${b}`);
  assert.throws(() => scapeMeshWGSL(['fn scape_mat_rock() {}', 'fn scape_mat_rock() {}']), /twice|2 times/);
  // (No array but the walk's stack: translated to SPIR-V, as on Android, an array indexed by a
  // variable, a const one too, is a copy in each invocation's private memory. The nest's bubbles,
  // for one, are rows of the texture: nest.mjs.)
  const arrays = [...code.matchAll(/\b(\w+)\s*(?::|=)\s*array<[^>]*>/g)].map((x) => x[1]);
  assert.deepEqual([...new Set(arrays)], ['stack']);
  const stubbed = scapeMeshWGSL([]);
  assert.ok(stubbed.includes('Stand-ins'));
  console.log(`  shader: ${wgsl.length} characters with the pieces present (${pieces.map((p) => p.name).join(', ') || 'none'}); ${stubbed.length} with none`);
});

// ---- regressions (the review of the first version) -------------------------------------------
const f32b = new Float32Array(1), u32b = new Uint32Array(f32b.buffer);
const bitsOf = (x) => ((f32b[0] = x), u32b[0]);
/** scape_meshBad as the shader computes it, on the f32 bits (checked against the mirror). */
function wgslBad(o, d, tEnd) {
  const m = 0x7fffffff, inf = 0x7f800000;
  const ao = o.map((x) => (bitsOf(x) & m) >>> 0), ad = d.map((x) => (bitsOf(x) & m) >>> 0);
  return ao.some((x) => x >= inf) || ad.some((x) => x >= inf) || ad.every((x) => x < 0x00800000) || ((bitsOf(tEnd) & m) >>> 0) > inf;
}

test('bad rays (o or d NaN or infinite, d zero, tEnd NaN) are a miss at once, before a texel is read', () => {
  const P = packScape(soup(20000, 5, 2));
  const c = P.lo.map((x, k) => (x + P.hi[k]) / 2);
  const down = [0, -1, 0];
  // (Before the fix, on an RTX 5090: d NaN or o NaN walked all 234,929 nodes and leaves of the real
  // pieces, only d.x NaN 4,308, tEnd NaN 140; the mirror stopped at once, its Math.max being NaN.)
  for (const [label, o, d, tEnd] of [
    ['d NaN', c, [NaN, NaN, NaN], 2],
    ['only d.x NaN', c, [NaN, -0.8, 0.6], 2],
    ['o NaN', [NaN, NaN, NaN], down, 2],
    ['only o.z NaN', [c[0], c[1], NaN], down, 2],
    ['o infinite', [-Infinity, c[1], c[2]], [1, 0, 0], 2],
    ['o beyond f32 (1e39)', [-1e39, c[1], c[2]], [1, 0, 0], 2],
    ['d infinite', c, [0, -Infinity, 0], 2],
    ['d zero (a refraction past the critical angle)', c, [0, 0, 0], 2],
    ['d subnormal', c, [1e-40, -1e-41, 0], 2],
    ['tEnd NaN', c, down, NaN],
  ]) {
    assert.ok(wgslBad(o.map(fr), d.map(fr), fr(tEnd)), `${label}: the shader's bit test lets it by`);
    const st = scapeStats();
    const h = traceCPU(P, o, d, tEnd, { stats: st });
    const s = shadowCPU(P, o, d, tEnd, { stats: st });
    assert.equal(h.tri, NONE, label);
    assert.ok(Object.is(h.t, fr(tEnd)), `${label}: t ${h.t}`);
    assert.deepEqual(s, [1, 1, 1], label);
    assert.deepEqual([st.bad, st.loads, st.nodes, st.steps], [2, 0, 0, 0], `${label}: ${JSON.stringify(st)}`);
  }
  // Not bad: finite rays, directions with zero parts, an endless segment; they walk as ever.
  const rand = stream(8);
  let hits = 0;
  for (let i = 0; i < 400; i++) {
    const o = c.map((x, k) => x + (rand() - 0.5) * (P.hi[k] - P.lo[k]));
    const d = i % 4 === 0 ? down : i % 4 === 1 ? norm([rand() - 0.5, 0, rand() - 0.5]) : norm([rand() - 0.5, rand() - 0.5, rand() - 0.5]);
    for (const tEnd of [5, Infinity]) assert.equal(wgslBad(o.map(fr), d.map(fr), fr(tEnd)), false);
    const st = scapeStats();
    const far = traceCPU(P, o, d, Infinity, { stats: st }), near = traceCPU(P, o, d, 5, { stats: st });
    assert.equal(st.bad, 0);
    assert.equal(far.tri, near.tri);
    if (near.tri !== NONE) {
      hits++;
      assert.equal(far.t, near.t);
    }
  }
  assert.ok(hits > 100, `${hits} hits`);
  // Segments no longer than SCAPE_T_MIN: nothing to meet, nothing read.
  for (const tEnd of [0, -1, SCAPE_T_MIN, -Infinity]) {
    const st = scapeStats();
    assert.equal(traceCPU(P, c, down, tEnd, { stats: st }).tri, NONE);
    assert.deepEqual(shadowCPU(P, c, down, tEnd, { stats: st }), [1, 1, 1]);
    assert.deepEqual([st.bad, st.loads], [0, 0]);
  }
  // The shader: the test is on the bits (no x != x a compiler may drop), and both entry points make
  // it, and refuse a short segment, before their first texel.
  const wgsl = scapeMeshWGSL([]);
  const bad = wgsl.slice(wgsl.indexOf('fn scape_meshBad('), wgsl.indexOf('fn scape_meshRay(')).replace(/\/\/[^\n]*/g, '');
  for (const x of ['bitcast<vec3u>(o)', 'bitcast<vec3u>(d)', 'bitcast<u32>(tEnd)', '0x7fffffffu', '0x7f800000u', '0x00800000u']) assert.ok(bad.includes(x), x);
  assert.ok(!bad.includes('!='));
  for (const fn of ['scape_meshHit', 'scape_meshShadow']) {
    const at = wgsl.indexOf(`fn ${fn}(`);
    const body = wgsl.slice(at, wgsl.indexOf('\n}\n', at));
    const guard = body.indexOf('if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return');
    assert.ok(guard > 0 && guard < body.indexOf('scape_meshTexel'), `${fn}: no guard before its first texel`);
  }
});

test('the walk\'s bound: a ray in the plane of a long row of triangles meets every box and no triangle, and stops at SCAPE_MAX_STEPS', () => {
  const row = (n) => {
    const mb = new MeshBuilder('row');
    const s = 2e-5;
    for (let i = 0; i < n; i++) {
      const x = -0.45 + (0.9 * i) / n;
      mb.tri(mb.vertex([x, -0.5, -s]), mb.vertex([x + s, -0.5, s]), mb.vertex([x, -0.5, s]), i % 2 ? MAT.LEAF_BIG : MAT.ROCK);
    }
    return [mb.finish()];
  };
  const o = [-0.5, -0.5, 0], d = [1, 0, 0];
  for (const n of [2000, 20000]) {
    const P = packScape(row(n));
    const st = scapeStats(), ss = scapeStats();
    assert.equal(traceCPU(P, o, d, 2, { stats: st }).tri, NONE);
    assert.deepEqual(shadowCPU(P, o, d, 2, { stats: ss }), [1, 1, 1]);
    console.log(`  a row of ${n} triangles (${P.nodes} nodes and leaves), the ray in their plane: trace ${st.steps} steps${st.capped ? ' (cut off)' : ''}, shadow ${ss.steps}${ss.capped ? ' (cut off)' : ''}`);
    for (const x of [st, ss]) {
      if (P.nodes <= SCAPE_MAX_STEPS) assert.deepEqual([x.steps, x.capped], [P.nodes, 0]);
      else assert.deepEqual([x.steps, x.capped], [SCAPE_MAX_STEPS, 1]);
    }
  }
  const wgsl = scapeMeshWGSL([]);
  assert.ok(wgsl.includes(`const SCAPE_MESH_STEPS: u32 = ${SCAPE_MAX_STEPS}u;`));
  assert.equal(wgsl.split('let steps = min(nodeCount * 2u + 2u, SCAPE_MESH_STEPS);\n  for (var it = 0u; it < steps; it++) {').length - 1, 2);
});

/** A chain of triangles shrinking towards a point: SAH peels them off one by one, so a tight depth
 *  limit forces median splits. */
function chain(n, ratio) {
  const mb = new MeshBuilder('chain');
  for (let i = 0; i < n; i++) {
    const s = 0.4 * Math.pow(ratio, i), x = 0.001 + s;
    mb.tri(mb.vertex([x, -0.5, 0]), mb.vertex([x + s, -0.5, s * 0.1]), mb.vertex([x, -0.5 + s, s * 0.2]), i % 3 ? MAT.LEAF_BIG : MAT.ROCK);
  }
  return [mb.finish()];
}

test('the depth limit: forced median splits keep it and the walk stays exact; a limit below what halving needs is refused', () => {
  for (const [n, ratio] of [[5000, 0.998], [20000, 0.9993]]) {
    const meshes = chain(n, ratio), B = brute(meshes);
    const rand = stream(n);
    const aimed = [];
    for (let i = 0; i < 1000; i++) {
      const tgt = [0.001 + 0.8 * Math.pow(rand(), 5), -0.5 + 0.2 * Math.pow(rand(), 5), 0.02 * rand()];
      const o = [tgt[0] + (rand() - 0.5) * 0.3, tgt[1] + 0.3 + rand() * 0.3, tgt[2] + 0.4];
      aimed.push({ o, d: norm(tgt.map((x, k) => x - o[k])), tEnd: 5 });
    }
    const free = packScape(meshes);
    for (const extra of [0, 1, 3]) {
      const maxDepth = levels(n) + extra;
      const P = packScape(meshes, { maxDepth });
      assert.ok(P.depth <= maxDepth, `depth ${P.depth} over ${maxDepth}`);
      assert.ok(P.forcedSplits > 0, 'no median split forced');
      checkPacked(P, meshes);
      const r = checkRays(P, B, [...aimed, ...boxRays(P.lo, P.hi, 1000, 200, n + extra)], `chain ${n}, maxDepth ${maxDepth}`, SCAPE_MAX_STEPS);
      console.log(`  chain of ${n}, maxDepth ${maxDepth} (unlimited: depth ${free.depth}): depth ${P.depth}, ${P.forcedSplits} median splits forced; ${r.hits} hits agree with brute force, ${r.marginal} marginal; most steps a ray ${r.maxSteps}`);
    }
    assert.throws(() => packScape(meshes, { maxDepth: levels(n) - 1 }), /maxDepth/);
  }
  for (const bad of [-1, 2.5, NaN, '8']) assert.throws(() => packScape(soup(10, 1), { maxDepth: bad }), /maxDepth/);
  assert.ok(packScape(soup(100, 2), { maxDepth: 99 }).depth <= SCAPE_MAX_DEPTH);
  assert.equal(packScape(soup(4, 3), { maxDepth: 0 }).depth, 0);
});

/** WGSL with its comments cut (block comments nest), done here on its own to check scapeMeshWGSL. */
function cutComments(s) {
  for (let prev = null; prev !== s;) {
    prev = s;
    s = s.replace(/\/\*(?:(?!\/\*|\*\/)[\s\S])*\*\//g, ' ');
  }
  return s.replace(/\/\/[^\n]*/g, '');
}

test('scapeMeshWGSL counts the material definitions in the code, not those in comments', () => {
  const rock = 'fn scape_mat_rock(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat { return ScapeMat(vec3f(0.1), n, 0.5, 0.02, vec3f(0.0), 1.0); }';
  const stub = 'fn scape_mat_rock(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {\n  return ScapeMat(vec3f(0.05, 0.05, 0.055)';
  const live = (w) => (cutComments(w).match(/\bfn\s+scape_mat_rock\s*\(/g) ?? []).length;
  // Only in a comment (a line, a block, a nested block): a stand-in is still made, so it compiles.
  for (const piece of ['// TODO fn scape_mat_rock(attrs: vec4f) -> ScapeMat', '/* fn scape_mat_rock(attrs: vec4f) */', '/* outer /* fn scape_mat_rock( */ still the outer one: fn scape_mat_rock( */']) {
    const w = scapeMeshWGSL([piece]);
    assert.equal(live(w), 1, piece);
    assert.ok(w.includes(stub), `${piece}: no stand-in`);
  }
  // An old one left in a comment beside the real one: the real one, no stand-in, no error.
  for (const piece of [`// was: fn scape_mat_rock(attrs: vec4f) ...\n${rock}`, `/* fn scape_mat_rock( */ ${rock}`, `${rock} // fn scape_mat_rock(`, `/* a /* b */ fn scape_mat_rock( */\n${rock}`]) {
    const w = scapeMeshWGSL([piece]);
    assert.equal(live(w), 1, piece);
    assert.ok(w.includes(rock) && !w.includes(stub), piece);
  }
  // Two in the code still fail, wherever the comments are.
  assert.throws(() => scapeMeshWGSL([`${rock} /* one */`, `// two\n${rock}`]), /2 times/);
});

test('shadows through a leaf sheet count each crossing once, exactly on its edges and corners too', () => {
  // (a) A flat sheet on an exact binary grid; vertical rays through its corners, edges and
  // diagonals, where the edge functions are exactly 0. (With the trace's slack and no rule for
  // 0, an edge was darkened twice, 0.3^2 in green, and a corner six times, 7e-4.)
  const mb = new MeshBuilder('grid');
  const N = 16, h = 1 / 64;
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) mb.vertex([i * h - 0.125, -0.5, j * h - 0.125], [0, 0, 0, 1], [0, 1, 0]);
  const at = (i, j) => j * (N + 1) + i;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) mb.quad(at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1), MAT.LEAF_BIG);
  const G = packScape([mb.finish()]);
  let grid = 0;
  for (let j = 1; j < 2 * N; j++) {
    for (let i = 1; i < 2 * N; i++) {
      const o = [(i * h) / 2 - 0.125, -0.3, (j * h) / 2 - 0.125];
      for (const d of [[0, -1, 0], [0, 1, 0]]) {
        const oo = d[1] > 0 ? [o[0], -0.7, o[2]] : o;
        assert.deepEqual(shadowCPU(G, oo, d, 1), PASS, `grid point (${i / 2}, ${j / 2}), d ${d}`);
        assert.notEqual(traceCPU(G, oo, d, 1).tri, NONE);
        grid++;
      }
    }
  }
  // (b) A flat sheet tilted every way, its corners jittered in its plane; rays from all round aimed
  // at points on its inner edges and at its inner corners, a third of them grazing (cos 0.01-0.06).
  const ax = norm([1, 0.3, 0.2]);
  const t0 = [-0.2, 0.4, 1], dt = t0[0] * ax[0] + t0[1] * ax[1] + t0[2] * ax[2];
  const ay = norm(t0.map((x, k) => x - dt * ax[k]));
  const nz = [ax[1] * ay[2] - ax[2] * ay[1], ax[2] * ay[0] - ax[0] * ay[2], ax[0] * ay[1] - ax[1] * ay[0]];
  const rand = stream(21);
  const M = 24, size = 0.4, pts = [];
  const sheet = new MeshBuilder('tilted');
  for (let j = 0; j <= M; j++) {
    for (let i = 0; i <= M; i++) {
      const u = (i / M - 0.5) * size + (i % M ? (rand() - 0.5) * 0.3 * size / M : 0), v = (j / M - 0.5) * size + (j % M ? (rand() - 0.5) * 0.3 * size / M : 0);
      const p = [0, 1, 2].map((k) => [0, -0.4, 0][k] + ax[k] * u + ay[k] * v);
      pts.push(p);
      sheet.vertex(p);
    }
  }
  const id = (i, j) => j * (M + 1) + i;
  for (let j = 0; j < M; j++) for (let i = 0; i < M; i++) sheet.quad(id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1), MAT.LEAF_SMALL);
  const S = packScape([sheet.finish()]);
  const tally = { once: 0, twice: 0, none: 0, other: 0 }, step = [[1, 0], [0, 1], [1, 1]];
  for (let n = 0; n < 6000; n++) {
    const i = 1 + Math.floor(rand() * (M - 2)), j = 1 + Math.floor(rand() * (M - 2));
    const a = pts[id(i, j)];
    let target = a;
    if (n % 3) {
      const [di, dj] = step[Math.floor(rand() * 3)], b = pts[id(i + di, j + dj)], s = 0.02 + 0.96 * rand();
      target = a.map((x, k) => x + (b[k] - x) * s);
    }
    const r3 = norm([rand() - 0.5, rand() - 0.5, rand() - 0.5]);
    const tan = norm(r3.map((x, k) => x - nz[k] * (r3[0] * nz[0] + r3[1] * nz[1] + r3[2] * nz[2])));
    const cs = n % 3 === 1 ? 0.01 + 0.05 * rand() : 0.1 + 0.9 * rand(), side = rand() < 0.5 ? 1 : -1;
    const d = norm(tan.map((x, k) => x * Math.sqrt(1 - cs * cs) - nz[k] * cs * side));
    const dist = 0.2 + 1.8 * rand();
    const T = shadowCPU(S, target.map((x, k) => x - d[k] * dist), d, dist + 1);
    if (T.every((x, k) => x === PASS[k])) tally.once++;
    else if (T.every((x, k) => x === fr(PASS[k] * PASS[k]))) tally.twice++;
    else if (T.every((x) => x === 1)) tally.none++;
    else tally.other++;
  }
  console.log(`  leaf sheets: ${grid} rays through an exact grid's corners and edges all darkened once; 6000 at a tilted sheet's edges and corners: ${JSON.stringify(tally)}`);
  assert.deepEqual(tally, { once: 6000, twice: 0, none: 0, other: 0 });
});

test('the mirror tests the root box against tEnd rounded to f32, as the shader does', () => {
  const P = packScape(soup(200, 3));
  const o = [P.lo[0] - 0.25, (P.lo[1] + P.hi[1]) / 2, (P.lo[2] + P.hi[2]) / 2];
  // Where the ray (along +x) enters the root box, as the slab test computes it, and an f64 tEnd
  // just short of it that rounds to it in f32.
  const enter = fr(P.lo[0] - fr(o[0]));
  f32b[0] = enter;
  u32b[0]--;
  const below = f32b[0];
  const tEnd = enter - (enter - below) / 4;
  assert.ok(tEnd < enter && fr(tEnd) === enter);
  const st = scapeStats();
  assert.equal(traceCPU(P, o, [1, 0, 0], tEnd, { stats: st }).tri, NONE);
  assert.ok(st.nodes >= 1, 'the root box refused against the f64 tEnd');
});

test('rows packed after the vertices, found from texel 3, leave the tree and its walk as they were', () => {
  const meshes = soup(500, 11, 2);
  const plain = packScape(meshes);
  const rows = Float32Array.from({ length: 12 * 4 }, (_, i) => fr(i * 0.37 - 5));
  const P = packScape(meshes, { rows });
  assert.equal(plain.rowBase, 0);
  assert.equal(plain.data[15], 0);
  assert.equal(P.rowBase, P.data[7] + P.vertices * 2);
  assert.equal(P.data[15], P.rowBase);
  assert.deepEqual(Array.from(P.data.subarray(P.rowBase * 4, P.rowBase * 4 + rows.length)), Array.from(rows));
  // (Everything before them the same, texel for texel, but texel 3's w.)
  const before = P.rowBase * 4;
  const a = Array.from(plain.data.subarray(0, before)), b = Array.from(P.data.subarray(0, before));
  a[15] = b[15] = 0;
  assert.deepEqual(b, a);
  for (const r of boxRays(P.lo, P.hi, 500, 100, 3)) assert.deepEqual(traceCPU(P, r.o, r.d, r.tEnd), traceCPU(plain, r.o, r.d, r.tEnd));
  assert.throws(() => packScape(meshes, { rows: new Float32Array(6) }), /rows/);
});

test("a triangle's first word holds the highest vertex id and material there is room for, exactly, and no more", () => {
  // (As many vertices as the word leaves room for, all but the last three at one point; a triangle
  // on those three, of the highest material, and one at the start.)
  const V = (1 << (24 - SCAPE_MAT_BITS)) - 1, top = (1 << SCAPE_MAT_BITS) - 1;
  const mesh = (vc) => {
    const positions = new Float32Array(vc * 3).fill(-0.5), normals = new Float32Array(vc * 3), attrs = new Float32Array(vc * 4);
    for (let v = 0; v < vc; v++) normals[v * 3 + 1] = 1;
    positions.set([0, -0.5, 0, 0.1, -0.5, 0, 0, -0.5, 0.1], (vc - 3) * 3);
    positions.set([0.3, -0.5, 0, 0.4, -0.5, 0, 0.3, -0.5, 0.1], 0);
    attrs.set([7, 8, 9, 1], (vc - 2) * 4);
    return { name: 'wide', positions, normals, attrs, indices: Uint32Array.from([vc - 3, vc - 2, vc - 1, 0, 1, 2]), materials: Uint8Array.from([top, MAT.SUCTION]) };
  };
  const P = packScape([mesh(V)]);
  for (const [x, material, ids] of [[0.03, top, [V - 3, V - 2, V - 1]], [0.33, MAT.SUCTION, [0, 1, 2]]]) {
    const h = traceCPU(P, [x, -0.4, 0.03], [0, -1, 0], 1);
    assert.notEqual(h.tri, NONE);
    const s = surfaceCPU(P, h);
    assert.equal(s.material, material);
    assert.deepEqual(s.vertices, ids);
    assert.equal(P.data[(P.data[1] + h.tri * 3) * 4 + 3], ids[0] * (top + 1) + material);
  }
  // (The second corner's attributes read back through its id: the vertex table's far end.)
  const far = surfaceCPU(P, traceCPU(P, [0.1 - 1e-5, -0.4, 1e-5], [0, -1, 0], 1));
  assert.ok(Math.abs(far.attrs[0] - 7) < 1e-3 && Math.abs(far.attrs[3] - 1) < 1e-3);
  assert.throws(() => packScape([mesh(V + 1)]), /vertices/);
  assert.throws(() => packScape([{ ...mesh(8), materials: Uint8Array.from([top + 1, 1]) }]), /material/);
});

test('the real pieces, if present: sound, agree with brute force; and the measurements that chose the traversal', async () => {
  const pieces = await realPieces();
  const scenes = [['furnishings-like (synthetic)', furnishingsLike(31)]];
  if (pieces.length) scenes.push([`the real pieces (${pieces.map((p) => p.name).join(', ')})`, pieces.flatMap((p) => p.meshes)]);
  else console.log('  (no real pieces yet: wood.mjs, rocks.mjs, plants.mjs)');
  for (const [label, meshes] of scenes) {
    const P = packScape(meshes);
    describe(P, label);
    assert.ok(P.buildMs < 4000, 'build too slow');
    checkPacked(P, meshes);
    const B = brute(meshes);
    const r = checkRays(P, B, boxRays(P.lo, P.hi, 3000, 1000, 2024), label);
    console.log(`    brute force: ${r.hits} hits agree; ${r.marginal} marginal answers (on an edge); ${r.shadowsLit} of 4000 shadow segments lit, ${r.crossings} crossings`);
    assert.ok(r.marginal <= 10);
    // Surfaces at hits: the corners' attributes interpolated, the normals unit.
    const view = viewRays(P, 4000, 5);
    let surfaces = 0;
    for (const v of view.slice(0, 500)) {
      const h = traceCPU(P, v.o, v.d, v.tEnd);
      if (h.tri === NONE) continue;
      const s = surfaceCPU(P, h);
      assert.ok(Math.abs(Math.hypot(...s.n) - 1) < 1e-5 && Math.abs(Math.hypot(...s.ng) - 1) < 1e-5);
      assert.equal(s.material, B.M[P.order[h.tri]]);
      surfaces++;
    }
    assert.ok(surfaces > 50);
    measure(meshes, { view, shadow: shadowRays(P, view, 6) }, label);
  }
});
