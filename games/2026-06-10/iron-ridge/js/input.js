// Unified input: keyboard + pointer-lock mouse on desktop, twin virtual
// sticks + fire button on touch. Exposes one normalized state object.

import { settings, setSetting } from './settings.js?v=2';

export const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.throttle = 0;
    this.turn = 0;
    this.lookDX = 0;
    this.lookDY = 0;
    this.zoomDelta = 0;
    this.firing = false;
    this.fireQueued = false;
    this.reloadQueued = false;
    this.pauseQueued = false;
    this.keys = new Set();
    this.locked = false;
    this.reverseLook = settings.reverseLook;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.target instanceof HTMLInputElement) return; // typing initials, not commands
      this.keys.add(e.code);
      if (e.code === 'Space') { this.fireQueued = true; e.preventDefault(); }
      if (e.code === 'KeyR') this.reloadQueued = true;
      if (e.code === 'KeyF') this.strikeQueued = true;
      if (e.code === 'KeyG') this.pingQueued = true;
      if (e.code === 'KeyP' || e.code === 'Escape') this.pauseQueued = true;
      if (e.code === 'KeyM') this.muteQueued = true;
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      if (!this.locked) this.unlockedAt = performance.now();
    });
    canvas.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.lookDX += e.movementX * settings.lookSens;
      this.lookDY += e.movementY * settings.lookSens;
    });
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.locked) { this.firing = true; this.fireQueued = true; }
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.firing = false;
    });
    window.addEventListener('wheel', (e) => { this.zoomDelta += Math.sign(e.deltaY); }, { passive: true });

    if (isTouch) this.setupTouch();
  }

  requestLock() {
    if (isTouch) return;
    try {
      const p = this.canvas.requestPointerLock?.();
      p?.catch?.(() => {});
    } catch {}
  }

  releaseLock() {
    try {
      if (document.pointerLockElement) document.exitPointerLock?.();
    } catch {}
  }

  setReverseLook(on) {
    this.reverseLook = !!on;
    setSetting('reverseLook', this.reverseLook);
  }

  setupTouch() {
    document.body.classList.add('touch');
    const stick = document.getElementById('stick');
    const knob = document.getElementById('stick-knob');
    const stickZone = document.getElementById('stick-zone');
    const lookZone = document.getElementById('look-zone');
    const fireBtn = document.getElementById('btn-fire');

    // camera-relative drive vector, consumed by main.js
    this.stickX = 0;
    this.stickY = 0;

    let stickId = null, lookId = null, fireId = null, pinchId = null;
    let sx = 0, sy = 0;
    const homeRect = stick.getBoundingClientRect();
    const homeX = homeRect.left, homeY = homeRect.top;
    // sizes are live: the control-size option rescales the elements
    const half = () => stick.offsetWidth / 2 || 62;
    const range = () => (stick.offsetWidth || 124) * 0.45;

    const stickPos = (t) => {
      const RANGE = range();
      const dx = t.clientX - sx, dy = t.clientY - sy;
      const len = Math.hypot(dx, dy) || 1;
      const cl = Math.min(len, RANGE);
      const nx = (dx / len) * cl, ny = (dy / len) * cl;
      knob.style.transform = `translate(${nx}px, ${ny}px)`;
      // deadzone + smooth response curve
      const mRaw = cl / RANGE;
      const m = mRaw < 0.14 ? 0 : (mRaw - 0.14) / 0.86;
      this.stickX = (nx / RANGE) * (m / (mRaw || 1));
      this.stickY = -(ny / RANGE) * (m / (mRaw || 1));
    };

    // floating joystick: anchor wherever the thumb lands in the zone
    stickZone.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      if (stickId !== null) return;
      stickId = t.identifier;
      sx = t.clientX; sy = t.clientY;
      stick.style.left = `${sx - half()}px`;
      stick.style.top = `${sy - half()}px`;
      stick.style.bottom = 'auto';
      stick.classList.add('active');
      stickPos(t);
      e.preventDefault();
    }, { passive: false });

    let lastLX = 0, lastLY = 0;
    let lastPinchD = 0;
    const touchById = (e, id) => {
      for (const t of e.touches) if (t.identifier === id) return t;
      return null;
    };
    lookZone.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      if (lookId === null) {
        lookId = t.identifier;
        lastLX = t.clientX; lastLY = t.clientY;
      } else if (pinchId === null) {
        // second finger on the look side = pinch zoom
        pinchId = t.identifier;
        const a = touchById(e, lookId);
        if (a) lastPinchD = Math.hypot(t.clientX - a.clientX, t.clientY - a.clientY);
      }
      e.preventDefault();
    }, { passive: false });

    // consistent look feel across phone sizes
    const lookScale = () => 2.6 * (820 / Math.max(360, window.innerWidth)) * settings.lookSens;

    let lastFX = 0, lastFY = 0;
    window.addEventListener('touchmove', (e) => {
      if (pinchId !== null && lookId !== null) {
        const a = touchById(e, lookId), b = touchById(e, pinchId);
        if (a && b) {
          const d = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
          this.zoomDelta -= (d - lastPinchD) * 0.045;
          lastPinchD = d;
          // keep the look anchor fresh so releasing the pinch doesn't jump
          lastLX = a.clientX; lastLY = a.clientY;
        }
        e.preventDefault();
        return;
      }
      for (const t of e.changedTouches) {
        if (t.identifier === stickId) stickPos(t);
        else if (t.identifier === lookId) {
          const k = lookScale();
          this.lookDX += (t.clientX - lastLX) * k;
          this.lookDY += (t.clientY - lastLY) * k;
          lastLX = t.clientX; lastLY = t.clientY;
        } else if (t.identifier === fireId) {
          // drag on the fire button aims too — hold to fire, slide to track
          const k = lookScale();
          this.lookDX += (t.clientX - lastFX) * k;
          this.lookDY += (t.clientY - lastFY) * k;
          lastFX = t.clientX; lastFY = t.clientY;
        }
      }
      if (stickId !== null || lookId !== null || fireId !== null) e.preventDefault();
    }, { passive: false });

    const endTouch = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === stickId) {
          stickId = null;
          this.stickX = 0; this.stickY = 0;
          knob.style.transform = 'translate(0px, 0px)';
          stick.classList.remove('active');
          stick.style.left = `${homeX}px`;
          stick.style.top = `${homeY}px`;
        }
        if (t.identifier === lookId) {
          lookId = null;
          if (pinchId !== null) { lookId = pinchId; pinchId = null; }
        } else if (t.identifier === pinchId) pinchId = null;
        if (t.identifier === fireId) { fireId = null; this.firing = false; }
      }
    };
    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);

    fireBtn.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      fireId = t.identifier;
      lastFX = t.clientX; lastFY = t.clientY;
      this.firing = true; this.fireQueued = true;
      e.preventDefault();
    }, { passive: false });

    document.getElementById('btn-reload')?.addEventListener('touchstart', (e) => {
      this.reloadQueued = true;
      e.preventDefault();
    }, { passive: false });

    document.getElementById('btn-pause-touch')?.addEventListener('touchstart', (e) => {
      this.pauseQueued = true;
      e.preventDefault();
    }, { passive: false });

    document.getElementById('btn-strike')?.addEventListener('touchstart', (e) => {
      this.strikeQueued = true;
      e.preventDefault();
    }, { passive: false });

    document.getElementById('btn-ping')?.addEventListener('touchstart', (e) => {
      this.pingQueued = true;
      e.preventDefault();
    }, { passive: false });
  }

  // call once per frame; merges keyboard into analog state
  poll() {
    if (!isTouch) {
      let th = 0, tr = 0;
      if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) th += 1;
      if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) th -= 1;
      if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) tr -= 1;
      if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) tr += 1;
      this.throttle = th;
      this.turn = tr;
    }
  }

  consumeLook() {
    const dx = this.lookDX, dy = this.lookDY;
    this.lookDX = 0; this.lookDY = 0;
    return { dx, dy: this.reverseLook ? -dy : dy };
  }

  consumeZoom() {
    const z = this.zoomDelta;
    this.zoomDelta = 0;
    return z;
  }

  consumeFire() {
    const f = this.fireQueued;
    this.fireQueued = false;
    return f || this.firing;
  }

  consumeReload() {
    const r = this.reloadQueued;
    this.reloadQueued = false;
    return r;
  }

  consumeStrike() {
    const s = this.strikeQueued;
    this.strikeQueued = false;
    return s;
  }

  consumePing() {
    const p = this.pingQueued;
    this.pingQueued = false;
    return p;
  }

  consumePause() {
    const p = this.pauseQueued;
    this.pauseQueued = false;
    return p;
  }

  consumeMute() {
    const m = this.muteQueued;
    this.muteQueued = false;
    return m;
  }
}
