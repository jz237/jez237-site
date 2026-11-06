// "Can I use this medicine in my tank?" (Jez, Nov 6 2026 07:32 EST: "Do option 1").
import test from 'node:test';
import assert from 'node:assert/strict';
import { VERDICTS, MEDICINES, MED_RESIDENTS, checkMedicine, headline, medicinesFor } from '../../experiments/fish-health-lab/medicine.mjs';
import { PREVENT_SECTIONS, PREVENT_IMAGE_IDS, preventImage } from '../../experiments/fish-health-lab/prevent.mjs';
import { CROPS as PREVENT_CROPS } from '../../experiments/fish-health-lab/prevent-images-data.mjs';

const answer = (medicine, water, residents = [], hospital = false) => checkMedicine({ medicine, water, residents, hospital });

test('every medicine has a verdict and a reason for every resident of each water it covers', () => {
  for (const m of MEDICINES) {
    assert.ok(m.tip && m.title && m.for, m.id);
    for (const water of Object.keys(MED_RESIDENTS)) {
      if (!m[water]) continue;
      for (const r of [...MED_RESIDENTS[water], { id: 'filter' }]) {
        const row = m[water][r.id];
        assert.ok(row && VERDICTS[row[0]] && row[1], `${m.id} ${water} ${r.id}`);
      }
    }
  }
  assert.ok(!medicinesFor('marine').some(m => m.id === 'salt'), 'no freshwater salt in a reef');
});

test('the classic mistakes get a clear “no”', () => {
  assert.equal(answer('copper', 'marine', ['corals']).verdict, 'kills');
  assert.equal(answer('copper', 'marine', ['inverts']).verdict, 'kills');
  assert.equal(answer('copper', 'marine', ['rock']).verdict, 'hospital');
  assert.equal(answer('copper', 'fresh', ['shrimp']).verdict, 'kills');
  assert.equal(answer('copper', 'fresh', ['scaleless']).verdict, 'kills');
  assert.equal(answer('fenbendazole', 'fresh', ['snails']).verdict, 'kills');
  assert.equal(answer('meth-blue', 'fresh').verdict, 'kills'); // kills the display filter
  assert.match(headline(answer('copper', 'marine', ['corals', 'inverts'])), /kill your corals or anemones and shrimp, crabs or snails/);
});

test('gentle cases and hospital tanks', () => {
  assert.equal(answer('prazi', 'fresh', ['shrimp', 'plants']).verdict, 'ok');
  assert.equal(answer('metro', 'fresh', ['shrimp', 'snails', 'plants', 'scaleless']).verdict, 'ok');
  assert.equal(answer('copper', 'marine', [], true).verdict, 'ok');
  assert.equal(answer('copper', 'marine', ['corals', 'inverts', 'rock'], true).verdict, 'ok', 'corals are not in the hospital tank');
  assert.equal(answer('meth-blue', 'fresh', ['plants'], true).verdict, 'care', 'a hospital filter just needs water changes');
  assert.equal(answer('copper', 'fresh', ['scaleless'], true).verdict, 'kills', 'corys still die from copper in a hospital tank');
  assert.equal(answer('salt', 'marine'), null);
  assert.equal(answer('', 'fresh'), null);
});

test('prevention page: every card has a picture, every picture is used', () => {
  assert.ok(PREVENT_SECTIONS.length >= 5);
  for (const s of PREVENT_SECTIONS) for (const c of s.cards) assert.ok(preventImage(c.image).url && c.title && c.text, c.image);
  assert.deepEqual([...PREVENT_IMAGE_IDS].sort(), Object.keys(PREVENT_CROPS).sort());
});
