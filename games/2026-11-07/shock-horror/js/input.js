// Input: every device resolves to one control { mx, my (-1..1), jump, pick, dyn, flare (held) } plus edge events
// for menus, the map and pause.
//   keyboard: A/D or ← → move, W/S or ↑ ↓ climb and aim, SPACE (or K, Z) jump, J (or X) pick, L (or C) dynamite,
//             F (or V) flare, M or TAB map, ESC or P pause
//   gamepad:  left stick / d-pad move, climb and aim; A jump; X or RB pick; B or RT dynamite; Y or LB flare;
//             BACK/VIEW map; START pause
//   touch:    a floating stick on the left (move, climb, aim) and four buttons on the right
const JUMP = ['Space', 'KeyK', 'KeyZ'], PICK = ['KeyJ', 'KeyX', 'ControlLeft'], DYN = ['KeyL', 'KeyC'], FLARE = ['KeyF', 'KeyV'];
export class Input {
  constructor() {
    this.keys = new Set();
    this.taps = new Set();        // keys/buttons pressed since the last control() read: a quick tap is never lost
    this.stick = null;
    this.tb = { jump: false, pick: false, dyn: false, flare: false };
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [], tap: [], map: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.touchOn = false;
    this.ptr = new Map();
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.stick = null; for (const k in this.tb) this.tb[k] = false; });
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
    if (!typing && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(k)) e.preventDefault();
    if (down) {
      this.lastInputT = performance.now(); this.lastKind = 'key';
      if (!e.repeat) {
        this.emit('any', 'key');
        this.emit('key', k, e);
        if (typing) return;
        if (k === 'Escape' || k === 'KeyP') this.emit('pause', 'key');
        if (k === 'KeyM' || k === 'Tab') this.emit('map');
      }
      this.keys.add(k); this.taps.add(k);
    } else this.keys.delete(k);
  }
  onDown(e) {
    this.lastInputT = performance.now();
    this.emit('any', e.pointerType);
    const tb = e.target && e.target.closest && e.target.closest('[data-tap]');
    if (tb) { e.preventDefault(); this.lastKind = e.pointerType === 'mouse' ? this.lastKind : 'touch'; this.emit('tap', tb.dataset.tap); return; }
    const pad = e.target && e.target.closest && e.target.closest('[data-pad]');
    if (pad) { e.preventDefault(); this.lastKind = 'touch'; this.tb[pad.dataset.pad] = true; this.taps.add('tb:' + pad.dataset.pad); pad.classList.add('on'); this.ptr.set(e.pointerId, pad); return; }
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    if (onUI || e.pointerType === 'mouse' || !this.touchOn) return;
    e.preventDefault();
    this.lastKind = 'touch';
    if (e.clientX < innerWidth * 0.55 && !this.stick) { this.stick = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY }; this.stickUI && this.stickUI(this.stick); }
    else if (e.clientX >= innerWidth * 0.55) { this.tb.jump = true; this.taps.add('tb:jump'); this.ptr.set(e.pointerId, null); }
  }
  onMove(e) {
    const s = this.stick;
    if (!s || s.id !== e.pointerId) return;
    e.preventDefault();
    s.x = e.clientX; s.y = e.clientY;
    const dx = s.x - s.sx, dy = s.y - s.sy, max = 60, l = Math.hypot(dx, dy);
    if (l > max) { s.sx = s.x - dx / l * max; s.sy = s.y - dy / l * max; }
    this.stickUI && this.stickUI(s);
    this.lastInputT = performance.now();
  }
  onUp(e) {
    if (this.ptr.has(e.pointerId)) { const pad = this.ptr.get(e.pointerId); if (pad) { this.tb[pad.dataset.pad] = false; pad.classList.remove('on'); } else this.tb.jump = false; this.ptr.delete(e.pointerId); return; }
    if (this.stick && this.stick.id === e.pointerId) { this.stick = null; this.stickUI && this.stickUI(null); }
  }
  pads() { return navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; }
  padCtl(g, out) {
    const b = (i) => g.buttons[i] && g.buttons[i].pressed;
    const lx = g.axes[0] || 0, ly = g.axes[1] || 0;
    if (Math.abs(lx) > 0.2) out.mx = Math.sign(lx) * Math.min(1, (Math.abs(lx) - 0.2) / 0.6);
    if (Math.abs(ly) > 0.35) out.my = -Math.sign(ly) * Math.min(1, (Math.abs(ly) - 0.35) / 0.5);
    if (b(14)) out.mx = -1; if (b(15)) out.mx = 1; if (b(12)) out.my = 1; if (b(13)) out.my = -1;
    const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0;
    if (b(0)) out.jump = true;
    if (b(2) || b(5)) out.pick = true;
    if (b(1) || rt > 0.4) out.dyn = true;
    if (b(3) || b(4)) out.flare = true;
  }
  control() {
    const T = this.taps, K = { has: (k) => this.keys.has(k) || T.has(k) }, out = { mx: 0, my: 0, jump: false, pick: false, dyn: false, flare: false };
    if (K.has('KeyA') || K.has('ArrowLeft')) out.mx -= 1;
    if (K.has('KeyD') || K.has('ArrowRight')) out.mx += 1;
    if (K.has('KeyW') || K.has('ArrowUp')) out.my += 1;
    if (K.has('KeyS') || K.has('ArrowDown')) out.my -= 1;
    for (const k of JUMP) if (K.has(k)) out.jump = true;
    for (const k of PICK) if (K.has(k)) out.pick = true;
    for (const k of DYN) if (K.has(k)) out.dyn = true;
    for (const k of FLARE) if (K.has(k)) out.flare = true;
    for (const g of this.pads()) this.padCtl(g, out);
    const s = this.stick;
    if (s) {
      const dx = s.x - s.sx, dy = s.y - s.sy;
      if (Math.abs(dx) > 10) out.mx = Math.sign(dx) * Math.min(1, (Math.abs(dx) - 10) / 36);
      if (Math.abs(dy) > 22) out.my = -Math.sign(dy) * Math.min(1, (Math.abs(dy) - 22) / 30);
    }
    for (const k in this.tb) if (this.tb[k] || T.has('tb:' + k)) out[k] = true;
    T.clear();
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
      if (edge(8)) { this.emit('any', 'pad'); this.emit('map'); }
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
    this.pads().forEach((g) => {
      const act = g && g.vibrationActuator;
      if (act && act.playEffect) act.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }).catch(() => {});
    });
    if (this.lastKind === 'touch' && navigator.vibrate) { try { navigator.vibrate(Math.round(ms * 0.5)); } catch { /* not allowed */ } }
  }
}
