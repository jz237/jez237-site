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

// ── Second Astra review (11:35 EST): incomplete fixes. These check every view, not one message. ──
import { buildCase, readSalinity } from '../../experiments/fish-health-lab/logic.mjs';
import { readFileSync } from 'node:fs';
const appSource = readFileSync(new URL('../../experiments/fish-health-lab/app.mjs', import.meta.url), 'utf8');

test('R2-1: with columnaris, no ich/velvet plan says to raise the temperature — on the results, care page or notes', () => {
  for (const spots of ['dots', 'dust']) {
    const input = { water: 'fresh', primarySign: spots, signs: [spots, 'patch'], visualSigns: [spots, 'patch'] };
    const d = assessDiagnosis(input);
    for (const f of d.findings) assert.doesNotMatch([...f.plan.steps, f.plan.treatment].join(' '), /raise the temperature(?! while)|gradual heat/i, `${spots} ${f.id}`);
    const notes = buildCase(input);
    assert.doesNotMatch(notes.replace(/don’t raise (it|the temperature) while columnaris is active/gi, ''), /raise the temperature|gradual heat/i);
    assert.match(notes, /Notes from the guide:[\s\S]*Don’t raise the temperature while columnaris/);
  }
  // Without columnaris the heat step is still there.
  assert.match(assessDiagnosis({ water: 'fresh', primarySign: 'dots', signs: ['dots'] }).primary.plan.steps.join(' '), /Raise the temperature slowly/);
  assert.match(appSource, /Your care plan<\/h1>\$\{urgent\}\$\{notes\}/, 'the care page shows the guide notes');
});

test('R2-2: no unconditional detoxifier advice anywhere', () => {
  const checks = assessUrgency({ water: 'marine', ammonia: '0.5', signs: [] }).checks.join(' ');
  assert.match(checks, /check both labels/);
  assert.match(appSource, /detoxifier helps too—if you’re already medicating, check both labels/);
  assert.doesNotMatch(appSource, /and add an ammonia\/nitrite detoxifier\./);
});

test('R2-3: salinity reader handles SG and ppt, and flags what it can’t read', () => {
  const ppt = s => Math.round(readSalinity(s).ppt);
  assert.equal(ppt('1.025'), 33); assert.equal(ppt('SG 1.026'), 34); assert.equal(ppt('35 ppt'), 35);
  assert.ok(ppt('SG 1.060') > 70); assert.ok(ppt('1.050') > 60);
  assert.equal(readSalinity('90 ppt').unreadable, true); assert.equal(readSalinity('abc').unreadable, true); assert.equal(readSalinity(''), null);
  for (const s of ['SG 1.060', '1.050']) assert.match(assessUrgency({ water: 'marine', salinity: s, signs: [] }).urgent.join(), /dangerously high/, s);
  assert.match(assessUrgency({ water: 'marine', salinity: '0 ppt', signs: [] }).urgent.join(), /dangerously low/);
  assert.match(assessUrgency({ water: 'marine', salinity: '90 ppt', signs: [] }).checks.join(), /doesn’t look right/);
});

test('R2-4: extreme readings escalate to urgent; modest ones stay a check', () => {
  const extreme = assessUrgency({ water: 'marine', ph: '4', temperature: '105', tempUnit: 'F', signs: [] });
  assert.equal(extreme.urgent.length, 2); assert.match(extreme.checks.join(' '), /partial water change now/);
  const modest = assessUrgency({ water: 'fresh', ph: '8.8', temperature: '88', tempUnit: 'F', signs: [] });
  assert.equal(modest.urgent.length, 0); assert.equal(modest.checks.length, 2);
  assert.equal(assessUrgency({ water: 'fresh', temperature: '35', tempUnit: 'C', signs: [] }).urgent.length, 1);
});

test('R2-5: African cichlid swelling gets the Malawi bloat plan, not a constipation fast', () => {
  const d = assessDiagnosis({ water: 'fresh', fishType: 'african', primarySign: 'swollen', signs: ['swollen', 'appetite'], closer: 'flat' });
  assert.equal(d.primary.urgencyLevel, 'today');
  assert.match(d.primary.plan.steps.join(' '), /Malawi bloat[\s\S]*metronidazole/);
  assert.doesNotMatch(d.primary.plan.steps.join(' '), /Skip feeding for 1–2 days/);
  assert.match(d.primary.reason, /Malawi bloat/);
  assert.match(buildCase({ water: 'fresh', fishType: 'african', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }), /metronidazole/);
  // Other fish keep the ordinary bloat plan.
  assert.match(assessDiagnosis({ water: 'fresh', fishType: 'goldfish', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).primary.plan.steps[0], /Skip feeding/);
});

test('R2-6: corys and plecos: the answer, reason, urgent banner and notes use the no-scales wording', () => {
  for (const fishType of ['cory', 'pleco']) {
    const input = { water: 'fresh', fishType, primarySign: 'swollen', signs: ['swollen'], closer: 'pinecone' };
    const d = assessDiagnosis(input);
    assert.equal(d.primary.id, 'dropsy');
    assert.doesNotMatch(d.primary.reason + d.primary.matched.join(' '), /pine ?cone|scales (stick|sticking|raised)/i, fishType);
    assert.deepEqual(assessUrgency(input).urgent, ['Tight, all-over swelling (possible dropsy)']);
    assert.match(buildCase(input), /What I saw: Swollen tight all over/);
  }
});

test('R2-7: two plans that clash in order or place get a note (whole tank + hospital, fast + feed)', () => {
  const both = assessDiagnosis({ water: 'fresh', primarySign: 'dots', signs: ['dots', 'sores'], visualSigns: ['dots', 'sores'] });
  assert.ok(both.messages.some(m => /treat it there for both problems/.test(m)));
  const fast = assessDiagnosis({ water: 'fresh', primarySign: 'patch', closer: 'pits', signs: ['patch', 'swollen'], visualSigns: ['patch', 'swollen'] });
  assert.ok(fast.messages.some(m => /fast first/.test(m)));
});
