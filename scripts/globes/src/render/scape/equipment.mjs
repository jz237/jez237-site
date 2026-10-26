// The betta bowl's equipment (its page only; mesh.mjs holds the ground rules): what keeps a betta
// well in a ~10-gallon planted bowl, as a keeper sets it up. On the back glass on the right, partly
// behind the tall plant, a compact submersible heater: its tube inside a black slotted plastic
// guard, a cap with a small amber light that shows it is heating, held off the glass by two clear
// suction cups on clips, its cord running up the glass and out under the lid's rim. At the back on
// the left, a small sponge filter: a coarse black foam cylinder on a weighted base, standing in the
// sand, a short lift tube rising from it (the air bubbling up it draws the water in through the
// foam: a gentle flow, as a betta's long fins need), its airline tubing running up the glass and out
// under the lid too. The bubbles themselves are the water's (the page lets them go from the lift
// tube's mouth: build's `bubbles`).
// Sizes as the real things for a bowl this size (a world unit is ~12 cm: the glass ~24 cm across, the
// betta ~5.5 cm long, mesh.mjs): the heater ~6 cm long and 1.2 cm across, a nano heater; the sponge
// 2.3 cm across and 3 cm tall, a nano sponge filter. (Built first to an 18-inch bowl's scale, twice
// this; the numbers in the code are world units.)
// Everything here is rigid: lathed (surfaces of revolution about each part's own axis) or swept
// along a curve (the cord and the airline), its normals from its profile, sharp where it creases.

import { BED_LEVEL, GLASS_INNER, MAT, MeshBuilder, fbm3, noise3 } from './mesh.mjs';

/** @typedef {import('./mesh.mjs').V3} V3 */

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => mul(a, 1 / (len(a) || 1));
const smooth = (e0, e1, x) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

/** How far in from the glass's inner face a suction cup's middle and the tubing's centre lines lie
 *  (each kept inside the glass with checkMesh's margin, the cup's rim and the tubing's outside a
 *  millimetre or so off it). */
const CUP_INSET = 0.007;
const LINE_INSET = 0.016;

// ---- where they stand ---------------------------------------------------------------------------
/** The heater: where round the glass (the angle from +x towards +z: the back right), the heights on
 *  the glass its lean is taken between (its foot's, and about its top's), how far its axis stands
 *  off the glass at the clips. */
const HEATER = { az: -1.02, foot: -0.46, top: 0.06, off: 0.104 };
/** Its guard (outer and inner radius), the tube inside it, its cap; how far along it its slots
 *  run, and the band across them (from, to); its bars, each this share of the way round; the clips'
 *  heights along it; the lamp's; its length to the end of the cord's boot. */
const GUARD = { r: 0.052, rIn: 0.044, tube: 0.037, cap: 0.054, slots: [0.045, 0.39], band: [0.205, 0.225], bars: 10, fill: 0.56 };
const CLIPS = [0.115, 0.315];
const LAMP = { h: 0.432, r: 0.0095 };
const HEATER_LENGTH = 0.525;
const CORD_R = 0.0087;
/** The sponge filter (at the back on the left, partly behind the arch's foot): its middle on the
 *  sand (x, z), the base's radius and top, the sponge's radius and top, the lift tube's radius and
 *  top (heights above the sand), where the airline leaves it. */
const FILTER = { at: [-0.34, -0.545], base: 0.125, baseTop: 0.03, sponge: 0.101, spongeTop: 0.3, tube: 0.026, tubeTop: 0.56, air: 0.528 };
const AIRLINE_R = 0.0108;
/** Its air: bubbles a second, and their radius (about: 2-5 mm across), a gentle stream. */
const BUBBLES = { rate: 9, radius: 0.0055 };

/** The glass's point at height y and angle az round it, `inset` in from its inner face (along the
 *  sphere's radius). */
function onGlass(y, az, inset) {
  const r = GLASS_INNER - inset;
  const h = Math.sqrt(Math.max(r * r - y * y, 0));
  return [h * Math.cos(az), y, h * Math.sin(az)];
}

/** The same in the sphere's own terms: its elevation, its angle round, how far in (for the curves
 *  that follow the glass, laid out in these and turned back into points: onSphere). */
function toSphere(p) {
  const r = len(p);
  return [Math.asin(p[1] / r), Math.atan2(p[2], p[0]), GLASS_INNER - r];
}
function onSphere([el, az, inset]) {
  const r = GLASS_INNER - inset;
  return [r * Math.cos(el) * Math.cos(az), r * Math.sin(el), r * Math.cos(el) * Math.sin(az)];
}

/** A frame: origin o, axis u, and a and b across it (a x b = u; a as near the given a as can be). */
function frame(o, u, a) {
  const U = norm(u);
  const A = norm(sub(a, mul(U, dot(a, U))));
  return { o, u: U, a: A, b: cross(U, A) };
}

// ---- building blocks ------------------------------------------------------------------------------
/** The quad a..d with its corners turned (if they need it) so that it faces n. */
function quadFacing(mb, a, b, c, d, material, n) {
  const P = mb.p;
  const at = (i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]];
  const g = cross(sub(at(b), at(a)), sub(at(c), at(a)));
  if (dot(g, n) >= 0) mb.quad(a, b, c, d, material);
  else mb.quad(a, d, c, b, material);
}

/**
 * A surface of revolution about f.u: the profile's points ([r, h, crease]: r out from the axis, h
 * along it; crease true where it turns sharply) joined in turn and swept round, all the way or from
 * angle span[0] to span[1] (radians from f.a towards f.b), in `sides` steps. It faces out where the
 * profile runs the way the axis points up its outside (in from the rim across a top, up a wall, out
 * along a bottom), as the normals are: each point's from the segments either side of it (or each
 * side's own, at a crease: two rings there); a point on the axis is one vertex. attrs(i, r, h): the
 * i-th point's four attributes. shape(p, n), if given, moves each vertex (normals then from the
 * faces).
 */
function lathe(mb, f, profile, sides, material, attrs, span = null, shape = null) {
  const [a0, a1] = span ?? [0, 2 * Math.PI];
  const cols = span ? sides + 1 : sides;
  const seg = [];
  for (let i = 0; i + 1 < profile.length; i++) {
    const dr = profile[i + 1][0] - profile[i][0], dh = profile[i + 1][1] - profile[i][1], l = Math.hypot(dr, dh) || 1;
    seg.push([dh / l, -dr / l]);
  }
  const ring = (i, n) => {
    const [r, h] = profile[i];
    const at = attrs(i, r, h);
    const base = add(f.o, mul(f.u, h));
    if (r === 0) {
      const p = shape ? shape(base, f.u) : base;
      return mb.vertex(p, at, shape ? null : mul(f.u, n[1] < 0 ? -1 : 1));
    }
    const ids = [];
    for (let j = 0; j < cols; j++) {
      const t = a0 + ((a1 - a0) * j) / sides;
      const out = add(mul(f.a, Math.cos(t)), mul(f.b, Math.sin(t)));
      const nv = norm(add(mul(out, n[0]), mul(f.u, n[1])));
      const p = add(base, mul(out, r));
      ids.push(shape ? mb.vertex(shape(p, nv), at) : mb.vertex(p, at, nv));
    }
    return ids;
  };
  const band = (A, B) => {
    for (let j = 0; j < sides; j++) {
      const k = (j + 1) % cols;
      if (typeof A === 'number') mb.tri(A, B[k], B[j], material);
      else if (typeof B === 'number') mb.tri(A[j], A[k], B, material);
      else mb.quad(A[j], A[k], B[k], B[j], material);
    }
  };
  // (A point's ring going into the segment before it, and the one coming out into the segment
  // after it: the same ring at a smooth point.)
  let open = null;
  profile.forEach((pt, i) => {
    const before = seg[i - 1], after = seg[i];
    let into = null, out = null;
    if (before && after && !pt[2]) {
      const n = [before[0] + after[0], before[1] + after[1]], l = Math.hypot(n[0], n[1]) || 1;
      into = out = ring(i, [n[0] / l, n[1] / l]);
    } else {
      if (before) into = ring(i, before);
      if (after) out = ring(i, after);
    }
    if (open !== null && into !== null) band(open, into);
    open = out;
  });
}

/** Points along a Catmull-Rom curve through pts, `per` to each span. */
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

/**
 * A round tube of radius r along the curve pts, `sides` round (its frame carried along without
 * twisting, from `across` at its start), closed at its end if asked (its start is always inside
 * something). attrs(s): the four attributes s along it (world units from its start).
 */
function sweep(mb, pts, r, sides, material, attrs, closeEnd, across) {
  const n = pts.length;
  const T = pts.map((_, k) => norm(sub(pts[Math.min(k + 1, n - 1)], pts[Math.max(k - 1, 0)])));
  let U = norm(sub(across, mul(T[0], dot(across, T[0]))));
  const rings = [];
  let s = 0;
  for (let k = 0; k < n; k++) {
    if (k) {
      s += len(sub(pts[k], pts[k - 1]));
      U = norm(sub(U, mul(T[k], dot(U, T[k]))));
    }
    const V = cross(T[k], U);
    const ring = [];
    for (let j = 0; j < sides; j++) {
      const a = (2 * Math.PI * j) / sides;
      const d = add(mul(U, Math.cos(a)), mul(V, Math.sin(a)));
      ring.push(mb.vertex(add(pts[k], mul(d, r)), attrs(s), d));
    }
    rings.push(ring);
  }
  for (let k = 0; k + 1 < n; k++) {
    for (let j = 0; j < sides; j++) mb.quad(rings[k][j], rings[k][(j + 1) % sides], rings[k + 1][(j + 1) % sides], rings[k + 1][j], material);
  }
  if (closeEnd) {
    // (A cut end: a flat disc, its edge eased a little by its normals.)
    const c = mb.vertex(pts[n - 1], attrs(s), T[n - 1]);
    const edge = rings[n - 1].map((v) => {
      const p = [mb.p[v * 3], mb.p[v * 3 + 1], mb.p[v * 3 + 2]];
      return mb.vertex(p, attrs(s), norm(add(T[n - 1], mul(norm(sub(p, pts[n - 1])), 0.35))));
    });
    for (let j = 0; j < sides; j++) mb.tri(c, edge[j], edge[(j + 1) % sides], material);
  }
}

/** A line's centre that follows the glass: through the given points (any of them in the open
 *  water), laid out in the sphere's terms (toSphere) so that between them it keeps to the glass's
 *  curve, `per` points a span, and never nearer the glass than `inset`. */
function glassLine(points, per, inset) {
  return catmull(points.map(toSphere), per).map(([el, az, d]) => onSphere([el, az, Math.max(d, inset)]));
}

// ---- the heater -------------------------------------------------------------------------------------
/** The heater's axis and frame: f.o its foot on its axis, f.u up along it, f.a out from the glass
 *  (its front, towards the bowl's middle). Leaning with the glass, as a heater clipped to a round
 *  bowl's wall does. */
function heaterFrame() {
  const { az, foot, top, off } = HEATER;
  const gB = onGlass(foot, az, 0), gT = onGlass(top, az, 0);
  const u = norm(sub(gT, gB));
  // (In along the glass's meridian, square to the axis.)
  const mid = mul(add(gB, gT), 0.5);
  const inward = norm(sub(mul(u, dot(mid, u)), mid));
  // Stood off so its axis is `off` from the glass at the clips (the glass curves away between).
  const gap = (o) => CLIPS.reduce((s, h) => {
    const p = add(o, mul(u, h));
    // (From the axis out to the glass, along -inward: the sphere's far crossing.)
    const d = mul(inward, -1), b = dot(p, d), c = dot(p, p) - GLASS_INNER * GLASS_INNER;
    return s + (-b + Math.sqrt(b * b - c)) / CLIPS.length;
  }, 0);
  let o = gB;
  for (let k = 0; k < 4; k++) o = add(o, mul(inward, off - gap(o)));
  return frame(o, u, inward);
}

function buildHeater(detail) {
  const mb = new MeshBuilder('heater');
  const f = heaterFrame();
  const sides = Math.max(14, Math.round(40 * detail));
  const at = (h) => add(f.o, mul(f.u, h));
  const G = GUARD;
  // (Occlusion: open on its outside, less in its slots, little deep inside them.)
  const body = (ao) => (i, r, h) => [0, h, 0, ao];
  // Its foot: a rounded end cap, then the guard's lowest band up to the first slots.
  lathe(mb, f, [[0, -0.012], [0.022, -0.0095], [0.036, -0.004], [0.046, 0.005], [0.051, 0.016], [G.r, 0.028], [G.r, 0.045, true], [G.rIn, 0.045, true], [G.rIn, 0.035]], sides, MAT.HEATER, body(0.92));
  // The band across the slots, its outer edges eased.
  const [b0, b1] = G.band;
  lathe(mb, f, [[G.rIn, b0, true], [G.r - 0.0025, b0], [G.r, b0 + 0.0025], [G.r, b1 - 0.0025], [G.r - 0.0025, b1], [G.rIn, b1, true], [G.rIn, b0, true]], sides, MAT.HEATER, body(0.9));
  // The bars between the slots: straight along the heater, their outer faces curved round it and
  // their edges eased (by the normals).
  const pitch = (2 * Math.PI) / G.bars, half = 0.5 * G.fill * pitch;
  for (const [h0, h1] of [[G.slots[0], b0], [b1, G.slots[1]]]) {
    for (let k = 0; k < G.bars; k++) {
      // (A slot faces straight out, under the lamp.)
      const c = (k + 0.5) * pitch;
      const dir = (t) => add(mul(f.a, Math.cos(t)), mul(f.b, Math.sin(t)));
      const along = (t) => add(mul(f.a, -Math.sin(t)), mul(f.b, Math.cos(t)));
      const outer = [], inner = [];
      for (let j = 0; j <= 3; j++) {
        const t = c - half + (2 * half * j) / 3;
        const edge = j === 0 ? -1 : j === 3 ? 1 : 0;
        const n = norm(add(dir(t), mul(along(t), 0.75 * edge)));
        outer.push([mb.vertex(add(at(h0), mul(dir(t), G.r)), [0, h0, 0, 0.9], n), mb.vertex(add(at(h1), mul(dir(t), G.r)), [0, h1, 0, 0.9], n)]);
      }
      for (let j = 0; j + 1 < outer.length; j++) quadFacing(mb, outer[j][0], outer[j + 1][0], outer[j + 1][1], outer[j][1], MAT.HEATER, dir(c - half + (2 * half * (j + 0.5)) / 3));
      for (const t of [c - half, c + half]) inner.push([mb.vertex(add(at(h0), mul(dir(t), G.rIn)), [0, h0, 0, 0.6], mul(dir(t), -1)), mb.vertex(add(at(h1), mul(dir(t), G.rIn)), [0, h1, 0, 0.6], mul(dir(t), -1))]);
      quadFacing(mb, inner[0][0], inner[1][0], inner[1][1], inner[0][1], MAT.HEATER, mul(dir(c), -1));
      // The slot's walls: the bar's sides.
      for (const [t, s] of [[c - half, -1], [c + half, 1]]) {
        const n = mul(along(t), s), lip = norm(add(n, mul(dir(t), 0.6)));
        const v = [mb.vertex(add(at(h0), mul(dir(t), G.rIn)), [0, h0, 0, 0.55], n), mb.vertex(add(at(h0), mul(dir(t), G.r)), [0, h0, 0, 0.75], lip),
          mb.vertex(add(at(h1), mul(dir(t), G.r)), [0, h1, 0, 0.75], lip), mb.vertex(add(at(h1), mul(dir(t), G.rIn)), [0, h1, 0, 0.55], n)];
        quadFacing(mb, v[0], v[1], v[2], v[3], MAT.HEATER, n);
      }
    }
  }
  // The heater's own tube inside the guard (seen through its slots), closed at its foot.
  lathe(mb, f, [[0, 0.03], [G.tube, 0.03, true], [G.tube, 0.4]], sides, MAT.HEATER, () => [1, 0, 0, 0.4]);
  // The cap: a lip over the guard's top, a rounded shoulder and the cord's boot, tapering.
  lathe(mb, f, [[G.rIn, 0.39, true], [G.cap, 0.39, true], [G.cap, 0.394], [G.cap, 0.452], [0.0525, 0.461], [0.048, 0.467], [0.04, 0.4705], [0.022, 0.4725, true],
    [0.0175, 0.475], [0.0165, 0.49], [0.0145, 0.512], [0.0128, 0.522], [0.0105, HEATER_LENGTH, true], [CORD_R, HEATER_LENGTH]], sides, MAT.HEATER, body(0.95));
  // Its light, a small round amber lens standing proud of the cap's front.
  const lens = frame(add(at(LAMP.h), mul(f.a, G.cap - 0.0015)), f.a, f.u);
  lathe(mb, lens, [[LAMP.r, -0.003], [LAMP.r, 0.0006, true], [0.0085, 0.0021], [0.0062, 0.0033], [0.0033, 0.004], [0, 0.0042]], Math.max(10, Math.round(20 * detail)), MAT.HEATER_LAMP, (i, r) => [r / LAMP.r, 0, 0, 1]);
  // The clips (clear plastic, round the guard from behind, open at its front) and the suction cups
  // on the glass that hold them, each pressed flat on the glass where its clip's back faces it.
  const cupSides = Math.max(12, Math.round(32 * detail));
  for (const h of CLIPS) {
    const r0 = G.r + 0.0006, r1 = G.r + 0.0078, w = 0.011, span = [Math.PI - 2.25, Math.PI + 2.25];
    const clip = (i, r) => [1, (r - r0) / (r1 - r0), 0, 0.85];
    lathe(mb, { ...f, o: at(h) }, [[r0, -w, true], [r1, -w, true], [r1, w, true], [r0, w, true], [r0, -w, true]], Math.max(8, Math.round(18 * detail)), MAT.SUCTION, clip, span);
    for (const [t, s] of [[span[0], -1], [span[1], 1]]) {
      const dir = add(mul(f.a, Math.cos(t)), mul(f.b, Math.sin(t)));
      const n = mul(add(mul(f.a, -Math.sin(t)), mul(f.b, Math.cos(t))), s);
      const v = [[r0, -w], [r1, -w], [r1, w], [r0, w]].map(([r, dh]) => mb.vertex(add(at(h + dh), mul(dir, r)), clip(0, r), n));
      quadFacing(mb, v[0], v[1], v[2], v[3], MAT.SUCTION, n);
    }
    // (The clip's back, where the cup's stem goes in, and the glass behind it.)
    const back = add(at(h), mul(f.a, -r1));
    const cup = frame(mul(norm(back), GLASS_INNER - CUP_INSET), mul(norm(back), -1), f.u);
    const stem = GLASS_INNER - CUP_INSET - len(back) + 0.004;
    // (Its face pressed to the glass, seen through it from the far side, then its rim and dome.)
    lathe(mb, cup, [[0, 0], [0.047, 0, true], [0.0466, 0.0024, true], [0.041, 0.006], [0.032, 0.0108], [0.0225, 0.0152], [0.0148, 0.018], [0.0106, 0.0194, true], [0.0086, 0.021], [0.0086, stem]], cupSides, MAT.SUCTION, (i, r) => [0, r / 0.047, 0, 0.7 + 0.25 * smooth(0.047, 0.03, r)]);
  }
  // The cord: up out of its boot, over to the glass and up it, slack a little where nothing holds
  // it, to the rim, where it goes out under the lid.
  const tip = at(HEATER_LENGTH - 0.012);
  const s0 = toSphere(at(HEATER_LENGTH + 0.07));
  const az = HEATER.az;
  const path = [tip, at(HEATER_LENGTH + 0.03), onSphere([s0[0], s0[1] - 0.01, 0.06]), onGlass(0.3, az - 0.03, LINE_INSET), onGlass(0.56, az - 0.07, 0.045), onGlass(0.78, az - 0.1, 0.022), onGlass(0.866, az - 0.11, LINE_INSET)];
  const cord = glassLine(path, Math.max(4, Math.round(12 * detail)), LINE_INSET);
  sweep(mb, cord, CORD_R, Math.max(6, Math.round(9 * detail)), MAT.HEATER, (s) => [2, s, 0, 0.9], true, f.a);
  const obstacles = [
    { a: at(-0.012), b: at(0.48), r: 0.115, solid: 0.064 },
    // (Its cord, where the fish can reach it: up to the film.)
    { a: tip, b: onGlass(0.27, az - 0.025, LINE_INSET), r: 0.063, solid: 0.013 },
  ];
  return { mesh: { ...mb.finish(), onGlass: true }, obstacles };
}

// ---- the sponge filter --------------------------------------------------------------------------------
function buildFilter(detail) {
  const mb = new MeshBuilder('filter');
  const F = FILTER;
  const foot = [F.at[0], BED_LEVEL, F.at[1]];
  // (Its frame: up, and its front towards the bowl's middle.)
  const f = frame(foot, [0, 1, 0], [-F.at[0], 0, -F.at[1]]);
  const sides = Math.max(16, Math.round(48 * detail));
  // The weighted base, sunk a little in the sand, its edge rounded, a shallow seat for the sponge.
  lathe(mb, f, [[0, -0.012], [0.118, -0.012, true], [0.123, -0.004], [F.base, 0.008], [F.base, 0.018], [0.1225, 0.0255], [0.117, F.baseTop - 0.001], [0.11, F.baseTop, true], [0, F.baseTop]], sides, MAT.TUBE,
    (i, r, h) => [2, h, 0, h < 0.005 ? 0.55 : 0.88]);
  // The sponge: a coarse foam cylinder, its cut faces a little uneven, its edges worn round. (Its
  // pores are its material's: they are far finer than any mesh.)
  const rings = Math.max(10, Math.round(28 * detail));
  const prof = [[F.sponge - 0.004, F.baseTop - 0.002], [F.sponge - 0.001, F.baseTop + 0.004]];
  for (let k = 0; k <= rings; k++) prof.push([F.sponge, F.baseTop + 0.012 + ((F.spongeTop - F.baseTop - 0.026) * k) / rings]);
  prof.push([F.sponge - 0.002, F.spongeTop - 0.006], [F.sponge - 0.009, F.spongeTop - 0.0005], [0.07, F.spongeTop], [0.03, F.spongeTop]);
  const lumpy = (p, n) => {
    // (Its unevenness: fixed to the bowl's frame, the same at any detail; flattened where it sits on
    // the base, and less on the top, a flatter cut.)
    const up = p[1] - BED_LEVEL;
    const k = smooth(F.baseTop, F.baseTop + 0.02, up) * (n[1] > 0.7 ? 0.5 : 1);
    const d = 0.0028 * fbm3(p[0] * 38, p[1] * 38, p[2] * 38, 3) + 0.0018 * noise3(p[0] * 11 + 3.1, p[1] * 7, p[2] * 11);
    return add(p, mul(n, d * k));
  };
  // (Occlusion: darker low down, by the base, and on its top round the cap.)
  lathe(mb, f, prof, Math.max(20, Math.round(64 * detail)), MAT.SPONGE, (i, r, h) => [0, h - F.baseTop, 0, r < 0.06 ? 0.75 : 0.62 + 0.33 * smooth(F.baseTop, F.baseTop + 0.08, h)], null, lumpy);
  // Its top cap and the lift tube rising from it, open at the top (dark down inside).
  const t = F.tube, tIn = t - 0.0055;
  lathe(mb, f, [[0, F.spongeTop - 0.006], [0.043, F.spongeTop - 0.006, true], [0.0445, F.spongeTop + 0.002], [0.0445, F.spongeTop + 0.008], [0.041, F.spongeTop + 0.0125], [0.034, F.spongeTop + 0.0145, true],
    [0.032, F.spongeTop + 0.0145, true], [0.032, F.spongeTop + 0.026], [0.0295, F.spongeTop + 0.029, true], [t, F.spongeTop + 0.029, true], [t, F.tubeTop - 0.004], [t - 0.0012, F.tubeTop - 0.0004], [t - 0.003, F.tubeTop, true],
    [tIn + 0.001, F.tubeTop, true], [tIn, F.tubeTop - 0.0015], [tIn, F.tubeTop - 0.06, true], [0, F.tubeTop - 0.06]], Math.max(14, Math.round(32 * detail)), MAT.TUBE,
  (i, r, h) => (i >= 14 ? [1, h, 0, 0.25 + 0.5 * smooth(F.tubeTop - 0.05, F.tubeTop, h)] : [0, h, 0, 0.9]));
  // The airline: from a sleeve on the lift tube's side near its top, straight back to the glass
  // behind it (sagging a little on its way across), up the glass and out under the lid.
  const back = [0, 0, -1];
  const port = add(foot, [0, F.air, 0]);
  const sleeve = [add(port, mul(back, t - 0.004)), add(add(port, mul(back, t + 0.016)), [0, 0.004, 0])];
  sweep(mb, catmull(sleeve, 3), AIRLINE_R + 0.0024, Math.max(8, Math.round(12 * detail)), MAT.TUBE, (s) => [4, s, 0, 0.85], true, [0, 1, 0]);
  const az = Math.atan2(-Math.sqrt(GLASS_INNER * GLASS_INNER - F.at[0] * F.at[0]), F.at[0]);
  const path = [add(port, mul(back, t + 0.004)), add(add(port, mul(back, t + 0.045)), [0, 0.006, 0]), add(add(port, mul(back, 0.17)), [0, -0.012, 0]), onGlass(0.02, az, 0.03),
    onGlass(0.3, az - 0.03, LINE_INSET), onGlass(0.56, az - 0.07, 0.045), onGlass(0.78, az - 0.09, 0.022), onGlass(0.866, az - 0.095, LINE_INSET)];
  const line = glassLine(path, Math.max(4, Math.round(12 * detail)), LINE_INSET);
  sweep(mb, line, AIRLINE_R, Math.max(6, Math.round(9 * detail)), MAT.TUBE, (s) => [3, s, 0, 0.9], true, [0, 1, 0]);
  const obstacles = [
    // (The sponge and its base, standing in the sand, and the lift tube; the airline up to the film.)
    { a: add(foot, [0, -0.01, 0]), b: add(foot, [0, F.spongeTop, 0]), r: 0.158, solid: 0.108 },
    { a: add(foot, [0, F.spongeTop, 0]), b: add(foot, [0, F.tubeTop, 0]), r: 0.08, solid: 0.03 },
    { a: port, b: onGlass(0.27, az - 0.025, LINE_INSET), r: 0.064, solid: 0.014 },
  ];
  return { mesh: { ...mb.finish(), onGlass: true }, obstacles, bubbles: { at: add(foot, [0, F.tubeTop - 0.01, 0]), ...BUBBLES } };
}

/**
 * The heater and the sponge filter, a mesh each, the room the fish leaves round them, and the
 * filter's air: `bubbles` { at: the lift tube's mouth, rate: a second, radius } (the page lets them
 * go there). detail scales their tessellation (1; 0.5, for phones: about two fifths of the
 * triangles); their shapes, places, materials' attributes, obstacles and bubbles are the same at
 * any detail.
 * @returns {import('./mesh.mjs').ScapePiece & { bubbles: { at: V3, rate: number, radius: number } }}
 */
export function build(options = { detail: 1 }) {
  // (Anything but a finite number, or no options at all, is full detail.)
  const detail = Number.isFinite(options?.detail) ? Math.min(Math.max(options.detail, 0.25), 2) : 1;
  const heater = buildHeater(detail);
  const filter = buildFilter(detail);
  return { meshes: [heater.mesh, filter.mesh], obstacles: [...heater.obstacles, ...filter.obstacles], bubbles: filter.bubbles };
}

// ---- the materials ------------------------------------------------------------------------------
/** The heater's black plastic (its guard and caps satin, its tube behind the slots a little paler
 *  and smoother, its cord a matte rubber); its light, an amber lens lit from within, brightest at
 *  its middle, while the heater heats (scapeHeaterLamp, set by globes_shade: water/effects.ts
 *  heaterLamp; off, the lens dark); the filter's foam, its plastic and its tubing; the clear soft
 *  suction cups and clips. */
export const WGSL = /* wgsl */ `
var<private> scapeHeaterLamp: f32 = 1.0;

fn scape_mat_heater(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let tube = attrs.x > 0.5 && attrs.x < 1.5;
  let cord = attrs.x > 1.5;
  m.albedo = select(select(vec3f(0.0135, 0.014, 0.0155), vec3f(0.021, 0.022, 0.024), tube), vec3f(0.0095, 0.0095, 0.01), cord);
  m.n = n;
  m.rough = select(select(0.38, 0.24, tube), 0.55, cord);
  m.spec = 0.045;
  m.ao = clamp(attrs.w, 0.0, 1.0);
  return m;
}

fn scape_mat_heaterLamp(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  m.albedo = vec3f(0.45, 0.1, 0.005);
  m.n = n;
  m.rough = 0.12;
  m.spec = 0.05;
  m.ao = 1.0;
  m.glow = vec3f(1.0, 0.28, 0.02) * (0.35 + 1.5 * (1.0 - smoothstep(0.0, 0.85, attrs.x))) * scapeHeaterLamp;
  return m;
}

// The sponge: coarse open-cell foam, black, browned a little low down where the mulm settles. Its
// pores (~1.5 mm) round holes of many sizes (the cut passes through them at any depth), darkest at
// their middles, dimmer struts further in seen down them; between them the struts, palest where
// they meet; and here and there a larger void. Each faded to its mean where a pixel grows past it
// (the means measured). Matte, the struts with a faint sheen.
fn scape_mat_sponge(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let aa = max(foot, 1e-6);
  // (How much of the surface is strut here, how deep a hole, how much strut further in.)
  var strut = 0.09;
  var hole = 0.37;
  var deep = 0.22;
  for (var o = scapeZero; o < 3; o++) {
    let k = select(170.0, 55.0, o == 2);
    let seen = 1.0 - smoothstep(0.3 / k, 0.8 / k, aa);
    if (seen <= 0.0) { continue; }
    let c = scape_cells3(p * k + vec3f(f32(o) * 5.3));
    let e = c.y - c.x;
    if (o == 0) {
      let meet = 0.4 + 0.6 * (1.0 - smoothstep(0.02, 0.15 + aa * k, e));
      strut = mix(strut, smoothstep(0.58, 0.8, c.x) * meet * (0.3 + 0.7 * fract(c.z * 13.0)), seen);
      hole = mix(hole, 1.0 - smoothstep(0.3, 0.62, c.x), seen);
    } else if (o == 1) {
      deep = mix(deep, smoothstep(0.55, 0.78, c.x), seen);
    } else {
      // (A larger void: one coarse cell in five, its middle.)
      let big = select(0.0, smoothstep(0.1, 0.35, e), c.z > 0.8) * seen;
      hole = max(hole, big);
      strut *= 1.0 - big;
      deep *= 1.0 - 0.7 * big;
    }
  }
  let low = 1.0 - smoothstep(0.0, 0.09, attrs.y);
  let c = mix(vec3f(0.022, 0.022, 0.021), vec3f(0.036, 0.029, 0.021), 0.6 * low);
  m.albedo = c * ((1.0 - 0.85 * hole) * (1.0 + 0.6 * deep) + 1.6 * strut);
  m.n = n;
  // (Light caught in a hole stays there: no sheen off it.)
  m.rough = 0.9 - 0.25 * strut;
  m.spec = 0.025 * (1.0 - 0.9 * hole);
  m.ao = clamp(attrs.w, 0.0, 1.0) * (1.0 - 0.6 * hole);
  return m;
}

fn scape_mat_tube(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let part = u32(attrs.x + 0.5);
  m.albedo = vec3f(0.012, 0.0125, 0.0135) * select(select(1.0, 0.35, part == 1u), 1.4, part == 2u);
  m.n = n;
  m.rough = select(0.3, 0.52, part == 3u);
  m.spec = 0.045;
  m.ao = clamp(attrs.w, 0.0, 1.0);
  return m;
}

// The cups: soft clear PVC, seen as a pale milky grey-green, clearer and thinner towards a cup's
// rim (more of what is behind it shows through). The clips: harder clear plastic round the black
// heater, seen as its dark through them. Both glossy.
fn scape_mat_suction(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let clip = attrs.x > 0.5;
  let rim = select(attrs.y, 1.0, clip);
  m.albedo = mix(vec3f(0.34, 0.39, 0.37), vec3f(0.22, 0.27, 0.26), rim) * select(1.0, 0.35, clip);
  m.n = n;
  m.rough = select(0.22, 0.12, clip);
  m.spec = 0.04;
  m.trans = vec3f(0.2, 0.25, 0.24) * (0.3 + 0.5 * rim);
  m.ao = clamp(attrs.w, 0.0, 1.0);
  return m;
}
`;
