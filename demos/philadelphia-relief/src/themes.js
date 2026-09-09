/**
 * Theme palettes.
 *
 * A theme is a complete authored look, not a colour swap: the hypsometric
 * ramp, the light, the air and the ink all move together. `ramp` stops are
 * [t, '#rrggbb'] with t normalised over the region's elevation range, so the
 * same stops read correctly whatever the DEM min/max turn out to be.
 *
 * `structure` colours the buildings and bridges layer: walls, roofs, the night
 * glow of lit upper floors, and cable ink.
 *
 * `skyFill` is the cool ambient the shader lights shadows with; `skyHorizon`
 * is the warm band the sky and the fog share. Keeping them separate is what
 * gives the golden-hour themes blue shadows instead of one flat hue.
 *
 * Pure data. `sampleRamp` bakes the 1D LUT texture and is exercised directly
 * by the tests.
 */

export const THEMES = {
  dusk: {
    label: 'Dusk',
    note: 'Warm low sun, heavy air. The default cinematic look.',
    ramp: [
      [0.00, '#344b55'], [0.03, '#49616a'], [0.08, '#607975'],
      [0.18, '#718779'], [0.34, '#879985'], [0.55, '#a2ab94'],
      [0.78, '#bdbea9'], [1.00, '#ded9c8'],
    ],
    skyTop: '#416681', skyFill: '#b6c9dc', skyHorizon: '#b4c5cf', sunColor: '#fff0db',
    fog: '#a6bac6', fogTint: '#e5d4b7',
    water: '#1b3a54', waterShallow: '#4a7d9c', waterSpec: '#ffe0b0',
    contour: '#1a120a', contourIndex: '#0d0906',
    road: ['#ffd9a8', '#f0bd85', '#c99a68'],
    rail: '#e8ddd0', boundary: '#f2e2c8', park: '#3f5a3a',
    structure: { wall: '#a4adb0', roof: '#707d83', glow: '#ffb964', glowAmount: 0, cable: '#f0e6d8' },
    ink: '#fdf3e3', inkMuted: '#c8b49a', halo: '#120c07',
    ui: { bg: '#0d1820', panel: '#142630', accent: '#e8bb78', text: '#f2f5f5' },
  },
  slate: {
    label: 'Slate',
    note: 'Cool, desaturated, editorial. The most legible for reading terrain.',
    ramp: [
      [0.00, '#1a2129'], [0.03, '#243039'], [0.08, '#33414b'],
      [0.18, '#4a5661'], [0.34, '#646f78'], [0.55, '#818a91'],
      [0.78, '#a4abb0'], [1.00, '#d6dade'],
    ],
    skyTop: '#0d141c', skyFill: '#7d93ab', skyHorizon: '#7e93a6', sunColor: '#dfe9f2',
    fog: '#8496a6', fogTint: '#b9c8d5',
    water: '#1d3444', waterShallow: '#537b96', waterSpec: '#cfe2f2',
    contour: '#0e1418', contourIndex: '#060a0d',
    road: ['#ffffff', '#dfe6ec', '#aab4bd'],
    rail: '#c6d0d8', boundary: '#dde5eb', park: '#3c4f45',
    structure: { wall: '#b4bcc4', roof: '#7c868f', glow: '#cfe2f2', glowAmount: 0, cable: '#e6edf2' },
    ink: '#f2f6f9', inkMuted: '#a9b6c0', halo: '#0a0f14',
    ui: { bg: '#0e1319', panel: '#1a222b', accent: '#7fb2d8', text: '#eaf1f7' },
  },
  verdant: {
    label: 'Verdant',
    note: 'Classic topographic sheet — greens, tans and strong contours.',
    ramp: [
      [0.00, '#22402f'], [0.03, '#2e5138'], [0.08, '#3e6440'],
      [0.18, '#5c7a46'], [0.34, '#849154'], [0.55, '#a89e66'],
      [0.78, '#c9b183'], [1.00, '#eddfbc'],
    ],
    skyTop: '#16304a', skyFill: '#8fb0c4', skyHorizon: '#bcd0d6', sunColor: '#fff4d8',
    fog: '#b3c2bd', fogTint: '#d9e3d6',
    water: '#1f4d68', waterShallow: '#4e8aab', waterSpec: '#dff0ff',
    contour: '#4a3a22', contourIndex: '#2e2313',
    road: ['#fff6e2', '#f2ddb8', '#cdb389'],
    rail: '#5a4b3a', boundary: '#8f6f9c', park: '#2f5c34',
    structure: { wall: '#cdbfab', roof: '#93867a', glow: '#fff4d8', glowAmount: 0, cable: '#f4efe4' },
    ink: '#f8f5e8', inkMuted: '#bfc4a8', halo: '#14200f',
    ui: { bg: '#141a12', panel: '#20291c', accent: '#8fbf6a', text: '#eef3e4' },
  },
  blueprint: {
    label: 'Blueprint',
    note: 'Technical cyan-on-navy. Contours carry the relief, not the shading.',
    ramp: [
      [0.00, '#08192e'], [0.03, '#0b2036'], [0.08, '#102a44'],
      [0.18, '#163553'], [0.34, '#1d4265'], [0.55, '#255078'],
      [0.78, '#2f608c'], [1.00, '#4b83b3'],
    ],
    skyTop: '#040c18', skyFill: '#2f6d9e', skyHorizon: '#1d4365', sunColor: '#9fd8ff',
    fog: '#123a5c', fogTint: '#2f6d9e',
    water: '#0a2740', waterShallow: '#2f7ba8', waterSpec: '#bfe8ff',
    contour: '#7fd4ff', contourIndex: '#bdeaff',
    road: ['#8ff0ff', '#5cc9e8', '#3f9ec0'],
    rail: '#a8e5ff', boundary: '#5fa8d8', park: '#12405a',
    structure: { wall: '#2f6d9e', roof: '#1f4f78', glow: '#8ff0ff', glowAmount: 0.18, cable: '#a8e5ff' },
    ink: '#dff4ff', inkMuted: '#7fb2cc', halo: '#03101d',
    ui: { bg: '#040d17', panel: '#0c1c2c', accent: '#4fc3f7', text: '#dff4ff' },
  },
  noir: {
    label: 'Night Metro',
    note: 'Terrain recedes; the built pattern reads. Pairs with the night preset.',
    ramp: [
      [0.00, '#070b12'], [0.03, '#0a1018'], [0.08, '#0e1520'],
      [0.18, '#141c29'], [0.34, '#1b2432'], [0.55, '#232d3c'],
      [0.78, '#2d3847'], [1.00, '#3c4859'],
    ],
    skyTop: '#02040a', skyFill: '#2a3f60', skyHorizon: '#1b2740', sunColor: '#6f8ab8',
    fog: '#101a2c', fogTint: '#2a3954',
    water: '#08182a', waterShallow: '#255b7d', waterSpec: '#8fb6e8',
    contour: '#2a3850', contourIndex: '#3d4d68',
    road: ['#ffd98a', '#ffb964', '#d98f4a'],
    rail: '#7fe0d0', boundary: '#4a5f80', park: '#102018',
    structure: { wall: '#26303f', roof: '#161d28', glow: '#ffb964', glowAmount: 0.42, cable: '#9fd3c8' },
    ink: '#e8f0ff', inkMuted: '#8b9ab5', halo: '#01030a',
    ui: { bg: '#05080f', panel: '#0e141f', accent: '#ffb964', text: '#e8f0ff' },
  },
};

export const THEME_IDS = Object.keys(THEMES);

export function getTheme(id) {
  return THEMES[id] || THEMES.dusk;
}

/** '#rrggbb' -> [r, g, b] in 0..1, optionally converted to linear space. */
export function hexToRgb(hex, linearize = false) {
  const h = String(hex).replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return [0, 0, 0];
  let r = ((n >> 16) & 255) / 255;
  let g = ((n >> 8) & 255) / 255;
  let b = (n & 255) / 255;
  if (linearize) {
    const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    r = toLinear(r); g = toLinear(g); b = toLinear(b);
  }
  return [r, g, b];
}

/** Sample a theme ramp at normalised elevation `t`, returning [r,g,b] 0..1. */
export function sampleRamp(stops, t) {
  const x = Math.min(1, Math.max(0, t));
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (x >= stops[i][0] && x <= stops[i + 1][0]) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const span = hi[0] - lo[0];
  const f = span > 0 ? (x - lo[0]) / span : 0;
  const a = hexToRgb(lo[1]);
  const b = hexToRgb(hi[1]);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

/** Bake a theme's ramp into RGB bytes for a `width` x 1 LUT texture. */
export function bakeRamp(themeId, width = 256) {
  const theme = getTheme(themeId);
  const data = new Uint8Array(width * 3);
  for (let i = 0; i < width; i += 1) {
    const [r, g, b] = sampleRamp(theme.ramp, i / (width - 1));
    data[i * 3] = Math.round(r * 255);
    data[i * 3 + 1] = Math.round(g * 255);
    data[i * 3 + 2] = Math.round(b * 255);
  }
  return data;
}
