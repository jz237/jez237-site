// APX-9 head: shared maths (no parts are created here).
//   - ellFrame(): the azimuthal-equidistant frame used by surf.ellipsoid(), with the INVERSE mapping the kit lacks, so
//     3-D curves (eye contour, ocelli, antenna base) can be drawn into plate coordinates and plates can be traced from
//     signed-distance fields.
//   - cuts on the head's normalised sphere (planes / small circles) used to partition the shell without overlaps.
//   - tiny cached fastener geometries and a bolt-field helper.
import * as THREE from 'three';
import { V3, surf, mergeGeometries, screw, rivet, crease } from '../geo.js';
import { K, eyeContour } from '../skeleton.js';
import { polygon, circle, union } from './head-sdf.js';

export const D2R = Math.PI / 180;
export const HC = K.head.c.toArray();            // head centre
export const HR = K.head.r.toArray();            // head radii
export const RM = (HR[0] + HR[1] + HR[2]) / 3;   // mean radius (mm per radian on the normalised sphere)

/* ------------------------------------------------------------------ small vector helpers (arrays) */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mulv = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const addv = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const subv = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const vlen = (a) => Math.hypot(a[0], a[1], a[2]);
export { dot, nrm, cross, mulv, addv, subv };

/** Point on the head surface for a unit direction u of the NORMALISED sphere (u = (p - C) / R, |u| = 1). */
export const headPoint = (u, lift = 0) => {
  const p = [HC[0] + u[0] * HR[0], HC[1] + u[1] * HR[1], HC[2] + u[2] * HR[2]];
  if (!lift) return p;
  const n = nrm([u[0] / HR[0], u[1] / HR[1], u[2] / HR[2]]);
  return [p[0] + n[0] * lift, p[1] + n[1] * lift, p[2] + n[2] * lift];
};
/** Outward ellipsoid normal at a bee-space point. */
export const headNormal = (p) => nrm([(p[0] - HC[0]) / (HR[0] * HR[0]), (p[1] - HC[1]) / (HR[1] * HR[1]), (p[2] - HC[2]) / (HR[2] * HR[2])]);
/** Normalised-sphere unit vector for a bee-space point (any distance). */
export const toU = (p) => nrm([(p[0] - HC[0]) / HR[0], (p[1] - HC[1]) / HR[1], (p[2] - HC[2]) / HR[2]]);

/* ------------------------------------------------------------------ ellipsoid frame with inverse */
export function ellFrame(dirArr, upArr = [0, 1, 0], roll = 0) {
  const [rx, ry, rz] = HR;
  const hit = (d) => { const t = 1 / Math.hypot(d[0] / rx, d[1] / ry, d[2] / rz); return [d[0] * t, d[1] * t, d[2] * t]; };
  const o = hit(nrm(dirArr));
  const n0 = nrm([o[0] / (rx * rx), o[1] / (ry * ry), o[2] / (rz * rz)]);
  let B = subv(upArr, mulv(n0, dot(upArr, n0)));
  if (dot(B, B) < 1e-8) B = subv([0, 0, 1], mulv(n0, n0[2]));
  B = nrm(B);
  let T = nrm(cross(B, n0));
  if (roll) {
    const c = Math.cos(roll * D2R), s = Math.sin(roll * D2R);
    const rot = (v) => addv(addv(mulv(v, c), mulv(cross(n0, v), s)), mulv(n0, dot(n0, v) * (1 - c)));
    T = rot(T); B = rot(B);
  }
  const R = vlen(o);
  const dirAt = (x, y) => {
    const rho = Math.hypot(x, y) / R;
    if (rho < 1e-6) return n0;
    const k = Math.sin(rho) / rho;
    const c = Math.cos(rho);
    return [n0[0] * c + (T[0] * x + B[0] * y) * k / R, n0[1] * c + (T[1] * x + B[1] * y) * k / R, n0[2] * c + (T[2] * x + B[2] * y) * k / R];
  };
  const fr = {
    n0, T, B, R, dir: nrm(dirArr),
    /** plate (x,y) -> bee-space point on the ellipsoid */
    point(x, y) { const p = hit(dirAt(x, y)); return [p[0] + HC[0], p[1] + HC[1], p[2] + HC[2]]; },
    /** plate (x,y) -> unit vector of the normalised sphere */
    u(x, y) { const d = dirAt(x, y); return nrm([d[0] / rx, d[1] / ry, d[2] / rz]); },
    /** bee-space point (any distance from the surface) -> plate (x,y) */
    inv(P) {
      const u = nrm([P[0] - HC[0], P[1] - HC[1], P[2] - HC[2]]);
      const c = Math.max(-1, Math.min(1, dot(u, n0)));
      const rho = Math.acos(c);
      const k = rho < 1e-6 ? 1 : rho / Math.sin(rho);
      return [R * dot(u, T) * k, R * dot(u, B) * k];
    },
    /** surface function for armorPanel / decalPatch (same maths as surf.ellipsoid) */
    surface: surf.ellipsoid({ center: V3(...HC), radii: V3(...HR), dir: V3(...dirArr), up: V3(...upArr), roll }),
    /** plate-space 2-D direction (unit) of a bee-space direction tangent to the surface at plate point (x,y) */
    frameAt(x, y) {
      const e = 0.02;
      const p = fr.point(x, y), px = fr.point(x + e, y), py = fr.point(x, y + e);
      const tx = nrm(subv(px, p)), ty0 = subv(py, p);
      const n = headNormal(p);
      const ty = nrm(cross(n, tx));
      void ty0;
      return { p, n, tx, ty };
    },
  };
  return fr;
}

/* ------------------------------------------------------------------ eye contour and keep-outs */
const contourCache = new Map();
/** closed contour (array of [x,y,z]) of the RIGHT eye footprint on the head; side -1 mirrors it to the left eye. */
export function contour3(side = 1, n = 64) {
  const key = `${side}:${n}`;
  let c = contourCache.get(key);
  if (!c) {
    c = eyeContour(n).map((p) => [p.x, p.y, p.z * side]);
    contourCache.set(key, c);
  }
  return c;
}

/** polygon of the eye contour in plate coordinates of frame fr */
export function contourPoly(fr, side = 1, n = 64) {
  return contour3(side, n).map((p) => fr.inv(p));
}

/** SDF (negative inside) of the eye footprint inflated by `clear` mm, in the plate coordinates of fr. */
export function eyeKeep(fr, side = 1, clear = 0.5, n = 64) {
  const poly = polygon(contourPoly(fr, side, n), clear + 1.2);
  return (x, y) => poly(x, y) - clear;
}

/** circles (r + clear) at 3-D points, as one SDF in plate coordinates of fr. */
export function pointKeep(fr, pts, r, clear = 0) {
  const cs = pts.map((p) => { const q = fr.inv(p); return circle(q[0], q[1], r + clear); });
  return cs.length === 1 ? cs[0] : union(...cs);
}

/* ------------------------------------------------------------------ cuts on the normalised sphere */
/** plane through the head centre: normal m (bee-space-ish, normalised internally), offset d in [-1,1] (u.m = d). Value in mm, negative where u.m < d. */
export function cutPlane(m, d = 0) {
  const mm = nrm(m);
  const a0 = Math.asin(Math.max(-1, Math.min(1, d)));
  return (u) => (Math.asin(Math.max(-1, Math.min(1, dot(u, mm)))) - a0) * RM;
}
/** small circle around axis m with angular radius ang (deg): negative inside. */
export function cutCone(m, angDeg) {
  const mm = nrm(m);
  const a0 = angDeg * D2R;
  return (u) => (Math.acos(Math.max(-1, Math.min(1, dot(u, mm)))) - a0) * RM;
}
/** plane containing the Z axis at angle psi (deg, 0 = front, 90 = top, 180 = rear, -90 = bottom): negative on the rear/lower side (angle < psi) when sign = +1. */
export function cutPsi(psiDeg, sign = 1) {
  const p = psiDeg * D2R;
  const m = [Math.sin(p), -Math.cos(p), 0];     // u.m < 0 for angle larger than psi... (see sign)
  const f = cutPlane(m, 0);
  return sign > 0 ? (u) => -f(u) : f;
}

/** make a plate-space SDF from a function of the normalised sphere vector */
export const onSphere = (fr, g) => (x, y) => g(fr.u(x, y));

/* ------------------------------------------------------------------ fastener geometry (cached) */
const gcache = new Map();
const cached = (key, make) => { let g = gcache.get(key); if (!g) { g = make(); gcache.set(key, g); } return g; };

/** low-poly fastener head, axis +Y, base at y=0. kinds: 'hex','dome','pan','torx' */
export function fastenerGeo(kind = 'pan', r = 0.2) {
  return cached(`f:${kind}:${r}`, () => {
    if (kind === 'dome') return rivet(r);
    if (kind === 'hex') {
      const g = new THREE.CylinderGeometry(r, r, r * 0.8, 6, 1);
      g.translate(0, r * 0.4, 0);
      return crease(g.toNonIndexed(), 30);
    }
    return screw(r, r);
  });
}

/**
 * Merge many small fasteners into ONE geometry. items: [{p:[x,y,z], n:[x,y,z] (outward normal), r?, kind?, spin?}].
 * The fastener axis (+Y) is rotated onto n.
 */
export function boltField(items, { kind = 'pan', r = 0.2 } = {}) {
  const up = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion();
  const geos = [];
  const m = new THREE.Matrix4();
  const s = new THREE.Vector3();
  const nvec = new THREE.Vector3();
  const pvec = new THREE.Vector3();
  for (const it of items) {
    const g0 = fastenerGeo(it.kind || kind, it.r || r);
    const g = g0.clone();
    nvec.set(it.n[0], it.n[1], it.n[2]).normalize();
    q.setFromUnitVectors(up, nvec);
    if (it.spin) q.multiply(new THREE.Quaternion().setFromAxisAngle(up, it.spin));
    pvec.set(it.p[0], it.p[1], it.p[2]);
    s.set(1, 1, 1);
    m.compose(pvec, q, s);
    g.applyMatrix4(m);
    geos.push(g);
  }
  if (!geos.length) return null;
  const out = mergeGeometries(geos, false);
  for (const g of geos) g.dispose();
  return out;
}

/**
 * Place bolts along closed outline loops (plate coordinates) inset by `inset`, every `pitch` mm, skipping places
 * where `ok(x, y)` is false. Returns bee-space items for boltField.
 */
export function boltsAlong(fr, loops, { pitch = 0.9, inset = 0.2, lift = 0, ok = null, offset = 0.5 } = {}) {
  const items = [];
  for (const loop of loops) {
    const n = loop.length;
    let acc = pitch * offset;
    // loop area sign gives inward direction: CCW outer loops have the interior on the left
    let a2 = 0;
    for (let i = 0, j = n - 1; i < n; j = i++) a2 += loop[j][0] * loop[i][1] - loop[i][0] * loop[j][1];
    const sg = a2 > 0 ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const A = loop[i], B = loop[(i + 1) % n];
      const dx = B[0] - A[0], dy = B[1] - A[1];
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) continue;
      let t = 0;
      while (acc <= len - t) {
        t += acc; acc = pitch;
        const x = A[0] + dx / len * t - sg * dy / len * inset;
        const y = A[1] + dy / len * t + sg * dx / len * inset;
        if (ok && !ok(x, y)) continue;
        const p = fr.point(x, y);
        const nn = headNormal(p);
        items.push({ p: [p[0] + nn[0] * lift, p[1] + nn[1] * lift, p[2] + nn[2] * lift], n: nn });
      }
      acc -= len - t;
    }
  }
  return items;
}

/**
 * Merge any mix of geometries (indexed or not, with or without uv/normal) into one non-indexed geometry
 * carrying position + normal + uv only. Null entries are skipped; returns null for an empty list.
 */
export function mergeAll(list) {
  const out = [];
  for (const g0 of list) {
    if (!g0) continue;
    const g = g0.index ? g0.toNonIndexed() : g0.clone();
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    out.push(g);
  }
  if (!out.length) return null;
  const m = out.length === 1 ? out[0] : mergeGeometries(out, false);
  return m;
}

export { V3, THREE };
