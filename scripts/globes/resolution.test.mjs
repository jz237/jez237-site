import assert from 'node:assert/strict';
import test from 'node:test';
import { choiceFor, describeRatio, fixedRatios, parseChoice, ratioOf } from './src/app/resolution.mjs';

test('the fixed ratios: 1, 1.5, 2 and the screen’s own', () => {
  assert.deepEqual(fixedRatios(1), [1, 1.5, 2]);
  assert.deepEqual(fixedRatios(2), [1, 1.5, 2]);
  assert.deepEqual(fixedRatios(1.25), [1, 1.25, 1.5, 2]);
  // (A Galaxy S25 Ultra at its FHD+ setting.)
  assert.deepEqual(fixedRatios(2.809999942779541), [1, 1.5, 2, 2.81]);
  assert.deepEqual(fixedRatios(0.9), [1, 1.5, 2]);
});

test('a choice kept and read back; anything else is Auto', () => {
  const s = 2.809999942779541;
  for (const c of ['auto', 'screen', 1, 1.5, 2]) assert.equal(parseChoice(String(c), s), c);
  assert.equal(parseChoice('2.81', s), 'screen', 'the screen’s own, by its number');
  assert.equal(parseChoice(String(choiceFor(2, 2)), 2), 'screen', 'on a screen of 2, 2 is its own');
  for (const bad of [null, '', '3', 'toString', 'NaN', '1.25']) assert.equal(parseChoice(bad, s), 'auto', String(bad));
  assert.equal(ratioOf('auto', s), null);
  assert.equal(ratioOf('screen', s), 2.81);
  assert.equal(ratioOf(1.5, s), 1.5);
});

test('a ratio’s words, the size held to the GPU’s limit', () => {
  assert.deepEqual(describeRatio(2, 384, 693), { ratio: '2×', size: '768 × 1386' });
  assert.deepEqual(describeRatio(2, 5000, 2000, 8192), { ratio: '2×', size: '8192 × 3277' });
});
