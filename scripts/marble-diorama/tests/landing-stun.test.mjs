import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  initPhysics,
  Simulation,
  DemoController,
  RADIUS,
} from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { part, validateCourse } from "../src/course.mjs";
import { campaignCourses, ultimateCourse } from "../src/campaign.mjs";
import { stunMarks, updateStunMarks } from "../src/stun-view.mjs";
import { effectSamples } from "../src/effects.mjs";
await initPhysics();
test("a real catapult flight lands without dizziness, restores midair, and does not protect later ordinary drops", () => {
  const sim = new Simulation(ultimateCourse(), { untimed: true });
  const driver = new DemoController();
  let launched = false;
  while (sim.tick < 1800 && !launched)
    launched = sim.step([driver.input(sim)]).some((e) => e.type === "spring");
  assert.ok(launched);
  const saved = sim.snapshot();
  const land = () => {
    const stuns = [];
    for (let i = 0; i < 210; i++)
      stuns.push(...sim.step().filter((e) => e.type === "stun"));
    return { player: structuredClone(sim.players[0]), stuns };
  };
  const first = land();
  assert.equal(first.stuns.length, 0);
  assert.equal(first.player.impactLaunched, false);
  assert.equal(first.player.deaths, 0);
  sim.restore(saved);
  assert.deepEqual(land(), first);
  const body = sim.body(sim.players[0]);
  body.setTranslation(
    { ...body.translation(), y: body.translation().y + 5 },
    true,
  );
  body.setLinvel({ x: 0, y: 0, z: 0 }, true);
  body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  let laterStun = false;
  for (let i = 0; i < 180; i++)
    laterStun ||= sim.step().some((e) => e.type === "stun");
  assert.ok(
    laterStun,
    "the next unassisted hard landing still causes dizziness",
  );
  sim.dispose();
});
function fixture(height = 5, enabled = true) {
  const c = blankCourse();
  c.parts = [part("floor", 0, 0, 40, 40)];
  c.starts = [
    { x: 0, y: height, z: 0 },
    { x: -5, y: RADIUS, z: 0 },
  ];
  c.goal = { x: 15, y: 0, z: 15 };
  c.rules = { landingStun: enabled };
  return new Simulation(c, { players: 2 });
}
function land(sim) {
  const events = [];
  for (let i = 0; i < 240 && !events.some((e) => e.type === "stun"); i++)
    events.push(...sim.step());
  return events;
}
test("a hard physical landing causes dizziness without death or respawn, while a small drop and ordinary contact do not", () => {
  const sim = fixture();
  const events = land(sim),
    p = sim.players[0];
  const stuns = events.filter((e) => e.type === "stun");
  assert.equal(stuns.length, 1);
  assert.equal(stuns[0].player, 0);
  assert.ok(stuns[0].speed > 9);
  assert.equal(p.status, "racing");
  assert.equal(p.deaths, 0);
  assert.equal(sim.body(p).isEnabled(), true);
  assert.equal(sim.players[1].stunnedUntil, 0);
  const before = p.time;
  for (let i = 0; i < 30; i++) sim.step();
  assert.ok(p.time < before);
  assert.ok(p.time < sim.course.time);
  sim.dispose();
  for (const [height, enabled] of [
    [0.55, true],
    [1.5, true],
    [5, false],
  ]) {
    const sim = fixture(height, enabled);
    assert.ok(land(sim).every((e) => e.type !== "stun"));
    sim.dispose();
  }
});
test("dizziness blocks steering and turbo without freezing momentum, and snapshot replay restores the same recovery", () => {
  const sim = fixture();
  sim.body(sim.players[0]).setLinvel({ x: 2, y: 0, z: 0 }, true);
  land(sim);
  const p = sim.players[0],
    snap = sim.snapshot(),
    before = { ...p.current.position };
  const run = (input) => {
    for (let i = 0; i < 80; i++) sim.step([input, { x: 0, z: 1, turbo: true }]);
    return structuredClone(sim.players);
  };
  const steered = run({ x: -1, z: -1, turbo: true });
  sim.restore(snap);
  assert.deepEqual(
    run({ x: 0, z: 0, turbo: false }),
    steered,
    "inputs have no influence during dizziness",
  );
  assert.ok(
    Math.abs(steered[0].current.position.x - before.x) > 0.1,
    "momentum is retained",
  );
  assert.ok(steered[1].current.position.z > 0.5, "other player keeps control");
  assert.equal(steered[0].deaths, 0);
  sim.restore(snap);
  while (sim.tick < sim.players[0].stunnedUntil) sim.step();
  const recovered = sim.snapshot();
  const after = (input) => {
    for (let i = 0; i < 90; i++) sim.step([input]);
    return structuredClone(sim.players[0]);
  };
  const forward = after({ x: 1, z: 0, turbo: true });
  sim.restore(recovered);
  const backward = after({ x: -1, z: 0, turbo: true });
  assert.ok(forward.current.position.x > backward.current.position.x + 1);
  sim.dispose();
});
test("side impacts in mid-air cannot masquerade as a landing", () => {
  const c = blankCourse();
  c.parts = [
    part("floor", 0, 0, 30, 30),
    part("wall", 3, 0, 0.3, 20, 8, { h: 8, kind: "wall" }),
  ];
  c.starts = [{ x: 0, y: 3, z: 0 }];
  c.rules = { landingStun: true };
  const s = new Simulation(c, { untimed: true });
  s.body(s.players[0]).setLinvel({ x: 18, y: 0, z: 0 }, true);
  const events = [];
  for (let i = 0; i < 30; i++) events.push(...s.step());
  assert.ok(s.body(s.players[0]).translation().x < 3);
  assert.ok(events.every((e) => e.type !== "stun"));
  s.dispose();
});
test("dizzy marks follow the interpolated marble on the simulation clock and disappear on timeout or recovery", () => {
  const sim = fixture();
  land(sim);
  const p = sim.players[0],
    group = stunMarks(),
    position = new THREE.Vector3(3, 2, 1);
  const time = p.stunTick / 120 + 0.2;
  updateStunMarks(group, p, time, position);
  assert.equal(group.visible, true);
  assert.deepEqual(group.position.toArray(), position.toArray());
  const poses = group.children.map((m) => m.position.toArray());
  updateStunMarks(group, p, time, position);
  assert.deepEqual(
    group.children.map((m) => m.position.toArray()),
    poses,
  );
  updateStunMarks(group, p, time + 0.1, position);
  assert.notDeepEqual(
    group.children.map((m) => m.position.toArray()),
    poses,
  );
  updateStunMarks(group, p, p.stunnedUntil / 120, position);
  assert.equal(group.visible, false);
  p.status = "timeout";
  updateStunMarks(group, p, time, position);
  assert.equal(group.visible, false);
  group.children.forEach((m) => m.geometry.dispose());
  group.children[0].material.dispose();
  sim.dispose();
});
test("original campaign rules enable landing dizziness and imported rule values are validated", () => {
  for (const c of campaignCourses()) assert.equal(c.rules.landingStun, true);
  const c = blankCourse();
  c.rules = { landingStun: "yes" };
  assert.throws(() => validateCourse(c), /rules/);
  const samples = effectSamples("stun", 48000);
  assert.ok(samples.length > 1000);
  assert.ok(samples.some((v) => v !== 0));
});

test("landing severity uses velocity relative to a moving platform, including after snapshot restore", () => {
  function run(moving) {
    const c = blankCourse();
    c.starts = [{ x: 0, y: 1.65, z: 0 }];
    c.rules = { landingStun: true };
    c.parts = [
      part(
        "landing",
        0,
        0,
        20,
        20,
        0,
        moving
          ? {
              kind: "moving",
              motion: { axis: "y", amplitude: 10, period: 10, phase: Math.PI },
            }
          : {},
      ),
    ];
    const sim = new Simulation(c, { untimed: true });
    sim.world.gravity = { x: 0, y: 0, z: 0 };
    sim.body(sim.players[0]).setLinvel({ x: 0, y: -8, z: 0 }, true);
    for (let i = 0; i < 12; i++) sim.step();
    const saved = sim.snapshot();
    const finish = () => {
      const events = [];
      for (let i = 0; i < 90; i++) events.push(...sim.step());
      return {
        player: structuredClone(sim.players[0]),
        stuns: events.filter((e) => e.type === "stun"),
      };
    };
    const first = finish();
    sim.restore(saved);
    assert.deepEqual(finish(), first);
    sim.dispose();
    return first;
  }
  assert.equal(
    run(false).stuns.length,
    1,
    "a fast descent onto a fixed floor is a hard landing",
  );
  assert.equal(
    run(true).stuns.length,
    0,
    "a floor descending with the marble has a gentle relative landing",
  );
});
