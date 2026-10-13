import * as THREE from 'three';
import type {TailCollision} from './TailContacts';

/** A tapered articulated tail: gravity, inertia, muscle stiffness and unilateral contacts. */
export class TailDynamics {
  readonly points: THREE.Vector3[];
  private previous: THREE.Vector3[];
  private before: THREE.Vector3[];
  private beforeSegments: THREE.Vector3[];
  private normals: THREE.Vector3[];
  private root = new THREE.Vector3();
  private anchor = new THREE.Vector3();
  private lastStep = 1 / 120;
  private delta = new THREE.Vector3();
  private velocity = new THREE.Vector3();
  private baseTarget = new THREE.Vector3();
  private time = 0;

  constructor(readonly lengths: number[], readonly radii: number[], private collision: TailCollision) {
    this.points = lengths.map(() => new THREE.Vector3());
    this.previous = lengths.map(() => new THREE.Vector3());
    this.before = lengths.map(() => new THREE.Vector3());
    this.beforeSegments = lengths.map(() => new THREE.Vector3());
    this.normals = lengths.map(() => new THREE.Vector3());
  }

  reset(root: THREE.Vector3, back: THREE.Vector3) {
    this.root.copy(root); this.anchor.copy(root); this.lastStep = 1 / 120; this.time = 0;
    let p = root;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].copy(p).addScaledVector(back, this.lengths[i]);
      this.previous[i].copy(this.points[i]); p = this.points[i];
    }
    // Settle the initial pose with the same gravity/contact solver used during motion.
    for (let i = 0; i < 45; i++) this.update(1 / 120, root, back, 0);
    for (let i = 0; i < this.points.length; i++) this.previous[i].copy(this.points[i]);
  }

  update(dt: number, root: THREE.Vector3, back: THREE.Vector3, twitch: number) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps;
    const start = this.root.clone();
    for (let s = 1; s <= steps; s++) {
      this.time += h;
      this.collision.beginStep?.();
      this.anchor.lerpVectors(start, root, s / steps);
      const drag = Math.exp(-4 * h), ratio = h / this.lastStep;
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i]; this.before[i].copy(p); this.normals[i].set(0, 0, 0);
        this.velocity.subVectors(p, this.previous[i]).multiplyScalar(drag * ratio);
        this.velocity.clampLength(0, 1.4 * h);
        this.previous[i].copy(p); p.add(this.velocity); p.y -= 9.81 * h * h;
        if (twitch > 0 && i > 6) {
          const flick = Math.sin(this.time * 19 + i * 1.3) * twitch * .25 * h * h;
          p.x += -back.z * flick; p.z += back.x * flick;
        }
      }
      this.baseTarget.copy(this.anchor).addScaledVector(back, this.lengths[0]);
      this.contacts();
      for (let pass = 0; pass < 12; pass++) {
        // The thick base follows the hips; the thinner end has more freedom to sag.
        this.points[0].lerp(this.baseTarget, this.collision.touchesSolid ? .04 : .12);
        for (let i = 0; i < this.points.length; i++) this.lengthConstraint(i);
        for (let i = this.points.length - 1; i >= 0; i--) this.lengthConstraint(i);
        for (let i = 0; i < this.points.length - 1; i++) {
          const a = i === 0 ? this.anchor : this.points[i - 1], b = this.points[i + 1];
          const minimum = (this.lengths[i] + this.lengths[i + 1]) * (this.collision.touchesSolid ? .96 : .99);
          this.delta.subVectors(b, a);
          const length = this.delta.length();
          if (length >= minimum || length < .000001) continue;
          this.delta.multiplyScalar((minimum - length) / length * (this.collision.touchesSolid ? .5 : .9));
          if (i === 0) b.add(this.delta);
          else {a.addScaledVector(this.delta, -.5); b.addScaledVector(this.delta, .5);}
        }
        this.limitFold(back);
        if (pass % 3 === 2) this.contacts();
      }
      // Polish lengths after the bending constraints, then leave contacts as the
      // final operation so a length correction cannot put the skin inside wood.
      for (let pass = 0; pass < 30; pass++) {
        for (let i = this.points.length - 1; i >= 0; i--) this.lengthConstraint(i);
        for (let i = 0; i < this.points.length; i++) this.lengthConstraint(i);
        if (pass % 3 === 2) {
          this.contacts();
          const settled = this.points.every((p, i) => Math.abs(p.distanceTo(i === 0 ? this.anchor : this.points[i - 1]) - this.lengths[i]) < .001);
          if (settled) break;
        }
      }
      // Remove velocity into contacts and apply dry friction only where there is contact.
      for (let i = 0; i < this.points.length; i++) {
        const n = this.normals[i]; if (n.lengthSq() < .000001) continue;
        n.normalize(); this.velocity.subVectors(this.points[i], this.previous[i]);
        this.velocity.addScaledVector(n, -Math.min(0, this.velocity.dot(n)));
        this.velocity.multiplyScalar(Math.exp(-18 * h));
        this.previous[i].copy(this.points[i]).sub(this.velocity);
      }
      this.lastStep = h;
    }
    this.root.copy(root);
  }

  private lengthConstraint(i: number) {
    const a = i === 0 ? this.anchor : this.points[i - 1], b = this.points[i];
    this.delta.subVectors(b, a); const distance = this.delta.length();
    if (distance < .000001) return;
    this.delta.multiplyScalar((distance - this.lengths[i]) / distance);
    if (i === 0) b.sub(this.delta);
    else {a.addScaledVector(this.delta, .5); b.addScaledVector(this.delta, -.5);}
  }

  private limitFold(back: THREE.Vector3) {
    // Muscles keep the tail trailing the hips rather than curling underneath the
    // belly on a tight turn. This limits yaw only: an overhang remains free to sag.
    // Yield to furnishings in a confined turn instead of forcing a trailing
    // direction through a wall. Ground drag alone still permits muscle control.
    if (this.collision.touchesSolid) return;
    const yaw = Math.atan2(back.z, back.x);
    for (let i = 0; i < this.points.length; i++) {
      const a = i === 0 ? this.anchor : this.points[i - 1], b = this.points[i];
      const dx = b.x - a.x, dz = b.z - a.z;
      const angle = Math.atan2(dz, dx) - yaw;
      const wrapped = Math.atan2(Math.sin(angle), Math.cos(angle));
      if (Math.abs(wrapped) <= 1.5) continue;
      const limited = yaw + Math.sign(wrapped) * 1.5, length = Math.hypot(dx, dz);
      b.x = a.x + Math.cos(limited) * length; b.z = a.z + Math.sin(limited) * length;
    }
  }

  private contacts() {
    for (let i = 0; i < this.points.length; i++) {
      this.collision.projectPoint(this.before[i], this.points[i], this.radii[i], this.normals[i]);
      this.beforeSegments[i].copy(this.points[i]);
    }
    if (this.collision.projectSegment) {
      const rootNormal = new THREE.Vector3();
      for (let i = 0; i < this.points.length; i++) {
        const a = i === 0 ? this.anchor : this.points[i - 1];
        this.collision.projectSegment(a, this.points[i], i === 0 ? this.radii[0] * .7 : this.radii[i - 1], this.radii[i], i === 0, i === 0 ? rootNormal : this.normals[i - 1], this.normals[i]);
      }
    }
    for (let i = 0; i < this.points.length; i++) {
      this.collision.projectPoint(this.beforeSegments[i], this.points[i], this.radii[i], this.normals[i]);
      // Sweep from the last resolved position on the next constraint pass,
      // rather than repeatedly tethering a sliding contact to its old position.
      this.before[i].copy(this.points[i]);
    }
  }
}
