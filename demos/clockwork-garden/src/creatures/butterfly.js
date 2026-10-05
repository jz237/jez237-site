import * as THREE from 'three';
import { butterflyTexture } from '../materials/textures.js';
import { Rod, knuckleGeometry } from '../geometry/parts.js';
import { Leg } from './common.js';
import { clamp, lerp } from '../core/ease.js';

// Clockwork butterflies: enamel-and-filigree wings on gilded hinges, driven by
// a little crank in the thorax through push rods to levers on each wing root.
// species: 'monarch' | 'swallowtail'. Local frame: +Z forward, +Y up.

const TAU = Math.PI * 2;
const texCache = {};

export class Butterfly {
  constructor(mat, species = 'monarch', { detail = 'hero' } = {}) {
    this.species = species;
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    const hero = detail === 'hero';
    const S = species === 'swallowtail' ? 1.15 : 1.0;
    const bodyMat = species === 'monarch' ? mat.enamelBlack : mat.brassAged;
    const accent = mat.gold;

    // body: thorax, segmented abdomen, head
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), bodyMat);
    thorax.scale.set(0.3 * S, 0.3 * S, 0.5 * S);
    this.body.add(thorax);
    for (let i = 0; i < 7; i++) {
      const k = i / 6;
      const seg = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), i % 2 ? bodyMat : accent);
      const r = (0.24 - k * 0.12) * S;
      seg.scale.set(r, r, 0.2 * S);
      seg.position.z = (-0.55 - i * 0.24) * S;
      this.body.add(seg);
    }
    const head = new THREE.Group();
    head.position.z = 0.6 * S;
    this.body.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.22 * S, 16, 12), bodyMat);
    head.add(skull);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13 * S, 2), mat.eye);
      eye.position.set(s * 0.15 * S, 0.04 * S, 0.06 * S);
      head.add(eye);
      // clubbed antenna
      const pts = [];
      for (let k = 0; k <= 10; k++) {
        const u = k / 10;
        pts.push(new THREE.Vector3(s * (0.06 + u * 0.55) * S, (0.12 + u * 1.2 - u * u * 0.25) * S, (0.08 + u * 0.9) * S));
      }
      const ant = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.02 * S, 5, false), accent);
      head.add(ant);
      const club = new THREE.Mesh(new THREE.SphereGeometry(0.055 * S, 8, 6), accent);
      club.scale.set(1, 1, 1.8);
      club.position.copy(pts[pts.length - 1]);
      head.add(club);
    }
    // coiled proboscis (a watch-spring)
    const pro = new THREE.Mesh(new THREE.TorusGeometry(0.08 * S, 0.015 * S, 5, 24, Math.PI * 1.6), accent);
    pro.position.set(0, -0.16 * S, 0.12 * S);
    pro.rotation.y = Math.PI / 2;
    head.add(pro);
    this.head = head;

    // wings
    if (!texCache[species]) texCache[species] = butterflyTexture({ species, size: hero ? 1024 : 512 });
    const tex = texCache[species];
    const wingMat = new THREE.MeshPhysicalMaterial({
      map: tex,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      metalness: 0.25,
      roughness: 0.34,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 0.3,
    });
    this.wingMat = wingMat;
    const span = 3.6 * S, chord = 3.8 * S;
    const geo = new THREE.PlaneGeometry(1, 1, 16, 16);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const u = uv.getX(i), v = uv.getY(i);
      const x = u * span;
      const z = (v - 0.5) * chord;
      const y = Math.sin(u * Math.PI * 0.8) * 0.18 * S - Math.abs(v - 0.5) * 0.12 * S * u;
      p.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    this.wings = [];
    const kn = knuckleGeometry(0.05 * S, 0.9 * S);
    for (const s of [-1, 1]) {
      const hinge = new THREE.Group();
      hinge.position.set(s * 0.22 * S, 0.12 * S, 0.05 * S);
      const w = new THREE.Mesh(geo, wingMat);
      if (s < 0) w.scale.x = -1;
      w.castShadow = true;
      hinge.add(w);
      // gilded hinge knuckle along the wing root
      const k = new THREE.Mesh(kn, accent);
      k.rotation.y = Math.PI / 2;
      hinge.add(k);
      // lever arm on the wing root, below the hinge line
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.06 * S, 0.34 * S, 0.06 * S), accent);
      lever.position.set(s * 0.12 * S, -0.17 * S, 0);
      hinge.add(lever);
      this.body.add(hinge);
      const rod = new Rod(mat.steel, 0.022 * S, 6, accent).addTo(this.body);
      this.wings.push({ hinge, s, rod, leverLocal: new THREE.Vector3(s * 0.12 * S, -0.32 * S, 0) });
    }
    // the drive crank inside the thorax (visible between the wing roots)
    this.crank = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * S, 0.07 * S, 0.12 * S, 12), accent);
    this.crank.rotation.x = Math.PI / 2;
    this.crank.position.set(0, -0.05 * S, 0.05 * S);
    this.body.add(this.crank);

    // legs (front pair tucked as in real butterflies)
    this.legs = [];
    for (let pair = 0; pair < 3; pair++) {
      for (const s of [-1, 1]) {
        const leg = new Leg({ lengths: [0.4, 0.5, 0.35].map((x) => x * S), radii: [0.025, 0.02, 0.015].map((x) => x * S), mats: [bodyMat, bodyMat, accent], jointMat: accent });
        leg.root.position.set(s * 0.12 * S, -0.2 * S, (0.2 - pair * 0.2) * S);
        this.body.add(leg.root);
        this.legs.push({ leg, s, pair });
      }
    }
    this.group.traverse((o) => { if (o.isMesh && o.material !== wingMat) o.castShadow = true; });
    this.size = S;
  }

  // open: 0 = wings closed upright above the back, 1 = spread flat.
  // flap: amplitude of flight beats (adds to the open angle); grip for legs.
  setPose({ t = 0, open = 0, flap = 0, freq = 3.2, grip = 1, pitch = 0, roll = 0 }) {
    this.body.rotation.set(pitch, 0, roll, 'YXZ');
    const S = this.size;
    const base = lerp(1.45, 0.08, open);
    const beat = flap > 0 ? Math.sin(t * freq * TAU) * flap : 0;
    const up = clamp(base + beat * 0.95 - flap * 0.3, -0.7, 1.52);
    const crankP = new THREE.Vector3(0, -0.05 * S, 0.05 * S);
    this.body.updateMatrixWorld(true);
    for (const w of this.wings) {
      w.hinge.rotation.set(0, 0, w.s * up);
      // push rod from the crank to the lever end on the wing root
      const end = w.leverLocal.clone().applyEuler(w.hinge.rotation).add(w.hinge.position);
      const start = crankP.clone().add(new THREE.Vector3(w.s * 0.06 * S, -0.05 * S + Math.sin(up) * 0.03 * S, 0));
      w.rod.set(start, end);
    }
    this.crank.rotation.z = up * 2.0;
    for (const r of this.legs) {
      const { leg, s, pair } = r;
      const fwd = [0.6, 0.0, -0.6][pair];
      const drop = lerp(1.3, 0.5, grip) + (pair === 0 ? 0.4 : 0);
      leg.joints[0].rotation.set(0, -s * fwd, -s * (Math.PI / 2 + drop), 'YZX');
      leg.joints[1].rotation.set(0, 0, -s * lerp(1.0, 1.4, grip));
      leg.joints[2].rotation.set(0, 0, -s * 0.4);
    }
  }
}
