// Lighting: low-res multiplicative lightmap + additive bloom pass.

import { GLOW } from './assets.js';
import { clamp, mixHex, hexToRgb } from './util.js';

const lightCanvas = document.createElement('canvas');
const lctx = lightCanvas.getContext('2d');

export const lighting = {
  scale: 0.3,          // lightmap resolution vs screen (quality-scaled)
  maxLights: 48,
  bloom: true,
};

// ambient cave color by biome tint & darkness amount
function ambientColor(tint, dark) {
  // dark 0..1 -> from near-white (day) to deep tinted dusk
  const [r, g, b] = hexToRgb(tint);
  const base = 1 - dark;
  const R = Math.round(255 * base + r * dark * 0.16);
  const G = Math.round(255 * base + g * dark * 0.13);
  const B = Math.round(255 * base + b * dark * 0.18);
  return `rgb(${R},${G},${B})`;
}

/**
 * Render lights over the scene.
 * cam: {x,y,zoom} in world px; view: {w,h} css px of canvas; lights: world-space.
 */
export function renderLighting(ctx, cam, viewW, viewH, lights, dark, tint, time) {
  const lw = Math.max(2, Math.ceil(viewW * lighting.scale));
  const lh = Math.max(2, Math.ceil(viewH * lighting.scale));
  if (lightCanvas.width !== lw || lightCanvas.height !== lh) {
    lightCanvas.width = lw; lightCanvas.height = lh;
  }
  lctx.globalCompositeOperation = 'source-over';
  lctx.fillStyle = ambientColor(tint, dark);
  lctx.fillRect(0, 0, lw, lh);

  const s = lighting.scale / cam.zoom;     // world px -> lightmap px  (zoom applied)
  const k = lighting.scale * cam.zoom;
  lctx.globalCompositeOperation = 'lighter';
  let count = 0;
  for (const L of lights) {
    if (count++ > lighting.maxLights) break;
    const g = GLOW[L.c] || GLOW.warm;
    const flick = L.flicker ? (1 + Math.sin(time * 9 + L.x * 0.13) * 0.07 * L.flicker + Math.sin(time * 23 + L.y) * 0.05 * L.flicker) : 1;
    const r = L.r * flick * k;
    const x = (L.x - cam.x) * k, y = (L.y - cam.y) * k;
    if (x < -r || y < -r || x > lw + r || y > lh + r) continue;
    lctx.globalAlpha = L.a ?? 1;
    lctx.drawImage(g, x - r, y - r, r * 2, r * 2);
  }
  lctx.globalAlpha = 1;

  // multiply over the scene
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'multiply';
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(lightCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

// soft additive bloom for emissive sources (drawn in world space, pre-restore)
export function renderBloom(ctx, lights, time) {
  if (!lighting.bloom) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  let count = 0;
  for (const L of lights) {
    if (!L.emissive) continue;
    if (count++ > 24) break;
    const g = GLOW[L.c] || GLOW.warm;
    const r = L.r * 0.5 * (1 + (L.flicker ? Math.sin(time * 7 + L.x) * 0.1 : 0));
    ctx.globalAlpha = 0.16;
    ctx.drawImage(g, L.x - r, L.y - r, r * 2, r * 2);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

// god rays near the surface: slanted warm beams, world-space
export function renderGodRays(ctx, cam, viewW, viewH, surfacePxY, time, strength) {
  if (strength <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const x0 = cam.x, x1 = cam.x + viewW / cam.zoom;
  const period = 290;
  for (let gx = Math.floor(x0 / period) * period; gx < x1 + 200; gx += period) {
    const sway = Math.sin(time * 0.13 + gx * 0.01) * 36;
    const topX = gx + sway, topY = surfacePxY - 460;
    const a = 0.05 * strength * (0.75 + 0.25 * Math.sin(time * 0.4 + gx));
    const grad = ctx.createLinearGradient(topX, topY, topX + 130, topY + 860);
    grad.addColorStop(0, `rgba(255,226,160,${a})`);
    grad.addColorStop(1, 'rgba(255,226,160,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(topX + 95, topY);
    ctx.lineTo(topX + 230, topY + 860);
    ctx.lineTo(topX + 30, topY + 860);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// pre-baked vignette
let vig = null;
export function renderVignette(ctx, w, h) {
  if (!vig || vig.width !== Math.ceil(w / 4) || vig.height !== Math.ceil(h / 4)) {
    vig = document.createElement('canvas');
    vig.width = Math.ceil(w / 4); vig.height = Math.ceil(h / 4);
    const v = vig.getContext('2d');
    const g = v.createRadialGradient(vig.width / 2, vig.height / 2, Math.min(vig.width, vig.height) * 0.38,
      vig.width / 2, vig.height / 2, Math.max(vig.width, vig.height) * 0.72);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(10,5,2,.42)');
    v.fillStyle = g; v.fillRect(0, 0, vig.width, vig.height);
  }
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(vig, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}
