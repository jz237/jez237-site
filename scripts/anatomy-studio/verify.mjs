import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir, readFile, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const url = process.env.STUDIO_URL || 'http://127.0.0.1:8791/demos/anatomy-studio/';
const shots = process.env.STUDIO_SHOTS || path.join(tmpdir(), 'anatomy-studio-validation'); await mkdir(shots, {recursive: true});
const HERE = path.dirname(new URL(import.meta.url).pathname), DEMO = path.resolve(HERE, '../../demos/anatomy-studio');
const manifest = JSON.parse(await readFile(path.join(DEMO, 'manifest.json'), 'utf8'));
const MAX = 25 * 1024 * 1024;

// ---- static checks on the built assets
assert.ok(manifest.pieces.length >= 1400 && manifest.pieces.length <= 2100, `piece count ${manifest.pieces.length}`);
assert.ok(manifest.stats.triangles <= 2.4e6, `triangles ${manifest.stats.triangles}`);
for (const f of manifest.files) { const s = await stat(path.join(DEMO, f.path)); assert.equal(s.size, f.bytes, `${f.id} bytes drifted from manifest`); assert.ok(s.size < MAX, `${f.id} exceeds the 25 MiB Cloudflare Pages limit`); }
const ids = new Set(manifest.pieces.map(p => p.id)); assert.equal(ids.size, manifest.pieces.length, 'piece ids must be unique');
const direct = Object.entries(manifest.stats.descriptionRules).filter(([r]) => !['parent', 'path', 'none'].includes(r)).reduce((a, [, n]) => a + n, 0);
assert.ok(direct / manifest.pieces.length >= .85, `direct description coverage ${(direct / manifest.pieces.length * 100).toFixed(1)}%`);
for (const [id, min] of Object.entries({heart: 30, lungs: 25, spine: 55, brain: 60})) assert.ok(manifest.assemblies[id].length >= min, `${id} assembly has ${manifest.assemblies[id].length} members`);
console.log(`static: ${manifest.pieces.length} pieces, ${manifest.stats.triangles.toLocaleString()} triangles, ${(manifest.stats.bytes / 1048576).toFixed(1)} MB, ${(direct / manifest.pieces.length * 100).toFixed(1)}% direct descriptions`);

// ---- browser checks (software WebGL on Linux without a GPU)
const args = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-gpu-sandbox'];
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || undefined, headless: true, args});
const errors = []; const page = await browser.newPage({viewport: {width: 1280, height: 860}, deviceScaleFactor: 1});
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(new URL(url).origin) && r.url().includes('anatomy-studio')) errors.push(`${r.status()} ${r.url()}`); });
const read = () => page.evaluate(() => window.anatomyStudio.getState());
const ready = p => p.waitForFunction(() => document.body.dataset.ready === 'true', null, {timeout: 240000});
const settled = (amount, p = page) => p.waitForFunction(v => window.anatomyStudio.getState().amount === v, amount, {timeout: 60000});
const full = (p = page) => p.waitForFunction(() => window.anatomyStudio.getState().stage === 'detail' && !window.anatomyStudio.getState().loading, null, {timeout: 240000});
const moved = (min = .01) => page.evaluate(m => window.anatomyStudio.getParts().every(p => Math.hypot(...p.position.map((v, i) => v - p.base[i])) > m || (!p.inAssembly && window.anatomyStudio.getState().assembly)), min);
const restored = () => page.evaluate(() => window.anatomyStudio.getParts().every(p => p.position.every((v, i) => v === p.base[i])));
try {
 await page.goto(`${url}?quality=verify&stage=full`); await ready(page); await full();
 let s = await read(); assert.equal(s.pieces, manifest.pieces.length); assert.equal(s.visible, manifest.pieces.length); assert.deepEqual([...s.files].sort(), manifest.files.map(f => f.id).sort());
 await page.waitForTimeout(400); s = await read(); assert.ok(s.triangles > manifest.stats.triangles * .5 && s.triangles <= manifest.stats.triangles * 1.05, `rendered triangles ${s.triangles}`);
 await page.screenshot({path: path.join(shots, 'assembled.png')});
 // explode: visible intermediate motion, every piece moves, skeleton barely moves, exact reassembly
 await page.locator('#explode-button').click(); await page.waitForFunction(() => window.anatomyStudio.getState().amount > 0, null, {timeout: 30000}); s = await read(); assert.ok(s.amount > 0 && s.amount <= 1, 'explosion animates from the assembled state'); await settled(1);
 assert.ok(await moved(.01), 'every piece must move'); const skel = await page.evaluate(() => window.anatomyStudio.getParts().filter(p => p.file === 'skeletal').map(p => Math.hypot(...p.position.map((v, i) => v - p.base[i])))); assert.ok(Math.max(...skel) < .45, 'skeleton stays near the axis');
 await page.screenshot({path: path.join(shots, 'exploded.png')});
 await page.locator('#reset').click(); await settled(0); assert.ok(await restored(), 'reassembly must restore exact positions'); assert.equal((await read()).visible, manifest.pieces.length);
 // nested assemblies: isolation, framing, primary members separated
 for (const id of Object.keys(manifest.assemblies)) {
  await page.locator(`[data-assembly="${id}"]`).click(); await page.waitForFunction(a => window.anatomyStudio.getState().assembly === a, id, {timeout: 60000}); await settled(1); await page.waitForTimeout(1200);
  s = await read(); assert.equal(s.assembly, id); assert.equal(s.visible, manifest.assemblies[id].length, `${id}: only members visible`);
  const a = await page.evaluate(x => window.anatomyStudio.getAssembly(x), id); assert.equal(a.members.length, manifest.assemblies[id].length);
  const inside = a.rectangles.filter(r => r.min.every(v => v >= -1) && r.max.every(v => v <= 1)).length; assert.ok(inside >= a.rectangles.length * .9, `${id}: ${inside}/${a.rectangles.length} members inside the frame`);
  const prim = a.rectangles.filter(r => a.primary.includes(r.id)); let bad = 0;
  for (let i = 0; i < prim.length; i++) for (let j = i + 1; j < prim.length; j++) { const p = prim[i], q = prim[j]; const d = Math.hypot(...p.center.map((v, k) => v - q.center[k])); const ox = Math.max(0, Math.min(p.max[0], q.max[0]) - Math.max(p.min[0], q.min[0])), oy = Math.max(0, Math.min(p.max[1], q.max[1]) - Math.max(p.min[1], q.min[1])); const area = ox * oy, small = Math.min((p.max[0] - p.min[0]) * (p.max[1] - p.min[1]), (q.max[0] - q.min[0]) * (q.max[1] - q.min[1])); if (d < .02 || (small > 0 && area / small > .6)) bad++; }
  await page.screenshot({path: path.join(shots, `assembly-${id}.png`)});
  assert.ok(bad <= Math.max(2, prim.length * .12), `${id}: ${bad} primary pairs still overlap`);
  await page.locator('#leave-assembly').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null); await settled(0); assert.equal((await read()).visible, manifest.pieces.length); assert.ok(await restored(), `${id}: leaving restores positions`);
 }
 // filters, search, isolate, finish modes, labels, sequence, keyboard
 await page.locator('#system').selectOption('heart'); assert.equal((await read()).visible, manifest.files.find(f => f.id === 'heart').pieces);
 await page.locator('#system').selectOption('all'); await page.locator('#search').fill('femur');
 const matches = await page.locator('#part-list option').allTextContents(); assert.ok(matches.length > 2 && matches.length < 40 && matches.slice(1).every(l => l.toLowerCase().includes('femur')));
 await page.locator('#search').fill('no-such-piece'); assert.equal(await page.locator('#part-list option').count(), 1); await page.locator('#search').fill('');
 await page.locator('#part-list').selectOption('visceral/liver'); await page.locator('#isolate').click(); await page.waitForTimeout(1100); assert.equal((await read()).visible, 1); assert.ok((await read()).selected.startsWith('Liver'));
 await page.waitForFunction(() => /liver/i.test(document.getElementById('part-description').textContent), null, {timeout: 20000});
 await page.screenshot({path: path.join(shots, 'isolated.png')}); await page.locator('#clear').click(); assert.equal((await read()).visible, manifest.pieces.length);
 for (const mode of ['coded', 'xray', 'clay', 'realistic']) { await page.locator(`[data-mode="${mode}"]`).click(); assert.equal((await read()).mode, mode); }
 await page.locator('#label-toggle').click(); await page.waitForFunction(() => document.querySelectorAll('.landmark:not([hidden])').length >= 4, null, {timeout: 30000}); await page.locator('#label-toggle').click();
 await page.locator('#animate').click(); await page.waitForFunction(() => window.anatomyStudio.getState().target > .1, null, {timeout: 90000}); await page.locator('#animate').click(); await page.locator('#reset').click(); await settled(0);
 await page.locator('#viewport').focus(); await page.keyboard.press('e'); await settled(1); await page.keyboard.press('r'); await settled(0);
 await page.keyboard.press('h'); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === 'heart'); await page.keyboard.press('Escape'); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null); await settled(0);
 // all-parts board: every tile in frame, no overlaps, at several viewports
 await page.locator('#all-parts').click(); await page.waitForFunction(() => window.anatomyStudio.getState().board, null, {timeout: 60000});
 const checkBoard = async count => { await page.waitForTimeout(250); const rects = await page.evaluate(() => window.anatomyStudio.getBoardRectangles()); assert.equal(rects.length, count); for (const r of rects) assert.ok(r.min.every(v => v >= -1) && r.max.every(v => v <= 1), `tile ${r.id} outside frame`); for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) { const a = rects[i], b = rects[j]; assert.ok(a.max[0] <= b.min[0] || b.max[0] <= a.min[0] || a.max[1] <= b.min[1] || b.max[1] <= a.min[1], `tiles ${a.id}, ${b.id} overlap`); } assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false); };
 await checkBoard(manifest.pieces.length); await page.screenshot({path: path.join(shots, 'all-parts.png')});
 await page.locator('#system').selectOption('brain'); await checkBoard(manifest.files.find(f => f.id === 'brain').pieces); await page.locator('#system').selectOption('all');
 for (const size of [{width: 390, height: 844}, {width: 900, height: 600}]) { await page.setViewportSize(size); await checkBoard(manifest.pieces.length); }
 await page.locator('#return-body').click(); assert.equal((await read()).board, false);
 // mobile layout and deep link
 await page.setViewportSize({width: 390, height: 844}); await page.waitForTimeout(800); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no mobile horizontal overflow'); await page.screenshot({path: path.join(shots, 'mobile.png'), fullPage: true});
 await page.goto(`${url}?quality=verify&assembly=lungs`); await ready(page); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === 'lungs', null, {timeout: 120000}); await settled(1); assert.equal((await read()).visible, manifest.assemblies.lungs.length); await page.screenshot({path: path.join(shots, 'lungs-mobile.png')});
 s = await read(); assert.ok(s.pieces < manifest.pieces.length || s.stage === 'detail', 'mobile default stage is core (or explicitly full)');
 await page.setViewportSize({width: 1280, height: 860}); await page.goto(new URL('manual.html', url).href); assert.equal(await page.locator('h1').count(), 1); assert.ok(await page.locator('a[href*="Z-Anatomy"]').count() >= 1); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
 // reduced motion still animates a deliberate explosion
 const reduced = await browser.newPage({viewport: {width: 1024, height: 800}, reducedMotion: 'reduce'}); reduced.on('pageerror', e => errors.push(e.message)); await reduced.goto(`${url}?quality=verify&stage=core`); await ready(reduced);
 await reduced.locator('#explode-button').click(); await reduced.waitForFunction(() => window.anatomyStudio.getState().amount > 0, null, {timeout: 30000}); await settled(1, reduced); assert.ok(await reduced.evaluate(() => window.anatomyStudio.getParts().every(p => Math.hypot(...p.position.map((v, i) => v - p.base[i])) > .01)), 'reduced motion explosion still separates every piece');
 assert.deepEqual(errors, []);
 console.log(`PASS: ${url} — ${manifest.pieces.length} pieces across ${manifest.files.length} files, explosion, exact reassembly, four nested studies (${Object.entries(manifest.assemblies).map(([k, v]) => `${k} ${v.length}`).join(', ')}), filters, search, isolate, finishes, labels, sequence, keyboard, non-overlapping board at three viewports, mobile, deep links, manual, reduced motion. Screenshots: ${shots}`);
} finally { await browser.close(); }
