import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GEM_COLORS, rng } from './materials.js';
import { smoother, clamp01, TAU } from './geo.js';

// Slotted thread screw, +Y is the head (origin at the head's underside).
function screwGeometry() {
  const parts = [];
  // threaded shank, tip at -0.95
  const prof = [new THREE.Vector2(0.0, -0.98), new THREE.Vector2(0.05, -0.95)];
  const turns = 7;
  for (let i = 0; i < turns; i++) {
    const y0 = -0.92 + i * 0.12;
    prof.push(new THREE.Vector2(0.105, y0 + 0.02), new THREE.Vector2(0.075, y0 + 0.06), new THREE.Vector2(0.105, y0 + 0.1));
  }
  prof.push(new THREE.Vector2(0.105, -0.0), new THREE.Vector2(0.0, 0.0));
  parts.push(new THREE.LatheGeometry(prof, 10));
  // head: flange + dome
  const head = [new THREE.Vector2(0, 0.0), new THREE.Vector2(0.2, 0.0), new THREE.Vector2(0.215, 0.03), new THREE.Vector2(0.2, 0.11), new THREE.Vector2(0.15, 0.17), new THREE.Vector2(0.07, 0.2), new THREE.Vector2(0.0, 0.205)];
  parts.push(new THREE.LatheGeometry(head, 18));
  return mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)).map((g) => {
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
    return g;
  }), false);
}

function capGeometry() {
  const g = new THREE.SphereGeometry(0.17, 14, 10);
  g.scale(1, 0.72, 1);
  g.translate(0, 0.2, 0);
  return g;
}

const slotGeometry = () => {
  const g = new THREE.BoxGeometry(0.34, 0.05, 0.05);
  g.translate(0, 0.205, 0);
  return g;
};

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _qs = new THREE.Quaternion();
const _o = new THREE.Vector3();

// Floating fasteners: unthread along their axis when the model explodes.
export class ScrewField {
  constructor(mats, specs) {
    this.specs = specs;
    this.group = new THREE.Group();
    const body = screwGeometry();
    const plain = specs.length;
    this.body = new THREE.InstancedMesh(body, mats.screw.clone(), plain);
    this.body.material.vertexColors = false;
    this.body.material.color.set(0xe3b24c);
    this.body.frustumCulled = false;
    this.group.add(this.body);
    const slot = new THREE.InstancedMesh(slotGeometry(), mats.brassDark, plain);
    slot.frustumCulled = false;
    this.slot = slot;
    this.group.add(slot);
    const jewel = specs.filter((s) => s.cap);
    this.jewelIdx = [];
    specs.forEach((s, i) => s.cap && this.jewelIdx.push(i));
    this.caps = new THREE.InstancedMesh(capGeometry(), mats.gem.clone(), Math.max(1, jewel.length));
    this.caps.material.vertexColors = false;
    this.caps.material.color.set(0xffffff);
    this.caps.frustumCulled = false;
    this.caps.count = jewel.length;
    const col = new THREE.Color();
    jewel.forEach((s, k) => this.caps.setColorAt(k, col.copy(s.cap)));
    if (this.caps.instanceColor) this.caps.instanceColor.needsUpdate = true;
    this.group.add(this.caps);
    this.rand = rng(77);
    this.phase = specs.map(() => this.rand() * TAU);
  }

  // anchors[i] is the current world position of the screw's parent assembly.
  update(e, time, parentPos) {
    const n = this.specs.length;
    let ci = 0;
    for (let i = 0; i < n; i++) {
      const s = this.specs[i];
      const local = clamp01((e - s.delay * 0.45) / (1 - s.delay * 0.45));
      const k = smoother(local);
      const parent = parentPos(s);
      _o.copy(s.offset).multiplyScalar(0.25 + 0.75 * k);
      _p.copy(parent).add(_o);
      _p.addScaledVector(s.axis, s.pull * k);
      _p.y += Math.sin(time * 0.9 + this.phase[i]) * 0.045 * k;
      _qs.setFromUnitVectors(_up, s.axis);
      _q.setFromAxisAngle(s.axis, -k * s.pull * 5.0 + this.phase[i]).multiply(_qs);
      const scale = s.size * smoother(clamp01(e / 0.2));
      _s.set(scale, scale, scale);
      _m.compose(_p, _q, _s);
      this.body.setMatrixAt(i, _m);
      this.slot.setMatrixAt(i, _m);
      if (s.cap) this.caps.setMatrixAt(ci++, _m);
    }
    this.body.instanceMatrix.needsUpdate = true;
    this.slot.instanceMatrix.needsUpdate = true;
    this.caps.instanceMatrix.needsUpdate = true;
  }
}

export const SCREW_CAPS = [GEM_COLORS.ruby, GEM_COLORS.rose, GEM_COLORS.sapphire];
