// VR controllers: poses, sticks and buttons of the session's input sources
// turned into what the game understands. Nothing here talks to the engine;
// xr.js does that with what this collects once per XR frame.
//
// Layout (the 'xr-standard' gamepad, which Quest, Pico, Index, Vive and WMR
// controllers report; which physical button lands on which index is the
// vendor's doing and has not been tried on a device, see docs/VR.md):
//   tool hand (right unless swapped): trigger = fire, grip = secondary,
//     A = jump, B = next tool, stick left/right = turn, stick click =
//     take this head height as the seated one
//   other hand: stick = move, stick click = sprint, Y = previous tool,
//     X = pause (hold: leave VR)
// With no controller at all the same intents come from the hands
// (xr_hands.js: pinches, with or without joints).
import { BUTTON } from './engine.js';
import { Hands, isController } from './xr_hands.js';

const TRIGGER = 0, SQUEEZE = 1, STICK = 3, FACE_LOW = 4, FACE_HIGH = 5;
const DEAD = 0.15;
// Fewest milliseconds between two pulses sent to one hand.
const PULSE_GAP = 25;

// A stick axis with the dead zone taken out and the rest stretched to -1..1.
function axis(v) {
  if (!(Math.abs(v) > DEAD)) return 0;
  return Math.sign(v) * Math.min(1, (Math.abs(v) - DEAD) / (1 - DEAD));
}

class Hand {
  constructor() {
    this.source = null;
    this.tracked = false;
    this.ray = new Float32Array(16);    // pointing pose, xr space
    this.grip = new Float32Array(16);   // where the hand holds, xr space
    this.x = 0; this.y = 0;             // stick: right and away are positive
    this.down = 0;                      // bit per gamepad button held
    this.edge = 0;                      // bits that went down this frame
    this.pulseAt = 0;
    this.want = 0; this.wantMs = 0;     // strongest pulse asked for since the last one sent
  }

  read(frame, space, source) {
    this.source = source;
    this.tracked = false;
    this.edge = 0;
    if (!source) {
      this.x = this.y = 0;
      this.down = 0;
      return;
    }
    const ray = source.targetRaySpace ? frame.getPose(source.targetRaySpace, space) : null;
    if (ray) {
      this.ray.set(ray.transform.matrix);
      const grip = source.gripSpace ? frame.getPose(source.gripSpace, space) : null;
      this.grip.set(grip ? grip.transform.matrix : ray.transform.matrix);
      this.tracked = true;
    }
    const pad = source.gamepad;
    let down = 0;
    this.x = this.y = 0;
    if (pad) {
      const b = pad.buttons, n = Math.min(b.length, 8);
      for (let i = 0; i < n; i++) if (b[i] && (b[i].pressed || (i <= SQUEEZE && b[i].value > 0.6))) down |= 1 << i;
      // The thumbstick is the second pair of axes; a pad with only one
      // pair (a touchpad wand) uses that.
      const a = pad.axes, o = a.length >= 4 ? 2 : 0;
      this.x = axis(a[o] || 0);
      this.y = -axis(a[o + 1] || 0);
    }
    this.edge = down & ~this.down;
    this.down = down;
  }

  // Ask for a pulse (0..1, milliseconds); the strongest of a frame is sent.
  pulse(value, ms) {
    if (value > this.want) { this.want = value; this.wantMs = ms; }
  }

  flush(now) {
    if (!(this.want > 0.02) || now - this.pulseAt < PULSE_GAP) return;
    const pad = this.source && this.source.gamepad, v = Math.min(1, this.want), ms = this.wantMs;
    this.want = 0;
    this.pulseAt = now;
    if (!pad) return;
    try {
      const a = pad.hapticActuators && pad.hapticActuators[0];
      if (a && a.pulse) {
        const p = a.pulse(v, ms);
        if (p && p.catch) p.catch(() => {});
      } else if (pad.vibrationActuator && pad.vibrationActuator.playEffect) {
        const p = pad.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: v, weakMagnitude: v });
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {
      // A controller without a motor: nothing to feel.
    }
  }
}

export class XrInput {
  constructor() {
    this.tool = new Hand();    // the hand that holds the tool
    this.other = new Hand();
    this.buttons = 0;          // BUTTON bits held
    this.pressed = 0;          // BUTTON bits that went down this frame
    this.toolStep = 0;         // +1 / -1 when a tool-cycle button went down
    this.pauseDown = false;    // the pause button is held
    this.pauseEdge = false;
    this.heightEdge = false;   // the tool hand's stick was clicked (seated height)
    this.sprint = false;       // latched by a stick click until the stick is let go
    this.moveX = 0; this.moveY = 0; this.turn = 0;
    this.hands = new Hands();  // the same intents with nothing held (xr_hands.js)
    // Hands only: a pinch was made while the game is not in play (paused,
    // or behind a card): it comes with pauseEdge, which plays on. Whoever
    // answers the card another way takes this and clears pauseEdge.
    this.answer = false;
  }

  // frame: the XRFrame; space: the reference space poses are wanted in;
  // toolHand: 'right' or 'left'.
  read(frame, session, space, toolHand) {
    let tool = null, other = null, spare = null;
    const sources = session.inputSources;
    for (let i = 0; i < sources.length; i++) {
      const s = sources[i];
      // Hands, with joints or as a pinch alone, are read by xr_hands.js.
      if (!isController(s)) continue;
      if (s.handedness === toolHand) tool = tool || s;
      else if (s.handedness === 'left' || s.handedness === 'right') other = other || s;
      else spare = spare || s;
    }
    // A single controller that does not say which hand it is in is the tool.
    if (!tool && spare) tool = spare;
    // No controller at all: the hands are the input.
    if (!tool && !other) { this.hands.read(frame, session, space, toolHand, this); return; }
    this.hands.idle();
    this.answer = false;
    const t = this.tool, o = this.other;
    t.read(frame, space, tool);
    o.read(frame, space, other);
    let held = 0, pressed = 0;
    if (t.down & (1 << TRIGGER)) held |= BUTTON.PRIMARY;
    if (t.down & (1 << SQUEEZE)) held |= BUTTON.SECONDARY;
    if (t.down & (1 << FACE_LOW)) held |= BUTTON.JUMP;
    if (t.edge & (1 << TRIGGER)) pressed |= BUTTON.PRIMARY;
    if (t.edge & (1 << SQUEEZE)) pressed |= BUTTON.SECONDARY;
    if (t.edge & (1 << FACE_LOW)) pressed |= BUTTON.JUMP;
    this.toolStep = (t.edge & (1 << FACE_HIGH) ? 1 : 0) - (o.edge & (1 << FACE_HIGH) ? 1 : 0);
    this.pauseEdge = (o.edge & (1 << FACE_LOW)) !== 0;
    this.pauseDown = (o.down & (1 << FACE_LOW)) !== 0;
    this.heightEdge = !!other && (t.edge & (1 << STICK)) !== 0;
    // With one controller its stick walks: turning is then done by the feet.
    const walk = other ? o : t;
    this.moveX = walk.x;
    this.moveY = walk.y;
    this.turn = other ? t.x : 0;
    const moving = Math.hypot(walk.x, walk.y) > 0.3;
    if (walk.edge & (1 << STICK)) this.sprint = moving;
    if (!moving) this.sprint = false;
    if (this.sprint) held |= BUTTON.SPRINT;
    this.buttons = held;
    this.pressed = pressed;
  }

  // Nothing held (the session lost focus, the game left play).
  release() {
    this.buttons = this.pressed = 0;
    this.moveX = this.moveY = this.turn = 0;
    this.toolStep = 0;
    this.pauseEdge = this.pauseDown = this.heightEdge = false;
    this.sprint = false;
    this.answer = false;
    this.hands.idle();
  }

  flush(now) {
    this.tool.flush(now);
    this.other.flush(now);
  }
}
