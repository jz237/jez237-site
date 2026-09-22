import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { proofCourse, validateCourse, compileCourse } from "../src/course.mjs";
import {
  Simulation,
  initPhysics,
  RADIUS,
  FixedClock,
} from "../src/physics.mjs";
import {
  createTerrainSequence,
  advanceTerrainSequence,
} from "../src/terrain-sequence.mjs";
import { surfaceGeometry } from "../src/render-surface.mjs";
await initPhysics();

function fixture() {
  const cells = [];
  for (let z = 0; z < 6; z++)
    for (let x = 0; x < 6; x++) cells.push([x, z, 0, 0, 0, 0]);
  const frames = [0, -4, 1, 0].map((h) =>
    cells
      .filter((c) => c[0] >= 2 && c[0] <= 3 && c[1] >= 2 && c[1] <= 3)
      .map(([x, z]) => [x, z, h, h, h, h]),
  );
  return {
    ...proofCourse(),
    id: "terrain-sequence-proof",
    parts: [
      {
        id: "room",
        kind: "terrain",
        x: 0,
        y: 0,
        z: 0,
        w: 12,
        d: 12,
        h: 6,
        cellSize: 2,
        cells,
        animation: {
          type: "terrain-sequence",
          secondsPerFrame: 0.5,
          activationRegions: [9, 12],
          initialRegions: [9, 9],
          gates: [],
          frames,
        },
      },
    ],
    starts: [
      { x: 0, y: RADIUS, z: 0 },
      { x: -4, y: RADIUS, z: -4 },
    ],
    goal: { x: 0, y: 0, z: 100 },
    route: [],
    checkpoints: [],
    zones: [],
  };
}

test("terrain state meshes preserve top faces, cliffs and solid undersides", () => {
  const c = compileCourse(fixture());
  assert.equal(c.statics.length, 0);
  assert.equal(c.moving.length, 1);
  assert.equal(c.moving[0].frames.length, 4);
  for (const g of c.moving[0].frames) {
    const geometry = surfaceGeometry(g),
      edges = new Map();
    assert.equal(geometry.index.count, g.indices.length);
    assert.equal(
      geometry.groups.reduce((n, v) => n + v.count, 0),
      g.indices.length,
    );
    for (let i = 0; i < g.indices.length; i += 3)
      for (let j = 0; j < 3; j++) {
        const a = g.indices[i + j],
          b = g.indices[i + ((j + 1) % 3)],
          key = [a, b].sort((a, b) => a - b).join();
        const e = edges.get(key) ?? [0, 0];
        e[0]++;
        e[1] += a < b ? 1 : -1;
        edges.set(key, e);
      }
    assert.ok([...edges.values()].every(([n, w]) => n === 2 && w === 0));
    assert.equal(Math.min(...g.vertices.filter((_, i) => i % 3 === 1)), -6);
    geometry.dispose();
  }
});

test("sequence activation reads both players, retains stopped state and restarts at frame zero", () => {
  const p = fixture().parts[0],
    s = createTerrainSequence(p, 2);
  const player = (region, active = true) => ({
    position: { x: 0, z: 0 },
    active,
    region,
    navigationPartId: p.id,
  });
  advanceTerrainSequence(p, s, [player(9), player(0)], 10);
  assert.equal(s.frame, 0);
  advanceTerrainSequence(p, s, [player(9), player(12)], 10.5);
  assert.equal(s.frame, 1);
  assert.deepEqual(s.regions, [9, 12]);
  advanceTerrainSequence(p, s, [player(0), player(12)], 11);
  assert.equal(s.frame, 2);
  advanceTerrainSequence(p, s, [player(0), player(12, false)], 12);
  assert.equal(s.active, false);
  assert.equal(s.frame, 2);
  advanceTerrainSequence(p, s, [player(0), player(12)], 20);
  assert.equal(s.frame, 0);
  advanceTerrainSequence(p, s, [player(0), player(12)], 22);
  assert.equal(s.frame, 0);
});

test("a changing terrain collider removes support, exposes its lower floor and restores exact physics", () => {
  const s = new Simulation(fixture(), { untimed: true });
  try {
    while (s.tick < 60) s.step();
    assert.equal(s.movers[0].current.frame, 0);
    const snap = s.snapshot();
    const run = () => {
      while (s.tick < 105) s.step();
      assert.equal(s.movers[0].current.frame, 1);
      const hit = s.world.castRay(
        new RAPIER.Ray({ x: 0.5, y: 5, z: 0.5 }, { x: 0, y: -1, z: 0 }),
        20,
        false,
        RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
      );
      assert.ok(Math.abs(hit.timeOfImpact - 9) < 1e-5);
      assert.ok(s.players[0].current.position.y < RADIUS - 0.4);
      return {
        player: structuredClone(s.players[0]),
        controller: structuredClone(s.terrainAnimations),
      };
    };
    const first = run();
    s.restore(snap);
    assert.deepEqual(run(), first);
  } finally {
    s.dispose();
  }
});

test("rendered and colliding cells share all four discrete states", () => {
  const c = fixture();
  c.starts = [{ x: -4, y: RADIUS, z: -4 }];
  const s = new Simulation(c, { untimed: true });
  try {
    const heights = [0, -4, 1, 0];
    for (let frame = 0; frame < 4; frame++) {
      while (s.tick < frame * 60 + 1) s.step();
      const g = s.compiled.moving[0].frames[frame];
      assert.equal(s.movers[0].current.frame, frame);
      for (const [x, z, h] of [
        [0.5, 0.5, heights[frame]],
        [-4, -4, 0],
      ]) {
        const hit = s.world.castRay(
          new RAPIER.Ray({ x, y: 5, z }, { x: 0, y: -1, z: 0 }),
          20,
          false,
          RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
        );
        assert.ok(Math.abs(hit.timeOfImpact - (5 - h)) < 1e-5);
        assert.ok(g.vertices.some((v, i) => i % 3 === 1 && v === h));
      }
    }
  } finally {
    s.dispose();
  }
});

test("sequence outcomes do not depend on rendering at 30, 60 or 120 fps", () => {
  const outcomes = [];
  for (const fps of [30, 60, 120]) {
    const s = new Simulation(fixture(), { untimed: true });
    try {
      const clock = new FixedClock(() => s.step());
      for (let i = 0; i < fps * 2; i++) clock.advance(1 / fps);
      outcomes.push({
        player: structuredClone(s.players[0]),
        controller: s.terrainAnimations.room,
      });
    } finally {
      s.dispose();
    }
  }
  assert.deepEqual(outcomes[1], outcomes[0]);
  assert.deepEqual(outcomes[2], outcomes[0]);
});

test("terrain sequence imports reject malformed, out-of-grid and over-budget states", () => {
  const c = fixture();
  assert.deepEqual(validateCourse(JSON.parse(JSON.stringify(c))), c);
  for (const mutate of [
    (a) => (a.secondsPerFrame = 0),
    (a) => (a.frames = []),
    (a) => (a.frames[0][0][2] = 1),
    (a) => (a.frames[1][0][0] = 99),
    (a) => a.frames[1].push(a.frames[1][0]),
    (a) => (a.frames[1][0][2] = NaN),
    (a) => (a.activationRegions = [12, 9]),
    (a) => (a.frames = Array(9).fill(a.frames[0])),
  ]) {
    const invalid = structuredClone(c);
    mutate(invalid.parts[0].animation);
    assert.throws(() => validateCourse(invalid), /terrain/i);
  }
});

test("terrain sequence frames count toward the authoring budget", () => {
  const c = fixture(),
    p = c.parts[0];
  p.w = 100;
  p.d = 40;
  p.cells = Array.from({ length: 1000 }, (_, i) => [
    i % 50,
    Math.floor(i / 50),
    0,
    0,
    0,
    0,
  ]);
  p.animation.frames = Array.from({ length: 8 }, () =>
    p.cells.map((c) => [...c]),
  );
  assert.throws(() => validateCourse(c), /150,000-vertex/);
});

function timedFixture(conditional = false) {
  const c = fixture(),
    a = c.parts[0].animation;
  delete a.secondsPerFrame;
  a.timeline = conditional
    ? {
        rate: 20,
        durationTicks: 30,
        loop: false,
        condition: { tick: 10, bounds: [2, 2, 4, 4] },
        events: [
          [1, 0],
          [11, 1],
          [13, 2],
          [21, 0],
        ],
      }
    : {
        rate: 20,
        durationTicks: 27,
        loop: true,
        events: [
          [1, 0],
          [5, 1],
          [7, 2],
          [9, 3],
          [15, 2],
          [17, 1],
          [19, 0],
        ],
      };
  return c;
}
const timedPlayer = (x = 0, z = 0, active = true) => ({
  position: { x, z },
  active,
  region: 9,
  navigationPartId: "room",
});

test("terrain timelines retain writes through unequal waits and repeat on the exact update", () => {
  const p = timedFixture().parts[0],
    s = createTerrainSequence(p, 1);
  const cycle = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0,
  ];
  for (let tick = 1; tick <= 100; tick++) {
    advanceTerrainSequence(p, s, [timedPlayer()], 3 + (tick - 1) / 20);
    assert.equal(s.frame, cycle[(tick - 1) % cycle.length], `tick ${tick}`);
  }
});

test("one-shot terrain tests either active player's footprint only at the condition update", () => {
  const p = timedFixture(true).parts[0];
  for (const [position, active, expected] of [
    [[-2, -2], true, true],
    [[1.99, 1.99], true, true],
    [[2, 0], true, false],
    [[0, 2], true, false],
    [[-2.01, 0], true, false],
    [[0, -2.01], true, false],
    [[0, 0], false, false],
  ]) {
    const s = createTerrainSequence(p, 2);
    advanceTerrainSequence(p, s, [timedPlayer(-4, -4), timedPlayer()], 0);
    advanceTerrainSequence(
      p,
      s,
      [timedPlayer(-4, -4), timedPlayer(...position, active)],
      0.45,
    );
    assert.equal(s.conditionPassed, expected);
    // Subsequent arrivals/departures must not change the latched decision.
    advanceTerrainSequence(p, s, [timedPlayer(), timedPlayer(-4, -4)], 0.5);
    assert.equal(s.frame, expected ? 1 : 0);
    advanceTerrainSequence(p, s, [timedPlayer()], 10);
    assert.equal(s.frame, 0);
    assert.equal(s.nativeTick, 30);
  }
});

test("conditional terrain physics and decisions restore across a snapshot and rendering rates", () => {
  const outcomes = [];
  for (const fps of [30, 60, 120]) {
    const s = new Simulation(timedFixture(true), { untimed: true });
    try {
      while (s.tick < 40) s.step();
      const snap = s.snapshot();
      const run = () => {
        const clock = new FixedClock(() => s.step());
        for (let i = 0; i < fps; i++) clock.advance(1 / fps);
        return {
          player: structuredClone(s.players[0]),
          controller: structuredClone(s.terrainAnimations),
        };
      };
      const result = run();
      assert.equal(result.controller.room.conditionPassed, true);
      s.restore(snap);
      assert.deepEqual(run(), result);
      outcomes.push(result);
    } finally {
      s.dispose();
    }
  }
  assert.deepEqual(outcomes[1], outcomes[0]);
  assert.deepEqual(outcomes[2], outcomes[0]);
});

test("terrain timeline imports reject ambiguous ticks, invalid frames and unbounded scripts", () => {
  const c = timedFixture(true);
  assert.deepEqual(validateCourse(structuredClone(c)), c);
  for (const mutate of [
    (a) => (a.timeline = null),
    (a) => (a.timeline.rate = 0),
    (a) => (a.timeline.durationTicks = 100001),
    (a) => (a.timeline.loop = "yes"),
    (a) => (a.timeline.events = []),
    (a) => (a.timeline.events[0] = [2, 0]),
    (a) => (a.timeline.events[1] = [1, 1]),
    (a) => (a.timeline.events[1] = [11, 9]),
    (a) => (a.timeline.events[1] = [11.5, 1]),
    (a) => (a.timeline.events[1] = [31, 1]),
    (a) => (a.timeline.events[1] = [9, 1]),
    (a) => (a.timeline.loop = true),
    (a) => (a.timeline.condition.tick = NaN),
    (a) => (a.timeline.condition.bounds = [4, 2, 2, 4]),
  ]) {
    const bad = structuredClone(c);
    mutate(bad.parts[0].animation);
    assert.throws(() => validateCourse(bad), /terrain/i);
  }
});
