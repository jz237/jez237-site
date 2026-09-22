import test from "node:test";
import assert from "node:assert/strict";
import { nativeDynamics, nativeFlightStep } from "../src/native-dynamics.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
await initPhysics();
function course() {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 2.2,
      d: 2.2,
      h: 3,
      cellSize: 1.1,
      cells: [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0],
      ],
    },
  ];
  c.starts = [{ x: 0, y: 100, z: 0 }];
  c.goal = { x: 1, y: 0, z: 1 };
  c.zones = [];
  c.route = [];
  c.checkpoints = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 0,
    rowOrigin: 0,
    heightOrigin: 16384,
    heightScale: 0.1375,
    initialScroll: -16384,
    initialOffset: 0,
    scrollLimit: 824,
    reverse: false,
    rate: 20,
  };
  c.nativeDynamics = { rate: 20 };
  return c;
}
test("native gravity scales with distance and squared update rate; legacy remains unchanged", () => {
  const c = course();
  assert.deepEqual(nativeDynamics(c), {
    gravity: 20.625,
    terminalSpeed: 13.75,
  });
  c.nativeDynamics.rate = 40;
  assert.deepEqual(nativeDynamics(c), { gravity: 82.5, terminalSpeed: 27.5 });
  assert.deepEqual(nativeDynamics(proofCourse()), {
    gravity: 9.81,
    terminalSpeed: null,
  });
  for (const edit of [
    (c) => delete c.nativeCamera,
    (c) => (c.nativeDynamics.rate = 0),
    (c) => (c.nativeDynamics.rate = 121),
  ]) {
    const c = course();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});
test("source flight subtracts 3/8 before integration and caps descent at five units", () => {
  let s = {
      position: { x: 0, z: 0, height: 0 },
      velocity: { x: 0.0625, z: -2.5, up: 10 },
    },
    apex = 0;
  for (let i = 0; i < 100; i++) {
    s = nativeFlightStep(s.position, s.velocity);
    apex = Math.max(apex, s.position.height);
    assert.ok(s.velocity.up >= -5);
  }
  assert.equal(apex, 128.375);
  assert.equal(s.velocity.up, -5);
  assert.equal(s.position.x, 6.25);
  assert.equal(s.position.z, -250);
});
test("Rapier native falls use the recovered acceleration and terminal speed with replay stability", () => {
  const sim = new Simulation(course(), { untimed: true });
  try {
    const p = sim.players[0],
      b = sim.body(p);
    b.setLinvel({ x: 1, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 2, z: 0 }, true);
    for (let i = 0; i < 30; i++) sim.step();
    assert.ok(Math.abs(b.linvel().y + 20.625 * 0.25) < 0.0001);
    const saved = sim.snapshot();
    const run = () => {
      for (let i = 0; i < 160; i++) sim.step();
      return {
        position: { ...b.translation() },
        velocity: { ...b.linvel() },
        angular: { ...b.angvel() },
      };
    };
    const expected = run();
    assert.ok(Math.abs(expected.velocity.y + 13.75) < 0.001);
    assert.ok(Math.abs(expected.velocity.x - 1) < 0.0001);
    assert.ok(
      Math.abs(expected.angular.y - 2) < 0.001,
      JSON.stringify(expected),
    );
    sim.restore(saved);
    // Restored Rapier bodies are newly allocated; use the restored handle.
    for (let i = 0; i < 160; i++) sim.step();
    const restored = sim.body(sim.players[0]);
    assert.deepEqual(
      {
        position: { ...restored.translation() },
        velocity: { ...restored.linvel() },
        angular: { ...restored.angvel() },
      },
      expected,
    );
  } finally {
    sim.dispose();
  }
});
