import * as THREE from 'three';

// Small procedural texture helpers (canvas-free, deterministic).
export function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x: number, y: number, s: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Tileable value noise on an integer lattice of `period` cells. */
export function tileNoise(x: number, y: number, period: number, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const m = (a: number) => ((a % period) + period) % period;
  const a = hash2(m(xi), m(yi), seed), b = hash2(m(xi + 1), m(yi), seed);
  const c = hash2(m(xi), m(yi + 1), seed), d = hash2(m(xi + 1), m(yi + 1), seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function tileFbm(x: number, y: number, period: number, octaves = 4, seed = 0) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let o = 0; o < octaves; o++) {
    s += amp * tileNoise(x * f, y * f, period * f, seed + o * 17);
    norm += amp; amp *= 0.5; f *= 2;
  }
  return s / norm;
}

export function dataTexture(w: number, h: number, fill: (x: number, y: number, out: number[]) => void, srgb = true): THREE.DataTexture {
  const data = new Uint8Array(w * h * 4);
  const out = [0, 0, 0, 255];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    out[3] = 255;
    fill(x, y, out);
    const i = (y * w + x) * 4;
    data[i] = out[0]; data[i + 1] = out[1]; data[i + 2] = out[2]; data[i + 3] = out[3];
  }
  const t = new THREE.DataTexture(data, w, h);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

/** Walnut-like wood: long grain with growth rings and pores. Returns colour + roughness. */
export function woodTextures(size = 1024, seed = 3, tone: [number, number, number] = [62, 38, 24]) {
  const P = 8;
  const grain = (x: number, y: number) => {
    const u = x / size, v = y / size;
    const warp = tileFbm(u * P, v * 2, P, 4, seed) * 2.2;
    const rings = Math.sin((v * 2 + warp) * Math.PI * 9 + tileFbm(u * P * 0.5, v * 4, P / 2, 3, seed + 3) * 6);
    const pores = tileNoise(u * 380, v * 12, 380, seed + 9);
    return {rings, pores, fib: tileFbm(u * 64, v * 3, 64, 3, seed + 5)};
  };
  const color = dataTexture(size, size, (x, y, o) => {
    const g = grain(y, x);
    const k = 0.72 + 0.2 * g.rings + 0.18 * (g.fib - 0.5) - 0.18 * Math.max(0, g.pores - 0.78) * 4;
    o[0] = tone[0] * k; o[1] = tone[1] * k; o[2] = tone[2] * k;
  });
  const rough = dataTexture(size / 2, size / 2, (x, y, o) => {
    const g = grain(y * 2, x * 2);
    const r = 120 + 40 * g.fib + 50 * Math.max(0, g.pores - 0.7) * 3;
    o[0] = o[1] = o[2] = r;
  }, false);
  return {color, rough};
}

/** Subtle tarnish/brushed variation for brass roughness. */
export function brassRoughness(size = 256, seed = 11) {
  return dataTexture(size, size, (x, y, o) => {
    const n = tileFbm(x / size * 8, y / size * 8, 8, 4, seed);
    const streak = tileNoise(x / size * 2, y / size * 90, 2, seed + 1);
    const v = 70 + 70 * n + 25 * streak;
    o[0] = o[1] = o[2] = v;
  }, false);
}
