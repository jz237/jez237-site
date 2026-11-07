// Performance check (Playwright + headless Edge, shared Edge lock, ~2 min). Headless frame times say nothing about
// real fps, so this judges what headless CAN show:
//   - shader programs: the count at boot (after R.warmUp) must not grow through every sector's waves, every boss
//     fight (all phases' attacks), the Stormhunter, a co-op arena, ENDLESS SKIES, the attract demo and an instant replay
//     (a runtime compile is a freeze on phones)
//   - no long frames from compiles: the first 90 drawn frames after each scene change are timed one by one; a frame
//     over 60 ms AND 6x the median is reported (with whether programs grew); FAILS if any program was compiled
//   - CPU cost per frame by method: the sim alone (tick without drawing) and sim + R.sync + render submit, median /
//     p95 per sector, plus draw calls and triangles per frame (incl. the shadow + post passes)
//   node scripts/lancewing/perf_check.mjs [baseUrl] [quality=high]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8771/games/2026-11-06/lancewing/';
const q = process.argv[3] || 'high';
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) {
  try { fs.mkdirSync(LOCK); break; } catch {
    try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 600000) { fs.rmdirSync(LOCK); continue; } } catch { /* gone */ }
    if (i > 40) { console.error('could not take the edge lock'); process.exit(3); }
    console.log('edge lock busy, waiting…'); await sleep(25000 + Math.random() * 10000);
  }
}
const unlock = () => { try { fs.rmdirSync(LOCK); } catch { /* gone */ } };
process.on('exit', unlock);
let browser, fail = 0;
const t0 = Date.now();
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; return c; };
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(base + `?fixed&noscores&seed=6&q=${q}`);
  await page.waitForFunction(() => window.__lw && window.__lw.G.state === 'title' && !document.getElementById('loading'), null, { timeout: 60000 });
  await page.evaluate(() => window.__lw.tick(60));
  const boot = await page.evaluate(() => window.__lw.R.r.info.programs.length);
  console.log(`boot: ${boot} shader programs after warmUp (quality ${q})`);
  // a scene: start it, time the first 90 drawn frames one by one, then run `secs` more (drawing every 4th frame,
  // which also keeps the camera moving), sampling the CPU cost of the sim alone and of sim + render
  const scene = (label, setup, secs) => page.evaluate(([setup, secs]) => {
    const lw = window.__lw, inf = lw.R.r.info;
    new Function("lw", setup)(lw);
    const p0 = inf.programs.length, first = [];
    for (let i = 0; i < 90; i++) { const a = performance.now(); lw.tick(1); first.push(performance.now() - a); }
    // tick(n, dt, false) still draws its last frame: 8 frames with 1 drawn (A) against 8 drawn (B) gives
    // render = (B - A) / 7 and sim = (A - render) / 8 per frame
    const sim = [], full = [];
    for (let f = 0; f < secs * 60; f += 16) {
      let a = performance.now(); lw.tick(8, 1 / 60, false); const A = performance.now() - a;
      a = performance.now(); lw.tick(8); const B = performance.now() - a;
      const r = Math.max(0, (B - A) / 7), s = Math.max(0, (A - r) / 8);
      sim.push(s); full.push(s + r);
    }
    inf.autoReset = false; inf.reset(); lw.tick(1); const calls = inf.render.calls, tris = inf.render.triangles; inf.autoReset = true;
    const W = lw.W;
    return { first, sim, full, calls, tris, p0, p1: inf.programs.length, t: W ? W.t : 0, boss: !!(W && W.boss), hunter: !!(W && W.hunter), over: !!(W && W.over) };
  }, [setup, secs]).then((r) => ({ label, ...r }));
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
  const scenes = [
    ['S1 waves', 'lw.startCampaign(0); lw.auto("demo")', 50],
    ['S1 boss (Iron Gale)', 'lw.startCampaign(0, { wave: 4 }); lw.auto("demo")', 45],
    ['S2 waves', 'lw.startCampaign(1, { wave: 1 }); lw.auto("demo")', 40],
    ['S2 boss (Crystal Wyvern)', 'lw.startCampaign(1, { wave: 4 }); lw.auto("demo")', 40],
    ['S3 waves', 'lw.startCampaign(2, { wave: 1 }); lw.auto("demo")', 40],
    ['S3 boss (Forge Colossus)', 'lw.startCampaign(2, { wave: 4 }); lw.auto("demo")', 60],
    ['S4 waves', 'lw.startCampaign(3, { wave: 2 }); lw.auto("demo")', 40],
    ['S4 boss (Glacier Leviathan)', 'lw.startCampaign(3, { wave: 4 }); lw.auto("demo")', 70],
    ['S5 waves', 'lw.startCampaign(4, { wave: 2 }); lw.auto("demo")', 45],
    ['S5 boss (Eclipse Sovereign)', 'lw.startCampaign(4, { wave: 4 }); lw.auto("demo")', 70],
    ['local co-op S3', 'lw.startCampaign(2, { coop: true }); lw.auto("demo")', 30],
    ['endless skies', 'lw.startEndless(); lw.auto("demo")', 40],
    ['attract demo', 'lw.toTitle(); lw.startDemo()', 30],
  ];
  let max = boot;
  console.log('scene                          programs   sim ms/frame med/p95   sim+render ms med/p95   first 90 frames: worst (median)   draw calls  triangles');
  for (const [label, setup, secs] of scenes) {
    const r = await scene(label, setup, secs);
    const worst = Math.max(...r.first), fm = med(r.first);
    const long = worst > 60 && worst > 6 * fm;
    max = Math.max(max, r.p1);
    console.log(`${label.padEnd(30)} ${String(r.p0).padStart(3)} -> ${String(r.p1).padEnd(3)}  ${med(r.sim).toFixed(2).padStart(5)} / ${pct(r.sim, 0.95).toFixed(2).padEnd(6)}  ${med(r.full).toFixed(2).padStart(8)} / ${pct(r.full, 0.95).toFixed(2).padEnd(12)}  ${worst.toFixed(1).padStart(6)} (${fm.toFixed(1)})${long ? ' LONG' : '     '}               ${String(r.calls).padStart(4)}  ${String(r.tris).padStart(9)}`);
    if (r.p1 > r.p0) console.log(`      programs grew in ${label}: ${r.p0} -> ${r.p1}`);
    if (long && r.p1 > r.p0) console.log(`      a long frame (${worst.toFixed(0)} ms) came with a shader compile in ${label}`);
  }
  // an instant replay of the last clip, then the title again
  const rp = await page.evaluate(() => {
    const lw = window.__lw;
    lw.startCampaign(0, { wave: 4 }); lw.auto('demo');
    for (let i = 0; i < 60 * 90 && !lw.G.clip; i += 8) lw.tick(8, 1 / 60, false);
    const had = !!lw.G.clip;
    if (had) { lw.playReplay(); for (let i = 0; i < 240; i++) lw.tick(1); }
    lw.toTitle(); lw.tick(30);
    return { had, programs: lw.R.r.info.programs.length };
  });
  console.log(`instant replay: ${rp.had ? 'played a clip' : 'no clip in 40 s'} · ${rp.programs} programs`);
  max = Math.max(max, rp.programs);
  ok(max === boot, `shader programs: ${boot} at boot, at most ${max} through every sector, boss, co-op, endless, the demo and a replay`);
  ok(!errors.length, `no console errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`);
} catch (e) { console.error('check crashed:', e.stack || e.message); fail++; }
finally { if (browser) await browser.close().catch(() => {}); unlock(); }
console.log(`${fail ? 'FAIL' : 'PASS'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fail ? 1 : 0);
