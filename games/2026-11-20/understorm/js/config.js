// UNDERSTORM 2026 — shared constants. The playfield is a fixed 32 x 18 plane; everything in the
// simulation is measured in those units and advanced in fixed 1/60 s steps.
export const VERSION = '1.0.2';
export const W = 32, H = 18, DT = 1 / 60;
export const SPEEDS = [5.5, 7.5, 9.5, 12];
export const BASE_SCROLL = 2.4;
export const CHARGE = [0.42, 0.95, 1.65];
export const DIFFS = {
  easy: { key: 'easy', name: 'CADET', bs: 0.78, fr: 1.4, lives: 5, shield: 1, hp: 0.85 },
  normal: { key: 'normal', name: 'PILOT', bs: 1, fr: 1, lives: 3, shield: 0, hp: 1 },
  hard: { key: 'hard', name: 'STORMRIDER', bs: 1.2, fr: 0.78, lives: 3, shield: 0, hp: 1.15, revenge: true },
};
export const CORE_NAMES = ['', 'ARC', 'RICOCHET', 'BURROW'];
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const P = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
