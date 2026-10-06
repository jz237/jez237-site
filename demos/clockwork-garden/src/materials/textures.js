import * as THREE from 'three';
import { RNG } from '../core/rng.js';

// Procedural canvas textures. Everything is generated at load time from seeds;
// no external image assets are required.

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function toTexture(c, { repeat = 1, srgb = false, wrap = true } = {}) {
  const tex = new THREE.CanvasTexture(c);
  if (wrap) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
  }
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// Tileable value noise sampled on a torus-like grid.
function tileNoise(size, cells, rng) {
  const g = new Float32Array(cells * cells);
  for (let i = 0; i < g.length; i++) g[i] = rng.float();
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cells;
      const fy = (y / size) * cells;
      const ix = Math.floor(fx), iy = Math.floor(fy);
      const tx = fx - ix, ty = fy - iy;
      const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const a = g[(iy % cells) * cells + (ix % cells)];
      const b = g[(iy % cells) * cells + ((ix + 1) % cells)];
      const c = g[((iy + 1) % cells) * cells + (ix % cells)];
      const d = g[((iy + 1) % cells) * cells + ((ix + 1) % cells)];
      out[y * size + x] = (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
    }
  }
  return out;
}

function fbmTile(size, seed, octaves = 5, baseCells = 4) {
  const rng = new RNG(seed);
  const out = new Float32Array(size * size);
  let amp = 0.5, total = 0;
  for (let o = 0; o < octaves; o++) {
    const n = tileNoise(size, baseCells << o, rng);
    for (let i = 0; i < out.length; i++) out[i] += n[i] * amp;
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

// Brushed-metal roughness: fine directional streaks plus soft blotches of
// handling wear. Used as roughnessMap (green channel) for brass and copper.
export function brushedMetalTexture(seed = 11, size = 512) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const blotch = fbmTile(size, seed, 5, 3);
  const rng = new RNG(seed + 7);
  const streak = new Float32Array(size);
  for (let y = 0; y < size; y++) streak[y] = rng.float();
  // smooth the streaks a little so they read as brushing, not noise
  const s2 = new Float32Array(size);
  for (let y = 0; y < size; y++) {
    s2[y] = (streak[y] * 2 + streak[(y + 1) % size] + streak[(y + size - 1) % size]) / 4;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const v = 0.5 + (s2[y] - 0.5) * 0.14 + (blotch[i] - 0.5) * 0.3;
      const g = Math.max(0, Math.min(255, v * 255));
      img.data[i * 4] = g;
      img.data[i * 4 + 1] = g;
      img.data[i * 4 + 2] = g;
      img.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, { repeat: 1 });
}

// Perlage / circular graining used on watch movement plates.
export function perlageTexture(seed = 3, size = 1024) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(0, 0, size, size);
  const rng = new RNG(seed);
  const step = size / 14;
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const cx = col * step + (row % 2) * step * 0.5 + rng.range(-2, 2);
      const cy = row * step * 0.86 + rng.range(-2, 2);
      for (let r = step * 0.75; r > 1; r -= 1.6) {
        const v = 100 + Math.sin(r * 0.9) * 40 + rng.range(-12, 12);
        ctx.strokeStyle = `rgb(${v},${v},${v})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
  return toTexture(c, { repeat: 1 });
}

// Soft tileable noise used for moss, soil, and stone albedo modulation.
export function noiseTexture(seed = 5, size = 512, { cells = 4, octaves = 5, lo = 0, hi = 1, tint = null } = {}) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const n = fbmTile(size, seed, octaves, cells);
  for (let i = 0; i < n.length; i++) {
    const v = lo + (hi - lo) * n[i];
    if (tint) {
      img.data[i * 4] = Math.min(255, tint[0] * v);
      img.data[i * 4 + 1] = Math.min(255, tint[1] * v);
      img.data[i * 4 + 2] = Math.min(255, tint[2] * v);
    } else {
      const g = Math.min(255, v * 255);
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = g;
    }
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, { srgb: !!tint });
}

// Moss / soil bed: dark loam with tufts of deep green moss, fallen brass filings.
export function bedTexture(seed = 21, size = 1024) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const a = fbmTile(size, seed, 6, 4);
  const b = fbmTile(size, seed + 1, 4, 12);
  const rng = new RNG(seed + 2);
  for (let i = 0; i < a.length; i++) {
    const moss = Math.max(0, Math.min(1, (a[i] - 0.42) * 4));
    const grain = b[i];
    const soil = [38 + grain * 22, 30 + grain * 16, 24 + grain * 12];
    const mossC = [34 + grain * 30, 58 + grain * 44, 40 + grain * 26];
    img.data[i * 4] = soil[0] * (1 - moss) + mossC[0] * moss;
    img.data[i * 4 + 1] = soil[1] * (1 - moss) + mossC[1] * moss;
    img.data[i * 4 + 2] = soil[2] * (1 - moss) + mossC[2] * moss;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // brass filings and tiny screws scattered in the soil
  for (let k = 0; k < 900; k++) {
    const x = rng.range(0, size), y = rng.range(0, size);
    const l = rng.range(1, 4);
    const ang = rng.range(0, Math.PI);
    ctx.strokeStyle = `rgba(${170 + rng.range(-30, 40)},${130 + rng.range(-20, 30)},${60 + rng.range(-10, 20)},${rng.range(0.25, 0.7)})`;
    ctx.lineWidth = rng.range(0.6, 1.4);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * l, y + Math.sin(ang) * l);
    ctx.stroke();
  }
  return toTexture(c, { srgb: true });
}

// Stone (planters, path flags, statue base) – limestone with subtle veining.
export function stoneTexture(seed = 31, size = 512) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const a = fbmTile(size, seed, 6, 3);
  const b = fbmTile(size, seed + 9, 5, 8);
  for (let i = 0; i < a.length; i++) {
    const vein = Math.pow(1 - Math.abs(Math.sin(a[i] * 18)), 12) * 0.25;
    const v = 0.62 + (b[i] - 0.5) * 0.25 - vein;
    img.data[i * 4] = 205 * v + 18;
    img.data[i * 4 + 1] = 196 * v + 14;
    img.data[i * 4 + 2] = 178 * v + 10;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, { srgb: true });
}

// Insect wing membrane with venation, drawn as vector strokes in canvas.
// shape: 'fore' | 'hind' | 'dragon'
export function wingTexture({ seed = 1, tint = [255, 236, 200], veinColor = [150, 110, 40], size = 512, cells = 'bee' } = {}) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const rng = new RNG(seed);
  ctx.clearRect(0, 0, size, size);
  // membrane
  const grad = ctx.createLinearGradient(0, 0, size, 0);
  grad.addColorStop(0, `rgba(${tint[0]},${tint[1]},${tint[2]},0.55)`);
  grad.addColorStop(1, `rgba(${tint[0]},${tint[1]},${tint[2]},0.22)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = `rgba(${veinColor[0]},${veinColor[1]},${veinColor[2]},0.95)`;
  ctx.lineCap = 'round';
  // longitudinal veins radiating from the base (left side, middle)
  const veins = cells === 'dragon' ? 9 : 5;
  const ends = [];
  for (let v = 0; v < veins; v++) {
    const k = (v + 0.5) / veins;
    const y1 = size * (0.08 + 0.84 * k);
    ctx.lineWidth = v === 0 ? 6 : rng.range(2, 3.4);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5 + (k - 0.5) * size * 0.15);
    ctx.bezierCurveTo(size * 0.3, size * 0.5 + (k - 0.5) * size * 0.5, size * 0.6, y1, size, y1 + rng.range(-10, 10));
    ctx.stroke();
    ends.push(y1);
  }
  // cross veins forming cells
  const cross = cells === 'dragon' ? 60 : 14;
  for (let k = 0; k < cross; k++) {
    const x = rng.range(size * 0.12, size * 0.95);
    const y0 = rng.range(0.05, 0.95) * size;
    ctx.lineWidth = cells === 'dragon' ? rng.range(0.8, 1.4) : rng.range(1.2, 2.2);
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x + rng.range(-12, 12), y0 + rng.range(size * 0.05, size * 0.14) * rng.sign());
    ctx.stroke();
  }
  if (cells === 'dragon') {
    // pterostigma: the dark cell near the wing tip
    ctx.fillStyle = 'rgba(40,20,10,0.9)';
    ctx.fillRect(size * 0.86, size * 0.04, size * 0.06, size * 0.06);
  }
  const tex = toTexture(c, { srgb: true, wrap: false });
  return tex;
}

// Butterfly wings: enamel cells separated by black filigree veins.
export function butterflyTexture({ species = 'monarch', size = 1024, seed = 4 } = {}) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const rng = new RNG(seed);
  ctx.clearRect(0, 0, size, size);
  const W = size, H = size;
  // Wing occupies the full canvas; UV (0,0)=wing root at body, (1,*) = outer edge.
  // We draw the fore wing in the top half and hind wing in the bottom half.
  const isMonarch = species === 'monarch';
  const base = isMonarch ? '#e2731d' : '#efe3c4';
  const base2 = isMonarch ? '#f39a3a' : '#f8efd8';
  const vein = isMonarch ? '#15100c' : '#2a1d10';
  const gold = '#d9b25f';

  function wingPath(fore) {
    const p = new Path2D();
    if (fore) {
      p.moveTo(0.02 * W, 0.47 * H);
      p.bezierCurveTo(0.2 * W, 0.18 * H, 0.55 * W, 0.02 * H, 0.97 * W, 0.04 * H);
      p.bezierCurveTo(0.99 * W, 0.18 * H, 0.9 * W, 0.34 * H, 0.72 * W, 0.44 * H);
      p.bezierCurveTo(0.5 * W, 0.5 * H, 0.2 * W, 0.5 * H, 0.02 * W, 0.49 * H);
    } else {
      p.moveTo(0.02 * W, 0.53 * H);
      p.bezierCurveTo(0.3 * W, 0.5 * H, 0.66 * W, 0.56 * H, 0.78 * W, 0.68 * H);
      if (isMonarch) {
        p.bezierCurveTo(0.84 * W, 0.8 * H, 0.66 * W, 0.94 * H, 0.42 * W, 0.92 * H);
      } else {
        // swallowtail: elegant trailing tail
        p.bezierCurveTo(0.8 * W, 0.78 * H, 0.72 * W, 0.84 * H, 0.66 * W, 0.86 * H);
        p.bezierCurveTo(0.7 * W, 0.93 * H, 0.74 * W, 0.99 * H, 0.66 * W, 0.995 * H);
        p.bezierCurveTo(0.6 * W, 0.97 * H, 0.58 * W, 0.92 * H, 0.52 * W, 0.9 * H);
      }
      p.bezierCurveTo(0.25 * W, 0.86 * H, 0.08 * W, 0.7 * H, 0.02 * W, 0.55 * H);
    }
    return p;
  }

  for (const fore of [true, false]) {
    const path = wingPath(fore);
    ctx.save();
    ctx.clip(path);
    const g = ctx.createRadialGradient(0, H * 0.5, 0, 0, H * 0.5, W);
    g.addColorStop(0, base);
    g.addColorStop(0.7, base2);
    g.addColorStop(1, base);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // veins: radiating from root
    ctx.strokeStyle = vein;
    ctx.lineCap = 'round';
    const n = fore ? 9 : 8;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1);
      const ang = fore ? -0.95 + k * 0.95 : 0.05 + k * 0.95;
      ctx.lineWidth = W * (isMonarch ? 0.012 : 0.008);
      ctx.beginPath();
      ctx.moveTo(0.02 * W, 0.5 * H);
      const mx = 0.45 * W * Math.cos(ang * 0.8), my = 0.5 * H + 0.45 * H * Math.sin(ang * 0.8);
      const ex = 1.1 * W * Math.cos(ang), ey = 0.5 * H + 1.1 * H * Math.sin(ang);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();
    }
    // discal cell loop
    ctx.lineWidth = W * 0.01;
    ctx.beginPath();
    if (fore) ctx.ellipse(0.32 * W, 0.36 * H, 0.2 * W, 0.06 * H, -0.35, 0, Math.PI * 2);
    else ctx.ellipse(0.3 * W, 0.62 * H, 0.18 * W, 0.07 * H, 0.45, 0, Math.PI * 2);
    ctx.stroke();
    // black margin with ivory/gold dots
    ctx.lineWidth = W * (isMonarch ? 0.09 : 0.05);
    ctx.strokeStyle = isMonarch ? '#120d0a' : '#1d150c';
    ctx.stroke(path);
    if (isMonarch && fore) {
      // dark apex region
      ctx.fillStyle = '#120d0a';
      ctx.beginPath();
      ctx.ellipse(0.9 * W, 0.12 * H, 0.2 * W, 0.12 * H, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!isMonarch) {
      // swallowtail stripes: dark bands crossing the wing
      ctx.fillStyle = 'rgba(30,22,12,0.85)';
      for (let s = 0; s < 4; s++) {
        ctx.save();
        ctx.translate((0.2 + s * 0.17) * W, 0.5 * H);
        ctx.rotate(fore ? -0.7 : 0.5);
        ctx.fillRect(-0.02 * W, -0.6 * H, 0.035 * W, 1.2 * H);
        ctx.restore();
      }
      if (!fore) {
        // blue and amber eyespots near the tail
        ctx.fillStyle = '#2d55b8';
        for (let s = 0; s < 4; s++) {
          ctx.beginPath();
          ctx.arc((0.4 + s * 0.08) * W, (0.86 - s * 0.03) * H, 0.018 * W, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#e9902c';
        ctx.beginPath();
        ctx.arc(0.62 * W, 0.84 * H, 0.025 * W, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // dots along the margin
    ctx.fillStyle = isMonarch ? '#f4ecd8' : gold;
    for (let d = 0; d < 26; d++) {
      const k = d / 26;
      let x, y;
      if (fore) { x = (0.3 + 0.66 * k) * W; y = (0.12 - 0.08 * k + 0.32 * k * k) * H; }
      else { x = (0.2 + 0.55 * k) * W; y = (0.8 + 0.08 * Math.sin(k * 3)) * H; }
      ctx.beginPath();
      ctx.arc(x + rng.range(-3, 3), y + rng.range(-3, 3), W * rng.range(0.004, 0.008), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // gilded outline (filigree edge)
    ctx.strokeStyle = gold;
    ctx.lineWidth = W * 0.006;
    ctx.stroke(path);
  }
  const tex = toTexture(c, { srgb: true, wrap: false });
  return tex;
}

// Etched leaf veins for metal leaves: used as bump + color modulation.
export function leafTexture(seed = 9, size = 512) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const rng = new RNG(seed);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  // midrib along u (x axis), leaf spans y in [0,1]
  ctx.strokeStyle = '#ffffff';
  ctx.lineCap = 'round';
  ctx.lineWidth = size * 0.022;
  ctx.beginPath();
  ctx.moveTo(0, size / 2);
  ctx.lineTo(size, size / 2);
  ctx.stroke();
  for (let i = 0; i < 11; i++) {
    const x = size * (0.06 + i * 0.085);
    for (const s of [-1, 1]) {
      ctx.lineWidth = size * 0.009;
      ctx.beginPath();
      ctx.moveTo(x, size / 2);
      ctx.quadraticCurveTo(x + size * 0.08, size / 2 + s * size * 0.2, x + size * 0.2, size / 2 + s * size * 0.48);
      ctx.stroke();
    }
  }
  // fine secondary netting
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  for (let k = 0; k < 220; k++) {
    const x = rng.range(0, size), y = rng.range(0, size);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + rng.range(-14, 14), y + rng.range(-14, 14));
    ctx.stroke();
  }
  return toTexture(c, { wrap: false });
}

// Ladybird elytra: red enamel with black spots, split down the middle.
export function ladybirdTexture(size = 256) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#b8141c';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#0d0a0a';
  const spots = [[0.3, 0.35, 0.09], [0.7, 0.25, 0.07], [0.55, 0.65, 0.1], [0.2, 0.75, 0.06], [0.85, 0.7, 0.06]];
  for (const [x, y, r] of spots) {
    ctx.beginPath();
    ctx.arc(x * size, y * size, r * size, 0, Math.PI * 2);
    ctx.fill();
  }
  // gilded seam line on the inner edge
  ctx.fillStyle = '#d4a94e';
  ctx.fillRect(0, 0, size * 0.03, size);
  return toTexture(c, { srgb: true, wrap: false });
}

// Porcelain petal set. UV: x = along the petal (0 hinge → 1 tip),
// y = across (0..1). Returns colour map, an ORM map (G roughness, B metalness)
// for the gilded filigree, and an emissive map for light glowing through the
// thin blade.
export function petalTextures({ size = 512, seed = 17, blush = [236, 196, 160] } = {}) {
  const W = size, H = size;
  const rng = new RNG(seed);
  const col = canvas(W, H), orm = canvas(W, H), emi = canvas(W, H);
  const c = col.getContext('2d'), o = orm.getContext('2d'), e = emi.getContext('2d');
  // base colour: warm blush at the hinge → ivory → cool white tip
  const g = c.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, `rgb(${blush[0]},${blush[1]},${blush[2]})`);
  g.addColorStop(0.28, '#f1e3cc');
  g.addColorStop(0.7, '#f6eee0');
  g.addColorStop(1, '#fbf7ef');
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  // faint glaze variation
  for (let i = 0; i < 160; i++) {
    c.fillStyle = `rgba(${rng.range(200, 255)},${rng.range(190, 240)},${rng.range(170, 220)},0.035)`;
    c.beginPath();
    c.ellipse(rng.range(0, W), rng.range(0, H), rng.range(10, 60), rng.range(5, 25), rng.range(0, 3), 0, Math.PI * 2);
    c.fill();
  }
  // ORM: porcelain roughness ~0.35, gilding metallic & smoother
  o.fillStyle = 'rgb(255,90,0)';
  o.fillRect(0, 0, W, H);
  // emissive: brightest along the thin centre of the blade
  const eg = e.createRadialGradient(W * 0.55, H * 0.5, 0, W * 0.55, H * 0.5, W * 0.55);
  eg.addColorStop(0, '#ffffff');
  eg.addColorStop(0.6, '#7a6a5a');
  eg.addColorStop(1, '#000000');
  e.fillStyle = eg;
  e.fillRect(0, 0, W, H);

  // gilded filigree: a central vein with scrolling tendrils near the hinge
  const gold = (ctx, color, metal) => {
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    // central vein
    ctx.lineWidth = W * 0.012;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.bezierCurveTo(W * 0.3, H / 2, W * 0.5, H / 2, W * 0.78, H / 2);
    ctx.stroke();
    // paired tendrils curling outward
    for (let i = 0; i < 5; i++) {
      const x = W * (0.06 + i * 0.1);
      for (const s of [-1, 1]) {
        ctx.lineWidth = W * (0.007 - i * 0.0008);
        ctx.beginPath();
        ctx.moveTo(x, H / 2);
        const cx = x + W * 0.06, cy = H / 2 + s * H * (0.18 + i * 0.02);
        ctx.quadraticCurveTo(cx, cy, x + W * 0.13, H / 2 + s * H * (0.22 + i * 0.03));
        ctx.stroke();
        // curl terminal
        ctx.beginPath();
        ctx.arc(x + W * 0.13, H / 2 + s * H * (0.22 + i * 0.03) - s * H * 0.025, H * 0.025, s > 0 ? Math.PI * 0.5 : -Math.PI * 0.5, s > 0 ? Math.PI * 2.2 : Math.PI * 1.2);
        ctx.stroke();
      }
    }
    // dotted border just inside the edge
    ctx.fillStyle = color;
    // (uv.y spans the petal's full width at every u, so a constant y follows the edge)
    for (let k = 0; k < 70; k++) {
      const u = 0.04 + (k / 70) * 0.9;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(u * W, H / 2 + s * H * 0.4, W * 0.0035, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };
  gold(c, '#c99a45', true);
  gold(o, 'rgb(255,60,255)', true); // gilding: roughness 0.24, metalness 1
  gold(e, '#000000', true); // gold blocks light
  const map = toTexture(col, { srgb: true, wrap: false });
  const ormT = toTexture(orm, { wrap: false });
  const emT = toTexture(emi, { srgb: true, wrap: false });
  return { map, orm: ormT, emissive: emT };
}

// Glowing porcelain for the garden's blooms: a tinted glaze (deepest at the
// hinge, paling to the tip) and a fan of soft veins (the gilding is the
// material's: world/flora.js). The emissive map is the light the bloom gives
// at night, as if lit from its heart: strongest at the hinge, along the veins
// and through the thin middle of the blade.
// (u along the petal from hinge to tip = x, v across it = y, as petalGeometry maps them)
export function bloomPetalTextures({ size = 256, seed = 31, hinge = [240, 170, 150], mid = [248, 214, 200], tip = [252, 238, 228] } = {}) {
  const W = size, H = size;
  const rng = new RNG(seed);
  const col = canvas(W, H), orm = canvas(W, H), emi = canvas(W, H);
  const c = col.getContext('2d'), o = orm.getContext('2d'), e = emi.getContext('2d');
  const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;
  const g = c.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, rgb(hinge));
  g.addColorStop(0.42, rgb(mid));
  g.addColorStop(1, rgb(tip));
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  // a deeper blush toward the edges, faint glaze variation
  const side = c.createLinearGradient(0, 0, 0, H);
  side.addColorStop(0, `rgba(${hinge[0]},${hinge[1]},${hinge[2]},0.35)`);
  side.addColorStop(0.25, 'rgba(0,0,0,0)');
  side.addColorStop(0.75, 'rgba(0,0,0,0)');
  side.addColorStop(1, `rgba(${hinge[0]},${hinge[1]},${hinge[2]},0.35)`);
  c.fillStyle = side;
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) {
    c.fillStyle = `rgba(255,${rng.range(220, 250)},${rng.range(205, 240)},0.05)`;
    c.beginPath();
    c.ellipse(rng.range(0, W), rng.range(0, H), rng.range(8, 40), rng.range(4, 16), rng.range(0, 3), 0, Math.PI * 2);
    c.fill();
  }
  // ORM: glaze (roughness ~0.3, not metal)
  o.fillStyle = 'rgb(255,76,0)';
  o.fillRect(0, 0, W, H);
  // emissive: the heart's light, fading along the blade, a translucent middle
  const eg = e.createLinearGradient(0, 0, W, 0);
  eg.addColorStop(0, '#ffffff');
  eg.addColorStop(0.35, '#b8aca0');
  eg.addColorStop(0.8, '#5a5048');
  eg.addColorStop(1, '#3a332e');
  e.fillStyle = eg;
  e.fillRect(0, 0, W, H);
  const mid2 = e.createLinearGradient(0, 0, 0, H);
  mid2.addColorStop(0, 'rgba(0,0,0,0.55)');
  mid2.addColorStop(0.3, 'rgba(0,0,0,0)');
  mid2.addColorStop(0.7, 'rgba(0,0,0,0)');
  mid2.addColorStop(1, 'rgba(0,0,0,0.55)');
  e.fillStyle = mid2;
  e.fillRect(0, 0, W, H);
  // veins: a fan from the hinge, glowing a little brighter than the blade.
  // Soft and broad, and only in the light (the glaze barely shows them): thin
  // high-contrast lines crawl and shimmer as the petals sway, on a phone most
  for (let k = 0; k < 11; k++) {
    const v = (k + 0.5) / 11;
    const y1 = H * (0.5 + (v - 0.5) * 0.9);
    for (const [ctx, style, wd] of [[e, 'rgba(255,240,222,0.32)', 0.03], [e, 'rgba(255,244,230,0.28)', 0.014], [c, `rgba(${hinge[0] - 25},${hinge[1] - 35},${hinge[2] - 35},0.12)`, 0.022]]) {
      ctx.strokeStyle = style;
      ctx.lineWidth = W * wd;
      ctx.beginPath();
      ctx.moveTo(0, H / 2 + (v - 0.5) * H * 0.12);
      ctx.bezierCurveTo(W * 0.3, H / 2 + (v - 0.5) * H * 0.5, W * 0.6, y1, W * 0.94, y1);
      ctx.stroke();
    }
  }
  // (the gilt rim, tip and claw are drawn by the material itself, anti-aliased
  // and faded where they would be thinner than a few pixels: world/flora.js)
  return { map: toTexture(col, { srgb: true, wrap: false }), orm: toTexture(orm, { wrap: false }), emissive: toTexture(emi, { srgb: true, wrap: false }) };
}

// A hanging banner of the garden: deep teal velvet, a double gilt border, the
// clockwork bee in a geared ring, a swallow-tailed foot (alpha: cut out)
export function bannerTexture({ w = 256, h = 640, field = '#0f3a35', gold = '#d4a24c' } = {}) {
  const cv = canvas(w, h);
  const c = cv.getContext('2d');
  const tail = h * 0.86; // where the swallow tail is cut
  c.clearRect(0, 0, w, h);
  c.beginPath();
  c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(w, h); c.lineTo(w / 2, tail); c.lineTo(0, h); c.closePath();
  c.save();
  c.clip();
  const g = c.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, '#0a2925'); g.addColorStop(0.5, field); g.addColorStop(1, '#0a2925');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  // velvet nap: faint vertical streaks
  const rng = new RNG(7);
  for (let i = 0; i < 220; i++) { c.fillStyle = `rgba(255,255,255,${rng.range(0.01, 0.03)})`; c.fillRect(rng.range(0, w), 0, rng.range(1, 3), h); }
  c.restore();
  c.strokeStyle = gold;
  c.lineJoin = 'round';
  const border = (inset, lw) => {
    c.lineWidth = lw;
    c.beginPath();
    c.moveTo(inset, inset); c.lineTo(w - inset, inset); c.lineTo(w - inset, h - inset * 2.2); c.lineTo(w / 2, tail - inset * 0.9); c.lineTo(inset, h - inset * 2.2); c.closePath();
    c.stroke();
  };
  border(10, 5);
  border(20, 2);
  // the emblem: a geared ring round a clockwork bee
  const cx = w / 2, cy = h * 0.4, R = w * 0.3;
  c.lineWidth = 5;
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
  c.fillStyle = gold;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    c.save(); c.translate(cx + Math.cos(a) * (R + 6), cy + Math.sin(a) * (R + 6)); c.rotate(a);
    c.fillRect(-5, -6, 10, 12); c.restore();
  }
  c.lineWidth = 2;
  c.beginPath(); c.arc(cx, cy, R - 10, 0, Math.PI * 2); c.stroke();
  // wings
  c.globalAlpha = 0.85;
  for (const s of [-1, 1]) {
    c.beginPath();
    c.ellipse(cx + s * 26, cy - 22, 30, 14, s * -0.5, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(cx + s * 22, cy - 2, 20, 9, s * -0.25, 0, Math.PI * 2);
    c.stroke();
  }
  c.globalAlpha = 1;
  // body: head, thorax, a striped abdomen
  c.beginPath(); c.arc(cx, cy - 34, 9, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx, cy - 14, 13, 14, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(cx, cy + 22, 15, 26, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = field;
  for (const y of [12, 24, 36]) c.fillRect(cx - 16, cy + y, 32, 4);
  // antennae
  c.lineWidth = 2.5;
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(cx + s * 4, cy - 41); c.quadraticCurveTo(cx + s * 12, cy - 62, cx + s * 22, cy - 60); c.stroke(); }
  // a small fleuron above and below
  c.fillStyle = gold;
  for (const y of [h * 0.12, h * 0.68]) {
    c.beginPath(); c.moveTo(cx, y - 12); c.lineTo(cx + 9, y); c.lineTo(cx, y + 12); c.lineTo(cx - 9, y); c.closePath(); c.fill();
    for (const dx of [-20, 20]) { c.beginPath(); c.arc(cx + dx, y, 4, 0, Math.PI * 2); c.fill(); }
  }
  return toTexture(cv, { srgb: true, wrap: false });
}

// Radial glow sprite (soft disc) for dust motes, pollen and lamp halos.
export function glowSprite(size = 128) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return toTexture(c, { srgb: false, wrap: false });
}

// Enamelled metal leaf for close viewing (interactive modes): a grey-toned
// enamel field (tinted per instance) that darkens toward the margin and
// lifts along the midrib, gilt midrib, side veins and a fine gilt edge.
// u (canvas x) runs base → tip, v (canvas y) across the blade.
// Returns { map (sRGB), orm (G roughness, B metalness / gilt mask) }.
export function enamelLeafTextures(size = 512, seed = 77) {
  const W = size, H = size;
  const col = canvas(W, H), orm = canvas(W, H);
  const c = col.getContext('2d'), o = orm.getContext('2d');
  const rng = new RNG(seed);
  const n = fbmTile(W, seed + 1, 5, 4);
  const img = c.createImageData(W, H);
  const om = o.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const v = (y / (H - 1)) * 2 - 1; // across, -1 … 1
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      const k = (y * W + x) * 4;
      const edge = Math.abs(v);
      const mott = n[y * W + x];
      // lighter along the midrib and the blade's middle, darker at the margin and tip
      let L = 0.72 + 0.22 * (1 - edge) - 0.18 * Math.pow(edge, 3) - 0.1 * u * u + (mott - 0.5) * 0.18;
      L = Math.max(0.25, Math.min(1, L));
      img.data[k] = 255 * L * 0.98; img.data[k + 1] = 255 * L; img.data[k + 2] = 255 * L * 0.94; img.data[k + 3] = 255;
      om.data[k] = 255; om.data[k + 1] = 255 * (0.3 + mott * 0.15); om.data[k + 2] = 255 * 0.12; om.data[k + 3] = 255;
    }
  }
  c.putImageData(img, 0, 0);
  o.putImageData(om, 0, 0);
  // gilt veins and margin
  const gild = (ctx, color) => {
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineWidth = H * 0.016;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W * 0.97, H / 2); ctx.stroke();
    for (let i = 0; i < 9; i++) {
      const x = W * (0.07 + i * 0.1);
      for (const s of [-1, 1]) {
        ctx.lineWidth = H * (0.0065 - i * 0.0004);
        ctx.beginPath();
        ctx.moveTo(x, H / 2);
        ctx.quadraticCurveTo(x + W * 0.07, H / 2 + s * H * 0.22, x + W * 0.17, H / 2 + s * H * 0.44);
        ctx.stroke();
      }
    }
    ctx.lineWidth = H * 0.009;
    ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(W, 2); ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2); ctx.stroke();
  };
  gild(c, '#d8ad5a');
  gild(o, 'rgb(255,90,255)');
  // a little wear on the enamel
  for (let i = 0; i < 160; i++) {
    c.fillStyle = `rgba(255,255,255,${rng.range(0.02, 0.06)})`;
    c.beginPath(); c.ellipse(rng.range(0, W), rng.range(0, H), rng.range(3, 14), rng.range(1, 4), rng.range(0, 3), 0, Math.PI * 2); c.fill();
  }
  const map = toTexture(col, { srgb: true, wrap: false });
  const ormT = toTexture(orm, { wrap: false });
  return { map, orm: ormT };
}
