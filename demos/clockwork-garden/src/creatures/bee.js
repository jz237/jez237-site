import * as THREE from 'three';
import { wingMesh, strokeFan, Leg, fuzz } from './common.js';
import { gearGeometry } from '../geometry/gears.js';
import { lerp, clamp } from '../core/ease.js';

// Clockwork bees. One rig, three species:
//   bumblebee – rounded brass body, metallic fuzz, amber-glass abdomen with a
//               visible gear core, translucent wings (the hero pollinator)
//   honeybee  – slimmer copper body, banded abdomen, pollen baskets
//   carpenter – glossy blue-black iridescent body, heavier flight
//
// Local frame: +Z forward (head), +Y up. Body length ≈ 2.4 units (bumblebee).

const TAU = Math.PI * 2;

export class Bee {
  constructor(mat, species = 'bumble', { detail = 'hero' } = {}) {
    this.species = species;
    this.group = new THREE.Group();
    this.body = new THREE.Group(); // pitch/roll of the body inside the group
    this.group.add(this.body);
    const hero = detail === 'hero';
    const S = species === 'honey' ? 0.8 : species === 'carpenter' ? 1.1 : 1.0;
    this.scale = S;

    const bodyMat = species === 'honey' ? mat.copper : species === 'carpenter' ? mat.enamelBlueBlack : mat.brass;
    const accent = species === 'carpenter' ? mat.steelBlued : mat.gold;
    const dark = mat.enamelBlack;

    // ---- thorax ---------------------------------------------------------
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), bodyMat);
    thorax.scale.set(0.58 * S, 0.54 * S, 0.62 * S);
    this.body.add(thorax);
    // gilded collar between thorax and head
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.3 * S, 0.06 * S, 8, 24), accent);
    collar.position.z = 0.55 * S;
    this.body.add(collar);
    // engraved scutum plate on top
    const plate = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, TAU, 0, 0.7), accent);
    plate.scale.set(0.42 * S, 0.5 * S, 0.45 * S);
    plate.position.y = 0.06 * S;
    this.body.add(plate);
    if (species !== 'carpenter') {
      const fuzzMat = new THREE.MeshStandardMaterial({ color: species === 'honey' ? '#d0874e' : '#e0b860', metalness: 1, roughness: 0.42 });
      this.body.add(fuzz({ count: hero ? 2200 : 260, radii: new THREE.Vector3(0.585 * S, 0.545 * S, 0.625 * S), length: 0.075 * S, radius: 0.007 * S, mat: fuzzMat, filter: (d) => d.y > -0.4, seed: 11 }));
    }

    // ---- abdomen ----------------------------------------------------------
    const abd = new THREE.Group();
    abd.position.z = -0.55 * S;
    this.body.add(abd);
    this.abdomen = abd;
    const abdLen = species === 'honey' ? 1.15 : 1.0;
    const abdomenGeo = new THREE.SphereGeometry(1, 32, 24);
    if (species === 'bumble') {
      // amber glass shell with a gear core and brass bands
      const glass = new THREE.Mesh(abdomenGeo, mat.amberGlass.clone());
      glass.material.opacity = 0.62;
      glass.material.emissiveIntensity = 0.25;
      glass.material.depthWrite = false;
      glass.scale.set(0.66 * S, 0.6 * S, 0.9 * S * abdLen);
      glass.position.z = -0.7 * S;
      glass.renderOrder = 2;
      abd.add(glass);
      this.abdGlass = glass;
      const core = new THREE.Group();
      core.position.z = -0.7 * S;
      for (let i = 0; i < 3; i++) {
        const g = new THREE.Mesh(gearGeometry({ teeth: 12 + i * 2, module: 0.05 * S, thickness: 0.05 * S, spokes: 0 }), i === 1 ? mat.steel : mat.gold);
        g.position.z = (i - 1) * 0.28 * S;
        g.position.x = (i - 1) * 0.08 * S;
        core.add(g);
      }
      const spring = new THREE.Mesh(new THREE.TorusKnotGeometry(0.18 * S, 0.02 * S, 64, 5, 1, 8), mat.steelBlued);
      spring.rotation.y = Math.PI / 2;
      core.add(spring);
      this.coreGears = core.children;
      this.coreGlow = new THREE.Mesh(new THREE.SphereGeometry(0.22 * S, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffb257' }));
      core.add(this.coreGlow);
      abd.add(core);
      for (let i = 0; i < 4; i++) {
        const k = i / 3;
        const z = -0.1 * S - k * 1.15 * S;
        const r = Math.sqrt(Math.max(0, 1 - ((z + 0.7 * S) / (0.9 * S)) ** 2));
        const band = new THREE.Mesh(new THREE.TorusGeometry(Math.max(0.12, r) * 0.64 * S, 0.05 * S, 8, 40), i % 2 ? dark : mat.brass);
        band.scale.y = 0.92;
        band.position.z = z;
        abd.add(band);
      }
    } else {
      const shell = new THREE.Mesh(abdomenGeo, bodyMat);
      shell.scale.set(0.5 * S, 0.48 * S, 0.9 * S * abdLen);
      shell.position.z = -0.75 * S;
      abd.add(shell);
      for (let i = 0; i < 4; i++) {
        const z = -0.3 * S - i * 0.32 * S;
        const r = Math.sqrt(Math.max(0, 1 - ((z + 0.75 * S) / (0.9 * S * abdLen)) ** 2));
        const band = new THREE.Mesh(new THREE.TorusGeometry(Math.max(0.1, r) * 0.5 * S, 0.06 * S, 8, 32), species === 'honey' ? dark : accent);
        band.position.z = z;
        abd.add(band);
      }
    }
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12 * S, 0.3 * S, 10), accent);
    tip.rotation.x = -Math.PI / 2;
    tip.position.z = -1.68 * S * (species === 'honey' ? 1.08 : 1);
    abd.add(tip);

    // ---- head --------------------------------------------------------------
    const head = new THREE.Group();
    head.position.z = 0.82 * S;
    this.body.add(head);
    this.head = head;
    const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), species === 'carpenter' ? mat.enamelBlueBlack : dark);
    skull.scale.set(0.42 * S, 0.4 * S, 0.34 * S);
    head.add(skull);
    const eyeGeo = new THREE.IcosahedronGeometry(1, 3);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, mat.eye);
      eye.scale.set(0.16 * S, 0.3 * S, 0.22 * S);
      eye.position.set(s * 0.3 * S, 0.04 * S, 0.06 * S);
      eye.rotation.y = s * 0.3;
      head.add(eye);
      // gold bezel around each eye
      const bez = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 6, 24), accent);
      bez.scale.set(0.17 * S, 0.31 * S, 0.2 * S);
      bez.position.copy(eye.position);
      bez.rotation.y = Math.PI / 2 + s * 0.3;
      head.add(bez);
    }
    // mandibles
    for (const s of [-1, 1]) {
      const md = new THREE.Mesh(new THREE.ConeGeometry(0.05 * S, 0.22 * S, 6), accent);
      md.position.set(s * 0.09 * S, -0.22 * S, 0.22 * S);
      md.rotation.set(Math.PI * 0.85, 0, s * 0.4);
      head.add(md);
    }
    // antennae: scape + flagellum with an elbow
    this.antennae = [];
    for (const s of [-1, 1]) {
      const scape = new THREE.Group();
      scape.position.set(s * 0.1 * S, 0.2 * S, 0.25 * S);
      const sm = new THREE.Mesh(new THREE.CylinderGeometry(0.022 * S, 0.026 * S, 0.34 * S, 6), accent);
      sm.position.y = 0.17 * S;
      scape.add(sm);
      const elbow = new THREE.Group();
      elbow.position.y = 0.34 * S;
      scape.add(elbow);
      const fm = new THREE.Mesh(new THREE.CylinderGeometry(0.018 * S, 0.022 * S, 0.62 * S, 6), dark);
      fm.position.y = 0.31 * S;
      elbow.add(fm);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.035 * S, 8, 6), accent);
      bead.position.y = 0.62 * S;
      elbow.add(bead);
      head.add(scape);
      this.antennae.push({ scape, elbow, s });
    }

    // ---- wings ---------------------------------------------------------------
    const tint = species === 'carpenter' ? [120, 140, 200] : [255, 236, 205];
    const vein = species === 'carpenter' ? [30, 30, 50] : [160, 118, 44];
    this.wings = [];
    for (const s of [-1, 1]) {
      for (const fore of [true, false]) {
        const hinge = new THREE.Group();
        hinge.position.set(s * 0.32 * S, 0.36 * S, (fore ? 0.18 : -0.05) * S);
        const w = wingMesh({
          span: (fore ? 1.7 : 1.1) * S,
          chord: (fore ? 0.56 : 0.38) * S,
          seed: fore ? 3 : 5,
          tint,
          vein,
          iridescent: species === 'carpenter',
          edgeMat: accent,
        });
        if (s < 0) w.scale.x = -1;
        hinge.add(w);
        this.body.add(hinge);
        this.wings.push({ hinge, s, fore, mesh: w });
      }
      const fan = strokeFan(1.8 * S, 2.2, species === 'carpenter' ? '#9fb4ff' : '#f4e6c8');
      fan.position.set(s * 0.32 * S, 0.38 * S, 0.1 * S);
      fan.rotation.set(0, s > 0 ? 0 : Math.PI, 0.18);
      this.body.add(fan);
      this.wings.fans = this.wings.fans || [];
      this.wings.fans.push(fan);
    }

    // ---- legs ------------------------------------------------------------------
    this.legs = [];
    const legLen = [0.42, 0.55, 0.5].map((x) => x * S);
    const legRad = [0.05, 0.04, 0.03].map((x) => x * S);
    for (let pair = 0; pair < 3; pair++) {
      for (const s of [-1, 1]) {
        const leg = new Leg({ lengths: legLen.map((l, i) => l * (pair === 2 && i > 0 ? 1.2 : 1)), radii: legRad, mats: [bodyMat, dark, accent], jointMat: accent });
        leg.root.position.set(s * 0.32 * S, -0.3 * S, (0.3 - pair * 0.3) * S);
        this.body.add(leg.root);
        const rec = { leg, s, pair };
        if (pair === 2 && species !== 'carpenter') {
          // pollen basket on the hind tibia
          const basket = new THREE.Mesh(new THREE.SphereGeometry(0.11 * S, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffb547' }));
          basket.position.set(s * 0.04 * S, legLen[1] * 0.55, 0);
          leg.joints[1].add(basket);
          rec.basket = basket;
        }
        this.legs.push(rec);
      }
    }

    this.group.traverse((o) => {
      if (o.isMesh && o.material && !o.material.transparent) o.castShadow = true;
    });
    this.pollen = 0;
    this.setPose({ t: 0 });
  }

  // pose: { t, flap (0..1 wing activity), grip (0 tucked → 1 gripping),
  //         walk (phase or null), pitch, roll, look (head yaw), pollen }
  setPose({ t = 0, flap = 0, grip = 0, walk = null, pitch = 0, roll = 0, look = 0, pollen = 0, fold = 0, freq = 23.7 }) {
    this.pollen = pollen;
    this.body.rotation.set(pitch, 0, roll, 'YXZ');
    this.head.rotation.set(Math.sin(t * 2.3) * 0.04, look, 0);
    // wings: flap about the body axis with a figure-eight sweep; folded at rest
    const beat = t * freq * TAU;
    const amp = 1.05 * flap;
    for (const w of this.wings) {
      const phase = w.fore ? 0 : 0.25;
      const flapA = Math.sin(beat + phase) * amp;
      const sweep = Math.cos(beat + phase) * 0.45 * flap;
      // folded wings lie swept back over the abdomen. Positive "back" swings
      // the tip toward the tail; positive "up" lifts it. The sign flips per
      // side because the left wing spans -X.
      const back = lerp(0, w.fore ? 1.18 : 1.28, fold) + sweep;
      const up = lerp(0.18, 0.05, fold) + flapA;
      w.hinge.rotation.set(0, w.s * back, w.s * up, 'YZX');
    }
    for (const f of this.wings.fans) f.material.opacity = 0.045 * clamp((flap - 0.5) * 2);
    // abdomen breathing and gear core
    const pump = Math.sin(t * 3.1) * 0.03;
    this.abdomen.rotation.x = -0.08 + pump + (1 - flap) * 0.04;
    if (this.coreGears) {
      this.coreGears.forEach((g, i) => { if (g.isMesh && g.geometry.type === 'ExtrudeGeometry') g.rotation.z = t * (i % 2 ? -3 : 3) * (0.3 + flap); });
      const glow = 0.5 + flap * 1.2 + this.pollen * 1.5;
      this.coreGlow.material.color.setRGB(glow, glow * 0.62, glow * 0.26);
    }
    // antennae: alert when landing, twitching gently
    for (const a of this.antennae) {
      a.scape.rotation.set(0.55 + Math.sin(t * 4.7 + a.s) * 0.05, 0, -a.s * 0.42);
      a.elbow.rotation.set(0.9 + Math.sin(t * 3.3 + a.s * 2) * 0.08 + grip * 0.2, 0, a.s * 0.1);
    }
    // legs
    for (const r of this.legs) {
      const { leg, s, pair } = r;
      // femur direction: out to the side, dropped below horizontal, swung
      // forward (front pair) or back (hind pair); knees bend about local Z.
      const fwdGrip = [0.7, 0.05, -0.65][pair];
      const fwdTuck = [0.35, -0.25, -0.75][pair];
      let fwd, drop, k1, k2;
      if (walk !== null) {
        const ph = walk * TAU + ((pair + (s > 0 ? 0 : 1)) % 2 ? Math.PI : 0);
        const lift = Math.max(0, Math.sin(ph));
        fwd = fwdGrip + Math.cos(ph) * 0.32;
        drop = 0.45 - lift * 0.35;
        k1 = 1.25 + lift * 0.25;
        k2 = 0.45;
      } else {
        fwd = lerp(fwdTuck, fwdGrip, grip);
        drop = lerp(1.25, 0.4, grip);
        k1 = lerp(0.95, 1.3, grip) + Math.sin(t * 2 + pair) * 0.04 * (1 - grip);
        k2 = lerp(0.35, 0.55, grip);
      }
      leg.root.rotation.set(0, 0, 0);
      leg.joints[0].rotation.set(0, -s * fwd, -s * (Math.PI / 2 + drop), 'YZX');
      leg.joints[1].rotation.set(0, 0, -s * k1);
      leg.joints[2].rotation.set(0, 0, -s * k2);
      if (r.basket) {
        const pg = this.pollen;
        r.basket.scale.setScalar(0.25 + pg * 1.1);
        const gl = 0.6 + pg * 2.5;
        r.basket.material.color.setRGB(gl, gl * 0.68, gl * 0.28);
        r.basket.visible = pg > 0.02;
      }
    }
  }
}
