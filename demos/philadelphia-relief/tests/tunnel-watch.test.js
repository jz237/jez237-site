import test from 'node:test';
import assert from 'node:assert/strict';
import { createTunnelWatch } from '../../../scripts/philadelphia-aircraft/tunnel-watch.mjs';
import { recoverRelay } from '../../../scripts/philadelphia-aircraft/watchdog.mjs';

test('helper recovery restarts a missing process but preserves manual Stop and an already healthy helper', async () => {
  let stopped = true, healthy = false, probes = 0, starts = 0;
  const options = { stopped: () => stopped, healthy: async () => { probes++; return healthy; },
    start: () => { starts++; } };
  assert.equal(await recoverRelay(options), 'stopped'); assert.equal(probes, 0);
  stopped = false; healthy = true;
  assert.equal(await recoverRelay(options), 'healthy'); assert.equal(starts, 0);
  healthy = false;
  assert.equal(await recoverRelay(options), 'restarted'); assert.equal(starts, 1);
  options.healthy = async () => { stopped = true; throw new Error('offline'); };
  assert.equal(await recoverRelay(options), 'stopped'); assert.equal(starts, 1);
});

test('tunnel watchdog tolerates transient faults and replaces a persistently disconnected tunnel', async () => {
  let healthy = false, restarts = 0;
  const watch = createTunnelWatch({ probe: async () => healthy, restart: () => { restarts++; } });
  await watch.check(); await watch.check(); assert.equal(restarts, 0);
  healthy = true; await watch.check();
  healthy = false; await watch.check(); await watch.check(); assert.equal(restarts, 0);
  await watch.check(); assert.equal(restarts, 1);
  await watch.check(); assert.equal(restarts, 1);
  watch.dispose();
});

test('tunnel watchdog does not overlap checks or restart after disposal during a pending probe', async () => {
  let resolve, probes = 0, restarts = 0;
  const watch = createTunnelWatch({ threshold: 1,
    probe: () => { probes++; return new Promise(r => { resolve = r; }); },
    restart: () => { restarts++; } });
  const pending = watch.check(); await watch.check(); assert.equal(probes, 1);
  watch.dispose(); resolve(false); await pending; await watch.check();
  assert.equal(restarts, 0); assert.equal(probes, 1);
});

test('tunnel watchdog treats failed health requests as recoverable without polling aircraft', async () => {
  let restarts = 0;
  const watch = createTunnelWatch({ probe: async () => { throw new Error('offline'); },
    restart: () => { restarts++; } });
  await watch.check(); await watch.check(); await watch.check(); assert.equal(restarts, 1);
  watch.dispose();
});
