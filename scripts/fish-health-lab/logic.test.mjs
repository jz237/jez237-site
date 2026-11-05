import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessUrgency, rankConditions, buildCase, rankVisualConditions, lookalikesFor, weightOf, featureKeys } from '../../experiments/fish-health-lab/logic.mjs';
import { CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';
import { VISUAL_LIBRARY } from '../../experiments/fish-health-lab/visuals.mjs';

const base = { water: 'fresh', signs: [], ammonia: '', nitrite: '', ph: '', temperature: '' };
test('blank water measurements stay unknown; measured zero is known', () => {
  assert.equal(assessUrgency(base).waterUnknown, true);
  const measured = assessUrgency({ ...base, ammonia: '0', nitrite: '0' });
  assert.equal(measured.waterUnknown, false);
  assert.equal(measured.checks.length, 0);
});
test('freshwater and marine conditions stay separated in the library ranking', () => {
  const fresh = rankConditions({ ...base, signs: ['dots', 'rubbing'] });
  assert.equal(fresh[0].id, 'ich-fresh');
  assert.ok(fresh.every(c => c.scope !== 'marine'));
  const marine = rankConditions({ ...base, water: 'marine', signs: ['dots', 'fuzz', 'patch'] });
  assert.ok(marine.some(c => c.id === 'ich-marine'));
  assert.ok(marine.some(c => c.id === 'brooklynella'));
  assert.ok(marine.every(c => c.scope !== 'fresh'));
  const unknown = rankConditions({ ...base, water: 'unknown', signs: ['dots'] });
  assert.ok(unknown.some(c => c.id === 'ich-fresh') && unknown.some(c => c.id === 'ich-marine'));
});
test('distress and pineconing get urgent flags; "other fish have it too" adds a water check', () => {
  for (const sign of ['gasping', 'collapse', 'deaths', 'pinecone']) assert.equal(assessUrgency({ ...base, signs: [sign] }).level, 'urgent');
  assert.equal(assessUrgency({ ...base, water: 'marine', signs: ['dust', 'breathing'] }).level, 'urgent');
  assert.match(assessUrgency({ ...base, signs: ['several'] }).checks.join(' '), /Several fish/);
});
test('tank context adds environmental checks', () => {
  const input = { ...base, signs: ['dots'], tankAge: 'new', affected: 'several', ammonia: '1', nitrite: '0.5' };
  assert.equal(assessUrgency(input).checks.length, 4);
  assert.match(assessUrgency({ ...base, water: 'marine', nitrite: '1' }).checks[0], /biological filter/);
});
test('refined closer keys override the base sign; zero rules a condition out', () => {
  const find = id => CONDITIONS.find(c => c.id === id);
  assert.equal(weightOf(find('columnaris'), 'patch:pits', 'fresh'), 0);
  assert.equal(weightOf(find('columnaris'), 'patch', 'fresh'), 5);
  assert.equal(weightOf(find('columnaris'), 'patch:unknown-choice', 'fresh'), 5);
  assert.equal(weightOf(find('flukes'), 'eyes:cloudy', 'marine'), 5);
  assert.equal(weightOf(find('flukes'), 'eyes:cloudy', 'fresh'), 0);
  assert.deepEqual(featureKeys({ water: 'marine', primarySign: 'dots', closer: 'black', visualSigns: ['dots'] }), ['dots:black']);
  assert.deepEqual(featureKeys({ water: 'fresh', primarySign: 'dots', closer: 'black', visualSigns: ['dots'] }), ['dots']);
  assert.deepEqual(featureKeys({ water: 'fresh', primarySign: 'unclear', visualSigns: ['unclear', 'eyes'] }), ['eyes']);
});
test('notes distinguish blank from zero and contain no AI handoff', () => {
  const notes = buildCase({ ...base, ammonia: '0', species: '<test>' });
  assert.match(notes, /Total ammonia: 0 ppm/);
  assert.match(notes, /Nitrite: Not measured \/ unknown/);
  assert.doesNotMatch(notes, /FOR AN AI|ChatGPT|attach.*photo/i);
  assert.match(notes, /<test>/); // plain-text export, not rendered as HTML
});
test('library picks and comparisons add no ranking weight', () => {
  const observations = { ...base, signs: ['dots'] };
  assert.deepEqual(rankConditions({ ...observations, visualReference: 'velvet-marine', comparisons: ['ulcer', 'dropsy'] }), rankConditions(observations));
  const notes = buildCase({ ...observations, primarySign: 'dots', visualSigns: ['dots'], visualReference: 'ich-fresh', comparisons: ['ich-fresh', 'velvet-fresh'] });
  assert.match(notes, /Picture page I started from: Ich/);
  assert.match(notes, /Entries I compared: Ich \(white spot disease\); Velvet/);
});
test('reference assets have explicit provenance; absent assets remain null', () => {
  for (const slots of Object.values(VISUAL_LIBRARY)) for (const slot of slots) {
    if (slot.image) {
      assert.ok(new URL(slot.image.url).protocol === 'https:');
      assert.ok(slot.image.alt && slot.image.caption && slot.image.provenance && slot.image.source);
      assert.match(slot.image.provenance, /AI educational illustration/);
    } else assert.equal(slot.image, null);
  }
});
test('white-dot look-alikes never pull in unrelated conditions through behavior', () => {
  const behaviors = ['appetite', 'rubbing', 'clamped', 'gasping', 'pinecone', 'collapse', 'deaths', 'red-gills', 'several'];
  for (let mask = 0; mask < 2 ** behaviors.length; mask++) {
    const input = { ...base, primarySign: 'dots', signs: ['dots', ...behaviors.filter((_, i) => mask & (1 << i))] };
    const ranked = rankVisualConditions(input);
    assert.equal(ranked[0].id, 'ich-fresh');
    assert.deepEqual(ranked.map(c => c.id).sort(), ['ich-fresh', 'normal']);
  }
  assert.deepEqual(lookalikesFor('ich-fresh', 'fresh').map(c => c.id), ['velvet-fresh', 'normal']);
  assert.ok(lookalikesFor('ich-marine', 'marine').every(c => c.scope !== 'fresh'));
  assert.ok(lookalikesFor('brooklynella', 'fresh').every(c => c.scope !== 'marine'));
});
test('care readings never overwrite the visual match', () => {
  const input = { ...base, primarySign: 'dots', visualSigns: ['dots'], signs: ['dots', 'appetite'], ammonia: '2', affected: 'several' };
  assert.equal(rankVisualConditions(input)[0].id, 'ich-fresh');
  assert.equal(assessUrgency(input).level, 'check-water');
  const notes = buildCase(input);
  assert.match(notes, /Ammonia is detectable/);
  assert.match(notes, /Most likely: Ich \(white spot disease\)/);
  assert.match(notes, /Could also be: Velvet/);
  assert.doesNotMatch(notes, /Swim bladder|Dropsy|Popeye/);
});
test('three freshwater galleries contain all six image views with distinct assets', () => {
  for (const id of ['ich-fresh', 'velvet-fresh', 'water-mold']) {
    assert.equal(VISUAL_LIBRARY[id].filter(s => s.image).length, 6);
    assert.equal(new Set(VISUAL_LIBRARY[id].map(s => s.image.url)).size, 6);
  }
  assert.equal(Object.values(VISUAL_LIBRARY).flat().filter(s => s.image).length, 18);
});
test('every condition has the content the result card needs', () => {
  for (const c of CONDITIONS) {
    for (const field of ['title', 'summary', 'hint', 'check', 'avoid', 'urgency', 'art']) assert.ok(c[field], `${c.id}.${field}`);
    assert.ok(c.clues.length >= 2, c.id);
  }
});
