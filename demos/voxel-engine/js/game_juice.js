// Moments: the two ways the game bends time so that a big event lands.
//   hit-stop    30 to 90 ms of stillness on a blast close by
//   the breath  about a second at a quarter speed on the decisive moment
//               (a structure levelled, a contract's target letting go)
// Both only scale how fast the simulation runs (game.timeScale); the player
// keeps the camera and the trigger throughout, and nothing here feeds back
// into the simulation. They follow the screen-shake setting: at 0 neither
// happens.
import { EV, EV_STRIDE, OUT } from './engine.js';

// A blast counts by yield (radius x power) and distance, as the camera
// shake does (game_feel.js). One this strong or more stops the world.
const STOP_FROM = 0.5;
const STOP_MIN = 0.03, STOP_PER = 0.06;
// At most one hit-stop in this long (s): a volley is not a slide show.
const STOP_EVERY = 0.5;
const BREATH_PACE = 0.25;
// The breath eases back to full speed over its last part (s).
const BREATH_OUT = 0.35;

export function createJuice(ctx, state, settings) {
  // [hold left, breath left, since last stop], real seconds.
  const S = new Float64Array([0, 0, 9]);
  let lastFrame = -1, lastTick = 0;
  state.pace = 1;

  return {
    reset() {
      S[0] = S[1] = 0;
      S[2] = 9;
      lastFrame = -1;
      lastTick = 0;
      state.pace = 1;
    },
    // Slow the world for `seconds` of real time.
    breathe(seconds) {
      if (settings.values.shake > 0 && seconds > S[1]) S[1] = seconds;
    },
    get holding() { return S[0] > 0; },
    get breathing() { return S[1] > 0; },

    // Once a tick. The real time that passed is read off the wall, not
    // taken from the tick (whose dt is capped): on a machine that draws
    // a frame every few seconds a breath of one second would otherwise
    // last ten frames, which is a minute.
    update() {
      const wall = performance.now();
      const dt = lastTick > 0 ? Math.max(0, (wall - lastTick) / 1000) : 0;
      lastTick = wall;
      S[2] += dt;
      if (S[0] > 0) {
        S[0] -= dt;
        state.pace = 0;
        return;
      }
      if (S[1] > 0 && !state.slow) {
        S[1] -= dt;
        const u = S[1] >= BREATH_OUT ? 0 : 1 - S[1] / BREATH_OUT;
        state.pace = BREATH_PACE + (1 - BREATH_PACE) * u * u;
        return;
      }
      S[1] = 0;
      state.pace = 1;
    },

    // The events of the steps since the last drawn frame.
    read(out) {
      const frame = out[OUT.STAT_FRAME];
      if (frame === lastFrame) return;
      lastFrame = frame;
      const n = out[OUT.EVENT_COUNT];
      if (n === 0 || !(settings.values.shake > 0)) return;
      const f = ctx.sim.frame.f32;
      const cam = ctx.renderer.cam.pos;
      let p = out[OUT.EVENTS_PTR] >> 2;
      let hit = 0;
      for (let i = 0; i < n; i++, p += EV_STRIDE) {
        if (f[p] !== EV.EXPLOSION) continue;
        const dx = f[p + 1] - cam[0], dy = f[p + 2] - cam[1], dz = f[p + 3] - cam[2];
        const mag = f[p + 4];
        const k = 1 - Math.sqrt(dx * dx + dy * dy + dz * dz) / (6 + 9 * mag);
        if (k <= 0) continue;
        const s = k * k * Math.min(1, 0.45 + 0.35 * mag * f[p + 6]);
        if (s > hit) hit = s;
      }
      if (hit >= STOP_FROM && S[2] >= STOP_EVERY) {
        // A length of the world's time, asked of whoever keeps its clock
        // (sim.hold: the worker engineer's): the pace stays 1, and on a
        // page that draws a frame every 300 ms the stop is still 30 to
        // 90 ms and not a frame. (A sim without it stands for a tick.)
        const stop = STOP_MIN + STOP_PER * hit;
        if (ctx.sim.hold) ctx.sim.hold(stop);
        else S[0] = stop;
        S[2] = 0;
      }
    },
  };
}
