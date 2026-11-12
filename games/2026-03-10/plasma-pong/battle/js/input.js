// Input: mouse (absolute), touch (relative drag + tap to fire), keyboard and gamepads.
// Movement keys are screen-relative, so they follow whichever camera is on screen.
import * as THREE from '../vendor/three.module.min.js';

const ray = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.3);
const ndc = new THREE.Vector2();
const hit = new THREE.Vector3();

export class Input {
  constructor(camera) {
    this.camera = camera;
    this.keys = new Set();
    this.mouse = { active: false, x: 0, y: 0, t: -9, down: false };
    this.touches = new Map();
    this.handlers = { any: [], fire: [], od: [], pause: [], key: [] };
    this.isTouch = matchMedia('(pointer:coarse)').matches;
    this.lastKind = this.isTouch ? 'touch' : 'key';
    this.padPrev = [{}, {}, {}, {}];
    this.lastInputT = performance.now();
    addEventListener('keydown', (e) => this.onKey(e, true));
    addEventListener('keyup', (e) => this.onKey(e, false));
    addEventListener('blur', () => this.keys.clear());
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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(k) && !(e.target && e.target.tagName === 'INPUT')) e.preventDefault();
    if (down) {
      this.lastKind='key';
      this.lastInputT = performance.now();
      if (!e.repeat) {
        this.emit('any', 'key');
        this.emit('key', k, e);
        if (k === 'Escape' || k === 'KeyP') this.emit('pause');
        if (k === 'Space' || k === 'KeyF') this.emit('fire', 1);
        if (k === 'KeyE' || k === 'KeyQ' || k === 'ShiftLeft') this.emit('od', 1);
        if (k === 'Enter' || k === 'NumpadEnter' || k === 'Slash' || k === 'Numpad0') this.emit('fire', -1);
        if (k === 'ShiftRight' || k === 'Period' || k === 'NumpadDecimal') this.emit('od', -1);
      }
      this.keys.add(k);
    } else this.keys.delete(k);
  }

  onDown(e) {
    this.lastKind=e.pointerType==='mouse'?'mouse':'touch';
    this.lastInputT = performance.now();
    const onUI = e.target && e.target.closest && e.target.closest('button, .card, input, a, .clickable');
    this.emit('any', e.pointerType);
    if (onUI) return;
    if (e.pointerType === 'mouse') {
      this.mouse.active = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.mouse.t = performance.now();
      if (e.button === 0) this.emit('fire', 1, 'mouse');
      if (e.button === 2) this.emit('od', 1, 'mouse');
      return;
    }
    e.preventDefault();
    const t = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now(), moved: 0, player: null, start: null, base: null };
    t.player = this.assign ? this.assign(t) : 1;
    this.touches.set(e.pointerId, t);
  }

  onMove(e) {
    if (e.pointerType === 'mouse') {
      this.lastKind='mouse';
      this.mouse.active = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.mouse.t = performance.now();
      this.lastInputT = performance.now();
      return;
    }
    const t = this.touches.get(e.pointerId);
    if (!t) return;
    e.preventDefault();
    t.moved = Math.max(t.moved, Math.hypot(e.clientX - t.sx, e.clientY - t.sy));
    t.x = e.clientX; t.y = e.clientY;
    this.lastInputT = performance.now();
  }

  onUp(e) {
    const t = this.touches.get(e.pointerId);
    if (!t) return;
    this.touches.delete(e.pointerId);
    const quick = performance.now() - t.t0 < 220 && t.moved < 14;
    if (quick && t.player) this.emit('fire', t.player, 'tap');
  }

  // screen-relative movement axes for a player: returns [right, up] in -1..1
  axes(who) {
    let ax = 0, ay = 0;
    const K = this.keys;
    const p1 = who === 'solo' || who === 'p1', p2 = who === 'solo' || who === 'p2';
    if (p1) { if (K.has('KeyA')) ax--; if (K.has('KeyD')) ax++; if (K.has('KeyW')) ay++; if (K.has('KeyS')) ay--; }
    if (p2) { if (K.has('ArrowLeft')) ax--; if (K.has('ArrowRight')) ax++; if (K.has('ArrowUp')) ay++; if (K.has('ArrowDown')) ay--; }
    const pads = this.pads();
    const idx = who === 'p2' ? 1 : 0;
    const list = who === 'solo' ? pads : pads[idx] ? [pads[idx]] : [];
    for (const g of list) {
      if (!g) continue;
      const dz = (v) => (Math.abs(v) < 0.18 ? 0 : v);
      ax += dz(g.axes[0] || 0); ay -= dz(g.axes[1] || 0);
      if (g.buttons[14] && g.buttons[14].pressed) ax--;
      if (g.buttons[15] && g.buttons[15].pressed) ax++;
      if (g.buttons[12] && g.buttons[12].pressed) ay++;
      if (g.buttons[13] && g.buttons[13].pressed) ay--;
    }
    return [Math.max(-1, Math.min(1, ax)), Math.max(-1, Math.min(1, ay))];
  }

  pads() {
    if (!navigator.getGamepads) return [];
    return Array.from(navigator.getGamepads()).filter(Boolean).slice(0, 2);
  }

  // poll gamepad buttons for fire / overdrive / pause edges
  pollPads(versus) {
    const pads = this.pads();
    pads.forEach((g, i) => {
      const prev = this.padPrev[i];
      const pr = (b) => g.buttons[b] && g.buttons[b].pressed;
      const edge = (b) => pr(b) && !prev[b];
      const who = versus ? (i === 0 ? 1 : -1) : 1;
      if (edge(0) || edge(2) || edge(7) || edge(5)) { this.emit('any', 'pad'); this.emit('fire', who, 'pad'); }
      if (edge(1) || edge(3) || edge(6) || edge(4)) { this.emit('any', 'pad'); this.emit('od', who, 'pad'); }
      if (edge(9)) { this.emit('any', 'pad'); this.emit('pause'); }
      const axisMoved = g.axes.some((a) => Math.abs(a) > 0.5);
      if (axisMoved && !prev.axis) this.emit('any', 'pad');
      for (const b of [0, 1, 2, 3, 4, 5, 6, 7, 9]) prev[b] = pr(b);
      prev.axis = axisMoved;
      if (axisMoved || g.buttons.some((b) => b.pressed)) {this.lastInputT = performance.now();this.lastKind='pad';}
    });
  }
}
