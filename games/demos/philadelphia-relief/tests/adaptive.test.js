/**
 * Adaptive quality: steps down only on a sustained low frame rate, steps up
 * only after a long clean window, never oscillates, never exceeds the user's
 * ceiling, and ignores stalls.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createAdaptiveQuality, resolveQuality, LEVELS, DEFAULTS } from '../src/adaptive.js';

/** Feed `seconds` of frames at a steady `fps`; returns the final level. */
function run(ctl, fps, seconds) {
  const dt = 1 / fps;
  let level = ctl.level;
  for (let t = 0; t < seconds; t += dt) level = ctl.sample(dt);
  return level;
}

test('adaptive quality', async (t) => {
  await t.test('a sustained low frame rate steps down once, after the window', () => {
    const ctl = createAdaptiveQuality({ start: 'balanced' });
    // Cool-down first: nothing is measured.
    assert.equal(run(ctl, 12, DEFAULTS.cooldown - 0.5), 'balanced');
    // One second of jam is not enough.
    assert.equal(run(ctl, 12, 1.0), 'balanced');
    assert.equal(run(ctl, 12, DEFAULTS.downWindow + 0.5), 'performance');
    assert.equal(ctl.steps.length, 1);
    assert.equal(ctl.steps[0].reason, 'slow');
    // Still slow: there is nowhere lower to go, and no repeated steps.
    assert.equal(run(ctl, 12, 20), 'performance');
    assert.equal(ctl.steps.length, 1);
  });

  await t.test('a brief hiccup or a stall does not move it', () => {
    const ctl = createAdaptiveQuality({ start: 'cinematic' });
    run(ctl, 60, DEFAULTS.cooldown + 1);
    assert.equal(run(ctl, 10, 0.8), 'cinematic', 'under a second of jam');
    assert.equal(run(ctl, 60, 1), 'cinematic');
    assert.equal(ctl.sample(2.0), 'cinematic', 'a 2 s frozen frame is one capped sample');
    assert.equal(ctl.sample(0), 'cinematic');
    assert.equal(ctl.steps.length, 0);
    // A machine crawling at 1.5 fps still adapts, because long frames add up.
    const crawl = createAdaptiveQuality({ start: 'cinematic' });
    for (let i = 0; i < 14; i += 1) crawl.sample(0.66);   // cool-down, then 2.5 s of slow samples
    assert.equal(crawl.level, 'balanced');
    for (let i = 0; i < 26; i += 1) crawl.sample(0.66);
    assert.equal(crawl.level, 'performance');
  });

  await t.test('headroom steps back up only after a long clean window, and never past the ceiling', () => {
    const ctl = createAdaptiveQuality({ start: 'balanced', maxLevel: 'balanced' });
    run(ctl, 12, DEFAULTS.cooldown + DEFAULTS.downWindow + 1);
    assert.equal(ctl.level, 'performance');
    run(ctl, 60, DEFAULTS.cooldown + 5);
    assert.equal(ctl.level, 'performance', 'five clean seconds are not enough');
    run(ctl, 60, DEFAULTS.upWindow + 1);
    assert.equal(ctl.level, 'balanced');
    run(ctl, 60, DEFAULTS.cooldown + DEFAULTS.upWindow + 2);
    assert.equal(ctl.level, 'balanced', 'the user\'s ceiling holds');
    assert.deepEqual(ctl.steps.map((s) => s.reason), ['slow', 'headroom']);
  });

  await t.test('it does not oscillate around a threshold', () => {
    const ctl = createAdaptiveQuality({ start: 'balanced' });
    run(ctl, 60, DEFAULTS.cooldown + 1);
    // Alternate two seconds slow, two seconds fast, for a minute.
    for (let i = 0; i < 15; i += 1) {
      run(ctl, 20, 2);
      run(ctl, 60, 2);
    }
    assert.ok(ctl.steps.length <= 1, `stepped ${ctl.steps.length} times`);
  });

  await t.test('disturbances pause measurement; lowering the ceiling clamps immediately', () => {
    const ctl = createAdaptiveQuality({ start: 'cinematic' });
    run(ctl, 60, DEFAULTS.cooldown + 1);
    run(ctl, 12, DEFAULTS.downWindow - 0.3);
    ctl.disturb();
    assert.equal(run(ctl, 12, 0.5), 'cinematic', 'the slow counter was cleared by the disturbance');
    ctl.setMaxLevel('performance');
    assert.equal(ctl.level, 'performance');
    assert.equal(ctl.steps.at(-1).reason, 'ceiling');
    ctl.forget();
    assert.equal(ctl.steps.length, 0);
  });

  await t.test('resolveQuality passes manual levels through and defers auto', () => {
    const ctl = createAdaptiveQuality({ start: 'performance' });
    assert.equal(resolveQuality('cinematic', ctl), 'cinematic');
    assert.equal(resolveQuality('auto', ctl), 'performance');
    assert.equal(resolveQuality('auto', null), DEFAULTS.start);
    assert.equal(resolveQuality('nonsense', ctl), DEFAULTS.start);
    assert.deepEqual(LEVELS, ['performance', 'balanced', 'cinematic']);
  });
});
