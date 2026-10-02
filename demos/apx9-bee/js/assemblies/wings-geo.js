// wings-geo.js - small geometry accumulator for the wing assembly: elliptical tubes along 3-D polylines,
// surfaces of revolution about any axis, facetted bolts and ellipsoid beads, all written into plain arrays
// (position / normal / uv / index) so a whole material's worth of detail becomes ONE geometry.
// Wing frame: x = span, y = toward the leading edge, z = upper-surface normal. Units mm.
import * as THREE from 'three';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

/* ------------------------------------------------------------------ tiny vector helpers (arrays) */
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const madd = (a, b, s) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];

/** Any unit vector perpendicular to n. */
export function perp(n) {
  const a = Math.abs(n[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
  return norm(cross(n, a));
}

/** Resample a polyline so no segment is longer than maxSeg (keeps the original points). */
export function densify(pts, maxSeg) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const n = Math.max(1, Math.ceil(len(sub(b, a)) / maxSeg));
    for (let k = 1; k <= n; k++) out.push(lerp3(a, b, k / n));
  }
  return out;
}

/* ------------------------------------------------------------------ accumulator */
export class GeoBuf {
  constructor() { this.p = []; this.n = []; this.uv = []; this.idx = []; }
  get count() { return this.p.length / 3; }
  get tris() { return this.idx.length / 3; }
  vert(x, y, z, nx, ny, nz, u = 0, v = 0) {
    this.p.push(x, y, z); this.n.push(nx, ny, nz); this.uv.push(u, v);
    return this.p.length / 3 - 1;
  }
  tri(a, b, c) { this.idx.push(a, b, c); }
  /** quad a b c d (counter-clockwise seen from the front). */
  quad(a, b, c, d) { this.idx.push(a, b, d, b, c, d); }
  /** Area-weighted smooth normals for the triangles added since (vStart, iStart). */
  smooth(vStart = 0, iStart = 0) {
    const P = this.p, N = this.n, I = this.idx;
    for (let i = vStart * 3; i < P.length; i++) N[i] = 0;
    for (let t = iStart; t < I.length; t += 3) {
      const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
      const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
      const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (const k of [a, b, c]) { N[k] += nx; N[k + 1] += ny; N[k + 2] += nz; }
    }
    for (let i = vStart * 3; i < P.length; i += 3) {
      const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1;
      N[i] /= l; N[i + 1] /= l; N[i + 2] /= l;
    }
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setIndex(this.count > 65535 ? new THREE.Uint32BufferAttribute(this.idx, 1) : new THREE.Uint16BufferAttribute(this.idx, 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }
}

/* ------------------------------------------------------------------ elliptical tube along a polyline */
/**
 * Sweep an ellipse along `pts` ([x,y,z] list).
 *  r      number | (t, i) => number | [a, b]   a = semi-axis along `side` (up x tangent), b = along `up`
 *  up     [x,y,z] | (p, t, i) => [x,y,z]       reference "up" for the section (the surface normal for veins)
 *  capA / capB   'dome' | 'flat' | 'none'
 *  uTile  mm of path length per u unit (carbon weave)    vTile  v repeats around the section
 *  n      superellipse exponent (number | (t, i) => number): 2 = ellipse, 3-5 = flat ribbon with rounded edges
 */
export function tube(buf, pts, o = {}) {
  const { r = 0.1, sides = 8, up = [0, 0, 1], capA = 'dome', capB = 'dome', uTile = 3, vTile = 1, domeRings = 2, domeLen = 1, twist = 0, n: nExp = 2 } = o;
  const n = pts.length;
  if (n < 2) return;
  // cumulative length
  const cum = [0];
  for (let i = 1; i < n; i++) cum.push(cum[i - 1] + len(sub(pts[i], pts[i - 1])));
  const total = cum[n - 1] || 1;
  const rf = typeof r === 'function' ? r : () => r;
  const nf = typeof nExp === 'function' ? nExp : () => nExp;
  const st = [];
  for (let i = 0; i < n; i++) {
    const t = cum[i] / total;
    const T = norm(i === 0 ? sub(pts[1], pts[0]) : i === n - 1 ? sub(pts[n - 1], pts[n - 2]) : sub(pts[i + 1], pts[i - 1]));
    let U = typeof up === 'function' ? up(pts[i], t, i) : up;
    U = sub(U, mul(T, dot(U, T)));
    if (len(U) < 1e-5) U = perp(T);
    const e2 = norm(U);
    const e1 = norm(cross(e2, T));
    let ab = rf(t, i);
    if (typeof ab === 'number') ab = [ab, ab];
    st.push({ P: pts[i], T, e1, e2, a: ab[0], b: ab[1], u: cum[i] / uTile, ne: nf(t, i) });
  }
  const ring = (s, scale, off, tn, vOff = 0) => {
    // one ring: scale the section, shift along T by `off`, blend the normal toward the tangent by `tn` (0 = pure section normal)
    const id0 = buf.count;
    const A = s.a * scale, B = s.b * scale;
    const C = twist ? Math.cos(twist * s.u) : 1, S = twist ? Math.sin(twist * s.u) : 0;
    const ne = s.ne, sq = ne !== 2, pe = 2 / ne;
    for (let j = 0; j <= sides; j++) {
      const ph = (j / sides) * TAU;
      const cp = Math.cos(ph), sp = Math.sin(ph);
      const c2 = cp * C - sp * S, s2 = cp * S + sp * C;
      // superellipse |x/a|^n + |y/b|^n = 1  (n = 2: ellipse, n > 2: rounded-rectangle ribbon)
      const ux = sq ? Math.sign(c2) * Math.pow(Math.abs(c2), pe) : c2;
      const uy = sq ? Math.sign(s2) * Math.pow(Math.abs(s2), pe) : s2;
      const px = s.P[0] + s.e1[0] * A * ux + s.e2[0] * B * uy + s.T[0] * off;
      const py = s.P[1] + s.e1[1] * A * ux + s.e2[1] * B * uy + s.T[1] * off;
      const pz = s.P[2] + s.e1[2] * A * ux + s.e2[2] * B * uy + s.T[2] * off;
      // section normal in section axes (gradient of the implicit curve)
      let nx, ny;
      if (sq) { nx = Math.sign(ux) * Math.pow(Math.abs(ux), ne - 1) / (s.a || 1e-6); ny = Math.sign(uy) * Math.pow(Math.abs(uy), ne - 1) / (s.b || 1e-6); }
      else { nx = c2 / (s.a || 1e-6); ny = s2 / (s.b || 1e-6); }
      const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      const rad = Math.sqrt(1 - tn * tn);
      const gx = (s.e1[0] * nx + s.e2[0] * ny) * rad + s.T[0] * tn;
      const gy = (s.e1[1] * nx + s.e2[1] * ny) * rad + s.T[1] * tn;
      const gz = (s.e1[2] * nx + s.e2[2] * ny) * rad + s.T[2] * tn;
      buf.vert(px, py, pz, gx, gy, gz, s.u + vOff, (j / sides) * vTile);
    }
    return id0;
  };
  const rows = [];
  const capLen = (s) => Math.min(s.a, s.b) * domeLen;
  // start cap rings
  if (capA === 'dome') {
    for (let k = domeRings; k >= 1; k--) {
      const th = (k / (domeRings + 1)) * (Math.PI / 2);
      rows.push(ring(st[0], Math.cos(th), -Math.sin(th) * capLen(st[0]), -Math.sin(th)));
    }
  } else if (capA === 'flat') {
    rows.push(ring(st[0], 0.0001, 0, -1));
    rows.push(ring(st[0], 1, 0, -1));
  }
  for (let i = 0; i < n; i++) rows.push(ring(st[i], 1, 0, 0));
  if (capB === 'dome') {
    for (let k = 1; k <= domeRings; k++) {
      const th = (k / (domeRings + 1)) * (Math.PI / 2);
      rows.push(ring(st[n - 1], Math.cos(th), Math.sin(th) * capLen(st[n - 1]), Math.sin(th)));
    }
  } else if (capB === 'flat') {
    rows.push(ring(st[n - 1], 1, 0, 1));
    rows.push(ring(st[n - 1], 0.0001, 0, 1));
  }
  // sweep quads (flat caps: the duplicated rows hold the hard edge; their quad is the cap disc)
  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = 0; j < sides; j++) {
      const a = rows[i] + j, b = rows[i] + j + 1, c = rows[i + 1] + j + 1, d = rows[i + 1] + j;
      buf.quad(a, b, c, d);
    }
  }
  // dome tips
  const tip = (s, sign) => {
    const id = buf.count;
    const l = capLen(s);
    buf.vert(s.P[0] + s.T[0] * l * sign, s.P[1] + s.T[1] * l * sign, s.P[2] + s.T[2] * l * sign, s.T[0] * sign, s.T[1] * sign, s.T[2] * sign, s.u, 0.5);
    return id;
  };
  if (capA === 'dome') {
    const t = tip(st[0], -1), r0 = rows[0];
    for (let j = 0; j < sides; j++) buf.tri(r0 + j + 1, r0 + j, t);
  }
  if (capB === 'dome') {
    const t = tip(st[n - 1], 1), r0 = rows[rows.length - 1];
    for (let j = 0; j < sides; j++) buf.tri(r0 + j, r0 + j + 1, t);
  }
}

/* ------------------------------------------------------------------ hard-edged bevelled bar along a polyline */
/**
 * Sweep a chamfered rectangle along `pts`. Every face of the section keeps its own flat normal (crisp polished edges that
 * catch the softboxes as thin bright lines) and the normals only blend along the path.
 *  r      [a, b] | (t, i) => [a, b]    half width (along up x T) and half thickness (along up)
 *  up     [x,y,z] | (p, t, i) => [x,y,z]
 *  bevel  chamfer size as a fraction of min(a, b)      capA / capB  'flat' | 'none'
 */
const BAR_N = [[0, 1], [-0.7071, 0.7071], [-1, 0], [-0.7071, -0.7071], [0, -1], [0.7071, -0.7071], [1, 0], [0.7071, 0.7071]];
export function bar(buf, pts, o = {}) {
  const { r = [0.1, 0.07], up = [0, 0, 1], bevel = 0.35, capA = 'flat', capB = 'flat', uTile = 3 } = o;
  const n = pts.length;
  if (n < 2) return;
  const rf = typeof r === 'function' ? r : () => r;
  const cum = [0];
  for (let i = 1; i < n; i++) cum.push(cum[i - 1] + len(sub(pts[i], pts[i - 1])));
  const total = cum[n - 1] || 1;
  const frames = [];
  for (let i = 0; i < n; i++) {
    const t = cum[i] / total;
    const T = norm(i === 0 ? sub(pts[1], pts[0]) : i === n - 1 ? sub(pts[n - 1], pts[n - 2]) : sub(pts[i + 1], pts[i - 1]));
    let U = typeof up === 'function' ? up(pts[i], t, i) : up;
    U = sub(U, mul(T, dot(U, T)));
    if (len(U) < 1e-5) U = perp(T);
    const e2 = norm(U), e1 = norm(cross(e2, T));
    const ab = rf(t, i);
    frames.push({ P: pts[i], T, e1, e2, a: ab[0], b: ab[1], u: cum[i] / uTile });
  }
  const corner = (f, k) => {
    // corner k of the section, in section axes (x along e1, y along e2)
    const c = bevel * Math.min(f.a, f.b);
    const a = f.a, b = f.b;
    switch (k & 7) {
      case 0: return [a - c, b];
      case 1: return [-(a - c), b];
      case 2: return [-a, b - c];
      case 3: return [-a, -(b - c)];
      case 4: return [-(a - c), -b];
      case 5: return [a - c, -b];
      case 6: return [a, -(b - c)];
      default: return [a, b - c];
    }
  };
  const world = (f, xy) => [
    f.P[0] + f.e1[0] * xy[0] + f.e2[0] * xy[1],
    f.P[1] + f.e1[1] * xy[0] + f.e2[1] * xy[1],
    f.P[2] + f.e1[2] * xy[0] + f.e2[2] * xy[1],
  ];
  const base = [];
  for (const f of frames) {
    base.push(buf.count);
    for (let k = 0; k < 8; k++) {
      const nn = BAR_N[k];
      const gx = f.e1[0] * nn[0] + f.e2[0] * nn[1], gy = f.e1[1] * nn[0] + f.e2[1] * nn[1], gz = f.e1[2] * nn[0] + f.e2[2] * nn[1];
      const p0 = world(f, corner(f, k)), p1 = world(f, corner(f, k + 1));
      buf.vert(p0[0], p0[1], p0[2], gx, gy, gz, f.u, k / 8);
      buf.vert(p1[0], p1[1], p1[2], gx, gy, gz, f.u, (k + 1) / 8);
    }
  }
  for (let i = 0; i < n - 1; i++) {
    for (let k = 0; k < 8; k++) buf.quad(base[i] + k * 2, base[i] + k * 2 + 1, base[i + 1] + k * 2 + 1, base[i + 1] + k * 2);
  }
  const cap = (f, sign) => {
    const ids = [];
    for (let k = 0; k < 8; k++) {
      const p = world(f, corner(f, k));
      ids.push(buf.vert(p[0], p[1], p[2], f.T[0] * sign, f.T[1] * sign, f.T[2] * sign, f.u, 0.5));
    }
    const c = buf.vert(f.P[0], f.P[1], f.P[2], f.T[0] * sign, f.T[1] * sign, f.T[2] * sign, f.u, 0.5);
    for (let k = 0; k < 8; k++) {
      if (sign > 0) buf.tri(c, ids[k], ids[(k + 1) % 8]); else buf.tri(c, ids[(k + 1) % 8], ids[k]);
    }
  };
  if (capA === 'flat') cap(frames[0], -1);
  if (capB === 'flat') cap(frames[n - 1], 1);
}

/* ------------------------------------------------------------------ surface of revolution about any axis */
/**
 * Revolve profile [[t, r], ...] (t along `axis` from `origin`, r = radius) around the axis.
 * Walk the profile so the outside is on the left of the travel (cylinder: cap0 -> side -> cap1 with r = 0 at both ends).
 * o: sides, ref (direction of phi = 0), creaseDeg (profile corners sharper than this stay hard), facet (flat-shaded
 *    prism faces, for hex nuts), uTile/vTile (mm per v unit along the profile), phi0/phi (partial revolve), sx/sy (squash the section)
 */
export function lathe(buf, origin, axis, profile, o = {}) {
  const { sides = 16, creaseDeg = 38, facet = false, vTile = 3, phi0 = 0, phi = TAU, sx = 1, sy = 1 } = o;
  const A = norm(axis);
  const U1 = o.ref ? norm(sub(o.ref, mul(A, dot(o.ref, A)))) : perp(A);
  const U2 = cross(A, U1);
  const n = profile.length;
  const segs = [];
  for (let i = 0; i < n - 1; i++) {
    const dt = profile[i + 1][0] - profile[i][0], dr = profile[i + 1][1] - profile[i][1];
    const l = Math.hypot(dt, dr);
    segs.push(l < 1e-7 ? null : { nt: -dr / l, nr: dt / l, l });
  }
  // cumulative profile length for v
  const vcum = [0];
  for (let i = 0; i < n - 1; i++) vcum.push(vcum[i] + (segs[i] ? segs[i].l : 0));
  const cosC = Math.cos(creaseDeg * DEG);
  const slots = [];         // per profile point: [{nt,nr}] (1 = smooth, 2 = hard: [prevSeg, nextSeg])
  for (let i = 0; i < n; i++) {
    let a = i > 0 ? segs[i - 1] : null, b = i < n - 1 ? segs[i] : null;
    // skip over degenerate segments for the neighbours
    if (!a && i > 1) { let k = i - 2; while (k >= 0 && !segs[k]) k--; a = k >= 0 ? segs[k] : null; }
    if (!b && i < n - 2) { let k = i + 1; while (k < n - 1 && !segs[k]) k++; b = k < n - 1 ? segs[k] : null; }
    if (a && b) {
      if (a.nt * b.nt + a.nr * b.nr >= cosC && !facet) {
        const nt = a.nt + b.nt, nr = a.nr + b.nr, l = Math.hypot(nt, nr) || 1;
        slots.push([{ nt: nt / l, nr: nr / l }]);
      } else slots.push([a, b]);
    } else slots.push([a || b || { nt: 1, nr: 0 }]);
  }
  const phiStep = phi / sides;
  const ringAt = (i, slot) => {
    const id0 = buf.count;
    const sl = slots[i][Math.min(slot, slots[i].length - 1)];
    const t = profile[i][0], r = profile[i][1];
    for (let j = 0; j <= sides; j++) {
      const ph = phi0 + j * phiStep;
      const cp = Math.cos(ph), sp = Math.sin(ph);
      // squash: scale the radial direction components along U1 / U2 independently (normals use the inverse scale)
      const qx = (U1[0] * cp * sx + U2[0] * sp * sy), qy = (U1[1] * cp * sx + U2[1] * sp * sy), qz = (U1[2] * cp * sx + U2[2] * sp * sy);
      let rx = (U1[0] * cp / sx + U2[0] * sp / sy), ry = (U1[1] * cp / sx + U2[1] * sp / sy), rz = (U1[2] * cp / sx + U2[2] * sp / sy);
      let rl = Math.hypot(rx, ry, rz) || 1; rx /= rl; ry /= rl; rz /= rl;
      let nx = A[0] * sl.nt + rx * sl.nr, ny = A[1] * sl.nt + ry * sl.nr, nz = A[2] * sl.nt + rz * sl.nr;
      if (facet) {
        const pm = phi0 + (j + 0.5) * phiStep, cm = Math.cos(pm), sm = Math.sin(pm);
        nx = A[0] * sl.nt + (U1[0] * cm + U2[0] * sm) * sl.nr; ny = A[1] * sl.nt + (U1[1] * cm + U2[1] * sm) * sl.nr; nz = A[2] * sl.nt + (U1[2] * cm + U2[2] * sm) * sl.nr;
      }
      const nl = Math.hypot(nx, ny, nz) || 1;
      buf.vert(origin[0] + A[0] * t + qx * r, origin[1] + A[1] * t + qy * r, origin[2] + A[2] * t + qz * r, nx / nl, ny / nl, nz / nl, j / sides, vcum[i] / vTile);
    }
    return id0;
  };
  // rings per (point, slot); segment i uses slot (last) of point i and slot 0 of point i+1
  const cache = new Map();
  const ring = (i, slot) => {
    const k = i * 2 + slot;
    if (!cache.has(k)) cache.set(k, ringAt(i, slot));
    return cache.get(k);
  };
  for (let i = 0; i < n - 1; i++) {
    if (!segs[i]) continue;
    const r0 = ring(i, slots[i].length - 1), r1 = ring(i + 1, 0);
    for (let j = 0; j < sides; j++) {
      const a = r0 + j, b = r0 + j + 1, c = r1 + j + 1, d = r1 + j;
      buf.quad(a, b, c, d);
    }
  }
}

/** Profile helpers (t along the axis, r radius). */
export const prof = {
  /** Plain cylinder with small chamfers. */
  cyl(r, h, ch = 0.04, t0 = 0) {
    const c = Math.min(ch, r * 0.45, h * 0.45);
    return c > 0
      ? [[t0, 0], [t0, r - c], [t0 + c, r], [t0 + h - c, r], [t0 + h, r - c], [t0 + h, 0]]
      : [[t0, 0], [t0, r], [t0 + h, r], [t0 + h, 0]];
  },
  /** Hollow ring (tube section) with chamfers. */
  ring(rIn, rOut, h, ch = 0.03, t0 = 0) {
    const c = Math.min(ch, (rOut - rIn) * 0.4, h * 0.4);
    return [[t0, rIn + c], [t0 + c, rIn], [t0 + h - c, rIn], [t0 + h, rIn + c], [t0 + h, rOut - c], [t0 + h - c, rOut], [t0 + c, rOut], [t0, rOut - c], [t0, rIn + c]].reverse();
  },
};

/* ------------------------------------------------------------------ ready-made parts */
/** Hex-head bolt / nut: axis points out of the surface. */
export function hexBolt(buf, origin, axis, r = 0.2, h = 0.14, o = {}) {
  const c = r * 0.12;
  lathe(buf, origin, axis, [[0, 0], [0, r * 0.86], [c, r], [h - c, r], [h, r * 0.82], [h, 0]], { sides: 6, facet: true, ref: o.ref, vTile: 1 });
}
/** Round socket-head screw with a cross slot suggested by a dark ring (dome profile). */
export function domeScrew(buf, origin, axis, r = 0.15, h = 0.1, o = {}) {
  lathe(buf, origin, axis, [[0, 0], [0, r], [h * 0.35, r], [h * 0.75, r * 0.82], [h, r * 0.4], [h * 1.02, 0]], { sides: o.sides || 10, ref: o.ref, vTile: 1 });
}
/** Ellipsoid bead: a, b = semi-axes in the section plane (ref direction = a), c along the axis. */
export function bead(buf, center, axis, a, b, c, o = {}) {
  const rings = o.rings || 6;
  const pr = [];
  for (let k = 0; k <= rings; k++) {
    const th = (k / rings) * Math.PI;
    pr.push([-Math.cos(th) * c, Math.sin(th) * a]);
  }
  lathe(buf, center, axis, pr, { sides: o.sides || 10, ref: o.ref, sy: b / (a || 1), vTile: 1, creaseDeg: 180 });
}
/** Torus ring about `axis`. */
export function torusRing(buf, center, axis, R, r, o = {}) {
  const rings = o.rings || 6;
  const pr = [];
  for (let k = 0; k <= rings; k++) {
    const th = (k / rings) * TAU;
    pr.push([-Math.sin(th) * r, R - Math.cos(th) * r]);
  }
  lathe(buf, center, axis, pr, { sides: o.sides || 16, ref: o.ref, vTile: 1, creaseDeg: 180 });
}

/** Local frame helper: returns a THREE.Matrix4 from an origin and axes (x, y; z derived). */
export function frame(origin, ex, ey) {
  const x = norm(ex);
  const z = norm(cross(x, ey));
  const y = cross(z, x);
  return new THREE.Matrix4().makeBasis(new THREE.Vector3(...x), new THREE.Vector3(...y), new THREE.Vector3(...z)).setPosition(new THREE.Vector3(...origin));
}
