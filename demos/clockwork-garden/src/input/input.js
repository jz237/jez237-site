// Unified input for the interactive modes: keyboard, mouse (pointer lock to
// steer, or drag), wheel, touch (virtual joystick, up/down/boost buttons,
// drag-to-look, pinch) and gamepads. Produces one intent per frame.
//
//   move.x  sideways (-1 left … 1 right; turns instead while flying)   move.y  forward (1) / back (-1)
//   lift    climb (1) / descend (-1)         turn    keyboard yaw (-1 … 1)
//   boost   0/1                               look    { dx, dy } radians this frame
//   orbit   { dx, dy } px drag (follow / photo)  zoom   wheel/pinch factor (>1 = closer)
//   actions one-shot: help, sound, photo, swap, timeUp, timeDown, timeCycle, save, menu, escape

const KEYS = {
  forward: ['KeyW', 'ArrowUp'], back: ['KeyS', 'ArrowDown'], left: ['KeyA'], right: ['KeyD'],
  turnLeft: ['ArrowLeft'], turnRight: ['ArrowRight'],
  up: ['Space', 'KeyE'], down: ['ShiftLeft', 'ShiftRight', 'KeyQ'], boost: ['KeyF'],
};

export class Input {
  constructor(canvas, { touch = false } = {}) {
    this.canvas = canvas;
    this.enabled = false;
    this.mode = 'fly';
    this.keys = new Set();
    this.look = { dx: 0, dy: 0 };
    this.orbit = { dx: 0, dy: 0 };
    this.zoom = 1;
    this.actions = [];
    this.mouseBoost = false;
    this.dragging = false;
    this.locked = false;
    this.touchMove = { x: 0, y: 0 };
    this.touchLift = 0;
    this.touchBoost = false;
    this.lastUsed = 'keyboard';
    this.sensitivity = 0.0024;
    this.touch = touch;
    this._bind();
    if (touch) this._buildTouch();
  }

  setMode(mode) {
    this.mode = mode;
    document.body.dataset.input = this.touch ? 'touch' : 'desktop';
    if (mode !== 'fly' && this.locked) document.exitPointerLock?.();
    this.touchUI?.classList.toggle('show', this.enabled && (mode === 'fly' || mode === 'photo'));
  }

  enable(on) {
    this.enabled = on;
    if (!on) {
      this.keys.clear();
      if (this.locked) document.exitPointerLock?.();
    }
    this.touchUI?.classList.toggle('show', on && (this.mode === 'fly' || this.mode === 'photo'));
  }

  requestLock() {
    if (this.touch || !this.canvas.requestPointerLock) return;
    try {
      const p = this.canvas.requestPointerLock({ unadjustedMovement: true });
      if (p && p.catch) p.catch(() => { try { this.canvas.requestPointerLock(); } catch (e) { /* unavailable */ } });
    } catch (e) { /* unavailable */ }
  }

  _bind() {
    const isTyping = (e) => e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
    window.addEventListener('keydown', (e) => {
      if (!this.enabled || isTyping(e)) return;
      this.lastUsed = 'keyboard';
      const c = e.code;
      if (Object.values(KEYS).some((l) => l.includes(c))) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(c);
      const k = e.key.toLowerCase();
      const act = { h: 'help', m: 'sound', p: 'photo', c: 'swap', t: 'timeCycle', ']': 'timeUp', '[': 'timeDown', enter: 'save', escape: 'escape', g: 'menu' }[k];
      if (act) { this.actions.push(act); if (act !== 'escape') e.preventDefault(); }
      if (k === 'tab') { e.preventDefault(); this.actions.push('swap'); }
    });
    window.addEventListener('keyup', (e) => { this.keys.delete(e.code); });
    window.addEventListener('blur', () => { this.keys.clear(); this.mouseBoost = false; this.touchLift = 0; this.touchBoost = false; this.touchMove.x = this.touchMove.y = 0; });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      document.body.classList.toggle('locked', this.locked);
      if (!this.locked) this.mouseBoost = false;
    });
    const c = this.canvas;
    c.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      this.lastUsed = 'mouse';
      if (this.mode === 'fly' && !this.touch) {
        if (!this.locked) this.requestLock();
        else if (e.button === 0) this.mouseBoost = true;
      }
      if (!this.locked) { this.dragging = true; this._lastX = e.clientX; this._lastY = e.clientY; }
    });
    window.addEventListener('mouseup', (e) => { if (e.button === 0) this.mouseBoost = false; this.dragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      if (this.locked) {
        // ignore the occasional huge jump some browsers report on lock
        const dx = Math.abs(e.movementX) > 300 ? 0 : e.movementX, dy = Math.abs(e.movementY) > 300 ? 0 : e.movementY;
        this.look.dx += dx * this.sensitivity;
        this.look.dy += dy * this.sensitivity;
      } else if (this.dragging) {
        const dx = e.clientX - this._lastX, dy = e.clientY - this._lastY;
        this._lastX = e.clientX; this._lastY = e.clientY;
        if (this.mode === 'fly') { this.look.dx += dx * this.sensitivity * 1.4; this.look.dy += dy * this.sensitivity * 1.4; }
        else { this.orbit.dx += dx; this.orbit.dy += dy; }
      }
    });
    c.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.zoom *= Math.exp(-e.deltaY * 0.0012);
    }, { passive: false });
    c.addEventListener('contextmenu', (e) => { if (this.enabled) e.preventDefault(); });

    // touch on the canvas: one finger drags the view, two fingers pinch
    const touches = new Map();
    c.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      this.lastUsed = 'touch';
      for (const t of e.changedTouches) touches.set(t.identifier, { x: t.clientX, y: t.clientY });
      if (touches.size === 2) this._pinch = this._pinchDist(touches);
    }, { passive: true });
    c.addEventListener('touchmove', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      for (const t of e.changedTouches) {
        const p = touches.get(t.identifier);
        if (!p) continue;
        const dx = t.clientX - p.x, dy = t.clientY - p.y;
        p.x = t.clientX; p.y = t.clientY;
        if (touches.size === 1) {
          if (this.mode === 'fly') { this.look.dx += dx * 0.0055; this.look.dy += dy * 0.0055; }
          else { this.orbit.dx += dx; this.orbit.dy += dy; }
        }
      }
      if (touches.size === 2 && this._pinch) {
        const d = this._pinchDist(touches);
        this.zoom *= d / this._pinch;
        this._pinch = d;
      }
    }, { passive: false });
    const end = (e) => { for (const t of e.changedTouches) touches.delete(t.identifier); if (touches.size < 2) this._pinch = null; };
    c.addEventListener('touchend', end);
    c.addEventListener('touchcancel', end);
  }

  _pinchDist(map) {
    const [a, b] = [...map.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  }

  // on-screen joystick (left) and up / down / boost buttons (right)
  _buildTouch() {
    const ui = document.createElement('div');
    ui.id = 'touch';
    ui.innerHTML = `
      <div class="stick" aria-label="Move"><div class="ring"></div><div class="nub"></div></div>
      <div class="pad">
        <button class="tb" data-b="up" aria-label="Climb"><svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button class="tb boost" data-b="boost" aria-label="Boost"><svg viewBox="0 0 24 24"><path d="M5 7l6 5-6 5M12 7l6 5-6 5" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
        <button class="tb" data-b="down" aria-label="Descend"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
      </div>`;
    document.body.appendChild(ui);
    this.touchUI = ui;
    const stick = ui.querySelector('.stick'), nub = ui.querySelector('.nub');
    let sid = null, cx = 0, cy = 0;
    const R = 46;
    const setNub = (x, y) => { nub.style.transform = `translate(${x}px, ${y}px)`; };
    stick.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      sid = t.identifier;
      const r = stick.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      move(t);
    }, { passive: false });
    const move = (t) => {
      let dx = t.clientX - cx, dy = t.clientY - cy;
      const l = Math.hypot(dx, dy);
      if (l > R) { dx *= R / l; dy *= R / l; }
      setNub(dx, dy);
      // a small dead zone, then a gentle curve for fine control
      const k = (v) => { const a = Math.abs(v / R); return Math.sign(v) * (a < 0.12 ? 0 : Math.pow((a - 0.12) / 0.88, 1.3)); };
      this.touchMove.x = k(dx);
      this.touchMove.y = -k(dy);
    };
    stick.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === sid) move(t);
    }, { passive: false });
    const release = (e) => {
      for (const t of e.changedTouches) if (t.identifier === sid) { sid = null; setNub(0, 0); this.touchMove.x = this.touchMove.y = 0; }
    };
    stick.addEventListener('touchend', release);
    stick.addEventListener('touchcancel', release);
    for (const b of ui.querySelectorAll('.tb')) {
      const kind = b.dataset.b;
      const on = (e) => { e.preventDefault(); b.classList.add('on'); if (kind === 'boost') this.touchBoost = true; else this.touchLift = kind === 'up' ? 1 : -1; };
      const off = (e) => { e.preventDefault(); b.classList.remove('on'); if (kind === 'boost') this.touchBoost = false; else this.touchLift = 0; };
      b.addEventListener('touchstart', on, { passive: false });
      b.addEventListener('touchend', off, { passive: false });
      b.addEventListener('touchcancel', off, { passive: false });
      b.addEventListener('mousedown', on);
      b.addEventListener('mouseup', off);
      b.addEventListener('mouseleave', off);
    }
  }

  _gamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp || !gp.connected) continue;
      const dz = (v) => (Math.abs(v) < 0.15 ? 0 : (v - Math.sign(v) * 0.15) / 0.85);
      const ax = gp.axes;
      const b = (i) => gp.buttons[i]?.pressed || (gp.buttons[i]?.value || 0) > 0.4;
      const val = (i) => gp.buttons[i]?.value || 0;
      const g = {
        mx: dz(ax[0] || 0), my: -dz(ax[1] || 0), lx: dz(ax[2] || 0), ly: dz(ax[3] || 0),
        lift: (b(0) ? 1 : 0) - (b(1) ? 1 : 0) - val(6),
        boost: b(5) || val(7) > 0.4,
      };
      const prev = this._gpPrev || {};
      const edge = (i, act) => { if (b(i) && !prev[i]) this.actions.push(act); };
      edge(3, 'swap'); edge(9, 'help'); edge(8, 'menu'); edge(2, 'photo');
      this._gpPrev = Object.fromEntries(gp.buttons.map((x, i) => [i, b(i)]));
      if (g.mx || g.my || g.lx || g.ly || g.lift || g.boost) this.lastUsed = 'gamepad';
      return g;
    }
    return null;
  }

  // read and reset this frame's input
  frame(dt) {
    const k = (names) => KEYS[names].some((c) => this.keys.has(c));
    const gp = this._gamepad();
    const move = {
      x: (k('right') ? 1 : 0) - (k('left') ? 1 : 0) + this.touchMove.x + (gp?.mx || 0),
      y: (k('forward') ? 1 : 0) - (k('back') ? 1 : 0) + this.touchMove.y + (gp?.my || 0),
    };
    const c1 = (v) => Math.max(-1, Math.min(1, v));
    let turn = (k('turnRight') ? 1 : 0) - (k('turnLeft') ? 1 : 0);
    // flying: left / right (A D, the joystick, the left stick) turns the bee
    // and the camera with it, so the view always faces the way you're going.
    // Photo mode keeps them as a sideways dolly.
    if (this.mode === 'fly') {
      turn = c1(turn + move.x);
      move.x = 0;
      move.y = c1(move.y);
    }
    const l = Math.hypot(move.x, move.y) + Math.abs(turn);
    const n = Math.hypot(move.x, move.y);
    if (n > 1) { move.x /= n; move.y /= n; }
    const lift = c1((k('up') ? 1 : 0) - (k('down') ? 1 : 0) + this.touchLift + (gp?.lift || 0));
    const look = { dx: this.look.dx + (gp ? gp.lx * 2.6 * dt : 0) + turn * 1.9 * dt, dy: this.look.dy + (gp ? gp.ly * 1.8 * dt : 0) };
    const out = {
      move, lift, turn, look,
      boost: k('boost') || this.mouseBoost || this.touchBoost || !!gp?.boost,
      orbit: { ...this.orbit },
      zoom: this.zoom,
      actions: this.actions.splice(0),
      gamepad: !!gp,
      // any steering input at all this frame (used to hand control back)
      active: l > 0.05 || Math.abs(lift) > 0.05 || Math.abs(look.dx) + Math.abs(look.dy) > 1e-4,
    };
    if (gp && this.mode !== 'fly') { out.orbit.dx += gp.lx * 380 * dt; out.orbit.dy += gp.ly * 260 * dt; }
    this.look.dx = this.look.dy = 0;
    this.orbit.dx = this.orbit.dy = 0;
    this.zoom = 1;
    return out;
  }
}
