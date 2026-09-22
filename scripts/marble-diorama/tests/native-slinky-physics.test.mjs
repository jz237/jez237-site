import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { initPhysics, Simulation } from "../src/physics.mjs";
import { createSlinkyState, SLINKY_ANIMATIONS } from "../src/native-slinky.mjs";
import { slinkySolids } from "../src/slinky-shape.mjs";
import {
  slinkyCoordinates,
  initialSlinkyPose,
} from "../src/native-slinky-physics.mjs";
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
      h: 2,
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
  c.starts = [{ x: -9, y: 0.57, z: -9 }];
  c.goal = { x: 10, y: 0, z: 10 };
  c.zones = [];
  c.route = [];
  c.checkpoints = [];
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
    initialRegions: [0, 0],
    gates: [],
  };
  c.nativeDynamics = { rate: 20 };
  c.enemies = [
    {
      id: "slinky",
      kind: "muncher",
      x: -1.5,
      y: 0,
      z: -1.5,
      radius: 0.5,
      roam: 20,
      speed: 4,
      nativeSlinky: {
        region: 4,
        activationBand: [0, 31],
        nodes: [
          [10, 10, 1],
          [12, 10, 2],
          [12, 12, 0],
        ],
      },
    },
  ];
  return c;
}

test("native slinky definitions validate route links, controller context and actor family", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => delete c.nativeCamera,
    (c) => delete c.nativeDynamics,
    (c) => delete c.navigation,
    (c) => (c.enemies[0].kind = "bird"),
    (c) => (c.enemies[0].nativeSlinky.nodes[0][2] = 8),
    (c) => (c.enemies[0].nativeSlinky.activationBand = [3, 1]),
    (c) => (c.enemies[0].nativeSlinky.region = -1),
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});

test("source/world coordinates and mesh orientation agree on a rotated board", () => {
  const c = fixture();
  c.parts[0].angle = 0.7;
  c.parts[0].x = 3;
  c.parts[0].z = -4;
  const space = slinkyCoordinates(c);
  const p = space.source(space.world(92, 108, 16));
  assert.ok(Math.abs(p.x - 92) < 1e-10 && Math.abs(p.z - 108) < 1e-10);
  assert.equal(p.height, 16);
  const q = space.rotation;
  const rotatedX = { x: 1 - 2 * q.y * q.y, z: -2 * q.y * q.w };
  const a = space.world(84, 84, 0),
    b = space.world(92, 84, 0);
  assert.ok(Math.abs(b.x - a.x - rotatedX.x) < 1e-10);
  assert.ok(Math.abs(b.z - a.z - rotatedX.z) < 1e-10);
});

test("all slinky poses retain finite shared topology, an open throat and outward shell winding", () => {
  const state = createSlinkyState(fixture().enemies[0].nativeSlinky);
  const initial = slinkySolids(0.5, state, 0.125, 0.125);
  for (const [animation, count] of Object.entries(SLINKY_ANIMATIONS)) {
    for (let frame = 0; frame < count; frame++) {
      const solids = slinkySolids(
        0.5,
        { ...state, animation, frame },
        0.125,
        0.125,
      );
      assert.ok(
        solids[0].vertices.every(Number.isFinite),
        `${animation}/${frame}`,
      );
      assert.equal(solids[0].vertices.length, initial[0].vertices.length);
      assert.deepEqual(
        solids.map((s) => s.indices),
        initial.map((s) => s.indices),
      );
      let bottom = Infinity;
      for (let i = 1; i < solids[0].vertices.length; i += 3)
        bottom = Math.min(bottom, solids[0].vertices[i]);
      assert.equal(bottom, 0);
    }
  }
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  try {
    const colliders = initial.map((s) =>
      world.createCollider(RAPIER.ColliderDesc.trimesh(s.vertices, s.indices)),
    );
    for (const c of colliders)
      assert.equal(
        c.castRay(
          new RAPIER.Ray({ x: 0, y: 3, z: 0 }, { x: 0, y: -1, z: 0 }),
          5,
          true,
        ),
        -1,
      );
    const hit = colliders[0].castRayAndGetNormal(
      new RAPIER.Ray({ x: 2, y: 1, z: 0 }, { x: -1, y: 0, z: 0 }),
      3,
      true,
    );
    assert.ok(hit && hit.normal.x > 0.8, "outer shell faces outward");
    const mouth = colliders[1].castRayAndGetNormal(
      new RAPIER.Ray({ x: 0.4, y: 3, z: 0 }, { x: 0, y: -1, z: 0 }),
      3,
      true,
    );
    assert.ok(mouth && mouth.normal.y > 0.9, "yellow annular lip is solid");
  } finally {
    world.free();
  }
});

test("camera-loaded patrol uses shared physical meshes, moves continuously and restores its articulation", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    const e = sim.enemies[0];
    assert.equal(e.hidden, true);
    for (let i = 0; i < 6; i++) sim.step();
    assert.equal(e.hidden, false);
    let previous = { ...sim.body(e).translation() },
      maxStep = 0,
      maxVertexStep = 0;
    const first = previous.x;
    for (let i = 0; i < 360; i++) {
      sim.step();
      const next = sim.body(e).translation();
      maxStep = Math.max(
        maxStep,
        Math.hypot(next.x - previous.x, next.z - previous.z),
      );
      previous = { ...next };
      const oldMesh = e.previous.solids[0].vertices,
        mesh = e.current.solids[0].vertices;
      for (let j = 0; j < mesh.length; j += 3)
        maxVertexStep = Math.max(
          maxVertexStep,
          Math.hypot(
            mesh[j] - oldMesh[j] + next.x - e.previous.position.x,
            mesh[j + 1] - oldMesh[j + 1] + next.y - e.previous.position.y,
            mesh[j + 2] - oldMesh[j + 2] + next.z - e.previous.position.z,
          ),
        );
      e.colliders.forEach((h, index) =>
        assert.deepEqual(
          sim.world.getCollider(h).vertices(),
          e.current.solids[index].vertices,
        ),
      );
    }
    assert.ok(maxStep < 0.03, `no eight-unit root jumps: ${maxStep}`);
    assert.ok(
      maxVertexStep < 0.2,
      `articulation stays continuous at frame/axis changes: ${maxVertexStep}`,
    );
    assert.ok(Math.abs(previous.x - first) > 0.5);
    const snapshot = sim.snapshot();
    const run = () => {
      for (let i = 0; i < 48; i++) sim.step();
      return structuredClone(sim.enemies);
    };
    const expected = run();
    sim.restore(snapshot);
    assert.deepEqual(run(), expected);
  } finally {
    sim.dispose();
  }
});

test("physical moving-player coordinates trigger an attack at the patrol boundary", () => {
  const c = fixture();
  c.starts = [{ x: 2.5, y: 0.57, z: -1.5 }];
  c.navigation.initialRegions = [4, 4];
  const sim = new Simulation(c, { untimed: true });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0],
      p = sim.players[0];
    Object.assign(e.nativeSlinky, { frame: 10, counter: 1 });
    sim.body(p).setLinvel({ x: 0, y: 0, z: 3 }, true);
    sim.body(p).setAngvel({ x: 3 / 0.55, y: 0, z: 0 }, true);
    for (let i = 0; i < 6; i++) sim.step();
    assert.equal(e.nativeSlinky.mode, 1);
    assert.equal(e.nativeSlinky.target, 0);
    for (let i = 0; i < 48; i++) sim.step();
    assert.ok(
      sim.body(e).translation().y > 0.2,
      "the body physically leaves the board",
    );
  } finally {
    sim.dispose();
  }
});

test("return alignment travels visibly instead of snapping to the source cell", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0];
    Object.assign(e.nativeSlinky, {
      x: 86.75,
      z: 85.5,
      animation: "miss",
      mode: 6,
      frame: 25,
      counter: 0,
      divider: 1,
      phase: 60,
      height: 0,
    });
    e.slinkyFrom =
      e.slinkyTo =
      e.previous =
      e.current =
        initialSlinkyPose(sim.course, e);
    sim.body(e).setTranslation(e.current.position, true);
    let previous = { ...sim.body(e).translation() },
      maxStep = 0;
    for (let i = 0; i < 30; i++) {
      sim.step();
      const p = sim.body(e).translation();
      maxStep = Math.max(
        maxStep,
        Math.hypot(p.x - previous.x, p.z - previous.z),
      );
      previous = { ...p };
    }
    assert.ok(maxStep < 0.05, `no route-return snap: ${maxStep}`);
    assert.ok(Math.hypot(e.slinkyOffset.x, e.slinkyOffset.z) < 0.01);
  } finally {
    sim.dispose();
  }
});

test("actual patrol contact produces a slide and recovery without killing or rewinding the player", () => {
  const c = fixture();
  c.starts = [{ x: -3.2, y: 0.57, z: -1.5 }];
  const sim = new Simulation(c, { untimed: true });
  try {
    const p = sim.players[0],
      e = sim.enemies[0];
    let bump = false;
    for (let i = 0; i < 180 && !bump; i++) {
      sim.step([{ x: 1, z: 0, turbo: true }]);
      bump = sim.events.some((event) => event.type === "slinky-bump");
    }
    assert.ok(bump, "a manifold contact must trigger the reaction");
    assert.equal(p.status, "racing");
    assert.equal(p.deaths, 0);
    assert.equal(e.nativeSlinky.mode, 2);
    assert.ok(e.nativeSlinky.impact.x > 0);
    const modes = new Set();
    for (let i = 0; i < 240; i++) {
      sim.step();
      modes.add(e.nativeSlinky.mode);
    }
    assert.ok(modes.has(4), "stopping prepares retaliation");
    assert.ok(modes.has(1), "recovery becomes a jump");
  } finally {
    sim.dispose();
  }
});

test("a descending open mouth captures only on a real contact and keeps recovery behind the capture sequence", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0],
      p = sim.players[0];
    // A landing encounter is the initial condition. Thereafter the live
    // controller, deforming mesh and Rapier contact determine the result.
    Object.assign(e.nativeSlinky, {
      animation: "jump",
      mode: 1,
      frame: 32,
      phase: 32,
      divider: 1,
      counter: 0,
      height: 13,
      target: 0,
    });
    e.slinkyFrom =
      e.slinkyTo =
      e.previous =
      e.current =
        initialSlinkyPose(sim.course, e);
    sim.body(e).setTranslation(e.current.position, true);
    sim.body(p).setTranslation({ x: -1.5, y: 0.56, z: -1.5 }, true);
    const captures = [],
      trace = [];
    for (let i = 0; i < 90; i++) {
      sim.step();
      captures.push(
        ...sim.events.filter((event) => event.type === "slinky-capture"),
      );
      if (i % 6 === 0)
        trace.push({
          i,
          mode: e.nativeSlinky.mode,
          frame: e.nativeSlinky.frame,
          intent: e.slinkyIntent,
          p: { ...sim.body(p).translation() },
          e: { ...sim.body(e).translation() },
          events: sim.events,
        });
    }
    assert.equal(captures.length, 1, JSON.stringify(trace));
    assert.equal(p.deaths, 1);
    assert.equal(p.status, "falling");
    assert.ok(p.respawnTick > sim.tick);
  } finally {
    sim.dispose();
  }
});

test("capture intent alone never removes a distant marble", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0],
      p = sim.players[0];
    Object.assign(e.nativeSlinky, {
      animation: "capture",
      mode: 5,
      frame: 0,
      phase: 38,
      divider: 1,
      counter: 0,
      target: 0,
    });
    e.slinkyIntent = { player: 0 };
    for (let i = 0; i < 220; i++) sim.step();
    assert.equal(p.deaths, 0);
    assert.equal(p.status, "racing");
  } finally {
    sim.dispose();
  }
});
