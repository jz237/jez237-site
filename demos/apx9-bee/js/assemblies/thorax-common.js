// Thorax assembly: shared frames, surface maths and small helpers (no parts are created here).
import { THREE, V3, K, D2R, M4, rng, screw, hexNut, rivet, S } from '../kit.js';

export const TC = K.thorax.c;                     // thorax centre
export const TR = K.thorax.r;                     // armour ellipsoid radii (4.3, 4.2, 4.2)
export const ROOT = K.wing.root;
export const SPAN = K.wing.span2;
export const LEAD = K.wing.lead;
export const WNORM = K.wing.normal;
export const BELLY = -1.2;                        // armour belly line (y)

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const mirrorV = (p) => V3(p.x, p.y, -p.z);

/* ------------------------------------------------------------------ ellipsoid helpers */
/** Point on the armour ellipsoid (scaled by k about the centre) in direction d from the centre. */
export function ellHit(d, k = 1, radii = TR, center = TC) {
  const t = 1 / d.clone().divide(radii).length();
  return d.clone().multiplyScalar(t * k).add(center);
}
/** Outward unit normal of the ellipsoid at p. */
export function ellNormal(p, radii = TR, center = TC) {
  return p.clone().sub(center).divide(radii).divide(radii).normalize();
}
/** Half-height of the thorax cross-section (circle) at x, relative to the thorax centre line (y = 0.8). */
export const secR = (x) => { const u = (x - TC.x) / TR.x; return u * u >= 1 ? 0 : TR.y * Math.sqrt(1 - u * u); };

/** Plate frame on the ellipsoid (same maths as surf.ellipsoid) plus the inverse map 3D -> plate (x, y). */
export function plateFrame({ dir, up = V3(0, 1, 0), roll = 0, radii = TR, center = TC }) {
  const c = center.clone(), rad = radii.clone();
  const hit = (d) => { const t = 1 / d.clone().divide(rad).length(); return d.clone().multiplyScalar(t); };
  const o = hit(dir.clone().normalize());
  const n0 = o.clone().divide(rad).divide(rad).normalize();
  let B = up.clone().addScaledVector(n0, -up.dot(n0));
  if (B.lengthSq() < 1e-8) B = V3(0, 0, 1).addScaledVector(n0, -n0.z);
  B.normalize();
  const T = new THREE.Vector3().crossVectors(B, n0).normalize();
  if (roll) {
    const q = new THREE.Quaternion().setFromAxisAngle(n0, roll * D2R);
    T.applyQuaternion(q); B.applyQuaternion(q);
  }
  const R = o.length();
  const surface = (x, y) => {
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
  const toPlate = (p) => {
    const d = p.clone().sub(c).normalize();
    const dt = d.dot(T), db = d.dot(B), dn = d.dot(n0);
    const s = Math.hypot(dt, db);
    if (s < 1e-9) return [0, 0];
    const rho = Math.atan2(s, dn);
    return [R * rho * dt / s, R * rho * db / s];
  };
  /** Local frame at a plate point: Matrix4 with x along plate +x, y along plate +y, z = surface normal, origin lifted. */
  const frameAt = (x, y, lift = 0, rotDeg = 0) => {
    const h = 0.05;
    const s0 = surface(x, y);
    const ex = surface(x + h, y).p.sub(surface(x - h, y).p).normalize();
    let ey = surface(x, y + h).p.sub(surface(x, y - h).p).normalize();
    const n = s0.n.clone();
    ey = new THREE.Vector3().crossVectors(n, ex).normalize();
    const exo = new THREE.Vector3().crossVectors(ey, n).normalize();
    const m = new THREE.Matrix4().makeBasis(exo, ey, n).setPosition(s0.p.clone().addScaledVector(n, lift));
    if (rotDeg) m.multiply(new THREE.Matrix4().makeRotationZ(rotDeg * D2R));
    return m;
  };
  return { surface, toPlate, frameAt, n0, T, B, R, o };
}

/* ------------------------------------------------------------------ wing aperture geometry */
/** Distance of p from the wing span axis (side +1 right, -1 left via mirroring). */
export function apRho(p, side = 1) {
  const z = side > 0 ? p.z : -p.z;
  const qx = p.x - ROOT.x, qy = p.y - ROOT.y, qz = z - ROOT.z;
  const t = qx * SPAN.x + qy * SPAN.y + qz * SPAN.z;
  return Math.sqrt(Math.max(0, qx * qx + qy * qy + qz * qz - t * t));
}
/** Signed distance along the span axis from the root. */
export function apS(p, side = 1) {
  const z = side > 0 ? p.z : -p.z;
  return (p.x - ROOT.x) * SPAN.x + (p.y - ROOT.y) * SPAN.y + (z - ROOT.z) * SPAN.z;
}

/**
 * Footprint of an implicit region on a plate frame: polar polygon around a plate point, found by ray bisection on
 * f(p) < 0. Returns { cx, cy, r:[...], n, pts:[[x,y]...] } so it can be used to carve outlines.
 */
export function footprint(frame, fn, c0, { n = 144, maxR = 6.5 } = {}) {
  const [cx, cy] = c0;
  const r = [], pts = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    let lo = 0, hi = maxR;
    for (let k = 0; k < 26; k++) {
      const mid = (lo + hi) / 2;
      if (fn(frame.surface(cx + mid * ca, cy + mid * sa).p) < 0) lo = mid; else hi = mid;
    }
    r.push(lo);
    pts.push([cx + lo * ca, cy + lo * sa]);
  }
  return { cx, cy, r, n, pts };
}
/** Footprint of the wing-aperture cylinder (radius rho) on a plate frame. */
export function apFootprint(frame, rho, side = 1, opts) {
  const c0 = frame.toPlate(side > 0 ? ROOT : mirrorV(ROOT));
  return footprint(frame, (p) => apRho(p, side) - rho, c0, opts);
}
/** Radius of a footprint boundary in direction angle a (linear interpolation). */
export function fpRadius(fp, a) {
  let t = a / (Math.PI * 2);
  t -= Math.floor(t);
  const f = t * fp.n, i = Math.floor(f) % fp.n, j = (i + 1) % fp.n, w = f - Math.floor(f);
  return fp.r[i] * (1 - w) + fp.r[j] * w;
}

/** Densify a closed polyline so no segment is longer than maxLen. */
export function densify(poly, maxLen = 0.12) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.ceil(L / maxLen));
    for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
  }
  return out;
}
/** Push every outline point that lies inside a footprint radially out to its boundary (+margin). */
export function carve(poly, fps, margin = 0) {
  return poly.map(([x, y]) => {
    let px = x, py = y;
    for (const fp of fps) {
      const dx = px - fp.cx, dy = py - fp.cy;
      const d = Math.hypot(dx, dy);
      const R = fpRadius(fp, Math.atan2(dy, dx)) + margin;
      if (d < R) {
        if (d < 1e-6) { px = fp.cx + R; py = fp.cy; } else { px = fp.cx + dx / d * R; py = fp.cy + dy / d * R; }
      }
    }
    return [px, py];
  });
}
/** Drop consecutive duplicate points (and collinear runs) from a closed polyline. */
export function tidy(poly, eps = 1e-4) {
  const out = [];
  for (const p of poly) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > eps) out.push(p);
  }
  while (out.length > 2 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) <= eps) out.pop();
  return out;
}
export function pip(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
export function distPoly(poly, x, y) {
  let best = 1e9;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j], [bx, by] = poly[i];
    const vx = bx - ax, vy = by - ay;
    const L2 = vx * vx + vy * vy;
    const t = L2 > 0 ? clamp(((x - ax) * vx + (y - ay) * vy) / L2) : 0;
    best = Math.min(best, Math.hypot(x - (ax + vx * t), y - (ay + vy * t)));
  }
  return best;
}
export const polyArea = (poly) => { let a = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1]); return a / 2; };
/** Ensure counter-clockwise winding. */
export const ccw = (poly) => (polyArea(poly) < 0 ? poly.slice().reverse() : poly);
/** Offset a closed polyline along its local normals (cheap, fine for small distances on smooth outlines). */
export function inset(poly, d) {
  const P = ccw(poly), n = P.length, out = [];
  for (let i = 0; i < n; i++) {
    const a = P[(i - 1 + n) % n], b = P[(i + 1) % n];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const L = Math.hypot(tx, ty) || 1;
    tx /= L; ty /= L;
    out.push([P[i][0] + ty * d, P[i][1] - tx * d]);   // inward for CCW polygons (d > 0)
  }
  return out;
}

/* ------------------------------------------------------------------ 2D outline builders */
/** Rounded-rectangle-ish outline with different half widths at the two ends (y0 rear .. y1 front). */
export function shieldPts(y0, y1, w0, w1, { r = 0.3, bulge = 0.0, n = 18, wmid = null } = {}) {
  const pts = [];
  const wm = wmid ?? Math.max(w0, w1);
  const half = (y) => {
    const t = (y - y0) / (y1 - y0);
    const lin = lerp(w0, w1, t);
    return lin + (wm - lin) * bulge * Math.sin(Math.PI * t);
  };
  for (let i = 0; i <= n; i++) { const y = lerp(y0, y1, i / n); pts.push([half(y), y]); }
  for (let i = n; i >= 0; i--) { const y = lerp(y0, y1, i / n); pts.push([-half(y), y]); }
  return roundCorners(pts, r);
}
/** Round the corners of a closed polygon by chamfer-arc substitution (pts as [x,y]). */
export function roundCorners(pts, r = 0.2, steps = 4) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]];
    const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2);
    if (l1 < 1e-9 || l2 < 1e-9) { out.push(p); continue; }
    const c = (v1[0] * v2[0] + v1[1] * v2[1]) / (l1 * l2);
    const ang = Math.acos(clamp(c, -1, 1));
    if (ang > 2.9 || ang < 0.2) { out.push(p); continue; }          // nearly straight, or degenerate
    const t = Math.min(r / Math.tan(ang / 2), l1 * 0.45, l2 * 0.45);
    const t1 = [p[0] + v1[0] / l1 * t, p[1] + v1[1] / l1 * t], t2 = [p[0] + v2[0] / l2 * t, p[1] + v2[1] / l2 * t];
    for (let k = 0; k <= steps; k++) {
      const s = k / steps;
      const q1 = [lerp(t1[0], p[0], s), lerp(t1[1], p[1], s)], q2 = [lerp(p[0], t2[0], s), lerp(p[1], t2[1], s)];
      out.push([lerp(q1[0], q2[0], s), lerp(q1[1], q2[1], s)]);        // quadratic bezier corner
    }
  }
  return out;
}
export function ellipsePts(rx, ry, n = 40, cx = 0, cy = 0, rot = 0) {
  const out = [], cs = Math.cos(rot), sn = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    out.push([cx + x * cs - y * sn, cy + x * sn + y * cs]);
  }
  return out;
}
/** Annular sector polygon (CCW): angles in degrees, radii inner/outer. */
export function sectorPts(rIn, rOut, a0, a1, n = 28) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = (lerp(a0, a1, i / n)) * D2R; out.push([Math.cos(a) * rOut, Math.sin(a) * rOut]); }
  for (let i = n; i >= 0; i--) { const a = (lerp(a0, a1, i / n)) * D2R; out.push([Math.cos(a) * rIn, Math.sin(a) * rIn]); }
  return out;
}

/* ------------------------------------------------------------------ transforms */
const UP = V3(0, 1, 0);
/** Matrix: geometry +Y -> `up`, placed at p, optional spin about `up` (deg) and uniform / vector scale. */
export function placeUp(p, up, spinDeg = 0, s = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, up.clone().normalize());
  if (spinDeg) q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, spinDeg * D2R));
  return new THREE.Matrix4().compose(p, q, typeof s === 'number' ? V3(s, s, s) : s);
}
/** Basis matrix with the given axes (need not be orthonormal-checked) and origin. */
export function basisM(x, y, z, o = V3()) {
  return new THREE.Matrix4().makeBasis(x, y, z).setPosition(o);
}
/** Frame whose +Y is `axis` (a stable x chosen from `hint`), origin o. */
export function axisFrame(o, axis, hint = V3(1, 0, 0)) {
  const y = axis.clone().normalize();
  let x = hint.clone().addScaledVector(y, -hint.dot(y));
  if (x.lengthSq() < 1e-6) x = V3(0, 0, 1).addScaledVector(y, -y.z);
  x.normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  return basisM(x, y, z, o);
}
/** Frame for a 'plate' (extruded along +Z, shape in XY) lying across the wing span axis at signed distance s. */
export function wingPlateFrame(s0 = 0, side = 1) {
  const o = ROOT.clone().addScaledVector(SPAN, s0);
  const m = basisM(LEAD, WNORM, SPAN, o);
  if (side < 0) return new THREE.Matrix4().makeScale(1, 1, -1).multiply(m);
  return m;
}
/** Frame whose +Y is the wing span axis (for revolve geometry), x = lead edge direction. */
export function wingAxisFrame(s0 = 0) {
  const o = ROOT.clone().addScaledVector(SPAN, s0);
  return basisM(LEAD, SPAN, WNORM.clone().negate(), o);       // x, y, z right-handed: lead x span = -normal
}

/* ------------------------------------------------------------------ fasteners */
export function makeShared() {
  return {
    screwXS: screw(0.06, 0.05),
    screwS: screw(0.085, 0.07),
    screwM: screw(0.12, 0.1),
    screwL: screw(0.17, 0.13),
    nutS: hexNut(0.14, 0.1),
    nutM: hexNut(0.2, 0.14),
    rivetS: rivet(0.06),
    rivetM: rivet(0.09),
  };
}
/** n fasteners on a circle: centre c, plane normal `axis`, reference direction u (in plane), radius r. */
export function boltRing(part, geo, mat, { c, axis, u, r, n, phase = 0, s = 1, lift = 0, spin = 0, skip = null }) {
  const a = axis.clone().normalize();
  const uu = u.clone().addScaledVector(a, -u.dot(a)).normalize();
  const vv = new THREE.Vector3().crossVectors(a, uu);
  for (let i = 0; i < n; i++) {
    if (skip && skip(i)) continue;
    const ang = phase * D2R + i / n * Math.PI * 2;
    const p = c.clone().addScaledVector(uu, Math.cos(ang) * r).addScaledVector(vv, Math.sin(ang) * r).addScaledVector(a, lift);
    part.add(geo, mat, placeUp(p, a, spin + (i * 37) % 90, s));
  }
}

/* ------------------------------------------------------------------ wing-hub polar coordinates (rho, az) */
// Around each wing root the armour is described in polar form: rho = distance from the span axis, az = angle about it
// (0 = leading edge direction, 90 = WNORM = up/inboard (waist side), 180 = trailing, 270 = down/outboard).
const _R2 = V3(1 / (TR.x * TR.x), 1 / (TR.y * TR.y), 1 / (TR.z * TR.z));
/** Point on the (optionally scaled) armour ellipsoid at hub coords (rho, az); null when the axis-parallel line misses. side -1 = left. */
export function hubSurface(rho, az, side = 1, k = 1) {
  const u = LEAD.clone().multiplyScalar(Math.cos(az)).addScaledVector(WNORM, Math.sin(az));
  const q0 = ROOT.clone().addScaledVector(u, rho).sub(TC);
  const rx = TR.x * k, ry = TR.y * k, rz = TR.z * k;
  const a = (SPAN.x / rx) ** 2 + (SPAN.y / ry) ** 2 + (SPAN.z / rz) ** 2;
  const b = 2 * (q0.x * SPAN.x / (rx * rx) + q0.y * SPAN.y / (ry * ry) + q0.z * SPAN.z / (rz * rz));
  const c = (q0.x / rx) ** 2 + (q0.y / ry) ** 2 + (q0.z / rz) ** 2 - 1;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const s = (-b + Math.sqrt(disc)) / (2 * a);
  const p = ROOT.clone().addScaledVector(u, rho).addScaledVector(SPAN, s);
  const n = p.clone().sub(TC).multiply(_R2).normalize();
  if (side < 0) { p.z = -p.z; n.z = -n.z; }
  return { p, n, s, u };
}
/** Inverse of hubSurface for a point near the hub: { rho, az, s } (right-hand maths; side -1 mirrors z first). */
export function hubCoords(p, side = 1) {
  const z = side > 0 ? p.z : -p.z;
  const rel = V3(p.x - ROOT.x, p.y - ROOT.y, z - ROOT.z);
  const s = rel.dot(SPAN);
  rel.addScaledVector(SPAN, -s);
  return { rho: rel.length(), az: Math.atan2(rel.dot(WNORM), rel.dot(LEAD)), s };
}
/** Sheet mesh over a hub-polar domain: fn(az) -> [rhoIn, rhoOut]; the cross-section profile is a list of [t, h] (t 0..1 across the width, h = height along the normal). */
export function hubRing({ side = 1, az0 = 0, az1 = Math.PI * 2, naz = 96, width, profile, k = 1, lift = 0, closed = null, loop = false, flip = false }) {
  const full = closed ?? Math.abs(az1 - az0 - Math.PI * 2) < 1e-6;
  const cols = full ? naz : naz + 1;
  const m = profile.length;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i < cols; i++) {
    const az = az0 + (az1 - az0) * i / naz;
    const [r0, r1] = width(az);
    for (let j = 0; j < m; j++) {
      const [t, h] = profile[j];
      const rho = r0 + (r1 - r0) * t;
      const sf = hubSurface(rho, az, side, k);
      if (!sf) { pos.push(0, 0, 0); uv.push(0, 0); continue; }
      const q = sf.p.clone().addScaledVector(sf.n, lift + h);
      pos.push(q.x, q.y, q.z);
      uv.push(az * 1.2, rho * 0.8);
    }
  }
  const cm = (i) => (full ? i % cols : Math.min(i, cols - 1));
  for (let i = 0; i < (full ? cols : cols - 1); i++) {
    const i1 = cm(i + 1);
    for (let j = 0; j < (loop ? m : m - 1); j++) {
      const j1 = (j + 1) % m;
      const a = i * m + j, b = i1 * m + j, c = i1 * m + j1, d = i * m + j1;
      if ((side > 0) === flip) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);   // side>0: outward (+SPAN) normals for profile t/rho increasing
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}


/* ------------------------------------------------------------------ plate helpers */
/** Wrap a surface(x,y) -> {p,n} so it carries a height field h(x,y) (mm along the normal). */
export function raised(surface, h) {
  return (x, y) => { const s = surface(x, y); const d = h(x, y); if (d) s.p.addScaledVector(s.n, d); return s; };
}
/** Matrix placing a +Y-up fastener at plate point (x,y), lifted by `lift` along the normal (h = optional height field). */
export function studXf(frame, x, y, lift = 0, { spin = 0, s = 1, h = null } = {}) {
  const sf = frame.surface(x, y);
  const hh = (h ? h(x, y) : 0) + lift;
  return placeUp(sf.p.addScaledVector(sf.n, hh), sf.n, spin, s);
}
/** Plate-aligned matrix (x along plate x, y along plate y, z normal) at plate point, lifted, spun about the normal. */
export function plateXf(frame, x, y, lift = 0, rotDeg = 0, h = null) {
  return frame.frameAt(x, y, lift + (h ? h(x, y) : 0), rotDeg);
}
/** Monotone-ish smooth interpolation through table rows [x, v0, v1...] (Catmull-Rom); returns array of values. */
export function tableFn(rows) {
  const n = rows.length, k = rows[0].length - 1;
  return (x) => {
    if (x <= rows[0][0]) return rows[0].slice(1);
    if (x >= rows[n - 1][0]) return rows[n - 1].slice(1);
    let i = 0;
    while (i < n - 2 && x > rows[i + 1][0]) i++;
    const r0 = rows[Math.max(0, i - 1)], r1 = rows[i], r2 = rows[i + 1], r3 = rows[Math.min(n - 1, i + 2)];
    const t = (x - r1[0]) / (r2[0] - r1[0]);
    const out = [];
    for (let j = 1; j <= k; j++) {
      const m1 = (r2[j] - r0[j]) / Math.max(1e-6, r2[0] - r0[0]) * (r2[0] - r1[0]);
      const m2 = (r3[j] - r1[j]) / Math.max(1e-6, r3[0] - r1[0]) * (r2[0] - r1[0]);
      const t2 = t * t, t3 = t2 * t;
      out.push((2 * t3 - 3 * t2 + 1) * r1[j] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * r2[j] + (t3 - t2) * m2);
    }
    return out;
  };
}
/** Surface point of the right flank at world (x, y): z from the armour ellipsoid; null when outside. */
export function flankPoint(xw, yw, k = 1) {
  const a = (xw - TC.x) / (TR.x * k), b = (yw - TC.y) / (TR.y * k);
  const q = 1 - a * a - b * b;
  if (q <= 0) return null;
  return V3(xw, yw, TR.z * k * Math.sqrt(q));
}

/* ------------------------------------------------------------------ noise (deterministic) */
const hash3 = (ix, iy, iz) => {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
/** Value noise in [0,1]. */
export function vnoise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), sz = fz * fz * (3 - 2 * fz);
  const c = (dx, dy, dz) => hash3(ix + dx, iy + dy, iz + dz);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), sx), x10 = lerp(c(0, 1, 0), c(1, 1, 0), sx);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), sx), x11 = lerp(c(0, 1, 1), c(1, 1, 1), sx);
  return lerp(lerp(x00, x10, sy), lerp(x01, x11, sy), sz);
}

export { THREE, V3, K, D2R, M4, rng, S };
