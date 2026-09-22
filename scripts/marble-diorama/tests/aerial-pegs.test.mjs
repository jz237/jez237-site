import test from "node:test";
import assert from "node:assert/strict";
import {
  createPegSequence,
  pegPose,
  stepPegSequence,
  sourcePegContact,
  advanceAerialPegs,
} from "../src/aerial-pegs.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { Simulation, initPhysics, RADIUS } from "../src/physics.mjs";
await initPhysics();

function fixture() {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 24,
      d: 24,
      h: 3,
      cellSize: 1,
      cells: Array.from({ length: 576 }, (_, i) => [
        i % 24,
        Math.floor(i / 24),
        0,
        0,
        0,
        0,
      ]),
    },
  ];
  for (let i = 0; i < 36; i++)
    c.parts.push({
      id: `peg-${i}`,
      kind: "piston",
      profile: "peg",
      x: Math.floor(i / 12) * 7 - 8 + (i % 3),
      z: Math.floor((i % 12) / 3) * 1.4 - 2,
      y: 0.005,
      w: 0.9,
      d: 0.9,
      h: 1.5,
      material: "metal",
      motion: { axis: "native-peg", amplitude: 1.5, period: 1 },
    });
  c.starts = [
    { x: 0, y: RADIUS + 0.02, z: 8 },
    { x: 3, y: RADIUS + 0.02, z: 8 },
  ];
  c.goal = { x: 10, y: 0, z: 10 };
  c.checkpoints = [];
  c.zones = [];
  c.route = [];
  c.navigation = {
    type: "terrain-gates",
    partId: "ground",
    initialRegions: [4, 5],
    gates: [],
  };
  c.nativeCamera = {
    partId: "ground",
    columnOrigin: 0,
    rowOrigin: 0,
    heightOrigin: 0,
    heightScale: 0.125,
    initialScroll: 0,
    initialOffset: 0,
    scrollLimit: 824,
    reverse: false,
    rate: 20,
  };
  c.pegSequence = { parts: c.parts.slice(1).map((p) => p.id), rate: 20 };
  return c;
}

test("each source selector raises exactly three indexed pegs, including both non-axis patterns", () => {
  for (const [pattern, choice, expected] of [
    [0, [3], [9, 10, 11]],
    [1, [2, 1], [5, 8, 11]],
    [2, [1], [3, 7, 11]],
    [3, [1], [3, 5, 7]],
  ]) {
    const s = createPegSequence();
    const samples = [
      0,
      ...Array.from({ length: 3 }, () => [pattern, ...choice]).flat(),
      0,
      1,
      0,
    ];
    stepPegSequence(s, true, () => samples.shift());
    assert.equal(samples.length, 0);
    for (let i = 0; i < 3; i++) {
      assert.deepEqual(
        s.beds[i].selected,
        expected.map((n) => n + i * 12),
      );
      assert.deepEqual(
        s.beds[i].drawn,
        expected.map((n) => n + i * 12 + (pattern === 3 ? 2 : 0)),
      );
      assert.equal(
        s.levels.slice(i * 12, i * 12 + 12).filter(Boolean).length,
        3,
      );
    }
  }
});

test("stroke holds seven frames at full height, then retracts and waits 0, 16, 32 or 48 updates", () => {
  for (const choice of [0, 1, 2, 3]) {
    const s = createPegSequence();
    stepPegSequence(s, true, () => 0);
    assert.equal(s.levels[0], 1);
    for (const level of [2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1]) {
      stepPegSequence(s, true, () => 0);
      assert.equal(s.levels[0], level);
      assert.equal(s.collision.filter(Boolean).length, 9);
    }
    stepPegSequence(s, true, () => choice);
    assert.equal(s.beds[0].wait, choice * 16);
    assert.equal(s.collision.some(Boolean), false);
    assert.equal(s.levels.some(Boolean), false);
    for (let i = 1; i < Math.max(1, choice * 16); i++) {
      stepPegSequence(s, true, () => 0);
      assert.equal(s.levels.some(Boolean), false);
    }
    stepPegSequence(s, true, () => 0);
    assert.equal(s.beds[0].frame, 0);
  }
});

test("either active player in region 4 or 5 keeps beds active; leaving freezes bed counters", () => {
  const c = fixture(),
    s = createPegSequence();
  const idle = [
    { active: true, region: 3 },
    { active: false, region: 4 },
  ];
  advanceAerialPegs(c, s, idle, 0.5);
  assert.equal(s.loaded, false);
  advanceAerialPegs(c, s, [idle[0], { active: true, region: 5 }], 0.55);
  assert.equal(s.loaded, true);
  const beds = structuredClone(s.beds);
  advanceAerialPegs(c, s, idle, 1);
  assert.deepEqual(s.beds, beds);
  assert.equal(s.collision.some(Boolean), false);
  assert.equal(s.levels.some(Boolean), false);
  advanceAerialPegs(c, s, [{ active: true, region: 4 }], 1.05);
  assert.equal(s.beds[0].frame, 1);
  assert.equal(s.loaded, true);
});

test("source contact distinguishes eruption, side reflection, airborne pass and unselected cells", () => {
  const peg = { x: 69, z: 55, height: 16300 };
  const inside = { x: 69 * 8 + 4, z: 55 * 8 + 4, height: 16300 };
  const outside = { ...inside, x: 68 * 8 };
  assert.equal(sourcePegContact(true, peg, inside, inside), "launch");
  assert.equal(sourcePegContact(true, peg, outside, inside), "reflect");
  assert.equal(
    sourcePegContact(true, peg, inside, { ...inside, height: 16312 }),
    "restore-position",
  );
  assert.equal(sourcePegContact(true, peg, inside, outside), null);
  assert.equal(sourcePegContact(false, peg, inside, inside), null);
});

test("peg validation requires all 36 ordered native solids and rejects conflicting schedules", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => delete c.pegSequence,
    (c) => delete c.navigation,
    (c) => delete c.nativeCamera,
    (c) => (c.pegSequence.parts[1] = "peg-0"),
    (c) => (c.pegSequence.rate = 0),
    (c) => (c.pegSequence.rate = 30),
    (c) => (c.parts[1].motion.amplitude = 2),
    (c) => (c.parts[1].presence = { period: 2, on: 1 }),
    (c) => (c.parts[1].profile = "flipper"),
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});

test("physical peg mesh lifts a marble, does not move a distant marble, and restores paired motion", () => {
  const c = fixture(),
    probe = createPegSequence(237);
  stepPegSequence(probe, true);
  const peg = c.parts[probe.beds[0].drawn[0] + 1];
  c.starts[0] = { x: peg.x, y: RADIUS + 0.025, z: peg.z };
  const sim = new Simulation(c, { seed: 237, players: 2, untimed: true });
  try {
    for (let i = 0; i < 10; i++) sim.step();
    const snapshot = sim.snapshot();
    const run = () => {
      let peak = 0;
      for (let i = 0; i < 200; i++) {
        sim.step();
        peak = Math.max(peak, sim.body(sim.players[0]).translation().y);
        for (const m of sim.movers) {
          const b = sim.world.getRigidBody(m.handle);
          assert.equal(b.collider(0).isSensor(), false);
          assert.ok(Math.abs(b.translation().y - m.current.position.y) < 1e-5);
        }
      }
      return {
        peak,
        state: structuredClone(sim.aerialPegs),
        players: sim.players.map((p) => ({ ...sim.body(p).translation() })),
      };
    };
    const result = run();
    assert.ok(
      result.peak > 2,
      `Peg must physically lift the marble: ${result.peak}`,
    );
    assert.ok(Math.abs(result.players[1].x - c.starts[1].x) < 0.02);
    assert.ok(Math.abs(result.players[1].z - c.starts[1].z) < 0.02);
    sim.restore(snapshot);
    assert.deepEqual(run(), result);
  } finally {
    sim.dispose();
  }
});

test("sprite diagonal occupies a straight line of real solids and rises by recovered pixel heights", () => {
  const c = fixture(),
    s = createPegSequence();
  const samples = [0, 3, 0, 3, 1, 3, 0, 0, 0, 0];
  stepPegSequence(s, true, () => samples.shift());
  assert.deepEqual(s.beds[0].drawn, [2, 4, 6]);
  assert.deepEqual(s.beds[1].drawn, [17, 19, 21]);
  assert.equal(
    s.levels[0],
    0,
    "Original stray collision cell must remain flush",
  );
  assert.equal(
    s.levels[6],
    1,
    "Drawn end of diagonal needs its actual collider",
  );
  const p = { ...c.parts[1], motion: { ...c.parts[1].motion, amplitude: 19 } };
  for (const [level, height] of [
    [0, 0],
    [1, 5],
    [2, 12],
    [3, 17],
    [4, 19],
    [1.5, 8.5],
    [2.5, 14.5],
  ])
    assert.ok(Math.abs(pegPose(p, level).position.y - p.y - height) < 1e-10);
});

test("native peg eruption comes from its rising surface and leaves the original stray collision cell safe", () => {
  const c = fixture();
  c.nativeDynamics = { rate: 20 };
  for (const p of c.parts.slice(1))
    p.h = p.motion.amplitude = 19 * c.nativeCamera.heightScale;
  // Seed 237 starts the top bed's fourth pattern. Cell 6 is drawn but omitted
  // by the original mask; cell 0 is marked by that mask but not actually drawn.
  c.starts = [6, 0].map((i) => ({
    x: c.parts[i + 1].x,
    y: RADIUS + 0.025,
    z: c.parts[i + 1].z,
  }));
  const sim = new Simulation(c, { seed: 237, players: 2, untimed: true });
  try {
    let maximumUp = 0,
      peak = 0;
    for (let i = 0; i < 80; i++) {
      sim.step();
      maximumUp = Math.max(maximumUp, sim.body(sim.players[0]).linvel().y);
      peak = Math.max(peak, sim.body(sim.players[0]).translation().y);
      assert.equal(
        sim.events.some((e) => e.type === "spring"),
        false,
      );
    }
    const wanted = 7 * c.nativeCamera.heightScale * c.pegSequence.rate;
    assert.ok(
      Math.abs(maximumUp - wanted) < 1,
      `physical speed ${maximumUp}, sprite speed ${wanted}`,
    );
    assert.ok(peak > 3);
    const safe = sim.body(sim.players[1]).translation();
    assert.ok(Math.abs(safe.y - RADIUS) < 0.03);
    assert.ok(
      Math.hypot(safe.x - c.starts[1].x, safe.z - c.starts[1].z) < 0.03,
    );
    assert.equal(sim.players[0].deaths + sim.players[1].deaths, 0);
  } finally {
    sim.dispose();
  }
});
