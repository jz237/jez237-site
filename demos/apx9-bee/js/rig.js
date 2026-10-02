// Camera rig: free trackball orbit with inertia, pan, wheel / pinch zoom, preset views, tweens, auto-rotate.
// Camera position = target + (0, 0, dist) rotated by `quat`; the camera looks at the target.
import * as THREE from 'three';

const D2R = Math.PI / 180;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

/** Orientation from yaw (about world Y, toward the nose when positive) then pitch (about camera X, negative looks down). */
export function anglesQuat(yawDeg, pitchDeg, rollDeg = 0) {
  const q = new THREE.Quaternion().setFromAxisAngle(AX.y, yawDeg * D2R);
  q.multiply(new THREE.Quaternion().setFromAxisAngle(AX.x, pitchDeg * D2R));
  if (rollDeg) q.multiply(new THREE.Quaternion().setFromAxisAngle(AX.z, rollDeg * D2R));
  return q;
}

export const VIEWS = {
  side:   () => anglesQuat(0, 0),                         // looking at the bee's right side, head to the right
  top:    () => anglesQuat(0, -90),
  front:  () => anglesQuat(90, 0),
  rear:   () => anglesQuat(-90, 0),
  under:  () => anglesQuat(0, 90),
  left:   () => anglesQuat(180, 0),
  hero:   () => anglesQuat(34, -20),
  hero2:  () => anglesQuat(-38, -24),
};

export class Rig {
  constructor(camera, dom, { minDist = 6, maxDist = 700 } = {}) {
    this.camera = camera;
    this.dom = dom;
    this.target = new THREE.Vector3();
    this.dist = 100;
    this.quat = VIEWS.hero();
    this.minDist = minDist;
    this.maxDist = maxDist;
    this.spin = new THREE.Vector3();          // camera-space angular velocity (axis * rad/s)
    this.autoRotate = false;
    this.autoSpeed = 0.22;                    // rad/s about world Y
    this.radius = 30;                         // scene bounding radius for near/far
    this.center = new THREE.Vector3();
    this.tween = null;
    this.home = null;
    this.idleSince = 0;
    this.enabled = true;
    this.pointers = new Map();
    this.drag = null;
    this.hoverCb = null;
    this.tapCb = null;
    this.dblCb = null;
    this.changeCb = null;
    this.interactCb = null;
    this.lastMove = 0;
    this._q = new THREE.Quaternion();
    this._v = new THREE.Vector3();
    this._w = new THREE.Vector3();
    this.bind();
    this.apply();
  }

  /* ---------------------------------------------------------------- state */
  getState() { return { quat: this.quat.clone(), target: this.target.clone(), dist: this.dist }; }
  setState(s) { this.quat.copy(s.quat); this.target.copy(s.target); this.dist = s.dist; this.apply(); }
  saveHome() { this.home = this.getState(); }

  /** Distance that fits a sphere of radius r in the viewport (with margin). */
  fitDistance(r, margin = 1.12) {
    const vf = this.camera.fov * D2R;
    const hf = 2 * Math.atan(Math.tan(vf / 2) * this.camera.aspect);
    return (r * margin) / Math.sin(Math.min(vf, hf) / 2);
  }

  frame(sphere, { ms = 0, margin = 1.12, quat = null, minAspect = 0 } = {}) {
    const d = THREE.MathUtils.clamp(this.fitDistance(sphere.radius, margin), this.minDist, this.maxDist);
    this.goTo({ target: sphere.center.clone(), dist: d, quat: quat ?? this.quat.clone() }, ms);
  }

  view(name, ms = 900) {
    const q = (VIEWS[name] || VIEWS.hero)();
    this.goTo({ quat: q }, ms);
  }

  goTo({ quat, target, dist }, ms = 800) {
    this.spin.set(0, 0, 0);
    const to = { quat: quat ? quat.clone() : this.quat.clone(), target: target ? target.clone() : this.target.clone(), dist: dist ?? this.dist };
    if (ms <= 0) { this.setState(to); this.changeCb?.(); return; }
    this.tween = { t: 0, dur: ms / 1000, from: this.getState(), to };
  }

  setAngles(yaw, pitch, roll = 0) { this.quat.copy(anglesQuat(yaw, pitch, roll)); this.apply(); }

  /* ---------------------------------------------------------------- per-frame */
  update(dt) {
    dt = Math.min(dt, 0.1);
    let moved = false;
    if (this.tween) {
      const tw = this.tween;
      tw.t += dt;
      const k = ease(Math.min(1, tw.t / tw.dur));
      this.quat.slerpQuaternions(tw.from.quat, tw.to.quat, k);
      this.target.lerpVectors(tw.from.target, tw.to.target, k);
      this.dist = Math.exp(THREE.MathUtils.lerp(Math.log(tw.from.dist), Math.log(tw.to.dist), k));
      if (tw.t >= tw.dur) this.tween = null;
      moved = true;
    } else if (!this.drag) {
      const sp = this.spin.length();
      if (sp > 1e-3) {
        this._q.setFromAxisAngle(this._v.copy(this.spin).divideScalar(sp), -sp * dt);
        this.quat.multiply(this._q);
        this.spin.multiplyScalar(Math.exp(-dt * 3.6));
        moved = true;
      } else if (sp > 0) this.spin.set(0, 0, 0);
      if (this.autoRotate && performance.now() - this.lastMove > 1200) {
        this._q.setFromAxisAngle(AX.y, this.autoSpeed * dt);
        this.quat.premultiply(this._q);
        moved = true;
      }
    }
    this.quat.normalize();
    this.apply();
    return moved;
  }

  apply() {
    const c = this.camera;
    c.quaternion.copy(this.quat);
    c.position.set(0, 0, this.dist).applyQuaternion(this.quat).add(this.target);
    const R = this.radius;
    const dc = c.position.distanceTo(this.center);
    c.near = Math.max(0.05, Math.min(this.dist * 0.5, dc - R * 1.35));
    c.far = dc + R * 2.2 + 20;
    c.updateProjectionMatrix();
    c.updateMatrixWorld(true);
  }

  /* ---------------------------------------------------------------- input */
  bind() {
    const el = this.dom;
    const d = this.drag;
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('pointerdown', (e) => this.onDown(e));
    el.addEventListener('pointermove', (e) => this.onMove(e));
    el.addEventListener('pointerup', (e) => this.onUp(e));
    el.addEventListener('pointercancel', (e) => this.onUp(e, true));
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !this.drag) this.hoverCb?.(null, null, e); });
    el.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    el.addEventListener('dblclick', (e) => this.dblCb?.(e.offsetX, e.offsetY, e));
  }

  touched() { this.lastMove = performance.now(); this.interactCb?.(); }

  onDown(e) {
    if (!this.enabled) return;
    this.dom.setPointerCapture?.(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.tween = null;
    this.spin.set(0, 0, 0);
    if (this.pointers.size === 1) {
      const pan = e.button === 2 || e.button === 1 || e.shiftKey || e.ctrlKey || e.metaKey;
      this.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t0: performance.now(), pan, moved: 0, lastT: performance.now(), vx: 0, vy: 0, button: e.button };
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.drag = { pinch: true, d0: Math.hypot(a.x - b.x, a.y - b.y), dist0: this.dist, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, moved: 99 };
    }
    this.touched();
  }

  onMove(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p) {
      if (e.pointerType === 'mouse') this.hoverCb?.(e.offsetX, e.offsetY, e);
      return;
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    const drag = this.drag;
    if (!drag) return;
    if (drag.pinch && this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      this.dist = THREE.MathUtils.clamp(drag.dist0 * (drag.d0 / Math.max(d, 1)), this.minDist, this.maxDist);
      this.panPixels(mx - drag.mx, my - drag.my);
      drag.mx = mx; drag.my = my;
      this.touched();
      return;
    }
    if (drag.id !== e.pointerId) return;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    const now = performance.now();
    if (drag.pan) this.panPixels(dx, dy);
    else {
      const h = this.dom.clientHeight || 600;
      const k = (Math.PI * 1.15) / h;                 // a full-height drag ~ 207 degrees
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        this._v.set(dy, dx, 0).divideScalar(len);
        this._q.setFromAxisAngle(this._v, -len * k);
        this.quat.multiply(this._q);
        const dtm = Math.max(1, now - drag.lastT) / 1000;
        const w = (len * k) / dtm;
        drag.vx = THREE.MathUtils.lerp(drag.vx, (dy / len) * w, 0.5);
        drag.vy = THREE.MathUtils.lerp(drag.vy, (dx / len) * w, 0.5);
      }
    }
    drag.lastT = now;
    this.apply();
    this.touched();
  }

  onUp(e, cancelled = false) {
    const had = this.pointers.delete(e.pointerId);
    this.dom.releasePointerCapture?.(e.pointerId);
    const drag = this.drag;
    if (!had || !drag) return;
    if (drag.pinch) { if (this.pointers.size < 2) this.drag = null; return; }
    if (drag.id !== e.pointerId) return;
    this.drag = null;
    const dt = performance.now() - drag.t0;
    if (!cancelled && drag.moved < 5 && dt < 450 && drag.button !== 2) { this.tapCb?.(e.offsetX, e.offsetY, e); return; }
    if (!drag.pan && performance.now() - drag.lastT < 70) {
      this.spin.set(drag.vx, drag.vy, 0).clampLength(0, 5);
    }
  }

  onWheel(e) {
    if (!this.enabled) return;
    e.preventDefault();
    this.tween = null;
    const k = e.ctrlKey ? 0.012 : 0.0013;
    const unit = e.deltaMode === 1 ? 33 : 1;
    this.dist = THREE.MathUtils.clamp(this.dist * Math.exp(e.deltaY * unit * k), this.minDist, this.maxDist);
    this.apply();
    this.touched();
  }

  panPixels(dx, dy) {
    const h = this.dom.clientHeight || 600;
    const k = (2 * this.dist * Math.tan((this.camera.fov * D2R) / 2)) / h;
    const right = this._v.set(1, 0, 0).applyQuaternion(this.quat);
    const up = this._w.set(0, 1, 0).applyQuaternion(this.quat);
    this.target.addScaledVector(right, -dx * k).addScaledVector(up, dy * k);
  }

  nudge(dx, dy) {
    this.tween = null;
    this._v.set(dy, dx, 0);
    const len = this._v.length();
    if (!len) return;
    this._q.setFromAxisAngle(this._v.divideScalar(len), -len);
    this.quat.multiply(this._q);
    this.apply();
    this.touched();
  }

  zoomBy(f) { this.goTo({ dist: THREE.MathUtils.clamp(this.dist * f, this.minDist, this.maxDist) }, 220); }

  /** Remove accumulated roll: keep the same view direction with world +Y as screen-up. */
  level(ms = 500) {
    const fwd = this._v.set(0, 0, -1).applyQuaternion(this.quat);
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(), fwd, AX.y);
    if (Math.abs(fwd.y) > 0.999) return;
    this.goTo({ quat: new THREE.Quaternion().setFromRotationMatrix(m) }, ms);
  }
}
