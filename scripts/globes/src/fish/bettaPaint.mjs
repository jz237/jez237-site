// A variety's colour maps (varieties.mjs), painted where the betta's photographs lie (Betta.ts look):
// the profile photograph's map (the atlas's tile 5: the body, and every fin but the caudal, which take
// their colours from that photograph) and the fin photograph's (tile 4: the caudal's). The shader
// (bettaWGSL.ts) swaps the photographs' colours for the map's, keeping their luminance:
//
//   albedo = map x luminance x gain
//
// So that the light and shade kept are the photographs' fine ones (scales, rays, folds) and not their
// broad ones (the scale macro is bright along the back and dark at the belly, the head darker than the
// flank: a blue fish's), each map is painted divided by the photographs' local brightness, measured
// once as they load (measure: their luminance blurred over ~30 px, the body's as betta_shade composes
// it from the photographs). Painted on small grids, cell by cell, then drawn up to the tiles' size.
// (No DOM: the tests run it in Node.)
import { section } from '../../../betta-atelier/src/fish.js';
import { linearOf } from './varieties.mjs';

/** The maps' grids: the profile photograph's (1536 x 1024 px) in cells of 8 px; the fin
 *  photograph's (1225 x 1284) in 128 x 128. */
export const PROFILE = { w: 192, h: 128, width: 1536, height: 1024 };
export const CAUDAL = { w: 128, h: 128, width: 1225, height: 1284 };
/** The macros' grids as measure takes them (each tile drawn down to this size). */
export const MACRO = 64;

/** How much of the photographs' broad brightness each map takes out (0: none, 1: all of it; the
 *  body's almost all: what is left of its bright back reads as the light from above; the fins' less:
 *  their pale fringes stay a little paler), and how far it may go either way. */
const FLATTEN = { body: 0.85, fins: 0.6 };
const RANGE = 4;

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Where each cell of the profile's grid lies on the fish: on its body (inside the outline the
 *  Atelier's sections give: how far down the flank, q, 0 at the back and 1 at the belly; how much is
 *  head, to the gill covers' edge), or off it, where only a fin's photograph is (above it the dorsal,
 *  below it the anal and in front of that the ventrals, the fin's v a guess at how far out from the
 *  body, 0..1). In front of the snout, the head. Worked out once. */
export function profileCells() {
  const { w, h, width, height } = PROFILE;
  const kind = new Uint8Array(w * h), q = new Float32Array(w * h), head = new Float32Array(w * h), out = new Float32Array(w * h);
  const s = [0, 0, 0, 0];
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const k = j * w + i;
      const x = ((i + 0.5) * width) / w, y = ((j + 0.5) * height) / h;
      const [, top, bottom] = section(Math.min(Math.max(x, 155), 1010), s);
      // (The gill covers' edge, as the Atelier's opercula are built: 330 px, bulging to 406 halfway down.)
      const gill = 330 + 76 * Math.sin(Math.PI * Math.min(Math.max((y - 332) / 170, 0), 1));
      head[k] = 1 - smooth(gill - 30, gill + 8, x);
      if (x < 155) kind[k] = 4;
      else if (y >= top && y <= bottom && x <= 1010) {
        kind[k] = 0;
        q[k] = (y - top) / (bottom - top);
      } else if (y < top) {
        kind[k] = 1;
        out[k] = Math.min((top - y) / 230, 1);
      } else {
        kind[k] = x < 440 ? 3 : 2;
        out[k] = Math.min((y - (x < 440 ? 530 : bottom)) / (x < 440 ? 390 : 420), 1);
      }
    }
  }
  return { kind, q, head, out };
}

/** How far out each cell of the caudal's grid is, root (0) to fringe (about 1): the half-moon's rays
 *  fan from its root at (505, 512) px in the fin photograph to an edge about 620 px out. */
export function caudalCells() {
  const { w, h, width, height } = CAUDAL;
  const out = new Float32Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) out[j * w + i] = Math.min(Math.hypot(((i + 0.5) * width) / w - 505, ((j + 0.5) * height) / h - 512) / 620, 1.2);
  }
  return out;
}

/** An image's luminance (linear light), texel by texel: its RGBA bytes (sRGB). */
export function luminanceOf(rgba) {
  const lum = new Float32Array(rgba.length / 4);
  const lin = (c) => {
    const s = c / 255;
    return s > 0.04045 ? ((s + 0.055) / 1.055) ** 2.4 : s / 12.92;
  };
  const table = Float32Array.from({ length: 256 }, (_, c) => lin(c));
  for (let k = 0; k < lum.length; k++) lum[k] = 0.2126 * table[rgba[4 * k]] + 0.7152 * table[rgba[4 * k + 1]] + 0.0722 * table[rgba[4 * k + 2]];
  return lum;
}

/** A grid's value at (u, v) in 0..1 across it (v down), bilinearly, as a texture is read. */
function at(grid, n, u, v) {
  const x = Math.min(Math.max(u * n - 0.5, 0), n - 1), y = Math.min(Math.max(v * n - 0.5, 0), n - 1);
  const x0 = Math.min(Math.floor(x), n - 2), y0 = Math.min(Math.floor(y), n - 2), fx = x - x0, fy = y - y0;
  const k = y0 * n + x0;
  return (grid[k] * (1 - fx) + grid[k + 1] * fx) * (1 - fy) + (grid[k + n] * (1 - fx) + grid[k + n + 1] * fx) * fy;
}

/** A grid blurred where `weight` says it has something (normalised: what has nothing round it lends
 *  none), by three box passes of `r` cells each way (about a Gaussian), each a running sum. */
function blurWhere(values, weight, w, h, r) {
  const a = new Float32Array(values.length), b = Float32Array.from(weight);
  for (let k = 0; k < a.length; k++) a[k] = values[k] * weight[k];
  const line = new Float32Array(Math.max(w, h));
  const pass = (src, horizontal) => {
    const n = horizontal ? w : h, lines = horizontal ? h : w, step = horizontal ? 1 : w;
    for (let l = 0; l < lines; l++) {
      const first = horizontal ? l * w : l;
      for (let i = 0; i < n; i++) line[i] = src[first + i * step];
      // (The window's sum, its ends held at the edge's value.)
      let sum = 0;
      for (let d = -r; d <= r; d++) sum += line[Math.min(Math.max(d, 0), n - 1)];
      for (let i = 0; i < n; i++) {
        src[first + i * step] = sum / (2 * r + 1);
        sum += line[Math.min(i + r + 1, n - 1)] - line[Math.max(i - r, 0)];
      }
    }
  };
  for (let p = 0; p < 3; p++) {
    for (const g of [a, b]) {
      pass(g, true);
      pass(g, false);
    }
  }
  for (let k = 0; k < a.length; k++) a[k] = b[k] > 1e-4 ? a[k] / b[k] : 0;
  return a;
}

/** The photographs' brightness, measured once as they load: each map's division (comp, 0..1: what a
 *  cell's colour is multiplied by before it is painted), the shader's gain (comp's largest: the map
 *  times the luminance times the gain is the colour painted, on average where the photographs are
 *  as bright as round about), and the mean luminance of what the body shows and of the fins.
 *  luminance: the atlas's tiles at the grids' sizes (luminanceOf): profile (PROFILE's), head and
 *  scales (MACRO square), caudal (CAUDAL's). cells: profileCells(). */
export function measure(luminance, cells) {
  const { w, h, width, height } = PROFILE;
  const n = w * h, nc = CAUDAL.w * CAUDAL.h;
  // The body's luminance as betta_shade composes it: the head macro over the head, the scale macro
  // tiled along the flank (every 400 px), over the profile photograph. Off the body, only where there
  // is fin (the photographs' backgrounds are near black), the fins' own.
  const shown = Float32Array.from(luminance.profile);
  const onBody = new Float32Array(n), onFin = new Float32Array(n), caudalFin = new Float32Array(nc);
  const fin = (l) => smooth(0.006, 0.016, l);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const k = j * w + i;
      if (cells.kind[k] !== 0) {
        onFin[k] = fin(shown[k]);
        continue;
      }
      const x = ((i + 0.5) * width) / w, y = ((j + 0.5) * height) / h;
      const hx = (x - 145) / 290 + 0.017, hy = (y - 300) / 250 + 0.034;
      const hm = smooth(0, 0.13, hx) * smooth(0, 0.13, 1 - hy) * (1 - smooth(0.87, 1, hx)) * (1 - smooth(0.87, 1, 1 - hy));
      let l = shown[k] + (at(luminance.head, MACRO, hx, hy) - shown[k]) * hm * 0.97;
      const sx = (x - 430) / 400;
      l += (at(luminance.scales, MACRO, sx - Math.floor(sx), (y - 278) / 250) - l) * smooth(400, 465, x) * 0.98;
      shown[k] = l;
      onBody[k] = 1;
    }
  }
  for (let k = 0; k < nc; k++) caudalFin[k] = fin(luminance.caudal[k]);
  // Their means: the body's, and the fins' (the caudal's and the others' together).
  let bodySum = 0, bodyN = 0, finSum = 0, finN = 0;
  for (let k = 0; k < n; k++) {
    bodySum += shown[k] * onBody[k];
    bodyN += onBody[k];
    finSum += shown[k] * onFin[k];
    finN += onFin[k];
  }
  for (let k = 0; k < nc; k++) {
    finSum += luminance.caudal[k] * caudalFin[k];
    finN += caudalFin[k];
  }
  const body = bodySum / bodyN, fins = finSum / finN;
  // Each cell's division: its region's mean over the brightness round it, to FLATTEN's power, over the
  // mean; then all of them over the largest (the gain).
  const bodyNear = blurWhere(shown, onBody, w, h, 3);
  const finNear = blurWhere(shown, onFin, w, h, 3);
  const caudalNear = blurWhere(luminance.caudal, caudalFin, CAUDAL.w, CAUDAL.h, 3);
  const division = (mean, near, flatten) => Math.min(Math.max(mean / Math.max(near, 1e-4), 1 / RANGE), RANGE) ** flatten / mean;
  const profile = new Float32Array(n), caudal = new Float32Array(nc);
  let gain = 0;
  for (let k = 0; k < n; k++) {
    profile[k] = onBody[k] ? division(body, bodyNear[k], FLATTEN.body) : division(fins, finNear[k] || fins, FLATTEN.fins);
    gain = Math.max(gain, profile[k]);
  }
  for (let k = 0; k < nc; k++) {
    caudal[k] = division(fins, caudalNear[k] || fins, FLATTEN.fins);
    gain = Math.max(gain, caudal[k]);
  }
  for (let k = 0; k < n; k++) profile[k] /= gain;
  for (let k = 0; k < nc; k++) caudal[k] /= gain;
  // (Where there is fish, a couple of cells wide of it.)
  const fish = { profile: new Uint8Array(n), caudal: new Uint8Array(nc) };
  for (let k = 0; k < n; k++) fish.profile[k] = onBody[k] || onFin[k] > 0.05 ? 1 : 0;
  for (let k = 0; k < nc; k++) fish.caudal[k] = caudalFin[k] > 0.05 ? 1 : 0;
  grow(fish.profile, w, h);
  grow(fish.caudal, CAUDAL.w, CAUDAL.h);
  return { profile, caudal, gain, body, fins, fish };
}

/** A mask grown by two cells each way, in place (along its rows, then its columns). */
function grow(mask, w, h) {
  const line = new Uint8Array(Math.max(w, h));
  for (const [n, lines, step, across] of [[w, h, 1, w], [h, w, w, 1]]) {
    for (let l = 0; l < lines; l++) {
      const first = l * across;
      for (let i = 0; i < n; i++) line[i] = mask[first + i * step];
      for (let i = 0; i < n; i++) mask[first + i * step] = line[Math.max(i - 2, 0)] | line[Math.max(i - 1, 0)] | line[i] | line[Math.min(i + 1, n - 1)] | line[Math.min(i + 2, n - 1)];
    }
  }
}

/** A lattice point's value (0..1), by hash. */
function hash(a, b, seed) {
  let n = Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(seed, 982451653);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Value noise (0..1) at (x, y), cells 1 apart, smoothly interpolated; seed picks the lattice. */
function noise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed), c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/** Where a marble's patches are drawn from, at (x, y) px: the place warped (by ~0.4 of WARP) so
 *  that they wander and pinch as a marble's do, into out. */
const WARP = 200;
function warped(x, y, seed, out) {
  const u = x / WARP, v = y / WARP;
  out[0] = x + 0.8 * WARP * (noise(u * 0.7, v * 0.7, seed + 11) - 0.5);
  out[1] = y + 0.8 * WARP * (noise(u * 0.7 + 5.3, v * 0.7, seed + 12) - 0.5);
  return out;
}

/** A marble's patchiness at a warped place (x, y) px: noise over four octaves, the finest giving the
 *  patches' edges a ragged, scale-sized fringe; about 0.5 on average. */
function patchiness(x, y, size, seed) {
  const u = x / size, v = y / size;
  return 0.58 * noise(u, v, seed) + 0.26 * noise(u * 2.1, v * 2.1, seed + 1) + 0.1 * noise(u * 4.3, v * 4.3, seed + 2) + 0.06 * noise(u * 9.1, v * 9.1, seed + 3);
}

/** Where patchiness of a size leaves `cover` of a fish above it (its quantile over a sample, worked
 *  out once for each: prepare). */
const thresholds = new Map();
function threshold(size, seed, cover) {
  const key = `${size} ${seed} ${cover}`;
  if (!thresholds.has(key)) {
    const samples = [], at = [0, 0];
    for (let j = 0; j < 32; j++) for (let i = 0; i < 48; i++) samples.push(patchiness(...warped(i * 32, j * 32, seed, at), size, seed));
    samples.sort((a, b) => a - b);
    thresholds.set(key, samples[Math.min(Math.floor((1 - cover) * samples.length), samples.length - 1)]);
  }
  return thresholds.get(key);
}

/** The varieties' patches' thresholds worked out now (as the photographs load), not as one is first
 *  shown. */
export function prepare(varieties) {
  for (const v of varieties) for (const p of patchesOf(v)) void p;
}

/** A variety's patches: each colour (linear), size, seed and threshold. */
function patchesOf(variety) {
  return (variety.patches?.colours ?? []).map(([colour, cover, size], n) => {
    const seed = variety.patches.seed * 31 + n * 7;
    return { colour: linearOf(colour), size, seed, from: threshold(size, seed, cover) };
  });
}

/** Linear light to sRGB bytes, by table. */
const ENCODE = Uint8ClampedArray.from({ length: 4096 }, (_, k) => {
  const c = k / 4095;
  return Math.round(255 * (c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c));
});
const encode = (c) => ENCODE[Math.min(Math.max((c * 4095 + 0.5) | 0, 0), 4095)];

/** A variety's two maps (varieties.mjs: not Classic's, which has none), as RGBA bytes on the grids:
 *  profile (PROFILE's) and caudal (CAUDAL's), painted a row at a time: it yields after each, and
 *  returns them. field: measure()'s, with profileCells() as cells and caudalCells() as caudalOut.
 *  (A cell at a time, without a garbage object. A phone at a quarter of this PC's speed takes 10 to 40
 *  ms for one, a marble's the longest: Betta.ts paints a few ms a frame.) */
export function* painting(variety, field) {
  const out = { profile: new Uint8ClampedArray(PROFILE.w * PROFILE.h * 4), caudal: new Uint8ClampedArray(CAUDAL.w * CAUDAL.h * 4) };
  const [back, side, belly, head, root, edge] = [variety.body.back, variety.body.side, variety.body.belly, variety.body.head, variety.fins.root, variety.fins.edge].map(linearOf);
  const patches = patchesOf(variety);
  // (Its light and shade kept as a power of the photographs' luminance, varieties.mjs detail: the
  // division to that power, so that on average the colour is still the one painted.)
  const detail = variety.detail ?? 1;
  const c = [0, 0, 0], at = [0, 0];
  const put = (bytes, k, division, fish, x, y) => {
    // (Patches only where there is fish: off it a cell is read only at the fish's edge, blended.)
    if (fish && patches.length) {
      warped(x, y, patches[0].seed, at);
      for (const p of patches) {
        const t = smooth(p.from - 0.018, p.from + 0.018, patchiness(at[0], at[1], p.size, p.seed));
        for (let n = 0; n < 3; n++) c[n] += (p.colour[n] - c[n]) * t;
      }
    }
    const comp = detail === 1 ? division : division ** detail;
    bytes[4 * k] = encode(c[0] * comp);
    bytes[4 * k + 1] = encode(c[1] * comp);
    bytes[4 * k + 2] = encode(c[2] * comp);
    bytes[4 * k + 3] = 255;
  };
  const { kind, q, head: headShare, out: v } = field.cells;
  for (let j = 0; j < PROFILE.h; j++) {
    for (let i = 0; i < PROFILE.w; i++) {
      const k = j * PROFILE.w + i;
      if (kind[k] === 0) {
        // Counter-shaded: a darker back, a paler belly; the head its own.
        const a = smooth(0, 0.5, q[k]), b = smooth(0.55, 1, q[k]), h = headShare[k];
        for (let n = 0; n < 3; n++) c[n] = (back[n] + (side[n] - back[n]) * a) * (1 - b) * (1 - h) + belly[n] * b * (1 - h) + head[n] * h;
      } else if (kind[k] === 4) c.splice(0, 3, ...head);
      else {
        const a = smooth(0.1, 0.9, v[k]);
        for (let n = 0; n < 3; n++) c[n] = root[n] + (edge[n] - root[n]) * a;
      }
      put(out.profile, k, field.profile[k], field.fish.profile[k], ((i + 0.5) * PROFILE.width) / PROFILE.w, ((j + 0.5) * PROFILE.height) / PROFILE.h);
    }
    yield;
  }
  for (let j = 0; j < CAUDAL.h; j++) {
    for (let i = 0; i < CAUDAL.w; i++) {
      const k = j * CAUDAL.w + i;
      const a = smooth(0.1, 0.9, field.caudalOut[k]);
      for (let n = 0; n < 3; n++) c[n] = root[n] + (edge[n] - root[n]) * a;
      // (Its patches in a place of their own, not the profile's.)
      put(out.caudal, k, field.caudal[k], field.fish.caudal[k], ((i + 0.5) * CAUDAL.width) / CAUDAL.w + 2000, ((j + 0.5) * CAUDAL.height) / CAUDAL.h);
    }
    yield;
  }
  return out;
}
