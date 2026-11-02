import * as THREE from 'three';

export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (a, b, k, dt) => b + (a - b) * Math.exp(-k * dt);
export const smooth = t => t * t * (3 - 2 * t);
export const easeOutBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const wrapAngle = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
export const angleDamp = (a, b, k, dt) => a + wrapAngle(b - a) * (1 - Math.exp(-k * dt));
export const TAU = Math.PI * 2;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export const rnd = Math.random;
export const rr = (a, b) => a + Math.random() * (b - a);
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// Settings persisted per browser (try/catch: storage may be blocked).
const SKEY = 'hhm3d-settings-v1';
export const settings = Object.assign({
  quality: 'auto', music: 0.7, sfx: 0.9, voice: 1.0, narration: true, muted: false,
  camSens: 1.0, invertY: false, shake: true, fps: false, captions: true, hud: 1,
  assistSpeed: 1, assistTime: 1, assistLives: false, ghost: true, keys: {},
}, (() => { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch { return {}; } })());
export function saveSettings() { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch {} }

const PKEY = 'hhm3d-progress-v1';
export const assistOn = () => settings.assistSpeed < 1 || settings.assistTime > 1 || settings.assistLives;

export const progress = Object.assign({ unlocked: 1, hi: 0, initials: 'MAC', built: [] },
  (() => { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch { return {}; } })());
export function saveProgress() { try { localStorage.setItem(PKEY, JSON.stringify(progress)); } catch {} }

export const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
