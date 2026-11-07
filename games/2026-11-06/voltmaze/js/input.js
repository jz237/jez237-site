// Input: resolves keyboard, mouse, gamepads and touch into one infiltrator control
//   { mx, mz (run, world units), ax, az (free aim, world units), fire, plant, emp, dash }
// plus edge events for menus and pause.
//   keyboard: arrows or WASD run. Hold SPACE (or J / Z / Ctrl) to plant your feet: the direction keys
//             then aim and you fire that way, the classic way. Twin-stick: run with WASD while the arrow
//             keys aim and fire. Mouse: aim at the cursor, left button fires. E / Q / right button = EMP,
//             SHIFT = dash.
//   gamepad:  left stick runs, right stick aims + fires, hold A to plant and aim with the left stick,
//             RT fires the way you face, X / B = EMP, LB / RB / LT = dash, START pause
//   touch:    left thumb = floating run stick, right thumb = floating aim stick that fires, EMP + DASH
// Screen directions are turned into room directions through the camera, so portrait phones (where the
// room is turned on its side) still feel right.
import * as THREE from '../vendor/three.module.min.js';

const ray = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.2);
const ndc = new THREE.Vector2();
const hit = new THREE.Vector3();
const _r = new THREE.Vector3(), _f = new THREE.Vector3();
const FIRE = ['Space', 'KeyJ', 'KeyZ', 'ControlLeft', 'ControlRight'];
const EMP = ['KeyE', 'KeyQ', 'KeyX'];
const DASH = ['ShiftLeft', 'ShiftRight', 'KeyK', 'KeyC'];

export class Input {
  constructor(camera) {
    this.camera = camera;
    this.keys = new Set();
    this.mouse = { on: false, x: 0, y: 0, t: -1e9, l: false, r: false };
    this.kbAimT = -1e9;
    this.sticks = { move: null, aim: null };
    this.tBtn = { emp: false, dash: false };
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.padAim = null;
    this.ptr = new Map();
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; this.sticks.move = this.sticks.aim = null; this.tBtn.emp = this.tBtn.dash = false; });
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
      if (k.startsWith('Arrow')) this.kbAimT = performance.now();
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
    if (pad) { e.preventDefault(); this.lastKind = 'touch'; this.tBtn[pad.dataset.pad] = true; pad.classList.add('on'); this.ptr.set(e.pointerId, pad); return; }
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
    const side = e.clientX < innerWidth * 0.5 ? 'move' : 'aim';
    if (this.sticks[side]) return;
    this.sticks[side] = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY };
    this.stickUI && this.stickUI(side, this.sticks[side]);
  }
  onMove(e) {
    if (e.pointerType === 'mouse') {
      if (Math.abs(e.clientX - this.mouse.x) + Math.abs(e.clientY - this.mouse.y) > 2) this.mouse.t = performance.now();
      this.mouse.on = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY;
      return;
    }
    for (const side of ['move', 'aim']) {
      const s = this.sticks[side];
      if (!s || s.id !== e.pointerId) continue;
      e.preventDefault();
      s.x = e.clientX; s.y = e.clientY;
      // a floating stick: the centre follows when you drag far
      const dx = s.x - s.sx, dy = s.y - s.sy, l = Math.hypot(dx, dy), max = 64;
      if (l > max) { s.sx = s.x - (dx / l) * max; s.sy = s.y - (dy / l) * max; }
      this.stickUI && this.stickUI(side, s);
      this.lastInputT = performance.now();
    }
  }
  onUp(e) {
    const pad = this.ptr.get(e.pointerId);
    if (pad) { this.tBtn[pad.dataset.pad] = false; pad.classList.remove('on'); this.ptr.delete(e.pointerId); return; }
    if (e.pointerType === 'mouse') { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; return; }
    for (const side of ['move', 'aim']) if (this.sticks[side] && this.sticks[side].id === e.pointerId) { this.sticks[side] = null; this.stickUI && this.stickUI(side, null); }
  }

  // a screen direction (right, down) as a room direction, whichever way the camera faces
  screenDir(sx, sy) {
    const q = this.camera.quaternion;
    _r.set(1, 0, 0).applyQuaternion(q); _r.y = 0; _r.normalize();
    _f.set(0, 1, 0).applyQuaternion(q); _f.y = 0;
    if (_f.lengthSq() < 1e-6) _f.set(0, 0, -1).applyQuaternion(q).setY(0);
    _f.normalize();
    return [_r.x * sx - _f.x * sy, _r.z * sx - _f.z * sy];
  }
  worldAt(cx, cy) {
    ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, this.camera);
    return ray.ray.intersectPlane(plane, hit) ? { x: hit.x, z: hit.z } : null;
  }
  pads() { return navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []; }

  // the control for the local infiltrator at (px, pz)
  control(px = 0, pz = 0) {
    const K = this.keys, out = { mx: 0, mz: 0, ax: 0, az: 0, fire: false, plant: false, emp: false, dash: false, src: 'none' };
    let wx = 0, wy = 0, ax = 0, ay = 0;
    if (K.has('KeyA')) wx--; if (K.has('KeyD')) wx++; if (K.has('KeyW')) wy--; if (K.has('KeyS')) wy++;
    if (K.has('ArrowLeft')) ax--; if (K.has('ArrowRight')) ax++; if (K.has('ArrowUp')) ay--; if (K.has('ArrowDown')) ay++;
    const fireKey = FIRE.some((k) => K.has(k));
    for (const k of EMP) if (K.has(k)) out.emp = true;
    for (const k of DASH) if (K.has(k)) out.dash = true;
    const wasd = wx || wy, arrows = ax || ay;
    if (fireKey) {
      // the classic way: feet planted, any direction key aims, fire held
      const sx = wx + ax, sy = wy + ay;
      out.plant = true; out.fire = true; out.src = 'key';
      if (sx || sy) { const l = Math.hypot(sx, sy); [out.mx, out.mz] = this.screenDir(sx / l, sy / l); }
    } else if (wasd && arrows) {
      // twin-stick on the keyboard: WASD runs, the arrows aim and fire
      const l = Math.hypot(wx, wy); [out.mx, out.mz] = this.screenDir(wx / l, wy / l);
      const m = Math.hypot(ax, ay); [out.ax, out.az] = this.screenDir(ax / m, ay / m); out.fire = true; out.src = 'key';
    } else if (wasd || arrows) {
      const sx = wx || ax, sy = wy || ay, l = Math.hypot(sx, sy);
      [out.mx, out.mz] = this.screenDir(sx / l, sy / l);
    }
    if (!out.plant && !(wasd && arrows) && this.mouse.on && this.mouse.t > this.kbAimT) {
      // the mouse aims when it was the last thing to move
      const w = this.worldAt(this.mouse.x, this.mouse.y);
      if (w) { const dx = w.x - px, dz = w.z - pz, l = Math.hypot(dx, dz); if (l > 0.3) { out.ax = dx / l; out.az = dz / l; out.src = 'mouse'; } }
      if (this.mouse.l) out.fire = true;
      if (this.mouse.r) out.emp = true;
    }
    // gamepads
    for (const g of this.pads()) {
      const b = (i) => g.buttons[i] && g.buttons[i].pressed;
      const lx = g.axes[0] || 0, ly = g.axes[1] || 0, rx = g.axes[2] || 0, ry = g.axes[3] || 0;
      const lm = Math.hypot(lx, ly), rm = Math.hypot(rx, ry);
      let mx = 0, mz = 0;
      if (lm > 0.2) { const k = Math.min(1, (lm - 0.2) / 0.7) / lm; [mx, mz] = this.screenDir(lx * k, ly * k); }
      let dx = 0, dy = 0;
      if (b(12)) dy--; if (b(13)) dy++; if (b(14)) dx--; if (b(15)) dx++;
      if ((dx || dy) && lm <= 0.2) { const l = Math.hypot(dx, dy); [mx, mz] = this.screenDir(dx / l, dy / l); }
      if (mx || mz) { out.mx = mx; out.mz = mz; }
      if (b(0)) { out.plant = true; out.fire = true; out.src = 'pad'; }
      if (rm > 0.35) { this.padAim = this.screenDir(rx / rm, ry / rm); [out.ax, out.az] = this.padAim; out.fire = true; out.src = 'pad'; }
      const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0;
      if (rt > 0.3) { out.fire = true; out.src = 'pad'; }
      if (b(1) || b(2)) out.emp = true;
      if (b(4) || b(5) || (g.buttons[6] && g.buttons[6].value > 0.4)) out.dash = true;
    }
    // touch: left stick runs, right stick aims and fires
    const m = this.sticks.move, a = this.sticks.aim;
    if (m) { const dx = m.x - m.sx, dy = m.y - m.sy, l = Math.hypot(dx, dy); if (l > 6) { const k = Math.min(1, (l - 6) / 46) / l; [out.mx, out.mz] = this.screenDir(dx * k, dy * k); } }
    if (a) { const dx = a.x - a.sx, dy = a.y - a.sy, l = Math.hypot(dx, dy); if (l > 10) { [out.ax, out.az] = this.screenDir(dx / l, dy / l); out.fire = true; out.src = 'touch'; } }
    if (this.tBtn.emp) out.emp = true;
    if (this.tBtn.dash) out.dash = true;
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
