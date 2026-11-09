// The sim's end of the worker transport: the engine behind a LocalSim, and a
// packet (sim_packet.js) posted back for every request. sim_worker.js runs
// one of these in a Web Worker; nothing here needs a worker to exist, so the
// Node checks run it in-process.
//
// Messages in:
//   { t: 'boot', url, scene, seed, warm, turns?, index? }
//   { t: 'ask', id, name, args }     a question for the engine (sim.ask)
//   { t: 'input', mode, mx, mz, yaw, pitch, buttons, pressed, tool }
//                                    the input, between two requests (no answer):
//                                    in before the next step
//   { t: 'hold', seconds }           the world's clock stands for that long (a
//                                    hit-stop), whoever keeps it
//   { t: 'here' }                    a frame of the page that had nothing else
//                                    to say while Fire is held (no answer)
//   { t: 'stand' }                   the page is no longer seen (a hidden tab):
//                                    a clock kept here stops until it asks again
//   { t: 'frame', id, dt, max, full, buf, mode, mx, mz, yaw, pitch, buttons,
//     pressed, tool, cmds }
//     dt     seconds that have passed since the request before (the page
//            keeps the clock: nothing is stepped but for its requests)
//     own    the worker keeps the clock instead (see below); dt is then
//            not read
//     rate   with own: game seconds a second of the clock (1 normal, 0.2
//            slow motion, 0 the game stands)
//     every  with own: how far apart the page's frames have been coming (ms)
//     max    steps to run at most (1..4); of the time for more, one step
//            stays owed and the rest is dropped
//     full   the packet must hold every quad row
//     buf    a packet buffer to fill again, or null
//     mode   1: the input fields are a sim.input(...); 2: yaw and pitch are a
//            sim.look(...); 0: neither
//     cmds   null or [[serial, name, ...args], ...], applied in order before
//            anything else
// Messages out (packet buffers, the AO volume, the acoustic map and the solid
// mask transferred;
// sim_worker.js itself posts { t: 'hello' } first, when its script runs):
//   { t: 'ready', id: 0, buf, occ, sound, fine?, solid, palette, specs, surround, plans, jobs }
//   { t: 'frame', id, buf, occ?, sound?, fine?, solid? }
//   { t: 'answer', id, value } or { t: 'answer', id, error }
//   { t: 'error', message, stack }   the engine trapped; nothing more is sent
//
// One request, one prepare_render, one packet: the engine's event buffer is
// drained once per packet and no record is lost or sent twice.
//
// WHO KEEPS THE CLOCK. A request with `own` hands the clock to this side:
// from then on the world is stepped here as time passes, at `rate`, whether
// or not the page asks for anything, and a request is answered at once with
// the world as it stands (the steps run since the last packet, and the
// part of a step that has passed as alpha). How often the page draws then
// says how often the world is shown, not how fast it runs: a page held to
// three frames a second by its graphics card shows a world that kept time.
// The rules, all of them here:
//
//   - Time is counted on this thread's clock, from one turn to the next,
//     and only up to LEASH_MS after the page was last heard from. A page
//     that has stopped asking (a hidden tab, a frame loop that stood) has a
//     world that stops within that time and goes on from where it stopped,
//     with no time owed for the silence.
//   - Of the time counted, OWED_MOST seconds are kept at most: two steps
//     and a half (a timer that fires a few milliseconds late loses
//     nothing). A machine whose steps take longer than a sixtieth of a
//     second runs one step after another and the world is in slow motion;
//     the time it cannot run is dropped, never caught up, as the page
//     drops it when it keeps the clock.
//   - A request runs the steps that are due (up to `max`), with the input
//     it brought, if none has been run since the last packet: a page that
//     asks every frame has its steps run as its requests come, and what a
//     click does is in the answer to the request that carried it, as it is
//     when the page keeps the clock. (A request that comes a quarter of a
//     step early still runs its step: the time is owed back.)
//   - The timer runs a step when two are owed, one step a turn: that is,
//     when no request has come to run the first. A page that draws three
//     times a second has its world stepped sixty times a second by the
//     timer, and whatever it sends (input, commands, a request, a
//     question) is read between two steps, in the order sent.
//   - Input and commands take effect when their request is read: before
//     the next step, whichever of the two runs it.
//   - A request without `own` takes the clock back: nothing is stepped
//     between the page's requests after it.
//   - 'hold' makes the clock stand for so many seconds (a hit-stop): time
//     that passes is first paid into that, and neither run nor counted as
//     asked for.
//   - 'stand' stops the clock at once, with nothing owed for what follows:
//     the page sends it when it is hidden, where no frame would come to say
//     so and the leash would let the world run on unseen.
//
// Every turn, the page's or the timer's, goes through _frame(): a tool that
// wraps it (to slow this thread down, to count) has all of the stepping.
//
// THE TURNS, WRITTEN DOWN. Booted with `turns`, this side keeps a list of
// what it did, turn by turn: the boot, each request (its input and commands,
// the steps run for it, the alpha its packet was made at), input that came
// between two requests, and each turn of the timer (its steps). play() does one entry of such a list again. Two
// engines given the same list hold the same world after every entry, and
// make the same packets: what a check compares a worker's session by,
// whoever kept the clock in it (worker_check.mjs).
import { BUTTON, OUT, SIM_DT } from './engine.js';
import { LocalSim, answerOf, HOLD_MOST } from './sim_local.js';
import { PacketWriter } from './sim_packet.js';
import { quadLuts } from './quad_luts.js';

// Scene ids whose objectives and surrounding land are sent ahead (the host
// asks synchronously).
const SPEC_SCENES = 16;
// With the clock here: how long after the page was last heard from time
// still passes (ms), and the most game time that is kept owed (seconds).
// Three quarters of a second: a page that draws twice a second (the slowest
// picture anyone has reported playing at) is heard from every half second,
// and a page whose thread stands for seconds (a tier's shaders being
// linked at the start of play on a slow processor did, for three) has a
// world that ran that much of it unseen and no more.
export const LEASH_MS = 750;
// A page that says its frames come further apart than that (request field
// `every`, ms) is given two and a half of its frames, up to this (a long
// frame may put its request off by one): a picture at one frame a second
// still has a world that keeps time.
const LEASH_MOST = 2000;
const OWED_MOST = 2.5 * SIM_DT;
// When the timer steps: once two steps are owed, which a page that asks
// every frame never lets happen (its requests run the steps). And how much
// short of a whole step's time a request may be and still run the step
// (a frame that came a millisecond early).
const TIMER_AT = 2 * SIM_DT;
const EARLY = 0.25 * SIM_DT;
// And once a request has run a step early, how early the next may: half a
// step. With one allowance the phases a request may leave the clock in
// are a band exactly one step wide, and a display is never the sim's 60
// to the hertz: the phase drifts to the band's edge, where the frames'
// own unevenness (a millisecond) decides between one step more and one
// fewer, request after request, two steps and none in turn. The picture's
// time then goes in strides of 0.74 and 1.26 steps, and what the hands do
// in a request that runs none is seen a frame later (a minute of play on
// the page: 13 to 244 requests of 4,200 ran none; the third critic: 5
// presses of 180 a frame late). With the wider allowance behind it, a
// phase that has crossed the edge (by one request of two steps, or of
// none) is a quarter of a step inside, not on it.
const EARLY_ON = 0.5 * SIM_DT;
// But only for a page whose frames are a whole number of steps apart (60,
// 30, 20 a second), within this much of a step: there what is owed after
// a request is the same frame after frame, early or not, and the
// picture's time (the step before the last plus what is owed of the
// next, never under none) goes evenly. Anywhere else (a display at 75,
// 120 or 144, a page at 50 or 45, slow motion) a step run early leaves
// less than nothing owed in one frame of every few, and the picture
// stands and then leaps: a quarter to a third of all frames more than
// 0.12 of a step off their stride, measured (sim_pace_check). There a
// step is run when it is due.
const EVEN = 0.12;
// How long before a request reaches this thread the frame it was made in
// may have begun, and still be the time the world is counted up to (ms):
// a callback that ran late, a page that is busy. A time further back than
// that, or ahead of this thread's clock by more than the clocks' own
// coarseness, is not believed (a tool that makes its own frames; a page
// whose thread stood): the request counts up to its arrival, as before.
const FRAME_BEHIND = 50, FRAME_AHEAD = 2;
// And how long a request may have waited for this thread, from when the
// page sent it, for the frame's time still to be the picture's (ms).
// Longer, and it is this thread that is late (a step that took a frame
// and more): the picture is of now, as it was. A CALLBACK that ran late
// is another matter: the page's thread stood a frame or two, the timer
// here ran the world on, and the frame is still shown for its own time
// where that can be had (below).
const FRAME_WAITED = 10;
// When a hold is no longer vouched for: the page has not been heard for
// longer than it normally takes between frames. One and a half times what
// it has lately taken: its frame as it gives it (`every`, which follows a
// change of pace over several frames) or, if longer, the middle one of the
// last three gaps between two of its words as heard here (which has a
// change of pace at its second frame, and is not moved by one long frame:
// a picture that comes four times a second with a frame of a second among
// them now and then is a picture four times a second, and with the longest
// of the three a pinch let go behind such a frame was held through it,
// 0.9 s and a second rocket; the VR engineer, 16 Oct 02:32). Never less
// than three frames of a display.
// While Fire is down every frame of the page says something, a request,
// the input or 'here', so silence past that is a stall of the page's
// thread, and the release may be waiting behind it.
const UNHEARD_FRAMES = 1.5;
const UNHEARD_LEAST_MS = 50;
// (Two words closer together than this are one frame's.)
const SAME_FRAME_MS = 4;
// The mesher's time before a packet: half of what the steps behind it
// left of their sixtieths of a second, between these (ms). 1.5 is what
// the engine gives it by itself, a figure from the days when the page's
// thread paid for it and had a picture to draw in the same frame; this
// thread has only the steps, and where they are cheap the stale chunks of
// a collapse are meshed in half as many packets (perf's ledger 27:
// Broadway 83 -> 38 stale chunks on average, 28 -> 11 packets at worst).
// Where the steps take all of their time there is none to give, and the
// engine's own share of the steps' time acts instead. It is the drawing
// side: nothing a step reads.
const MESH_SHARE = 0.5;
const MESH_LEAST_MS = 1.5;
const MESH_MOST_MS = 6;
// A turn of this side's own (never a message).
const TURN = { t: 'frame', turn: true };

// fn after `ms` (at once: after what is already waiting to be read). In a
// worker "at once" is a message to itself: a timer of no delay is held to
// four milliseconds once a few have followed one another, which is a
// quarter of a step.
function laterOn() {
  let port = null;
  const due = [];
  if (typeof MessageChannel !== 'undefined' && typeof WorkerGlobalScope !== 'undefined') {
    const ch = new MessageChannel();
    ch.port1.onmessage = () => { const fn = due.shift(); if (fn) fn(); };
    port = ch.port2;
  }
  return (fn, ms) => {
    if (ms > 0 || !port) setTimeout(fn, Math.max(0, ms));
    else { due.push(fn); port.postMessage(0); }
  };
}

export class SimServer {
  // post(message, transfer). load(url, opts) -> Promise<LocalSim>.
  // opts: { clock, later } (ms now, and fn after ms: the checks bring theirs).
  constructor(post, load = (url, opts) => LocalSim.create(url, opts), opts = {}) {
    this._post = post;
    this._load = load;
    this._writer = new PacketWriter();
    this.sim = null;
    this._applied = 0;
    this._dead = false;
    this._index = false;
    // The clock, when it is kept here: game seconds a second (0: it is
    // not), until when time passes without word from the page and up to
    // when it has been counted (ms), the game time owed (s), the steps run
    // since the last packet and what they took (ms), and which of the
    // turns planned is the one that still counts.
    this._clock = opts.clock || (() => performance.now());
    // ?weak=<ms> (main.js; 0 as shipped): every step is made to cost at
    // least so many ms, as on a machine too weak for the world: for
    // looking at what the picture does then, on a machine that is not.
    this._weak = 0;
    // (What a page's time is less by on this thread's clock: each thread's
    // clock starts at its own beginning. A check's clocks are one.)
    this._origin = opts.origin !== undefined ? opts.origin : opts.clock ? 0 : performance.timeOrigin;
    this._later = opts.later || laterOn();
    this._rate = 0;
    this._until = 0;
    this._at = -1;
    this._owed = 0;
    // (The last request left the clock ahead of the time passed: EARLY_ON.)
    this._early = false;
    // Game seconds the clock has counted since the last request (EVEN).
    this._gain = 0;
    this._ran = 0;
    this._ranMs = 0;
    // Game seconds the clock has asked for since the last packet, run or not.
    this._span = 0;
    // Seconds the clock is still to stand (a hit-stop: 'hold').
    this._stop = 0;
    this._plan = 0;
    // The hands as the page last gave them (move x and z, yaw, pitch,
    // buttons, tool), when the page was last heard (ms), its frame as it
    // last gave it (ms), and whether the engine has been told that the
    // buttons are not vouched for (UNHEARD).
    this._in = [0, 0, 0, 0, 0, 0];
    this._heardAt = -1;
    this._gaps = [0, 0, 0];
    this._every = 0;
    this._unheard = false;
    // A request's commands had a tool's step among them (window.__vx.step).
    this._tooled = false;
    // Steps this side ran on a timer, and on a request (for the checks).
    // (dropped: game seconds not run because more than OWED_MOST was owed;
    // silent: ms of the clock not counted because the page had not been
    // heard from for LEASH_MS; unheard: steps run with Fire held and the
    // page not heard, in which nothing fired on the strength of the hold.)
    this.stats = { timed: 0, asked: 0, dropped: 0, silent: 0, unheard: 0 };
    // What was done, turn by turn, when the boot asks for it (see above).
    this.turns = null;
  }

  // One entry of a list of turns, done again: the same input, commands and
  // steps, and for a request the same packet (posted as its answer was).
  async play(t, buf = null) {
    if (t.boot) {
      await this._boot(t.boot);
      return;
    }
    const sim = this.sim;
    if (t.turn) {
      sim.step(t.steps);
      return;
    }
    if (t.input) {
      this._told(t);
      return;
    }
    const world = this._told(t);
    if (t.steps > 0) sim.step(t.steps);
    // (Held: a page that draws this sim itself meanwhile, as the check's
    // does, prepares the same frame again and not one of its own time.)
    sim.poseAt(t.alpha);
    sim.prepare();
    if (world || t.full) sim.resync();
    this._reply('frame', t.id, world, 0, 0, buf, null, t.steps);
  }

  // The input and the commands of a request, in. True if they made a new
  // world (an 'init', or a replay that began: the engine started over, and
  // the new world gets the input again with the next request).
  _told(m) {
    const sim = this.sim, worlds = sim.worlds;
    // The input first: it is what the page last said, and the commands were
    // made after it (a tool's steps, asked for as commands, are run with the
    // input given just before them, as they are on the page's thread).
    const v = this._in;
    if (m.mode === 1) {
      sim.input(m.mx, m.mz, m.yaw, m.pitch, m.buttons, m.pressed, m.tool);
      v[0] = m.mx; v[1] = m.mz; v[2] = m.yaw; v[3] = m.pitch; v[4] = m.buttons; v[5] = m.tool;
      // (The engine has the buttons as the page gives them again.)
      this._unheard = false;
    } else if (m.mode === 2) {
      sim.look(m.yaw, m.pitch);
      v[2] = m.yaw; v[3] = m.pitch;
    }
    if (m.cmds) {
      for (const c of m.cmds) {
        sim.command(c[1], ...c.slice(2));
        this._applied = c[0];
        if (c[1] === 'step') this._tooled = true;
      }
    }
    return sim.worlds !== worlds;
  }

  // A request as the list of turns keeps it: what it said, the steps run
  // for it and the alpha its packet was made at.
  _note(m, steps) {
    if (!this.turns) return;
    this.turns.push({ id: m.id, mode: m.mode, mx: m.mx, mz: m.mz, yaw: m.yaw, pitch: m.pitch, buttons: m.buttons, pressed: m.pressed, tool: m.tool,
      cmds: m.cmds ? m.cmds.map((c) => c.slice()) : null, full: !!m.full, steps, alpha: this.sim.frame.alpha });
  }

  async receive(m) {
    if (this._dead) return;
    try {
      // (Whatever it says, the page's thread is alive.)
      if (m.t !== 'boot') this._hear();
      if (m.t === 'boot') await this._boot(m);
      else if (m.t === 'frame') this._frame(m);
      else if (m.t === 'ask') this._ask(m);
      else if (m.t === 'stand') this._stand();
      else if (m.t === 'input') this._input(m);
      else if (m.t === 'hold') this._hold(m);
    } catch (e) {
      this._trapped(e);
    }
  }

  // A trap leaves the engine in no state to go on from.
  _trapped(e) {
    this._dead = true;
    this._rate = 0;
    this._post({ t: 'error', message: String((e && e.message) || e), stack: e && e.stack ? String(e.stack) : '' }, []);
  }

  async _boot(m) {
    const sim = this.sim = await this._load(m.url, { scene: m.scene, seed: m.seed, warm: m.warm });
    if (m.turns) this.turns = [{ boot: { ...m, turns: false } }];
    // What each packet's quad rows changed in the quad lists goes with
    // it, and the page's lists take that instead of reading the rows
    // (render_geom.js). The engine keeps those books beside the rows
    // (Engine.quadDelta; the frame engineer's) once it has been told the
    // materials' kinds: they stay with the instance, so a new world needs
    // nothing and a worker started again tells them again. `index: false`
    // in the boot leaves it out, and the engine is then never asked.
    this._index = m.index !== false;
    this._weak = m.weak > 0 ? Math.min(m.weak, 250) : 0;
    if (this._index) sim.engine.quadKinds(...quadLuts(sim.engine.palette()));
    const e = sim.engine;
    // The whole world meshed before the first picture, behind the start card.
    e.remeshAll();
    const specs = {}, surround = {}, plans = {}, jobs = {};
    for (const scene of new Set([...Array(SPEC_SCENES).keys(), m.scene >>> 0])) {
      surround[scene] = e.sceneSurround(scene);
      const built = [];
      for (let i = 0; ; i++) {
        const p = e.planInfo(scene, i);
        if (!p) break;
        built.push(p);
      }
      if (built.length) plans[scene] = built;
      const board = [];
      for (let i = 0; ; i++) {
        const j = e.jobInfo(scene, i);
        if (!j) break;
        board.push(j);
      }
      if (board.length) jobs[scene] = board;
      const list = [];
      for (let i = 0; ; i++) {
        const s = e.objectiveSpec(scene, i);
        if (!s) break;
        list.push(s);
      }
      if (list.length) specs[scene] = list;
    }
    const palette = e.palette().slice();
    sim.prepare();
    sim.resync();
    this._reply('ready', 0, true, 0, 0, null, { palette, specs, surround, plans, jobs });
  }

  // (A method the engine has not is the asker's mistake and is answered as
  // one; anything thrown by the engine itself is a trap, as in a frame.)
  _ask(m) {
    const e = this.sim.engine;
    if (typeof e[m.name] !== 'function') {
      this._post({ t: 'answer', id: m.id, error: `the engine has no ${m.name}()` }, []);
      return;
    }
    const value = answerOf(e[m.name](...m.args));
    this._post({ t: 'answer', id: m.id, value }, ArrayBuffer.isView(value) ? [value.buffer] : []);
  }

  _frame(m) {
    if (m.turn) {
      this._turn();
      return;
    }
    const sim = this.sim, world = this._told(m);
    if (m.own) {
      this._asked(m, world);
      return;
    }
    // The page keeps the clock: nothing more is stepped on this side's own.
    // (A tool's step there: the sim holds its own pose, LocalSim.command.)
    this._tooled = false;
    this._rate = 0;
    this._plan++;
    const t0 = performance.now();
    // A new world starts at its first step, looking where its scene says:
    // the time sent with the request is from before it.
    // (A stop asked for: that much of the page's time is not the world's.)
    const stop = world ? 0 : Math.min(m.dt > 0 ? m.dt : 0, this._stop);
    this._stop = world ? 0 : this._stop - stop;
    const paced = world ? 0 : sim.advance(m.dt - stop, m.max >= 1 && m.max < 4 ? m.max : 4, 1);
    const t1 = performance.now();
    this._mesh(paced, t1 - t0);
    sim.prepare();
    if (world || m.full) sim.resync();
    this._note(m, paced);
    this._reply('frame', m.id, world, t1 - t0, performance.now() - t1, m.buf, null, paced);
  }

  // --- The clock kept here -----------------------------------------------

  // Time up to `now` becomes game time owed: at the rate that held, as far
  // as the leash reached, and no more than OWED_MOST of it.
  _count(now) {
    const at = this._at;
    this._at = now;
    if (!(this._rate > 0) || at < 0) return;
    // (A stop asked for comes off first: it is neither the world's time
    // nor time the world was asked for.)
    const stop = Math.min(now - at, this._stop * 1000);
    this._stop -= stop / 1000;
    this._span += (now - at - stop) * this._rate / 1000;
    const ran = Math.max(0, Math.min(now, this._until) - Math.min(at, this._until) - stop);
    this.stats.silent += Math.max(0, now - at - stop - ran);
    if (!(ran > 0)) return;
    this._gain += ran * this._rate / 1000;
    const owed = this._owed + ran * this._rate / 1000;
    if (owed > OWED_MOST) this.stats.dropped += owed - OWED_MOST;
    this._owed = Math.min(owed, OWED_MOST);
  }

  // A word from the page, and how long it was since the one before.
  _hear() {
    const now = this._clock(), gap = this._heardAt >= 0 ? now - this._heardAt : 0;
    this._heardAt = now;
    if (gap < SAME_FRAME_MS) return;
    const g = this._gaps;
    g[0] = g[1];
    g[1] = g[2];
    g[2] = Math.min(gap, LEASH_MOST);
  }

  // Before steps are run: is the hold vouched for? A stall of the page
  // never fires a shot the player did not ask for and never drops what is
  // held. So when the page has not been heard for longer than it normally
  // takes between frames and Fire was down when it was last heard, the
  // engine is told the buttons as they were with UNHEARD beside them: a
  // tool that fires again while held fires nothing more, a tool that
  // holds keeps its hold (tools.rs), and no button has gone up or down,
  // so nothing is pressed anew when the bit goes again. It goes with the
  // page's next word, or here, before the first step run after it. What
  // the engine is told is written down as input between two requests, so
  // the turns played again tell it the same.
  _vouch(now) {
    const v = this._in, held = (v[4] & BUTTON.PRIMARY) !== 0;
    const g = this._gaps, middle = Math.max(Math.min(g[0], g[1]), Math.min(Math.max(g[0], g[1]), g[2]));
    const usual = Math.max(this._every, middle);
    const quiet = held && this._heardAt >= 0 && now - this._heardAt > Math.max(UNHEARD_LEAST_MS, UNHEARD_FRAMES * usual);
    if (quiet) this.stats.unheard++;
    if (quiet === this._unheard) return;
    this._unheard = quiet;
    const buttons = v[4] | (quiet ? BUTTON.UNHEARD : 0);
    this.sim.input(v[0], v[1], v[2], v[3], buttons, 0, v[5]);
    if (this.turns) this.turns.push({ input: true, mode: 1, mx: v[0], mz: v[1], yaw: v[2], pitch: v[3], buttons, pressed: 0, tool: v[5] });
  }

  // Before a prepare: the mesher's budget for it, from what `steps` steps
  // that took `ms` left of their time (none run: a step's time whole).
  _mesh(steps, ms) {
    const left = SIM_DT * 1000 - (steps > 0 ? ms / steps : 0);
    this.sim.engine.remeshBudget(Math.max(MESH_LEAST_MS, Math.min(MESH_SHARE * left, MESH_MOST_MS)));
  }

  // Up to `most` of the steps that are owed (one that is within `early`
  // seconds of being owed counts). Returns how many were run.
  _run(most, early = 0) {
    const n = Math.min(Math.floor((this._owed + early) / SIM_DT + 1e-9), most);
    if (!(n > 0)) return 0;
    const t0 = this._clock();
    this.sim.step(n);
    // (?weak: this thread waits out what is left of the cost asked for.)
    if (this._weak > 0) for (const until = t0 + n * this._weak; this._clock() < until;);
    // (Under 0 after a step run early: that much less is owed next time.)
    this._owed -= n * SIM_DT;
    this._ran += n;
    this._ranMs += this._clock() - t0;
    return n;
  }

  // A request of a page that has given the clock away (its input and
  // commands are in): the world as it stands, now.
  _asked(m, world) {
    const sim = this.sim, now = this._clock();
    let here = 0;   // steps run in this turn
    let lent = 0;   // game seconds counted that are not this picture's (below)
    // The world's time is counted up to the time the display gave the
    // page's frame (`at`), not up to now: the picture made of this packet
    // is shown at the display's next beat whenever the page's callback
    // ran and however long the request took to get here. The leash, the
    // stall rule and the timer go by this thread's own clock.
    const at = m.at > 0 ? m.at - this._origin : NaN;
    const sent = m.sent > 0 ? m.sent - this._origin : NaN;
    const framed = at - now <= FRAME_AHEAD && now - at <= FRAME_BEHIND && now - sent <= FRAME_WAITED, to = framed ? Math.min(at, now) : now;
    // What is counted already is not taken back (a turn of the timer's
    // that came between the frame's beginning and its request: with a
    // callback 3 ms late at 72 a second the timer is due a tenth of a
    // millisecond before the request arrives). But that much of it,
    // `beyond` (game seconds), is not this picture's: the steps due and
    // the place of the picture between two steps are reckoned without it,
    // and it stays owed for the next. (Left in, the picture was 0.18 of a
    // step ahead of its beat for that one frame.)
    const beyond = framed && this._rate > 0 && this._at > to ? (this._at - to) * this._rate / 1000 : 0;
    this._count(Math.max(to, this._at));
    this._rate = m.rate > 0 ? Math.min(m.rate, 4) : 0;
    this._every = m.every > 0 ? m.every : 0;
    this._until = now + Math.max(LEASH_MS, Math.min(2.5 * this._every, LEASH_MOST));
    // (Whichever way the request goes from here: a turn that runs no step
    // places the picture too.)
    if (!world) {
      // (No more of it than is owed: a step the timer has run is run.
      // The picture is then at that step and no earlier, and stands
      // there until a frame's own time has come up to it.)
      lent = Math.min(beyond, Math.max(this._owed, 0));
      this._owed -= lent;
    }
    if (world) {
      // A new world starts at its first step: time from before it is not its.
      this._owed = 0;
      this._ran = 0;
      this._ranMs = 0;
      this._span = 0;
      this._stop = 0;
    } else if (!(this._rate > 0)) {
      // The game stands. What is owed stays owed, but no more than the step
      // the picture is on its way to: it goes on from there. (A tool that
      // stepped the standing world with this request, window.__vx.step, is
      // shown the step it ran: the same picture whatever part of a step
      // was left when the world stopped. Bodies in flight were drawn up to
      // a step back from it otherwise, by an accident of timing, and so on
      // either transport: look's finding, 16 October 05:50.)
      this._owed = this._tooled ? SIM_DT : Math.min(this._owed, SIM_DT);
      lent = 0;
    } else if (this._ran === 0 || this._owed < TIMER_AT - 1e-9) {
      // A step due or more: now, with what this request brought. (Not
      // when the timer has run since the last packet AND two steps are
      // owed still: a worker that is behind has news in the packet as it
      // is, and the page is not kept waiting for another step. But when
      // the timer ran only because one frame came late, the step that is
      // due is run here: left to the timer, it fires a hair before every
      // request from then on, each request finds a step already run and
      // runs none, and everything the hands do is seen a frame later for
      // as long as the frames stay regular: a click two frames on instead
      // of one, in one run of four of worker_hard's latency row.)
      this._vouch(now);
      // (How far apart the page's frames are, in steps: as the page gives
      // it, which follows its pace over several frames; one frame's own
      // time is too rough a word for it, and a page at 60 whose frames
      // come 15 and 19 ms apart would be called even and uneven in turn.
      // A host that does not say: the game time since its last request.)
      const since = (this._every > 0 ? this._every * this._rate / 1000 : this._gain) / SIM_DT, whole = Math.round(since);
      const even = whole >= 1 && Math.abs(since - whole) <= EVEN;
      here = this._run(m.max >= 1 && m.max < 4 ? m.max : 4, even ? (this._early ? EARLY_ON : EARLY) : 0);
      this.stats.asked += here;
    }
    this._gain = 0;
    // (Early: the clock is ahead of the time that has passed. Only a
    // request's own steps leave it so; a step of the timer's is run when
    // it is due and more.)
    this._early = this._owed < 0;
    this._tooled = false;
    const t1 = this._clock();
    // (The picture: as far past the step before the last as time is past the last.)
    sim.poseAt(Math.max(0, Math.min(this._owed / SIM_DT, 1)));
    this._owed += lent;
    this._mesh(this._ran, this._ranMs);
    sim.prepare();
    if (world || m.full) sim.resync();
    this._note(m, here);
    const ran = this._ran, ranMs = this._ranMs, span = this._span;
    this._ran = 0;
    this._ranMs = 0;
    this._span = 0;
    this._reply('frame', m.id, world, ranMs, this._clock() - t1, m.buf, null, ran, span);
    this._next();
  }

  // The world's clock stands for m.seconds more (to HOLD_MOST): off the
  // time counted here when the clock is this side's, off the time the
  // page's next requests bring when it is the page's.
  _hold(m) {
    if (!(m.seconds > 0)) return;
    if (this._rate > 0) this._count(this._clock());
    this._stop = Math.min(this._stop + m.seconds, HOLD_MOST);
    if (this._rate > 0) this._next();
  }

  // The hands, between two requests: in before the next step.
  _input(m) {
    this._told(m);
    if (this.turns) this.turns.push({ input: true, mode: m.mode, mx: m.mx, mz: m.mz, yaw: m.yaw, pitch: m.pitch, buttons: m.buttons, pressed: m.pressed, tool: m.tool });
  }

  // The page is not seen: time up to now counts, none after it, until the
  // next request names a rate again.
  _stand() {
    this._count(this._clock());
    this._rate = 0;
    this._plan++;
  }

  // A turn of the timer: the step that has come due.
  _turn() {
    if (!(this._rate > 0)) return;
    const now = this._clock();
    this._count(now);
    // (Fired early, or a request ran the step meanwhile: not yet.)
    const due = this._owed >= TIMER_AT - 1e-9;
    if (due) this._vouch(now);
    const n = due ? this._run(1) : 0;
    if (n > 0) this._early = false;
    this.stats.timed += n;
    if (n > 0 && this.turns) this.turns.push({ turn: true, steps: n });
    this._next();
  }

  // The next turn of the timer, when two steps will be owed: none while the
  // game stands, and none past the leash (the page's next word plans it).
  _next() {
    const plan = ++this._plan;
    if (!(this._rate > 0)) return;
    const now = this._clock();
    // (Time since it was last counted is not in `_owed` yet.)
    const wait = (TIMER_AT - this._owed) * 1000 / this._rate + this._stop * 1000 - (now - this._at);
    if (now + Math.max(wait, 0) >= this._until) return;
    this._later(() => {
      if (plan !== this._plan || this._dead) return;
      try {
        this._frame(TURN);
      } catch (e) {
        this._trapped(e);
      }
    }, wait);
  }

  // paced: the steps the clock ran (those `stepMs` is the time of).
  // asked: game seconds a clock kept here asked for since the last packet.
  _reply(t, id, world, stepMs, prepareMs, buf, extra, paced = 0, asked = -1) {
    const sim = this.sim, w = this._writer;
    if (world) w.reset();
    // (The mask is built by the engine, which may grow its memory doing so:
    // before the packet is filled, not after.)
    const solid = world ? sim.engine.solidBits() : null;
    const packet = w.write(sim, buf || null, { commands: this._applied, request: id, world, stepMs, prepareMs, paced, asked, index: this._index });
    const msg = { t, id, buf: packet }, transfer = [packet];
    if (w.whole) {
      // (An engine call: after everything that reads the frame.)
      const v = w.wholes(sim);
      msg.occ = v.occ;
      msg.sound = v.sound;
      transfer.push(v.occ, v.sound);
    }
    if (w.fine) {
      msg.fine = w.fine;
      transfer.push(w.fine);
    }
    if (solid) {
      msg.solid = solid;
      transfer.push(solid.bits.buffer);
    }
    if (extra) Object.assign(msg, extra);
    this._post(msg, transfer);
  }
}
