// Procedural textures, drawn once at load (floors per sector on first use): albedo, normal and roughness
// maps for five floors (roof pavers, wet metro tiles, foundry tread plate, vault panels, reactor
// grating), lit-window and server-rack panels, wall tiles, hazard stripes and the particle sprites.
import * as THREE from '../vendor/three.module.min.js';

function rng(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function lattice(n, seed) { const r = rng(seed), a = new Float32Array(n * n); for (let i = 0; i < a.length; i++) a[i] = r(); return a; }
function tnoise(lat, n, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const i0 = ((xi % n) + n) % n, j0 = ((yi % n) + n) % n, i1 = (i0 + 1) % n, j1 = (j0 + 1) % n;
  const a = lat[j0 * n + i0], b = lat[j0 * n + i1], c = lat[j1 * n + i0], d = lat[j1 * n + i1];
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
// tiling fbm field, size x size, values 0..1
function fbm(size, base, oct, seed, gain = 0.5) {
  const out = new Float32Array(size * size);
  let amp = 1, tot = 0;
  for (let o = 0; o < oct; o++) {
    const n = base << o, lat = lattice(n, seed + o * 101), k = n / size;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) out[y * size + x] += tnoise(lat, n, x * k, y * k) * amp;
    tot += amp; amp *= gain;
  }
  for (let i = 0; i < out.length; i++) out[i] /= tot;
  return out;
}
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// build albedo / normal / roughness canvases from per-pixel callbacks
function bake(size, fn, normalK = 2) {
  const col = new Uint8ClampedArray(size * size * 4), rough = new Uint8ClampedArray(size * size * 4), H = new Float32Array(size * size);
  const o = { r: 0, g: 0, b: 0, h: 0, ro: 0.8 };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    fn(x, y, i, o);
    col[i * 4] = o.r * 255; col[i * 4 + 1] = o.g * 255; col[i * 4 + 2] = o.b * 255; col[i * 4 + 3] = 255;
    const rv = Math.max(0, Math.min(1, o.ro)) * 255;
    rough[i * 4] = rv; rough[i * 4 + 1] = rv; rough[i * 4 + 2] = rv; rough[i * 4 + 3] = 255;
    H[i] = o.h;
  }
  const nrm = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const l = H[y * size + ((x - 1 + size) % size)], r = H[y * size + ((x + 1) % size)], u = H[((y - 1 + size) % size) * size + x], d = H[((y + 1) % size) * size + x];
    let nx = (l - r) * normalK, ny = (u - d) * normalK, nz = 1;
    const len = Math.hypot(nx, ny, nz);
    nrm[i * 4] = (nx / len * 0.5 + 0.5) * 255; nrm[i * 4 + 1] = (ny / len * 0.5 + 0.5) * 255; nrm[i * 4 + 2] = (nz / len * 0.5 + 0.5) * 255; nrm[i * 4 + 3] = 255;
  }
  const mk = (data, srgb) => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    c.getContext('2d').putImageData(new ImageData(data, size, size), 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return { map: mk(col, true), normalMap: mk(nrm, false), roughnessMap: mk(rough, false) };
}

// ------------------------------------------------------------------ the five floors (one texture tile = TILE metres)
export const TILE = 8;
export function floorSet(kind, size = 1024) {
  const S = size, r = rng(kind.length * 77 + 3);
  const big = fbm(S, 3, 5, 11), fine = fbm(S, 64, 3, 23), mid = fbm(S, 10, 4, 37);
  if (kind === 'pavers') {
    // 1 m concrete pavers, each its own shade, moss in the joints, grime patches
    const n = 8, cell = S / n, shade = []; for (let i = 0; i < n * n * 4; i++) shade.push(0.86 + r() * 0.2);
    return bake(S, (x, y, i, o) => {
      const cx = Math.floor(x / cell), cy = Math.floor(y / cell), fx = (x % cell) / cell, fy = (y % cell) / cell;
      const edge = Math.min(fx, fy, 1 - fx, 1 - fy);
      const joint = smooth(0.012, 0.028, edge);
      const sh = shade[(cy * n + cx) % shade.length];
      const g = big[i], f = fine[i], m = mid[i];
      const moss = (1 - joint) * smooth(0.45, 0.7, m);
      let c = (0.5 + f * 0.18) * sh * (0.85 + g * 0.3);
      const grime = smooth(0.55, 0.8, g) * 0.25;
      c *= 1 - grime;
      o.r = c * (1 - moss) + moss * 0.18; o.g = c * 0.98 * (1 - moss) + moss * 0.3; o.b = c * 0.93 * (1 - moss) + moss * 0.12;
      if (joint < 1) { const j = 0.22 + f * 0.1; o.r = o.r * joint + j * (1 - joint) * (1 - moss) + moss * 0.15 * (1 - joint); o.g = o.g * joint + j * 0.95 * (1 - joint); o.b = o.b * joint + j * 0.9 * (1 - joint); }
      o.h = joint * 0.6 + f * 0.25 + m * 0.1;
      o.ro = 0.86 - grime * 0.1 + (1 - joint) * 0.08;
    }, 3);
  }
  if (kind === 'tiles') {
    // 0.5 m glazed tiles, dark teal and cream bands, standing water in the low spots
    const n = 16, cell = S / n;
    return bake(S, (x, y, i, o) => {
      const cx = Math.floor(x / cell), cy = Math.floor(y / cell), fx = (x % cell) / cell, fy = (y % cell) / cell;
      const edge = Math.min(fx, fy, 1 - fx, 1 - fy);
      const joint = smooth(0.02, 0.05, edge);
      const band = false;
      const chk = (cx + cy) % 2;
      let cr = band ? 0.16 : chk ? 0.44 : 0.4, cg = band ? 0.32 : chk ? 0.46 : 0.42, cb = band ? 0.32 : chk ? 0.42 : 0.38;
      const dirt = 0.7 + big[i] * 0.4 - smooth(0.6, 0.85, mid[i]) * 0.25;
      const water = smooth(0.52, 0.62, big[i] * 0.7 + mid[i] * 0.3);
      cr *= dirt; cg *= dirt; cb *= dirt;
      const j = 0.12;
      o.r = cr * joint + j * (1 - joint); o.g = cg * joint + j * (1 - joint); o.b = cb * joint + j * (1 - joint);
      o.r *= 1 - water * 0.35; o.g *= 1 - water * 0.3; o.b *= 1 - water * 0.25;
      o.h = joint * 0.5 + fine[i] * 0.05 - water * 0.2;
      o.ro = (0.32 + fine[i] * 0.2) * (1 - water) + 0.04 * water + (1 - joint) * 0.4;
    }, 3);
  }
  if (kind === 'plate') {
    // steel tread plate in 2 m sheets, rust and scorch, raised diamond pattern
    const sheet = S / 4;
    return bake(S, (x, y, i, o) => {
      const fx = (x % sheet) / sheet, fy = (y % sheet) / sheet;
      const seam = smooth(0.004, 0.012, Math.min(fx, fy, 1 - fx, 1 - fy));
      // diamond tread: rotated lozenges
      const u = (x + y) / (S / 48), v = (x - y) / (S / 48);
      const du = Math.abs((u % 2 + 2) % 2 - 1), dv = Math.abs(((v * 3) % 2 + 2) % 2 - 1);
      const lump = smooth(0.55, 0.8, 1 - du) * smooth(0.3, 0.7, 1 - dv) * (((Math.floor(u) + Math.floor(v / 2)) & 1) ? 1 : 0);
      const rust = smooth(0.58, 0.8, big[i] * 0.6 + mid[i] * 0.4) * 0.8;
      const scorch = smooth(0.62, 0.85, mid[i]) * 0.6;
      // rivets along the seams
      const rx = (x % (sheet / 8)) - sheet / 16, ry = Math.min(y % sheet, sheet - (y % sheet));
      const rivet = Math.hypot(rx, ry - 10) < 4 ? 1 : 0;
      let c = 0.3 + fine[i] * 0.08 + lump * 0.05;
      o.r = c * (1 - rust) + rust * (0.26 + fine[i] * 0.06); o.g = c * (1 - rust) + rust * 0.17; o.b = c * 1.03 * (1 - rust) + rust * 0.11;
      o.r *= 1 - scorch; o.g *= 1 - scorch; o.b *= 1 - scorch;
      o.r *= seam; o.g *= seam; o.b *= seam;
      o.h = lump * 0.5 + seam * 0.3 + rivet * 0.4 + fine[i] * 0.04;
      o.ro = 0.38 + rust * 0.5 + scorch * 0.2 - lump * 0.1;
    }, 2.5);
  }
  if (kind === 'panel') {
    // vault floor: 1 m dark polished panels, cable trench grilles, faint grid inlay
    const n = 8, cell = S / n;
    return bake(S, (x, y, i, o) => {
      const cx = Math.floor(x / cell), cy = Math.floor(y / cell), fx = (x % cell) / cell, fy = (y % cell) / cell;
      const edge = Math.min(fx, fy, 1 - fx, 1 - fy);
      const gap = smooth(0.006, 0.014, edge);
      const grille = (cx + cy * 3) % 5 === 0 ? (((x >> 3) & 1) ? 0.6 : 1) : 1;
      let c = (0.075 + fine[i] * 0.03 + big[i] * 0.03) * grille;
      o.r = c * gap; o.g = c * 1.04 * gap; o.b = c * 1.15 * gap;
      o.h = gap * 0.5 + (grille < 1 ? 0.2 : 0);
      o.ro = (grille < 1 ? 0.6 : 0.16 + fine[i] * 0.12 + smooth(0.6, 0.8, mid[i]) * 0.2) + (1 - gap) * 0.5;
    }, 2);
  }
  // 'grate': reactor floor, hex grating over a dark pit with heavy frame bars
  return bake(S, (x, y, i, o) => {
    const s = S / 10;
    const q = (2 / 3 * x) / s, rr2 = (-1 / 3 * x + Math.sqrt(3) / 3 * y) / s;
    // hex distance
    let cx = q, cz = rr2, cy = -cx - cz;
    let rx = Math.round(cx), ry = Math.round(cy), rz = Math.round(cz);
    const dx = Math.abs(rx - cx), dy = Math.abs(ry - cy), dz = Math.abs(rz - cz);
    if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
    const hx = cx - rx, hz = cz - rz, hy = -hx - hz;
    const hd = Math.max(Math.abs(hx), Math.abs(hy), Math.abs(hz));
    const bar = smooth(0.38, 0.46, hd);
    const frame = ((x % (S / 4)) < S / 128 || (y % (S / 4)) < S / 128) ? 1 : 0;
    const metal = Math.max(bar, frame);
    const wear = smooth(0.5, 0.8, big[i]);
    let c = metal ? 0.22 + fine[i] * 0.08 + wear * 0.08 : 0.04;
    o.r = c; o.g = c * 1.02; o.b = c * 1.08;
    o.h = metal * 0.8 + frame * 0.3;
    o.ro = metal ? 0.35 + (1 - wear) * 0.3 : 0.9;
  }, 4);
}

// ------------------------------------------------------------------ scenery panels
function canvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; }
// lit office windows for the skyline (emissive)
export function windowTex(seed = 3) {
  const r = rng(seed);
  return canvas(256, 512, (g, w, h) => {
    g.fillStyle = '#05070b'; g.fillRect(0, 0, w, h);
    for (let y = 6; y < h; y += 16) for (let x = 6; x < w; x += 12) {
      if (r() < 0.42) continue;
      const warm = r() < 0.75;
      const k = 0.4 + r() * 0.6;
      g.fillStyle = warm ? `rgba(255,${190 + r() * 40 | 0},${110 + r() * 50 | 0},${k})` : `rgba(170,210,255,${k * 0.8})`;
      g.fillRect(x, y, 8, 10);
    }
  });
}
// building facades by day (albedo) with mullions
export function facadeTex(seed = 5) {
  const r = rng(seed);
  return canvas(256, 512, (g, w, h) => {
    g.fillStyle = '#5b5f66'; g.fillRect(0, 0, w, h);
    for (let y = 4; y < h; y += 16) for (let x = 4; x < w; x += 12) { const k = 30 + r() * 40 | 0; g.fillStyle = `rgb(${k},${k + 8},${k + 18})`; g.fillRect(x, y, 9, 11); }
  });
}
// server rack fronts: dark bays and LED rows (emissive map)
export function rackTex(seed = 9) {
  const r = rng(seed);
  return canvas(128, 256, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    for (let y = 6; y < h - 4; y += 10) {
      for (let x = 10; x < w - 10; x += 6) {
        if (r() < 0.5) continue;
        const c = r();
        g.fillStyle = c < 0.65 ? '#3cc8ff' : c < 0.85 ? '#5dff9a' : '#ffb347';
        g.globalAlpha = 0.4 + r() * 0.6;
        g.fillRect(x, y, 2, 2);
      }
    }
    g.globalAlpha = 1;
  });
}
export function rackAlbedo() {
  return canvas(128, 256, (g, w, h) => {
    g.fillStyle = '#16191e'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#23272e';
    for (let y = 4; y < h; y += 10) g.fillRect(6, y, w - 12, 7);
    g.fillStyle = '#0b0c0f'; g.fillRect(0, 0, 5, h); g.fillRect(w - 5, 0, 5, h);
  });
}
// glazed wall tiles with a station band
export function wallTileTex() {
  return canvas(256, 256, (g, w, h) => {
    g.fillStyle = '#d9d2c2'; g.fillRect(0, 0, w, h);
    const r = rng(4);
    for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 32) { const k = 200 + r() * 30 | 0; g.fillStyle = `rgb(${k},${k - 6},${k - 20})`; g.fillRect(x + ((y / 16) % 2) * 16 + 1, y + 1, 30, 14); }
    g.fillStyle = '#1f6b67'; g.fillRect(0, 96, w, 40);
    g.fillStyle = '#e8c35a'; g.fillRect(0, 100, w, 4); g.fillRect(0, 128, w, 4);
  });
}
// yellow/black hazard stripes
export function stripeTex() {
  return canvas(128, 32, (g, w, h) => {
    g.fillStyle = '#e7b416'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#16140f';
    for (let x = -h; x < w + h; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 16, 0); g.lineTo(x + 16 - h, h); g.lineTo(x - h, h); g.fill(); }
  });
}
// a weathered painted metal (albedo) used on machines
export function grimeTex() {
  const S = 256, f = fbm(S, 8, 4, 91);
  return canvas(S, S, (g) => {
    const im = g.createImageData(S, S);
    for (let i = 0; i < S * S; i++) { const v = 200 + f[i] * 55; im.data[i * 4] = v; im.data[i * 4 + 1] = v; im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    g.putImageData(im, 0, 0);
  });
}

// ------------------------------------------------------------------ particle sprites
function radial(size, stops) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  return c;
}
function tex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
export function sprites() {
  const S = 128, c = radial(S, [[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]);
  const g = c.getContext('2d'), r = rng(8);
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.12})`; g.beginPath(); g.arc(r() * S, r() * S, 4 + r() * 16, 0, 7); g.fill(); }
  const ring = document.createElement('canvas'); ring.width = ring.height = 128;
  const rg = ring.getContext('2d'), gr = rg.createRadialGradient(64, 64, 30, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.85, 'rgba(255,255,255,0.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  rg.fillStyle = gr; rg.fillRect(0, 0, 128, 128);
  return {
    soft: tex(c),
    spark: tex(radial(64, [[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255,240,200,0.9)'], [0.5, 'rgba(255,160,60,0.25)'], [1, 'rgba(255,100,20,0)']])),
    glow: tex(radial(128, [[0, 'rgba(255,255,255,1)'], [0.12, 'rgba(255,255,255,0.6)'], [0.4, 'rgba(255,255,255,0.12)'], [1, 'rgba(255,255,255,0)']])),
    ring: tex(ring),
  };
}
