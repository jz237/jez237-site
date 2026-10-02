// APX-9 legs: shared maths and modelling helpers.
//   - PARAMS / solveLeg(): the insect-style kinematic layout (hip -> femur -> knee -> tibia -> tarsus -> claw) of each leg
//   - Seg: a limb segment with its own frame  x = s (hinge axis), y = limb axis a, z = o (outer / convex side)
//   - Pod: a lofted super-elliptic body (+ wrapped bands, surface mappers for armour plates)
//   - lathe / groove / screw helpers
import { THREE, V3, K, HIP_N, D2R, S, crease, boxUV, profile, revolve, screw, mergeGeometries } from '../kit.js';

export const lerp = (a, b, t) => a + (b - a) * t;
const _memo = new Map();
/** Memoise a geometry factory (part.add clones geometries, so cached ones are safe to share). */
export const once = (key, fn) => { if (!_memo.has(key)) _memo.set(key, fn()); return _memo.get(key); };
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const UP = V3(0, 1, 0);

/* ------------------------------------------------------------------ per-leg parameter sets */
// t        : where along the straight hip -> foot line the knee sits (0..1)
// kneeOut  : distance of the knee from that line, outboard (contract: 2.5..3.5 mm)
// coxaLen  : hip sleeve length along HIP_N          tarsus: segment lengths (sum = tarsus length)
// shockUp  : extra stand-off (mm) of the coil-over chord above the shell tops, so it clears the knee corner
// fem / tib: half-width (rx, along the hinge axis) and half-depth (rz, along the outer axis) tables over the
//            segment fraction f = 0..1, plus the outward bow of the centre line.
export const PARAMS = {
  front: {
    key: 'front', idx: 0, title: 'Right Front', t: 0.5, kneeOut: 2.9, coxaLen: 1.6, hipSide: -1, kneeSide: -1, servoR: 1.0, tarsus: [0.78, 0.66, 0.56], tarsusBend: 0.25, claw: 1.2, shockUp: 0.3,
    fem: { rx: [[0, 0.78], [0.1, 0.98], [0.34, 1.08], [0.66, 0.93], [0.9, 0.78], [1, 0.72]], rz: [[0, 0.7], [0.1, 0.82], [0.34, 0.86], [0.66, 0.74], [0.9, 0.64], [1, 0.6]], bow: 0.22 },
    tib: { rx: [[0, 0.58], [0.15, 0.6], [0.55, 0.52], [0.9, 0.44], [1, 0.4]], rz: [[0, 0.52], [0.15, 0.56], [0.55, 0.5], [0.9, 0.4], [1, 0.36]], bow: 0.12 },
  },
  mid: {
    key: 'mid', idx: 1, title: 'Right Middle', t: 0.45, kneeOut: 3.2, coxaLen: 1.6, hipSide: -1, kneeSide: -1, servoR: 0.96, tarsus: [0.8, 0.7, 0.6], tarsusBend: 0.2, claw: 1.2, shockUp: 0.5,
    fem: { rx: [[0, 0.72], [0.1, 0.88], [0.34, 0.98], [0.66, 0.84], [0.9, 0.7], [1, 0.66]], rz: [[0, 0.66], [0.1, 0.78], [0.34, 0.82], [0.66, 0.7], [0.9, 0.6], [1, 0.56]], bow: 0.2 },
    tib: { rx: [[0, 0.56], [0.15, 0.58], [0.55, 0.5], [0.9, 0.42], [1, 0.38]], rz: [[0, 0.5], [0.15, 0.54], [0.55, 0.48], [0.9, 0.38], [1, 0.34]], bow: 0.12 },
  },
  rear: {
    key: 'rear', idx: 2, title: 'Right Rear', t: 0.42, kneeOut: 3.0, coxaLen: 1.6, hipSide: 1, kneeSide: 1, servoR: 0.92, tarsus: [0.9, 0.76, 0.62], tarsusBend: 0.3, claw: 1.2, shockUp: 0.3,
    fem: { rx: [[0, 0.68], [0.1, 0.82], [0.34, 0.9], [0.66, 0.78], [0.9, 0.66], [1, 0.62]], rz: [[0, 0.62], [0.1, 0.74], [0.34, 0.78], [0.66, 0.66], [0.9, 0.56], [1, 0.52]], bow: 0.2 },
    tib: { rx: [[0, 0.56], [0.15, 0.6], [0.5, 0.58], [0.85, 0.5], [1, 0.42]], rz: [[0, 0.5], [0.15, 0.56], [0.5, 0.55], [0.85, 0.46], [1, 0.38]], bow: 0.14 },
  },
};

/* ------------------------------------------------------------------ frames */
const RX180 = new THREE.Matrix4().makeRotationX(Math.PI);
/** A placement frame (Matrix4) with local helpers. */
export class Frm {
  constructor(m) { this.m = m; }
  /** local (x,y,z) -> bee-space point */
  pt(x = 0, y = 0, z = 0) { return V3(x, y, z).applyMatrix4(this.m); }
  /** local direction -> bee-space direction */
  dir(x = 0, y = 0, z = 0) { return V3(x, y, z).transformDirection(this.m).multiplyScalar(Math.hypot(x, y, z)); }
  /** Matrix4: this frame, then a local translation / XYZ rotation (degrees) / scale. */
  at(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sc = 1) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rx * D2R, ry * D2R, rz * D2R, 'XYZ'));
    const sv = typeof sc === 'number' ? V3(sc, sc, sc) : V3(sc[0], sc[1], sc[2]);
    return this.m.clone().multiply(new THREE.Matrix4().compose(V3(x, y, z), q, sv));
  }
  /** Same origin, local +Y and +Z reversed (turns a -Y facing feature to +Y). */
  flip() { return new Frm(this.m.clone().multiply(RX180)); }
  /** Frame translated / rotated in its own axes. */
  sub(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) { return new Frm(this.at(x, y, z, rx, ry, rz)); }
}

/* ------------------------------------------------------------------ limb segment with its own frame */
export class Seg extends Frm {
  constructor(P, a, oRef, len = 0) {
    super(new THREE.Matrix4());
    this.P = P.clone();
    this.a = a.clone().normalize();
    this.o = oRef.clone().addScaledVector(this.a, -oRef.dot(this.a)).normalize();
    this.s = new THREE.Vector3().crossVectors(this.a, this.o).normalize();
    this.len = len;
    this.m.makeBasis(this.s, this.a, this.o).setPosition(this.P);
  }
}

/** Frame from an origin and three orthonormal columns (right-handed: X x Y = Z). */
export function basisFrm(P, X, Y, Z) { return new Frm(new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(P)); }
/** Hinge face frame: local +Y = side * axis (the face direction), +Z = oRef made perpendicular, +X = Y x Z. */
export function hingeFrm(P, axis, oRef, side = 1) {
  const Y = axis.clone().normalize().multiplyScalar(side);
  const Z = oRef.clone().addScaledVector(Y, -oRef.dot(Y)).normalize();
  return basisFrm(P, new THREE.Vector3().crossVectors(Y, Z), Y, Z);
}

/** Frame at P with local +Y along dir and local +Z = zHint made perpendicular (X = Y x Z). */
export const yzFrm = (P, dir, zHint) => hingeFrm(P, dir, zHint, 1);

/** Solve one leg: key points and segment frames. All bee-space, right side. */
export function solveLeg(p) {
  const leg = K.legs[p.idx];
  const H = leg.coxa.clone(), F = leg.foot.clone();
  const N = HIP_N.clone();
  const d = F.clone().sub(H), dh = d.clone().normalize();
  const nOut = V3(0, 0, 1).addScaledVector(dh, -dh.z).normalize();          // outboard, perpendicular to the hip-foot line
  const J1 = H.clone().addScaledVector(N, p.coxaLen);
  const Kn = H.clone().addScaledVector(d, p.t).addScaledVector(nOut, p.kneeOut);
  const A = F.clone().add(V3(0, p.claw, 0));
  const at = A.clone().sub(Kn).normalize();
  const tl = p.tarsus.reduce((s, v) => s + v, 0);
  const tdir = at.clone().multiplyScalar(1 - p.tarsusBend).addScaledVector(V3(0, -1, 0), p.tarsusBend).normalize();
  const Te = A.clone().addScaledVector(tdir, -tl);

  const coxa = new Seg(H, N, nOut, p.coxaLen);
  const femur = new Seg(J1, Kn.clone().sub(J1).normalize(), nOut, Kn.distanceTo(J1));
  const tibia = new Seg(Kn, Te.clone().sub(Kn).normalize(), nOut, Te.distanceTo(Kn));
  const tarsus = new Seg(Te, tdir, nOut, tl);
  const claw = new Seg(A, V3(0, -1, 0), nOut, p.claw);
  // hinge frames: local +Y is the hinge axis (for lathes standing on the joint)
  const kAxis = femur.s.clone().add(tibia.s).normalize();
  const knee = new Seg(Kn, kAxis, nOut);
  // which flank (+1 = +s, -1 = -s) carries the hip disc / the knee disc; hydraulics sit opposite the knee disc
  const hipSide = p.hipSide ?? (femur.s.dot(N) >= 0 ? 1 : -1);
  const kneeSide = p.kneeSide ?? -1;
  // shared lofted bodies of the two long segments (shells, frames, hydraulics all hang off these)
  const podF = limbPod(femur, p.fem, { y0: 0.16, y1: femur.len - 0.3, n: 2.7, capA: { d: 0.5, p: 2 }, capB: { d: 0.4, p: 2 } });
  const podT = limbPod(tibia, p.tib, { y0: 0.3, y1: tibia.len - 0.16, n: 3.0, capA: { d: 0.4, p: 2 }, capB: { d: 0.3, p: 2 } });
  return { p, H, F, N, J1, Kn, Te, A, nOut, coxa, femur, tibia, tarsus, claw, knee, kAxis, hipSide, kneeSide, tdir, podF, podT };
}

/* ------------------------------------------------------------------ geometry helpers */

/** Flip the winding of a closed indexed solid when its signed volume is negative (outward normals expected). */
export function fixWinding(g) {
  const pos = g.attributes.position;
  const ix = g.index.array;
  const n = ix.length;
  let vol = 0;
  const a = V3(), b = V3(), c = V3();
  for (let i = 0; i < n; i += 3) {
    a.fromBufferAttribute(pos, ix[i]); b.fromBufferAttribute(pos, ix[i + 1]); c.fromBufferAttribute(pos, ix[i + 2]);
    vol += a.dot(b.cross(c));
  }
  if (vol < 0) {
    for (let i = 0; i < n; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
    g.index.needsUpdate = true;
  }
  return g;
}

function finish(pos, idx, creaseDeg, uv) {
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  fixWinding(g);
  g = crease(g, creaseDeg);
  boxUV(g, uv);
  return g;
}

/** Surface mapper from a position function P(u, v) -> Vector3. The normal is dP/du x dP/dv (so P must be right-handed outward). */
export function mapSurf(P) {
  const h = 2e-3;
  return (u, v) => {
    const p = P(u, v);
    const pu = P(u + h, v).sub(P(u - h, v));
    const pv = P(u, v + h).sub(P(u, v - h));
    return { p, n: pu.cross(pv).normalize() };
  };
}

const sgn = (x) => (x < 0 ? -1 : 1);
const spw = (c, e) => sgn(c) * Math.pow(Math.abs(c), e);
const fnOf = (v, d) => (typeof v === 'function' ? v : () => (v ?? d));

/**
 * Lofted super-elliptic body along local +Y, with optional rounded caps. Section: width rx (local x) and depth rz (local z),
 * centre (cx, cz), exponent n (2 = ellipse, 3..4 = rounded rectangle). All numbers or functions of y.
 * Body range y0..y1; capA / capB = { d: depth, p: power } extend the solid beyond y0 / y1 (null = flat end).
 */
export class Pod {
  constructor(o) {
    this.y0 = o.y0; this.y1 = o.y1;
    this.frx = fnOf(o.rx, 1); this.frz = fnOf(o.rz, 1); this.fcx = fnOf(o.cx, 0); this.fcz = fnOf(o.cz, 0); this.fn = fnOf(o.n, 2.6);
    this.capA = o.capA === undefined ? { d: 0.4, p: 2 } : o.capA;
    this.capB = o.capB === undefined ? { d: 0.4, p: 2 } : o.capB;
    this.extra = o.extraY || [];
  }
  get ya() { return this.y0 - (this.capA ? this.capA.d : 0); }
  get yb() { return this.y1 + (this.capB ? this.capB.d : 0); }
  at(y) {
    let f = 1, yy = y;
    if (y < this.y0) {
      yy = this.y0;
      if (this.capA) { const u = (this.y0 - y) / this.capA.d; f = u >= 1 ? 0 : Math.pow(1 - Math.pow(u, this.capA.p), 1 / this.capA.p); }
    } else if (y > this.y1) {
      yy = this.y1;
      if (this.capB) { const u = (y - this.y1) / this.capB.d; f = u >= 1 ? 0 : Math.pow(1 - Math.pow(u, this.capB.p), 1 / this.capB.p); }
    }
    return { rx: Math.max(this.frx(yy) * f, 0.002), rz: Math.max(this.frz(yy) * f, 0.002), cx: this.fcx(yy), cz: this.fcz(yy), n: this.fn(yy) };
  }
  /** point of the section at height y, angle t (t = 0 -> +x, t = pi/2 -> +z), radially grown by g */
  pt(y, t, g = 0) {
    const s = this.at(y);
    const e = 2 / Math.max(s.n, 1.2);
    const k = g === 0 ? 0 : clamp(Math.min(s.rx, s.rz) / 0.15, 0, 1);
    return V3(s.cx + (s.rx + g * k) * spw(Math.cos(t), e), y, s.cz + (s.rz + g * k) * spw(Math.sin(t), e));
  }
  ys(step = 0.18) {
    const out = [];
    const nb = Math.max(2, Math.ceil((this.y1 - this.y0) / step));
    for (let i = 0; i <= nb; i++) out.push(this.y0 + ((this.y1 - this.y0) * i) / nb);
    for (const y of this.extra) if (y > this.y0 && y < this.y1) out.push(y);
    const capRings = Math.max(4, S(7, 4));
    if (this.capA) for (let k = 1; k <= capRings; k++) out.push(this.y0 - this.capA.d * Math.sin((k / capRings) * Math.PI * 0.5));
    if (this.capB) for (let k = 1; k <= capRings; k++) out.push(this.y1 + this.capB.d * Math.sin((k / capRings) * Math.PI * 0.5));
    out.sort((a, b) => a - b);
    return out.filter((y, i) => i === 0 || y - out[i - 1] > 1e-4);
  }
  /** Surface mapper centred on angle tc (pi/2 = the +z / outer face). u = arc length (mm; + goes toward +x at tc = pi/2), v = y. */
  surface(tc, grow = 0) {
    return mapSurf((u, v) => {
      const s = this.at(v);
      const rm = Math.sqrt((s.rx * s.rx + s.rz * s.rz) / 2) + grow * 0.5;
      return this.pt(v, tc - u / Math.max(rm, 0.05), grow);
    });
  }
  /** Solid mesh. */
  geo({ radial = 40, step = 0.18, creaseDeg = 50, uv = 0.3 } = {}) {
    const R = Math.max(12, S(radial, 12));
    const ys = this.ys(step);
    const pos = [], idx = [];
    for (const y of ys) for (let j = 0; j < R; j++) { const p = this.pt(y, (j / R) * Math.PI * 2); pos.push(p.x, p.y, p.z); }
    const rings = ys.length;
    for (let i = 0; i < rings - 1; i++) {
      for (let j = 0; j < R; j++) {
        const a = i * R + j, b = i * R + ((j + 1) % R), c = (i + 1) * R + ((j + 1) % R), d = (i + 1) * R + j;
        idx.push(a, b, d, b, c, d);
      }
    }
    const cap = (ring, flip) => {
      const s = this.at(ys[ring]);
      const ci = pos.length / 3;
      pos.push(s.cx, ys[ring], s.cz);
      for (let j = 0; j < R; j++) {
        const a = ring * R + j, b = ring * R + ((j + 1) % R);
        if (flip) idx.push(a, b, ci); else idx.push(b, a, ci);
      }
    };
    cap(0, false); cap(rings - 1, true);
    return finish(pos, idx, creaseDeg, uv);
  }
  /**
   * Sweep a closed (y, g) polygon (g = growth beyond the pod surface) around the pod between angles t0..t1.
   * Full circle -> a closed band; partial -> a bent plate with end caps.
   */
  wrap(poly, { t0 = 0, t1 = Math.PI * 2, radial = 48, creaseDeg = 48, uv = 0.3 } = {}) {
    const full = Math.abs(t1 - t0 - Math.PI * 2) < 1e-6;
    const Rfull = S(radial, 16);
    const R = full ? Rfull : Math.max(4, Math.round((Rfull * (t1 - t0)) / (Math.PI * 2)));
    const cols = full ? R : R + 1;
    const m = poly.length;
    const pos = [], idx = [];
    for (let j = 0; j < cols; j++) {
      const t = t0 + ((t1 - t0) * j) / R;
      for (let i = 0; i < m; i++) { const p = this.pt(poly[i][0], t, poly[i][1]); pos.push(p.x, p.y, p.z); }
    }
    for (let j = 0; j < R; j++) {
      const j2 = full ? (j + 1) % R : j + 1;
      for (let i = 0; i < m; i++) {
        const i2 = (i + 1) % m;
        const a = j * m + i, b = j2 * m + i, c = j2 * m + i2, d = j * m + i2;
        idx.push(a, b, c, a, c, d);
      }
    }
    if (!full) {
      for (const [j, first] of [[0, true], [cols - 1, false]]) {
        const ci = pos.length / 3;
        let cx = 0, cy = 0, cz = 0;
        for (let i = 0; i < m; i++) { cx += pos[(j * m + i) * 3]; cy += pos[(j * m + i) * 3 + 1]; cz += pos[(j * m + i) * 3 + 2]; }
        pos.push(cx / m, cy / m, cz / m);
        for (let i = 0; i < m; i++) {
          const i2 = (i + 1) % m;
          if (first) idx.push(ci, j * m + i, j * m + i2); else idx.push(ci, j * m + i2, j * m + i);
        }
      }
    }
    return finish(pos, idx, creaseDeg, uv);
  }
}

/** Pod for a limb segment from a PARAMS table (fractions of the segment length) with the outward bow of the centre line. */
export function limbPod(seg, tbl, o = {}) {
  const L = seg.len;
  const rx = profile(tbl.rx.map(([f, v]) => [f * L, v * (o.w ?? 1)]));
  const rz = profile(tbl.rz.map(([f, v]) => [f * L, v * (o.d ?? 1)]));
  const bow = tbl.bow * (o.bow ?? 1);
  const cz = (y) => bow * Math.sin(Math.PI * clamp(y / L, 0, 1));
  return new Pod({ y0: o.y0 ?? 0, y1: o.y1 ?? L, rx, rz, cz, n: o.n ?? 3.0, capA: o.capA, capB: o.capB, extraY: o.extraY });
}

/** Rounded-rectangle polygon (y, g) of a band: from y0 to y1, wall from g0 (inside) to g1 (outside), corner radius b. */
export function bandPoly(y0, y1, g0, g1, b = 0.05, steps = 3) {
  b = Math.min(b, (y1 - y0) * 0.45, (g1 - g0) * 0.95);
  const poly = [[y0, g0]];
  for (let k = 0; k <= steps; k++) { const a = Math.PI - (k / steps) * Math.PI * 0.5; poly.push([y0 + b + Math.cos(a) * b, g1 - b + Math.sin(a) * b]); }
  for (let k = 0; k <= steps; k++) { const a = Math.PI * 0.5 - (k / steps) * Math.PI * 0.5; poly.push([y1 - b + Math.cos(a) * b, g1 - b + Math.sin(a) * b]); }
  poly.push([y1, g0]);
  return poly;
}

/* ------------------------------------------------------------------ lathe helpers */

/** Intermediate profile points for n shallow grooves on a wall of radius r between y0 and y1. */
export function grooves(r, y0, y1, n, w, d, edge = 0) {
  const out = [];
  const pitch = (y1 - y0) / n;
  for (let i = 0; i < n; i++) {
    const yc = y0 + (i + 0.5) * pitch;
    out.push([r, yc - w / 2 - edge], [r - d, yc - w / 2], [r - d, yc + w / 2], [r, yc + w / 2 + edge]);
  }
  return out;
}

/** Lathe about +Y from [r, y, fillet?] points (bottom-centre first, counter-clockwise). */
export function lathe(prof, o = {}) { return revolve(prof, { segments: 40, ...o }); }

/* ------------------------------------------------------------------ small mechanical details */

/** Matrix4 that puts a +Y-axis feature at p pointing along n, with optional roll about n and uniform scale. */
export function alongN(p, n, roll = 0, sc = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, n.clone().normalize());
  if (roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, roll));
  return new THREE.Matrix4().compose(p, q, V3(sc, sc, sc));
}

let _screw = null;
/** Low-poly hex-head bolt (head up, across-corners radius 0.1, height 0.075, chamfered crown); scale per use. */
export function screwGeo() {
  return _screw || (_screw = revolve([[0, 0], [0.1, 0], [0.1, 0.05], [0.075, 0.075], [0, 0.075]], { segments: 6, steps: 1, creaseDeg: 50 }));
}
/** Add a socket-head screw sitting on a surface (point p, outward normal n). */
export function addScrew(part, mat, p, n, r = 0.1, roll = 0) {
  part.add(screwGeo(), mat, alongN(p, n, roll, r / 0.1));
}
/** Same as addScrew for a point / normal given in the local coordinates of a frame (Frm). */
export function screwOn(part, mat, frame, p, n, r = 0.1, roll = 0) {
  part.add(screwGeo(), mat, frame.m.clone().multiply(alongN(p, n, roll, r / 0.1)));
}
/** Ring of screws on a flat face in a frame matrix (axis +Y of the frame): count, radius R, offset y. */
export function boltCircle(part, mat, frame, count, R, r = 0.1, phase = 0, y = 0) {
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2;
    const m = frame.clone().multiply(new THREE.Matrix4().compose(V3(Math.cos(a) * R, y, Math.sin(a) * R), new THREE.Quaternion(), V3(r / 0.1, r / 0.1, r / 0.1)));
    part.add(screwGeo(), mat, m);
  }
}

/* ------------------------------------------------------------------ plate outlines */

export const PI = Math.PI;

/** Tapered plate outline [x, y, r][] on a pod: half-width = k * rx(y) + margin between y = v0 and v1; corner radii rb (bottom) / rt (top). */
export function taperOutline(pod, v0, v1, k, { margin = 0, rb = 0.22, rt = 0.22, n = 6, kb, kt, dim = 'rx' } = {}) {
  const half = (v, i) => {
    const f = (v - v0) / (v1 - v0);
    const kk = kb !== undefined && kt !== undefined ? lerp(kb, kt, f) : k;
    return Math.max(pod.at(clamp(v, pod.y0, pod.y1))[dim] * kk + margin, 0.1);
  };
  const vs = [];
  for (let i = 0; i <= n; i++) vs.push(lerp(v0, v1, i / n));
  const pts = [];
  vs.forEach((v, i) => pts.push([half(v), v, i === 0 ? rb : i === n ? rt : 0]));
  for (let i = n; i >= 0; i--) pts.push([-half(vs[i]), vs[i], i === 0 ? rb : i === n ? rt : 0]);
  return pts;
}

/** Rounded slot (capsule-like) centred on (cx, cy), width w (x), height h (y). */
export function slit(cx, cy, w, h, r) {
  const rr = r ?? Math.min(w, h) * 0.46;
  return [[cx - w / 2, cy - h / 2, rr], [cx + w / 2, cy - h / 2, rr], [cx + w / 2, cy + h / 2, rr], [cx - w / 2, cy + h / 2, rr]];
}

/** Frame on the flank of a pod (side = +1 -> +s side, -1 -> -s side) at height y; local +Y = outward face direction. */
export function flankFrame(seg, pod, y, side, grow = 0) {
  const s = pod.at(y);
  const P = seg.pt(side * (s.rx + grow), y, s.cz);
  return hingeFrm(P, seg.s, seg.o, side);
}

export { THREE, V3, K, HIP_N, D2R, S, crease, boxUV, profile, revolve, mergeGeometries };
