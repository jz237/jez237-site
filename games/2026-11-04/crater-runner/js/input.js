// Input: keyboard, gamepads and touch, all resolving to one rover control { th, jump, fire }
// (th = -1 slow down .. +1 speed up), plus edge events for menus and pause.
//   keyboard: SPACE / W / UP / Z jump (hold = higher), X / J / F / CTRL fire, A / LEFT slow, D / RIGHT fast, ESC / P pause
//   gamepad:  A jump, X / B / RB / RT fire, left stick or d-pad left/right speed, START pause
//   touch:    big JUMP and FIRE buttons on the right, SLOW / FAST on the left
const JUMP = ['Space', 'KeyW', 'ArrowUp', 'KeyZ'];
const FIRE = ['KeyX', 'KeyJ', 'KeyF', 'ControlLeft', 'ControlRight', 'KeyK'];
const SLOW = ['KeyA', 'ArrowLeft'];
const FAST = ['KeyD', 'ArrowRight'];

export class Input {
  constructor() {
    this.keys = new Set();
    this.touch = { jump: false, fire: false, slow: false, fast: false };
    this.mouse = { l: false, r: false };
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    this.lastKind = this.isTouch ? 'touch' : 'key';
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; for (const k in this.touch) this.touch[k] = false; });
    addEventListener('pointerdown', (e) => this.onDown(e), { passive: false });
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
      if (!e.repeat) {
        this.emit('any', 'key');
        this.emit('key', k, e);
        if (typing) return;
        if (k === 'Escape' || k === 'KeyP') this.emit('pause');
      }
      this.keys.add(k);
    } else this.keys.delete(k);
  }
  // touch buttons carry data-pad="jump|fire|slow|fast"
  onDown(e) {
    this.lastInputT = performance.now();
    const pad = e.target && e.target.closest && e.target.closest('[data-pad]');
    this.emit('any', e.pointerType);
    if (pad) {
      e.preventDefault();
      this.lastKind = 'touch';
      const k = pad.dataset.pad;
      this.touch[k] = true;
      pad.classList.add('on');
      (this.ptr ||= new Map()).set(e.pointerId, pad);
      try { pad.setPointerCapture(e.pointerId); } catch { /* old browsers */ }
      return;
    }
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    if (onUI) return;
    if (e.pointerType === 'mouse') {
      this.lastKind = 'key';
      if (e.button === 0) this.mouse.l = true;
      if (e.button === 2) this.mouse.r = true;
    }
  }
  onUp(e) {
    const pad = this.ptr && this.ptr.get(e.pointerId);
    if (pad) { this.touch[pad.dataset.pad] = false; pad.classList.remove('on'); this.ptr.delete(e.pointerId); return; }
    if (e.pointerType === 'mouse') { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; }
  }

  pads() { return navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; }

  control() {
    const K = this.keys, out = { th: 0, jump: false, fire: false };
    for (const k of JUMP) if (K.has(k)) out.jump = true;
    for (const k of FIRE) if (K.has(k)) out.fire = true;
    for (const k of SLOW) if (K.has(k)) out.th -= 1;
    for (const k of FAST) if (K.has(k)) out.th += 1;
    if (this.mouse.l) out.fire = true;
    if (this.mouse.r) out.jump = true;
    const T = this.touch;
    if (T.jump) out.jump = true;
    if (T.fire) out.fire = true;
    if (T.slow) out.th -= 1;
    if (T.fast) out.th += 1;
    for (const g of this.pads()) {
      const b = (i) => g.buttons[i] && g.buttons[i].pressed;
      if (b(0)) out.jump = true;
      if (b(2) || b(1) || b(5) || (g.buttons[7] && g.buttons[7].value > 0.3)) out.fire = true;
      const ax = g.axes[0] || 0;
      if (Math.abs(ax) > 0.25) out.th += Math.sign(ax) * Math.min(1, (Math.abs(ax) - 0.25) / 0.55);
      if (b(14)) out.th -= 1;
      if (b(15)) out.th += 1;
    }
    out.th = Math.max(-1, Math.min(1, out.th));
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
      for (let b = 0; b < 16; b++) prev[b] = pr(b);
      if (dir || g.buttons.some((x) => x.pressed)) { this.lastInputT = performance.now(); this.lastKind = 'pad'; }
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
