// Rimstorm 2026 — every tunable number lives here. The RAMP table drives difficulty; nothing else in the
// game hard-codes enemy pace, numbers, spacing, fire rate or warning time.
export const VERSION = '1.3.0';
export const STEP = 1 / 120;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ the lane-web and the Rimrunner
// Positions on a web: `lane` is a lane coordinate (lane i's centre is the integer i, its borders are
// i +- 0.5) and `d` is the depth, 0 at the near rim and 1 at the far end of the tube.
export const F = {
  glide: 15,             // lanes per second the Rimrunner glides toward the lane it wants
  spin: 8.5,             // lanes per second while a direction is held (keys, stick)
  dxMax: 1.6,            // most lanes a spinner (mouse / touch drag) can ask for in one tick
  fireCD: 0.115,         // seconds between shots (FIRE RATE cuts it)
  shotV: 1.9,            // shot speed, depth per second
  maxShots: 5,           // shots in flight per Rimrunner (a held trigger can run out: arcade-style pressure)
  inv: 2.2,              // invulnerable after a respawn
  respawn: 1.5,          // seconds before you come back
  hopT: 0.8,             // a hop lifts you clear of the rim for this long
  dragT: 1.25,           // a grabbed Rimrunner is dragged down the lane for this long
  clearD: 0.55,          // on a respawn everything near the rim is thrown back down to this depth
  podV: 0.24,            // power-up pods float up their lane this fast
  droidT: 14,            // a guard droid holds a lane this long
  droidCD: 0.3,          // and fires this often
  spineChip: 0.075,      // a shot breaks this much off the top of a spine
  dive: [3.3, 2.7],      // seconds a dive takes in sector 1 and in sector 5
  intro: 1.5,            // seconds a new web takes to form
};

// ------------------------------------------------------------------ web shapes
// Each shape is a cross-section outline: closed shapes loop, open shapes have two free ends. Points are
// spread evenly along the outline, so a web of n lanes has n (closed) or n + 1 (open) points. The outline
// lives in the x/y plane with +y up, about 1 unit in radius; the renderer scales it.
const ring = (n, f) => Array.from({ length: n }, (_, i) => f(i, n));
function polyLoop(corners, n) {
  // spread n points evenly along a closed polygon
  const segs = [];
  let L = 0;
  for (let i = 0; i < corners.length; i++) {
    const a = corners[i], b = corners[(i + 1) % corners.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l < 1e-9) continue;
    segs.push([a, b, l, L]); L += l;
  }
  return ring(n, (i) => {
    const s = (i / n) * L;
    for (const [a, b, l, o] of segs) if (s <= o + l + 1e-9) { const f = (s - o) / l; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
    return corners[0];
  });
}
function polyOpen(pts, n) {
  // n + 1 points evenly along an open polyline
  const segs = [];
  let L = 0;
  for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 1e-9) continue; segs.push([a, b, l, L]); L += l; }
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = (i / n) * L;
    for (const [a, b, l, o] of segs) if (s <= o + l + 1e-9) { const f = (s - o) / l; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
    return pts[pts.length - 1];
  });
}
// every shape starts at the bottom and runs counter-clockwise (as seen from the rim), so lane + 1 is
// "to the right" for a Rimrunner sitting at the bottom
export const SHAPES = {
  circle: { closed: true, n: 16, pts: () => ring(16, (i, n) => { const a = -Math.PI / 2 - Math.PI / n + (i / n) * TAU; return [Math.cos(a), Math.sin(a)]; }) },
  hexagon: { closed: true, n: 12, pts: () => polyLoop(ring(6, (i) => { const a = -Math.PI / 2 - Math.PI / 6 + (i / 6) * TAU; return [Math.cos(a) * 1.05, Math.sin(a) * 1.05]; }), 12) },
  square: { closed: true, n: 16, pts: () => polyLoop([[-0.9, -0.9], [0.9, -0.9], [0.9, 0.9], [-0.9, 0.9]], 16) },
  cross: { closed: true, n: 12, pts: () => polyLoop([[-0.36, -1], [0.36, -1], [0.36, -0.36], [1, -0.36], [1, 0.36], [0.36, 0.36], [0.36, 1], [-0.36, 1], [-0.36, 0.36], [-1, 0.36], [-1, -0.36], [-0.36, -0.36]], 12) },
  star: { closed: true, n: 16, pts: () => ring(16, (i, n) => { const a = -Math.PI / 2 + (i / n) * TAU; const r = i % 2 ? 0.62 : 1.08; return [Math.cos(a) * r, Math.sin(a) * r]; }) },
  gear: { closed: true, n: 16, pts: () => ring(16, (i, n) => { const a = -Math.PI / 2 + ((i - 0.5) / n) * TAU; const r = (i % 4 === 0 || i % 4 === 1) ? 1.06 : 0.74; return [Math.cos(a) * r, Math.sin(a) * r]; }) },
  v: { closed: false, n: 14, pts: () => polyOpen([[-1.15, 0.85], [0, -0.95], [1.15, 0.85]], 14) },
  u: { closed: false, n: 15, pts: () => polyOpen([[-1, 0.95], [-1, -0.35], ...ring(9, (i) => { const a = Math.PI + (i / 8) * Math.PI; return [Math.cos(a), -0.35 + Math.sin(a) * 0.65]; }), [1, -0.35], [1, 0.95]], 15) },
  wave: { closed: false, n: 15, pts: () => polyOpen(ring(41, (i) => { const x = -1.25 + (i / 40) * 2.5; return [x, -0.55 + Math.sin(x * 3.1) * 0.32 + x * x * 0.18]; }), 15) },
  spiral: { closed: false, n: 15, pts: () => polyOpen(ring(61, (i) => { const t = i / 60, a = -Math.PI / 2 - 0.3 + t * 1.75 * Math.PI, r = 1.12 - t * 0.62; return [Math.cos(a) * r, Math.sin(a) * r]; }), 15) },
};
export const SHAPE_KEYS = Object.keys(SHAPES);

// ------------------------------------------------------------------ sectors, webs and their looks
// rot = how fast the web turns (radians per second, visual), breathe = how much it swells and shrinks.
// Lane count matters a lot to the difficulty (a 12-lane web is about half as deadly to patrol as a 16-lane
// one at the same RAMP values; ramp_check.mjs measured it), so the fought webs all have 14-16 lanes and the
// compact 12-lane hexagon and cross are boss arenas (and breathers in ENDLESS DESCENT). Open webs (14-15 lanes, two
// ends to back into) play about a third gentler than closed 16-lane ones, so each sector opens on an open web after
// the shop and then runs three closed ones.
export const SECTORS = [
  { key: 'orbit', name: 'ORBITAL RING', place: 'Above the gas giant Tessaly', boss: 'maelstrom', music: 's1',
    webs: [{ shape: 'u' }, { shape: 'circle' }, { shape: 'square' }, { shape: 'gear' }], bossWeb: { shape: 'circle' } },
  { key: 'abyss', name: 'ABYSS TRENCH', place: 'Eleven kilometres under the Varne ocean', boss: 'hydra', music: 's2',
    webs: [{ shape: 'v' }, { shape: 'star', rot: 0.05 }, { shape: 'circle', breathe: 0.05 }, { shape: 'square', rot: 0.06 }], bossWeb: { shape: 'hexagon' } },
  { key: 'core', name: 'MOLTEN CORE', place: 'The furnace heart of Ardent IV', boss: 'furnace', music: 's3',
    webs: [{ shape: 'spiral' }, { shape: 'gear', rot: 0.08 }, { shape: 'star', breathe: 0.07 }, { shape: 'circle', breathe: 0.07 }], bossWeb: { shape: 'cross' } },
  { key: 'moon', name: 'CRYSTAL MOON', place: 'The frozen moon Halcyon', boss: 'prism', music: 's4',
    webs: [{ shape: 'wave', breathe: 0.06 }, { shape: 'star' }, { shape: 'circle', rot: 0.12 }, { shape: 'square', breathe: 0.08 }], bossWeb: { shape: 'star' } },
  { key: 'horizon', name: 'EVENT HORIZON', place: 'The edge of the black hole Kessler-9', boss: 'singularity', music: 's5',
    webs: [{ shape: 'spiral', breathe: 0.05 }, { shape: 'square', rot: 0.14 }, { shape: 'star', rot: 0.12, breathe: 0.05 }, { shape: 'gear', rot: 0.16, breathe: 0.06 }], bossWeb: { shape: 'circle', rot: 0.1 } },
];
export const WEBS = 4;   // webs per sector, then the boss

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Each sector row gives [value at its first web, value at its last]; the game interpolates web by web,
// and each sector starts about where the last one ended. ENDLESS DESCENT walks the same curve.
// Normal starts at a MEDIUM pace (the player asked for it): sector 1 already keeps 3-4 threats on the web.
//   spd     enemy climb speed multiplier (a splitter climbs the whole tube in ~9 s at 1)
//   count   enemies per web (not counting the hoppers a splitter becomes)
//   active  most enemies on the web at once
//   gap     seconds between arrivals at the far end
//   warn    seconds every attack is telegraphed (lane glow, crouch, charge) and the boss tells
//   flip    seconds between a rim rider's hops along the rim
//   grab    seconds a rim rider or arc mite needs in your lane before it gets you
//   fire    lancer bolts per second (each)
//   boltV   bolt speed, depth per second
//   shock   seconds between a shocker's lane strikes
//   spine   how high spinewrights lay (fraction of the tube, from the far end)
//   hpS/hpB extra hit points for small climbers (splitter, hopper, mirror) / big ones (lancer, shocker, spinewright);
//           a fraction is a chance (1.4 = +1, and 40 % of them +2). One more hit per climber is the strongest lever there is.
//   bossHP  boss armour; bossRate scales how often it attacks
//   mix     which enemies come and how often
export const RAMP = [
  { spd: [1.05, 1.25], count: [17, 21], active: [3, 5], gap: [1.15, 1.0], warn: [1.2, 1.1], flip: [0.46, 0.38], grab: [0.235, 0.215], fire: [0.4, 0.46], boltV: [0.45, 0.5], shock: [5.0, 4.6], spine: [0.45, 0.52], hpS: [1, 1], hpB: [0, 0],
    bossHP: 150, bossRate: 0.7, mix: { splitter: 1, hopper: 0.9, lancer: 0.5, spinewright: 0.35 } },
  { spd: [1.3, 1.42], count: [21, 25], active: [5, 7], gap: [0.95, 0.85], warn: [1.04, 0.96], flip: [0.35, 0.32], grab: [0.19, 0.185], fire: [0.48, 0.54], boltV: [0.5, 0.55], shock: [4.3, 3.9], spine: [0.52, 0.58], hpS: [1, 1], hpB: [1, 1],
    bossHP: 210, bossRate: 0.9, mix: { splitter: 1, hopper: 0.9, lancer: 0.6, spinewright: 0.4, mite: 0.5, shocker: 0.45 } },
  { spd: [1.47, 1.59], count: [26, 30], active: [7, 9], gap: [0.82, 0.74], warn: [0.92, 0.84], flip: [0.21, 0.2], grab: [0.15, 0.14], fire: [0.55, 0.6], boltV: [0.55, 0.6], shock: [3.2, 2.9], spine: [0.58, 0.64], hpS: [1.3, 1.45], hpB: [1, 1],
    bossHP: 340, bossRate: 1.2, mix: { splitter: 1, hopper: 0.9, lancer: 0.65, spinewright: 0.42, mite: 0.6, shocker: 0.55, mirror: 0.45 } },
  { spd: [1.64, 1.76], count: [31, 35], active: [9, 11], gap: [0.72, 0.65], warn: [0.81, 0.72], flip: [0.2, 0.19], grab: [0.14, 0.135], fire: [0.6, 0.66], boltV: [0.6, 0.65], shock: [2.9, 2.6], spine: [0.64, 0.7], hpS: [1.45, 1.75], hpB: [1.5, 2],
    bossHP: 150, bossRate: 0.35, mix: { splitter: 1, hopper: 0.95, lancer: 0.7, spinewright: 0.45, mite: 0.65, shocker: 0.6, mirror: 0.5 } },
  { spd: [1.85, 1.95], count: [36, 41], active: [11, 14], gap: [0.63, 0.55], warn: [0.7, 0.6], flip: [0.19, 0.17], grab: [0.115, 0.105], fire: [0.66, 0.74], boltV: [0.65, 0.72], shock: [2.6, 2.3], spine: [0.7, 0.76], hpS: [2.0, 2.55], hpB: [2, 2],
    bossHP: 480, bossRate: 1.22, mix: { splitter: 1, hopper: 1.0, lancer: 0.75, spinewright: 0.45, mite: 0.7, shocker: 0.6, mirror: 0.55 } },
];
const RAMP_KEYS = ['spd', 'count', 'active', 'gap', 'warn', 'flip', 'grab', 'fire', 'boltV', 'shock', 'spine', 'hpS', 'hpB'];

// the difficulty values at web `w` (0-based, 0..WEBS-1) of sector `s`
export function rampAt(s, w) {
  const row = RAMP[s];
  const f = Math.max(0, Math.min(1, w / (WEBS - 1)));
  const out = { sector: s, web: w, bossHP: row.bossHP, bossRate: row.bossRate, mix: row.mix };
  for (const k of RAMP_KEYS) out[k] = row[k][0] + (row[k][1] - row[k][0]) * f;
  out.count = Math.round(out.count); out.active = Math.round(out.active);
  return out;
}
// when each enemy first appears in the campaign: [sector, web]
export const INTRO = { splitter: [0, 0], hopper: [0, 0], lancer: [0, 1], spinewright: [0, 2], mite: [1, 0], shocker: [1, 1], mirror: [2, 0] };
export const introduced = (type, s, w) => { const q = INTRO[type]; return !q || s > q[0] || (s === q[0] && w >= q[1]); };

// ENDLESS DESCENT: level 0 = sector 1's first web, 5 = past sector 5's last, reached after ~18 minutes
export const ENDLESS = { minutes: 18, startLevel: 0.2, bossEvery: 5 };
export function endlessLevel(seconds) {
  const m = seconds / 60;
  return Math.min(5, ENDLESS.startLevel + 4.8 * Math.pow(Math.min(1, m / ENDLESS.minutes), 1.1));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level));
  return rampAt(s, Math.min(WEBS - 1, (level - s) * (WEBS - 1)));
}
export const ENDLESS_SHAPES = ['hexagon', 'circle', 'v', 'square', 'u', 'gear', 'wave', 'cross', 'star', 'spiral'];

// ------------------------------------------------------------------ enemies
// hp, v climb speed (depth per second at spd 1), score
export const ENEMY = {
  splitter: { hp: 1, v: 0.105, score: 150, splitD: 0.3 },
  hopper: { hp: 1, v: 0.12, score: 150, flipT: 0.22, climbFlip: [1.3, 2.4] },
  spinewright: { hp: 2, v: 0.1, score: 250, back: 0.22 },
  mite: { hp: 1, v: 0.075, score: 200, cross: [1.5, 2.6], crossT: 0.55, hitW: 0.22 },
  lancer: { hp: 2, v: 0.09, score: 200, hover: [0.42, 0.72], shots: 3 },
  shocker: { hp: 2, v: 0.08, score: 250, hover: [0.45, 0.7], live: 0.9 },
  mirror: { hp: 1, v: 0.1, score: 300, shield: 1 },
};
export const ENEMY_KEYS = Object.keys(ENEMY);

// bosses: one per sector, rising up the tube. Attacks run in turn; phase 2 (below 55% armour) uses p2,
// phase 3 (below 25%, the Singularity Engine only) uses p3.
//   d       depth it settles at; armour = which lanes its armour covers (1) and leaves open (0), turned by rot
export const BOSSES = {
  maelstrom: { name: 'MAELSTROM CORE', d: 0.62, armour: [1, 1, 1, 0], segHP: 3, rot: [0.45, 0.9], atk: ['volley', 'spawn', 'volley', 'sweep'], p2: ['sweep', 'volley', 'spawn', 'volley'], spawn: ['hopper', 'splitter'] },
  hydra: { name: 'THE HYDRA', d: 0.66, heads: 4, headHP: 7, atk: ['spit', 'lunge', 'spawn', 'spit'], p2: ['lunge', 'spit', 'lunge', 'spawn'], spawn: ['splitter', 'hopper', 'mite'] },
  furnace: { name: 'FURNACE WHEEL', d: 0.6, armour: [1, 0], segHP: 4, rot: [0.6, -1.0], atk: ['flare', 'embers', 'flare', 'spawn'], p2: ['flare', 'embers', 'sweep', 'flare'], spawn: ['hopper', 'shocker'] },
  prism: { name: 'PRISM QUEEN', d: 0.64, eye: [2.6, 3.2], atk: ['beam', 'shards', 'spawn', 'beam'], p2: ['beam', 'shards', 'beam', 'spawn'], spawn: ['hopper', 'hopper', 'mirror'] },
  singularity: { name: 'SINGULARITY ENGINE', d: 0.66, armour: [1, 1, 0], segHP: 4, rot: [0.6, 0.9], atk: ['volley', 'sweep', 'spawn', 'volley'], p2: ['pull', 'volley', 'spawn', 'pull'], p3: ['volley', 'sweep', 'volley'], spawn: ['hopper', 'mite', 'mirror'], rise: 0.035 },
};
export const BOSS_KEYS = Object.keys(BOSSES);

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { web: 1000, webStep: 250, dive: 500, boss: 5000, sector: 2500, rimKill: 50, bolt: 25, spine: 10, lifeEvery: 80000 };
export const START_LIVES = 3;

// difficulty levels: each scales the RAMP, has its own boards and a score multiplier.
// Easy is the template's gentle slow start; warnings never drop below MIN_WARN.
export const MIN_WARN = 0.45;
export const DIFFICULTY = {
  easy: { label: 'EASY', desc: 'A gentle start: slower climbers, fewer at once, long warnings, an extra Rimrunner', spd: 0.72, count: 0.75, active: 0.6, gap: 1.35, warn: 1.6, flip: 1.4, grab: 1.5, fire: 0.6, boltV: 0.8, shock: 1.4, boss: 0.7, bossRate: 0.75, hp: -1, lives: 1, drops: 1.4, score: 0.6 },
  normal: { label: 'NORMAL', desc: 'Medium pace from the first web, then it ramps up', spd: 1, count: 1, active: 1, gap: 1, warn: 1, flip: 1, grab: 1, fire: 1, boltV: 1, shock: 1, boss: 1, bossRate: 1, lives: 0, drops: 1, score: 1 },
  hard: { label: 'HARD', desc: 'Faster climbers, a busier web, shorter warnings', spd: 1.1, count: 1.12, active: 1.2, gap: 0.88, warn: 0.85, flip: 0.9, grab: 0.95, fire: 1.2, boltV: 1.1, shock: 0.85, boss: 1.1, bossRate: 1.05, lives: 0, drops: 0.85, score: 1.5 },
  nightmare: { label: 'NIGHTMARE', desc: 'For experts: everything at full tilt, one Rimrunner fewer', spd: 1.15, count: 1.3, active: 1.45, gap: 0.75, warn: 0.78, flip: 0.85, grab: 0.9, fire: 1.5, boltV: 1.22, shock: 0.72, boss: 1.25, bossRate: 1.15, lives: -1, drops: 0.7, score: 2.2 },
};
export const DIFF_KEYS = Object.keys(DIFFICULTY);
export function applyDiff(R, key) {
  const d = DIFFICULTY[key] || DIFFICULTY.normal;
  if (d === DIFFICULTY.normal) return { ...R };
  return { ...R, spd: R.spd * d.spd, count: Math.max(3, Math.round(R.count * d.count)), active: Math.max(2, Math.round(R.active * d.active)), gap: R.gap * d.gap,
    warn: Math.max(MIN_WARN, R.warn * d.warn), flip: R.flip * d.flip, grab: Math.max(0.06, R.grab * d.grab), fire: R.fire * d.fire, boltV: R.boltV * d.boltV, shock: R.shock * d.shock,
    hpS: Math.max(0, R.hpS + (d.hp || 0)), hpB: Math.max(0, R.hpB + (d.hp || 0)), bossHP: Math.round(R.bossHP * d.boss), bossRate: R.bossRate * d.bossRate };
}

// ------------------------------------------------------------------ power-ups (pods float up their lane; be in the lane when one reaches the rim)
export const POWERUPS = {
  twin: { name: 'TWIN SHOT', glyph: '‖', color: 0x8fe4ff, time: 12, w: 10, desc: 'Two bolts straddle your lane: double damage, and they hit arc mites on its borders' },
  rapid: { name: 'RAPID FIRE', glyph: '»', color: 0xffd23f, time: 10, w: 10, desc: 'Twice the fire rate, more shots in flight' },
  droid: { name: 'GUARD DROID', glyph: '◈', color: 0x7dff9a, time: 0, w: 6, desc: 'A droid holds the lane you are in, firing down it and zapping riders' },
  hop: { name: 'HOP', glyph: '⤒', color: 0xd6a6ff, time: 0, w: 7, desc: '+2 hops: jump clear of the rim over grabs, bolts and shocks' },
};
export const PW_KEYS = Object.keys(POWERUPS);
// chance per kill (tough enemies more), at most this many pods at once
export const DROP = { chance: 0.07, big: 0.12, max: 2, firstWeb: 7 };

export const UPGRADES = {
  barrel: { name: 'LONG BARREL', icon: '═', color: '#8fe4ff', max: 2, desc: 'Faster shots that hit harder (level 2 pierces one enemy)' },
  rate: { name: 'FIRE RATE', icon: '»', color: '#ffb347', max: 3, desc: 'Fire faster, more shots in flight' },
  plate: { name: 'SHIELD PLATE', icon: '⛨', color: '#5fd0ff', max: 1, desc: 'A plate soaks one hit, and it is refitted on every web' },
  purge: { name: 'EXTRA PURGE', icon: '✺', color: '#d7a6ff', max: 2, desc: '+1 partial PURGE every web' },
  droid: { name: 'GUARD DROID', icon: '◈', color: '#7dff9a', max: 1, desc: 'Start every web with a guard droid in your lane' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [500, 1100, 1900];
// salvage for the shop: a share of the sector's score plus a bonus per new medal (buys about what TYPICAL_UP assumes)
export const SALVAGE_DIV = 30, SALVAGE_MEDAL = 250;
export const salvageFor = (pts, medalsGot) => Math.max(0, Math.floor(pts / SALVAGE_DIV)) + SALVAGE_MEDAL * medalsGot;
// the order the AI PLAYTHROUGH (and autopilot_check.mjs) buys upgrades in
export const AI_SHOP = ['rate', 'plate', 'barrel', 'purge', 'rate', 'droid', 'barrel', 'rate', 'purge'];

// par times per sector (four webs, the dives and the boss): about the sharp demo autopilot's median (scripts/rimstorm/medal_check.mjs; re-measure after ramp changes)
const PAR = [181, 193, 184, 206, 179];
// DEAD EYE: share of shots that hit something (climbers, boss parts, bolts, spines)
export const AIM_MEDAL = 0.55;
export const parTime = (i) => PAR[i];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  MEDALS.push({ id: `s${i}clean`, sector: i, name: 'UNBROKEN', desc: `Clear ${s.name} without losing a Rimrunner` });
  MEDALS.push({ id: `s${i}aim`, sector: i, name: 'DEAD EYE', desc: `Clear the sector with ${Math.round(AIM_MEDAL * 100)}% of your shots hitting` });
  MEDALS.push({ id: `s${i}par`, sector: i, name: 'QUICKSILVER', desc: `Clear the sector under par (${PAR[i]} s)` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  { rate: 1 },
  { rate: 1, plate: 1, barrel: 1 },
  { rate: 2, plate: 1, barrel: 1, purge: 1 },
  { rate: 2, plate: 1, barrel: 2, purge: 1, droid: 1 },
];

// ------------------------------------------------------------------ geometry shared by sim and renderer
// the lane count and topology of a web definition
export const webInfo = (def) => { const S = SHAPES[def.shape] || SHAPES.circle; return { closed: S.closed, n: S.n }; };
