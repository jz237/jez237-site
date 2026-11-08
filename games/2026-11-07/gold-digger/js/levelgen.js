// Level generator. A level is a grid of 16x12 rooms (plus a 2-cell rock border). A random path wanders from a
// start room in the top row down to an exit room in the bottom row; path rooms get their doors from the path,
// side rooms hang off it as branches, and a few sealed rooms become secret vaults (rubble, a boulder that needs
// dynamite, or a locked gate whose key is somewhere else in the level). Rooms are stamped from hand-made templates
// (mirrored at random), then hazards, creatures and loot are scattered by the RAMP numbers for this level.
// Everything is deterministic from (seed, depth, level). Boss lairs are separate hand-shaped arenas.
// Tile rows here are world rows: y = 0 is the bottom of the map. Templates are written top-down.
import { T, RAMP, LEVELS, RELICS, FOSSILS, WONDERS, NOTES, GEMS, LOOT, STRATA } from './config.js?v=17';

export const RW = 16, RH = 12, BORDER = 2;

// ---------------------------------------------------------------- deterministic random
export function hash(...a) {
  let h = 2166136261 >>> 0;
  for (const v of a) { h ^= (v * 2654435761) >>> 0; h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; h ^= h >>> 13; }
  return h >>> 0;
}
export function rng(seed) {
  let s = seed >>> 0 || 1;
  const f = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  f.int = (n) => Math.floor(f() * n);
  f.pick = (a) => a[Math.floor(f() * a.length)];
  f.chance = (p) => f() < p;
  return f;
}

// ---------------------------------------------------------------- room templates
// # rock  . air  H ladder  | rope  = plank  ~ water  ^ spikes  S soft rubble  X boulder (dynamite)
// T row 0 ladder if the room opens upward (else rock)        h ladder if the room opens upward (else air)
// D floor shaft: ladder if the room opens downward (else rock)
// < > door band: air if the room opens that side (else rock)
// r rock 50%   a air 70% / rock 30%   s soft rubble 40%   p plank 50%   c crumble or plank   P pit filler (spikes/water/lava)
// $ gold   ? random loot   ! anchor (camp, relic, key, note, wonder)   F fossil seam (rock unless chosen)
// Door bands are rows 5-8 at the side walls (the floor is row 9). Every template joins all four doors.
const GEN = {
  hall: [
    '#######T########',
    '#rr....H....rrr#',
    '#r..?..H...?..r#',
    '#..====H====...#',
    '#......H.......#',
    '<......H.......>',
    '<......H.......>',
    '<......H.......>',
    '<..$...H....$..>',
    '#######D########',
    '#######D########',
    '#######D########'],
  mounds: [
    '#######T########',
    '#rr....H.....rr#',
    '#r.....H......r#',
    '#......H.......#',
    '#..?...H....?..#',
    '<......H.......>',
    '<......H.......>',
    '<.###..H...##..>',
    '<#####.H.#####.>',
    '#######D########',
    '#######D########',
    '#######D########'],
  pool: [
    '#######T########',
    '#rr....h.....rr#',
    '#r.....h......r#',
    '#......h.......#',
    '#...?..h..?....#',
    '<......h.......>',
    '<......h.......>',
    '<......h.......>',
    '<.$....h.......>',
    '###~~~~D~~~~####',
    '###~~~~D~~~~####',
    '#######D########'],
  ledges: [
    '#######T########',
    '#rr....H....rrr#',
    '#r.....H.......#',
    '#.?.$..H..$..?.#',
    '####cc=H=cc#####',
    '<......H.......>',
    '<......H.......>',
    '<......H.......>',
    '<..s...H....s..>',
    '#######D########',
    '#######D########',
    '#######D########'],
  chasm: [
    '#######T########',
    '#rr....h....rrr#',
    '#r..?..h..?...r#',
    '#......h.......#',
    '#......h.......#',
    '<......h.......>',
    '<......h.......>',
    '<......h.......>',
    '<..$...h.....$.>',
    '#####PPDPP######',
    '#####PPDPP######',
    '#######D########'],
  column: [
    '#######T########',
    '#r.....H......r#',
    '#......H.......#',
    '#..?...H...?...#',
    '#......H.......#',
    '<......H.......>',
    '<.....#H#......>',
    '<....##H##.....>',
    '<.s.###H###.s..>',
    '#######D########',
    '#######D########',
    '#######D########'],
  cavern: [
    '#######T########',
    '#rr....h.....rr#',
    '#r.....h.......#',
    '#.....?h.......#',
    '#......h....?..#',
    '<......h.......>',
    '<......h.......>',
    '<.#....h....#..>',
    '<.##.s.h.s.###.>',
    '#######D########',
    '#######D########',
    '#######D########'],
  rope: [
    '#######T########',
    '#rr....|....rrr#',
    '#r.$...|...$..r#',
    '#...pppH.......#',
    '#......|..?....#',
    '<......|.......>',
    '<......|.......>',
    '<......|.......>',
    '<..?...|....s..>',
    '#######D########',
    '#######D########',
    '#######D########'],
  shelf: [
    '#######T########',
    '#r.....H.....rr#',
    '#..?...H.......#',
    '#####..H..==...#',
    '#......H.......#',
    '<......H.....$.>',
    '<......H...#####',
    '<......H.......>',
    '<..$...H.......>',
    '#######D########',
    '#######D########',
    '#######D########'],
  dip: [
    '#######T########',
    '#rr....h....rrr#',
    '#r.....h......r#',
    '#......h.......#',
    '#..?...h...?...#',
    '<......h.......>',
    '<......h.......>',
    '<......h.......>',
    '<......h.......>',
    '###....D....####',
    '####.$.D.$.#####',
    '#######D########'],
};
// the shelf template's right door band must stay clear on rows 5-8: its row 6 is a ledge under the door band
GEN.shelf[6] = '<......H...####>';
const START_T = [
  '#######..#######',
  '#rr...#..#...rr#',
  '#r....#..#....r#',
  '#.....#..#.....#',
  '#.....#..#.....#',
  '<..............>',
  '<..............>',
  '<..............>',
  '<..$........$..>',
  '#######D########',
  '#######D########',
  '#######D########'];
const EXIT_T = [
  '#######T########',
  '#rr....h....rrr#',
  '#r.....h......r#',
  '#......h.......#',
  '#..?...h...?...#',
  '<......h.......>',
  '<......h.......>',
  '<......h.......>',
  '<..$...h.......>',
  '#######..#######',
  '#######..#######',
  '#######..#######'];
const CAMP_T = [
  '#######T########',
  '#rr....H....rrr#',
  '#r.....H......r#',
  '#..====H.......#',
  '#......H.......#',
  '<......H.......>',
  '<......H.......>',
  '<......H.......>',
  '<..!...H.......>',
  '#######D########',
  '#######D########',
  '#######D########'];
const VAULT_T = [
  ['################',
   '################',
   '###rrrrrrrrrr###',
   '##F..........F##',
   '##............##',
   '<..............>',
   '<..............>',
   '<..............>',
   '<..?...!!...?..>',
   '##########F#####',
   '################',
   '################'],
  ['################',
   '######rrrr######',
   '####r......r####',
   '###F...?....F###',
   '##.....==.....##',
   '<..............>',
   '<..............>',
   '<..............>',
   '<.$...!!....$..>',
   '################',
   '################',
   '################']];
const WONDER_T = [
  '######hTh#######',
  '#.....hHh......#',
  '#......H.......#',
  '#......H.......#',
  '#......H.......#',
  '<......H.......>',
  '<......H.......>',
  '<......H.......>',
  '<....!.H.......>',
  '#######D########',
  '#######D########',
  '#######D########'];
WONDER_T[0] = '#######T########'; WONDER_T[1] = '#......H.......#';
export const TEMPLATES = { GEN, START_T, EXIT_T, CAMP_T, VAULT_T, WONDER_T };

// ---------------------------------------------------------------- the level map
export function makeMap(w, h) {
  return { w, h, tiles: new Uint8Array(w * h).fill(T.ROCK), hp: new Uint8Array(w * h), rooms: [], spawns: { bats: [], crawlers: [], stalac: [], geysers: [], eels: [], loot: [], keys: [], kegs: [] },
    finds: [], camps: [], start: null, exit: null, keyDoors: [], decor: [] };
}
export const idx = (M, x, y) => y * M.w + x;
const setT = (M, x, y, t) => { if (x >= 0 && y >= 0 && x < M.w && y < M.h) M.tiles[y * M.w + x] = t; };
const getT = (M, x, y) => (x >= 0 && y >= 0 && x < M.w && y < M.h) ? M.tiles[y * M.w + x] : T.ROCK;

// relic / fossil / wonder / note identities for a level (campaign: fixed per depth; endless: generated)
export function findsFor(depth, level, endless, n) {
  if (!endless) {
    return {
      relic: depth * 3 + level,
      fossil: level === 1 ? -1 : depth * 2 + (level === 0 ? 0 : 1),
      wonder: level === 2 ? -1 : depth * 2 + level,
      note: level === 1 ? -1 : depth * 2 + (level === 0 ? 0 : 1),
    };
  }
  return { relic: 100 + n, fossil: n % 2 ? 100 + n : -1, wonder: 100 + n, note: -1 };
}
const RELIC_A = ['TARNISHED', 'GILDED', 'WHISPERING', 'CRACKED', 'HUMMING', 'FROSTED', 'SMOULDERING', 'MOSSY', 'SHINING', 'NAMELESS', 'BLACKENED', 'SINGING'];
const RELIC_B = ['IDOL', 'COMPASS', 'LANTERN', 'MASK', 'CHALICE', 'SPINDLE', 'MEDALLION', 'HORN', 'FIGURINE', 'KEYSTONE', 'ASTROLABE', 'CROWN'];
const RELIC_C = ['DEEP', 'FIRST MINERS', 'LOST KINGS', 'BLIND ONES', 'SLEEPING STONE', 'UNDERSUN', 'LONG DARK', 'GLASS PEOPLE'];
export function endlessRelicName(n) {
  const r = rng(hash(n, 77));
  return [`THE ${r.pick(RELIC_A)} ${r.pick(RELIC_B)} OF THE ${r.pick(RELIC_C)}`, `Found ${n + 1} levels into the Endless Deep.`];
}
export function endlessWonderName(n) {
  const r = rng(hash(n, 91));
  const a = ['DROWNED', 'SHINING', 'HOLLOW', 'SINGING', 'BURNING', 'SILENT', 'GREAT', 'BROKEN', 'GOLDEN', 'BLUE'];
  const b = ['CATHEDRAL', 'STAIR', 'GARDEN', 'RIVER', 'ORGAN', 'GATE', 'FOREST', 'THRONE', 'EYE', 'VAULT'];
  return [`THE ${r.pick(a)} ${r.pick(b)}`, 'A place no map has ever shown.'];
}
export const findName = (kind, id) => {
  if (kind === 'relic') return id >= 100 ? endlessRelicName(id - 100) : RELICS[id];
  if (kind === 'fossil') return FOSSILS[id % FOSSILS.length];
  if (kind === 'wonder') return id >= 100 ? endlessWonderName(id - 100) : WONDERS[id];
  if (kind === 'map') return ['A TREASURE MAP', 'Torn from the old prospector\'s notebook. An X marks a spot not far from here.'];
  if (kind === 'cache') return ['A BURIED CACHE', 'Somebody hid this here a long time ago, and never came back for it.'];
  return ['A NOTE', NOTES[id] || ''];
};

// ---------------------------------------------------------------- generate a level
// opts: { seed, depth, level, ramp, endless, n (endless index), biome (0-4) }
export function generate(opts) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const M = tryGenerate({ ...opts, attempt });
    if (M && opts.validate) { if (opts.validate(M)) return M; } else if (M) return M;
  }
  throw new Error('level generation failed');
}

function tryGenerate(o) {
  const R = rng(hash(o.seed, o.depth, o.level, o.attempt || 0, o.endless ? 7 : 3));
  const ramp = o.ramp;
  const rW = ramp.roomsW, rH = ramp.roomsH;
  const W = rW * RW + BORDER * 2, H = rH * RH + BORDER * 2;
  const M = makeMap(W, H);
  M.depth = o.depth; M.level = o.level; M.biome = o.biome; M.seed = o.seed; M.endless = !!o.endless; M.rW = rW; M.rH = rH;
  const tutorial = !o.endless && o.depth === 0 && o.level === 0;
  M.tutorial = tutorial;

  // --- path
  const grid = [];
  for (let ry = 0; ry < rH; ry++) { grid.push([]); for (let rx = 0; rx < rW; rx++) grid[ry].push({ rx, ry, kind: null, path: -1, open: { L: 0, R: 0, T: 0, B: 0 }, seal: null }); }
  let cx = tutorial ? 0 : R.int(rW), cy = 0;
  const path = [grid[0][cx]];
  grid[0][cx].path = 0;
  let dir = tutorial ? 1 : (R.chance(0.5) ? 1 : -1);
  let guard = 0;
  while (guard++ < 200) {
    const goDown = (R.chance(tutorial ? 0.0 : 0.3) || cx + dir < 0 || cx + dir >= rW || grid[cy][cx + dir].path >= 0);
    if (goDown) {
      if (cy === rH - 1) break;
      grid[cy][cx].open.B = 1;
      cy++;
      grid[cy][cx].open.T = 1;
      dir = R.chance(0.5) ? 1 : -1;
      if (cx === 0) dir = 1; if (cx === rW - 1) dir = -1;
    } else {
      grid[cy][cx].open[dir > 0 ? 'R' : 'L'] = 1;
      cx += dir;
      grid[cy][cx].open[dir > 0 ? 'L' : 'R'] = 1;
    }
    if (grid[cy][cx].path < 0) { grid[cy][cx].path = path.length; path.push(grid[cy][cx]); }
  }
  // the path must end in the bottom row (the guard loop always gets there)
  if (path[path.length - 1].ry !== rH - 1) return null;
  if (path.length < 3) return null;
  path[0].kind = 'start';
  path[path.length - 1].kind = 'exit';
  // camps: D1/D2 two per level, later one (never in the start/exit rooms)
  const nCamps = o.endless ? (o.n < 6 ? 2 : 1) : (o.depth < 2 ? 2 : 1);
  const campAt = [];
  for (let i = 1; i <= nCamps; i++) { const k = Math.round(path.length * i / (nCamps + 1)); if (k > 0 && k < path.length - 1 && !campAt.includes(k)) campAt.push(k); }
  for (const k of campAt) path[k].kind = 'camp';

  // --- branches: off-path rooms joined to a connected neighbour
  const connected = (c) => c.path >= 0 || c.kind === 'side';
  const nb = (c) => [[c.rx - 1, c.ry, 'L', 'R'], [c.rx + 1, c.ry, 'R', 'L'], [c.rx, c.ry - 1, 'T', 'B'], [c.rx, c.ry + 1, 'B', 'T']]
    .filter(([x, y]) => x >= 0 && y >= 0 && x < rW && y < rH).map(([x, y, a, b]) => ({ c: grid[y][x], a, b }));
  const off = [];
  for (const row of grid) for (const c of row) if (c.path < 0) off.push(c);
  // shuffle
  for (let i = off.length - 1; i > 0; i--) { const j = R.int(i + 1); [off[i], off[j]] = [off[j], off[i]]; }
  // vaults: rooms with exactly one horizontal neighbour that is connected; sealed
  const nVaults = Math.min(off.length, tutorial ? 1 : 1 + (R.chance(0.6) ? 1 : 0));
  const vaults = [];
  for (const c of off) {
    if (vaults.length >= nVaults) break;
    const hn = nb(c).filter((n) => (n.a === 'L' || n.a === 'R') && connected(n.c) && n.c.kind !== 'exit' && n.c.kind !== 'start');
    if (!hn.length) continue;
    const n = hn[R.int(hn.length)];
    c.kind = 'vault'; c.open[n.a] = 1; n.c.open[n.b] = 1; c.sealSide = n.a; c.sealFrom = n.c;
    vaults.push(c);
  }
  // remaining off rooms: join as side rooms (grow from connected rooms) or leave solid
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of off) {
      if (c.kind) continue;
      const cn = nb(c).filter((n) => connected(n.c) && n.c.kind !== 'vault' && !(n.a === 'T' && n.c.kind === 'exit') && !(n.a === 'B' && n.c.kind === 'start'));
      if (!cn.length) continue;
      if (R.chance(0.82)) {
        const n = cn[R.int(cn.length)];
        c.kind = 'side'; c.open[n.a] = 1; n.c.open[n.b] = 1; changed = true;
        // occasionally a second door makes a loop
        const more = cn.filter((m) => m !== n);
        if (more.length && R.chance(0.3)) { const m = more[R.int(more.length)]; c.open[m.a] = 1; m.c.open[m.b] = 1; }
      } else { c.kind = 'solid'; }
    }
  }
  for (const c of off) if (!c.kind) c.kind = 'solid';
  // exit rooms never open downward; the start room never opens upward
  // a wonder: a side room (or a path room) gets the wonder template
  const F = findsFor(o.depth, o.level, o.endless, o.n || 0);
  const sides = off.filter((c) => c.kind === 'side');
  let wonderRoom = null;
  if (F.wonder >= 0) {
    wonderRoom = sides.length ? sides[R.int(sides.length)] : path.filter((c) => !c.kind)[0] || null;
    if (wonderRoom) wonderRoom.wonder = true;
  }

  // --- stamp
  for (const row of grid) for (const c of row) {
    const x0 = BORDER + c.rx * RW, y0 = BORDER + (rH - 1 - c.ry) * RH;
    c.x0 = x0; c.y0 = y0;
    let tpl;
    if (c.kind === 'solid') { M.rooms.push(c); continue; }
    if (c.kind === 'start') tpl = START_T;
    else if (c.kind === 'exit') tpl = EXIT_T;
    else if (c.kind === 'camp') tpl = CAMP_T;
    else if (c.kind === 'vault') tpl = VAULT_T[R.int(VAULT_T.length)];
    else if (c.wonder) tpl = WONDER_T;
    else {
      const keys = Object.keys(GEN);
      let k = R.pick(keys);
      if (tutorial && c.path >= 0 && c.path <= 2) k = ['hall', 'mounds', 'hall'][c.path];
      if (M.biome === 3 && R.chance(0.35)) k = 'pool';
      tpl = GEN[k]; c.tpl = k;
    }
    // rooms joined by a ladder share a mirror state so the shaft (column 7, or 8 when mirrored) lines up
    const above = c.ry > 0 ? grid[c.ry - 1][c.rx] : null;
    const flip = c.open.T && above ? !!above.flip : R.chance(0.5);
    c.flip = flip;
    const pitFill = pickPit(R, M.biome, ramp, tutorial);
    for (let r = 0; r < RH; r++) {
      for (let col = 0; col < RW; col++) {
        const src = flip ? tpl[r][RW - 1 - col] : tpl[r][col];
        let ch = src;
        if (flip) { if (ch === '<') ch = '>'; else if (ch === '>') ch = '<'; }
        const x = x0 + col, y = y0 + (RH - 1 - r);
        let t = T.ROCK;
        switch (ch) {
          case '#': t = T.ROCK; break;
          case '.': t = T.AIR; break;
          case 'H': t = T.LADDER; break;
          case '|': t = T.ROPE; break;
          case '=': t = T.PLANK; break;
          case '~': t = T.WATER; break;
          case '^': t = T.SPIKES; break;
          case 'S': t = T.SOFT; break;
          case 'X': t = T.HARD; break;
          case 'T': t = c.open.T ? T.LADDER : T.ROCK; break;
          case 'h': t = c.open.T ? T.LADDER : T.AIR; break;
          case 'D': t = c.open.B ? T.LADDER : T.ROCK; break;
          case '<': t = c.open.L ? T.AIR : T.ROCK; break;
          case '>': t = c.open.R ? T.AIR : T.ROCK; break;
          case 'r': t = R.chance(0.5) ? T.ROCK : T.AIR; break;
          case 'a': t = R.chance(0.7) ? T.AIR : T.ROCK; break;
          case 's': t = R.chance(tutorial ? 0 : 0.4) ? T.SOFT : T.AIR; break;
          case 'p': t = R.chance(0.5) ? T.PLANK : T.AIR; break;
          case 'c': t = R.chance(ramp.crumble) ? T.CRUMBLE : T.PLANK; break;
          case 'P': t = r === 10 || (r === 9 && pitFill === T.WATER) ? pitFill : (pitFill === T.WATER ? T.WATER : T.AIR); break;
          case 'F': t = T.ROCK; c.fossilSpots = c.fossilSpots || []; c.fossilSpots.push([x, y]); break;
          case '$': t = T.AIR; M.spawns.loot.push({ k: 'gold', x: x + 0.5, y, room: c }); break;
          case '?': t = T.AIR; c.lootSpots = c.lootSpots || []; c.lootSpots.push([x, y]); break;
          case '!': t = T.AIR; c.anchors = c.anchors || []; c.anchors.push([x, y]); break;
          default: t = T.AIR;
        }
        // a pit fill of spikes sits only on the pit floor; water fills both pit rows
        if (ch === 'P' && pitFill === T.SPIKES && r === 9) t = T.AIR;
        if (ch === 'P' && pitFill === T.LAVA && r === 9) t = T.AIR;
        setT(M, x, y, t);
      }
    }
    M.rooms.push(c);
  }
  // the start shaft opens to the sky above the map; the exit shaft drops out of the bottom
  const s0 = path[0], e0 = path[path.length - 1];
  for (let y = s0.y0 + RH; y < H; y++) for (const dx of [7, 8]) setT(M, s0.x0 + dx, y, T.AIR);
  for (let y = 0; y < e0.y0 + 3; y++) for (const dx of [7, 8]) setT(M, e0.x0 + dx, y, T.AIR);
  M.start = { x: s0.x0 + 8, y: s0.y0 + 3, shaftX: s0.x0 + 8 };
  M.exit = { x: e0.x0 + 8, y: e0.y0 + 3, x0: e0.x0 + 7, x1: e0.x0 + 9 };
  M.path = path.map((c) => ({ rx: c.rx, ry: c.ry, x: c.x0 + 8, y: c.y0 + 3 }));

  // --- seal the vaults
  vaults.forEach((v, i) => {
    const kind = tutorial ? 'hard' : (i === 0 ? R.pick(['soft', 'hard', 'hard', 'door']) : R.pick(['soft', 'hard', 'door']));
    v.seal = kind;
    // the door band column on the vault's side of the wall and the neighbour's side
    const n = v.sealFrom;
    const xs = v.sealSide === 'L' ? [v.x0, n.x0 + RW - 1] : [v.x0 + RW - 1, n.x0];
    const tile = kind === 'soft' ? T.SOFT : kind === 'hard' ? T.HARD : T.DOOR;
    (M.seals ||= []).push({ x: xs[1] + 0.5, y: v.y0 + 4.5 });
    for (const x of xs) for (let r = 5; r <= 8; r++) { const y = v.y0 + (RH - 1 - r); setT(M, x, y, (kind === 'door' && x !== xs[1]) ? T.AIR : tile); }
    if (kind === 'door') M.keyDoors.push({ x: xs[1], y0: v.y0 + 3, y1: v.y0 + 6, id: i });
    // the boulder needs dynamite: leave a powder keg (refills to 2 dynamite) by the wall
    if (kind === 'hard') {
      const kx = v.sealSide === 'L' ? n.x0 + RW - 4 : n.x0 + 3;
      M.spawns.kegs.push({ x: kx + 0.5, y: n.y0 + 3 });
    }
  });

  // --- finds: relic in a vault, fossil in a wall, note somewhere off the path, wonder anchor
  const rel = vaults[0] || sides[0];
  if (rel && F.relic >= 0) {
    const a = (rel.anchors && rel.anchors[0]) || [rel.x0 + 7, rel.y0 + 3];
    M.finds.push({ kind: 'relic', id: F.relic, x: a[0] + 1, y: a[1] });
  }
  // a second vault holds a chest
  for (const v of vaults.slice(1)) { const a = (v.anchors && v.anchors[0]) || [v.x0 + 7, v.y0 + 3]; M.spawns.loot.push({ k: 'chest', x: a[0] + 1, y: a[1] }); }
  if (F.fossil >= 0) {
    // a rock cell beside reachable air in a side room or vault
    const cands = [];
    for (const c of [...vaults, ...sides]) for (const s of c.fossilSpots || []) cands.push(s);
    if (!cands.length) for (const c of [...sides, ...path]) {
      if (c.kind === 'start' || c.kind === 'exit') continue;
      for (let y = c.y0 + 3; y < c.y0 + 8; y++) for (const x of [c.x0 + 1, c.x0 + RW - 2]) if (getT(M, x, y) === T.ROCK && (getT(M, x - 1, y) === T.AIR || getT(M, x + 1, y) === T.AIR)) cands.push([x, y]);
    }
    if (cands.length) { const [fx, fy] = cands[R.int(cands.length)]; setT(M, fx, fy, T.FOSSIL); M.finds.push({ kind: 'fossil', id: F.fossil, x: fx + 0.5, y: fy }); }
  }
  if (F.note >= 0) {
    const pool = sides.length ? sides : path.slice(1, -1);
    const c = pool[R.int(pool.length)];
    const sp = (c.lootSpots && c.lootSpots.length) ? c.lootSpots.splice(R.int(c.lootSpots.length), 1)[0] : [c.x0 + 4, c.y0 + 3];
    M.finds.push({ kind: 'note', id: F.note, x: sp[0] + 0.5, y: sp[1] });
  }
  if (wonderRoom) {
    const a = (wonderRoom.anchors && wonderRoom.anchors[0]) || [wonderRoom.x0 + 5, wonderRoom.y0 + 3];
    M.finds.push({ kind: 'wonder', id: F.wonder, x: a[0] + 0.5, y: a[1], room: [wonderRoom.x0, wonderRoom.y0] });
  }
  // a treasure map: the scrap lies in one room, the cache is buried under the floor of another (a soft dig spot
  // with rock beneath, so digging it leaves a one-deep hole). Not in the first level, never in a guardian's lair.
  if (!(o.depth === 0 && o.level === 0 && !o.endless)) {
    const pool = [...sides.filter((c) => !c.wonder), ...path.slice(1, -1).filter((c) => c.kind !== 'camp')];
    const spot = [];
    for (const c of pool) for (let y = c.y0 + 3; y < c.y0 + RH - 1; y++) for (let x = c.x0 + 2; x < c.x0 + RW - 2; x++) {
      if (x === c.x0 + 7 || x === c.x0 + 8) continue;
      if (getT(M, x, y) !== T.AIR || getT(M, x, y + 1) !== T.AIR || getT(M, x, y + 2) !== T.AIR) continue;
      if (getT(M, x, y - 1) !== T.ROCK || getT(M, x, y - 2) !== T.ROCK) continue;
      if (![-1, 1].every((d) => getT(M, x + d, y) === T.AIR && getT(M, x + d, y - 1) === T.ROCK)) continue;
      spot.push([x, y, c]);
    }
    if (spot.length >= 2) {
      const [cx, cy, cr] = spot[R.int(spot.length)];
      const others = spot.filter((s) => s[2] !== cr && Math.abs(s[0] - cx) + Math.abs(s[1] - cy) > 12);
      const [mx, my] = others.length ? others[R.int(others.length)] : spot.find((s) => s[0] !== cx || s[1] !== cy);
      const id = o.endless ? 100 + (o.n || 0) : o.depth * 3 + o.level;
      setT(M, cx, cy - 1, T.SOFT);
      M.finds.push({ kind: 'cache', id, x: cx + 0.5, y: cy - 1 });
      M.finds.push({ kind: 'map', id, x: mx + 0.5, y: my });
    }
  }
  // the key for a locked vault lies in a side room or near the far end of the path
  M.keyDoors.forEach((d) => {
    const pool = sides.filter((c) => !c.wonder).length ? sides.filter((c) => !c.wonder) : path.slice(1, -1);
    const c = pool[R.int(pool.length)];
    const sp = (c.lootSpots && c.lootSpots.length) ? c.lootSpots.splice(R.int(c.lootSpots.length), 1)[0] : [c.x0 + 11, c.y0 + 3];
    M.spawns.keys.push({ x: sp[0] + 0.5, y: sp[1], id: d.id });
  });
  // camps
  for (const c of path) if (c.kind === 'camp') { const a = (c.anchors && c.anchors[0]) || [c.x0 + 3, c.y0 + 3]; M.camps.push({ x: a[0] + 0.5, y: a[1] }); }

  // --- loot spots
  for (const c of M.rooms) {
    for (const [x, y] of c.lootSpots || []) {
      if (!R.chance(0.75)) continue;
      const roll = R();
      const k = roll < 0.46 ? 'gold' : roll < 0.62 ? 'gem' : roll < 0.76 ? 'oil' : roll < 0.85 ? 'flare' : roll < 0.94 ? 'dyn' : 'heart';
      M.spawns.loot.push({ k, x: x + 0.5, y, room: c });
    }
  }
  // oil cans along the path (the lamp must never run dry by bad luck)
  let acc = 0;
  for (const c of path) {
    acc += ramp.oilCans * (c.kind === 'start' ? 0 : 1);
    while (acc >= 1) {
      acc -= 1;
      const sp = findFloor(M, R, c, 2);
      if (sp) M.spawns.loot.push({ k: 'oil', x: sp[0] + 0.5, y: sp[1], room: c });
    }
  }
  // and a few in the side rooms, so exploring never starves the lamp
  for (const c of sides) if (R.chance(0.5)) { const sp = findFloor(M, R, c, 1); if (sp) M.spawns.loot.push({ k: 'oil', x: sp[0] + 0.5, y: sp[1], room: c }); }
  // gold veins and gem seams in the walls next to open air (never in the room's outer walls)
  for (const c of M.rooms) {
    if (c.kind === 'solid') continue;
    const nV = 1 + R.int(2) + (c.kind === 'vault' ? 2 : 0), nG = R.chance(0.25 + (c.kind === 'vault' ? 0.5 : 0)) ? 1 : 0;
    for (let k = 0; k < nV + nG; k++) {
      for (let tries = 0; tries < 30; tries++) {
        const x = c.x0 + 1 + R.int(RW - 2), y = c.y0 + 1 + R.int(RH - 2);
        if (getT(M, x, y) !== T.ROCK) continue;
        if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => getT(M, x + dx, y + dy) === T.AIR)) continue;
        if (x === c.x0 + 7 || x === c.x0 + 8) continue;
        setT(M, x, y, k < nV ? T.VEIN : T.GEMV);
        if (k >= nV) M.spawns.loot.push({ k: 'gemseam', x: x + 0.5, y, gem: R.int(GEMS.length), hidden: true });
        break;
      }
    }
  }

  // --- hazards and creatures (never in the start room, never near a camp or the exit cage)
  const safe = (x, y) => {
    if (Math.abs(x - M.start.x) < 9 && Math.abs(y - M.start.y) < 7) return false;
    for (const cp of M.camps) if (Math.abs(x - cp.x) < 5 && Math.abs(y - cp.y) < 4) return false;
    if (Math.abs(x - M.exit.x) < 4 && Math.abs(y - M.exit.y) < 4) return false;
    return true;
  };
  const tutorialQuiet = (c) => tutorial && c.path >= 0 && c.path <= 1;
  for (const c of M.rooms) {
    if (c.kind === 'solid' || c.kind === 'start' || c.kind === 'vault') continue;
    if (tutorialQuiet(c)) continue;
    const roll = (v) => Math.floor(v) + (R() < v - Math.floor(v) ? 1 : 0);
    // bats on the ceiling
    for (let n = roll(ramp.bats); n > 0; n--) { const sp = findCeil(M, R, c, 4); if (sp && safe(sp[0], sp[1])) M.spawns.bats.push({ x: sp[0] + 0.5, y: sp[1] + 0.6 }); }
    for (let n = roll(ramp.crawlers); n > 0; n--) { const sp = findFloor(M, R, c, 4); if (sp && safe(sp[0], sp[1])) M.spawns.crawlers.push({ x: sp[0] + 0.5, y: sp[1] }); }
    for (let n = roll(ramp.stalac); n > 0; n--) { const sp = findCeil(M, R, c, 3, true); if (sp && safe(sp[0], sp[1] - 3)) M.spawns.stalac.push({ x: sp[0] + 0.5, y: sp[1] + 1 }); }
    for (let n = roll(ramp.geysers); n > 0; n--) {
      const sp = findFloor(M, R, c, 3, true);
      if (sp && safe(sp[0], sp[1])) M.spawns.geysers.push({ x: sp[0] + 0.5, y: sp[1], phase: R() });
    }
    for (let n = roll(ramp.spikes); n > 0; n--) {
      const sp = findFloor(M, R, c, 5, true);
      if (sp && safe(sp[0], sp[1]) && getT(M, sp[0], sp[1]) === T.AIR && [1, 2, 3].every((k) => getT(M, sp[0], sp[1] + k) === T.AIR && getT(M, sp[0] - 1, sp[1] + k) === T.AIR && getT(M, sp[0] + 1, sp[1] + k) === T.AIR)) setT(M, sp[0], sp[1], T.SPIKES);
    }
    // eels in the deeper pools
    if (ramp.eels > 0) {
      for (let y = c.y0; y < c.y0 + RH; y++) for (let x = c.x0; x < c.x0 + RW; x++) {
        if (getT(M, x, y) === T.WATER && getT(M, x, y + 1) !== T.WATER && getT(M, x, y - 1) === T.WATER && R() < ramp.eels / 6 && safe(x, y)) M.spawns.eels.push({ x: x + 0.5, y: y - 0.5 });
      }
    }
  }
  // D1L1: a rubble plug and a boulder on the path teach the pick and the dynamite, with a keg before the boulder
  if (tutorial) {
    const r1 = path[1], r2 = path[2];
    if (r1 && r1.kind !== 'camp' && r1.kind !== 'exit') for (let y = r1.y0 + 3; y < r1.y0 + 5; y++) setT(M, r1.x0 + 12, y, T.SOFT);
    if (r2 && r2.kind !== 'exit') {
      for (let y = r2.y0 + 3; y < r2.y0 + 7; y++) setT(M, r2.x0 + 12, y, T.HARD);
      M.spawns.kegs.push({ x: r2.x0 + 5.5, y: r2.y0 + 3 });
    }
  }
  // loot, keys and finds rest on whatever is below them (a floor, a plank, a ladder top or the water)
  const settle = (o) => {
    let x = Math.floor(o.x), y = Math.floor(o.y);
    while (y > 1 && [T.AIR, T.SPIKES].includes(getT(M, x, y - 1)) ) y--;
    o.y = y;
  };
  for (const l of M.spawns.loot) if (!l.hidden) settle(l);
  for (const k of M.spawns.keys) settle(k);
  for (const f of M.finds) if (f.kind !== 'fossil' && f.kind !== 'cache') settle(f);
  // the explored map for the explore score
  M.seen = new Uint8Array(W * H);
  M.totalGold = M.spawns.loot.filter((l) => l.k === 'gold').length;
  return M;
}

function pickPit(R, biome, ramp, tutorial) {
  if (tutorial) return T.WATER;
  if (biome === 4 && R() < ramp.lava * 2) return T.LAVA;
  if (biome === 3 || biome === 1) return R() < 0.6 ? T.WATER : T.SPIKES;
  return R() < 0.5 ? T.SPIKES : T.WATER;
}
// a random floor cell in room c (air, solid below, air above), with `run` free cells left and right
function findFloor(M, R, c, run = 2, flatOnly = false) {
  for (let tries = 0; tries < 40; tries++) {
    const x = c.x0 + 2 + R.int(RW - 4), y = c.y0 + 1 + R.int(RH - 3);
    if (getT(M, x, y) !== T.AIR || getT(M, x, y + 1) !== T.AIR) continue;
    const below = getT(M, x, y - 1);
    if (below !== T.ROCK && !(below === T.PLANK && !flatOnly)) continue;
    if (x === c.x0 + 7 || x === c.x0 + 8) continue;
    let ok = true;
    for (let d = -run; d <= run && ok; d++) { if (getT(M, x + d, y) !== T.AIR || getT(M, x + d, y - 1) !== T.ROCK) ok = d !== 0 && Math.abs(d) > run / 2 ? ok : false; }
    if (!ok) continue;
    return [x, y];
  }
  return null;
}
// a ceiling cell (air with rock above) with `gap` free cells below; walk = there is a floor under it
function findCeil(M, R, c, gap = 3, walk = false) {
  for (let tries = 0; tries < 40; tries++) {
    const x = c.x0 + 1 + R.int(RW - 2), y = c.y0 + 2 + R.int(RH - 3);
    if (getT(M, x, y) !== T.AIR || getT(M, x, y + 1) !== T.ROCK) continue;
    if (x === c.x0 + 7 || x === c.x0 + 8) continue;
    let ok = true, fl = -1;
    for (let d = 1; d <= gap; d++) if (getT(M, x, y - d) !== T.AIR) { ok = false; break; }
    if (!ok) continue;
    if (walk) { for (let d = gap; d < 12; d++) if (getT(M, x, y - d) !== T.AIR) { fl = y - d; break; } if (fl < 0 || getT(M, x, fl) !== T.ROCK) continue; }
    return [x, y];
  }
  return null;
}

// ---------------------------------------------------------------- boss lairs
// Each is 44 x 24 cells: an entry ledge on the left (the lift lands there), the arena, ledges to stand on.
export function bossArena(kind, depth, seed) {
  const W = 44, H = 26;
  const M = makeMap(W, H);
  M.depth = depth; M.level = LEVELS; M.biome = depth % 5; M.seed = seed; M.boss = kind; M.rW = 0; M.rH = 0;
  const fill = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) setT(M, x, y, t); };
  // hollow
  fill(2, 3, W - 3, H - 3, T.AIR);
  // floor at y = 3 (stand at y 3)
  const floorY = 3;
  // side ledges
  const ledge = (x0, x1, y) => fill(x0, y - 1, x1, y - 1, T.ROCK);
  if (kind === 'rockjaw') { ledge(2, 7, 9); ledge(W - 8, W - 3, 9); ledge(16, 27, 14); }
  if (kind === 'gloomwing') { ledge(2, 7, 8); ledge(W - 8, W - 3, 8); ledge(11, 16, 13); ledge(27, 32, 13); fill(2, H - 6, W - 3, H - 3, T.AIR); }
  if (kind === 'warden') { ledge(2, 8, 9); ledge(W - 9, W - 3, 9); ledge(12, 16, 14); ledge(27, 31, 14); }
  if (kind === 'wyrm') {
    // a deep pool in the middle, ledges round it
    fill(12, 1, 31, 5, T.WATER); fill(12, 0, 31, 0, T.ROCK);
    fill(2, 3, 11, 5, T.ROCK); fill(32, 3, W - 3, 5, T.ROCK);
    ledge(14, 18, 11); ledge(25, 29, 11); ledge(2, 7, 11); ledge(W - 8, W - 3, 11);
  }
  if (kind === 'heart') { ledge(2, 8, 8); ledge(W - 9, W - 3, 8); ledge(14, 19, 12); ledge(24, 29, 12); }
  // ladders up to the side ledges
  const ladder = (x, y0, y1) => fill(x, y0, x, y1, T.LADDER);
  const stand = kind === 'wyrm' ? 6 : floorY;
  if (kind === 'wyrm') { ladder(8, 6, 10); ladder(W - 9, 6, 10); }
  else { ladder(8, stand, kind === 'gloomwing' ? 7 : 8); ladder(W - 9, stand, kind === 'gloomwing' ? 7 : 8); }
  M.start = { x: 4.5, y: kind === 'wyrm' ? 6 : stand, shaftX: 4.5 };
  // entry shaft above the start
  for (let y = M.start.y; y < H; y++) for (const x of [4, 5]) setT(M, x, y, T.AIR);
  M.exit = null;
  M.arena = { x0: 2, x1: W - 2, floorY: stand, top: H - 3, kind };
  M.seen = new Uint8Array(W * H);
  M.totalGold = 0;
  return M;
}
