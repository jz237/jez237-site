import test from 'node:test';
import assert from 'node:assert/strict';
import { legacyReader } from '../../experiments/fish-health-lab/reader.mjs';

// Windows 7 PC, Nov 7 2026: Merck flashed then went blank in the pop-up (Chrome 109, Firefox ESR 115).
test('old browsers and Windows 7/8 keep the plain new-tab link; current browsers use the pop-up', () => {
  const modern = { Object: { groupBy() {} }, navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/146.0 Safari/537.36' } };
  assert.equal(legacyReader(modern), false);
  assert.equal(legacyReader({ ...modern, navigator: { userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) Chrome/109.0.0.0 Safari/537.36' } }), true, 'Windows 7');
  assert.equal(legacyReader({ ...modern, navigator: { userAgent: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0' } }), true, 'Windows 8.1');
  assert.equal(legacyReader({ Object: {}, navigator: modern.navigator }), true, 'no Object.groupBy');
  assert.equal(legacyReader(globalThis), typeof Object.groupBy !== 'function');
});
