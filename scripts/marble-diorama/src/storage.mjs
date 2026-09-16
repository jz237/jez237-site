import { PHYSICS_VERSION, Simulation } from "./physics.mjs";
export const STORAGE_KEY = "jez237.marble-diorama.v1";
// JSON numbers round-trip without quantizing analog controls or ghost poses.
// Compact only the persisted representation; replay keeps the normal objects.
export function encodeStore(s) {
  return JSON.stringify(s, (key, value) => {
    if (key === "inputs" && Array.isArray(value)) {
      const runs = [];
      let previous;
      for (const frame of value) {
        const controls = frame.map((p) => [p.x ?? 0, p.z ?? 0, !!p.turbo]);
        const signature = JSON.stringify(controls);
        if (signature === previous) runs.at(-1)[0]++;
        else {
          runs.push([1, ...controls]);
          previous = signature;
        }
      }
      return { encoding: "input-runs-v1", runs };
    }
    if (key === "poses" && Array.isArray(value))
      return {
        encoding: "poses-v1",
        frames: value.map((frame) => [
          frame.tick,
          ...frame.players.map(({ position: p, rotation: q }) => [
            p.x,
            p.y,
            p.z,
            q.x,
            q.y,
            q.z,
            q.w,
          ]),
        ]),
      };
    return value;
  });
}
export function decodeStore(text) {
  return JSON.parse(text, (key, value) => {
    if (key === "inputs" && value?.encoding === "input-runs-v1") {
      const frames = [];
      for (const [count, ...controls] of value.runs) {
        if (
          !Number.isInteger(count) ||
          count < 1 ||
          frames.length + count > 72000
        )
          throw Error("Invalid replay length.");
        for (let i = 0; i < count; i++)
          frames.push(controls.map(([x, z, turbo]) => ({ x, z, turbo })));
      }
      return frames;
    }
    if (key === "poses" && value?.encoding === "poses-v1")
      return value.frames.map(([tick, ...players]) => ({
        tick,
        players: players.map(([x, y, z, qx, qy, qz, qw]) => ({
          position: { x, y, z },
          rotation: { x: qx, y: qy, z: qz, w: qw },
        })),
      }));
    return value;
  });
}
export function loadStore() {
  try {
    const s = decodeStore(localStorage.getItem(STORAGE_KEY));
    if (s?.schema === 1) return s;
  } catch {}
  return {
    schema: 1,
    settings: { music: 0.5, effects: 0.55, sensitivity: 1, quality: "auto" },
    records: {},
    courses: [],
    recordings: [],
  };
}
export function saveStore(s, { onPrune } = {}) {
  const candidate = {
    ...s,
    records: Object.fromEntries(
      Object.entries(s.records).map(([key, record]) => [key, { ...record }]),
    ),
    recordings: [...s.recordings],
  };
  const ghosts = Object.keys(candidate.records).filter(
    (key) => candidate.records[key].ghost,
  );
  let removed = 0;
  for (;;) {
    try {
      localStorage.setItem(STORAGE_KEY, encodeStore(candidate));
      if (removed) {
        s.records = candidate.records;
        s.recordings = candidate.recordings;
        onPrune?.(removed);
      }
      return true;
    } catch (error) {
      if (
        !["QuotaExceededError", "NS_ERROR_DOM_QUOTA_REACHED"].includes(
          error.name,
        )
      )
        return false;
      // Scores, medals, settings and authored courses always take priority.
      // Keep the most recently inserted ghost and latest replay for last.
      if (ghosts.length > 1) delete candidate.records[ghosts.shift()].ghost;
      else if (candidate.recordings.length) candidate.recordings.pop();
      else if (ghosts.length) delete candidate.records[ghosts.shift()].ghost;
      else return false;
      removed++;
    }
  }
}
function customDefinitionTag(course) {
  // Imports and successive playtests may reuse a revision. Include the actual
  // definition so a changed layout cannot inherit its predecessor's records.
  const {
    name,
    subtitle,
    color,
    sidePalette,
    reference,
    medals,
    ...definition
  } = course;
  const text = JSON.stringify(definition, (_, value) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, value[key]]),
        )
      : value,
  );
  let a = 2166136261,
    b = 3339675911;
  for (let i = 0; i < text.length; i++) {
    a = Math.imul(a ^ text.charCodeAt(i), 16777619);
    b = Math.imul(b ^ text.charCodeAt(i), 2246822519);
  }
  return `${(a >>> 0).toString(16).padStart(8, "0")}${(b >>> 0).toString(16).padStart(8, "0")}`;
}
export function recordKey(c, options) {
  const fields = [
    PHYSICS_VERSION,
    c.id,
    c.revision,
    options.difficulty,
    options.players,
    options.assisted ? "assisted" : "standard",
    options.untimed ? "untimed" : "timed",
    options.campaign ? "campaign" : "single",
  ];
  if (c.category === "custom") fields.push(customDefinitionTag(c));
  return fields.join(":");
}
export class Recording {
  constructor(sim) {
    this.schema = 1;
    this.physics = PHYSICS_VERSION;
    this.course = structuredClone(sim.course);
    this.courseRevision = sim.course.revision;
    this.options = structuredClone(sim.options);
    this.seed = sim.options.seed;
    this.initialPlayers = sim.players.map((p) => ({
      time: p.time,
      score: p.score,
      status: p.status,
      campaignDeaths: p.campaignDeaths ?? 0,
    }));
    this.inputs = [];
    this.snapshots = [sim.snapshot()];
    this.poses = [];
  }
  toJSON() {
    // Full Rapier snapshots include the static mesh every time. Keep them in
    // memory for immediate scrubbing; saved replays rebuild from recorded input.
    const { snapshots, ...record } = this;
    return { ...record, snapshots: [] };
  }
  capture(sim, inputs) {
    if (this.inputs.length >= 120 * 60 * 10) return;
    this.inputs.push(structuredClone(inputs));
    if (sim.tick % 4 === 0)
      this.poses.push({
        tick: sim.tick,
        players: sim.players.map((p) => structuredClone(p.current)),
      });
    if (sim.tick % 1200 === 0) this.snapshots.push(sim.snapshot());
  }
}
export function seekRecording(recording, tick) {
  if (recording.physics !== PHYSICS_VERSION || recording.schema !== 1)
    throw Error("This replay uses a different physics version.");
  const sim = new Simulation(recording.course, recording.options);
  const target = Math.max(
    0,
    Math.min(recording.inputs.length, Math.floor(tick)),
  );
  const snap = recording.snapshots.filter((s) => s.tick <= target).at(-1);
  if (snap) sim.restore(snap);
  else if (recording.initialPlayers)
    sim.players.forEach((p, i) => {
      Object.assign(p, recording.initialPlayers[i]);
      if (p.status === "timeout") sim.body(p).setEnabled(false);
    });
  while (sim.tick < target) sim.step(recording.inputs[sim.tick]);
  return sim;
}
export function ghostAt(recording, tick) {
  if (!recording?.poses?.length) return null;
  const i = Math.floor(tick / 4) - 1,
    a = recording.poses[Math.max(0, i)],
    b = recording.poses[Math.min(recording.poses.length - 1, i + 1)];
  if (!a || !b) return null;
  const t = Math.max(
      0,
      Math.min(1, (tick - a.tick) / Math.max(1, b.tick - a.tick)),
    ),
    p = a.players[0],
    q = b.players[0];
  return {
    position: {
      x: p.position.x + (q.position.x - p.position.x) * t,
      y: p.position.y + (q.position.y - p.position.y) * t,
      z: p.position.z + (q.position.z - p.position.z) * t,
    },
    rotation: p.rotation,
  };
}
