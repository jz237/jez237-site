// Fish-type split (Nov 5 2026): the freshwater and saltwater fish-type grids, then for
// each new freshwater group a 12/12 symptom grid of that fish and one result walking the
// hero, could-also cards, compare view and detail gallery. Saltwater fish types now have
// their own sets (checked in full by marine-browser-check.mjs); here a spot check.
// New crops are served from local-images/<group>/ while fish-images-split-data.mjs is
// 'local'; re-used cells come from media.jez237.com. No broken images, no page errors.
// FISH_LAB_URL picks the target (default: the local preview).
// FISH_LAB_SHOTS=<dir> saves fish-type-grid.png (fresh + marine at 390 px) and results.jpg.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8770/experiments/fish-health-lab/';
const { IMAGE_SOURCE: SPLIT_IMAGE_SOURCE, CROPS: SPLIT_CROPS } = await import('../../experiments/fish-health-lab/fish-images-split-data.mjs');
const { IMAGE_SOURCE: MARINE_IMAGE_SOURCE, CROPS: MARINE_CROPS } = await import('../../experiments/fish-health-lab/fish-images-marine-data.mjs');
const { FISH_SETS, ALL_CROPS, urlFor } = await import('../../experiments/fish-health-lab/fish-images.mjs');
const { FISH_TYPES, closerQuestionFor } = await import('../../experiments/fish-health-lab/data.mjs');
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const errors = [], broken = [], checks = [], shots = [], gridShots = [];
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
const toFish = async water => {
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.locator('[data-action="start"]:visible').click();
  await page.locator(`input[name="water"][value="${water}"]`).check(); await next();
};
const toSigns = async (water, fish) => {
  await toFish(water);
  await page.locator(`input[name="fishType"][value="${fish}"]`).check(); await next();
};
const toResult = async (water, fish, sign, { texture, closer } = {}) => {
  await toSigns(water, fish);
  await page.locator(`[data-symptom="${sign}"]`).click(); await next();
  if (texture) { await page.locator(`[data-texture="${texture}"]`).click(); await next(); }
  if (closer) { await page.locator(`input[name="closer"][value="${closer}"]`).check(); await next(); }
  await next();
  await page.locator('#results-title').waitFor();
};
// The URL the app should use for a crop id (new crops local while unpublished, re-used ones on media).
const expectedUrl = id => urlFor(ALL_CROPS[id]);
const setFor = (fish, id) => FISH_SETS[fish].conditions[id] ? fish : 'generic';

// One result per new freshwater group, each showing a picture specific to the split.
const WALKS = [
  ['angelfish', 'patch', { closer: 'pits' }, 'hole-in-head', ['angelfish-hole-in-head'], 'angelfish/discus hole-in-the-head (discus)'],
  ['african', 'swollen', {}, 'bloat', ['cichlid-swollen', 'african-malawi-bloat'], 'African/oscar bloat + Malawi bloat'],
  ['cory', 'sores', { closer: 'open' }, 'ulcer', ['catfish-sores', 'cory-red-belly'], 'cory ulcer + red sore belly'],
  ['pleco', 'swollen', {}, 'bloat', ['pleco-swollen', 'pleco-sunken-belly'], 'pleco bloat + sunken belly'],
  ['guppy', 'swollen', {}, 'bloat', ['guppy-swollen', 'livebearer-pregnant'], 'guppy bloat + pregnant female'],
  ['molly', 'unclear', {}, 'water', ['livebearer-breathing', 'livebearer-red-gills', 'molly-unclear'], 'molly/platy water problem + shimmies'],
  ['gourami', 'sores', { closer: 'open' }, 'ulcer', ['gourami-sores', 'gourami-dgd'], 'gourami ulcer + dwarf gourami disease'],
  ['barb', 'dots', { texture: 'dots' }, 'ich-fresh', ['barb-dots', 'barb-school-dots'], 'barb/danio ich (one fish + a school)'],
];
try {
  // Fish-type grids: freshwater 11 + Not sure, saltwater 7 + Not sure, every tile loads.
  for (const water of ['fresh', 'marine']) {
    await toFish(water);
    const values = await page.locator('input[name="fishType"]').evaluateAll(els => els.map(el => el.value));
    assert.deepEqual(values, [...FISH_TYPES[water].map(f => f.id), '']);
    await loaded('#fish-grid img');
    assert.equal(await page.locator('#fish-grid img').count(), values.length);
    // Three tiles per row on a phone, and nothing wider than the screen.
    const tops = await page.locator('#fish-grid .fish-chip').evaluateAll(list => list.map(el => Math.round(el.getBoundingClientRect().top)));
    assert.equal(tops.filter(t => t === tops[0]).length, 3, `${water}: 3 tiles in the first row`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390), `${water}: no sideways scroll`);
    const titles = await page.locator('#fish-grid strong').evaluateAll(list => list.map(el => [el.innerText, el.scrollWidth <= el.clientWidth + 1]));
    for (const [title, fits] of titles) assert.ok(fits, `${water}: "${title}" overflows`);
    if (process.env.FISH_LAB_SHOTS) {
      // A viewport tall enough for the whole grid, so the sticky Back/Skip bar sits below it.
      await page.setViewportSize({ width: 390, height: await page.evaluate(() => document.documentElement.scrollHeight) });
      gridShots.push(await page.screenshot());
      await page.setViewportSize({ width: 390, height: 844 });
    }
    checks.push(`${water} fish-type grid: ${values.length - 1} fish + Not sure, all tiles load, 3 per row at 390 px, names fit`);
  }

  for (const [fish, sign, opts, expected, gallery, label] of WALKS) {
    if (closerQuestionFor(sign, 'fresh') && !opts.closer) throw new Error(`${fish} ${sign}: needs a closer answer`);
    await toSigns('fresh', fish);
    const grid = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => [img.dataset.imageSet, img.getAttribute('src') || img.dataset.src]));
    assert.equal(grid.length, 12); assert.ok(grid.every(([s]) => s === fish), `${fish}: ${grid.map(g => g[0]).join()}`);
    const expectedSrcs = Object.values(FISH_SETS[fish].signs).map(expectedUrl);
    assert.deepEqual(grid.map(g => g[1]).sort(), expectedSrcs.sort(), `${fish}: symptom grid sources`);
    await loaded('#symptom-grid img');
    assert.match(await page.locator('#signs-note').innerText(), /AI pictures of /);

    await toResult('fresh', fish, sign, opts);
    assert.equal(await page.locator('.result-focus').getAttribute('data-result'), expected, `${fish} result`);
    assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), fish);
    assert.equal(await page.locator('.result-focus .result-image img').getAttribute('src'), expectedUrl(gallery[0]));
    const alts = await page.locator('.could-also .alternative').evaluateAll(list => list.map(el => [el.dataset.alternative, el.querySelector('img').dataset.imageSet]));
    assert.ok(alts.length, `${fish}: no could-also cards`);
    for (const [id, set] of alts) assert.equal(set, setFor(fish, id), `${fish} could-also ${id}`);
    await loaded('#results-content img');
    if (process.env.FISH_LAB_SHOTS) {
      await page.locator('img:visible').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
      shots.push(await page.screenshot({ fullPage: false }));
    }
    const [altId] = alts[0];
    await page.locator(`[data-alternative="${altId}"] [data-quick-compare]`).click();
    const sides = await page.locator('#quick-compare-content [data-compare-side]').evaluateAll(list => list.map(el => [el.dataset.compareSide, el.querySelector('img').dataset.imageSet]));
    assert.deepEqual(sides, [[expected, fish], [altId, setFor(fish, altId)]], `${fish} compare`);
    await loaded('#quick-compare-content img');
    await page.locator('#quick-compare-dialog .quick-compare-actions [data-action="close-dialog"]').click();

    await page.locator('.result-focus .result-image').click();
    await page.locator(`#detail-dialog [data-fish-gallery="${fish}"]`).waitFor();
    const srcs = await page.locator(`#detail-dialog [data-fish-gallery="${fish}"] img`).evaluateAll(list => list.map(img => img.getAttribute('src')));
    assert.deepEqual(srcs, gallery.map(expectedUrl), `${fish} gallery`);
    await loaded('#detail-dialog img');
    await page.locator('#detail-dialog .dialog-close').click();
    const fresh = gallery.filter(id => SPLIT_CROPS[id]).length;
    checks.push(`${label}: 12/12 ${fish} symptom pictures; hero, could-also (${alts.map(a => `${a[0]}=${a[1]}`).join(', ')}), compare, ${gallery.length}-picture gallery (${fresh} new, ${gallery.length - fresh} re-used)`);
  }

  // A split group with no picture for a result falls back to the generic one.
  await toResult('fresh', 'pleco', 'patch', { closer: 'pits' });
  assert.equal(await page.locator('.result-focus').getAttribute('data-result'), 'hole-in-head');
  assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), 'generic');
  await loaded('#results-content img');
  checks.push('pleco hole-in-the-head (no pleco picture) falls back to the generic picture');

  // Saltwater: the new fish types show their own sets; no fish chosen stays generic.
  for (const fish of ['goby', 'dottyback', 'wrasse']) {
    await toSigns('marine', fish);
    const sets = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => img.dataset.imageSet));
    assert.ok(sets.length === 12 && sets.every(s => s === fish), `${fish}: ${sets.join()}`);
    assert.match(await page.locator('#signs-note').innerText(), /AI pictures of /);
  }
  await toResult('marine', 'goby', 'breathing');
  assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), 'goby');
  await loaded('#results-content img');
  await toSigns('marine', '');
  const generic = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => img.dataset.imageSet));
  assert.ok(generic.length && generic.every(s => s === 'generic'), generic.join());
  checks.push('saltwater goby/dottyback/wrasse: their own symptom pictures and a goby result picture; Not sure stays generic');
} finally {
  await browser.close();
}
assert.deepEqual(errors, []); assert.deepEqual(broken, []);
// Only unpublished crops (split or saltwater) may come from local-images/.
const allowedLocal = [...(SPLIT_IMAGE_SOURCE === 'local' ? Object.values(SPLIT_CROPS) : []), ...(MARINE_IMAGE_SOURCE === 'local' ? Object.values(MARINE_CROPS) : [])].map(e => `/local-images/${e.key.slice('experiments/fish-health-lab/'.length)}`);
for (const url of localRequests) assert.ok(allowedLocal.some(p => url.endsWith(p)), `unexpected local request ${url}`);

if (process.env.FISH_LAB_SHOTS) {
  const dir = await mkdtemp(`${tmpdir()}/fhl-split-shots-`);
  const save = async (list, prefix) => Promise.all(list.map(async (png, i) => { const f = `${dir}/${prefix}${i}.png`; await writeFile(f, png); return f; }));
  const stitch = (out, labels, files) => execFileSync('python3', ['-c', `import sys, json
from PIL import Image, ImageDraw
labels=json.loads(sys.argv[2]); ims=[Image.open(f).convert('RGB') for f in sys.argv[3:]]
W=sum(i.width for i in ims)+12*(len(ims)-1); H=max(i.height for i in ims)+28
o=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(o); x=0
for im,l in zip(ims,labels):
    d.text((x+6,8),l,fill='black'); o.paste(im,(x,28)); x+=im.width+12
o.save(sys.argv[1], **({'quality':86} if sys.argv[1].endswith('.jpg') else {}))`, out, JSON.stringify(labels), ...files]);
  stitch(`${process.env.FISH_LAB_SHOTS}/fish-type-grid.png`, ['freshwater fish types', 'saltwater fish types'], await save(gridShots, 'grid'));
  stitch(`${process.env.FISH_LAB_SHOTS}/results.jpg`, WALKS.map(w => w[0]), await save(shots, 'result'));
}
console.log(JSON.stringify({ url: root, splitImageSource: SPLIT_IMAGE_SOURCE, checks: checks.length, passed: checks, localPictureRequests: localRequests.size, shots: process.env.FISH_LAB_SHOTS || null }, null, 2));
