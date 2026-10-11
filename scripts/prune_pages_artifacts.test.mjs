import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planPagesArtifactCleanup} from './prune_pages_artifacts.mjs';
const run = (id, patch = {}) => ({id, workflow_id: 12, head_branch: 'main', run_attempt: 1, status: 'completed', conclusion: 'success', ...patch});
const artifact = (id, patch = {}) => ({id, workflow_run: {id}, name: `github-pages-${id}-1`, created_at: `2026-10-${String(id).padStart(2, '0')}T00:00:00Z`, expired: false, ...patch});
test('retains two newest successful builds and all active, unknown, foreign, rerun and mismatched artifacts', () => {
  const runs = [run(1), run(2), run(3), run(4, {status: 'in_progress'}), run(5, {workflow_id: 99}), run(6, {head_branch: 'feature'}), run(7, {run_attempt: 2}), run(9), run(10)];
  const artifacts = [1, 2, 3, 4, 5, 6, 7, 8].map(n => artifact(n));
  artifacts.push(artifact(9, {name: 'unrelated-export'}), artifact(10, {expired: true}));
  const plan = planPagesArtifactCleanup(artifacts, runs, 12);
  assert.deepEqual(plan.keep, [3, 2]); assert.deepEqual(plan.remove.map(a => a.id), [1]);
});
test('cancelled uploads never displace successful rollback builds', () => {
  const plan = planPagesArtifactCleanup([1, 2, 3, 4].map(n => artifact(n)), [run(1), run(2), run(3), run(4, {conclusion: 'cancelled'})], 12);
  assert.deepEqual(plan.keep, [3, 2]); assert.deepEqual(plan.remove.map(a => a.id), [1, 4]);
});
test('fewer than two successful builds means no deletion', () => {
  assert.deepEqual(planPagesArtifactCleanup([artifact(1), artifact(2)], [run(1), run(2, {conclusion: 'failure'})], 12).remove, []);
});
