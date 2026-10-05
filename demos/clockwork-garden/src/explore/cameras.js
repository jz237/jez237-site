import * as THREE from 'three';
import { clamp, lerp, smooth } from '../core/ease.js';

// Cameras for the interactive modes.
//   ChaseCam   third-person flight camera: the view yaw/pitch is the pilot's
//              look; the bee turns to fly where you look. Lags slightly
//              behind the bee for momentum, widens with speed, never sits
//              inside a solid (a spring arm against the collision world).
//   FollowCam  cinematic auto-camera for follow mode: picks framings from
//              what APX-9 is doing, glides between them, can be orbited and
//              zoomed by the viewer and drifts back to its framing.
//   PhotoCam   free camera for photo mode.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function lookDir(yaw, pitch, target = V()) {
  return target.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
}

export class ChaseCam {
  constructor(bounds) {
    this.bounds = bounds;
    this.yaw = 0;
    this.pitch = -0.12;
    this.dist = 7.5;
    this.zoom = 1;
    this.pos = V();
    this.target = V();
    this.anchor = V();
    this.fov = 52;
    this.roll = 0;
    this.ready = false;
  }

  reset(actor, yaw = actor.yaw, pitch = -0.12) {
    this.yaw = yaw;
    this.pitch = pitch;
    this.anchor.copy(actor.pos);
    this.ready = false;
  }

  update(dt, actor, input, reduced) {
    if (input) {
      this.yaw -= input.look.dx;
      this.pitch = clamp(this.pitch - input.look.dy, -1.2, 1.15);
      this.zoom = clamp(this.zoom / input.zoom, 0.45, 3.2);
    }
    const sp = actor.speed;
    // the anchor trails the bee a little: speed reads as motion, not a lock-on
    this.anchor.lerp(actor.pos, damp(reduced ? 6 : 9, dt));
    const dir = lookDir(this.yaw, this.pitch, V());
    const dist = (this.dist + clamp(sp / 64, 0, 1) * 3.5) * this.zoom;
    const pivot = this.anchor.clone().add(V(0, 0.9, 0));
    const want = pivot.clone().addScaledVector(dir, -dist).add(V(0, 0.9 * this.zoom, 0));
    const safe = this.bounds.sweep(pivot, want, 0.75);
    this.bounds.pushOut(safe, 0.6);
    if (!this.ready) { this.pos.copy(safe); this.ready = true; }
    // pull in fast (never through a solid), ease back out slowly
    const pullIn = safe.distanceTo(pivot) < this.pos.distanceTo(pivot);
    this.pos.lerp(safe, damp(pullIn ? 22 : 7, dt));
    this.target.copy(pivot).addScaledVector(dir, 4.0);
    const fovT = 52 + (reduced ? 0 : clamp((sp - 20) / 44, 0, 1) * 12 * actor.boostK + clamp(sp / 30, 0, 1) * 2);
    this.fov += (fovT - this.fov) * damp(3, dt);
    this.roll += ((reduced ? 0 : -actor.bank * 0.22) - this.roll) * damp(4, dt);
    return { pos: this.pos, target: this.target, fov: this.fov, roll: this.roll, focus: this.pos.distanceTo(actor.pos), aperture: 1.6 };
  }
}

// ---------------------------------------------------------------------------
const FRAMINGS = {
  // relative to the bee's heading: side angle (rad, 0 = behind), distance, height
  chase: { a: 0.55, d: 10, h: 2.6, fov: 44, ap: 2.0 },
  profile: { a: 1.5, d: 9, h: 1.2, fov: 40, ap: 3.0 },
  high: { a: 0.9, d: 18, h: 11, fov: 46, ap: 1.0 },
  lead: { a: 2.6, d: 11, h: 1.8, fov: 42, ap: 2.5 },
  low: { a: 0.3, d: 8, h: -2.2, fov: 44, ap: 2.2 },
  macro: { a: 1.1, d: 6.2, h: 2.6, fov: 38, ap: 4.5, orbit: 0.16 },
  wide: { a: 0.7, d: 34, h: 16, fov: 48, ap: 0.6 },
};

export class FollowCam {
  constructor(bounds) {
    this.bounds = bounds;
    this.pos = V(0, 30, 60);
    this.target = V(0, 30, 0);
    this.fov = 44;
    this.aperture = 2;
    this.user = { yaw: 0, pitch: 0, zoom: 1, idle: 99 };
    this.shot = 'chase';
    this.shotT = 0;
    this.side = 1;
    this.orbitA = 0;
    this.ready = false;
    this.headingS = 0;
    this.rng = 1;
  }

  _rand() { this.rng = (this.rng * 16807) % 2147483647; return this.rng / 2147483647; }

  reset(actor) {
    this.ready = false;
    this.headingS = actor.yaw;
    this.user = { yaw: 0, pitch: 0, zoom: 1, idle: 99 };
  }

  choose(actor) {
    const s = actor.state;
    let next = this.shot;
    if (s === 'landed' || s === 'landing') next = 'macro';
    else if (s === 'docking' || s === 'walk-in' || s === 'inside' || s === 'walk-out') next = 'skep';
    else if (this.shotT > 7 + this._rand() * 5 || this.shot === 'macro' || this.shot === 'skep') {
      const r = this._rand();
      next = actor.speed > 30 ? (r < 0.35 ? 'chase' : r < 0.55 ? 'high' : r < 0.75 ? 'wide' : 'profile') : (r < 0.3 ? 'chase' : r < 0.55 ? 'profile' : r < 0.7 ? 'lead' : r < 0.85 ? 'low' : 'high');
      if (next === this.shot) next = 'chase';
      this.side = this._rand() < 0.5 ? -1 : 1;
    }
    if (next !== this.shot) { this.shot = next; this.shotT = 0; }
  }

  update(dt, actor, input, ctx) {
    this.shotT += dt;
    this.choose(actor);
    const reduced = ctx.reduced;
    // viewer orbit / zoom, drifting back to the framing when left alone
    if (input) {
      const moved = Math.abs(input.orbit.dx) + Math.abs(input.orbit.dy) > 0.5 || Math.abs(input.zoom - 1) > 1e-3;
      this.user.yaw -= input.orbit.dx * 0.006;
      this.user.pitch = clamp(this.user.pitch + input.orbit.dy * 0.004, -0.9, 1.0);
      this.user.zoom = clamp(this.user.zoom / input.zoom, 0.35, 4);
      this.user.idle = moved ? 0 : this.user.idle + dt;
    }
    if (this.user.idle > 3.2) {
      const k = damp(0.5, dt);
      this.user.yaw *= 1 - k;
      this.user.pitch *= 1 - k;
      this.user.zoom += (1 - this.user.zoom) * k;
    }
    // smoothed heading so framings don't whip round with every correction
    const hv = Math.hypot(actor.vel.x, actor.vel.z);
    const head = hv > 3 ? Math.atan2(actor.vel.x, actor.vel.z) : actor.yaw;
    this.headingS += wrap(head - this.headingS) * damp(reduced ? 0.8 : 1.4, dt);
    const bee = actor.pos;
    let want, tgt, fov, ap;
    if (this.shot === 'skep') {
      const s = ctx.skep;
      want = s.board.clone().addScaledVector(s.out, 15).addScaledVector(s.side, 7 * this.side).add(V(0, 5.5, 0));
      tgt = s.board.clone().lerp(bee, 0.5).add(V(0, 1.6, 0));
      fov = 38; ap = 3;
      const ur = this.user;
      if (ur.yaw || ur.pitch || ur.zoom !== 1) {
        const off = want.clone().sub(tgt).multiplyScalar(ur.zoom).applyAxisAngle(UP, ur.yaw);
        off.y += ur.pitch * off.length() * 0.6;
        want = tgt.clone().add(off);
      }
    } else {
      let f = FRAMINGS[this.shot];
      if (this.shot === 'macro') {
        // look down into the bloom's cup from just above its rim
        const l = actor.lastLanding && actor.state === 'landed' ? actor.lastLanding : actor.seq?.landable;
        const R = l?.cupR ?? 5;
        // far-field blooms are deep cups: look in from steeply above the rim
        const d = Math.max(f.d, R * 1.05), el = l?.kind === 'flora' ? 0.92 : 0.62;
        f = { ...f, d: d * Math.cos(el), h: d * Math.sin(el) };
      }
      if (f.orbit) this.orbitA += dt * f.orbit * (reduced ? 0.5 : 1);
      const a = this.headingS + Math.PI + this.side * f.a + (f.orbit ? this.orbitA : 0) + this.user.yaw;
      const d = Math.hypot(f.d, f.h) * this.user.zoom;
      const el = Math.atan2(f.h, f.d) + this.user.pitch;
      want = bee.clone().add(V(Math.sin(a) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(a) * Math.cos(el) * d));
      // look a little ahead of a flying bee
      tgt = bee.clone().addScaledVector(actor.vel, this.shot === 'macro' ? 0 : 0.18).add(V(0, 0.5, 0));
      fov = f.fov; ap = f.ap;
    }
    const safe = this.bounds.sweep(bee.clone().add(V(0, 0.8, 0)), want, 0.9);
    this.bounds.pushOut(safe, 0.7);
    if (!this.ready) { this.pos.copy(safe); this.target.copy(tgt); this.ready = true; }
    const rate = (reduced ? 0.9 : 1.6) * (this.user.idle < 0.3 ? 4 : 1);
    const pullIn = safe.distanceTo(bee) < this.pos.distanceTo(bee) - 0.5;
    this.pos.lerp(safe, damp(pullIn ? 9 : rate, dt));
    this.target.lerp(tgt, damp(reduced ? 3 : 5, dt));
    this.fov += (fov - this.fov) * damp(1.5, dt);
    this.aperture += (ap - this.aperture) * damp(1.5, dt);
    return { pos: this.pos, target: this.target, fov: this.fov, roll: 0, focus: this.pos.distanceTo(bee), aperture: this.aperture };
  }
}

// ---------------------------------------------------------------------------
export class PhotoCam {
  constructor(bounds) {
    this.bounds = bounds;
    this.pos = V();
    this.yaw = 0;
    this.pitch = 0;
    this.fov = 45;
    this.vel = V();
    this.aperture = 0;
    this.focus = 10;
  }
  from(view) {
    this.pos.copy(view.pos);
    const d = view.target.clone().sub(view.pos).normalize();
    this.yaw = Math.atan2(d.x, d.z);
    this.pitch = Math.asin(clamp(d.y, -1, 1));
    this.fov = view.fov;
    this.vel.set(0, 0, 0);
  }
  update(dt, input) {
    this.yaw -= input.look.dx + input.orbit.dx * 0.005;
    this.pitch = clamp(this.pitch - input.look.dy - input.orbit.dy * 0.004, -1.45, 1.45);
    this.fov = clamp(this.fov / input.zoom, 12, 90);
    const f = lookDir(this.yaw, this.pitch, V());
    const r = V(-Math.cos(this.yaw), 0, Math.sin(this.yaw));
    const sp = input.boost ? 40 : 12;
    const want = f.multiplyScalar(input.move.y * sp).addScaledVector(r, input.move.x * sp).add(V(0, input.lift * sp * 0.7, 0));
    this.vel.lerp(want, damp(5, dt));
    this.pos.addScaledVector(this.vel, dt);
    this.bounds.pushOut(this.pos, 0.3);
    const target = this.pos.clone().add(lookDir(this.yaw, this.pitch, V()));
    return { pos: this.pos, target, fov: this.fov, roll: 0, focus: this.focus, aperture: this.aperture };
  }
}
