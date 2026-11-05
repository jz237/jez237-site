// Swarmbreak simulation: fixed 120 Hz steps, all randomness from the world's own seeded generator
// (W.rs), plain data only, so a world can be cloned and re-run bit for bit (replays, online, tests).
// Nothing in here touches the DOM, WebGL or audio; it only pushes events into W.ev.
import { F, STEP, GATES, SECTORS, WAVES, rampAt, rampLevel, standLevel, STAND, ENEMY, HOSTILE, BOSSES, BOSS_KEYS, SCORE, START_LIVES, INTRO, introduced } from './config.js?v=1';
export { STEP };

const { AW, AH } = F;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hyp = Math.hypot;

// ------------------------------------------------------------------ seeded randomness (state lives in W.rs)
export function rand(W) {
  const s = (W.rs = (W.rs + 0x6D2B79F5) | 0);
  let t = Math.imul(s ^ (s >>> 15), s | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rr = (W, a, b) => a + (b - a) * rand(W);
function pickW(W, mix) {
  let tot = 0;
  for (const k in mix) tot += mix[k];
  let x = rand(W) * tot;
  for (const k in mix) { x -= mix[k]; if (x <= 0) return k; }
  return Object.keys(mix)[0];
}
export const angleOf = (x, z) => Math.atan2(z, x);
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }

// ------------------------------------------------------------------ world
export function makeWorld(o = {}) {
  const seed = (o.seed ?? 1) | 0;
  const mode = o.mode || 'campaign';
  const W = {
    n: 0, t: 0, seed, rs: (seed ^ 0x2545F491) | 0, mode, sector: o.sector || 0, k: o.sector || 0, up: { ...(o.up || {}) }, demo: !!o.demo, coop: !!o.coop,
    lives: o.lives ?? START_LIVES, score: o.score || 0, nextLife: 0,
    wave: o.wave || 0, waveN: 0, phase: 'intro', phaseT: 0, waveT: 0, secT: 0, fightT: 0, R: null,
    players: [], enemies: [], shots: [], bolts: [], survivors: [], portals: [], hazards: [], boss: null,
    spawnQ: [], nextId: 1, chain: 0, ev: [], over: false, result: null, claims: [], net: null, lastDeathN: -1,
    tutorial: mode === 'campaign' && !o.noTut && (o.sector || 0) === 0 && (o.wave || 0) === 0 && !o.demo,
    stats: { kills: 0, rescued: 0, surv: 0, lost: 0, deaths: 0, shots: 0, hits: 0, pulses: 0, shieldHits: 0, waveDeaths: {}, waveTries: {}, waveHits: {}, bossT: 0 },
    tut: {},
  };
  W.nextLife = (Math.floor(W.score / SCORE.lifeEvery) + 1) * SCORE.lifeEvery;
  const n = o.coop ? 2 : 1;
  for (let i = 0; i < n; i++) W.players.push(makePlayer(i + 1, n === 2 ? (i ? 2 : -2) : 0, 2));
  startWave(W, true);
  return W;
}
function makePlayer(id, x, z) {
  return { id, x, z, vx: 0, vz: 0, aim: -Math.PI / 2, alive: true, inv: 0, shield: 0, pulses: 0, fireT: 0, deadT: 0, walk: 0, shotI: 0,
    input: { mx: 0, mz: 0, ax: 0, az: 0, fire: false, pulse: false }, pulseHeld: false, remote: false, hurtT: 0 };
}
export const cloneWorld = (W) => structuredClone(W);
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
export const isBossWave = (W) => W.mode === 'campaign' ? W.wave >= WAVES : W.bossWave;
export const waveLabel = (W) => (W.mode === 'campaign' ? (W.wave >= WAVES ? 'BOSS' : `WAVE ${W.wave + 1}`) : `WAVE ${W.waveN + 1}`);
const alivePlayers = (W) => W.players.filter((p) => p.alive);
function nearestPlayer(W, x, z) {
  let best = null, bd = 1e9;
  for (const p of W.players) { if (!p.alive) continue; const d = hyp(p.x - x, p.z - z); if (d < bd) { bd = d; best = p; } }
  return best;
}

// ------------------------------------------------------------------ waves
function startWave(W, first = false) {
  const camp = W.mode === 'campaign';
  if (camp) W.R = rampAt(W.sector, Math.min(W.wave, WAVES - 1));
  else {
    W.R = rampLevel(standLevel(W.fightT));
    W.k = Math.floor(W.waveN / STAND.lookEvery) % 5;
    W.bossWave = W.waveN > 0 && (W.waveN + 1) % STAND.bossEvery === 0;
  }
  const R = W.R;
  W.phase = 'intro'; W.phaseT = first ? 2.6 : 2.0; W.waveT = 0; W.chain = 0;
  W.spawnQ = []; W.portals = []; W.hazards = []; W.bolts = [];
  for (const p of W.players) { p.shield = R.shield + (W.up.armor || 0); p.pulses = R.pulse + (W.up.pulse || 0); }
  // survivors, away from the Warden(s)
  W.survivors = [];
  const nS = isBossWave(W) ? 3 : R.surv;
  for (let i = 0; i < nS; i++) {
    const q = freeSpot(W, 6, 2.2);
    W.survivors.push({ id: W.nextId++, x: q[0], z: q[1], vx: 0, vz: 0, a: rr(W, 0, TAU), t: rr(W, 0, 2), look: (rand(W) * 6) | 0 });
  }
  W.stats.surv += nS;
  if (isBossWave(W)) { W.phaseT = 2.8; W.ev.push({ k: 'bosswarn', key: bossKey(W) }); }
  else planWave(W);
  W.ev.push({ k: 'wave', wave: W.wave, n: W.waveN, label: waveLabel(W), boss: isBossWave(W) });
  if (W.tutorial && W.wave === 1) tut(W, 'pulse');
}
const bossKey = (W) => (W.mode === 'campaign' ? SECTORS[W.sector].boss : BOSS_KEYS[Math.floor(W.waveN / STAND.bossEvery) % BOSS_KEYS.length]);
function tut(W, key) { if (W.tut[key] || W.demo) return; W.tut[key] = 1; W.ev.push({ k: 'tut', key }); }

// a random point inside the arena at least `far` m from every Warden and `wall` m from the walls
function freeSpot(W, far, wall = 2) {
  let best = null, bd = -1;
  for (let i = 0; i < 24; i++) {
    const x = rr(W, -AW + wall, AW - wall), z = rr(W, -AH + wall, AH - wall);
    let d = 99;
    for (const p of W.players) d = Math.min(d, hyp(p.x - x, p.z - z));
    for (const s of W.survivors) d = Math.min(d, hyp(s.x - x, s.z - z) + 3);
    if (d >= far) return [x, z];
    if (d > bd) { bd = d; best = [x, z]; }
  }
  return best;
}

// the wave's spawn plan: groups of machines at gates, each preceded by a full warning
function planWave(W) {
  const R = W.R, s = W.sector, w = Math.min(W.wave, WAVES - 1), camp = W.mode === 'campaign';
  const allowed = {};
  for (const k in R.mix) if (k !== 'pylon' && (!camp || introduced(k, s, w))) allowed[k] = R.mix[k];
  const fresh = camp ? Object.keys(INTRO).filter((k) => INTRO[k][0] === s && INTRO[k][1] === w && k !== 'crawler' && R.mix[k]) : [];
  const tw = W.tutorial && W.wave === 0;
  let t = tw ? 19 : R.warn + 0.8;
  let left = R.count;
  const Q = [];
  if (tw) Q.push({ t: 6.5, types: ['dummy', 'dummy', 'dummy'], inside: true, tut: 'aim' });
  // a machine making its first appearance comes alone, with a word about it
  for (const k of fresh) {
    if (k === 'pylon') continue;
    Q.push({ t, types: [k], tut: k, inside: k === 'hive' });
    t += R.gap * 1.3; left--;
  }
  let hives = Q.filter((q) => q.types[0] === 'hive').length, brutes = 0;
  // the opening rush: part of the wave comes through several gates at once
  const nb = Math.min(left, Math.round(R.count * (R.burst || 0)));
  if (nb > 0) {
    let k = nb;
    const gates = Math.min(4, Math.ceil(nb / 3));
    for (let g = 0; g < gates; g++) {
      const sz = Math.ceil(k / (gates - g)), types = [];
      for (let i = 0; i < sz; i++) { let ty = pickW(W, allowed); if (ty === 'hive' || (ty === 'brute' && brutes >= 1)) ty = 'crawler'; if (ty === 'brute') brutes++; types.push(ty); }
      Q.push({ t: t + g * 0.25, types });
      k -= sz;
    }
    left -= nb; t += R.gap * 1.6;
  }
  while (left > 0) {
    const size = Math.min(left, 1 + Math.floor(rand(W) * R.group));
    const mixed = rand(W) < R.combo;
    let base = pickW(W, allowed);
    const types = [];
    for (let i = 0; i < size; i++) {
      let ty = mixed ? pickW(W, allowed) : base;
      if (ty === 'hive' && hives >= 2) ty = 'crawler';
      if (ty === 'brute' && brutes >= 2 + s) ty = 'crawler';
      if (ty === 'hive') hives++;
      if (ty === 'brute') brutes++;
      types.push(ty);
      if (ty === 'hive' && !mixed) base = 'crawler';
    }
    // hives open inside the arena, everything else walks in through a gate
    const hv = types.filter((x) => x === 'hive');
    const rest = types.filter((x) => x !== 'hive');
    if (rest.length) Q.push({ t, types: rest });
    for (const h of hv) Q.push({ t: t + 0.3, types: [h], inside: true });
    t += R.gap * rr(W, 0.8, 1.25) * (1 + 0.22 * (size - 1));
    left -= size;
  }
  // pylons are wired at the start of the wave
  if (R.mix.pylon && (!camp || introduced('pylon', s, w))) {
    const pairs = Math.max(1, Math.round(R.count * R.mix.pylon * 0.18));
    const tp = fresh.includes('pylon') ? 'pylon' : null;
    for (let i = 0; i < pairs; i++) Q.push({ t: 0.6 + i * 0.4, types: ['pylon', 'pylon'], inside: true, pair: true, arc: tp || rand(W) < Math.max(R.combo, s >= 2 ? 0.2 : 0), tut: i === 0 ? tp : null });
  }
  Q.sort((a, b) => a.t - b.t);
  W.spawnQ = Q;
}

// ------------------------------------------------------------------ the step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  const R = W.R, guest = W.net === 'guest';
  W.phaseT -= dt;
  if (guest) { /* the host runs the waves */ } else if (W.phase === 'intro') {
    if (W.phaseT <= 0) {
      W.phase = 'fight'; W.waveT = 0;
      const key = W.mode === 'campaign' ? W.wave : 'S';
      W.stats.waveTries[key] = (W.stats.waveTries[key] || 0) + 1;
      if (isBossWave(W)) startBoss(W);
      if (W.tutorial && W.wave === 0) tut(W, 'move');
    }
  } else if (W.phase === 'fight') {
    W.waveT += dt; W.fightT += dt;
    spawns(W);
  } else if (W.phase === 'clear') {
    if (W.phaseT <= 0) nextWave(W);
  }
  if (W.mode === 'campaign' && W.phase !== 'clear') W.secT += dt;
  for (const p of W.players) player(W, p, dt);
  for (const e of W.enemies) enemy(W, e, dt);
  separate(W);
  if (W.boss) boss(W, W.boss, dt);
  shots(W, dt);
  bolts(W, dt);
  hazards(W, dt);
  survivors(W, dt);
  contacts(W);
  W.enemies = W.enemies.filter((e) => e.hp > 0 && !e.gone);
  // wave over?
  if (!guest && W.phase === 'fight' && !W.spawnQ.length && !W.portals.length && !W.boss && !W.enemies.some((e) => HOSTILE.has(e.type))) waveClear(W);
  // extra lives
  if (guest) return;
  if (W.score >= W.nextLife) { W.lives++; W.nextLife += SCORE.lifeEvery; W.ev.push({ k: 'life' }); }
  // out of Wardens
  if (W.lives <= 0 && !W.players.some((p) => p.alive) && W.players.every((p) => p.deadT > 1.6)) { W.over = true; W.result = 'over'; W.ev.push({ k: 'over' }); }
}

function spawns(W) {
  const R = W.R;
  for (const g of W.spawnQ) {
    if (g.open || W.waveT < g.t - R.warn) continue;
    g.open = true;
    let x, z;
    if (g.inside) [x, z] = freeSpot(W, g.types[0] === 'dummy' ? 7 : 8, 3);
    else {
      // the gate furthest-ish from the Wardens, picked at random among the safe ones
      const far = W.sector === 0 && W.mode === 'campaign' ? 13 : 9;
      const used = (gx, gz) => W.portals.some((P) => !P.inside && hyp(P.x - gx, P.z - gz) < 3);
      const ok = GATES.filter(([gx, gz]) => !used(gx, gz) && W.players.every((p) => !p.alive || hyp(p.x - gx, p.z - gz) >= far));
      const list = ok.length ? ok : GATES;
      [x, z] = list[Math.floor(rand(W) * list.length)];
    }
    const P = { id: W.nextId++, x, z, t: 0, T: Math.max(0.5, g.t - W.waveT), types: g.types, inside: !!g.inside, g };
    if (g.pair) { const a = rr(W, 0, TAU), d = rr(W, 4.5, ENEMY.pylon.arc - 0.6); P.x2 = clamp(x + Math.cos(a) * d, -AW + 2, AW - 2); P.z2 = clamp(z + Math.sin(a) * d, -AH + 2, AH - 2); }
    W.portals.push(P);
    W.ev.push({ k: 'portal', id: P.id, x, z, T: P.T, type: g.types[0], n: g.types.length });
    if (g.tut) tut(W, g.tut);
  }
  for (const P of W.portals) {
    P.t += STEP;
    if (P.t < P.T) continue;
    const g = P.g;
    if (g.pair) {
      const a = addEnemy(W, 'pylon', P.x, P.z), b = addEnemy(W, 'pylon', P.x2, P.z2);
      if (g.arc) { a.link = b.id; b.link = a.id; a.arcT = b.arcT = rr(W, 0, 1.5); }
    } else {
      g.types.forEach((ty, i) => {
        const a = (i / g.types.length) * TAU + 0.6, d = i ? (ty === 'dummy' ? 2.8 : 1.1) : 0;
        const ex = clamp(P.x + Math.cos(a) * d, -AW + 1, AW - 1), ez = clamp(P.z + Math.sin(a) * d, -AH + 1, AH - 1);
        addEnemy(W, ty, ex, ez);
      });
    }
    W.ev.push({ k: 'enter', x: P.x, z: P.z, type: g.types[0], n: g.types.length });
    P.done = true;
  }
  W.portals = W.portals.filter((P) => !P.done);
  W.spawnQ = W.spawnQ.filter((g) => !(g.open && !W.portals.some((P) => P.g === g)));
}

export function addEnemy(W, type, x, z) {
  const E = ENEMY[type];
  const hpK = type === 'brute' ? 1 + 0.12 * W.sector : type === 'hive' ? 1 + 0.1 * W.sector : 1;
  const e = { id: W.nextId++, type, x, z, vx: 0, vz: 0, hp: Math.round(E.hp * hpK), max: 0, r: E.r, t: 0, st: rr(W, 0, 0.6), a: rr(W, 0, TAU), born: 0.45,
    fireT: rr(W, 0.8, 1.6) / Math.max(0.05, W.R.fire), aimT: 0, aimA: 0, aimX: 0, aimZ: 0, hitT: 0, link: 0, arcT: 0, arc: 0, spawnT: rr(W, 1.5, 3), life: E.life || 0, wob: rand(W) * TAU };
  e.max = e.hp;
  W.enemies.push(e);
  return e;
}

// ------------------------------------------------------------------ Wardens
function player(W, p, dt) {
  if (!p.alive) {
    p.deadT += dt;
    // online, only the host brings Wardens back
    if (p.deadT >= F.respawn && W.lives > 0 && W.net !== 'guest') respawn(W, p);
    return;
  }
  if (p.remote) { p.inv = Math.max(0, p.inv - dt); return; }
  const I = p.input;
  p.inv = Math.max(0, p.inv - dt);
  p.hurtT = Math.max(0, p.hurtT - dt);
  let mx = I.mx, mz = I.mz;
  const m = hyp(mx, mz);
  if (m > 1) { mx /= m; mz /= m; }
  const sp = F.speed * (1 + 0.09 * (W.up.servos || 0));
  const k = Math.min(1, dt * F.accel);
  p.vx += (mx * sp - p.vx) * k; p.vz += (mz * sp - p.vz) * k;
  p.x = clamp(p.x + p.vx * dt, -AW + F.r, AW - F.r);
  p.z = clamp(p.z + p.vz * dt, -AH + F.r, AH - F.r);
  p.walk += hyp(p.vx, p.vz) * dt;
  if (hyp(I.ax, I.az) > 0.2) p.aim = Math.atan2(I.az, I.ax);
  else if (m > 0.2 && !I.fire) p.aim = Math.atan2(mz, mx);
  p.fireT -= dt;
  if (I.fire && p.fireT <= 0) fire(W, p);
  if (I.pulse && !p.pulseHeld) pulse(W, p);
  p.pulseHeld = !!I.pulse;
}
export function fireCD(W) { return F.fireCD * [1, 0.82, 0.68, 0.56][W.up.rapid || 0]; }
function fire(W, p) {
  p.fireT = fireCD(W);
  const lv = W.up.spread || 0;
  const angs = [0];
  if (lv >= 1) angs.push(-F.spread, F.spread);
  if (lv >= 2) angs.push(-F.spread * 2, F.spread * 2);
  const c = Math.cos(p.aim), s = Math.sin(p.aim);
  const mx = p.x + c * 0.75, mz = p.z + s * 0.75;
  for (const d of angs) {
    // only the centre shot fires every time; side shots every other shot
    if (d && p.shotI % 2) continue;
    const a = p.aim + d;
    W.shots.push({ id: W.nextId++, pid: p.id, x: mx, z: mz, vx: Math.cos(a) * F.shotV, vz: Math.sin(a) * F.shotV, life: F.shotLife * (d ? 0.8 : 1), side: d ? 1 : 0, ghost: W.net === 'guest' && p.remote === false && p.id === 2 });
  }
  p.shotI++;
  W.stats.shots++;
  W.ev.push({ k: 'fire', pid: p.id, x: mx, z: mz, a: p.aim });
}
export function pulse(W, p, remote = false) {
  if ((p.pulses <= 0 && !remote) || !p.alive) return;
  if (W.net === 'guest' && !remote) {
    // the guest's PULSE is played here and carried out by the host
    p.pulses--; W.claims.push({ pulse: 1 });
    W.ev.push({ k: 'pulse', pid: p.id, x: p.x, z: p.z, kills: 0, bolts: 0 });
    return;
  }
  p.pulses = Math.max(0, p.pulses - 1); W.stats.pulses++;
  p.inv = Math.max(p.inv, 0.35);
  const R = F.pulseR;
  let kills = 0;
  for (const e of W.enemies) {
    const dx = e.x - p.x, dz = e.z - p.z, d = hyp(dx, dz) || 1;
    if (d > R + e.r) continue;
    if (e.type === 'crawler' || e.type === 'dart' || e.type === 'shard' || e.type === 'dummy' || e.type === 'pylon') { kill(W, e, p.id, 'pulse'); kills++; continue; }
    damage(W, e, 2, p.id, 'pulse');
    if (e.hp > 0) { const push = F.pulseShove * (1 - d / (R + e.r)) / (e.type === 'brute' || e.type === 'hive' ? 3 : 1); e.x = clamp(e.x + (dx / d) * push, -AW + e.r, AW - e.r); e.z = clamp(e.z + (dz / d) * push, -AH + e.r, AH - e.r); e.st = Math.max(e.st, 0.6); e.aimT = 0; }
  }
  const before = W.bolts.length;
  W.bolts = W.bolts.filter((b) => hyp(b.x - p.x, b.z - p.z) > R);
  const B = W.boss;
  if (B && B.state !== 'in' && B.state !== 'dying') {
    for (const o of B.orbs) if (o.hp > 0 && hyp(o.x - p.x, o.z - p.z) < R + 0.6) hitOrb(W, B, o, 6, p.id);
    if (hyp(B.x - p.x, B.z - p.z) < R + B.r && !B.orbs.some((o) => o.hp > 0)) hitBoss(W, B, 12, p.id, B.x, B.z);
  }
  W.ev.push({ k: 'pulse', pid: p.id, x: p.x, z: p.z, kills, bolts: before - W.bolts.length });
}
function hurt(W, p, cause, x, z) {
  if (!p.alive || p.inv > 0) return;
  if (W.net === 'host' && p.remote) return;   // the guest judges its own hits
  if (p.shield > 0) {
    p.shield--; p.inv = F.hitInv; p.hurtT = 0.5; W.stats.shieldHits++;
    const key = W.mode === 'campaign' ? W.wave : 'S';
    W.stats.waveHits[key] = (W.stats.waveHits[key] || 0) + 1;
    // knock the Warden away from what hit it
    const dx = p.x - x, dz = p.z - z, d = hyp(dx, dz) || 1;
    p.vx += (dx / d) * 9; p.vz += (dz / d) * 9;
    W.ev.push({ k: 'shield', pid: p.id, x: p.x, z: p.z, left: p.shield, cause, fx: x, fz: z });
    if (W.net === 'guest' && p.id === 2) W.claims.push({ shield: p.shield });
    return;
  }
  p.alive = false; p.deadT = 0; p.vx = p.vz = 0;
  W.lives = Math.max(0, W.lives - 1);
  W.stats.deaths++; W.lastDeathN = W.n;
  const key = W.mode === 'campaign' ? W.wave : 'S';
  W.stats.waveDeaths[key] = (W.stats.waveDeaths[key] || 0) + 1;
  W.stats.waveHits[key] = (W.stats.waveHits[key] || 0) + 1;
  W.chain = 0;
  W.ev.push({ k: 'death', pid: p.id, x: p.x, z: p.z, cause, fx: x, fz: z, lives: W.lives });
  if (W.net === 'guest' && p.id === 2) W.claims.push({ dead: 1, cause });
}
function respawn(W, p) {
  // the safest spot, leaning to the middle
  let best = [0, 0], bs = -1e9;
  for (let i = 0; i < 30; i++) {
    const x = i ? rr(W, -AW * 0.7, AW * 0.7) : p.x * 0.5, z = i ? rr(W, -AH * 0.7, AH * 0.7) : p.z * 0.5;
    let d = 30;
    for (const e of W.enemies) if (HOSTILE.has(e.type) || e.type === 'pylon') d = Math.min(d, hyp(e.x - x, e.z - z) - e.r);
    for (const h of W.hazards) if (h.kind === 'pool') d = Math.min(d, hyp(h.x - x, h.z - z) - h.r);
    if (W.boss) d = Math.min(d, hyp(W.boss.x - x, W.boss.z - z) - W.boss.r - 3);
    const sc = d - hyp(x, z) * 0.15;
    if (sc > bs) { bs = sc; best = [x, z]; }
  }
  p.x = best[0]; p.z = best[1]; p.vx = p.vz = 0;
  p.alive = true; p.inv = F.inv; p.deadT = 0;
  // clear the ground: small machines are scrapped, big ones thrown back, bolts gone
  for (const e of W.enemies) {
    const dx = e.x - p.x, dz = e.z - p.z, d = hyp(dx, dz) || 1;
    if (d > F.clearR) continue;
    if (e.type === 'crawler' || e.type === 'dart' || e.type === 'shard') { e.gone = true; e.hp = 0; W.ev.push({ k: 'scrap', x: e.x, z: e.z, type: e.type }); continue; }
    if (e.type === 'pylon') continue;
    const k = F.clearR / d;
    e.x = clamp(p.x + dx * k, -AW + e.r, AW - e.r); e.z = clamp(p.z + dz * k, -AH + e.r, AH - e.r); e.st = 1; e.aimT = 0;
  }
  W.bolts = W.bolts.filter((b) => hyp(b.x - p.x, b.z - p.z) > F.clearR);
  W.ev.push({ k: 'spawn', pid: p.id, x: p.x, z: p.z });
}

// ------------------------------------------------------------------ machines
function enemy(W, e, dt) {
  if (e.remote) { e.x += e.vx * dt; e.z += e.vz * dt; e.t += dt; return; }
  const R = W.R, E = ENEMY[e.type];
  e.t += dt;
  e.hitT = Math.max(0, e.hitT - dt);
  if (e.born > 0) { e.born -= dt; return; }
  const spd = R.spd * (1 + R.rush * Math.min(1, W.waveT / 60));
  const P = nearestPlayer(W, e.x, e.z);
  const tx = P ? P.x : 0, tz = P ? P.z : 0;
  const dx = tx - e.x, dz = tz - e.z, d = hyp(dx, dz) || 1;
  e.st -= dt;
  switch (e.type) {
    case 'crawler': {
      if (e.st <= 0) {
        e.st = rr(W, 0.5, 1.1);
        const wa = rr(W, 0, TAU), wv = P ? R.wander : 1;
        let hx = (dx / d) * (1 - wv) + Math.cos(wa) * wv * 1.25, hz = (dz / d) * (1 - wv) + Math.sin(wa) * wv * 1.25;
        const l = hyp(hx, hz) || 1;
        e.a = Math.atan2(hz / l, hx / l);
      }
      // close in on the Warden properly once near
      let a = e.a;
      if (P && d < 4.5) a = Math.atan2(dz, dx);
      const v = E.v * spd;
      e.vx = Math.cos(a) * v; e.vz = Math.sin(a) * v;
      break;
    }
    case 'brute': {
      // heads for the nearest survivor, else the Warden
      let gx = tx, gz = tz;
      let sd = 11;
      for (const s of W.survivors) { const q = hyp(s.x - e.x, s.z - e.z); if (q < sd) { sd = q; gx = s.x; gz = s.z; } }
      const ax = gx - e.x, az = gz - e.z, l = hyp(ax, az) || 1;
      const want = Math.atan2(az, ax);
      e.a += clamp(angDiff(e.a, want), -1.6 * dt, 1.6 * dt);
      const v = E.v * spd * (e.st > 0 ? 0.3 : 1);
      e.vx = Math.cos(e.a) * v; e.vz = Math.sin(e.a) * v;
      void l;
      break;
    }
    case 'spitter': {
      // keep a fighting range and strafe; tell, then fire
      const [lo, hi] = E.range;
      let fx = 0, fz = 0;
      if (P) {
        if (d < lo) { fx -= dx / d; fz -= dz / d; } else if (d > hi) { fx += dx / d; fz += dz / d; }
        const side = (e.id % 2 ? 1 : -1) * 0.6;
        fx += (-dz / d) * side; fz += (dx / d) * side;
      }
      const l = hyp(fx, fz);
      const v = E.v * spd * (e.aimT > 0 ? 0.15 : 1);
      if (l > 0.05) { e.vx = (fx / l) * v; e.vz = (fz / l) * v; e.a = Math.atan2(dz, dx); } else { e.vx *= 0.9; e.vz *= 0.9; }
      if (!P) break;
      if (e.aimT > 0) {
        e.aimT -= dt;
        // the aim line tracks the Warden for the first part of the tell, then locks so you can sidestep
        if (e.aimT > e.aimLock) { e.aimX = P.x; e.aimZ = P.z; e.aimA = Math.atan2(P.z - e.z, P.x - e.x) + e.aimErr; }
        if (e.aimT <= 0) {
          const v2 = R.boltV;
          W.bolts.push({ id: W.nextId++, x: e.x + Math.cos(e.aimA) * 0.7, z: e.z + Math.sin(e.aimA) * 0.7, vx: Math.cos(e.aimA) * v2, vz: Math.sin(e.aimA) * v2, life: 6, r: 0.24 });
          W.ev.push({ k: 'bolt', x: e.x, z: e.z, id: e.id });
          e.fireT = rr(W, 0.8, 1.25) / Math.max(0.05, R.fire);
        }
      } else {
        e.fireT -= dt;
        if (e.fireT <= 0 && d < 17 && P.inv < 0.5) {
          const T = Math.max(0.5, R.warn * 0.62);
          e.aimT = T; e.aimLock = T * 0.38; e.aimErr = (rand(W) - 0.5) * 2 * R.aim;
          W.ev.push({ k: 'aim', id: e.id, x: e.x, z: e.z, T });
        }
      }
      break;
    }
    case 'hive': {
      e.vx = Math.cos(e.t * 0.3 + e.wob) * E.v; e.vz = Math.sin(e.t * 0.23 + e.wob) * E.v;
      e.spawnT -= dt;
      const darts = W.enemies.filter((q) => q.type === 'dart' && q.hive === e.id).length;
      if (e.spawnT <= 0 && darts < E.maxDarts) {
        if (!e.tell) { e.tell = Math.max(0.6, R.warn * 0.55); W.ev.push({ k: 'hivetell', id: e.id, x: e.x, z: e.z, T: e.tell }); }
        e.tell -= dt;
        if (e.tell <= 0) {
          e.tell = 0; e.spawnT = E.every / spd * rr(W, 0.85, 1.2);
          const q = addEnemy(W, 'dart', e.x, e.z);
          q.hive = e.id; q.a = Math.atan2(dz, dx) + rr(W, -1, 1); q.born = 0.15;
          W.ev.push({ k: 'dart', x: e.x, z: e.z });
        }
      }
      break;
    }
    case 'dart': {
      e.life -= dt;
      if (e.life <= 0) { e.gone = true; e.hp = 0; W.ev.push({ k: 'dartpop', x: e.x, z: e.z }); break; }
      if (P) e.a += clamp(angDiff(e.a, Math.atan2(dz, dx)), -E.turn * spd * dt, E.turn * spd * dt);
      const v = E.v * spd;
      e.vx = Math.cos(e.a) * v; e.vz = Math.sin(e.a) * v;
      // darts bounce off the walls
      if (Math.abs(e.x) > AW - 0.6) e.a = Math.PI - e.a;
      if (Math.abs(e.z) > AH - 0.6) e.a = -e.a;
      break;
    }
    case 'pylon': {
      e.vx = e.vz = 0;
      if (e.link && e.id < e.link) {
        // the lower id runs the arc cycle for the pair: off -> tell -> on
        const o = W.enemies.find((q) => q.id === e.link && q.hp > 0);
        if (!o) { e.link = 0; e.arc = 0; break; }
        e.arcT -= dt;
        if (e.arcT <= 0) {
          if (e.arc === 0) { e.arc = 1; e.arcT = Math.max(0.6, R.warn * 0.7); W.ev.push({ k: 'arctell', x: (e.x + o.x) / 2, z: (e.z + o.z) / 2, T: e.arcT }); }
          else if (e.arc === 1) { e.arc = 2; e.arcT = E.on; W.ev.push({ k: 'arcon', x: (e.x + o.x) / 2, z: (e.z + o.z) / 2 }); }
          else { e.arc = 0; e.arcT = E.off * rr(W, 0.8, 1.3); }
        }
        o.arc = e.arc;
      }
      break;
    }
    case 'splitter': case 'shard': {
      const v = E.v * spd;
      const a = Math.atan2(dz, dx) + Math.sin(e.t * 2 + e.wob) * 0.35;
      e.a = a; e.vx = Math.cos(a) * v; e.vz = Math.sin(a) * v;
      if (!P) { e.vx *= 0.3; e.vz *= 0.3; }
      break;
    }
    default: e.vx = e.vz = 0;
  }
  e.x = clamp(e.x + e.vx * dt, -AW + e.r, AW - e.r);
  e.z = clamp(e.z + e.vz * dt, -AH + e.r, AH - e.r);
  // walking into a wall turns a wanderer around
  if (e.type === 'crawler' && (Math.abs(e.x) >= AW - e.r - 0.01 || Math.abs(e.z) >= AH - e.r - 0.01)) e.st = Math.min(e.st, 0.05);
}
// machines shoulder each other apart so they come as a crowd, not a blob
function separate(W) {
  const L = W.enemies;
  for (let i = 0; i < L.length; i++) {
    const a = L[i];
    if (a.type === 'pylon' || a.type === 'dart') continue;
    for (let j = i + 1; j < L.length; j++) {
      const b = L[j];
      if (b.type === 'pylon' || b.type === 'dart') continue;
      const dx = b.x - a.x, dz = b.z - a.z, rr2 = a.r + b.r;
      if (Math.abs(dx) > rr2 || Math.abs(dz) > rr2) continue;
      const d = hyp(dx, dz);
      if (d >= rr2 || d < 1e-6) continue;
      const push = (rr2 - d) * 0.5, wa = a.type === 'brute' || a.type === 'hive' ? 0.15 : 1, wb = b.type === 'brute' || b.type === 'hive' ? 0.15 : 1, s = wa + wb;
      a.x -= (dx / d) * push * (wa / s) * 2; a.z -= (dz / d) * push * (wa / s) * 2;
      b.x += (dx / d) * push * (wb / s) * 2; b.z += (dz / d) * push * (wb / s) * 2;
    }
  }
}
function damage(W, e, dmg, pid, by, hx, hz) {
  if (e.hp <= 0 || e.born > 0.25) return;
  e.hp -= dmg; e.hitT = 0.12;
  W.stats.hits++;
  if (e.hp <= 0) { kill(W, e, pid, by); return; }
  W.ev.push({ k: 'hit', x: hx ?? e.x, z: hz ?? e.z, type: e.type, id: e.id });
  if (e.type === 'brute' && by === 'shot') {
    // a heavy shove back along the shot
    const P = W.players.find((p) => p.id === pid);
    if (P) { const dx = e.x - P.x, dz = e.z - P.z, d = hyp(dx, dz) || 1; e.x = clamp(e.x + (dx / d) * ENEMY.brute.knock, -AW + e.r, AW - e.r); e.z = clamp(e.z + (dz / d) * ENEMY.brute.knock, -AH + e.r, AH - e.r); }
  }
}
function kill(W, e, pid, by) {
  if (e.dead) return;
  e.hp = 0; e.dead = true;
  const sc = ENEMY[e.type].score;
  W.score += sc; W.stats.kills++;
  W.ev.push({ k: 'kill', x: e.x, z: e.z, type: e.type, score: sc, by, pid, id: e.id, a: e.a });
  if (e.type === 'splitter') for (let i = 0; i < 2; i++) { const q = addEnemy(W, 'shard', e.x + (i ? 0.5 : -0.5), e.z); q.born = 0.2; }
  if (e.type === 'hive') for (const q of W.enemies) if (q.type === 'dart' && q.hive === e.id) q.life = Math.min(q.life, 2.5);
  if (e.link) { const o = W.enemies.find((q) => q.id === e.link); if (o) { o.link = 0; o.arc = 0; } }
}

// ------------------------------------------------------------------ shots, bolts, hazards
function shots(W, dt) {
  const B = W.boss;
  for (const s of W.shots) {
    s.life -= dt;
    s.x += s.vx * dt; s.z += s.vz * dt;
    if (Math.abs(s.x) > AW || Math.abs(s.z) > AH) { s.life = 0; W.ev.push({ k: 'wallhit', x: clamp(s.x, -AW, AW), z: clamp(s.z, -AH, AH) }); continue; }
    if (s.ghost || s.life <= 0) continue;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0.25) continue;
      const rr2 = e.r + F.shotR;
      const dx = e.x - s.x, dz = e.z - s.z;
      if (dx * dx + dz * dz < rr2 * rr2) { damage(W, e, 1, s.pid, 'shot', s.x, s.z); s.life = 0; break; }
    }
    if (s.life <= 0 || !B || B.state === 'in' || B.state === 'dying') continue;
    for (const o of B.orbs) {
      if (o.hp <= 0) continue;
      if (hyp(o.x - s.x, o.z - s.z) < 0.75) { hitOrb(W, B, o, s.side ? 0.5 : 1, s.pid); s.life = 0; break; }
    }
    if (s.life > 0 && hyp(B.x - s.x, B.z - s.z) < B.r + F.shotR) {
      s.life = 0;
      if (B.orbs.some((o) => o.hp > 0)) W.ev.push({ k: 'deflect', x: s.x, z: s.z });
      else hitBoss(W, B, (B.state === 'stun' ? 2 : 1) * (s.side ? 0.5 : 1), s.pid, s.x, s.z);
    }
  }
  W.shots = W.shots.filter((s) => s.life > 0);
}
function bolts(W, dt) {
  for (const b of W.bolts) {
    b.life -= dt;
    b.x += b.vx * dt; b.z += b.vz * dt;
    if (Math.abs(b.x) > AW + 0.5 || Math.abs(b.z) > AH + 0.5) b.life = 0;
  }
  W.bolts = W.bolts.filter((b) => b.life > 0);
}
function hazards(W, dt) {
  for (const h of W.hazards) {
    h.t += dt;
    if (h.state === 'tell' && h.t >= h.T) { h.state = 'live'; h.t = 0; W.ev.push({ k: 'hazard', kind: h.kind, x: h.x, z: h.z, r: h.r }); }
    else if (h.state === 'live' && h.t >= h.L) h.state = 'done';
    if (h.kind === 'beam' && h.state === 'live') h.a = h.a0 + h.dir * h.sweep * Math.min(1, h.t / h.L);
    if (h.kind === 'beam' && h.state === 'tell' && W.boss) { h.x = W.boss.x; h.z = W.boss.z; }
  }
  W.hazards = W.hazards.filter((h) => h.state !== 'done');
}
// is (x, z) inside live hazard h?
export function inHazard(h, x, z, pad = 0) {
  if (h.kind === 'ring' || h.kind === 'pool') return hyp(x - h.x, z - h.z) < h.r + pad;
  if (h.kind === 'beam') {
    const c = Math.cos(h.a), s = Math.sin(h.a), px = x - h.x, pz = z - h.z, along = px * c + pz * s;
    return along > 0 && along < h.len && Math.abs(-px * s + pz * c) < h.w + pad;
  }
  return false;
}
function survivors(W, dt) {
  const trac = W.up.tractor ? 1 : 0;
  for (const s of W.survivors) {
    s.t -= dt;
    let fx = 0, fz = 0;
    for (const e of W.enemies) {
      if (!HOSTILE.has(e.type)) continue;
      const dx = s.x - e.x, dz = s.z - e.z, d = hyp(dx, dz);
      if (d < 3.2 && d > 0.01) { fx += (dx / d) * (3.2 - d); fz += (dz / d) * (3.2 - d); }
    }
    let v = 0.85;
    if (trac) {
      const P = nearestPlayer(W, s.x, s.z);
      if (P && hyp(P.x - s.x, P.z - s.z) < 10) { const dx = P.x - s.x, dz = P.z - s.z, d = hyp(dx, dz) || 1; fx += (dx / d) * 2; fz += (dz / d) * 2; v = 1.9; }
    }
    if (fx || fz) { const l = hyp(fx, fz); s.a = Math.atan2(fz / l, fx / l); v = Math.max(v, 1.6); }
    else if (s.t <= 0) { s.t = rr(W, 1.2, 3); s.a += rr(W, -1.4, 1.4); if (rand(W) < 0.3) s.idle = 1; else s.idle = 0; }
    if (s.idle && !fx && !fz) v = 0;
    s.vx = Math.cos(s.a) * v; s.vz = Math.sin(s.a) * v;
    s.x += s.vx * dt; s.z += s.vz * dt;
    if (Math.abs(s.x) > AW - 1) { s.x = clamp(s.x, -AW + 1, AW - 1); s.a = Math.PI - s.a; }
    if (Math.abs(s.z) > AH - 1) { s.z = clamp(s.z, -AH + 1, AH - 1); s.a = -s.a; }
  }
}

// everything touching everything
function contacts(W) {
  const rescueR = F.rescueR + (W.up.tractor ? 0.6 : 0);
  for (const p of W.players) {
    if (!p.alive) continue;
    // guest side: only my own Warden is judged here
    if (W.net === 'guest' && p.remote) continue;
    if (W.net === 'host' && p.remote) {
      // the host still lets the guest pick up survivors
      for (const s of W.survivors) if (!s.saved && hyp(s.x - p.x, s.z - p.z) < rescueR) rescue(W, s, p);
      continue;
    }
    if (W.net !== 'guest') for (const s of W.survivors) if (!s.saved && hyp(s.x - p.x, s.z - p.z) < rescueR) rescue(W, s, p);
    if (p.inv > 0) continue;
    const pr = F.r * 0.8;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0 || e.type === 'dummy') continue;
      const rr2 = e.r + pr;
      if (Math.abs(e.x - p.x) < rr2 && Math.abs(e.z - p.z) < rr2 && hyp(e.x - p.x, e.z - p.z) < rr2) { hurt(W, p, e.type, e.x, e.z); break; }
      if (e.type === 'pylon' && e.arc === 2 && e.link && e.id < e.link) {
        const o = W.enemies.find((q) => q.id === e.link);
        if (o && segDist(p.x, p.z, e.x, e.z, o.x, o.z) < 0.3 + pr) { hurt(W, p, 'arc', (e.x + o.x) / 2, (e.z + o.z) / 2); break; }
      }
    }
    if (!p.alive || p.inv > 0) continue;
    for (const b of W.bolts) if (hyp(b.x - p.x, b.z - p.z) < b.r + pr) { b.life = 0; hurt(W, p, 'bolt', b.x - b.vx * 0.05, b.z - b.vz * 0.05); break; }
    if (!p.alive || p.inv > 0) continue;
    for (const h of W.hazards) if (h.state === 'live' && h.kind !== 'lane' && inHazard(h, p.x, p.z, pr * 0.6)) { hurt(W, p, h.kind, h.x, h.z); break; }
    const B = W.boss;
    if (p.alive && p.inv <= 0 && B && B.state !== 'in' && B.state !== 'dying') {
      if (hyp(B.x - p.x, B.z - p.z) < B.r * 0.88 + pr) hurt(W, p, 'boss', B.x, B.z);
      for (const o of B.orbs) if (o.hp > 0 && hyp(o.x - p.x, o.z - p.z) < 0.6 + pr) { hurt(W, p, 'orb', o.x, o.z); break; }
    }
  }
  W.bolts = W.bolts.filter((b) => b.life > 0);
  // brutes crush survivors
  for (const e of W.enemies) {
    if (e.type !== 'brute' || e.born > 0) continue;
    for (const s of W.survivors) if (!s.saved && hyp(s.x - e.x, s.z - e.z) < e.r + 0.35) { s.saved = -1; W.stats.lost++; W.ev.push({ k: 'lost', x: s.x, z: s.z }); }
  }
  // live hazards also hurt survivors
  for (const h of W.hazards) if (h.state === 'live' && h.kind === 'pool') for (const s of W.survivors) if (!s.saved && inHazard(h, s.x, s.z)) { s.saved = -1; W.stats.lost++; W.ev.push({ k: 'lost', x: s.x, z: s.z }); }
  W.survivors = W.survivors.filter((s) => !s.saved);
}
function segDist(px, pz, ax, az, bx, bz) {
  const vx = bx - ax, vz = bz - az, l2 = vx * vx + vz * vz || 1;
  const t = clamp(((px - ax) * vx + (pz - az) * vz) / l2, 0, 1);
  return hyp(px - (ax + vx * t), pz - (az + vz * t));
}
function rescue(W, s, p) {
  s.saved = 1;
  W.chain++;
  const bonus = Math.min(SCORE.rescueMax, SCORE.rescue * W.chain);
  W.score += bonus; W.stats.rescued++;
  W.ev.push({ k: 'rescue', x: s.x, z: s.z, bonus, chain: W.chain, pid: p.id });
}

function waveClear(W) {
  W.phase = 'clear'; W.phaseT = 2.2;
  const bonus = SCORE.wave * (1 + (W.mode === 'campaign' ? W.sector : Math.floor(W.waveN / 5)));
  W.score += bonus;
  // leftover pylons and dummies power down; the survivors still out there are walked out
  for (const e of W.enemies) if (e.type === 'pylon' || e.type === 'dummy') { e.gone = true; e.hp = 0; W.ev.push({ k: 'scrap', x: e.x, z: e.z, type: e.type }); }
  W.enemies = W.enemies.filter((e) => !e.gone);
  const left = W.survivors.length;
  W.survivors = [];
  W.bolts = []; W.hazards = []; W.spawnQ = []; W.portals = [];
  W.ev.push({ k: 'waveclear', wave: W.wave, n: W.waveN, bonus, evac: left, label: waveLabel(W) });
}
function nextWave(W) {
  if (W.mode === 'campaign') {
    if (W.wave >= WAVES) { W.over = true; W.result = 'clear'; W.ev.push({ k: 'over', clear: true }); return; }
    W.wave++;
  } else W.waveN++;
  W.tutorial = W.tutorial && W.wave <= 1;
  startWave(W);
}

// ------------------------------------------------------------------ bosses
function startBoss(W) {
  const key = bossKey(W), D = BOSSES[key], R = W.R;
  const hpK = W.mode === 'campaign' ? 1 : 0.7 + 0.12 * Math.floor(W.waveN / STAND.bossEvery);
  const hp = Math.round(R.bossHP * hpK);
  W.boss = { key, x: 0, z: -AH - 3, vx: 0, vz: 0, hp, max: hp, r: D.r, state: 'in', t: 0, st: 2.4, atkI: 0, phase: 1, hitT: 0, a: Math.PI / 2, orbs: [], cur: null, spin: 0, stun: 0 };
  if (D.orbs) addOrbs(W, W.boss, D.orbs);
  W.ev.push({ k: 'bossin', key });
}
function addOrbs(W, B, n) {
  B.orbs = [];
  for (let i = 0; i < n; i++) B.orbs.push({ i, a: (i / n) * TAU, x: B.x, z: B.z, hp: 10 + 3 * W.sector, max: 10 + 3 * W.sector });
}
function hitOrb(W, B, o, dmg, pid) {
  o.hp -= dmg;
  if (o.hp <= 0) { W.score += 300; W.ev.push({ k: 'orbdown', x: o.x, z: o.z, left: B.orbs.filter((q) => q.hp > 0).length }); }
  else W.ev.push({ k: 'bosshit', x: o.x, z: o.z, orb: 1 });
  void pid;
}
function hitBoss(W, B, dmg, pid, x, z) {
  if (B.state === 'dying' || B.state === 'in') return;
  B.hp -= dmg; B.hitT = 0.1;
  W.ev.push({ k: 'bosshit', x, z });
  if (B.phase === 1 && B.hp <= B.max / 2) {
    B.phase = 2;
    W.ev.push({ k: 'bossphase', key: B.key });
    if (BOSSES[B.key].orbs) addOrbs(W, B, BOSSES[B.key].orbs);
  }
  if (B.hp <= 0) {
    B.state = 'dying'; B.st = 2.4; B.cur = null;
    W.hazards = []; W.bolts = [];
    for (const e of W.enemies) if (HOSTILE.has(e.type)) { e.hp = 0; e.gone = true; W.ev.push({ k: 'scrap', x: e.x, z: e.z, type: e.type }); }
    W.ev.push({ k: 'bossdying', x: B.x, z: B.z, key: B.key });
  }
  void pid;
}
function boss(W, B, dt) {
  if (W.net === 'guest') return;
  const D = BOSSES[B.key], R = W.R;
  B.t += dt; B.st -= dt; B.hitT = Math.max(0, B.hitT - dt);
  W.stats.bossT += dt;
  B.spin += dt * (B.state === 'act' ? 2.4 : 0.6);
  // orbiting shield orbs
  B.orbs.forEach((o) => { o.a += dt * (0.9 + 0.25 * B.phase); const rr2 = B.r + 2.1; o.x = B.x + Math.cos(o.a) * rr2; o.z = B.z + Math.sin(o.a) * rr2; });
  const P = nearestPlayer(W, B.x, B.z);
  if (B.state === 'in') {
    B.z += dt * 2.2;
    if (B.st <= 0) { B.state = 'idle'; B.st = 1.6; }
    return;
  }
  if (B.state === 'dying') {
    if (B.st <= 0) {
      const bonus = SCORE.boss + (W.mode === 'campaign' ? W.sector * 1000 : 0);
      W.score += bonus;
      W.ev.push({ k: 'bosskill', x: B.x, z: B.z, key: B.key, bonus });
      W.boss = null;
      W.lastBossN = W.n;
      waveClear(W);
    }
    return;
  }
  const rate = R.bossRate * (B.phase === 2 ? 1.15 : 1);
  if (B.state === 'stun') { if (B.st <= 0) { B.state = 'idle'; B.st = 1.2 / rate; } return; }
  if (B.state === 'idle') {
    // drift to a fighting distance from the Warden
    if (P && D.v) {
      const dx = P.x - B.x, dz = P.z - B.z, d = hyp(dx, dz) || 1;
      const want = d > 9 ? 1 : d < 6 ? -1 : 0.2 * Math.sin(B.t);
      B.vx += ((dx / d) * want * D.v - B.vx) * Math.min(1, dt * 2); B.vz += ((dz / d) * want * D.v - B.vz) * Math.min(1, dt * 2);
      B.a = Math.atan2(dz, dx);
    } else { B.vx *= 0.9; B.vz *= 0.9; }
    B.x = clamp(B.x + B.vx * dt, -AW + B.r, AW - B.r); B.z = clamp(B.z + B.vz * dt, -AH + B.r, AH - B.r);
    if (B.st <= 0 && P) {
      const list = B.phase === 2 ? D.p2 : D.atk;
      const kind = list[B.atkI++ % list.length];
      beginAttack(W, B, kind, P);
    }
    return;
  }
  const C = B.cur;
  if (!C) { B.state = 'idle'; B.st = 1; return; }
  C.t += dt;
  if (B.state === 'tell') {
    if (C.kind === 'charge' && P && C.t < C.T * 0.6) { C.a = Math.atan2(P.z - B.z, P.x - B.x); if (C.lane) C.lane.a = C.a; }
    if (C.kind === 'fan' && P) C.a = Math.atan2(P.z - B.z, P.x - B.x);
    if (C.t >= C.T) { B.state = 'act'; C.t = 0; act(W, B, C, 'start'); }
    return;
  }
  // act
  act(W, B, C, 'run', dt);
}
function beginAttack(W, B, kind, P) {
  const R = W.R, T = Math.max(0.65, R.warn * (kind === 'spiral' || kind === 'summon' ? 0.8 : 1));
  const C = { kind, t: 0, T, a: Math.atan2(P.z - B.z, P.x - B.x), n: 0 };
  B.cur = C; B.state = 'tell';
  B.vx = B.vz = 0;
  if (kind === 'stomp') W.hazards.push(C.h = { id: W.nextId++, kind: 'ring', x: B.x, z: B.z, r: B.r + 3.6 + W.sector * 0.25, t: 0, T, L: 0.3, state: 'tell' });
  if (kind === 'charge') W.hazards.push(C.lane = { id: W.nextId++, kind: 'lane', x: B.x, z: B.z, a: C.a, w: B.r, len: 60, t: 0, T, L: 9, state: 'tell' });
  if (kind === 'pools') {
    const n = 2 + Math.min(2, W.sector);
    for (let i = 0; i < n; i++) {
      const x = i === 0 ? P.x : clamp(P.x + rr(W, -7, 7), -AW + 2, AW - 2), z = i === 0 ? P.z : clamp(P.z + rr(W, -5, 5), -AH + 2, AH - 2);
      W.hazards.push({ id: W.nextId++, kind: 'pool', x, z, r: 1.9 + rand(W) * 0.5, t: 0, T: Math.max(1.1, T), L: 4, state: 'tell' });
    }
  }
  if (kind === 'sweep') {
    // the beam starts a little to one side of you and sweeps across: step back against the sweep to slip behind it
    const dir = rand(W) < 0.5 ? -1 : 1, sweep = 1.5;
    W.hazards.push(C.h = { id: W.nextId++, kind: 'beam', x: B.x, z: B.z, a0: C.a - dir * 0.42, a: C.a - dir * 0.42, dir, sweep, w: 0.38, len: 56, t: 0, T: T + 0.25, L: 2.4, state: 'tell' });
  }
  if (kind === 'summon') {
    const n = 2 + Math.floor(W.sector / 2) + (B.phase === 2 ? 1 : 0);
    W.spawnQ.push({ t: W.waveT + T, types: Array(n).fill(W.sector >= 3 ? 'shard' : 'crawler') });
  }
  W.ev.push({ k: 'bosstell', kind, x: B.x, z: B.z, T, key: B.key });
}
function act(W, B, C, ph, dt = 0) {
  const R = W.R;
  const done = (rest = 1.6) => { B.cur = null; B.state = 'idle'; B.st = rest / (R.bossRate * (B.phase === 2 ? 1.15 : 1)); };
  switch (C.kind) {
    case 'stomp':
      if (ph === 'start') W.ev.push({ k: 'stomp', x: B.x, z: B.z, r: C.h.r });
      if (C.t > 0.6) done(1.8);
      break;
    case 'summon':
      if (C.t > 0.3) done(1.2);
      break;
    case 'fan': {
      if (ph === 'start') {
        const n = 4 + Math.min(2, Math.floor(W.sector / 2)) + (B.phase === 2 ? 1 : 0), spread = 0.3;
        for (let i = 0; i < n; i++) {
          const a = C.a + (i - (n - 1) / 2) * spread;
          W.bolts.push({ id: W.nextId++, x: B.x + Math.cos(a) * B.r, z: B.z + Math.sin(a) * B.r, vx: Math.cos(a) * R.boltV * 0.85, vz: Math.sin(a) * R.boltV * 0.85, life: 7, r: 0.3, big: 1 });
        }
        W.ev.push({ k: 'bossfire', x: B.x, z: B.z, kind: 'fan' });
      }
      if (C.t > 0.5) done(1.7);
      break;
    }
    case 'spiral': {
      const arms = 2 + (W.sector >= 3 && B.phase === 2 ? 1 : 0);
      C.acc = (C.acc || 0) + dt;
      while (C.acc >= 0.26) {
        C.acc -= 0.26; C.n++;
        for (let k = 0; k < arms; k++) {
          const a = C.a + C.n * 0.33 + (k / arms) * TAU;
          W.bolts.push({ id: W.nextId++, x: B.x + Math.cos(a) * B.r, z: B.z + Math.sin(a) * B.r, vx: Math.cos(a) * R.boltV * 0.75, vz: Math.sin(a) * R.boltV * 0.75, life: 7, r: 0.27, big: 1 });
        }
        if (C.n % 3 === 1) W.ev.push({ k: 'bossfire', x: B.x, z: B.z, kind: 'spiral' });
      }
      if (C.t > 2.4) done(1.6);
      break;
    }
    case 'pools':
      if (C.t > 0.4) done(1.4);
      break;
    case 'sweep':
      if (ph === 'start') W.ev.push({ k: 'beam', x: B.x, z: B.z });
      if (C.h) { C.h.x = B.x; C.h.z = B.z; }
      if (C.t > (C.h ? C.h.L : 2) + 0.2) done(1.6);
      break;
    case 'charge': {
      if (ph === 'start') W.ev.push({ k: 'charge', x: B.x, z: B.z });
      const v = 13 + W.sector;
      B.x += Math.cos(C.a) * v * dt; B.z += Math.sin(C.a) * v * dt;
      B.a = C.a;
      // survivors in the way
      for (const s of W.survivors) if (!s.saved && hyp(s.x - B.x, s.z - B.z) < B.r) { s.saved = -1; W.stats.lost++; W.ev.push({ k: 'lost', x: s.x, z: s.z }); }
      if (Math.abs(B.x) > AW - B.r || Math.abs(B.z) > AH - B.r || C.t > 4) {
        B.x = clamp(B.x, -AW + B.r, AW - B.r); B.z = clamp(B.z, -AH + B.r, AH - B.r);
        B.cur = null; B.state = 'stun'; B.st = 1.8;
        if (C.lane) C.lane.state = 'done';
        W.ev.push({ k: 'slam', x: B.x, z: B.z });
      }
      break;
    }
    default: done();
  }
}

// ------------------------------------------------------------------ online helpers
export function adoptWave(W, wave, waveN) {
  if (W.wave === wave && W.waveN === waveN) return;
  W.wave = wave; W.waveN = waveN;
  W.R = W.mode === 'campaign' ? rampAt(W.sector, Math.min(wave, WAVES - 1)) : rampLevel(standLevel(W.fightT));
}
