// VR mode: an immersive WebXR session around the game as it is. Loaded only
// when "Enter VR" is used (xr_entry.js). For as long as the session lasts:
//   - the frame loop of main.js runs on the session's animation frames
//     (ctx.setClock), never on the window's as well,
//   - main.js calls update(dt) before it steps the simulation (controllers
//     become engine input) and render(out) where it would draw the canvas
//     (both eyes, from this frame's head pose, then the hands),
//   - the renderer runs a tier of its own choosing for VR, without the
//     flat-screen auto-scaler.
// When the session ends, however it ends, everything is put back and the
// flat game is left paused on its menu.
import { TOOL } from './engine.js';
import { NEAR, FAR } from './render_frame.js';
import { TIERS } from './render_quality.js';
import { XrInput } from './xr_input.js';
import { XrView } from './xr_render.js';
import { XrOverlay } from './xr_overlay.js';
import { Rig, Pace, Stature, facing, PAUSE_MS, CRAWL } from './xr_rig.js';
import { drive, present } from './xr_play.js';
import { hostOf } from './xr_host.js';
import { shared as hands } from './xr_hands.js';

// Cheaper and cheaper pictures: a renderer tier and a ceiling on its scale
// (a tier's own scale applies under the ceiling: low draws at 0.7). The
// last four are also the player's own steps (`sharp` in the options:
// 'sharp', 'even', 'fast', 'coarse'). The last is there for a headset
// still late at `fast`: a coarse picture that keeps up is the lesser harm
// on a head than a sharper one that does not. Nothing under it: in this
// container's rasteriser a town's frame at 0.3 is half of `sharp`'s and
// 0.25 gains nothing more (docs/reports/vr.md).
const LADDER = [{ tier: 'medium', scale: 1 }, { tier: 'low', scale: 1 }, { tier: 'low', scale: 0.55 }, { tier: 'low', scale: 0.4 }, { tier: 'low', scale: 0.3 }];
const STEPS = ['sharp', 'even', 'fast', 'coarse'];
// What the readout calls each rung.
const RUNG_NAMES = ['full', ...STEPS];
// Where a session that starts at a crawl is put at once (xr_rig.js: CRAWL).
const FAST = 1 + STEPS.indexOf('fast');
// A headset that is its own computer starts on low, with no mirror on a
// page nobody sees. Which one this is cannot be asked: the browsers that
// say so are known by name; a Safari that offers VR is a Vision Pro (it
// calls itself a Mac); and a session none of whose inputs is a gamepad
// (hands, a pinch) is taken for one once that has been seen (_inputs).
const STANDALONE = /OculusBrowser|Quest|Pico|Android|Mobile VR/i;
const apple = () => /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//.test(navigator.userAgent);
const standalone = () => STANDALONE.test(navigator.userAgent) || apple();
// The share of its recommended size the headset's own buffer is asked for
// at. Nobody has measured a Vision Pro with this renderer; its first run
// (medium tier, full size) was "super laggy", so it starts well under.
const LAYER_SCALE_APPLE = 0.7;

// A viewer pose that can be drawn from: present, with finite numbers in it.
function usable(pose) {
  if (!pose || !pose.transform) return null;
  const p = pose.transform.position, m = pose.transform.matrix;
  for (let i = 0; i < 16; i++) if (!Number.isFinite(m[i])) return null;
  return Number.isFinite(p.x + p.y + p.z) ? pose : null;
}

class Vr {
  constructor(ctx, session, opts) {
    this.ctx = ctx;
    this.session = session;
    this.opts = opts;
    this.host = hostOf(ctx);
    this.input = new XrInput();
    // (The hands, where the input has them, reach the session through this:
    // the game's mode and tool, and rise / stand / sharpness / status below.)
    if (this.input.hands) this.input.hands.vr = this;
    this.view = new XrView(ctx.renderer);
    this.overlay = new XrOverlay(ctx.renderer);
    this.rig = new Rig();
    this.pace = new Pace();
    this.layer = null;
    this.space = null;
    this.floor = false;
    this.stature = new Stature();
    this.seated = !!opts.seated;
    this.light = standalone();  // a headset that is its own computer
    this.padless = 0;           // tracked frames in a row with no gamepad among the inputs
    this.free = false;          // hands are this session's input: it plays the free sandbox (_bare)
    this.rocket = 0;            // frames for which the rocket launcher is still asked for
    this.layerScale = 1;
    this.fov = -1;              // the layer's fixed foveation as it stands, or -1: it offers none
    this.frameMs = 0;           // the time between frames, eased (ms)
    this.busyMs = 0;            // of that, this thread's own work in the frame, eased (ms)
    this.status = ['', '', ''];
    this.statusAt = 0;
    this.card = null;           // where the readout floats when no hand holds it (room coordinates)
    this.xf = null;             // the XRFrame, only inside its callback
    this.pose = null;
    this.now = 0; this.dt = 0; this.jsAt = 0;
    this.busy = 0;              // ms of JS the last frame took
    this.aim = { yaw: 0, pitch: 0, has: false, blocked: false, hit: [0, 0, 0] };
    this.holdReach = 3;
    // The newest answer to a ray asked of an engine on another thread
    // (xr_play.js: askAim): its distance along the hand's ray (0: nothing
    // within range), whether the shot was seen to land (and where, if not
    // where the hand points), and when it came.
    this.late = { busy: false, at: 0, reach: 0, seen: false, blocked: false, hit: [0, 0, 0] };
    this.snapArmed = true;
    this.moving = 0;            // how hard the stick moves or turns the player, 0..1
    this.stick = 0;             // the walking stick alone
    this.pauseArmed = false;
    this.pressStep = -1;        // sim step at the last trigger or grip press
    this.lost = 0;              // frames in a row without a usable pose
    this.vignette = 0;
    this.pauseAt = 0;
    this.autoPaused = false;
    this.headAt = null;         // the head in the room last frame: x, y, z, yaw
    this.recentred = false;
    this.mirror = false;
    this.evFrame = -1; this.evTotal = -1;
    this.readoutKey = -1;
    this.begun = false;
    this.ended = false;
    this.leaving = false;
    this.over = false;          // the session itself has ended
    this.frames = 0;            // XR frames run
    this.drawn = 0;             // of those, frames that reached the headset
    this.sent = 0;              // inputs handed to the engine
    this.given = new Float64Array(7);   // the last of them: move x, z, yaw, pitch, buttons, pressed, tool
    this.eye = { step: -1, was: 0, now: 0 };    // the engine's eye height at its last two steps (xr_play.js: eyeBetween)
    // The room's own speed at the head and what the player's doing explains of it (xr_play.js: rideOf).
    this.taken = 0;             // how much of the view's motion this frame is not the player's doing, 0..1
    this.jumpAt = 0;            // when the jump button was last down (ms, the frames' clock)
    this.cage = { on: 0, at: [0, 0, 0] };   // the still cage drawn while the view is taken: strength, and where in the room
    this.ride = { ok: false, t: 0, px: 0, py: 0, pz: 0, x: 0, y: 0, z: 0, along: 0, up: 0, own: 0 };
    this.rung = 0;
    this.scale = 1;             // the renderer's scale as this mode set it
    this.asked = '';
    this.saved = null;
    this._fn = null;
    this._asked = false;
    this.stopped = false;       // the loop of main.js has stopped for good
    this._onFrame = (t, xf) => this._frame(t, xf);
    this._onEnd = () => { this.over = true; this._finish(); };
    this._onVisibility = () => this._visibility();
    this._onRestored = () => this._relayer();
    // (A re-centred player is sitting as they mean to sit.)
    this._onReset = () => { this.recentred = true; if (!this.stature.believed) this.stature.again(); };
    this.clock = {
      requestAnimationFrame: (fn) => {
        this._fn = fn;
        this._asked = true;
        try {
          return session.requestAnimationFrame(this._onFrame);
        } catch (e) {
          // The session is gone and its end has not been announced yet.
          queueMicrotask(this._onEnd);
          return 0;
        }
      },
      cancelAnimationFrame: (id) => session.cancelAnimationFrame(id),
    };
    session.addEventListener('end', this._onEnd);
  }

  _makeLayer() {
    const gl = this.ctx.renderer.gl;
    // The eyes arrive resolved from the renderer's own targets, so the
    // layer needs no multisampling; its depth buffer only sorts the hands
    // and must not be taken for the scene's by the headset's compositor.
    this.layerScale = apple() ? LAYER_SCALE_APPLE : 1;
    this.layer = new XRWebGLLayer(this.session, gl, { antialias: false, depth: true, stencil: false, alpha: false, ignoreDepthValues: true, framebufferScaleFactor: this.layerScale });
    this._foveate();
    this.session.updateRenderState({ baseLayer: this.layer, depthNear: NEAR, depthFar: FAR });
  }

  // Where the headset can draw the edge of the view coarser, it may, as
  // coarse as it offers (1). That is the layer's own buffer: the copy of
  // each eye into it and the hands. The scene is drawn in the renderer's
  // targets, which no headset coarsens. `fov`: what the layer then says
  // (a number), or -1 where it offers none; the readout shows which.
  _foveate() {
    this.fov = -1;
    try {
      const L = this.layer;
      if (L && typeof L.fixedFoveation === 'number') {
        if (this.light) L.fixedFoveation = 1;
        this.fov = L.fixedFoveation;
      }
    } catch (e) { /* not this layer */ }
  }

  async prepare() {
    const gl = this.ctx.renderer.gl, session = this.session;
    await gl.makeXRCompatible();
    if (this.ended) throw new Error('The VR session ended while it was starting.');
    this._makeLayer();
    try {
      this.space = await session.requestReferenceSpace('local-floor');
      this.floor = true;
    } catch (e) {
      // No floor known: the head starts at standing eye height instead.
      this.space = await session.requestReferenceSpace('local');
      this.floor = false;
    }
    if (this.ended) throw new Error('The VR session ended while it was starting.');
    if (this.space.addEventListener) this.space.addEventListener('reset', this._onReset);
  }

  begin() {
    const { ctx, opts } = this, { renderer, game } = ctx;
    this.saved = { auto: renderer.autoQuality, tier: renderer.quality, scale: renderer.renderScale, busy: renderer.busy };
    this.begun = true;
    renderer.autoQuality = false;
    // Every frame is a new picture in a headset, sim running or not.
    renderer.busy = true;
    this.asked = opts.quality + opts.sharp;
    this.rung = this._firstRung();
    // The left eye on the page: only where somebody can see the page.
    this.mirror = !!opts.mirror && !this.light;
    this._applyRung();
    renderer.canvas.addEventListener('webglcontextrestored', this._onRestored);
    this.session.addEventListener('visibilitychange', this._onVisibility);
    document.body.classList.add('in-vr');
    ctx.xr = this;
    // A game that has stopped for good (the engine trapped) has no loop to
    // hand over: the session would never be given a frame.
    if (ctx.setClock(this.clock) === false) throw new Error('The game has stopped; reload the page.');
    game.setMode('play');
  }

  // Where on the ladder to start: the step the player chose from inside
  // the headset; else the tier asked for; else medium on a PC and low on a
  // headset that is its own computer.
  _firstRung() {
    const q = this.opts.quality, step = STEPS.indexOf(this.opts.sharp);
    if (step >= 0) return 1 + step;
    const want = q === 'low' || q === 'medium' ? q : this.light ? 'low' : 'medium';
    return want === 'medium' ? 0 : 1;
  }

  // The player's own doing, from inside the headset (the hands' panel, a
  // controller): up or down by a few centimetres, kept by the page;
  rise(steps) {
    const o = this.opts;
    o.rise = Math.max(-0.8, Math.min(0.8, Math.round(((o.rise || 0) + steps * 0.05) * 100) / 100));
    if (o.keep) o.keep('rise', o.rise);
    this.statusAt = 0;
  }

  // "this is my standing height": the eyes at a person's height where the
  // head is now, whatever the device says of its floor;
  stand() {
    this.stature.stand();
    this.card = null;
    this.statusAt = 0;
  }

  // and a sharper (-1) or a cheaper (+1) picture, one of four steps, which
  // then stays as chosen (the mode no longer steps it down by itself).
  sharpness(dir) {
    const o = this.opts, at = Math.max(1, this.rung) - 1, to = Math.max(0, Math.min(STEPS.length - 1, at + dir));
    o.sharp = STEPS[to];
    if (o.keep) o.keep('sharp', o.sharp);
    this.statusAt = 0;
  }

  _applyRung() {
    const r = this.ctx.renderer, rung = LADDER[this.rung];
    r.autoQuality = false;
    // (A step down within a tier is a matter of scale alone: nothing to
    // compile, no shadows to redo.)
    if (r.quality !== rung.tier) r.setQuality(rung.tier);
    r.renderScale = rung.scale;
    // The scale a tier draws at under that ceiling. Where the renderer is
    // somewhere else (the flat auto-scaler had it lower), setting the tier
    // puts it there.
    if (r.renderScale !== Math.min(TIERS[rung.tier].scale, rung.scale) && !this.ctx.params.has('scale')) {
      r.setQuality(rung.tier);
      r.renderScale = rung.scale;
    }
    this.scale = r.renderScale;
    this.pace.reset();
  }

  // The picture is this mode's to choose while it runs. The flat game's
  // settings are applied again by a restart and by any change in the menu;
  // the VR quality option can change in the menu too.
  _keepPicture() {
    const r = this.ctx.renderer;
    if (this.opts.quality + this.opts.sharp !== this.asked) {
      this.asked = this.opts.quality + this.opts.sharp;
      this.rung = this._firstRung();
      this._applyRung();
    } else if (r.quality !== LADDER[this.rung].tier || r.renderScale !== this.scale) {
      this._applyRung();
    }
  }

  // The head over the body, facing the way the flat game looked.
  place(fx, fz) {
    const pose = this.pose, look = this.ctx.game.look;
    if (!pose) return;
    const m = pose.transform.matrix, p = pose.transform.position;
    this.rig.place(fx, fz, p.x, p.z, look && Number.isFinite(look.yaw) ? look.yaw : 0, facing(m));
  }

  _frame(t, xf) {
    if (this.ended) return;
    this.dt = Math.min(Math.max((t - this.now) / 1000, 0), 0.1);
    const interval = t - this.now;
    this.now = t;
    this.xf = xf;
    this.jsAt = performance.now();
    this.frames++;
    this._asked = false;
    try {
      this.pose = usable(xf.getViewerPose(this.space));
      this._continuity();
      // Under the headset's own menu the controllers belong to it.
      if (this.session.visibilityState === 'visible') this.input.read(xf, this.session, this.space, this.opts.hand === 'left' ? 'left' : 'right');
      else this.input.release();
      this._inputs();
      this._bare();
    } catch (e) {
      // Whatever the device refused this frame (some browsers throw where
      // the specification returns nothing): a frame without a pose, and
      // the loop goes on.
      this.pose = null;
      this.input.release();
    }
    this._tracking();
    try {
      this._keepPicture();
    } catch (e) {
      // The renderer could not switch to the picture VR asks for.
      console.error(e);
      this.leave();
    }
    try {
      this._fn(t);
    } finally {
      this.xf = null;
      // A loop that did not ask for its next frame has stopped (the engine
      // trapped and main.js put its card up), and a renderer that failed
      // draws nothing more: either way the player belongs back on the page,
      // where the reason is written, not in a headset showing nothing.
      if (!this._asked) this.stopped = true;
      if (this.stopped || this.ctx.renderer._failed) this.leave();
      this.input.flush(t);
      const playing = this.ctx.game.mode === 'play' && this.session.visibilityState === 'visible';
      // (How long a frame takes to arrive is the doing of the one before it.)
      const busy = this.busy;
      this.busy = performance.now() - this.jsAt;
      if (interval > 0 && interval < PAUSE_MS) {
        this.frameMs += (interval - this.frameMs) * (this.frameMs ? 0.05 : 1);
        this.busyMs += (this.busy - this.busyMs) * (this.busyMs ? 0.05 : 1);
      }
      // (The renderer's own trial of laying the depth first, a second of
      // frames twice a minute, makes those frames dearer or cheaper for its
      // own sake: they say nothing about the picture's size, and a step
      // down is for good.)
      const trial = this.ctx.renderer.depthTrial, trying = !!trial && trial.block >= 0;
      const down = this.opts.adapt && this.opts.sharp === 'auto' && playing && !trying && this.rung < LADDER.length - 1 ? this.pace.frame(interval, busy, this.session.frameRate || 0) : 0;
      if (down) {
        this.rung = down === CRAWL ? Math.max(this.rung, FAST) : this.rung + 1;
        this._applyRung();
      }
    }
  }

  // A session none of whose inputs is a gamepad for its first second and a
  // half is a headset used with the hands: its own computer, whatever its
  // browser calls itself. (A PC headset's controllers may be asleep on the
  // desk: the player who meant medium has the option for it.)
  _inputs() {
    if (this.light || this.padless < 0 || !this.pose) return;
    const list = this.session.inputSources;
    for (let i = 0; list && i < list.length; i++) if (list[i].gamepad) { this.padless = -1; return; }
    if (++this.padless < 108) return;
    this.light = true;
    this.mirror = false;
    this._foveate();
    if (this.opts.quality === 'auto' && this.opts.sharp === 'auto' && this.rung === 0) { this.rung = 1; this._applyRung(); }
  }

  // A contract is the wrong place to learn pinching: every shot is on a
  // bill, and a job ends on a card. A session whose input is the hands
  // (their own code says so: it has seen one, or has put up its sign for
  // want of a controller) plays the free sandbox, whatever the page's
  // start card had chosen, by the road the page's own Sandbox button
  // takes (game_modes.js `begin`): the world stays as it is and a job
  // that was running is left. With the rocket launcher in hand: a job's
  // tool was the job's choice (the first contract hands out cutting
  // charges, which a pinch can place and nothing here can set off), and
  // the hammer is what nobody chose; a tool the player took in a sandbox
  // of their own stays. The page lets go of a job's tools a frame or more
  // after the job: the launcher is asked for until it is in hand. Once a
  // session: a player who then takes a job from inside the headset has
  // it. `free` is for the hands' sign to say so.
  _bare() {
    if (!hands.active) return;
    const game = this.ctx.game;
    if (!this.free) {
      const h = this.input.hands;
      if (!hands.sign && !hands.notice && !(h && h.seen)) return;
      this.free = true;
      const modes = game && game.modes;
      let left = false;
      try {
        if (modes && typeof modes.begin === 'function') {
          left = modes.mode !== 'sandbox';
          if (left) modes.begin('sandbox');
        } else if (this.ctx.sim && this.ctx.sim.command) this.ctx.sim.command('objectiveStop');
      } catch (e) {
        console.error(e);
      }
      if (left || game.tool === TOOL.HAMMER) this.rocket = 240;
    }
    if (this.rocket > 0) {
      if (game.tool === TOOL.ROCKET) this.rocket = 0;
      else { this.rocket--; game.tool = TOOL.ROCKET; }
    }
  }

  // What the device gave and what was made of it, for the readout: the
  // player reads these to whoever is asking. Twice a second at most.
  _status() {
    if (this.now - this.statusAt < 500 && this.statusAt) return;
    this.statusAt = this.now || 1;
    const st = this.stature, r = this.ctx.renderer, pose = this.pose, h = pose ? pose.transform.position.y : NaN;
    const rise = this.opts.rise || 0, lift = st.base + rise, f2 = (v) => (Number.isFinite(v) ? v.toFixed(2) : '?');
    this.status[0] = `${this.floor ? 'local-floor' : 'local (no floor)'}: head ${f2(h)} m, ${f2(st.measured)} at start`;
    this.status[1] = `Eyes ${f2(h + lift)} m up: ${st.believed ? 'your own height' : `raised ${f2(st.base)}`}${rise ? `, set ${rise > 0 ? '+' : ''}${rise.toFixed(2)}` : ''}`;
    const L = this.layer;
    // The tier and the scale; the size drawn over the size of the headset's
    // buffer (and `fov1` where that buffer's edge is drawn coarser: the
    // layer offered it); then milliseconds: between frames, of this thread's own work
    // in a frame (a frame that takes long while the thread stands idle
    // waits on the GPU), and of one step of the simulation where the host's
    // sim says it (`stepMs`; W: in a worker, which shares the headset's
    // cores with the picture and not this thread). Not the ledger's figure
    // for the frame: that is every step since the frame before, none at a
    // headset's rate one frame in three and six at ten frames a second.
    // (In whole milliseconds, rounded up: a step is never shown as 0.)
    const sim = this.ctx.sim;
    const step = sim && sim.stepMs > 0 ? sim.stepMs : NaN;
    // (First the rung's own name, for the player to read back: full, or one
    // of the four steps.)
    this.status[2] = `${RUNG_NAMES[this.rung] || '?'}: ${r.stats.tier} x${f2(this.layerScale * r.stats.scale)} ${r.stats.width}x${r.stats.height}${L ? `/${L.framebufferWidth >> 1}x${L.framebufferHeight}` : ''}${this.fov >= 0 ? ` fov${+this.fov.toFixed(2)}` : ''} ${this.frameMs ? this.frameMs.toFixed(0) : '?'}ms ${this.busyMs.toFixed(0)}busy${Number.isFinite(step) ? ` ${Math.ceil(step)}step${sim && sim.remote ? 'W' : ''}` : ''}${this.opts.sharp !== 'auto' ? ' chosen' : ''}`;
  }

  // Without a pose for half a second the game waits (the sim would run on
  // unseen), and goes on when tracking is back.
  _tracking() {
    const game = this.ctx.game;
    if (this.pose) {
      if (this.lost > 0 && this.autoPaused && game.mode === 'menu' && this.session.visibilityState === 'visible') {
        game.setMode('play');
        this.autoPaused = false;
      }
      this.lost = 0;
    } else if (++this.lost === 36 && game.mode === 'play') {
      game.setMode('menu');
      this.autoPaused = true;
    }
  }

  // A head that jumps a metre between two frames has not moved: its space
  // was re-centred, or tracking came back somewhere else. The room is moved
  // so that the player stays where they were, looking where they looked.
  _continuity() {
    const pose = this.pose;
    if (!pose) return;
    const p = pose.transform.position, m = pose.transform.matrix, yaw = facing(m), last = this.headAt;
    if (last && this.rig.placed && (this.recentred || Math.hypot(p.x - last[0], p.y - last[1], p.z - last[2]) > 1)) {
      this.rig.rebase(last[0], last[2], last[3], p.x, p.z, yaw);
      // (A floor that is believed stays the floor; a height that was given stays the height.)
      this.stature.shift(last[1] - p.y);
    }
    this.recentred = false;
    if (!last) this.headAt = [p.x, p.y, p.z, yaw];
    else { last[0] = p.x; last[1] = p.y; last[2] = p.z; last[3] = yaw; }
  }

  // Called by main.js: before the steps, and in place of the canvas draw.
  update(dt) {
    if (this.xf) drive(this, dt);
  }

  render(out) {
    if (this.xf && present(this, out)) this.drawn++;
  }

  // The headset's own menu came up, or the headset came off: nothing is
  // held, the game waits, and goes on when the player is back.
  _visibility() {
    const game = this.ctx.game, visible = this.session.visibilityState === 'visible';
    if (!visible && game.mode === 'play') {
      this.input.release();
      game.setMode('menu');
      this.autoPaused = true;
    } else if (visible && this.autoPaused && game.mode === 'menu' && this.lost === 0) {
      game.setMode('play');
      this.autoPaused = false;
    }
    // The headset is on a head again: a height that was given is taken afresh.
    if (visible && !this.stature.believed) this.stature.again();
  }

  // A GL context that was lost and rebuilt has lost the layer with it.
  _relayer() {
    if (this.ended) return;
    this.layer = null;
    this.ctx.renderer.gl.makeXRCompatible().then(() => {
      if (!this.ended) { this._makeLayer(); this._applyRung(); }
    }).catch(() => this.leave());
  }

  // Ask the session to end (the page's button, a held pause button).
  leave() {
    if (this.ended || this.leaving) return;
    this.leaving = true;
    // Not from inside its own frame.
    setTimeout(() => { if (!this.ended) this.session.end().catch(() => this._finish()); }, 0);
  }

  _finish() {
    if (this.ended) return;
    this.ended = true;
    const { ctx, session } = this, { renderer, game } = ctx;
    session.removeEventListener('end', this._onEnd);
    session.removeEventListener('visibilitychange', this._onVisibility);
    if (this.space && this.space.removeEventListener) this.space.removeEventListener('reset', this._onReset);
    if (this.begun) {
      renderer.canvas.removeEventListener('webglcontextrestored', this._onRestored);
      ctx.xr = null;
      ctx.setClock(null);
      this.overlay.dispose();
      renderer.frame.eye = null;
      renderer.state.screen = null;
      renderer.busy = this.saved.busy;
      renderer.autoQuality = this.saved.auto;
      // The tier the flat game asks for: the player's, or the renderer's own
      // (the scale comes back with the settings below, or as the URL had it).
      const q = game.settings.values.quality, own = q === 'auto' || ctx.params.has('quality');
      renderer.setQuality(own ? 'auto' : q);
      // (Where the flat auto-scaler had settled on a tier of its own, back
      // to that; the scale it had found there it finds again by itself.)
      if (own && this.saved.auto && this.saved.tier !== renderer.quality) renderer.setQuality(this.saved.tier, true);
      if (ctx.params.has('scale')) renderer.renderScale = this.saved.scale;
      document.body.classList.remove('in-vr');
      // Look where the head looked, level.
      if (game.look && this.rig.placed && Number.isFinite(renderer.cam.yaw)) { game.look.yaw = renderer.cam.yaw; game.look.pitch = 0; }
      // The mouse, if the page had it, is let go: the menu is coming up.
      if (document.pointerLockElement && document.exitPointerLock) document.exitPointerLock();
      // (A loop that stopped has its own card up: the menu must not cover it.)
      if (!this.stopped) game.setMode('menu');
      game.settings.apply();
    }
    if (this.opts.onEnd) this.opts.onEnd(this);
  }
}

// Starts VR in a session the caller has already been granted (the request
// has to be made inside the click). Resolves to the running mode.
export async function start(ctx, session, opts) {
  const vr = new Vr(ctx, session, opts);
  try {
    await vr.prepare();
  } catch (e) {
    vr._finish();
    if (!vr.over) { try { await session.end(); } catch (err) { /* already over */ } }
    throw e;
  }
  try {
    vr.begin();
  } catch (e) {
    vr._finish();
    if (!vr.over) { try { await session.end(); } catch (err) { /* already over */ } }
    throw e;
  }
  return vr;
}
