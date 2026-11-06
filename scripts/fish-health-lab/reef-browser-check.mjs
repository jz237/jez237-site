// Reef section browser check: What needs help → coral / anemone / shrimp flows,
// the fish flow through the new Fish tile, the reef library filter and 390 px
// layout. Shrimp/crab/snail spots show pictures (reef-images-inverts-data.mjs);
// coral and anemone spots still show "Picture coming soon". Run against a LOCAL server (the live site injects analytics):
//   FISH_LAB_URL=http://127.0.0.1:8771/experiments/fish-health-lab/ \
//   PLAYWRIGHT_MODULE=.../playwright-core/index.js node scripts/fish-health-lab/reef-browser-check.mjs
// FISH_LAB_SHOTS=<dir> saves the 390 px review screenshots.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const root = process.env.FISH_LAB_URL || 'http://127.0.0.1:8771/experiments/fish-health-lab/';
const shots = process.env.FISH_LAB_SHOTS || '';
if (shots) await mkdir(shots, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--disable-dev-shm-usage'] });
const checks = [], errors = [];
const record = label => checks.push(label);
const run = async (viewport, fn) => {
  const context = await browser.newContext({ viewport, deviceScaleFactor: viewport.width < 500 ? 2 : 1 });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text()); });
  try { await fn(page); } finally { await context.close(); }
};
const next = p => p.locator('#next-button').click();
const at = async (p, name) => {
  if (name === 'welcome') { assert.equal(await p.locator('#welcome').isVisible(), true, 'expected the front door'); return; }
  assert.equal(await p.locator(`[data-step="${name}"]`).isVisible(), true, `expected step ${name}`);
  assert.equal(await p.locator('.question-panel:visible').count(), 1);
};
const noOverflow = async p => assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'horizontal overflow');
const shot = async (p, name) => { if (shots) await p.screenshot({ path: `${shots}/${name}.png`, fullPage: true }); };
const home = async p => { await p.goto(root, { waitUntil: 'networkidle' }); await at(p, 'welcome'); };
// Coral spots are still placeholders; invert spots are pictures.
const reefImages = p => p.locator('#check img:visible, #detail-dialog[open] img, #quick-compare-dialog[open] img').count();
// Load every picture under `sel` (they are lazy) and return [crop id, natural width].
const loaded = (p, sel) => p.locator(sel).evaluateAll(async els => {
  for (const el of els) { el.loading = 'eager'; try { await el.decode(); } catch {} }
  return els.map(el => [el.dataset.reefImage, el.naturalWidth]);
});
const allLoaded = async (p, sel, n) => {
  const got = await loaded(p, sel);
  if (n !== undefined) assert.equal(got.length, n, `${sel}: ${got.length} pictures`);
  assert.ok(got.length > 0 && got.every(([id, w]) => id && w === 362), `${sel}: ${JSON.stringify(got)}`);
  return got.map(([id]) => id);
};
const hero = async p => (await allLoaded(p, '.reef-result .result-image img', 1))[0];
const reefFlow = async (p, group, kind, sign, changes = []) => {
  await home(p);
  await p.locator(`[data-reef-start="${group}"]`).click(); await at(p, 'reef-kind');
  if (kind !== null) await p.locator(`[data-reef-kind="${kind}"]`).click();
  await next(p); await at(p, 'reef-signs');
  await p.locator(`[data-reef-sign="${sign}"]`).click(); await next(p); await at(p, 'reef-changes');
  for (const c of changes) await p.locator(`[data-reef-change="${c}"]`).click();
  await next(p); await at(p, 'reef-results');
};
const title = p => p.locator('#reef-results-title').innerText();

try {
  await run({ width: 390, height: 844 }, async p => {
    // 1. Front door: What needs help? with three tiles; Fish is the existing Start.
    await home(p);
    assert.equal(await p.locator('#welcome').isVisible(), true);
    assert.match(await p.locator('#needs-help-title').innerText(), /what needs help\?/i);
    assert.deepEqual(await p.locator('.needs-help .help-tile strong').allInnerTexts(), ['Fish', 'Coral or anemone', 'Shrimp, crab or snail']);
    assert.equal(await p.locator('.needs-help [data-action="start"]').count(), 1);
    const tiles = await p.locator('.needs-help .help-tile').evaluateAll(els => els.map(el => el.getBoundingClientRect().bottom));
    assert.ok(tiles.every(b => b < 844), `tiles above the fold: ${tiles}`);
    assert.equal(await p.locator('img[src]').count(), 1, 'only the opening picture loads on the front door');
    await noOverflow(p); await shot(p, '1-what-needs-help');
    record('front door asks What needs help? with Fish, Coral or anemone, Shrimp/crab/snail tiles above the fold at 390 px');

    // 2. Coral → SPS → peeling → RTN, with compare + swap + back.
    await p.locator('[data-reef-start="coral"]').click(); await at(p, 'reef-kind');
    assert.match(await p.locator('#flow-label').innerText(), /STEP 1 OF 3/);
    assert.equal(await p.locator('#next-button').innerText(), 'Skip →');
    assert.deepEqual(await p.locator('[data-reef-kind]').evaluateAll(els => els.map(el => el.dataset.reefKind)), ['soft', 'lps', 'sps', 'anemone', '']);
    await noOverflow(p); await shot(p, '2-coral-kind');
    await p.locator('[data-reef-kind="sps"]').click();
    assert.equal(await p.locator('[data-reef-kind="sps"]').getAttribute('aria-pressed'), 'true');
    await next(p); await at(p, 'reef-signs');
    const spsSigns = await p.locator('[data-reef-sign]').evaluateAll(els => els.map(el => el.dataset.reefSign));
    assert.ok(spsSigns.includes('peeling') && spsSigns.includes('red-bugs') && !spsSigns.includes('zoa-melt') && !spsSigns.includes('anemone'), spsSigns.join());
    assert.equal(await p.locator('#reef-sign-grid .reef-ph').count(), spsSigns.length, 'every sign tile has a placeholder');
    assert.match(await p.locator('#reef-sign-grid').innerText(), /Picture coming soon/);
    await next(p); assert.match(await p.locator('#flow-error').innerText(), /closest picture/);
    await noOverflow(p); await shot(p, '3-coral-signs');
    await p.locator('[data-reef-sign="peeling"]').click(); await next(p); await at(p, 'reef-changes');
    assert.equal(await p.locator('#next-button').innerText(), 'See my results →');
    await next(p); await at(p, 'reef-results');
    assert.match(await title(p), /Most likely:\s*RTN/i);
    assert.equal(await p.locator('.reef-result').getAttribute('data-urgency'), 'today');
    assert.equal(await p.locator('.reef-result .urgency-badge').innerText(), 'Act today');
    assert.match(await p.locator('.reef-todo li').first().innerText(), /^Test alkalinity, calcium, magnesium, nitrate, phosphate, temperature and salinity/);
    assert.ok(await p.locator('.reef-todo [data-step-tag="dip"]').count() >= 1);
    assert.match(await p.locator('.reef-todo').innerText(), /Separate dip — never in the display/);
    assert.equal(await p.locator('.invert-warning').count(), 0);
    const alts = await p.locator('[data-reef-alternative]').evaluateAll(els => els.map(el => el.dataset.reefAlternative));
    assert.ok(alts.length >= 1 && alts.length <= 3 && alts.includes('stn'), alts.join());
    assert.equal(await reefImages(p), 0, 'reef results use placeholders, not pictures');
    await noOverflow(p); await shot(p, '4-coral-result-sps-rtn');
    await p.locator('[data-reef-compare="stn"]').click();
    assert.equal(await p.locator('#quick-compare-dialog').isVisible(), true);
    assert.equal(await p.locator('#quick-compare-title').innerText(), 'Which looks more like yours?');
    assert.equal(await p.locator('#quick-compare-content .reef-ph').count(), 2);
    await noOverflow(p);
    await p.locator('#quick-compare-content [data-reef-choose="stn"]').click();
    assert.match(await title(p), /Most likely:\s*STN/i);
    assert.match(await p.locator('.result-hint').last().innerText(), /Your pick from the look-alikes/);
    assert.equal(await p.locator('[data-reef-alternative]').first().getAttribute('data-reef-alternative'), 'rtn');
    await p.locator('[data-reef-choose="rtn"]').click();
    assert.match(await title(p), /Most likely:\s*RTN/i);
    assert.match(await p.locator('#quick-compare-title').textContent(), /your fish/, 'the fish compare title is restored');
    record('coral → SPS → flesh peeling → RTN (Act today), tests first, dip tagged, ≤3 look-alikes, compare + swap and swap back');

    await p.locator('.reef-result [data-reef-condition]').first().click();
    assert.equal(await p.locator('#detail-dialog').isVisible(), true);
    assert.equal(await p.locator('#detail-content .reef-gallery .reef-ph').count(), 3);
    await noOverflow(p);
    await p.keyboard.press('Escape');
    await p.locator('[data-action="reef-edit"]').click(); await at(p, 'reef-kind');
    assert.equal(await p.locator('[data-reef-kind="sps"]').getAttribute('aria-pressed'), 'true');
    await p.locator('[data-action="back"]').click(); await at(p, 'welcome');
    record('reef detail shows 3 placeholder slots; Change my answers and Back walk back to the front door');

    // 3. Anemone → shrinking → anemone stress.
    await reefFlow(p, 'coral', 'anemone', 'anemone');
    assert.match(await title(p), /Anemone stress/);
    await noOverflow(p); await shot(p, '5-anemone-result');
    record('coral → anemone → shrinking/wandering → anemone stress');

    // 4. Shrimp/crab/snail: picture tiles (kinds, signs), then shrimp → stuck molt → failed molt.
    await home(p);
    await p.locator('[data-reef-start="invert"]').click(); await at(p, 'reef-kind');
    assert.deepEqual(await allLoaded(p, '#reef-kind-grid img', 4), ['kind-shrimp', 'kind-crab', 'kind-snail', 'kind-other']);
    assert.equal(await p.locator('#reef-kind-grid [data-reef-kind=""] .reef-ph').count(), 1, 'Not sure keeps its icon');
    await noOverflow(p); await shot(p, '6a-invert-kind');
    await next(p); await at(p, 'reef-signs');
    const allSigns = await allLoaded(p, '#reef-sign-grid img', 10);
    assert.equal(await p.locator('#reef-sign-grid .reef-ph').count(), 0, 'no placeholders on invert sign tiles');
    assert.equal(new Set(allSigns).size, 10);
    await noOverflow(p); await shot(p, '6b-invert-signs-not-sure');
    for (const [kind, expect] of [['shrimp', { 'molt-stuck': 'sign-molt-stuck', legs: 'sign-shrimp-legs', bulge: 'sign-bulge' }], ['crab', { 'molt-stuck': 'sign-crab-molt-stuck', 'empty-shell': 'sign-crab-empty-shell', 'not-moving': 'sign-crab-not-moving' }], ['snail', { 'not-moving': 'sign-not-moving', unclear: 'sign-snail-unclear' }], ['other', { spines: 'sign-spines', 'not-moving': 'sign-other-not-moving' }]]) {
      await p.locator('[data-action="back"]').click(); await at(p, 'reef-kind');
      await p.locator(`[data-reef-kind="${kind}"]`).click(); await next(p); await at(p, 'reef-signs');
      const n = await p.locator('#reef-sign-grid [data-reef-sign]').count();
      const ids = await allLoaded(p, '#reef-sign-grid img', n);
      for (const [sign, id] of Object.entries(expect)) assert.equal(await p.locator(`[data-reef-sign="${sign}"] img`).getAttribute('data-reef-image'), id, `${kind}/${sign}`);
      assert.equal(new Set(ids).size, n, `${kind}: every tile its own picture`);
    }
    record('invert kind tiles (4 pictures + Not sure icon) and sign tiles: 10/10 pictures for Not sure, kind-specific tiles for shrimp, crab, snail and other');

    await reefFlow(p, 'invert', 'shrimp', 'molt-stuck', ['swing']);
    assert.match(await title(p), /Failed molt/);
    assert.equal(await p.locator('.invert-warning').isVisible(), true);
    assert.match(await p.locator('.invert-warning').innerText(), /Copper and most fish medicines kill shrimp, crabs and snails/);
    assert.match(await p.locator('.reef-result .diagnosis-reason').innerText(), /salinity or temp swing/i);
    assert.match(await p.locator('.reef-todo li').first().innerText(), /^Test salinity, temperature, ammonia/);
    assert.equal(await hero(p), 'cond-failed-molt');
    const altPics = await allLoaded(p, '[data-reef-alternative] .alt-pick img', await p.locator('[data-reef-alternative]').count());
    assert.ok(altPics.includes('cond-normal-molt'), altPics.join());
    assert.equal(await p.locator('#reef-results-content .reef-ph').count(), 0);
    await noOverflow(p); await shot(p, '6-invert-result-failed-molt');
    await p.locator('[data-reef-compare="normal-molt"]').click();
    assert.deepEqual(await allLoaded(p, '#quick-compare-content img', 2), ['cond-failed-molt', 'cond-normal-molt']);
    await noOverflow(p); await shot(p, '6c-invert-compare');
    await p.locator('#quick-compare-content [data-reef-choose="normal-molt"]').click();
    assert.match(await title(p), /Normal molt/);
    assert.equal(await hero(p), 'cond-normal-molt');
    assert.equal(await p.locator('.invert-warning').isVisible(), true);
    await p.locator('.reef-result [data-reef-condition]').first().click();
    assert.deepEqual(await allLoaded(p, '#detail-content .reef-gallery img'), ['cond-normal-molt', 'cond-crab-normal-molt', 'sign-empty-shell']);
    assert.match(await p.locator('#detail-content').innerText(), /Copper and most fish medicines kill/);
    await noOverflow(p); await p.keyboard.press('Escape');
    record('shrimp → stuck in its molt (+ salinity swing) → failed molt with its picture, could-also pictures, compare (2 pictures), swap to normal molt, detail gallery; copper warning throughout');

    // 4b. More invert results: each hero is the right picture and the copper warning stays.
    for (const [kind, sign, changes, re, id, name] of [
      ['shrimp', 'bulge', [], /Bopyrid isopod/, 'cond-bopyrid', '7-invert-result-isopod'],
      ['shrimp', 'empty-shell', [], /Normal molt/, 'cond-normal-molt', '8-invert-result-normal-molt'],
      ['crab', 'molt-stuck', [], /Failed molt/, 'cond-crab-failed-molt', '9-invert-result-crab-molt'],
      ['', 'deaths', ['medicine'], /Copper or medicine poisoning/, 'cond-copper', '10-invert-result-copper'],
      ['crab', 'legs', [], /Fighting or injury/, 'cond-invert-injury', ''],
      ['shrimp', 'pale', ['new-arrival'], /Acclimation shock/, 'cond-acclimation', ''],
      ['snail', 'unclear', [], /Not enough food/, 'cond-snail-starvation', ''],
    ]) {
      await reefFlow(p, 'invert', kind, sign, changes);
      assert.match(await title(p), re, `${kind}/${sign}`);
      assert.equal(await hero(p), id, `${kind}/${sign}`);
      assert.equal(await p.locator('.invert-warning').isVisible(), true, `${kind}/${sign} copper warning`);
      assert.equal(await p.locator('#reef-results-content .reef-ph').count(), 0, `${kind}/${sign}: no placeholders`);
      const n = await p.locator('[data-reef-alternative]').count();
      if (n) await allLoaded(p, '[data-reef-alternative] .alt-pick img', n);
      await noOverflow(p); if (name) await shot(p, name);
    }
    record('bopyrid, normal molt, crab failed molt, copper, hermit fighting, acclimation and snail starvation results show their own pictures and the copper warning');

    // 5. Not sure + changes re-weight: new coral + white → light shock.
    await reefFlow(p, 'coral', null, 'bleach', ['new-coral']);
    assert.match(await title(p), /light shock/i);
    assert.equal(await reefImages(p), 0, 'coral results still use placeholders');
    await reefFlow(p, 'invert', 'snail', 'not-moving');
    assert.match(await title(p), /Snail stuck upside down/);
    assert.equal(await hero(p), 'cond-flipped');
    assert.equal(await p.locator('.invert-warning').isVisible(), true);
    record('Not sure kind and recent-change chips re-weight (new coral + white = light shock); snail not moving = flip it');

    // 6. Fish flow is unchanged through the Fish tile.
    await home(p);
    await p.locator('[data-action="start"]:visible').click(); await at(p, 'water');
    assert.match(await p.locator('#flow-label').innerText(), /STEP 1 OF 4/);
    await p.locator('input[name="water"][value="fresh"]').check(); await next(p); await at(p, 'fish');
    await next(p); await at(p, 'signs');
    await p.locator('[data-symptom="fins"]').click(); await next(p); await at(p, 'behavior');
    await next(p); await at(p, 'results');
    assert.match(await p.locator('#results-title').innerText(), /Most likely:/i);
    assert.equal(await p.locator('#reef-results-content').innerText(), '');
    await noOverflow(p);
    await p.locator('[data-action="reset"]:visible').first().click(); await at(p, 'welcome');
    record('Fish tile opens the existing fish check unchanged (water → fish → sign → behavior → result)');
  });

  // 7. Old links and the library filter (desktop).
  await run({ width: 1365, height: 950 }, async p => {
    await p.goto(root + '#ich', { waitUntil: 'networkidle' });
    assert.equal(await p.locator('#welcome').isVisible(), true);
    await p.goto('about:blank');
    await p.goto(root + '#library', { waitUntil: 'networkidle' });
    assert.equal(await p.locator('#library-view').isVisible(), true);
    assert.equal(await p.locator('#library-grid [data-reef-entry]').count(), 0, 'reef entries only under their own filter');
    await p.locator('#library-water').selectOption('reef');
    const n = await p.locator('#library-grid [data-reef-entry]').count();
    assert.ok(n >= 22, `${n} reef entries`);
    assert.match(await p.locator('#library-count').innerText(), /reef & invert entries/);
    const invertEntries = await p.locator('#library-grid [data-reef-entry]').evaluateAll(els => els.filter(el => el.querySelector('img')).map(el => el.dataset.reefEntry));
    assert.deepEqual(invertEntries.sort(), ['acclimation', 'bopyrid', 'copper', 'failed-molt', 'flipped', 'invert-injury', 'invert-water', 'normal-molt', 'starvation']);
    await allLoaded(p, '#library-grid img', 9);
    assert.equal(await p.locator('#library-grid [data-reef-entry] .reef-ph').count(), n - 9, 'coral cards keep placeholders');
    assert.match(await p.locator('[data-reef-entry="failed-molt"] .slot-count').innerText(), /^3 \/ 3 pictures/);
    assert.match(await p.locator('[data-reef-entry="rtn"] .slot-count').innerText(), /^0 \/ 3 pictures/);
    await p.locator('#library-search').fill('molt');
    assert.ok(await p.locator('#library-grid [data-reef-entry="failed-molt"]').count() === 1);
    await p.locator('#library-grid .card-image[data-reef-condition="failed-molt"]').click();
    assert.match(await p.locator('#detail-content').innerText(), /Copper and most fish medicines kill/);
    assert.deepEqual(await allLoaded(p, '#detail-content .reef-gallery img'), ['cond-failed-molt', 'cond-crab-failed-molt', 'sign-molt-stuck']);
    await p.keyboard.press('Escape');
    await p.locator('#library-search').fill('');
    await p.locator('#library-water').selectOption('fresh');
    assert.equal(await p.locator('#library-grid [data-reef-entry]').count(), 0);
    assert.ok(await p.locator('#library-grid .condition-card').count() > 10);
    record('old #ich/#library links still work; the library has a Reef & inverts filter: 9 invert cards with pictures (detail gallery filled), coral cards with placeholders');

    // From a reef result, "See all reef entries" opens the reef filter.
    await reefFlow(p, 'coral', 'soft', 'zoa-melt');
    assert.match(await title(p), /Zoa pox/);
    await p.locator('[data-action="reef-library"]').click();
    assert.equal(await p.locator('#library-water').inputValue(), 'reef');
    assert.ok(await p.locator('#library-grid [data-reef-entry]').count() >= 22);
    record('a reef result links to the Reef & inverts library');
  });
} finally { await browser.close(); }

assert.deepEqual(errors, []);
record('no script errors');
console.log(JSON.stringify({ url: root, checks: checks.length, passed: checks, screenshots: shots || null }, null, 2));
