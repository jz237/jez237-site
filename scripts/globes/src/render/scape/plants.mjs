// The betta bowl's plants (its page only; mesh.mjs holds the ground rules). At the right, behind the
// driftwood's right foot, a tall Anubias barteri: nine broad leaves and two young half-furled ones,
// each on its own long thin petiole from a short rhizome lying on the sand, its roots going down
// into it. At the left, behind the big rock, a small bushy rosette of twenty little leaves, the
// young inner ones narrow and upright, the older outer ones broader and arching out.
// Every blade is one thin two-sided sheet with its true relief: arched along, cupped across, a
// slight twist, a gently wavy margin, the midrib a groove on top and a ridge beneath (its stalk
// run on under it), the lateral veins a faint quilting between them.

import { BED_LEVEL, GLASS_CLEAR, MAT, MeshBuilder, noise3, stream } from './mesh.mjs';

/** @typedef {import('./mesh.mjs').V3} V3 */

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => mul(a, 1 / (len(a) || 1));
const mix3 = (a, b, t) => add(a, mul(sub(b, a), t));
/** a turned by angle t round the unit axis k. */
const rot = (a, k, t) => {
  const c = Math.cos(t), s = Math.sin(t);
  return add(add(mul(a, c), mul(cross(k, a), s)), mul(k, dot(k, a) * (1 - c)));
};
const smooth = (e0, e1, x) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};
const UP = [0, 1, 0];
/** The part of a square to the unit vector d, of unit length. */
const square = (a, d) => norm(sub(a, mul(d, dot(a, d))));

// ---- the blade ------------------------------------------------------------------------------

const fract = (x) => x - Math.floor(x);
/** A blade's own outline, from its id (the material's WGSL works it out the same way): where it is
 *  widest (along it, 0..1), how full its base is, how its tip narrows and how drawn out it is (a
 *  small plant's leaves less). */
function outlineOf(id, small) {
  const h1 = fract(id * 0.618034 + 0.17), h2 = fract(id * 0.754877 + 0.31), h3 = fract(id * 0.56984 + 0.53);
  return { widest: 0.3 + 0.12 * h1, base: 2 + h2, tip: 1.45 + 0.5 * h3, drawn: small ? 0.06 + 0.14 * h1 : 0.18 + 0.2 * h1 };
}
/** A blade's half-width at u along it (0..1 of the widest; o its outlineOf): rounded at its base,
 *  widest a third of the way out or so, then narrowing to a pointed, more or less drawn-out tip.
 *  The material's WGSL repeats it. */
function outline(u, o) {
  if (u <= o.widest) return Math.sqrt(Math.max(1 - ((o.widest - u) / o.widest) ** o.base, 0));
  const t = (u - o.widest) / (1 - o.widest);
  return Math.max(1 - t ** o.tip, 0) ** 1.05 * (1 - o.drawn * smooth(0.62, 1, t));
}
/** Where the lateral veins run (whole numbers on them): out from the midrib at about fifty degrees,
 *  bending forwards along the margin, the two sides' alternate, their spacing a little uneven. The
 *  material's WGSL repeats it. */
const VEIN_SLOPE = 0.3;
const veinPhase = (u, v, count, id, o) => {
  const av = Math.abs(v), left = v < 0 ? 1 : 0;
  return count * (u - VEIN_SLOPE * av ** 1.2 * outline(u, o)) + 0.5 * left + 0.2 * Math.sin(9 * u + 2.3 * id + 1.7 * left) * Math.min(2 * av, 1);
};

/**
 * @typedef {object} BladeSpec
 * @property {V3} base where its midrib starts
 * @property {V3} dir its first direction along (unit)
 * @property {V3} face the side it turns up (unit, square to dir)
 * @property {number} length
 * @property {number} ratio its width over its length
 * @property {number} arch radians its midrib bends down by the tip, away from its face
 * @property {number} droop more at the very tip
 * @property {number} side its midrib's bend sideways (radians)
 * @property {number} twist radians round its midrib, base to tip
 * @property {number} cup its sides raised (of the half-width)
 * @property {number} fold a V along the midrib (of the half-width)
 * @property {number} quilt the relief between the lateral veins (of its length)
 * @property {number} wave the margin's waves (of the half-width)
 * @property {number} waves how many along it
 * @property {number} phase
 * @property {number} asym one side wider than the other (fraction)
 * @property {number} furl a young leaf rolled in from its margins (0 open, ~1 rolled)
 * @property {number} veins lateral veins a side
 * @property {number} id
 * @property {boolean} [small] a small plant's leaf (see outlineOf)
 */

/** A blade's shape: at(u, x) the point u along it (0..1) and x across (world units, + to its
 *  right), frame(u) its midrib's point and axes there, half(u, right) its half-width. */
function bladeShape(/** @type {BladeSpec} */ b) {
  const L = b.length, H = 0.5 * b.ratio * L;
  const X0 = norm(cross(b.face, b.dir));
  const M = 120;
  /** @type {V3[]} */ const pts = [[0, 0, 0]];
  const fr = [];
  for (let k = 0; k <= M; k++) {
    const s = k / M;
    const th = b.arch * s ** 1.6 + b.droop * smooth(0.7, 1, s);
    const be = b.side * s ** 1.3;
    let T = rot(b.dir, X0, th), N = rot(b.face, X0, th);
    let X = rot(X0, N, be);
    T = rot(T, N, be);
    X = rot(X, T, b.twist * s);
    N = rot(N, T, b.twist * s);
    fr.push({ T, N, X });
    if (k) pts.push(add(pts[k - 1], mul(add(T, fr[k - 1].T), (0.5 * L) / M)));
  }
  const frame = (u) => {
    const f = Math.min(Math.max(u, 0), 1) * M, k = Math.min(Math.floor(f), M - 1), t = f - k;
    return {
      c: add(b.base, mix3(pts[k], pts[k + 1], t)),
      T: norm(mix3(fr[k].T, fr[k + 1].T, t)),
      N: norm(mix3(fr[k].N, fr[k + 1].N, t)),
      X: norm(mix3(fr[k].X, fr[k + 1].X, t)),
    };
  };
  const ol = outlineOf(b.id, !!b.small);
  const half = (u, right) => outline(u, ol) * H * (right ? 1 + b.asym : 1 - b.asym);
  const at = (u, x) => {
    const { c, N, X } = frame(u);
    const hw = half(u, x >= 0);
    const v = Math.max(-1.2, Math.min(1.2, x / Math.max(hw, 1e-7)));
    const av = Math.abs(v);
    const mid = Math.sin(Math.PI * Math.min(u * 1.15, 1));
    let h = b.cup * (0.3 + 0.7 * mid) * hw * v * v;
    h += b.fold * hw * (Math.sqrt(v * v + 0.004) - 0.0632);
    const gw = L * (0.013 - 0.007 * u);
    h -= L * 0.0065 * (1 - 0.8 * u) * Math.exp(-((x / gw) ** 2));
    h += L * b.quilt * (0.5 - 0.5 * Math.cos(2 * Math.PI * veinPhase(u, v, b.veins, b.id, ol))) *
      smooth(0.05, 0.2, av) * (1 - smooth(0.75, 1, av)) * smooth(0.03, 0.12, u) * (1 - smooth(0.85, 0.98, u));
    const ph = x >= 0 ? b.phase : b.phase + 2.3;
    h += b.wave * hw * (Math.sin(2 * Math.PI * b.waves * u + ph) + 0.6 * noise3(u * 6, v * 1.3, b.id * 3.7 + 0.5)) *
      smooth(0.4, 1, av) ** 2 * mid;
    if (!b.furl) return add(add(c, mul(X, x)), mul(N, h));
    // (A young leaf is rolled in from its margins, its right half inside its left.)
    const rho = hw / (b.furl * (x >= 0 ? 4.6 : 4.0));
    const phi = x / Math.max(rho, 1e-7);
    return add(add(c, mul(X, rho * Math.sin(phi))), mul(N, rho * (1 - Math.cos(phi))));
  };
  return { b, L, H, at, frame, half };
}

/** Adds a blade's sheet to mb: nu rows along (finer at its ends), nv across (finer at the midrib),
 *  a single point at its base and its tip. */
function bladeMesh(mb, shape, nu, nv, mat) {
  const { b, L, at, frame, half } = shape;
  const normalAt = (u, x) => {
    const e = 2e-4;
    const du = sub(at(Math.min(u + e, 1), x), at(Math.max(u - e, 0), x));
    const dx = sub(at(u, x + e * L), at(u, x - e * L));
    const n = cross(du, dx);
    return len(n) > 1e-14 ? norm(n) : frame(u).N;
  };
  const vs = [];
  for (let j = 0; j <= nv; j++) {
    const t = -1 + (2 * j) / nv;
    vs.push(Math.sign(t) * Math.abs(t) ** 1.3);
  }
  const base = mb.vertex(at(0, 0), [0, 0, b.id, 1], frame(0).N);
  const rows = [];
  for (let i = 1; i < nu; i++) {
    const t = i / nu;
    const u = 0.6 * t + 0.4 * (0.5 - 0.5 * Math.cos(Math.PI * t));
    rows.push(vs.map((v) => {
      const x = v * half(u, v >= 0);
      return mb.vertex(at(u, x), [u, v, b.id, 1], normalAt(u, x));
    }));
  }
  const tip = mb.vertex(at(1, 0), [1, 0, b.id, 1], frame(1).N);
  for (let j = 0; j < nv; j++) {
    mb.tri(base, rows[0][j], rows[0][j + 1], mat);
    for (let i = 0; i + 1 < rows.length; i++) mb.quad(rows[i][j], rows[i + 1][j], rows[i + 1][j + 1], rows[i][j + 1], mat);
    mb.tri(rows[rows.length - 1][j], tip, rows[rows.length - 1][j + 1], mat);
  }
}

// ---- tubes ----------------------------------------------------------------------------------

/** A frame carried along the centre line pts without twist from ref: at each point its direction T
 *  and a unit vector U square to it (ref's way at the start). */
function carry(pts, ref) {
  const n = pts.length;
  const T = pts.map((_, k) => norm(sub(pts[Math.min(k + 1, n - 1)], pts[Math.max(k - 1, 0)])));
  const U = [square(ref, T[0])];
  for (let k = 1; k < n; k++) {
    const ax = cross(T[k - 1], T[k]), sl = len(ax);
    const u = sl > 1e-9 ? rot(U[k - 1], mul(ax, 1 / sl), Math.atan2(sl, dot(T[k - 1], T[k]))) : U[k - 1];
    U.push(square(u, T[k]));
  }
  return { T, U };
}

/** A tube round the centre line pts (radius rad[k] at pts[k]), `sides` round, its frame carried
 *  along from ref (see carry); an end whose radius is 0 closes to a point. prof(k, a), if given,
 *  shapes its section: the radius's factor at pts[k] and angle a round it (0 on U's side). attrs:
 *  the distance along it, the angle round it, id. */
function tube(mb, pts, rad, sides, mat, id, ref, prof = null) {
  const n = pts.length;
  const { T, U: Us } = carry(pts, ref);
  const rings = [];
  let s = 0;
  for (let k = 0; k < n; k++) {
    const U = Us[k];
    if (k) s += len(sub(pts[k], pts[k - 1]));
    if (rad[k] <= 0) {
      rings.push(mb.vertex(pts[k], [s, 0, id, 1], k ? T[k] : mul(T[k], -1)));
      continue;
    }
    const V = cross(T[k], U);
    const k0 = Math.max(k - 1, 0), k1 = Math.min(k + 1, n - 1);
    const gap = Math.max(len(sub(pts[k1], pts[k0])), 1e-9);
    const ring = [];
    for (let j = 0; j <= sides; j++) {
      const a = (2 * Math.PI * j) / sides;
      const r = add(mul(U, Math.cos(a)), mul(V, Math.sin(a)));
      if (!prof) {
        const slope = (rad[k1] - rad[k0]) / gap;
        ring.push(mb.vertex(add(pts[k], mul(r, rad[k])), [s, a, id, 1], norm(sub(r, mul(T[k], Math.max(-3, Math.min(3, slope)))))));
        continue;
      }
      // (The section's normal, turned by how its radius changes round it, then along it.)
      const m = prof(k, a), dm = (prof(k, a + 1e-3) - prof(k, a - 1e-3)) / 2e-3;
      const across = norm(sub(mul(r, m), mul(add(mul(U, -Math.sin(a)), mul(V, Math.cos(a))), dm)));
      const slope = ((rad[k1] * prof(k1, a) - rad[k0] * prof(k0, a)) / gap) * dot(r, across);
      ring.push(mb.vertex(add(pts[k], mul(r, rad[k] * m)), [s, a, id, 1], norm(sub(across, mul(T[k], Math.max(-3, Math.min(3, slope)))))));
    }
    rings.push(ring);
  }
  for (let k = 0; k + 1 < n; k++) {
    const A = rings[k], B = rings[k + 1];
    for (let j = 0; j < sides; j++) {
      if (typeof A === 'number') mb.tri(A, B[j + 1], B[j], mat);
      else if (typeof B === 'number') mb.tri(A[j], A[j + 1], B, mat);
      else mb.quad(A[j], A[j + 1], B[j + 1], B[j], mat);
    }
  }
}

/** Points along a cubic Bezier, closer together where t is near 1 (a stalk's bend to its blade). */
function bezier(p0, p1, p2, p3, count, bias = 1.35) {
  const out = [];
  for (let k = 0; k <= count; k++) {
    const t = 1 - (1 - k / count) ** bias;
    const m = 1 - t;
    out.push(add(add(mul(p0, m * m * m), mul(p1, 3 * m * m * t)), add(mul(p2, 3 * m * t * t), mul(p3, t * t * t))));
  }
  return out;
}

/** Points along a Catmull-Rom curve through pts, `per` a span. */
function catmull(pts, per) {
  const out = [];
  const n = pts.length - 1;
  for (let i = 0; i < n; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, n)];
    for (let k = 0; k < per || (i === n - 1 && k === per); k++) {
      const t = k / per;
      const c = (j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t * t * t);
      out.push([c(0), c(1), c(2)]);
    }
  }
  return out;
}

// ---- a leaf: its petiole and blade ------------------------------------------------------------

/** A petiole's centre line: from `from`, rising first along `rise`, to just under the blade's base,
 *  bending there into the blade's line; rMid, the midrib ridge's radius it runs on into. */
function stalkPath(shape, from, rise, segs, rMid) {
  const top = shape.frame(0);
  const end = add(shape.at(0, 0), mul(top.N, -0.8 * rMid));
  const D = len(sub(end, from));
  return bezier(from, add(from, mul(rise, 0.45 * D)), sub(end, mul(top.T, Math.min(0.08, 0.3 * D))), end, segs);
}

/**
 * A leaf's stalk: its petiole (see stalkPath), run on under the blade's midrib as its ridge,
 * tapering out. o: rBase, rTop (the petiole's radius at its foot and top), sides, segs, midrib
 * (how far along the blade the ridge runs), midribSegs, sheath (how much its foot flares),
 * sheathLen (over how long) and groove (how deep the channel down its upper side is, of its radius;
 * it fades out where the blade begins, the ridge under the blade being round).
 */
function leafStalk(mb, shape, from, rise, o, id) {
  const rMid = o.rTop * 1.12;
  const pts = stalkPath(shape, from, rise, o.segs, rMid);
  const D = len(sub(pts[pts.length - 1], from));
  const rad = [];
  pts.forEach((p, k) => {
    const t = k / o.segs;
    // (A faint waver: no stalk is a perfect curve.)
    if (k && k < o.segs) {
      const w = 0.003 * Math.sin(Math.PI * t) * (D / 0.4);
      pts[k] = add(p, [w * noise3(t * 2.2, id * 1.7, 0.3), w * noise3(t * 2.2, id * 1.7, 5.1), w * noise3(t * 2.2, id * 1.7, 9.7)]);
    }
    const r = o.rBase + (o.rTop - o.rBase) * t ** 0.7;
    rad.push(r * (1 + o.sheath * (1 - smooth(0, o.sheathLen / D, t)) ** 2) * (1 + 0.14 * smooth(0.88, 1, t)));
  });
  const n = o.midribSegs;
  for (let k = 1; k <= n; k++) {
    const u = (k / n) * o.midrib;
    const r = k === n ? 0 : rMid * (1 - k / n) ** 0.75;
    pts.push(add(shape.at(u, 0), mul(shape.frame(u).N, -0.8 * r)));
    rad.push(r);
  }
  // (Its channel faces the way the blade's face does where they meet.)
  const N0 = shape.frame(0).N;
  const { T, U } = carry(pts, N0);
  const a0 = Math.atan2(dot(N0, cross(T[o.segs], U[o.segs])), dot(N0, U[o.segs]));
  const groove = (k, a) => 1 - o.groove * (1 - smooth(o.segs - 3, o.segs, k)) * Math.max(0, Math.cos(a - a0)) ** 3;
  tube(mb, pts, rad, o.sides, MAT.STEM, id, N0, groove);
  return pts;
}

/** Pulls p in from the glass (round the bowl's axis) to keep it clear. */
function offGlass(p, clear = GLASS_CLEAR - 0.01) {
  const r = len(p);
  if (r <= clear) return p;
  const h = Math.hypot(p[0], p[2]), want = Math.sqrt(Math.max(clear * clear - p[1] * p[1], 0));
  return [(p[0] * want) / h, p[1], (p[2] * want) / h];
}

/** A root from inside a crown at c (of radius rc): out along the sand's top, only its back showing,
 *  for `run`, then down into the sand, wavering, tapering to a point; kept clear of the glass. */
function root(mb, c, out, rc, run, r0, id, rand) {
  const sunk = BED_LEVEL - 0.9 * r0;
  const side = norm(cross(out, UP));
  const bend = 0.3 * (rand() - 0.5);
  const at = (d, y, w = 0) => [c[0] + out[0] * d + side[0] * w, y, c[2] + out[2] * d + side[2] * w];
  const key = [c, at(0.9 * rc, sunk + 0.7 * r0), at(rc + 0.5 * run, sunk, bend * run), at(rc + run, sunk, 1.6 * bend * run),
    at(rc + run + 0.012, sunk - 0.03, 2 * bend * run), at(rc + run + 0.018, sunk - 0.07, 2.2 * bend * run)];
  const pts = catmull(key, 5).map((p, i) => {
    const w = i > 6 ? 0.0025 : 0;
    return offGlass(add(p, [w * noise3(i * 0.35, id, 1.1), 0.4 * w * noise3(i * 0.35, id, 4.2), w * noise3(i * 0.35, id, 7.3)]));
  });
  const rad = pts.map((_, i) => (i === pts.length - 1 ? 0 : r0 * (1.1 - 0.65 * (i / pts.length))));
  tube(mb, pts, rad, 6, MAT.ROOT, id, UP);
}

// ---- where the neighbours lie (the layout's, roughly: for keeping clear of them) --------------

/** The driftwood's centre lines (its arch, the broken limb up from its crest, the short limb down
 *  at its left) and their radii. */
const WOOD = [
  { r: 0.1, pts: [[-0.52, -0.65, -0.045], [-0.5, -0.55, -0.055], [-0.45, -0.474, -0.064], [-0.38, -0.418, -0.076], [-0.3, -0.381, -0.086], [-0.21, -0.358, -0.113], [-0.125, -0.325, -0.133], [-0.034, -0.29, -0.144], [0.06, -0.273, -0.152], [0.16, -0.273, -0.159], [0.25, -0.299, -0.164], [0.33, -0.342, -0.158], [0.39, -0.403, -0.147], [0.44, -0.47, -0.136], [0.48, -0.55, -0.131], [0.5, -0.65, -0.138]] },
  { r: 0.085, pts: [[0.15, -0.27, -0.165], [0.2, -0.13, -0.245], [0.228, -0.04, -0.254]] },
  { r: 0.095, pts: [[-0.42, -0.441, -0.073], [-0.4, -0.501, -0.004], [-0.37, -0.56, 0.058], [-0.35, -0.64, 0.108]] },
];
/** The rocks: where each sits on the bed, its width (x), height above the sand and depth (z). */
const ROCKS = [
  { c: [-0.4, 0.32], w: 0.24, h: 0.15, d: 0.19 },
  { c: [0.17, 0.24], w: 0.17, h: 0.1, d: 0.14 },
  { c: [0.4, 0.1], w: 0.15, h: 0.09, d: 0.12 },
  { c: [0.62, 0.12], w: 0.09, h: 0.05, d: 0.08 },
];
/** The open water the betta keeps. */
const WATER = { lo: [-0.35, -0.15, -0.2], hi: [0.35, 0.6, 0.6] };
const segDist = (p, a, b) => {
  const ex = b[0] - a[0], ey = b[1] - a[1], ez = b[2] - a[2];
  const px = p[0] - a[0], py = p[1] - a[1], pz = p[2] - a[2];
  const t = Math.min(Math.max((px * ex + py * ey + pz * ez) / (ex * ex + ey * ey + ez * ez), 0), 1);
  return Math.hypot(px - ex * t, py - ey * t, pz - ez * t);
};
/** How far p is inside a neighbour or the betta's water (more than a leaf tip's way), with a margin
 *  (0 when clear). */
function intrusion(p, margin) {
  let worst = 0;
  for (const w of WOOD) {
    for (let i = 0; i + 1 < w.pts.length; i++) worst = Math.max(worst, w.r + margin - segDist(p, w.pts[i], w.pts[i + 1]));
  }
  for (const r of ROCKS) {
    const hy = r.h / 0.65;
    const q = [(p[0] - r.c[0]) / (0.5 * r.w + margin), (p[1] - (BED_LEVEL + r.h - 0.5 * hy)) / (0.5 * hy + margin), (p[2] - r.c[1]) / (0.5 * r.d + margin)];
    const e = len(q);
    if (e < 1) worst = Math.max(worst, (1 - e) * 0.5 * r.h);
  }
  const inWater = Math.min(...[0, 1, 2].map((k) => Math.min(p[k] - WATER.lo[k], WATER.hi[k] - p[k])));
  return Math.max(worst, inWater - 0.015);
}

/** How far a blade comes nearer the glass than it may, into a neighbour or out of its bounds
 *  ({lo, hi}, optional) (0 when clear). */
function trespass(shape, margin, bounds) {
  let worst = 0;
  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    for (const v of [-1, -0.5, 0, 0.5, 1]) {
      const p = shape.at(u, v * shape.half(u, v >= 0));
      if (p[1] > BED_LEVEL - 0.02) worst = Math.max(worst, len(p) - (GLASS_CLEAR - 0.012));
      worst = Math.max(worst, intrusion(p, margin));
      if (bounds) for (let k = 0; k < 3; k++) worst = Math.max(worst, bounds.lo[k] - p[k], p[k] - bounds.hi[k]);
    }
  }
  return worst;
}

/** Points of the leaves placed so far, hashed in space, to keep new ones from passing through
 *  them: blade points, and stalk points (which may crowd each other by their crown). */
class Crowd {
  constructor(cell) {
    this.cell = cell;
    /** @type {Map<number, {p: V3, blade: boolean}[]>} */ this.map = new Map();
  }
  key(i, j, k) {
    return ((i + 512) * 1024 + (j + 512)) * 1024 + (k + 512);
  }
  add(p, blade) {
    const c = this.cell, k = this.key(Math.floor(p[0] / c), Math.floor(p[1] / c), Math.floor(p[2] / c));
    if (!this.map.has(k)) this.map.set(k, []);
    this.map.get(k).push({ p, blade });
  }
  /** How far p comes within gapBlade of a stored blade point or gapStalk of a stalk point. */
  near(p, gapBlade, gapStalk) {
    const c = this.cell, i = Math.floor(p[0] / c), j = Math.floor(p[1] / c), k = Math.floor(p[2] / c);
    let w = 0;
    for (let a = -1; a <= 1; a++) {
      for (let b = -1; b <= 1; b++) {
        for (let e = -1; e <= 1; e++) {
          for (const q of this.map.get(this.key(i + a, j + b, k + e)) ?? []) {
            const g = q.blade ? gapBlade : gapStalk;
            const dx = q.p[0] - p[0], dy = q.p[1] - p[1], dz = q.p[2] - p[2];
            if (dx * dx + dy * dy + dz * dz < (g - w) * (g - w) && g > w) w = g - Math.sqrt(dx * dx + dy * dy + dz * dz);
          }
        }
      }
    }
    return w;
  }
}

function bladeSamples(shape, nu, nv) {
  const out = [];
  for (let i = 0; i <= nu; i++) {
    const u = (i / nu) ** 1.25;
    for (let j = 0; j <= nv; j++) {
      const v = -1 + (2 * j) / nv;
      out.push(shape.at(u, v * shape.half(u, v >= 0)));
    }
  }
  return out;
}

/**
 * Fits a leaf: make(q) builds it from its adjustments q (turned round the bowl's axis, raised,
 * shortened and, if the moves have a fourth, rolled round its midrib; all 0 at first) as {b, from,
 * rise}; each round tries every move (a change to q, then what it costs) and takes the one that
 * helps most, until the leaf keeps clear of the glass, its neighbours and bounds, and (o.crowd) the
 * blades placed before it by o.gap and their stalks by o.stalkGap, or it stops getting better.
 * Still not clear, it tries the wider changes o.wide (as the moves) from the best. Returns the best
 * leaf found and its shape.
 */
function fit(make, moves, o) {
  const score = (leaf) => {
    const shape = bladeShape(leaf.b);
    let w = trespass(shape, o.margin, o.bounds);
    const stalk = stalkPath(shape, leaf.from, leaf.rise, 12, 0);
    for (const p of stalk.slice(4)) w = Math.max(w, intrusion(p, 0.01));
    if (o.crowd) {
      for (const p of bladeSamples(shape, o.samples[0], o.samples[1])) w = Math.max(w, o.crowd.near(p, o.gap, o.stalkGap));
      for (const p of stalk.slice(3)) w = Math.max(w, o.crowd.near(p, o.stalkGap, 0));
    }
    return { shape, w };
  };
  let q = moves[0].slice(1).map(() => 0);
  let cur = { leaf: make(q), q };
  cur.s = score(cur.leaf);
  let best = cur;
  for (let it = 0, stale = 0; it < 24 && best.s.w > 0 && stale < 4; it++) {
    let next = null;
    for (const m of moves) {
      const q2 = cur.q.map((x, i) => x + m[i]);
      const l2 = make(q2), s2 = score(l2);
      const cost = s2.w + m[m.length - 1];
      if (!next || cost < next.cost) next = { cost, q: q2, leaf: l2, s: s2 };
    }
    cur = next;
    if (cur.s.w < best.s.w - 1e-5) {
      best = cur;
      stale = 0;
    } else stale++;
  }
  if (best.s.w > 0 && o.wide) {
    let found = null;
    for (const d of o.wide) {
      const q2 = best.q.map((x, i) => x + d[i]);
      const l2 = make(q2), s2 = score(l2);
      const cost = s2.w + d[d.length - 1];
      if (s2.w < best.s.w && (!found || cost < found.cost)) found = { cost, q: q2, leaf: l2, s: s2 };
    }
    if (found) best = found;
  }
  return { leaf: best.leaf, shape: best.s.shape };
}

/** Adds a placed leaf's blade and stalk to the crowd. */
function crowdIn(crowd, shape, stalk, samples) {
  for (const p of bladeSamples(shape, samples[0], samples[1])) crowd.add(p, true);
  for (const p of stalk) crowd.add(p, false);
}

// ---- occlusion --------------------------------------------------------------------------------

/** Sets each vertex's occlusion: how much of the sky above (the light comes from the lid) the
 *  plant's other parts hide from it, as small discs (patches), `strength` how much they shade,
 *  and darker low down by the crown. */
function occlude(mb, owners, patches, reach, strength) {
  // (The patches flattened: centre, normal (0 for none), area, owner.)
  const P = new Float64Array(patches.length * 8);
  patches.forEach((q, i) => P.set([...q.c, ...(q.n ?? [0, 0, 0]), q.a, q.owner], i * 8));
  for (let v = 0; v < mb.vertexCount; v++) {
    const x = mb.p[v * 3], y = mb.p[v * 3 + 1], z = mb.p[v * 3 + 2];
    const own = owners[v];
    let sum = 0;
    for (let i = 0; i < P.length; i += 8) {
      if (P[i + 7] === own) continue;
      const dx = P[i] - x, dy = P[i + 1] - y, dz = P[i + 2] - z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < 2.5e-5) continue;
      const dist = Math.sqrt(d2);
      const up = dy / dist;
      if (up <= -0.1) continue;
      const nn = P[i + 3] || P[i + 4] || P[i + 5];
      const facing = nn ? Math.abs(P[i + 3] * dx + P[i + 4] * dy + P[i + 5] * dz) / dist : 0.5;
      // (Faded out close by, where a disc no longer stands for the part it samples.)
      sum += (P[i + 6] * (up + 0.1) * facing * smooth(0.005, 0.015, dist)) / (Math.PI * d2 + P[i + 6]);
    }
    const low = smooth(-0.01, reach, y - BED_LEVEL);
    mb.a[v * 4 + 3] = Math.max(Math.exp(-strength * sum), 0.35) * (0.75 + 0.25 * low);
  }
}

function bladePatches(shape, owner, out) {
  const nu = 8, nv = 4;
  for (let i = 0; i < nu; i++) {
    for (let j = 0; j < nv; j++) {
      const u = (i + 0.5) / nu, v = -1 + (2 * j + 1) / nv;
      const hw = shape.half(u, v >= 0);
      out.push({ c: shape.at(u, v * hw), n: shape.frame(u).N, a: (shape.L / nu) * ((2 * hw) / nv), owner });
    }
  }
}

function tubePatches(pts, r, owner, out) {
  for (let k = 3; k < pts.length; k += 3) out.push({ c: pts[k], n: null, a: 2 * r * len(sub(pts[k], pts[k - 3])), owner });
}

/** Marks the vertices from `start` on as `owner`'s. */
const mark = (mb, owners, start, owner) => {
  for (let v = start; v < mb.vertexCount; v++) owners[v] = owner;
};

// ---- the tall plant -------------------------------------------------------------------------

const TALL_CROWN = [0.5, BED_LEVEL, -0.32];
/** Where its leaves stay (about). */
const TALL_BOUNDS = { lo: [0.06, -0.7, -0.64], hi: [0.92, 0.2, 0.24] };

/** Its leaves, placed in this order: the petiole's top (where the blade starts), the blade's first
 *  direction, length, width over length, arch, where along the rhizome its petiole rises (0..1),
 *  how far its face turns to the viewer (as well as up), and a young leaf's furl. Larger higher up;
 *  the highest arches out over the driftwood's right half. */
const TALL_LEAVES = [
  { top: [0.42, -0.06, -0.46], dir: [-0.66, 0.6, 0.25], length: 0.44, ratio: 0.5, arch: 0.85, at: 0.24, toward: 1.0 },
  { top: [0.64, -0.1, -0.3], dir: [0.4, 0.75, 0.3], length: 0.41, ratio: 0.48, arch: 0.8, at: 0.74, toward: 0.8 },
  { top: [0.47, -0.2, -0.15], dir: [-0.75, 0.1, 0.65], length: 0.36, ratio: 0.5, arch: 0.6, at: 0.47, toward: 0.9 },
  { top: [0.36, -0.14, -0.5], dir: [-0.6, 0.7, -0.1], length: 0.34, ratio: 0.47, arch: 0.7, at: 0.06, toward: 0.9 },
  { top: [0.56, -0.17, -0.22], dir: [0.55, 0.55, 0.6], length: 0.31, ratio: 0.5, arch: 0.75, at: 0.53, toward: 0.9 },
  { top: [0.67, -0.26, -0.43], dir: [0.1, 0.8, -0.4], length: 0.32, ratio: 0.48, arch: 0.6, at: 0.82, toward: 0.6 },
  { top: [0.64, -0.32, -0.13], dir: [0.75, 0.3, 0.55], length: 0.29, ratio: 0.51, arch: 0.6, at: 0.66, toward: 0.9 },
  { top: [0.4, -0.2, -0.43], dir: [-0.85, 0.35, -0.05], length: 0.28, ratio: 0.49, arch: 0.6, at: 0.15, toward: 1.0 },
  { top: [0.72, -0.4, -0.26], dir: [0.45, 0.75, 0.4], length: 0.24, ratio: 0.5, arch: 0.6, at: 0.92, toward: 0.5 },
  { top: [0.575, -0.38, -0.345], dir: [0.05, 0.97, 0.1], length: 0.16, ratio: 0.42, arch: 0.15, at: 0.58, furl: 0.6, toward: 0.5 },
  { top: [0.47, -0.48, -0.3], dir: [-0.1, 0.95, 0.12], length: 0.1, ratio: 0.4, arch: 0.08, at: 0.37, furl: 0.8, toward: 0.5 },
];

/** dir turned round the bowl's axis by `turn` and up (towards it) by `raise` (radians). */
function steer(dir, turn, raise) {
  const d = rot(dir, UP, turn);
  const k = cross(d, UP);
  if (len(k) < 1e-3) return d;
  return norm(rot(d, norm(k), Math.min(raise, Math.acos(Math.min(d[1], 1)) - 0.05)));
}

function tallPlant(rand, rootRand) {
  const mb = new MeshBuilder('plantTall');
  const owners = [];
  const patches = [];
  const obstacles = [];
  // The rhizome: a short thick creeping stem on the sand, ringed with the crescent scars of old
  // leaves (deepest on the side each grew from, the sides alternating) and wrinkled along its
  // length. (Sampled evenly along it, five rings to a scar's spacing and one on each scar, so every
  // scar is cut alike; its rounded ends more finely.)
  const ra = [0.4, BED_LEVEL + 0.004, -0.285], rb = [0.6, BED_LEVEL + 0.004, -0.36];
  const R = 0.024, SCAR = 0.016;
  const rhizome = (t) => add(mix3(ra, rb, t), [0, 0.006 * Math.sin(Math.PI * t), 0.008 * Math.sin(2 * Math.PI * t)]);
  {
    const arc = [0];
    for (let i = 1; i <= 400; i++) arc.push(arc[i - 1] + len(sub(rhizome(i / 400), rhizome((i - 1) / 400))));
    const rlen = arc[400];
    const tAt = (s) => {
      let i = 1;
      while (i < 400 && arc[i] < s) i++;
      return (i - 1 + (s - arc[i - 1]) / (arc[i] - arc[i - 1])) / 400;
    };
    const ss = [];
    for (let i = 0; i < 8; i++) ss.push(R * (1 - Math.cos((i / 8) * 0.5 * Math.PI)));
    for (let i = Math.ceil(R / (SCAR / 5)); (i * SCAR) / 5 < rlen - R - 0.001; i++) ss.push((i * SCAR) / 5);
    for (let i = 8; i >= 0; i--) ss.push(rlen - R * (1 - Math.cos((i / 8) * 0.5 * Math.PI)));
    const pts = [], rad = [];
    ss.forEach((s, k) => {
      const end = Math.min(s, rlen - s);
      const cap = end < R ? Math.sqrt(Math.max(1 - ((R - end) / R) ** 2, 0)) : 1;
      pts.push(rhizome(tAt(s)));
      rad.push(k === 0 || k === ss.length - 1 ? 0 : R * cap * (1 + 0.08 * noise3(s * 40, 1.3, 2.9)));
    });
    const scar = (k, a) => {
      const s = ss[k], side = Math.round(s / SCAR) % 2 ? 1 : -1;
      const ring = (0.5 + 0.5 * Math.cos((2 * Math.PI * s) / SCAR)) ** 10;
      return 1 - 0.16 * ring * (0.3 + 0.7 * (0.5 + 0.5 * Math.cos(a - side * 1.1)) ** 1.5);
    };
    const wrinkle = (k, a) => scar(k, a) * (1 + 0.04 * noise3(ss[k] * 14, 0.7 * Math.cos(a) + 2.3, 0.7 * Math.sin(a) + 7.1));
    tube(mb, pts, rad, 18, MAT.ROOT, 0, UP, wrinkle);
    mark(mb, owners, 0, 900);
    tubePatches(pts, R, 900, patches);
  }
  // Its roots: a few short thick ones from its underside out along the sand a little (backwards
  // and to the sides, the driftwood's foot being in front), then down into it.
  const axis = norm(sub(rb, ra));
  const back = norm(cross(UP, axis));
  for (let k = 0; k < 4; k++) {
    const start = mb.vertexCount;
    const t = 0.1 + (0.8 * k) / 3 + 0.05 * (rootRand() - 0.5);
    const out = norm(add(mul(back, 0.6 + 0.4 * rootRand()), mul(axis, 1.2 * (rootRand() - 0.5) + (k === 0 ? -1 : k === 3 ? 1 : 0))));
    root(mb, rhizome(t), out, R, 0.015 + 0.02 * rootRand(), 0.0045 + 0.0015 * rootRand(), 2 + k, rootRand);
    mark(mb, owners, start, 901 + k);
  }
  // The leaves, each fitted round the ones before it.
  const crowd = new Crowd(0.03);
  const samples = [18, 7];
  const moves = [[0.1, 0, 0, 0], [-0.1, 0, 0, 0], [0.3, 0, 0, 0.004], [-0.3, 0, 0, 0.004], [0, 0.07, 0, 0.0004], [0, -0.07, 0, 0.0004], [0, 0, 0.05, 0.003]];
  TALL_LEAVES.forEach((l, i) => {
    const young = !!l.furl;
    const outward = norm([l.top[0] - TALL_CROWN[0], 0, l.top[2] - TALL_CROWN[2]]);
    // (A petiole rises from inside the rhizome, leaning out to its leaf, so it leaves the rhizome on
    // that side.)
    const foot = rhizome(l.at);
    const rise = norm(add(UP, mul(norm([l.top[0] - foot[0], 0, l.top[2] - foot[2]]), 0.4 + 0.7 * rand())));
    const r = Array.from({ length: 12 }, rand);
    const make = ([turn, raise, shrink]) => {
      const dir = steer(norm(l.dir), turn, raise);
      // (Turned a little round its own line, so the leaves do not all face alike.)
      const face = rot(square(add(add(UP, [0, 0, l.toward]), mul(outward, 0.3)), dir), dir, 0.4 * (r[0] - 0.5));
      return { from: foot, rise, b: /** @type {BladeSpec} */ ({
        base: l.top, dir, face, length: l.length * Math.exp(-shrink), ratio: l.ratio, arch: l.arch * (0.9 + 0.2 * r[1]),
        droop: young ? 0 : 0.15 + 0.15 * r[2], side: 0.12 * (r[3] - 0.5), twist: 0.35 * (r[4] - 0.5),
        cup: young ? 0.05 : 0.14 + 0.1 * r[5], fold: 0.06 + 0.04 * r[6], quilt: young ? 0 : 0.0006 + 0.0003 * r[7],
        wave: young ? 0.02 : 0.05 + 0.04 * r[8], waves: 2.5 + 1.5 * r[9], phase: 6.28 * r[10], asym: 0.08 * (r[11] - 0.5),
        furl: l.furl ?? 0, veins: 13, id: i,
      }) };
    };
    const { leaf, shape } = fit(make, moves, { margin: 0.02, bounds: TALL_BOUNDS, crowd, gap: 0.02, stalkGap: 0.015, samples });
    const start = mb.vertexCount;
    bladeMesh(mb, shape, young ? 36 : 90, young ? 20 : 22, MAT.LEAF_BIG);
    mark(mb, owners, start, i);
    bladePatches(shape, i, patches);
    // Its petiole.
    const s0 = mb.vertexCount;
    const segs = Math.max(14, Math.round(len(sub(l.top, foot)) / 0.012));
    const pts = leafStalk(mb, shape, leaf.from, rise, {
      rBase: young ? 0.0072 : 0.0085, rTop: young ? 0.0055 : 0.0062, sides: 8, segs,
      midrib: young ? 0.4 : 0.6, midribSegs: young ? 10 : 20, sheath: 0.6, sheathLen: 0.045, groove: 0.2,
    }, i);
    mark(mb, owners, s0, 1000 + i);
    tubePatches(pts.slice(0, segs + 1), 0.007, 1000 + i, patches);
    crowdIn(crowd, shape, pts, samples);
    // (Round its petiole above the crown, and its blade; a young furled leaf, stalk and all.)
    if (young) obstacles.push({ a: pts[Math.round(segs * 0.3)], b: shape.at(1, 0), r: 0.03, solid: 0.015 });
    else {
      const mid = pts[Math.round(segs * 0.6)];
      obstacles.push({ a: pts[Math.round(segs * 0.25)], b: mid, r: 0.035, solid: 0.02 }, { a: mid, b: l.top, r: 0.035, solid: 0.02 });
      obstacles.push({ a: shape.at(0.12, 0), b: shape.at(0.8, 0), r: 0.85 * shape.H + 0.02, solid: 0 });
    }
  });
  obstacles.push({ a: TALL_CROWN, b: add(TALL_CROWN, [0, 0.14, 0]), r: 0.07, solid: 0.03 });
  occlude(mb, owners, patches, 0.2, 1.6);
  return { mesh: mb.finish(), obstacles };
}

// ---- the small plant ------------------------------------------------------------------------

const SMALL_CROWN = [-0.6, BED_LEVEL, 0.06];
/** Where its leaves stay (about). */
const SMALL_BOUNDS = { lo: [-0.88, BED_LEVEL + 0.012, -0.22], hi: [-0.3, -0.2, 0.4] };

function smallPlant(rand) {
  const mb = new MeshBuilder('plantSmall');
  const owners = [];
  const patches = [];
  const obstacles = [];
  // Its crown: a low dome on the sand, the leaves' bases crowded round it.
  {
    const pts = [], rad = [];
    const K = 20, Rc = 0.0145;
    for (let k = 0; k <= K; k++) {
      const t = k / K;
      pts.push(add(SMALL_CROWN, [0.002 * Math.sin(3 * t), -0.03 + 0.062 * t, 0]));
      const capT = smooth(0.72, 1, t);
      rad.push(k === K ? 0 : Rc * (1 - 0.25 * t) * Math.sqrt(Math.max(1 - capT * capT, 0)) * (1 + 0.06 * noise3(t * 5, 3.3, 1)));
    }
    tube(mb, pts, rad, 16, MAT.ROOT, 1, [1, 0, 0]);
    mark(mb, owners, 0, 900);
  }
  // (Its roots go out to the open side, away from the driftwood's foot.)
  for (let k = 0; k < 3; k++) {
    const start = mb.vertexCount;
    const a = 1.6 + (k / 2) * 2.4 + 0.3 * (rand() - 0.5);
    root(mb, add(SMALL_CROWN, [0, 0.004, 0]), [Math.cos(a), 0, Math.sin(a)], 0.012, 0.015 + 0.035 * rand(), 0.0024 + 0.0008 * rand(), 10 + k, rand);
    mark(mb, owners, start, 901 + k);
  }
  const count = 20;
  const tips = [];
  const deg = Math.PI / 180;
  const crowd = new Crowd(0.012);
  const samples = [18, 7];
  const moves = [[0.12, 0, 0, 0, 0], [-0.12, 0, 0, 0, 0], [0.3, 0, 0, 0, 0.001], [-0.3, 0, 0, 0, 0.001], [0, 0.06, 0, 0, 0.0005], [0, -0.06, 0, 0, 0.0005],
    [0, 0, 0.05, 0, 0.002], [0, 0, 0, 0.25, 0.0005], [0, 0, 0, -0.25, 0.0005]];
  // (Where a leaf finds no room by those, it looks further round, up and down, and rolled.)
  const wide = [];
  for (let t = -3; t <= 3; t++) {
    for (const up of [-0.15, 0, 0.15]) {
      for (const roll of [-0.4, 0, 0.4]) wide.push([0.15 * t, up, 0, roll, 0.004 * Math.abs(0.15 * t) + 0.006 * Math.abs(up) + 0.003 * Math.abs(roll)]);
    }
  }
  // (The young inner leaves are placed first, the outer ones fitted round them.)
  for (let n = 0; n < count; n++) {
    const k = count - 1 - n;
    const age = 1 - k / (count - 1);
    // Round it, but most to the open side (left and front), never towards the driftwood behind and
    // to its right or the rock in front; the young inner leaves stand up, the older outer ones lean
    // out to about thirty degrees, so it reads as a bush from the front.
    const az0 = 2.6 + 2.6 * (((k * 0.618034) % 1) - 0.5) * (1.4 - 0.6 * age) + 0.25 * (rand() - 0.5);
    const pe0 = (84 - 34 * age + 6 * (rand() - 0.5)) * deg;
    const be0 = pe0 - (4 + 18 * age * (0.6 + 0.4 * rand())) * deg;
    const pl0 = Math.min(0.14, (0.063 + 0.077 * (1 - age)) * (0.85 + 0.3 * rand()));
    const bl0 = Math.min(0.27, (0.17 + 0.085 * age) * (0.9 + 0.2 * rand()));
    const r = Array.from({ length: 12 }, rand);
    const make = ([turn, raise, shrink, roll]) => {
      const az = Math.min(Math.max(az0 + turn, 1.25 - 0.6 * (1 - age)), 4.3 + 0.4 * (1 - age)), pe = Math.min(pe0 + raise, 1.48), be = Math.min(be0 + 1.3 * raise, 1.4);
      const out = [Math.cos(az), 0, Math.sin(az)];
      // (The older outer leaves rise from low on the crown, the young ones from its top.)
      const foot = add(SMALL_CROWN, add(mul(out, 0.008 + 0.007 * age), [0, 0.006 + 0.022 * (1 - age), 0]));
      const top = add(foot, mul(add(mul(out, Math.cos(pe)), [0, Math.sin(pe), 0]), pl0 * Math.exp(-shrink)));
      const dir = norm(add(mul(out, Math.cos(be)), [0, Math.sin(be), 0]));
      const from = add(foot, add(mul(out, -0.008), [0, -0.012, 0]));
      return { az, from, rise: norm(add(UP, mul(out, 0.2 + 0.8 * age))), b: /** @type {BladeSpec} */ ({
        base: top, dir, face: rot(square(add(add(UP, mul(out, -0.15)), [0, 0, 0.3]), dir), dir, 0.5 * (r[0] - 0.5) + roll),
        length: bl0 * Math.exp(-shrink), ratio: 0.33 + 0.12 * age + 0.1 * r[1], arch: 0.35 + 0.4 * age + 0.15 * r[2], droop: 0.1 + 0.15 * r[3],
        side: 0.2 * (r[4] - 0.5), twist: 0.5 * (r[5] - 0.5), cup: 0.12 + 0.12 * r[6], fold: 0.05 + 0.05 * r[7],
        quilt: 0.0008, wave: 0.07 + 0.07 * r[8], waves: 2 + 2 * r[9], phase: 6.28 * r[10], asym: 0.1 * (r[11] - 0.5),
        furl: 0, veins: 9, id: k, small: true,
      }) };
    };
    const { leaf, shape } = fit(make, moves, { margin: 0.012, bounds: SMALL_BOUNDS, crowd, gap: 0.009, stalkGap: 0.007, samples, wide });
    const start = mb.vertexCount;
    bladeMesh(mb, shape, 24, 12, MAT.LEAF_SMALL);
    mark(mb, owners, start, k);
    bladePatches(shape, k, patches);
    const s0 = mb.vertexCount;
    const segs = Math.max(8, Math.round(len(sub(leaf.b.base, leaf.from)) / 0.008));
    const pts = leafStalk(mb, shape, leaf.from, leaf.rise, {
      rBase: 0.0026 + 0.0009 * age, rTop: 0.0021 + 0.0006 * age, sides: 8, segs, midrib: 0.5, midribSegs: 8, sheath: 0.3, sheathLen: 0.02,
      groove: 0.2,
    }, 11 + k);
    mark(mb, owners, s0, 1000 + k);
    tubePatches(pts.slice(0, segs + 1), 0.003, 1000 + k, patches);
    crowdIn(crowd, shape, pts, samples);
    tips.push({ tip: shape.at(0.85, 0), pts: bladeSamples(shape, 6, 2) });
  }
  obstacles.push({ a: SMALL_CROWN, b: add(SMALL_CROWN, [0, 0.07, 0]), r: 0.08, solid: 0.02 });
  // (The leaves in four clusters round it, by where their tips point.)
  const a = add(SMALL_CROWN, [0, 0.035, 0]);
  for (let s = 0; s < 4; s++) {
    const group = tips.filter((t) => Math.floor((Math.atan2(t.tip[2] - a[2], t.tip[0] - a[0]) + Math.PI) / (Math.PI / 2)) % 4 === s);
    if (!group.length) continue;
    const b = mix3(a, mul(group.reduce((sum, t) => add(sum, t.tip), [0, 0, 0]), 1 / group.length), 0.85);
    const d = group.flatMap((t) => t.pts.map((q) => segDist(q, a, b))).sort((x, y) => x - y);
    obstacles.push({ a, b, r: Math.min(Math.max(d[Math.floor(0.9 * (d.length - 1))], 0.03), 0.12), solid: 0 });
  }
  // (Its many small leaves crowd close: each shades less than the tall plant's.)
  occlude(mb, owners, patches, 0.12, 0.9);
  return { mesh: mb.finish(), obstacles };
}

/** @returns {import('./mesh.mjs').ScapePiece} */
export function build() {
  // (The tall plant's leaves draw from where its stream stood once its roots, which now have their
  // own, had drawn from it: stream(4111) 36 draws on, so the leaves keep their fitted places.)
  const tall = tallPlant(stream(1511863939), stream(4127));
  const small = smallPlant(stream(5227));
  return { meshes: [tall.mesh, small.mesh], obstacles: [...tall.obstacles, ...small.obstacles] };
}

// ---- materials --------------------------------------------------------------------------------

/** A leaf's material: o.length, a typical blade's (world units), sizes the veins in pixels; o.ratio
 *  its width over its length; o.veins, lateral veins a side; o.young, the first id of the young
 *  furled leaves (paler, yellower); o.tint, its green (sRGB, lit side); o.net and o.bump, how fine
 *  the veinlets' net and the cells' relief are (a world unit); o.rough; o.salt, its leaves' own
 *  random shades; o.small, a small plant's leaves (see outlineOf). */
const leafWGSL = (name, o) => /* wgsl */ `
fn scape_mat_${name}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let u = clamp(attrs.x, 0.0, 1.0);
  let v = clamp(attrs.y, -1.0, 1.0);
  let av = abs(v);
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, ${o.salt}, 11));
  let px = ${o.length.toFixed(3)} / max(foot, 1e-6);
  // The outline's half-width here (as the mesh's, outlineOf and outline), so the veins keep their
  // true widths.
  let fid = round(attrs.z);
  let h1 = fract(fid * 0.618034 + 0.17);
  let h2 = fract(fid * 0.754877 + 0.31);
  let h3 = fract(fid * 0.56984 + 0.53);
  let wd = 0.3 + 0.12 * h1;
  var hw = sqrt(max(1.0 - pow(max(wd - u, 0.0) / wd, 2.0 + h2), 0.0));
  if (u > wd) {
    let t = (u - wd) / (1.0 - wd);
    hw = pow(max(1.0 - pow(t, 1.45 + 0.5 * h3), 0.0), 1.05) * (1.0 - (${o.small ? '0.06 + 0.14 * h1' : '0.18 + 0.2 * h1'}) * smoothstep(0.62, 1.0, t));
  }
  // Across from the midrib in the blade's own length (its length 1).
  let x = av * hw * ${(o.ratio / 2).toFixed(3)};
  // The midrib: drawn no narrower than about a pixel, fainter by as much, so it stays on the midrib.
  let midW = 0.005 + 0.009 * (1.0 - u);
  let midPx = max(midW, 0.9 / px);
  let midrib = (midW / midPx) * (1.0 - smoothstep(0.45 * midPx, midPx, x));
  // Lateral veins, out from the midrib and forwards along the margin (where the mesh is quilted).
  let left = select(0.0, 1.0, v < 0.0);
  let ph = ${o.veins.toFixed(1)} * (u - ${VEIN_SLOPE} * pow(av, 1.2) * hw) + 0.5 * left + 0.2 * sin(9.0 * u + 2.3 * attrs.z + 1.7 * left) * min(2.0 * av, 1.0);
  let dv = abs(fract(ph + 0.5) - 0.5);
  var lateral = (1.0 - smoothstep(0.025, 0.08, dv)) * smoothstep(0.03, 0.14, av) * (1.0 - smoothstep(0.8, 0.97, av)) * smoothstep(0.02, 0.1, u);
  lateral = mix(0.08, lateral, smoothstep(1.0, 2.5, 0.1 * px / ${o.veins.toFixed(1)}));
  // The fine net of veinlets between them (its cells warped, so the areoles are irregular).
  let q = p * ${o.net.toFixed(1)};
  let cell = scape_cells3(q + 0.6 * vec3f(scape_noise3(q * 0.35), scape_noise3(q * 0.35 + vec3f(7.1)), scape_noise3(q * 0.35 + vec3f(13.7))));
  var net = 1.0 - smoothstep(0.015, 0.07, cell.y - cell.x);
  net = mix(0.15, net, smoothstep(8.0, 20.0, ${(1 / o.net).toFixed(4)} / max(foot, 1e-6)));
  let vein = max(0.85 * midrib, 0.38 * lateral);

  let lit = scape_linear(vec3f(${o.tint}));
  let deep = scape_linear(vec3f(0.16, 0.36, 0.05));
  let pale = scape_linear(vec3f(0.6, 0.8, 0.28));
  var c = lit * (0.85 + 0.3 * rnd.x);
  c = mix(c, c * vec3f(1.1, 1.0, 0.75), rnd.y * 0.5);
  // Darker towards the base and the margins; a living leaf's faint mottling.
  c = mix(c, deep, 0.3 * (1.0 - smoothstep(0.0, 0.3, u)));
  c = mix(c, deep, 0.2 * smoothstep(0.7, 1.0, av));
  c *= 0.9 + 0.2 * scape_fbm3(p * 35.0 + rnd * 10.0, 2);
  c = mix(c, pale, 0.7 * vein);
  c = mix(c, pale, 0.15 * net * (1.0 - vein));
  let young = id >= ${o.young};
  if (young) { c = mix(c, scape_linear(vec3f(0.58, 0.76, 0.2)), 0.55); }
  var rough = ${o.rough.toFixed(2)} + 0.06 * scape_noise3(p * 20.0);
  var spec = 0.04;
  if (!front) {
    // Beneath: paler, matte, its veins standing out.
    c = mix(c, scape_linear(vec3f(0.52, 0.7, 0.32)), 0.45);
    rough = 0.6;
    spec = 0.025;
  }
  // Light through the blade: bright yellow-green, less through the veins and the thicker base.
  var trans = scape_linear(vec3f(0.45, 0.65, 0.12)) * (1.0 - 0.55 * vein) * (0.55 + 0.45 * smoothstep(0.0, 0.25, u)) * (1.0 - 0.15 * net);
  if (young) { trans *= 1.25; }
  // Fine relief: the blade's cells, faded below a few pixels.
  let k = ${o.bump.toFixed(1)};
  let e = 0.35 / k;
  let b0 = scape_noise3(p * k);
  let g = vec3f(scape_noise3((p + vec3f(e, 0.0, 0.0)) * k) - b0, scape_noise3((p + vec3f(0.0, e, 0.0)) * k) - b0,
    scape_noise3((p + vec3f(0.0, 0.0, e)) * k) - b0) / (e * k);
  let relief = 0.04 * smoothstep(2.0, 6.0, 1.0 / (k * max(foot, 1e-6)));
  let nn = normalize(n - (g - n * dot(n, g)) * relief);
  let ao = attrs.w * (1.0 - select(0.0, 0.2 * midrib, front));
  return ScapeMat(c, nn, rough, spec, trans, ao);
}
`;

/** The tall plant's leaves, the small plant's (a touch brighter), the stalks (paler green, browner
 *  at their sheathing feet) and the rhizome, crown and roots (tan to olive brown). */
export const WGSL = [
  leafWGSL('leafBig', { salt: 3, length: 0.34, ratio: 0.46, veins: 13, young: 9, tint: '0.35, 0.62, 0.12', net: 280, bump: 110, rough: 0.36 }),
  leafWGSL('leafSmall', { salt: 5, length: 0.19, ratio: 0.44, veins: 9, young: 99, tint: '0.38, 0.66, 0.13', net: 420, bump: 180, rough: 0.4, small: true }),
  /* wgsl */ `
fn scape_mat_stem(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, 7, 3));
  var c = scape_linear(vec3f(0.5, 0.7, 0.27)) * (0.9 + 0.2 * rnd.y);
  // Its sheathing foot: browner, darker (a short way up the small plant's short stems, ids 11 on).
  c = mix(scape_linear(vec3f(0.36, 0.38, 0.17)), c, smoothstep(0.0, select(0.05, 0.015, id >= 11), s));
  // Fine ridges along it (faded below a few pixels), and faint flecks.
  var stria = 0.5 + 0.5 * sin(attrs.y * 9.0 + 3.0 * scape_noise3(p * 40.0));
  stria = mix(0.5, stria, smoothstep(1.0, 3.0, 0.004 / max(foot, 1e-6)));
  c *= (0.93 + 0.12 * stria) * (0.94 + 0.12 * scape_noise3(vec3f(s * 60.0, f32(id) * 3.1, 0.5)));
  let trans = scape_linear(vec3f(0.4, 0.6, 0.15)) * 0.4;
  return ScapeMat(c, n, 0.4, 0.035, trans, attrs.w);
}

fn scape_mat_root(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = attrs.z;
  var c = scape_linear(vec3f(0.55, 0.42, 0.26)) * (0.85 + 0.25 * scape_noise3(p * 90.0));
  if (id < 1.5) {
    // A crown: olive brown, ringed with the scars of old leaves.
    c = scape_linear(vec3f(0.38, 0.34, 0.18)) * (0.85 + 0.25 * scape_fbm3(p * 70.0, 3));
    var ring = smoothstep(0.8, 0.95, abs(fract(s / 0.016 + 0.3 * scape_noise3(p * 30.0)) * 2.0 - 1.0));
    ring = mix(0.2, ring, smoothstep(1.0, 3.0, 0.003 / max(foot, 1e-6)));
    c = mix(c, scape_linear(vec3f(0.2, 0.16, 0.08)), 0.6 * ring);
  }
  return ScapeMat(c, n, 0.7, 0.02, vec3f(0.0), attrs.w);
}
`,
].join('');
