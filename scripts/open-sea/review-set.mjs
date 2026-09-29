// Render a named set of stills for review: node review-set.mjs outDir [WxH] [warm] [nameFilter]
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); }
const [outDir, size = '1280x720', warm = '30', filter = ''] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const base = process.env.SEA_URL || 'http://localhost:8791/demos/open-sea/index.html';
mkdirSync(outDir, { recursive: true });
export const SET = [
  ['01-glass-morning-yacht', 't=7.6&sea=0.3&cloud=0.15&ycam=34,3.2,58'],
  ['02-fresh-noon-glitter', 'noyacht=1&t=13.8&sea=4&cloud=0.3&cam=0,3.2,0,5.3,-0.02'],
  ['03-rough-afternoon-yacht', 't=16.4&sea=6.3&cloud=0.75&ycam=46,11,35'],
  ['04-storm-dusk-rain-lightning', 't=18.2&sea=8.7&cloud=1&rain=0.9&light=1&bolt=0.25&ycam=42,7,120'],
  ['05-sunset-glitter', 'noyacht=1&t=18.25&sea=3&cloud=0.35&cam=0,3.0,0,4.75,0.01&look=sun,0.05,0.30'],
  ['06-moonlit-night', 'noyacht=1&t=26&sea=3&cloud=0.08&cam=0,3.0,0,0.9,0.14&look=moon,-0.20,0.15'],
  ['07-underwater-shafts-up', 't=12.6&sea=3&cloud=0.25&under=1&cam=0,-6,0,4.0,0.5'],
  ['08-underwater-fish-hull', 't=12.6&sea=3&cloud=0.25&under=1&ycam=9,-5,80,-3'],
  ['09-yacht-low-close', 't=15.2&sea=3.5&cloud=0.4&ycam=13,1.9,105,3.2'],
  ['10-overcast-rain-yacht', 't=14&sea=5.2&cloud=1&rain=0.55&ycam=30,5,150'],
  ['11-yacht-stern-wake', 't=10.5&sea=2.2&cloud=0.3&ycam=26,6,178'],
  ['12-high-aerial-swell', 'noyacht=1&t=16&sea=6&cloud=0.5&cam=0,140,0,4.6,-0.33'],
];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [name, q] of SET) {
  if (filter && !new RegExp(filter).test(name)) continue;
  const t0 = Date.now();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const logs = [];
  page.on('console', m => { const t = m.text(); if (/error|failed/i.test(t) && !/GPU stall/.test(t)) logs.push(t.slice(0, 300)); });
  page.on('pageerror', e => logs.push('pageerror ' + e.message.slice(0, 300)));
  await page.goto(`${base}?shot=1&q=high&${q}`);
  await page.waitForFunction(() => window.__seaReady, null, { timeout: 60000 }).catch(() => {});
  try {
    await page.evaluate(async ([w]) => { const s = window.__sea; await s.warm(w, 0.1); s.shot(0.033); s.shot(0.033); }, [parseFloat(warm)]);
    const png = await page.screenshot({ type: 'png', timeout: 300000 });
    writeFileSync(`${outDir}/${name}.png`, png);
    console.log(name, ((Date.now() - t0) / 1000).toFixed(0) + 's', logs.length ? logs.slice(0, 2) : '');
  } catch (e) { console.log(name, 'FAILED', e.message.slice(0, 200), logs.slice(0, 2)); }
  await page.close();
}
await browser.close();
