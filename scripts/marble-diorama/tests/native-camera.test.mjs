import test from "node:test";
import assert from "node:assert/strict";
import {
  createNativeCamera,
  advanceNativeCameraTick,
  nativeProjection,
  nativeCameraBand,
  sourceCameraPlayer,
  entersCameraBand,
  leavesCameraBand,
} from "../src/native-camera.mjs";
import {
  createTerrainSequence,
  advanceTerrainSequence,
} from "../src/terrain-sequence.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import {
  Simulation,
  initPhysics,
  FixedClock,
  RADIUS,
} from "../src/physics.mjs";
await initPhysics();
const config = () => ({
  partId: "ground",
  columnOrigin: 0,
  rowOrigin: 0,
  heightOrigin: 0,
  heightScale: 1,
  initialScroll: 0,
  initialOffset: 0,
  scrollLimit: 400,
  reverse: false,
  rate: 20,
});
const player = (screenY, overrides = {}) => ({
  x: 0,
  z: 0,
  height: screenY - 108,
  active: true,
  motionState: 0,
  animationState: 0,
  ...overrides,
});

test("native projection retains signed integer rounding and ignores display settings", () => {
  assert.deepEqual(
    nativeProjection({ x: 140, z: 140, height: 16320 }, -16144),
    { x: 136, y: 144 },
  );
  assert.deepEqual(nativeProjection({ x: -1.2, z: 2.9, height: 4.9 }, 0), {
    x: 140,
    y: 112,
  });
  assert.equal(nativeCameraBand(-16145, -16144), -1);
  assert.equal(nativeCameraBand(-16160, -16144), -1);
  assert.equal(nativeCameraBand(-16161, -16144), -2);
  const p = {
    x: 10,
    y: 3,
    z: 20,
    w: 12,
    d: 8,
    cellSize: 2,
    angle: Math.PI / 2,
  };
  const c = {
    ...config(),
    columnOrigin: 5,
    rowOrigin: 7,
    heightOrigin: 16384,
    heightScale: 0.5,
  };
  const s = sourceCameraPlayer(
    p,
    c,
    { position: { x: 8, y: 5 + RADIUS, z: 21 }, active: true },
    RADIUS,
  );
  assert.equal(s.x, 68);
  assert.equal(s.z, 80);
  assert.equal(s.height, 16388);
});

test("native camera chooses the leader, reverses on Silly, and excludes inactive states", () => {
  for (const reverse of [false, true]) {
    const c = { ...config(), reverse, initialOffset: 200 },
      s = createNativeCamera(c);
    s.tick = 7;
    s.scroll = 0;
    s.offset = 200;
    advanceNativeCameraTick(c, s, [player(60), player(260)]);
    assert.equal(s.scroll, reverse ? -4 : 4);
  }
  for (const excluded of [
    { active: false },
    { animationState: 2 },
    { animationState: 6 },
    { motionState: 2, verticalVelocity: 0 },
  ]) {
    const c = config(),
      s = createNativeCamera(c);
    s.tick = 7;
    advanceNativeCameraTick(c, s, [player(40, excluded), player(150)]);
    assert.equal(s.scroll, 0);
  }
  for (const animationState of [0, 1, 3, 4, 5]) {
    const c = config(),
      s = createNativeCamera(c);
    s.tick = 7;
    advanceNativeCameraTick(c, s, [player(40, { animationState })]);
    assert.equal(s.scroll, 4);
  }
});

test("native scrolling preserves speed hysteresis and its eight-update idle check", () => {
  const c = config(),
    s = createNativeCamera(c);
  for (let i = 0; i < 7; i++) advanceNativeCameraTick(c, s, [player(100)]);
  assert.equal(s.scroll, 0);
  advanceNativeCameraTick(c, s, [player(100)]);
  assert.equal(s.scroll, 2);
  while (s.tick < 38) advanceNativeCameraTick(c, s, [player(100)]);
  assert.equal(s.scroll, 46);
  assert.equal(s.moving, false);
  const held = structuredClone(s);
  for (let i = 0; i < 20; i++) advanceNativeCameraTick(c, s, [player(100)]);
  assert.equal(s.scroll, held.scroll);
  for (const [y, speed] of [
    [79, 4],
    [80, 2],
    [111, 2],
    [112, 0],
    [127, 0],
  ]) {
    const fresh = createNativeCamera(c);
    fresh.tick = 7;
    advanceNativeCameraTick(c, fresh, [player(y)]);
    assert.equal(fresh.speed, speed, `leader ${y}`);
  }
});

test("camera bounds check before movement and preserve a moving camera while no player is eligible", () => {
  const c = config(),
    s = createNativeCamera(c);
  Object.assign(s, { tick: 7, offset: 399, scroll: 0 });
  advanceNativeCameraTick(c, s, [player(40)]);
  assert.equal(s.offset, 403);
  advanceNativeCameraTick(c, s, [player(40)]);
  assert.equal(s.offset, 403);
  assert.equal(s.moving, false);
  Object.assign(s, {
    moving: true,
    direction: 1,
    speed: 4,
    offset: 100,
    scroll: 100,
    virtualLeader: 0,
  });
  advanceNativeCameraTick(c, s, []);
  assert.equal(s.scroll, 102);
  assert.equal(s.virtualLeader, 82);
});

test("camera loading requires boundary entry and unloads only on the corresponding exit", () => {
  assert.deepEqual(createNativeCamera(config()).initialTransition, [-2, 0]);
  assert.deepEqual(
    createNativeCamera({ ...config(), reverse: true, initialOffset: 400 })
      .initialTransition,
    [26, 25],
  );
  const band = [3, 8];
  for (const t of [
    [2, 3],
    [9, 8],
  ])
    assert.equal(entersCameraBand(t, band), true);
  for (const t of [
    [3, 4],
    [7, 8],
    [2, 4],
    [9, 2],
  ])
    assert.equal(entersCameraBand(t, band), false);
  for (const t of [
    [3, 2],
    [8, 9],
  ])
    assert.equal(leavesCameraBand(t, band), true);
  for (const t of [
    [4, 3],
    [7, 8],
    [4, 2],
    [7, 9],
  ])
    assert.equal(leavesCameraBand(t, band), false);
});

function fixture() {
  const cells = Array.from({ length: 9 }, (_, i) => [
    i % 3,
    Math.floor(i / 3),
    0,
    0,
    0,
    0,
  ]);
  return {
    ...proofCourse(),
    id: "native-camera-proof",
    nativeCamera: config(),
    parts: [
      {
        id: "ground",
        kind: "terrain",
        x: 0,
        y: 0,
        z: 0,
        w: 6,
        d: 6,
        h: 5,
        cellSize: 2,
        cells,
        animation: {
          type: "terrain-sequence",
          activationBand: [0, 3],
          activationRegions: [9, 12],
          initialRegions: [0, 0],
          gates: [],
          frames: [cells, cells.map(([x, z]) => [x, z, -1, -1, -1, -1])],
          timeline: {
            rate: 20,
            durationTicks: 20,
            loop: false,
            events: [
              [1, 0],
              [5, 1],
              [15, 0],
            ],
          },
        },
      },
    ],
    starts: [
      { x: 0, y: RADIUS, z: 0 },
      { x: 1, y: RADIUS, z: 0 },
    ],
    goal: { x: 100, y: 0, z: 100 },
    route: [],
    checkpoints: [],
    zones: [],
  };
}

test("camera-loaded terrain starts independently of route region and cannot restart inside its band", () => {
  const p = fixture().parts[0],
    s = createTerrainSequence(p, 1),
    players = [{ position: { x: 0, z: 0 }, active: true }];
  const update = (time, transitions = []) =>
    advanceTerrainSequence(p, s, players, time, { transitions });
  update(0);
  assert.equal(s.active, false);
  update(1, [[-2, 0]]);
  assert.equal(s.active, true);
  update(1.2);
  assert.equal(s.frame, 1);
  update(2);
  assert.equal(s.cameraLoaded, false);
  assert.equal(s.frame, 0);
  update(3, [[0, 1]]);
  assert.equal(s.active, false);
  update(4, [[1, 0]]);
  assert.equal(s.active, false);
  update(5, [[0, -1]]);
  update(6, [[-1, 0]]);
  assert.equal(s.active, true);
  update(6.2);
  assert.equal(s.frame, 1);
  update(6.3, [[3, 4]]);
  assert.equal(s.active, false);
  assert.equal(s.frame, 1);
  update(7, [[4, 3]]);
  assert.equal(s.frame, 0);
});

test("native camera loading and physics restore deterministically at 30, 60 and 120 fps", () => {
  const results = [];
  for (const fps of [30, 60, 120]) {
    const sim = new Simulation(fixture(), { players: 2, untimed: true });
    try {
      while (sim.tick < 30) sim.step();
      const snap = sim.snapshot();
      const run = () => {
        const clock = new FixedClock(() => sim.step());
        for (let i = 0; i < fps; i++) clock.advance(1 / fps);
        return {
          camera: structuredClone(sim.nativeCamera),
          terrain: structuredClone(sim.terrainAnimations),
          players: structuredClone(sim.players),
        };
      };
      const result = run();
      sim.restore(snap);
      assert.deepEqual(run(), result);
      results.push(result);
    } finally {
      sim.dispose();
    }
  }
  assert.deepEqual(results[0], results[1]);
  assert.deepEqual(results[0], results[2]);
});

test("course imports require valid camera coordinates, bounds and a camera for loading bands", () => {
  const c = fixture();
  assert.deepEqual(validateCourse(structuredClone(c)), c);
  for (const change of [
    (c) => delete c.nativeCamera,
    (c) => (c.nativeCamera = null),
    (c) => (c.nativeCamera.partId = "missing"),
    (c) => (c.nativeCamera.rate = 0),
    (c) => (c.nativeCamera.initialOffset = 1),
    (c) => (c.nativeCamera.columnOrigin = Infinity),
    (c) => (c.nativeCamera.heightScale = -1),
    (c) => (c.nativeCamera.scrollLimit = 4000),
    (c) => (c.parts[0].animation.activationBand = [8, 3]),
    (c) => (c.parts[0].animation.activationBand = [0, 128]),
  ]) {
    const bad = structuredClone(c);
    change(bad);
    assert.throws(() => validateCourse(bad), /camera/i);
  }
});
