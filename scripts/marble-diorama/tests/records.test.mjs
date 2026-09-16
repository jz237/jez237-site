import test from "node:test";
import assert from "node:assert/strict";
import { STEP } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { validateCourse } from "../src/course.mjs";
import { encodeStore, decodeStore, recordKey } from "../src/storage.mjs";
import {
  medalFor,
  playerRecordKey,
  recordSummary,
  saveFinishedRun,
} from "../src/records.mjs";

const course = {
  ...blankCourse(),
  id: "award-test",
  medals: { gold: 35, silver: 60 },
};
const options = {
  difficulty: 0,
  players: 1,
  assisted: false,
  untimed: false,
  campaign: false,
};
const finished = (seconds, score = 400) => ({
  status: "finished",
  finishTick: seconds / STEP,
  score,
});
const empty = () => ({
  schema: 1,
  records: {},
  recordings: [],
  courses: [],
  settings: {},
});
const recording = {
  inputs: [],
  poses: [
    {
      tick: 4,
      players: [
        {
          position: { x: 0, y: 0.56, z: 1 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
        },
      ],
    },
  ],
};
const run = (players, opts = options, mode = "play") => ({
  course,
  options: opts,
  players,
  recording,
  mode,
});
const accept = () => true;

test("medals include exact target times, bronze finishes, and reject invalid custom targets", () => {
  assert.equal(medalFor(course, 35), "gold");
  assert.equal(medalFor(course, 35 + STEP), "silver");
  assert.equal(medalFor(course, 60), "silver");
  assert.equal(medalFor(course, 60 + STEP), "bronze");
  assert.equal(medalFor(blankCourse(), 1), "bronze");
  assert.equal(medalFor(course, NaN), null);
  for (const medals of [
    { gold: 0, silver: 60 },
    { gold: 60, silver: 35 },
    { gold: Infinity, silver: 60 },
  ])
    assert.throws(() => validateCourse({ ...course, medals }), /Medal targets/);
});

test("a slower high-score run keeps the fastest ghost and improves the independent score record", () => {
  const store = empty(),
    key = recordKey(course, options);
  const first = saveFinishedRun(store, run([finished(30)]), accept);
  assert.equal(first.results[0].personalBest, true);
  assert.equal(
    playerRecordKey(course, options),
    key,
    "legacy solo key is preserved",
  );
  const ghost = store.records[key].ghost;
  const slower = saveFinishedRun(store, run([finished(45, 1200)]), accept);
  assert.equal(
    slower.results[0].medal,
    "silver",
    "this run's medal is not its historical medal",
  );
  assert.equal(slower.results[0].personalBest, false);
  assert.equal(store.records[key].time, 30);
  assert.equal(store.records[key].score, 400);
  assert.equal(store.records[key].bestScore, 1200);
  assert.equal(store.records[key].ghost, ghost);
  assert.match(
    recordSummary(store, course, options),
    /Gold · Best 30.00s · High score 1200/,
  );
  saveFinishedRun(store, run([finished(25, 500)]), accept);
  assert.equal(store.records[key].time, 25);
  assert.equal(store.records[key].bestScore, 1200);
});

test("two-player finishes award each player independently and do not save a wrong-player ghost", () => {
  const store = empty(),
    opts = { ...options, players: 2 };
  const result = saveFinishedRun(
    store,
    run([finished(30, 700), finished(65, 900)], opts),
    accept,
  );
  assert.deepEqual(
    result.results.map((r) => r.medal),
    ["gold", "bronze"],
  );
  assert.equal(store.records[playerRecordKey(course, opts, 0)].time, 30);
  assert.equal(store.records[playerRecordKey(course, opts, 1)].time, 65);
  assert.equal(
    Object.values(store.records).some((r) => r.ghost),
    false,
  );
  assert.equal(store.records[playerRecordKey(course, options)], undefined);
  const retry = saveFinishedRun(
    store,
    run([{ status: "timeout" }, finished(40, 1000)], opts),
    accept,
  );
  assert.equal(retry.results[0].finished, false);
  assert.equal(retry.results[1].personalBest, true);
  assert.equal(store.records[playerRecordKey(course, opts, 0)].time, 30);
  assert.equal(store.records[playerRecordKey(course, opts, 1)].time, 40);
});

test("assistance, difficulty, practice, campaign, course and physics revisions retain separate records", () => {
  const store = empty();
  const variants = [
    options,
    { ...options, assisted: true },
    { ...options, difficulty: 1 },
    { ...options, untimed: true },
    { ...options, campaign: true },
  ];
  variants.forEach((opts, index) =>
    saveFinishedRun(store, run([finished(30 + index)], opts), accept),
  );
  assert.equal(Object.keys(store.records).length, variants.length);
  variants.forEach((opts, index) =>
    assert.equal(store.records[playerRecordKey(course, opts)].time, 30 + index),
  );
  assert.match(
    recordSummary(store, { ...course, revision: 2 }, options),
    /No finish/,
  );
  const oldKey = playerRecordKey(course, options).replace(
    /^[^:]+:/,
    "old-physics:",
  );
  const oldStore = {
    ...empty(),
    records: { [oldKey]: { time: 10, medal: "gold", score: 900 } },
  };
  assert.match(recordSummary(oldStore, course, options), /No finish/);
});

test("demos, replays and timeouts cannot earn records or overwrite a saved replay", () => {
  const store = empty();
  let writes = 0;
  const save = () => {
    writes++;
    return true;
  };
  for (const mode of ["demo", "replay"])
    assert.equal(
      saveFinishedRun(store, run([finished(1)], options, mode), save).saved,
      null,
    );
  assert.equal(
    saveFinishedRun(store, run([{ status: "timeout" }]), save).saved,
    null,
  );
  assert.equal(writes, 0);
  assert.deepEqual(store, empty());
});

test("failed persistence rolls back new records and replay, then a successful retry survives serialization", () => {
  const store = empty();
  saveFinishedRun(store, run([finished(50)]), accept);
  const previous = structuredClone(store);
  const failed = saveFinishedRun(store, run([finished(20, 2000)]), () => false);
  assert.equal(failed.saved, false);
  assert.deepEqual(store, previous);
  let savedText;
  const retry = saveFinishedRun(
    store,
    run([finished(20, 2000)]),
    (candidate) => {
      savedText = encodeStore(candidate);
      return true;
    },
  );
  assert.equal(retry.saved, true);
  const restored = decodeStore(savedText);
  assert.equal(
    restored.records[playerRecordKey(course, options)].medal,
    "gold",
  );
  assert.deepEqual(restored.records, store.records);
  assert.deepEqual(restored.recordings[0], recording);
});

test("quota pruning reports a saved medal even when the ghost cannot fit", () => {
  const store = empty();
  const result = saveFinishedRun(
    store,
    run([finished(30)]),
    (candidate, { onPrune }) => {
      delete candidate.records[playerRecordKey(course, options)].ghost;
      candidate.recordings = [];
      onPrune(2);
      return true;
    },
  );
  assert.equal(result.saved, true);
  assert.equal(result.pruned, 2);
  assert.equal(store.records[playerRecordKey(course, options)].medal, "gold");
  assert.equal(
    store.records[playerRecordKey(course, options)].ghost,
    undefined,
  );
});

test("custom layout changes cannot inherit records when an import reuses the course revision", () => {
  const store = empty();
  saveFinishedRun(store, run([finished(30)]), accept);
  const changed = structuredClone(course);
  changed.goal.z += 3;
  assert.match(recordSummary(store, changed, options), /No finish/);
  const reordered = Object.fromEntries(Object.entries(course).reverse());
  assert.equal(recordKey(reordered, options), recordKey(course, options));
  assert.equal(
    recordKey(
      { ...course, name: "A new title", medals: { gold: 50, silver: 80 } },
      options,
    ),
    recordKey(course, options),
  );
});
