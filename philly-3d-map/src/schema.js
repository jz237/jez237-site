/**
 * Single source of truth for every tunable in the map.
 *
 * The control studio UI, the state store, the URL serialiser, the preset
 * system and the tests all read this table, so a control can never drift out
 * of sync with its bounds, its default or its short URL key.
 *
 * Pure data + pure functions only: this module is imported by Node tests and
 * must never touch the DOM, WebGL or the network.
 */

/** @typedef {'range'|'enum'|'bool'} ControlKind */

const THEMES = ['dusk', 'slate', 'verdant', 'blueprint', 'noir'];
const QUALITY = ['performance', 'balanced', 'cinematic'];
const CONTOUR_INTERVALS = [10, 20, 25, 50, 100];

/**
 * Every control. `k` is the compact key used in the URL hash and must be
 * unique and stable — changing one invalidates existing shared links.
 */
export const CONTROLS = {
  // ---- terrain -----------------------------------------------------------
  exaggeration: {
    k: 'ex', kind: 'range', min: 1, max: 25, step: 0.5, def: 10,
    group: 'terrain', label: 'Vertical exaggeration', unit: '×',
    hint: 'The region spans only ~380 m of relief across 94 km, so the wide ' +
      'shots need real stretch. Close in, less is more: the presets scale it ' +
      'down as the camera drops.',
  },
  contourStrength: {
    k: 'cs', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.28,
    group: 'terrain', label: 'Contour strength',
  },
  contourInterval: {
    k: 'ci', kind: 'enum', values: CONTOUR_INTERVALS, def: 50,
    group: 'terrain', label: 'Contour interval', unit: ' m',
  },

  // ---- light -------------------------------------------------------------
  sunAzimuth: {
    k: 'sa', kind: 'range', min: 0, max: 360, step: 1, def: 116, wrap: 360,
    group: 'light', label: 'Sun azimuth', unit: '°',
  },
  sunAltitude: {
    k: 'sl', kind: 'range', min: 1, max: 80, step: 1, def: 19,
    group: 'light', label: 'Sun altitude', unit: '°',
  },
  keyLight: {
    k: 'kl', kind: 'range', min: 0, max: 2, step: 0.02, def: 1.2,
    group: 'light', label: 'Key light',
  },
  ambient: {
    k: 'am', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.42,
    group: 'light', label: 'Ambient / sky fill',
  },

  // ---- atmosphere --------------------------------------------------------
  fogDensity: {
    k: 'fd', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.40,
    group: 'atmosphere', label: 'Fog / haze density',
  },
  glow: {
    k: 'gl', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.34,
    group: 'atmosphere', label: 'Bloom',
    hint: 'Restrained by design — it lifts the sun glint off the rivers ' +
      'without washing out the relief.',
  },
  waterIntensity: {
    k: 'wi', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.8,
    group: 'atmosphere', label: 'Water intensity',
  },

  // ---- cartography -------------------------------------------------------
  labelSize: {
    k: 'lz', kind: 'range', min: 0.6, max: 1.8, step: 0.05, def: 1,
    group: 'carto', label: 'Label size', unit: '×',
  },
  labelDensity: {
    k: 'ld', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.38,
    group: 'carto', label: 'Label density',
  },
  roadOpacity: {
    k: 'ro', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.3,
    group: 'carto', label: 'Road opacity',
  },
  boundaryOpacity: {
    k: 'bo', kind: 'range', min: 0, max: 1, step: 0.01, def: 0.38,
    group: 'carto', label: 'Boundary strength',
  },

  // ---- camera / scene ----------------------------------------------------
  theme: {
    k: 'th', kind: 'enum', values: THEMES, def: 'dusk',
    group: 'scene', label: 'Theme',
  },
  fov: {
    k: 'fv', kind: 'range', min: 22, max: 75, step: 1, def: 40,
    group: 'scene', label: 'Field of view', unit: '°',
  },
  quality: {
    k: 'q', kind: 'enum', values: QUALITY, def: 'balanced',
    group: 'scene', label: 'Quality',
  },
  animationSpeed: {
    k: 'as', kind: 'range', min: 0.25, max: 2.5, step: 0.05, def: 1,
    group: 'scene', label: 'Animation speed', unit: '×',
  },
};

/** Toggleable map layers, in legend order. */
export const LAYERS = {
  terrain: { k: 'Lt', def: true, label: 'Terrain relief' },
  hillshade: { k: 'Lh', def: true, label: 'Hillshade' },
  contours: { k: 'Lc', def: true, label: 'Contours' },
  water: { k: 'Lw', def: true, label: 'Waterways' },
  parks: { k: 'Lp', def: true, label: 'Parks & preserves' },
  roads: { k: 'Lr', def: true, label: 'Major roads' },
  rail: { k: 'Ll', def: false, label: 'Rail' },
  boundaries: { k: 'Lb', def: true, label: 'County / municipal lines' },
  places: { k: 'Ls', def: true, label: 'Neighborhoods & suburbs' },
  landmarks: { k: 'Lm', def: true, label: 'Landmarks' },
};

/** Camera pose. Kept in the same store so presets and URLs stay uniform. */
export const CAMERA = {
  camLon: { k: 'x', min: -75.8, max: -74.7, def: -75.2, prec: 4 },
  camLat: { k: 'y', min: 39.7, max: 40.55, def: 40.02, prec: 4 },
  // Orbit radius in metres from the target.
  camDist: { k: 'd', min: 1200, max: 190000, def: 86000, prec: 0 },
  // Map convention: 0 deg = north-up, increasing clockwise.
  camBearing: { k: 'b', min: 0, max: 360, def: 38, wrap: 360, prec: 1 },
  // Map convention: 0 deg = straight down, 85 deg = near the horizon.
  camPitch: { k: 'p', min: 0, max: 85, def: 63, prec: 1 },
};

export const GROUPS = [
  { id: 'scene', label: 'Scene' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'light', label: 'Light' },
  { id: 'atmosphere', label: 'Atmosphere' },
  { id: 'carto', label: 'Cartography' },
];

export const THEME_LIST = THEMES;
export const QUALITY_LIST = QUALITY;

/**
 * Default value for every key in the store.
 *
 * These are exactly the 'overview' preset's values, so a fresh load and
 * pressing Home land on the same frame, and a default view serialises to an
 * empty URL hash. A test asserts the two stay in step.
 */
export function defaults() {
  const out = {};
  for (const [id, c] of Object.entries(CONTROLS)) out[id] = c.def;
  for (const [id, c] of Object.entries(CAMERA)) out[id] = c.def;
  out.layers = {};
  for (const [id, l] of Object.entries(LAYERS)) out.layers[id] = l.def;
  out.preset = 'overview';
  return out;
}

/** Clamp `v` into [min, max], wrapping instead when the control wraps. */
function clampNumber(spec, v) {
  if (spec.wrap) {
    const w = spec.wrap;
    return ((v % w) + w) % w;
  }
  return Math.min(spec.max, Math.max(spec.min, v));
}

/**
 * Coerce an arbitrary value onto a control's domain.
 * Returns `undefined` when the value cannot be salvaged, so callers can tell
 * "not provided" apart from "provided but nonsense".
 */
export function coerce(key, value) {
  const spec = CONTROLS[key] || CAMERA[key];
  if (!spec) return undefined;

  if (spec.kind === 'enum') {
    // Numeric enums (contour interval) arrive as strings from the URL.
    if (spec.values.includes(value)) return value;
    const n = Number(value);
    if (Number.isFinite(n) && spec.values.includes(n)) return n;
    return undefined;
  }

  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return undefined;
  const clamped = clampNumber(spec, n);
  // Snap ranges onto their step so the UI and the URL agree exactly.
  if (spec.step) {
    const snapped = Math.round((clamped - spec.min) / spec.step) * spec.step + spec.min;
    return Math.min(spec.max, Math.max(spec.min, Number(snapped.toFixed(6))));
  }
  return clamped;
}

/** Coerce a whole patch, dropping unknown keys and unusable values. */
export function coercePatch(patch) {
  const out = {};
  if (!patch || typeof patch !== 'object') return out;
  for (const [key, value] of Object.entries(patch)) {
    if (key === 'layers') {
      if (value && typeof value === 'object') {
        const layers = {};
        for (const [lid, on] of Object.entries(value)) {
          if (lid in LAYERS) layers[lid] = !!on;
        }
        if (Object.keys(layers).length) out.layers = layers;
      }
      continue;
    }
    if (key === 'preset') {
      if (typeof value === 'string' && value) out.preset = value;
      continue;
    }
    const c = coerce(key, value);
    if (c !== undefined) out[key] = c;
  }
  return out;
}

/** Keys whose change only needs a uniform update, not a geometry rebuild. */
export const CHEAP_KEYS = new Set([
  'sunAzimuth', 'sunAltitude', 'keyLight', 'ambient', 'fogDensity', 'glow',
  'waterIntensity', 'contourStrength', 'contourInterval', 'roadOpacity',
  'boundaryOpacity', 'theme', 'camLon', 'camLat', 'camDist', 'camBearing',
  'camPitch', 'fov', 'animationSpeed', 'labelSize', 'labelDensity', 'preset',
]);
