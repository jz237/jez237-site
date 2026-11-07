// Difficulty ramp check: the HUMAN-LIKE autopilot (about 0.35 s reaction with scatter, sometimes late, a
// limited stick swing, the odd missed beat, sees only the 4 nearest riders within 20 m) plays each sector many
// times from its first wave with the starting lives and the upgrades a player would typically own by then
// (TYPICAL_UP). One child process per sector and difficulty, all in parallel.
//   node scripts/lancewing/ramp_check.mjs [trials=100] [sectors=1,2,3,4,5] [profile=human] [difficulty=normal[,hard,...]] [--report]
// Prints per sector: the clear rate against the target, then per wave: tries, deaths and hits per try, the
// "edge" (riders unhorsed per hit taken), riders in the air on average / at most, the top causes of death.
// Also checks:
//   - every threat is telegraphed at least the RAMP warning time ahead (rider portals, hazards, boss attacks,
//     spire bolts, sea spouts, stormcaller arcs, crumbling ledges, the Stormhunter) and never under MIN_WARN
//   - the screen stays busy (riders in the air on average per normal wave)
//   - the per-wave death curve is smooth: no wave noticeably deadlier than the next checkpoint
// Exit code 1 when a clear rate is more than TOL (8) points off target, a warning is short, a wave is quiet or a
// spike is found (--report only prints). Targets: NORMAL 85 / 65 / 45 / 30 / 18 %, HARD 70 / 45 / 25 / 12 / 5 %, EASY 95+ in sector 1.
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { SIM, AI, CFG } from './_game.mjs';
const { makeWorld, step, drainEvents } = SIM;
const { Autopilot } = AI;
const { SECTORS, TYPICAL_UP, WAVES, WAVE_KIND, MIN_WARN, STEP, HUNTER } = CFG;

export const TARGETS = {
  easy: [97, 88, 75, 60, 45],
  normal: [85, 65, 45, 30, 18],
  hard: [70, 45, 25, 12, 5],
  nightmare: [30, 15, 8, 3, 1],
};
// which sectors each difficulty must hit within TOL (the rest are reported only); easy: sector 1 at 95 % or more
const STRICT = { normal: [0, 1, 2, 3, 4], hard: [0, 1, 2, 3, 4], easy: [], nightmare: [] };
const TOL = 8;

export function runSector(s, seed, prof = 'human', opts = {}) {
  const diff = opts.diff || 'normal';
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up: TYPICAL_UP[s], diff, ...opts });
  const ai = new Autopilot(seed * 7919 + 13, prof);
  const causes = {};
  const wv = {};   // per wave: kills, causes, riders-in-the-air samples
  const warn = { short: [], min: {} };
  const seenH = new Set(), seenP = new Set();
  let lastAtk = null, first = null, sample = 0;
  const W_ = (k) => (wv[k] ||= { kills: 0, causes: {}, aliveSum: 0, aliveN: 0, aliveMax: 0 });
  const note = (what, lead, need) => {
    const r = lead / need;
    if (!(warn.min[what] <= r)) warn.min[what] = r;
    if (lead < need - 0.02 || lead < MIN_WARN - 0.02) warn.short.push(`${what} ${lead.toFixed(2)}s < ${need.toFixed(2)}s (S${s + 1} W${W.wave + 1})`);
  };
  const w0 = W.wave;
  while (!W.over && W.n < 1500 / STEP && !(opts.one && W.wave !== w0)) {
    const P = W.players[0];
    P.input = ai.control(W, P);
    step(W, STEP);
    const need = W.R.warn, wk = W.wave;
    for (const e of drainEvents(W)) {
      if (e.k === 'death') { const c = e.cause + (e.by ? ':' + e.by : ''); causes[c] = (causes[c] || 0) + 1; W_(wk).causes[c] = (W_(wk).causes[c] || 0) + 1; if (first === null) first = W.t; }
      else if (e.k === 'unhorse' && e.pid) W_(wk).kills++;
      else if (e.k === 'hunterwarn') note('stormhunter', HUNTER.warn, need);
      else if (e.k === 'crack') note('crumble', e.T, need);
    }
    // telegraphs: each new hazard / portal / boss attack once, at the tick it appeared (it has run one tick already)
    for (const h of W.haz) {
      if (seenH.has(h.id)) continue;
      seenH.add(h.id);
      if (h.k === 'drop') continue;   // falling drops share their attack's telegraph (checked below)
      note(h.src === 'boss' ? 'boss ' + h.k : h.k, h.T - h.t + STEP, need);
    }
    for (const p of W.portals) {
      if (seenP.has(p.id)) continue;
      seenP.add(p.id);
      // a boss summon is told by the attack (its own telegraph) and then the portal
      note(p.ledge < 0 ? 'boss summon' : 'portal', p.T - p.t + STEP + (p.ledge < 0 && lastAtk && lastAtk.kind === 'summon' ? lastAtk.T : 0), need);
    }
    const B = W.boss;
    if (B && B.cur && B.cur !== lastAtk) { lastAtk = B.cur; if (B.cur.kind !== 'summon') note('boss ' + B.cur.kind, B.cur.T - B.cur.t + STEP, need); }
    if (W.phase === 'fight' && ++sample % 60 === 0) {
      const w = W_(wk), n = W.riders.length;
      w.aliveSum += n; w.aliveN++; if (n > w.aliveMax) w.aliveMax = n;
    }
  }
  return { clear: opts.one ? W.result === 'clear' || W.wave !== w0 : W.result === 'clear', W, causes, first, wv, warn };
}

// tuning aid: LW_PATCH='{"RAMP":{"0":{"active":[3,3]}},"SPECIAL":{"surviveT":[24,30]}}' deep-merges into config.js's
// exports for this run only (nothing is written), so several variants can be measured side by side
export function applyPatch(json) {
  if (!json) return;
  const merge = (dst, src) => { for (const [k, v] of Object.entries(src)) { if (v && typeof v === 'object' && !Array.isArray(v) && dst[k] && typeof dst[k] === 'object') merge(dst[k], v); else dst[k] = v; } };
  for (const [name, v] of Object.entries(JSON.parse(json))) merge(CFG[name], v);
}

// ---------------------------------------------------------------- one sector x difficulty (a child process)
function runBatch(s, trials, prof, diff, opts = {}) {
  applyPatch(process.env.LW_PATCH);
  const out = { s, diff, trials, clears: 0, time: 0, deaths: 0, wT: {}, wD: {}, wH: {}, wK: {}, wC: {}, aliveSum: {}, aliveN: {}, aliveMax: {}, short: [], warnMin: {}, causes: {}, lives: [] };
  const add = (o, src) => { for (const [k, v] of Object.entries(src)) o[k] = (o[k] || 0) + v; };
  for (let i = 0; i < trials; i++) {
    const r = runSector(s, 1000 + i * 17 + s * 7, prof, { diff, ...opts });
    if (r.clear) { out.clears++; out.time += r.W.secT; out.lives.push(r.W.lives); }
    out.deaths += r.W.stats.deaths;
    add(out.wT, r.W.stats.waveTries); add(out.wD, r.W.stats.waveDeaths); add(out.wH, r.W.stats.waveHits); add(out.causes, r.causes);
    for (const [k, w] of Object.entries(r.wv)) {
      out.wK[k] = (out.wK[k] || 0) + w.kills;
      out.wC[k] ||= {}; add(out.wC[k], w.causes);
      out.aliveSum[k] = (out.aliveSum[k] || 0) + w.aliveSum; out.aliveN[k] = (out.aliveN[k] || 0) + w.aliveN;
      out.aliveMax[k] = Math.max(out.aliveMax[k] || 0, w.aliveMax);
    }
    out.short.push(...r.warn.short.slice(0, 3));
    for (const [k, v] of Object.entries(r.warn.min)) if (!(out.warnMin[k] <= v)) out.warnMin[k] = v;
  }
  // every checkpoint on its own, flown from a fresh start there (full lives, as CONTINUE FROM CHECKPOINT gives):
  // deaths per try here are not cut short by lives already lost earlier in the sector
  out.fresh = {};
  if (!opts.wave && !process.env.LW_NOFRESH) for (let w = 0; w <= WAVES; w++) {
    const f = { tries: 0, deaths: 0, clears: 0, time: 0 };
    for (let i = 0; i < trials; i++) {
      const r = runSector(s, 5000 + i * 31 + s * 7 + w * 3, prof, { diff, wave: w, one: true });
      f.tries++; f.deaths += r.W.stats.deaths; if (r.clear) { f.clears++; f.time += r.W.secT; }
      out.short.push(...r.warn.short.slice(0, 2));
    }
    out.fresh[w] = f;
  }
  out.short = [...new Set(out.short)].slice(0, 8);
  return out;
}

const kindOf = (s, w) => (w === WAVES ? 'boss' : WAVE_KIND[s][w]);
export function report(rs, prof) {
  const fail = [];
  const byDiff = {};
  for (const r of rs) (byDiff[r.diff] ||= []).push(r);
  for (const [diff, list] of Object.entries(byDiff)) {
    list.sort((a, b) => a.s - b.s);
    const T = TARGETS[diff] || TARGETS.normal;
    console.log(`\n=== ${diff.toUpperCase()} · ${prof} autopilot · ${list[0].trials} trials per sector ===`);
    const curve = [];
    for (const r of list) {
      const pct = Math.round((100 * r.clears) / r.trials);
      const easy1 = diff === 'easy' && r.s === 0;
      const strict = (STRICT[diff] || []).includes(r.s) || easy1;
      const okC = easy1 ? pct >= 95 : Math.abs(pct - T[r.s]) <= TOL;
      if (strict && !okC) fail.push(`${diff} S${r.s + 1} clear ${pct}% (target ${easy1 ? '95+' : T[r.s]})`);
      const ll = r.lives.length ? (r.lives.reduce((a, b) => a + b, 0) / r.lives.length).toFixed(1) : '-';
      console.log(`S${r.s + 1} ${SECTORS[r.s].name.padEnd(16)} clear ${String(pct).padStart(3)}% (target ${easy1 ? '95+' : T[r.s]}${strict ? (okC ? ' OK' : ' OFF') : ''}) · ${r.clears ? (r.time / r.clears).toFixed(0) : '-'} s per clear · deaths/run ${(r.deaths / r.trials).toFixed(2)} · lives left on a clear ${ll}`);
      console.log('    wave  kind       tries  deaths  hits   edge  riders avg/max  fresh: deaths  clear  secs   top causes of death');
      for (let w = 0; w <= WAVES; w++) {
        const t = r.wT[w] || 0;
        if (!t) continue;
        const d = (r.wD[w] || 0) / t, h = (r.wH[w] || 0) / t, k = (r.wK[w] || 0) / t;
        const alive = r.aliveN[w] ? r.aliveSum[w] / r.aliveN[w] : 0;
        const top = Object.entries(r.wC[w] || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, n]) => `${c} ${n}`).join(', ');
        const kind = kindOf(r.s, w);
        const F = r.fresh && r.fresh[w], fd = F ? F.deaths / F.tries : d;
        const fr = F ? `${fd.toFixed(2).padStart(13)}  ${String(Math.round((100 * F.clears) / F.tries)).padStart(4)}%  ${F.clears ? (F.time / F.clears).toFixed(0).padStart(4) : '   -'}` : ''.padStart(26);
        console.log(`    ${(w === WAVES ? 'B' : 'W' + (w + 1)).padEnd(5)} ${kind.padEnd(10)} ${String(t).padStart(5)}  ${d.toFixed(2).padStart(6)}  ${h.toFixed(2).padStart(5)}  ${(h ? k / h : k).toFixed(1).padStart(5)}  ${alive.toFixed(1).padStart(5)} / ${String(r.aliveMax[w] || 0).padEnd(2)}  ${fr}   ${top}`);
        curve.push({ name: `S${r.s + 1} ${w === WAVES ? 'B' : 'W' + (w + 1)}`, kind, d: fd, s: r.s });
      }
      const wm = Object.entries(r.warnMin).sort((a, b) => a[1] - b[1]).slice(0, 4).map(([k, v]) => `${k} x${v.toFixed(2)}`).join(', ');
      console.log(`    telegraphs (shortest lead / RAMP warn): ${wm || '-'}${r.short.length ? ' · SHORT: ' + r.short.join(' | ') : ' · all at least the warning time'}`);
      if (r.short.length) fail.push(`${diff} S${r.s + 1} short telegraph: ${r.short[0]}`);
      for (let w = 0; w < WAVES; w++) {
        const kind = kindOf(r.s, w), alive = r.aliveN[w] ? r.aliveSum[w] / r.aliveN[w] : 0;
        if (diff !== 'easy' && kind !== 'corerush' && alive < 1.6) fail.push(`${diff} S${r.s + 1} W${w + 1} quiet: ${alive.toFixed(1)} riders in the air on average`);
      }
    }
    // smooth: each checkpoint against the next one that is not a bonus (core rush) wave
    const c = curve.filter((q) => q.kind !== 'corerush');
    const spikes = [];
    for (let i = 0; i + 1 < c.length; i++) {
      const a = c[i], b = c[i + 1];
      if (a.d - b.d > Math.max(0.3, 0.4 * b.d)) spikes.push(`${a.name} ${a.d.toFixed(2)} > ${b.name} ${b.d.toFixed(2)}`);
    }
    console.log(`  death curve (deaths per try from a fresh checkpoint start, bonus waves left out): ${c.map((q) => `${q.name} ${q.d.toFixed(2)}`).join(' · ')}`);
    console.log(`  spikes (a checkpoint noticeably deadlier than the next): ${spikes.length ? spikes.join(' | ') : 'none'}`);
    if ((diff === 'normal' || diff === 'hard') && spikes.length) fail.push(...spikes.map((x) => `${diff} spike ${x}`));
    console.log(`  ${diff.toUpperCase()} clear rates: ${list.map((r) => Math.round((100 * r.clears) / r.trials)).join(' / ')} % (target ${list.map((r) => T[r.s]).join(' / ')})`);
  }
  return fail;
}

if (process.env.LW_RAMP_CHILD) {
  process.on('message', (m) => { process.send(runBatch(m.s, m.trials, m.prof, m.diff, m.opts), () => process.exit(0)); });
} else if (process.argv[1] && process.argv[1].split('\\').join('/').endsWith('ramp_check.mjs')) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const trials = +(args[0] || 100);
  const sectors = (args[1] || '1,2,3,4,5').split(',').map((s) => +s - 1);
  const prof = args[2] || 'human';
  const diffs = (args[3] || 'normal').split(',');
  const reportOnly = process.argv.includes('--report');
  const t0 = Date.now();
  const jobs = [];
  for (const diff of diffs) for (const s of sectors) jobs.push({ s, trials, prof, diff });
  const results = await Promise.all(jobs.map((j) => new Promise((res, rej) => {
    const c = fork(fileURLToPath(import.meta.url), [], { env: { ...process.env, LW_RAMP_CHILD: '1' } });
    let got = null;
    c.on('message', (m) => { got = m; res(m); });
    c.on('error', rej);
    c.on('exit', (code) => { if (!got) rej(new Error(`child S${j.s + 1} ${j.diff} exit ${code}`)); });
    c.send(j);
  })));
  const fail = report(results, prof);
  console.log(`\n${jobs.length} runs x ${trials} trials in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  if (fail.length) { console.log(`RAMP ${reportOnly ? 'NOTES' : 'FAIL'}:\n  ` + fail.join('\n  ')); if (!reportOnly) process.exitCode = 1; }
  else console.log('RAMP PASS');
}
