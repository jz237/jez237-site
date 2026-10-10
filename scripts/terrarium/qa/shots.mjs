// Screenshot set for visual review: node qa/shots.mjs [baseUrl]
// Requires the dev server (npm run dev) or any static server for the built demo.
// Uses Playwright's Chromium; with no GPU it falls back to SwiftShader (slow but faithful).
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:5191/';
const out = path.resolve(import.meta.dirname, '..', '.qa-results');
await mkdir(out, {recursive: true});
let chromium;
try {({chromium} = await import('playwright'));} catch {
  console.error('Install Playwright to capture screenshots (npm i -D playwright).');
  process.exit(1);
}
const browser = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
const shots = [
  ['overview', 1440, 900, '?frames=4&ui=0'],
  ['hud', 1280, 720, '?frames=3'],
  ['phone', 390, 844, '?frames=3'],
  ['night', 1280, 720, '?frames=3&ui=0&sim=2', (t) => {t.weather.hours = 23;}],
  ['rain', 1280, 720, '?frames=3&ui=0', (t) => {t.weather.humidity = 0.95; for (const p of t.case.panes) p.fog.settle(0.95);}],
];
for (const [name, w, h, query, setup] of shots) {
  const page = await browser.newPage({viewport: {width: w, height: h}});
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + query, {waitUntil: 'domcontentloaded'});
  await page.waitForFunction(() => window.terrariumReady, null, {timeout: 300000});
  if (setup && await page.evaluate(() => !!window.terrarium)) await page.evaluate(`(${setup})(window.terrarium); for (let i = 0; i < 60; i++) window.terrarium.simulate(1/30); window.terrarium.frame(0.0001);`);
  await page.screenshot({path: path.join(out, `${name}.png`), timeout: 300000});
  console.log(`${name}.png${errors.length ? `  errors: ${errors.join('; ')}` : ''}`);
  await page.close();
}
await browser.close();
