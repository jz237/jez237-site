// What each material sounds like: the engine's table (`acoustics::voice_of`,
// engine/src/acoustics.rs), written out by engine/tests/acoustics_voices.rs.
// Not edited by hand: change the table there and run
//   VX_WRITE_MIRRORS=1 cargo test --release --test acoustics_voices
// (the test fails while this file is not what it would write).
export const VOICE_CLASS = { STONE: 0, WOOD: 1, METAL: 2, COPPER: 3, GLASS: 4, SOFT: 5, LEAF: 6, PLASTER: 7 };
export const VOICE_FLAG = { REBAR: 1, LOOSE: 2, HUSHED: 4, SHEET: 8 };
// Material ids by name (`material.rs`).
export const MAT = { AIR: 0, BEDROCK: 1, DIRT: 2, GRASS: 3, ASPHALT: 4, CONCRETE: 5, REINFORCED: 6, BRICK: 7, WOOD: 8, PLANK: 9, GLASS: 10, STEEL: 11, PLASTER: 12, ROOF: 13, LEAF: 14, TRUNK: 15, RUBBLE: 16, EXPLOSIVE: 17, LAMP: 18, CHARRED: 19, STONE: 20, SIDEWALK: 21, PAINT_WHITE: 22, PAINT_YELLOW: 23, COPPER: 24, BRICK_BUFF: 25, BRICK_DARK: 26, RENDER: 27, PRECAST: 28, IRON: 29, RUST: 30, STEEL_YELLOW: 31, SHEET_RED: 32, SHEET_BLUE: 33, SHEET_WHITE: 34, SHEET_GREEN: 35, ZINC: 36, RUBBER: 37, CANVAS_RED: 38, CANVAS_WHITE: 39, WOOD_DARK: 40, WOOD_WHITE: 41, WOOD_GREEN: 42, SLATE: 43, GRAVEL: 44, TILE: 45, FABRIC: 46, GLASS_TINT: 47, CARPET: 48, DRYWALL: 49, WATER: 50, ASHLAR: 51, EMBER: 52, EMBER_LIGHT: 53, CINDER: 54, RUBBLE_MASONRY: 55, RUBBLE_TIMBER: 56, RUBBLE_METAL: 57, RUBBLE_EARTH: 58, FRAME: 59, BROWNSTONE: 60, TERRACOTTA: 61, STAINLESS: 62, STEEL_GREEN: 63, IRON_CREAM: 64, SHEET_YELLOW: 65, NEON_RED: 66, NEON_GREEN: 67, LATH: 68, IRONWORK: 69, FELT: 70, RUBBLE_PALE: 71, RUBBLE_GLASS: 72, SECTION_YELLOW: 73, SECTION: 74, STEEL_EL: 75, STEEL_EL_WEB: 76, RUBBLE_LEAF: 77, STEEL_GREEN_LIGHT: 78 };
// Per material: [class, pitch, brightness, level, flags].
export const VOICE_STRIDE = 5;
export const VOICES = new Float32Array([
  0, 1, 1, 1, 0, // 0 air
  0, 0.85, 1.1, 1, 0, // 1 bedrock
  5, 1, 1, 1, 2, // 2 dirt
  5, 1.1, 0.9, 0.9, 2, // 3 grass
  0, 0.9, 0.8, 1, 0, // 4 asphalt
  0, 1, 1, 1, 0, // 5 concrete
  0, 0.9, 1, 1, 1, // 6 reinforced
  0, 1.25, 1.1, 1, 0, // 7 brick
  1, 1, 1, 1, 0, // 8 wood
  1, 1.3, 1.1, 1, 0, // 9 plank
  4, 1, 1, 1, 0, // 10 glass
  2, 1, 1, 1, 0, // 11 steel
  7, 1, 1, 1, 0, // 12 plaster
  0, 1.6, 1.3, 0.9, 0, // 13 roof
  6, 1, 1, 1, 0, // 14 leaf
  1, 0.72, 0.9, 1, 0, // 15 trunk
  0, 1.1, 1.1, 0.9, 2, // 16 rubble
  1, 0.9, 0.8, 1, 0, // 17 explosive
  4, 1.15, 1, 1, 0, // 18 lamp
  1, 0.85, 0.6, 0.7, 0, // 19 charred
  0, 1.1, 1.25, 1, 0, // 20 stone
  0, 1.05, 1, 1, 0, // 21 sidewalk
  0, 0.9, 0.8, 1, 0, // 22 paint_white
  0, 0.9, 0.8, 1, 0, // 23 paint_yellow
  3, 1, 1, 1, 0, // 24 copper
  0, 1.25, 1.1, 1, 0, // 25 brick_buff
  0, 1.2, 1.25, 1, 0, // 26 brick_dark
  7, 0.9, 1, 1, 0, // 27 render
  0, 0.95, 1.05, 1, 1, // 28 precast
  2, 0.9, 0.8, 1, 0, // 29 iron
  2, 0.95, 0.7, 0.9, 0, // 30 rust
  2, 1, 1, 1, 0, // 31 steel_yellow
  2, 1.45, 1.2, 0.85, 8, // 32 sheet_red
  2, 1.45, 1.2, 0.85, 8, // 33 sheet_blue
  2, 1.45, 1.2, 0.85, 8, // 34 sheet_white
  2, 1.45, 1.2, 0.85, 8, // 35 sheet_green
  2, 1.6, 1.25, 0.8, 8, // 36 zinc
  5, 0.8, 0.6, 0.8, 0, // 37 rubber
  5, 1.25, 0.6, 0.6, 0, // 38 canvas_red
  5, 1.25, 0.6, 0.6, 0, // 39 canvas_white
  1, 0.8, 0.9, 1, 0, // 40 wood_dark
  1, 1.3, 1.1, 1, 0, // 41 wood_white
  1, 1.3, 1.1, 1, 0, // 42 wood_green
  0, 1.75, 1.4, 0.9, 0, // 43 slate
  0, 1.1, 1.1, 0.9, 2, // 44 gravel
  0, 1.5, 1.35, 0.95, 0, // 45 tile
  5, 1.25, 0.6, 0.6, 0, // 46 fabric
  4, 1, 1, 1, 0, // 47 glass_tint
  0, 0.9, 0.5, 0.8, 5, // 48 carpet
  7, 1.1, 0.9, 0.9, 0, // 49 drywall
  5, 0.9, 0.5, 0.6, 2, // 50 water
  0, 1.1, 1.25, 1, 0, // 51 ashlar
  1, 0.85, 0.6, 0.7, 0, // 52 ember
  6, 1, 1, 1, 0, // 53 ember_light
  1, 0.95, 0.5, 0.5, 0, // 54 cinder
  0, 1.1, 1.1, 0.9, 2, // 55 rubble_masonry
  1, 1.2, 0.8, 0.7, 2, // 56 rubble_timber
  2, 1.3, 0.9, 0.7, 2, // 57 rubble_metal
  5, 1, 1, 0.9, 2, // 58 rubble_earth
  2, 1.5, 1.1, 0.7, 0, // 59 frame
  0, 0.95, 0.9, 1, 0, // 60 brownstone
  0, 1.5, 1.35, 0.95, 0, // 61 terracotta
  2, 1.6, 1.25, 0.8, 8, // 62 stainless
  2, 1, 1, 1, 0, // 63 steel_green
  2, 0.9, 0.8, 1, 0, // 64 iron_cream
  2, 1.45, 1.2, 0.85, 8, // 65 sheet_yellow
  4, 1.35, 1, 0.8, 0, // 66 neon_red
  4, 1.35, 1, 0.8, 0, // 67 neon_green
  7, 1.1, 0.9, 0.9, 0, // 68 lath
  2, 1.35, 1.1, 0.8, 0, // 69 ironwork
  5, 1.25, 0.6, 0.6, 0, // 70 felt
  7, 1.1, 1, 0.8, 2, // 71 rubble_pale
  4, 1.2, 1, 0.7, 2, // 72 rubble_glass
  2, 1.2, 1.05, 0.9, 0, // 73 section_yellow
  2, 1.2, 1.05, 0.9, 0, // 74 section
  2, 1, 1, 1, 0, // 75 steel_el
  2, 1, 1, 1, 0, // 76 steel_el_web
  6, 1, 0.9, 0.8, 2, // 77 rubble_leaf
  2, 1, 1, 1, 0, // 78 steel_green_light
]);
