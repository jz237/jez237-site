import test from 'node:test';
import assert from 'node:assert/strict';
import { IdleWater } from './src/sim/IdleWater.ts';

// The betta bowl's 'filter': currents only (no push on the surface), coming on once the bowl has
// been left alone, gone as soon as it is handled, gentle, and turning all the way round.
test("the betta bowl's filter current is gentle, has no push, waits, fades and turns all the way round", () => {
  const w = new IdleWater();
  w.motion = 'filter';
  const dt = 1 / 60;
  let t = 0;
  const headings = [];
  for (; t < 3.9; t += dt) {
    w.update(dt, false, null);
    assert.equal(w.stirring, false, `not before 4 s (${t.toFixed(2)})`);
  }
  for (; t < 400; t += dt) {
    w.update(dt, false, null);
    assert.deepEqual(w.accel, [0, 0, 0], 'no push');
    assert.ok(Math.abs(w.currents[0]) <= 0.02 + 1e-9 && Math.hypot(w.currents[1], w.currents[2]) <= 0.025 + 1e-9, 'gentle');
    if (w.stirring) assert.equal(w.currents[3], 1.5);
    if (t > 8) headings.push(Math.atan2(w.currents[2], w.currents[1]));
  }
  assert.ok(w.stirring, 'on once left alone');
  // (Every quarter of the compass is visited.)
  const quarters = new Set(headings.map((a) => Math.floor(((a + 2 * Math.PI) % (2 * Math.PI)) / (Math.PI / 2))));
  assert.equal(quarters.size, 4, `headings cover ${quarters.size} quarters`);
  for (let k = 0; k < 40; k++) w.update(dt, true, null);
  assert.equal(w.stirring, false, 'gone within 0.6 s of being handled');
  assert.ok(w.currents.slice(0, 3).every((v) => v === 0), 'and its currents with it');
});
