// Keyboard + mouse + gamepad + touch, merged into one per-frame state.
import { settings, clamp } from './util.js';

export class Input {
  constructor(canvas) {
    this.keys = new Set(); this.pressed = new Set(); this.canvas = canvas;
    this.mx = 0; this.my = 0; this.camX = 0; this.camY = 0; this.zoom = 0;
    this.jump = false; this.jumpHeld = false; this.act = false; this.actHeld = false; this.pause = false; this.rotL = false; this.rotR = false; this.recenter = false;
    this.menuNav = null; this.menuOk = false; this.menuBack = false; this.any = false;
    this.touch = { stickId: null, sx: 0, sy: 0, x: 0, y: 0, lookId: null, lx: 0, ly: 0, jump: false, act: false, jumpEdge: false, actEdge: false, pauseEdge: false };
    this.mouse = { down: false, x: 0, y: 0, dx: 0, dy: 0 };
    this.padPrev = []; this.usingPad = false; this.usingTouch = false;
    addEventListener('keydown', e => {
      if (e.target && e.target.tagName === 'INPUT') return;
      if (!e.repeat) this.pressed.add(e.code);
      this.keys.add(e.code); this.any = true; this.usingPad = false;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) && (document.activeElement === document.body || document.activeElement === canvas)) e.preventDefault();
    });
    addEventListener('keyup', e => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.touch.jump = this.touch.act = false; this.touch.stickId = this.touch.lookId = null; });
    canvas.addEventListener('mousedown', e => { this.mouse.down = true; this.mouse.x = e.clientX; this.mouse.y = e.clientY; this.any = true; });
    addEventListener('mouseup', () => { this.mouse.down = false; });
    addEventListener('mousemove', e => {
      if (document.pointerLockElement === canvas) { this.mouse.dx += e.movementX; this.mouse.dy += e.movementY; return; }
      if (!this.mouse.down) return;
      this.mouse.dx += e.clientX - this.mouse.x; this.mouse.dy += e.clientY - this.mouse.y; this.mouse.x = e.clientX; this.mouse.y = e.clientY;
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('wheel', e => { this.zoom += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
    this.bindTouch();
  }
  bindTouch() {
    const T = this.touch, stickEl = document.getElementById('t-stick'), knob = stickEl.firstElementChild;
    const jb = document.getElementById('t-jump'), ab = document.getElementById('t-act'), pb = document.getElementById('t-pause');
    const btn = (el, key) => {
      el.addEventListener('touchstart', e => { e.preventDefault(); T[key] = true; T[key + 'Edge'] = true; el.classList.add('on'); this.usingTouch = true; }, { passive: false });
      const up = e => { e.preventDefault(); T[key] = false; el.classList.remove('on'); };
      el.addEventListener('touchend', up, { passive: false }); el.addEventListener('touchcancel', up, { passive: false });
    };
    btn(jb, 'jump'); btn(ab, 'act'); btn(document.getElementById('t-bonk'), 'bonk');
    document.getElementById('demo-stop').addEventListener('click', () => { T.stopEdge = true; });
    pb.addEventListener('touchstart', e => { e.preventDefault(); T.pauseEdge = true; }, { passive: false });
    const canvas = this.canvas;
    canvas.addEventListener('touchstart', e => {
      e.preventDefault(); this.usingTouch = true; this.any = true;
      for (const t of e.changedTouches) {
        if (t.clientX < innerWidth * .45 && T.stickId === null) {
          T.stickId = t.identifier; T.sx = T.x = t.clientX; T.sy = T.y = t.clientY;
          stickEl.style.display = 'block'; stickEl.style.left = t.clientX + 'px'; stickEl.style.top = t.clientY + 'px'; knob.style.transform = '';
        } else if (T.lookId === null) { T.lookId = t.identifier; T.lx = t.clientX; T.ly = t.clientY; }
      }
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === T.stickId) {
          T.x = t.clientX; T.y = t.clientY;
          const dx = T.x - T.sx, dy = T.y - T.sy, d = Math.hypot(dx, dy), m = Math.min(d, 55);
          knob.style.transform = `translate(${dx / (d || 1) * m}px, ${dy / (d || 1) * m}px)`;
        } else if (t.identifier === T.lookId) { this.mouse.dx += (t.clientX - T.lx) * 1.4; this.mouse.dy += (t.clientY - T.ly) * 1.4; T.lx = t.clientX; T.ly = t.clientY; }
      }
    }, { passive: false });
    const end = e => {
      for (const t of e.changedTouches) {
        if (t.identifier === T.stickId) { T.stickId = null; stickEl.style.display = 'none'; }
        if (t.identifier === T.lookId) T.lookId = null;
      }
    };
    canvas.addEventListener('touchend', end); canvas.addEventListener('touchcancel', end);
  }
  down(...codes) { return codes.some(c => this.keys.has(c)); }
  hit(...codes) { return codes.some(c => this.pressed.has(c)); }
  poll(dt) {
    const k = this, T = this.touch;
    let mx = (k.down('KeyD', 'ArrowRight') ? 1 : 0) - (k.down('KeyA', 'ArrowLeft') ? 1 : 0);
    let my = (k.down('KeyW', 'ArrowUp') ? 1 : 0) - (k.down('KeyS', 'ArrowDown') ? 1 : 0);
    let jump = k.hit('Space', 'KeyK'), jumpHeld = k.down('Space', 'KeyK');
    let act = k.hit('KeyE', 'ShiftLeft', 'ShiftRight', 'KeyJ', 'Enter', 'NumpadEnter'), actHeld = k.down('KeyE', 'ShiftLeft', 'ShiftRight', 'KeyJ', 'Enter', 'NumpadEnter');
    let pause = k.hit('Escape', 'KeyP'), rotL = k.hit('KeyQ'), rotR = k.hit('KeyR'), recenter = k.hit('KeyC'), attack = k.hit('KeyF', 'KeyL');
    let keyEdge = this.pressed.size > 0;
    let camX = 0, camY = 0;
    let nav = k.hit('ArrowUp', 'KeyW') ? 'up' : k.hit('ArrowDown', 'KeyS') ? 'down' : k.hit('ArrowLeft', 'KeyA') ? 'left' : k.hit('ArrowRight', 'KeyD') ? 'right' : null;
    let anav = k.hit('ArrowUp') ? 'up' : k.hit('ArrowDown') ? 'down' : k.hit('ArrowLeft') ? 'left' : k.hit('ArrowRight') ? 'right' : null;
    let ok = k.hit('Enter', 'Space', 'NumpadEnter'), back = k.hit('Escape');
    // mouse look
    camX -= this.mouse.dx * .0042 * settings.camSens; camY += this.mouse.dy * .003 * settings.camSens * (settings.invertY ? -1 : 1);
    if (camX || camY) this.lookT = performance.now();
    this.mouse.dx = this.mouse.dy = 0;
    // touch stick
    if (T.stickId !== null) {
      const dx = T.x - T.sx, dy = T.y - T.sy, d = Math.hypot(dx, dy);
      if (d > 8) { const m = Math.min(1, (d - 8) / 50); mx += dx / d * m; my -= dy / d * m; }
    }
    if (T.jumpEdge) jump = true; if (T.jump) jumpHeld = true;
    if (T.actEdge) act = true; if (T.act) actHeld = true;
    if (T.pauseEdge) pause = true;
    if (T.bonkEdge) attack = true;
    if (T.stopEdge) keyEdge = true;
    T.jumpEdge = T.actEdge = T.pauseEdge = T.bonkEdge = T.stopEdge = false;
    // gamepads
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp || !gp.connected) continue;
      const prev = this.padPrev[gp.index] || [], b = i => gp.buttons[i] && gp.buttons[i].pressed, e = i => b(i) && !prev[i];
      const dz = v => Math.abs(v) < .18 ? 0 : (v - Math.sign(v) * .18) / .82;
      const lx = dz(gp.axes[0] || 0), ly = dz(gp.axes[1] || 0), rx = dz(gp.axes[2] || 0), ry = dz(gp.axes[3] || 0);
      if (lx || ly || gp.buttons.some(x => x.pressed)) { this.usingPad = true; this.any = true; }
      mx += lx + (b(15) ? 1 : 0) - (b(14) ? 1 : 0); my += -ly + (b(12) ? 1 : 0) - (b(13) ? 1 : 0);
      camX -= rx * 2.6 * dt * settings.camSens; camY += ry * 1.6 * dt * settings.camSens * (settings.invertY ? -1 : 1);
      if (e(0)) { jump = true; ok = true; } if (b(0)) jumpHeld = true;
      if (e(2) || e(1)) act = true; if (b(2) || b(1)) actHeld = true;
      if (e(9)) pause = true; if (e(1)) back = true; if (e(8)) back = true; if (e(3)) attack = true;
      if (gp.buttons.some((x, i) => x.pressed && !prev[i])) keyEdge = true;
      if (e(4)) rotL = true; if (e(5)) rotR = true; if (e(11) || e(10)) recenter = true;
      if (e(12) || (ly < -.6 && !(prev.ly < -.6))) anav = nav = 'up'; if (e(13) || (ly > .6 && !(prev.ly > .6))) anav = nav = 'down';
      if (e(14) || (lx < -.6 && !(prev.lx < -.6))) anav = nav = 'left'; if (e(15) || (lx > .6 && !(prev.lx > .6))) anav = nav = 'right';
      this.padPrev[gp.index] = Object.assign(gp.buttons.map(x => x.pressed), { lx, ly });
    }
    const m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
    Object.assign(this, { mx, my, jump, jumpHeld, act, actHeld, pause, rotL, rotR, recenter, camX, camY, attack, keyEdge, menuNav: nav, menuNavArrows: anav, menuOk: ok, menuBack: back });
    this.zoomStep = this.zoom; this.zoom = 0;
    this.pressed.clear();
  }
  rumble(strong = .5, ms = 120) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) if (gp && gp.vibrationActuator) gp.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: strong * .6 }).catch(() => {});
    if (this.usingTouch && navigator.vibrate) navigator.vibrate(Math.min(60, ms / 2));
  }
}
