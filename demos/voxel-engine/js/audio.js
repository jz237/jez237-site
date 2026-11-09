// Procedural audio driven by engine events. No audio files: every sound is
// synthesised (audio_bank.js), rendered once in a worker, and played through
// a fixed Web Audio graph (audio_mix.js) by the director (audio_events.js).
//
// Contract with main.js: createAudio(ctx) -> { update(out, listener), ... }
//   ctx      = { sim, renderer, canvas, params, harness }; tools that
//              drive the audio alone pass { engine } instead, where engine
//              has `f32` (the memory the event records are in) and,
//              optionally, the two acoustic queries and `frame` (what of
//              sim.frame's state the director reads: `game`,
//              `vehicleState`, `toolState`, `steps`, `replay`)
//   out      = the engine's u32 out block
//   listener = { pos: [x, y, z], yaw, pitch }
// update() runs once per rendered frame. It only schedules: all DSP happens
// on the audio thread. The engine's event buffer stays visible across frames
// until the sim steps, so new records are identified by OUT.EVENT_TOTAL.
//
// Also on the returned object: setVolume(0..1), setMuted(bool), stats(),
// setAmbience(bool), setHrtf(bool), setQuality('high' | 'low'), enable(),
// dispose(), and the `volume` / `muted` getters. M toggles mute. Volume
// persists in localStorage (`vx.volume`), as do mute, ambience, HRTF and
// quality.
//
// Browsers refuse to start audio before a user gesture. The AudioContext is
// built ahead of it, suspended, while the player is still reading the start
// overlay, and the first pointer or key event only resumes it. A gesture
// that comes sooner builds it on the spot. In harness mode (headless, no
// audio device) nothing is created at all unless the page asks with ?audio=1
// or enable().
import { OUT } from './engine.js';
import { SOUNDS, SND, RENDER_ORDER, FIRST_BANK, renderSteps } from './audio_bank.js';
import { Mixer, VOICES, SMALL, BIG, toBuffer, fractions } from './audio_mix.js';
import { Director } from './audio_events.js';
import { createRehearsal } from './audio_warm.js';

const KEY_VOLUME = 'vx.volume';
const KEY_MUTED = 'vx.muted';
const KEY_AMBIENCE = 'vx.ambience';
const KEY_HRTF = 'vx.hrtf';
const KEY_QUALITY = 'vx.audioQuality';
const DEFAULT_VOLUME = 1;
// Muting: the fade (ms), then how long the context keeps running silently so
// the reverb rings out before the audio thread is stopped.
const MUTE_FADE_MS = 200;
const MUTE_TAIL_MS = 1800;
// A machine whose worker needs longer than this for the first bank's sounds
// (about 0.4 s on the 2.3 GHz development box) is slow enough that the audio
// thread's share of a core matters: it gets the low quality unless the
// player chose. (The first bank's, not the whole bank's: the bank has grown
// by a quarter since, and a machine did not get slower by that.)
const SLOW_BANK_MS = 1200;
// Once update() has run this long (ms), the rest of the frame's voice starts
// wait for the next frame: 0.3 ms is the budget for the worst frame, and a
// start that is under way when the time is up still has to finish. (Tried
// at 0.15 against the tower's collapse in the page: no frame was cheaper
// for it that the run-to-run spread did not hide.)
const START_BUDGET_MS = 0.2;
// Making the source a voice will next play is the dearest part of starting
// a sound (35 to 80 us when everything is coming down), so it is done
// ahead: a couple at the end of each frame that has time left (the
// mixer's endFrame), and when fewer than this many voices have one ready
// all the same, a task of its own between frames makes up to SPARE_BATCH
// of them, and another if that was not enough. (Asking for the task is
// itself 25 us, so it is not asked for lightly.)
const SPARES_LOW = VOICES - 6;
const SPARE_BATCH = 8;
// Main-thread bank rendering (no module workers): work per timer task.
const FALLBACK_SLICE_MS = 3;
// How long (ms) the street's and the room's impulse responses may wait,
// while somebody is playing, for an idle moment long enough to load them
// in before they are loaded regardless (a third of it for the first half
// of the work, the rest for the second: a thread with no idle moments at
// all still has both spaces within a second); the time (ms) taken to
// bring one to the context's rate, the time allowed for handing the first
// to its convolver before one has been timed, and the most ever asked for.
const SPACE_WAIT_MS = [150, 450];
const SPACE_PREPARE_MS = 5, SPACE_LOAD_MS = 12, SPACE_LOAD_MOST_MS = 30;
// The world has been stepped within this long (ms): somebody is playing.
const PLAYING_MS = 500;
// The rehearsal's share of an idle moment while somebody is playing (ms),
// and the shortest such moment it takes a share of.
const WARM_PLAYING_MS = 3, WARM_IDLE_MS = 7;
// Kinds of <input> that take no text: a key pressed in one is the game's.
const NOT_TYPED = /^(range|checkbox|radio|button|submit|reset|color|file|image)$/;
// The horn's key, at a wheel (no other use of it in the game).
const HORN_KEY = 'KeyH';

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) {
    return fallback; // storage can be blocked (private mode, sandboxed frames)
  }
}
function store(key, value) {
  try { localStorage.setItem(key, String(value)); } catch (e) { /* not persisted, still works */ }
}

/**
 * opts (all optional, used by the checks):
 *   context  a BaseAudioContext to build on (e.g. OfflineAudioContext); the
 *            instance is then live immediately and never touches the page
 *   sounds   pre-rendered bank: array indexed by sound id of variants
 *            (AudioBuffers, or arrays of channel data)
 *   quality  'high' or 'low', overriding the stored / detected setting
 */
export function createAudio(ctx, opts = {}) {
  const injected = opts.context || null;
  const params = ctx.params || null;
  // Harness pages have no audio device: stay inert unless asked.
  const inert = !injected && !!ctx.harness && !(params && params.has('audio'));
  const persist = !injected && !inert;
  // Where the event records live and who answers for the world.
  const sim = ctx.sim || null;
  const world = sim ? sim.acoustics : ctx.engine;
  const listening = persist;

  let volume = DEFAULT_VOLUME, muted = false, ambience = true, hrtf = false;
  if (persist) {
    const v = Number(load(KEY_VOLUME, DEFAULT_VOLUME));
    volume = v >= 0 && v <= 1 ? v : DEFAULT_VOLUME;
    muted = load(KEY_MUTED, '0') === '1';
    ambience = load(KEY_AMBIENCE, '1') !== '0';
    hrtf = load(KEY_HRTF, '0') === '1';
  }
  if (params && params.has('hrtf')) hrtf = params.get('hrtf') !== '0';
  // 'low' halves the voice pools and swaps the convolution reverb for a few
  // feedback delays: under half the audio thread's peak load. It is the
  // default where that thread competes with the game for a core: one or two
  // cores, or a machine that proves slow at rendering the bank (see
  // bankFinished).
  let quality = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 2 ? 'low' : 'high';
  let qualityChosen = false;
  if (persist) {
    const q = load(KEY_QUALITY, '');
    if (q === 'low' || q === 'high') { quality = q; qualityChosen = true; }
  }
  if (opts.quality) { quality = opts.quality === 'low' ? 'low' : 'high'; qualityChosen = true; }

  // Is the scene a city? Nothing in a frame says so; the scene's plans do:
  // one that has an elevated line over its street is New York. (By the
  // plans' names, which their owner keeps; not by the scene's number.)
  let city = !!opts.city;
  if (sim && typeof sim.planInfo === 'function' && params) {
    const scene = Number(params.get('scene') || 0);
    try {
      for (let i = 0; i < 64; i++) {
        const plan = sim.planInfo(scene, i);
        if (!plan) break;
        if (/^el span/.test(plan.name)) { city = true; break; }
      }
    } catch (e) { /* a sim that cannot say: not a city */ }
  }

  let ac = null, mixer = null, director = null;
  // True while update() should schedule sound.
  let live = false;
  // A user gesture has asked the context to run.
  let unlocked = false;
  let unavailable = false;
  // enable() was called: an inert (harness) instance may now create audio.
  let asked = false;
  let lastTotal = -1;
  // The world's step counter as last seen (see update()).
  let lastStep = 0;
  let disposed = false;
  let muteTimer = 0;

  // The bank as it arrives: per sound id, its variants as AudioBuffers. They
  // are built the moment the worker delivers them (the constructor needs no
  // context), so when the first gesture creates the mixer there is nothing
  // left to do but hand them over.
  const ready = new Array(SOUNDS.length).fill(null);
  let bankStarted = false, bankDone = false, bankMs = 0, bankSounds = 0;
  let worker = null;
  let bankResolve;
  const bankReady = new Promise((r) => { bankResolve = r; });

  const st = {
    state: inert ? 'harness' : 'locked', running: false, muted, volume, ambience, hrtf, quality,
    voices: 0, voicesMax: VOICES, voicesPeak: 0,
    started: 0, stolen: 0, dropped: 0, culled: 0, deferred: 0, expired: 0, drained: 0, droneWrites: 0, retimes: 0, hold: 0, holdMost: 0,
    events: 0, exact: 0, grains: 0, summarised: 0, rejected: 0, whistles: 0, whistlesCut: 0,
    frames: 0, skipped: 0, lastMs: 0, avgMs: 0, maxMs: 0, refills: 0, refillMs: 0, unlockMs: 0, spaceMs: 0,
    bankSounds: 0, bankTotal: SOUNDS.length, bankMs: 0, spaces: 0, warmMs: 0, sampleRate: 0, prepared: false,
  };
  fractions(st, ['volume', 'lastMs', 'avgMs', 'maxMs', 'refillMs', 'unlockMs', 'bankMs', 'warmMs', 'sampleRate']);
  let startedSeen = 0;

  function later(fn, timeout) {
    if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout });
    else setTimeout(fn, Math.min(timeout, 16), null);
  }

  // Is the world being stepped (somebody is playing), or does it stand
  // still (the start card, a menu, a pause)? By the step counter of the
  // frames update() is given.
  let seenStep = -1, steppedAt = -1e9;
  const playing = () => performance.now() - steppedAt < PLAYING_MS;

  // Work of `need` milliseconds that cannot be cut up, done where it costs
  // no frame: in an idle moment the browser says is at least that long.
  // While somebody is playing such a moment is waited for up to `wait`
  // ms (frames of a few milliseconds leave ten between them at 60 Hz, so
  // it comes at once or not at all); with nobody playing, or when the wait
  // is up, the next idle moment will do, and without one the work is done
  // regardless.
  function whenIdle(need, wait, fn) {
    if (!window.requestIdleCallback) { setTimeout(fn, 16); return; }
    const until = performance.now() + wait;
    const look = (deadline) => {
      if (disposed) return;
      const left = until - performance.now();
      if (deadline.timeRemaining() >= need || !playing() || left < 1) fn();
      else window.requestIdleCallback(look, { timeout: left });
    };
    window.requestIdleCallback(look, { timeout: wait });
  }

  function onSound(id, variants) {
    // (A sound can arrive twice if the worker died part-way; count it once.)
    if (ready[id] !== null) return;
    bankSounds++;
    let bufs = variants;
    if (!(variants[0] instanceof AudioBuffer)) {
      try {
        bufs = variants.map((chans) => toBuffer(chans, SOUNDS[id].sr, ac));
      } catch (e) {
        // No AudioBuffer constructor and no context yet: the mixer converts.
      }
    }
    ready[id] = bufs;
    if (mixer) install(id);
  }

  function install(id) {
    try {
      mixer.setSound(id, ready[id]);
    } catch (e) {
      // A buffer this browser will not make (an unsupported sample rate,
      // say) costs that one sound, not all of them: the mixer skips sounds
      // it has no buffer for.
      return;
    }
    if (id === SND.ir_outdoor || id === SND.ir_indoor) loadSpaces();
  }

  // A convolver takes several milliseconds of this thread to accept its
  // impulse response (18 ms for the street's, in a profile of the frame
  // engineer's): too long for a frame, and not something the first
  // gesture should wait for. Each is loaded in idle time shortly after it
  // can be, the street first; until then that space is simply dry. Not at
  // all at the low quality, whose spaces are the cheap ones and never feed
  // a convolver (they are loaded if the quality is raised); and not before
  // it is known which quality this machine gets (when the bank is in).
  let spacePending = false, spaceLoadMs = SPACE_LOAD_MS;
  function loadSpaces() {
    if (spacePending || disposed || !mixer || mixer.autoSpaces) return;
    if (quality === 'low' || !(bankDone || qualityChosen)) return;
    const i = mixer.irSrc[0] && !mixer.irLoaded[0] ? 0 : mixer.irSrc[1] && !mixer.irLoaded[1] ? 1 : -1;
    if (i < 0) return;
    spacePending = true;
    // In two idle moments, each long enough for its half: the response
    // brought to the context's rate, then handed to the convolver (which
    // cannot be cut up: the first one's time is what the next is given).
    whenIdle(SPACE_PREPARE_MS, SPACE_WAIT_MS[i] / 3, () => {
      if (disposed) return;
      mixer.prepareSpace(i);
      whenIdle(spaceLoadMs, SPACE_WAIT_MS[i] * 2 / 3, () => {
        spacePending = false;
        if (disposed) return;
        if (!mixer.irLoaded[i]) {
          const t = performance.now();
          mixer.loadSpace(i);
          const ms = performance.now() - t;
          if (ms > st.spaceMs) st.spaceMs = ms;
          spaceLoadMs = Math.min(SPACE_LOAD_MOST_MS, Math.max(SPACE_PREPARE_MS, 1.25 * ms));
        }
        loadSpaces();
      });
    });
  }

  function applyQuality() {
    if (!mixer) return;
    const low = quality === 'low';
    mixer.setVoiceLimit(low ? SMALL / 2 : SMALL, low ? BIG / 2 : BIG);
    mixer.setReverbLow(low);
    if (!low) loadSpaces();
  }

  // `ms` for the whole bank; `first` for the first bank's sounds alone,
  // where the renderer says (else the whole is taken for it).
  function bankFinished(ms, first = ms) {
    bankDone = true;
    bankMs = ms;
    if (worker) { worker.terminate(); worker = null; }
    if (!qualityChosen && first > SLOW_BANK_MS && quality !== 'low') {
      quality = 'low';
      applyQuality();
    }
    loadSpaces();
    bankResolve();
  }

  // Fallback when module workers are unavailable: the same bank on this
  // thread, a few milliseconds per timer task. No sound is rendered in one
  // go (the longest would freeze a slow machine for a quarter of a second).
  function renderOnMainThread() {
    let i = 0, steps = null, spent = 0, first = 0;
    const tick = () => {
      if (disposed) return;
      const t0 = performance.now();
      do {
        if (steps === null) {
          // (Whatever a worker delivered before it died is not rendered again.)
          while (i < RENDER_ORDER.length && ready[RENDER_ORDER[i]] !== null) i++;
          if (i >= RENDER_ORDER.length) { bankFinished(spent + performance.now() - t0, first); return; }
          steps = renderSteps(RENDER_ORDER[i]);
        }
        const a = performance.now();
        const s = steps.next();
        if (RENDER_ORDER[i] < FIRST_BANK) first += performance.now() - a;
        if (s.done) { onSound(RENDER_ORDER[i++], s.value); steps = null; }
      } while (performance.now() - t0 < FALLBACK_SLICE_MS);
      spent += performance.now() - t0;
      setTimeout(tick, 0);
    };
    setTimeout(tick, 0);
  }

  function startBank() {
    if (bankStarted) return;
    bankStarted = true;
    if (opts.sounds) {
      for (const id of RENDER_ORDER) if (opts.sounds[id]) onSound(id, opts.sounds[id]);
      bankFinished(0);
      return;
    }
    try {
      worker = new Worker(new URL('./audio_worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        const d = e.data;
        if (d.done) bankFinished(d.ms, d.first);
        else onSound(d.id, d.variants);
      };
      worker.onerror = (e) => {
        e.preventDefault();
        if (worker) { worker.terminate(); worker = null; }
        if (!bankDone) renderOnMainThread();
      };
    } catch (e) {
      renderOnMainThread();
    }
  }

  // The rehearsal (audio_warm.js), a couple of milliseconds at a time: in
  // idle time when there is any, and regardless every 100 ms when there is
  // not, so a machine with no idle time still gets through it.
  let rehearsal = injected ? null : undefined;
  let rehearsing = false;
  function warm(sync) {
    if (rehearsal === undefined) rehearsal = createRehearsal(world, hrtf, sim ? sim.frame.camera : null, () => (sim ? sim.frame : ctx.engine.frame));
    if (rehearsal === null || rehearsal.done) return;
    if (sync) {
      rehearsal.run(Infinity);
      st.warmMs = rehearsal.ms;
      return;
    }
    if (rehearsing) return;
    rehearsing = true;
    const slice = (deadline) => {
      if (disposed || rehearsal.done) return;
      let idle = deadline && !deadline.didTimeout ? deadline.timeRemaining() - 2 : 0;
      // (With somebody playing an idle moment is the gap between two
      // frames: a little of it, and none of a short one. A rehearsal
      // caught by the game's start took those gaps whole, 10 to 16 ms at
      // a time in the frame engineer's profile, and one step of it over
      // was a frame late.)
      if (playing()) {
        if (idle < WARM_IDLE_MS && deadline && !deadline.didTimeout) { later(slice, 100); return; }
        if (idle > WARM_PLAYING_MS) idle = WARM_PLAYING_MS;
      }
      const done = rehearsal.run(idle > 2 ? idle : 2);
      st.warmMs = rehearsal.ms;
      if (!done) later(slice, 100);
    };
    later(slice, 100);
  }

  // Build the context and the graph ahead of the first gesture. Creating a
  // page's first AudioContext is the browser's work and takes it tens of
  // milliseconds; with the graph and the priming on top, that is a visible
  // hitch if it happens in the click that starts the game. Here it happens
  // while the start overlay is up, and that click only has to resume.
  let preparing = false;
  function prepare() {
    if (preparing || ac || injected) return;
    preparing = true;
    later(() => {
      if (!disposed && !ac && !unavailable && !muted && !(inert && !asked)) create();
    }, 300);
  }

  // (A task between frames has been asked for: see refill().)
  let refilling = false;
  function refreshLive() {
    const was = live;
    live = !disposed && !!mixer && !muted && (injected ? true : unlocked && ac.state === 'running');
    // (The task between frames, once as sound comes on: so that the frame
    // of the first blast is not also the first to ask for one.)
    if (live && !was && !injected && !refilling) { refilling = true; setTimeout(refill, 0); }
  }

  function build(context) {
    ac = context;
    // (No clock on an offline context: its renders must be reproducible.)
    const offline = typeof OfflineAudioContext !== 'undefined' && ac instanceof OfflineAudioContext;
    mixer = new Mixer(ac, { hrtf, budgetMs: offline ? 0 : START_BUDGET_MS, unclipped: !!(injected && opts.unclipped), hold: opts.hold === true || !!(params && params.get('hold') === '1'), wall: opts.wall !== undefined ? !!opts.wall : !offline });
    // On the page, the convolvers are loaded when there is time (loadSpaces).
    mixer.autoSpaces = !!injected;
    director = new Director(mixer, world);
    director.ambience = ambience;
    director.setting(city);
    applyQuality();
    mixer.out.gain.value = muted ? 0 : volume;
    st.sampleRate = ac.sampleRate;
    startBank();
    for (const id of RENDER_ORDER) if (ready[id] !== null) install(id);
    if (!injected) {
      // The first use of every voice chain, now rather than in the frame
      // with the first explosion (this runs inside the first gesture).
      mixer.prime();
      ac.addEventListener('statechange', refreshLive);
    }
    refreshLive();
  }

  function create() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { unavailable = true; return; }
    try {
      const context = new AC({ latencyHint: 'interactive' });
      // Built ahead of a gesture, the context is held until one comes, even
      // where the browser would let it play. Said first, before anything is
      // scheduled on it: the browser then knows the context is paused on
      // purpose, and does not warn about every primed source that "was not
      // allowed to start" (32 console warnings otherwise).
      if (!unlocked) context.suspend().catch(() => {});
      build(context);
    } catch (e) {
      // Nothing half-built is left behind: no audio at all rather than a
      // mixer that is missing parts.
      if (ac) ac.close().catch(() => {});
      ac = null; mixer = null; director = null;
      live = false;
      unavailable = true;
      return;
    }
  }

  // (Re)start the context, creating it first if prepare() has not got to it
  // yet. Must run inside a user gesture the first time: the browser leaves
  // the context suspended otherwise.
  function unlock(e) {
    if (disposed || unavailable || muted || (inert && !asked)) return;
    // A press on a link is on its way out of the page, not into the game:
    // the bed would start for the moment the navigation takes.
    if (e && e.target && e.target.closest && e.target.closest('a[href]')) return;
    unlocked = true;
    // (What a gesture costs here is kept: the page's other handlers of the
    // same press are not this one's to answer for, and a check that times
    // the press as a whole cannot tell them apart.)
    const t0 = performance.now();
    if (!ac) create();
    if (ac && ac.state !== 'running' && !document.hidden) ac.resume().then(refreshLive, () => {});
    const ms = performance.now() - t0;
    if (ms > st.unlockMs) st.unlockMs = ms;
  }

  // Sources for the voices that have none ready (see SPARES_LOW), in a
  // task between frames. What it costs is counted: it is this thread's time
  // as much as update()'s is.
  function refill() {
    refilling = false;
    if (disposed || !mixer || !live) return;
    const t0 = performance.now();
    // (What the frame parked first: it is owed. Then sources for later.)
    st.drained += mixer.drain(ac.currentTime, SPARE_BATCH);
    mixer.spare(SPARE_BATCH);
    st.refillMs += performance.now() - t0;
    st.refills++;
    if (mixer.spares < SPARES_LOW || mixer.qLen > 0) { refilling = true; setTimeout(refill, 0); }
  }

  // Everything in flight, dropped: voices, parked starts, clouds, the bed.
  function flush() {
    if (!mixer) return;
    mixer.silence();
    director.reset();
  }

  // (A slider or a tick box is not somewhere to type: M with the settings'
  // volume slider in focus must still mute.)
  const typingIn = (t) => !!t && ((t.tagName === 'INPUT' && !NOT_TYPED.test(t.type)) || t.tagName === 'TEXTAREA' || t.isContentEditable);
  function onKey(e) {
    if (e.code === 'KeyM' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!typingIn(e.target)) api.setMuted(!muted);
    }
    // The horn, for as long as H is down (it sounds only at a wheel: the
    // director sees to that).
    if (e.code === HORN_KEY && !e.ctrlKey && !e.metaKey && !e.altKey && director && !typingIn(e.target)) director.horn = true;
    unlock();
  }
  function onKeyUp(e) {
    if (e.code === HORN_KEY && director) director.horn = false;
  }
  // (A key let go while the page is not looking is never heard of again.)
  function onBlur() {
    if (director) director.horn = false;
  }

  function onVisibility() {
    if (!ac) return;
    // A hidden tab gets no frames, so nothing would steer the mix: stop the
    // audio clock rather than let beds and tails play on unattended.
    if (document.hidden) ac.suspend().catch(() => {});
    else if (!muted && unlocked) ac.resume().then(refreshLive, () => {});
  }

  const passive = { capture: true, passive: true };
  function listen(on) {
    const f = on ? 'addEventListener' : 'removeEventListener';
    window[f]('pointerdown', unlock, passive);
    window[f]('touchend', unlock, passive);
    window[f]('keydown', onKey, passive);
    window[f]('keyup', onKeyUp, passive);
    window[f]('blur', onBlur, passive);
    // A pad shows itself to the page at its first button press, and a game
    // can be started with nothing else (the shell lets A do it): ask then
    // too. Whether the browser counts that press as a gesture is its
    // business; if it does not, the context starts at the next one that it
    // does count, having been asked.
    window[f]('gamepadconnected', unlock);
    document[f]('visibilitychange', onVisibility);
  }

  const api = {
    update(out, listener) {
      const total = out[OUT.EVENT_TOTAL];
      if (out[OUT.STAT_FRAME] !== seenStep) { seenStep = out[OUT.STAT_FRAME]; steppedAt = performance.now(); }
      // Wrapping difference: correct across u32 overflow.
      let fresh = lastTotal < 0 ? 0 : (total - lastTotal) >>> 0;
      lastTotal = total;
      if (!live) return;
      // A camera that is not a number (a blow-up somewhere else in the game)
      // costs this frame's sounds and nothing more. Past this point it would
      // reach AudioParams, which throw, and an exception out of here stops
      // the game's frame loop.
      const pos = listener.pos;
      const sum = pos[0] + pos[1] + pos[2] + listener.yaw + listener.pitch;
      if (!(sum - sum === 0)) { st.skipped++; return; }
      const t0 = performance.now();
      const count = out[OUT.EVENT_COUNT];
      if (fresh > count) fresh = count;
      // A step counter that went back is a new world (a restart, a replay
      // beginning): nothing of the old one is to be heard in it. A strike
      // called before a restart whistled on for four seconds over the new
      // world, and nothing landed.
      const step = out[OUT.STAT_FRAME];
      if (step < lastStep) { flush(); fresh = 0; }
      lastStep = step;
      mixer.frame(ac.currentTime, t0);
      mixer.setListener(pos, listener.yaw, listener.pitch);
      // What the frame says beyond its events (the game's clock): the
      // sim's frame, or the `frame` a tool's stand-in engine carries.
      const frame = sim ? sim.frame : ctx.engine.frame;
      // How fast the shell means the world to run: the frame loop says it
      // to the sim each frame (main.js, sim.rate: the game's time scale).
      // A sim nobody has said it to (a tool stepping one itself): nothing.
      director.pace(sim !== null && typeof sim.rate === 'number' ? sim.rate : -1);
      if (frame) director.state(frame);
      director.frame(sim ? sim.frame.f32 : ctx.engine.f32, out[OUT.EVENTS_PTR], count, fresh);
      mixer.endFrame();
      if (mixer.started !== startedSeen) {
        startedSeen = mixer.started;
        const a = mixer.active();
        if (a > st.voicesPeak) st.voicesPeak = a;
      }
      if (!injected && !refilling && (mixer.spares < SPARES_LOW || mixer.qLen > 0)) { refilling = true; setTimeout(refill, 0); }
      const ms = performance.now() - t0;
      st.frames++;
      st.lastMs = ms;
      st.avgMs += (ms - st.avgMs) * (st.frames < 50 ? 1 / st.frames : 0.02);
      if (ms > st.maxMs) st.maxMs = ms;
    },

    /**
     * The player's own shot of `tool` (a TOOL id), begun at the press: for
     * the shell to call when a press is one the world will answer with a
     * shot, before that frame's update(). The world's record of the shot
     * is then not heard again. Never in a replay.
     */
    press(tool) {
      // (A tool that is not a whole number is no tool: nothing was 0, and 0 is the hammer.)
      if (!live || tool !== (tool | 0)) return 0;
      return director.press(tool);
    },

    /** 0..1, a plain gain on the finished mix (0.5 is 6 dB down). */
    setVolume(v) {
      volume = v >= 0 ? (v <= 1 ? +v : 1) : 0;
      if (persist) store(KEY_VOLUME, volume);
      if (mixer && !muted) mixer.setVolume(volume);
    },

    setMuted(m) {
      muted = !!m;
      if (persist) store(KEY_MUTED, muted ? 1 : 0);
      clearTimeout(muteTimer);
      muteTimer = 0;
      if (mixer) mixer.setVolume(muted ? 0 : volume, 0.03);
      if (ac && !injected) {
        if (muted) {
          // When the fade is done, drop whatever was sounding: suspending
          // freezes the audio clock mid-flight, and without this the rest of
          // an explosion would play when the game is unmuted minutes later.
          // Then give the reverb time to ring out unheard, and stop the audio
          // thread: a muted game should cost nothing.
          muteTimer = setTimeout(() => {
            flush();
            muteTimer = setTimeout(() => {
              muteTimer = 0;
              if (muted && ac.state === 'running') ac.suspend().catch(() => {});
            }, MUTE_TAIL_MS);
          }, MUTE_FADE_MS);
        } else if (!document.hidden) {
          unlocked = true;
          ac.resume().then(refreshLive, () => {});
        }
      } else if (!muted && listening) {
        startBank();
        warm(false);
        unlock();
      }
      refreshLive();
    },

    setAmbience(on) {
      ambience = !!on;
      if (persist) store(KEY_AMBIENCE, ambience ? 1 : 0);
      if (director) director.ambience = ambience;
    },

    /**
     * 'high' (32 voices, convolution reverb) or 'low' (16 voices, a reverb
     * of feedback delays): the audio thread's peak load. Setting it turns
     * off the automatic choice.
     */
    setQuality(q) {
      quality = q === 'low' ? 'low' : 'high';
      qualityChosen = true;
      if (persist) store(KEY_QUALITY, quality);
      applyQuality();
    },

    setHrtf(on) {
      hrtf = !!on;
      if (persist) store(KEY_HRTF, hrtf ? 1 : 0);
      if (mixer) mixer.setHrtf(hrtf);
    },

    /** Start audio now, as a user gesture would. Resolves (once the whole
     *  bank is in and the spaces this quality uses are loaded) to whether
     *  sound is being scheduled. */
    async enable() {
      asked = true;
      warm(true);
      if (!injected) unlock();
      if (!ac) return false;
      await bankReady;
      // (The low quality's spaces are the cheap ones: see loadSpaces().)
      if (quality !== 'low') for (let i = 0; i < 2; i++) if (!mixer.irLoaded[i]) mixer.loadSpace(i);
      if (!injected && ac.state !== 'running') await ac.resume().catch(() => {});
      refreshLive();
      return live;
    },

    stats() {
      st.muted = muted; st.volume = volume; st.ambience = ambience; st.hrtf = hrtf; st.quality = quality;
      st.running = live;
      st.state = inert && !asked ? 'harness' : unavailable ? 'unavailable' : muted ? 'muted' : injected ? 'running' : !ac || !unlocked ? 'locked' : ac.state;
      st.prepared = !!ac;
      st.bankSounds = bankSounds; st.bankMs = bankMs;
      if (mixer) {
        mixer.now = ac.currentTime;
        st.droneWrites = mixer.droneWrites;
        st.retimes = mixer.retimes;
        // (How far the world's bus is turned down by the hold, dB.)
        st.hold = 20 * Math.log10(mixer.holdG); st.holdMost = 20 * Math.log10(mixer.holdLow);
      st.voices = mixer.active();
        // (The spaces ready to sound: at the low quality the cheap ones,
        // which are made with it; else those whose response is loaded.)
        st.spaces = mixer.reverbLow ? 2 : (mixer.irLoaded[0] ? 1 : 0) + (mixer.irLoaded[1] ? 1 : 0);
        st.started = mixer.started; st.stolen = mixer.stolen; st.dropped = mixer.dropped; st.culled = mixer.culled; st.deferred = mixer.deferred; st.expired = mixer.expired;
        st.events = director.events; st.exact = director.exact; st.grains = director.grains; st.summarised = director.summarised; st.rejected = director.rejected;
        st.whistles = director.whistles; st.whistlesCut = director.whistlesCut;
        // (Shots begun at a press; the world's records of them that were
        // then not heard again; claims that ran out with no record.)
        st.presses = director.presses; st.pressesPaired = director.pressesPaired; st.pressesLapsed = director.pressesLapsed;
      }
      return st;
    },

    get volume() { return volume; },
    get muted() { return muted; },
    /** Resolves when every sound has been rendered. */
    ready: bankReady,
    /** For checks and debugging. */
    get mixer() { return mixer; },
    get director() { return director; },

    dispose() {
      disposed = true;
      live = false;
      clearTimeout(muteTimer);
      if (listening) listen(false);
      if (worker) { worker.terminate(); worker = null; }
      if (ac && !injected && ac.state !== 'closed') ac.close().catch(() => {});
    },
  };

  if (injected) build(injected);
  else if (listening) {
    listen(true);
    // Render the bank and rehearse while the player is still reading the
    // overlay, unless they left the game muted (then wait until they ask
    // for sound).
    if (!muted) {
      startBank();
      warm(false);
      prepare();
    }
  }
  return api;
}
