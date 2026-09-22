// Recovered Silly room rules, 0x1c074–0x1ccb8. These source-coordinate
// intents require a physical adapter; never snap an active 3D actor to them.
export const MINIATURE_BLOCKED_ROWS = Object.freeze([
  65535, 51001, 50073, 50057, 49295, 49167, 50959, 49921, 49521, 49201, 51185,
  50161, 49169, 49153, 65535, 65535,
]);
export const MINIATURE_DX = Object.freeze([
  1024, 947, 717, 392, 0, -392, -717, -947, -1024, -947, -717, -392, 0, 392,
  717, 947,
]);
export const MINIATURE_DZ = Object.freeze([
  0, 392, 717, 947, 1024, 947, 717, 392, 0, -392, -717, -947, -1024, -947, -717,
  -392,
]);
export const MINIATURE_FRAMES = Object.freeze({
  steelie: 1,
  steelieHit: 3,
  steelieSpent: 1,
  acidX: 4,
  acidZ: 4,
  acidNegZ: 8,
  acidNegX: 8,
  acidIdle: 1,
  acidSpent: 1,
  muncherX: 8,
  muncherZ: 8,
  muncherNegZ: 8,
  muncherNegX: 8,
  muncherIdle: 11,
  muncherSpent: 1,
});
export function validateNativeMiniatures(course) {
  const actors = (course.enemies ?? []).filter(
    (e) => e.nativeMiniatureSlot !== undefined,
  );
  if (!course.miniatureSequence && !actors.length) return;
  if (
    course.miniatureSequence !== true ||
    !course.nativeCamera?.reverse ||
    course.nativeDynamics?.rate !== course.nativeCamera.rate ||
    course.navigation?.partId !== course.nativeCamera.partId ||
    actors.length !== 9 ||
    new Set(actors.map((e) => e.nativeMiniatureSlot)).size !== 9 ||
    actors.some(
      (e) =>
        !Number.isInteger(e.nativeMiniatureSlot) ||
        e.nativeMiniatureSlot < 0 ||
        e.nativeMiniatureSlot > 8 ||
        e.kind !== "mini" ||
        e.form !==
          (e.nativeMiniatureSlot < 3
            ? "steelie"
            : e.nativeMiniatureSlot < 6
              ? "acid"
              : "muncher") ||
        e.nativeBirdSlot !== undefined ||
        e.nativeSteelie ||
        e.nativeSlinky,
    )
  )
    throw Error("Invalid native miniature sequence.");
}
const cell = (v) => Math.floor(v / 8);
const word = (v) => (Math.floor(v) << 16) >> 16;
export function miniatureBlocked(x, z) {
  const col = cell(x) - 89,
    row = cell(z) - 90;
  return (
    col < 0 ||
    col > 15 ||
    row < 0 ||
    row > 15 ||
    !!(MINIATURE_BLOCKED_ROWS[row] & (1 << col))
  );
}
export function createMiniatureSequence(seed = 237) {
  return {
    tick: 0,
    randomState: seed >>> 0 || 237,
    events: [],
    slots: Array.from({ length: 9 }, (_, slot) => ({
      slot,
      loaded: false,
      generation: 0,
      form: slot < 3 ? "steelie" : slot < 6 ? "acid" : "muncher",
      direction: 0,
      counter: 0,
    })),
  };
}
function choose(state, n, random) {
  if (random) {
    const v = random(n);
    if (!Number.isInteger(v) || v < 0 || v >= n)
      throw Error("Invalid miniature random choice.");
    return v;
  }
  let x = state.randomState;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  state.randomState = x >>> 0;
  return state.randomState % n; // Reproducible adapter, not the original global RNG.
}
function occupied(state, s, x, z) {
  return (
    miniatureBlocked(x, z) ||
    state.slots.some(
      (o) =>
        o !== s &&
        o.loaded &&
        o.mode !== 2 &&
        Math.abs(word(o.x) - word(x)) < 12 &&
        Math.abs(word(o.z) - word(z)) < 12,
    )
  );
}
function animation(s) {
  if (s.mode === 2)
    return s.form === "steelie" ? "steelieSpent" : `${s.form}Spent`;
  if (s.form === "steelie") return "steelie";
  const axis =
    word(s.vz) > 0
      ? "Z"
      : word(s.vz) < 0
        ? "NegZ"
        : word(s.vx) > 0
          ? "X"
          : word(s.vx) < 0
            ? "NegX"
            : "Idle";
  return s.form + axis;
}
function probe(s) {
  const dx = MINIATURE_DX[s.direction] / 256,
    dz = MINIATURE_DZ[s.direction] / 256;
  s.x += dx;
  s.z += dz;
  const scale = s.form === "steelie" ? 0.25 : 1;
  s.vx = dx * scale;
  s.vz = dz * scale;
}

// Original ordered obstacle search. Wandering's first clear probe retains its
// four-unit move; flee probes are always restored. Report this as source intent,
// not a license to move a physical actor through a wall.
export function avoidMiniatureObstacles(state, s, flee = false) {
  if (s.direction === 16) return;
  const x = s.x,
    z = s.z,
    increment = s.form === "steelie" ? 1 : 4;
  probe(s);
  if (!occupied(state, s, s.x, s.z)) {
    if (flee) {
      s.x = x;
      s.z = z;
    }
    return;
  }
  const initial = s.direction;
  if (flee) s.direction = (s.direction - 4) & 255;
  const limit = flee ? 9 : 12;
  for (let i = 0; i < limit; i++) {
    if (s.form !== "steelie" && (i & 3) !== 0) continue;
    s.x = x;
    s.z = z;
    s.direction = (s.direction + increment) & 15;
    if (flee && s.direction === initial) continue;
    probe(s);
    if (!occupied(state, s, s.x, s.z)) {
      s.x = x;
      s.z = z;
      return;
    }
  }
  s.direction = 16;
  s.vx = s.vz = 0;
  if (flee) {
    s.x = x;
    s.z = z;
  }
}

export function miniatureFleeDirection(s, players) {
  let target = players[0],
    best = 320;
  for (const p of players) {
    if (!p.present) continue;
    const ax = 16 * Math.abs(word(s.x) - word(p.x)),
      az = 16 * Math.abs(word(s.z) - word(p.z));
    const d = Math.max(ax, az) + 3 * Math.floor(Math.min(ax, az) / 8);
    if (d < best) {
      best = d;
      target = p;
    }
  }
  if (!target) return 16;
  const dx = word(s.x) - word(target.x),
    dz = word(s.z) - word(target.z);
  if (s.form !== "steelie") {
    const x = Math.floor(dx / 16),
      z = Math.floor(dz / 16);
    return z > 0 ? 4 : z < 0 ? 12 : x > 0 ? 0 : 8;
  }
  const ax = Math.floor(Math.abs(dx) / 16),
    az = Math.floor(Math.abs(dz) / 16);
  const direction = az === 0 ? 0 : ax > az ? 1 : az > ax ? 3 : 2;
  return (
    direction +
    (dx > 0 && dz < 0 ? 12 : dx < 0 && dz < 0 ? 8 : dx < 0 && dz > 0 ? 4 : 0)
  );
}
function selectMove(state, s, players, random) {
  if (s.mode !== 2) {
    if (s.mode === 1) s.direction = miniatureFleeDirection(s, players);
    else if (s.form === "steelie")
      s.direction = (s.direction + choose(state, 5, random) - 2) & 15;
    else {
      s.direction = choose(state, 2, random) * 8 + (s.vx !== 0 ? 4 : 0);
      if (choose(state, 4, random) === 0 && s.form === "muncher") {
        s.direction = 16;
        s.vx = s.vz = 0;
      }
    }
    avoidMiniatureObstacles(state, s, s.mode === 1);
  }
  s.animation = animation(s);
  s.frame = 0;
}

export function miniatureCameraTransition(state, [before, after], random) {
  const inside = (b) => b >= 29 && b <= 56;
  if (inside(before) && !inside(after)) {
    state.slots.forEach((s) => (s.loaded = false));
    return;
  }
  if (inside(before) || !inside(after) || state.slots.some((s) => s.loaded))
    return;
  for (const s of state.slots) {
    Object.assign(s, {
      loaded: true,
      generation: s.generation + 1,
      mode: 0,
      walkCounter: 0,
      vx: 0,
      vz: 0,
      height: 16238,
    });
    // Bounded adapter guard prevents a malformed injected RNG hanging an import.
    let found = false;
    for (let i = 0; i < 4096; i++) {
      s.x = 714 + 4 * choose(state, 32, random);
      s.z = 722 + 4 * choose(state, 32, random);
      if (!occupied(state, s, s.x, s.z)) {
        found = true;
        break;
      }
    }
    if (!found) throw Error("Unable to place native miniature.");
    selectMove(state, s, [], random);
  }
}

export function contactNativeMiniature(state, slot, player) {
  const s = state.slots[slot];
  if (!s?.loaded || s.mode === 2) return false;
  s.mode = 2;
  s.vx = s.vz = 0;
  s.frame = 0;
  s.animation = s.form === "steelie" ? "steelieHit" : `${s.form}Spent`;
  state.events.push({
    type: "miniature-collect",
    slot,
    player,
    score: 500,
    time: 3,
    sound: s.form === "steelie" ? 35 : s.form === "muncher" ? 34 : 36,
  });
  return true;
}

export function stepMiniatureSequence(state, players = [], random) {
  state.tick++;
  state.events = [];
  const alerted = players.some(
    (p) => p.active && word(p.height) === 16238 && p.region === 1,
  );
  for (const s of state.slots) {
    if (!s.loaded) continue;
    s.counter++;
    if (s.mode !== 2) s.mode = alerted ? 1 : 0;
    if (s.counter < (s.mode === 1 ? 1 : 3)) continue;
    s.counter = 0;
    if (s.form === "steelie" && s.mode !== 2) {
      s.x += s.vx;
      s.z += s.vz;
      s.walkCounter++;
      if (s.walkCounter >= 4) {
        selectMove(state, s, players, random);
        s.walkCounter = 0;
      }
    } else {
      s.frame++;
      if (s.frame >= MINIATURE_FRAMES[s.animation]) {
        if (s.form !== "steelie") {
          s.x += s.vx;
          s.z += s.vz;
        }
        selectMove(state, s, players, random);
      }
    }
  }
}
