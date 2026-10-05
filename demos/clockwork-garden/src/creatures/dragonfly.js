import * as THREE from 'three';
import { wingMesh, strokeFan } from './common.js';

// Clockwork dragonfly: jewel-segmented abdomen, great faceted eyes and four
// independently beating glass wings (fore and hind pairs out of phase).
// Local frame: +Z forward, +Y up.

const TAU = Math.PI * 2;

export class Dragonfly {
  constructor(mat, { palette = 'teal' } = {}) {
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    const jewel = palette === 'teal'
      ? new THREE.MeshPhysicalMaterial({ color: '#0f6f72', metalness: 0.6, roughness: 0.22, clearcoat: 1, iridescence: 0.8, iridescenceIOR: 1.7 })
      : mat.enamelSapphire;
    const accent = mat.gold;
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), jewel);
    thorax.scale.set(0.42, 0.45, 0.7);
    this.body.add(thorax);
    for (let i = 0; i < 10; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.17 - i * 0.008, 0.19 - i * 0.008, 0.48, 10), i % 2 ? jewel : accent);
      seg.rotation.x = Math.PI / 2;
      seg.position.z = -0.8 - i * 0.5;
      this.body.add(seg);
    }
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 8), accent);
    tail.rotation.x = -Math.PI / 2;
    tail.position.z = -5.9;
    this.body.add(tail);
    const head = new THREE.Group();
    head.position.z = 0.75;
    this.body.add(head);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 2), new THREE.MeshPhysicalMaterial({ color: '#103a5a', metalness: 0.4, roughness: 0.1, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.9, flatShading: true }));
      eye.position.set(s * 0.25, 0.08, 0.05);
      head.add(eye);
    }
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), accent);
    face.position.z = 0.22;
    head.add(face);

    this.wings = [];
    for (const s of [-1, 1]) {
      for (const fore of [true, false]) {
        const hinge = new THREE.Group();
        hinge.position.set(s * 0.25, 0.38, fore ? 0.25 : -0.25);
        const w = wingMesh({ span: fore ? 4.2 : 4.0, chord: fore ? 0.85 : 1.0, seed: fore ? 21 : 23, tint: [225, 240, 245], vein: [40, 60, 70], kind: 'dragon', iridescent: true, edgeMat: accent, shape: 'dragon' });
        if (s < 0) w.scale.x = -1;
        hinge.add(w);
        this.body.add(hinge);
        this.wings.push({ hinge, s, fore });
      }
    }
    this.fans = [];
    for (const s of [-1, 1]) {
      const fan = strokeFan(4.2, 1.6, '#d8eef2');
      fan.position.set(s * 0.25, 0.4, 0);
      fan.rotation.set(0, s > 0 ? 0 : Math.PI, 0);
      this.body.add(fan);
      this.fans.push(fan);
    }
    this.group.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
  }

  setPose({ t = 0, flap = 1, glide = 0, pitch = 0, roll = 0, freq = 27.3 }) {
    this.body.rotation.set(pitch, 0, roll, 'YXZ');
    for (const w of this.wings) {
      const ph = w.fore ? 0 : Math.PI * 0.5;
      const a = Math.sin(t * freq * TAU + ph) * 0.75 * flap * (1 - glide);
      const twist = Math.cos(t * freq * TAU + ph) * 0.2 * flap;
      w.hinge.rotation.set(0, w.s * (w.fore ? -0.08 : 0.12), w.s * (a + 0.05 + glide * 0.02), 'YZX');
      w.hinge.children[0].rotation.x = twist;
    }
    for (const f of this.fans) f.material.opacity = 0.07 * flap * (1 - glide);
  }
}
