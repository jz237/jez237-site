// Freshwater picture sets (goldfish, tetra/rasbora, livebearer, cichlid, catfish):
// for each fish, the symptom grid is 12/12 that fish, and one result walks the hero,
// could-also thumbnails, the compare view and the detail gallery. Results a fish has
// no picture for must fall back to the generic picture. No broken images, no page errors.
// FISH_LAB_URL picks the target (default: the local preview). With the freshwater
// IMAGE_SOURCE 'local', the group pictures come from untracked local-images/<group>/.
// FISH_LAB_SHOTS=<file.png> also saves a 390 px strip of the five result screens.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8770/experiments/fish-health-lab/';
const { IMAGE_SOURCE: FRESH_IMAGE_SOURCE } = await import('../../experiments/fish-health-lab/fish-images-fresh-data.mjs');
const { FISH_SETS } = await import('../../experiments/fish-health-lab/fish-images.mjs');
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const errors = [], broken = [], checks = [], shots = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
const groupRequests = new Set();
context.on('request', r => { const m = r.url().match(/\/(goldfish|community|livebearer|cichlid|catfish)\/\1-[\w-]+-[0-9a-f]{12}\.jpg$/); if (m) groupRequests.add(r.url()); });
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
  await page.locator('input[name="water"][value="fresh"]').check(); await next();
  await page.locator(`input[name="fishType"][value="${fish}"]`).check(); await next();
};
const toResult = async (fish, sign, { texture, closer } = {}) => {
  await toSigns(fish);
  await page.locator(`[data-symptom="${sign}"]`).click(); await next();
  if (texture) { await page.locator(`[data-texture="${texture}"]`).click(); await next(); }
  if (closer) { await page.locator(`input[name="closer"][value="${closer}"]`).check(); await next(); }
  await next();
  await page.locator('#results-title').waitFor();
};
// Expected image set for a condition: the fish's own when the set maps it, otherwise generic.
const setFor = (fish, id) => FISH_SETS[fish].conditions[id] ? fish : 'generic';

// One result per fish, each chosen to show that fish's key picture.
const WALKS = [
  ['goldfish', 'balance', {}, 'swim-bladder', 3, 'goldfish swim bladder (upside down, head-down, stuck on the bottom)'],
  ['community', 'dots', { texture: 'dots' }, 'ich-fresh', 2, 'tetra ich (one fish + a school)'],
  ['livebearer', 'patch', { closer: 'flat' }, 'columnaris', 2, 'livebearer columnaris saddleback + cotton-mouth'],
  ['cichlid', 'patch', { closer: 'pits' }, 'hole-in-head', 1, 'cichlid hole-in-the-head (oscar)'],
  ['catfish', 'fins', {}, 'fin-rot', 2, 'catfish fin rot + worn barbels'],
];
try {
  for (const [fish, sign, opts, expected, galleryCount, label] of WALKS) {
    // Symptom grid: all twelve pictures are this fish.
    await toSigns(fish);
    const sets = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => img.dataset.imageSet));
    assert.equal(sets.length, 12); assert.ok(sets.every(s => s === fish), `${fish}: ${sets.join()}`);
    await loaded('#symptom-grid img');
    assert.match(await page.locator('#signs-note').innerText(), /AI pictures of /);
    if (FRESH_IMAGE_SOURCE === 'local') {
      const srcs = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => img.getAttribute('src')));
      assert.ok(srcs.every(src => src.startsWith(`local-images/${fish}/${fish}-`)), srcs.join());
    }

    // Result: hero, could-also thumbnails, compare view, detail gallery, step pictures.
    await toResult(fish, sign, opts);
    assert.equal(await page.locator('.result-focus').getAttribute('data-result'), expected, `${fish} result`);
    assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), fish);
    const alts = await page.locator('.could-also .alternative').evaluateAll(list => list.map(el => [el.dataset.alternative, el.querySelector('img').dataset.imageSet]));
    assert.ok(alts.length, `${fish}: no could-also cards`);
    for (const [id, set] of alts) assert.equal(set, setFor(fish, id), `${fish} could-also ${id}`);
    const steps = await page.locator('.result-focus .todo-steps li').count();
    assert.equal(await page.locator('.result-focus .todo-steps li .step-pic').count(), steps);
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
    assert.equal(await page.locator(`#detail-dialog [data-fish-gallery="${fish}"] img`).count(), galleryCount, `${fish} gallery`);
    await loaded('#detail-dialog img');
    await page.locator('#detail-dialog .dialog-close').click();
    checks.push(`${label}: 12/12 ${fish} symptom pictures; ${fish} hero, could-also (${alts.map(a => `${a[0]}=${a[1]}`).join(', ')}), compare, ${galleryCount}-picture gallery, step pictures`);
  }

  // A result the fish has no picture for falls back to the generic one.
  await toResult('catfish', 'patch', { closer: 'pits' });
  assert.equal(await page.locator('.result-focus').getAttribute('data-result'), 'hole-in-head');
  assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), 'generic');
  assert.equal(await page.locator('#detail-dialog [data-fish-gallery]').count(), 0);
  await loaded('#results-content img');
  checks.push('catfish hole-in-the-head (no catfish picture) falls back to the generic picture');
} finally {
  await browser.close();
}
assert.deepEqual(errors, []); assert.deepEqual(broken, []);
if (shots.length) {
  // Stitch the five 390 px result screens side by side with Pillow (ImageMagick-free).
  const { writeFile } = await import('node:fs/promises');
  const { execFileSync } = await import('node:child_process');
  const dir = await mkdtemp(`${tmpdir()}/fhl-shots-`);
  const files = [];
  for (const [i, png] of shots.entries()) { const f = `${dir}/${i}.png`; await writeFile(f, png); files.push(f); }
  execFileSync('python3', ['-c', `import sys
from PIL import Image, ImageDraw
ims=[Image.open(f).convert('RGB') for f in sys.argv[2:]]
labels=${JSON.stringify(WALKS.map(w => w[0]))}
W=sum(i.width for i in ims)+8*(len(ims)-1); H=max(i.height for i in ims)+28
out=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(out); x=0
for im,l in zip(ims,labels):
    d.text((x+6,8),l,fill='black'); out.paste(im,(x,28)); x+=im.width+8
out.save(sys.argv[1], quality=88)`, process.env.FISH_LAB_SHOTS, ...files]);
}
console.log(JSON.stringify({ url: root, freshImageSource: FRESH_IMAGE_SOURCE, checks: checks.length, passed: checks, groupPictureRequests: groupRequests.size, shots: process.env.FISH_LAB_SHOTS || null }, null, 2));
