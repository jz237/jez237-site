// Difficulty ramp, measured. The human-like autopilot (0.35 s reaction with scatter, sometimes late,
// limited aim/turn swing, tracks only the ~7 nearest threats, misses things behind it) plays each sector
// from its arrival lift with the typical upgrades (TYPICAL_UP) and the normal lives, many seeds, in
// parallel worker threads. Prints per sector: clear rate (the target), boss reached, and per wave (room
// on the route, BOSS = the lift room): death chance per try (a try = entering the room or respawning at
// its checkpoint), hits taken per try (deaths + plate/overshield soaks = the edge ratio), robots alive on
// average (is the screen busy?), robots aiming at once, seconds per try, and what killed it. Also checks
// that every threat had a visible warning at least the RAMP's warn time ahead (aim glints before every
// robot bolt, ripper crouches before every lunge, mortar landing rings, boss tells before every boss
// bolt / zone / beam / charge, the Seeker's warning) and flags a wave that is noticeably harder than the
// next one (a spike in the death curve).
//   node scripts/voltmaze/ramp_check.mjs [trials=100] [sectors=1-5|3|1,4] [profile=human] [difficulty=normal]
// env: VM_J=12 worker threads · VM_OVR='{"RAMP":{"0":{"fire":[0.5,0.6]}},"ATTACK":{...},"ENEMY":{...},
//      "BOSSES":{...},"DIFFICULTY":{...},"F":{...}}' (try values without editing config.js) ·
//      VM_JSON=path (write the numbers) · VM_TARGET=85,65,45,30,18 (the clear-rate targets to compare to)
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { writeFileSync } from 'node:fs';
import * as C from '../../games/2026-11-06/voltmaze/js/config.js?v=8';
import { makeWorld, step, drainEvents, STEP } from '../../games/2026-11-06/voltmaze/js/sim.js?v=8';
import { Autopilot } from '../../games/2026-11-06/voltmaze/js/ai.js?v=8';

const { TYPICAL_UP, SECTORS, RAMP } = C;
export const TARGETS = {
  normal: [85, 65, 45, 30, 18], hard: [70, 45, 25, 12, 5], easy: [95, 90, 80, 60, 30], nightmare: [35, 15, 5, 1, 0],
};
const MAX_T = 900, BAND = +(process.env.VM_BAND || 6), BUSY = 3;   // a room is 'quiet' when fewer than BUSY robots are alive on average

// merge test overrides into the live config tables (arrays replace, objects merge)
function applyOvr(ovr) {
  const merge = (dst, src) => { for (const k in src) { const v = src[k]; if (v && typeof v === 'object' && !Array.isArray(v) && dst[k] && typeof dst[k] === 'object' && !Array.isArray(dst[k])) merge(dst[k], v); else dst[k] = v; } };
  for (const t in ovr) { const dst = C[t]; if (!dst) throw new Error('no config table ' + t); merge(dst, ovr[t]); }
}

function runTrial(s, k, profile, diff) {
  const seed = 1000 + k * 37 + s * 7919;
  const bossOnly = !!process.env.VM_BOSS;
  const endless = !!process.env.VM_ENDLESS;
  const W = endless ? makeWorld({ mode: 'endless', seed, diff, noTut: true, noGrace: true })
    : makeWorld({ sector: s, seed, up: TYPICAL_UP[s], diff, noTut: true, noGrace: diff !== 'easy', ...(bossOnly ? { boss: true, lives: 30 } : {}) });
  const ai = new Autopilot(seed, profile);
  const tries = [];
  let cur = null, boss = false, bossKill = false;
  const open = (n, isBoss) => { cur = { n, boss: isBoss ? 1 : 0, died: 0, hits: 0, t: 0, alive: 0, active: 0, aiming: 0, bolts: 0, cause: null, firstFire: -1, fired: 0, phase: 0 }; tries.push(cur); };
  const aimAt = new Map();
  const warn = { n: 0, bad: 0, min: 1e9, worst: null, kinds: {} };
  const note = (kind, lead, need) => {
    warn.n++;
    const w = warn.kinds[kind] || (warn.kinds[kind] = { n: 0, min: 1e9 });
    w.n++; if (lead < w.min) w.min = lead;
    if (lead / need < warn.min) warn.min = lead / need;
    if (lead < need - STEP * 1.5) { warn.bad++; if (!warn.worst || lead - need < warn.worst.d) warn.worst = { kind, lead, need, d: lead - need, room: W.roomN }; }
  };
  let seenBolt = 0, seenZone = 0, seekWarnN = -1;
  for (let i = 0; i < MAX_T / STEP && !W.over && !(bossOnly && bossKill); i++) {
    W.players[0].input = ai.control(W, W.players[0]);
    step(W, STEP);
    const need = W.R ? W.R.warn : 0;
    for (const e of drainEvents(W)) {
      switch (e.k) {
        case 'roomenter': open(endless ? (e.boss ? 1000 + W.floor : Math.floor((W.depth - 1) / BAND) * BAND) : e.n, e.boss && !endless); seekWarnN = -1; aimAt.clear(); if (e.boss) boss = true; break;
        case 'respawn': if (cur) open(cur.n, cur.boss); seekWarnN = -1; aimAt.clear(); break;
        case 'death': if (cur) { cur.died = 1; cur.hits++; cur.cause = e.cause === 'bolt' && e.from === -1 ? 'boss bolt' : e.cause; cur.phase = W.boss ? W.boss.phase : 0; } break;
        case 'plate': case 'shield': if (cur && !e.grace) cur.hits++; break;
        case 'bossdown': bossKill = true; break;
        case 'aim': case 'crouch': aimAt.set(e.id, W.n); note(e.k === 'aim' ? 'aim glint' : 'ripper crouch', e.T, need); break;
        case 'lunge': { const a = aimAt.get(e.id); note('lunge after crouch', a !== undefined ? (W.n - a) * STEP : 0, need); aimAt.delete(e.id); break; }
        case 'rfire': { const a = aimAt.get(e.id); note('bolt after glint', a !== undefined ? (W.n - a) * STEP : 0, need); aimAt.delete(e.id); if (cur) { cur.fired++; if (cur.firstFire < 0) cur.firstFire = cur.t; } break; }
        case 'mortar': note('mortar ring', e.T, need); aimAt.delete(e.id); if (cur) cur.fired++; break;
        case 'bossatk': note('boss tell ' + e.kind, e.T, need); break;
        case 'seekerwarn': seekWarnN = W.n; break;
        case 'seeker': note('seeker warning', seekWarnN < 0 ? 0 : (W.n - seekWarnN) * STEP + C.SEEKER.inT, need); break;
        default: break;
      }
    }
    // every boss bolt leaves during an attack whose tell has run; every deadly zone goes live after its tell
    for (const b of W.bolts) if (b.id > seenBolt && b.from === -1) { const Cc = W.boss && W.boss.cur; note('boss bolt', Cc ? Cc.t : 0, need); }
    for (const b of W.bolts) if (b.id > seenBolt) seenBolt = b.id;
    for (const z of W.zones) if (z.id > seenZone) { if (z.deadly) note('zone ' + z.style, z.T - z.t + STEP, need); seenZone = z.id; }
    if (cur && W.phase === 'play' && W.players[0].alive) {
      cur.t += STEP;
      let al = 0, ac = 0, am = 0;
      for (const e of W.robots) { if (e.hp <= 0 || e.type === 'drone') continue; al++; if (e.boot <= 0) ac++; if (e.aimT > 0) am++; }
      cur.alive += al * STEP; cur.active += ac * STEP; cur.aiming += am * STEP; cur.bolts += W.bolts.length * STEP;
    }
  }
  return { depth: W.depth, floor: W.floor, score: W.score, clear: W.result === 'clear', boss, bossKill, t: W.t, deaths: W.stats.deaths, tries, warn, kills: W.stats.kills, lured: W.stats.lured, killedBy: W.stats.killedBy, lives: W.lives, cleared: W.stats.cleared, rooms: W.stats.rooms, skipped: W.stats.skipped };
}

if (!isMainThread) {
  const { s, k0, k1, profile, diff, ovr } = workerData;
  if (ovr) applyOvr(ovr);
  const out = [];
  for (let k = k0; k < k1; k++) out.push(runTrial(s, k, profile, diff));
  parentPort.postMessage(out);
} else {
  const trials = +(process.argv[2] || 100), which = process.argv[3] || '1-5', profile = process.argv[4] || 'human', diff = process.argv[5] || 'normal';
  const list = which.includes('-') ? (() => { const [a, b] = which.split('-').map(Number); return Array.from({ length: b - a + 1 }, (_, i) => a + i - 1); })() : which.split(',').map((x) => +x - 1);
  const J = +(process.env.VM_J || 12);
  const ovr = process.env.VM_OVR ? JSON.parse(process.env.VM_OVR) : null;
  if (ovr) applyOvr(ovr);
  const target = process.env.VM_TARGET ? process.env.VM_TARGET.split(',').map(Number) : TARGETS[diff] || TARGETS.normal;
  // split every sector's trials into chunks and run them on J threads
  const jobs = [];
  const per = Math.max(5, Math.ceil(trials * list.length / J));
  for (const s of list) for (let k = 0; k < trials; k += per) jobs.push({ s, k0: k, k1: Math.min(trials, k + per), profile, diff, ovr });
  const res = {};
  let next = 0;
  await new Promise((done, fail) => {
    let live = 0;
    const launch = () => {
      while (live < J && next < jobs.length) {
        const job = jobs[next++];
        live++;
        const w = new Worker(new URL(import.meta.url), { workerData: job });
        w.on('message', (m) => { (res[job.s] || (res[job.s] = [])).push(...m); });
        w.on('error', fail);
        w.on('exit', () => { live--; if (next >= jobs.length && live === 0) done(); else launch(); });
      }
    };
    launch();
  });
  const pct = (a, b) => (100 * a / Math.max(1, b));
  const summary = { diff, profile, trials, sectors: {} };
  let worstGap = 0, spikes = 0, warnBad = 0, quiet = 0;
  const briefs = [];
  const bossOnly = !!process.env.VM_BOSS;
  if (process.env.VM_BRIEF) { globalThis.__log = console.log; console.log = () => {}; }
  const D = C.DIFFICULTY[diff] || C.DIFFICULTY.normal;
  console.log(`Voltmaze ${C.VERSION} ramp · ${diff} · ${profile} autopilot · ${trials} trials per sector · typical upgrades, ${C.START_LIVES + D.lives} lives${ovr ? ' · VM_OVR' : ''}`);
  if (process.env.VM_ENDLESS) {
    const R = res[list[0]] || [];
    const d = R.map((r) => r.depth).sort((a, b) => a - b), q = (f) => d[Math.min(d.length - 1, Math.floor(f * d.length))];
    const sc = R.map((r) => r.score).sort((a, b) => a - b);
    const waves = new Map();
    for (const r of R) for (const t of r.tries) { const w = waves.get(t.n) || { tries: 0, died: 0, alive: 0, t: 0 }; w.tries++; w.died += t.died; w.alive += t.alive; w.t += t.t; waves.set(t.n, w); }
    const ln = `ENDLESS FACILITY · ${diff} · ${profile}: rooms reached median ${q(0.5)} (25% ${q(0.25)}, 75% ${q(0.75)}, best ${d[d.length - 1]}) · floors median ${R.map((r) => r.floor).sort((a, b) => a - b)[R.length >> 1]} · score median ${sc[sc.length >> 1]}
  death/try by depth: ` + [...waves.entries()].sort((a, b) => a[0] - b[0]).filter(([, w]) => w.tries >= 8).map(([k, w]) => `${k >= 1000 ? 'BOSS ' + C.BOSSES[C.BOSS_KEYS[(k - 1000) % 5]].name.split(' ')[0] : (k + 1) + '-' + (k + BAND)}: ${(100 * w.died / w.tries).toFixed(0)}% (${w.tries}) alive ${(w.alive / Math.max(1e-6, w.t)).toFixed(1)}`).join(' · ');
    (globalThis.__log || console.log)(ln);
    process.exit(0);
  }
  for (const s of list) {
    const R = res[s] || [];
    const n = R.length;
    const clear = R.filter((r) => r.clear).length, bossR = R.filter((r) => r.boss).length;
    // per wave: room index on the route (the boss room is its own column)
    const waves = new Map();
    for (const r of R) for (const t of r.tries) {
      const key = t.boss ? 'B' : t.n;
      const w = waves.get(key) || { key, tries: 0, died: 0, hits: 0, t: 0, alive: 0, active: 0, aiming: 0, bolts: 0, cause: {}, ff: 0, ffn: 0, fired: 0, ph: {} };
      w.tries++; w.died += t.died; w.fired += t.fired; if (t.died && t.boss) w.ph[t.phase] = (w.ph[t.phase] || 0) + 1; w.hits += t.hits; w.t += t.t; w.alive += t.alive; w.active += t.active; w.aiming += t.aiming; w.bolts += t.bolts;
      if (t.cause) w.cause[t.cause] = (w.cause[t.cause] || 0) + 1;
      if (t.firstFire >= 0) { w.ff += t.firstFire; w.ffn++; }
      waves.set(key, w);
    }
    const keys = [...waves.keys()].filter((k) => k !== 'B').sort((a, b) => a - b).filter((k) => waves.get(k).tries >= Math.max(3, n * 0.08));
    if (waves.has('B')) keys.push('B');
    const T = target[s];
    const cr = pct(clear, n), gap = T !== undefined ? cr - T : 0;
    worstGap = Math.max(worstGap, Math.abs(gap));
    const allCause = {};
    for (const w of waves.values()) for (const [c, k] of Object.entries(w.cause)) allCause[c] = (allCause[c] || 0) + k;
    const top = Object.entries(allCause).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, k]) => `${c} ${k}`).join(', ');
    const deaths = R.reduce((a, r) => a + r.deaths, 0);
    console.log(`\nS${s + 1} ${SECTORS[s].name.padEnd(15)} clear ${cr.toFixed(0).padStart(3)}%${T !== undefined ? ` (target ${T}%, ${gap >= 0 ? '+' : ''}${gap.toFixed(0)})` : ''}  boss reached ${pct(bossR, n).toFixed(0)}%  deaths/run ${(deaths / Math.max(1, n)).toFixed(2)}  avg ${(R.reduce((a, r) => a + r.t, 0) / Math.max(1, n)).toFixed(0)} s  killed by: ${top}`);
    console.log('  wave     tries  death/try  hits/try  alive  active  aiming  fire/s  s/try  1st shot  killed by');
    const rows = [];
    let prev = null;
    for (const k of keys) {
      const w = waves.get(k);
      const d = w.died / w.tries, h = w.hits / w.tries, tt = Math.max(1e-6, w.t);
      const row = { wave: k === 'B' ? 'boss' : k + 1, tries: w.tries, death: d, hits: h, alive: w.alive / tt, active: w.active / tt, aiming: w.aiming / tt, bolts: w.bolts / tt, fireRate: w.fired / tt, sec: w.t / w.tries, firstShot: w.ffn ? w.ff / w.ffn : null, cause: w.cause };
      rows.push(row);
      let flag = '';
      if (prev && k !== 'B' && prev.death > d + 0.07) { flag = '  << easier than the wave before'; spikes++; }
      if (k !== 'B' && row.alive < BUSY) { flag += '  << quiet room'; quiet++; }
      const cs = Object.entries(w.cause).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, q]) => `${c} ${q}`).join(', ');
      console.log(`  ${String(k === 'B' ? 'BOSS' : 'room ' + (k + 1)).padEnd(8)} ${String(w.tries).padStart(5)}  ${(100 * d).toFixed(0).padStart(8)}%  ${h.toFixed(2).padStart(8)}  ${row.alive.toFixed(1).padStart(5)}  ${row.active.toFixed(1).padStart(6)}  ${row.aiming.toFixed(2).padStart(6)}  ${row.fireRate.toFixed(1).padStart(6)}  ${row.sec.toFixed(1).padStart(5)}  ${row.firstShot === null ? '     -  ' : row.firstShot.toFixed(1).padStart(6) + ' s'}  ${cs}${flag}`);
      prev = row;
    }
    // warnings
    const W8 = { n: 0, bad: 0, min: 1e9, kinds: {}, worst: null };
    for (const r of R) {
      W8.n += r.warn.n; W8.bad += r.warn.bad; W8.min = Math.min(W8.min, r.warn.min);
      for (const [k, v] of Object.entries(r.warn.kinds)) { const q = W8.kinds[k] || (W8.kinds[k] = { n: 0, min: 1e9 }); q.n += v.n; q.min = Math.min(q.min, v.min); }
      if (r.warn.worst && (!W8.worst || r.warn.worst.d < W8.worst.d)) W8.worst = r.warn.worst;
    }
    warnBad += W8.bad;
    const rw = [RAMP[s].warn[0], RAMP[s].warn[1]].map((v) => Math.max(C.MIN_WARN, v * D.warn).toFixed(2)).join(' -> ');
    console.log(`  warnings: ${W8.n} threats, ${W8.bad} shorter than the RAMP warn (${rw} s)${W8.worst ? ` · worst: ${W8.worst.kind} ${W8.worst.lead.toFixed(2)} s < ${W8.worst.need.toFixed(2)} s` : ''} · shortest lead / warn = ${W8.min === 1e9 ? '-' : W8.min.toFixed(2)}`);
    if (process.env.VM_WARN) console.log('   ' + Object.entries(W8.kinds).map(([k, v]) => `${k} ${v.n} (min ${v.min.toFixed(2)} s)`).join(' · '));
    const kb = {};
    for (const r of R) for (const [k, v] of Object.entries(r.killedBy)) kb[k] = (kb[k] || 0) + v;
    const kt = Object.values(kb).reduce((a, b) => a + b, 0);
    console.log(`  robots destroyed by: ${Object.entries(kb).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v, kt).toFixed(0)}%`).join(', ')} · rooms fully cleared ${pct(R.reduce((a, r) => a + r.cleared, 0), R.reduce((a, r) => a + r.rooms, 0)).toFixed(0)}%`);
    if (bossOnly) {
      const bw = waves.get('B');
      const kills = R.filter((r) => r.bossKill).length;
      const bt = R.filter((r) => r.bossKill).reduce((a, r) => a + r.t, 0) / Math.max(1, kills);
      const line = `S${s + 1} boss ${C.BOSSES[SECTORS[s].boss].name.padEnd(16)} killed ${pct(kills, n).toFixed(0)}% · deaths per kill ${(deaths / Math.max(1, n)).toFixed(2)} · death/try ${bw ? (100 * bw.died / bw.tries).toFixed(0) : '-'}% · fight ${bt.toFixed(0)} s · by phase ${bw ? JSON.stringify(bw.ph) : '-'} · killed by ${top}`;
      briefs.push(line); globalThis.__log ? null : console.log(line);
      continue;
    }
    if (process.env.VM_BRIEF) briefs.push(`S${s + 1} ${cr.toFixed(0).padStart(3)}%${T !== undefined ? ` (${gap >= 0 ? '+' : ''}${gap.toFixed(0)})` : ''} d/try ${rows.map((r) => (100 * r.death).toFixed(0)).join(' ')} · hits ${rows.map((r) => r.hits.toFixed(2)).join(' ')} · alive ${rows.map((r) => r.alive.toFixed(1)).join(' ')} · aim ${rows.map((r) => r.aiming.toFixed(2)).join(' ')} · fire/s ${rows.map((r) => r.fireRate.toFixed(1)).join(" ")} · s ${rows.map((r) => r.sec.toFixed(0)).join(" ")} · warn bad ${W8.bad}`);
    summary.sectors[s + 1] = { clear: cr, target: T, bossReached: pct(bossR, n), deathsPerRun: deaths / Math.max(1, n), waves: rows, warn: { n: W8.n, bad: W8.bad, minRatio: W8.min, kinds: W8.kinds }, killedBy: kb };
  }
  if (process.env.VM_BRIEF) { console.log = globalThis.__log; for (const b of briefs) console.log(b); }
  console.log(`worst gap to target ${worstGap.toFixed(0)} points · ${spikes} wave(s) easier than the one before · ${quiet} quiet room(s) (< ${BUSY} robots alive on average) · ${warnBad} short warning(s)`);
  if (process.env.VM_JSON) writeFileSync(process.env.VM_JSON, JSON.stringify(summary, null, 1));
  process.exit(0);
}
