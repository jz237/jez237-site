// World: tile grid generation, chunk-cached rendering, digging, decor, props, pickups.

import { TILE, WORLD_W as W, WORLD_H as H, SURFACE_Y, CHUNK,
  T_AIR, T_DIRT, T_STONE, T_HARD, T_GRASS, T_CRYS, T_MUSH, T_RUIN, T_SPRING,
  T_WATER, T_BEDROCK, TILE_DEF, BIOMES, biomeAt, GEM_DEF, TREASURE_DEF,
  LANDMARK_DEF, JELLY } from './config.js';
import { hash2, fbm, mulberry32, clamp } from './util.js';
import { IMG, CRACKS } from './assets.js';

const GEM_IDS = Object.keys(GEM_DEF);          // 1..7 in veins array
const TRE_IDS = Object.keys(TREASURE_DEF);     // 8..16
export const VEIN_JELLY = 30;                  // glowcap jelly consumable

export const world = {
  grid: new Uint8Array(W * H),
  veins: new Uint8Array(W * H),
  damage: new Map(),
  modified: new Map(),       // idx -> type (persisted)
  decor: new Map(),          // anchorIdx -> decor item
  props: [],                 // campfires, carts, tent...
  restSpots: [],             // {x, y} px (campfire positions)
  pickups: [],
  landmarks: [],             // {id,name,flavor,sprite,x,y,r} px
  waterfalls: [],            // {x,y0,y1} px
  surf: new Int16Array(W),
  seed: 20260610,
  campX: 26,                 // tile
  spawn: { x: 0, y: 0 },
};

const idx = (tx, ty) => ty * W + tx;
export const tileAt = (tx, ty) => {
  if (tx < 0 || tx >= W || ty < 0) return T_BEDROCK;
  if (ty >= H) return T_BEDROCK;
  return world.grid[idx(tx, ty)];
};
export const isSolid = t => t !== T_AIR && t !== T_WATER;
export const solidAt = (tx, ty) => isSolid(tileAt(tx, ty));
export const waterAt = (tx, ty) => tileAt(tx, ty) === T_WATER;
export const waterAtPx = (x, y) => waterAt(Math.floor(x / TILE), Math.floor(y / TILE));
export const solidAtPx = (x, y) => solidAt(Math.floor(x / TILE), Math.floor(y / TILE));

const GATES = [[188, 190], [448, 450], [528, 530]];
const inGate = ty => GATES.some(([a, b]) => ty >= a && ty <= b);

// ---------------------------------------------------------------- generation
export function generate(seed = 20260610) {
  world.seed = seed;
  const g = world.grid, v = world.veins;
  const S1 = seed, S2 = seed + 101, S3 = seed + 202, S4 = seed + 303;

  // surface heights
  for (let tx = 0; tx < W; tx++)
    world.surf[tx] = SURFACE_Y + Math.round(fbm(tx * 0.05, 0, S1, 2) * 5);

  for (let ty = 0; ty < H; ty++) {
    const biome = biomeAt(ty);
    for (let tx = 0; tx < W; tx++) {
      const i = idx(tx, ty);
      const s = world.surf[tx];
      if (ty < s) { g[i] = T_AIR; continue; }
      if (ty === s) { g[i] = T_GRASS; continue; }
      // borders
      if (tx < 2 || tx >= W - 2 || ty >= H - 3) { g[i] = T_BEDROCK; continue; }
      // gates: thick hard bands with rare soft gaps
      if (inGate(ty)) {
        g[i] = fbm(tx * 0.11, ty * 0.3, S4, 2) > 0.78 ? T_STONE : T_HARD;
        continue;
      }
      // base material per biome (+ patchiness)
      const patch = fbm(tx * 0.07, ty * 0.07, S2, 3);
      let t;
      if (ty < s + 5) t = T_DIRT;
      else switch (biome.id) {
        case 'earth':  t = patch > 0.64 ? T_STONE : T_DIRT; break;
        case 'stone':  t = patch > 0.70 ? T_HARD : (patch < 0.34 ? T_DIRT : T_STONE); break;
        case 'crystal':t = patch > 0.72 ? T_HARD : (patch < 0.32 ? T_STONE : T_CRYS); break;
        case 'mush':   t = patch > 0.70 ? T_STONE : T_MUSH; break;
        case 'spring': t = patch > 0.72 ? T_HARD : T_SPRING; break;
        case 'ruins':  t = patch > 0.74 ? T_HARD : (patch < 0.30 ? T_STONE : T_RUIN); break;
        case 'lake':   t = T_STONE; break;
        default:       t = T_DIRT;
      }
      // biome transition dithering (soften band edges)
      const next = BIOMES[BIOMES.indexOf(biome) + 1];
      if (next && ty > biome.until - 7 && !inGate(ty)) {
        const tt = (ty - (biome.until - 7)) / 7;
        if (hash2(tx, ty, S3) < tt * 0.5) {
          const map = { stone: T_STONE, crystal: T_CRYS, mush: T_MUSH, spring: T_SPRING, ruins: T_RUIN, lake: T_STONE };
          t = map[next.id] ?? t;
        }
      }
      g[i] = t;

      // caves
      const cv = fbm(tx * 0.045, ty * 0.045, S3, 3);
      const depthT = clamp((ty - s) / 60, 0, 1);
      const openness = ty < s + 4 ? 1 : 0.615 - depthT * 0.02 -
        (biome.id === 'crystal' || biome.id === 'mush' ? 0.03 : 0);
      if (ty > s + 3 && cv > openness && !inGate(ty)) g[i] = T_AIR;
    }
  }

  carveTunnel(seed);
  carveGrottos(seed);
  carveLake();
  placeVeins(seed);
  buildCamp();
  buildRestSpots(seed);
  buildLandmarks(seed);
  placeDecor(seed);

  // re-apply persisted edits
  for (const [i, t] of world.modified) {
    world.grid[i] = t;
    if (t === T_AIR) { world.veins[i] = 0; world.decor.delete(i); }
  }
  chunkCache.clear();
}

function carveDisc(cx, cy, r, toWater = false) {
  for (let ty = Math.floor(cy - r); ty <= cy + r; ty++)
    for (let tx = Math.floor(cx - r); tx <= cx + r; tx++) {
      if (tx < 2 || tx >= W - 2 || ty < 1 || ty >= H - 3) continue;
      if (inGate(ty)) continue;
      const d = (tx - cx) ** 2 + (ty - cy) ** 2;
      if (d <= r * r) world.grid[idx(tx, ty)] = toWater ? T_WATER : T_AIR;
    }
}

function carveTunnel(seed) {
  const rnd = mulberry32(seed + 7);
  let x = world.campX + 8, y = world.surf[world.campX + 8] + 2;
  while (y < H - 24) {
    if (!inGate(Math.round(y))) carveDisc(Math.round(x), Math.round(y), 1 + rnd() * 1.4);
    x += (rnd() - 0.5) * 3;
    x = clamp(x, 14, W - 14);
    y += 0.7 + rnd() * 0.8;
  }
}

const grottos = [];
function carveGrottos(seed) {
  const rnd = mulberry32(seed + 13);
  grottos.length = 0;
  for (const b of BIOMES) {
    if (b.id === 'meadow' || b.id === 'lake') continue;
    const from = (BIOMES[BIOMES.indexOf(b) - 1]?.until ?? SURFACE_Y) + 8;
    const n = 4 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const cy = from + rnd() * (b.until - 8 - from);
      const cx = 12 + rnd() * (W - 24);
      const rx = 5 + rnd() * 9, ry = 3 + rnd() * 4;
      for (let ty = Math.floor(cy - ry); ty <= cy + ry; ty++)
        for (let tx = Math.floor(cx - rx); tx <= cx + rx; tx++) {
          if (tx < 2 || tx >= W - 2 || ty < 1 || ty >= H - 3 || inGate(ty)) continue;
          const e = ((tx - cx) / rx) ** 2 + ((ty - cy) / ry) ** 2;
          if (e <= 1 + (hash2(tx, ty, seed) - .5) * .3) world.grid[idx(tx, ty)] = T_AIR;
        }
      grottos.push({ cx, cy, rx, ry, biome: b.id });
      // hot-spring pools: flood lower part of spring grottos
      if (b.id === 'spring') {
        const wy = Math.floor(cy + ry * 0.25);
        for (let ty = wy; ty <= cy + ry + 1; ty++)
          for (let tx = Math.floor(cx - rx); tx <= cx + rx; tx++) {
            if (tx < 2 || tx >= W - 2) continue;
            if (world.grid[idx(tx, ty)] === T_AIR) world.grid[idx(tx, ty)] = T_WATER;
          }
      }
    }
  }
}

function carveLake() {
  const cy = 545, cx = W / 2, rx = W * 0.38, ry = 13;
  for (let ty = Math.floor(cy - ry); ty < H - 3; ty++)
    for (let tx = 4; tx < W - 4; tx++) {
      const e = ((tx - cx) / rx) ** 2 + ((ty - cy) / ry) ** 2;
      if (e <= 1) world.grid[idx(tx, ty)] = ty > cy - 4 ? T_WATER : T_AIR;
    }
}

function placeVeins(seed) {
  for (let ty = SURFACE_Y; ty < H - 3; ty++) {
    for (let tx = 2; tx < W - 2; tx++) {
      const i = idx(tx, ty);
      const t = world.grid[i];
      if (!isSolid(t) || t === T_BEDROCK || t === T_HARD) continue;
      // gems (clustered)
      for (let gi = 0; gi < GEM_IDS.length; gi++) {
        const gd = GEM_DEF[GEM_IDS[gi]];
        if (ty < gd.rows[0] || ty > gd.rows[1]) continue;
        const cluster = fbm(tx * 0.09, ty * 0.09, seed + 500 + gi * 17, 2);
        const rate = gd.rate * (cluster > 0.60 ? 3.2 : 0.25);
        if (hash2(tx, ty, seed + 900 + gi) < rate) { world.veins[i] = gi + 1; break; }
      }
      if (world.veins[i]) continue;
      for (let ti = 0; ti < TRE_IDS.length; ti++) {
        const td = TREASURE_DEF[TRE_IDS[ti]];
        if (ty < td.rows[0] || ty > td.rows[1]) continue;
        if (hash2(tx, ty, seed + 1300 + ti) < td.rate) { world.veins[i] = 8 + ti; break; }
      }
      if (world.veins[i]) continue;
      if (ty >= JELLY.rows[0] && hash2(tx, ty, seed + 2700) < JELLY.rate)
        world.veins[i] = VEIN_JELLY;
    }
  }
}

function flatten(txFrom, txTo, ty) {
  for (let tx = txFrom; tx <= txTo; tx++) {
    world.surf[tx] = ty;
    for (let y = 0; y < H - 3; y++) {
      const i = idx(tx, y);
      if (y < ty) world.grid[i] = T_AIR;
      else if (y === ty) world.grid[i] = T_GRASS;
      else if (y < ty + 8 && (!isSolid(world.grid[i]) || world.grid[i] === T_GRASS))
        world.grid[i] = T_DIRT;
    }
  }
}

function buildCamp() {
  const cx = world.campX;
  const gy = world.surf[cx];
  flatten(cx - 9, cx + 14, gy);
  const px = t => t * TILE;
  world.props = [];
  world.props.push(
    { type: 'tent', x: px(cx - 6), y: px(gy), interact: 'shop' },
    { type: 'campfire', x: px(cx + 1), y: px(gy), interact: 'rest', light: true },
    { type: 'crate', x: px(cx - 2.6), y: px(gy) },
    { type: 'minecart', x: px(cx + 5), y: px(gy), interact: 'rest' },
    { type: 'tree_pine', x: px(cx + 11), y: px(gy) },
    { type: 'tree_pine', x: px(cx - 9), y: px(gy), flip: true },
  );
  world.restSpots = [{ x: px(cx + 1.5), y: px(gy - 1) }];
  world.spawn = { x: px(cx + 3), y: px(gy - 2) };
}

function buildRestSpots(seed) {
  const rnd = mulberry32(seed + 23);
  for (const ry of [70, 150, 240, 330, 410, 490]) {
    const rx = Math.floor(14 + rnd() * (W - 28));
    // carve alcove with solid floor
    for (let ty = ry - 3; ty <= ry; ty++)
      for (let tx = rx - 4; tx <= rx + 4; tx++)
        if (!inGate(ty)) world.grid[idx(tx, ty)] = ty === ry ? world.grid[idx(tx, ty)] : T_AIR;
    for (let tx = rx - 4; tx <= rx + 4; tx++) {       // ensure floor
      const i = idx(tx, ry);
      if (!isSolid(world.grid[i])) world.grid[i] = T_STONE;
      world.veins[i] = 0;
    }
    const px = t => t * TILE;
    world.props.push(
      { type: 'campfire', x: px(rx - 1.5), y: px(ry), interact: 'rest', light: true },
      { type: 'minecart', x: px(rx + 2), y: px(ry), interact: 'rest' },
    );
    world.restSpots.push({ x: px(rx), y: px(ry - 1) });
  }
}

// ------------------------------------------------------------ landmarks
function carveRoom(rx, ry, hw, hh) {
  for (let ty = ry - hh; ty <= ry - 1; ty++)
    for (let tx = rx - hw; tx <= rx + hw; tx++) {
      if (tx < 3 || tx >= W - 3 || ty < 1 || ty >= H - 4 || inGate(ty)) continue;
      world.grid[idx(tx, ty)] = T_AIR;
    }
  for (let tx = rx - hw; tx <= rx + hw; tx++) {       // guarantee a floor
    if (tx < 3 || tx >= W - 3) continue;
    const i = idx(tx, ry);
    if (!isSolid(world.grid[i])) world.grid[i] = T_STONE;
    world.veins[i] = 0;
  }
}

function buildLandmarks(seed) {
  const rnd = mulberry32(seed + 31);
  world.landmarks = [];
  world.waterfalls = [];
  const px = t => t * TILE;
  const reg = (def, rx, ry, r = 8) =>
    world.landmarks.push({ id: def.id, name: def.name, flavor: def.flavor,
      sprite: def.sprite, x: px(rx), y: px(ry), r: px(r) });
  for (const def of LANDMARK_DEF) {
    let rx = Math.floor(24 + rnd() * (W - 48));
    let ry = Math.floor(def.rows[0] + rnd() * (def.rows[1] - def.rows[0]));
    switch (def.id) {
      case 'workings':
        carveRoom(rx, ry, 8, 4);
        world.props.push(
          { type: 'support_beam', x: px(rx - 5), y: px(ry) },
          { type: 'support_beam', x: px(rx + 0.2), y: px(ry) },
          { type: 'support_beam', x: px(rx + 5.4), y: px(ry) },
          { type: 'cart_wreck', x: px(rx + 2.8), y: px(ry), sc: 1.3 },
          // hangs just under the middle support's crossbeam
          { type: 'lantern', x: px(rx + 0.2), y: px(ry) - 38, glow: ['warm', 150] },
        );
        reg(def, rx, ry); break;
      case 'murals':
        carveRoom(rx, ry, 9, 3);
        world.props.push(
          { type: 'mural_miners', x: px(rx - 5.5), y: px(ry - 0.7), sc: 1.5 },
          { type: 'mural_beasts', x: px(rx), y: px(ry - 0.7), sc: 1.5 },
          { type: 'mural_hands', x: px(rx + 5.5), y: px(ry - 0.7), sc: 1.5 },
          { type: 'flower_glow', x: px(rx - 8), y: px(ry), glow: ['cyan', 70] },
          { type: 'flower_glow', x: px(rx + 8), y: px(ry), glow: ['cyan', 70] },
        );
        reg(def, rx, ry, 10); break;
      case 'geode':
        carveRoom(rx, ry, 8, 6);
        world.props.push(
          { type: 'crystal_cluster_violet', x: px(rx - 5), y: px(ry), glow: ['violet', 170] },
          { type: 'crystal_cluster_teal', x: px(rx - 1.6), y: px(ry), glow: ['teal', 150] },
          { type: 'crystal_cluster_violet', x: px(rx + 2.4), y: px(ry), glow: ['violet', 170] },
          { type: 'crystal_cluster_teal', x: px(rx + 5.8), y: px(ry), glow: ['teal', 150] },
          { type: 'flower_glow', x: px(rx - 7.4), y: px(ry), glow: ['cyan', 60] },
        );
        reg(def, rx, ry, 9); break;
      case 'eldercap':
        carveRoom(rx, ry, 7, 7);
        world.props.push(
          { type: 'great_mushroom', x: px(rx), y: px(ry), glow: ['teal', 260], sc: 2.4 },
          { type: 'mushroom_glow_small', x: px(rx - 4.6), y: px(ry), glow: ['teal', 80] },
          { type: 'mushroom_glow_small', x: px(rx + 4.2), y: px(ry), glow: ['teal', 80] },
          { type: 'spore_plant', x: px(rx - 6.2), y: px(ry), glow: ['teal', 60] },
          { type: 'spore_plant', x: px(rx + 6.4), y: px(ry), glow: ['teal', 60] },
        );
        reg(def, rx, ry); break;
      case 'falls': {
        carveRoom(rx, ry, 8, 6);
        for (let tx = rx - 6; tx <= rx + 6; tx++)
          for (let ty = ry - 2; ty <= ry - 1; ty++)
            if (world.grid[idx(tx, ty)] === T_AIR) world.grid[idx(tx, ty)] = T_WATER;
        const surfY = px(ry - 2) + 7;
        world.waterfalls.push({ x: px(rx - 3) + 8, y0: px(ry - 6) - 4, y1: surfY });
        world.waterfalls.push({ x: px(rx + 2.6) + 8, y0: px(ry - 6) - 4, y1: surfY });
        world.props.push(
          { type: 'spring_lily', x: px(rx - 1), y: surfY + 4 },
          { type: 'spring_lily', x: px(rx + 4.4), y: surfY + 4 },
          { type: 'cairn', x: px(rx - 7.4), y: px(ry) },
          { type: 'cairn', x: px(rx + 7.6), y: px(ry) },
        );
        reg(def, rx, ry, 10); break;
      }
      case 'shrine': {
        carveRoom(rx, ry, 7, 5);
        for (let tx = rx - 1; tx <= rx + 1; tx++) {     // raised dais
          world.grid[idx(tx, ry - 1)] = T_RUIN; world.veins[idx(tx, ry - 1)] = 0;
        }
        world.props.push(
          { type: 'statue_owl', x: px(rx), y: px(ry - 1), glow: ['gold', 150], sc: 1.8 },
          { type: 'ruins_pillar', x: px(rx - 5), y: px(ry) },
          { type: 'ruins_pillar', x: px(rx + 5), y: px(ry) },
          { type: 'urn', x: px(rx - 2.8), y: px(ry) },
          { type: 'urn', x: px(rx + 2.9), y: px(ry) },
        );
        reg(def, rx, ry); break;
      }
      case 'ferryman': {
        rx = Math.floor(W / 2 + (rnd() - 0.5) * 40);
        let fy = 546;
        while (fy < H - 4 && !isSolid(world.grid[idx(rx, fy)])) fy++;
        world.props.push(
          { type: 'sunken_boat', x: px(rx), y: px(fy), glow: ['cyan', 130], sc: 1.7 },
          { type: 'reeds', x: px(rx - 5), y: px(fy) },
          { type: 'reeds', x: px(rx + 5.6), y: px(fy) },
          { type: 'reeds', x: px(rx + 7.2), y: px(fy) },
        );
        reg(def, rx, fy, 9); break;
      }
    }
  }
}

function placeDecor(seed) {
  world.decor.clear();
  const add = (i, item) => { if (!world.decor.has(i)) world.decor.set(i, item); };
  for (let ty = SURFACE_Y; ty < H - 4; ty++) {
    const b = biomeAt(ty);
    for (let tx = 2; tx < W - 2; tx++) {
      const i = idx(tx, ty);
      if (world.grid[i] !== T_AIR) continue;
      const r = hash2(tx, ty, seed + 4000);
      const x = (tx + 0.5) * TILE, yTop = ty * TILE, yBot = (ty + 1) * TILE;
      // ceiling decor (solid above)
      if (isSolid(tileAt(tx, ty - 1)) && tileAt(tx, ty - 1) !== T_BEDROCK) {
        if (r < 0.08) {
          const pick = hash2(tx, ty, seed + 4100);
          let s = 'stalactite';
          if (b.id === 'earth' && pick < 0.5) s = 'roots';
          else if (b.id === 'mush' && pick < 0.5) s = 'vine';
          else if (b.id === 'earth' && pick < 0.75) s = 'vine';
          add(i, { sprite: s, x, y: yTop, anchor: idx(tx, ty - 1), ceil: true, sway: s !== 'stalactite', drip: s === 'stalactite' && pick > 0.6 });
          continue;
        }
      }
      // floor decor (solid below)
      if (isSolid(tileAt(tx, ty + 1)) && tileAt(tx, ty + 1) !== T_BEDROCK) {
        if (r > 0.08 && r < 0.22) {
          const pick = hash2(tx, ty, seed + 4200);
          let s = null, light = null;
          if (tileAt(tx, ty + 1) === T_GRASS) {          // sunlit meadow scatter
            s = pick < 0.42 ? 'flowers_patch' : (pick < 0.62 ? 'bush' :
                (pick < 0.78 ? 'fern' : (pick < 0.86 ? 'tree_pine' : null)));
          } else switch (b.id) {
            case 'earth': s = pick < 0.4 ? 'fern' : (pick < 0.58 ? 'boulder' :
                (pick < 0.74 ? 'mushroom_glow_small' : 'stalagmite'));
              if (s === 'mushroom_glow_small') light = ['teal', 70]; break;
            case 'stone': s = pick < 0.45 ? 'stalagmite' : (pick < 0.72 ? 'boulder' : 'fern'); break;
            case 'crystal': s = pick < 0.5 ? 'crystal_cluster_violet' : (pick < 0.72 ? 'flower_glow' :
                (pick < 0.86 ? 'boulder' : 'stalagmite'));
              if (s === 'crystal_cluster_violet') light = ['violet', 150];
              if (s === 'flower_glow') light = ['cyan', 60]; break;
            case 'mush': s = pick < 0.38 ? 'mushroom_glow_big' : (pick < 0.6 ? 'mushroom_glow_small' :
                (pick < 0.8 ? 'spore_plant' : 'fern'));
              if (s !== 'fern') light = ['teal', s === 'mushroom_glow_big' ? 165 : (s === 'spore_plant' ? 60 : 80)];
              break;
            case 'spring': s = pick < 0.35 ? 'stalagmite' : (pick < 0.58 ? 'cairn' : 'fern'); break;
            case 'ruins': s = pick < 0.3 ? 'ruins_pillar' : (pick < 0.48 ? 'urn' :
                (pick < 0.68 ? 'crystal_cluster_teal' : 'fern'));
              if (s === 'crystal_cluster_teal') light = ['teal', 100]; break;
            case 'lake': s = pick < 0.4 ? 'reeds' : (pick < 0.62 ? 'crystal_cluster_teal' : 'stalagmite');
              if (s === 'crystal_cluster_teal') light = ['cyan', 110]; break;
          }
          if (s) add(i, { sprite: s, x, y: yBot, anchor: idx(tx, ty + 1), ceil: false,
            sway: s === 'fern' || s === 'reeds' || s === 'flowers_patch', light });
          continue;
        }
      }
      // wall decor: glowing shelf fungi cling to cave walls
      if (r > 0.23 && r < 0.265 && (b.id === 'mush' || b.id === 'stone' || b.id === 'crystal')) {
        const lw = isSolid(tileAt(tx - 1, ty)) && tileAt(tx - 1, ty) !== T_BEDROCK;
        const rw = isSolid(tileAt(tx + 1, ty)) && tileAt(tx + 1, ty) !== T_BEDROCK;
        if (lw || rw)
          add(i, { sprite: 'shelf_fungi', x: lw ? tx * TILE + 7 : (tx + 1) * TILE - 7,
            y: yBot, anchor: lw ? idx(tx - 1, ty) : idx(tx + 1, ty), ceil: false,
            flip: rw && !lw, light: ['teal', 55] });
      }
    }
  }
}

// ---------------------------------------------------------------- digging
export function damageTile(tx, ty, power, pickTier) {
  const t = tileAt(tx, ty);
  if (!isSolid(t) || t === T_BEDROCK) return { hit: false };
  const def = TILE_DEF[t];
  if (!def) return { hit: false };
  if (pickTier < def.pick) return { hit: true, blocked: true, type: t };
  const i = idx(tx, ty);
  const dmg = (world.damage.get(i) || 0) + power;
  if (dmg >= def.hp) {
    world.damage.delete(i);
    const vein = world.veins[i];
    world.veins[i] = 0;
    world.grid[i] = T_AIR;
    world.modified.set(i, T_AIR);
    dirtyAround(tx, ty);
    // water flows down into freshly dug holes
    if (tileAt(tx, ty - 1) === T_WATER || tileAt(tx - 1, ty) === T_WATER || tileAt(tx + 1, ty) === T_WATER) {
      world.grid[i] = T_WATER; world.modified.set(i, T_WATER);
    }
    return { hit: true, broken: true, type: t, vein, chip: def.chip };
  }
  world.damage.set(i, dmg);
  dirtyChunkOf(tx, ty);
  return { hit: true, broken: false, type: t, chip: def.chip };
}

export function spawnPickupsFor(vein, tx, ty, rnd = Math.random) {
  const cx = (tx + 0.5) * TILE, cy = (ty + 0.5) * TILE;
  if (vein >= 1 && vein <= 7) {
    const id = GEM_IDS[vein - 1];
    const n = 1 + (rnd() < 0.3 ? 1 : 0);
    for (let k = 0; k < n; k++)
      world.pickups.push({ kind: 'gem', id, x: cx, y: cy, vx: (rnd() - .5) * 130, vy: -90 - rnd() * 80, t: 0 });
    return id;
  }
  if (vein === VEIN_JELLY) {
    world.pickups.push({ kind: 'buff', id: 'jelly', x: cx, y: cy, vx: (rnd() - .5) * 70, vy: -70, t: 0 });
    return 'jelly';
  }
  if (vein >= 8) {
    const id = TRE_IDS[vein - 8];
    world.pickups.push({ kind: 'treasure', id, x: cx, y: cy, vx: (rnd() - .5) * 70, vy: -70, t: 0 });
    return id;
  }
  return null;
}

// ---------------------------------------------------------------- chunk cache
const chunkCache = new Map();   // key -> {canvas, stamp}
const CW = Math.ceil(W / CHUNK), CH = Math.ceil(H / CHUNK);
let aoStrips = null;

function bakeAO() {
  aoStrips = {};
  for (const dir of ['top', 'bottom', 'left', 'right']) {
    const c = document.createElement('canvas'); c.width = c.height = TILE;
    const x = c.getContext('2d');
    let gr;
    if (dir === 'top') gr = x.createLinearGradient(0, 0, 0, 12);
    if (dir === 'bottom') gr = x.createLinearGradient(0, TILE, 0, TILE - 12);
    if (dir === 'left') gr = x.createLinearGradient(0, 0, 12, 0);
    if (dir === 'right') gr = x.createLinearGradient(TILE, 0, TILE - 12, 0);
    gr.addColorStop(0, 'rgba(8,5,3,.5)'); gr.addColorStop(1, 'rgba(8,5,3,0)');
    x.fillStyle = gr; x.fillRect(0, 0, TILE, TILE);
    aoStrips[dir] = c;
  }
}

export function dirtyChunkOf(tx, ty) {
  chunkCache.delete(((ty / CHUNK) | 0) * CW + ((tx / CHUNK) | 0));
}
function dirtyAround(tx, ty) {
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) dirtyChunkOf(tx + dx, ty + dy);
}

function texFor(t, tx, ty) {
  if (t === T_BEDROCK) return IMG['tile_hardstone'];
  const def = TILE_DEF[t];
  const v = def.tex.length > 1 ? (hash2(tx, ty, 31) < 0.5 ? 0 : 1) : 0;
  return IMG[def.tex[v]];
}

function buildChunk(cxi, cyi) {
  const c = document.createElement('canvas');
  c.width = c.height = CHUNK * TILE;
  const x = c.getContext('2d');
  const lights = [];
  for (let ly = 0; ly < CHUNK; ly++) {
    const ty = cyi * CHUNK + ly;
    if (ty >= H) break;
    const biome = biomeAt(ty);
    const bdTex = IMG[biome.backdrop];
    for (let lx = 0; lx < CHUNK; lx++) {
      const tx = cxi * CHUNK + lx;
      if (tx >= W) break;
      const t = world.grid[idx(tx, ty)];
      const px = lx * TILE, py = ly * TILE;
      const aboveSurface = ty < world.surf[tx];
      if (t === T_AIR || t === T_WATER) {
        if (!aboveSurface) {
          // truly vast caverns open onto the parallax layers for depth;
          // anything within 3 tiles of solid keeps the near-wall backdrop
          // (so carved rooms stay cosy instead of showing odd dark windows).
          let nearSolid = 0;
          for (let dy = -4; dy <= 4 && !nearSolid; dy++)
            for (let dx = -4; dx <= 4; dx++)
              if (solidAt(tx + dx, ty + dy)) { nearSolid = 1; break; }
          if (nearSolid) x.drawImage(bdTex, px, py, TILE, TILE);
          else {
            x.globalAlpha = 0.45;                       // soft fade to parallax depth
            x.drawImage(bdTex, px, py, TILE, TILE);
            x.globalAlpha = 1;
          }
        }
        continue;
      }
      x.drawImage(texFor(t, tx, ty), px, py, TILE, TILE);
      // subtle per-tile value variation breaks up repetition
      const vv = hash2(tx, ty, 97);
      if (vv < 0.3) { x.fillStyle = 'rgba(10,6,3,.10)'; x.fillRect(px, py, TILE, TILE); }
      else if (vv > 0.78) { x.fillStyle = 'rgba(255,230,180,.05)'; x.fillRect(px, py, TILE, TILE); }
      // soft edge light/shade where exposed
      if (!solidAt(tx, ty - 1)) {
        x.fillStyle = 'rgba(255,228,170,.16)'; x.fillRect(px, py, TILE, 3);
      }
      if (!solidAt(tx, ty + 1)) {
        x.fillStyle = 'rgba(5,3,2,.3)'; x.fillRect(px, py + TILE - 3, TILE, 3);
      }
      const vein = world.veins[idx(tx, ty)];
      if (vein >= 1 && vein <= 7) {
        const id = GEM_IDS[vein - 1];
        x.drawImage(IMG['vein_' + id], px, py, TILE, TILE);
        lights.push({ x: (tx + .5) * TILE, y: (ty + .5) * TILE, c: glowFor(id), r: 52, flicker: .25 });
      } else if (vein === VEIN_JELLY) {
        x.drawImage(IMG['glowcap_jelly'], px + 5, py + 5, TILE - 10, TILE - 10);
        lights.push({ x: (tx + .5) * TILE, y: (ty + .5) * TILE, c: 'gold', r: 48, a: 0.7, flicker: .3 });
      } else if (vein >= 8) {
        const td = TREASURE_DEF[TRE_IDS[vein - 8]];
        x.drawImage(IMG[td.sprite], px + 3, py + 3, TILE - 6, TILE - 6);
        lights.push({ x: (tx + .5) * TILE, y: (ty + .5) * TILE, c: 'gold', r: 40, a: 0.55, flicker: .2 });
      }
      const dmg = world.damage.get(idx(tx, ty));
      if (dmg) {
        const def = TILE_DEF[t];
        const stage = Math.min(2, Math.floor(dmg / def.hp * 3));
        x.drawImage(CRACKS[stage], px, py, TILE, TILE);
      }
    }
  }
  // ambient occlusion pass into air cells along solid boundaries
  if (!aoStrips) bakeAO();
  for (let ly = 0; ly < CHUNK; ly++) {
    const ty = cyi * CHUNK + ly;
    for (let lx = 0; lx < CHUNK; lx++) {
      const tx = cxi * CHUNK + lx;
      const t = tileAt(tx, ty);
      if (t !== T_AIR && t !== T_WATER) continue;
      if (ty < world.surf[tx]) continue;
      const px = lx * TILE, py = ly * TILE;
      if (solidAt(tx, ty - 1)) x.drawImage(aoStrips.top, px, py);
      if (solidAt(tx, ty + 1)) x.drawImage(aoStrips.bottom, px, py);
      if (solidAt(tx - 1, ty)) x.drawImage(aoStrips.left, px, py);
      if (solidAt(tx + 1, ty)) x.drawImage(aoStrips.right, px, py);
    }
  }
  return { canvas: c, lights };
}

export function glowFor(id) {
  return { amber: 'warm', quartz: 'pink', amethyst: 'violet', emerald: 'lime',
    sapphire: 'blue', ruby: 'red', diamond: 'cyan' }[id] || 'warm';
}

let stamp = 0;
export function drawChunks(ctx, x0, y0, x1, y1, lightSink) {
  stamp++;
  const c0x = clamp((x0 / TILE / CHUNK) | 0, 0, CW - 1), c1x = clamp((x1 / TILE / CHUNK) | 0, 0, CW - 1);
  const c0y = clamp((y0 / TILE / CHUNK) | 0, 0, CH - 1), c1y = clamp((y1 / TILE / CHUNK) | 0, 0, CH - 1);
  for (let cy = c0y; cy <= c1y; cy++)
    for (let cx = c0x; cx <= c1x; cx++) {
      const key = cy * CW + cx;
      let e = chunkCache.get(key);
      if (!e) { e = buildChunk(cx, cy); chunkCache.set(key, e); }
      e.stamp = stamp;
      ctx.drawImage(e.canvas, cx * CHUNK * TILE, cy * CHUNK * TILE);
      if (lightSink) for (const L of e.lights) lightSink.push(L);
    }
  if (chunkCache.size > 90) {            // LRU-ish eviction
    for (const [k, e] of chunkCache) {
      if (e.stamp !== stamp) chunkCache.delete(k);
      if (chunkCache.size <= 60) break;
    }
  }
}

// water overlay, animated (drawn after chunks)
export function drawWater(ctx, x0, y0, x1, y1, time, lightSink) {
  const t0x = clamp((x0 / TILE) | 0, 0, W - 1), t1x = clamp(((x1 / TILE) | 0) + 1, 0, W - 1);
  const t0y = clamp((y0 / TILE) | 0, 0, H - 1), t1y = clamp(((y1 / TILE) | 0) + 1, 0, H - 1);
  ctx.save();
  for (let ty = t0y; ty <= t1y; ty++) {
    for (let tx = t0x; tx <= t1x; tx++) {
      if (!waterAt(tx, ty)) continue;
      const px = tx * TILE, py = ty * TILE;
      const surface = !waterAt(tx, ty - 1) && !solidAt(tx, ty - 1);
      const deep = biomeAt(ty).id === 'lake';
      if (surface && lightSink && (tx & 3) === 0)
        lightSink.push({ x: px + TILE / 2, y: py + 10, c: 'cyan', r: deep ? 80 : 64,
          a: 0.5, flicker: .3, emissive: true });
      ctx.fillStyle = deep ? 'rgba(75,160,200,.42)' : 'rgba(95,200,200,.55)';
      let top = py;
      if (surface) {
        top = py + 7 + Math.sin(time * 1.7 + tx * 0.9) * 2.2;
        ctx.fillRect(px, top, TILE, TILE - (top - py));
        ctx.fillStyle = 'rgba(225,255,255,.65)';
        ctx.fillRect(px, top, TILE, 1.6);
        ctx.fillStyle = 'rgba(190,240,255,.18)';
        ctx.fillRect(px, top + 1.6, TILE, 4);
      } else {
        ctx.fillRect(px, py, TILE, TILE);
      }
      if (((tx * 31 + ty * 17) & 7) === 0) {     // sparse inner shimmer
        ctx.fillStyle = 'rgba(200,240,255,.10)';
        ctx.fillRect(px + ((tx * 13 + (time * 12 | 0)) % TILE), py + ((ty * 11) % TILE), 4, 2);
      }
    }
  }
  ctx.restore();
}

// decor + props rendering (culled). Returns lights it contributes.
export function drawDecor(ctx, x0, y0, x1, y1, time, lightSink) {
  const t0 = ((y0 / TILE) | 0) * W;
  for (const [i, d] of world.decor) {
    const ty = (i / W) | 0, tx = i % W;
    const px = tx * TILE;
    if (px < x0 - 64 || px > x1 + 64) continue;
    const py = ty * TILE;
    if (py < y0 - 96 || py > y1 + 96) continue;
    if (!isSolid(world.grid[d.anchor])) continue;     // support dug away
    const img = IMG[d.sprite];
    const w = img.width / 4, h = img.height / 4;      // assets baked at 4x
    const sway = d.sway ? Math.sin(time * 1.4 + tx * 1.7) * 2.4 : 0;
    if (d.flip) { ctx.save(); ctx.translate(d.x, 0); ctx.scale(-1, 1); ctx.translate(-d.x, 0); }
    if (d.ceil) ctx.drawImage(img, d.x - w / 2 + sway, d.y, w, h);
    else ctx.drawImage(img, d.x - w / 2 + sway * .4, d.y - h, w, h);
    if (d.flip) ctx.restore();
    if (d.light && lightSink)
      lightSink.push({ x: d.x, y: d.ceil ? d.y + h * .6 : d.y - h * .55, c: d.light[0], r: d.light[1], flicker: .15, pri: 2 });
  }
  for (const p of world.props) {
    if (p.x < x0 - 200 || p.x > x1 + 200 || p.y < y0 - 200 || p.y > y1 + 200) continue;
    const img = IMG[p.type];
    const sc = p.sc || 1;
    const w = img.width / 4 * sc, h = img.height / 4 * sc;
    ctx.save();
    if (p.flip) { ctx.translate(p.x, 0); ctx.scale(-1, 1); ctx.translate(-p.x, 0); }
    ctx.drawImage(img, p.x - w / 2, p.y - h, w, h);
    ctx.restore();
    if (p.type === 'campfire' && lightSink)
      lightSink.push({ x: p.x, y: p.y - h * .5, c: 'fire', r: 200, flicker: .5, pri: 1 });
    if (p.type === 'tent' && lightSink)
      lightSink.push({ x: p.x, y: p.y - h * .4, c: 'warm', r: 90, flicker: .1, pri: 1 });
    if (p.glow && lightSink)
      lightSink.push({ x: p.x, y: p.y - h * .5, c: p.glow[0], r: p.glow[1], flicker: .2, emissive: true, pri: 1 });
  }
}
