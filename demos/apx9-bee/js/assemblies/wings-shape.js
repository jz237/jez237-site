// wings-shape.js - pure maths (no three.js) for the APX-9 wing: planform outline, camber surface and the
// relaxed-Voronoi "nano-vein" network. Wing frame: x = span (root -> tip), y = toward the leading edge,
// z = upper-surface normal. Units mm. Everything is deterministic (seeded) so every visit builds the same wing.

/* ------------------------------------------------------------------ tiny helpers */
export function mk(seed = 1) {
  let s = (seed >>> 0) || 1;
  const f = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.range = (a, b) => a + (b - a) * f();
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  return f;
}
export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/** Cubic Hermite / Catmull-Rom profile through [u, value] points (same maths as skeleton.profile). */
export function prof(pts) {
  const n = pts.length;
  return (u) => {
    if (u <= pts[0][0]) return pts[0][1];
    if (u >= pts[n - 1][0]) return pts[n - 1][1];
    let i = 0;
    while (u > pts[i + 1][0]) i++;
    const [u0, y0] = pts[i], [u1, y1] = pts[i + 1];
    const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 2, n - 1)];
    const h = u1 - u0, t = (u - u0) / h;
    const m0 = ((y1 - a[1]) / (u1 - a[0])) * h, m1 = ((b[1] - y0) / (b[0] - u0)) * h;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * m1;
  };
}

/* ------------------------------------------------------------------ planform */
export const X0 = 3.0;      // membrane root
export const XT = 23.5;     // wing tip (span)

// Control points, counter-clockwise (seen from +z): along the trailing edge root -> tip, round the tip, back along the leading edge.
// The leading-edge points are the spar centre line; the membrane runs out underneath the boom.
const TE_PTS = [[3.15, -0.95], [4.35, -2.45], [6.2, -4.4], [8.8, -6.3], [11.8, -7.65], [14.8, -8.2], [17.9, -7.65], [20.5, -6.35], [22.3, -4.7], [23.25, -3.0]];
const TIP_PTS = [[23.5, -1.7]];
const LE_PTS = [[22.95, -0.45], [21.3, 0.15], [18.7, 0.62], [15.6, 0.86], [12.2, 0.9], [8.8, 0.68], [5.7, 0.38], [3.4, 0.14]];
const TAG = { te: 2, tip: 3, le: 1, root: 4 };

/** Catmull-Rom (centripetal) through closed control points; returns dense [x, y, tag] samples (tag = tag of the outgoing edge). */
function sampleClosed(ctrl, tags, step = 0.22) {
  const n = ctrl.length;
  const out = [];
  const knot = (a, b) => Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1]));
  for (let i = 0; i < n; i++) {
    const p0 = ctrl[(i - 1 + n) % n], p1 = ctrl[i], p2 = ctrl[(i + 1) % n], p3 = ctrl[(i + 2) % n];
    const t0 = 0, t1 = t0 + knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3);
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const m = Math.max(2, Math.ceil(len / step));
    for (let k = 0; k < m; k++) {
      const t = t1 + (t2 - t1) * (k / m);
      const A1x = ((t1 - t) * p0[0] + (t - t0) * p1[0]) / (t1 - t0), A1y = ((t1 - t) * p0[1] + (t - t0) * p1[1]) / (t1 - t0);
      const A2x = ((t2 - t) * p1[0] + (t - t1) * p2[0]) / (t2 - t1), A2y = ((t2 - t) * p1[1] + (t - t1) * p2[1]) / (t2 - t1);
      const A3x = ((t3 - t) * p2[0] + (t - t2) * p3[0]) / (t3 - t2), A3y = ((t3 - t) * p2[1] + (t - t2) * p3[1]) / (t3 - t2);
      const B1x = ((t2 - t) * A1x + (t - t0) * A2x) / (t2 - t0), B1y = ((t2 - t) * A1y + (t - t0) * A2y) / (t2 - t0);
      const B2x = ((t3 - t) * A2x + (t - t1) * A3x) / (t3 - t1), B2y = ((t3 - t) * A2y + (t - t1) * A3y) / (t3 - t1);
      out.push([((t2 - t) * B1x + (t - t1) * B2x) / (t2 - t1), ((t2 - t) * B1y + (t - t1) * B2y) / (t2 - t1), tags[i]]);
    }
  }
  return out;
}

let _outline = null;
/** Dense CCW planform polygon [[x, y, tag]]; tag 1 = leading edge (spar), 2 = trailing edge, 3 = tip, 4 = root. */
export function outline() {
  if (_outline) return _outline;
  const ctrl = [...TE_PTS, ...TIP_PTS, ...LE_PTS];
  const tags = [...TE_PTS.map(() => TAG.te), ...TIP_PTS.map(() => TAG.tip), ...LE_PTS.map((_, i) => (i === LE_PTS.length - 1 ? TAG.root : TAG.le))];
  // the tip nose splits into the TE->tip and tip->LE edges
  tags[TE_PTS.length - 1] = TAG.te;
  tags[TE_PTS.length] = TAG.tip;
  tags[TE_PTS.length + 1] = TAG.tip;
  _outline = sampleClosed(ctrl, tags);
  return _outline;
}

/** Spar centre line: leading-edge samples of the outline, ordered root -> tip. */
export function leadingEdge() {
  const o = outline().filter((p) => p[2] === TAG.le || p[2] === TAG.tip);
  const pts = o.filter((p) => p[2] === TAG.le).map((p) => [p[0], p[1]]);
  pts.sort((a, b) => a[0] - b[0]);
  return pts;
}

/** Y of the leading edge at x (linear lookup in the dense LE polyline). */
let _le = null;
export function yLE(x) {
  if (!_le) _le = leadingEdge();
  if (x <= _le[0][0]) return _le[0][1];
  for (let i = 1; i < _le.length; i++) if (x <= _le[i][0]) { const t = (x - _le[i - 1][0]) / (_le[i][0] - _le[i - 1][0] || 1); return lerp(_le[i - 1][1], _le[i][1], t); }
  return _le[_le.length - 1][1];
}

/** Gentle camber of the whole wing: trailing edge droops, tip rises a little. z in mm (wing frame). */
export function surfaceZ(x, y) {
  const t = clamp((x - X0) / (XT - X0));
  const d = Math.max(0, yLE(Math.min(x, 22.2)) - y);
  const droop = -(0.004 + 0.0075 * t) * d * d;
  const lift = 0.45 * t * t;
  return droop + lift;
}

/** Smooth 2-D value noise in 0..1 (lattice hash + smoothstep), deterministic per seed. */
export function vnoise(x, y, seed = 1) {
  const h = (i, j) => {
    let t = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 2147483647)) | 0;
    t = Math.imul(t ^ (t >>> 13), 1274126177);
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/** Points [x, y, z] along the straight planform edge A -> B, lying on the cambered surface (shared by membrane and veins). */
export function edgeSamples(A, B, seg = 1.3) {
  const n = Math.max(1, Math.ceil(Math.hypot(B.x - A.x, B.y - A.y) / seg));
  const out = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const x = A.x + (B.x - A.x) * t, y = A.y + (B.y - A.y) * t;
    out.push([x, y, surfaceZ(x, y)]);
  }
  return out;
}

/* ------------------------------------------------------------------ voronoi on the planform */
function clipHalf(poly, nx, ny, c) {
  const out = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    const da = nx * a.x + ny * a.y - c, db = nx * b.x + ny * b.y - c;
    if (da <= 0) out.push({ x: a.x, y: a.y, f: a.f });
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, f: da < 0 ? 0 : a.f });
    }
  }
  return out;
}

function cellOf(seeds, i, poly0) {
  let poly = poly0;
  const s = seeds[i];
  // nearest seeds first so the polygon shrinks early
  const order = seeds.map((q, j) => j).filter((j) => j !== i).sort((a, b) => Math.hypot(seeds[a][0] - s[0], seeds[a][1] - s[1]) - Math.hypot(seeds[b][0] - s[0], seeds[b][1] - s[1]));
  for (const j of order) {
    const q = seeds[j];
    const nx = q[0] - s[0], ny = q[1] - s[1];
    const c = nx * (s[0] + q[0]) / 2 + ny * (s[1] + q[1]) / 2;
    poly = clipHalf(poly, nx, ny, c);
    if (poly.length < 3) break;
  }
  return poly;
}

function polyArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p.x * q.y - q.x * p.y; }
  return a / 2;
}
function polyCentroid(poly) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const w = p.x * q.y - q.x * p.y;
    a += w; cx += (p.x + q.x) * w; cy += (p.y + q.y) * w;
  }
  a /= 2;
  return Math.abs(a) < 1e-9 ? [poly[0].x, poly[0].y] : [cx / (6 * a), cy / (6 * a)];
}
function inside(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}

/**
 * Build the vein network.
 *  opts.stretch  cell elongation along the span
 *  opts.spacing  nominal seed spacing (mm, in the isotropic space)
 * Returns { outline, verts[{x,y,deg,rim}], veins[{a,b,len,kind}], cells[{ids,cx,cy,area,kind}], rimLE[], rimTE[] }
 */
export function buildNetwork({ seed = 11, stretch = 1.8, spacing = 2.05, relax = 3, relaxK = 0.7 } = {}) {
  const R = mk(seed);
  const out = outline();
  const poly0 = out.map((p) => ({ x: p[0] / stretch, y: p[1], f: p[2] }));
  const poly0real = out.map((p) => [p[0] / stretch, p[1]]);
  // variable seed spacing: tighter at the root and toward the rim, looser mid-wing
  const radius = (x, y) => {
    const xr = x * stretch;
    const root = 0.62 + 0.38 * smooth(4.0, 12.0, xr);
    const tip = 1 - 0.12 * smooth(17, 23, xr);
    // low-frequency noise: some regions get big cells, some small (nothing is a regular honeycomb)
    const nz = vnoise(xr * 0.17 + 3.1, y * 0.33 + 7.7, seed);
    return spacing * root * tip * (0.62 + 0.76 * nz);
  };
  const seeds = [];
  const bx0 = 3 / stretch, bx1 = XT / stretch;
  for (let tries = 0; tries < 9000; tries++) {
    const x = R.range(bx0, bx1), y = R.range(-8.4, 1.0);
    if (!inside(poly0real, x, y)) continue;
    const r = radius(x, y);
    let ok = true;
    for (const s of seeds) if (Math.hypot(s[0] - x, s[1] - y) < r) { ok = false; break; }
    if (ok) seeds.push([x, y]);
  }
  // Lloyd relaxation toward honeycomb-like cells
  for (let it = 0; it < relax; it++) {
    for (let i = 0; i < seeds.length; i++) {
      const cell = cellOf(seeds, i, poly0);
      if (cell.length < 3) continue;
      const c = polyCentroid(cell);
      seeds[i] = [lerp(seeds[i][0], c[0], relaxK), lerp(seeds[i][1], c[1], relaxK)];
    }
  }
  // final cells in real space
  const cellsRaw = [];
  for (let i = 0; i < seeds.length; i++) {
    const cell = cellOf(seeds, i, poly0);
    if (cell.length < 3 || Math.abs(polyArea(cell)) < 0.08) continue;
    cellsRaw.push({ seed: seeds[i], poly: cell.map((p) => ({ x: p.x * stretch, y: p.y, f: p.f })) });
  }

  // weld vertices
  const verts = [];
  const hash = new Map();
  const key = (x, y) => `${Math.round(x / 4e-4)},${Math.round(y / 4e-4)}`;
  const idOf = (x, y) => {
    const kx = Math.round(x / 4e-4), ky = Math.round(y / 4e-4);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const k = hash.get(`${kx + dx},${ky + dy}`);
      if (k !== undefined) return k;
    }
    const id = verts.length;
    verts.push({ x, y, deg: 0, rim: false });
    hash.set(key(x, y), id);
    return id;
  };
  const edgeMap = new Map();
  const cells = [];
  for (const c of cellsRaw) {
    const ids = [];
    const flags = [];
    for (const p of c.poly) {
      const id = idOf(p.x, p.y);
      if (ids.length && ids[ids.length - 1] === id) { flags[flags.length - 1] = flags[flags.length - 1] || p.f; continue; }
      ids.push(id); flags.push(p.f);
    }
    while (ids.length > 1 && ids[0] === ids[ids.length - 1]) { ids.pop(); flags.pop(); }
    if (ids.length < 3) continue;
    const ci = cells.length;
    for (let k = 0; k < ids.length; k++) {
      const a = ids[k], b = ids[(k + 1) % ids.length];
      if (a === b) continue;
      const kk = a < b ? `${a}_${b}` : `${b}_${a}`;
      let e = edgeMap.get(kk);
      if (!e) { e = { a: Math.min(a, b), b: Math.max(a, b), n: 0, rim: 0, cells: [] }; edgeMap.set(kk, e); }
      e.n++; e.cells.push(ci);
      if (flags[k]) e.rim = flags[k];
    }
    const cen = polyCentroid(ids.map((id) => verts[id]));
    cells.push({ ids, cx: cen[0], cy: cen[1], area: Math.abs(polyArea(ids.map((id) => verts[id]))), seed: c.seed, kind: 'clear' });
  }
  const veins = [];
  for (const e of edgeMap.values()) {
    if (e.rim) { verts[e.a].rim = true; verts[e.b].rim = true; continue; }
    if (e.n < 2) continue;
    const A = verts[e.a], B = verts[e.b];
    const len = Math.hypot(B.x - A.x, B.y - A.y);
    veins.push({ a: e.a, b: e.b, len, cells: e.cells });
    A.deg++; B.deg++;
  }
  // classify veins: along the span (long) or crossing it
  for (const v of veins) {
    const A = verts[v.a], B = verts[v.b];
    const dx = Math.abs(B.x - A.x), dy = Math.abs(B.y - A.y);
    v.kind = dx > dy * 1.3 ? 'long' : 'cross';
    v.mx = (A.x + B.x) / 2; v.my = (A.y + B.y) / 2;
  }
  return { outline: out, verts, veins, cells, seeds };
}
