// The rehearsal. The first frames with sound would otherwise run every code
// path cold and unoptimised: milliseconds, in the very frame something first
// blows up. So before the first sound, a throwaway mixer and director (on an
// offline context that is never rendered, with a stretch of silence standing
// in for every sound) are driven through a few seconds of synthetic events. The engine
// compiles and optimises the code the real pair will run: same classes, same
// object shapes (see fractions() in the mixer), same paths.
//
// The load varies on purpose: a burst of everything, a stretch of ordinary
// play, a quiet spell, over and over. Code is optimised for the paths it has
// seen, and falls back to the slow lane the first time it meets one it has
// not; a rehearsal that only ever saturated the mixer left "the bucket is
// full again" and "nothing is parked" to be discovered in the game.
import { EV, EV_STRIDE, TOOL, TOOL_STATE, VEHICLE_STATE, GAME, GAME_MODE, OBJ_STATE, REPLAY } from './engine.js';
import { VOICES, VOICE_STRIDE } from './audio_materials.js';
import { SOUNDS } from './audio_bank.js';
import { Mixer } from './audio_mix.js';
import { Director } from './audio_events.js';

// Events in a burst frame, frames in the whole rehearsal, and its cycle:
// burst frames, then sparse ones (an event or two every fourth frame), then
// silence until the cycle ends. The rehearsal ends on a long silence, so the
// rattle dies away, the bed closes and the token buckets fill up: the state
// the game is in most of the time.
const EVENTS = 24;
const FRAMES = 600;
const CYCLE = 48, BURST = 16, SPARSE = 36;
const QUIET_FROM = 432;
// How many kinds of event, tools and materials there are to go round.
const most = (table) => { let m = 0; for (const k in table) if (table[k] > m) m = table[k]; return m; };
const KINDS = most(EV), TOOLS = most(TOOL) + 1, MATERIALS = VOICES.length / VOICE_STRIDE;

/**
 * Returns { done, ms, run(budgetMs) }: run() rehearses until about budgetMs
 * of this thread have gone (Infinity: to the end) and returns true when the
 * rehearsal is complete. Returns null where there is no OfflineAudioContext.
 * `engine` answers the director's questions about the world (the sim's
 * acoustics, an engine, or nothing); `at` is where the listener stands,
 * [x, y, z, ..], when the caller knows; `real()` gives the frame the game
 * itself will hand the director (its state is then read in the quiet
 * stretch at the end, as it is, so that the real one is not a stranger to
 * the code that reads it).
 */
export function createRehearsal(engine, hrtf = false, at = null, real = null) {
  if (typeof OfflineAudioContext === 'undefined') return null;
  let mixer, director;
  try {
    const oc = new OfflineAudioContext(2, 128, 48000);
    // Three quarters of a second, so that voices overlap, the pools fill up
    // and stealing happens, as with real sounds (and at a low rate: 24 KB).
    const silence = oc.createBuffer(1, 6000, 8000);
    // (With a time budget, as the real mixer has, so that path is known too.)
    mixer = new Mixer(oc, { hrtf, budgetMs: 0.2 });
    for (let id = 0; id < SOUNDS.length; id++) mixer.setSound(id, new Array(SOUNDS[id].variants).fill(silence));
    director = new Director(mixer, engine);
  } catch (e) {
    return null;
  }
  const f32 = new Float32Array(16 + EVENTS * EV_STRIDE);
  // What a frame says beside its events (the director's state()): somebody
  // gets into a vehicle, drives it, slides, leans on a wall and gets out;
  // a blast deafens them and their ears open; a game's clock runs out.
  const vehicleState = new Float32Array(32), toolState = new Float32Array(32), game = new Float32Array(GAME.LEN), replay = new Float32Array(REPLAY.LEN);
  const flowing = new Float32Array(3);
  // (Two rectangles of standing water, as the water block has them: a pond
  // and a river.)
  const waters = new Float32Array(16);
  const frame = { steps: 1, seq: 0, vehicleState, toolState, game, replay, water: null, rivers: null, pace: undefined };
  const V = VEHICLE_STATE;
  const say = (k) => {
    frame.seq = k;
    // (And a stretch of slow motion: a step every fifth frame.)
    frame.steps = k >= 180 && k < 300 ? (k % 5 === 0 ? 1 : 0) : k % 7 === 0 ? 0 : k % 5 === 0 ? 2 : 1;
    // (In its first half the shell says how fast the world runs, as the
    // game's frame loop does: slow motion, and a world stopped for most of
    // a second with bombs in the air; in its second nobody says, as with a
    // tool, and the director reads the steps.)
    if (k < 216) {
      const held = k >= 120 && k < 165;
      frame.pace = held ? 0 : k >= 60 && k < 110 ? 0.2 : 1;
      if (held) frame.steps = 0; else if (frame.pace < 1) frame.steps = k % 5 === 0 ? 1 : 0;
    } else {
      frame.pace = undefined;
      if (k === 216) director.pace(-1);
    }
    const t = (k % 240) / 60, driving = t >= 0.5 && t < 3.2;
    vehicleState.fill(0);
    // (Every other time it is got out of, it was wrecked.)
    if (V.WRECKED !== undefined) vehicleState[V.WRECKED] = ((k + 48) / 480) | 0;
    if (driving) {
      vehicleState[V.DRIVING] = 1; vehicleState[V.KIND] = (k / 240) & 3; vehicleState[V.TOP_SPEED] = 20;
      vehicleState[V.SPEED] = 20 * (1 - Math.exp(-(t - 0.5))); vehicleState[V.THROTTLE] = t < 2.5 ? 1 : 0;
      vehicleState[V.GROUNDED] = t > 2.9 ? 0 : 4; vehicleState[V.WHEELS] = 4; vehicleState[V.COCKPIT] = (k / 480) & 1;
      vehicleState[V.HANDBRAKE] = t > 2.2 && t < 2.6 ? 1 : 0; vehicleState[V.STEER] = Math.sin(k * 0.1);
      vehicleState[V.RAMS] = (k / 97) | 0;
      if (V.SLIP !== undefined) { vehicleState[V.SLIP] = t > 2.2 && t < 2.6 ? 6 : 0; vehicleState[V.SLIP_MATERIAL] = k % MATERIALS; }
      if (V.EDGE !== undefined) vehicleState[V.EDGE] = t > 2.7 && t < 3 ? 1 : 0;
      if (V.PUSH !== undefined) { vehicleState[V.PUSH] = t > 1.2 && t < 1.8 ? (t - 1.2) * 1.5 : 0; vehicleState[V.HELD] = 1e4 * (1 + k % 900); }
    }
    director.horn = driving && t > 1 && t < 1.3;
    if (TOOL_STATE.SHOCK !== undefined) toolState[TOOL_STATE.SHOCK] = t > 3.3 ? Math.max(0, 0.8 - (t - 3.3) * 1.6) : 0;
    // (Water on the move, now and then, to one side.)
    flowing[0] = 200 * (1 + k % 400); flowing[1] = pos[0] + 6; flowing[2] = pos[2] - 3;
    frame.water = (k % 240) > 150 ? flowing : null;
    // (And a river by the listener, now and then.)
    waters[0] = pos[0] - 9; waters[1] = pos[2] - 9; waters[2] = pos[0] - 4; waters[3] = pos[2] - 4; waters[4] = pos[1] - 1;
    waters[8] = pos[0] + 5; waters[9] = pos[2] - 30; waters[10] = pos[0] + 25; waters[11] = pos[2] + 30; waters[12] = pos[1] - 2; waters[13] = 0.3 + (k % 90) * 0.03;
    frame.rivers = (k % 240) > 40 && (k % 240) < 170 ? waters : null;
    game[GAME.MODE] = k < 300 ? GAME_MODE.MAYHEM : GAME_MODE.NONE; game[GAME.STATE] = OBJ_STATE.RUNNING;
    game[GAME.TIME] = 5; game[GAME.CLOCK] = Math.min(5, k / 60);
  };
  const pos = [0, 0, 0];
  if (at || (engine && typeof engine.camera === 'function')) {
    const c = at || engine.camera();
    // (A camera that is not a number yet would only rehearse the guards.)
    const sum = c[0] + c[1] + c[2];
    if (sum - sum === 0) { pos[0] = c[0]; pos[1] = c[1]; pos[2] = c[2]; }
  }
  let k = 0, n = 0;
  const state = {
    done: false,
    ms: 0,
    run(budgetMs) {
      if (state.done) return true;
      const t0 = performance.now();
      do {
        const phase = k % CYCLE;
        const count = k >= QUIET_FROM ? 0 : phase < BURST ? EVENTS : phase < SPARSE && phase % 4 === 0 ? 1 + (k >> 2) % 2 : 0;
        // Every kind and material in turn, near and far, small and huge.
        for (let i = 0; i < count; i++, n++) {
          const p = 16 + i * EV_STRIDE;
          f32[p] = 1 + n % KINDS;
          f32[p + 1] = pos[0] + ((n * 37) % 61) - 30;
          f32[p + 2] = pos[1] + ((n * 11) % 7) - 2;
          f32[p + 3] = pos[2] + ((n * 53) % 83) - 41;
          // (A creak's is a ratio: under 1 a creak, 1 and over a frame going.)
          // (And a bomb's the seconds it has left to fall: a few, so that it whistles.)
          f32[p + 4] = f32[p] === EV.CREAK ? 0.75 + 0.5 * ((n >> 1) & 1) : f32[p] === EV.INCOMING ? 0.5 + n % 4 : 1 + (n * 97) % 5000;
          f32[p + 5] = n % MATERIALS;
          f32[p + 6] = n % (TOOLS + 1);
          f32[p + 7] = (n >> 3) % 3;
        }
        mixer.frame(k / 60, performance.now());
        mixer.setListener(pos, k * 0.02, 0);
        say(k);
        const mine = k >= QUIET_FROM && real !== null ? real() : null;
        director.state(mine || frame);
        director.frame(f32, 64, count, count);
        mixer.endFrame();
        k++;
      } while (k < FRAMES && performance.now() - t0 < budgetMs);
      state.ms += performance.now() - t0;
      state.done = k >= FRAMES;
      // The throwaway graph (two hundred nodes) can go now.
      if (state.done) { mixer = null; director = null; }
      return state.done;
    },
  };
  return state;
}
