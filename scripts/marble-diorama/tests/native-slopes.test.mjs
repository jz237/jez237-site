import test from "node:test";
import assert from "node:assert/strict";
import {
  sourceSlopeStep,
  nativeSlopeAcceleration,
} from "../src/native-slopes.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
await initPhysics();

function fixture({ slope = 0.25, angle = 0, uphill = true, air = false } = {}) {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 40,
      d: 8,
      h: 8,
      cellSize: 1,
      angle,
      cells: Array.from({ length: 320 }, (_, i) => {
        const x = i % 40,
          z = Math.floor(i / 40),
          h = (x - 20) * slope;
        return [x, z, h, h + slope, h, h + slope];
      }),
    },
  ];
  c.starts = [
    { x: 0, y: air ? 8 : 0.55 * Math.sqrt(1 + slope * slope) + 0.001, z: 0 },
  ];
  c.goal = { x: 18, y: 18 * slope, z: 0 };
  c.zones = [];
  c.checkpoints = [];
  c.route = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 0,
    rowOrigin: 0,
    heightOrigin: 16384,
    heightScale: 0.125,
    initialScroll: -16384,
    initialOffset: 40,
    scrollLimit: 944,
    reverse: true,
    rate: 20,
  };
  c.nativeDynamics = { rate: 20, uphillSlopes: uphill };
  return c;
}

test("source slope force reverses for Silly and quadruples at signed magnitude twelve", () => {
  assert.deepEqual(sourceSlopeStep({ x: 1, z: 2 }, { x: 8, z: -8 }), {
    x: 0.75,
    z: 2.25,
  });
  assert.deepEqual(sourceSlopeStep({ x: 1, z: 2 }, { x: 8, z: -8 }, true), {
    x: 1.25,
    z: 1.75,
  });
  assert.deepEqual(sourceSlopeStep({ x: 0, z: 0 }, { x: 11, z: -11 }, true), {
    x: 11 / 32,
    z: -11 / 32,
  });
  assert.deepEqual(sourceSlopeStep({ x: 0, z: 0 }, { x: 12, z: -12 }, true), {
    x: 1.5,
    z: -1.5,
  });
  assert.deepEqual(sourceSlopeStep({ x: 1, z: 2 }, { x: 0, z: 0 }, true), {
    x: 1,
    z: 2,
  });
});

test("contact force is tangent to the visible plane and preserves the recovered steepness threshold after rotation", () => {
  const c = fixture(),
    slope = 0.25,
    n = { x: -slope / Math.hypot(1, slope), y: 1 / Math.hypot(1, slope), z: 0 };
  const a = nativeSlopeAcceleration(c, n, 18.75);
  assert.ok(Math.abs(a.x * n.x + a.y * n.y + a.z * n.z) < 1e-10);
  assert.equal(nativeSlopeAcceleration(c, null, 18.75), null);
  assert.equal(nativeSlopeAcceleration(c, { x: 1, y: 0, z: 0 }, 18.75), null);
  assert.deepEqual(nativeSlopeAcceleration(c, { x: 0, y: 1, z: 0 }, 18.75), {
    x: 0,
    y: 0,
    z: 0,
  });
  c.parts[0].angle = 0.7;
  const rotated = { x: n.x * Math.cos(0.7), y: n.y, z: n.x * Math.sin(0.7) };
  const b = nativeSlopeAcceleration(c, rotated, 18.75);
  assert.ok(Math.abs(b.x - a.x * Math.cos(0.7)) < 1e-9);
  assert.ok(Math.abs(b.z - a.x * Math.sin(0.7)) < 1e-9);
});

test("a marble at rest rolls uphill in Silly and downhill with the rule disabled", () => {
  for (const uphill of [true, false]) {
    const sim = new Simulation(fixture({ uphill }), { untimed: true });
    try {
      const p = sim.players[0],
        body = sim.body(p);
      for (let i = 0; i < 120; i++) sim.step();
      assert.equal(p.status, "racing");
      assert.equal(Math.sign(body.translation().x), uphill ? 1 : -1);
      assert.ok(Math.abs(body.translation().x) > 0.5);
      assert.ok(
        Math.abs(
          body.translation().y -
            0.25 * body.translation().x -
            0.55 * Math.sqrt(1.0625),
        ) < 0.0055,
      );
      const v = body.linvel(),
        w = body.angvel();
      const surfaceSpeed = Math.hypot(v.x, v.y),
        rollingSpeed = Math.abs(w.z) * 0.55;
      assert.ok(
        Math.abs(rollingSpeed - surfaceSpeed) / surfaceSpeed < 0.02,
        `rolling slip: ${surfaceSpeed}, ${rollingSpeed}`,
      );
    } finally {
      sim.dispose();
    }
  }
});

test("Silly slope acceleration follows the recovered source scale and rotated board direction", () => {
  for (const angle of [0, 0.65]) {
    const sim = new Simulation(fixture({ angle }), { untimed: true });
    try {
      const body = sim.body(sim.players[0]);
      for (let i = 0; i < 30; i++) sim.step();
      const initial = { ...body.linvel() };
      for (let i = 0; i < 60; i++) sim.step();
      const v = body.linvel(),
        accel =
          ((v.x - initial.x) * Math.cos(angle) +
            (v.z - initial.z) * Math.sin(angle)) /
          0.5;
      assert.ok(
        Math.abs(accel - 3.125) < 0.0625,
        `angle ${angle}: source acceleration 3.125, physical ${accel}`,
      );
      assert.ok(
        Math.abs(-v.x * Math.sin(angle) + v.z * Math.cos(angle)) < 0.02,
      );
    } finally {
      sim.dispose();
    }
  }
});

test("uphill behavior never reverses airborne gravity or creates motion over a flat floor", () => {
  for (const air of [true, false]) {
    const sim = new Simulation(fixture({ air, slope: 0 }), { untimed: true });
    try {
      for (let i = 0; i < 30; i++) sim.step();
      const b = sim.body(sim.players[0]),
        v = b.linvel();
      assert.ok(Math.hypot(v.x, v.z) < 1e-6);
      if (air) assert.ok(Math.abs(v.y + 18.75 * 0.25) < 1e-5);
      else assert.ok(Math.abs(b.translation().y - 0.55) < 0.0055);
    } finally {
      sim.dispose();
    }
  }
});

test("uphill slope imports reject unsupported settings and snapshot continuation is exact", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => (c.nativeDynamics.uphillSlopes = "yes"),
    (c) => (c.nativeCamera.reverse = false),
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    for (let i = 0; i < 80; i++) sim.step();
    const snap = sim.snapshot();
    for (let i = 0; i < 80; i++) sim.step();
    const expected = structuredClone(sim.players);
    sim.restore(snap);
    for (let i = 0; i < 80; i++) sim.step();
    assert.deepEqual(sim.players, expected);
  } finally {
    sim.dispose();
  }
});
