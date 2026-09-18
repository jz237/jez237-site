/** Capture the demos-page preview image (1100x579 JPEG) from the running studio. Env: STUDIO_URL, OUT. */
import {chromium} from 'playwright';
import path from 'node:path';
const url = process.env.STUDIO_URL || 'http://127.0.0.1:8791/demos/anatomy-studio/';
const out = process.env.OUT || path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../demos/assets/anatomy-studio.jpg');
const browser = await chromium.launch({headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-gpu-sandbox']});
const page = await browser.newPage({viewport: {width: 1560, height: 1000}, deviceScaleFactor: 1});
await page.goto(`${url}?stage=full`); await page.waitForFunction(() => document.body.dataset.ready === 'true', null, {timeout: 300000});
await page.waitForFunction(() => window.anatomyStudio.getState().stage === 'detail' && !window.anatomyStudio.getState().loading, null, {timeout: 300000});
await page.addStyleTag({content: '.hero,.scene-badge,.view-toolbar,.gesture-hint{display:none!important}'}); await page.evaluate(() => { window.anatomyStudio.setAmount(.5); });
await page.waitForFunction(() => Math.abs(window.anatomyStudio.getState().amount - .5) < .002, null, {timeout: 60000}); await page.waitForTimeout(3000);
const box = await page.locator('#viewport').boundingBox();
const w = box.width * .78, h = w * 579 / 1100, x = box.x + (box.width - w) / 2, y = box.y + Math.max(0, (box.height - h) / 2) - 10;
await page.screenshot({path: out, type: 'jpeg', quality: 86, clip: {x, y, width: w, height: h}, timeout: 240000});
console.log('wrote', out, `${Math.round(w)}x${Math.round(h)}`); await browser.close();
