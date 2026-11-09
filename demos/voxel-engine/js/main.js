// Boot and frame loop. Subsystems plug in through createGame / createAudio /
// Renderer; this file should stay small.
import { OUT, SIM_DT } from './engine.js';
import { LocalSim } from './sim_local.js';
import { WorkerSim } from './sim_remote.js';
import { Renderer } from './renderer.js';
import { createGame } from './game.js';
import { SCENES, SCENE_SUN } from './game_settings.js';
import { createAudio } from './audio.js';
import { createGovernor } from './governor.js';
import { createLedger } from './frame_ledger.js';

const params = new URLSearchParams(location.search);
// Where the page gets no query string (some hosts strip it), the scene picked
// on the start card is remembered for the tab instead: a link's ?scene= wins,
// then what was picked, then the town.
if (!params.has('scene')) {
  try {
    const picked = sessionStorage.getItem('vx.scene');
    if (picked != null && /^\d+$/.test(picked)) params.set('scene', picked);
  } catch (e) { /* no storage: the default scene */ }
}
const HARNESS = params.has('harness');
const canvas = document.getElementById('view');
const overlay = document.getElementById('overlay');

// Where the engine runs. In a worker, a slow step never holds up a frame;
// on this thread the game is what it always was. Which, when nobody says:
// a worker (docs/reports/worker.md has what that was held to). The switch
// is this line: false, and the game is on this thread unless ?worker=1.
const WORKER_BY_DEFAULT = true;
// Who keeps the clock when the sim is in a worker (sim_remote.js): the
// worker, and the world runs at the clock's pace however seldom the page
// draws; or the page, and the world gets what each frame asks for.
// ?pace=worker or ?pace=page says which; nobody says: this line.
const WORKER_KEEPS_CLOCK = true;
// In order:
//   - ?harness: this thread (driven step by step);
//   - told not to (?worker=0, or a tool that set window.__vxWorker = false
//     before the page's scripts ran): this thread;
//   - told to (?worker=1, or window.__vxWorker = true): a worker;
//   - else the default above. (VR too: it asks for its rays with sim.ask
//     where the engine is on another thread, xr_host.js.)
// A worker that is wanted and cannot be had (no workers in this browser,
// none could be started, the engine did not load in one: sim_remote.js,
// WorkerSim.create, has the ways tried) is one console warning that says
// why, then this thread. `sim.how` says which it was and why.
async function createSim(opts) {
  const asked = params.get('worker'), told = window.__vxWorker;
  let why = HARNESS ? '?harness' : asked === '0' ? '?worker=0' : told === false ? 'window.__vxWorker' : '';
  if (!why && asked !== '1' && told !== true && !WORKER_BY_DEFAULT) why = 'the default';
  if (!why && typeof Worker !== 'function') why = 'no workers here';
  let failed = '';
  if (!why) {
    try {
      return await WorkerSim.create('engine.wasm', opts);
    } catch (e) {
      failed = String(e.message || e);
      console.warn(`No simulation worker (${failed}): running on the main thread.`);
    }
  }
  const sim = await LocalSim.create('engine.wasm', opts);
  sim.how = why || `no worker (${failed})`;
  return sim;
}

async function boot() {
  const scene = Number(params.get('scene') || 0), seed = Number(params.get('seed') || 1);
  // ?warm=0 skips the warm-up (for measuring what it buys).
  const pace = params.get('pace') === 'worker' || (params.get('pace') !== 'page' && WORKER_KEEPS_CLOCK) ? 'worker' : 'page';
  // ?quadindex=0: the page reads the quad rows itself, as it did before the
  // worker sent its own account of them with the packet.
  // ?mesher=away: the world's coarse meshes are made by a worker of the
  // simulation's own, a frame late (mesh_away.js; off as shipped).
  const sim = await createSim({ scene, seed, warm: params.get('warm') !== '0', pace, index: params.get('quadindex') !== '0', mesher: params.get('mesher') || '', weak: Number(params.get('weak')) || 0 });
  // ?tween=0: frames between two packets hold the world still, as they did
  // before sim_tween.js (for comparing; a sim on this thread has no packets).
  // ?tween=2: the picture between packets goes by the world's own time,
  // ?tween=1: by when each packet was taken (sim_tween.js: `even`).
  // ?weak=18 (above): every step of the worker's costs 18 ms at least.
  if (sim.tween && params.get('tween') === '0') sim.tween.enabled = false;
  if (sim.tween && params.get('tween') === '2') sim.tween.even = true;
  if (sim.tween && params.get('tween') === '1') sim.tween.even = false;
  // The pointer lock let go (the browser's Esc: the game pauses): a clock
  // kept by the worker stops now, not with the next frame, which on a slow
  // picture is a second of the world away. The next frame names the rate
  // again, whatever the game then is.
  if (sim.stand) document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement) sim.stand(); });
  const renderer = new Renderer(canvas, sim);
  // (A worker's packets say what changed in the quad lists since the one
  // before: the renderer takes that from every packet as it comes in, and
  // not at the draw, so that one never drawn loses nothing.)
  if (sim.remote && renderer.taken) sim.onTake = (frame) => renderer.taken(frame);
  const sun = SCENE_SUN[SCENES[scene]];
  if (sun) renderer.setSun(sun[0], sun[1]);
  // (?hour=22.5: the scene at another hour of its day, the lamps with it. For a look, not a mode of play.)
  if (params.has('hour')) renderer.timeOfDay = Number(params.get('hour'));
  if (params.has('scale')) renderer.renderScale = Number(params.get('scale'));
  renderer.ground.height = sim.sceneSurround(scene);
  // lastOut: the out block of the newest frame, null until there is one.
  const ctx = { sim, renderer, canvas, params, harness: HARNESS, get lastOut() { return sim.frame.out; } };
  // How game time runs against the clock (it only measures: a slow
  // machine gets slow motion and is told so, never a different world).
  const governor = createGovernor(sim);
  ctx.governor = governor;
  // ?effort=x sets the engine's level for what is shown (nothing the
  // simulation decides follows from it: tools/critic/mayhem_score.mjs
  // plays a round at both ends to see that it stays so).
  if (params.has('effort')) sim.command('effort', Number(params.get('effort')));
  // Start the same scene over (game.js binds this to a key). Returns the
  // command's serial: what was mirrored of the old world goes when the new
  // one's first frame is in (sim.after), which on this thread is at once.
  // (Restarts asked for faster than worlds are built are all answered by one
  // frame: what was mirrored goes once for it, not once for each.)
  let resetFor = -1;
  ctx.restart = () => {
    const at = sim.command('init', scene, seed);
    governor.reset();
    if (renderer.reset) {
      sim.after(at, () => {
        const seq = sim.frame.seq;
        if (seq === resetFor) return;
        resetFor = seq;
        renderer.reset();
      });
    }
    return at;
  };
  const game = createGame(ctx);
  const audio = createAudio(ctx);
  ctx.game = game;
  ctx.audio = audio;
  // What a frame costs outside the step, counted (frame_ledger.js).
  ctx.ledger = createLedger(ctx);
  // The scene decides where the player starts and which way they face.
  if (game.look) { const c = sim.frame.camera; game.look.yaw = c[3]; game.look.pitch = c[4]; }

  let last = performance.now();

  function draw(frame) {
    const out = frame.out, c = frame.camera, alpha = frame.alpha;
    // The sim camera of the last two steps, interpolated.
    const prev = frame.camPrev, cur = frame.camCur;
    const cam = renderer.cam;
    cam.pos[0] = prev[0] + (cur[0] - prev[0]) * alpha;
    cam.pos[1] = prev[1] + (cur[1] - prev[1]) * alpha;
    cam.pos[2] = prev[2] + (cur[2] - prev[2]) * alpha;
    // Look direction comes straight from input for zero-latency mouse feel.
    cam.yaw = game.look ? game.look.yaw : c[3];
    cam.pitch = game.look ? game.look.pitch : c[4];
    renderer.fov = c[5];
    // Camera shake and fov punch from the game shell, on top of the above.
    if (game.cameraOffset) game.cameraOffset(out, renderer);
    // In VR the same frame is drawn once per eye, from the head (xr.js).
    if (ctx.xr) ctx.xr.render(out);
    else renderer.render(out);
    audio.update(out, cam);
    return out;
  }

  // A frame in two halves: begin() gives the game and the sim their time,
  // finish() draws. Between the two a frame may wait a moment (begin()
  // returns what for): with the clock in a worker and frames far apart,
  // for the answer to the request it has just posted, so that it draws the
  // world as it stands now and not as the frame before asked for it
  // (sim_remote.js, answerSoon). F: what the first half hands the second.
  const F = { now: 0, real: 0, dt: 0, steps: 0, simMs: 0, workMs: 0 };
  function begin(now) {
    // (Never negative: the first frame after boot is stamped with the time
    // that frame began, which is before boot finished and `last` was set.)
    // (`real`: the time that passed. `dt`: what the game is given of it;
    // past a tenth of a second the rest is not played.)
    const real = Math.max((now - last) / 1000, 0), dt = Math.min(real, 0.1);
    last = now;
    renderer.frameBegan(now);
    const t0 = performance.now();
    game.update(dt);
    // In VR the controllers are the input (after the shell has had its say).
    if (ctx.xr) ctx.xr.update(dt);
    // game.timeScale: 1 normal, 0.2 slow motion, 0 paused.
    // How many steps that is, is the sim's business (never a spiral: a sim
    // that cannot keep up runs fewer steps and drops the time, so heavy
    // destruction is slow motion, not a slide show; sim_local.js, advance,
    // and sim_remote.js, stepsThatFit).
    const seconds = dt * (game.timeScale ?? 1), s0 = performance.now();
    // (For a sim that keeps the clock itself, sim_remote.js: the rate game
    // time runs at while it runs. Not a second argument of advance(): the
    // sim on this thread takes a number of steps there.)
    sim.rate = game.timeScale ?? 1;
    // (Not in VR: a headset's frame is drawn in the callback that began it.)
    sim.patient = !ctx.xr && clock === window;
    // (The time the display gave this frame: sim_remote.js, `at`.)
    sim.at = now;
    F.steps = sim.advance(seconds);
    F.simMs = performance.now() - s0;
    F.now = now; F.real = real; F.dt = dt;
    F.workMs = performance.now() - t0;
    return sim.patient && sim.answerSoon ? sim.answerSoon() : null;
  }

  function finish() {
    const t1 = performance.now(), now = F.now;
    // (The answer the frame waited for, if it came.)
    if (sim.arrive) F.steps += sim.arrive();
    const steps = F.steps;
    // (sim.pending: a frame has come in from a sim on another thread, the
    // answer to a command perhaps; it is shown whatever else stands still.
    // sim.moving: bodies are still on their way to where the last one has
    // them, sim_tween.js.)
    if (steps === 0 && !sim.pending && !sim.moving && ctx.lastOut && game.idle && game.idle(now)) {
      // Frozen sim, nothing new to show (start card, menu, pause): the
      // canvas keeps the last frame instead of rendering it again.
      audio.update(ctx.lastOut, renderer.cam);
      renderer.idle();
    } else {
      const out = draw(sim.prepare());
      // (This thread's work in the frame: the time it waited is not in it.)
      const cpuMs = F.workMs + performance.now() - t1;
      game.hud(out, { dt: F.dt, cpuMs });
      // Whether the sim kept up: the HUD says when it did not. (Against
      // the time that passed, not the tenth of a second the game is given
      // of a longer frame: the mark said twice the truth at 8 frames a
      // second.) A worker that keeps the clock says itself what its clock
      // asked of it for the steps this frame took: the page's frames say
      // nothing about that (and one longer than a second is no stall
      // there, which is what the governor takes it for).
      const told = sim.asked ? sim.asked() : -1;
      if (told >= 0) governor.frame(steps, told, Math.min(F.real * 1000, 1000), F.simMs, cpuMs);
      // (sim.stood: time a hit-stop took, sim.hold(): not asked of the world.)
      else governor.frame(steps, Math.max(0, F.real * (game.timeScale ?? 1) - (sim.stood || 0)), F.real * 1000, F.simMs, cpuMs);
    }
  }

  // A trap in the engine, on this thread or in the worker (or any throw in a
  // frame), must not leave a frozen picture with the pointer still locked:
  // the loop ends here and the shell goes to its final state (game.stop: the
  // card, the pointer let go, and no way back into play but a reload).
  let dead = false;
  function stop(e) {
    dead = true;
    console.error(e);
    // (A worker that trapped or stopped answering has nothing more to do.)
    if (sim.dispose) sim.dispose();
    game.stop(String(e.message || e));
    // No frame will steer the mix again: beds and tails would play on.
    audio.dispose();
  }
  function frame(now) {
    if (dead) return;
    inFrame = true;
    let wait = null;
    try {
      wait = begin(now);
      if (!wait) finish();
    } catch (e) {
      stop(e);
      return;
    }
    if (wait) {
      waitFrom = performance.now();
      wait.then(drawn);
      return;
    }
    ctx.waitMs = 0;
    inFrame = false;
    pending = clock.requestAnimationFrame(frame);
  }
  // The second half of a frame that waited. (ctx.waitMs: how long, for
  // the frame's ledger: time this thread was free, between the frame's two
  // halves; 0 in a frame that did not wait.)
  let waitFrom = 0;
  function drawn() {
    if (dead) return;
    ctx.waitMs = performance.now() - waitFrom;
    try {
      finish();
    } catch (e) {
      stop(e);
      return;
    }
    inFrame = false;
    pending = clock.requestAnimationFrame(frame);
  }
  // What paces the loop: the window, or a VR session for as long as one
  // lasts (xr.js). The frame waiting on the old clock is cancelled, so the
  // loop never runs on both.
  let clock = window, pending = 0, inFrame = false;
  ctx.setClock = (next) => {
    try { clock.cancelAnimationFrame(pending); } catch (e) { /* a session that has ended has nothing pending */ }
    clock = next || window;
    // (Asked from inside a frame, that frame books the next one itself.)
    if (!dead && !HARNESS && !inFrame) pending = clock.requestAnimationFrame(frame);
    // False when there is no loop to pace (it stopped on a trap).
    return !dead && !HARNESS;
  };

  // What the shell asked of the sim while it was being built (settings, the
  // world meshed, an objective) shows in the frame before anything is drawn.
  await sim.flush();

  // The land beyond the box (?far=0 leaves it out of the picture): asked of
  // the sim once, it is the same for every restart of the scene. The
  // harness waits for it, so that its first frame has it; a page whose
  // answer comes after its first frame (the sim in a worker) draws that
  // frame once more, or a game standing still behind its start card would
  // show the world without it until play began.
  if (params.get('far') !== '0' && renderer.setFar) {
    const far = sim.ask('far', scene, seed).then((block) => {
      renderer.setFar(block);
      if (!HARNESS && !dead && ctx.lastOut) draw(sim.frame);
    }, (e) => console.warn(`No far field: ${e}`));
    if (HARNESS) await far;
  }

  // Deterministic hooks for the capture/benchmark harness and the console.
  window.__vx = {
    // (`engine` is the engine while the sim runs on this thread; with the
    // sim in a worker it is a stand-in that reads the newest frame and sends
    // everything else as a command. `step` and `draw` need the engine here.)
    sim, engine: sim.engine, renderer, game, audio, ctx, OUT,
    frame: ctx.ledger,
    cam: renderer.cam,
    // Advance n fixed steps (game.update is called once per step so scripted
    // input behaves like real input). With the sim in a worker the steps
    // are run there, on top of what the clock asks for, and what comes back
    // is a promise for the frame that shows them: `await vx.step(n)` is
    // right on either transport. A world that stands is then shown at the
    // step that was run (sim.poseAt), on either. `draw` needs the engine here.
    step: sim.remote
      ? (n = 1) => { for (let i = 0; i < n; i++) game.update(SIM_DT); return sim.step(n); }
      : (n = 1) => { for (let i = 0; i < n; i++) { game.update(SIM_DT); sim.step(1); } sim.poseAt(1); },
    draw: sim.remote ? undefined : () => draw(sim.prepare(1)),
    // The frame the sim has now, drawn once more (on either transport): for
    // a tool that reads the canvas back in the same task.
    redraw: () => draw(sim.frame),
    setCamera(x, y, z, yaw, pitch) {
      sim.command('setCamera', x, y, z, yaw, pitch);
      if (game.look) { game.look.yaw = yaw; game.look.pitch = pitch; }
    },
    ready: true,
  };

  if (HARNESS) {
    overlay.style.display = 'none';
    draw(sim.prepare(1));
  } else {
    pending = requestAnimationFrame(frame);
  }
  // VR is offered where the browser has WebXR; none of its code is fetched
  // anywhere else, and the mode itself only when it is asked for.
  if (navigator.xr) import('./xr_entry.js').then((m) => m.offer(ctx), () => {});
}

boot().catch((e) => {
  console.error(e);
  overlay.style.display = '';
  overlay.innerHTML = `<div class="card"><h1>Could not start</h1><p>${String(e.message || e)}</p></div>`;
});
