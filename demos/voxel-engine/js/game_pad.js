// Gamepad: the standard mapping, polled once a tick.
//   left stick   move (L3: sprint until the stick is let go)
//   right stick  look
//   RT / LT      fire / alt (detonate, throw, cycle)
//   A / B        jump / crouch (held)
//   LB / RB      previous / next tool
//   Y            the big red button (an air strike in Mayhem)
//   X            slow motion
//   d-pad        the toy box, in the sandbox (open: A picks, B closes)
//   Start        menu, and back into play; Back: restart the scene
// Out of play A starts or resumes (on a result card it presses the main
// button, B the last one).
import { BUTTON } from './engine.js';

const DEAD = 0.16;
// Look speed at full deflection (rad/s) at sensitivity 1.
const LOOK_RATE = 2.9;
const TRIGGER = 0.35;
// Milliseconds between looks for a pad while none is plugged in.
const LOOK_EVERY = 1000;

// Past the dead zone a stick starts from zero, not from the dead zone's edge.
const axis = (v) => (Math.abs(v) < DEAD ? 0 : (v - Math.sign(v) * DEAD) / (1 - DEAD));

// hooks: { turn(dx, dy), capture(), menu(), next(dir), restart(), slow(),
//          card(primary) -> true when a result card took the press,
//          toys(hit, now) -> the buttons the toy box takes this tick }
export function createPad(state, settings, hooks) {
  let prev = 0, sprint = false;
  // Pads the browser has announced and not taken back; one was seen at
  // the last look; when that look was (ms).
  let events = 0, plugged = false, looked = -LOOK_EVERY, barred = false;
  window.addEventListener('gamepadconnected', () => { events++; plugged = true; });
  window.addEventListener('gamepaddisconnected', () => { events = Math.max(0, events - 1); });
  const pad = {
    // What game.js adds to the keyboard's and the touch controls' input.
    moveX: 0, moveZ: 0, buttons: 0, pressed: 0,
    // A pad has been used: prompts name its buttons.
    used: false,
    // The pad in use, for rumble.
    device: null,

    rumble(strength, ms) {
      const act = pad.device && pad.device.vibrationActuator;
      if (!act || !act.playEffect || !(settings.values.shake > 0)) return;
      const s = Math.min(1, strength);
      act.playEffect('dual-rumble', { duration: ms, strongMagnitude: s, weakMagnitude: 0.6 * s }).catch(() => {});
    },

    poll(dt) {
      pad.moveX = pad.moveZ = pad.buttons = 0;
      // Asking the browser for its pads crosses to it on every call (46
      // microseconds a frame, pad or no pad, in the frame engineer's
      // profile): asked every frame only while one is plugged in, as the
      // browser's own event says, and once a second otherwise (for a
      // browser, or a test, that has a pad and never said so).
      const t = performance.now();
      if (!plugged && t - looked < LOOK_EVERY) {
        if (pad.device) { pad.device = null; prev = 0; }
        return;
      }
      looked = t;
      // A page that frames this one may not have granted it gamepads: the
      // browser then refuses the call (Safari by throwing), and a throw here
      // stopped the whole frame loop. Refused once, it is not asked again.
      let list = null;
      if (!barred && navigator.getGamepads) { try { list = navigator.getGamepads(); } catch { barred = true; } }
      let g = null;
      for (let i = 0; list && i < list.length; i++) {
        if (list[i] && list[i].connected && list[i].buttons.length >= 10) { g = list[i]; break; }
      }
      pad.device = g;
      plugged = !!g || events > 0;
      if (!g) { prev = 0; return; }
      const down = (i) => !!g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > TRIGGER);
      let now = 0;
      for (let i = 0; i < 16 && i < g.buttons.length; i++) if (down(i)) now |= 1 << i;
      let hit = now & ~prev;
      prev = now;
      const lx = axis(g.axes[0] || 0), ly = axis(g.axes[1] || 0), rx = axis(g.axes[2] || 0), ry = axis(g.axes[3] || 0);
      if (now || lx || ly || rx || ry) pad.used = true;
      if (state.mode !== 'play') {
        // Start, A: into play, or the card's main button. B: its last.
        if (hit & (1 << 0 | 1 << 9)) { if (!hooks.card(true)) hooks.capture(); }
        else if (hit & (1 << 1)) hooks.card(false);
        return;
      }
      // The toy box (game_toys.js): the d-pad opens it and moves through
      // it, and what it takes of this tick's buttons is not the game's.
      if (hooks.toys) {
        const taken = hooks.toys(hit, now);
        now &= ~taken;
        hit &= ~taken;
      }
      pad.moveX = lx;
      pad.moveZ = -ly;
      if (!lx && !ly) sprint = false;
      else if (hit & (1 << 10)) sprint = true;
      // Squared response: fine aim near the centre, a quick turn at the rim.
      const k = LOOK_RATE * settings.values.sens * dt;
      if (rx || ry) hooks.turn(rx * Math.abs(rx) * k, ry * Math.abs(ry) * k);
      let b = 0;
      if (now & (1 << 7)) b |= BUTTON.PRIMARY;
      if (now & (1 << 6)) b |= BUTTON.SECONDARY;
      if (now & (1 << 0)) b |= BUTTON.JUMP;
      if (now & (1 << 1)) b |= BUTTON.CROUCH;
      if (sprint) b |= BUTTON.SPRINT;
      pad.buttons = b;
      // Latched like a click: a tap shorter than a sim step still counts.
      if (hit & (1 << 7)) pad.pressed |= BUTTON.PRIMARY;
      if (hit & (1 << 6)) pad.pressed |= BUTTON.SECONDARY;
      if (hit & (1 << 0)) pad.pressed |= BUTTON.JUMP;
      if (hit & (1 << 3)) pad.pressed |= BUTTON.BLAST;
      if (hit & (1 << 4)) hooks.next(-1);
      if (hit & (1 << 5)) hooks.next(1);
      if (hit & (1 << 2)) hooks.slow();
      if (hit & (1 << 8)) hooks.restart();
      if (hit & (1 << 9)) hooks.menu();
    },
  };
  return pad;
}
