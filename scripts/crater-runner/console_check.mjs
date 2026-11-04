// Browser check (Playwright + Edge): loads the ?test=1 self-test page and waits for its verdict, then
// loads the normal page, lets the title screen roll into the attract demo, starts a campaign with the
// autopilot, and fails on any console error. Score POSTs are intercepted so nothing reaches the boards.
//   node scripts/crater-runner/console_check.mjs [baseUrl=http://127.0.0.1:8138/games/2026-11-04/crater-runner/]
// Needs a static server on the repo root and Playwright (e.g. from D:/Projects/.tmp/model-s-tools).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8138/games/2026-11-04/crater-runner/';

const browser = await chromium.launch({ channel: 'msedge', args: ['--use-angle=d3d11', '--enable-unsafe-swiftshader'] });
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
await page.waitForFunction(() => window.__crTests && window.__crTests.done, null, { timeout: 240000 });
const t = await page.evaluate(() => window.__crTests);
for (const r of t.results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (${r.info})`);

await page.goto(base + '?demo&noscores');
await page.waitForTimeout(9000);
const demo = await page.evaluate(() => ({ mode: window.__cr.G.mode, x: window.__cr.G.W && window.__cr.G.W.rovers[0].x }));
console.log(`attract demo: mode ${demo.mode}, rover at ${Math.round(demo.x || 0)} m`);
await page.goto(base + '?autoplay&noscores');
await page.waitForTimeout(12000);
const play = await page.evaluate(() => ({ mode: window.__cr.G.mode, t: window.__cr.G.W.t, errs: window.__crErrors.length }));
console.log(`autoplay campaign: mode ${play.mode}, ${play.t.toFixed(1)} s driven`);
await browser.close();
console.log(errors.length ? `console errors: ${errors.length}\n  ` + errors.slice(0, 8).join('\n  ') : 'console errors: 0');
console.log(`score POSTs attempted: ${posts}`);
process.exit(t.pass === t.total && !errors.length && !posts && demo.mode === 'demo' ? 0 : 1);
