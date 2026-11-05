// Browser check (Playwright + Edge): runs the ?test=1 self-test page, lets the title roll into the
// attract demo, plays a campaign with the autopilot, and runs the AI playthrough from the sector 1 boss
// into sector 2. Fails on any console error or score POST (POSTs are intercepted).
//   node scripts/swarmbreak/console_check.mjs [baseUrl=http://127.0.0.1:8139/games/2026-11-05/swarmbreak/]
// Needs a static server on the repo root and Playwright (e.g. from D:/Projects/.tmp/model-s-tools).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8139/games/2026-11-05/swarmbreak/';

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
await page.waitForFunction(() => window.__sbTests && window.__sbTests.done, null, { timeout: 300000 });
const t = await page.evaluate(() => window.__sbTests);
for (const r of t.results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (${r.info})`);

await page.goto(base + '?demo&noscores');
await page.waitForTimeout(9000);
const demo = await page.evaluate(() => ({ mode: window.__sb.G.mode, n: window.__sb.G.W && window.__sb.G.W.n }));
console.log(`attract demo: mode ${demo.mode}, ${demo.n} ticks`);
await page.goto(base + '?autoplay&noscores');
await page.waitForTimeout(12000);
const play = await page.evaluate(() => ({ mode: window.__sb.G.mode, t: window.__sb.G.W.t, kills: window.__sb.G.W.stats.kills }));
console.log(`autoplay campaign: mode ${play.mode}, ${play.t.toFixed(1)} s, ${play.kills} machines scrapped`);
// AI playthrough: from the sector 1 boss it must clear, shop, and roll into sector 2 by itself
await page.goto(base + '?playthrough&fixed&wave=5&noscores');
await page.waitForFunction(() => window.__sb && window.__sb.G.mode === 'playthrough', null, { timeout: 60000 });
const pt = await page.evaluate(async () => {
  const sb = window.__sb;
  for (let i = 0; i < 60 * 200 && sb.G.state === 'play'; i++) sb.tick(1);
  await new Promise((r) => setTimeout(r, 1700)); sb.tick(10);
  const shop = { state: sb.G.state, screen: sb.G.screen, sub: document.getElementById('up-sub').textContent };
  await new Promise((r) => setTimeout(r, 6500)); sb.tick(10);
  return { shop, next: { mode: sb.G.mode, state: sb.G.state, sector: sb.G.W.sector } };
});
console.log(`AI playthrough: after the S1 boss -> ${pt.shop.screen} (${pt.shop.sub}), then ${pt.next.mode} sector ${pt.next.sector + 1} (${pt.next.state})`);
await browser.close();
console.log(errors.length ? `console errors: ${errors.length}\n  ` + errors.slice(0, 8).join('\n  ') : 'console errors: 0');
console.log(`score POSTs attempted: ${posts}`);
const ptOk = pt.shop.screen === 'upgrades' && pt.next.mode === 'playthrough' && pt.next.sector === 1 && pt.next.state === 'play';
process.exit(t.pass === t.total && !errors.length && !posts && demo.mode === 'demo' && ptOk ? 0 : 1);
