// Swarmbreak — every tunable number lives here. The RAMP table drives difficulty; nothing else in the
// game hard-codes enemy pace, numbers, spacing, fire rate, aim or warning time.
export const VERSION = '1.3.0';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ the arena and the Warden
// World units are metres on the XZ plane. Screen up is -z. The arena is x in [-AW, AW], z in [-AH, AH].
export const F = {
  AW: 22, AH: 13,
  r: 0.55,               // Warden radius
  speed: 6.0,            // run speed, m/s (SERVOS adds 9% a level)
  accel: 15,             // how quickly the suit reaches the speed you ask for
  fireCD: 0.15,          // seconds between shots (RAPID EMITTER cuts it)
  shotV: 30, shotLife: 0.55, shotR: 0.18,
  spread: 0.2,           // radians between spread shots
  pulseR: 6.2,           // PULSE: kills small machines and bolts inside this, shoves the rest
  pulseShove: 9,
  inv: 2.4,              // invulnerable after a respawn
  hitInv: 1.3,           // after a shield takes a hit
  respawn: 1.7,          // seconds before you come back
  clearR: 7.5,           // machines are thrown clear of the respawn point
  rescueR: 1.15,         // walk this close to a survivor to bring them in (TRACTOR adds)
};

// gates: where machines come in (portals in the arena wall), in arena coordinates
export const GATES = (() => {
  const g = [], { AW, AH } = F;
  for (const x of [-0.62, -0.2, 0.2, 0.62]) { g.push([x * AW, -AH + 0.6]); g.push([x * AW, AH - 0.6]); }
  for (const z of [-0.45, 0, 0.45]) { g.push([-AW + 0.6, z * AH]); g.push([AW - 0.6, z * AH]); }
  return g;
})();

// ------------------------------------------------------------------ sectors and their looks
export const SECTORS = [
  { key: 'roof', name: 'ROOFTOP GARDENS', boss: 'foreman', music: 's1' },
  { key: 'metro', name: 'FLOODED METRO', boss: 'tramline', music: 's2' },
  { key: 'foundry', name: 'FOUNDRY FLOOR', boss: 'crucible', music: 's3' },
  { key: 'vault', name: 'DATA VAULT', boss: 'archivist', music: 's4' },
  { key: 'reactor', name: 'STORM REACTOR', boss: 'overseer', music: 's5' },
];
export const WAVES = 5;   // waves per sector, then the boss

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Each sector row gives [value at its first wave, value at its last]; the game interpolates wave by
// wave, and each sector starts where the last one ended. Last Stand walks the same curve over many
// minutes (see standLevel).
//   spd      machine speed multiplier (crawlers walk at 3 m/s x this)
//   count    machines per wave (not counting darts a hive makes or splitter halves)
//   gap      seconds between spawn groups
//   group    largest spawn group (sector 1 sends machines one at a time)
//   warn     seconds a gate glows before machines step out, and the length of every attack's tell
//   fire     spitter bolts per second (each)
//   aim      spitter aim error, radians
//   boltV    bolt speed, m/s
//   burst    share of the wave that pours in at the start, through several gates at once
//   haz      seconds between sector hazards (0 = none): metro surges, foundry spills, vault lasers, reactor lightning
//   mimic    machines disguised as survivors in each wave (once mimics are introduced)
//   rush     how much faster the machines get the longer a wave drags on (reached after 60 s)
//   wander   how much crawlers wander instead of chasing (early ones mostly wander)
//   surv     survivors in each wave
//   combo    chance a pylon pair is wired with an arc (sector 3+ only), and of mixed groups
//   shield   shield charges refilled at each wave (rounded)
//   pulse    PULSE charges refilled at each wave (rounded)
//   bossHP   boss armour; bossRate scales how often it attacks
//   mix      which machines can come and how often
export const RAMP = [
  { spd: [0.52, 0.62], count: [6, 10], gap: [3.4, 2.7], group: [1, 2], warn: [2.4, 2.1], fire: [0.16, 0.22], aim: [0.34, 0.28], boltV: [4.6, 5.0],
    mimic: [0, 0], haz: [0, 0], burst: [0, 0], rush: [0.08, 0.14], wander: [0.75, 0.55], surv: [4, 5], combo: [0, 0], shield: [1, 1], pulse: [2, 2], bossHP: 190, bossRate: 0.42,
    mix: { crawler: 1, spitter: 0.3, brute: 0.14 } },
  { spd: [0.66, 0.84], count: [13, 18], gap: [2.4, 2.0], group: [2, 3], warn: [2.05, 1.75], fire: [0.32, 0.46], aim: [0.25, 0.19], boltV: [5.5, 6.6],
    mimic: [0, 0], haz: [17, 13], burst: [0.15, 0.25], rush: [0.15, 0.22], wander: [0.52, 0.42], surv: [5, 6], combo: [0, 0], shield: [1, 0], pulse: [1, 1], bossHP: 260, bossRate: 0.3,
    mix: { crawler: 1, spitter: 0.4, brute: 0.2, hive: 0.14, pylon: 0.2, leaper: 0.16 } },
  { spd: [0.88, 1.03], count: [22, 27], gap: [1.75, 1.5], group: [3, 4], warn: [1.7, 1.4], fire: [0.5, 0.56], aim: [0.17, 0.14], boltV: [7.0, 7.7],
    mimic: [0, 1], haz: [15, 11], burst: [0.3, 0.36], rush: [0.3, 0.36], wander: [0.4, 0.32], surv: [6, 6], combo: [0.25, 0.4], shield: [0, 0], pulse: [1, 1], bossHP: 380, bossRate: 0.56,
    mix: { crawler: 1, spitter: 0.8, brute: 0.24, hive: 0.2, pylon: 0.24, leaper: 0.22, bulwark: 0.2 } },
  { spd: [1.03, 1.12], count: [27, 33], gap: [1.55, 1.3], group: [4, 5], warn: [1.36, 1.1], fire: [0.56, 0.6], aim: [0.14, 0.12], boltV: [7.7, 8.3],
    mimic: [1, 1], haz: [13, 10], burst: [0.36, 0.4], rush: [0.36, 0.4], wander: [0.3, 0.24], surv: [6, 7], combo: [0.4, 0.45], shield: [0, 0], pulse: [1, 1], bossHP: 400, bossRate: 0.25,
    mix: { crawler: 1, spitter: 0.65, brute: 0.26, hive: 0.2, pylon: 0.26, splitter: 0.3, leaper: 0.26, bulwark: 0.24 } },
  { spd: [1.15, 1.28], count: [36, 42], gap: [1.25, 1.05], group: [5, 6], warn: [1.06, 0.7], fire: [0.62, 0.7], aim: [0.1, 0.07], boltV: [8.4, 9.2],
    mimic: [1, 1], haz: [11, 8], burst: [0.4, 0.45], rush: [0.4, 0.46], wander: [0.22, 0.14], surv: [7, 7], combo: [0.4, 0.48], shield: [0, 0], pulse: [1, 1], bossHP: 600, bossRate: 0.33,
    mix: { crawler: 1, spitter: 0.75, brute: 0.3, hive: 0.22, pylon: 0.3, splitter: 0.36, leaper: 0.22, bulwark: 0.2 } },
];
const RAMP_KEYS = ['spd', 'count', 'gap', 'group', 'warn', 'fire', 'aim', 'boltV', 'mimic', 'haz', 'burst', 'rush', 'wander', 'surv', 'combo'];

// the difficulty values at wave `w` of sector `s` (both 0-based)
export function rampAt(s, w) {
  const row = RAMP[s];
  const f = Math.max(0, Math.min(1, w / (WAVES - 1)));
  const lerp = (a) => a[0] + (a[1] - a[0]) * f;
  const out = { sector: s, wave: w, shield: Math.round(lerp(row.shield)), pulse: Math.round(lerp(row.pulse)), bossHP: row.bossHP, bossRate: row.bossRate, mix: row.mix };
  for (const k of RAMP_KEYS) out[k] = lerp(row[k]);
  out.count = Math.round(out.count); out.group = Math.round(out.group); out.surv = Math.round(out.surv);
  return out;
}
// when each machine first appears in the campaign: [sector, wave] (a short tutorial line introduces it)
export const INTRO = { crawler: [0, 0], spitter: [0, 2], brute: [0, 3], hive: [1, 0], pylon: [1, 2], leaper: [1, 3], bulwark: [2, 0], mimic: [2, 2], splitter: [3, 0] };
export const introduced = (type, s, w) => { const q = INTRO[type]; return !q || s > q[0] || (s === q[0] && w >= q[1]); };

// Last Stand: level 0 = sector 1's first wave, 5 = sector 5's last, reached after ~16 minutes
export const STAND = { minutes: 16, startLevel: 0.1, lookEvery: 4, bossEvery: 6 };
export function standLevel(seconds) {
  const m = seconds / 60;
  return Math.min(5, STAND.startLevel + 4.9 * Math.pow(Math.min(1, m / STAND.minutes), 1.15));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level));
  const r = rampAt(s, Math.min(WAVES - 1, (level - s) * (WAVES - 1)));
  r.combo = s >= 2 ? r.combo : 0;
  r.shield = level < 1.6 ? 1 : 0;
  r.pulse = level < 1 ? 2 : 1;
  return r;
}

// ------------------------------------------------------------------ machines
// r radius, hp, v walk speed at spd 1, score
export const ENEMY = {
  dummy: { r: 0.55, hp: 1, v: 0, score: 50 },
  crawler: { r: 0.48, hp: 1, v: 3.0, score: 100 },
  brute: { r: 1.0, hp: 9, v: 1.75, score: 400, knock: 0.35 },
  spitter: { r: 0.6, hp: 3, v: 2.3, score: 250, range: [7, 11] },
  hive: { r: 1.05, hp: 7, v: 0.35, score: 500, every: 4.6, maxDarts: 3 },
  dart: { r: 0.34, hp: 1, v: 5.6, score: 50, turn: 1.9, life: 7.5 },
  pylon: { r: 0.42, hp: 1, v: 0, score: 25, arc: 7.5, on: 2.2, off: 2.6 },
  splitter: { r: 0.8, hp: 2, v: 2.7, score: 150 },
  shard: { r: 0.42, hp: 1, v: 3.9, score: 50 },
  // BULWARK: a riot shield blocks every shot from the front (arc = half-width in radians); it turns slowly
  bulwark: { r: 0.85, hp: 6, v: 1.9, score: 350, arc: 1.1, turn: 0.6, shield: 12 },   // shield = hits it soaks before breaking (+2 per sector)
  // LEAPER: crouches (marking where it will land), jumps, and hits everything in the splash circle
  leaper: { r: 0.55, hp: 2, v: 2.4, score: 300, range: 9, air: 0.6, splash: 1.35, rest: 1.1 },
  // MIMIC: looks like a survivor until a Warden comes within sense metres (or shoots it)
  mimic: { r: 0.5, hp: 2, v: 4.0, score: 400, sense: 2.4 },
};
export const HOSTILE = new Set(['crawler', 'brute', 'spitter', 'hive', 'dart', 'splitter', 'shard', 'bulwark', 'leaper', 'mimic']);   // a wave ends when these are gone (mimics only once revealed)

// bosses: one per sector. attacks run in turn; phase 2 (below half armour) adds the `p2` list
export const BOSSES = {
  foreman: { name: 'THE FOREMAN', r: 2.2, v: 1.1, atk: ['stomp', 'summon', 'stomp', 'fan'], p2: ['stomp', 'summon', 'fan', 'stomp'] },
  tramline: { name: 'TRAMLINE', r: 2.0, v: 0.9, atk: ['charge', 'summon', 'charge', 'fan'], p2: ['charge', 'fan', 'charge', 'stomp'] },
  crucible: { name: 'THE CRUCIBLE', r: 2.4, v: 0, atk: ['pools', 'spiral', 'pools', 'summon'], p2: ['pools', 'spiral', 'fan', 'pools'] },
  archivist: { name: 'THE ARCHIVIST', r: 2.0, v: 1.4, orbs: 3, atk: ['sweep', 'fan', 'summon', 'sweep'], p2: ['sweep', 'spiral', 'pools', 'sweep'] },
  overseer: { name: 'THE OVERSEER', r: 2.5, v: 1.0, orbs: 3, atk: ['stomp', 'charge', 'fan', 'pools', 'summon'], p2: ['sweep', 'charge', 'spiral', 'pools', 'stomp'] },
};
export const BOSS_KEYS = Object.keys(BOSSES);

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { rescue: 300, rescueMax: 1500, wave: 1000, timeBonus: 30, boss: 5000, sector: 2500, lifeEvery: 60000 };
export const START_LIVES = 3;
// kill streak: every STREAK.step kills in a row (no more than STREAK.gap seconds apart, no hits taken)
// adds +0.5 to the multiplier on kill points, up to STREAK.max
export const STREAK = { step: 6, gap: 2.6, max: 4 };
export const streakMul = (n) => Math.min(STREAK.max, 1 + Math.floor(n / STREAK.step) * 0.5);
// Warden suit colours, unlocked by medals
export const SUITS = [
  { key: 'cobalt', name: 'COBALT', color: 0x2f8cff, accent: 0x9fe8ff, medals: 0 },
  { key: 'crimson', name: 'CRIMSON', color: 0xd83a3a, accent: 0xffd27a, medals: 3 },
  { key: 'jade', name: 'JADE', color: 0x2fae6a, accent: 0xb8ffd8, medals: 6 },
  { key: 'gold', name: 'GOLD', color: 0xd8a62f, accent: 0xfff0b8, medals: 9 },
  { key: 'obsidian', name: 'OBSIDIAN', color: 0x2a2a33, accent: 0xff5ad0, medals: 12 },
  { key: 'arctic', name: 'ARCTIC', color: 0xe8eef4, accent: 0x7fd8ff, medals: 15 },
];

// ------------------------------------------------------------------ difficulty levels
// Each level scales the RAMP (so every level still starts gentle and builds up) and has its own
// high-score boards. Warnings never drop below MIN_WARN.
//   spd/fire/count/aim/boltV scale those RAMP values, warn scales every warning time, boss/bossRate scale
//   boss armour and attack rate, shield adds charges each wave, lives adds Wardens, drops scales power-ups,
//   score multiplies every point you earn
export const MIN_WARN = 0.5;
export const DIFFICULTY = {
  easy: { label: 'EASY', desc: 'Slower, fewer machines, longer warnings, an extra Warden and shield', spd: 0.84, fire: 0.62, count: 0.8, aim: 1.5, boltV: 0.85, warn: 1.25, boss: 0.75, bossRate: 0.75, shield: 1, lives: 1, drops: 1.4, score: 0.6 },
  normal: { label: 'NORMAL', desc: 'The intended challenge', spd: 1, fire: 1, count: 1, aim: 1, boltV: 1, warn: 1, boss: 1, bossRate: 1, shield: 0, lives: 0, drops: 1, score: 1 },
  hard: { label: 'HARD', desc: 'Faster, busier, sharper aim, shorter warnings', spd: 1.12, fire: 1.25, count: 1.1, aim: 0.7, boltV: 1.1, warn: 0.85, boss: 1.15, bossRate: 1.1, shield: 0, lives: 0, drops: 0.85, score: 1.5 },
  nightmare: { label: 'NIGHTMARE', desc: 'For experts: everything at full tilt, one Warden fewer', spd: 1.25, fire: 1.6, count: 1.3, aim: 0.5, boltV: 1.2, warn: 0.72, boss: 1.5, bossRate: 1.4, shield: 0, lives: -1, drops: 0.7, score: 2.2 },
};
export const DIFF_KEYS = Object.keys(DIFFICULTY);
export function applyDiff(R, key) {
  const d = DIFFICULTY[key] || DIFFICULTY.normal;
  if (d === DIFFICULTY.normal) return R;
  return { ...R, spd: R.spd * d.spd, fire: R.fire * d.fire, count: Math.max(1, Math.round(R.count * d.count)), aim: R.aim * d.aim, boltV: R.boltV * d.boltV,
    warn: Math.max(MIN_WARN, R.warn * d.warn), haz: R.haz / d.spd, bossHP: Math.round(R.bossHP * d.boss), bossRate: R.bossRate * d.bossRate, shield: R.shield + d.shield };
}

// ------------------------------------------------------------------ power-ups dropped in the arena
// time = seconds it lasts (0 = instant), w = how often it drops
export const POWERUPS = {
  triple: { name: 'TRIPLE BEAM', glyph: '⁂', color: 0x8fe4ff, time: 12, w: 10, desc: 'Three full-power beams' },
  overclock: { name: 'OVERCLOCK', glyph: '»', color: 0xffd23f, time: 10, w: 10, desc: 'Twice the fire rate' },
  rail: { name: 'RAIL LANCE', glyph: '⟿', color: 0xd6c2ff, time: 9, w: 7, desc: 'Piercing shots that hit for two' },
  seeker: { name: 'SEEKERS', glyph: '➶', color: 0xff8a3a, time: 10, w: 7, desc: 'Shots curve onto machines' },
  drone: { name: 'WINGMAN', glyph: '⟡', color: 0x7dff9a, time: 14, w: 6, desc: 'A drone that fires for you' },
  warp: { name: 'TIME WARP', glyph: '⧗', color: 0x8affff, time: 6, w: 5, desc: 'Machines and bolts slow right down' },
  barrier: { name: 'BARRIER', glyph: '⬡', color: 0x6ad8ff, time: 0, w: 7, desc: '+1 shield charge' },
  cell: { name: 'PULSE CELL', glyph: '✺', color: 0xd7a6ff, time: 0, w: 6, desc: '+1 PULSE charge' },
};
export const PW_KEYS = Object.keys(POWERUPS);
// drops: chance per kill (big machines more), a supply drop once per wave, how long they wait on the floor
export const DROP = { chance: 0.045, big: 0.3, supply: [9, 16], life: 13, max: 3, r: 1.05 };

export const UPGRADES = {
  rapid: { name: 'RAPID EMITTER', icon: '»', color: '#ffb347', max: 3, desc: 'Your blaster fires faster' },
  spread: { name: 'SPLIT BEAM', icon: '⁂', color: '#ff6f61', max: 2, desc: 'Extra shots fan out to the sides' },
  armor: { name: 'ARMOR CELL', icon: '⛨', color: '#5fd0ff', max: 2, desc: '+1 shield charge every wave' },
  servos: { name: 'SERVOS', icon: '➤', color: '#9dff7a', max: 2, desc: 'Run 9% faster' },
  pulse: { name: 'PULSE CORE', icon: '✺', color: '#d7a6ff', max: 2, desc: '+1 PULSE charge every wave' },
  tractor: { name: 'TRACTOR BEACON', icon: '◎', color: '#ffe08a', max: 1, desc: 'Survivors run to you, and you reach them from further away' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [400, 900, 1600];

// par times: about the waves plus the boss, with some slack
const PAR = [240, 260, 280, 300, 330];
export const parTime = (i) => PAR[i];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  MEDALS.push({ id: `s${i}clean`, sector: i, name: 'UNBROKEN', desc: `Clear ${s.name} without losing a Warden` });
  MEDALS.push({ id: `s${i}save`, sector: i, name: 'SHEPHERD', desc: 'Rescue 90% of the survivors in the sector' });
  MEDALS.push({ id: `s${i}par`, sector: i, name: 'ON THE CLOCK', desc: `Clear the sector under par (${PAR[i]} s)` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  { rapid: 1 },
  { rapid: 1, armor: 1, spread: 1 },
  { rapid: 2, armor: 1, spread: 1, servos: 1, pulse: 1 },
  { rapid: 2, armor: 1, spread: 2, servos: 1, pulse: 1, tractor: 1 },
];
