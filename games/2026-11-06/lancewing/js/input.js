// Input: every device resolves to one control per rider { mx: steer -1..1, flap: held } plus edge events
// for menus and pause.
//   keyboard (solo): A/D or the arrows steer, W, Up, Space or K flap
//   keyboard split (local co-op): rider 1 = A/D + W or Space, rider 2 = arrows + Up, Enter or Numpad 0
//   gamepad: left stick or d-pad steers, A / X / RT / RB flap, START pauses. Two pads = one each.
//   touch: drag anywhere on the left half to steer (a floating slider), the big FLAP button on the right


const FLAP1 = ['KeyW', 'Space', 'KeyK'], FLAP2 = ['ArrowUp', 'Enter', 'Numpad0', 'NumpadEnter', 'ShiftRight'];
export class Input {
  constructor() {
    this.keys = new Set();
    this.stick = null;
    this.tFlap = false;
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [], tap: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.touchOn = false;
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.stick = null; this.tFlap = false; });
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
      if (!e.repeat) {
        this.emit('any', 'key');
        this.emit('key', k, e);
        if (typing) return;
        if (k === 'Escape' || k === 'KeyP') this.emit('pause', 'key');
      }
      this.keys.add(k);
    } else this.keys.delete(k);
  }
  onDown(e) {
    this.lastInputT = performance.now();
    this.emit('any', e.pointerType);
    // on-screen buttons that must answer on touch-down (a click can be swallowed right after a drag)
    const tb = e.target && e.target.closest && e.target.closest('[data-tap]');
    if (tb) { e.preventDefault(); this.lastKind = e.pointerType === 'mouse' ? this.lastKind : 'touch'; this.emit('tap', tb.dataset.tap); return; }
    const pad = e.target && e.target.closest && e.target.closest('[data-pad]');
    if (pad) { e.preventDefault(); this.lastKind = 'touch'; if (pad.dataset.pad === 'flap') { this.tFlap = true; pad.classList.add('on'); (this.ptr ||= new Map()).set(e.pointerId, pad); } return; }
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    if (onUI || e.pointerType === 'mouse' || !this.touchOn) return;
    e.preventDefault();
    this.lastKind = 'touch';
    if (e.clientX < innerWidth * 0.62 && !this.stick) { this.stick = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY }; this.stickUI && this.stickUI(this.stick); }
    else if (e.clientX >= innerWidth * 0.62) { this.tFlap = true; (this.ptr ||= new Map()).set(e.pointerId, null); }
  }
  onMove(e) {
    const s = this.stick;
    if (!s || s.id !== e.pointerId) return;
    e.preventDefault();
    s.x = e.clientX; s.y = e.clientY;
    const dx = s.x - s.sx, max = 56;
    if (Math.abs(dx) > max) s.sx = s.x - Math.sign(dx) * max;
    this.stickUI && this.stickUI(s);
    this.lastInputT = performance.now();
  }
  onUp(e) {
    if (this.ptr && this.ptr.has(e.pointerId)) { const pad = this.ptr.get(e.pointerId); this.tFlap = false; if (pad) pad.classList.remove('on'); this.ptr.delete(e.pointerId); return; }
    if (this.stick && this.stick.id === e.pointerId) { this.stick = null; this.stickUI && this.stickUI(null); }
  }
  pads() { return navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; }
  padCtl(g, out) {
    const b = (i) => g.buttons[i] && g.buttons[i].pressed;
    const lx = g.axes[0] || 0;
    if (Math.abs(lx) > 0.18) out.mx = Math.sign(lx) * Math.min(1, (Math.abs(lx) - 0.18) / 0.62);
    if (b(14)) out.mx = -1; if (b(15)) out.mx = 1;
    const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0;
    if (b(0) || b(2) || b(5) || rt > 0.3) out.flap = true;
  }
  // control for rider `pid` (1 or 2); coop splits the devices
  control(pid = 1, coop = false) {
    const K = this.keys, out = { mx: 0, flap: false };
    const pads = this.pads();
    if (!coop) {
      if (K.has('KeyA') || K.has('ArrowLeft')) out.mx -= 1;
      if (K.has('KeyD') || K.has('ArrowRight')) out.mx += 1;
      for (const k of FLAP1) if (K.has(k)) out.flap = true;
      if (K.has('ArrowUp')) out.flap = true;
      for (const g of pads) this.padCtl(g, out);
      const s = this.stick;
      if (s) { const dx = s.x - s.sx; if (Math.abs(dx) > 8) out.mx = Math.sign(dx) * Math.min(1, (Math.abs(dx) - 8) / 40); }
      if (this.tFlap) out.flap = true;
      return out;
    }
    if (pid === 1) {
      if (K.has('KeyA')) out.mx -= 1; if (K.has('KeyD')) out.mx += 1;
      for (const k of FLAP1) if (K.has(k)) out.flap = true;
      if (pads.length >= 2) this.padCtl(pads[0], out);
    } else {
      if (K.has('ArrowLeft')) out.mx -= 1; if (K.has('ArrowRight')) out.mx += 1;
      for (const k of FLAP2) if (K.has(k)) out.flap = true;
      if (pads.length === 1) this.padCtl(pads[0], out); else if (pads.length >= 2) this.padCtl(pads[1], out);
    }
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
      if (edge(9)) { this.emit('any', 'pad'); this.emit('pause', 'pad'); }
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
  rumble(strong, weak, ms, pad = -1) {
    this.pads().forEach((g, i) => {
      if (pad >= 0 && i !== pad) return;
      const act = g && g.vibrationActuator;
      if (act && act.playEffect) act.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }).catch(() => {});
    });
    if (this.lastKind === 'touch' && navigator.vibrate) { try { navigator.vibrate(Math.round(ms * 0.5)); } catch { /* not allowed */ } }
  }
}

