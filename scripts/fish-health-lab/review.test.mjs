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

// ── Independent reviewer (11:50 EST): 12 more. ──
import { assessReef as reefAssess } from '../../experiments/fish-health-lab/reef-logic.mjs';
test('R3-1: toxic ammonia/nitrite and saltwater temperatures escalate', () => {
  assert.equal(assessUrgency({ water: 'fresh', ammonia: '8', nitrite: '10', signs: [] }).urgent.length, 2);
  assert.equal(assessUrgency({ water: 'marine', temperature: '60', tempUnit: 'F', signs: [] }).urgent.length, 1);
  assert.equal(assessUrgency({ water: 'marine', temperature: '90', tempUnit: 'F', signs: [] }).urgent.length, 1);
});
test('R3-2/11: corys and plecos never get copper for velvet, and their dropsy/bloat text has no scales', () => {
  for (const fishType of ['cory', 'pleco']) {
    const v = assessDiagnosis({ water: 'fresh', fishType, primarySign: 'dust', signs: ['dust'] }).primary.plan;
    assert.doesNotMatch([...v.steps, v.treatment].join(' ').replace(/never copper|no copper/g, ''), /copper/i);
    const d = assessDiagnosis({ water: 'fresh', fishType, primarySign: 'swollen', signs: ['swollen', 'pinecone'], closer: 'pinecone' });
    assert.doesNotMatch([...d.primary.plan.steps, ...d.alternatives.map(a => a.comparisonReason)].join(' '), /scales (stick|lying)/i);
    assert.deepEqual(assessUrgency({ water: 'fresh', fishType, signs: ['swollen', 'pinecone'], closer: 'pinecone' }).urgent, ['Tight, all-over swelling (possible dropsy)']);
  }
});
test('R3-4/5: heat tips vanish under the columnaris conflict; goldfish get coldwater temperatures', () => {
  for (const fishType of ['goldfish', 'betta']) {
    const d = assessDiagnosis({ water: 'fresh', fishType, primarySign: 'dots', signs: ['dots', 'patch'], visualSigns: ['dots', 'patch'] });
    for (const f of d.findings) assert.doesNotMatch(f.tip || '', /heat|warm/i, `${fishType} ${f.id}`);
  }
  assert.equal(assessUrgency({ water: 'fresh', fishType: 'goldfish', temperature: '60', tempUnit: 'F', signs: [] }).checks.length, 0);
  const cold = assessUrgency({ water: 'fresh', fishType: 'goldfish', temperature: '52', tempUnit: 'F', signs: [] });
  assert.equal(cold.urgent.length, 0); assert.doesNotMatch(cold.checks.join(' '), /heater|tropical/);
  assert.match(assessUrgency({ water: 'fresh', temperature: '26', tempUnit: 'F', signs: [] }).checks.join(), /did you mean °C/);
});
test('R3-6/7: "died after dosing" leads with copper; no "may be normal" next to alarms', () => {
  for (const changes of [['new-arrival'], ['swing'], ['new-arrival', 'swing']]) assert.equal(reefAssess({ group: 'invert', kind: '', sign: 'deaths', changes }).primary.id, 'copper');
  for (const beh of ['deaths', 'gasping', 'several']) assert.equal(assessDiagnosis({ water: 'fresh', primarySign: 'dots', signs: ['dots', beh] }).naturalNote, '', beh);
  assert.equal(assessDiagnosis({ water: 'fresh', fishType: 'african', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).naturalNote, '');
  assert.doesNotMatch(assessDiagnosis({ water: 'fresh', fishType: 'goldfish', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).naturalNote, /livebearer/);
  for (const ch of ['heat', 'pump']) assert.equal(reefAssess({ group: 'pond', kind: 'koi', sign: 'lethargic', changes: [ch] }).naturalNote, '', ch);
});
test('R3-8: a salinity emergency says correct slowly, not a big water change', () => {
  const u = assessUrgency({ water: 'marine', salinity: '20', signs: [] });
  assert.match(u.action, /correct the salinity slowly/); assert.doesNotMatch(u.action, /do a water change now/);
});
test('R3-9/10: salt is "avoid" for scaleless fish; copper in a reef is hospital-only even with nothing ticked', () => {
  assert.equal(checkMedicine({ medicine: 'salt', water: 'fresh', residents: ['scaleless'] }).verdict, 'avoid');
  assert.equal(checkMedicine({ medicine: 'copper', water: 'marine' }).verdict, 'hospital');
  assert.equal(checkMedicine({ medicine: 'copper', water: 'marine', hospital: true }).verdict, 'ok');
  assert.doesNotMatch(checkMedicine({ medicine: 'antibiotics', water: 'pond' }).tip, /hospital tank|the display/);
});
test('R3-12: conductivity is not salinity; notes print readable answers; new-fish onset counts', () => {
  assert.equal(readSalinity('53 mS/cm').unreadable, true);
  const notes = buildCase({ water: 'fresh', primarySign: 'dots', signs: ['dots'], affected: 'unknown', onset: 'after-change', tankAge: 'new' });
  assert.match(notes, /Fish affected: Not sure/); assert.match(notes, /Onset \/ recent changes: Water change, chemical/); assert.match(notes, /Tank established: New/);
  // A new fish is a note on the result, not a water problem.
  assert.ok(assessDiagnosis({ water: 'fresh', primarySign: 'lumps', growthAppearance: 'smooth', signs: ['lumps'], onset: 'new-fish' }).messages.some(m => /new fish or shared equipment/.test(m)));
  assert.equal(assessUrgency({ water: 'fresh', onset: 'new-fish', signs: [] }).checks.length, 0);
});

// ── Reviewer re-check (12:05 EST): leftovers and side effects of the fixes. ──
test('R4: copper is hospital-only in tanks and ponds; avoid stays avoid in a hospital tank', () => {
  for (const water of ['fresh', 'pond']) assert.equal(checkMedicine({ medicine: 'copper', water }).verdict, 'hospital', water);
  const h = headline(checkMedicine({ medicine: 'salt', water: 'fresh', residents: ['scaleless'], hospital: true }));
  assert.match(h, /Not a good choice/); assert.doesNotMatch(h, /OK in/);
});
test('R4: catfish wording everywhere; no livebearer line in saltwater; °C/°F slips; salinity text', () => {
  const flat = assessDiagnosis({ water: 'fresh', fishType: 'cory', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' });
  assert.doesNotMatch(flat.primary.reason, /scales/);
  const tight = { water: 'fresh', fishType: 'pleco', primarySign: 'swollen', signs: ['swollen', 'pinecone'], closer: 'pinecone' };
  assert.doesNotMatch(assessDiagnosis(tight).primary.reason + assessDiagnosis(tight).primary.plan.recovery, /pine ?cone/i);
  assert.doesNotMatch(buildCase(tight), /Behavior: Scales sticking out/);
  assert.doesNotMatch(assessDiagnosis({ water: 'marine', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).naturalNote, /livebearer/);
  assert.match(assessUrgency({ water: 'fresh', temperature: '80', tempUnit: 'C', signs: [] }).checks.join(), /did you mean °F/);
  assert.equal(assessUrgency({ water: 'fresh', temperature: '80', tempUnit: 'C', signs: [] }).urgent.length, 0);
  assert.equal(readSalinity('1.026 (thus fine)').ppt > 33, true); assert.equal(readSalinity('35 ppt, items checked').ppt, 35);
  const both = assessUrgency({ water: 'marine', salinity: '20', ammonia: '2', signs: [] });
  assert.match(both.action, /current salinity/); assert.match(both.action, /1 ppt a day/);
  assert.doesNotMatch(assessUrgency({ water: 'fresh', fishType: 'goldfish', temperature: '90', tempUnit: 'F', signs: [] }).checks.join(), /\(\d.*\(/);
});
test('R4: goldfish ich heat stays inside the goldfish range; 45 °F is fine for goldfish', () => {
  const plan = assessDiagnosis({ water: 'fresh', fishType: 'goldfish', primarySign: 'dots', signs: ['dots'] }).primary.plan.steps.join(' ');
  assert.match(plan, /no more than about 75 °F/); assert.doesNotMatch(plan, /80 °F/);
  assert.equal(assessUrgency({ water: 'fresh', fishType: 'goldfish', temperature: '75', tempUnit: 'F', signs: [] }).checks.length, 0);
  assert.equal(assessUrgency({ water: 'fresh', fishType: 'goldfish', temperature: '45', tempUnit: 'F', signs: [] }).checks.length, 0);
});

// ── Astra round 3 (12:17 EST). ──
test('A3-1: the columnaris rewrite keeps the cory/pleco velvet treatment (no copper)', () => {
  for (const fishType of ['cory', 'pleco']) {
    const v = assessDiagnosis({ water: 'fresh', fishType, primarySign: 'dust', signs: ['dust', 'patch'], visualSigns: ['dust', 'patch'] }).findings.find(f => f.id === 'velvet-fresh');
    assert.doesNotMatch([...v.plan.steps, v.plan.treatment].join(' ').replace(/never copper|no copper/g, ''), /copper/i, fishType);
  }
});
test('A3-2: the velvet plan only uses copper in a hospital tank (matches the medicine check)', () => {
  const v = assessDiagnosis({ water: 'fresh', primarySign: 'dust', signs: ['dust'] }).primary.plan;
  assert.match(v.steps.join(' '), /copper-based ones only in a hospital tank/); assert.match(v.treatment, /copper only in a hospital tank/);
  assert.equal(checkMedicine({ medicine: 'copper', water: 'fresh' }).verdict, 'hospital');
});
test('A3-3: the African/oscar swelling plan does not put oscars on metronidazole and a plant diet', () => {
  const p = assessDiagnosis({ water: 'fresh', fishType: 'african', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).primary;
  assert.match(p.plan.steps.join(' '), /Oscars: swelling is more often overeating[^.]*keep their usual diet/);
  assert.match(p.reason, /In oscars it’s more often overeating/);
});
test('A3-4: salinity units win (%, ppt, SG) and negatives are rejected', () => {
  assert.equal(readSalinity('3.5%').ppt, 35); assert.equal(readSalinity('1 ppt').ppt, 1); assert.equal(readSalinity('-35 ppt').unreadable, true);
  assert.equal(readSalinity('SG 1.40').unreadable, true); assert.equal(Math.round(readSalinity('SG 1.025').ppt), 33);
});
test('A3-5: hospital/tub mode rows describe the hospital tank, not the display', () => {
  const r = checkMedicine({ medicine: 'antibiotics', water: 'pond', hospital: true });
  assert.ok(r.shown.every(x => !/whole pond|pond filter/.test(x.reason)));
  assert.match(headline(r), /separate tub/);
});

// ── Astra round 4 (12:40 EST). ──
test('A4-1: salinity in ppm, mg/L or with a typographic minus is rejected, not read as normal', () => {
  for (const s of ['35 ppm', '35 mg/L', '−35 ppt', '–35 ppt']) assert.equal(readSalinity(s).unreadable, true, s);
  assert.equal(readSalinity('35 ppt').ppt, 35); assert.equal(readSalinity('1.026 (thus fine)').ppt > 33, true);
});
test('A4-2/A5: the African/oscar swelling plan is one sequence: watch, then get help if it gets worse', () => {
  const steps = assessDiagnosis({ water: 'fresh', fishType: 'african', primarySign: 'swollen', signs: ['swollen'], closer: 'flat' }).primary.plan.steps.join(' ');
  assert.match(steps, /If it gets worse[^.]*get help from a fish vet/);
  assert.doesNotMatch(steps, /treat with metronidazole/i);
  assert.doesNotMatch(steps, /If it’s still eating normally/);
});

// Jez, Nov 6 19:05: each "Could also be" card explains why it could be that, like "Why we think so".
test('J1: every look-alike carries a why-it-could-be-this line built from the answers', () => {
  const d = assessDiagnosis({ water: 'fresh', primarySign: 'dots', signs: ['dots', 'rubbing'], fishType: 'betta' });
  const velvet = d.alternatives.find(a => a.id === 'velvet-fresh');
  assert.ok(velvet, 'velvet listed next to ich');
  assert.match(velvet.whyAlso, /look a lot like ich/);
  assert.match(velvet.whyAlso, /rubbing/);
  assert.match(velvet.whyAlso, /bettas/);
  for (const input of [{ water: 'fresh', primarySign: 'fins', signs: ['fins'] }, { water: 'marine', primarySign: 'dots', signs: ['dots'] }, { water: 'fresh', primarySign: 'swollen', signs: ['swollen'], fishType: 'goldfish' }])
    for (const a of assessDiagnosis(input).alternatives) assert.ok(a.whyAlso && a.whyAlso.length > 20, `${a.id}: ${a.whyAlso}`);
  const fins = assessDiagnosis({ water: 'fresh', primarySign: 'fins', signs: ['fins'] }).alternatives.find(a => a.id === 'columnaris');
  assert.match(fins.whyAlso, /“Damaged fins” fits this too/);
});

// Jez, Nov 6 19:13 screenshot: "Nothing obvious" + not eating explained itself with fast breathing.
test('J2: the water guess from "Nothing obvious" explains itself without unpicked signs', () => {
  for (const water of ['fresh', 'marine']) {
    const d = assessDiagnosis({ water, primarySign: 'unclear', signs: ['unclear', 'appetite'] });
    assert.equal(d.primary.id, 'water');
    assert.doesNotMatch(d.primary.reason + d.primary.summary, /fast breathing|breathe fast|red gills/i);
    assert.match(d.primary.reason, /Nothing obvious/);
    assert.match(d.primary.reason, /eating less/);
  }
  // Real breathing or red-gill answers keep the breathing explanation.
  assert.match(assessDiagnosis({ water: 'fresh', primarySign: 'breathing', signs: ['breathing'] }).primary.reason, /Fast breathing/);
  assert.match(assessDiagnosis({ water: 'fresh', primarySign: 'unclear', signs: ['unclear', 'red-gills'] }).primary.reason, /red gills/);
});

// Jez, Nov 6 19:21: "check all the combinations so that this type of mismatch does not occur".
test('J3: results never explain or picture a sign that was not picked', async () => {
  const { SYMPTOMS, BEHAVIORS, FISH_TYPES } = await import('../../experiments/fish-health-lab/data.mjs');
  const { imagesFor } = await import('../../experiments/fish-health-lab/fish-images.mjs');
  const { signImagesFor } = await import('../../experiments/fish-health-lab/choice-images.mjs');
  const breathingWords = /fast breathing|breathe fast|fast gills/i;
  for (const water of ['fresh', 'marine']) for (const fishType of ['', ...FISH_TYPES[water].map(f => f.id)]) for (const sign of SYMPTOMS.map(s => s.id))
    for (const behavior of ['', ...BEHAVIORS.map(b => b.id)]) {
      const signs = [sign, ...(behavior ? [behavior] : [])];
      const d = assessDiagnosis({ water, fishType, primarySign: sign, visualSigns: [sign], signs });
      for (const c of d.findings) {
        const said = c.reason.replace(/^You (picked|said)[^.]*\.\s*/, '');
        if (breathingWords.test(said) && !/—|especially|even before|easy to miss|watch for|check for|look for/.test(said.slice(0, said.search(breathingWords)).split(/[.]/).pop()))
          assert.ok(['breathing', 'gasping', 'red-gills'].some(s => signs.includes(s)) || c.fits.some(f => f.startsWith('patch')), `${water} ${fishType} ${signs} → ${c.id}: ${said}`);
      }
      // "Nothing obvious" leading to the water shows the calm, no-marks picture of what was picked.
      if (sign === 'unclear' && d.primary?.id === 'water' && !['gasping', 'red-gills'].includes(behavior)) {
        const pic = imagesFor(fishType, 'water', water, [...d.primary.fits, ...(behavior ? [behavior] : [])]).images[0];
        assert.doesNotMatch(pic.alt, /gasp|breathing hard|gills flared/i, `${water} ${fishType} ${behavior}`);
        if (!fishType) assert.equal(pic.url, signImagesFor(water).unclear.url);
      }
    }
});

test('J4: coral, invert and pond results picture and explain the sign that led there', async () => {
  const { assessReef, reefSignsFor } = await import('../../experiments/fish-health-lab/reef-logic.mjs');
  const { REEF_KINDS, REEF_CHANGES } = await import('../../experiments/fish-health-lab/reef-data.mjs');
  const { reefResultImageFor, reefImageFor } = await import('../../experiments/fish-health-lab/reef-images.mjs');
  const pondHot = assessReef({ group: 'pond', kind: 'koi', sign: 'lethargic', changes: ['heat'], chosen: [] });
  assert.equal(pondHot.primary.id, 'pond-low-oxygen');
  assert.doesNotMatch(pondHot.primary.reason, /gasping/i);
  assert.doesNotMatch(reefResultImageFor('pond', pondHot.primary, 'lethargic', 'koi').alt, /surface|gasp/i);
  const shrimp = assessReef({ group: 'invert', kind: 'shrimp', sign: 'color', changes: ['medicine'], chosen: [] });
  assert.doesNotMatch(shrimp.primary.reason, /dying/i);
  assert.equal(reefResultImageFor('invert', shrimp.primary, 'color', 'shrimp').alt, reefImageFor('invert', 'color', 'shrimp', 'signs').alt);
  // Every result: the explanation names the picked sign's own wording when it has one, and every look-alike explains itself.
  for (const group of ['coral', 'invert', 'pond']) for (const kind of ['', ...(REEF_KINDS[group] || []).map(k => k.id)]) for (const s of reefSignsFor(group, kind))
    for (const changes of [[], ...(REEF_CHANGES[group] || []).map(c => [c.id])]) {
      const r = assessReef({ group, kind, sign: s.id, changes, chosen: [] });
      if (!r.primary) continue;
      if (r.primary.checks?.[s.id]) assert.ok(r.primary.reason.includes(r.primary.checks[s.id]));
      for (const a of r.alternatives) assert.ok(a.whyAlso && a.whyAlso.length > 20, `${group} ${s.id} ${a.id}`);
      assert.ok(reefResultImageFor(group, r.primary, s.id, kind) || !reefImageFor(group, r.primary.id, kind));
    }
});
