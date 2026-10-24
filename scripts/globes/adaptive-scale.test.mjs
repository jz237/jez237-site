import test from 'node:test';
import assert from 'node:assert/strict';
import { AdaptiveScale, MAX_LEVEL, ratioAt } from './src/app/adaptiveScale.mjs';

// Drives the controller with frames of `frameMs(level)` for `seconds`; returns the levels reached.
function run(scale, clock, seconds, frameMs) {
  const changes = [];
  const end = clock.t + seconds * 1000;
  while (clock.t < end) {
    clock.t += frameMs(scale.level);
    const l = scale.frame(clock.t);
    if (l !== null) changes.push(l);
  }
  return changes;
}

test('pixel ratio steps down by 0.8 and stops at the floor', () => {
  assert.equal(ratioAt(2, 0), 2);
  assert.ok(Math.abs(ratioAt(2, 1) - 1.6) < 1e-9);
  assert.ok(Math.abs(ratioAt(2, 3) - 1.024) < 1e-9);
  assert.equal(ratioAt(1, 4), 0.6);
  assert.equal(ratioAt(0.5, 4), 0.5);
});

test('quick frames change nothing', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  assert.deepEqual(run(s, clock, 30, () => 16.7), []);
  assert.equal(s.level, 0);
});

test('nothing happens during the warm-up, however slow', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  run(s, clock, 2.9, () => 50);
  assert.equal(s.level, 0);
});

test('frames that cost pixels step the picture down until they are quick', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  // Cost scales with pixels: 40 ms at full sharpness, 0.64x per level.
  const changes = run(s, clock, 30, (l) => Math.max(14, 40 * 0.64 ** l));
  // (A long way to go: two steps at once.)
  assert.equal(changes[0], 2);
  assert.equal(s.level, 2);
  assert.ok(Math.max(14, 40 * 0.64 ** s.level) <= 22);
});

test('frames alternating between one and two refreshes (40 fps) count as slow', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  let n = 0;
  const changes = run(s, clock, 12, (l) => (l === 0 ? (++n % 2 ? 16.7 : 33.3) : 16.7));
  assert.equal(changes[0], 1);
});

test('a hitch or two does not step it down', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  run(s, clock, 5, () => 16.7);
  let n = 0;
  const changes = run(s, clock, 20, () => (++n % 40 === 0 ? 150 : 16.7));
  assert.deepEqual(changes, []);
});

test('a long gap (page hidden) says nothing', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  run(s, clock, 5, () => 16.7);
  clock.t += 20000;
  s.frame(clock.t);
  assert.deepEqual(run(s, clock, 10, () => 16.7), []);
});

test('a step that does not speed frames up is taken back and not tried again for a while', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  // The screen limits frames to 33 ms whatever the pixel count.
  const changes = run(s, clock, 40, () => 33.3);
  assert.deepEqual(changes, [2, 0]);
  assert.equal(s.level, 0);
});

test('sharpness comes back after quick frames, and a failed offer waits twice as long', () => {
  // Down a few levels while pixels cost (a burst of load), then the load is gone.
  let load = true;
  const ms = (l) => (load ? Math.max(14, 40 * 0.64 ** l) : 15);
  const s2 = new AdaptiveScale(0);
  const c2 = { t: 0 };
  while (s2.level < 2) {
    c2.t += ms(s2.level);
    s2.frame(c2.t);
  }
  load = false;
  // The first offer arrives after about 8 s of quick frames.
  const down = s2.level;
  const t0 = c2.t;
  let up = null;
  while (up === null && c2.t - t0 < 30000) {
    c2.t += 15;
    up = s2.frame(c2.t);
  }
  assert.equal(up, down - 1);
  assert.ok(c2.t - t0 >= 8000 && c2.t - t0 < 12000, `offered after ${c2.t - t0} ms`);
  // The sharper picture is slow again: it goes back at once.
  let back = null;
  while (back === null && c2.t - t0 < 40000) {
    c2.t += 40;
    back = s2.frame(c2.t);
  }
  assert.equal(back, down);
  // And the next offer waits about twice as long.
  const t1 = c2.t;
  let again = null;
  while (again === null && c2.t - t1 < 60000) {
    c2.t += 15;
    again = s2.frame(c2.t);
  }
  assert.equal(again, down - 1);
  assert.ok(c2.t - t1 >= 16000, `second offer after ${c2.t - t1} ms`);
});

test('never steps past the lowest level', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  // Each step makes frames 12% quicker, never enough.
  run(s, clock, 120, (l) => 100 * 0.85 ** l);
  assert.ok(s.level <= MAX_LEVEL);
});

test('restart measures afresh', () => {
  const s = new AdaptiveScale(0);
  const clock = { t: 0 };
  run(s, clock, 4, () => 50);
  s.restart(clock.t);
  assert.equal(s.level >= 0, true);
  const before = s.level;
  run(s, clock, 0.3, () => 50);
  assert.equal(s.level, before);
});
