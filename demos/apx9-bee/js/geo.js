// APX-9 geometry kit. Units are millimetres. Every builder returns a BufferGeometry with
// position / normal / uv, crease-smoothed so bevels catch highlights like machined parts.
import * as THREE from 'three';
import { mergeGeometries, mergeVertices, toCreasedNormals } from '../vendor/BufferGeometryUtils.js';

export const D2R = Math.PI / 180;
/** Global detail scalers set by main.js from the quality tier. */
export const detail = { seg: 1, tess: 1 };
export const S = (n, min = 6) => Math.max(min, Math.round(n * detail.seg));
export const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export { mergeGeometries };

/* ------------------------------------------------------------------ utilities */

// Seeded PRNG so every visit builds the identical bee.
export function rng(seed = 1) {
  let s = (seed >>> 0) || 1;
  const f = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.range = (a, b) => a + (b - a) * f();
  f.int = (a, b) => Math.floor(a + (b - a + 1) * f());
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  f.gauss = () => (f() + f() + f() + f() - 2) * 1.2;
  return f;
}

/** Recompute normals with a crease angle (degrees): smooth across gentle curves, hard on sharp edges. */
export function crease(geo, angleDeg = 40) {
  const g = toCreasedNormals(geo.index ? geo : geo, angleDeg * D2R);
  if (g !== geo) geo.dispose();
  return g;
}

function ensureUV(geo) {
  if (!geo.attributes.uv) {
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
  }
  return geo;
}

/** Orient a geometry whose axis of revolution is +Y so that it points along the requested axis. */
export function axisTo(geo, axis) {
  if (axis === 'x') geo.rotateZ(-Math.PI / 2);
  else if (axis === 'z') geo.rotateX(Math.PI / 2);
  else if (axis === '-x') geo.rotateZ(Math.PI / 2);
  else if (axis === '-y') geo.rotateX(Math.PI);
  else if (axis === '-z') geo.rotateX(-Math.PI / 2);
  return geo;
}

/** Box-projected UVs (world scale) so patterned materials (carbon, hazard) have consistent texel density. */
export function boxUV(geo, scale = 0.25) {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const uv = ensureUV(geo).attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nor.getX(i)), ny = Math.abs(nor.getY(i)), nz = Math.abs(nor.getZ(i));
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (nx >= ny && nx >= nz) uv.setXY(i, z * scale, y * scale);
    else if (ny >= nz) uv.setXY(i, x * scale, z * scale);
    else uv.setXY(i, x * scale, y * scale);
  }
  uv.needsUpdate = true;
  return geo;
}

/* ------------------------------------------------------------------ 2D paths */

/**
 * Round the corners of a 2D polyline. Points are [x, y, radius?]. Open paths keep their end points.
 * Returns an array of [x, y].
 */
export function fillet(pts, { closed = false, steps = 4 } = {}) {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const r = p[2] || 0;
    if (r <= 0 || (!closed && (i === 0 || i === n - 1))) { out.push([p[0], p[1]]); continue; }
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    let v1x = a[0] - p[0], v1y = a[1] - p[1], v2x = b[0] - p[0], v2y = b[1] - p[1];
    const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
    if (l1 < 1e-9 || l2 < 1e-9) { out.push([p[0], p[1]]); continue; }
    v1x /= l1; v1y /= l1; v2x /= l2; v2y /= l2;
    const dot = Math.max(-1, Math.min(1, v1x * v2x + v1y * v2y));
    const ang = Math.acos(dot);
    if (ang < 1e-3 || Math.abs(Math.PI - ang) < 1e-3) { out.push([p[0], p[1]]); continue; }
    let t = r / Math.tan(ang / 2);
    const maxT = Math.min(l1, l2) * 0.5;
    let rr = r;
    if (t > maxT) { t = maxT; rr = t * Math.tan(ang / 2); }
    const t1 = [p[0] + v1x * t, p[1] + v1y * t];
    const t2 = [p[0] + v2x * t, p[1] + v2y * t];
    let bx = v1x + v2x, by = v1y + v2y;
    const bl = Math.hypot(bx, by); bx /= bl; by /= bl;
    const cd = rr / Math.sin(ang / 2);
    const c = [p[0] + bx * cd, p[1] + by * cd];
    const a1 = Math.atan2(t1[1] - c[1], t1[0] - c[0]);
    const a2 = Math.atan2(t2[1] - c[1], t2[0] - c[0]);
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    for (let k = 0; k <= steps; k++) {
      const q = a1 + d * k / steps;
      out.push([c[0] + Math.cos(q) * rr, c[1] + Math.sin(q) * rr]);
    }
  }
  return out;
}

/** Build a THREE.Shape from [x,y] points (optionally filleted [x,y,r]) with optional holes. */
export function shape(pts, holes = [], { steps = 4 } = {}) {
  const s = new THREE.Shape();
  const P = fillet(pts, { closed: true, steps });
  s.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) s.lineTo(P[i][0], P[i][1]);
  s.closePath();
  for (const h of holes) {
    const hp = !Array.isArray(h) ? h : (() => {
      const path = new THREE.Path();
      const H = fillet(h, { closed: true, steps });
      path.moveTo(H[0][0], H[0][1]);
      for (let i = 1; i < H.length; i++) path.lineTo(H[i][0], H[i][1]);
      path.closePath();
      return path;
    })();
    s.holes.push(hp);
  }
  return s;
}

export const rectPts = (w, h, r = 0) => [[-w / 2, -h / 2, r], [w / 2, -h / 2, r], [w / 2, h / 2, r], [-w / 2, h / 2, r]];
export const roundRect = (w, h, r = 0.3) => shape(rectPts(w, h, r));
export function circlePts(r, n = 32, cx = 0, cy = 0) {
  const a = [];
  for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; a.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]); }
  return a;
}
export function ngonPts(sides, r, rot = 0) {
  const a = [];
  for (let i = 0; i < sides; i++) { const t = rot + i / sides * Math.PI * 2; a.push([Math.cos(t) * r, Math.sin(t) * r]); }
  return a;
}
export const circleHole = (r, cx = 0, cy = 0, n = 24) => {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
};

/* ------------------------------------------------------------------ revolve / primitives */

/**
 * Revolve a counter-clockwise profile about +Y. Profile points are [r, y, filletRadius?] and must run
 * counter-clockwise in the (r, y) plane for outward-facing normals (e.g. bottom-centre -> bottom-rim -> top-rim -> top-centre).
 */
export function revolve(profile, { segments = 64, phi0 = 0, phi = Math.PI * 2, steps = 4, axis = 'y', creaseDeg = 35 } = {}) {
  const pts = fillet(profile, { steps }).map(p => new THREE.Vector2(Math.max(p[0], 0), p[1]));
  let g = new THREE.LatheGeometry(pts, S(segments), phi0, phi);
  g.deleteAttribute('normal');
  g = crease(g, creaseDeg);
  return axisTo(g, axis);
}

/** Bevelled solid cylinder (or tube if rIn>0) of height h centred on y=0. */
export function cyl(r, h, { bevel = Math.min(r, h) * 0.12, rIn = 0, bevelIn = bevel * 0.6, segments = 64, axis = 'y', steps = 3, y0 = -h / 2 } = {}) {
  const b = Math.min(bevel, r * 0.49, h * 0.49);
  const prof = [];
  if (rIn > 0) {
    const bi = Math.min(bevelIn, (r - rIn) * 0.45, h * 0.45);
    prof.push([rIn, y0, bi], [r, y0, b], [r, y0 + h, b], [rIn, y0 + h, bi]);
  } else {
    prof.push([0, y0], [r, y0, b], [r, y0 + h, b], [0, y0 + h]);
  }
  return revolve(prof, { segments, steps, axis });
}

/** Truncated cone / frustum of height h with radii r0 (bottom) and r1 (top). */
export function cone(r0, r1, h, { bevel = 0.05, segments = 56, axis = 'y', y0 = -h / 2, rIn = 0 } = {}) {
  const prof = rIn > 0
    ? [[rIn, y0, 0], [r0, y0, bevel], [r1, y0 + h, bevel], [rIn, y0 + h, 0]]
    : [[0, y0], [r0, y0, bevel], [r1, y0 + h, bevel], [0, y0 + h]];
  return revolve(prof, { segments, axis });
}

/** Capsule: cylinder with hemispherical caps, total length h along +Y. */
export function capsule(r, h, { segments = 40, axis = 'y' } = {}) {
  const half = Math.max(h / 2 - r, 0);
  const prof = [[0, -half - r]];
  const n = 8;
  for (let i = 1; i <= n; i++) { const a = -Math.PI / 2 + i / n * Math.PI / 2; prof.push([Math.cos(a) * r, -half + Math.sin(a) * r]); }
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI / 2; prof.push([Math.cos(a) * r, half + Math.sin(a) * r]); }
  return revolve(prof, { segments, axis, steps: 1, creaseDeg: 80 });
}

export function sphere(r, { segments = 32, rings = 20, sx = 1, sy = 1, sz = 1 } = {}) {
  const g = new THREE.SphereGeometry(r, S(segments, 8), S(rings, 5));
  g.scale(sx, sy, sz);
  return g;
}

export function torus(R, r, { radial = 14, tubular = 40, arc = Math.PI * 2 } = {}) {
  return new THREE.TorusGeometry(R, r, S(radial, 6), S(tubular, 12), arc);
}

/** Axis-aligned bevelled box, centred. */
export function box(w, h, d, bevel = 0.05) {
  return plate(rectPts(w, h, bevel * 1.5), d, { bevel, center: true, steps: 2 });
}

/* ------------------------------------------------------------------ extrusion */

/**
 * Extrude a 2D shape (THREE.Shape or [x,y,r?] points) along +Z with bevelled edges.
 * `depth` is the finished thickness. `center` puts the plate on z=0.
 */
export function plate(s, depth, { bevel = 0.06, bevelSegments = 2, holes = [], center = false, steps = 4, creaseDeg = 38, uvScale = 0.25 } = {}) {
  const sh = Array.isArray(s) ? shape(s, holes, { steps }) : s;
  const b = Math.min(bevel, depth * 0.45);
  let g = new THREE.ExtrudeGeometry(sh, {
    depth: Math.max(depth - 2 * b, 0.001),
    bevelEnabled: b > 0,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments,
    curveSegments: Math.max(6, steps * 2),
  });
  g.translate(0, 0, b);
  if (center) g.translate(0, 0, -depth / 2);
  g.deleteAttribute('normal');
  g = crease(g, creaseDeg);
  g.deleteAttribute('uv');
  boxUV(g, uvScale);
  return g;
}

/* ------------------------------------------------------------------ edge tessellation + armor panels */

/** Split every triangle edge longer than maxEdge (consistently, so the mesh stays watertight). */
export function tessellate(positions, indices, maxEdge) {
  const pos = Array.from(positions);
  let idx = Array.from(indices);
  const max2 = maxEdge * maxEdge;
  const key = (a, b) => (a < b ? a * 4194304 + b : b * 4194304 + a);
  for (let iter = 0; iter < 9; iter++) {
    const mid = new Map();
    let any = false;
    const split = (a, b) => {
      const k = key(a, b);
      let m = mid.get(k);
      if (m === undefined) {
        const dx = pos[3 * a] - pos[3 * b], dy = pos[3 * a + 1] - pos[3 * b + 1], dz = pos[3 * a + 2] - pos[3 * b + 2];
        if (dx * dx + dy * dy + dz * dz > max2) {
          m = pos.length / 3;
          pos.push((pos[3 * a] + pos[3 * b]) / 2, (pos[3 * a + 1] + pos[3 * b + 1]) / 2, (pos[3 * a + 2] + pos[3 * b + 2]) / 2);
        } else m = -1;
        mid.set(k, m);
      }
      return m;
    };
    const out = [];
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t], b = idx[t + 1], c = idx[t + 2];
      const ab = split(a, b), bc = split(b, c), ca = split(c, a);
      const n = (ab >= 0) + (bc >= 0) + (ca >= 0);
      if (n === 0) { out.push(a, b, c); continue; }
      any = true;
      if (n === 3) out.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
      else if (n === 1) {
        if (ab >= 0) out.push(a, ab, c, ab, b, c);
        else if (bc >= 0) out.push(a, b, bc, a, bc, c);
        else out.push(a, b, ca, ca, b, c);
      } else if (ab >= 0 && bc >= 0) out.push(ab, b, bc, a, ab, bc, a, bc, c);
      else if (bc >= 0 && ca >= 0) out.push(bc, c, ca, a, b, bc, a, bc, ca);
      else out.push(ca, a, ab, ab, b, c, ab, c, ca);
    }
    idx = out;
    if (!any) break;
  }
  return { positions: new Float32Array(pos), indices: idx };
}

/* Surface mappers: (x, y) in plate millimetres -> { p: Vector3 on surface, n: outward unit normal }. */
export const surf = {
  /** Flat plate: origin + T*x + B*y with normal T x B. */
  plane(origin = V3(), T = V3(1, 0, 0), B = V3(0, 1, 0)) {
    const n = new THREE.Vector3().crossVectors(T, B).normalize();
    return (x, y) => ({ p: origin.clone().addScaledVector(T, x).addScaledVector(B, y), n });
  },
  /**
   * Plate wrapped on an ellipsoid. `dir` is the direction from the centre to the plate centre; `up` hints
   * the plate's +y axis. Plate x/y approximate arc length (azimuthal equidistant mapping).
   */
  ellipsoid({ center = V3(), radii = V3(1, 1, 1), dir = V3(0, 1, 0), up = V3(0, 1, 0), roll = 0 } = {}) {
    const c = center.clone();
    const rad = radii.clone();
    const d0 = dir.clone().normalize();
    const hit = (d) => {
      const q = d.clone().divide(rad);
      const t = 1 / q.length();
      return d.clone().multiplyScalar(t);
    };
    const o = hit(d0);
    const n0 = o.clone().divide(rad).divide(rad).normalize();
    let B = up.clone().addScaledVector(n0, -up.dot(n0));
    if (B.lengthSq() < 1e-8) B = V3(0, 0, 1).addScaledVector(n0, -n0.z);
    B.normalize();
    let T = new THREE.Vector3().crossVectors(B, n0).normalize();
    if (roll) {
      const q = new THREE.Quaternion().setFromAxisAngle(n0, roll * D2R);
      T.applyQuaternion(q); B.applyQuaternion(q);
    }
    const R = o.length();
    return (x, y) => {
      const rho = Math.hypot(x, y) / R;
      let d;
      if (rho < 1e-6) d = n0.clone();
      else {
        const k = Math.sin(rho) / rho;
        d = n0.clone().multiplyScalar(Math.cos(rho)).addScaledVector(T, x / R * k).addScaledVector(B, y / R * k);
      }
      const p = hit(d);
      const n = p.clone().divide(rad).divide(rad).normalize();
      return { p: p.add(c), n };
    };
  },
  /**
   * Plate wrapped on a body of revolution about the X axis with radius profile r(x).
   * Plate x runs along the axis from x0; plate y runs around the circumference from angle theta0
   * (theta 0 = +Y, theta 90deg = +Z). Origin of the axis is `origin`.
   */
  revolvedX(r, { x0 = 0, theta0 = 0, origin = V3() } = {}) {
    return (x, y) => {
      const ax = x0 + x;
      const rr = Math.max(r(ax), 1e-3);
      const h = 1e-3;
      const dr = (r(ax + h) - r(ax - h)) / (2 * h);
      const th = theta0 * D2R + y / rr;
      const cs = Math.cos(th), sn = Math.sin(th);
      const p = V3(ax, rr * cs, rr * sn).add(origin);
      const n = V3(-dr, cs, sn).normalize();
      return { p, n };
    };
  },
  cylinderX(radius, opts = {}) { return surf.revolvedX(() => radius, opts); },
};

/**
 * Armor panel: a bevelled plate of arbitrary outline wrapped onto a curved surface, with thickness and
 * tessellation fine enough to follow the curvature. This is how all shell plating is made.
 *   shape      THREE.Shape or [x,y,r?][] outline in plate millimetres
 *   surface    (x, y) => { p, n }  (see `surf`)
 *   thickness  plate thickness along the surface normal
 *   lift       offset of the plate underside from the surface
 */
export function armorPanel({ shape: sh, holes = [], surface, thickness = 0.4, bevel = 0.1, bevelSegments = 2, lift = 0, maxEdge = 0.7, creaseDeg = 36, uvScale = 0.12, steps = 4 }) {
  const S = Array.isArray(sh) ? shape(sh, holes, { steps }) : sh;
  const b = Math.min(bevel, thickness * 0.45);
  let flat = new THREE.ExtrudeGeometry(S, {
    depth: Math.max(thickness - 2 * b, 0.001),
    bevelEnabled: b > 0,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments,
    curveSegments: Math.max(6, steps * 2),
  });
  flat.translate(0, 0, b);
  flat.deleteAttribute('normal');
  flat.deleteAttribute('uv');
  flat = mergeVertices(flat, 1e-4);
  const { positions, indices } = tessellate(flat.attributes.position.array, flat.index.array, maxEdge / detail.tess);
  flat.dispose();
  const n = positions.length / 3;
  const out = new Float32Array(positions.length);
  const uv = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const x = positions[3 * i], y = positions[3 * i + 1], z = positions[3 * i + 2];
    const s = surface(x, y);
    out[3 * i] = s.p.x + s.n.x * (lift + z);
    out[3 * i + 1] = s.p.y + s.n.y * (lift + z);
    out[3 * i + 2] = s.p.z + s.n.z * (lift + z);
    uv[2 * i] = x * uvScale;
    uv[2 * i + 1] = y * uvScale;
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(out, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(indices);
  g = crease(g, creaseDeg);
  return g;
}

/* ------------------------------------------------------------------ sweeps, springs, hoses */

/**
 * Sweep a circular section along a path. `path` = array of Vector3 / [x,y,z] or a THREE.Curve.
 * `radius` is a number or (u 0..1) => radius. Caps are rounded when `caps` is true.
 */
export function sweep(path, { radius = 0.1, radial = 10, segments = 0, caps = true, closed = false, smooth = true, tension = 0.5 } = {}) {
  const curve = path.isCurve ? path : new THREE.CatmullRomCurve3(path.map(p => p.isVector3 ? p : V3(p[0], p[1], p[2])), closed, 'catmullrom', tension);
  const len = curve.getLength();
  const seg = segments || Math.max(6, Math.ceil(len / 0.35));
  const frames = curve.computeFrenetFrames(seg, closed);
  const rfn = typeof radius === 'function' ? radius : () => radius;
  const pos = [], idx = [];
  const rings = seg + 1;
  for (let i = 0; i < rings; i++) {
    const u = i / seg;
    const c = curve.getPointAt(u);
    const r = rfn(u);
    const N = frames.normals[i], B = frames.binormals[i];
    for (let j = 0; j < radial; j++) {
      const a = j / radial * Math.PI * 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      pos.push(c.x + (N.x * cs + B.x * sn) * r, c.y + (N.y * cs + B.y * sn) * r, c.z + (N.z * cs + B.z * sn) * r);
    }
  }
  const wrap = (j) => j % radial;
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j, b = i * radial + wrap(j + 1), c = (i + 1) * radial + wrap(j + 1), d = (i + 1) * radial + j;
      idx.push(a, b, d, b, c, d);
    }
  }
  if (caps && !closed) {
    for (const end of [0, 1]) {
      const u = end, c = curve.getPointAt(u);
      const t = curve.getTangentAt(u).multiplyScalar(end ? 1 : -1);
      const r = rfn(u);
      const bulge = pos.length / 3;
      const tip = c.clone().addScaledVector(t, r * 0.55);
      pos.push(tip.x, tip.y, tip.z);
      const ring0 = (end ? seg : 0) * radial;
      for (let j = 0; j < radial; j++) {
        const a = ring0 + j, b = ring0 + wrap(j + 1);
        if (end) idx.push(a, b, bulge); else idx.push(b, a, bulge);
      }
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g = crease(g, smooth ? 60 : 20);
  return ensureUV(g);
}

/** Helical coil along +Y. */
export function spring({ radius = 0.5, wire = 0.07, turns = 6, length = 2, perTurn = 14, radial = 6 } = {}) {
  const pts = [];
  const n = Math.ceil(turns * perTurn);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    pts.push(V3(Math.cos(a) * radius, t * length - length / 2, Math.sin(a) * radius));
  }
  return sweep(pts, { radius: wire, radial, segments: n, caps: true, smooth: true });
}

/** Cable / hose between two points with optional droop and lateral bow. */
export function hose(a, b, { radius = 0.09, sag = 0.4, bow = V3(), radial = 8, bendPoints = 6 } = {}) {
  const A = a.isVector3 ? a : V3(...a), B = b.isVector3 ? b : V3(...b);
  const pts = [];
  for (let i = 0; i <= bendPoints; i++) {
    const t = i / bendPoints;
    const p = A.clone().lerp(B, t);
    const s = Math.sin(t * Math.PI);
    p.y -= sag * s;
    p.addScaledVector(bow, s);
    pts.push(p);
  }
  return sweep(pts, { radius, radial });
}

/* ------------------------------------------------------------------ mechanical details */

export function gearShape({ teeth = 16, rOut = 1, rRoot = 0.82, tip = 0.34, root = 0.46, bore = 0, holes = 0, holeR = 0.1, holeRing = 0.6 } = {}) {
  const pts = [];
  const pitch = Math.PI * 2 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * pitch;
    const rt = pitch * root, tt = pitch * tip;
    pts.push([Math.cos(a - rt) * rRoot, Math.sin(a - rt) * rRoot]);
    pts.push([Math.cos(a - tt) * rOut, Math.sin(a - tt) * rOut]);
    pts.push([Math.cos(a + tt) * rOut, Math.sin(a + tt) * rOut]);
    pts.push([Math.cos(a + rt) * rRoot, Math.sin(a + rt) * rRoot]);
  }
  const hs = [];
  if (bore > 0) hs.push(circleHole(bore));
  const hr = rRoot * holeRing;
  for (let i = 0; i < holes; i++) { const a = i / holes * Math.PI * 2; hs.push(circleHole(holeR, Math.cos(a) * hr, Math.sin(a) * hr)); }
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  s.holes.push(...hs);
  return s;
}

/** Spur gear lying in the XY plane, centred, extruded along Z. */
export function gear(opts = {}, thickness = 0.4, bevel = 0.04) {
  return plate(gearShape(opts), thickness, { bevel, center: true, bevelSegments: 1, steps: 2, creaseDeg: 45 });
}

/** Socket-head screw, head up (+Y), shank discarded. Intended for instancing. */
export function screw(r = 0.16, h = 0.12) {
  return revolve([[0, 0], [r, 0, 0.01], [r, h, r * 0.35], [r * 0.5, h], [r * 0.5, h - h * 0.55], [0, h - h * 0.55]], { segments: 14, steps: 2 });
}
export function hexNut(r = 0.2, h = 0.14) {
  const g = plate(ngonPts(6, r, Math.PI / 6), h, { bevel: 0.02, center: true, bevelSegments: 1, holes: [circleHole(r * 0.42)] });
  g.rotateX(-Math.PI / 2);
  return g;
}
export function rivet(r = 0.1) {
  const g = new THREE.SphereGeometry(r, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  return g;
}

/** Slotted vent: array of rounded slots in a plate, useful as shape holes. */
export function slotHoles(count, w, h, gap, cx = 0, cy = 0, vertical = true, r = 0.05) {
  const holes = [];
  const total = count * (vertical ? w : h) + (count - 1) * gap;
  for (let i = 0; i < count; i++) {
    const off = -total / 2 + (vertical ? w : h) / 2 + i * ((vertical ? w : h) + gap);
    const x = vertical ? cx + off : cx, y = vertical ? cy : cy + off;
    holes.push(rectPts(w, h, r).map(p => [p[0] + x, p[1] + y, p[2]]));
  }
  return holes;
}

/* ------------------------------------------------------------------ compound eye (Goldberg dome) */

/**
 * Hexagonally faceted dome: the dual of a subdivided icosahedron, so cells are hexagons (with 12 pentagons)
 * and each facet is its own slightly convex lens that glints independently. The cap is centred on +Y.
 * `cap` = angular radius of the dome in degrees; `gap` = fraction of each cell removed to leave a dark groove;
 * `bulge` = lens height as a fraction of the cell spacing; `lens` = how strongly normals fan out from the cell centre.
 * Returns { geometry, cells }.
 */
export function facetedDome({ radius = 3, freq = 14, cap = 100, gap = 0.1, bulge = 0.2, lens = 0.6, squash = [1, 1, 1] } = {}) {
  const ico = new THREE.IcosahedronGeometry(1, freq - 1);
  ico.deleteAttribute('normal'); ico.deleteAttribute('uv');
  const merged = mergeVertices(ico, 1e-5);
  const P = merged.attributes.position;
  const I = merged.index.array;
  const V = P.count;
  const verts = [];
  for (let i = 0; i < V; i++) verts.push(V3(P.getX(i), P.getY(i), P.getZ(i)).normalize());
  const around = Array.from({ length: V }, () => []);
  const tris = [];
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t], b = I[t + 1], c = I[t + 2];
    const cen = verts[a].clone().add(verts[b]).add(verts[c]).normalize();
    const ti = tris.length;
    tris.push(cen);
    around[a].push(ti); around[b].push(ti); around[c].push(ti);
  }
  const capCos = Math.cos(cap * D2R);
  const pos = [], nor = [], idx = [];
  const [sx, sy, sz] = squash;
  const up = V3(0, 1, 0);
  const spacing = 1.107 / freq;
  const height = bulge * spacing * radius;
  const k = 1 - gap;
  const addV = (p, n) => {
    pos.push(p.x * sx, p.y * sy, p.z * sz);
    const nx = n.x / sx, ny = n.y / sy, nz = n.z / sz;
    const l = Math.hypot(nx, ny, nz) || 1;
    nor.push(nx / l, ny / l, nz / l);
    return pos.length / 3 - 1;
  };
  let cells = 0;
  for (let v = 0; v < V; v++) {
    const c = verts[v];
    if (c.dot(up) < capCos) continue;
    const ring = around[v].map(ti => tris[ti]);
    let ref = V3(0, 0, 1).addScaledVector(c, -c.z);
    if (ref.lengthSq() < 1e-6) ref = V3(1, 0, 0);
    ref.normalize();
    const side = new THREE.Vector3().crossVectors(c, ref);
    ring.sort((p, q) => Math.atan2(p.dot(side), p.dot(ref)) - Math.atan2(q.dot(side), q.dot(ref)));
    const m = ring.length;
    const centre = addV(c.clone().multiplyScalar(radius + height), c);
    const top = [], skTop = [], skBot = [];
    for (const q of ring) {
      const dir = c.clone().lerp(q, k).normalize();
      const tan = dir.clone().addScaledVector(c, -dir.dot(c)).normalize();
      const p = dir.clone().multiplyScalar(radius);
      top.push(addV(p, c.clone().addScaledVector(tan, lens).normalize()));
      skTop.push(addV(p, tan));
      skBot.push(addV(dir.clone().multiplyScalar(radius * 0.94), tan));
    }
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      idx.push(centre, top[i], top[j]);
      idx.push(skTop[i], skBot[i], skTop[j], skTop[j], skBot[i], skBot[j]);
    }
    cells++;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return { geometry: ensureUV(g), cells };
}

/* ------------------------------------------------------------------ instancing helpers */

/**
 * Build an InstancedMesh from a geometry. Each item: { p:[x,y,z], n?:[x,y,z] (geometry +Y maps to n), s?: scale, r?: roll radians, sv?: [sx,sy,sz] }.
 */
export function instances(geo, mat, items, { cast = true, receive = true } = {}) {
  const m = new THREE.InstancedMesh(geo, mat, items.length);
  const o = new THREE.Object3D();
  const up = V3(0, 1, 0);
  const q = new THREE.Quaternion();
  items.forEach((it, i) => {
    o.position.set(it.p[0], it.p[1], it.p[2]);
    if (it.n) {
      const n = V3(it.n[0], it.n[1], it.n[2]).normalize();
      q.setFromUnitVectors(up, n);
      o.quaternion.copy(q);
    } else o.quaternion.identity();
    if (it.r) o.rotateY(it.r);
    if (it.sv) o.scale.set(it.sv[0], it.sv[1], it.sv[2]);
    else o.scale.setScalar(it.s ?? 1);
    o.updateMatrix();
    m.setMatrixAt(i, o.matrix);
  });
  m.instanceMatrix.needsUpdate = true;
  m.castShadow = cast;
  m.receiveShadow = receive;
  m.computeBoundingSphere();
  return m;
}

/** Points on a circle in a plane defined by axis: 'x' (YZ plane), 'y' (XZ), 'z' (XY). */
export function ringPoints(n, radius, { axis = 'x', center = [0, 0, 0], phase = 0, outward = true } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = phase + i / n * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    let p, nrm;
    if (axis === 'x') { p = [0, c * radius, s * radius]; nrm = [0, c, s]; }
    else if (axis === 'y') { p = [c * radius, 0, s * radius]; nrm = [c, 0, s]; }
    else { p = [c * radius, s * radius, 0]; nrm = [c, s, 0]; }
    out.push({ p: [p[0] + center[0], p[1] + center[1], p[2] + center[2]], n: outward ? nrm : [-nrm[0], -nrm[1], -nrm[2]] });
  }
  return out;
}

export function merge(list) {
  const g = mergeGeometries(list.map(x => { const c = x.index ? x.toNonIndexed() : x; return c; }), false);
  return g;
}

export function bounds(geo) {
  geo.computeBoundingBox();
  return geo.boundingBox;
}
