// Procedural textures, drawn once at load: lane glass (seams, scuffs and a fine grid), machined rail
// metal, a star field, gas-giant bands, hazard stripes, grime, the panel normal map for machines and the
// particle sprites. (The helpers come from Swarmbreak.)
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

function canvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; }
// lit office windows for the skyline (emissive)
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

// machine surfaces: a tiling normal map of panel seams, rivets, bolt heads and fine scratches (about 1 m per tile)
export function panelNormal(size = 512) {
  const S = size, r = rng(77), H = new Float32Array(S * S);
  const fine = fbm(S, 32, 2, 5);
  for (let i = 0; i < H.length; i++) H[i] = fine[i] * 0.08;
  // irregular panel layout: split the tile into rectangles
  const rects = [[0, 0, S, S]];
  for (let k = 0; k < 9; k++) {
    const i = Math.floor(r() * rects.length), [x, y, w, h] = rects[i];
    if (w < S / 6 && h < S / 6) continue;
    rects.splice(i, 1);
    if (w > h) { const c = Math.round(w * (0.3 + r() * 0.4)); rects.push([x, y, c, h], [x + c, y, w - c, h]); }
    else { const c = Math.round(h * (0.3 + r() * 0.4)); rects.push([x, y, w, c], [x, y + c, w, h - c]); }
  }
  const put = (x, y, v) => { x = ((x % S) + S) % S; y = ((y % S) + S) % S; H[y * S + x] = v; };
  for (const [x, y, w, h] of rects) {
    // the panel face sits a little proud, with a recessed seam around it
    const lift = 0.15 + r() * 0.2;
    for (let yy = y + 3; yy < y + h - 3; yy++) for (let xx = x + 3; xx < x + w - 3; xx++) H[yy * S + xx] += lift;
    for (let t = 0; t < w; t++) { put(x + t, y, -0.25); put(x + t, y + 1, -0.15); }
    for (let t = 0; t < h; t++) { put(x, y + t, -0.25); put(x + 1, y + t, -0.15); }
    // rivets along the edges
    const step = 14 + Math.floor(r() * 8);
    const rivet = (cx, cy) => { for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const d = Math.hypot(dx, dy); if (d <= 3) put(cx + dx, cy + dy, lift + 0.35 * Math.cos(d / 3 * 1.4)); } };
    if (r() < 0.7) for (let t = 8; t < w - 8; t += step) { rivet(x + t, y + 7); rivet(x + t, y + h - 8); }
    if (r() < 0.5) for (let t = 8; t < h - 8; t += step) { rivet(x + 7, y + t); rivet(x + w - 8, y + t); }
  }
  // scratches
  for (let k = 0; k < 60; k++) {
    let x = r() * S, y = r() * S; const a = r() * Math.PI * 2, l = 10 + r() * 40;
    for (let t = 0; t < l; t++) { put(Math.round(x), Math.round(y), H[(((Math.round(y) % S) + S) % S) * S + (((Math.round(x) % S) + S) % S)] - 0.05); x += Math.cos(a); y += Math.sin(a); }
  }
  const nrm = new Uint8ClampedArray(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = y * S + x;
    const l = H[y * S + ((x - 1 + S) % S)], rr = H[y * S + ((x + 1) % S)], u = H[((y - 1 + S) % S) * S + x], d = H[((y + 1) % S) * S + x];
    const nx = (l - rr) * 3, ny = (u - d) * 3, len = Math.hypot(nx, ny, 1);
    nrm[i * 4] = (nx / len * 0.5 + 0.5) * 255; nrm[i * 4 + 1] = (ny / len * 0.5 + 0.5) * 255; nrm[i * 4 + 2] = (1 / len * 0.5 + 0.5) * 255; nrm[i * 4 + 3] = 255;
  }
  const c = document.createElement('canvas'); c.width = c.height = S;
  c.getContext('2d').putImageData(new ImageData(nrm, S, S), 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}


// the lane surface: smoked glass with a fine grid, seams every few metres and scuffs (u across the lane, v down it)
export function laneTex(size = 512) {
  const S = size, f = fbm(S, 8, 4, 31), g2 = fbm(S, 32, 2, 57);
  return bake(S, (x, y, i, o) => {
    const u = x / S, v = y / S;
    const seam = (Math.abs(((v * 4) % 1) - 0.5) > 0.485 ? 1 : 0) | (u < 0.012 || u > 0.988 ? 1 : 0);
    const grid = Math.abs(((u * 8) % 1) - 0.5) > 0.48 || Math.abs(((v * 16) % 1) - 0.5) > 0.48 ? 1 : 0;
    const k = 0.68 + f[i] * 0.12 - seam * 0.25 + grid * 0.06;
    o.r = k * 0.86; o.g = k * 0.92; o.b = k;
    o.h = f[i] * 0.4 + g2[i] * 0.15 - seam * 0.6 - grid * 0.08;
    o.ro = 0.06 + g2[i] * 0.22 + seam * 0.3;
  }, 3);
}
// machined metal for rails and ribs
export function metalTex(size = 256) {
  const S = size, f = fbm(S, 4, 3, 13), st = fbm(S, 64, 1, 3);
  return bake(S, (x, y, i, o) => {
    const brush = st[(y * S + ((x * 7) % S))] * 0.3;
    const k = 0.7 + f[i] * 0.2 + brush * 0.2;
    o.r = o.g = o.b = k;
    o.h = brush * 0.3 + f[i] * 0.1;
    o.ro = 0.22 + f[i] * 0.25;
  }, 1.2);
}
// gas giant bands (equirectangular, used on the sector 1 planet)
export function bandsTex(seed = 5, palette = [[0.85, 0.62, 0.42], [0.62, 0.38, 0.26], [0.95, 0.85, 0.7], [0.5, 0.32, 0.25]]) {
  const W = 1024, H = 512, f = fbm(256, 4, 5, seed);
  return canvas(W, H, (g) => {
    const im = g.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const n = f[((y >> 1) % 256) * 256 + ((x >> 2) % 256)];
      const lat = y / H + (n - 0.5) * 0.06 + Math.sin(x / W * 12 + y / H * 30) * 0.004;
      const b = (Math.sin(lat * 38) * 0.5 + 0.5) * 0.6 + (Math.sin(lat * 91 + 1.3) * 0.5 + 0.5) * 0.4;
      const c0 = palette[Math.floor(b * 3.99)], c1 = palette[Math.min(3, Math.floor(b * 3.99) + 1)], t = (b * 3.99) % 1;
      const i = (y * W + x) * 4, sh = 0.85 + n * 0.3;
      im.data[i] = (c0[0] + (c1[0] - c0[0]) * t) * 255 * sh; im.data[i + 1] = (c0[1] + (c1[1] - c0[1]) * t) * 255 * sh; im.data[i + 2] = (c0[2] + (c1[2] - c0[2]) * t) * 255 * sh; im.data[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  });
}
// a soft glowing rune/hex pattern for warnings painted on a lane (u across, v along)
export function hexTex() {
  return canvas(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3;
    const r = 18;
    for (let row = -1; row < 6; row++) for (let col = -1; col < 5; col++) {
      const cx = col * r * 1.75 + (row % 2 ? r * 0.87 : 0), cy = row * r * 1.5;
      g.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      g.closePath(); g.stroke();
    }
  });
}

// rock with glowing cracks (emissive) for the molten core cavern, or faint glowing veins for the abyss
export function crackTex(size = 512, seed = 17) {
  const S = size, f = fbm(S, 6, 4, seed), g = fbm(S, 12, 3, seed + 9);
  return canvas(S, S, (ctx) => {
    const im = ctx.createImageData(S, S);
    for (let i = 0; i < S * S; i++) {
      const ridge = 1 - Math.abs(2 * f[i] - 1), r2 = 1 - Math.abs(2 * g[i] - 1);
      const c = smooth(0.9, 0.975, ridge) + smooth(0.94, 0.99, r2) * 0.6;
      const k = Math.min(1, c);
      im.data[i * 4] = 255 * k; im.data[i * 4 + 1] = 150 * k * k; im.data[i * 4 + 2] = 60 * k * k * k; im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  });
}
export function rockTex(size = 512, seed = 23) {
  const S = size, f = fbm(S, 8, 5, seed), g = fbm(S, 32, 3, seed + 3);
  return bake(S, (x, y, i, o) => {
    const k = 0.35 + f[i] * 0.45 + g[i] * 0.2;
    o.r = k; o.g = k * 0.92; o.b = k * 0.85;
    o.h = f[i] * 1.2 + g[i] * 0.5;
    o.ro = 0.75 + g[i] * 0.25;
  }, 4);
}
// soft glowing colonies (bioluminescent spots on the abyss walls): emissive map, mostly black
export function spotsTex(size = 512, seed = 41) {
  const r = rng(seed);
  return canvas(size, size, (g, W, H) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 130; i++) {
      const x = r() * W, y = r() * H, rad = 1.2 + Math.pow(r(), 5) * 7, cl = r();
      const col = cl < 0.6 ? [60, 255, 200] : cl < 0.85 ? [80, 160, 255] : [200, 120, 255];
      for (const [ox, oy] of [[0, 0], [W, 0], [-W, 0], [0, H], [0, -H]]) {
        const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad * 3);
        gr.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.9)`); gr.addColorStop(0.35, `rgba(${col[0]},${col[1]},${col[2]},0.25)`); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(x + ox, y + oy, rad * 3, 0, Math.PI * 2); g.fill();
      }
    }
  });
}
// broad molten rivers (big smooth seams, not fine noise): emissive map for the molten core walls
export function lavaTex(size = 512, seed = 29) {
  const S = size, f = fbm(S, 3, 4, seed), g = fbm(S, 6, 3, seed + 5);
  return canvas(S, S, (ctx) => {
    const im = ctx.createImageData(S, S);
    for (let i = 0; i < S * S; i++) {
      const ridge = 1 - Math.abs(2 * f[i] - 1), r2 = 1 - Math.abs(2 * g[i] - 1);
      const k = Math.min(1, smooth(0.91, 0.985, ridge) * 1.0 + smooth(0.95, 0.995, r2) * 0.3);
      const hot = k * k;
      im.data[i * 4] = 255 * k; im.data[i * 4 + 1] = 30 + 120 * hot; im.data[i * 4 + 2] = 10 + 40 * hot * hot; im.data[i * 4 + 3] = 255;
      if (k < 0.02) { im.data[i * 4] = 0; im.data[i * 4 + 1] = 0; im.data[i * 4 + 2] = 0; }
    }
    ctx.putImageData(im, 0, 0);
  });
}
// packed ice and frost for the crystal moon's surface
export function iceTex(size = 512, seed = 61) {
  const S = size, f = fbm(S, 6, 5, seed), g = fbm(S, 24, 3, seed + 7), c = fbm(S, 12, 2, seed + 13);
  return bake(S, (x, y, i, o) => {
    const crack = smooth(0.93, 0.985, 1 - Math.abs(2 * c[i] - 1));
    const k = 0.74 + f[i] * 0.2 + g[i] * 0.08 - crack * 0.08;
    o.r = k * 0.82; o.g = k * 0.9; o.b = k;
    o.h = f[i] * 0.8 + g[i] * 0.3 - crack * 0.25;
    o.ro = 0.18 + g[i] * 0.3 + crack * 0.3;
  }, 3);
}
// a planet ring: radial bands with gaps (u = radius 0..1, alpha in the texture)
export function ringTex(seed = 7, tint = [1, 0.92, 0.8]) {
  const r = rng(seed), W = 512, bands = Array.from({ length: 40 }, () => [r(), 0.002 + r() * 0.03, 0.2 + r() * 0.8]);
  return canvas(W, 4, (g) => {
    const im = g.createImageData(W, 4);
    for (let x = 0; x < W; x++) {
      const u = x / W;
      let a = 0.25 + 0.35 * Math.sin(u * 40) * Math.sin(u * 13 + 1);
      for (const [c, w, k] of bands) if (Math.abs(u - c) < w) a += k * 0.6;
      if (u < 0.08 || u > 0.97) a = 0;
      if (Math.abs(u - 0.62) < 0.025) a *= 0.1;   // a clean gap
      a = Math.max(0, Math.min(1, a));
      const sh = 0.75 + 0.25 * Math.sin(u * 70);
      for (let y = 0; y < 4; y++) { const i = (y * W + x) * 4; im.data[i] = 255 * tint[0] * sh; im.data[i + 1] = 255 * tint[1] * sh; im.data[i + 2] = 255 * tint[2] * sh; im.data[i + 3] = 255 * a; }
    }
    g.putImageData(im, 0, 0);
  });
}
