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
assert.ok(manifest.pieces.length >= 1400 && manifest.pieces.length <= 2600, `piece count ${manifest.pieces.length}`);
assert.ok(manifest.stats.triangles <= 5.2e6, `triangles ${manifest.stats.triangles}`);
for (const f of manifest.files) { const s = await stat(path.join(DEMO, f.path)); assert.equal(s.size, f.bytes, `${f.id} bytes drifted from manifest`); assert.ok(s.size < MAX, `${f.id} exceeds the 25 MiB Cloudflare Pages limit`); }
for (const f of manifest.files.filter(f => f.hi)) { const s = await stat(path.join(DEMO, f.hi.path)); assert.equal(s.size, f.hi.bytes, `${f.id} hi bytes drifted`); assert.ok(s.size < MAX, `hi/${f.id} exceeds 25 MiB`); }
assert.ok(manifest.stats.hiTriangles > manifest.stats.triangles * 1.5, 'full tier carries more detail');
const ids = new Set(manifest.pieces.map(p => p.id)); assert.equal(ids.size, manifest.pieces.length, 'piece ids must be unique');
const direct = Object.entries(manifest.stats.descriptionRules).filter(([r]) => !['parent', 'path', 'none'].includes(r)).reduce((a, [, n]) => a + n, 0);
assert.ok(direct / manifest.pieces.length >= .85, `direct description coverage ${(direct / manifest.pieces.length * 100).toFixed(1)}%`);
for (const [id, min] of Object.entries({heart: 30, lungs: 25, spine: 55, brain: 60, skull: 60, eye: 10, hand: 35, knee: 15, ribcage: 45, digestive: 40, urinary: 10, face: 30, aorta: 60, pelvis: 10, shoulder: 14, larynx: 28, foot: 38, reproductive: 9})) assert.ok(manifest.assemblies[id].length >= min, `${id} assembly has ${manifest.assemblies[id].length} members`);
console.log(`static: ${manifest.pieces.length} pieces, ${manifest.stats.triangles.toLocaleString()} triangles, ${(manifest.stats.bytes / 1048576).toFixed(1)} MB, ${(direct / manifest.pieces.length * 100).toFixed(1)}% direct descriptions`);

// ---- browser checks (software WebGL on Linux without a GPU)
const args = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-gpu-sandbox'];
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || undefined, headless: true, args});
const errors = []; const page = await browser.newPage({viewport: {width: 1280, height: 860}, deviceScaleFactor: 1});
const infos = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); else if (!/Failed to load/.test(m.text())) infos.push(`${m.type()}: ${m.text()}`); });
page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(new URL(url).origin) && r.url().includes('anatomy-studio')) errors.push(`${r.status()} ${r.url()}`); });
const read = () => page.evaluate(() => window.anatomyStudio.getState());
const ready = p => p.waitForFunction(() => document.body.dataset.ready === 'true', null, {timeout: 240000});
const settled = (amount, p = page) => p.waitForFunction(v => window.anatomyStudio.getState().amount === v, amount, {timeout: 60000});
const full = (p = page) => p.waitForFunction(() => window.anatomyStudio.getState().stage === 'detail' && !window.anatomyStudio.getState().loading, null, {timeout: 240000});
const moved = (min = .01) => page.evaluate(m => window.anatomyStudio.getParts().every(p => Math.hypot(...p.position.map((v, i) => v - p.base[i])) > m || (!p.inAssembly && window.anatomyStudio.getState().assembly)), min);
const restored = () => page.evaluate(() => window.anatomyStudio.getParts().every(p => p.position.every((v, i) => v === p.base[i])));
try {
 await page.goto(`${url}?quality=verify&stage=full`); await ready(page); await full();
 const FEMALE = manifest.files.find(f => f.id === 'female')?.pieces ?? 0, BODY = manifest.pieces.length - FEMALE;
 let s = await read(); assert.equal(s.pieces, manifest.pieces.length); assert.equal(s.visible, BODY); assert.deepEqual([...s.files].sort(), manifest.files.map(f => f.id).sort());
 await page.waitForTimeout(400); s = await read(); assert.ok(s.triangles > manifest.stats.triangles * .5 && s.triangles <= manifest.stats.triangles * 1.05, `rendered triangles ${s.triangles}`);
 await page.screenshot({path: path.join(shots, 'assembled.png')});
 // explode: visible intermediate motion, every piece moves, skeleton barely moves, exact reassembly
 await page.locator('#explode-button').click(); await page.waitForFunction(() => window.anatomyStudio.getState().amount > 0, null, {timeout: 30000}); s = await read(); assert.ok(s.amount > 0 && s.amount <= 1, 'explosion animates from the assembled state'); await settled(1);
 assert.ok(await moved(.01), 'every piece must move'); const skel = await page.evaluate(() => window.anatomyStudio.getParts().filter(p => p.file === 'skeletal').map(p => Math.hypot(...p.position.map((v, i) => v - p.base[i])))); assert.ok(Math.max(...skel) < .45, 'skeleton stays near the axis');
 await page.screenshot({path: path.join(shots, 'exploded.png')});
 await page.locator('#reset').click(); await settled(0); assert.ok(await restored(), 'reassembly must restore exact positions'); assert.equal((await read()).visible, BODY);
 // nested assemblies: isolation, framing, primary members separated
 for (const id of Object.keys(manifest.assemblies)) {
  await page.locator(`[data-assembly="${id}"]`).click(); await page.waitForFunction(a => window.anatomyStudio.getState().assembly === a, id, {timeout: 60000}); await settled(1); await page.waitForTimeout(1200);
  s = await read(); assert.equal(s.assembly, id); assert.equal(s.visible, manifest.assemblies[id].length, `${id}: only members visible`);
  const a = await page.evaluate(x => window.anatomyStudio.getAssembly(x), id); assert.equal(a.members.length, manifest.assemblies[id].length);
  const framed = a.rectangles.filter(r => a.framed.includes(r.id)); const inside = framed.filter(r => r.min.every(v => v >= -1) && r.max.every(v => v <= 1)).length; assert.ok(inside >= framed.length * .9, `${id}: ${inside}/${framed.length} framed members inside the frame`);
  const prim = a.rectangles.filter(r => a.primary.includes(r.id)); let bad = 0;
  for (let i = 0; i < prim.length; i++) for (let j = i + 1; j < prim.length; j++) { const p = prim[i], q = prim[j]; const d = Math.hypot(...p.center.map((v, k) => v - q.center[k])); const ox = Math.max(0, Math.min(p.max[0], q.max[0]) - Math.max(p.min[0], q.min[0])), oy = Math.max(0, Math.min(p.max[1], q.max[1]) - Math.max(p.min[1], q.min[1])); const area = ox * oy, small = Math.min((p.max[0] - p.min[0]) * (p.max[1] - p.min[1]), (q.max[0] - q.min[0]) * (q.max[1] - q.min[1])); if (d < .02 || (small > 0 && area / small > .6)) bad++; }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({path: path.join(shots, `assembly-${id}.png`)});
  assert.ok(bad <= Math.max(2, prim.length * .12), `${id}: ${bad} primary pairs still overlap`);
  await page.locator('#leave-assembly').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null); await settled(0); if ((await read()).body !== 'male') await page.evaluate(() => window.anatomyStudio.setBody('male')); assert.equal((await read()).visible, BODY); assert.ok(await restored(), `${id}: leaving restores positions`);
 }
 // zoom detail: a piece that fills the view swaps to the full-resolution tier and back
 const camSettled = () => page.waitForFunction(() => !window.anatomyStudio._camera().tween, null, {timeout: 30000});
 await page.evaluate(() => window.anatomyStudio.setDetail(true)); await page.locator('#part-list').selectOption('heart/left-ventricle'); await page.locator('#isolate').click(); await page.waitForTimeout(300); await camSettled();
 await page.evaluate(() => window.anatomyStudio.loadHi('heart')); await page.waitForFunction(() => window.anatomyStudio.getState().hiFiles.includes('heart'), null, {timeout: 120000}); await page.evaluate(() => window.anatomyStudio.lodPass());
 const lv = await page.evaluate(() => window.anatomyStudio.getParts().find(p => p.id === 'heart/left-ventricle')); if (lv.lod !== 'hi') { const diag = await page.evaluate(() => ({state: window.anatomyStudio.getState(), radius: window.anatomyStudio._radius('heart/left-ventricle'), camera: window.anatomyStudio._camera(), lv: window.anatomyStudio.getParts().find(p => p.id === 'heart/left-ventricle')})); console.log('LOD DIAG', JSON.stringify(diag), '\n', infos.slice(-14).join('\n')); }
 assert.equal(lv.lod, 'hi', 'zoomed piece uses the full tier'); assert.ok(lv.triangles >= manifest.pieces.find(p => p.id === 'heart/left-ventricle').triangles, 'full tier has at least the base triangles');
 await page.locator('#clear').click(); await page.locator('#reset').click(); await settled(0); await page.waitForTimeout(300); await camSettled(); await page.evaluate(() => window.anatomyStudio.lodPass()); assert.equal((await page.evaluate(() => window.anatomyStudio.getParts().find(p => p.id === 'heart/left-ventricle'))).lod, 'lo', 'far piece returns to the base tier'); await page.evaluate(() => window.anatomyStudio.setDetail(false));
 // reproductive system switch: female hides the male organs and shows the schematic set; reset returns to male
 await page.locator('[data-body="female"]').click(); await page.waitForTimeout(300); s = await read(); assert.equal(s.body, 'female');
 const fem = await page.evaluate(() => window.anatomyStudio.getParts().filter(p => p.file === 'female')); assert.ok(fem.length >= 9, 'schematic female pieces loaded');
 assert.ok(await page.evaluate(() => window.anatomyStudio.getParts().filter(p => p.file === 'female').length > 0) && s.visible === manifest.pieces.length - manifest.pieces.filter(p => p.file === 'visceral' && (/Male genital system/.test(p.path) || p.name === 'Urethra')).length, 'female body hides the male organs only');
 await page.locator('[data-body="male"]').click(); await page.waitForTimeout(300); assert.equal((await read()).visible, manifest.pieces.length - manifest.files.find(f => f.id === 'female').pieces);
 await page.locator('[data-assembly="reproductive"]').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === 'reproductive'); assert.equal((await read()).body, 'female'); await settled(1); await page.locator('#leave-assembly').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null); await settled(0); await page.locator('#reset').click(); await settled(0); assert.equal((await read()).body, 'male');
 // paired study: the Right toggle swaps to the mirrored member set of the same size
 await page.locator('[data-assembly="hand"]').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === 'hand'); await settled(1);
 const left = await page.evaluate(() => window.anatomyStudio.getAssembly('hand')); await page.locator('[data-side="R"]').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assemblySide === 'R'); await settled(1);
 const right = await page.evaluate(() => window.anatomyStudio.getAssembly('hand')); assert.equal(right.members.length, left.members.length, 'right hand has the same piece count'); assert.ok(right.members.every(id => id.endsWith('-r')) && left.members.every(id => id.endsWith('-l')), 'sides swap'); assert.equal((await read()).visible, right.members.length);
 await page.waitForFunction(() => window.anatomyStudio.getParts().filter(p => p.inAssembly).every(p => Math.hypot(...p.position.map((v, i) => v - p.base[i])) > .005), null, {timeout: 30000}).catch(() => assert.fail('right hand explodes')); await page.waitForTimeout(1500); await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({path: path.join(shots, 'assembly-hand-right.png')});
 await page.locator('#leave-assembly').click(); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null); await settled(0); assert.ok(await restored());
 // filters, search, isolate, finish modes, labels, sequence, keyboard
 await page.locator('#system').selectOption('heart'); assert.equal((await read()).visible, manifest.files.find(f => f.id === 'heart').pieces);
 await page.locator('#system').selectOption('all'); await page.locator('#search').fill('femur');
 const matches = await page.locator('#part-list option').allTextContents(); assert.ok(matches.length > 2 && matches.length < 40 && matches.slice(1).every(l => l.toLowerCase().includes('femur')));
 await page.locator('#search').fill('no-such-piece'); assert.equal(await page.locator('#part-list option').count(), 1); await page.locator('#search').fill('');
 await page.locator('#part-list').selectOption('visceral/liver'); await page.locator('#isolate').click(); await page.waitForTimeout(1100); assert.equal((await read()).visible, 1); assert.ok((await read()).selected.startsWith('Liver'));
 await page.waitForFunction(() => /liver/i.test(document.getElementById('part-description').textContent), null, {timeout: 20000});
 await page.screenshot({path: path.join(shots, 'isolated.png')}); await page.locator('#clear').click(); assert.equal((await read()).visible, BODY);
 assert.equal((await read()).mode, 'xray', 'studio opens in X-ray'); for (const mode of ['skin', 'realistic', 'coded', 'clay', 'xray']) { await page.locator(`[data-mode="${mode}"]`).click(); assert.equal((await read()).mode, mode); }
 await page.locator('#label-toggle').click(); await page.waitForFunction(() => document.querySelectorAll('.landmark:not([hidden])').length >= 4, null, {timeout: 30000}); await page.locator('#label-toggle').click();
 await page.locator('#animate').click(); await page.waitForFunction(() => window.anatomyStudio.getState().target > .1, null, {timeout: 90000}); await page.locator('#animate').click(); await page.locator('#reset').click(); await settled(0);
 await page.locator('#viewport').focus(); await page.keyboard.press('e'); await settled(1); await page.keyboard.press('r'); await settled(0);
 await page.keyboard.press('h'); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === 'heart'); await page.keyboard.press('Escape'); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null); await settled(0);
 // all-parts board: every tile in frame, no overlaps, at several viewports
 await page.locator('#all-parts').click(); await page.waitForFunction(() => window.anatomyStudio.getState().board, null, {timeout: 60000});
 const checkBoard = async count => { await page.waitForTimeout(250); const rects = await page.evaluate(() => window.anatomyStudio.getBoardRectangles()); assert.equal(rects.length, count); for (const r of rects) assert.ok(r.min.every(v => v >= -1) && r.max.every(v => v <= 1), `tile ${r.id} outside frame`); for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) { const a = rects[i], b = rects[j]; assert.ok(a.max[0] <= b.min[0] || b.max[0] <= a.min[0] || a.max[1] <= b.min[1] || b.max[1] <= a.min[1], `tiles ${a.id}, ${b.id} overlap`); } assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false); };
 await checkBoard(BODY); await page.screenshot({path: path.join(shots, 'all-parts.png')});
 await page.locator('#system').selectOption('brain'); await checkBoard(manifest.files.find(f => f.id === 'brain').pieces); await page.locator('#system').selectOption('all');
 for (const size of [{width: 390, height: 844}, {width: 900, height: 600}]) { await page.setViewportSize(size); await checkBoard(BODY); }
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
 console.log(`PASS: ${url} — ${manifest.pieces.length} pieces across ${manifest.files.length} files, explosion, exact reassembly, ${Object.keys(manifest.assemblies).length} nested studies (${Object.entries(manifest.assemblies).map(([k, v]) => `${k} ${v.length}`).join(', ')}), filters, search, isolate, finishes, labels, sequence, keyboard, non-overlapping board at three viewports, mobile, deep links, manual, reduced motion. Screenshots: ${shots}`);
} finally { await browser.close(); }
