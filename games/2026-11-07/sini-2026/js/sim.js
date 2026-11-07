// Sini 2026 simulation: fixed 120 Hz steps, all randomness from the world's own seeded generator (W.rs),
// plain data only, so a world can be cloned and re-run bit for bit (replays, online, tests).
// Nothing in here touches the DOM, WebGL or audio; it only pushes events into W.ev.
import { F, STEP, WS, H, ROCK, ENEMY, CONSTRUCTS, C_KEYS, SECTORS, rampAt, rampLevel, deepLevel, TUTOR, SCORE, START_LIVES, DIFFICULTY, applyDiff, POWERUPS, PW_KEYS, DROP } from './config.js?v=2';
export { STEP };

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hyp = Math.hypot;
// the field wraps round: positions live in [-H, H), and the shortest way between two points may cross an edge
export const wp = (v) => v - WS * Math.round(v / WS);
export const wd = (d) => d - WS * Math.round(d / WS);
export const dist = (a, b) => hyp(wd(b.x - a.x), wd(b.z - a.z));

// ------------------------------------------------------------------ seeded randomness (state lives in W.rs)
export function rand(W) {
  const s = (W.rs = (W.rs + 0x6D2B79F5) | 0);
  let t = Math.imul(s ^ (s >>> 15), s | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rr = (W, a, b) => a + (b - a) * rand(W);
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
const D_OF = (W) => DIFFICULTY[W.diff] || DIFFICULTY.normal;

// ------------------------------------------------------------------ world
// o: { seed, mode 'campaign'|'deep', sector, cp (checkpoint to start from), bombs, up, lives, score, diff, demo, coop, noTut, assist }
export function makeWorld(o = {}) {
  const seed = (o.seed ?? 1) | 0, mode = o.mode || 'campaign', sector = o.sector || 0;
  const W = {
    n: 0, t: 0, seed, rs: (seed ^ 0x2545F491) | 0, mode, sector, k: mode === 'deep' ? 0 : sector, up: { ...(o.up || {}) }, demo: !!o.demo, coop: !!o.coop,
    diff: DIFFICULTY[o.diff] ? o.diff : 'normal', lives: o.lives ?? START_LIVES + D_OF({ diff: o.diff }).lives, score: o.score || 0, lifePts: 0, nextLife: 0,
    phase: 'intro', phaseT: 2.6, secT: 0, fightT: 0, cp: 0, cpBombs: [0, 0, 0], R: null, level: 0, waveN: 0,
    players: [], rocks: [], crystals: [], enemies: [], shots: [], bolts: [], bombs: [], pods: [], beams: [], C: null,
    nextId: 1, ev: [], over: false, result: null, claims: [], net: null, lastDeathN: -1, regenT: 3, rockQ: [], nextC: 0,
    tutorial: mode === 'campaign' && !o.noTut && sector === 0 && !(o.cp > 0) && !o.demo, tut: {}, tutRock: 0,
    stats: { crystals: 0, chips: 0, gath: 0, reav: 0, fired: 0, bombs: 0, bombHits: 0, knocks: 0, popped: 0, deaths: 0, shieldHits: 0, delivered: 0, self: 0, wakeT: -1, killT: -1,
      cpTries: [0, 0, 0], cpDeaths: [0, 0, 0], cpHits: [0, 0, 0], bombsAtWake: -1, pods: 0, cause: {} },
  };
  const LE = SCORE.lifeEvery * D_OF(W).score;
  W.lifePts = W.score;
  W.nextLife = (Math.floor(W.lifePts / LE) + 1) * LE;
  W.R = ramp(W);
  const n = o.coop ? 2 : 1;
  for (let i = 0; i < n; i++) W.players.push(makePlayer(W, i + 1, n === 2 ? (i ? 4 : -4) : 0, 0, o));
  // the rocks
  for (let i = 0; i < W.R.rocks; i++) addRock(W, true);
  // the construct site, well away from the start
  const a = rr(W, 0, TAU), d = rr(W, 95, 120);
  W.C = makeConstruct(W, wp(Math.cos(a) * d), wp(Math.sin(a) * d));
  if (W.tutorial) {
    // a big crystal-rich rock right in front of the ship to learn on
    const r = addRock(W, false, 0, -20, 5.2);
    r.ore = 9; r.vx = r.vz = 0.15; W.tutRock = r.id;
  }
  const cp = clamp(o.cp | 0, 0, 2);
  if (cp >= 1) {
    W.C.pieces = cp === 2 ? W.C.N : Math.ceil(W.C.N / 2);
    W.cp = cp; W.R = ramp(W);
  }
  for (const p of W.players) { p.shield = W.R.shield + (W.up.deflector || 0); p.bombs = Math.min(F.maxBombs, o.bombs ?? (W.R.bombs + 2 * (W.up.rack || 0))); }
  if (cp === 2) for (const p of W.players) p.bombs = Math.max(p.bombs, W.R.kill + 2);
  W.cpBombs[W.cp] = W.players[0].bombs;
  return W;
}
function makePlayer(W, id, x, z, o) {
  return { id, x, z, vx: 0, vz: 0, a: -Math.PI / 2, alive: true, inv: 1, shield: 0, bombs: 0, fireT: 0, bombT: 0, deadT: 0, shotI: 0, thrust: 0, hurtT: 0,
    input: { mx: 0, mz: 0, fire: false, bomb: false }, bombHeld: false, remote: false, pw: {}, pull: 0, assist: id === 1 ? +o.assist || 0 : 0 };
}
export const cloneWorld = (W) => structuredClone(W);
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
function ramp(W) {
  if (W.mode === 'deep') { W.level = deepLevel(W.fightT); return applyDiff(rampLevel(W.level), W.diff); }
  return applyDiff(rampAt(W.sector, W.cp), W.diff);
}
export const cKey = (W) => (W.mode === 'deep' ? C_KEYS[W.k % 5] : SECTORS[W.sector].boss);
const alive = (W) => W.players.filter((p) => p.alive);
function nearestPlayer(W, x, z, max = 1e9) {
  let best = null, bd = max;
  for (const p of W.players) { if (!p.alive) continue; const d = hyp(wd(p.x - x), wd(p.z - z)); if (d < bd) { bd = d; best = p; } }
  return best;
}
function tut(W, key) { if (!W.tutorial || W.tut[key] || W.demo) return; W.tut[key] = 1; W.ev.push({ k: 'tut', key }); }
export const isAwake = (C) => !!C && (C.st === 'wake' || C.st === 'hunt' || C.st === 'tell' || C.st === 'pull' || C.st === 'ltell' || C.st === 'lunge' || C.st === 'digest');

// ------------------------------------------------------------------ rocks and crystals
function addRock(W, scatter, x, z, r) {
  if (r === undefined) r = ROCK.rMin + (ROCK.rMax - ROCK.rMin) * Math.pow(rand(W), 1.4);
  if (x === undefined) {
    // somewhere open, away from the ships (and off screen once play has started)
    let best = null, bs = -1;
    for (let i = 0; i < 30; i++) {
      const cx = rr(W, -H, H), cz = rr(W, -H, H);
      let s = 99;
      for (const q of W.rocks) s = Math.min(s, hyp(wd(q.x - cx), wd(q.z - cz)) - q.r - r - ROCK.gap);
      for (const p of W.players) s = Math.min(s, hyp(wd(p.x - cx), wd(p.z - cz)) - (scatter ? 16 : 55));
      if (W.C) s = Math.min(s, hyp(wd(W.C.x - cx), wd(W.C.z - cz)) - 22);
      if (s > 0) { x = cx; z = cz; break; }
      if (s > bs) { bs = s; best = [cx, cz]; }
    }
    if (x === undefined) [x, z] = best;
  }
  const a = rr(W, 0, TAU), v = rr(W, 0.2, ROCK.drift) * (4 / (r + 1));
  const R = W.R || { ore: 6 };
  const k = { id: W.nextId++, x, z, vx: Math.cos(a) * v, vz: Math.sin(a) * v, r, ore: Math.max(2, Math.round(R.ore * (0.55 + r / 9) + rr(W, -1, 1))), hits: 0, rot: rr(W, 0, TAU), spin: rr(W, -1, 1) * ROCK.spin * (3 / r), tilt: rr(W, 0, TAU), shape: (rand(W) * 1e6) | 0, hitT: 0 };
  W.rocks.push(k);
  return k;
}
// a crystal knocked loose from rock k, flying out toward (fx, fz)
function chipRock(W, k, fx, fz, pid) {
  if (k.ore <= 0) return;
  k.ore--; k.hits = 0;
  let dx = wd(fx - k.x), dz = wd(fz - k.z), d = hyp(dx, dz) || 1;
  dx /= d; dz /= d;
  const a = Math.atan2(dz, dx) + rr(W, -0.7, 0.7), sp = rr(W, 3.5, 6.5);
  const c = { id: W.nextId++, x: wp(k.x + Math.cos(a) * (k.r + 0.6)), z: wp(k.z + Math.sin(a) * (k.r + 0.6)), vx: Math.cos(a) * sp + k.vx, vz: Math.sin(a) * sp + k.vz, life: ROCK.crystalLife, held: 0, claim: 0, spin: rr(W, 0, TAU) };
  W.crystals.push(c);
  W.stats.chips++;
  if (pid) addScore(W, SCORE.chip);
  W.ev.push({ k: 'chip', x: c.x, z: c.z, rid: k.id, pid });
  if (pid) tut(W, 'collect');
}
function hitRock(W, k, fx, fz, pid, power = 1) {
  k.hits += power; k.hitT = 0.15;
  const need = W.R.chip;
  if (k.ore > 0) { if (k.hits >= need) chipRock(W, k, fx, fz, pid); }
  else if (k.hits >= need * 2 + 1) breakRock(W, k);
}
function breakRock(W, k) {
  k.gone = true;
  W.ev.push({ k: 'rockbreak', x: k.x, z: k.z, r: k.r, rid: k.id });
  W.rockQ.push(ROCK.respawnT + rr(W, 0, 8));
}
function rocks(W, dt) {
  for (const k of W.rocks) {
    k.x = wp(k.x + k.vx * dt); k.z = wp(k.z + k.vz * dt); k.rot += k.spin * dt; k.hitT = Math.max(0, k.hitT - dt);
  }
  // rocks nudge each other apart (a soft bounce)
  if (W.n % 2 === 0) {
    const L = W.rocks;
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const a = L[i], b = L[j];
      const dx = wd(b.x - a.x), dz = wd(b.z - a.z), d = hyp(dx, dz), m = a.r + b.r + 0.5;
      if (d >= m || d < 1e-6) continue;
      const nx = dx / d, nz = dz / d, push = (m - d) * 0.5;
      a.x = wp(a.x - nx * push); a.z = wp(a.z - nz * push); b.x = wp(b.x + nx * push); b.z = wp(b.z + nz * push);
      const rv = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
      if (rv < 0) { const wa = b.r * b.r / (a.r * a.r + b.r * b.r), wb = 1 - wa; a.vx += nx * rv * wa; a.vz += nz * rv * wa; b.vx -= nx * rv * wb; b.vz -= nz * rv * wb; }
    }
  }
  W.rockQ = W.rockQ.map((t) => t - dt);
  while (W.rockQ.length && W.rockQ[0] <= 0) { W.rockQ.shift(); if (W.rocks.length < W.R.rocks + 2) { const k = addRock(W, false); W.ev.push({ k: 'rockin', rid: k.id }); } }
}
function crystals(W, dt) {
  const magBase = [0, 7, 11][W.up.magnet || 0];
  for (const c of W.crystals) {
    c.spin += dt * 1.6;
    if (c.held) {
      const e = W.enemies.find((q) => q.id === c.held);
      if (!e || e.hp <= 0) { c.held = 0; c.life = Math.max(c.life, 8); continue; }
      c.x = wp(e.x + Math.cos(e.a) * 0.2); c.z = wp(e.z + Math.sin(e.a) * 0.2); c.vx = e.vx; c.vz = e.vz;
      continue;
    }
    c.life -= dt;
    const k = Math.exp(-ROCK.crystalDrag * dt);
    c.vx *= k; c.vz *= k;
    // magnets pull crystals in
    for (const p of W.players) {
      if (!p.alive || p.remote) continue;
      const mag = Math.max(magBase, p.pw.magnet ? 22 : 0);
      if (!mag) continue;
      const dx = wd(p.x - c.x), dz = wd(p.z - c.z), d = hyp(dx, dz);
      if (d < mag && d > 0.1) { const s = (p.pw.magnet ? 30 : 18) * (1 - d / mag) + 4; c.vx += (dx / d) * s * dt * 4; c.vz += (dz / d) * s * dt * 4; }
    }
    c.x = wp(c.x + c.vx * dt); c.z = wp(c.z + c.vz * dt);
    // crystals bounce off rocks
    for (const r of W.rocks) {
      const dx = wd(c.x - r.x), dz = wd(c.z - r.z), d = hyp(dx, dz);
      if (d < r.r + 0.4 && d > 1e-6) { const nx = dx / d, nz = dz / d; c.x = wp(r.x + nx * (r.r + 0.4)); c.z = wp(r.z + nz * (r.r + 0.4)); const vn = c.vx * nx + c.vz * nz; if (vn < 0) { c.vx -= 1.6 * vn * nx; c.vz -= 1.6 * vn * nz; } }
    }
    // scooped up?
    for (const p of W.players) {
      if (!p.alive || c.life <= 0 || p.remote) continue;
      if (hyp(wd(p.x - c.x), wd(p.z - c.z)) < F.pickR + F.r * 0.3) collect(W, c, p);
    }
    if (c.life <= 0 && !c.taken) W.ev.push({ k: 'fade', x: c.x, z: c.z });
  }
  W.crystals = W.crystals.filter((c) => c.life > 0 || c.held);
}
function collect(W, c, p) {
  c.life = 0; c.taken = true;
  if (W.net === 'guest' && p.id === 2) { W.claims.push({ grab: c.id }); return; }
  W.stats.crystals++;
  if (p.bombs < F.maxBombs) { p.bombs++; addScore(W, SCORE.crystal); W.ev.push({ k: 'collect', pid: p.id, x: c.x, z: c.z, bombs: p.bombs }); }
  else { addScore(W, SCORE.rackFull); W.ev.push({ k: 'collect', pid: p.id, x: c.x, z: c.z, bombs: p.bombs, full: 1 }); }
  if (p.bombs >= 2) tut(W, 'gather');
}

// ------------------------------------------------------------------ the step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  const guest = W.net === 'guest';
  W.phaseT -= dt;
  if (W.phase === 'intro') { if (W.phaseT <= 0) { W.phase = 'play'; W.stats.cpTries[W.cp]++; if (W.C.pieces >= W.C.N && W.C.st === 'build') wake(W); tut(W, 'steer'); } }
  else if (W.phase === 'play') {
    W.secT += dt; W.fightT += dt;
    if (W.mode === 'deep' && W.n % 600 === 0) W.R = ramp(W);
    if (!guest) director(W, dt);
    if (W.tutorial) {
      if (W.secT > 5) tut(W, 'shoot');
      if (W.secT > 70 && W.players[0].bombs >= 2) tut(W, 'bomb');
    }
  } else if (W.phase === 'clear') { W.secT += 0; if (W.phaseT <= 0 && !guest) { W.over = true; W.result = 'clear'; W.ev.push({ k: 'over', result: 'clear' }); } }
  for (const p of W.players) player(W, p, dt);
  rocks(W, dt);
  for (const e of W.enemies) if (!guest || e.local) enemy(W, e, dt);
  separate(W);
  if (W.C && !guest) construct(W, W.C, dt);
  else if (guest) pullPlayers(W, W.C);
  shots(W, dt);
  bolts(W, dt);
  bombs(W, dt);
  crystals(W, dt);
  pods(W, dt);
  contacts(W, dt);
  W.enemies = W.enemies.filter((e) => e.hp > 0);
  W.rocks = W.rocks.filter((k) => !k.gone);
  for (const b of W.beams) b.t -= dt;
  W.beams = W.beams.filter((b) => b.t > 0);
  if (guest) return;
  if (W.lifePts >= W.nextLife) { W.lives++; W.nextLife += SCORE.lifeEvery * D_OF(W).score; W.ev.push({ k: 'life' }); }
  if (W.lives <= 0 && !W.players.some((p) => p.alive) && W.players.every((p) => p.deadT > 1.6) && W.phase !== 'clear') { W.over = true; W.result = 'over'; W.ev.push({ k: 'over', result: 'over' }); }
}

// ------------------------------------------------------------------ who warps in, and when
function director(W, dt) {
  const R = W.R, C = W.C;
  W.regenT -= dt;
  if (W.regenT > 0) return;
  let g = 0, r = 0;
  for (const e of W.enemies) { if (e.type === 'gath') g++; else if (e.type === 'reaver') r++; }
  const hunting = isAwake(C);
  const canG = !W.tutorial || W.secT >= TUTOR.gathAt;
  const canR = (!W.tutorial || W.secT >= TUTOR.reavAt) && !(hunting && !R.combo);
  // fill the gatherers first (they are what builds the construct), then the reavers; quicker while short
  if (canG && g < R.gath && !(hunting && !R.repair)) { spawnEnemy(W, 'gath'); W.regenT = g < R.gath / 2 ? R.regen * 0.4 : R.regen * 0.75; return; }
  if (canR && r < R.reav) { spawnEnemy(W, 'reaver'); W.regenT = r < R.reav / 2 ? R.regen * 0.55 : R.regen; return; }
  W.regenT = 1.5;
}
// machines warp in out of sight: 52-80 m from every ship (gatherers often near the construct)
function spawnEnemy(W, type, near) {
  let x, z, best = null, bs = -1e9;
  for (let i = 0; i < 24; i++) {
    let cx, cz;
    if (near) { const a = rr(W, 0, TAU), d = rr(W, 9, 16); cx = wp(near.x + Math.cos(a) * d); cz = wp(near.z + Math.sin(a) * d); }
    else if (type === 'gath' && W.C && rand(W) < 0.55) { const a = rr(W, 0, TAU), d = rr(W, 14, 30); cx = wp(W.C.x + Math.cos(a) * d); cz = wp(W.C.z + Math.sin(a) * d); }
    else {
      const p = alive(W)[0] || W.players[0];
      const a = rr(W, 0, TAU), d = rr(W, 56, 80); cx = wp(p.x + Math.cos(a) * d); cz = wp(p.z + Math.sin(a) * d);
    }
    let s = 0;
    for (const p of W.players) if (p.alive) { const d = hyp(wd(p.x - cx), wd(p.z - cz)); s += Math.min(0, d - (near ? 14 : 50)) * 3; }
    for (const k of W.rocks) { const d = hyp(wd(k.x - cx), wd(k.z - cz)) - k.r - 2; if (d < 0) s += d; }
    if (s >= 0) { x = cx; z = cz; break; }
    if (s > bs) { bs = s; best = [cx, cz]; }
  }
  if (x === undefined) [x, z] = best;
  return addEnemy(W, type, x, z);
}
export function addEnemy(W, type, x, z) {
  const E = ENEMY[type];
  const hp = type === 'reaver' ? W.R.rHP || E.hp : E.hp;
  const e = { id: W.nextId++, type, x, z, vx: 0, vz: 0, a: rr(W, 0, TAU), hp, max: hp, r: E.r, born: 0.9, t: 0, role: type === 'gath' ? 'seek' : 'mine', think: rr(W, 0, 0.5),
    fireT: rr(W, 1.2, 2.2), tell: 0, aimA: 0, tgt: 0, carry: 0, orb: rr(W, 0, TAU), orbD: rand(W) < 0.5 ? -1 : 1, mineT: 1, abT: 0, hitT: 0, wob: rr(W, 0, TAU) };
  W.enemies.push(e);
  W.ev.push({ k: 'warpin', id: e.id, type, x, z });
  if (type === 'gath') tut(W, 'gath'); else tut(W, 'reaver');
  return e;
}

// ------------------------------------------------------------------ the Prospector
function player(W, p, dt) {
  if (!p.alive) {
    p.deadT += dt;
    if (p.deadT >= F.respawn && W.lives > 0 && W.net !== 'guest' && W.phase !== 'clear') respawn(W, p);
    return;
  }
  p.inv = Math.max(0, p.inv - dt); p.hurtT = Math.max(0, p.hurtT - dt);
  for (const k in p.pw) { p.pw[k] -= dt; if (p.pw[k] <= 0) { delete p.pw[k]; W.ev.push({ k: 'pwend', pid: p.id, kind: k }); } }
  if (p.remote) return;
  const I = p.input;
  let mx = I.mx, mz = I.mz;
  const m = hyp(mx, mz);
  if (m > 1) { mx /= m; mz /= m; }
  const th = 1 + 0.08 * (W.up.thrust || 0);
  if (m > 0.12 && W.phase !== 'intro') {
    const want = Math.atan2(mz, mx), turn = F.turn * th * dt;
    p.a += clamp(angDiff(p.a, want), -turn, turn);
    // a light touch (under ~30% of the stick) only turns the nose; past that the engines push along it,
    // so a hard reverse swings round in an arc
    const mag = Math.max(0, (Math.min(1, m) - 0.3) / 0.7);
    if (mag > 0) {
      let dvx = Math.cos(p.a) * F.vmax * th * mag - p.vx, dvz = Math.sin(p.a) * F.vmax * th * mag - p.vz;
      const l = hyp(dvx, dvz), cap = F.accel * th * dt;
      if (l > cap) { dvx *= cap / l; dvz *= cap / l; }
      p.vx += dvx; p.vz += dvz;
    } else { const k = 1 - F.drag * dt; p.vx *= k; p.vz *= k; }
    p.thrust = mag;
  } else {
    const k = 1 - F.drag * dt;
    p.vx *= k; p.vz *= k; p.thrust = 0;
  }
  // a construct's tractor pull (set by the construct each step)
  if (p.pull) { p.vx += p.pullX * dt; p.vz += p.pullZ * dt; }
  const sp = hyp(p.vx, p.vz), top = F.vmax * th * 1.6;
  if (sp > top) { p.vx *= top / sp; p.vz *= top / sp; }
  p.x = wp(p.x + p.vx * dt); p.z = wp(p.z + p.vz * dt);
  p.fireT -= dt; p.bombT -= dt;
  if (W.phase === 'intro') return;
  if (I.fire && p.fireT <= 0) fire(W, p);
  if (I.bomb && !p.bombHeld) launch(W, p);
  p.bombHeld = !!I.bomb;
}
export function fireCD(W, p) { return F.fireCD * [1, 0.84, 0.72, 0.62][W.up.rapid || 0] * (p && p.pw.overdrive ? 0.5 : 1); }
function fire(W, p) {
  p.fireT = fireCD(W, p);
  const side = p.shotI % 2 ? 1 : -1;
  const c = Math.cos(p.a), s = Math.sin(p.a);
  const mx = wp(p.x + c * 1.5 - s * side * 0.62), mz = wp(p.z + s * 1.5 + c * side * 0.62);
  let a0 = p.a;
  if (p.assist) a0 = assist(W, p, a0, p.assist);
  const angs = [0];
  const tw = Math.max(W.up.twin || 0, p.pw.twin ? 1 : 0);
  if (tw >= 1 && p.shotI % 2 === 0) angs.push(-F.twinA, F.twinA);
  if (tw >= 2 && p.shotI % 2 === 1) angs.push(-F.twinA * 2, F.twinA * 2);
  for (const d of angs) {
    const a = a0 + d;
    W.shots.push({ id: W.nextId++, pid: p.id, x: mx, z: mz, vx: Math.cos(a) * F.shotV + p.vx * 0.5, vz: Math.sin(a) * F.shotV + p.vz * 0.5, life: F.shotLife * (d ? 0.8 : 1), ghost: W.net === 'guest' && p.id === 2 });
  }
  p.shotI++;
  W.stats.fired++;
  W.ev.push({ k: 'fire', pid: p.id, x: mx, z: mz, a: a0, side });
}
// AIM ASSIST: bend the shot toward the best machine inside a narrow cone ahead (with lead)
function assist(W, p, a0, cone) {
  let best = null, bs = 1e9;
  for (const e of W.enemies) {
    if (e.hp <= 0 || e.born > 0.2) continue;
    const dx = wd(e.x - p.x), dz = wd(e.z - p.z), d = hyp(dx, dz);
    if (d > 42 || d < 1) continue;
    const da = Math.abs(angDiff(a0, Math.atan2(dz, dx)));
    if (da > cone + Math.atan(e.r / d)) continue;
    const sc = da * 8 + d * 0.1;
    if (sc < bs) { bs = sc; best = { dx, dz, d, e }; }
  }
  if (!best) return a0;
  const tt = best.d / F.shotV, aim = Math.atan2(best.dz + best.e.vz * tt, best.dx + best.e.vx * tt);
  return a0 + angDiff(a0, aim);
}
function launch(W, p) {
  if (p.bombT > 0) return;
  if (p.bombs <= 0) { W.ev.push({ k: 'empty', pid: p.id }); p.bombT = 0.4; return; }
  p.bombs--; p.bombT = F.bombCD;
  const c = Math.cos(p.a), s = Math.sin(p.a);
  const rk = 1 + 0.12 * (W.up.rack || 0);
  const b = { id: W.nextId++, pid: p.id, x: wp(p.x + c * 1.2), z: wp(p.z + s * 1.2), a: p.a, sp: F.bombV0 + Math.max(0, p.vx * c + p.vz * s), max: F.bombV * rk, life: F.bombLife, tgt: 0, think: 0, ghost: W.net === 'guest' && p.id === 2 };
  W.bombs.push(b);
  W.stats.bombs++;
  W.ev.push({ k: 'bomb', pid: p.id, x: b.x, z: b.z, a: p.a, left: p.bombs });
  if (W.net === 'guest' && p.id === 2) W.claims.push({ bomb: [Math.round(b.x * 100) / 100, Math.round(b.z * 100) / 100, Math.round(p.a * 1000) / 1000] });
}
function respawn(W, p) {
  // somewhere near where the ship went down, but clear of the construct and of reavers
  const C = W.C;
  let best = null, bs = -1e9;
  for (let i = 0; i < 28; i++) {
    const a = rr(W, 0, TAU), d = i < 4 ? rr(W, 0, 10) : rr(W, 10, 70);
    const x = wp(p.x + Math.cos(a) * d), z = wp(p.z + Math.sin(a) * d);
    let s = -d * 0.05;
    if (C && isAwake(C)) s += Math.min(0, hyp(wd(C.x - x), wd(C.z - z)) - F.safeR) * 2;
    else if (C) s += Math.min(0, hyp(wd(C.x - x), wd(C.z - z)) - C.R - 8);
    for (const e of W.enemies) if (e.type === 'reaver') s += Math.min(0, hyp(wd(e.x - x), wd(e.z - z)) - 30);
    for (const k of W.rocks) s += Math.min(0, hyp(wd(k.x - x), wd(k.z - z)) - k.r - 4) * 2;
    if (s > bs) { bs = s; best = [x, z]; }
  }
  p.x = best[0]; p.z = best[1]; p.vx = p.vz = 0;
  p.alive = true; p.inv = F.inv; p.deadT = 0; p.fireT = 0.3; p.pull = 0;
  p.shield = Math.max(p.shield, W.cp < 2 && W.R.shield >= 2 ? 1 : 0);   // a fresh shield on warping back in: the first sector only
  // the reavers back off for a moment
  for (const e of W.enemies) if (e.type === 'reaver') { e.tell = 0; e.fireT = Math.max(e.fireT, 2.2); }
  W.ev.push({ k: 'spawn', pid: p.id, x: p.x, z: p.z });
}
function hurt(W, p, cause, fx, fz, fatal = false) {
  if (!p.alive || p.inv > 0) return;
  if (W.net === 'host' && p.remote) return;   // the guest judges its own hits
  const cpk = W.cp;
  W.stats.cpHits[cpk]++;
  if (p.shield > 0 && !fatal) {
    p.shield--; p.inv = F.hitInv; p.hurtT = 0.5; W.stats.shieldHits++;
    const dx = wd(p.x - fx), dz = wd(p.z - fz), d = hyp(dx, dz) || 1;
    const kick = cause === 'construct' ? 26 : 9;
    p.vx += (dx / d) * kick; p.vz += (dz / d) * kick;
    W.ev.push({ k: 'shield', pid: p.id, x: p.x, z: p.z, left: p.shield, cause, fx, fz });
    if (W.net === 'guest' && p.id === 2) W.claims.push({ shield: p.shield });
    return;
  }
  p.alive = false; p.deadT = 0; p.pull = 0;
  W.lives = Math.max(0, W.lives - 1);
  W.stats.deaths++; W.stats.cpDeaths[cpk]++; W.lastDeathN = W.n;
  W.stats.cause[cause] = (W.stats.cause[cause] || 0) + 1;
  W.ev.push({ k: 'death', pid: p.id, x: p.x, z: p.z, vx: p.vx, vz: p.vz, cause, fx, fz, lives: W.lives });
  p.vx = p.vz = 0;
  if (W.net === 'guest' && p.id === 2) W.claims.push({ died: 1, cause });
  if (cause === 'construct' && W.C) { W.C.st = 'digest'; W.C.stT = 3.6; W.C.vx *= 0.2; W.C.vz *= 0.2; W.ev.push({ k: 'eat', x: p.x, z: p.z }); }
}

// ------------------------------------------------------------------ machines
function steer(e, dx, dz, speed, accel, dt) {
  const d = hyp(dx, dz) || 1;
  let dvx = (dx / d) * speed - e.vx, dvz = (dz / d) * speed - e.vz;
  const l = hyp(dvx, dvz), cap = accel * dt;
  if (l > cap) { dvx *= cap / l; dvz *= cap / l; }
  e.vx += dvx; e.vz += dvz;
}
// push a wanted direction away from rocks (and the construct) that lie ahead
function avoid(W, e, dx, dz, look = 9) {
  const d = hyp(dx, dz) || 1;
  const ux0 = dx / d, uz0 = dz / d;
  let ux = ux0, uz = uz0;
  const obs = (ox, oz, r) => {
    const rx = wd(ox - e.x), rz = wd(oz - e.z), rd = hyp(rx, rz);
    if (rd < 1e-6) return;
    const gap = rd - r - e.r;
    if (gap > look) return;
    const ahead = (rx * ux0 + rz * uz0) / rd;
    if (ahead < 0 && gap > 1.5) return;
    const w = (1 - Math.max(0, gap) / look) * (gap < 1.5 ? 2 : 1) * Math.max(0.25, ahead);
    // slide past on the side away from the obstacle, and a little straight back from it
    const cr = ux0 * rz - uz0 * rx;
    const px = cr > 0 ? uz0 : -uz0, pz = cr > 0 ? -ux0 : ux0;
    ux += px * w * 1.5 - (rx / rd) * w * 0.5; uz += pz * w * 1.5 - (rz / rd) * w * 0.5;
  };
  for (const k of W.rocks) obs(k.x, k.z, k.r);
  if (W.C && e.type !== 'gath' && W.C.st !== 'gone') obs(W.C.x, W.C.z, W.C.R * 0.9);
  const l = hyp(ux, uz) || 1;
  return [ux / l, uz / l];
}
function enemy(W, e, dt) {
  e.t += dt; e.hitT = Math.max(0, e.hitT - dt);
  if (e.born > 0) { e.born -= dt; e.vx *= 0.9; e.vz *= 0.9; return; }
  if (e.type === 'gath') gatherer(W, e, dt); else reaver(W, e, dt);
  e.x = wp(e.x + e.vx * dt); e.z = wp(e.z + e.vz * dt);
}
function gatherer(W, e, dt) {
  const R = W.R, C = W.C, E = ENEMY.gath;
  let tx = 0, tz = 0, sp = R.gV, has = false;
  const hunting = isAwake(C);
  if (e.carry) {
    const c = W.crystals.find((q) => q.id === e.carry);
    if (!c) e.carry = 0;
    else if (C && (!hunting || (R.repair && C.st !== 'digest'))) {
      tx = wd(C.x - e.x); tz = wd(C.z - e.z); has = true;
      const d = hyp(tx, tz);
      if (d < C.R + 1.6) deliver(W, e, c);
    } else { // hold it, keep away from ships
      const p = nearestPlayer(W, e.x, e.z, 40);
      if (p) { tx = -wd(p.x - e.x); tz = -wd(p.z - e.z); has = true; }
    }
  }
  if (!e.carry) {
    e.think -= dt;
    let c = e.tgt ? W.crystals.find((q) => q.id === e.tgt && !q.held && q.life > 0.5) : null;
    if (!c || e.think <= 0) {
      e.think = 0.6;
      if (c) c.claim = 0;
      let best = null, bd = 150;
      for (const q of W.crystals) {
        if (q.held || q.life < 1 || (q.claim && q.claim !== e.id)) continue;
        const d = hyp(wd(q.x - e.x), wd(q.z - e.z));
        if (d < bd) { bd = d; best = q; }
      }
      c = best; e.tgt = c ? c.id : 0; if (c) c.claim = e.id;
    }
    if (c) {
      tx = wd(c.x - e.x); tz = wd(c.z - e.z); has = true;
      if (hyp(tx, tz) < E.grab + c.life * 0) { c.held = e.id; c.claim = 0; e.carry = c.id; e.tgt = 0; W.ev.push({ k: 'grab', id: e.id, x: e.x, z: e.z }); }
    } else {
      // nothing to fetch: lurk out by the nearest ship, ready to swoop on whatever it knocks loose
      const p = nearestPlayer(W, e.x, e.z);
      const cx = p ? p.x : C ? C.x : e.x, cz = p ? p.z : C ? C.z : e.z, rad = p ? 30 + (e.id % 3) * 6 : 26;
      e.orb += dt * 0.15 * e.orbD;
      const ox = wp(cx + Math.cos(e.orb) * rad), oz = wp(cz + Math.sin(e.orb) * rad);
      tx = wd(ox - e.x); tz = wd(oz - e.z); has = true; sp *= 0.6;
    }
  }
  // an idle gatherer shies away from a ship that comes close; one after a crystal swoops in regardless
  const p = nearestPlayer(W, e.x, e.z, 9);
  if (p && !e.carry && !e.tgt) { tx -= wd(p.x - e.x) * 1.2; tz -= wd(p.z - e.z) * 1.2; }
  if (has) { const [ux, uz] = avoid(W, e, tx, tz, 7); steer(e, ux, uz, sp, E.accel, dt); }
  else { e.vx *= 1 - dt; e.vz *= 1 - dt; }
  if (hyp(e.vx, e.vz) > 0.5) e.a += clamp(angDiff(e.a, Math.atan2(e.vz, e.vx)), -6 * dt, 6 * dt);
}
function deliver(W, e, c) {
  c.life = 0; c.held = 0; c.taken = true;
  e.carry = 0;
  const C = W.C;
  W.stats.delivered++;
  W.ev.push({ k: 'deliver', x: e.x, z: e.z, cx: C.x, cz: C.z });
  if (isAwake(C)) { if (C.hp < C.max) { C.hp++; W.ev.push({ k: 'repair', x: C.x, z: C.z, hp: C.hp }); } }
  else addPiece(W, 'gath');
}
function reaver(W, e, dt) {
  const R = W.R, C = W.C, E = ENEMY.reaver;
  const p = nearestPlayer(W, e.x, e.z, E.aggro);
  const hunting = isAwake(C);
  const passive = hunting && !R.combo;
  const safe = W.tutorial && W.secT < TUTOR.safe;
  e.abT -= dt;
  e.think -= dt;
  if (e.think <= 0) {
    e.think = 0.5;
    let b = e.role === 'icpt' ? W.bombs.find((q) => q.id === e.tgt) : null;
    if (!b && R.icpt > 0) {
      for (const q of W.bombs) if (!q.ghost && hyp(wd(q.x - e.x), wd(q.z - e.z)) < 34 && rand(W) < R.icpt * 0.5) { b = q; break; }
    }
    if (b) { e.role = 'icpt'; e.tgt = b.id; }
    else {
      let eng = 0;
      for (const q of W.enemies) if (q !== e && q.type === 'reaver' && q.role === 'hunt') eng++;
      if (p && !passive && (e.role === 'hunt' || eng < R.engage)) e.role = 'hunt';
      else if (passive && p && hyp(wd(p.x - e.x), wd(p.z - e.z)) < 40) e.role = 'shy';
      else { if (e.role !== 'mine') e.tgt = 0; e.role = 'mine'; e.tell = 0; }
    }
  }
  let tx = 0, tz = 0, sp = R.rV, face = null;
  if (e.role === 'hunt' && p) {
    const dx = wd(p.x - e.x), dz = wd(p.z - e.z), d = hyp(dx, dz);
    e.orb += dt * (0.35 + 0.08 * W.R.engage) * e.orbD;
    if (W.n % 240 === e.id % 240 && rand(W) < 0.35) e.orbD = -e.orbD;   // now and then it switches direction
    const want = E.standoff * (W.sector === 0 && W.mode === 'campaign' ? 1.2 : 1);
    const ox = p.x + Math.cos(e.orb) * want, oz = p.z + Math.sin(e.orb) * want;
    tx = wd(ox - e.x); tz = wd(oz - e.z);
    face = Math.atan2(dz, dx);
    if (e.tell > 0) {
      e.tell -= dt; sp *= 0.45;
      // the aim tracks the ship until the last 30% of the tell, then holds still
      if (e.tell > R.warn * 0.3) { const tt = d / R.boltV; e.aimA = Math.atan2(dz + p.vz * tt * 0.85, dx + p.vx * tt * 0.85); }
      face = e.aimA;
      if (e.tell <= 0) {
        const a0 = e.aimA + (rand(W) * 2 - 1) * R.aim, nb = Math.max(1, R.burst | 0);
        // a volley: one bolt, or a small fan round the aim
        for (let i = 0; i < nb; i++) {
          const a = a0 + (i - (nb - 1) / 2) * 0.15;
          W.bolts.push({ id: W.nextId++, x: wp(e.x + Math.cos(a) * 1.6), z: wp(e.z + Math.sin(a) * 1.6), vx: Math.cos(a) * R.boltV, vz: Math.sin(a) * R.boltV, life: 3.2, r: 0.5, eid: e.id });
        }
        W.ev.push({ k: 'bolt', id: e.id, x: e.x, z: e.z, a: a0, n: nb });
        e.fireT = (1 / R.fire) * rr(W, 0.8, 1.2);
      }
    } else {
      e.fireT -= dt;
      if (e.fireT <= 0 && d < E.range && p.alive && p.inv <= 0.4 && !safe && W.phase === 'play') {
        e.tell = R.warn; const tt = d / R.boltV; e.aimA = Math.atan2(dz + p.vz * tt, dx + p.vx * tt);
        W.ev.push({ k: 'tell', id: e.id, x: e.x, z: e.z, T: R.warn });
      }
    }
  } else if (e.role === 'icpt') {
    const b = W.bombs.find((q) => q.id === e.tgt);
    if (!b) { e.role = 'mine'; e.think = 0; }
    else {
      const dx = wd(b.x - e.x), dz = wd(b.z - e.z), d = hyp(dx, dz);
      tx = dx; tz = dz; sp *= 1.15; face = Math.atan2(dz, dx);
      if (d < 26 && e.abT <= 0) {
        const tt = d / (R.boltV * 1.35), a = Math.atan2(dz + Math.sin(b.a) * b.sp * tt, dx + Math.cos(b.a) * b.sp * tt) + (rand(W) * 2 - 1) * 0.12;
        W.bolts.push({ id: W.nextId++, x: wp(e.x + Math.cos(a) * 1.6), z: wp(e.z + Math.sin(a) * 1.6), vx: Math.cos(a) * R.boltV * 1.35, vz: Math.sin(a) * R.boltV * 1.35, life: 1.4, r: 0.45, eid: e.id, ab: 1 });
        W.ev.push({ k: 'bolt', id: e.id, x: e.x, z: e.z, a, ab: 1 });
        e.abT = 0.45;
      }
    }
  } else if (e.role === 'shy' && p) {
    tx = -wd(p.x - e.x); tz = -wd(p.z - e.z); sp *= 0.7;
  } else {
    // mining: hover by a rock and cut crystals out of it for the gatherers
    let k = e.tgt ? W.rocks.find((q) => q.id === e.tgt && q.ore > 0) : null;
    if (!k) {
      let bd = 1e9;
      for (const q of W.rocks) { if (q.ore <= 0) continue; const d = hyp(wd(q.x - e.x), wd(q.z - e.z)) + (q.id === W.tutRock ? 1e6 : 0); if (d < bd) { bd = d; k = q; } }
      e.tgt = k ? k.id : 0;
    }
    if (k) {
      const dx = wd(k.x - e.x), dz = wd(k.z - e.z), d = hyp(dx, dz);
      const want = k.r + 8;
      e.orb += dt * 0.2 * e.orbD;
      const ox = k.x - Math.cos(e.orb) * want, oz = k.z - Math.sin(e.orb) * want;
      tx = wd(ox - e.x); tz = wd(oz - e.z); sp *= 0.7; face = Math.atan2(dz, dx);
      if (d < want + 4) {
        e.mineT -= dt;
        if (e.mineT <= 0) {
          e.mineT = 1.7;
          W.beams.push({ eid: e.id, rid: k.id, t: 0.5 });
          W.ev.push({ k: 'mine', id: e.id, x: e.x, z: e.z, rx: k.x, rz: k.z });
          hitRock(W, k, e.x, e.z, 0, Math.max(1, Math.round(W.R.chip * 0.4)));
        }
      }
    } else { e.vx *= 1 - dt; e.vz *= 1 - dt; }
  }
  if (tx || tz) {
    const [ux, uz] = avoid(W, e, tx, tz, 10);
    const d = hyp(tx, tz);
    steer(e, ux, uz, d < 2 ? sp * d / 2 : sp, E.accel, dt);
  }
  const want = face ?? (hyp(e.vx, e.vz) > 0.5 ? Math.atan2(e.vz, e.vx) : e.a);
  e.a += clamp(angDiff(e.a, want), -5 * dt, 5 * dt);
}
function separate(W) {
  const L = W.enemies;
  for (let i = 0; i < L.length; i++) {
    const a = L[i];
    for (let j = i + 1; j < L.length; j++) {
      const b = L[j];
      const dx = wd(b.x - a.x), dz = wd(b.z - a.z), d = hyp(dx, dz), m = a.r + b.r + 0.6;
      if (d >= m || d < 1e-6) continue;
      const push = (m - d) * 0.5, nx = dx / d, nz = dz / d;
      a.x = wp(a.x - nx * push); a.z = wp(a.z - nz * push); b.x = wp(b.x + nx * push); b.z = wp(b.z + nz * push);
    }
    // nobody flies through rock
    for (const k of W.rocks) {
      const dx = wd(a.x - k.x), dz = wd(a.z - k.z), d = hyp(dx, dz), m = k.r + a.r;
      if (d < m && d > 1e-6) { const nx = dx / d, nz = dz / d; a.x = wp(k.x + nx * m); a.z = wp(k.z + nz * m); const vn = a.vx * nx + a.vz * nz; if (vn < 0) { a.vx -= vn * nx; a.vz -= vn * nz; } }
    }
  }
}
export function damage(W, e, dmg, pid, by) {
  if (e.hp <= 0 || e.born > 0.3) return;
  e.hp -= dmg; e.hitT = 0.18;
  if (e.hp <= 0) kill(W, e, pid, by);
  else W.ev.push({ k: 'hit', x: e.x, z: e.z, type: e.type });
}
function kill(W, e, pid, by) {
  e.hp = 0;
  const E = ENEMY[e.type];
  let pts = E.score;
  if (e.carry) {
    const c = W.crystals.find((q) => q.id === e.carry);
    if (c) { c.held = 0; c.life = Math.max(c.life, 10); c.vx = e.vx * 0.4; c.vz = e.vz * 0.4; }
    pts += E.carryScore || 0;
  }
  if (pid) addScore(W, pts);
  if (e.type === 'gath') W.stats.gath++; else W.stats.reav++;
  W.ev.push({ k: 'kill', id: e.id, type: e.type, x: e.x, z: e.z, vx: e.vx, vz: e.vz, a: e.a, score: pts, by, carry: e.carry ? 1 : 0, pid });
  // pods
  if (pid && W.pods.length < DROP.max && !W.tutorial) {
    const ch = (e.type === 'reaver' ? DROP.reaver : DROP.gath) * D_OF(W).drops;
    if (rand(W) < ch) addPod(W, e.x, e.z);
  }
}
function addPod(W, x, z) {
  let tot = 0;
  for (const k of PW_KEYS) tot += POWERUPS[k].w;
  let r = rand(W) * tot, kind = PW_KEYS[0];
  for (const k of PW_KEYS) { r -= POWERUPS[k].w; if (r <= 0) { kind = k; break; } }
  const a = rr(W, 0, TAU);
  W.pods.push({ id: W.nextId++, x, z, vx: Math.cos(a) * 2, vz: Math.sin(a) * 2, kind, life: DROP.life, t: 0 });
  W.ev.push({ k: 'drop', x, z, kind });
}
function pods(W, dt) {
  for (const q of W.pods) {
    q.life -= dt; q.t += dt;
    q.vx *= 1 - dt * 0.6; q.vz *= 1 - dt * 0.6;
    q.x = wp(q.x + q.vx * dt); q.z = wp(q.z + q.vz * dt);
    for (const p of W.players) {
      if (!p.alive || q.life <= 0 || p.remote) continue;
      if (hyp(wd(p.x - q.x), wd(p.z - q.z)) < DROP.r + F.r) {
        q.life = 0;
        if (W.net === 'guest' && p.id === 2) W.claims.push({ pod: q.id });
        const P = POWERUPS[q.kind];
        if (q.kind === 'cell') p.shield++;
        else p.pw[q.kind] = P.time;
        addScore(W, SCORE.pod); W.stats.pods++;
        W.ev.push({ k: 'pickup', pid: p.id, x: q.x, z: q.z, kind: q.kind });
      }
    }
    if (q.life <= 0 && !q.ev) { q.ev = 1; if (q.t > 0 && q.life > -0.01) W.ev.push({ k: 'pickgone', x: q.x, z: q.z }); }
  }
  W.pods = W.pods.filter((q) => q.life > 0);
}
export function addScore(W, n) { const b = Math.round(n * D_OF(W).score); W.score += b; W.lifePts += b; }

// ------------------------------------------------------------------ the construct
function makeConstruct(W, x, z) {
  const key = cKey(W), K = CONSTRUCTS[key], R = W.R;
  return { key, x, z, vx: 0, vz: 0, a: rr(W, 0, TAU), N: R.pieces, pieces: 0, st: 'build', stT: 0, selfT: R.selfT * 0.8, hp: 0, max: R.kill, R: K.R, hitR: K.hitR,
    pullCD: R.pullEvery, lungeCD: 6, summonCD: 9, lx: 0, lz: 0, hitT: 0, drift: rr(W, 0, TAU), t: 0, iris: 0, wakeFrac: 1, cyc: 'shut', cycT: 0 };
}
function addPiece(W, how) {
  const C = W.C;
  if (C.st !== 'build' || C.pieces >= C.N) return;
  C.pieces++;
  if (how === 'self') W.stats.self++;
  W.ev.push({ k: 'build', x: C.x, z: C.z, pieces: C.pieces, N: C.N, how });
  if (W.cp === 0 && C.pieces >= Math.ceil(C.N / 2)) checkpoint(W, 1);
  if (C.pieces >= C.N) wake(W);
}
function checkpoint(W, cp) {
  if (W.mode === 'deep' || cp <= W.cp) return;
  W.cp = cp; W.R = ramp(W);
  W.stats.cpTries[cp]++;
  for (const p of W.players) p.shield = Math.max(p.shield, W.R.shield + (W.up.deflector || 0));
  W.cpBombs[cp] = W.players[0].bombs;
  W.ev.push({ k: 'checkpoint', cp });
  if (cp === 1) tut(W, 'half');
}
// EARLY STRIKE: once a construct is half built, the first charge that hits it wakes it on the spot. It wakes with
// armour for the plates it has: a half-built one needs about half the charges, but now it hunts you.
export const canStrike = (W) => !!W.C && W.C.st === 'build' && W.C.pieces >= Math.ceil(W.C.N / 2);
export const strikeHP = (W) => (canStrike(W) ? Math.max(2, Math.ceil(W.R.kill * (0.4 + 0.6 * W.C.pieces / W.C.N))) : W.R.kill);
// once awake, charges only hurt it while its core is open (the iris more than a third open) and it is not still waking
export const coreOpen = (C) => !!C && C.st !== 'wake' && C.st !== 'dying' && C.iris > 0.35;
function wake(W, early = false) {
  const C = W.C;
  const hp = early ? strikeHP(W) : W.R.kill;
  if (W.mode !== 'deep') checkpoint(W, 2);
  const R2 = W.R;
  C.st = 'wake'; C.stT = R2.wakeT * (early ? 0.8 : 1); C.hp = C.max = hp; C.wakeFrac = early ? C.pieces / C.N : 1; if (!early) C.pieces = C.N;
  C.pullCD = R2.pullEvery * 0.7; C.lungeCD = 5; C.summonCD = 4; C.cyc = 'shut'; C.cycT = 0; C.iris = 0;
  W.stats.wakeT = W.secT; W.stats.early = early ? 1 : 0; W.stats.wakeHP = hp;
  W.stats.bombsAtWake = W.players.reduce((s, p) => s + p.bombs, 0);
  W.ev.push({ k: 'wake', x: C.x, z: C.z, key: C.key, T: C.stT, early, hp });
  tut(W, 'wake');
}
function construct(W, C, dt) {
  const R = W.R;
  C.t += dt; C.hitT = Math.max(0, C.hitT - dt);
  for (const p of W.players) { p.pull = 0; }
  if (C.st === 'gone') return;
  if (C.st === 'build') {
    C.iris = Math.max(0, C.iris - dt);
    C.drift += dt * 0.05;
    C.vx += (Math.cos(C.drift) * 0.6 - C.vx) * dt * 0.3; C.vz += (Math.sin(C.drift * 1.3) * 0.6 - C.vz) * dt * 0.3;
    if (W.phase === 'play') { C.selfT -= dt; if (C.selfT <= 0) { C.selfT = R.selfT; addPiece(W, 'self'); } }
  } else if (C.st === 'dying') {
    C.stT -= dt; C.vx *= 1 - dt; C.vz *= 1 - dt;
    if (W.n % 30 === 0) W.ev.push({ k: 'cboom', x: wp(C.x + rr(W, -4, 4)), z: wp(C.z + rr(W, -4, 4)) });
    if (C.stT <= 0) destroyed(W, C);
  } else {
    // the core cycle: open (it can be hurt) then shut (charges bounce off); the iris takes 0.8 s to move
    if (C.st !== 'wake') {
      C.cycT -= dt;
      if (C.cycT <= 0) {
        C.cyc = C.cyc === 'open' ? 'shut' : 'open';
        C.cycT = C.cyc === 'open' ? R.openT : R.shutT;
        W.ev.push({ k: C.cyc === 'open' ? 'coreopen' : 'coreshut', x: C.x, z: C.z, T: C.cycT });
      }
      C.iris = C.cyc === 'open' ? Math.min(1, C.iris + dt * 1.25) : Math.max(0, C.iris - dt * 1.25);
    }
    const p = nearestPlayer(W, C.x, C.z);
    C.stT -= dt;
    let sp = R.bossV, tx = 0, tz = 0;
    if (p) { const tt = 0.6; tx = wd(p.x + p.vx * tt - C.x); tz = wd(p.z + p.vz * tt - C.z); }
    const d = p ? hyp(wd(p.x - C.x), wd(p.z - C.z)) : 1e9;
    switch (C.st) {
      case 'wake': sp = 0; if (C.stT <= 0) { C.st = 'hunt'; C.cyc = 'open'; C.cycT = R.openT; W.ev.push({ k: 'hunt', x: C.x, z: C.z }); W.ev.push({ k: 'coreopen', x: C.x, z: C.z, T: R.openT }); } break;
      case 'digest': sp *= 0.25; if (C.stT <= 0) C.st = 'hunt'; break;
      case 'hunt':
        C.pullCD -= dt; C.lungeCD -= dt; C.summonCD -= dt;
        if (!p) { sp *= 0.3; break; }
        if (C.pullCD <= 0 && d < 55) { C.st = 'tell'; C.stT = R.pullTell; W.ev.push({ k: 'pulltell', x: C.x, z: C.z, T: R.pullTell }); tut(W, 'pull'); }
        else if (R.lunge && C.lungeCD <= 0 && d > 14 && d < 42) { C.st = 'ltell'; C.stT = Math.max(0.7, R.pullTell * 0.85); C.lx = tx; C.lz = tz; W.ev.push({ k: 'ltell', x: C.x, z: C.z, a: Math.atan2(tz, tx), T: C.stT }); }
        if (R.summon && C.summonCD <= 0) {
          C.summonCD = 22;
          let n = 0;
          for (const e of W.enemies) if (e.type === 'reaver') n++;
          if (n < R.reav + 2) { for (let i = 0; i < R.summon; i++) spawnEnemy(W, 'reaver', C); W.ev.push({ k: 'summon', x: C.x, z: C.z, n: R.summon }); }
        }
        break;
      case 'tell': sp *= 0.3; if (C.stT <= 0) { C.st = 'pull'; C.stT = 2.6; W.ev.push({ k: 'pull', x: C.x, z: C.z }); } break;
      case 'pull':
        sp *= 0.4;
        pullPlayers(W, C);
        if (C.stT <= 0) { C.st = 'hunt'; C.pullCD = R.pullEvery * rr(W, 0.85, 1.15); }
        break;
      case 'ltell': sp = 0; if (C.stT <= 0) { C.st = 'lunge'; C.stT = 1.15; const l = hyp(C.lx, C.lz) || 1; C.lx /= l; C.lz /= l; W.ev.push({ k: 'lunge', x: C.x, z: C.z, a: Math.atan2(C.lz, C.lx) }); } break;
      case 'lunge': tx = C.lx; tz = C.lz; sp *= 2.6; if (C.stT <= 0) { C.st = 'hunt'; C.lungeCD = rr(W, 6.5, 9); } break;
    }
    if (C.hitT > 0) sp *= 0.5;
    if (sp > 0 && (tx || tz)) {
      const l = hyp(tx, tz) || 1;
      const acc = C.st === 'lunge' ? 40 : 5.5;
      let dvx = (tx / l) * sp - C.vx, dvz = (tz / l) * sp - C.vz;
      const dl = hyp(dvx, dvz), cap = acc * dt;
      if (dl > cap) { dvx *= cap / dl; dvz *= cap / dl; }
      C.vx += dvx; C.vz += dvz;
    } else { C.vx *= 1 - dt * 1.5; C.vz *= 1 - dt * 1.5; }
    if (hyp(C.vx, C.vz) > 0.3) C.a += clamp(angDiff(C.a, Math.atan2(C.vz, C.vx)), -0.8 * dt, 0.8 * dt);
  }
  C.x = wp(C.x + C.vx * dt); C.z = wp(C.z + C.vz * dt);
  // it ploughs rocks aside
  for (const k of W.rocks) {
    const dx = wd(k.x - C.x), dz = wd(k.z - C.z), d = hyp(dx, dz), m = k.r + C.hitR;
    if (d < m && d > 1e-6) { const nx = dx / d, nz = dz / d; k.x = wp(C.x + nx * m); k.z = wp(C.z + nz * m); const vn = (k.vx - C.vx) * nx + (k.vz - C.vz) * nz; if (vn < 0) { k.vx -= vn * nx * 1.3; k.vz -= vn * nz * 1.3; } }
  }
}
// the tractor pull drags every local ship inside 48 m toward the construct
export function pullPlayers(W, C) {
  for (const q of W.players) {
    q.pull = 0;
    if (!q.alive || q.remote || !C || C.st !== 'pull') continue;
    const dx = wd(C.x - q.x), dz = wd(C.z - q.z), dd = hyp(dx, dz);
    if (dd < 48 && dd > 0.1) { const s = W.R.pull * Math.sqrt(1 - dd / 48) * 1.6; q.pull = 1; q.pullX = (dx / dd) * s; q.pullZ = (dz / dd) * s; }
  }
}
function bombConstruct(W, C, b) {
  W.stats.bombHits++;
  if (C.st === 'build' && canStrike(W)) { wake(W, true); W.ev.push({ k: 'strike', x: b.x, z: b.z, cx: C.x, cz: C.z, pid: b.pid, hp: C.hp }); return; }
  if (C.st === 'build') {
    const floor = W.cp >= 1 ? Math.ceil(C.N / 2) : 0;
    const before = C.pieces;
    C.pieces = Math.max(floor, C.pieces - 2);
    C.selfT = Math.max(C.selfT, W.R.selfT * 0.5);
    if (b.pid) addScore(W, SCORE.knock);
    W.stats.knocks++;
    W.ev.push({ k: 'knock', x: b.x, z: b.z, cx: C.x, cz: C.z, pieces: C.pieces, lost: before - C.pieces, N: C.N, pid: b.pid });
    return;
  }
  if (C.st === 'dying' || C.st === 'gone') return;
  if (!coreOpen(C)) {
    // shut (or still waking): the charge bursts on the armour and does nothing
    W.stats.deflected = (W.stats.deflected || 0) + 1;
    W.ev.push({ k: 'deflect', x: b.x, z: b.z, cx: C.x, cz: C.z, pid: b.pid, waking: C.st === 'wake' ? 1 : 0 });
    return;
  }
  C.hp--; C.hitT = 0.7;
  if (b.pid) addScore(W, SCORE.bombHit);
  W.ev.push({ k: 'bombhit', x: b.x, z: b.z, cx: C.x, cz: C.z, hp: C.hp, max: C.max, pid: b.pid });
  if (C.hp <= 0) {
    C.st = 'dying'; C.stT = 2.6; W.stats.killT = W.secT;
    W.ev.push({ k: 'cdying', x: C.x, z: C.z, key: C.key });
    for (const e of W.enemies) if (e.type === 'gath') kill(W, e, 0, 'boss');
  }
}
function destroyed(W, C) {
  C.st = 'gone';
  const s = W.mode === 'deep' ? Math.min(4, Math.floor(W.level)) : W.sector;
  const bonus = Math.round(SCORE.construct * (1 + 0.5 * s));
  addScore(W, bonus);
  W.ev.push({ k: 'ckill', x: C.x, z: C.z, key: C.key, bonus });
  if (W.mode === 'deep') {
    W.waveN++;
    W.k = (W.k + 1) % 5;
    W.R = ramp(W);
    const p = alive(W)[0] || W.players[0];
    const a = rr(W, 0, TAU);
    W.C = makeConstruct(W, wp(p.x + Math.cos(a) * 110), wp(p.z + Math.sin(a) * 110));
    W.C.selfT = 8;
    W.ev.push({ k: 'newsite', key: W.C.key, look: W.k });
    for (const q of W.players) { q.shield = Math.max(q.shield, W.R.shield); q.bombs = Math.min(F.maxBombs, q.bombs + 2); }
    return;
  }
  const t = W.secT;
  const tb = Math.max(0, Math.round((420 - t) * SCORE.timeBonus));
  addScore(W, SCORE.sector + tb);
  W.phase = 'clear'; W.phaseT = 4.2;
  W.ev.push({ k: 'clear', bonus: SCORE.sector + tb, t });
}

// ------------------------------------------------------------------ shots, bolts, charges
function shots(W, dt) {
  const C = W.C;
  for (const s of W.shots) {
    s.life -= dt;
    s.x = wp(s.x + s.vx * dt); s.z = wp(s.z + s.vz * dt);
    if (s.life <= 0) continue;
    // rocks
    let hit = false;
    for (const k of W.rocks) {
      if (Math.abs(wd(k.x - s.x)) > k.r + 1 || Math.abs(wd(k.z - s.z)) > k.r + 1) continue;
      if (hyp(wd(k.x - s.x), wd(k.z - s.z)) < k.r + F.shotR) {
        s.life = 0; hit = true;
        if (!s.ghost) hitRock(W, k, s.x - s.vx * 0.02, s.z - s.vz * 0.02, s.pid);
        W.ev.push({ k: 'hitrock', x: s.x, z: s.z, rid: k.id, a: Math.atan2(-s.vz, -s.vx) });
        break;
      }
    }
    if (hit) continue;
    for (const e of W.enemies) {
      if (e.hp <= 0) continue;
      if (hyp(wd(e.x - s.x), wd(e.z - s.z)) < e.r + F.shotR) { s.life = 0; if (!s.ghost) damage(W, e, 1, s.pid, 'shot'); else W.ev.push({ k: 'hit', x: s.x, z: s.z, type: e.type }); break; }
    }
    if (s.life <= 0 || !C || C.st === 'gone') continue;
    if (hyp(wd(C.x - s.x), wd(C.z - s.z)) < C.hitR + 0.4) { s.life = 0; W.ev.push({ k: 'plink', x: s.x, z: s.z }); }
  }
  W.shots = W.shots.filter((s) => s.life > 0);
}
function bolts(W, dt) {
  const C = W.C;
  for (const b of W.bolts) {
    b.life -= dt;
    b.x = wp(b.x + b.vx * dt); b.z = wp(b.z + b.vz * dt);
    if (b.life <= 0) continue;
    for (const k of W.rocks) {
      if (hyp(wd(k.x - b.x), wd(k.z - b.z)) < k.r + b.r * 0.5) { b.life = 0; W.ev.push({ k: 'boltrock', x: b.x, z: b.z }); break; }
    }
    if (b.life <= 0) continue;
    if (C && C.st !== 'gone' && hyp(wd(C.x - b.x), wd(C.z - b.z)) < C.hitR) { b.life = 0; continue; }
    // charges in flight
    for (const q of W.bombs) {
      if (q.life > 0 && hyp(wd(q.x - b.x), wd(q.z - b.z)) < b.r + F.bombR) { b.life = 0; popBomb(W, q, 'shot'); break; }
    }
    if (b.life <= 0 || b.ab) continue;
    for (const p of W.players) {
      if (!p.alive || p.inv > 0) continue;
      if (hyp(wd(p.x - b.x), wd(p.z - b.z)) < F.r + b.r) { b.life = 0; hurt(W, p, 'bolt', b.x - b.vx * 0.1, b.z - b.vz * 0.1); break; }
    }
  }
  W.bolts = W.bolts.filter((b) => b.life > 0);
}
function popBomb(W, q, why) {
  q.life = 0;
  W.stats.popped++;
  W.ev.push({ k: 'bombpop', x: q.x, z: q.z, why });
  splash(W, q);
}
function splash(W, q) {
  if (q.ghost) return;
  for (const e of W.enemies) if (e.hp > 0 && hyp(wd(e.x - q.x), wd(e.z - q.z)) < F.bombSplash) damage(W, e, 9, q.pid, 'bomb');
}
function bombTarget(W, b) {
  const C = W.C;
  if (C && C.st !== 'gone' && C.st !== 'dying' && hyp(wd(C.x - b.x), wd(C.z - b.z)) < F.bombLock) return -1;
  let best = 0, bs = 1e9;
  for (const e of W.enemies) {
    if (e.hp <= 0 || e.born > 0) continue;
    const dx = wd(e.x - b.x), dz = wd(e.z - b.z), d = hyp(dx, dz);
    if (d > 48) continue;
    const da = Math.abs(angDiff(b.a, Math.atan2(dz, dx)));
    if (da > 1.2) continue;
    const s = d + da * 20 - (e.type === 'reaver' ? 8 : 0);
    if (s < bs) { bs = s; best = e.id; }
  }
  return best;
}
function bombs(W, dt) {
  const C = W.C;
  for (const b of W.bombs) {
    b.life -= dt;
    b.think -= dt;
    if (b.think <= 0) { b.think = 0.25; b.tgt = bombTarget(W, b); }
    let tx = null, tz = null;
    if (b.tgt === -1 && C && C.st !== 'gone') { tx = wd(C.x - b.x); tz = wd(C.z - b.z); }
    else if (b.tgt > 0) { const e = W.enemies.find((q) => q.id === b.tgt); if (e) { tx = wd(e.x - b.x); tz = wd(e.z - b.z); } else b.tgt = 0; }
    if (tx !== null) { const want = Math.atan2(tz, tx), tr = F.bombTurn * dt; b.a += clamp(angDiff(b.a, want), -tr, tr); }
    b.sp = Math.min(b.max, b.sp + F.bombAcc * dt);
    b.x = wp(b.x + Math.cos(b.a) * b.sp * dt); b.z = wp(b.z + Math.sin(b.a) * b.sp * dt);
    if (b.life <= 0) { W.ev.push({ k: 'bombpop', x: b.x, z: b.z, why: 'fuel' }); continue; }
    if (b.ghost) continue;
    // machines in the way take the blast
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0.3) continue;
      if (hyp(wd(e.x - b.x), wd(e.z - b.z)) < e.r + F.bombR) { b.life = 0; W.ev.push({ k: 'bombpop', x: b.x, z: b.z, why: 'machine' }); damage(W, e, 9, b.pid, 'bomb'); splash(W, b); break; }
    }
    if (b.life <= 0) continue;
    if (C && C.st !== 'gone' && hyp(wd(C.x - b.x), wd(C.z - b.z)) < C.hitR + F.bombR + 0.4) { b.life = 0; bombConstruct(W, C, b); splash(W, b); }
  }
  W.bombs = W.bombs.filter((b) => b.life > 0);
}

// ------------------------------------------------------------------ contacts
function contacts(W, dt) {
  const C = W.C;
  for (const p of W.players) {
    if (!p.alive || p.remote) continue;
    // rocks are solid: the ship glances off
    for (const k of W.rocks) {
      const dx = wd(p.x - k.x), dz = wd(p.z - k.z), d = hyp(dx, dz), m = k.r + F.r * 0.85;
      if (d < m && d > 1e-6) {
        const nx = dx / d, nz = dz / d;
        p.x = wp(k.x + nx * m); p.z = wp(k.z + nz * m);
        const vn = (p.vx - k.vx) * nx + (p.vz - k.vz) * nz;
        if (vn < 0) { p.vx -= 1.5 * vn * nx; p.vz -= 1.5 * vn * nz; if (vn < -6) W.ev.push({ k: 'bump', pid: p.id, x: p.x, z: p.z, v: -vn }); }
      }
    }
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0) continue;
      const dx = wd(p.x - e.x), dz = wd(p.z - e.z), d = hyp(dx, dz), m = e.r + F.r * 0.8;
      if (d >= m || d < 1e-6) continue;
      const nx = dx / d, nz = dz / d;
      if (e.type === 'gath') { e.x = wp(p.x - nx * m); e.z = wp(p.z - nz * m); e.vx -= nx * 6; e.vz -= nz * 6; }
      else if (W.tutorial && W.secT < TUTOR.safe) { e.x = wp(p.x - nx * m); e.z = wp(p.z - nz * m); }
      else { hurt(W, p, 'ram', e.x, e.z); damage(W, e, 2, p.id, 'ram'); }
    }
    if (C && C.st !== 'gone') {
      const dx = wd(p.x - C.x), dz = wd(p.z - C.z), d = hyp(dx, dz), m = C.hitR + F.r * 0.8;
      if (d < m && d > 1e-6) {
        const nx = dx / d, nz = dz / d;
        if (isAwake(C) && C.st !== 'wake') hurt(W, p, 'construct', C.x, C.z, W.sector >= 2 || W.mode === 'deep');
        if (p.alive) { p.x = wp(C.x + nx * m); p.z = wp(C.z + nz * m); const vn = (p.vx - C.vx) * nx + (p.vz - C.vz) * nz; if (vn < 0) { p.vx -= 1.6 * vn * nx; p.vz -= 1.6 * vn * nz; } }
      }
    }
  }
  void dt;
}

// ------------------------------------------------------------------ online helpers
// the host carries out what the guest reports: a crystal it scooped, a charge it launched, a pod it took
export function netCollect(W, cid, p) {
  const c = W.crystals.find((q) => q.id === cid && !q.held && q.life > 0);
  if (!c || !p.alive) return;
  const remote = p.remote; p.remote = false;
  collect(W, c, p);
  p.remote = remote;
}
export function netBomb(W, p, x, z, a) {
  if (!p.alive || p.bombs <= 0) return;
  p.bombs--;
  const rk = 1 + 0.12 * (W.up.rack || 0);
  W.bombs.push({ id: W.nextId++, pid: p.id, x: wp(x), z: wp(z), a, sp: F.bombV0 + 6, max: F.bombV * rk, life: F.bombLife, tgt: 0, think: 0 });
  W.stats.bombs++;
}
export function netPod(W, id, p) {
  const q = W.pods.find((o) => o.id === id);
  if (!q) return;
  q.life = 0; addScore(W, SCORE.pod); W.stats.pods++;
  W.ev.push({ k: 'pickup', pid: p.id, x: q.x, z: q.z, kind: q.kind, remote: 1 });
}
export function netDeath(W, p, cause) {
  if (!p.alive) return;
  p.alive = false; p.deadT = 0; p.pull = 0;
  W.lives = Math.max(0, W.lives - 1);
  W.stats.deaths++; W.stats.cpDeaths[W.cp]++; W.lastDeathN = W.n;
  W.ev.push({ k: 'death', pid: p.id, x: p.x, z: p.z, vx: 0, vz: 0, cause: cause || 'bolt', remote: 1, lives: W.lives });
  if (cause === 'construct' && W.C && isAwake(W.C)) { W.C.st = 'digest'; W.C.stT = 3.6; }
}
// the guest adopts the host's checkpoint so its ramp (bolt speeds, tells) matches
export function adoptCp(W, cp, k, level) {
  if (W.cp !== cp || W.k !== k || (W.mode === 'deep' && Math.abs(W.level - level) > 0.05)) { W.cp = cp; W.k = k; if (W.mode === 'deep') W.fightT = W.fightT; W.R = ramp(W); }
}
