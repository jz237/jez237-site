/**
 * URL hash serialisation, so any view can be linked, bookmarked and restored.
 *
 * Only the delta from the active preset is written. A shared link therefore
 * reads as "this preset, plus these three things I changed" and stays short,
 * while a link with no preset falls back to the schema defaults as its base.
 *
 * Pure module: the tests round-trip real app states through it.
 */

import { CONTROLS, CAMERA, LAYERS, defaults, coercePatch } from './schema.js?v=philly-2026090611';
import { presetPatch, getPreset } from './presets.js?v=philly-2026090611';

const PRESET_KEY = 'P';
const NAME_KEY = 'n';
export const VIEW_NAME_MAX = 60;

/** short key -> state key, built once from the schema. */
const BY_SHORT = (() => {
  const map = new Map();
  for (const [id, c] of Object.entries(CONTROLS)) map.set(c.k, { id, kind: 'control' });
  for (const [id, c] of Object.entries(CAMERA)) map.set(c.k, { id, kind: 'camera' });
  for (const [id, l] of Object.entries(LAYERS)) map.set(l.k, { id, kind: 'layer' });
  return map;
})();

function shortKey(id) {
  return (CONTROLS[id] || CAMERA[id])?.k;
}

/** Trim float noise without losing meaningful precision. */
function fmt(id, value) {
  if (typeof value !== 'number') return String(value);
  const spec = CONTROLS[id] || CAMERA[id];
  const prec = spec?.prec;
  if (prec !== undefined) return String(Number(value.toFixed(prec)));
  // Derive digits from the control's step: a 0.01 step needs 2 decimals.
  const step = spec?.step ?? 1;
  const digits = Math.max(0, Math.min(6, Math.ceil(-Math.log10(step))));
  return String(Number(value.toFixed(digits)));
}

/** The state a URL without any overrides would produce. */
function baseFor(presetId) {
  const base = { ...defaults() };
  const preset = presetId && presetPatch(presetId);
  if (preset) {
    Object.assign(base, preset);
    base.layers = { ...defaults().layers, ...preset.layers };
  }
  return base;
}

/**
 * Serialise `state` to a hash body (no leading '#').
 * Returns '' when the state is exactly the default view.
 */
export function encodeState(state) {
  if (!state) return '';
  const presetId = getPreset(state.preset) ? state.preset : null;
  const base = baseFor(presetId);
  const parts = [];

  if (presetId && presetId !== defaults().preset) {
    parts.push(`${PRESET_KEY}=${encodeURIComponent(presetId)}`);
  }

  for (const id of [...Object.keys(CONTROLS), ...Object.keys(CAMERA)]) {
    const value = state[id];
    if (value === undefined) continue;
    const a = fmt(id, value);
    const b = fmt(id, base[id]);
    if (a !== b) parts.push(`${shortKey(id)}=${encodeURIComponent(a)}`);
  }

  for (const [id, spec] of Object.entries(LAYERS)) {
    const on = !!state.layers?.[id];
    if (on !== !!base.layers[id]) parts.push(`${spec.k}=${on ? 1 : 0}`);
  }

  return parts.join('&');
}

/**
 * Parse a hash into a state patch.
 *
 * Everything here is untrusted input, so unknown keys are ignored and every
 * value goes through the schema's coercion before it reaches the store.
 * Returns null when the hash carries nothing usable, letting the caller keep
 * its own defaults.
 */
export function decodeState(hash) {
  if (typeof hash !== 'string') return null;
  const body = hash.replace(/^#+/, '').trim();
  if (!body) return null;

  const params = new URLSearchParams(body);
  const presetRaw = params.get(PRESET_KEY);
  const presetId = presetRaw && getPreset(presetRaw) ? presetRaw : null;

  const patch = presetId ? { ...presetPatch(presetId) } : {};
  const layers = presetId ? { ...patch.layers } : {};
  let found = !!presetId;

  for (const [key, raw] of params) {
    if (key === PRESET_KEY) continue;
    const entry = BY_SHORT.get(key);
    if (!entry) continue;
    if (entry.kind === 'layer') {
      layers[entry.id] = raw === '1' || raw === 'true';
      found = true;
    } else {
      patch[entry.id] = raw;
      found = true;
    }
  }
  if (!found) return null;

  if (Object.keys(layers).length) patch.layers = layers;
  const clean = coercePatch(patch);
  if (presetId) clean.preset = presetId;
  return Object.keys(clean).length ? clean : null;
}

/** A view name safe to carry in a hash: trimmed, control characters out, capped. */
export function cleanViewName(name) {
  if (typeof name !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return name.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, VIEW_NAME_MAX);
}

/** The name a shared link carries (`n=`), or '' when it has none. */
export function readViewName(hash) {
  if (typeof hash !== 'string') return '';
  const body = hash.replace(/^#+/, '');
  if (!body) return '';
  return cleanViewName(new URLSearchParams(body).get(NAME_KEY) || '');
}

/** Build a shareable absolute URL for the current state, optionally named. */
export function buildShareUrl(href, state, name = '') {
  const parts = [];
  const encoded = encodeState(state);
  if (encoded) parts.push(encoded);
  const clean = cleanViewName(name);
  if (clean) parts.push(`${NAME_KEY}=${encodeURIComponent(clean)}`);
  const base = String(href).split('#')[0];
  return parts.length ? `${base}#${parts.join('&')}` : base;
}
