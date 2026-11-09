// Replays: the "Watch replay" buttons, the bar that goes with a replay, and
// the camera and time scale while one plays. The engine records, plays back
// and directs (engine/src/replay.rs); this file only asks, through the sim:
// what a replay is doing rides in every frame (`frame.replay`, and the
// block out slot REPLAY_PTR points at), what is asked of it is a command.
//   createReplay(ctx, hooks) -> { active, timeScale, sync(), camera(out,
//   renderer), frame(out), key(code), begin(), exit() }
// hooks from the game shell: setMode(m), reinit() (the engine was
// re-initialised: renderer, meshes and counters start over), restart(),
// ended(), curtain(on) (cover the scene while the engine starts over).
import { OUT, REPLAY, REPLAY_MODE, SHOT } from './engine.js';

// Fixed speeds the button steps through; 0 is the director's own proposal
// (slow motion at the peaks), with quiet stretches run fast.
const SPEEDS = [0, 0.25, 0.5, 1, 2, 4];
const QUIET_SPEED = 4;
// Steps of nothing happening ahead before a quiet stretch is run fast, and
// how long before the next thing it returns to normal speed.
const QUIET_STEPS = 150;
// Skipping ahead: a frame steps for this many milliseconds (at least one
// step) and is not drawn, bar the odd frame to show where it has got to:
// where a frame is dear a skip that drew every step it took was slower
// than watching. With the sim on another thread the steps are asked for
// in batches instead, one batch out at a time.
const SKIP_BUDGET = 12;
const SKIP_BATCH = 12;
// Skipping stops this many steps before the action.
const SKIP_LEAD = 100;
const SHOT_NAMES = { [SHOT.WIDE]: 'Wide', [SHOT.TRACK]: 'Tracking', [SHOT.LOW]: 'Low angle', [SHOT.ORBIT]: 'Orbit' };

const clock = (steps) => {
  const s = Math.floor(steps / 60);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function createReplay(ctx, hooks) {
  const { sim, canvas } = ctx;
  const $ = (id) => document.getElementById(id);
  const bar = $('replay'), fill = $('rp-fill'), time = $('rp-time'), shotEl = $('rp-shot-name');
  const pauseBtn = $('rp-pause'), speedBtn = $('rp-speed'), againBtn = $('rp-again');
  const openers = [$('score-replay'), $('menu-replay')];
  let serial = sim.frame.replay[REPLAY.SERIAL];
  let active = false, paused = false, speed = 0, skipTo = -1, beginning = false, batchOut = false;
  // What the bar last showed, and the last block read.
  let shown = { fill: -1, time: '', shot: -1, mode: -1, speed: -1, paused: null, can: null };
  let mode = 0, step = 0, length = 0, quiet = 0, proposed = 1, aspect = 0;

  function read() {
    const s = sim.frame.replay;
    mode = s[REPLAY.MODE];
    step = s[REPLAY.STEP];
    length = s[REPLAY.LENGTH];
    quiet = s[REPLAY.QUIET];
    proposed = s[REPLAY.TIMESCALE];
    return s;
  }

  function tellAspect() {
    const a = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    if (a !== aspect) sim.command('replayAspect', aspect = a);
  }

  // Ask the engine to play the newest session back. Whether it did shows in
  // the first frame after the command (the playback's serial has moved on);
  // if it did not, the curtain that was put up for it comes down again.
  function start() {
    const before = sim.frame.replay[REPLAY.SERIAL];
    sim.after(sim.command('replayBegin'), () => {
      if (sim.frame.replay[REPLAY.SERIAL] === before) hooks.curtain(false);
    });
  }

  const api = {
    get active() { return active; },
    get paused() { return paused; },
    // Stepping ahead without drawing: the frame loop keeps the last picture.
    get skipping() { return skipTo >= 0; },
    // What the frame loop multiplies time by.
    get timeScale() {
      if (!active || paused || skipTo >= 0 || mode !== REPLAY_MODE.PLAYING) return 0;
      if (speed) return speed;
      return quiet > QUIET_STEPS ? QUIET_SPEED : proposed;
    },

    // Once per frame, before the sim steps. A playback is noticed however
    // it began (the button here, or a script calling engine.replayBegin),
    // and so is its end (the engine was initialised again).
    sync() {
      const s = read();
      if (s[REPLAY.SERIAL] !== serial) {
        serial = s[REPLAY.SERIAL];
        hooks.curtain(false);
        active = true;
        paused = false;
        skipTo = -1;
        hooks.reinit();
        hooks.setMode('replay');
      } else if (active && mode === REPLAY_MODE.OFF) {
        active = false;
        hooks.ended();
      }
      if (!active) return;
      // (Before the first step of a playback a script began: the engine
      // frames the opening shot again for the picture.)
      tellAspect();
      if (skipTo >= 0) {
        // Skipping ahead: step without drawing for a few milliseconds a
        // frame, so the page stays alive however long the stretch is.
        if (sim.remote) {
          // (The steps are run where the engine is; the frame that shows
          // them says how far that got.)
          if (!batchOut && step < skipTo && mode === REPLAY_MODE.PLAYING) {
            batchOut = true;
            const done = () => { batchOut = false; };
            sim.step(Math.min(SKIP_BATCH, skipTo - step)).then(done, done);
          }
        } else {
          const until = performance.now() + SKIP_BUDGET;
          while (step < skipTo && mode === REPLAY_MODE.PLAYING) {
            sim.step(1);
            read();
            if (performance.now() >= until) break;
          }
        }
        if (step >= skipTo || mode !== REPLAY_MODE.PLAYING) skipTo = -1;
        // The bar keeps up on frames that are not drawn (the block the
        // last frame pointed at is the one just read).
        if (ctx.lastOut) api.frame(ctx.lastOut);
      }
    },

    // The director's camera for the frame being drawn (out is that frame's
    // out block: the camera in it is at the frame's alpha).
    camera(out, renderer) {
      const p = out[OUT.REPLAY_PTR] >> 2, f = sim.frame.f32, cam = renderer.cam;
      cam.pos[0] = f[p + REPLAY.CAM_X];
      cam.pos[1] = f[p + REPLAY.CAM_Y];
      cam.pos[2] = f[p + REPLAY.CAM_Z];
      cam.yaw = f[p + REPLAY.CAM_YAW];
      cam.pitch = f[p + REPLAY.CAM_PITCH];
      renderer.fov = f[p + REPLAY.CAM_FOV];
    },

    // The bar. Nothing is written to the DOM that has not changed.
    frame(out) {
      const can = sim.frame.f32[(out[OUT.REPLAY_PTR] >> 2) + REPLAY.RECORDED] > 0;
      if (can !== shown.can) for (const b of openers) b.disabled = !(shown.can = can);
      if (!active) return;
      const p = out[OUT.REPLAY_PTR] >> 2, f = sim.frame.f32;
      const at = f[p + REPLAY.STEP], len = f[p + REPLAY.LENGTH], m = f[p + REPLAY.MODE], shot = f[p + REPLAY.SHOT];
      const pct = len > 0 ? Math.round(at * 1000 / len) : 0;
      if (pct !== shown.fill) fill.style.transform = `scaleX(${(shown.fill = pct) / 1000})`;
      const t = `${clock(at)} / ${clock(len)}`;
      if (t !== shown.time) time.textContent = shown.time = t;
      if (shot !== shown.shot || m !== shown.mode) {
        shown.shot = shot;
        shotEl.textContent = m === REPLAY_MODE.FINISHED ? 'End of replay' : SHOT_NAMES[shot] || '';
      }
      if (m !== shown.mode) {
        shown.mode = m;
        bar.classList.toggle('done', m === REPLAY_MODE.FINISHED);
        againBtn.hidden = m !== REPLAY_MODE.FINISHED;
      }
      if (paused !== shown.paused) pauseBtn.textContent = (shown.paused = paused) ? 'Play' : 'Pause';
      if (speed !== shown.speed) speedBtn.textContent = (shown.speed = speed) ? `${speed}x` : 'Auto';
    },

    begin() {
      // The picture's shape first: the opening shot is framed for it.
      // sync() does the rest on the next frame.
      tellAspect();
      // Beginning re-initialises the engine, which on this thread blocks
      // for the best part of a second: the curtain goes up first, and the
      // page gets to paint it. (Under the harness nothing paints: begin at
      // once, and say whether it began.)
      if (ctx.harness || beginning) {
        const before = sim.frame.replay[REPLAY.SERIAL];
        start();
        return sim.remote || sim.frame.replay[REPLAY.SERIAL] !== before;
      }
      if (!(sim.frame.replay[REPLAY.RECORDED] > 0)) return 0;
      beginning = true;
      hooks.curtain(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        beginning = false;
        start();
      }));
      return 1;
    },
    exit() {
      if (!active) return;
      active = false;
      hooks.restart();
    },
    pause(on = !paused) { paused = on; },
    nextSpeed() { speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]; },
    nextShot() { sim.command('replayNextShot'); },
    // To just before the next thing that happens (or the end).
    skip() {
      read();
      if (mode === REPLAY_MODE.PLAYING) skipTo = Math.min(length, step + Math.max(60, quiet - SKIP_LEAD));
    },
    key(code) {
      if (code === 'Space' || code === 'KeyP') api.pause();
      else if (code === 'KeyN') api.nextShot();
      else if (code === 'KeyT') api.nextSpeed();
      else if (code === 'ArrowRight') api.skip();
      else if (code === 'Escape') api.exit();
      else if (code === 'KeyR' && mode === REPLAY_MODE.FINISHED) api.begin();
      else return false;
      return true;
    },
  };

  for (const b of openers) b.addEventListener('click', (ev) => { ev.stopPropagation(); api.begin(); });
  pauseBtn.addEventListener('click', () => api.pause());
  speedBtn.addEventListener('click', api.nextSpeed);
  $('rp-shot').addEventListener('click', api.nextShot);
  $('rp-skip').addEventListener('click', api.skip);
  againBtn.addEventListener('click', api.begin);
  $('rp-exit').addEventListener('click', api.exit);
  return api;
}
