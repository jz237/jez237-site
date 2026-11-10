// Skyhold 2026 — every tunable number lives here. The RAMP table drives difficulty; nothing else in the game
// hard-codes enemy pace, numbers, fire rate, aim or warning times.
export const VERSION = '1.14.0';
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
  whirler: { r: 0.6, hp: 1, score: 100 },
  coil: { r: 1.25, hp: 4, score: 400 },
  spark: { r: 0.4, hp: 1, score: 75 },
  scorcher: { r: 1.0, hp: 2, score: 250 },
  maw: { r: 1.2, hp: 2, score: 300 },
  prowler: { r: 1.2, hp: 2, score: 200 },
  skimmer: { r: 0.85, hp: 1, score: 50 },
  meteor: { r: 0.9, hp: 1, score: 75 },
};
// HYPER: every kill fills the meter (more with a chain running); full, the ship goes HYPER for `time` seconds: the
// machines, their bolts and the carrier slow to `slow`, the beam fires every `fireCD` s, `band` x as tall and `reach` x
// as long, ramming wrecks machines without a scratch, and every kill scores `score` x. The meter drains `decay` a second.
// GUNSHIPS: the WARDEN and three more unlocked with medals. weapon: beam / arc (each hit leaps to `chain` more machines
// within chainR m) / missile (`missiles` homing missiles a shot). vmax / accel scale the flying, cd the time between shots,
// dmg the hits a beam deals, band / range its height and reach; hyperCD is the time between shots in HYPER. role is the
// one-line label under each ship in the title screen's hangar.
export const SHIPS = {
  warden: { name: 'WARDEN', role: 'BEAM CANNON', desc: 'The colony gunship: a fast, balanced beam cannon.', medals: 0, weapon: 'beam', vmax: 1, accel: 1, cd: 1, dmg: 1, band: 1, range: 1, hyperCD: 0.045 },
  breaker: { name: 'BREAKER', role: 'HEAVY CANNON', desc: 'Heavy cannon: slow, tall shots that hit three times as hard. Heavier to fly.', medals: 2, weapon: 'beam', vmax: 0.9, accel: 0.85, cd: 2.1, dmg: 3, band: 1.9, range: 0.92, hyperCD: 0.11 },
  arc: { name: 'ARC', role: 'CHAIN LIGHTNING', desc: 'Chain lightning: every hit leaps to two more machines nearby. Shorter reach, nimble.', medals: 5, weapon: 'arc', vmax: 1.05, accel: 1.05, cd: 1.3, dmg: 1, band: 1, range: 0.72, chain: 2, chainR: 13, hyperCD: 0.06 },
  hornet: { name: 'HORNET', role: 'HOMING MISSILES', desc: 'Homing swarm missiles that find their own targets. The fastest ship.', medals: 9, weapon: 'missile', vmax: 1.1, accel: 1.15, cd: 3.2, dmg: 1, band: 1, range: 1, missiles: 2, hyperCD: 0.12 },
};
export const SHIP_KEYS = Object.keys(SHIPS);
// GUNSHIP MASTERY: machines a gunship shoots down (any mode you fly yourself; skimmers, mines and meteors do not count)
// unlock its two perks, at `at` machines (about two and six worlds); a perk
// applies from the next world you start. The world remembers each pilot's level (makeWorld mast / mast2), so replays and
// online play stay exact.
export const MASTERY = { at: [150, 500],
  perks: {
    warden: [{ name: 'LONG BEAM', desc: 'the beam reaches 15% further' }, { name: 'QUICK CHARGE', desc: 'HYPER charges 35% faster' }],
    breaker: [{ name: 'WIDE SHELL', desc: 'shots are 30% taller' }, { name: 'SHOCKWAVE', desc: 'a wreck from your shell hits every machine within 4.5 m' }],
    arc: [{ name: 'FORK', desc: 'lightning leaps to one more machine' }, { name: 'LONG ARC', desc: 'lightning leaps 40% further' }],
    hornet: [{ name: 'THIRD MISSILE', desc: 'every salvo fires a third missile' }, { name: 'HUNTER SEEKERS', desc: 'missiles fly 25% faster and lock on from further away' }],
  } };
export const mastLevel = (n) => (n >= MASTERY.at[1] ? 2 : n >= MASTERY.at[0] ? 1 : 0);
// RIVALS (online): two pilots on one planet, each with their own score, for `waves` waves (no carrier). Shooting the
// rival while they carry a settler knocks it loose (it falls, ready to be caught) and scores `steal`; being shot down costs
// `death` points; ships never run out.
export const RIVALS = { waves: 3, steal: 250, death: 500 };
// POD INTERSECTION: in the listed waves (0-based, per world; endless: every third wave) two hive pods (they stand in
// for one of the wave's own hives) warp in on
// either side of a point ahead of a pilot (`half` m out), close on it in about `travel` s and lock together, circling
// and linked, for `hold` s: a hit on either then bursts both, pays `bonus`, and their stingers scatter away from the
// shooter. Left alone, they break apart and hunt as usual. sting: stingers in each of these pods, per world.
export const INTERSECT = { waves: [[2], [2], [2], [2], [2]], at: [7, 12], half: 26, travel: 4, hold: 3.2, gap: 3.6, bonus: 2000, sting: [2, 3, 3, 3, 3] };
// the second wave of machines (each world brings them in a little at a time; per-world values, index = world)
//   WHIRL: rings of n whirlers spinning round a centre that shadows a pilot, then the whole ring dives at them
//   COIL: a slow drifting generator that lets out a SPARK every `every` s (at most `max` alive per coil)
//   SCORCH: a raider that hops about a pilot and throws a FIREBRAND, a slow fireball that homes for `home` s
//   MAW: a jawed hunter that stalks `stalk` m off, opens its jaws (a warning), then dashes in to bite
//   GATE: the SKYGATE, a ring in the sky across the planet from the first colony: fly through it and it throws you
//         to wherever the colony needs you most (a lifter carrying a settler, one going down, a falling settler)
export const WHIRL = { n: 6, rad: 2.3, spin: 2.4, v: [7, 8, 9, 10, 11], dive: [13, 14, 15.5, 17, 18], diveT: 1.2, every: [8, 7, 6, 5.5, 5] };
export const COIL = { every: [6, 6, 5.5, 5, 4.5], max: 3, life: 11, v: [10, 11, 12.5, 14, 15] };
export const SCORCH = { hop: [1.1, 1.0, 0.9, 0.85, 0.8], fire: [5, 4.6, 4.2, 3.8, 3.4], v: 9, home: 1.8, turn: 2.2, warn: 0.55 };
export const MAW = { stalk: 18, dash: [20, 21, 23, 25, 27], dashT: 0.85, rest: [3.2, 3, 2.7, 2.4, 2.2], warn: 0.5 };
export const GATE = { y: 17, r: 4.2, cd: 6, back: 14 };
// SPECIAL WAVES: every fourth wave (the campaign's wave 4 of each world, right before the carrier; in ENDLESS ORBIT every
// fourth wave) is a massed attack by one kind of fighter: no lifters, `squads` squadrons of `n` arriving `gap` s apart.
// kind: the machine ('whirler' comes as rings of six, so its n is rings per squadron; 'mix' = the armada, a squadron of
// each kind in turn). The campaign uses SPECIALS[world]; endless cycles through them and adds a squadron a cycle.
export const SPECIALS = [
  { key: 'whirl', name: 'WHIRLER STORM', kind: 'whirler', squads: 8, n: 1, gap: 5 },
  { key: 'swarm', name: 'STINGER SWARM', kind: 'stinger', squads: 8, n: 6, gap: 4.6 },
  { key: 'sparks', name: 'SPARK STORM', kind: 'spark', squads: 11, n: 8, gap: 3.4 },
  { key: 'raid', name: 'HUSK RAID', kind: 'husk', squads: 13, n: 4, gap: 3.6 },
  { key: 'armada', name: 'THE ARMADA', kind: 'mix', squads: 14, n: 6, gap: 3.6 },
];
export const SPECIAL = { every: 4, first: 2.2, sparkLife: 26, mix: ['stinger', 'whirler', 'husk', 'spark', 'stinger', 'whirler', 'husk', 'maw'] };
export const HYPER = { gain: 0.0045, decay: 0.002, time: 8, slow: 0.55, fireCD: 0.045, band: 2.4, reach: 1.25, score: 2 };
// planet events: one per world, mid-wave in waves 2 and 4 (index 1 and 3) between `at` seconds
export const EVENTS = { verdant: 'meteors', dune: 'sandstorm', frost: 'flare', cinder: 'eruption', umbra: 'eclipse' };
export const EVENT = { at: [11, 20], waves: [1, 3], meteors: { n: 8, T: 9 }, eruption: { n: 7, T: 9 }, sandstorm: { T: 14, wind: 7 }, flare: { T: 10, stun: 2.6 }, eclipse: { T: 16 } };
// carriers fight in two phases: once the outer weak points are gone the armour blows off and three core points open
// (the heart takes heartK x the weak-point hits, the vents ventK x); phase 2 attacks come atkK x as often
export const PHASE2 = { heartK: 3.4, ventK: 1.6, atkK: 0.7, shedT: 2.6, warpT: 5.2 };
// SKIMMER flocks: snakes of small machines that sweep the sky. They never fire and never hold up a wave, but ramming
// one costs a shield. near: how many the director keeps within `range` of each pilot, by world (0 = none: since 1.14.0
// the sky is filled with the real machines instead); v: their speed by world. Their points never count toward extra ships.
export const SKIM = { near: [0, 0, 0, 0, 0], v: [8, 9.5, 11, 12, 12.5], pull: [0.3, 0.38, 0.42, 0.42, 0.32], flock: [3, 5], range: 150, gap: 1.4, life: 45 };
// where machines warp in: `near` of them (other than lifters) within r m of a pilot, the rest anywhere on the planet;
// lifterNear of the lifters come down on settlers within lifterR m of a pilot, the rest on any settler
export const SPAWN = { near: 0.75, r: [26, 80], lifterNear: 0.75, lifterR: 200 };
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
  { lifters: [14, 18], group: [4, 5], gap: [5, 4], lV: [4.6, 5.4], liftV: [1.1, 1.3], grabT: [2.4, 2.1], hunters: [1, 2], fire: [0.1, 0.14], shooters: [1, 1], warn: [2.3, 2.0],
    aim: [0.3, 0.26], boltV: [12, 13.5], lead: [0, 0.2], hV: [9, 10], stV: [11, 12], sowers: [2, 2], hives: [2, 2], husks: [0, 0], whirls: [3, 3], scorchers: [1, 2], coils: [1, 1], maws: [1, 1], prowlT: [80, 70], fallV: [2.4, 2.7], safeH: [99, 99], shield: [2, 1],
    sting: 3, settlers: 8, nodeHP: 14, bossV: 4.2, atkT: 5.6 },
  { lifters: [20, 24], group: [4, 5], gap: [4.6, 4], lV: [5.6, 6.4], liftV: [1.4, 1.6], grabT: [2.0, 1.8], hunters: [2, 2], fire: [0.2, 0.24], shooters: [2, 2], warn: [1.9, 1.65],
    aim: [0.21, 0.17], boltV: [15.5, 17.5], lead: [0.25, 0.35], hV: [11, 12], stV: [12, 13], sowers: [3, 4], hives: [3, 3], husks: [0, 1], whirls: [3, 3], scorchers: [2, 2], coils: [1, 2], maws: [1, 2], prowlT: [58, 50], fallV: [3.2, 3.6], safeH: [20, 18], shield: [1, 1],
    sting: 4, settlers: 9, nodeHP: 16, bossV: 5, atkT: 5.0 },
  { lifters: [22, 26], group: [5, 6], gap: [4.2, 3.6], lV: [6.6, 7.4], liftV: [1.7, 1.9], grabT: [1.7, 1.5], hunters: [2, 3], fire: [0.25, 0.29], shooters: [2, 3], warn: [1.6, 1.4],
    aim: [0.14, 0.115], boltV: [19, 21], lead: [0.45, 0.55], hV: [13.5, 14.5], stV: [14, 15], sowers: [4, 4], hives: [4, 4], husks: [5, 6], whirls: [3, 4], scorchers: [3, 3], coils: [2, 3], maws: [3, 3], prowlT: [55, 48], fallV: [4, 4.5], safeH: [15, 13], shield: [1, 1],
    sting: 4, settlers: 10, nodeHP: 17, bossV: 5.8, atkT: 4.5 },
  { lifters: [22, 26], group: [5, 6], gap: [4, 3.5], lV: [7.6, 8.4], liftV: [2.0, 2.2], grabT: [1.4, 1.25], hunters: [3, 3], fire: [0.36, 0.41], shooters: [3, 3], warn: [1.35, 1.15],
    aim: [0.11, 0.09], boltV: [20, 22], lead: [0.5, 0.6], hV: [15, 16], stV: [16, 17], sowers: [4, 5], hives: [4, 5], husks: [6, 7], whirls: [3, 4], scorchers: [3, 4], coils: [3, 3], maws: [3, 4], prowlT: [48, 42], fallV: [5, 5.5], safeH: [12, 10], shield: [1, 1],
    sting: 4, settlers: 10, nodeHP: 19, bossV: 6.4, atkT: 4.0 },
  { lifters: [24, 28], group: [6, 6], gap: [3.8, 3.2], lV: [8.6, 9.6], liftV: [2.3, 2.6], grabT: [1.2, 1.0], hunters: [3, 4], fire: [0.19, 0.23], shooters: [3, 3], warn: [1.1, 0.72],
    aim: [0.095, 0.08], boltV: [22, 25], lead: [0.6, 0.7], hV: [17, 19], stV: [18, 20], sowers: [4, 5], hives: [4, 4], husks: [5, 6], whirls: [3, 4], scorchers: [3, 4], coils: [3, 3], maws: [3, 4], prowlT: [42, 34], fallV: [5.8, 6.4], safeH: [9, 8], shield: [1, 1],
    sting: 5, settlers: 10, nodeHP: 21, bossV: 7, atkT: 3.4 },
];
export const RAMP_KEYS = ['lifters', 'group', 'gap', 'lV', 'liftV', 'grabT', 'hunters', 'fire', 'shooters', 'warn', 'aim', 'boltV', 'lead', 'hV', 'stV', 'sowers', 'hives', 'husks', 'prowlT', 'fallV', 'safeH', 'shield', 'whirls', 'scorchers', 'coils', 'maws'];
const ROUND = ['lifters', 'group', 'hunters', 'shooters', 'sowers', 'hives', 'husks', 'shield', 'whirls', 'scorchers', 'coils', 'maws'];
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
    lifters: n(R.lifters), sowers: n(R.sowers), hives: n(R.hives), husks: n(R.husks), whirls: n(R.whirls), scorchers: n(R.scorchers), coils: n(R.coils), maws: n(R.maws), shield: R.shield + d.shield, atkT: R.atkT / d.fire ** 0.5 };
}

// power-up pods (rare drops). time = seconds it lasts (0 = instant), w = how often
export const POWERUPS = {
  twin: { name: 'TWIN BEAM', glyph: '⁂', color: 0x8fe4ff, time: 12, w: 10, desc: 'Two beams at once' },
  overdrive: { name: 'OVERDRIVE', glyph: '»', color: 0xffd23f, time: 10, w: 10, desc: 'Double fire rate' },
  cell: { name: 'SHIELD CELL', glyph: '⬡', color: 0x6ad8ff, time: 0, w: 8, desc: '+1 shield charge' },
  nova: { name: 'NOVA', glyph: '✸', color: 0xff9a5a, time: 0, w: 6, desc: '+1 nova' },
  drone: { name: 'ESCORT DRONE', glyph: '◈', color: 0x9dff7a, time: 12, w: 4, desc: 'A drone flies with you and shoots the nearest machine' },
};
export const PW_KEYS = Object.keys(POWERUPS);
export const DROP = { chance: { sower: 0.25, hive: 0.4, prowler: 0.3, husk: 0.06, lifter: 0.04, stinger: 0.03, skimmer: 0.003, coil: 0.35, scorcher: 0.15, maw: 0.18, whirler: 0.02 }, life: 14, r: 2.2, max: 3 };

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
