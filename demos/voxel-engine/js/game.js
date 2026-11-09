// The game shell: input, play/menu state, and the glue between the HUD,
// settings, camera feel and touch modules. The tools themselves run inside
// the engine; this file only turns keys, mouse and touches into
// sim.input(...) calls.
// Contract with main.js: createGame(ctx) -> { update(dt), hud(out, timing),
// cameraOffset(out, renderer), look, timeScale, stop(reason) }.
//   ctx = { sim, renderer, canvas, params, harness, restart() }
// update() runs once per rendered frame before the sim steps, cameraOffset()
// after main.js has set the render camera, hud() after the frame is drawn.
// stop() is for the frame loop when it ends for good (the engine trapped).
import { BUTTON, OUT, PFLAG, PROF, SIM_DT, TOOL, TOOL_STATE } from './engine.js';
import { createSettings } from './game_settings.js';
import { createFeel } from './game_feel.js';
import { createPress, PRESS_BY_DEFAULT } from './game_press.js';
import { createHud } from './game_hud.js';
import { createObjective } from './game_objective.js';
import { createModes } from './game_modes.js';
import { createPerf } from './game_perf.js';
import { createReplay } from './game_replay.js';
import { createTally } from './game_tally.js';
import { createTouch } from './game_touch.js';
import { createVehicle } from './game_vehicle.js';

const SLOW_MOTION = 0.2;
const MOUSE_RATE = 0.0022; // rad per mouse count at sensitivity 1
const PITCH_LIMIT = 1.55;
const WHEEL_NOTCH = 50; // px of wheel travel per tool step
// With the sim frozen and nothing changing, the scene is redrawn this often
// anyway (ms), as a safety net for whatever the shell cannot see.
const IDLE_REDRAW = 500;
// Frames still drawn after the last change before the loop goes idle, for
// whatever takes a few frames to settle (uploads, temporal effects).
const SETTLE_FRAMES = 20;
// Chunks meshed per frame while a restarted scene loads behind the curtain.
const LOAD_BUDGET = 48;
// Browser shortcuts left alone even while playing (reload, address bar, tabs).
const PASS_WITH_CTRL = new Set(['KeyR', 'KeyL', 'KeyT', 'KeyN', 'KeyW', 'Tab']);

// A BROWSER THAT DOES NOT NAME THE PAGES THAT FRAME THIS ONE (location.ancestorOrigins; Firefox has none): the page,
// framed, says hello to the page at the top as soon as this file is read, and a top page that wants the bare opening
// answers { voxelEngine: 1, bare: 1 } to the window that said it. The engine is still loading then; the answer is read
// once, when the game is made. A top page that does not answer gets the page as it is anywhere. (`play=ask` takes this
// road in any browser: a test's.)
let bareAsked = false;
try {
  const ask = new URLSearchParams(location.search).get('play') === 'ask';
  if (window.top !== window && (ask || !location.ancestorOrigins)) {
    window.addEventListener('message', (e) => {
      if (e.source === window.top && e.data && e.data.voxelEngine === 1 && e.data.bare === 1) bareAsked = true;
    });
    window.top.postMessage({ voxelEngine: 1, state: 'hello' }, '*');
  }
} catch { /* no top page to tell: the page as it is anywhere */ }

export function createGame(ctx) {
  const { sim, canvas, params } = ctx;
  const body = document.body;
  const overlay = document.getElementById('overlay');
  const modeRoots = [document.getElementById('ui'), document.getElementById('touch')].filter(Boolean);
  const menu = document.getElementById('menu');
  const score = document.getElementById('score');
  const playBtn = document.getElementById('play');
  // FRAMED ON ANOTHER SITE'S PAGE (or `play=1` in the address; `play=0` leaves the page as it is anywhere). The browser
  // names the pages that frame this one; the host's own pages do not count. There the page stands BARE whenever
  // nobody is playing: no opening panel, nothing drawn over the world, the world standing still; the first press
  // anywhere takes the mouse and starts play; Esc from play is the bare state again, and one more Esc brings a panel.
  // The page at the top is told of every change (`tell`): 'ready' (bare, a press starts or resumes; first said once
  // he stands at the round's start), 'play' (the mouse is held), 'menu' (a panel or a card is up).
  // (Where the browser names no framing pages, the top page's own answer to this page's hello stands in: `bareAsked`.)
  const elsewhere = () => {
    try {
      const a = location.ancestorOrigins;
      for (let i = 0; a && i < a.length; i++) {
        const h = new URL(a[i]).hostname;
        if (!(h === 'spawn.co' || h.endsWith('.spawn.co') || h.endsWith('.spawnfile.io'))) return true;
      }
    } catch { /* an address that does not parse: not counted */ }
    return false;
  };
  const straight = !ctx.harness && (params.get('play') === '1' || (params.get('play') !== '0' && (bareAsked || (params.get('play') !== 'ask' && elsewhere()))));
  let panelUp = false, played = false, everDrawn = false, told = '', settled = false;
  // HE HAS ARRIVED at the round's start when the eye as it is drawn, having left the spot the page opened on, has stood
  // still for twenty drawn frames with the world running; or, where a round begins on that very spot, has not moved for
  // three seconds after the round was armed. Until then the world runs and nothing is said to the page above: the
  // first picture it shows is the view play begins from. (Stopped by a count of frames alone, a quick load froze him
  // on the way there.)
  const arrive = { has: false, x: 0, y: 0, z: 0, x0: 0, y0: 0, z0: 0, moved: false, still: 0, armed: 0, frames: 0 };
  const arriving = (out) => {
    const cam = ctx.renderer && ctx.renderer.cam, e = (cam && (cam.pos || cam.position)) || sim.frame.camera;
    if (!e) return;
    const x = e[0], y = e[1], z = e[2];
    if (!arrive.has) { arrive.has = true; arrive.x0 = x; arrive.y0 = y; arrive.z0 = z; arrive.x = x; arrive.y = y; arrive.z = z; return; }
    const d = Math.abs(x - arrive.x) + Math.abs(y - arrive.y) + Math.abs(z - arrive.z);
    arrive.x = x; arrive.y = y; arrive.z = z;
    if (Math.abs(x - arrive.x0) + Math.abs(y - arrive.y0) + Math.abs(z - arrive.z0) > 0.05) arrive.moved = true;
    arrive.still = d > 1e-4 ? 0 : arrive.still + 1;
    arrive.frames++;
    if (modes.armed) arrive.armed++;
    if ((modes.armed && arrive.moved && arrive.still >= 20) || arrive.armed >= 180 || arrive.frames >= 1500) settled = true;
  };
  const bare = () => straight && state.mode === 'start' && !panelUp;
  const tell = () => {
    if (!straight || state.mode === '') return;
    // ('ready' at the opening only when he has arrived at the round's start: `arriving`.)
    const s = state.mode === 'play' ? 'play' : !bare() ? 'menu' : everDrawn && !loading && !playBtn.disabled && (played || settled) ? 'ready' : '';
    if (!s || s === told) return;
    told = s;
    try { window.top.postMessage({ voxelEngine: 1, state: s }, '*'); } catch { /* no page above to tell */ }
  };
  const lay = () => {
    if (bare()) overlay.dataset.bare = '1'; else delete overlay.dataset.bare;
    tell();
  };
  if (straight) overlay.dataset.bare = '1';
  // Bare, the view answers the pointer by a few degrees, eased, and springs back: the world is seen to be live.
  const SWAY_YAW = 0.07, SWAY_PITCH = 0.035;
  const sway = { x: 0, y: 0, tx: 0, ty: 0 };
  const swayStep = (dt) => {
    const on = bare() && !loading && (played || settled), k = 1 - Math.exp(-Math.min(dt, 0.1) * 5);
    let nx = sway.x + ((on ? sway.tx : 0) - sway.x) * k, ny = sway.y + ((on ? sway.ty : 0) - sway.y) * k;
    if (!on && Math.abs(nx) < 1e-3 && Math.abs(ny) < 1e-3) nx = ny = 0;
    look.yaw -= (nx - sway.x) * SWAY_YAW;
    look.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, look.pitch - (ny - sway.y) * SWAY_PITCH));
    sway.x = nx; sway.y = ny;
  };
  const swayOff = () => { look.yaw += sway.x * SWAY_YAW; look.pitch += sway.y * SWAY_PITCH; sway.x = sway.y = sway.tx = sway.ty = 0; };
  const help = document.getElementById('help');
  const notes = [document.getElementById('lockmsg'), document.getElementById('menu-note')];
  const cam = sim.frame.camera;
  const look = { yaw: cam[3], pitch: cam[4] };
  const keys = new Set();
  // No pointer lock under the harness: play mode counts as captured there.
  const free = !!ctx.harness;
  const state = {
    look, tool: TOOL.ROCKET, lastTool: TOOL.HAMMER, slow: false, paused: false,
    mode: '', touch: false, forceTouch: params.get('touch') === '1', selectTool,
    // Tools that do anything right now, as a mask of 1 << TOOL.X: a
    // demolition objective can leave the player only some.
    allowed: (1 << TOOL.COUNT) - 1,
    // How fast the sim runs beside the player's own slow motion: the game
    // modes slow it for a moment when something big happens (game_juice.js).
    pace: 1,
  };
  const settings = createSettings(ctx);
  const feel = createFeel(ctx, settings, look);
  // The gun answers at the press (game_press.js): the view's kick here;
  // the shot's sound, the flash and a hand's pulse where their owners
  // listen (`press.on`).
  const asked = new URLSearchParams(location.search).get('press');
  const press = createPress(ctx, () => state.mode === 'play' && !state.paused, asked === '1' || (asked !== '0' && PRESS_BY_DEFAULT));
  press.on((tool) => feel.shot(tool));
  // (The shot's own sound, begun at the press: the audio keeps the pairing
  // with the world's event itself. Before the frame's audio.update(): a
  // press is answered at its event or when the frame begins, the audio is
  // updated when the frame is drawn. The audio is made after the game.)
  press.on((tool) => { const a = ctx.audio; if (a && a.press) a.press(tool); });
  const hud = createHud(ctx, state, feel);
  const perf = createPerf(ctx);
  const tally = createTally(ctx);
  const vehicle = createVehicle(ctx, look);
  const objective = createObjective(ctx, state, settings.scene, { capture, setMode, restart: () => ctx.restart() });
  // Replays: the engine was re-initialised for one (as after a restart,
  // but the settings and the chosen objective are the log's to apply), or
  // one was left by an init the shell did not make.
  const replay = createReplay(ctx, {
    setMode,
    restart: () => { ctx.restart(); setMode(free ? 'play' : 'start'); },
    reinit() {
      if (ctx.renderer.reset) ctx.renderer.reset();
      if (free) meshWorld();
      // (The frame that showed the playback has its world in it already.)
      else beginLoad(sim.frame.commands);
      if (document.pointerLockElement) document.exitPointerLock();
      feel.reset();
      perf.reset();
      tally.reset();
      wake();
    },
    ended: () => { if (state.mode === 'replay') setMode(free ? 'play' : 'start'); },
    // Before the engine blocks to start over; `reinit` takes it from there.
    curtain: (on) => { if (!loading) body.classList.toggle('loading', on); },
  });
  const touch = createTouch(ctx, state, settings, {
    look: turn,
    capture,
    menu: () => setMode('menu'),
    next: () => stepTool(1),
    heard: () => heard(),
  });
  // The game on top of the sandbox (Mayhem), and the gamepad.
  const modes = createModes(ctx, state, settings.scene, { capture, setMode, restart: () => ctx.restart(), turn, next: stepTool, objective, settings, feel, look, first: straight ? { mode: 'contract', job: 0 } : null });
  let pressed = 0, held = 0;
  let wheel = 0, lockTime = 0, rawInput = true;
  // What the last pointer press came from: on a machine with both, a tap
  // plays with the touch controls and a click still gets pointer lock.
  let lastPointer = '';
  const touchAllowed = params.get('touch') !== '0';
  // Look last seen in scripted mode, to tell which side changed it.
  let scriptYaw = look.yaw, scriptPitch = look.pitch;
  // What the last drawn frame showed, to tell when the next one would be
  // the same picture (see idle()).
  // (Floats in a typed array: written every frame without boxing.)
  const drawn = new Float64Array([NaN, NaN, 0]);
  let stale = true, calm = 0;
  const wake = () => { stale = true; };
  // Frame timing handed to the HUD when the harness, not a display, drives.
  const nominal = { dt: SIM_DT, cpuMs: 0, nominal: true };

  const locked = () => document.pointerLockElement === canvas;
  const captured = () => state.mode === 'play' && (locked() || free);

  // Mesh the whole world in one go. Left to the normal per-frame remesh
  // budget a fresh scene assembles itself chunk by chunk for a second while
  // the player is already standing in it. At boot (behind the start card)
  // and under the harness one stall is the better trade.
  function meshWorld() {
    sim.command('remeshAll');
  }

  // After a restart in the live game the same work is spread over frames
  // instead: a raised budget, the sim held still, and a curtain over the
  // scene until every chunk is meshed. No frame blocks for the whole world.
  // loadAt: the serial of the restart; frames from before it are still the
  // old world's and say nothing about how far the new one is.
  let loading = false, loadAt = 0;
  function beginLoad(at) {
    sim.command('loadBudget', LOAD_BUDGET);
    loading = true;
    loadAt = at;
    body.classList.add('loading');
  }
  function endLoad() {
    sim.command('loadBudget', 0);
    loading = false;
    body.classList.remove('loading');
  }

  function selectTool(t) {
    t = Math.max(0, Math.min(TOOL.COUNT - 1, t | 0));
    if (t === state.tool || !(state.allowed & (1 << t))) return;
    state.lastTool = state.tool;
    state.tool = t;
  }

  // The next tool along the belt in direction `dir` that may be used.
  function stepTool(dir) {
    for (let k = 1; k < TOOL.COUNT; k++) {
      const t = (state.tool + dir * k + TOOL.COUNT * k) % TOOL.COUNT;
      if (state.allowed & (1 << t)) return selectTool(t);
    }
  }

  function turn(dx, dy) {
    look.yaw -= dx;
    look.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, look.pitch - (settings.values.invertY ? -dy : dy)));
  }

  function release() {
    keys.clear();
    held = pressed = 0;
    touch.release();
  }

  function setTouch(on) {
    state.touch = on;
    body.classList.toggle('touch', on);
    playBtn.textContent = on ? 'Tap to play' : 'Click to play';
  }

  function note(text) {
    for (const el of notes) {
      el.textContent = text;
      el.hidden = !text;
    }
  }

  function setMode(m) {
    // 'stopped' is final: no frame will be drawn again, so no other mode
    // has anything to show. Every way back into play (Resume, Enter, a
    // click, the lock arriving, the score card) ends here or in capture().
    if (m === state.mode || state.mode === 'stopped') return;
    state.mode = m;
    if (m === 'play') { played = true; swayOff(); }
    // The mode's classes sit on the roots whose looks they change (the
    // HUD and the touch controls), not on body: a class changed on body
    // has every rule of the page matched again and the whole page laid
    // out, in the very frame that enters play.
    for (const root of modeRoots) {
      root.classList.toggle('mode-start', m === 'start');
      root.classList.toggle('mode-play', m === 'play');
      root.classList.toggle('mode-menu', m === 'menu');
      root.classList.toggle('mode-replay', m === 'replay');
    }
    document.getElementById('replay').hidden = m !== 'replay';
    overlay.style.display = m === 'start' || m === 'stopped' ? '' : 'none';
    menu.hidden = m !== 'menu';
    score.hidden = m !== 'score';
    // The start card is never shown again, so its list of controls moves
    // to the menu, where it can still be looked up.
    if (m === 'menu' && !help.querySelector('.keys')) help.append(...overlay.querySelectorAll('.keys'));
    if (m === 'play') {
      note('');
    } else {
      // Leaving play: nothing may stay held in the sim while a panel is up.
      release();
      // (An engine that trapped is not called again.)
      if (m !== 'stopped' && !game.scripted) sim.input(0, 0, look.yaw, look.pitch, 0, 0, state.tool);
    }
    if (straight) lay();
  }

  // The simulation has ended for good (main.js caught a trap and stopped the
  // frame loop): say so on a card with the one thing left to do, and let the
  // pointer go. Without the mode, letting the pointer go would open the
  // pause menu over the card and offer Resume on a picture that cannot move.
  function stop(reason) {
    if (state.mode === 'stopped') return;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h1>The simulation stopped</h1><p></p><p><button>Reload</button></p>';
    // The reason is an error's message: text, whatever characters it holds.
    card.querySelector('p').textContent = reason;
    card.querySelector('button').addEventListener('click', () => location.reload());
    overlay.replaceChildren(card);
    setMode('stopped');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  // Enter play. With a mouse that means pointer lock (the mode flips when
  // the lock arrives); with touch, or where nothing can be locked, directly.
  function capture() {
    if (state.mode === 'stopped') return;
    const byTouch = state.touch && (state.forceTouch || lastPointer !== 'mouse');
    if (byTouch || free || !canvas.requestPointerLock) {
      setMode('play');
      return;
    }
    if (locked()) return;
    let p;
    try {
      // Raw input skips the OS pointer acceleration curve where supported.
      p = rawInput ? canvas.requestPointerLock({ unadjustedMovement: true }) : canvas.requestPointerLock();
    } catch {
      p = null;
    }
    if (p && p.catch) {
      p.catch((err) => {
        if (rawInput && err && err.name === 'NotSupportedError') {
          rawInput = false;
          capture();
        } else {
          // Typically a second request within a second of pressing Esc.
          note('The browser did not capture the mouse. Click once more.');
        }
      });
    }
  }

  document.addEventListener('pointerlockchange', () => {
    if (state.mode === 'stopped') {
      // A lock asked for before the stop and granted after it.
      if (locked()) document.exitPointerLock();
    } else if (locked()) {
      lockTime = performance.now();
      setMode('play');
    } else if (state.mode === 'play' && !free && !replay.active) {
      // (Framed elsewhere: the bare state, the world standing as it was; a press anywhere resumes.)
      if (straight) { panelUp = false; setMode('start'); } else setMode('menu');
    }
  });
  document.addEventListener('pointerlockerror', () => note('The browser did not capture the mouse. Click once more.'));
  // Anything the player does, and anything that resizes the view, may
  // change the picture even while the sim stands still.
  for (const type of ['keydown', 'keyup', 'pointerdown', 'pointerup', 'wheel', 'input', 'change', 'click', 'fullscreenchange', 'pointerlockchange', 'visibilitychange']) {
    document.addEventListener(type, wake, true);
  }
  window.addEventListener('resize', wake);
  window.addEventListener('focus', wake);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', () => { if (document.hidden) release(); });
  // The first real touch switches the touch controls on (hybrid laptops).
  window.addEventListener('pointerdown', (e) => {
    lastPointer = e.pointerType;
    if (e.pointerType === 'touch' && !state.touch && touchAllowed) setTouch(true);
  }, true);
  // Crouch-walking is Ctrl+W, which closes the tab and cannot be cancelled:
  // ask first, but only in that situation.
  window.addEventListener('beforeunload', (e) => {
    if (state.mode === 'play' && keys.has('ControlLeft')) e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    // The first events after locking can carry the jump of the cursor warp.
    if (!captured() || e.timeStamp - lockTime < 60) return;
    const k = MOUSE_RATE * settings.values.sens;
    turn(e.movementX * k, e.movementY * k);
  });
  document.addEventListener('mousemove', (e) => {
    if (!bare()) return;
    sway.tx = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2));
    sway.ty = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2));
  });
  document.addEventListener('mouseleave', () => { sway.tx = sway.ty = 0; });
  const mouseBit = (e) => (e.button === 0 ? BUTTON.PRIMARY : e.button === 2 ? BUTTON.SECONDARY : 0);
  document.addEventListener('mousedown', (e) => {
    if (!captured()) return;
    // Also stops the back/forward thumb buttons from leaving the page.
    e.preventDefault();
    const bit = mouseBit(e);
    pressed |= bit;
    held |= bit;
    heard();
  });
  document.addEventListener('mouseup', (e) => {
    if (captured()) e.preventDefault();
    held &= ~mouseBit(e);
    heard();
  });
  canvas.addEventListener('mousedown', () => {
    if (state.mode === 'play' && !locked() && !free) capture();
  });
  document.addEventListener('wheel', (e) => {
    if (!captured()) return;
    // One tool per notch, and a trackpad's stream of small deltas adds up
    // to notches instead of spinning through the belt.
    wheel += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
    if (Math.abs(wheel) < WHEEL_NOTCH) return;
    stepTool(wheel > 0 ? 1 : -1);
    wheel = 0;
  }, { passive: true });
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    const code = e.code;
    if (code === 'F3') {
      e.preventDefault();
      if (!e.repeat) perf.toggle();
      return;
    }
    if (state.mode === 'replay') {
      // Ctrl+R, Ctrl+T, Ctrl+P and the like are the browser's.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!e.repeat && replay.key(code)) e.preventDefault();
      return;
    }
    if (state.mode !== 'play') {
      // (Framed elsewhere, nobody playing: Esc brings a panel: the pause menu once he has played, the opening panel
      // before; Esc on the opening panel is the bare state again.)
      if (straight && state.mode === 'start' && code === 'Escape' && !e.repeat) {
        e.preventDefault();
        if (played) setMode('menu'); else { panelUp = !panelUp; lay(); }
        return;
      }
      // Enter starts or resumes unless it is activating a focused control.
      // (Esc cannot resume a locked game: browsers do not let it re-lock.)
      const idle = e.target === body || e.target === canvas;
      if (!e.repeat && idle && (code === 'Enter' || code === 'NumpadEnter' || (code === 'Escape' && (free || state.touch)))) capture();
      return;
    }
    if (e.metaKey || (e.ctrlKey && PASS_WITH_CTRL.has(code))) return;
    // Everything else is ours while playing: no page scroll on Space, no
    // save dialog on Ctrl+S, no focus hopping on Tab. Function keys pass.
    if (!/^F\d+$/.test(code)) e.preventDefault();
    if (e.repeat) return;
    keys.add(code);
    switch (code) {
      // Latched like a click: a tap that is over before the next sim step
      // (slow motion, a slow frame) still jumps.
      case 'Space': pressed |= BUTTON.JUMP; break;
      case 'KeyV': pressed |= BUTTON.NOCLIP; break;
      case 'KeyE': pressed |= BUTTON.USE; break;
      case 'KeyB': pressed |= BUTTON.BLAST; break;
      case 'KeyT': state.slow = !state.slow; break;
      case 'KeyP': state.paused = !state.paused; break;
      case 'KeyR': ctx.restart(); break;
      case 'KeyQ': selectTool(state.lastTool); break;
      case 'Escape': if (!locked()) setMode('menu'); break;
      default:
        // The belt's keys: 1 to 9, then 0, minus and equals for the rest.
        if (code.startsWith('Digit')) {
          const n = Number(code.slice(5));
          if (n >= 1 && n <= TOOL.COUNT) selectTool(n - 1);
          else if (n === 0 && TOOL.COUNT > 9) selectTool(9);
        } else if (code === 'Minus' && TOOL.COUNT > 10) selectTool(10);
        else if (code === 'Equal' && TOOL.COUNT > 11) selectTool(11);
    }
    heard();
  });
  document.addEventListener('keyup', (e) => {
    if (keys.delete(e.code)) heard();
  });

  // Overlay and menu buttons. Scene chips stop their own clicks.
  // (A link on the card goes where it says; it does not start the game.)
  overlay.addEventListener('click', (e) => { if (state.mode === 'start' && !e.target.closest('a')) capture(); });
  menu.addEventListener('click', (e) => { if (e.target === menu) capture(); });
  document.getElementById('resume').addEventListener('click', capture);
  document.getElementById('restart').addEventListener('click', () => {
    ctx.restart();
    capture();
  });
  const fsBtn = document.getElementById('fullscreen');
  if (document.documentElement.requestFullscreen) {
    fsBtn.addEventListener('click', () => {
      const done = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (done && done.catch) done.catch(() => {});
    });
  } else {
    fsBtn.hidden = true;
  }
  settings.bind(menu);

  // Restarting rebuilds the engine, so everything derived from it starts
  // over: its config, the look direction, recoil sums, event bookkeeping.
  const restart = ctx.restart;
  ctx.restart = () => {
    // A stopped game has no loop to mesh and draw the new scene.
    if (state.mode === 'stopped') return sim.serial;
    const at = restart();
    if (free) meshWorld();
    else beginLoad(at);
    settings.apply();
    pressed = 0;
    state.paused = false;
    // What is read back from the sim starts over with the new world's first
    // frame: at once when the sim is on this thread, a few frames from now
    // when it is not (until then the frames are still the old world's).
    sim.after(at, () => {
      const c = sim.frame.camera;
      scriptYaw = look.yaw = c[3];
      scriptPitch = look.pitch = c[4];
      feel.reset();
      vehicle.reset();
      perf.reset();
      tally.reset();
      wake();
    });
    objective.restarted(at);
    modes.restarted(at);
    wake();
    return at;
  };

  // What is held and what was pressed, as the sim takes it. Once a tick
  // (update), and at the key or the button itself (heard): the presses
  // are cleared by whichever call sent them, so a click is sent once.
  function sendInput() {
    let mx = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
    let mz = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    let buttons = held | touch.buttons;
    if (keys.has('Space')) buttons |= BUTTON.JUMP;
    if (keys.has('ShiftLeft') || keys.has('ShiftRight')) buttons |= BUTTON.SPRINT;
    if (keys.has('KeyC') || keys.has('ControlLeft')) buttons |= BUTTON.CROUCH;
    if (state.touch) {
      mx += touch.moveX;
      mz += touch.moveZ;
      if (touch.sprint) buttons |= BUTTON.SPRINT;
    }
    // The gamepad, on top of whatever else is held.
    const pad = modes.input;
    mx += pad.moveX;
    mz += pad.moveZ;
    buttons |= pad.buttons;
    // Presses made while paused are dropped, not replayed on resume.
    const edges = state.paused || loading ? 0 : (pressed | touch.pressed | pad.pressed) & ~modes.barred;
    pressed = touch.pressed = pad.pressed = 0;
    sim.input(mx, mz, look.yaw, look.pitch, buttons, edges, state.tool);
    // (A new press of Fire, as it goes to the sim: the gun's own answer.
    // Not while a headset's session runs: its own input is sent after
    // this one and is what the sim takes, xr_play.js, which asks there.)
    if (edges & BUTTON.PRIMARY && !ctx.xr) press.at(state.tool);
  }
  // A key or a mouse button has changed: the sim hears of it now, not
  // with the next frame. Where the worker keeps the clock the world runs
  // on between the page's frames, and on a page that draws two of them a
  // second a key let go kept the player walking for half a second
  // (sim.tell: the worker engineer's; absent where the page steps the
  // world itself, which hears with the tick as before).
  function heard() {
    if (state.mode !== 'play' || game.scripted || !sim.tell) return;
    sendInput();
    sim.tell();
  }

  const game = {
    look,
    settings,
    // The result card for a host with no keys (the hands in VR): its lit
    // button, its other one, and what the lit one says (game_modes.js).
    confirm: () => modes.confirm(),
    back: () => modes.back(),
    get cardLabel() { return modes.cardLabel; },
    // When set (the default under the harness) update() leaves the sim's
    // input alone, so scripts can drive the player with engine.input(...)
    // and vx.step(n). The look direction may be set either way: through
    // engine.input, or by writing game.look.
    scripted: free,
    // Camera feel (shake, punch), for the HUD and for measuring it.
    feel,
    // The gun's answer at the press: `press.on(fn)` for whoever does
    // something then, and its counts (answered, paired, unanswered).
    press,
    // Demolition objectives: `objective.specs`, `objective.begin(i)` (-1
    // is the free sandbox), `objective.chosen`. And the F3 readout.
    objective,
    // The game modes on top of the sandbox (`modes.begin('mayhem')`, the
    // gamepad): game_modes.js.
    modes,
    perf,
    // Watching a replay: `replay.active`, and its controls.
    replay,
    get timeScale() {
      if (state.mode === 'replay') return loading ? 0 : replay.timeScale;
      // (Bare at the opening: the world runs only until the round's start has placed him: the picture is then the very
      // view play begins from, and it stands still.)
      if (bare() && !played && !settled) return loading ? 0 : 1;
      return state.mode !== 'play' || state.paused || loading ? 0 : (state.slow ? SLOW_MOTION : 1) * state.pace;
    },
    get tool() { return state.tool; },
    set tool(t) { selectTool(t); },
    get mode() { return state.mode; },
    // 'start' | 'play' | 'menu' | 'score' (the card after an objective).
    // The harness uses this to look at the panels. The fifth mode,
    // 'stopped', is entered through stop() and never left.
    setMode,
    stop,
    setTouch,
    toggleStats: () => { perf.toggle(); wake(); },

    // True when drawing now would repeat the last frame exactly: the sim is
    // frozen (start card, menu, pause) and neither the view, the camera
    // effects, the settings nor the meshes have changed for a few frames.
    // main.js then skips the draw, so a paused game costs next to nothing.
    // A renderer that needs more frames can say so with `renderer.busy`.
    idle(now) {
      // A replay skipping ahead steps without drawing: the picture is
      // refreshed now and then to show where it has got to.
      if (replay.skipping) return now - drawn[2] <= IDLE_REDRAW;
      const changing = this.timeScale !== 0 || loading || stale || look.yaw !== drawn[0] || look.pitch !== drawn[1] ||
        feel.active || ctx.renderer.busy === true || ctx.lastOut[OUT.STAT_DIRTY_CHUNKS] !== 0;
      if (changing) {
        calm = 0;
        return false;
      }
      if (calm < SETTLE_FRAMES) {
        calm++;
        return false;
      }
      return now - drawn[2] <= IDLE_REDRAW;
    },

    update(dt) {
      // Time does not run backwards, whatever the caller's clock says.
      if (!(dt > 0)) dt = 0;
      perf.tick(performance.now());
      settings.sync();
      replay.sync();
      feel.update(dt);
      modes.update(dt);
      if (this.scripted) {
        if (look.yaw !== scriptYaw || look.pitch !== scriptPitch) {
          sim.look(look.yaw, look.pitch);
        } else {
          const c = sim.frame.camera;
          look.yaw = c[3];
          look.pitch = c[4];
        }
        scriptYaw = look.yaw;
        scriptPitch = look.pitch;
        // Scripts pick the tool through engine.input; show what they chose.
        const active = sim.frame.toolState[TOOL_STATE.ACTIVE];
        if (active < TOOL.COUNT) state.tool = active;
        else if (!(state.allowed & (1 << state.tool))) stepTool(1);
        feel.rebase();
        vehicle.reset();
        return;
      }
      if (straight && (bare() || sway.x || sway.y)) swayStep(dt);
      if (state.mode !== 'play') return;
      // The tool in hand is one the objective took away: the first that is left.
      if (!(state.allowed & (1 << state.tool))) stepTool(1);
      feel.recoil(dt);
      vehicle.turn();
      sendInput();
    },

    // Shake, fov punch. main.js calls this between setting the render
    // camera and drawing.
    cameraOffset(out, renderer) {
      press.read(out);
      feel.read(out);
      // A replay is seen through the director's camera, on a tripod.
      if (replay.active) replay.camera(out, renderer);
      else feel.apply(renderer, (out[OUT.PLAYER_FLAGS] & PFLAG.NOCLIP) !== 0);
      // Nothing calls hud() under the harness; keep the HUD current for
      // screenshots with the profiler's own numbers standing in for timing.
      if (free) {
        const p = out[OUT.PROF_PTR] >> 2, f = sim.frame.f32;
        nominal.cpuMs = f[p + PROF.STEP_TOTAL] + f[p + PROF.PREPARE_TOTAL];
        this.hud(out, nominal);
      }
    },

    hud(out, timing) {
      const now = performance.now();
      stale = false;
      drawn[0] = look.yaw;
      drawn[1] = look.pitch;
      drawn[2] = now;
      if (loading && sim.frame.commands >= loadAt && out[OUT.STAT_DIRTY_CHUNKS] === 0) endLoad();
      if (straight) {
        everDrawn = true;
        if (!played && !settled && !loading) arriving(out);
        tell();
      }
      perf.frame(out, timing, now);
      replay.frame(out);
      // The replayed player's score card and counters are not shown again.
      if (replay.active) return;
      tally.frame(now);
      objective.frame(out, now);
      modes.frame(out, now);
      hud.frame(out, now);
      vehicle.frame();
    },
  };

  if (params.get('hud') === '0') body.classList.add('nohud');
  meshWorld();
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  setTouch(touchAllowed && (state.forceTouch || coarse));
  playBtn.disabled = false;
  setMode(free ? 'play' : 'start');
  // ?objective=N starts the scene's Nth objective (the harness, shared links).
  if (params.has('objective')) objective.begin(Number(params.get('objective')));
  return game;
}
