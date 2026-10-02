// Procedural canvas textures. Everything is generated at load time, nothing is downloaded.
import * as THREE from 'three';
import { rng } from './geo.js';

export const FONT = '"Inter","SF Pro Text","Segoe UI","Helvetica Neue",Arial,"DejaVu Sans",system-ui,sans-serif';
export const MONO = '"JetBrains Mono","SF Mono",Menlo,Consolas,"DejaVu Sans Mono",monospace';

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

/** Draw with 2D context and wrap into a texture. opts: srgb (default true), repeat, aniso, flipY. */
export function canvasTex(w, h, draw, { srgb = true, repeat = true, aniso = 8, flipY = true, mip = true } = {}) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  draw(ctx, w, h, c);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = aniso;
  t.flipY = flipY;
  t.generateMipmaps = mip;
  t.minFilter = mip ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

function pixelTex(w, h, fn, opts = {}) {
  return canvasTex(w, h, (ctx) => {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const out = [0, 0, 0, 255];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        fn(x, y, out);
        const k = (y * w + x) * 4;
        d[k] = out[0]; d[k + 1] = out[1]; d[k + 2] = out[2]; d[k + 3] = out[3];
      }
    }
    ctx.putImageData(img, 0, 0);
  }, opts);
}

const hash2 = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** 2x2 twill carbon fibre weave. Returns { map, bump }. `cells` = weave cells across the tile. */
export function carbonTwill({ size = 512, cells = 16, tint = [0.78, 0.82, 0.95], gain = 1 } = {}) {
  const cs = size / cells;
  const tex = pixelTex(size, size, (x, y, o) => {
    const i = Math.floor(x / cs), j = Math.floor(y / cs);
    const u = (x % cs) / cs, v = (y % cs) / cs;
    const k = ((i - j) % 4 + 4) % 4;
    let I;
    if (k < 2) {
      const t = (k + v) / 2;
      const across = Math.sin(Math.PI * u) ** 0.6;
      const along = 0.5 + 0.5 * Math.sin(Math.PI * t);
      const fiber = 0.82 + 0.18 * hash2(Math.floor(x * 1.7), 0, 3);
      I = across * along * fiber;
    } else {
      const t = (k - 2 + u) / 2;
      const across = Math.sin(Math.PI * v) ** 0.6;
      const along = 0.5 + 0.5 * Math.sin(Math.PI * t);
      const fiber = 0.82 + 0.18 * hash2(0, Math.floor(y * 1.7), 5);
      I = across * along * fiber;
    }
    I = (0.18 + 0.82 * I) * gain;
    const base = 0.30 * I;
    o[0] = Math.min(255, base * tint[0] * 255); o[1] = Math.min(255, base * tint[1] * 255); o[2] = Math.min(255, base * tint[2] * 255); o[3] = 255;
  });
  return tex;
}

/** Roughness map for brushed metal; encode in G. `lo..hi` roughness range after material.roughness = 1. */
export function brushed({ size = 512, lo = 0.22, hi = 0.5, strokes = 5200, vertical = false, seed = 4 } = {}) {
  const R = rng(seed);
  return canvasTex(size, size, (ctx, w, h) => {
    const g = (a) => Math.round(a * 255);
    ctx.fillStyle = `rgb(${g(lo)},${g(lo)},${g(lo)})`;
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    for (let i = 0; i < strokes; i++) {
      const v = lo + (hi - lo) * Math.pow(R(), 1.6);
      const len = R.range(w * 0.06, w * 0.5);
      const x = R.range(-len * 0.3, w), y = R.range(0, h);
      ctx.strokeStyle = `rgba(${g(v)},${g(v)},${g(v)},${R.range(0.08, 0.35)})`;
      ctx.lineWidth = R.range(0.5, 1.6);
      ctx.beginPath();
      if (vertical) { ctx.moveTo(y, x); ctx.lineTo(y + R.range(-1, 1), x + len); }
      else { ctx.moveTo(x, y); ctx.lineTo(x + len, y + R.range(-1, 1)); }
      ctx.stroke();
    }
  }, { srgb: false });
}

/** Gentle micro-roughness / orange-peel variation used as roughnessMap for painted shells. */
export function peel({ size = 512, lo = 0.78, hi = 1.0, seed = 7 } = {}) {
  return pixelTex(size, size, (x, y, o) => {
    let n = 0, a = 1, f = 1, tot = 0;
    for (let k = 0; k < 4; k++) {
      const gx = Math.floor(x / (size / (8 * f))), gy = Math.floor(y / (size / (8 * f)));
      n += (hash2(gx % (8 * f), gy % (8 * f), seed + k)) * a;
      tot += a; a *= 0.55; f *= 2;
    }
    const v = lo + (hi - lo) * (n / tot);
    o[0] = o[1] = o[2] = Math.round(v * 255); o[3] = 255;
  }, { srgb: false });
}

/** Hex cell grid (lines on transparent). */
export function hexGrid({ size = 512, cells = 8, line = 1.2, color = 'rgba(255,255,255,0.9)', bg = null } = {}) {
  return canvasTex(size, size, (ctx, w, h) => {
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    const r = w / cells / Math.sqrt(3);
    const dx = r * Math.sqrt(3), dy = r * 1.5;
    ctx.strokeStyle = color; ctx.lineWidth = line;
    for (let row = -1; row <= cells * 1.2; row++) {
      for (let col = -1; col <= cells + 1; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0), cy = row * dy;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.closePath(); ctx.stroke();
      }
    }
  });
}

/** Yellow / black hazard stripes. */
export function hazard({ size = 256, stripes = 4, a = '#f2b300', b = '#0e0e10' } = {}) {
  return canvasTex(size, size, (ctx, w, h) => {
    ctx.fillStyle = a; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = b;
    const p = w / stripes;
    ctx.save();
    ctx.translate(w / 2, h / 2); ctx.rotate(-Math.PI / 4); ctx.translate(-w, -h);
    for (let i = -stripes * 2; i < stripes * 4; i += 2) ctx.fillRect(i * p * 0.5 * Math.SQRT2 + 0, 0, p * 0.5 * Math.SQRT2, h * 2);
    ctx.restore();
  });
}

/** PCB / circuit etching. Returns a texture; `glow` draws cyan traces on near-black (use as emissiveMap). */
export function circuit({ size = 1024, seed = 11, traces = 150, glow = false, bg = '#0a0d11', trace = '#c8a24a', chips = 14 } = {}) {
  const R = rng(seed);
  return canvasTex(size, size, (ctx, w, h) => {
    ctx.fillStyle = glow ? '#000' : bg; ctx.fillRect(0, 0, w, h);
    const col = glow ? '#59e1ff' : trace;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const grid = w / 64;
    for (let i = 0; i < traces; i++) {
      let x = Math.floor(R() * 64) * grid, y = Math.floor(R() * 64) * grid;
      ctx.lineWidth = R.pick([1.2, 1.6, 2.2, 3]);
      ctx.beginPath(); ctx.moveTo(x, y);
      const n = R.int(3, 9);
      let dir = R.int(0, 7);
      for (let k = 0; k < n; k++) {
        const len = R.int(2, 9) * grid;
        dir = (dir + R.pick([-1, 0, 0, 1])) & 7;
        const a = dir * Math.PI / 4;
        x += Math.cos(a) * len; y += Math.sin(a) * len;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, ctx.lineWidth * 1.8, 0, 7); ctx.fill();
    }
    for (let i = 0; i < chips; i++) {
      const cw = R.int(3, 8) * grid, ch = R.int(3, 7) * grid;
      const x = Math.floor(R() * 56) * grid, y = Math.floor(R() * 56) * grid;
      ctx.fillStyle = glow ? 'rgba(0,0,0,1)' : '#15191f'; ctx.fillRect(x, y, cw, ch);
      ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.strokeRect(x, y, cw, ch);
      ctx.fillStyle = col;
      for (let p = 0; p < cw; p += grid * 0.6) { ctx.fillRect(x + p, y - 3, 1.6, 3); ctx.fillRect(x + p, y + ch, 1.6, 3); }
    }
  });
}

/** Text decal on transparent canvas. */
export function textDecal(lines, { w = 512, h = 128, font = FONT, size = 28, weight = 700, color = '#111', align = 'left', spacing = 1.15, track = 0, bg = null, pad = 8 } = {}) {
  return canvasTex(w, h, (ctx) => {
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    ctx.fillStyle = color; ctx.textBaseline = 'top';
    ctx.font = `${weight} ${size}px ${font}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${track}px`;
    ctx.textAlign = align;
    const x = align === 'center' ? w / 2 : align === 'right' ? w - pad : pad;
    (Array.isArray(lines) ? lines : [lines]).forEach((ln, i) => ctx.fillText(ln, x, pad + i * size * spacing));
  }, { repeat: false });
}

/** Stylised top-down bee mark. Draws centred at (cx, cy), `s` = overall height in px. */
export function drawBee(ctx, cx, cy, s, color = '#111') {
  const k = s / 100;
  ctx.save();
  ctx.translate(cx - 50 * k, cy - 50 * k);
  ctx.scale(k, k);
  ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineCap = 'round';
  const ell = (x, y, rx, ry, rot = 0, fill = true) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); fill ? ctx.fill() : ctx.stroke(); };
  ctx.lineWidth = 2.2;
  ell(31, 32, 21, 8.5, -0.62, false); ell(69, 32, 21, 8.5, 0.62, false);
  ell(34, 47, 15, 6, -0.28, false); ell(66, 47, 15, 6, 0.28, false);
  ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(46, 17); ctx.quadraticCurveTo(40, 6, 33, 5); ctx.moveTo(54, 17); ctx.quadraticCurveTo(60, 6, 67, 5); ctx.stroke();
  ell(50, 21, 6.2, 5.6);
  ell(50, 36, 9.5, 8.2);
  const bands = [[44.5, 8.6, 11.4], [53, 7.2, 12.2], [61, 7, 12], [69, 6.4, 10.4], [76.5, 5.5, 7.8]];
  for (const [y, h, rx] of bands) { ctx.beginPath(); ctx.ellipse(50, y, rx, h / 2 + 0.4, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(47.5, 80); ctx.lineTo(50, 92); ctx.lineTo(52.5, 80); ctx.closePath(); ctx.fill();
  ctx.restore();
}

export function beeDecal({ size = 256, color = '#111' } = {}) {
  return canvasTex(size, size, (ctx) => drawBee(ctx, size / 2, size / 2, size * 0.92, color), { repeat: false });
}

/** Height canvas -> tangent-space normal map (Sobel). `height(x,y)` returns 0..1. */
export function heightToNormal(w, h, height, strength = 2) {
  const H = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) H[y * w + x] = height(x, y);
  return pixelTex(w, h, (x, y, o) => {
    const xm = (x + w - 1) % w, xp = (x + 1) % w, ym = (y + h - 1) % h, yp = (y + 1) % h;
    const dx = (H[y * w + xp] - H[y * w + xm]) * strength;
    const dy = (H[yp * w + x] - H[ym * w + x]) * strength;
    const l = Math.hypot(dx, dy, 1);
    o[0] = (-dx / l * 0.5 + 0.5) * 255; o[1] = (dy / l * 0.5 + 0.5) * 255; o[2] = (1 / l * 0.5 + 0.5) * 255; o[3] = 255;
  }, { srgb: false });
}

/** Knurling / fine grid normal map. */
export function knurlNormal({ size = 256, pitch = 16, strength = 2.5 } = {}) {
  return heightToNormal(size, size, (x, y) => {
    const a = Math.abs(Math.sin((x + y) / pitch * Math.PI)), b = Math.abs(Math.sin((x - y) / pitch * Math.PI));
    return a * b;
  }, strength);
}

/** Subtle fine-noise normal map for painted shells (orange peel). */
export function peelNormal({ size = 512, strength = 0.9, seed = 21 } = {}) {
  return heightToNormal(size, size, (x, y) => {
    let n = 0, a = 1, f = 1, tot = 0;
    for (let k = 0; k < 4; k++) {
      const c = 16 * f;
      const gx = Math.floor(x / (size / c)), gy = Math.floor(y / (size / c));
      n += hash2(gx % c, gy % c, seed + k) * a; tot += a; a *= 0.5; f *= 2;
    }
    return n / tot;
  }, strength);
}

/** Screen-space studio backdrop: soft pale gradient with a faint hex field. */
export function backdrop({ w = 1024, h = 1024, hex = true } = {}) {
  return canvasTex(w, h, (ctx) => {
    const g = ctx.createRadialGradient(w * 0.5, h * 0.42, h * 0.05, w * 0.5, h * 0.5, h * 0.78);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f9faf7'); g.addColorStop(1, '#e8ebe5');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (hex) {
      const r = 28, dx = r * Math.sqrt(3), dy = r * 1.5;
      ctx.strokeStyle = 'rgba(120,120,110,0.045)'; ctx.lineWidth = 1;
      for (let row = -1; row < h / dy + 1; row++) for (let col = -1; col < w / dx + 1; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0), cy = row * dy;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.closePath(); ctx.stroke();
      }
    }
  }, { repeat: false, mip: false });
}
