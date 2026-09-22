import test from "node:test";
import assert from "node:assert/strict";
import {
  intermediateWaveCorners,
  intermediateWaveAnimation,
  createIntermediateWaves,
  advanceIntermediateWaves,
} from "../src/intermediate-wave-state.mjs";

test("native wave corners retain the tall edge, side connections and open ending", () => {
  const rest = intermediateWaveCorners();
  assert.deepEqual(rest[0], [
    [48, 48, 0, 0],
    [0, 0, 0, 0],
    [0, 0, null, null],
  ]);
  assert.deepEqual(rest[4][2], [0, 0, 0, null]);
  assert.deepEqual(rest[5][2], [0, 0, 0, 0]);
  assert.deepEqual(rest[6][2], [0, 0, null, 0]);
  assert.deepEqual(rest[21], [
    [48, 48, null, 0],
    [0, null, null, 0],
    [0, null, null, null],
  ]);
  const crest = intermediateWaveCorners([8]);
  assert.deepEqual(crest[3], [
    [78, 78, 30, 30],
    [30, 30, 30, 30],
    [30, 30, null, null],
  ]);
  assert.deepEqual(
    crest[4][2],
    [18, 18, 0, null],
    "opening connects to the fixed side landing",
  );
  const ending = intermediateWaveCorners([84]);
  assert.deepEqual(
    ending[21][0],
    [48, 48, null, 14],
    "outer end ledge stays fixed",
  );
  for (let frame = 0; frame <= 90; frame++) {
    const rows = intermediateWaveCorners([frame]);
    assert.deepEqual(
      rows.flat(2).map((v) => v === null),
      rest.flat(2).map((v) => v === null),
      `same holes at frame ${frame}`,
    );
    assert.ok(rows.flat(2).every((v) => v === null || (v >= 0 && v <= 78)));
  }
  assert.deepEqual(
    intermediateWaveCorners([88]),
    rest,
    "crest has left the field",
  );
});

test("native wave writes reset between updates and overlapping actors preserve order", () => {
  const earlier = intermediateWaveCorners([8]);
  const later = intermediateWaveCorners([9]);
  assert.notDeepEqual(earlier[3], later[3]);
  assert.deepEqual(intermediateWaveCorners([8, 9]), later);
  assert.deepEqual(intermediateWaveCorners([9, 8]), earlier);
  assert.deepEqual(
    intermediateWaveCorners(),
    intermediateWaveCorners([]),
    "a prior call cannot retain a crest",
  );
  for (const invalid of [-1, 256, 1.5, NaN])
    assert.throws(() => intermediateWaveCorners([invalid]), /unsigned byte/);
});

test("native startup, traveling loops, next launch and tail use actor update counts", () => {
  const events = Array.from({ length: 108 }, (_, age) => ({
    age,
    ...intermediateWaveAnimation(age),
  }));
  assert.deepEqual(
    events
      .filter((e) => e.writesTerrain)
      .slice(0, 8)
      .map((e) => [e.age, e.frame]),
    [
      [4, 1],
      [8, 2],
      [12, 3],
      [16, 4],
      [20, 5],
      [22, 6],
      [24, 7],
      [25, 8],
    ],
  );
  assert.deepEqual(
    events.filter((e) => e.releasesNext).map((e) => [e.age, e.frame]),
    [[47, 30]],
  );
  assert.equal(events.filter((e) => e.writesTerrain).length, 90);
  assert.equal(events[106].finished, false);
  assert.equal(events[107].finished, true);
  assert.deepEqual(intermediateWaveAnimation(108), {
    frame: 90,
    writesTerrain: false,
    releasesNext: false,
    finished: true,
  });
  assert.throws(() => intermediateWaveAnimation(0.5), /native update/);
});

test("either active player starts waves, leaving stops new launches and pending crests finish", () => {
  let state = createIntermediateWaves();
  for (let i = 0; i < 20; i++)
    state = advanceIntermediateWaves(state, [0, null]);
  assert.ok(state.actors.every((v) => v === null));
  state = advanceIntermediateWaves(state, [0, 10]);
  assert.equal(state.actors.filter((v) => v !== null).length, 1);
  assert.equal(
    state.actors[0],
    0,
    "creation initializes the script without advancing animation",
  );
  for (let i = 0; i < 47; i++) state = advanceIntermediateWaves(state, [9, 10]);
  assert.equal(state.ready, true);
  state = advanceIntermediateWaves(state, [9, 10]);
  assert.deepEqual(
    state.actors.filter((v) => v !== null),
    [48, 0],
    "one launch for two players, 48 updates apart including initialization",
  );
  for (let i = 0; i < 120; i++)
    state = advanceIntermediateWaves(state, [0, null]);
  assert.ok(state.actors.every((v) => v === null));
  assert.deepEqual(state.writes, []);
  assert.equal(
    state.ready,
    true,
    "eligibility survives leaving the trigger regions",
  );
  state = advanceIntermediateWaves(state, [10]);
  assert.equal(state.actors[0], 0);
});

test("native wave state resumes deterministically and slow startup only writes on due updates", () => {
  let state = createIntermediateWaves();
  state = advanceIntermediateWaves(state, [9]);
  assert.deepEqual(state.writes, [], "initialization has no animation write");
  for (let i = 1; i <= 4; i++) {
    state = advanceIntermediateWaves(state, [9]);
    assert.deepEqual(state.writes, i === 4 ? [1] : []);
  }
  let restored = JSON.parse(JSON.stringify(state));
  for (let i = 0; i < 300; i++) {
    const regions = i < 150 ? [9, 10] : [null, 0];
    state = advanceIntermediateWaves(state, regions);
    restored = advanceIntermediateWaves(restored, regions);
    assert.deepEqual(restored, state);
    assert.ok(state.actors.filter((v) => v !== null).length <= 3);
  }
});
