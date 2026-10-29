// The driftwood arch on the betta bowl's sand: one heavy, old, gnarled piece whose left foot and
// right foot are sunk in the sand, rising in a lumpy, twisting arch to a crest right of centre and
// leaving an open gap under its middle; a broken-off limb points up and out from the crest's right
// end and a smaller limb at its left reaches down into the sand.
//
// Each limb is a tube swept along a smooth spine (centripetal Catmull-Rom, rotation-minimising
// frames) whose cross-section is lumpy, flattened and fluted and turns with the grain as it goes.
// The tube's columns follow the twisting grain, so the bark's relief (long fissures between plates,
// cross-cracks, knots with the grain swirling round them, worn smoother patches) is modelled in the
// geometry along them. The side limbs start inside the arch and are blended into it by a smooth
// fillet; the broken limb ends in jagged, splintered bare wood. Occlusion is baked from the
// relief's cavities, from the sand and from the other limbs. At a lower detail (phones) the tubes
// have fewer rings and columns along the same spines, the relief eased to what they can hold.

import { BED_LEVEL, MAT, MeshBuilder, fbm3, noise3, stream } from './mesh.mjs';

const TAU = Math.PI * 2;
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const wrapPi = (a) => a - TAU * Math.round(a / TAU);

/** An integer lattice point (and a seed) hashed to [0, 1). */
function hash3(x, y, s) {
  let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(s | 0, 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Cells on a strip that wraps round (u repeats every `period` cells): how far the point is from the
// border between its nearest two cells (cell units), that border's normal (cell space), a hash of
// the pair (the same from either side) and of the nearest cell.
const CELL = { e: 0, nu: 0, nv: 0, pair: 0, cell: 0 };
function cells(u, v, period, seed) {
  const iu = Math.floor(u), iv = Math.floor(v);
  let d1 = 1e9, d2 = 1e9, u1 = 0, v1 = 0, u2 = 0, v2 = 0, k1 = 0, k2 = 0, c1u = 0, c1v = 0;
  for (let dv = -1; dv <= 1; dv++) {
    for (let du = -1; du <= 1; du++) {
      const cu = iu + du, cv = iv + dv;
      const wu = ((cu % period) + period) % period;
      const fu = cu + 0.06 + 0.88 * hash3(wu, cv, seed);
      const fv = cv + 0.06 + 0.88 * hash3(wu, cv, seed + 1013);
      const x = fu - u, y = fv - v, d = x * x + y * y;
      const key = wu * 7919 + (cv + 4096) * 131;
      if (d < d1) {
        d2 = d1; u2 = u1; v2 = v1; k2 = k1;
        d1 = d; u1 = fu; v1 = fv; k1 = key; c1u = wu; c1v = cv;
      } else if (d < d2) {
        d2 = d; u2 = fu; v2 = fv; k2 = key;
      }
    }
  }
  let nu = u2 - u1, nv = v2 - v1;
  const l = Math.hypot(nu, nv) || 1;
  nu /= l;
  nv /= l;
  CELL.e = ((u1 + u2) * 0.5 - u) * nu + ((v1 + v2) * 0.5 - v) * nv;
  CELL.nu = nu;
  CELL.nv = nv;
  CELL.pair = hash3(Math.min(k1, k2), Math.max(k1, k2), seed + 77);
  CELL.cell = hash3(c1u, c1v, seed + 5);
}

// The fissures between cells on a strip that wraps round (u repeats every `period` cells; a cell is
// wu wide and lv long in world units). Every border near the point cuts its own fissure (its depth
// and width its own, those across the grain shallower and narrower, by crossWidth wider) and the
// deepest is kept, so the relief is continuous; also how far the point is from the nearest border
// (world) and a hash of its cell.
const FIS = { depth: 0, shoulder: 0, e: 0, cell: 0 };
const FU = new Float64Array(25), FV = new Float64Array(25), FK = new Int32Array(25);
function fissures(u, v, period, seed, wu, lv, width, crossDepth, crossWidth = 1) {
  const iu = Math.floor(u), iv = Math.floor(v);
  let best = 1e9, n1 = 12;
  for (let dv = -2, k = 0; dv <= 2; dv++) {
    for (let du = -2; du <= 2; du++, k++) {
      const cu = iu + du, cv = iv + dv;
      const wrapped = ((cu % period) + period) % period;
      const h = hash3(wrapped, cv, seed);
      const h2 = (h * 65536) % 1;
      FU[k] = cu + 0.06 + 0.88 * h;
      FV[k] = cv + 0.06 + 0.88 * h2;
      FK[k] = wrapped * 7919 + (cv + 4096) * 131;
      if (Math.abs(du) < 2 && Math.abs(dv) < 2) {
        const x = FU[k] - u, y = FV[k] - v, d = x * x + y * y;
        if (d < best) [best, n1] = [d, k];
      }
    }
  }
  const u1 = FU[n1], v1 = FV[n1], k1 = FK[n1];
  let depth = 0, shoulder = 0, emin = 1e9;
  for (let k = 0; k < 25; k++) {
    if (k === n1) continue;
    let nu = FU[k] - u1, nv = FV[k] - v1;
    const l = Math.sqrt(nu * nu + nv * nv);
    nu /= l;
    nv /= l;
    const ec = ((u1 + FU[k]) * 0.5 - u) * nu + ((v1 + FV[k]) * 0.5 - v) * nv;
    const mx = nu / wu, my = nv / lv;
    const ml = Math.sqrt(mx * mx + my * my);
    const e = ec / ml;
    if (e < emin) emin = e;
    if (e > width * 3.6 * crossWidth) continue;
    const pair = hash3(Math.min(k1, FK[k]), Math.max(k1, FK[k]), seed + 77);
    const across = smoothstep(0.35, 0.8, Math.abs(my) / ml);
    const strength = (0.5 + 0.7 * pair) * (1 - (1 - crossDepth) * across);
    const w = width * (0.7 + 0.6 * ((pair * 977) % 1)) * (1 - 0.15 * across) * (1 + (crossWidth - 1) * across);
    const p = e / w;
    if (p < 1) depth = Math.max(depth, strength * Math.pow(1 - smoothstep(0, 1, p), 1.6));
    shoulder = Math.max(shoulder, strength * (1 - smoothstep(w, w * 3.2, e)));
  }
  FIS.depth = depth;
  FIS.shoulder = shoulder;
  FIS.e = emin;
  FIS.cell = hash3(k1, 5, seed + 5);
  return FIS;
}

// ---- the spines --------------------------------------------------------------------------------

/** A centripetal Catmull-Rom curve through `pts`, resampled every ~ds of its length: centres,
 *  unit tangents and rotation-minimising frames (r, b: t = r x b), and the grain's twist (tau: how
 *  far the grain has turned round the spine, radians). */
function makeSpine(pts, ds, twist, seed, wiggle) {
  const n = pts.length;
  const mirror = (a, b) => [2 * b[0] - a[0], 2 * b[1] - a[1], 2 * b[2] - a[2]];
  const ext = [mirror(pts[1], pts[0]), ...pts, mirror(pts[n - 2], pts[n - 1])];
  const dense = [];
  const knot = (a, b) => Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])) || 1e-6;
  for (let k = 0; k < n - 1; k++) {
    const [p0, p1, p2, p3] = [ext[k], ext[k + 1], ext[k + 2], ext[k + 3]];
    const t1 = knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3);
    for (let m = 0; m < 64; m++) {
      const t = t1 + ((t2 - t1) * m) / 64;
      const pt = [0, 0, 0];
      for (let c = 0; c < 3; c++) {
        const a1 = ((t1 - t) / t1) * p0[c] + (t / t1) * p1[c];
        const a2 = ((t2 - t) / (t2 - t1)) * p1[c] + ((t - t1) / (t2 - t1)) * p2[c];
        const a3 = ((t3 - t) / (t3 - t2)) * p2[c] + ((t - t2) / (t3 - t2)) * p3[c];
        const b1 = ((t2 - t) / t2) * a1 + (t / t2) * a2;
        const b2 = ((t3 - t) / (t3 - t1)) * a2 + ((t - t1) / (t3 - t1)) * a3;
        pt[c] = ((t2 - t) / (t2 - t1)) * b1 + ((t - t1) / (t2 - t1)) * b2;
      }
      dense.push(pt);
    }
  }
  dense.push(pts[n - 1]);
  const acc = [0];
  const measure = () => {
    for (let k = 1; k < dense.length; k++) {
      const [a, b] = [dense[k - 1], dense[k]];
      acc[k] = acc[k - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    }
  };
  measure();
  // Gentle bends between the control points (a few tenths of a unit long; none at the ends, which
  // stay where they are put).
  const L0 = acc[dense.length - 1];
  for (let k = 0; k < dense.length; k++) {
    const w = wiggle * smoothstep(0, 0.12, acc[k]) * smoothstep(L0, L0 - 0.12, acc[k]);
    for (let c = 0; c < 3; c++) dense[k][c] += w * noise3(acc[k] * 2.7, seed * 0.53, c * 3.7);
  }
  measure();
  const L = acc[acc.length - 1];
  const count = Math.max(3, Math.round(L / ds) + 1);
  const step = L / (count - 1);
  const c = new Float64Array(count * 3), t = new Float64Array(count * 3);
  const r = new Float64Array(count * 3), b = new Float64Array(count * 3);
  const tau = new Float64Array(count);
  let seg = 0;
  for (let i = 0; i < count; i++) {
    const s = i * step;
    while (seg < dense.length - 2 && acc[seg + 1] < s) seg++;
    const f = (s - acc[seg]) / (acc[seg + 1] - acc[seg] || 1);
    for (let k = 0; k < 3; k++) c[i * 3 + k] = dense[seg][k] + (dense[seg + 1][k] - dense[seg][k]) * f;
  }
  for (let i = 0; i < count; i++) {
    const i0 = Math.max(0, i - 1), i1 = Math.min(count - 1, i + 1);
    const d = [c[i1 * 3] - c[i0 * 3], c[i1 * 3 + 1] - c[i0 * 3 + 1], c[i1 * 3 + 2] - c[i0 * 3 + 2]];
    const l = Math.hypot(d[0], d[1], d[2]);
    for (let k = 0; k < 3; k++) t[i * 3 + k] = d[k] / l;
  }
  // The first frame: r as level as the tangent allows; then double reflection (Wang et al.).
  {
    const a = Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const d = a[0] * t[0] + a[1] * t[1] + a[2] * t[2];
    const v = [a[0] - d * t[0], a[1] - d * t[1], a[2] - d * t[2]];
    const l = Math.hypot(v[0], v[1], v[2]);
    for (let k = 0; k < 3; k++) r[k] = v[k] / l;
  }
  for (let i = 0; i < count - 1; i++) {
    const v1 = [c[i * 3 + 3] - c[i * 3], c[i * 3 + 4] - c[i * 3 + 1], c[i * 3 + 5] - c[i * 3 + 2]];
    const c1 = v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2];
    const ri = [r[i * 3], r[i * 3 + 1], r[i * 3 + 2]], ti = [t[i * 3], t[i * 3 + 1], t[i * 3 + 2]];
    const dr = (2 / c1) * (v1[0] * ri[0] + v1[1] * ri[1] + v1[2] * ri[2]);
    const dt = (2 / c1) * (v1[0] * ti[0] + v1[1] * ti[1] + v1[2] * ti[2]);
    const rL = [ri[0] - dr * v1[0], ri[1] - dr * v1[1], ri[2] - dr * v1[2]];
    const tL = [ti[0] - dt * v1[0], ti[1] - dt * v1[1], ti[2] - dt * v1[2]];
    const v2 = [t[i * 3 + 3] - tL[0], t[i * 3 + 4] - tL[1], t[i * 3 + 5] - tL[2]];
    const c2 = v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2] || 1e-12;
    const d2 = (2 / c2) * (v2[0] * rL[0] + v2[1] * rL[1] + v2[2] * rL[2]);
    for (let k = 0; k < 3; k++) r[i * 3 + 3 + k] = rL[k] - d2 * v2[k];
  }
  for (let i = 0; i < count; i++) {
    const [tx, ty, tz] = [t[i * 3], t[i * 3 + 1], t[i * 3 + 2]];
    const [rx, ry, rz] = [r[i * 3], r[i * 3 + 1], r[i * 3 + 2]];
    b[i * 3] = ty * rz - tz * ry;
    b[i * 3 + 1] = tz * rx - tx * rz;
    b[i * 3 + 2] = tx * ry - ty * rx;
  }
  const rand = stream(seed);
  tau[0] = rand() * TAU;
  for (let i = 1; i < count; i++) tau[i] = tau[i - 1] + step * twist * (1 + 0.7 * noise3(i * step * 1.7, seed * 0.37, 0.3));
  return { count, step, L, c, t, r, b, tau };
}

/** The spine at s (interpolated, carried on straight past its ends). */
const AT = { cx: 0, cy: 0, cz: 0, rx: 0, ry: 0, rz: 0, bx: 0, by: 0, bz: 0, tx: 0, ty: 0, tz: 0, tau: 0 };
function spineAt(sp, s) {
  let f = s / sp.step;
  let i = Math.floor(f);
  if (i < 0) i = 0;
  if (i > sp.count - 2) i = sp.count - 2;
  f -= i;
  const j = i + 1, g = 1 - f;
  AT.cx = sp.c[i * 3] * g + sp.c[j * 3] * f;
  AT.cy = sp.c[i * 3 + 1] * g + sp.c[j * 3 + 1] * f;
  AT.cz = sp.c[i * 3 + 2] * g + sp.c[j * 3 + 2] * f;
  AT.rx = sp.r[i * 3] * g + sp.r[j * 3] * f;
  AT.ry = sp.r[i * 3 + 1] * g + sp.r[j * 3 + 1] * f;
  AT.rz = sp.r[i * 3 + 2] * g + sp.r[j * 3 + 2] * f;
  AT.bx = sp.b[i * 3] * g + sp.b[j * 3] * f;
  AT.by = sp.b[i * 3 + 1] * g + sp.b[j * 3 + 1] * f;
  AT.bz = sp.b[i * 3 + 2] * g + sp.b[j * 3 + 2] * f;
  AT.tx = sp.t[i * 3] * g + sp.t[j * 3] * f;
  AT.ty = sp.t[i * 3 + 1] * g + sp.t[j * 3 + 1] * f;
  AT.tz = sp.t[i * 3 + 2] * g + sp.t[j * 3 + 2] * f;
  AT.tau = sp.tau[i] * g + sp.tau[j] * f;
  return AT;
}

/** The spine resampled every ~ds of its length, along the same curve (for a coarser tube). */
function resampleSpine(sp, ds) {
  const count = Math.max(3, Math.round(sp.L / ds) + 1);
  const step = sp.L / (count - 1);
  const c = new Float64Array(count * 3), t = new Float64Array(count * 3);
  const r = new Float64Array(count * 3), b = new Float64Array(count * 3);
  const tau = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const a = spineAt(sp, i * step);
    const tl = Math.hypot(a.tx, a.ty, a.tz);
    const tx = a.tx / tl, ty = a.ty / tl, tz = a.tz / tl;
    // (The frame made square again.)
    const d = a.rx * tx + a.ry * ty + a.rz * tz;
    let rx = a.rx - d * tx, ry = a.ry - d * ty, rz = a.rz - d * tz;
    const rl = Math.hypot(rx, ry, rz);
    rx /= rl;
    ry /= rl;
    rz /= rl;
    c.set([a.cx, a.cy, a.cz], i * 3);
    t.set([tx, ty, tz], i * 3);
    r.set([rx, ry, rz], i * 3);
    b.set([ty * rz - tz * ry, tz * rx - tx * rz, tx * ry - ty * rx], i * 3);
    tau[i] = a.tau;
  }
  return { count, step, L: sp.L, c, t, r, b, tau };
}

/** A tube's rings along limb L's spine sp, N columns round: how many, and how far along the spine
 *  ring i lies in column j (the broken limb's last few rings stretch, column by column, to the
 *  jagged rim of its break). */
function tubeRings(L, sp, N) {
  if (L.caps[1] !== 'broken') return { rings: sp.count, sOf: (i) => i * sp.step };
  const sb = L.sBreak, sb0 = sb - 0.025;
  const i0 = Math.floor(sb0 / sp.step);
  const last = Math.round(sb / sp.step);
  const sOf = (i, j) => {
    if (i <= i0) return i * sp.step;
    const f = (i - i0) / (last - i0);
    const s0 = i0 * sp.step;
    return s0 + f * (sb + L.brk.rim((TAU * j) / N) - s0);
  };
  return { rings: last + 1, sOf };
}

/** The spine's height at s. */
function spineY(sp, s) {
  const f = Math.min(Math.max(s / sp.step, 0), sp.count - 1.001);
  const i = Math.floor(f);
  return sp.c[i * 3 + 1] + (sp.c[i * 3 + 4] - sp.c[i * 3 + 1]) * (f - i);
}

/** Where along the spine it comes nearest p. */
function nearestS(sp, p) {
  let best = 1e9, bi = 0;
  for (let i = 0; i < sp.count; i++) {
    const d = (sp.c[i * 3] - p[0]) ** 2 + (sp.c[i * 3 + 1] - p[1]) ** 2 + (sp.c[i * 3 + 2] - p[2]) ** 2;
    if (d < best) [best, bi] = [d, i];
  }
  return bi * sp.step;
}

// ---- the limbs ---------------------------------------------------------------------------------

/**
 * pts: the spine's control points (a side limb's first lies on its parent's spine, inside it);
 * radius: [fraction of the length, radius] pairs; around: columns round it; ds: ring spacing;
 * twist: how fast the grain turns (radians a unit of length); flat, lobe, flute, gnarl: how far
 * the cross-section is flattened, lobed, channelled and the surface knobbled; plates: cells round
 * the bark (each a plate between fissures) and their length; depth and width: how deep a fissure
 * cuts (a fraction of the radius) and how far it reaches either side of its line (world units, at
 * most; cracks across the grain less); knuckles: swellings along it
 * [point near the spine, how much, how far along]; knots: [point near the surface, eye radius, the
 * swelling's spread, its height, 'pit', 'boss' (a sheared twig) or 'burl' (a swelling, no eye)];
 * fillet and reach: how broadly a side limb is blended into its parent, and how far along it.
 */
const LIMBS = [
  {
    name: 'arch',
    pts: [
      [-0.522, -0.7, -0.04],
      [-0.514, -0.632, -0.048],
      [-0.486, -0.528, -0.058],
      [-0.425, -0.443, -0.07],
      [-0.318, -0.386, -0.05],
      [-0.178, -0.344, -0.122],
      [-0.038, -0.296, -0.146],
      [0.083, -0.268, -0.16],
      [0.198, -0.277, -0.162],
      [0.307, -0.331, -0.19],
      [0.398, -0.414, -0.148],
      [0.462, -0.522, -0.141],
      [0.494, -0.633, -0.136],
      [0.501, -0.7, -0.134],
    ],
    radius: [[0, 0.092], [0.07, 0.094], [0.18, 0.08], [0.3, 0.064], [0.42, 0.07], [0.56, 0.084], [0.64, 0.088], [0.74, 0.07], [0.85, 0.08], [0.93, 0.096], [1, 0.094]],
    around: 176,
    ds: 0.0039,
    wiggle: 0.022,
    twist: 1.7,
    flat: 0.28,
    lobe: 0.11,
    flute: 0.26,
    gnarl: 0.26,
    plates: 17,
    plateLength: 0.26,
    depth: 0.19,
    width: 0.0055,
    knuckles: [[[-0.36, -0.396, -0.085], 0.16, 0.08], [[0.33, -0.342, -0.15], 0.18, 0.09], [[-0.08, -0.316, -0.14], 0.1, 0.06], [[0.05, -0.286, -0.15], -0.08, 0.05]],
    knots: [
      [[-0.27, -0.333, -0.03], 0.014, 0.04, 0.02, 'pit'],
      [[0.0, -0.222, -0.12], 0.011, 0.032, 0.014, 'boss'],
      [[0.33, -0.316, -0.08], 0.0, 0.06, 0.03, 'burl'],
      [[0.45, -0.466, -0.06], 0.01, 0.03, 0.012, 'boss'],
      [[-0.47, -0.501, 0.03], 0.012, 0.035, 0.016, 'pit'],
      [[0.12, -0.299, -0.24], 0.012, 0.04, 0.016, 'pit'],
      [[-0.12, -0.29, -0.1], 0.0, 0.06, 0.02, 'burl'],
      [[-0.36, -0.366, -0.05], 0.0, 0.055, 0.026, 'burl'],
      [[0.0, -0.325, -0.07], 0.0, 0.05, 0.022, 'burl'],
      [[0.43, -0.389, -0.12], 0.0, 0.06, 0.028, 'burl'],
      [[0.27, -0.29, -0.22], 0.0, 0.045, 0.02, 'burl'],
    ],
    seed: 11,
    caps: ['buried', 'buried'],
  },
  {
    name: 'broken',
    parent: 0,
    pts: [
      [0.115, -0.268, -0.163],
      [0.143, -0.2, -0.232],
      [0.183, -0.12, -0.268],
      [0.232, -0.042, -0.284],
      [0.27, 0.015, -0.293],
    ],
    radius: [[0, 0.058], [0.3, 0.052], [0.7, 0.045], [1, 0.04]],
    around: 144,
    ds: 0.0035,
    wiggle: 0.006,
    twist: 2.6,
    flat: 0.16,
    lobe: 0.08,
    flute: 0.2,
    gnarl: 0.17,
    plates: 12,
    plateLength: 0.2,
    depth: 0.19,
    width: 0.00495,
    knuckles: [],
    knots: [[[0.232, -0.11, -0.262], 0.009, 0.026, 0.01, 'boss']],
    fillet: 0.06,
    reach: [0.12, 0.2],
    seed: 23,
    caps: ['inside', 'broken'],
    breakAt: 0.04,
  },
  {
    name: 'left',
    parent: 0,
    pts: [
      [-0.31, -0.385, -0.05],
      [-0.305, -0.457, -0.02],
      [-0.288, -0.54, 0.055],
      [-0.298, -0.63, 0.11],
      [-0.292, -0.7, 0.13],
    ],
    radius: [[0, 0.056], [0.35, 0.049], [0.75, 0.042], [1, 0.04]],
    around: 144,
    ds: 0.0037,
    wiggle: 0.012,
    twist: -2.1,
    flat: 0.22,
    lobe: 0.09,
    flute: 0.22,
    gnarl: 0.2,
    plates: 12,
    plateLength: 0.22,
    depth: 0.19,
    width: 0.00495,
    knuckles: [[[-0.29, -0.56, 0.07], 0.1, 0.05]],
    knots: [[[-0.34, -0.501, 0.1], 0.01, 0.03, 0.012, 'pit']],
    fillet: 0.07,
    reach: [0.12, 0.22],
    seed: 37,
    caps: ['inside', 'buried'],
  },
];

/** The limbs as laid out for one build (or for the shader): each LIMBS entry copied (the table
 *  itself is never changed) with its spine, where a side limb joins its parent (junction: how far
 *  along the parent), its knuckles and knots placed along it and its channels. detail scales the
 *  tube's rings and columns (1: as LIMBS has them); everything is placed on the spine drawn as at
 *  full detail (ref), so it lands in the same places at any detail. */
function layout(detail = 1) {
  const limbs = [];
  for (const [index, C] of LIMBS.entries()) {
    const L = { ...C, index, pts: C.pts.map((p) => p.slice()) };
    if (L.parent !== undefined) {
      // (A side limb's spine starts on its parent's, and it is thinner there, inside the parent,
      // so it does not show through its far side.)
      const P = limbs[L.parent].ref;
      const s = nearestS(P, L.pts[0]);
      const a = spineAt(P, s);
      L.pts[0] = [a.cx, a.cy, a.cz];
      L.junction = s;
      L.shrink = (s) => 0.6 + 0.4 * smoothstep(0, 0.0525, s);
    }
    const sp = (L.ref = makeSpine(L.pts, L.ds, L.twist, L.seed, L.wiggle));
    // (At a lower detail fewer columns go round and the rings lie further apart, the rings more so:
    // the bark's fissures run along the grain, so they need the columns more. coarse, coarseAlong:
    // how much further apart than at full detail, round and along.)
    L.roundScale = detail ** 0.75;
    L.alongScale = detail ** 1.25;
    L.coarse = Math.max(1, 1 / L.roundScale);
    L.coarseAlong = Math.max(1, 1 / L.alongScale);
    L.refAround = C.around;
    L.around = detail === 1 ? C.around : Math.max(16, Math.round(C.around * L.roundScale));
    L.spine = detail === 1 ? sp : resampleSpine(sp, C.ds / L.alongScale);
    if (L.caps[1] === 'broken') {
      L.brk = breakShape(L.seed + 5);
      L.sBreak = sp.L - L.breakAt;
    }
    L.knuckleS = L.knuckles.map(([p, amp, w]) => [nearestS(sp, p), amp, w]);
    L.knotS = L.knots.map(([p, eye, spread, height, kind], k) => {
      const s = nearestS(sp, p);
      const a = spineAt(sp, s);
      const q = [p[0] - a.cx, p[1] - a.cy, p[2] - a.cz];
      const th = Math.atan2(q[0] * a.bx + q[1] * a.by + q[2] * a.bz, q[0] * a.rx + q[1] * a.ry + q[2] * a.rz);
      return { s, phi: ((th - a.tau) % TAU + TAU) % TAU, eye, spread, height, kind, brk: kind === 'boss' ? breakShape(L.seed * 31 + k) : null };
    });
    const rand = stream(L.seed + 101);
    L.flutes = Array.from({ length: 5 }, (_, k) => ({
      phi: (k / 5) * TAU + rand() * 1.0,
      drift: (rand() - 0.5) * 1.5,
      width: 0.22 + 0.3 * rand(),
      depth: L.flute * (0.5 + 0.8 * rand()),
      freq: 1.5 + 2 * rand(),
      seed: L.seed + k * 7.7,
    }));
    limbs.push(L);
  }
  return limbs;
}

/** A limb's radius at s: its profile, swollen at its knuckles and a little lumpy along. */
const RADIUS = { L: null, s: NaN, r: 0 };
function baseRadius(L, sp, s) {
  if (RADIUS.L === L && RADIUS.s === s) return RADIUS.r;
  const u = s / sp.L;
  const R = L.radius;
  let r = R[R.length - 1][1];
  for (let k = 0; k < R.length - 1; k++) {
    if (u <= R[k + 1][0]) {
      r = R[k][1] + (R[k + 1][1] - R[k][1]) * smoothstep(R[k][0], R[k + 1][0], u);
      break;
    }
  }
  r *= 1 + 0.2 * fbm3(s * 4 + L.seed, 0.31, 0.77, 2);
  for (const [sk, amp, w] of L.knuckleS) r *= 1 + amp * Math.exp(-(((s - sk) / w) ** 2));
  Object.assign(RADIUS, { L, s, r });
  return r;
}

/** The cross-section's shape at s (grain angle phi): flattened, lobed, with a few channels winding
 *  along it (a factor on the radius). */
const RING = { L: null, s: NaN, e: 0, al: 0, a3: 0, b3: 0, a4: 0, b4: 0, a5: 0, b5: 0, foot: 1, fc: [0], fd: [0] };
function crossSection(L, s, phi) {
  if (RING.s !== s || RING.L !== L) {
    const q = L.seed * 1.37;
    RING.s = s;
    RING.L = L;
    RING.e = L.flat * (0.55 + 0.45 * noise3(s * 2.3, q, 0.5));
    RING.al = L.seed + 1.4 * noise3(s * 1.2, q + 3.1, 1.7);
    RING.a3 = L.lobe * (0.6 + 0.6 * noise3(s * 3.1, q, 4.4));
    RING.b3 = 2.2 * noise3(s * 1.6, q, 5.5);
    RING.a4 = L.lobe * 0.7 * (0.5 + 0.7 * noise3(s * 3.7, q, 6.6));
    RING.b4 = 2.2 * noise3(s * 1.9, q, 7.7);
    RING.a5 = L.lobe * 0.5 * (0.4 + 0.8 * noise3(s * 4.3, q, 8.8));
    RING.b5 = 2.2 * noise3(s * 2.2, q, 9.9);
    // (Lobed like roots where it goes into the sand; measured on the spine as drawn at full detail,
    // so the shape is the same at any detail.)
    RING.foot = 1 + 0.9 * Math.exp(-(((spineY(L.ref, s) - BED_LEVEL) / 0.07) ** 2));
    RING.fc = L.flutes.map((f) => f.phi + f.drift * s + 0.5 * noise3(s * 2.6, f.seed, 0.2));
    RING.fd = L.flutes.map((f) => f.depth * smoothstep(-0.25, 0.35, noise3(s * f.freq, f.seed, 3.3)));
  }
  let m = 1 + RING.e * Math.cos(2 * (phi - RING.al));
  m += (RING.a3 * Math.cos(3 * phi + RING.b3) + RING.a4 * Math.cos(4 * phi + RING.b4) + RING.a5 * Math.cos(5 * phi + RING.b5)) * RING.foot;
  for (let k = 0; k < L.flutes.length; k++) {
    const d = wrapPi(phi - RING.fc[k]);
    m -= RING.fd[k] * Math.exp(-((d / L.flutes[k].width) ** 2));
  }
  // (Never thinner than 0.6 of the radius, rounding into that floor rather than creasing.)
  const h = Math.max(0.16 - Math.abs(m - 0.6), 0) / 0.16;
  return Math.max(m, 0.6) + h * h * 0.04;
}

/** The bark's relief at s, grain angle phi (column j of the limb's around), on a limb of radius r0
 *  whose lumpy surface lies rl out from the spine there: how deep the point lies below the bark's
 *  crests (world units; negative where it stands proud, on a burl or a knot's lip) and how deep in
 *  a fissure (0..1). The plates and fissures scale with rl, so in the hollows, where the columns
 *  crowd, they are narrower and shallower, never steeper. On a coarser grid (L.coarse and
 *  L.coarseAlong) the fissures and the knots' lips are wider, the checks within the plates fewer,
 *  the ridges between them broader and the roughness fainter, so the grid holds what is left
 *  without aliasing it (and the bark's shading keeps its tone). */
const BARK = { d: 0, z: 0 };
function bark(L, s, phi, cphi, sphi, r0, rl) {
  const Nc = L.plates, Lc = L.plateLength;
  const wide = Math.sqrt(L.coarse), wideAlong = Math.sqrt(L.coarseAlong), fine = clamp01(2 - L.coarse);
  const width = L.width * wide, crossWidth = wideAlong / wide;
  const rs = Math.min(Math.max(rl, 0.6 * r0), 1.3 * r0);
  const Wu = (TAU * rs) / Nc; // a plate's width round the limb (world)
  const q = L.seed * 0.71;
  // The plates' grid wanders round and along (so the fissures meander), and swirls round knots.
  let u = (phi / TAU) * Nc + 0.55 * noise3(cphi * 1.1 + q, sphi * 1.1, s * 1.5) + 0.2 * noise3(cphi * 2.7, sphi * 2.7 + q, s * 5.3);
  let v = s / Lc + 0.4 * noise3(cphi * 1.3 + 9.1, sphi * 1.3, s * 1.9 + q);
  let raise = 0, eye = 0;
  for (const k of L.knotS) {
    // (Burls are drawn out a little along the grain, knots' eyes about twice as far.)
    const dv = (s - k.s) / (k.kind === 'burl' ? 1.4 : 2.6);
    if (Math.abs(dv) > 5 * k.spread) continue;
    const du = wrapPi(phi - k.phi) * r0;
    const rho2 = du * du + dv * dv;
    let rho = Math.sqrt(rho2);
    if (rho > 5 * k.spread) continue;
    const burl = k.height * Math.exp(-((rho / k.spread) ** 2)) * (1 + 0.2 * noise3(du * 55, dv * 55, k.s * 9));
    if (k.kind === 'burl') {
      // (A swelling with no eye: the grain bulges over it.)
      raise += burl;
      u += (0.25 * du * Math.exp(-((rho / k.spread) ** 2))) / Wu;
      continue;
    }
    // The grain flows round the knot like a stream round a post (the stream function of a
    // potential flow past a cylinder), the effect fading away from it.
    const a2 = (k.eye * 1.6) ** 2;
    const w = Math.exp(-((rho / (2.6 * k.spread)) ** 2));
    const psi = rho2 > a2 ? du * (1 - a2 / rho2) : 0;
    u += ((psi - du) * w) / Wu;
    // (The eye's outline is irregular.)
    const ang = Math.atan2(dv, du);
    rho *= 1 + 0.3 * noise3(Math.cos(ang) * 2, Math.sin(ang) * 2, k.s * 5);
    eye = Math.max(eye, 1 - smoothstep(k.eye * 0.9, k.eye * 1.7, rho));
    const lip = 0.45 * k.height * Math.exp(-(((rho - k.eye) / (0.35 * k.eye * wide)) ** 2));
    // A shallow pit where a twig rotted out, or the stub of one sheared off: tapering to 0.7 of
    // its foot's radius, its top torn like the broken limb's end (at the knot's scale).
    let core;
    if (k.kind === 'pit') core = -0.45 * k.height * (1 - smoothstep(0, k.eye * 0.8, rho));
    else {
      const side = smoothstep(0, 1, (k.eye - rho) / (0.3 * k.eye));
      const top = 0.8 * k.height + k.brk.height(Math.min(rho / (0.7 * k.eye), 1), ang) * (k.eye / 0.05);
      core = side * top;
    }
    raise += burl + lip + core;
  }

  // Worn patches, where the water has smoothed the bark.
  const worn = smoothstep(0.36, 0.66, noise3(cphi * 0.8 + q, sphi * 0.8 + 2.2, s * 2.2 + 4.1));
  const Dn = L.depth * rs; // a deep fissure's depth here

  // The plates and the fissures between them: the borders running along the grain are the long
  // fissures, those across it shallower, narrower cross-cracks; the plates' edges round off into
  // them and the plates stand at different heights (meeting at the fissures, so there is no step
  // where one dies out).
  const fade = 0.6 + 0.4 * noise3(cphi * 2.1, sphi * 2.1 + q, s * 7.3);
  fissures(u, v, Nc, L.seed, Wu, Lc, width, 0.2, crossWidth);
  let fissure = fade * FIS.depth;
  const shoulder = 0.25 * fade * FIS.shoulder;
  const plateDrop = (0.26 * FIS.cell + 0.1 * noise3(u * 1.7, v * 2.3, q)) * smoothstep(0, width * 3, FIS.e);

  // Finer checks within the plates, here and there (fewer on a coarser grid).
  const mask2 = smoothstep(-0.35, 0.2, noise3(cphi * 1.6 + 5, sphi * 1.6, s * 3.1 + q));
  if (mask2 > 0) {
    const ku = 2.27 / wide, kv = 1.9 / wideAlong;
    fissures(u * ku + 0.5, v * kv + 0.3, Math.round(Nc * ku), L.seed + 3, Wu / ku, Lc / kv, width * 0.8, 0.25, crossWidth);
    fissure = Math.max(fissure, 0.55 * mask2 * FIS.depth);
  }

  // Stringy ridges along the grain on the plates (narrow grooves between them; broader on a coarser
  // grid), and a little roughness.
  const rp = u * 1.7 + 0.35 * noise3(cphi * 3.1, sphi * 3.1 + q, s * 6.1);
  const ridge = 0.2 * Math.pow(0.5 + 0.5 * Math.cos(TAU * rp), 3 / L.coarse) * fade;
  const rough = fine > 0 ? 0.1 * noise3(cphi * 16 + q, sphi * 16, s * 22) * fine : 0;

  const keep = (1 - 0.5 * worn) * (1 - eye);
  const depth01 = (fissure + (shoulder + plateDrop + ridge + rough) * (1 - 0.6 * worn)) * keep;
  // (On a coarser grid the wider fissures, shoulders and ridges cover more of the bark, so their
  // shading is drawn in towards the fissures' floors, by as much as keeps the bark's tone, its dark
  // fissures and pale crests, as at full detail: measured.)
  const z = clamp01(depth01 / (0.85 * L.coarse ** 0.075));
  BARK.z = L.coarse > 1 ? z ** (L.coarse ** 0.13) : z;
  BARK.d = depth01 * Dn - raise;
  return BARK;
}

// ---- building ----------------------------------------------------------------------------------

/** The base surface (lumpy cross-section, no bark) of limb L at s, grain angle phi: its centre,
 *  outward direction and radius, into BASE. */
const BASE = { cx: 0, cy: 0, cz: 0, dx: 0, dy: 0, dz: 0, r0: 0, rb: 0 };
function basePoint(L, sp, s, phi) {
  const a = spineAt(sp, s);
  const th = phi + a.tau;
  const ct = Math.cos(th), st = Math.sin(th);
  let dx = ct * a.rx + st * a.bx, dy = ct * a.ry + st * a.by, dz = ct * a.rz + st * a.bz;
  const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
  dx /= dl;
  dy /= dl;
  dz /= dl;
  let r0 = baseRadius(L, sp, s);
  if (L.shrink) r0 *= L.shrink(s);
  let rb = r0 * crossSection(L, s, phi);
  // Broad knobbles, and cords swelling along the grain.
  const ox = a.cx + dx * rb, oy = a.cy + dy * rb, oz = a.cz + dz * rb;
  rb *= 1 + L.gnarl * (0.6 * fbm3(ox * 3.4 + 1.7, oy * 3.4, oz * 3.4, 2) + 0.45 * noise3(Math.cos(phi) * 1.3 + L.seed, Math.sin(phi) * 1.3, s * 6.5));
  BASE.cx = a.cx;
  BASE.cy = a.cy;
  BASE.cz = a.cz;
  BASE.dx = dx;
  BASE.dy = dy;
  BASE.dz = dz;
  BASE.r0 = r0;
  BASE.rb = rb;
  return BASE;
}

/** A tube's grid: rings x columns of points, ring i at s = sOf(i, j). Also its base surface with
 *  ring i at i spine steps along (b0, for measuring distances to it) and as swept (bs), and the
 *  bark's surface as swept (r0). */
function sweep(L, sp, sOf) {
  const N = L.around, rings = L.rings;
  const n = rings * N;
  const g = {
    L, sp, N, rings,
    px: new Float64Array(n), py: new Float64Array(n), pz: new Float64Array(n),
    dx: new Float64Array(n), dy: new Float64Array(n), dz: new Float64Array(n),
    cx: new Float64Array(n), cy: new Float64Array(n), cz: new Float64Array(n),
    base: new Float64Array(n), rad: new Float64Array(n), s: new Float64Array(n),
    z: new Float64Array(n), ao: new Float64Array(n).fill(1), inside: new Uint8Array(n),
    nx: new Float64Array(n), ny: new Float64Array(n), nz: new Float64Array(n),
    b0: new Float64Array(n),
  };
  const cphi = new Float64Array(N), sphi = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    cphi[j] = Math.cos((TAU * j) / N);
    sphi[j] = Math.sin((TAU * j) / N);
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < N; j++) {
      const v = i * N + j;
      const s = sOf(i, j);
      const phi = (TAU * j) / N;
      const p = basePoint(L, sp, s, phi);
      const br = bark(L, s, phi, cphi[j], sphi[j], p.r0, p.rb);
      const rr = p.rb - br.d;
      g.px[v] = p.cx + p.dx * rr;
      g.py[v] = p.cy + p.dy * rr;
      g.pz[v] = p.cz + p.dz * rr;
      g.dx[v] = p.dx;
      g.dy[v] = p.dy;
      g.dz[v] = p.dz;
      g.cx[v] = p.cx;
      g.cy[v] = p.cy;
      g.cz[v] = p.cz;
      g.base[v] = p.rb;
      g.rad[v] = rr;
      g.s[v] = s;
      g.z[v] = br.z;
      g.b0[v] = s === i * sp.step ? p.rb : basePoint(L, sp, i * sp.step, phi).rb;
    }
  }
  // No fissure wall steeper than SLOPE (its depth over the distance between neighbouring points,
  // round and along): narrower cracks than the grid can hold are filled up from the bottom.
  const SLOPE = 2.5;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < N; j++) {
        const v = i * N + j;
        const round = (SLOPE * TAU * g.base[v]) / N, along = SLOPE * sp.step;
        const d0 = g.base[v] - g.rad[v];
        let d = d0;
        for (const [u, lim] of [[i * N + ((j + 1) % N), round], [i * N + ((j + N - 1) % N), round], [i > 0 ? v - N : v, along], [i < rings - 1 ? v + N : v, along]]) {
          d = Math.min(d, g.base[u] - g.rad[u] + lim);
        }
        if (d < d0 && d0 > 0) g.z[v] *= Math.max(d, 0) / d0;
        g.rad[v] = g.base[v] - d;
      }
    }
  }
  // The bark is cut in along the base surface's normal rather than towards the spine, so steep
  // fissure walls on a lobed or flattened stretch do not fold over (radially only near a break,
  // where the bare wood meets the bark's rim).
  const bx = new Float64Array(n), by = new Float64Array(n), bz = new Float64Array(n);
  for (let v = 0; v < n; v++) {
    bx[v] = g.cx[v] + g.dx[v] * g.base[v];
    by[v] = g.cy[v] + g.dy[v] * g.base[v];
    bz[v] = g.cz[v] + g.dz[v] * g.base[v];
  }
  g.bnx = new Float64Array(n);
  g.bny = new Float64Array(n);
  g.bnz = new Float64Array(n);
  gridNormals(g, bx, by, bz, g.bnx, g.bny, g.bnz);
  for (let v = 0; v < n; v++) {
    const w = L.sBreak === undefined ? 0 : smoothstep(L.sBreak - 0.045, L.sBreak - 0.02, g.s[v]);
    let nx = g.bnx[v] + (g.dx[v] - g.bnx[v]) * w, ny = g.bny[v] + (g.dy[v] - g.bny[v]) * w, nz = g.bnz[v] + (g.dz[v] - g.bnz[v]) * w;
    const l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    g.bnx[v] = nx /= l;
    g.bny[v] = ny /= l;
    g.bnz[v] = nz /= l;
    const depth = g.base[v] - g.rad[v];
    g.px[v] = bx[v] - nx * depth;
    g.py[v] = by[v] - ny * depth;
    g.pz[v] = bz[v] - nz * depth;
  }
  g.bs = g.base.slice();
  g.r0 = g.rad.slice();
  return g;
}

/** Signed distance (about) from p to a tube's base surface (its lumpy cross-section, no bark),
 *  searching its rings lo..hi (interpolated between the two either side of p, so the distance is
 *  smooth); leaves the nearest ring and column (fractional) in TD. */
const TD = { i: 0, jf: 0 };
function tubeDistance(g, x, y, z, lo, hi) {
  const { sp, N } = g;
  // (Every few rings, then each ring round the nearest of those.)
  const stride = Math.max(1, Math.floor((hi - lo) / 20));
  let best = 1e9, bi = lo;
  for (let i = lo; i <= hi; i += stride) {
    const d = (x - sp.c[i * 3]) ** 2 + (y - sp.c[i * 3 + 1]) ** 2 + (z - sp.c[i * 3 + 2]) ** 2;
    if (d < best) [best, bi] = [d, i];
  }
  for (let i = Math.max(lo, bi - stride), e = Math.min(hi, bi + stride); i <= e; i++) {
    const d = (x - sp.c[i * 3]) ** 2 + (y - sp.c[i * 3 + 1]) ** 2 + (z - sp.c[i * 3 + 2]) ** 2;
    if (d < best) [best, bi] = [d, i];
  }
  const ax = (x - sp.c[bi * 3]) * sp.t[bi * 3] + (y - sp.c[bi * 3 + 1]) * sp.t[bi * 3 + 1] + (z - sp.c[bi * 3 + 2]) * sp.t[bi * 3 + 2];
  const fr = bi + ax / sp.step;
  const f = Math.min(Math.max(fr, lo), hi);
  const i0 = Math.min(Math.floor(f), hi - 1), w = f - i0, i1 = i0 + 1, u = 1 - w;
  const c = (k) => sp.c[i0 * 3 + k] * u + sp.c[i1 * 3 + k] * w;
  const qx = x - c(0), qy = y - c(1), qz = z - c(2);
  const lx = qx * (sp.r[i0 * 3] * u + sp.r[i1 * 3] * w) + qy * (sp.r[i0 * 3 + 1] * u + sp.r[i1 * 3 + 1] * w) + qz * (sp.r[i0 * 3 + 2] * u + sp.r[i1 * 3 + 2] * w);
  const ly = qx * (sp.b[i0 * 3] * u + sp.b[i1 * 3] * w) + qy * (sp.b[i0 * 3 + 1] * u + sp.b[i1 * 3 + 1] * w) + qz * (sp.b[i0 * 3 + 2] * u + sp.b[i1 * 3 + 2] * w);
  let jf = ((Math.atan2(ly, lx) - (sp.tau[i0] * u + sp.tau[i1] * w)) / TAU) * N;
  jf = ((jf % N) + N) % N;
  const j0 = Math.floor(jf), fj = jf - j0, j1 = (j0 + 1) % N;
  TD.i = w < 0.5 ? i0 : i1;
  TD.jf = jf;
  const rb = (g.b0[i0 * N + j0] * (1 - fj) + g.b0[i0 * N + j1] * fj) * u + (g.b0[i1 * N + j0] * (1 - fj) + g.b0[i1 * N + j1] * fj) * w;
  const radial = Math.sqrt(lx * lx + ly * ly) - rb;
  // (Past the end of the rings searched, the distance to that open end.)
  const past = Math.max(lo - fr, fr - hi) * sp.step;
  if (past <= 0) return radial;
  return radial > 0 ? Math.sqrt(radial * radial + past * past) : past;
}

const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

/** The outward direction (unit, round the spine) of tube g at ring i towards p, into R. */
const R = [0, 0, 0];
function radialAt(g, i, x, y, z) {
  const sp = g.sp;
  let nx = x - sp.c[i * 3], ny = y - sp.c[i * 3 + 1], nz = z - sp.c[i * 3 + 2];
  const ax = nx * sp.t[i * 3] + ny * sp.t[i * 3 + 1] + nz * sp.t[i * 3 + 2];
  nx -= ax * sp.t[i * 3];
  ny -= ax * sp.t[i * 3 + 1];
  nz -= ax * sp.t[i * 3 + 2];
  const l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  R[0] = nx / l;
  R[1] = ny / l;
  R[2] = nz / l;
  return R;
}

/** Blends two limbs into one smooth surface where they meet (the union of their base surfaces with
 *  a fillet of radius k): each point of x near y (near(v)) is carried out onto that union, along a
 *  direction turning from x's own outward one (away from y) to halfway between theirs (at the
 *  line where they cross), so x's surface covers its own half of the fillet, out to the line down
 *  its middle where the two barks meet; past that line its points dip under y's bark, and points
 *  well inside y are drawn further in, out of sight. The fillet narrows away from the joint along
 *  the side limb (child; k falls to nothing over reach, its distance along it). Reads both limbs'
 *  surfaces as they were swept (b0, r0), so it can be run either way round. */
function fillet(x, y, k0, lo, hi, near, sinkDepth, child, reach) {
  const { N, rings } = x;
  const kOf = (s) => k0 * (1 - smoothstep(reach[0], reach[1], s));
  for (let v = 0; v < rings * N; v++) {
    if (!near(v)) continue;
    const rb = x.bs[v];
    const qx = x.cx[v] + x.dx[v] * rb, qy = x.cy[v] + x.dy[v] * rb, qz = x.cz[v] + x.dz[v] * rb;
    const b0 = tubeDistance(y, qx, qy, qz, lo, hi);
    const ki = TD.i;
    const k = kOf(x === child ? x.s[v] : ki * y.sp.step);
    if (k < 1e-4 || b0 >= k) continue;
    const ny = radialAt(y, ki, qx, qy, qz);
    const wy = 1 - smoothstep(0, k, b0);
    let Dx = x.dx[v] + ny[0] * wy, Dy = x.dy[v] + ny[1] * wy, Dz = x.dz[v] + ny[2] * wy;
    const Dl = Math.sqrt(Dx * Dx + Dy * Dy + Dz * Dz) || 1;
    Dx /= Dl;
    Dy /= Dl;
    Dz /= Dl;
    const ring = Math.floor(v / N), win = Math.max(10, Math.round(50 * x.L.alongScale));
    const xlo = Math.max(0, ring - win), xhi = Math.min(rings - 1, ring + win);
    const T = { a: 0, b: 0, k: k, ia: 0, ib: 0 };
    const f = (d) => {
      const px = qx + Dx * d, py = qy + Dy * d, pz = qz + Dz * d;
      T.a = tubeDistance(x, px, py, pz, xlo, xhi);
      T.ia = TD.i;
      T.b = tubeDistance(y, px, py, pz, lo, hi);
      T.ib = TD.i;
      T.k = Math.max(kOf(x === child ? T.ia * x.sp.step : T.ib * y.sp.step), 1e-4);
      return smin(T.a, T.b, T.k);
    };
    let d0 = 0, d1 = 2 * k;
    let inside = f(d1) < 0, t = 1;
    if (!inside) {
      for (let it = 0; it < 14; it++) {
        const m = (d0 + d1) * 0.5;
        if (f(m) < 0) d0 = m;
        else d1 = m;
      }
      f((d0 + d1) * 0.5);
      t = (T.a - T.b) / T.k; // -1 at the fillet's edge on x, 0 down its middle, 1 at its edge on y
      if (t > 0.97) inside = true;
    }
    if (inside) {
      x.inside[v] = 1;
      const rr = x.r0[v] - 1.5 * sinkDepth;
      x.px[v] = x.cx[v] + x.dx[v] * rr;
      x.py[v] = x.cy[v] + x.dy[v] * rr;
      x.pz[v] = x.cz[v] + x.dz[v] * rr;
      x.rad[v] = rr;
      continue;
    }
    const d = (d0 + d1) * 0.5;
    const px = qx + Dx * d, py = qy + Dy * d, pz = qz + Dz * d;
    // The fillet's normal there (its distance's gradient, from the two limbs' outward directions).
    const h = Math.max(T.k - Math.abs(T.a - T.b), 0) / T.k;
    const wa = T.a < T.b ? 1 - h / 2 : h / 2;
    // (x's own side turns with its base surface's normal, as its bark was cut in along it.)
    const na = [x.bnx[v], x.bny[v], x.bnz[v]];
    const nb = radialAt(y, T.ib, px, py, pz);
    let gx = wa * na[0] + (1 - wa) * nb[0], gy = wa * na[1] + (1 - wa) * nb[1], gz = wa * na[2] + (1 - wa) * nb[2];
    const gl = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
    gx /= gl;
    gy /= gl;
    gz /= gl;
    // Down the fillet's middle the barks are a little shallower where they meet (each the other's
    // fissures filled by its plates), then x's dips under y's. On the parent's side a few low
    // wrinkles run round the joint, its collar.
    const keep = 0.55 + 0.45 * smoothstep(0.02, 0.2, Math.abs(t));
    const collar = x === child ? 0 : 0.002 * Math.cos(TAU * 2 * t) * (1 - Math.abs(t)) * (0.7 + 0.6 * noise3(px * 60, py * 60, pz * 60));
    const inward = (rb - x.r0[v]) * keep - collar + sinkDepth * smoothstep(-0.05, 0.3, t);
    x.z[v] *= keep;
    x.px[v] = px - gx * inward;
    x.py[v] = py - gy * inward;
    x.pz[v] = pz - gz * inward;
    const off = (px - x.cx[v]) * x.dx[v] + (py - x.cy[v]) * x.dy[v] + (pz - x.cz[v]) * x.dz[v];
    x.base[v] = off;
    x.rad[v] = off - inward;
  }
}

/** The jagged rim of the broken end (how far past the break each column reaches) and the bare
 *  wood's height inside it, at a fraction rho of the way out and grain angle phi. */
function breakShape(seed) {
  const rand = stream(seed);
  const teeth = Array.from({ length: 5 }, (_, k) => ({
    phi: (k / 5) * TAU + (rand() - 0.5) * 0.9,
    w: 0.22 + 0.45 * rand(),
    h: 0.008 + 0.03 * rand() * rand() + (k === 1 ? 0.018 : 0),
    t: 0.55 + 0.3 * rand(),
  }));
  const tilt = rand() * TAU;
  const rim = (phi) => {
    let e = 0.008 * Math.cos(phi - tilt) + 0.003 * noise3(Math.cos(phi) * 3, Math.sin(phi) * 3, seed);
    for (const t of teeth) {
      const d = Math.abs(wrapPi(phi - t.phi)) / t.w;
      if (d < 1) e = Math.max(e, t.h * Math.pow(1 - d, 1.4) + 0.008 * Math.cos(phi - tilt));
    }
    return e + 0.0025 * Math.abs(noise3(Math.cos(phi) * 11, Math.sin(phi) * 11, seed + 3));
  };
  const height = (rho, phi) => {
    const cp = Math.cos(phi), sp = Math.sin(phi);
    // Bundles of fibres torn off at different lengths: cells in the cross-section (none round the
    // pith, where they would be slivers too thin to hold).
    cells(rho * 4.5 + 0.3 * noise3(cp * 2, sp * 2, seed), (phi / TAU) * 16, 1e6, seed + 7);
    const bundle = (CELL.cell - 0.5) * 0.011 * smoothstep(0.0, 0.4, CELL.e + 0.08) * smoothstep(0.08, 0.35, rho);
    const inner = 0.004 * Math.cos(phi - tilt) * rho - 0.003 + bundle + 0.002 * noise3(cp * rho * 20, sp * rho * 20, seed + 1);
    // The teeth are slivers of the outer wood, standing up to the rim's height.
    let w = smoothstep(0.86, 1, rho);
    for (const t of teeth) {
      if (Math.abs(wrapPi(phi - t.phi)) < t.w) w = Math.max(w, smoothstep(t.t, t.t + 0.12, rho));
    }
    return inner + (rim(phi) - inner) * w;
  };
  return { rim, height };
}

// ---- the piece ---------------------------------------------------------------------------------

/** The driftwood. detail scales its tessellation (1: ~200k triangles; 0.5, for phones: about a
 *  quarter, the bark's finest relief smoothed into what the coarser grid holds); its shape, its
 *  place, its materials' attributes and its obstacles are the same at any detail.
 *  @returns {import('./mesh.mjs').ScapePiece} */
export function build(options = { detail: 1 }) {
  // (Anything but a finite number, or no options at all, is full detail.)
  const detail = Number.isFinite(options?.detail) ? Math.min(Math.max(options.detail, 0.25), 2) : 1;
  const limbs = layout(detail);
  const grids = [];
  for (const L of limbs) {
    const { rings, sOf } = tubeRings(L, L.spine, L.around);
    L.rings = rings;
    grids.push(sweep(L, L.spine, sOf));
  }

  // Blend the side limbs into the arch, each surface carried onto the fillet from its own side.
  for (const [li, L] of limbs.entries()) {
    if (L.parent === undefined) continue;
    const P = grids[L.parent], C = grids[li];
    const sj = L.junction;
    const lo = Math.max(0, Math.floor((sj - 0.3) / P.sp.step)), hi = Math.min(P.rings - 1, Math.ceil((sj + 0.3) / P.sp.step));
    const chi = Math.min(C.rings - 1, Math.ceil(0.35 / C.sp.step));
    const [jx, jy, jz] = [C.sp.c[0], C.sp.c[1], C.sp.c[2]];
    const sink = 0.026;
    fillet(C, P, L.fillet, lo, hi, (v) => C.s[v] <= L.reach[1], sink, C, L.reach);
    fillet(P, C, L.fillet, 0, chi, (v) => (P.px[v] - jx) ** 2 + (P.py[v] - jy) ** 2 + (P.pz[v] - jz) ** 2 < 0.26 * 0.26, sink, C, L.reach);
  }

  for (const g of grids) normals(g);
  occlusion(grids);

  const mb = new MeshBuilder('driftwood');
  for (const g of grids) emitTube(mb, g);
  const obstacles = [];
  for (const g of grids) obstaclesFor(g, obstacles);
  return { meshes: [mb.finish()], obstacles };
}

/** A limb's base surface's radius as swept at full detail (ring i, column j of its full-detail
 *  grid): the swept grid's own at detail 1, else found again. */
function fullDetailRadius(g) {
  const L = g.L;
  if (L.spine === L.ref) return (i, j) => g.bs[i * g.N + j];
  const N = L.refAround, { sOf } = tubeRings(L, L.ref, N);
  return (i, j) => basePoint(L, L.ref, sOf(i, j), (TAU * j) / N).rb;
}

/** The grid's normals, from its neighbours round and along. */
function normals(g) {
  gridNormals(g, g.px, g.py, g.pz, g.nx, g.ny, g.nz);
}

/** Normals of a surface on g's grid (points X, Y, Z) into NX, NY, NZ. */
function gridNormals(g, X, Y, Z, NX, NY, NZ) {
  const { N, rings } = g;
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < N; j++) {
      const v = i * N + j;
      const vjp = i * N + ((j + 1) % N), vjm = i * N + ((j - 1 + N) % N);
      const vip = Math.min(rings - 1, i + 1) * N + j, vim = Math.max(0, i - 1) * N + j;
      const ax = X[vjp] - X[vjm], ay = Y[vjp] - Y[vjm], az = Z[vjp] - Z[vjm];
      const bx = X[vip] - X[vim], by = Y[vip] - Y[vim], bz = Z[vip] - Z[vim];
      let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
      let nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (!(nl > 1e-12)) [nx, ny, nz, nl] = [g.dx[v], g.dy[v], g.dz[v], 1];
      NX[v] = nx / nl;
      NY[v] = ny / nl;
      NZ[v] = nz / nl;
    }
  }
}

/** Bakes the occlusion: the relief's cavities (fine, from the fissures, and broad, from the
 *  channels), the sand, and the other limbs (each a string of spheres along its spine). */
function occlusion(grids) {
  const STEP = 0.012;
  const spheres = grids.map((g) => {
    const out = [];
    const end = g.s[(g.rings - 1) * g.N];
    for (let s = 0; s <= end; s += STEP) {
      const a = spineAt(g.sp, s);
      out.push([a.cx, a.cy, a.cz, baseRadius(g.L, g.sp, s) * (g.L.shrink ? g.L.shrink(s) : 1)]);
    }
    return out;
  });
  // (Each string of spheres' bounds, as far out as they darken anything.)
  const bounds = spheres.map((list) => {
    const b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9];
    for (const [x, y, z, r] of list) {
      for (const [k, c] of [x, y, z].entries()) {
        b[k] = Math.min(b[k], c - 6 * r);
        b[k + 3] = Math.max(b[k + 3], c + 6 * r);
      }
    }
    return b;
  });
  const packed = spheres.map((list) => Float64Array.from(list.flat()));
  for (const [gi, g] of grids.entries()) {
    const { N, rings, L } = g;
    // (Over as much of the surface at any detail.)
    const along = (k) => Math.max(1, Math.round(k * L.alongScale)), round = (k) => Math.max(1, Math.round(k * L.roundScale));
    const fine = boxBlur(g.rad, rings, N, along(2), round(4));
    const broad = boxBlur(g.base, rings, N, along(9), round(14));
    for (let v = 0; v < rings * N; v++) {
      const r0 = g.base[v] || 0.07;
      const cav = Math.max(0, fine[v] - g.rad[v]) / (L.depth * 0.6 * r0);
      const cavB = Math.max(0, broad[v] - g.base[v]) / (0.1 * r0);
      let ao = (1 - 0.55 * clamp01(cav)) * (1 - 0.35 * clamp01(cavB)) * (1 - 0.25 * g.z[v]);
      // The sand: dark where the wood goes into it, and under the parts facing down onto it.
      const x = g.px[v], y = g.py[v], z = g.pz[v];
      const nx = g.nx[v], ny = g.ny[v], nz = g.nz[v];
      const h = y - BED_LEVEL;
      ao *= 0.35 + 0.65 * smoothstep(-0.01, 0.07, h);
      ao *= 1 - 0.45 * Math.max(0, -ny) * Math.exp(-Math.max(h, 0) / 0.12);
      // The other limbs.
      let occ = 0;
      for (let hi = 0; hi < spheres.length; hi++) {
        const b = bounds[hi], list = packed[hi];
        if (hi === gi || x < b[0] || y < b[1] || z < b[2] || x > b[3] || y > b[4] || z > b[5]) continue;
        for (let k = 0; k < list.length; k += 4) {
          const r = list[k + 3];
          const ox = list[k] - x, oy = list[k + 1] - y, oz = list[k + 2] - z;
          const d2 = ox * ox + oy * oy + oz * oz;
          if (d2 > 36 * r * r) continue;
          const d = Math.sqrt(d2);
          const c = (ox * nx + oy * ny + oz * nz) / d;
          if (c <= 0) continue;
          occ += ((r * r) / Math.max(d2, r * r)) * c * (STEP / (2 * r));
        }
      }
      ao *= 1 - Math.min(0.6, 0.75 * occ);
      if (g.inside[v]) ao *= 0.3;
      g.ao[v] = Math.min(1, Math.max(0.03, ao));
    }
  }
}

/** A box blur over a grid that wraps round (columns) and is clamped along (rings). */
function boxBlur(src, rings, N, ri, rj) {
  const tmp = new Float64Array(rings * N), out = new Float64Array(rings * N);
  for (let i = 0; i < rings; i++) {
    let sum = 0;
    for (let k = -rj; k <= rj; k++) sum += src[i * N + ((k + N) % N)];
    for (let j = 0; j < N; j++) {
      tmp[i * N + j] = sum / (2 * rj + 1);
      sum += src[i * N + ((j + rj + 1) % N)] - src[i * N + ((j - rj + N) % N)];
    }
  }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < rings; i++) {
      let sum = 0, cnt = 0;
      for (let k = Math.max(0, i - ri); k <= Math.min(rings - 1, i + ri); k++) {
        sum += tmp[k * N + j];
        cnt++;
      }
      out[i * N + j] = sum / cnt;
    }
  }
  return out;
}

/** Writes a tube (its seam doubled, normals from the grid) and its ends into the mesh. */
function emitTube(mb, g) {
  const { N, rings, L } = g;
  const base = mb.vertexCount;
  // (The angle round it also says which limb it is, in whole pairs of turns: see scape_mat_bark.)
  const turn = 2 * TAU * L.index;
  const at = (i, j) => (i * N + ((j % N) + N) % N);
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j <= N; j++) {
      const v = at(i, j);
      const along = g.s[v] + (L.junction ?? 0);
      mb.vertex([g.px[v], g.py[v], g.pz[v]], [along, (TAU * j) / N + turn, g.z[v], g.ao[v]], [g.nx[v], g.ny[v], g.nz[v]]);
    }
  }
  const row = N + 1;
  // Each quad is split along the diagonal the relief runs along (the one it bends less along, over
  // the points either side), so a crack crossing the grid aslant stays one crack, not a sawtooth.
  const h = (i, j) => {
    const v = at(Math.min(Math.max(i, 0), rings - 1), j);
    return g.rad[v] - g.base[v];
  };
  for (let i = 0; i < rings - 1; i++) {
    for (let j = 0; j < N; j++) {
      const a = base + i * row + j;
      const ac = Math.abs(h(i - 1, j - 1) - 2 * h(i, j) + h(i + 1, j + 1)) + Math.abs(h(i, j) - 2 * h(i + 1, j + 1) + h(i + 2, j + 2));
      const bd = Math.abs(h(i - 1, j + 2) - 2 * h(i, j + 1) + h(i + 1, j)) + Math.abs(h(i, j + 1) - 2 * h(i + 1, j) + h(i + 2, j - 1));
      if (ac <= bd) mb.quad(a, a + 1, a + row + 1, a + row, MAT.BARK);
      else mb.quad(a + 1, a + row + 1, a + row, a, MAT.BARK);
    }
  }
  for (const [end, kind] of L.caps.entries()) {
    if (kind === 'inside') continue;
    const i = end ? rings - 1 : 0;
    if (kind === 'buried') {
      const sp = g.sp;
      const s = g.s[i * N];
      const a = spineAt(sp, s);
      const sgn = end ? 1 : -1;
      const r = g.base[i * N];
      const c = mb.vertex([a.cx + sgn * a.tx * r * 0.4, a.cy + sgn * a.ty * r * 0.4, a.cz + sgn * a.tz * r * 0.4], [s + (L.junction ?? 0), turn, 0, 0.1], [sgn * a.tx, sgn * a.ty, sgn * a.tz]);
      for (let j = 0; j < N; j++) {
        const p = base + i * row + j, q = p + 1;
        if (end) mb.tri(p, q, c, MAT.BARK);
        else mb.tri(q, p, c, MAT.BARK);
      }
    } else emitBreak(mb, g);
  }
}

/** The broken end: bare, splintered wood filling the jagged rim, in rings from the rim in to the
 *  middle; its attrs are where each point lies across the break (rings of growth round its
 *  middle). */
function emitBreak(mb, g) {
  const { N, rings, L, sp } = g;
  const K = Math.max(6, Math.round(22 * L.roundScale));
  const i = rings - 1;
  let mean = 0;
  for (let j = 0; j < N; j++) mean += g.rad[i * N + j];
  mean /= N;
  const ids = [];
  for (let k = 0; k <= K; k++) {
    const rho = 1 - k / K;
    const row = [];
    for (let j = 0; j < N; j++) {
      const v = i * N + j;
      const phi = (TAU * j) / N;
      let p;
      if (k === 0) p = [g.px[v], g.py[v], g.pz[v]];
      else {
        const s = L.sBreak + L.brk.height(rho, phi);
        const a = spineAt(sp, s);
        const th = phi + a.tau;
        const ct = Math.cos(th), st = Math.sin(th);
        const r = g.rad[v] * rho * (k === 1 ? 0.985 : 1);
        p = [a.cx + (ct * a.rx + st * a.bx) * r, a.cy + (ct * a.ry + st * a.by) * r, a.cz + (ct * a.rz + st * a.bz) * r];
      }
      const ao = (0.55 + 0.45 * smoothstep(0, 0.6, 1 - rho)) * (k === 0 ? 0.8 : 1);
      row.push(mb.vertex(p, [Math.cos(phi) * rho * mean, Math.sin(phi) * rho * mean, 0, ao]));
      if (k === K) break;
    }
    ids.push(row);
  }
  for (let k = 0; k < K; k++) {
    for (let j = 0; j < N; j++) {
      const a = ids[k][j], b = ids[k][(j + 1) % N];
      if (k === K - 1) mb.tri(a, b, ids[K][0], MAT.WOOD_END);
      else mb.quad(a, b, ids[k + 1][(j + 1) % N], ids[k + 1][j], MAT.WOOD_END);
    }
  }
}

/** Capsules along a limb where it stands above the sand: solid to about its radius, the fish's
 *  margin 0.05 beyond (measured on the limb as made at full detail, so they are the same at any
 *  detail). */
function obstaclesFor(g, out) {
  const sp = g.L.ref, N = g.L.refAround;
  const { rings, sOf } = tubeRings(g.L, sp, N);
  const radius = fullDetailRadius(g);
  const step = 0.1;
  const end = sOf(rings - 1, 0);
  const n = Math.max(1, Math.round(end / step));
  for (let k = 0; k < n; k++) {
    const s0 = (k / n) * end, s1 = ((k + 1) / n) * end;
    const a = spineAt(sp, s0);
    const A = [a.cx, a.cy, a.cz];
    const b = spineAt(sp, s1);
    const B = [b.cx, b.cy, b.cz];
    if (Math.max(A[1], B[1]) < BED_LEVEL) continue;
    if (g.L.parent !== undefined && s1 < 0.05) continue;
    let r = 0;
    for (let i = Math.floor(s0 / sp.step); i <= Math.min(rings - 1, Math.ceil(s1 / sp.step)); i++) {
      for (let j = 0; j < N; j += 4) r = Math.max(r, radius(i, j));
    }
    const solid = Math.round(r * 0.9 * 1000) / 1000;
    out.push({ a: A.map((x) => Math.round(x * 1000) / 1000), b: B.map((x) => Math.round(x * 1000) / 1000), r: Math.round((solid + 0.05) * 1000) / 1000, solid });
  }
}

// ---- the material ------------------------------------------------------------------------------

/** WGSL for the limbs' axes, so the bark's shader knows which way the grain runs: for each limb, its
 *  centre line and direction at a distance along it (`along`, as the attrs have it) and how fast
 *  its grain turns (radians a unit of length); scape_wood_axis picks the limb by its index. */
function axisWGSL(limbs) {
  const f = (x) => (Math.abs(x) < 5e-6 ? '0.0' : x.toFixed(5));
  const v3 = (a) => `vec3f(${f(a[0])}, ${f(a[1])}, ${f(a[2])})`;
  let out = '';
  for (const [li, L] of limbs.entries()) {
    const sp = L.spine;
    const off = L.junction ?? 0;
    const n = Math.max(2, Math.ceil(sp.L / 0.06));
    const pts = [];
    for (let k = 0; k <= n; k++) {
      const a = spineAt(sp, (k / n) * sp.L);
      const tl = Math.hypot(a.tx, a.ty, a.tz);
      pts.push([off + (k / n) * sp.L, [a.cx, a.cy, a.cz], [a.tx / tl, a.ty / tl, a.tz / tl]]);
    }
    out += `fn scape_wood_axis${li}(s: f32) -> ScapeWoodAxis {\n`;
    for (let k = 0; k < n; k++) {
      const [s0, c0, t0] = pts[k], [s1, c1, t1] = pts[k + 1];
      const call = `scape_wood_lerp(${v3(c0)}, ${v3(t0)}, ${v3(c1)}, ${v3(t1)}, ${f(L.twist)}, clamp((s - ${f(s0)}) * ${f(1 / (s1 - s0))}, 0.0, 1.0))`;
      out += k < n - 1 ? `  if (s < ${f(s1)}) {\n    return ${call};\n  }\n` : `  return ${call};\n`;
    }
    out += '}\n\n';
  }
  out += 'fn scape_wood_axis(along: f32, limb: i32) -> ScapeWoodAxis {\n';
  for (let li = 1; li < limbs.length; li++) out += `  if (limb == ${li}) {\n    return scape_wood_axis${li}(along);\n  }\n`;
  return out + '  return scape_wood_axis0(along);\n}\n';
}

/** The broken limb's axis at its break (for the bare wood's fibres). */
function breakAxis(limbs) {
  const sp = limbs.find((L) => L.caps[1] === 'broken').spine;
  const a = spineAt(sp, sp.L);
  const l = Math.hypot(a.tx, a.ty, a.tz);
  return `vec3f(${(a.tx / l).toFixed(5)}, ${(a.ty / l).toFixed(5)}, ${(a.tz / l).toFixed(5)})`;
}

const SHADER_LIMBS = layout();

export const WGSL = /* wgsl */ `
struct ScapeWoodAxis {
  c: vec3f,
  t: vec3f,
  twist: f32,
}

fn scape_wood_lerp(c0: vec3f, t0: vec3f, c1: vec3f, t1: vec3f, twist: f32, f: f32) -> ScapeWoodAxis {
  var a: ScapeWoodAxis;
  a.c = mix(c0, c1, f);
  a.t = normalize(mix(t0, t1, f));
  a.twist = twist;
  return a;
}

${axisWGSL(SHADER_LIMBS)}
// The bark's fine fibres, a height (about -1..1) at a distance along the limb and an angle round
// it: drawn out along the grain, thin round it.
fn scape_wood_fibres(along: f32, ang: f32) -> f32 {
  // (The fibres wander a little round as they go.)
  let a = ang + 0.05 * scape_noise3(vec3f(cos(ang) * 4.0, sin(ang) * 4.0, along * 9.0));
  let q = vec3f(cos(a) * 34.0, sin(a) * 34.0, along * 38.0);
  let r = 1.0 - abs(scape_noise3(q));
  return r * r * 1.4 - 0.7 + 0.5 * scape_noise3(q * vec3f(2.1, 2.1, 1.3) + vec3f(3.1, 7.7, 1.3));
}

// Coarser grooves and swellings along the grain (a height, about -1..1).
fn scape_wood_streaks(along: f32, ang: f32) -> f32 {
  return scape_noise3(vec3f(cos(ang) * 11.0, sin(ang) * 11.0, along * 7.0));
}

fn scape_mat_bark(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let along = attrs.x;
  let ang = attrs.y;
  let deep = clamp(attrs.z, 0.0, 1.0);
  let ao = clamp(attrs.w, 0.0, 1.0);
  // (Which limb: the angle's whole pairs of turns.)
  let limb = i32(floor(ang * (1.0 / 12.566371) + 0.25));

  // The grain's direction on the surface (along the limb, turned by its twist) and round it.
  let ax = scape_wood_axis(along, limb);
  let rv = p - ax.c - dot(p - ax.c, ax.t) * ax.t;
  let r = max(length(rv), 0.02);
  let roundDir = normalize(cross(ax.t, n) + vec3f(1.0e-5, 0.0, 0.0));
  let grain = normalize(ax.t - dot(ax.t, n) * n + roundDir * (ax.twist * r));

  // Fine relief on top of the geometry's: fibres (~2 mm) and streaks (~1 cm), each faded to its
  // mean where a pixel grows past it; slopes from differences along the grain and round it.
  let fineFade = (1.0 - smoothstep(0.0003, 0.0008, foot)) * (0.45 + 0.55 * smoothstep(-0.4, 0.4, scape_noise3(p * 23.0)));
  let midFade = 1.0 - smoothstep(0.001, 0.003, foot);
  var dAlong = 0.0;
  var dRound = 0.0;
  var fib = 0.0;
  if (fineFade > 0.0) {
    fib = scape_wood_fibres(along, ang);
    dAlong += fineFade * 0.00028 * (scape_wood_fibres(along + 0.002, ang) - fib) / 0.002;
    dRound += fineFade * 0.00028 * (scape_wood_fibres(along, ang + 0.0035) - fib) / (0.0035 * r);
  }
  var st = 0.0;
  if (midFade > 0.0) {
    st = scape_wood_streaks(along, ang);
    dAlong += midFade * 0.001 * (scape_wood_streaks(along + 0.01, ang) - st) / 0.01;
    dRound += midFade * 0.001 * (scape_wood_streaks(along, ang + 0.012) - st) / (0.012 * r);
  }
  // (Less of it deep in the fissures, where the shading is dark anyway; never tipped too far.)
  var tilt = (1.0 - 0.5 * deep) * (dAlong * grain + dRound * roundDir);
  tilt *= min(1.0, 0.6 / max(length(tilt), 1.0e-6));
  m.n = normalize(n - tilt);

  // Colour: warm wet mid brown, lighter on the worn crests, dark deep in the fissures; streaks
  // along the grain (paler, bleached ones and reddish ones) and a broad mottle.
  let gx = cos(ang);
  let gy = sin(ang);
  let streakA = scape_noise3(vec3f(gx * 3.2 + 4.1, gy * 3.2 + 1.7, along * 2.2));
  let streakB = scape_noise3(vec3f(gx * 6.5 + 9.3, gy * 6.5 + 2.2, along * 3.1 + 5.0));
  let mottle = scape_fbm3(p * 9.0 + vec3f(1.3, 4.1, 2.7), 3);
  var col = vec3f(0.48, 0.29, 0.15);
  col = mix(col, vec3f(0.57, 0.41, 0.26), smoothstep(0.1, 0.7, streakA) * 0.6);
  col = mix(col, vec3f(0.49, 0.24, 0.11), smoothstep(0.2, 0.75, streakB) * 0.5);
  col = col * (0.97 + 0.24 * mottle);
  // The crests, worn by the water: lighter and greyer (more so out in the open); the fissures
  // dark.
  let crest = (1.0 - smoothstep(0.0, 0.35, deep)) * smoothstep(0.35, 0.9, ao);
  col = mix(col, col * 1.15 + vec3f(0.09, 0.06, 0.03), crest * 0.65);
  col = mix(col, vec3f(0.13, 0.075, 0.04), smoothstep(0.25, 0.95, deep));
  // Fibres and streaks show a little in the colour too (their mean where they fade).
  col *= 1.0 + 0.12 * fineFade * fib + 0.1 * midFade * st;
  // A faint film of algae on the faces turned up to the light.
  let up = smoothstep(0.35, 0.95, n.y) * (1.0 - deep);
  let film = up * smoothstep(-0.2, 0.5, scape_noise3(p * 14.0 + vec3f(7.0, 1.0, 3.0)));
  col = mix(col, vec3f(0.27, 0.29, 0.13), film * 0.12);
  m.albedo = scape_linear(clamp(col, vec3f(0.0), vec3f(1.0)));

  // Wet wood: a faint sheen, rougher on the worn crests, smoother where water lies in the cracks.
  m.rough = clamp(0.62 + 0.07 * crest - 0.08 * deep + 0.04 * mottle, 0.5, 0.75);
  m.spec = 0.036;
  m.trans = vec3f(0.0);
  m.ao = ao;
  return m;
}

// Bare wood where the limb broke off: pale, with growth rings round its middle, fine rays, and the
// torn fibres streaked along the limb.
fn scape_mat_woodEnd(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let xy = attrs.xy;
  let ao = clamp(attrs.w, 0.0, 1.0);
  let axis = ${breakAxis(SHADER_LIMBS)};
  let side = normalize(cross(axis, vec3f(0.0, 0.0, 1.0)));
  let side2 = cross(axis, side);
  // Rings a little off centre and wavy, ~0.4 mm apart (faded to their mean where a pixel spans
  // several), fine rays out from the middle.
  let rr = length(xy - vec2f(0.004, -0.003) * (1.0 - smoothstep(0.0, 0.05, length(xy)))) + 0.0018 * scape_noise3(vec3f(xy * 90.0, 1.7));
  let ringFade = 1.0 - smoothstep(0.0008, 0.0017, foot);
  let ph = fract(rr / 0.0034);
  let late = smoothstep(0.62, 0.86, ph) * (1.0 - smoothstep(0.9, 1.0, ph));
  let rays = smoothstep(0.55, 0.95, scape_noise3(vec3f(atan2(xy.y, xy.x) * 40.0, rr * 60.0, 3.3)));
  // The torn fibres: streaks along the limb.
  let fq = vec3f(dot(p, axis) * 30.0, dot(p, side) * 900.0, dot(p, side2) * 900.0);
  let fibre = scape_noise3(fq);
  let fineFade = 1.0 - smoothstep(0.0002, 0.0005, foot);
  // (Weathered, not fresh.)
  var col = vec3f(0.5, 0.38, 0.25);
  col = mix(col, vec3f(0.37, 0.25, 0.15), late * 0.7 * ringFade + 0.25 * (1.0 - ringFade));
  col = mix(col, vec3f(0.6, 0.48, 0.34), rays * 0.25 * ringFade);
  col *= 0.9 + 0.18 * fibre * fineFade;
  // The pith, dark; the rim and the hollows weathered towards the bark's brown.
  col = mix(col, vec3f(0.25, 0.15, 0.08), 1.0 - smoothstep(0.002, 0.005, length(xy)));
  col = mix(col, vec3f(0.36, 0.25, 0.15), (1.0 - smoothstep(0.55, 0.95, ao)) * 0.6);
  m.albedo = scape_linear(col);
  // The fibres' ridges in the normal, across the grain.
  let e = 0.0012;
  let g = (scape_noise3(fq + vec3f(0.0, e * 900.0, 0.0)) - fibre) / e * side + (scape_noise3(fq + vec3f(0.0, 0.0, e * 900.0)) - fibre) / e * side2;
  m.n = normalize(n - fineFade * 0.00012 * (g - dot(g, n) * n));
  m.rough = 0.74;
  m.spec = 0.03;
  m.trans = vec3f(0.0);
  m.ao = ao;
  return m;
}
`;
