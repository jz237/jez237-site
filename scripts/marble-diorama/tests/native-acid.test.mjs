import test from "node:test";
import assert from "node:assert/strict";
import {
  createAcidSequence,
  acidCameraTransition,
  stepAcidSequence,
  holdAcidOnContact,
  acidFrameBounds,
  ACID_FRAMES,
} from "../src/native-acid.mjs";
import {
  nativeAcidShape,
  fitAcidToTerrain,
} from "../src/native-acid-physics.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { acidMesh, updateAcidMesh } from "../src/acid-view.mjs";
import { acidCapturePose } from "../src/acid-capture.mjs";
await initPhysics();

const config = () => ({
  routes: {
    a: [
      [6, 6, 1],
      [8, 6, 2],
      [8, 8, 3],
      [6, 8, 0],
    ],
  },
  entries: [
    { activationBand: [0, 31], region: 5, direct: true, choices: [["a"]] },
  ],
});
const advance = (c, s, count, players = []) => {
  for (let i = 0; i < count; i++) stepAcidSequence(c, s, players);
};

test("acid uses frame-driven forward and backward steps with alternating route axes", () => {
  const c = config(),
    s = createAcidSequence();
  acidCameraTransition(c, s, [-2, 0]);
  const a = s.slots[0];
  assert.deepEqual(
    [a.x, a.z, a.node, a.animation, a.divider],
    [48, 48, 1, "x", 2],
  );
  advance(c, s, 13);
  assert.deepEqual([a.x, a.z, a.frame], [48, 48, 6]);
  advance(c, s, 1);
  assert.deepEqual([a.x, a.z, a.frame], [56, 48, 0]);
  advance(c, s, 14);
  assert.deepEqual([a.x, a.z, a.node, a.animation], [64, 48, 2, "z"]);
  advance(c, s, 28);
  assert.deepEqual([a.x, a.z, a.node, a.animation], [64, 64, 3, "negX"]);
  advance(c, s, 27);
  assert.equal(a.x, 64);
  advance(c, s, 1);
  assert.equal(a.x, 56);
  // A diagonal destination alternates axes rather than cutting a corner.
  const d = config();
  d.routes.a = [
    [6, 6, 1],
    [8, 8, 0],
  ];
  const t = createAcidSequence();
  acidCameraTransition(d, t, [-1, 0]);
  advance(d, t, 14);
  assert.equal(t.slots[0].animation, "z");
  advance(d, t, 14);
  assert.equal(t.slots[0].animation, "x");
});

test("acid capture holds the retained frame counter and region-six acceleration is sampled at cycle boundaries", () => {
  const c = config(),
    s = createAcidSequence();
  c.entries[0].region = 6;
  acidCameraTransition(c, s, [-2, 0]);
  const a = s.slots[0];
  advance(c, s, 1);
  holdAcidOnContact(a);
  advance(c, s, 26, [{ active: true, region: 6 }]);
  assert.deepEqual([a.frame, a.counter, a.divider], [0, 27, 28]);
  advance(c, s, 1);
  assert.deepEqual([a.frame, a.counter, a.divider], [1, 0, 1]);
  advance(c, s, 6);
  assert.deepEqual([a.frame, a.divider], [0, 2]);
  advance(c, s, 1, [{ active: true, region: 6 }]);
  assert.equal(a.divider, 2);
  advance(c, s, 13, [{ active: true, region: 6 }]);
  assert.equal(a.divider, 1);
  advance(c, s, 7, [{ active: false, region: 6 }]);
  assert.equal(a.divider, 2);
});

test("acid loader shares five slots, selects route groups and unloads after a full allocation scan", () => {
  const c = config(),
    s = createAcidSequence();
  c.entries[0] = {
    activationBand: [0, 2],
    region: 5,
    direct: false,
    choices: [["a"], ["b"]],
  };
  for (let i = 0; i < 6; i++) c.routes["r" + i] = [[i, 1, 0]];
  c.routes.b = [[3, 3, 0]];
  const group = {
    activationBand: [1, 3],
    region: 6,
    direct: false,
    choices: [Array(6).fill("a"), Array.from({ length: 6 }, (_, i) => "r" + i)],
  };
  c.entries.push(group, structuredClone(group));
  acidCameraTransition(c, s, [-1, 0], [], undefined, () => 1);
  acidCameraTransition(c, s, [0, 1], [], undefined, () => 1);
  assert.deepEqual(
    s.slots.map((a) => a.route),
    ["b", "r0", "r1", "r2", "r3"],
  );
  assert.ok(s.slots.every((a) => a.loaded));
  acidCameraTransition(c, s, [3, 4]);
  assert.deepEqual(
    s.slots.map((a) => a.loaded),
    [true, false, false, false, false],
  );
  const full = createAcidSequence();
  full.slots.forEach((a, i) =>
    Object.assign(a, {
      loaded: true,
      route: "old" + i,
      activationBand: [-2, 0],
    }),
  );
  acidCameraTransition(config(), full, [-1, 0]); // entry cannot allocate; old actors still inside
  assert.equal(full.slots.filter((a) => a.loaded).length, 5);
  const next = config();
  next.entries[0].activationBand = [1, 10];
  acidCameraTransition(next, full, [0, 1]);
  assert.equal(
    full.slots.filter((a) => a.loaded).length,
    0,
    "new actor is not allocated into a slot freed later in the same call",
  );
});

function fixture(contact = false) {
  const c = proofCourse();
  c.parts = [
    {
      id: "ground",
      kind: "terrain",
      x: 0,
      y: 0,
      z: 0,
      w: 16,
      d: 16,
      h: 2,
      cellSize: 1,
      cells: Array.from({ length: 256 }, (_, i) => [
        i % 16,
        Math.floor(i / 16),
        0,
        0,
        0,
        0,
      ]),
    },
  ];
  c.starts = [
    contact ? { x: -1.5, y: 0.57, z: -1.5 } : { x: -6, y: 0.57, z: -6 },
  ];
  c.goal = { x: 6, y: 0, z: 6 };
  c.route = [];
  c.checkpoints = [];
  c.enemies = [];
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
  c.navigation = {
    type: "terrain-gates",
    partId: "ground",
    initialRegions: [5, 5],
    gates: [],
  };
  c.acidSequence = config();
  c.zones = Array.from({ length: 5 }, (_, i) => ({
    kind: "acid",
    x: 0,
    y: 0,
    z: 0,
    radius: 0.625,
    nativeAcidSlot: i,
  }));
  return c;
}

test("native acid validation rejects broken routes, ambiguous slots and missing camera context", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => delete c.nativeCamera,
    (c) => (c.acidSequence.routes.a[0][2] = 99),
    (c) => (c.zones[1].nativeAcidSlot = 0),
    (c) => (c.zones[0].kind = "magnet"),
    (c) => (c.acidSequence.entries[0].choices = [["missing"]]),
    (c) => delete c.acidSequence,
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});

test("every native acid frame has the recovered footprint and closed shared topology", () => {
  for (const [animation, frames] of Object.entries(ACID_FRAMES))
    for (let frame = 0; frame < frames.length; frame++) {
      const slot = { animation, frame, x: 0, z: 0 },
        b = acidFrameBounds(slot),
        g = nativeAcidShape(slot, 0.125);
      const xs = [],
        zs = [];
      for (let i = 0; i < g.vertices.length; i += 3) {
        xs.push(g.vertices[i]);
        zs.push(g.vertices[i + 2]);
      }
      assert.ok(
        Math.abs(Math.max(...xs) - Math.min(...xs) - b.w * 0.125) < 1e-6,
      );
      assert.ok(
        Math.abs(Math.max(...zs) - Math.min(...zs) - b.d * 0.125) < 1e-6,
      );
      const edges = new Map();
      for (let i = 0; i < g.indices.length; i += 3)
        for (let j = 0; j < 3; j++) {
          const key = [g.indices[i + j], g.indices[i + ((j + 1) % 3)]]
            .sort((a, b) => a - b)
            .join("/");
          edges.set(key, (edges.get(key) ?? 0) + 1);
        }
      assert.ok([...edges.values()].every((n) => n === 2));
      assert.ok(g.vertices.every(Number.isFinite));
    }
});

test("native acid stays continuous through route wraps and renders the exact live collision mesh", () => {
  const sim = new Simulation(fixture(), { untimed: true }),
    a = sim.acid[0],
    mesh = acidMesh(a.zone);
  try {
    assert.equal(sim.world.getCollider(a.handle).isEnabled(), false);
    sim.step();
    let previous = a.current,
      maxStep = 0;
    for (let i = 0; i < 720; i++) {
      sim.step();
      const c = sim.world.getCollider(a.handle);
      maxStep = Math.max(
        maxStep,
        Math.hypot(
          ...["x", "y", "z"].map(
            (k) => a.current.position[k] - previous.position[k],
          ),
        ),
      );
      updateAcidMesh(mesh, a.zone, 0, 0, 1, c.translation(), a);
      assert.ok(
        mesh.geometry.attributes.position.array.every(
          (v, i) => v === c.vertices()[i],
        ),
        `mesh/sensor disagreement tick ${sim.tick} hidden ${a.hidden} position ${JSON.stringify(a.current.position)}`,
      );
      assert.ok(mesh.position.distanceTo(c.translation()) < 1e-5);
      previous = a.current;
    }
    assert.ok(maxStep > 0 && maxStep < 0.08, `largest step ${maxStep}`);
    assert.equal(sim.acid.filter((a) => !a.hidden).length, 1);
    assert.equal(sim.players[0].deaths, 0);
  } finally {
    mesh.geometry.dispose();
    mesh.material.dispose();
    sim.dispose();
  }
});

test("native acid contact holds the visible pool, captures once and restores mid-hold deterministically", () => {
  const sim = new Simulation(fixture(true), { untimed: true });
  try {
    for (let i = 0; i < 40; i++) sim.step();
    const p = sim.players[0],
      a = sim.acid[0],
      s = sim.nativeAcids.slots[0];
    assert.equal(p.status, "falling");
    assert.equal(p.deaths, 1);
    assert.equal(s.divider, 28);
    assert.equal(s.frame, 0);
    const pool = a.current.position,
      capture = acidCapturePose(p.acidCapture, a.zone, sim.tick / 120, 1, pool);
    assert.equal(capture.position.x, pool.x + p.acidCapture.offset.x);
    const save = sim.snapshot();
    const run = () => {
      const events = [];
      for (let i = 0; i < 180; i++) {
        sim.step();
        events.push(...sim.events);
      }
      return {
        state: structuredClone(sim.nativeAcids),
        pose: structuredClone(sim.acid[0].current),
        players: structuredClone(sim.players),
        events,
      };
    };
    const first = run();
    sim.restore(save);
    const second = run();
    assert.deepEqual(second.state, first.state);
    assert.ok(
      JSON.stringify(second) === JSON.stringify(first),
      "controller, physical mesh, capture and player replay match",
    );
    assert.equal(first.players[0].deaths, 1);
  } finally {
    sim.dispose();
  }
});

test("acid footprint follows a rotated board edge without moving its route center", () => {
  const c = fixture();
  c.parts[0].angle = Math.PI / 4;
  const sim = new Simulation(c, { untimed: true });
  try {
    const angle = c.parts[0].angle,
      cs = Math.cos(angle),
      sn = Math.sin(angle);
    const current = {
      position: { x: 7.75 * cs, y: 0, z: 7.75 * sn },
      geometry: nativeAcidShape(
        { animation: "x", frame: 0, x: 0, z: 0 },
        0.125,
      ),
    };
    const center = { ...current.position };
    assert.ok(fitAcidToTerrain(sim, current, angle));
    assert.equal(current.position.x, center.x);
    assert.equal(current.position.z, center.z);
    const v = current.geometry.vertices;
    for (let i = 0; i < v.length; i += 3)
      assert.ok(
        v[i] + 7.75 <= 8.00001,
        "every visible/collision vertex stays on the board side of the cliff",
      );
    const outside = {
      position: { x: 12 * cs, y: 0, z: 12 * sn },
      geometry: nativeAcidShape(
        { animation: "x", frame: 0, x: 0, z: 0 },
        0.125,
      ),
    };
    assert.equal(fitAcidToTerrain(sim, outside, angle), false);
  } finally {
    sim.dispose();
  }
});
