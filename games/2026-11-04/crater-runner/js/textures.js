// Procedural textures, drawn once at load: tiling regolith and rock (albedo + normal), rover panels,
// gold foil, solar cells, and the Earth (land, ocean, ice and a separate cloud layer).
import * as THREE from '../vendor/three.module.min.js';

function rng(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// tiling value noise on an N x N lattice
function lattice(n, seed) { const r = rng(seed), a = new Float32Array(n * n); for (let i = 0; i < a.length; i++) a[i] = r(); return a; }
function tnoise(lat, n, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const i0 = ((xi % n) + n) % n, j0 = ((yi % n) + n) % n, i1 = (i0 + 1) % n, j1 = (j0 + 1) % n;
  const a = lat[j0 * n + i0], b = lat[j0 * n + i1], c = lat[j1 * n + i0], d = lat[j1 * n + i1];
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
// fbm that tiles over the texture (each octave's lattice is the texture size / period)
function fbmField(size, base, oct, seed, gain = 0.5) {
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
// little craterlets pressed into a height field (wrapping)
function craterlets(h, size, count, rmin, rmax, seed, depth = 0.25) {
  const r = rng(seed);
  for (let c = 0; c < count; c++) {
    const cx = r() * size, cy = r() * size, rad = rmin + Math.pow(r(), 2.2) * (rmax - rmin), d = depth * (0.5 + r());
    const R = Math.ceil(rad * 1.8);
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      const dist = Math.hypot(x, y) / rad;
      if (dist > 1.8) continue;
      const px = ((Math.floor(cx + x) % size) + size) % size, py = ((Math.floor(cy + y) % size) + size) % size;
      const v = dist < 1 ? -(1 - dist * dist) + 0.25 * dist ** 4 : 0.25 * Math.exp(-(((dist - 1) / 0.3) ** 2));
      h[py * size + px] += v * d;
    }
  }
}
function normalFrom(h, size, strength) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), img = g.createImageData(size, size), d = img.data;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const xl = h[y * size + ((x - 1 + size) % size)], xr = h[y * size + ((x + 1) % size)];
    const yu = h[((y - 1 + size) % size) * size + x], yd = h[((y + 1) % size) * size + x];
    let nx = (xl - xr) * strength, ny = (yd - yu) * strength, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const i = (y * size + x) * 4;
    d[i] = (nx * 0.5 + 0.5) * 255; d[i + 1] = (ny * 0.5 + 0.5) * 255; d[i + 2] = (nz * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}
function toTex(canvas, srgb, renderer, repeat = true) {
  const t = new THREE.CanvasTexture(canvas);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}
function greyCanvas(size, fn) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), img = g.createImageData(size, size), d = img.data;
  for (let i = 0; i < size * size; i++) { const [r, gg, b] = fn(i); d[i * 4] = r; d[i * 4 + 1] = gg; d[i * 4 + 2] = b; d[i * 4 + 3] = 255; }
  g.putImageData(img, 0, 0);
  return c;
}

export function makeTextures(renderer, q) {
  const S = q.texSize;
  // ---------------- regolith: fine dust with pebbles and tiny craters
  const h = fbmField(S, 8, 6, 11, 0.55);
  const pebbles = fbmField(S, 64, 2, 77, 0.5);
  for (let i = 0; i < h.length; i++) { const p = pebbles[i]; h[i] = h[i] * 0.6 + Math.max(0, p - 0.62) * 2.2; }
  craterlets(h, S, Math.round(S * 0.09), S * 0.006, S * 0.05, 5, 0.22);
  const tone = fbmField(S, 4, 4, 23, 0.6);
  const reg = greyCanvas(S, (i) => { const v = 120 + (tone[i] - 0.5) * 70 + (h[i] - 0.5) * 60; return [v, v * 0.985, v * 0.96]; });
  const regN = normalFrom(h, S, S / 64);
  // ---------------- rock: craggy, cracked, darker
  const rh = fbmField(S, 6, 6, 41, 0.58);
  const cracks = fbmField(S, 16, 3, 43, 0.5);
  for (let i = 0; i < rh.length; i++) rh[i] -= Math.max(0, 0.06 - Math.abs(cracks[i] - 0.5)) * 6;
  craterlets(rh, S, Math.round(S * 0.03), S * 0.004, S * 0.02, 9, 0.18);
  const rockC = greyCanvas(S, (i) => { const v = 112 + (rh[i] - 0.5) * 120 + (tone[(i * 7) % tone.length] - 0.5) * 30; return [v, v * 0.98, v * 0.95]; });
  const rockN = normalFrom(rh, S, S / 40);
  // ---------------- rover panels: white composite plates with seams and rivets
  const P = 512;
  const pc = document.createElement('canvas'); pc.width = pc.height = P;
  const pg = pc.getContext('2d');
  pg.fillStyle = '#d9dbdc'; pg.fillRect(0, 0, P, P);
  const pr = rng(3);
  for (let i = 0; i < 1400; i++) { const v = 200 + pr() * 40; pg.fillStyle = `rgba(${v},${v},${v + 3},0.08)`; pg.fillRect(pr() * P, pr() * P, 2 + pr() * 30, 1 + pr() * 4); }
  const ph = new Float32Array(P * P).fill(0.5);
  pg.strokeStyle = 'rgba(70,72,76,0.75)'; pg.lineWidth = 2;
  const cells = [[0, 0, 256, 192], [256, 0, 256, 128], [256, 128, 256, 128], [0, 192, 160, 192], [160, 192, 352, 192], [0, 384, 256, 128], [256, 384, 256, 128]];
  for (const [x, y, w, hh] of cells) {
    pg.strokeRect(x + 3, y + 3, w - 6, hh - 6);
    for (let k = 0; k < w; k++) { for (const yy of [y + 3, y + hh - 4]) ph[yy * P + x + k] = 0; }
    for (let k = 0; k < hh; k++) { for (const xx of [x + 3, x + w - 4]) ph[(y + k) * P + xx] = 0; }
    pg.fillStyle = 'rgba(60,60,64,0.6)';
    for (const [rx, ry] of [[x + 10, y + 10], [x + w - 12, y + 10], [x + 10, y + hh - 12], [x + w - 12, y + hh - 12]]) { pg.beginPath(); pg.arc(rx, ry, 2.5, 0, 7); pg.fill(); ph[ry * P + rx] = 1; }
  }
  pg.fillStyle = 'rgba(30,30,34,0.85)'; pg.font = 'bold 26px sans-serif'; pg.fillText('CR-06', 300, 70);
  pg.fillStyle = '#c9512c'; pg.fillRect(20, 150, 200, 14);
  const panelN = normalFrom(ph, P, 6);
  // ---------------- gold foil (crinkled multi-layer insulation)
  const fh = fbmField(256, 8, 5, 61, 0.65);
  const foilC = greyCanvas(256, (i) => { const v = fh[i]; return [200 + v * 55, 150 + v * 60, 60 + v * 40]; });
  const foilN = normalFrom(fh, 256, 9);
  // ---------------- solar cells
  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sg = sc.getContext('2d');
  sg.fillStyle = '#0b1530'; sg.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const gr = sg.createLinearGradient(x * 32, y * 32, x * 32 + 32, y * 32 + 32);
    gr.addColorStop(0, '#1d3a78'); gr.addColorStop(1, '#0e1f48');
    sg.fillStyle = gr; sg.fillRect(x * 32 + 1.5, y * 32 + 1.5, 29, 29);
    sg.fillStyle = 'rgba(180,200,255,0.25)'; sg.fillRect(x * 32 + 15, y * 32 + 1.5, 1, 29);
  }
  // ---------------- Earth
  const EW = q.earthSize, EH = EW / 2;
  const land = fbmField(EW, 6, 7, 97, 0.55);
  const det = fbmField(EW, 24, 4, 98, 0.5);
  const cl = fbmField(EW, 8, 6, 99, 0.58);
  const ec = document.createElement('canvas'); ec.width = EW; ec.height = EH;
  const eg = ec.getContext('2d'), eimg = eg.createImageData(EW, EH), ed = eimg.data;
  const cc = document.createElement('canvas'); cc.width = EW; cc.height = EH;
  const cg = cc.getContext('2d'), cimg = cg.createImageData(EW, EH), cd = cimg.data;
  for (let y = 0; y < EH; y++) {
    const lat = Math.abs(y / EH - 0.5) * 2; // 0 equator .. 1 pole
    for (let x = 0; x < EW; x++) {
      const i = y * EW + x, sI = ((y * 2) % EW) * EW + x; // stretch the square field over the map
      const hgt = land[sI] * 0.8 + det[sI] * 0.2 - lat * 0.05;
      let r, g, b;
      if (hgt < 0.53) { const deep = Math.min(1, (0.53 - hgt) * 6); r = 10 + 8 * (1 - deep); g = 40 + 40 * (1 - deep); b = 90 + 50 * (1 - deep); }
      else {
        const dry = det[sI] > 0.55 && lat < 0.45;
        const k = Math.min(1, (hgt - 0.53) * 5);
        if (dry) { r = 170 - 30 * k; g = 140 - 30 * k; b = 90 - 20 * k; } else { r = 50 + 60 * k; g = 85 + 30 * k; b = 40 + 20 * k; }
      }
      if (lat > 0.82 || (lat > 0.7 && hgt > 0.5)) { r = g = b = 235; }
      const o = (y * EW + x) * 4;
      ed[o] = r; ed[o + 1] = g; ed[o + 2] = b; ed[o + 3] = 255;
      const c = Math.max(0, Math.min(1, (cl[sI] - 0.47) * 3.2 + (lat > 0.9 ? 0.4 : 0)));
      cd[o] = cd[o + 1] = cd[o + 2] = 255; cd[o + 3] = c * 255;
      void i;
    }
  }
  eg.putImageData(eimg, 0, 0); cg.putImageData(cimg, 0, 0);
  const T = {
    regolith: toTex(reg, true, renderer), regolithN: toTex(regN, false, renderer),
    rock: toTex(rockC, true, renderer), rockN: toTex(rockN, false, renderer),
    panel: toTex(pc, true, renderer), panelN: toTex(panelN, false, renderer),
    foil: toTex(foilC, true, renderer), foilN: toTex(foilN, false, renderer),
    solar: toTex(sc, true, renderer),
    earth: toTex(ec, true, renderer, false), clouds: toTex(cc, true, renderer, false),
    soft: softSprite(), spark: sparkSprite(), ring: ringSprite(), glow: glowSprite(),
  };
  T.earth.wrapS = T.clouds.wrapS = THREE.RepeatWrapping;
  return T;
}

// particle sprites
function radial(size, stops) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  return c;
}
function softSprite() {
  // puffy dust: soft disc with lumpy noise
  const S = 128, c = radial(S, [[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]);
  const g = c.getContext('2d'), r = rng(8);
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.12})`; g.beginPath(); g.arc(r() * S, r() * S, 4 + r() * 16, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function sparkSprite() { const t = new THREE.CanvasTexture(radial(64, [[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255,240,200,0.9)'], [0.5, 'rgba(255,160,60,0.25)'], [1, 'rgba(255,100,20,0)']])); t.colorSpace = THREE.SRGBColorSpace; return t; }
function glowSprite() { const t = new THREE.CanvasTexture(radial(128, [[0, 'rgba(255,255,255,1)'], [0.12, 'rgba(255,255,255,0.6)'], [0.4, 'rgba(255,255,255,0.12)'], [1, 'rgba(255,255,255,0)']])); t.colorSpace = THREE.SRGBColorSpace; return t; }
function ringSprite() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 30, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.85, 'rgba(255,255,255,0.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
