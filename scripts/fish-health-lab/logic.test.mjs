import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessUrgency, rankConditions, buildCase, describeIchPattern, rankVisualConditions, lookalikesFor } from '../../experiments/fish-health-lab/logic.mjs';
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
test('observation notes distinguish blank from zero and contain no AI handoff', () => {
  const notes = buildCase({ ...base, ammonia: '0', species: '<test>' });
  assert.match(notes, /Total ammonia: 0 ppm/);
  assert.match(notes, /Nitrite: Not measured \/ unknown/);
  assert.doesNotMatch(notes, /FOR AN AI|ChatGPT|attach.*photo/i);
  assert.match(notes, /not a confirmed diagnosis/);
  assert.match(notes, /<test>/); // plain-text export, not rendered as HTML
});
test('visual reference choices are not diagnostic evidence or extra ranking weight', () => {
  const observations = { ...base, signs: ['dots'] };
  assert.deepEqual(rankConditions({ ...observations, visualReference: 'velvet-marine', comparisons: ['ulcer','dropsy'] }), rankConditions(observations));
  const notes = buildCase({ ...observations, visualReference: 'ich-fresh', comparisons: ['ich-fresh','velvet-fresh'] });
  assert.match(notes, /NOT evidence of a diagnosis\): Freshwater ich/);
  assert.match(notes, /user selections, not diagnoses\): Freshwater ich; Freshwater velvet/);
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

test('ich walkthrough follows observed texture rather than forcing an ich conclusion', () => {
  assert.match(describeIchPattern({ ...base, signs: ['dots'] }).title, /one possibility/);
  for (const sign of ['dust','fuzz','patch','lumps']) assert.match(describeIchPattern({ ...base, signs: [sign] }).title, /less typical/);
  assert.match(describeIchPattern(base).title, /no clear visual match/);
  assert.match(describeIchPattern({ ...base, water: 'marine', signs: ['dots'] }).title, /not a freshwater/);
  assert.deepEqual(rankConditions({ ...base, signs: ['dots'], visualExtent: 'Many or obvious visible changes' }),rankConditions({ ...base, signs: ['dots'], visualExtent: 'Few or subtle visible changes' }));
});


test('ich visual comparisons never admit unrelated conditions through nonspecific behavior', () => {
  const behaviors = ['appetite','rubbing','clamped','gasping','pinecone','collapse','deaths'];
  for (let mask=0;mask<2**behaviors.length;mask++) {
    const input = {...base, primarySign:'dots', signs:['dots',...behaviors.filter((_,i)=>mask&(1<<i))]};
    const first = rankVisualConditions(input)[0];
    assert.equal(first.id,'ich-fresh');
    const others = lookalikesFor(first.id,input.water);
    assert.deepEqual(others.map(c=>c.id),['velvet-fresh','growth','normal']);
    assert.ok(others.every(c=>c.comparisonReason));
  }
});
test('velvet and cottony-growth branches follow texture, not appetite or water scores', () => {
  for(const [sign,id] of [['dust','velvet-fresh'],['fuzz','water-mold']]) {
    const input={...base,primarySign:sign,signs:[sign,'appetite','gasping'],ammonia:'2',affected:'several'};
    assert.equal(rankVisualConditions(input)[0].id,id);
    assert.ok(assessUrgency(input).checks.length>0);
    assert.ok(lookalikesFor(id,'fresh').every(c=>c.scope!=='marine'));
  }
  assert.deepEqual(lookalikesFor('water-mold','fresh').map(c=>c.id),['columnaris','growth']);
});
test('unclear signs do not force a visual diagnosis, and unknown water retains both parasite types', () => {
  assert.deepEqual(rankVisualConditions({...base,primarySign:'unclear',signs:['unclear','appetite']}),[]);
  assert.equal(rankVisualConditions({...base,primarySign:'breathing',signs:['breathing']})[0].id,'water');
  assert.ok(lookalikesFor('ich-fresh','unknown').some(c=>c.id==='ich-marine'));
  assert.ok(lookalikesFor('ich-marine','marine').every(c=>c.scope!=='fresh'));
  assert.deepEqual(rankVisualConditions({...base,water:'marine',primarySign:'fuzz',signs:['fuzz']}),[]);
});
test('care observations never overwrite the visual match or contaminate exported comparison notes', () => {
  const input={...base,primarySign:'dots',signs:['dots','appetite'],ammonia:'2',affected:'several'};
  assert.equal(rankVisualConditions(input)[0].id,'ich-fresh');
  assert.equal(assessUrgency(input).level,'check-water');
  const notes=buildCase(input);
  assert.match(notes,/Ammonia is detectable/);
  assert.match(notes,/Probable diagnosis \/ possible problems: Freshwater ich/);
  assert.match(notes,/Other similar-looking possibilities: Freshwater velvet/);
  assert.doesNotMatch(notes,/Buoyancy or balance problem|dropsy-like|Cloudy or protruding/);
});
test('three freshwater galleries contain all six image views with distinct assets', () => {
  for(const id of ['ich-fresh','velvet-fresh','water-mold']) {
    assert.equal(VISUAL_LIBRARY[id].filter(s=>s.image).length,6);
    assert.equal(new Set(VISUAL_LIBRARY[id].map(s=>s.image.url)).size,6);
  }
  assert.equal(Object.values(VISUAL_LIBRARY).flat().filter(s=>s.image).length,18);
});
