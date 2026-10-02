// Flight assembly helpers shared by flight-*.js (wing mounts + flight drive unit). Millimetres.
// Mount-local frame (matrix K.wing.frameR): x = s along the wing span axis (outboard +), y = lead edge, z = wing normal.
import { THREE, V3, revolve, plate, circlePts, ngonPts, sweep, spring, mergeGeometries, sphere, S, ex } from '../kit.js';

export const TAU = Math.PI * 2;
export const D2R = Math.PI / 180;
const UP = V3(0, 1, 0);

/* ------------------------------------------------------------------ explode helpers */
/** Explode along the mount's span axis (mount-local x). ds in mm, + = outboard. */
export const exS = (ds, level = 'fine', rot = null) => ex([ds, 0, 0], level, rot, 'local');
/** Explode along any parent-local vector. */
export const exL = (v, level = 'fine', rot = null) => ex(v, level, rot, 'local');

/* ------------------------------------------------------------------ revolve helpers */

/** Revolve about the mount's local X axis. profile points [r, s, fillet?], counter-clockwise in (r, s). */
export const rx = (profile, o = {}) => revolve(profile, { axis: 'x', ...o });

/**
 * Closed loop (tube / race / ring) revolved about an axis. The loop is given counter-clockwise; it starts and
 * ends at the midpoint of the closing edge so that EVERY corner receives its fillet radius.
 */
export function loopRev(pts, o = {}) {
  const a = pts[pts.length - 1], b = pts[0];
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return revolve([m, ...pts, m], o);
}
export const loopX = (pts, o = {}) => loopRev(pts, { axis: 'x', ...o });

/** Sample an arc in the (r, s) plane: centre (cr, cs), radius rad, from angle a0 to a1 (radians), n steps. */
export function arcPts(cr, cs, rad, a0, a1, n = 6) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cr + Math.cos(a) * rad, cs + Math.sin(a) * rad]); }
  return out;
}

/**
 * Concentric square-section ridges across a flat annular face, walking from rA to rB (either direction) at base level s0;
 * n ridges of height h (sign = direction), gaps and ridges of equal width. Points are [r, s, fillet].
 */
export function ridgePts(rA, rB, s0, h, n, f = 0.012) {
  const out = [];
  const J = 2 * n + 1;
  const b = (j) => rA + (rB - rA) * j / J;
  out.push([b(0), s0, 0]);
  for (let k = 0; k < n; k++) {
    out.push([b(2 * k + 1), s0, f], [b(2 * k + 1), s0 + h, f], [b(2 * k + 2), s0 + h, f], [b(2 * k + 2), s0, f]);
  }
  out.push([b(J), s0, 0]);
  return out;
}

/* ------------------------------------------------------------------ plates in the mount frame */

const PX = new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
/**
 * Plate whose outline lives in the (Y, Z) plane of the mount frame (shape x -> +Y, shape y -> +Z) and whose thickness
 * runs along +X from s=0 (or centred with {center:true}). Same options as geo.plate().
 */
export function plateX(pts, depth, o = {}) {
  const g = plate(pts, depth, o);
  g.applyMatrix4(PX);
  return g;
}

/** Re-orient a geometry built in XY with thickness along Z (spiralBand, gearPlate) into the mount's (Y, Z) plane, thickness along +X. */
export function toMountX(g) {
  g.applyMatrix4(PX);
  return g;
}

const PY = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
/** Plate lying horizontally: outline in (X, Z) with shape y -> -Z, thickness along +Y from 0 (or centred). */
export function plateY(pts, depth, o = {}) {
  const g = plate(pts, depth, o);
  g.applyMatrix4(PY);
  return g;
}

const PZ = new THREE.Matrix4().set(0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
/** Plate standing in the (Z, Y) plane: outline x -> +Z, outline y -> +Y; the thickness runs along -X from the plane x = 0 (move it with translate). */
export function plateZ(pts, depth, o = {}) {
  const g = plate(pts, depth, o);
  g.applyMatrix4(PZ);
  return g;
}

/* ------------------------------------------------------------------ 2D point helpers */

export const shiftPts = (pts, x, y) => pts.map((p) => (p.length > 2 ? [p[0] + x, p[1] + y, p[2]] : [p[0] + x, p[1] + y]));
export const rotPts = (pts, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map((p) => (p.length > 2 ? [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]] : [p[0] * c - p[1] * s, p[0] * s + p[1] * c])); };
export const circ = (r, n, cx = 0, cy = 0) => circlePts(r, S(n, 10), cx, cy);

/** Rounded rectangle outline (w x h, corner radius r) centred on the origin. */
export const rrect = (w, h, r) => [[-w / 2, -h / 2, r], [w / 2, -h / 2, r], [w / 2, h / 2, r], [-w / 2, h / 2, r]];

/** Annular sector outline between radii rIn..rOut from angle a0 to a1 (radians); closed polygon. */
export function sectorPts(rIn, rOut, a0, a1, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([Math.cos(a) * rOut, Math.sin(a) * rOut]); }
  for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; out.push([Math.cos(a) * rIn, Math.sin(a) * rIn]); }
  return out;
}

/** Annular window / board outline between radii rIn..rOut and angles a0..a1 with rounded corners (fillet radius rc). */
export function sectorWin(rIn, rOut, a0, a1, n = 8, rc = 0.03) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([Math.cos(a) * rOut, Math.sin(a) * rOut, i === 0 || i === n ? rc : 0]); }
  for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; out.push([Math.cos(a) * rIn, Math.sin(a) * rIn, i === 0 || i === n ? rc : 0]); }
  return out;
}

/** Stadium / slot outline between two centres with radius r (counter-clockwise). */
export function slotPts(x0, y0, x1, y1, r, n = 8) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a - Math.PI / 2 + Math.PI * i / n; out.push([x1 + Math.cos(t) * r, y1 + Math.sin(t) * r]); }
  for (let i = 0; i <= n; i++) { const t = a + Math.PI / 2 + Math.PI * i / n; out.push([x0 + Math.cos(t) * r, y0 + Math.sin(t) * r]); }
  return out;
}

/** Spur-gear outline with narrow teeth that really mesh: tip half-width tipW and root half-width rootW in pitch units. */
export function gearPts(N, rTip, rRoot, { tipW = 0.13, rootW = 0.30, phase = 0 } = {}) {
  const out = [];
  const p = TAU / N;
  for (let i = 0; i < N; i++) {
    const a = phase + i * p;
    out.push([Math.cos(a - rootW * p) * rRoot, Math.sin(a - rootW * p) * rRoot]);
    out.push([Math.cos(a - tipW * p) * rTip, Math.sin(a - tipW * p) * rTip]);
    out.push([Math.cos(a + tipW * p) * rTip, Math.sin(a + tipW * p) * rTip]);
    out.push([Math.cos(a + rootW * p) * rRoot, Math.sin(a + rootW * p) * rRoot]);
  }
  return out;
}
/** Extruded spur gear in XY (thickness along Z, centred), optional bore / lightening holes. */
export function gearPlate(N, rTip, rRoot, depth, { bore = 0, holes = [], bevel = 0.02, tipW, rootW, phase = 0, center = true } = {}) {
  const hs = holes.slice();
  if (bore > 0) hs.push(circlePts(bore, S(16, 8)));
  return plate(gearPts(N, rTip, rRoot, { tipW, rootW, phase }), depth, { bevel, bevelSegments: 1, steps: 2, holes: hs, center, creaseDeg: 45 });
}

/** Scalloped / fluted outline: N flutes of depth `amp` on radius r (knurled drums, ribbed cans). */
export function flutePts(N, r, amp, per = 4) {
  const out = [];
  const n = N * per;
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU;
    const k = 0.5 + 0.5 * Math.cos(a * N);
    out.push([Math.cos(a) * (r - amp * (1 - k)), Math.sin(a) * (r - amp * (1 - k))]);
  }
  return out;
}

/** n round holes on a circle (polygon holes for geo.plate). */
export function holeRing(n, R, r, phase = 0, seg = 14) {
  const hs = [];
  for (let i = 0; i < n; i++) { const a = phase + i / n * TAU; hs.push(circlePts(r, S(seg, 8), Math.cos(a) * R, Math.sin(a) * R)); }
  return hs;
}

/* ------------------------------------------------------------------ placement */

/** Matrix placing a +Y-axis geometry at p with its axis along n, rolled about its own axis, uniform/vector scale s. */
export function mAt(p, n = [0, 1, 0], roll = 0, s = 1) {
  const nn = Array.isArray(n) ? V3(n[0], n[1], n[2]) : n.clone();
  nn.normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, nn);
  if (roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, roll));
  const sc = typeof s === 'number' ? V3(s, s, s) : V3(s[0], s[1], s[2]);
  return new THREE.Matrix4().compose(V3(p[0], p[1], p[2]), q, sc);
}

/** Matrix from an origin and three basis vectors (arrays): shape x -> ex, shape y -> ey, extrusion axis -> ez. */
export function basisM(o, ex, ey, ez) {
  return new THREE.Matrix4().makeBasis(V3(...ex), V3(...ey), V3(...ez)).setPosition(o[0], o[1], o[2]);
}

/** Matrices for n fasteners on a circle about X: axis along +/-X (dir), at axial s, radius R. */
export function ringAxial(n, R, s, dir = 1, phase = 0, roll = 0) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = phase + i / n * TAU;
    out.push(mAt([s, Math.cos(a) * R, Math.sin(a) * R], [dir, 0, 0], roll + a));
  }
  return out;
}

/** Matrices for n items on a circle about X pointing radially outward (set screws). */
export function ringRadial(n, R, s, phase = 0) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = phase + i / n * TAU;
    out.push(mAt([s, Math.cos(a) * R, Math.sin(a) * R], [0, Math.cos(a), Math.sin(a)], 0));
  }
  return out;
}

/** Plain translate / rotate matrix from position and euler degrees. */
export function xfm(p, rotDeg = [0, 0, 0], s = 1) {
  const e = new THREE.Euler(rotDeg[0] * D2R, rotDeg[1] * D2R, rotDeg[2] * D2R, 'XYZ');
  const sc = typeof s === 'number' ? V3(s, s, s) : V3(s[0], s[1], s[2]);
  return new THREE.Matrix4().compose(V3(p[0], p[1], p[2]), new THREE.Quaternion().setFromEuler(e), sc);
}

/* ------------------------------------------------------------------ fasteners (head up +Y, base at y = 0) */

const nonIdx = (g) => (g.index ? g.toNonIndexed() : g);
export const mergeG = (list) => mergeGeometries(list.map(nonIdx), false);

/** Lazily built (detail.seg is only known after import) cache of small fastener geometries. */
export function makeFasteners() {
  const cache = new Map();
  const memo = (k, f) => { let v = cache.get(k); if (!v) { v = f(); cache.set(k, v); } return v; };
  return {
    /** Socket-head cap screw with a hex recess. */
    cap: (r = 0.12) => memo('cap' + r, () => {
      const h = r * 1.1;
      const head = plate(circlePts(r, S(16, 10)), h, { bevel: r * 0.16, bevelSegments: 1, holes: [ngonPts(6, r * 0.5, 0)], steps: 1 });
      head.rotateX(-Math.PI / 2);
      const floor = revolve([[r * 0.55, h * 0.35], [0, h * 0.35]], { segments: 8, steps: 1 });
      return mergeG([head, floor]);
    }),
    /** Hex-head bolt with a washer face. */
    hex: (r = 0.14) => memo('hex' + r, () => {
      const h = r * 0.9, wf = r * 0.16;
      const head = plate(ngonPts(6, r, Math.PI / 6), h, { bevel: r * 0.13, bevelSegments: 1, steps: 1 });
      head.rotateX(-Math.PI / 2);
      head.translate(0, wf, 0);
      const face = revolve([[0, 0], [r * 0.86, 0, r * 0.05], [r * 0.86, wf + 0.01], [0, wf + 0.01]], { segments: 14, steps: 1 });
      return mergeG([head, face]);
    }),
    /** Domed button-head screw. */
    button: (r = 0.12) => memo('btn' + r, () => revolve([[0, 0], [r, 0, 0.01], [r, r * 0.16, r * 0.1], [r * 0.9, r * 0.42], [r * 0.5, r * 0.62], [0, r * 0.68]], { segments: 12, steps: 2 })),
    /** Plain round pin / dowel, chamfered both ends. */
    pin: (r = 0.06, h = 0.5) => memo(`pin${r}_${h}`, () => revolve([[0, 0], [r * 0.8, 0], [r, r * 0.2], [r, h - r * 0.2], [r * 0.8, h], [0, h]], { segments: 10, steps: 1 })),
    /** Flat washer with hole about +Y. */
    washer: (ro = 0.2, ri = 0.1, t = 0.04) => memo(`w${ro}_${ri}_${t}`, () => loopRev([[ri, 0, t * 0.2], [ro, 0, t * 0.3], [ro, t, t * 0.3], [ri, t, t * 0.2]], { segments: 18, steps: 1 })),
  };
}

/* ------------------------------------------------------------------ springs, bands, hoses */

/** Coil spring along X (centred on 0). */
export function springX(radius, wire, turns, length, perTurn = 12, radial = 6) {
  const g = spring({ radius, wire, turns, length, perTurn: S(perTurn, 6), radial: S(radial, 5) });
  g.rotateZ(-Math.PI / 2);
  return g;
}

/** Flat spiral (scroll) band lying in XY, thickness along Z, centred. */
export function spiralBand({ turns = 2.4, r0 = 0.18, r1 = 0.9, w = 0.07, t = 0.2, n = 90 } = {}) {
  const outer = [], inner = [];
  const N = S(n, 30);
  for (let i = 0; i <= N; i++) {
    const u = i / N, a = u * turns * TAU, r = r0 + (r1 - r0) * u;
    outer.push([Math.cos(a) * (r + w / 2), Math.sin(a) * (r + w / 2)]);
    inner.push([Math.cos(a) * (r - w / 2), Math.sin(a) * (r - w / 2)]);
  }
  return plate(outer.concat(inner.reverse()), t, { bevel: Math.min(w, t) * 0.22, bevelSegments: 1, center: true, steps: 1 });
}

/** Ribbed (corrugated) tube along a path: the radius oscillates `ribs` times along its length. */
export function ribbedTube(path, { radius = 0.12, ribs = 10, amp = 0.14, radial = 12, caps = true, taper = null, perRib = 6 } = {}) {
  const f = (u) => {
    const base = radius * (1 + amp * (Math.cos(u * ribs * TAU) - 1) * 0.5);
    return taper ? base * taper(u) : base;
  };
  return sweep(path, { radius: f, radial: S(radial, 8), segments: ribs * perRib, caps });
}

/** Ball with sane counts for small spheres. */
export const ball = (r, seg = 14, rings = 10) => sphere(r, { segments: seg, rings });
