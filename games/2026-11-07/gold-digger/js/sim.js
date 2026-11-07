// The simulation: a fixed 120 Hz step over plain data (structuredClone-able), so instant replays and the Node
// checks reproduce a run exactly. No rendering, no Math.random: every random number comes from W.rs.
// Events for sound, effects and the HUD go into W.ev and are drained by the game each frame.
import { T, SOLID, PHYS, TOOLS, STEP, PICK_HP, BLASTABLE, LOOT, GEMS, START, LIFE_EVERY, LEVELS, DEPTHS, BIOMES, BOSSES,
  rampAt, endlessRamp, applyDiff, DIFFICULTY } from './config.js?v=10';
import { tileAt, solidT, makeBody, stepBody, fallHurt, boxOverlapsTile, EPS } from './physics.js?v=10';
import { generate, bossArena, hash, findName } from './levelgen.js?v=10';
import { validateLevel } from './nav.js?v=10';
import { updateBoss, makeBoss, bossHit } from './boss.js?v=10';

export { STEP };
export const rnd = (W) => { W.rs = (W.rs + 0x6D2B79F5) >>> 0; let t = W.rs; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (W, a, b) => a + (b - a) * rnd(W);
export const ev = (W, k, o = {}) => { o.k = k; W.ev.push(o); return o; };
export const drainEvents = (W) => { const e = W.ev; W.ev = []; return e; };
export const cloneWorld = (W) => structuredClone(W);

// ------------------------------------------------------------------ world creation
// opts: { seed, mode, diff, depth, level, endlessN, carry }
export function makeWorld(o) {
  const diff = o.diff || 'normal', D = DIFFICULTY[diff] || DIFFICULTY.normal;
  const endless = o.mode === 'endless';
  const depth = o.depth || 0, level = o.level || 0, n = o.endlessN || 0;
  const biome = endless ? (n === 0 ? 0 : (Math.floor(n / 3)) % 5) : depth;
  const base = endless ? endlessRamp(n) : rampAt(depth, Math.min(level, LEVELS - 1));
  const ramp = applyDiff(base, diff);
  const seed = (o.seed >>> 0) || 1;
  const isBoss = !endless && level >= LEVELS;
  const M = isBoss ? bossArena(BIOMES[depth].boss, depth, seed)
    : generate({ seed, depth: endless ? 5 + n : depth, level: endless ? n % 3 : level, ramp, biome, endless, n, validate: validateLevel });
  M.biome = biome;
  const c = o.carry || {};
  const up = c.up || {};
  const maxHp = Math.max(1, START.hearts + (up.heart || 0) + D.hearts);
  const W = {
    v: 1, seed, rs: hash(seed, depth, level, n, 99), n: 0, t: 0, mode: o.mode || 'campaign', diff, endless, depth, level, endlessN: n, biome, isBoss,
    ramp, M, ev: [], over: false, clear: false, clearT: 0, score: c.score || 0, lifePts: c.lifePts || 0,
    lives: c.lives ?? Math.max(1, START.lives + D.lives), cp: { x: M.start.x, y: M.start.y }, cpIdx: -1,
    stats: { gold: 0, gems: 0, kills: 0, secrets: 0, finds: 0, hits: 0, deaths: 0, time: 0, goldGot: 0, seen: 0, chests: 0 },
    found: [],     // [{ kind, id }] discovered this level (the game adds them to the journal)
    seenCreature: {},
    loot: [], bats: [], crawlers: [], shades: [], eels: [], stalac: [], geysers: [], bombs: [], flares: [], kegs: [], keys: [], finds: [], camps: [], proj: [], zones: [],
    shadeT: 0, uid: 1, boss: null, oilWarned: false,
    cage: { y: M.start.y + 11, vy: 0, state: 'down', t: 0 },
    exitCage: M.exit ? { y: M.exit.y, vy: 0, state: 'idle', t: 0, standT: 0 } : null,
  };
  // the player
  const P = makeBody(M.start.x, W.cage.y);
  Object.assign(P, {
    id: 1, hp: Math.min(maxHp, c.hp ?? maxHp), maxHp, inv: 0, up, oilMax: TOOLS.oilMax + 30 * (up.lamp || 0),
    dyn: c.dyn ?? START.dyn, dynMax: START.dynMax + 2 * (up.satchel || 0), flares: c.flares ?? START.flares, flareMax: START.flareMax + 2 * (up.pouch || 0),
    helmet: (up.helmet ? 1 : 0) + (ramp.helmet >= 0.5 ? 1 : 0), keys: [], pickT: 0, pickCD: 0, pickAim: 0, throwT: 0, darkT: 0,
    dead: false, deadT: 0, cause: '', input: { mx: 0, my: 0, jump: false, pick: false, dyn: false, flare: false }, prev: {}, inCage: true, lastHitT: -9,
    perks: (c.perks || []).slice(0, 2),
  });
  if (P.perks.includes('spareflare')) P.flares = Math.min(P.flareMax, P.flares + 1);
  P.oil = Math.min(P.oilMax, c.oil ?? P.oilMax);
  W.players = [P];
  // spawn the level's things
  const S = M.spawns;
  const id = () => W.uid++;
  for (const l of S.loot) {
    if (l.k === 'gemseam') continue;
    const o2 = { id: id(), k: l.k, x: l.x, y: l.y, got: false };
    if (l.k === 'gold') o2.v = Math.round(rr(W, LOOT.gold.v[0], LOOT.gold.v[1]) / 5) * 5;
    if (l.k === 'gem') { o2.gem = Math.floor(rnd(W) * GEMS.length); o2.v = GEMS[o2.gem].v; }
    if (l.k === 'chest') o2.v = Math.round(rr(W, LOOT.chest.v[0], LOOT.chest.v[1]) / 50) * 50;
    W.loot.push(o2);
  }
  for (const b of S.bats) W.bats.push({ id: id(), x: b.x, y: b.y, hx: b.x, hy: b.y, vx: 0, vy: 0, st: 'hang', t: 0, hp: 1, tx: 0, ty: 0, face: 1 });
  for (const c2 of S.crawlers) W.crawlers.push({ id: id(), x: c2.x, y: c2.y, vx: 0, dir: rnd(W) < 0.5 ? -1 : 1, hp: 2, st: 'walk', t: 0, hitT: 0 });
  for (const s of S.stalac) W.stalac.push({ id: id(), x: s.x, y: s.y, y0: s.y, vy: 0, st: 'idle', t: 0 });
  for (const g of S.geysers) W.geysers.push({ id: id(), x: g.x, y: g.y, st: 'idle', t: g.phase * ramp.geyPeriod });
  for (const e of S.eels) W.eels.push({ id: id(), x: e.x, y: e.y, hx: e.x, hy: e.y, vx: 0, vy: 0, st: 'lurk', t: rr(W, 0, 2), hp: 2, cd: 0 });
  for (const k of S.kegs) W.kegs.push({ id: id(), x: k.x, y: k.y, t: 0 });
  for (const k of S.keys) W.keys.push({ id: id(), door: k.id, x: k.x, y: k.y, got: false });
  for (const f of M.finds) W.finds.push({ id: id(), kind: f.kind, fid: f.id, x: f.x, y: f.y, got: false, room: f.room || null });
  for (const c2 of M.camps) W.camps.push({ id: id(), x: c2.x, y: c2.y, lit: false });
  // explored-map bookkeeping: cells that are open (could be seen)
  let open = 0;
  for (let i = 0; i < M.w * M.h; i++) if (!SOLID[M.tiles[i]] || M.tiles[i] !== T.ROCK) open++;
  W.openCells = open;
  if (isBoss) W.boss = makeBoss(W, BIOMES[depth].boss);
  return W;
}

// ------------------------------------------------------------------ helpers
const D2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
export function addScore(W, v, x, y) {
  const mul = (DIFFICULTY[W.diff] || DIFFICULTY.normal).score;
  const pts = Math.round(v * mul);
  W.score += pts; W.lifePts += pts;
  while (W.lifePts >= LIFE_EVERY) { W.lifePts -= LIFE_EVERY; W.lives++; ev(W, 'life', { x, y }); }
  return pts;
}
const setTile = (W, x, y, t) => { const M = W.M; if (x < 0 || y < 0 || x >= M.w || y >= M.h) return; M.tiles[y * M.w + x] = t; M.hp[y * M.w + x] = 0; W.tilesDirty = (W.tilesDirty || 0) + 1; };

export function hurt(W, P, n, cause, sx, sy) {
  if (P.dead || P.inv > 0 || P.inCage || W.clear) return false;
  if (P.helmet > 0 && n < 50) {
    P.helmet--; P.inv = PHYS.inv * 0.8;
    ev(W, 'helmet', { x: P.x, y: P.y + 1.6 });
    knock(P, sx, 0.6);
    return true;
  }
  if (n >= 50) { die(W, P, cause); return true; }
  P.hp -= n; P.inv = PHYS.inv; W.stats.hits++; P.lastHitT = W.t;
  ev(W, 'hurt', { x: P.x, y: P.y + 1, n, cause });
  if (P.hp <= 0) die(W, P, cause);
  else knock(P, sx, 1);
  return true;
}
function knock(P, sx, f) {
  if (sx === undefined || P.state === 'climb') return;
  const d = P.x >= sx ? 1 : -1;
  P.vx = d * PHYS.knock * f; P.vy = Math.max(P.vy, 5 * f); P.ground = false; P.peakY = P.y + 1.5;
}
function die(W, P, cause) {
  if (P.dead) return;
  P.dead = true; P.deadT = 0; P.hp = 0; P.cause = cause; W.stats.deaths++;
  P.state = 'walk'; P.vx *= 0.3;
  ev(W, 'death', { x: P.x, y: P.y, cause, n: W.n });
}
function respawn(W, P) {
  W.lives--;
  if (W.lives < 0) { W.lives = 0; W.over = true; ev(W, 'gameover', { n: W.n }); return; }
  Object.assign(P, makeBody(W.cp.x, W.cp.y + 0.05), { dead: false, deadT: 0, hp: P.maxHp, inv: 2.2, darkT: 0, pickT: 0, throwT: 0 });
  P.oil = Math.max(P.oil, P.oilMax * 0.6);
  P.dyn = Math.max(P.dyn, 1); P.flares = Math.max(P.flares, 1);
  // creatures near the checkpoint back off so the restart is fair
  for (const s of W.shades) s.dead = true;
  for (const b of W.bats) if (b.st !== 'dead' && D2(b.x, b.y, P.x, P.y) < 64) { b.st = 'return'; b.t = 0; }
  for (const z of W.zones) z.dead = true;
  for (const p of W.proj) p.dead = true;
  if (W.boss) W.boss.restT = 2.5;
  ev(W, 'respawn', { x: P.x, y: P.y });
}

// ------------------------------------------------------------------ step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  const M = W.M, R = W.ramp;
  const P = W.players[0];
  W.stats.time = W.t;
  const I = P.input, prev = P.prev;
  const edge = (k) => I[k] && !prev[k];

  // --- cages (the lift that brings you in, the one that takes you down)
  const plats = [];
  if (W.cage.state === 'down') {
    W.cage.y = Math.max(M.start.y, W.cage.y - 6.5 * dt);
    if (W.cage.y <= M.start.y + 1e-6) { W.cage.state = 'landed'; W.cage.t = 0; ev(W, 'cageland', { x: M.start.x, y: M.start.y }); P.inCage = false; P.y = M.start.y; P.ground = true; P.peakY = P.y; }
    else { P.x = M.start.x; P.y = W.cage.y; P.vx = 0; P.vy = 0; P.ground = true; P.peakY = P.y; }
  } else if (W.cage.state === 'landed') {
    W.cage.t += dt;
    if (W.cage.t > 1.5 && Math.abs(P.x - M.start.x) > 1.6) { W.cage.state = 'up'; ev(W, 'cageup', { x: M.start.x, y: M.start.y }); }
  } else if (W.cage.state === 'up') W.cage.y += 4 * dt;
  const X = W.exitCage;
  if (X) plats.push({ x0: M.exit.x - 1, x1: M.exit.x + 1, y: X.y, vy: X.vy });

  // --- the digger
  if (!P.inCage && !P.dead && !(X && X.state === 'down')) {
    const inp = { mx: I.mx, my: I.my, jump: I.jump };
    if (P.pickT > 0 && P.ground) inp.mx *= 0.25;   // planted while swinging
    const wasGround = P.ground;
    stepBody(M, P, inp, dt, plats, P.up.boots || 0);
    if (P.landed) {
      const h = fallHurt(P.landed, P.up.boots || 0, P.perks.includes('surefoot') ? 1 : 0);
      ev(W, 'land', { x: P.x, y: P.y, v: P.landed });
      if (h > 0) hurt(W, P, h >= 99 ? 99 : h, h >= 99 ? 'a long fall' : 'a hard landing');
    }
    if (P.splash > 4) ev(W, 'splash', { x: P.x, y: P.y + 0.6, v: P.splash });
    if (P.bonk) ev(W, 'bonk', { x: P.x, y: P.y + 1.6 });
    if (P.ground && !wasGround === false && Math.abs(P.vx) > 1) { P.stepT += dt * Math.abs(P.vx); if (P.stepT > 1.15) { P.stepT = 0; ev(W, 'step', { x: P.x, y: P.y }); } }
    if (P.state === 'climb' && Math.abs(P.vy) > 0.5) { P.stepT += dt * Math.abs(P.vy); if (P.stepT > 0.9) { P.stepT = 0; ev(W, 'climb', { x: P.x, y: P.y }); } }
    if (edge('jump') && (P.vy > 5 || P.inWater)) ev(W, 'jump', { x: P.x, y: P.y });
    // the pick
    P.pickCD = Math.max(0, P.pickCD - dt);
    if (edge('pick') && P.pickCD <= 0) {
      P.pickT = PHYS.pickT; P.pickCD = PHYS.pickT * 0.92; P.pickHit = false;
      P.pickAim = P.state === 'climb' ? 0 : I.my > 0.5 ? 1 : (I.my < -0.5 && P.ground ? -1 : 0);
      ev(W, 'swing', { x: P.x, y: P.y + 1, aim: P.pickAim });
    }
    if (P.pickT > 0) {
      P.pickT -= dt;
      if (!P.pickHit && P.pickT <= PHYS.pickT - PHYS.pickHitT) { P.pickHit = true; pickStrike(W, P); }
    }
    // back to the last camp (pause menu, or the autopilot when it is trapped): a recorded input, so replays agree
    if (edge('camp') && !W.boss) { Object.assign(P, makeBody(W.cp.x, W.cp.y + 0.05), { inv: 1.5, pickT: 0, throwT: 0 }); ev(W, 'tocamp', { x: P.x, y: P.y }); P.prev = { ...I }; return; }
    // dynamite and flares
    P.throwT = Math.max(0, P.throwT - dt);
    if (edge('dyn') && P.dyn > 0 && P.throwT <= 0) {
      P.dyn--; P.throwT = PHYS.throwT;
      const place = I.my < -0.5;
      W.bombs.push({ id: W.uid++, x: P.x + P.face * (place ? 0.35 : 0.3), y: P.y + (place ? 0.2 : 1.1), vx: place ? 0 : P.face * TOOLS.dynThrowVx + P.vx * 0.3, vy: place ? 0 : TOOLS.dynThrowVy * (I.my > 0.5 ? 1.35 : 1), fuse: TOOLS.dynFuse, rest: false, own: 1 });
      ev(W, place ? 'place' : 'throw', { x: P.x, y: P.y + 1, what: 'dyn' });
    }
    if (edge('flare') && P.flares > 0 && P.throwT <= 0) {
      P.flares--; P.throwT = PHYS.throwT;
      const place = I.my < -0.5;
      W.flares.push({ id: W.uid++, x: P.x + P.face * 0.3, y: P.y + (place ? 0.3 : 1.2), vx: place ? 0 : P.face * TOOLS.flareThrowVx + P.vx * 0.3, vy: place ? 0 : TOOLS.flareThrowVy * (I.my > 0.5 ? 1.4 : 1), life: TOOLS.flareLife, rest: false });
      ev(W, 'flare', { x: P.x, y: P.y + 1 });
    }
    // hazards in the tiles
    const hw = PHYS.w / 2;
    if (boxOverlapsTile(M, P.x - hw, P.y, P.x + hw, P.y + 1.2, T.LAVA)) { ev(W, 'burn', { x: P.x, y: P.y }); die(W, P, 'the lava'); }
    else if (boxOverlapsTile(M, P.x - hw + 0.08, P.y, P.x + hw - 0.08, P.y + 0.45, T.SPIKES) && P.vy <= 0.5) {
      if (hurt(W, P, 1, 'the spikes', P.x - P.face)) { P.state = 'walk'; P.vy = 11.5; P.ground = false; P.peakY = P.y + 2.5; }
    }
    // a locked gate opens for a key
    if (P.keys.length) for (const d of M.keyDoors) {
      if (d.open || !P.keys.includes(d.id)) continue;
      if (Math.abs(P.x - (d.x + 0.5)) < 1.25 && P.y >= d.y0 - 0.5 && P.y <= d.y1) {
        d.open = true;
        for (let y = d.y0; y <= d.y1; y++) setTile(W, d.x, y, T.AIR);
        ev(W, 'door', { x: d.x + 0.5, y: d.y0 + 1.5 });
      }
    }
    // crumbling ledges under the feet
    if (P.ground) {
      for (const x of [Math.floor(P.x - hw + 0.05), Math.floor(P.x + hw - 0.05)]) {
        const y = Math.round(P.y) - 1;
        if (tileAt(M, x, y) === T.CRUMBLE) {
          const i = y * M.w + x;
          if (!M.hp[i]) { M.hp[i] = 1; (W.crumbles ||= []).push({ x, y, t: R.crumbleT }); ev(W, 'creak', { x: x + 0.5, y: y + 1 }); }
        }
      }
    }
    // the exit cage
    if (X && X.state === 'idle' && P.ground && P.onLift === 0 && !P.dead) {
      X.standT += dt;
      if (X.standT > 0.55) { X.state = 'down'; X.t = 0; ev(W, 'cagego', { x: M.exit.x, y: M.exit.y }); }
    } else if (X && X.state === 'idle') X.standT = 0;
  }
  if (X && X.state === 'down') {
    X.t += dt; X.vy = -Math.min(3.2, X.t * 2.2); X.y += X.vy * dt;
    P.x += (M.exit.x - P.x) * Math.min(1, dt * 5); P.y = X.y; P.vx = 0; P.vy = 0; P.ground = true; P.inv = 1;
    if (X.t > 2.6 && !W.clear) levelClear(W);
  }
  P.prev = { ...I };
  P.inv = Math.max(0, P.inv - dt);

  // crumbles
  if (W.crumbles) for (const c of W.crumbles) {
    if (c.done) continue;
    c.t -= dt;
    if (c.t <= 0) { c.done = true; setTile(W, c.x, c.y, T.AIR); ev(W, 'crumble', { x: c.x + 0.5, y: c.y + 0.5 }); }
  }

  // --- lamp oil
  if (!P.dead && !P.inCage && !W.clear) {
    P.oil = Math.max(0, P.oil - R.oilDrain * dt * (W.isBoss ? 0.35 : 1) * (P.perks.includes('steadylamp') ? 0.85 : 1));
    if (P.oil <= 0) {
      P.darkT += dt;
      if (P.darkT >= TOOLS.oilDarkHurt) { P.darkT = 0; hurt(W, P, 1, 'the dark'); }
    } else P.darkT = 0;
    if (P.oil < P.oilMax * 0.2 && !W.oilWarned) { W.oilWarned = true; ev(W, 'lowoil', {}); }
    if (P.oil > P.oilMax * 0.4) W.oilWarned = false;
  }
  // the explored map: mark cells inside the lamp's reach four times a second
  if (W.n % 30 === 0 && !P.dead) {
    const rad = 5 + (P.up.lamp || 0) * 1.2, r2 = rad * rad;
    const cx = Math.floor(P.x), cy = Math.floor(P.y + 1);
    let add = 0;
    for (let y = Math.max(0, cy - Math.ceil(rad)); y <= Math.min(M.h - 1, cy + Math.ceil(rad)); y++) for (let x = Math.max(0, cx - Math.ceil(rad)); x <= Math.min(M.w - 1, cx + Math.ceil(rad)); x++) {
      const i = y * M.w + x;
      if (M.seen[i] || D2(x + 0.5, y + 0.5, P.x, P.y + 1) > r2) continue;
      M.seen[i] = 1; if (M.tiles[i] !== T.ROCK) add++;
    }
    W.stats.seen += add;
  }

  // --- death and respawn
  if (P.dead) {
    P.deadT += dt;
    if (P.deadT < 0.1) { P.vy = Math.max(P.vy, 0); }
    if (!P.inWater) { P.vy -= PHYS.grav * dt; const ny = P.y + P.vy * dt; if (!solidT(M, Math.floor(P.x), Math.floor(ny))) P.y = ny; else P.vy = 0; }
    if (P.deadT > 2.4) respawn(W, P);
  }

  // --- things
  updateBombs(W, dt);
  updateFlares(W, dt);
  updateBats(W, dt, P);
  updateCrawlers(W, dt, P);
  updateShades(W, dt, P);
  updateEels(W, dt, P);
  updateStalac(W, dt, P);
  updateGeysers(W, dt, P);
  updateProj(W, dt, P);
  updatePickups(W, dt, P);
  if (W.boss) updateBoss(W, dt, P, API);
  updateZones(W, dt, P);
  // creatures seen for the first time go in the journal
  if (W.n % 20 === 0 && !P.dead) {
    const see = (k, list) => { if (W.seenCreature[k]) return; for (const e of list) if (!e.dead && e.st !== 'dead' && D2(e.x, e.y, P.x, P.y + 1) < 49) { W.seenCreature[k] = 1; W.found.push({ kind: 'creature', id: k }); ev(W, 'find', { kind: 'creature', id: k, x: e.x, y: e.y, quiet: true }); return; } };
    see('bat', W.bats); see('crawler', W.crawlers); see('shade', W.shades.filter((s) => s.st === 'drift')); see('eel', W.eels.filter((e) => e.st !== 'lurk'));
    if (W.boss && !W.seenCreature[W.boss.kind] && W.boss.awake) { W.seenCreature[W.boss.kind] = 1; W.found.push({ kind: 'creature', id: W.boss.kind }); }
  }
  // tidy dead things now and then (keeps clones small)
  if (W.n % 240 === 0) {
    W.bombs = W.bombs.filter((b) => !b.dead); W.flares = W.flares.filter((f) => !f.dead); W.shades = W.shades.filter((s) => !s.dead);
    W.proj = W.proj.filter((p) => !p.dead); W.zones = W.zones.filter((z) => !z.dead); if (W.crumbles) W.crumbles = W.crumbles.filter((c) => !c.done);
  }
  if (W.clear) W.clearT += dt;
}

function levelClear(W) {
  if (W.clear) return;
  W.clear = true; W.clearT = 0;
  const P = W.players[0];
  const pct = W.openCells ? Math.min(1, W.stats.seen / W.openCells) : 0;
  W.stats.seenPct = pct;
  const bonus = { clear: addScore(W, LOOT.levelClear), explore: addScore(W, Math.round(LOOT.explore * pct / 10) * 10) };
  W.bonus = bonus;
  ev(W, 'clear', { x: P.x, y: P.y });
}
export function bossCleared(W) { levelClear(W); }

// ------------------------------------------------------------------ the pick
function pickStrike(W, P) {
  const M = W.M, lvl = P.up.pick || 0;
  const aim = P.pickAim;
  // the swing point
  const sx = aim === 0 ? P.x + P.face * 0.85 : P.x, sy = aim === 1 ? P.y + 2.0 : aim === -1 ? P.y - 0.4 : P.y + 0.85;
  let hit = false;
  // creatures first
  const reach = PHYS.pickReach;
  const near = (e, r = reach) => D2(e.x, e.y, sx, sy) < r * r;
  for (const b of W.bats) if (b.st !== 'dead' && b.st !== 'hang' && near(b, reach + 0.25)) { killBat(W, b, P); hit = true; }
  for (const b of W.bats) if (b.st === 'hang' && near(b, reach)) { killBat(W, b, P); hit = true; }
  for (const c of W.crawlers) if (!c.dead && D2(c.x, c.y + 0.35, sx, sy) < (reach + 0.2) ** 2) {
    c.hp -= 1 + (lvl >= 1 ? 1 : 0); c.hitT = 0.25; c.vx = P.face * 3; hit = true;
    ev(W, 'hitflesh', { x: c.x, y: c.y + 0.4 });
    if (c.hp <= 0) { c.dead = true; W.stats.kills++; addScore(W, LOOT.kill.crawler, c.x, c.y); ev(W, 'kill', { what: 'crawler', x: c.x, y: c.y + 0.3 }); }
  }
  for (const e of W.eels) if (e.st === 'lunge' && near(e, reach + 0.3)) {
    e.hp--; hit = true; ev(W, 'hitflesh', { x: e.x, y: e.y });
    if (e.hp <= 0) { e.st = 'dead'; W.stats.kills++; addScore(W, LOOT.kill.eel, e.x, e.y); ev(W, 'kill', { what: 'eel', x: e.x, y: e.y }); }
    else { e.st = 'back'; e.t = 0; }
  }
  if (W.boss && bossHit(W, W.boss, sx, sy, 'pick', 1 + 0.5 * lvl, API)) hit = true;
  if (hit) return;
  // then the rock: the cell at the swing point (forward: body middle, then feet height)
  const cells = aim === 0 ? [[Math.floor(sx), Math.floor(P.y + 0.85)], [Math.floor(sx), Math.floor(P.y + 0.2)], [Math.floor(sx), Math.floor(P.y + 1.5)]]
    : aim === 1 ? [[Math.floor(P.x), Math.floor(P.y + 1.9)]] : [[Math.floor(P.x), Math.floor(P.y - 0.5)]];
  for (const [cx, cy] of cells) {
    const t = tileAt(M, cx, cy);
    if (!SOLID[t] || cy < 1 || cx < 1 || cx >= M.w - 1) continue;
    const need = PICK_HP[t];
    if (!need) { ev(W, 'clink', { x: cx + 0.5, y: cy + 0.5, hard: t === T.HARD || t === T.DOOR }); return; }
    const i = cy * M.w + cx;
    M.hp[i] += 1 + (lvl >= 2 ? 1 : 0) + (lvl >= 1 && W.n % 2 === 0 ? 1 : 0);
    ev(W, t === T.VEIN || t === T.GEMV ? 'ore' : 'pick', { x: cx + 0.5, y: cy + 0.5, t, f: Math.min(1, M.hp[i] / need) });
    if (M.hp[i] >= need) breakTile(W, cx, cy, 'pick');
    return;
  }
  ev(W, 'miss', { x: sx, y: sy });
}

function breakTile(W, x, y, how) {
  const M = W.M, t = tileAt(M, x, y);
  if (!BLASTABLE[t] && t !== T.DOOR) return;
  setTile(W, x, y, T.AIR);
  ev(W, 'break', { x: x + 0.5, y: y + 0.5, t, how });
  if (t === T.VEIN) {
    const n = 2 + Math.floor(rnd(W) * 3) + (W.players[0].perks.includes('luckypick') ? 1 : 0);
    for (let k = 0; k < n; k++) W.loot.push({ id: W.uid++, k: 'gold', x: x + 0.5, y: y + 0.3, vx: rr(W, -2.5, 2.5), vy: rr(W, 2, 5), v: Math.round(rr(W, 40, 90) / 5) * 5, fly: true, got: false, t: 0 });
  }
  if (t === T.GEMV) {
    const g = Math.floor(rnd(W) * GEMS.length);
    W.loot.push({ id: W.uid++, k: 'gem', gem: g, x: x + 0.5, y: y + 0.3, vx: rr(W, -1.5, 1.5), vy: 4, v: GEMS[g].v, fly: true, got: false, t: 0 });
  }
  if (t === T.FOSSIL) {
    for (const f of W.finds) if (f.kind === 'fossil' && !f.got && Math.floor(f.x) === x && Math.floor(f.y) === y) gotFind(W, f, W.players[0]);
  }
  if (t === T.SOFT) for (const f of W.finds) if (f.kind === 'cache' && !f.got && Math.floor(f.x) === x && Math.floor(f.y) === y) gotFind(W, f, W.players[0]);
  // a broken seal on a vault: the room behind is a secret
  if ((t === T.SOFT || t === T.HARD) && !W.secretAt) W.secretAt = {};
  if (t === T.SOFT || t === T.HARD || t === T.DOOR) {
    for (const c of M.rooms) {
      if (c.kind !== 'vault' || c.foundSecret) continue;
      if (x >= c.x0 - 1 && x <= c.x0 + 16 && y >= c.y0 && y < c.y0 + 12) { c.foundSecret = true; W.stats.secrets++; addScore(W, LOOT.secret, x, y); W.found.push({ kind: 'secret', id: c.rx + c.ry * 16 }); ev(W, 'secret', { x: x + 0.5, y: y + 0.5 }); }
    }
  }
  // what stood on it may fall (stalactites hang from it, loot lies on it)
  for (const s of W.stalac) if (s.st === 'idle' && Math.floor(s.x) === x && Math.floor(s.y0) === y) { s.st = 'fall'; s.vy = 0; }
}

// ------------------------------------------------------------------ dynamite and flares
function ballistic(W, o, dt, bounce = 0.35) {
  const M = W.M;
  o.vy -= PHYS.grav * dt;
  let nx = o.x + o.vx * dt;
  if (solidT(M, Math.floor(nx), Math.floor(o.y))) { o.vx = -o.vx * bounce * 0.45; nx = o.x; }
  o.x = nx;
  let ny = o.y + o.vy * dt;
  if (solidT(M, Math.floor(o.x), Math.floor(ny)) || (o.vy < 0 && (tileAt(M, Math.floor(o.x), Math.floor(ny)) === T.PLANK || tileAt(M, Math.floor(o.x), Math.floor(ny)) === T.LADDER) && Math.floor(ny) < Math.floor(o.y))) {
    if (o.vy < 0) { ny = Math.floor(o.y) + 0.001; if (Math.abs(o.vy) < 2.2) { o.vy = 0; o.vx *= 0.5; o.rest = true; } else { o.vy = -o.vy * bounce; o.vx *= 0.7; } }
    else { ny = o.y; o.vy = 0; }
  } else o.rest = false;
  if (tileAt(M, Math.floor(o.x), Math.floor(ny)) === T.WATER) { o.vx *= 0.9; o.vy = Math.max(o.vy, -1.5); o.wet = true; }
  o.y = ny;
  if (o.rest) o.vx *= Math.max(0, 1 - dt * 8);
}
function updateBombs(W, dt) {
  for (const b of W.bombs) {
    if (b.dead) continue;
    ballistic(W, b, dt);
    b.fuse -= dt;
    if (b.fuse <= 0) explode(W, b);
  }
}
export function explode(W, b, radius = TOOLS.dynRadius, own = true) {
  b.dead = true;
  const M = W.M, P = W.players[0];
  ev(W, 'blast', { x: b.x, y: b.y + 0.2, r: radius, wet: !!b.wet });
  const r2 = radius * radius;
  for (let y = Math.floor(b.y - radius); y <= Math.ceil(b.y + radius); y++) for (let x = Math.floor(b.x - radius); x <= Math.ceil(b.x + radius); x++) {
    if (D2(x + 0.5, y + 0.5, b.x, b.y) > r2) continue;
    if (x < 1 || y < 1 || x >= M.w - 1 || y >= M.h - 1) continue;
    const t = tileAt(M, x, y);
    if (BLASTABLE[t]) breakTile(W, x, y, 'blast');
  }
  for (const e of W.bats) if (e.st !== 'dead' && D2(e.x, e.y, b.x, b.y) < r2 * 1.3) killBat(W, e, P);
  for (const c of W.crawlers) if (!c.dead && D2(c.x, c.y, b.x, b.y) < r2 * 1.2) { c.dead = true; W.stats.kills++; addScore(W, LOOT.kill.crawler, c.x, c.y); ev(W, 'kill', { what: 'crawler', x: c.x, y: c.y }); }
  for (const s of W.shades) if (!s.dead && D2(s.x, s.y, b.x, b.y) < r2 * 1.5) dispel(W, s);
  for (const e of W.eels) if (e.st !== 'dead' && D2(e.x, e.y, b.x, b.y) < r2 * 1.3) { e.st = 'dead'; W.stats.kills++; addScore(W, LOOT.kill.eel, e.x, e.y); ev(W, 'kill', { what: 'eel', x: e.x, y: e.y }); }
  for (const s of W.stalac) if (s.st === 'idle' && D2(s.x, s.y, b.x, b.y) < r2 * 2) { s.st = 'fall'; s.vy = 0; }
  for (const o of W.bombs) if (!o.dead && o !== b && D2(o.x, o.y, b.x, b.y) < r2) o.fuse = Math.min(o.fuse, 0.12);
  if (W.boss) bossHit(W, W.boss, b.x, b.y, 'blast', 3, API, radius);
  // the digger
  if (!P.dead) {
    const d = Math.sqrt(D2(P.x, P.y + 0.8, b.x, b.y));
    if (d < TOOLS.dynHurt) hurt(W, P, d < 1.0 ? 2 : 1, 'your own dynamite', b.x);
    else if (d < radius + 1.5) { P.vx += (P.x > b.x ? 1 : -1) * 3; }
  }
}
function updateFlares(W, dt) {
  for (const f of W.flares) {
    if (f.dead) continue;
    ballistic(W, f, dt, 0.25);
    f.life -= dt;
    if (f.wet) f.life -= dt * 3;
    if (f.life <= 0) { f.dead = true; ev(W, 'flareout', { x: f.x, y: f.y }); }
  }
}
const litBy = (W, x, y, rad = TOOLS.flareRadius) => { for (const f of W.flares) if (!f.dead && f.life > 0.5 && D2(f.x, f.y, x, y) < rad * rad) return f; return null; };
export { litBy };

// ------------------------------------------------------------------ creatures
function killBat(W, b, P) {
  if (b.st === 'dead') return;
  b.st = 'dead'; b.vy = 0; W.stats.kills++;
  addScore(W, LOOT.kill.bat, b.x, b.y);
  ev(W, 'kill', { what: 'bat', x: b.x, y: b.y });
}
function updateBats(W, dt, P) {
  const R = W.ramp, M = W.M;
  for (const b of W.bats) {
    if (b.st === 'dead') { if (!b.gone) { b.vy -= 20 * dt; b.y += b.vy * dt; if (solidT(M, Math.floor(b.x), Math.floor(b.y)) || b.y < 0) b.gone = true; } continue; }
    b.t += dt;
    const dx = P.x - b.x, dy = P.y + 1 - b.y, d2 = dx * dx + dy * dy;
    const flare = litBy(W, b.x, b.y);
    if (flare && b.st !== 'hang') { b.st = 'flee'; b.t = 0; b.fx = flare.x; b.fy = flare.y; }
    if (b.st === 'hang') {
      if (d2 < 30 && !P.dead && !flare && !P.inCage) { b.st = 'wake'; b.t = 0; ev(W, 'batwake', { x: b.x, y: b.y }); }
    } else if (b.st === 'wake') {
      if (b.t >= R.batWarn) { b.st = 'swoop'; b.t = 0; b.tx = P.x; b.ty = P.y + 0.9; const l = Math.hypot(b.tx - b.x, b.ty - b.y) || 1; b.vx = (b.tx - b.x) / l * R.batSpeed; b.vy = (b.ty - b.y) / l * R.batSpeed; b.face = Math.sign(b.vx) || 1; ev(W, 'bat', { x: b.x, y: b.y }); }
    } else if (b.st === 'swoop') {
      // fly straight through the marked point, curving up after it
      b.x += b.vx * dt; b.y += b.vy * dt;
      const past = (b.tx - b.x) * b.vx + (b.ty - b.y) * b.vy < 0;
      if (past) b.vy += 9 * dt;
      if (b.t > 2.2 || (past && b.t > 0.6 && Math.abs(b.vy) < 0.5)) { b.st = 'circle'; b.t = 0; b.cx = b.x; b.cy = b.y + 1.2; }
    } else if (b.st === 'circle') {
      b.x = b.cx + Math.sin(b.t * 2.3) * 1.6; b.y = b.cy + Math.sin(b.t * 4.6) * 0.5;
      b.vx = Math.cos(b.t * 2.3) * 3.6; b.face = Math.sign(b.vx) || 1;
      if (b.t > Math.max(1.8, 0.9 + R.batWarn * 0.75)) { if (d2 < 64 && !P.dead) { b.st = 'wake'; b.t = R.batWarn * 0.45; } else { b.st = 'return'; b.t = 0; } }
    } else if (b.st === 'flee') {
      const ax = b.x - b.fx, ay = b.y - b.fy, l = Math.hypot(ax, ay) || 1;
      b.vx = ax / l * 4.5; b.vy = ay / l * 2 + 1; b.x += b.vx * dt; b.y += b.vy * dt; b.face = Math.sign(b.vx) || 1;
      if (b.t > 2.5 && !litBy(W, b.x, b.y)) { b.st = 'return'; b.t = 0; }
    } else if (b.st === 'return') {
      const ax = b.hx - b.x, ay = b.hy - b.y, l = Math.hypot(ax, ay);
      if (l < 0.2) { b.st = 'hang'; b.x = b.hx; b.y = b.hy; b.t = 0; b.vx = 0; b.vy = 0; continue; }
      b.vx = ax / l * 3; b.vy = ay / l * 3; b.x += b.vx * dt; b.y += b.vy * dt; b.face = Math.sign(b.vx) || 1;
    }
    // keep out of the rock
    if (solidT(M, Math.floor(b.x), Math.floor(b.y)) && b.st !== 'return') { b.x -= b.vx * dt * 2; b.y -= b.vy * dt * 2; if (b.st === 'swoop') { b.st = 'circle'; b.t = 0; b.cx = b.x; b.cy = b.y; } }
    if ((b.st === 'swoop' || b.st === 'circle') && !P.dead && Math.abs(b.x - P.x) < 0.62 && b.y > P.y + 0.1 && b.y < P.y + 1.75) {
      if (hurt(W, P, 1, 'a cave bat', b.x)) { b.st = 'circle'; b.t = 0; b.cx = b.x; b.cy = b.y + 1.5; }
    }
  }
}
function updateCrawlers(W, dt, P) {
  const R = W.ramp, M = W.M;
  for (const c of W.crawlers) {
    if (c.dead) continue;
    c.t += dt; c.hitT = Math.max(0, c.hitT - dt);
    const flare = litBy(W, c.x, c.y, 3.5);
    let sp = R.crawlSpeed * (flare ? 0.4 : 1);
    if (c.hitT > 0) { c.x += c.vx * dt; c.vx *= 0.9; }
    else {
      const nx = c.x + c.dir * sp * dt;
      const ahead = Math.floor(nx + c.dir * 0.4), fy = Math.floor(c.y + 0.01);
      const wall = solidT(M, ahead, fy) || tileAt(M, ahead, fy) === T.SPIKES || tileAt(M, ahead, fy) === T.WATER;
      const gap = !solidT(M, ahead, fy - 1) && tileAt(M, ahead, fy - 1) !== T.PLANK && tileAt(M, ahead, fy - 1) !== T.LADDER;
      if (wall || gap) c.dir = -c.dir; else c.x = nx;
    }
    if (!P.dead && Math.abs(c.x - P.x) < 0.75 && P.y < c.y + 0.6 && P.y + PHYS.h > c.y) {
      // landing on its back bounces you up (and stuns it)
      if (P.vy < -2 && P.y > c.y + 0.25) { P.vy = 8; c.hitT = 0.6; c.vx = 0; c.hp--; ev(W, 'stomp', { x: c.x, y: c.y + 0.5 }); if (c.hp <= 0) { c.dead = true; W.stats.kills++; addScore(W, LOOT.kill.crawler, c.x, c.y); ev(W, 'kill', { what: 'crawler', x: c.x, y: c.y }); } }
      else hurt(W, P, 1, 'a tunnel beetle', c.x);
    }
  }
}
function dispel(W, s) {
  if (s.dead || s.st === 'fade') return;
  s.st = 'fade'; s.t = 0; W.stats.kills++;
  addScore(W, LOOT.kill.shade, s.x, s.y);
  ev(W, 'dispel', { x: s.x, y: s.y });
}
function updateShades(W, dt, P) {
  const R = W.ramp;
  if (!P.dead && !P.inCage && !W.clear && !W.isBoss) {
    const dark = P.oil <= 0;
    if (R.shadeEvery > 0 || dark) {
      W.shadeT += dt * (dark ? 3 : 1);
      const every = R.shadeEvery > 0 ? R.shadeEvery : 40;
      if (W.shadeT >= every && W.shades.filter((s) => !s.dead).length < 2) {
        W.shadeT = 0;
        const side = rnd(W) < 0.5 ? -1 : 1;
        W.shades.push({ id: W.uid++, x: P.x + side * rr(W, 9, 12), y: P.y + rr(W, 0, 3), st: 'form', t: 0, dead: false, life: 0 });
        ev(W, 'shadeform', { x: P.x + side * 10, y: P.y + 1 });
      }
    }
  }
  for (const s of W.shades) {
    if (s.dead) continue;
    s.t += dt; s.life += dt;
    if (s.st === 'form') { if (s.t >= R.shadeWarn) { s.st = 'drift'; s.t = 0; ev(W, 'shade', { x: s.x, y: s.y }); } }
    else if (s.st === 'drift') {
      const dx = P.x - s.x, dy = P.y + 1 - s.y, l = Math.hypot(dx, dy) || 1;
      const sp = (R.shadeSpeed || 1) * (P.dead ? -0.5 : 1);
      s.x += dx / l * sp * dt + Math.sin(s.life * 1.3) * 0.3 * dt; s.y += dy / l * sp * dt + Math.cos(s.life * 1.7) * 0.25 * dt;
      if (litBy(W, s.x, s.y)) dispel(W, s);
      else if (!P.dead && l < 0.75) { if (hurt(W, P, 1, 'a pale shade', s.x)) { P.oil = Math.max(0, P.oil - 15); s.st = 'fade'; s.t = 0; } }
      if (s.life > 45) { s.st = 'fade'; s.t = 0; }
    } else if (s.st === 'fade') { if (s.t > 1) s.dead = true; }
  }
}
function updateEels(W, dt, P) {
  const R = W.ramp, M = W.M;
  for (const e of W.eels) {
    if (e.st === 'dead') continue;
    e.t += dt; e.cd = Math.max(0, e.cd - dt);
    const near = Math.abs(P.x - e.hx) < 3.0 && P.y > e.hy - 0.5 && P.y < e.hy + 4 && !P.dead && !P.inWater;   // it strikes at the shore, not at swimmers
    if (e.st === 'lurk') { if (near && e.cd <= 0) { e.st = 'warn'; e.t = 0; ev(W, 'ripple', { x: e.hx, y: e.hy + 0.5 }); } }
    else if (e.st === 'warn') { if (e.t >= R.eelWarn) { e.st = 'lunge'; e.t = 0; e.tx = P.x; e.ty = P.y + 0.8; ev(W, 'eel', { x: e.hx, y: e.hy + 0.5 }); } }
    else if (e.st === 'lunge') {
      const f = Math.min(1, e.t / 0.55);
      e.x = e.hx + (e.tx - e.hx) * f; e.y = e.hy + (e.ty - e.hy) * f + Math.sin(f * Math.PI) * 1.2;
      if (!P.dead && Math.abs(e.x - P.x) < 0.7 && e.y > P.y && e.y < P.y + 1.7) hurt(W, P, 1, 'a blind eel', e.x);
      if (e.t > 0.85) { e.st = 'back'; e.t = 0; }
    } else if (e.st === 'back') {
      e.x += (e.hx - e.x) * Math.min(1, dt * 5); e.y += (e.hy - e.y) * Math.min(1, dt * 5);
      if (e.t > 0.7) { e.st = 'lurk'; e.t = 0; e.cd = 2.5; e.x = e.hx; e.y = e.hy; }
    }
  }
}
function updateStalac(W, dt, P) {
  const R = W.ramp, M = W.M;
  for (const s of W.stalac) {
    if (s.st === 'gone') continue;
    s.t += dt;
    if (s.st === 'idle') {
      if (!P.dead && Math.abs(P.x - s.x) < 1.5 && P.y < s.y && P.y > s.y - 11) { s.st = 'shake'; s.t = 0; ev(W, 'crack', { x: s.x, y: s.y - 0.5 }); }
    } else if (s.st === 'shake') { if (s.t >= R.stalWarn) { s.st = 'fall'; s.vy = 0; s.t = 0; } }
    else if (s.st === 'fall') {
      s.vy -= 30 * dt; s.y += s.vy * dt;
      if (!P.dead && Math.abs(P.x - s.x) < 0.55 && s.y - 1.2 < P.y + PHYS.h && s.y > P.y) {
        hurt(W, P, Math.min(3, Math.max(1, Math.round(2 * R.hurtMul))), 'a falling stalactite', s.x);
        s.st = 'gone'; ev(W, 'stalhit', { x: s.x, y: s.y - 0.6 });
      } else if (solidT(M, Math.floor(s.x), Math.floor(s.y - 1.1)) || s.y < 1 || tileAt(M, Math.floor(s.x), Math.floor(s.y - 1.1)) === T.PLANK) {
        s.st = 'gone'; ev(W, 'stalhit', { x: s.x, y: Math.floor(s.y - 1.1) + 1 });
        for (const c of W.crawlers) if (!c.dead && Math.abs(c.x - s.x) < 0.9 && Math.abs(c.y - s.y) < 2) { c.dead = true; ev(W, 'kill', { what: 'crawler', x: c.x, y: c.y }); }
      }
    }
  }
}
function updateGeysers(W, dt, P) {
  const R = W.ramp;
  for (const g of W.geysers) {
    g.t += dt;
    const per = R.geyPeriod, warn = R.geyWarn, act = 1.5;
    if (g.st === 'idle' && g.t >= per - warn - act) { g.st = 'warn'; g.t = 0; ev(W, 'geywarn', { x: g.x, y: g.y }); }
    else if (g.st === 'warn' && g.t >= warn) { g.st = 'erupt'; g.t = 0; ev(W, 'geyser', { x: g.x, y: g.y }); }
    else if (g.st === 'erupt') {
      if (!P.dead && Math.abs(P.x - g.x) < 0.75 && P.y >= g.y - 0.3 && P.y < g.y + 4.5) {
        if (hurt(W, P, Math.max(1, Math.round(R.hurtMul)), 'a steam geyser', g.x)) { P.vy = 12; P.ground = false; P.peakY = P.y + 3; }
      }
      if (g.t >= act) { g.st = 'idle'; g.t = 0; }
    }
  }
}
function updateProj(W, dt, P) {
  const M = W.M;
  for (const p of W.proj) {
    if (p.dead) continue;
    p.t = (p.t || 0) + dt;
    p.vy -= (p.grav ?? 20) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (!P.dead && D2(p.x, p.y, P.x, P.y + 0.8) < (p.r + 0.4) ** 2) { hurt(W, P, p.dmg || 1, p.cause || 'a falling rock', p.x); p.dead = true; ev(W, 'projhit', { x: p.x, y: p.y, kind: p.kind }); continue; }
    if (p.t > 0.1 && (solidT(M, Math.floor(p.x), Math.floor(p.y)) || p.y < 0)) { p.dead = true; ev(W, 'projhit', { x: p.x, y: p.y, kind: p.kind }); }
    if (p.t > 8) p.dead = true;
  }
}
// boss danger zones: shown for `warn` seconds, then hurt for `dur` seconds
function updateZones(W, dt, P) {
  for (const z of W.zones) {
    if (z.dead) continue;
    z.t += dt;
    if (z.vx && (!z.pre || z.t >= z.warn)) { z.x0 += z.vx * dt; z.x1 += z.vx * dt; }
    if (z.t >= z.warn + z.dur) { z.dead = true; continue; }
    if (z.t < z.warn || P.dead) continue;
    const hw = PHYS.w / 2;
    let hit = false;
    if (z.shape === 'rect') hit = P.x + hw > z.x0 && P.x - hw < z.x1 && P.y + PHYS.h > z.y0 && P.y < z.y1;
    else if (z.shape === 'circle') hit = D2(P.x, P.y + 0.8, z.x, z.y) < (z.r + 0.4) ** 2;
    if (hit) hurt(W, P, z.dmg || 1, z.cause || 'the beast', z.x ?? (z.x0 + z.x1) / 2);
  }
}

// ------------------------------------------------------------------ pickups and finds
function gotFind(W, f, P) {
  if (f.got) return;
  f.got = true;
  const pts = f.kind === 'relic' ? LOOT.relic : f.kind === 'fossil' ? LOOT.fossil : f.kind === 'wonder' ? LOOT.wonder : f.kind === 'map' ? LOOT.map : f.kind === 'cache' ? LOOT.cache : LOOT.note;
  if (f.kind === 'map') W.mapFound = true;
  if (f.kind === 'cache') {
    // the chest bursts open where the X was
    for (let k = 0; k < 7; k++) W.loot.push({ id: W.uid++, k: 'gold', x: f.x, y: f.y + 1, vx: rr(W, -2.8, 2.8), vy: rr(W, 4, 7.5), v: 150, fly: true, got: false, t: 0 });
    const g = Math.floor(rnd(W) * GEMS.length);
    W.loot.push({ id: W.uid++, k: 'gem', gem: g, x: f.x, y: f.y + 1, vx: rr(W, -1, 1), vy: 6.5, v: GEMS[g].v, fly: true, got: false, t: 0 });
  }
  addScore(W, pts, f.x, f.y);
  W.stats.finds++;
  W.found.push({ kind: f.kind, id: f.fid });
  const [name, text] = findName(f.kind, f.fid);
  ev(W, 'find', { kind: f.kind, id: f.fid, x: f.x, y: f.y, name, text, pts });
}
function updatePickups(W, dt, P) {
  const M = W.M;
  const px = P.x, py = P.y + 0.7;
  const alive = !P.dead && !P.inCage;
  for (const l of W.loot) {
    if (l.got) continue;
    if (l.fly) {
      l.t += dt;
      ballistic(W, l, dt, 0.3);
      if (l.rest || l.t > 3) l.fly = false;
      if (l.t < 0.35) continue;
    }
    if (!alive) continue;
    const r = l.k === 'chest' ? 1.0 : 0.7;
    if (D2(l.x, l.y + 0.3, px, py) > r * r + 0.3) continue;
    if (l.k === 'chest') {
      l.got = true; W.stats.chests++;
      addScore(W, l.v, l.x, l.y);
      ev(W, 'chest', { x: l.x, y: l.y, v: l.v });
      for (let k = 0; k < 5; k++) W.loot.push({ id: W.uid++, k: 'gold', x: l.x, y: l.y + 0.6, vx: rr(W, -2.5, 2.5), vy: rr(W, 3, 6), v: 100, fly: true, got: false, t: 0 });
      if (rnd(W) < 0.5) W.loot.push({ id: W.uid++, k: 'gem', gem: Math.floor(rnd(W) * GEMS.length), x: l.x, y: l.y + 0.6, vx: rr(W, -1, 1), vy: 5, v: 600, fly: true, got: false, t: 0 });
      continue;
    }
    if (l.k === 'oil' && P.oil >= P.oilMax - 1) continue;
    if (l.k === 'dyn' && P.dyn >= P.dynMax) continue;
    if (l.k === 'flare' && P.flares >= P.flareMax) continue;
    if (l.k === 'heart' && P.hp >= P.maxHp) continue;
    l.got = true;
    if (l.k === 'gold') { const pts = addScore(W, l.v, l.x, l.y); W.stats.gold += pts; W.stats.goldGot++; ev(W, 'gold', { x: l.x, y: l.y, v: pts }); }
    else if (l.k === 'gem') { const pts = addScore(W, l.v, l.x, l.y); W.stats.gems++; W.stats.gold += pts; ev(W, 'gem', { x: l.x, y: l.y, v: pts, gem: l.gem }); }
    else if (l.k === 'oil') { P.oil = Math.min(P.oilMax, P.oil + TOOLS.oilCan); ev(W, 'oil', { x: l.x, y: l.y }); }
    else if (l.k === 'dyn') { P.dyn = Math.min(P.dynMax, P.dyn + 2); ev(W, 'tool', { x: l.x, y: l.y, what: 'dyn' }); }
    else if (l.k === 'flare') { P.flares = Math.min(P.flareMax, P.flares + 2); ev(W, 'tool', { x: l.x, y: l.y, what: 'flare' }); }
    else if (l.k === 'heart') { P.hp = Math.min(P.maxHp, P.hp + 1); ev(W, 'heart', { x: l.x, y: l.y }); }
  }
  if (!alive) return;
  for (const k of W.kegs) {
    k.t = Math.max(0, k.t - dt);
    if (k.t > 0 || D2(k.x, k.y + 0.4, px, py) > 1.2) continue;
    if (k.what === 'flare') { if (P.flares < 2) { P.flares = 2; k.t = 4; ev(W, 'tool', { x: k.x, y: k.y, what: 'flare', keg: true }); } }
    else if (P.dyn < 2) { P.dyn = 2; k.t = 4; ev(W, 'tool', { x: k.x, y: k.y, what: 'dyn', keg: true }); }
  }
  for (const k of W.keys) if (!k.got && D2(k.x, k.y + 0.3, px, py) < 0.8) { k.got = true; P.keys.push(k.door); ev(W, 'key', { x: k.x, y: k.y }); }
  for (const f of W.finds) {
    if (f.got || f.kind === 'fossil' || f.kind === 'cache') continue;
    const r = f.kind === 'wonder' ? 4.5 : 0.85;
    if (D2(f.x, f.y + 0.4, px, py) < r * r) gotFind(W, f, P);
  }
  for (const c of W.camps) {
    if (D2(c.x, c.y + 0.4, px, py) < 1.6) {
      // lighting a camp rests you once (full hearts and lamp); after that it is a save point
      if (!c.lit) { c.lit = true; ev(W, 'camp', { x: c.x, y: c.y }); if (P.hp < P.maxHp || P.oil < P.oilMax) { P.hp = P.maxHp; P.oil = P.oilMax; ev(W, 'rest', { x: c.x, y: c.y }); } }
      if (W.cp.x !== c.x || W.cp.y !== c.y) { W.cp = { x: c.x, y: c.y }; }
    }
  }
}

// what the boss module needs from here
const API = { hurt, ev, rnd, rr, addScore, explode, litBy, killBat, bossCleared, D2, spawnBat: (W, x, y) => W.bats.push({ id: W.uid++, x, y, hx: x, hy: y + 3, vx: 0, vy: 0, st: 'wake', t: 0, hp: 1, tx: 0, ty: 0, face: 1 }) };

// a run's carry-over into the next level
export function carryOut(W) {
  const P = W.players[0];
  return { score: W.score, lifePts: W.lifePts, lives: W.lives, hp: P.hp, dyn: P.dyn, flares: P.flares, oil: P.oil, up: P.up, perks: P.perks };
}
