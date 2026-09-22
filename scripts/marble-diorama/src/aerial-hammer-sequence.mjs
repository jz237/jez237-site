// Recovered Aerial subtype-12 scripts. Values are original update counts and
// source coordinates, not seconds or Three.js coordinates. See AERIAL-HAMMERS.md.
export const HAMMER_DELAYS = Object.freeze([
  Object.freeze([30, 0, 30, 0]),
  Object.freeze([0, 30, 60, 0]),
  Object.freeze([90, 60, 30, 0]),
  Object.freeze([0, 90, 30, 60]),
]);
export const HAMMER_IMAGES = Object.freeze([
  31, 32, 33, 34, 34, 35, 36, 37, 38, 38, 38, 38, 39, 32, 31, 40,
]);
// Graphic bytes 4..7 are ALSO the collision rectangle. These describe source
// ground-plane units, not a sprite's screen-space bounding box.
const RECTANGLES = Object.freeze({
  31: Object.freeze([0, 0, 8, 8]),
  32: Object.freeze([0, 0, 8, 8]),
  33: Object.freeze([0, 0, 8, 8]),
  34: Object.freeze([-2, 0, 10, 8]),
  35: Object.freeze([-2, 0, 10, 8]),
  36: Object.freeze([-4, 0, 12, 8]),
  37: Object.freeze([-6, 0, 14, 8]),
  38: Object.freeze([-8, 0, 16, 8]),
  39: Object.freeze([-8, 0, 16, 8]),
  40: Object.freeze([0, 0, 0, 0]),
});

export function createAerialHammerSequence(pattern) {
  if (!Number.isInteger(pattern) || pattern < 0 || pattern > 3)
    throw Error("Aerial hammer pattern must be 0–3.");
  return {
    pattern,
    tick: 0,
    loaded: false,
    actors: [],
    regions: [],
  };
}

function load(state) {
  state.loaded = true;
  state.actors = HAMMER_DELAYS[state.pattern].map((delay, i) => ({
    x: 105 * 8,
    z: (108 - 2 * i) * 8,
    height: 16228,
    delay,
    status: "region",
    remaining: 0,
    divider: 0,
    frame: 0,
    // A selected frame is not drawn until opcode 2's divider elapses.
    drawnImage: null,
  }));
}

function startStroke(actor) {
  actor.status = "animate";
  actor.frame = 0;
  actor.divider = 0;
}

// Call once per ORIGINAL actor update. Loading and region notifications are
// explicit inputs: callers must not turn "currently in region 10" into a new
// region-entry event on every update. A chosen random pattern stays fixed until
// unloading; original global random-state/call-order parity is not claimed here.
export function stepAerialHammerSequence(state, input = {}) {
  state.tick++;
  if (input.unload) {
    state.loaded = false;
    state.actors = [];
  }
  const newlyLoaded = input.load && !state.loaded;
  if (newlyLoaded) load(state);
  if (!state.loaded) return state;
  const entered = (input.enteredRegions ?? []).includes(10);
  for (const actor of state.actors) {
    if (actor.status === "region") {
      if (entered) {
        if (actor.delay) {
          actor.status = "delay";
          actor.remaining = actor.delay;
        } else startStroke(actor);
      }
      continue;
    }
    if (newlyLoaded) continue;
    if (actor.status === "delay" || actor.status === "wait") {
      if (--actor.remaining === 0) startStroke(actor);
      continue;
    }
    if (++actor.divider !== 2) continue;
    actor.divider = 0;
    actor.drawnImage = HAMMER_IMAGES[actor.frame];
    actor.frame++;
    if (actor.frame === HAMMER_IMAGES.length) {
      // Last graphic is written BEFORE opcode 12 selects the empty table and
      // opcode 3 enters state 0. Collision is disabled for the entire wait.
      actor.status = "wait";
      actor.remaining = state.pattern === 0 ? 60 : 90;
      actor.frame = 0;
    }
  }
  return state;
}

export function aerialHammerCollisionRect(actor) {
  if (actor.status !== "animate") return null;
  const [x, z, w, d] = RECTANGLES[HAMMER_IMAGES[actor.frame]];
  // The original includes a three-unit marble margin even for image 40's
  // zero-size rectangle. Bounds are lower-exclusive and upper-inclusive.
  return [
    actor.x + x - 3,
    actor.z + z - 3,
    actor.x + x + w + 3,
    actor.z + z + d + 3,
  ];
}

function inside(rect, point) {
  return (
    point.x > rect[0] &&
    point.x <= rect[2] &&
    point.z > rect[1] &&
    point.z <= rect[3]
  );
}

// Source 0x178a6–0x17aa4 distinguishes a marble entering the rectangle from
// one already inside as it expands. Integrators apply their respective response;
// this classification must not be replaced with an unconditional death trigger.
export function aerialHammerContact(actor, previous, current) {
  const rect = aerialHammerCollisionRect(actor);
  if (!rect || !inside(rect, current)) return null;
  return inside(rect, previous) ? "strike" : "block";
}

export function aerialHammerDrawRect(actor) {
  const rect = RECTANGLES[actor.drawnImage];
  return rect ? [...rect] : null;
}
