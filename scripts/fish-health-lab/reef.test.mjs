// Reef section (corals, anemones, shrimp/crabs/snails): logic, care plans and
// the picture manifest (coral/anemone and shrimp/crab/snail pictures). Run: node --test scripts/fish-health-lab/reef.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { assessReef, rankReef, reefSignsFor, reefTreatmentNote, MAX_REEF_ALTERNATIVES } from '../../experiments/fish-health-lab/reef-logic.mjs';
import { REEF_GROUPS, REEF_KINDS, REEF_SIGNS, REEF_CHANGES, REEF_CONDITIONS, REEF_LOOKALIKES, REEF_TREATMENT_FAMILY } from '../../experiments/fish-health-lab/reef-data.mjs';
import { reefPlanFor, REEF_PLAN_IDS, INVERT_WARNING, STEP_TAGS } from '../../experiments/fish-health-lab/reef-care.mjs';
import { REEF_IMAGES, REEF_SLOTS, INVERT_SET, CORAL_SET, reefImagesFor, reefImageFor, reefSlotsFor } from '../../experiments/fish-health-lab/reef-images.mjs';
import { CROPS as INVERT_CROPS, IMAGE_SOURCE as INVERT_IMAGE_SOURCE } from '../../experiments/fish-health-lab/reef-images-inverts-data.mjs';
import { CROPS as CORAL_CROPS, IMAGE_SOURCE as CORAL_IMAGE_SOURCE } from '../../experiments/fish-health-lab/reef-images-corals-data.mjs';
import { URGENCY, CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';

const GROUPS = ['coral', 'invert'];
// The pond section (Nov 6 2026) shares the reef machinery; reef-only rules skip it.
const ALL_GROUPS = [...GROUPS, 'pond'];
const app = fileURLToPath(new URL('../../experiments/fish-health-lab/', import.meta.url));
const invertReceipt = JSON.parse(readFileSync(new URL('./invert-images-20261106.json', import.meta.url)));
const coralReceipt = JSON.parse(readFileSync(new URL('./coral-images-20261106.json', import.meta.url)));
const kindsOf = group => ['', ...REEF_KINDS[group].map(k => k.id)];
// Every tile a visitor can actually reach: group × kind (incl. Not sure) × shown sign.
const reachable = () => GROUPS.flatMap(group => kindsOf(group).flatMap(kind => reefSignsFor(group, kind).map(s => ({ group, kind, sign: s.id }))));
const lead = (group, kind, sign, changes = []) => assessReef({ group, kind, sign, changes }).primary?.id;
const also = (group, kind, sign, changes = []) => assessReef({ group, kind, sign, changes }).alternatives.map(c => c.id);
const byId = id => REEF_CONDITIONS.find(c => c.id === id);

test('"What needs help?" has Fish, Coral or anemone, and Shrimp, crab or snail', () => {
  assert.deepEqual(REEF_GROUPS.map(g => g.id), ['fish', 'coral', 'invert', 'pond']);
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
  for (const id of REEF_PLAN_IDS.filter(id => byId(id).group !== 'pond')) {
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
  for (const c of REEF_CONDITIONS.filter(c => c.group !== 'pond')) {
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

test('the manifest stays pluggable: kind-specific entries win, unknown keys fall back to a placeholder', () => {
  assert.deepEqual(reefImagesFor('coral', 'no-such-condition'), { images: [], placeholder: true });
  assert.ok(reefSlotsFor('coral', 'no-such-condition').every(s => s.image === null));
  const fake = { url: 'https://example.invalid/rtn.jpg', alt: 'test' };
  const before = REEF_IMAGES.coral.signs['anemone:peeling'];
  REEF_IMAGES.coral.signs['anemone:peeling'] = fake;
  try {
    assert.equal(reefImagesFor('coral', 'peeling', 'anemone', 'signs').images[0], fake);
    assert.equal(reefImagesFor('coral', 'peeling', 'lps', 'signs').images[0].id, 'sign-lps-peeling');
    assert.equal(reefImagesFor('coral', 'peeling', 'soft', 'signs').images[0].id, 'sign-peeling');
  } finally { if (before === undefined) delete REEF_IMAGES.coral.signs['anemone:peeling']; }
});

// ── Shrimp, crab and snail pictures (Jez, Nov 6 2026) ──────────────────────
const invertCases = () => reachable().filter(c => c.group === 'invert');

test('invert pictures: every kind tile, every sign tile a visitor can reach, every invert result', () => {
  for (const k of REEF_KINDS.invert) assert.ok(reefImagesFor('invert', k.id, '', 'kinds').images.length === 1, `kind ${k.id}`);
  for (const s of REEF_SIGNS.invert) assert.ok(REEF_IMAGES.invert.signs[s.id], `sign ${s.id} needs a plain picture`);
  for (const { kind, sign } of invertCases()) assert.equal(reefImagesFor('invert', sign, kind, 'signs').placeholder, false, `${kind || 'not sure'}/${sign}`);
  for (const c of REEF_CONDITIONS.filter(c => c.group === 'invert')) {
    const { images } = reefImagesFor('invert', c.id);
    assert.ok(images.length >= 1 && images.length <= REEF_SLOTS.length, `${c.id}: ${images.length} pictures`);
    assert.ok(reefSlotsFor('invert', c.id)[0].image, `${c.id} library card`);
  }
  // Every result, could-also card and compare side a visitor can reach has a picture.
  for (const c of invertCases()) {
    for (const changes of [[], REEF_CHANGES.invert.map(x => x.id)]) {
      const r = assessReef({ ...c, changes });
      for (const x of [r.primary, ...r.alternatives]) assert.equal(reefImagesFor('invert', x.id, c.kind).placeholder, false, `${JSON.stringify(c)} → ${x.id}`);
    }
  }
});

test('invert kind-specific pictures point at real kinds, signs and conditions that kind can reach', () => {
  const kinds = REEF_KINDS.invert.map(k => k.id);
  for (const [section, ids] of [['signs', REEF_SIGNS.invert.map(s => s.id)], ['conditions', REEF_CONDITIONS.filter(c => c.group === 'invert').map(c => c.id)]]) {
    for (const key of Object.keys(INVERT_SET[section])) {
      const [kind, id] = key.includes(':') ? key.split(':') : ['', key];
      assert.ok(ids.includes(id), `${section} ${key}: unknown ${id}`);
      if (!kind) continue;
      assert.ok(kinds.includes(kind), `${section} ${key}: unknown kind`);
      if (section === 'signs') assert.ok(reefSignsFor('invert', kind).some(s => s.id === id), `${key}: ${kind} never sees that sign`);
      else assert.ok(invertCases().filter(c => c.kind === kind).some(c => { const r = assessReef(c); return [r.primary, ...r.alternatives].some(x => x.id === id); }), `${key}: never shown for ${kind}`);
    }
  }
  assert.ok(Object.keys(INVERT_SET.kinds).every(k => kinds.includes(k)));
});

test('invert pictures show the right animal for the chosen kind where it matters', () => {
  const sign = (kind, id) => reefImagesFor('invert', id, kind, 'signs').images[0].id;
  const hero = (kind, id) => reefImagesFor('invert', id, kind).images[0].id;
  assert.equal(sign('crab', 'molt-stuck'), 'sign-crab-molt-stuck');
  assert.equal(sign('shrimp', 'molt-stuck'), 'sign-molt-stuck');
  assert.equal(sign('crab', 'not-moving'), 'sign-crab-not-moving');
  assert.equal(sign('snail', 'not-moving'), 'sign-not-moving');
  assert.equal(sign('shrimp', 'legs'), 'sign-shrimp-legs');
  assert.equal(sign('', 'legs'), 'sign-legs');
  assert.equal(hero('crab', 'failed-molt'), 'cond-crab-failed-molt');
  assert.equal(hero('crab', 'normal-molt'), 'cond-crab-normal-molt');
  assert.equal(hero('shrimp', 'normal-molt'), 'cond-normal-molt');
  assert.equal(hero('', 'bopyrid'), 'cond-bopyrid');
  assert.equal(hero('snail', 'flipped'), 'cond-flipped');
  assert.equal(hero('snail', 'starvation'), 'cond-snail-starvation');
});

test('a result and its could-also cards never show the same invert picture (compare stays useful)', () => {
  for (const c of invertCases()) {
    for (const changes of [[], ...REEF_CHANGES.invert.map(x => [x.id])]) {
      const r = assessReef({ ...c, changes });
      const ids = [r.primary, ...r.alternatives].map(x => reefImagesFor('invert', x.id, c.kind).images[0].id);
      assert.equal(new Set(ids).size, ids.length, `${JSON.stringify({ ...c, changes })}: ${ids}`);
    }
  }
});

test('invert crops: every crop is used, keys and hashes match the receipt, upload state matches IMAGE_SOURCE', () => {
  const used = new Set([...Object.values(INVERT_SET.kinds), ...Object.values(INVERT_SET.signs), ...Object.values(INVERT_SET.conditions).flat()]);
  assert.deepEqual([...used].sort(), Object.keys(INVERT_CROPS).sort(), 'every crop is used and every used id exists');
  assert.equal(invertReceipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(invertReceipt.requestedQuality, 'medium');
  assert.deepEqual(invertReceipt.reportedProviderModel, ['openai/gpt-image-2.6-sunburst']);
  assert.deepEqual(invertReceipt.assets.map(a => a.id).sort(), Object.keys(INVERT_CROPS).sort());
  assert.equal(new Set(invertReceipt.assets.map(a => a.sha256)).size, invertReceipt.assets.length, 'no duplicate crops');
  for (const a of invertReceipt.assets) {
    const crop = INVERT_CROPS[a.id];
    assert.equal(crop.key, a.r2Key, a.id);
    assert.match(a.r2Key, new RegExp(`^experiments/fish-health-lab/inverts/${a.id}-${a.sha256.slice(0, 12)}\\.jpg$`), a.id);
    assert.equal(a.plannedUrl, `https://media.jez237.com/${a.r2Key}`);
    assert.equal(a.path, `local-images/inverts/${a.r2Key.split('/').pop()}`);
    assert.deepEqual([a.width, a.height, crop.width, crop.height], [362, 362, 362, 362], a.id);
    assert.equal(a.resized, false);
    assert.equal(a.uploaded, INVERT_IMAGE_SOURCE === 'media', `${a.id}: uploaded flag must match IMAGE_SOURCE`);
    assert.ok(crop.alt.startsWith('AI illustration: ') && crop.caption, a.id);
    assert.ok(invertReceipt.sources[a.sheet], `${a.id}: sheet ${a.sheet} recorded`);
  }
  // Published: every asset is uploaded, so the app serves media.jez237.com (local only for an unpublished preview).
  const uploaded = invertReceipt.assets.every(a => a.uploaded);
  assert.equal(INVERT_IMAGE_SOURCE, uploaded ? 'media' : 'local');
  assert.ok(reefImageFor('invert', 'molt-stuck', '', 'signs').url.startsWith(uploaded ? 'https://media.jez237.com/experiments/fish-health-lab/inverts/' : 'local-images/inverts/'));
  if (existsSync(`${app}local-images/inverts`)) {
    for (const a of invertReceipt.assets) assert.equal(createHash('sha256').update(readFileSync(`${app}${a.path}`)).digest('hex'), a.sha256, a.id);
  }
});

// ── Coral and anemone pictures (Jez, Nov 6 2026 05:11 EST) ─────────────────
const coralCases = () => reachable().filter(c => c.group === 'coral');
const coralChanges = [[], ...REEF_CHANGES.coral.map(x => [x.id]), REEF_CHANGES.coral.map(x => x.id)];
// Every result + could-also a visitor can reach for a coral case, incl. after "This looks more like mine".
const coralShown = c => coralChanges.flatMap(changes => {
  const r = assessReef({ ...c, changes });
  return [r, ...r.alternatives.map(a => assessReef({ ...c, changes, chosen: [a.id] }))].map(x => ({ changes, r: x }));
});

test('coral pictures: every kind tile, every sign tile a visitor can reach, every coral result', () => {
  for (const k of REEF_KINDS.coral) assert.ok(reefImagesFor('coral', k.id, '', 'kinds').images.length === 1, `kind ${k.id}`);
  for (const s of REEF_SIGNS.coral) assert.ok(REEF_IMAGES.coral.signs[s.id], `sign ${s.id} needs a plain picture`);
  for (const { kind, sign } of coralCases()) assert.equal(reefImagesFor('coral', sign, kind, 'signs').placeholder, false, `${kind || 'not sure'}/${sign}`);
  for (const c of REEF_CONDITIONS.filter(c => c.group === 'coral')) {
    const { images } = reefImagesFor('coral', c.id);
    assert.ok(images.length >= 1 && images.length <= REEF_SLOTS.length, `${c.id}: ${images.length} pictures`);
    assert.ok(reefSlotsFor('coral', c.id)[0].image, `${c.id} library card`);
  }
  for (const c of coralCases()) for (const { r } of coralShown(c))
    for (const x of [r.primary, ...r.alternatives]) assert.equal(reefImagesFor('coral', x.id, c.kind).placeholder, false, `${JSON.stringify(c)} → ${x.id}`);
});

test('coral kind-specific pictures point at real kinds, signs and conditions that kind can reach', () => {
  const kinds = REEF_KINDS.coral.map(k => k.id);
  for (const [section, ids] of [['signs', REEF_SIGNS.coral.map(s => s.id)], ['conditions', REEF_CONDITIONS.filter(c => c.group === 'coral').map(c => c.id)]]) {
    for (const key of Object.keys(CORAL_SET[section])) {
      const [kind, id] = key.includes(':') ? key.split(':') : ['', key];
      assert.ok(ids.includes(id), `${section} ${key}: unknown ${id}`);
      if (!kind) continue;
      assert.ok(kinds.includes(kind), `${section} ${key}: unknown kind`);
      if (section === 'signs') assert.ok(reefSignsFor('coral', kind).some(s => s.id === id), `${key}: ${kind} never sees that sign`);
      else assert.ok(coralCases().filter(c => c.kind === kind).some(c => coralShown(c).some(({ r }) => [r.primary, ...r.alternatives].some(x => x.id === id))), `${key}: never shown for ${kind}`);
    }
  }
  assert.deepEqual(Object.keys(CORAL_SET.kinds), kinds);
});

test('coral pictures show the right coral for the chosen kind where it matters', () => {
  const sign = (kind, id) => reefImagesFor('coral', id, kind, 'signs').images[0].id;
  const hero = (kind, id) => reefImagesFor('coral', id, kind).images[0].id;
  assert.equal(sign('sps', 'peeling'), 'sign-peeling');
  assert.equal(sign('lps', 'peeling'), 'sign-lps-peeling');
  assert.equal(sign('soft', 'closed'), 'sign-closed');
  assert.equal(sign('lps', 'closed'), 'sign-lps-closed');
  assert.equal(sign('sps', 'closed'), 'sign-sps-closed');
  assert.equal(sign('anemone', 'bleach'), 'sign-anemone-bleach');
  assert.equal(sign('soft', 'bleach'), 'sign-soft-bleach');
  assert.equal(sign('soft', 'slugs'), 'sign-soft-slugs');
  assert.equal(sign('sps', 'slugs'), 'sign-slugs');
  assert.equal(sign('sps', 'bites'), 'sign-sps-bites');
  assert.equal(sign('', 'bleach'), 'sign-bleach');
  assert.equal(hero('sps', 'rtn'), 'cond-rtn');
  assert.equal(hero('anemone', 'bleaching'), 'sign-anemone-bleach');
  assert.equal(hero('sps', 'bleaching'), 'cond-bleaching');
  assert.equal(hero('sps', 'brown-jelly'), 'sign-sps-brown-jelly');
  assert.equal(hero('lps', 'brown-jelly'), 'cond-brown-jelly');
  assert.equal(hero('anemone', 'anemone-stress'), 'cond-anemone-stress');
  assert.equal(hero('soft', 'zoa-pests'), 'cond-zoa-pests');
});

test('a result and its could-also cards never show the same coral picture (compare stays useful)', () => {
  for (const c of coralCases()) for (const { changes, r } of coralShown(c)) {
    const ids = [r.primary, ...r.alternatives].map(x => reefImagesFor('coral', x.id, c.kind).images[0].id);
    assert.equal(new Set(ids).size, ids.length, `${JSON.stringify({ ...c, changes })}: ${ids}`);
  }
});

test('no "Picture coming soon" left in the reef path: every tile, result, could-also and library card has a picture', () => {
  for (const group of GROUPS) {
    for (const k of REEF_KINDS[group]) assert.equal(reefImagesFor(group, k.id, '', 'kinds').placeholder, false, `${group} kind ${k.id}`);
    for (const c of REEF_CONDITIONS.filter(c => c.group === group)) assert.ok(reefSlotsFor(group, c.id).filter(s => s.image).length >= 1, `${c.id} library`);
  }
  for (const c of reachable()) {
    assert.equal(reefImagesFor(c.group, c.sign, c.kind, 'signs').placeholder, false, JSON.stringify(c));
    const r = assessReef(c);
    for (const x of [r.primary, ...r.alternatives]) assert.equal(reefImagesFor(c.group, x.id, c.kind).placeholder, false, `${JSON.stringify(c)} → ${x.id}`);
  }
});

test('coral crops: every crop is used, keys and hashes match the receipt, upload state matches IMAGE_SOURCE', () => {
  // Three sign tiles added in the Nov 6 logic check use library close-ups (lib-*), not coral crops.
  const used = new Set([...Object.values(CORAL_SET.kinds), ...Object.values(CORAL_SET.signs), ...Object.values(CORAL_SET.conditions).flat()].filter(id => !id.startsWith('lib-')));
  assert.deepEqual([...used].sort(), Object.keys(CORAL_CROPS).sort(), 'every crop is used and every used id exists');
  assert.equal(coralReceipt.requestedModel, 'openai/gpt-image-2.6-sunburst');
  assert.equal(coralReceipt.requestedQuality, 'medium');
  assert.deepEqual(coralReceipt.reportedProviderModel, ['openai/gpt-image-2.6-sunburst']);
  assert.deepEqual(coralReceipt.assets.map(a => a.id).sort(), Object.keys(CORAL_CROPS).sort());
  assert.equal(new Set(coralReceipt.assets.map(a => a.sha256)).size, coralReceipt.assets.length, 'no duplicate crops');
  const invertHashes = new Set(invertReceipt.assets.map(a => a.sha256));
  for (const a of coralReceipt.assets) {
    const crop = CORAL_CROPS[a.id];
    assert.ok(!invertHashes.has(a.sha256), `${a.id} duplicates an invert crop`);
    assert.equal(crop.key, a.r2Key, a.id);
    assert.match(a.r2Key, new RegExp(`^experiments/fish-health-lab/corals/${a.id}-${a.sha256.slice(0, 12)}\\.jpg$`), a.id);
    assert.equal(a.plannedUrl, `https://media.jez237.com/${a.r2Key}`);
    assert.equal(a.path, `local-images/corals/${a.r2Key.split('/').pop()}`);
    assert.deepEqual([a.width, a.height, crop.width, crop.height], [362, 362, 362, 362], a.id);
    assert.equal(a.resized, false);
    assert.equal(a.uploaded, CORAL_IMAGE_SOURCE === 'media', `${a.id}: uploaded flag must match IMAGE_SOURCE`);
    assert.ok(crop.alt.startsWith('AI illustration: ') && crop.caption, a.id);
    assert.ok(coralReceipt.sources[a.sheet], `${a.id}: sheet ${a.sheet} recorded`);
  }
  const uploaded = coralReceipt.assets.every(a => a.uploaded);
  assert.equal(CORAL_IMAGE_SOURCE, uploaded ? 'media' : 'local');
  assert.ok(reefImageFor('coral', 'peeling', 'sps', 'signs').url.startsWith(uploaded ? 'https://media.jez237.com/experiments/fish-health-lab/corals/' : 'local-images/corals/'));
  if (existsSync(`${app}local-images/corals`)) {
    for (const a of coralReceipt.assets) assert.equal(createHash('sha256').update(readFileSync(`${app}${a.path}`)).digest('hex'), a.sha256, a.id);
  }
});
