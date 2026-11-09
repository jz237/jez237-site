// AI PLAYTHROUGH: in the real page (fast-forwarded with ?fixed), the autopilot plays from world N, buys upgrades
// between worlds, retries from checkpoints, and finishes all five worlds.
//   node scripts/skyhold/playthrough_check.mjs [base] [fromWorld=4]
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('D:/Projects/.tmp/model-s-tools/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8862/games/2026-11-09/skyhold/';
const from = +(process.argv[3] || 4);
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) { try { fs.mkdirSync(LOCK); break; } catch { if (i > 80) { console.error('lock busy'); process.exit(3); } await sleep(15000); } }
process.on('exit', () => { try { fs.rmdirSync(LOCK); } catch { /* gone */ } });
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11'] });
let done = false;
const errors = [];
try {
  const page = await (await browser.newContext({ viewport: { width: 800, height: 450 } })).newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/game-scores.jez237.workers.dev/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(base + `?fixed&noscores&sector=${from - 1}`);
  await page.waitForFunction(() => window.__sh && window.__sh.G.state === 'title', null, { timeout: 120000 });
  await page.evaluate(() => window.__sh.startPlaythrough());
  const t0 = Date.now();
  let last = '';
  while (Date.now() - t0 < 900000) {
    const s = await page.evaluate(() => { const sh = window.__sh, G = sh.G; if (G.state === 'play') sh.tick(1800, 1 / 60, false); return { st: G.state, mode: G.mode, sec: G.W && G.W.sector, wave: G.W && G.W.wave, title: document.getElementById('res-title').textContent, tries: G.run && G.run.tries, up: G.run && JSON.stringify(G.run.up) }; });
    const line = `${s.st} world ${s.sec + 1} wave ${s.wave + 1} tries ${s.tries} up ${s.up}`;
    if (line !== last) { console.log(`  ${((Date.now() - t0) / 1000).toFixed(0)} s · ${line}`); last = line; }
    if (s.st === 'results') { console.log('  results:', s.title); done = s.title === 'AI PLAYTHROUGH COMPLETE'; break; }
    if (s.st !== 'play') await sleep(1000);
  }
} finally { await browser.close(); }
console.log(errors.length ? 'errors: ' + errors.slice(0, 3).join(' | ') : 'no page errors');
console.log(done && !errors.length ? 'PASS' : 'FAIL');
process.exit(done && !errors.length ? 0 : 1);
