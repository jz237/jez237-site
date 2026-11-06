// Regression checks for the second-model review (Astra, Nov 6 2026 11:11 EST) fixed at 11:15.
import test from 'node:test';
import assert from 'node:assert/strict';
import { assessDiagnosis, assessUrgency, salinityPpt } from '../../experiments/fish-health-lab/logic.mjs';
import { assessReef } from '../../experiments/fish-health-lab/reef-logic.mjs';
import { carePlanFor } from '../../experiments/fish-health-lab/treatments.mjs';
import { reefPlanFor } from '../../experiments/fish-health-lab/reef-care.mjs';
import { checkMedicine, headline, MEDICINES } from '../../experiments/fish-health-lab/medicine.mjs';
import { CLOSER_QUESTIONS } from '../../experiments/fish-health-lab/data.mjs';
import { PREVENT_SECTIONS } from '../../experiments/fish-health-lab/prevent.mjs';

test('1: ich/velvet + columnaris: columnaris leads and the temperature conflict is called out', () => {
  for (const spots of ['dots', 'dust']) {
    const d = assessDiagnosis({ water: 'fresh', primarySign: spots, signs: [spots, 'patch'], visualSigns: [spots, 'patch'] });
    assert.equal(d.findings[0].id, 'columnaris');
    assert.ok(d.messages.some(m => /Don’t raise the temperature while columnaris/.test(m)), spots);
  }
});

test('2: the detoxifier step only applies when ammonia or nitrite shows, and warns about mixing with medicine', () => {
  const step = carePlanFor('water', 'marine').steps.find(s => /detoxifier/.test(s));
  assert.match(step, /^If ammonia or nitrite reads above zero/);
  assert.match(step, /check the medicine label/);
});

test('3: no blanket half-dose advice in the medicine check', () => {
  for (const m of MEDICINES) for (const water of ['fresh', 'marine', 'pond']) for (const [, reason] of Object.values(m[water] || {})) assert.doesNotMatch(reason.replace('Don’t guess a half dose.', ''), /half (the )?dose|use half|lower dose\./i, `${m.id} ${water}`);
});

test('4: pH, temperature and salinity readings produce warnings', () => {
  const bad = assessUrgency({ water: 'marine', ph: '4', temperature: '105', tempUnit: 'F', salinity: '60 ppt', signs: [] }).checks.join(' ');
  assert.match(bad, /pH 4/); assert.match(bad, /105 °F/); assert.match(bad, /Salinity looks high/);
  assert.deepEqual(assessUrgency({ water: 'marine', ph: '8.2', temperature: '78', tempUnit: 'F', salinity: '1.025', signs: [] }).checks, []);
  assert.deepEqual(assessUrgency({ water: 'fresh', ph: '7.2', temperature: '25', tempUnit: 'C', signs: [] }).checks, []);
  assert.match(assessUrgency({ water: 'fresh', ph: '9.4', signs: [] }).checks.join(), /pH 9.4/);
  assert.equal(Math.round(salinityPpt('SG 1.025')), 33);
});

test('5: active coral flesh loss is never "treat this week", whatever the cause', () => {
  for (const changes of [[], ['alk', 'dosing'], ['temp']]) for (const sign of ['peeling', 'brown-jelly'])
    assert.equal(assessReef({ group: 'coral', kind: 'sps', sign, changes }).primary.urgencyLevel, 'today', `${sign} ${changes}`);
});

test('6: a "normal" answer never leads when a picked change points at a real problem', () => {
  assert.equal(assessReef({ group: 'pond', kind: 'koi', sign: 'lethargic', changes: ['cold'] }).primary.id, 'winter-rest');
  for (const extra of ['pump', 'top-up', 'new-fish', 'predator', 'heat']) assert.notEqual(assessReef({ group: 'pond', kind: 'koi', sign: 'lethargic', changes: ['cold', extra] }).primary.id, 'winter-rest', extra);
});

test('7: copper for corys/loaches/plecos says not at all, not "use a hospital tank"', () => {
  const h = headline(checkMedicine({ medicine: 'copper', water: 'fresh', residents: ['scaleless'] }));
  assert.match(h, /not even in a hospital tank/); assert.doesNotMatch(h, /Use a hospital tank\./);
});

test('8–9: fungus plan keeps methylene blue out of the display; marine summaries drop Epsom salt', () => {
  assert.match(carePlanFor('water-mold', 'fresh').steps.join(' '), /Methylene blue only in a hospital tank/);
  for (const id of ['dropsy', 'popeye']) assert.doesNotMatch(carePlanFor(id, 'marine').treatment, /Epsom/, id);
});

test('10: African cichlid swelling acts today; corys and plecos get a no-scales wording', () => {
  assert.equal(assessDiagnosis({ water: 'fresh', fishType: 'african', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).primary.urgencyLevel, 'today');
  assert.ok(CLOSER_QUESTIONS.swollen.catfishTitle && CLOSER_QUESTIONS.swollen.choices.find(c => c.id === 'pinecone').catfishTitle);
});

test('11–12: saltwater acclimation mentions salinity; zoa plans mention palytoxin protection', () => {
  const float = PREVENT_SECTIONS.flatMap(s => s.cards).find(c => c.image === 'float-bag');
  assert.match(float.text, /salinity/);
  assert.match(reefPlanFor('zoa-pests').steps.map(s => s.text).join(' '), /gloves and eye protection.*palytoxin/);
});

test('ich now starts today; Uronema plan no longer suggests lowering salinity', () => {
  assert.equal(assessDiagnosis({ water: 'fresh', primarySign: 'dots', signs: ['dots'] }).primary.urgencyLevel, 'today');
  assert.match(carePlanFor('uronema', 'marine').steps.join(' '), /Don’t lower the salinity/);
});
