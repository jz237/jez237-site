// Shock Horror (built on Gold Digger): every tunable in one place. The simulation (sim.js), the level generator (levelgen.js) and the
// autopilot (ai.js) read only from here, so the Node checks and the browser agree exactly.
export const VERSION = '1.0.0';
export const STEP = 1 / 120;

// ------------------------------------------------------------------ tiles (1 m cells, row 0 = bottom)
export const T = {
  AIR: 0, ROCK: 1, SOFT: 2, HARD: 3, VEIN: 4, GEMV: 5, LADDER: 6, ROPE: 7, PLANK: 8, WATER: 9, LAVA: 10,
  SPIKES: 11, DOOR: 12, CRUMBLE: 13, FOSSIL: 14,
};
// solid for movement (doors are solid until unlocked; crumble is solid until it falls)
export const SOLID = new Uint8Array(16);
for (const k of [T.ROCK, T.SOFT, T.HARD, T.VEIN, T.GEMV, T.DOOR, T.CRUMBLE, T.FOSSIL]) SOLID[k] = 1;
export const CLIMB = new Uint8Array(16); CLIMB[T.LADDER] = 1; CLIMB[T.ROPE] = 1;
// pick hits to break (0 = the pick cannot), dynamite always breaks these
export const PICK_HP = { [T.SOFT]: 3, [T.VEIN]: 3, [T.GEMV]: 4, [T.FOSSIL]: 5, [T.CRUMBLE]: 2 };
export const BLASTABLE = new Uint8Array(16);
for (const k of [T.SOFT, T.HARD, T.VEIN, T.GEMV, T.CRUMBLE, T.FOSSIL]) BLASTABLE[k] = 1;

// ------------------------------------------------------------------ the digger
export const PHYS = {
  w: 0.62, h: 1.62,              // collision box (feet at y)
  run: 4.3, accel: 34, decel: 42, airAccel: 18,
  grav: 27, jumpV: 11.2, jumpCut: 0.45, maxFall: 21,
  coyote: 0.1, buffer: 0.13,
  climb: 3.2, ropeSway: 0.0,
  swimGrav: 4.5, swimMax: 2.6, swimUp: 3.4, swimRun: 2.6,
  safeFall: 4.6,                 // metres: no damage up to here
  hurtPer: 2.4,                  // one heart per this many metres beyond safeFall
  lethalFall: 10.5,              // and this kills outright (boots add +1.6 / +1.2 per level)
  inv: 1.3,                      // invulnerable after a hit
  knock: 5.5,
  pickT: 0.34, pickHitT: 0.12, pickReach: 1.05,
  throwT: 0.28,
};
export const TOOLS = {
  dynFuse: 2.3, dynRadius: 2.45, dynThrowVx: 5.4, dynThrowVy: 6.2, dynHurt: 2.0,   // own blast hurts within dynHurt m
  flareLife: 20, flareRadius: 7.5, flareThrowVx: 6.8, flareThrowVy: 5.5,
  oilMax: 100, oilCan: 50, oilDarkHurt: 20,  // a heart every this many seconds with no oil
};

// ------------------------------------------------------------------ difficulty ramp
// Every number that makes the mountain harder lives here: [first level of the depth, last level of the depth]
// (levels 1-3 interpolate; the boss uses the last value). Depth 1 is relaxed for a first-time human and
// everything rises in small steps. Warning time is how long a threat is shown before it can hurt.
export const RAMP = {
  //                 D1 Copper    D2 Glowroot   D3 Geode      D4 Drowned    D5 Ember
  rooms:      [[3, 2, 4, 2], [4, 2, 4, 3], [4, 3, 4, 3], [4, 3, 5, 3], [5, 3, 5, 3]],  // [w0,h0,w1,h1] rooms per level
  bats:       [[0.0, 0.25], [0.55, 0.8], [0.8, 0.92], [0.92, 1.0], [1.0, 1.08]],     // bats per room
  batSpeed:   [[2.6, 3.0], [3.1, 3.5], [3.6, 4.0], [4.0, 4.3], [4.3, 4.45]],
  batWarn:    [[2.0, 1.8], [1.7, 1.5], [1.4, 1.2], [1.1, 0.95], [0.9, 0.7]],         // wing-unfold before a swoop
  crawlers:   [[0.15, 0.35], [0.45, 0.6], [0.75, 0.9], [0.9, 1.0], [1.0, 1.1]],
  crawlSpeed: [[0.9, 1.1], [1.1, 1.3], [1.3, 1.5], [1.5, 1.7], [1.7, 1.9]],
  stalac:     [[0.15, 0.3], [0.4, 0.55], [0.6, 0.72], [0.72, 0.8], [0.8, 0.88]],     // falling stalactites per room
  stalWarn:   [[2.0, 1.8], [1.7, 1.5], [1.4, 1.2], [1.1, 0.95], [0.9, 0.7]],
  geysers:    [[0.0, 0.1], [0.2, 0.3], [0.3, 0.4], [0.4, 0.45], [0.45, 0.55]],
  geyWarn:    [[2.2, 2.0], [1.9, 1.7], [1.6, 1.4], [1.3, 1.1], [1.0, 0.75]],
  geyPeriod:  [[7.0, 6.5], [6.4, 6.0], [5.8, 5.4], [5.2, 4.8], [4.6, 4.2]],
  shadeEvery: [[0, 0], [80, 66], [64, 54], [46, 38], [36, 30]],                       // seconds between shades (0 = none)
  shadeSpeed: [[0, 0], [0.9, 1.0], [1.05, 1.15], [1.2, 1.3], [1.35, 1.5]],
  shadeWarn:  [[2.2, 2.2], [2.0, 1.8], [1.7, 1.5], [1.4, 1.2], [1.1, 0.8]],
  eels:       [[0, 0], [0, 0], [0, 0.1], [0.3, 0.45], [0.2, 0.3]],                   // per water room
  eelWarn:    [[2, 2], [2, 2], [1.5, 1.4], [1.3, 1.1], [1.0, 0.8]],
  spikes:     [[0.0, 0.1], [0.15, 0.25], [0.25, 0.35], [0.35, 0.45], [0.45, 0.55]],
  crumble:    [[0.0, 0.15], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
  crumbleT:   [[1.3, 1.2], [1.1, 1.0], [0.95, 0.85], [0.8, 0.7], [0.65, 0.55]],      // standing time before it falls
  oilDrain:   [[0.3, 0.36], [0.46, 0.52], [0.56, 0.6], [0.6, 0.64], [0.66, 0.72]],    // per second
  oilCans:    [[1.0, 0.9], [0.85, 0.75], [0.7, 0.65], [0.6, 0.55], [0.5, 0.45]],     // per path room
  lava:       [[0, 0], [0, 0], [0, 0.05], [0, 0.05], [0.35, 0.5]],
  hurtMul:    [[1, 1], [1, 1], [1, 1], [1, 1.2], [1.3, 1.45]],                      // stalactite/geyser/boss damage scale
  bossHP:     [[16, 16], [22, 22], [38, 38], [44, 44], [46, 46]],
  bossRate:   [[0.75, 0.75], [0.95, 0.95], [1.05, 1.05], [1.12, 1.12], [1.2, 1.2]], // attack tempo
  bossWarn:   [[2.0, 2.0], [1.6, 1.6], [1.3, 1.3], [1.0, 1.0], [0.75, 0.75]],
  helmet:     [[1, 1], [1, 0], [0, 0], [0, 0], [0, 0]],                               // free helmet (absorbs one hit) per level
};
export const DEPTHS = 5;
export const LEVELS = 3;             // plus the boss lair
export function rampAt(depth, level) {
  // endless: depths beyond 5 keep rising slowly from the depth 4 values toward the depth 5 end values and past them
  const d = Math.min(depth, DEPTHS - 1);
  const f = Math.min(1, level / (LEVELS - 1));
  const o = {};
  for (const k in RAMP) {
    const v = RAMP[k][d];
    if (k === 'rooms') { o.roomsW = Math.round(v[0] + (v[2] - v[0]) * f); o.roomsH = Math.round(v[1] + (v[3] - v[1]) * f); continue; }
    o[k] = v[0] + (v[1] - v[0]) * f;
  }
  return o;
}
// endless mode: stratum s (0, 1, 2...) and level within it. Starts at depth-1 numbers and climbs over many minutes.
export function endlessRamp(n) {
  // n = levels descended. 0-2 like depth 1, then roughly one depth per 3 levels, capping a little past depth 5
  const x = Math.min(n / 3, 4.6);
  const d = Math.floor(Math.min(x, 4)), f = Math.min(1, x - d);
  const o = {};
  for (const k in RAMP) {
    const v = RAMP[k][d], v2 = RAMP[k][Math.min(4, d + 1)];
    if (k === 'rooms') { o.roomsW = n < 2 ? 3 : n < 6 ? 4 : 5; o.roomsH = n < 2 ? 2 : 3; continue; }
    const a = v[0], b = d < 4 ? v2[0] : v[1] + (v[1] - v[0]) * 0.6;
    o[k] = a + (b - a) * f;
  }
  return o;
}

export const DIFFICULTY = {
  easy:      { name: 'EASY', desc: 'More hearts and oil, slower creatures, longer warnings. Scores ×0.6.', hearts: 1, lives: 1, speed: 0.85, warn: 1.3, count: 0.7, drain: 0.75, boss: 0.75, score: 0.6 },
  normal:    { name: 'NORMAL', desc: 'The pit as the night shift found it.', hearts: 0, lives: 0, speed: 1, warn: 1, count: 1, drain: 1, boss: 1, score: 1 },
  hard:      { name: 'HARD', desc: 'Faster creatures, more of them, shorter warnings. Scores ×1.5.', hearts: 0, lives: 0, speed: 1.1, warn: 0.85, count: 1.2, drain: 1.15, boss: 1.2, score: 1.5 },
  nightmare: { name: 'NIGHTMARE', desc: 'One heart fewer and the dark comes for you quickly. Scores ×2.2.', hearts: -1, lives: -1, speed: 1.2, warn: 0.72, count: 1.4, drain: 1.3, boss: 1.4, score: 2.2 },
};
export const MIN_WARN = 0.5;
export function applyDiff(r, diff) {
  const D = DIFFICULTY[diff] || DIFFICULTY.normal;
  const o = { ...r };
  for (const k of ['batSpeed', 'crawlSpeed', 'shadeSpeed', 'bossRate']) o[k] *= D.speed;
  for (const k of ['batWarn', 'stalWarn', 'geyWarn', 'shadeWarn', 'eelWarn', 'bossWarn']) o[k] = Math.max(MIN_WARN, o[k] * D.warn);
  for (const k of ['bats', 'crawlers', 'stalac', 'geysers', 'spikes', 'eels']) o[k] *= D.count;
  if (o.shadeEvery) o.shadeEvery /= D.count;
  o.oilDrain *= D.drain;
  o.bossHP = Math.round(o.bossHP * D.boss);
  return o;
}

// ------------------------------------------------------------------ depths (biomes) and bosses
export const BIOMES = [
  { key: 'copper', name: 'THE NIGHT SHIFT', sub: 'WHERE TWELVE MEN WENT DOWN', boss: 'rockjaw', bossName: 'THE GNAWER', music: 'd1', amb: 'amb1' },
  { key: 'glow', name: 'THE ROT GARDEN', sub: 'WHERE THE COCOONS GROW', boss: 'gloomwing', bossName: 'THE SHRIEKING MOTHER', music: 'd2', amb: 'amb2' },
  { key: 'geode', name: 'THE OSSUARY', sub: 'HALLS OF THE NAMELESS DEAD', boss: 'warden', bossName: 'THE BONE SAINT', music: 'd3', amb: 'amb3' },
  { key: 'drowned', name: 'THE DROWNED CHAPEL', sub: 'THE CONGREGATION BELOW', boss: 'wyrm', bossName: 'THE DROWNED BRIDE', music: 'd4', amb: 'amb4' },
  { key: 'ember', name: 'THE RED HEART', sub: 'THE MOUNTAIN IS ALIVE', boss: 'heart', bossName: 'THE RED HEART', music: 'd5', amb: 'amb5' },
];
// endless strata: biome looks cycle with new names (the renderer shifts the palette by `hue`)
export const STRATA = ['SCREAMING', 'HOLLOW', 'SUNKEN', 'ROTTEN', 'WHISPERING', 'SHATTERED', 'ANCIENT', 'BURNING', 'SILENT', 'FORGOTTEN', 'STARVING', 'WEEPING'];

// boss stats: hp multiplier on RAMP.bossHP, the arena kind and the attack list (each attack: [kind, weight, minPhase])
export const BOSSES = {
  rockjaw:   { hp: 1.0, arena: 'pit', attacks: [['erupt', 3, 0], ['lunge', 2, 0], ['rain', 2, 1]], stun: 2.6 },
  gloomwing: { hp: 1.8, arena: 'roost', attacks: [['swoop', 3, 0], ['summon', 1, 0], ['shriek', 2, 1]], stun: 2.4 },
  warden:    { hp: 1.0, arena: 'hall', attacks: [['beam', 3, 0], ['slam', 2, 0], ['shards', 2, 1]], stun: 2.6 },
  wyrm:      { hp: 1.0, arena: 'pool', attacks: [['lunge', 3, 0], ['spit', 2, 0], ['surge', 1, 1]], stun: 2.6 },
  heart:     { hp: 1.0, arena: 'forge', attacks: [['slam', 3, 0], ['rain', 2, 0], ['wave', 2, 1]], stun: 2.4 },
};

// ------------------------------------------------------------------ loot and scoring
export const LOOT = {
  gold: { v: [60, 140] }, gem: { v: [300, 900] }, bigGold: { v: [400, 700] }, chest: { v: [1500, 2500] },
  relic: 5000, fossil: 1500, secret: 1000, wonder: 2000, note: 500, map: 400, cache: 3000, kill: { bat: 150, crawler: 200, shade: 300, eel: 250 },
  boss: 10000, levelClear: 2000, explore: 3000,  // explore bonus scales with % of the level seen
};
export const GEMS = [
  { name: 'GARNET', col: 0xb3122e, v: 300 }, { name: 'TOPAZ', col: 0xe8a33a, v: 400 }, { name: 'EMERALD', col: 0x17a85a, v: 600 },
  { name: 'SAPPHIRE', col: 0x2557d6, v: 750 }, { name: 'BONE CANDLE', col: 0x8a3fd1, v: 500 }, { name: 'RUBY', col: 0xe0103a, v: 900 },
];
export const LIFE_EVERY = 80000;

// ------------------------------------------------------------------ the general store between depths
export const UPGRADES = [
  { key: 'lamp', name: 'BRIGHTER LAMP', icon: '☀', col: '#ffd27a', max: 3, cost: [1500, 3000, 5000], desc: ['Wider light, bigger oil tank (+30)', 'Wider light, bigger oil tank (+30)', 'Wider light, bigger oil tank (+30)'] },
  { key: 'boots', name: 'HOBNAIL BOOTS', icon: '⛸', col: '#c9a27a', max: 2, cost: [2000, 4000], desc: ['Survive longer falls (+1.6 m)', 'Survive longer falls (+1.2 m)'] },
  { key: 'pick', name: 'STEEL PICK', icon: '⛏', col: '#b8c4d2', max: 2, cost: [1500, 3500], desc: ['Breaks rock in fewer swings, hits harder', 'Breaks rock in fewer swings, hits harder'] },
  { key: 'heart', name: 'TOUGH HIDE', icon: '♥', col: '#ff7a6a', max: 2, cost: [2500, 5000], desc: ['One more heart', 'One more heart'] },
  { key: 'satchel', name: 'POWDER SATCHEL', icon: '✷', col: '#ff9a4a', max: 2, cost: [1200, 2500], desc: ['Carry 2 more dynamite (+2 now)', 'Carry 2 more dynamite (+2 now)'] },
  { key: 'pouch', name: 'FLARE POUCH', icon: '✦', col: '#ff5a8a', max: 2, cost: [1000, 2200], desc: ['Carry 2 more flares (+2 now)', 'Carry 2 more flares (+2 now)'] },
  { key: 'helmet', name: 'HARD HAT', icon: '⛑', col: '#ffe08a', max: 1, cost: [1800], desc: ['Shrugs off one hit per level'] },
];
// what a typical player has bought by the start of each depth (sector select, ramp check)
export const TYPICAL_UP = [
  {},
  { lamp: 1, pick: 1 },
  { lamp: 1, pick: 1, boots: 1, heart: 1 },
  { lamp: 2, pick: 1, boots: 1, heart: 1, satchel: 1 },
  { lamp: 2, pick: 2, boots: 1, heart: 1, satchel: 1, pouch: 1 },
];
export const START = { hearts: 3, lives: 3, dyn: 3, flares: 3, dynMax: 6, flareMax: 5 };

// ------------------------------------------------------------------ discoveries (the journal)
// Each depth hides relics (sealed vaults), fossils (in the walls), wonders (scenic places to find),
// the old prospector's notes, secret rooms and creatures. Endless strata generate their own relics.
export const RELICS = [
  ['THE FOREMAN\'S POCKET WATCH', 'Stopped at 3:12 a.m. The night they went quiet.'], ['A CHILD\'S LEFT SHOE', 'There were no children on the night shift.'], ['THE SHIFT BELL', 'It rang at the bottom. Nobody was there to ring it.'],
  ['A JAR OF TEETH', 'Sorted by size. Labelled by name.'], ['THE SPORE MASK', 'Something is still breathing inside it.'], ['THE WEEPING ROOT', 'It grew into the shape of a man. It is still growing.'],
  ['THE BONE ROSARY', 'Forty beads. Forty knuckles.'], ['THE SAINT\'S FINGER', 'It points down. Always down.'], ['A SKULL WITH A KEYHOLE', 'You can hear something ticking inside.'],
  ['THE DROWNED BRIDE\'S RING', 'Still wet. Still warm.'], ['THE TONGUELESS BELL', 'It rings without a sound. You feel it in your teeth.'], ['A WAX DOLL', 'It has your face. It did not, a moment ago.'],
  ['THE STILL-WARM EGG', 'Something inside it knows your name.'], ['THE MIRROR THAT SHOWS NO ONE', 'You are not in it. Something else is.'], ['THE HEART\'S KEY', 'It opens the last door. Do not open the last door.'],
];
export const FOSSILS = [
  ['A HAND IN THE ROCK', 'Fingers worn to the bone. It was digging out.'], ['A MINER\'S LAMP, MELTED IN', 'The glass is fused with the stone. The wick is still wet.'],
  ['A FACE IN THE STONE', 'Pressed into the rock like a mould. Mouth open.'], ['A RIBCAGE OF ROOTS', 'The roots grew in through the ribs. Or out.'],
  ['A SKULL WITH TOO MANY TEETH', 'Three rows. One of them is human.'], ['A WING OF SKIN', 'Stretched over finger bones. Long fingers.'],
  ['A WEDDING VEIL IN THE CLAY', 'Perfectly preserved. Still damp.'], ['A HYMN BOOK IN THE SILT', 'Every page is the same word.'],
  ['A HEART IN AMBER', 'Turned to stone a thousand years ago. Still beating.'], ['A FOOTPRINT, BARE', 'Something walked here barefoot. It walked on the ceiling.'],
];
export const WONDERS = [
  ['THE LAST DAYLIGHT', 'A crack a mile above. The last sun you may ever see.'], ['THE GALLOWS CATHEDRAL', 'Old timbers hold up the vault. Ropes hang from every beam.'],
  ['THE CORPSE GARDEN', 'Caps as wide as wagons, growing out of something soft.'], ['THE THOUSAND EYES', 'Ten thousand lights across the ceiling. They blink.'],
  ['THE GLASS TOMB', 'A hollow egg of crystal. Someone is sealed inside.'], ['THE SCREAMING PRISMS', 'The crystals do not hum. They scream, very quietly.'],
  ['THE DROWNED GATE', 'A carved chapel gate under black water. The pews are full.'], ['THE BLACK FALL', 'A river pouring into the dark. It is not water.'],
  ['THE BLOOD FALL', 'A red river spilling down a wall of meat.'], ['THE BONE ORGAN', 'Columns of black stone and bone. Something plays it at night.'],
];
export const NOTES = [
  'Oct 3rd 1911. Night shift. Twelve of us. Foreman says the new seam runs straight down. Says the gold is "waiting". Odd word.',
  'Something knocks back when we knock on the rock. Three knocks. We did not tell the foreman. We did not knock again.',
  'Tom heard his mother calling from the old stope. His mother has been dead nine years. He went to look. He has not come back.',
  'The mushrooms grow on the men who sleep down here. I saw one move. I have stopped sleeping.',
  'Keep the lamp lit. Whatever you do. They only come when it gutters. They are pale and they are patient.',
  'The bones down here are not old. I found Tom\'s boots on a skeleton. Clean. Like something licked them.',
  'There is a church down here. Under the water. I heard them singing. I knew every voice.',
  'Do not answer the whispers. If you answer, they know where you are.',
  'The rock is warm and it moves when I breathe. Or I move when it breathes.',
  'If you are reading this, go back up. You will not. None of us did. It wants you to keep digging.',
];
export const CREATURES = {
  bat: ['SHRIEKER', 'Hangs from the roof like a folded umbrella of skin. Its face is almost human. Flares blind it.'],
  crawler: ['CRAWLER', 'A carapace of ribs on six grey human arms. One good swing of the pick sees it off.'],
  shade: ['THE PALE ONE', 'Drifts through rock toward the dark. She was a miner\'s wife. A flare burns her away.'],
  eel: ['THE DROWNED', 'Waits under black water with its eyes open. Do not stand at the edge.'],
  rockjaw: ['THE GNAWER', 'A worm of grey flesh that eats tunnels and men. Strike its mouth while it is stuck.'],
  gloomwing: ['THE SHRIEKING MOTHER', 'Mother of every shrieker in the pit. A flare drops her screaming out of the air.'],
  warden: ['THE BONE SAINT', 'A cathedral of the dead that learned to walk. Break the burning skulls on its back.'],
  wyrm: ['THE DROWNED BRIDE', 'She waited at the altar under the water for a hundred years. Her gills glow when she rests.'],
  heart: ['THE RED HEART', 'The mountain\'s own heart, and it has hands. Hit its fists when they cool.'],
};

// Collection rewards: lamp colours, pick skins and perks (equip up to 2) unlocked by finishing sets.
// need(journal) -> [have, total]
const has = (list, ids) => ids.filter((i) => list.includes(i)).length;
const relics = (j) => j.relic.length + (j.endless || []).filter((e) => e.kind === 'relic').length;
export const REWARDS = [
  { key: 'lamp-copper', kind: 'lamp', name: 'CORPSE LIGHT', col: 0xb8ff9a, how: 'All 3 relics of the Night Shift', need: (j) => [has(j.relic, [0, 1, 2]), 3] },
  { key: 'lamp-glow', kind: 'lamp', name: 'ROT GREEN', col: 0x9aff5a, how: 'All 3 relics of the Rot Garden', need: (j) => [has(j.relic, [3, 4, 5]), 3] },
  { key: 'lamp-geode', kind: 'lamp', name: 'BONE CANDLE', col: 0xffe6b0, how: 'All 3 relics of the Ossuary', need: (j) => [has(j.relic, [6, 7, 8]), 3] },
  { key: 'lamp-drowned', kind: 'lamp', name: 'DROWNED BLUE', col: 0x86d4ff, how: 'All 3 relics of the Drowned Chapel', need: (j) => [has(j.relic, [9, 10, 11]), 3] },
  { key: 'lamp-ember', kind: 'lamp', name: 'HEART RED', col: 0xff2a1a, how: 'All 3 relics of the Red Heart', need: (j) => [has(j.relic, [12, 13, 14]), 3] },
  { key: 'pick-gold', kind: 'pick', name: 'GILDED PICK', how: 'Dig up 3 buried caches', need: (j) => [(j.cache || []).length, 3], mat: { color: 0xffc24a, metalness: 1, roughness: 0.22, emissive: 0x2a1600 } },
  { key: 'pick-crystal', kind: 'pick', name: 'BONE PICK', how: 'Dig 3 remains out of the rock', need: (j) => [j.fossil.length, 3], mat: { color: 0xe8dcc0, metalness: 0.0, roughness: 0.5, emissive: 0x201810 } },
  { key: 'pick-obsidian', kind: 'pick', name: 'BLACK PICK', how: 'Find 5 horrors', need: (j) => [j.wonder.length, 5], mat: { color: 0x18120f, metalness: 0.4, roughness: 0.1, emissive: 0x7a1a00 } },
  { key: 'pick-relic', kind: 'pick', name: 'CURSED PICK', how: 'Find 8 relics', need: (j) => [relics(j), 8], mat: { color: 0xb5823e, metalness: 0.9, roughness: 0.3, emissive: 0x1a6a5a } },
  { key: 'steadylamp', kind: 'perk', name: 'STEADY LAMP', desc: 'Your lamp burns 15% slower', how: 'Find 4 relics', need: (j) => [relics(j), 4] },
  { key: 'luckypick', kind: 'perk', name: 'LUCKY PICK', desc: 'Gold veins give an extra nugget', how: 'Dig up 2 buried caches', need: (j) => [(j.cache || []).length, 2] },
  { key: 'surefoot', kind: 'perk', name: 'SURE FOOT', desc: 'Survive falls a metre longer', how: 'Dig 2 remains out of the rock', need: (j) => [j.fossil.length, 2] },
  { key: 'spareflare', kind: 'perk', name: 'SPARE FLARE', desc: 'Start every level with an extra flare', how: 'Find 3 horrors', need: (j) => [j.wonder.length, 3] },
  { key: 'keeneye', kind: 'perk', name: 'KEEN EYE', desc: 'Walls hiding a secret room glint gold', how: 'Open 5 secret rooms', need: (j) => [Math.min(j.secret || 0, 5), 5] },
];
export const MAX_PERKS = 2;

export const RANKS = [[0, 'FRESH MEAT'], [8, 'NIGHT SHIFT'], [20, 'GRAVE DIGGER'], [40, 'HOLLOW-EYED'], [70, 'UNSLEEPING'], [110, 'ONE OF THEM']];
export const MEDALS = [
  ['first-depth', 'END OF THE SHIFT', 'Kill the Gnawer'], ['glow', 'WEED KILLER', 'Kill the Shrieking Mother'], ['geode', 'BONE BREAKER', 'Break the Bone Saint'],
  ['drowned', 'WIDOWER', 'Put the Drowned Bride to rest'], ['heart', 'HEARTBREAKER', 'Stop the Red Heart'],
  ['relics3', 'COLLECTOR', 'Find 3 cursed relics'], ['relics15', 'CURSED MUSEUM', 'Find all 15 cursed relics'], ['wonders', 'SIGHTSEER', 'Find 5 horrors'],
  ['secrets10', 'HOLLOW TAPPER', 'Open 10 secret rooms'], ['fossils', 'BONE DIGGER', 'Dig up 5 remains'], ['nohit', 'UNTOUCHED', 'Clear a level without a scratch'],
  ['allgold', 'GREEDY', 'Collect every bit of gold in a level'], ['endless10', 'NO BOTTOM', 'Reach level 10 of the Endless Dark'],
  ['rich', 'GOLD FEVER', 'Score 100,000 in one run'], ['explorer', 'CARTOGRAPHER', 'See 95% of a level'], ['caches5', 'GRAVE ROBBER', 'Dig up 5 buried caches'],
  ['scare25', 'JUMPY', 'Witness 25 different scares'], ['scare100', 'NERVES OF STEEL', 'Witness 100 different scares'], ['scare200', 'BEYOND FEAR', 'Witness 200 different scares'], ['scareall', 'THE WHOLE NIGHTMARE', 'Witness every scare in the pit'],
];
