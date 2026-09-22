import test from "node:test";
import assert from "node:assert/strict";
import {
  createSteelieState,
  stepSteelieController,
  advanceSteelieController,
  nearestSteelieNode,
  steelieNeighbor,
  steelieVelocityStep,
  steelieGroundDragStep,
} from "../src/native-steelie.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { initPhysics, Simulation } from "../src/physics.mjs";
await initPhysics();
const config = () => ({
  region: 4,
  activationBand: [0, 31],
  nodes: [
    [10, 10, 1, 2, 3, 1],
    [20, 10, 2, 0, 0, 0],
    [10, 20, 3, 0, 0, 0],
    [5, 10, 0, 0, 0, 0],
  ],
});
const position = (x = 84, z = 84) => ({ x, z, motionState: 0 });
const player = (x, z, other = {}) => ({
  x,
  z,
  active: true,
  region: 4,
  motionState: 0,
  animationState: 0,
  ...other,
});

test("steelie patrol uses the first graph link, and route pursuit uses the source distance and tie order", () => {
  const c = config(),
    s = createSteelieState();
  stepSteelieController(c, s, position(), []);
  assert.equal(s.mode, 0x20);
  assert.equal(s.node, 1);
  assert.equal(s.speed, 7);
  assert.deepEqual(s.velocity, { x: 7, z: 0 });
  assert.equal(steelieNeighbor(c.nodes, 0, position(84, 164)), 2);
  assert.equal(steelieNeighbor(c.nodes, 0, position(120, 120)), 1);
  assert.equal(nearestSteelieNode(c.nodes, position(124, 84)), 0);
  const route = createSteelieState();
  stepSteelieController(c, route, position(), [player(84, 164)]);
  assert.equal(route.mode, 0x22);
  assert.equal(route.node, 2);
  assert.equal(route.speed, 8);
});

test("direct chase chooses the farther-progressed eligible rival, with player-one ties", () => {
  const c = config();
  for (const [players, index] of [
    [[player(90, 84), player(100, 84)], 1],
    [[player(90, 84), player(84, 90)], 0],
    [[player(90, 84), player(100, 84, { region: 3 })], 0],
    [[player(90, 84, { motionState: 2 }), player(100, 84)], 1],
    [[player(90, 84, { animationState: 4 }), player(100, 84)], 1],
  ]) {
    const s = createSteelieState();
    stepSteelieController(c, s, position(), players);
    assert.equal(s.mode, 0x21);
    assert.equal(s.target, index);
    assert.equal(s.speed, 12);
  }
  const s = createSteelieState();
  stepSteelieController(c, s, position(), [player(124, 84)]);
  assert.equal(s.mode, 0x22, "exactly 40 source units is outside direct chase");
});

test("lost targets return to the nearest route before patrolling; close approach slows without snapping", () => {
  const c = config(),
    s = createSteelieState();
  stepSteelieController(c, s, position(), [player(90, 84)]);
  stepSteelieController(c, s, position(100, 84), []);
  assert.equal(s.mode, 0x23);
  assert.equal(s.node, 0);
  assert.equal(s.velocity.x, -7);
  stepSteelieController(c, s, position(92, 84), [player(90, 84)]);
  assert.equal(
    s.mode,
    0x23,
    "return phase does not immediately reacquire target",
  );
  stepSteelieController(c, s, position(), []);
  assert.equal(s.mode, 0x20);
  assert.equal(s.node, 1);
  const close = createSteelieState();
  stepSteelieController(c, close, position(), [player(86, 84)]);
  assert.equal(close.speed, 1);
  assert.deepEqual(close.velocity, { x: 1, z: 0 });
});

test("physical contact starts the one-time 150-update timer; regions seven and nine keep direct chase after expiry", () => {
  for (const region of [4, 7, 9]) {
    const c = { ...config(), region },
      s = createSteelieState();
    s.bump = true;
    stepSteelieController(c, s, position(100, 84), []);
    assert.equal(s.cooldown, 149);
    assert.equal(s.mode, 0x23);
    for (let i = 0; i < 149; i++) stepSteelieController(c, s, position(), []);
    assert.equal(s.cooldown, 0);
    s.bump = true;
    stepSteelieController(c, s, position(), [player(96, 84, { region })]);
    assert.equal(s.cooldown, 0, "subsequent collisions do not reset timer");
    assert.equal(s.mode, region === 4 ? 0x20 : 0x21);
  }
});

test("camera loads are latched and the first Beginner guard can unload earlier than its spawn band", () => {
  const c = { ...config(), unloadBand: [0, 15] },
    s = createSteelieState();
  assert.equal(
    advanceSteelieController(
      c,
      s,
      0.025,
      20,
      { transitions: [[-2, 0]] },
      position(),
      [],
    ),
    false,
  );
  assert.equal(
    advanceSteelieController(
      c,
      s,
      0.05,
      20,
      { transitions: [] },
      position(),
      [],
    ),
    true,
  );
  assert.equal(s.loaded, true);
  assert.deepEqual(s.velocity, { x: 0, z: 0 });
  advanceSteelieController(
    c,
    s,
    0.075,
    20,
    { transitions: [[15, 16]] },
    position(),
    [],
  );
  advanceSteelieController(c, s, 0.1, 20, { transitions: [] }, position(), []);
  assert.equal(s.loaded, false);
  assert.equal(
    advanceSteelieController(
      c,
      s,
      0.15,
      20,
      { transitions: [[32, 31]] },
      position(),
      [],
    ),
    true,
  );
  assert.equal(s.node, 0);
  assert.equal(s.cooldown, -1);
});

test("source steering eases by one thirty-second and caps planar speed at five units", () => {
  assert.deepEqual(steelieVelocityStep({ x: 0, z: 0 }, { x: 12, z: 0 }), {
    x: 0.375,
    z: 0,
  });
  let v = { x: 0, z: 0 };
  for (let i = 0; i < 300; i++) v = steelieVelocityStep(v, { x: 12, z: 0 });
  assert.ok(Math.abs(v.x - 5) < 0.002);
  assert.equal(v.z, 0);
  v = { x: 0, z: 0 };
  for (let i = 0; i < 300; i++) v = steelieVelocityStep(v, { x: -8, z: 8 });
  // Source fixed-point rescaling rounds the negative component downward.
  assert.deepEqual(v, { x: -238593 / 65536, z: 238098 / 65536 });
  assert.ok(v.x < 0 && v.z > 0);
});

test("recovered rolling resistance slows a free marble and limits sustained patrol speed", () => {
  assert.deepEqual(steelieGroundDragStep({ x: 1, z: 0 }), {
    x: 0.97265625,
    z: 0,
  });
  let v = { x: 3, z: 0 };
  for (let i = 0; i < 300; i++) v = steelieGroundDragStep(v);
  assert.deepEqual(v, { x: 0, z: 0 });
  for (let i = 0; i < 300; i++)
    v = steelieGroundDragStep(steelieVelocityStep(v, { x: 7, z: 0 }));
  assert.ok(
    v.x > 2.4 && v.x < 2.6,
    "neutral-ground patrol settles near 2.5 source units per update",
  );
});

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
      id: "guard",
      kind: "steelie",
      x: -1.5,
      y: 0.55,
      z: -1.5,
      radius: 0.55,
      roam: 20,
      speed: 4,
      nativeSteelie: config(),
    },
  ];
  return c;
}

test("native routes reject malformed graph edges, invalid bands, missing coordinates and wrong enemy types", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => delete c.nativeCamera,
    (c) => delete c.nativeDynamics,
    (c) => (c.nativeDynamics.rate = 30),
    (c) => delete c.navigation,
    (c) => (c.enemies[0].kind = "mini"),
    (c) => (c.enemies[0].nativeSteelie.nodes[0][2] = 99),
    (c) => (c.enemies[0].nativeSteelie.nodes[0][0] = NaN),
    (c) => (c.enemies[0].nativeSteelie.unloadBand = [15, 0]),
    (c) => (c.enemies[0].nativeSteelie.region = 256),
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});

test("native steelies stay absent before camera loading, roll physically along their route and restore deterministically", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    const e = sim.enemies[0],
      b = sim.world.getRigidBody(e.handle);
    assert.equal(e.hidden, true);
    assert.equal(b.isEnabled(), false);
    for (let i = 0; i < 6; i++) sim.step();
    assert.equal(e.hidden, false);
    assert.equal(b.isEnabled(), true);
    const start = { ...b.translation() };
    for (let i = 0; i < 90; i++) sim.step();
    assert.ok(b.translation().x > start.x + 0.3);
    assert.ok(Math.abs(b.rotation().z) > 0.1);
    assert.ok(Math.abs(b.translation().y - 0.55) < 0.01);
    const snapshot = sim.snapshot();
    const run = () => {
      for (let i = 0; i < 120; i++) sim.step();
      return {
        state: structuredClone(sim.enemies[0]),
        position: { ...sim.world.getRigidBody(e.handle).translation() },
      };
    };
    const result = run();
    sim.restore(snapshot);
    assert.deepEqual(run(), result);
  } finally {
    sim.dispose();
  }
});

test("actual native steelie contact starts recovery and paired snapshots retain the target and timer", () => {
  const c = fixture();
  c.starts = [
    { x: -3.5, y: 0.57, z: -1.5 },
    { x: -5.5, y: 0.57, z: -1.5 },
  ];
  c.navigation.initialRegions = [4, 4];
  const sim = new Simulation(c, { untimed: true, players: 2 });
  try {
    const e = sim.enemies[0];
    for (let i = 0; i < 400 && e.nativeSteelie.cooldown < 0; i++) sim.step();
    assert.ok(e.nativeSteelie.cooldown > 0);
    assert.ok(Number.isInteger(e.lastContactPlayer));
    const snapshot = sim.snapshot();
    const run = () => {
      for (let i = 0; i < 80; i++) sim.step();
      return {
        enemies: structuredClone(sim.enemies),
        players: structuredClone(sim.players),
      };
    };
    const result = run();
    sim.restore(snapshot);
    assert.deepEqual(run(), result);
  } finally {
    sim.dispose();
  }
});
