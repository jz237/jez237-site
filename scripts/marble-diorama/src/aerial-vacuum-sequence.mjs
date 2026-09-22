// Aerial subtype 11/13 actors, recovered from the original six region scripts.
// Coordinates use the original eight ground units per terrain cell.
export const AERIAL_VACUUMS = Object.freeze(
  [
    [39, 36, 11, 30],
    [47, 36, 11, 31],
    [50, 47, 13, 32],
    [33, 42, 11, 33],
    [41, 42, 11, 34],
    [44, 53, 13, 35],
  ].map(([x, z, type, region]) =>
    Object.freeze({ x: x * 8, z: z * 8, height: 16300, type, region }),
  ),
);
const UP = [0, 1, 2, 2, 3, 3, 3, 3];
const DOWN = [3, 3, 3, 3, 2, 2, 1, 0, 16];
const HOLD = [3, 4];
const frames = (actor) =>
  actor.phase === "deploy" ? UP : actor.phase === "hold" ? HOLD : DOWN;
const image = (actor, frame) =>
  frame === 16 ? 20 : frame + (actor.type === 11 ? 4 : 9);

export function createAerialVacuumSequence() {
  return { tick: 0, loaded: false, actors: [] };
}

function begin(actor, phase, retire = false) {
  actor.phase = phase;
  actor.frame = 0;
  actor.divider = 0;
  actor.retire = retire;
}

export function stepAerialVacuumSequence(state, input = {}) {
  state.tick++;
  if (input.unload) {
    state.loaded = false;
    state.actors = [];
  }
  if (input.load && !state.loaded) {
    state.loaded = true;
    state.actors = AERIAL_VACUUMS.map((a) => ({
      ...a,
      phase: "region",
      frame: 0,
      divider: 0,
      drawnImage: null,
      retire: false,
    }));
  }
  if (!state.loaded) return state;
  const entered = input.enteredRegions ?? [];
  for (const [i, actor] of state.actors.entries()) {
    if (actor.phase === "removed") continue;
    // Arrival in Aerial region 4 clears the preceding vacuum area. Waiting
    // actors are removed immediately; visible ones finish a withdrawal.
    if (entered.includes(4) || input.retire?.includes(i)) {
      if (actor.phase === "region") {
        actor.phase = "removed";
        actor.drawnImage = null;
      } else begin(actor, "retract", true);
      continue;
    }
    if (actor.phase === "region") {
      if (entered.includes(actor.region)) begin(actor, "deploy");
      continue;
    }
    if (++actor.divider !== 2) continue;
    actor.divider = 0;
    const list = frames(actor);
    actor.drawnImage = image(actor, list[actor.frame]);
    if (++actor.frame < list.length) continue;
    if (actor.phase === "retract") {
      actor.phase = actor.retire ? "removed" : "region";
      actor.frame = 0;
      continue;
    }
    // Opcode 18 runs after deployment and each two-frame hold loop. Both
    // active players participate; crossing into the next vacuum region keeps
    // the previous mouth active until neither marble occupies either region.
    const occupied = (input.players ?? []).some(
      (p) =>
        p.active &&
        (p.region === actor.region || p.region === actor.region + 1),
    );
    begin(actor, occupied ? "hold" : "retract");
  }
  return state;
}

export function aerialVacuumDeployment(actor) {
  if (
    !actor ||
    actor.drawnImage === null ||
    actor.drawnImage === 20 ||
    actor.phase === "removed"
  )
    return 0;
  const base = actor.type === 11 ? 4 : 9;
  return Math.min(1, (actor.drawnImage - base + 1) / 4);
}

const word = (value) => (Math.floor(value) << 16) >> 16;
const inRange = (n, lo, hi) => n >= lo && n < hi;

// Original front field and fixed-point attraction (0x17aa8 / 0x17c88).
// Inputs are source coordinates; returned deltas are source velocity per
// ORIGINAL update. The caller converts the units/rate once, not per render.
export function aerialVacuumInteraction(actor, previous, current) {
  if (actor?.phase !== "hold") return null;
  let dx = word(actor.x - word(current.x)),
    dz = word(actor.z - word(current.z));
  const swap = actor.type === 13;
  const along = swap ? dx : dz,
    across = swap ? dz : dx;
  if (inRange(across, -12, 28) && inRange(along, -32, -8)) {
    if (inRange(across, 0, 16) && inRange(along, -15, -9))
      return { kind: "capture" };
    dx += swap ? 12 : -8;
    dz += swap ? -8 : 12;
    const ax = Math.abs(dx),
      az = Math.abs(dz);
    const denominator = 16 * Math.max(ax, az) + 6 * Math.min(ax, az);
    const divide = (n) =>
      denominator
        ? (((Math.trunc((n * 65536) / denominator) << 16) >> 16) * 4) / 65536
        : 0;
    return { kind: "pull", x: divide(dx), z: divide(dz) };
  }
  if (
    !inRange(across, -12, 28) ||
    !inRange(along, -8, 16) ||
    word(current.height) >= 16324
  )
    return null;
  const px = word(actor.x - word(previous.x)),
    pz = word(actor.z - word(previous.z));
  const previousInside =
    inRange(swap ? pz : px, -12, 28) &&
    inRange(swap ? px : pz, -8, 16) &&
    word(previous.height) < 16324;
  return { kind: previousInside ? "crush" : "block" };
}
