// Fixes from the November 16 2026 logic audit (Jez, #hidden-reef-3: "Fix 1 to 10 now on jez 237 and the lab").
// One test per finding; the audit report and its scripts are kept in the OpenClaw workspace under
// projects/fish-health-audit-20261116/.
import test from 'node:test';
import assert from 'node:assert/strict';
import { assessDiagnosis, assessUrgency, readSalinity, buildCase, rankForFeature } from '../../experiments/fish-health-lab/logic.mjs';
import { carePlanFor, PLAN_IDS } from '../../experiments/fish-health-lab/treatments.mjs';
import { checkMedicine } from '../../experiments/fish-health-lab/medicine.mjs';
import { CONDITIONS, FISH_TYPES, SYMPTOMS } from '../../experiments/fish-health-lab/data.mjs';

const planText = p => [...p.steps, p.treatment, p.recovery].join(' | ');
const diagnose = input => assessDiagnosis({ signs: [], ...input, signs: [...(input.visualSigns || [input.primarySign]), ...(input.signs || [])] });

test('1. a salinity typed both ways is read with each number beside its own unit', () => {
  for (const typed of ['1.026 (35 ppt)', '1.025 SG (34 ppt)', '35 ppt / 1.026', '35 ppt (1.026)', 'SG 1.026 = 35ppt', '1,026 (35 ppt)', '1.026 / 35', '35 / 1.026']) {
    const read = readSalinity(typed);
    assert.ok(read.ppt >= 33 && read.ppt <= 35.5, `${typed} -> ${JSON.stringify(read)}`);
    const a = assessUrgency({ water: 'marine', signs: [], salinity: typed });
    assert.deepEqual(a.urgent, [], typed); assert.equal(a.checks.some(c => /salinity/i.test(c)), false, typed);
  }
  // Two numbers that cannot both be right are not guessed at.
  for (const typed of ['1.026 (20 ppt)', '1.010 (35 ppt)', '45 / 1.020']) assert.equal(readSalinity(typed).unreadable, true, typed);
  // What worked before still works.
  assert.equal(readSalinity('35').ppt, 35); assert.equal(readSalinity('35 ppt').ppt, 35); assert.equal(readSalinity('1 ppt').ppt, 1);
  assert.equal(Math.round(readSalinity('1.026').ppt), 34); assert.equal(readSalinity('3.5%').ppt, 35); assert.equal(Math.round(readSalinity('SG 1.025').ppt), 33);
  assert.equal(readSalinity('90 ppt').unreadable, true); assert.equal(readSalinity('SG 1.40').unreadable, true); assert.equal(readSalinity(''), null);
  assert.match(assessUrgency({ water: 'marine', signs: [], salinity: '20 ppt' }).urgent.join(' '), /Salinity about 20 ppt is dangerously low/);
});

test('2 and 3. the medicine check agrees with the care plans about a reef display', () => {
  const verdict = (medicine, residents) => checkMedicine({ medicine, water: 'marine', residents }).verdict;
  // Praziquantel and antibiotics: the plans say "never medicate a reef display", so corals or inverts mean a hospital tank.
  assert.equal(verdict('prazi', ['corals', 'inverts', 'rock']), 'hospital');
  assert.equal(verdict('prazi', ['corals']), 'hospital'); assert.equal(verdict('prazi', ['inverts']), 'hospital');
  assert.equal(verdict('antibiotics', ['inverts', 'rock']), 'hospital'); assert.equal(verdict('antibiotics', ['inverts']), 'hospital');
  assert.equal(verdict('antibiotics', ['rock']), 'hospital'); assert.equal(verdict('antibiotics', ['corals']), 'hospital');
  assert.equal(verdict('metro', ['inverts']), 'care');
  // In the hospital tank itself they are fine, and praziquantel stays gentle for fish alone.
  assert.equal(checkMedicine({ medicine: 'prazi', water: 'marine', residents: ['corals', 'inverts'], hospital: true }).verdict, 'ok');
  assert.equal(verdict('prazi', []), 'ok');
  assert.equal(carePlanFor('flukes', 'marine').reefUnsafe, true); assert.equal(carePlanFor('black-spot', 'marine').reefUnsafe, true);
  // Freshwater answers are unchanged.
  assert.equal(checkMedicine({ medicine: 'prazi', water: 'fresh', residents: ['shrimp', 'plants'] }).verdict, 'ok');
});

test('4. no plan tells a cory or pleco keeper to add salt of any kind', () => {
  for (const fish of ['cory', 'pleco']) for (const id of PLAN_IDS) {
    const plan = carePlanFor(id, 'fresh', fish); if (!plan) continue;
    for (const line of [...plan.steps, plan.treatment]) {
      if (!/salt/i.test(line)) continue;
      assert.match(line, /skip salt|no salt|not corys|salinity-matched|never/i, `${id} ${fish}: ${line}`);
      assert.doesNotMatch(line, /add epsom|epsom salt \+|epsom salt in/i, `${id} ${fish}: ${line}`);
    }
  }
  assert.match(planText(carePlanFor('popeye', 'fresh', 'pleco')), /antibacterial medication labelled safe for scaleless fish/);
  assert.match(planText(carePlanFor('popeye', 'fresh', 'betta')), /Add Epsom salt/);
});

test('5. an exact tie goes to the more urgent condition, not the alphabet', () => {
  const betta = diagnose({ water: 'fresh', fishType: 'betta', primarySign: 'breathing', signs: ['rubbing'] });
  assert.equal(betta.primary.id, 'velvet-fresh'); assert.equal(betta.urgency, 'today');
  assert.ok(betta.alternatives.some(c => c.id === 'flukes'));
  // No ranked list anywhere still depends on the name when urgency or the fish type can decide.
  const rank = { today: 3, week: 2, watch: 1 };
  for (const water of ['fresh', 'marine']) for (const fish of ['', ...FISH_TYPES[water].map(f => f.id)]) for (const s of SYMPTOMS) {
    const list = rankForFeature(s.id, { water, fishType: fish, signs: [s.id] });
    for (let i = 1; i < list.length; i++) if (list[i - 1].score === list[i].score && list[i - 1].base === list[i].base)
      assert.ok(rank[list[i - 1].urgency || 'week'] >= rank[list[i].urgency || 'week'], `${water} ${fish} ${s.id}: ${list[i - 1].id} before ${list[i].id}`);
  }
});

test('6 and 7. plans that must be done in order say so', () => {
  const both = diagnose({ water: 'fresh', primarySign: 'sores', closer: 'streaks', visualSigns: ['sores', 'breathing'], signs: ['rubbing'] });
  assert.deepEqual(both.findings.map(c => c.id).sort(), ['flukes', 'septicemia']);
  assert.ok(both.messages.some(m => /One plan treats the whole tank and another moves the fish to a hospital tank/.test(m)));
  const tang = diagnose({ water: 'marine', fishType: 'tang', primarySign: 'patch', closer: 'pits', visualSigns: ['patch', 'swollen'] });
  assert.ok(tang.findings.some(c => c.id === 'hlle') && tang.findings.some(c => c.id === 'bloat'), tang.findings.map(c => c.id).join());
  assert.ok(tang.messages.includes('Do the 1–2 day fast first, then start the better diet.'));
});

test('8, 9 and 16. heat: none beside columnaris, capped for goldfish, and one bracket', () => {
  const d = diagnose({ water: 'fresh', primarySign: 'dots', closer: 'dots', visualSigns: ['dots', 'patch'] });
  assert.ok(d.findings.some(c => c.id === 'columnaris'));
  for (const c of [...d.findings, ...d.alternatives]) {
    assert.ok(c.plan, `${c.id} has a plan`);
    if (['ich-fresh', 'velvet-fresh'].includes(c.id)) {
      assert.doesNotMatch(c.plan.steps.join(' '), /raise the temperature/i, c.id);
      assert.match(c.plan.treatment, /no heat while columnaris is active\)$/, c.id);
    }
    assert.doesNotMatch(c.plan.treatment, /\) \(/, `${c.id}: ${c.plan.treatment}`);
  }
  assert.ok([...d.findings, ...d.alternatives].some(c => c.id === 'velvet-fresh'), 'velvet is on the page');
  // A cory beside columnaris: the note joins the existing bracket.
  const cory = diagnose({ water: 'fresh', fishType: 'cory', primarySign: 'dots', closer: 'dots', visualSigns: ['dots', 'patch'] });
  for (const c of [...cory.findings, ...cory.alternatives]) assert.doesNotMatch(c.plan?.treatment || '', /\) \(/, c.plan?.treatment);
  // Goldfish: velvet and ich both stop at 75 °F, and their hospital tank has no heater.
  for (const id of ['velvet-fresh', 'ich-fresh']) assert.match(planText(carePlanFor(id, 'fresh', 'goldfish')), /no more than about 75 °F \(24 °C\)/, id);
  assert.match(planText(carePlanFor('velvet-fresh', 'fresh', 'betta')), /raise the temperature a little\./);
  for (const id of PLAN_IDS) { const p = carePlanFor(id, 'fresh', 'goldfish'); if (p) assert.doesNotMatch(planText(p), /with a heater/, id); }
  assert.match(planText(carePlanFor('dropsy', 'fresh', 'goldfish')), /tank with an air stone \(goldfish need no heater\)—bare bottom/);
  assert.match(planText(carePlanFor('dropsy', 'fresh', 'betta')), /tank with a heater and air stone—bare bottom/);
  const goldfish = diagnose({ water: 'fresh', fishType: 'goldfish', primarySign: 'dust', visualSigns: ['dust', 'patch'] });
  for (const c of [...goldfish.findings, ...goldfish.alternatives]) if (goldfish.findings.some(f => f.id === 'columnaris') && c.id === 'velvet-fresh') assert.doesNotMatch(c.plan.steps.join(' '), /raise the temperature|75 °F/);
});

test('10. corys and plecos are never told about their scales', () => {
  for (const fish of ['cory', 'pleco']) {
    const dropsy = diagnose({ water: 'fresh', fishType: fish, primarySign: 'swollen', closer: 'pinecone' });
    assert.equal(dropsy.primary.id, 'dropsy'); assert.doesNotMatch(dropsy.primary.summary, /scales/i);
    for (const closer of ['open', 'streaks', 'scrape']) {
      const d = diagnose({ water: 'fresh', fishType: fish, primarySign: 'sores', closer });
      for (const c of [...d.findings, ...d.alternatives]) {
        assert.doesNotMatch(c.summary || '', /scales/i, `${fish} ${closer} ${c.id} summary`);
        assert.doesNotMatch(c.comparisonReason || '', /scales/i, `${fish} ${closer} ${c.id} look-alike`);
        assert.doesNotMatch(c.whyAlso || '', /scales/i, `${fish} ${closer} ${c.id} why`);
      }
    }
  }
  assert.match(diagnose({ water: 'fresh', fishType: 'betta', primarySign: 'swollen', closer: 'pinecone' }).primary.summary, /scales stick out like a pinecone/);
});

test('11 to 15, 17 and 18. the small ones', () => {
  // 11: a reading of 0 is a reading.
  assert.match(assessUrgency({ water: 'fresh', fishType: 'goldfish', signs: [], temperature: '0', tempUnit: 'C' }).urgent.join(' '), /0 °C is dangerously cold for goldfish/);
  assert.equal(assessUrgency({ water: 'fresh', signs: [], temperature: '' }).level, 'observe');
  // 12: one salinity range everywhere.
  assert.match(assessUrgency({ water: 'marine', signs: [], salinity: '28' }).checks.join(' '), /33–35 ppt, about 1\.025–1\.026/);
  // 13: the reminder names the reading that is missing.
  assert.deepEqual(assessUrgency({ water: 'fresh', signs: [], ammonia: '0' }).waterMissing, ['nitrite']);
  assert.deepEqual(assessUrgency({ water: 'fresh', signs: [] }).waterMissing, ['ammonia', 'nitrite']);
  assert.deepEqual(assessUrgency({ water: 'fresh', signs: [], ammonia: '0', nitrite: '0' }).waterMissing, []);
  // 14: the aquarium goldfish tile no longer invites koi keepers in.
  assert.doesNotMatch(FISH_TYPES.fresh.find(f => f.id === 'goldfish').text, /or koi/i);
  // 15: the same answers give the same page whichever extra sign was clicked first.
  const page = d => JSON.stringify([d.findings.map(c => c.id), d.alternatives.map(c => c.id), d.urgency]);
  let checked = 0;
  for (const water of ['fresh', 'marine']) for (const main of SYMPTOMS) for (const a of SYMPTOMS) for (const b of SYMPTOMS) {
    if (a.id === main.id || b.id === main.id || a.id >= b.id || [main.id, a.id, b.id].includes('unclear')) continue;
    assert.equal(page(diagnose({ water, primarySign: main.id, visualSigns: [main.id, a.id, b.id] })), page(diagnose({ water, primarySign: main.id, visualSigns: [main.id, b.id, a.id] })), `${water} ${main.id} + ${a.id}, ${b.id}`);
    checked++;
  }
  assert.ok(checked > 800, String(checked));
  // 17: no aquarium salt suggested for corys and plecos, in the water check either.
  const nitrite = fish => assessUrgency({ water: 'fresh', fishType: fish, signs: [], nitrite: '0.5' }).checks.join(' ');
  assert.match(nitrite('pleco'), /Skip aquarium salt: corys and plecos don’t tolerate it/); assert.match(nitrite('betta'), /consider aquarium salt for salt-tolerant fish/);
  // 18: a comma decimal or a typed unit is still a reading.
  assert.match(assessUrgency({ water: 'fresh', signs: [], ammonia: '1,5' }).urgent.join(' '), /Ammonia 1\.5 ppm is toxic/);
  assert.match(assessUrgency({ water: 'fresh', signs: [], nitrite: '2 ppm' }).urgent.join(' '), /Nitrite 2 ppm is toxic/);
  assert.equal(assessUrgency({ water: 'fresh', signs: [], ammonia: 'abc' }).waterMissing.includes('ammonia'), true);
  assert.doesNotThrow(() => buildCase({ water: 'fresh', signs: [], ammonia: '0,25', ph: '7,2', temperature: '78 °F', tempUnit: 'F' }));
});

test('every plan for every fish still reads cleanly', () => {
  let plans = 0;
  for (const c of CONDITIONS) for (const water of ['fresh', 'marine']) {
    if (c.scope !== 'both' && c.scope !== water) continue;
    for (const fish of ['', ...FISH_TYPES[water].map(f => f.id)]) {
      const text = planText(carePlanFor(c.id, water, fish)); plans++;
      assert.doesNotMatch(text, /undefined|NaN|\.\. |\[object|  /, `${c.id} ${water} ${fish}`);
    }
  }
  assert.ok(plans > 380);
});
