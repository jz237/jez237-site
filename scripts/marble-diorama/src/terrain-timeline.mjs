// Discrete terrain writes use the same fixed simulation clock as collisions.
// Tick 1 is the actor's initialization update; event ticks are inclusive.
export function validateTerrainTimeline(t, frameCount, finite) {
  const integer = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
  if (
    !t ||
    !finite(t.rate) ||
    t.rate < 1 ||
    t.rate > 60 ||
    !integer(t.durationTicks, 1, 100000) ||
    typeof t.loop !== "boolean" ||
    !Array.isArray(t.events) ||
    !t.events.length ||
    t.events.length > 256 ||
    t.events.some(
      (e, i) =>
        !Array.isArray(e) ||
        e.length !== 2 ||
        !integer(e[0], 1, t.durationTicks) ||
        !integer(e[1], 0, frameCount - 1) ||
        (i > 0 && e[0] <= t.events[i - 1][0]),
    ) ||
    t.events[0][0] !== 1 ||
    t.events[0][1] !== 0
  )
    throw Error("Invalid terrain timeline.");
  if (t.condition !== undefined) {
    const c = t.condition;
    if (
      !c ||
      t.loop ||
      !integer(c.tick, 1, t.durationTicks) ||
      !Array.isArray(c.bounds) ||
      c.bounds.length !== 4 ||
      !c.bounds.every((v) => integer(v, 0, 200)) ||
      c.bounds[0] >= c.bounds[2] ||
      c.bounds[1] >= c.bounds[3] ||
      t.events.slice(1).some((e) => e[0] < c.tick)
    )
      throw Error("Invalid terrain timeline condition.");
  }
}

export function advanceTerrainTimeline(timeline, state, players, time) {
  const elapsed = Math.floor((time - state.startedAt) * timeline.rate + 1e-9);
  const tick = timeline.loop
    ? (elapsed % timeline.durationTicks) + 1
    : Math.min(elapsed + 1, timeline.durationTicks);
  const condition = timeline.condition;
  if (condition && state.conditionPassed === null && tick >= condition.tick) {
    const [x0, z0, x1, z1] = condition.bounds;
    state.conditionPassed = players.some((p, i) => {
      const tile = state.tiles[i];
      return (
        p.active &&
        tile &&
        tile.x >= x0 &&
        tile.x < x1 &&
        tile.z >= z0 &&
        tile.z < z1
      );
    });
  }
  state.nativeTick = tick;
  if (condition && state.conditionPassed !== true) return;
  // Search the short ordered write list, retaining the last written frame
  // throughout waits and after a one-shot animation has ended.
  for (const [at, frame] of timeline.events) {
    if (at > tick) break;
    state.frame = frame;
  }
}
