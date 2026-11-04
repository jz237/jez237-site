// Crater Runner — the deterministic simulation. Fixed 120 Hz steps, all randomness from W.rs (play) or
// from a hash of seed + sector + segment (course layout, so a retry from a checkpoint meets the same
// course). Nothing outside step() may change W, so replays and online play stay exact.
// Units: metres and seconds. +x is the way the rover drives, +y is up, the track runs along z = 0.
import { F, STEP, SECTORS, rampAt, rampLevel, longHaulLevel, THREATS, BOSSES, SCORE, START_LIVES, LONG_HAUL } from './config.js?v=1';
export { STEP };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ------------------------------------------------------------------ randomness
export function rnd(W) {
  let t = (W.rs = (W.rs + 0x6D2B79F5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function seqRng(seed) {
  let s = seed | 0;
  return () => {
    let t = (s = (s + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (...n) => { let h = 2166136261; for (const v of n) { h ^= v | 0; h = Math.imul(h, 16777619); h ^= h >>> 13; } return h | 0; };

// ------------------------------------------------------------------ terrain
// gentle rolling ground with small bumps (the suspension works on these) plus the craters
export function baseH(x, k) {
  return 0.55 * Math.sin(x * 0.031 + k * 1.7) + 0.3 * Math.sin(x * 0.083 + k * 0.9) + 0.09 * Math.sin(x * 0.41 + k)
    + 0.055 * Math.sin(x * 1.37 + k * 2.3) * Math.sin(x * 0.23 + k) + 0.025 * Math.sin(x * 3.1 + k * 0.4);
}
// crater bowl as a function of distance from its centre (used in 3D by the renderer too)
export function craterProfile(c, dist) {
  const a = dist / c.r;
  if (a < 1) return -c.d * (1 - a * a) + c.rim * a * a * a * a;
  if (a < 2.2) { const q = (a - 1) / 0.32; return c.rim * Math.exp(-q * q); }
  return 0;
}
export function groundH(W, x) {
  let h = baseH(x, W.k);
  for (const c of W.craters) { const d = Math.abs(x - c.x); if (d < c.r * 2.2) h += craterProfile(c, d) * c.grow; }
  return h;
}
const slopeAt = (W, x) => (groundH(W, x + 0.06) - groundH(W, x - 0.06)) / 0.12;

// ------------------------------------------------------------------ world
export function makeWorld(o = {}) {
  const W = {
    n: 0, t: 0, mode: o.mode || 'campaign', seed: o.seed ?? 1, rs: hash(o.seed ?? 1, 77), sector: o.sector || 0, k: 0,
    coop: !!o.coop, demo: !!o.demo, up: { shield: 0, cannon: 0, flak: 0, springs: 0, radar: 0, ...(o.up || {}) },
    lives: o.lives ?? START_LIVES, score: o.score || 0, nextLife: 0, nextId: 1,
    rovers: [], craters: [], rocks: [], mines: [], tanks: [], shells: [], flyers: [], bombs: [], drones: [], shots: [], debris: [],
    pending: [], ev: [], claims: [],
    seg: o.cp || 0, cpX: [], segGen: -1, speed: 6, R: null, boss: null, bossDone: false, tutorial: false, safeT: 0,
    over: false, result: null, clearT: 0, driveT: 0, secT: 0, level: 0, deadT: 0,
    stats: { deaths: 0, air: 0, airKills: 0, kills: 0, jumps: 0, shots: 0, cpDeaths: {}, cpTries: {} },
    lastDeathN: -1, lastBossKillN: -1,
  };
  W.nextLife = Math.floor(W.score / SCORE.lifeEvery + 1) * SCORE.lifeEvery;
  if (W.mode === 'longhaul') { W.k = 0; W.level = LONG_HAUL.startLevel; }
  else W.k = W.sector;
  layoutCourse(W);
  const x0 = W.cpX[W.seg];
  W.rovers.push(newRover(1, x0, 0, W));
  if (W.coop) W.rovers.push(newRover(2, x0 - 2.5, 2.6, W));
  enterSegment(W, W.seg, true);
  return W;
}
export const cloneWorld = (W) => structuredClone(W);

function newRover(id, x, z, W) {
  const y = groundH(W, x);
  return { id, x, z, vx: 6, y, vy: 0, p: 0, pv: 0, air: false, airT: 0, jumping: false, jumpT: 0, buf: 0, coyote: 0, lip: 0,
    wc: [0, 0, 0], fireCD: 0, shield: 0, inv: 0, alive: true, deadT: 0, prevJump: false, remote: false,
    input: { th: 0, jump: false, fire: false }, landK: 0 };
}

// lettered checkpoints: cpX[0] is the sector start, cpX[1..n] the letters; the boss waits after the last
function layoutCourse(W) {
  if (W.mode === 'longhaul') { W.cpX = [0]; extendLongHaul(W, 3); return; }
  const n = SECTORS[W.sector].cps.length;
  W.cpX = [0];
  for (let k = 0; k < n; k++) {
    const R = rampAt(W.sector, k);
    const tut = W.sector === 0 && k === 0 && !W.demo;
    W.cpX.push(W.cpX[k] + (tut ? 44 : R.segT) * R.speed);
  }
}
function extendLongHaul(W, upTo) {
  while (W.cpX.length <= upTo + 1) {
    const k = W.cpX.length - 1;
    const R = rampLevel(lhLevelAt(W, k));
    W.cpX.push(W.cpX[k] + (lhBoss(k) ? 0 : R.segT * 0.8 * R.speed));
  }
}
const lhBoss = (k) => k > 0 && k % 7 === 6;
// Long Haul's level comes from the drive time the course is laid out for (~24 s a segment)
const lhLevelAt = (W, k) => longHaulLevel(k * 24);
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function cpLetter(W, i) {
  if (W.mode === 'longhaul') return i === 0 ? 'START' : LETTERS[(i - 1) % 26];
  return i === 0 ? 'START' : SECTORS[W.sector].cps[i - 1];
}
export const segCount = (W) => (W.mode === 'longhaul' ? Infinity : SECTORS[W.sector].cps.length);
const isBossSeg = (W, k) => (W.mode === 'longhaul' ? lhBoss(k) : k >= segCount(W));

function rampFor(W, k) {
  if (W.mode === 'longhaul') { const R = rampLevel(lhLevelAt(W, k)); return R; }
  return rampAt(W.sector, Math.min(k, segCount(W) - 1));
}

// set up segment k (on entry, or when restarting from its checkpoint)
function enterSegment(W, k, restart) {
  W.seg = k;
  W.R = rampFor(W, k);
  if (W.mode === 'longhaul') { extendLongHaul(W, k + 2); W.k = Math.floor(k / 7) % SECTORS.length; W.level = lhLevelAt(W, k); }
  if (restart) {
    W.craters = W.craters.filter((c) => !c.bomb && c.x < W.cpX[k] - 8);
    W.rocks = []; W.mines = []; W.tanks = []; W.shells = []; W.flyers = []; W.bombs = []; W.drones = []; W.shots = [];
    W.pending = []; W.boss = null; W.segGen = k - 1;
  }
  W.stats.cpTries[k] = (W.stats.cpTries[k] || 0) + 1;
  const sh = W.R.shield + (W.up.shield || 0);
  for (const r of W.rovers) r.shield = Math.max(r.shield, sh);
  if (isBossSeg(W, k)) startBoss(W, k);
  else genSegment(W, k);
  W.tutorial = W.mode === 'campaign' && W.sector === 0 && k === 0 && !W.demo;
  if (W.tutorial && restart) W.safeT = W.safeT || 32;
}

// ------------------------------------------------------------------ course generation
const TYPES = ['crater', 'boulder', 'mine', 'tank', 'wall', 'drone', 'air'];
function pick(rng, mix, avoid) {
  let tot = 0;
  for (const t of TYPES) if (mix[t] && t !== avoid) tot += mix[t];
  let r = rng() * tot;
  for (const t of TYPES) if (mix[t] && t !== avoid) { r -= mix[t]; if (r <= 0) return t; }
  return 'crater';
}
function genSegment(W, k) {
  if (W.segGen >= k) return;
  W.segGen = k;
  const x0 = W.cpX[k], x1 = W.cpX[k + 1];
  if (x1 === undefined) return;
  const R = rampFor(W, k);
  const rng = seqRng(hash(W.seed, W.mode === 'longhaul' ? 99 : W.sector, k, 31));
  const out = [];
  let x = x0 + R.speed * R.warn + 10;
  if (W.mode === 'campaign' && W.sector === 0 && k === 0 && !W.demo) x = tutorial(out, x0, R);
  let lastType = '';
  let airUntil = -1;
  while (x < x1 - 8) {
    let type = pick(rng, R.mix, lastType === 'air' ? 'air' : '');
    if (type === 'air' && x < airUntil) type = 'crater';
    const it = place(out, type, x, R, rng);
    let span = it.span;
    if (type === 'air') {
      airUntil = x + 12 * R.speed;
      // without a combo the air wave gets the sky to itself for a while
      if (rng() >= R.combo) span = 7.5 * R.speed;
      else span = 0.4 * R.gap * R.speed;
    } else if (rng() < R.pair) {
      const x2 = x + span + R.pairGap * R.speed;
      const it2 = place(out, pick(rng, R.mix, 'air'), x2, R, rng);
      span = x2 - x + it2.span;
    }
    lastType = type;
    x += span + R.gap * R.speed * (0.85 + 0.35 * rng());
  }
  for (const it of out) W.pending.push(it);
  W.pending.sort((a, b) => a.x - b.x);
}
function place(out, type, x, R, rng) {
  const s = R.sector;
  switch (type) {
    case 'crater': {
      const w = R.crater * (0.8 + 0.4 * rng());
      out.push({ type, x: x + w / 2, w, d: 0.85 + 0.2 * w, rim: 0.16 + 0.035 * w });
      return { span: w };
    }
    case 'boulder': {
      const big = s >= 1 && rng() < 0.3 + 0.05 * s;
      out.push({ type, x: x + 1, big, seed: (rng() * 1e6) | 0 });
      return { span: 2 };
    }
    case 'wall': out.push({ type, x: x + 0.5, seed: (rng() * 1e6) | 0 }); return { span: 1.2 };
    case 'mine': {
      const two = s >= 3 && rng() < 0.4;
      out.push({ type, x: x + 0.5 });
      if (two) out.push({ type, x: x + 1.9 });
      return { span: two ? 2.6 : 1.2 };
    }
    case 'tank': out.push({ type, x: x + 4 }); return { span: 5 };
    case 'drone': out.push({ type, x, n: 1 + (rng() < (s - 2) * 0.3 ? 1 : 0) }); return { span: 1.5 * R.speed };
    case 'air': {
      const n = Math.max(1, Math.round(R.air + (rng() - 0.5) * 0.8));
      out.push({ type, x, n, seed: (rng() * 1e6) | 0 });
      return { span: 2 };
    }
  }
  return { span: 2 };
}
// sector 1's first minute: jump, then shoot forward, then shoot up, one at a time (you cannot die yet)
function tutorial(out, x0, R) {
  const v = R.speed, at = (t) => x0 + t * v;
  out.push({ type: 'tut', x: at(2), key: 'jump' });
  out.push({ type: 'crater', x: at(6.5), w: 2.3, d: 1.2, rim: 0.2 });
  out.push({ type: 'crater', x: at(11.5), w: 2.6, d: 1.3, rim: 0.22 });
  out.push({ type: 'tut', x: at(14.5), key: 'fire' });
  out.push({ type: 'boulder', x: at(19), big: false, seed: 11 });
  out.push({ type: 'boulder', x: at(23.5), big: false, seed: 12 });
  out.push({ type: 'tut', x: at(25.5), key: 'up' });
  out.push({ type: 'air', x: at(27), n: 1, seed: 5, tame: 1 });
  out.push({ type: 'tut', x: at(34), key: 'speed' });
  out.push({ type: 'crater', x: at(38.5), w: 2.8, d: 1.3, rim: 0.22 });
  return at(43);
}

// bring pending threats to life as the rover approaches
function spawnPending(W, lead) {
  if (W.net === 'guest') return;
  const front = leadRover(W);
  if (!front) return;
  const R = W.R;
  while (W.pending.length) {
    const it = W.pending[0];
    let need = it.x - lead;
    if (it.type === 'air') need = it.x;
    else if (it.type === 'drone') need = it.x - (R.speed + THREATS.drone.speed) * (R.warn + 0.8) - 8;
    else if (it.type === 'tut') need = it.x;
    if (front.x < need) break;
    W.pending.shift();
    spawn(W, it, front);
  }
}
function spawn(W, it, front) {
  const id = W.nextId++;
  const R = W.R;
  switch (it.type) {
    case 'tut': W.ev.push({ k: 'tut', key: it.key }); return;
    case 'crater': W.craters.push({ id, x: it.x, r: it.w / 2, d: it.d, rim: it.rim, kill: true, grow: 1, bomb: false, sig: false, w: it.w }); return;
    case 'boulder': {
      const T = THREATS.boulder, r = it.big ? T.big.r : T.r;
      W.rocks.push({ id, kind: 'boulder', x: it.x, r, hw: r * 0.85, top: r * 1.55, hp: it.big ? T.big.hp : T.hp, seed: it.seed, vx: 0, sig: false, big: it.big });
      return;
    }
    case 'wall': W.rocks.push({ id, kind: 'wall', x: it.x, r: 0.9, hw: THREATS.wall.w / 2, top: THREATS.wall.h, hp: THREATS.wall.hp, seed: it.seed, vx: 0, sig: false }); return;
    case 'mine': W.mines.push({ id, x: it.x, sig: false }); return;
    case 'tank': W.tanks.push({ id, x: it.x, hp: THREATS.tank.hp, fireT: 0.6, vx: -1.2, sig: false, recoil: 0 }); return;
    case 'drone':
      for (let i = 0; i < it.n; i++) {
        const d = (R.speed + THREATS.drone.speed) * (R.warn + 0.8) + 6 + i * 4;
        W.drones.push({ id: i ? W.nextId++ : id, x: front.x + d, y: 11 + i * 1.5, vx: front.vx - 2, vy: -1, hp: 1, life: 16, sig: true, sigT: W.t });
        W.ev.push({ k: 'warn', type: 'drone', air: true, id });
      }
      return;
    case 'air': {
      const rng = seqRng(it.seed);
      for (let i = 0; i < it.n; i++) {
        W.flyers.push({ id: i ? W.nextId++ : id, x: front.x - 16 - i * 5, y: THREATS.flyer.y + 2, rel: 0.5 + rng() * 5 + i * 2.5, ph: rng() * 6,
          life: THREATS.flyer.life * (it.tame ? 0.8 : 1), fireT: (it.tame ? 4.2 : 1.6 + rng() * 1.5), hp: 1, out: false, sig: true, sigT: W.t, tame: !!it.tame, bombs: 0 });
        W.stats.air++;
      }
      W.ev.push({ k: 'warn', type: 'air', air: true, id });
      return;
    }
  }
}

// ------------------------------------------------------------------ bosses
function startBoss(W, k) {
  const key = W.mode === 'longhaul' ? ['warden', 'crawler', 'lancer', 'excavator', 'carrier'][Math.floor(k / 7) % 5] : SECTORS[W.sector].boss;
  const def = BOSSES[key];
  const R = W.R;
  // RAMP bossHP is the armour rating; ground bosses take every forward shot, air bosses only when overhead
  const hp = Math.round((W.mode === 'longhaul' ? 12 + W.level * 5 : R.bossHP) * (def.kind === 'ground' ? 5 : 3.5));
  const front = leadRover(W) || W.rovers[0];
  W.boss = { key, kind: def.kind, hp, max: hp, x: front.x - 30, y: def.kind === 'ground' ? 0 : 15, t: 0, state: 'in', fireT: 3, fireT2: 5, fireT3: 7,
    phase: 1, rel: def.kind === 'ground' ? 21 : 2, hitT: 0, rate: R.bossRate * (W.mode === 'longhaul' ? 0.6 + W.level * 0.08 : 1) };
  if (def.kind === 'ground') W.boss.x = front.x + 60;
  W.ev.push({ k: 'bossin', key });
}
function bossBox(b) {
  if (b.kind === 'ground') return { x0: b.x - 3.4, x1: b.x + 3.4, y0: b.gy, y1: b.gy + 3.8 };
  return { x0: b.x - 4.2, x1: b.x + 4.2, y0: b.y - 1.3, y1: b.y + 1.1 };
}
function stepBoss(W, dt) {
  const b = W.boss;
  if (!b) return;
  if (W.net === 'guest') { const f = leadRover(W); if (f && b.state !== 'dying') b.x += f.vx * dt; return; }
  const front = leadRover(W);
  const R = W.R, def = BOSSES[b.key];
  b.t += dt;
  b.hitT = Math.max(0, b.hitT - dt);
  if (!front) return;
  if (b.state === 'dying') {
    b.dieT -= dt;
    b.x += front.vx * dt;
    if (b.kind !== 'ground') b.y -= 2.5 * dt;
    if (b.dieT <= 0 && !W.bossDone) {
      W.bossDone = true;
      W.boss = null;
      W.lastBossKillN = W.n;
      W.ev.push({ k: 'bosskill', x: b.x, y: b.kind === 'ground' ? b.gy + 2 : b.y, key: b.key });
      if (W.mode === 'longhaul') { W.bossDone = false; const k = W.seg + 1; W.cpX.length = k; W.cpX.push(front.x + 4); extendLongHaul(W, k + 2); enterSegment(W, k, false); W.ev.push({ k: 'cp', i: W.seg, letter: cpLetter(W, W.seg), bonus: 0, x: front.x }); }
      else { W.clearT = 3.2; }
    }
    return;
  }
  const v = front.vx;
  const tx = front.x + b.rel + (b.kind === 'ground' ? Math.sin(b.t * 0.4) * 2 : Math.sin(b.t * 0.42) * 6.5);
  b.x += (v + clamp((tx - b.x) * (b.state === 'in' ? 0.9 : 1.4), -12, 12)) * dt;
  if (b.kind === 'ground') b.gy = groundH(W, b.x);
  else b.y += ((b.kind === 'carrier' ? 10.5 : 9.5) + Math.sin(b.t * 0.9) * 0.6 - b.y) * 1.2 * dt;
  if (b.state === 'in') { if (Math.abs(tx - b.x) < 3 && b.t > 3) { b.state = 'fight'; W.ev.push({ k: 'bossfight', key: b.key }); } return; }
  const rate = b.rate * (b.phase === 2 ? 1.3 : 1);
  const warn = R.warn + radar(W);
  // bomb salvos (air + carrier)
  if (def.salvo) {
    b.fireT -= dt * rate;
    if (b.fireT <= 0) {
      b.fireT = 2.4 + rnd(W) * 0.8;
      // a salvo leaves rover-sized gaps (5.5 m apart): slow down or speed up into one, or shoot a bomb
      const T = Math.max(1.2, R.warn + 0.5);
      const shift = (rnd(W) - 0.5) * 5.5;
      for (let i = 0; i < def.salvo; i++) {
        const off = (i - (def.salvo - 1) / 2) * 5.5 + shift;
        dropBomb(W, b.x + off * 0.5, b.y - 1, front.vx, front.x + front.vx * T + off, T, true);
      }
      W.ev.push({ k: 'bosssalvo', x: b.x, y: b.y });
    }
  }
  // low shells (ground + carrier phase 2) and lobbed mortars
  if (b.kind === 'ground') {
    b.fireT2 -= dt * rate;
    const gy = b.kind === 'ground' ? b.gy : groundH(W, b.x);
    if (b.fireT2 <= 0 && b.x - front.x > (v + THREATS.tank.shellV) * warn) {
      b.fireT2 = 2.2 + rnd(W);
      W.shells.push({ id: W.nextId++, x: b.x - 3.4, y: gy + 0.9, vx: -THREATS.tank.shellV + (b.kind === 'ground' ? 0 : 0), vy: 0, life: 7, sig: true, sigT: W.t, big: 1 });
      W.ev.push({ k: 'shell', x: b.x - 3.4, y: gy + 0.9, boss: 1 });
    }
  }
  if (def.mortar && (def.mortar === 1 || b.phase === 2)) {
    b.fireT3 -= dt * rate;
    if (b.fireT3 <= 0) {
      b.fireT3 = 3.4 + rnd(W) * 1.2;
      const T = Math.max(1.3, R.warn + 0.55);
      const land = front.x + front.vx * T + (rnd(W) - 0.3) * 3;
      const sy = b.kind === 'ground' ? b.gy + 3.6 : b.y - 1;
      const gl = groundH(W, land);
      // ballistic: reach `land` after T seconds under bomb gravity 9
      const vx = (land - b.x) / T, vy = (gl - sy + 0.5 * 9 * T * T) / T;
      W.bombs.push({ id: W.nextId++, x: b.x, y: sy, vx, vy, g: 9, tx: land, T, t: 0, sig: true, sigT: W.t, mortar: 1, crater: false });
      W.ev.push({ k: 'mortar', x: b.x, y: sy });
    }
  }
  // drones (lancer, carrier)
  if (def.drones) {
    b.droneT = (b.droneT ?? 4) - dt * rate;
    if (b.droneT <= 0 && W.drones.length < 3) {
      b.droneT = b.kind === 'carrier' ? 8 : 6.5;
      W.drones.push({ id: W.nextId++, x: b.x, y: (b.kind === 'ground' ? b.gy + 3 : b.y) - 1, vx: front.vx + 2, vy: 2, hp: 1, life: 14, sig: true, sigT: W.t, slow: 1.2 });
      W.ev.push({ k: 'warn', type: 'drone', air: true });
    }
  }
  // the excavator throws boulders that roll back at you
  if (def.rocks) {
    b.rockT = (b.rockT ?? 5) - dt * rate;
    if (b.rockT <= 0 && b.x - front.x > (v + 3) * warn + 2) {
      b.rockT = 4.2 + rnd(W) * 1.5;
      W.rocks.push({ id: W.nextId++, kind: 'boulder', x: b.x - 3.8, r: 0.7, hw: 0.6, top: 1.08, hp: 1, seed: (rnd(W) * 1e6) | 0, vx: -3, sig: true, sigT: W.t, rolling: 1 });
      W.ev.push({ k: 'throw', x: b.x - 3.8 });
    }
  }
}
function hitBoss(W, dmg, x, y) {
  const b = W.boss;
  if (!b || b.state !== 'fight') return;
  b.hp -= dmg; b.hitT = 0.12;
  W.ev.push({ k: 'bosshit', x, y, hp: b.hp, max: b.max });
  if (b.phase === 1 && b.hp <= b.max / 2) { b.phase = 2; W.ev.push({ k: 'bossphase', key: b.key }); }
  if (b.hp <= 0) {
    b.state = 'dying'; b.dieT = 2.2;
    addScore(W, SCORE.boss + (W.mode === 'longhaul' ? 0 : W.sector * 1000));
    W.stats.kills++;
    W.ev.push({ k: 'bossdying', x: b.x, y: b.kind === 'ground' ? b.gy + 2 : b.y, key: b.key });
    W.bombs = W.bombs.filter((q) => !q.mortar);
  }
}

// ------------------------------------------------------------------ helpers
function leadRover(W) { let b = null; for (const r of W.rovers) if (r.alive && (!b || r.x > b.x)) b = r; return b; }
function anyRover(W) { return leadRover(W) || W.rovers[0]; }
const radar = (W) => (W.up.radar ? 0.4 : 0);
function addScore(W, n) {
  W.score += n;
  while (W.score >= W.nextLife) { W.nextLife += SCORE.lifeEvery; W.lives++; W.ev.push({ k: 'life' }); }
}
export function jumpV(W) { return F.jumpV * (1 + 0.06 * (W.up.springs || 0)); }

function dropBomb(W, x, y, vx, tx, T, boss) {
  const gl = groundH(W, tx);
  const g = Math.max(1.5, (2 * (y - gl)) / (T * T));
  W.bombs.push({ id: W.nextId++, x, y, vx: (tx - x) / T, vy: 0, g, tx, T, t: 0, sig: true, sigT: W.t, crater: true, boss: !!boss });
  W.ev.push({ k: 'bombdrop', x, y, tx });
}

// ------------------------------------------------------------------ damage
function hurt(W, R, cause, x, y) {
  if (!R.alive || R.inv > 0 || R.remote) return false;
  if (W.safeT > 0 || W.demoSafe) {
    W.ev.push({ k: 'saved', rid: R.id, x: R.x, cause });
    R.inv = 0.6;
    if (cause === 'crater') { R.vy = jumpV(W) * 1.05; R.air = true; R.jumping = true; R.jumpT = 0; }
    return false;
  }
  if (R.shield > 0) {
    R.shield--; R.inv = 1.1;
    if (W.net === 'guest') W.claims.push({ shield: R.shield });
    W.ev.push({ k: 'shield', rid: R.id, x: R.x, y: R.y + 1, cause, left: R.shield });
    if (cause === 'crater') { R.vy = jumpV(W) * 1.05; R.air = true; R.jumping = true; R.jumpT = 0; }
    return false;
  }
  R.alive = false; R.deadT = 0;
  if (W.net === 'guest') { W.claims.push({ dead: 1, cause, x: R.x }); W.ev.push({ k: 'crash', rid: R.id, x: R.x, y: R.y + 0.8, cause, vx: R.vx }); return true; }
  W.lives = Math.max(0, W.lives - 1);
  W.stats.deaths++;
  W.stats.cpDeaths[W.seg] = (W.stats.cpDeaths[W.seg] || 0) + 1;
  W.lastDeathN = W.n;
  W.ev.push({ k: 'crash', rid: R.id, x: R.x, y: R.y + 0.8, cause, vx: R.vx });
  return true;
}

// ------------------------------------------------------------------ the rover
function stepRover(W, R, dt) {
  if (!R.alive) { R.deadT += dt; return; }
  if (R.remote) { R.x += R.vx * dt; return; }
  const I = R.input;
  R.inv = Math.max(0, R.inv - dt);
  R.fireCD = Math.max(0, R.fireCD - dt);
  const boss = W.boss && W.boss.state !== 'dying';
  const base = W.speed * (boss ? 0.92 : 1);
  const tgt = base * (1 + F.throttle * clamp(I.th, -1, 1));
  if (!R.air) R.vx += clamp(tgt - R.vx, -F.accel * dt, F.accel * dt);
  R.x += R.vx * dt;
  // jump: edge + buffer + coyote
  const press = I.jump && !R.prevJump;
  R.prevJump = I.jump;
  if (press) R.buf = F.buffer;
  R.buf = Math.max(0, R.buf - dt);
  const grounded = !R.air;
  if (R.buf > 0 && !R.jumping && (grounded || R.coyote > 0)) {
    const gv = Math.max(0, R.vx * slopeAt(W, R.x));
    R.vy = jumpV(W) + gv * 0.5;
    R.air = true; R.jumping = true; R.jumpT = 0; R.buf = 0; R.coyote = 0; R.airT = 0; R.lip = 0;
    W.stats.jumps++;
    W.ev.push({ k: 'jump', rid: R.id, x: R.x, y: R.y });
  }
  if (R.jumping) R.jumpT += dt;
  // suspension: three axles (both sides share them), springs push the body, damping on relative speed
  let Fy = 0, T = 0, contact = 0;
  const springs = W.up.springs || 0;
  for (let i = 0; i < 3; i++) {
    const off = F.axles[i], wx = R.x + off;
    const g = groundH(W, wx);
    const c = g - (R.y + R.p * off);
    R.wc[i] = c;
    if (R.jumping && R.jumpT < 0.08) continue;
    if (c > -F.pre) {
      const gvy = R.vx * slopeAt(W, wx);
      const rel = R.vy + R.pv * off - gvy;
      const f = F.spring * (c + F.pre) - F.damp * (1 - 0.12 * springs) * rel;
      if (f > 0) { Fy += f; T += f * off; }
      contact++;
    }
  }
  const holding = R.jumping && I.jump && R.jumpT < F.holdMax && R.vy > 0;
  const g = F.gravity * (holding ? F.holdG : 1);
  const vyBefore = R.vy;
  R.vy += (Fy - g) * dt;
  R.pv += (T / F.pitchI - R.pv * (contact ? F.pitchDamp : 0.4)) * dt;
  if (!contact) R.pv += (-0.18 - R.p) * 0.6 * dt; // airborne: the nose settles slightly down
  R.y += R.vy * dt;
  R.p = clamp(R.p + R.pv * dt, -0.55, 0.55);
  // bump stops: a wheel cannot sink further into the body than its travel
  let hard = 0;
  for (let i = 0; i < 3; i++) {
    const off = F.axles[i];
    const c = groundH(W, R.x + off) - (R.y + R.p * off);
    if (c > F.bumpMax) {
      const push = c - F.bumpMax;
      if (off === 0) R.y += push; else { R.y += push * 0.55; R.p = clamp(R.p + (push * 0.45) / off, -0.55, 0.55); }
      hard = Math.max(hard, push);
    }
  }
  if (hard > 0 && R.vy < 0) R.vy = Math.max(R.vy, R.vx * slopeAt(W, R.x));
  const nowGround = contact > 0 || hard > 0;
  if (nowGround && R.air && !(R.jumping && R.jumpT < 0.08)) {
    R.air = false; R.jumping = false;
    const imp = Math.max(0, -vyBefore);
    R.landK = Math.min(1, imp / 7);
    W.ev.push({ k: 'land', rid: R.id, x: R.x, y: R.y, imp });
    R.airT = 0;
  } else if (!nowGround && !R.air) { R.air = true; R.airT = 0; }
  if (R.air) { R.airT += dt; if (!R.jumping) R.coyote -= dt; } else R.coyote = F.coyote;
  // fell into a crater: on the ground with the middle of the rover over the bowl
  if (!R.air) {
    let inPit = null;
    for (const c of W.craters) {
      if (!c.kill || c.grow < 0.99) continue;
      const zone = c.r - W.R.land - (W.up.springs || 0) * 0.12;
      if (zone > 0 && Math.abs(R.x - c.x) < zone) { inPit = c; break; }
    }
    if (inPit) {
      R.lip += dt;
      if (R.lip > W.R.grace) { R.lip = 0; hurt(W, R, 'crater', R.x, R.y); }
    } else R.lip = 0;
  } else R.lip = 0;
  if (!R.alive) return;
  // guns: one button fires forward and up
  if (I.fire && R.fireCD <= 0) {
    R.fireCD = F.fireCD * (1 - 0.14 * (W.up.cannon || 0));
    const fwd = W.shots.filter((s) => s.rid === R.id && s.kind === 'fwd').length;
    if (fwd < F.maxFwd + (W.up.cannon || 0)) W.shots.push({ id: W.nextId++, rid: R.id, kind: 'fwd', x: R.x + F.halfLen + 0.3, y: R.y + 0.95 + R.p * 1.9, vx: R.vx + F.shotV, vy: 0, life: F.shotLife });
    const ux = R.x + 0.2, uy = R.y + 2.0;
    W.shots.push({ id: W.nextId++, rid: R.id, kind: 'up', x: ux, y: uy, vx: R.vx, vy: F.upV, life: F.upLife });
    const flak = W.up.flak || 0;
    if (flak >= 1) W.shots.push({ id: W.nextId++, rid: R.id, kind: 'up', x: ux, y: uy, vx: R.vx + 5, vy: F.upV * 0.97, life: F.upLife });
    if (flak >= 2) W.shots.push({ id: W.nextId++, rid: R.id, kind: 'up', x: ux, y: uy, vx: R.vx - 4, vy: F.upV * 0.97, life: F.upLife });
    W.stats.shots++;
    W.ev.push({ k: 'fire', rid: R.id, x: R.x, y: R.y, flak });
  }
}

// rover vs everything that can hit it
function collide(W, R) {
  if (!R.alive || R.remote) return;
  const x0 = R.x - F.halfLen, x1 = R.x + F.halfLen, bot = R.y + 0.05, top = R.y + F.height;
  for (const r of W.rocks) {
    if (r.dead || x1 < r.x - r.hw || x0 > r.x + r.hw) continue;
    const gy = groundH(W, r.x);
    if (bot < gy + r.top - 0.15) {
      hurt(W, R, r.kind, r.x, gy + r.top);
      r.dead = true; breakRock(W, r, 'rammed');
      return;
    }
  }
  if (!R.air) for (const m of W.mines) {
    if (m.dead) continue;
    let near = false;
    for (const off of F.axles) if (Math.abs(R.x + off - m.x) < THREATS.mine.r) near = true;
    if (near) { m.dead = true; W.ev.push({ k: 'mine', x: m.x, y: groundH(W, m.x) }); hurt(W, R, 'mine', m.x, 0); return; }
  }
  for (const t of W.tanks) {
    if (t.dead || x1 < t.x - 1.3 || x0 > t.x + 1.3) continue;
    if (bot < groundH(W, t.x) + THREATS.tank.h - 0.15) { t.dead = true; W.ev.push({ k: 'boom', x: t.x, y: groundH(W, t.x) + 0.8, size: 2, what: 'tank' }); hurt(W, R, 'tank', t.x, 0); return; }
  }
  for (const s of W.shells) {
    if (s.dead || s.x < x0 || s.x > x1 || s.y < bot || s.y > top) continue;
    s.dead = true; W.ev.push({ k: 'boom', x: s.x, y: s.y, size: 1, what: 'shell' }); hurt(W, R, 'shell', s.x, s.y); return;
  }
  for (const b of W.bombs) {
    if (b.dead || b.x < x0 - 0.3 || b.x > x1 + 0.3 || b.y < bot || b.y > top + 0.3) continue;
    b.dead = true; W.ev.push({ k: 'boom', x: b.x, y: b.y, size: 1.5, what: 'bomb' }); hurt(W, R, 'bomb', b.x, b.y); return;
  }
  for (const d of W.drones) {
    if (d.dead || d.x < x0 - 0.5 || d.x > x1 + 0.5 || d.y < bot - 0.3 || d.y > top + 0.5) continue;
    d.dead = true; W.ev.push({ k: 'boom', x: d.x, y: d.y, size: 1.2, what: 'drone' }); hurt(W, R, 'drone', d.x, d.y); return;
  }
  const b = W.boss;
  if (b && b.kind === 'ground' && b.state === 'fight' && x1 > b.x - 3.4) { R.x = b.x - 3.4 - F.halfLen; hurt(W, R, 'boss', R.x, 0); }
}

function breakRock(W, r, by) {
  const gy = groundH(W, r.x);
  W.ev.push({ k: 'rock', x: r.x, y: gy + r.top * 0.5, kind: r.kind, big: !!r.big, by, seed: r.seed });
}

// ------------------------------------------------------------------ enemies
function stepEnemies(W, dt) {
  const R = W.R, front = leadRover(W);
  const fx = front ? front.x : anyRover(W).x, fv = front ? front.vx : W.speed;
  const warn = R.warn + radar(W);
  // ground threats get their warning when they are `warn` seconds away
  const sig = (e, type, x) => {
    if (e.sig || !front) return;
    if ((x - (front.x + F.halfLen)) / Math.max(1, front.vx) <= warn) { e.sig = true; e.sigT = W.t; W.ev.push({ k: 'warn', type, id: e.id, x }); }
  };
  for (const c of W.craters) { if (c.kill && !c.bomb) sig(c, 'crater', c.x - c.r); if (c.grow < 1) c.grow = Math.min(1, c.grow + dt * 4); }
  for (const r of W.rocks) {
    sig(r, r.kind, r.x - r.hw);
    if (r.vx) { r.x += r.vx * dt; r.roll = (r.roll || 0) + (r.vx * dt) / r.r; }
  }
  for (const m of W.mines) sig(m, 'mine', m.x);
  for (const t of W.tanks) {
    if (t.dead) continue;
    sig(t, 'tank', t.x - 1.3);
    const dist = t.x - fx;
    if (dist < 45) t.x += t.vx * dt;
    t.recoil = Math.max(0, t.recoil - dt * 3);
    t.fireT -= dt;
    if (W.net !== 'guest' && t.fireT <= 0 && front && dist < THREATS.tank.range && dist > (fv + THREATS.tank.shellV) * warn + 1) {
      t.fireT = 1 / Math.max(0.05, R.fire * 1.2) * (0.85 + 0.3 * rnd(W));
      const gy = groundH(W, t.x);
      W.shells.push({ id: W.nextId++, x: t.x - 1.4, y: gy + 0.9, vx: -THREATS.tank.shellV, vy: 0, life: 6, sig: true, sigT: W.t });
      t.recoil = 1;
      W.ev.push({ k: 'shell', x: t.x - 1.4, y: gy + 0.9, id: t.id });
    }
  }
  for (const s of W.shells) {
    s.x += s.vx * dt; s.life -= dt;
    // shells skim the ground: they follow it at axle height
    const gy = groundH(W, s.x);
    s.y += (gy + 0.9 - s.y) * Math.min(1, dt * 6);
    if (s.life <= 0) s.dead = true;
  }
  for (const f of W.flyers) {
    if (f.dead) continue;
    f.ph += dt; f.life -= dt;
    if (f.life <= 0 && !f.out) f.out = true;
    if (f.out) { f.rel += 9 * dt; f.yT = (f.yT || f.y) + 3 * dt; }
    const tx = fx + f.rel + Math.sin(f.ph * 0.7) * 3.4;
    const ty = (f.out ? f.yT : THREATS.flyer.y) + Math.sin(f.ph * 1.3) * 0.6;
    f.vx = fv + clamp((tx - f.x) * 1.1, -7, 9);
    f.x += f.vx * dt;
    f.y += (ty - f.y) * 1.4 * dt;
    if (f.out && f.x > fx + 48) f.dead = true;
    f.fireT -= dt;
    const over = f.x - fx;
    if (W.net !== 'guest' && !f.out && front && f.fireT <= 0 && over > -1 && over < 12 && f.ph > 1.6) {
      f.fireT = (1 / Math.max(0.04, R.fire)) * (0.8 + 0.4 * rnd(W));
      if (f.tame && f.bombs >= 1) { f.fireT = 99; continue; }
      f.bombs++;
      const T = Math.max(0.9, R.warn) + 0.35;
      // aim at where the rover will be, give or take
      const tx2 = front.x + front.vx * T + (rnd(W) - 0.35) * 4 + (f.tame ? 6 : 0);
      dropBomb(W, f.x, f.y - 0.5, f.vx, tx2, T, false);
    }
  }
  for (const b of W.bombs) {
    b.t += dt; b.vy -= b.g * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    const gy = groundH(W, b.x);
    if (b.y <= gy + 0.15) {
      b.dead = true;
      const dist = front ? b.x - front.x : 99;
      // a bomb that lands well ahead blows a fresh crater you have to jump; close in, only a shallow scorch
      const ahead = front ? (dist - F.halfLen) / Math.max(1, front.vx) : 0;
      const deadly = b.crater && !b.mortar && ahead > 0.55;
      const w = 2.2 + 0.25 * (W.mode === 'longhaul' ? W.level : W.sector);
      if (b.crater && W.net !== 'guest') W.craters.push({ id: W.nextId++, x: b.x, r: (deadly ? w : 1.6) / 2, d: deadly ? 0.9 + 0.15 * w : 0.3, rim: 0.15, kill: deadly, grow: 0, bomb: true, sig: true, w: deadly ? w : 1.6 });
      W.ev.push({ k: 'bombland', x: b.x, y: gy, crater: deadly, mortar: !!b.mortar });
      for (const R2 of W.rovers) if (R2.alive && Math.abs(R2.x - b.x) < F.halfLen + 0.4 && R2.y < gy + 0.9) hurt(W, R2, 'bomb', b.x, gy);
    }
  }
  for (const d of W.drones) {
    if (d.dead || !front) continue;
    d.life -= dt;
    // drones swoop down ahead of the rover to gun height, then come straight in along the ground
    const ahead = d.x - front.x;
    const gunY = groundH(W, d.x) + 1.15;
    const tx = front.x + 0.4, ty = gunY + clamp((ahead - 13) * 0.55, 0, 9);
    const dx = tx - d.x, dy = ty - d.y, l = Math.hypot(dx, dy) || 1;
    const sp = THREATS.drone.speed * (d.slow ? 0.85 : 1) * (0.85 + 0.06 * (W.mode === 'longhaul' ? W.level : W.sector));
    const wantVx = front.vx + (dx / l) * sp, wantVy = (dy / l) * sp;
    const k = Math.min(1, dt * 1.6);
    d.vx += (wantVx - d.vx) * k; d.vy += (wantVy - d.vy) * Math.min(1, dt * 3);
    if (ahead < 13 && ahead > 0) d.y += (gunY - d.y) * Math.min(1, dt * 2.5);
    d.x += d.vx * dt; d.y += d.vy * dt;
    const gy = groundH(W, d.x);
    if (d.y < gy + 0.4) { d.y = gy + 0.4; d.vy = Math.abs(d.vy) * 0.3; }
    if (d.life <= 0 || d.x < fx - 25) d.dead = true;
  }
}

// ------------------------------------------------------------------ shots
function stepShots(W, dt) {
  for (const s of W.shots) {
    s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
    if (s.life <= 0) { s.dead = true; continue; }
    if (s.ghost) continue;
    if (s.kind === 'fwd') {
      const gy = groundH(W, s.x);
      if (s.y < gy + 0.05) { s.dead = true; W.ev.push({ k: 'puff', x: s.x, y: gy }); continue; }
      for (const r of W.rocks) {
        if (r.dead || Math.abs(s.x - r.x) > r.hw + 0.2) continue;
        if (s.y > groundH(W, r.x) + r.top + 0.1) continue;
        s.dead = true; r.hp--;
        W.ev.push({ k: 'hit', x: r.x - r.hw, y: s.y, what: r.kind });
        if (r.hp <= 0) { r.dead = true; breakRock(W, r, 'shot'); addScore(W, r.kind === 'wall' ? THREATS.wall.score : THREATS.boulder.score * (r.big ? 2 : 1)); W.stats.kills++; }
        break;
      }
      if (s.dead) continue;
      for (const t of W.tanks) {
        if (t.dead || Math.abs(s.x - t.x) > 1.4 || s.y > groundH(W, t.x) + THREATS.tank.h + 0.2) continue;
        s.dead = true; t.hp--;
        W.ev.push({ k: 'hit', x: t.x - 1.3, y: s.y, what: 'tank' });
        if (t.hp <= 0) { t.dead = true; addScore(W, THREATS.tank.score); W.stats.kills++; W.ev.push({ k: 'boom', x: t.x, y: groundH(W, t.x) + 0.8, size: 2, what: 'tank', kill: 1 }); }
        break;
      }
      if (s.dead) continue;
      for (const q of W.shells) {
        if (q.dead || Math.abs(s.x - q.x) > 0.7 || Math.abs(s.y - q.y) > 0.6) continue;
        s.dead = true; q.dead = true; addScore(W, THREATS.shell.score);
        W.ev.push({ k: 'boom', x: q.x, y: q.y, size: 0.8, what: 'shell', kill: 1 });
        break;
      }
    }
    if (s.dead) continue;
    for (const d of W.drones) {
      if (d.dead || Math.abs(s.x - d.x) > 0.95 || Math.abs(s.y - d.y) > 0.9) continue;
      s.dead = true; d.dead = true; addScore(W, THREATS.drone.score); W.stats.kills++;
      W.ev.push({ k: 'boom', x: d.x, y: d.y, size: 1.2, what: 'drone', kill: 1 });
      break;
    }
    if (s.dead || s.kind !== 'up') { if (!s.dead) bossShot(W, s); continue; }
    for (const f of W.flyers) {
      if (f.dead || Math.abs(s.x - f.x) > 1.45 || Math.abs(s.y - f.y) > 0.8) continue;
      s.dead = true; f.dead = true; addScore(W, THREATS.flyer.score); W.stats.kills++; W.stats.airKills++;
      W.ev.push({ k: 'boom', x: f.x, y: f.y, size: 1.6, what: 'flyer', kill: 1, vx: f.vx });
      break;
    }
    if (s.dead) continue;
    for (const b of W.bombs) {
      if (b.dead || Math.abs(s.x - b.x) > 0.65 || Math.abs(s.y - b.y) > 0.65) continue;
      s.dead = true; b.dead = true; addScore(W, THREATS.bomb.score);
      W.ev.push({ k: 'boom', x: b.x, y: b.y, size: 1, what: 'bomb', kill: 1 });
      break;
    }
    if (!s.dead) bossShot(W, s);
  }
}
function bossShot(W, s) {
  const b = W.boss;
  if (!b || b.state !== 'fight') return;
  const bx = bossBox(b);
  if (s.x < bx.x0 || s.x > bx.x1 || s.y < bx.y0 || s.y > bx.y1) return;
  // ground bosses only take hits on the front; air bosses on the belly
  if (b.kind === 'ground' && s.kind !== 'fwd') return;
  if (b.kind !== 'ground' && s.kind !== 'up') return;
  s.dead = true;
  hitBoss(W, 1, s.x, s.y);
}

// ------------------------------------------------------------------ the main step
export function step(W, dt = STEP) {
  W.n++; W.t += dt;
  if (W.over) return;
  if (W.safeT > 0) W.safeT = Math.max(0, W.safeT - dt);
  const front = leadRover(W);
  // pace: the base speed eases from one checkpoint's value to the next
  if (front) {
    const k = W.seg, x0 = W.cpX[k], x1 = W.cpX[k + 1];
    if (W.boss) W.speed = W.R.speed;
    else if (x1 !== undefined && x1 > x0) {
      const f = clamp((front.x - x0) / (x1 - x0), 0, 1);
      const Rn = isBossSeg(W, k + 1) ? W.R : rampFor(W, k + 1);
      W.speed = W.R.speed + (Rn.speed - W.R.speed) * f;
    } else W.speed = W.R.speed;
    W.driveT += dt; W.secT += dt;
  }
  for (const R of W.rovers) stepRover(W, R, dt);
  if (front) spawnPending(W, Math.max(50, W.speed * (W.R.warn + radar(W)) + 34));
  stepEnemies(W, dt);
  stepBoss(W, dt);
  stepShots(W, dt);
  for (const R of W.rovers) collide(W, R);
  if (W.net === 'guest') { W.segT = (W.segT || 0) + dt; W.shots = W.shots.filter((s) => !s.dead); return; }
  // checkpoints
  const lead = leadRover(W);
  if (lead && !W.boss) {
    const next = W.cpX[W.seg + 1];
    if (next !== undefined && lead.x >= next && !(W.mode !== 'longhaul' && W.seg >= segCount(W))) {
      const k = W.seg + 1;
      const bonus = SCORE.checkpoint + Math.max(0, Math.round(SCORE.timeBonus * 10 - W.segT * 8));
      addScore(W, bonus);
      W.segT = 0;
      W.ev.push({ k: 'cp', i: k, letter: cpLetter(W, k), bonus, x: next });
      enterSegment(W, k, false);
    }
    // lay out the next segment's threats before the rover reaches it
    const nx = W.cpX[W.seg + 1];
    if (nx !== undefined && lead.x > nx - 90 && !isBossSeg(W, W.seg + 1)) genSegment(W, W.seg + 1);
  }
  W.segT = (W.segT || 0) + dt;
  // tidy up
  const back = (anyRover(W).x) - 34;
  const keep = (e) => !e.dead && e.x > back;
  W.rocks = W.rocks.filter(keep); W.mines = W.mines.filter(keep); W.tanks = W.tanks.filter(keep); W.shells = W.shells.filter(keep);
  W.flyers = W.flyers.filter((f) => !f.dead); W.bombs = W.bombs.filter((b) => !b.dead && b.x > back); W.drones = W.drones.filter((d) => !d.dead);
  W.shots = W.shots.filter((s) => !s.dead);
  if (W.craters.length > 40 || (W.craters.length && W.craters[0].x < back - 30)) W.craters = W.craters.filter((c) => c.x > back - 30);
  // deaths: a partner respawns beside the survivor; when nobody is left, back to the last checkpoint
  if (!lead) {
    W.deadT += dt;
    if (W.deadT >= F.respawn) {
      W.deadT = 0;
      if (W.lives <= 0) { W.over = true; W.result = 'over'; W.ev.push({ k: 'over' }); return; }
      restartAtCheckpoint(W);
    }
  } else {
    W.deadT = 0;
    for (const R of W.rovers) {
      if (R.alive || (R.remote && W.net !== 'host') || R.deadT < F.respawn + 0.6) continue;
      if (W.lives <= 0) continue;
      respawnRover(W, R, lead.x - 3, lead.vx);
    }
  }
  if (W.clearT > 0) {
    W.clearT -= dt;
    if (W.clearT <= 0) { W.over = true; W.result = 'clear'; addScore(W, SCORE.sector); W.ev.push({ k: 'clear' }); }
  }
}
function respawnRover(W, R, x, vx) {
  R.x = x; R.vx = vx; R.y = groundH(W, x) + 0.6; R.vy = 0; R.p = 0; R.pv = 0; R.air = true; R.jumping = false; R.airT = 0;
  R.alive = true; R.deadT = 0; R.inv = F.inv; R.lip = 0; R.buf = 0;
  R.shield = Math.max(R.shield, W.R.shield + (W.up.shield || 0));
  W.ev.push({ k: 'spawn', rid: R.id, x: R.x });
}
function restartAtCheckpoint(W) {
  const k = W.seg;
  const x = W.cpX[k] + 2;
  enterSegment(W, k, true);
  W.segT = 0;
  W.rovers.forEach((R, i) => { if (!R.remote || W.net === 'host') respawnRover(W, R, x - i * 2.5, W.R.speed); });
  W.ev.push({ k: 'restart', i: k, letter: cpLetter(W, k) });
}

// online guests: adopt the host's segment (its ramp values) without laying out a course
export function adoptSegment(W, k) { if (W.seg === k && W.R) return; W.seg = k; W.R = rampFor(W, k); if (W.mode === 'longhaul') { W.k = Math.floor(k / 7) % SECTORS.length; W.level = lhLevelAt(W, k); } }
export { hurt as _hurt };

export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }

// a forecast of the jump: [dx, height] samples for a given hold time (used by the autopilot and HUD)
export function jumpProfile(W, vx, hold) {
  const out = [];
  let y = 0, vy = jumpV(W), t = 0;
  const dt = 1 / 60;
  while (t < 4) {
    const held = t < hold && t < F.holdMax && vy > 0;
    vy -= F.gravity * (held ? F.holdG : 1) * dt;
    y += vy * dt; t += dt;
    out.push([vx * t, y, t]);
    if (y <= 0 && t > 0.1) break;
  }
  return out;
}
