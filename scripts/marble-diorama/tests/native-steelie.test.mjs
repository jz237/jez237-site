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
  steelieLandingSeverity,
  applySteelieLanding,
} from "../src/native-steelie.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { initPhysics, Simulation } from "../src/physics.mjs";
import {
  nativeSteelieTerrainHeight,
  nativeSteelieFallen,
  awardNativeSteelieDefeat,
} from "../src/native-steelie-physics.mjs";
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

test("steelie landing damage uses source height, strict break thresholds and the source landing-state decrement", () => {
  assert.equal(steelieLandingSeverity(16, 0), 32);
  assert.equal(steelieLandingSeverity(15.999, 0), 31);
  assert.equal(steelieLandingSeverity(-1.25, 2.25), 7);
  const s = createSteelieState();
  s.loaded = true;
  assert.equal(applySteelieLanding(s, 30), false);
  assert.equal(s.mode, 0x24);
  stepSteelieController(config(), s, position(), []);
  assert.equal(s.impactDamage, 29);
  for (let i = 0; i < 30; i++)
    stepSteelieController(config(), s, position(), []);
  assert.equal(
    s.impactDamage,
    29,
    "patrol does not keep decaying the landing byte",
  );
  s.impactDamage = 50;
  assert.equal(applySteelieLanding(s, 30), false);
  assert.equal(s.impactDamage, 80);
  assert.equal(applySteelieLanding(s, 1), true);
  assert.equal(s.breaking, true);
  assert.equal(s.mode,2);
  s.cooldown=100;
  assert.equal(s.impactDamage, 2, "break animation owns the reused phase byte");
  for (let i = 0; i < 63; i++)
    stepSteelieController(config(), s, position(), []);
  assert.equal(s.loaded, true);
  stepSteelieController(config(), s, position(), []);
  assert.equal(s.loaded, false);
  assert.equal(s.cooldown,36);
  const hard = createSteelieState();
  hard.loaded = true;
  assert.equal(applySteelieLanding(hard, 32), true);
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

function dropFixture(height) {
  const c = fixture();
  c.parts[0].cells.forEach((cell) => {
    if (cell[0] < 12) cell.fill(height, 2);
  });
  c.enemies[0].y += height;
  c.starts.forEach((p) => (p.y += height));
  return c;
}

test("a native guard physically rolling off a high ledge breaks once, rewards eligible players and replays the fragment clock", () => {
  const sim = new Simulation(dropFixture(3), { untimed: true, players: 2 });
  try {
    sim.players[1].status = "timeout";
    sim.body(sim.players[1]).setEnabled(false);
    const e = sim.enemies[0],
      events = [];
    for (let i = 0; i < 1200 && !e.steelieShatter; i++) {
      sim.step();
      events.push(...sim.events);
    }
    assert.ok(e.steelieShatter, "unforced patrol reaches a real hard landing");
    assert.equal(sim.players[0].score, 1000);
    assert.equal(sim.players[1].score, 0);
    assert.equal(events.filter((e) => e.type === "steelie-shatter").length, 1);
    assert.ok(events.find((e) => e.type === "steelie-shatter").severity > 31);
    assert.equal(sim.world.getRigidBody(e.handle).isEnabled(), false);
    const captureTick = sim.tick;
    for (let i = 0; i < 45; i++) sim.step();
    const saved = sim.snapshot();
    const run = () => {
      const events = [];
      for (let i = 0; i < 420; i++) {
        sim.step();
        events.push(...sim.events.map((e) => ({ tick: sim.tick, ...e })));
      }
      return {
        guard: structuredClone(sim.enemies[0]),
        scores: sim.players.map((p) => p.score),
        events,
      };
    };
    const first = run();
    sim.restore(saved);
    const second = run();
    assert.deepEqual(second, first);
    const splits = first.events.filter(
      (e) => e.type === "steelie-shatter-split",
    );
    assert.equal(splits.length, 1);
    assert.ok(
      splits[0].tick - captureTick >= 103 &&
        splits[0].tick - captureTick <= 108,
    );
    assert.equal(first.guard.nativeSteelie.loaded, false);
    assert.deepEqual(first.scores, [1000, 0]);
    assert.equal(
      first.events.filter((e) => e.type === "steelie-defeat").length,
      0,
    );
  } finally {
    sim.dispose();
  }
});

test("gentle native drops and ordinary rolling do not trigger a guard break", () => {
  const sim = new Simulation(dropFixture(1), { untimed: true });
  try {
    const e = sim.enemies[0];
    for (let i = 0; i < 330; i++) sim.step();
    assert.ok(e.nativeSteelie.impactDamage > 0, "the actual drop was measured");
    assert.equal(e.nativeSteelie.breaking, false);
    assert.equal(sim.players[0].score, 0);
    assert.equal(e.steelieShatter, null);
  } finally {
    sim.dispose();
  }
});

test("camera departure hides a broken guard and reentry clears its old fragments and damage", () => {
  const sim = new Simulation(dropFixture(3), { untimed: true });
  try {
    for (let i = 0; i < 1200 && !sim.enemies[0].steelieShatter; i++) sim.step();
    assert.ok(sim.enemies[0].steelieShatter);
    sim.nativeCamera.initialTransition = [31, 32];
    for (let i = 0; i < 6; i++) sim.step();
    assert.equal(sim.enemies[0].nativeSteelie.loaded, false);
    sim.nativeCamera.initialTransition = [32, 31];
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0];
    assert.equal(e.nativeSteelie.loaded, true);
    assert.equal(e.steelieShatter, null);
    assert.equal(e.nativeSteelie.impactDamage, 0);
    assert.equal(e.nativeSteelie.breaking, false);
    assert.equal(e.defeated, false);
    assert.equal(sim.players[0].score, 1000);
  } finally {
    sim.dispose();
  }
});

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

test("native void falls award both eligible players once without requiring a contact and restore deterministically", () => {
  const sim = new Simulation(fixture(), { untimed: true, players: 2 });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0],
      body = sim.world.getRigidBody(e.handle);
    // Initial off-edge condition; gravity and the full simulation decide when
    // the guard is lost. No proximity/contact attribution is injected.
    body.setTranslation({ x: 15, y: 0.55, z: 0 }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    for (let i = 0; i < 100; i++) sim.step();
    assert.ok(body.translation().y < -4.5);
    assert.ok(
      Math.abs(body.linvel().y + sim.nativeDynamics.terminalSpeed) < 1e-4,
      "native guards share the original five-unit terminal descent",
    );
    assert.equal(
      e.defeated,
      false,
      "the old five-world-unit threshold is gone",
    );
    assert.equal(e.lastContactPlayer, undefined);
    const snapshot = sim.snapshot();
    const run = () => {
      const events = [];
      for (let i = 0; i < 360; i++)
        events.push(
          ...sim.step().filter((event) => event.type === "steelie-defeat"),
        );
      return {
        events,
        enemies: structuredClone(sim.enemies),
        scores: sim.players.map((p) => p.score),
      };
    };
    const expected = run();
    assert.deepEqual(expected.events, [
      { type: "steelie-defeat", enemy: "guard", player: 0, score: 1000 },
      { type: "steelie-defeat", enemy: "guard", player: 1, score: 1000 },
    ]);
    assert.deepEqual(expected.scores, [1000, 1000]);
    assert.equal(expected.enemies[0].hidden, true);
    assert.equal(body.isEnabled(), false);
    sim.restore(snapshot);
    assert.deepEqual(run(), expected);
  } finally {
    sim.dispose();
  }
});

test("native fall checks use the closed board top and original 16/128-unit strict thresholds", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0],
      b = sim.world.getRigidBody(e.handle);
    assert.equal(nativeSteelieTerrainHeight(sim, { x: 0, y: -5, z: 0 }), 0);
    b.setTranslation({ x: 0, y: -1.44, z: 0 }, true);
    assert.equal(nativeSteelieFallen(sim, e, true), false);
    b.setTranslation({ x: 0, y: -1.46, z: 0 }, true);
    assert.equal(
      nativeSteelieFallen(sim, e, true),
      true,
      "a down ray inside the closed solid must not count as safe support",
    );
    e.supportedY = 0;
    b.setTranslation({ x: 15, y: -16, z: 0 }, true);
    assert.equal(nativeSteelieFallen(sim, e, false), false);
    b.setTranslation({ x: 15, y: -16.01, z: 0 }, true);
    assert.equal(nativeSteelieFallen(sim, e, false), true);
  } finally {
    sim.dispose();
  }
});

test("native terrain queries respect sloped rotated half tiles and exclude other marbles", () => {
  const c = fixture();
  c.parts[0].cells = [[10, 10, 0, 2, null, 4]];
  c.parts[0].angle = Math.PI / 2;
  const sim = new Simulation(c, { untimed: true });
  try {
    sim.step();
    // Before rotation: u=.75, v=.25, height 2u+2v=2.
    assert.ok(
      Math.abs(
        nativeSteelieTerrainHeight(sim, { x: 1.75, y: -8, z: -1.25 }) - 2,
      ) < 1e-5,
    );
    assert.equal(
      nativeSteelieTerrainHeight(sim, { x: 1.25, y: -8, z: -1.75 }),
      null,
    );
    assert.equal(
      nativeSteelieTerrainHeight(sim, sim.body(sim.players[0]).translation()),
      null,
    );
  } finally {
    sim.dispose();
  }
});

test("native defeat rewards include recovering and finished players but exclude timeouts and absent players", () => {
  const players = ["racing", "falling", "finished", "timeout", "absent"].map(
    (status) => ({ status, score: 50 }),
  );
  const sim = { players, events: [] };
  awardNativeSteelieDefeat(sim, { def: { id: "guard" } });
  assert.deepEqual(
    players.map((p) => p.score),
    [1050, 1050, 1050, 50, 50],
  );
  assert.deepEqual(
    sim.events.map((e) => e.player),
    [0, 1, 2],
  );
});

test("native fall queries follow changing terrain meshes and replay the current frame", () => {
  const c = fixture();
  const terrain = c.parts[0];
  terrain.animation = {
    type: "terrain-sequence",
    secondsPerFrame: 0.5,
    activationRegions: [0, 0],
    initialRegions: [0, 0],
    gates: [],
    frames: [0, 3].map((height) => [[12, 12, height, height, height, height]]),
  };
  const sim = new Simulation(c, { untimed: true });
  const at = { x: 0.5, y: -8, z: 0.5 };
  try {
    sim.step();
    assert.ok(Math.abs(nativeSteelieTerrainHeight(sim, at)) < 1e-5);
    const snapshot = sim.snapshot();
    const run = () => {
      for (let i = 0; i < 62; i++) sim.step();
      return nativeSteelieTerrainHeight(sim, at);
    };
    assert.ok(Math.abs(run() - 3) < 1e-5);
    sim.restore(snapshot);
    assert.ok(Math.abs(run() - 3) < 1e-5);
  } finally {
    sim.dispose();
  }
});

test("camera removal does not award a defeat and later loading resets the guard", () => {
  const sim = new Simulation(fixture(), { untimed: true });
  try {
    for (let i = 0; i < 6; i++) sim.step();
    const e = sim.enemies[0];
    e.nativeSteelie.pendingUnload = true;
    for (let i = 0; i < 6; i++)
      assert.equal(
        sim.step().some((event) => event.type === "steelie-defeat"),
        false,
      );
    assert.equal(e.hidden, true);
    assert.equal(sim.players[0].score, 0);
    e.defeated = true;
    e.nativeSteelie.pendingLoad = true;
    for (let i = 0; i < 6; i++) sim.step();
    assert.equal(e.hidden, false);
    assert.equal(e.defeated, false);
    assert.equal(sim.world.getRigidBody(e.handle).isEnabled(), true);
    assert.equal(sim.players[0].score, 0);
  } finally {
    sim.dispose();
  }
});
