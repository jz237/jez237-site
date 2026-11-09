// Touch controls: a floating stick under the left thumb, look-drag on the
// rest of the screen, and round buttons. Pointer events throughout, so every
// finger is its own stream and a mouse can drive the same code for testing.
import { BUTTON } from './engine.js';

const STICK_RADIUS = 56; // px of travel for full deflection
const DEAD_ZONE = 0.12;
// Pushing the stick to the rim sprints; anything inside it is an analogue walk.
const SPRINT_AT = 0.92;
const LOOK_RATE = 0.0045; // rad per px at sensitivity 1

export function createTouch(ctx, state, settings, actions) {
  // A button or the stick has changed: the shell tells the sim at once
  // (actions.heard: game.js), not with the next frame.
  const heard = () => { if (actions.heard) actions.heard(); };
  const layer = document.getElementById('touch');
  const stickEl = document.getElementById('stick');
  const knob = stickEl.firstElementChild;
  const buttons = [...layer.querySelectorAll('.tb')];
  // Pointer holding each button, or -1.
  const holder = new Int32Array(buttons.length).fill(-1);
  let stickId = -1, baseX = 0, baseY = 0;
  let lookId = -1, lookX = 0, lookY = 0;

  const touch = {
    moveX: 0, moveZ: 0, sprint: false,
    // Held button bits, and bits that went down since update() last took them.
    buttons: 0, pressed: 0,
    release() {
      stickId = lookId = -1;
      touch.moveX = touch.moveZ = 0;
      touch.sprint = false;
      // A crouch toggle survives; held buttons do not.
      touch.buttons &= BUTTON.CROUCH;
      holder.fill(-1);
      for (const b of buttons) if (!b.dataset.toggle) b.classList.remove('down');
      rest();
    },
  };

  function place(x, y) {
    baseX = x;
    baseY = y;
    stickEl.style.transform = `translate(${x}px, ${y}px)`;
  }

  // Idle position: where a left thumb naturally lands, clear of the belt.
  function rest() {
    stickEl.classList.remove('on');
    knob.style.transform = '';
    place(Math.min(110, window.innerWidth * 0.24), window.innerHeight - Math.min(210, window.innerHeight * 0.36));
  }

  function moveStick(x, y) {
    let dx = (x - baseX) / STICK_RADIUS, dy = (y - baseY) / STICK_RADIUS;
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    knob.style.transform = `translate(${dx * STICK_RADIUS}px, ${dy * STICK_RADIUS}px)`;
    const m = Math.min(1, len);
    if (m < DEAD_ZONE) {
      touch.moveX = touch.moveZ = 0;
    } else {
      touch.moveX = dx;
      touch.moveZ = -dy;
    }
    touch.sprint = m >= SPRINT_AT;
  }

  function drag(e, lastX, lastY) {
    const k = LOOK_RATE * settings.values.touchSens;
    actions.look((e.clientX - lastX) * k, (e.clientY - lastY) * k);
  }

  function grab(el, e) {
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic events have no live pointer to capture.
    }
  }

  layer.addEventListener('pointerdown', (e) => {
    if (e.target !== layer) return;
    // A real mouse on a touch-capable machine wants pointer lock instead.
    if (e.pointerType === 'mouse' && !state.forceTouch) {
      actions.capture();
      return;
    }
    e.preventDefault();
    grab(layer, e);
    if (stickId < 0 && e.clientX < window.innerWidth * 0.45) {
      stickId = e.pointerId;
      place(e.clientX, e.clientY);
      stickEl.classList.add('on');
      moveStick(e.clientX, e.clientY);
    } else if (lookId < 0) {
      lookId = e.pointerId;
      lookX = e.clientX;
      lookY = e.clientY;
    }
  });
  layer.addEventListener('pointermove', (e) => {
    if (e.pointerId === stickId) {
      moveStick(e.clientX, e.clientY);
    } else if (e.pointerId === lookId) {
      drag(e, lookX, lookY);
      lookX = e.clientX;
      lookY = e.clientY;
    }
  });
  const lift = (e) => {
    if (e.pointerId === stickId) {
      stickId = -1;
      touch.moveX = touch.moveZ = 0;
      touch.sprint = false;
      rest();
      heard();
    } else if (e.pointerId === lookId) {
      lookId = -1;
    }
  };
  layer.addEventListener('pointerup', lift);
  layer.addEventListener('pointercancel', lift);

  buttons.forEach((b, i) => {
    const bit = Number(b.dataset.btn || 0), toggle = Number(b.dataset.toggle || 0), act = b.dataset.act;
    let lastX = 0, lastY = 0;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (toggle) {
        touch.buttons ^= toggle;
        b.classList.toggle('down', (touch.buttons & toggle) !== 0);
        heard();
        return;
      }
      if (act || holder[i] >= 0) return;
      grab(b, e);
      holder[i] = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      touch.buttons |= bit;
      touch.pressed |= bit;
      b.classList.add('down');
      heard();
    });
    // A thumb resting on Fire can keep aiming: drags on a held button look.
    b.addEventListener('pointermove', (e) => {
      if (e.pointerId !== holder[i]) return;
      drag(e, lastX, lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    });
    const up = (e) => {
      if (e.pointerId !== holder[i]) return;
      holder[i] = -1;
      touch.buttons &= ~bit;
      b.classList.remove('down');
      heard();
    };
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    // Actions fire on the click, after the finger lifts: acting on the press
    // would let the click that follows land on whatever the action opened
    // (the menu's backdrop, which resumes).
    // (An action nobody passed in is another module's: the toy box wires
    // its own button, game_toys.js.)
    if (act) b.addEventListener('click', () => { if (actions[act]) actions[act](); });
  });

  window.addEventListener('resize', () => { if (stickId < 0) rest(); });
  rest();
  return touch;
}
