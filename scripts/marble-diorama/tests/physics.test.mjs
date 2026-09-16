import test from "node:test";
import assert from "node:assert/strict";
import {
  initPhysics,
  Simulation,
  FixedClock,
  DemoController,
  STEP,
  RADIUS,
} from "../src/physics.mjs";
import { proofCourse, part, point, compileCourse } from "../src/course.mjs";
await initPhysics();
const flat = () => ({
  ...proofCourse(),
  parts: [part("flat", 0, 0, 40, 100)],
  starts: [point(0, RADIUS, 0), point(3, RADIUS, 0)],
  goal: point(0, 0, 45),
  zones: [],
});
test("render buffers are the collision buffers, welded across contiguous seams", () => {
  const c = flat();
  c.parts = [part("a", 0, 0, 4, 4), part("b", 0, 4, 4, 4)];
  const g = compileCourse(c).statics[0];
  const keys = [];
  for (let i = 0; i < g.vertices.length; i += 3)
    keys.push(Array.from(g.vertices.slice(i, i + 3)).join(","));
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(g.indices.length > 0);
});
test("settled sphere contact error stays under 1% of visible radius", () => {
  const s = new Simulation(flat(), { untimed: true });
  for (let i = 0; i < 600; i++) s.step();
  const gap = s.body(s.players[0]).translation().y - RADIUS;
  assert.ok(Math.abs(gap) < RADIUS * 0.01, `gap=${gap}`);
  s.dispose();
});
test("no-slip coast displacement agrees with integrated rotation within 2%", () => {
  const s = new Simulation(flat(), { untimed: true });
  const b = s.body(s.players[0]);
  for (let i = 0; i < 240; i++) s.step([{ x: 0, z: 0.5 }]);
  const start = b.translation().z;
  let angle = 0;
  for (let i = 0; i < 240; i++) {
    const before = b.angvel().x;
    s.step();
    angle += (before + b.angvel().x) * 0.5 * STEP;
  }
  const distance = b.translation().z - start;
  assert.ok(
    Math.abs(distance - angle * RADIUS) / distance < 0.02,
    JSON.stringify({ distance, rolled: angle * RADIUS }),
  );
  s.dispose();
});
test("120Hz outcomes agree at 30, 60, and 120 rendering fps", () => {
  const run = (fps) => {
    const s = new Simulation(flat(), { untimed: true });
    const clock = new FixedClock(() =>
      s.step([
        { x: Math.sin(s.tick / 200) * 0.3, z: 0.6, turbo: s.tick > 300 },
      ]),
    );
    for (let f = 0; f < fps * 6; f++) clock.advance(1 / fps);
    const out = [
      s.tick,
      ...Object.values(s.body(s.players[0]).translation()),
      ...Object.values(s.body(s.players[0]).rotation()),
    ];
    s.dispose();
    return out;
  };
  assert.deepEqual(run(30), run(120));
  assert.deepEqual(run(60), run(120));
});
test("airborne angular momentum persists within 0.1% and reversal changes rolling axis", () => {
  const c = flat();
  c.starts[0].y = 20;
  const s = new Simulation(c, { untimed: true });
  const b = s.body(s.players[0]);
  b.setAngvel({ x: 2, y: 1, z: 3 }, true);
  for (let i = 0; i < 60; i++) s.step([{ x: 1, z: 1, turbo: true }]);
  for (const [axis, value] of Object.entries({ x: 2, y: 1, z: 3 }))
    assert.ok(Math.abs(b.angvel()[axis] - value) / value < 0.001);
  s.dispose();
  const t = new Simulation(flat(), { untimed: true });
  for (let i = 0; i < 240; i++) t.step([{ x: 0, z: 0.5 }]);
  assert.ok(t.body(t.players[0]).angvel().x > 0);
  for (let i = 0; i < 600; i++) t.step([{ x: 0, z: -0.5 }]);
  assert.ok(t.body(t.players[0]).angvel().x < 0);
  t.dispose();
});
test("CCD stops a turbo marble at a thin barrier", () => {
  const c = flat();
  c.parts.push(part("barrier", 0, 7, 20, 0.15, 3, { kind: "wall", h: 3 }));
  const s = new Simulation(c, { untimed: true });
  const b = s.body(s.players[0]);
  for (let i = 0; i < 900; i++) s.step([{ x: 0, z: 1, turbo: true }]);
  assert.ok(b.translation().z < 7 - RADIUS);
  s.dispose();
});
test("two-player collision exchanges momentum; clocks and timeout are independent", () => {
  const s = new Simulation(flat(), { players: 2 });
  const a = s.body(s.players[0]),
    b = s.body(s.players[1]);
  a.setLinvel({ x: 6, y: 0, z: 0 }, true);
  for (let i = 0; i < 70; i++) s.step();
  assert.ok(b.translation().x > 3.1);
  s.players[0].time = STEP / 2;
  s.players[1].time = 15;
  s.step();
  assert.equal(s.players[0].status, "timeout");
  assert.equal(s.players[1].status, "racing");
  assert.ok(s.players[1].time > 14);
  s.dispose();
});
test("snapshot restore and replay reproduces same physics state", () => {
  const s = new Simulation(flat(), { untimed: true });
  for (let i = 0; i < 200; i++) s.step([{ x: 0, z: 0.7 }]);
  const snap = s.snapshot();
  for (let i = 0; i < 150; i++) s.step([{ x: 0.4, z: 0 }]);
  const expected = s.players[0].current;
  s.restore(snap);
  for (let i = 0; i < 150; i++) s.step([{ x: 0.4, z: 0 }]);
  assert.deepEqual(s.players[0].current, expected);
  s.dispose();
});
test("paused clocks do not accumulate hidden-tab time", () => {
  let steps = 0;
  const c = new FixedClock(() => steps++);
  c.advance(STEP);
  c.pause(true);
  c.advance(200);
  c.pause(false);
  c.advance(STEP);
  assert.equal(steps, 2);
});
test("a slow visible render does not discard simulation time", () => {
  let steps = 0;
  const c = new FixedClock(() => steps++);
  c.advance(0.75);
  assert.equal(steps, 90);
  assert.ok(c.alpha < 0.00001);
});
test("proof course completes using normal demo inputs, including slope, channel, drop and bridge", () => {
  const s = new Simulation(proofCourse()),
    d = new DemoController();
  let airborne = false;
  for (let i = 0; i < 120 * 90; i++) {
    const input = d.input(s);
    assert.ok(Math.abs(input.x) <= 1 && Math.abs(input.z) <= 1);
    s.step([input]);
    if (!s.players[0].grounded && s.players[0].current.position.z > 30)
      airborne = true;
    if (s.players[0].status === "finished") break;
  }
  assert.equal(s.players[0].status, "finished");
  assert.equal(s.players[0].deaths, 0);
  assert.ok(airborne);
  assert.ok(s.tick < 120 * 30);
  s.dispose();
});
test("marble crosses a smooth welded seam under turbo without losing speed or snagging", () => {
  const c = flat();
  c.parts = [part("a", 0, 0, 8, 12), part("b", 0, 12, 8, 12)];
  c.goal = point(0, 0, 17);
  const s = new Simulation(c, { untimed: true });
  let before = 0,
    after = 0;
  for (let i = 0; i < 1000; i++) {
    s.step([{ x: 0, z: 1, turbo: true }]);
    const b = s.body(s.players[0]),
      p = b.translation();
    if (p.z < 5.5) before = b.linvel().z;
    if (p.z > 6.5) {
      after = b.linvel().z;
      break;
    }
  }
  assert.ok(before > 4);
  assert.ok(after >= before * 0.98, `${before} to ${after}`);
  s.dispose();
});
test("kinematic bridge carries a standing marble and mesh transform matches body", () => {
  const c = flat();
  c.parts = [
    part("moving", 0, 0, 8, 8, 0, {
      kind: "moving",
      motion: { axis: "y", amplitude: 0.4, period: 5 },
    }),
  ];
  const s = new Simulation(c, { untimed: true });
  let maxGap = 0;
  for (let i = 0; i < 600; i++) {
    s.step();
    const p = s.body(s.players[0]).translation();
    const m = s.movers[0];
    assert.deepEqual(
      { ...s.world.getRigidBody(m.handle).translation() },
      m.current.position,
    );
    if (i > 120)
      maxGap = Math.max(maxGap, Math.abs(p.y - m.current.position.y - RADIUS));
  }
  assert.ok(maxGap < RADIUS * 0.01, `gap=${maxGap}`);
  s.dispose();
});
test("finish and fall are independent per player; assistance uses its reached checkpoint", () => {
  const c = flat();
  const s = new Simulation(c, { players: 2, assisted: true });
  const p = s.players[0];
  s.body(p).setTranslation({ x: 0, y: RADIUS, z: 45 }, true);
  for (let i = 0; i < 4; i++) s.step();
  assert.equal(p.status, "finished");
  assert.equal(s.players[1].status, "racing");
  const q = s.players[1];
  q.checkpoint = 0;
  s.fall(q);
  for (let i = 0; i < 91; i++) s.step();
  assert.equal(q.status, "racing");
  assert.equal(q.deaths, 1);
  assert.ok(Math.abs(q.current.position.z - c.checkpoints[0].z) < 0.01);
  s.dispose();
});
