// ?test=1 self-test page: sim invariants, determinism, exact replays, the RAMP (monotonic, medium start,
// warnings 1.2 s -> 0.6 s, never under MIN_WARN), difficulty scaling, the autopilot getting through a boss,
// the live game loop running without console errors, no score posts, one board per mode + difficulty, 15 medals,
// a boss-kill replay and an online snapshot round trip.
import { makeWorld, step, drainEvents, STEP, cloneWorld } from './sim.js?v=13';
import { Autopilot } from './ai.js?v=13';
import { F, SECTORS, WAVES, TYPICAL_UP, rampAt, DIFF_KEYS, applyDiff, MIN_WARN, endlessLevel, rampLevel, MEDALS } from './config.js?v=13';
import { packWorld, applyWorld } from './online.js?v=13';
import { Recorder, Replay } from './replay.js?v=13';

export const hashW = (W) => JSON.stringify([W.n, W.score, W.lives, W.wave, W.phase, W.rs, W.players.map((p) => [p.x.toFixed(6), p.y.toFixed(6), p.alive, p.armor]), W.riders.map((r) => [r.id, r.x.toFixed(4), r.y.toFixed(4)]), W.cores.length, W.haz.length, W.boss && W.boss.hp]);
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

export async function runTests(lw) {
  const box = document.createElement('div');
  box.id = 'testlog';
  box.innerHTML = '<b>LANCEWING 2026 · SELF TEST</b><br>';
  document.body.appendChild(box);
  const results = [];
  const T = async (name, fn) => {
    await wait(30);
    let ok = false, info = '';
    const t0 = performance.now();
    try { const r = await fn(); ok = r.ok; info = r.info || ''; } catch (e) { ok = false; info = 'threw ' + (e && e.stack || e); }
    results.push({ name, ok, info, ms: Math.round(performance.now() - t0) });
    box.innerHTML += `<div class="${ok ? 'pass' : 'fail'}">${ok ? 'PASS' : 'FAIL'} · ${name} <span style="opacity:.7">${info} (${Math.round(performance.now() - t0)} ms)</span></div>`;
  };

  await T('deterministic: same seed + same inputs = same world', () => {
    const run = () => { const W = makeWorld({ sector: 2, seed: 4242, up: TYPICAL_UP[2] }); drive(W, new Autopilot(9, 'human'), 60 / STEP, new Recorder()); return hashW(W); };
    const a = run(), b = run();
    return { ok: a === b, info: a === b ? 'identical after 60 s' : 'worlds differ' };
  });
  await T('a cloned world carries on bit for bit', () => {
    const W = makeWorld({ sector: 4, seed: 77, up: TYPICAL_UP[4] }), ai = new Autopilot(3, 'demo');
    drive(W, ai, 20 / STEP);
    const C = cloneWorld(W), ins = [];
    drive(W, ai, 15 / STEP, null, (w) => { ins.push(w.players[0].input); });
    for (const i of ins) { if (C.over) break; C.players[0].input = i; step(C, STEP); drainEvents(C); }
    return { ok: hashW(C) === hashW(W), info: 'clone vs original after 15 s' };
  });
  await T('instant replay reproduces a death exactly', () => {
    for (let seed = 1; seed < 30; seed++) {
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
  await T('RAMP rises in small steps: medium start, warnings 1.2 s -> 0.6 s', () => {
    const pts = [];
    SECTORS.forEach((s, i) => { for (let k = 0; k < WAVES; k++) pts.push(rampAt(i, k)); });
    const issues = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      for (const k of ['spd', 'count', 'active', 'skill', 'aggr', 'cast']) if (b[k] < a[k] - 1e-9) issues.push(`${k} drops at ${i}`);
      for (const k of ['warn', 'gap', 'react', 'coreT']) if (b[k] > a[k] + 1e-9) issues.push(`${k} grows at ${i}`);
      if (b.spd - a.spd > 0.07) issues.push(`speed spike at ${i}`);
    }
    const w0 = pts[0].warn, w1 = pts[pts.length - 1].warn;
    if (Math.abs(w0 - 1.2) > 0.05) issues.push(`sector 1 warning ${w0}`);
    if (Math.abs(w1 - 0.6) > 0.05) issues.push(`final warning ${w1}`);
    if (pts[0].active < 2) issues.push('sector 1 starts with fewer than 2 riders at once');
    return { ok: !issues.length, info: issues.length ? issues.slice(0, 4).join('; ') : `warn ${w0.toFixed(2)} -> ${w1.toFixed(2)} s, active ${pts[0].active} -> ${pts[pts.length - 1].active}, riders/wave ${pts[0].count} -> ${pts[pts.length - 1].count}` };
  });
  await T('every difficulty scales the RAMP and never warns under MIN_WARN', () => {
    const issues = [];
    for (const d of DIFF_KEYS) for (let s = 0; s < 5; s++) for (let w = 0; w < WAVES; w++) { const r = applyDiff(rampAt(s, w), d); if (r.warn < MIN_WARN - 1e-9) issues.push(`${d} S${s + 1}W${w + 1}`); }
    const e = applyDiff(rampAt(0, 0), 'easy'), n = applyDiff(rampAt(0, 0), 'normal'), h = applyDiff(rampAt(4, 3), 'nightmare'), h0 = rampAt(4, 3);
    if (!(e.spd < n.spd && e.warn > n.warn && e.active <= n.active)) issues.push('easy is not gentler');
    if (!(h.spd > h0.spd && h.warn < h0.warn)) issues.push('nightmare is not harsher');
    for (let m = 0; m < 30; m += 3) { const a = endlessLevel(m * 60), b = endlessLevel((m + 3) * 60); if (b < a) issues.push('endless level drops'); }
    void rampLevel;
    return { ok: !issues.length, info: issues.length ? issues.slice(0, 4).join('; ') : `easy warn ${e.warn.toFixed(2)} s · nightmare S5 warn ${h.warn.toFixed(2)} s` };
  });
  await T('sim invariants hold in every sector (60 s each, autopilot)', () => {
    const issues = [];
    for (let s = 0; s < 5; s++) {
      const W = makeWorld({ sector: s, seed: 300 + s, up: TYPICAL_UP[s] });
      drive(W, new Autopilot(s + 5, 'demo'), 60 / STEP, null, (w) => {
        if (w.n % 30) return true;
        for (const b of [...w.players, ...w.riders]) {
          if (!Number.isFinite(b.x) || !Number.isFinite(b.y)) { issues.push(`S${s + 1} NaN`); return false; }
          if (b.x < 0 || b.x >= F.C) { issues.push(`S${s + 1} x out of the ring`); return false; }
          if (b.y > F.H + 0.01) { issues.push(`S${s + 1} above the ceiling`); return false; }
        }
        if (w.lives < 0) { issues.push('negative lives'); return false; }
        if (w.riders.length > 14) { issues.push(`S${s + 1} ${w.riders.length} riders at once`); return false; }
        return true;
      });
    }
    return { ok: !issues.length, info: issues.length ? issues.join('; ') : 'positions finite, inside the ring, lives sane' };
  });
  await T('the autopilot beats the sector 1 boss', () => {
    const W = makeWorld({ sector: 0, wave: WAVES, seed: 11, up: TYPICAL_UP[1], lives: 5 });
    drive(W, new Autopilot(11, 'demo'), 240 / STEP);
    return { ok: W.result === 'clear', info: `${W.result || 'still fighting'} after ${W.t.toFixed(0)} s` };
  });
  await T('scores are never posted from a test page', () => ({ ok: lw.noPost === true, info: lw.noPost ? 'NO_POST is on' : 'NO_POST is off!' }));
  await T('one global board per mode and difficulty', () => {
    const names = lw.boardNames();
    const good = names.length === 8 && new Set(names).size === 8 && names.every((n) => /^lancewing-2026(-endless)?(-easy|-hard|-nightmare)?$/.test(n));
    return { ok: good, info: names.join(' ') };
  });
  await T('15 medals with their own names', () => {
    const ok = MEDALS.length === 15 && new Set(MEDALS.map((m) => m.id)).size === 15 && new Set(MEDALS.map((m) => m.name)).size === 15 && SECTORS.every((s, i) => MEDALS.filter((m) => m.sector === i).length === 3);
    return { ok, info: `${MEDALS.length} medals, ${new Set(MEDALS.map((m) => m.name)).size} names` };
  });
  await T('instant replay reproduces a boss kill exactly', () => {
    for (let seed = 1; seed < 12; seed++) {
      const W = makeWorld({ sector: 0, wave: WAVES, seed, up: TYPICAL_UP[1] });
      const rec = new Recorder(), ai = new Autopilot(seed, 'demo');
      let keyN = -1, want = null, clip = null;
      drive(W, ai, 300 / STEP, rec, (w, ev) => {
        if (keyN < 0 && ev.some((e) => e.k === 'bossdown')) { keyN = w.n; want = hashW(w); }
        if (keyN > 0 && w.n >= keyN + Math.round(1.6 / STEP)) { clip = rec.clip(keyN); return false; }
        return true;
      });
      if (!clip) continue;
      const rp = new Replay(cloneWorld(clip.snap), clip.inputs, clip.keyN, clip.endN);
      let got = null;
      while (!rp.done) { const ev = rp.advance(STEP); if (ev.some((e) => e.k === 'bossdown') && rp.W.n === keyN) got = hashW(rp.W); }
      return { ok: got === want, info: `seed ${seed}, boss down at tick ${keyN}: ${got === want ? 'bit-exact' : 'differs'}` };
    }
    return { ok: false, info: 'no boss kill found' };
  });
  await T('online snapshot round trip (host -> guest)', () => {
    const H = makeWorld({ sector: 2, seed: 61, coop: true, up: TYPICAL_UP[2] }), Gw = makeWorld({ sector: 2, seed: 61, coop: true, up: TYPICAL_UP[2] });
    const ais = H.players.map((p, i) => new Autopilot(7 + i, 'demo'));
    for (let i = 0; i < 40 / STEP; i++) { H.players.forEach((p, k) => { p.input = ais[k].control(H, p); }); step(H, STEP); drainEvents(H); }
    Gw.net = 'guest'; Gw.players[0].remote = true;
    const S = JSON.parse(JSON.stringify(packWorld(H))), size = JSON.stringify({ type: 'snapshot', s: S }).length;
    applyWorld(Gw, S, 0);
    const pos = H.riders.every((r) => { const q = Gw.riders.find((x) => x.id === r.id); return q && Math.abs(q.x - r.x) < 0.01 && Math.abs(q.y - r.y) < 0.01; });
    const same = Gw.score === H.score && Gw.lives === H.lives && Gw.wave === H.wave && Gw.riders.length === H.riders.length && Math.abs(Gw.players[0].x - H.players[0].x) < 0.002;
    return { ok: pos && same && size < 48000, info: `${H.riders.length} riders, score ${Gw.score}, ${size} chars` };
  });
  await T('the live game loop runs a campaign without console errors', async () => {
    const before = (window.__lwErrors || []).length;
    lw.startCampaign(0);
    lw.tick(360);
    const W = lw.W;
    const err = (window.__lwErrors || []).slice(before);
    lw.toTitle();
    return { ok: !err.length && W && W.t > 4, info: err.length ? err[0] : `${W.t.toFixed(1)} s of play, ${W.riders.length} riders, wave ${W.wave + 1}` };
  });
  const ok = results.every((r) => r.ok);
  box.innerHTML += `<br><b class="${ok ? 'pass' : 'fail'}">${ok ? 'ALL PASS' : 'SOME TESTS FAILED'}</b>`;
  window.__lwTests = { done: true, ok, results };
}
