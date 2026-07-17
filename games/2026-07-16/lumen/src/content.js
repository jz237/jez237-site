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
    size: 58,
    levels: [
      { cost: 0,   damage: 24, range: 235, rate: 0.6, chain: 3 },
      { cost: 90,  damage: 38, range: 260, rate: 0.68, chain: 4 },
      { cost: 160, damage: 60, range: 290, rate: 0.78, chain: 5 },
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
