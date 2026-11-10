// Skyhold 2026 simulation: fixed 120 Hz steps, all randomness from the world's own seeded generator (W.rs),
// plain data only, so a world can be cloned and re-run bit for bit (replays, online, tests).
// Nothing in here touches the DOM, WebGL or audio; it only pushes events into W.ev.
//
// The world is a band round a small planet: x along the ground (wraps every C metres), y altitude (0..H).
import { F, STEP, C, H, ENEMY, SETTLER, BOSSES, B_KEYS, SECTORS, WAVES, rampAt, rampLevel, endlessLevel, ENDLESS, TUTOR, SCORE, START_LIVES, DIFFICULTY, applyDiff, POWERUPS, PW_KEYS, DROP, SKIM, HYPER, EVENTS, EVENT, PHASE2, B_KEYS as _BK, SHIPS, SHIP_KEYS, RIVALS, INTERSECT, WHIRL, COIL, SCORCH, MAW, GATE, SPECIALS, SPECIAL } from './config.js?v=20';
export { STEP };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
// the planet wraps round: the shortest way between two points along the ground may cross the seam
export const wd = (d) => d - C * Math.round(d / C);
export const wp = (x) => x - C * Math.floor(x / C);

// ------------------------------------------------------------------ seeded randomness (state lives in W.rs)
export function rand(W) {
  const s = (W.rs = (W.rs + 0x6D2B79F5) | 0);
  let t = Math.imul(s ^ (s >>> 15), s | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rr = (W, a, b) => a + (b - a) * rand(W);
const D_OF = (W) => DIFFICULTY[W.diff] || DIFFICULTY.normal;
// FEATURED MACHINE (the AI PLAYTHROUGH picker): every wave also brings 2 + (wave / 2) of this machine, as what makes it
// (sparks come from coils, stingers from hive pods, whirlers in rings, lifters as extra lifters)
const FEAT = { lifter: 'lifter', husk: 'husk', sower: 'sower', hive: 'hive', stinger: 'hive', prowler: 'prowler', whirler: 'whirl', coil: 'coil', spark: 'coil', scorcher: 'scorcher', maw: 'maw' };
const HOSTILE = new Set(['lifter', 'husk', 'sower', 'hive', 'stinger', 'prowler', 'whirler', 'coil', 'spark', 'scorcher', 'maw']);

// ------------------------------------------------------------------ world
// o: { seed, mode 'campaign'|'endless', sector, cp (wave to start from, 4 = the carrier), up, lives, score, diff, demo, coop, noTut, assist, nova }
export function makeWorld(o = {}) {
  const seed = (o.seed ?? 1) | 0, mode = o.mode === 'endless' ? 'endless' : 'campaign', sector = mode === 'endless' ? 0 : o.sector || 0;
  const W = {
    n: 0, t: 0, seed, rs: (seed ^ 0x2545F491) | 0, mode, sector, k: sector, up: { ...(o.up || {}) }, demo: !!o.demo, coop: !!o.coop || !!o.rivals, rivals: !!o.rivals, feat: FEAT[o.feat] ? o.feat : null,
    diff: DIFFICULTY[o.diff] ? o.diff : 'normal', lives: o.lives ?? START_LIVES + D_OF({ diff: o.diff }).lives, score: o.score || 0, lifePts: 0, nextLife: 0,
    wave: 0, cp: 0, phase: 'intro', phaseT: 2.4, secT: 0, waveT: 0, fightT: 0, R: null, level: 0, waveN: 0, bossN: 0,
    players: [], enemies: [], settlers: [], sites: [], shots: [], bolts: [], pods: [], missiles: [], rings: [], gate: null, boss: null, plan: null, special: null, fallen: false,
    nextId: 1, ev: [], over: false, result: null, net: null, claims: [], chain: 0, chainT: -9, bestChain: 0, cpNova: [], tutorial: false, tut: {},
    stats: { kills: 0, lifters: 0, husks: 0, caught: 0, landed: 0, selfLanded: 0, lost: 0, fused: 0, fired: 0, hits: 0, novas: 0, blinks: 0, deaths: 0, shieldHits: 0, pods: 0,
      waveDeaths: [0, 0, 0, 0, 0], waveHits: [0, 0, 0, 0, 0], waveTries: [0, 0, 0, 0, 0], cause: {}, bossT: -1 },
  };
  const LE = SCORE.lifeEvery * D_OF(W).score;
  W.lifePts = W.score;
  W.nextLife = (Math.floor(W.lifePts / LE) + 1) * LE;
  const cp = clamp(o.cp | 0, 0, WAVES);
  W.wave = cp; W.cp = cp;
  W.tutorial = mode === 'campaign' && !o.noTut && sector === 0 && cp === 0 && !o.demo;
  W.R = ramp(W);
  makeColony(W);
  const n = o.coop ? 2 : 1;
  for (let i = 0; i < n; i++) W.players.push(makePlayer(W, i + 1, wp(W.sites[0] - 12 + i * 6), o));
  W.gate = { x: wp(W.sites[0] + C / 2), y: GATE.y };
  for (const p of W.players) { p.nova = Math.min(F.novaMax, o.nova ?? 3 + (W.up.rack || 0)); p.shield = W.R.shield + (W.up.deflector || 0); }
  W.cpNova[cp] = W.players[0].nova;
  return W;
}
function makePlayer(W, id, x, o) {
  return { id, x, y: 13, vx: 0, vy: 0, face: 1, alive: true, inv: 1.2, shield: 0, nova: 3, fireT: 0, novaT: 0, blinkT: 0, deadT: 0, thrust: 0, hurtT: 0, carry: 0,
    input: { mx: 0, my: 0, fire: false, nova: false, blink: false }, novaHeld: false, blinkHeld: false, remote: false, pw: {}, assist: id === 1 ? +o.assist || 0 : 0, ship: (id === 1 ? o.ship : o.ship2) || 'warden', mast: Math.max(0, Math.min(2, ((id === 1 ? o.mast : o.mast2) | 0))), hyper: 0, hyperK: 0 };
}
export const cloneWorld = (W) => structuredClone(W);
export function drainEvents(W) { const e = W.ev; W.ev = []; return e; }
function ramp(W) {
  if (W.mode === 'endless') { W.level = endlessLevel(W.fightT); return applyDiff(rampLevel(W.level), W.diff); }
  return applyDiff(rampAt(W.sector, W.wave), W.diff);
}
export const CHAIN_T = 2.4;
export const chainMult = (n) => Math.min(4, 1 + Math.floor(n / 4));
export const bossKey = (W) => (W.mode === 'endless' ? B_KEYS[W.k % 5] : SECTORS[W.sector].boss);
const alivePlayers = (W) => W.players.filter((p) => p.alive);
function nearestPlayer(W, x, max = 1e9) {
  let best = null, bd = max;
  for (const p of W.players) { if (!p.alive) continue; const d = Math.abs(wd(p.x - x)); if (d < bd) { bd = d; best = p; } }
  return best;
}
function tut(W, key) { if (!W.tutorial || W.tut[key] || W.demo) return; W.tut[key] = 1; W.ev.push({ k: 'tut', key }); }
const safeNow = (W) => W.tutorial && W.waveT < TUTOR.safe;

// the colony: settlers live round a few sites spread round the planet
function makeColony(W) {
  const N = W.R.settlers, nSites = Math.max(3, Math.ceil(N / 3));
  W.sites = [];
  const off = rr(W, 0, C);
  for (let i = 0; i < nSites; i++) W.sites.push(wp(off + (i + rr(W, -0.18, 0.18)) * (C / nSites)));
  W.settlers = [];
  for (let i = 0; i < N; i++) {
    const home = wp(W.sites[i % nSites] + rr(W, -5, 5));
    W.settlers.push({ id: W.nextId++, x: home, y: 0, home, vx: rand(W) < 0.5 ? -SETTLER.walk : SETTLER.walk, st: 'walk', by: 0, dropY: 0, t: rr(W, 0, 5), mark: 0 });
  }
  W.fallen = false;
}
export const settlersLeft = (W) => W.settlers.filter((s) => s.st !== 'dead').length;

// ------------------------------------------------------------------ the step
export function step(W, dt = STEP) {
  if (W.over) return;
  W.n++; W.t += dt;
  if (W.phase !== 'clear') W.secT += dt;
  if (W.phase === 'fight' || W.phase === 'boss') { W.waveT += dt; W.fightT += dt; }
  if (W.mode === 'endless' && W.n % 120 === 0) { const lv = W.level; W.R = ramp(W); if (Math.floor(lv) !== Math.floor(W.level)) W.ev.push({ k: 'level', level: W.level }); }
  director(W, dt);
  planetEvent(W, dt);
  for (const p of W.players) { player(W, p, dt); if (!p.remote) gateCheck(W, p); }
  const es = W.players.some((q) => q.hyper > 0) ? HYPER.slow : 1, ee = W.stun > 0 ? 0 : es;
  if (W.stun > 0) W.stun -= dt;
  rings(W, dt * ee);
  for (let i = 0; i < W.enemies.length; i++) enemy(W, W.enemies[i], dt * ee);
  if (W.boss) boss(W, W.boss, dt * es);
  settlers(W, dt);
  shots(W, dt);
  missiles(W, dt);
  bolts(W, dt * es);
  pods(W, dt);
  contacts(W);
  W.enemies = W.enemies.filter((e) => e.hp > 0 && !e.gone);
  // extra ships
  while (W.lifePts >= W.nextLife) { W.lives++; W.nextLife += SCORE.lifeEvery * D_OF(W).score; W.ev.push({ k: 'life' }); }
  if (!W.over && W.lives <= 0 && !W.players.some((p) => p.alive)) { W.over = true; W.result = 'over'; }
}

// ------------------------------------------------------------------ waves
function director(W, dt) {
  if (W.phase === 'intro') {
    W.phaseT -= dt;
    if (W.phaseT <= 0) { if (W.wave >= WAVES && W.mode === 'campaign') startBoss(W); else startWave(W, W.wave); }
    return;
  }
  if (W.phase === 'break') {
    W.phaseT -= dt;
    if (W.phaseT <= 0) {
      if (W.rivals && W.wave + 1 >= RIVALS.waves) { W.phase = 'clear'; W.phaseT = 1.5; W.ev.push({ k: 'rivalend' }); }
      else if (W.mode === 'endless') { if ((W.waveN + 1) % ENDLESS.bossEvery === 0) startBoss(W); else startWave(W, W.wave + 1); }
      else if (W.wave + 1 >= WAVES) { W.wave = WAVES; W.cp = WAVES; checkpoint(W); startBoss(W); }
      else startWave(W, W.wave + 1);
    }
    return;
  }
  if (W.phase === 'clear') {
    W.phaseT -= dt;
    if (W.phaseT <= 0) { W.over = true; W.result = W.rivals ? 'rivals' : 'clear'; }
    return;
  }
  if (W.phase === 'boss') { skimmers(W, dt); bossDirector(W, dt); return; }
  // fight
  skimmers(W, dt);
  const P = W.plan, R = W.R;
  if (W.tutorial) { if (W.waveT > 0.8) tut(W, 'move'); if (W.waveT > TUTOR.firstAt - 1) tut(W, 'fire'); }
  if (P.left > 0) {
    P.groupT -= dt;
    if (P.groupT <= 0) {
      const n = Math.min(P.left, W.tutorial && W.waveT < TUTOR.safe ? 1 : R.group);
      for (let i = 0; i < n; i++) spawnEnemy(W, W.fallen ? 'husk' : 'lifter');
      P.left -= n; P.groupT = R.gap * (W.tutorial && W.waveT < TUTOR.safe ? 1.4 : 1);
    }
  }
  for (const x of P.extra) if (!x.done && W.waveT >= x.t) { x.done = true; if (x.type === 'cross') podCross(W); else if (x.type === 'whirl') whirlRing(W); else if (x.type === 'squad') squad(W, x); else spawnEnemy(W, x.type); }
  // a special wave counts its fighters down (those still to come plus those in the sky)
  if (W.special) W.special.left = P.extra.reduce((a, x) => a + (x.done ? 0 : x.kind === 'whirler' ? WHIRL.n : x.n), 0) + W.enemies.reduce((a, e) => a + (e.hp > 0 && HOSTILE.has(e.type) ? 1 : 0), 0);
  // a PROWLER comes for a pilot who takes too long
  if (W.waveT > P.prowlT && !W.enemies.some((e) => e.type === 'prowler') && P.left === 0) { P.prowlT = W.waveT + 24; spawnEnemy(W, 'prowler'); }
  const busy = W.enemies.some((e) => HOSTILE.has(e.type) && e.hp > 0);
  if (!busy && P.left === 0 && P.extra.every((x) => x.done)) waveClear(W);
}
function startWave(W, w) {
  if (W.mode === 'endless') { W.waveN++; W.wave = w; }
  else { W.wave = w; W.cp = w; checkpoint(W); }
  W.R = ramp(W);
  const R = W.R;
  W.phase = 'fight'; W.waveT = 0;
  W.special = null;
  if (!W.rivals && (W.mode === 'endless' ? W.waveN % SPECIAL.every === 0 : w === SPECIAL.every - 1)) { specialWave(W, w); return; }
  const extra = [];
  for (let i = 0; i < R.sowers; i++) extra.push({ t: rr(W, 3, 14), type: 'sower' });
  const cross = !W.rivals && (W.mode === 'endless' ? W.waveN % 3 === 2 : (INTERSECT.waves[W.sector] || []).includes(w));
  for (let i = 0; i < R.hives - (cross ? 1 : 0); i++) extra.push({ t: rr(W, 6, 20), type: 'hive' });
  for (let i = 0; i < R.husks; i++) extra.push({ t: rr(W, 4, 18), type: 'husk' });
  if (cross) extra.push({ t: rr(W, INTERSECT.at[0], INTERSECT.at[1]), type: 'cross' });
  const fx = W.feat && W.mode === 'campaign' ? FEAT[W.feat] : null, fn = fx ? 2 + Math.floor(w / 2) : 0;
  for (let i = 0; i < (R.whirls || 0); i++) extra.push({ t: rr(W, 5, 16), type: 'whirl' });
  for (let i = 0; i < (R.scorchers || 0); i++) extra.push({ t: rr(W, 6, 18), type: 'scorcher' });
  for (let i = 0; i < (R.coils || 0); i++) extra.push({ t: rr(W, 4, 12), type: 'coil' });
  for (let i = 0; i < (R.maws || 0); i++) extra.push({ t: rr(W, 10, 22), type: 'maw' });
  for (let i = 0; i < fn; i++) if (fx !== 'lifter') extra.push({ t: rr(W, 3, 20), type: fx });
  W.plan = { left: R.lifters + (fx === 'lifter' ? fn + 1 : 0), groupT: W.tutorial ? TUTOR.firstAt : 1.2, extra, prowlT: R.prowlT };
  for (const p of W.players) p.shield = Math.max(p.shield, R.shield + (W.up.deflector || 0));
  W.ev.push({ k: 'wave', w, n: W.mode === 'endless' ? W.waveN : w + 1 });
}
// SPECIAL WAVE: no lifters; squadrons of one kind of fighter, `gap` seconds apart
function specialWave(W, w) {
  const cyc = W.mode === 'endless' ? Math.floor(W.waveN / SPECIAL.every) - 1 : 0;
  const S = SPECIALS[W.mode === 'endless' ? cyc % SPECIALS.length : clamp(W.sector, 0, SPECIALS.length - 1)];
  // harder difficulties send more squadrons; endless adds two a cycle through the list
  const squads = Math.max(2, Math.round((S.squads + (W.mode === 'endless' ? Math.min(6, Math.floor(cyc / SPECIALS.length) * 2) : 0)) * (D_OF(W).count || 1))), extra = [];
  let total = 0;
  for (let i = 0; i < squads; i++) {
    const kind = S.kind === 'mix' ? SPECIAL.mix[i % SPECIAL.mix.length] : S.kind;
    const n = kind === 'whirler' ? 1 : kind === 'maw' ? 2 : kind === 'husk' ? Math.min(S.n, 4) : S.n;
    extra.push({ t: SPECIAL.first + i * S.gap, type: 'squad', kind, n });
    total += kind === 'whirler' ? WHIRL.n : n;
  }
  W.special = { key: S.key, total, left: total };
  W.plan = { left: 0, groupT: 99, extra, prowlT: W.R.prowlT + squads * S.gap };
  for (const p of W.players) p.shield = Math.max(p.shield, W.R.shield + (W.up.deflector || 0));
  W.ev.push({ k: 'wave', w, n: W.mode === 'endless' ? W.waveN : w + 1, special: S.key, total });
}
// one squadron warps in together, away from the pilots
function squad(W, x) {
  if (x.kind === 'whirler') { whirlRing(W, 1); return; }
  const cx = spawnSpot(W, x.kind), cy = rr(W, 11, 26);
  for (let k = 0; k < x.n; k++) {
    const e = spawnEnemy(W, x.kind, wp(cx + rr(W, -7, 7)), clamp(cy + rr(W, -6, 6), 4, 31));
    if (x.kind === 'spark') e.life = SPECIAL.sparkLife + rr(W, 0, 4);
    if (x.kind === 'husk') e.st = 'hunt';
  }
}
// POD INTERSECTION: two pods warp in either side of a point ahead of a pilot and drift through it on crossing paths
const wi = (W) => clamp(W.mode === 'endless' ? Math.floor(W.level || 0) : W.sector, 0, 4);
// a ring of whirlers warps in away from the pilots and starts to shadow one
function whirlRing(W, storm = 0) {
  const x = spawnSpot(W, 'whirler'), y = rr(W, 14, 26), id = W.nextId++;
  // storm rings (a special wave) dive more than twice as often
  W.rings.push({ id, x, y, a: rr(W, 0, 6.28), st: 'cruise', t: rr(W, -2, 0), side: rand(W) < 0.5 ? -1 : 1, tx: x, ty: y, k: storm ? 0.42 : 1 });
  for (let k = 0; k < WHIRL.n; k++) {
    const a = (k / WHIRL.n) * Math.PI * 2;
    const e = addEnemy(W, 'whirler', wp(x + Math.cos(a) * WHIRL.rad), y + Math.sin(a) * WHIRL.rad * 0.6);
    e.ring = id; e.slot = k; e.born = W.R.warn * 1.2;
    W.ev.push({ k: 'warpin', type: 'whirler', x: e.x, y: e.y, id: e.id, T: e.born });
  }
}
// every ring centre: cruise alongside the nearest pilot, now and then dive the whole ring at them
function rings(W, dt) {
  if (!W.rings.length) return;
  const i = wi(W);
  for (const r of W.rings) {
    const live = W.enemies.some((e) => e.ring === r.id && e.hp > 0);
    if (!live) { r.gone = true; continue; }
    r.t += dt; r.a += WHIRL.spin * dt;
    const p = nearestPlayer(W, r.x, 240);
    if (r.st === 'cruise') {
      const tx = p ? wp(p.x + r.side * 22) : wp(r.x + 10), ty = p ? clamp(p.y + 4, 8, 29) : r.y;
      const dx = wd(tx - r.x), dy = ty - r.y, l = Math.hypot(dx, dy) || 1, v = Math.min(WHIRL.v[i], l * 2);
      r.x = wp(r.x + (dx / l) * v * dt); r.y += (dy / l) * v * dt;
      if (p && r.t > WHIRL.every[i] * (r.k || 1) && Math.abs(wd(p.x - r.x)) < 40) { r.st = 'dive'; r.t = 0; r.tx = p.x; r.ty = p.y; W.ev.push({ k: 'whirldive', x: r.x, y: r.y, id: r.id }); }
    } else {
      const dx = wd(r.tx - r.x), dy = r.ty - r.y, l = Math.hypot(dx, dy) || 1, v = WHIRL.dive[i];
      r.x = wp(r.x + (dx / l) * v * dt); r.y = clamp(r.y + (dy / l) * v * dt, 4, H - 3);
      if (r.t > WHIRL.diveT || l < 1) { r.st = 'cruise'; r.t = 0; r.side = -r.side; }
    }
  }
  W.rings = W.rings.filter((r) => !r.gone);
}
function whirler(W, e, dt) {
  const r = W.rings.find((q) => q.id === e.ring);
  if (!r) { const p = nearestPlayer(W, e.x, 120); if (p) moveTo(e, p.x, p.y, WHIRL.v[wi(W)] * 1.3, 20, dt); return; }
  const a = r.a + (e.slot / WHIRL.n) * Math.PI * 2, rad = r.st === 'dive' ? WHIRL.rad * 0.7 : WHIRL.rad;
  moveTo(e, wp(r.x + Math.cos(a) * rad), r.y + Math.sin(a) * rad * 0.6, 30, 70, dt);
}
// the coil drifts on the far side of a pilot and lets out sparks
function coil(W, e, dt) {
  const i = wi(W), p = nearestPlayer(W, e.x, 220);
  if (p) { const side = Math.sign(wd(e.x - p.x)) || 1; moveTo(e, wp(p.x + side * 30), clamp(p.y + Math.sin(e.t * 0.6 + e.ph) * 6, 8, 28), 3.2, 3, dt); }
  else { e.vx = e.face * 2; e.vy = Math.sin(e.t + e.ph); }
  e.life += dt;
  if (e.life > COIL.every[i] && p && Math.abs(wd(p.x - e.x)) < 90) {
    e.life = 0;
    if (W.enemies.filter((q) => q.from === e.id && q.hp > 0).length < COIL.max) {
      const q = addEnemy(W, 'spark', e.x, e.y + 1.2); q.from = e.id; q.born = 0.35; q.life = COIL.life;
      W.ev.push({ k: 'coilspark', x: e.x, y: e.y, id: q.id });
    }
  }
}
function spark(W, e, dt) {
  e.life -= dt;
  if (e.life <= 0) { e.hp = 0; W.ev.push({ k: 'pop', x: e.x, y: e.y, type: 'spark', id: e.id }); return; }
  const p = nearestPlayer(W, e.x, 140);
  if (!p) { e.vx *= 0.98; return; }
  moveTo(e, wp(p.x + Math.sin(e.t * 7 + e.ph) * 3), p.y + Math.cos(e.t * 5 + e.ph) * 2, COIL.v[wi(W)], 40, dt);
}
// the scorcher hops about a pilot and throws firebrands
function scorcher(W, e, dt) {
  const i = wi(W), p = nearestPlayer(W, e.x, 200);
  e.life -= dt;
  if (e.life <= 0) {
    e.life = SCORCH.hop[i];
    e.ox = p ? wp(p.x + (rand(W) < 0.5 ? -1 : 1) * rr(W, 14, 26)) : wp(e.x + rr(W, -20, 20));
    e.oy = p ? clamp(p.y + rr(W, -8, 8), 5, 30) : rr(W, 8, 28);
  }
  moveTo(e, e.ox, e.oy, 14, 26, dt);
  if (safeNow(W) || !p || Math.abs(wd(p.x - e.x)) > 46) return;
  if (e.tell > 0) { e.tell -= dt; if (e.tell <= 0) brand(W, e, p); return; }
  e.fireT -= dt;
  if (e.fireT <= 0) { e.fireT = SCORCH.fire[i] * rr(W, 0.85, 1.15); e.tell = SCORCH.warn; W.ev.push({ k: 'tell', id: e.id, x: e.x, y: e.y, T: e.tell }); }
}
function brand(W, e, p) {
  const a = Math.atan2(p.y - e.y, wd(p.x - e.x));
  W.bolts.push({ id: W.nextId++, x: e.x, y: e.y, vx: Math.cos(a) * SCORCH.v, vy: Math.sin(a) * SCORCH.v, t: 0, from: 'scorcher', home: SCORCH.home });
  W.ev.push({ k: 'brand', x: e.x, y: e.y, id: e.id });
}
// the maw stalks a pilot from `stalk` m off, opens its jaws (the warning), then dashes in to bite
function maw(W, e, dt) {
  const i = wi(W), p = nearestPlayer(W, e.x, 200);
  e.life -= dt;
  if (e.st === 'dash') {
    if (e.life <= 0) { e.st = 'hunt'; e.life = MAW.rest[i]; }
    return;   // keeps the dash velocity
  }
  if (!p) { e.vx = e.face * 3; e.vy *= 0.9; return; }
  const side = Math.sign(wd(e.x - p.x)) || 1;
  moveTo(e, wp(p.x + side * MAW.stalk), clamp(p.y, 4, 30), W.R.hV * 0.75, 12, dt);
  if (e.tell > 0) {
    e.tell -= dt;
    if (e.tell <= 0) {
      const dx = wd(p.x - e.x), dy = p.y - e.y, l = Math.hypot(dx, dy) || 1;
      e.st = 'dash'; e.life = MAW.dashT; e.vx = (dx / l) * MAW.dash[i]; e.vy = (dy / l) * MAW.dash[i];
      W.ev.push({ k: 'mawdash', id: e.id, x: e.x, y: e.y });
    }
    return;
  }
  if (e.life <= 0 && Math.abs(wd(p.x - e.x)) < MAW.stalk + 8 && !safeNow(W)) { e.tell = MAW.warn; W.ev.push({ k: 'tell', id: e.id, x: e.x, y: e.y, T: e.tell }); }
}
// the SKYGATE: fly through it and it throws you to wherever the colony needs you most
function gateCheck(W, p) {
  const g = W.gate;
  if (!g || !p.alive) { p.px = p.x; return; }
  if (p.gateT > 0) p.gateT -= STEP;
  const was = wd((p.px ?? p.x) - g.x), now = wd(p.x - g.x);
  p.px = p.x;
  if (p.gateT > 0 || Math.sign(was) === Math.sign(now) || Math.abs(now) > 6 || Math.abs(p.y - g.y) > GATE.r) return;
  let to = null, why = '';
  const ls = W.enemies.filter((e) => e.type === 'lifter' && e.hp > 0 && e.born <= 0);
  const lift = ls.filter((e) => e.st === 'lift').sort((a, b) => b.y - a.y)[0];
  if (lift) { to = lift; why = 'lift'; }
  if (!to) { const s = W.settlers.find((q) => q.st === 'fall' && q.dropY > W.R.safeH); if (s) { to = s; why = 'fall'; } }
  if (!to) { const gr = ls.find((e) => e.st === 'grab' || e.st === 'down'); if (gr) { to = gr; why = 'grab'; } }
  p.gateT = GATE.cd;
  W.ev.push({ k: 'gate', pid: p.id, x: g.x, y: g.y, warp: !!to, why });
  if (!to) return;
  const side = p.face || 1;
  p.x = wp(to.x - side * GATE.back); p.y = clamp(to.y + (why === 'fall' ? 1 : -1.5), F.minY, F.maxY); p.vx = side * 10; p.vy = 0; p.face = side; p.px = p.x;
  p.inv = Math.max(p.inv, 1.2);
  W.ev.push({ k: 'gatein', pid: p.id, x: p.x, y: p.y, why });
}
function podCross(W) {
  const p = nearestPlayer(W, rr(W, 0, C)) || W.players[0];
  if (!p) return;
  const I = INTERSECT, mx = wp(p.x + (p.face || 1) * rr(W, 26, 40)), my = rr(W, 13, 22), pair = W.nextId;
  for (const s of [-1, 1]) {
    const x0 = wp(mx + s * I.half), y0 = clamp(my - s * rr(W, 4, 7), 6, 30);
    const e = addEnemy(W, 'hive', x0, y0);
    e.born = W.R.warn * 1.4;
    e.cross = { mx, my, s, hold: 0, T: 0 };
    e.pair = pair; e.sting = I.sting[clamp(W.mode === 'endless' ? Math.floor(W.level || 0) : W.sector, 0, 4)];
    W.ev.push({ k: 'warpin', type: 'hive', x: x0, y: y0, id: e.id, T: e.born });
  }
  W.ev.push({ k: 'crosswarn', x: mx, y: my, T: W.R.warn * 1.4 + I.travel });
}
function checkpoint(W) {
  if (W.mode !== 'campaign') return;
  const i = clamp(W.cp, 0, WAVES);
  W.stats.waveTries[i]++;
  W.cpNova[i] = W.players[0] ? W.players[0].nova : 3;
  if (i > 0) W.ev.push({ k: 'checkpoint', cp: i });
}
function waveClear(W) {
  const alive = settlersLeft(W), mult = Math.min(5, (W.mode === 'endless' ? W.waveN : W.wave + 1));
  const bonus = alive * SCORE.waveBonus * mult;
  addScore(W, bonus);
  W.ev.push({ k: 'waveclear', bonus, alive, mult, w: W.wave });
  W.phase = 'break'; W.phaseT = 3.4;
  for (const b of W.bolts) b.t = 99;
  for (const e of W.enemies) if (e.type === 'mine') { e.hp = 0; W.ev.push({ k: 'pop', x: e.x, y: e.y, type: 'mine', id: e.id }); }
  // endless: a fallen colony is rebuilt every fifth wave
  if (W.mode === 'endless' && W.fallen && W.waveN % ENDLESS.bossEvery === 0) { makeColony(W); W.ev.push({ k: 'colony' }); }
}

// ------------------------------------------------------------------ spawning
// machines warp in somewhere over the planet, never right on top of a pilot
function spawnSpot(W, type) {
  for (let tries = 0; tries < 30; tries++) {
    let x;
    if (type === 'lifter') {
      let s = W.settlers.filter((q) => q.st === 'walk');
      const p0 = alivePlayers(W)[0];
      if (p0 && rand(W) < 0.6) { const nr = s.filter((q) => Math.abs(wd(q.x - p0.x)) < 240); if (nr.length) s = nr; }
      x = s.length ? wp(s[(rand(W) * s.length) | 0].x + rr(W, -60, 60)) : rr(W, 0, C);
    }
    else if (type === 'prowler') { const p = nearestPlayer(W, 0) || W.players[0]; x = wp(p.x - (p.face || 1) * rr(W, 46, 54)); }
    else { const p = alivePlayers(W)[0]; x = p && rand(W) < 0.6 ? wp(p.x + (rand(W) < 0.5 ? -1 : 1) * rr(W, 26, 70)) : rr(W, 0, C); }
    const p = nearestPlayer(W, x);
    if (type === 'prowler' || !p || Math.abs(wd(p.x - x)) > 22) return x;
  }
  return rr(W, 0, C);
}
function spawnEnemy(W, type, x, y) {
  if (x === undefined) x = spawnSpot(W, type);
  if (y === undefined) y = type === 'lifter' ? rr(W, 20, 30) : type === 'sower' ? rr(W, 24, 31) : type === 'prowler' ? clamp((nearestPlayer(W, x) || { y: 18 }).y, 6, 30) : rr(W, 12, 28);
  const e = addEnemy(W, type, x, y);
  e.born = type === 'prowler' ? 0.8 : W.R.warn * 1.2 * (W.tutorial && W.waveT < TUTOR.safe ? 1.3 : 1);
  W.ev.push({ k: 'warpin', type, x, y, id: e.id, T: e.born });
  if (type === 'prowler') W.ev.push({ k: 'prowler', x, y });
  return e;
}
export function addEnemy(W, type, x, y) {
  const E = ENEMY[type];
  const e = { id: W.nextId++, type, x: wp(x), y, vx: 0, vy: 0, hp: E.hp, born: 0, st: type === 'lifter' ? 'roam' : 'hunt', t: 0, tgt: 0, carry: 0, face: rand(W) < 0.5 ? -1 : 1,
    fireT: rr(W, 0.8, 2.2) + rr(W, 0.2, 0.6) / Math.max(0.05, W.R.fire), tell: 0, yT: y, ph: rr(W, 0, 6.28), life: 0, hitT: 0, ox: 0, oy: 0 };
  if (type === 'mine') e.life = 9;
  if (type === 'stinger') { e.ox = rr(W, -6, 6); e.oy = rr(W, -3, 3); }
  W.enemies.push(e);
  return e;
}

// ------------------------------------------------------------------ the Warden gunship
function player(W, p, dt) {
  if (p.inv > 0) p.inv -= dt;
  if (p.hurtT > 0) p.hurtT -= dt;
  for (const k in p.pw) { p.pw[k] -= dt; if (p.pw[k] <= 0) { delete p.pw[k]; W.ev.push({ k: 'pwend', pid: p.id, kind: k }); } }
  if (p.hyper > 0) { p.hyper -= dt; if (p.hyper <= 0) { p.hyper = 0; W.ev.push({ k: 'hyperend', pid: p.id }); } }
  else if (p.hyperK > 0) p.hyperK = Math.max(0, p.hyperK - HYPER.decay * dt);
  if (!p.alive) {
    if (p.deadT > 0) { p.deadT -= dt; if (p.deadT <= 0 && W.lives > 0 && W.phase !== 'clear') respawn(W, p); }
    return;
  }
  if (p.remote) { p.thrust = 0; return; }
  const SH = SHIPS[p.ship] || SHIPS.warden, I = p.input, thr = (1 + 0.08 * (W.up.thrust || 0)) * SH.accel;
  const mx = clamp(I.mx || 0, -1, 1), my = clamp(I.my || 0, -1, 1);
  if (Math.abs(mx) > 0.15) {
    const s = Math.sign(mx);
    if (s !== p.face) { p.face = s; W.ev.push({ k: 'turn', pid: p.id }); }
    const a = Math.abs(mx);
    if (p.vx * s < 0) p.vx += s * F.brake * thr * dt;   // braking out of the old direction
    else p.vx += s * F.accel * thr * a * dt;
    p.thrust = a;
  } else { p.vx *= Math.exp(-F.drag * dt); p.thrust = 0; }
  const vmax = F.vmax * (1 + 0.08 * (W.up.thrust || 0)) * SH.vmax;
  if (W.event && W.event.kind === 'sandstorm' && W.event.t > 1) p.vx += W.event.dir * EVENT.sandstorm.wind * dt;
  p.vx = clamp(p.vx, -vmax, vmax);
  const vyT = my * F.vy * thr;
  p.vy += clamp(vyT - p.vy, -F.vyAcc * dt, F.vyAcc * dt);
  p.x = wp(p.x + p.vx * dt);
  p.y += p.vy * dt;
  if (p.y < F.minY) { p.y = F.minY; if (p.vy < 0) p.vy = 0; }
  if (p.y > F.maxY) { p.y = F.maxY; if (p.vy > 0) p.vy = 0; }
  // the beam cannon
  p.fireT -= dt;
  if (I.fire && p.fireT <= 0) fire(W, p);
  // the escort drone fires on its own at the nearest machine within reach
  if (p.pw.drone) { p.droneT = (p.droneT || 0) - dt; if (p.droneT <= 0) droneFire(W, p); }
  // nova
  p.novaT -= dt;
  if (I.nova && !p.novaHeld && p.novaT <= 0) nova(W, p);
  p.novaHeld = !!I.nova;
  // blink
  p.blinkT -= dt;
  if (I.blink && !p.blinkHeld && p.blinkT <= 0) blink(W, p);
  p.blinkHeld = !!I.blink;
  // a carried settler is set down when you fly low
  if (p.carry) {
    const s = W.settlers.find((q) => q.id === p.carry);
    if (!s || s.st !== 'carried') p.carry = 0;
    else if (p.y < F.landY) {
      s.st = 'walk'; s.by = 0; s.y = 0; s.x = p.x; s.home = p.x; p.carry = 0;
      if (W.net === 'guest') { W.claims.push({ land: s.id }); W.ev.push({ k: 'land', x: s.x, y: 0, pid: p.id, score: SCORE.land, id: s.id }); }
      else {
        addScore(W, SCORE.land, SCORE.land, p.id); W.stats.landed++;
        W.ev.push({ k: 'land', x: s.x, y: 0, pid: p.id, score: SCORE.land, id: s.id });
      }
    }
  }
}
export function fireCD(W, p) { return F.fireCD * [1, 0.84, 0.72, 0.62][W.up.rapid || 0] * (p && p.pw.overdrive ? 0.5 : 1); }
export const beamRange = (W) => F.beamRange * (1 + 0.15 * (W.up.reach || 0));
// the escort drone rides above the ship; it picks the nearest machine within 40 m and fires a beam along its height
export const dronePos = (p, t) => [wp(p.x - p.face * 1.2 + Math.sin(t * 2.3) * 0.6), p.y + 2.2 + Math.sin(t * 3.1) * 0.4];
function droneFire(W, p) {
  const [dx0, dy0] = dronePos(p, W.t);
  let best = null, bd = 30;
  for (const e of W.enemies) {
    if (e.hp <= 0 || e.born > 0 || e.type === 'mine') continue;
    const d = Math.abs(wd(e.x - dx0)) + Math.abs(e.y - dy0) * 1.5;
    if (d < bd) { bd = d; best = e; }
  }
  if (!best) { p.droneT = 0.2; return; }
  p.droneT = 0.9;
  const dir = Math.sign(wd(best.x - dx0)) || 1, x0 = wp(dx0 + dir * 0.6), y = best.y;
  if (W.net === 'guest') W.claims.push({ fire: [Math.round(x0 * 100) / 100, Math.round(y * 100) / 100, dir, 0] });
  W.shots.push({ id: W.nextId++, pid: p.id, x0, y, dir, t: 0, done: false, vx: 0, drone: 1 });
  W.ev.push({ k: 'fire', pid: p.id, x: x0, y, dir, twin: false, drone: true, fy: dy0 });
}
// a shot from gunship p: beams (with the ship's damage, height, reach and chain) or a salvo of homing missiles
function emitShots(W, p, x0, y, dir, twin, hy, vx) {
  const S = SHIPS[p.ship] || SHIPS.warden, m = p.mast || 0, k1 = m >= 1, k2 = m >= 2;
  if (S.weapon === 'missile') {
    // mastery: a third missile (I), faster missiles that lock on from further (II)
    const ms = { pid: p.id, x: x0, t: 0, tgt: 0, hyper: hy, sp: k2 ? 55 : 44, lk: k2 ? 62 : 48 };
    const n = S.missiles + (k1 ? 1 : 0);
    for (let k = 0; k < n; k++) W.missiles.push({ id: W.nextId++, ...ms, y: y + (k === 0 ? 0.45 : k === 1 ? -0.45 : 0), vx: dir * (k === 2 ? 30 : 26) + vx, vy: k === 0 ? 5 : k === 1 ? -5 : 0 });
    if (twin) W.missiles.push({ id: W.nextId++, ...ms, y, vx: dir * 30 + vx, vy: 0 });
    return;
  }
  // mastery: Warden reach (I); Breaker taller shells (I) and shockwave wrecks (II); Arc one more leap (I), longer leaps (II)
  const sh = { pid: p.id, x0, dir, t: 0, done: false, vx, hyper: hy, dmg: S.dmg, bk: S.band * (p.ship === 'breaker' && k1 ? 1.3 : 1), rk: S.range * (p.ship === 'warden' && k1 ? 1.15 : 1),
    arc: (S.chain || 0) + (p.ship === 'arc' && k1 ? 1 : 0), ar: p.ship === 'arc' && k2 ? 1.4 : 1, sw: p.ship === 'breaker' && k2 ? 1 : 0 };
  W.shots.push({ id: W.nextId++, y, ...sh });
  if (twin) W.shots.push({ id: W.nextId++, y: y - F.twinY, ...sh });
}
// chain lightning: from (x, y) to the nearest machine within chainR, n times, never the same one twice
function arcFrom(W, x, y, n, skip, pid, rk = 1) {
  const pts = [[x, y]], hit = new Set([skip ? skip.id : -1]);
  let cx = x, cy = y;
  for (let k = 0; k < n; k++) {
    let best = null, bd = SHIPS.arc.chainR * rk;
    for (const e of W.enemies) { if (e.hp <= 0 || e.born > 0 || hit.has(e.id)) continue; const d = Math.hypot(wd(e.x - cx), e.y - cy); if (d < bd) { bd = d; best = e; } }
    if (!best) break;
    hit.add(best.id); pts.push([best.x, best.y]); cx = best.x; cy = best.y;
    damage(W, best, 1, pid);
  }
  if (pts.length > 1) W.ev.push({ k: 'arc', pts });
}
// homing missiles: each locks on the nearest machine (or a live carrier weak point) within 48 m and steers to it
function missiles(W, dt) {
  if (!W.missiles || !W.missiles.length) return;
  const B = W.boss;
  for (const m of W.missiles) {
    m.t += dt;
    if (m.t > 1.9) { m.done = true; W.ev.push({ k: 'mfizz', x: m.x, y: m.y }); continue; }
    let e = m.tgt ? W.enemies.find((q) => q.id === m.tgt && q.hp > 0 && !q.gone) : null;
    if (!e && m.node === undefined) {
      let bd = m.lk || 48;
      for (const q of W.enemies) { if (q.hp <= 0 || q.born > 0 || q.type === 'mine') continue; const d = Math.hypot(wd(q.x - m.x), q.y - m.y); if (d < bd) { bd = d; e = q; } }
      m.tgt = e ? e.id : 0;
    }
    let tx = null, ty = 0;
    if (e) { tx = e.x; ty = e.y; }
    else if (B && B.st === 'fight') {
      if (m.node === undefined || !B.nodes[m.node] || B.nodes[m.node].hp <= 0) {
        let bd = m.lk || 48; m.node = undefined;
        B.nodes.forEach((n, i) => { if (n.hp <= 0) return; const [nx, ny] = nodePos(B, i); const d = Math.hypot(wd(nx - m.x), ny - m.y); if (d < bd) { bd = d; m.node = i; } });
      }
      if (m.node !== undefined) [tx, ty] = nodePos(B, m.node);
    }
    const sp = m.sp || 44;
    if (tx !== null) { const dx = wd(tx - m.x), dy = ty - m.y, l = Math.hypot(dx, dy) || 1; m.vx += clamp((dx / l) * sp - m.vx, -150 * dt, 150 * dt); m.vy += clamp((dy / l) * sp - m.vy, -150 * dt, 150 * dt); }
    else { m.vx += Math.sign(m.vx || 1) * 40 * dt; m.vy *= 0.97; }
    m.x = wp(m.x + m.vx * dt); m.y += m.vy * dt;
    if (m.y < 0.3 || m.y > H + 2) { m.done = true; W.ev.push({ k: 'mfizz', x: m.x, y: clamp(m.y, 0.3, H) }); continue; }
    if (e && Math.abs(wd(e.x - m.x)) < ENEMY[e.type].r + 0.5 && Math.abs(e.y - m.y) < ENEMY[e.type].r + 0.5) { m.done = true; W.stats.hits++; damage(W, e, 1, m.pid); W.ev.push({ k: 'mhit', x: m.x, y: m.y }); continue; }
    if (B && B.st === 'fight') {
      let hn = -1;
      B.nodes.forEach((n, i) => { if (n.hp <= 0 || hn >= 0) return; const [nx, ny] = nodePos(B, i); if (Math.abs(wd(nx - m.x)) < 1.4 && Math.abs(ny - m.y) < 1.4) hn = i; });
      if (hn < 0) for (const b of BOSSES[B.key].body) {
        const cx = wp(B.x + b[0] * B.face), cy = B.y + b[1], u = wd(m.x - cx) / b[2], v = (m.y - cy) / b[3];
        if (u * u + v * v < 1) { if (m.node !== undefined && B.nodes[m.node] && B.nodes[m.node].hp > 0) hn = m.node; else { m.done = true; W.ev.push({ k: 'plink', x: m.x, y: m.y }); } break; }
      }
      if (hn >= 0) { m.done = true; W.stats.hits++; hitNode(W, B, hn, m.pid, 1); W.ev.push({ k: 'mhit', x: m.x, y: m.y }); continue; }
    }
  }
  W.missiles = W.missiles.filter((m) => !m.done);
}
function fire(W, p) {
  const SH = SHIPS[p.ship] || SHIPS.warden;
  p.fireT = p.hyper > 0 ? SH.hyperCD : fireCD(W, p) * SH.cd;
  const x0 = wp(p.x + p.face * 1.9);
  let y = p.y - 0.15;
  // aim assist: the beam snaps to a machine just above or below the line ahead
  if (p.assist > 0) {
    let best = null, bd = 1e9;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0) continue;
      const dx = wd(e.x - x0) * p.face, dy = e.y - y;
      if (dx < 0 || dx > 46 || Math.abs(dy) > p.assist * 2.2) continue;
      const d = dx * 0.05 + Math.abs(dy);
      if (d < bd) { bd = d; best = e; }
    }
    if (best && Math.abs(best.y - y) < p.assist * 2.2) y += clamp(best.y - y, -p.assist * 2.2, p.assist * 2.2);
  }
  const twin = !!p.pw.twin;
  const hy = p.hyper > 0 ? 1 : 0;
  if (W.net === 'guest') W.claims.push({ fire: [Math.round(x0 * 100) / 100, Math.round(y * 100) / 100, p.face, twin ? 1 : 0, hy, SHIP_KEYS.indexOf(p.ship)] });
  emitShots(W, p, x0, y, p.face, twin, hy, p.vx);
  W.stats.fired++;
  W.ev.push({ k: 'fire', pid: p.id, x: x0, y, dir: p.face, twin, ship: p.ship });
}
function nova(W, p) {
  if (p.nova <= 0) { W.ev.push({ k: 'empty', pid: p.id, x: p.x, y: p.y }); p.novaT = 0.5; return; }
  p.nova--; p.novaT = F.novaCD; W.stats.novas++;
  W.ev.push({ k: 'nova', pid: p.id, x: p.x, y: p.y, r: F.novaR });
  if (W.net === 'guest') { W.claims.push({ nova: [Math.round(p.x * 100) / 100, Math.round(p.y * 100) / 100] }); return; }
  for (const e of W.enemies) if (e.hp > 0 && Math.abs(wd(e.x - p.x)) < F.novaR) { if (e.born > 0) e.born = 0; kill(W, e, p.id, 'nova'); }
  for (const b of W.bolts) if (Math.abs(wd(b.x - p.x)) < F.novaR) b.t = 99;
  const B = W.boss;
  if (B && B.st === 'fight' && Math.abs(wd(B.x - p.x)) < F.novaR) {
    // a nova hurts every weak point it reaches for one hit
    B.nodes.forEach((n, i) => { if (n.hp > 0) hitNode(W, B, i, p.id); });
  }
}
function blink(W, p) {
  p.blinkT = F.blinkCD; W.stats.blinks++;
  W.ev.push({ k: 'blink', pid: p.id, x: p.x, y: p.y });
  const s = rand(W) < 0.5 ? -1 : 1;
  p.x = wp(p.x + s * rr(W, F.blinkMin, F.blinkMax)); p.y = rr(W, 9, 26); p.vx = 0; p.vy = 0;
  p.inv = Math.max(p.inv, F.blinkInv);
  W.ev.push({ k: 'blinkin', pid: p.id, x: p.x, y: p.y });
  tut(W, 'blinked');
}
function respawn(W, p) {
  // arrive away from every machine, high up
  let x = p.x, best = -1;
  for (let i = 0; i < 16; i++) {
    const cx = wp(p.x + (i ? rr(W, -400, 400) : 0));
    let near = 1e9;
    for (const e of W.enemies) if (e.hp > 0) near = Math.min(near, Math.abs(wd(e.x - cx)));
    if (W.boss && W.boss.st !== 'gone') near = Math.min(near, Math.abs(wd(W.boss.x - cx)) - 10);
    if (near > best) { best = near; x = cx; }
    if (near > F.safeR) break;
  }
  Object.assign(p, { x, y: 16, vx: 0, vy: 0, alive: true, inv: F.inv, fireT: 0.4, carry: 0 });
  p.shield = Math.max(p.shield, W.R.shield + (W.up.deflector || 0) > 0 ? 1 : 0);
  W.ev.push({ k: 'spawn', pid: p.id, x: p.x, y: p.y });
}
function hurt(W, p, cause, fx, fy) {
  if (!p.alive || p.inv > 0) return false;
  W.stats.waveHits[clamp(W.cp, 0, WAVES)]++;
  if (p.remote) return false;   // a guest's ship: the guest judges its own hits
  if (p.shield > 0) {
    p.shield--; p.inv = F.hitInv; p.hurtT = 0.6; W.stats.shieldHits++;
    W.ev.push({ k: 'shield', pid: p.id, x: p.x, y: p.y, left: p.shield, fx: fx ?? p.x, fy: fy ?? p.y });
    if (W.net === 'guest') W.claims.push({ shield: p.shield });
    return true;
  }
  die(W, p, cause, fx, fy);
  return true;
}
function die(W, p, cause, fx, fy) {
  if (W.net === 'guest') { W.claims.push({ died: cause }); p.alive = false; p.deadT = 99; if (p.carry) { p.carry = 0; } W.ev.push({ k: 'death', pid: p.id, x: p.x, y: p.y, vx: p.vx, vy: p.vy, cause, fx: fx ?? p.x, fy: fy ?? p.y }); return; }
  p.alive = false; p.deadT = F.respawn; W.lives--; W.stats.deaths++;
  if (W.rivals) { W.lives = 99; p.score = Math.max(0, (p.score || 0) - RIVALS.death); }
  W.stats.waveDeaths[clamp(W.cp, 0, WAVES)]++;
  W.stats.cause[cause] = (W.stats.cause[cause] || 0) + 1;
  if (p.carry) { const s = W.settlers.find((q) => q.id === p.carry); if (s) drop(W, s); p.carry = 0; }
  W.ev.push({ k: 'death', pid: p.id, x: p.x, y: p.y, vx: p.vx, vy: p.vy, cause, fx: fx ?? p.x, fy: fy ?? p.y });
}

// ------------------------------------------------------------------ settlers
function settlers(W, dt) {
  const R = W.R;
  for (const s of W.settlers) {
    s.t += dt;
    if (s.st === 'walk') {
      if (s.mark > 0) { s.mark -= dt; continue; }   // looking up at a lifter overhead
      if ((W.n + s.id) % 20 === 0) {
        s.flee = 0;
        for (const e of W.enemies) if (e.hp > 0 && (e.type === 'lifter' || e.type === 'husk') && e.y < 13 && Math.abs(wd(e.x - s.x)) < 12) { s.flee = -(Math.sign(wd(e.x - s.x)) || 1); break; }
      }
      if (s.flee) { if (Math.abs(wd(s.x + s.flee - s.home)) < SETTLER.roam * 2.4) s.x = wp(s.x + s.flee * 2.3 * dt); s.vx = Math.abs(s.vx) * s.flee; continue; }
      if (Math.abs(wd(s.x - s.home)) > SETTLER.roam && wd(s.x - s.home) * s.vx > 0) s.vx = -s.vx;
      if ((W.n + s.id * 37) % 600 === 0 && rand(W) < 0.3) s.vx = -s.vx;
      s.x = wp(s.x + s.vx * dt);
    } else if (s.st === 'fall') {
      s.y -= R.fallV * dt;
      for (const p of W.players) {
        if (!p.alive || p.carry || p.remote) continue;
        const cr = F.catchR * (1 + 0.3 * (W.up.tractor || 0));
        if (Math.abs(wd(p.x - s.x)) < cr && Math.abs(p.y - s.y) < cr) {
          s.st = 'carried'; s.by = p.id; p.carry = s.id;
          addScore(W, SCORE.catch, SCORE.catch, p.id); W.stats.caught++;
          W.ev.push({ k: 'catch', x: s.x, y: s.y, pid: p.id, score: SCORE.catch });
          tut(W, 'caught');
          break;
        }
      }
      if (s.st === 'fall' && s.y <= 0) {
        s.y = 0;
        if (s.dropY <= R.safeH) { s.st = 'walk'; s.home = s.x; addScore(W, SCORE.selfLand); W.stats.selfLanded++; W.ev.push({ k: 'selfland', x: s.x, y: 0, score: SCORE.selfLand, id: s.id }); }
        else lose(W, s, 'fall');
      }
    } else if (s.st === 'carried') {
      const p = W.players.find((q) => q.id === s.by);
      if (!p || !p.alive) { drop(W, s); continue; }
      s.x = p.x; s.y = p.y - 1.25;
    } else if (s.st === 'held') {
      const e = W.enemies.find((q) => q.id === s.by);
      if (!e || e.hp <= 0) { drop(W, s); continue; }
      s.x = e.x; s.y = Math.max(0, e.y - SETTLER.hang);
    }
  }
}
function drop(W, s) {
  if (s.y <= 0.3) { s.st = 'walk'; s.y = 0; s.by = 0; return; }
  s.st = 'fall'; s.by = 0; s.dropY = s.y;
  W.ev.push({ k: 'fall', x: s.x, y: s.y, id: s.id, safe: s.y <= W.R.safeH });
  tut(W, 'falling');
}
function lose(W, s, why) {
  s.st = 'dead'; s.by = 0; W.stats.lost++;
  W.ev.push({ k: 'lost', x: s.x, y: s.y, why });
  if (!W.fallen && settlersLeft(W) === 0) {
    W.fallen = true;
    W.ev.push({ k: 'colonyfall' });
    // every lifter left turns on the pilots
    for (const e of W.enemies) if (e.type === 'lifter' && e.hp > 0) toHusk(W, e);
  }
}
function toHusk(W, e) {
  e.type = 'husk'; e.st = 'hunt'; e.carry = 0; e.tgt = 0; e.hp = ENEMY.husk.hp; e.tell = 0;
  W.ev.push({ k: 'fuse', x: e.x, y: e.y, id: e.id });
}

// ------------------------------------------------------------------ machines
function enemy(W, e, dt) {
  if (e.hp <= 0) return;
  e.t += dt;
  if (e.hitT > 0) e.hitT -= dt;
  if (e.born > 0) { e.born -= dt; return; }
  switch (e.type) {
    case 'lifter': lifter(W, e, dt); break;
    case 'husk': husk(W, e, dt); break;
    case 'sower': sower(W, e, dt); break;
    case 'mine': e.life -= dt; if (e.life <= 0) { e.hp = 0; W.ev.push({ k: 'pop', x: e.x, y: e.y, type: 'mine', id: e.id }); } return;
    case 'hive': hive(W, e, dt); break;
    case 'stinger': stinger(W, e, dt); break;
    case 'prowler': prowler(W, e, dt); break;
    case 'whirler': whirler(W, e, dt); break;
    case 'coil': coil(W, e, dt); break;
    case 'spark': spark(W, e, dt); if (e.hp <= 0) return; break;
    case 'scorcher': scorcher(W, e, dt); break;
    case 'maw': maw(W, e, dt); break;
    case 'skimmer': skimmer(W, e, dt); break;
    case 'meteor': meteor(W, e, dt); return;
  }
  e.x = wp(e.x + e.vx * dt);
  e.y = clamp(e.y + e.vy * dt, 1, H - 0.6);
  if (Math.abs(e.vx) > 0.4) e.face = Math.sign(e.vx);
  shoot(W, e, dt);
}
function moveTo(e, tx, ty, v, acc, dt) {
  const dx = wd(tx - e.x), dy = ty - e.y, l = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, l / 2);
  e.vx += clamp((dx / l) * v * k - e.vx, -acc * dt, acc * dt);
  e.vy += clamp((dy / l) * v * k - e.vy, -acc * dt, acc * dt);
}
function lifter(W, e, dt) {
  const R = W.R;
  const s = e.tgt ? W.settlers.find((q) => q.id === e.tgt) : null;
  if (e.st !== 'roam' && e.st !== 'lift' && (!s || s.st !== 'walk')) { e.st = 'roam'; e.tgt = 0; }
  switch (e.st) {
    case 'roam': {
      e.vx += clamp(e.face * R.lV - e.vx, -6 * dt, 6 * dt);
      e.vy = (e.yT + Math.sin(e.t * 0.8 + e.ph) * 2 - e.y) * 1.2;
      if ((W.n + e.id * 13) % 60 === 0 && !(W.tutorial && W.waveT < TUTOR.grabAt)) {
        const hunting = W.enemies.filter((q) => q.type === 'lifter' && q.st !== 'roam' && q.hp > 0).length;
        if (hunting < R.hunters) {
          let best = null, bd = 520;
          for (const q of W.settlers) {
            if (q.st !== 'walk' || W.enemies.some((o) => o.tgt === q.id)) continue;
            const d = Math.abs(wd(q.x - e.x));
            if (d < bd) { bd = d; best = q; }
          }
          if (best) { e.tgt = best.id; e.st = 'seek'; }
        }
      }
      break;
    }
    case 'seek': {
      const dx = wd(s.x - e.x);
      e.vx += clamp(Math.sign(dx) * R.lV * 1.25 * Math.min(1, Math.abs(dx) / 6) - e.vx, -8 * dt, 8 * dt);
      e.vy = (Math.min(e.yT, 22) - e.y) * 1.0;
      if (Math.abs(dx) < 1.5) { e.st = 'down'; s.mark = 99; }
      break;
    }
    case 'down': {
      e.vx = wd(s.x - e.x) * 4;
      e.vy = -Math.min(4.5, Math.max(1.2, (e.y - (SETTLER.hang + 0.1)) * 1.5));
      if (e.y <= SETTLER.hang + 0.2) { e.st = 'grab'; e.t = 0; e.vy = 0; W.ev.push({ k: 'grab', id: e.id, x: e.x, y: e.y, T: R.grabT }); tut(W, 'grab'); }
      break;
    }
    case 'grab': {
      e.vx = wd(s.x - e.x) * 4; e.vy = 0;
      if (e.t >= R.grabT) {
        s.st = 'held'; s.by = e.id; s.mark = 0; e.carry = s.id; e.st = 'lift';
        W.ev.push({ k: 'lifted', id: e.id, x: e.x, y: e.y });
      }
      break;
    }
    case 'lift': {
      e.vx = Math.sin(e.t * 0.7 + e.ph) * 0.8;
      e.vy = R.liftV;
      if (e.y >= H - 0.8) {
        const c = W.settlers.find((q) => q.id === e.carry);
        if (c) { lose(W, c, 'fused'); W.stats.fused++; }
        if (e.type === 'lifter') toHusk(W, e);
      }
      break;
    }
  }
}
function husk(W, e, dt) {
  const p = nearestPlayer(W, e.x, 140);
  if (!p) { e.vx += clamp(e.face * W.R.hV * 0.5 - e.vx, -10 * dt, 10 * dt); e.vy = (e.yT - e.y); return; }
  const jx = Math.sin(e.t * 3.1 + e.ph) * 5, jy = Math.sin(e.t * 4.3 + e.ph * 2) * 3;
  moveTo(e, p.x + jx, p.y + jy, W.R.hV, 26, dt);
}
function sower(W, e, dt) {
  e.vx += clamp(e.face * W.R.lV * 0.75 - e.vx, -4 * dt, 4 * dt);
  e.vy = (e.yT + Math.sin(e.t * 0.6 + e.ph) * 3 - e.y) * 0.8;
  e.life += dt;
  if (e.life > 3.4 && W.enemies.filter((q) => q.type === 'mine').length < 14 && !safeNow(W)) {
    e.life = 0;
    const m = addEnemy(W, 'mine', e.x, e.y - 1.2);
    m.born = 0.4;
    W.ev.push({ k: 'mine', x: m.x, y: m.y, id: m.id });
  }
}
function hive(W, e, dt) {
  if (e.cross) {
    // an intersection pod closes on the meeting point, locks with its partner (circling it, linked) for `hold`
    // seconds, then breaks away and hunts like any other
    const X = e.cross, I = INTERSECT, q = e.pair && W.enemies.find((o) => o !== e && o.pair === e.pair && o.hp > 0);
    X.T += dt;
    if (!q || X.hold > I.hold || X.T > I.travel + I.hold + 4) { e.cross = null; e.link = 0; if (q) q.link = 0; }
    else {
      const linked = e.link && q.link === e.id;
      if (linked) X.hold += dt;
      const a = X.hold * 2.2 + (X.s > 0 ? 0 : Math.PI);
      const tx = linked ? wp(X.mx + Math.cos(a) * 1.3) : wp(X.mx + X.s * 1.3), ty = linked ? X.my + Math.sin(a) * 1.3 : X.my;
      moveTo(e, tx, ty, linked ? 4 : I.half / I.travel * 1.6, 9, dt);
      e.face = -X.s;
      const touch = q.born <= 0 && e.born <= 0 && Math.hypot(wd(q.x - e.x), q.y - e.y) < I.gap;
      if (touch && !e.link) { e.link = q.id; q.link = e.id; W.ev.push({ k: 'podlink', x: wp(e.x + wd(q.x - e.x) / 2), y: (e.y + q.y) / 2, a: e.id, b: q.id }); }
      return;
    }
  }
  const p = nearestPlayer(W, e.x, 200);
  if (p) moveTo(e, p.x - Math.sign(wd(p.x - e.x)) * 16, clamp(p.y + Math.sin(e.t + e.ph) * 6, 6, 30), W.R.lV * 0.6, 5, dt);
  else { e.vx = e.face * 2; e.vy = (e.yT - e.y) * 0.5; }
}
function stinger(W, e, dt) {
  const p = nearestPlayer(W, e.x, 160);
  if (!p) { e.vx += clamp(e.face * W.R.stV * 0.5 - e.vx, -20 * dt, 20 * dt); e.vy *= 0.98; return; }
  moveTo(e, p.x + e.ox + Math.sin(e.t * 2 + e.ph) * 3, p.y + e.oy, W.R.stV, 30, dt);
}
// a skimmer flock sweeps round the planet in a weaving line; a member that sees a pilot ahead of it bends toward them
function skimmer(W, e, dt) {
  const si = clamp(W.mode === 'endless' ? Math.floor(W.level || 0) : W.sector, 0, 4), v = SKIM.v[si], pull = SKIM.pull[si];
  e.vx += clamp(e.face * v - e.vx, -10 * dt, 10 * dt);
  let ty = e.yT + Math.sin(e.t * 1.7 + e.ph) * 3.4;
  const p = nearestPlayer(W, e.x, 26);
  if (p && wd(p.x - e.x) * e.face > 0) ty = ty * (1 - pull) + p.y * pull;
  e.vy = clamp((clamp(ty, 3, H - 3) - e.y) * 1.8, -9, 9);
  e.life -= dt;
  if (e.life <= 0 && !nearestPlayer(W, e.x, 95)) e.gone = true;
}
// keep a flock or two near every pilot: they warp in off-screen ahead, crossing toward the pilot or running with them
function skimmers(W, dt) {
  if (W.tutorial && W.waveT < TUTOR.safe) return;
  W.skimT = (W.skimT || 0) - dt;
  if (W.skimT > 0) return;
  W.skimT = SKIM.gap;
  const s = clamp(W.mode === 'endless' ? Math.floor(W.level || 0) : W.sector, 0, 4), want = SKIM.near[s] * (W.phase === 'boss' ? 0.45 : 1);
  for (const p of alivePlayers(W)) {
    let n = 0;
    for (const e of W.enemies) if (e.type === 'skimmer' && e.hp > 0 && Math.abs(wd(e.x - p.x)) < SKIM.range) n++;
    if (n >= want) continue;
    const k = SKIM.flock[0] + ((rand(W) * (SKIM.flock[1] - SKIM.flock[0] + 1)) | 0);
    const side = rand(W) < 0.7 ? (p.face || 1) : -(p.face || 1);
    const x0 = wp(p.x + side * rr(W, 72, 105)), dir = rand(W) < 0.6 ? -side : side, y0 = rr(W, 7, H - 7);
    for (let i = 0; i < k; i++) {
      const e = addEnemy(W, 'skimmer', wp(x0 - dir * i * 2.6), y0);
      e.face = dir; e.vx = dir * SKIM.v[s]; e.yT = y0; e.ph = i * 0.55; e.life = SKIM.life; e.born = 0.35 + i * 0.06;
    }
    W.ev.push({ k: 'flock', x: x0, y: y0, n: k });
    break;
  }
}
// a meteor (or a lava bomb thrown up by an eruption) falls on the colony: shoot it before it lands
function meteor(W, e, dt) {
  e.vy -= (e.st === 'lava' ? 9 : 2.5) * dt;
  e.x = wp(e.x + e.vx * dt); e.y += e.vy * dt;
  if (e.y <= 0.6 && e.vy < 0) {
    e.hp = 0;
    W.ev.push({ k: 'impact', x: e.x, y: 0.4, id: e.id, lava: e.st === 'lava' });
    for (const s of W.settlers) if (s.st === 'walk' && Math.abs(wd(s.x - e.x)) < 2.4) lose(W, s, 'impact');
  }
}
// one planet event per world, in waves 2 and 4: meteors, a sandstorm, a solar flare, an eruption, an eclipse
function planetEvent(W, dt) {
  if (W.event) {
    const E = W.event; E.t += dt;
    if (E.kind === 'meteors' || E.kind === 'eruption') {
      const C2 = EVENT[E.kind];
      if (E.n < C2.n && E.t > 1.2 + (E.n * (C2.T - 2)) / C2.n) {
        E.n++;
        const s = W.settlers.filter((q) => q.st === 'walk'), p = alivePlayers(W)[0];
        let near = s.filter((q) => p && Math.abs(wd(q.x - p.x)) < 90); if (!near.length) near = s;
        const tx = near.length ? near[(rand(W) * near.length) | 0].x + rr(W, -4, 4) : (p ? p.x : 0) + rr(W, -40, 40);
        if (E.kind === 'meteors') { const T = rr(W, 3.2, 4.2), vx = rr(W, -7, 7), vy = -2; const e = addEnemy(W, 'meteor', wp(tx - vx * T), H + 3); e.vx = vx; e.vy = vy - (H + 3 - 1.25 * T * T) / T + 2; e.born = 0; e.st = 'rock'; }
        else { const T = rr(W, 2.6, 3.2), vx = rr(W, -6, 6); const e = addEnemy(W, 'meteor', wp(tx - vx * T), 0.8); e.vx = vx; e.vy = 4.5 * T; e.born = 0; e.st = 'lava'; W.ev.push({ k: 'vent', x: e.x }); }
      }
    }
    if (E.t >= E.T) { W.ev.push({ k: 'eventend', kind: E.kind }); W.event = null; }
    return;
  }
  if (W.phase !== 'fight' || W.tutorial) return;
  const key = W.mode === 'endless' ? ['verdant', 'dune', 'frost', 'cinder', 'umbra'][W.k % 5] : ['verdant', 'dune', 'frost', 'cinder', 'umbra'][W.sector];
  const due = W.mode === 'endless' ? W.waveN % 2 === 1 : EVENT.waves.includes(W.wave);
  if (!due || W.eventDone === (W.mode === 'endless' ? W.waveN : W.wave)) return;
  if (W.eventAt === undefined || W.eventAtW !== W.wave + (W.waveN || 0) * 100) { W.eventAt = rr(W, EVENT.at[0], EVENT.at[1]); W.eventAtW = W.wave + (W.waveN || 0) * 100; }
  if (W.waveT < W.eventAt) return;
  W.eventDone = W.mode === 'endless' ? W.waveN : W.wave;
  const kind = EVENTS[key], C2 = EVENT[kind];
  W.event = { kind, t: 0, T: C2.T + (kind === 'meteors' || kind === 'eruption' ? 2 : 0), n: 0, dir: rand(W) < 0.5 ? -1 : 1 };
  if (kind === 'flare') W.stun = C2.stun;
  W.ev.push({ k: 'event', kind, T: W.event.T, dir: W.event.dir });
}
function prowler(W, e, dt) {
  const p = nearestPlayer(W, e.x, 400);
  if (!p) { e.vx *= 0.98; return; }
  const side = Math.sign(wd(e.x - p.x)) || 1;
  moveTo(e, p.x + side * 10, p.y + Math.sin(e.t * 1.5 + e.ph) * 4, Math.max(W.R.hV * 1.3, Math.abs(p.vx) * 1.08 + 4), 40, dt);
}
// a machine that is shooting glows (the tell) for 0.6 x warn, then fires a bolt at the pilot
// these never fire bolts (they ram, bite, spawn or throw their own firebrands)
const NOGUN = new Set(['whirler', 'coil', 'spark', 'scorcher', 'maw']);
function shoot(W, e, dt) {
  if (e.type === 'mine' || e.type === 'skimmer' || e.type === 'meteor' || NOGUN.has(e.type) || safeNow(W)) return;
  const p = nearestPlayer(W, e.x, 46);
  if (e.tell > 0) {
    e.tell -= dt;
    if (e.tell <= 0) { if (p) bolt(W, e, p); }
    return;
  }
  e.fireT -= dt;
  if (e.fireT > 0) return;
  const rate = W.R.fire * (e.type === 'husk' ? 1.4 : e.type === 'prowler' ? 2.4 : e.type === 'stinger' ? 0.5 : e.type === 'hive' ? 0.6 : 1);
  e.fireT = rr(W, 0.7, 1.3) / Math.max(0.02, rate);
  if (!p || e.type === 'lifter' && e.st === 'lift') return;
  const telling = W.enemies.filter((q) => q.tell > 0).length;
  if (telling >= W.R.shooters) return;
  e.tell = W.R.warn * 0.6;
  W.ev.push({ k: 'tell', id: e.id, x: e.x, y: e.y, T: e.tell });
}
function bolt(W, e, p, ang) {
  const R = W.R, v = R.boltV;
  let a = ang;
  if (a === undefined) {
    const dx0 = wd(p.x - e.x), dy0 = p.y - e.y, t = Math.hypot(dx0, dy0) / v;
    const tx = dx0 + p.vx * t * R.lead, ty = dy0 + p.vy * t * R.lead * 0.5;
    a = Math.atan2(ty, tx) + rr(W, -R.aim, R.aim);
  }
  W.bolts.push({ id: W.nextId++, x: e.x, y: e.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, from: e.type || 'carrier' });
  W.ev.push({ k: 'bolt', x: e.x, y: e.y, from: e.type || 'carrier' });
}

// ------------------------------------------------------------------ the carrier
function startBoss(W) {
  W.phase = 'boss'; W.waveT = 0;
  if (W.mode === 'endless') { W.waveN++; W.R = ramp(W); }
  else W.R = ramp(W);
  const key = bossKey(W), D = BOSSES[key];
  const p = alivePlayers(W)[0] || W.players[0];
  const face = p.face || 1;
  const B = { key, x: wp(p.x + face * 34), y: BOSSES[key].alt, vx: 0, vy: 0, face: -face, st: 'warp', t: 0, stT: 3.2, nodes: D.nodes.map(() => ({ hp: W.R.nodeHP, max: W.R.nodeHP })),
    atk: null, atkT: 4, last: '', hitT: 0, rushV: 0, sweepX: 0, dyT: 0, phase: 1 };
  B.stT = PHASE2.warpT;
  W.boss = B;
  W.stats.bossT = W.secT;
  W.ev.push({ k: 'bosswarp', key, x: B.x, y: B.y, T: B.stT });
}
function bossDirector(W, dt) {
  // the carrier's support: a trickle of lifters (husks once the colony has fallen)
  const B = W.boss;
  if (!B || B.st !== 'fight') return;
  void dt;
}
export const bossAlive = (B) => B && (B.st === 'fight' || B.st === 'warp');
export function nodePos(B, i) { const n = (B.phase === 2 ? coreOf(B.key) : BOSSES[B.key].nodes)[i]; return [wp(B.x + n[0] * B.face), B.y + n[1]]; }
function boss(W, B, dt) {
  B.t += dt;
  if (B.hitT > 0) B.hitT -= dt;
  const R = W.R;
  if (B.st === 'warp') { B.stT -= dt; if (B.stT <= 0) { B.st = 'fight'; W.ev.push({ k: 'bossfight', key: B.key, x: B.x, y: B.y }); } return; }
  if (B.st === 'shed') {
    B.stT -= dt; B.vx *= 0.94; B.vy = (BOSSES[B.key].alt - B.y) * 0.8; B.x = wp(B.x + B.vx * dt); B.y += B.vy * dt;
    if ((W.n % 20) === 0) W.ev.push({ k: 'cboom', x: wp(B.x + rr(W, -9, 9)), y: B.y + rr(W, -3, 3), small: 1 });
    if (B.stT <= 0) { B.st = 'fight'; B.atkT = 1.2; W.ev.push({ k: 'bossphase2', key: B.key, x: B.x, y: B.y }); }
    return;
  }
  if (B.st === 'dying') {
    B.stT -= dt; B.vy = -1.5; B.y += B.vy * dt;
    if ((W.n % 18) === 0) W.ev.push({ k: 'cboom', x: wp(B.x + rr(W, -10, 10)), y: B.y + rr(W, -3, 3) });
    if (B.stT <= 0) bossDown(W, B);
    return;
  }
  if (B.st !== 'fight') return;
  const p = nearestPlayer(W, B.x) || W.players[0];
  const dx = wd(p.x - B.x);
  const a = B.atk;
  if (!a || a.kind !== 'rush') { const f = Math.sign(dx) || B.face; if (f !== B.face && Math.abs(dx) > 4) { B.face = f; W.ev.push({ k: 'bossturn' }); } }
  // keep station off the pilot's nose, high in the sky
  if (!a || a.kind === 'volley' || a.kind === 'drop' || a.kind === 'mines') {
    const tx = p.x - Math.sign(dx || 1) * 24, ty = BOSSES[B.key].alt + Math.sin(B.t * 0.5) * 2.5;
    const ddx = wd(tx - B.x);
    B.vx += clamp(clamp(ddx * 0.8, -R.bossV, R.bossV) - B.vx, -5 * dt, 5 * dt);
    B.vy = (ty - B.y) * 0.8;
  }
  if (!a) {
    B.atkT -= dt;
    if (B.atkT <= 0) {
      const all = B.phase === 2 ? [...BOSSES[B.key].atk, 'barrage', 'barrage'] : BOSSES[B.key].atk;
      const list = all.filter((k) => k !== B.last || all.length === 1);
      const kind = list[(rand(W) * list.length) | 0];
      B.last = kind;
      const T = kind === 'sweep' ? R.warn * 1.3 : kind === 'rush' ? R.warn * 1.1 : R.warn * 0.8;
      B.atk = { kind, t: 0, T, n: 0, dir: Math.sign(dx) || 1, y: p.y, x0: B.x };
      if (kind === 'sweep') B.sweepX = wp(B.x);
      W.ev.push({ k: 'bosstell', kind, x: B.x, y: B.y, T, py: p.y, dir: B.atk.dir });
    }
  } else {
    a.t += dt;
    const live = a.t >= a.T;
    if (a.kind === 'volley') {
      if (live && a.n === 0) {
        a.n = 1;
        const base = Math.atan2(p.y - B.y, dx), N = 3 + Math.min(2, Math.floor((W.mode === 'endless' ? W.level : W.sector) / 2));
        for (let i = 0; i < N; i++) bolt(W, B, p, base + (i - (N - 1) / 2) * 0.16);
        W.ev.push({ k: 'bossatk', kind: 'volley', x: B.x, y: B.y });
      }
      if (a.t > a.T + 0.6) endAtk(W, B);
    } else if (a.kind === 'barrage') {
      // phase 2: three spinning rings of bolts
      B.vx *= 0.96;
      if (live && a.n < 3 && a.t > a.T + a.n * 0.32) {
        const N = 9 + Math.min(4, W.sector);
        for (let i = 0; i < N; i++) bolt(W, B, p, (i / N) * Math.PI * 2 + a.n * 0.21);
        a.n++;
        W.ev.push({ k: 'bossatk', kind: 'barrage', x: B.x, y: B.y });
      }
      if (a.t > a.T + 1.4) endAtk(W, B);
    } else if (a.kind === 'drop') {
      if (live && a.n === 0) {
        a.n = 1;
        const live2 = W.enemies.filter((e) => HOSTILE.has(e.type)).length;
        const n = live2 > 5 ? 0 : W.fallen ? 1 : 2;
        for (let i = 0; i < n; i++) { const e = addEnemy(W, W.fallen ? 'husk' : 'lifter', wp(B.x + (i ? 2 : -2)), B.y - 2.5); e.born = 0.7; W.ev.push({ k: 'warpin', type: e.type, x: e.x, y: e.y, id: e.id, T: 0.7 }); }
        W.ev.push({ k: 'bossatk', kind: 'drop', x: B.x, y: B.y, n });
      }
      if (a.t > a.T + 0.8) endAtk(W, B);
    } else if (a.kind === 'mines') {
      if (!live) { B.vx *= 0.97; }
      if (live && a.n < 6 && a.t > a.T + a.n * 0.18) {
        a.n++;
        const m = addEnemy(W, 'mine', wp(B.x + rr(W, -9, 9)), clamp(B.y - rr(W, 3, 16), 3, H - 3));
        m.born = 0.3; m.life = 7;
        W.ev.push({ k: 'mine', x: m.x, y: m.y, id: m.id });
      }
      if (a.t > a.T + 1.4) endAtk(W, B);
    } else if (a.kind === 'rush') {
      // drop to the pilot's height during the tell, then dash along it
      if (!live) { B.vx *= 0.9; B.vy = (clamp(a.y, 6, 30) - B.y) * 2; }
      else {
        if (a.n === 0) { a.n = 1; W.ev.push({ k: 'bossatk', kind: 'rush', x: B.x, y: B.y, dir: a.dir }); }
        B.vx = a.dir * R.bossV * 5.5; B.vy = 0;
        if (a.t > a.T + 1.5) endAtk(W, B);
      }
    } else if (a.kind === 'sweep') {
      B.vx *= 0.95;
      if (live) {
        if (a.n === 0) { a.n = 1; W.ev.push({ k: 'bossatk', kind: 'sweep', x: B.x, y: B.y, dir: a.dir }); }
        B.sweepX = wp(B.sweepX + a.dir * 15 * dt);
        for (const q of W.players) if (q.alive && Math.abs(wd(q.x - B.sweepX)) < 1.1 && q.y < B.y - 1) hurt(W, q, 'beam', B.sweepX, q.y);
        if (a.t > a.T + 2.2) endAtk(W, B);
      }
    }
  }
  B.x = wp(B.x + B.vx * dt);
  B.y = clamp(B.y + B.vy * dt, 4, H - 1);
}
function endAtk(W, B) { B.atk = null; B.atkT = W.R.atkT * rr(W, 0.8, 1.2) * (B.rage ? 0.68 : 1) * (B.phase === 2 ? PHASE2.atkK : 1); }
// phase 2 core points from the main hull: the heart at its centre, a vent low at each end
const CORE = {};
export function coreOf(key) {
  if (!CORE[key]) { const [bx, by, rx, ry] = BOSSES[key].body[0]; CORE[key] = [[bx, by], [bx + rx * 0.55, by - ry * 0.3], [bx - rx * 0.55, by - ry * 0.3]]; }
  return CORE[key];
}
function hitNode(W, B, i, pid, dmg = 1) {
  const n = B.nodes[i];
  if (!n || n.hp <= 0) return;
  n.hp = Math.max(0, n.hp - dmg); B.hitT = 0.25;
  const [x, y] = nodePos(B, i);
  addScore(W, 50);
  if (n.hp <= 0) {
    addScore(W, SCORE.node);
    W.ev.push({ k: 'nodebreak', i, x, y, pid, score: SCORE.node });
    const down = B.nodes.filter((q) => q.hp <= 0).length;
    if (!B.rage && down * 2 >= B.nodes.length && down < B.nodes.length) { B.rage = 1; W.ev.push({ k: 'enrage', x: B.x, y: B.y, key: B.key }); }
    if (B.nodes.every((q) => q.hp <= 0) && B.phase !== 2) {
      // the armour blows off and the core opens
      const hp = W.R.nodeHP;
      B.phase = 2; B.st = 'shed'; B.stT = PHASE2.shedT; B.atk = null; B.rage = 0;
      B.nodes = coreOf(B.key).map((c, k) => { const h2 = Math.ceil(hp * (k ? PHASE2.ventK : PHASE2.heartK)); return { hp: h2, max: h2 }; });
      W.ev.push({ k: 'bossshed', x: B.x, y: B.y, key: B.key });
    } else if (B.nodes.every((q) => q.hp <= 0)) {
      B.st = 'dying'; B.stT = 4; B.atk = null;
      W.ev.push({ k: 'bossdying', x: B.x, y: B.y, key: B.key });
    }
  } else W.ev.push({ k: 'nodehit', i, x, y, hp: n.hp, max: n.max, pid });
}
function bossDown(W, B) {
  const bonus = SCORE.boss * (W.mode === 'endless' ? 1 + W.bossN : W.sector + 1);
  addScore(W, bonus);
  W.ev.push({ k: 'bosskill', x: B.x, y: B.y, key: B.key, bonus });
  for (const e of W.enemies) if (e.hp > 0) { e.hp = 0; W.ev.push({ k: 'kill', id: e.id, type: e.type, x: e.x, y: e.y, vx: e.vx, vy: e.vy, score: 0 }); }
  W.bolts.length = 0;
  B.st = 'gone'; W.boss = null; W.bossN++;
  if (W.mode === 'endless') {
    // a new planet (and a new colony) after every carrier
    W.k = (W.k + 1) % 5; makeColony(W);
    W.phase = 'break'; W.phaseT = 4.5;
    W.ev.push({ k: 'newworld', look: W.k });
    return;
  }
  const alive = settlersLeft(W), sb = SCORE.sector + alive * SCORE.waveBonus * 5;
  addScore(W, sb);
  W.phase = 'clear'; W.phaseT = 3.4;
  W.ev.push({ k: 'clear', bonus: sb + bonus, alive, t: W.secT });
}

// ------------------------------------------------------------------ beams, bolts, pods
function shots(W, dt) {
  const range0 = beamRange(W), band0 = F.beamH * (1 + 0.25 * (W.up.reach || 0));
  for (const s of W.shots) {
    if (s.done) continue;
    const range = (s.hyper ? range0 * HYPER.reach : range0) * (s.rk || 1), band = (s.hyper ? band0 * HYPER.band : band0) * (s.bk || 1);
    const head0 = Math.min(range, F.beamV * s.t);
    s.t += dt;
    const head = Math.min(range, F.beamV * s.t), tail = Math.max(0, F.beamV * s.t - F.beamLen);
    if (tail >= range) { s.done = true; continue; }
    // the nearest thing the head swept over this step
    let best = null, bd = 1e9, node = -1;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0) continue;
      const r = ENEMY[e.type].r;
      if (Math.abs(e.y - s.y) > r + band) continue;
      const d = wd(e.x - s.x0) * s.dir;
      if (d < head0 - r - 2 || d > head + r) continue;
      if (d < bd) { bd = d; best = e; }
    }
    const B = W.boss;
    if (B && B.st === 'fight') {
      B.nodes.forEach((n, i) => {
        if (n.hp <= 0) return;
        const [nx, ny] = nodePos(B, i);
        if (Math.abs(ny - s.y) > 1.15 + band) return;
        const d = wd(nx - s.x0) * s.dir;
        if (d < head0 - 3 || d > head + 1.2) return;
        // a weak point lined up with the beam is hit even where it sits against the hull
        if (node < 0 || d < bd) { bd = Math.min(bd, d); best = null; node = i; }
      });
      // the hull stops beams that miss the weak points
      for (const b of BOSSES[B.key].body) {
        const cx = wp(B.x + b[0] * B.face), cy = B.y + b[1];
        const dy = (s.y - cy) / b[3];
        if (Math.abs(dy) >= 1) continue;
        const hw = b[2] * Math.sqrt(1 - dy * dy);
        const d = wd(cx - s.x0) * s.dir - hw;
        if (d < head0 - 2 * hw - 1 || d > head) continue;
        if (node < 0 && d < bd - 0.6) { bd = d; best = null; node = -2; }
      }
    }
    if (W.rivals) for (const q of W.players) {
      if (q.id === s.pid || !q.alive || !q.carry || Math.abs(q.y - s.y) > 1 + band) continue;
      const d = wd(q.x - s.x0) * s.dir;
      if (d < head0 - 2 || d > head + 1 || d > bd) continue;
      s.done = true; s.hitD = d;
      const st = W.settlers.find((z) => z.id === q.carry); if (st) drop(W, st);
      q.carry = 0; q.stolenN = (q.stolenN || 0) + 1;
      addScore(W, RIVALS.steal, 0, s.pid);
      W.ev.push({ k: 'stolen', pid: q.id, by: s.pid, x: q.x, y: q.y });
      break;
    }
    if (s.done) continue;
    if (node === -2) {
      // the hull took the beam: a weak point at this height anywhere along the hull ahead takes it instead
      let bn = -1, bnd = 1e9;
      B.nodes.forEach((q, i) => {
        if (q.hp <= 0) return;
        const [nx, ny] = nodePos(B, i);
        if (Math.abs(ny - s.y) > 1.15 + band) return;
        const d = wd(nx - s.x0) * s.dir;
        if (d < bd - 1 || d > bd + BOSSES[B.key].len) return;
        if (d < bnd) { bnd = d; bn = i; }
      });
      if (bn >= 0) { node = bn; bd = bnd; }
    }
    if (node >= 0) { s.done = true; const [nx, ny] = nodePos(B, node); hitNode(W, B, node, s.pid, s.dmg || 1); W.stats.hits++; if (s.arc) arcFrom(W, nx, ny, s.arc, null, s.pid, s.ar || 1); }
    else if (node === -2) { s.done = true; W.ev.push({ k: 'plink', x: wp(s.x0 + s.dir * bd), y: s.y }); }
    else if (best) {
      s.done = true; W.stats.hits++;
      damage(W, best, s.dmg || 1, s.pid);
      W.ev.push({ k: 'beamhit', x: wp(s.x0 + s.dir * Math.max(0, bd)), y: s.y, id: best.id, dead: best.hp <= 0 });
      if (s.arc) arcFrom(W, best.x, best.y, s.arc, best, s.pid, s.ar || 1);
      if (s.sw && best.hp <= 0) shockwave(W, best, s.pid);
    }
    s.hitD = bd < 1e8 ? bd : head;
  }
  W.shots = W.shots.filter((s) => !s.done);
}
// Breaker mastery II: a wreck made by its shell hits every machine within 4.5 m once
function shockwave(W, src, pid) {
  W.ev.push({ k: 'shockwave', x: src.x, y: src.y, small: src.type === 'skimmer' });
  for (const e of W.enemies) {
    if (e === src || e.hp <= 0 || e.born > 0) continue;
    if (Math.hypot(wd(e.x - src.x), e.y - src.y) < 4.5) damage(W, e, 1, pid);
  }
}
function bolts(W, dt) {
  for (const b of W.bolts) {
    b.t += dt;
    if (b.home > 0) {
      b.home -= dt;
      const p = nearestPlayer(W, b.x, 80);
      if (p) {
        const want = Math.atan2(p.y - b.y, wd(p.x - b.x)), cur = Math.atan2(b.vy, b.vx), sp = Math.hypot(b.vx, b.vy);
        let d = want - cur; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const a = cur + clamp(d, -SCORCH.turn * dt, SCORCH.turn * dt);
        b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp;
      }
    }
    b.x = wp(b.x + b.vx * dt); b.y += b.vy * dt;
    if (b.y < 0.2) { b.t = 99; W.ev.push({ k: 'boltground', x: b.x, y: 0.2 }); continue; }
    if (b.y > H + 2) { b.t = 99; continue; }
    for (const p of W.players) {
      if (!p.alive) continue;
      if (Math.abs(wd(p.x - b.x)) < F.r + 0.3 && Math.abs(p.y - b.y) < 0.75) { if (hurt(W, p, 'bolt:' + b.from, b.x, b.y)) b.t = 99; }
    }
  }
  W.bolts = W.bolts.filter((b) => b.t < 3.6);
}
export function damage(W, e, dmg, pid) {
  // intersection pods are shielded until they lock together
  if (e.cross && !e.link) { W.ev.push({ k: 'plink', x: e.x, y: e.y }); return; }
  e.hp -= dmg; e.hitT = 0.12;
  if (e.hp <= 0) kill(W, e, pid, 'beam');
  else W.ev.push({ k: 'hit', id: e.id, x: e.x, y: e.y, hp: e.hp });
}
function kill(W, e, pid, by) {
  e.hp = 0;
  let score = ENEMY[e.type].score;
  if (pid && e.type !== 'mine') {
    W.chain = W.t - W.chainT < CHAIN_T ? W.chain + 1 : 1; W.chainT = W.t;
    W.bestChain = Math.max(W.bestChain, W.chain);
    score *= chainMult(W.chain);
  }
  const kp = pid ? W.players.find((q) => q.id === pid) : null;
  if (kp && kp.hyper > 0) score *= HYPER.score;
  if (kp && !(kp.hyper > 0) && e.type !== 'mine') { kp.hyperK = Math.min(1, (kp.hyperK || 0) + HYPER.gain * (1 + (chainMult(W.chain) - 1) * 0.5) * (kp.ship === 'warden' && kp.mast >= 2 ? 1.35 : 1)); if (kp.hyperK >= 1) { kp.hyperK = 0; kp.hyper = HYPER.time; W.ev.push({ k: 'hyper', pid: kp.id, x: kp.x, y: kp.y }); } }
  if (pid) addScore(W, score, e.type === 'skimmer' || e.type === 'meteor' ? 0 : ENEMY[e.type].score, pid);
  W.stats.kills++;
  if (e.type === 'lifter') W.stats.lifters++;
  if (e.type === 'husk') W.stats.husks++;
  W.ev.push({ k: 'kill', id: e.id, type: e.type, x: e.x, y: e.y, vx: e.vx, vy: e.vy, score: pid ? score : 0, pid, by, carry: !!e.carry, chain: pid ? W.chain : 0 });
  if (e.carry) { const s = W.settlers.find((q) => q.id === e.carry); if (s && s.st === 'held') drop(W, s); e.carry = 0; }
  if (e.tgt) { const s = W.settlers.find((q) => q.id === e.tgt); if (s) s.mark = 0; }
  if (e.type === 'hive') {
    // the pod splits open and its stingers burst out of it (away from the shooter when it was linked)
    const n = e.sting || W.R.sting, kp = W.players.find((q) => q.id === pid), away = e.link && kp ? Math.sign(wd(e.x - kp.x)) || 1 : 0;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rr(W, -0.3, 0.3);
      const q = addEnemy(W, 'stinger', wp(e.x + Math.cos(a) * 0.8), e.y + Math.sin(a) * 0.8);
      q.born = 0; q.vx = Math.cos(a) * 9 + away * 12; q.vy = Math.sin(a) * 7;
    }
    W.ev.push({ k: 'hivepop', x: e.x, y: e.y, n, id: e.id });
    // POD INTERSECTION: its linked partner bursts with it
    const o = e.link && W.enemies.find((q) => q.id === e.link && q.hp > 0);
    e.link = 0;
    if (o) {
      o.link = 0;
      if (pid) { addScore(W, INTERSECT.bonus, INTERSECT.bonus, pid); W.stats.cross = (W.stats.cross || 0) + 1; }
      W.ev.push({ k: 'intersection', x: wp(e.x + wd(o.x - e.x) / 2), y: (e.y + o.y) / 2, bonus: pid ? INTERSECT.bonus : 0, pid });
      o.link = 0; o.sting = o.sting || n;
      kill(W, o, pid, 'link');
    }
  }
  const ch = DROP.chance[e.type] || 0;
  if (pid && W.pods.length < DROP.max && rand(W) < ch) addPod(W, e.x, e.y);
}
function addPod(W, x, y) {
  let tot = 0;
  for (const k of PW_KEYS) tot += POWERUPS[k].w;
  let r = rand(W) * tot, kind = PW_KEYS[0];
  for (const k of PW_KEYS) { r -= POWERUPS[k].w; if (r <= 0) { kind = k; break; } }
  W.pods.push({ id: W.nextId++, kind, x, y, t: 0 });
  W.ev.push({ k: 'drop', kind, x, y });
}
function pods(W, dt) {
  for (const q of W.pods) {
    q.t += dt;
    q.y = Math.max(2.5, q.y - 1.2 * dt);
    for (const p of W.players) {
      if (!p.alive || p.remote) continue;
      if (Math.abs(wd(p.x - q.x)) < DROP.r && Math.abs(p.y - q.y) < DROP.r) { q.t = 99; pickup(W, p, q); break; }
    }
  }
  W.pods = W.pods.filter((q) => q.t < DROP.life);
}
export function pickup(W, p, q) {
  const P = POWERUPS[q.kind];
  W.stats.pods++;
  if (q.kind === 'cell') p.shield = Math.min(4, p.shield + 1);
  else if (q.kind === 'nova') p.nova = Math.min(F.novaMax, p.nova + 1);
  else p.pw[q.kind] = P.time;
  W.ev.push({ k: 'pickup', kind: q.kind, x: q.x, y: q.y, pid: p.id });
}
// lifeN: the points that count toward extra ships (a kill chain's bonus does not, so chains do not make the game easier)
export function addScore(W, n, lifeN = n, pid = 0) {
  const b = Math.round(n * D_OF(W).score); W.score += b; W.lifePts += Math.round(lifeN * D_OF(W).score);
  if (W.rivals && pid) { const p = W.players.find((q) => q.id === pid); if (p) p.score = (p.score || 0) + b; }
}

// ------------------------------------------------------------------ contacts
function contacts(W) {
  for (const p of W.players) {
    if (!p.alive || p.remote) continue;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.born > 0) continue;
      const r = ENEMY[e.type].r + F.r * 0.8;
      if (Math.abs(wd(e.x - p.x)) < r && Math.abs(e.y - p.y) < r * 0.8) {
        if (p.hyper > 0) { kill(W, e, p.id, 'ram'); continue; }
        if (p.inv > 0) continue;
        hurt(W, p, e.type, e.x, e.y);
        kill(W, e, p.id, 'ram');
        break;
      }
    }
    const B = W.boss;
    if (p.alive && B && (B.st === 'fight' || B.st === 'dying') && p.inv <= 0) {
      for (const b of BOSSES[B.key].body) {
        const cx = wp(B.x + b[0] * B.face), cy = B.y + b[1];
        const u = wd(p.x - cx) / (b[2] + 0.6), v = (p.y - cy) / (b[3] + 0.5);
        if (u * u + v * v < 1) {
          // the hull is solid: brushing it shoves you off; only its charge (the rush) is lethal
          const rushing = B.atk && B.atk.kind === 'rush' && B.atk.t >= B.atk.T;
          if (rushing) { hurt(W, p, 'carrier', p.x, p.y); break; }
          const l = Math.hypot(u, v) || 1, nx = u / l, ny = v / l;
          p.x = wp(cx + nx * (b[2] + 0.62)); p.y = clamp(cy + ny * (b[3] + 0.52), F.minY, F.maxY);
          p.vx = nx * Math.max(8, Math.abs(p.vx) * 0.5) + B.vx; p.vy = ny * 8;
          if (!p.bumpT || W.t - p.bumpT > 0.4) { p.bumpT = W.t; W.ev.push({ k: 'bump', pid: p.id, x: p.x, y: p.y }); }
          break;
        }
      }
    }
    // tutorial prompts that wait for the situation
    if (W.tutorial && p.id === 1) {
      if (W.waveT > TUTOR.firstAt + 8) tut(W, 'scanner');
      if (W.enemies.filter((e) => HOSTILE.has(e.type) && Math.abs(wd(e.x - p.x)) < F.novaR).length >= 3 && p.nova > 0) tut(W, 'nova');
      if (W.waveT > 50) tut(W, 'blink');
    }
  }
}

// ------------------------------------------------------------------ online helpers (the host applies what a guest claims)
export function netDeath(W, p, cause) { if (p.alive) die(W, p, cause); }
export function netShield(W, p, left) { p.shield = left; W.ev.push({ k: 'shield', pid: p.id, x: p.x, y: p.y, left }); }
export function netNova(W, p) { const n = p.nova; p.nova = Math.max(1, n); nova(W, p); p.nova = Math.max(0, n - 1); }
export function netCatch(W, p, sid) {
  const s = W.settlers.find((q) => q.id === sid);
  if (!s || s.st !== 'fall' || p.carry) return;
  s.st = 'carried'; s.by = p.id; p.carry = s.id;
  addScore(W, SCORE.catch, SCORE.catch, p.id); W.stats.caught++;
  W.ev.push({ k: 'catch', x: s.x, y: s.y, pid: p.id, score: SCORE.catch });
}
export function netLand(W, p) {
  const s = W.settlers.find((q) => q.id === p.carry);
  if (!s) return;
  s.st = 'walk'; s.by = 0; s.y = 0; s.x = p.x; s.home = p.x; p.carry = 0;
  addScore(W, SCORE.land, SCORE.land, p.id); W.stats.landed++;
  W.ev.push({ k: 'land', x: s.x, y: 0, pid: p.id, score: SCORE.land, id: s.id });
}
export function netPod(W, id, p) { const q = W.pods.find((o) => o.id === id); if (q) { q.t = 99; pickup(W, p, q); } }
export function netFire(W, p, x0, y, dir, twin, hy = 0, kind) {
  if (kind !== undefined && SHIP_KEYS[kind]) p.ship = SHIP_KEYS[kind];
  emitShots(W, p, x0, y, dir, twin, hy, 0);
  W.ev.push({ k: 'fire', pid: p.id, x: x0, y, dir, twin, ship: p.ship });
}

// ------------------------------------------------------------------ the online guest's step
// The guest's world comes from the host's snapshots; locally it flies its own ship (no lag), draws its own beams,
// and judges what hits it. Everything that changes the shared world goes to the host as a claim (W.claims).
export function stepGuest(W, dt = STEP) {
  W.n++; W.t += dt;
  const me = W.players.find((p) => !p.remote);
  if (!me) return;
  player(W, me, dt);
  gateCheck(W, me);
  for (const s of W.shots) { if (s.pid !== me.id || s.done) continue; s.t += dt; if (F.beamV * s.t - F.beamLen > beamRange(W)) s.done = true; }
  W.shots = W.shots.filter((s) => !s.done || s.pid !== me.id);
  for (const b of W.bolts) b.t += 0;   // bolts are moved by the host's snapshots
  if (!me.alive) return;
  for (const b of W.bolts) {
    if (b.t >= 99) continue;
    if (Math.abs(wd(me.x - b.x)) < F.r + 0.3 && Math.abs(me.y - b.y) < 0.75) { if (hurt(W, me, 'bolt:' + b.from, b.x, b.y)) b.t = 99; }
  }
  for (const e of W.enemies) {
    if (!me.alive || e.hp <= 0 || e.born > 0 || me.inv > 0) continue;
    const r = ENEMY[e.type].r + F.r * 0.8;
    if (Math.abs(wd(e.x - me.x)) < r && Math.abs(e.y - me.y) < r * 0.8) { if (!(me.hyper > 0)) hurt(W, me, e.type, e.x, e.y); W.claims.push({ ram: e.id }); }
  }
  if (me.alive && !me.carry) {
    const cr = F.catchR * (1 + 0.3 * (W.up.tractor || 0));
    for (const s of W.settlers) {
      if (s.st !== 'fall' || Math.abs(wd(me.x - s.x)) > cr || Math.abs(me.y - s.y) > cr) continue;
      s.st = 'carried'; s.by = me.id; me.carry = s.id;
      W.claims.push({ catch: s.id });
      W.ev.push({ k: 'catch', x: s.x, y: s.y, pid: me.id, score: SCORE.catch });
      break;
    }
  }
  if (me.carry) { const s = W.settlers.find((q) => q.id === me.carry); if (s && s.st === 'carried') { s.x = me.x; s.y = me.y - 1.25; } }
  for (const q of W.pods) {
    if (q.t >= 99 || Math.abs(wd(me.x - q.x)) > DROP.r || Math.abs(me.y - q.y) > DROP.r) continue;
    q.t = 99; W.claims.push({ pod: q.id }); pickup(W, me, q);
  }
}
// the host applies a guest's claims
export function netRam(W, p, id) { const e = W.enemies.find((q) => q.id === id); if (e && e.hp > 0) kill(W, e, p.id, 'ram'); }
export function netNovaAt(W, p, x, y) { const px = p.x, py = p.y, n = p.nova; p.x = x; p.y = y; p.nova = Math.max(1, n); nova(W, p); p.nova = Math.max(0, n - 1); p.x = px; p.y = py; }
// a guest keeps the host's wave, world and colony layout
export function netAdopt(W, wave, k, level, sites) {
  const changed = W.wave !== wave || W.k !== k || Math.abs((W.level || 0) - level) > 0.05;
  W.wave = wave; W.cp = Math.min(WAVES, wave); W.k = k; W.level = level;
  if (sites && sites.length) W.sites = sites;
  if (changed || !W.R) W.R = W.mode === 'endless' ? applyDiff(rampLevel(level), W.diff) : applyDiff(rampAt(W.sector, Math.min(WAVES, wave)), W.diff);
}
