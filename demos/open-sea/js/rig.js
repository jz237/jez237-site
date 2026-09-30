// Camera control: slow cinematic tour (yacht-relative keyframes), then free flight, boat orbit and dive orbit.
import { clamp, lerp, smoothstep } from './math.js';
import { DeckWalker } from './deck.js';

const DEG = Math.PI / 180;

// Catmull-Rom through numeric arrays
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

// Keyframes in the yacht frame: [time, fx (forward), fz (starboard), h (m above surface; <0 underwater), lookFx, lookFz, lookH, fovDeg]
const TOUR = [
 [0,45,-80,12,0,0,17,42],
 [14,12,-65,15,0,0,17,44],
 [28,-12,-70,20,0,0,16,46],
 [42,-40,-80,23,-2,0,16,48],
 [56,-80,-18,28,-2,0,15,48],
 [70,-75,28,17,-6,0,13,50],
 [82,-46,16,8,-12,0,7,54],
 [94,-15,15,4,-5,0,4,58],
 [102,8,15,-3,2,0,-1,60],
 [112,6,18,-8,0,0,-4,62],
 [124,-10,20,-7,-4,0,-3,62],
 [135,-35,45,9,-2,0,12,56],
 [148,30,93,31,0,0,17,48],
 [162,110,85,12,0,0,17,44],
 [172,132,82,6,0,0,17,42],
];
export const TOUR_LENGTH = TOUR[TOUR.length - 1][0];

export class Rig {
  constructor(app, dom) {
    this.app = app;
    this.mode = 'tour';
    this.t = 0;
    this.keys = new Set();
    this.vel = [0, 0, 0];
    this.speed = 10;
    this.orbit = { az: 2.4, el: 0.28, dist: 95 };
    this.dive = { az: 0.6, el: 0.12, dist: 28, depth: -7 };
    this.drag = null;
    this.touches = new Map();
    this.onChange = null;
    this.lastInput = 0;
    this.shake = 0;
    this.deck = new DeckWalker(app.yacht);
    this.bind(dom);
  }

  setMode(m, keepPose = true) {
    if (m === this.mode) return;
    const cam = this.app.cam, y = this.app.yacht;
    if(this.mode==='deck'){delete cam.forward;delete cam.up;this.deck.stick=[0,0];}
    this.mode = m;
    if(m==='deck'){this.app.yachtOn=true;this.deck.board(cam);this.syncDeckCamera();this.pinch=this.rise=0;}
    if (m === 'fly') { this.vel = [0, 0, 0]; }
    if (m === 'boat') {
      const dx = cam.x - y.x, dz = cam.z - y.z, d = Math.hypot(dx, dz);
      this.orbit.az = Math.atan2(dz, dx) - y.psi; this.orbit.dist = clamp(Math.hypot(d,cam.y-13),35,240); this.orbit.el = clamp(Math.atan2(cam.y - 2, d), 0.05, 1.3);
      if (this.orbit.dist > 150) this.orbit.dist = 95;
    }
    if (m === 'dive') { this.dive.az = 0.6; this.dive.el = 0.12; this.dive.dist = 28; this.dive.depth = -7; }
    if (m === 'tour') { this.t = 0; this._init = false; this._init2 = false; }
    if (this.onChange) this.onChange(m);
  }

  // Cut to the next shot of the tour (from any mode).
  nextShot() {
    if (this.mode !== 'tour') this.setMode('tour');
    const T = this.t % TOUR_LENGTH;
    const next = TOUR.find(k => k[0] > T + 2) || TOUR[0];
    this.t = next[0];
    this._init = false; this._init2 = false;      // snap to the new pose instead of gliding
  }

  takeOver() { if (this.mode === 'tour') this.setMode('fly'); this.lastInput = performance.now(); }

  bind(dom) {
    addEventListener('keydown', e => {
      if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.key.length === 1 && e.key !== ' ') return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e', 'c', ' ', 'shift', 'control', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        if (this.mode === 'tour') this.takeOver();
        this.keys.add(k);
        if (k.startsWith('arrow') || k === ' ') e.preventDefault();
      }
    });
    addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
    addEventListener('blur', () => {this.keys.clear();this.deck.stick=[0,0];});
    dom.addEventListener('pointerdown', e => {
      dom.setPointerCapture && dom.setPointerCapture(e.pointerId);
      this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY });
      if (this.mode === 'tour') this.takeOver();
      this.drag = { x: e.clientX, y: e.clientY };
    });
    dom.addEventListener('pointermove', e => {
      const t = this.touches.get(e.pointerId);
      if (!t) return;
      const dx = e.clientX - t.x, dy = e.clientY - t.y;
      t.x = e.clientX; t.y = e.clientY;
      if (this.touches.size >= 2) {
        if(this.mode==='deck')return;
        // two fingers: pinch = move, vertical drag = altitude
        const pts = [...this.touches.values()];
        const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), d0 = Math.hypot(pts[0].px - pts[1].px, pts[0].py - pts[1].py);
        this.pinch = (d - d0) * 0.06;
        for (const p of pts) { p.px = p.x; p.py = p.y; }
        this.rise = -dy * 0.05;
        return;
      }
      this.look(dx, dy);
    });
    const up = e => { this.touches.delete(e.pointerId); if (!this.touches.size) this.drag = null; this.pinch = 0; this.rise = 0; };
    dom.addEventListener('pointerup', up); dom.addEventListener('pointercancel', up);
    dom.addEventListener('wheel', e => {
      e.preventDefault();
      if (this.mode === 'tour') this.takeOver();
      const f = Math.exp(e.deltaY * 0.0012);
      if (this.mode === 'boat') this.orbit.dist = clamp(this.orbit.dist * f, 5, 220);
      else if(this.mode==='deck')this.deck.walkSpeed=clamp(this.deck.walkSpeed/f,1,3);
      else if (this.mode === 'dive') this.dive.dist = clamp(this.dive.dist * f, 2.5, 60);
      else this.speed = clamp(this.speed / f, 1.5, 600);
      if (this.onSpeed) this.onSpeed(this.speed);
    }, { passive: false });
    dom.addEventListener('contextmenu', e => e.preventDefault());
  }

  look(dx, dy) {
    const s = 0.0032;
    if(this.mode==='deck'){this.deck.yaw+=dx*s;this.deck.pitch=clamp(this.deck.pitch-dy*s,-1.45,1.45);this.syncDeckCamera();}
    else if (this.mode === 'boat') { this.orbit.az -= dx * s * 1.2; this.orbit.el = clamp(this.orbit.el + dy * s, 0.02, 1.45); }
    else if (this.mode === 'dive') { this.dive.az -= dx * s * 1.2; this.dive.el = clamp(this.dive.el - dy * s, -1.2, 1.3); }
    else {
      const c = this.app.cam;
      c.yaw += dx * s * (c.fov / 0.9); c.pitch = clamp(c.pitch - dy * s * (c.fov / 0.9), -1.55, 1.55);
    }
  }

  tourPose() {
    const T = Math.min(this.t, TOUR_LENGTH - 0.0001);
    let i = 0;
    while (i < TOUR.length - 2 && TOUR[i + 1][0] <= T) i++;
    const k0 = TOUR[Math.max(0, i - 1)], k1 = TOUR[i], k2 = TOUR[i + 1], k3 = TOUR[Math.min(TOUR.length - 1, i + 2)];
    const u = clamp((T - k1[0]) / (k2[0] - k1[0]), 0, 1);
    const s = u * u * (3 - 2 * u) * 0.35 + u * 0.65;       // gentle ease between keys
    const out = [];
    for (let j = 1; j < 8; j++) out.push(cr(k0[j], k1[j], k2[j], k3[j], s));
    // The vertical FOV gives a much narrower horizontal view on a phone. Pull
    // overview cameras back around their target so the full jib and bowsprit fit; smoothly
    // remove this offset for the intentional deck close-ups and submerged shots.
    const aspect = this.app.w / this.app.h;
    const scale = 1 + Math.max(0, 1.04 / Math.max(aspect, 0.3) - 1) * smoothstep(7, 13, out[5]);
    out[0] = out[3] + (out[0] - out[3]) * scale;
    out[1] = out[4] + (out[1] - out[4]) * scale;
    return out;
  }

  syncDeckCamera(){if(this.mode==='deck')this.deck.syncCamera(this.app.cam);}

  update(dt) {
    const app = this.app, cam = app.cam, y = app.yacht;
    const K = this.keys;
    if(this.mode==='deck'){
      this.deck.update(dt,K);this.syncDeckCamera();
      cam.fov+=(66*DEG*(app.fovK||1)-cam.fov)*(1-Math.exp(-dt*3));
    } else if (this.mode === 'tour') {
      this.t += dt * (K.has('shift') ? 3 : 1);
      if (this.t >= TOUR_LENGTH) { this.setMode('fly'); return; }
      const [fx, fz, h, lx, lz, lh, fov] = this.tourPose();
      const c = Math.cos(y.psi), sn = Math.sin(y.psi);
      const wx = y.x + c * fx - sn * fz, wz = y.z + sn * fx + c * fz;
      const surf = app.surfaceAtCam || 0;
      // stay above the local wave crests; underwater keys track the surface
      let wy = h >= 1.2 ? Math.max(h + 0.0, surf + 0.9) : surf + h;
      if (h >= 0.6 && h < 1.2) wy = Math.max(surf + h, surf + 0.75);
      const tx = y.x + c * lx - sn * lz, tz = y.z + sn * lx + c * lz, ty = y.y + lh + (h < 0 ? 0 : 0);
      // damped following so probe latency never shows
      const k = 1 - Math.exp(-dt * 6);
      if (!this._init) { cam.x = wx; cam.y = wy; cam.z = wz; this._init = true; }
      cam.x += (wx - cam.x) * Math.min(1, k * 3); cam.z += (wz - cam.z) * Math.min(1, k * 3);
      cam.y += (wy - cam.y) * (h < 0 ? Math.min(1, k * 2) : Math.min(1, k * 3));
      const dx = tx - cam.x, dz = tz - cam.z, dy = ty - cam.y;
      const yaw = Math.atan2(dx, -dz), pitch = Math.atan2(dy, Math.hypot(dx, dz));
      const kk = this._init2 ? 1 - Math.exp(-dt * 4) : 1;
      let dyaw = Math.atan2(Math.sin(yaw - cam.yaw), Math.cos(yaw - cam.yaw));
      cam.yaw += dyaw * kk; cam.pitch += (pitch - cam.pitch) * kk;
      cam.fov += (fov * DEG * (app.fovK || 1) - cam.fov) * (1 - Math.exp(-dt * 2));
      this._init2 = true;
      // a breath of handheld drift
      const tt = app.time;
      cam.pitch += 0.0009 * Math.sin(tt * 0.9) ; cam.yaw += 0.0008 * Math.sin(tt * 0.63 + 1.0);
    } else if (this.mode === 'boat' || this.mode === 'dive') {
      const o = this.mode === 'boat' ? this.orbit : this.dive;
      if (K.has('a') || K.has('arrowleft')) o.az += dt * 0.9;
      if (K.has('d') || K.has('arrowright')) o.az -= dt * 0.9;
      if (K.has('w') || K.has('arrowup')) o.dist = Math.max(this.mode === 'boat' ? 5 : 2.5, o.dist * Math.exp(-dt * 0.9));
      if (K.has('s') || K.has('arrowdown')) o.dist = Math.min(this.mode === 'boat' ? 220 : 60, o.dist * Math.exp(dt * 0.9));
      if (this.pinch) { o.dist = clamp(o.dist * Math.exp(-this.pinch * 0.05), 3, 220); this.pinch = 0; }
      const a = y.psi + o.az;
      const surf = app.surfaceAtCam || 0;
      if (this.mode === 'boat') {
        const horiz = Math.cos(o.el) * o.dist;
        const tx = y.x + Math.cos(y.psi) * 0.4, tz = y.z + Math.sin(y.psi) * 0.4, ty = y.y + 13.0;
        const wy = Math.max(ty + Math.sin(o.el) * o.dist, surf + 0.8);
        const k = 1 - Math.exp(-dt * 8);
        cam.x += (tx + Math.cos(a) * horiz - cam.x) * k; cam.z += (tz + Math.sin(a) * horiz - cam.z) * k; cam.y += (wy - cam.y) * k;
        const dx = tx - cam.x, dz = tz - cam.z, dy = ty - cam.y;
        cam.yaw = Math.atan2(dx, -dz); cam.pitch = Math.atan2(dy, Math.hypot(dx, dz));
      } else {
        // dive: orbit a point under the hull, camera stays below the surface
        const tx = y.x, tz = y.z, ty = y.y + o.depth;
        const horiz = Math.cos(o.el) * o.dist;
        const wy = Math.min(ty + Math.sin(o.el) * o.dist, surf - 1.2);
        const k = 1 - Math.exp(-dt * 6);
        cam.x += (tx + Math.cos(a) * horiz - cam.x) * k; cam.z += (tz + Math.sin(a) * horiz - cam.z) * k; cam.y += (wy - cam.y) * k;
        const dx = tx - cam.x, dz = tz - cam.z, dy = (y.y + o.depth + 0.9) - cam.y;
        cam.yaw = Math.atan2(dx, -dz); cam.pitch = Math.atan2(dy, Math.hypot(dx, dz));
      }
      cam.fov += (54 * DEG * (app.fovK || 1) - cam.fov) * (1 - Math.exp(-dt * 3));
    } else {
      // free flight
      const f = [Math.sin(cam.yaw) * Math.cos(cam.pitch), Math.sin(cam.pitch), -Math.cos(cam.yaw) * Math.cos(cam.pitch)];
      const r = [Math.cos(cam.yaw), 0, Math.sin(cam.yaw)];
      let m = [0, 0, 0];
      const add = (v, s) => { m[0] += v[0] * s; m[1] += v[1] * s; m[2] += v[2] * s; };
      if (K.has('w')) add(f, 1); if (K.has('s')) add(f, -1);
      if (K.has('d')) add(r, 1); if (K.has('a')) add(r, -1);
      if (K.has('e') || K.has(' ')) m[1] += 1; if (K.has('q') || K.has('c')) m[1] -= 1;
      if (this.pinch) { add(f, this.pinch * 0.6); this.pinch = 0; }
      if (this.rise) { m[1] += this.rise * 0.5; this.rise = 0; }
      if (K.has('arrowleft')) cam.yaw -= dt * 1.1; if (K.has('arrowright')) cam.yaw += dt * 1.1;
      if (K.has('arrowup')) cam.pitch = clamp(cam.pitch + dt * 0.9, -1.55, 1.55); if (K.has('arrowdown')) cam.pitch = clamp(cam.pitch - dt * 0.9, -1.55, 1.55);
      const boost = (K.has('shift') ? 4 : 1) * (K.has('control') ? 0.25 : 1);
      const alt = Math.abs(cam.y);
      const sp = this.speed * boost * (1 + alt / 40);
      const ml = Math.hypot(m[0], m[1], m[2]) || 1;
      const target = [m[0] / ml * sp * (ml > 0.01 ? 1 : 0), m[1] / ml * sp * (ml > 0.01 ? 1 : 0), m[2] / ml * sp * (ml > 0.01 ? 1 : 0)];
      const k = 1 - Math.exp(-dt * 5);
      for (let i = 0; i < 3; i++) this.vel[i] += (target[i] - this.vel[i]) * k;
      cam.x += this.vel[0] * dt; cam.y += this.vel[1] * dt; cam.z += this.vel[2] * dt;
      cam.y = clamp(cam.y, -150, 6000);
      cam.fov += (54 * DEG * (app.fovK || 1) - cam.fov) * (1 - Math.exp(-dt * 3));
    }
  }
}
