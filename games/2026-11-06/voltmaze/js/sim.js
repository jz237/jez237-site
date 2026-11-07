// Voltmaze simulation: fixed 120 Hz steps, all randomness from the world's own seeded generator (W.rs,
// with a non-enumerable W.rand helper) plus layout generators seeded from (seed, sector, room x/y), plain
// data only, so a world can be cloned and re-run bit for bit (replays, online, tests). Nothing in here
// touches the DOM, WebGL or audio; it only pushes events into W.ev.
import { F, STEP, ROOM, REINF, BURST_A, SECTORS, RAMP, rampAt, rampLevel, endlessLevel, ENDLESS, ENEMY, SEEKER, BOSSES, BOSS_KEYS, ATTACK, SCORE, START_LIVES, INTRO, introduced,
  DIFFICULTY, applyDiff, POWERUPS, PW_KEYS, DROP, fireCDOf, empMax, empStart, UPGRADES } from './config.js?v=6';
export { STEP };

const { RW, RH, wallT: WT, inT: IT, door: DOOR, cols: GC, rows: GR, entryIn } = ROOM;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hyp = Math.hypot;
export const SIDES = ['n', 'e', 's', 'w'];
export const DELTA = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
export const OPP = { n: 's', s: 'n', e: 'w', w: 'e' };
// wall kinds: 0 outer wall, 1 interior barrier, 2 sealed door field, 3 arrival/lift door, 4 boss-room pillar
export const WK = { OUTER: 0, BARRIER: 1, SEAL: 2, LIFTDOOR: 3, PILLAR: 4 };

// ------------------------------------------------------------------ seeded randomness
export function rand(W) {
  const s = (W.rs = (W.rs + 0x6D2B79F5) | 0);
  let t = Math.imul(s ^ (s >>> 15), s | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rr = (W, a, b) => a + (b - a) * rand(W);
const gauss = (W) => (rand(W) + rand(W) + rand(W) - 1.5) * 1.15;
function attachRand(W) { Object.defineProperty(W, 'rand', { value: () => rand(W), enumerable: false, configurable: true, writable: true }); return W; }
export function hash32(...a) { let h = 2166136261 | 0; for (const v of a) { h ^= v | 0; h = Math.imul(h, 16777619); h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; } return h | 0; }
export function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function pickW(r, mix) {
  let tot = 0;
  for (const k in mix) tot += mix[k];
  let x = r() * tot;
  for (const k in mix) { x -= mix[k]; if (x <= 0) return k; }
  return Object.keys(mix)[0];
}
export const angleOf = (x, z) => Math.atan2(z, x);
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }

// ------------------------------------------------------------------ geometry helpers (walls are [x0, z0, x1, z1, kind])
export function wallDist(x, z, w) { const cx = x < w[0] ? w[0] : x > w[2] ? w[2] : x, cz = z < w[1] ? w[1] : z > w[3] ? w[3] : z; return hyp(x - cx, z - cz); }
export function nearestWall(walls, x, z) {
  let bd = 1e9, bw = null;
  for (const w of walls) { const d = wallDist(x, z, w); if (d < bd) { bd = d; bw = w; } }
  return { d: bd, w: bw };
}
export function wallNear(walls, x, z, r) { for (const w of walls) if (x > w[0] - r && x < w[2] + r && z > w[1] - r && z < w[3] + r && wallDist(x, z, w) < r) return w; return null; }
export function segBox(ax, az, bx, bz, w, pad = 0) {
  const x0 = w[0] - pad, z0 = w[1] - pad, x1 = w[2] + pad, z1 = w[3] + pad, dx = bx - ax, dz = bz - az;
  let t0 = 0, t1 = 1;
  if (Math.abs(dx) < 1e-9) { if (ax < x0 || ax > x1) return false; } else { let a = (x0 - ax) / dx, b = (x1 - ax) / dx; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) return false; }
  if (Math.abs(dz) < 1e-9) { if (az < z0 || az > z1) return false; } else { let a = (z0 - az) / dz, b = (z1 - az) / dz; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) return false; }
  return true;
}
export function los(walls, ax, az, bx, bz, pad = 0.05) { for (const w of walls) if (segBox(ax, az, bx, bz, w, pad)) return false; return true; }
// push a circle out of a wall (for an overshield that soaks a wall touch)
function pushOut(w, x, z, r) {
  const cx = clamp(x, w[0], w[2]), cz = clamp(z, w[1], w[3]);
  let dx = x - cx, dz = z - cz, d = hyp(dx, dz);
  if (d < 1e-6) { // inside: leave by the nearest face
    const l = x - w[0], rgt = w[2] - x, t = z - w[1], b = w[3] - z, m = Math.min(l, rgt, t, b);
    if (m === l) return [w[0] - r - 0.15, z]; if (m === rgt) return [w[2] + r + 0.15, z]; if (m === t) return [x, w[1] - r - 0.15]; return [x, w[3] + r + 0.15];
  }
  dx /= d; dz /= d;
  return [cx + dx * (r + 0.15), cz + dz * (r + 0.15)];
}

// ------------------------------------------------------------------ the sector grid: rooms joined by doors
// Every room has at least two doors and no door is a bridge (the door graph is 2-edge-connected), so when
// the door you came in by seals behind you there is always another way to the lift.
const hIdx = (x, y) => y * (GC - 1) + x, vIdx = (x, y) => y * GC + x;
export function edgeOpen(G, x, y, side) {
  if (side === 'e') return x + 1 < GC && G.h[hIdx(x, y)] === 1;
  if (side === 'w') return x > 0 && G.h[hIdx(x - 1, y)] === 1;
  if (side === 's') return y + 1 < GR && G.v[vIdx(x, y)] === 1;
  return y > 0 && G.v[vIdx(x, y - 1)] === 1;
}
function neighbours(G, x, y, skip) { const out = []; for (const s of SIDES) if (s !== skip && edgeOpen(G, x, y, s)) out.push([x + DELTA[s][0], y + DELTA[s][1], s]); return out; }
// room-grid distances from (x, y), optionally not leaving through side `skip`
export function gridDist(G, x, y, skip) {
  const D = new Array(GC * GR).fill(-1), Q = [[x, y]];
  D[y * GC + x] = 0;
  for (let i = 0; i < Q.length; i++) {
    const [cx, cy] = Q[i];
    for (const [nx, ny] of neighbours(G, cx, cy, i === 0 ? skip : null)) if (D[ny * GC + nx] < 0) { D[ny * GC + nx] = D[cy * GC + cx] + 1; Q.push([nx, ny]); }
  }
  return D;
}
function hasBridge(G) {
  const N = GC * GR, disc = new Array(N).fill(-1), low = new Array(N).fill(0);
  let time = 0, bridge = false;
  const dfs = (u, parentEdge) => {
    disc[u] = low[u] = time++;
    const x = u % GC, y = (u / GC) | 0;
    for (const s of SIDES) {
      if (!edgeOpen(G, x, y, s)) continue;
      const v = (y + DELTA[s][1]) * GC + x + DELTA[s][0], eid = Math.min(u, v) * N + Math.max(u, v);
      if (eid === parentEdge) continue;
      if (disc[v] < 0) { dfs(v, eid); low[u] = Math.min(low[u], low[v]); if (low[v] > disc[u]) bridge = true; }
      else low[u] = Math.min(low[u], disc[v]);
    }
  };
  dfs(0, -1);
  return bridge || disc.some((d) => d < 0);
}
function buildGrid(W) {
  const r = mkr(hash32(W.seed, floorKey(W), 0x51d));
  const G = { h: new Array((GC - 1) * GR).fill(1), v: new Array(GC * (GR - 1)).fill(1), sx: 0, sy: 0, sSide: 'w', lx: 0, ly: 0, seen: new Array(GC * GR).fill(0) };
  const edges = [];
  for (let i = 0; i < G.h.length; i++) edges.push(['h', i]);
  for (let i = 0; i < G.v.length; i++) edges.push(['v', i]);
  for (let i = edges.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; const q = edges[i]; edges[i] = edges[j]; edges[j] = q; }
  let removed = 0;
  for (const [k, i] of edges) {
    if (removed >= 11) break;
    G[k][i] = 0;
    if (hasBridge(G)) G[k][i] = 1; else removed++;
  }
  // arrival lift on an outer edge of the grid
  const side = SIDES[(r() * 4) | 0];
  if (side === 'w' || side === 'e') { G.sx = side === 'w' ? 0 : GC - 1; G.sy = (r() * GR) | 0; } else { G.sy = side === 'n' ? 0 : GR - 1; G.sx = (r() * GC) | 0; }
  G.sSide = side;
  // the boss lift: a room about `rooms` doors away
  const want = W.mode === 'endless' ? ENDLESS.rooms : RAMP[W.sector].rooms;
  const D = gridDist(G, G.sx, G.sy);
  let best = [], bd = 1e9;
  D.forEach((d, i) => { if (d < 0) return; const s = Math.abs(d - want) + (d < want ? 0.5 : 0); if (s < bd - 1e-9) { bd = s; best = [i]; } else if (Math.abs(s - bd) < 1e-9) best.push(i); });
  const li = best[(r() * best.length) | 0];
  G.lx = li % GC; G.ly = (li / GC) | 0;
  G.route = D[li];
  W.grid = G;
}
const floorKey = (W) => (W.mode === 'endless' ? 100 + W.floor : W.sector);

// ------------------------------------------------------------------ a room's walls
// Outer walls with door gaps, then electrified barriers dropped on a loose 5 x 3 lattice of anchors as
// bars, corners, tees, posts and spurs off the outer wall. A walk check makes sure every exit can be
// reached from where you come in and that no big pocket is walled off; shapes that break it are dropped.
export function genWalls(seed, fkey, rx, ry, doors, density, boss) {
  const r = mkr(hash32(seed, fkey, rx * 31 + ry * 7, 0xa11));
  const walls = [], T = WT, D = DOOR / 2;
  const add = (x0, z0, x1, z1, k) => walls.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1), k]);
  // outer: n (z<-RH), s (z>RH), w (x<-RW), e (x>RW)
  const side = (s, has) => {
    const sealK = has === 3 ? WK.LIFTDOOR : WK.SEAL;
    if (s === 'n' || s === 's') {
      const z0 = s === 'n' ? -RH - T : RH, z1 = z0 + T;
      if (!has) add(-RW - T, z0, RW + T, z1, WK.OUTER);
      else { add(-RW - T, z0, -D, z1, WK.OUTER); add(D, z0, RW + T, z1, WK.OUTER); if (has >= 2) add(-D, z0, D, z1, sealK); }
    } else {
      const x0 = s === 'w' ? -RW - T : RW, x1 = x0 + T;
      if (!has) add(x0, -RH, x1, RH, WK.OUTER);
      else { add(x0, -RH, x1, -D, WK.OUTER); add(x0, D, x1, RH, WK.OUTER); if (has >= 2) add(x0, -D, x1, D, sealK); }
    }
  };
  for (const s of SIDES) side(s, doors[s]);
  if (boss) {
    for (const [x, z] of [[-8.5, -4.6], [8.5, -4.6], [-8.5, 4.6], [8.5, 4.6]]) add(x - 0.75, z - 0.75, x + 0.75, z + 0.75, WK.PILLAR);
    return walls;
  }
  const outerN = walls.length;
  // keep the floor in front of every door clear
  const keep = [];
  for (const s of SIDES) if (doors[s]) {
    if (s === 'w') keep.push([-RW, -D - 1.2, -RW + 4.2, D + 1.2]); if (s === 'e') keep.push([RW - 4.2, -D - 1.2, RW, D + 1.2]);
    if (s === 'n') keep.push([-D - 1.2, -RH, D + 1.2, -RH + 3.8]); if (s === 's') keep.push([-D - 1.2, RH - 3.8, D + 1.2, RH]);
  }
  const overlaps = (a, b, pad = 0) => a[0] < b[2] + pad && a[2] > b[0] - pad && a[1] < b[3] + pad && a[3] > b[1] - pad;
  const gap = (a, b) => Math.hypot(Math.max(0, a[0] - b[2], b[0] - a[2]), Math.max(0, a[1] - b[3], b[1] - a[3]));
  const shapes = [];
  const t = IT;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) {
    if (r() > density) continue;
    const ax = -RW + ((i + 1) * 2 * RW) / 6 + (r() - 0.5) * 1.4, az = -RH + ((j + 1) * 2 * RH) / 4 + (r() - 0.5) * 1.0;
    const q = r(), sx = r() < 0.5 ? -1 : 1, sz = r() < 0.5 ? -1 : 1, parts = [];
    const bar = (x, z, len, vert) => vert ? parts.push([x - t / 2, z - len / 2, x + t / 2, z + len / 2]) : parts.push([x - len / 2, z - t / 2, x + len / 2, z + t / 2]);
    const outerRing = i === 0 || i === 4 || j === 0 || j === 2;
    if (outerRing && q < 0.16) {
      // a spur off the outer wall
      const len = 2.4 + r() * 1.8;
      if (j === 0 && Math.abs(ax) > D + 1.5) parts.push([ax - t / 2, -RH, ax + t / 2, -RH + len]);
      else if (j === 2 && Math.abs(ax) > D + 1.5) parts.push([ax - t / 2, RH - len, ax + t / 2, RH]);
      else if (i === 0 && Math.abs(az) > D + 1.2) parts.push([-RW, az - t / 2, -RW + len, az + t / 2]);
      else if (i === 4 && Math.abs(az) > D + 1.2) parts.push([RW - len, az - t / 2, RW, az + t / 2]);
      else bar(ax, az, 2.6 + r() * 2, false);
    } else if (q < 0.36) bar(ax, az, 2.4 + r() * 2.8, false);
    else if (q < 0.5) bar(ax, az, 1.8 + r() * 1.8, true);
    else if (q < 0.68) { const lx = 2 + r() * 2.2, lz = 1.6 + r() * 1.6; parts.push([Math.min(ax, ax + sx * lx), az - t / 2, Math.max(ax, ax + sx * lx), az + t / 2]); parts.push([ax - t / 2, Math.min(az, az + sz * lz), ax + t / 2, Math.max(az, az + sz * lz)]); }
    else if (q < 0.8) { const lx = 2.6 + r() * 2, lz = 1.4 + r() * 1.4; bar(ax, az, lx, false); parts.push([ax - t / 2, Math.min(az, az + sz * lz), ax + t / 2, Math.max(az, az + sz * lz)]); }
    else if (q < 0.91) { const s = 0.9 + r() * 0.8; parts.push([ax - s / 2, az - s / 2, ax + s / 2, az + s / 2]); }
    else { const s = 0.7, g = 1.9 + r() * 0.8; if (r() < 0.5) { parts.push([ax - g / 2 - s, az - s / 2, ax - g / 2, az + s / 2]); parts.push([ax + g / 2, az - s / 2, ax + g / 2 + s, az + s / 2]); } else { parts.push([ax - s / 2, az - g / 2 - s, ax + s / 2, az - g / 2]); parts.push([ax - s / 2, az + g / 2, ax + s / 2, az + g / 2 + s]); } }
    // clip to the floor, reject shapes in front of doors or leaving a sliver of a gap to another shape
    const clipped = parts.map((p) => [clamp(p[0], -RW, RW), clamp(p[1], -RH, RH), clamp(p[2], -RW, RW), clamp(p[3], -RH, RH)]).filter((p) => p[2] - p[0] > 0.2 && p[3] - p[1] > 0.2);
    if (!clipped.length) continue;
    if (clipped.some((p) => keep.some((k) => overlaps(p, k)))) continue;
    let bad = false;
    for (const S of shapes) for (const a of S) for (const b of clipped) { const g = gap(a, b); if (g > 0 && g < 1.6) bad = true; }
    // a free-standing shape must not leave a sliver against the outer wall either
    for (const p of clipped) { const gx = Math.min(p[0] + RW, RW - p[2]), gz = Math.min(p[1] + RH, RH - p[3]); if ((gx > 0.01 && gx < 1.5) || (gz > 0.01 && gz < 1.5)) bad = true; }
    if (bad) continue;
    shapes.push(clipped);
  }
  // walk check: drop shapes (last first) until every door is reachable and nothing big is cut off
  const cell = 0.5, nx = Math.round((2 * RW) / cell), nz = Math.round((2 * RH) / cell), clr = F.r + 0.3;
  const test = (list) => {
    const all = walls.slice(0, outerN);
    for (const S of list) for (const p of S) all.push(p);
    const free = new Uint8Array(nx * nz);
    let nFree = 0;
    for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) {
      const x = -RW + (i + 0.5) * cell, z = -RH + (k + 0.5) * cell;
      if (!wallNear(all, x, z, clr)) { free[k * nx + i] = 1; nFree++; }
    }
    const doorsAt = [];
    for (const s of SIDES) if (doors[s]) {
      const [x, z] = s === 'w' ? [-RW + 0.8, 0] : s === 'e' ? [RW - 0.8, 0] : s === 'n' ? [0, -RH + 0.8] : [0, RH - 0.8];
      doorsAt.push(Math.min(nz - 1, Math.max(0, Math.floor((z + RH) / cell))) * nx + Math.min(nx - 1, Math.max(0, Math.floor((x + RW) / cell))));
    }
    if (!doorsAt.length) return true;
    const seen = new Uint8Array(nx * nz), Q = [doorsAt[0]];
    if (!free[doorsAt[0]]) return false;
    seen[doorsAt[0]] = 1;
    let n = 0;
    for (let qi = 0; qi < Q.length; qi++) {
      const c = Q[qi]; n++;
      const ci = c % nx, ck = (c / nx) | 0;
      for (const [di, dk] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const i2 = ci + di, k2 = ck + dk;
        if (i2 < 0 || k2 < 0 || i2 >= nx || k2 >= nz) continue;
        const c2 = k2 * nx + i2;
        if (!free[c2] || seen[c2]) continue;
        seen[c2] = 1; Q.push(c2);
      }
    }
    return doorsAt.every((d) => seen[d]) && n >= nFree * 0.9;
  };
  while (shapes.length && !test(shapes)) shapes.pop();
  for (const S of shapes) for (const p of S) add(p[0], p[1], p[2], p[3], WK.BARRIER);
  return walls;
}

// ------------------------------------------------------------------ world
export function makeWorld(o = {}) {
  const seed = (o.seed ?? 1) | 0;
  const mode = o.mode === 'endless' ? 'endless' : 'campaign';
  const diff = DIFFICULTY[o.diff] ? o.diff : 'normal';
  const D = DIFFICULTY[diff];
  const sector = mode === 'campaign' ? clamp(o.sector || 0, 0, 4) : 0;
  const W = {
    n: 0, t: 0, seed, rs: (seed ^ 0x2545F491) | 0, mode, diff, sector, floor: 0, k: sector, up: { ...(o.up || {}) }, demo: !!o.demo, coop: !!o.coop,
    lives: o.lives ?? START_LIVES + D.lives, score: o.score || 0, lifePts: 0, nextLife: 0, depth: 0, roomN: -1, secT: 0,
    phase: 'play', phaseT: 0, exitSide: null, R: null, grid: null, room: null,
    players: [], robots: [], bolts: [], shots: [], mines: [], zones: [], pickups: [], boss: null, seeker: null, seekerN: 0,
    nextId: 1, ev: [], over: false, result: null, claims: [], net: null, lastDeathN: -1,
    graceT: mode === 'campaign' && sector === 0 && !o.demo && !o.noGrace ? D.grace : 0,
    tutorial: mode === 'campaign' && sector === 0 && !o.noTut && !o.demo,
    stats: { kills: 0, lured: 0, deaths: 0, shots: 0, hits: 0, rooms: 0, cleared: 0, skipped: 0, emps: 0, bossT: 0, cause: {}, roomDeaths: {}, roomTries: {}, bolts: 0, killedBy: {} },
    tut: {},
  };
  attachRand(W);
  const LE = SCORE.lifeEvery * D.score;
  W.lifePts = W.score;
  W.nextLife = (Math.floor(W.lifePts / LE) + 1) * LE;
  const n = o.coop ? 2 : 1;
  for (let i = 0; i < n; i++) W.players.push(makePlayer(i + 1, W));
  buildGrid(W);
  const G = W.grid;
  // ?room=N style starts (tests, demo): walk the route a few rooms in
  let rx = G.sx, ry = G.sy, side = G.sSide;
  enterRoom(W, rx, ry, side, true);
  if (o.room > 0) for (let i = 0; i < o.room; i++) { const s = routeSide(W); if (!s) break; const [dx, dy] = DELTA[s]; enterRoom(W, W.room.rx + dx, W.room.ry + dy, OPP[s]); }
  if (o.boss) { W.roomN = W.R.rooms - 1; enterRoom(W, G.lx, G.ly, liftEntrySide(W)); }
  return W;
}
function makePlayer(id, W) {
  return { id, x: 0, z: 0, vx: 0, vz: 0, aim: 0, alive: true, deadT: 0, inv: 0, shield: 0, plate: W.up.plate || 0, emp: empStart(W.up), fireT: 0, dashT: 0, dashCD: 0, dashA: 0,
    walk: 0, pw: {}, input: { mx: 0, mz: 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false }, empHeld: false, dashHeld: false, remote: false, hurtT: 0, brT: 0, liftT: 0, slow: 0 };
}
export function cloneWorld(W) { return attachRand(structuredClone(W)); }
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
const alive = (W) => W.players.filter((p) => p.alive);
function nearestPlayer(W, x, z) {
  let best = null, bd = 1e9;
  for (const p of W.players) { if (!p.alive) continue; const d = hyp(p.x - x, p.z - z); if (d < bd) { bd = d; best = p; } }
  return best;
}
const D_OF = (W) => DIFFICULTY[W.diff] || DIFFICULTY.normal;
export function addScore(W, n, mul = 1) { const b = Math.round(n * D_OF(W).score); W.score += Math.round(n * D_OF(W).score * mul); W.lifePts += b; }
export const bossKeyOf = (W) => (W.mode === 'campaign' ? SECTORS[W.sector].boss : BOSS_KEYS[W.floor % BOSS_KEYS.length]);
export const roomLabel = (W) => (W.room && W.room.boss ? 'LIFT · BOSS' : `ROOM ${W.roomN + 1}`);
// the side to leave by to get closer to the lift (never the sealed one you came in by)
export function routeSide(W) {
  const G = W.grid, rm = W.room;
  if (!rm) return null;
  let best = null, bd = 1e9;
  for (const s of SIDES) {
    if (rm.doors[s] !== 1) continue;
    const nx = rm.rx + DELTA[s][0], ny = rm.ry + DELTA[s][1];
    const D = gridDist(G, nx, ny, OPP[s]);
    const d = D[G.ly * GC + G.lx];
    if (d >= 0 && d < bd) { bd = d; best = s; }
  }
  return best;
}
function liftEntrySide(W) { const G = W.grid; for (const s of SIDES) if (edgeOpen(G, G.lx, G.ly, s)) return s; return 'w'; }
export const entryPoint = (side, k = 0, n = 1) => {
  const off = n > 1 ? (k ? 0.9 : -0.9) : 0;
  if (side === 'w') return [-RW + entryIn, off, 0];
  if (side === 'e') return [RW - entryIn, off, Math.PI];
  if (side === 'n') return [off, -RH + entryIn, Math.PI / 2];
  return [off, RH - entryIn, -Math.PI / 2];
};

// ------------------------------------------------------------------ entering a room
function enterRoom(W, rx, ry, side, first = false) {
  const G = W.grid;
  W.roomN = first ? 0 : W.roomN + 1;
  W.depth++;
  const camp = W.mode === 'campaign';
  W.R = applyDiff(camp ? rampAt(W.sector, Math.min(W.roomN, RAMP[W.sector].rooms - 1)) : rampLevel(endlessLevel(W.depth - 1)), W.diff);
  const boss = rx === G.lx && ry === G.ly;
  const doors = {};
  for (const s of SIDES) doors[s] = edgeOpen(G, rx, ry, s) ? (boss ? 2 : 1) : 0;
  if (first) doors[side] = 3; else doors[side] = 2;
  const walls = genWalls(W.seed, floorKey(W), rx, ry, doors, W.R.walls, boss);
  W.room = { rx, ry, key: `${floorKey(W)}:${rx},${ry}:${W.depth}`, walls, doors, entry: side, boss, t: 0, cleared: 0, total: 0, liftOn: 0, liftT: 0, seekWarned: 0, cap: 2, first };
  G.seen[ry * GC + rx] = 2;
  for (const s of SIDES) if (edgeOpen(G, rx, ry, s)) { const i = (ry + DELTA[s][1]) * GC + rx + DELTA[s][0]; if (!G.seen[i]) G.seen[i] = 1; }
  W.bolts = []; W.shots = []; W.mines = []; W.zones = []; W.pickups = []; W.robots = []; W.seeker = null; W.boss = null;
  W.phase = 'play'; W.phaseT = 0;
  const n = W.players.length;
  W.players.forEach((p, i) => {
    const [x, z, a] = entryPoint(side, i, n);
    p.x = x; p.z = z; p.aim = a; p.vx = Math.cos(a) * 1.5; p.vz = Math.sin(a) * 1.5; p.plate = W.up.plate || 0; p.dashT = 0; p.liftT = 0; p.slow = 0;
    if (!p.alive && W.lives > 0) { p.alive = true; p.deadT = 0; p.inv = F.inv; }
    else if (p.alive) p.inv = Math.max(p.inv, 0.6);
  });
  // how many may fire at once this room: the RAMP's share, rounded by a roll
  const sh = W.R.shoot;
  W.room.cap = Math.floor(sh) + (rand(W) < sh - Math.floor(sh) ? 1 : 0);
  W.stats.rooms++;
  W.stats.roomTries[W.roomN] = (W.stats.roomTries[W.roomN] || 0) + 1;
  if (boss) startBoss(W);
  else spawnRobots(W);
  W.ev.push({ k: 'roomenter', rx, ry, side, boss, first, n: W.roomN, key: W.room.key });
  if (W.tutorial && first) tut(W, 'move');
}
function tut(W, key) { if (W.tut[key] || W.demo) return; W.tut[key] = 1; W.ev.push({ k: 'tut', key }); }

// a free spot: clear of walls by `clr`, at least `far` from the entry/players, `sep` from other robots
function freeSpot(W, far, clr = 1.1, sep = 2.0, tries = 40) {
  const walls = W.room.walls;
  const [ex, ez] = entryPoint(W.room.entry);
  let best = null, bs = -1e9;
  for (let i = 0; i < tries; i++) {
    const x = rr(W, -RW + 1.2, RW - 1.2), z = rr(W, -RH + 1.2, RH - 1.2);
    if (wallNear(walls, x, z, clr)) continue;
    let d = hyp(x - ex, z - ez);
    for (const p of W.players) if (p.alive) d = Math.min(d, hyp(p.x - x, p.z - z));
    let s = Math.min(d, far) * 2;
    let near = 99;
    for (const e of W.robots) near = Math.min(near, hyp(e.x - x, e.z - z));
    if (W.boss) near = Math.min(near, hyp(W.boss.x - x, W.boss.z - z) - W.boss.r);
    s += Math.min(near, sep * 1.5);
    if (d >= far && near >= sep) return [x, z];
    if (s > bs) { bs = s; best = [x, z]; }
  }
  return best;
}
function allowedMix(W) {
  const R = W.R, out = {};
  for (const k in R.mix) if (W.mode !== 'campaign' || introduced(k, W.sector, Math.min(W.roomN, R.rooms - 1))) out[k] = R.mix[k];
  return out;
}
function spawnRobots(W) {
  const R = W.R, mix = allowedMix(W);
  // the RAMP's fractional robot count and reinforcements are rolled, so a sector climbs smoothly room by room
  const cf = R.countF ?? R.count, c0 = Math.floor(cf), rf = cf * (R.reinf || 0), r0 = Math.floor(rf);
  let left = c0 + (rand(W) < cf - c0 ? 1 : 0);
  const reinf = r0 + (rand(W) < rf - r0 ? 1 : 0);
  // a robot making its first appearance gets a word about it
  if (W.mode === 'campaign') for (const k in INTRO) if (INTRO[k][0] === W.sector && INTRO[k][1] === W.roomN && k !== 'sentry' && mix[k]) {
    if (k === 'twin') { if (spawnTwin(W)) left -= 2; } else if (addRobot(W, k)) left--;
    tut(W, k);
  }
  let guard = 0;
  while (left > 0 && guard++ < 40) {
    const type = pickW(() => rand(W), mix);
    if (type === 'twin') { if (left >= 2 && spawnTwin(W)) left -= 2; else if (addRobot(W, 'sentry')) left--; continue; }
    if (addRobot(W, type)) left--;
  }
  W.room.total = W.robots.length;
  // security sends reinforcements while the room is still live: they warp in far from you, powered down
  W.room.reinf = reinf; W.room.reinfT = 0;
}
function warpIn(W) {
  const R = W.R, mix = allowedMix(W);
  delete mix.twin;
  const type = pickW(() => rand(W), Object.keys(mix).length ? mix : { sentry: 1 });
  const e = addRobot(W, type, null, R.warn + 0.4);
  W.room.reinf--;
  if (!e) return;
  W.room.total++; e.warp = 1;
  W.ev.push({ k: 'warpin', id: e.id, type, x: e.x, z: e.z, T: e.boot });
  tut(W, 'reinf');
}
export function addRobot(W, type, at, boot) {
  const E = ENEMY[type];
  const q = at || freeSpot(W, W.room.boss ? 6 : ROOM.spawnFar, E.r + 0.7, 2.0);
  if (!q) return null;
  const R = W.R;
  const e = { id: W.nextId++, type, x: q[0], z: q[1], vx: 0, vz: 0, hp: E.hp, max: E.hp, r: E.r, t: 0, boot: boot ?? R.boot + rr(W, 0, 0.5), a: rr(W, 0, TAU),
    fireT: R.first * rr(W, 0.35, 1.3), aimT: 0, aimA: 0, lockT: 0, aimTot: 0, thinkT: 0, dirA: 0, moving: 0, careful: 0, hitT: 0,
    mode: type === 'patroller' ? 'patrol' : 'hunt', pax: rand(W) < 0.5 ? 1 : 0, pdir: rand(W) < 0.5 ? -1 : 1, pair: 0, lead: 0, rage: 0, lunge: 0, rest: 0, brT: 0, life: E.life || 0, strafe: rand(W) < 0.5 ? -1 : 1, fly: E.fly ? 1 : 0 };
  W.robots.push(e);
  return e;
}
function spawnTwin(W) {
  const E = ENEMY.twin;
  for (let k = 0; k < 6; k++) {
    const q = freeSpot(W, ROOM.spawnFar, 1.3, 2.4);
    if (!q) return false;
    const a = rr(W, 0, TAU), x2 = q[0] + Math.cos(a) * E.gap, z2 = q[1] + Math.sin(a) * E.gap;
    if (wallNear(W.room.walls, x2, z2, 1.1) || Math.abs(x2) > RW - 1.2 || Math.abs(z2) > RH - 1.2) continue;
    const L = addRobot(W, 'twin', q), Fw = addRobot(W, 'twin', [x2, z2]);
    L.pair = Fw.id; Fw.pair = L.id; L.lead = 1; Fw.lead = 0; Fw.boot = L.boot; Fw.fireT = L.fireT + 0.9 / Math.max(0.05, W.R.fire);
    Fw.ox = Math.cos(a) * E.gap; Fw.oz = Math.sin(a) * E.gap;
    return true;
  }
  return false;
}

// ------------------------------------------------------------------ the step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  if (W.net === 'guest') { guestStep(W, dt); return; }
  W.phaseT -= dt;
  if (W.phase === 'transit') {
    for (const p of W.players) if (p.alive) { p.x += p.vx * dt; p.z += p.vz * dt; p.walk += hyp(p.vx, p.vz) * dt; }
    if (W.phaseT <= 0) { const s = W.exitSide, [dx, dy] = DELTA[s]; enterRoom(W, W.room.rx + dx, W.room.ry + dy, OPP[s]); }
    return;
  }
  if (W.phase === 'liftup') { if (W.phaseT <= 0) finishLift(W); return; }
  const room = W.room;
  room.t += dt; W.secT += dt;
  if (room.boss && W.boss) W.stats.bossT += dt;
  if (W.graceT > 0) W.graceT -= dt;
  if (W.tutorial && room.first) { if (room.t > 3.2) tut(W, 'fire'); if (room.t > 6.4) tut(W, 'walls'); }
  for (const p of W.players) player(W, p, dt);
  for (const e of W.robots) if (e.hp > 0) robot(W, e, dt);
  robotContacts(W);
  if (W.boss) boss(W, W.boss, dt);
  seeker(W, dt);
  shots(W, dt);
  bolts(W, dt);
  mines(W, dt);
  zones(W, dt);
  pickups(W, dt);
  playerContacts(W);
  W.robots = W.robots.filter((e) => e.hp > 0);
  // reinforcements: one every REINF.every s while fewer than REINF.below x count are left
  if (!room.boss && !room.cleared && room.reinf > 0 && room.t > REINF.after && alive(W).length) {
    room.reinfT -= dt;
    let live = 0; for (const e of W.robots) if (e.type !== 'drone') live++;
    if (room.reinfT <= 0 && live < Math.max(REINF.min, W.R.count * REINF.below)) { warpIn(W); room.reinfT = REINF.every; }
  }
  // room clear bonus
  if (!room.cleared && !room.boss && room.total > 0 && !(room.reinf > 0) && !W.robots.some((e) => e.type !== 'drone')) {
    room.cleared = 1;
    const bonus = SCORE.clearPer * room.total * (1 + 0.25 * (W.mode === 'campaign' ? W.sector : W.floor % 5));
    addScore(W, bonus);
    W.stats.cleared++;
    for (const p of W.players) if (p.alive) p.emp = Math.min(empMax(W.up), p.emp + (W.stats.cleared % 3 === 0 ? 1 : 0));
    W.ev.push({ k: 'roomclear', bonus: Math.round(bonus * D_OF(W).score), n: room.total });
    if (W.tutorial) tut(W, 'exit');
  }
  lift(W, dt);
  checkExit(W);
  if (W.lifePts >= W.nextLife) { W.lives++; W.nextLife += SCORE.lifeEvery * D_OF(W).score; W.ev.push({ k: 'life' }); }
  if (W.lives <= 0 && !W.players.some((p) => p.alive) && W.players.every((p) => p.deadT > 1.6)) { W.over = true; W.result = 'over'; W.ev.push({ k: 'over' }); }
}

// ------------------------------------------------------------------ infiltrators
function player(W, p, dt) {
  if (!p.alive) {
    p.deadT += dt;
    // the host brings a remote partner back too (its snapshot tells the guest); a guest never respawns itself
    if (p.deadT >= F.respawn && W.lives > 0 && W.net !== 'guest') respawn(W, p);
    return;
  }
  if (p.inv > 0) p.inv -= dt;
  if (p.hurtT > 0) p.hurtT -= dt;
  for (const k in p.pw) { p.pw[k] -= dt; if (p.pw[k] <= 0) { delete p.pw[k]; W.ev.push({ k: 'pwend', pid: p.id, kind: k }); } }
  if (p.remote) return;
  const I = p.input;
  p.fireT -= dt; p.dashCD -= dt;
  let mx = +I.mx || 0, mz = +I.mz || 0;
  const ml = hyp(mx, mz);
  if (ml > 1) { mx /= ml; mz /= ml; }
  const rawA = ml > 0.2 ? Math.atan2(mz, mx) : null;
  // aim: planted feet aim with the run keys; a second stick/the mouse aims freely; otherwise you face where you run
  if (I.plant) { if (ml > 0.2) p.aim = Math.atan2(mz, mx); mx = mz = 0; }
  else if (I.ax || I.az) p.aim = Math.atan2(I.az, I.ax);
  else if (ml > 0.2) p.aim = Math.atan2(mz, mx);
  // ice from a frost attack slows you down
  p.slow = 0;
  for (const z of W.zones) if (z.style === 'ice' && inZone(z, p.x, p.z, 0)) p.slow = 1;
  const sp = F.speed * (p.slow ? 0.55 : 1);
  const lv = W.up.dash || 0;
  if (I.dash && !p.dashHeld && lv > 0 && p.dashCD <= 0 && (ml > 0.2 || I.plant)) {
    p.dashA = rawA ?? p.aim; p.dashT = F.dashT; p.dashCD = F.dashCD[lv];
    W.ev.push({ k: 'dash', pid: p.id, x: p.x, z: p.z, a: p.dashA });
  }
  p.dashHeld = !!I.dash;
  if (p.dashT > 0) { p.dashT -= dt; p.vx = Math.cos(p.dashA) * F.dashV; p.vz = Math.sin(p.dashA) * F.dashV; }
  else {
    const tx = mx * sp, tz = mz * sp, a = F.accel * dt * (I.plant ? 3 : 1);   // planting your feet stops you short
    p.vx += clamp(tx - p.vx, -a, a); p.vz += clamp(tz - p.vz, -a, a);
  }
  p.x += p.vx * dt; p.z += p.vz * dt;
  p.walk += hyp(p.vx, p.vz) * dt;
  // electrified walls
  const nw = nearestWall(W.room.walls, p.x, p.z);
  if (nw.w && nw.d < F.r) { zap(W, p, 'wall', p.x, p.z, nw.w); if (p.alive) solid(W, p); }   // invulnerable: the wall still stops you
  else if (nw.w && nw.d < F.r + F.brush) { p.brT -= dt; if (p.brT <= 0) { p.brT = 0.09; const cx = clamp(p.x, nw.w[0], nw.w[2]), cz = clamp(p.z, nw.w[1], nw.w[3]); W.ev.push({ k: 'brush', x: cx, z: cz, pid: p.id }); } }
  if (!p.alive) return;
  // fire
  if (I.fire && p.fireT <= 0) {
    const mine = W.shots.reduce((n, s) => n + (s.pid === p.id && !s.sub ? 1 : 0), 0);
    if (mine < F.maxShots + (W.up.weapon || 0) + (p.pw.rapid ? 2 : 0)) fire(W, p);
  }
  if (I.emp && !p.empHeld && p.emp > 0) emp(W, p);
  p.empHeld = !!I.emp;
}
function fire(W, p) {
  p.fireT = fireCDOf(W.up.weapon) * (p.pw.rapid ? 0.5 : 1);
  const angs = p.pw.spread ? [0, -F.spread, F.spread] : [0];
  angs.forEach((da, i) => {
    const a = p.aim + da, c = Math.cos(a), s = Math.sin(a);
    W.shots.push({ id: W.nextId++, pid: p.id, x: p.x + c * 0.62, z: p.z + s * 0.62, vx: c * F.shotV, vz: s * F.shotV, life: F.shotLife, bounce: p.pw.ricochet ? 2 : 0, sub: i > 0 ? 1 : 0 });
  });
  W.stats.shots++;
  W.ev.push({ k: 'fire', pid: p.id, x: p.x, z: p.z, a: p.aim, n: angs.length });
}
export function emp(W, p, remote = false) {
  if (!remote) { if (p.emp <= 0) return; p.emp--; }
  W.stats.emps++;
  W.ev.push({ k: 'emp', pid: p.id, x: p.x, z: p.z });
  if (W.net === 'guest') { W.claims.push({ emp: 1 }); return; }
  for (const e of W.robots) if (e.hp > 0 && hyp(e.x - p.x, e.z - p.z) < F.empR + e.r) kill(W, e, 'emp', p.id);
  W.bolts = W.bolts.filter((b) => hyp(b.x - p.x, b.z - p.z) > F.empR);
  for (const m of W.mines) if (hyp(m.x - p.x, m.z - p.z) < F.empR) m.dud = 1;
  W.mines = W.mines.filter((m) => !m.dud);
  const B = W.boss;
  if (B && B.state === 'fight' && hyp(B.x - p.x, B.z - p.z) < F.empR + B.r + 3) {
    if (B.heads.some((h) => h.hp > 0)) { for (const h of B.heads) if (h.hp > 0) hitHead(W, B, h, 2, p.id); }
    else hitBoss(W, B, F.empBoss, p.id, B.x, B.z, true);
    if (B.cur && B.cur.kind !== 'charge') { B.cur = null; B.cool = 1.0; W.zones = W.zones.filter((z) => z.style === 'ice'); }
    W.ev.push({ k: 'bossflinch' });
  }
}
// walls stay solid while a touch can't hurt you (just respawned, a soak, the room-entry grace): slide along them,
// never through, so the suit can't step outside the room where no robot can see it
function solid(W, p) {
  for (let it = 0; it < 3; it++) {
    const w = wallNear(W.room.walls, p.x, p.z, F.r);
    if (!w) return;
    const cx = clamp(p.x, w[0], w[2]), cz = clamp(p.z, w[1], w[3]);
    let dx = p.x - cx, dz = p.z - cz;
    const d = hyp(dx, dz);
    if (d < 1e-6) { const q = pushOut(w, p.x, p.z, F.r); p.x = q[0]; p.z = q[1]; p.vx = p.vz = 0; continue; }
    dx /= d; dz /= d;
    p.x = cx + dx * (F.r + 0.01); p.z = cz + dz * (F.r + 0.01);
    const vn = p.vx * dx + p.vz * dz;
    if (vn < 0) { p.vx -= vn * dx; p.vz -= vn * dz; }
  }
}
// the one place an infiltrator gets hurt; returns true if it went through
function zap(W, p, cause, x, z, wall, from) {
  if (!p.alive || p.inv > 0) return false;
  if (p.dashT > 0 && cause === 'bolt') return false;
  const guest = W.net === 'guest';
  if (p.remote) return false;
  const bounce = () => {
    p.inv = F.hitInv;
    if (wall) { const q = pushOut(wall, p.x, p.z, F.r); p.x = q[0]; p.z = q[1]; p.vx = p.vz = 0; }
    else { const dx = p.x - x, dz = p.z - z, d = hyp(dx, dz) || 1; p.vx = (dx / d) * 4; p.vz = (dz / d) * 4; }
  };
  if (W.graceT > 0) { bounce(); W.ev.push({ k: 'shield', pid: p.id, x: p.x, z: p.z, grace: 1 }); return false; }
  if (p.shield > 0) { p.shield--; bounce(); W.ev.push({ k: 'shield', pid: p.id, x: p.x, z: p.z }); if (guest) W.claims.push({ shield: p.shield }); return false; }
  if (cause === 'bolt' && p.plate > 0) { p.plate--; p.inv = F.hitInv; W.ev.push({ k: 'plate', pid: p.id, x: p.x, z: p.z }); return false; }
  p.alive = false; p.deadT = 0; p.hurtT = 1; p.vx *= 0.3; p.vz *= 0.3;
  W.stats.deaths++; W.stats.cause[cause] = (W.stats.cause[cause] || 0) + 1;
  W.stats.roomDeaths[W.roomN] = (W.stats.roomDeaths[W.roomN] || 0) + 1;
  W.lastDeathN = W.n;
  const [cx, cz] = causeAt(W, cause, x, z, from);
  if (guest) { W.claims.push({ dead: 1, cause }); W.ev.push({ k: 'death', pid: p.id, x: p.x, z: p.z, cause, cx, cz }); return true; }
  W.lives = Math.max(0, W.lives - 1);
  W.ev.push({ k: 'death', pid: p.id, x: p.x, z: p.z, cause, lives: W.lives, cx, cz, from: from ?? null });
  return true;
}
// where the thing that got you was (the shooter of a bolt, the boss behind a beam), so a camera can frame both
function causeAt(W, cause, x, z, from) {
  const B = W.boss;
  if ((from === -1 || cause === 'beam') && B) return [B.x, B.z];
  if (from !== undefined && from !== null) { const e = W.robots.find((q) => q.id === from); if (e) return [e.x, e.z]; }
  return [x, z];
}
// back at the room's entry (the checkpoint): the room's threats reset around you
function respawn(W, p) {
  const n = W.players.length, i = W.players.indexOf(p);
  const [x, z, a] = entryPoint(W.room.entry, i, n);
  p.alive = true; p.deadT = 0; p.inv = F.inv; p.x = x; p.z = z; p.aim = a; p.vx = p.vz = 0; p.dashT = 0; p.plate = W.up.plate || 0; p.pw = {};
  if (W.lives <= 0) return;
  W.bolts = []; W.mines = []; W.zones = W.zones.filter((q) => q.style === 'ice');
  W.seeker = null; W.room.t = 0; W.room.seekWarned = 0;
  for (const e of W.robots) {
    if (e.hp <= 0) continue;
    e.aimT = 0; e.lunge = 0; e.boot = Math.max(e.boot, W.R.boot * 0.8); e.fireT = W.R.first + rr(W, 0.5, 1.2);
    const d = hyp(e.x - x, e.z - z);
    if (d < F.clearR && !e.fly) { const q = freeSpot(W, F.clearR + 1, e.r + 0.7, 1.6); if (q) { e.x = q[0]; e.z = q[1]; } }
  }
  const B = W.boss;
  if (B && B.state === 'fight') { B.cur = null; B.cool = 2.0; }
  W.ev.push({ k: 'respawn', pid: p.id, x, z });
}

// ------------------------------------------------------------------ robots
function robot(W, e, dt) {
  const E = ENEMY[e.type], R = W.R;
  e.t += dt;
  if (e.hitT > 0) e.hitT -= dt;
  if (e.boot > 0) { e.boot -= dt; e.vx = e.vz = 0; return; }
  if (e.fly) { drone(W, e, dt); return; }
  const T = nearestPlayer(W, e.x, e.z);
  const walls = W.room.walls;
  const spd = E.v * R.spd * (e.rage ? E.rage || 1.4 : 1);
  if (!T) { e.vx *= 0.9; e.vz *= 0.9; e.x += e.vx * dt; e.z += e.vz * dt; return; }
  const dx = T.x - e.x, dz = T.z - e.z, d = hyp(dx, dz);
  const toA = Math.atan2(dz, dx);
  // ---- telegraphs and firing
  if (e.aimT > 0) {
    e.aimT -= dt;
    if (e.aimT > e.lockT) e.aimA = aimAngle(W, e, T);
    e.vx = e.vz = 0; e.a = e.type === 'aegis' ? e.a : e.aimA;
    if (e.aimT <= 0) {
      if (e.type === 'ripper') { e.lunge = E.lungeT; e.vx = Math.cos(e.aimA) * E.lunge * R.spd; e.vz = Math.sin(e.aimA) * E.lunge * R.spd; W.ev.push({ k: 'lunge', id: e.id, x: e.x, z: e.z, a: e.aimA }); }
      else if (e.type === 'mortar') lobMine(W, e, T);
      else fireBolt(W, e);
      e.fireT = (1 / Math.max(0.05, R.fire * (E.fire || 1) * (e.rage ? 1.5 : 1))) * rr(W, 0.75, 1.3);
      if (e.type === 'ripper') e.fireT = E.rest + E.lungeT;
    }
    if (e.type !== 'ripper' || e.aimT > 0) return;
  }
  if (e.lunge > 0) {
    e.lunge -= dt;
    e.x += e.vx * dt; e.z += e.vz * dt; e.a = e.aimA;
    if (e.lunge <= 0) { e.vx = e.vz = 0; }
    return;
  }
  e.fireT -= dt;
  const canShoot = E.fire > 0 || e.type === 'ripper';
  if (canShoot && e.fireT <= 0 && d < E.range && aimingCount(W) < W.room.cap && (e.type !== 'aegis' || Math.abs(angDiff(e.a, toA)) < 0.5) && (e.type === 'mortar' || los(walls, e.x, e.z, T.x, T.z, 0.12))) {
    e.aimTot = e.aimT = R.warn * Math.max(1, E.tellK); e.lockT = e.aimT * 0.3; e.aimA = aimAngle(W, e, T); e.aimErr = gauss(W) * R.aim;
    // how many bolts this shot will be (the RAMP's burst), decided now so the glint can show the whole fan
    const b = E.single || !(E.fire > 0) || e.type === 'mortar' ? 1 : R.burst || 1;
    e.burstN = Math.floor(b) + (rand(W) < b - Math.floor(b) ? 1 : 0);
    W.ev.push({ k: e.type === 'ripper' ? 'crouch' : 'aim', id: e.id, T: e.aimT, type: e.type });
    e.vx = e.vz = 0;
    return;
  }
  // ---- walking
  e.thinkT -= dt;
  if (e.thinkT <= 0) {
    e.thinkT = rr(W, 0.25, 0.5);
    e.careful = rand(W) < clamp(R.smart + E.smart, 0.02, 0.97) ? 1 : 0;
    let want = null, sp = spd;
    const seen = d < 18 && los(walls, e.x, e.z, T.x, T.z, 0.1);
    switch (e.type) {
      case 'sentry': want = seen && d < 9 ? (rand(W) < 0.5 ? null : toA + (rand(W) < 0.5 ? 1 : -1) * Math.PI / 2) : toA; sp = seen && d < 9 ? spd * 0.5 : spd; break;
      case 'patroller':
        if (e.mode === 'patrol') {
          if (seen && d < E.sight) { e.mode = 'hunt'; W.ev.push({ k: 'spot', id: e.id }); want = toA; }
          else { want = e.pax ? (e.pdir > 0 ? 0 : Math.PI) : (e.pdir > 0 ? Math.PI / 2 : -Math.PI / 2); sp = spd * 0.7; e.careful = 1; if (!dirFree(W, e, want, 1.4)) { e.pdir = -e.pdir; want += Math.PI; } }
        } else want = seen && d < 6 ? toA + e.strafe * Math.PI / 2 : toA;
        break;
      case 'marksman': {
        const [k0, k1] = E.keep;
        if (d < k0) want = toA + Math.PI; else if (d > k1 || !seen) want = toA; else { want = toA + e.strafe * Math.PI / 2; sp = spd * 0.6; if (rand(W) < 0.3) e.strafe = -e.strafe; }
        break;
      }
      case 'aegis': want = d > 4.5 ? e.a : null; break;
      case 'mortar': want = d < 7 ? toA + Math.PI : d > 13 || !seen ? toA : null; sp = spd; break;
      case 'ripper': want = toA; break;
      case 'twin': {
        const P = e.pair ? W.robots.find((o) => o.id === e.pair && o.hp > 0) : null;
        if (!P && e.pair) { e.pair = 0; if (!e.rage) { e.rage = 1; W.ev.push({ k: 'rage', id: e.id, x: e.x, z: e.z }); } }
        if (P && !e.lead) { const gx = P.x + e.ox - e.x, gz = P.z + e.oz - e.z; want = hyp(gx, gz) > 0.15 ? Math.atan2(gz, gx) : null; sp = spd * 1.25; e.careful = 1; }
        else want = seen && d < 8 && !e.rage ? (rand(W) < 0.5 ? null : toA + e.strafe * Math.PI / 2) : toA;
        break;
      }
    }
    if (want !== null && E.grid) want = Math.round(want / (Math.PI / 4)) * (Math.PI / 4);
    if (want !== null && e.careful) want = chooseDir(W, e, want, !!E.grid);
    e.moving = want === null ? 0 : 1; e.dirA = want ?? e.dirA; e.sp = sp;
  }
  if (e.type === 'aegis') { const da = angDiff(e.a, toA), mt = E.turn * dt; e.a += clamp(da, -mt, mt); }
  if (e.moving) {
    const sp = e.sp || spd;
    e.vx = Math.cos(e.dirA) * sp; e.vz = Math.sin(e.dirA) * sp;
    if (e.type !== 'aegis') e.a = e.dirA;
  } else { e.vx = e.vz = 0; if (e.type !== 'aegis') e.a = toA; }
  e.x += e.vx * dt; e.z += e.vz * dt;
}
function aimingCount(W) { let n = 0; for (const e of W.robots) if (e.hp > 0 && e.aimT > 0) n++; return n; }
function aimAngle(W, e, T) {
  const E = ENEMY[e.type];
  const lead = Math.max(W.R.lead, E.lead ? Math.min(1, E.lead + W.R.lead * 0.3) : 0);
  const v = W.R.boltV * E.boltK;
  const dx = T.x - e.x, dz = T.z - e.z, d = hyp(dx, dz), tt = e.type === 'mortar' ? E.flight : e.type === 'ripper' ? 0.25 : d / v;
  const ax = dx + T.vx * tt * lead, az = dz + T.vz * tt * lead;
  return Math.atan2(az, ax) + (e.aimErr || 0);
}
function dirFree(W, e, a, dist) {
  const c = Math.cos(a), s = Math.sin(a), walls = W.room.walls;
  for (const k of [0.3, 0.65, 1]) { const x = e.x + c * dist * k, z = e.z + s * dist * k; if (wallNear(walls, x, z, e.r + 0.22)) return false; }
  const fx = e.x + c * 0.9, fz = e.z + s * 0.9;
  for (const o of W.robots) if (o !== e && o.hp > 0 && !o.fly && o.id !== e.pair && hyp(o.x - fx, o.z - fz) < o.r + e.r + 0.25) return false;
  return true;
}
function chooseDir(W, e, want, grid) {
  const st = grid ? Math.PI / 4 : Math.PI / 6;
  const sgn = e.strafe;
  for (const k of [0, 1, -1, 2, -2, 3, -3]) { const a = want + k * sgn * st; if (dirFree(W, e, a, 1.25)) return a; }
  return null;
}
function fireBolt(W, e) {
  const E = ENEMY[e.type], v = W.R.boltV * E.boltK * (e.rage ? 1.1 : 1);
  // the RAMP's burst: extra bolts fanned either side of the aim line (marksmen fire one precise bolt)
  const n = e.burstN || 1;
  for (let i = 0; i < n; i++) {
    const a = e.aimA + (i === 0 ? 0 : (i % 2 ? 1 : -1) * Math.ceil(i / 2) * BURST_A), c = Math.cos(a), s = Math.sin(a);
    W.bolts.push({ id: W.nextId++, x: e.x + c * (e.r + 0.25), z: e.z + s * (e.r + 0.25), vx: c * v, vz: s * v, r: 0.16, life: 4, from: e.id, big: 0, n0: W.n });
  }
  W.stats.bolts++;
  W.ev.push({ k: 'rfire', id: e.id, x: e.x, z: e.z, a: e.aimA, type: e.type, n });
}
function lobMine(W, e, T) {
  const E = ENEMY.mortar, lead = W.R.lead, err = (e.aimErr || 0) * 6;
  const tx = clamp(T.x + T.vx * E.flight * lead + err, -RW + 0.5, RW - 0.5), tz = clamp(T.z + T.vz * E.flight * lead - err * 0.5, -RH + 0.5, RH - 0.5);
  const m = { id: W.nextId++, x: e.x, z: e.z, sx: e.x, sz: e.z, tx, tz, t: 0, T: Math.max(0.7, W.R.warn * E.flight), state: 'fly', fuse: 0, life: E.mineLife, from: e.id };
  W.mines.push(m);
  W.ev.push({ k: 'mortar', id: e.id, x: e.x, z: e.z, tx, tz, T: m.T });
}
function drone(W, e, dt) {
  const E = ENEMY.drone, T = nearestPlayer(W, e.x, e.z);
  e.life -= dt;
  if (e.life <= 0) { e.hp = 0; W.ev.push({ k: 'kill', id: e.id, type: e.type, x: e.x, z: e.z, by: 'expire', pts: 0 }); return; }
  if (T) {
    const want = Math.atan2(T.z - e.z, T.x - e.x), da = angDiff(e.a, want), mt = E.turn * dt;
    e.a += clamp(da, -mt, mt);
  }
  const sp = E.v * W.R.spd;
  e.vx = Math.cos(e.a) * sp; e.vz = Math.sin(e.a) * sp;
  e.x = clamp(e.x + e.vx * dt, -RW + 0.4, RW - 0.4); e.z = clamp(e.z + e.vz * dt, -RH + 0.4, RH - 0.4);
}
// robots die on the walls and when they run into each other
function robotContacts(W) {
  const walls = W.room.walls, list = W.robots;
  for (const e of list) {
    if (e.hp <= 0 || e.fly) continue;
    const nw = nearestWall(walls, e.x, e.z);
    if (nw.w && nw.d < e.r) { kill(W, e, 'wall'); W.ev.push({ k: 'zapwall', x: clamp(e.x, nw.w[0], nw.w[2]), z: clamp(e.z, nw.w[1], nw.w[3]) }); continue; }
    if (nw.w && nw.d < e.r + F.brush && (e.moving || e.lunge > 0)) { e.brT -= STEP; if (e.brT <= 0) { e.brT = 0.14; W.ev.push({ k: 'brush', x: clamp(e.x, nw.w[0], nw.w[2]), z: clamp(e.z, nw.w[1], nw.w[3]) }); } }
    if (Math.abs(e.x) > RW + 1 || Math.abs(e.z) > RH + 1) { kill(W, e, 'wall'); continue; }
  }
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (a.hp <= 0 || a.fly || a.boot > 0) continue;
    for (let j = i + 1; j < list.length; j++) {
      const b = list[j];
      if (b.hp <= 0 || b.fly) continue;
      if (hyp(a.x - b.x, a.z - b.z) < a.r + b.r - 0.05) { kill(W, a, 'crash'); kill(W, b, 'crash'); break; }
    }
  }
  const B = W.boss;
  if (B && B.state !== 'dying') for (const e of list) if (e.hp > 0 && !e.fly && e.boot <= 0 && hyp(e.x - B.x, e.z - B.z) < e.r + B.r - 0.2) kill(W, e, 'crash');
}
export function kill(W, e, by, pid = 0) {
  if (e.hp <= 0 && e.dead) return;
  e.hp = 0; e.dead = 1;
  const E = ENEMY[e.type];
  const pts = by === 'expire' ? 0 : E.score;
  if (pts) addScore(W, pts);
  W.stats.kills++;
  W.stats.killedBy[by] = (W.stats.killedBy[by] || 0) + 1;
  if (by === 'wall' || by === 'crash' || by === 'bolt' || by === 'mine') W.stats.lured++;
  W.ev.push({ k: 'kill', id: e.id, type: e.type, x: e.x, z: e.z, by, pid, pts: Math.round(pts * D_OF(W).score), a: e.a });
  if (e.type !== 'drone' && W.pickups.length < DROP.max && rand(W) < W.R.drops * (E.hp > 1 ? DROP.big : 1)) {
    let tot = 0; for (const k of PW_KEYS) tot += POWERUPS[k].w;
    let x = rand(W) * tot, kind = PW_KEYS[0];
    for (const k of PW_KEYS) { x -= POWERUPS[k].w; if (x <= 0) { kind = k; break; } }
    if (!wallNear(W.room.walls, e.x, e.z, 0.9)) { W.pickups.push({ id: W.nextId++, kind, x: e.x, z: e.z, life: DROP.life, t: 0 }); W.ev.push({ k: 'drop', kind, x: e.x, z: e.z }); }
  }
}

// ------------------------------------------------------------------ the Seeker
function seeker(W, dt) {
  const room = W.room;
  if (room.boss) return;
  const delay = W.R.seek + 4 * (W.up.jammer || 0);
  let S = W.seeker;
  if (!S) {
    if (!room.seekWarned && room.t >= delay - SEEKER.warnT) { room.seekWarned = 1; W.ev.push({ k: 'seekerwarn' }); tut(W, 'seeker'); }
    if (room.t < delay || !alive(W).length) return;
    let [x, z] = entryPoint(room.entry);
    const T = nearestPlayer(W, x, z);
    if (T && hyp(T.x - x, T.z - z) < 6) { x = -Math.sign(T.x || 1) * (RW - 1); z = -Math.sign(T.z || 1) * (RH - 1); }
    const v = Math.min(F.speed * SEEKER.maxK, W.R.seekV * (1 + SEEKER.returnK * W.seekerN));
    S = W.seeker = { x, z, vx: 0, vz: 0, a: T ? Math.atan2(T.z - z, T.x - x) : 0, inT: SEEKER.inT, t: 0, v, n: W.seekerN };
    W.seekerN++;
    W.ev.push({ k: 'seeker', x, z, n: S.n });
    return;
  }
  S.t += dt;
  if (S.inT > 0) { S.inT -= dt; return; }
  const T = nearestPlayer(W, S.x, S.z);
  if (!T) { S.vx *= 0.95; S.vz *= 0.95; }
  else {
    const want = Math.atan2(T.z - S.z, T.x - S.x), da = angDiff(S.a, want), mt = SEEKER.turn * dt;
    S.a += clamp(da, -mt, mt);
    const wob = Math.sin(S.t * 2.3) * 0.25;
    S.vx = Math.cos(S.a + wob) * S.v; S.vz = Math.sin(S.a + wob) * S.v;
  }
  S.x += S.vx * dt; S.z += S.vz * dt;
}

// ------------------------------------------------------------------ shots, bolts, mines, zones, pickups
function shots(W, dt) {
  const walls = W.room.walls, B = W.boss, S = W.seeker;
  for (const s of W.shots) {
    s.life -= dt;
    if (s.life <= 0) { s.dead = 1; continue; }
    for (let sub = 0; sub < 2 && !s.dead; sub++) {
      const px = s.x, pz = s.z;
      s.x += s.vx * dt * 0.5; s.z += s.vz * dt * 0.5;
      const w = wallNear(walls, s.x, s.z, F.shotR);
      if (w) {
        if (s.bounce > 0) {
          s.bounce--;
          const inX = px > w[0] - F.shotR && px < w[2] + F.shotR, inZ = pz > w[1] - F.shotR && pz < w[3] + F.shotR;
          if (inX && !inZ) s.vz = -s.vz; else if (inZ && !inX) s.vx = -s.vx; else { s.vx = -s.vx; s.vz = -s.vz; }
          s.x = px; s.z = pz;
          W.ev.push({ k: 'ricochet', x: s.x, z: s.z });
        } else { s.dead = 1; W.ev.push({ k: 'shotwall', x: s.x, z: s.z, a: Math.atan2(s.vz, s.vx) }); break; }
      }
      if (s.ghost) continue;
      for (const e of W.robots) {
        if (e.hp <= 0 || hyp(e.x - s.x, e.z - s.z) > e.r + F.shotR) continue;
        if (e.type === 'aegis' && e.boot <= 0) {
          const ha = Math.atan2(s.z - e.z, s.x - e.x);
          if (Math.abs(angDiff(e.a, ha)) < ENEMY.aegis.arc) { s.dead = 1; W.ev.push({ k: 'block', x: s.x, z: s.z, id: e.id }); break; }
        }
        s.dead = 1; W.stats.hits++;
        e.hp--; e.hitT = 0.15;
        if (e.hp <= 0) kill(W, e, 'shot', s.pid); else W.ev.push({ k: 'rhit', id: e.id, x: s.x, z: s.z });
        break;
      }
      if (s.dead) break;
      for (const m of W.mines) if (m.state !== 'fly' && hyp(m.x - s.x, m.z - s.z) < 0.5) { s.dead = 1; boom(W, m); break; }
      if (s.dead) break;
      if (B && shotBoss(W, B, s)) { s.dead = 1; break; }
      if (S && S.inT <= 0 && hyp(S.x - s.x, S.z - s.z) < SEEKER.r) { s.dead = 1; W.ev.push({ k: 'seekerhit', x: s.x, z: s.z }); break; }
    }
  }
  W.shots = W.shots.filter((s) => !s.dead);
}
function bolts(W, dt) {
  const walls = W.room.walls;
  for (const b of W.bolts) {
    b.life -= dt;
    b.x += b.vx * dt; b.z += b.vz * dt;
    if (b.life <= 0) { b.dead = 1; continue; }
    if (wallNear(walls, b.x, b.z, b.r * 0.6)) { b.dead = 1; W.ev.push({ k: 'boltwall', x: b.x, z: b.z }); continue; }
    if (Math.abs(b.x) > RW + 2 || Math.abs(b.z) > RH + 2) { b.dead = 1; continue; }
    for (const e of W.robots) {
      if (e.hp <= 0 || e.id === b.from || e.fly || hyp(e.x - b.x, e.z - b.z) > e.r + b.r) continue;
      b.dead = 1; kill(W, e, 'bolt'); break;
    }
  }
  W.bolts = W.bolts.filter((b) => !b.dead);
}
function mines(W, dt) {
  const E = ENEMY.mortar;
  for (const m of W.mines) {
    m.t += dt;
    if (m.state === 'fly') {
      const f = Math.min(1, m.t / m.T);
      m.x = m.sx + (m.tx - m.sx) * f; m.z = m.sz + (m.tz - m.sz) * f;
      if (f >= 1) {
        m.state = 'armed'; m.t = 0;
        W.ev.push({ k: 'mineland', x: m.x, z: m.z });
        if (wallNear(W.room.walls, m.x, m.z, 0.3)) { boom(W, m); continue; }
        // landing right on someone sets it off at once
        for (const p of W.players) if (p.alive && hyp(p.x - m.x, p.z - m.z) < E.sense * 0.75) { m.state = 'fuse'; m.fuse = 0.12; }
      }
      continue;
    }
    if (m.state === 'armed') {
      m.life -= dt;
      let trip = m.life <= 0;
      for (const p of W.players) if (p.alive && hyp(p.x - m.x, p.z - m.z) < E.sense) trip = true;
      for (const e of W.robots) if (e.hp > 0 && !e.fly && e.id !== m.from && hyp(e.x - m.x, e.z - m.z) < E.sense * 0.8) trip = true;
      if (trip) { m.state = 'fuse'; m.fuse = E.fuse; W.ev.push({ k: 'minebeep', x: m.x, z: m.z }); }
    } else if (m.state === 'fuse') { m.fuse -= dt; if (m.fuse <= 0) boom(W, m); }
  }
  W.mines = W.mines.filter((m) => !m.gone);
}
function boom(W, m) {
  if (m.gone) return;
  m.gone = 1;
  const R = ENEMY.mortar.mineR;
  W.ev.push({ k: 'mineboom', x: m.x, z: m.z, r: R });
  for (const p of W.players) if (p.alive && hyp(p.x - m.x, p.z - m.z) < R + F.r * 0.5) zap(W, p, 'mine', m.x, m.z);
  for (const e of W.robots) if (e.hp > 0 && !e.fly && hyp(e.x - m.x, e.z - m.z) < R + e.r * 0.5) kill(W, e, 'mine');
  for (const o of W.mines) if (!o.gone && o.state !== 'fly' && hyp(o.x - m.x, o.z - m.z) < R) { o.state = 'fuse'; o.fuse = Math.min(o.fuse || 0.15, 0.15); }
}
export function inZone(z, x, zz, pad) {
  if (z.shape === 'circle') return hyp(x - z.x, zz - z.z) < z.r + pad;
  // rect lane from (ax, az) to (bx, bz), half-width w/2
  const dx = z.bx - z.ax, dz = z.bz - z.az, L = hyp(dx, dz) || 1, ux = dx / L, uz = dz / L;
  const px = x - z.ax, pz = zz - z.az, along = px * ux + pz * uz, side = Math.abs(-px * uz + pz * ux);
  return along > -pad && along < L + pad && side < z.w / 2 + pad;
}
function zones(W, dt) {
  for (const z of W.zones) {
    z.t += dt;
    const live = z.t >= z.T && z.t < z.T + z.D;
    if (z.deadly && z.style !== 'stomp' && z.style !== 'slam' && z.t >= z.T && z.t - dt < z.T) W.ev.push({ k: 'zone', style: z.style, x: z.shape === 'circle' ? z.x : (z.ax + z.bx) / 2, z: z.shape === 'circle' ? z.z : (z.az + z.bz) / 2, r: z.r || z.w });
    if (live && z.deadly) for (const p of W.players) if (p.alive && inZone(z, p.x, p.z, F.r * 0.6)) zap(W, p, z.style, z.x ?? z.ax, z.z ?? z.az);
    if (live && z.deadly && z.style !== 'lane') for (const e of W.robots) if (e.hp > 0 && !e.fly && e.boot <= 0 && inZone(z, e.x, e.z, 0) && z.t - dt < z.T + 0.02) kill(W, e, 'mine');
    if (z.t >= z.T + z.D) {
      z.gone = 1;
      if (z.style === 'frost') W.zones.push({ id: W.nextId++, shape: 'circle', x: z.x, z: z.z, r: z.r * 1.1, t: 0, T: 0, D: ATTACK.frost.slow, style: 'ice', deadly: 0 });
    }
  }
  W.zones = W.zones.filter((z) => !z.gone);
}
function pickups(W, dt) {
  for (const q of W.pickups) {
    q.life -= dt; q.t += dt;
    if (q.life <= 0) { q.gone = 1; continue; }
    for (const p of W.players) {
      if (!p.alive || p.remote || hyp(p.x - q.x, p.z - q.z) > DROP.r + F.r) continue;
      q.gone = 1;
      const P = POWERUPS[q.kind];
      if (q.kind === 'overshield') p.shield = 1;
      else if (q.kind === 'emp') p.emp = Math.min(empMax(W.up) + 1, p.emp + 1);
      else p.pw[q.kind] = P.time;
      W.ev.push({ k: 'pickup', pid: p.id, kind: q.kind, x: q.x, z: q.z });
      break;
    }
  }
  W.pickups = W.pickups.filter((q) => !q.gone);
}
function playerContacts(W) {
  const S = W.seeker, B = W.boss;
  for (const p of W.players) {
    if (!p.alive || p.remote) continue;
    for (const b of W.bolts) if (!b.dead && hyp(b.x - p.x, b.z - p.z) < b.r + F.r * 0.85) { if (p.dashT <= 0 && p.inv <= 0) b.dead = 1; if (zap(W, p, 'bolt', b.x, b.z, null, b.from)) break; }
    if (!p.alive) continue;
    for (const e of W.robots) if (e.hp > 0 && e.boot <= 0 && hyp(e.x - p.x, e.z - p.z) < e.r + F.r * 0.9) { const hit = p.inv <= 0; if (zap(W, p, 'robot', e.x, e.z) || hit) kill(W, e, 'crash', p.id); break; }
    if (!p.alive) continue;
    if (S && S.inT <= 0 && hyp(S.x - p.x, S.z - p.z) < SEEKER.r + F.r * 0.8) zap(W, p, 'seeker', S.x, S.z);
    if (!p.alive) continue;
    if (B && (B.state === 'fight') && hyp(B.x - p.x, B.z - p.z) < B.r + F.r * 0.8) zap(W, p, 'boss', B.x, B.z);
    if (!p.alive) continue;
    if (B && B.cur && B.cur.kind === 'sweep' && B.cur.t >= B.cur.T) {
      const a = B.cur.beam, L = beamLen(W, B, a), ex = B.x + Math.cos(a) * L, ez = B.z + Math.sin(a) * L;
      if (segPoint(B.x, B.z, ex, ez, p.x, p.z) < ATTACK.sweep.w + F.r * 0.7) zap(W, p, 'beam', p.x, p.z);
    }
  }
  W.bolts = W.bolts.filter((b) => !b.dead);
}
// the sweep beam stops at the first pillar: stand behind one
export function beamLen(W, B, a) {
  const ux = Math.cos(a), uz = Math.sin(a);
  let best = ATTACK.sweep.len;
  for (const w of W.room.walls) {
    if (w[4] !== WK.PILLAR) continue;
    let t0 = 0, t1 = best;
    if (Math.abs(ux) < 1e-9) { if (B.x < w[0] || B.x > w[2]) continue; } else { let p = (w[0] - B.x) / ux, q = (w[2] - B.x) / ux; if (p > q) { const r = p; p = q; q = r; } if (p > t0) t0 = p; if (q < t1) t1 = q; if (t0 > t1) continue; }
    if (Math.abs(uz) < 1e-9) { if (B.z < w[1] || B.z > w[3]) continue; } else { let p = (w[1] - B.z) / uz, q = (w[3] - B.z) / uz; if (p > q) { const r = p; p = q; q = r; } if (p > t0) t0 = p; if (q < t1) t1 = q; if (t0 > t1) continue; }
    if (t0 < best) best = t0;
  }
  return best;
}
function segPoint(ax, az, bx, bz, px, pz) {
  const dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz || 1;
  const t = clamp(((px - ax) * dx + (pz - az) * dz) / l2, 0, 1);
  return hyp(px - (ax + dx * t), pz - (az + dz * t));
}

// ------------------------------------------------------------------ doors, the lift
function checkExit(W) {
  if (W.phase !== 'play') return;
  const d = W.room.doors;
  for (const p of W.players) {
    if (!p.alive) continue;
    let side = null;
    // only through the door gap itself
    const inX = Math.abs(p.z) < DOOR / 2, inZ = Math.abs(p.x) < DOOR / 2;
    if (p.x > RW + 0.35 && d.e === 1 && inX) side = 'e'; else if (p.x < -RW - 0.35 && d.w === 1 && inX) side = 'w';
    else if (p.z > RH + 0.35 && d.s === 1 && inZ) side = 's'; else if (p.z < -RH - 0.35 && d.n === 1 && inZ) side = 'n';
    if (!side) continue;
    leave(W, side);
    return;
  }
}
function leave(W, side) {
  W.phase = 'transit'; W.phaseT = 0.55; W.exitSide = side;
  if (!W.room.cleared && W.room.total > 0) W.stats.skipped++;
  const [dx, dy] = DELTA[side];
  for (const p of W.players) if (p.alive) { const s = Math.max(3, hyp(p.vx, p.vz)); p.vx = dx * s; p.vz = dy * s; }
  W.bolts = []; W.mines = [];
  W.ev.push({ k: 'roomexit', side, cleared: W.room.cleared });
}
function lift(W, dt) {
  const room = W.room;
  if (!room.liftOn || W.phase !== 'play') return;
  const on = alive(W);
  if (on.length && on.every((p) => hyp(p.x, p.z) < F.liftR)) room.liftT += dt; else room.liftT = 0;
  if (room.liftT >= F.liftHold) {
    W.phase = 'liftup'; W.phaseT = 2.6;
    for (const p of W.players) { p.vx = p.vz = 0; }
    W.ev.push({ k: 'liftup' });
  }
}
function finishLift(W) {
  addScore(W, SCORE.sector);
  if (W.mode === 'campaign') { W.over = true; W.result = 'clear'; W.ev.push({ k: 'sectorclear', sector: W.sector }); return; }
  // ENDLESS: the next floor, with a free upgrade
  W.floor++; W.k = W.floor % 5;
  // armour plates come last: they soak bolts, so an early plate would make the next floors easier, not harder
  const order = ['weapon', 'dash', 'emp', 'plate', 'jammer'];
  for (let i = 0; i < order.length * 3; i++) {
    const k = order[(W.floor - 1 + i) % order.length];
    if ((W.up[k] || 0) < UPGRADES[k].max) { W.up[k] = (W.up[k] || 0) + 1; W.ev.push({ k: 'upgrade', up: k, lv: W.up[k] }); break; }
  }
  for (const p of W.players) p.emp = Math.max(p.emp, empStart(W.up));
  buildGrid(W);
  W.ev.push({ k: 'floor', floor: W.floor });
  enterRoom(W, W.grid.sx, W.grid.sy, W.grid.sSide, true);
}

// ------------------------------------------------------------------ bosses
function startBoss(W) {
  const key = bossKeyOf(W), D = BOSSES[key], R = W.R;
  const [ex, ez] = entryPoint(W.room.entry);
  const bx = -Math.sign(ex) * (RW * 0.45), bz = -Math.sign(ez) * (RH * 0.4);
  const B = { key, x: bx, z: bz, vx: 0, vz: 0, a: Math.atan2(ez - bz, ex - bx), hp: R.bossHP, max: R.bossHP, r: D.r, state: 'in', st: 2.4, phase: 0, ai: 0, cur: null, cool: 1.0,
    hitT: 0, stun: 0, t: 0, spin: 0, heads: [], plates: D.plates || 0, fly: D.fly ? 1 : 0 };
  if (D.heads) for (let i = 0; i < D.heads; i++) { const hp = Math.round(D.headHP * (R.bossHP / 150)); B.heads.push({ i, a: (i / D.heads) * TAU, hp: Math.max(4, hp), max: Math.max(4, hp), x: bx, z: bz, aimT: 0 }); }
  W.boss = B;
  W.room.total = 0;
  W.ev.push({ k: 'bossin', key, x: bx, z: bz });
  updateHeads(B);
}
function updateHeads(B) {
  const R = B.r + 1.0;
  for (const h of B.heads) { const a = h.a + B.spin * 0.6; h.x = B.x + Math.cos(a) * R; h.z = B.z + Math.sin(a) * R; }
}
function phaseOf(B) {
  const D = BOSSES[B.key], f = B.hp / B.max;
  let ph = 0;
  D.phases.forEach((th, i) => { if (f <= th + 1e-9) ph = i; });
  return ph;
}
function boss(W, B, dt) {
  const D = BOSSES[B.key], R = W.R;
  B.t += dt; B.spin += dt * (0.8 + 0.25 * B.phase);
  if (B.hitT > 0) B.hitT -= dt;
  if (B.stun > 0) B.stun -= dt;
  updateHeads(B);
  if (B.state === 'in') { B.st -= dt; if (B.st <= 0) { B.state = 'fight'; W.ev.push({ k: 'bossgo', key: B.key }); } return; }
  if (B.state === 'dying') {
    B.st -= dt;
    if (B.st <= 0) {
      W.boss = null; W.room.liftOn = 1;
      for (const e of W.robots) if (e.hp > 0) kill(W, e, 'emp');
      W.bolts = []; W.mines = []; W.zones = [];
      W.ev.push({ k: 'lift' });
    }
    return;
  }
  const ph = phaseOf(B);
  if (ph > B.phase) {
    B.phase = ph; B.cur = null; B.cool = 1.3; B.ai = 0;
    W.zones = W.zones.filter((z) => z.style === 'ice');
    if (B.key === 'overseer') B.plates = [D.plates, D.plates - 1, 0][ph] ?? 0;
    W.ev.push({ k: 'bossphase', phase: ph, key: B.key, x: B.x, z: B.z });
  }
  const T = nearestPlayer(W, B.x, B.z);
  if (!T) { B.vx = B.vz = 0; return; }
  const toA = Math.atan2(T.z - B.z, T.x - B.x), d = hyp(T.x - B.x, T.z - B.z);
  const C = B.cur;
  // facing
  if (!C || C.kind !== 'charge' || C.t < C.T) { const da = angDiff(B.a, C && C.kind === 'sweep' && C.t >= C.T ? C.beam : toA), mt = (C && C.t < C.T ? 2.2 : 1.6) * dt; B.a += clamp(da, -mt, mt); }
  // walking
  const busy = C && (C.kind === 'stomp' || C.kind === 'slam' || C.kind === 'sweep' || (C.kind === 'charge'));
  if (!busy && D.v > 0 && B.stun <= 0) {
    const keep = D.keep || 7;
    let want = d > keep + 1 ? toA : d < keep - 1.5 ? toA + Math.PI : toA + Math.PI / 2;
    const sp = D.v * R.spd * (1 + 0.15 * B.phase) * (d > keep - 1.5 && d < keep + 1 ? 0.5 : 1);
    B.vx += (Math.cos(want) * sp - B.vx) * Math.min(1, dt * 2); B.vz += (Math.sin(want) * sp - B.vz) * Math.min(1, dt * 2);
  } else if (!C || C.kind !== 'charge') { B.vx *= 0.9; B.vz *= 0.9; }
  if (!C || C.kind !== 'charge' || C.t < C.T) { B.x += B.vx * dt; B.z += B.vz * dt; }
  B.x = clamp(B.x, -RW + B.r + 0.3, RW - B.r - 0.3); B.z = clamp(B.z, -RH + B.r + 0.3, RH - B.r - 0.3);
  if (!B.fly) for (const w of W.room.walls) if (w[4] === WK.PILLAR) {
    const dd = wallDist(B.x, B.z, w);
    if (dd < B.r + 0.2) { const q = pushOut(w, B.x, B.z, B.r + 0.1); B.x = q[0]; B.z = q[1]; }
  }
  // attacks
  if (!C) {
    B.cool -= dt * R.bossRate * (1 + 0.18 * B.phase);
    if (B.cool <= 0 && B.stun <= 0) {
      const list = D.atk[Math.min(B.phase, D.atk.length - 1)];
      beginAttack(W, B, list[B.ai++ % list.length], T);
    }
    return;
  }
  act(W, B, C, T, dt);
}
function leadPoint(W, T, k) { return [clamp(T.x + T.vx * k, -RW + 0.6, RW - 0.6), clamp(T.z + T.vz * k, -RH + 0.6, RH - 0.6)]; }
// a boss's own take on a shared attack (BOSSES[key].mod overrides ATTACK numbers), merged once
const ATK_CACHE = new Map();
export function atkOf(key, kind) {
  const id = key + ':' + kind;
  let A = ATK_CACHE.get(id);
  if (!A) { A = { ...ATTACK[kind], ...((BOSSES[key] && BOSSES[key].mod && BOSSES[key].mod[kind]) || {}) }; ATK_CACHE.set(id, A); }
  return A;
}
function beginAttack(W, B, kind, T) {
  const A = atkOf(B.key, kind), R = W.R, ph = B.phase;
  const tell = Math.max(R.warn, R.warn * A.tellK * (ph ? 0.92 : 1));   // never shorter than the RAMP warn
  const C = B.cur = { kind, t: 0, T: tell, D: A.act, a: Math.atan2(T.z - B.z, T.x - B.x), fired: 0, emitT: 0, n: 0, beam: 0, sgn: rand(W) < 0.5 ? -1 : 1 };
  const style = W.k === 2 ? 'molten' : W.k === 1 ? 'frost' : W.k === 4 ? 'plasma' : W.k === 3 ? 'data' : 'shock';
  switch (kind) {
    case 'stomp': W.zones.push({ id: W.nextId++, shape: 'circle', x: B.x, z: B.z, r: A.r * (1 + 0.12 * ph), t: 0, T: tell, D: A.act, style: 'stomp', deadly: 1, boss: 1 }); break;
    case 'slam': {
      const [px, pz] = leadPoint(W, T, tell * 0.4 * R.lead);
      const a = Math.atan2(pz - B.z, px - B.x), n = A.n + (ph ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * A.w * (A.gap || 1.55), ox = -Math.sin(a) * off, oz = Math.cos(a) * off;
        const cx = px + ox, cz = pz + oz, ux = Math.cos(a), uz = Math.sin(a);
        W.zones.push({ id: W.nextId++, shape: 'rect', ax: cx - ux * A.len / 2, az: cz - uz * A.len / 2, bx: cx + ux * A.len / 2, bz: cz + uz * A.len / 2, w: A.w, t: 0, T: tell + i * 0.18, D: A.act, style: 'slam', deadly: 1 });
      }
      break;
    }
    case 'pools': case 'frost': case 'storm': {
      const n = A.n + ph;
      const [px, pz] = leadPoint(W, T, tell * 0.5 * R.lead);
      for (let i = 0; i < n; i++) {
        const q = i === 0 ? [px, pz] : [clamp(px + rr(W, -5, 5), -RW + 1, RW - 1), clamp(pz + rr(W, -4, 4), -RH + 1, RH - 1)];
        W.zones.push({ id: W.nextId++, shape: 'circle', x: q[0], z: q[1], r: A.r * rr(W, 0.85, 1.15), t: 0, T: tell + (kind === 'storm' ? i * 0.12 : 0), D: A.act, style: kind === 'pools' ? style : kind, deadly: 1 });
      }
      break;
    }
    case 'charge': {
      const [px, pz] = leadPoint(W, T, 0);
      const a = Math.atan2(pz - B.z, px - B.x), ux = Math.cos(a), uz = Math.sin(a);
      // run until the room edge
      let L = 40;
      if (ux > 1e-6) L = Math.min(L, (RW - B.r - 0.3 - B.x) / ux); if (ux < -1e-6) L = Math.min(L, (-RW + B.r + 0.3 - B.x) / ux);
      if (uz > 1e-6) L = Math.min(L, (RH - B.r - 0.3 - B.z) / uz); if (uz < -1e-6) L = Math.min(L, (-RH + B.r + 0.3 - B.z) / uz);
      L = Math.max(2, L);
      C.a = a; C.L = L; C.sx = B.x; C.sz = B.z; C.D = L / A.v + 0.4;
      W.zones.push({ id: W.nextId++, shape: 'rect', ax: B.x, az: B.z, bx: B.x + ux * L, bz: B.z + uz * L, w: A.w * 1.6, t: 0, T: tell, D: C.D, style: 'lane', deadly: 0 });
      break;
    }
    case 'sweep': C.a0 = Math.atan2(T.z - B.z, T.x - B.x) - C.sgn * A.arc * 0.5; C.beam = C.a0; break;
    default: break;
  }
  W.ev.push({ k: 'bossatk', kind, T: tell, key: B.key, x: B.x, z: B.z });
}
function bossBolt(W, B, a, v, big = 0, sx, sz) {
  const c = Math.cos(a), s = Math.sin(a), r0 = B.r * 0.8;
  W.bolts.push({ id: W.nextId++, x: (sx ?? B.x) + c * (sx === undefined ? r0 : 0.5), z: (sz ?? B.z) + s * (sx === undefined ? r0 : 0.5), vx: c * v, vz: s * v, r: big ? 0.3 : 0.18, life: 5, from: -1, big, n0: W.n });
}
// the sources bolts come from: the heads while they live, otherwise the boss itself
function sources(B) { const h = B.heads.filter((q) => q.hp > 0); return h.length ? h : [B]; }
function act(W, B, C, T, dt) {
  const A = atkOf(B.key, C.kind), R = W.R, ph = B.phase;
  C.t += dt;
  if (C.t < C.T) {
    // volleys and sprays track you, then lock on where you were for the last part of the tell (like a robot's aim glint)
    if ((C.kind === 'volley' || C.kind === 'spray') && C.t < C.T * (1 - (A.lock || 0))) { C.a = Math.atan2(T.z - B.z, T.x - B.x); C.px = T.x; C.pz = T.z; }
    if (C.kind === 'sweep') { C.a0 = Math.atan2(T.z - B.z, T.x - B.x) - C.sgn * A.arc * 0.5; C.beam = C.a0; }
    return;
  }
  const at = C.t - C.T;
  switch (C.kind) {
    case 'volley': {
      const waves = A.waves + (ph >= 2 ? 1 : 0);
      while (C.fired < waves && at >= C.fired * 0.28) {
        for (const S of sources(B)) {
          const n = A.n + ph * (A.nPh ?? 2), sx = S === B ? undefined : S.x, sz = S === B ? undefined : S.z;
          const tx = C.px ?? T.x, tz = C.pz ?? T.z;
          const base = Math.atan2(tz - (sz ?? B.z), tx - (sx ?? B.x)) + (C.fired % 2 ? A.fan / (n - 1) / 2 : 0);
          for (let i = 0; i < n; i++) bossBolt(W, B, base + (i / (n - 1) - 0.5) * A.fan, R.boltV * A.v, 0, sx, sz);
          if (S !== B) break;
        }
        C.fired++;
        W.ev.push({ k: 'bossfire', x: B.x, z: B.z });
      }
      break;
    }
    case 'spiral': {
      C.emitT -= dt; C.spin = (C.spin || C.a) + A.turn * C.sgn * dt;
      while (C.emitT <= 0) {
        C.emitT += A.every / (1 + 0.2 * ph);
        const S = sources(B), arms = A.arms + (ph >= 1 ? 1 : 0);
        for (let k = 0; k < arms; k++) { const src = S[k % S.length]; bossBolt(W, B, C.spin + (k / arms) * TAU, R.boltV * A.v, 0, src === B ? undefined : src.x, src === B ? undefined : src.z); }
        if (C.n++ % 4 === 0) W.ev.push({ k: 'bossfire', x: B.x, z: B.z, soft: 1 });
      }
      break;
    }
    case 'spray': {
      C.emitT -= dt;
      while (C.emitT <= 0) { C.emitT += A.every; const a = C.a + Math.sin(at * 5.5) * A.fan * 0.5; bossBolt(W, B, a, R.boltV * A.v, 1); if (C.n++ % 3 === 0) W.ev.push({ k: 'bossfire', x: B.x, z: B.z, soft: 1 }); }
      break;
    }
    case 'sweep': C.beam = C.a0 + C.sgn * A.arc * Math.min(1, at / A.act); break;
    case 'charge': {
      const sp = A.v * (1 + 0.1 * ph);
      const ux = Math.cos(C.a), uz = Math.sin(C.a);
      if (!C.done) {
        B.vx = ux * sp; B.vz = uz * sp; B.x += B.vx * dt; B.z += B.vz * dt;
        const gone = hyp(B.x - C.sx, B.z - C.sz);
        let hit = false;
        for (const w of W.room.walls) if (w[4] === WK.PILLAR && wallDist(B.x, B.z, w) < B.r) hit = true;
        if (hit) { B.stun = 1.6; W.ev.push({ k: 'bosscrash', x: B.x, z: B.z }); }
        if (hit || gone >= C.L) { C.done = 1; B.vx = B.vz = 0; W.ev.push({ k: 'bossstop', x: B.x, z: B.z }); C.D = at + 0.35; }
      }
      break;
    }
    case 'summon': if (!C.fired) { C.fired = 1; summon(W, B, A.n + ph); } break;
    case 'drones': if (!C.fired) {
      C.fired = 1;
      for (let i = 0; i < A.n + ph; i++) { const a = C.a + (i - 1) * 0.7; const e = addRobot(W, 'drone', [clamp(B.x + Math.cos(a) * (B.r + 0.8), -RW + 1, RW - 1), clamp(B.z + Math.sin(a) * (B.r + 0.8), -RH + 1, RH - 1)], 0.5); if (e) { e.a = a; } }
      W.ev.push({ k: 'drones', x: B.x, z: B.z });
    } break;
    case 'slam': if (!C.fired) { C.fired = 1; W.ev.push({ k: 'slam', x: B.x, z: B.z }); } break;
    case 'stomp': if (!C.fired) { C.fired = 1; W.ev.push({ k: 'stomp', x: B.x, z: B.z }); } break;
    default: break;
  }
  if (at >= C.D) {
    if (C.kind === 'slam' && B.key === 'crusher') { B.stun = 1.1; W.ev.push({ k: 'vents', x: B.x, z: B.z }); }
    B.cur = null; B.cool = 1.55;
  }
}
function summon(W, B, n) {
  const mix = { ...RAMP[W.mode === 'campaign' ? W.sector : W.floor % 5].mix };
  delete mix.twin; delete mix.mortar;
  if (W.mode === 'campaign') for (const k in mix) if (!introduced(k, W.sector, RAMP[W.sector].rooms - 1)) delete mix[k];
  for (let i = 0; i < n; i++) { const type = pickW(() => rand(W), mix); addRobot(W, type, null, W.R.warn + 0.3); }
  W.ev.push({ k: 'summon', x: B.x, z: B.z, n });
}
function shotBoss(W, B, s) {
  if (B.state !== 'fight' && B.state !== 'in') return false;
  for (const h of B.heads) if (h.hp > 0 && hyp(h.x - s.x, h.z - s.z) < 0.65) { if (B.state === 'fight') hitHead(W, B, h, 1, s.pid); else W.ev.push({ k: 'block', x: s.x, z: s.z }); return true; }
  if (hyp(B.x - s.x, B.z - s.z) > B.r) return false;
  if (B.state === 'in' || B.heads.some((h) => h.hp > 0)) { W.ev.push({ k: 'block', x: s.x, z: s.z, boss: 1 }); return true; }
  if (B.plates > 0) {
    const a = Math.atan2(s.z - B.z, s.x - B.x), arc = BOSSES[B.key].plateArc || 0.5;
    for (let k = 0; k < B.plates; k++) if (Math.abs(angDiff(a, B.spin + (k / B.plates) * TAU)) < arc) { W.ev.push({ k: 'block', x: s.x, z: s.z, boss: 1 }); return true; }
  }
  W.stats.hits++;
  hitBoss(W, B, 1, s.pid, s.x, s.z);
  return true;
}
function hitHead(W, B, h, dmg, pid) {
  h.hp -= dmg; B.hitT = 0.08;
  W.ev.push({ k: 'headhit', x: h.x, z: h.z, i: h.i });
  if (h.hp <= 0) { h.hp = 0; addScore(W, 300); W.ev.push({ k: 'headdown', x: h.x, z: h.z, i: h.i, pid }); }
}
function hitBoss(W, B, dmg, pid, x, z, emp = false) {
  if (B.state !== 'fight') return;
  const k = B.stun > 0 ? 2 : 1;
  B.hp -= dmg * k; B.hitT = 0.1;
  W.ev.push({ k: 'bosshit', x, z, crit: k > 1, emp });
  if (B.hp <= 0) {
    B.hp = 0; B.state = 'dying'; B.st = 1.8; B.cur = null;
    addScore(W, SCORE.boss);
    W.zones = []; W.bolts = [];
    W.ev.push({ k: 'bossdown', key: B.key, x: B.x, z: B.z, pid });
    W.ev.push({ k: 'bosskill' });
  }
}

// ------------------------------------------------------------------ online guest: only my own infiltrator runs here
function guestStep(W, dt) {
  const me = W.players[1];
  if (!me) return;
  if (W.phase !== 'play') { if (me.alive) { me.x += me.vx * dt; me.z += me.vz * dt; } return; }
  player(W, me, dt);
  // my shots only fly for show; the host decides what they hit
  for (const s of W.shots) { s.life -= dt; s.x += s.vx * dt; s.z += s.vz * dt; if (s.life <= 0 || wallNear(W.room.walls, s.x, s.z, F.shotR)) s.dead = 1; }
  W.shots = W.shots.filter((s) => !s.dead);
  for (const b of W.bolts) { b.x += b.vx * dt; b.z += b.vz * dt; }
  if (!me.alive) return;
  for (const b of W.bolts) if (hyp(b.x - me.x, b.z - me.z) < b.r + F.r * 0.85) { if (zap(W, me, 'bolt', b.x, b.z)) return; }
  for (const e of W.robots) if (e.hp > 0 && e.boot <= 0 && hyp(e.x - me.x, e.z - me.z) < e.r + F.r * 0.9) { if (zap(W, me, 'robot', e.x, e.z)) return; }
  const S = W.seeker; if (S && S.inT <= 0 && hyp(S.x - me.x, S.z - me.z) < SEEKER.r + F.r * 0.8) zap(W, me, 'seeker', S.x, S.z);
  const B = W.boss; if (me.alive && B && B.state === 'fight' && hyp(B.x - me.x, B.z - me.z) < B.r + F.r * 0.8) zap(W, me, 'boss', B.x, B.z);
  for (const z of W.zones) if (me.alive && z.deadly && z.t >= z.T && z.t < z.T + z.D && inZone(z, me.x, me.z, F.r * 0.6)) zap(W, me, z.style, me.x, me.z);
}
// online helper: rebuild a room the host announced (the walls come from the same seeded generator)
export function adoptRoom(W, q) {
  if (W.room && W.room.key === q.key) return false;
  W.mode = q.mode; W.sector = q.sector; W.floor = q.floor; W.k = q.k; W.roomN = q.n; W.depth = q.depth;
  W.R = applyDiff(W.mode === 'campaign' ? rampAt(W.sector, Math.min(W.roomN, RAMP[W.sector].rooms - 1)) : rampLevel(endlessLevel(W.depth - 1)), W.diff);
  const fk = W.mode === 'endless' ? 100 + W.floor : W.sector;
  W.room = { rx: q.rx, ry: q.ry, key: q.key, walls: genWalls(W.seed, fk, q.rx, q.ry, q.doors, W.R.walls, q.boss), doors: q.doors, entry: q.entry, boss: q.boss, t: 0, cleared: 0, total: 0, liftOn: 0, liftT: 0, seekWarned: 0, cap: 2, first: q.first };
  if (q.grid) W.grid = q.grid;
  W.ev.push({ k: 'roomenter', rx: q.rx, ry: q.ry, side: q.entry, boss: q.boss, first: q.first, n: q.n, key: q.key });
  return true;
}
