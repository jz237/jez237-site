// Berserk 2026 — every tunable number lives here. The RAMP table drives difficulty; nothing else in the
// game hard-codes robot pace, numbers, fire rate, aim, bolt speed, Seeker timing or warning time.
export const VERSION = '1.3.1';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ the facility and the infiltrator
// World units are metres on the XZ plane. Screen up is -z. A room's floor is x in [-RW, RW], z in [-RH, RH];
// its electrified outer walls sit just outside that, with a door gap (`door` wide) in the middle of a side
// that leads somewhere. A sector is a grid of `cols` x `rows` rooms.
export const ROOM = { RW: 14, RH: 8.5, wallT: 0.5, inT: 0.45, door: 3.4, cols: 5, rows: 4, cell: 0.5, entryIn: 1.7, spawnFar: 7.5 };   // spawnFar: robots start at least this far from the door you came in by
export const F = {
  r: 0.42,               // infiltrator radius
  speed: 5.4,            // run speed, m/s
  accel: 34,             // how quickly the suit reaches the speed you ask for
  plantSlow: 0,          // move speed while the feet are planted (hold fire)
  fireCD: 0.24,          // seconds between shots (PULSE CARBINE and RAPID FIRE cut it)
  maxShots: 3,           // shots of yours in the air at once
  shotV: 24, shotLife: 0.9, shotR: 0.13, spread: 0.2,
  dashV: 15, dashT: 0.17, dashCD: [0, 2.2, 1.4],   // DASH JETS levels 0/1/2
  empR: 7.5,             // EMP: robots and bolts inside this are wiped, bosses take empBoss and flinch
  empBoss: 5,
  inv: 2.0,              // invulnerable after a respawn
  hitInv: 1.1,           // after an overshield or a plate soaks a hit
  respawn: 1.5,          // seconds before you come back at the room's entry
  clearR: 6.5,           // robots near the entry are pushed this far away when you respawn
  brush: 0.28,           // closer than this to a wall throws sparks
  liftR: 1.6,            // stand on the lift pad this long to ride it up
  liftHold: 0.5,
};

// ------------------------------------------------------------------ sectors and their looks
export const SECTORS = [
  { key: 'labs', name: 'RESEARCH LABS', boss: 'sentinel', music: 's1' },
  { key: 'cryo', name: 'CRYO VAULT', boss: 'carrier', music: 's2' },
  { key: 'foundry', name: 'THE FOUNDRY', boss: 'crusher', music: 's3' },
  { key: 'server', name: 'SERVER CORE', boss: 'hydra', music: 's4' },
  { key: 'reactor', name: 'REACTOR DEPTHS', boss: 'overseer', music: 's5' },
];

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Each sector row gives [value in its first room, value in its last room before the lift]; the game
// interpolates room by room and each sector starts where the last one ended. The endless mode walks the
// same curve over many rooms (see endlessLevel).
//   rooms   rooms on the route from the arrival lift to the boss lift (the lift room is that far away)
//   count   robots in a room
//   shoot   how many robots may be aiming or firing at the same moment
//   fire    bolts per second for a robot that is allowed to fire (classes scale it)
//   boltV   bolt speed, m/s (you run at 5.4)
//   lead    how much robots lead a moving target (0 = aim where you are, 1 = where you will be)
//   aim     aim error, radians
//   warn    every telegraph: a robot's aim glint before it fires, mortar landing rings, ripper crouch, boss tells
//   boot    seconds the robots stay powered down after you walk in
//   first   seconds after powering up before a robot may start its first aim (scattered 0.35x-1.3x)
//   burst   bolts per shot (2.3 = two, a 30% chance of a third), fanned BURST_A apart; marksmen fire one
//   reinf   reinforcements per room as a share of count: they warp in (powered down) far from you while
//           fewer than REINF.below x count robots are left, one every REINF.every seconds
//   spd     robot walk speed multiplier
//   smart   chance a robot checks for a wall before it walks into one (the rest can be lured into walls)
//   walls   how cluttered the rooms are with electrified barriers
//   seek    seconds in a room before the SEEKER arrives (SEEKER JAMMER adds)
//   seekV   the SEEKER's speed when it first arrives; every return in a sector is 12% faster
//   drops   chance a destroyed robot leaves a power-up
//   bossHP  boss armour (hits); bossRate scales how often it attacks
//   mix     which robots can turn up and how often
export const RAMP = [
  { rooms: 5, count: [10, 12], shoot: [2.5, 3], fire: [1.1, 1.25], boltV: [8.0, 8.8], lead: [0.25, 0.4], aim: [0.085, 0.07], warn: [1.2, 1.1], boot: [1.0, 0.9], first: [0.5, 0.45], burst: [1.5, 1.8], reinf: [0.3, 0.35],
    spd: [0.95, 1.02], smart: [0.45, 0.5], walls: [0.55, 0.65], seek: [24, 22], seekV: [2.4, 2.6], drops: [0.09, 0.085], bossHP: 70, bossRate: 1.6,
    mix: { sentry: 1, patroller: 0.55, twin: 0.2 } },
  { rooms: 5, count: [12, 14], shoot: [3.2, 3.5], fire: [1.25, 1.35], boltV: [8.8, 9.2], lead: [0.4, 0.45], aim: [0.07, 0.065], warn: [1.08, 0.97], boot: [0.9, 0.85], first: [0.45, 0.42], burst: [2.1, 2.25], reinf: [0.35, 0.38],
    spd: [1.02, 1.08], smart: [0.5, 0.55], walls: [0.65, 0.72], seek: [22, 20], seekV: [2.6, 2.8], drops: [0.085, 0.08], bossHP: 80, bossRate: 0.9,
    mix: { sentry: 0.8, patroller: 0.7, marksman: 0.45, twin: 0.3, ripper: 0.25 } },
  { rooms: 6, count: [14, 14], shoot: [3.5, 3.6], fire: [1.35, 1.45], boltV: [9.2, 9.6], lead: [0.45, 0.5], aim: [0.065, 0.06], warn: [0.95, 0.85], boot: [0.85, 0.8], first: [0.42, 0.38], burst: [2.55, 2.55], reinf: [0.4, 0.44],
    spd: [1.08, 1.14], smart: [0.55, 0.62], walls: [0.72, 0.8], seek: [20, 18], seekV: [2.8, 3.0], drops: [0.08, 0.075], bossHP: 115, bossRate: 1.35,
    mix: { sentry: 0.5, patroller: 0.7, marksman: 0.5, aegis: 0.4, mortar: 0.3, ripper: 0.35, twin: 0.3 } },
  { rooms: 6, count: [14, 15], shoot: [3.6, 3.8], fire: [1.45, 1.55], boltV: [9.6, 9.7], lead: [0.5, 0.5], aim: [0.06, 0.055], warn: [0.84, 0.74], boot: [0.8, 0.76], first: [0.38, 0.34], burst: [2.4, 2.4], reinf: [0.42, 0.45],
    spd: [1.14, 1.2], smart: [0.62, 0.72], walls: [0.8, 0.88], seek: [18, 16.5], seekV: [3.0, 3.2], drops: [0.075, 0.07], bossHP: 120, bossRate: 1.3,
    mix: { sentry: 0.35, patroller: 0.7, marksman: 0.6, aegis: 0.45, mortar: 0.35, ripper: 0.45, twin: 0.4 } },
  { rooms: 7, count: [15, 15], shoot: [3.8, 3.9], fire: [1.55, 1.6], boltV: [9.7, 9.7], lead: [0.5, 0.5], aim: [0.055, 0.05], warn: [0.72, 0.6], boot: [0.76, 0.7], first: [0.34, 0.3], burst: [2.0, 1.8], reinf: [0.25, 0.25],
    spd: [1.2, 1.24], smart: [0.72, 0.85], walls: [0.88, 0.95], seek: [16.5, 15], seekV: [3.2, 3.5], drops: [0.07, 0.065], bossHP: 120, bossRate: 0.7,
    mix: { sentry: 0.25, patroller: 0.7, marksman: 0.7, aegis: 0.5, mortar: 0.45, ripper: 0.5, twin: 0.45 } },
];
export const BURST_A = 0.14;
export const REINF = { after: 2.0, every: 1.1, below: 0.55, min: 3 };
const RAMP_KEYS = ['burst', 'reinf', 'count', 'shoot', 'fire', 'boltV', 'lead', 'aim', 'warn', 'boot', 'first', 'spd', 'smart', 'walls', 'seek', 'seekV', 'drops'];

// the difficulty values in room `w` (0-based, counted from the arrival room) of sector `s`
export function rampAt(s, w) {
  const row = RAMP[s];
  const f = Math.max(0, Math.min(1, w / Math.max(1, row.rooms - 1)));
  const out = { sector: s, room: w, f, rooms: row.rooms, bossHP: row.bossHP, bossRate: row.bossRate, mix: row.mix };
  for (const k of RAMP_KEYS) out[k] = row[k][0] + (row[k][1] - row[k][0]) * f;
  out.countF = out.count;   // the sim rolls the fraction (spawnRobots), so the count climbs smoothly, not in whole steps
  out.count = Math.round(out.count);
  return out;
}
// when each robot first turns up in the campaign: [sector, room]
export const INTRO = { sentry: [0, 0], patroller: [0, 1], twin: [0, 3], marksman: [1, 0], ripper: [1, 2], aegis: [2, 0], mortar: [2, 2] };
export const introduced = (type, s, w) => { const q = INTRO[type]; return !q || s > q[0] || (s === q[0] && w >= q[1]); };

// ENDLESS FACILITY: level 0 = sector 1's first room, 5 = sector 5's last, reached after ~66 rooms (about 11 floors).
// The free upgrade per floor comes in the order weapon, dash, EMP, plate, jammer (sim finishLift), so the
// curve keeps rising: a plate soaks bolts and arrives around the sector-3 level, as in the campaign.
// Each floor has a lift `rooms` away and a boss guarding it; the look changes every floor.
export const ENDLESS = { rooms: 5, full: 66, start: 0.12, pow: 1.0 };
export function endlessLevel(depth) {
  return Math.min(4.999, ENDLESS.start + (4.999 - ENDLESS.start) * Math.pow(Math.min(1, depth / ENDLESS.full), ENDLESS.pow));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level));
  const row = RAMP[s];
  const r = rampAt(s, (level - s) * (row.rooms - 1));
  r.rooms = ENDLESS.rooms;
  return r;
}

// ------------------------------------------------------------------ robots
// r radius, hp, v walk speed at spd 1, score, fire = fire-rate factor (0 = no gun), tellK/boltK scale the
// aim glint and bolt speed, smart = added to the RAMP's wall sense
export const ENEMY = {
  sentry: { name: 'SENTRY', r: 0.5, hp: 1, v: 1.55, score: 50, fire: 1, range: 17, tellK: 1, boltK: 1, smart: -0.15, grid: 1 },
  patroller: { name: 'PATROLLER', r: 0.5, hp: 1, v: 2.5, score: 100, fire: 0.9, range: 15, tellK: 1, boltK: 1, smart: 0.1, sight: 11, grid: 1 },
  marksman: { name: 'MARKSMAN', r: 0.48, hp: 1, v: 1.5, score: 150, fire: 0.85, range: 22, tellK: 1.25, boltK: 1.2, smart: 0.25, lead: 0.85, keep: [8, 13], single: 1 },
  aegis: { name: 'AEGIS', r: 0.64, hp: 2, v: 1.25, score: 200, fire: 0.8, range: 16, tellK: 1.1, boltK: 0.95, smart: 0.3, arc: 1.05, turn: 1.3 },
  mortar: { name: 'MORTAR', r: 0.62, hp: 2, v: 0.9, score: 200, fire: 0.5, range: 18, tellK: 1, boltK: 1, smart: 0.4, flight: 1.15, mineR: 1.8, sense: 1.3, fuse: 0.5, mineLife: 7 },
  ripper: { name: 'RIPPER', r: 0.46, hp: 1, v: 3.2, score: 150, fire: 0, range: 6, tellK: 1, boltK: 1, smart: 0.5, lunge: 11, lungeT: 0.6, rest: 1.1 },
  twin: { name: 'TWIN UNIT', r: 0.42, hp: 1, v: 2.1, score: 120, fire: 1, range: 16, tellK: 1, boltK: 1, smart: 0.05, gap: 1.35, rage: 1.45, grid: 1 },
  drone: { name: 'DRONE', r: 0.36, hp: 1, v: 3.0, score: 40, fire: 0, range: 0, tellK: 1, boltK: 1, smart: 1, turn: 2.2, life: 10, fly: 1 },
};
export const ENEMY_KEYS = Object.keys(ENEMY);
// the Seeker: an invulnerable orb that comes for anyone who lingers
export const SEEKER = { r: 0.8, inT: 1.4, warnT: 2.5, turn: 2.6, returnK: 0.12, maxK: 0.93 };

// ------------------------------------------------------------------ bosses
// One per sector, in the lift room. `atk` holds one attack list per phase; `mod` the boss's own numbers for
// a shared ATTACK (merged over it); `phases` the armour fractions
// where each phase starts. heads: turret heads that shield the core until they are down. plates: rotating
// armour plates that block shots (the core is open between them).
export const BOSSES = {
  sentinel: { name: 'SENTINEL MK IV', r: 1.8, v: 1.3, keep: 7, phases: [1, 0.5], atk: [['volley', 'stomp', 'volley', 'sweep', 'summon'], ['volley', 'charge', 'volley', 'sweep', 'stomp', 'summon']],
    mod: { volley: { waves: 3, act: 0.7 }, summon: { n: 3 } } },
  carrier: { name: 'CRYO CARRIER', r: 2.0, v: 1.1, keep: 8, fly: 1, phases: [1, 0.5], atk: [['drones', 'frost', 'volley'], ['drones', 'frost', 'sweep', 'volley', 'frost']] },
  crusher: { name: 'FURNACE CRUSHER', r: 2.2, v: 0.9, keep: 6, phases: [1, 0.5], atk: [['slam', 'pools', 'spray'], ['slam', 'charge', 'pools', 'spray', 'slam']],
    mod: { slam: { n: 3 }, pools: { n: 6, r: 2.0 } } },
  hydra: { name: 'DATA-CORE HYDRA', r: 2.0, v: 0, keep: 0, heads: 4, headHP: 8, phases: [1, 0.5], atk: [['volley', 'spiral', 'summon'], ['sweep', 'spiral', 'volley', 'summon']] },
  overseer: { name: 'CUSTODIAN CORE', r: 2.3, v: 0.5, keep: 0, plates: 2, plateArc: 0.5, phases: [1, 0.66, 0.33], atk: [['spiral', 'volley', 'pools'], ['sweep', 'summon', 'slam', 'volley'], ['storm', 'charge', 'spiral', 'sweep', 'storm']] },
};
export const BOSS_KEYS = Object.keys(BOSSES);
// attack timings, in units of the RAMP's warn (tell) and seconds (act)
export const ATTACK = {
  volley: { tellK: 1.1, act: 0.5, n: 5, nPh: 2, fan: 0.9, waves: 2, v: 0.95, lock: 0.3 },   // lock: aims at where you were for the last 30% of the tell
  spiral: { tellK: 1.0, act: 3.0, every: 0.16, arms: 3, turn: 1.8, v: 0.75 },
  sweep: { tellK: 1.3, act: 2.3, arc: 1.6, len: 32, w: 0.35 },   // the beam stops at pillars; ~0.7 rad/s, so you can outrun it close in
  stomp: { tellK: 1.2, act: 0.3, r: 5.5 },
  slam: { tellK: 1.2, act: 0.35, n: 2, w: 2.8, gap: 1.75, len: 11 },   // gap: lane spacing in lane widths
  pools: { tellK: 1.25, act: 3.0, n: 4, r: 1.7 },
  frost: { tellK: 1.2, act: 0.3, n: 4, r: 1.9, slow: 4.0 },
  storm: { tellK: 1.0, act: 0.35, n: 6, r: 1.5 },
  charge: { tellK: 1.3, act: 1.6, v: 13, w: 2.2 },
  summon: { tellK: 1.0, act: 0.2, n: 2 },
  drones: { tellK: 1.0, act: 0.2, n: 3 },
  spray: { tellK: 1.0, act: 1.2, every: 0.09, fan: 1.2, v: 0.7, lock: 0.3 },
};

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { clearPer: 30, boss: 5000, sector: 2500, lifeEvery: 15000, friendly: 1 };
// salvage for the shop = points scored in the sector / SALVAGE (a typical NORMAL run then owns about TYPICAL_UP)
export const SALVAGE = 25;
export const START_LIVES = 3;
// suit colourways for your infiltrator (presentation only: the sim never reads them), unlocked by medals earned;
// SLATE is always open. `tint` multiplies the suit's painted parts (linear RGB, so the armour plates take the
// colour), `accent` relights the visor, power cell, muzzle and status strips, `color` is the swatch in OPTIONS.
// No red or amber: that is the co-op partner's suit.
export const SUITS = [
  { key: 'slate', name: 'SLATE', color: 0x3d4a5c, accent: 0x6fe3ff, tint: [1, 1, 1], medals: 0 },
  { key: 'graphite', name: 'GRAPHITE', color: 0x55595f, accent: 0xc8f4ff, tint: [0.36, 0.37, 0.4], medals: 2 },
  { key: 'verdant', name: 'VERDANT', color: 0x8fd0a0, accent: 0x7dffa0, tint: [0.5, 1, 0.6], medals: 4 },
  { key: 'cobalt', name: 'COBALT', color: 0x6f9ee8, accent: 0x8fb4ff, tint: [0.42, 0.62, 1.25], medals: 6 },
  { key: 'violet', name: 'VIOLET', color: 0xb98ae0, accent: 0xd890ff, tint: [0.85, 0.48, 1.15], medals: 9 },
  { key: 'gilded', name: 'GILDED', color: 0xe0c070, accent: 0xffe89a, tint: [1.12, 0.86, 0.38], medals: 12 },
];

// ------------------------------------------------------------------ difficulty levels
// Each level scales the RAMP, so every level still builds up room by room, and has its own boards.
// Warnings never drop below MIN_WARN. Easy is the gentle slow start: long warnings, one shooter at a
// time early on, and the first `grace` seconds of a run can't kill you (a hit just bounces you).
export const MIN_WARN = 0.45;
export const DIFFICULTY = {
  easy: { label: 'EASY', desc: 'A gentle start: slower robots, long warnings, one shooter at a time early, an extra life', spd: 0.82, fire: 0.6, count: 0.72, shoot: -1, lead: -0.1, aim: 1.5, boltV: 0.84, warn: 1.65, burst: 0.2, reinf: 0.5, seek: 10, boss: 0.75, bossRate: 0.75, lives: 1, drops: 1.4, grace: 30, score: 0.6, fade: 1, fadeP: 0.3 },
  normal: { label: 'NORMAL', desc: 'A real fight from the first room, building up step by step', spd: 1, fire: 1, count: 1, shoot: 0, lead: 0, aim: 1, boltV: 1, warn: 1, burst: 1, reinf: 1, seek: 0, boss: 1, bossRate: 1, lives: 0, drops: 1, grace: 0, score: 1, fade: 0 },
  hard: { label: 'HARD', desc: 'Faster, busier, sharper aim, shorter warnings', spd: 1.04, fire: 1.1, count: 1.05, shoot: 0.3, lead: 0.05, aim: 0.9, boltV: 1.04, warn: 0.9, burst: 1.05, reinf: 1.15, seek: -2, boss: 1.1, bossRate: 1.05, lives: 0, drops: 0.85, grace: 0, score: 1.5, fade: 0.12 },
  nightmare: { label: 'NIGHTMARE', desc: 'For experts: everything at full tilt, one life fewer', spd: 1.1, fire: 1.2, count: 1.08, shoot: 0.5, lead: 0.1, aim: 0.8, boltV: 1.06, warn: 0.88, burst: 1.05, reinf: 1.2, seek: -4, boss: 1.25, bossRate: 1.15, lives: -1, drops: 0.7, grace: 0, score: 2.2, fade: 0.3 },
};
export const DIFF_KEYS = Object.keys(DIFFICULTY);
// A level scales the RAMP: multipliers (spd, fire, count, aim, boltV, warn, boss, bossRate, drops), shifts (shoot,
// lead, seek) and `burst` / `reinf` scale the extra bolts and the reinforcements. `fade` pulls a level back toward
// NORMAL sector by sector (fade x (sector / 4) ^ fadeP; EASY: the gentle start in sector 1, nearer NORMAL by the Reactor).
export function applyDiff(R, key) {
  const d0 = DIFFICULTY[key] || DIFFICULTY.normal, k = (d0.fade || 0) * Math.pow(Math.min(1, (R.sector || 0) / 4), d0.fadeP || 1);
  const m = (q) => d0[q] + (1 - d0[q]) * k, a = (q) => d0[q] * (1 - k);
  const out = { ...R, spd: R.spd * m('spd'), fire: R.fire * m('fire'), count: Math.max(2, Math.round(R.count * m('count'))), countF: Math.max(2, (R.countF ?? R.count) * m('count')), shoot: Math.max(1, R.shoot + a('shoot')),
    lead: Math.max(0, Math.min(1, R.lead + a('lead'))), aim: R.aim * m('aim'), boltV: R.boltV * m('boltV'), warn: Math.max(MIN_WARN, R.warn * m('warn')),
    boot: Math.max(MIN_WARN, R.boot * Math.sqrt(m('warn'))), first: R.first / Math.sqrt(m('fire')), seek: Math.max(10, R.seek + a('seek')), drops: R.drops * m('drops'),
    burst: 1 + Math.max(0, (R.burst || 1) - 1) * m('burst'), reinf: (R.reinf || 0) * m('reinf'),
    bossHP: Math.round(R.bossHP * m('boss')), bossRate: R.bossRate * m('bossRate') };
  if (key === 'easy' && R.sector === 0) out.shoot = Math.min(out.shoot, 1 + R.f);
  return out;
}

// ------------------------------------------------------------------ power-ups dropped by robots
// time = seconds it lasts (0 = instant), w = how often it drops
export const POWERUPS = {
  rapid: { name: 'RAPID FIRE', glyph: '»', color: 0xffc24a, time: 10, w: 10, desc: 'Twice the fire rate, more shots in the air' },
  spread: { name: 'SPREAD', glyph: '⁂', color: 0x7fe8ff, time: 10, w: 8, desc: 'Three bolts in a fan' },
  ricochet: { name: 'RICOCHET ROUNDS', glyph: '⟲', color: 0xc9a2ff, time: 12, w: 7, desc: 'Shots bounce off walls twice' },
  overshield: { name: 'OVERSHIELD', glyph: '⬡', color: 0x6dffb0, time: 0, w: 6, desc: 'Soaks one hit, walls included' },
  emp: { name: 'EMP CELL', glyph: '✺', color: 0x8fb4ff, time: 0, w: 6, desc: '+1 EMP charge' },
};
export const PW_KEYS = Object.keys(POWERUPS);
export const DROP = { big: 1.8, life: 12, max: 2, r: 0.9 };

export const UPGRADES = {
  weapon: { name: 'PULSE CARBINE', icon: '»', color: '#ffb347', max: 3, desc: 'Fires faster, one more shot in the air per level' },
  plate: { name: 'ARMOUR PLATE', icon: '⛨', color: '#5fd0ff', max: 2, desc: 'Soaks one bolt in every room (per level)' },
  dash: { name: 'DASH JETS', icon: '➤', color: '#9dff7a', max: 2, desc: 'A quick dash that slips through bolts (level 2: shorter cooldown)' },
  emp: { name: 'EMP CHARGES', icon: '✺', color: '#a8b8ff', max: 2, desc: '+1 EMP charge at every lift, and you can carry one more' },
  jammer: { name: 'SEEKER JAMMER', icon: '◎', color: '#ff7ab0', max: 2, desc: 'The Seeker takes 4 s longer to find you' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [400, 900, 1600];
export const fireCDOf = (lv) => F.fireCD * [1, 0.85, 0.73, 0.63][lv || 0];
export const empMax = (up) => 2 + (up.emp || 0);
export const empStart = (up) => 1 + (up.emp || 0);

// par times: the route plus the boss, with some slack
const PAR = [170, 185, 220, 235, 280];
export const parTime = (i) => PAR[i];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  MEDALS.push({ id: `s${i}clean`, sector: i, name: 'GHOST', desc: `Clear ${s.name} without losing a life` });
  MEDALS.push({ id: `s${i}sweep`, sector: i, name: 'SWEEPER', desc: 'Destroy every robot in every room on the way to the lift' });
  MEDALS.push({ id: `s${i}par`, sector: i, name: 'SWIFT', desc: `Ride the lift out under par (${PAR[i]} s)` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  { weapon: 1 },
  { weapon: 1, plate: 1, dash: 1 },
  { weapon: 2, plate: 1, dash: 1, emp: 1 },
  { weapon: 2, plate: 1, dash: 1, emp: 1, jammer: 1 },
];
