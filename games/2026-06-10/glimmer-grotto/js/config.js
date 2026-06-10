// Glimmer Grotto — shared constants & data tables.

export const TILE = 32;            // world pixels per tile
export const WORLD_W = 192;        // tiles
export const WORLD_H = 560;        // tiles
export const SURFACE_Y = 12;       // first solid row
export const CHUNK = 16;           // tiles per chunk side

// tile type ids
export const T_AIR = 0, T_DIRT = 1, T_STONE = 2, T_HARD = 3, T_GRASS = 4,
  T_CRYS = 5, T_MUSH = 6, T_RUIN = 7, T_SPRING = 8, T_WATER = 9, T_BEDROCK = 10;

export const TILE_DEF = {
  [T_DIRT]:   { hp: 1.0, pick: 1, tex: ['tile_dirt', 'tile_dirt2'], chip: '#6e4c30' },
  [T_GRASS]:  { hp: 1.0, pick: 1, tex: ['tile_grass'],              chip: '#558a3b' },
  [T_STONE]:  { hp: 2.2, pick: 1, tex: ['tile_stone', 'tile_stone2'], chip: '#5d6770' },
  [T_HARD]:   { hp: 5.0, pick: 2, tex: ['tile_hardstone'],          chip: '#3b4052' },
  [T_CRYS]:   { hp: 3.0, pick: 2, tex: ['tile_crystal'],            chip: '#4a3870' },
  [T_MUSH]:   { hp: 1.6, pick: 1, tex: ['tile_mushroom'],           chip: '#46523c' },
  [T_RUIN]:   { hp: 3.2, pick: 2, tex: ['tile_ruins'],              chip: '#86703a' },
  [T_SPRING]: { hp: 2.4, pick: 2, tex: ['tile_spring'],             chip: '#824e38' },
};

// biome bands by tile-row. tint = parallax/ambient tint, backdrop = wall texture.
export const BIOMES = [
  { id: 'meadow',  name: 'Sunlit Meadow',     until: 15,  backdrop: 'backdrop_dirt',
    tint: '#ffb070', ambient: 0.07, pad: [220, 277.18, 329.63] },
  { id: 'earth',   name: 'Amber Earth',       until: 100, backdrop: 'backdrop_dirt',
    tint: '#c98a50', ambient: 0.48, pad: [220, 277.18, 329.63] },
  { id: 'stone',   name: 'Stone Depths',      until: 190, backdrop: 'backdrop_stone',
    tint: '#8a93b8', ambient: 0.66, pad: [196, 246.94, 293.66] },
  { id: 'crystal', name: 'Crystal Caverns',   until: 280, backdrop: 'backdrop_crystal',
    tint: '#a87ae0', ambient: 0.78, pad: [233.08, 293.66, 349.23] },
  { id: 'mush',    name: 'Mushroom Hollows',  until: 370, backdrop: 'backdrop_mushroom',
    tint: '#52c8b8', ambient: 0.79, pad: [207.65, 261.63, 311.13] },
  { id: 'spring',  name: 'Ember Hot Springs', until: 450, backdrop: 'backdrop_spring',
    tint: '#ff9468', ambient: 0.75, pad: [174.61, 220, 261.63] },
  { id: 'ruins',   name: 'Gilded Ruins',      until: 530, backdrop: 'backdrop_ruins',
    tint: '#e8c060', ambient: 0.80, pad: [185, 233.08, 277.18] },
  { id: 'lake',    name: 'The Still Lake',    until: 560, backdrop: 'backdrop_stone',
    tint: '#6fc3df', ambient: 0.83, pad: [164.81, 207.65, 246.94] },
];

export function biomeAt(ty) {
  for (const b of BIOMES) if (ty < b.until) return b;
  return BIOMES[BIOMES.length - 1];
}

// gems: value in shards, glow color, biome weighting by row range
export const GEM_DEF = {
  amber:    { name: 'Honey Amber',   value: 1,  glow: '#ffb050', rows: [15, 120],  rate: 0.030 },
  quartz:   { name: 'Rose Quartz',   value: 2,  glow: '#e8c8e0', rows: [60, 210],  rate: 0.026 },
  amethyst: { name: 'Amethyst',      value: 4,  glow: '#b07ae0', rows: [185, 295], rate: 0.030 },
  emerald:  { name: 'Emerald',       value: 6,  glow: '#50d890', rows: [275, 380], rate: 0.026 },
  sapphire: { name: 'Sapphire',      value: 9,  glow: '#5890e8', rows: [360, 465], rate: 0.026 },
  ruby:     { name: 'Ember Ruby',    value: 14, glow: '#f05060', rows: [440, 532], rate: 0.024 },
  diamond:  { name: 'Stilwater Diamond', value: 25, glow: '#b8f0ff', rows: [500, 558], rate: 0.018 },
};

export const TREASURE_DEF = {
  geode:    { name: 'Whispering Geode', sprite: 'geode_closed', open: 'geode_open', value: 8,
              rows: [100, 420], rate: 0.0030, flavor: 'It hums faintly when held to your ear.' },
  ammonite: { name: 'Ammonite',  sprite: 'fossil_ammonite', value: 6, rows: [40, 260],
              rate: 0.0028, flavor: 'A spiral older than the mountains above.' },
  fern:     { name: 'Fern Fossil', sprite: 'fossil_fern', value: 6, rows: [120, 360],
              rate: 0.0026, flavor: 'A forest pressed flat into forever.' },
  fish:     { name: 'Stone Fish', sprite: 'fossil_fish', value: 7, rows: [300, 540],
              rate: 0.0026, flavor: 'It swam here when the lake touched the sky.' },
};

export const UPGRADES = {
  pick: {
    name: 'Pickaxe', icon: 'pickaxe',
    tiers: [
      { cost: 0,   desc: 'Worn copper pick. Soft earth & stone.', power: 1.0, speed: 1.0, pick: 1 },
      { cost: 30,  desc: 'Bronze pick — bites into crystal and old brick.', power: 1.6, speed: 1.15, pick: 2 },
      { cost: 120, desc: 'Steel pick — hard granite yields to it.', power: 2.6, speed: 1.3, pick: 3 },
      { cost: 420, desc: 'Starmetal pick — the deep opens like bread.', power: 4.2, speed: 1.5, pick: 3 },
    ],
  },
  lantern: {
    name: 'Lantern', icon: 'lantern',
    tiers: [
      { cost: 0,   desc: 'A candle stub in glass.', radius: 175 },
      { cost: 25,  desc: 'Brass lantern — a wider, warmer pool of light.', radius: 240 },
      { cost: 100, desc: 'Miner’s beacon — the dark keeps its distance.', radius: 320 },
      { cost: 360, desc: 'Sunstone core — you carry a little dawn.', radius: 420 },
    ],
  },
  satchel: {
    name: 'Satchel', icon: 'icon_bag',
    tiers: [
      { cost: 0,   desc: 'A humble pouch.', cap: 12 },
      { cost: 20,  desc: 'Stitched satchel — room for more sparkle.', cap: 20 },
      { cost: 90,  desc: 'Traveler’s pack — pockets all the way down.', cap: 32 },
      { cost: 300, desc: 'Bag of holding (small). Probably magic.', cap: 50 },
    ],
  },
};

// journal wonders (biome first-visits)
export const WONDERS = {
  crystal: { name: 'Crystal Caverns', sprite: 'crystal_cluster_violet', flavor: 'Violet light, humming softly in stone.' },
  mush:    { name: 'Mushroom Hollows', sprite: 'mushroom_glow_big', flavor: 'A garden that never saw the sun.' },
  spring:  { name: 'Ember Springs', sprite: 'tile_spring', flavor: 'Warm water, rising steam, tired bones soothed.' },
  ruins:   { name: 'Gilded Ruins', sprite: 'ruins_pillar', flavor: 'Someone built. Someone left. The gold stayed.' },
  lake:    { name: 'The Still Lake', sprite: 'gem_diamond', flavor: 'The quietest place in the world.' },
};

export const ENERGY_MAX = 100;
export const REACH = 2.6 * TILE;     // dig reach from player center
export const SAVE_KEY = 'glimmer-grotto-v1';
