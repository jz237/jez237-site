import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { initPhysics, Simulation, DemoController } from "../src/physics.mjs";
import { nativeCourse } from "../src/native-campaign.mjs";
import { slinkyCoordinates } from "../src/native-slinky-physics.mjs";
import { nativePipeIntent } from "../src/native-pipes.mjs";
import { physicalNativePipes } from "../src/native-pipe-physics.mjs";
import { validateCourse } from "../src/course.mjs";
import { traversalPaths } from "../src/traversal-bonuses.mjs";
import { tubeGeometry, tubeRadiusAt } from "../src/surface-geometry.mjs";
import { chooseTransfer } from "../src/powered-transfer.mjs";
await initPhysics();

test("original upper pipe height bands, occupied exits and creature treatment", () => {
  const p = {
    x: 504,
    z: 612,
    height: 16264,
    vy: 0.5,
    contactType: 7,
    motionMode: 6,
  };
  assert.equal(nativePipeIntent(18, p).phase, "housing");
  assert.equal(nativePipeIntent(18, { ...p, height: 16248 }).phase, "housing");
  assert.equal(nativePipeIntent(18, { ...p, height: 16247.9 }).phase, "hold");
  assert.equal(nativePipeIntent(18, { ...p, height: 16224 }).phase, "hold");
  const release = nativePipeIntent(18, { ...p, height: 16223.9 });
  assert.deepEqual(release.destination, { x: 524, z: 612 });
  assert.deepEqual(release.velocity, { x: 4, z: 0, y: 0.5 });
  assert.equal(release.motionMode, 0);
  assert.equal(release.sound, 28);
  assert.equal(nativePipeIntent(18, { ...p, height: 16192.9 }), null);
  assert.equal(nativePipeIntent(18, p, { loaded: false }), null);
  const occupied = nativePipeIntent(
    18,
    { ...p, height: 16212 },
    { actors: [{ x: 524, z: 612, active: true }] },
  );
  assert.deepEqual(occupied.destination, { x: 516, z: 612 });
  assert.equal(
    nativePipeIntent(18, { ...p, height: 16212 }, { isPlayer: false }).phase,
    "destroy",
  );
  const outsideContact = nativePipeIntent(18, { ...p, z: 592, height: 16212 });
  assert.equal(
    outsideContact.contact.type,
    7,
    "release preserves previous contact type outside the inner contact rows",
  );
});

test("both lower entries share the original outlet and preserve movement mode", () => {
  for (const [subtype, x] of [
    [19, 644],
    [20, 692],
  ]) {
    const p = { x, z: 690, height: 16176, vy: -0.25, motionMode: 6 };
    const clear = nativePipeIntent(subtype, p);
    assert.equal(clear.phase, "release");
    assert.deepEqual(clear.destination, { x: 668, z: 740 });
    assert.deepEqual(clear.velocity, { x: 0, z: 4, y: -0.25 });
    assert.equal(clear.motionMode, 6);
    assert.deepEqual(
      nativePipeIntent(subtype, p, {
        actors: [{ x: 668, z: 740, active: true }],
      }).destination,
      { x: 668, z: 732 },
    );
    assert.equal(
      nativePipeIntent(subtype, { ...p, z: 687.9 }).phase,
      "housing",
    );
    assert.equal(nativePipeIntent(subtype, { ...p, z: 712 }), null);
  }
  const orange = nativePipeIntent(32, { x: 620, z: 652, height: 16287, vy: 1 });
  assert.deepEqual(orange.destination, { x: 620, z: 596 });
  assert.deepEqual(orange.velocity, { x: 0, z: -4, y: 1 });
});

const entries = [
  {
    course: "intermediate",
    name: "orange",
    x: 600,
    z: 644,
    h: 16320,
    band: 32,
    aim: [620, 644, 16320],
    id: "native-orange-pipe",
    score: 2000,
  },
  {
    name: "upper",
    x: 500,
    z: 612,
    h: 16266,
    band: 28,
    aim: [510, 612, 16264],
    id: "native-upper-pipe",
    score: 4000,
  },
  {
    name: "left",
    x: 644,
    z: 672,
    h: 16176,
    band: 40,
    aim: [644, 696, 16168],
    id: "native-lower-pipes",
    score: 2000,
    branch: 0,
  },
  {
    name: "right",
    x: 692,
    z: 672,
    h: 16176,
    band: 40,
    aim: [692, 696, 16168],
    id: "native-lower-pipes",
    score: 2000,
    branch: 1,
  },
];
function encounter(entry) {
  const c = nativeCourse(entry.course ?? "beginner"),
    space = slinkyCoordinates(c);
  const start = space.world(entry.x, entry.z, entry.h);
  start.y += 0.55;
  c.starts = [start];
  c.route = [{ ...space.world(...entry.aim), speed: 3, radius: 0.6 }];
  const sim = new Simulation(c, { untimed: true, seed: 237 });
  // Initial encounter fixture only; no active body position changes.
  sim.nativeCamera.scroll += entry.band * 16;
  sim.nativeCamera.offset = entry.band * 16;
  return { sim, space };
}
for (const entry of entries)
  test(`native ${entry.course ?? "beginner"} ${entry.name} passage carries normal input through shared geometry and replays`, () => {
    const { sim } = encounter(entry),
      driver = new DemoController(),
      p = sim.players[0];
    let snapshot = null,
      driverState = null,
      endTick = null,
      expected = null,
      maxStep = 0;
    try {
      while (sim.tick < 900) {
        const before = { ...sim.body(p).translation() },
          input = driver.input(sim);
        assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
        assert.deepEqual({ ...sim.body(p).translation() }, before);
        const events = sim.step([input]),
          pos = sim.body(p).translation();
        maxStep = Math.max(
          maxStep,
          Math.hypot(pos.x - before.x, pos.y - before.y, pos.z - before.z),
        );
        if (p.transferRoute && !snapshot) {
          snapshot = sim.snapshot();
          driverState = structuredClone(driver);
        }
        const bonus = events.find((e) => e.type === "traversal-bonus");
        if (bonus) {
          assert.deepEqual([bonus.part, bonus.score], [entry.id, entry.score]);
          endTick = sim.tick;
          expected = {
            position: { ...pos },
            score: p.score,
            claims: [...p.traversalClaims],
          };
          break;
        }
      }
      assert.ok(snapshot, "entered the native capture band");
      assert.ok(
        endTick,
        "crossed the actual outlet and earned the passage bonus",
      );
      assert.equal(p.deaths, 0);
      assert.ok(
        maxStep < 0.15,
        "continuous physical travel, no source destination jump",
      );
      if (entry.branch !== undefined)
        assert.equal(p.transferRoute.branch, entry.branch);
      sim.restore(snapshot);
      Object.assign(driver, driverState);
      while (sim.tick < endTick) sim.step([driver.input(sim)]);
      const restored = sim.players[0];
      assert.deepEqual(
        {
          position: { ...sim.body(restored).translation() },
          score: restored.score,
          claims: [...restored.traversalClaims],
        },
        expected,
      );
    } finally {
      sim.dispose();
    }
  });

test("lower pipe is one closed merging shell with open physical mouths and reversed passage tracking", () => {
  const c = nativeCourse("beginner"),
    p = c.parts.find((p) => p.nativePipe === "beginner-lower");
  const g = tubeGeometry(p),
    edges = new Map();
  for (let i = 0; i < g.indices.length; i += 3)
    for (let j = 0; j < 3; j++) {
      const edge = [g.indices[i + j], g.indices[i + ((j + 1) % 3)]]
        .sort((a, b) => a - b)
        .join(":");
      edges.set(edge, (edges.get(edge) ?? 0) + 1);
    }
  assert.ok([...edges.values()].every((n) => n === 2));
  const paths = traversalPaths(c).filter((p) => p.merge);
  assert.equal(paths.length, 2);
  assert.deepEqual(paths[0].points.at(-1), paths[1].points.at(-1));
  assert.notDeepEqual(paths[0].points[0], paths[1].points[0]);
  for (const path of paths) {
    assert.equal(tubeRadiusAt(path, 0, path.length), 1.1);
    assert.equal(tubeRadiusAt(path, path.length, path.length), 1.08);
    const generic = { ...path, nativePipe: undefined };
    assert.equal(
      chooseTransfer([generic], path.points[0], 0.55, 99).branch,
      path.branch,
    );
  }
  const sim = new Simulation(c, { untimed: true });
  try {
    sim.step();
    for (const path of paths)
      for (const sign of [-1, 1]) {
        const pos = { ...path.points[0] };
        pos.z += 0.001;
        const hit = sim.world.castRay(
          new RAPIER.Ray(pos, { x: sign, y: 0, z: 0 }),
          2,
          true,
        );
        assert.ok(
          hit && Math.abs(hit.timeOfImpact - 1.65) < 0.03,
          "rounded mouth walls are the actual colliders",
        );
      }
  } finally {
    sim.dispose();
  }
});

test("native pipe forces require the loaded encounter and the actual bore", () => {
  const { sim, space } = encounter(entries.find((e) => e.name === "upper"));
  try {
    const p = sim.players[0];
    sim.nativeCamera.scroll = sim.course.nativeCamera.initialScroll;
    assert.equal(physicalNativePipes(sim, p, 0.55, null), null);
    const outside = space.world(490, 590, 16212);
    outside.y += 0.55;
    const c = nativeCourse("beginner");
    c.starts = [outside];
    const other = new Simulation(c, { untimed: true });
    try {
      other.nativeCamera.scroll += 28 * 16;
      other.nativeCamera.offset = 28 * 16;
      assert.equal(
        physicalNativePipes(other, other.players[0], 0.55, null),
        null,
      );
    } finally {
      other.dispose();
    }
  } finally {
    sim.dispose();
  }
});

test("native pipe imports reject unsupported flow, moving tubes and malformed merges", () => {
  for (const mutate of [
    (p) => (p.flowSpeed = 12),
    (p) => (p.fork.merge = "yes"),
    (p) => (p.fork.merge = false),
    (p) => (p.nativePipe = "unknown"),
    (p) => (p.motion = { axis: "y", amplitude: 1, period: 2 }),
  ]) {
    const c = nativeCourse("beginner");
    mutate(c.parts.find((p) => p.nativePipe === "beginner-lower"));
    assert.throws(() => validateCourse(c));
  }
});

test("two marbles meet in the lower Y within contact tolerance and both earn the exit award", () => {
  const c = nativeCourse("beginner"),
    space = slinkyCoordinates(c);
  c.starts = [644, 692].map((x) => {
    const p = space.world(x, 672, 16176);
    p.y += 0.55;
    return p;
  });
  c.playerRoutes = [644, 692].map((x) => [
    { ...space.world(x, 696, 16168), speed: 3, radius: 0.6 },
  ]);
  c.route = [];
  const sim = new Simulation(c, { players: 2, untimed: true, seed: 237 });
  sim.nativeCamera.scroll += 640;
  sim.nativeCamera.offset = 640;
  const drivers = sim.players.map(() => new DemoController()),
    awards = [];
  let separation = Infinity;
  try {
    while (sim.tick < 1200 && awards.length < 2) {
      sim.step(drivers.map((driver, i) => driver.input(sim, i)));
      awards.push(...sim.events.filter((e) => e.type === "traversal-bonus"));
      const a = sim.body(sim.players[0]).translation(),
        b = sim.body(sim.players[1]).translation();
      separation = Math.min(
        separation,
        Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
      );
    }
    assert.deepEqual(awards.map((e) => e.player).sort(), [0, 1]);
    assert.ok(awards.every((e) => e.score === 2000));
    assert.ok(sim.players.every((p) => p.deaths === 0));
    assert.ok(
      separation > 1.1 - 0.0055,
      `contact penetration below 1% of radius: ${separation}`,
    );
  } finally {
    sim.dispose();
  }
});

test("earlier contact prediction in native pipe courses preserves settled floor contact", () => {
  const c = nativeCourse("beginner"),
    space = slinkyCoordinates(c),
    floor = space.world(480, 612, 16264);
  c.starts = [{ ...floor, y: floor.y + 0.8 }];
  const sim = new Simulation(c, { untimed: true });
  try {
    for (let i = 0; i < 600; i++) sim.step();
    const gap = sim.body(sim.players[0]).translation().y - floor.y - 0.55;
    assert.ok(Math.abs(gap) < 0.0055, `settled gap ${gap}`);
    assert.equal(sim.players[0].deaths, 0);
  } finally {
    sim.dispose();
  }
});

test("two marbles enter the orange shaft together and exit within contact tolerance", () => {
  const c = nativeCourse("intermediate"),
    space = slinkyCoordinates(c);
  c.starts = [639, 649].map((z) => ({
    ...space.world(600, z, 16320),
    y: space.world(600, z, 16320).y + 0.55,
  }));
  assert.ok(
    Math.abs(c.starts[1].z - c.starts[0].z) > 1.1,
    "initial marbles do not overlap",
  );
  c.route = [{ ...space.world(620, 644, 16320), speed: 3, radius: 0.6 }];
  const sim = new Simulation(c, { players: 2, untimed: true, seed: 237 }),
    drivers = sim.players.map(() => new DemoController()),
    awards = [];
  sim.nativeCamera.scroll += 512;
  sim.nativeCamera.offset = 512;
  let separation = Infinity;
  try {
    while (sim.tick < 1200 && awards.length < 2) {
      sim.step(drivers.map((d, i) => d.input(sim, i)));
      awards.push(...sim.events.filter((e) => e.type === "traversal-bonus"));
      const a = sim.body(sim.players[0]).translation(),
        b = sim.body(sim.players[1]).translation();
      separation = Math.min(
        separation,
        Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
      );
    }
    assert.deepEqual(awards.map((e) => e.player).sort(), [0, 1]);
    assert.ok(
      awards.every((e) => e.part === "native-orange-pipe" && e.score === 2000),
    );
    assert.ok(sim.players.every((p) => p.deaths === 0));
    assert.ok(
      separation > 1.1 - 0.0055,
      `contact penetration below 1% of radius: ${separation}`,
    );
  } finally {
    sim.dispose();
  }
});
