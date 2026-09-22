// Silly-course bird rules recovered from 0x1cdd6–0x1d29a. Coordinates and
// animation indices are source facts; bitmap art is not included.
export const BIRD_LANES = Object.freeze(
  [
    [57, 63],
    [55, 63],
    [49, 58],
    [47, 58],
    [41, 58],
  ].map(Object.freeze),
);
export const BIRD_ANIMATIONS = Object.freeze({
  emerge: Object.freeze([0, 1]),
  fly: Object.freeze([2, 3]),
  wall: Object.freeze([
    4, 4, 4, 4, 5, 6, 5, 6, 5, 6, 5, 5, 6, 6, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
  ]),
  hit: Object.freeze([0, 7, 8, 9]),
});

export function createBirdSequence(seed = 237) {
  return {
    tick: 0,
    spawning: false,
    randomState: seed >>> 0 || 237,
    events: [],
    slots: Array.from({ length: 10 }, (_, slot) => ({
      slot,
      loaded: false,
      generation: 0,
    })),
  };
}

// 0xd7ea: leaving the camera interval stops spawning, not birds already alive.
export function birdCameraTransition(state, [before, after]) {
  const inside = (band) => band >= 3 && band <= 27;
  if (inside(before) !== inside(after)) state.spawning = inside(after);
}

function choose(state, random) {
  // Replayable adapter RNG; the original global hardware-influenced stream
  // cannot be inferred from a course seed. Inject choices for source traces.
  if (random) {
    const value = random(2);
    if (value !== 0 && value !== 1) throw Error("Invalid bird random choice.");
    return value;
  }
  let x = state.randomState;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  state.randomState = x >>> 0;
  return state.randomState % 2;
}

function emit(state, s, type, extra = {}) {
  state.events.push({
    type,
    slot: s.slot,
    generation: s.generation,
    tick: state.tick,
    ...extra,
  });
}

// Two ordered passes, one allocation each. An empty lane takes precedence in
// the first pass; the second may add a follower after four cells of separation.
export function spawnNativeBirds(state) {
  for (let limit = 0; limit < 2; limit++) {
    for (let lane = 0; lane < BIRD_LANES.length; lane++) {
      const [column, row] = BIRD_LANES[lane];
      const occupants = state.slots.filter(
        (s) => s.loaded && Math.floor(s.x / 8) === column,
      );
      if (occupants.length > limit) continue;
      if (occupants.length === 1 && row - Math.floor(occupants[0].z / 8) < 4)
        continue;
      const s = state.slots.find((s) => !s.loaded);
      if (!s) return;
      Object.assign(s, {
        loaded: true,
        generation: s.generation + 1,
        lane,
        x: column * 8 + 4,
        z: row * 8 + 4,
        height: 16344,
        mode: "emerge",
        animation: "emerge",
        frame: 0,
        counter: 0,
        divider: 8,
        cooldown: 0,
        vz: -4,
      });
      emit(state, s, "bird-emerge", { sound: 38 + lane });
      break;
    }
  }
}

// A physical adapter must call this only after actual marble/bird contact.
// No source rectangle is used as an invisible proximity collider.
export function contactNativeBird(state, slot, player) {
  const s = state.slots[slot];
  if (!s?.loaded || s.mode !== "fly") return false;
  Object.assign(s, {
    mode: "retire",
    animation: "hit",
    frame: 0,
    counter: 0,
    divider: 4,
  });
  emit(state, s, "bird-hit", {
    player,
    sound: 20,
    playerAnimation: 11,
    playerCounter: 102,
  });
  return true;
}

// One original update. heightAt returns source terrain height or null for a
// void. Wall contact is reported as an intent: the original rounded its prior
// z down to four units; a 3D adapter must resolve real contact without snapping.
export function stepBirdSequence(state, heightAt = () => null, random) {
  state.tick++;
  state.events = [];
  if (state.spawning && state.tick % 8 === 0) spawnNativeBirds(state);
  for (const s of state.slots) {
    if (!s.loaded) continue;
    s.counter++;
    if (s.counter >= s.divider) {
      s.counter = 0;
      s.frame++;
      if (s.frame === BIRD_ANIMATIONS[s.animation].length) {
        if (s.mode === "retire") {
          s.loaded = false;
          emit(state, s, "bird-remove");
          continue;
        }
        const ahead = state.slots.some(
          (other) =>
            other !== s &&
            other.loaded &&
            Math.floor(other.x) === Math.floor(s.x) &&
            Math.floor(other.z) < Math.floor(s.z),
        );
        s.animation = s.mode = "fly";
        s.frame = 0;
        if (s.cooldown) s.cooldown--;
        if (!s.cooldown) {
          const fast = !ahead && s.vz === -2;
          s.vz = fast ? -4 : -2;
          s.divider = fast ? 1 : 4;
          s.cooldown = choose(state, random) + (fast ? 4 : 1);
        }
      }
    }
    if (s.mode === "fly") {
      const previousZ = s.z;
      s.z += s.vz;
      const terrain = heightAt(s.x, s.z);
      if (terrain !== null && terrain > s.height) {
        Object.assign(s, {
          mode: "retire",
          animation: "wall",
          frame: 0,
          counter: 0,
          divider: 1,
        });
        emit(state, s, "bird-wall", {
          previousZ,
          attemptedZ: s.z,
          sourceStopZ: Math.floor(previousZ / 4) * 4,
        });
      }
    }
  }
}

export function advanceBirdSequence(
  state,
  time,
  rate,
  transitions = [],
  heightAt,
  random,
) {
  transitions.forEach((transition) => birdCameraTransition(state, transition));
  const events = [];
  const target = Math.floor(time * rate + 1e-9);
  while (state.tick < target) {
    stepBirdSequence(state, heightAt, random);
    events.push(...state.events);
  }
  state.events = events;
  return events;
}
