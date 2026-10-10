// Signed-distance helpers for the build-time lizard sculpt. Units: centimetres.
export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const mix = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b);
  const h = clamp(0.5 + (0.5 * (b - a)) / k, 0, 1);
  return mix(b, a, h) - k * h * (1 - h);
}
export const smax = (a, b, k) => -smin(-a, -b, k);

export const v3 = (x = 0, y = 0, z = 0) => [x, y, z];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a) => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const lerp3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

/** Exact distance to a cone with rounded ends between spheres (a,r1) and (b,r2). Inigo Quilez. */
export function roundCone(a, b, r1, r2) {
  const ba = sub(b, a);
  const l2 = dot(ba, ba);
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  const box = aabbOf([a, b], Math.max(r1, r2));
  const f = (x, y, z) => {
    const pax = x - a[0], pay = y - a[1], paz = z - a[2];
    const yy = pax * ba[0] + pay * ba[1] + paz * ba[2];
    const zz = yy - l2;
    const qx = pax * l2 - ba[0] * yy, qy = pay * l2 - ba[1] * yy, qz = paz * l2 - ba[2] * yy;
    const x2 = qx * qx + qy * qy + qz * qz;
    const y2 = yy * yy * l2;
    const z2 = zz * zz * l2;
    const k = Math.sign(rr) * rr * rr * x2;
    if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
    if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
    return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - r1;
  };
  return { f, box };
}

export const sphere = (c, r) => ({
  f: (x, y, z) => Math.hypot(x - c[0], y - c[1], z - c[2]) - r,
  box: aabbOf([c], r),
});

/** Ellipsoid with orthonormal axes (ax, ay, az) and radii r. Approximate distance (iq). */
export function ellipsoid(c, r, ax = [1, 0, 0], ay = [0, 1, 0], az = [0, 0, 1]) {
  const f = (x, y, z) => {
    const px = x - c[0], py = y - c[1], pz = z - c[2];
    const lx = (px * ax[0] + py * ax[1] + pz * ax[2]);
    const ly = (px * ay[0] + py * ay[1] + pz * ay[2]);
    const lz = (px * az[0] + py * az[1] + pz * az[2]);
    const k0 = Math.hypot(lx / r[0], ly / r[1], lz / r[2]);
    const k1 = Math.hypot(lx / (r[0] * r[0]), ly / (r[1] * r[1]), lz / (r[2] * r[2]));
    if (k1 < 1e-9) return -Math.min(r[0], r[1], r[2]);
    return (k0 * (k0 - 1)) / k1;
  };
  return { f, box: aabbOf([c], Math.max(...r)) };
}

/** Torus around axis n at centre c. */
export function torus(c, n, R, r) {
  n = norm(n);
  const f = (x, y, z) => {
    const p = [x - c[0], y - c[1], z - c[2]];
    const h = dot(p, n);
    const radial = Math.sqrt(Math.max(0, dot(p, p) - h * h));
    return Math.hypot(radial - R, h) - r;
  };
  return { f, box: aabbOf([c], R + r) };
}

export function aabbOf(points, pad) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const p of points) for (let i = 0; i < 3; i++) {
    min[i] = Math.min(min[i], p[i] - pad);
    max[i] = Math.max(max[i], p[i] + pad);
  }
  return { min, max };
}
export const inBox = (box, x, y, z, m) =>
  x > box.min[0] - m && x < box.max[0] + m && y > box.min[1] - m && y < box.max[1] + m && z > box.min[2] - m && z < box.max[2] + m;

/** Monotone cubic interpolation of keyframed channels, evaluated at x (keys sorted by x ascending). */
export function monotoneChannels(keys, channels) {
  const xs = keys.map((k) => k[0]);
  const curves = [];
  for (let c = 1; c <= channels; c++) {
    const ys = keys.map((k) => k[c]);
    const n = xs.length;
    const d = [], m = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0];
    m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i];
      const s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    curves.push({ ys, m });
  }
  return (x, out) => {
    const n = xs.length;
    x = clamp(x, xs[0], xs[n - 1]);
    let i = 0;
    let lo = 0, hi = n - 2;
    while (lo <= hi) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) { i = mid; lo = mid + 1; } else hi = mid - 1; }
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t, h01 = -2 * t3 + 3 * t2, h11 = t3 - t2;
    for (let c = 0; c < curves.length; c++) {
      const { ys, m } = curves[c];
      out[c] = h00 * ys[i] + h10 * h * m[i] + h01 * ys[i + 1] + h11 * h * m[i + 1];
    }
    return out;
  };
}

// Deterministic hash-based noise for small surface irregularities.
export function hash3(x, y, z) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
export function valueNoise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  let r = 0;
  for (let dz = 0; dz < 2; dz++) for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    const wt = (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w);
    r += wt * hash3(xi + dx, yi + dy, zi + dz);
  }
  return r * 2 - 1;
}
