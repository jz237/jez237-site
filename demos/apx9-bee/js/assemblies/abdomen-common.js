// Abdomen helpers: body-of-revolution maths (the shell profile K.abdomen.R), a loop lathe with analytic normals,
// plate surfaces that follow the shell, decal patches that sample an atlas, and small instancing helpers.
// Abdomen-local frame: a point at distance a behind the petiole is (-a, R(a) cos phi, R(a) * A * sin phi).
//   phi = 0 dorsal (+Y), +90 deg = bee-right (+Z), 180 ventral, -90 bee-left.
import { THREE, V3, K, S, D2R, fillet, armorPanel, rectPts, revolve, plate, ex } from '../kit.js';

export const A = K.abdomen.aspect;
export const R = K.abdomen.R;
export const TAU = Math.PI * 2;
export const Rp = (a) => (R(a + 5e-4) - R(a - 5e-4)) / 1e-3;

/** Point on the shell at (a, phi), radially offset by `off` (mm). */
export const P = (a, phi, off = 0, asp = A) => {
  const r = R(a) + off;
  return V3(-a, r * Math.cos(phi), r * asp * Math.sin(phi));
};
/** Outward unit normal of the shell at (a, phi). */
export const Nout = (a, phi) => V3(A * R(a) * Rp(a), A * R(a) * Math.cos(phi), R(a) * Math.sin(phi)).normalize();
/** Unit tangent pointing tailward (increasing a) along the meridian. */
export const Tail = (a, phi) => V3(-1, Rp(a) * Math.cos(phi), A * Rp(a) * Math.sin(phi)).normalize();

/* ------------------------------------------------------------------ meridian arc-length table */
const tabCache = new Map();
export function arcTable(phi) {
  const key = phi.toFixed(3);
  if (tabCache.has(key)) return tabCache.get(key);
  const n = 580, a1 = K.abdomen.len;
  const k2 = Math.cos(phi) ** 2 + (A * Math.sin(phi)) ** 2;
  const s = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) {
    const am = ((i - 0.5) / n) * a1;
    const rp = Rp(am);
    s[i] = s[i - 1] + (a1 / n) * Math.sqrt(1 + rp * rp * k2);
  }
  const sOf = (a) => {
    const u = Math.min(Math.max(a / a1, 0), 1) * n, i = Math.min(Math.floor(u), n - 1);
    return s[i] + (s[i + 1] - s[i]) * (u - i);
  };
  const aOf = (v) => {
    if (v <= 0) return v;                      // extrapolate with unit slope in front of the petiole
    if (v >= s[n]) return a1 + (v - s[n]);
    let lo = 0, hi = n;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (s[mid] <= v) lo = mid; else hi = mid; }
    const f = (v - s[lo]) / (s[hi] - s[lo]);
    return ((lo + f) / n) * a1;
  };
  const t = { sOf, aOf };
  tabCache.set(key, t);
  return t;
}

/**
 * Plate surface for armorPanel / decals, centred on (aRef, phi0Deg). Plate x runs along the meridian by arc length
 * (sa = +1: tailward, -1: forward), plate y around the circumference (sp = +1: increasing phi). armorPanel does not
 * flip the winding, so sa * sp must be +1.
 *   bee-right flank, text upright, head to the right:  phi0 = 90,  sa = -1, sp = -1
 *   bee-left flank:                                    phi0 = -90, sa = +1, sp = +1
 *   dorsal / ventral:                                  sa = +1, sp = +1
 */
export function makeSurface(phi0Deg, sa, sp, aRef, off = 0) {
  const phi0 = phi0Deg * D2R;
  const tab = arcTable(phi0);
  const s0 = tab.sOf(aRef);
  const k = Math.sqrt(Math.sin(phi0) ** 2 + (A * Math.cos(phi0)) ** 2);
  const build = (o, cx, cy) => {
    const fn = (x, y) => {
      const a = tab.aOf(s0 + sa * (x + cx));
      const phi = phi0 + (sp * (y + cy)) / (R(a) * k);
      return { p: P(a, phi, o), n: Nout(a, phi) };
    };
    /** chart coordinates (relative to this surface's origin) of the point at (a, phi in degrees) */
    fn.inv = (a, phiDeg) => [sa * (tab.sOf(a) - s0) - cx, sp * (phiDeg * D2R - phi0) * R(a) * k - cy];
    /** the same chart with a different radial offset / shifted origin (plate coordinates of the new origin) */
    fn.off = (o2) => build(o2, cx, cy);
    fn.at = (dx, dy) => build(o, cx + dx, cy + dy);
    fn.sa = sa; fn.sp = sp; fn.phi0 = phi0Deg; fn.aRef = aRef;
    return fn;
  };
  return build(off, 0, 0);
}

/** Map [a, phiDeg, filletR?] outline points into a chart's plate coordinates. */
export const chartPts = (surface, pts) => pts.map((q) => { const [x, y] = surface.inv(q[0], q[1]); return q.length > 2 ? [x, y, q[2]] : [x, y]; });

/** Instancing items for (a, phiDeg) points on a chart: { p, n, s }. side flips phi (left flank). */
export function onChart(surface, pts, o = {}) {
  const side = o.side ?? 1;
  return onSurface(surface, pts.map((q) => surface.inv(q[0], q[1] * side)), o);
}

/**
 * Armour plate whose outline is given as [a, psi, filletR?] points (psi in degrees; multiplied by `side` so one
 * outline serves both flanks). The outer face sits `outer` mm from the nominal shell profile, `thick` thick.
 */
export function plateAP(chart, outline, o = {}) {
  const { holes = [], holesChart = [], thick = 0.16, outer = 0, side = 1, bevel = 0.05, ...rest } = o;
  const conv = (pts) => chartPts(chart, pts.map((q) => (q.length > 2 ? [q[0], q[1] * side, q[2]] : [q[0], q[1] * side])));
  return armorPanel({ shape: conv(outline), holes: [...holes.map(conv), ...holesChart], surface: chart.off(outer - thick), thickness: thick, bevel, ...rest });
}

/**
 * Local frame on a chart at (a, psi): x along the chart's x (plate x), y along plate y, z = outward normal, translated
 * `lift` along the normal. Use it as the xf of part.add() to place hinges, hatches, latches on the shell.
 */
export function frameAt(chart, a, psi, { side = 1, lift = 0, roll = 0 } = {}) {
  const [x, y] = chart.inv(a, psi * side);
  const e = 0.04;
  const c = chart(x, y), cx = chart(x + e, y), cy = chart(x, y + e);
  const N = c.n.clone();
  const Tx = cx.p.clone().sub(c.p), Ty = cy.p.clone().sub(c.p);
  const T = Tx.addScaledVector(N, -Tx.dot(N)).normalize();
  const B = new THREE.Vector3().crossVectors(N, T).normalize();
  void Ty;
  const m = new THREE.Matrix4().makeBasis(T, B, N);
  if (roll) m.multiply(new THREE.Matrix4().makeRotationZ(roll));
  m.setPosition(c.p.clone().addScaledVector(N, lift));
  return m;
}

/** Rounded rectangle outline in (a, psi) space: centre (a, psi), half sizes (da, dpsi), corner radius in chart mm. */
export const rectAP = (a, psi, da, dpsi, r = 0.1) => [[a - da, psi - dpsi, r], [a + da, psi - dpsi, r], [a + da, psi + dpsi, r], [a - da, psi + dpsi, r]];

/** Circle outline in (a, psi) space: radius in mm of chart space (converted using the local scale). */
export function circleAP(chart, a, psi, rad, n = 18, side = 1) {
  const [cx, cy] = chart.inv(a, psi * side);
  const pts = [];
  for (let i = 0; i < n; i++) pts.push([cx + Math.cos((i / n) * TAU) * rad, cy + Math.sin((i / n) * TAU) * rad]);
  return pts;
}

/**
 * Decal patch geometry sampling a sub-rectangle [u0, v0, u1, v1] of an atlas texture. rot = quarter turns of the
 * image on the plate (1: reads bottom to top, 3: top to bottom). w, h are plate dimensions (x, y).
 */
export function decalGeo(surface, w, h, uvRect = [0, 0, 1, 1], { lift = 0.03, radius = 0, maxEdge = 0.4, rot = 0 } = {}) {
  const g = armorPanel({ shape: rectPts(w, h, radius), surface, thickness: 0.01, bevel: 0, bevelSegments: 1, lift, maxEdge, creaseDeg: 180, uvScale: 1 });
  const uv = g.attributes.uv;
  const [u0, v0, u1, v1] = uvRect;
  for (let i = 0; i < uv.count; i++) {
    const px = uv.getX(i) / w, py = uv.getY(i) / h;          // -0.5 .. 0.5
    let s = px + 0.5, t = py + 0.5;
    if (rot === 1) { s = py + 0.5; t = 0.5 - px; }
    else if (rot === 2) { s = 0.5 - px; t = 0.5 - py; }
    else if (rot === 3) { s = 0.5 - py; t = px + 0.5; }
    uv.setXY(i, u0 + s * (u1 - u0), v0 + t * (v1 - v0));
  }
  uv.needsUpdate = true;
  return g;
}

/** Standard charts: right / left flank (text upright, head to the screen right on the right flank), dorsal and ventral. */
export const flankChart = (side, aRef = 2.2) => (side > 0 ? makeSurface(90, -1, -1, aRef) : makeSurface(-90, 1, 1, aRef));
export const dorsalChart = (aRef = 2.2) => makeSurface(0, 1, 1, aRef);
export const ventralChart = (aRef = 5.5) => makeSurface(180, 1, 1, aRef);

/** Decal patch centred on (a, psi) of a chart; uv = [u0, v0, u1, v1] from the atlas; side flips psi for the left flank. */
export function decalAt(chart, uv, a, psi, w, h, o = {}) {
  const [cx, cy] = chart.inv(a, psi * (o.side ?? 1));
  return decalGeo(chart.at(cx, cy), w, h, uv, { lift: o.lift ?? 0.02, rot: o.rot ?? 0, radius: o.radius ?? 0, maxEdge: o.maxEdge ?? 0.3 });
}

const RX90 = new THREE.Matrix4().makeRotationX(Math.PI / 2);
/** Like frameAt, but local +Y points out of the surface (screws, rivets, pins, cylinders): geometry built "head up" drops straight in. */
export function frameY(chart, a, psi, o = {}) { return frameAt(chart, a, psi, o).multiply(RX90); }

/** Thin ribbon on a chart along a polyline of chart points [x, y]: panel lines, borders, inlays. Width w, floating `lift` above the surface. */
export function strokeOnChart(chart, pts, { w = 0.04, lift = 0.02, closed = false, maxEdge = 0.25 } = {}) {
  const P2 = [];
  const n = pts.length, ne = closed ? n : n - 1;
  for (let i = 0; i < ne; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]), k = Math.max(1, Math.ceil(l / maxEdge));
    for (let j = 0; j < k; j++) P2.push([p[0] + ((q[0] - p[0]) * j) / k, p[1] + ((q[1] - p[1]) * j) / k]);
  }
  if (!closed) P2.push(pts[n - 1]);
  const m = P2.length;
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i < m; i++) {
    let dx, dy;
    if (!closed && i === 0) { dx = P2[1][0] - P2[0][0]; dy = P2[1][1] - P2[0][1]; }
    else if (!closed && i === m - 1) { dx = P2[m - 1][0] - P2[m - 2][0]; dy = P2[m - 1][1] - P2[m - 2][1]; }
    else { const p0 = P2[(i - 1 + m) % m], p1 = P2[(i + 1) % m]; dx = p1[0] - p0[0]; dy = p1[1] - p0[1]; }
    const l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    for (const s of [-1, 1]) {
      const c = chart(P2[i][0] + nx * w * 0.5 * s, P2[i][1] + ny * w * 0.5 * s);
      pos.push(c.p.x + c.n.x * lift, c.p.y + c.n.y * lift, c.p.z + c.n.z * lift);
      nor.push(c.n.x, c.n.y, c.n.z);
      uv.push(i * 0.1, s * 0.5 + 0.5);
    }
  }
  const ns = closed ? m : m - 1;
  for (let i = 0; i < ns; i++) { const a = 2 * i, b = 2 * ((i + 1) % m); idx.push(a, b, a + 1, a + 1, b, b + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** Constant UV on a solid ink pixel of the decal atlas (stripe bar): lets thin strokes share the ink decal mesh. */
export function inkUV(g, u = 0.375, v = 0.085) {
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, u, v);
  uv.needsUpdate = true;
  return g;
}

/** Outline in (a, psi) space shrunk toward its centroid by `d` mm (approximate inset for panel lines), returned in chart coordinates. */
export function insetAP(chart, outline, d, side = 1) {
  const c = chartPts(chart, outline.map((q) => [q[0], q[1] * side]));
  let cx = 0, cy = 0;
  for (const q of c) { cx += q[0]; cy += q[1]; }
  cx /= c.length; cy /= c.length;
  return c.map((q) => { const dx = q[0] - cx, dy = q[1] - cy, l = Math.hypot(dx, dy) || 1; const k = Math.max(0, l - d) / l; return [cx + dx * k, cy + dy * k]; });
}

/* ------------------------------------------------------------------ loop lathe */
/**
 * Revolve a loop about the abdomen axis. loop = [[a, off, filletRadius?], ...] in the (a, radial) plane.
 *   rel = true  : radius = R(a) + off, cross-section aspect A (hugs the body); rel = false: radius = off (absolute), circular.
 *   closed loops are auto-oriented so the faces point out of the enclosed section (inward: true reverses that).
 *   phi0..phi1  : partial arc (planar end caps are generated for closed loops); default full circle.
 * Normals are analytic (smooth across fillets, hard at corners sharper than `crease` degrees).
 */
export function ringLathe(loop, o = {}) {
  const { seg = 72, phi0 = 0, phi1 = TAU, rel = false, asp = rel ? A : 1, crease = 36, uvScale = 0.12, closed = true, caps = true, inward = false, steps = 3, maxStep = 0.3, minSeg = 12 } = o;
  const full = Math.abs(phi1 - phi0 - TAU) < 1e-6;
  const nPhi = full ? S(seg, minSeg) : Math.max(2, Math.ceil(S(seg, minSeg) * Math.abs(phi1 - phi0) / TAU));
  let pts = fillet(loop, { closed, steps });
  // drop repeated points
  pts = pts.filter((p, i) => { const q = pts[(i + 1) % pts.length]; return !(closed || i < pts.length - 1) || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6; });
  // follow the body profile: subdivide long axial edges
  if (rel) {
    const out = [];
    const m0 = pts.length, ne = closed ? m0 : m0 - 1;
    for (let i = 0; i < ne; i++) {
      const p = pts[i], q = pts[(i + 1) % m0];
      out.push(p);
      const da = Math.abs(q[0] - p[0]);
      const nsub = Math.floor(da / maxStep);
      for (let s = 1; s <= nsub; s++) { const t = s / (nsub + 1); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
    if (!closed) out.push(pts[m0 - 1]);
    pts = out;
  }
  const rad = (p) => (rel ? R(p[0]) : 0) + p[1];
  if (closed) {
    let area = 0;
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; area += p[0] * rad(q) - q[0] * rad(p); }
    if ((area > 0) !== inward) pts = pts.slice().reverse();
  }
  const m = pts.length;
  const ne = closed ? m : m - 1;
  const et = [];
  for (let e = 0; e < ne; e++) {
    const p = pts[e], q = pts[(e + 1) % m];
    const da = q[0] - p[0], dr = rad(q) - rad(p), l = Math.hypot(da, dr) || 1e-9;
    et.push({ da: da / l, dr: dr / l, len: l });
  }
  const cosC = Math.cos(crease * D2R);
  const nodes = [];
  const cum = [0];
  for (let e = 0; e < ne; e++) cum.push(cum[e] + et[e].len);
  for (let k = 0; k < m; k++) {
    const eIn = closed ? et[(k - 1 + m) % m] : (k > 0 ? et[k - 1] : null);
    const eOut = closed ? et[k] : (k < m - 1 ? et[k] : null);
    const u = cum[k] % (cum[ne] + 1e-9);
    if (!eIn || !eOut) { const e = eIn || eOut; nodes.push({ k, da: e.da, dr: e.dr, u, link: true }); continue; }
    if (eIn.da * eOut.da + eIn.dr * eOut.dr < cosC) {
      nodes.push({ k, da: eIn.da, dr: eIn.dr, u, link: false });   // hard corner: two rows, no strip between them
      nodes.push({ k, da: eOut.da, dr: eOut.dr, u, link: true });
    } else {
      const da = eIn.da + eOut.da, dr = eIn.dr + eOut.dr, l = Math.hypot(da, dr) || 1;
      nodes.push({ k, da: da / l, dr: dr / l, u, link: true });
    }
  }
  const nn = nodes.length, ring = nPhi + 1;
  const nodeCount = nn;
  const vcount = nodeCount * ring + (closed && !full && caps ? 2 * m : 0);
  const pos = new Float32Array(vcount * 3), nor = new Float32Array(vcount * 3), uv = new Float32Array(vcount * 2);
  for (let i = 0; i < nodeCount; i++) {
    const nd = nodes[i], p = pts[nd.k];
    const r = rad(p);
    for (let j = 0; j < ring; j++) {
      const ph = phi0 + ((phi1 - phi0) * j) / nPhi, c = Math.cos(ph), s = Math.sin(ph);
      const v = i * ring + j;
      pos[3 * v] = -p[0]; pos[3 * v + 1] = r * c; pos[3 * v + 2] = asp * r * s;
      let nx = asp * nd.dr, ny = asp * nd.da * c, nz = nd.da * s;
      const l = Math.hypot(nx, ny, nz) || 1;
      nor[3 * v] = nx / l; nor[3 * v + 1] = ny / l; nor[3 * v + 2] = nz / l;
      uv[2 * v] = nd.u * uvScale; uv[2 * v + 1] = (ph - phi0) * r * uvScale;
    }
  }
  const idx = [];
  for (let i = 0; i < nodeCount; i++) {
    if (!nodes[i].link) continue;
    const i2 = i + 1;
    if (i2 >= nodeCount && !closed) continue;
    const b = (i2 % nodeCount) * ring, a0 = i * ring;
    const z0 = Math.abs(rad(pts[nodes[i].k])) < 1e-9, z1 = Math.abs(rad(pts[nodes[i2 % nodeCount].k])) < 1e-9;   // nodes on the axis collapse
    for (let j = 0; j < nPhi; j++) {
      const v00 = a0 + j, v01 = a0 + j + 1, v10 = b + j, v11 = b + j + 1;
      if (!z0) idx.push(v00, v10, v01);
      if (!z1) idx.push(v10, v11, v01);
    }
  }
  if (closed && !full && caps) {
    const contour = pts.map((p) => new THREE.Vector2(p[0], rad(p)));
    const tris = THREE.ShapeUtils.triangulateShape(contour, []);
    for (let e = 0; e < 2; e++) {
      const ph = e === 0 ? phi0 : phi1, c = Math.cos(ph), s = Math.sin(ph);
      const sg = e === 0 ? -1 : 1;
      const nx = 0, ny = sg * -s, nz = sg * asp * c;
      const nl = Math.hypot(ny, nz) || 1;
      const base = nodeCount * ring + e * m;
      for (let k = 0; k < m; k++) {
        const v = base + k, r = rad(pts[k]);
        pos[3 * v] = -pts[k][0]; pos[3 * v + 1] = r * c; pos[3 * v + 2] = asp * r * s;
        nor[3 * v] = nx; nor[3 * v + 1] = ny / nl; nor[3 * v + 2] = nz / nl;
        uv[2 * v] = pts[k][0] * uvScale; uv[2 * v + 1] = r * uvScale;
      }
      for (const t of tris) {
        const [i0, i1, i2] = t;
        const A0 = base + i0, B0 = base + i1, C0 = base + i2;
        // geometric normal vs wanted cap normal
        const ax = pos[3 * B0] - pos[3 * A0], ay = pos[3 * B0 + 1] - pos[3 * A0 + 1], az = pos[3 * B0 + 2] - pos[3 * A0 + 2];
        const bx = pos[3 * C0] - pos[3 * A0], by = pos[3 * C0 + 1] - pos[3 * A0 + 1], bz = pos[3 * C0 + 2] - pos[3 * A0 + 2];
        const gx = ay * bz - az * by, gy = az * bx - ax * bz, gz = ax * by - ay * bx;
        const dot = gx * nx + gy * ny / nl + gz * nz / nl;
        if (dot >= 0) idx.push(A0, B0, C0); else idx.push(A0, C0, B0);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(vcount > 65535 ? new Uint32Array(idx) : new Uint16Array(idx), 1));
  return g;
}

/** Rectangular-section ring (tube) between a0 and a1 (a0 < a1), absolute radii, optional bevels. */
export function tube(a0, a1, rOut, rIn, o = {}) {
  const { bevel = 0.05, bevelIn = bevel * 0.6 } = o;
  return ringLathe([[a0, rIn, bevelIn], [a0, rOut, bevel], [a1, rOut, bevel], [a1, rIn, bevelIn]], { ...o, rel: false });
}

/** Solid disc (no bore) face-on to the axis between a0 and a1. */
export function disc(a0, a1, r, o = {}) {
  const { bevel = 0.05 } = o;
  return ringLathe([[a0, 0], [a0, r, bevel], [a1, r, bevel], [a1, 0]], { ...o, rel: false, minSeg: 12 });
}

/* ------------------------------------------------------------------ small helpers */
/** Plate-coordinate points -> instancing items on a surface: { p, n, s }. */
export function onSurface(surface, pts, { lift = 0, s = 1, sFn } = {}) {
  return pts.map((q, i) => {
    const { p, n } = surface(q[0], q[1]);
    return { p: [p.x + n.x * lift, p.y + n.y * lift, p.z + n.z * lift], n: [n.x, n.y, n.z], s: sFn ? sFn(i, q) : s };
  });
}

/** Ring of positions around the abdomen axis at a (absolute radius r): for instancing screws on ring faces. */
export function axisRing(n, a, r, { phase = 0, dir = 1, asp = 1, outward = 'axial' } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const ph = phase + (i / n) * TAU, c = Math.cos(ph), s = Math.sin(ph);
    const nrm = outward === 'axial' ? [dir, 0, 0] : [0, c * asp, s];
    out.push({ p: [-a, r * c, r * asp * s], n: nrm, ph });
  }
  return out;
}

/** Matrix at the shell point (a, phi) offset `off` radially, local +Y along the outward normal (screw heads, pins), optional roll about it. */
const _up = new THREE.Vector3(0, 1, 0);
export function placeAt(a, phi, off = 0, roll = 0, s = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(_up, Nout(a, phi));
  if (roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(_up, roll));
  return new THREE.Matrix4().compose(P(a, phi, off), q, new THREE.Vector3(s, s, s));
}
/**
 * Matrix at (a, phi) with local +Y along the tail-to-head meridian tangent (-X), local +Z along the outward normal and
 * local X around the circumference: for ribs, louvres and rungs that follow the body.
 */
export function frameMer(a, phi, off = 0) {
  const n = Nout(a, phi), t = Tail(a, phi).negate();
  const b = new THREE.Vector3().crossVectors(t, n).normalize();
  const tt = new THREE.Vector3().crossVectors(n, b).normalize();
  const m = new THREE.Matrix4().makeBasis(b, tt, n);
  m.setPosition(P(a, phi, off));
  return m;
}

/** Cheap fasteners and blocks for tiny details (the bevelled kit primitives cost 140-320 tris each). */
export const cuboid = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const pin = (r, h, seg = 10) => new THREE.CylinderGeometry(r, r, h, seg);
/** Hex bolt head, +Y up, 48 tris. */
export function hexBolt(r = 0.05, h = 0.04) {
  return revolve([[0, 0], [r, 0], [r, h * 0.78], [r * 0.82, h], [0, h]], { segments: 6, steps: 1, creaseDeg: 40 });
}
/** Round domed screw head, +Y up, about 140 tris. */
export function domeScrew(r = 0.05, h = 0.04) {
  return revolve([[0, 0], [r, 0, 0.01], [r, h, r * 0.5], [0, h]], { segments: 10, steps: 2, creaseDeg: 60 });
}
/** Translate a placement matrix in its own frame. */
export const loc = (m, x = 0, y = 0, z = 0) => m.clone().multiply(new THREE.Matrix4().makeTranslation(x, y, z));

/** Colour helpers. */
export const lin = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };

/** Child part helper: mk(parent, 'id', 'Name', 'info text (24-220 chars)', { tag, explode, ... }). */
export const mk = (parent, id, name, info, o = {}) => parent.part(id, { name, info, ...o });
/** Explode along the parent's own axes (abdomen-local: -X is tailward). */
export const exl = (dx, dy = 0, dz = 0, level = 'mid', rot = null) => ex([dx, dy, dz], level, rot, 'local');

/* ------------------------------------------------------------------ axial parts (frame, rings, bays) */
/** plate() geometry (shape x -> world +Z, shape y -> world +Y) laid across the abdomen axis between a0 and a0 + depth (a counts tailward). */
export function axPlate(sh, depth, a0, o = {}) {
  const g = plate(sh, depth, o);
  g.rotateY(-Math.PI / 2);
  g.translate(-a0, 0, 0);
  return g;
}
const RZ_F = new THREE.Matrix4().makeRotationZ(-Math.PI / 2);   // local +Y -> +X (toward the head)
const RZ_B = new THREE.Matrix4().makeRotationZ(Math.PI / 2);    // local +Y -> -X (toward the tail)
const _ry = new THREE.Matrix4();
/** Fastener on a face across the axis: face at a, polar position (r, phi) about the axis, head toward the head (dir 1) or the tail (-1). */
export function boltAx(a, r, phi, dir = 1, roll = 0) {
  const m = new THREE.Matrix4().makeTranslation(-a, r * Math.cos(phi), r * Math.sin(phi)).multiply(dir > 0 ? RZ_F : RZ_B);
  return roll ? m.multiply(_ry.makeRotationY(roll)) : m;
}
/** Same, at a plain (y, z) position. */
export function boltYZ(a, y, z, dir = 1, roll = 0) {
  const m = new THREE.Matrix4().makeTranslation(-a, y, z).multiply(dir > 0 ? RZ_F : RZ_B);
  return roll ? m.multiply(_ry.makeRotationY(roll)) : m;
}
