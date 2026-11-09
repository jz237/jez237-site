// The little the VR mode asks of the simulation, in one place, so that the
// mode does not care how the host reaches the engine. The host has a `Sim`
// (`ctx.sim`, sim_local.js / sim_remote.js): the newest frame carries the
// player's and the tools' state, input and commands are sent, and the
// engine is either on this thread, where it can be asked for a ray in the
// middle of a frame (`raycast`), or in a worker, where a ray is a question
// whose answer comes a frame or more later (`later`). Both have been run
// (xr_check.mjs; its `worker` section is the second). A host without a
// `Sim` (`ctx.engine`, as it was before there was one) is still answered.
export function hostOf(ctx) {
  const sim = ctx.sim || null, engine = ctx.engine || (sim && sim.engine) || null;
  if (!sim) {
    return {
      playerState: () => engine.playerState(),
      toolState: () => engine.toolState(),
      // The floats the out block's pointers point into (event records).
      floats: () => engine.f32,
      input: (mx, mz, yaw, pitch, buttons, pressed, tool) => engine.input(mx, mz, yaw, pitch, buttons, pressed, tool),
      config: (viewFx, fov) => engine.playerConfig(viewFx, fov),
      // -> null | { x, y, z, dist, ... }, or no function at all where the
      // engine cannot be asked: the aim then follows the hand's own
      // direction and no dot is drawn.
      raycast: engine.raycast ? (ox, oy, oz, dx, dy, dz, max) => engine.raycast(ox, oy, oz, dx, dy, dz, max) : null,
      later: null,
    };
  }
  const here = engine && engine.raycast ? (ox, oy, oz, dx, dy, dz, max) => engine.raycast(ox, oy, oz, dx, dy, dz, max) : null;
  return {
    playerState: () => sim.frame.playerState,
    toolState: () => sim.frame.toolState,
    floats: () => sim.frame.f32,
    input: (mx, mz, yaw, pitch, buttons, pressed, tool) => sim.input(mx, mz, yaw, pitch, buttons, pressed, tool),
    config: (viewFx, fov) => sim.command('playerConfig', viewFx, fov),
    raycast: here,
    // The same ray as a promise, where the engine is not here to be asked.
    later: !here && sim.ask ? (ox, oy, oz, dx, dy, dz, max) => sim.ask('raycast', ox, oy, oz, dx, dy, dz, max) : null,
  };
}
