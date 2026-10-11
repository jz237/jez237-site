import test from 'node:test';
import assert from 'node:assert/strict';
import { pendingProductionBuilds } from './wait_pages_builds.mjs';

const deployment = (name, status, ended_on = null, environment = 'production') =>
  ({ environment, latest_stage: { name, status, ended_on } });

test('successful intermediate build stages remain pending until deployment ends', () => {
  for (const name of ['queued', 'initialize', 'clone_repo', 'build']) {
    assert.equal(pendingProductionBuilds([deployment(name, 'success', '2026-10-11')]).length, 1);
    assert.equal(pendingProductionBuilds([deployment(name, 'active')]).length, 1);
  }
});
test('finished, failed, canceled and skipped deployments do not hold the queue', () => {
  const rows = [deployment('deploy', 'success', '2026-10-11'),
    ...['failure', 'canceled', 'skipped'].map(status => deployment('build', status))];
  assert.deepEqual(pendingProductionBuilds(rows), []);
});
test('unknown or unfinished production states fail closed and previews do not block production', () => {
  assert.equal(pendingProductionBuilds([{ environment: 'production' },
    deployment('deploy', 'active'), deployment('deploy', 'success')]).length, 3);
  assert.deepEqual(pendingProductionBuilds([deployment('build', 'active', null, 'preview')]), []);
});
