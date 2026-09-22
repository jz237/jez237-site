// Original screen coordinates are gameplay state, independent of Three.js
// framing, zoom, viewport size and render frequency.
export function nativeProjection(position, scroll) {
  const word = (v) => (Math.floor(v) << 16) >> 16;
  const x = word(position.x),
    z = word(position.z);
  return {
    x: word(136 + z - x),
    y: word(108 + word(position.height) + scroll - Math.floor((x + z) / 2)),
  };
}

export function nativeCameraBand(scroll, initialScroll) {
  return (Math.floor((scroll - initialScroll) / 16) << 24) >> 24;
}

export function createNativeCamera(config) {
  const scroll = config.initialScroll + config.initialOffset;
  return {
    tick: 0,
    scroll,
    offset: config.reverse ? config.scrollLimit - 1 : 0,
    moving: false,
    direction: 0,
    speed: 0,
    virtualLeader: 0,
    initialTransition: [
      nativeCameraBand(
        scroll + (config.reverse ? 25 : -25),
        config.initialScroll,
      ),
      nativeCameraBand(scroll, config.initialScroll),
    ],
    transitions: [],
  };
}

// One original update. Callers provide original-coordinate records; state
// eligibility is explicit so future recovery/airborne states need not guess.
export function advanceNativeCameraTick(config, state, players) {
  state.tick++;
  if (state.tick % 8 !== 0 && !state.moving) return null;
  const eligible = players.filter(
    (p) =>
      p.active &&
      !(p.motionState === 2 && p.verticalVelocity <= 0) &&
      [0, 1, 3, 4, 5].includes(p.animationState),
  );
  let leader = eligible.length
    ? (config.reverse ? Math.max : Math.min)(
        ...eligible.map((p) => nativeProjection(p, state.scroll).y),
      )
    : null;
  if (leader === null) {
    if (!state.moving) return null;
    if (!state.virtualLeader) {
      const distance = state.speed === 4 ? 48 : state.speed === 2 ? 16 : 0;
      state.virtualLeader =
        state.direction === 1 ? 128 - distance : 184 + distance;
    }
    leader = state.virtualLeader;
  } else state.virtualLeader = 0;

  const before = state.scroll;
  let direction = 0;
  if (leader < 128 || (state.moving && state.direction === 1)) {
    if (leader < 80) state.speed = 4;
    else if (leader < 112) state.speed = 2;
    else if (leader > 128) state.speed = 1;
    direction = 1;
    state.moving = state.offset < config.scrollLimit;
  } else if (leader > 184 || (state.moving && state.direction === -1)) {
    if (leader > 232) state.speed = 4;
    else if (leader > 200) state.speed = 2;
    else if (leader < 184) state.speed = 1;
    direction = -1;
    state.moving = state.offset > 0;
  }
  if (state.moving) {
    state.scroll += direction * state.speed;
    state.offset += direction * state.speed;
    if (state.virtualLeader)
      state.virtualLeader += state.direction * state.speed;
    state.direction = direction;
  }
  if (
    (leader > 144 && state.direction === 1) ||
    (leader < 168 && state.direction === -1)
  )
    state.moving = false;
  const oldBand = nativeCameraBand(before, config.initialScroll),
    newBand = nativeCameraBand(state.scroll, config.initialScroll);
  return oldBand === newBand ? null : [oldBand, newBand];
}

export function validateNativeCamera(course, finite) {
  const c = course.nativeCamera;
  if (
    course.parts.some(
      (p) =>
        p.animation?.activationBand !== undefined &&
        p.animation.type !== "terrain-sequence",
    )
  )
    throw Error("Camera activation requires a terrain sequence.");
  if (c === undefined) {
    if (course.parts.some((p) => p.animation?.activationBand))
      throw Error("Terrain camera activation requires a native camera.");
    return;
  }
  const part = course.parts.find((p) => p.id === c?.partId);
  if (
    !c ||
    part?.kind !== "terrain" ||
    typeof c.reverse !== "boolean" ||
    ![
      c.columnOrigin,
      c.rowOrigin,
      c.initialScroll,
      c.initialOffset,
      c.scrollLimit,
    ].every(Number.isSafeInteger) ||
    !Number.isFinite(c.heightOrigin) ||
    ![c.heightScale, c.rate].every(finite) ||
    c.heightScale <= 0 ||
    c.heightScale > 10 ||
    c.rate < 1 ||
    c.rate > 60 ||
    Math.abs(c.columnOrigin) > 2000 ||
    Math.abs(c.rowOrigin) > 2000 ||
    Math.abs(c.initialScroll) > 32767 ||
    Math.abs(c.heightOrigin) > 32767 ||
    c.scrollLimit < 1 ||
    c.scrollLimit > 2032 ||
    c.initialOffset < 0 ||
    c.initialOffset > c.scrollLimit ||
    (!c.reverse && c.initialOffset !== 0)
  )
    throw Error("Invalid native camera.");
}

export function sourceCameraPlayer(part, config, player, radius) {
  const dx = player.position.x - part.x,
    dz = player.position.z - part.z;
  const cs = Math.cos(part.angle ?? 0),
    sn = Math.sin(part.angle ?? 0);
  const coordinate = (v) =>
    Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v;
  return {
    x: coordinate(
      ((dx * cs + dz * sn + part.w / 2) / part.cellSize + config.columnOrigin) *
        8,
    ),
    z: coordinate(
      ((-dx * sn + dz * cs + part.d / 2) / part.cellSize + config.rowOrigin) *
        8,
    ),
    height: coordinate(
      (player.position.y - radius - part.y) / config.heightScale +
        config.heightOrigin,
    ),
    active: player.active,
    motionState: 0,
    animationState: 0,
    verticalVelocity: 0,
  };
}

export function advanceNativeCamera(course, state, players, time, radius) {
  if (!state) return;
  const c = course.nativeCamera,
    part = course.parts.find((p) => p.id === c.partId);
  state.transitions = state.initialTransition ? [state.initialTransition] : [];
  state.initialTransition = null;
  const sourcePlayers = players.map((p) =>
    sourceCameraPlayer(part, c, p, radius),
  );
  const target = Math.floor(time * c.rate + 1e-9);
  while (state.tick < target) {
    const transition = advanceNativeCameraTick(c, state, sourcePlayers);
    if (transition) state.transitions.push(transition);
  }
}

export function entersCameraBand([oldBand, newBand], [low, high]) {
  return (
    (newBand === low || newBand === high) && (oldBand < low || oldBand > high)
  );
}
export function leavesCameraBand([oldBand, newBand], [low, high]) {
  return (
    (oldBand === low && newBand < low) || (oldBand === high && newBand > high)
  );
}
