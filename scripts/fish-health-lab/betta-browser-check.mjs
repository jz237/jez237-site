// Betta pilot: per-fish pictures across the flow, step pictures, fish-type photos,
// generic fallback for other fish, and no broken image references.
// FISH_LAB_URL picks the target: the local preview (default) or the live page
// (FISH_LAB_URL=https://jez237.com/experiments/fish-health-lab/). With the published
// IMAGE_SOURCE 'media', any local-images/ request counts as broken.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8770/experiments/fish-health-lab/';
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const errors = [], broken = [], checks = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
const mediaRequests = new Set(), localRequests = [];
context.on('request', r => { if (r.url().includes('/local-images/')) localRequests.push(r.url()); if (r.url().startsWith('https://media.jez237.com/')) mediaRequests.add(r.url()); });
context.on('response', r => { if ((r.url().includes('/local-images/') || r.url().startsWith('https://media.jez237.com/')) && r.status() >= 400) broken.push(`${r.status()} ${r.url()}`); });
context.on('requestfailed', r => { if (r.url().startsWith('https://media.jez237.com/')) broken.push(`failed ${r.url()}`); });
const { IMAGE_SOURCE } = await import('../../experiments/fish-health-lab/fish-images-data.mjs');
const page = await context.newPage();
const next = () => page.locator('#next-button').click();
const loaded = async selector => {
  const imgs = page.locator(selector);
  // Lazy pictures (offscreen or inside closed <details>) are forced to load so every reference is checked.
  await imgs.evaluateAll(list => Promise.all(list.map(img => {
    if (img.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src;
    img.loading = 'eager';
    return img.decode().catch(() => {});
  })));
  const bad = await imgs.evaluateAll(list => list.filter(img => !img.naturalWidth).map(img => img.currentSrc || img.src || img.dataset.src));
  assert.deepEqual(bad, [], `broken images in ${selector}`);
};
const toSigns = async (water, fish) => {
  await page.goto(root, { waitUntil: 'networkidle' });
  await page.locator('[data-action="start"]:visible').click();
  await page.locator(`input[name="water"][value="${water}"]`).check(); await next();
  if (fish) await page.locator(`input[name="fishType"][value="${fish}"]`).check();
  await next();
};
const toResult = async (water, fish, sign, { texture, closer } = {}) => {
  await toSigns(water, fish);
  await page.locator(`[data-symptom="${sign}"]`).click(); await next();
  if (texture) { await page.locator(`[data-texture="${texture}"]`).click(); await next(); }
  if (closer) { await page.locator(`input[name="closer"][value="${closer}"]`).check(); await next(); }
  await next();
  await page.locator('#results-title').waitFor();
};
try {
  // Fish-type step: a picture for every choice, both waters.
  for (const [water, count] of [['fresh', 7], ['marine', 6]]) {
    await page.goto(root, { waitUntil: 'networkidle' });
    await page.locator('[data-action="start"]:visible').click();
    await page.locator(`input[name="water"][value="${water}"]`).check(); await next();
    assert.equal(await page.locator('.fish-chip img.fish-photo').count(), count);
    await loaded('.fish-chip img.fish-photo');
  }
  checks.push('fish-type step shows a photo for every fish (fresh 7, marine 6)');

  // Betta: the whole symptom grid is betta pictures.
  await toSigns('fresh', 'betta');
  const sets = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => img.dataset.imageSet));
  assert.equal(sets.length, 12); assert.ok(sets.every(s => s === 'betta'), sets.join());
  await loaded('#symptom-grid img');
  assert.match(await page.locator('#signs-note').innerText(), /bettas/);
  checks.push('betta symptom grid: 12/12 betta pictures, all load');

  // Betta results: hero, could-also thumbnails, detail gallery, step pictures.
  for (const [sign, opts, expected] of [['fins', {}, 'fin-rot'], ['dust', {}, 'velvet-fresh'], ['dots', { texture: 'dots' }, 'ich-fresh'], ['swollen', {}, 'bloat'], ['eyes', { closer: 'cloudy' }, 'cloudy-eye'], ['patch', { closer: 'pits' }, 'hole-in-head']]) {
    await toResult('fresh', 'betta', sign, opts);
    assert.equal(await page.locator('.result-focus').getAttribute('data-result'), expected);
    assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), 'betta');
    const alt = await page.locator('.could-also img').evaluateAll(list => list.map(img => img.dataset.imageSet));
    assert.ok(alt.length && alt.every(s => s === 'betta'), `${expected} could-also: ${alt}`);
    const steps = await page.locator('.result-focus .todo-steps li').count();
    assert.equal(await page.locator('.result-focus .todo-steps li .step-pic').count(), steps);
    await loaded('#results-content img');
    await page.locator('.result-focus .result-image').click();
    await page.locator('#detail-dialog [data-fish-gallery="betta"]').waitFor();
    await loaded('#detail-dialog img');
    await page.locator('#detail-dialog .dialog-close').click();
  }
  checks.push('betta results (fin rot, velvet, ich, bloat, cloudy eye, hole-in-head): betta hero, betta could-also thumbnails, betta detail gallery, a step picture on every step');

  // Goldfish has no set yet: generic pictures, still step pictures.
  await toResult('fresh', 'goldfish', 'balance');
  assert.equal(await page.locator('.result-focus .result-image img').getAttribute('data-image-set'), 'generic');
  assert.match(await page.locator('.result-focus .result-image img').getAttribute('src'), /^https:\/\/media\.jez237\.com\//);
  assert.equal(await page.locator('#detail-dialog [data-fish-gallery]').count(), 0);
  assert.ok(await page.locator('.result-focus .todo-steps .step-pic').count() >= 3);
  checks.push('goldfish result falls back to the generic picture and still shows step pictures');

  // Changing the fish back to "Not sure" restores generic symptom pictures.
  await toSigns('fresh', 'betta');
  await page.locator('[data-action="back"]').click();
  await page.locator('input[name="fishType"][value=""]').check(); await next();
  const generic = await page.locator('#symptom-grid img').evaluateAll(list => list.map(img => img.dataset.imageSet));
  assert.ok(generic.every(s => s === 'generic'), generic.join());
  checks.push('switching the fish to Not sure restores the generic symptom pictures');
} finally {
  await browser.close();
}
assert.deepEqual(errors, []); assert.deepEqual(broken, []);
if (IMAGE_SOURCE === 'media') assert.deepEqual(localRequests, [], 'media mode must not request local-images/');
console.log(JSON.stringify({ url: root, imageSource: IMAGE_SOURCE, checks: checks.length, passed: checks, mediaRequests: mediaRequests.size, localRequests: localRequests.length }, null, 2));
