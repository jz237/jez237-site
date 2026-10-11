import test from 'node:test';
import assert from 'node:assert/strict';
import { pendingProductionBuilds, readProductionBuilds } from './wait_pages_builds.mjs';

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

test('a transient queue API failure receives bounded retries without assuming a clear queue', async () => {
  let calls = 0; const pauses = [], rows = [deployment('build', 'active')];
  const result = await readProductionBuilds('https://example.test/queue', {}, {
    fetcher: async () => ++calls < 3 ? new Response('Unavailable', { status: 503 })
      : Response.json({ success: true, result: rows }), pause: async ms => pauses.push(ms),
  });
  assert.deepEqual(result, rows); assert.equal(calls, 3); assert.deepEqual(pauses, [2000, 4000]);
  assert.equal(pendingProductionBuilds(result).length, 1);
});
test('queue authentication failures stop immediately and never leak upstream error text', async () => {
  let calls = 0;
  await assert.rejects(readProductionBuilds('https://example.test/queue', {}, {
    fetcher: async () => { calls++; return new Response('private upstream detail', { status: 403 }); },
  }), error => error.message.includes('(403)') && !error.message.includes('private'));
  assert.equal(calls, 1);
});
test('empty or malformed queue responses remain blocked after three attempts', async () => {
  let calls = 0;
  await assert.rejects(readProductionBuilds('https://example.test/queue', {}, {
    fetcher: async () => { calls++; return Response.json({ success: true, result: [] }); },
    pause: async () => {},
  }), /publication stopped/);
  assert.equal(calls, 3);
});
test('the publication deadline also applies during queue retry backoff', async () => {
  let clock = 0, calls = 0;
  await assert.rejects(readProductionBuilds('https://example.test/queue', {}, {
    fetcher: async () => { calls++; throw new Error('offline'); }, now: () => clock, deadline: 1000,
    pause: async ms => { clock += ms; },
  }), /cutoff reached/);
  assert.equal(calls, 1); assert.equal(clock, 1000);
});
