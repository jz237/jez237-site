// APX-9 head: 2D signed-distance fields (negative inside) and marching-squares outline extraction.
// Plates are designed as boolean combinations of SDFs in plate millimetres, then traced into THREE.Shape outlines that
// armorPanel() wraps on the head ellipsoid. Pure maths: depends only on three.
import * as THREE from 'three';

const hyp = Math.hypot;

/* ------------------------------------------------------------------ primitives */

export const circle = (cx, cy, r) => (x, y) => hyp(x - cx, y - cy) - r;

/** Rounded box: centre, half extents, corner radius, rotation (radians). */
export function rbox(cx, cy, hw, hh, r = 0, rot = 0) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const ax = hw - r, ay = hh - r;
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    const px = Math.abs(dx * c + dy * s) - ax;
    const py = Math.abs(-dx * s + dy * c) - ay;
    return hyp(Math.max(px, 0), Math.max(py, 0)) + Math.min(Math.max(px, py), 0) - r;
  };
}

/** Approximate ellipse distance (exact sign, good gradient near the zero level). */
export function ellipse(cx, cy, a, b, rot = 0) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    const px = dx * c + dy * s, py = -dx * s + dy * c;
    const k0 = hyp(px / a, py / b);
    const k1 = hyp(px / (a * a), py / (b * b));
    return k1 < 1e-9 ? -Math.min(a, b) : (k0 * (k0 - 1)) / k1;
  };
}

/** Half plane: inside where n . p < d (n is normalised here). */
export function half(nx, ny, d) {
  const l = hyp(nx, ny) || 1;
  nx /= l; ny /= l; d /= l;
  return (x, y) => nx * x + ny * y - d;
}

/** Capsule around a segment. */
export function seg(ax, ay, bx, by, r) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  return (x, y) => {
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2));
    return hyp(x - ax - dx * t, y - ay - dy * t) - r;
  };
}

/** Exact signed distance to a closed polygon [[x,y]...]. A bounding-box early-out keeps far samples cheap. */
export function polygon(pts, cutoff = 1.5) {
  const n = pts.length;
  const xs = new Float64Array(n), ys = new Float64Array(n);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i < n; i++) {
    xs[i] = pts[i][0]; ys[i] = pts[i][1];
    x0 = Math.min(x0, xs[i]); x1 = Math.max(x1, xs[i]); y0 = Math.min(y0, ys[i]); y1 = Math.max(y1, ys[i]);
  }
  return (x, y) => {
    const bx = Math.max(x0 - x, 0, x - x1), by = Math.max(y0 - y, 0, y - y1);
    const bd = hyp(bx, by);
    if (bd > cutoff) return bd;
    let d2 = 1e18, inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const ex = xs[i] - xs[j], ey = ys[i] - ys[j];
      const wx = x - xs[j], wy = y - ys[j];
      const t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey || 1)));
      const qx = wx - ex * t, qy = wy - ey * t;
      const q = qx * qx + qy * qy;
      if (q < d2) d2 = q;
      if ((ys[i] > y) !== (ys[j] > y) && x < ((xs[j] - xs[i]) * (y - ys[i])) / (ys[j] - ys[i]) + xs[i]) inside = !inside;
    }
    return inside ? -Math.sqrt(d2) : Math.sqrt(d2);
  };
}

/** Distance band around an open or closed polyline: inside where the distance to the line is < r. */
export function stroke(pts, r, closed = false) {
  const n = pts.length;
  const m = closed ? n : n - 1;
  return (x, y) => {
    let d2 = 1e18;
    for (let i = 0; i < m; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      const ex = b[0] - a[0], ey = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((x - a[0]) * ex + (y - a[1]) * ey) / (ex * ex + ey * ey || 1)));
      const qx = x - a[0] - ex * t, qy = y - a[1] - ey * t;
      const q = qx * qx + qy * qy;
      if (q < d2) d2 = q;
    }
    return Math.sqrt(d2) - r;
  };
}

/* ------------------------------------------------------------------ combinators */

export const union = (...f) => (x, y) => { let m = 1e18; for (let i = 0; i < f.length; i++) { const v = f[i](x, y); if (v < m) m = v; } return m; };
export const inter = (...f) => (x, y) => { let m = -1e18; for (let i = 0; i < f.length; i++) { const v = f[i](x, y); if (v > m) m = v; } return m; };
export const sub = (a, ...b) => (x, y) => { let m = a(x, y); for (let i = 0; i < b.length; i++) { const v = -b[i](x, y); if (v > m) m = v; } return m; };
export const grow = (f, d) => (x, y) => f(x, y) - d;
export const flip = (f) => (x, y) => -f(x, y);
export const move = (f, dx, dy) => (x, y) => f(x - dx, y - dy);
/** Smooth intersection / subtraction / union (polynomial blends that round the corners by about k). */
export const sinter = (a, b, k = 0.1) => (x, y) => {
  const u = a(x, y), v = b(x, y);
  const h = Math.max(k - Math.abs(u - v), 0) / k;
  return Math.max(u, v) + h * h * k * 0.25;
};
export const ssub = (a, b, k = 0.1) => sinter(a, flip(b), k);
export const sunion = (a, b, k = 0.1) => (x, y) => {
  const u = a(x, y), v = b(x, y);
  const h = Math.max(k - Math.abs(u - v), 0) / k;
  return Math.min(u, v) - h * h * k * 0.25;
};
/** Repeat a primitive along a line: capsules etc. built by the caller; this simply unions an array of fields. */
export const unionList = (list) => union(...list);

/** Ring (annulus) between two offsets of the same field: inside where lo < f < hi. */
export const band = (f, lo, hi) => (x, y) => Math.max(f(x, y) - hi, lo - f(x, y));

/* ------------------------------------------------------------------ outline extraction */

function dp(pts, lo, hi, tol, keep) {
  // iterative Douglas-Peucker on pts[lo..hi]
  const stack = [[lo, hi]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b <= a + 1) continue;
    const ax = pts[a][0], ay = pts[a][1], bx = pts[b][0], by = pts[b][1];
    const ex = bx - ax, ey = by - ay, el = hyp(ex, ey) || 1e-9;
    let md = -1, mi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((pts[i][0] - ax) * ey - (pts[i][1] - ay) * ex) / el;
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
}

export function simplifyClosed(pts, tol = 0.006) {
  const n = pts.length;
  if (n < 8) return pts;
  let far = 0, fd = -1;
  for (let i = 1; i < n; i++) { const d = hyp(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]); if (d > fd) { fd = d; far = i; } }
  const keep = new Uint8Array(n);
  keep[0] = 1; keep[far] = 1;
  dp(pts, 0, far, tol, keep);
  const second = pts.slice(far).concat([pts[0]]);
  const keep2 = new Uint8Array(second.length);
  dp(second, 0, second.length - 1, tol, keep2);
  for (let i = 1; i < second.length - 1; i++) if (keep2[i]) keep[far + i] = 1;
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i]);
  return out;
}

/** Light Laplacian smoothing of a closed loop (removes grid stair-stepping). */
export function smoothClosed(pts, passes = 1, w = 0.5) {
  let p = pts;
  for (let k = 0; k < passes; k++) {
    const n = p.length;
    const q = new Array(n);
    for (let i = 0; i < n; i++) {
      const a = p[(i + n - 1) % n], b = p[i], c = p[(i + 1) % n];
      q[i] = [b[0] + w * ((a[0] + c[0]) / 2 - b[0]), b[1] + w * ((a[1] + c[1]) / 2 - b[1])];
    }
    p = q;
  }
  return p;
}

export function loopArea(p) {
  let a = 0;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += p[j][0] * p[i][1] - p[i][0] * p[j][1];
  return a / 2;
}

function inPoly(p, x, y) {
  let ins = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if ((p[i][1] > y) !== (p[j][1] > y) && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) ins = !ins;
  }
  return ins;
}

/**
 * Sample f on a regular grid over [x0,x1] x [y0,y1]. skip (> 0): Lipschitz bound used to skip blocks that are far from the
 * zero level (their samples are only valid for level 0). Returns a grid for traceGrid().
 */
export function sampleGrid(f, x0, y0, x1, y1, step = 0.05, skip = 0) {
  const nx = Math.ceil((x1 - x0) / step) + 1, ny = Math.ceil((y1 - y0) / step) + 1;
  const v = new Float32Array(nx * ny);
  if (skip > 0) {
    const B = 8, half = Math.SQRT1_2 * B * step * 0.5 * 2 / 2;      // half diagonal of a block
    const thr = skip * (Math.SQRT1_2 * B * step + 2 * step);
    for (let bj = 0; bj < ny; bj += B) {
      for (let bi = 0; bi < nx; bi += B) {
        const ci = Math.min(bi + B / 2, nx - 1), cj = Math.min(bj + B / 2, ny - 1);
        const fc = f(x0 + ci * step, y0 + cj * step);
        const jEnd = Math.min(bj + B, ny), iEnd = Math.min(bi + B, nx);
        if (Math.abs(fc) > thr) {
          for (let j = bj; j < jEnd; j++) for (let i = bi; i < iEnd; i++) v[j * nx + i] = fc;
        } else {
          for (let j = bj; j < jEnd; j++) for (let i = bi; i < iEnd; i++) v[j * nx + i] = f(x0 + i * step, y0 + j * step);
        }
      }
    }
    void half;
  } else {
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) v[j * nx + i] = f(x0 + i * step, y0 + j * step);
  }
  for (let i = 0; i < nx; i++) { v[i] = 1e3; v[(ny - 1) * nx + i] = 1e3; }
  for (let j = 0; j < ny; j++) { v[j * nx] = 1e3; v[j * nx + nx - 1] = 1e3; }
  return { v, nx, ny, x0, y0, step };
}

/**
 * Marching squares on a sampled grid: loops of the region value + offset < 0, i.e. f < -offset (a positive offset shrinks the
 * region). Returns closed loops, counter-clockwise for outer boundaries and clockwise for holes.
 */
export function traceGrid(G, offset = 0, { tol = 0.006, smooth = 1, minArea = 0.002 } = {}) {
  const { nx, ny, x0, y0, step } = G;
  const v0 = G.v;
  let v = v0;
  if (offset !== 0) { v = new Float32Array(v0.length); for (let k = 0; k < v0.length; k++) v[k] = v0[k] + offset; }
  for (let k = 0; k < v.length; k++) if (v[k] === 0) v[k] = -1e-7;
  const H = (i, j) => j * nx + i;                 // horizontal edge (i,j)-(i+1,j)
  const Vv = (i, j) => nx * ny + j * nx + i;       // vertical edge (i,j)-(i,j+1)
  const next = new Map();
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = v[H(i, j)] < 0, b = v[H(i + 1, j)] < 0, c = v[H(i + 1, j + 1)] < 0, d = v[H(i, j + 1)] < 0;
      const code = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0);
      if (code === 0 || code === 15) continue;
      const E0 = H(i, j), E1 = Vv(i + 1, j), E2 = H(i, j + 1), E3 = Vv(i, j);
      switch (code) {
        case 1: next.set(E0, E3); break;
        case 2: next.set(E1, E0); break;
        case 4: next.set(E2, E1); break;
        case 8: next.set(E3, E2); break;
        case 3: next.set(E1, E3); break;
        case 6: next.set(E2, E0); break;
        case 12: next.set(E3, E1); break;
        case 9: next.set(E0, E2); break;
        case 14: next.set(E3, E0); break;
        case 13: next.set(E0, E1); break;
        case 11: next.set(E1, E2); break;
        case 7: next.set(E2, E3); break;
        case 5: { // v0,v2 inside
          const mid = (v[H(i, j)] + v[H(i + 1, j)] + v[H(i + 1, j + 1)] + v[H(i, j + 1)]) / 4 < 0;
          if (mid) { next.set(E0, E1); next.set(E2, E3); } else { next.set(E0, E3); next.set(E2, E1); }
          break;
        }
        case 10: { // v1,v3 inside
          const mid = (v[H(i, j)] + v[H(i + 1, j)] + v[H(i + 1, j + 1)] + v[H(i, j + 1)]) / 4 < 0;
          if (mid) { next.set(E3, E0); next.set(E1, E2); } else { next.set(E1, E0); next.set(E3, E2); }
          break;
        }
        default: break;
      }
    }
  }
  const edgePt = (e) => {
    if (e < nx * ny) {
      const j = Math.floor(e / nx), i = e - j * nx;
      const a = v[H(i, j)], b = v[H(i + 1, j)];
      const t = a / (a - b);
      return [x0 + (i + t) * step, y0 + j * step];
    }
    const k = e - nx * ny;
    const j = Math.floor(k / nx), i = k - j * nx;
    const a = v[H(i, j)], b = v[H(i, j + 1)];
    const t = a / (a - b);
    return [x0 + i * step, y0 + (j + t) * step];
  };
  const seen = new Set();
  const loops = [];
  for (const start of next.keys()) {
    if (seen.has(start)) continue;
    let pts = [];
    let e = start;
    while (e !== undefined && !seen.has(e)) { seen.add(e); pts.push(edgePt(e)); e = next.get(e); }
    if (pts.length < 6) continue;
    if (smooth) pts = smoothClosed(pts, smooth);
    pts = simplifyClosed(pts, tol);
    if (pts.length < 4 || Math.abs(loopArea(pts)) < minArea) continue;
    loops.push(pts);
  }
  return loops;
}

/** Trace the zero level set of f over [x0,x1] x [y0,y1] (inside = f < 0); the grid border is forced outside. */
export function trace(f, x0, y0, x1, y1, step = 0.05, opts = {}) {
  return traceGrid(sampleGrid(f, x0, y0, x1, y1, step, opts.skip || 0), 0, opts);
}

/** Group loops into THREE.Shape objects (outer CCW loops with their CW holes). */
export function shapesFrom(loops) {
  const outers = loops.filter((l) => loopArea(l) > 0).map((l) => ({ pts: l, holes: [] }));
  for (const h of loops.filter((l) => loopArea(l) < 0)) {
    let best = null;
    for (const o of outers) {
      if (inPoly(o.pts, h[0][0], h[0][1]) && (!best || Math.abs(loopArea(o.pts)) < Math.abs(loopArea(best.pts)))) best = o;
    }
    if (best) best.holes.push(h);
  }
  return outers.map((o) => {
    const s = new THREE.Shape(o.pts.map((p) => new THREE.Vector2(p[0], p[1])));
    for (const h of o.holes) s.holes.push(new THREE.Path(h.map((p) => new THREE.Vector2(p[0], p[1]))));
    return s;
  });
}

/** Convenience: field -> array of shapes over the box. */
export function shapesOf(f, box, step = 0.05, opts) {
  return shapesFrom(trace(f, box[0], box[1], box[2], box[3], step, opts));
}
