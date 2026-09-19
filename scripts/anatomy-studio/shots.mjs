/** Full-quality Playwright captures (AO on) for visual review. Env: STUDIO_URL, OUT dir. */
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
const url = process.env.STUDIO_URL || 'http://127.0.0.1:8791/demos/anatomy-studio/';
const out = process.env.OUT || '/tmp/anatomy-studio-shots'; await mkdir(out, {recursive: true});
const browser = await chromium.launch({headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-gpu-sandbox']});
const page = await browser.newPage({viewport: {width: 1400, height: 900}, deviceScaleFactor: 1});
await page.goto(`${url}?stage=full&msaa=0`); await page.waitForFunction(() => document.body.dataset.ready === 'true', null, {timeout: 300000});
await page.waitForFunction(() => window.anatomyStudio.getState().stage === 'detail' && !window.anatomyStudio.getState().loading, null, {timeout: 300000});
await page.addStyleTag({content: '.hero{display:none!important}'});
const shot = async name => { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({path: path.join(out, `${name}.png`), timeout: 240000}); console.log('shot', name); };
const settle = ms => page.waitForTimeout(ms);
await page.evaluate(() => window.anatomyStudio.setMode('realistic')); await settle(4000); await shot('realistic-assembled');
if (process.env.BODY === 'female') { await page.evaluate(() => window.anatomyStudio.setBody('female')); await settle(2500); await shot('female-assembled'); await page.evaluate(() => document.querySelector('[data-view="side"]').click()); await settle(2500); await shot('female-side'); await page.evaluate(() => document.querySelector('[data-view="hero"]').click()); await settle(1500); await page.evaluate(() => { const l = document.getElementById('part-list'); l.value = 'female/mammary-gland-l'; l.dispatchEvent(new Event('change')); document.getElementById('isolate').click(); }); await settle(2500); await shot('female-mammary'); await page.evaluate(() => document.getElementById('clear').click()); await settle(500); }
if (process.env.AO_COMPARE) { await page.evaluate(() => { const l = document.getElementById('part-list'); l.value = 'visceral/liver'; l.dispatchEvent(new Event('change')); document.getElementById('clear').click(); window.anatomyStudio.setAmount(.2); }); await page.waitForFunction(() => Math.abs(window.anatomyStudio.getState().amount - .2) < .001, null, {timeout: 60000}); await settle(1500); await shot('ao-on'); await page.evaluate(() => document.getElementById('ao-toggle').click()); await settle(1500); await shot('ao-off'); await page.evaluate(() => document.getElementById('ao-toggle').click()); await page.evaluate(() => window.anatomyStudio.setAmount(0)); }
await page.evaluate(() => window.anatomyStudio.setAmount(.45)); await page.waitForFunction(() => Math.abs(window.anatomyStudio.getState().amount - .45) < .001, null, {timeout: 60000}); await settle(1500); await shot('realistic-exploded-45');
await page.evaluate(() => window.anatomyStudio.setAmount(0)); await page.waitForFunction(() => window.anatomyStudio.getState().amount === 0, null, {timeout: 60000});
for (const id of ['visceral/liver', 'muscular/rectus-abdominis-muscle-l', 'skeletal/femur-l', 'brain/superior-frontal-gyrus-l']) {
  await page.evaluate(v => { const l = document.getElementById('part-list'); l.value = v; l.dispatchEvent(new Event('change')); document.getElementById('isolate').click(); }, id);
  await settle(2500); await shot(`isolated-${id.split('/')[1]}`); await page.evaluate(() => document.getElementById('clear').click()); await settle(500);
}
if (process.env.LOD) { await page.evaluate(() => window.anatomyStudio.setDetail(false)); for (const id of ['muscular/rectus-abdominis-muscle-l', 'skeletal/vertebra-l3', 'brain/superior-frontal-gyrus-l']) {
  await page.evaluate(v => { const l = document.getElementById('part-list'); l.value = v; l.dispatchEvent(new Event('change')); document.getElementById('isolate').click(); }, id); await settle(2500); await shot(`lod-lo-${id.split('/')[1]}`);
  await page.evaluate(async v => { window.anatomyStudio.setDetail(true); await window.anatomyStudio.loadHi(v.split('/')[0]); window.anatomyStudio.lodPass(); }, id); await page.waitForFunction(v => window.anatomyStudio.getParts().find(p => p.id === v).lod === 'hi', id, {timeout: 240000}); await settle(2500); await shot(`lod-hi-${id.split('/')[1]}`);
  console.log('tris', id, await page.evaluate(v => window.anatomyStudio.getParts().find(p => p.id === v).triangles, id)); await page.evaluate(() => { document.getElementById('clear').click(); window.anatomyStudio.setDetail(false); }); await settle(500); } }
for (const id of (process.env.STUDIES || 'urinary,face,aorta,pelvis,shoulder,larynx,foot,heart').split(',')) {
  await page.evaluate(a => window.anatomyStudio.enterAssembly(a), id); await page.waitForFunction(a => window.anatomyStudio.getState().assembly === a && window.anatomyStudio.getState().amount === 1, id, {timeout: 120000}); await settle(2500); await shot(`study-${id}`);
  if (id === 'heart') { await page.evaluate(() => document.getElementById('label-all').click()); await settle(1500); await shot('study-heart-labels'); }
  await page.evaluate(() => window.anatomyStudio.leaveAssembly()); await page.waitForFunction(() => window.anatomyStudio.getState().assembly === null, null, {timeout: 60000});
}
await browser.close(); console.log('done');
