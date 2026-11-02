// Plasma Pong: Battle Edition — tuning, pilots, arenas and power-ups.
export const VERSION = 'v1.0.1';

// World units. Side +1 is the near player (P1, positive z), side -1 the far one.
export const F = {
  hw: 7,            // half width of the court (side walls at x = +-hw)
  paddleZ: 9.35,    // paddle home line
  zoneFront: 7.7,   // how far forward a paddle may lunge
  zoneBack: 10.05,  // how far back it may retreat
  paddleHD: 0.28,   // paddle half depth
  paddleHW: 1.35,   // paddle half width at scale 1
  cellZ: 10.85,     // shield cell line
  cellHD: 0.26,
  cells: 7,
  cellGap: 0.07,
  cellHP: 2,
  goalZ: 11.55,     // core curtain: a ball reaching it hurts the core
  ballR: 0.32,
  serveSpeed: 11.5,
  maxRally: 27,
  maxSpeed: 38,
  maxAngle: 0.98,   // ~56 degrees off the court axis
  minVzFrac: 0.34,  // a ball never travels flatter than this
  spinK: 0.095,     // Magnus curve strength
  spinDecay: 0.55,
  boltSpeed: 34,
  boltCharges: 3,
  boltRecharge: 4.2,
  boltCooldown: 0.28,
  stunTime: 0.8,
  coreHP: 6,
  bossCoreHP: 7,
  odTime: 6.5,
};

export const COLORS = {
  p1: 0x2ff5ff,
  p2: 0xff3dd8,
};

// Personas drive the AI. react = seconds between re-plans, noise = aim error (court units),
// speed/accel = paddle limits, temp = softmax temperature over shot plans (lower is sharper).
export const PILOTS = {
  volt: {
    key: 'volt', name: 'VOLT', title: 'THE SPARK', color: 0xffe14a, accent: 0x38f0ff,
    blurb: 'A hyperactive rookie who fires first and aims later.',
    ai: { react: 0.2, noise: 1.15, speed: 12.5, accel: 70, smash: 0.25, spin: 0.15, fire: 0.45, greed: 0.5, od: 0.5, temp: 0.55, lunge: 0.5, bank: 0.2 },
  },
  nyx: {
    key: 'nyx', name: 'NYX', title: 'THE PHANTOM', color: 0xb46bff, accent: 0x6af7ff,
    blurb: 'Curves, ghosts and misdirection. You will not see it coming.',
    ai: { react: 0.15, noise: 0.8, speed: 14, accel: 85, smash: 0.3, spin: 0.85, fire: 0.35, greed: 0.65, od: 0.6, temp: 0.35, lunge: 0.6, bank: 0.6 },
  },
  krank: {
    key: 'krank', name: 'KRANK', title: 'THE CRUSHER', color: 0xff6a1f, accent: 0xffd23f,
    blurb: 'Smashes everything. Shoots everything. Thinks later.',
    ai: { react: 0.13, noise: 0.62, speed: 15, accel: 95, smash: 0.9, spin: 0.25, fire: 0.85, greed: 0.45, od: 0.85, temp: 0.3, lunge: 0.95, bank: 0.3 },
  },
  seraph: {
    key: 'seraph', name: 'SERAPH', title: 'THE ORACLE', color: 0xe8f4ff, accent: 0x7cd6ff,
    blurb: 'Computes every bounce. Finds every gap in your shield.',
    ai: { react: 0.09, noise: 0.34, speed: 16.5, accel: 120, smash: 0.55, spin: 0.6, fire: 0.6, greed: 0.7, od: 0.75, temp: 0.16, lunge: 0.8, bank: 0.85 },
  },
  monolith: {
    key: 'monolith', name: 'MONOLITH', title: 'THE END OF ALL RALLIES', color: 0xff2a3a, accent: 0xff9a3a, boss: true,
    blurb: 'An ancient fortress-paddle. It splits in two when cornered.',
    ai: { react: 0.14, noise: 0.75, speed: 12, accel: 70, smash: 0.5, spin: 0.4, fire: 0.6, greed: 0.5, od: 0.8, temp: 0.3, lunge: 0.6, bank: 0.7 },
  },
};

export const HUMAN = { key: 'p1', name: 'PLAYER 1', title: 'CHALLENGER', color: COLORS.p1, accent: 0xffffff };
export const HUMAN2 = { key: 'p2', name: 'PLAYER 2', title: 'CHALLENGER', color: COLORS.p2, accent: 0xffffff };

// Each arena: palette, music, hazards. Colours are linear-ish hex for shaders.
export const ARENAS = [
  {
    key: 'grid', name: 'NEON GRID', music: 'neon',
    sky: [0x07031c, 0x1a0640, 0x00384a], grid: 0x2a6cff, accent: 0xff3dd8, fog: 0x060418,
    planet: { color: 0xff4fb0, ring: true, pos: [-190, -210, -330], r: 70 },
    hazards: {},
  },
  {
    key: 'horizon', name: 'EVENT HORIZON', music: 'horizon',
    sky: [0x020108, 0x22072e, 0x3a1406], grid: 0x8a4dff, accent: 0xff8a2a, fog: 0x040108,
    planet: { color: 0xff7a2a, ring: false, pos: [180, -190, -320], r: 55 },
    hazards: { hole: { x: 0, z: 0, m: 52, r: 0.62 } },
  },
  {
    key: 'nebula', name: 'PINBALL NEBULA', music: 'nebula',
    sky: [0x020d10, 0x0c3a2e, 0x3a0c3e], grid: 0x2affb0, accent: 0xff4fd0, fog: 0x02100c,
    planet: { color: 0x3affc8, ring: true, pos: [190, -220, -330], r: 62 },
    hazards: { bumpers: { n: 3, ring: 2.9, r: 0.62, w: 0.42 } },
  },
  {
    key: 'warp', name: 'WARP GATES', music: 'warp',
    sky: [0x0b0700, 0x2e1a00, 0x002a4a], grid: 0xffb23a, accent: 0x3ac8ff, fog: 0x0a0600,
    planet: { color: 0xffc04a, ring: true, pos: [-180, -200, -320], r: 58 },
    hazards: { portals: { z: 3.0, len: 2.6 }, sliders: { z: 0, hw: 0.95, hd: 0.3, amp: 3.6, w: 0.75 } },
  },
  {
    key: 'monolith', name: 'THE MONOLITH', music: 'boss',
    sky: [0x0c0000, 0x2a0004, 0x150a1a], grid: 0xff2a3a, accent: 0xffa23a, fog: 0x0a0000,
    planet: { color: 0xff2a1a, ring: false, pos: [0, -260, -260], r: 150 },
    hazards: { storm: true },
  },
];

// The campaign ladder: one pilot per arena.
export const LADDER = ['volt', 'nyx', 'krank', 'seraph', 'monolith'];

export const DIFFICULTY = {
  easy:   { label: 'EASY',   ai: { noise: 1.6, speed: 0.82, react: 1.5, fire: 0.55, smash: 0.35 }, scoreMul: 0.7 },
  normal: { label: 'NORMAL', ai: { noise: 1.0, speed: 1.0, react: 1.0, fire: 1.0, smash: 0.75 }, scoreMul: 1 },
  hard:   { label: 'HARD',   ai: { noise: 0.6, speed: 1.12, react: 0.7, fire: 1.2, smash: 1 }, scoreMul: 1.5 },
};

// Power-ups: icon glyph is drawn on a canvas; voice = announcer clip, sfx = effect clip.
export const POWERUPS = {
  multi:   { name: 'MULTI-BALL', glyph: '⁂', color: 0x6af7ff, sfx: 'multi', voice: 'multi', w: 1.0, desc: 'Splits the ball into three.' },
  titan:   { name: 'TITAN',      glyph: '⬌', color: 0x4dff9a, sfx: 'titan', voice: 'titan', w: 1.0, desc: 'Your paddle grows huge.' },
  shrink:  { name: 'SHRINK RAY', glyph: '⇲', color: 0xff5a7a, sfx: 'shrink', voice: 'shrink', w: 0.9, desc: 'Your rival’s paddle shrinks.' },
  nova:    { name: 'NOVA',       glyph: '✹', color: 0xff8a1a, sfx: 'nova', voice: 'nova', w: 0.9, desc: 'Your balls burn through a shield cell.' },
  repair:  { name: 'REPAIR',     glyph: '✚', color: 0x7dffb0, sfx: 'repair', voice: 'repair', w: 0.8, desc: 'Rebuilds your whole shield.' },
  drone:   { name: 'DRONE',      glyph: '⌖', color: 0xffe14a, sfx: 'drone', voice: 'drone', w: 0.8, desc: 'A wingman drone fires at your rival.' },
  hole:    { name: 'SINGULARITY',glyph: '◉', color: 0xb46bff, sfx: 'singularity', voice: 'singularity', w: 0.7, desc: 'A black hole opens on the rival half.' },
  ghost:   { name: 'GHOST BALL', glyph: '◌', color: 0xc8d8ff, sfx: 'ghost', voice: 'ghost', w: 0.8, desc: 'Your balls vanish on the rival half.' },
  magnet:  { name: 'MAGNET',     glyph: '⋒', color: 0x3a9cff, sfx: 'magnet', voice: 'magnet', w: 0.8, desc: 'Catch the ball, aim, release a smash.' },
  barrier: { name: 'BARRIER',    glyph: '▤', color: 0x2ff5d2, sfx: 'barrier', voice: 'barrier', w: 0.8, desc: 'An energy wall guards your goal.' },
  storm:   { name: 'LIGHTNING',  glyph: 'ϟ', color: 0xfff27a, sfx: 'storm', voice: 'storm', w: 0.75, desc: 'Lightning strikes three rival cells.' },
  chrono:  { name: 'CHRONO',     glyph: '⧗', color: 0x9affff, sfx: 'chrono', voice: 'chrono', w: 0.7, desc: 'Balls slow down on your half.' },
  scope:   { name: 'SCOPE',      glyph: '⊹', color: 0xaaff4a, sfx: 'scope', voice: 'scope', w: 0.6, desc: 'Shows where every ball will go.' },
};
export const POWERUP_KEYS = Object.keys(POWERUPS);
