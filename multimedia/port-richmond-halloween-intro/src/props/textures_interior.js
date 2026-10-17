// Textures for the 3609 front room and its door (INTERIOR graphics pass). The big ones are baked offline by
// tools/interior/bake_textures.py into assets/props/room3609/*.webp (deterministic, procedural); their downloads
// start when this module is imported (at boot, in parallel with the world) and the room's builder awaits them.
// Small canvas helpers (copied from textures.js, which belongs to the street helper) cover the cheap ones.
import * as THREE from 'three';
import { rng, clamp } from './util.js';

// ---------------------------------------------------------------------------------------------- baked files
const BASE = new URL('../../assets/props/room3609/', import.meta.url).href;
export const ROOM_FILES = {
  wallpaper: 'wallpaper.webp',      // 1024^2 tile = 0.53 m (one roll width), vintage rose stripe, half-drop
  lampshade: 'lampshade.webp',      // linen drum shade, u around, v up (seam at u = 0, binding at the rims)
  lampshadeGlow: 'lampshade_glow.webp', // the same shade lit from inside (transmission profile peaks at the bulb)
  photos: 'photos.webp',            // 4x2 atlas of 256x320 prints (see PHOTO_CELLS)
  afghan: 'afghan.webp',            // 512^2 RGBA granny-square afghan (alpha = yarn), tile 0.6 m
  doily: 'doily.webp',              // 256^2 RGBA crocheted doily (alpha = thread)
  clutter: 'clutter.webp',          // 512^2 paper-prop atlas (see CLUTTER_UV)
  trim: 'trim_paint.webp',          // 512^2 old yellowed semi-gloss trim paint with chips, tile 0.5 m
  tread: 'stair_tread.webp',        // 1024x288 one stair tread (0.92 x 0.26 m), finish worn through mid-front
  door: 'door_paint.webp',          // 512x1024 the whole door leaf (u = x / 0.908, v = y / 2.021)
  glass: 'glass_grime.webp',        // 256^2 grey grime alpha for old window glass
  plaster: 'plaster.webp',          // 512^2 ceiling plaster tile (1.2 m) with hairline cracks
  sofa: 'sofa_fabric.webp',         // 512^2 1970s tapestry upholstery tile (0.33 m)
  chair: 'chair_fabric.webp',       // 512^2 worn crushed velour tile (0.4 m)
  rug: 'rug.webp',                  // 768x960 worn oriental rug (the whole 1.8 x 2.2 m rug)
  floor: 'floor.webp',              // 1024^2 worn oak strip floor, tile 1 m (boards along v)
};
// regions of the clutter atlas in UV (u0, v0, u1, v1), v up (three's flipY convention)
const px = (x0, y0, x1, y1) => [x0 / 512, 1 - y1 / 512, x1 / 512, 1 - y0 / 512];
export const CLUTTER_UV = {
  envelopeA: px(0, 0, 256, 160), envelopeB: px(256, 0, 512, 160), magazine: px(0, 160, 256, 416),
  holyCard: px(256, 160, 384, 352), pillLabel: px(384, 160, 512, 352), calendar: px(256, 352, 512, 512), remote: px(0, 416, 256, 512),
};
export const PHOTO_CELLS = { wedding: 0, school: 1, shore: 2, family: 3, sacredHeart: 4, navy: 5, holyCard: 6, polaroid: 7 };

const images = {};
function loadImage(url) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') { resolve(null); return; }
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => { console.warn('[room3609] texture missing', url); resolve(null); };
    im.src = url;
  });
}
export function preloadRoomImages() {
  for (const [k, f] of Object.entries(ROOM_FILES)) if (!images[k]) images[k] = loadImage(BASE + f);
  return images;
}
preloadRoomImages();

// A THREE.Texture for a baked image (null if the file is missing: callers fall back to a flat colour).
const texCache = new Map();
export async function roomTexture(name, { srgb = true, repeat = null, aniso = 8, wrap = true } = {}) {
  const key = name + (srgb ? ':s' : ':l');
  if (!texCache.has(key)) {
    texCache.set(key, (async () => {
      const im = await (images[name] || (images[name] = loadImage(BASE + (ROOM_FILES[name] || name))));
      if (!im) return null;
      const t = new THREE.Texture(im);
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = aniso;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.name = 'room3609_' + name;
      t.needsUpdate = true;
      return t;
    })());
  }
  const base = await texCache.get(key);
  if (!base) return null;
  if (!repeat) return base;
  const t = base.clone();               // shares the uploaded image (Source)
  t.repeat.set(repeat[0], repeat[1]);
  t.needsUpdate = true;
  return t;
}
// all baked textures at once (missing ones are null)
export async function roomTextures() {
  const out = {};
  await Promise.all(Object.keys(ROOM_FILES).map(async (k) => { out[k] = await roomTexture(k); }));
  return out;
}

// ---------------------------------------------------------------------------------------------- canvas helpers
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

// soft radial glow (additive cards: bulb glow at the shade openings, light pools on the ceiling / table)
export function glowTexture(key = 'room3609_glow', { inner = 0.0, falloff = 2.2 } = {}) {
  return canvasTexture(key, 128, 128, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const r = Math.hypot((x + 0.5) / w * 2 - 1, (y + 0.5) / h * 2 - 1);
      const v = r < inner ? 1 : Math.pow(clamp(1 - (r - inner) / (1 - inner), 0, 1), falloff);
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(255 * v); img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }, { wrap: false, srgb: false });
}

// flat sRGB colour texture (fallback when a baked file is missing)
export function flatTexture(hex) {
  return canvasTexture('room3609_flat_' + hex, 4, 4, (g, w, h) => { g.fillStyle = hex; g.fillRect(0, 0, w, h); });
}

// a quick seeded scribble texture for paper props (envelopes, labels) when the clutter atlas is missing
export function paperTexture(seed = 1) {
  return canvasTexture('room3609_paper' + seed, 64, 64, (g, w, h) => {
    const R = rng(seed);
    g.fillStyle = '#e8e2d2'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(60,60,80,0.5)';
    for (let i = 0; i < 6; i++) g.fillRect(8 + R() * 8, 10 + i * 7, 20 + R() * 24, 1.5);
  }, { wrap: false });
}

// ---------------------------------------------------------------------------------------------- generators copied
// verbatim from textures.js (the street helper's file) so furniture.js no longer depends on it; same output.
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

