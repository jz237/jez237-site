// Input: everything resolves to one Rimrunner control
//   { mx (-1..1: hold a direction / analog stick), dx (lanes: a spinner, from mouse or touch drags), fire, purge, hop }
// plus edge events for menus and pause.
//   keyboard: A D / arrow keys move lane to lane (tap = one lane, hold = keep going), SPACE / Z / J fire,
//             X / K / SHIFT purge, W / UP / C / L hop, ESC / P pause
//   mouse:    move left and right to spin along the rim (click the game to lock the pointer), left button
//             fires, right button purges, middle button hops
//   gamepad:  left stick or d-pad (analog: fine control), A / RT fire, B / LB purge, X / Y / RB hop, START pause
//   touch:    drag anywhere on the left two thirds to slide along the rim (it fires while your thumb is
//             down), PURGE and HOP buttons on the right; works in portrait and landscape
// Lane + 1 is "to the right" on screen: the camera keeps your lane at the bottom.
const FIRE = ['Space', 'KeyZ', 'KeyJ', 'ControlLeft', 'ControlRight'];
const PURGE = ['KeyX', 'KeyK', 'ShiftLeft', 'ShiftRight'];
const HOP = ['KeyW', 'ArrowUp', 'KeyC', 'KeyL'];
const LEFT = ['KeyA', 'ArrowLeft'], RIGHT = ['KeyD', 'ArrowRight'];
// a tap (press and release between two sim steps) is latched until a step has used it, but only for a moment:
// a press in a menu or the pause screen never fires off a PURGE when play goes on
const TAP_LIFE = 250;
export const PX_PER_LANE = { mouse: 46, touch: 54 };

export class Input {
  constructor() {
    this.keys = new Set();
    this.mouse = { l: false, r: false, m: false, dx: 0, locked: false };
    this.touch = { id: null, x: 0, dx: 0, fire: false };
    this.tPurge = false; this.tHop = false;
    this.tap = { mx: 0, fire: false, purge: false, hop: false, t: -1e9 };
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [], unlock: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.touchOn = false; this.playing = false;
    this.sens = 1;
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = this.mouse.m = false; this.touch.id = null; this.touch.fire = false; this.tPurge = this.tHop = false; });
    addEventListener('pointerdown', (e) => this.onDown(e), { passive: false });
    addEventListener('pointermove', (e) => this.onMove(e), { passive: false });
    addEventListener('pointerup', (e) => this.onUp(e));
    addEventListener('pointercancel', (e) => this.onUp(e));
    addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => { const was = this.mouse.locked; this.mouse.locked = !!document.pointerLockElement; if (was && !this.mouse.locked) this.emit('unlock'); });
  }
  on(kind, fn) { this.handlers[kind].push(fn); }
  // a handler returning true has used the event (the 'key' handler uses this to keep a typed P from pausing)
  emit(kind, ...a) { let used = false; for (const f of this.handlers[kind]) if (f(...a) === true) used = true; return used; }
  latch(what, v = true) { if (!this.playing) return; const T = this.tap; if (performance.now() - T.t > TAP_LIFE) { T.mx = 0; T.fire = T.purge = T.hop = false; } T[what] = v; T.t = performance.now(); }

  onKey(e, down) {
    const k = e.code;
    const typing = e.target && e.target.tagName === 'INPUT';
    if (!typing && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(k)) e.preventDefault();
    if (down) {
      this.lastKind = 'key';
      if (!e.repeat) {
        this.emit('any', 'key');
        const used = this.emit('key', k, e);
        if (typing) return;
        if (!used && (k === 'Escape' || k === 'KeyP')) this.emit('pause');
        if (LEFT.includes(k)) this.latch('mx', -1); else if (RIGHT.includes(k)) this.latch('mx', 1);
        if (FIRE.includes(k)) this.latch('fire'); if (PURGE.includes(k)) this.latch('purge'); if (HOP.includes(k)) this.latch('hop');
      }
      this.keys.add(k);
    } else this.keys.delete(k);
  }
  onDown(e) {
    this.emit('any', e.pointerType);
    const pad = e.target && e.target.closest && e.target.closest('[data-pad]');
    if (pad) { e.preventDefault(); this.lastKind = 'touch'; const k = pad.dataset.pad; if (k === 'purge') { this.tPurge = true; this.latch('purge'); } if (k === 'hop') { this.tHop = true; this.latch('hop'); } pad.classList.add('on'); (this.ptr ||= new Map()).set(e.pointerId, pad); return; }
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    if (onUI) return;
    if (e.pointerType === 'mouse') {
      this.lastKind = 'key';
      if (e.button === 0) { this.mouse.l = true; this.latch('fire'); }
      if (e.button === 2) { this.mouse.r = true; this.latch('purge'); }
      if (e.button === 1) { this.mouse.m = true; this.latch('hop'); e.preventDefault(); }
      // lock the pointer in play so the mouse works like a spinner
      if (this.playing && !this.mouse.locked && e.target && e.target.tagName === 'CANVAS' && document.body.requestPointerLock) { try { const p = document.body.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed */ } }
      return;
    }
    if (!this.touchOn) return;
    e.preventDefault();
    this.lastKind = 'touch';
    if (this.touch.id === null && e.clientX < innerWidth * 0.68) { this.touch.id = e.pointerId; this.touch.x = e.clientX; this.touch.fire = true; this.latch('fire'); this.touchUI && this.touchUI(e.clientX, e.clientY, true); }
  }
  onMove(e) {
    if (e.pointerType === 'mouse') {
      const mx = e.movementX || 0;
      if (this.playing && (this.mouse.locked || Math.abs(mx) < 200)) this.mouse.dx += mx;
      return;
    }
    if (this.touch.id === e.pointerId) {
      e.preventDefault();
      this.touch.dx += e.clientX - this.touch.x; this.touch.x = e.clientX;
      this.touchUI && this.touchUI(e.clientX, e.clientY, true);
    }
  }
  onUp(e) {
    const pad = this.ptr && this.ptr.get(e.pointerId);
    if (pad) { const k = pad.dataset.pad; if (k === 'purge') this.tPurge = false; if (k === 'hop') this.tHop = false; pad.classList.remove('on'); this.ptr.delete(e.pointerId); return; }
    if (e.pointerType === 'mouse') { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; if (e.button === 1) this.mouse.m = false; return; }
    if (this.touch.id === e.pointerId) { this.touch.id = null; this.touch.fire = false; this.touchUI && this.touchUI(0, 0, false); }
  }
  releaseLock() { if (document.pointerLockElement && document.exitPointerLock) document.exitPointerLock(); }
  pads() { return navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; }

  // the control for the local Rimrunner (call once per sim tick: dx is used up)
  control() {
    const K = this.keys, out = { mx: 0, dx: 0, fire: false, purge: false, hop: false };
    if (K.has('KeyA') || K.has('ArrowLeft')) out.mx -= 1;
    if (K.has('KeyD') || K.has('ArrowRight')) out.mx += 1;
    for (const k of FIRE) if (K.has(k)) out.fire = true;
    for (const k of PURGE) if (K.has(k)) out.purge = true;
    for (const k of HOP) if (K.has(k)) out.hop = true;
    if (this.mouse.l) out.fire = true;
    if (this.mouse.r) out.purge = true;
    if (this.mouse.m) out.hop = true;
    if (this.mouse.dx) { out.dx += (this.mouse.dx / PX_PER_LANE.mouse) * this.sens; this.mouse.dx = 0; }
    for (const g of this.pads()) {
      const b = (i) => g.buttons[i] && g.buttons[i].pressed;
      const lx = g.axes[0] || 0;
      if (Math.abs(lx) > 0.22) out.mx = Math.sign(lx) * Math.min(1, (Math.abs(lx) - 0.22) / 0.6 + 0.2);
      if (b(14)) out.mx = -1; if (b(15)) out.mx = 1;
      const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0;
      if (b(0) || rt > 0.3) out.fire = true;
      if (b(1) || b(4) || b(6)) out.purge = true;
      if (b(2) || b(3) || b(5)) out.hop = true;
    }
    if (this.touch.id !== null || this.touch.dx) {
      if (this.touch.dx) { out.dx += (this.touch.dx / PX_PER_LANE.touch) * this.sens; this.touch.dx = 0; }
      if (this.touch.fire) out.fire = true;
    }
    if (this.tPurge) out.purge = true;
    if (this.tHop) out.hop = true;
    // taps that came and went since the last step
    const T = this.tap;
    if (T.t > 0 && performance.now() - T.t <= TAP_LIFE) {
      if (T.mx && !out.mx) out.mx = T.mx;
      if (T.fire) out.fire = true; if (T.purge) out.purge = true; if (T.hop) out.hop = true;
    }
    T.mx = 0; T.fire = T.purge = T.hop = false; T.t = -1e9;
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
      if (g.axes.some((x) => Math.abs(x) > 0.3) || g.buttons.some((x) => x.pressed)) this.lastKind = 'pad';
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
