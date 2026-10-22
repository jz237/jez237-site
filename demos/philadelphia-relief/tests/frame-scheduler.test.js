import test from 'node:test';
import assert from 'node:assert/strict';
import { createFrameScheduler } from '../src/render-policy.js';

function display(interval, work = 0) {
  let clock = 0, id = 0, active = true;
  const frames = new Map(), timers = new Map(), rendered = [];
  const scheduler = createFrameScheduler({
    now: () => clock, canRender: () => active,
    requestFrame: callback => { frames.set(++id, callback); return id; },
    cancelFrame: ticket => frames.delete(ticket),
    setTimer: (callback, delay) => { timers.set(++id, { callback, at: clock + delay }); return id; },
    clearTimer: ticket => timers.delete(ticket),
    render(timestamp) { rendered.push(timestamp); clock += work; scheduler.request(interval); },
  });
  return { scheduler, rendered, frames, timers,
    setActive(value) { active = value; },
    at(timestamp) {
      if (timestamp < clock) return;
      clock = timestamp;
      for (const [ticket, timer] of [...timers]) {
        if (timer.at <= clock) { timers.delete(ticket); timer.callback(); }
      }
      for (const [ticket, callback] of [...frames]) {
        frames.delete(ticket); callback(timestamp);
      }
    },
  };
}

test('animated power saving holds 20 fps on 60 and 120 Hz displays without additive render delays', () => {
  for (const hz of [60, 120]) {
    const view = display(50, 12);
    view.scheduler.request();
    for (let n = 0; n <= hz * 5; n++) view.at(n * 1000 / hz);
    assert.equal(view.rendered.length, 101);
    assert.equal(view.timers.size, 0, 'moving scenes do not depend on delayed browser timers');
    assert.equal(view.frames.size, 1);
    for (let i = 1; i < view.rendered.length; i++) {
      assert.ok(Math.abs(view.rendered[i] - view.rendered[i - 1] - 50) < 0.01);
    }
  }
});

test('continuous mode renders on each display frame; long stalls never cause catch-up bursts', () => {
  const continuous = display(0);
  continuous.scheduler.request();
  for (let n = 0; n < 60; n++) continuous.at(n * 1000 / 60);
  assert.equal(continuous.rendered.length, 60);
  const paced = display(50);
  paced.scheduler.request(); paced.at(0); paced.at(200); paced.at(216); paced.at(233);
  assert.deepEqual(paced.rendered, [0, 200]);
  paced.at(250);
  assert.deepEqual(paced.rendered, [0, 200, 250]);
});

test('stationary scenes sleep between refreshes and input immediately interrupts their timer', () => {
  const view = display(500, 12);
  view.scheduler.request(); view.at(0);
  assert.equal(view.frames.size, 0);
  assert.equal(view.timers.size, 1);
  view.at(499);
  assert.deepEqual(view.rendered, [0]);
  view.at(500);
  assert.deepEqual(view.rendered, [0, 500]);
  for (let i = 0; i < 30; i++) view.scheduler.request();
  assert.equal(view.timers.size, 0);
  assert.equal(view.frames.size, 1, 'input bursts share one pending frame');
  view.at(517);
  assert.deepEqual(view.rendered, [0, 500, 517]);
});

test('input removes an animated deadline without starving a pending display frame', () => {
  const view = display(50);
  view.scheduler.request(); view.at(0); view.at(16);
  for (let i = 0; i < 30; i++) view.scheduler.request();
  assert.equal(view.frames.size, 1);
  view.at(33);
  assert.deepEqual(view.rendered, [0, 33]);
});

test('hidden, suspended and disposed scenes cancel work and can resume without stale deadlines', () => {
  for (const interval of [0, 50, 500]) {
    const view = display(interval);
    view.scheduler.request(); view.at(0);
    view.setActive(false); view.scheduler.cancel(); view.scheduler.request(); view.at(1000);
    assert.deepEqual(view.rendered, [0]);
    assert.equal(view.frames.size, 0); assert.equal(view.timers.size, 0);
    view.setActive(true); view.scheduler.request(); view.at(1017);
    assert.deepEqual(view.rendered, [0, 1017]);
    // A visibility change can also race with an already queued callback.
    view.setActive(false); view.at(2000);
    assert.deepEqual(view.rendered, [0, 1017]);
    assert.equal(view.frames.size, 0); assert.equal(view.timers.size, 0);
  }
});
