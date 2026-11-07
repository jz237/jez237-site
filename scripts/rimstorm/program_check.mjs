// Shader-program check over a full autoplay run (Playwright + headless Edge): loads the game with ?fixed,
// starts the AI PLAYTHROUGH (all five sectors, upgrades between them) and drives frames at 6x game speed,
// sampling renderer.info.programs. Every look, model and effect is compiled by R.warmUp at boot, so the
// count must not change during play (a change means something compiled mid-game: a hitch on phones).
//   node scripts/rimstorm/program_check.mjs [baseUrl=http://127.0.0.1:8772/games/2026-11-06/rimstorm/] [maxMinutes=7]
// Needs the static server (serve.py on 8772) and the shared Edge lock (see README).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const maxMin = +(process.argv[3] || 7);
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
let posts = 0;
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
  if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
});
await page.goto(base + '?fixed&noscores');
await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
const p0 = await page.evaluate(() => window.__rs.R.r.info.programs.length);
console.log(`programs after warm-up: ${p0}`);
await page.evaluate(() => window.__rs.startPlaythrough());
const t0 = Date.now();
const seen = new Map();
let lo = p0, hi = p0, last = '', done = '';
while (Date.now() - t0 < maxMin * 60000) {
  const r = await page.evaluate(() => {
    const rs = window.__rs, G = rs.G;
    for (let i = 0; i < 10; i++) { if (!(G.slowT > 0)) G.timeScale = 6; rs.tick(6); }
    const W = rs.W;
    return { prog: rs.R.r.info.programs.length, state: G.state, mode: G.mode, screen: G.screen, s: W ? W.sector : -1, web: W ? W.web : -1, phase: W ? W.phase : '-', boss: W && W.boss ? W.boss.key : '', over: W ? !!W.over : false, result: W ? W.result : '' };
  });
  lo = Math.min(lo, r.prog); hi = Math.max(hi, r.prog);
  const key = `S${r.s + 1}${r.web >= 4 ? 'B' : 'W' + (r.web + 1)}`;
  if (!seen.has(key)) seen.set(key, r.prog);
  const line = `${key} ${r.phase}${r.boss ? ' ' + r.boss : ''} [${r.state}${r.screen ? '/' + r.screen : ''}] programs ${r.prog}`;
  if (key !== last) { console.log(line); last = key; }
  if (r.mode !== 'playthrough' || (r.state === 'title')) { done = 'left playthrough: ' + line; break; }
  if (r.screen === 'results' && r.s >= 4 && r.result === 'clear') { done = 'campaign complete'; break; }
  if (r.state === 'ended' || r.screen === 'upgrades' || r.screen === 'results') await page.waitForTimeout(400);   // real-time hand-offs between sectors
}
await browser.close();
console.log(`stopped: ${done || 'time limit'} after ${((Date.now() - t0) / 1000).toFixed(0)} s; webs seen ${seen.size}`);
console.log(`shader programs: warm-up ${p0}, min ${lo}, max ${hi} -> ${lo === hi && hi === p0 ? 'CONSTANT' : 'CHANGED'}`);
console.log(errors.length ? `console errors: ${errors.length}\n  ` + [...new Set(errors)].slice(0, 8).join('\n  ') : 'console errors: 0');
console.log(`score POSTs attempted: ${posts}`);
process.exit(errors.length || posts || lo !== hi || hi !== p0 ? 1 : 0);
