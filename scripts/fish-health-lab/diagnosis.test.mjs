import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessDiagnosis, assessUrgency, buildCase } from '../../experiments/fish-health-lab/logic.mjs';
import { SYMPTOMS, BEHAVIORS } from '../../experiments/fish-health-lab/data.mjs';
import { signImagesFor } from '../../experiments/fish-health-lab/choice-images.mjs';

const input = (patterns, extra = {}) => ({ water: 'fresh', primarySign: patterns[0], visualSigns: patterns, signs: patterns, ...extra });
const ids = result => result.findings.map(c => c.id).sort();

test('white grains and cottony threads retain both plausible problems, not a forced single name', () => {
  const result = assessDiagnosis(input(['dots','fuzz']));
  assert.equal(result.status, 'multiple');
  assert.deepEqual(ids(result), ['ich-fresh','water-mold']);
  assert.deepEqual(result.unexplained, []);
  assert.match(result.messages.join(' '), /share a cause|more than one problem/);
  assert.ok(result.alternatives.every(c => !ids(result).includes(c.id)));
});

test('conflicting grains/dust and threads/patches are explained without silently dropping an answer', () => {
  const dust = assessDiagnosis(input(['dots','dust']));
  assert.deepEqual(ids(dust), ['ich-fresh','velvet-fresh']);
  assert.match(dust.messages.join(' '), /both separate grains and fine dust/);
  const patch = assessDiagnosis(input(['fuzz','patch']));
  assert.deepEqual(ids(patch), ['columnaris','water-mold']);
  assert.match(patch.messages.join(' '), /both outward threads and flat pale patches/);
});

test('one cause can connect pale patches and fin loss, independent of the order selected', () => {
  for (const signs of [['patch','fins'],['fins','patch']]) {
    const result = assessDiagnosis(input(signs));
    assert.equal(result.status, 'single');
    assert.deepEqual(ids(result), ['columnaris']);
    assert.deepEqual(new Set(result.primary.fits), new Set(signs));
  }
});

test('raised scales alongside white grains are a second concern, never an ich look-alike', () => {
  const result = assessDiagnosis(input(['dots'], { signs: ['dots','pinecone','appetite'] }));
  assert.deepEqual(ids(result), ['dropsy','ich-fresh']);
  assert.ok(result.urgent.some(message => /pinecone/.test(message)));
  assert.ok(!result.alternatives.some(c => ['dropsy','buoyancy','eye-change'].includes(c.id)));
});

test('nonspecific behavior adds urgency but does not invent eye, swelling or swimming diagnoses', () => {
  const result = assessDiagnosis(input(['dots'], { signs: ['dots','appetite','clamped','rubbing','gasping','collapse','deaths'] }));
  assert.deepEqual(ids(result), ['ich-fresh']);
  assert.equal(result.urgent.length, 3);
});

test('breathing alone is not labeled velvet; visible marine dust plus breathing can fit it', () => {
  assert.deepEqual(ids(assessDiagnosis(input(['breathing'], {water:'marine'}))), ['water']);
  const result = assessDiagnosis(input(['breathing','dust'], {water:'marine'}));
  assert.deepEqual(ids(result), ['velvet-marine']);
  assert.equal(result.urgent.length, 1);
});

test('abnormal water readings coexist with a visible problem instead of erasing it', () => {
  const result = assessDiagnosis(input(['dots'], {ammonia:'1', nitrite:'0', affected:'several'}));
  assert.deepEqual(ids(result), ['ich-fresh']);
  assert.deepEqual(result.contextConcerns.map(c => c.id), ['water']);
  assert.match(result.contextConcerns[0].reason, /Ammonia is detectable/);
  assert.match(result.messages.join(' '), /coexist with a skin problem/);
});

test('unsupported marine textures and vague answers remain explicitly unresolved', () => {
  const result = assessDiagnosis(input(['fuzz'], {water:'marine'}));
  assert.equal(result.status, 'insufficient');
  assert.deepEqual(result.findings, []);
  assert.deepEqual(result.unexplained, ['fuzz']);
  assert.equal(assessDiagnosis(input(['unclear'], {signs:['unclear','appetite']})).status, 'insufficient');
  const precise = assessDiagnosis(input(['unclear','eyes']));
  assert.deepEqual(ids(precise), ['eye-change']);
  assert.match(precise.messages.join(' '), /extra visible signs/);
});

test('closer texture choices take precedence transparently, without retaining an invented ich diagnosis', () => {
  const result = assessDiagnosis(input(['fuzz'], {initialSign:'dots', textureSign:'fuzz'}));
  assert.deepEqual(ids(result), ['water-mold']);
  assert.match(result.messages.join(' '), /used instead of the first/);
});

test('every offered single-picture/behavior combination preserves scope, distress and strong additional signs', () => {
  let cases = 0;
  for (const water of ['fresh','marine']) for (const sign of SYMPTOMS) for (let mask = 0; mask < 2 ** BEHAVIORS.length; mask++) {
    const behaviors = BEHAVIORS.filter((_, i) => mask & (1 << i)).map(b => b.id);
    const observation = input([sign.id], {water, signs:[sign.id,...behaviors]});
    const result = assessDiagnosis(observation);
    const entries = [...result.findings,...result.alternatives,...result.contextConcerns];
    assert.ok(entries.every(c => c.scope === 'both' || c.scope === water));
    assert.equal(new Set(result.findings.map(c => c.id)).size, result.findings.length);
    assert.deepEqual(result.urgent, assessUrgency(observation).urgent);
    if (behaviors.includes('pinecone')) assert.ok(result.findings.some(c => c.id === 'dropsy'));
    if (!behaviors.includes('pinecone') && sign.id !== 'swollen') assert.ok(!result.findings.some(c => c.id === 'dropsy'));
    cases++;
  }
  assert.equal(cases, 3072);
});

test('all 110 two-picture cases account for each selected appearance or explicitly leave it unresolved', () => {
  const signs = SYMPTOMS.filter(s => s.id !== 'unclear').map(s => s.id);
  let cases = 0;
  for (const water of ['fresh','marine']) for (let i=0;i<signs.length;i++) for(let j=i+1;j<signs.length;j++) {
    const result = assessDiagnosis(input([signs[i],signs[j]], {water}));
    for (const sign of [signs[i],signs[j]]) assert.ok(result.unexplained.includes(sign) || result.findings.some(c => c.fits.includes(sign)));
    assert.ok([...result.findings,...result.alternatives].every(c => c.scope === 'both' || c.scope === water));
    cases++;
  }
  assert.equal(cases, 110);
});

test('marine picture choices use a distinct complete set, never freshwater assets', () => {
  const fresh = signImagesFor('fresh'), marine = signImagesFor('marine');
  assert.equal(Object.keys(marine).length, 12);
  assert.equal(new Set(Object.values(marine).map(i => i.url)).size, 12);
  for (const id of Object.keys(fresh)) assert.notEqual(fresh[id].url, marine[id].url);
  assert.match(marine.dots.alt, /reef tang/);
  assert.match(marine.fins.alt, /clownfish/);
});

test('exported notes retain mixed findings and do not transmit or mistake notes for evidence', () => {
  const notes = buildCase(input(['dots','fuzz'], {notes:'PRIVATE-NOTE'}));
  assert.match(notes, /possible problems: Freshwater ich; Water mold/);
  assert.match(notes, /PRIVATE-NOTE/);
  assert.match(notes, /not a confirmed diagnosis/);
  assert.doesNotMatch(notes, /ChatGPT|microscop|wet mount|biopsy/i);
});
