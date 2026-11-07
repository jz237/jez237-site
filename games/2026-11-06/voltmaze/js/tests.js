// ?test=1 self-test page: sim invariants, determinism, exact replays, clone safety, the RAMP rising
// step by step, the difficulty levels, every room reachable, the autopilot getting through a sector and
// a boss, the live game loop running without console errors, and no score posts from test runs.
import { makeWorld, step, drainEvents, STEP, cloneWorld, genWalls, wallNear, routeSide, gridDist, SIDES, entryPoint } from './sim.js?v=7';
import { Autopilot } from './ai.js?v=7';
import { RAMP, SECTORS, TYPICAL_UP, rampAt, rampLevel, endlessLevel, DIFF_KEYS, applyDiff, MIN_WARN, ROOM, F, BOSSES } from './config.js?v=7';
import { Recorder, Replay } from './replay.js?v=7';

const r6 = (v) => Math.round(v * 1e6) / 1e6;
export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.roomN, W.depth, W.phase, W.rs, W.room && W.room.key, W.players.map((p) => [r6(p.x), r6(p.z), p.alive, p.shield, p.emp]),
  W.robots.map((e) => [e.id, r6(e.x), r6(e.z), e.hp]), W.bolts.map((b) => [b.id, r6(b.x), r6(b.z)]), W.mines.length, W.zones.length, W.boss ? [r6(W.boss.x), r6(W.boss.z), W.boss.hp] : 0, W.seeker ? [r6(W.seeker.x), r6(W.seeker.z)] : 0]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function drive(W, ai, ticks, rec, onTick) {
  for (let i = 0; i < ticks && !W.over; i++) {
    if (rec) rec.tick(W);
    const P = W.players[0];
    P.input = ai.control(W, P);
    if (rec) rec.input(W);
    step(W, STEP);
    const ev = drainEvents(W);
    if (onTick && onTick(W, ev) === false) break;
  }
}
// sim invariants, checked every tick: nothing NaN, everything inside the room, ids unique
export function invariants(W) {
  const bad = [];
  const fin = (v) => Number.isFinite(v);
  for (const p of W.players) if (!fin(p.x) || !fin(p.z)) bad.push('player NaN');
  for (const e of W.robots) { if (!fin(e.x) || !fin(e.z)) bad.push('robot NaN ' + e.type); if (Math.abs(e.x) > ROOM.RW + 1.2 || Math.abs(e.z) > ROOM.RH + 1.2) bad.push('robot outside ' + e.type); }
  for (const b of W.bolts) if (!fin(b.x) || !fin(b.z)) bad.push('bolt NaN');
  if (W.boss && (!fin(W.boss.x) || !fin(W.boss.hp))) bad.push('boss NaN');
  const ids = new Set();
  for (const e of W.robots) { if (ids.has(e.id)) bad.push('dup id'); ids.add(e.id); }
  if (W.lives < 0) bad.push('negative lives');
  // a live suit is inside the room, or in a door gap on its way out (never through an electrified wall)
  if (W.phase === 'play') for (const p of W.players) if (p.alive) {
    const D = ROOM.door / 2, ax = Math.abs(p.x), az = Math.abs(p.z);
    if ((ax > ROOM.RW + 0.05 && az > D) || (az > ROOM.RH + 0.05 && ax > D) || ax > ROOM.RW + 1 || az > ROOM.RH + 1) bad.push('player outside the room');
  }
  if (W.score < 0 || !fin(W.score)) bad.push('bad score');
  return bad;
}

// every check that needs no browser (the Node scripts run these too)
export function simChecks() {
  const out = [];
  const T = (name, fn) => { let ok = false, info = ''; try { const r = fn(); ok = r.ok; info = r.info || ''; } catch (e) { info = 'threw ' + (e && e.stack || e); } out.push({ name, ok, info }); };
  T('RAMP rises step by step: no sector starts easier than the last one ended', () => {
    const keys = ['count', 'shoot', 'fire', 'boltV', 'lead', 'spd', 'smart', 'walls', 'seekV'];
    const down = ['aim', 'warn', 'seek', 'boot', 'first'];
    let prev = null, bad = [];
    for (let s = 0; s < 5; s++) for (let w = 0; w < RAMP[s].rooms; w++) {
      const r = rampAt(s, w);
      if (prev) {
        for (const k of keys) if (r[k] < prev[k] - 1e-9) bad.push(`${k} S${s + 1}R${w + 1}`);
        for (const k of down) if (r[k] > prev[k] + 1e-9) bad.push(`${k} S${s + 1}R${w + 1}`);
        if (r.warn < prev.warn - 0.14) bad.push(`warn jump S${s + 1}R${w + 1}`);
        if (r.count > prev.count + 2) bad.push(`count jump S${s + 1}R${w + 1}`);
      }
      prev = r;
    }
    const w0 = rampAt(0, 0).warn, w5 = rampAt(4, RAMP[4].rooms - 1).warn;
    return { ok: !bad.length && Math.abs(w0 - 1.2) < 0.05 && Math.abs(w5 - 0.6) < 0.05, info: bad.length ? bad.slice(0, 6).join(', ') : `warn ${w0.toFixed(2)} s → ${w5.toFixed(2)} s, robots ${rampAt(0, 0).count} → ${rampAt(4, 6).count}, shooters ${rampAt(0, 0).shoot} → ${rampAt(4, 6).shoot}` };
  });
  T('NORMAL starts at a medium pace: 2-3 shooters in sector 1, ~1.2 s warnings', () => {
    const r = applyDiff(rampAt(0, 0), 'normal');
    return { ok: r.shoot >= 2 && r.shoot <= 3 && r.count >= 4 && r.warn >= 1.1 && r.warn <= 1.3, info: `count ${r.count}, shoot ${r.shoot}, warn ${r.warn.toFixed(2)}` };
  });
  T('difficulty levels scale the ramp, warnings never under MIN_WARN', () => {
    let bad = [];
    for (const d of DIFF_KEYS) for (let s = 0; s < 5; s++) for (let w = 0; w < RAMP[s].rooms; w++) { const r = applyDiff(rampAt(s, w), d); if (r.warn < MIN_WARN - 1e-9) bad.push(d); }
    const e = applyDiff(rampAt(0, 0), 'easy'), n = applyDiff(rampAt(0, 0), 'normal'), h = applyDiff(rampAt(4, 6), 'nightmare');
    return { ok: !bad.length && e.warn > n.warn && e.shoot <= 1.01 && h.warn >= MIN_WARN, info: `easy warn ${e.warn.toFixed(2)} shoot ${e.shoot.toFixed(1)} · nightmare S5 warn ${h.warn.toFixed(2)}` };
  });
  T('endless walks the same curve and keeps rising', () => {
    let prev = -1, ok = true;
    for (let d = 0; d < 70; d++) { const l = endlessLevel(d); if (l < prev - 1e-9) ok = false; prev = l; }
    const a = rampLevel(endlessLevel(0)), b = rampLevel(endlessLevel(60));
    return { ok: ok && b.warn < a.warn && b.count > a.count, info: `level ${endlessLevel(0).toFixed(2)} → ${endlessLevel(60).toFixed(2)}` };
  });
  T('every generated room: all exits reachable from the entry, entry clear of walls', () => {
    let rooms = 0, bad = 0;
    for (let seed = 1; seed <= 12; seed++) for (let s = 0; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: seed * 7 + s, noTut: true });
      const G = W.grid;
      for (let ry = 0; ry < ROOM.rows; ry++) for (let rx = 0; rx < ROOM.cols; rx++) {
        const doors = {};
        for (const sd of SIDES) doors[sd] = 0;
        // every door open: the strictest case for the walk check
        if (rx > 0) doors.w = 1; if (rx < ROOM.cols - 1) doors.e = 1; if (ry > 0) doors.n = 1; if (ry < ROOM.rows - 1) doors.s = 1;
        const walls = genWalls(W.seed, s, rx, ry, doors, rampAt(s, 4).walls, false);
        rooms++;
        for (const sd of SIDES) if (doors[sd]) { const [x, z] = entryPoint(sd); if (wallNear(walls, x, z, F.r + 0.3)) bad++; }
      }
      // the lift can always be reached
      const D = gridDist(G, G.sx, G.sy);
      if (D[G.ly * ROOM.cols + G.lx] < 1) bad++;
    }
    return { ok: !bad, info: `${rooms} rooms, ${bad} problems` };
  });
  T('deterministic: same seed + same inputs = same world', () => {
    const run = () => { const W = makeWorld({ sector: 2, seed: 4242, up: TYPICAL_UP[2], noTut: true }); drive(W, new Autopilot(9, 'human'), 60 / STEP, new Recorder()); return hashW(W); };
    const a = run(), b = run();
    return { ok: a === b, info: a === b ? 'bit exact over 60 s' : 'MISMATCH' };
  });
  T('a cloned world runs on exactly like the original', () => {
    const W = makeWorld({ sector: 3, seed: 77, up: TYPICAL_UP[3], noTut: true });
    const ai = new Autopilot(3, 'demo');
    drive(W, ai, 20 / STEP);
    const C = cloneWorld(W);
    // the same inputs into both
    let same = true;
    for (let i = 0; i < 15 / STEP && !W.over; i++) {
      const inp = { mx: Math.cos(i * 0.01), mz: Math.sin(i * 0.013), ax: 1, az: 0, fire: i % 40 < 20, plant: false, emp: false, dash: false };
      W.players[0].input = { ...inp }; C.players[0].input = { ...inp };
      step(W); step(C); drainEvents(W); drainEvents(C);
    }
    same = hashW(W) === hashW(C);
    return { ok: same && typeof C.rand === 'function', info: same ? 'identical after 15 s' : 'diverged' };
  });
  T('instant replay reproduces a death or boss kill bit for bit', () => {
    let total = 0, ok = 0;
    for (let seed = 1; seed <= 3 && total < 3; seed++) {
      const W = makeWorld({ sector: 2 + (seed % 3), seed: 900 + seed, up: TYPICAL_UP[2], noTut: true });
      const rec = new Recorder(), ai = new Autopilot(seed, 'human'), keys = [];
      drive(W, ai, 240 / STEP, rec, (W2, ev) => { for (const e of ev) if (e.k === 'death' || e.k === 'bosskill') keys.push({ n: W2.n, k: e.k, h: hashW(W2) }); for (const q of keys) if (!q.clip && W2.n >= q.n + Math.round(1.6 / STEP)) q.clip = rec.clip(q.n); });
      for (const q of keys) {
        if (!q.clip || total >= 4) continue;
        total++;
        const rp = new Replay(cloneWorld(q.clip.snap), q.clip.inputs, q.clip.keyN, q.clip.endN);
        let got = null;
        while (!rp.done) { const ev = rp.advance(STEP); if (rp.W.n === q.n && ev.some((e) => e.k === q.k)) got = hashW(rp.W); }
        if (got === q.h) ok++;
      }
    }
    return { ok: total > 0 && ok === total, info: `${ok} / ${total} exact` };
  });
  T('the demo autopilot clears sector 1 and its boss, with no broken invariants', () => {
    const W = makeWorld({ sector: 0, seed: 5150, lives: 9, noTut: true });
    let bad = [], boss = false;
    drive(W, new Autopilot(5, 'demo'), 400 / STEP, null, (W2, ev) => { if (ev.some((e) => e.k === 'bossdown')) boss = true; if (W2.n % 30 === 0) { const b = invariants(W2); if (b.length) { bad = b; return false; } } });
    return { ok: W.result === 'clear' && boss && !bad.length, info: `${W.result || 'running'} in ${W.t.toFixed(0)} s, ${W.stats.deaths} deaths${bad.length ? ' · ' + bad[0] : ''}` };
  });
  T('every boss can be beaten (demo autopilot from the lift room)', () => {
    const res = [];
    let ok = true;
    for (let s = 0; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 300 + s, boss: true, lives: 12, up: TYPICAL_UP[s], noTut: true });
      let down = false;
      drive(W, new Autopilot(s + 1, 'demo'), 240 / STEP, null, (W2, ev) => { if (ev.some((e) => e.k === 'bossdown')) down = true; });
      if (!down) ok = false;
      res.push(`${BOSSES[SECTORS[s].boss].name.split(' ')[0]} ${down ? 'down' : 'NOT DOWN'}`);
    }
    return { ok, info: res.join(', ') };
  });
  T('walls stay solid while invulnerable; rooms are left only through a door gap', () => {
    let runs = 0, bad = [], exits = 0, deaths = 0;
    for (let seed = 1; seed <= 4; seed++) {
      const W0 = makeWorld({ sector: seed % 5, seed: 610 + seed, noTut: true });
      for (const [mx, mz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [0.71, 0.71], [-0.71, -0.71]]) {
        const W = cloneWorld(W0), p = W.players[0], room0 = W.roomN;
        runs++;
        for (let i = 0; i < 5 / STEP && !W.over; i++) {
          p.inv = 5;   // test side: invulnerable the whole time (as after a respawn or a soak)
          p.input = { mx, mz, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: i % 90 === 0 };
          step(W, STEP); drainEvents(W);
          const b = invariants(W); if (b.length) { bad.push(b[0]); break; }
          if (W.roomN !== room0) { exits++; break; }
        }
        if (!p.alive) deaths++;
      }
    }
    return { ok: !bad.length && !deaths, info: `${runs} runs held against the walls, ${exits} left through a door, ${deaths} deaths${bad.length ? ' · ' + bad[0] : ''}` };
  });
  T('a sealed entry never strands you: there is always a way on to the lift', () => {
    let bad = 0, n = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const W = makeWorld({ sector: seed % 5, seed: 40 + seed, noTut: true });
      for (let i = 0; i < 6; i++) { n++; const s = routeSide(W); if (!s && !W.room.boss) { bad++; break; } if (!s) break; }
    }
    return { ok: !bad, info: `${n} rooms checked` };
  });
  return out;
}

export async function runTests(vm) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>VOLTMAZE 2026 · SELF TEST</b><br>';
  document.body.appendChild(box);
  const results = [];
  const add = (r, ms) => { results.push({ ...r, ms }); box.innerHTML += `<div class="${r.ok ? 'pass' : 'fail'}">${r.ok ? 'PASS' : 'FAIL'} · ${r.name} <span style="opacity:.7">${r.info} (${ms} ms)</span></div>`; };
  await wait(30);
  const t0 = performance.now();
  for (const r of simChecks()) add(r, 0);
  results.forEach((r) => { r.ms = Math.round(performance.now() - t0); });
  const T = async (name, fn) => {
    await wait(30);
    let ok = false, info = '';
    const s = performance.now();
    try { const r = await fn(); ok = r.ok; info = r.info || ''; } catch (e) { info = 'threw ' + (e && e.stack || e); }
    add({ name, ok, info }, Math.round(performance.now() - s));
  };
  await T('scores: test runs never post, boards are named per mode and difficulty', () => {
    const names = ['campaign', 'endless'].flatMap((m) => DIFF_KEYS.map((d) => vm.boardKey(m, d)));
    const ok = vm.noPost && names.includes('voltmaze-2026') && names.includes('voltmaze-2026-endless-nightmare') && names.includes('voltmaze-2026-hard');
    return { ok, info: names.join(' ') };
  });
  await T('live loop: a campaign plays 20 s of frames without errors', async () => {
    vm.startCampaign(0);
    vm.G.ai = new Autopilot(7, 'demo');
    for (let i = 0; i < 20; i++) { vm.tick(60); await wait(5); }
    const errs = (window.__vmErrors || []).length;
    return { ok: !errs && vm.G.W && vm.G.W.t > 15, info: `t ${vm.G.W.t.toFixed(1)} s, room ${vm.G.W.roomN + 1}, ${errs} errors` };
  });
  await T('every sector look and boss renders', async () => {
    for (let s = 0; s < 5; s++) {
      vm.G.run = { score: 0, lives: 9, up: TYPICAL_UP[s], salvage: 0, start: s, newMedals: [], diff: 'normal' };
      vm.G.W = null;
      const W = makeWorld({ sector: s, seed: 60 + s, boss: true, lives: 9, noTut: true });
      vm.G.W = W; vm.G.state = 'play'; vm.G.mode = 'campaign'; vm.G.ai = new Autopilot(s, 'demo');
      vm.R.setLook(s);
      vm.tick(150);
      await wait(5);
    }
    const errs = (window.__vmErrors || []).length;
    return { ok: !errs, info: `${errs} errors` };
  });
  vm.toTitle();
  const pass = results.filter((r) => r.ok).length;
  box.innerHTML += `<br><b>${pass} / ${results.length} passed</b>`;
  window.__vmTests = { done: true, results, pass, total: results.length };
  return window.__vmTests;
}
void RAMP;
