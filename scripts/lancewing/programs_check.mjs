// Shader-program stability through a long AI playthrough (Playwright + headless Edge, shared lock):
// starts the AI PLAYTHROUGH in ?fixed mode, renders every frame, samples renderer.info.programs every 10 s of
// game time across all five sectors (waves, bosses, upgrades) and fails if the count ever grows after boot
// (a runtime shader compile = a freeze on phones). Also fails on console errors. Holds the lock < 8 minutes.
//   node scripts/lancewing/programs_check.mjs [maxSimMinutes=26] [baseUrl]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const maxMin = +(process.argv[2] || 26);
const base = process.argv[3] || 'http://127.0.0.1:8771/games/2026-11-06/lancewing/';
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
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(base + '?fixed&noscores&seed=4&q=high');
  await page.waitForFunction(() => window.__lw && window.__lw.G.state === 'title', null, { timeout: 60000 });
  await page.evaluate(() => window.__lw.tick(30));
  const boot = await page.evaluate(() => window.__lw.R.r.info.programs.length);
  await page.evaluate(() => window.__lw.startPlaythrough());
  let max = boot, sim = 0, seen = new Set(), last = '';
  while (sim < maxMin * 60 && Date.now() - t0 < 7 * 60 * 1000) {
    const o = await page.evaluate(() => {
      const lw = window.__lw;
      for (let i = 0; i < 600; i++) { lw.tick(1); if (lw.G.state === 'upgrade' || lw.G.state === 'results') break; }
      const W = lw.W;
      return { programs: lw.R.r.info.programs.length, state: lw.G.state, mode: lw.G.mode, sector: W ? W.sector : -1, wave: W ? W.wave : -1, boss: !!(W && W.boss) };
    });
    sim += 10;
    seen.add(`${o.sector}:${o.boss ? 'B' : o.wave}`);
    if (o.programs > max) { max = o.programs; console.log(`programs grew to ${o.programs} at sector ${o.sector + 1} wave ${o.wave + 1} (${o.state})`); }
    const tag = `S${o.sector + 1}${o.boss ? ' boss' : ''}`;
    if (tag !== last) { console.log(`${(sim / 60).toFixed(1)} min: ${tag} · ${o.programs} programs`); last = tag; }
    if (o.state === 'upgrade' || o.state === 'ended') { await page.waitForTimeout(1500); sim -= 10; continue; }   // the playthrough refit screen moves on by a real-time timer
    if (o.state === 'results') break;
    if (o.mode !== 'playthrough') break;
  }
  console.log(`boot ${boot} programs, max ${max} over ${(sim / 60).toFixed(1)} sim min, ${seen.size} sector/wave states visited`);
  if (max > boot) { console.log('FAIL: shader programs were compiled during play'); fail++; }
  if (errors.length) { console.log('FAIL console errors: ' + errors.slice(0, 5).join(' | ')); fail++; }
} finally { if (browser) await browser.close(); unlock(); }
console.log(fail ? 'FAIL' : 'PASS', `· ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fail ? 1 : 0);
