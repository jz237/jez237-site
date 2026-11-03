// Asteroids 2026 — tuning, pilots, sectors, power-ups and party twists.
export const VERSION = 'v1.2.2';

// World units. The belt is a wrap-around rectangle on the XZ plane: x in [-AW, AW], z in [-AH, AH].
// Screen up is -z. A heading of 0 points up the screen; positive angles turn clockwise.
export const F = {
  AW: 30, AH: 17,
  shipR: 0.95,
  hull: 10,
  bossHull: 12,         // your hull for the final stand
  turn: 5.4,            // rad/s
  thrust: 30,           // acceleration
  maxSpeed: 19,
  drag: 0.42,           // per second (exponential)
  brake: 0.55,          // reverse thrust fraction
  shotSpeed: 40,
  shotLife: 0.95,
  fireCD: 0.2,
  dashSpeed: 30,
  dashTime: 0.22,
  dashCD: 2.2,
  inv: 1.0,             // invulnerable after a hit
  odTime: 6,
  odMax: 100,
  rockR: [0, 0.95, 1.65, 2.7, 4.1],   // by size 1..4
  rockHP: [0, 1, 1, 2, 4],
  rockSpeed: [0, [6, 9.5], [4, 6.5], [2.4, 4], [1.6, 2.6]],
  ownTime: 1.4,         // fragments fly as the breaker's shards for this long
  shardKick: 9,
  orbLife: 12,
  maxOrbs: 3,
};

export const COLORS = { p1: 0x39f3ff, p2: 0xff4fd8 };

// Personas drive the AI. aim = aim error (rad), react = seconds between re-plans, range = preferred
// fighting distance, hunt = how much it prefers the rival over rocks, dodge = threat look-ahead skill,
// dash/od = how keen it is on those, greed = power-up appetite, shard = how often it sets up shard shots.
export const PILOTS = {
  razor: {
    key: 'razor', name: 'RAZOR', title: 'THE HOTSHOT', color: 0xff7a1f, accent: 0xffd23f, look: 'razor',
    blurb: 'A cocky ace who flies straight at you and dares you to blink.',
    ai: { aim: 0.2, react: 0.16, range: 9, hunt: 0.8, dodge: 0.55, dash: 0.8, od: 0.7, greed: 0.45, shard: 0.15, fire: 0.85 },
  },
  lyra: {
    key: 'lyra', name: 'LYRA', title: 'THE SNIPER', color: 0x9b7bff, accent: 0x7cf2ff, look: 'lyra',
    blurb: 'Keeps her distance and never wastes a shot.',
    ai: { aim: 0.09, react: 0.14, range: 22, hunt: 0.65, dodge: 0.75, dash: 0.45, od: 0.6, greed: 0.55, shard: 0.25, fire: 0.55 },
  },
  grit: {
    key: 'grit', name: 'GRIT', title: 'THE MINER', color: 0xffc23a, accent: 0xff6a3a, look: 'grit',
    blurb: 'Forty years in the belt. Breaks rocks so the pieces fly at you.',
    ai: { aim: 0.15, react: 0.15, range: 15, hunt: 0.4, dodge: 0.65, dash: 0.5, od: 0.75, greed: 0.8, shard: 0.85, fire: 0.75 },
  },
  cipher: {
    key: 'cipher', name: 'CIPHER', title: 'THE MACHINE', color: 0x4dffa0, accent: 0xe8fff4, look: 'cipher',
    blurb: 'A combat AI that reads your flight path before you fly it.',
    ai: { aim: 0.075, react: 0.1, range: 14, hunt: 0.7, dodge: 0.95, dash: 0.7, od: 0.85, greed: 0.6, shard: 0.55, fire: 0.75 },
  },
  maw: {
    key: 'maw', name: 'THE MAW', title: 'WORLD EATER', color: 0xff2a48, accent: 0xff9a3a, look: 'maw', boss: true,
    blurb: 'A hive of rock and hunger the size of a moon.',
    ai: { aim: 0.05, react: 0.1, range: 14, hunt: 0.7, dodge: 0.9, dash: 0.7, od: 0.85, greed: 0.6, shard: 0.5, fire: 0.75 },
  },
};
export const LADDER = ['razor', 'lyra', 'grit', 'cipher', 'maw'];
// the campaign is flown by the Ace; the rivals you beat join the roster
export const HUMAN = { name: 'ACE', title: 'CHALLENGER', color: COLORS.p1, accent: 0xe8ffff, look: 'ace' };
export const HUMAN2 = { name: 'NOVA', title: 'PLAYER 2', color: COLORS.p2, accent: 0xffe8fb, look: 'ace' };
// mirror matches: the AI copy of your own pilot flies in these colours
export const SHADOW = { razor: 0xff2f6a, lyra: 0x4f8bff, grit: 0xb0ff3a, cipher: 0xff5af0, maw: 0x9a2aff };
export const ROSTER = ['p1', 'razor', 'lyra', 'grit', 'cipher', 'maw'];

// Perks: what each pilot brings when a human flies it
export const PERKS = {
  p1: { name: 'VETERAN', desc: 'Overdrive charges 30% faster.', od: 1.3 },
  razor: { name: 'AFTERBURNER', desc: 'Dash recharges twice as fast and rams for double damage.', dashCD: 0.5, ram: 2 },
  lyra: { name: 'RAILGUN', desc: 'Every fourth shot is a piercing rail that hits for two.', rail: 4 },
  grit: { name: 'PROSPECTOR', desc: 'Power-ups drop twice as often and your shards hit for three.', drops: 2, shard: 3 },
  cipher: { name: 'TARGET LOCK', desc: 'Your shots curve gently onto the rival.', lock: 1 },
  maw: { name: 'DEVOURER', desc: 'Rocks you ram are eaten, not felt. Every third repairs your hull.', devour: 1 },
};

// Sectors (arenas). mix = rock kinds by weight; music = loop name.
export const ARENAS = [
  { key: 'drift', name: 'KUIPER DRIFT', music: 'drift', sky: [0x02030c, 0x1d3a8a, 0x2fd6ff], grid: 0x2a7bff, planet: 0x6aa8ff,
    rocks: 6, mix: { stone: 70, ice: 22, gold: 5, volatile: 3 }, hazard: null },
  { key: 'storm', name: 'ION STORM', music: 'storm', sky: [0x05020e, 0x3a1a8a, 0xb46bff], grid: 0x9a5bff, planet: 0xc08aff,
    rocks: 6, mix: { stone: 58, crystal: 30, gold: 6, volatile: 6 }, hazard: 'storm' },
  { key: 'horizon', name: 'EVENT HORIZON', music: 'horizon', sky: [0x0a0204, 0x4a1210, 0xff8a3a], grid: 0xff6a2a, planet: 0xff9a5a,
    rocks: 7, mix: { stone: 62, volatile: 20, gold: 8, ice: 10 }, hazard: 'hole' },
  { key: 'comet', name: 'COMET LANE', music: 'comet', sky: [0x020a0a, 0x0e4a46, 0x5affd8], grid: 0x2affc0, planet: 0x7affe0,
    rocks: 6, mix: { stone: 58, ice: 26, gold: 8, volatile: 8 }, hazard: 'comet' },
  { key: 'maw', name: 'THE MAW', music: 'boss', sky: [0x050103, 0x2a0610, 0x7a1424], grid: 0xb8203c, planet: 0xc04a30,
    rocks: 3, mix: { stone: 70, volatile: 30 }, hazard: 'boss' },
];

export const ROCK_KINDS = {
  stone: { color: 0x8a8076, glow: 0x000000, score: 1 },
  ice: { color: 0xa8d8ff, glow: 0x2a80ff, score: 1 },
  gold: { color: 0xffc23a, glow: 0xffa020, score: 5 },
  crystal: { color: 0xb08aff, glow: 0x9a5bff, score: 2 },
  volatile: { color: 0x4a2a24, glow: 0xff3a1a, score: 2 },
  comet: { color: 0xcfefff, glow: 0x6affff, score: 2 },
};
export const KIND_INDEX = { stone: 0, ice: 1, gold: 2, crystal: 3, volatile: 4, comet: 5 };

export const POWERUPS = {
  triple: { name: 'TRIPLE SHOT', glyph: '⁂', color: 0x39f3ff, desc: 'Three-way spread', time: 12, sfx: 'pucollect', voice: 'triple', w: 10 },
  rapid: { name: 'RAPID FIRE', glyph: '»', color: 0xffd23f, desc: 'Double fire rate', time: 12, sfx: 'pucollect', voice: 'rapid', w: 10 },
  shield: { name: 'SHIELD', glyph: '⬡', color: 0x6ad8ff, desc: 'Blocks the next three hits', time: 18, sfx: 'shieldup', voice: 'shield', w: 9 },
  missiles: { name: 'MISSILES', glyph: '➶', color: 0xff8a3a, desc: 'Shots become homing missiles', time: 9, sfx: 'missile', voice: 'missiles', w: 7 },
  magnet: { name: 'MAGNET', glyph: '◎', color: 0xff5ad0, desc: 'Pulls power-ups and gold to you', time: 14, sfx: 'magnet', voice: 'magnet', w: 6 },
  repair: { name: 'REPAIR', glyph: '✚', color: 0x4dff8a, desc: 'Restores two hull', time: 0, sfx: 'repair', voice: 'repair', w: 8 },
  nova: { name: 'NOVA BOMB', glyph: '✹', color: 0xffffff, desc: 'Blasts every nearby rock and the rival', time: 0, sfx: 'nova', voice: 'nova', w: 6 },
  phase: { name: 'PHASE', glyph: '◌', color: 0xb6a8ff, desc: 'Fly through rocks unharmed', time: 8, sfx: 'phase', voice: 'phase', w: 6 },
  chrono: { name: 'CHRONO', glyph: '⧗', color: 0x8affff, desc: 'Slows the rival and the rocks', time: 7, sfx: 'chrono', voice: 'chrono', w: 5 },
  drone: { name: 'DRONE', glyph: '⟡', color: 0x9affc0, desc: 'A wingman that shoots for you', time: 15, sfx: 'drone', voice: 'drone', w: 6 },
  mines: { name: 'MINES', glyph: '✱', color: 0xff3a5a, desc: 'Drops three proximity mines', time: 0, sfx: 'mine', voice: 'mines', w: 6 },
  rail: { name: 'RAILGUN', glyph: '⟿', color: 0xe0d0ff, desc: 'Piercing shots that hit for two', time: 9, sfx: 'rail', voice: 'rail', w: 6 },
  well: { name: 'GRAVITY WELL', glyph: '◉', color: 0xc070ff, desc: 'Throws a black hole that drags rocks', time: 0, sfx: 'well', voice: 'well', w: 5 },
};
export const POWERUP_KEYS = Object.keys(POWERUPS);

// Campaign build-up: the early sectors are gentler and each one is a step harder. Each rival has its
// own easing (Razor's all-out rushing needs the most), measured with scripts/asteroids-2026/ramp_check.mjs
// so a steady stand-in pilot wins less every sector (~90% / 70% / 45% / 20%). Multiplies the chosen
// difficulty's AI; rocks = rock speed. The Maw keeps its own difficulty.
export const RAMP = [
  { aim: 3, react: 2.1, fire: 0.42, dodge: 0.45, rocks: 0.8 },
  { aim: 1.55, react: 1.32, fire: 0.7, dodge: 0.74, rocks: 0.87 },
  { aim: 1.32, react: 1.15, fire: 0.82, dodge: 0.85, rocks: 0.94 },
  { aim: 1.7, react: 1.32, fire: 0.7, dodge: 0.75, rocks: 1 },
  { aim: 1, react: 1, fire: 1, dodge: 1, rocks: 1 },
];
export function rampAI(ai, stage) {
  const r = RAMP[Math.max(0, Math.min(RAMP.length - 1, stage))];
  return { aim: Math.min(4, ai.aim * r.aim), react: Math.min(3, ai.react * r.react), fire: ai.fire * r.fire, dodge: ai.dodge * r.dodge };
}
// Belt Run: wave 1 = 3 slow rocks, then a few more and a little faster every wave (speed tops out by wave 15)
export const beltRocks = (w) => Math.min(12, 2 + w);
export const beltSpeed = (w) => Math.min(2, 0.8 + 0.05 * (w - 1) + 0.004 * (w - 1) * (w - 1));

export const DIFFICULTY = {
  easy: { label: 'EASY', scoreMul: 0.7, ai: { aim: 1.8, react: 1.6, fire: 0.65, dodge: 0.7 }, boss: 0.75 },
  normal: { label: 'NORMAL', scoreMul: 1, ai: { aim: 1, react: 1, fire: 1, dodge: 1 }, boss: 1 },
  hard: { label: 'HARD', scoreMul: 1.5, ai: { aim: 0.6, react: 0.7, fire: 1.2, dodge: 1.15 }, boss: 1.25 },
};

// Campaign hangar: ore you mine buys upgrades between sectors (they last for the rest of the run)
export const UP_COST = [60, 110, 170];
export const UPGRADES = {
  hull: { name: 'HULL PLATING', glyph: '⬢', color: 0x4dff8a, lv: ['+2 hull', '+4 hull', '+6 hull'] },
  cannon: { name: 'CANNON', glyph: '»', color: 0xffd23f, lv: ['Fires 12% faster', 'Fires 24% faster', '24% faster + twin-linked shots'] },
  boost: { name: 'AFTERBURNERS', glyph: '➤', color: 0x9affff, lv: ['Boost recharges 20% faster', 'Boost recharges 40% faster', 'Boost recharges 60% faster'] },
  od: { name: 'REACTOR', glyph: '✦', color: 0xffa02a, lv: ['Overdrive charges 25% faster, lasts +1 s', 'Charges 50% faster, lasts +2 s', 'Charges 75% faster, lasts +3 s'] },
  shield: { name: 'SHIELD EMITTER', glyph: '⬡', color: 0x6ad8ff, lv: ['Start every round behind a 1-hit shield', '2-hit shield', '3-hit shield'] },
};
export const UP_KEYS = Object.keys(UPGRADES);

// Medals: three challenges per sector, earned in the campaign on any difficulty
export const MEDALS = [
  { id: 's1flaw', sector: 0, name: 'UNSCRATCHED', desc: 'Win a round in Kuiper Drift without losing any hull' },
  { id: 's1sweep', sector: 0, name: 'CLEAN SWEEP', desc: 'Beat Razor two rounds to nil' },
  { id: 's1gold', sector: 0, name: 'GOLD DIGGER', desc: 'Break three gold rocks in Kuiper Drift' },
  { id: 's2flaw', sector: 1, name: 'UNSCRATCHED', desc: 'Win a round in the Ion Storm without losing any hull' },
  { id: 's2storm', sector: 1, name: 'STORM CHASER', desc: 'Beat Lyra without being hit by lightning or a crystal arc' },
  { id: 's2shard', sector: 1, name: 'SHARD MASTER', desc: 'Land three shard strikes in the Ion Storm' },
  { id: 's3flaw', sector: 2, name: 'UNSCRATCHED', desc: 'Win a round at the Event Horizon without losing any hull' },
  { id: 's3escape', sector: 2, name: 'ESCAPE VELOCITY', desc: 'Beat Grit without ever falling into the black hole' },
  { id: 's3snipe', sector: 2, name: 'SNIPER', desc: 'Claim three power-ups by shooting them at the Event Horizon' },
  { id: 's4flaw', sector: 3, name: 'UNSCRATCHED', desc: 'Win a round in Comet Lane without losing any hull' },
  { id: 's4gate', sector: 3, name: 'WORMHOLE ACE', desc: 'Fly through the warp gates six times in Comet Lane' },
  { id: 's4dare', sector: 3, name: 'DAREDEVIL', desc: 'Boost through danger five times in Comet Lane' },
  { id: 's5fast', sector: 4, name: 'SPEED KILL', desc: 'Defeat the Maw in under two minutes' },
  { id: 's5clean', sector: 4, name: 'UNTOUCHABLE', desc: 'Defeat the Maw losing three hull or less' },
  { id: 's5eyes', sector: 4, name: 'EYE SURGEON', desc: 'Shut all four of the Maw\'s eyes within a minute' },
];

// Versus party twists
export const TWISTS = {
  twin: { name: 'TWIN CANNONS', desc: 'Every ship fires double' },
  tiny: { name: 'TINY SHIPS', desc: 'Half-size ships, twice as hard to hit' },
  mega: { name: 'MEGA ROCKS', desc: 'Huge rocks that break in four stages' },
  gold: { name: 'GOLD RUSH', desc: 'Power-ups everywhere' },
  glass: { name: 'GLASS HULLS', desc: 'Three hull points each' },
  drift: { name: 'ZERO FRICTION', desc: 'No drag: pure momentum' },
  hyper: { name: 'HYPER SPEED', desc: 'Everything moves 35% faster' },
};
