// UNDERSTORM 2026 — keyboard (remappable), gamepad with rumble, and touch.
export const ACTIONS = ['up', 'down', 'left', 'right', 'fire', 'anchor', 'spUp', 'spDn', 'pause'];
export const LABELS = { up: 'Up', down: 'Down', left: 'Left', right: 'Right', fire: 'Lance (hold to charge)', anchor: 'Anchor', spUp: 'Speed up', spDn: 'Speed down', pause: 'Pause' };
const DEF = { up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS'], left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'], fire: ['Space', 'KeyZ'], anchor: ['KeyX', 'ShiftLeft'], spUp: ['KeyE', 'Equal'], spDn: ['KeyQ', 'Minus'], pause: ['Escape', 'KeyP'] };

export class Input {
  constructor(box) {
    this.box = box; this.keys = new Set(); this.edge = new Set(); this.binds = JSON.parse(JSON.stringify(DEF)); this.touch = false; this.tdx = 0; this.tdy = 0; this.tf = false; this.ptr = null; this.pad = null; this.padPrev = []; this.menuEdge = []; this.capture = null; this.unit = 20;
    addEventListener('keydown', (e) => { if (this.capture) { e.preventDefault(); const c = this.capture; this.capture = null; c(e.code); return; } if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); if (!e.repeat) { this.keys.add(e.code); this.edge.add(e.code); } if (this.onKey) this.onKey(e); });
    addEventListener('keyup', (e) => this.keys.delete(e.code)); addEventListener('blur', () => this.keys.clear());
    const pd = (e) => { if (e.pointerType === 'mouse') return; this.touch = true; if (this.onTouch) this.onTouch(); if (e.target.closest('button,.card,input')) return; if (this.ptr === null) { this.ptr = e.pointerId; this.lx = e.clientX; this.ly = e.clientY; } };
    const pm = (e) => { if (e.pointerId !== this.ptr) return; this.tdx += (e.clientX - this.lx) / this.unit; this.tdy -= (e.clientY - this.ly) / this.unit; this.lx = e.clientX; this.ly = e.clientY; };
    const pu = (e) => { if (e.pointerId === this.ptr) this.ptr = null; };
    box.addEventListener('pointerdown', pd); addEventListener('pointermove', pm); addEventListener('pointerup', pu); addEventListener('pointercancel', pu);
  }
  loadBinds(b) { if (b) for (const a of ACTIONS) if (Array.isArray(b[a]) && b[a].length) this.binds[a] = b[a]; }
  resetBinds() { this.binds = JSON.parse(JSON.stringify(DEF)); }
  down(a) { for (const c of this.binds[a]) if (this.keys.has(c)) return true; return false; }
  hit(a) { for (const c of this.binds[a]) if (this.edge.has(c)) return true; return false; }
  hold(btn, on) { this[btn] = on; }
  rumble(strong, weak, ms) { const p = this.pad; try { if (p && p.vibrationActuator) p.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) }); } catch { /* unsupported */ } }
  // one read per rendered frame; edges are consumed here
  poll() {
    const o = { x: 0, y: 0, dx: this.tdx * 1.2, dy: this.tdy * 1.2, fire: false, anchor: false, spUp: false, spDn: false, pause: false, rapid: false, menu: null, ok: false, back: false };
    this.tdx = this.tdy = 0;
    if (this.down('left')) o.x -= 1; if (this.down('right')) o.x += 1; if (this.down('up')) o.y += 1; if (this.down('down')) o.y -= 1;
    o.fire = this.down('fire') || !!this.tf; o.anchor = this.hit('anchor') || !!this.ta; o.spUp = this.hit('spUp') || !!this.tu; o.spDn = this.hit('spDn') || !!this.td; o.pause = this.hit('pause'); this.ta = this.tu = this.td = false;
    if (this.hit('up')) o.menu = 'up'; else if (this.hit('down')) o.menu = 'down'; else if (this.hit('left')) o.menu = 'left'; else if (this.hit('right')) o.menu = 'right';
    if (this.edge.has('Enter') || this.edge.has('Space')) o.ok = true; if (this.edge.has('Escape') || this.edge.has('Backspace')) o.back = true;
    const pads = navigator.getGamepads ? navigator.getGamepads() : []; let p = null; for (const g of pads) if (g && g.connected) { p = g; break; } this.pad = p;
    if (p) { const b = (i) => !!(p.buttons[i] && p.buttons[i].pressed), was = (i) => !!this.padPrev[i], e = (i) => b(i) && !was(i); const ax = p.axes[0] || 0, ay = p.axes[1] || 0, dz = 0.22;
      if (Math.abs(ax) > dz) o.x += ax; if (Math.abs(ay) > dz) o.y -= ay; if (b(14)) o.x -= 1; if (b(15)) o.x += 1; if (b(12)) o.y += 1; if (b(13)) o.y -= 1;
      if (b(0) || b(7)) o.fire = true; if (e(2) || e(1) || e(6)) o.anchor = true; if (e(5)) o.spUp = true; if (e(4)) o.spDn = true; if (e(9)) o.pause = true;
      const mv = (i, d) => { if (e(i)) o.menu = d; }; mv(12, 'up'); mv(13, 'down'); mv(14, 'left'); mv(15, 'right'); const sy = ay < -0.6 ? 'up' : ay > 0.6 ? 'down' : null; if (sy && this.stickY !== sy) o.menu = sy; this.stickY = sy;
      if (e(0)) o.ok = true; if (e(1)) o.back = true; this.padPrev = p.buttons.map((q) => q.pressed); this.usedPad = this.usedPad || p.buttons.some((q) => q.pressed); }
    this.edge.clear(); return o;
  }
}
