// VR, frame by frame: what the controllers and the head ask of the engine
// (drive, before the simulation steps) and what the headset is shown
// (present, after them). `vr` is the session object of xr.js.
import { BUTTON, EV, EV_STRIDE, OUT, PFLAG, PLAYER_STATE, SIM_DT, TOOL, TOOL_STATE, VIEW_FX } from './engine.js';
import { Owed } from './game_press.js';
import { TOOLS } from './game_hud.js';
import { FOLLOW_KEEP, FOLLOW_GAIN, facing } from './xr_rig.js';
import { TOOL_MODELS, HAND_MODEL, AIM_COLOURS } from './xr_models.js';
import { mulRigid } from './xr_render.js';

const SNAP = Math.PI / 6;
const SMOOTH_TURN = 2.1;      // rad/s at full deflection
const AIM_RANGE = 200;
const PITCH_LIMIT = 1.55;
const HOLD_TO_LEAVE = 1000;   // ms the pause button is held to leave VR
const STALE = 400;            // ms after which a late ray's answer is not used
const SPAWN_NAMES = ['Wooden crate', 'Concrete block', 'Steel beam', 'Glass pane', 'Explosive barrel'];
// What firing each tool feels like in the hand: strength and milliseconds.
const SHOT_PULSE = [[0.5, 60], [0.35, 30], [0.9, 90], [0.8, 120], [0.25, 40], [0.3, 50], [1, 150], [0.25, 40], [0.15, 30]];

const _hit = [0, 0, 0], _a = [0, 0, 0], _b = [0, 0, 0];
const _toolW = new Float32Array(16), _otherW = new Float32Array(16);

// Where the tools will act. The engine fires from the body's eye along the
// look direction; the player points with a hand that is somewhere else. So
// the look direction sent is the one from that eye to the spot the hand's
// ray lands on: the shot arrives where the controller points, as long as
// the body can see the spot (when it cannot, the dot shows where the shot
// will really land and turns red).
// The engine in a worker: a ray is asked for and answered a frame or more
// later. One question is out at a time, in two parts as on this thread:
// how far along the hand's ray the world is, then what a shot from the
// body's eye toward that spot meets. The answer is kept in `vr.late`.
function askAim(vr, ox, oy, oz, wx, wy, wz, ex, ey, ez) {
  const late = vr.late, later = vr.host.later;
  late.busy = true;
  later(ox, oy, oz, wx, wy, wz, AIM_RANGE).then((first) => {
    const reach = first ? first.dist : AIM_RANGE;
    const tx = ox + wx * reach - ex, ty = oy + wy * reach - ey, tz = oz + wz * reach - ez, tl = Math.hypot(tx, ty, tz);
    const far = tl > 0.05;
    return later(ex, ey, ez, far ? tx / tl : wx, far ? ty / tl : wy, far ? tz / tl : wz, AIM_RANGE).then((second) => {
      late.reach = first ? first.dist : 0;
      late.seen = !!second;
      late.blocked = !!second && (!first || Math.hypot(second.x - first.x, second.y - first.y, second.z - first.z) > 0.25);
      if (second) { late.hit[0] = second.x; late.hit[1] = second.y; late.hit[2] = second.z; }
      late.at = performance.now();
      late.busy = false;
    });
  }).catch(() => { late.busy = false; });
}

function takeAim(vr, ps, hx, hy, hz, headYaw) {
  const fx = ps[PLAYER_STATE.FEET_X], fy = ps[PLAYER_STATE.FEET_Y], fz = ps[PLAYER_STATE.FEET_Z];
  const { rig, input, host } = vr, aim = vr.aim;
  const c = Math.cos(rig.yaw), s = Math.sin(rig.yaw);
  let px = hx, py = hy, pz = hz, dx = -Math.sin(headYaw), dy = 0, dz = -Math.cos(headYaw);
  const t = input.tool;
  if (t.tracked) {
    const r = t.ray;
    px = r[12]; py = r[13]; pz = r[14];
    dx = -r[8]; dy = -r[9]; dz = -r[10];
  }
  const ox = rig.wx(px, pz), oy = fy + py + rig.lift, oz = rig.wz(px, pz);
  const wx = c * dx + s * dz, wy = dy, wz = -s * dx + c * dz;
  // The eye the engine will fire from: it moves the body first, then the
  // tools act, so the eye is one step further on than it is now.
  const ex = fx + ps[PLAYER_STATE.VEL_X] * SIM_DT, ey = fy + ps[PLAYER_STATE.EYE_HEIGHT] + ps[PLAYER_STATE.VEL_Y] * SIM_DT, ez = fz + ps[PLAYER_STATE.VEL_Z] * SIM_DT;
  let lx = wx, ly = wy, lz = wz;
  aim.has = false;
  aim.blocked = false;
  if (host.raycast) {
    const held = host.toolState()[TOOL_STATE.HELD_BODY] > 0;
    // A carried body is in the way of its own ray: the spot stays as far
    // along the hand's ray as it was when the body was picked up.
    const first = held ? null : host.raycast(ox, oy, oz, wx, wy, wz, AIM_RANGE);
    const reach = held ? vr.holdReach : first ? first.dist : AIM_RANGE;
    if (!held) vr.holdReach = Math.max(1, Math.min(reach, 8));
    const tx = ox + wx * reach - ex, ty = oy + wy * reach - ey, tz = oz + wz * reach - ez, tl = Math.hypot(tx, ty, tz);
    // (A spot at the body's own eye gives no direction: then the hand's.)
    if (tl > 0.05) { lx = tx / tl; ly = ty / tl; lz = tz / tl; }
    const second = held ? null : host.raycast(ex, ey, ez, lx, ly, lz, AIM_RANGE);
    if (second) {
      aim.has = true;
      aim.hit[0] = second.x; aim.hit[1] = second.y; aim.hit[2] = second.z;
      aim.blocked = !first || Math.hypot(second.x - first.x, second.y - first.y, second.z - first.z) > 0.25;
    }
  } else if (host.later) {
    const late = vr.late, held = host.toolState()[TOOL_STATE.HELD_BODY] > 0;
    if (!held && !late.busy) askAim(vr, ox, oy, oz, wx, wy, wz, ex, ey, ez);
    // The last answer's distance is laid along the hand's ray as it is
    // now, so the aim stays with the hand while the answers trail it; one
    // that is too old (the worker is deep in a long step) is not used, and
    // the tool then looks along the hand.
    const fresh = late.at > 0 && performance.now() - late.at < STALE;
    if (held || fresh) {
      const reach = held ? vr.holdReach : late.reach > 0 ? late.reach : AIM_RANGE;
      if (!held) vr.holdReach = Math.max(1, Math.min(reach, 8));
      const tx = ox + wx * reach - ex, ty = oy + wy * reach - ey, tz = oz + wz * reach - ez, tl = Math.hypot(tx, ty, tz);
      if (tl > 0.05) { lx = tx / tl; ly = ty / tl; lz = tz / tl; }
      if (!held && late.seen) {
        aim.has = true;
        aim.blocked = late.blocked;
        // Clear to the spot: the dot rides the hand's ray. In the way:
        // the dot is where the shot was found to land.
        if (late.blocked) { aim.hit[0] = late.hit[0]; aim.hit[1] = late.hit[1]; aim.hit[2] = late.hit[2]; }
        else { aim.hit[0] = ox + wx * reach; aim.hit[1] = oy + wy * reach; aim.hit[2] = oz + wz * reach; }
      }
    }
  }
  aim.yaw = Math.atan2(-lx, -lz);
  aim.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, Math.asin(Math.max(-1, Math.min(1, ly)))));
}

// Before the simulation steps: turn, follow, move, aim, buttons.
export function drive(vr, dt) {
  const { ctx, input, rig, opts, host } = vr, game = ctx.game;
  // The pause button acts when it is let go: pause, or resume. Held for a
  // second it leaves VR instead (without first playing on from a pause).
  if (input.pauseEdge) {
    vr.pauseAt = vr.now;
    vr.pauseArmed = true;
  }
  if (vr.pauseArmed && !input.pauseDown) {
    vr.pauseArmed = false;
    vr.autoPaused = false;
    game.setMode(game.mode === 'play' ? 'menu' : 'play');
  } else if (vr.pauseArmed && vr.now - vr.pauseAt > HOLD_TO_LEAVE) {
    vr.pauseArmed = false;
    vr.leave();
  }
  // The stick of the tool hand, clicked: this is how tall I sit.
  if (input.heightEdge) vr.stand();
  const pose = vr.pose;
  if (game.mode !== 'play') {
    vr.moving = vr.stick = 0;
    return;
  }
  if (!pose) {
    // No tracking this frame: nothing is held, the body stands.
    vr.moving = vr.stick = 0;
    host.input(0, 0, vr.aim.yaw, vr.aim.pitch, 0, 0, game.tool);
    return;
  }
  const hp = pose.transform.position, hm = pose.transform.matrix;
  const headYaw = facing(hm);
  const ps = host.playerState();
  const fx = ps[PLAYER_STATE.FEET_X], fz = ps[PLAYER_STATE.FEET_Z];
  if (!rig.placed) vr.place(fx, fz);

  const turn = input.turn;
  if (opts.turn === 'smooth') {
    if (turn) rig.turn(-turn * SMOOTH_TURN * dt, hp.x, hp.z);
  } else if (Math.abs(turn) > 0.6) {
    if (vr.snapArmed) rig.turn(-Math.sign(turn) * SNAP, hp.x, hp.z);
    vr.snapArmed = false;
  } else if (Math.abs(turn) < 0.3) {
    vr.snapArmed = true;
  }

  // The stick moves the body where the head faces; a head that has walked
  // away from the body pulls it along as well.
  const yawW = rig.yaw + headYaw;
  let wx = -Math.sin(yawW) * input.moveY + Math.cos(yawW) * input.moveX;
  let wz = -Math.cos(yawW) * input.moveY - Math.sin(yawW) * input.moveX;
  const stick = Math.hypot(input.moveX, input.moveY);
  vr.stick = stick;
  vr.moving = Math.max(stick, opts.turn === 'smooth' ? Math.abs(turn) : 0);
  const gap = rig.offset(fx, fz, hp.x, hp.z);
  if (rig.following && gap > FOLLOW_KEEP) {
    const k = Math.min(1, (gap - FOLLOW_KEEP) * FOLLOW_GAIN) / gap;
    wx += rig.offX * k;
    wz += rig.offZ * k;
  }
  const wl = Math.hypot(wx, wz);
  if (wl > 1) { wx /= wl; wz /= wl; }

  takeAim(vr, ps, hp.x, hp.y, hp.z, headYaw);
  let yaw = vr.aim.yaw, pitch = vr.aim.pitch;
  const buttons = input.buttons;
  // Presses made while the sim is held (pause, a scene loading) are
  // dropped, as the flat game drops them.
  const pressed = game.timeScale === 0 ? 0 : input.pressed;
  // A press is acted on by the next step, which may be frames away (slow
  // motion, a busy sim) and after the button is up again: the tool counts
  // as in use until that step has run.
  const step = ctx.lastOut ? ctx.lastOut[OUT.STAT_FRAME] : 0;
  if (pressed & (BUTTON.PRIMARY | BUTTON.SECONDARY)) vr.pressStep = step;
  // The engine sprints only forwards of its look direction. A hand that
  // hangs by the side points anywhere, so while the tool is idle a sprint
  // looks along the way it runs.
  const busy = buttons & (BUTTON.PRIMARY | BUTTON.SECONDARY) || step === vr.pressStep || host.toolState()[TOOL_STATE.HELD_BODY] > 0;
  if (buttons & BUTTON.SPRINT && !busy && wl > 0.3) {
    yaw = Math.atan2(-wx, -wz);
    pitch = 0;
  }
  const mz = -Math.sin(yaw) * wx - Math.cos(yaw) * wz, mx = Math.cos(yaw) * wx - Math.sin(yaw) * wz;

  if (input.toolStep) {
    for (let k = 1; k < TOOL.COUNT; k++) {
      const next = (game.tool + input.toolStep * k + TOOL.COUNT * k) % TOOL.COUNT;
      game.tool = next;
      if (game.tool === next) break;
    }
    input.tool.pulse(0.2, 20);
  }
  // No bob, no landing dip, no sprint zoom on a head that is the player's
  // own; and a blast leaves the body where it stands (it wounds all the
  // same): the room goes with the body, and a player's own rocket four
  // metres off carried the view twelve metres at eleven metres a second.
  // (An engine that has no such bit takes the rest. Said again several
  // times a second: a restart, or a change in the menu, applies the flat
  // game's settings, which leaving VR puts back.)
  if (vr.sent % 12 === 0) host.config(VIEW_FX.BLAST_STILL || 0, game.settings.values.fov);
  host.input(mx, mz, yaw, pitch, buttons, pressed, game.tool);
  // The gun's own answer at the press (game_press.js; nothing unless the
  // page answers presses, and then only on the engine's word that this
  // press makes a shot): the shot's sound and the tool's jump in the hand
  // are the shell's listeners' (the head's view takes no kick, here as
  // ever, and the page gives a headset no flash); the hand's pulse is
  // given here, and then not again when the shot's event comes a frame
  // later from a sim in its worker (haptics).
  if (pressed & BUTTON.PRIMARY && game.press && game.press.at(game.tool) >= 0) {
    const s = SHOT_PULSE[game.tool];
    if (s) input.tool.pulse(s[0], s[1]);
    (vr.owed || (vr.owed = new Owed())).add(game.tool);
  }
  // (A jump is the player's own way up and down: rideOf.)
  if ((buttons | pressed) & BUTTON.JUMP) vr.jumpAt = vr.now;
  // (Kept for whoever must say something to the engine between two
  // frames: the hands, when a pinch opens.)
  const g = vr.given;
  g[0] = mx; g[1] = mz; g[2] = yaw; g[3] = pitch; g[4] = buttons; g[5] = pressed; g[6] = game.tool;
  vr.sent++;
}

// The events of the steps since the last frame, as pulses in the hands.
function haptics(vr, out) {
  const frame = out[OUT.STAT_FRAME], total = out[OUT.EVENT_TOTAL];
  if (frame === vr.evFrame) return;
  vr.evFrame = frame;
  let fresh = vr.evTotal < 0 ? 0 : (total - vr.evTotal) >>> 0;
  vr.evTotal = total;
  const n = out[OUT.EVENT_COUNT];
  if (fresh > n) fresh = n;
  // (Pulses given at a press and not yet answered by the world's shot.)
  const owed = vr.owed;
  if (!fresh) { if (owed) owed.stepped(); return; }
  const f = vr.host.floats(), h = vr.view.head, t = vr.input.tool, o = vr.input.other;
  let p = (out[OUT.EVENTS_PTR] >> 2) + (n - fresh) * EV_STRIDE;
  for (let i = 0; i < fresh; i++, p += EV_STRIDE) {
    const kind = f[p], mag = f[p + 4];
    const d = Math.hypot(f[p + 1] - h[12], f[p + 2] - h[13], f[p + 3] - h[14]);
    let both = 0, ms = 60;
    if (kind === EV.SHOT) {
      const s = SHOT_PULSE[f[p + 6] | 0];
      if (s && !(owed && owed.take(f[p + 6] | 0))) t.pulse(s[0], s[1]);
    } else if (kind === EV.EXPLOSION) {
      // The same reach and strength the flat camera shakes by.
      const k = 1 - d / (6 + 9 * mag);
      if (k > 0) { both = k * k * Math.min(1, 0.45 + 0.35 * mag * f[p + 6]); ms = 80 + 220 * both; }
    } else if (kind === EV.FOOTSTEP) {
      if (f[p + 6] === 1) { both = Math.min(0.6, 0.12 + mag * 0.05); ms = 45; }
    } else if (kind === EV.IMPACT) {
      const k = 1 - d / 40;
      if (k > 0) both = Math.min(0.6, k * k * Math.sqrt(mag / 30000));
      if (both < 0.08) both = 0;
    }
    if (both > 0) { t.pulse(both, ms); o.pulse(both * 0.8, ms); }
  }
  if (owed) owed.stepped();
}

function readout(vr, active, ts) {
  const game = vr.ctx.game, charges = ts[TOOL_STATE.CHARGES], item = ts[TOOL_STATE.SPAWN_ITEM], held = ts[TOOL_STATE.HELD_BODY] > 0 ? 1 : 0;
  const state = game.mode !== 'play' ? 2 : game.timeScale < 1 ? 1 : 0;
  // The lower face button of the hand without the tool.
  const pauseKey = vr.opts.hand === 'left' ? 'A' : 'X';
  // (A tool this file has not heard of still gets its name on the panel.)
  const fuel = active === TOOL.FLAME ? Math.round(ts[TOOL_STATE.FUEL] * 20) * 5 : 0;
  vr._status();
  const key = active + charges * 16 + item * 1024 + held * 8192 + state * 16384 + fuel * 65536 + (pauseKey === 'A' ? 1 << 24 : 0) + vr.statusAt * 33554432;
  if (key === vr.readoutKey) return;
  vr.readoutKey = key;
  let line = charges > 0 ? `${charges} charge${charges === 1 ? '' : 's'} placed` : '';
  if (active === TOOL.CHARGE) line = `${charges} of ${ts[TOOL_STATE.MAX_CHARGES]} placed`;
  else if (active === TOOL.SPAWNER) line = SPAWN_NAMES[item] || '';
  else if (active === TOOL.GRAVITY && held) line = 'Holding';
  else if (active === TOOL.FLAME) line = `Fuel ${fuel}%`;
  vr.overlay.setText(active < TOOL.COUNT ? TOOLS[active].name : 'Empty hands', line, state === 2 ? `Paused. ${pauseKey} resumes; hold ${pauseKey}: leave VR` : state === 1 ? 'Slow motion' : '', vr.status);
}

// How much the room is being carried by something the player did not ask
// for, 0 to 1. The room's own speed at the head (where last frame's place
// of the head in the room is in the world now, less where it was; a turn
// about the head is none), eased over a tenth of a second so that a ledge
// stepped up is not a flight, against what the player's own doing
// explains. Along: the stick, up to a run, and a moment more while the
// body comes to rest. Up and down: a jump and its landing, for a second
// and a half after the button; a slope taken at a run (the body drops as
// fast as it goes along) and the ledges of a crater climbed with the
// stick pushed; otherwise little, and next to nothing for a
// player who stands on something that moves (a span on its way down).
// Past that by 2 m/s along or 3 m/s up or down (1 m/s for what the
// player stands on) the view is fully taken.
const OWN_RUN = 8.5, OWN_REST = 0.8, OWN_JUMP = 6, OWN_DROP = 2.5, OWN_CLIMB = 4.5, JUMP_MS = 1500;
// Faster than anything in the game moves a body (a fall ends near 50 m/s):
// the body was put somewhere else.
const PLACED = 80;
function rideOf(vr, M, hp, flags) {
  const r = vr.ride, t = vr.now, dt = (t - r.t) / 1000;
  const wx = M[0] * hp.x + M[8] * hp.z + M[12], wy = hp.y + M[13], wz = M[2] * hp.x + M[10] * hp.z + M[14];
  if (r.ok && dt > 1e-3 && dt < 0.5) {
    const ax = M[0] * r.px + M[8] * r.pz + M[12], ay = r.py + M[13], az = M[2] * r.px + M[10] * r.pz + M[14];
    const k = 1 - Math.exp(-dt / 0.1), along = Math.hypot(ax - r.x, az - r.z) / dt, up = Math.abs(ay - r.y) / dt;
    if (along > PLACED || up > PLACED) {
      // (Put somewhere else: a job's start, a restart. Not a motion.)
      r.along = r.up = 0;
    } else {
      r.along += (along - r.along) * k;
      r.up += (up - r.up) * k;
    }
    r.own = vr.stick > 0.05 ? OWN_RUN : Math.max(OWN_REST, r.own - 12 * dt);
  } else {
    // (The first frame, or the first after a long gap: nothing to go by.)
    r.along = r.up = 0;
    r.own = OWN_RUN;
  }
  r.ok = true;
  r.t = t;
  r.px = hp.x; r.py = hp.y; r.pz = hp.z;
  r.x = wx; r.y = wy; r.z = wz;
  const jumped = vr.jumpAt > 0 && t - vr.jumpAt < JUMP_MS, riding = !jumped && (flags & PFLAG.ON_BODY) !== 0;
  const drop = Math.max(jumped ? OWN_JUMP : riding ? OWN_REST : OWN_DROP, vr.stick > 0.05 ? Math.max(r.along, OWN_CLIMB) : 0);
  return Math.max(0, Math.min(1, (r.along - r.own) / 2), Math.min(1, (r.up - drop) / (riding ? 1 : 3)));
}

// The engine's own eye height between its last two steps, by the share of
// the way the host's camera has gone between them (the frame's alpha). The
// engine moves its eye (a crouch; a player with nothing left of their
// health is lowered to 0.4 m where a job holds them down), a quarter of a
// metre in a step, and the camera main.js interpolates is feet plus eye:
// taking this step's eye height out of it left the headset's eye up to
// that quarter of a metre wrong for a frame, every step the eye moved,
// and wrong for good where the game stopped half way. Where a frame ran
// several steps the step before the last was not seen: the eye is taken
// to have moved evenly through them.
function eyeBetween(vr, out, eyeH) {
  const e = vr.eye, step = out[OUT.STAT_FRAME], n = step - e.step;
  if (n !== 0) {
    e.was = e.step < 0 || n < 0 ? eyeH : n === 1 ? e.now : eyeH - (eyeH - e.now) / n;
    e.now = eyeH;
    e.step = step;
  }
  const f = vr.ctx.sim ? vr.ctx.sim.frame : null, a = f && Number.isFinite(f.alpha) ? Math.max(0, Math.min(1, f.alpha)) : 1;
  return e.was + (e.now - e.was) * a;
}

// After the steps: both eyes, then the hands. False when nothing was drawn.
export function present(vr, out) {
  const { ctx, rig, input, view, overlay, opts, host } = vr, { game, renderer } = ctx;
  const pose = vr.pose;
  if (!vr.xf || renderer.gl.isContextLost()) return false;
  if (!pose || !vr.layer) {
    // No eye can be drawn (tracking lost, the layer not yet remade). The
    // frame still has to pass through the renderer: the engine hands each
    // world edit over once, and a frame not drawn would lose them for good.
    renderer.render(out);
    return false;
  }
  const hp = pose.transform.position;
  const ps = host.playerState();
  // main.js has just put the interpolated body camera here: the engine's
  // eye between its last two steps. The headset stands on the feet under
  // it, so the engine's eye height comes out again, as it was at each of
  // those two steps (eyeBetween).
  const cam = renderer.cam.pos, fx = cam[0], fy = cam[1] - eyeBetween(vr, out, ps[PLAYER_STATE.EYE_HEIGHT]), fz = cam[2];
  if (!rig.placed) vr.place(fx, fz);
  // How tall the player stands (xr_rig.js: Stature), and their own correction.
  if (!!opts.seated !== vr.seated) { vr.seated = !!opts.seated; vr.stature.forced = false; vr.stature.again(); }
  rig.lift = vr.stature.feed(hp.y, vr.floor, vr.seated) + (opts.rise || 0);
  const flags = ps[PLAYER_STATE.FLAGS];
  const idle = vr.stick < 0.05 && (flags & PFLAG.GROUND) !== 0 && (flags & PFLAG.ON_BODY) === 0;
  rig.carry(fx, fz, hp.x, hp.z, vr.dt, idle);
  const M = rig.matrix(fy);
  const carried = rideOf(vr, M, hp, flags);
  view.begin(M, pose, vr.layer);
  view.draw(out);
  if (view.drawn === 0 || renderer.gl.isContextLost()) return false;

  const playing = game.mode === 'play';
  const ts = host.toolState(), active = ts[TOOL_STATE.ACTIVE];
  const head = view.head;
  overlay.begin();
  if (input.tool.tracked) {
    mulRigid(_toolW, M, input.tool.ray);
    // A blast is felt in the hand, never in the head: the tool jumps about
    // (not in a paused game, whose shake stands still with everything else).
    const shake = playing && game.feel ? game.feel.trauma : 0, amp = shake * shake * 0.012, t = vr.now * 0.001;
    _toolW[12] += amp * Math.sin(t * 47); _toolW[13] += amp * Math.sin(t * 41 + 0.9); _toolW[14] += amp * Math.sin(t * 33.7 + 4.2);
    overlay.model(_toolW, TOOL_MODELS[active] || HAND_MODEL);
    if (playing && active < TOOL.COUNT) {
      const aim = vr.aim, col = aim.blocked ? AIM_COLOURS.blocked : ts[TOOL_STATE.AIM] ? AIM_COLOURS.ready : AIM_COLOURS.idle;
      _a[0] = _toolW[12]; _a[1] = _toolW[13]; _a[2] = _toolW[14];
      if (aim.has) {
        _hit[0] = aim.hit[0]; _hit[1] = aim.hit[1]; _hit[2] = aim.hit[2];
        const far = Math.hypot(_hit[0] - head[12], _hit[1] - head[13], _hit[2] - head[14]);
        const half = Math.max(0.006, Math.min(0.2, far * 0.004));
        overlay.obb(_hit[0], _hit[1], _hit[2], half, 0, 0, 0, half, 0, 0, 0, half, col[0], col[1], col[2], 0);
      } else {
        _hit[0] = _a[0] - _toolW[8] * 12; _hit[1] = _a[1] - _toolW[9] * 12; _hit[2] = _a[2] - _toolW[10] * 12;
      }
      // The line stops short of the dot and never runs out of sight.
      const dx = _hit[0] - _a[0], dy = _hit[1] - _a[1], dz = _hit[2] - _a[2], len = Math.hypot(dx, dy, dz), k = Math.min(1, 12 / Math.max(len, 1e-3)) * 0.97;
      _b[0] = _a[0] + dx * k; _b[1] = _a[1] + dy * k; _b[2] = _a[2] + dz * k;
      overlay.segment(_a, _b, 0.0015, col[0], col[1], col[2]);
    }
  }
  if (input.other.tracked) {
    mulRigid(_otherW, M, input.other.grip);
    overlay.model(_otherW, HAND_MODEL);
    readout(vr, active, ts);
    _a[0] = _otherW[12]; _a[1] = _otherW[13] + 0.11; _a[2] = _otherW[14];
    _b[0] = head[12]; _b[1] = head[13]; _b[2] = head[14];
    overlay.panelAt(_a, _b, 0.16, 0.09);
  } else if (!vr.cardOff) {
    // No hand holds the readout (hands alone, a controller asleep): it
    // floats low in front of where the player stood when it was put there,
    // in the room, so it comes along and is found again by looking down.
    if (!vr.card) {
      const yaw = facing(pose.transform.matrix);
      vr.card = [hp.x - Math.sin(yaw) * 0.8, hp.y - 0.42, hp.z - Math.cos(yaw) * 0.8];
    }
    readout(vr, active, ts);
    const c = vr.card;
    _a[0] = M[0] * c[0] + M[8] * c[2] + M[12]; _a[1] = c[1] + M[13]; _a[2] = M[2] * c[0] + M[10] * c[2] + M[14];
    _b[0] = head[12]; _b[1] = head[13]; _b[2] = head[14];
    overlay.panelAt(_a, _b, 0.48, 0.27);
  }
  // The edges of the view close in while the stick carries the player,
  // and all the way, at once, while something else does: the room goes
  // with the body. A blast (a player's own rocket four metres off carried
  // the view twelve metres at eleven metres a second on the mock, before
  // the host asked the engine not to throw a player in a headset), a
  // fall, a piece that pushes, a span ridden down (rideOf). What any of
  // that is like on a head nobody here can say.
  const taken = vr.taken = (flags & PFLAG.THROWN) !== 0 ? 1 : carried;
  const want = opts.vignette && playing ? Math.max(taken, Math.min(1, vr.moving * 1.5)) : 0;
  vr.vignette += (want - vr.vignette) * Math.min(1, vr.dt * (taken > 0.5 && want > vr.vignette ? 60 : 8));
  // While the view is taken (not while the stick carries the player: that
  // is theirs), a cage that stands still in the player's own room is drawn
  // over the darkened edge: it comes up about where the head is then, and
  // stays there, level, whatever the body does.
  const cg = vr.cage;
  if (taken > 0.5 && opts.vignette && playing) {
    if (cg.on <= 0.01) { cg.at[0] = hp.x; cg.at[1] = hp.y; cg.at[2] = hp.z; }
    cg.on += (1 - cg.on) * Math.min(1, vr.dt * 30);
  } else cg.on += (0 - cg.on) * Math.min(1, vr.dt * 8);
  overlay.cage(M, cg.at, cg.on);
  overlay.draw(view, 1 - 0.6 * renderer.frame.night, vr.vignette * 0.9);
  if (vr.mirror) overlay.mirror(view);
  haptics(vr, out);
  return true;
}
