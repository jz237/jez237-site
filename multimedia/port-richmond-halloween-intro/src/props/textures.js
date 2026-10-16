// Procedural canvas textures for the props (seeded, generated once at load).
import * as THREE from 'three';
import { rng, clamp } from './util.js';

const cache = new Map();

export function canvasTexture(key, w, h, draw, { repeat = null, srgb = true, mips = true, aniso = 8, wrap = true, flipY = true } = {}) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = aniso;
  t.generateMipmaps = mips;
  t.minFilter = mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
  t.flipY = flipY;
  if (wrap) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.name = key;
  cache.set(key, t);
  return t;
}

// value noise field helper on ImageData (fast enough for <= 1024^2 once)
function noiseField(w, h, scale, seed, oct = 4) {
  const R = rng(seed);
  const gw = Math.ceil(w / scale) + 2, gh = Math.ceil(h / scale) + 2;
  const out = new Float32Array(w * h);
  let amp = 1, norm = 0, sc = scale;
  for (let o = 0; o < oct; o++) {
    const gx = Math.ceil(w / sc) + 2, gy = Math.ceil(h / sc) + 2;
    const grid = new Float32Array(gx * gy);
    for (let i = 0; i < grid.length; i++) grid[i] = R();
    for (let y = 0; y < h; y++) {
      const fy = y / sc, iy = Math.floor(fy), ty = fy - iy, sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < w; x++) {
        const fx = x / sc, ix = Math.floor(fx), tx = fx - ix, sx = tx * tx * (3 - 2 * tx);
        const a = grid[iy * gx + ix], b = grid[iy * gx + ix + 1], c = grid[(iy + 1) * gx + ix], d = grid[(iy + 1) * gx + ix + 1];
        out[y * w + x] += amp * ((a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy);
      }
    }
    norm += amp; amp *= 0.5; sc /= 2;
    if (sc < 1) break;
  }
  for (let i = 0; i < out.length; i++) out[i] /= norm;
  void gw; void gh;
  return out;
}

function putField(g, w, h, fn) {
  const img = g.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    fn(x, y, d, i);
  }
  g.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------------------------------------------------------
// Dated wallpaper: faded cream/gold vertical stripes with a small damask motif; water stains, grime toward floor.
export function wallpaperTexture() {
  return canvasTexture('wallpaper', 512, 512, (g, w, h) => {
    const R = rng(77);
    g.fillStyle = '#c9b48c'; g.fillRect(0, 0, w, h);
    // stripes
    for (let x = 0; x < w; x += 64) {
      g.fillStyle = 'rgba(160,128,80,0.35)'; g.fillRect(x, 0, 6, h);
      g.fillStyle = 'rgba(160,128,80,0.18)'; g.fillRect(x + 12, 0, 2, h);
      g.fillStyle = 'rgba(255,240,210,0.18)'; g.fillRect(x + 30, 0, 22, h);
    }
    // damask motif rows
    g.strokeStyle = 'rgba(120,92,52,0.42)'; g.lineWidth = 2;
    for (let y = 0; y < h + 64; y += 128) for (let x = 0; x < w; x += 64) {
      const ox = x + 41, oy = y + ((x / 64) % 2) * 64;
      g.beginPath();
      g.moveTo(ox, oy - 26); g.bezierCurveTo(ox + 14, oy - 14, ox + 10, oy + 6, ox, oy + 24);
      g.bezierCurveTo(ox - 10, oy + 6, ox - 14, oy - 14, ox, oy - 26);
      g.stroke();
      g.beginPath(); g.arc(ox, oy, 4, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(ox - 9, oy + 10); g.quadraticCurveTo(ox - 16, oy + 20, ox - 6, oy + 26); g.stroke();
      g.beginPath(); g.moveTo(ox + 9, oy + 10); g.quadraticCurveTo(ox + 16, oy + 20, ox + 6, oy + 26); g.stroke();
    }
    // fading + grime noise
    const n = noiseField(w, h, 96, 5, 5);
    putField(g, w, h, (x, y, d, i) => {
      const k = 0.88 + 0.2 * n[y * w + x];
      d[i] = clamp(d[i] * k, 0, 255); d[i + 1] = clamp(d[i + 1] * k, 0, 255); d[i + 2] = clamp(d[i + 2] * k * 0.97, 0, 255);
    });
    for (let s = 0; s < 3; s++) { // faint water stain tide marks
      const x = R() * w, y = R() * h * 0.6, r = 30 + R() * 50;
      const gr = g.createRadialGradient(x, y, r * 0.6, x, y, r);
      gr.addColorStop(0, 'rgba(120,90,40,0.0)'); gr.addColorStop(0.92, 'rgba(110,80,35,0.16)'); gr.addColorStop(1, 'rgba(110,80,35,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
  });
}

export function plasterTexture(key = 'plaster', base = '#d8d2c4') {
  return canvasTexture(key, 256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const n = noiseField(w, h, 64, 9, 5);
    putField(g, w, h, (x, y, d, i) => { const k = 0.93 + 0.12 * n[y * w + x]; d[i] *= k; d[i + 1] *= k; d[i + 2] *= k; });
  });
}

// Oak strip flooring, worn finish. 1 texture unit ~ 1 m when repeat is set per metre by geometry UVs.
export function woodFloorTexture() {
  return canvasTexture('woodfloor', 1024, 1024, (g, w, h) => {
    const R = rng(321);
    const boardW = w / 14; // ~7 cm strips per 1 m
    for (let bx = 0; bx < 14; bx++) {
      let y = -R() * 400;
      while (y < h) {
        const len = 260 + R() * 520;
        const tone = 0.75 + R() * 0.35;
        const r = 120 * tone, gg = 78 * tone, b = 44 * tone;
        g.fillStyle = `rgb(${r | 0},${gg | 0},${b | 0})`;
        g.fillRect(bx * boardW, y, boardW, len);
        // grain
        g.strokeStyle = `rgba(${(r * 0.6) | 0},${(gg * 0.55) | 0},${(b * 0.5) | 0},0.35)`;
        g.lineWidth = 1;
        for (let k = 0; k < 7; k++) {
          const gx = bx * boardW + 4 + R() * (boardW - 8);
          g.beginPath(); g.moveTo(gx, y);
          for (let yy = y; yy < y + len; yy += 24) g.lineTo(gx + Math.sin(yy * 0.02 + k) * 2.5, yy);
          g.stroke();
        }
        g.fillStyle = 'rgba(20,12,6,0.85)'; g.fillRect(bx * boardW, y + len - 2, boardW, 2); // butt joint
        y += len;
      }
      g.fillStyle = 'rgba(15,10,5,0.9)'; g.fillRect(bx * boardW, 0, 1.5, h); // seams
    }
    // wear: lighter traffic path, dirt in seams
    const n = noiseField(w, h, 128, 41, 5);
    putField(g, w, h, (x, y, d, i) => { const k = 0.85 + 0.3 * n[y * w + x]; d[i] *= k; d[i + 1] *= k; d[i + 2] *= k; });
  });
}

// Faded oriental-style area rug (red/navy/cream), with border.
export function rugTexture() {
  return canvasTexture('rug', 1024, 768, (g, w, h) => {
    const R = rng(55);
    g.fillStyle = '#6b1f1c'; g.fillRect(0, 0, w, h);
    const band = (m, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.strokeRect(m, m, w - 2 * m, h - 2 * m); };
    band(18, '#1d2a44', 24); band(52, '#c9b48a', 8); band(70, '#1d2a44', 14);
    // border motifs
    g.fillStyle = '#c9a66b';
    for (let x = 100; x < w - 100; x += 46) { g.beginPath(); g.ellipse(x, 36, 10, 6, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(x, h - 36, 10, 6, 0, 0, 7); g.fill(); }
    for (let y = 100; y < h - 100; y += 46) { g.beginPath(); g.ellipse(36, y, 6, 10, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(w - 36, y, 6, 10, 0, 0, 7); g.fill(); }
    // central medallion
    const cx = w / 2, cy = h / 2;
    for (let r = 220; r > 20; r -= 26) {
      g.fillStyle = (r / 26) % 2 < 1 ? '#1d2a44' : '#8a2c22';
      g.beginPath();
      for (let a = 0; a <= 64; a++) { const t = (a / 64) * Math.PI * 2; const rr = r * (1 + 0.12 * Math.cos(t * 8)); g.lineTo(cx + Math.cos(t) * rr * 1.25, cy + Math.sin(t) * rr * 0.8); }
      g.fill();
    }
    g.fillStyle = '#c9b48a'; g.beginPath(); g.ellipse(cx, cy, 30, 20, 0, 0, 7); g.fill();
    // field pattern
    g.fillStyle = 'rgba(30,40,68,0.55)';
    for (let i = 0; i < 260; i++) { const x = 110 + R() * (w - 220), y = 110 + R() * (h - 220); if (Math.hypot((x - cx) / 1.25, (y - cy) / 0.8) < 240) continue; g.fillRect(x, y, 6, 6); }
    // wear + fade
    const n = noiseField(w, h, 160, 8, 6);
    putField(g, w, h, (x, y, d, i) => {
      const k = 0.7 + 0.45 * n[y * w + x];
      const fade = 0.25 * clamp(1 - Math.hypot((x - cx) / w, (y - cy) / h) * 2.2, 0, 1);
      d[i] = d[i] * k + 40 * fade; d[i + 1] = d[i + 1] * k + 36 * fade; d[i + 2] = d[i + 2] * k + 30 * fade;
    });
  });
}

export function fabricTexture(key, base, { seed = 3, weave = 0.12 } = {}) {
  return canvasTexture(key, 256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const n = noiseField(w, h, 32, seed, 4);
    putField(g, w, h, (x, y, d, i) => {
      const wv = ((x % 4 < 2) !== (y % 4 < 2)) ? 1 + weave : 1 - weave;
      const k = (0.86 + 0.24 * n[y * w + x]) * wv;
      d[i] = clamp(d[i] * k, 0, 255); d[i + 1] = clamp(d[i + 1] * k, 0, 255); d[i + 2] = clamp(d[i + 2] * k, 0, 255);
    });
  });
}

// "Family photo": soft painterly figures on a background (no real faces), slightly faded print.
export function photoTexture(seed) {
  return canvasTexture('photo' + seed, 256, 320, (g, w, h) => {
    const R = rng(seed * 101 + 7);
    const bgs = [['#6e8aa6', '#b8c6cf'], ['#5d6b4a', '#a9b38a'], ['#7a5f4f', '#cdb7a0'], ['#4c5a6e', '#d0c6b4']];
    const [b0, b1] = bgs[seed % bgs.length];
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, b1); gr.addColorStop(1, b0);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const n = 1 + Math.floor(R() * 3);
    for (let k = 0; k < n; k++) {
      const cx = w * (0.5 + (k - (n - 1) / 2) * 0.28) + (R() - 0.5) * 10;
      const sc = 0.8 + R() * 0.35;
      const shirt = ['#2c3e66', '#7a2430', '#e8e2d0', '#3d5a3a', '#3a3a3a'][Math.floor(R() * 5)];
      g.fillStyle = shirt;
      g.beginPath(); g.ellipse(cx, h * 0.98, 62 * sc, 110 * sc, 0, Math.PI, 0); g.fill();
      const skin = ['#d9b08c', '#c68e66', '#8d5a3b', '#e6c3a3'][Math.floor(R() * 4)];
      g.fillStyle = skin;
      g.beginPath(); g.ellipse(cx, h * 0.5, 26 * sc, 32 * sc, 0, 0, 7); g.fill();
      g.fillStyle = ['#2a1d14', '#5a3b22', '#a07a4a', '#1a1a1a'][Math.floor(R() * 4)];
      g.beginPath(); g.ellipse(cx, h * 0.45, 28 * sc, 22 * sc, 0, Math.PI, 0); g.fill();
    }
    // soften + fade + vignette
    g.filter = 'blur(2px)'; g.drawImage(g.canvas, 0, 0); g.filter = 'none';
    const vg = g.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.8);
    vg.addColorStop(0, 'rgba(255,240,210,0.08)'); vg.addColorStop(1, 'rgba(60,40,20,0.35)');
    g.fillStyle = vg; g.fillRect(0, 0, w, h);
  }, { wrap: false });
}

// Sheer lace curtain (RGBA: alpha = thread density)
export function laceTexture() {
  return canvasTexture('lace', 256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = 'rgba(245,240,228,0.42)'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(252,249,242,0.95)'; g.lineWidth = 2.2;
    for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) {
      g.beginPath(); g.arc(x + 16, y + 16, 9, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(x + 16, y + 3); g.lineTo(x + 16, y + 29); g.moveTo(x + 3, y + 16); g.lineTo(x + 29, y + 16); g.stroke();
      g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.stroke();
    }
    g.strokeStyle = 'rgba(250,246,236,0.5)'; g.lineWidth = 0.9;
    for (let i = 0; i < w; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
  });
}

// Black construction-paper bat silhouette (alpha), wings spread
export function batTexture() {
  return canvasTexture('paperbat', 256, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#0b0a0a';
    g.beginPath();
    const cx = w / 2;
    g.moveTo(cx, 40);
    g.lineTo(cx + 8, 30); g.lineTo(cx + 12, 44); // ear
    g.quadraticCurveTo(cx + 40, 30, cx + 70, 18); g.quadraticCurveTo(cx + 100, 12, cx + 122, 26);
    g.quadraticCurveTo(cx + 104, 46, cx + 112, 70); g.quadraticCurveTo(cx + 92, 58, cx + 80, 80);
    g.quadraticCurveTo(cx + 64, 64, cx + 48, 86); g.quadraticCurveTo(cx + 34, 68, cx + 16, 82);
    g.lineTo(cx, 100);
    g.lineTo(cx - 16, 82); g.quadraticCurveTo(cx - 34, 68, cx - 48, 86); g.quadraticCurveTo(cx - 64, 64, cx - 80, 80);
    g.quadraticCurveTo(cx - 92, 58, cx - 112, 70); g.quadraticCurveTo(cx - 104, 46, cx - 122, 26);
    g.quadraticCurveTo(cx - 100, 12, cx - 70, 18); g.quadraticCurveTo(cx - 40, 30, cx - 12, 44);
    g.lineTo(cx - 8, 30); g.closePath();
    g.fill();
  }, { wrap: false });
}

// Fibrous stretched fake cobweb (RGBA). Strands concentrate along a few anchor lines, with torn holes.
export function cobwebTexture(seed = 1) {
  return canvasTexture('cobweb' + seed, 512, 512, (g, w, h) => {
    const R = rng(seed * 997 + 13);
    g.clearRect(0, 0, w, h);
    g.lineCap = 'round';
    // anchor points around the edge (where the web is hooked on rails/balusters)
    const anchors = [];
    for (let i = 0; i < 9; i++) {
      const side = Math.floor(R() * 4), u = R();
      anchors.push(side === 0 ? [u * w, 4] : side === 1 ? [w - 4, u * h] : side === 2 ? [u * w, h - 4] : [4, u * h]);
    }
    const holes = [];
    for (let i = 0; i < 3; i++) holes.push([w * (0.2 + 0.6 * R()), h * (0.2 + 0.6 * R()), 30 + R() * 70]);
    const inHole = (x, y) => holes.some(([hx, hy, r]) => (x - hx) ** 2 + (y - hy) ** 2 < r * r);
    for (let i = 0; i < 1400; i++) {
      const a = anchors[Math.floor(R() * anchors.length)], b = anchors[Math.floor(R() * anchors.length)];
      if (a === b) continue;
      const mx = (a[0] + b[0]) / 2 + (R() - 0.5) * w * 0.5, my = (a[1] + b[1]) / 2 + (R() - 0.5) * h * 0.5;
      if (inHole(mx, my) && R() < 0.85) continue;
      const alpha = 0.05 + R() * 0.22;
      g.strokeStyle = `rgba(235,235,232,${alpha})`;
      g.lineWidth = 0.6 + R() * 1.1;
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(mx, my, b[0], b[1]); g.stroke();
    }
    // fluffy clumps
    for (let i = 0; i < 26; i++) {
      const x = R() * w, y = R() * h; if (inHole(x, y)) continue;
      const r = 8 + R() * 26;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(240,240,236,0.28)'); gr.addColorStop(1, 'rgba(240,240,236,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
  }, { wrap: false, mips: true });
}

// Generic Halloween door sign, hand-painted wood: "BOO!"
export function booSignTexture() {
  return canvasTexture('boosign', 512, 256, (g, w, h) => {
    const n = noiseField(w, h, 64, 21, 4);
    g.fillStyle = '#2a1c12'; g.fillRect(0, 0, w, h);
    // weathered black-painted board with wood grain
    putField(g, w, h, (x, y, d, i) => { const k = 0.7 + 0.5 * n[y * w + x] + 0.12 * Math.sin(y * 0.35 + n[y * w + x] * 9); d[i] = 32 * k; d[i + 1] = 27 * k; d[i + 2] = 24 * k; });
    g.fillStyle = '#e8762a';
    g.font = 'bold 150px Georgia, "DejaVu Serif", serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); g.translate(w / 2, h / 2 + 8); g.rotate(-0.04); g.fillText('BOO!', 0, 0); g.restore();
    g.strokeStyle = 'rgba(230,220,200,0.6)'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
    // paint chips
    const R = rng(4);
    g.fillStyle = 'rgba(40,30,22,0.9)';
    for (let i = 0; i < 50; i++) g.fillRect(R() * w, R() * h, 2 + R() * 6, 1 + R() * 3);
  }, { wrap: false });
}

// Foam tombstone face: speckled grey with an engraved "R.I.P." (colour) + matching bump
export function tombstoneTexture(seed = 1, text = 'R.I.P.') {
  return canvasTexture('tomb' + seed + text, 256, 320, (g, w, h) => {
    const n = noiseField(w, h, 40, 30 + seed, 5);
    putField(g, w, h, (x, y, d, i) => { const k = 0.55 + 0.45 * n[y * w + x]; d[i] = 118 * k + 20; d[i + 1] = 118 * k + 20; d[i + 2] = 116 * k + 20; d[i + 3] = 255; });
    const R = rng(seed);
    for (let i = 0; i < 900; i++) { g.fillStyle = R() < 0.5 ? 'rgba(40,40,40,0.5)' : 'rgba(220,220,215,0.4)'; g.fillRect(R() * w, R() * h, 1.5, 1.5); }
    g.font = 'bold 54px Georgia, "DejaVu Serif", serif'; g.textAlign = 'center';
    g.fillStyle = 'rgba(30,30,30,0.85)'; g.fillText(text, w / 2 + 2, h * 0.42 + 2);
    g.fillStyle = 'rgba(175,175,170,1)'; g.fillText(text, w / 2, h * 0.42);
    // moss-green dirt at the base
    const gr = g.createLinearGradient(0, h * 0.75, 0, h); gr.addColorStop(0, 'rgba(50,60,30,0)'); gr.addColorStop(1, 'rgba(45,52,28,0.7)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, { wrap: false });
}

// Leaf atlas: 4x2 cells, alpha cut-out leaves (Callery pear: small oval glossy, reds; London plane / maple: lobed browns)
export function leafAtlasTexture() {
  return canvasTexture('leafatlas', 1024, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const R = rng(808);
    const cw = w / 4, ch = h / 2;
    const cols = [['#7d1f17', '#a8401f'], ['#5e1717', '#8c2a22'], ['#9a5a1c', '#c98a2c'], ['#6a4a22', '#8e6a34'], ['#8a3a1a', '#b5602a'], ['#4e3a20', '#76583a'], ['#a07028', '#c9a048'], ['#5a2a18', '#7c4024']];
    for (let k = 0; k < 8; k++) {
      const cx = (k % 4) * cw + cw / 2, cy = Math.floor(k / 4) * ch + ch / 2;
      const [c0, c1] = cols[k];
      g.save(); g.translate(cx, cy);
      const lobed = k >= 5;
      g.beginPath();
      if (!lobed) {
        // oval pear leaf, slightly asymmetric, pointed tip
        const L = ch * 0.44, W = cw * 0.3;
        g.moveTo(0, -L);
        g.bezierCurveTo(W * 1.1, -L * 0.5, W * 1.05, L * 0.55, 0, L * 0.8);
        g.bezierCurveTo(-W * 1.0, L * 0.5, -W * 1.15, -L * 0.45, 0, -L);
      } else {
        // 5-lobed plane/maple leaf
        const L = ch * 0.42;
        for (let a = 0; a <= 100; a++) {
          const t = (a / 100) * Math.PI * 2;
          const lobes = 0.62 + 0.38 * Math.pow(Math.abs(Math.cos(t * 2.5)), 0.6);
          const r = L * lobes * (t > Math.PI * 0.85 && t < Math.PI * 1.15 ? 0.55 : 1);
          const x = Math.sin(t) * r, y = -Math.cos(t) * r;
          if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.closePath();
      }
      const gr = g.createLinearGradient(0, -ch * 0.4, 0, ch * 0.4); gr.addColorStop(0, c1); gr.addColorStop(1, c0);
      g.fillStyle = gr; g.fill();
      // veins + blotches
      g.strokeStyle = 'rgba(30,15,8,0.45)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(0, -ch * 0.42); g.lineTo(0, ch * 0.42); g.stroke();
      g.lineWidth = 1;
      for (let v = -3; v <= 3; v++) { if (!v) continue; g.beginPath(); g.moveTo(0, v * ch * 0.09); g.lineTo(Math.sign(v) * cw * 0.25, v * ch * 0.09 - ch * 0.1); g.stroke(); g.beginPath(); g.moveTo(0, v * ch * 0.09); g.lineTo(-Math.sign(v) * cw * 0.25, v * ch * 0.09 - ch * 0.1); g.stroke(); }
      for (let b = 0; b < 6; b++) { g.fillStyle = `rgba(30,18,10,${0.15 + R() * 0.25})`; g.beginPath(); g.arc((R() - 0.5) * cw * 0.4, (R() - 0.5) * ch * 0.6, 3 + R() * 9, 0, 7); g.fill(); }
      // stem
      g.strokeStyle = '#3a2614'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, ch * 0.4); g.lineTo(2, ch * 0.48); g.stroke();
      g.restore();
    }
  }, { wrap: false });
}

// 1970s dark wood wall paneling (4x8 sheets with random-width grooves), common in Philly rowhouse front rooms.
export function panelingTexture() {
  return canvasTexture('paneling', 512, 512, (g, w, h) => {
    const R = rng(1977);
    g.fillStyle = '#3b2617'; g.fillRect(0, 0, w, h);
    // grain streaks
    for (let i = 0; i < 260; i++) {
      const x = R() * w, len = 60 + R() * 300, y = R() * h;
      g.strokeStyle = `rgba(${20 + R() * 30},${12 + R() * 18},${6 + R() * 10},${0.25 + R() * 0.35})`;
      g.lineWidth = 0.6 + R() * 1.6;
      g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + (R() - 0.5) * 6, y + len * 0.3, x + (R() - 0.5) * 6, y + len * 0.6, x + (R() - 0.5) * 4, y + len); g.stroke();
    }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(110,72,40,${0.06 + R() * 0.08})`; g.fillRect(R() * w, 0, 2 + R() * 12, h); }
    // V-grooves at irregular spacing (the panel pattern), darker with a highlight edge
    let x = 0;
    while (x < w) {
      g.fillStyle = 'rgba(8,4,2,0.9)'; g.fillRect(x, 0, 3, h);
      g.fillStyle = 'rgba(140,100,60,0.25)'; g.fillRect(x + 3, 0, 1, h);
      x += [38, 52, 64, 46][Math.floor(R() * 4)];
    }
  }, { wrap: true });
}
