// Persistent user settings — one JSON blob in localStorage. Nullable
// defaults (aimAssist, autoFire) resolve per-device at the point of use.

import { REVERSE_LOOK_KEY } from './config.js?v=4';

const KEY = 'iron_ridge_settings_v1';

export const DEFAULTS = {
  lookSens: 1.0,     // look sensitivity multiplier (mouse + touch)
  aimAssist: null,   // null → on
  autoFire: null,    // null → on for touch, off for desktop
  reverseLook: false,
  leftHanded: false,
  touchScale: 1.0,   // 0.85 small | 1.0 medium | 1.2 large
  quality: 'auto',   // 'auto' | 0..3 (locked level)
  camShake: true,
  musicOn: true,
  musicVol: 0.65,
  sfxVol: 1.0,
  showFps: true,
  voiceOn: true,     // commander voice callouts
  haptics: true,     // vibration on touch devices
};

function load() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  const out = { ...DEFAULTS, ...s };
  // migrate the pre-settings reverse-look key
  if (!('reverseLook' in s)) out.reverseLook = localStorage.getItem(REVERSE_LOOK_KEY) === '1';
  return out;
}

export const settings = load();

export function saveSettings() {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {}
}

export function setSetting(k, v) {
  settings[k] = v;
  saveSettings();
}
