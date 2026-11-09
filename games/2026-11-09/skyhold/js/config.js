// Skyhold 2026 — every tunable number lives here. The RAMP table drives difficulty; nothing else in the game
// hard-codes enemy pace, numbers, fire rate, aim or warning times.
export const VERSION = '1.2.0';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ the planet and the Warden gunship
// Sim units are metres. x runs along the ground round the planet and wraps every C metres; y is altitude.
// The renderer wraps the play plane round a cylinder of radius RP (the planet), so the ground curves away.
export const C = 1600, RP = C / (2 * Math.PI), H = 36;
export const F = {
  r: 0.95,             // ship hit radius
  vmax: 44,            // top speed along the ground, m/s (THRUSTERS add 8% a level)
  accel: 64,           // thrust, m/s^2
  brake: 95,           // when you push the other way the ship brakes this hard before it builds speed again
  drag: 0.9,           // coasting drag with the stick let go (per second)
  vy: 19,              // climb / dive speed, m/s
  vyAcc: 130,
  minY: 1.5, maxY: H - 1.3,
  fireCD: 0.14,        // seconds between beam shots (RAPID add)
  beamV: 240,          // how fast the beam's head races out, m/s
  beamLen: 30,         // the length of the bright streak
  beamRange: 58,       // how far the beam reaches (LONG BEAM adds)
  beamH: 0.5,          // half height of the beam's hit band
  twinY: 0.62,         // TWIN BEAM: the second beam this far below the first
  novaR: 44,           // a NOVA clears everything this far along the ground either side (about one screen)
  novaMax: 6, novaCD: 0.8,
  blinkCD: 3.5,        // BLINK: jump to somewhere else round the planet
  blinkMin: 260, blinkMax: 620, blinkInv: 1.3,
  inv: 2.6,            // invulnerable after arriving
  hitInv: 1.4,         // after the shield takes a hit
  respawn: 2.3,
  catchR: 2.3,         // fly this close to a falling settler to catch it (TRACTOR adds)
  landY: 3.2,          // a carried settler is set down when you fly below this
  safeR: 70,           // you arrive at least this far along the ground from any machine
};

// machines. r = hit radius, hp = beam hits, score
export const ENEMY = {
  lifter: { r: 1.15, hp: 1, score: 150 },
  husk: { r: 0.95, hp: 1, score: 150 },
  sower: { r: 1.3, hp: 2, score: 250 },
  mine: { r: 0.42, hp: 1, score: 25 },
  hive: { r: 1.25, hp: 3, score: 1000 },
  stinger: { r: 0.5, hp: 1, score: 150 },
  prowler: { r: 1.2, hp: 2, score: 200 },
};
export const SETTLER = { walk: 0.7, roam: 7, h: 0.9, hang: 1.9 };

// the carrier at the end of each sector. nodes: weak points [dx, dy] from its centre (facing +x), body: hull
// ellipses [dx, dy, rx, ry] that stop beams (and kill on contact)
// measured from the models (scripts: skyhold-work/nodes.mjs); len = drawn length, alt = the height it keeps station at
export const BOSSES = {
  ark: { name: 'THE HARVEST ARK', len: 22.8, alt: 24, nodes: [[4.97, 0.96], [-0.55, 1.14], [-5.89, 0.96], [5.61, -2.43]], body: [[0.2, 0.7, 10, 2.6]], atk: ['volley', 'drop'] },
  reaper: { name: 'THE DUNE REAPER', len: 20.6, alt: 22, nodes: [[1.9, 1.44], [0.9, -0.92], [-2.6, 0.67], [8.3, 0.5]], body: [[-0.5, 0.9, 8.5, 2.2]], atk: ['volley', 'drop', 'rush'] },
  loom: { name: 'THE FROST LOOM', len: 18.3, alt: 19, nodes: [[0, 8.02], [8.31, 0], [0, -8.02], [-7.91, 0], [0, 0]], body: [[0, 0, 7.2, 7.2]], atk: ['volley', 'drop', 'sweep'] },
  hulk: { name: 'THE CINDER HULK', len: 18.8, alt: 21, nodes: [[4.4, 1.64], [-1.4, 1.64], [1, 4.7], [0, -3.75], [-8, 0.48]], body: [[0.4, 1.5, 8.2, 3.6]], atk: ['volley', 'drop', 'sweep', 'mines'] },
  throne: { name: 'THE UMBRA THRONE', len: 22.1, alt: 18, nodes: [[3.15, 10.61], [0.35, 12.01], [-3.15, 10.61], [4.9, -3.31], [-4.73, -3.58], [0.35, -0.35]], body: [[0, 2.5, 9, 3.5], [0, 9.5, 3.4, 3]], atk: ['volley', 'drop', 'rush', 'sweep', 'mines'] },
};
export const B_KEYS = Object.keys(BOSSES);

// ------------------------------------------------------------------ sectors (each a planet) and their looks
export const SECTORS = [
  { key: 'verdant', name: 'VERDANT REACH', boss: 'ark', music: 's1' },
  { key: 'dune', name: 'RED DUNE BELT', boss: 'reaper', music: 's2' },
  { key: 'frost', name: 'FROSTVEIL', boss: 'loom', music: 's3' },
  { key: 'cinder', name: 'CINDERFALL', boss: 'hulk', music: 's4' },
  { key: 'umbra', name: 'UMBRA PRIME', boss: 'throne', music: 's5' },
];
export const WAVES = 4;   // waves per sector before the carrier; every wave start is a checkpoint
export const CP_NAMES = ['WAVE 1', 'WAVE 2', 'WAVE 3', 'WAVE 4', 'CARRIER'];

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Pairs are [value in a sector's first wave, value in its fourth]; the carrier wave uses the second value.
// Each sector starts about where the last one ended. Single numbers hold for the whole sector.
//   lifters  lifters in the wave              group / gap  how many warp in together, seconds between groups
//   lV       lifter cruise speed, m/s         liftV   how fast a lifter climbs with a settler (m/s)
//   grabT    seconds a lifter's beam needs to lock on    hunters  lifters that may go for settlers at once
//   fire     shots a second from each machine that is shooting     shooters  machines that may shoot at once
//   warn     seconds of warning: machines warp in for 1.2x this, a shot is charged (glowing) for 0.6x this
//   aim      aim error, radians               boltV   bolt speed, m/s      lead  how much they lead you (0..1)
//   hV       husk speed                       stV     stinger speed        sting  stingers in a hive
//   sowers / hives / husks   how many of each join the wave (husks from sector 3: combined threats)
//   prowlT   seconds into a wave before a PROWLER comes for a slow pilot
//   fallV    how fast a dropped settler falls  safeH  a settler dropped below this height lands safely
//   shield   shield charges at each wave start
//   nodeHP   beam hits per carrier weak point     bossV  carrier speed     atkT  seconds between its attacks
export const RAMP = [
  { lifters: [3, 5], group: [1, 2], gap: [8, 6.5], lV: [4.6, 5.4], liftV: [1.1, 1.3], grabT: [2.4, 2.1], hunters: [1, 2], fire: [0.1, 0.14], shooters: [1, 1], warn: [2.3, 2.0],
    aim: [0.3, 0.26], boltV: [12, 13.5], lead: [0, 0.2], hV: [9, 10], stV: [11, 12], sowers: [0, 0], hives: [0, 0], husks: [0, 0], prowlT: [80, 70], fallV: [2.4, 2.7], safeH: [99, 99], shield: [2, 1],
    sting: 3, settlers: 8, nodeHP: 14, bossV: 4.2, atkT: 5.6 },
  { lifters: [6, 8], group: [2, 2], gap: [7, 6], lV: [5.6, 6.4], liftV: [1.4, 1.6], grabT: [2.0, 1.8], hunters: [2, 2], fire: [0.19, 0.23], shooters: [1, 2], warn: [1.9, 1.65],
    aim: [0.22, 0.18], boltV: [15.5, 17.5], lead: [0.25, 0.35], hV: [11, 12], stV: [13, 14], sowers: [1, 1], hives: [0, 0], husks: [0, 0], prowlT: [65, 58], fallV: [3.2, 3.6], safeH: [20, 18], shield: [1, 1],
    sting: 4, settlers: 9, nodeHP: 16, bossV: 5, atkT: 5.0 },
  { lifters: [8, 10], group: [2, 3], gap: [6, 5], lV: [6.6, 7.4], liftV: [1.7, 1.9], grabT: [1.7, 1.5], hunters: [2, 3], fire: [0.3, 0.35], shooters: [2, 3], warn: [1.6, 1.4],
    aim: [0.14, 0.115], boltV: [19, 21], lead: [0.45, 0.55], hV: [13.5, 14.5], stV: [15, 16], sowers: [1, 1], hives: [1, 1], husks: [2, 2], prowlT: [55, 48], fallV: [4, 4.5], safeH: [15, 13], shield: [0, 0],
    sting: 4, settlers: 10, nodeHP: 17, bossV: 5.8, atkT: 4.5 },
  { lifters: [8, 10], group: [3, 3], gap: [5.4, 4.6], lV: [7.6, 8.4], liftV: [2.0, 2.2], grabT: [1.4, 1.25], hunters: [3, 3], fire: [0.29, 0.34], shooters: [3, 3], warn: [1.35, 1.15],
    aim: [0.11, 0.09], boltV: [20, 22], lead: [0.5, 0.6], hV: [15, 16], stV: [17, 18], sowers: [1, 2], hives: [2, 2], husks: [2, 3], prowlT: [48, 42], fallV: [5, 5.5], safeH: [12, 10], shield: [0, 0],
    sting: 4, settlers: 10, nodeHP: 19, bossV: 6.4, atkT: 4.0 },
  { lifters: [9, 12], group: [3, 4], gap: [4.8, 4], lV: [8.6, 9.6], liftV: [2.3, 2.6], grabT: [1.2, 1.0], hunters: [3, 4], fire: [0.35, 0.41], shooters: [3, 3], warn: [1.1, 0.72],
    aim: [0.08, 0.065], boltV: [22, 25], lead: [0.6, 0.7], hV: [17, 19], stV: [19, 21], sowers: [2, 2], hives: [2, 2], husks: [3, 4], prowlT: [42, 34], fallV: [5.8, 6.4], safeH: [9, 8], shield: [0, 0],
    sting: 6, settlers: 10, nodeHP: 21, bossV: 7, atkT: 3.4 },
];
export const RAMP_KEYS = ['lifters', 'group', 'gap', 'lV', 'liftV', 'grabT', 'hunters', 'fire', 'shooters', 'warn', 'aim', 'boltV', 'lead', 'hV', 'stV', 'sowers', 'hives', 'husks', 'prowlT', 'fallV', 'safeH', 'shield'];
const ROUND = ['lifters', 'group', 'hunters', 'shooters', 'sowers', 'hives', 'husks', 'shield'];
export const MIN_WARN = 0.6;

// the values in wave w (0..4, 4 = the carrier) of sector s (0-based)
export function rampAt(s, w) {
  const row = RAMP[s], f = Math.max(0, Math.min(1, w / (WAVES - 1)));
  const out = { ...row, sector: s, wave: w };
  for (const k of RAMP_KEYS) out[k] = row[k][0] + (row[k][1] - row[k][0]) * f;
  for (const k of ROUND) out[k] = Math.round(out[k]);
  return out;
}

// the first wave of the first sector teaches: nothing can hurt you for the first half minute
export const TUTOR = { firstAt: 5, grabAt: 16, safe: 30 };

// ENDLESS ORBIT: level 0 = sector 1's start, 5 = sector 5's end, reached after ~22 minutes; a carrier every
// fifth wave and the planet changes after each one
export const ENDLESS = { minutes: 22, startLevel: 0.1, bossEvery: 5 };
export function endlessLevel(seconds) {
  const m = seconds / 60;
  return Math.min(5, ENDLESS.startLevel + 4.9 * Math.pow(Math.min(1, m / ENDLESS.minutes), 1.1));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level));
  const r = rampAt(s, Math.min(1, level - s) * (WAVES - 1));
  r.shield = level < 1.2 ? 1 : 0;
  return r;
}

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { catch: 500, land: 500, selfLand: 250, waveBonus: 100, node: 1000, boss: 5000, sector: 2500, lifeEvery: 25000 };
export const START_LIVES = 3;

export const LIVERIES = [
  { key: 'sky', name: 'SKY', color: 0x3f86d8, accent: 0xffc65a, medals: 0 },
  { key: 'crimson', name: 'CRIMSON', color: 0xc8352f, accent: 0xf2e6c8, medals: 3 },
  { key: 'jade', name: 'JADE', color: 0x2f9e6a, accent: 0xd8ff9a, medals: 6 },
  { key: 'gold', name: 'GOLD', color: 0xc9992f, accent: 0x3a3f47, medals: 9 },
  { key: 'obsidian', name: 'OBSIDIAN', color: 0x24262d, accent: 0xff7a3a, medals: 12 },
  { key: 'arctic', name: 'ARCTIC', color: 0xe4ebf2, accent: 0x5fc8ff, medals: 15 },
];
export const P2_LIVERY = { color: 0xd9822b, accent: 0x9fe8ff };

// difficulty levels scale the RAMP (every level still starts gentle) and have their own boards
export const DIFFICULTY = {
  easy: { label: 'EASY', desc: 'Slower machines, longer warnings, settlers fall gently and an extra ship', speed: 0.85, fire: 0.65, count: 0.8, aim: 1.5, boltV: 0.85, warn: 1.25, lift: 0.8, safeH: 1.5, nodeHP: -1, shield: 1, lives: 1, score: 0.6 },
  normal: { label: 'NORMAL', desc: 'The intended challenge', speed: 1, fire: 1, count: 1, aim: 1, boltV: 1, warn: 1, lift: 1, safeH: 1, nodeHP: 0, shield: 0, lives: 0, score: 1 },
  hard: { label: 'HARD', desc: 'Faster, sharper machines, shorter warnings, tougher carriers', speed: 1.08, fire: 1.15, count: 1.12, aim: 0.8, boltV: 1.1, warn: 0.85, lift: 1.12, safeH: 0.85, nodeHP: 1, shield: 0, lives: 0, score: 1.5 },
  nightmare: { label: 'NIGHTMARE', desc: 'For experts: everything at full tilt, one ship fewer', speed: 1.18, fire: 1.4, count: 1.25, aim: 0.6, boltV: 1.2, warn: 0.75, lift: 1.25, safeH: 0.7, nodeHP: 2, shield: 0, lives: -1, score: 2.2 },
};
export const DIFF_KEYS = Object.keys(DIFFICULTY);
export function applyDiff(R, key) {
  const d = DIFFICULTY[key] || DIFFICULTY.normal;
  if (d === DIFFICULTY.normal) return R;
  const n = (v) => Math.max(v > 0 ? 1 : 0, Math.round(v * d.count));
  return { ...R, lV: R.lV * d.speed, hV: R.hV * d.speed, stV: R.stV * d.speed, bossV: R.bossV * d.speed, fire: R.fire * d.fire, aim: R.aim * d.aim, boltV: R.boltV * d.boltV,
    warn: Math.max(MIN_WARN, R.warn * d.warn), liftV: R.liftV * d.lift, grabT: R.grabT / d.lift, safeH: R.safeH * d.safeH, nodeHP: Math.max(4, R.nodeHP + d.nodeHP * 3),
    lifters: n(R.lifters), sowers: n(R.sowers), hives: n(R.hives), husks: n(R.husks), shield: R.shield + d.shield, atkT: R.atkT / d.fire ** 0.5 };
}

// power-up pods (rare drops). time = seconds it lasts (0 = instant), w = how often
export const POWERUPS = {
  twin: { name: 'TWIN BEAM', glyph: '⁂', color: 0x8fe4ff, time: 12, w: 10, desc: 'Two beams at once' },
  overdrive: { name: 'OVERDRIVE', glyph: '»', color: 0xffd23f, time: 10, w: 10, desc: 'Double fire rate' },
  cell: { name: 'SHIELD CELL', glyph: '⬡', color: 0x6ad8ff, time: 0, w: 8, desc: '+1 shield charge' },
  nova: { name: 'NOVA', glyph: '✸', color: 0xff9a5a, time: 0, w: 6, desc: '+1 nova' },
};
export const PW_KEYS = Object.keys(POWERUPS);
export const DROP = { chance: { sower: 0.25, hive: 0.4, prowler: 0.3, husk: 0.06, lifter: 0.04, stinger: 0.03 }, life: 14, r: 2.2, max: 3 };

export const UPGRADES = {
  rapid: { name: 'RAPID BEAM', icon: '»', color: '#ffb347', max: 3, desc: 'Your beam cannon fires faster' },
  reach: { name: 'LONG BEAM', icon: '⟶', color: '#ff6f61', max: 2, desc: 'The beam reaches 15% further and hits a taller band' },
  thrust: { name: 'THRUSTERS', icon: '➤', color: '#9dff7a', max: 2, desc: 'Fly 8% faster and turn round quicker' },
  deflector: { name: 'DEFLECTOR', icon: '⛨', color: '#5fd0ff', max: 2, desc: '+1 shield charge at every wave' },
  rack: { name: 'NOVA RACK', icon: '✸', color: '#ffe08a', max: 2, desc: '+1 nova at every sector start' },
  tractor: { name: 'TRACTOR', icon: '◎', color: '#c9a6ff', max: 2, desc: 'Catch settlers from further away' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [500, 1100, 1900];

const PAR = [300, 320, 340, 360, 390];
export const parTime = (i) => PAR[i];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  MEDALS.push({ id: `s${i}clean`, sector: i, name: 'UNBROKEN', desc: `Clear ${s.name} without losing a ship` });
  MEDALS.push({ id: `s${i}guard`, sector: i, name: 'GUARDIAN', desc: 'Clear the sector without losing a single settler' });
  MEDALS.push({ id: `s${i}par`, sector: i, name: 'ON THE CLOCK', desc: `Clear the sector under par (${PAR[i]} s)` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  { rapid: 1 },
  { rapid: 1, deflector: 1, rack: 1 },
  { rapid: 2, deflector: 1, reach: 1, rack: 1, tractor: 1 },
  { rapid: 2, deflector: 1, reach: 1, rack: 2, tractor: 1, thrust: 1 },
];
