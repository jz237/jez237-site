import test from "node:test";
import assert from "node:assert/strict";
import {
  initPhysics,
  Simulation,
  DemoController,
  PHYSICS_VERSION,
} from "../src/physics.mjs";
import { proofCourse, validateCourse, compileCourse } from "../src/course.mjs";
import {
  Recording,
  seekRecording,
  ghostAt,
  recordKey,
} from "../src/storage.mjs";
await initPhysics();
test("JSON editor round trip preserves every compiled vertex, triangle and motion", () => {
  const a = proofCourse(),
    b = validateCourse(JSON.parse(JSON.stringify(a)));
  const aa = compileCourse(a),
    bb = compileCourse(b);
  assert.deepEqual(aa, bb);
});
test("invalid imports reject nonfinite data, duplicate IDs and excessive geometry", () => {
  const c = proofCourse();
  c.parts[0].w = Infinity;
  assert.throws(() => validateCourse(c));
  const d = proofCourse();
  d.parts.push(d.parts[0]);
  assert.throws(() => validateCourse(d));
  const e = proofCourse();
  e.parts = Array.from({ length: 100 }, (_, i) => ({
    ...e.parts[0],
    id: "tile" + i,
    w: 100,
    d: 100,
  }));
  assert.throws(() => validateCourse(e), /vertex/);
});
test("replay seeking across periodic snapshots preserves deterministic player state", () => {
  const s = new Simulation(proofCourse()),
    d = new DemoController(),
    r = new Recording(s);
  const states = new Map();
  for (let i = 0; i < 2300; i++) {
    const input = [d.input(s)];
    s.step(input);
    r.capture(s, input);
    if ([200, 1200, 1900, 2300].includes(s.tick))
      states.set(s.tick, structuredClone(s.players[0]));
  }
  const roundtrip = JSON.parse(JSON.stringify(r));
  for (const [tick, state] of states) {
    const replay = seekRecording(roundtrip, tick);
    assert.deepEqual(replay.players[0], state);
    replay.dispose();
  }
  assert.ok(ghostAt(roundtrip, 100).position);
  assert.equal(r.seed, 237);
  assert.equal(r.courseRevision, 1);
  s.dispose();
});
test("record classes separate assistance, difficulty, two-player and physics revisions", () => {
  const c = proofCourse(),
    base = { difficulty: 0, players: 1, assisted: false, untimed: false };
  const keys = [
    base,
    { ...base, assisted: true },
    { ...base, difficulty: 1 },
    { ...base, players: 2 },
    { ...base, untimed: true },
  ].map((o) => recordKey(c, o));
  assert.equal(new Set(keys).size, 5);
  assert.ok(keys.every((k) => k.includes(PHYSICS_VERSION)));
  assert.notEqual(keys[0], recordKey({ ...c, revision: 2 }, base));
});
