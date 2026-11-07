// ?test=1 self-test page: determinism, exact clones and replays, the RAMP (monotonic, medium start on
// Normal, warnings shrinking to ~0.6 s, never below MIN_WARN on any level), sim invariants while the
// autopilot plays, every boss beatable, the live game loop running without console errors, and no score
// posts. Results land in window.__rsTests for the console check.
import { makeWorld, step, drainEvents, STEP, cloneWorld } from './sim.js?v=5';
import { Autopilot } from './ai.js?v=5';
import { RAMP, SECTORS, WEBS, TYPICAL_UP, rampAt, endlessLevel, DIFF_KEYS, applyDiff, MIN_WARN, BOSSES } from './config.js?v=5';
import { Recorder, Replay } from './replay.js?v=5';

export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.web, W.webN, W.phase, W.rs, W.players.map((p) => [p.pos.toFixed(6), p.d.toFixed(6), p.alive, p.plate, p.purges]), W.enemies.map((e) => [e.id, e.type, e.lane.toFixed(4), e.d.toFixed(4), e.hp]), W.bolts.length, W.zaps.length, W.spine.map((x) => x.toFixed(3)).join(','), W.boss ? [W.boss.hp, W.boss.d.toFixed(4)] : 0]);
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
export function invariants(W) {
  const bad = [];
  const num = (v) => typeof v === 'number' && Number.isFinite(v);
  for (const e of W.enemies) {
    if (!num(e.lane) || !num(e.d)) bad.push('NaN enemy');
    if (e.d < -0.001 || e.d > 1.05) bad.push('depth ' + e.type + ' ' + e.d);
    if (W.closed ? e.lane < -0.001 || e.lane >= W.nl + 0.001 : e.lane < -0.501 || e.lane > W.nl - 0.499) bad.push('lane ' + e.type + ' ' + e.lane);
  }
  for (const p of W.players) if (!num(p.pos) || p.lane < 0 || p.lane >= W.nl) bad.push('player');
  if (W.spine.length !== W.nl) bad.push('spines');
  return bad;
}

export async function runTests(rs) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>RIMSTORM 2026 · SELF TEST</b><br>';
  document.body.appendChild(box);
  const results = [];
  window.__rsTests = { done: false, results, pass: 0, total: 0 };
  const T = async (name, fn) => {
    await wait(30);
    let ok = false, info = '';
    const t0 = performance.now();
    try { const r = await fn(); ok = r.ok; info = r.info || ''; } catch (e) { ok = false; info = 'threw ' + (e && e.stack || e); }
    results.push({ name, ok, info, ms: Math.round(performance.now() - t0) });
    box.innerHTML += `<div class="${ok ? 'pass' : 'fail'}">${ok ? 'PASS' : 'FAIL'} · ${name} <span style="opacity:.7">${info} (${Math.round(performance.now() - t0)} ms)</span></div>`;
  };

  await T('deterministic: same seed + same inputs = same world', () => {
    const run = () => { const W = makeWorld({ sector: 2, seed: 4242, up: TYPICAL_UP[2] }); drive(W, new Autopilot(9, 'human'), 90 / STEP, new Recorder()); return hashW(W); };
    const a = run(), b = run();
    return { ok: a === b, info: a === b ? 'identical after 90 s' : 'worlds differ' };
  });

  await T('a cloned world runs on exactly like the original', () => {
    const W = makeWorld({ sector: 3, seed: 77, up: TYPICAL_UP[3] });
    const ai = new Autopilot(3, 'demo');
    drive(W, ai, 20 / STEP);
    const C = cloneWorld(W);
    const ins = [];
    for (let i = 0; i < 20 / STEP; i++) { W.players[0].input = ai.control(W, W.players[0]); ins.push({ ...W.players[0].input }); step(W, STEP); drainEvents(W); }
    for (const q of ins) { C.players[0].input = q; step(C, STEP); drainEvents(C); }
    return { ok: hashW(W) === hashW(C), info: 'clone + 20 s of the same inputs' };
  });

  await T('instant replay reproduces a death exactly', () => {
    for (let seed = 1; seed < 40; seed++) {
      const W = makeWorld({ sector: 4, seed, up: TYPICAL_UP[4] });
      const rec = new Recorder(), ai = new Autopilot(seed, 'human');
      let keyN = -1, want = null, clip = null;
      drive(W, ai, 400 / STEP, rec, (w, ev) => {
        if (keyN < 0 && ev.some((e) => e.k === 'death')) { keyN = w.n; want = hashW(w); }
        if (keyN > 0 && w.n >= keyN + Math.round(1.6 / STEP)) { clip = rec.clip(keyN); return false; }
        return true;
      });
      if (!clip) continue;
      const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
      let got = null, saw = false;
      while (!rp.done) { const ev = rp.advance(STEP); if (ev.some((e) => e.k === 'death') && rp.W.n === keyN) { saw = true; got = hashW(rp.W); } }
      return { ok: saw && got === want, info: `seed ${seed}, death at tick ${keyN}: ${saw ? (got === want ? 'bit-exact' : 'state differs') : 'no death in replay'}` };
    }
    return { ok: false, info: 'no death found to replay' };
  });

  await T('RAMP: rises in small steps, medium start, warnings 1.2 s -> 0.6 s', () => {
    const issues = [];
    let prev = null;
    for (let s = 0; s < RAMP.length; s++) for (let w = 0; w < WEBS; w++) {
      const r = rampAt(s, w);
      if (prev) {
        if (r.warn > prev.warn + 1e-9) issues.push(`warn rises at S${s + 1}W${w + 1}`);
        if (r.spd < prev.spd - 1e-9) issues.push(`spd drops at S${s + 1}W${w + 1}`);
        if (r.count < prev.count) issues.push(`count drops at S${s + 1}W${w + 1}`);
        if (r.active < prev.active) issues.push(`active drops at S${s + 1}W${w + 1}`);
        if (r.grab > prev.grab + 1e-9) issues.push(`grab rises at S${s + 1}W${w + 1}`);
        if (r.spd - prev.spd > 0.1) issues.push(`speed spike at S${s + 1}W${w + 1}`);
        if (r.hpS < prev.hpS - 1e-9 || r.hpB < prev.hpB - 1e-9) issues.push(`toughness drops at S${s + 1}W${w + 1}`);
        if (r.flip > prev.flip + 1e-9) issues.push(`riders slow down at S${s + 1}W${w + 1}`);
      }
      prev = r;
    }
    const w0 = rampAt(0, 0).warn, w5 = rampAt(4, WEBS - 1).warn, a0 = rampAt(0, 0).active;
    if (Math.abs(w0 - 1.2) > 0.06) issues.push('S1 warn ' + w0);
    if (Math.abs(w5 - 0.6) > 0.06) issues.push('S5 warn ' + w5);
    if (a0 < 2 || a0 > 4) issues.push('S1 active ' + a0);
    for (const d of DIFF_KEYS) for (let s = 0; s < 5; s++) for (let w = 0; w < WEBS; w++) if (applyDiff(rampAt(s, w), d).warn < MIN_WARN - 1e-9) issues.push(`${d} warn below MIN_WARN`);
    if (endlessLevel(0) > 0.5 || endlessLevel(20 * 60) < 4.9) issues.push('endless curve');
    return { ok: !issues.length, info: issues.length ? issues.slice(0, 4).join('; ') : `S1 warn ${w0.toFixed(2)} s, S5 ${w5.toFixed(2)} s, S1 ${a0} at once` };
  });

  await T('sim invariants hold while the autopilot plays every sector', () => {
    const bad = [];
    for (let s = 0; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 50 + s, up: TYPICAL_UP[s], lives: 9 });
      drive(W, new Autopilot(s + 1, 'demo'), 120 / STEP, null, (w) => { if (w.n % 30 === 0) for (const b of invariants(w)) if (bad.length < 5) bad.push(`S${s + 1}: ${b}`); return true; });
    }
    return { ok: !bad.length, info: bad.length ? bad.join('; ') : '5 sectors x 120 s' };
  });

  await T('every boss can be beaten', () => {
    const out = [];
    let ok = true;
    for (let s = 0; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 300 + s, up: TYPICAL_UP[s], lives: 9, web: WEBS });
      let down = false;
      drive(W, new Autopilot(s + 7, 'demo'), 300 / STEP, null, (w, ev) => { if (ev.some((e) => e.k === 'bosskill')) down = true; return true; });
      out.push(`${BOSSES[SECTORS[s].boss].name.split(' ').pop()} ${down ? Math.round(W.stats.bossT) + ' s' : 'ALIVE'}`);
      if (!down) ok = false;
    }
    return { ok, info: out.join(', ') };
  });

  await T('no score posts from test pages', () => ({ ok: rs.noPost === true, info: rs.noPost ? 'NO_POST is on' : 'NO_POST is off!' }));

  await T('the live game loop runs a campaign without errors', async () => {
    const errs0 = (window.__rsErrors || []).length;
    rs.startCampaign(0);
    for (let i = 0; i < 30; i++) { rs.tick(20); await wait(5); }
    const W = rs.W;
    rs.toTitle();
    const errs = (window.__rsErrors || []).slice(errs0);
    return { ok: !errs.length && W.t > 9, info: `${W.t.toFixed(1)} s played, ${errs.length} errors${errs.length ? ': ' + errs[0] : ''}` };
  });

  const pass = results.filter((r) => r.ok).length;
  box.innerHTML += `<br><b>${pass} / ${results.length} passed</b>`;
  Object.assign(window.__rsTests, { done: true, pass, total: results.length });
}
