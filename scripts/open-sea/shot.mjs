// Deterministic screenshot harness for the Open Sea demo (headless Chromium + SwiftShader).
// usage: node scripts/open-sea/shot.mjs out.png "t=16.5&sea=4&cam=0,3,0,4.2,-0.03" [warmSeconds] [frames] [WxH]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  try { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); } catch {
    console.error('Playwright is not installed. Run: cd scripts/open-sea && npm install && npx playwright install chromium');
    process.exit(1);
  }
}
import { writeFileSync } from 'node:fs';
const [out, query = '', warm = '6', frames = '3', size = '960x540'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const base = process.env.SEA_URL || 'http://localhost:8791/demos/open-sea/index.html';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const logs = [];
page.on('console', m => { const t = m.text(); if (!/GPU stall|GL Driver Message/.test(t)) logs.push(`[${m.type()}] ${t}`); });
page.on('pageerror', e => logs.push('[pageerror] ' + e.message));
await page.goto(`${base}?shot=1&${query}`);
await page.waitForFunction(() => window.__seaReady, null, { timeout: 60000 }).catch(() => {});
if (!(await page.evaluate(() => !!window.__sea))) { for (const l of logs) console.log(l); await browser.close(); process.exit(2); }
const t0 = Date.now();
const res = await page.evaluate(async ([warm, frames]) => {
  const s = window.__sea;
  await s.warm(warm, 0.1);
  let r; for (let i = 0; i < frames; i++) r = s.shot(0.033);
  return r;
}, [parseFloat(warm), parseInt(frames)]);
const png = await page.screenshot({ type: 'png', timeout: 240000 });
writeFileSync(out, png);
console.log(JSON.stringify(res), `${((Date.now() - t0) / 1000).toFixed(1)}s`);
for (const l of logs.slice(0, 30)) console.log(l);
await browser.close();
