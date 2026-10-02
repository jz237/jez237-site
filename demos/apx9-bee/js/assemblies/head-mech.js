// APX-9 head: mechanical detail helpers shared by the interior modules (frame, neural processor, neck, mandibles).
// Everything here is pure geometry: no parts are created. Geometries are built in world (bee) coordinates by the callers,
// collected per material key in a Bag and written into a leaf with one merged mesh per material.
import * as THREE from 'three';
import { cyl, box, plate, shape, circlePts, crease, S, sphere, revolve } from '../geo.js';
import { mergeAll, boltField } from './head-util.js';

export const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const _up = new THREE.Vector3(0, 1, 0);
export const nrm3 = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const mul3 = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const len3 = (a) => Math.hypot(a[0], a[1], a[2]);
export const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** quaternion rotating +Y onto dir */
export const qY = (dir) => new THREE.Quaternion().setFromUnitVectors(_up, V(nrm3(dir)));
/** quaternion from an orthonormal basis (columns ax, ay, az) */
export const qBasis = (ax, ay, az) => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(ax), V(ay), V(az)));

/** clone + transform: p position, q quaternion or e Euler [x,y,z] radians, s uniform number or [sx,sy,sz] (positive only) */
export function T(g, { p = [0, 0, 0], q = null, e = null, s = 1 } = {}) {
  const c = g.clone();
  const qq = q || (e ? new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0], e[1], e[2])) : new THREE.Quaternion());
  const ss = typeof s === 'number' ? new THREE.Vector3(s, s, s) : V(s);
  c.applyMatrix4(new THREE.Matrix4().compose(V(p), qq, ss));
  return c;
}
/** transform by a Matrix4 */
export function TM(g, m) { const c = g.clone(); c.applyMatrix4(m); return c; }

export function flipWinding(g) {
  const ix = g.index;
  if (ix) { const a = ix.array; for (let i = 0; i < a.length; i += 3) { const t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t; } ix.needsUpdate = true; return g; }
  for (const k of Object.keys(g.attributes)) {
    const at = g.attributes[k], s = at.itemSize, a = at.array;
    for (let i = 0; i + 2 < at.count; i += 3) for (let c = 0; c < s; c++) { const t = a[(i + 1) * s + c]; a[(i + 1) * s + c] = a[(i + 2) * s + c]; a[(i + 2) * s + c] = t; }
    at.needsUpdate = true;
  }
  return g;
}
/** mirror across z = 0 (keeps normals and winding consistent) */
export function mirZ(g) { const c = g.clone(); c.scale(1, 1, -1); return flipWinding(c); }

const _xz = new THREE.Matrix4().set(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
/**
 * plate extruded along +X from x0 by `depth`: the shape lives in the (bee z, bee y) plane (shape x = bee z, shape y = bee y).
 * Use shape coordinates (z, y) for outlines read off a side-on x-slab map. opts are the plate() options.
 */
export function extrudeX(shp, x0, depth, opts = {}) {
  const g = plate(shp, depth, opts);
  g.applyMatrix4(_xz);
  g.translate(x0, 0, 0);
  return flipWinding(g);
}
/**
 * plate extruded along +Z from z0 by `depth` with the shape in the (bee x, bee y) plane (a side-on outline); same as plate()
 * plus the z offset.
 */
export function extrudeZ(shp, z0, depth, opts = {}) {
  const g = plate(shp, depth, opts);
  g.translate(0, 0, z0);
  return g;
}

/** orient a geometry that was extruded along +Z (plate) so the extrusion axis becomes 'x' | 'y' | 'z' */
export function zTo(g, axis) {
  if (axis === 'x') g.rotateY(Math.PI / 2);
  else if (axis === 'y') g.rotateX(-Math.PI / 2);
  else if (axis === '-x') g.rotateY(-Math.PI / 2);
  return g;
}

/**
 * Closed tube (annulus section) about +Y (or `axis`) with a real inner wall. geo.cyl/cone with rIn leave the bore open
 * (the lathe profile is not closed), which looks see-through from inside, so rings and sleeves use these instead.
 */
export function tubeCyl(r, rIn, h, { bevel = 0.04, bevelIn = 0.03, segments = 48, axis = 'y', y0 = -h / 2, steps = 2 } = {}) {
  const w = (r - rIn) * 0.45, b = Math.min(bevel, w, h * 0.45), bi = Math.min(bevelIn, w, h * 0.45), ym = y0 + h / 2;
  return revolve([[rIn, ym], [rIn, y0, bi], [r, y0, b], [r, y0 + h, b], [rIn, y0 + h, bi], [rIn, ym]], { segments, steps, axis });
}
/** conical tube: outer radii r0 (at y0) -> r1 (at y0+h), inner radii ri0 -> ri1 */
export function tubeCone(r0, r1, ri0, ri1, h, { bevel = 0.03, segments = 48, axis = 'y', y0 = -h / 2, steps = 2 } = {}) {
  const ym = y0 + h / 2, rm = (ri0 + ri1) / 2;
  return revolve([[rm, ym], [ri0, y0, bevel * 0.6], [r0, y0, bevel], [r1, y0 + h, bevel], [ri1, y0 + h, bevel * 0.6], [rm, ym]], { segments, steps, axis });
}

/* ================================================================================================ material bag */
/** collects geometries per material key and writes one merged mesh per material into a part */
export class Bag {
  constructor() { this.m = new Map(); }
  add(key, g) { if (g) { if (!this.m.has(key)) this.m.set(key, []); this.m.get(key).push(g); } return this; }
  /** add a geometry transformed by `xf` (Matrix4) */
  addAt(key, g, xf) { return this.add(key, xf ? TM(g, xf) : g); }
  flush(part, M) {
    for (const [k, list] of this.m) { const g = mergeAll(list); if (g) part.add(g, typeof k === 'string' ? M[k] : k); }
    return part;
  }
}

/* ================================================================================================ sections / loft */
export const secCircle = (r, k = 16) => Array.from({ length: k }, (_, j) => { const a = j / k * Math.PI * 2; return [Math.cos(a) * r, Math.sin(a) * r]; });
export const secEllipse = (a, b, k = 16) => Array.from({ length: k }, (_, j) => { const t = j / k * Math.PI * 2; return [Math.cos(t) * a, Math.sin(t) * b]; });
/** rounded rectangle (counter-clockwise), half sizes hw, hh, corner radius r, k segments per corner */
export function secRRect(hw, hh, r = 0.05, k = 3) {
  const out = [];
  const rr = Math.min(r, hw, hh);
  const corners = [[hw - rr, hh - rr, 0], [-hw + rr, hh - rr, 90], [-hw + rr, -hh + rr, 180], [hw - rr, -hh + rr, 270]];
  for (const [cx, cy, a0] of corners) for (let i = 0; i <= k; i++) { const a = (a0 + (k ? 90 * i / k : 45)) * Math.PI / 180; out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return out;
}

/**
 * Loft a closed section along a path. sec(u) -> [[a, b], ...] counter-clockwise in the (N, B) plane (N = `up` made
 * perpendicular to the path, B = T x N); every u must return the same number of points. Returns a creased geometry.
 */
export function loft(path, sec, { n = 28, up = [0, 1, 0], caps = true, creaseDeg = 55 } = {}) {
  const curve = path.isCurve ? path : new THREE.CatmullRomCurve3(path.map((p) => (p.isVector3 ? p : V(p))), false, 'centripetal');
  const len = curve.getLength();
  const first = sec(0);
  let area = 0;
  for (let j = 0; j < first.length; j++) { const p = first[j], q = first[(j + 1) % first.length]; area += p[0] * q[1] - q[0] * p[1]; }
  const flip = area < 0;
  const m = first.length;
  const pos = [], uv = [], idx = [];
  const U = V(up), alt = new THREE.Vector3(0, 0, 1), N = new THREE.Vector3(), B = new THREE.Vector3(), c = new THREE.Vector3(), t = new THREE.Vector3();
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    curve.getPointAt(u, c); curve.getTangentAt(u, t); t.normalize();
    N.copy(U).addScaledVector(t, -U.dot(t));
    if (N.lengthSq() < 1e-4) N.copy(alt).addScaledVector(t, -alt.dot(t));
    N.normalize(); B.crossVectors(t, N);
    let s = sec(u);
    if (flip) s = s.slice().reverse();
    for (let j = 0; j < m; j++) {
      pos.push(c.x + N.x * s[j][0] + B.x * s[j][1], c.y + N.y * s[j][0] + B.y * s[j][1], c.z + N.z * s[j][0] + B.z * s[j][1]);
      uv.push(u * len * 0.5, j / m * 2);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const a = i * m + j, b = i * m + (j + 1) % m, cc = (i + 1) * m + (j + 1) % m, d = (i + 1) * m + j;
    idx.push(a, b, cc, a, cc, d);
  }
  if (caps) {
    for (const end of [0, 1]) {
      const base = (end ? n : 0) * m;
      let cx = 0, cy = 0, cz = 0;
      for (let j = 0; j < m; j++) { cx += pos[(base + j) * 3]; cy += pos[(base + j) * 3 + 1]; cz += pos[(base + j) * 3 + 2]; }
      const ci = pos.length / 3;
      pos.push(cx / m, cy / m, cz / m); uv.push(end ? len * 0.5 : 0, 0);
      for (let j = 0; j < m; j++) { const a = base + j, b = base + (j + 1) % m; if (end) idx.push(ci, a, b); else idx.push(ci, b, a); }
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return crease(g, creaseDeg);
}
/** round tube (radius number or r(u)) along a path */
export const tube = (path, r, { radial = 12, n = 28, caps = true } = {}) => loft(path, (u) => secCircle(typeof r === 'function' ? r(u) : r, S(radial, 6)), { n, caps, up: [0.3, 1, 0.2] });

/** a simple S-curve / arc point list between two points with a control offset (for cables) */
export function bowPath(a, b, bow = [0, 0, 0], n = 8, sag = 0) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, s = Math.sin(t * Math.PI);
    const p = lerp3(a, b, t);
    pts.push([p[0] + bow[0] * s, p[1] + bow[1] * s - sag * s, p[2] + bow[2] * s]);
  }
  return pts;
}

/* ================================================================================================ rings and bolts */
/** ring plate (annulus) with optional through holes, extruded along `axis` ('x'|'y'|'z'), centred at the origin */
export function ringPlate({ rOut, rIn, depth, holes = [], bevel = 0.04, seg = 64, axis = 'z', notches = 0 }) {
  const outer = circlePts(rOut, S(seg, 24));
  const hs = [circlePts(rIn, S(seg, 24))];
  for (const h of holes) hs.push(circlePts(h.r, 14, h.x, h.y));
  void notches;
  const g = plate(shape(outer, hs, { steps: 2 }), depth, { bevel, center: true, steps: 2, bevelSegments: 2 });
  return zTo(g, axis);
}
/** socket / pan screws on a circle: centre c, axis (outward normal of the bolted face), radius r */
export function boltCircle({ c = [0, 0, 0], axis = [1, 0, 0], r = 1, n = 8, phase = 0, kind = 'pan', br = 0.12, lift = 0 }) {
  const ax = nrm3(axis);
  const ref = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const a1 = nrm3(cross3(ax, ref)), a2 = cross3(ax, a1);
  const items = [];
  for (let i = 0; i < n; i++) {
    const a = phase + i / n * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    items.push({
      p: [c[0] + ax[0] * lift + (a1[0] * ca + a2[0] * sa) * r, c[1] + ax[1] * lift + (a1[1] * ca + a2[1] * sa) * r, c[2] + ax[2] * lift + (a1[2] * ca + a2[2] * sa) * r],
      n: ax, spin: a,
    });
  }
  return boltField(items, { kind, r: br });
}
/** bolts at explicit points sharing one outward normal */
export function boltsAt(pts, axis, { kind = 'pan', br = 0.12 } = {}) {
  return boltField(pts.map((p, i) => ({ p, n: axis, spin: i * 1.3 })), { kind, r: br });
}

/** coil spring between two points (+Y spring rotated onto the segment) */
export function springBetween(springGeo, a, b) {
  const d = sub3(b, a);
  return T(springGeo, { p: lerp3(a, b, 0.5), q: qY(d) });
}

/** cylinder (bevelled) between two points; optional bore */
export function rod(a, b, r, { bevel = Math.min(r * 0.25, 0.04), rIn = 0, segments = 24 } = {}) {
  const d = sub3(b, a), l = len3(d);
  return T(cyl(r, l, { bevel, rIn, segments }), { p: lerp3(a, b, 0.5), q: qY(d) });
}
/** bevelled box between two points: length along the segment, cross-section w (in `side` direction) x h */
export function bar(a, b, w, h, { bevel = 0.03, side = [0, 0, 1] } = {}) {
  const d = nrm3(sub3(b, a)), l = len3(sub3(b, a));
  let s = sub3(side, mul3(d, dot3(side, d)));
  if (len3(s) < 1e-4) s = [0, 1, 0];
  s = nrm3(s);
  const t = cross3(d, s);
  const g = box(l, w, h, bevel);                // x along the bar, y = w, z = h
  return T(g, { p: lerp3(a, b, 0.5), q: qBasis(d, s, t) });
}

/* ================================================================================================ components */
/**
 * IC package. Local frame: base on y = 0 facing +Y, footprint w (x) by d (z), height h.
 * pins: 'gull' leads on both long sides, 'quad' leads on four sides, 'bga' none.
 */
export function chip(bag, xf, { w = 1, d = 1, h = 0.12, pins = 'bga', pitch = 0.1, body = 'black', lead = 'steel', dot = true, bevel = 0.02 } = {}) {
  bag.addAt(body, T(box(w, h, d, bevel), { p: [0, h / 2 + 0.01, 0] }), xf);
  if (pins === 'gull' || pins === 'quad') {
    const nx = Math.max(2, Math.floor((w - 0.1) / pitch)), nz = Math.max(2, Math.floor((d - 0.1) / pitch));
    const leads = [];
    const lg = box(0.05, 0.02, 0.1, 0.004);
    const lg2 = box(0.1, 0.02, 0.05, 0.004);
    for (let i = 0; i < nx; i++) {
      const x = -w / 2 + 0.05 + (i + 0.5) * (w - 0.1) / nx;
      leads.push(T(lg2, { p: [x, 0.025, d / 2 + 0.03] }), T(lg2, { p: [x, 0.025, -d / 2 - 0.03] }));
    }
    if (pins === 'quad') for (let i = 0; i < nz; i++) {
      const z = -d / 2 + 0.05 + (i + 0.5) * (d - 0.1) / nz;
      leads.push(T(lg, { p: [w / 2 + 0.03, 0.025, z] }), T(lg, { p: [-w / 2 - 0.03, 0.025, z] }));
    }
    for (const l of leads) bag.addAt(lead, l, xf);
  }
  if (dot) bag.addAt(lead, T(cyl(Math.min(w, d) * 0.07, 0.012, { bevel: 0.002, segments: 10 }), { p: [-w / 2 + Math.min(w, d) * 0.2, h + 0.012, -d / 2 + Math.min(w, d) * 0.2] }), xf);
}

/** stack of hex standoff + screw heads, axis +Y at origin, total length l */
export function standoff(bag, xf, { l = 0.5, r = 0.16, screwR = 0.1, bodyKey = 'brass', screwKey = 'steel' } = {}) {
  const hex = new THREE.CylinderGeometry(r, r, l, 6, 1);
  hex.translate(0, l / 2, 0);
  bag.addAt(bodyKey, crease(hex.toNonIndexed(), 30), xf);
  bag.addAt(screwKey, T(cyl(screwR, 0.07, { bevel: 0.02, segments: 12 }), { p: [0, l + 0.035, 0] }), xf);
}

/** servo: body (black) + flange (steel) + output boss and horn (brass/steel) + 4 ear screws, local frame: output shaft +Y, base at y=0 */
export function servo(bag, xf, { w = 1.5, d = 0.8, h = 1.4, boss = 0.2, ears = true, key = { body: 'black', trim: 'gunmetalDark', metal: 'steel', accent: 'brass' } } = {}) {
  bag.addAt(key.body, T(box(w, h, d, 0.05), { p: [0, h / 2, 0] }), xf);
  // top cap with output boss offset to one end (like a hobby servo)
  bag.addAt(key.trim, T(box(w * 0.98, 0.14, d * 0.98, 0.03), { p: [0, h + 0.07, 0] }), xf);
  const bx = w * 0.28;
  bag.addAt(key.accent, T(cyl(boss * 1.5, 0.2, { bevel: 0.03, segments: 24 }), { p: [bx, h + 0.24, 0] }), xf);
  bag.addAt(key.metal, T(cyl(boss * 0.55, 0.3, { bevel: 0.02, segments: 16 }), { p: [bx, h + 0.4, 0] }), xf);
  if (ears) {
    bag.addAt(key.metal, T(box(w * 1.5, 0.1, d * 0.9, 0.025), { p: [0, h * 0.78, 0] }), xf);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      bag.addAt(key.metal, T(cyl(0.065, 0.045, { bevel: 0.012, segments: 10 }), { p: [sx * w * 0.67, h * 0.78 + 0.07, sz * d * 0.3] }), xf);
    }
  }
  // side label plate and a wire boot
  bag.addAt(key.metal, T(box(w * 0.5, h * 0.4, 0.03, 0.01), { p: [-w * 0.1, h * 0.45, d / 2 + 0.005] }), xf);
}

/** stacked hinge knuckles along +Y centred at origin: n knuckles of radius r, total length len, with a through pin */
export function hinge(bag, xf, { len = 1.2, r = 0.22, n = 3, pinR = 0.07, key = 'steel', pinKey = 'brass', gap = 0.03 } = {}) {
  const kl = (len - gap * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const y = -len / 2 + kl / 2 + i * (kl + gap);
    bag.addAt(key, T(cyl(r * (i % 2 ? 0.94 : 1), kl, { bevel: Math.min(0.03, kl * 0.2), segments: 28, rIn: pinR * 1.1, bevelIn: 0.01 }), { p: [0, y, 0] }), xf);
  }
  bag.addAt(pinKey, T(cyl(pinR, len + 0.1, { bevel: 0.012, segments: 12 }), {}), xf);
  bag.addAt(pinKey, T(cyl(pinR * 1.5, 0.05, { bevel: 0.015, segments: 14 }), { p: [0, len / 2 + 0.07, 0] }), xf);
  bag.addAt(pinKey, T(cyl(pinR * 1.5, 0.05, { bevel: 0.015, segments: 14 }), { p: [0, -len / 2 - 0.07, 0] }), xf);
}

/** hard-wired helper for small spheres (balls, LED domes) */
export const ball = (r, seg = 12) => sphere(r, { segments: seg, rings: Math.max(5, Math.round(seg / 2)) });
