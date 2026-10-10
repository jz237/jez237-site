import * as THREE from 'three';

/**
 * Tileable 3-D noise for clouds and fog (RGBA8):
 *  R  Perlin–Worley (billowy base shape)
 *  G  Worley fbm, low frequencies (erosion)
 *  B  Worley fbm, high frequencies (fine wisps)
 *  A  Perlin fbm (ragged bases, height wobble)
 * Each channel is stretched to its 0.5–99.5 percentile range.
 */
let cached: THREE.Data3DTexture | null = null;

export function noise3D(size = 48): THREE.Data3DTexture {
  if (cached) return cached;
  let seed = 9;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // Worley feature points per period
  const pointSets = new Map<number, Float32Array>();
  const pts = (p: number) => {
    let a = pointSets.get(p);
    if (!a) {a = new Float32Array(p * p * p * 3); for (let i = 0; i < a.length; i++) a[i] = rnd(); pointSets.set(p, a);}
    return a;
  };
  const worley = (x: number, y: number, z: number, p: number) => {
    const P = pts(p);
    const fx = x * p, fy = y * p, fz = z * p;
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
    let d = 9;
    for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const cx = (ix + i + p) % p, cy = (iy + j + p) % p, cz = (iz + k + p) % p;
      const q = (cx + p * (cy + p * cz)) * 3;
      const dx = ix + i + P[q] - fx, dy = iy + j + P[q + 1] - fy, dz = iz + k + P[q + 2] - fz;
      const dd = dx * dx + dy * dy + dz * dz;
      if (dd < d) d = dd;
    }
    return 1 - Math.min(1, Math.sqrt(d));
  };
  // periodic gradient noise
  const grads: number[][] = [];
  for (let i = 0; i < 256; i++) {
    const t = rnd() * Math.PI * 2, u = rnd() * 2 - 1, r = Math.sqrt(1 - u * u);
    grads.push([r * Math.cos(t), r * Math.sin(t), u]);
  }
  const perm = Array.from({length: 256}, (_, i) => i).sort(() => rnd() - 0.5);
  const hash = (x: number, y: number, z: number) => perm[(perm[(perm[x & 255] + y) & 255] + z) & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const perlin = (x: number, y: number, z: number, p: number) => {
    x *= p; y *= p; z *= p;
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    let s = 0;
    for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const g = grads[hash((xi + i) % p, (yi + j) % p, (zi + k) % p)];
      const d = g[0] * (xf - i) + g[1] * (yf - j) + g[2] * (zf - k);
      s += d * (i ? fade(xf) : 1 - fade(xf)) * (j ? fade(yf) : 1 - fade(yf)) * (k ? fade(zf) : 1 - fade(zf));
    }
    return s * 0.5 + 0.5;
  };
  const N = size * size * size;
  const ch = [new Float32Array(N), new Float32Array(N), new Float32Array(N), new Float32Array(N)];
  for (let z = 0, n = 0; z < size; z++) for (let y = 0; y < size; y++) for (let x = 0; x < size; x++, n++) {
    const u = x / size, v = y / size, w = z / size;
    const pf = perlin(u, v, w, 4) * 0.5 + perlin(u, v, w, 8) * 0.3 + perlin(u, v, w, 16) * 0.2;
    const w1 = worley(u, v, w, 4) * 0.625 + worley(u, v, w, 8) * 0.25 + worley(u, v, w, 16) * 0.125;
    const w2 = worley(u, v, w, 8) * 0.625 + worley(u, v, w, 16) * 0.25 + worley(u, v, w, 32) * 0.125;
    // Perlin remapped by Worley: puffy cells with soft noise inside
    const pw = Math.min(1, Math.max(0, (pf - (1 - w1)) / (1 - (1 - w1) + 1e-3) * 0.5 + w1 * 0.5));
    ch[0][n] = pw; ch[1][n] = w1; ch[2][n] = w2; ch[3][n] = pf;
  }
  const data = new Uint8Array(N * 4);
  for (let c = 0; c < 4; c++) {
    const sorted = Float32Array.from(ch[c]).sort();
    const lo = sorted[Math.floor(N * 0.005)], hi = sorted[Math.floor(N * 0.995)];
    for (let n = 0; n < N; n++) data[n * 4 + c] = Math.round(Math.min(1, Math.max(0, (ch[c][n] - lo) / (hi - lo))) * 255);
  }
  const t = new THREE.Data3DTexture(data, size, size, size);
  t.format = THREE.RGBAFormat;
  t.wrapS = t.wrapT = t.wrapR = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  cached = t;
  return t;
}
