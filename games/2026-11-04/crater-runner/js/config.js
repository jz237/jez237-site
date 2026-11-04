// Crater Runner — every tunable number lives here. The RAMP table drives difficulty; nothing else
// in the game hard-codes pace, spacing, crater size, enemy fire or warning time.
export const VERSION = '1.0.0';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ the rover
export const F = {
  gravity: 9.0,          // gameplay gravity, m/s^2 (floaty, lunar-feeling jumps)
  jumpV: 5.0,            // take-off speed
  holdG: 0.4,            // gravity multiplier while JUMP is held and rising
  holdMax: 0.45,         // seconds of hold that still add height
  coyote: 0.13,          // a late press still jumps this long after the wheels leave the ground
  buffer: 0.2,           // an early press is remembered this long and fires on touch-down
  axles: [-1.35, 0, 1.35],
  spring: 26, damp: 5.2, pre: 0.115, bumpMax: 0.34, droop: 0.42, pitchI: 1.6, pitchDamp: 3.4,
  halfLen: 1.75, height: 1.85,
  accel: 4.5,            // how fast the rover reaches the speed you ask for
  throttle: 0.32,        // slow down / speed up = base speed x (1 -/+ this)
  fireCD: 0.26, shotV: 30, shotLife: 0.8, upV: 24, upLife: 0.95, maxFwd: 3,
  respawn: 2.4, inv: 2.2,
};

// ------------------------------------------------------------------ sectors and their looks
export const SECTORS = [
  { key: 'highlands', name: 'GREY HIGHLANDS', cps: 'ABCDE', boss: 'warden', music: 's1' },
  { key: 'maria', name: 'DARK MARIA', cps: 'FGHIJ', boss: 'crawler', music: 's2' },
  { key: 'ice', name: 'ICE CRATER RIM', cps: 'KLMNO', boss: 'lancer', music: 's3' },
  { key: 'mine', name: 'MINING BASE RUINS', cps: 'PQRST', boss: 'excavator', music: 's4' },
  { key: 'night', name: 'FAR-SIDE NIGHT RUN', cps: 'UVWXYZ', boss: 'carrier', music: 's5' },
];

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Each sector row gives [value at its first checkpoint, value at its last]; the game interpolates in
// small steps checkpoint by checkpoint, and each sector starts where the last one ended. Long Haul
// walks the same curve over many minutes (see longHaulLevel).
//   speed     base scroll speed, m/s (the rover's cruise; slow/fast is x0.68 .. x1.32)
//   gap       seconds of driving between threat groups
//   pair      chance a group has a second threat right behind the first
//   pairGap   seconds between the two threats of a pair
//   crater    typical crater width, m (each one is 0.8x .. 1.2x)
//   land      landing-zone grace, m: how much of each crater edge still counts as solid ground
//   grace     seconds you can still jump after rolling over a crater lip
//   warn      seconds of warning before a threat arrives (HUD marker + chirp)
//   fire      bombs per second from each attacker (tanks: shells per second)
//   air       attackers per air wave
//   combo     chance an air wave arrives on top of ground threats (sector 3+ only)
//   segT      seconds of driving between checkpoints
//   shield    shield charges refilled at each checkpoint (rounded)
//   bossHP    boss armour; bossRate scales boss attack rate
//   mix       which threats can appear and how often
export const RAMP = [
  { speed: [6.0, 7.0], gap: [3.7, 2.3], pair: [0, 0.22], pairGap: [1.7, 1.6], crater: [2.5, 4.2], land: [0.95, 0.72], grace: [0.18, 0.16],
    warn: [2.4, 2.1], fire: [0.12, 0.3], air: [1, 1.6], combo: [0, 0], segT: [28, 30], shield: [1, 1], bossHP: 14, bossRate: 0.8,
    mix: { crater: 1, boulder: 0.8, air: 0.38 } },
  { speed: [7.2, 8.2], gap: [2.25, 1.85], pair: [0.24, 0.42], pairGap: [1.55, 1.42], crater: [4.4, 6.0], land: [0.71, 0.62], grace: [0.155, 0.14],
    warn: [2.05, 1.75], fire: [0.31, 0.4], air: [1.6, 2.0], combo: [0, 0], segT: [30, 31], shield: [1, 1], bossHP: 18, bossRate: 0.75,
    mix: { crater: 1, boulder: 0.7, mine: 0.55, tank: 0.45, air: 0.42 } },
  { speed: [8.4, 9.4], gap: [1.85, 1.66], pair: [0.42, 0.58], pairGap: [1.4, 1.26], crater: [6.2, 8.3], land: [0.62, 0.54], grace: [0.135, 0.115],
    warn: [1.7, 1.4], fire: [0.42, 0.48], air: [2.0, 2.3], combo: [0.15, 0.28], segT: [31, 32], shield: [0, 0], bossHP: 20, bossRate: 0.62,
    mix: { crater: 1, boulder: 0.6, mine: 0.5, tank: 0.4, wall: 0.22, drone: 0.3, air: 0.45 } },
  { speed: [9.6, 10.6], gap: [1.66, 1.6], pair: [0.58, 0.6], pairGap: [1.24, 1.1], crater: [8.3, 9.3], land: [0.54, 0.52], grace: [0.11, 0.1],
    warn: [1.36, 1.12], fire: [0.48, 0.5], air: [2.3, 2.5], combo: [0.3, 0.4], segT: [32, 33], shield: [0, 0], bossHP: 28, bossRate: 1.0,
    mix: { crater: 1, boulder: 0.55, mine: 0.5, tank: 0.45, wall: 0.34, drone: 0.35, air: 0.5 } },
  { speed: [10.8, 12.0], gap: [1.62, 1.6], pair: [0.6, 0.6], pairGap: [1.08, 0.98], crater: [9.3, 10.0], land: [0.52, 0.5], grace: [0.1, 0.09],
    warn: [1.06, 0.7], fire: [0.48, 0.49], air: [2.5, 2.7], combo: [0.4, 0.48], segT: [33, 34], shield: [0, 0], bossHP: 32, bossRate: 0.62,
    mix: { crater: 1, boulder: 0.5, mine: 0.55, tank: 0.5, wall: 0.4, drone: 0.45, air: 0.55 } },
];
const RAMP_KEYS = ['speed', 'gap', 'pair', 'pairGap', 'crater', 'land', 'grace', 'warn', 'fire', 'air', 'combo', 'segT'];

// the difficulty values at checkpoint segment `cp` of sector `s` (0-based)
export function rampAt(s, cp) {
  const row = RAMP[s], n = SECTORS[s].cps.length;
  const f = n > 1 ? Math.min(1, cp / (n - 1)) : 0;
  const out = { sector: s, cp, shield: Math.round(row.shield[0] + (row.shield[1] - row.shield[0]) * f), bossHP: row.bossHP, bossRate: row.bossRate, mix: row.mix };
  for (const k of RAMP_KEYS) out[k] = row[k][0] + (row[k][1] - row[k][0]) * f;
  return out;
}

// Long Haul: level 0 = sector 1's start, 5 = sector 5's end, reached after ~16 minutes of driving
export const LONG_HAUL = { minutes: 16, startLevel: 0.15, lookEvery: 2400 };
export function longHaulLevel(seconds) {
  const m = seconds / 60;
  return Math.min(5, LONG_HAUL.startLevel + 4.85 * Math.pow(Math.min(1, m / LONG_HAUL.minutes), 1.15));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level)), n = SECTORS[s].cps.length;
  const r = rampAt(s, Math.min(n - 1, (level - s) * (n - 1)));
  r.mix = RAMP[s].mix;
  r.combo = s >= 2 ? r.combo : 0;
  r.shield = level < 1.5 ? 1 : 0;
  return r;
}

// ------------------------------------------------------------------ threats
export const THREATS = {
  boulder: { hp: 1, big: { hp: 2, r: 0.95 }, r: 0.62, score: 100 },
  wall: { hp: 3, h: 1.95, w: 0.9, score: 250 },
  mine: { r: 0.55, score: 0 },
  tank: { hp: 2, h: 1.35, len: 2.6, score: 300, shellV: 7, range: 30 },
  flyer: { hp: 1, score: 200, y: 7.2, life: 11 },
  drone: { hp: 1, score: 250, speed: 6.5 },
  bomb: { score: 50 },
  shell: { score: 50 },
};

// bosses: one per sector
export const BOSSES = {
  warden: { name: 'GREY WARDEN', kind: 'air', drones: 0, salvo: 2, mortar: 0, rocks: 0 },
  crawler: { name: 'BASALT CRAWLER', kind: 'ground', drones: 0, salvo: 0, mortar: 1, rocks: 0 },
  lancer: { name: 'RIME LANCER', kind: 'air', drones: 1, salvo: 2, mortar: 0, rocks: 0 },
  excavator: { name: 'THE EXCAVATOR', kind: 'ground', drones: 0, salvo: 0, mortar: 1, rocks: 1 },
  carrier: { name: 'NIGHT CARRIER', kind: 'carrier', drones: 1, salvo: 2, mortar: 2, rocks: 0 }, // mortar 2 = phase 2 only
};

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { checkpoint: 500, timeBonus: 40, boss: 5000, sector: 2500, lifeEvery: 25000 };
export const START_LIVES = 3;

export const UPGRADES = {
  shield: { name: 'SHIELD CELL', icon: '⛨', color: '#5fd0ff', max: 2, desc: '+1 shield charge at every checkpoint' },
  cannon: { name: 'RAPID CANNON', icon: '⁍', color: '#ffb347', max: 3, desc: 'Both guns fire faster' },
  flak: { name: 'FLAK SPREAD', icon: '⁂', color: '#ff6f61', max: 2, desc: 'Extra anti-air shots fan out' },
  springs: { name: 'LONG SPRINGS', icon: '⌇', color: '#9dff7a', max: 2, desc: 'Higher jumps and a softer landing' },
  radar: { name: 'DEEP RADAR', icon: '◎', color: '#d7a6ff', max: 1, desc: 'Warnings arrive 0.4 s earlier' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [400, 900, 1600];

// par times: about the drive time plus the boss, with a little slack
const PAR = [205, 215, 225, 235, 280];
export const parTime = (i) => PAR[i];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  MEDALS.push({ id: `s${i}clean`, sector: i, name: 'CLEAN RUN', desc: `Clear ${s.name} without losing a rover` });
  MEDALS.push({ id: `s${i}aim`, sector: i, name: 'SHARP EYE', desc: 'Shoot down 80% of the attackers in the sector' });
  MEDALS.push({ id: `s${i}par`, sector: i, name: 'ON THE CLOCK', desc: `Clear the sector under par (${PAR[i]} s)` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  {},
  { shield: 1, cannon: 1 },
  { shield: 1, cannon: 1, flak: 1, springs: 1 },
  { shield: 1, cannon: 2, flak: 1, springs: 1, radar: 1 },
];
