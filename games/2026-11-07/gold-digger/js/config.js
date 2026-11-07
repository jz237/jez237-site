// Gold Digger: every tunable in one place. The simulation (sim.js), the level generator (levelgen.js) and the
// autopilot (ai.js) read only from here, so the Node checks and the browser agree exactly.
export const VERSION = '1.2.2';
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
  normal:    { name: 'NORMAL', desc: 'The mountain as it was meant to be dug.', hearts: 0, lives: 0, speed: 1, warn: 1, count: 1, drain: 1, boss: 1, score: 1 },
  hard:      { name: 'HARD', desc: 'Faster creatures, more of them, shorter warnings. Scores ×1.5.', hearts: 0, lives: 0, speed: 1.1, warn: 0.85, count: 1.2, drain: 1.15, boss: 1.2, score: 1.5 },
  nightmare: { name: 'NIGHTMARE', desc: 'One heart fewer and the dark comes quickly. Scores ×2.2.', hearts: -1, lives: -1, speed: 1.2, warn: 0.72, count: 1.4, drain: 1.3, boss: 1.4, score: 2.2 },
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
  { key: 'copper', name: 'COPPER HOLLOWS', sub: 'THE OLD WORKINGS', boss: 'rockjaw', bossName: 'ROCKJAW', music: 'd1', amb: 'amb1' },
  { key: 'glow', name: 'GLOWROOT GROTTO', sub: 'WHERE THE FUNGUS SHINES', boss: 'gloomwing', bossName: 'GLOOMWING', music: 'd2', amb: 'amb2' },
  { key: 'geode', name: 'GEODE VAULTS', sub: 'HALLS OF CRYSTAL', boss: 'warden', bossName: 'THE PRISM WARDEN', music: 'd3', amb: 'amb3' },
  { key: 'drowned', name: 'DROWNED HALLS', sub: 'THE BURIED CITY', boss: 'wyrm', bossName: 'TIDEWYRM', music: 'd4', amb: 'amb4' },
  { key: 'ember', name: 'EMBER CORE', sub: 'THE HEART OF THE MOUNTAIN', boss: 'heart', bossName: 'THE MOLTEN HEART', music: 'd5', amb: 'amb5' },
];
// endless strata: biome looks cycle with new names (the renderer shifts the palette by `hue`)
export const STRATA = ['DEEP', 'HOLLOW', 'SUNKEN', 'GILDED', 'WHISPERING', 'SHATTERED', 'ANCIENT', 'BURNING', 'SILENT', 'FORGOTTEN', 'STARLIT', 'IRON'];

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
  { name: 'SAPPHIRE', col: 0x2557d6, v: 750 }, { name: 'AMETHYST', col: 0x8a3fd1, v: 500 }, { name: 'RUBY', col: 0xe0103a, v: 900 },
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
  ['THE SURVEYOR\'S COMPASS', 'Brass, still pointing down.'], ['A MINER\'S TIN LANTERN', 'The wick is fresh. Who lit it?'], ['THE COPPER CROWN', 'Too small for a king. Just right for a foreman.'],
  ['THE GLOWING SEED', 'Warm to the touch, it hums in your palm.'], ['A ROOT-WOVEN MASK', 'Woven by hands that were not quite hands.'], ['THE SPORE LANTERN', 'A jar of light that never dims.'],
  ['THE HEART GEODE', 'Split open, it rings like a bell.'], ['THE PRISM KEY', 'It opens nothing you can see.'], ['A CRYSTAL SKULL', 'Not carved. Grown.'],
  ['THE SUNKEN BELL', 'It still rings when the water moves.'], ['THE TIDE TABLET', 'Writing in a script older than the mountain.'], ['THE DROWNED KING\'S RING', 'Gold that the water never tarnished.'],
  ['THE EMBER EGG', 'Something inside is still warm.'], ['THE OBSIDIAN MIRROR', 'It shows the cave a moment late.'], ['THE MOUNTAIN\'S HEARTSTONE', 'The deepest thing anyone has held.'],
];
export const FOSSILS = [
  ['A CAVE TROLLOBITE', 'Segmented and curled like a woodlouse the size of a boot.'], ['A GIANT FERN FROND', 'From a forest that grew where this rock now stands.'],
  ['AN AMMONITE SPIRAL', 'Turned to opal over a hundred million years.'], ['A FISH WITH FOUR EYES', 'Two to look up, two to look down.'],
  ['A WING OF STONE', 'Too big for any bird.'], ['A NAUTILUS SHELL', 'Chambered and gleaming with pyrite.'],
  ['THE SEA DRAGON\'S JAW', 'Teeth like fence posts.'], ['A CORAL BRANCH', 'This was once the bottom of a warm sea.'],
  ['A SALAMANDER IN AMBER', 'Glassy and orange, frozen mid-step.'], ['A FOOTPRINT', 'Something walked here when the stone was mud.'],
];
export const WONDERS = [
  ['THE SUNSHAFT', 'Daylight from a crack a mile above, falling through the dust.'], ['THE ORE CATHEDRAL', 'Old timbers holding up a vault of copper and gold.'],
  ['THE MUSHROOM FOREST', 'Caps as wide as wagons, glowing softly blue.'], ['THE GLOWWORM SKY', 'Ten thousand threads of light across the ceiling.'],
  ['THE GREAT GEODE', 'A hollow egg of amethyst big enough to stand in.'], ['THE SINGING PRISMS', 'The air hums between crystals taller than trees.'],
  ['THE DROWNED GATE', 'A carved stone gate, half under black water.'], ['THE UNDERFALL', 'A river pouring down into the dark.'],
  ['THE LAVA FALL', 'Molten rock spilling down a wall of obsidian.'], ['THE BASALT ORGAN', 'Columns of black stone, like pipes of an organ.'],
];
export const NOTES = [
  'Day 3. The vein runs down, not along. Everyone told me I was mad. Everyone is up there, and the gold is down here.',
  'Bats hate a flare. Light one and they scatter like crows. Saved my hide twice today.',
  'Found a wall that sounds hollow when you tap it. Cracked rock usually means a room behind. Dynamite opens what the pick will not.',
  'The mushrooms down here glow brighter near water. Follow the glow and you will find a spring.',
  'Something pale follows me when my lamp burns low. It does not like the light. Keep the lamp fed.',
  'The crystals sing at night. Or is it day? No way to tell down here.',
  'Steps! Carved steps, going down into the water. People lived here. Before anyone.',
  'The eels watch from under the surface. When the water ripples, step back.',
  'It is warm now. Too warm. The rock glows red in the cracks. The heart of the mountain is close.',
  'If you are reading this, you came further than I did. Whatever is at the bottom, it is yours.',
];
export const CREATURES = {
  bat: ['CAVE BAT', 'Sleeps on the ceiling and swoops when woken. Scared off by flares.'],
  crawler: ['TUNNEL BEETLE', 'Patrols the floors. One good swing of the pick sees it off.'],
  shade: ['PALE SHADE', 'Drifts through walls toward the dark. A flare melts it away.'],
  eel: ['BLIND EEL', 'Waits under black water and lunges at anything on the edge.'],
  rockjaw: ['ROCKJAW', 'A worm that eats tunnels. Strike its head while it is stuck.'],
  gloomwing: ['GLOOMWING', 'Mother of every bat in the mountain. A flare knocks her out of the air.'],
  warden: ['THE PRISM WARDEN', 'A guardian grown from crystal. Break the glowing shards on its back.'],
  wyrm: ['TIDEWYRM', 'A drowned serpent. Its gills glow when it rests on the shore.'],
  heart: ['THE MOLTEN HEART', 'The mountain itself, awake. Hit its fists when they cool.'],
};

// Collection rewards: lamp colours, pick skins and perks (equip up to 2) unlocked by finishing sets.
// need(journal) -> [have, total]
const has = (list, ids) => ids.filter((i) => list.includes(i)).length;
const relics = (j) => j.relic.length + (j.endless || []).filter((e) => e.kind === 'relic').length;
export const REWARDS = [
  { key: 'lamp-copper', kind: 'lamp', name: 'COPPER FLAME', col: 0xff9a4a, how: 'All 3 relics of the Copper Hollows', need: (j) => [has(j.relic, [0, 1, 2]), 3] },
  { key: 'lamp-glow', kind: 'lamp', name: 'GLOWROOT BLUE', col: 0x7af5dc, how: 'All 3 relics of the Glowroot Grotto', need: (j) => [has(j.relic, [3, 4, 5]), 3] },
  { key: 'lamp-geode', kind: 'lamp', name: 'AMETHYST', col: 0xc9a2ff, how: 'All 3 relics of the Geode Vaults', need: (j) => [has(j.relic, [6, 7, 8]), 3] },
  { key: 'lamp-drowned', kind: 'lamp', name: 'DEEP WATER', col: 0x86d4ff, how: 'All 3 relics of the Drowned Halls', need: (j) => [has(j.relic, [9, 10, 11]), 3] },
  { key: 'lamp-ember', kind: 'lamp', name: 'EMBERLIGHT', col: 0xff7a52, how: 'All 3 relics of the Ember Core', need: (j) => [has(j.relic, [12, 13, 14]), 3] },
  { key: 'pick-gold', kind: 'pick', name: 'GOLDEN PICK', how: 'Dig up 3 buried caches', need: (j) => [(j.cache || []).length, 3], mat: { color: 0xffc24a, metalness: 1, roughness: 0.22, emissive: 0x2a1600 } },
  { key: 'pick-crystal', kind: 'pick', name: 'CRYSTAL PICK', how: 'Dig 3 fossils out of the rock', need: (j) => [j.fossil.length, 3], mat: { color: 0xc4a8ff, metalness: 0.1, roughness: 0.06, emissive: 0x5a2aa0 } },
  { key: 'pick-obsidian', kind: 'pick', name: 'OBSIDIAN PICK', how: 'Find 5 wonders', need: (j) => [j.wonder.length, 5], mat: { color: 0x18120f, metalness: 0.4, roughness: 0.1, emissive: 0x7a1a00 } },
  { key: 'pick-relic', kind: 'pick', name: 'RELIC PICK', how: 'Find 8 relics', need: (j) => [relics(j), 8], mat: { color: 0xb5823e, metalness: 0.9, roughness: 0.3, emissive: 0x1a6a5a } },
  { key: 'steadylamp', kind: 'perk', name: 'STEADY LAMP', desc: 'Your lamp burns 15% slower', how: 'Find 4 relics', need: (j) => [relics(j), 4] },
  { key: 'luckypick', kind: 'perk', name: 'LUCKY PICK', desc: 'Gold veins give an extra nugget', how: 'Dig up 2 buried caches', need: (j) => [(j.cache || []).length, 2] },
  { key: 'surefoot', kind: 'perk', name: 'SURE FOOT', desc: 'Survive falls a metre longer', how: 'Dig 2 fossils out of the rock', need: (j) => [j.fossil.length, 2] },
  { key: 'spareflare', kind: 'perk', name: 'SPARE FLARE', desc: 'Start every level with an extra flare', how: 'Find 3 wonders', need: (j) => [j.wonder.length, 3] },
  { key: 'keeneye', kind: 'perk', name: 'KEEN EYE', desc: 'Walls hiding a secret room glint gold', how: 'Open 5 secret rooms', need: (j) => [Math.min(j.secret || 0, 5), 5] },
];
export const MAX_PERKS = 2;

export const RANKS = [[0, 'GREENHORN'], [8, 'TUNNEL RAT'], [20, 'PROSPECTOR'], [40, 'DEEP DELVER'], [70, 'VEIN SEEKER'], [110, 'MOUNTAIN LEGEND']];
export const MEDALS = [
  ['first-depth', 'COPPER CLEARED', 'Beat Rockjaw'], ['glow', 'GLOWROOT CLEARED', 'Beat Gloomwing'], ['geode', 'GEODE CLEARED', 'Beat the Prism Warden'],
  ['drowned', 'DROWNED CLEARED', 'Beat Tidewyrm'], ['heart', 'HEART OF THE MOUNTAIN', 'Beat the Molten Heart'],
  ['relics3', 'COLLECTOR', 'Find 3 relics'], ['relics15', 'MUSEUM PIECE', 'Find all 15 relics'], ['wonders', 'SIGHTSEER', 'Find 5 wonders'],
  ['secrets10', 'HOLLOW TAPPER', 'Open 10 secret rooms'], ['fossils', 'BONE DIGGER', 'Dig up 5 fossils'], ['nohit', 'UNSCATHED', 'Clear a level without a scratch'],
  ['allgold', 'NOTHING LEFT BEHIND', 'Collect every bit of gold in a level'], ['endless10', 'DEEP DIVER', 'Reach level 10 of the Endless Deep'],
  ['rich', 'GOLD FEVER', 'Score 100,000 in one run'], ['explorer', 'CARTOGRAPHER', 'See 95% of a level'], ['caches5', 'TREASURE HUNTER', 'Dig up 5 buried caches'],
];
