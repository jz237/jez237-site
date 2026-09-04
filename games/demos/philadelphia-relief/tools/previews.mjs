/**
 * Bake scene previews and the social card from the running map.
 *
 * Playwright drives a real Chrome against a local static server, clicks each
 * cinematic preset by name, waits for the flight to settle, and saves a small
 * JPEG per preset plus a 1200x630 social card of the opening skyline. The
 * images are static assets committed with the site; nothing is fetched from
 * anywhere at run time.
 *
 *   node tools/previews.mjs --url http://127.0.0.1:8731/games/demos/philadelphia-relief/
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '..', 'assets', 'previews');
const argOf = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const URL = argOf('--url', 'http://127.0.0.1:8731/games/demos/philadelphia-relief/');
const chrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) => existsSync(p));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
// A wide viewport for the social card; previews are cropped from the stage.
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${URL}#q=balanced`, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => !document.getElementById('loading'), { timeout: 120000 });
await page.waitForTimeout(2500);
// Hide the chrome: the previews are of the map, not the panels.
await page.evaluate(() => document.body.classList.add('cinema'));
await page.waitForTimeout(500);

const presets = await page.evaluate(() => [...document.querySelectorAll('#presetList .preset-card')]
  .map((b) => b.querySelector('.p-name').textContent));
const ids = await page.evaluate(async () => (await import('./src/presets.js')).PRESETS.map((p) => p.id));

for (let i = 0; i < ids.length; i += 1) {
  await page.evaluate((idx) => {
    document.body.classList.remove('cinema');
    document.querySelectorAll('#presetList .preset-card')[idx].click();
    document.body.classList.add('cinema');
  }, i);
  // Flights take ~4 s under SwiftShader; wait until the readout stops moving.
  let last = '';
  for (let k = 0; k < 40; k += 1) {
    await page.waitForTimeout(400);
    const now = await page.evaluate(() => document.getElementById('outCoords').textContent
      + document.getElementById('outZoom').textContent);
    if (now === last && k > 8) break;
    last = now;
  }
  await page.waitForTimeout(600);
  const file = path.join(OUT, `${ids[i]}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 72, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  if (i === 0) {
    await page.screenshot({ path: path.resolve(here, '..', 'assets', 'social-card.jpg'), type: 'jpeg', quality: 80 });
  }
  console.log(`${ids[i]}: ${presets[i]}`);
}
await browser.close();
console.log(`previews in ${OUT}`);
