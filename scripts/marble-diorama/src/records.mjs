import { STEP, PHYSICS_VERSION } from "./physics.mjs";
import { recordKey, saveStore } from "./storage.mjs";

export function medalFor(course, seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  if (course.medals && seconds <= course.medals.gold) return "gold";
  if (course.medals && seconds <= course.medals.silver) return "silver";
  return "bronze";
}

export function medalTargets(course) {
  return course.medals
    ? `Gold ≤ ${course.medals.gold}s · Silver ≤ ${course.medals.silver}s · Bronze: finish`
    : "Bronze: finish this course";
}

export function recordContext(options) {
  return [
    options.players === 2 ? "Two-player" : "Solo",
    options.untimed ? "Untimed practice" : "Timed race",
    `Difficulty ${options.difficulty}`,
    options.assisted ? "Checkpoint assistance" : "Standard",
    options.campaign ? "Campaign" : "Single course",
  ].join(" · ");
}

export function playerRecordKey(course, options, player = 0) {
  const key = recordKey(course, options);
  // Keep existing solo records and ghosts readable.
  return options.players === 2 ? `${key}:p${player + 1}` : key;
}

export function recordSummary(store, course, options, player = 0) {
  const record = store.records[playerRecordKey(course, options, player)];
  const prefix = options.players === 2 ? `P${player + 1} · ` : "";
  if (!record || !Number.isFinite(record.time))
    return `${prefix}No finish saved yet`;
  const medal = medalFor(course, record.time);
  return `${prefix}${medal[0].toUpperCase() + medal.slice(1)} · Best ${record.time.toFixed(2)}s · High score ${record.bestScore ?? record.score}`;
}

// Commit the complete run atomically, including any quota pruning. A failed
// write must not turn an unsaved result into an apparent personal best later.
export function saveFinishedRun(
  store,
  { course, options, players, recording, mode },
  save = saveStore,
) {
  if (mode !== "play") return { saved: null, pruned: 0, results: [] };
  const candidate = {
    ...store,
    records: { ...store.records },
    recordings: [recording],
  };
  const results = players.map((player, index) => {
    const key = playerRecordKey(course, options, index);
    const old = store.records[key];
    if (player.status !== "finished") return { index, finished: false };
    const time = player.finishTick * STEP;
    const personalBest = !old || time < old.time;
    const bestScore = Math.max(player.score, old?.bestScore ?? old?.score ?? 0);
    const record = personalBest
      ? { time, score: player.score, bestScore, medal: medalFor(course, time) }
      : { ...old, bestScore, medal: medalFor(course, old.time) };
    if (personalBest && options.players === 1)
      record.ghost = { physics: PHYSICS_VERSION, poses: recording.poses };
    candidate.records[key] = record;
    return {
      index,
      finished: true,
      time,
      score: player.score,
      medal: medalFor(course, time),
      personalBest,
      previousTime: old?.time,
      bestTime: record.time,
      bestScore,
    };
  });
  if (!results.some((r) => r.finished))
    return { saved: null, pruned: 0, results };
  let pruned = 0;
  const saved = save(candidate, { onPrune: (count) => (pruned = count) });
  if (saved) {
    store.records = candidate.records;
    store.recordings = candidate.recordings;
  }
  return { saved, pruned, results };
}
