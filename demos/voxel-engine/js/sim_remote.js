// The page's end of the worker transport: a Sim (sim_local.js has the
// interface) whose engine runs in a Web Worker (sim_worker.js, sim_server.js).
//
// The page asks, the worker answers. Each animation frame main.js calls
// advance(): the packet that has come in since the last one, if any, becomes
// the frame, and unless a request is still out, one is posted carrying the
// input and the commands made since. Never more than one request is out:
// while the worker is busy, input waits here, and the picture is drawn from
// the frame it has (with the look direction of the moment, which is the
// page's own).
//
// Who keeps the clock is `pace`. 'page': a request carries the time that has
// passed, and the worker steps through it and answers; nothing is stepped
// that the page did not ask for, so a page that draws three times a second
// has a world that gets three requests' worth of steps a second. 'worker':
// a request carries the rate at which time runs (the game's time scale; 0
// when it stands) and the worker steps by its own clock between requests
// (sim_server.js has the rules); the answer is the world as it stands. The
// rest of this file is the same either way.
//
// A worker that is more than a display frame over an answer is not kept
// waiting for the next frame as well: its next request goes out the moment
// the answer comes in (_receive), with the time that piled up meanwhile, and
// the answer waits for the frame that draws it. Asked only from advance(), a
// sim whose turn took 17 ms at 60 Hz ran every other frame: half speed, half
// the frames drawn from a packet drawn before, and the worker idle half the
// time. Every packet is still drawn, each once and in order: an answer that
// comes in while the one before has not been drawn waits behind it, and
// nothing more is asked until a frame has taken one.
//
// Packet buffers go round: the buffer of the frame before the current one is
// sent back with each request, so in steady state two buffers carry every
// frame and nothing is allocated for them. One more is kept for the request
// that goes out before the answer in hand has been drawn (three are then on
// their way round): a worker that is late now and then would otherwise have
// one made each time it fell behind, and dropped each time it caught up.
import { BUTTON, Engine, OUT } from './engine.js';
import { PacketFrame } from './sim_packet.js';
import { FrameAcoustics } from './sim_acoustics.js';
import { Tween } from './sim_tween.js';

// A frame's word to a worker that keeps the clock when it has no other.
const HERE = { t: 'here' };

// Seconds of time kept for a busy worker. It steps at most four times a
// request and drops the rest, so more than this would only be dropped there.
const MAX_OWED = 0.25;
// How long a new worker has to say hello (ms), and how long it then has to
// load the engine and build the world: many times what the slowest machine
// tried needs, and short of for ever, for a worker that died without a word.
const HELLO_MS = 8000;
const READY_MS = 90000;
const MAX_STEPS = 4;
// What a message there and one back are allowed for (ms).
const POST_MS = 0.5;
// How long a request may go unanswered (ms of frames drawn) before the
// worker is given up on: the slowest thing asked of it, a new world on a
// machine many times slower than the dev box, takes a few seconds.
const ANSWER_MS = 20000;
// The most one frame counts for, toward that and toward the display's frame
// interval: what the frame loop itself counts a frame as at most (main.js).
const FRAME_MOST_MS = 100;
// A frame loop that stood this long (ms) was hidden or stalled, not running.
const IDLE_MS = 250;
// With the clock in the worker: frames this far apart or further (ms) wait
// for the answer to the request they have just posted before they draw
// (answerSoon), for at most this share of a frame and this long (ms).
const WAIT_FROM_MS = 50;
const WAIT_SHARE = 0.5;
const WAIT_MOST_MS = 250;
// Frames that do not wait after one that waited in vain.
const VAIN_FRAMES = 60;

// The steps to ask of the worker in one request: as many as it can run and
// still answer within a display frame, going by what its packets have cost
// (frameMs between frames, stepMs a step, overMs the rest of a request).
// Asked for every step that is due, a sim that answers late once is owed two
// frames of time by the next request, answers that one later still, and
// settles at several steps every few frames though it could keep up at one
// step a frame; a sim too slow for the display at all would show the world
// only every fourth step. Never fewer than one step, never more than four.
// Of the steps then left over the sim keeps one owed and drops the time for
// the rest (LocalSim.advance), as this thread drops it past four.
export function stepsThatFit(frameMs, stepMs, overMs) {
  if (!(stepMs > 0)) return MAX_STEPS;
  return Math.max(1, Math.min(MAX_STEPS, Math.floor((frameMs * 0.9 - overMs) / stepMs)));
}

// The ways a worker running sim_worker.js can be had, in the order they are
// tried. The file itself is the plain one. A page in a sandboxed frame has
// an origin that no file shares, and is refused a worker made from a file;
// it may still have one made from a script of its own that imports the file
// (the page's modules are loaded across origins in just that way).
function waysToWork() {
  const script = new URL('./sim_worker.js', import.meta.url).href;
  const loader = `import ${JSON.stringify(script)};`;
  return [
    ['module', () => new Worker(script, { type: 'module' })],
    ['blob', () => {
      // (Not revoked: the worker fetches it when it gets round to it, and
      // it is one line long.)
      return new Worker(URL.createObjectURL(new Blob([loader], { type: 'text/javascript' })), { type: 'module' });
    }],
    ['data', () => new Worker('data:text/javascript,' + encodeURIComponent(loader), { type: 'module' })],
  ];
}

export class WorkerSim {
  // opts: { scene, seed, warm, pace, index, worker, steps } (index: false
  // and the packets carry no quad-list delta; pace: 'worker' or
  // 'page', who keeps the clock; worker: a function that returns the Worker
  // to use, steps: a fixed number of steps to ask for at most; both for the
  // checks). Rejects when no worker can be started or
  // the engine cannot be loaded in it, with every way tried in the message.
  static async create(url, opts = {}) {
    const ways = opts.worker ? [['given', opts.worker]] : waysToWork();
    const why = [];
    for (const [how, make] of ways) {
      try {
        const sim = await WorkerSim._start(make, url, opts);
        sim.how = how;
        return sim;
      } catch (e) {
        why.push(ways.length > 1 ? `${how}: ${e.message}` : e.message);
        // Only a worker that was refused outright is worth asking for in
        // another way: one that started and then failed (the engine did
        // not load, the script never ran) would fail the same way again.
        if (!e.refused) break;
      }
    }
    throw new Error(why.join('; '));
  }

  // One worker, from `make()` to its first frame.
  static _start(make, url, opts) {
    return new Promise((resolve, reject) => {
      let worker = null, hello = false, timer = 0;
      const fail = (message, refused) => {
        clearTimeout(timer);
        if (worker) worker.terminate();
        const e = new Error(message || 'the simulation worker did not start');
        e.refused = refused;
        reject(e);
      };
      try {
        worker = make();
      } catch (e) {
        fail(e.message, true);
        return;
      }
      // The worker says hello as soon as its script runs. One that neither
      // does that nor reports an error (something in the way of loading it)
      // is given up on; after the hello it is loading the engine and
      // building the world, which gets a long time but not for ever.
      timer = setTimeout(() => fail('the simulation worker did not answer', false), HELLO_MS);
      worker.onerror = (e) => {
        if (e.preventDefault) e.preventDefault();
        // (Before its script ran: the browser would not have it. A browser
        // that takes the module for a classic script fails here too.)
        fail(e.message || 'the simulation worker could not be loaded', !hello);
      };
      worker.onmessage = (e) => {
        if (e.data.t === 'hello') {
          hello = true;
          clearTimeout(timer);
          timer = setTimeout(() => fail('the simulation worker did not get the engine going', false), READY_MS);
          return;
        }
        clearTimeout(timer);
        if (e.data.t === 'ready') resolve(new WorkerSim(worker, e.data, opts.steps || 0, opts.clock, opts.pace));
        else fail(e.data.message, false);
      };
      const absolute = typeof location === 'undefined' ? url : new URL(url, location.href).href;
      worker.postMessage({ t: 'boot', url: absolute, scene: opts.scene || 0, seed: opts.seed === undefined ? 1 : opts.seed, warm: opts.warm !== false, index: opts.index !== false, mesher: opts.mesher || '', weak: opts.weak > 0 ? opts.weak : 0 });
    });
  }

  constructor(worker, ready, steps = 0, clock = null, pace = 'page') {
    this._worker = worker;
    // Who keeps the clock: 'worker' or 'page'. The rate time runs at as the
    // frame loop last gave it, and as the worker was last told.
    this.pace = pace === 'worker' ? 'worker' : 'page';
    this._own = this.pace === 'worker';
    this.rate = 1;
    this._rate = 0;
    this._rateSent = 0;
    // The picture between packets (sim_tween.js), and the clock it goes by
    // (ms; a check brings its own).
    this.tween = new Tween();
    this._idled = false;
    this._clock = clock || (() => performance.now());
    // The time the display gave the frame that is being made (the
    // animation frame's timestamp; in a headset the XR frame's), set by
    // the host before advance(), on the clock above; NaN when there is
    // none. It goes with the frame's request, and the worker counts the
    // world's time up to it and not up to when the request reached it:
    // the picture is shown at the display's beat whenever the callback
    // ran, so a callback a millisecond late is not a millisecond more of
    // the world (in a headset at 90 a second one to three frames in a
    // hundred were off their stride by that alone). `_origin`: what is
    // added to make it a time the worker's thread can read (each thread's
    // clock starts at its own beginning; a check's clocks are one).
    this.at = NaN;
    this._atWas = NaN;
    this._origin = clock ? 0 : performance.timeOrigin;
    // What a frame, a step and the rest of a request have been taking (ms,
    // smoothed): see stepsThatFit.
    this._fixed = steps;
    this._frameMs = 1000 / 60;
    this._stepMs = 0;
    this._overMs = 0;
    this._advancedAt = 0;
    this._gaps = [1000 / 60, 1000 / 60];
    // A worker that neither answers nor fails (a loop that does not end in
    // the engine) would leave a world that stands still under a picture
    // that still turns: after `patience` ms of frames it counts as stopped.
    this.patience = ANSWER_MS;
    this._silent = 0;
    // The engine is on another thread: its times are not this thread's.
    this.remote = true;
    // How the worker was had: 'module', 'blob' or 'data' (waysToWork).
    this.how = '';
    this._frame = new PacketFrame();
    this.acoustics = new FrameAcoustics();
    this._palette = ready.palette;
    this._specs = ready.specs;
    this._surround = ready.surround || {};
    this._plans = ready.plans || {};
    this._jobs = ready.jobs || {};
    this._solid = ready.solid;
    this._serial = 0;
    this._cmds = null;
    this._after = [];
    this._acc = 0;
    this._out = false;      // a request is with the worker
    this._arrived = null;   // its answer, until advance() takes it
    this._owedIn = false;   // a request was out when the last frame began
    this._held = null;      // the answer after that, while that one waits
    this._spares = [];      // packet buffers to send back (two at most)
    this._wantFull = false;
    this._fullOut = false;  // the request that is out asks for a full frame
    this._error = null;
    this._flush = null;
    // Questions asked of the engine (ask()) and not yet answered, by number,
    // and steps asked for (step()) whose frame has not come.
    this._asks = new Map();
    this._asked = 0;
    this._steps = new Set();
    // Input as last given and as last sent: only a change is worth a request.
    this._in = new Float64Array(7);
    this._sent = new Float64Array(7).fill(NaN);
    this._pressed = 0;
    // Messages posted to the worker so far (a frame that posts none while
    // Fire is held says 'here').
    this._said = 0;
    this._mode = 0;
    this._msg = { t: 'frame', id: 0, at: 0, sent: 0, dt: 0, own: false, rate: 0, every: 0, max: MAX_STEPS, full: false, buf: null, mode: 0, mx: 0, mz: 0, yaw: 0, pitch: 0, buttons: 0, pressed: 0, tool: 0, cmds: null };
    this._transfer = [];
    this._postedAt = 0;
    // A frame has come that the picture has not shown: main.js draws it even
    // when nothing else moves.
    this.pending = false;
    // requests posted, packets taken, frames handed out for drawing and how
    // many of those were a packet drawn before, the last round trip and what
    // taking the last packet cost this thread (ms), the steps last asked
    // for at most, the requests posted as an answer came in, and the frames
    // drawn with bodies between two packets' places.
    // (waited: frames that waited for their answer and drew it; late: frames
    // whose answer did not come in the time they gave it; put: frames that
    // put their request off to the next; told: input sent on its own.)
    this.stats = { requests: 0, packets: 0, draws: 0, stale: 0, roundMs: 0, takeMs: 0, max: MAX_STEPS, early: 0, tweened: 0, waited: 0, late: 0, put: 0, told: 0, undrawn: 0, here: 0, lost: 0 };
    this._took = false;
    // fn(frame), for every packet taken (main.js gives it the renderer's).
    this.onTake = null;
    // The number of the last packet taken (HEAD.SEQ), -1 before the first.
    this._seq = -1;
    this._standing = false;
    this._span = 0;
    this._waiting = null;
    this._vain = 0;
    // The frame loop waits for answerSoon() before it draws (main.js says).
    this.patient = false;
    // A hidden page draws no frame that could say so: a worker that keeps
    // the clock is told now, and the world stands until a frame asks again.
    if (this._own && typeof document !== 'undefined' && document.addEventListener) {
      this._hidden = () => { if (document.hidden) this.stand(); };
      document.addEventListener('visibilitychange', this._hidden);
    }
    worker.onmessage = (e) => this._receive(e.data);
    worker.onerror = (e) => this._fail(e.message || 'the simulation worker stopped');
    worker.onmessageerror = () => this._fail('a message from the simulation worker could not be read');
    this._take(ready);
    this.engine = standIn(this);
  }

  get frame() { return this._frame; }
  // What one step of the sim costs, ms, smoothed, as the worker measured
  // its own (0 until a packet has had a step in it). The same name the sim
  // on the page's thread gives its own figure: a status line asks either.
  get stepMs() { return this._stepMs; }
  // Serial of the last command made.
  get serial() { return this._serial; }

  input(moveX, moveZ, yaw, pitch, buttons, pressed, tool) {
    const v = this._in;
    v[0] = moveX; v[1] = moveZ; v[2] = yaw; v[3] = pitch; v[4] = buttons; v[6] = tool;
    this._pressed |= pressed;
    this._mode = 1;
  }

  look(yaw, pitch) {
    this._in[2] = yaw;
    this._in[3] = pitch;
    if (this._mode === 0) this._mode = 2;
  }

  command(name, ...args) {
    const serial = ++this._serial;
    const q = this._cmds || (this._cmds = []);
    if (name === 'init') {
      // A new world: no time owed, and nothing pressed in the old one counts.
      this._acc = 0;
      this._pressed = 0;
      // A world asked for earlier and not yet sent for is never seen: only
      // this one is worth building (R hit again and again while the worker
      // is still on the first restart).
      for (let i = q.length - 1; i >= 0; i--) if (q[i][1] === 'init') q.splice(i, 1);
    }
    q.push([serial, name, ...args]);
    return serial;
  }

  // fn runs once a frame shows the world after command `serial`.
  after(serial, fn) {
    if (this._frame.commands >= serial) fn();
    else this._after.push({ serial, fn });
  }

  // A promise for what engine[name](...args) returns in the worker, as the
  // world stands when the question gets there (between two requests).
  ask(name, ...args) {
    if (this._error) return Promise.reject(this._error);
    return new Promise((resolve, reject) => {
      const id = ++this._asked;
      this._asks.set(id, { resolve, reject });
      this._worker.postMessage({ t: 'ask', id, name, args });
    });
  }

  palette() { return this._palette; }
  solidBits() { return this._solid; }
  objectiveSpec(scene, i) {
    const list = this._specs[scene];
    return list && list[i] ? { ...list[i] } : null;
  }

  planInfo(scene, i) {
    const list = this._plans[scene];
    return list && list[i] ? { ...list[i], at: list[i].at.slice() } : null;
  }

  jobInfo(scene, i) {
    const list = this._jobs[scene];
    return list && list[i] ? { ...list[i], keep: list[i].keep.map((k) => ({ ...k, at: k.at.slice() })) } : null;
  }

  // (A scene nobody asked the worker about is the town, as for the engine.)
  sceneSurround(scene) {
    const v = this._surround[scene];
    return v !== undefined ? v : this._surround[0] !== undefined ? this._surround[0] : 1.2;
  }

  resync() {
    const f = this._frame;
    if (f.full) return f;
    if (!this._fullOut) this._wantFull = true;
    return null;
  }

  // seconds: game time since the frame before. this.rate (the frame loop
  // sets it): game seconds a second while time runs, the game's time scale,
  // for a worker that keeps the clock.
  advance(seconds) {
    const said = this._said;
    // (A frame that still comes while the page is hidden, one that was
    // already on its way, does not start a stopped clock again.)
    const unseen = this._hidden !== undefined && document.hidden;
    this._rate = seconds > 0 && !unseen ? (this.rate > 0 ? this.rate : 1) : 0;
    if (this._rate > 0) this._standing = false;
    const now = this._clock(), gap = this._advancedAt > 0 ? now - this._advancedAt : 0;
    this._advancedAt = now;
    if (this._out && !this._error) {
      // (Only what the page saw pass: a tab that was hidden did not wait.)
      this._silent += Math.min(gap, FRAME_MOST_MS);
      if (this._silent > this.patience) this._fail(`the simulation has not answered for ${Math.round(this.patience / 1000)} s`);
    }
    if (this._error) throw this._error;
    // (For the picture between packets: no time asked for, or a frame loop
    // that stood for a quarter of a second, is not the sim being slow.)
    if (!(seconds > 0) || gap > IDLE_MS) this._idled = true;
    // (No time has passed: the game is paused, and time still held for a
    // worker that was busy is not sent after the player has stopped it.)
    if (seconds > 0) this._acc = Math.min(this._acc + seconds, MAX_OWED);
    else this._acc = 0;
    // (The frame's own time is this frame's and no later one's.)
    const at = this.at;
    this.at = NaN;
    // (The picture between packets goes by the display's time for the
    // frame where it gave one: sim_tween.js.)
    this.tween.beat = at > 0 ? at : now;
    if (gap > 0) {
      // The display's frame, by the clock: `seconds` is game time.
      // (Followed quickly: a page held to a few frames a second by its GPU
      // has few frames to learn from, and room for every step due. The
      // middle one of the last three gaps: one long gap is a tab that was
      // hidden or a stall, and says nothing about the display.)
      // (Between the times the display gave two frames, where it gave
      // them: callbacks that run 0 to 3 ms late make a display at 72 a
      // second look like anything from 60 to 90.)
      const beat = at > 0 && this._atWas > 0 && at > this._atWas ? at - this._atWas : gap;
      const g = this._gaps, a = g[0], b = g[1];
      g[0] = b;
      g[1] = beat;
      const mid = Math.max(Math.min(a, b), Math.min(Math.max(a, b), beat));
      this._frameMs += (Math.min(mid, 1000) - this._frameMs) * 0.25;
    }
    this._atWas = at > 0 ? at : NaN;
    this._took = this._arrived !== null;
    // (A request from before this frame is still unanswered: answerSoon.)
    this._owedIn = this._out;
    const steps = this._arrived ? this._take(this._arrived) : 0;
    if (this._held) {
      // Two answers were in: the second is the next frame's, and nothing
      // more is asked until then (the worker is not behind after all).
      this._arrived = this._held;
      this._held = null;
    } else if (!this._out && (this._acc > 0 || this._news() || this._standing || this._frame.out[OUT.STAT_DIRTY_CHUNKS] !== 0)) {
      // Something for the worker to do: time to step through, news from
      // the page, a world it has not finished meshing, or a stop that came
      // while two answers waited (stand: the world as it stopped).
      // (But not from a long frame that has a packet to draw and nothing
      // to say that cannot wait: its request would be answered now and
      // drawn a frame from now. The next frame asks, waits for its answer
      // and draws that: answerSoon.)
      if (this._took && this._cmds === null && !this._wantFull && this._patient()) {
        this.stats.put++;
        this._tell();
      } else {
        this._post(at);
      }
    } else if (this._out && this._own) {
      // A request is out: what the hands did since goes after it now, and
      // is in before the worker's next step, not with the next request.
      this._tell();
    }
    // While Fire is held every frame says something: a worker that keeps
    // the clock stops firing on a hold once this thread has not been heard
    // for longer than a frame and a half of its own (a release may be
    // waiting behind a stall), and a frame with nothing else to say would
    // read as one.
    if (this._own && this._rate > 0 && this._said === said && (this._in[4] & BUTTON.PRIMARY) !== 0) {
      this._worker.postMessage(HERE);
      this._said++;
      this.stats.here++;
    }
    return steps;
  }

  // For the shell, at an input event: what sim.input() / sim.look() were
  // last given goes to the worker now, where it is in before the next
  // step, instead of with the next frame (which on a starved page is a
  // third of a second of the world away). Nothing to do with the page's
  // clock, where steps only come with the frame's request.
  tell() {
    if (this._own && !this._error) this._tell();
  }

  // The input as it stands, sent on its own (no answer comes for it): for a
  // frame that posts no request, with the clock in the worker, whose steps
  // do not wait for one.
  _tell() {
    if (this._mode === 0 && this._pressed === 0) return;
    const v = this._in, s = this._sent, mode = this._mode || 1;
    if (this._pressed === 0) {
      let same = true;
      for (let i = mode === 1 ? 0 : 2, n = mode === 1 ? 7 : 4; i < n && same; i++) same = v[i] === s[i];
      if (same) { this._mode = 0; return; }
    }
    this._worker.postMessage({ t: 'input', mode, mx: v[0], mz: v[1], yaw: v[2], pitch: v[3], buttons: v[4], pressed: this._pressed, tool: v[6] });
    this._said++;
    if (mode === 1) s.set(v);
    else { s[2] = v[2]; s[3] = v[3]; }
    this._mode = 0;
    this._pressed = 0;
    this.stats.told++;
  }

  // The frame loop waits for answers (`patient`), the clock is the
  // worker's and runs, and the last wait was not in vain.
  _waits() {
    return this._own && this.patient && this._rate > 0 && this._rate === this._rateSent && this._vain === 0;
  }

  // And frames are long: a frame with a packet to draw puts its request off
  // to the next frame, which waits for the answer.
  _patient() {
    return this._waits() && this._frameMs >= WAIT_FROM_MS;
  }

  // THE PICTURE ON A LONG FRAME. A request goes out when a frame begins and
  // its answer is in a few milliseconds later; the frame then draws, and
  // the answer is drawn by the next one. While a frame is a sixtieth of a
  // second that is one frame of lag. When a frame is a third of a second
  // (a slow graphics card) and the world keeps time, it is two thirds of a
  // second: the picture shows where the world was two frames ago, and a
  // click is a shot two frames later. So a frame that is long, has posted
  // its request and has nothing new to draw waits for the answer first
  // (main.js: `await sim.answerSoon()`, then `sim.arrive()`, then the
  // draw): the picture is then one draw behind the world.
  //
  // A SHORT FRAME WITH NOTHING TO DRAW waits too. At the display's rate an
  // answer is back in a millisecond, long before the next frame, unless the
  // browser holds it: after a mouse press or a key Chromium delivers
  // nothing a worker posts until the next animation frame has run (a
  // worker that only echoes: back in 0.4 ms from a timer, after the next
  // frame 39 times in 40 from a mousedown or a keydown). A press that lands
  // while an answer is on its way back therefore leaves the next frame with
  // no packet and no room to ask (one request is out); it drew the old
  // picture, the held answer and the next then came together and were shown
  // one a frame, and the shot was a frame late: one press in twenty to one
  // in three, by the machine (the third critic's probe, 16 October). The
  // held answer comes as soon as the frame's callback returns, so that
  // frame waits for it, where the picture would otherwise only be drawn
  // again as it is (nothing travelling between packets: sim_tween.js).
  //
  // A promise for that answer, kept when it is in or after half a frame's
  // time at most; null when there is nothing worth waiting for (the page
  // keeps the clock, this frame has a packet already, no request is out,
  // the game stands, or frames are short and either the request is this
  // frame's own or bodies are still travelling to where the last packet
  // has them).
  answerSoon() {
    if (this._vain > 0) this._vain--;
    if (!this._out || this._took || this._error || !this._waits()) return null;
    // (Short frames: only for an answer that was owed already when the
    // frame began. A frame that waited for the answer to its own request
    // would find the next one in the same state, and every picture would be
    // drawn outside the frame's callback from then on.)
    if (this._frameMs < WAIT_FROM_MS && (!this._owedIn || this.tween.moving)) return null;
    return new Promise((resolve) => {
      // (An answer that does not come in time: the worker is the slow one,
      // and for a while frames draw what they have, as they did.)
      const timer = setTimeout(() => { this._waiting = null; this.stats.late++; this._vain = VAIN_FRAMES; resolve(); }, Math.min(this._frameMs * WAIT_SHARE, WAIT_MOST_MS));
      this._waiting = () => { clearTimeout(timer); this._waiting = null; resolve(); };
    });
  }

  // The answer that came while the frame waited becomes the frame (never a
  // second packet in one frame: one that advance() took is drawn first).
  // Returns its steps.
  arrive() {
    if (this._error) throw this._error;
    if (!this._arrived || this._took) return 0;
    this._took = true;
    this.stats.waited++;
    return this._take(this._arrived);
  }

  prepare() {
    const f = this._frame, st = this.stats;
    st.draws++;
    if (!this.pending) {
      st.stale++;
      f.spend();
    }
    this.pending = false;
    // Bodies and the camera on their way to where this packet has them.
    if (this.tween.moving) st.tweened++;
    this.tween.apply(f, this._clock(), this._frameMs);
    return f;
  }

  // With the clock in the worker: the game seconds its clock asked of it
  // in the packets taken since this was last called (against the steps
  // they held, the world's true pace: what the slow-motion mark is told).
  // Under 0 with the page's clock: the frame loop knows what it asked.
  asked() {
    if (!this._own) return -1;
    const a = this._span;
    this._span = 0;
    return a;
  }

  // The frame after this one differs from it though no packet comes: bodies
  // are still on their way (main.js draws on behind a card until they are in).
  get moving() { return this.tween.moving; }

  // For tools (window.__vx.step): n steps more than the clock asks for, run
  // with the next request. A promise for the frame that shows them.
  step(n = 1) {
    if (this._error) return Promise.reject(this._error);
    let at = this._serial;
    for (let i = 0; i < n; i++) at = this.command('step');
    return new Promise((resolve, reject) => {
      const waiting = { reject };
      this._steps.add(waiting);
      this.after(at, () => { this._steps.delete(waiting); resolve(); });
    });
  }

  // Resolves once everything asked of the sim so far shows in the frame.
  // For the boot, before the frame loop runs: nothing else posts meanwhile.
  flush() {
    return new Promise((resolve, reject) => {
      // (No frame loop counts the silence here: a worker that stops
      // answering in the middle of this must not leave the page waiting.)
      const timer = setTimeout(() => this._fail('the simulation did not answer'), READY_MS);
      this._flush = { resolve: () => { clearTimeout(timer); resolve(); }, reject: (e) => { clearTimeout(timer); reject(e); } };
      this._drain();
    });
  }

  // The world's clock stands for the next `seconds` (a hit-stop). Sent at
  // once: whoever keeps the clock takes it off the time that follows.
  hold(seconds) {
    if (!(seconds > 0) || this._error) return;
    this._worker.postMessage({ t: 'hold', seconds: Math.min(seconds, 0.25) });
  }

  // The world stands from now (a worker that keeps the clock stops it)
  // until the next frame with time in it asks again.
  stand() {
    if (!this._own || this._error) return;
    this._worker.postMessage({ t: 'stand' });
    // No time is owed and none runs until a frame says so: the answer to a
    // request that is out must not send the next one after it with the
    // rate of the last frame (the world ran its leash out behind a hidden
    // tab that way). Whatever rate that frame names is news.
    this._acc = 0;
    this._rate = 0;
    this._rateSent = -1;
    // And the world as it stands is asked for now, not by the next frame:
    // the first frame of the pause then shows where the world stopped (or
    // the second, where a packet was waiting to be drawn: each packet is
    // drawn, and heard, on its own), where the request would have gone out
    // with that frame and its answer been drawn by the one after.
    // (With a request out, as soon as its answer is in: _receive. With two
    // answers waiting to be taken, when the frames have taken them:
    // advance. There is room for two; asked at once, the third took the
    // second one's place, and a packet that is never taken takes its
    // events and its changes to the quad lists with it.)
    if (!this._out && !this._flush && !this._held) this._post();
    else this._standing = true;
  }

  dispose() {
    if (this._hidden) document.removeEventListener('visibilitychange', this._hidden);
    this._fail('the simulation was shut down');
    this._worker.terminate();
  }

  _news() {
    if (this._cmds !== null || this._wantFull || this._pressed !== 0) return true;
    // (A worker that keeps the clock is told when time stops, starts or changes pace.)
    if (this._own && this._rate !== this._rateSent) return true;
    if (this._mode === 0) return false;
    const v = this._in, s = this._sent;
    for (let i = this._mode === 1 ? 0 : 2, n = this._mode === 1 ? 7 : 4; i < n; i++) if (v[i] !== s[i]) return true;
    return false;
  }

  // at: the display's time for the frame this request is made in (ms on
  // this thread's clock), where it is a frame's own request.
  _post(at = NaN) {
    const m = this._msg, v = this._in, s = this._sent, t = this._transfer;
    m.id = ++this.stats.requests;
    m.at = at > 0 ? this._origin + at : 0;
    // (And when it was sent: how long a request waits for the worker is
    // the worker's lateness, how long a callback waited is the page's.)
    m.sent = at > 0 ? this._origin + this._clock() : 0;
    m.own = this._own;
    m.dt = this._own ? 0 : this._acc;
    m.rate = this._rateSent = this._own ? this._rate : 0;
    m.every = this._frameMs;
    m.max = this.stats.max = this._fixed || stepsThatFit(this._frameMs, this._stepMs, this._overMs);
    m.full = this._wantFull;
    m.buf = this._spares.length ? this._spares.pop() : null;
    m.mode = this._mode;
    m.mx = v[0]; m.mz = v[1]; m.yaw = v[2]; m.pitch = v[3]; m.buttons = v[4]; m.pressed = this._pressed; m.tool = v[6];
    m.cmds = this._cmds;
    if (this._mode === 1) s.set(v);
    else if (this._mode === 2) { s[2] = v[2]; s[3] = v[3]; }
    t.length = 0;
    if (m.buf) t.push(m.buf);
    this._postedAt = performance.now();
    this._silent = 0;
    this._worker.postMessage(m, t);
    this._said++;
    this._fullOut = m.full;
    this._standing = false;
    this._acc = 0;
    this._wantFull = false;
    this._mode = 0;
    this._pressed = 0;
    this._cmds = null;
    this._out = true;
  }

  _receive(m) {
    if (m.t === 'error') {
      this._fail(m.message, m.stack);
      return;
    }
    if (m.t === 'answer') {
      const a = this._asks.get(m.id);
      this._asks.delete(m.id);
      if (a && m.error !== undefined) a.reject(new Error(m.error));
      else if (a) a.resolve(m.value);
      return;
    }
    this.stats.roundMs = performance.now() - this._postedAt;
    this._out = false;
    if (this._arrived) {
      // (There is room for one more, and nothing asks while two wait:
      // advance, stand. Should anything ever, the packet whose place this
      // one takes is missed at the next take: `lost`.)
      this._held = m;
      return;
    }
    this._arrived = m;
    // (A frame is waiting for this one before it draws.)
    if (this._waiting) this._waiting();
    if (this._flush) {
      this._drain();
    } else if (this._standing && !this._error) {
      // The game stopped while this was out (stand()): the world as it
      // stopped is asked for now, and the first frame of the pause has it.
      this._post();
    } else if (this._acc > 0 && !this._wantFull && !this._error) {
      // A frame or more went by while this was out (time has piled up, and
      // the game is not paused): the worker is behind the display, and its
      // next turn starts now, not with the next frame.
      this.stats.early++;
      this._post();
    }
  }

  _fail(message, stack) {
    if (this._error) return;
    this._error = new Error(message);
    if (stack) this._error.stack = stack;
    const fl = this._flush;
    this._flush = null;
    if (fl) fl.reject(this._error);
    if (this._waiting) this._waiting();
    // (Nobody will answer what was asked.)
    for (const a of this._asks.values()) a.reject(this._error);
    this._asks.clear();
    for (const w of this._steps) w.reject(this._error);
    this._steps.clear();
  }

  _drain() {
    const fl = this._flush;
    if (this._error) {
      this._flush = null;
      fl.reject(this._error);
      return;
    }
    try {
      if (this._arrived) this._take(this._arrived);
      if (this._held) {
        // (Two answers were in, and no frame is drawn between them here:
        // what the first one changed never reaches the picture's mirror.)
        const m = this._held;
        this._held = null;
        this._take(m);
        this._wantFull = true;
      }
    } catch (e) {
      this._flush = null;
      fl.reject(e);
      return;
    }
    if (this._out) return;
    if (this._news()) {
      // The picture has not had its full frame yet: the one that replaces
      // it has to be full as well.
      if (this.pending && this._frame.full) this._wantFull = true;
      this._post();
    } else {
      this._flush = null;
      fl.resolve();
    }
  }

  // The packet of message m becomes the frame. Returns its steps.
  _take(m) {
    const t0 = performance.now();
    const f = this._frame, old = f.buffer;
    this._arrived = null;
    this._fullOut = false;
    // A full frame that was never drawn is still owed.
    if (this.pending && f.full) this._wantFull = true;
    // (A packet taken over one that no frame drew: what that one said had
    // changed, its AO boxes and its quad rows, never reached the renderer.
    // Only the boot's flush may, before anything is drawn; the frame loop
    // takes one packet a frame and draws it. Counted, and held to none.)
    if (this.pending && !this._flush && this.stats.packets > 0) this.stats.undrawn++;
    this.tween.before(f);
    f.take(m.buf, m.occ || null, m.sound || null, m.fine || null);
    this.tween.after(f, this._clock(), this._frameMs, this._idled);
    this._idled = false;
    if (f.full) this._wantFull = false;
    // Every answer is the worker's next frame, and each is taken. One whose
    // number is not the last one's plus one says a packet never got here,
    // and with it what it said had changed: its records are gone, and the
    // quad lists are wrong from here on, since the engine counts changes
    // from the frame before. Counted (the checks hold it to none), and the
    // lists are asked for whole, which puts them right in one packet
    // instead of at the next world.
    if (this._seq >= 0 && !f.world && f.seq !== ((this._seq + 1) >>> 0)) {
      this.stats.lost++;
      if (!f.full) this._wantFull = true;
    }
    this._seq = f.seq;
    if (old && this._spares.length < 2) this._spares.push(old);
    if (m.solid) this._solid = m.solid;
    // The worker's own time, not the round trip: an answer that waited for
    // this thread to finish a slow frame was not late.
    if (!f.world) {
      this._overMs += (f.prepareMs + f.copyMs + POST_MS - this._overMs) * 0.25;
      if (f.paced > 0) {
        const step = f.stepMs / f.paced;
        // (Halfway to the newest: one heavy step is forgotten in a few.)
        this._stepMs = this._stepMs > 0 ? this._stepMs + (step - this._stepMs) * 0.5 : step;
      }
    }
    // The new engine has seen no input yet.
    if (f.world) this._sent.fill(NaN);
    this.acoustics.take(f);
    // Whoever mirrors what the packets say has changed (the renderer's
    // quad lists: Renderer.taken) is told of every packet, in order, when
    // it is taken and whether or not a picture is drawn of it: a delta
    // counts from the packet before.
    if (this.onTake) this.onTake(f);
    if (f.asked >= 0) this._span += f.asked;
    this.pending = true;
    this.stats.packets++;
    this.stats.takeMs = performance.now() - t0;
    // (In the order they were asked in; one asked for an earlier command
    // after a later one is not held up behind it.)
    const q = this._after;
    for (let i = 0; i < q.length;) {
      if (q[i].serial <= f.commands) q.splice(i, 1)[0].fn();
      else i++;
    }
    return f.steps;
  }
}

// What window.__vx.engine is while the engine is on another thread: reads
// come from the newest frame, everything else is sent as a command (and
// returns nothing). Enough for the console and the page checks; it is not
// the engine.
function standIn(sim) {
  const read = {
    camera: () => sim.frame.camera,
    playerState: () => sim.frame.playerState,
    toolState: () => sim.frame.toolState,
    structureStats: () => sim.frame.structureStats,
    tally: () => sim.frame.tally,
    objectiveState: () => sim.frame.objective,
    replayState: () => sim.frame.replay,
    vehicleState: () => sim.frame.vehicleState,
    gameState: () => sim.frame.game,
    planInfo: (scene, i) => sim.planInfo(scene, i),
    jobInfo: (scene, i) => sim.jobInfo(scene, i),
    prepareRender: () => sim.frame.out,
    outF32: (out) => sim.frame.f32.subarray(out.byteOffset >> 2, (out.byteOffset >> 2) + OUT.LEN),
    palette: () => sim.palette(),
    solidBits: () => sim.solidBits(),
    objectiveSpec: (scene, i) => sim.objectiveSpec(scene, i),
    sceneSurround: (scene) => sim.sceneSurround(scene),
    acousticEnclosure: (x, y, z) => sim.acoustics.acousticEnclosure(x, y, z),
    acousticOcclusion: (...a) => sim.acoustics.acousticOcclusion(...a),
    input: (...a) => sim.input(...a),
    look: (yaw, pitch) => sim.look(yaw, pitch),
  };
  const e = {
    remote: true,
    x: { memory: { get buffer() { return { byteLength: sim.frame.wasmBytes }; } } },
    get u8() { return sim.frame.u8; },
    get u32() { return sim.frame.u32; },
    get f32() { return sim.frame.f32; },
  };
  for (const name of Object.getOwnPropertyNames(Engine.prototype)) {
    // (Stepping is the clock's; a ray has no answer to give back.)
    if (name === 'constructor' || name[0] === '_' || name === 'step' || name === 'raycast') continue;
    e[name] = read[name] || ((...args) => { sim.command(name, ...args); });
  }
  return e;
}
