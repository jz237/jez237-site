import test from 'node:test';
import assert from 'node:assert/strict';
import { AdaptiveScale, keepLevel, keptLevel, levelAt, lowestLevel, MAX_LEVEL, PHONE, ratioAt } from './src/app/adaptiveScale.mjs';
import { FramePace } from './src/app/framePace.mjs';

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

test('phones step by 0.9 from the screen ratio, through 1 CSS px, to the floor', () => {
  assert.equal(ratioAt(2, 0, PHONE), 2);
  assert.equal(levelAt(2, 1, PHONE), 7);
  assert.ok(Math.abs(ratioAt(2, 7, PHONE) - 1) < 1e-9);
  assert.ok(Math.abs(ratioAt(2, 8, PHONE) - 0.9) < 1e-9);
  assert.ok(ratioAt(2, 1, PHONE) < 2 && ratioAt(2, 1, PHONE) > 1.8);
  assert.equal(ratioAt(2, lowestLevel(2, PHONE), PHONE), 0.6);
  assert.ok(ratioAt(2, lowestLevel(2, PHONE) - 1, PHONE) > 0.6);
  // (A screen of 1 CSS px: the steps start there.)
  assert.equal(levelAt(1, 1, PHONE), 0);
  assert.ok(Math.abs(ratioAt(1, 1, PHONE) - 0.9) < 1e-9);
});

test('the lowest level is the first at the floor', () => {
  // (A screen of 1 CSS px reaches it in three steps: the two more there were did nothing.)
  assert.equal(lowestLevel(1), 3);
  assert.equal(lowestLevel(2), MAX_LEVEL);
  assert.equal(lowestLevel(0.5), 0);
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

test('frames slow at any sharpness stop at the floor, and stay', () => {
  // (Before, the steps past the floor, which changed nothing, were taken, then taken back, again
  // and again.)
  const s = new AdaptiveScale(0, { lowest: lowestLevel(1) });
  const clock = { t: 0 };
  const changes = run(s, clock, 200, (l) => 30 + 20 * ratioAt(1, l) ** 2);
  assert.deepEqual(changes, [3]);
});

test('restart can start from another level', () => {
  const s = new AdaptiveScale(0, { level: 2 });
  s.restart(0, 4);
  assert.equal(s.level, 4);
});

// A phone, its frames held to 60 (FramePace) on a screen of `hz`: a drawn frame takes cost(level)
// ms of work, cpu of it on the main thread (the scaler is told that part), and the next refresh it
// can draw at is the first after that.
function phone(scale, clock, seconds, cost, cpu, hz = 120) {
  const pace = new FramePace();
  const changes = [];
  const end = clock.t + seconds * 1000;
  let free = 0;
  while (clock.t < end) {
    clock.t += 1000 / hz;
    if (clock.t < free || !pace.draw(clock.t)) continue;
    const l = scale.frame(clock.t);
    if (l !== null) changes.push(l);
    const c = cost(scale.level);
    free = clock.t + c;
    scale.work(Math.min(cpu, c));
  }
  return changes;
}
const pixels = (l) => ratioAt(2, l, PHONE) ** 2;
const phoneScale = (level = levelAt(2, 1, PHONE)) => new AdaptiveScale(0, { tier: PHONE, level, lowest: lowestLevel(2, PHONE) });

test('a phone with time to spare climbs while its frames hold, and a step too far is taken back', () => {
  const s = phoneScale();
  const clock = { t: 0 };
  // 6 ms of main thread, 6 ms of drawing at 1 CSS px: two steps sharper hold (13.4 ms, 15.1), a
  // third does not (17.3), and is tried again less and less often.
  const changes = phone(s, clock, 120, (l) => 6 + 6 * pixels(l), 6);
  assert.deepEqual(changes.slice(0, 4), [6, 5, 4, 5]);
  assert.ok(Math.min(...changes) === 4 && changes.filter((l) => l === 4).length <= 4, `${changes}`);
  assert.equal(s.level, 5);
  assert.equal(s.held, 5);
});

test('a phone short of time steps down until its frames hold 60, and stays', () => {
  const s = phoneScale();
  const clock = { t: 0 };
  // 20 ms at 1 CSS px, 12 of it drawing: two 0.9 steps make it fit.
  const changes = phone(s, clock, 120, (l) => 8 + 12 * pixels(l), 8);
  assert.equal(changes[0], 9);
  assert.equal(s.level, 9);
  assert.equal(s.held, 9);
  assert.ok(8 + 12 * pixels(9) < 1000 / 60);
});

test('a phone whose main thread alone is too slow keeps its sharpness', () => {
  // (On a 120 Hz screen and a 60 Hz one, its time a little uneven.)
  let n = 0;
  assert.deepEqual(phone(phoneScale(), { t: 0 }, 60, (l) => 19 + 2 * pixels(l), 19), []);
  assert.deepEqual(phone(phoneScale(), { t: 0 }, 300, (l) => 26 + (++n % 5) + 2 * pixels(l), 30, 60), []);
});

test('a phone whose drawing is slower still than its slow main thread steps down even so', () => {
  const s = phoneScale();
  const clock = { t: 0 };
  // 18 ms of main thread, and 40 of drawing at 1 CSS px.
  const changes = phone(s, clock, 60, (l) => 18 + 40 * pixels(l), 18);
  assert.ok(changes.length > 0 && s.level > levelAt(2, 1, PHONE), `${changes}`);
  assert.ok(18 + 40 * pixels(s.level) < 0.75 * (18 + 40 * pixels(levelAt(2, 1, PHONE))));
});

test('a phone started blurry gets its sharpness back while frames hold', () => {
  // (As where a slow spell on a visit before was kept: keptLevel.)
  const s = phoneScale(lowestLevel(2, PHONE));
  const clock = { t: 0 };
  phone(s, clock, 90, (l) => 13.5 + pixels(l), 13.5);
  assert.ok(s.level <= levelAt(2, 1, PHONE), `level ${s.level}`);
});

test('a kept level is never blurrier than the one a view starts at', () => {
  const store = new Map();
  globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  try {
    assert.equal(keptLevel('tall', 7), null);
    keepLevel('tall', 12);
    assert.equal(keptLevel('tall', 7), 7);
    keepLevel('tall', 3);
    assert.equal(keptLevel('tall', 7), 3);
    assert.equal(keptLevel('wide', 7), null);
    globalThis.localStorage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    keepLevel('tall', 2);
    assert.equal(keptLevel('tall', 7), null);
  } finally {
    delete globalThis.localStorage;
  }
});

// Refresh times a little uneven, as a phone's are (up to `jitter` ms either way, repeatably).
const uneven = (k, jitter) => (((k * 7919) % 101) / 50 - 1) * jitter;

test('frames held to 60 on 60, 75, 90, 120, 144 and 165 Hz screens', () => {
  for (const hz of [60, 75, 90, 120, 144, 165]) {
    for (const jitter of [0, 0.3, 0.6]) {
      const pace = new FramePace();
      let drawn = 0;
      for (let k = 0; k < hz * 10; k++) if (pace.draw((k * 1000) / hz + uneven(k, jitter))) drawn++;
      assert.ok(drawn >= 598 && drawn <= 601, `${hz} Hz, ±${jitter} ms: ${drawn} frames in 10 s`);
    }
  }
});

test('a late frame is not caught up on with early ones', () => {
  for (const hz of [90, 120, 144]) {
    for (const jitter of [0, 0.6]) {
      const pace = new FramePace();
      const times = [];
      let shortest = Infinity;
      for (let k = 0; k < hz * 2; k++) {
        const t = (k * 1000) / hz + uneven(k, jitter);
        // (Frame 20 or so's work takes 40 ms: the refreshes meanwhile cannot be drawn.)
        if (t > 166 && t < 210) continue;
        if (!pace.draw(t)) continue;
        if (times.length > 1 && times.at(-1) < 166) shortest = Math.min(shortest, t - times.at(-1));
        times.push(t);
      }
      // (After it, no gap shorter than the screen's own pattern before it.)
      const gaps = times.slice(1).map((t, i) => t - times[i]).filter((_, i) => times[i] > 166);
      assert.ok(Math.min(...gaps) > shortest - 1.5, `${hz} Hz ±${jitter}: gaps ${gaps.map((g) => g.toFixed(1)).join(' ')}`);
    }
  }
});

test('held to 30 (a phone quality level that says so), frames come at 30 on 60, 90, 120 and 144 Hz screens', () => {
  for (const hz of [60, 90, 120, 144]) {
    for (const jitter of [0, 0.3, 0.6]) {
      const pace = new FramePace();
      pace.frameMs = 1000 / 30;
      let drawn = 0;
      for (let k = 0; k < hz * 10; k++) if (pace.draw((k * 1000) / hz + uneven(k, jitter))) drawn++;
      assert.ok(drawn >= 298 && drawn <= 301, `${hz} Hz, ±${jitter} ms: ${drawn} frames in 10 s`);
    }
  }
});
