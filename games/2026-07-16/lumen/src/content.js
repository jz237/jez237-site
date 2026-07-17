// Game content: maps, towers, enemies, wave generation, economy constants.
// World design space is 1920x1080; the ground plane runs from HORIZON_Y down.

export const WORLD_W = 1920;
export const WORLD_H = 1080;
export const HORIZON_Y = 190; // sky above, living ground below

export const ECON = {
  startGold: 260,
  startLives: 20,
  interestRate: 0.10,     // on gold held at wave end
  interestCap: 60,        // max interest per wave
  surgeBonusPerSec: 3,    // gold per second of prep time skipped
  prepTime: 14,           // seconds between waves
  sellRefund: 0.7,
};

// Palette anchors (rgb 0..1). Saturated light colours on indigo darkness.
export const COLORS = {
  cyan: [0.16, 0.95, 1.0],
  magenta: [1.0, 0.25, 0.85],
  amber: [1.0, 0.72, 0.2],
  acid: [0.62, 1.0, 0.18],
  violet: [0.62, 0.3, 1.0],
  white: [1.0, 0.97, 0.9],
  heart: [1.0, 0.78, 0.35],
};

// Status chemistry: each status is owned by one colour family; mixing two
// statuses on the same creature triggers a reaction with its own light.
export const STATUS = {
  chill:   { color: COLORS.cyan,    dur: 2.2 },
  shock:   { color: COLORS.magenta, dur: 0.45 },
  ignite:  { color: COLORS.amber,   dur: 3.0, dps: 9 },
  corrode: { color: COLORS.acid,    dur: 4.0, maxStacks: 5, vulnPerStack: 0.06 },
};

export const MIXES = {
  shatter:    { a: 'chill', b: 'ignite', color: COLORS.violet, name: 'SHATTER',
                desc: 'chill + ignite — thermal shock bursts the creature' },
  overload:   { a: 'shock', b: 'corrode', color: [0.85, 1.0, 0.6], name: 'OVERLOAD',
                desc: 'shock + corrode — detonates in a caustic arc-burst' },
  freezelock: { a: 'chill', b: 'shock', color: [0.8, 0.95, 1.0], name: 'FREEZE-LOCK',
                desc: 'chill + shock — locks the creature solid' },
  meltdown:   { a: 'ignite', b: 'corrode', color: [1.0, 0.55, 0.15], name: 'MELTDOWN',
                desc: 'ignite + corrode — melts into a burning pool' },
};

export const TOWERS = {
  coral: {
    id: 'coral', name: 'Pulse Coral', kind: 3,
    desc: 'Grows a coral battery that spits searing light-seeds.',
    color: COLORS.cyan, hue: 0.52,
    cost: 90, range: 300, rate: 0.9, damage: 34, splash: 60,
    projSpeed: 820,
    size: 62,
    levels: [
      { cost: 0,   damage: 34, range: 300, rate: 0.9 },
      { cost: 70,  damage: 56, range: 335, rate: 1.0 },
      { cost: 130, damage: 92, range: 370, rate: 1.15 },
    ],
  },
  tesla: {
    id: 'tesla', name: 'Tesla Anemone', kind: 4,
    desc: 'A charged anemone that arcs living lightning between prey.',
    color: COLORS.magenta, hue: 0.88,
    cost: 120, range: 235, rate: 0.6, damage: 24, chain: 3, chainFall: 0.72,
    status: 'shock',
    size: 58,
    levels: [
      { cost: 0,   damage: 24, range: 235, rate: 0.6, chain: 3 },
      { cost: 90,  damage: 38, range: 260, rate: 0.68, chain: 4 },
      { cost: 160, damage: 60, range: 290, rate: 0.78, chain: 5 },
    ],
  },
  spire: {
    id: 'spire', name: 'Chill Spire', kind: 12,
    desc: 'A crystal polyp that rings with cold — pulses chill every few seconds.',
    color: COLORS.cyan, hue: 0.55,
    cost: 100, range: 205, rate: 0.62, damage: 20, attack: 'pulse',
    status: 'chill',
    size: 66,
    levels: [
      { cost: 0,   damage: 20, range: 205, rate: 0.62 },
      { cost: 80,  damage: 32, range: 230, rate: 0.72 },
      { cost: 140, damage: 50, range: 255, rate: 0.85 },
    ],
  },
  urchin: {
    id: 'urchin', name: 'Lance Urchin', kind: 13,
    desc: 'Focuses its spines into a piercing lance of light — hits everything in the line.',
    color: COLORS.magenta, hue: 0.9,
    cost: 140, range: 430, rate: 0.75, damage: 42, attack: 'beam', beamWidth: 26,
    size: 56,
    levels: [
      { cost: 0,   damage: 42, range: 430, rate: 0.75 },
      { cost: 110, damage: 68, range: 470, rate: 0.85 },
      { cost: 190, damage: 105, range: 510, rate: 0.95 },
    ],
  },
  bloom: {
    id: 'bloom', name: 'Ember Bloom', kind: 14,
    desc: 'Lobs burning spore-shells that ignite creatures and leave embers smouldering.',
    color: COLORS.amber, hue: 0.1,
    cost: 130, range: 360, minRange: 110, rate: 0.45, damage: 40, splash: 85,
    attack: 'mortar', status: 'ignite', poolDps: 12, poolDur: 3.5, poolR: 70,
    projSpeed: 480, size: 64,
    levels: [
      { cost: 0,   damage: 40, range: 360, rate: 0.45 },
      { cost: 100, damage: 62, range: 395, rate: 0.52 },
      { cost: 180, damage: 96, range: 430, rate: 0.60 },
    ],
  },
  bramble: {
    id: 'bramble', name: 'Acid Bramble', kind: 15,
    desc: 'A thorn-mound that spits corroding sap — stacks make creatures take more damage.',
    color: COLORS.acid, hue: 0.28,
    cost: 110, range: 185, rate: 2.3, damage: 8, attack: 'spit',
    status: 'corrode', projSpeed: 700,
    size: 52,
    levels: [
      { cost: 0,   damage: 8,  range: 185, rate: 2.3 },
      { cost: 85,  damage: 13, range: 205, rate: 2.6 },
      { cost: 150, damage: 20, range: 225, rate: 3.0 },
    ],
  },
  bulb: {
    id: 'bulb', name: 'Resonant Bulb', kind: 16,
    desc: 'Does not fight — it sings. Nearby towers fire faster and hit harder.',
    color: [0.85, 0.7, 1.0], hue: 0.75,
    cost: 150, range: 200, rate: 0, damage: 0, attack: 'aura',
    buffRate: 0.18, buffDmg: 0.12,
    size: 58,
    levels: [
      { cost: 0,   buffRate: 0.18, buffDmg: 0.12, range: 200 },
      { cost: 120, buffRate: 0.28, buffDmg: 0.20, range: 225 },
      { cost: 200, buffRate: 0.40, buffDmg: 0.30, range: 250 },
    ],
  },
};

export const ENEMIES = {
  mite: {
    id: 'mite', name: 'Gloom Mite', kind: 0,
    color: COLORS.acid, size: 26,
    hp: 34, speed: 130, bounty: 6, damage: 1,
    wobble: 8,
  },
  grub: {
    id: 'grub', name: 'Ember Grub', kind: 1,
    color: COLORS.amber, size: 44,
    hp: 150, speed: 62, bounty: 14, damage: 2,
    wobble: 3,
  },
  wisp: {
    id: 'wisp', name: 'Pale Wisp', kind: 2,
    color: COLORS.violet, size: 32,
    hp: 60, speed: 105, bounty: 9, damage: 1,
    wobble: 14, hover: true,
  },
};

// Wave composition: waves 1-5 are a power fantasy, pressure builds from 8+.
export function waveComp(n) {
  const entries = [];
  const mites = Math.floor(5 + n * 2.2);
  const grubs = n >= 3 ? Math.floor((n - 2) * 1.4) : 0;
  const wisps = n >= 5 ? Math.floor((n - 4) * 1.7) : 0;
  // gentle through the wave-5 power fantasy, compounding from 10+
  const hpMul = Math.pow(1.11, Math.max(0, n - 1)) * (1 + Math.max(0, n - 10) * 0.06);
  const gap = Math.max(0.30, 0.9 - n * 0.03);
  entries.push({ type: 'mite', count: mites, gap, hpMul });
  if (grubs) entries.push({ type: 'grub', count: grubs, gap: gap * 2.4, hpMul, delay: 2.0 });
  if (wisps) entries.push({ type: 'wisp', count: wisps, gap: gap * 1.6, hpMul, delay: 4.0 });
  return { entries, clearBonus: 20 + n * 4 };
}

// Map 1 — "Rootdelta". A single meandering channel from a ridge-gate (far,
// upper-left) down to the Heart (near, lower-right). Control points hand-laid
// in world space; the sim resamples to an arc-length table.
export const MAPS = [
  {
    id: 'rootdelta', name: 'Rootdelta',
    seed: 20260716,
    pathW: 74, // half-width of the ribbon
    points: [
      [-60, 330], [180, 345], [420, 390], [610, 500], [640, 660],
      [500, 780], [430, 900], [560, 985], [820, 995], [1080, 930],
      [1180, 790], [1150, 640], [1250, 520], [1450, 500], [1620, 580],
      [1700, 720], [1690, 870],
    ],
    heart: [1690, 880],
    portal: [-40, 330],
    floraCount: 46,
  },
];

export function depthScale(y) {
  // things near the horizon are farther away
  const t = Math.min(1, Math.max(0, (y - HORIZON_Y) / (WORLD_H - HORIZON_Y)));
  return 0.62 + 0.53 * t;
}
