// Shader-distance/view-boundary evidence, separate from the matched seven views.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { tsImport } from 'tsx/esm/api';

const phase = process.env.QUARRY_BACKDROP_PHASE;
const expected = process.env.QUARRY_BACKDROP_EXPECTED_BUNDLE;
assert.ok(phase && expected, 'Set a unique QUARRY_BACKDROP_PHASE and exact QUARRY_BACKDROP_EXPECTED_BUNDLE');
const root = process.env.QUARRY_BACKDROP_OUTPUT || 'outputs/north-backdrop';
const output = path.resolve(root, phase);
assert.equal(await fs.access(path.join(output, 'report.json')).then(() => true, () => false), false, 'Preserve prior evidence');
const source = await fs.readFile('src/quarry-north-backdrop.json');
const placements = JSON.parse(source);
const tree = placements.trees.find(tree => tree.id === 'north-backdrop-60');
assert.ok(tree && tree.variant === 0, 'Preserve the chosen outer tree fixture');
const { backdropGroundHeight } = await tsImport('../src/scenery-backdrop.ts', import.meta.url);
const { quarryColliderLayout } = await tsImport('../src/quarry-layout.ts', import.meta.url);
const trunks = quarryColliderLayout().filter(c => c.id.startsWith('tree-') && c.shape === 'cylinder');
const center = [tree.x, tree.y + tree.height * .5, tree.z];
const views = [[65, 30], [77.5, 30], [90, 30], [77.5, 44], [77.5, 46]].map(([distance, azimuth]) => {
  const angle = tree.yaw + azimuth * Math.PI / 180, dx = Math.sin(angle), dz = Math.cos(angle);
  const eye = radius => {
    const x = tree.x + dx * radius, z = tree.z + dz * radius;
    return [x, backdropGroundHeight(x, z) + 2, z];
  };
  let lo = 0, hi = distance;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) * .5, p = eye(mid);
    if (Math.hypot(...p.map((v, k) => v - center[k])) < distance) lo = mid; else hi = mid;
  }
  const position = eye((lo + hi) * .5);
  const clearance = Math.min(...trunks.map(c => Math.hypot(position[0] - c.p.x, position[2] - c.p.z) - c.radius));
  assert.ok(clearance > 4.2 && Math.abs(position[0]) < 310 && Math.abs(position[2]) < 310, 'Trunk-clear terrain-supported inspection anchor');
  const name = `distance-${String(distance).replace('.', 'p')}-az-${azimuth}`;
  return { name, player: [position[0], position[2], angle + Math.PI], position,
    target: [position[0] - dx * 20, position[1] - 2, position[2] - dz * 20],
    expectedTreeDistance: distance, treeLocalAzimuthDegrees: azimuth,
    targetTree: tree.id, targetCenter: center, trunkClearance: clearance };
});
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, 'fixture-plan.json'), JSON.stringify({
  placementSha256: createHash('sha256').update(source).digest('hex'), tree, views,
  note: 'Placed two-metre eye inspections; player/reflection anchor colocated with camera XZ. Exact distances reference the normalized model centre used by the coverage shader. No camera or terrain runtime changes.'
}, null, 2) + '\n');
process.env.QUARRY_FOREST_PHASE = phase;
process.env.QUARRY_FOREST_OUTPUT = root;
process.env.QUARRY_FOREST_EXPECTED_BUNDLE = expected;
process.env.QUARRY_FOREST_EXTRA_VIEWS = JSON.stringify(views);
process.env.QUARRY_FOREST_VIEWS = views.map(v => v.name).join(',');
delete process.env.QUARRY_FOREST_DIAGNOSTICS;
await import('./forest-edge-qa.mjs');
const report = JSON.parse(await fs.readFile(path.join(output, 'report.json'), 'utf8'));
if (report.passed) {
  const poses = report.views.map(view => {
    assert.ok(view.actualCamera && view.northRidge?.length, 'Actual camera and ridge diagnostic required');
    const actualDistance = Math.hypot(...view.actualCamera.position.map((v, k) => v - center[k]));
    assert.ok(Math.abs(actualDistance - view.expectedTreeDistance) < 1e-5, 'Existing orbit limits must not alter transition distance');
    return { name: view.name, expectedDistance: view.expectedTreeDistance, actualDistance,
      treeLocalAzimuthDegrees: view.treeLocalAzimuthDegrees, position: view.actualCamera.position };
  });
  await fs.writeFile(path.join(output, 'distance-verification.json'), JSON.stringify({ passed: true, poses }, null, 2) + '\n');
  console.log('All five actual camera distances verified against shader centre');
}
