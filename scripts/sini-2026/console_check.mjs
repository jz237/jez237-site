// Browser check (Playwright + Edge): runs the ?test=1 self-test page, lets the title roll into the attract
// demo, plays a campaign with the autopilot, and runs the AI playthrough from the sector 1 AWAKE checkpoint
// into sector 2. Fails on any console error or score POST (POSTs are intercepted).
//   node scripts/sini-2026/console_check.mjs [baseUrl=http://127.0.0.1:8843/games/2026-11-07/sini-2026/]
// Needs a static server on the repo root and Playwright (e.g. from D:/Projects/.tmp/model-s-tools).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8843/games/2026-11-07/sini-2026/';

const browser = await chromium.launch({ channel: 'msedge', args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
let posts = 0;
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
  if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
});

await page.goto(base + '?test=1');
await page.waitForFunction(() => window.__snTests && window.__snTests.done, null, { timeout: 400000 });
const t = await page.evaluate(() => window.__snTests);
for (const r of t.results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (${r.info})`);

await page.goto(base + '?demo&noscores');
await page.waitForTimeout(9000);
const demo = await page.evaluate(() => ({ mode: window.__sn.G.mode, n: window.__sn.G.W && window.__sn.G.W.n }));
console.log(`attract demo: mode ${demo.mode}, ${demo.n} ticks`);
await page.goto(base + '?autoplay&noscores');
await page.waitForTimeout(12000);
const play = await page.evaluate(() => ({ mode: window.__sn.G.mode, t: window.__sn.G.W.t, crystals: window.__sn.G.W.stats.crystals }));
console.log(`autoplay campaign: mode ${play.mode}, ${play.t.toFixed(1)} s, ${play.crystals} crystals`);
// AI playthrough: from the sector 1 AWAKE checkpoint it must clear, shop, and roll into sector 2 by itself
await page.goto(base + '?playthrough&fixed&cp=2&noscores');
await page.waitForFunction(() => window.__sn && window.__sn.G.mode === 'playthrough', null, { timeout: 60000 });
const pt = await page.evaluate(async () => {
  const sn = window.__sn;
  for (let i = 0; i < 60 * 200 && sn.G.state === 'play'; i++) sn.tick(1, 1 / 60, i % 30 === 0);
  await new Promise((r) => setTimeout(r, 1700)); sn.tick(10);
  const shop = { state: sn.G.state, screen: sn.G.screen, sub: document.getElementById('up-sub').textContent };
  await new Promise((r) => setTimeout(r, 6500)); sn.tick(10);
  return { shop, next: { mode: sn.G.mode, state: sn.G.state, sector: sn.G.W.sector } };
});
console.log(`AI playthrough: after the S1 construct -> ${pt.shop.screen} (${pt.shop.sub}), then ${pt.next.mode} sector ${pt.next.sector + 1} (${pt.next.state})`);
await browser.close();
console.log(errors.length ? `console errors: ${errors.length}\n  ` + errors.slice(0, 8).join('\n  ') : 'console errors: 0');
console.log(`score POSTs attempted: ${posts}`);
const ptOk = pt.shop.screen === 'upgrades' && pt.next.mode === 'playthrough' && pt.next.sector === 1 && pt.next.state === 'play';
process.exit(t.pass === t.total && !errors.length && !posts && demo.mode === 'demo' && ptOk ? 0 : 1);
