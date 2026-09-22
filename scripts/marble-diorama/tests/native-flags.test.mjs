import test from "node:test";
import assert from "node:assert/strict";
import {
  createFlagSequence,
  stepFlagSequence,
  createNativeFlags,
  advanceNativeFlags,
  flagClothPoint,
} from "../src/native-flags.mjs";
import { nativeFlagGroup, updateNativeFlag } from "../src/flag-view.mjs";
import { proofCourse, validateCourse } from "../src/course.mjs";
import { initPhysics, Simulation } from "../src/physics.mjs";
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
      w: 10,
      d: 10,
      h: 2,
      cellSize: 1,
      cells: Array.from({ length: 100 }, (_, i) => [
        i % 10,
        Math.floor(i / 10),
        0,
        0,
        0,
        0,
      ]),
    },
  ];
  c.starts = [{ x: 0, y: 0.57, z: 0 }];
  c.goal = { x: 4, y: 0, z: 4 };
  c.zones = [];
  c.checkpoints = [];
  c.route = [];
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
  c.finishFlags = {
    rate: 20,
    activationBand: [0, 34],
    poles: [
      {
        x: 3,
        y: 0,
        z: 4,
        width: 1.6,
        height: 3,
        delay: 0,
        angle: Math.PI * 0.75,
      },
      {
        x: 5,
        y: 0,
        z: 4,
        width: 1.6,
        height: 3,
        delay: 8,
        angle: Math.PI * 0.75,
      },
    ],
  };
  return c;
}

test("finish flags draw every five updates and retain the original second-pole delay", () => {
  for (const delay of [6, 8]) {
    const s = createFlagSequence([0, delay]);
    stepFlagSequence(s, { load: true });
    assert.deepEqual(
      s.actors.map((a) => a.image),
      [null, null],
    );
    const changes = [[], []];
    for (let update = 1; update <= 31; update++) {
      const before = s.actors.map((a) => a.image);
      stepFlagSequence(s);
      s.actors.forEach((a, i) => {
        if (a.image !== before[i]) changes[i].push([update, a.image]);
      });
    }
    assert.deepEqual(changes[0], [
      [5, 0],
      [10, 2],
      [15, 0],
      [20, 2],
      [25, 0],
      [30, 2],
    ]);
    assert.deepEqual(
      changes[1],
      changes[0].map(([n, f]) => [n + delay, f]).filter(([n]) => n <= 31),
    );
    stepFlagSequence(s, { unload: true });
    assert.equal(s.loaded, false);
    stepFlagSequence(s, { load: true });
    assert.deepEqual(
      s.actors.map((a) => a.wait),
      [0, delay],
    );
    assert.ok(s.actors.every((a) => a.image === null));
  }
});

test("flag loading events survive fractional original updates and unload at their camera boundary", () => {
  const c = fixture(),
    s = createNativeFlags(c);
  advanceNativeFlags(c, s, 0.025, { transitions: [[-2, 0]] });
  assert.equal(s.pendingLoad, true);
  advanceNativeFlags(c, s, 0.05, { transitions: [] });
  assert.equal(s.sequence.loaded, true);
  advanceNativeFlags(c, s, 0.3, { transitions: [] });
  assert.deepEqual(
    s.sequence.actors.map((a) => a.image),
    [0, null],
  );
  advanceNativeFlags(c, s, 0.325, { transitions: [[34, 35]] });
  assert.equal(s.pendingUnload, true);
  advanceNativeFlags(c, s, 0.35, { transitions: [] });
  assert.equal(s.sequence.loaded, false);
});

test("flag definitions reject invalid poles, mismatched clocks and invalid bands", () => {
  validateCourse(fixture());
  for (const edit of [
    (c) => delete c.nativeCamera,
    (c) => (c.finishFlags.rate = 50),
    (c) => c.finishFlags.poles.pop(),
    (c) => (c.finishFlags.poles[0].delay = -1),
    (c) => (c.finishFlags.poles[1].height = 0),
    (c) => (c.finishFlags.poles[0].x = NaN),
    (c) => (c.finishFlags.activationBand = [34, 0]),
  ]) {
    const c = fixture();
    edit(c);
    assert.throws(() => validateCourse(c));
  }
});

test("checkered cloth changes with source pose while its attachment and pole remain fixed", () => {
  const p = fixture().finishFlags.poles[0],
    g = nativeFlagGroup(p);
  const a = { image: 0, previousImage: 0 };
  updateNativeFlag(g, a, 0);
  assert.equal(g.visible, true);
  const positions0 = Array.from(
    g.userData.cloth.geometry.attributes.position.array,
  );
  const poleMatrix = g.children[0].position.clone();
  updateNativeFlag(g, { image: 2, previousImage: 0 }, 1);
  const positions1 = Array.from(
    g.userData.cloth.geometry.attributes.position.array,
  );
  assert.notDeepEqual(positions0, positions1);
  assert.ok(positions1.every(Number.isFinite));
  assert.deepEqual(g.children[0].position, poleMatrix);
  for (const v of [0, 0.5, 1])
    assert.deepEqual(flagClothPoint(p, 0, v, 0), flagClothPoint(p, 0, v, 1));
  const colors = Array.from(g.userData.cloth.geometry.attributes.color.array);
  assert.equal(new Set(colors.filter((_, i) => i % 3 === 0)).size, 2);
  updateNativeFlag(g, null, 0);
  assert.equal(g.visible, false);
  g.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
  });
});

test("flag animation follows simulation snapshots and adds no physical finish hazard", () => {
  const c = fixture(),
    sim = new Simulation(c, { untimed: true });
  try {
    for (let i = 0; i < 70; i++) sim.step();
    assert.equal(sim.nativeFlags.sequence.loaded, true);
    const snapshot = sim.snapshot();
    const run = () => {
      for (let i = 0; i < 150; i++) sim.step();
      return {
        flags: structuredClone(sim.nativeFlags),
        position: { ...sim.body(sim.players[0]).translation() },
        colliders: sim.world.colliders.len(),
      };
    };
    const result = run();
    sim.restore(snapshot);
    assert.deepEqual(run(), result);
    const plain = structuredClone(c);
    delete plain.finishFlags;
    const reference = new Simulation(plain, { untimed: true });
    try {
      for (let i = 0; i < 220; i++) reference.step();
      assert.deepEqual(
        { ...reference.body(reference.players[0]).translation() },
        result.position,
      );
      assert.equal(reference.world.colliders.len(), result.colliders);
    } finally {
      reference.dispose();
    }
  } finally {
    sim.dispose();
  }
});
