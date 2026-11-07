// Procedural textures, made once at load: tileable rock detail (albedo + normal + height) for the triplanar cave
// shader, a wet-rock variant, soft particle sprites, a spark, a glow, a ring, a water normal map and a caustic.
import * as THREE from '../vendor/three.module.min.js';

// tileable value noise / fbm on a period
function makeNoise(seed) {
  const P = 256, perm = new Uint8Array(P * 2), v = new Float32Array(P);
  let s = seed >>> 0;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = 0; i < P; i++) { perm[i] = i; v[i] = r(); }
  for (let i = P - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < P; i++) perm[i + P] = perm[i];
  const h = (x, y) => v[perm[(perm[x & 255] + y) & 511] & 255];
  const sm = (t) => t * t * (3 - 2 * t);
  // period-p tileable value noise
  return (x, y, p) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = sm(x - xi), fy = sm(y - yi);
    const x0 = ((xi % p) + p) % p, y0 = ((yi % p) + p) % p, x1 = (x0 + 1) % p, y1 = (y0 + 1) % p;
    const a = h(x0, y0), b = h(x1, y0), c = h(x0, y1), d = h(x1, y1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}
function fbm(n, x, y, p, oct = 5, lac = 2, gain = 0.5) {
  let a = 0.5, s = 0, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { s += a * n(x * f, y * f, p * f); norm += a; a *= gain; f *= lac; }
  return s / norm;
}
function ridged(n, x, y, p, oct = 4) {
  let a = 0.5, s = 0, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { const v = 1 - Math.abs(n(x * f, y * f, p * f) * 2 - 1); s += a * v * v; norm += a; a *= 0.5; f *= 2; }
  return s / norm;
}

function dataTex(data, size, srgb = false, repeat = true) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

// rock: height from layered fbm + ridges (cracks) + pits; albedo detail (strata, speckles, mineral stains);
// normal from the height. Packs: tAlb = rgb detail + a roughness detail, tNrm = rgb normal + a height/cavity.
export function rockTextures(size = 512, seed = 7) {
  const n = makeNoise(seed), n2 = makeNoise(seed * 3 + 1), n3 = makeNoise(seed * 7 + 5);
  const H = new Float32Array(size * size);
  const p = 8;   // noise period in lattice cells across the texture
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size * p, v = y / size * p;
    const base = fbm(n, u, v, p, 6);
    const cr = ridged(n2, u * 1.5, v * 1.5, p * 1.5, 4);
    const pits = fbm(n3, u * 4, v * 4, p * 4, 3);
    let h = base * 0.6 + (1 - cr) * -0.35 + Math.max(0, pits - 0.62) * -0.8;
    // flaking ledges (layered sediment)
    h += Math.sin((v * 2.5 + base * 3.5) * Math.PI) * 0.06;
    H[y * size + x] = h;
  }
  let mn = 1e9, mx = -1e9; for (const h of H) { if (h < mn) mn = h; if (h > mx) mx = h; }
  for (let i = 0; i < H.length; i++) H[i] = (H[i] - mn) / (mx - mn);
  const alb = new Uint8Array(size * size * 4), nrm = new Uint8Array(size * size * 4);
  const at = (x, y) => H[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x, h = H[i];
    const dx = (at(x + 1, y) - at(x - 1, y)) * 6.5, dy = (at(x, y + 1) - at(x, y - 1)) * 6.5;
    const l = Math.hypot(dx, dy, 1);
    nrm[i * 4] = (-dx / l * 0.5 + 0.5) * 255; nrm[i * 4 + 1] = (-dy / l * 0.5 + 0.5) * 255; nrm[i * 4 + 2] = (1 / l * 0.5 + 0.5) * 255;
    // cavity: darker in the low places
    const cav = Math.min(1, Math.max(0, (h - 0.15) * 1.4));
    nrm[i * 4 + 3] = cav * 255;
    const u = x / size * p, v = y / size * p;
    const speck = n3(u * 24, v * 24, p * 24);
    const band = 0.5 + 0.5 * Math.sin((v * 1.3 + fbm(n2, u, v, p, 3) * 2.2) * Math.PI * 2);
    let g = 0.62 + h * 0.38 + (speck > 0.82 ? 0.18 : speck < 0.12 ? -0.14 : 0) + band * 0.06;
    g *= 0.72 + cav * 0.28;
    const stain = fbm(n, u * 0.5 + 3.1, v * 0.5 + 1.7, p * 0.5, 3);
    alb[i * 4] = Math.min(255, g * (0.98 + stain * 0.1) * 255);
    alb[i * 4 + 1] = Math.min(255, g * (0.95 + stain * 0.03) * 255);
    alb[i * 4 + 2] = Math.min(255, g * (0.9 - stain * 0.06) * 255);
    alb[i * 4 + 3] = (0.55 + (1 - h) * 0.35 + (speck > 0.85 ? -0.25 : 0)) * 255;   // roughness detail: smoother on the high, polished bits
  }
  return { alb: dataTex(alb, size), nrm: dataTex(nrm, size) };
}

// soft round sprite, spark streak, glow, ring
function canvasTex(size, draw) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); draw(g, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function spriteTextures() {
  const soft = canvasTex(128, (g, s) => {
    // a cloudy puff (not a perfect disc)
    const id = g.createImageData(s, s), n = makeNoise(11);
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
      const dx = (x - s / 2) / (s / 2), dy = (y - s / 2) / (s / 2), r = Math.hypot(dx, dy);
      const f = fbm(n, x / s * 4, y / s * 4, 4, 4);
      const a = Math.max(0, 1 - r) ** 1.6 * (0.55 + f * 0.7);
      const i = (y * s + x) * 4; id.data[i] = id.data[i + 1] = id.data[i + 2] = 255; id.data[i + 3] = Math.min(255, a * 255);
    }
    g.putImageData(id, 0, 0);
  });
  const spark = canvasTex(64, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,255,255,0.85)'); r.addColorStop(0.45, 'rgba(255,255,255,0.18)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  });
  const glow = canvasTex(128, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,0.45)'); r.addColorStop(0.6, 'rgba(255,255,255,0.1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  });
  const ring = canvasTex(256, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, s * 0.32, s / 2, s / 2, s / 2);
    r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(0.55, 'rgba(255,255,255,0.9)'); r.addColorStop(0.75, 'rgba(255,255,255,0.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  });
  // a sharp four-point glint for gold and gems
  const glint = canvasTex(128, (g, s) => {
    g.translate(s / 2, s / 2);
    for (const [w, a] of [[s * 0.5, 0], [s * 0.32, Math.PI / 4]]) {
      g.save(); g.rotate(a);
      const lg = g.createLinearGradient(-w, 0, w, 0);
      lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,255,255,1)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = lg; g.fillRect(-w, -1.5, w * 2, 3); g.rotate(Math.PI / 2); g.fillRect(-w, -1.5, w * 2, 3);
      g.restore();
    }
    const r = g.createRadialGradient(0, 0, 0, 0, 0, s * 0.18);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(-s / 2, -s / 2, s, s);
  });
  return { soft, spark, glow, ring, glint };
}

// water surface normals (tileable ripples) and a caustic pattern
export function waterTextures(size = 256) {
  const n = makeNoise(31), n2 = makeNoise(57);
  const H = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) H[y * size + x] = fbm(n, x / size * 6, y / size * 6, 6, 4) * 0.7 + ridged(n2, x / size * 4, y / size * 4, 4, 3) * 0.3;
  const nrm = new Uint8Array(size * size * 4), cau = new Uint8Array(size * size * 4);
  const at = (x, y) => H[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const dx = (at(x + 1, y) - at(x - 1, y)) * 4, dy = (at(x, y + 1) - at(x, y - 1)) * 4, l = Math.hypot(dx, dy, 1);
    nrm[i * 4] = (-dx / l * 0.5 + 0.5) * 255; nrm[i * 4 + 1] = (-dy / l * 0.5 + 0.5) * 255; nrm[i * 4 + 2] = (1 / l * 0.5 + 0.5) * 255; nrm[i * 4 + 3] = 255;
    const c = ridged(n2, x / size * 5 + 0.3, y / size * 5 + 0.7, 5, 2);
    const v = Math.pow(Math.max(0, c), 6) * 255;
    cau[i * 4] = cau[i * 4 + 1] = cau[i * 4 + 2] = v; cau[i * 4 + 3] = 255;
  }
  return { nrm: dataTex(nrm, size), cau: dataTex(cau, size) };
}
