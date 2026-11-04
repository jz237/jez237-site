// Input: keyboard (classic rotate + thrust), mouse (aim at the cursor), gamepads (stick steers) and
// touch (a virtual stick on the left, buttons on the right). Everything resolves to one ship control:
// { turn, aim, thrust, fire } per player, plus edge events for dash, overdrive, pause and menus.
import * as THREE from '../vendor/three.module.min.js';
import { angleTo } from './sim.js?v=6';

const ray = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const ndc = new THREE.Vector2();
const hit = new THREE.Vector3();
const _r = new THREE.Vector3(), _f = new THREE.Vector3();
const FIRE_KEYS = { solo: ['Space', 'KeyF', 'KeyJ'], p1: ['Space', 'KeyF'], p2: ['Enter', 'NumpadEnter', 'Slash', 'Numpad0'] };

export class Input {
  constructor(camera) {
    this.camera = camera;
    this.keys = new Set();
    this.mouse = { active: false, x: 0, y: 0, t: -9, l: false, r: false };
    this.kbT = 0;
    this.touches = new Map();
    this.stick = null;          // the touch stick: { id, sx, sy, x, y }
    this.held = { fire: false };
    this.handlers = { any: [], fire: [], dash: [], od: [], pause: [], key: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches;
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; this.held.fire = false; this.stick = null; });
    addEventListener('pointerdown', (e) => this.onDown(e), { passive: false });
    addEventListener('pointermove', (e) => this.onMove(e), { passive: false });
    addEventListener('pointerup', (e) => this.onUp(e));
    addEventListener('pointercancel', (e) => this.onUp(e));
    addEventListener('contextmenu', (e) => e.preventDefault());
  }

  on(kind, fn) { this.handlers[kind].push(fn); }
  emit(kind, ...a) { for (const f of this.handlers[kind]) f(...a); }

  worldAt(cx, cy) {
    ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, this.camera);
    return ray.ray.intersectPlane(plane, hit) ? { x: hit.x, z: hit.z } : null;
  }

  onKey(e, down) {
    const k = e.code;
    const typing = e.target && e.target.tagName === 'INPUT';
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(k) && !typing) e.preventDefault();
    if (down) {
      this.lastInputT = performance.now();
      if (!e.repeat) {
        this.emit('any', 'key');
        this.emit('key', k, e);
        if (typing) return;
        if (k === 'Escape' || k === 'KeyP') this.emit('pause');
        if (k === 'Space' || k === 'KeyF' || k === 'KeyJ') this.emit('fire', 1, 'key');
        if (k === 'Enter' || k === 'NumpadEnter' || k === 'Slash' || k === 'Numpad0') this.emit('fire', -1, 'key');
        if (k === 'ShiftLeft' || k === 'KeyX' || k === 'KeyK') this.emit('dash', 1);
        if (k === 'ShiftRight' || k === 'NumpadDecimal') this.emit('dash', -1);
        if (k === 'KeyE' || k === 'KeyQ' || k === 'KeyL') this.emit('od', 1);
        if (k === 'Period' || k === 'Numpad1') this.emit('od', -1);
      }
      if (['KeyA', 'KeyD', 'KeyW', 'KeyS', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) this.kbT = performance.now();
      this.keys.add(k);
    } else this.keys.delete(k);
  }

  onDown(e) {
    this.lastInputT = performance.now();
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    this.emit('any', e.pointerType);
    if (onUI) return;
    if (e.pointerType === 'mouse') {
      this.mouse.active = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.mouse.t = performance.now();
      if (e.button === 0) { this.mouse.l = true; this.emit('fire', 1, 'mouse'); }
      if (e.button === 2) this.mouse.r = true;
      if (e.button === 1) { e.preventDefault(); this.emit('dash', 1); }
      return;
    }
    e.preventDefault();
    // left 55% of the screen is the stick, anywhere else taps fire
    if (e.clientX < innerWidth * 0.55 && !this.stick) this.stick = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now() };
    else this.touches.set(e.pointerId, { t0: performance.now() });
  }

  onMove(e) {
    if (e.pointerType === 'mouse') {
      if (Math.abs(e.clientX - this.mouse.x) + Math.abs(e.clientY - this.mouse.y) > 2) this.mouse.t = performance.now();
      this.mouse.active = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY;
      this.lastInputT = performance.now();
      return;
    }
    if (this.stick && this.stick.id === e.pointerId) {
      e.preventDefault();
      this.stick.x = e.clientX; this.stick.y = e.clientY;
      // a floating stick: the centre follows when you drag far
      const dx = this.stick.x - this.stick.sx, dy = this.stick.y - this.stick.sy, l = Math.hypot(dx, dy), max = 70;
      if (l > max) { this.stick.sx = this.stick.x - (dx / l) * max; this.stick.sy = this.stick.y - (dy / l) * max; }
      this.lastInputT = performance.now();
    }
  }

  onUp(e) {
    if (e.pointerType === 'mouse') {
      if (e.button === 0) this.mouse.l = false;
      if (e.button === 2) this.mouse.r = false;
      return;
    }
    if (this.stick && this.stick.id === e.pointerId) { this.stick = null; return; }
    this.touches.delete(e.pointerId);
  }

  // a direction on screen (right, down) as a heading on the belt, whichever way the camera faces
  screenAngle(sx, sy) {
    _r.set(1, 0, 0).applyQuaternion(this.camera.quaternion); _r.y = 0; _r.normalize();
    _f.set(0, 0, -1).applyQuaternion(this.camera.quaternion); _f.y = 0;
    if (_f.lengthSq() < 1e-6) _f.set(0, 1, 0).applyQuaternion(this.camera.quaternion).setY(0);
    _f.normalize();
    return angleTo(_r.x * sx - _f.x * sy, _r.z * sx - _f.z * sy);
  }

  pads() {
    if (!navigator.getGamepads) return [];
    return Array.from(navigator.getGamepads()).filter(Boolean).slice(0, 2);
  }

  // one ship's control. who: 'solo' | 'p1' | 'p2'; ship gives the cursor-aim origin
  control(who, ship) {
    const K = this.keys, out = { turn: 0, aim: null, thrust: 0, fire: false };
    const p1 = who === 'solo' || who === 'p1', p2 = who === 'solo' || who === 'p2';
    let kb = false;
    if (p1) {
      if (K.has('KeyA')) { out.turn--; kb = true; } if (K.has('KeyD')) { out.turn++; kb = true; }
      if (K.has('KeyW')) { out.thrust = 1; kb = true; } if (K.has('KeyS')) { out.thrust = -1; kb = true; }
    }
    if (p2) {
      if (K.has('ArrowLeft')) { out.turn--; kb = true; } if (K.has('ArrowRight')) { out.turn++; kb = true; }
      if (K.has('ArrowUp')) { out.thrust = 1; kb = true; } if (K.has('ArrowDown')) { out.thrust = -1; kb = true; }
    }
    for (const k of FIRE_KEYS[who]) if (K.has(k)) out.fire = true;
    if (this.held.fire && who !== 'p2') out.fire = true;
    // gamepads: the left stick points the ship and its push is the throttle
    const pads = this.pads();
    const list = who === 'solo' ? pads : who === 'p1' ? pads.slice(0, 1) : pads.slice(1, 2);
    for (const g of list) {
      const ax = g.axes[0] || 0, ay = g.axes[1] || 0, m = Math.hypot(ax, ay);
      const btn = (i) => g.buttons[i] && g.buttons[i].pressed;
      if (m > 0.3) { out.aim = this.screenAngle(ax, ay); out.turn = 0; out.thrust = Math.max(out.thrust, Math.min(1, (m - 0.3) / 0.6)); kb = true; }
      const rt = g.buttons[7] ? g.buttons[7].value || 0 : 0;
      if (rt > 0.2) out.thrust = Math.max(out.thrust, rt);
      if (btn(13)) out.thrust = -1;
      if (btn(0) || btn(5)) out.fire = true;
      if (btn(14)) { out.turn = -1; out.aim = null; } if (btn(15)) { out.turn = 1; out.aim = null; } if (btn(12)) out.thrust = 1;
    }
    // touch stick (solo only)
    if (who === 'solo' && this.stick) {
      const dx = this.stick.x - this.stick.sx, dy = this.stick.y - this.stick.sy, l = Math.hypot(dx, dy);
      if (l > 8) { out.aim = this.screenAngle(dx, dy); out.turn = 0; out.thrust = Math.min(1, Math.max(0, (l - 12) / 50)); }
      return out;
    }
    // mouse: the ship turns to the cursor when the mouse was the last thing used
    if (who !== 'p2' && this.mouse.active && ship && !kb && this.mouse.t > this.kbT) {
      const w = this.worldAt(this.mouse.x, this.mouse.y);
      if (w) {
        let dx = w.x - ship.x, dz = w.z - ship.z;
        if (Math.hypot(dx, dz) > 0.8) { out.aim = angleTo(dx, dz); out.turn = 0; }
      }
      if (this.mouse.r) out.thrust = 1;
      if (this.mouse.l) out.fire = true;
    } else if (who !== 'p2') {
      if (this.mouse.l) out.fire = true;
      if (this.mouse.r) out.thrust = Math.max(out.thrust, 1);
    }
    out.turn = Math.max(-1, Math.min(1, out.turn));
    return out;
  }

  // edges on gamepad buttons: fire (menus), dash, overdrive, pause
  pollPads(versus) {
    const pads = this.pads();
    pads.forEach((g, i) => {
      const prev = this.padPrev[i];
      const pr = (b) => g.buttons[b] && g.buttons[b].pressed;
      const edge = (b) => pr(b) && !prev[b];
      const who = versus ? (i === 0 ? 1 : -1) : 1;
      if (edge(0) || edge(5)) { this.emit('any', 'pad'); this.emit('fire', who, 'pad'); }
      if (edge(1) || edge(4)) { this.emit('any', 'pad'); this.emit('dash', who); }
      if (edge(2) || edge(3) || edge(6)) { this.emit('any', 'pad'); this.emit('od', who); }
      if (edge(9)) { this.emit('any', 'pad'); this.emit('pause'); }
      const axisMoved = g.axes.some((a) => Math.abs(a) > 0.5);
      if (axisMoved && !prev.axis) { this.emit('any', 'pad'); this.emit('key', axisDir(g.axes), null); }
      for (const b of [0, 1, 2, 3, 4, 5, 6, 7, 9, 12, 13, 14, 15]) {
        if (edge(b) && b >= 12) this.emit('key', ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'][b - 12], null);
        prev[b] = pr(b);
      }
      prev.axis = axisMoved;
      if (axisMoved || g.buttons.some((b) => b.pressed)) this.lastInputT = performance.now();
    });
  }
}
function axisDir(a) {
  const x = a[0] || 0, y = a[1] || 0;
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? 'ArrowRight' : 'ArrowLeft') : y > 0 ? 'ArrowDown' : 'ArrowUp';
}
