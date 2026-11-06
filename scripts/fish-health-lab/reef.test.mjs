// Reef section (corals, anemones, shrimp/crabs/snails): logic, care plans and
// the empty picture manifest. Run: node --test scripts/fish-health-lab/reef.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessReef, rankReef, reefSignsFor, reefTreatmentNote, MAX_REEF_ALTERNATIVES } from '../../experiments/fish-health-lab/reef-logic.mjs';
import { REEF_GROUPS, REEF_KINDS, REEF_SIGNS, REEF_CHANGES, REEF_CONDITIONS, REEF_LOOKALIKES, REEF_TREATMENT_FAMILY } from '../../experiments/fish-health-lab/reef-data.mjs';
import { reefPlanFor, REEF_PLAN_IDS, INVERT_WARNING, STEP_TAGS } from '../../experiments/fish-health-lab/reef-care.mjs';
import { REEF_IMAGES, reefImagesFor, reefSlotsFor } from '../../experiments/fish-health-lab/reef-images.mjs';
import { URGENCY, CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';

const GROUPS = ['coral', 'invert'];
const kindsOf = group => ['', ...REEF_KINDS[group].map(k => k.id)];
// Every tile a visitor can actually reach: group × kind (incl. Not sure) × shown sign.
const reachable = () => GROUPS.flatMap(group => kindsOf(group).flatMap(kind => reefSignsFor(group, kind).map(s => ({ group, kind, sign: s.id }))));
const lead = (group, kind, sign, changes = []) => assessReef({ group, kind, sign, changes }).primary?.id;
const also = (group, kind, sign, changes = []) => assessReef({ group, kind, sign, changes }).alternatives.map(c => c.id);
const byId = id => REEF_CONDITIONS.find(c => c.id === id);

test('"What needs help?" has Fish, Coral or anemone, and Shrimp, crab or snail', () => {
  assert.deepEqual(REEF_GROUPS.map(g => g.id), ['fish', 'coral', 'invert']);
  assert.deepEqual(REEF_KINDS.coral.map(k => k.id), ['soft', 'lps', 'sps', 'anemone']);
  assert.deepEqual(REEF_KINDS.invert.map(k => k.id), ['shrimp', 'crab', 'snail', 'other']);
});

test('every reachable reef sign gives a named most-likely with a plan, and could-also stays ≤ 3', () => {
  const cases = reachable();
  assert.ok(cases.length > 60, `${cases.length} cases`);
  for (const c of cases) {
    for (const changes of [[], REEF_CHANGES[c.group].map(x => x.id)]) {
      const r = assessReef({ ...c, changes });
      const where = JSON.stringify({ ...c, changes });
      assert.ok(r.primary, `${where} has no result`);
      assert.match(r.title, /^Most likely: /);
      assert.equal(r.primary.group, c.group, where);
      assert.ok(!r.primary.kinds || !c.kind || r.primary.kinds.includes(c.kind), `${where}: ${r.primary.id} is for another kind`);
      assert.ok(r.primary.plan?.steps.length >= 3, `${where}: ${r.primary.id} has no plan`);
      assert.ok(URGENCY[r.primary.urgencyLevel], where);
      assert.ok(r.alternatives.length <= MAX_REEF_ALTERNATIVES, where);
      assert.ok(!r.alternatives.some(a => a.id === r.primary.id || a.natural || a.group !== c.group), `${where}: ${r.alternatives.map(a => a.id)}`);
      assert.ok(r.alternatives.every(a => a.comparisonReason && a.comparisonReason.split(/\s+/).length <= 14), `${where}: every card has a short check`);
    }
  }
});

test('reef results "make sense" for common cases', () => {
  // [group, kind, sign, changes, expected most likely, must appear in could-also, must not appear]
  const table = [
    ['coral', 'sps', 'peeling', [], 'rtn', ['stn', 'alk-swing'], ['zoa-pests', 'anemone-stress']],
    ['coral', 'lps', 'peeling', [], 'alk-swing', ['brown-jelly'], ['rtn', 'stn']],
    ['coral', 'lps', 'brown-jelly', [], 'brown-jelly', ['alk-swing'], ['rtn']],
    ['coral', 'sps', 'brown-jelly', [], 'brown-jelly', ['rtn'], []],
    ['coral', '', 'bleach', [], 'bleaching', ['light-shock', 'low-nutrients'], ['anemone-stress', 'red-bugs']],
    ['coral', 'sps', 'bleach', ['new-coral'], 'light-shock', ['bleaching'], []],
    ['coral', 'sps', 'bleach', ['light'], 'light-shock', ['bleaching'], []],
    ['coral', 'sps', 'bleach', ['temp'], 'bleaching', ['light-shock'], []],
    ['coral', 'soft', 'closed', [], 'alk-swing', ['flow-placement', 'light-shock'], ['coral-normal']],
    ['coral', 'lps', 'closed', ['new-coral'], 'light-shock', [], []],
    ['coral', 'sps', 'closed', ['alk'], 'alk-swing', [], []],
    ['coral', '', 'browning', [], 'high-nutrients', ['flow-placement'], ['red-bugs']],
    ['coral', 'sps', 'browning', [], 'high-nutrients', ['flow-placement', 'red-bugs'], []],
    ['coral', 'sps', 'red-bugs', [], 'red-bugs', ['aefw'], []],
    ['coral', 'sps', 'flatworms', [], 'aefw', ['red-bugs'], []],
    ['coral', 'sps', 'slugs', [], 'monti-nudi', ['aefw'], ['zoa-pests']],
    ['coral', 'soft', 'slugs', [], 'zoa-pests', [], ['monti-nudi', 'aefw']],
    ['coral', 'sps', 'bites', [], 'aefw', ['nipped'], []],
    ['coral', 'sps', 'bites', ['new-livestock'], 'nipped', ['aefw'], []],
    ['coral', 'lps', 'bites', [], 'nipped', [], ['aefw', 'monti-nudi', 'zoa-pests']],
    ['coral', 'soft', 'zoa-melt', [], 'zoa-pests', ['light-shock'], []],
    ['coral', 'anemone', 'anemone', [], 'anemone-stress', ['flow-placement'], ['rtn']],
    ['coral', 'anemone', 'bleach', [], 'bleaching', ['light-shock'], []],
    ['coral', '', 'aiptasia', [], 'aiptasia', [], []],
    ['coral', '', 'unclear', [], 'alk-swing', ['low-nutrients'], []],
    ['invert', 'shrimp', 'molt-stuck', [], 'failed-molt', ['normal-molt'], []],
    ['invert', 'shrimp', 'empty-shell', [], 'normal-molt', ['failed-molt'], []],
    ['invert', 'shrimp', 'pale', [], 'invert-water', ['acclimation', 'copper'], []],
    ['invert', 'shrimp', 'pale', ['new-arrival'], 'acclimation', ['invert-water'], []],
    ['invert', '', 'deaths', [], 'copper', ['invert-water', 'acclimation'], []],
    ['invert', 'crab', 'deaths', ['new-arrival'], 'acclimation', ['copper'], []],
    ['invert', 'snail', 'not-moving', [], 'flipped', ['starvation'], []],
    ['invert', 'crab', 'not-moving', [], 'invert-water', ['acclimation'], ['flipped']],
    ['invert', 'shrimp', 'bulge', [], 'bopyrid', [], []],
    ['invert', 'crab', 'legs', [], 'invert-injury', [], ['normal-molt']],
    ['invert', 'shrimp', 'color', [], 'starvation', ['invert-water'], ['flipped']],
    ['invert', 'other', 'spines', [], 'invert-water', ['acclimation', 'copper'], []],
    ['invert', 'other', 'spines', ['new-arrival'], 'acclimation', [], []],
    ['invert', 'shrimp', 'molt-stuck', ['medicine'], 'failed-molt', [], []],
  ];
  for (const [group, kind, sign, changes, expected, must, mustNot] of table) {
    const where = `${group}/${kind || 'not sure'}/${sign}${changes.length ? ` + ${changes}` : ''}`;
    assert.equal(lead(group, kind, sign, changes), expected, where);
    const ids = also(group, kind, sign, changes);
    for (const id of must) assert.ok(ids.includes(id), `${where} should list ${id}: ${ids}`);
    for (const id of mustNot) assert.ok(!ids.includes(id), `${where} should not list ${id}: ${ids}`);
  }
});

test('kind and recent changes only re-weight conditions that already fit the sign', () => {
  for (const { group, kind, sign } of reachable()) {
    const plain = new Set(rankReef({ group, kind, sign }).map(c => c.id));
    const changed = rankReef({ group, kind, sign, changes: REEF_CHANGES[group].map(c => c.id) }).map(c => c.id);
    assert.deepEqual(new Set(changed), plain, `${group}/${kind}/${sign}: changes added a condition`);
  }
  // Not sure keeps every condition of the group; a kind narrows it.
  const notSure = rankReef({ group: 'coral', kind: '', sign: 'peeling' }).map(c => c.id);
  assert.ok(notSure.includes('rtn') && notSure.includes('stn'));
  assert.ok(!rankReef({ group: 'coral', kind: 'lps', sign: 'peeling' }).some(c => ['rtn', 'stn'].includes(c.id)));
});

test('sign tiles follow the kind; Not sure shows them all', () => {
  for (const group of GROUPS) {
    assert.equal(reefSignsFor(group, '').length, REEF_SIGNS[group].length);
    for (const kind of kindsOf(group).slice(1)) assert.ok(reefSignsFor(group, kind).length >= 3, `${group}/${kind} needs at least 3 sign tiles`);
  }
  assert.ok(reefSignsFor('coral', 'sps').some(s => s.id === 'peeling'));
  assert.ok(!reefSignsFor('coral', 'anemone').some(s => s.id === 'peeling'));
  assert.ok(reefSignsFor('coral', 'anemone').some(s => s.id === 'anemone'));
  assert.ok(reefSignsFor('invert', 'shrimp').some(s => s.id === 'molt-stuck'));
  assert.ok(!reefSignsFor('invert', 'snail').some(s => s.id === 'molt-stuck'));
});

test('every invert result carries the copper warning; coral results do not', () => {
  for (const c of reachable()) {
    const r = assessReef(c);
    if (c.group === 'invert') {
      assert.equal(r.warning, INVERT_WARNING);
      assert.match(r.warning, /copper/i);
      assert.match(r.warning, /fish medicines kill/i);
    } else assert.equal(r.warning, '');
  }
});

test('reef care plans never put copper or fish medicine in the display', () => {
  const meds = /copper|formalin|chloroquine|praziquantel|antibiotic|metronidazole|malachite|methylene|medicin|medicat|ich (cure|treatment)/i;
  const safeContext = /never|don[’']t|do not|stop|remov|test for|copper-free/i;
  assert.deepEqual([...REEF_PLAN_IDS].sort(), REEF_CONDITIONS.map(c => c.id).sort());
  for (const id of REEF_PLAN_IDS) {
    const plan = reefPlanFor(id);
    for (const step of plan.steps) {
      if (meds.test(step.text)) assert.match(step.text, safeContext, `${id}: "${step.text}" suggests a medicine in the display`);
      if (/\bdip\b/i.test(step.text) && !/don[’']t/i.test(step.text)) assert.equal(step.tag, 'dip', `${id}: a dip step must be tagged as a separate dip`);
      if (step.tag) assert.ok(STEP_TAGS[step.tag], `${id}: unknown tag ${step.tag}`);
      assert.doesNotMatch(step.text, /\b\d+(\.\d+)?\s*(ml|mL|drops?|mg|teaspoons?|tsp)\b/, `${id}: no doses`);
    }
    assert.ok(plan.treatment && plan.recovery, id);
    const summary = `${plan.treatment} ${plan.recovery}`;
    if (meds.test(summary)) assert.match(summary, /no medicine|stop the medicine/i, id);
  }
  assert.equal(STEP_TAGS.dip, 'Separate dip — never in the display');
  // Pest plans all use a separate dip.
  for (const id of ['red-bugs', 'aefw', 'monti-nudi', 'zoa-pests']) assert.ok(reefPlanFor(id).dip, id);
});

test('reef care plans lead with the tests (alk, Ca, Mg, nitrate, phosphate, temp, salinity)', () => {
  for (const c of REEF_CONDITIONS) {
    const first = reefPlanFor(c.id).steps[0].text;
    if (c.group === 'coral') for (const word of ['alkalinity', 'calcium', 'magnesium', 'nitrate', 'phosphate', 'temperature', 'salinity']) assert.match(first, new RegExp(word, 'i'), `${c.id} test step misses ${word}`);
    else for (const word of ['salinity', 'temperature', 'ammonia']) assert.match(first, new RegExp(word, 'i'), `${c.id} test step misses ${word}`);
    assert.match(first, /^Test /);
  }
});

test('"This looks more like mine" swaps coherently and the old guess comes back first', () => {
  for (const c of reachable()) {
    const before = assessReef(c);
    for (const alt of before.alternatives) {
      const after = assessReef({ ...c, chosen: [alt.id] });
      assert.equal(after.primary.id, alt.id);
      assert.equal(after.chosen, true);
      assert.equal(after.alternatives[0]?.id, before.primary.id, `${JSON.stringify(c)} → ${alt.id}`);
      assert.ok(after.alternatives.length <= MAX_REEF_ALTERNATIVES);
      assert.ok(after.primary.plan?.steps.length);
    }
  }
});

test('danger flag only when the look-alike is strictly more urgent; treatment notes come from families', () => {
  for (const c of reachable()) {
    const r = assessReef(c);
    for (const a of r.alternatives) {
      assert.equal(a.moreUrgent, URGENCY[a.urgency].rank > URGENCY[r.primary.urgencyLevel].rank);
      assert.equal(a.treatmentNote, reefTreatmentNote(a.id, r.primary.id));
    }
  }
  for (const c of REEF_CONDITIONS) assert.ok(REEF_TREATMENT_FAMILY[c.id], `${c.id} has no treatment family`);
  assert.equal(reefTreatmentNote('rtn', 'stn'), 'same');
  assert.equal(reefTreatmentNote('high-nutrients', 'low-nutrients'), 'different');
});

test('normal is a plain line, never a card', () => {
  assert.ok(byId('coral-normal').natural);
  const closed = assessReef({ group: 'coral', kind: 'soft', sign: 'closed' });
  assert.ok(!closed.alternatives.some(a => a.id === 'coral-normal'));
  assert.match(closed.naturalNote, /normal/i);
  assert.match(assessReef({ group: 'coral', kind: 'sps', sign: 'red-bugs' }).naturalNote, /pods/);
  assert.match(assessReef({ group: 'invert', kind: 'shrimp', sign: 'bulge' }).naturalNote, /eggs/);
});

test('curated look-alikes point at real reef conditions of the same group', () => {
  for (const [id, pairs] of Object.entries(REEF_LOOKALIKES)) {
    const from = byId(id);
    assert.ok(from, id);
    for (const [other, reason, kinds, note] of pairs) {
      if (!other) { assert.ok(note, `${id}: a note-only pair needs a note`); continue; }
      assert.ok(byId(other), `${id} → ${other}`);
      assert.equal(byId(other).group, from.group, `${id} → ${other} crosses groups`);
      assert.ok(reason, `${id} → ${other} has no check`);
      if (kinds) assert.ok(kinds.every(k => REEF_KINDS[from.group].some(x => x.id === k)), `${id} → ${other}`);
    }
  }
});

test('reef data stays separate from the fish conditions', () => {
  const fishIds = new Set(CONDITIONS.map(c => c.id));
  for (const c of REEF_CONDITIONS) assert.ok(!fishIds.has(c.id), `${c.id} clashes with a fish condition id`);
  const coral = REEF_CONDITIONS.filter(c => c.group === 'coral').length, invert = REEF_CONDITIONS.filter(c => c.group === 'invert').length;
  assert.ok(coral >= 14 && coral <= 18, `${coral} coral conditions`);
  assert.ok(invert >= 8 && invert <= 10, `${invert} invert conditions`);
});

test('the reef picture manifest is empty for now and pluggable', () => {
  for (const group of GROUPS) for (const section of ['kinds', 'signs', 'conditions']) assert.deepEqual(REEF_IMAGES[group][section], {}, `${group}.${section} should be empty until pictures are approved`);
  assert.deepEqual(reefImagesFor('coral', 'rtn'), { images: [], placeholder: true });
  assert.ok(reefSlotsFor('coral', 'rtn').every(s => s.image === null));
  // Adding entries later fills results and kind-specific overrides win.
  const fake = { url: 'https://example.invalid/rtn.jpg', alt: 'test' };
  REEF_IMAGES.coral.conditions.rtn = [fake];
  REEF_IMAGES.coral.signs['sps:peeling'] = fake;
  try {
    assert.equal(reefImagesFor('coral', 'rtn').images[0], fake);
    assert.equal(reefImagesFor('coral', 'peeling', 'sps', 'signs').images[0], fake);
    assert.equal(reefImagesFor('coral', 'peeling', 'lps', 'signs').placeholder, true);
    assert.equal(reefSlotsFor('coral', 'rtn')[0].image, fake);
  } finally { delete REEF_IMAGES.coral.conditions.rtn; delete REEF_IMAGES.coral.signs['sps:peeling']; }
});
