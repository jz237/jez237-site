// Aerial's separate three-bed controller, original routines 0x1d3ec–0x1da7c.
// All counters are ORIGINAL updates. See docs/AERIAL-PEGS.md for limitations.
export const PEG_LEVELS = Object.freeze([
  1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1,
]);

// Pixel lifts measured from the original cap tops relative to the flush bed.
export const PEG_HEIGHTS = Object.freeze([0, 5, 12, 17, 19]);

export function createPegSequence(seed = 237) {
  return {
    tick: 0,
    loaded: false,
    randomState: seed >>> 0 || 237,
    beds: Array.from({ length: 3 }, () => ({
      wait: 0,
      frame: -1,
      pattern: 0,
      selected: [],
      drawn: [],
    })),
    levels: Array(36).fill(0),
    previousLevels: Array(36).fill(0),
    collision: Array(36).fill(false),
  };
}

function sample(state, range, random) {
  let result;
  if (random) result = random(range);
  else {
    let x = state.randomState;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    state.randomState = x >>> 0;
    result = state.randomState % range;
  }
  if (!Number.isInteger(result) || result < 0 || result >= range)
    throw Error("Peg random sample is outside its requested range.");
  return result;
}

export function stepPegSequence(state, active, random) {
  state.tick++;
  state.previousLevels = [...state.levels];
  state.levels.fill(0);
  if (!active) {
    state.loaded = false;
    state.collision.fill(false);
    state.previousLevels.fill(0);
    return state;
  }
  if (!state.loaded) {
    // Original initialization chooses legacy per-peg waits, but the active
    // group controller only tests those fields for -1 (selected).
    sample(state, 4, random);
    state.collision.fill(false);
    state.loaded = true;
  }
  const started = [];
  for (const [i, bed] of state.beds.entries()) {
    if (bed.wait >= 0) {
      if (--bed.wait > 0) continue;
      bed.pattern = sample(state, 4, random);
      const column = bed.pattern === 1 ? sample(state, 3, random) : 0;
      const row = sample(state, bed.pattern === 0 ? 4 : 2, random);
      const stride = [1, 3, 4, 2][bed.pattern];
      bed.selected = Array.from(
        { length: 3 },
        (_, j) => i * 12 + row * 3 + column + j * stride,
      );
      // Graphic 59 is a horizontal screen-space line: cells 2,4,6 (or 5,7,9).
      // The original collision loop instead marks 0,2,4 (or 3,5,7). Preserve
      // that mask as reference data, but make our actual solid match the art.
      bed.drawn = bed.selected.map(
        (index) => index + (bed.pattern === 3 ? 2 : 0),
      );
      for (const index of bed.selected) state.collision[index] = true;
      bed.wait = -1;
      bed.frame = 0;
      started.push(i);
    } else if (++bed.frame === PEG_LEVELS.length) {
      bed.wait = sample(state, 4, random) * 16;
      state.collision.fill(false, i * 12, i * 12 + 12);
      bed.selected = [];
      bed.drawn = [];
      bed.frame = -1;
      continue;
    }
    for (const index of bed.drawn) state.levels[index] = PEG_LEVELS[bed.frame];
  }
  // The original chooses one of two sounds per newly started bed AFTER all
  // three bed updates. Preserve that sample order in source trace comparisons.
  for (const i of started)
    state.beds[i].soundVariant = sample(state, 2, random);
  return state;
}

// Reference classification for the original cell-based response. The diorama
// uses actual rounded moving solids, not invisible full-cell collision boxes.
export function sourcePegContact(selected, peg, previous, current) {
  if (
    !selected ||
    Math.floor(current.x / 8) !== peg.x ||
    Math.floor(current.z / 8) !== peg.z
  )
    return null;
  if (
    Math.floor(previous.x / 8) === peg.x &&
    Math.floor(previous.z / 8) === peg.z &&
    Math.floor(current.height) === peg.height
  )
    return "launch";
  return current.height - peg.height < 12 ? "reflect" : "restore-position";
}

export function validateAerialPegs(course, finite) {
  const c = course.pegSequence;
  const parts = course.parts.filter((p) => p.motion?.axis === "native-peg");
  if (!c) {
    if (parts.length) throw Error("Native pegs need a shared sequence.");
    return;
  }
  if (
    !course.navigation ||
    !course.nativeCamera ||
    !Array.isArray(c.parts) ||
    c.parts.length !== 36 ||
    new Set(c.parts).size !== 36 ||
    parts.length !== 36 ||
    c.parts.some((id) => !parts.some((p) => p.id === id)) ||
    !finite(c.rate) ||
    c.rate < 1 ||
    c.rate > 120 ||
    c.rate !== course.nativeCamera.rate ||
    parts.some(
      (p) =>
        p.profile !== "peg" ||
        p.presence ||
        p.motion.grid ||
        p.motion.cycle ||
        p.motion.amplitude <= 0 ||
        p.motion.amplitude > p.h,
    )
  )
    throw Error("Invalid Aerial peg sequence.");
}

export function createAerialPegs(course, seed) {
  return course.pegSequence ? createPegSequence(seed) : null;
}

export function pegPose(part, level = 0) {
  const value = Math.max(0, Math.min(4, level));
  const lower = Math.floor(value),
    upper = Math.ceil(value),
    fraction = value - lower;
  const lift =
    (PEG_HEIGHTS[lower] * (1 - fraction) + PEG_HEIGHTS[upper] * fraction) / 19;
  return {
    position: {
      x: part.x,
      y: part.y + part.motion.amplitude * lift,
      z: part.z,
    },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    // Flush caps remain part of the board, even while the controller sleeps.
    visible: true,
  };
}

export function advanceAerialPegs(course, state, players, time) {
  if (!state) return {};
  const c = course.pegSequence,
    clock = time * c.rate;
  const target = Math.floor(clock + 1e-9);
  const active = players.some(
    (p) => p.active && (p.region === 4 || p.region === 5),
  );
  while (state.tick < target) stepPegSequence(state, active);
  const fraction = Math.max(0, Math.min(1, clock - target));
  return Object.fromEntries(
    c.parts.map((id, i) => {
      const part = course.parts.find((p) => p.id === id);
      const level =
        state.previousLevels[i] * (1 - fraction) + state.levels[i] * fraction;
      return [id, pegPose(part, level)];
    }),
  );
}
