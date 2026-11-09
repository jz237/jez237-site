// Input: one Warden control on every device
//   { mx (-1..1: fly left / right; the ship faces the way you push), my (-1..1: dive / climb), fire, nova, blink, src }
// plus edge events for menus and pause.
//   keyboard: A / D or LEFT / RIGHT fly, W / S or UP / DOWN climb and dive, SPACE / J fire, SHIFT / K nova,
//             H / L blink; the left mouse button also fires and the right one lets off a nova
//   gamepad:  left stick / d-pad flies, A or RT fires, B or LT nova, Y / X / bumpers blink, START pauses
//   touch:    left thumb = floating stick (left / right fly, up / down climb), FIRE, NOVA and BLINK buttons
const FIRE = ['Space', 'KeyJ', 'ControlLeft', 'ControlRight'];
const NOVA = ['ShiftLeft', 'ShiftRight', 'KeyK', 'KeyB', 'Enter'];
const BLINK = ['KeyH', 'KeyL', 'KeyE'];

export class Input {
  constructor() {
    this.keys = new Set();
    this.mouse = { on: false, x: 0, y: 0, t: -1e9, l: false, r: false };
    this.kbT = -1e9;
    this.stick = null;
    this.tFire = false; this.tNova = false; this.tBlink = false;
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.ptr = new Map();
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; this.stick = null; this.tFire = this.tNova = this.tBlink = false; });
    addEventListener('pointerdown', (e) => this.onDown(e), { passive: false });
    addEventListener('pointermove', (e) => this.onMove(e), { passive: false });
    addEventListener('pointerup', (e) => this.onUp(e));
    addEventListener('pointercancel', (e) => this.onUp(e));
    addEventListener('contextmenu', (e) => e.preventDefault());
  }
  on(kind, fn) { this.handlers[kind].push(fn); }
  emit(kind, ...a) { for (const f of this.handlers[kind]) f(...a); }

  onKey(e, down) {
    const k = e.code;
    const typing = e.target && e.target.tagName === 'INPUT';
    if (!typing && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(k)) e.preventDefault();
    if (down) {
      this.lastInputT = performance.now(); this.lastKind = 'key';
      if (/^(Arrow|Key[WASD]$)/.test(k)) this.kbT = performance.now();
      if (!e.repeat) {
        this.emit('any', 'key');
        this.emit('key', k, e);
        if (typing) return;
        if (k === 'Escape' || k === 'KeyP') this.emit('pause');
      }
      this.keys.add(k);
    } else this.keys.delete(k);
  }
  onDown(e) {
    this.lastInputT = performance.now();
    this.emit('any', e.pointerType);
    const pad = e.target && e.target.closest && e.target.closest('[data-pad]');
    if (pad) {
      e.preventDefault(); this.lastKind = 'touch';
      if (pad.dataset.pad === 'fire') this.tFire = true; else if (pad.dataset.pad === 'nova') this.tNova = true; else this.tBlink = true;
      pad.classList.add('on'); this.ptr.set(e.pointerId, pad);
      return;
    }
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    if (onUI) return;
    if (e.pointerType === 'mouse') {
      this.lastKind = 'key';
      this.mouse.on = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.mouse.t = performance.now();
      if (e.button === 0) this.mouse.l = true;
      if (e.button === 2) this.mouse.r = true;
      return;
    }
    if (!this.touchOn) return;
    e.preventDefault();
    this.lastKind = 'touch';
    // the left part of the screen is the steering stick; a touch on the right that misses the buttons fires
    if (e.clientX < innerWidth * 0.55) {
      if (this.stick) return;
      this.stick = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY };
      this.stickUI && this.stickUI(this.stick);
    } else { this.tFire = true; this.ptr.set(e.pointerId, null); }
  }
  onMove(e) {
    if (e.pointerType === 'mouse') {
      if (Math.abs(e.clientX - this.mouse.x) + Math.abs(e.clientY - this.mouse.y) > 2) this.mouse.t = performance.now();
      this.mouse.on = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY;
      return;
    }
    const s = this.stick;
    if (!s || s.id !== e.pointerId) return;
    e.preventDefault();
    s.x = e.clientX; s.y = e.clientY;
    // a floating stick: the centre follows when you drag far
    const dx = s.x - s.sx, dy = s.y - s.sy, l = Math.hypot(dx, dy), max = 64;
    if (l > max) { s.sx = s.x - (dx / l) * max; s.sy = s.y - (dy / l) * max; }
    this.stickUI && this.stickUI(s);
    this.lastInputT = performance.now();
  }
  onUp(e) {
    if (this.ptr.has(e.pointerId)) {
      const pad = this.ptr.get(e.pointerId);
      if (!pad || pad.dataset.pad === 'fire') this.tFire = false; else if (pad.dataset.pad === 'nova') this.tNova = false; else this.tBlink = false;
      if (pad) pad.classList.remove('on');
      this.ptr.delete(e.pointerId);
      return;
    }
    if (e.pointerType === 'mouse') { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; return; }
    if (this.stick && this.stick.id === e.pointerId) { this.stick = null; this.stickUI && this.stickUI(null); }
  }

  pads() { return navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; }

  // the control for the local ship
  control() {
    const K = this.keys, out = { mx: 0, my: 0, fire: false, nova: false, blink: false, src: 'none' };
    let sx = 0, sy = 0;
    if (K.has('KeyA') || K.has('ArrowLeft')) sx--; if (K.has('KeyD') || K.has('ArrowRight')) sx++;
    if (K.has('KeyW') || K.has('ArrowUp')) sy++; if (K.has('KeyS') || K.has('ArrowDown')) sy--;
    for (const k of FIRE) if (K.has(k)) out.fire = true;
    for (const k of NOVA) if (K.has(k)) out.nova = true;
    for (const k of BLINK) if (K.has(k)) out.blink = true;
    if (sx || sy) { out.mx = sx; out.my = sy; out.src = 'key'; }
    if (this.mouse.l) out.fire = true;
    if (this.mouse.r) out.nova = true;
    for (const g of this.pads()) {
      const b = (i) => g.buttons[i] && g.buttons[i].pressed;
      const lx = g.axes[0] || 0, ly = g.axes[1] || 0;
      const dz = (v) => (Math.abs(v) < 0.18 ? 0 : Math.sign(v) * Math.min(1, (Math.abs(v) - 0.18) / 0.7));
      if (Math.abs(lx) > 0.18 || Math.abs(ly) > 0.18) { out.mx = dz(lx); out.my = -dz(ly); out.src = 'pad'; }
      if (b(12)) out.my = 1; if (b(13)) out.my = -1; if (b(14)) out.mx = -1; if (b(15)) out.mx = 1;
      const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0, lt = g.buttons[6] ? g.buttons[6].value || 0 : 0;
      if (b(0) || rt > 0.3) out.fire = true;
      if (b(1) || lt > 0.3) out.nova = true;
      if (b(3) || b(2) || b(4) || b(5)) out.blink = true;
    }
    const s = this.stick;
    if (s) {
      const dx = s.x - s.sx, dy = s.y - s.sy;
      // a wide dead zone on the vertical so flying flat is easy; full deflection at 46 px
      const f = (v, dzp) => (Math.abs(v) < dzp ? 0 : Math.sign(v) * Math.min(1, (Math.abs(v) - dzp) / 40));
      out.mx = f(dx, 7); out.my = -f(dy, 9); out.src = 'touch';
    }
    if (this.tFire) out.fire = true;
    if (this.tNova) out.nova = true;
    if (this.tBlink) out.blink = true;
    return out;
  }

  // edges on gamepad buttons for menus
  pollPads() {
    this.pads().forEach((g, i) => {
      const prev = this.padPrev[i] || (this.padPrev[i] = {});
      const pr = (b) => g.buttons[b] && g.buttons[b].pressed;
      const edge = (b) => pr(b) && !prev[b];
      if (edge(0)) { this.emit('any', 'pad'); this.emit('confirm'); }
      if (edge(1)) { this.emit('any', 'pad'); this.emit('back'); }
      if (edge(9)) { this.emit('any', 'pad'); this.emit('pause'); }
      const ay = g.axes[1] || 0, ax = g.axes[0] || 0;
      const dir = Math.abs(ay) > 0.6 ? (ay > 0 ? 'ArrowDown' : 'ArrowUp') : Math.abs(ax) > 0.6 ? (ax > 0 ? 'ArrowRight' : 'ArrowLeft') : null;
      if (dir && dir !== prev.dir) { this.emit('any', 'pad'); this.emit('key', dir, null); }
      prev.dir = dir;
      for (const b of [12, 13, 14, 15]) if (edge(b)) { this.emit('any', 'pad'); this.emit('key', ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'][b - 12], null); }
      for (let b = 0; b < 17; b++) prev[b] = pr(b);
      const moved = g.axes.some((x) => Math.abs(x) > 0.3);
      if (moved || g.buttons.some((x) => x.pressed)) { this.lastInputT = performance.now(); this.lastKind = 'pad'; }
    });
  }
  rumble(strong, weak, ms) {
    for (const g of this.pads()) {
      const act = g && g.vibrationActuator;
      if (act && act.playEffect) act.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }).catch(() => {});
    }
    if (this.lastKind === 'touch' && navigator.vibrate) { try { navigator.vibrate(Math.round(ms * 0.5)); } catch { /* not allowed */ } }
  }
}
