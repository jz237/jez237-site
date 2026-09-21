import test from "node:test";
import assert from "node:assert/strict";
import { initPhysics, Simulation, DemoController } from "../src/physics.mjs";
import { bonusCourses } from "../src/bonus.mjs";
import {
  blankCourse,
  makeWorkshopPart,
  moveWorkshopObject,
  rotateWorkshopObject,
  removeWorkshopObject,
} from "../src/workshop.mjs";
import { compileCourse, validateCourse } from "../src/course.mjs";
import { Recording, seekRecording } from "../src/storage.mjs";
import { waveStrip, wavePose } from "../src/wave.mjs";
import { Vector3, Quaternion } from "three";
await initPhysics();

test("traveling-wave panels share exact top edges and physically lift a marble", () => {
  const c = blankCourse();
  c.goal.z = 30;
  c.parts = waveStrip("wave", { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 8 }, 6, {
    amplitude: 0.5,
    period: 3,
    wavelength: 8,
  });
  c.starts = [{ x: 0, y: 0.56, z: 4 }];
  const worldVertices = (pose) => {
    const q = new Quaternion(
      pose.rotation.x,
      pose.rotation.y,
      pose.rotation.z,
      pose.rotation.w,
    );
    return [0, 1, 2, 3].map((i) =>
      new Vector3(...pose.vertices.slice(i * 3, i * 3 + 3))
        .applyQuaternion(q)
        .add(new Vector3(pose.position.x, pose.position.y, pose.position.z)),
    );
  };
  for (const t of [0, 0.3, 1, 2.4])
    for (let i = 0; i < c.parts.length - 1; i++) {
      const a = worldVertices(wavePose(c.parts[i], t)),
        b = worldVertices(wavePose(c.parts[i + 1], t));
      assert.ok(a[1].distanceTo(b[0]) < 1e-6);
      assert.ok(a[2].distanceTo(b[3]) < 1e-6);
    }
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 60; i++) sim.step();
  assert.ok(
    sim.players[0].current.position.y > 0.85,
    "wave lifts the resting marble",
  );
  const snap = sim.snapshot();
  for (let i = 0; i < 90; i++) sim.step();
  const expected = structuredClone(sim.players);
  sim.restore(snap);
  for (let i = 0; i < 90; i++) sim.step();
  assert.deepEqual(sim.players, expected);
  sim.dispose();
});

test("wall-to-wall bird hulls hit a marble on their path and leave adjacent marbles safe", () => {
  for (const z of [0, 0.9, 2]) {
    const c = blankCourse();
    c.goal.z = 30;
    c.starts = [{ x: 0, y: 0.55, z }];
    c.enemies = [
      {
        id: "bird",
        kind: "bird",
        x: -3,
        y: 0.55,
        z: 0,
        radius: 0.65,
        roam: 6,
        speed: 6,
        direction: { x: 1, z: 0 },
        distance: 6,
        rest: 1,
      },
    ];
    const s = new Simulation(c, { untimed: true });
    for (let i = 0; i < 90; i++) s.step();
    assert.equal(s.players[0].deaths, z < 2 ? 1 : 0);
    s.dispose();
  }
});

test("disappearing platform removes support on schedule and snapshot replay preserves the cycle", () => {
  const c = blankCourse();
  c.goal.z = 30;
  c.parts = [
    makeWorkshopPart(
      "moving",
      0,
      0,
      0,
      { width: 6, depth: 6, amplitude: 0, period: 2 },
      "vanish",
    ),
  ];
  c.parts[0].presence = { period: 2, on: 1, phase: 0 };
  c.starts = [{ x: 0, y: 0.55, z: 0 }];
  const s = new Simulation(c, { untimed: true });
  for (let i = 0; i < 100; i++) s.step();
  const snap = s.snapshot();
  for (let i = 0; i < 100; i++) s.step();
  assert.equal(s.world.getRigidBody(s.movers[0].handle).isEnabled(), false);
  assert.ok(s.players[0].current.position.y < 0);
  const expected = structuredClone(s.players);
  s.restore(snap);
  for (let i = 0; i < 100; i++) s.step();
  assert.deepEqual(s.players, expected);
  s.dispose();
});

test("moving acid uses the translated sensor footprint", () => {
  const c = blankCourse();
  c.goal.z = 30;
  c.starts = [{ x: 1.8, y: 0.55, z: 0 }];
  c.zones = [
    {
      kind: "acid",
      x: 0,
      y: 0,
      z: 0,
      radius: 0.4,
      motion: { axis: "x", amplitude: 2, period: 4 },
    },
  ];
  const s = new Simulation(c, { untimed: true });
  for (let i = 0; i < 120; i++) s.step();
  assert.equal(s.players[0].deaths, 1);
  assert.ok(
    Math.abs(s.world.getCollider(s.acid[0].handle).translation().x - 2) < 0.001,
  );
  s.dispose();
});

test("all bonus courses finish with normal steering in timed single and two-player runs", () => {
  for (const players of [1, 2])
    for (const course of bonusCourses()) {
      const sim = new Simulation(course, { players }),
        demos = sim.players.map(() => new DemoController());
      while (
        sim.tick < 18000 &&
        !sim.players.every((p) => ["finished", "timeout"].includes(p.status))
      )
        sim.step(demos.map((d, i) => d.input(sim, i)));
      for (const p of sim.players)
        assert.equal(p.status, "finished", `${course.id} / ${players}P`);
      sim.dispose();
    }
});

test("moving bonus replay reproduces platform contacts after an input-only save", () => {
  const sim = new Simulation(bonusCourses()[0]),
    demo = new DemoController(),
    record = new Recording(sim);
  for (let i = 0; i < 2400; i++) {
    const controls = [demo.input(sim)];
    sim.step(controls);
    record.capture(sim, controls);
  }
  const replay = seekRecording(JSON.parse(JSON.stringify(record)), sim.tick);
  assert.deepEqual(replay.players, sim.players);
  assert.deepEqual(replay.movers, sim.movers);
  replay.dispose();
  sim.dispose();
});

test("editor curves, pipes, moving pieces, relocation and rotation survive a compiled JSON round trip", () => {
  const c = blankCourse();
  for (const [i, kind] of [
    "curve",
    "curved-channel",
    "tube",
    "moving",
    "tilt",
    "piston",
    "spring",
  ].entries())
    c.parts.push(
      makeWorkshopPart(
        kind,
        i * 15,
        0,
        20,
        {
          width: 4,
          depth: 8,
          radius: 7,
          rise: 2,
          angle: 45,
          amplitude: 5,
          period: 6,
        },
        kind,
      ),
    );
  moveWorkshopObject(c, "part:curve", { x: 12, y: 3, z: 24 });
  rotateWorkshopObject(c, "part:curve", Math.PI / 2);
  rotateWorkshopObject(c, "part:moving", Math.PI / 4);
  c.zones = [{ kind: "acid", x: 0, y: 0, z: 0, radius: 2 }];
  removeWorkshopObject(c, "zone:0");
  const a = compileCourse(c),
    b = compileCourse(validateCourse(JSON.parse(JSON.stringify(c))));
  assert.deepEqual(a.statics, b.statics);
  assert.deepEqual(a.moving, b.moving);
  assert.ok(
    a.statics.every((g) => Array.from(g.vertices).every(Number.isFinite)),
  );
  assert.throws(() => removeWorkshopObject(c, "start:0"), /Move starts/);
});
