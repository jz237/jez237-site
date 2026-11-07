// Input: one Prospector control on every device
//   { mx, mz (steer: the way the nose should point and how hard to thrust, world units), fire, bomb, src }
// plus edge events for menus and pause.
//   keyboard: WASD or arrow keys steer, SPACE / J fires, SHIFT / B / K launches a NOVA CHARGE; or steer with
//             the mouse (the ship flies toward the pointer), left button fires, right button launches
//   gamepad:  left stick / d-pad steers, A or RT fires, B / X / bumpers / LT launch, START pauses
//   touch:    left thumb = floating steering stick, FIRE and CHARGE buttons under the right thumb
import * as THREE from '../vendor/three.module.min.js';

const ray = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const ndc = new THREE.Vector2();
const hit = new THREE.Vector3();
const _r = new THREE.Vector3(), _f = new THREE.Vector3();
const FIRE = ['Space', 'KeyJ', 'ControlLeft', 'ControlRight'];
const BOMB = ['ShiftLeft', 'ShiftRight', 'KeyB', 'KeyK', 'KeyE', 'Enter'];

export class Input {
  constructor(camera) {
    this.camera = camera;
    this.keys = new Set();
    this.mouse = { on: false, x: 0, y: 0, t: -1e9, l: false, r: false };
    this.kbT = -1e9;
    this.stick = null;
    this.tFire = false; this.tBomb = false;
    this.handlers = { any: [], key: [], pause: [], confirm: [], back: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.ptr = new Map();
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; this.stick = null; this.tFire = this.tBomb = false; });
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
      if (pad.dataset.pad === 'fire') this.tFire = true; else this.tBomb = true;
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
      if (!pad || pad.dataset.pad === 'fire') this.tFire = false; else this.tBomb = false;
      if (pad) pad.classList.remove('on');
      this.ptr.delete(e.pointerId);
      return;
    }
    if (e.pointerType === 'mouse') { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; return; }
    if (this.stick && this.stick.id === e.pointerId) { this.stick = null; this.stickUI && this.stickUI(null); }
  }

  // a screen direction (right, down) as a field direction, whichever way the camera faces
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

  // the control for the local ship drawn at (px, pz)
  control(px = 0, pz = 0) {
    const K = this.keys, out = { mx: 0, mz: 0, fire: false, bomb: false, src: 'none' };
    let sx = 0, sy = 0;
    if (K.has('KeyA') || K.has('ArrowLeft')) sx--; if (K.has('KeyD') || K.has('ArrowRight')) sx++;
    if (K.has('KeyW') || K.has('ArrowUp')) sy--; if (K.has('KeyS') || K.has('ArrowDown')) sy++;
    for (const k of FIRE) if (K.has(k)) out.fire = true;
    for (const k of BOMB) if (K.has(k)) out.bomb = true;
    if (sx || sy) { const l = Math.hypot(sx, sy); [out.mx, out.mz] = this.screenDir(sx / l, sy / l); out.src = 'key'; }
    else if (this.mouse.on && this.mouse.t > this.kbT && (this.mouse.l || this.mouse.r || performance.now() - this.mouse.t < 4000)) {
      // the mouse steers when it was the last thing to move: the ship flies toward the pointer
      const w = this.worldAt(this.mouse.x, this.mouse.y);
      if (w) { const dx = w.x - px, dz = w.z - pz, l = Math.hypot(dx, dz); if (l > 2.5) { const k = Math.min(1, (l - 2.5) / 10); out.mx = (dx / l) * k; out.mz = (dz / l) * k; out.src = 'mouse'; } }
    }
    if (this.mouse.l) out.fire = true;
    if (this.mouse.r) out.bomb = true;
    for (const g of this.pads()) {
      const b = (i) => g.buttons[i] && g.buttons[i].pressed;
      const lx = g.axes[0] || 0, ly = g.axes[1] || 0, lm = Math.hypot(lx, ly);
      if (lm > 0.2) { const k = Math.min(1, (lm - 0.2) / 0.7) / lm; [out.mx, out.mz] = this.screenDir(lx * k, ly * k); out.src = 'pad'; }
      let dx = 0, dy = 0;
      if (b(12)) dy--; if (b(13)) dy++; if (b(14)) dx--; if (b(15)) dx++;
      if ((dx || dy) && lm <= 0.2) { const l = Math.hypot(dx, dy); [out.mx, out.mz] = this.screenDir(dx / l, dy / l); out.src = 'pad'; }
      // the right stick steers too, for players who like it there
      const rx = g.axes[2] || 0, ry = g.axes[3] || 0, rm = Math.hypot(rx, ry);
      if (rm > 0.35 && lm <= 0.2) { const k = Math.min(1, (rm - 0.3) / 0.6) / rm; [out.mx, out.mz] = this.screenDir(rx * k, ry * k); out.src = 'pad'; }
      const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0, lt = g.buttons[6] ? g.buttons[6].value || 0 : 0;
      if (b(0) || rt > 0.3) out.fire = true;
      if (b(1) || b(2) || b(4) || b(5) || lt > 0.3) out.bomb = true;
    }
    const s = this.stick;
    if (s) { const dx = s.x - s.sx, dy = s.y - s.sy, l = Math.hypot(dx, dy); if (l > 6) { const k = Math.min(1, (l - 6) / 46) / l; [out.mx, out.mz] = this.screenDir(dx * k, dy * k); out.src = 'touch'; } }
    if (this.tFire) out.fire = true;
    if (this.tBomb) out.bomb = true;
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
