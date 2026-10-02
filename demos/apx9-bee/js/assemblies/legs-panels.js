// APX-9 legs: armour-panel helpers shared by the shells (smooth-shaded panel(), cut-corner outlines, domed rivets, seam / rivet layouts).
import { revolve, shape, tessellate, detail } from '../kit.js';
import { THREE, V3, crease, boxUV, alongN, once, lerp, clamp } from './legs-core.js';

/**
 * armorPanel with analytic shading: the plate is built (extruded, bevelled, tessellated) in flat plate space exactly like the kit's
 * armorPanel, but its crease-smoothed normals are computed there, where the top face is perfectly flat, and then carried onto the
 * surface through the local surface frame. Curved glossy plates therefore shade as one smooth skin instead of showing the
 * sliver-triangle facets that normals recomputed after the mapping produce. Same options and the same geometry as armorPanel.
 */
export function panel({ shape: sh, holes = [], surface, thickness = 0.4, bevel = 0.1, bevelSegments = 2, lift = 0, maxEdge = 0.7, creaseDeg = 36, uvScale = 0.12, steps = 4 }) {
  const sp = Array.isArray(sh) ? shape(sh, holes, { steps }) : sh;
  const b = Math.min(bevel, thickness * 0.45);
  const ext = new THREE.ExtrudeGeometry(sp, {
    depth: Math.max(thickness - 2 * b, 0.001), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments, curveSegments: Math.max(6, steps * 2),
  });
  ext.translate(0, 0, b);
  // weld the (non-indexed) extrusion by position, as mergeVertices(g, 1e-4) does
  const src = ext.attributes.position.array, seen = new Map(), wp = [], wi = [];
  for (let i = 0; i < src.length; i += 3) {
    const key = `${Math.round(src[i] * 1e4)},${Math.round(src[i + 1] * 1e4)},${Math.round(src[i + 2] * 1e4)}`;
    let j = seen.get(key);
    if (j === undefined) { j = wp.length / 3; seen.set(key, j); wp.push(src[i], src[i + 1], src[i + 2]); }
    wi.push(j);
  }
  ext.dispose();
  const t = tessellate(wp, wi, maxEdge / detail.tess);
  let flat = new THREE.BufferGeometry();
  flat.setAttribute('position', new THREE.BufferAttribute(t.positions, 3));
  flat.setIndex(t.indices);
  flat = crease(flat, creaseDeg);
  const P = flat.attributes.position, N = flat.attributes.normal, cnt = P.count;
  const pos = new Float32Array(cnt * 3), nor = new Float32Array(cnt * 3), uv = new Float32Array(cnt * 2);
  const cache = new Map();
  const H = 0.02;
  const nn = V3();
  for (let i = 0; i < cnt; i++) {
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
    const k = `${Math.round(x * 1e4)},${Math.round(y * 1e4)}`;
    let f = cache.get(k);
    if (!f) { const s = surface(x, y); f = { p: s.p, n: s.n, r1: null, r2: null }; cache.set(k, f); }
    const { p, n } = f;
    pos[3 * i] = p.x + n.x * (lift + z); pos[3 * i + 1] = p.y + n.y * (lift + z); pos[3 * i + 2] = p.z + n.z * (lift + z);
    uv[2 * i] = x * uvScale; uv[2 * i + 1] = y * uvScale;
    const fx = N.getX(i), fy = N.getY(i), fz = N.getZ(i);
    if (Math.abs(fx) + Math.abs(fy) > 1e-4) {
      // rim, bevel or hole wall: carry the in-plane part of the normal through the inverse transpose of the surface jacobian,
      // i.e. the reciprocal basis of (dP/dx, dP/dy, n)
      if (!f.r1) {
        const e1 = surface(x + H, y).p.sub(p).multiplyScalar(1 / H), e2 = surface(x, y + H).p.sub(p).multiplyScalar(1 / H);
        const c1 = V3().crossVectors(e2, n), det = e1.dot(c1) || 1e-6;
        f.r1 = c1.multiplyScalar(1 / det);
        f.r2 = V3().crossVectors(n, e1).multiplyScalar(1 / det);
      }
      nn.set(0, 0, 0).addScaledVector(f.r1, fx).addScaledVector(f.r2, fy).addScaledVector(n, fz).normalize();
    } else nn.copy(n).multiplyScalar(fz < 0 ? -1 : 1);
    nor[3 * i] = nn.x; nor[3 * i + 1] = nn.y; nor[3 * i + 2] = nn.z;
  }
  flat.dispose();
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

/** Low-poly domed rivet head (axis +Y, base radius 0.1, height 0.07; about 40 triangles). */
export function domeGeo() {
  return once('lp-dome', () => revolve([[0.1, 0], [0.094, 0.03], [0.064, 0.058], [0, 0.07]], { segments: 8, steps: 1, creaseDeg: 70 }));
}

/** Domed rivets sitting on a pod surface: list of [u, v] (arc mm, y) on sfn, head radius r, base lifted by `lift` along the normal. */
export function rivetsAlong(part, mat, F, sfn, list, lift = 0, r = 0.04) {
  const g = domeGeo();
  list.forEach(([u, v], i) => {
    const s = sfn(u, v);
    part.add(g, mat, F.m.clone().multiply(alongN(s.p.clone().addScaledVector(s.n, lift), s.n, i * 0.7, r / 0.1)));
  });
}

/** Half-width law of a tapered plate: pod[dim](v) * k(v) + margin, k blending kb -> kt between v0 and v1. */
export function halfWidth(pod, v0, v1, { kb = 0.62, kt = 0.7, margin = 0, dim = 'rx' } = {}) {
  return (v) => Math.max(pod.at(clamp(v, pod.y0, pod.y1))[dim] * lerp(kb, kt, clamp((v - v0) / (v1 - v0), 0, 1)) + margin, 0.1);
}

/**
 * Plate outline [x, y, r][] with cut (chamfered) corners: bottom corners cut by cb, top corners by ct (mm), tiny corner radius rc.
 * The long edges follow the pod taper (see halfWidth), n = number of sub-divisions along them.
 */
export function panelOutline(pod, v0, v1, { kb = 0.62, kt = 0.7, margin = 0, n = 6, cb = 0.18, ct = 0.12, rc = 0.03, dim = 'rx' } = {}) {
  const hw = halfWidth(pod, v0, v1, { kb, kt, margin, dim });
  const vA = v0 + cb, vB = v1 - ct;
  const pts = [[hw(v0) - cb, v0, rc]];
  for (let i = 0; i <= n; i++) { const v = lerp(vA, vB, i / n); pts.push([hw(v), v, i === 0 || i === n ? rc : 0]); }
  pts.push([hw(v1) - ct, v1, rc], [-(hw(v1) - ct), v1, rc]);
  for (let i = n; i >= 0; i--) { const v = lerp(vA, vB, i / n); pts.push([-hw(v), v, i === 0 || i === n ? rc : 0]); }
  pts.push([-(hw(v0) - cb), v0, rc]);
  return pts;
}

/**
 * Chamfer the outer corners of a (y, g) band profile: every vertex above the lowest g gets cut by c (limited to 45% of the adjacent edges),
 * so rings read as machined stock with crisp edges instead of pillows.
 */
export function chamfer(pts, c = 0.012) {
  const gmin = Math.min(...pts.map((p) => p[1]));
  const out = [];
  const n = pts.length;
  pts.forEach((p, i) => {
    if (p[1] < gmin + 1e-6) { out.push(p); return; }
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ca = Math.min(c, la * 0.45), cb = Math.min(c, lb * 0.45);
    out.push([p[0] + ((a[0] - p[0]) / la) * ca, p[1] + ((a[1] - p[1]) / la) * ca], [p[0] + ((b[0] - p[0]) / lb) * cb, p[1] + ((b[1] - p[1]) / lb) * cb]);
  });
  return out;
}

/** Crisp rectangular ring profile (y0..y1, wall g0..g1 about the pod surface) with chamfer c, for Pod.wrap. */
export const ringPoly = (y0, y1, g0, g1, c = 0.012) => chamfer([[y0, g0], [y0, g1], [y1, g1], [y1, g0]], c);

/** Two-step collar profile: low shoulder (height gA) over y0..yS, tall flange (height gB) over yS..y1, chamfer c. */
export const collarPoly = (y0, yS, y1, g0, gA, gB, c = 0.012) => chamfer([[y0, g0], [y0, gA], [yS, gA], [yS, gB], [y1, gB], [y1, g0]], c);

/** [u, v] positions of rivets running along both long edges of a tapered plate, inset from the edge, evenly spaced between v0 + end and v1 - end. */
export function edgeRivets(pod, v0, v1, { kb = 0.62, kt = 0.7, inset = 0.1, end = 0.25, pitch = 0.5, dim = 'rx', sides = [1, -1] } = {}) {
  const hw = halfWidth(pod, v0, v1, { kb, kt, dim });
  const n = Math.max(2, Math.round((v1 - v0 - 2 * end) / pitch) + 1);
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = lerp(v0 + end, v1 - end, i / (n - 1));
    for (const s of sides) out.push([s * (hw(v) - inset), v]);
  }
  return out;
}

/**
 * Cylindrical armour sleeve about +Y (outer radius rOut, wall down to rIn, y0..y1) with rectangular windows. Only the outer skin and the window
 * walls are built (the inner face hides behind the drum), so it costs a few hundred triangles. Angle a maps to the point (sin a, y, cos a).
 * cuts: [{ a: centre angle, hw: half width (rad), v0, v1 }]; v0 / v1 omitted = a full-height seam. Cuts must not overlap.
 */
export function ventedSleeve({ rOut, rIn, y0, y1, cuts, maxStep = 0.26 }) {
  const TAU = Math.PI * 2;
  const norm = (a) => ((a % TAU) + TAU) % TAU;
  const cs = cuts.map((c) => ({ a0: norm(c.a - c.hw), w: 2 * c.hw, v0: Math.max(c.v0 ?? y0, y0), v1: Math.min(c.v1 ?? y1, y1) }));
  const inCut = (m) => cs.find((c) => norm(m - c.a0) < c.w);
  const bps = [...new Set(cs.flatMap((c) => [c.a0, norm(c.a0 + c.w)]).map((a) => Math.round(a * 1e6) / 1e6))].sort((a, b) => a - b);
  const pos = [];
  const P = (r, a, y) => V3(r * Math.sin(a), y, r * Math.cos(a));
  const quad = (a, b, c, d, want) => {
    const n = b.clone().sub(a).cross(c.clone().sub(a));
    const order = n.dot(want) >= 0 ? [a, b, c, a, c, d] : [a, c, b, a, d, c];
    for (const p of order) pos.push(p.x, p.y, p.z);
  };
  const radial = (m) => V3(Math.sin(m), 0, Math.cos(m));
  const tang = (a) => V3(Math.cos(a), 0, -Math.sin(a));
  const skin = (aL, aR, ya, yb) => quad(P(rOut, aL, ya), P(rOut, aR, ya), P(rOut, aR, yb), P(rOut, aL, yb), radial((aL + aR) / 2));
  const wall = (a, ya, yb, dir) => quad(P(rIn, a, ya), P(rOut, a, ya), P(rOut, a, yb), P(rIn, a, yb), tang(a).multiplyScalar(dir));
  const spans = [];
  for (let i = 0; i < bps.length; i++) spans.push([bps[i], i + 1 < bps.length ? bps[i + 1] : bps[0] + TAU]);
  if (!bps.length) spans.push([0, TAU]);
  for (const [sa, sb] of spans) {
    const n = Math.max(1, Math.ceil((sb - sa) / maxStep));
    for (let k = 0; k < n; k++) {
      const aL = lerp(sa, sb, k / n), aR = lerp(sa, sb, (k + 1) / n);
      const c = inCut((aL + aR) / 2);
      if (!c) { skin(aL, aR, y0, y1); continue; }
      if (c.v0 > y0 + 1e-6) { skin(aL, aR, y0, c.v0); quad(P(rIn, aL, c.v0), P(rOut, aL, c.v0), P(rOut, aR, c.v0), P(rIn, aR, c.v0), V3(0, 1, 0)); }
      if (c.v1 < y1 - 1e-6) { skin(aL, aR, c.v1, y1); quad(P(rIn, aL, c.v1), P(rOut, aL, c.v1), P(rOut, aR, c.v1), P(rIn, aR, c.v1), V3(0, -1, 0)); }
    }
  }
  for (const c of cs) { wall(c.a0, c.v0, c.v1, 1); wall(c.a0 + c.w, c.v0, c.v1, -1); }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g = crease(g, 38);
  boxUV(g, 0.3);
  return g;
}
