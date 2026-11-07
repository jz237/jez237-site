// Difficulty ramp check: the HUMAN-LIKE autopilot (about 0.35 s reaction with scatter, sometimes late,
// keyboard-speed steering, tracks only nearby threats, does not always hold the trigger) plays each sector
// many times from its first web with 3 Rimrunners and the upgrades a player would typically own by then
// (TYPICAL_UP). Sectors run in parallel child processes.
//   node scripts/rimstorm/ramp_check.mjs [trials=100] [sectors=1,2,3,4,5] [profile=human] [difficulty=normal] [--seed=N] [--json]
// Per sector it prints the clear rate against the target, then per web try (W1..W4, BOSS):
//   deaths   Rimrunners lost per web try (the smooth death curve: no web noticeably harder than the next)
//   hits     deaths + shield plates broken per try (the "edge": steadier than the clear rate)
//   alive    average enemies alive on the web while it is fought (the screen must stay busy)
//   at rim   average riders on the rim at once
//   peak     average of each try's most enemies at once
//   threats  average enemies + bolts + lane strikes (live or telegraphed) at once
//   secs     average seconds a web try lasts
// then what killed it, and the WARNING check: for every hit the time from the threat's first visible tell
// (lancer charge, boss tell, lane-strike tell, a rider's crouch before it flips into the lane or the moment it
// entered the lane, an arc mite's crackle, a reflection) to the hit, which must never be shorter than the
// RAMP warning time of that web. Hits where the Rimrunner itself moved into a lane that already held the
// threat count as "walked in" and are listed apart.
// Targets: Normal about 85 / 65 / 45 / 30 / 18 % clears, Hard about 70 / 45 / 25 / 12 / 5 %, Easy 95 %+ in sector 1.
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { makeWorld, step, drainEvents, STEP, laneDist, laneOf } from '../../games/2026-11-06/rimstorm/js/sim.js?v=6';
import { Autopilot, PROFILES } from '../../games/2026-11-06/rimstorm/js/ai.js?v=6';
import * as CFG from '../../games/2026-11-06/rimstorm/js/config.js?v=6';
const { SECTORS, TYPICAL_UP, WEBS } = CFG;

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const pos = argv.filter((a) => !a.startsWith('--'));
const trials = +(pos[0] || 100);
const sectors = (pos[1] || '1,2,3,4,5').split(',').map((s) => +s - 1);
const profile = pos[2] || 'human';
const diff = pos[3] || 'normal';
const seed0 = +(flags.seed || 1000);
// Easy is the gentle start (sector 1 must clear 95 %+, the rest stays near-certain); Nightmare (two Rimrunners, everything at full tilt) is for experts
export const TARGETS = { normal: [85, 65, 45, 30, 18], hard: [70, 45, 25, 12, 5], easy: [98, 97, 96, 95, 92], nightmare: [25, 10, 3, 1, 0] };
const TARGET = TARGETS[diff] || TARGETS.normal;
// --set="RAMP.*.flip=*0.8;ENEMY.hopper.v=0.13;RAMP.2.hpS=1,2": experiment on the tables in this process only
// (a value starting with * multiplies, with + adds, a,b sets a pair; * in a path walks every key; [a, b] pairs change both ends)
function applySet(spec) {
  for (const item of String(spec).split(';').filter(Boolean)) {
    const [path, val] = item.split('=');
    const keys = path.split('.');
    if (/^[-0-9.]+(,[-0-9.]+)+$/.test(val)) { const arr = val.split(',').map(Number); const walk2 = (o, i) => { if (o == null) return; const k = keys[i], last = i === keys.length - 1; for (const kk of k === '*' ? Object.keys(o) : [k]) { if (last) o[kk] = arr.slice(); else walk2(o[kk], i + 1); } }; walk2(keys[0] === 'AI' ? { AI: PROFILES } : CFG, 0); continue; }
    const op = (v) => (Array.isArray(v) ? v.map(op) : val[0] === '*' ? v * +val.slice(1) : val[0] === '+' ? v + +val.slice(1) : Number.isFinite(+val) ? +val : val);
    const walk = (o, i) => {
      if (o == null) return;
      const k = keys[i], last = i === keys.length - 1;
      const ks = k === '*' ? Object.keys(o) : [k];
      for (const kk of ks) { if (last) o[kk] = op(o[kk]); else walk(o[kk], i + 1); }
    };
    walk(keys[0] === 'AI' ? { AI: PROFILES } : CFG, 0);
  }
}
if (flags.set) applySet(flags.set);
const LETHAL = new Set(['death', 'plate']);
// the screen must stay busy: least average enemies alive on each web (not the boss) per sector, on Normal
const BUSY = [2.5, 3.5, 4.5, 5, 5.5];
const TOL = +(flags.tol || 8);
const ZAPKINDS = new Set(['shock', 'sweep', 'flare', 'beam', 'lunge', 'pull']);

// one sector from its first web; returns per-web tallies
export function runSector(s, seed, prof = profile, opts = {}) {
  const W = makeWorld({ mode: 'campaign', sector: s, seed, up: TYPICAL_UP[s], diff, ...opts });
  const ai = new Autopilot(seed * 7919 + 13, prof);
  const webs = Array.from({ length: WEBS + 1 }, () => ({ tries: 0, deaths: 0, hits: 0, fightT: 0, alive: 0, rim: 0, threats: 0, peakSum: 0, peak: 0, causes: {} }));
  const leads = [];   // { cause, lead, warn, walked, web }
  // what the screen showed, for the warning leads
  const tellAt = {};        // `${lane}:${kind}` -> time of its last tell
  const chargeAt = {};      // lane -> time of the last lancer charge there
  const reflectAt = {};     // lane -> time of the last reflection there
  const crackleAt = {};     // mite id -> time it began to crackle
  const inLane = {};        // enemy id -> { lane, t } since when it is in (or crouching to flip into) that lane
  const boltSrc = {};       // bolt id -> time of its tell
  let pLane = -1, pLaneT = 0, lastWeb = -1, prevBolts = [], diveT0 = 0, phaseWas = '';
  const R = () => W.R;
  while (!W.over && W.t < 1500) {
    const P = W.players[0];
    P.input = ai.control(W, P);
    prevBolts = W.bolts.map((b) => ({ id: b.id, lane: b.lane, d: b.d, v: b.v, kind: b.kind }));
    step(W, STEP);
    const ev = drainEvents(W);
    const wi = Math.min(W.web, WEBS), wb = webs[wi];
    if (W.phase === 'fight' && phaseWas !== 'fight') { wb.tries++; if (lastWeb >= 0) { const o = webs[lastWeb]; o.peakSum += o.peak; } wb.peak = 0; lastWeb = wi; }
    if (W.phase === 'dive' && phaseWas !== 'dive') diveT0 = W.t;
    phaseWas = W.phase;
    if (P.alive && P.lane !== pLane) { pLane = P.lane; pLaneT = W.t; }
    if (!P.alive) pLane = -1;
    // telegraphs
    for (const e of ev) {
      if (e.k === 'tell') tellAt[`${e.lane}:${e.kind}`] = W.t;
      else if (e.k === 'charge') chargeAt[e.lane] = W.t;
      else if (e.k === 'reflect') reflectAt[e.lane] = W.t;
      else if (e.k === 'refract') reflectAt[e.to] = W.t;
      else if (e.k === 'crackle') crackleAt[e.id] = W.t;
    }
    for (const b of W.bolts) if (!(b.id in boltSrc)) boltSrc[b.id] = b.kind === 'lance' ? (chargeAt[b.lane] ?? W.t) : b.kind === 'reflect' ? (reflectAt[b.lane] ?? W.t) : (tellAt[`${b.lane}:volley`] ?? W.t);
    for (const e of W.enemies) {
      if (e.hp <= 0) continue;
      // since when it is in its lane; a rider crouching to flip into another lane counts from
      // the start of its crouch (the crouch and the lit target lane are the tell)
      const L = laneOf(W, e.lane);
      const q = inLane[e.id];
      if (!q || q.lane !== L) inLane[e.id] = { lane: L, t: q && q.pounce === L ? q.pt : W.t };
      if (e.fl && e.tell > 0) { const T = laneOf(W, e.fl.b); if (inLane[e.id].pounce !== T) { inLane[e.id].pounce = T; inLane[e.id].pt = W.t; } }
    }
    if (W.phase === 'fight') {
      wb.fightT += STEP;
      const n = W.enemies.filter((e) => e.hp > 0).length;
      wb.alive += n * STEP;
      wb.rim += W.enemies.filter((e) => e.hp > 0 && e.rim).length * STEP;
      wb.threats += (n + W.bolts.length + W.zaps.length) * STEP;
      if (n > wb.peak) wb.peak = n;
    }
    for (const e of ev) {
      if (!LETHAL.has(e.k)) continue;
      const cause = e.cause;
      wb.hits++;
      if (e.k === 'death') { wb.deaths++; wb.causes[cause] = (wb.causes[cause] || 0) + 1; }
      // how long the screen warned of this one
      let lead = null, walked = false;
      const L = e.lane;
      if (cause === 'bolt' || cause === 'reflect') {
        const b = prevBolts.find((x) => x.lane === L && x.d - x.v * STEP <= 1e-9);
        if (b) lead = W.t - (boltSrc[b.id] ?? W.t);
      } else if (ZAPKINDS.has(cause)) {
        // the live strike in that lane: its tell began z.T before it went live
        const zs = W.zaps.filter((z) => z.lane === L && z.t >= 0 && z.kind === cause);
        lead = zs.length ? Math.max(...zs.map((z) => z.t + z.T)) : W.t - (tellAt[`${L}:${cause}`] ?? W.t);
      } else if (cause === 'grab' || cause === 'arc') {
        // the rider that got it: the nearest one at the rim in the lane
        const id = e.src;
        const q = id != null ? inLane[id] : null;
        if (cause === 'arc' && id != null && crackleAt[id] != null) lead = W.t - crackleAt[id];
        else if (q) lead = W.t - q.t;
        const since = cause === 'arc' && id != null && crackleAt[id] != null ? crackleAt[id] : q ? q.t : W.t;
        if (pLaneT > since + 1e-6 || e.walk) walked = true;
        if (e.walk) walked = true;
      } else if (cause === 'spine') lead = W.t - diveT0;
      else if (cause === 'crush') lead = 9;
      leads.push({ cause, lead, warn: R().warn, walked, web: wi });
    }
  }
  if (lastWeb >= 0) webs[lastWeb].peakSum += webs[lastWeb].peak;
  return { clear: W.result === 'clear', secT: W.secT, deaths: W.stats.deaths, webs, leads, score: W.score };
}

function runMany(s, n) {
  const agg = { s, n, clears: 0, time: 0, deaths: 0, score: 0, webs: Array.from({ length: WEBS + 1 }, () => ({ tries: 0, deaths: 0, hits: 0, fightT: 0, alive: 0, rim: 0, threats: 0, peakSum: 0, causes: {} })), leads: [] };
  for (let i = 0; i < n; i++) {
    const r = runSector(s, seed0 + i * 17 + s * 7);
    if (r.clear) { agg.clears++; agg.time += r.secT; }
    agg.deaths += r.deaths; agg.score += r.score;
    r.webs.forEach((w, k) => { const a = agg.webs[k]; for (const f of ['tries', 'deaths', 'hits', 'fightT', 'alive', 'rim', 'threats', 'peakSum']) a[f] += w[f]; for (const [c, v] of Object.entries(w.causes)) a.causes[c] = (a.causes[c] || 0) + v; });
    agg.leads.push(...r.leads);
  }
  return agg;
}

const f2 = (x) => (Number.isFinite(x) ? x.toFixed(2) : ' -  ');
function report(a) {
  const pct = Math.round((100 * a.clears) / a.n), tg = TARGET[a.s];
  const lines = [];
  lines.push(`S${a.s + 1} ${SECTORS[a.s].name.padEnd(14)} clear ${String(pct).padStart(3)}% (target ~${tg}%, ${pct - tg >= 0 ? '+' : ''}${pct - tg})  avg clear ${a.clears ? Math.round(a.time / a.clears) : '-'} s  deaths/run ${(a.deaths / a.n).toFixed(2)}  score/run ${Math.round(a.score / a.n)}`);
  const col = (name, fn) => `   ${name.padEnd(8)}` + a.webs.map((w) => (w.tries ? fn(w) : ' -  ').toString().padStart(7)).join('');
  lines.push(`   ${''.padEnd(8)}` + a.webs.map((w, k) => (k < WEBS ? 'W' + (k + 1) : 'BOSS').padStart(7)).join(''));
  lines.push(col('deaths', (w) => f2(w.deaths / w.tries)));
  lines.push(col('hits', (w) => f2(w.hits / w.tries)));
  lines.push(col('alive', (w) => (w.alive / Math.max(1e-9, w.fightT)).toFixed(1)));
  lines.push(col('at rim', (w) => (w.rim / Math.max(1e-9, w.fightT)).toFixed(2)));
  lines.push(col('peak', (w) => (w.peakSum / w.tries).toFixed(1)));
  lines.push(col('threats', (w) => (w.threats / Math.max(1e-9, w.fightT)).toFixed(1)));
  lines.push(col('secs', (w) => (w.fightT / w.tries).toFixed(0)));
  const causes = {};
  for (const w of a.webs) for (const [c, v] of Object.entries(w.causes)) causes[c] = (causes[c] || 0) + v;
  if (flags.causes) lines.push(col('top', (w) => { const e = Object.entries(w.causes).sort((x, y) => y[1] - x[1])[0]; return e ? `${e[0].slice(0, 5)}${Math.round((100 * e[1]) / Math.max(1, w.deaths))}` : '-'; }));
  lines.push(`   killed by ${Object.entries(causes).sort((x, y) => y[1] - x[1]).map(([c, v]) => `${c} ${v}`).join(', ') || 'nothing'}`);
  // warnings
  const by = {};
  let short = 0, walked = 0;
  for (const q of a.leads) {
    if (q.walked) { walked++; continue; }
    if (q.lead == null) continue;
    (by[q.cause] = by[q.cause] || []).push(q);
    if (q.lead < q.warn - 0.02) short++;
  }
  const parts = Object.entries(by).map(([c, qs]) => { const ls = qs.map((q) => q.lead).sort((x, y) => x - y); const m = qs.reduce((mn, q) => Math.min(mn, q.lead - q.warn), 9); return `${c} min ${ls[0].toFixed(2)} med ${ls[ls.length >> 1].toFixed(2)} (min-warn ${m >= 0 ? '+' : ''}${m.toFixed(2)})`; });
  lines.push(`   warning lead (s): ${parts.join('; ') || '-'}  | walked in: ${walked}  | shorter than the RAMP warning: ${short}`);
  // busy: average enemies alive on each web (Normal only)
  const thin = diff === 'normal' ? a.webs.slice(0, WEBS).map((w, k) => [k, w.alive / Math.max(1e-9, w.fightT)]).filter(([, v]) => v < BUSY[a.s]) : [];
  lines.push(`   busy: ${thin.length ? 'THIN ' + thin.map(([k, v]) => `W${k + 1} ${v.toFixed(1)}`).join(', ') : 'ok'} (floor: ${BUSY[a.s]} enemies alive on average)`);
  return { text: lines.join('\n'), pct, short, thin: thin.length };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url).split('\\').join('/') === process.argv[1].split('\\').join('/');
if (isMain) {
  if (flags.child) {
    process.stdout.write(JSON.stringify(runMany(sectors[0], trials)));
  } else {
    const t0 = Date.now();
    // one child process per sector, all at once
    const jobs = sectors.map((s) => new Promise((res, rej) => {
      const ch = spawn(process.execPath, [fileURLToPath(import.meta.url), String(trials), String(s + 1), profile, diff, '--child', `--seed=${seed0}`, ...(flags.set ? [`--set=${flags.set}`] : [])], { stdio: ['ignore', 'pipe', 'inherit'] });
      let out = '';
      ch.stdout.on('data', (d) => (out += d));
      ch.on('close', (code) => (code ? rej(new Error(`sector ${s + 1} exited ${code}`)) : res(JSON.parse(out))));
    }));
    const res = await Promise.all(jobs);
    const rows = [];
    let short = 0, worst = 0, thin = 0;
    for (const a of res) { const r = report(a); rows.push(r.pct); short += r.short; thin += r.thin; worst = Math.max(worst, Math.abs(r.pct - TARGET[a.s])); if (!flags.json) console.log(r.text); }
    if (flags.json) console.log(JSON.stringify(res.map((a) => ({ s: a.s, pct: Math.round((100 * a.clears) / a.n), webs: a.webs.map((w) => ({ d: +(w.deaths / Math.max(1, w.tries)).toFixed(3), alive: +(w.alive / Math.max(1e-9, w.fightT)).toFixed(2) })) }))));
    console.log(`${profile} ${diff} x${trials}: ${rows.join(' / ')} %  (target ${sectors.map((s) => TARGET[s]).join(' / ')})  worst gap ${worst} pts, warnings shorter than RAMP: ${short}, thin webs: ${thin}  [${((Date.now() - t0) / 1000).toFixed(1)} s]`);
    // exit 1 when a sector misses its target by more than --tol points (default 8), a warning was short or a web was thin
    process.exitCode = worst > TOL || short || thin ? 1 : 0;
  }
}
