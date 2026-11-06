// Reef section browser check: What needs help → coral / anemone / shrimp flows,
// the fish flow through the new Fish tile, the reef library filter and 390 px
// layout. Run against a LOCAL server (the live site injects analytics):
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
// No pictures in the reef section yet: every picture spot is a placeholder.
const reefImages = p => p.locator('#check img:visible, #detail-dialog[open] img, #quick-compare-dialog[open] img').count();
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

    // 4. Shrimp → stuck molt → failed molt, with the copper warning.
    await reefFlow(p, 'invert', 'shrimp', 'molt-stuck', ['swing']);
    assert.match(await title(p), /Failed molt/);
    assert.equal(await p.locator('.invert-warning').isVisible(), true);
    assert.match(await p.locator('.invert-warning').innerText(), /Copper and most fish medicines kill shrimp, crabs and snails/);
    assert.match(await p.locator('.reef-result .diagnosis-reason').innerText(), /salinity or temp swing/i);
    assert.match(await p.locator('.reef-todo li').first().innerText(), /^Test salinity, temperature, ammonia/);
    assert.equal(await reefImages(p), 0);
    await noOverflow(p); await shot(p, '6-invert-result-failed-molt');
    record('shrimp → stuck in its molt (+ salinity swing) → failed molt, with the copper warning');

    // 5. Not sure + changes re-weight: new coral + white → light shock.
    await reefFlow(p, 'coral', null, 'bleach', ['new-coral']);
    assert.match(await title(p), /light shock/i);
    await reefFlow(p, 'invert', 'snail', 'not-moving');
    assert.match(await title(p), /Snail stuck upside down/);
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
    assert.equal(await p.locator('#library-grid img').count(), 0);
    await p.locator('#library-search').fill('molt');
    assert.ok(await p.locator('#library-grid [data-reef-entry="failed-molt"]').count() === 1);
    await p.locator('#library-grid .card-image[data-reef-condition="failed-molt"]').click();
    assert.match(await p.locator('#detail-content').innerText(), /Copper and most fish medicines kill/);
    await p.keyboard.press('Escape');
    await p.locator('#library-search').fill('');
    await p.locator('#library-water').selectOption('fresh');
    assert.equal(await p.locator('#library-grid [data-reef-entry]').count(), 0);
    assert.ok(await p.locator('#library-grid .condition-card').count() > 10);
    record('old #ich/#library links still work; the library has a Reef & inverts filter with placeholder cards and details');

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
