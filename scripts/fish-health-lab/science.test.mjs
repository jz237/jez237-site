// Scientific names in small print (Jez, Nov 6 2026 09:07 EST).
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCIENCE, scienceLine } from '../../experiments/fish-health-lab/science.mjs';
import { CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';
import { REEF_CONDITIONS } from '../../experiments/fish-health-lab/reef-data.mjs';

// Placement, behaviour and "normal" results have no scientific name.
const NONE = ['normal', 'coral-normal', 'flow-placement', 'anemone-stress', 'nipped', 'flipped', 'predator'];

test('every diagnosis has a scientific name (except normal/placement results), and every name belongs to one', () => {
  const ids = [...CONDITIONS, ...REEF_CONDITIONS].map(c => c.id);
  for (const id of ids) assert.equal(Boolean(SCIENCE[id]), !NONE.includes(id), id);
  for (const id of Object.keys(SCIENCE)) assert.ok(ids.includes(id), `${id} is not a diagnosis`);
  assert.match(SCIENCE['cloudy-eye'], /keratitis/);
});

test('the small-print line italicises the taxon and escapes text', () => {
  assert.equal(scienceLine('ich-fresh'), '<p class="sci-name" data-science="ich-fresh"><i>Ichthyophthirius multifiliis</i> (ichthyophthiriasis)</p>');
  assert.equal(scienceLine('normal'), '');
  for (const id of Object.keys(SCIENCE)) assert.doesNotMatch(scienceLine(id), /\*/, id);
});
