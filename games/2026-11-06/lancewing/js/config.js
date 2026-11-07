// Lancewing 2026 - every tunable number lives here. The RAMP table drives difficulty; nothing else in
// the game hard-codes rider pace, numbers, spacing, skill, hazard rate or warning time.
export const VERSION = '1.4.0';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ the arena and the flight model
// The playfield is a 2D slice wrapped onto a cylinder: x = metres around the ring (wraps at C), y = metres
// above the storm sea. The renderer bends it round the storm spire at radius R.
export const F = {
  C: 96,                 // ring circumference (m)
  H: 27,                 // storm ceiling: riders bounce off it
  sea: 0.3,              // touching the sea below this height = a lost life (riders splash too)
  g: 15,                 // gravity, m/s^2
  fall: 16,              // terminal fall speed
  flap: 6.6,             // one wing beat: upward impulse (WING POWER adds 7% a level)
  flapMax: 8.8,          // the fastest a beat can push you upward
  tapCD: 0.11,           // the quickest two beats can follow each other
  holdCD: 0.3,           // holding flap beats at this slower cadence
  flapPush: 1.3,         // each beat also pushes a little the way you steer
  airAcc: 9.5, airMax: 9.2, airDrag: 0.28,
  runAcc: 18, runMax: 6.6, runFric: 14,
  skidV: 3.2, skidDec: 24,   // reversing on a ledge above skidV skids to a stop first
  hw: 0.95,              // rider half width
  hh: 2.1,               // rider height (feet at y)
  lanceH: 1.5,           // lance tip height above the feet: the higher tip wins a duel
  dead: 0.32,            // closer than this = clang: both bounce apart
  reach: 1.95,           // duel contact distance (centre to centre)
  bounce: 7.2,           // clang knockback
  inv: 2.6, hitInv: 1.4, respawn: 1.6, clearR: 11,
  ledgeT: 1.1,           // ledge slab thickness
  rockA: 1.3, rockB: 0.35,   // the rock point under a ledge hangs rockA + rockB x its half width below the slab (solid)
  coreR: 1.35,           // reach for collecting an ember core
};
F.R = F.C / (2 * Math.PI);
// The rock under a ledge is solid: a parabola from the slab's lower corners down to rockHang(w) under its middle.
// The sim collides riders, cores and the Stormhunter with it and the renderer builds the rock from the same curve.
export const rockHang = (w) => F.rockA + F.rockB * w;
// how far below the slab the rock reaches at dx metres from the ledge's middle
export const rockDrop = (w, dx) => { const u = dx / w; return u <= -1 || u >= 1 ? 0 : rockHang(w) * (1 - u * u); };

// ------------------------------------------------------------------ sectors and their looks
export const SECTORS = [
  { key: 'ruins', name: 'SUNSET RUINS', boss: 'gale', music: 's1' },
  { key: 'caverns', name: 'CRYSTAL CAVERNS', boss: 'wyvern', music: 's2' },
  { key: 'foundry', name: 'SKY FOUNDRY', boss: 'colossus', music: 's3' },
  { key: 'glacier', name: 'AURORA GLACIER', boss: 'leviathan', music: 's4' },
  { key: 'eclipse', name: 'ECLIPSE CITADEL', boss: 'sovereign', music: 's5' },
];
export const WAVES = 4;   // waves per sector, then the boss

// ledge layouts, one per sector: [position round the ring 0..1, top height, half width, flags]
// flags: p = player respawn, s = riders form here, c = can crumble
export const LAYOUT = [
  [[0.0, 3.2, 6.4, 'ps'], [0.25, 3.7, 4.4, 's'], [0.5, 3.2, 6.0, 's'], [0.75, 3.7, 4.4, ''],
    [0.125, 9.4, 3.8, 'c'], [0.375, 10.4, 4.0, 'sc'], [0.625, 9.4, 3.8, 'c'], [0.875, 10.4, 4.0, 'sc'],
    [0.045, 16.4, 3.2, 'c'], [0.3, 17.0, 3.0, 's'], [0.545, 16.4, 3.4, 'c'], [0.8, 17.0, 3.0, 's'], [0.42, 22.0, 2.6, 'c']],
  [[0.0, 3.0, 5.8, 'ps'], [0.2, 4.4, 3.6, 's'], [0.4, 3.0, 5.0, ''], [0.62, 4.0, 4.6, 's'], [0.82, 3.4, 4.0, 'c'],
    [0.1, 10.8, 3.4, 'sc'], [0.31, 9.0, 3.6, 'c'], [0.51, 11.2, 3.4, 's'], [0.72, 9.6, 3.8, 'c'], [0.92, 11.6, 3.0, 'c'],
    [0.2, 17.4, 3.4, 's'], [0.42, 16.2, 2.8, 'c'], [0.62, 17.8, 3.2, 'c'], [0.84, 16.8, 3.0, 's']],
  [[0.0, 3.4, 6.0, 'ps'], [0.28, 3.4, 4.6, 's'], [0.55, 3.8, 5.2, ''], [0.8, 3.2, 3.8, 'c'],
    [0.14, 9.8, 4.2, 'sc'], [0.41, 10.6, 3.2, 'c'], [0.68, 9.4, 4.0, 's'], [0.91, 10.2, 3.0, 'c'],
    [0.06, 16.0, 2.8, 'c'], [0.27, 17.6, 3.6, 's'], [0.5, 15.8, 2.8, 'c'], [0.72, 17.2, 3.4, 'sc'], [0.36, 22.4, 2.4, 'c'], [0.86, 22.0, 2.4, 'c']],
  [[0.0, 3.0, 5.6, 'ps'], [0.22, 3.6, 3.8, 's'], [0.47, 3.2, 4.8, 'c'], [0.73, 3.6, 4.2, 's'],
    [0.11, 10.0, 3.4, 'c'], [0.34, 9.0, 3.2, 'sc'], [0.6, 10.8, 3.4, 'c'], [0.86, 9.6, 3.6, 's'],
    [0.0, 16.8, 2.6, 'c'], [0.23, 16.0, 3.0, 's'], [0.47, 17.4, 2.8, 'c'], [0.7, 16.2, 3.0, 'sc'], [0.6, 22.4, 2.2, 'c'], [0.12, 22.0, 2.2, 'c']],
  [[0.0, 3.4, 5.4, 'ps'], [0.25, 3.0, 3.6, 'sc'], [0.5, 3.6, 5.0, 's'], [0.75, 3.0, 3.6, 'c'],
    [0.12, 9.6, 3.0, 'c'], [0.37, 10.6, 3.2, 's'], [0.62, 9.4, 3.0, 'c'], [0.88, 10.6, 3.2, 'sc'],
    [0.02, 16.6, 2.6, 'c'], [0.25, 17.4, 2.8, 's'], [0.5, 16.2, 2.6, 'c'], [0.75, 17.4, 2.8, 's'], [0.38, 22.6, 2.2, 'c'], [0.88, 22.2, 2.2, 'c']],
];

// ------------------------------------------------------------------ RAMP: the whole difficulty curve
// Each sector row gives [value at its first wave, value at its last]; the game interpolates wave by wave
// and each sector starts about where the last one ended. NORMAL is a medium game from the first wave
// (the player asked for "start medium difficulty and ramp up"); EASY scales it down to a gentle start.
//   spd     rider speed multiplier (top speed, acceleration, beat strength)
//   count   riders per wave (re-formed riders come on top of these)
//   active  most riders in the air at once
//   gap     seconds between riders forming
//   warn    seconds of warning: rune glow before a rider forms, and the base of every hazard / attack tell
//   react   seconds between rider decisions (lower = sharper)
//   skill   how well riders keep the higher lance (0..1): how close they hold their target height
//   aggr    how keenly riders hunt you instead of wandering
//   coreT   seconds before an ember core re-ignites into a stronger rider
//   spout   seconds between sea spouts (from wave index spoutW); bolt / boltW the same for spire lightning
//   cast    stormcaller casting rate
//   hunt    seconds a wave can run before the Stormhunter comes
//   drop    power-up drop rate multiplier
//   armor   armour charges given each wave (rounded)
//   surv    seconds a survival wave lasts (read at that wave); survCap = riders added to `active` during it
//   bossHP  boss weak point armour multiplier; bossRate scales boss attack cadence and speed
// Tuned (stage 4) with scripts/lancewing/ramp_check.mjs: the human-like autopilot clears each sector from its first wave
// with 4 lives and TYPICAL_UP about 87 / 62 / 47 / 35 / 19 % on NORMAL (target 85 / 65 / 45 / 30 / 18) and every
// value only ever rises (or, for warn / gap / react / coreT, falls) from one wave to the next across the whole campaign.
// 1.3 (solid rock under the ledges): S3 boss armour 2.8 -> 2.4 (no hiding inside the rock from molten blobs any more)
// and S5 boss cadence 1.25 -> 1.6 (the Sovereign now flies in the open between the ledges, so it is easier to reach).
//   mix     which riders can come and how often
export const RAMP = [
  { spd: [0.84, 0.86], count: [7, 8], active: [3, 3], gap: [1.8, 1.6], warn: [1.2, 1.1], react: [0.45, 0.45], skill: [0.37, 0.4], aggr: [0.6, 0.64], coreT: [9, 8.2],
    spout: [16, 12.5], spoutW: 1, bolt: [0, 0], boltW: 9, cast: [1, 1], hunt: [75, 66], drop: 1.25, armor: [1, 1], surv: [28, 28], survCap: 0, bossHP: 1, bossRate: 1.2,
    mix: { skirmisher: 1, lancer: 0.55, reaver: 0.12 } },
  { spd: [0.86, 0.9], count: [8, 8], active: [3, 3.4], gap: [1.6, 1.5], warn: [1.06, 0.97], react: [0.45, 0.42], skill: [0.4, 0.42], aggr: [0.64, 0.66], coreT: [8.2, 7.6],
    spout: [13, 11], spoutW: 0, bolt: [0, 0], boltW: 9, cast: [1, 1], hunt: [66, 59], drop: 1.1, armor: [1, 1], surv: [34, 34], survCap: 0, bossHP: 1, bossRate: 1.1,
    mix: { skirmisher: 0.8, lancer: 0.85, reaver: 0.25, shieldbearer: 0.2 } },
  { spd: [0.92, 0.98], count: [8, 9], active: [3.4, 3.8], gap: [1.5, 1.42], warn: [0.94, 0.86], react: [0.42, 0.38], skill: [0.42, 0.48], aggr: [0.66, 0.7], coreT: [7.6, 7],
    spout: [11.5, 10], spoutW: 0, bolt: [16, 13], boltW: 1, cast: [1, 1], hunt: [59, 53], drop: 1, armor: [0, 0], surv: [34, 34], survCap: 0, bossHP: 2.4, bossRate: 1.5,
    mix: { skirmisher: 0.5, lancer: 1, reaver: 0.5, shieldbearer: 0.35, twinblade: 0.25 } },
  { spd: [0.98, 1.03], count: [9, 10], active: [4, 4.4], gap: [1.42, 1.35], warn: [0.82, 0.74], react: [0.38, 0.34], skill: [0.54, 0.58], aggr: [0.72, 0.78], coreT: [7, 6.5],
    spout: [10, 9], spoutW: 0, bolt: [13, 11], boltW: 0, cast: [1, 1.08], hunt: [53, 48], drop: 0.95, armor: [0, 0], surv: [27, 27], survCap: 0, bossHP: 1, bossRate: 2.3,
    mix: { skirmisher: 0.3, lancer: 1, reaver: 0.6, shieldbearer: 0.45, twinblade: 0.4, stormcaller: 0.3 } },
  { spd: [1.03, 1.05], count: [10, 10], active: [4.6, 4.6], gap: [1.35, 1.25], warn: [0.7, 0.6], react: [0.34, 0.31], skill: [0.58, 0.6], aggr: [0.78, 0.82], coreT: [6.5, 5.8],
    spout: [9, 8], spoutW: 0, bolt: [11, 9], boltW: 0, cast: [1.08, 1.18], hunt: [48, 42], drop: 0.9, armor: [0, 0], surv: [28, 28], survCap: -1, bossHP: 1, bossRate: 1.6,
    mix: { skirmisher: 0.3, lancer: 1, reaver: 0.55, shieldbearer: 0.5, twinblade: 0.4, stormcaller: 0.4 } },
];
const RAMP_KEYS = ['spd', 'count', 'active', 'gap', 'warn', 'react', 'skill', 'aggr', 'coreT', 'spout', 'bolt', 'cast', 'hunt', 'armor', 'surv'];

// the difficulty values at wave `w` of sector `s` (both 0-based)
export function rampAt(s, w) {
  const row = RAMP[s];
  const f = Math.max(0, Math.min(1, w / (WAVES - 1)));
  const lerp = (a) => a[0] + (a[1] - a[0]) * f;
  const out = { sector: s, wave: w, bossHP: row.bossHP, bossRate: row.bossRate, drop: row.drop, survCap: row.survCap || 0, mix: row.mix };
  for (const k of RAMP_KEYS) out[k] = lerp(row[k]);
  if (w < row.spoutW) out.spout = 0;
  if (w < row.boltW) out.bolt = 0;
  out.count = Math.round(out.count); out.active = Math.round(out.active); out.armor = Math.round(out.armor);
  return out;
}
// when each rider class first appears in the campaign: [sector, wave] (a short caption introduces it)
export const INTRO = { skirmisher: [0, 0], lancer: [0, 1], reaver: [0, 3], shieldbearer: [1, 0], twinblade: [2, 0], stormcaller: [3, 0] };
export const introduced = (type, s, w) => { const q = INTRO[type]; return !q || s > q[0] || (s === q[0] && w >= q[1]); };

// wave kinds per sector (index = wave). corerush = bonus wave, survival = hold out, crumble = falling ledges
export const WAVE_KIND = [
  ['normal', 'normal', 'corerush', 'normal'],
  ['normal', 'survival', 'normal', 'crumble'],
  ['normal', 'crumble', 'corerush', 'normal'],
  ['crumble', 'normal', 'survival', 'normal'],
  ['normal', 'crumble', 'survival', 'normal'],
];
// in co-op one wave per sector (from sector 2) becomes a TEAM wave: twin riders, bonus if nobody falls
export const TEAM_WAVE = 2;
export const SPECIAL = { rushT: 20, rushCores: [10, 16], crumbleGap: 7.5, crumbleMax: 4, crumbleTell: 2.2 };

// ENDLESS SKIES: level 0 = sector 1's first wave, 5 = sector 5's last, reached after ~18 minutes
export const ENDLESS = { minutes: 18, startLevel: 0.25, lookEvery: 4, bossEvery: 5, specialEvery: 3 };
export function endlessLevel(seconds) {
  const m = seconds / 60;
  return Math.min(5, ENDLESS.startLevel + 4.75 * Math.pow(Math.min(1, m / ENDLESS.minutes), 1.1));
}
export function rampLevel(level) {
  const s = Math.min(4, Math.floor(level));
  const r = rampAt(s, Math.min(WAVES - 1, (level - s) * (WAVES - 1)));
  r.armor = level < 1 ? 1 : 0;
  if (level < 0.6) r.spout = 0;
  return r;
}

// ------------------------------------------------------------------ riders
// spd: speed class, climb: metres above you a hunter aims for at full skill, score: points for unhorsing
export const ENEMY = {
  skirmisher: { name: 'SKIRMISHER', spd: 0.86, climb: 0.6, score: 500, beat: 0.26 },
  lancer: { name: 'LANCER', spd: 1.0, climb: 1.8, score: 750, beat: 0.22 },
  reaver: { name: 'REAVER', spd: 1.1, climb: 5.0, score: 1000, beat: 0.2, feint: 0.35 },
  shieldbearer: { name: 'SHIELDBEARER', spd: 0.84, climb: 0.5, score: 1200, beat: 0.24, margin: 1.05 },   // its shield blocks you from the front unless you are this much higher
  twinblade: { name: 'TWINBLADE', spd: 1.0, climb: 2.4, score: 900, beat: 0.22 },
  stormcaller: { name: 'STORMCALLER', spd: 0.8, climb: 6, score: 1500, beat: 0.26, castCD: 5.8, arcR: 0.75, range: 24 },
};
export const ENEMY_KEYS = Object.keys(ENEMY);
// a core that re-ignites forms a stronger rider
export const TIER_UP = { skirmisher: 'lancer', lancer: 'reaver', reaver: 'reaver', shieldbearer: 'shieldbearer', twinblade: 'lancer', stormcaller: 'stormcaller' };
// the Stormhunter: a fast mechanical harrier. Only a head-on lance into its eye kills it.
export const HUNTER = { v: 11.5, turn: 2.0, eyeH: 0.9, eyeTol: 0.8, warn: 2.4, score: 3000 };

// bosses: strike their weak points from above. Attacks run in turn; later phases use their own lists.
export const BOSSES = {
  gale: { name: 'THE IRON GALE', v: 4.6, alt: [9, 17], body: [[0, 0.2, 5.4, 1.1], [3.2, 0.6, 1.4, 1.0]],
    pts: [[-1.6, 1.8, 0.75, 1], [0, 1.9, 0.75, 1], [1.6, 1.8, 0.75, 1]], core: [0, 1.2, 1.0, 3],
    atk: ['gust', 'summon', 'dive'], p2: ['dive', 'gust', 'summon', 'dive'] },
  wyvern: { name: 'THE CRYSTAL WYVERN', v: 5.6, alt: [8, 19], body: [[0, 0, 4.2, 1.0], [3.6, 0.5, 1.3, 0.9], [-3.6, -0.2, 1.6, 0.6]],
    // stage 6: 10 hits (was 6: a 20 s fight, shorter and safer than the sector 1 boss), shards per volley [phase 1, 2]
    pts: [[-1.4, 1.3, 0.75, 3], [0.2, 1.5, 0.75, 4], [1.8, 1.3, 0.75, 3]], shards: [3, 4],
    atk: ['shards', 'dive', 'beam', 'summon'], p2: ['shards', 'beam', 'dive', 'beam'] },
  colossus: { name: 'THE FORGE COLOSSUS', v: 1.6, body: [[0, 5.2, 2.5, 4.6], [0, 10.0, 1.3, 1.2]],
    pts: [[-2.4, 9.0, 0.95, 3], [2.4, 9.0, 0.95, 3], [0, 11.4, 0.85, 3]],
    atk: ['slam', 'molten', 'blast', 'summon'], p2: ['blast', 'slam', 'molten', 'gust', 'blast'] },
  // bask = seconds it lies on the surface after a breach (at height baskY); drops = icicles per volley (phase 1, 2) within `spread` m of you;
  // summonN riders per call (reavers = their reaver share). Stage 6: it breaches twice per round and needs 6 hits (was 9 at 1 breach a round:
  // a 2-minute fight); the pair of summoned riders keeps the pressure up: ~60 s and ~1.25 deaths a try for the human-like bot on NORMAL
  leviathan: { name: 'THE GLACIER LEVIATHAN', v: 6, segs: 8, pts: [2, 3, 4], ptHP: 2, bask: 3.4, baskY: 1.4, drops: [6, 8], spread: 3.5, summonN: 2, reavers: 0.5,
    atk: ['breach', 'summon', 'icicles', 'breach', 'breath', 'icicles'], p2: ['breach', 'summon', 'icicles', 'breach', 'breath', 'summon', 'icicles'] },
  sovereign: { name: 'THE ECLIPSE SOVEREIGN', v: 5.2, alt: [10, 20], phases: 3, body: [[0, 0.4, 3.6, 1.3], [0, 2.4, 1.0, 1.0]],
    pts: [[0, 3.4, 0.8, 4]],
    atk: ['orbs', 'beam', 'summon'], p2: ['dive', 'orbs', 'gust', 'beam'], p3: ['storm', 'dive', 'orbs', 'beam', 'gust'],
    // homing orbs per phase, their homing speed (x bossRate), life (s) and how far below your lance tip they still pop; storm = bolt offsets
    orb: { n: [3, 3, 4], home: 3.6, life: 5.5, pop: -0.1 }, storm: [-6, 0, 6] },
};
export const BOSS_KEYS = Object.keys(BOSSES);

// ------------------------------------------------------------------ scoring, lives, upgrades, medals
export const SCORE = { core: [250, 500, 750, 1000], air: 500, wave: 1000, clean: 2000, hunter: 3000, wp: 500, boss: 10000, sector: 5000, rush: 300, rushAll: 5000,
  survive: 3000, team: 5000, orb: 100, lifeEvery: 80000 };
// 4 lives, +1 for each sector cleared and one every 80 000 points (x the difficulty's score factor): a medium player
// usually needs a CONTINUE FROM CHECKPOINT somewhere in sectors 3-4 (scripts/lancewing/autopilot_check.mjs)
export const START_LIVES = 4;

// ------------------------------------------------------------------ difficulty levels
// Each level scales the RAMP (so every level still builds up wave by wave) and has its own boards. Every factor is a
// multiplier on the RAMP value; `k` says how strongly the level bites in each sector (a factor m becomes 1 + (m - 1) * k
// there; `kb` the same for the boss fights; `active`, the riders in the air at once, is applied as it is), measured so that each level keeps its own steady curve (scripts/lancewing/ramp_check.mjs).
// Warnings never drop below MIN_WARN. EASY is the template's gentle slow start; lives / armor are added.
// summonAdd: extra riders when a boss that calls a pack (the Leviathan, summonN 2) summons.
export const MIN_WARN = 0.45;
export const DIFFICULTY = {
  easy: { label: 'EASY', desc: 'A gentle start: slower riders, fewer at a time, longer warnings and an extra life', spd: 0.9, count: 0.85, active: 0.8, warn: 1.4, react: 1.25, skill: 0.8, aggr: 0.85, coreT: 1.2, haz: 1.3, boss: 0.85, bossRate: 0.85, lives: 1, armor: 0, drops: 1.2, score: 0.6,
    k: [1, 1, 1, 0.35, 0.5] },
  normal: { label: 'NORMAL', desc: 'A real fight from the first wave that keeps building', spd: 1, count: 1, active: 1, warn: 1, react: 1, skill: 1, aggr: 1, coreT: 1, haz: 1, boss: 1, bossRate: 1, lives: 0, armor: 0, drops: 1, score: 1 },
  hard: { label: 'HARD', desc: 'Faster, busier, smarter riders and shorter warnings', spd: 1.06, count: 1.1, active: 1.15, warn: 0.85, react: 0.9, skill: 1.15, aggr: 1.08, coreT: 0.9, haz: 0.88, boss: 1.15, bossRate: 1.1, lives: 0, armor: 0, drops: 0.9, score: 1.5, summonAdd: 1,
    k: [1.2, 0.75, 0.95, 1.4, 0.95], kb: [0, 0.6, 0, 0, 0.95] },   // stage 6: S1 and S2 bite a little more (S1 76 -> 73 %); the 6-hit Leviathan as on NORMAL (a faster one is a shorter, easier fight)
  nightmare: { label: 'NIGHTMARE', desc: 'For experts: everything at full tilt, one life fewer', spd: 1.08, count: 1.2, active: 1.3, warn: 0.72, react: 0.8, skill: 1.2, aggr: 1.15, coreT: 0.8, haz: 0.78, boss: 1.3, bossRate: 1.2, lives: -1, armor: 0, drops: 0.8, score: 2.2, summonAdd: 1,
    k: [1, 0.8, 1, 1, 1] },
};
export const DIFF_KEYS = Object.keys(DIFFICULTY);
export function applyDiff(R, key) {
  const d = DIFFICULTY[key] || DIFFICULTY.normal;
  if (d === DIFFICULTY.normal) return R;
  const i = Math.min(4, R.sector || 0), k = d.k ? d.k[i] : 1, kb = d.kb ? d.kb[i] : k;
  const m = (v) => 1 + (v - 1) * k, mb = (v) => 1 + (v - 1) * kb;   // kb: the same for the boss fights (defaults to k)
  return { ...R, spd: R.spd * m(d.spd), count: Math.max(2, Math.round(R.count * m(d.count))), active: Math.max(1, Math.round(R.active * d.active)),
    warn: Math.max(MIN_WARN, R.warn * m(d.warn)), react: R.react * m(d.react), skill: Math.min(1, R.skill * m(d.skill)), aggr: Math.min(1, R.aggr * m(d.aggr)), coreT: R.coreT * m(d.coreT),
    spout: R.spout * m(d.haz), bolt: R.bolt * m(d.haz), gap: R.gap / m(d.spd), hunt: R.hunt * m(d.haz), drop: R.drop * m(d.drops), bossHP: R.bossHP * mb(d.boss), bossRate: R.bossRate * mb(d.bossRate), armor: Math.max(0, R.armor + d.armor) };
}

// ------------------------------------------------------------------ power-ups dropped by unhorsed riders
// time = seconds it lasts, w = how often it drops
export const POWERUPS = {
  shield: { name: 'AEGIS', glyph: '⬡', color: 0x7fd8ff, time: 18, w: 10, desc: 'Absorbs one lost duel or hit' },
  lance: { name: 'LONG LANCE', glyph: '⟋', color: 0xffc04a, time: 12, w: 9, desc: 'Your lance reaches further and wins closer duels' },
  speed: { name: 'TAILWIND', glyph: '»', color: 0x8dff8a, time: 10, w: 8, desc: 'Faster wings and stronger beats' },
  slow: { name: 'STILL AIR', glyph: '⧗', color: 0xd7a6ff, time: 6, w: 5, desc: 'Riders, hazards and bosses slow right down' },
};
export const PW_KEYS = Object.keys(POWERUPS);
export const DROP = { chance: 0.16, life: 12, max: 2, r: 1.25 };

export const UPGRADES = {
  wing: { name: 'WING POWER', icon: '⇑', color: '#8dff8a', max: 3, desc: 'Stronger beats and 5% more top speed a level' },
  reach: { name: 'LANCE REACH', icon: '⟋', color: '#ffc04a', max: 2, desc: 'A longer lance: wins closer duels' },
  armor: { name: 'ARMOUR PLATE', icon: '⛨', color: '#7fd8ff', max: 2, desc: '+1 armour charge every wave (absorbs a lost duel)' },
  magnet: { name: 'CORE MAGNET', icon: '◎', color: '#ff8a4a', max: 2, desc: 'Ember cores drift to you from further away' },
  glide: { name: 'GLIDE', icon: '⌒', color: '#d7a6ff', max: 1, desc: 'Hold FLAP while falling to glide' },
};
export const UP_KEYS = Object.keys(UPGRADES);
export const UP_COST = [400, 900, 1600];
export const SALVAGE_DIV = 110;   // salvage = sector score / this: about one or two upgrades a sector, close to TYPICAL_UP below

// par times (s, from the sector's first wave): about the fastest quarter of the human-like autopilot's clears
// (stage 6 par_times: human p25 = 151 / 164 / 156 / 170 / 147) and the demo autopilot's median (131 / 155 / 139 / 166 / 143)
const PAR = [150, 160, 150, 170, 145];   // stage 6: S4 200 -> 170 (the Leviathan fight is ~60 s shorter)
export const parTime = (i) => PAR[i];
// 15 medals: per sector a deathless clear, a clear with no core re-igniting and a clear under par.
// They count on Normal or harder, for a sector flown from wave 1 (not from a checkpoint), never for an autopilot run.
const MEDAL_NAMES = [
  ['DUSK UNBROKEN', 'EMBER KEEPER', 'SUNDOWN SPRINT'],
  ['CLEAR AS CRYSTAL', 'CAVE WARDEN', 'TIDE RACER'],
  ['TEMPERED STEEL', 'COLD FORGE', 'HOT IRON'],
  ['UNMELTED', 'FROST KEEPER', 'AVALANCHE'],
  ['UNBOWED', 'LAST EMBER', 'TOTALITY'],
];
export const MEDALS = [];
SECTORS.forEach((s, i) => {
  const [a, b, c] = MEDAL_NAMES[i];
  MEDALS.push({ id: `s${i}clean`, sector: i, kind: 'clean', name: a, desc: `Clear ${s.name} without losing a life` });
  MEDALS.push({ id: `s${i}core`, sector: i, kind: 'core', name: b, desc: `Clear ${s.name} without a single ember core re-igniting` });
  MEDALS.push({ id: `s${i}par`, sector: i, kind: 'par', name: c, desc: `Clear ${s.name} under par (${Math.floor(PAR[i] / 60)}:${String(PAR[i] % 60).padStart(2, '0')})` });
});

// what a player typically owns when reaching each sector (sector select and the ramp check use it)
export const TYPICAL_UP = [
  {},
  { wing: 1 },
  { wing: 1, armor: 1, magnet: 1 },
  { wing: 2, armor: 1, magnet: 1, reach: 1 },
  { wing: 2, armor: 1, magnet: 1, reach: 1, glide: 1 },
];
// rider colours (render) per class
export const CLASS_COLOR = { skirmisher: 0xb04a3a, lancer: 0x3a6ab0, reaver: 0x6a3aa8, shieldbearer: 0x8a8f96, twinblade: 0x2f9a7a, stormcaller: 0xd8b04a };
