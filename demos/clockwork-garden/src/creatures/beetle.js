import * as THREE from 'three';
import { Leg } from './common.js';
import { wingMesh } from './common.js';
import { ladybirdTexture } from '../materials/textures.js';
import { clamp, lerp } from '../core/ease.js';

// Beetles. Local frame: +Z forward, +Y up (away from the surface it walks on).
//   jewel beetle – emerald iridescent elytra edged in gold; climbs on six
//                  articulated legs with a tripod gait
//   ladybird     – red enamel dome with black spots; the shell halves lift
//                  apart and folded membrane wings unfurl before take-off

const TAU = Math.PI * 2;

function shellGeometry(len, width, height, side) {
  // half of an ellipsoid dome, split along the midline (x = 0)
  // three.js spheres: x = -cos(phi)·sin(theta) → phi ∈ [π/2, 3π/2] is the +x half
  const geo = new THREE.SphereGeometry(1, 24, 16, side > 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI, 0, Math.PI / 2);
  geo.scale(width, height, len);
  return geo;
}

export class Beetle {
  constructor(mat, kind = 'jewel') {
    this.kind = kind;
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    const L = kind === 'ladybird' ? 0.75 : 1.15; // half length of the elytra
    const W = kind === 'ladybird' ? 0.72 : 0.58;
    const Hh = kind === 'ladybird' ? 0.62 : 0.42;
    const shellMat = kind === 'ladybird'
      ? new THREE.MeshPhysicalMaterial({ map: ladybirdTexture(256), metalness: 0.1, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.04 })
      : mat.enamelEmerald;
    const dark = mat.enamelBlack;
    const accent = mat.gold;

    // under-body
    const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), dark);
    belly.scale.set(W * 0.8, Hh * 0.5, L * 0.95);
    belly.position.set(0, 0.05, -0.1);
    this.body.add(belly);
    // pronotum and head
    const pron = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), kind === 'ladybird' ? dark : shellMat);
    pron.scale.set(W * 0.82, Hh * 0.72, L * 0.38);
    pron.position.set(0, 0.12, L * 0.82);
    this.body.add(pron);
    if (kind === 'ladybird') {
      // white cheek patches
      for (const s of [-1, 1]) {
        const patch = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshPhysicalMaterial({ color: '#f2eadc', roughness: 0.3, clearcoat: 1 }));
        patch.position.set(s * W * 0.5, 0.2, L * 0.9);
        patch.scale.set(1, 0.6, 0.8);
        this.body.add(patch);
      }
    }
    const head = new THREE.Group();
    head.position.set(0, 0.08, L * 1.2);
    this.body.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), dark);
    skull.scale.set(W * 0.45, Hh * 0.4, L * 0.22);
    head.add(skull);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 1), mat.eye);
      eye.position.set(s * W * 0.36, 0.05, 0.08);
      head.add(eye);
      if (kind !== 'ladybird') {
        const md = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.3, 6), accent);
        md.rotation.set(Math.PI / 2, 0, -s * 0.5);
        md.position.set(s * 0.1, -0.04, 0.26);
        head.add(md);
      }
      // segmented antenna
      const pts = [];
      for (let k = 0; k <= 8; k++) {
        const u = k / 8;
        pts.push(new THREE.Vector3(s * (0.12 + u * 0.5), 0.1 + u * 0.35 - u * u * 0.15, 0.15 + u * 0.75));
      }
      head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.022, 5, false), accent));
      for (let k = 2; k <= 8; k += 2) {
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), dark);
        bead.position.copy(pts[k]);
        head.add(bead);
      }
    }
    this.head = head;

    // elytra (two hinged shell halves) and the membrane wings beneath them
    this.elytra = [];
    this.hindWings = [];
    for (const s of [-1, 1]) {
      const hinge = new THREE.Group();
      hinge.position.set(0, 0.12, L * 0.55);
      const shell = new THREE.Mesh(shellGeometry(L, W, Hh, s), shellMat);
      shell.position.set(0, 0, -L * 0.55);
      hinge.add(shell);
      // gilded seam along the inner edge
      const seamPts = [];
      for (let k = 0; k <= 16; k++) {
        const a = (k / 16) * Math.PI;
        seamPts.push(new THREE.Vector3(s * 0.005, Math.sin(a) * Hh * 0.98, -L * 0.55 + Math.cos(a) * L));
      }
      hinge.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(seamPts), 24, 0.03, 5, false), accent));
      this.body.add(hinge);
      this.elytra.push({ hinge, s });
      const wing = wingMesh({ span: L * 2.4, chord: L * 0.9, seed: 9, tint: [230, 220, 200], vein: [70, 50, 30], edgeMat: accent });
      const wh = new THREE.Group();
      wh.position.set(s * W * 0.3, Hh * 0.6, L * 0.4);
      if (s < 0) wing.scale.x = -1;
      wh.add(wing);
      this.body.add(wh);
      this.hindWings.push({ hinge: wh, wing, s });
    }

    // legs
    this.legs = [];
    for (let pair = 0; pair < 3; pair++) {
      for (const s of [-1, 1]) {
        const leg = new Leg({ lengths: [0.35, 0.55, 0.45].map((x) => x * (kind === 'ladybird' ? 0.65 : 1)), radii: [0.05, 0.04, 0.028], mats: [dark, kind === 'ladybird' ? dark : shellMat, accent], jointMat: accent });
        leg.root.position.set(s * W * 0.55, 0.02, L * (0.55 - pair * 0.5));
        this.body.add(leg.root);
        this.legs.push({ leg, s, pair });
      }
    }
    this.group.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
    this.L = L;
  }

  // open: 0 shell closed → 1 lifted apart; wings: 0 folded → 1 spread;
  // walk: gait phase (cycles) or null; flap: wing beat activity
  setPose({ t = 0, walk = null, open = 0, wings = 0, flap = 0, look = 0 }) {
    this.head.rotation.set(Math.sin(t * 1.7) * 0.05, look, 0);
    for (const e of this.elytra) {
      e.hinge.rotation.set(open * 0.55, 0, -e.s * open * 0.85, 'ZXY');
    }
    const beat = Math.sin(t * 20.3 * TAU) * flap;
    for (const w of this.hindWings) {
      w.wing.visible = wings > 0.02;
      const back = lerp(1.35, 0.15, wings);
      w.hinge.scale.setScalar(lerp(0.35, 1, wings));
      w.hinge.rotation.set(0, w.s * back, w.s * (0.25 + beat * 0.9), 'YZX');
    }
    for (const r of this.legs) {
      const { leg, s, pair } = r;
      const fwdBase = [0.75, 0.05, -0.75][pair];
      let fwd = fwdBase, drop = 0.35, k1 = 1.35, k2 = 0.45;
      if (walk !== null) {
        // alternating tripods: L1 R2 L3 vs R1 L2 R3
        const tri = (pair + (s > 0 ? 1 : 0)) % 2;
        const ph = (walk + tri * 0.5) % 1;
        const swing = ph < 0.5; // leg in the air moving forward
        const u = swing ? ph / 0.5 : (ph - 0.5) / 0.5;
        fwd = fwdBase + (swing ? lerp(-0.32, 0.32, u) : lerp(0.32, -0.32, u));
        const lift = swing ? Math.sin(u * Math.PI) : 0;
        drop = 0.35 - lift * 0.45;
        k1 = 1.35 + lift * 0.25;
      } else if (open > 0.1) {
        drop = 0.3;
        k1 = 1.25;
      }
      leg.joints[0].rotation.set(0, -s * fwd, -s * (Math.PI / 2 + drop), 'YZX');
      leg.joints[1].rotation.set(0, 0, -s * k1);
      leg.joints[2].rotation.set(0, 0, -s * k2);
    }
  }
}
