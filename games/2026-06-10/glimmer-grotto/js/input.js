// Unified input: keyboard + mouse-aim digging + touch (virtual joystick & buttons).

export const input = {
  left: false, right: false, up: false, down: false,
  jump: false, dig: false,
  aimActive: false, aimX: 0, aimY: 0,        // world coords (filled by pollInput)
  usingTouch: false,
  interactPressed: false,                     // edge-triggered, consume via consumeInteract()
};

const keys = {};
const touchState = { dig: false, jump: false };
const joyState = { dx: 0, dy: 0 };
let mouseHeld = false;
let pointerScreen = null;                     // {x,y} css px (mouse)
let touchAim = null;                          // {x,y} css px while finger held on canvas

export function initInput(cv, callbacks = {}) {
  addEventListener('keydown', e => {
    if (e.repeat) return;
    keys[e.code] = true;
    if (e.code === 'KeyE' || e.code === 'Enter') input.interactPressed = true;
    if (e.code === 'KeyJ') callbacks.journal?.();
    if (e.code === 'KeyM') callbacks.mute?.();
    if (e.code === 'Escape') callbacks.escape?.();
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  });
  addEventListener('keyup', e => { keys[e.code] = false; });

  // ---- mouse: hold LMB to dig toward cursor; touch: hold finger on a wall
  let touchAimId = null;
  cv.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') {
      markTouch();
      touchAimId = e.pointerId;
      touchAim = { x: e.clientX, y: e.clientY };
      return;
    }
    if (e.button === 0) mouseHeld = true;
    pointerScreen = { x: e.clientX, y: e.clientY };
  });
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') {
      if (e.pointerId === touchAimId && touchAim) touchAim = { x: e.clientX, y: e.clientY };
      return;
    }
    pointerScreen = { x: e.clientX, y: e.clientY };
  });
  const endTouchAim = e => {
    if (e.pointerId === touchAimId) { touchAimId = null; touchAim = null; }
  };
  addEventListener('pointerup', e => {
    if (e.pointerType === 'touch') { endTouchAim(e); return; }
    if (e.button === 0) mouseHeld = false;
  });
  addEventListener('pointercancel', endTouchAim);
  addEventListener('blur', () => { mouseHeld = false; for (const k in keys) keys[k] = false; });
  cv.addEventListener('contextmenu', e => e.preventDefault());

  // ---- touch joystick
  const joyZone = document.getElementById('joyZone');
  const joy = document.getElementById('joy');
  const thumb = joy.querySelector('.thumb');
  let joyId = null, joyCX = 0, joyCY = 0;

  joyZone.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    markTouch();
    joyId = e.pointerId;
    joyCX = e.clientX; joyCY = e.clientY;
    joy.style.display = 'block';
    joy.style.left = (joyCX - 64) + 'px';
    joy.style.top = (joyCY - 64) + 'px';
    joyZone.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  joyZone.addEventListener('pointermove', e => {
    if (e.pointerId !== joyId) return;
    const dx = e.clientX - joyCX, dy = e.clientY - joyCY;
    const len = Math.hypot(dx, dy);
    const m = Math.min(len, 46);
    const nx = len ? dx / len : 0, ny = len ? dy / len : 0;
    thumb.style.transform = `translate(${nx * m}px,${ny * m}px)`;
    joyState.dx = len > 12 ? nx * Math.min(1, len / 42) : 0;
    joyState.dy = len > 12 ? ny * Math.min(1, len / 42) : 0;
  });
  const joyEnd = e => {
    if (e.pointerId !== joyId) return;
    joyId = null;
    joyState.dx = 0; joyState.dy = 0;
    thumb.style.transform = '';
    joy.style.display = 'none';
  };
  joyZone.addEventListener('pointerup', joyEnd);
  joyZone.addEventListener('pointercancel', joyEnd);

  bindTouchBtn('btnDig', v => { touchState.dig = v; });
  bindTouchBtn('btnJump', v => { touchState.jump = v; });

  // the contextual prompt pill doubles as the interact button on touch
  const hint = document.getElementById('restHint');
  hint.addEventListener('pointerdown', e => {
    input.interactPressed = true;
    e.preventDefault(); e.stopPropagation();
  });

  addEventListener('touchstart', markTouch, { passive: true });
}

function markTouch() {
  if (!input.usingTouch) {
    input.usingTouch = true;
    document.getElementById('touchUI').classList.remove('hidden');
  }
}

function bindTouchBtn(id, set) {
  const el = document.getElementById(id);
  el.addEventListener('pointerdown', e => {
    markTouch(); set(true);
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.addEventListener('pointerup', () => set(false));
  el.addEventListener('pointercancel', () => set(false));
}

/** Per-frame poll. screenToWorld converts css px -> world coords. */
export function pollInput(screenToWorld) {
  input.left = !!(keys.KeyA || keys.ArrowLeft) || joyState.dx < -0.22;
  input.right = !!(keys.KeyD || keys.ArrowRight) || joyState.dx > 0.22;
  input.up = !!(keys.KeyW || keys.ArrowUp) || joyState.dy < -0.42;
  input.down = !!(keys.KeyS || keys.ArrowDown) || joyState.dy > 0.42;
  input.jump = !!(keys.Space || keys.KeyW || keys.ArrowUp) || touchState.jump;

  const mouseAiming = mouseHeld && pointerScreen && !input.usingTouch;
  const touchAiming = !!touchAim;
  input.aimActive = mouseAiming || touchAiming;
  if (input.aimActive) {
    const p = touchAiming ? touchAim : pointerScreen;
    const w = screenToWorld(p.x, p.y);
    input.aimX = w.x; input.aimY = w.y;
  }
  input.dig = !!(keys.KeyX || keys.KeyJ) || touchState.dig || mouseAiming || touchAiming;
}

export function consumeInteract() {
  const v = input.interactPressed;
  input.interactPressed = false;
  return v;
}

export function getPointerScreen() {
  return input.usingTouch ? null : pointerScreen;
}
