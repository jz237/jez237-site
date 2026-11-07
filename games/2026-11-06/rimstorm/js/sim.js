// Rimstorm 2026 simulation: fixed 120 Hz steps, all randomness from the world's own seeded generator
// (state in W.rs; W.rand is a non-enumerable helper re-attached on clone), plain data only, so a world
// can be cloned and re-run bit for bit (replays, online, tests). Nothing in here touches the DOM, WebGL
// or audio; it only pushes events into W.ev. Nothing outside step() changes W.
//
// A web is a ring (closed) or a strip (open) of lanes running from the near rim (d = 0) to the far end of
// the tube (d = 1). A lane coordinate puts lane i's centre on the integer i and its borders on i +- 0.5.
import { F, STEP, SECTORS, WEBS, SHAPES, rampAt, rampLevel, endlessLevel, ENDLESS, ENDLESS_SHAPES, ENEMY, BOSSES, BOSS_KEYS, SCORE, START_LIVES, INTRO, introduced, DIFFICULTY, applyDiff, POWERUPS, PW_KEYS, DROP } from './config.js?v=7';
export { STEP };

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ------------------------------------------------------------------ seeded randomness (state lives in W.rs)
export function rand(W) {
  const s = (W.rs = (W.rs + 0x6D2B79F5) | 0);
  let t = Math.imul(s ^ (s >>> 15), s | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rr = (W, a, b) => a + (b - a) * rand(W);
const ri = (W, n) => Math.floor(rand(W) * n);
function pickW(W, mix) {
  let tot = 0;
  for (const k in mix) tot += mix[k];
  let x = rand(W) * tot;
  for (const k in mix) { x -= mix[k]; if (x <= 0) return k; }
  return Object.keys(mix)[0];
}
// W.rand(): a convenience that is not part of the cloned state
export function attach(W) { Object.defineProperty(W, 'rand', { value: () => rand(W), enumerable: false, configurable: true, writable: true }); return W; }

// ------------------------------------------------------------------ lane maths
export const wrapL = (W, l) => (W.closed ? ((l % W.nl) + W.nl) % W.nl : clamp(l, 0, W.nl - 1));
// signed shortest distance from lane coordinate a to b
export function laneDist(W, a, b) {
  let d = b - a;
  if (W.closed) { const n = W.nl; d = ((d % n) + n) % n; if (d > n / 2) d -= n; }
  return d;
}
export const laneOf = (W, x) => wrapL(W, Math.round(x));
const near = (W, a, b, w = 0.5) => Math.abs(laneDist(W, a, b)) < w;

// ------------------------------------------------------------------ world
export function makeWorld(o = {}) {
  const seed = (o.seed ?? 1) | 0;
  const mode = o.mode || 'campaign';
  const diff = DIFFICULTY[o.diff] ? o.diff : 'normal';
  const W = {
    n: 0, t: 0, seed, rs: (seed ^ 0x51ED270B) | 0, mode, diff, sector: o.sector || 0, k: o.sector || 0, web: o.web || 0, webN: 0, up: { ...(o.up || {}) }, demo: !!o.demo, coop: !!o.coop,
    lives: o.lives ?? START_LIVES + DIFFICULTY[diff].lives, score: o.score || 0, nextLife: 0, lifePts: 0,
    phase: 'intro', phaseT: 0, waveT: 0, secT: 0, fightT: 0, diveT: 0, diveDur: 3, R: null,
    def: null, shape: 'circle', nl: 16, closed: true, rot: 0, breathe: 0, spine: [],
    players: [], enemies: [], shots: [], bolts: [], zaps: [], pods: [], droids: [], boss: null,
    spawnQ: [], nextId: 1, ev: [], over: false, result: null, claims: [], net: null, lastDeathN: -1, hint: mode === 'campaign' && !o.demo && (o.sector || 0) === 0 && (o.web || 0) === 0 && !o.noTut,
    stats: { kills: 0, shots: 0, hits: 0, deaths: 0, purges: 0, pods: 0, webDeaths: {}, webTries: {}, webHits: {}, bossT: 0, dives: 0, chips: 0 },
    tut: {},
  };
  attach(W);
  const LE = SCORE.lifeEvery * DIFFICULTY[diff].score;
  W.lifePts = W.score;
  W.nextLife = (Math.floor(W.lifePts / LE) + 1) * LE;
  const n = o.coop ? 2 : 1;
  for (let i = 0; i < n; i++) W.players.push(makePlayer(i + 1));
  startWeb(W, true);
  return W;
}
function makePlayer(id) {
  return { id, pos: 0, aim: 0, tgt: 0, lane: 0, d: 0, alive: true, inv: 0, deadT: 0, fireT: 0, plate: 0, purges: 1, partials: 1, hop: 0, hops: 0, drag: 0, holdT: 0, mDir: 0,
    input: { mx: 0, dx: 0, fire: false, purge: false, hop: false }, purgeHeld: false, hopHeld: false, remote: false, pw: {}, tilt: 0, vel: 0, shotN: 0 };
}
export const cloneWorld = (W) => attach(structuredClone(W));
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
export const isBossWeb = (W) => (W.mode === 'campaign' ? W.web >= WEBS : !!W.bossWeb);
export const webLabel = (W) => (W.mode === 'campaign' ? (W.web >= WEBS ? 'BOSS' : `WEB ${W.web + 1}`) : `WEB ${W.webN + 1}`);
const alive = (W) => W.players.filter((p) => p.alive);
export const D_OF = (W) => DIFFICULTY[W.diff] || DIFFICULTY.normal;
export function addScore(W, n) { const b = Math.round(n * D_OF(W).score); W.score += b; W.lifePts += b; }
function tut(W, key) { if (W.tut[key] || W.demo) return; W.tut[key] = 1; W.ev.push({ k: 'tut', key }); }
export const bossKey = (W) => (W.mode === 'campaign' ? SECTORS[W.sector].boss : BOSS_KEYS[Math.max(0, Math.floor((W.webN + 1) / ENDLESS.bossEvery) - 1) % BOSS_KEYS.length]);

// the web to build: the campaign follows the sector's list, ENDLESS DESCENT cycles shapes and speeds up the motion
function webDef(W) {
  if (W.mode === 'campaign') { const S = SECTORS[W.sector]; return W.web >= WEBS ? S.bossWeb : S.webs[W.web]; }
  const lvl = endlessLevel(W.fightT);
  if (W.bossWeb) return SECTORS[BOSS_KEYS.indexOf(bossKey(W))].bossWeb;
  const shape = ENDLESS_SHAPES[W.webN % ENDLESS_SHAPES.length];
  return { shape, rot: lvl > 2 && W.webN % 3 === 1 ? 0.04 * lvl : 0, breathe: lvl > 2.5 && W.webN % 3 === 2 ? 0.05 : 0 };
}

// ------------------------------------------------------------------ webs
function startWeb(W, first = false) {
  const camp = W.mode === 'campaign';
  if (!camp) {
    W.bossWeb = W.webN > 0 && (W.webN + 1) % ENDLESS.bossEvery === 0;
    W.k = Math.floor(W.webN / WEBS) % 5;
    W.R = applyDiff(rampLevel(endlessLevel(W.fightT)), W.diff);
  } else W.R = applyDiff(rampAt(W.sector, Math.min(W.web, WEBS - 1)), W.diff);
  const def = webDef(W), S = SHAPES[def.shape] || SHAPES.circle;
  const oldN = W.nl, oldClosed = W.closed;
  W.def = { shape: def.shape, rot: def.rot || 0, breathe: def.breathe || 0 };
  W.shape = def.shape; W.nl = S.n; W.closed = S.closed;
  W.spine = new Array(W.nl).fill(1);
  W.phase = 'intro'; W.phaseT = first ? F.intro + 0.4 : F.intro; W.waveT = 0;
  W.enemies = []; W.bolts = []; W.zaps = []; W.shots = []; W.pods = []; W.droids = []; W.boss = null; W.spawnQ = [];
  W.webStats = { deaths: 0, shots: 0, hits: 0 };
  // keep each Rimrunner about where it was on the new web
  W.players.forEach((p, i) => {
    let L;
    if (first) L = W.closed ? (W.players.length > 1 ? (i ? Math.round(W.nl / 2) : 0) : 0) : Math.floor(W.nl / 2) + (W.players.length > 1 ? (i ? 2 : -2) : 0);
    else L = Math.round((p.pos / Math.max(1, oldClosed ? oldN : oldN - 1)) * (W.closed ? W.nl : W.nl - 1));
    L = wrapL(W, L);
    p.pos = p.aim = p.tgt = p.lane = L; p.d = 0; p.drag = 0; p.vel = 0;
    p.purges = 1; p.partials = 1 + (W.up.purge || 0);
    p.plate = W.up.plate || 0;   // the shield plate refits on every web (refits every other web, or on a timer, made a sawtooth death curve)
    if (W.up.droid && p.alive) W.droids.push({ id: W.nextId++, pid: p.id, lane: L, t: F.droidT, fireT: 0.5 });
  });
  if (isBossWeb(W)) { W.ev.push({ k: 'bosswarn', key: bossKey(W) }); W.phaseT += 0.8; }
  else planWeb(W);
  W.ev.push({ k: 'web', web: W.web, n: W.webN, label: webLabel(W), boss: isBossWeb(W), shape: W.shape });
  if (W.hint && W.web === 0) tut(W, 'controls');
}

// the web's arrival plan: enemies emerge from the far end in random lanes, never more than R.active at once
function planWeb(W) {
  const R = W.R, s = W.sector, w = Math.min(W.web, WEBS - 1), camp = W.mode === 'campaign';
  const allowed = {};
  for (const k in R.mix) if (!camp || introduced(k, s, w)) allowed[k] = R.mix[k];
  const fresh = camp ? Object.keys(INTRO).filter((k) => INTRO[k][0] === s && INTRO[k][1] === w && R.mix[k] && k !== 'splitter' && k !== 'hopper') : [];
  const Q = [];
  let t = 0.5;
  // the opening: two arrivals close together so the web is busy from the start
  for (let i = 0; i < R.count; i++) {
    let type = pickW(W, allowed);
    if (i < fresh.length) type = fresh[i];
    Q.push({ t, type, lane: ri(W, W.nl), tut: i < fresh.length ? type : null });
    t += i < 2 ? R.gap * 0.45 : R.gap * rr(W, 0.75, 1.25);
  }
  W.spawnQ = Q;
}

// ------------------------------------------------------------------ the step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  const guest = W.net === 'guest';
  W.phaseT -= dt;
  W.rot += (W.def.rot || 0) * dt;
  W.breathe = W.def.breathe ? Math.sin(W.t * 1.3) * W.def.breathe : 0;
  if (guest) {
    // the host runs the web; a guest only moves its own Rimrunner and its (harmless) shots
    for (const p of W.players) if (!p.remote) player(W, p, dt);
    shots(W, dt);
    guestDrift(W, dt);
    return;
  }
  if (W.phase === 'intro') {
    if (W.phaseT <= 0) {
      W.phase = 'fight'; W.waveT = 0;
      const key = W.mode === 'campaign' ? W.web : 'E';
      W.stats.webTries[key] = (W.stats.webTries[key] || 0) + 1;
      if (isBossWeb(W)) startBoss(W);
    }
  } else if (W.phase === 'fight') {
    W.waveT += dt; W.fightT += dt;
    spawns(W);
  } else if (W.phase === 'dive') {
    dive(W, dt);
  } else if (W.phase === 'clear') {
    if (W.phaseT <= 0) {
      if (W.mode === 'campaign') { W.over = true; W.result = 'clear'; W.ev.push({ k: 'sectorclear', sector: W.sector }); return; }
      beginDive(W);
    }
  }
  if (W.mode === 'campaign' && W.phase !== 'clear') W.secT += dt;
  for (const p of W.players) player(W, p, dt);
  bolts(W, dt);
  for (const e of W.enemies) enemy(W, e, dt);
  if (W.boss) boss(W, W.boss, dt);
  shots(W, dt);
  zaps(W, dt);
  pods(W, dt);
  droids(W, dt);
  W.enemies = W.enemies.filter((e) => e.hp > 0 && !e.gone);
  // web cleared?
  if (W.phase === 'fight' && !W.spawnQ.length && !W.boss && !W.enemies.length && !isBossWeb(W)) webClear(W);
  if (W.lifePts >= W.nextLife) { W.lives++; W.nextLife += SCORE.lifeEvery * D_OF(W).score; W.ev.push({ k: 'life' }); }
  if (W.lives <= 0 && !W.players.some((p) => p.alive) && W.players.every((p) => p.deadT > 1.8)) { W.over = true; W.result = 'over'; W.ev.push({ k: 'over' }); }
}

function spawns(W) {
  const R = W.R;
  if (!W.spawnQ.length) return;
  const q = W.spawnQ[0];
  if (W.waveT < q.t) return;
  if (W.enemies.length >= R.active) { q.t = W.waveT + 0.25; for (let i = 1; i < W.spawnQ.length; i++) W.spawnQ[i].t = Math.max(W.spawnQ[i].t, q.t + i * 0.2); return; }
  W.spawnQ.shift();
  const e = addEnemy(W, q.type, q.lane, 1);
  W.ev.push({ k: 'emerge', id: e.id, type: q.type, lane: q.lane });
  if (q.tut) tut(W, q.tut);
}

export function addEnemy(W, type, lane, d = 1) {
  const E = ENEMY[type];
  const up = type === 'mite' ? 0 : type === 'lancer' || type === 'shocker' || type === 'spinewright' ? W.R.hpB : W.R.hpS;
  const hp = E.hp + Math.floor(up) + (up % 1 > 0 && rand(W) < up % 1 ? 1 : 0);
  const e = { id: W.nextId++, type, lane: wrapL(W, lane), d, hp, max: hp, t: 0, st: 0, state: 'climb', rim: false, fl: null, tell: 0, grabT: 0, fireT: 0, shotsLeft: 0, hover: 0, hitT: 0, born: 0.6, sh: 0, goal: 0, cool: 0, boss: false, zapN: 0, pounce: 0, pl: 0, tellT: 0 };
  if (type === 'mite') { e.lane = W.closed ? wrapL(W, Math.round(lane) + 0.5) : clamp(Math.round(lane) + 0.5, 0.5, W.nl - 1.5); e.st = rr(W, E.cross[0], E.cross[1]); }
  if (type === 'hopper') e.st = rr(W, E.climbFlip[0], E.climbFlip[1]);
  if (type === 'lancer') { e.hover = rr(W, E.hover[0], E.hover[1]); e.shotsLeft = E.shots; e.fireT = rr(W, 0.8, 1.4) / Math.max(0.05, W.R.fire); }
  if (type === 'shocker') { e.hover = rr(W, E.hover[0], E.hover[1]); e.st = rr(W, 0.6, 1.1) * W.R.shock; }
  if (type === 'spinewright') e.hover = clamp(1 - W.R.spine * rr(W, 0.8, 1.05), 0.2, 0.85);
  if (type === 'mirror') e.sh = E.shield;
  W.enemies.push(e);
  return e;
}

// ------------------------------------------------------------------ Rimrunners
function player(W, p, dt) {
  if (!p.alive) {
    p.deadT += dt;
    if (p.drag > 0) { p.drag = Math.min(1, p.drag + dt / F.dragT); p.d = p.drag; }
    if (W.net === 'guest' && p.id === 2) return;
    const wait = p.dragDeath ? F.dragT + 0.3 : F.respawn;
    if (p.deadT >= wait && W.lives > W.players.filter((q) => q.alive).length && W.phase !== 'clear') respawn(W, p);
    return;
  }
  p.inv = Math.max(0, p.inv - dt);
  p.fireT -= dt;
  for (const k in p.pw) { p.pw[k] -= dt; if (p.pw[k] <= 0) { delete p.pw[k]; W.ev.push({ k: 'pwend', pid: p.id, kind: k }); } }
  const I = p.input || {};
  // lane control: a held direction steps one lane at once and then spins on; a spinner (mouse / touch drag)
  // moves the wanted lane directly. The Rimrunner glides to the lane it wants.
  const mx = +I.mx || 0, dx = +I.dx || 0;
  const s = Math.abs(mx) > 0.15 ? Math.sign(mx) : 0;
  if (s) {
    if (p.mDir !== s) { p.aim = p.tgt + s; p.holdT = 0; }
    else { p.holdT += dt; if (p.holdT > 0.17) p.aim += mx * F.spin * dt; }
  } else if (p.mDir) p.aim = p.tgt;
  p.mDir = s;
  if (dx) p.aim += clamp(dx, -F.dxMax, F.dxMax);
  if (W.boss && W.boss.pull && W.boss.pull.t > 0) { const v = Math.sign(laneDist(W, p.pos, W.boss.pull.lane)) * W.boss.pull.v * dt; p.aim += v; p.pos += v; }
  if (W.closed) { p.aim = ((p.aim % W.nl) + W.nl) % W.nl; if (Math.abs(laneDist(W, p.pos, p.aim)) > 2.5) p.aim = wrapL(W, p.pos + Math.sign(laneDist(W, p.pos, p.aim)) * 2.5); }
  else { p.aim = clamp(p.aim, -0.45, W.nl - 0.55); if (Math.abs(p.aim - p.pos) > 2.5) p.aim = p.pos + Math.sign(p.aim - p.pos) * 2.5; }
  if (Math.abs(laneDist(W, p.tgt, p.aim)) > 0.55) p.tgt = laneOf(W, p.aim);
  const dist = laneDist(W, p.pos, p.tgt), stp = F.glide * dt;
  const mv = clamp(dist, -stp, stp);
  p.pos = W.closed ? (((p.pos + mv) % W.nl) + W.nl) % W.nl : clamp(p.pos + mv, 0, W.nl - 1);
  p.vel = mv / dt;
  p.tilt += (clamp(p.vel / F.glide, -1, 1) - p.tilt) * Math.min(1, dt * 10);
  p.lane = laneOf(W, p.pos);
  // hop: clear of the rim for a moment
  if (I.hop && !p.hopHeld && p.hops > 0 && p.hop <= 0 && W.phase !== 'dive') { p.hops--; p.hop = F.hopT; W.ev.push({ k: 'hop', pid: p.id, lane: p.lane }); }
  p.hopHeld = !!I.hop;
  if (p.hop > 0) p.hop = Math.max(0, p.hop - dt);
  // PURGE: the first one each web wipes the web, the next ones only clear the rim
  if (I.purge && !p.purgeHeld && W.phase !== 'intro') {
    if (p.purges > 0) { p.purges--; purge(W, p, true); }
    else if (p.partials > 0) { p.partials--; purge(W, p, false); }
  }
  p.purgeHeld = !!I.purge;
  if (I.fire && p.fireT <= 0 && W.phase !== 'intro') fire(W, p);
}
export const shotDmg = (W, p) => (1 + 0.25 * (W.up.barrel || 0)) * (p && p.pw.twin ? 2 : 1);
export function fireCD(W, p) { return F.fireCD * [1, 0.86, 0.74, 0.64][W.up.rate || 0] * (p && p.pw.rapid ? 0.55 : 1); }
function fire(W, p) {
  const mine = W.shots.reduce((n, s) => n + (s.pid === p.id && !s.droid ? 1 : 0), 0);
  if (mine >= F.maxShots + (W.up.rate || 0) + (p.pw.rapid ? 4 : 0)) return;
  p.fireT = fireCD(W, p);
  const b = W.up.barrel || 0;
  W.shots.push({ id: W.nextId++, pid: p.id, lane: p.lane, d: p.d, v: F.shotV * (1 + 0.18 * b), dmg: shotDmg(W, p), pierce: b >= 2 ? 1 : 0, twin: p.pw.twin ? 1 : 0, ghost: W.net === 'guest' });
  p.shotN++;
  W.stats.shots++; W.webStats.shots++;
  W.ev.push({ k: 'fire', pid: p.id, lane: p.lane, d: p.d, twin: !!p.pw.twin });
}
export function purge(W, p, full) {
  W.stats.purges++;
  W.ev.push({ k: 'purge', pid: p.id, full, lane: p.lane });
  for (const e of W.enemies) if (e.hp > 0 && (full || e.d < 0.45)) kill(W, e, p.id, 'purge');
  W.bolts = W.bolts.filter((b) => !(full || b.d < 0.6));
  if (full) W.zaps = [];
  const B = W.boss;
  if (B && full && B.state === 'fight') {
    hitBoss(W, B, B.max * 0.08, p.id, p.lane, true);
    if (B.segs) { let n = 2; for (let i = 0; i < B.segs.length && n > 0; i++) if (B.segs[(i * 5) % B.segs.length] > 0) { B.segs[(i * 5) % B.segs.length] = 0; n--; } }
    for (const h of B.heads) if (h.hp > 0) h.hp = Math.max(1, h.hp - h.max * 0.5);
  }
}

// a hit on a Rimrunner: a shield plate soaks it, otherwise it is lost
function hurt(W, p, cause, src) {
  if (!p.alive || p.inv > 0) return false;
  if (W.net === 'guest' && p.id === 2) return false;
  if (p.plate > 0) { p.plate--; p.inv = 1.1; W.ev.push({ k: 'plate', pid: p.id, cause, lane: p.lane, src: src ? src.id : null }); if (src) src.gone = true; return true; }
  p.alive = false; p.deadT = 0; p.hop = 0;
  p.dragDeath = cause === 'grab';
  p.drag = cause === 'grab' ? 0.001 : 0;
  W.lives = Math.max(0, W.lives - 1);
  W.stats.deaths++; W.webStats.deaths++;
  const key = W.mode === 'campaign' ? W.web : 'E';
  W.stats.webDeaths[key] = (W.stats.webDeaths[key] || 0) + 1;
  W.lastDeathN = W.n;
  W.ev.push({ k: 'death', pid: p.id, cause, lane: p.lane, d: p.d, lives: W.lives, src: src ? src.id : null });
  for (const q of W.droids) if (q.pid === p.id) q.t = Math.min(q.t, 0.5);
  return true;
}
function respawn(W, p) {
  p.alive = true; p.inv = F.inv; p.deadT = 0; p.drag = 0; p.dragDeath = false; p.fireT = 0.3; p.pw = {};
  p.d = W.phase === 'dive' ? p.d : 0;
  if (W.phase !== 'dive') p.d = 0;
  p.aim = p.tgt = p.pos = p.lane;
  // everything near the rim is thrown back down the tube
  for (const e of W.enemies) if (e.d < 0.3) { e.d = F.clearD; e.rim = false; e.fl = null; e.tell = 0; e.grabT = 0; e.pounce = 0; e.pl = 0; if (e.type === 'mite') e.lane = wrapL(W, Math.floor(e.lane) + 0.5); }
  W.bolts = W.bolts.filter((b) => b.d > 0.5);
  W.zaps = [];
  W.ev.push({ k: 'spawn', pid: p.id, lane: p.lane });
}

// ------------------------------------------------------------------ enemies
const nearestPlayer = (W, lane) => {
  let best = null, bd = 1e9;
  for (const p of W.players) { if (!p.alive || p.drag) continue; const d = Math.abs(laneDist(W, lane, p.pos)); if (d < bd) { bd = d; best = p; } }
  return best;
};
const towardDir = (W, from, p) => { if (!p) return rand(W) < 0.5 ? -1 : 1; const d = laneDist(W, from, p.pos); return d > 0 ? 1 : d < 0 ? -1 : (rand(W) < 0.5 ? -1 : 1); };
// lane flips: a crouch (the tell) and then a hop into the next lane
function startFlip(W, e, dir, tell, T) {
  let b = e.lane + dir;
  if (!W.closed && (b < -1e-6 || b > W.nl - 1 + 1e-6)) b = e.lane - dir;
  e.tell = tell; e.fl = { a: e.lane, b, t: 0, T };
}
function flipping(W, e, dt) {
  if (!e.fl) return false;
  if (e.tell > 0) { e.tell -= dt; return true; }
  e.fl.t += dt;
  const f = Math.min(1, e.fl.t / e.fl.T);
  e.lane = e.fl.a + (e.fl.b - e.fl.a) * f;
  if (f >= 1) { e.lane = wrapL(W, e.fl.b); e.fl = null; if (e.pounce) e.pl = 1; e.pounce = 0; }
  else if (W.closed) e.lane = ((e.lane % W.nl) + W.nl) % W.nl;
  return true;
}
function enemy(W, e, dt) {
  if (e.hp <= 0 || e.gone) return;
  const R = W.R, E = ENEMY[e.type], v = E.v * R.spd;
  e.t += dt; e.born = Math.max(0, e.born - dt); e.hitT = Math.max(0, e.hitT - dt);
  if (W.phase !== 'fight') return;
  if (e.rim) { rimRide(W, e, dt); return; }
  switch (e.type) {
    case 'splitter':
      e.d -= v * dt;
      if (e.d <= E.splitD) split(W, e);
      break;
    case 'hopper':
    case 'mirror':
      if (!flipping(W, e, dt)) {
        e.d -= v * dt;
        if (e.type === 'hopper' && (e.st -= dt) <= 0) {
          e.st = rr(W, E.climbFlip[0], E.climbFlip[1]);
          startFlip(W, e, rand(W) < 0.6 ? towardDir(W, e.lane, nearestPlayer(W, e.lane)) : (rand(W) < 0.5 ? -1 : 1), Math.min(0.35, R.warn * 0.3), E.flipT * 1.3);
          // close to the rim it never hops into a Rimrunner's lane with less than the warning time left to climb
          if (e.fl && e.d < v * R.warn && W.players.some((q) => q.alive && q.lane === laneOf(W, e.fl.b))) { e.fl = null; e.tell = 0; }
        }
      } else e.d -= v * dt * 0.4;
      if (e.d <= 0) toRim(W, e);
      break;
    case 'spinewright': {
      if (e.state === 'climb') {
        e.d -= v * dt;
        const L = laneOf(W, e.lane);
        if (e.d < W.spine[L]) W.spine[L] = Math.max(e.d, 0.05);
        if (e.d <= e.hover) { e.state = 'back'; W.ev.push({ k: 'spine', lane: L, d: e.d }); }
      } else { e.d += E.back * dt; if (e.d >= 1.02) e.gone = true; }
      break;
    }
    case 'mite': {
      const ME = ENEMY.mite;
      if (e.fl) { e.fl.t += dt; const f = Math.min(1, e.fl.t / e.fl.T); e.lane = e.fl.a + (e.fl.b - e.fl.a) * f; if (f >= 1) { e.lane = wrapL(W, e.fl.b); e.fl = null; } else if (W.closed) e.lane = ((e.lane % W.nl) + W.nl) % W.nl; }
      else if ((e.st -= dt) <= 0) { e.st = rr(W, ME.cross[0], ME.cross[1]); startFlip(W, e, towardDir(W, e.lane, nearestPlayer(W, e.lane)), 0, ME.crossT); e.tell = 0; }
      e.d -= v * dt;
      if (e.d <= 0) toRim(W, e);
      break;
    }
    case 'lancer':
      if (flipping(W, e, dt)) break;
      if (e.state === 'climb') { e.d -= v * dt; if (e.d <= e.hover) e.state = e.shotsLeft > 0 ? 'hover' : 'climb'; if (e.d <= 0) toRim(W, e); break; }
      // hovering: charge (the tell), fire a slow bolt up the lane, now and then slide a lane toward you
      e.fireT -= dt;
      if (e.fireT <= R.warn && !e.cool) { e.cool = 1; W.ev.push({ k: 'charge', id: e.id, lane: laneOf(W, e.lane), d: e.d, T: R.warn }); }
      if (e.fireT <= 0) {
        addBolt(W, laneOf(W, e.lane), e.d, R.boltV, 'lance');
        e.shotsLeft--; e.cool = 0;
        e.fireT = (1 / Math.max(0.05, R.fire)) * rr(W, 0.85, 1.2) + R.warn;
        if (e.shotsLeft <= 0) e.state = 'climb', e.hover = -1;
        else if (rand(W) < 0.5) startFlip(W, e, towardDir(W, e.lane, nearestPlayer(W, e.lane)), Math.min(0.4, R.warn * 0.35), 0.3);
      }
      break;
    case 'shocker':
      if (flipping(W, e, dt)) break;
      if (e.state === 'climb') { e.d -= v * dt; if (e.d <= e.hover && e.zapN < 3) e.state = 'hover'; if (e.d <= 0) toRim(W, e); break; }
      if ((e.st -= dt) <= 0) {
        const T = R.warn * 1.25;
        addZap(W, laneOf(W, e.lane), T, ENEMY.shocker.live, 'shock', e.id);
        e.zapN++;
        e.st = R.shock * rr(W, 0.85, 1.15) + T;
        if (e.zapN >= 3) { e.state = 'climb'; e.hover = -1; }
      } else if (e.st > R.warn * 1.25 + 1 && e.st < R.warn * 1.25 + 1 + dt && rand(W) < 0.7) startFlip(W, e, towardDir(W, e.lane, nearestPlayer(W, e.lane)), Math.min(0.4, R.warn * 0.35), 0.32);
      break;
  }
}
function toRim(W, e) {
  // a mite that reaches the rim mid-crossing finishes the crossing there (rimMite carries the flip on)
  e.d = 0; e.rim = true; if (e.type !== 'mite') e.fl = null; e.tell = 0; e.grabT = 0; e.st = W.R.flip * 0.6; e.pounce = 0; e.pl = 0;
  if (e.type === 'mite') e.goal = e.lane;
  W.ev.push({ k: 'rim', id: e.id, type: e.type, lane: laneOf(W, e.lane) });
  tut(W, 'rim');
}
// along the rim: hunt the nearest Rimrunner lane by lane; sitting in its lane for R.grab seconds gets it
function rimRide(W, e, dt) {
  const R = W.R, p = nearestPlayer(W, e.lane);
  if (e.type === 'mite') { rimMite(W, e, dt, p); return; }
  if (flipping(W, e, dt)) { e.grabT = 0; return; }
  if (!p) return;
  const L = laneOf(W, e.lane);
  if (p.lane === L && p.d < 0.05) {
    if (p.inv > 0) { e.grabT = 0; e.pl = 0; return; }
    // a rider that pounced onto the Rimrunner grabs as it lands. Walk into a sitting rider and it needs
    // R.grab plus the time the Rimrunner's gun needs for the hits it takes: shoot at once and you win.
    e.grabT += dt;
    if (e.grabT >= (e.pl ? 0 : R.grab + Math.max(0, Math.ceil(e.hp / shotDmg(W, p) - 1e-9) - 1) * fireCD(W, p))) {
      if (p.hop > 0) { e.d = 0.3; e.rim = false; e.grabT = 0; W.ev.push({ k: 'dodge', pid: p.id, id: e.id }); return; }
      W.ev.push({ k: 'grab', pid: p.id, id: e.id, type: e.type, lane: L });
      if (hurt(W, p, 'grab', e) && !p.alive) e.gone = true;
    }
    return;
  }
  e.grabT = 0; e.pl = 0;
  if ((e.st -= dt) <= 0) {
    e.st = R.flip * rr(W, 0.85, 1.15);
    startFlip(W, e, towardDir(W, e.lane, p), Math.min(0.32, R.warn * 0.28), ENEMY.hopper.flipT);
    // a flip into a Rimrunner's lane is a POUNCE: it crouches for the RAMP warning time (less the hop) with
    // the lane lit under the Rimrunner, then lands on it and grabs at once. Move out, HOP, or get into its
    // lane and shoot it first (airborne riders cannot be hit).
    if (e.fl && W.players.some((q) => q.alive && q.d < 0.05 && q.lane === laneOf(W, e.fl.b))) { e.tell = Math.max(e.tell, R.warn - ENEMY.hopper.flipT); e.tellT = e.tell; e.pounce = 1; }
  }
}
function rimMite(W, e, dt, p) {
  const R = W.R;
  if (e.fl) { e.fl.t += dt; const f = Math.min(1, e.fl.t / e.fl.T); e.lane = e.fl.a + (e.fl.b - e.fl.a) * f; if (f >= 1) { e.lane = wrapL(W, e.fl.b); e.fl = null; } else if (W.closed) e.lane = ((e.lane % W.nl) + W.nl) % W.nl; return; }
  if (e.tell > 0) { e.tell -= dt; if (e.tell <= 0 && p) startFlip(W, e, towardDir(W, e.lane, p) * 0.5, 0, ENEMY.mite.crossT * 0.5); return; }
  if (!p) return;
  const onCentre = Math.abs(e.lane - Math.round(e.lane)) < 0.05;
  if (onCentre) {
    if (laneOf(W, e.lane) === p.lane && p.d < 0.05) {
      if (p.inv > 0) { e.grabT = 0; return; }
      e.grabT += dt;
      if (e.grabT >= R.grab) {
        if (p.hop > 0) { e.d = 0.3; e.rim = false; e.grabT = 0; e.lane = wrapL(W, Math.floor(e.lane) + 0.5); W.ev.push({ k: 'dodge', pid: p.id, id: e.id }); return; }
        W.ev.push({ k: 'arc', pid: p.id, id: e.id, lane: p.lane });
        if (hurt(W, p, 'arc', e) && !p.alive) e.gone = true;
      }
      return;
    }
    // the Rimrunner left: carry on to the next border toward it
    e.grabT = 0;
    startFlip(W, e, towardDir(W, e.lane, p) * 0.5, 0, ENEMY.mite.crossT * 0.5);
    return;
  }
  // on a border: if it is a border of the Rimrunner's lane, crackle (the tell) and step in
  const dist = laneDist(W, e.lane, p.pos);
  if (Math.abs(dist) < 0.75) { e.tell = Math.max(0.2, R.warn * 0.55, R.warn - ENEMY.mite.crossT * 0.5 - R.grab); W.ev.push({ k: 'crackle', id: e.id, lane: e.lane, T: e.tell }); return; }
  if ((e.st -= dt) <= 0) { e.st = R.flip * rr(W, 0.8, 1.1); startFlip(W, e, Math.sign(dist) || 1, 0, ENEMY.mite.crossT); }
}
function split(W, e) {
  e.gone = true;
  W.ev.push({ k: 'split', id: e.id, lane: e.lane, d: e.d });
  const L = laneOf(W, e.lane);
  for (const s of [-1, 1]) {
    const h = addEnemy(W, 'hopper', L, e.d);
    h.boss = e.boss; h.born = 0;
    startFlip(W, h, s, 0, 0.3);
    h.st = rr(W, 0.8, 1.6);
  }
}
function addBolt(W, lane, d, v, kind) {
  W.bolts.push({ id: W.nextId++, lane, d, d0: d, v, kind });
  W.ev.push({ k: 'bolt', lane, d, kind });
}
function addZap(W, lane, tell, live, kind, src = 0) {
  W.zaps.push({ id: W.nextId++, lane: wrapL(W, lane), t: -tell, T: tell, live, kind, src, on: 0 });
  W.ev.push({ k: 'tell', lane: wrapL(W, lane), T: tell, kind });
}

// ------------------------------------------------------------------ damage
const BIG = new Set(['lancer', 'shocker', 'spinewright', 'mirror']);
function damage(W, e, dmg, pid, s) {
  if (e.type === 'mirror' && e.sh > 0) {
    // the mirror's facet sends the first shot back up the lane as a bolt (right at the rim it only
    // shatters: a reflection there could not be dodged)
    e.sh = 0; e.hitT = 0.25;
    if (e.d > 0.12 && e.d >= W.R.boltV * 1.15 * W.R.warn) addBolt(W, laneOf(W, e.lane), e.d, W.R.boltV * 1.15, 'reflect');
    W.ev.push({ k: 'reflect', id: e.id, lane: laneOf(W, e.lane), d: e.d });
    return false;
  }
  e.hp -= dmg; e.hitT = 0.15;
  W.ev.push({ k: 'hit', id: e.id, type: e.type, lane: e.lane, d: e.d, pid });
  if (e.hp <= 0) { kill(W, e, pid, s && s.droid ? 'droid' : 'shot'); return true; }
  return false;
}
function kill(W, e, pid, by) {
  if (e.hp <= -100) return;
  e.hp = -100; e.gone = true;
  W.stats.kills++;
  let pts = ENEMY[e.type].score + (e.rim ? SCORE.rimKill : 0);
  if (e.boss) pts = Math.round(pts * 0.5);
  addScore(W, pts);
  W.ev.push({ k: 'kill', id: e.id, type: e.type, lane: e.lane, d: e.d, pid, by, pts: Math.round(pts * D_OF(W).score), rim: e.rim });
  if (by !== 'purge' && !e.boss) maybeDrop(W, e);
}
function maybeDrop(W, e) {
  if (W.pods.length >= DROP.max || W.mode === 'campaign' && W.sector === 0 && W.web === 0 && W.waveT < DROP.firstWeb) return;
  const ch = (DROP.chance + (BIG.has(e.type) ? DROP.big : 0)) * D_OF(W).drops;
  if (rand(W) >= ch) return;
  let tot = 0;
  for (const k of PW_KEYS) tot += POWERUPS[k].w;
  let x = rand(W) * tot, kind = PW_KEYS[0];
  for (const k of PW_KEYS) { x -= POWERUPS[k].w; if (x <= 0) { kind = k; break; } }
  const lane = laneOf(W, e.lane);
  W.pods.push({ id: W.nextId++, kind, lane, d: Math.max(0.08, e.d), t: 0 });
  W.ev.push({ k: 'pod', kind, lane, d: e.d });
}

// ------------------------------------------------------------------ shots, bolts, lane strikes, pods, droids
function shots(W, dt) {
  const B = W.boss;
  for (const s of W.shots) {
    if (s.gone) continue;
    const d0 = s.d, d1 = s.d + s.v * dt;
    s.d = d1;
    if (s.ghost) { if (d1 > 1.05) s.gone = true; continue; }
    // the nearest thing along the shot's path this tick
    let best = null, bd = 1e9, kind = 0;
    for (const b of W.bolts) {
      if (b.gone || b.lane !== s.lane) continue;
      if (b.d <= d1 + 0.01 && b.d0 >= d0 - 0.01 && b.d < bd) { best = b; bd = b.d; kind = 1; }
    }
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.gone || e.born > 0.45 || e.d > 1.0) continue;
      if (e.rim && e.fl && e.tell <= 0 && e.type !== 'mite') continue;   // a rider in mid-hop is above the rim
      if (e.d < d0 - 0.02 || e.d > d1 + 0.02) continue;
      let ok;
      if (e.type === 'mite') {
        const off = Math.abs(e.lane - Math.round(e.lane));
        ok = (off < ENEMY.mite.hitW && laneOf(W, e.lane) === s.lane) || (s.twin && Math.abs(Math.abs(laneDist(W, s.lane, e.lane)) - 0.5) < 0.12);
      } else ok = near(W, e.lane, s.lane, 0.5);
      if (ok && e.d < bd) { best = e; bd = e.d; kind = 2; }
    }
    const sp = W.spine[s.lane];
    if (sp < 1 && d1 >= sp - 0.005 && d0 <= sp + 0.02 && sp < bd) { best = null; bd = sp; kind = 3; }
    if (B && B.state === 'fight') {
      for (const h of B.heads) if (h.hp > 0 && h.lane === s.lane && d1 >= h.d && h.d < bd) { best = h; bd = h.d; kind = 4; }
      if (d1 >= B.d - 0.01 && B.d < bd) { best = B; bd = B.d; kind = 5; }
    }
    if (kind === 1) { best.gone = true; s.gone = true; if (!s.droid) W.stats.hits++; addScore(W, SCORE.bolt); W.ev.push({ k: 'boltpop', lane: best.lane, d: best.d }); }
    else if (kind === 2) {
      if (!s.droid) { W.stats.hits++; W.webStats.hits++; }
      const killed = damage(W, best, s.dmg, s.pid, s);
      if (killed && s.pierce > 0) s.pierce--; else s.gone = true;
    } else if (kind === 3) {
      s.gone = true; if (!s.droid) W.stats.hits++;
      W.spine[s.lane] = Math.min(1, sp + F.spineChip);
      if (W.spine[s.lane] > 0.985) W.spine[s.lane] = 1;
      W.stats.chips++;
      addScore(W, SCORE.spine);
      W.ev.push({ k: 'chip', lane: s.lane, d: sp, gone: W.spine[s.lane] >= 1 });
    } else if (kind === 4) {
      s.gone = true; if (!s.droid) { W.stats.hits++; W.webStats.hits++; }
      best.hp -= s.dmg; best.hitT = 0.15;
      W.ev.push({ k: 'headhit', lane: s.lane, d: best.d });
      if (best.hp <= 0) { best.hp = 0; best.downT = 0; addScore(W, 600); W.ev.push({ k: 'headdown', lane: best.lane, d: best.d }); }
    } else if (kind === 5) { s.gone = true; shotBoss(W, B, s); }
    if (d1 > 1.05) s.gone = true;
  }
  W.shots = W.shots.filter((s) => !s.gone);
}
function bolts(W, dt) {
  for (const b of W.bolts) {
    b.d0 = b.d; b.d -= b.v * dt;
    if (b.d > 0) continue;
    b.gone = true;
    for (const p of W.players) {
      if (!p.alive || p.lane !== b.lane || p.d > 0.05) continue;
      if (p.hop > 0) { W.ev.push({ k: 'dodge', pid: p.id }); continue; }
      hurt(W, p, b.kind === 'reflect' ? 'reflect' : 'bolt');
    }
    W.ev.push({ k: 'boltrim', lane: b.lane });
  }
  W.bolts = W.bolts.filter((b) => !b.gone);
}
function zaps(W, dt) {
  for (const z of W.zaps) {
    z.t += dt;
    if (z.t >= 0 && !z.on) { z.on = 1; W.ev.push({ k: 'zap', lane: z.lane, kind: z.kind }); }
    if (z.t >= 0 && z.t < z.live) {
      for (const p of W.players) {
        if (!p.alive || p.lane !== z.lane || p.d > 0.1) continue;
        if (p.hop > 0) continue;
        hurt(W, p, z.kind);
      }
    }
    if (z.t >= z.live) z.gone = true;
  }
  W.zaps = W.zaps.filter((z) => !z.gone);
}
function pods(W, dt) {
  for (const q of W.pods) {
    q.t += dt; q.d -= F.podV * dt;
    if (q.d > 0) continue;
    q.gone = true;
    const p = W.players.find((x) => x.alive && x.lane === q.lane);
    if (p) collect(W, q, p); else W.ev.push({ k: 'podlost', lane: q.lane, kind: q.kind });
  }
  W.pods = W.pods.filter((q) => !q.gone);
}
function collect(W, q, p) {
  const P = POWERUPS[q.kind];
  W.stats.pods++;
  if (q.kind === 'droid') { W.droids = W.droids.filter((x) => x.pid !== p.id); W.droids.push({ id: W.nextId++, pid: p.id, lane: p.lane, t: F.droidT, fireT: 0.2 }); }
  else if (q.kind === 'hop') p.hops = Math.min(4, p.hops + 2);
  else p.pw[q.kind] = P.time;
  addScore(W, 200);
  W.ev.push({ k: 'pickup', pid: p.id, kind: q.kind, lane: p.lane });
}
function droids(W, dt) {
  for (const q of W.droids) {
    q.t -= dt;
    if (q.t <= 0) { q.gone = true; W.ev.push({ k: 'droidend', lane: q.lane }); continue; }
    if (W.phase !== 'fight') continue;
    q.fireT -= dt;
    // it zaps any rider sitting in its lane at the rim
    for (const e of W.enemies) if (e.rim && e.hp > 0 && laneOf(W, e.lane) === q.lane && Math.abs(e.lane - Math.round(e.lane)) < 0.2) { kill(W, e, q.pid, 'droid'); W.ev.push({ k: 'droidzap', lane: q.lane }); }
    const want = W.enemies.some((e) => e.hp > 0 && near(W, e.lane, q.lane, 0.5)) || W.bolts.some((b) => b.lane === q.lane) || W.spine[q.lane] < 1 || (W.boss && W.boss.state === 'fight');
    if (q.fireT <= 0 && want) { q.fireT = F.droidCD; W.shots.push({ id: W.nextId++, pid: q.pid, lane: q.lane, d: 0.02, v: F.shotV, dmg: 1, pierce: 0, twin: 0, droid: 1 }); W.ev.push({ k: 'droidfire', lane: q.lane }); }
  }
  W.droids = W.droids.filter((q) => !q.gone);
}

// ------------------------------------------------------------------ web clear and the dive
function webClear(W) {
  const bonus = SCORE.web + SCORE.webStep * (W.mode === 'campaign' ? W.web + W.sector * WEBS : W.webN);
  addScore(W, bonus);
  W.ev.push({ k: 'webclear', web: W.web, bonus: Math.round(bonus * D_OF(W).score), spines: W.spine.filter((x) => x < 1).length });
  beginDive(W);
}
function beginDive(W) {
  W.phase = 'dive'; W.diveT = 0;
  const lvl = W.mode === 'campaign' ? W.sector / 4 : Math.min(1, endlessLevel(W.fightT) / 5);
  W.diveDur = F.dive[0] + (F.dive[1] - F.dive[0]) * lvl;
  W.bolts = []; W.zaps = []; W.pods = [];
  W.droids = [];
  W.diveHit = 0;
  for (const p of W.players) { p.d = 0; p.hop = 0; }
  W.ev.push({ k: 'dive', T: W.diveDur });
  tut(W, 'dive');
}
// diving down the tube: spines left in the lanes are deadly unless shot away or dodged
function dive(W, dt) {
  W.diveT += dt;
  const f = Math.min(1, W.diveT / W.diveDur);
  const dd = Math.pow(f, 1.5) * 1.02;
  for (const p of W.players) {
    if (!p.alive) continue;
    const prev = p.d;
    p.d = dd;
    const sp = W.spine[p.lane];
    if (sp < 1 && prev < sp && p.d >= sp) {
      if (p.inv > 0) { W.spine[p.lane] = 1; W.ev.push({ k: 'chip', lane: p.lane, d: sp, gone: true }); continue; }
      W.diveHit++;
      if (hurt(W, p, 'spine')) { W.spine[p.lane] = 1; W.ev.push({ k: 'chip', lane: p.lane, d: sp, gone: true }); }
    }
  }
  if (f >= 1) {
    W.stats.dives++;
    if (!W.diveHit) { addScore(W, SCORE.dive); W.ev.push({ k: 'diveclean', pts: Math.round(SCORE.dive * D_OF(W).score) }); }
    if (W.mode === 'campaign') W.web++; else W.webN++;
    startWeb(W);
  }
}

// ------------------------------------------------------------------ bosses
function startBoss(W) {
  const key = bossKey(W), C = BOSSES[key], R = W.R;
  const B = { key, hp: R.bossHP, max: R.bossHP, d: 1.3, d0: C.d, state: 'in', t: 0, phase: 1, rot: 0, segs: null, heads: [], eye: null, cur: null, ai: 0, cd: 1.6, hitT: 0, pull: null, stun: 0, exposed: 0, crushT: 0 };
  if (C.armour) { B.segs = []; for (let i = 0; i < W.nl; i++) B.segs.push(C.armour[i % C.armour.length] ? C.segHP : 0); }
  if (C.heads) for (let i = 0; i < C.heads; i++) B.heads.push({ lane: wrapL(W, Math.round((i + 0.5) * W.nl / C.heads)), d: C.d - 0.12, hp: C.headHP, max: C.headHP, hitT: 0, moveT: rr(W, 2.5, 4.5), downT: 0, lunge: 0 });
  if (C.eye) B.eye = { lane: ri(W, W.nl), open: 0, t: C.eye[1] };
  W.boss = B;
  W.ev.push({ k: 'bossin', key });
}
function boss(W, B, dt) {
  const C = BOSSES[B.key], R = W.R;
  B.t += dt; B.hitT = Math.max(0, B.hitT - dt);
  if (B.state === 'in') {
    B.d += (B.d0 - B.d) * Math.min(1, dt * 1.4);
    if (B.d - B.d0 < 0.01) { B.state = 'fight'; W.ev.push({ k: 'bossfight', key: B.key }); }
    return;
  }
  if (B.state === 'dying') {
    B.t += dt;
    if (B.t > 2.4) { W.boss = null; W.phase = 'clear'; W.phaseT = 3.2; }
    return;
  }
  W.stats.bossT += dt;
  // phases
  const f = B.hp / B.max, want = B.key === 'singularity' && f < 0.25 ? 3 : f < 0.55 ? 2 : 1;
  if (want > B.phase) {
    B.phase = want; B.cur = null; B.cd = 1.4; B.stun = 0.8;
    W.zaps = W.zaps.filter((z) => z.t >= 0);
    W.ev.push({ k: 'phase', key: B.key, phase: want });
    if (B.key === 'singularity' && want === 3 && B.segs) B.segs.fill(0);
    if (B.key === 'hydra') for (const h of B.heads) if (h.hp <= 0) { h.hp = h.max; h.downT = 0; }
  }
  if (B.stun > 0) { B.stun -= dt; return; }
  // armour turns; the Furnace Wheel turns back the other way in phase 2
  if (C.rot) B.rot += C.rot[B.phase > 1 ? 1 : 0] * dt;
  // hydra heads sway lane to lane, and grow back after the core has been open a while
  if (B.heads.length) {
    let up = 0;
    for (const h of B.heads) {
      h.hitT = Math.max(0, h.hitT - dt);
      if (h.hp <= 0) { h.downT += dt; continue; }
      up++;
      if (h.lunge > 0) h.lunge = Math.max(0, h.lunge - dt);
      if ((h.moveT -= dt) <= 0) { h.moveT = rr(W, 2.4, 4.4); const nl = wrapL(W, h.lane + (rand(W) < 0.5 ? -1 : 1)); if (!B.heads.some((o) => o !== h && o.hp > 0 && o.lane === nl)) { h.lane = nl; W.ev.push({ k: 'headmove', lane: nl }); } }
    }
    if (!up) {
      B.exposed += dt;
      if (B.exposed > 7.5) { B.exposed = 0; let n = B.phase > 1 ? 3 : 2; for (const h of B.heads) if (h.hp <= 0 && n-- > 0) { h.hp = h.max; h.downT = 0; } W.ev.push({ k: 'regrow' }); }
    } else B.exposed = 0;
  }
  // the Prism Queen's eye: shut, glowing (the tell), open
  if (B.eye) {
    const E = B.eye;
    E.t -= dt;
    if (E.t <= 0) {
      if (E.open) { E.open = 0; E.t = C.eye[1] / R.bossRate; E.lane = wrapL(W, E.lane + (rand(W) < 0.5 ? -1 : 1) * (1 + ri(W, 3))); W.ev.push({ k: 'eyeshut', lane: E.lane }); }
      else { E.open = 1; E.t = C.eye[0]; W.ev.push({ k: 'eyeopen', lane: E.lane }); }
    }
  }
  // the Singularity Engine's last phase: it climbs toward the rim; hits push it back down
  if (B.key === 'singularity' && B.phase === 3) {
    B.d -= C.rise * R.bossRate * dt;
    if (B.d <= 0.14) {
      B.d = 0.5;
      W.ev.push({ k: 'crush' });
      for (const p of W.players) if (p.alive && p.hop <= 0) hurt(W, p, 'crush');
    }
  } else if (B.d < B.d0) B.d = Math.min(B.d0, B.d + 0.05 * dt);
  if (B.pull) { B.pull.t -= dt; if (B.pull.t <= 0) B.pull = null; }
  // attacks, in turn, each telegraphed
  if (B.cur) { act(W, B, dt); return; }
  B.cd -= dt;
  if (B.cd > 0) return;
  const list = B.phase === 3 && C.p3 ? C.p3 : B.phase >= 2 ? C.p2 : C.atk;
  const kind = list[B.ai++ % list.length];
  beginAttack(W, B, kind);
}
function pickLanes(W, n, spread = true) {
  const p = nearestPlayer(W, 0), out = [];
  if (p && rand(W) < 0.65) out.push(p.lane);
  let guard = 0;
  while (out.length < n && guard++ < 50) { const L = ri(W, W.nl); if (!out.includes(L) && (!spread || out.every((o) => Math.abs(laneDist(W, o, L)) >= 2))) out.push(L); }
  return out;
}
function beginAttack(W, B, kind) {
  const R = W.R, T = R.warn * 1.1;
  const C = { kind, t: 0, T, lanes: [], done: false };
  const p = nearestPlayer(W, 0);
  switch (kind) {
    case 'volley': case 'embers': case 'shards':
      C.lanes = pickLanes(W, 2 + B.phase);
      for (const L of C.lanes) W.ev.push({ k: 'tell', lane: L, T, kind: 'volley' });
      break;
    case 'spit':
      C.lanes = B.heads.filter((h) => h.hp > 0).map((h) => h.lane);
      if (!C.lanes.length) C.lanes = pickLanes(W, 2);
      for (const L of C.lanes) W.ev.push({ k: 'tell', lane: L, T, kind: 'volley' });
      break;
    case 'spawn': C.T = 0.7; W.ev.push({ k: 'bossspawn', key: B.key }); break;
    case 'sweep': {
      const start = p ? wrapL(W, p.lane - 3 * (rand(W) < 0.5 ? -1 : 1)) : 0, dir = p ? Math.sign(laneDist(W, start, p.lane)) || 1 : 1, m = 3 + 2 * B.phase;
      for (let i = 0; i < m; i++) { const L = wrapL(W, start + dir * i); if (!W.closed && (start + dir * i < 0 || start + dir * i > W.nl - 1)) break; addZap(W, L, R.warn + i * 0.3, 0.55, 'sweep'); }
      C.T = R.warn + m * 0.3 + 0.6; C.passive = 1;
      break;
    }
    case 'lunge': {
      const heads = B.heads.filter((h) => h.hp > 0);
      if (!heads.length) { C.T = 0.2; C.passive = 1; break; }
      heads.sort((a, b) => Math.abs(laneDist(W, a.lane, p ? p.lane : 0)) - Math.abs(laneDist(W, b.lane, p ? p.lane : 0)));
      const h = heads[0]; h.lunge = R.warn * 1.3 + 0.7;
      addZap(W, h.lane, R.warn * 1.3, 0.7, 'lunge');
      C.T = R.warn * 1.3 + 0.8; C.passive = 1;
      break;
    }
    case 'flare': {
      const c = p ? p.lane : ri(W, W.nl), off = ri(W, 3) - 1;
      for (let i = -1; i <= 1; i++) addZap(W, c + off + i, R.warn * 1.2, 1.0, 'flare');
      C.T = R.warn * 1.2 + 1.0; C.passive = 1;
      break;
    }
    case 'beam':
      for (const L of pickLanes(W, 2 + (B.phase > 1 ? 1 : 0))) addZap(W, L, R.warn * 1.2, 0.85, 'beam');
      C.T = R.warn * 1.2 + 0.9; C.passive = 1;
      break;
    case 'pull': {
      const L = p ? wrapL(W, p.lane + (rand(W) < 0.5 ? -1 : 1) * (4 + ri(W, 2))) : 0;
      C.lanes = [L]; C.T = R.warn;
      W.ev.push({ k: 'tell', lane: L, T: R.warn, kind: 'pull' });
      break;
    }
  }
  B.cur = C;
}
function act(W, B, dt) {
  const C = B.cur, R = W.R, D = BOSSES[B.key];
  C.t += dt;
  if (C.t < C.T) return;
  if (!C.passive) {
    switch (C.kind) {
      case 'volley': case 'embers': case 'shards': case 'spit':
        for (const L of C.lanes) { const h = B.heads.find((q) => q.hp > 0 && q.lane === L); addBolt(W, L, h ? h.d : B.d, R.boltV * (C.kind === 'shards' ? 1.15 : 1), C.kind === 'spit' ? 'spit' : 'boss'); }
        break;
      case 'spawn': {
        const n = Math.min(1 + B.phase, Math.max(0, R.active + 1 - W.enemies.length));
        for (let i = 0; i < n; i++) { const e = addEnemy(W, D.spawn[ri(W, D.spawn.length)], ri(W, W.nl), B.d - 0.05); e.boss = true; e.born = 0.4; W.ev.push({ k: 'emerge', id: e.id, type: e.type, lane: e.lane, boss: true }); }
        break;
      }
      case 'pull':
        B.pull = { lane: C.lanes[0], t: 2.4, v: 2.2 };
        addZap(W, C.lanes[0], 2.4, 0.8, 'pull');
        W.ev.push({ k: 'pull', lane: C.lanes[0] });
        break;
    }
  }
  B.cur = null;
  B.cd = (1.5 / R.bossRate) * rr(W, 0.8, 1.15);
}
// which armour segment covers lane L (armour turns with B.rot)
const segAt = (W, B, L) => (((L - Math.floor(B.rot + 0.5)) % W.nl) + W.nl) % W.nl;
function shotBoss(W, B, s) {
  if (!s.droid) { W.stats.hits++; W.webStats.hits++; }
  if (B.heads.length && B.heads.some((h) => h.hp > 0)) { W.ev.push({ k: 'clank', lane: s.lane, d: B.d }); return; }
  if (B.segs && B.segs.some((x) => x > 0)) {
    const i = segAt(W, B, s.lane);
    if (B.segs[i] > 0) {
      B.segs[i] -= s.dmg;
      if (B.segs[i] <= 0) { B.segs[i] = 0; addScore(W, 100); W.ev.push({ k: 'seg', lane: s.lane, d: B.d }); }
      else W.ev.push({ k: 'clank', lane: s.lane, d: B.d });
      return;
    }
  }
  if (B.eye) {
    const dist = laneDist(W, s.lane, B.eye.lane);
    if (!B.eye.open || Math.abs(dist) > 1) {
      // the crystal facets refract the shot sideways; in phase 2 some come back up as bolts
      W.ev.push({ k: 'refract', lane: s.lane, d: B.d, to: wrapL(W, s.lane + Math.sign(dist || 1)) });
      if (B.phase > 1 && rand(W) < 0.05) addBolt(W, wrapL(W, s.lane + Math.sign(dist || 1)), B.d, W.R.boltV * 0.8, 'reflect');
      return;
    }
  }
  if (B.key === 'singularity' && B.phase === 3) B.d = Math.min(B.d0, B.d + 0.0035);
  hitBoss(W, B, s.dmg, s.pid, s.lane);
}
function hitBoss(W, B, dmg, pid, lane, purge = false) {
  if (B.state !== 'fight') return;
  B.hp -= dmg; B.hitT = 0.12;
  W.ev.push({ k: 'bosshit', key: B.key, lane, d: B.d, purge });
  if (B.hp <= 0) {
    B.hp = 0; B.state = 'dying'; B.t = 0; B.cur = null; B.pull = null;
    for (const e of W.enemies) if (e.hp > 0) kill(W, e, pid, 'purge');
    W.bolts = []; W.zaps = [];
    const pts = SCORE.boss * (W.mode === 'campaign' ? W.sector + 1 : 1 + Math.floor(W.webN / 10));
    addScore(W, pts);
    W.ev.push({ k: 'bosskill', key: B.key, pts: Math.round(pts * D_OF(W).score), d: B.d });
  }
}

// online guest: between the host's snapshots (20 a second) everything keeps moving the way it was going,
// so climbers, flips, bolts, pods and the boss glide instead of stepping; the next snapshot corrects it
function guestDrift(W, dt) {
  for (const e of W.enemies) {
    e.age = (e.age || 0) + dt;
    if (flipping(W, e, dt)) continue;
    if (e.age > 0.16) continue;
    if (e.vd) e.d = clamp(e.d + e.vd * dt, 0, 1.05);
    if (e.vl) e.lane = W.closed ? wrapL(W, e.lane + e.vl * dt) : clamp(e.lane + e.vl * dt, -0.5, W.nl - 0.5);
  }
  for (const b of W.bolts) b.d = Math.max(0, b.d - b.v * dt);
  for (const z of W.zaps) z.t += dt;
  for (const q of W.pods) q.d = Math.max(0, q.d - F.podV * dt);
  const B = W.boss;
  if (B && B.rotV && (B.age = (B.age || 0) + dt) < 0.16) B.rot += B.rotV * dt;
}
// online guest: take the host's web and phase as they arrive
export function adoptWeb(W, web, webN, sector, mode) {
  if (W.web === web && W.webN === webN && W.sector === sector) return;
  W.web = web; W.webN = webN; W.sector = sector;
  const def = webDef(W), S = SHAPES[def.shape] || SHAPES.circle;
  W.def = { shape: def.shape, rot: def.rot || 0, breathe: def.breathe || 0 };
  W.shape = def.shape; W.nl = S.n; W.closed = S.closed; W.spine = new Array(W.nl).fill(1);
  void mode;
}
