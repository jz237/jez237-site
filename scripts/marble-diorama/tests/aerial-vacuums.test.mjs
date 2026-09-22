import test from "node:test";
import assert from "node:assert/strict";
import { proofCourse, validateCourse, motionAt } from "../src/course.mjs";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
import {
  createAerialVacuums,
  advanceAerialVacuums,
  aerialVacuumPoses,
  nativeVacuumEffect,
  nativeVacuumSourcePosition,
  scheduleVacuumRetirement,
} from "../src/aerial-vacuums.mjs";
import { AERIAL_VACUUMS } from "../src/aerial-vacuum-sequence.mjs";
import { vacuumAt } from "../src/vacuum.mjs";
await initPhysics();

function fixture() {
  const c = proofCourse(),
    cells = [];
  for (let z = 0; z < 12; z++)
    for (let x = 0; x < 20; x++) cells.push([x, z, 0, 0, 0, 0]);
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 22,
      d: 13.2,
      h: 3,
      cellSize: 1.1,
      cells,
    },
  ];
  c.zones = [];
  for (let i = 0; i < 6; i++) {
    const a = AERIAL_VACUUMS[i],
      p = {
        id: `vacuum-${i}`,
        kind: "piston",
        profile: "vacuum-mouth",
        x: i * 3 - 7.5,
        y: 0,
        z: 0,
        w: 1.1,
        d: 4.4,
        h: 3.3,
        angle: a.type === 11 ? -Math.PI / 2 : Math.PI,
        material: "yellow",
        motion: { axis: "native-vacuum", amplitude: 0, period: 1 },
      };
    c.parts.push(p);
    c.zones.push({
      kind: "vacuum",
      mouth: p.id,
      x: p.x,
      y: RADIUS,
      z: p.z,
      radius: 4,
      strength: 1,
      direction: { x: -Math.cos(p.angle), y: 0, z: -Math.sin(p.angle) },
      intakeHeight: RADIUS,
    });
  }
  c.starts = [
    { x: -7.5, y: RADIUS + 0.01, z: 3 },
    { x: 7, y: RADIUS + 0.01, z: 5 },
  ];
  c.goal = { x: 10, y: 0, z: 6 };
  c.checkpoints = [];
  c.route = [];
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 0,
    rowOrigin: 0,
    heightOrigin: 16300,
    heightScale: 0.1375,
    initialScroll: -16300,
    initialOffset: 0,
    scrollLimit: 824,
    reverse: false,
    rate: 20,
  };
  c.navigation = {
    type: "terrain-gates",
    partId: "ground",
    initialRegions: [30, 30],
    gates: [],
  };
  c.vacuumSequence = {
    parts: c.parts.slice(1).map((p) => p.id),
    rate: 50,
    activationBand: [0, 30],
  };
  return c;
}

test("native vacuum schema requires six linked mouths, a camera, and no competing presence timers", () => {
  const c = fixture();
  validateCourse(c);
  for (const edit of [
    (c) => delete c.vacuumSequence,
    (c) => delete c.nativeCamera,
    (c) => (c.vacuumSequence.parts[1] = "vacuum-0"),
    (c) => (c.vacuumSequence.rate = 0),
    (c) => (c.vacuumSequence.activationBand = [30, 6]),
    (c) => c.zones.pop(),
    (c) => (c.parts[1].presence = { period: 10, on: 5 }),
    (c) => (c.parts[1].profile = "peg"),
  ]) {
    const bad = structuredClone(c);
    edit(bad);
    assert.throws(() => validateCourse(bad));
  }
});

test("source field follows translated and rotated housings, including the perpendicular mouths", () => {
  const c = fixture(),
    state = createAerialVacuums(c);
  advanceAerialVacuums(c, state, [{ region: 30, active: true }], 0.02, {
    transitions: [[-2, 0]],
  });
  for (let i = 0; i < 6; i++) state.sequence.actors[i].phase = "hold";
  for (const i of [0, 2]) {
    const p = c.parts[i + 1],
      side = i === 2;
    const point = {
      x: p.x + (side ? 3 : 0),
      y: RADIUS,
      z: p.z + (side ? 0 : 3),
    };
    const before = nativeVacuumSourcePosition(c, i, point, RADIUS);
    const force = nativeVacuumEffect(c, state, i, point, point, RADIUS);
    assert.equal(force.kind, "pull");
    const angle = 0.73,
      cs = Math.cos(angle),
      sn = Math.sin(angle),
      x0 = p.x,
      z0 = p.z;
    p.x += 7;
    p.z -= 4;
    p.angle += angle;
    const transformed = {
      x: p.x + (point.x - x0) * cs - (point.z - z0) * sn,
      y: RADIUS,
      z: p.z + (point.x - x0) * sn + (point.z - z0) * cs,
    };
    const after = nativeVacuumSourcePosition(c, i, transformed, RADIUS);
    for (const k of ["x", "z", "height"])
      assert.ok(Math.abs(after[k] - before[k]) < 1e-9);
    const rotated = nativeVacuumEffect(
      c,
      state,
      i,
      transformed,
      transformed,
      RADIUS,
    );
    assert.ok(Math.abs(rotated.x - (force.x * cs - force.z * sn)) < 1e-9);
    assert.ok(Math.abs(rotated.z - (force.x * sn + force.z * cs)) < 1e-9);
  }
});

test("suction and audio state stop at withdrawal, and retirement waits exactly 32 native updates", () => {
  const c = fixture(),
    s = createAerialVacuums(c),
    players = [{ region: 30, active: true }];
  advanceAerialVacuums(c, s, players, 0.02, { transitions: [[-2, 0]] });
  advanceAerialVacuums(c, s, players, 0.34, { transitions: [] });
  assert.equal(s.sequence.actors[0].phase, "hold");
  let poses = aerialVacuumPoses(c, s);
  assert.equal(vacuumAt(c.zones[0], 0.34, c.parts, poses).active, true);
  scheduleVacuumRetirement(s, 0);
  advanceAerialVacuums(c, s, players, 0.96, { transitions: [] });
  assert.equal(s.sequence.actors[0].phase, "hold");
  advanceAerialVacuums(c, s, players, 0.98, { transitions: [] });
  assert.equal(s.sequence.actors[0].phase, "retract");
  poses = aerialVacuumPoses(c, s);
  assert.equal(vacuumAt(c.zones[0], 0.98, c.parts, poses).active, false);
  assert.equal(poses["vacuum-0"].visible, true);
  advanceAerialVacuums(c, s, players, 1.34, { transitions: [] });
  assert.equal(s.sequence.actors[0].phase, "removed");
  assert.equal(aerialVacuumPoses(c, s)["vacuum-0"].visible, false);
});

test("a real resting marble is pulled into a deployed intake, while the second marble remains independent", () => {
  const c = fixture(),
    sim = new Simulation(c, { players: 2, untimed: true });
  try {
    let capture = null;
    for (let i = 0; i < 400; i++) {
      const events = sim.step();
      if (
        !capture &&
        events.some((e) => e.type === "fall" && e.cause === "vacuum")
      )
        capture = sim.tick;
      for (const m of sim.movers) {
        assert.equal(
          sim.world.getRigidBody(m.handle).collider(0).isSensor(),
          false,
        );
        const expected = motionAt(m.part, 0, sim.nativeVacuumPoses[m.part.id]);
        assert.equal(
          sim.world.getRigidBody(m.handle).isEnabled(),
          expected.visible,
        );
        assert.ok(Math.abs(m.current.position.y - expected.position.y) < 1e-6);
      }
    }
    assert.ok(capture > 36 && capture < 150, `capture tick ${capture}`);
    assert.equal(sim.players[0].deaths, 1);
    assert.equal(sim.players[1].deaths, 0);
    assert.equal(sim.aerialVacuums.sequence.actors[0].phase, "removed");
    assert.equal(sim.players[0].status, "racing");
    assert.equal(sim.players[1].status, "racing");
  } finally {
    sim.dispose();
  }
});

test("snapshot during vacuum capture restores scheduled retirement, fragments and physical outcome", () => {
  const sim = new Simulation(fixture(), { players: 2, untimed: true });
  try {
    while (sim.tick < 200 && !sim.players[0].vacuumCapture) sim.step();
    assert.ok(sim.players[0].vacuumCapture);
    const saved = sim.snapshot();
    for (let i = 0; i < 350; i++) sim.step();
    const expected = {
      players: structuredClone(sim.players),
      state: structuredClone(sim.aerialVacuums),
      poses: structuredClone(sim.nativeVacuumPoses),
    };
    sim.restore(saved);
    for (let i = 0; i < 350; i++) sim.step();
    assert.deepEqual(sim.players, expected.players);
    assert.deepEqual(sim.aerialVacuums, expected.state);
    assert.deepEqual(sim.nativeVacuumPoses, expected.poses);
  } finally {
    sim.dispose();
  }
});
