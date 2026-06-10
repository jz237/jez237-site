// Asset loader. Loads every sprite listed in assets/manifest.json.
// Painterly upgrade path: drop a PNG with the same filename into assets/ and it is
// used automatically. If a file is missing entirely, a shaded runtime placeholder
// is synthesized so the game never breaks.

import { hexToRgb, mulberry32 } from './util.js';

export const IMG = {};          // name -> drawable (Image or canvas)
export let MANIFEST = null;

function runtimeFallback(entry) {
  // emergency placeholder: shaded noisy rounded form w/ outline (never flat)
  const w = entry ? entry.w : 64, h = entry ? entry.h : 64;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  const rnd = mulberry32(w * 7919 + h);
  const g = x.createRadialGradient(w * .35, h * .3, 2, w * .5, h * .5, Math.max(w, h) * .6);
  g.addColorStop(0, '#9a8a70'); g.addColorStop(.7, '#6b5a42'); g.addColorStop(1, '#3a2f22');
  x.fillStyle = g;
  x.beginPath();
  x.ellipse(w / 2, h / 2, w * .42, h * .42, 0, 0, Math.PI * 2);
  x.fill();
  for (let i = 0; i < 40; i++) {
    x.fillStyle = `rgba(${20 + rnd() * 60},${15 + rnd() * 50},${10 + rnd() * 40},.35)`;
    x.fillRect(w * .15 + rnd() * w * .7, h * .15 + rnd() * h * .7, 2, 2);
  }
  return c;
}

export async function loadAssets(onProgress) {
  const res = await fetch('./assets/manifest.json');
  MANIFEST = await res.json();
  const names = Object.keys(MANIFEST.sprites);
  let done = 0;
  await Promise.all(names.map(name => new Promise(resolve => {
    const e = MANIFEST.sprites[name];
    const img = new Image();
    img.onload = () => { IMG[name] = img; done++; onProgress(done / names.length); resolve(); };
    img.onerror = () => { IMG[name] = runtimeFallback(e); done++; onProgress(done / names.length); resolve(); };
    img.src = './assets/' + e.file;
  })));
  bakeGlows();
  bakeCracks();
  return IMG;
}

// ---- pre-baked radial glow sprites (for lights / bloom) -----------------
export const GLOW = {};
function bakeGlow(name, hex) {
  const s = 256;
  const c = document.createElement('canvas'); c.width = c.height = s;
  const x = c.getContext('2d');
  const [r, g, b] = hexToRgb(hex);
  const grad = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.25, `rgba(${r},${g},${b},.55)`);
  grad.addColorStop(0.6, `rgba(${r},${g},${b},.16)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = grad; x.fillRect(0, 0, s, s);
  GLOW[name] = c;
}
function bakeGlows() {
  bakeGlow('warm', '#ffc070');
  bakeGlow('fire', '#ff9540');
  bakeGlow('violet', '#b07ae0');
  bakeGlow('teal', '#50d8c0');
  bakeGlow('cyan', '#9fe8ff');
  bakeGlow('lime', '#a0e070');
  bakeGlow('red', '#f06070');
  bakeGlow('white', '#fff6dd');
  bakeGlow('gold', '#ffd87f');
  bakeGlow('blue', '#6fa3e8');
  bakeGlow('pink', '#e8a8c8');
}

// ---- damage crack overlays (3 stages) -----------------------------------
export const CRACKS = [];
function bakeCracks() {
  for (let stage = 0; stage < 3; stage++) {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const x = c.getContext('2d');
    const rnd = mulberry32(404 + stage * 31);
    x.strokeStyle = 'rgba(12,8,5,.78)';
    x.lineWidth = 1.4;
    const n = 2 + stage * 2;
    for (let i = 0; i < n; i++) {
      let px = 6 + rnd() * 20, py = 6 + rnd() * 20;
      x.beginPath(); x.moveTo(px, py);
      const segs = 3 + stage * 2;
      for (let s = 0; s < segs; s++) {
        px += (rnd() - .5) * 14; py += (rnd() - .5) * 14;
        x.lineTo(px, py);
      }
      x.stroke();
    }
    x.strokeStyle = 'rgba(255,240,210,.13)';
    x.lineWidth = 0.8;
    x.beginPath(); x.moveTo(8 + rnd() * 8, 26); x.lineTo(20 + rnd() * 6, 12); x.stroke();
    CRACKS.push(c);
  }
}

// ---- tinted horizontal-tiling background layers, baked once per biome ----
const tintCache = new Map();
export function tintedLayer(name, tintHex, strength) {
  const key = name + tintHex;
  if (tintCache.has(key)) return tintCache.get(key);
  const src = IMG[name];
  const c = document.createElement('canvas');
  c.width = src.width; c.height = src.height;
  const x = c.getContext('2d');
  x.drawImage(src, 0, 0);
  x.globalCompositeOperation = 'color';     // recolor to biome hue, keep luminance
  x.globalAlpha = strength;
  x.fillStyle = tintHex;
  x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'destination-in';
  x.globalAlpha = 1;
  x.drawImage(src, 0, 0);          // restore original alpha mask
  tintCache.set(key, c);
  return c;
}
