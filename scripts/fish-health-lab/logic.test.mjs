import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessUrgency, rankConditions, buildCase } from '../../experiments/fish-health-lab/logic.mjs';
import { VISUAL_LIBRARY } from '../../experiments/fish-health-lab/visuals.mjs';

const base = { water: 'fresh', signs: [], ammonia: '', nitrite: '', ph: '', temperature: '' };
test('blank water measurements stay unknown; measured zero is known', () => {
  assert.equal(assessUrgency(base).waterUnknown, true);
  const measured = assessUrgency({ ...base, ammonia: '0', nitrite: '0' });
  assert.equal(measured.waterUnknown, false);
  assert.equal(measured.checks.length, 0);
});
test('freshwater salt-grain signs bring ich and relevant look-alikes, never marine causes', () => {
  const results = rankConditions({ ...base, signs: ['dots', 'rubbing'] });
  assert.equal(results[0].id, 'ich-fresh');
  assert.ok(results.some(c => c.id === 'velvet-fresh'));
  assert.ok(results.some(c => c.id === 'normal'));
  assert.ok(results.every(c => c.scope !== 'marine'));
});
test('marine cases do not receive freshwater ich, columnaris or freshwater water-mold advice', () => {
  const results = rankConditions({ ...base, water: 'marine', signs: ['dots', 'fuzz', 'patch'] });
  assert.ok(results.some(c => c.id === 'ich-marine'));
  assert.ok(results.every(c => c.scope !== 'fresh'));
});
test('unknown water type keeps both environments explicit rather than assuming freshwater', () => {
  const results = rankConditions({ ...base, water: 'unknown', signs: ['dots'] });
  assert.ok(results.some(c => c.id === 'ich-fresh'));
  assert.ok(results.some(c => c.id === 'ich-marine'));
});
test('oxygen/distress and pineconing get urgent flags regardless of spot pattern', () => {
  for (const sign of ['gasping','collapse','deaths','pinecone']) assert.equal(assessUrgency({ ...base, signs: [sign] }).level, 'urgent');
  assert.equal(assessUrgency({ ...base, water: 'marine', signs: ['dust','breathing'] }).level, 'urgent');
});
test('tank context can prioritize environmental checks even when there are spots', () => {
  const input = { ...base, signs: ['dots'], tankAge: 'new', affected: 'several', ammonia: '1', nitrite: '0.5' };
  assert.equal(rankConditions(input)[0].id, 'water');
  assert.equal(assessUrgency(input).checks.length, 4);
});
test('nitrite guidance does not treat marine toxicity as equivalent to freshwater', () => {
  const result = assessUrgency({ ...base, water: 'marine', nitrite: '1' });
  assert.match(result.checks[0], /toxicity differs/);
});
test('no signs does not invent an infectious diagnosis', () => {
  assert.deepEqual(rankConditions(base), []);
});
test('case notes distinguish blank from zero, and photos from actual image analysis', () => {
  const notes = buildCase({ ...base, ammonia: '0', hasPhoto: true, species: '<test>' });
  assert.match(notes, /Total ammonia: 0 ppm/);
  assert.match(notes, /Nitrite: Not measured \/ unknown/);
  assert.match(notes, /has NOT been analyzed or sent/);
  assert.match(notes, /not a diagnosis/);
  assert.match(notes, /<test>/); // plain-text export, not rendered as HTML
});
test('visual reference choices are not diagnostic evidence or extra ranking weight', () => {
  const observations = { ...base, signs: ['dots'] };
  assert.deepEqual(rankConditions({ ...observations, visualReference: 'velvet-marine', comparisons: ['ulcer','dropsy'] }), rankConditions(observations));
  const notes = buildCase({ ...observations, visualReference: 'ich-fresh', comparisons: ['ich-fresh','velvet-fresh'] });
  assert.match(notes, /NOT evidence of a diagnosis\): Freshwater ich/);
  assert.match(notes, /NOT image-analysis results\): Freshwater ich; Freshwater velvet/);
});
test('reference assets have explicit provenance; absent assets remain null rather than broken or invented examples', () => {
  for (const slots of Object.values(VISUAL_LIBRARY)) for (const slot of slots) {
    if (slot.image) {
      assert.ok(new URL(slot.image.url).protocol === 'https:');
      assert.ok(slot.image.alt && slot.image.caption && slot.image.provenance && slot.image.source);
      assert.match(slot.image.provenance, /AI educational illustration/);
      assert.match(slot.image.source, /not.*confirmed patient/);
    } else assert.equal(slot.image, null);
  }
});
