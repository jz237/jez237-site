import * as THREE from 'three';
import { clamp01, smoother } from './geo.js';

// Explode rig: every part owns an assembled and an exploded pose and blends
// between them with a staggered delay and an optional bowed travel arc.
export class Rig {
  constructor() {
    this.parts = [];
    this.byId = new Map();
  }

  // a / x: { p: Vector3, r: Euler|[x,y,z] (radians), s: number|Vector3 }
  add(obj, id, { a, x, delay = 0, bow = 0, bowDir = new THREE.Vector3(0, 0, 1), maxDelay = 0.35 } = {}) {
    const pose = (o) => ({
      p: o.p.clone(),
      q: new THREE.Quaternion().setFromEuler(o.r instanceof THREE.Euler ? o.r : new THREE.Euler(...(o.r || [0, 0, 0]), 'YXZ')),
      s: typeof o.s === 'number' ? new THREE.Vector3(o.s, o.s, o.s) : (o.s || new THREE.Vector3(1, 1, 1)).clone(),
    });
    const part = { obj, id, a: pose(a), x: pose(x), delay: Math.min(delay, maxDelay), bow, bowDir: bowDir.clone().normalize(), k: 0, maxDelay };
    this.parts.push(part);
    if (id) this.byId.set(id, part);
    obj.position.copy(part.a.p);
    obj.quaternion.copy(part.a.q);
    obj.scale.copy(part.a.s);
    return part;
  }

  update(e) {
    for (const part of this.parts) {
      const span = 1 - part.maxDelay;
      const k = smoother(clamp01((e - part.delay) / span));
      part.k = k;
      part.obj.position.lerpVectors(part.a.p, part.x.p, k);
      if (part.bow) part.obj.position.addScaledVector(part.bowDir, Math.sin(k * Math.PI) * part.bow);
      part.obj.quaternion.slerpQuaternions(part.a.q, part.x.q, k);
      part.obj.scale.lerpVectors(part.a.s, part.x.s, k);
    }
  }
}
