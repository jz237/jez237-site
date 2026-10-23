import test from "node:test";
import assert from "node:assert/strict";
import {
  gulpState,
  gulpMouth,
  gulpGillCover,
  gulpPresentation,
  GULP_PERIOD,
  GULP_LENGTH,
} from "./src/surface-gulp.js";

const sample = (a, b, step = 0.05) => {
  const out = [];
  for (let t = a; t < b; t += step) out.push([t, gulpState(t)]);
  return out;
};

test("never leaves the water outside t mod 96 in [17.4, 25.2)", () => {
  for (let cycle = 0; cycle < 4; cycle++) {
    for (const [t, s] of sample(cycle * GULP_PERIOD, (cycle + 1) * GULP_PERIOD)) {
      const phase = t - cycle * GULP_PERIOD;
      if (phase < 17.4 - 1e-9 || phase >= 25.2 - 1e-9) {
        assert.equal(s.lift, 0, `lift at ${t}`);
        assert.equal(s.mouth, 0);
        assert.equal(s.clock, -1);
      }
    }
  }
});

test("lift rises 0 to 1, holds, then falls back to 0 without overshoot", () => {
  const trace = sample(16, 26).map(([, s]) => s.lift);
  assert.ok(trace.every((l) => l >= 0 && l <= 1));
  assert.equal(Math.max(...trace), 1);
  assert.equal(trace[0], 0);
  assert.ok(trace[trace.length - 1] < 0.01);
  const peak = trace.indexOf(1);
  for (let i = 1; i <= peak; i++) assert.ok(trace[i] >= trace[i - 1] - 1e-12, "monotone rise");
  const lastOne = trace.lastIndexOf(1);
  for (let i = lastOne + 1; i < trace.length; i++) assert.ok(trace[i] <= trace[i - 1] + 1e-12, "monotone dive");
});

test("the gulp clock only runs while the fish is fully at the surface", () => {
  let gulpFrames = 0;
  for (const [, s] of sample(0, GULP_PERIOD)) {
    if (s.clock >= 0) {
      gulpFrames++;
      assert.equal(s.lift, 1);
      assert.ok(s.clock < GULP_LENGTH);
      assert.equal(s.phase, "gulp");
    }
  }
  assert.ok(gulpFrames * 0.05 > GULP_LENGTH * 0.95 && gulpFrames * 0.05 < GULP_LENGTH * 1.05);
});

test("mouth opens then closes; gill cover follows the opening", () => {
  assert.equal(gulpMouth(0), 0);
  assert.ok(gulpMouth(0.4) > 1);
  assert.ok(Math.abs(gulpMouth(1.2)) < 1e-9);
  assert.equal(gulpGillCover(0.5), 0);
  assert.ok(gulpGillCover(1.2) > 0.9);
  assert.ok(gulpGillCover(1.6) < 1e-9);
});

test("schedule is periodic and deterministic", () => {
  for (const t of [3, 17.3, 20.1, 24.9, 41]) {
    assert.deepEqual(gulpState(t), gulpState(t + GULP_PERIOD));
    assert.deepEqual(gulpState(t), gulpState(t - GULP_PERIOD));
  }
});

test("jaw, gill pulse and gulp phase wait for the body to actually reach the surface", () => {
  const mid = gulpState(17.4 + 3.4);
  assert.equal(mid.phase, "gulp");
  assert.ok(mid.mouth > 0.5 && mid.gill >= 0);
  const deep = gulpPresentation(mid, 0.1);
  assert.equal(deep.mouth, 0);
  assert.equal(deep.gill, 0);
  assert.equal(deep.clock, -1);
  assert.notEqual(deep.phase, "gulp");
  const up = gulpPresentation(mid, 1);
  assert.equal(up.phase, "gulp");
  assert.equal(up.clock, mid.clock);
  assert.ok(Math.abs(up.mouth - mid.mouth) < 1e-9);
  const rising = gulpPresentation(mid, 0.93);
  assert.ok(rising.mouth > 0 && rising.mouth < mid.mouth);
  assert.notEqual(rising.phase, "gulp");
});

test("no scheduled trip (inspection view or host locomotion) shows nothing", () => {
  assert.deepEqual(gulpPresentation(null, 1), { mouth: 0, gill: 0, phase: "none", clock: -1 });
  const dive = gulpState(17.4 + 6.5);
  assert.equal(gulpPresentation(dive, dive.lift).phase, "dive");
});

test("propulsion assist only during ascent and descent", () => {
  for (const [, s] of sample(0, GULP_PERIOD)) {
    if (s.phase === "rise" || s.phase === "dive") assert.ok(s.swim >= 0 && s.swim <= 1);
    else assert.equal(s.swim, 0);
  }
});
