import test from "node:test";
import assert from "node:assert/strict";
import {
  terrainTileAt,
  terrainRegionAfter,
} from "../src/terrain-navigation.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { initPhysics, Simulation, RADIUS } from "../src/physics.mjs";
await initPhysics();

function fixture() {
  const cells = [];
  for (let z = 0; z < 8; z++)
    for (let x = 0; x < 8; x++) cells.push([x, z, 0, 0, 0, 0]);
  return {
    ...proofCourse(),
    id: "native-navigation-proof",
    parts: [
      {
        id: "board",
        kind: "terrain",
        x: 0,
        y: 0,
        z: 0,
        w: 16,
        d: 16,
        h: 2,
        cellSize: 2,
        cells,
      },
    ],
    navigation: {
      type: "terrain-gates",
      partId: "board",
      initialRegions: [0, 0],
      gates: [
        { axis: "z", constant: 2, start: 0, end: 7, low: 0, high: 1 },
        { axis: "z", constant: 4, start: 0, end: 7, low: 1, high: 255 },
      ],
    },
    starts: [
      { x: -2, y: RADIUS, z: -3 },
      { x: 2, y: RADIUS, z: -3 },
    ],
    goal: { x: 0, y: 0, z: -3, width: 8, depth: 2 }, // Deliberately at the start: presentation only.
    checkpoints: [],
    route: [],
    zones: [],
    rules: {},
  };
}

test("terrain navigation uses local tiles on translated, rotated boards", () => {
  const p = { ...fixture().parts[0], x: 11, z: -9, angle: 0.7 };
  const x = -3.4,
    z = 1.2;
  assert.deepEqual(
    terrainTileAt(p, {
      x: p.x + x * Math.cos(p.angle) - z * Math.sin(p.angle),
      z: p.z + x * Math.sin(p.angle) + z * Math.cos(p.angle),
    }),
    { x: 2, z: 4 },
  );
  assert.deepEqual(
    terrainTileAt({ ...p, angle: 0 }, { x: p.x - 8.01, z: p.z - 8.01 }),
    { x: -1, z: -1 },
  );
});

test("ordered gates require departure, retain inclusive ends, and reject swept shortcuts", () => {
  const gates = fixture().navigation.gates;
  assert.equal(terrainRegionAfter(gates, { x: 7, z: 2 }, { x: 7, z: 3 }, 0), 1);
  assert.equal(terrainRegionAfter(gates, { x: 8, z: 2 }, { x: 8, z: 3 }, 0), 0);
  assert.equal(terrainRegionAfter(gates, { x: 2, z: 3 }, { x: 2, z: 4 }, 1), 1);
  assert.equal(terrainRegionAfter(gates, { x: 2, z: 3 }, { x: 2, z: 5 }, 1), 1);
  assert.equal(
    terrainRegionAfter(gates, { x: 2, z: 4 }, { x: 2, z: 5 }, 1),
    255,
  );
  assert.equal(terrainRegionAfter(gates, { x: 2, z: 4 }, { x: 2, z: 3 }, 1), 1);
  assert.equal(
    terrainRegionAfter(
      [{ ...gates[1], high: 1 }, gates[1]],
      { x: 2, z: 4 },
      { x: 2, z: 5 },
      1,
    ),
    1,
  );
});

test("both marbles finish through native boundaries, independently of the display goal", () => {
  const s = new Simulation(fixture(), { players: 2, untimed: true });
  try {
    for (let n = 0; n < 60; n++) s.step();
    assert.ok(s.players.every((p) => p.status === "racing"));
    const input = [
      { x: 0, z: 1, turbo: true },
      { x: 0, z: 1, turbo: true },
    ];
    const regions = s.players.map(() => new Set());
    let finishes = 0;
    for (
      let n = 0;
      n < 600 && !s.players.every((p) => p.status === "finished");
      n++
    ) {
      finishes += s.step(input).filter((e) => e.type === "finish").length;
      s.players.forEach((p, i) => regions[i].add(p.navigation.region));
    }
    assert.equal(finishes, 2);
    s.players.forEach((p, i) => {
      assert.equal(p.status, "finished");
      assert.equal(p.deaths, 0);
      assert.ok(regions[i].has(1));
      assert.ok(regions[i].has(255));
      assert.ok(p.current.position.z >= 2);
    });
  } finally {
    s.dispose();
  }
});

test("replay snapshot preserves the gate history and exact finish tick", () => {
  const s = new Simulation(fixture(), { untimed: true });
  try {
    const input = [{ x: 0, z: 1, turbo: true }];
    while (s.tick < 500 && s.players[0].navigation.region !== 1) s.step(input);
    assert.equal(s.players[0].navigation.region, 1);
    const snapshot = s.snapshot();
    const finish = () => {
      while (s.tick < 600 && s.players[0].status !== "finished") s.step(input);
      return structuredClone(s.players[0]);
    };
    const first = finish();
    assert.equal(first.status, "finished");
    s.restore(snapshot);
    assert.deepEqual(finish(), first);
  } finally {
    s.dispose();
  }
});

test("respawn resets the previous tile without treating relocation as a finish", () => {
  const s = new Simulation(fixture(), { untimed: true });
  try {
    const p = s.players[0];
    p.navigation = { region: 1, tile: { x: 3, z: 4 } };
    s.fall(p);
    s.respawn(p);
    s.step();
    assert.equal(p.status, "racing");
    assert.equal(p.navigation.region, 0);
    s.course.rules.respawn = "last-safe";
    p.safePosition = { x: -2, y: RADIUS, z: 3 };
    p.safeNavigation = { region: 1, tile: { x: 3, z: 4 } };
    s.fall(p);
    s.respawn(p);
    s.step();
    assert.equal(p.status, "racing");
    assert.equal(p.navigation.region, 1);
    assert.equal(p.navigation.tile.z, 5);
  } finally {
    s.dispose();
  }
});

test("imports validate terrain navigation references, gate bounds and region data", () => {
  const c = fixture();
  assert.deepEqual(validateCourse(JSON.parse(JSON.stringify(c))), c);
  for (const mutate of [
    (n) => (n.partId = "missing"),
    (n) => (n.type = "unknown"),
    (n) => (n.initialRegions = [255, 0]),
    (n) => (n.gates[0].axis = "y"),
    (n) => (n.gates[0].end = -1),
    (n) => (n.gates[0].constant = Infinity),
    (n) => (n.gates[0].high = 256),
  ]) {
    const invalid = structuredClone(c);
    mutate(invalid.navigation);
    assert.throws(() => validateCourse(invalid), /terrain/i);
  }
});
