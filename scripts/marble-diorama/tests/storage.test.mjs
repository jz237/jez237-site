import test from "node:test";
import assert from "node:assert/strict";
import { initPhysics, Simulation } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import {
  encodeStore,
  decodeStore,
  loadStore,
  saveStore,
  Recording,
  seekRecording,
} from "../src/storage.mjs";

await initPhysics();
function empty() {
  return {
    schema: 1,
    settings: { music: 0.3 },
    records: {},
    recordings: [],
    courses: [blankCourse()],
  };
}
function withStorage(limit, run) {
  const old = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  let text = null;
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => text,
      setItem: (_, value) => {
        if (value.length * 2 > limit)
          throw new DOMException("Full", "QuotaExceededError");
        text = value;
      },
    },
  });
  try {
    run(() => text);
  } finally {
    if (old) Object.defineProperty(globalThis, "localStorage", old);
    else delete globalThis.localStorage;
  }
}

test("compact saved analog inputs retain exact replay outcome and ghost poses", () => {
  const sim = new Simulation(blankCourse(), { untimed: true }),
    recording = new Recording(sim);
  for (let tick = 0; tick < 1700; tick++) {
    const input = [
      {
        x: Math.sin(tick / 300) * 0.1391387261733,
        z: 0.014,
        turbo: tick % 83 < 12,
      },
    ];
    sim.step(input);
    recording.capture(sim, input);
  }
  const store = empty();
  store.recordings = [recording];
  store.records.best = {
    time: 10,
    medal: "gold",
    ghost: { poses: recording.poses },
  };
  const encoded = encodeStore(store),
    restored = decodeStore(encoded);
  assert.deepEqual(restored.recordings[0].inputs, recording.inputs);
  assert.deepEqual(restored.records.best.ghost.poses, recording.poses);
  assert.ok(encoded.length < JSON.stringify(store).length * 0.75);
  const replay = seekRecording(restored.recordings[0], sim.tick);
  assert.deepEqual(replay.players[0].current, sim.players[0].current);
  assert.deepEqual(
    decodeStore(JSON.stringify(store)),
    JSON.parse(JSON.stringify(store)),
    "old saves remain readable",
  );
  replay.dispose();
  sim.dispose();
});

test("ten-minute held-control recording fits a 5 MiB browser quota", () => {
  const store = empty();
  const inputs = Array.from({ length: 72000 }, () => [
    { x: 0.125, z: 1, turbo: true },
  ]);
  const poses = Array.from({ length: 18000 }, (_, i) => ({
    tick: (i + 1) * 4,
    players: [
      {
        position: { x: Math.sin(i), y: 0.55, z: i / 123 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
      },
    ],
  }));
  store.recordings = [{ inputs, poses }];
  store.records.best = { time: 600, medal: "bronze", ghost: { poses } };
  withStorage(5 * 1024 * 1024, () => {
    assert.equal(saveStore(store), true);
    assert.deepEqual(loadStore().recordings[0].inputs, inputs);
    assert.equal(loadStore().records.best.ghost.poses.length, poses.length);
  });
});

test("quota eviction preserves scores, medals and authored courses across reload", () => {
  const store = empty();
  store.records.old = {
    time: 42,
    score: 1234,
    medal: "silver",
    ghost: { padding: "x".repeat(40000) },
  };
  store.records.new = {
    time: 37,
    score: 1400,
    medal: "gold",
    ghost: { padding: "y".repeat(1000) },
  };
  let pruned = 0;
  withStorage(10000, () => {
    assert.equal(saveStore(store, { onPrune: (n) => (pruned = n) }), true);
    const restored = loadStore();
    assert.equal(pruned, 1);
    assert.deepEqual(restored.records.old, {
      time: 42,
      score: 1234,
      medal: "silver",
    });
    assert.ok(restored.records.new.ghost);
    assert.deepEqual(restored.courses, store.courses);
    assert.deepEqual(restored.settings, store.settings);
    assert.deepEqual(restored.records, store.records);
  });
});

test("an impossible save keeps the previously stored data and in-memory ghost", () => {
  withStorage(10000, (read) => {
    const store = empty();
    assert.equal(saveStore(store), true);
    const before = read();
    store.records.best = { time: 12, ghost: { padding: "y".repeat(1000) } };
    store.courses[0].name = "x".repeat(10000);
    assert.equal(saveStore(store), false);
    assert.equal(read(), before);
    assert.ok(store.records.best.ghost);
  });
});
