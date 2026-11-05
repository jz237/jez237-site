import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treatmentGuideFor, openTreatmentPopup, carePlanFor, PLAN_IDS } from '../../experiments/fish-health-lab/treatments.mjs';
import { CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';

const REEF_HARMFUL = /copper|formalin|chloroquine|praziquantel|antibacterial|antibiotic|metronidazole|flatworm medication|ciliate medication/i;

test('Read-more links use verified Merck owner-guide sections', () => {
  for (const [id, water, hash] of [['ich-fresh', 'fresh', '#v3226751'], ['velvet-fresh', 'fresh', '#v3226757'], ['water-mold', 'fresh', '#v3226818'], ['columnaris', 'fresh', '#v3226736'], ['brooklynella', 'marine', '#v3226771'], ['uronema', 'marine', '#v3226774'], ['flukes', 'fresh', '#v3226787'], ['water', 'marine', '#v3226628'], ['lymphocystis', 'marine', '#v3226746']]) {
    const url = new URL(treatmentGuideFor(id, water).url);
    assert.equal(url.hostname, 'www.merckvetmanual.com');
    assert.match(url.pathname, /all-other-pets\/fish/);
    assert.equal(url.hash, hash);
  }
});
test('freshwater-only and marine-only links stay in their own water', () => {
  for (const id of ['ich-fresh', 'velvet-fresh', 'water-mold', 'columnaris', 'hole-in-head']) {
    assert.equal(treatmentGuideFor(id, 'marine'), null);
    assert.equal(treatmentGuideFor(id, ''), null);
  }
  for (const id of ['ich-marine', 'velvet-marine', 'uronema', 'brooklynella', 'black-spot', 'hlle']) assert.equal(treatmentGuideFor(id, 'fresh'), null);
  assert.equal(treatmentGuideFor('unknown-id', 'fresh'), null);
});
test('every condition has a "What to do now" plan and a Read-more link in its water', () => {
  for (const c of CONDITIONS) {
    assert.ok(PLAN_IDS.includes(c.id), c.id);
    for (const water of c.scope === 'both' ? ['fresh', 'marine'] : [c.scope]) {
      const plan = carePlanFor(c.id, water);
      assert.ok(plan.steps.length >= 3 && plan.treatment && plan.recovery, `${c.id} ${water}`);
      if (c.id !== 'normal') assert.ok(treatmentGuideFor(c.id, water), `${c.id} ${water} link`);
      else assert.equal(treatmentGuideFor(c.id, water), null); // stable markings need no medicine link
    }
  }
});
test('plans name treatment types but never doses', () => {
  for (const id of PLAN_IDS) for (const water of ['fresh', 'marine']) {
    const plan = carePlanFor(id, water);
    const text = [...plan.steps, plan.treatment].join(' ');
    assert.doesNotMatch(text, /\b\d+(\.\d+)?\s*(mg|ml|mL|ppm|tsp|teaspoons?|tablespoons?|drops?|g\/L|mg\/L)\b/, `${id} ${water}`);
    assert.doesNotMatch(text, /microscop|wet mount|biopsy|culture/i);
    if (REEF_HARMFUL.test(text)) assert.equal(plan.medicated, true, `${id} ${water} medicated`);
  }
});
test('every saltwater plan using copper, formalin, praziquantel or antibiotics is flagged not reef-safe', () => {
  const marineIds = CONDITIONS.filter(c => c.scope !== 'fresh').map(c => c.id);
  assert.ok(marineIds.length >= 15);
  for (const id of marineIds) {
    const plan = carePlanFor(id, 'marine');
    const text = [...plan.steps, plan.treatment].join(' ');
    if (REEF_HARMFUL.test(text)) assert.equal(plan.reefUnsafe, true, id);
  }
  for (const id of ['ich-marine', 'velvet-marine', 'brooklynella', 'uronema', 'black-spot', 'flukes']) assert.equal(carePlanFor(id, 'marine').reefUnsafe, true, id);
  // Freshwater never shows the reef flag; diet/water-only plans don't either.
  for (const id of PLAN_IDS) assert.equal(carePlanFor(id, 'fresh').reefUnsafe, false, id);
  for (const id of ['hlle', 'lymphocystis', 'swim-bladder', 'water', 'injury']) assert.equal(carePlanFor(id, 'marine').reefUnsafe, false, id);
});
test('key treatment types match the hobbyist standard', () => {
  assert.match(carePlanFor('ich-fresh', 'fresh').steps.join(' '), /temperature slowly.*ich medication.*salt.*not corys/s);
  assert.match(carePlanFor('ich-marine', 'marine').treatment, /Copper or tank transfer/);
  assert.match(carePlanFor('velvet-marine', 'marine').treatment, /chloroquine/);
  assert.match(carePlanFor('brooklynella', 'marine').treatment, /Formalin/);
  assert.match(carePlanFor('flukes', 'fresh').treatment, /Praziquantel/);
  assert.match(carePlanFor('fin-rot', 'fresh').treatment, /Clean water.*antibacterial/);
  assert.match(carePlanFor('dropsy', 'fresh').steps.join(' '), /hard to cure/);
  assert.match(carePlanFor('swim-bladder', 'fresh').treatment, /Fast 1–2 days.*peas/);
  assert.match(carePlanFor('water', 'fresh').treatment, /detoxifier/);
  assert.match(carePlanFor('ich-marine', 'marine').steps.join(' '), /never medicate a reef|bare hospital tank/);
});
test('a direct click opens one detached popup to the static destination and preserves the source page', () => {
  let prevented = 0, opened = 0, destination = '';
  const popup = { opener: {}, document: { createElement: () => ({ click() { destination = this.href; assert.equal(this.rel, 'noopener noreferrer'); assert.equal(this.target, '_self'); } }), head: { append() {} }, body: { append() {} } } };
  const event = { button: 0, preventDefault() { prevented++; } };
  const link = { dataset: { treatment: 'ich-fresh', water: 'fresh' } };
  assert.equal(openTreatmentPopup(event, link, (url, target, features) => { opened++; assert.equal(url, 'about:blank'); assert.equal(target, '_blank'); assert.match(features, /popup/); return popup; }), true);
  assert.equal(opened, 1); assert.equal(prevented, 1); assert.equal(popup.opener, null);
  assert.equal(destination, treatmentGuideFor('ich-fresh', 'fresh').url);
});
test('blocked popup and modified clicks retain the normal target-blank anchor fallback', () => {
  const link = { dataset: { treatment: 'ich-fresh', water: 'fresh' } };
  const event = { button: 0, preventDefault() { throw Error('Native fallback must remain enabled'); } };
  assert.equal(openTreatmentPopup(event, link, () => null), false);
  assert.equal(openTreatmentPopup({ ...event, ctrlKey: true }, link, () => { throw Error('Must not open'); }), false);
  assert.equal(openTreatmentPopup({ ...event, button: 1 }, link, () => { throw Error('Must not open'); }), false);
});
