// Matched backdrop-specific evidence using the established forest QA controls,
// asset observation, lighting, traffic removal and actual camera-pose recording.
// Run with QUARRY_BACKDROP_PHASE and QUARRY_BACKDROP_EXPECTED_BUNDLE for candidates.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const phase = process.env.QUARRY_BACKDROP_PHASE || 'published-baseline';
assert.match(phase, /^[a-z0-9][a-z0-9_-]*$/i);
assert.ok(!phase.startsWith('baseline'), 'Use published-baseline; historical forest baseline names retain their old contract');
const baseline = phase === 'published-baseline';
const expected = baseline ? './assets/index-DKLEkx4k.js' : process.env.QUARRY_BACKDROP_EXPECTED_BUNDLE;
assert.ok(expected, 'Set the exact candidate application bundle');
const url = process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/';
if (baseline) {
  const response = await fetch(new URL(expected, url));
  assert.equal(response.status, 200);
  assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'),
    'c7b088ed343f4def508e92265079bff4de5639bc08465c3fca1ede0676971fcd', 'Baseline must be the published checkpoint');
}

// New positions were checked against the unchanged terrain triangles and all
// solid tree cylinders before baseline. Eye height is two metres; targets are
// within the existing22m orbit constraint. Preserve these values for candidates.
const extraViews = [
  { name: 'crest-orbit-east', player: [80, 214, Math.PI / 2],
    position: [80, 33.334315129032415, 214], target: [100, 32.334315129032415, 215] },
  { name: 'back-ridge-north', player: [0, 280, Math.PI],
    position: [0, 36.97018814086914, 280], target: [0, 35.97018814086914, 260] },
  { name: 'back-ridge-east', player: [75, 278, Math.PI],
    position: [75, 42.48385802826403, 278], target: [69, 41.48385802826403, 259] },
];
process.env.QUARRY_FOREST_PHASE = phase;
process.env.QUARRY_FOREST_OUTPUT = process.env.QUARRY_BACKDROP_OUTPUT || 'outputs/north-backdrop';
process.env.QUARRY_FOREST_EXPECTED_BUNDLE = expected;
process.env.QUARRY_FOREST_EXTRA_VIEWS = JSON.stringify(extraViews);
process.env.QUARRY_FOREST_VIEWS = ['rear-chase', 'forest-front-north', 'forest-front-east', 'north-overview',
  ...extraViews.map(view => view.name)].join(',');
process.env.QUARRY_FOREST_EXTRA_ASSETS = JSON.stringify([
  ...['pine', 'spruce', 'hemlock', 'maple'].map(kind => `models/${kind}.webp`),
  ...JSON.parse(process.env.QUARRY_BACKDROP_EXTRA_ASSETS || '[]'),
]);
delete process.env.QUARRY_FOREST_DIAGNOSTICS;
await import('./forest-edge-qa.mjs');
