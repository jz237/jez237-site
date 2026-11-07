// Lancewing 2026 simulation: fixed 120 Hz steps, all randomness from the world's own seeded generator
// (state in W.rs; W.rand is a non-enumerable helper), plain data only, so a world can be cloned and re-run
// bit for bit (replays, online, tests). Nothing in here touches the DOM, WebGL or audio; it only pushes
// events into W.ev. The arena is a 2D slice: x = metres round the ring (wraps at F.C), y = height.
import { F, STEP, SECTORS, WAVES, LAYOUT, rampAt, rampLevel, endlessLevel, ENDLESS, ENEMY, TIER_UP, HUNTER, BOSSES, BOSS_KEYS, SCORE, START_LIVES, INTRO,
  introduced, WAVE_KIND, TEAM_WAVE, SPECIAL, DIFFICULTY, applyDiff, POWERUPS, PW_KEYS, DROP, rockHang, rockDrop } from './config.js?v=14';
export { STEP };

const { C, H } = F;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, f) => a + (b - a) * f;
export const wrap = (x) => { x %= C; return x < 0 ? x + C : x; };
// shortest signed distance from a to b round the ring
export function dX(a, b) { let d = (b - a) % C; if (d > C / 2) d -= C; else if (d < -C / 2) d += C; return d; }

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
const addRand = (W) => { Object.defineProperty(W, 'rand', { value: () => rand(W), enumerable: false, writable: true, configurable: true }); return W; };

// ------------------------------------------------------------------ world
export function makeWorld(o = {}) {
  const seed = (o.seed ?? 1) | 0, mode = o.mode || 'campaign', D = DIFFICULTY[o.diff] || DIFFICULTY.normal;
  const W = {
    n: 0, t: 0, seed, rs: (seed ^ 0x2545F491) | 0, mode, sector: o.sector || 0, k: mode === 'campaign' ? (o.sector || 0) : 0, up: { ...(o.up || {}) }, demo: !!o.demo, coop: !!o.coop,
    diff: DIFFICULTY[o.diff] ? o.diff : 'normal', lives: o.lives ?? START_LIVES + D.lives, score: o.score || 0, lifePts: 0, nextLife: 0,
    wave: mode === 'campaign' ? (o.wave || 0) : 0, wave0: mode === 'campaign' ? (o.wave || 0) : 0, waveN: 0, kind: 'normal', bossWave: false, phase: 'intro', phaseT: 0, waveT: 0, secT: 0, fightT: 0, R: null,
    ledges: [], players: [], riders: [], cores: [], pickups: [], haz: [], shots: [], portals: [], boss: null, hunter: null,
    toSpawn: 0, spawnT: 0, nextId: 1, chain: 0, ev: [], over: false, result: null, claims: [], net: null, lastDeathN: -1,
    slow: 0, spoutT: 0, boltT: 0, crumbleT: 0, crumbled: 0, specT: 0, rushN: 0, rushQ: 0, rushT: 0, rushGot: 0, waveDeaths: 0, bossN: 0, hunted: false, secHatched: 0,
    tutorial: mode === 'campaign' && !o.noTut && !o.demo && (o.sector || 0) === 0 && (o.wave || 0) === 0,
    stats: { kills: 0, cores: 0, hatched: 0, deaths: 0, hits: 0, clangs: 0, hunters: 0, air: 0, bestChain: 0, waveDeaths: {}, waveTries: {}, waveHits: {}, bossT: 0, cause: {} },
    tut: {}, seen: {},
  };
  addRand(W);
  const LE = SCORE.lifeEvery * D.score;
  W.lifePts = W.score;
  W.nextLife = (Math.floor(W.lifePts / LE) + 1) * LE;
  buildLedges(W);
  const n = o.coop ? 2 : 1, L0 = W.ledges.find((L) => L.p) || W.ledges[0];
  for (let i = 0; i < n; i++) W.players.push(makePlayer(i + 1, wrap(L0.x + (n === 2 ? (i ? 2.4 : -2.4) : 0)), L0.y, L0.id));
  startWave(W, true);
  return W;
}
function makePlayer(id, x, y, on) {
  return { id, x, y, vx: 0, vy: 0, face: 1, on, alive: true, inv: 0, armor: 0, deadT: 0, input: { mx: 0, flap: false }, prevFlap: false, flapCD: 0, holdT: 0,
    beat: 9, skid: 0, run: 0, hitT: 0, pw: {}, remote: false, gliding: false };
}
export const cloneWorld = (W) => addRand(structuredClone(W));
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
export const isBossWave = (W) => (W.mode === 'campaign' ? W.wave >= WAVES : W.bossWave);
export const waveLabel = (W) => (W.mode === 'campaign' ? (W.wave >= WAVES ? 'BOSS' : `WAVE ${W.wave + 1}`) : `WAVE ${W.waveN + 1}`);
const D_OF = (W) => DIFFICULTY[W.diff] || DIFFICULTY.normal;
export function addScore(W, n) { const v = Math.round(n * D_OF(W).score); W.score += v; W.lifePts += v; return v; }
function tut(W, key) { if (W.tut[key] || W.demo) return; W.tut[key] = 1; W.ev.push({ k: 'tut', key }); }
function nearestPlayer(W, x, y = 10) {
  let best = null, bd = 1e9;
  for (const p of W.players) { if (!p.alive) continue; const d = Math.abs(dX(x, p.x)) + Math.abs(p.y - y) * 0.5; if (d < bd) { bd = d; best = p; } }
  return best;
}
const anyPlayer = (W) => W.players.find((p) => p.alive) || W.players[0];
const waveKey = (W) => (W.mode === 'campaign' ? W.wave : 'E');

// ------------------------------------------------------------------ ledges
function buildLedges(W) {
  W.ledges = LAYOUT[W.k % 5].map(([f, y, w, fl], i) => ({ id: i, x: wrap(f * C), y, w, p: fl.includes('p'), s: fl.includes('s'), c: fl.includes('c'), st: 0, t: 0, T: 0 }));
}
// the ledge whose top is right under (x, y), or null
export function ledgeUnder(W, x, y) {
  let best = null;
  for (const L of W.ledges) { if (L.st === 2 || L.y > y + 0.05 || Math.abs(dX(L.x, x)) > L.w) continue; if (!best || L.y > best.y) best = L; }
  return best;
}
function safeLedge(W) {
  let best = null, bs = -1e9;
  for (const L of W.ledges) {
    if (L.st || !(L.p || L.s) || L.y > 12) continue;
    let s = L.p ? 6 : 0;
    for (const r of W.riders) { const d = Math.abs(dX(L.x, r.x)) + Math.abs(r.y - L.y) * 0.5; s += Math.min(d, 24); }
    for (const h of W.haz) if (Math.abs(dX(L.x, h.x || 0)) < 6) s -= 30;
    if (W.boss) s += Math.min(30, Math.abs(dX(L.x, W.boss.x))) * 2;
    if (s > bs) { bs = s; best = L; }
  }
  return best || W.ledges[0];
}

// ------------------------------------------------------------------ waves
function waveKind(W) {
  if (isBossWave(W)) return 'boss';
  if (W.mode === 'campaign') {
    if (W.coop && W.sector > 0 && W.wave === TEAM_WAVE) return 'team';
    return WAVE_KIND[W.sector][W.wave];
  }
  if (W.waveN % ENDLESS.specialEvery === 2) return ['corerush', 'crumble', 'survival'][Math.floor(W.waveN / ENDLESS.specialEvery) % 3];
  return 'normal';
}
function startWave(W, first = false) {
  if (W.mode === 'campaign') W.R = applyDiff(rampAt(W.sector, Math.min(W.wave, WAVES - 1)), W.diff);
  else {
    W.R = applyDiff(rampLevel(endlessLevel(W.fightT)), W.diff);
    W.bossWave = W.waveN > 0 && (W.waveN + 1) % ENDLESS.bossEvery === 0;
    const k = Math.floor(W.waveN / ENDLESS.lookEvery) % 5;
    if (k !== W.k) {
      W.k = k; buildLedges(W);
      const L0 = W.ledges.find((L) => L.p);
      for (const p of W.players) if (p.alive) { p.x = wrap(L0.x + (p.id === 2 ? 2.4 : W.players.length > 1 ? -2.4 : 0)); p.y = L0.y; p.on = L0.id; p.vx = p.vy = 0; }
      for (const c of W.cores) c.gone = true;
      W.cores = [];
    }
  }
  W.kind = waveKind(W);
  for (const L of W.ledges) if (L.st) { L.st = 0; L.t = 0; W.ev.push({ k: 'rebuild', id: L.id }); }
  const R = W.R;
  W.crumbled = 0; W.haz = []; W.shots = [];
  W.phase = 'intro'; W.phaseT = first ? (W.tutorial ? 3.4 : 2.6) : W.kind === 'boss' ? 2.6 : 2.2; W.waveT = 0; W.hunted = false; W.waveDeaths = 0;
  W.toSpawn = W.kind === 'boss' || W.kind === 'corerush' ? 0 : R.count;
  if (W.kind === 'team') W.toSpawn = Math.max(4, R.count - (R.count % 2));
  W.spawnT = 0.5;
  W.spoutT = R.spout ? R.spout * rr(W, 0.45, 0.8) : 0;
  W.boltT = R.bolt ? R.bolt * rr(W, 0.6, 0.95) : 0;
  W.crumbleT = SPECIAL.crumbleGap * 0.55;
  const f = W.mode === 'campaign' ? W.sector / 4 : Math.min(1, endlessLevel(W.fightT) / 5);
  W.specT = W.kind === 'survival' ? R.surv : W.kind === 'corerush' ? SPECIAL.rushT : 0;
  W.rushN = W.kind === 'corerush' ? Math.round(lerp(SPECIAL.rushCores[0], SPECIAL.rushCores[1], f)) : 0;
  W.rushQ = W.rushN; W.rushT = 0; W.rushGot = 0;
  const arm = R.armor + (W.up.armor || 0) + Math.max(0, D_OF(W).armor);
  for (const p of W.players) p.armor = arm;
  W.ev.push({ k: 'wave', wave: W.wave, waveN: W.waveN, kind: W.kind, boss: W.kind === 'boss', first });
}
function beginFight(W) {
  W.phase = 'fight'; W.waveT = 0;
  const key = waveKey(W);
  W.stats.waveTries[key] = (W.stats.waveTries[key] || 0) + 1;
  if (W.kind === 'boss') startBoss(W);
  if (W.tutorial && W.wave === 0) tut(W, 'controls');
  if (W.kind === 'corerush') tut(W, 'rush');
  if (W.kind === 'survival') tut(W, 'survival');
  if (W.kind === 'crumble') tut(W, 'crumble');
  if (W.kind === 'team') tut(W, 'team');
  W.ev.push({ k: 'fight', kind: W.kind });
}
function waveDirector(W, dt) {
  const R = W.R;
  // riders forming on the spawn ledges
  const surv = W.kind === 'survival';
  if (W.toSpawn > 0 || surv) {
    W.spawnT -= dt;
    const alive = W.riders.length + W.portals.length + W.cores.filter((c) => c.st === 'form').length;
    const cap = surv ? Math.max(2, R.active + (R.survCap || 0)) : R.active;
    if (W.spawnT <= 0 && alive < cap) {
      const n = openPortal(W);
      W.spawnT = R.gap * rr(W, 0.85, 1.15) * (n > 1 ? 1.4 : 1);
      if (!surv) W.toSpawn -= n;
    }
  }
  if (surv && W.waveT >= W.specT) { endSpecial(W, 'survive'); return; }
  if (W.kind === 'corerush') {
    W.rushT -= dt;
    if (W.rushQ > 0 && W.rushT <= 0) { W.rushQ--; W.rushT = 0.32; const T = anyPlayer(W); addCore(W, wrap(T.x + rr(W, -26, 26)), H - 1, rr(W, -2, 2), 0, null, null, { rush: true }); }
    if (W.waveT >= W.specT || (W.rushQ <= 0 && !W.cores.length)) { endSpecial(W, 'rush'); return; }
  }
  if (R.spout) { W.spoutT -= dt; if (W.spoutT <= 0) { spout(W); W.spoutT = R.spout * rr(W, 0.8, 1.2); } }
  if (R.bolt && W.kind !== 'boss') { W.boltT -= dt; if (W.boltT <= 0) { bolt(W); W.boltT = R.bolt * rr(W, 0.8, 1.2); } }
  if (W.kind === 'crumble' && W.crumbled < SPECIAL.crumbleMax) { W.crumbleT -= dt; if (W.crumbleT <= 0) { crumble(W); W.crumbleT = SPECIAL.crumbleGap * rr(W, 0.8, 1.2); } }
  if (!W.hunted && W.kind !== 'boss' && W.kind !== 'corerush' && W.waveT > R.hunt) { W.hunted = true; summonHunter(W); }
}
function openPortal(W) {
  const R = W.R;
  const far = W.mode === 'campaign' && W.sector === 0 ? 16 : 13;
  const ok = W.ledges.filter((L) => L.s && L.st === 0 && W.players.every((p) => !p.alive || Math.abs(dX(L.x, p.x)) >= far) && !W.portals.some((P) => P.ledge === L.id));
  const list = ok.length ? ok : W.ledges.filter((L) => L.s && L.st === 0);
  const L = list.length ? list[Math.floor(rand(W) * list.length)] : W.ledges[0];
  let type;
  if (W.kind === 'team') type = 'twinblade';
  else {
    const mix = {};
    const s = W.mode === 'campaign' ? W.sector : Math.min(4, Math.floor(endlessLevel(W.fightT)));
    const w = W.mode === 'campaign' ? W.wave : 3;
    for (const k in R.mix) if (W.mode !== 'campaign' || introduced(k, s, w)) mix[k] = R.mix[k];
    const callers = W.riders.filter((r) => r.type === 'stormcaller').length + W.portals.filter((P) => P.type === 'stormcaller').length;
    if (callers >= (R.sector >= 4 ? 2 : 1)) delete mix.stormcaller;
    type = pickW(W, Object.keys(mix).length ? mix : { skirmisher: 1 });
  }
  if (type === 'twinblade' && W.toSpawn < 2 && W.kind !== 'survival') type = 'lancer';
  if (type === 'twinblade') {
    const a = W.nextId++, b = W.nextId++;
    W.portals.push({ id: a, x: wrap(L.x - 1.4), y: L.y, ledge: L.id, t: 0, T: R.warn, type, elite: false, role: 0, partner: b });
    W.portals.push({ id: b, x: wrap(L.x + 1.4), y: L.y, ledge: L.id, t: 0, T: R.warn, type, elite: false, role: 1, partner: a });
    W.ev.push({ k: 'portal', x: L.x, y: L.y, T: R.warn, type, n: 2 });
    return 2;
  }
  W.portals.push({ id: W.nextId++, x: L.x, y: L.y, ledge: L.id, t: 0, T: R.warn, type, elite: false, role: 0, partner: 0 });
  W.ev.push({ k: 'portal', x: L.x, y: L.y, T: R.warn, type, n: 1 });
  return 1;
}
function portals(W, dt) {
  for (const P of W.portals) {
    P.t += dt;
    if (P.t < P.T) continue;
    const r = addRider(W, P.type, P.x, P.y + 0.02, P.elite);
    r.b.role = P.role; r.b.partner = P.partner; r.id = P.id;
    const L = W.ledges[P.ledge];
    if (L && L.st !== 2 && Math.abs(P.y - L.y) < 0.1) r.on = L.id;
    r.vy = 2.5;
    P.done = true;
    W.ev.push({ k: 'form', id: r.id, x: r.x, y: r.y, type: r.type });
    if (W.mode === 'campaign' && !W.seen[r.type]) { W.seen[r.type] = 1; const q = INTRO[r.type]; if (q && q[0] === W.sector && q[1] === W.wave) W.ev.push({ k: 'intro', type: r.type }); }
  }
  W.portals = W.portals.filter((P) => !P.done);
}
function endSpecial(W, why) {
  for (const r of W.riders) { r.alive = false; W.ev.push({ k: 'flee', id: r.id, x: r.x, y: r.y }); }
  W.riders = []; W.portals = []; W.toSpawn = 0;
  if (why === 'rush') { for (const c of W.cores) { c.gone = true; W.ev.push({ k: 'corefade', x: c.x, y: c.y }); } W.cores = []; }
  if (why === 'survive') for (const c of W.cores) { c.rush = true; c.T = 1e9; }
  waveClear(W, why);
}
function waveClear(W, why = '') {
  W.phase = 'clear'; W.phaseT = 2.8;
  let bonus = SCORE.wave;
  const clean = !W.waveDeaths;
  if (clean) bonus += SCORE.clean;
  if (why === 'survive') bonus += SCORE.survive;
  if (why === 'rush' && W.rushN && W.rushGot >= W.rushN) bonus += SCORE.rushAll;
  if (W.kind === 'team' && clean) bonus += SCORE.team;
  const pts = addScore(W, bonus);
  if (W.hunter) W.hunter.st = 'leave';
  W.haz = []; W.shots = [];
  W.ev.push({ k: 'waveclear', pts, clean, kind: W.kind, why, got: W.rushGot, of: W.rushN });
}
function nextWave(W) {
  if (W.mode === 'campaign') W.wave++; else W.waveN++;
  for (const c of W.cores) c.gone = true;
  W.cores = [];
  startWave(W);
}

// ------------------------------------------------------------------ the step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  const guest = W.net === 'guest';
  W.phaseT -= dt;
  if (!guest) {
    if (W.phase === 'intro') { if (W.phaseT <= 0) beginFight(W); }
    else if (W.phase === 'fight') { W.waveT += dt; W.fightT += dt; waveDirector(W, dt); }
    else if (W.phase === 'clear') { if (W.phaseT <= 0) nextWave(W); }
  }
  if (W.mode === 'campaign' && W.phase !== 'clear') W.secT += dt;
  if (W.boss) W.stats.bossT += dt;
  W.slow = Math.max(0, W.slow - dt);
  const md = W.slow > 0 ? dt * 0.5 : dt;
  for (const p of W.players) player(W, p, dt);
  if (guest) { guestLocal(W, dt, md); return; }
  for (const r of W.riders) if (r.alive) rider(W, r, md);
  separate(W);
  if (W.hunter) hunter(W, W.hunter, md);
  if (W.boss) boss(W, W.boss, md);
  hazards(W, md);
  shots(W, md);
  cores(W, md);
  pickups(W, dt);
  portals(W, md);
  contacts(W);
  W.riders = W.riders.filter((r) => r.alive);
  if (W.phase === 'fight' && (W.kind === 'normal' || W.kind === 'crumble' || W.kind === 'team') && W.toSpawn <= 0 && !W.portals.length && !W.riders.length && !W.cores.length) waveClear(W);
  if (W.lifePts >= W.nextLife) { W.lives++; W.nextLife += SCORE.lifeEvery * D_OF(W).score; W.ev.push({ k: 'life' }); }
  if (W.lives <= 0 && !W.players.some((p) => p.alive) && W.players.every((p) => p.deadT > 1.6)) { W.over = true; W.result = 'over'; W.ev.push({ k: 'over' }); }
}

// ------------------------------------------------------------------ flight: shared by every rider
// mx: steer -1..1, beat: a wing beat this tick, held: flap held (glide), P: the rider's strength
function fly(W, b, mx, beat, held, P, dt) {
  if (beat) {
    b.vy = b.vy < 0 ? Math.min(b.vy * 0.35 + P.flap, P.flapMax) : Math.min(b.vy + P.flap * 0.8, P.flapMax);
    if (mx) b.vx += Math.sign(mx) * F.flapPush * P.k;
    b.beat = 0; b.on = -1;
  }
  b.beat += dt;
  b.skid = Math.max(0, b.skid - dt);
  if (b.on >= 0) {
    const L = W.ledges[b.on];
    if (!L || L.st === 2) b.on = -1;
    else {
      if (mx && Math.sign(mx) !== Math.sign(b.vx) && Math.abs(b.vx) > F.skidV) {
        // a skid turn: dig in and stop before going the other way
        if (b.skid <= 0) W.ev.push({ k: 'skid', id: b.id, x: b.x, y: b.y });
        b.skid = 0.2;
        b.vx -= Math.sign(b.vx) * F.skidDec * dt;
      } else if (mx) b.vx += clamp(mx * P.run - b.vx, -F.runAcc * dt, F.runAcc * dt);
      else b.vx -= clamp(b.vx, -F.runFric * dt, F.runFric * dt);
      b.y = L.y; b.vy = 0;
      b.run += Math.abs(b.vx) * dt;
    }
  }
  if (b.on < 0) {
    if (mx) b.vx += mx * P.acc * dt;
    b.vx -= b.vx * F.airDrag * dt;
    b.vx = clamp(b.vx, -P.max, P.max);
    const gl = P.glide && held && b.vy < 0;
    b.gliding = gl;
    b.vy -= F.g * (gl ? 0.4 : 1) * dt;
    const lim = gl ? F.fall * 0.3 : F.fall;
    if (b.vy < -lim) b.vy = gl ? Math.min(-lim, b.vy + 30 * dt) : -lim;
  }
  if (mx > 0.12) b.face = 1; else if (mx < -0.12) b.face = -1;
  const ox = b.x, oy = b.y;
  b.x = wrap(b.x + b.vx * dt); b.y += b.vy * dt;
  collideLedges(W, b, ox, oy);
  if (b.y + F.hh > H) { b.y = H - F.hh; if (b.vy > 0) b.vy = -b.vy * 0.25; }
}
function collideLedges(W, b, ox, oy) {
  for (const L of W.ledges) {
    if (L.st === 2) continue;
    const dx = dX(L.x, b.x), adx = Math.abs(dx);
    if (adx > L.w + F.hw) continue;
    const bot = L.y - F.ledgeT;
    // landing on top
    if (b.on < 0 && b.vy <= 0 && oy >= L.y - 0.06 && b.y < L.y && adx < L.w + 0.3) {
      const hard = -b.vy;
      b.y = L.y; b.vy = 0; b.on = L.id;
      W.ev.push({ k: 'land', id: b.id, pl: b.input ? 1 : 0, x: b.x, y: b.y, v: hard });
      continue;
    }
    // bonking the underside
    if (b.vy > 0 && oy + F.hh <= bot + 0.06 && b.y + F.hh > bot && adx < L.w + F.hw * 0.5) { b.y = bot - F.hh; b.vy = -b.vy * 0.3; W.ev.push({ k: 'bonk', id: b.id, pl: b.input ? 1 : 0, x: b.x, y: bot }); continue; }
    // the sides of the slab
    if (b.on !== L.id && b.y < L.y - 0.05 && b.y + F.hh > bot + 0.05 && adx < L.w + F.hw) {
      const s = Math.sign(dx || 1);
      b.x = wrap(L.x + s * (L.w + F.hw + 0.01));
      if (Math.sign(b.vx) === -s) b.vx = -b.vx * 0.45;
    }
    // the rock point under the slab
    if (b.on !== L.id) rockPush(W, L, b, F.hw, F.hh, true);
  }
}
// ------------------------------------------------------------------ the rock under each ledge is solid
// Push a body out of the rock under ledge L. The body is a box hw either side of b.x, from its feet at b.y up to
// b.y + hh. The rock is convex, so the box meets it first with the top corner nearest the ledge's middle (or its
// top edge, when the point is over the box): the body moves out along the rock's face and loses its speed into
// the rock with a little bounce, so it slides off the slopes and bonks off the point. Returns how far it moved.
function rockPush(W, L, b, hw, hh, ev = false) {
  const bot = L.y - F.ledgeT;
  if (L.st === 2 || b.y >= bot) return 0;
  const h = rockHang(L.w), top = b.y + hh;
  if (top <= bot - h) return 0;
  const dx = dX(L.x, b.x), adx = Math.abs(dx), s = dx < 0 ? -1 : 1;
  let nx, ny, pen;
  if (adx <= hw) {
    // the point is over the box: down, or out sideways when that is shorter (it came in from the side)
    const down = top - (bot - h), side = L.w * Math.sqrt(Math.min(1, down / h)) + hw - adx;
    if (side < down) { nx = s; ny = 0; pen = side; } else { nx = 0; ny = -1; pen = down; }
  } else {
    const c = dx - s * hw;
    if (c * s >= L.w) return 0;
    const d = top - (bot - rockDrop(L.w, c));
    if (d <= 0) return 0;
    const sl = (2 * h * c) / (L.w * L.w), k = 1 / Math.sqrt(1 + sl * sl);
    nx = sl * k; ny = -k; pen = d * k;
  }
  pen += 0.002;
  b.x = wrap(b.x + nx * pen); b.y += ny * pen;
  const vn = b.vx * nx + b.vy * ny;
  if (vn < 0) {
    b.vx -= 1.3 * vn * nx; b.vy -= 1.3 * vn * ny;
    if (ev && vn < -2.5) W.ev.push({ k: 'bonk', id: b.id, pl: b.input ? 1 : 0, x: b.x, y: b.y + hh, rock: 1 });
  }
  return pen;
}
// the ledge whose slab or rock a body's box (feet at y) is inside, or null (the autopilot's look-ahead, summons)
export function inRock(W, x, y, hw = F.hw, hh = F.hh) {
  for (const L of W.ledges) {
    if (L.st === 2) continue;
    const adx = Math.abs(dX(L.x, x)), bot = L.y - F.ledgeT;
    if (adx >= L.w + hw || y >= L.y - 0.05 || y + hh <= bot - rockHang(L.w)) continue;
    if (y + hh > bot || y + hh > bot - rockDrop(L.w, adx <= hw ? 0 : adx - hw)) return L;
  }
  return null;
}
// the nearest height to y (feet) where a body hh tall at x is clear of every slab and rock
function clearY(W, x, y, hw = F.hw, hh = F.hh) {
  for (let i = 0; i < 4; i++) {
    const L = inRock(W, x, y, hw, hh);
    if (!L) return y;
    const under = L.y - F.ledgeT - rockDrop(L.w, Math.max(0, Math.abs(dX(L.x, x)) - hw)) - hh - 0.1;
    y = under > 1.5 && y - under < L.y + 0.1 - y ? under : L.y + 0.1;
  }
  return y;
}
// keep a body that never stands on ledges (a core in flight, the Stormhunter) out of every slab and rock: out of a
// slab the shortest way, out of a rock along its face. Returns the ledge it was lifted onto the top of, if any.
function solidPush(W, b, hw, hh) {
  let onto = null;
  for (const L of W.ledges) {
    if (L.st === 2) continue;
    const dx = dX(L.x, b.x), adx = Math.abs(dx), bot = L.y - F.ledgeT;
    if (adx >= L.w + hw) continue;
    if (b.y < L.y && b.y + hh > bot) {
      // in the slab: over the top, out past the end, or down clear of the rock under it, whichever is nearest
      const under = bot - rockDrop(L.w, adx <= hw ? 0 : adx - hw);
      const up = L.y - b.y, down = b.y + hh - under, side = L.w + hw - adx, m = Math.min(up, down, side);
      if (m === up) { b.y = L.y; if (b.vy < 0) b.vy = 0; onto = L; }
      else if (m === down) { b.y = under - hh - 0.002; if (b.vy > 0) b.vy = -b.vy * 0.3; }
      else { const s = dx < 0 ? -1 : 1; b.x = wrap(L.x + s * (L.w + hw + 0.002)); if (b.vx * s < 0) b.vx = -b.vx * 0.45; }
    } else rockPush(W, L, b, hw, hh);
  }
  return onto;
}
function playerP(W, p) {
  const w = W.up.wing || 0, sp = p.pw.speed ? 1.2 : 1;
  return { acc: F.airAcc * (1 + 0.05 * w) * sp, max: F.airMax * (1 + 0.05 * w) * sp, run: F.runMax * (1 + 0.04 * w) * sp, flap: F.flap * (1 + 0.07 * w) * (p.pw.speed ? 1.1 : 1),
    flapMax: F.flapMax * (1 + 0.03 * w), glide: !!W.up.glide, k: 1 };
}
export const lanceBonus = (W, p) => 0.12 * (W.up.reach || 0) + (p.pw && p.pw.lance ? 0.35 : 0);
export const reachOf = (W, p) => F.reach + 0.2 * (W.up.reach || 0) + (p.pw && p.pw.lance ? 0.45 : 0);

// ------------------------------------------------------------------ the players
function player(W, p, dt) {
  if (!p.alive) {
    p.deadT += dt;
    if (W.net !== 'guest' && p.deadT >= F.respawn && W.lives > 0 && !W.over) respawn(W, p);
    return;
  }
  // timers run for every rider, also the online partner's (the host judges its duels: a hitT or inv that never
  // ran down would make it immune to duels and hits for the rest of the run)
  p.inv = Math.max(0, p.inv - dt); p.hitT = Math.max(0, p.hitT - dt);
  for (const k in p.pw) { p.pw[k] -= dt; if (p.pw[k] <= 0) { delete p.pw[k]; W.ev.push({ k: 'pwend', pid: p.id, kind: k }); } }
  if (p.remote) return;   // the online partner's rider is flown on its own machine
  const I = p.input;
  const tap = !!I.flap && !p.prevFlap;
  p.prevFlap = !!I.flap;
  p.flapCD -= dt;
  let beat = false;
  if (tap && p.flapCD <= 0) { beat = true; p.holdT = F.holdCD; }
  else if (I.flap) { p.holdT -= dt; if (p.holdT <= 0 && p.flapCD <= 0) { beat = true; p.holdT = F.holdCD; } }
  if (beat) { p.flapCD = F.tapCD; W.ev.push({ k: 'flap', pid: p.id, id: p.id, x: p.x, y: p.y }); }
  fly(W, p, clamp(I.mx || 0, -1, 1), beat, !!I.flap, playerP(W, p), dt);
  if (p.y < F.sea) { W.ev.push({ k: 'splash', x: p.x, big: 1 }); hurt(W, p, 'sea', { fatal: true }); }
}
function hurt(W, p, cause, o = {}) {
  if (!p.alive || (p.inv > 0 && !o.fatal)) return false;
  if (W.net === 'guest') { if (p.id === 2 && o.fatal) { p.alive = false; p.deadT = 0; W.claims.push({ dead: 1, cause }); W.ev.push({ k: 'death', pid: 2, x: p.x, y: p.y, cause, lives: W.lives }); } return false; }
  const key = waveKey(W);
  W.stats.hits++; W.stats.waveHits[key] = (W.stats.waveHits[key] || 0) + 1;
  if (!o.fatal && (p.pw.shield || p.armor > 0)) {
    if (p.pw.shield) delete p.pw.shield; else p.armor--;
    p.inv = F.hitInv; p.vx = (o.dir || -p.face) * 7.5; p.vy = Math.max(p.vy, 3.5); p.on = -1;
    W.ev.push({ k: 'armor', pid: p.id, x: p.x, y: p.y, cause, left: p.armor });
    return false;
  }
  p.alive = false; p.deadT = 0; p.pw = {};
  W.lives = Math.max(0, W.lives - 1); W.stats.deaths++; W.waveDeaths++; W.chain = 0; W.lastDeathN = W.n;
  W.stats.waveDeaths[key] = (W.stats.waveDeaths[key] || 0) + 1;
  W.stats.cause[cause] = (W.stats.cause[cause] || 0) + 1;
  W.ev.push({ k: 'death', pid: p.id, x: p.x, y: p.y, vx: p.vx, cause, by: o.by, lives: W.lives });
  return true;
}
function respawn(W, p) {
  const L = safeLedge(W);
  const other = W.players.find((q) => q !== p && q.alive && q.on === L.id);
  p.alive = true; p.x = wrap(L.x + (other ? 2 : 0)); p.y = L.y; p.on = L.id; p.vx = p.vy = 0; p.inv = F.inv; p.deadT = 0; p.prevFlap = true; p.face = 1;
  for (const r of W.riders) {
    const d = dX(L.x, r.x);
    if (Math.abs(d) < F.clearR && Math.abs(r.y - L.y) < 9) { r.vx = Math.sign(d || 1) * 9; r.vy = 4.5; r.on = -1; r.b.t = 0.8; }
  }
  W.ev.push({ k: 'spawn', pid: p.id, x: p.x, y: p.y });
}

// ------------------------------------------------------------------ enemy riders
export function addRider(W, type, x, y, elite = false) {
  const r = { id: W.nextId++, type, x: wrap(x), y, vx: 0, vy: 0, face: rand(W) < 0.5 ? -1 : 1, on: -1, alive: true, elite, born: 0, beat: 9, flapCD: 0, skid: 0, run: 0, hitT: 0.5, gliding: false,
    b: { t: rr(W, 0.05, 0.35), mx: 0, gx: x, gy: y + 3, mode: 'go', wx: x, wy: y, role: 0, partner: 0, cast: rr(W, 2.5, 4.5), feint: false } };
  W.riders.push(r);
  return r;
}
function riderP(W, r) {
  const s = W.R.spd * ENEMY[r.type].spd * (r.elite ? 1.07 : 1);
  return { acc: F.airAcc * s, max: F.airMax * s, run: F.runMax * s, flap: F.flap * (0.92 + 0.08 * Math.min(1.2, s)), flapMax: F.flapMax, glide: false, k: s };
}
function think(W, r) {
  const R = W.R, E = ENEMY[r.type], B = r.b;
  const T = nearestPlayer(W, r.x, r.y);
  // the last few riders of a wave stop wandering and come for you
  const last = W.toSpawn <= 0 && W.riders.length <= 2 && W.waveT > 12;
  const aggr = last ? 1 : R.aggr;
  const sk = Math.min(1, R.skill * (r.elite ? 1.18 : 1));
  const noise = (1 - sk) * 2.4;
  const wander = () => {
    if (B.mode !== 'wander' || rand(W) < 0.18 || Math.abs(dX(r.x, B.wx)) < 2) { B.mode = 'wander'; B.wx = wrap(r.x + rr(W, -24, 24)); B.wy = rr(W, 5, 20); }
    B.gx = B.wx; B.gy = B.wy;
  };
  if (!T) wander();
  else {
    const d = dX(r.x, T.x), ad = Math.abs(d);
    switch (r.type) {
      case 'skirmisher':
        if (rand(W) < aggr * 0.75 || ad < 8) { B.mode = 'hunt'; B.gx = T.x; B.gy = T.y + E.climb * sk + rr(W, -noise, noise); } else wander();
        break;
      case 'lancer': case 'shieldbearer':
        if (rand(W) < aggr || ad < 14) { B.mode = 'hunt'; B.gx = T.x; B.gy = T.y + E.climb * sk + rr(W, -noise, noise) * 0.8; } else wander();
        break;
      case 'reaver':
        if (B.mode !== 'dive') {
          B.mode = 'rise';
          B.gx = wrap(T.x - Math.sign(d || 1) * 5); B.gy = Math.min(H - 3, T.y + E.climb);
          if (r.y > T.y + 3 && ad < 10 && rand(W) < 0.4 + 0.5 * aggr) { B.mode = 'dive'; B.feint = rand(W) < E.feint * sk; }
        } else {
          B.gx = T.x; B.gy = T.y + 0.9 * sk + rr(W, -noise, noise) * 0.4;
          if (B.feint && ad < 5) { B.mode = 'rise'; B.gy = T.y + 6; B.feint = false; }
          else if (r.y < T.y - 0.8 || ad > 15) B.mode = 'rise';
        }
        break;
      case 'twinblade': {
        const hi = !B.role;
        B.mode = 'hunt';
        B.gy = T.y + (hi ? E.climb * sk : -0.8) + rr(W, -noise, noise) * 0.5;
        B.gx = ad > 6 ? wrap(T.x + (hi ? -1 : 1) * 5) : T.x;
        break;
      }
      case 'stormcaller':
        // it keeps its distance to cast, but a lone caller (or one you have closed on) fights like a lancer
        if (last || ad < 5) { B.mode = 'hunt'; B.gx = T.x; B.gy = T.y + 1.2 * sk; }
        else { B.mode = 'cast'; B.gy = clamp(T.y + E.climb, 9, H - 4); B.gx = wrap(T.x + (d > 0 ? -1 : 1) * 11); }
        break;
    }
  }
  B.gy = clamp(B.gy, 3, H - 2.6);
  // a ledge overhead (its slab or the rock under it) with the goal up past it: out past the end on this side
  // first (heading for the far end would press it up into the rock all the way)
  if (r.on < 0 && B.gy > r.y + 0.5) for (const L of W.ledges) {
    if (L.st === 2 || L.y < r.y + 0.5) continue;
    const e = dX(L.x, r.x), bot = L.y - F.ledgeT;
    if (Math.abs(e) > L.w + F.hw + 0.4 || B.gy < bot - 0.5 || bot - rockHang(L.w) > r.y + F.hh + 3.5) continue;
    B.gx = wrap(L.x + Math.sign(e || r.face) * (L.w + 1.9));
    break;
  }
  const dd = dX(r.x, B.gx);
  B.mx = Math.abs(dd) < 0.6 ? 0 : clamp(dd / 3.5, -1, 1) * (0.72 + 0.28 * R.aggr);
  // never camp on a ledge: a rider whose goal lies below walks off the nearer edge
  if (r.on >= 0 && B.gy < r.y - 1.2) { const L = W.ledges[r.on]; if (L && Math.abs(dd) < L.w + 1.5) { const e = dX(L.x, r.x); B.mx = Math.sign(e || r.face) * 0.9; } }
}
function rider(W, r, dt) {
  r.born += dt; r.hitT = Math.max(0, r.hitT - dt);
  const B = r.b, R = W.R, E = ENEMY[r.type];
  B.t -= dt;
  if (B.t <= 0) { think(W, r); B.t = R.react * rr(W, 0.75, 1.3); }
  let beat = false;
  r.flapCD -= dt;
  const low = r.on < 0 && r.y < 3.4 && r.vy < 0.5 && !ledgeUnder(W, r.x, r.y);
  const want = (r.y < B.gy - 0.3 && r.vy < 2.6) || low || (r.on >= 0 && B.gy > r.y + 1.5);
  if (want && r.flapCD <= 0) { beat = true; r.flapCD = (E.beat / Math.max(0.7, R.spd)) * rr(W, 0.85, 1.2) * (low ? 0.7 : 1); }
  fly(W, r, B.mx, beat, false, riderP(W, r), dt);
  if (r.type === 'stormcaller') cast(W, r, dt);
  if (r.y < F.sea) { r.alive = false; W.ev.push({ k: 'splash', x: r.x, big: 0 }); W.ev.push({ k: 'drown', id: r.id, x: r.x, type: r.type }); }
}
function cast(W, r, dt) {
  const B = r.b;
  B.cast -= dt * W.R.cast;
  if (B.cast > 0 || W.phase !== 'fight') return;
  const T = nearestPlayer(W, r.x, r.y);
  if (!T) return;
  const d = dX(r.x, T.x), dy = T.y + 1 - (r.y + 1.2);
  if (Math.abs(d) > ENEMY.stormcaller.range) { B.cast = 0.6; return; }
  B.cast = ENEMY.stormcaller.castCD * rr(W, 0.85, 1.15);
  const len = Math.hypot(d, dy) || 1, k = (len + 6) / len;
  W.haz.push({ id: W.nextId++, k: 'arc', x: r.x, y: r.y + 1.2, dx: d * k, dy: dy * k, t: 0, T: W.R.warn * 1.25, A: 0.32, src: r.id });
  W.ev.push({ k: 'arcwarn', x: r.x, y: r.y });
}
function separate(W) {
  const L = W.riders;
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
    const a = L[i], b = L[j];
    const dx = dX(a.x, b.x), dy = b.y - a.y;
    if (Math.abs(dx) < 1.6 && Math.abs(dy) < 1.6) { const s = Math.sign(dx || 1) * 1.6; a.vx -= s; b.vx += s; if (Math.abs(dy) < 0.5) { a.vy += 0.6; b.vy -= 0.6; } }
  }
}
function unhorse(W, r, p, how = 'lance') {
  if (!r.alive) return;
  r.alive = false;
  let pts = 0;
  if (p) { W.stats.kills++; pts = addScore(W, ENEMY[r.type].score * (r.elite ? 1.5 : 1)); }
  W.ev.push({ k: 'unhorse', id: r.id, type: r.type, x: r.x, y: r.y, vx: r.vx, pid: p ? p.id : 0, pts, elite: r.elite, how });
  const s = p ? Math.sign(dX(p.x, r.x) || 1) : 0;
  addCore(W, r.x, r.y + 1.0, r.vx * 0.35 + s * 2.2, 4.5, TIER_UP[r.type], r.type);
  if (p) maybeDrop(W, r);
}

// ------------------------------------------------------------------ ember cores
function addCore(W, x, y, vx, vy, next, from, o = {}) {
  const c = { id: W.nextId++, x: wrap(x), y, vx, vy, t: 0, T: W.R.coreT * rr(W, 0.92, 1.08), on: -1, st: 'fall', next, from, rush: !!o.rush, gone: false, fT: 0 };
  W.cores.push(c);
  W.ev.push({ k: 'core', id: c.id, x: c.x, y: c.y, rush: c.rush });
  if (!c.rush) tut(W, 'cores');
  return c;
}
function cores(W, dt) {
  for (const c of W.cores) {
    if (c.gone) continue;
    c.t += dt;
    // CORE MAGNET pulls cores toward the nearest player
    const mg = W.up.magnet || 0;
    if (mg && c.st !== 'form') for (const p of W.players) {
      if (!p.alive) continue;
      const dx = dX(c.x, p.x), dy = p.y + 1 - c.y, d = Math.hypot(dx, dy), R = 2.5 + 2 * mg;
      if (d < R && d > 0.01) { const k = 7 * dt / d; c.x = wrap(c.x + dx * k); c.y += dy * k; if (c.on >= 0 && dy > 0.6) { c.on = -1; c.st = 'fall'; } }
    }
    if (c.st === 'form') {
      c.fT += dt;
      if (c.fT >= 1.1) {
        c.gone = true;
        const r = addRider(W, c.next, c.x, c.on >= 0 ? c.y : clearY(W, c.x, c.y), c.next === c.from);
        r.vy = 4; r.hitT = 0.45;
        W.ev.push({ k: 'reform', id: r.id, x: r.x, y: r.y, type: r.type, elite: r.elite });
      }
      continue;
    }
    if (c.on >= 0) {
      const L = W.ledges[c.on];
      if (!L || L.st === 2) { c.on = -1; c.st = 'fall'; }
      else {
        c.y = L.y + 0.45; c.vx *= Math.exp(-5 * dt); c.x = wrap(c.x + c.vx * dt);
        if (Math.abs(dX(L.x, c.x)) > L.w + 0.1) { c.on = -1; c.st = 'fall'; }
      }
    } else {
      c.vy -= F.g * 0.8 * dt; c.vx *= Math.exp(-0.25 * dt);
      const oy = c.y;
      c.x = wrap(c.x + c.vx * dt); c.y += c.vy * dt;
      for (const L of W.ledges) {
        if (L.st === 2 || Math.abs(dX(L.x, c.x)) > L.w || c.vy >= 0) continue;
        const top = L.y + 0.45;
        if (oy >= top - 0.02 && c.y < top) {
          c.y = top;
          if (c.vy < -3.2) { c.vy = -c.vy * 0.36; c.vx *= 0.7; W.ev.push({ k: 'corebounce', x: c.x, y: c.y }); }
          else { c.vy = 0; c.on = L.id; c.st = 'rest'; }
        }
      }
      if (c.on < 0) {
        const q = { x: c.x, y: c.y - 0.4, vx: c.vx, vy: c.vy }, L = solidPush(W, q, 0.4, 0.8);
        c.x = q.x; c.y = q.y + 0.4; c.vx = q.vx; c.vy = q.vy;
        if (L) { c.y = L.y + 0.45; c.vy = 0; c.on = L.id; c.st = 'rest'; }
      }
      if (c.y > H - 0.5) { c.y = H - 0.5; c.vy = -Math.abs(c.vy) * 0.3; }
      if (c.y < F.sea) { c.gone = true; W.ev.push({ k: 'coresink', x: c.x, rush: c.rush }); continue; }
    }
    if (!c.rush && c.t >= c.T) {
      c.st = 'form'; c.fT = 0; W.stats.hatched++; W.secHatched++; W.chain = 0;
      W.ev.push({ k: 'hatch', id: c.id, x: c.x, y: c.y, type: c.next });
    }
  }
  W.cores = W.cores.filter((c) => !c.gone);
}
function collectCore(W, c, p) {
  c.gone = true;
  W.chain = Math.min(4, W.chain + 1);
  const air = c.st === 'fall' && c.t > 0.3;
  let pts = c.rush ? SCORE.rush * W.chain : SCORE.core[W.chain - 1];
  if (air) { pts += SCORE.air; W.stats.air++; }
  if (c.st === 'form') pts = Math.round(pts / 2);
  const got = addScore(W, pts);
  W.stats.cores++; W.stats.bestChain = Math.max(W.stats.bestChain, W.chain);
  if (c.rush) W.rushGot++;
  W.ev.push({ k: 'collect', id: c.id, x: c.x, y: c.y, pts: got, chain: W.chain, air, pid: p.id, rush: c.rush });
}

// ------------------------------------------------------------------ power-ups
function maybeDrop(W, r) {
  if (W.pickups.length >= DROP.max || W.kind === 'corerush') return;
  if (rand(W) > DROP.chance * (W.R.drop || 1)) return;
  const w = {};
  for (const k of PW_KEYS) w[k] = POWERUPS[k].w;
  addPickup(W, r.x, clamp(r.y + 1.6, 4, H - 3), pickW(W, w));
}
export function addPickup(W, x, y, kind) {
  const q = { id: W.nextId++, kind, x: wrap(x), y, t: 0, life: DROP.life, gone: false };
  W.pickups.push(q);
  W.ev.push({ k: 'drop', id: q.id, kind, x: q.x, y: q.y });
  return q;
}
function pickups(W, dt) {
  for (const q of W.pickups) { q.t += dt; if (q.t >= q.life) q.gone = true; }
  W.pickups = W.pickups.filter((q) => !q.gone);
}
function collectPickup(W, q, p) {
  q.gone = true;
  const P = POWERUPS[q.kind];
  if (q.kind === 'slow') W.slow = P.time; else p.pw[q.kind] = P.time;
  W.ev.push({ k: 'pickup', pid: p.id, kind: q.kind, x: q.x, y: q.y });
}

// ------------------------------------------------------------------ hazards: sea spouts, spire lightning, arcs, crumbling ledges, boss tells
function spoutTop(W, x) {
  let top = 15;
  for (const L of W.ledges) { const a = Math.abs(dX(L.x, x)); if (L.st !== 2 && a < L.w + 0.6) top = Math.min(top, L.y - F.ledgeT - rockDrop(L.w, Math.max(0, a - 0.65))); }
  return Math.max(1.2, top);
}
export function addSpout(W, x, T) {
  const h = { id: W.nextId++, k: 'spout', x: wrap(x), w: 1.3, top: spoutTop(W, x), t: 0, T: T ?? W.R.warn * 1.3, A: 1.7 };
  W.haz.push(h);
  W.ev.push({ k: 'spoutwarn', x: h.x, T: h.T });
  tut(W, 'spout');
  return h;
}
function spout(W) {
  const T = anyPlayer(W);
  const near = W.mode === 'campaign' && W.sector === 0 ? 4 : 2.5;
  addSpout(W, T.x + rr(W, near, 12) * (rand(W) < 0.5 ? -1 : 1));
}
function boltBottom(W, x) {
  let b = 0;
  for (const L of W.ledges) if (L.st !== 2 && Math.abs(dX(L.x, x)) < L.w && L.y > b) b = L.y;
  return b;
}
export function addBolt(W, x, T) {
  const h = { id: W.nextId++, k: 'bolt', x: wrap(x), w: 1.25, bot: 0, t: 0, T: T ?? W.R.warn * 1.35, A: 0.3 };
  h.bot = boltBottom(W, h.x);
  W.haz.push(h);
  W.ev.push({ k: 'boltwarn', x: h.x, T: h.T });
  tut(W, 'bolt');
  return h;
}
function bolt(W) { const T = anyPlayer(W); addBolt(W, T.x + rr(W, -5, 5)); }
function crumble(W) {
  const T = anyPlayer(W);
  const list = W.ledges.filter((L) => L.c && L.st === 0 && Math.abs(dX(L.x, T.x)) < 30);
  if (!list.length) return;
  const L = list[Math.floor(rand(W) * list.length)];
  L.st = 1; L.t = 0; L.T = 1.5 + W.R.warn;
  W.crumbled++;
  W.ev.push({ k: 'crack', id: L.id, x: L.x, y: L.y, T: L.T });
}
// is (x, y) feet position inside an active hazard?
export function inHazard(W, h, x, y, pad = 0) {
  switch (h.k) {
    case 'spout': return Math.abs(dX(h.x, x)) < h.w + 0.55 + pad && y < h.top * (pad ? 1 : Math.min(1, (h.t - h.T) / 0.25)) + pad;
    case 'bolt': return Math.abs(dX(h.x, x)) < h.w + 0.45 + pad && y + F.hh > h.bot - pad;
    case 'arc': return segD(dX(h.x, x), y + 1 - h.y, h.dx, h.dy) < ENEMY.stormcaller.arcR + 0.55 + pad;
    case 'beam': { const d = dX(h.x, x) * h.dir; return d > -1 && d < h.len + pad && Math.abs(y + 1 - h.y) < 0.95 + pad; }
    case 'slam': { const L = W.ledges[h.ledge]; return !!L && Math.abs(dX(L.x, x)) < L.w + 0.6 + pad && y > L.y - 0.3 - pad && y < L.y + 2.6 + pad; }
    default: return false;
  }
}
function segD(px, py, dx, dy) {
  const l2 = dx * dx + dy * dy || 1;
  const t = clamp((px * dx + py * dy) / l2, 0, 1);
  return Math.hypot(px - dx * t, py - dy * t);
}
function hazards(W, dt) {
  for (const h of W.haz) {
    h.t += dt;
    if (h.t >= h.T && !h.fired) { h.fired = true; fireHazard(W, h); }
    if (h.t >= h.T && h.t < h.T + h.A && h.k !== 'gust' && h.k !== 'drop' && h.k !== 'line') {
      for (const p of W.players) if (p.alive && !p.remote && inHazard(W, h, p.x, p.y)) hurt(W, p, h.k, { dir: Math.sign(dX(h.x, p.x) || 1) });
      if (h.k === 'spout' || h.k === 'bolt' || h.k === 'slam') for (const r of W.riders) if (r.alive && r.hitT <= 0 && inHazard(W, h, r.x, r.y)) unhorse(W, r, null, h.k);
    }
    if (h.t >= h.T + h.A) h.done = true;
  }
  W.haz = W.haz.filter((h) => !h.done);
  for (const L of W.ledges) {
    if (L.st !== 1) continue;
    L.t += dt;
    if (L.t >= L.T) {
      L.st = 2;
      for (const b of [...W.players, ...W.riders]) if (b.on === L.id) b.on = -1;
      for (const c of W.cores) if (c.on === L.id) { c.on = -1; c.st = 'fall'; }
      W.ev.push({ k: 'crumble', id: L.id, x: L.x, y: L.y });
    }
  }
}
function fireHazard(W, h) {
  switch (h.k) {
    case 'spout': h.top = spoutTop(W, h.x); W.ev.push({ k: 'spout', x: h.x, top: h.top }); break;
    case 'bolt': h.bot = boltBottom(W, h.x); W.ev.push({ k: 'bolt', x: h.x, bot: h.bot }); break;
    case 'arc': W.ev.push({ k: 'arc', x: h.x, y: h.y, dx: h.dx, dy: h.dy }); break;
    case 'beam': W.ev.push({ k: 'beam', x: h.x, y: h.y, dir: h.dir, len: h.len }); break;
    case 'slam': { const L = W.ledges[h.ledge]; W.ev.push({ k: 'slam', x: L ? L.x : h.x, y: L ? L.y : 0, w: L ? L.w : 3 }); break; }
    case 'gust':
      for (const p of W.players) {
        if (!p.alive || p.remote) continue;
        const dx = dX(h.x, p.x);
        if (Math.abs(dx) < h.r && Math.abs(p.y - h.y) < 9) { p.vx = Math.sign(dx || 1) * 13 * (1 - Math.abs(dx) / h.r * 0.4); p.vy = Math.min(p.vy, -2.5); p.on = -1; }
      }
      W.ev.push({ k: 'gust', x: h.x, y: h.y, r: h.r });
      break;
    case 'drop':
      W.shots.push({ id: W.nextId++, kind: h.kind, x: h.x, y: H - 0.6, vx: 0, vy: -15, r: 0.55, life: 4, home: 0 });
      W.ev.push({ k: 'dropfall', x: h.x, kind: h.kind });
      break;
  }
}

// ------------------------------------------------------------------ projectiles (boss shards, molten blobs, icicles, eclipse orbs)
function shots(W, dt) {
  for (const s of W.shots) {
    s.life -= dt;
    if (s.home) {
      const T = nearestPlayer(W, s.x, s.y);
      if (T) {
        const dx = dX(s.x, T.x), dy = T.y + 1 - s.y, l = Math.hypot(dx, dy) || 1, v = Math.hypot(s.vx, s.vy) || s.home;
        const k = Math.min(1, 1.6 * dt);
        s.vx += (dx / l * s.home - s.vx) * k; s.vy += (dy / l * s.home - s.vy) * k;
        void v;
      }
    }
    if (s.kind === 'blob' || s.kind === 'ice') s.vy -= 9 * dt;
    const oy = s.y;
    s.x = wrap(s.x + s.vx * dt); s.y += s.vy * dt;
    if (s.y < F.sea) { s.gone = true; W.ev.push({ k: 'shatter', x: s.x, y: 0.2, kind: s.kind, sea: 1 }); continue; }
    if (s.y > H + 1 || s.life <= 0) { s.gone = true; if (s.kind === 'orb') W.ev.push({ k: 'shatter', x: s.x, y: s.y, kind: s.kind }); continue; }
    if (s.vy < 0 && s.kind !== 'orb') {
      const L = ledgeUnder(W, s.x, oy);
      if (L && s.y <= L.y) { s.gone = true; W.ev.push({ k: 'shatter', x: s.x, y: L.y, kind: s.kind }); continue; }
    }
    for (const p of W.players) {
      if (!p.alive || p.remote) continue;
      const dx = dX(p.x, s.x), dy = s.y - (p.y + 1);
      if (Math.abs(dx) > s.r + 1 || Math.abs(dy) > s.r + 1.2) continue;
      if (s.kind === 'orb' && p.y + F.lanceH + lanceBonus(W, p) > s.y + BOSSES.sovereign.orb.pop) { s.gone = true; addScore(W, SCORE.orb); W.ev.push({ k: 'orbpop', x: s.x, y: s.y, pid: p.id }); p.vy = Math.max(p.vy, 4); break; }
      s.gone = true; hurt(W, p, s.kind, { dir: Math.sign(-dx || 1) }); W.ev.push({ k: 'shatter', x: s.x, y: s.y, kind: s.kind });
      break;
    }
  }
  W.shots = W.shots.filter((s) => !s.gone);
}

// ------------------------------------------------------------------ the Stormhunter
const HW_H = 0.9, HH_H = 1.3;   // the Stormhunter's box for the ledges and their rock
function summonHunter(W) {
  const T = anyPlayer(W), side = rand(W) < 0.5 ? -1 : 1;
  W.hunter = { id: W.nextId++, x: wrap(T.x + side * 38), y: rr(W, 13, 20), vx: -side * HUNTER.v * 0.6, vy: 0, face: -side, st: 'warn', t: 0 };
  W.ev.push({ k: 'hunterwarn', x: W.hunter.x, side });
  tut(W, 'hunter');
}
function hunter(W, h, dt) {
  h.t += dt;
  if (h.st === 'leave') { h.vy += 8 * dt; h.x = wrap(h.x + h.vx * dt); h.y += h.vy * dt; solidPush(W, h, HW_H, HH_H); if (h.y > H + 10) W.hunter = null; return; }
  if (h.st === 'warn' && h.t >= HUNTER.warn) { h.st = 'hunt'; W.ev.push({ k: 'hunter', x: h.x, y: h.y }); }
  const T = nearestPlayer(W, h.x, h.y);
  const V = HUNTER.v * Math.max(0.85, W.R.spd);
  if (T) {
    let dx = dX(h.x, T.x), dy = T.y + 1.2 - (h.y + 0.6);
    // a ledge in the way: fly for the end of it that makes the shorter trip
    for (let i = 1; i <= 6; i++) {
      const L = inRock(W, wrap(h.x + dx * i / 6), h.y + dy * i / 6, HW_H, HH_H);
      if (!L || L.id === h.on) continue;
      const ex = dX(h.x, L.x), wy = L.y - 0.6 - (h.y + 0.6);
      let best = 1e9;
      for (const s of [-1, 1]) {
        const wx = ex + s * (L.w + HW_H + 1.2), d = Math.hypot(wx, wy) + Math.hypot(dx - wx, dy - wy);
        if (d < best) { best = d; dx = wx; dy = wy; }
      }
      dx += Math.sign(dx) * 0.5;
      break;
    }
    const l = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, HUNTER.turn * dt);
    h.vx += (dx / l * V - h.vx) * k; h.vy += (dy / l * V * 0.7 - h.vy) * k;
  }
  const sp = Math.hypot(h.vx, h.vy);
  if (sp > V) { h.vx *= V / sp; h.vy *= V / sp; }
  if (h.y < 3 && h.vy < 0) h.vy += 20 * dt;
  h.x = wrap(h.x + h.vx * dt); h.y = clamp(h.y + h.vy * dt, 2.2, H - 1.5);
  h.on = (solidPush(W, h, HW_H, HH_H) || { id: -1 }).id;
  if (Math.abs(h.vx) > 0.4) h.face = Math.sign(h.vx);
}
function hunterContact(W, p, h) {
  const dx = dX(p.x, h.x), dy = h.y - p.y;
  if (Math.abs(dx) > 1.9 || Math.abs(dy) > 1.8 || p.hitT > 0) return;
  const s = Math.sign(dx || 1), lb = lanceBonus(W, p);
  const headOn = p.face === s && Math.sign(h.vx) === -s && Math.abs(p.y + F.lanceH + lb - (h.y + HUNTER.eyeH)) < HUNTER.eyeTol + lb * 0.5;
  p.hitT = 0.35;
  if (headOn) {
    const pts = addScore(W, HUNTER.score);
    W.stats.hunters++;
    W.ev.push({ k: 'hunterdown', x: h.x, y: h.y, pid: p.id, pts });
    W.hunter = null; p.vx = -s * 4;
    return;
  }
  h.vx = s * 9; h.vy = 3;
  if (p.inv > 0) { p.vx = -s * 8; W.ev.push({ k: 'clang', x: wrap(p.x + dx / 2), y: p.y + 1.5, pid: p.id }); return; }
  hurt(W, p, 'hunter', { dir: -s });
}

// ------------------------------------------------------------------ contacts
function contacts(W) {
  for (const p of W.players) {
    if (!p.alive) continue;
    const reach = reachOf(W, p);
    for (const r of W.riders) {
      if (!r.alive || r.hitT > 0 || p.hitT > 0.05) continue;
      const dx = dX(p.x, r.x), dy = r.y - p.y;
      if (Math.abs(dx) > reach || Math.abs(dy) > 2.0) continue;
      duel(W, p, r, dx);
    }
    for (const c of W.cores) if (!c.gone && Math.abs(dX(p.x, c.x)) < F.coreR && c.y > p.y - 0.7 && c.y < p.y + F.hh + 0.5) collectCore(W, c, p);
    for (const q of W.pickups) if (!q.gone && Math.abs(dX(p.x, q.x)) < DROP.r + 0.6 && Math.abs(q.y - (p.y + 1)) < DROP.r + 1) collectPickup(W, q, p);
    if (W.hunter && W.hunter.st === 'hunt') hunterContact(W, p, W.hunter);
    if (W.boss && W.boss.st === 'fight') bossContact(W, p, W.boss);
  }
  if (W.players.length > 1) {
    const [a, b] = W.players;
    if (a.alive && b.alive && a.hitT <= 0 && b.hitT <= 0) {
      const dx = dX(a.x, b.x), dy = b.y - a.y;
      if (Math.abs(dx) < 1.7 && Math.abs(dy) < 1.8) { const s = Math.sign(dx || 1); if (!a.remote) a.vx = -s * 5; if (!b.remote) b.vx = s * 5; a.hitT = b.hitT = 0.25; W.ev.push({ k: 'clang', x: wrap(a.x + dx / 2), y: (a.y + b.y) / 2 + 1.5, soft: 1 }); }
    }
  }
}
function duel(W, p, r, dx) {
  const d = p.y + F.lanceH + lanceBonus(W, p) - (r.y + F.lanceH);
  const s = Math.sign(dx || p.face);
  const front = r.type === 'shieldbearer' && r.face === -s;
  const need = front ? ENEMY.shieldbearer.margin : F.dead;
  if (d > need) { unhorse(W, r, p); p.vy = Math.max(p.vy, 3.6); p.hitT = 0.12; p.on = -1; return; }
  if (d < -F.dead && p.inv <= 0) { r.hitT = 0.5; r.vy = Math.max(r.vy, 3); hurt(W, p, 'lance', { dir: -s, by: r.type }); return; }
  if (!p.remote) { p.vx = -s * F.bounce; p.vy = Math.max(p.vy, 1.5); p.on = -1; }
  r.vx = s * F.bounce; r.vy = Math.max(r.vy, 1.5); r.on = -1;
  r.hitT = 0.3; p.hitT = 0.1; W.stats.clangs++;
  W.ev.push({ k: 'clang', x: wrap(p.x + dx / 2), y: (p.y + r.y) / 2 + F.lanceH, block: front && d > F.dead ? 1 : 0, pid: p.id, bx: -s * F.bounce });
}

// ------------------------------------------------------------------ bosses
function startBoss(W) {
  const key = W.mode === 'campaign' ? SECTORS[W.sector].boss : BOSS_KEYS[W.bossN % BOSS_KEYS.length];
  W.bossN++;
  const D = BOSSES[key], T = anyPlayer(W), k = W.R.bossHP;
  const B = { id: W.nextId++, key, x: wrap(T.x + 30), y: 14, vx: 0, vy: 0, face: -1, t: 0, st: 'in', stT: 2.8, phase: 1, phases: D.phases || 2, atk: 0, cool: 1.6, cur: null, hitT: 0,
    pts: [], seg: [], hp: 0, max: 0, gx: 0, side: 1, sub: 0 };
  const hp = (n) => Math.max(1, Math.round(n * k));
  if (key === 'gale') { B.pts = D.pts.map((q, i) => ({ i, dx: q[0], dy: q[1], r: q[2], hp: 1, max: 1, on: true })); const c = D.core; B.pts.push({ i: 3, dx: c[0], dy: c[1], r: c[2], hp: hp(c[3]), max: hp(c[3]), on: false, core: 1 }); }
  else if (key === 'leviathan') {
    B.y = -6; B.x = wrap(T.x + 20);
    for (let i = 0; i < D.segs; i++) B.seg.push({ x: B.x, y: -6 });
    B.pts = D.pts.map((sIdx, i) => ({ i, seg: sIdx, dx: 0, dy: 1.15, r: 0.8, hp: hp(D.ptHP), max: hp(D.ptHP), on: true }));
  } else {
    B.pts = D.pts.map((q, i) => ({ i, dx: q[0], dy: q[1], r: q[2], hp: hp(q[3]), max: hp(q[3]), on: true }));
    if (key === 'colossus') { B.y = -12; B.x = wrap(T.x + 16); }
    if (key === 'sovereign') { B.y = H + 6; B.x = wrap(T.x + 14); }
  }
  B.hp = B.pts.reduce((a, q) => a + q.hp, 0) * (key === 'sovereign' ? B.phases : 1);
  B.max = B.hp;
  W.boss = B;
  W.ev.push({ k: 'boss', key, x: B.x });
}
const isFlyer = (key) => key === 'gale' || key === 'wyvern' || key === 'sovereign';
export function bossBodies(B) {
  if (B.key === 'leviathan') return B.seg.map((s, i) => ({ x: s.x, y: s.y, rx: i === 0 ? 1.5 : 1.3 - i * 0.05, ry: i === 0 ? 1.2 : 1.05 - i * 0.04 })).filter((s) => s.y > -1);
  const f = B.key === 'colossus' ? 1 : B.face;
  return BOSSES[B.key].body.map(([dx, dy, rx, ry]) => ({ x: wrap(B.x + dx * f), y: B.y + dy, rx, ry }));
}
export function weakPos(B, q) {
  if (B.key === 'leviathan') { const s = B.seg[q.seg]; return [s.x, s.y + q.dy]; }
  return [wrap(B.x + q.dx * (B.key === 'colossus' ? 1 : B.face)), B.y + q.dy];
}
const bossHurts = (B) => !!(B.cur && B.cur.hurt && B.cur.t >= B.cur.T && B.cur.t < B.cur.T + (B.cur.hurtA ?? 1e9));
export { bossHurts };
function bossContact(W, p, B) {
  if (p.hitT > 0) return;
  const lb = lanceBonus(W, p);
  for (const q of B.pts) {
    if (!q.on || q.hp <= 0) continue;
    const [qx, qy] = weakPos(B, q);
    if (qy < 0.3) continue;
    const dx = dX(p.x, qx);
    if (Math.abs(dx) > q.r + 1.05 || p.y + 1 < qy - q.r - 1.2 || p.y + 1 > qy + q.r + 1.4) continue;
    if (p.y + F.lanceH + lb > qy + 0.15) {
      if (B.hitT <= 0) hitWeak(W, B, q, p);
      p.vy = Math.max(p.vy, 7.2); p.vx -= Math.sign(dx || 1) * 1.5; p.on = -1; p.hitT = 0.18;
      return;
    }
    p.vy = Math.min(p.vy, -3); p.vx = -Math.sign(dx || 1) * 5; p.hitT = 0.2;
    W.ev.push({ k: 'clang', x: qx, y: qy, pid: p.id });
    return;
  }
  for (const b of bossBodies(B)) {
    const dx = dX(b.x, p.x), dy = p.y + 1 - b.y;
    const nx = dx / (b.rx + 0.9), ny = dy / (b.ry + 1.05);
    if (nx * nx + ny * ny >= 1) continue;
    const above = ny > 0.55;
    if (!above && bossHurts(B) && p.inv <= 0) hurt(W, p, 'boss', { dir: Math.sign(dx || 1) });
    const l = Math.hypot(nx, ny) || 1;
    if (p.alive) { p.vx = (nx / l) * 8 + (B.vx || 0) * 0.5; p.vy = above ? Math.max(5, p.vy) : (ny / l) * 6 + 1; p.on = -1; p.hitT = 0.15; }
    W.ev.push({ k: 'clang', x: p.x, y: p.y + 1, pid: p.id, soft: 1 });
    return;
  }
}
function hitWeak(W, B, q, p) {
  q.hp--; B.hp--; B.hitT = 0.4;
  const pts = addScore(W, SCORE.wp);
  const [qx, qy] = weakPos(B, q);
  W.ev.push({ k: 'bosshit', x: qx, y: qy, pid: p.id, pts, left: B.hp, of: B.max });
  if (q.hp > 0) return;
  q.on = false;
  W.ev.push({ k: 'wpdown', x: qx, y: qy, i: q.i, key: B.key });
  if (B.key === 'gale') {
    if (q.core) { defeatBoss(W, B); return; }
    if (B.pts.every((o) => o.core || o.hp <= 0)) { const c = B.pts.find((o) => o.core); c.on = true; B.phase = 2; B.atk = 0; W.ev.push({ k: 'bossphase', phase: 2, key: B.key }); }
    return;
  }
  if (B.key === 'sovereign') {
    if (B.phase >= B.phases) { defeatBoss(W, B); return; }
    B.phase++; B.atk = 0; B.st = 'shift'; B.stT = 1.8; B.cur = null; q.hp = q.max; q.on = true;
    W.haz = W.haz.filter((h) => h.src !== 'boss');
    W.ev.push({ k: 'bossphase', phase: B.phase, key: B.key });
    return;
  }
  if (B.pts.every((o) => o.hp <= 0)) { defeatBoss(W, B); return; }
  if (B.phase === 1 && B.hp <= B.max / 2) { B.phase = 2; B.atk = 0; W.ev.push({ k: 'bossphase', phase: 2, key: B.key }); }
}
function defeatBoss(W, B) {
  B.st = 'down'; B.stT = 2.8; B.cur = null; B.vx *= 0.3;
  W.haz = W.haz.filter((h) => h.src !== 'boss'); W.shots = [];
  for (const r of W.riders) { r.alive = false; W.ev.push({ k: 'flee', id: r.id, x: r.x, y: r.y }); }
  W.portals = [];
  W.ev.push({ k: 'bossdown', key: B.key, x: B.x, y: B.y });
}
function finishBoss(W, B) {
  W.boss = null;
  if (W.mode === 'campaign') {
    addScore(W, SCORE.boss + SCORE.sector);
    W.over = true; W.result = 'clear';
    W.ev.push({ k: 'sectorclear', sector: W.sector });
  } else { addScore(W, SCORE.boss); waveClear(W, 'boss'); }
}
function boss(W, B, dt) {
  B.t += dt; B.hitT = Math.max(0, B.hitT - dt); B.stT -= dt;
  const D = BOSSES[B.key], rate = W.R.bossRate;
  const T = nearestPlayer(W, B.x, B.y) || anyPlayer(W);
  if (B.st === 'down') {
    if (B.key === 'colossus' || B.key === 'leviathan') B.y -= 3 * dt; else { B.vy -= 6 * dt; B.y += B.vy * dt; B.x = wrap(B.x + B.vx * dt); }
    if (B.key === 'leviathan') for (const s of B.seg) s.y -= 3 * dt;
    if (B.stT <= 0) finishBoss(W, B);
    return;
  }
  if (B.st === 'in') {
    if (B.key === 'colossus') B.y = Math.min(0, B.y + 5 * dt);
    else if (B.key === 'sovereign') B.y += (15 - B.y) * Math.min(1, dt * 1.6);
    else if (B.key === 'gale' || B.key === 'wyvern') { B.x = wrap(B.x + dX(B.x, wrap(T.x + 14)) * Math.min(1, dt * 1.2)); B.y += (14 - B.y) * Math.min(1, dt); }
    if (B.key === 'leviathan') levSegs(B, dt, T);
    if (B.stT <= 0) { B.st = 'fight'; B.cool = 1.0; }
    return;
  }
  if (B.st === 'shift') {
    // the Sovereign folds into the dark and comes back elsewhere
    if (B.stT > 0.9) B.y += 8 * dt; else if (!B.moved) { B.moved = true; B.x = wrap(T.x + (rand(W) < 0.5 ? -1 : 1) * 16); B.y = 16; }
    if (B.stT <= 0) { B.st = 'fight'; B.moved = false; B.cool = 0.8; }
    return;
  }
  // movement
  const busy = B.cur && B.cur.t < B.cur.T + (B.cur.A || 0);
  if (isFlyer(B.key)) {
    if (B.cur && B.cur.kind === 'dive' && B.cur.t >= B.cur.T) diveMove(W, B, dt);
    else {
      if (rand(W) < dt * 0.12) B.side = -B.side;
      const gx = wrap(T.x + B.side * 10), [a0, a1] = D.alt;
      let gy = (a0 + a1) / 2 + (a1 - a0) / 2 * Math.sin(B.t * 0.45);
      // it flies in the open air between the ledges where it can: a few times a second it picks the height in its
      // band that keeps its body clearest of slabs and rock, here and where it is heading, nearest the sweep
      B.clrT = (B.clrT || 0) - dt;
      if (B.clrT <= 0) { B.clrT = 0.25; B.clrY = bossClearY(W, B, gx, gy, a0, a1); }
      if (B.clrY !== undefined) gy = B.clrY;
      const v = D.v * (0.85 + 0.15 * rate) * (B.phase > 1 ? 1.15 : 1) * (busy ? 0.35 : 1);
      B.vx += (clamp(dX(B.x, gx) * 0.7, -v, v) - B.vx) * Math.min(1, dt * 1.4);
      B.vy += (clamp((gy - B.y) * 0.8, -v * 0.6, v * 0.6) - B.vy) * Math.min(1, dt * 1.4);
      B.x = wrap(B.x + B.vx * dt); B.y = clamp(B.y + B.vy * dt, 4, H - 3);
      B.face = dX(B.x, T.x) > 0 ? 1 : -1;
    }
  } else if (B.key === 'colossus') {
    const gx = wrap(T.x + B.side * 7);
    if (rand(W) < dt * 0.06) B.side = -B.side;
    const v = D.v * (busy ? 0.2 : 1) * (B.phase > 1 ? 1.25 : 1);
    B.vx += (clamp(dX(B.x, gx) * 0.5, -v, v) - B.vx) * Math.min(1, dt * 1.5);
    B.x = wrap(B.x + B.vx * dt); B.y = 0;
    B.face = dX(B.x, T.x) > 0 ? 1 : -1;
  } else if (B.key === 'leviathan') levSegs(B, dt, T);
  // attacks
  if (!B.cur) {
    B.cool -= dt;
    if (B.cool <= 0) beginAttack(W, B, T);
  } else {
    const c = B.cur;
    c.t += dt;
    if (!c.fired && c.t >= c.T) { c.fired = true; fireAttack(W, B, T); }
    if (c.t >= c.T + c.A) { B.cur = null; B.cool = (2.3 / rate) * (B.phase > 1 ? 0.78 : 1) * (B.phase > 2 ? 0.85 : 1) * rr(W, 0.85, 1.15); }
  }
}
function levSegs(B, dt, T) {
  const c = B.cur;
  if (c && c.kind === 'breach' && c.t >= c.T) {
    // it arcs out of the sea, then lies basking on the surface with its frost cores showing
    const u = (c.t - c.T) / c.hurtA, by = BOSSES.leviathan.baskY ?? 1.4;
    if (u <= 1) B.seg.forEach((s, i) => {
      const q = u * 1.3 - i * 0.06;
      s.x = wrap(c.x + c.dir * (q - 0.5) * 20);
      s.y = q < 0 ? -4 : q > 1 ? by : -2.5 + 15 * (1 - (2 * q - 1) * (2 * q - 1));
    });
    else {
      const b = (c.t - c.T - c.hurtA) / (c.A - c.hurtA), sink = b > 0.82 ? (b - 0.82) / 0.18 : 0;
      B.seg.forEach((s, i) => { s.x = wrap(c.x + c.dir * (16 - i * 1.2)); s.y = by + Math.sin(B.t * 2 + i * 0.8) * 0.15 - sink * 6; });
    }
    B.x = B.seg[0].x; B.y = B.seg[0].y; B.face = c.dir;
    return;
  }
  if (c && c.kind === 'breath') {
    // the head rears out of the sea to breathe frost
    const hx = c.x, up = c.t < c.T + c.A ? Math.min(1, c.t / 0.6) : 0;
    const top = (c.by ?? 6) + 2.5;
    B.seg.forEach((s, i) => { s.x = wrap(hx - c.dir * i * 1.6); s.y = i === 0 ? -3 + top * up : i < 3 ? -3 + Math.max(0, top - i * 3) * up : -4; });
    B.x = B.seg[0].x; B.y = B.seg[0].y; B.face = c.dir;
    return;
  }
  // under the waves, shadowing you
  const v = BOSSES.leviathan.v;
  B.vx += (clamp(dX(B.x, T.x) * 0.6, -v, v) - B.vx) * Math.min(1, dt * 1.2);
  B.x = wrap(B.x + B.vx * dt); B.y = -6;
  B.seg.forEach((s, i) => { s.x = wrap(B.x - Math.sign(B.vx || 1) * i * 1.7); s.y = -6; });
}
// how much of a flying boss's body (its ellipses, a little fattened, sampled round the edge and through the middle)
// would be inside a slab or rock with the boss at (x, y)
function bossInRock(W, B, x, y) {
  let n = 0;
  for (const [dx, dy, rx, ry] of BOSSES[B.key].body) {
    const cx = x + dx * B.face, cy = y + dy;
    for (let k = 0; k < 10; k++) {
      const a = k * 0.6283, px = k < 8 ? cx + Math.cos(a * 1.25) * (rx + 0.5) : cx + (k === 8 ? -0.5 : 0.5) * rx, py = k < 8 ? cy + Math.sin(a * 1.25) * (ry + 0.5) : cy;
      for (const L of W.ledges) {
        if (L.st === 2) continue;
        const d = dX(L.x, px);
        if (Math.abs(d) < L.w + 0.3 && py < L.y + 0.6 && py > L.y - F.ledgeT - rockDrop(L.w, d) - 0.3) { n++; break; }
      }
    }
  }
  return n;
}
function bossClearY(W, B, gx, gy, a0, a1) {
  let best = gy, bs = 1e9;
  for (let y = a0; y <= a1 + 1e-6; y += 0.75) {
    const s = bossInRock(W, B, B.x, y) * 6 + bossInRock(W, B, gx, y) * 3 + Math.abs(y - gy) * 0.6 + Math.abs(y - B.y) * 0.25;
    if (s < bs) { bs = s; best = y; }
  }
  return best;
}
function diveMove(W, B, dt) {
  const c = B.cur, sp = 16 * Math.min(1.3, W.R.bossRate + 0.15);
  const l = Math.hypot(c.dx, c.dy) || 1;
  B.vx = c.dx / l * sp; B.vy = c.dy / l * sp;
  B.x = wrap(B.x + B.vx * dt); B.y = clamp(B.y + B.vy * dt, 3, H - 3);
  c.go += sp * dt;
  if (c.go > l + 6) c.A = c.t - c.T;   // done
  B.face = c.dx > 0 ? 1 : -1;
}
function beginAttack(W, B, T) {
  const D = BOSSES[B.key];
  const list = B.phase >= 3 && D.p3 ? D.p3 : B.phase >= 2 ? D.p2 : D.atk;
  let kind = list[B.atk % list.length];
  B.atk++;
  const warn = W.R.warn;
  if (kind === 'summon' && W.riders.length + W.portals.length >= 2 + (B.phase > 1 ? 1 : 0)) kind = list.find((k) => k !== 'summon') || 'gust';
  const c = { kind, t: 0, T: warn, A: 0.5, fired: false, hurt: false };
  const tx = T.x, ty = T.y;
  switch (kind) {
    case 'gust': c.T = warn * 1.4; c.A = 0.6; W.haz.push({ id: W.nextId++, k: 'gust', src: 'boss', x: B.x, y: B.y, r: 16, t: 0, T: c.T, A: 0.3 }); break;
    case 'summon': c.T = warn; c.A = 0.4; W.haz.push({ id: W.nextId++, k: 'charge', src: 'boss', kind, t: 0, T: c.T, A: 0 }); break;
    case 'dive': {
      c.T = warn * 1.3; c.hurt = true; c.A = 3; c.go = 0;
      c.dx = dX(B.x, tx); c.dy = (ty + 0.6) - B.y;
      W.haz.push({ id: W.nextId++, k: 'line', src: 'boss', x: B.x, y: B.y, dx: c.dx, dy: c.dy, t: 0, T: c.T, A: 0 });
      break;
    }
    case 'shards': c.T = warn * 1.1; c.A = 0.4; c.tx = tx; c.ty = ty + 1; W.haz.push({ id: W.nextId++, k: 'line', src: 'boss', x: B.x, y: B.y + 0.5, dx: dX(B.x, tx), dy: ty + 1 - B.y - 0.5, t: 0, T: c.T, A: 0 }); break;
    case 'beam': {
      c.T = warn * 1.3; c.A = 0.8;
      const dir = dX(B.x, tx) > 0 ? 1 : -1; B.face = dir;
      W.haz.push({ id: W.nextId++, k: 'beam', src: 'boss', x: B.x, y: B.y + 0.4, dir, len: 22, t: 0, T: c.T, A: 0.7 });
      break;
    }
    case 'blast': {
      // the Colossus vents its furnace in a level jet at your height
      c.T = warn * 1.3; c.A = 0.8;
      const dir = dX(B.x, tx) > 0 ? 1 : -1;
      W.haz.push({ id: W.nextId++, k: 'beam', src: 'boss', x: wrap(B.x + dir * 1.5), y: clamp(ty + 1, 3.5, 13), dir, len: 26, t: 0, T: c.T, A: 0.7 });
      break;
    }
    case 'slam': {
      c.T = warn * 1.5; c.A = 0.6;
      let best = null, bd = 1e9;
      for (const L of W.ledges) { if (L.st === 2 || L.y > 13) continue; const d = Math.abs(dX(L.x, tx)) + Math.abs(L.y - ty) * 0.6; if (d < bd && Math.abs(dX(B.x, L.x)) < 20) { bd = d; best = L; } }
      if (best) W.haz.push({ id: W.nextId++, k: 'slam', src: 'boss', ledge: best.id, x: best.x, t: 0, T: c.T, A: 0.35 });
      else { kind = c.kind = 'molten'; }
      c.side = best ? (dX(B.x, best.x) > 0 ? 1 : -1) : 1;
      if (best) break;
    }
    // falls through for molten when there is no ledge to slam
    // eslint-disable-next-line no-fallthrough
    case 'molten': case 'icicles': {
      c.T = warn * 1.4; c.A = 1;
      const nd = D.drops || [3, 5], n = nd[B.phase > 1 ? 1 : 0], kd = kind === 'icicles' ? 'ice' : 'blob';
      const sp = D.spread || 8;
      for (let i = 0; i < n; i++) W.haz.push({ id: W.nextId++, k: 'drop', src: 'boss', kind: kd, x: wrap(tx + (i === 0 ? 0 : rr(W, -sp, sp))), t: 0, T: c.T + i * 0.12, A: 0 });
      break;
    }
    case 'breach': {
      c.T = warn * 1.6; c.hurtA = 2.8 / Math.min(1.2, W.R.bossRate); c.A = c.hurtA + BOSSES.leviathan.bask; c.hurt = true;
      c.dir = rand(W) < 0.5 ? -1 : 1; c.x = wrap(tx + rr(W, -2, 2));
      W.haz.push({ id: W.nextId++, k: 'line', src: 'boss', x: wrap(c.x - c.dir * 11), y: 0.2, dx: c.dir * 22, dy: 0, t: 0, T: c.T, A: 0, sea: 1 });
      break;
    }
    case 'breath': {
      c.T = warn * 1.5; c.A = 1.0;
      c.dir = rand(W) < 0.5 ? -1 : 1; c.x = wrap(tx - c.dir * 13);
      c.by = clamp(ty + 1, 3.5, 12);   // frost at your height: climb or drop out of it
      W.haz.push({ id: W.nextId++, k: 'beam', src: 'boss', x: c.x, y: c.by, dir: c.dir, len: 24, t: 0, T: c.T, A: 0.8 });
      break;
    }
    case 'orbs': c.T = warn; c.A = 0.4; W.haz.push({ id: W.nextId++, k: 'charge', src: 'boss', kind, t: 0, T: c.T, A: 0 }); break;
    case 'storm': {
      c.T = warn * 1.35; c.A = 0.6;
      for (const o of BOSSES.sovereign.storm) addBolt(W, tx + o + rr(W, -0.6, 0.6), c.T).src = 'boss';
      addSpout(W, tx + (rand(W) < 0.5 ? -1 : 1) * rr(W, 6, 9), c.T * 1.1).src = 'boss';
      break;
    }
  }
  B.cur = c;
  W.ev.push({ k: 'bossatk', kind: c.kind, T: c.T, key: B.key });
}
function fireAttack(W, B, T) {
  const c = B.cur;
  switch (c.kind) {
    case 'summon': {
      const s = W.mode === 'campaign' ? W.sector : 2;
      // summonN riders at once (the Leviathan calls a pair), reaver share per boss
      const D = BOSSES[B.key], nS = (D.summonN || 1) + (D.summonN > 1 ? (DIFFICULTY[W.diff] || {}).summonAdd || 0 : 0);   // hard: a pack of 3
      for (let k = 0; k < nS; k++) {
        const px = wrap(B.x + (k === 0 ? 0 : k % 2 ? 4 : -4));
        const type = s >= 3 && rand(W) < (D.reavers ?? 0.4) ? 'reaver' : s >= 1 ? 'lancer' : 'skirmisher';
        W.portals.push({ id: W.nextId++, x: px, y: clearY(W, px, clamp(B.y + 2 + k, 3, H - 3)), ledge: -1, t: 0, T: 0.3, type, elite: false, role: 0, partner: 0 });
      }
      W.ev.push({ k: 'summon', x: B.x, y: B.y });
      break;
    }
    case 'shards': {
      const sn = BOSSES[B.key].shards || [3, 5], n = sn[B.phase > 1 ? 1 : 0], dx = dX(B.x, c.tx), dy = c.ty - (B.y + 0.5), a = Math.atan2(dy, dx), v = 10 * Math.min(1.25, 0.8 + 0.25 * W.R.bossRate);
      for (let i = 0; i < n; i++) { const q = a + (i - (n - 1) / 2) * 0.2; W.shots.push({ id: W.nextId++, kind: 'shard', x: B.x, y: B.y + 0.5, vx: Math.cos(q) * v, vy: Math.sin(q) * v, r: 0.42, life: 4, home: 0 }); }
      W.ev.push({ k: 'shards', x: B.x, y: B.y });
      break;
    }
    case 'orbs': {
      const O = BOSSES.sovereign.orb, n = O.n[Math.min(O.n.length, B.phase) - 1];
      for (let i = 0; i < n; i++) { const q = (i / n) * Math.PI * 2; W.shots.push({ id: W.nextId++, kind: 'orb', x: wrap(B.x + Math.cos(q) * 2), y: B.y + Math.sin(q) * 2, vx: Math.cos(q) * 3, vy: Math.sin(q) * 3, r: 0.6, life: O.life, home: O.home * Math.min(1.2, W.R.bossRate) }); }
      W.ev.push({ k: 'orbs', x: B.x, y: B.y });
      break;
    }
    case 'slam': W.ev.push({ k: 'arm', x: B.x, side: c.side }); break;
    case 'breach': W.ev.push({ k: 'breach', x: c.x, dir: c.dir }); break;
    default: break;
  }
  void T;
}

// ------------------------------------------------------------------ online guest: only its own rider runs here
function guestLocal(W, dt, md) {
  // between the host's snapshots (20 Hz) everything the host runs glides on its last velocity for up to
  // 0.25 s, so riders, shots, the boss and the host's own rider move smoothly instead of in 50 ms hops
  W.snapAge = (W.snapAge || 0) + dt;
  if (W.snapAge < 0.25) {
    for (const r of W.riders) { r.x = wrap(r.x + r.vx * md); r.y = Math.max(0.3, Math.min(F.H, r.y + r.vy * md)); }
    for (const q of W.shots) { q.x = wrap(q.x + q.vx * md); q.y += q.vy * md; }
    const h = W.players[0];
    if (h && h.remote && h.alive && h.on < 0) { h.x = wrap(h.x + h.vx * dt); h.y = Math.max(0.3, Math.min(F.H, h.y + h.vy * dt)); }
    if (W.hunter) { W.hunter.x = wrap(W.hunter.x + W.hunter.vx * md); W.hunter.y += W.hunter.vy * md; }
    if (W.boss) { W.boss.x = wrap(W.boss.x + (W.boss.vx || 0) * md); W.boss.y += (W.boss.vy || 0) * md; }
  }
  const me = W.players[1];
  if (!me || !me.alive) return;
  for (const h of W.haz) { h.t += md; if (h.t >= h.T && h.t < h.T + h.A && h.k !== 'gust' && h.k !== 'drop' && h.k !== 'line' && inHazard(W, h, me.x, me.y)) { if (me.inv <= 0) { me.inv = F.hitInv; W.claims.push({ hit: h.k }); } } }
}
export function adoptWave(W, wave, waveN, kind, k) {
  if (k !== undefined && k !== W.k) { W.k = k; buildLedges(W); }
  if (W.wave === wave && W.waveN === waveN && W.kind === kind) return;
  W.wave = wave; W.waveN = waveN; W.kind = kind;
  W.R = applyDiff(W.mode === 'campaign' ? rampAt(W.sector, Math.min(wave, WAVES - 1)) : rampLevel(endlessLevel(W.fightT)), W.diff);
}
// the host applies a guest's claims (deaths it saw, hazard hits)
export function applyClaim(W, p, c) {
  if (c.dead && p.alive) { p.alive = false; p.deadT = 0; W.lives = Math.max(0, W.lives - 1); W.stats.deaths++; W.waveDeaths++; W.chain = 0; W.lastDeathN = W.n; W.ev.push({ k: 'death', pid: p.id, x: p.x, y: p.y, cause: c.cause || 'sea', remote: 1, lives: W.lives }); }
  if (c.hit && p.alive) hurt(W, p, c.hit, {});
}
