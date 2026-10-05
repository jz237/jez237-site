import * as THREE from 'three';
import { clamp, lerp, smooth, smoother } from '../core/ease.js';
import { groundHeight } from './bounds.js';

// APX-9 as a flying body. One actor serves both the player (fly mode) and
// the autopilot (follow mode): each frame it receives an intent (desired
// velocity, facing, boost, and requests to land / take off / dock) and
// either integrates bee-like flight with momentum and soft collisions, or
// plays a kinematic sequence (settling on a bloom, gathering pollen, taking
// off, walking into the skep to deposit pollen and back out).

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const TAU = Math.PI * 2;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export const BEE_RADIUS = 1.25;
export const SPEED = { cruise: 24, boost: 64, climb: 16, hover: 0 };

export class BeeActor {
  constructor({ bee, bounds, skep, events }) {
    this.bee = bee; // APX9Bee rig
    this.bounds = bounds;
    this.skep = skep; // { board, inside, out, entrance, face }
    this.events = events; // (name, data) => void
    this.pos = V();
    this.vel = V();
    this.acc = V();
    this.yaw = 0; // body heading
    this.pitch = 0; // body pitch (visual)
    this.bank = 0;
    this.state = 'fly';
    this.stateT = 0;
    this.pollen = 0;
    this.flap = 1;
    this.grip = 0;
    this.fold = 0;
    this.walk = null;
    this.boostK = 0;
    this.time = 0;
    this.contact = null;
    this.seq = null; // kinematic sequence data
    this.lastLanding = null;
  }

  place(pos, yaw, state = 'fly') {
    this.pos.copy(pos);
    this.vel.set(0, 0, 0);
    this.yaw = yaw;
    this.state = state;
    this.stateT = 0;
  }

  get speed() { return this.vel.length(); }
  get busy() { return this.state !== 'fly' && this.state !== 'grounded'; }
  forward(target = V()) { return target.set(Math.sin(this.yaw), 0, Math.cos(this.yaw)); }

  // ---- sequences -------------------------------------------------------------
  land(landable) {
    if (this.busy) return false;
    const spot = landable.spot.clone();
    const d = this.pos.distanceTo(spot);
    // approach from above: a short arc that settles onto the spot
    const mid = this.pos.clone().lerp(spot, 0.6).add(V(0, Math.min(3, d * 0.25) + 0.8, 0));
    const face = landable.face ? Math.atan2(landable.face.x, landable.face.z) : Math.atan2(spot.x - this.pos.x, spot.z - this.pos.z);
    this.seq = { from: this.pos.clone(), mid, to: spot, dur: clamp(0.35 + d * 0.06, 0.5, 1.1), yaw0: this.yaw, yaw1: Number.isFinite(face) ? face : this.yaw, landable };
    this._set('landing');
    return true;
  }

  takeoff() {
    if (this.state !== 'landed' && this.state !== 'grounded') return false;
    this.seq = { from: this.pos.clone(), dur: 0.35 };
    this._set('takeoff');
    return true;
  }

  dock() {
    if (this.busy) return false;
    const s = this.skep;
    const d = this.pos.distanceTo(s.board);
    const mid = this.pos.clone().lerp(s.board, 0.5).add(V(0, 1.2, 0));
    this.seq = { from: this.pos.clone(), mid, to: s.board.clone(), dur: clamp(0.4 + d * 0.07, 0.6, 1.4), yaw0: this.yaw, yaw1: Math.atan2(s.inside.x - s.board.x, s.inside.z - s.board.z) };
    this._set('docking');
    return true;
  }

  _set(state) {
    this.state = state;
    this.stateT = 0;
    this.events?.(state, this);
  }

  // ---- per-frame ------------------------------------------------------------------
  // intent: { vel: Vector3 (desired), face: yaw|null, boost: 0..1, lift: -1..1 }
  step(dt, intent) {
    this.time += dt;
    this.stateT += dt;
    const s = this.state;
    if (s === 'fly') this._fly(dt, intent);
    else if (s === 'grounded') this._grounded(dt, intent);
    else this._sequence(dt, intent);
    this._pose(dt);
  }

  _fly(dt, intent) {
    const want = intent.vel;
    this.boostK += ((intent.boost ? 1 : 0) - this.boostK) * (1 - Math.exp(-dt * 4));
    // bees accelerate and stop hard but still carry momentum
    const agility = want.lengthSq() > 1 ? 2.6 + this.boostK * 0.4 : 3.2;
    const prev = this._prevVel || (this._prevVel = V());
    prev.copy(this.vel);
    this.vel.lerp(want, 1 - Math.exp(-agility * dt));
    // a gentle hover drift so a still bee is never frozen in space
    const t = this.time;
    this.vel.x += Math.sin(t * 1.3) * 0.25 * dt;
    this.vel.y += Math.sin(t * 2.1 + 1) * 0.35 * dt;
    this.vel.z += Math.cos(t * 1.7) * 0.25 * dt;
    this.pos.addScaledVector(this.vel, dt);
    this.contact = this.bounds.collide(this.pos, this.vel, BEE_RADIUS, dt, { cushion: 1.6, stiffness: 70 });
    this.acc.subVectors(this.vel, prev).multiplyScalar(1 / Math.max(dt, 1e-3));
    // heading: toward the requested facing, else along travel
    const hv = Math.hypot(this.vel.x, this.vel.z);
    let face = intent.face;
    if (face == null && hv > 2) face = Math.atan2(this.vel.x, this.vel.z);
    if (face != null) {
      const dy = wrap(face - this.yaw);
      this.yawRate = clamp(dy * 6, -5, 5);
      this.yaw += this.yawRate * dt;
    } else this.yawRate = 0;
    // touch down on the ground when sinking slowly onto it
    const g = groundHeight(this.pos.x, this.pos.z);
    if (this.pos.y - g < BEE_RADIUS + 0.25 && hv < 5 && this.vel.y < 1.5 && (intent.lift ?? 0) <= 0 && want.lengthSq() < 30) {
      this.pos.y = g + BEE_RADIUS;
      this.vel.set(0, 0, 0);
      this._set('grounded');
    }
  }

  _grounded(dt, intent) {
    const g = groundHeight(this.pos.x, this.pos.z);
    this.pos.y += (g + BEE_RADIUS - this.pos.y) * (1 - Math.exp(-dt * 10));
    // shuffle along the ground on gentle input; any lift takes off
    const want = intent.vel;
    if ((intent.lift ?? 0) > 0.1 || want.y > 2 || Math.hypot(want.x, want.z) > 9) {
      this.vel.set(want.x * 0.3, Math.max(6, want.y), want.z * 0.3);
      this.pos.y += 0.3;
      this._set('fly');
      return;
    }
    if (intent.face != null) this.yaw += wrap(intent.face - this.yaw) * (1 - Math.exp(-dt * 4));
    const h = Math.hypot(want.x, want.z);
    if (h > 0.5) {
      const k = Math.min(1, h / 8) * 2.2;
      this.pos.x += (want.x / h) * k * dt;
      this.pos.z += (want.z / h) * k * dt;
      this.walkPhase = (this.walkPhase || 0) + k * dt * 1.2;
    }
    this.vel.set(0, 0, 0);
    this.bounds.collide(this.pos, this.vel, BEE_RADIUS, dt, { cushion: 0.2 });
  }

  _sequence(dt, intent) {
    const q = this.seq;
    const s = this.state;
    const k = clamp(this.stateT / (q?.dur || 1));
    if (s === 'landing' || s === 'docking') {
      const e = smoother(k);
      // quadratic Bézier from → mid → to
      const a = q.from.clone().lerp(q.mid, e), b = q.mid.clone().lerp(q.to, e);
      const prev = this.pos.clone();
      this.pos.copy(a.lerp(b, e));
      this.vel.subVectors(this.pos, prev).multiplyScalar(1 / Math.max(dt, 1e-3));
      this.yaw = q.yaw0 + wrap(q.yaw1 - q.yaw0) * smooth(clamp(k * 1.4));
      if (k >= 1) {
        this.vel.set(0, 0, 0);
        if (s === 'landing') {
          this.lastLanding = q.landable;
          this.gather = { t: 0, amount: Math.min(q.landable.pollen, 1 - this.pollen), from: this.pollen };
          this._set('landed');
          this.events?.('touchdown', q.landable);
        } else {
          this.seq = { dur: 1.2, from: this.skep.board.clone(), to: this.skep.inside.clone() };
          this._set('walk-in');
        }
      }
    } else if (s === 'landed') {
      // gather pollen while standing on the anthers
      const gth = this.gather;
      if (gth) {
        gth.t += dt;
        const gk = smooth(clamp(gth.t / 1.5));
        this.pollen = gth.from + gth.amount * gk;
        if (gth.t >= 1.5 && !gth.done) { gth.done = true; this.events?.('gathered', this.lastLanding); }
      }
      this.vel.set(0, 0, 0);
      const t = this.stateT;
      // tiny settle bounce and a nibbling sway
      this.pos.y = q.to.y + Math.exp(-t * 6) * Math.sin(t * 20) * 0.08 + Math.abs(Math.sin(t * 5)) * 0.03;
    } else if (s === 'takeoff') {
      this.pos.copy(q.from).add(V(0, smooth(k) * 2.2, 0));
      this.vel.set(0, 6, 0);
      if (k >= 1) {
        this.vel.set(Math.sin(this.yaw) * 4, 7, Math.cos(this.yaw) * 4);
        this.gather = null;
        this._set('fly');
      }
    } else if (s === 'walk-in') {
      this.pos.lerpVectors(q.from, q.to, smooth(k));
      this.walkPhase = this.stateT * 3;
      if (k >= 1) {
        this.seq = { dur: 1.6, drained: this.pollen };
        this._set('inside');
        this.events?.('deposit', { amount: this.pollen });
      }
    } else if (s === 'inside') {
      this.pollen = q.drained * (1 - smooth(k));
      if (k >= 1) {
        this.pollen = 0;
        this.seq = { dur: 1.1, from: this.skep.inside.clone(), to: this.skep.board.clone() };
        this._set('walk-out');
      }
    } else if (s === 'walk-out') {
      this.pos.lerpVectors(q.from, q.to, smooth(k));
      this.walkPhase = this.stateT * 3;
      this.yaw = Math.atan2(q.to.x - q.from.x, q.to.z - q.from.z);
      if (k >= 1) {
        this.seq = { from: this.pos.clone(), dur: 0.5 };
        this._set('takeoff');
      }
    }
  }

  _pose(dt) {
    const s = this.state;
    const sp = this.speed;
    const ease = (cur, tgt, rate) => cur + (tgt - cur) * (1 - Math.exp(-dt * rate));
    let flapT = 1, gripT = 0, foldT = 0, walk = null;
    if (s === 'landed') { flapT = this.stateT < 0.4 ? 1 : 0; gripT = 1; foldT = this.stateT > 0.6 ? 0.7 : 0; if (this.stateT > 0.8 && this.stateT < 2.2) walk = this.stateT * 1.6; }
    else if (s === 'grounded') { flapT = 0.0; gripT = 1; foldT = 0.6; if (this.walkPhase !== undefined && this._lastWalk !== this.walkPhase) walk = this.walkPhase; this._lastWalk = this.walkPhase; }
    else if (s === 'walk-in' || s === 'walk-out' || s === 'inside') { flapT = 0; gripT = 1; foldT = 1; walk = s === 'inside' ? null : this.walkPhase; }
    else if (s === 'landing' || s === 'docking') { gripT = smooth(clamp(this.stateT / (this.seq?.dur || 1) * 1.3 - 0.3)); }
    else if (s === 'takeoff') { gripT = 1 - clamp(this.stateT / 0.3); }
    else {
      // legs dangle toward the ground when flying low and slow
      const g = this.pos.y - groundHeight(this.pos.x, this.pos.z);
      gripT = clamp(1 - (g - 1.6) / 2.5) * clamp(1 - sp / 8);
    }
    this.flap = ease(this.flap, flapT, 8);
    this.grip = ease(this.grip, gripT, 7);
    this.fold = ease(this.fold, foldT, 3);
    this.walk = walk;
    // body attitude: nose dips when accelerating forward, banks into turns
    const fwd = this.forward(V());
    const right = V(fwd.z, 0, -fwd.x);
    const flying = s === 'fly' || s === 'landing' || s === 'docking' || s === 'takeoff';
    const aF = flying ? this.acc.dot(fwd) : 0;
    const aR = flying ? this.acc.dot(right) : 0;
    const vF = flying ? this.vel.dot(fwd) : 0;
    const pitchT = clamp(-aF * 0.012 - vF * 0.004, -0.45, 0.35) + (flying ? clamp(-this.vel.y * 0.012, -0.25, 0.25) : 0);
    const bankT = flying ? clamp(-aR * 0.012 + (this.yawRate || 0) * -0.12, -0.6, 0.6) : 0;
    this.pitch = ease(this.pitch, pitchT, 5);
    this.bank = ease(this.bank, bankT, 5);
    this.freq = 21.5 + Math.min(sp, 70) * 0.06 + this.boostK * 3;
    // pollen drum: spins up and draws motes only while gathering
    const gathering = s === 'landed' && this.gather && this.gather.t < 1.6 && this.gather.amount > 0.001 ? 1 : 0;
    this.collect = ease(this.collect || 0, gathering, 6);
    this.brushAngle = (this.brushAngle || 0) + dt * (2 + this.collect * 14);
  }

  // write the rig: position, attitude and pose
  apply(reduced = false) {
    const g = this.bee.group;
    const bob = this.state === 'fly' ? Math.sin(this.time * 2.6) * 0.06 + Math.sin(this.time * 4.3) * 0.025 : 0;
    g.position.copy(this.pos);
    g.position.y += bob;
    g.rotation.set(this.pitch, this.yaw, this.bank * (reduced ? 0.6 : 1), 'YXZ');
    this.bee.setPose({ t: this.time, flap: this.flap, grip: this.grip, fold: this.fold, walk: this.walk, pollen: this.pollen, freq: this.freq, collect: this.collect, brush: this.brushAngle, fan: 0.3, look: this.state === 'landed' ? Math.sin(this.time * 1.7) * 0.15 : 0 });
  }
}
