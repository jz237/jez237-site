import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";
import { steelieGroundDragStep } from "./native-steelie.mjs";

// Recovered source-coordinate rules. A physical adapter must resolve the
// capture/push intents against real contact; these are not proximity hits.
export const SLINKY_ANIMATIONS = Object.freeze({
  idle: 11,
  capture: 30,
  miss: 26,
  jump: 34,
  recoverX: 4,
  recoverNegX: 4,
  recoverZ: 4,
  recoverNegZ: 4,
  still: 1,
  walkZ: 8,
  walkNegZ: 8,
  walkX: 8,
  walkNegX: 8,
});
export const SLINKY_JUMP_HEIGHTS = Object.freeze([
  0, 5, 10, 15, 18, 22, 24, 26, 28, 29, 30, 30, 31, 31, 32, 32, 31, 31, 30, 30,
  29, 28, 26, 24, 22, 17, 13, 8, 2, -6, 0, 0,
]);
const fixed = (v) => Math.floor(v * 65536);
const cell = (v) => Math.floor(v / 8);
const metric = (x, z) => Math.max(x, z) + 3 * Math.floor(Math.min(x, z) / 8);
const distance = (a, b) =>
  metric(
    Math.floor(Math.abs(fixed(a.x) - fixed(b.x)) / 4096),
    Math.floor(Math.abs(fixed(a.z) - fixed(b.z)) / 4096),
  );
const isAt = (s, n) => cell(s.x) === n[0] && cell(s.z) === n[1];

export function nearestSlinkyNode(nodes, position) {
  let best = 0,
    closest = 0x400;
  nodes.forEach((n, i) => {
    const d = metric(
      16 * Math.abs(cell(position.x) - n[0]),
      16 * Math.abs(cell(position.z) - n[1]),
    );
    if (d < closest) {
      best = i;
      closest = d;
    }
  });
  return best;
}

// 0x1af26: only a moving, eligible player in the same region wakes a slinky.
// Another slinky already jumping at that player reserves it. When both are
// eligible, the farther-progressed player wins, with player zero on a tie.
export function selectSlinkyTarget(config, state, players, peers = []) {
  let target = -1;
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (
      !p.active ||
      p.region !== config.region ||
      p.motionState === 2 ||
      ![0, 1, 5].includes(p.animationState) ||
      Math.abs(fixed(p.vx)) + Math.abs(fixed(p.vz)) <= 0xc000 ||
      peers.some(
        (other) =>
          other !== state &&
          other.loaded &&
          other.mode === 1 &&
          other.target === i,
      )
    )
      continue;
    if (
      target < 0 ||
      cell(p.x) + cell(p.z) > cell(players[target].x) + cell(players[target].z)
    )
      target = i;
  }
  return target;
}

export function slinkyAttackInRange(position, player) {
  const d = distance(position, player);
  return d > 0x180 && d < 0x280;
}

// 0x1ac50: a walking cycle covers one eight-unit cell, alternating the
// preferred axis according to the previous step. It does not move diagonally.
export function slinkyWalkDirection(position, node, previousX = 0) {
  const dx = Math.sign(node[0] - cell(position.x)) * 8;
  const dz = Math.sign(node[1] - cell(position.z)) * 8;
  if (previousX === 0) return dx ? { x: dx, z: 0 } : { x: 0, z: dz };
  return dz ? { x: 0, z: dz } : { x: dx, z: 0 };
}

// 0x1a2e0–0x1a3d0 resets velocity from displacement/16 before applying the
// 1/32 correction toward an eight-unit desired speed. Retaining last frame's
// velocity here produces a different pursuit law.
export function slinkyPursuitVelocity(position, player) {
  const dx = fixed(player.x) - fixed(position.x);
  const dz = fixed(player.z) - fixed(position.z);
  const d = metric(
    Math.floor(Math.abs(dx) / 4096),
    Math.floor(Math.abs(dz) / 4096),
  );
  const axis = (delta) => {
    const start = Math.floor(delta / 16);
    const desired = d ? Math.floor((Math.trunc(delta / d) * 2048) / 16) : 0;
    return (start + Math.floor((desired - start) / 32)) / 65536;
  };
  return { x: axis(dx), z: axis(dz) };
}

export function slinkyLandingIntent(position, player) {
  const dx = fixed(player.x) - fixed(position.x);
  const dz = fixed(player.z) - fixed(position.z);
  const ax = Math.floor(Math.abs(dx) / 4096),
    az = Math.floor(Math.abs(dz) / 4096);
  const d = metric(ax, az);
  if (ax > 0x100 || az > 0x100) return { type: "miss" };
  if (d < 0x70) return { type: "capture" };
  if (d >= 0xc0) return { type: "miss" };
  return {
    type: "push",
    velocity: {
      x: Math.floor((Math.trunc(dx / d) * 1024) / 16) / 65536,
      z: Math.floor((Math.trunc(dz / d) * 1024) / 16) / 65536,
    },
  };
}

export function createSlinkyState(config, height = 0) {
  return {
    tick: 0,
    loaded: false,
    pendingLoad: false,
    pendingUnload: false,
    x: config.nodes[0][0] * 8 + 4,
    z: config.nodes[0][1] * 8 + 4,
    height,
    vx: 0,
    vz: 0,
    mode: 0,
    node: 0,
    target: 0,
    animation: "idle",
    frame: 0,
    counter: 0,
    divider: 2,
    direction: 1,
    phase: 0,
    impact: { x: 0, z: 0 },
    events: [],
  };
}

function animate(s, animation, divider) {
  s.animation = animation;
  s.frame = s.counter = 0;
  s.divider = divider;
  s.direction = 1;
}

function contactAnimation(s) {
  if (s.mode === 2) {
    if (s.animation !== "still") {
      if (s.frame === 0) {
        s.animation = "still";
        s.direction = 1;
      } else s.direction = s.frame >= 4 ? 1 : -1;
    }
    s.frame = s.counter = 0;
    s.divider = 1;
  } else if (s.mode === 4) {
    const v = s.impact;
    animate(
      s,
      Math.abs(v.x) > Math.abs(v.z)
        ? v.x > 0
          ? "recoverX"
          : "recoverNegX"
        : v.z > 0
          ? "recoverZ"
          : "recoverNegZ",
      2,
    );
  } else if (s.mode === 1) {
    s.phase = 0;
    animate(s, "jump", 1);
  }
}

// Call only after a physical contact in the runtime adapter. The source's
// broad proximity box and its player position rollback are not applied here.
export function applySlinkyBump(s, velocity, playerIndex) {
  if (s.mode !== 0 && s.mode !== 3) return false;
  s.mode = 2;
  contactAnimation(s);
  s.vx = fixed(velocity.x) / 65536;
  s.vz = fixed(velocity.z) / 65536;
  s.impact = { x: s.vx, z: s.vz };
  s.target = playerIndex;
  return true;
}

function slideCycle(s, terrainHeight) {
  const v = steelieGroundDragStep({ x: s.vx, z: s.vz }, 2);
  s.vx = v.x || 0;
  s.vz = v.z || 0;
  if (s.vx === 0 && s.vz === 0) s.mode = 4;
  else {
    const x = s.x + s.vx,
      z = s.z + s.vz,
      height = terrainHeight(x, z);
    if (height === s.height) {
      s.x = x;
      s.z = z;
    } else s.mode = height < s.height ? 4 : 1;
  }
  contactAnimation(s);
}
function walk(config, s) {
  const v = slinkyWalkDirection(s, config.nodes[s.node], s.vx);
  s.vx = v.x;
  s.vz = v.z;
  animate(
    s,
    v.x > 0
      ? "walkX"
      : v.x < 0
        ? "walkNegX"
        : v.z > 0
          ? "walkZ"
          : v.z < 0
            ? "walkNegZ"
            : "idle",
    s.mode === 0 ? 2 : 1,
  );
}
function patrolCycle(config, s, players, peers) {
  if (isAt(s, config.nodes[0]) && s.animation !== "idle") {
    s.mode = 0;
    s.vx = s.vz = 0;
    s.node = config.nodes[s.node][2];
    animate(s, "idle", 2);
  } else {
    if (isAt(s, config.nodes[s.node])) {
      s.mode = 0;
      s.node = config.nodes[s.node][2];
    }
    walk(config, s);
  }
  if (s.mode !== 0) return;
  const target = selectSlinkyTarget(config, s, players, peers);
  if (target < 0) return;
  s.target = target;
  if (!slinkyAttackInRange(s, players[target])) return;
  s.mode = 1;
  s.phase = 0;
  animate(s, "jump", 1);
}

// Source reference update in original units. It exposes capture and push as
// intents only and never mutates player records. The runtime adapter maps
// these coordinates to continuous articulated poses and actual contacts.
export function stepSlinkyController(
  config,
  s,
  players,
  peers = [],
  terrainHeight = () => 0,
) {
  s.events = [];
  const sliding = s.mode === 2;
  s.counter++;
  if (s.counter >= s.divider) {
    s.counter = 0;
    s.frame += s.direction;
    if (s.frame === SLINKY_ANIMATIONS[s.animation] || s.frame === 0) {
      s.frame = 0;
      if (s.mode === 0 || s.mode === 3) {
        s.x += s.vx;
        s.z += s.vz;
        patrolCycle(config, s, players, peers);
      } else if (s.mode === 1) {
        const intent = players[s.target]
          ? slinkyLandingIntent(s, players[s.target])
          : { type: "miss" };
        s.events.push({ ...intent, player: s.target });
        s.mode = intent.type === "capture" ? 5 : 6;
        animate(s, s.mode === 5 ? "capture" : "miss", 1);
      } else if (s.mode === 5 || s.mode === 6) {
        if (s.mode === 5) s.events.push({ type: "release", player: s.target });
        // Reference-only grid alignment in 0x1b5be. The future physical
        // adapter returns through actual movement instead of this snap.
        s.x = cell(s.x) * 8 + 4;
        s.z = cell(s.z) * 8 + 4;
        s.mode = 3;
        s.node = nearestSlinkyNode(config.nodes, s);
        walk(config, s);
      } else if (s.mode === 4) {
        s.mode = 1;
        contactAnimation(s);
      }
    }
  }
  if (sliding) slideCycle(s, terrainHeight);
  if (![1, 5, 6].includes(s.mode)) return s;
  if (s.phase > 5 && s.phase < 38) {
    const height = terrainHeight(s.x, s.z);
    s.height = height + SLINKY_JUMP_HEIGHTS[s.phase - 6];
    const p = players[s.target];
    if (
      p?.active &&
      p.region === config.region &&
      p.motionState === 0 &&
      p.height === height &&
      [0, 1, 5, 7].includes(p.animationState)
    ) {
      const v = slinkyPursuitVelocity(s, p);
      s.vx = v.x;
      s.vz = v.z;
    } else s.vx = s.vz = 0;
    const x = s.x + s.vx,
      z = s.z + s.vz;
    if (terrainHeight(x, z) === height) {
      s.x = x;
      s.z = z;
    }
  }
  s.phase++;
  return s;
}

export function advanceSlinkyController(
  config,
  state,
  time,
  rate,
  camera,
  players,
  peers = [],
  terrainHeight = () => 0,
) {
  const events = [];
  for (const transition of camera?.transitions ?? []) {
    if (entersCameraBand(transition, config.activationBand)) {
      state.pendingLoad = true;
      state.pendingUnload = false;
    }
    if (leavesCameraBand(transition, config.activationBand)) {
      state.pendingUnload = true;
      state.pendingLoad = false;
    }
  }
  let spawned = false;
  const target = Math.floor(time * rate + 1e-9);
  while (state.tick < target) {
    state.tick++;
    if (state.pendingUnload) state.loaded = false;
    if (state.pendingLoad && !state.loaded) {
      const tick = state.tick;
      const next = createSlinkyState(config);
      next.height = terrainHeight(next.x, next.z);
      Object.assign(state, next, { tick, loaded: true });
      spawned = true;
    } else if (state.loaded) {
      stepSlinkyController(config, state, players, peers, terrainHeight);
      events.push(
        ...state.events.map((event) => ({ ...event, tick: state.tick })),
      );
    }
    state.pendingLoad = state.pendingUnload = false;
  }
  state.events = events;
  return spawned;
}

export function validateNativeSlinkies(course) {
  for (const e of course.enemies ?? []) {
    if (e.nativeSlinky === undefined) continue;
    const c = e.nativeSlinky;
    if (
      !c ||
      e.kind !== "muncher" ||
      e.nativeSteelie ||
      !course.nativeCamera ||
      course.nativeDynamics?.rate !== course.nativeCamera.rate ||
      !course.navigation ||
      course.nativeCamera.partId !== course.navigation.partId ||
      !Number.isInteger(c.region) ||
      c.region < 0 ||
      c.region > 127 ||
      !Array.isArray(c.activationBand) ||
      c.activationBand.length !== 2 ||
      !c.activationBand.every(
        (n) => Number.isInteger(n) && n >= -128 && n <= 127,
      ) ||
      c.activationBand[0] > c.activationBand[1] ||
      !Array.isArray(c.nodes) ||
      !c.nodes.length ||
      c.nodes.length > 127 ||
      c.nodes.some(
        (n) =>
          !Array.isArray(n) ||
          n.length !== 3 ||
          !n.every(Number.isInteger) ||
          n[0] < 0 ||
          n[0] > 127 ||
          n[1] < 0 ||
          n[1] > 127 ||
          n[2] < 0 ||
          n[2] >= c.nodes.length,
      )
    )
      throw Error("Invalid native slinky route.");
  }
}
