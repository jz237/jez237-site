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
    color: COLORS.acid, size: 30,
    hp: 34, speed: 130, bounty: 6, damage: 1,
    wobble: 8,
  },
  grub: {
    id: 'grub', name: 'Ember Grub', kind: 1,
    color: COLORS.amber, size: 50,
    hp: 150, speed: 62, bounty: 14, damage: 2,
    wobble: 3,
  },
  wisp: {
    id: 'wisp', name: 'Pale Wisp', kind: 2,
    color: COLORS.violet, size: 36,
    hp: 60, speed: 105, bounty: 9, damage: 1,
    wobble: 14, hover: true, flying: true, // flying: immune to pools + spire pulses
  },
  husk: {
    id: 'husk', name: 'Slate Husk', kind: 17,
    color: [0.55, 0.75, 0.95], size: 48,
    hp: 120, speed: 74, bounty: 16, damage: 2,
    wobble: 2, armor: 9, // flat reduction per hit; corrode stacks pierce it
  },
  brood: {
    id: 'brood', name: 'Brood Carrier', kind: 18,
    color: [0.85, 1.0, 0.45], size: 54,
    hp: 170, speed: 70, bounty: 12, damage: 2,
    wobble: 4, splitInto: 'mite', splitCount: 6,
  },
  shellback: {
    id: 'shellback', name: 'Shellback', kind: 19,
    color: [0.4, 0.9, 1.0], size: 52,
    hp: 140, speed: 66, bounty: 18, damage: 2,
    wobble: 3, shield: 120, // absorbs damage & blocks status until broken
  },
  dartfin: {
    id: 'dartfin', name: 'Dartfin', kind: 20,
    color: [1.0, 0.5, 0.9], size: 34,
    hp: 46, speed: 215, bounty: 10, damage: 1,
    wobble: 10,
  },
  bulwark: {
    id: 'bulwark', name: 'Bulwark', kind: 21,
    color: [1.0, 0.45, 0.25], size: 78,
    hp: 900, speed: 38, bounty: 45, damage: 4,
    wobble: 1,
  },
  spectre: {
    id: 'spectre', name: 'Spectre', kind: 22,
    color: [0.75, 0.6, 1.0], size: 42,
    hp: 110, speed: 92, bounty: 20, damage: 2,
    wobble: 8, hover: true, phasing: { visible: 2.0, ethereal: 1.3 },
  },
  regen: {
    id: 'regen', name: 'Mendling', kind: 23,
    color: [0.5, 1.0, 0.7], size: 44,
    hp: 200, speed: 58, bounty: 22, damage: 2,
    wobble: 3, regenPct: 0.035,
  },
  broodmother: {
    id: 'broodmother', name: 'BROODMOTHER', kind: 24,
    color: [0.9, 1.0, 0.3], size: 110,
    hp: 2400, speed: 30, bounty: 200, damage: 6,
    wobble: 1, miniboss: true, spawnEvery: 4.2, spawnType: 'mite', spawnN: 2,
  },
  unlit: {
    id: 'unlit', name: 'THE UNLIT', kind: 25,
    color: [1.0, 0.62, 0.2], size: 195,
    hp: 9000, speed: 24, bounty: 600, damage: 20,
    wobble: 0.5, boss: true, bossKind: 'unlit',
    // telegraphed dark pulse: 2.6s wind-up glow, then stuns towers in radius
    pulse: { every: 8.0, telegraph: 2.6, radius: 330, stun: 2.4 },
    phase2At: 0.5, // at 50% hp: cracks open, faster, pulse spawns mites
  },
};

// Endless mutators: named twists on post-campaign waves so deep runs stay
// surprising. Applied to non-boss waves past 20, picked by wave number.
export const MUTATORS = [
  { id: 'swift',  name: 'THE SWIFT TIDE',   desc: 'they come fast and thin — +45% speed, −20% hp',
    speedMul: 1.45, hpAdj: 0.8 },
  { id: 'shell',  name: 'THE THICK SHELL',  desc: 'chitin on every back — corrode pierces it',
    armorAdd: 6 },
  { id: 'veiled', name: 'THE VEILED SURGE', desc: 'spectres ride among them',
    escort: { type: 'spectre', count: 6 } },
  { id: 'brood',  name: 'BROODSWELL',       desc: 'carriers heavy with children',
    escort: { type: 'brood', count: 5 } },
  { id: 'fins',   name: 'STORM OF FINS',    desc: 'a river of dartfins',
    escort: { type: 'dartfin', count: 14 } },
  { id: 'mend',   name: 'THE MENDING',      desc: 'their wounds close — burn them',
    regenAdd: 0.015 },
  { id: 'golden', name: 'THE GOLDEN TIDE',  desc: 'rich prey, thick hide — +60% bounty, +25% hp',
    bountyMul: 1.6, hpAdj: 1.25 },
];

// Boss #2 — a summoner with shield windows, no tower stuns: the opposite
// rhythm of THE UNLIT.
export const TIDECALLER = {
  id: 'tidecaller', name: 'THE TIDECALLER', kind: 30,
  color: [0.35, 0.85, 1.0], size: 175,
  hp: 8200, speed: 26, bounty: 650, damage: 20,
  wobble: 3, hover: true, boss: true, bossKind: 'tidecaller',
  summon: { every: 9.0, telegraph: 1.8, types: ['mite', 'dartfin', 'wisp'], n: 5 },
  shieldCycle: { amount: 2400, every: 13.0, telegraph: 2.2 },
  phase2At: 0.5,
};
ENEMIES.tidecaller = TIDECALLER;

// Boss #3 — the divider: sheds sporelings at health thresholds and heals
// its escort with a spore aura (ignite blocks regen — burn is the counter).
export const MYCELIAL = {
  id: 'mycelial', name: 'THE MYCELIAL', kind: 31,
  color: [0.72, 0.95, 0.30], size: 185,
  hp: 8800, speed: 22, bounty: 700, damage: 20,
  wobble: 1, boss: true, bossKind: 'mycelial',
  splitAt: [0.66, 0.33], healAura: { radius: 230, pct: 0.012 },
  phase2At: 0.33,
};
ENEMIES.mycelial = MYCELIAL;
ENEMIES.sporeling = {
  id: 'sporeling', name: 'Sporeling', kind: 31,
  color: [0.72, 0.95, 0.30], size: 78,
  hp: 950, speed: 55, bounty: 60, damage: 5,
  wobble: 2, child: true,
};

// Wave table: 1-5 power fantasy, new species introduced in bands, pressure
// compounds from 10+. Boss waves: 10 (broodmother), 20 (THE UNLIT). After the
// campaign (20), endless mode re-runs the table with harsher multipliers.
export function waveComp(n) {
  const entries = [];
  const hpMul = Math.pow(1.105, Math.max(0, n - 1)) * (1 + Math.max(0, n - 10) * 0.045);
  const gap = Math.max(0.28, 0.9 - n * 0.03);
  const push = (type, count, g = gap, delay = 0, hm = hpMul) => {
    if (count > 0) entries.push({ type, count: Math.floor(count), gap: g, hpMul: hm, delay });
  };
  if (n === 10) {
    // boss base hp IS the wave-10 value — no global multiplier on top
    push('broodmother', 1, 1, 1.0, 1);
    push('mite', 14, gap, 3);
    push('husk', 4, gap * 2.5, 6);
    return { entries, clearBonus: 120, boss: 'broodmother' };
  }
  if (n === 20 || (n > 20 && n % 10 === 0)) {
    const bossHm = 1 + Math.max(0, n - 20) * 0.12; // scales only past 20
    const roster = ['unlit', 'tidecaller', 'mycelial'];
    const bossId = roster[((n - 20) / 10) % roster.length];
    push(bossId, 1, 1, 1.0, bossHm);
    if (bossId === 'tidecaller') { push('shellback', 6, gap * 1.6, 4); push('wisp', 8, gap, 6); }
    else if (bossId === 'mycelial') { push('regen', 5, gap * 2, 4); push('grub', 8, gap * 1.4, 6); }
    else { push('dartfin', 10, gap, 4); push('spectre', 4, gap * 2, 8); }
    return { entries, clearBonus: 200 + n * 5, boss: bossId };
  }
  push('mite', 5 + n * 1.8);
  if (n >= 3) push('grub', (n - 2) * 1.2, gap * 2.4, 2.0);
  if (n >= 5) push('wisp', (n - 4) * 1.4, gap * 1.6, 4.0);
  if (n >= 6) push('husk', (n - 5) * 1.2, gap * 2.2, 3.0);
  if (n >= 8) push('brood', (n - 7) * 0.9, gap * 3.0, 5.0);
  if (n >= 9) push('dartfin', (n - 8) * 1.6, gap * 1.2, 1.0);
  if (n >= 11) push('shellback', (n - 10) * 1.1, gap * 2.4, 4.0);
  if (n >= 12) push('regen', (n - 11) * 0.8, gap * 2.8, 6.0);
  if (n >= 13) push('spectre', (n - 12) * 0.9, gap * 2.2, 7.0);
  if (n >= 14) push('bulwark', (n - 13) * 0.5, gap * 4.0, 8.0);
  // deep endless: a named mutator twists every non-boss wave past 20
  let mutator = null;
  if (n > 20) {
    mutator = MUTATORS[(n * 7 + 3) % MUTATORS.length];
    if (mutator.hpAdj) for (const e of entries) e.hpMul *= mutator.hpAdj;
    if (mutator.escort) push(mutator.escort.type, mutator.escort.count, gap * 1.3, 2.0);
  }
  return { entries, clearBonus: 20 + n * 4, mutator };
}

// Maps. Each map carries one or more full splines portal→heart; branching is
// expressed as multiple paths sharing prefix/suffix points. Control points
// hand-laid in world space; the sim resamples each to an arc-length table.
export const MAPS = [
  {
    id: 'rootdelta', name: 'Rootdelta',
    blurb: 'one deep channel — learn the water',
    seed: 20260716,
    pathW: 74, // half-width of the ribbon
    paths: [[
      [-60, 330], [180, 345], [420, 390], [610, 500], [640, 660],
      [500, 780], [430, 900], [560, 985], [820, 995], [1080, 930],
      [1180, 790], [1150, 640], [1250, 520], [1450, 500], [1620, 580],
      [1700, 720], [1690, 870],
    ]],
    heart: [1690, 880],
    portal: [-40, 330],
    floraCount: 46,
    tint: [1, 1, 1], // baseline teal-dusk
  },
  {
    id: 'twinveins', name: 'Twin Veins',
    blurb: 'the flow splits around the old massif',
    seed: 20260717,
    pathW: 68,
    paths: [
      [ // upper vein
        [-60, 420], [150, 430], [360, 470], [620, 390], [900, 345],
        [1150, 385], [1355, 480], [1500, 620], [1600, 760], [1655, 862],
      ],
      [ // lower vein
        [-60, 420], [150, 430], [360, 470], [520, 650], [630, 830],
        [830, 945], [1080, 965], [1300, 905], [1500, 825], [1655, 862],
      ],
    ],
    heart: [1660, 870],
    portal: [-40, 420],
    floraCount: 56,
    tint: [0.84, 0.97, 1.16], // colder — the abyssal veins
  },
  {
    id: 'caldera', name: 'Emberfall Caldera',
    blurb: 'the long way round the sunken mouth — or straight through it',
    seed: 20260718,
    pathW: 64,
    pathWeights: [0.66, 0.34], // most take the rim road; the plunge stays a threat
    paths: [
      [ // the rim road
        [-60, 270], [200, 285], [500, 305], [850, 325], [1200, 365],
        [1500, 470], [1655, 650], [1500, 830], [1200, 925], [900, 965],
        [620, 970], [390, 948],
      ],
      [ // the plunge
        [-60, 270], [200, 285], [500, 305], [700, 435], [805, 605],
        [755, 765], [610, 885], [430, 940], [390, 948],
      ],
    ],
    heart: [370, 950],
    portal: [-40, 265],
    floraCount: 50,
    tint: [1.32, 0.92, 0.72], // ember-warm — the caldera smoulders
  },
];

export function depthScale(y) {
  // things near the horizon are farther away
  const t = Math.min(1, Math.max(0, (y - HORIZON_Y) / (WORLD_H - HORIZON_Y)));
  return 0.62 + 0.53 * t;
}
