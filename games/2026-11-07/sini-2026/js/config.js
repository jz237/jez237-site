// Sini 2026 — every tunable number lives here. The RAMP table drives difficulty; nothing else in the game
// hard-codes enemy pace, numbers, fire rate, aim, warning times or how tough a construct is.
export const VERSION = '1.0.0';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ the field and the Prospector
// World units are metres on the XZ plane, screen up is -z. The field wraps round: x and z run from -H to H.
export const WS = 320, H = WS / 2;
export const F = {
  r: 1.25,             // ship radius
  vmax: 17,            // top speed, m/s (THRUSTERS add 8% a level)
  accel: 26,           // how hard the engines push, m/s^2
  turn: 7.5,           // how quickly the nose comes round to the stick, rad/s
  drag: 0.32,          // coasting drag with the stick let go (per second)
  fireCD: 0.15,        // seconds between cannon shots (RAPID CANNON cuts it)
  shotV: 62, shotLife: 0.6, shotR: 0.35,
  twinA: 0.16,         // radians between the side shots of TWIN CANNON / TWIN BLAST
  maxBombs: 20,        // NOVA CHARGES the rack holds
  bombCD: 0.42,
  bombV0: 14, bombV: 36, bombAcc: 34, bombTurn: 3.4, bombLife: 5.2, bombR: 0.9, bombSplash: 6,
  bombLock: 92,        // a charge locks onto the construct inside this range (else onto the nearest machine ahead)
  pickR: 1.9,          // fly this close to a crystal to scoop it (MAGNET adds)
  inv: 2.6,            // invulnerable after warping back in
  hitInv: 1.3,         // after the shield takes a hit
  respawn: 2.3,        // seconds before you warp back in
  safeR: 62,           // you warp back in at least this far from an awake construct
};

// rocks, crystals, machines
export const ROCK = { rMin: 3, rMax: 7.6, drift: 1.1, spin: 0.35, gap: 9, crystalLife: 14, crystalDrag: 0.85, respawnT: 22 };
export const ENEMY = {
  gath: { r: 0.95, hp: 1, accel: 16, score: 150, carryScore: 250, grab: 1.7 },
  reaver: { r: 1.25, hp: 3, accel: 22, score: 500, standoff: 19, range: 34, aggro: 95 },
};
// the boss of each sector: a construct fitted plate by plate from delivered crystals
//   R visual radius, hitR contact radius (fatal once awake)
export const CONSTRUCTS = {
  bastion: { name: 'THE BASTION', R: 6, hitR: 4.7 },
  corona: { name: 'THE CORONA', R: 6.3, hitR: 4.8 },
  anvil: { name: 'THE ANVIL', R: 6.4, hitR: 4.9 },
  pyre: { name: 'THE PYRE', R: 6.4, hitR: 4.9 },
  nadir: { name: 'THE NADIR', R: 6.6, hitR: 5.0 },
};
export const C_KEYS = Object.keys(CONSTRUCTS);

// ------------------------------------------------------------------ sectors and their looks
export const SECTORS = [
  { key: 'amber', name: 'AMBER DRIFT', boss: 'bastion', music: 's1' },
  { key: 'frost', name: 'FROST RING', boss: 'corona', music: 's2' },
  { key: 'iron', name: 'IRON SHOALS', boss: 'anvil', music: 's3' },
  { key: 'ember', name: 'EMBER VEIL', boss: 'pyre', music: 's4' },
  { key: 'void', name: 'VOID CROWN', boss: 'nadir', music: 's5' },
];
// checkpoints in every sector: 0 = the start, 1 = the construct half built, 2 = the construct awake
export const CP_NAMES = ['LAUNCH', 'HALF BUILT', 'AWAKE'];

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Each sector row gives [value at its first checkpoint, value at its last] where a pair is given; the game
// steps through it checkpoint by checkpoint (0, half, all of it), and each sector starts about where the
// last one ended. Single numbers hold for the whole sector. DEEP FIELD walks the same curve over many minutes.
//   reav     reavers in the field at once          engage  how many of them may attack you at once
//   rV       reaver speed, m/s                     fire    shots per second from each attacking reaver
//   warn     seconds a reaver's emitter glows before it fires (and every other tell scales from it)
//   aim      reaver aim error, radians             boltV   bolt speed, m/s
//   gath     gatherers in the field at once        gV      gatherer speed, m/s
//   regen    seconds between reinforcements warping in
//   selfT    seconds per plate the construct fits on its own (gatherers add one per crystal on top)
//   icpt     chance a nearby reaver goes for a charge in flight
//   shield   shield charges refilled at each checkpoint
//   pieces   plates in this sector's construct     kill    charges it takes to destroy it once awake
//   bossV    how fast the awake construct hunts    pull / pullEvery / pullTell   its tractor pull (m/s^2), how often, its warning
//   wakeT    seconds it spends waking (a warning) before the hunt starts
//   lunge    1 = it lunges (after a tell)          summon  reavers it calls in at a time (0 = none)
//   combo    1 = reavers keep firing while the construct hunts (sector 3 on)
//   repair   1 = gatherers can bring it crystals to mend plates while it hunts
//   burst    bolts in each reaver volley (a fan; 1 = a single shot)
//   rocks    asteroids in the field                chip    hits that knock one crystal loose    ore  crystals per asteroid
//   bombs    charges in the rack at the start of the sector      rHP  hits a reaver takes
export const RAMP = [
  { reav: [1, 2], engage: [1, 1], rV: [6.5, 7.6], fire: [0.18, 0.22], warn: [2.3, 2.1], aim: [0.24, 0.2], boltV: [15, 16.5], gath: [2, 3], gV: [6.5, 7.2], regen: [15, 12], selfT: [14, 12.5], icpt: [0, 0], shield: [2, 2], burst: [1, 1],
    pieces: 12, kill: 5, bossV: 5.6, pull: 4.5, pullEvery: 10, pullTell: 2.3, wakeT: 3.8, lunge: 0, summon: 0, combo: 0, repair: 0, rocks: 38, chip: 14, ore: 7, bombs: 3, rHP: 3 },
  { reav: [2, 3], engage: [2, 2], rV: [8, 9.2], fire: [0.34, 0.38], warn: [1.8, 1.55], aim: [0.13, 0.11], boltV: [19, 21.5], gath: [3, 4], gV: [7.6, 8.4], regen: [11, 9], selfT: [12.5, 11], icpt: [0.05, 0.12], shield: [1, 1], burst: [2, 2],
    pieces: 14, kill: 7, bossV: 6.6, pull: 6, pullEvery: 8.8, pullTell: 2.0, wakeT: 3.4, lunge: 0, summon: 0, combo: 0, repair: 0, rocks: 34, chip: 16, ore: 6, bombs: 2, rHP: 3 },
  { reav: [3, 4], engage: [2, 3], rV: [9.4, 10.6], fire: [0.38, 0.4], warn: [1.45, 1.28], aim: [0.095, 0.08], boltV: [22.5, 24.5], gath: [4, 5], gV: [8.6, 9.4], regen: [8.6, 7.6], selfT: [11, 10], icpt: [0.15, 0.24], shield: [0, 0], burst: [2, 2],
    pieces: 16, kill: 9, bossV: 7.6, pull: 7.5, pullEvery: 7.8, pullTell: 1.7, wakeT: 3.0, lunge: 1, summon: 1, combo: 1, repair: 0, rocks: 30, chip: 18, ore: 5, bombs: 2, rHP: 5 },
  { reav: [4, 5], engage: [3, 3], rV: [10.8, 11.8], fire: [0.4, 0.41], warn: [1.28, 1.1], aim: [0.075, 0.065], boltV: [24.5, 26], gath: [5, 6], gV: [9.6, 10.4], regen: [7.6, 6.6], selfT: [10, 9], icpt: [0.25, 0.33], shield: [1, 0], burst: [2, 2],
    pieces: 18, kill: 11, bossV: 8.8, pull: 9, pullEvery: 6.8, pullTell: 1.35, wakeT: 2.7, lunge: 1, summon: 2, combo: 1, repair: 1, rocks: 26, chip: 20, ore: 5, bombs: 1, rHP: 5 },
  { reav: [5, 5], engage: [3, 3], rV: [11.8, 12.6], fire: [0.41, 0.41], warn: [1.1, 0.72], aim: [0.065, 0.06], boltV: [26, 27.5], gath: [6, 7], gV: [10.6, 11.4], regen: [6.6, 5.6], selfT: [9, 8], icpt: [0.34, 0.42], shield: [1, 1], burst: [2, 2],
    pieces: 20, kill: 13, bossV: 10, pull: 10.5, pullEvery: 5.8, pullTell: 1.05, wakeT: 2.4, lunge: 1, summon: 2, combo: 1, repair: 1, rocks: 22, chip: 22, ore: 4, bombs: 1, rHP: 5 },
];
export const RAMP_KEYS = ['burst', 'reav', 'engage', 'rV', 'fire', 'warn', 'aim', 'boltV', 'gath', 'gV', 'regen', 'selfT', 'icpt', 'shield'];
export const MIN_WARN = 0.6;

// the values at checkpoint cp (0..2) of sector s (0-based)
export function rampAt(s, cp) {
  const row = RAMP[s], f = Math.max(0, Math.min(1, cp / 2));
  const out = { ...row, sector: s, cp };
  for (const k of RAMP_KEYS) out[k] = row[k][0] + (row[k][1] - row[k][0]) * f;
  out.burst = Math.round(out.burst); out.reav = Math.round(out.reav); out.engage = Math.round(out.engage); out.gath = Math.round(out.gath); out.shield = Math.round(out.shield);
  return out;
}

// the first sector is a teaching sector: nothing can hurt you for the first half minute
export const TUTOR = { gathAt: 16, reavAt: 38, safe: 32 };

// DEEP FIELD (endless): level 0 = sector 1's start, 5 = sector 5's end, reached after ~20 minutes; the
// look changes with every construct you destroy
export const DEEP = { minutes: 20, startLevel: 0.15 };
export function deepLevel(seconds) {
  const m = seconds / 60;
  return Math.min(5, DEEP.startLevel + 4.85 * Math.pow(Math.min(1, m / DEEP.minutes), 1.1));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level));
  const f = Math.min(1, level - s);
  const r = rampAt(s, f * 2);
  r.shield = level < 1.2 ? 1 : 0;
  return r;
}

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { crystal: 50, chip: 10, knock: 250, bombHit: 1000, construct: 10000, sector: 2500, timeBonus: 25, pod: 200, rackFull: 100, lifeEvery: 40000 };
export const START_LIVES = 3;

// ship liveries, unlocked by medals
export const LIVERIES = [
  { key: 'cobalt', name: 'COBALT', color: 0x3d7fd9, accent: 0xffc65a, medals: 0 },
  { key: 'crimson', name: 'CRIMSON', color: 0xc8352f, accent: 0xf2e6c8, medals: 3 },
  { key: 'jade', name: 'JADE', color: 0x2f9e6a, accent: 0xd8ff9a, medals: 6 },
  { key: 'gold', name: 'GOLD', color: 0xc9992f, accent: 0x3a3f47, medals: 9 },
  { key: 'obsidian', name: 'OBSIDIAN', color: 0x24262d, accent: 0xff7a3a, medals: 12 },
  { key: 'arctic', name: 'ARCTIC', color: 0xe4ebf2, accent: 0x5fc8ff, medals: 15 },
];
export const P2_LIVERY = { color: 0xd9822b, accent: 0x9fe8ff };

// difficulty levels scale the RAMP (so every level still starts gentle and builds up) and have their own boards
export const DIFFICULTY = {
  easy: { label: 'EASY', desc: 'Slower machines, longer warnings, weaker constructs and an extra ship', rV: 0.85, fire: 0.65, count: 0.8, aim: 1.5, boltV: 0.85, warn: 1.25, bossV: 0.85, pull: 0.75, kill: -2, pieces: 0, shield: 1, lives: 1, drops: 1.4, score: 0.6 },
  normal: { label: 'NORMAL', desc: 'The intended challenge', rV: 1, fire: 1, count: 1, aim: 1, boltV: 1, warn: 1, bossV: 1, pull: 1, kill: 0, pieces: 0, shield: 0, lives: 0, drops: 1, score: 1 },
  hard: { label: 'HARD', desc: 'Faster, sharper reavers, shorter warnings, tougher constructs', rV: 1.07, fire: 1.12, count: 1.1, aim: 0.8, boltV: 1.1, warn: 0.85, bossV: 1.08, pull: 1.12, kill: 1, pieces: 0, shield: 0, lives: 0, drops: 0.85, score: 1.5 },
  nightmare: { label: 'NIGHTMARE', desc: 'For experts: everything at full tilt, one ship fewer', rV: 1.18, fire: 1.4, count: 1.25, aim: 0.6, boltV: 1.2, warn: 0.75, bossV: 1.16, pull: 1.25, kill: 2, pieces: 2, shield: 0, lives: -1, drops: 0.7, score: 2.2 },
};
export const DIFF_KEYS = Object.keys(DIFFICULTY);
export function applyDiff(R, key) {
  const d = DIFFICULTY[key] || DIFFICULTY.normal;
  if (d === DIFFICULTY.normal) return R;
  return { ...R, rV: R.rV * d.rV, fire: R.fire * d.fire, aim: R.aim * d.aim, boltV: R.boltV * d.boltV, warn: Math.max(MIN_WARN, R.warn * d.warn),
    pullTell: Math.max(MIN_WARN, R.pullTell * d.warn), wakeT: R.wakeT * Math.max(0.85, d.warn), reav: Math.max(1, Math.round(R.reav * d.count)), gath: Math.max(1, Math.round(R.gath * d.count)),
    bossV: R.bossV * d.bossV, pull: R.pull * d.pull, kill: Math.max(3, R.kill + d.kill), pieces: R.pieces + d.pieces, shield: R.shield + d.shield };
}

// power-up pods (rare drops from reavers). time = seconds it lasts (0 = instant), w = how often
export const POWERUPS = {
  twin: { name: 'TWIN BLAST', glyph: '⁂', color: 0x8fe4ff, time: 12, w: 10, desc: 'Three-way cannon fire' },
  overdrive: { name: 'OVERDRIVE', glyph: '»', color: 0xffd23f, time: 10, w: 10, desc: 'Double fire rate' },
  cell: { name: 'SHIELD CELL', glyph: '⬡', color: 0x6ad8ff, time: 0, w: 8, desc: '+1 shield charge' },
  magnet: { name: 'MAGNET', glyph: '◎', color: 0xb98aff, time: 14, w: 8, desc: 'Crystals fly to you from far off' },
};
export const PW_KEYS = Object.keys(POWERUPS);
export const DROP = { reaver: 0.13, gath: 0.03, life: 14, r: 2.3, max: 3 };

export const UPGRADES = {
  rapid: { name: 'RAPID CANNON', icon: '»', color: '#ffb347', max: 3, desc: 'Your cannons fire faster' },
  twin: { name: 'TWIN CANNON', icon: '⁂', color: '#ff6f61', max: 2, desc: 'Extra shots fan out to the sides' },
  thrust: { name: 'THRUSTERS', icon: '➤', color: '#9dff7a', max: 2, desc: 'Fly and turn 8% faster' },
  deflector: { name: 'DEFLECTOR', icon: '⛨', color: '#5fd0ff', max: 2, desc: '+1 shield charge at every checkpoint' },
  magnet: { name: 'CRYSTAL MAGNET', icon: '◎', color: '#c9a6ff', max: 2, desc: 'Crystals drift to you from further away' },
  rack: { name: 'CHARGE RACK', icon: '✸', color: '#ffe08a', max: 2, desc: '+2 charges at each sector start, and faster charges' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [500, 1100, 1900];

// par times: building plus the fight, with some slack
const PAR = [270, 290, 320, 350, 380];
export const parTime = (i) => PAR[i];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  MEDALS.push({ id: `s${i}clean`, sector: i, name: 'UNBROKEN', desc: `Clear ${s.name} without losing a ship` });
  MEDALS.push({ id: `s${i}ready`, sector: i, name: 'LOADED', desc: 'Have enough charges in the rack to finish the construct the moment it wakes' });
  MEDALS.push({ id: `s${i}par`, sector: i, name: 'ON THE CLOCK', desc: `Clear the sector under par (${PAR[i]} s)` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  { rapid: 1 },
  { rapid: 1, deflector: 1, rack: 1 },
  { rapid: 2, deflector: 1, twin: 1, rack: 1, magnet: 1 },
  { rapid: 2, deflector: 1, twin: 1, rack: 2, magnet: 1, thrust: 1 },
];
