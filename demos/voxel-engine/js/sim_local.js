// The simulation as the rest of the host sees it, and the transport that
// runs it on this thread.
//
// Nothing outside this file, main.js and the harness touches the wasm engine.
// The renderer, the game shell and the audio talk to a `Sim`:
//
//   sim.frame                 the newest frame (below). Ask for it each time:
//                             a transport may hand out another object, and
//                             views into it do not outlive it.
//   sim.input(moveX, moveZ, yaw, pitch, buttons, pressed, tool)
//   sim.look(yaw, pitch)
//   sim.command(name, ...args)  any method of Engine (engine.js) by name:
//                             'init', 'setCamera', 'playerConfig', 'explode'
//                             ... Fire and forget, applied before the next
//                             step. Returns the command's serial number; a
//                             frame whose `commands` has reached it shows the
//                             world after the command.
//   sim.serial                serial of the last command made
//   sim.after(serial, fn)     fn runs once a frame shows the world after that
//                             command: at once where commands apply at once,
//                             else when such a frame has come in
//   sim.flush()               a promise: everything asked so far shows in the
//                             frame (boot, before the frame loop runs)
//   sim.pending               a frame came in that has not been drawn
//   sim.remote                the engine runs on another thread
//   sim.palette()             256 materials x 8 bytes
//   sim.solidBits()           { sx, sy, sz, bits }: the scene's solid mask.
//                             Ask straight after 'init', as the renderer
//                             does: here the engine answers for the world
//                             as it stands, the worker transport with the
//                             mask its world came with.
//   sim.scorchMarks()         where the engine runs on this thread only: the
//                             blasts' marks as they stand (render_scorch.js)
//   sim.objectiveSpec(scene, i)
//   sim.sceneSurround(scene)  height (m) of the land around a scene's world
//   sim.planInfo(scene, i)    structure i of a scene's plans, or null
//   sim.jobInfo(scene, i)     contract i of a scene, or null
//   sim.ask(name, ...args)    a promise for what that method of Engine
//                             returns (a typed array as a copy), asked of
//                             the engine as the world stands when it gets
//                             there: for a question the frame does not
//                             answer (a ray, a replay's bytes). Not for
//                             what changes the world: that is a command.
//   sim.resync()              a frame whose quad runs cover every row, for a
//                             consumer that lost what it had mirrored: that
//                             frame at once where the transport can, else
//                             null and the next frame is one
//   sim.acoustics             { acousticOcclusion(lx, ly, lz, sx, sy, sz),
//                             acousticEnclosure(x, y, z) } as of the newest
//                             frame (sim_acoustics.js)
//   sim.advance(seconds)      main.js only: the time that has passed; returns
//                             the steps the next frame is ahead of the last
//   sim.prepare()             main.js only: the frame to draw now
//
// A frame:
//
//   out, u8, u32, f32         the 64-slot out block and views of the memory
//                             its pointer slots point into (OUT in engine.js),
//                             each view over the whole of one buffer
//   seq, steps, alpha         frames made so far, sim steps since the frame
//                             before, and how far the picture is between the
//                             last two steps
//   commands                  serial of the last command applied
//   camera                    the sim camera [x, y, z, yaw, pitch, fov]
//   camPrev, camCur           its position after the last two steps: what
//                             the picture interpolates between by `alpha`
//   playerState, toolState, structureStats, tally, objective, replay,
//   vehicleState, game        float views (PLAYER_STATE, TOOL_STATE, TALLY,
//                             OBJ, REPLAY, VEHICLE_STATE, GAME in engine.js)
//   runs, runStart(i), runRows(i), runWords(i), full
//                             quad rows that changed: run i is runRows(i)
//                             texture rows from row runStart(i), their words
//                             at u32[runWords(i)]. Rows outside the runs are
//                             not to be read. `full`: the runs cover every row.
//   occ, occAt                the AO density volume, whole: bytes of `occ`
//                             from `occAt`. Its dirty boxes are in the out
//                             block (OCC_DIRTY_PTR, OCC_DIRTY_LEN).
//   fine, fineAt              the fine quad stream, every row: words of
//                             `fine` from `fineAt`. The runs of rows that
//                             changed are in the out block (FINE_DIRTY_PTR,
//                             FINE_DIRTY_LEN, read through `u32`); FINE_PTR
//                             is for the frame's own use.
//   enclosure, eventSolid(i)  what the world does to sound heard where the
//                             picture is drawn from (camPrev to camCur by
//                             alpha): what encloses that point, and the
//                             solid between it and event record i
//
// `LocalSim` is the wasm on this thread and a frame straight out of its
// memory, nothing copied. It is what the harness drives: `sim.engine`,
// `step(n)` and `prepare(alpha)` are synchronous and deterministic. Its
// commands are applied at once and its per-frame state is read from the
// engine when asked for, so it is never behind. `WorkerSim` (sim_remote.js)
// is the same interface over an engine in a Web Worker, which runs one of
// these and sends its frames across as packets (sim_packet.js).
import { Engine, OUT, EV_STRIDE, QUAD_TEX_W, SIM_DT, REPLAY, REPLAY_MODE } from './engine.js';

const ROW_WORDS = QUAD_TEX_W * 2;
// Milliseconds of simulation one frame of the thread that draws may spend.
const SIM_BUDGET_MS = 10;
const MAX_STEPS = 4;
// The most the world's clock is ever told to stand, seconds (hold()).
export const HOLD_MOST = 0.25;

class LocalFrame {
  constructor(engine) {
    this._e = engine;
    this._made = -1;
    this._stepsAt = 0;
    this.out = null;
    this.u8 = this.u32 = this.f32 = null;
    this.seq = 0;
    this.steps = 0;
    this.alpha = 1;
    this.commands = 0;
    this.full = false;
    // (Doubles: a camera placed by setCamera is drawn from where it was put,
    // not from the nearest float.)
    this.camPrev = new Float64Array(3);
    this.camCur = new Float64Array(3);
  }

  // Views die when wasm memory grows, and a harness script may have called
  // the engine itself: look at what the engine holds now.
  _bind() {
    const e = this._e;
    e._views();
    const moved = this.u8 !== e.u8;
    if (moved) {
      this.u8 = e.u8;
      this.u32 = e.u32;
      this.f32 = e.f32;
    }
    if (e.prepared === 0) return this;
    const fresh = e.prepared !== this._made;
    if (fresh || moved) this.out = e.u32.subarray(e.outPtr >> 2, (e.outPtr >> 2) + OUT.LEN);
    if (fresh) {
      this._made = e.prepared;
      this.seq++;
      this.alpha = e.alpha;
      // A step counter that went back is a new world.
      const at = this.out[OUT.STAT_FRAME];
      this.steps = at >= this._stepsAt ? at - this._stepsAt : at;
      this._stepsAt = at;
      this.full = false;
    }
    return this;
  }

  get camera() { const e = this._e; return e._stateView('_camera', e.x.vx_camera(), 6); }
  get playerState() { return this._e.playerState(); }
  get toolState() { return this._e.toolState(); }
  get structureStats() { const e = this._e; return e._stateView('_structure', e.x.vx_structure_stats(), 8); }
  get tally() { return this._e.tally(); }
  get objective() { return this._e.objectiveState(); }
  get replay() { return this._e.replayState(); }
  get vehicleState() { return this._e.vehicleState(); }
  get game() { return this._e.gameState(); }

  get runs() { return this.full ? 1 : this.out[OUT.DIRTY_RUNS_LEN]; }

  runStart(i) {
    return this.full ? 0 : this.u32[(this.out[OUT.DIRTY_RUNS_PTR] >> 2) + i * 2];
  }

  runRows(i) {
    const rows = this.out[OUT.QUAD_ROWS];
    if (this.full) return rows;
    const p = (this.out[OUT.DIRTY_RUNS_PTR] >> 2) + i * 2;
    return Math.max(0, Math.min(this.u32[p + 1], rows - this.u32[p]));
  }

  runWords(i) {
    return (this.out[OUT.QUADS_PTR] >> 2) + this.runStart(i) * ROW_WORDS;
  }

  get occ() { return this.u8; }
  get occAt() { return this.out[OUT.OCC_PTR]; }
  get fine() { return this.u32; }
  get fineAt() { return this.out[OUT.FINE_PTR] >> 2; }

  // Where the picture is drawn from, and so where the audio listens: the
  // player's eye between its last two steps, or the director's camera
  // while a replay is shown (game_replay.js: camera).
  ear(i) {
    const p = this.out[OUT.REPLAY_PTR] >> 2;
    if (this.f32[p + REPLAY.MODE] !== REPLAY_MODE.OFF) return this.f32[p + REPLAY.CAM_X + i];
    return this.camPrev[i] + (this.camCur[i] - this.camPrev[i]) * this.alpha;
  }

  get enclosure() {
    return this._e.acousticEnclosure(this.ear(0), this.ear(1), this.ear(2));
  }

  eventSolid(i) {
    const f = this.f32, p = (this.out[OUT.EVENTS_PTR] >> 2) + i * EV_STRIDE;
    return this._e.acousticOcclusion(this.ear(0), this.ear(1), this.ear(2), f[p + 1], f[p + 2], f[p + 3]);
  }
}

// What an engine method returned, in a form that outlives the next engine
// call and crosses between threads: a view of engine memory as a copy.
export function answerOf(v) {
  return ArrayBuffer.isView(v) ? v.slice() : v;
}

export class LocalSim {
  // opts: { scene, seed, warm } (warm: false skips the warm-up).
  static async create(url, opts = {}) {
    const sim = new LocalSim(await Engine.load(url));
    sim.engine.init(opts.scene || 0, opts.seed === undefined ? 1 : opts.seed);
    if (opts.warm !== false) sim.engine.warmUp();
    return sim;
  }

  constructor(engine) {
    this.engine = engine;
    this.remote = false;
    // Why the engine is on this thread (main.js says).
    this.how = '';
    this._frame = new LocalFrame(engine);
    this._acc = 0;
    this._serial = 0;
    // Worlds this engine has been made to build since the first: an 'init',
    // or a replay beginning (which starts the engine over as an init does).
    this.worlds = 0;
    // What the steps of one advance() may cost (ms) when the caller names no
    // number of steps, and the smoothed cost of a step as measured here.
    this.budgetMs = SIM_BUDGET_MS;
    this.stepMs = 1;
    // False until the camera has a position to interpolate from.
    this._camSeen = false;
    // The alpha frames are prepared at when whoever steps this sim keeps
    // the time itself (poseAt()); under 0: by the time advance() has left.
    this._held = -1;
    // Seconds the world's clock is still to stand (hold()), and how much of
    // the last advance()'s time went to that.
    this._stop = 0;
    this.stood = 0;
    // (A frame that came in on its own and has not been drawn: never, here.)
    this.pending = false;
    this.acoustics = {
      acousticOcclusion: (lx, ly, lz, sx, sy, sz) => engine.acousticOcclusion(lx, ly, lz, sx, sy, sz),
      acousticEnclosure: (x, y, z) => engine.acousticEnclosure(x, y, z),
    };
  }

  get frame() { return this._frame._bind(); }

  input(moveX, moveZ, yaw, pitch, buttons, pressed, tool) {
    this.engine.input(moveX, moveZ, yaw, pitch, buttons, pressed, tool);
  }

  look(yaw, pitch) {
    this.engine.look(yaw, pitch);
  }

  command(name, ...args) {
    const f = this._frame;
    // (A step asked for as a command, by a tool through the worker
    // transport: one step of the sim, the camera followed as in step().)
    if (name === 'step') {
      this.step(1);
      // (And the frame after it is the step's own, until time passes
      // again: a tool that steps a world that stands is shown what it ran,
      // not whatever part of a step was left when the world stopped.)
      this._held = 1;
      return (f.commands = ++this._serial);
    }
    const answer = this.engine[name](...args);
    if (name === 'init' || (name === 'replayBegin' && answer)) {
      // A new world: no time owed, no camera to interpolate from.
      this._acc = 0;
      this._camSeen = false;
      this.worlds++;
    } else if (name === 'setCamera') {
      f.camPrev[0] = f.camCur[0] = args[0];
      f.camPrev[1] = f.camCur[1] = args[1];
      f.camPrev[2] = f.camCur[2] = args[2];
      this._camSeen = true;
    }
    return (f.commands = ++this._serial);
  }

  get serial() { return this._serial; }

  // Commands are applied as they are made: the frame already shows them.
  after(serial, fn) { fn(); }
  flush() { return Promise.resolve(); }

  ask(name, ...args) {
    try {
      return Promise.resolve(answerOf(this.engine[name](...args)));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  palette() { return this.engine.palette(); }
  solidBits() { return this.engine.solidBits(); }
  // The marks blasts have left, as they stand now (Engine.scorchMarks; a
  // view, to be read at once). Only this transport has them without waiting:
  // the renderer asks the other one with ask().
  scorchMarks() { return this.engine.scorchMarks ? this.engine.scorchMarks() : null; }
  objectiveSpec(scene, i) { return this.engine.objectiveSpec(scene, i); }
  sceneSurround(scene) { return this.engine.sceneSurround(scene); }
  planInfo(scene, i) { return this.engine.planInfo(scene, i); }
  jobInfo(scene, i) { return this.engine.jobInfo(scene, i); }

  resync() {
    const f = this.frame;
    if (f.out === null) return null;
    f.full = true;
    return f;
  }

  // Run n fixed steps now.
  step(n = 1) {
    const e = this.engine, f = this._frame, prev = f.camPrev, cur = f.camCur;
    for (let i = 0; i < n; i++) {
      prev[0] = cur[0]; prev[1] = cur[1]; prev[2] = cur[2];
      e.step(SIM_DT);
      const c = f.camera;
      cur[0] = c[0]; cur[1] = c[1]; cur[2] = c[2];
      if (!this._camSeen) { prev[0] = c[0]; prev[1] = c[1]; prev[2] = c[2]; this._camSeen = true; }
    }
  }

  // most: the steps this call may run (1 to 4); keep: how many of the steps
  // it does not run stay owed. Never spiral: time for more is dropped.
  //
  // With no `most`, the caller is the frame loop of the thread that draws
  // (main.js), and the sim decides. A frame that is late owes several steps;
  // running them all makes the next frame later still (four 40 ms steps are
  // a 6 fps game). So a frame runs as many steps as fit the sim's share of
  // it (`budgetMs`, going by what a step has been costing), at least one,
  // and the time it cannot afford is dropped: under heavy destruction the
  // game goes into slow motion instead of a slide show. One of the steps
  // not run stays owed all the same: frames that come 16.6 and 16.7 ms
  // apart owe no step, then two, and with the second of the two dropped
  // each time a sim whose steps cost 6 ms ran at two thirds of real time
  // though one step a frame is all it was ever asked for.
  //
  // The worker transport names the number itself (sim_remote.js,
  // stepsThatFit: what fits a display frame, since its steps cost the
  // picture nothing), and lets one step stay owed: a display whose frames
  // come a little early and a little late is owed no step, then two, and one
  // of the two is run a frame later rather than lost.
  advance(seconds, most = 0, keep = 0) {
    // No time has passed (the game is paused): nothing runs, not even a
    // step that is owed. It waits for time to pass again.
    this.stood = 0;
    if (!(seconds > 0)) return 0;
    this._held = -1;
    if (this._stop > 0) {
      // A stop asked for (hold()): that much of the time is not the world's.
      const use = Math.min(seconds, this._stop);
      this._stop -= use;
      this.stood = use;
      seconds -= use;
      if (!(seconds > 0)) return 0;
    }
    this._acc += seconds;
    let steps = Math.floor(this._acc / SIM_DT);
    this._acc -= steps * SIM_DT;
    if (!(most >= 1)) {
      most = Math.max(1, Math.floor(this.budgetMs / this.stepMs));
      // (Where it is the budget that says no. More than four steps due is
      // a stall, and its time is dropped whole, as it always was.)
      if (most < MAX_STEPS) keep = 1;
    }
    if (most > MAX_STEPS) most = MAX_STEPS;
    if (steps > most) {
      this._acc = keep > 0 ? this._acc + Math.min(steps - most, keep) * SIM_DT : 0;
      steps = most;
    }
    if (steps > 0) {
      const t0 = performance.now();
      this.step(steps);
      const per = (performance.now() - t0) / steps;
      // Quick to notice a step getting dearer, slow to believe it got cheap.
      this.stepMs += (per - this.stepMs) * (per > this.stepMs ? 0.5 : 0.1);
    }
    return steps;
  }

  // For a caller that steps with step() and keeps the time itself (the
  // sim's end of the worker transport when the clock is its own, and when
  // it plays a list of turns again): frames are prepared at this alpha from
  // now on, whoever prepares them, until advance() is given time again.
  poseAt(alpha) {
    this._held = alpha >= 0 ? Math.min(alpha, 1) : -1;
  }

  // The world's clock stands for the next `seconds` of time (a hit-stop:
  // game_juice.js). A debt: calls add up, to a quarter of a second at most,
  // and advance() pays it out of the time it is given before any step.
  hold(seconds) {
    if (seconds > 0) this._stop = Math.min(this._stop + seconds, HOLD_MOST);
  }

  // alpha: how far the picture is past the last step (the harness asks for
  // 1). No further than the step itself, whatever time is still owed.
  prepare(alpha = this._held >= 0 ? this._held : Math.min(this._acc / SIM_DT, 1)) {
    this.engine.prepareRender(alpha);
    const f = this.frame;
    if (!this._camSeen) {
      const c = f.camera;
      f.camPrev[0] = f.camCur[0] = c[0];
      f.camPrev[1] = f.camCur[1] = c[1];
      f.camPrev[2] = f.camCur[2] = c[2];
      this._camSeen = true;
    }
    return f;
  }
}
