// Camera feel driven by sim events: trauma-based shake, a brief fov punch on
// big blasts, and recoil eased into the look direction. Everything here is
// host-side presentation; none of it feeds back into the simulation except
// the recoil, which the engine itself asked for (see TOOL_STATE.KICK_*).
import { EV, EV_STRIDE, OUT, PFLAG, TOOL, TOOL_STATE } from './engine.js';
import { Owed } from './game_press.js';

// Shake is trauma squared, so small knocks stay invisible and only real
// violence moves the camera. Amplitudes are deliberately small and the decay
// fast: full trauma is about one degree and is gone in half a second.
const MAX_ANGLE = 0.02;
const TRAUMA_DECAY = 1.9;
const PUNCH_DEG = 3.5;
const PUNCH_MAX = 5;
const PITCH_LIMIT = 1.55;
// Explosions (EXPLOSION: magnitude = radius in metres, a = power). Felt out
// to BLAST_REACH + BLAST_REACH_PER_M * radius, falling off with the square
// of the distance left; a blast of yield (radius * power) 1.6 or more at
// arm's length is "full". With the tools' sizes: a rocket 3 m away 0.63, at
// 10 m 0.23; a charge at 3 m 0.53; the 4 m button blast at 15 m 0.41.
const BLAST_REACH = 6;
const BLAST_REACH_PER_M = 9;
const BLAST_BASE = 0.45;
const BLAST_PER_YIELD = 0.35;
// Things landing (IMPACT: magnitude = impulse in N s). These are not added
// up: a collapse is thousands of them, and the sum says how long it lasts,
// not how hard it is. The camera rumbles as hard as the hardest thing that
// landed lately, by the square root of its impulse (30 kN s, a five-tonne
// slab at 6 m/s, beside the player is the cap), fading with distance, and
// eases off when it goes on and on: a block coming down thirty metres away
// is a tremor however long it takes, not ten seconds of earthquake.
const RUMBLE_IMPULSE = 30000;
const RUMBLE_REACH = 40;
const RUMBLE_MAX = 0.6;
const RUMBLE_DECAY = 2.5;
// Seconds of continuous rumble it takes to tire of it, and how far the
// shake is turned down by then.
const FATIGUE_TIME = 2.5;
const FATIGUE_CUT = 0.55;
// Chunks coming loose (DETACH: magnitude = voxels) and material torn out
// nearby (BREAK: voxels) give a small jolt each.
const DETACH_VOXELS = 100000;
const DETACH_MAX = 0.2;
const BREAK_VOXELS = 3000;
const BREAK_MAX = 0.15;
// What firing each tool does to the camera, on top of its recoil (the
// hammer dips instead; charges and the spawner are quiet).
const SHOT_KICK = [0, 0.05, 0.22, 0.18, 0, 0.12, 0.3, 0];
// Recoil is fed in over a few frames rather than as a one-frame jump, and
// this fraction of the vertical kick settles back afterwards.
const RECOIL_RATE = 45;
const RECOVER = 0.6;
const RECOVER_RATE = 4;
// The sledgehammer has no recoil; its swing dips the camera instead (more
// when it connects) and the dip settles completely.
const SWING_DIP = 0.006;
const HIT_DIP = 0.016;
// Thrown by a blast (PFLAG.THROWN: no legs under them, the stick waits):
// the view sways for as long as that lasts, slowly, so that it reads as
// being off one's feet and not as more shaking. About two degrees, in
// within a tenth of a second and out over a third once they are up.
const THROWN_SWAY = 0.035;
const THROWN_IN = 12;
const THROWN_OUT = 3.5;

export function createFeel(ctx, settings, look) {
  const { sim } = ctx;
  // Shots whose kick was given at the press (game_press.js) and whose event
  // the world has yet to send: that event's kick is not added again.
  const owed = new Owed();
  // Per-frame floats live in a typed array: a number written to a closure
  // variable is boxed on the heap every time, an array element is not.
  const S = new Float64Array(13);
  const TRAUMA = 0, TIME = 1, PUNCH = 2, KICK_PITCH = 3, KICK_YAW = 4, PEND_PITCH = 5, PEND_YAW = 6, OWED = 7, HIT = 8, DIP = 9, RUMBLE = 10, FATIGUE = 11, THROWN = 12;
  let lastFrame = -1;
  let thrown = false;
  // The kick of shots answered at the press, until the next frame drawn.
  let pressed = 0;

  const feel = {
    reset() {
      const time = S[TIME];
      S.fill(0);
      S[TIME] = time;
      owed.clear();
      pressed = 0;
      lastFrame = -1;
      thrown = false;
      feel.rebase();
    },

    // Forget recoil reported so far. Called while something else owns the
    // look direction (scripted input), so a later switch back to real input
    // does not replay every kick at once.
    rebase() {
      const ts = sim.frame.toolState;
      S[KICK_PITCH] = ts[TOOL_STATE.KICK_PITCH];
      S[KICK_YAW] = ts[TOOL_STATE.KICK_YAW];
    },

    // Take the recoil the tools reported since the last call and ease it
    // into the look direction.
    recoil(dt) {
      const ts = sim.frame.toolState;
      S[PEND_PITCH] += ts[TOOL_STATE.KICK_PITCH] - S[KICK_PITCH];
      S[PEND_YAW] += ts[TOOL_STATE.KICK_YAW] - S[KICK_YAW];
      S[KICK_PITCH] = ts[TOOL_STATE.KICK_PITCH];
      S[KICK_YAW] = ts[TOOL_STATE.KICK_YAW];
      const k = 1 - Math.exp(-dt * RECOIL_RATE);
      const up = S[PEND_PITCH] * k, side = S[PEND_YAW] * k;
      S[PEND_PITCH] -= up;
      S[PEND_YAW] -= side;
      S[OWED] += up * RECOVER;
      const back = S[OWED] * (1 - Math.exp(-dt * RECOVER_RATE));
      S[OWED] -= back;
      const pitch = look.pitch + up - back;
      look.pitch = pitch > PITCH_LIMIT ? PITCH_LIMIT : pitch < -PITCH_LIMIT ? -PITCH_LIMIT : pitch;
      look.yaw += side;
    },

    update(dt) {
      // Comparisons rather than Math.max: outside the top JIT tier the
      // builtin returns a freshly boxed number on every call.
      S[TIME] += dt;
      const trauma = S[TRAUMA] - TRAUMA_DECAY * dt;
      S[TRAUMA] = trauma > 0 ? trauma : 0;
      const rumble = S[RUMBLE] - RUMBLE_DECAY * dt;
      S[RUMBLE] = rumble > 0 ? rumble : 0;
      const tired = S[FATIGUE] + (S[RUMBLE] > 0.15 ? dt : -dt) / FATIGUE_TIME;
      S[FATIGUE] = tired > 1 ? 1 : tired > 0 ? tired : 0;
      S[PUNCH] *= Math.exp(-dt * 9);
      S[DIP] *= Math.exp(-dt * 14);
      const hit = S[HIT] - dt * 8;
      S[HIT] = hit > 0 ? hit : 0;
      const sway = S[THROWN] + (thrown ? (1 - S[THROWN]) * (1 - Math.exp(-dt * THROWN_IN)) : -S[THROWN] * (1 - Math.exp(-dt * THROWN_OUT)));
      S[THROWN] = sway > 1e-3 ? sway : 0;
    },

    // Fold the events of the steps since the last rendered frame into trauma.
    // The event buffer is only cleared by the next sim step, so a frame that
    // stepped nothing (pause, slow motion, fast displays) shows the same
    // events again: the step counter tells the two apart.
    read(out) {
      thrown = (out[OUT.PLAYER_FLAGS] & PFLAG.THROWN) !== 0;
      if (pressed > 0) {
        const trauma = S[TRAUMA] + pressed;
        S[TRAUMA] = trauma > 0 ? Math.min(1, trauma) : 0;
        pressed = 0;
      }
      const frame = out[OUT.STAT_FRAME];
      if (frame === lastFrame) return;
      lastFrame = frame;
      const n = out[OUT.EVENT_COUNT];
      if (n === 0) { owed.stepped(); return; }
      const f = sim.frame.f32;
      const cam = ctx.renderer.cam.pos;
      let p = out[OUT.EVENTS_PTR] >> 2;
      let add = 0, thud = 0, fov = 0;
      let shot = false, broke = false, swung = false;
      for (let i = 0; i < n; i++, p += EV_STRIDE) {
        const kind = f[p];
        const dx = f[p + 1] - cam[0], dy = f[p + 2] - cam[1], dz = f[p + 3] - cam[2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const mag = f[p + 4];
        if (kind === EV.EXPLOSION) {
          const k = 1 - d / (BLAST_REACH + BLAST_REACH_PER_M * mag);
          if (k > 0) {
            const s = k * k * Math.min(1, BLAST_BASE + BLAST_PER_YIELD * mag * f[p + 6]);
            add += s;
            fov += s * PUNCH_DEG;
          }
        } else if (kind === EV.IMPACT) {
          const k = 1 - d / RUMBLE_REACH;
          if (k > 0) {
            const s = k * k * Math.sqrt(mag / RUMBLE_IMPULSE);
            if (s > thud) thud = s;
          }
        } else if (kind === EV.DETACH) {
          if (d < 30) add += (1 - d / 30) * Math.min(DETACH_MAX, Math.sqrt(mag / DETACH_VOXELS));
        } else if (kind === EV.SHOT) {
          const tool = f[p + 6];
          if (!owed.take(tool)) add += tool >= 0 && tool < SHOT_KICK.length ? SHOT_KICK[tool] : 0;
          shot = true;
          if (tool === TOOL.HAMMER) swung = true;
        } else if (kind === EV.BREAK) {
          // Material torn out close by: a little, on top of whatever did it.
          if (d < 10) add += (1 - d / 10) * Math.min(BREAK_MAX, mag / BREAK_VOXELS);
          broke = true;
        }
      }
      // Written as comparisons so that a NaN from a bad event resets the
      // value instead of sticking in it.
      const trauma = S[TRAUMA] + add;
      S[TRAUMA] = trauma > 0 ? Math.min(1, trauma) : 0;
      thud = thud < RUMBLE_MAX ? thud : RUMBLE_MAX;
      if (thud > S[RUMBLE]) S[RUMBLE] = thud;
      const punch = S[PUNCH] + fov;
      S[PUNCH] = punch > 0 ? Math.min(PUNCH_MAX, punch) : 0;
      if (shot && broke) S[HIT] = 1;
      owed.stepped();
      if (swung) S[DIP] = Math.max(-0.03, S[DIP] - (broke ? HIT_DIP : SWING_DIP));
    },

    // The gun's own kick, at a press the page answers itself (game_press.js:
    // the engine's word that this press makes a shot of `tool`): given now,
    // in the frame of the press, and not again when the shot's event comes
    // a frame later from a simulation in its worker. The recoil the tools
    // report is the world's still (its yaw is the engine's random number).
    // (Kept until the next frame is drawn, as an event's kick is added
    // when its frame is drawn: given to the shake at the press itself, the
    // frame's own decay would have had a thirtieth of a second of it
    // before anything was seen, which is all of a rifle's.)
    shot(tool) {
      pressed += tool >= 0 && tool < SHOT_KICK.length ? SHOT_KICK[tool] : 0;
      owed.add(tool);
    },

    // Offset the render camera. Called after main.js has set it for the
    // frame. A noclip camera is a tripod (harness shots, fly mode): it stays
    // exactly where it was put.
    apply(renderer, noclip) {
      if (noclip) return;
      const scale = settings.values.shake;
      const level = feel.trauma;
      const amp = level * level * MAX_ANGLE * scale;
      const cam = renderer.cam;
      const time = S[TIME];
      const some = scale < 1 ? scale : 1;
      let pitch = cam.pitch + S[DIP] * some;
      if (amp > 1e-5) {
        // Two incommensurate sines per axis: smooth, cheap, never repeats
        // visibly, and deterministic for the capture harness.
        cam.yaw += amp * (0.6 * Math.sin(time * 47.0) + 0.4 * Math.sin(time * 29.3 + 1.7));
        pitch += amp * (0.6 * Math.sin(time * 41.0 + 0.9) + 0.4 * Math.sin(time * 33.7 + 4.2));
      }
      if (S[THROWN] > 0) {
        const sway = S[THROWN] * THROWN_SWAY * some;
        cam.yaw += sway * Math.sin(time * 5.3);
        pitch += sway * 0.7 * Math.sin(time * 4.1 + 1.3);
      }
      // Stay short of straight up or down, where the view matrix degenerates.
      cam.pitch = pitch > 1.56 ? 1.56 : pitch < -1.56 ? -1.56 : pitch;
      renderer.fov += S[PUNCH] * some;
    },

    // Crosshair feedback: true for a moment after a shot of ours broke
    // something.
    get hit() { return S[HIT] > 0; },
    // True while any of the effects above is still visibly settling.
    get active() { return S[TRAUMA] > 0 || S[RUMBLE] > 0 || S[PUNCH] > 0.01 || S[DIP] < -1e-4 || S[HIT] > 0 || S[THROWN] > 0; },
    // What shakes the camera: sudden things (blasts, shots, breakage) or
    // the rumble of things landing, whichever is the stronger.
    get trauma() {
      const rumble = S[RUMBLE] * (1 - FATIGUE_CUT * S[FATIGUE]);
      return S[TRAUMA] > rumble ? S[TRAUMA] : rumble;
    },
    get rumble() { return S[RUMBLE]; },
    get punch() { return S[PUNCH]; },
    // How far the sway of someone thrown has come in (0 to 1).
    get thrown() { return S[THROWN]; },
  };
  return feel;
}
