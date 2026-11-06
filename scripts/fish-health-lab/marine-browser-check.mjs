// Saltwater fish picture sets (Nov 5 2026): for each of the seven saltwater fish types a
// 12/12 symptom grid of that fish, then one result per group walking the hero, the
// could-also cards, the compare view and the detail gallery — every picture the fish's own.
// Crops are served from local-images/<group>/ while fish-images-marine-data.mjs is 'local'.
// No broken images, no page errors, no other local-images/ requests.
// FISH_LAB_URL picks the target (default: the local preview).
// FISH_LAB_SHOTS=<dir> saves results.jpg (one result per group at 390 px).
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8770/experiments/fish-health-lab/';
const { IMAGE_SOURCE: MARINE_IMAGE_SOURCE, CROPS: MARINE_CROPS } = await import('../../experiments/fish-health-lab/fish-images-marine-data.mjs');
const { FISH_SETS, ALL_CROPS, urlFor } = await import('../../experiments/fish-health-lab/fish-images.mjs');
const { FISH_TYPES, closerQuestionFor } = await import('../../experiments/fish-health-lab/data.mjs');
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const errors = [], broken = [], checks = [], shots = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
const localRequests = new Set();
context.on('request', r => { if (r.url().includes('/local-images/')) localRequests.add(r.url()); });
context.on('response', r => { if ((r.url().includes('/local-images/') || r.url().startsWith('https://media.jez237.com/')) && r.status() >= 400) broken.push(`${r.status()} ${r.url()}`); });
context.on('requestfailed', r => { if (r.url().includes('/local-images/') || r.url().startsWith('https://media.jez237.com/')) broken.push(`failed ${r.url()}`); });
const page = await context.newPage();
const next = () => page.locator('#next-button').click();
const loaded = async selector => {
  const imgs = page.locator(selector);
  await imgs.evaluateAll(list => Promise.all(list.map(img => {
    if (img.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src;
    img.loading = 'eager';
    return img.decode().catch(() => {});
  })));
  const bad = await imgs.evaluateAll(list => list.filter(img => !img.naturalWidth).map(img => img.currentSrc || img.src || img.dataset.src));
  assert.deepEqual(bad, [], `broken images in ${selector}`);
};
const toSigns = async fish => {
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.locator('[data-action="start"]:visible').click();
  await page.locator('input[name="water"][value="marine"]').check(); await next();
  await page.locator(`input[name="fishType"][value="${fish}"]`).check(); await next();
};
const toResult = async (fish, sign, { closer, behaviors = [] } = {}) => {
  await toSigns(fish);
  await page.locator(`[data-symptom="${sign}"]`).click(); await next();
  if (closer) { await page.locator(`input[name="closer"][value="${closer}"]`).check(); await next(); }
  for (const id of behaviors) await page.locator(`input[name="behavior"][value="${id}"]`).check();
  await next();
  await page.locator('#results-title').waitFor();
};
const expectedUrl = id => urlFor(ALL_CROPS[id]);

// One result per saltwater group, each the problem that group is known for.
const WALKS = [
  ['clownfish', 'patch', { closer: 'slime' }, 'brooklynella', ['clownfish-brooklynella', 'clownfish-patch'], 'clownfish Brooklynella'],
  ['tang', 'dots', { closer: 'black' }, 'black-spot', ['tang-black-spot'], 'tang black spot'],
  ['angel', 'patch', { closer: 'pits' }, 'hlle', ['angel-hlle'], 'angel HLLE'],
  ['wrasse', 'breathing', { behaviors: ['rubbing'] }, 'flukes', ['wrasse-flukes'], 'wrasse flukes (fast breathing + rubbing)'],
  ['goby', 'dots', { closer: 'white' }, 'ich-marine', ['goby-ich', 'goby-dots'], 'goby marine ich'],
  ['damsel', 'dust', {}, 'velvet-marine', ['damsel-velvet', 'damsel-dust'], 'chromis/damsel velvet'],
  ['dottyback', 'sores', { closer: 'open' }, 'uronema', ['dottyback-uronema'], 'gramma/dottyback Uronema'],
];
assert.deepEqual(WALKS.map(w => w[0]), FISH_TYPES.marine.map(f => f.id));
try {
  for (const [fish, sign, opts, expected, gallery, label] of WALKS) {
    if (closerQuestionFor(sign, 'marine') && !opts.closer) throw new Error(`${fish} ${sign}: needs a closer answer`);
    await toSigns(fish);
    const grid = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => [img.dataset.imageSet, img.getAttribute('src') || img.dataset.src]));
    assert.equal(grid.length, 12); assert.ok(grid.every(([s]) => s === fish), `${fish}: ${grid.map(g => g[0]).join()}`);
    assert.deepEqual(grid.map(g => g[1]).sort(), Object.values(FISH_SETS[fish].signs).map(expectedUrl).sort(), `${fish}: symptom grid sources`);
    await loaded('#symptom-grid img');
    assert.match(await page.locator('#signs-note').innerText(), /AI pictures of /);

    await toResult(fish, sign, opts);
    assert.equal(await page.locator('.result-focus').getAttribute('data-result'), expected, `${fish} result`);
    assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), fish);
    assert.equal(await page.locator('.result-focus .result-image img').getAttribute('src'), expectedUrl(gallery[0]));
    const alts = await page.locator('.could-also .alternative').evaluateAll(list => list.map(el => [el.dataset.alternative, el.querySelector('img').dataset.imageSet, el.querySelector('img').getAttribute('src')]));
    assert.ok(alts.length, `${fish}: no could-also cards`);
    // Every saltwater result has a picture of this fish, so every could-also card is the fish's own.
    for (const [id, set, src] of alts) {
      assert.equal(set, fish, `${fish} could-also ${id}`);
      assert.equal(src, expectedUrl(FISH_SETS[fish].conditions[id][0]), `${fish} could-also ${id} src`);
    }
    await loaded('#results-content img');
    if (process.env.FISH_LAB_SHOTS) {
      await page.locator('img:visible').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
      shots.push(await page.screenshot({ fullPage: false }));
    }
    const [altId] = alts[0];
    await page.locator(`[data-alternative="${altId}"] [data-quick-compare]`).click();
    const sides = await page.locator('#quick-compare-content [data-compare-side]').evaluateAll(list => list.map(el => [el.dataset.compareSide, el.querySelector('img').dataset.imageSet]));
    assert.deepEqual(sides, [[expected, fish], [altId, fish]], `${fish} compare`);
    await loaded('#quick-compare-content img');
    await page.locator('#quick-compare-dialog .quick-compare-actions [data-action="close-dialog"]').click();

    await page.locator('.result-focus .result-image').click();
    await page.locator(`#detail-dialog [data-fish-gallery="${fish}"]`).waitFor();
    const srcs = await page.locator(`#detail-dialog [data-fish-gallery="${fish}"] img`).evaluateAll(list => list.map(img => img.getAttribute('src')));
    assert.deepEqual(srcs, gallery.map(expectedUrl), `${fish} gallery`);
    await loaded('#detail-dialog img');
    await page.locator('#detail-dialog .dialog-close').click();
    checks.push(`${label}: 12/12 ${fish} symptom pictures; hero ${gallery[0]}, could-also (${alts.map(a => a[0]).join(', ')}) all ${fish}, compare, ${gallery.length}-picture gallery`);
  }
} finally {
  await browser.close();
}
assert.deepEqual(errors, []); assert.deepEqual(broken, []);
// Only the unpublished marine crops may come from local-images/.
const allowedLocal = MARINE_IMAGE_SOURCE === 'local' ? Object.values(MARINE_CROPS).map(e => `/local-images/${e.key.slice('experiments/fish-health-lab/'.length)}`) : [];
for (const url of localRequests) assert.ok(allowedLocal.some(p => url.endsWith(p)), `unexpected local request ${url}`);

if (process.env.FISH_LAB_SHOTS) {
  const dir = await mkdtemp(`${tmpdir()}/fhl-marine-shots-`);
  const files = await Promise.all(shots.map(async (png, i) => { const f = `${dir}/result${i}.png`; await writeFile(f, png); return f; }));
  execFileSync('python3', ['-c', `import sys, json
from PIL import Image, ImageDraw
labels=json.loads(sys.argv[2]); ims=[Image.open(f).convert('RGB') for f in sys.argv[3:]]
W=sum(i.width for i in ims)+12*(len(ims)-1); H=max(i.height for i in ims)+28
o=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(o); x=0
for im,l in zip(ims,labels):
    d.text((x+6,8),l,fill='black'); o.paste(im,(x,28)); x+=im.width+12
o.save(sys.argv[1], quality=86)`, `${process.env.FISH_LAB_SHOTS}/results.jpg`, JSON.stringify(WALKS.map(w => w[5])), ...files]);
}
console.log(JSON.stringify({ url: root, marineImageSource: MARINE_IMAGE_SOURCE, checks: checks.length, passed: checks, localPictureRequests: localRequests.size, shots: process.env.FISH_LAB_SHOTS || null }, null, 2));
