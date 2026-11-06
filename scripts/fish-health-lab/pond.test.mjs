// Pond section (Jez, Nov 6 2026 07:32 EST: "add the pond section"): koi, pond goldfish, other pond fish.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { REEF_KINDS, REEF_CONDITIONS, REEF_CHANGES } from '../../experiments/fish-health-lab/reef-data.mjs';
import { POND_CONDITIONS, POND_SIGNS, POND_PLANS, POND_LOOKALIKES } from '../../experiments/fish-health-lab/pond-data.mjs';
import { assessReef, reefSignsFor } from '../../experiments/fish-health-lab/reef-logic.mjs';
import { reefPlanFor, STEP_TAGS } from '../../experiments/fish-health-lab/reef-care.mjs';
import { REEF_IMAGES, POND_SET, reefImageFor, reefSlotsFor } from '../../experiments/fish-health-lab/reef-images.mjs';
import { CROPS as POND_CROPS, IMAGE_SOURCE as POND_IMAGE_SOURCE } from '../../experiments/fish-health-lab/reef-images-pond-data.mjs';
import { CROPS as FIX_CROPS } from '../../experiments/fish-health-lab/fish-images-fixes-data.mjs';
import { URGENCY, CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';

const app = fileURLToPath(new URL('../../experiments/fish-health-lab/', import.meta.url));
const receipt = JSON.parse(readFileSync(new URL('./pond-images-20261106.json', import.meta.url)));
const kinds = ['', ...REEF_KINDS.pond.map(k => k.id)];
const reachable = () => kinds.flatMap(kind => reefSignsFor('pond', kind).map(s => ({ kind, sign: s.id })));
const lead = (kind, sign, changes = []) => assessReef({ group: 'pond', kind, sign, changes }).primary?.id;

test('pond kinds and every reachable sign give a named best guess with a plan and ≤ 3 look-alikes', () => {
  assert.deepEqual(REEF_KINDS.pond.map(k => k.id), ['koi', 'goldfish', 'other']);
  const cases = reachable();
  assert.ok(cases.length >= 40, `${cases.length}`);
  for (const { kind, sign } of cases) for (const changes of [[], REEF_CHANGES.pond.map(c => c.id)]) {
    const r = assessReef({ group: 'pond', kind, sign, changes });
    assert.ok(r.primary, `${kind}:${sign}`);
    assert.equal(r.primary.group, 'pond');
    assert.ok(URGENCY[r.primary.urgencyLevel], r.primary.id);
    assert.ok(r.primary.plan?.steps.length, r.primary.id);
    assert.ok(r.alternatives.length <= 3);
    for (const a of r.alternatives) assert.equal(a.group, 'pond');
    assert.equal(r.warning, '');
  }
});

test('pond signs lead to the expected condition', () => {
  const want = { worm: 'anchor-worm', lice: 'fish-lice', ulcer: 'pond-ulcer', 'red-streaks': 'pond-bacterial', 'white-spots': 'pond-ich',
    cotton: 'pond-fungus', 'scales-up': 'pond-dropsy', flashing: 'pond-flukes', gasping: 'pond-low-oxygen', floating: 'pond-swim-bladder', missing: 'predator' };
  for (const [sign, id] of Object.entries(want)) assert.equal(lead('', sign), id, sign);
  assert.equal(lead('koi', 'wax'), 'carp-pox');
  assert.equal(lead('koi', 'sunken-eyes'), 'khv');
  assert.equal(lead('', 'lethargic', ['cold']), 'winter-rest');
  assert.equal(lead('', 'unclear', ['top-up']), 'pond-water-swing');
  assert.equal(lead('', 'gasping', ['heat']), 'pond-low-oxygen');
  // KHV and carp pox only show for the fish that get them.
  assert.ok(!reefSignsFor('pond', 'goldfish').some(s => s.id === 'sunken-eyes'));
  assert.ok(!reefSignsFor('pond', 'other').some(s => s.id === 'wax'));
});

test('pond conditions are complete: plans, look-alikes, unique ids, sensible tags', () => {
  const fishIds = new Set(CONDITIONS.map(c => c.id));
  for (const c of POND_CONDITIONS) {
    assert.ok(!fishIds.has(c.id), `${c.id} clashes with a fish id`);
    assert.equal(REEF_CONDITIONS.filter(x => x.id === c.id).length, 1, c.id);
    assert.ok(POND_PLANS[c.id], `${c.id} plan`);
    const plan = reefPlanFor(c.id);
    assert.ok(plan.steps.some(s => /^Test ammonia, nitrite, pH and KH/.test(s.text)), `${c.id} tests the water`);
    for (const s of plan.steps) {
      if (s.tag) assert.ok(STEP_TAGS[s.tag], s.tag);
      assert.doesNotMatch(s.text, /\b\d+(\.\d+)?\s*(ml|mL|drops?|mg|teaspoons?|tsp|g)\b/, `${c.id}: no doses`);
      assert.doesNotMatch(s.text, /copper/i, `${c.id}: no copper in a pond plan`);
    }
    for (const [id] of POND_LOOKALIKES[c.id] || []) if (id) assert.equal(REEF_CONDITIONS.find(x => x.id === id)?.group, 'pond', `${c.id} → ${id}`);
  }
  assert.ok(POND_SIGNS.every(s => POND_CONDITIONS.some(c => c.weights[s.id] > 0)), 'every sign fits a condition');
});

test('pond pictures: every kind, sign and result has one; every crop is used; receipt matches', () => {
  for (const k of REEF_KINDS.pond) assert.ok(reefImageFor('pond', k.id, '', 'kinds'), k.id);
  for (const { kind, sign } of reachable()) assert.ok(reefImageFor('pond', sign, kind, 'signs'), `${kind}:${sign}`);
  for (const c of POND_CONDITIONS) {
    assert.ok(reefImageFor('pond', c.id), c.id);
    assert.ok(reefSlotsFor('pond', c.id).filter(s => s.image).length >= 1, c.id);
  }
  // A result and its could-also cards never share a picture.
  for (const { kind, sign } of reachable()) {
    const r = assessReef({ group: 'pond', kind, sign, changes: [] });
    const hero = reefImageFor('pond', r.primary.id, kind)?.url;
    for (const a of r.alternatives) assert.notEqual(reefImageFor('pond', a.id, kind)?.url, hero, `${kind}:${sign} ${a.id}`);
  }
  const used = new Set([...Object.values(POND_SET.kinds), ...Object.values(POND_SET.signs), ...Object.values(POND_SET.conditions).flat()]);
  assert.deepEqual([...used].sort(), Object.keys(POND_CROPS).sort());
  assert.equal(receipt.assets.length, 36);
  assert.equal(receipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  for (const a of receipt.assets) {
    assert.equal(POND_CROPS[a.id].key, a.r2Key);
    assert.ok(a.r2Key.endsWith(`-${a.sha256.slice(0, 12)}.jpg`));
    assert.equal(a.resized, false);
    assert.equal(a.uploaded, POND_IMAGE_SOURCE === 'media');
    if (POND_IMAGE_SOURCE === 'local') assert.ok(existsSync(app + a.path), a.path);
  }
  // The gory first takes of the KHV pictures are replaced by the clean-up retakes.
  for (const id of ['sign-sunken-eyes', 'cond-khv']) {
    assert.equal(FIX_CROPS[id]?.set, 'pond', id);
    assert.equal(REEF_IMAGES.pond.conditions.khv.find(i => i.id === id).key, FIX_CROPS[id].key, id);
  }
});
