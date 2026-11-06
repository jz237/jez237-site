import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessDiagnosis, assessUrgency, buildCase, weightOf, treatmentNote, TREATMENT_FAMILY, LOOK_FOR, ALTERNATIVE_TEXT } from '../../experiments/fish-health-lab/logic.mjs';
import { SYMPTOMS, BEHAVIORS, CONDITIONS, FISH_TYPES, CLOSER_QUESTIONS, GROWTH_CHOICES, URGENCY, closerQuestionFor } from '../../experiments/fish-health-lab/data.mjs';
import { signImagesFor } from '../../experiments/fish-health-lab/choice-images.mjs';

const input = (patterns, extra = {}) => ({ water: 'fresh', primarySign: patterns[0], visualSigns: patterns, signs: [...patterns, ...(extra.behaviors || [])], ...extra });
const ids = result => result.findings.map(c => c.id).sort();
const lead = (patterns, extra) => assessDiagnosis(input(patterns, extra)).primary?.id;

test('every symptom family leads with a named best guess and a "Most likely" heading', () => {
  const expected = {
    fresh: { dots: 'ich-fresh', dust: 'velvet-fresh', fuzz: 'water-mold', patch: 'columnaris', fins: 'fin-rot', sores: 'ulcer', swollen: 'bloat', eyes: 'cloudy-eye', lumps: 'growth', breathing: 'water', balance: 'swim-bladder', unclear: 'water' },
    marine: { dots: 'ich-marine', dust: 'velvet-marine', fuzz: 'lymphocystis', patch: 'brooklynella', fins: 'fin-rot', sores: 'uronema', swollen: 'bloat', eyes: 'cloudy-eye', lumps: 'growth', breathing: 'water', balance: 'swim-bladder', unclear: 'water' },
  };
  for (const water of ['fresh', 'marine']) for (const sign of SYMPTOMS) {
    const result = assessDiagnosis(input([sign.id], { water }));
    assert.equal(result.primary?.id, expected[water][sign.id], `${water} ${sign.id}`);
    assert.equal(result.title, `Most likely: ${result.primary.title}`);
    assert.ok(URGENCY[result.primary.urgencyLevel], 'urgency badge');
    assert.ok(result.primary.plan?.steps.length >= 3, 'what to do now');
  }
});

test('closer-look answers name the specific hobbyist condition', () => {
  const cases = [
    ['fresh', 'fins', '', 'fin-rot'], ['fresh', 'eyes', 'bulging', 'popeye'], ['fresh', 'eyes', 'cloudy', 'cloudy-eye'],
    ['fresh', 'sores', 'open', 'ulcer'], ['fresh', 'sores', 'streaks', 'septicemia'], ['fresh', 'sores', 'scrape', 'injury'],
    ['fresh', 'patch', 'flat', 'columnaris'], ['fresh', 'patch', 'pits', 'hole-in-head'], ['fresh', 'patch', 'slime', 'flukes'],
    ['marine', 'dots', 'white', 'ich-marine'], ['marine', 'dots', 'black', 'black-spot'],
    ['marine', 'patch', 'slime', 'brooklynella'], ['marine', 'patch', 'pits', 'hlle'], ['marine', 'sores', 'open', 'uronema'],
    ['marine', 'sores', 'scrape', 'injury'], ['marine', 'eyes', 'bulging', 'popeye'],
  ];
  for (const [water, sign, closer, id] of cases) assert.equal(lead([sign], { water, closer }), id, `${water} ${sign}:${closer}`);
});

test('dropsy needs swelling with pinecone scales; swelling alone is bloat with dropsy as "could also be"', () => {
  const plain = assessDiagnosis(input(['swollen']));
  assert.equal(plain.primary.id, 'bloat');
  assert.ok(plain.alternatives.some(c => c.id === 'dropsy'));
  const pine = assessDiagnosis(input(['swollen'], { behaviors: ['pinecone'] }));
  assert.deepEqual(ids(pine), ['dropsy']);
  assert.equal(pine.primary.urgencyLevel, 'today');
});

test('fast breathing: water/oxygen by default, flukes with flashing, marine velvet with dust', () => {
  for (const water of ['fresh', 'marine']) {
    assert.equal(lead(['breathing'], { water }), 'water');
    assert.equal(lead(['breathing'], { water, behaviors: ['red-gills', 'several'] }), 'water');
    assert.equal(lead(['breathing'], { water, behaviors: ['rubbing'] }), 'flukes');
  }
  const velvet = assessDiagnosis(input(['breathing', 'dust'], { water: 'marine' }));
  assert.deepEqual(ids(velvet), ['velvet-marine']);
  assert.equal(velvet.urgent.length, 1);
  assert.ok(assessDiagnosis(input(['breathing'], { water: 'marine' })).alternatives.some(c => c.id === 'velvet-marine'));
  assert.equal(lead(['eyes'], { water: 'marine', closer: 'cloudy', behaviors: ['rubbing'] }), 'flukes');
});

test('fish type re-weights results without adding unrelated conditions', () => {
  assert.equal(lead(['patch'], { water: 'marine', fishType: 'clownfish' }), 'brooklynella');
  assert.equal(lead(['patch'], { water: 'marine', fishType: 'tang' }), 'hlle');
  assert.equal(lead(['dots'], { water: 'marine', fishType: 'tang' }), 'ich-marine');
  assert.ok(assessDiagnosis(input(['dots'], { water: 'marine', fishType: 'tang' })).alternatives.some(c => c.id === 'black-spot'));
  assert.equal(lead(['sores'], { water: 'marine', fishType: 'damsel' }), 'uronema');
  assert.equal(lead(['balance'], { fishType: 'goldfish' }), 'swim-bladder');
  assert.equal(lead(['dust'], { fishType: 'betta' }), 'velvet-fresh');
  // Livebearers lift columnaris for a patch; cichlids lift hole-in-the-head into the alternatives.
  assert.equal(lead(['patch'], { fishType: 'livebearer' }), 'columnaris');
  assert.ok(assessDiagnosis(input(['patch'], { fishType: 'cichlid' })).alternatives.slice(0, 2).some(c => c.id === 'hole-in-head'));
  assert.ok(assessDiagnosis(input(['patch'], { fishType: 'angelfish' })).alternatives.slice(0, 2).some(c => c.id === 'hole-in-head'));
  assert.equal(lead(['patch'], { fishType: 'molly' }), 'columnaris');
  assert.equal(lead(['swollen'], { fishType: 'african' }), 'bloat');
  // Boosts never make a condition appear for a sign it doesn't fit.
  for (const water of ['fresh', 'marine']) for (const fish of FISH_TYPES[water]) for (const sign of SYMPTOMS) {
    const withFish = assessDiagnosis(input([sign.id], { water, fishType: fish.id }));
    const without = new Set([...assessDiagnosis(input([sign.id], { water })).findings, ...assessDiagnosis(input([sign.id], { water })).alternatives].map(c => c.id));
    // (The no-fish list shows only 3 look-alikes, so a genuine fit for the sign also counts.)
    for (const c of withFish.findings) assert.ok(without.has(c.id) || weightOf(c, sign.id, water) >= 2, `${fish.id} ${sign.id} invented ${c.id}`);
  }
});

test('fish-specific tips appear on the matching result', () => {
  assert.match(assessDiagnosis(input(['dots'], { fishType: 'catfish' })).primary.tip, /scaleless/);
  assert.match(assessDiagnosis(input(['patch'], { water: 'marine', fishType: 'clownfish', closer: 'slime' })).primary.tip, /clown/i);
  assert.match(assessDiagnosis(input(['swollen'], { fishType: 'livebearer' })).primary.tip, /pregnant/);
  // Split groups get their own tips (old ids land on the first sub-group's tips above).
  assert.match(assessDiagnosis(input(['swollen'], { fishType: 'african' })).primary.tip, /Malawi bloat/);
  assert.match(assessDiagnosis(input(['swollen'], { fishType: 'molly' })).primary.tip, /pregnant/);
  assert.match(assessDiagnosis(input(['swollen'], { fishType: 'guppy' })).primary.tip, /Camallanus/);
  assert.match(assessDiagnosis(input(['sores'], { fishType: 'gourami', closer: 'open' })).primary.tip, /dwarf gourami disease/);
  assert.match(assessDiagnosis(input(['dots'], { fishType: 'pleco' })).primary.tip, /scaleless/);
  assert.match(assessDiagnosis(input(['dots'], { fishType: 'barb' })).primary.tip, /whole tank/);
  assert.equal(assessDiagnosis(input(['swollen'], { fishType: 'angelfish' })).primary.tip, '');
  // Every tip names a current fish type.
  const ids = new Set([...FISH_TYPES.fresh, ...FISH_TYPES.marine].map(f => f.id));
  for (const c of CONDITIONS) for (const id of Object.keys(c.tips || {})) assert.ok(ids.has(id), `${c.id} tip for ${id}`);
  assert.equal(assessDiagnosis(input(['dots'])).primary.tip, '');
});

test('urgency: velvet, Brooklynella, Uronema, water and dropsy act today; ich and fin rot this week; lymphocystis watch', () => {
  const urgency = Object.fromEntries(CONDITIONS.map(c => [c.id, c.urgency]));
  for (const id of ['velvet-fresh', 'velvet-marine', 'uronema', 'brooklynella', 'water', 'dropsy']) assert.equal(urgency[id], 'today', id);
  for (const id of ['ich-fresh', 'ich-marine', 'fin-rot', 'flukes', 'popeye', 'ulcer']) assert.equal(urgency[id], 'week', id);
  for (const id of ['lymphocystis', 'hlle', 'normal']) assert.equal(urgency[id], 'watch', id);
  // Any distress or deaths escalates the result to "Act today".
  for (const b of ['gasping', 'collapse', 'deaths']) {
    const result = assessDiagnosis(input(['lumps'], { growthAppearance: 'cauliflower', behaviors: [b] }));
    assert.equal(result.primary.id, 'lymphocystis');
    assert.equal(result.primary.urgencyLevel, 'today');
  }
  assert.equal(assessDiagnosis(input(['lumps'], { growthAppearance: 'cauliflower' })).primary.urgencyLevel, 'watch');
});

test('growth follow-up: cauliflower → lymphocystis, smooth → cyst/tumor, inflamed → ulcer, unsure → lymphocystis', () => {
  for (const water of ['fresh', 'marine']) {
    assert.equal(lead(['lumps'], { water, growthAppearance: 'cauliflower' }), 'lymphocystis');
    assert.equal(lead(['lumps'], { water, growthAppearance: 'smooth' }), 'growth');
    assert.equal(lead(['lumps'], { water, growthAppearance: 'inflamed' }), 'ulcer');
    assert.equal(lead(['lumps'], { water, growthAppearance: 'unclear' }), 'lymphocystis');
    assert.ok(!assessDiagnosis(input(['dots'], { water, growthAppearance: 'cauliflower' })).findings.some(c => c.id === 'lymphocystis'));
  }
});

test('two problems may fit: grains + threads, grains + dust, and a shared cause for patches + fins', () => {
  const both = assessDiagnosis(input(['dots', 'fuzz']));
  assert.equal(both.status, 'multiple');
  assert.deepEqual(ids(both), ['ich-fresh', 'water-mold']);
  assert.match(both.messages.join(' '), /More than one problem/);
  assert.ok(both.alternatives.every(c => !ids(both).includes(c.id)));
  const dust = assessDiagnosis(input(['dots', 'dust']));
  assert.deepEqual(ids(dust), ['ich-fresh', 'velvet-fresh']);
  assert.match(dust.messages.join(' '), /grains and fine dust/);
  for (const signs of [['patch', 'fins'], ['fins', 'patch']]) {
    const result = assessDiagnosis(input(signs));
    assert.equal(result.status, 'single');
    assert.deepEqual(ids(result), ['columnaris']);
  }
  const pine = assessDiagnosis(input(['dots'], { behaviors: ['pinecone', 'appetite'] }));
  assert.deepEqual(ids(pine), ['dropsy', 'ich-fresh']);
  assert.equal(pine.primary.id, 'ich-fresh');
  assert.ok(pine.urgent.some(m => /pinecone/.test(m)));
});

test('nonspecific behavior does not invent eye, swelling or swimming results for white dots', () => {
  const result = assessDiagnosis(input(['dots'], { behaviors: ['appetite', 'clamped', 'rubbing', 'gasping', 'collapse', 'deaths', 'red-gills', 'several'] }));
  assert.deepEqual(ids(result), ['ich-fresh']);
  assert.equal(result.urgent.length, 3);
  assert.ok(!result.alternatives.some(c => ['dropsy', 'swim-bladder', 'popeye', 'cloudy-eye', 'bloat'].includes(c.id)));
});

test('water readings add a water concern alongside the visible problem', () => {
  const result = assessDiagnosis(input(['dots'], { ammonia: '1', nitrite: '0', affected: 'several' }));
  assert.deepEqual(ids(result), ['ich-fresh']);
  assert.deepEqual(result.contextConcerns.map(c => c.id), ['water']);
  assert.match(result.contextConcerns[0].reason, /Ammonia is detectable/);
});

test('closer texture choice replaces the first white-dots choice transparently', () => {
  const result = assessDiagnosis(input(['fuzz'], { initialSign: 'dots', textureSign: 'fuzz' }));
  assert.deepEqual(ids(result), ['water-mold']);
  assert.match(result.messages.join(' '), /instead of “White dots/);
});

test('every single-picture × behavior × fish × water case names something in scope, keeps distress and dropsy', () => {
  let cases = 0;
  for (const water of ['fresh', 'marine']) for (const fish of [{ id: '' }, ...FISH_TYPES[water]]) for (const sign of SYMPTOMS) {
    const closers = closerQuestionFor(sign.id, water)?.choices.map(c => c.id) || [''];
    for (const closer of closers) for (let mask = 0; mask < 2 ** BEHAVIORS.length; mask += fish.id ? 37 : 1) {
      const behaviors = BEHAVIORS.filter((_, i) => mask & (1 << i)).map(b => b.id);
      const observation = input([sign.id], { water, fishType: fish.id, closer, behaviors, growthAppearance: sign.id === 'lumps' ? 'unclear' : '' });
      const result = assessDiagnosis(observation);
      assert.ok(result.primary, `${water} ${sign.id} ${closer}`);
      const entries = [...result.findings, ...result.alternatives, ...result.contextConcerns];
      assert.ok(entries.every(c => c.scope === 'both' || c.scope === water), 'water scope');
      assert.equal(new Set(result.findings.map(c => c.id)).size, result.findings.length);
      assert.deepEqual(result.urgent, assessUrgency(observation).urgent);
      if (behaviors.includes('pinecone')) assert.ok(result.findings.some(c => c.id === 'dropsy'));
      if (behaviors.some(b => ['gasping', 'collapse', 'deaths'].includes(b))) assert.ok(result.findings.every(c => c.urgencyLevel === 'today'));
      if (water === 'marine') for (const c of result.findings) if (c.plan?.medicated) assert.equal(c.plan.reefUnsafe, true, `${c.id} needs a reef flag`);
      assert.ok(result.alternatives.length <= 3);
      assert.ok(result.alternatives.every(c => c.id !== 'normal'), 'normal is never a card');
      cases++;
    }
  }
  assert.ok(cases > 20000, String(cases));
});

test('all two-picture cases account for each selected sign', () => {
  const signs = SYMPTOMS.filter(s => s.id !== 'unclear').map(s => s.id);
  let cases = 0;
  for (const water of ['fresh', 'marine']) for (let i = 0; i < signs.length; i++) for (let j = i + 1; j < signs.length; j++) {
    const result = assessDiagnosis(input([signs[i], signs[j]], { water }));
    for (const sign of [signs[i], signs[j]]) assert.ok(result.unexplained.includes(sign) || result.findings.some(c => c.fits.includes(sign)), `${water} ${sign}`);
    assert.deepEqual(result.unexplained, []);
    assert.ok([...result.findings, ...result.alternatives].every(c => c.scope === 'both' || c.scope === water));
    cases++;
  }
  assert.equal(cases, 110);
});

test('closer questions and fish lists are complete and water-specific', () => {
  assert.equal(closerQuestionFor('dots', 'fresh'), null);
  assert.ok(closerQuestionFor('dots', 'marine'));
  for (const q of Object.values(CLOSER_QUESTIONS)) assert.ok(q.choices.some(c => c.id === 'unclear'));
  assert.deepEqual(FISH_TYPES.fresh.map(f => f.id), ['betta', 'goldfish', 'guppy', 'molly', 'community', 'barb', 'gourami', 'angelfish', 'african', 'cory', 'pleco']);
  assert.deepEqual(FISH_TYPES.marine.map(f => f.id), ['clownfish', 'tang', 'angel', 'wrasse', 'goby', 'damsel', 'dottyback']);
  // Short names so three tiles fit across a phone screen.
  for (const water of ['fresh', 'marine']) for (const f of FISH_TYPES[water]) {
    assert.ok(f.title.length <= 19, f.title);
    assert.ok(f.text.length <= 24, f.text);
  }
  for (const water of ['fresh', 'marine']) for (const f of FISH_TYPES[water]) for (const id of Object.keys(f.boosts)) {
    const c = CONDITIONS.find(x => x.id === id);
    assert.ok(c && (c.scope === 'both' || c.scope === water), `${f.id} boosts ${id}`);
  }
  assert.equal(GROWTH_CHOICES.length, 4);
});

test('marine picture choices use a distinct complete set, never freshwater assets', () => {
  const fresh = signImagesFor('fresh'), marine = signImagesFor('marine');
  assert.equal(Object.keys(marine).length, 12);
  assert.equal(new Set(Object.values(marine).map(i => i.url)).size, 12);
  for (const id of Object.keys(fresh)) assert.notEqual(fresh[id].url, marine[id].url);
});

test('saved notes list the best guess, fish type, plan and reef flag, and keep free text local', () => {
  const notes = buildCase(input(['patch'], { water: 'marine', fishType: 'clownfish', closer: 'slime', notes: 'PRIVATE-NOTE' }));
  assert.match(notes, /Most likely: Brooklynella \(clownfish disease\) \(Act today\)/);
  assert.match(notes, /Kind of fish: Clownfish/);
  assert.match(notes, /NOT REEF-SAFE/);
  assert.match(notes, /follow the product label/);
  assert.match(notes, /PRIVATE-NOTE/);
  assert.match(notes, /not a vet diagnosis/);
  assert.doesNotMatch(notes, /ChatGPT|microscop|wet mount|biopsy/i);
  const mixed = buildCase(input(['dots', 'fuzz']));
  assert.match(mixed, /Most likely: Ich/);
  assert.match(mixed, /Also likely: Fungus/);
});

test('"could also be" only lists things that fit the same sign or are true look-alikes', () => {
  const alsoIds = input => assessDiagnosis(input).alternatives.map(c => c.id);
  const check = (input, mustNot, must = []) => {
    const ids = alsoIds(input);
    for (const id of mustNot) assert.ok(!ids.includes(id), `${JSON.stringify(input)} should not list ${id}: ${ids}`);
    for (const id of must) assert.ok(ids.includes(id), `${JSON.stringify(input)} should list ${id}: ${ids}`);
  };
  check({ water: 'fresh', primarySign: 'patch', signs: ['patch'], closer: 'flat' }, ['fin-rot', 'ulcer', 'normal'], ['water-mold']);
  check({ water: 'fresh', primarySign: 'fins', signs: ['fins'] }, ['water-mold', 'septicemia'], ['injury']);
  check({ water: 'fresh', primarySign: 'eyes', signs: ['eyes'], closer: 'cloudy' }, ['normal'], ['popeye']);
  check({ water: 'fresh', primarySign: 'sores', signs: ['sores'], closer: 'streaks' }, ['water-mold']);
  check({ water: 'fresh', primarySign: 'sores', signs: ['sores'], closer: 'scrape' }, ['fin-rot']);
  check({ water: 'marine', primarySign: 'dust', signs: ['dust'] }, ['water'], ['ich-marine']);
  check({ water: 'marine', primarySign: 'patch', signs: ['patch'], closer: 'flat', fishType: 'tang' }, [], []);
  assert.equal(assessDiagnosis({ water: 'marine', primarySign: 'patch', signs: ['patch'], closer: 'flat', fishType: 'tang' }).primary.id, 'brooklynella', 'a weak fit (HLLE for a flat patch) is not promoted by fish type alone');
  assert.equal(assessDiagnosis({ water: 'fresh', primarySign: 'unclear', signs: ['unclear', 'pinecone'] }).primary.id, 'dropsy', 'pinecone scales lead even with "nothing obvious"');
  const both = assessDiagnosis({ water: 'fresh', primarySign: 'balance', signs: ['balance'], visualSigns: ['swollen'] });
  assert.deepEqual(both.findings.map(c => c.id), ['bloat'], 'a swollen fish that floats is one problem (bloat), not two');
});

test('could-also: at most 3, most likely first, never "normal" (a plain line instead)', () => {
  const dots = assessDiagnosis(input(['dots']));
  assert.deepEqual(dots.alternatives.map(c => c.id), ['velvet-fresh']);
  assert.equal(dots.naturalNote, ALTERNATIVE_TEXT.natural);
  for (const water of ['fresh', 'marine']) for (const sign of SYMPTOMS) for (const closer of closerQuestionFor(sign.id, water)?.choices.map(c => c.id) || ['']) {
    const result = assessDiagnosis(input([sign.id], { water, closer }));
    assert.ok(result.alternatives.length <= 3, `${water} ${sign.id}`);
    assert.ok(!result.alternatives.some(c => c.id === 'normal'));
    assert.ok(!result.alternatives.some(c => result.findings.some(f => f.id === c.id)));
  }
  // Ranking is unchanged otherwise: marine white dots keep velvet, then black spot.
  assert.deepEqual(assessDiagnosis(input(['dots'], { water: 'marine', closer: 'white' })).alternatives.map(c => c.id), ['velvet-marine', 'black-spot']);
  // A swollen belly gets the belly wording, not "markings"; a flat patch gets no line.
  assert.equal(assessDiagnosis(input(['swollen'])).naturalNote, ALTERNATIVE_TEXT.naturalBelly);
  assert.equal(assessDiagnosis(input(['patch'], { closer: 'flat' })).naturalNote, '');
});

test('every could-also reason is a short check the keeper can do', () => {
  for (const water of ['fresh', 'marine']) for (const fish of [{ id: '' }, ...FISH_TYPES[water]]) for (const sign of SYMPTOMS) for (const closer of closerQuestionFor(sign.id, water)?.choices.map(c => c.id) || ['']) {
    for (const c of assessDiagnosis(input([sign.id], { water, fishType: fish.id, closer })).alternatives) {
      assert.match(c.comparisonReason, /^(Look|Shine|Check|Watch|Test|Change)\b/, `${c.id}: ${c.comparisonReason}`);
      assert.ok(c.comparisonReason.split(/\s+/).length <= 12, `${c.id}: ${c.comparisonReason}`);
    }
  }
  for (const c of CONDITIONS) assert.ok(LOOK_FOR[c.id] && TREATMENT_FAMILY[c.id], c.id);
});

test('danger flag only when the look-alike is strictly more urgent than the top result', () => {
  const flags = result => Object.fromEntries(result.alternatives.map(c => [c.id, c.moreUrgent]));
  assert.deepEqual(flags(assessDiagnosis(input(['dots']))), { 'velvet-fresh': true }); // today vs week
  assert.deepEqual(flags(assessDiagnosis(input(['dust']))), { 'ich-fresh': false }); // week vs today
  assert.equal(flags(assessDiagnosis(input(['fuzz']))).columnaris, true);
  assert.equal(flags(assessDiagnosis(input(['sores'], { closer: 'open' }))).septicemia, true);
  assert.equal(flags(assessDiagnosis(input(['sores'], { closer: 'open' }))).injury, false); // watch vs week
  // Same level is not "more dangerous": marine velvet vs Brooklynella are both "today".
  assert.equal(flags(assessDiagnosis(input(['dust'], { water: 'marine' }))).brooklynella, false);
  // Distress makes everything "today", so nothing is flagged.
  assert.ok(assessDiagnosis(input(['dots'], { behaviors: ['gasping'] })).alternatives.every(c => !c.moreUrgent));
  for (const water of ['fresh', 'marine']) for (const sign of SYMPTOMS) {
    const result = assessDiagnosis(input([sign.id], { water }));
    for (const c of result.alternatives) assert.equal(c.moreUrgent, URGENCY[c.urgencyLevel].rank > URGENCY[result.primary.urgencyLevel].rank);
  }
});

test('treatment notes come from an explicit treatment family per condition', () => {
  assert.equal(treatmentNote('velvet-fresh', 'ich-fresh'), 'same');
  assert.equal(treatmentNote('ich-marine', 'velvet-marine'), 'same');
  assert.equal(treatmentNote('columnaris', 'water-mold'), 'different');
  assert.equal(treatmentNote('water-mold', 'columnaris'), 'different');
  assert.equal(treatmentNote('ich-marine', 'black-spot'), 'different');
  assert.equal(treatmentNote('bloat', 'swim-bladder'), 'same');
  assert.equal(treatmentNote('normal', 'growth'), '');
  assert.equal(assessDiagnosis(input(['dots'])).alternatives[0].treatmentNote, 'same');
  assert.equal(assessDiagnosis(input(['fuzz'])).alternatives.find(c => c.id === 'columnaris').treatmentNote, 'different');
  for (const id of Object.keys(TREATMENT_FAMILY)) assert.ok(CONDITIONS.some(c => c.id === id), id);
});

test('"This looks more like mine" swaps the result coherently', () => {
  const dots = input(['dots'], { fishType: 'betta' });
  const swapped = assessDiagnosis({ ...dots, chosen: ['velvet-fresh'] });
  assert.equal(swapped.primary.id, 'velvet-fresh');
  assert.equal(swapped.title, 'Most likely: Velvet');
  assert.equal(swapped.chosen, true);
  assert.equal(swapped.primary.urgencyLevel, 'today');
  assert.ok(swapped.primary.plan.steps.length >= 3);
  assert.match(swapped.primary.plan.treatment, /velvet/i);
  assert.deepEqual(swapped.findings.map(c => c.id), ['velvet-fresh']);
  assert.equal(swapped.alternatives[0].id, 'ich-fresh', 'the old top guess moves into could-also');
  assert.ok(!swapped.alternatives.some(c => c.id === 'velvet-fresh'));
  assert.equal(swapped.alternatives[0].moreUrgent, false);
  assert.equal(swapped.alternatives[0].treatmentNote, 'same');
  assert.match(swapped.alternatives[0].comparisonReason, /^Look for bigger, separate white grains/);
  assert.match(buildCase({ ...dots, chosen: ['velvet-fresh'] }), /Most likely: Velvet \(Act today\) — I picked this/);
  // Picking the old guess back, or an id that isn't listed, is coherent too.
  assert.equal(assessDiagnosis({ ...dots, chosen: ['velvet-fresh', 'ich-fresh'] }).primary.id, 'ich-fresh');
  assert.equal(assessDiagnosis({ ...dots, chosen: ['dropsy'] }).primary.id, 'ich-fresh');
  assert.equal(assessDiagnosis({ ...dots, chosen: ['dropsy'] }).chosen, false);
  // Fungus -> columnaris: its own plan, fungus listed with "different treatment".
  const fuzz = assessDiagnosis(input(['fuzz'], { chosen: ['columnaris'] }));
  assert.equal(fuzz.primary.id, 'columnaris');
  assert.match(fuzz.primary.plan.treatment, /Antibacterial/);
  assert.deepEqual(fuzz.alternatives.map(c => [c.id, c.treatmentNote]), [['water-mold', 'different']]);
  // Two problems: the pick replaces the finding it was listed for and leads.
  const two = assessDiagnosis(input(['dots', 'fuzz'], { chosen: ['columnaris'] }));
  assert.deepEqual(two.findings.map(c => c.id), ['columnaris', 'ich-fresh']);
  assert.ok(two.alternatives.some(c => c.id === 'water-mold'));
  // Every listed look-alike can be chosen and yields a full, self-consistent result.
  for (const water of ['fresh', 'marine']) for (const sign of SYMPTOMS) {
    const base = input([sign.id], { water });
    const before = assessDiagnosis(base);
    for (const alt of before.alternatives) {
      const after = assessDiagnosis({ ...base, chosen: [alt.id] });
      assert.equal(after.primary.id, alt.id);
      assert.ok(after.primary.plan, `${alt.id} plan`);
      assert.ok(!after.alternatives.some(c => c.id === alt.id));
      assert.equal(after.alternatives[0].id, before.primary.id, `${water} ${sign.id} -> ${alt.id}`);
      assert.ok(after.alternatives.length <= 3);
    }
  }
});
