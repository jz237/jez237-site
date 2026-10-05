import * as THREE from 'three';
import { addPulse } from '../materials/library.js';
import { collarGeometry } from '../geometry/parts.js';
import { taperedTube, tubeThrough } from '../geometry/shapes.js';
import { RNG } from '../core/rng.js';
import { seg, lerp, clamp, easeInOutSine, trapezoid } from '../core/ease.js';

// Copper roots that carry the garden's energy. Each root is a tapered tube
// whose shader shows a travelling pulse (uv.x runs along the root).

export class RootNetwork {
  constructor(mat) {
    this.mat = mat;
    this.group = new THREE.Group();
    this.group.name = 'roots';
    this.roots = [];
    this.rng = new RNG('roots');
  }

  // points: Vector3[]; timing: [t0, t1] for the pulse; returns the root record
  addRoot(points, { r0 = 0.32, r1 = 0.22, t0 = 0, t1 = 1, collars = true, ease = 'cruise', gain = 1, rootlets = 8, name = '' } = {}) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const len = curve.getLength();
    const material = this.mat.copper.clone();
    const pulse = addPulse(material, {}, { color: '#ffa640', width: 0.7 / len, trail: 2.2 / len });
    const segs = Math.max(48, Math.round(len * 6));
    const mesh = new THREE.Mesh(taperedTube(curve, r0, r1, segs, 12), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    const root = { curve, len, material, pulse, mesh, t0, t1, ease, gain, name };
    // brass collars every few units
    if (collars) {
      const n = Math.floor(len / 3.2);
      for (let i = 1; i < n; i++) {
        const k = i / n;
        const p = curve.getPointAt(k);
        const tng = curve.getTangentAt(k);
        const r = lerp(r0, r1, k);
        const c = new THREE.Mesh(collarGeometry(r * 1.32, r * 1.1), this.mat.gold);
        c.position.copy(p);
        c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tng);
        c.castShadow = true;
        this.group.add(c);
      }
    }
    // fine copper rootlets branching off into the moss
    for (let i = 0; i < rootlets; i++) {
      const k = this.rng.range(0.05, 0.95);
      const p = curve.getPointAt(k);
      const tng = curve.getTangentAt(k);
      const side = new THREE.Vector3().crossVectors(tng, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(this.rng.sign());
      const pts = [p.clone()];
      let q = p.clone();
      const steps = 4;
      for (let s = 1; s <= steps; s++) {
        q = q.clone().addScaledVector(side, this.rng.range(0.6, 1.2)).addScaledVector(tng, this.rng.range(-0.5, 0.5));
        q.y = Math.max(-0.2, p.y - s * 0.12 + this.rng.range(-0.05, 0.05));
        pts.push(q);
      }
      const rl = new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3(pts), lerp(r0, r1, k) * 0.35, 0.015, 24, 5), this.mat.copperAged);
      rl.castShadow = true;
      this.group.add(rl);
    }
    this.roots.push(root);
    return root;
  }

  pulseK(root, t) {
    const k = seg(t, root.t0, root.t1);
    // quick launch, steady travel, slight slow-down on arrival
    if (root.ease === 'cruise') return trapezoid(k, 0.12, 0.12);
    return easeInOutSine(k);
  }

  // world-space position of the pulse head on a root
  pulsePoint(root, t, target = new THREE.Vector3()) {
    const k = clamp(this.pulseK(root, t));
    return root.curve.getPointAt(k, target);
  }

  update(t, ctx) {
    for (const r of this.roots) {
      const active = t >= r.t0;
      const k = this.pulseK(r, t);
      r.pulse.uPulse.value = active ? lerp(-0.02, 1.04, k) : -1;
      // after the pulse passes the root stays faintly charged, and every
      // escapement tick sends a soft ripple along it
      const done = clamp((t - r.t1) / 1.5);
      r.pulse.uCharge.value = active ? clamp(k * 1.2) * 0.9 : 0;
      r.pulse.uPulseGain.value = r.gain * (1 - done * 0.7) * (active ? 1 : 0);
    }
  }
}
