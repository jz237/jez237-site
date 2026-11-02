// The belt: a deterministic 120 Hz simulation. Everything random comes from the world's own RNG
// (W.rs), so a cloned world fed the same ship inputs replays a fight exactly (instant replays).
// Nothing outside step() may change W during a recorded match.
import { F, ARENAS, POWERUPS, POWERUP_KEYS, PERKS } from './config.js?v=1';

export const STEP = 1 / 120;
const { AW, AH } = F;
const W2 = AW * 2, H2 = AH * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ wrap-around space
export function wrapX(x) { return x > AW ? x - W2 : x < -AW ? x + W2 : x; }
export function wrapZ(z) { return z > AH ? z - H2 : z < -AH ? z + H2 : z; }
// shortest offset from a to b across the wrap
export function dX(a, b) { let d = b - a; if (d > AW) d -= W2; else if (d < -AW) d += W2; return d; }
export function dZ(a, b) { let d = b - a; if (d > AH) d -= H2; else if (d < -AH) d += H2; return d; }
export function dist(a, b) { return Math.hypot(dX(a.x, b.x), dZ(a.z, b.z)); }
export const fwd = (a) => [Math.sin(a), -Math.cos(a)];
export const angleTo = (dx, dz) => Math.atan2(dx, -dz);
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU; return d; }

// ------------------------------------------------------------------ RNG (mulberry32, state in W.rs)
export function attachRand(W) {
  Object.defineProperty(W, 'rand', {
    enumerable: false, configurable: true,
    value: () => {
      let t = (W.rs = (W.rs + 0x6d2b79f5) >>> 0);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  });
  return W;
}
export const cloneWorld = (W) => attachRand(structuredClone(W));
const rr = (W, a, b) => a + W.rand() * (b - a);

// ------------------------------------------------------------------ world
const STATS = () => ({ shots: 0, hits: 0, rocks: 0, shards: 0, taken: 0, pickups: 0, dashes: 0, dodges: 0, gold: 0, rams: 0, eyes: 0 });

export function newShip(id, side, x, z, a, o = {}) {
  return {
    id, side, x, z, vx: 0, vz: 0, a, r: o.r ?? F.shipR, hp: o.hp ?? F.hull, max: o.hp ?? F.hull, alive: true,
    inv: 1.2, fireCD: 0.3, dashCD: 0.5, dashT: 0, od: 0, odTime: 0, shots: 0, eaten: 0, hitT: -9, thrustK: 0, portT: 0,
    look: o.look || 'ace', remote: false, noDamage: false,
    fx: { triple: 0, rapid: 0, shield: 0, shieldT: 0, missiles: 0, magnet: 0, phase: 0, chrono: 0, drone: 0, rail: 0 },
    input: { turn: 0, aim: null, thrust: 0, fire: false, dash: false, od: false },
  };
}

// o: { arena, seed, twists, perks: {1, -1}, hull: {1, -1}, looks: {1, -1}, boss: bool, diffBoss }
export function makeWorld(o = {}) {
  const A = ARENAS[o.arena ?? 0];
  const W = attachRand({
    t: 0, n: 0, rs: (o.seed >>> 0) || 1, nextId: 1, ai: o.arena ?? 0, arena: A, tw: { ...(o.twists || {}) },
    ships: [], bullets: [], rocks: [], orbs: [], mines: [], drones: [], wells: [], strikes: [], lanes: [], pending: [], arcs: [],
    portals: [], hole: null, boss: null, ev: [], over: false, winner: 0, overT: 0,
    stats: { 1: STATS(), '-1': STATS() }, perk: { 1: o.perks?.[1] || {}, '-1': o.perks?.[-1] || {} },
    waveT: 6, waves: 0, orbCD: 4, stormT: 6, cometT: 7, arcT: 0, bossDiff: o.diffBoss ?? 1, predict: false, claims: [],
  });
  const tiny = W.tw.tiny ? 0.6 : 1;
  const hullFor = (s) => (W.tw.glass ? 3 : o.hull?.[s] ?? F.hull);
  if (A.hazard === 'boss' && o.boss) {
    W.ships.push(newShip(W.nextId++, 1, 0, AH * 0.62, 0, { hp: o.hull?.[1] ?? F.bossHull, look: o.looks?.[1] }));
    makeBoss(W);
  } else {
    W.ships.push(newShip(W.nextId++, 1, -AW * 0.62, AH * 0.18, Math.PI / 2, { hp: hullFor(1), r: F.shipR * tiny, look: o.looks?.[1] }));
    W.ships.push(newShip(W.nextId++, -1, AW * 0.62, -AH * 0.18, -Math.PI / 2, { hp: hullFor(-1), r: F.shipR * tiny, look: o.looks?.[-1] }));
  }
  if (A.hazard === 'hole') W.hole = { x: 0, z: 0, m: 1 };
  if (A.hazard === 'comet') W.portals = [{ x: -AW * 0.55, z: -AH * 0.42 }, { x: AW * 0.55, z: AH * 0.42 }];
  const big = W.tw.mega ? 4 : 3;
  for (let i = 0; i < A.rocks; i++) spawnRock(W, big, null, i);
  return W;
}

export const shipsOf = (W, side) => W.ships.filter((s) => s.side === side);
export const shipOf = (W, side) => W.ships.find((s) => s.side === side) || null;
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
const emit = (W, e) => { W.ev.push(e); };

// ------------------------------------------------------------------ rocks
function pickKind(W) {
  const mix = W.arena.mix;
  let tot = 0;
  for (const k in mix) tot += mix[k];
  let r = W.rand() * tot;
  for (const k in mix) { r -= mix[k]; if (r <= 0) return k; }
  return 'stone';
}
function rockMass(size) { return size * size * size; }

// a fresh rock somewhere clear of the ships (edge: drift in from that side)
export function spawnRock(W, size, edge = null, i = 0) {
  let x = 0, z = 0;
  for (let tries = 0; tries < 30; tries++) {
    if (edge === 0) { x = -AW; z = rr(W, -AH, AH); }
    else if (edge === 1) { x = AW; z = rr(W, -AH, AH); }
    else if (edge === 2) { z = -AH; x = rr(W, -AW, AW); }
    else if (edge === 3) { z = AH; x = rr(W, -AW, AW); }
    else { x = rr(W, -AW, AW); z = rr(W, -AH, AH); }
    let ok = true;
    for (const s of W.ships) if (Math.hypot(dX(x, s.x), dZ(z, s.z)) < 11) ok = false;
    if (W.hole && Math.hypot(x, z) < 8) ok = false;
    if (W.boss && Math.hypot(dX(x, W.boss.x), dZ(z, W.boss.z)) < W.boss.r + 5) ok = false;
    if (ok) break;
  }
  const [lo, hi] = F.rockSpeed[size];
  let ang = W.rand() * TAU;
  if (edge === 0) ang = rr(W, 0.4, 2.7);
  else if (edge === 1) ang = -rr(W, 0.4, 2.7);
  else if (edge === 2) ang = Math.PI + rr(W, -1.1, 1.1);
  else if (edge === 3) ang = rr(W, -1.1, 1.1);
  const sp = rr(W, lo, hi);
  return addRock(W, { x, z, vx: Math.sin(ang) * sp, vz: -Math.cos(ang) * sp, size, kind: pickKind(W) });
}

function addRock(W, o) {
  const r = {
    id: W.nextId++, x: o.x, z: o.z, vx: o.vx, vz: o.vz, size: o.size, r: F.rockR[o.size], hp: o.hp ?? F.rockHP[o.size],
    kind: o.kind || 'stone', seed: (W.rand() * 1e6) | 0, owner: o.owner || 0, ownT: o.ownT || 0, hitT: -9, born: W.t,
    life: o.life ?? -1, portT: 0,
  };
  if (r.kind === 'gold') r.hp += 1;
  W.rocks.push(r);
  return r;
}

// a rock breaks: score, children, drops and side effects. by = side that broke it (0 = nobody)
function breakRock(W, rock, by, dirx = 0, dirz = 0, cause = 'shot') {
  const i = W.rocks.indexOf(rock);
  if (i < 0) return;
  W.rocks.splice(i, 1);
  emit(W, { k: 'rock', id: rock.id, x: rock.x, z: rock.z, size: rock.size, kind: rock.kind, side: by, cause, vx: rock.vx, vz: rock.vz });
  if (by) {
    const st = W.stats[by];
    st.rocks++;
    if (rock.kind === 'gold') st.gold++;
    const s = shipOf(W, by);
    if (s) s.od = Math.min(F.odMax, s.od + [0, 3, 4, 6, 8][rock.size] * (W.perk[by].od || 1));
  }
  // children
  if (rock.size > 1 && rock.kind !== 'comet') {
    const n = rock.kind === 'ice' && rock.size === 2 ? 3 : 2;
    const base = Math.atan2(rock.vz, rock.vx);
    const dl = Math.hypot(dirx, dirz) || 1;
    for (let c = 0; c < n; c++) {
      const a = base + (c - (n - 1) / 2) * 1.9 + rr(W, -0.35, 0.35);
      const [lo, hi] = F.rockSpeed[rock.size - 1];
      const sp = rr(W, lo, hi) * 0.85;
      let vx = rock.vx * 0.55 + Math.cos(a) * sp, vz = rock.vz * 0.55 + Math.sin(a) * sp;
      if (by && cause !== 'blast') {
        const kick = F.shardKick * (W.perk[by].shard ? 1.35 : 1);
        vx += (dirx / dl) * kick; vz += (dirz / dl) * kick;
      }
      const off = F.rockR[rock.size - 1] * 0.7;
      const kind = rock.kind === 'gold' ? 'stone' : rock.kind;
      addRock(W, { x: wrapX(rock.x + Math.cos(a) * off), z: wrapZ(rock.z + Math.sin(a) * off), vx, vz, size: rock.size - 1, kind,
        owner: by && cause !== 'blast' ? by : 0, ownT: by && cause !== 'blast' ? F.ownTime : 0 });
    }
  }
  // power-up drops
  const drops = W.perk[by]?.drops || 1;
  const chance = rock.kind === 'gold' ? 1 : [0, 0.03, 0.06, 0.11, 0.18][rock.size] * drops * (W.tw.gold ? 3 : 1);
  const maxOrbs = W.tw.gold ? 5 : F.maxOrbs;
  if (!W.predict && W.orbs.length < maxOrbs && (rock.kind === 'gold' || W.orbCD <= 0) && W.rand() < chance) {
    spawnOrb(W, rock.x, rock.z, rock.vx * 0.3, rock.vz * 0.3);
  }
  if (rock.kind === 'volatile') blast(W, rock.x, rock.z, 5.5, 2, by, 'blast', true);
}

function spawnOrb(W, x, z, vx, vz, kind) {
  let k = kind;
  if (!k) {
    let tot = 0;
    for (const p of POWERUP_KEYS) if (p !== W.lastOrb) tot += POWERUPS[p].w;
    let r = W.rand() * tot;
    for (const p of POWERUP_KEYS) { if (p === W.lastOrb) continue; r -= POWERUPS[p].w; if (r <= 0) { k = p; break; } }
    k = k || 'triple';
  }
  W.lastOrb = k;
  W.orbCD = 2.5;
  const o = { id: W.nextId++, kind: k, x, z, vx, vz, life: F.orbLife, born: W.t };
  W.orbs.push(o);
  emit(W, { k: 'orb', id: o.id, kind: k, x, z });
  return o;
}

// area damage: volatile rocks, mines, nova bombs, the storm. hurts every ship in range except `spare`
function blast(W, x, z, r, dmg, by, src, chain, spare = 0) {
  emit(W, { k: 'boom', x, z, r, side: by, src });
  for (const s of W.ships) {
    if (!s.alive || s.side === spare) continue;
    const dx = dX(x, s.x), dz = dZ(z, s.z), d = Math.hypot(dx, dz);
    if (d > r + s.r) continue;
    const push = 14 * (1 - d / (r + s.r)) + 4;
    if (!s.remote || !W.predict) { s.vx += (dx / (d || 1)) * push; s.vz += (dz / (d || 1)) * push; }
    damageShip(W, s, dmg, src, by, s.x, s.z, { area: true });
  }
  if (chain) {
    for (const k of W.rocks.slice()) {
      if (Math.hypot(dX(x, k.x), dZ(z, k.z)) < r + k.r * 0.5) breakRock(W, k, by, 0, 0, 'blast');
    }
  }
  if (W.boss && by === 1) {
    for (const e of W.boss.eyes) if (e.hp > 0 && Math.hypot(dX(x, e.x), dZ(z, e.z)) < r) hurtBoss(W, e, 2, x, z);
  }
}

// ------------------------------------------------------------------ damage
// returns true when it hurt. o.area: blasts reach ships that are otherwise only hurt by reports
export function damageShip(W, s, dmg, src, by, x, z, o = {}) {
  if (!s.alive || W.over) return false;
  if (s.noDamage && !o.area && !o.claim) return false;
  if (W.predict && s.remote) return false;
  if (W.predict && o.area && !o.claim) return false;
  if (s.dashT > 0 && !o.area && !o.claim) { emit(W, { k: 'dodge', side: s.side, x: s.x, z: s.z }); W.stats[s.side].dodges++; return false; }
  if (s.inv > 0 && !o.claim) return false;
  if (s.fx.shield > 0 && src !== 'hole') {
    s.fx.shield--;
    s.inv = 0.4;
    emit(W, { k: 'shield', side: s.side, x: s.x, z: s.z, left: s.fx.shield });
    return false;
  }
  s.hp = Math.max(0, s.hp - dmg);
  s.inv = F.inv;
  s.hitT = W.t;
  s.od = Math.min(F.odMax, s.od + 7 * dmg);
  W.stats[s.side].taken += dmg;
  if (by && by !== s.side) { W.stats[by].hits++; if (src === 'shard') W.stats[by].shards++; if (src === 'ram') W.stats[by].rams++; }
  emit(W, { k: 'hit', side: s.side, by, dmg, src, x: x ?? s.x, z: z ?? s.z, hp: s.hp, claim: o.claimed ? 1 : 0, ref: o.ref });
  if (s.hp <= 0 && !W.predict) knockOut(W, s.side, s.x, s.z);
  return true;
}

function knockOut(W, side, x, z, boss = false) {
  if (W.over) return;
  W.over = true;
  W.winner = -side;
  W.overT = W.t;
  const s = shipOf(W, side);
  if (s && !boss) { s.alive = false; s.vx *= 0.3; s.vz *= 0.3; }
  emit(W, { k: 'ko', winner: -side, side, x, z, boss });
}

// ------------------------------------------------------------------ the boss: a hive of rock with four eyes,
// then a burning core once the shell breaks
function makeBoss(W) {
  const B = { x: 0, z: -AH * 0.18, vx: 0, vz: 0, r: 5.6, rot: 0, phase: 1, eyes: [], core: { hp: 36, max: 36, r: 3.1 }, t: 0,
    spitT: 6, beam: null, beamT: 9, ringT: 5, hitT: -9 };
  for (let i = 0; i < 4; i++) B.eyes.push({ i, ang: (i / 4) * TAU + Math.PI / 4, hp: 12, max: 12, cd: 1.2 + i * 0.55, x: 0, z: 0, hitT: -9, open: 1, openT: 2 + i * 0.9 });
  W.boss = B;
  placeEyes(B);
}
function placeEyes(B) {
  for (const e of B.eyes) { e.x = wrapX(B.x + Math.sin(e.ang + B.rot) * B.r * 0.92); e.z = wrapZ(B.z - Math.cos(e.ang + B.rot) * B.r * 0.92); }
}
export const bossHP = (B) => B.eyes.reduce((a, e) => a + Math.max(0, e.hp), 0) + B.core.hp;
export const bossMax = (B) => B.eyes.reduce((a, e) => a + e.max, 0) + B.core.max;

function hurtBoss(W, part, dmg, x, z) {
  const B = W.boss;
  if (!B || W.over) return;
  if (part === B.core) {
    if (B.phase < 2) return;
    B.core.hp = Math.max(0, B.core.hp - dmg);
    B.hitT = W.t;
    emit(W, { k: 'bosshit', part: 'core', x, z, hp: B.core.hp });
    if (B.core.hp <= 0) knockOut(W, -1, B.x, B.z, true);
    return;
  }
  if (part.hp <= 0) return;
  part.hp = Math.max(0, part.hp - dmg);
  part.hitT = W.t;
  emit(W, { k: 'bosshit', part: 'eye', i: part.i, x, z, hp: part.hp });
  if (part.hp <= 0) {
    W.stats[1].eyes++;
    const left = B.eyes.filter((e) => e.hp > 0).length;
    emit(W, { k: 'eyedown', i: part.i, x: part.x, z: part.z, left });
    blast(W, part.x, part.z, 3, 0, 1, 'blast', true, 1);
    if (!left) {
      B.phase = 2;
      B.r = B.core.r;
      B.beam = null; B.beamT = 4; B.ringT = 3;
      emit(W, { k: 'phase2', x: B.x, z: B.z });
      // the shell breaks off into rocks
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        addRock(W, { x: wrapX(B.x + Math.cos(a) * 5), z: wrapZ(B.z + Math.sin(a) * 5), vx: Math.cos(a) * 6, vz: Math.sin(a) * 6, size: i % 2 ? 3 : 2, kind: i % 3 ? 'stone' : 'volatile' });
      }
    }
  }
}

function stepBoss(W, dt) {
  const B = W.boss, k = W.bossDiff;
  const P = shipOf(W, 1);
  B.t += dt;
  B.rot += dt * (B.phase === 2 ? 0.0 : 0.16);
  // drift: lazily toward the player, keeping its distance
  if (P && P.alive) {
    const dx = dX(B.x, P.x), dz = dZ(B.z, P.z), d = Math.hypot(dx, dz) || 1;
    const want = B.phase === 2 ? 9 : 13;
    const acc = (d - want) * (B.phase === 2 ? 0.55 : 0.25);
    B.vx += (dx / d) * acc * dt; B.vz += (dz / d) * acc * dt;
  }
  const dr = Math.exp(-dt * 0.8);
  B.vx *= dr; B.vz *= dr;
  const sp = Math.hypot(B.vx, B.vz), cap = B.phase === 2 ? 6 : 3;
  if (sp > cap) { B.vx *= cap / sp; B.vz *= cap / sp; }
  B.x = wrapX(B.x + B.vx * dt); B.z = wrapZ(B.z + B.vz * dt);
  placeEyes(B);
  // the eyes blink: shut eyes shrug off shots
  for (const e of B.eyes) {
    e.openT -= dt;
    if (e.openT <= 0) { e.open = e.open ? 0 : 1; e.openT = e.open ? rr(W, 2.6, 3.6) : rr(W, 1.4, 2.1); emit(W, { k: e.open ? 'eyeopen' : 'eyeshut', i: e.i, x: e.x, z: e.z }); }
  }
  if (!P || !P.alive || W.over) return;
  // eyes fire aimed shots
  if (B.phase === 1) {
    for (const e of B.eyes) {
      if (e.hp <= 0 || !e.open) continue;
      e.cd -= dt * k;
      if (e.cd <= 0) {
        e.cd = rr(W, 1.7, 2.6);
        const dx = dX(e.x, P.x), dz = dZ(e.z, P.z), d = Math.hypot(dx, dz) || 1;
        const lead = d / 26;
        const tx = dx + P.vx * lead * 0.6, tz = dz + P.vz * lead * 0.6, tl = Math.hypot(tx, tz) || 1;
        addBullet(W, -1, 0, e.x, e.z, (tx / tl) * 26, (tz / tl) * 26, { kind: 'boss', life: 1.6 });
        emit(W, { k: 'bossfire', x: e.x, z: e.z });
      }
    }
  } else {
    // the core: radial rings of shards and a strong pull
    B.ringT -= dt * k;
    if (B.ringT <= 0) {
      B.ringT = rr(W, 3.6, 4.6);
      const n = 14, off = W.rand() * TAU;
      for (let i = 0; i < n; i++) {
        const a = off + (i / n) * TAU;
        addBullet(W, -1, 0, B.x + Math.sin(a) * B.r, B.z - Math.cos(a) * B.r, Math.sin(a) * 17, -Math.cos(a) * 17, { kind: 'boss', life: 2.2 });
      }
      emit(W, { k: 'bossfire', x: B.x, z: B.z, ring: 1 });
    }
  }
  // spit rocks at the player
  B.spitT -= dt * k;
  if (B.spitT <= 0) {
    B.spitT = B.phase === 2 ? rr(W, 5, 7) : rr(W, 6.5, 8.5);
    const dx = dX(B.x, P.x), dz = dZ(B.z, P.z), d = Math.hypot(dx, dz) || 1;
    for (let i = 0; i < 2; i++) {
      const sx = (dx / d), sz = (dz / d), side = i ? 0.35 : -0.35;
      const vx = (sx * Math.cos(side) - sz * Math.sin(side)) * 8, vz = (sx * Math.sin(side) + sz * Math.cos(side)) * 8;
      addRock(W, { x: wrapX(B.x + sx * (B.r + 2)), z: wrapZ(B.z + sz * (B.r + 2)), vx, vz, size: 2, kind: W.rand() < 0.4 ? 'volatile' : 'stone' });
    }
    emit(W, { k: 'spit', x: B.x, z: B.z });
  }
  // the beam: charge (tracking), then fire (sweeping slowly)
  if (!B.beam) {
    B.beamT -= dt * k;
    if (B.beamT <= 0) {
      B.beam = { state: 'charge', t: 1.7, ang: angleTo(dX(B.x, P.x), dZ(B.z, P.z)) };
      emit(W, { k: 'beamcharge', x: B.x, z: B.z });
    }
  } else {
    const bm = B.beam;
    bm.t -= dt;
    const want = angleTo(dX(B.x, P.x), dZ(B.z, P.z));
    bm.ang += clamp(angDiff(bm.ang, want), -1, 1) * dt * (bm.state === 'charge' ? 2.2 : 0.45);
    if (bm.state === 'charge' && bm.t <= 0) { bm.state = 'fire'; bm.t = 1.1; emit(W, { k: 'beam', x: B.x, z: B.z, ang: bm.ang }); }
    else if (bm.state === 'fire') {
      // hits the player along the ray (both wrap copies of the ray are not modelled: the beam is 40 long)
      const [fx, fz] = fwd(bm.ang);
      const dx = dX(B.x, P.x), dz = dZ(B.z, P.z);
      const along = dx * fx + dz * fz, across = Math.abs(dx * fz - dz * fx);
      if (along > 0 && along < 44 && across < 1.4 + P.r) damageShip(W, P, 3, 'beam', -1, P.x, P.z);
      for (const r of W.rocks.slice()) {
        const rx = dX(B.x, r.x), rz = dZ(B.z, r.z), al = rx * fx + rz * fz, ac = Math.abs(rx * fz - rz * fx);
        if (al > 0 && al < 44 && ac < 1.2 + r.r) breakRock(W, r, 0, fx, fz, 'beam');
      }
      if (bm.t <= 0) { B.beam = null; B.beamT = B.phase === 2 ? rr(W, 6.5, 8) : rr(W, 9, 12); }
    }
  }
  // body contact
  if (P.alive) {
    const dx = dX(B.x, P.x), dz = dZ(B.z, P.z), d = Math.hypot(dx, dz);
    if (d < B.r + P.r) {
      const nx = dx / (d || 1), nz = dz / (d || 1);
      P.x = wrapX(B.x + nx * (B.r + P.r + 0.05)); P.z = wrapZ(B.z + nz * (B.r + P.r + 0.05));
      const vn = P.vx * nx + P.vz * nz;
      if (vn < 8) { P.vx += nx * (8 - vn); P.vz += nz * (8 - vn); }
      damageShip(W, P, 1, 'rock', -1, P.x, P.z);
      emit(W, { k: 'bump', side: 1, x: P.x, z: P.z, k2: 1 });
    }
    // phase 2: the core drags you in
    if (B.phase === 2 && d > B.r) {
      const pull = 70 / (d * d + 30);
      P.vx -= (dx / (d || 1)) * pull * dt * 6; P.vz -= (dz / (d || 1)) * pull * dt * 6;
    }
  }
}

// ------------------------------------------------------------------ bullets
function addBullet(W, side, shipId, x, z, vx, vz, o = {}) {
  const b = { id: W.nextId++, side, ship: shipId, x: wrapX(x), z: wrapZ(z), vx, vz, life: o.life ?? F.shotLife, dmg: o.dmg ?? 1,
    kind: o.kind || 'shot', pierce: !!o.pierce, home: o.home || 0, hits: [], born: W.t, portT: 0, local: W.predict ? 1 : 0 };
  W.bullets.push(b);
  return b;
}

function fireShip(W, s) {
  const perk = W.perk[s.side];
  const [fx, fz] = fwd(s.a);
  s.shots++;
  const od = s.odTime > 0;
  let kind = 'shot', speed = F.shotSpeed, dmg = 1, life = F.shotLife, pierce = od, home = 0;
  if (s.fx.rail > 0 || (perk.rail && s.shots % perk.rail === 0)) { kind = 'rail'; speed = 72; dmg = 2; life = 0.62; pierce = true; }
  else if (s.fx.missiles > 0) { kind = 'missile'; speed = 30; life = 1.5; home = 1; }
  if (perk.lock && kind === 'shot') home = 2; // gentle lock-on
  const angs = s.fx.triple > 0 ? [-0.17, 0, 0.17] : [0];
  const offs = W.tw.twin ? [-0.45, 0.45] : [0];
  const inherit = 0.5;
  for (const da of angs) {
    const a = s.a + da;
    const ax = Math.sin(a), az = -Math.cos(a);
    for (const off of offs) {
      const ox = -fz * off, oz = fx * off;
      addBullet(W, s.side, s.id, s.x + fx * (s.r + 0.35) + ox, s.z + fz * (s.r + 0.35) + oz,
        ax * speed + s.vx * inherit, az * speed + s.vz * inherit, { kind, dmg, life, pierce, home });
    }
  }
  W.stats[s.side].shots++;
  emit(W, { k: 'fire', side: s.side, id: s.id, x: s.x, z: s.z, kind, n: angs.length * offs.length });
  let cd = F.fireCD;
  if (s.fx.rapid > 0) cd *= 0.5;
  if (od) cd *= 0.55;
  if (kind === 'rail') cd *= 1.6;
  if (kind === 'missile') cd *= 1.35;
  s.fireCD = cd;
}

// the nearest thing a homing shot should chase
function homingTarget(W, b) {
  let best = null, bd = b.home === 2 ? 16 : 26;
  for (const s of W.ships) {
    if (!s.alive || s.side === b.side) continue;
    const d = Math.hypot(dX(b.x, s.x), dZ(b.z, s.z));
    if (d < bd) { bd = d; best = s; }
  }
  if (W.boss && b.side === 1) {
    const B = W.boss;
    const parts = B.phase === 2 ? [B.core] : B.eyes.filter((e) => e.hp > 0);
    for (const p of parts) {
      const px = p === B.core ? B.x : p.x, pz = p === B.core ? B.z : p.z;
      const d = Math.hypot(dX(b.x, px), dZ(b.z, pz));
      if (d < bd) { bd = d; best = { x: px, z: pz }; }
    }
  }
  if (!best && b.home === 1) {
    for (const r of W.rocks) {
      const d = Math.hypot(dX(b.x, r.x), dZ(b.z, r.z));
      if (d < Math.min(bd, 16)) { bd = d; best = r; }
    }
  }
  return best;
}

// ------------------------------------------------------------------ main step
export function step(W, dt) {
  if (W.tw.hyper) dt *= 1.35;
  W.t += dt;
  W.n++;
  const auth = !W.predict;
  W.orbCD -= dt;
  // chrono fields: who is slowed (the rival and rocks near a chrono owner)
  const chronos = W.ships.filter((s) => s.alive && s.fx.chrono > 0);
  const slowAt = (x, z, side) => {
    for (const c of chronos) if (c.side !== side && Math.hypot(dX(c.x, x), dZ(c.z, z)) < 12) return 0.42;
    return 1;
  };

  // ---------------------------------------------------------- ships
  for (const s of W.ships) {
    const inp = s.input;
    s.inv = Math.max(0, s.inv - dt);
    s.fireCD -= dt;
    s.dashCD -= dt;
    s.portT -= dt;
    for (const k in s.fx) if (k !== 'shield' && s.fx[k] > 0) s.fx[k] = Math.max(0, s.fx[k] - dt);
    if (s.fx.shield > 0) { s.fx.shieldT -= dt; if (s.fx.shieldT <= 0) { s.fx.shield = 0; } }
    if (s.odTime > 0) { s.odTime -= dt; if (s.odTime <= 0) { s.odTime = 0; emit(W, { k: 'odend', side: s.side }); } }
    if (!s.alive) {
      s.x = wrapX(s.x + s.vx * dt); s.z = wrapZ(s.z + s.vz * dt);
      continue;
    }
    if (s.remote) {
      // the other player's ship, as last reported, carried forward
      s.x = wrapX(s.x + s.vx * dt); s.z = wrapZ(s.z + s.vz * dt);
      continue;
    }
    const k = slowAt(s.x, s.z, s.side);
    const sdt = dt * k;
    // steering
    if (inp.aim !== null && inp.aim !== undefined) {
      const d = angDiff(s.a, inp.aim);
      const mx = F.turn * 1.15 * sdt;
      s.a += clamp(d, -mx, mx);
    } else s.a += clamp(inp.turn || 0, -1, 1) * F.turn * sdt;
    if (s.a > Math.PI) s.a -= TAU; else if (s.a < -Math.PI) s.a += TAU;
    const [fx, fz] = fwd(s.a);
    const th = clamp(inp.thrust || 0, -F.brake, 1);
    s.thrustK = th;
    const od = s.odTime > 0;
    s.vx += fx * F.thrust * th * sdt * (od ? 1.2 : 1);
    s.vz += fz * F.thrust * th * sdt * (od ? 1.2 : 1);
    // dash
    if (inp.dash) {
      inp.dash = false;
      if (s.dashCD <= 0) {
        s.dashT = F.dashTime;
        s.dashCD = F.dashCD * (W.perk[s.side].dashCD || 1);
        const sp = Math.hypot(s.vx, s.vz);
        s.vx = fx * F.dashSpeed + s.vx * 0.25; s.vz = fz * F.dashSpeed + s.vz * 0.25;
        W.stats[s.side].dashes++;
        emit(W, { k: 'dash', side: s.side, x: s.x, z: s.z, sp });
      }
    }
    if (inp.od) {
      inp.od = false;
      if (s.od >= F.odMax && s.odTime <= 0) { s.odTime = F.odTime; s.od = 0; emit(W, { k: 'od', side: s.side, x: s.x, z: s.z }); }
    }
    if (s.dashT > 0) s.dashT -= dt;
    else {
      if (!W.tw.drift) { const dr = Math.exp(-F.drag * sdt); s.vx *= dr; s.vz *= dr; }
      const sp = Math.hypot(s.vx, s.vz), cap = F.maxSpeed * (od ? 1.25 : 1);
      if (sp > cap) { const f2 = Math.max(cap / sp, Math.exp(-sdt * 4)); s.vx *= f2; s.vz *= f2; }
    }
    // gravity
    if (W.hole) gravity(W, s, W.hole.x, W.hole.z, 55, sdt);
    for (const w of W.wells) if (w.side !== s.side) gravity(W, s, w.x, w.z, 40, sdt);
    s.x = wrapX(s.x + s.vx * sdt);
    s.z = wrapZ(s.z + s.vz * sdt);
    portal(W, s, true);
    // the black hole: too close and it spits you out, hurt
    if (W.hole) {
      const d = Math.hypot(s.x - W.hole.x, s.z - W.hole.z);
      if (d < 2.1) {
        const a = Math.atan2(s.vz, s.vx) + 0.8;
        s.vx = Math.cos(a) * 24; s.vz = Math.sin(a) * 24;
        s.x = wrapX(W.hole.x + Math.cos(a) * 2.6); s.z = wrapZ(W.hole.z + Math.sin(a) * 2.6);
        emit(W, { k: 'eat', x: W.hole.x, z: W.hole.z, ship: s.side });
        damageShip(W, s, 2, 'hole', 0, s.x, s.z, { area: true });
      }
    }
    // weapons
    if (inp.fire && s.fireCD <= 0 && !W.over) fireShip(W, s);
    // magnet: power-ups come to you
    if (s.fx.magnet > 0) {
      for (const o of W.orbs) {
        const dx = dX(o.x, s.x), dz = dZ(o.z, s.z), d = Math.hypot(dx, dz);
        if (d < 16 && d > 0.01) { o.vx += (dx / d) * 30 * dt; o.vz += (dz / d) * 30 * dt; }
      }
      for (const r of W.rocks) {
        if (r.kind !== 'gold') continue;
        const dx = dX(r.x, s.x), dz = dZ(r.z, s.z), d = Math.hypot(dx, dz);
        if (d < 16 && d > 0.01) { r.vx += (dx / d) * 6 * dt; r.vz += (dz / d) * 6 * dt; }
      }
    }
  }

  // ---------------------------------------------------------- drones
  for (let i = W.drones.length - 1; i >= 0; i--) {
    const d = W.drones[i];
    const s = W.ships.find((q) => q.id === d.ship);
    d.life -= dt;
    if (!s || !s.alive || d.life <= 0) { W.drones.splice(i, 1); continue; }
    d.ang += dt * 2.4;
    d.x = wrapX(s.x + Math.cos(d.ang) * 2.4); d.z = wrapZ(s.z + Math.sin(d.ang) * 2.4);
    d.fireT -= dt;
    if (d.fireT <= 0 && !W.over && auth) {
      let tgt = null, bd = 24;
      for (const o of W.ships) { if (!o.alive || o.side === d.side) continue; const q = Math.hypot(dX(d.x, o.x), dZ(d.z, o.z)); if (q < bd) { bd = q; tgt = o; } }
      if (!tgt && W.boss && d.side === 1) {
        const B = W.boss;
        for (const p of (B.phase === 2 ? [{ x: B.x, z: B.z }] : B.eyes.filter((e) => e.hp > 0))) { const q = Math.hypot(dX(d.x, p.x), dZ(d.z, p.z)); if (q < bd) { bd = q; tgt = p; } }
      }
      if (!tgt) { bd = 15; for (const r of W.rocks) { const q = Math.hypot(dX(d.x, r.x), dZ(d.z, r.z)); if (q < bd) { bd = q; tgt = r; } } }
      if (tgt) {
        const dx = dX(d.x, tgt.x), dz = dZ(d.z, tgt.z), l = Math.hypot(dx, dz) || 1;
        const lead = l / 40;
        const tx = dx + (tgt.vx || 0) * lead, tz = dz + (tgt.vz || 0) * lead, tl = Math.hypot(tx, tz) || 1;
        addBullet(W, d.side, d.ship, d.x, d.z, (tx / tl) * 40, (tz / tl) * 40, { kind: 'drone', life: 0.7 });
        emit(W, { k: 'fire', side: d.side, x: d.x, z: d.z, kind: 'drone', n: 1 });
        d.fireT = 0.5;
      } else d.fireT = 0.2;
    }
  }

  // ---------------------------------------------------------- wells
  for (let i = W.wells.length - 1; i >= 0; i--) {
    const w = W.wells[i];
    w.life -= dt;
    const dr = Math.exp(-dt * 1.6);
    w.vx *= dr; w.vz *= dr;
    w.x = wrapX(w.x + w.vx * dt); w.z = wrapZ(w.z + w.vz * dt);
    if (w.life <= 0) { W.wells.splice(i, 1); emit(W, { k: 'wellend', x: w.x, z: w.z }); }
  }

  // ---------------------------------------------------------- bullets
  for (let i = W.bullets.length - 1; i >= 0; i--) {
    const b = W.bullets[i];
    b.life -= dt;
    b.portT -= dt;
    if (b.life <= 0 || b.dead) { W.bullets.splice(i, 1); continue; }
    if (b.home) {
      const tg = homingTarget(W, b);
      if (tg) {
        const sp = Math.hypot(b.vx, b.vz);
        const dx = dX(b.x, tg.x), dz = dZ(b.z, tg.z), l = Math.hypot(dx, dz) || 1;
        const turn = b.home === 2 ? 2.2 : 6;
        b.vx += ((dx / l) * sp - b.vx) * Math.min(1, turn * dt);
        b.vz += ((dz / l) * sp - b.vz) * Math.min(1, turn * dt);
        const s2 = Math.hypot(b.vx, b.vz) || 1;
        b.vx *= sp / s2; b.vz *= sp / s2;
      }
    }
    if (W.hole) gravity(W, b, W.hole.x, W.hole.z, 110, dt);
    for (const w of W.wells) if (w.side !== b.side) gravity(W, b, w.x, w.z, 60, dt);
    const k = b.side === 0 ? 1 : slowAt(b.x, b.z, b.side);
    b.x = wrapX(b.x + b.vx * dt * k); b.z = wrapZ(b.z + b.vz * dt * k);
    portal(W, b, false);
    if (W.hole && Math.hypot(b.x - W.hole.x, b.z - W.hole.z) < 1.4) { W.bullets.splice(i, 1); continue; }
    if (bulletHits(W, b)) W.bullets.splice(W.bullets.indexOf(b), 1);
  }

  // ---------------------------------------------------------- rocks
  for (let i = W.rocks.length - 1; i >= 0; i--) {
    const r = W.rocks[i];
    if (r.ownT > 0) { r.ownT -= dt; if (r.ownT <= 0) r.owner = 0; }
    r.portT -= dt;
    if (r.life > 0) { r.life -= dt; if (r.life <= 0) { W.rocks.splice(i, 1); continue; } }
    const k = slowAt(r.x, r.z, 0);
    if (W.hole) gravity(W, r, W.hole.x, W.hole.z, 45, dt * k);
    for (const w of W.wells) gravity(W, r, w.x, w.z, 70, dt * k);
    if (r.kind === 'gold' && auth) {
      // golden rocks shy away from ships
      for (const s of W.ships) {
        if (!s.alive || s.fx.magnet > 0) continue;
        const dx = dX(s.x, r.x), dz = dZ(s.z, r.z), d = Math.hypot(dx, dz);
        if (d < 9 && d > 0.01) { r.vx += (dx / d) * 3.2 * dt; r.vz += (dz / d) * 3.2 * dt; }
      }
      const sp = Math.hypot(r.vx, r.vz);
      if (sp > 7.5) { r.vx *= 7.5 / sp; r.vz *= 7.5 / sp; }
    }
    r.x = wrapX(r.x + r.vx * dt * k); r.z = wrapZ(r.z + r.vz * dt * k);
    portal(W, r, false);
    // swallowed
    if (auth) {
      let eaten = W.hole && Math.hypot(r.x - W.hole.x, r.z - W.hole.z) < 1.5 + r.r * 0.3;
      for (const w of W.wells) if (Math.hypot(dX(w.x, r.x), dZ(w.z, r.z)) < 0.8 + r.r * 0.3 && r.size <= 2) eaten = true;
      if (eaten) { W.rocks.splice(i, 1); emit(W, { k: 'eat', x: r.x, z: r.z, size: r.size }); continue; }
    }
  }
  // rock vs ship
  for (const s of W.ships) {
    if (!s.alive || s.noDamage || (W.predict && s.remote)) continue;
    for (const r of W.rocks.slice()) {
      const dx = dX(r.x, s.x), dz = dZ(r.z, s.z);
      const rad = r.r + s.r * 0.82;
      if (Math.abs(dx) > rad || Math.abs(dz) > rad) continue;
      const d = Math.hypot(dx, dz);
      if (d >= rad) continue;
      if (s.fx.phase > 0) continue;
      rockMeetsShip(W, r, s, dx, dz, d, rad);
    }
  }

  // ---------------------------------------------------------- orbs
  for (let i = W.orbs.length - 1; i >= 0; i--) {
    const o = W.orbs[i];
    o.life -= dt;
    if (o.life <= 0) { W.orbs.splice(i, 1); emit(W, { k: 'orbgone', id: o.id, x: o.x, z: o.z }); continue; }
    const dr = Math.exp(-dt * 0.9);
    o.vx *= dr; o.vz *= dr;
    if (W.hole) gravity(W, o, W.hole.x, W.hole.z, 25, dt);
    o.x = wrapX(o.x + o.vx * dt); o.z = wrapZ(o.z + o.vz * dt);
    if (!auth) continue;
    for (const s of W.ships) {
      if (!s.alive) continue;
      if (Math.hypot(dX(o.x, s.x), dZ(o.z, s.z)) < s.r + 1.0) { W.orbs.splice(i, 1); collect(W, s, o.kind, o.x, o.z, false); break; }
    }
  }

  // ---------------------------------------------------------- mines
  for (let i = W.mines.length - 1; i >= 0; i--) {
    const m = W.mines[i];
    m.armT -= dt; m.life -= dt;
    const dr = Math.exp(-dt * 2);
    m.vx *= dr; m.vz *= dr;
    m.x = wrapX(m.x + m.vx * dt); m.z = wrapZ(m.z + m.vz * dt);
    if (!auth) continue;
    let go = m.life <= 0;
    if (m.armT <= 0 && !go) {
      for (const s of W.ships) if (s.alive && s.side !== m.side && Math.hypot(dX(m.x, s.x), dZ(m.z, s.z)) < 2.8 + s.r) go = true;
      if (!go) for (const r of W.rocks) if (Math.hypot(dX(m.x, r.x), dZ(m.z, r.z)) < r.r + 0.5) { go = true; break; }
      if (!go && W.boss && m.side === 1 && Math.hypot(dX(m.x, W.boss.x), dZ(m.z, W.boss.z)) < W.boss.r + 1.5) go = true;
    }
    if (go) {
      W.mines.splice(i, 1);
      emit(W, { k: 'mineboom', x: m.x, z: m.z, side: m.side });
      blast(W, m.x, m.z, 4.6, 2, m.side, 'mine', true, m.side);
      if (W.boss && m.side === 1 && W.boss.phase === 2 && Math.hypot(dX(m.x, W.boss.x), dZ(m.z, W.boss.z)) < W.boss.r + 3) hurtBoss(W, W.boss.core, 3, m.x, m.z);
    }
  }

  // ---------------------------------------------------------- ship vs ship
  for (let i = 0; i < W.ships.length; i++) {
    for (let j = i + 1; j < W.ships.length; j++) {
      const a = W.ships[i], c = W.ships[j];
      if (!a.alive || !c.alive) continue;
      const dx = dX(a.x, c.x), dz = dZ(a.z, c.z), d = Math.hypot(dx, dz), rad = a.r + c.r;
      if (d >= rad || d < 1e-4) continue;
      const nx = dx / d, nz = dz / d;
      const rv = (c.vx - a.vx) * nx + (c.vz - a.vz) * nz;
      const movable = (s) => !(W.predict && s.remote) && !s.noDamage;
      if (rv < 0) {
        const imp = -rv * 0.9;
        if (movable(a)) { a.vx -= nx * imp; a.vz -= nz * imp; }
        if (movable(c)) { c.vx += nx * imp; c.vz += nz * imp; }
      }
      const push = (rad - d) / 2 + 0.01;
      if (movable(a)) { a.x = wrapX(a.x - nx * push); a.z = wrapZ(a.z - nz * push); }
      if (movable(c)) { c.x = wrapX(c.x + nx * push); c.z = wrapZ(c.z + nz * push); }
      if (auth) {
        if (a.dashT > 0 && c.dashT <= 0) damageShip(W, c, W.perk[a.side].ram || 1, 'ram', a.side, c.x, c.z, { area: true });
        else if (c.dashT > 0 && a.dashT <= 0) damageShip(W, a, W.perk[c.side].ram || 1, 'ram', c.side, a.x, a.z, { area: true });
      }
      emit(W, { k: 'bump', side: 0, x: a.x + nx * a.r, z: a.z + nz * a.r, k2: Math.min(1, Math.abs(rv) / 20) });
    }
  }

  // ---------------------------------------------------------- hazards and the field
  if (auth) {
    hazards(W, dt);
    if (W.boss) stepBoss(W, dt);
    for (const p of W.pending.slice()) {
      p.t -= dt;
      if (p.t > 0) continue;
      W.pending.splice(W.pending.indexOf(p), 1);
      if (p.kind === 'wave') {
        for (let i = 0; i < p.n; i++) spawnRock(W, W.tw.mega ? 4 : 3, p.edge);
        emit(W, { k: 'wavein', edge: p.edge });
      } else if (p.kind === 'comets') {
        const L = p.lane;
        for (let i = 0; i < 5; i++) {
          const off = (i - 2) * 1.6;
          const x = L.x - L.dx * (AW + 4 + i * 3.5) - L.dz * off, z = L.z - L.dz * (AH + 4 + i * 3.5) + L.dx * off;
          addRock(W, { x: wrapX(x), z: wrapZ(z), vx: L.dx * 25, vz: L.dz * 25, size: 1, kind: 'comet', life: 3.6 });
        }
        W.lanes = W.lanes.filter((q) => q !== L);
        emit(W, { k: 'comet', x: L.x, z: L.z, dx: L.dx, dz: L.dz });
      }
    }
  }
  // crystal arcs: charged rocks link up; flying through an arc hurts
  W.arcT -= dt;
  if (W.arcT <= 0) {
    W.arcT = 0.1;
    W.arcs = [];
    const cr = W.rocks.filter((r) => r.kind === 'crystal');
    for (let i = 0; i < cr.length; i++) for (let j = i + 1; j < cr.length; j++) {
      const d = Math.hypot(dX(cr[i].x, cr[j].x), dZ(cr[i].z, cr[j].z));
      if (d < 10 && d > cr[i].r + cr[j].r) W.arcs.push([cr[i].id, cr[j].id]);
    }
  }
  if (W.arcs.length && auth) {
    for (const [ia, ib] of W.arcs) {
      const a = W.rocks.find((r) => r.id === ia), b = W.rocks.find((r) => r.id === ib);
      if (!a || !b) continue;
      const ex = dX(a.x, b.x), ez = dZ(a.z, b.z), L2 = ex * ex + ez * ez || 1;
      for (const s of W.ships) {
        if (!s.alive || s.inv > 0 || s.noDamage) continue;
        const px = dX(a.x, s.x), pz = dZ(a.z, s.z);
        const t = clamp((px * ex + pz * ez) / L2, 0, 1);
        if (t <= 0.02 || t >= 0.98) continue;
        const d = Math.hypot(px - ex * t, pz - ez * t);
        if (d < s.r * 0.75) { damageShip(W, s, 1, 'arc', 0, s.x, s.z); emit(W, { k: 'arc', x: s.x, z: s.z }); }
      }
    }
  }
  if (W.over) W.overT2 = W.t - W.overT;
}

function gravity(W, o, x, z, m, dt) {
  const dx = dX(o.x, x), dz = dZ(o.z, z), d2 = dx * dx + dz * dz;
  const d = Math.sqrt(d2) || 1;
  const a = m / (d2 + 9);
  o.vx += (dx / d) * a * dt;
  o.vz += (dz / d) * a * dt;
}

function portal(W, o, isShip) {
  if (!W.portals.length || o.portT > 0) return;
  for (let i = 0; i < 2; i++) {
    const p = W.portals[i], q = W.portals[1 - i];
    const dx = dX(p.x, o.x), dz = dZ(p.z, o.z);
    if (dx * dx + dz * dz < 1.9 * 1.9) {
      o.x = wrapX(q.x + dx * 0.5); o.z = wrapZ(q.z + dz * 0.5);
      o.portT = 0.7;
      if (isShip || (o.size && o.size >= 2)) emit(W, { k: 'portal', x: p.x, z: p.z, x2: q.x, z2: q.z, ship: isShip ? o.side : 0 });
      return;
    }
  }
}

function rockMeetsShip(W, r, s, dx, dz, d, rad) {
  const nx = dx / (d || 1), nz = dz / (d || 1);
  const auth = !W.predict;
  const perk = W.perk[s.side];
  // overdrive and the Devourer smash rocks instead of feeling them
  if ((s.odTime > 0 || perk.devour) && auth) {
    if (perk.devour && r.size <= 2 && s.odTime <= 0) {
      W.rocks.splice(W.rocks.indexOf(r), 1);
      s.eaten++;
      emit(W, { k: 'eat', x: r.x, z: r.z, size: r.size, ship: s.side, by: s.side });
      if (s.eaten % 3 === 0 && s.hp < s.max) { s.hp++; emit(W, { k: 'heal', side: s.side, x: s.x, z: s.z, hp: s.hp }); }
      W.stats[s.side].rocks++;
      return;
    }
    if (s.odTime > 0 || r.size <= 3) { breakRock(W, r, s.side, s.vx, s.vz, 'ram'); return; }
  }
  // bounce: push the ship out and exchange momentum by mass
  const ms = 1.2, mr = rockMass(r.size) * 0.5;
  const rvx = s.vx - r.vx, rvz = s.vz - r.vz;
  const vn = rvx * nx + rvz * nz;
  s.x = wrapX(r.x + nx * (rad + 0.02));
  s.z = wrapZ(r.z + nz * (rad + 0.02));
  if (vn < 0) {
    const j = (-(1 + 0.6) * vn) / (1 / ms + 1 / mr);
    s.vx += (j / ms) * nx; s.vz += (j / ms) * nz;
    if (auth) { r.vx -= (j / mr) * nx; r.vz -= (j / mr) * nz; }
  }
  // a minimum kick so the ship never sticks
  const vo = s.vx * nx + s.vz * nz;
  if (vo < 5) { s.vx += nx * (5 - vo); s.vz += nz * (5 - vo); }
  const shard = r.owner && r.owner === -s.side && r.ownT > 0;
  const src = shard ? 'shard' : 'rock';
  const dmg = shard ? W.perk[r.owner].shard || 2 : 1;
  const was = s.inv <= 0 && s.dashT <= 0;
  emit(W, { k: 'bump', side: s.side, x: s.x - nx * s.r, z: s.z - nz * s.r, k2: Math.min(1, Math.abs(vn) / 16), rock: r.id });
  const sh = s.fx.shield;
  const hurt = damageShip(W, s, dmg, src, shard ? r.owner : 0, s.x - nx * s.r, s.z - nz * s.r, { ref: r.id });
  if (W.predict && (hurt || s.fx.shield < sh)) W.claims.push({ kind: 'hit', ref: r.id, dmg, src, by: shard ? r.owner : 0 });
  // the impact cracks small rocks
  if (auth && was && r.size <= 2 && W.rocks.includes(r)) breakRock(W, r, 0, -nx, -nz, 'ram');
  return hurt;
}

// does this bullet hit anything? true = it is spent
function bulletHits(W, b) {
  const auth = !W.predict;
  // ships
  for (const s of W.ships) {
    if (!s.alive || s.side === b.side) continue;
    if (s.noDamage && auth) continue;
    const dx = dX(b.x, s.x), dz = dZ(b.z, s.z);
    const rad = s.r + 0.18;
    if (dx * dx + dz * dz > rad * rad) continue;
    if (W.predict) {
      if (s.remote) { if (b.side !== 0 && b.local) { emit(W, { k: 'spark', x: b.x, z: b.z, side: b.side }); return true; } continue; }
      // the host's shot reached me on my screen: I report the hit
      if (s.dashT > 0 || s.inv > 0) continue;
      const sh = s.fx.shield;
      const hit = damageShip(W, s, b.dmg, 'bullet', b.side, b.x, b.z, { ref: b.id });
      if (hit || s.fx.shield < sh) W.claims.push({ kind: 'hit', ref: b.id, dmg: b.dmg, src: 'bullet', by: b.side });
      return true;
    }
    if (s.dashT > 0) { emit(W, { k: 'dodge', side: s.side, x: s.x, z: s.z }); W.stats[s.side].dodges++; continue; }
    damageShip(W, s, b.dmg, 'bullet', b.side, b.x, b.z, { ref: b.id });
    if (b.kind === 'missile') emit(W, { k: 'boom', x: b.x, z: b.z, r: 1.2, side: b.side, src: 'missile', small: 1 });
    return true;
  }
  // boss parts
  if (W.boss && b.side === 1) {
    const B = W.boss;
    if (B.phase === 1) {
      for (const e of B.eyes) {
        if (e.hp <= 0) continue;
        const dx = dX(b.x, e.x), dz = dZ(b.z, e.z);
        if (dx * dx + dz * dz < 1.35 * 1.35) { if (!e.open) emit(W, { k: 'bossblock', x: b.x, z: b.z, eye: 1 }); else if (auth) hurtBoss(W, e, b.dmg, b.x, b.z); return true; }
      }
    }
    const dx = dX(b.x, B.x), dz = dZ(b.z, B.z);
    if (dx * dx + dz * dz < B.r * B.r) {
      if (B.phase === 2) { if (auth) hurtBoss(W, B.core, b.dmg, b.x, b.z); }
      else emit(W, { k: 'bossblock', x: b.x, z: b.z });
      return true;
    }
  }
  if (b.side === 0 || b.kind === 'boss') return false;
  // power-up orbs: shoot one to claim it
  if (auth) {
    for (let i = 0; i < W.orbs.length; i++) {
      const o = W.orbs[i];
      const dx = dX(b.x, o.x), dz = dZ(b.z, o.z);
      if (dx * dx + dz * dz < 0.95 * 0.95) {
        const s = W.ships.find((q) => q.id === b.ship);
        W.orbs.splice(i, 1);
        if (s && s.alive) collect(W, s, o.kind, o.x, o.z, true);
        return true;
      }
    }
    // enemy mines can be shot
    for (let i = 0; i < W.mines.length; i++) {
      const m = W.mines[i];
      if (m.side === b.side) continue;
      const dx = dX(b.x, m.x), dz = dZ(b.z, m.z);
      if (dx * dx + dz * dz < 0.8 * 0.8) { m.life = 0; m.armT = 0; return true; }
    }
  }
  // rocks
  for (const r of W.rocks) {
    if (b.pierce && b.hits.includes(r.id)) continue;
    const dx = dX(b.x, r.x), dz = dZ(b.z, r.z);
    const rad = r.r + 0.15;
    if (dx * dx + dz * dz > rad * rad) continue;
    if (W.predict) { if (b.local) { emit(W, { k: 'spark', x: b.x, z: b.z, side: b.side, rock: 1 }); return true; } return false; }
    const sp = Math.hypot(b.vx, b.vz) || 1;
    r.vx += (b.vx / sp) * 1.4 / r.size; r.vz += (b.vz / sp) * 1.4 / r.size;
    r.hp -= b.dmg;
    r.hitT = W.t;
    if (r.hp <= 0) breakRock(W, r, b.side, b.vx, b.vz, b.kind === 'rail' ? 'rail' : 'shot');
    else emit(W, { k: 'chip', id: r.id, x: b.x, z: b.z, size: r.size, kind: r.kind, side: b.side });
    if (b.kind === 'missile') { emit(W, { k: 'boom', x: b.x, z: b.z, r: 1.2, side: b.side, src: 'missile', small: 1 }); return true; }
    if (!b.pierce) return true;
    b.hits.push(r.id);
  }
  return false;
}

// a power-up takes effect
function collect(W, s, kind, x, z, snipe) {
  const P = POWERUPS[kind];
  W.stats[s.side].pickups++;
  emit(W, { k: 'pu', side: s.side, kind, x, z, snipe: snipe ? 1 : 0 });
  const [fx, fz] = fwd(s.a);
  switch (kind) {
    case 'shield': s.fx.shield = 3; s.fx.shieldT = P.time; break;
    case 'repair': s.hp = Math.min(s.max, s.hp + 2); break;
    case 'nova': {
      emit(W, { k: 'nova', side: s.side, x: s.x, z: s.z });
      for (const r of W.rocks.slice()) if (Math.hypot(dX(s.x, r.x), dZ(s.z, r.z)) < 10 + r.r) breakRock(W, r, s.side, dX(s.x, r.x), dZ(s.z, r.z), 'blast');
      for (const o of W.ships) {
        if (o === s || !o.alive) continue;
        const dx = dX(s.x, o.x), dz = dZ(s.z, o.z), d = Math.hypot(dx, dz);
        if (d < 10) { o.vx += (dx / (d || 1)) * 22; o.vz += (dz / (d || 1)) * 22; damageShip(W, o, 1, 'nova', s.side, o.x, o.z, { area: true }); }
      }
      if (W.boss && s.side === 1) {
        const B = W.boss;
        for (const e of B.eyes) if (e.hp > 0 && Math.hypot(dX(s.x, e.x), dZ(s.z, e.z)) < 11) hurtBoss(W, e, 2, e.x, e.z);
        if (B.phase === 2 && Math.hypot(dX(s.x, B.x), dZ(s.z, B.z)) < 11 + B.r) hurtBoss(W, B.core, 2, B.x, B.z);
      }
      break;
    }
    case 'mines':
      for (let i = 0; i < 3; i++) {
        const a = s.a + Math.PI + (i - 1) * 0.55;
        W.mines.push({ id: W.nextId++, side: s.side, x: wrapX(s.x - fx * 1.6), z: wrapZ(s.z - fz * 1.6), vx: Math.sin(a) * 6 + s.vx * 0.3, vz: -Math.cos(a) * 6 + s.vz * 0.3, armT: 0.7, life: 22, born: W.t });
      }
      emit(W, { k: 'mine', side: s.side, x: s.x, z: s.z });
      break;
    case 'well':
      W.wells.push({ id: W.nextId++, side: s.side, x: wrapX(s.x + fx * 4), z: wrapZ(s.z + fz * 4), vx: fx * 14 + s.vx * 0.4, vz: fz * 14 + s.vz * 0.4, life: 6, born: W.t });
      emit(W, { k: 'well', side: s.side, x: s.x, z: s.z });
      break;
    case 'drone':
      s.fx.drone = P.time;
      if (W.drones.filter((d) => d.ship === s.id).length < 2) W.drones.push({ id: W.nextId++, side: s.side, ship: s.id, ang: W.rand() * TAU, x: s.x, z: s.z, life: P.time, fireT: 0.6, born: W.t });
      break;
    default: s.fx[kind] = P.time;
  }
}

// waves of rocks, storms and comet showers
function hazards(W, dt) {
  if (W.over) return;
  const A = W.arena;
  // keep the belt full: when the field thins out a new wave drifts in from one edge
  let mass = 0;
  for (const r of W.rocks) if (r.life < 0) mass += [0, 1, 2, 4, 8][r.size];
  W.waveT -= dt;
  const floor = A.hazard === 'boss' ? 4 : 11;
  if (mass < floor && W.waveT <= 0 && !W.pending.some((p) => p.kind === 'wave')) {
    W.waves++;
    const n = A.hazard === 'boss' ? 2 : Math.min(5, 3 + Math.floor(W.waves / 2));
    const edge = (W.rand() * 4) | 0;
    W.pending.push({ kind: 'wave', t: 1.6, n, edge });
    W.waveT = 7;
    emit(W, { k: 'wave', edge, n });
  }
  if (A.hazard === 'storm') {
    W.stormT -= dt;
    if (W.stormT <= 0) {
      W.stormT = rr(W, 4.5, 7.5);
      const alive = W.ships.filter((s) => s.alive);
      let x, z;
      if (alive.length && W.rand() < 0.65) {
        const s = alive[(W.rand() * alive.length) | 0];
        x = wrapX(s.x + s.vx * 0.8 + rr(W, -4, 4)); z = wrapZ(s.z + s.vz * 0.8 + rr(W, -4, 4));
      } else { x = rr(W, -AW, AW); z = rr(W, -AH, AH); }
      const st = { id: W.nextId++, x, z, r: 3.4, t: 1.35, max: 1.35 };
      W.strikes.push(st);
      emit(W, { k: 'strikewarn', x, z, r: st.r });
    }
  }
  for (let i = W.strikes.length - 1; i >= 0; i--) {
    const st = W.strikes[i];
    st.t -= dt;
    if (st.t > 0) continue;
    W.strikes.splice(i, 1);
    emit(W, { k: 'strike', x: st.x, z: st.z, r: st.r });
    for (const s of W.ships) {
      if (!s.alive) continue;
      if (Math.hypot(dX(st.x, s.x), dZ(st.z, s.z)) < st.r + s.r * 0.5) damageShip(W, s, 2, 'storm', 0, s.x, s.z, { area: true });
    }
    for (const r of W.rocks.slice()) if (Math.hypot(dX(st.x, r.x), dZ(st.z, r.z)) < st.r + r.r * 0.4) breakRock(W, r, 0, 0, 0, 'blast');
  }
  if (A.hazard === 'comet') {
    W.cometT -= dt;
    if (W.cometT <= 0) {
      W.cometT = rr(W, 9, 13);
      const alive = W.ships.filter((s) => s.alive);
      const s = alive.length ? alive[(W.rand() * alive.length) | 0] : { x: 0, z: 0 };
      const a = W.rand() < 0.5 ? rr(W, -0.5, 0.5) + (W.rand() < 0.5 ? 0 : Math.PI) : rr(W, 0.6, 1.0) * (W.rand() < 0.5 ? 1 : -1) + Math.PI / 2;
      const L = { x: wrapX(s.x + rr(W, -3, 3)), z: wrapZ(s.z + rr(W, -3, 3)), dx: Math.cos(a), dz: Math.sin(a) };
      W.lanes.push(L);
      W.pending.push({ kind: 'comets', t: 1.7, lane: L });
      emit(W, { k: 'cometwarn', x: L.x, z: L.z, dx: L.dx, dz: L.dz });
    }
  }
}

// ------------------------------------------------------------------ online helpers
// the host applies a hit the guest saw on its own screen (shot or rock); false = refused
export function applyClaim(W, c) {
  const s = shipOf(W, -1);
  if (!s || !s.alive || W.over) return 'over';
  if (c.kind === 'hit') {
    const b = W.bullets.find((q) => q.id === c.ref);
    if (b) b.dead = true;
    const dmg = clamp(c.dmg | 0, 1, 3);
    const src = ['bullet', 'rock', 'shard', 'ram', 'arc'].includes(c.src) ? c.src : 'bullet';
    const r = W.rocks.find((q) => q.id === c.ref);
    if (r && r.size <= 2 && (src === 'rock' || src === 'shard')) breakRock(W, r, 0, 0, 0, 'ram');
    if (W.perk[-1].devour && src === 'rock') return 'blocked';
    const hp0 = s.hp;
    s.inv = 0;
    damageShip(W, s, dmg, src, c.by === 1 ? 1 : 0, s.x, s.z, { claim: true });
    return s.hp < hp0 ? true : 'blocked';
  }
  return 'kind';
}
