import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { petalGeometry } from '../geometry/shapes.js';
import { strokeFan, Leg } from './common.js';
import { lerp, clamp } from '../core/ease.js';

// Mechanical birds built from overlapping metal feather plates.
//   hummingbird – emerald and sapphire plates, ruby gorget, needle beak,
//                 figure-eight wing beat with a shimmer of motion blur
//   songbird    – ivory, bronze and copper plates; perches, tilts its head,
//                 ruffles individual plates, then unfolds its wings to fly
// Local frame: +Z forward (beak), +Y up.

const TAU = Math.PI * 2;

function featherGeometry(len, width) {
  const g = petalGeometry({ length: len, width, cup: width * 0.12, curl: -0.05, ridge: width * 0.04, thickness: width * 0.04, tip: 0.3, segU: 8, segV: 5, baseWidth: 0.55 }).geometry;
  return g;
}

export class Bird {
  constructor(mat, kind = 'hummingbird') {
    this.kind = kind;
    const humm = kind === 'hummingbird';
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    const S = humm ? 1.0 : 1.9;
    this.S = S;
    const plateA = humm ? mat.enamelEmerald : new THREE.MeshPhysicalMaterial({ color: '#efe4cf', roughness: 0.38, clearcoat: 1, sheen: 0.3, side: THREE.DoubleSide });
    const plateB = humm ? mat.enamelSapphire : mat.rosegold;
    const plateC = humm ? mat.gold : mat.copper;
    const throat = humm ? mat.ruby : new THREE.MeshPhysicalMaterial({ color: '#c9783a', metalness: 0.6, roughness: 0.3, clearcoat: 1 });

    // core body shell
    const core = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), humm ? mat.enamelEmerald : plateC);
    core.scale.set(humm ? 0.62 * S : 0.56 * S, humm ? 0.66 * S : 0.6 * S, humm ? 1.15 * S : 1.25 * S);
    this.body.add(core);

    // overlapping feather plates over the back and breast (instanced)
    const plateGeo = featherGeometry((humm ? 0.42 : 0.36) * S, (humm ? 0.34 : 0.3) * S);
    const back = [];
    const breast = [];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 9; col++) {
        const u = row / 6; // front → back
        const v = (col / 8) * 2 - 1; // left → right over the top
        const ang = v * 1.35;
        const z = lerp(0.75, -0.95, u) * S;
        const rad = Math.sqrt(Math.max(0.05, 1 - (z / (1.18 * S)) ** 2));
        const p = new THREE.Vector3(Math.sin(ang) * 0.64 * S * rad, Math.cos(ang) * 0.68 * S * rad, z);
        const n = new THREE.Vector3(p.x / (0.62 * S), p.y / (0.66 * S), p.z / (1.15 * S)).normalize();
        back.push({ p, n, row, col });
        const pb = p.clone();
        pb.y = -pb.y * 0.95;
        const nb = n.clone();
        nb.y = -nb.y;
        if (row < 5) breast.push({ p: pb, n: nb, row, col });
      }
    }
    const mkPlates = (list, matl) => {
      const im = new THREE.InstancedMesh(plateGeo, matl, list.length);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qq = new THREE.Quaternion();
      list.forEach((f, i) => {
        // plate lies on the surface pointing backward (feathers overlap rearward)
        const tangentBack = new THREE.Vector3(0, 0, -1).addScaledVector(f.n, f.n.z).normalize();
        const basis = new THREE.Matrix4();
        const yAxis = tangentBack;
        const zAxis = f.n.clone();
        const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize();
        zAxis.crossVectors(xAxis, yAxis).normalize();
        basis.makeBasis(xAxis, yAxis, zAxis);
        q.setFromRotationMatrix(basis);
        qq.setFromAxisAngle(new THREE.Vector3(1, 0, 0), humm ? 0.22 : 0.1);
        q.multiply(qq);
        m4.compose(f.p, q, new THREE.Vector3(1, 1, 1));
        im.setMatrixAt(i, m4);
      });
      im.castShadow = true;
      return im;
    };
    this.backPlates = mkPlates(back, humm ? plateA : plateC);
    this.body.add(this.backPlates);
    this.breastPlates = mkPlates(breast, humm ? mat.gold : plateA);
    this.body.add(this.breastPlates);
    this._plateList = back;

    // head
    const head = new THREE.Group();
    head.position.set(0, (humm ? 0.42 : 0.5) * S, (humm ? 1.0 : 1.05) * S);
    this.body.add(head);
    this.head = head;
    const skull = new THREE.Mesh(new THREE.SphereGeometry((humm ? 0.46 : 0.36) * S, 20, 14), humm ? plateA : plateC);
    head.add(skull);
    const crest = new THREE.Mesh(new THREE.SphereGeometry((humm ? 0.47 : 0.37) * S, 20, 10, 0, TAU, 0, 1.0), humm ? plateB : mat.rosegold);
    crest.rotation.x = -0.3;
    head.add(crest);
    const gorget = new THREE.Mesh(new THREE.SphereGeometry(0.42 * S, 16, 10, Math.PI * 0.15, Math.PI * 0.7, 1.95, 0.8), throat);
    gorget.position.set(0, -0.12 * S, 0.02 * S);
    head.add(gorget);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1 * S, 12, 10), mat.eye);
      eye.position.set(s * (humm ? 0.34 : 0.27) * S, 0.08 * S, (humm ? 0.2 : 0.16) * S);
      head.add(eye);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.11 * S, 0.025 * S, 6, 20), mat.gold);
      rim.position.copy(eye.position);
      rim.rotation.y = s * Math.PI / 2;
      head.add(rim);
    }
    const beakLen = humm ? 2.3 : 0.75 * S * 0.6;
    const beak = new THREE.Mesh(new THREE.ConeGeometry(humm ? 0.06 : 0.14 * S, beakLen, 10), humm ? mat.steel : mat.gold);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, -0.02 * S, 0.4 * S + beakLen / 2);
    head.add(beak);
    this.beakTipLocal = new THREE.Vector3(0, -0.02 * S, 0.4 * S + beakLen);

    // wings: shoulder → fan of primary feathers around a wrist pivot
    this.wings = [];
    for (const s of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(s * 0.5 * S, 0.35 * S, 0.3 * S);
      this.body.add(shoulder);
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.1 * S, 0.9 * S, 4, 8), humm ? plateB : plateC);
      arm.rotation.z = Math.PI / 2;
      arm.position.x = s * 0.5 * S;
      shoulder.add(arm);
      const wrist = new THREE.Group();
      wrist.position.x = s * 1.0 * S;
      shoulder.add(wrist);
      const feathers = [];
      const n = humm ? 8 : 10;
      for (let i = 0; i < n; i++) {
        const len = (humm ? 2.4 : 1.6) * S * (0.6 + 0.4 * Math.sin(((i + 1) / (n + 1)) * Math.PI));
        const g = featherGeometry(len, (humm ? 0.62 : 0.55) * S);
        const f = new THREE.Mesh(g, humm ? (i % 2 ? plateB : plateA) : i % 3 === 0 ? plateC : plateA);
        const holder = new THREE.Group();
        holder.add(f);
        // feather local +Y points along its length; lay it in the wing plane
        f.rotation.x = -Math.PI / 2;
        wrist.add(holder);
        feathers.push({ holder, i, n });
      }
      // coverts over the arm
      for (let i = 0; i < 5; i++) {
        const c = new THREE.Mesh(featherGeometry(0.7 * S, 0.4 * S), humm ? plateA : plateB);
        c.rotation.set(-Math.PI / 2, 0, s * -1.4);
        c.position.set(s * (0.2 + i * 0.18) * S, 0.05 * S, -0.05 * S);
        shoulder.add(c);
      }
      const fan = strokeFan((humm ? 3.2 : 2.6) * S, 2.4, humm ? '#bfe9d6' : '#f2e2c2');
      fan.position.copy(shoulder.position);
      fan.rotation.set(0, s > 0 ? 0 : Math.PI, 0);
      this.body.add(fan);
      this.wings.push({ shoulder, wrist, feathers, s, fan });
    }

    // tail fan
    this.tail = [];
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.1 * S, -1.05 * S);
    this.body.add(tailPivot);
    this.tailPivot = tailPivot;
    const tn = humm ? 5 : 7;
    for (let i = 0; i < tn; i++) {
      const f = new THREE.Mesh(featherGeometry((humm ? 1.4 : 1.6) * S, (humm ? 0.4 : 0.45) * S), i % 2 ? plateB : plateC);
      const h = new THREE.Group();
      f.rotation.x = -Math.PI / 2 - 0.0;
      f.rotation.z = Math.PI; // point backward
      h.add(f);
      tailPivot.add(h);
      this.tail.push({ h, i, n: tn });
    }

    // legs / feet (the songbird grips its branch)
    this.legs = [];
    for (const s of [-1, 1]) {
      const leg = new Leg({ lengths: [0.35 * S, 0.3 * S, 0.12 * S], radii: [0.06 * S, 0.045 * S, 0.035 * S], mats: [mat.brassAged, mat.steel, mat.steel], jointMat: mat.gold, claw: true });
      leg.root.position.set(s * 0.22 * S, -0.5 * S, 0.0);
      this.body.add(leg.root);
      this.legs.push({ leg, s });
    }
    this.group.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
  }

  beakTipWorld(target = new THREE.Vector3()) {
    return this.head.localToWorld(target.copy(this.beakTipLocal));
  }

  // spread 0 folded → 1 open; flap amplitude; freq in Hz; tailSpread;
  // headTilt/headYaw; ruffle (0..1) lifts individual plates
  setPose({ t = 0, spread = 1, flap = 0, freq = 2, tailSpread = 0.5, headTilt = 0, headYaw = 0, headPitch = 0, pitch = 0, roll = 0, perch = 0, ruffle = 0, raise = 0 }) {
    const S = this.S;
    this.body.rotation.set(pitch, 0, roll, 'YXZ');
    this.head.rotation.set(headTilt * 0.5 + headPitch, headYaw, headTilt, 'YXZ');
    const humm = this.kind === 'hummingbird';
    const beat = t * freq * TAU;
    for (const w of this.wings) {
      const s = w.s;
      // folded: wings swept back along the body; open: out to the side
      const sweepBack = lerp(1.35, humm ? 0.15 : 0.05, spread);
      const flapA = Math.sin(beat) * flap * (humm ? 0.95 : 1.05);
      const stroke = humm ? Math.cos(beat) * flap * 0.55 : 0; // figure-eight
      const up = lerp(-0.15, 0.1, spread) + raise * 1.2 + flapA;
      // yaw about Y: positive "back" swings the arm toward the tail on both sides
      w.shoulder.rotation.set(stroke * 0.6 + (humm ? 0 : -Math.cos(beat) * flap * 0.15), s * sweepBack, s * up, 'YZX');
      for (const f of w.feathers) {
        // primaries fan around the wrist. Angles are chosen in body space
        // (0 = pointing at the tail, π/2 = straight out) and the arm's sweep
        // is cancelled so folded feathers lie neatly along the flank.
        const k = f.i / (f.n - 1);
        const open = humm ? 0.55 + 0.75 * k : 0.12 + 1.42 * k;
        const bodyAngle = lerp(0.03 + k * 0.08, open, spread);
        f.holder.rotation.set(0, -s * (bodyAngle + sweepBack), 0);
      }
      w.fan.material.opacity = humm ? 0.045 * clamp((flap - 0.4) * 2) : 0;
      w.fan.rotation.z = up * 0.2;
    }
    for (const f of this.tail) {
      const k = f.i / (f.n - 1) - 0.5;
      f.h.rotation.set(0.1 + (humm ? Math.sin(beat * 0.25) * 0.05 : 0), k * lerp(0.25, 1.2, tailSpread), 0);
    }
    // a gentle ruffle travels along the plates
    if (ruffle > 0.001 || this._ruffled) {
      this._ruffled = ruffle > 0.001;
      const im = this.backPlates;
      const m4 = new THREE.Matrix4();
      const tmp = new THREE.Matrix4();
      if (!this._baseMats) {
        this._baseMats = [];
        for (let i = 0; i < im.count; i++) { const m = new THREE.Matrix4(); im.getMatrixAt(i, m); this._baseMats.push(m); }
      }
      this._plateList.forEach((f, i) => {
        const wave = Math.max(0, Math.sin(t * 6 - f.row * 0.9 + f.col * 0.3)) * ruffle * 0.5;
        tmp.makeRotationX(-wave);
        m4.copy(this._baseMats[i]).multiply(tmp);
        im.setMatrixAt(i, m4);
      });
      im.instanceMatrix.needsUpdate = true;
    }
    for (const l of this.legs) {
      const drop = lerp(1.35, 1.5, perch);
      l.leg.joints[0].rotation.set(lerp(0.9, 0.2, perch), 0, -l.s * (Math.PI / 2 + drop) * 0 + Math.PI, 'YZX');
      l.leg.joints[1].rotation.set(lerp(-1.4, -0.8, perch), 0, 0);
      l.leg.joints[2].rotation.set(lerp(-0.5, -1.2, perch), 0, 0);
    }
  }
}
