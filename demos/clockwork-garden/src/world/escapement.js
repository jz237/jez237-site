import * as THREE from 'three';
import { gearGeometry, escapeWheelGeometry, pitchRadius, meshAngle } from '../geometry/gears.js';
import { screwGeometry, jewelGeometries, spiralPoints, collarGeometry } from '../geometry/parts.js';
import { hullShape, circleHole, plateGeometry } from '../geometry/shapes.js';
import { B, tickState } from '../direction/beats.js';
import { clamp, easeOutCubic, sseg } from '../core/ease.js';

// The garden's heartbeat: a Swiss-lever escapement set into a perlage-grained
// brass plate among the roots. The balance swings, the pallet fork flicks at
// every zero crossing, the escape wheel advances half a tooth, and the train
// beyond it steps forward in sympathy. Each tick charges the copper root.

const TAU = Math.PI * 2;
const ESC_TEETH = 15;

export class Escapement {
  constructor(mat) {
    this.group = new THREE.Group();
    this.group.name = 'escapement';
    const g = this.group;

    // ---- main plate ---------------------------------------------------
    const plateShape = new THREE.Shape();
    plateShape.absarc(0, 0, 3.3, 0, TAU, false);
    const plate = new THREE.Mesh(plateGeometry(plateShape, 0.35, 0.05), mat.brassPlate);
    plate.receiveShadow = true;
    g.add(plate);
    // bezel ring
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(3.32, 0.12, 12, 96), mat.gold);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.y = -0.05;
    g.add(bezel);

    // Layout on the plate (x, z): balance, fork pivot, escape wheel, train.
    this.B = new THREE.Vector3(-1.05, 0, 0.55);
    this.P = new THREE.Vector3(0.45, 0, -0.05);
    const toP = new THREE.Vector3().subVectors(this.P, this.B).normalize();
    this.E = this.P.clone().addScaledVector(toP, 1.18);
    this.forkDir = Math.atan2(-(this.B.z - this.P.z), this.B.x - this.P.x); // angle in plate (x, -z)
    this.escR = 0.82;

    // ---- balance wheel ---------------------------------------------------
    const balance = new THREE.Group();
    balance.position.set(this.B.x, 0.95, this.B.z);
    const rimShape = new THREE.Shape();
    rimShape.absarc(0, 0, 1.08, 0, TAU, false);
    rimShape.holes.push(circleHole(0, 0, 0.94, 64));
    const rim = new THREE.Mesh(new THREE.ExtrudeGeometry(rimShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2, curveSegments: 48 }), mat.gold);
    rim.rotation.x = -Math.PI / 2;
    rim.castShadow = true;
    balance.add(rim);
    for (let a = 0; a < 3; a++) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.09), mat.gold);
      arm.rotation.y = (a / 3) * Math.PI;
      arm.position.y = 0.04;
      balance.add(arm);
    }
    // timing screws around the rim (alternating gold / blued)
    const sg = screwGeometry(0.075);
    for (let i = 0; i < 16; i++) {
      const s = new THREE.Mesh(sg, i % 4 === 0 ? mat.steelBlued : mat.gold);
      const a = (i / 16) * TAU;
      s.position.set(Math.cos(a) * 1.08, 0.05, Math.sin(a) * 1.08);
      s.rotation.z = -Math.PI / 2;
      s.rotation.y = -a;
      // point the screw head radially outward
      s.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
      balance.add(s);
    }
    // roller table with the ruby impulse pin, pointing at the fork at rest
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 24), mat.steel);
    roller.position.y = -0.22;
    balance.add(roller);
    const impulse = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 10), mat.ruby);
    impulse.position.set(0.17, -0.28, 0);
    balance.add(impulse);
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 10), mat.steel);
    balance.add(staff);
    g.add(balance);
    this.balance = balance;
    this.restAngle = Math.atan2(-(this.P.z - this.B.z), this.P.x - this.B.x);

    // hairspring: rebuilt each frame while visible so it breathes with the swing
    this.hairMat = mat.steelBlued;
    this.hair = new THREE.Mesh(new THREE.BufferGeometry(), this.hairMat);
    this.hair.position.set(this.B.x, 0.62, this.B.z);
    g.add(this.hair);
    this._hairAngle = null;

    // ---- pallet fork --------------------------------------------------
    const fork = new THREE.Group();
    fork.position.set(this.P.x, 0.55, this.P.z);
    const toB = new THREE.Vector3().subVectors(this.B, this.P);
    const forkLen = toB.length() - 0.24;
    const lever = new THREE.Mesh(new THREE.BoxGeometry(forkLen, 0.05, 0.07), mat.steel);
    lever.position.x = forkLen / 2;
    fork.add(lever);
    // fork horns
    for (const s of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.04), mat.steel);
      horn.position.set(forkLen + 0.05, 0, s * 0.06);
      horn.rotation.y = s * 0.4;
      fork.add(horn);
    }
    // anchor arms carrying the ruby pallet stones toward the escape wheel
    const palletSpread = 0.62; // radians each side of the centre line as seen from the escape wheel
    this.pallets = [];
    const eLocal = new THREE.Vector3(-(this.E.distanceTo(this.P)), 0, 0); // escape wheel lies opposite the balance
    for (const s of [-1, 1]) {
      const sx = eLocal.x + Math.cos(palletSpread) * this.escR * 1.04;
      const sz = s * Math.sin(palletSpread) * this.escR * 1.04;
      const armLen = Math.hypot(sx, sz);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(armLen, 0.05, 0.08), mat.steel);
      arm.position.set(sx / 2, 0, sz / 2);
      arm.rotation.y = -Math.atan2(sz, sx);
      fork.add(arm);
      const stone = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.16), mat.ruby.clone());
      stone.position.set(sx, 0, sz);
      stone.rotation.y = -Math.atan2(sz, sx) + Math.PI / 2;
      fork.add(stone);
      this.pallets.push(stone);
    }
    // forkLen axis points toward the balance in local +X: rotate the group
    fork.rotation.y = Math.atan2(-(this.B.z - this.P.z), this.B.x - this.P.x);
    this.forkBase = fork.rotation.y;
    g.add(fork);
    this.fork = fork;

    // ---- escape wheel and pinion -------------------------------------------
    const esc = new THREE.Mesh(escapeWheelGeometry({ teeth: ESC_TEETH, radius: this.escR, thickness: 0.07 }), mat.steel);
    esc.rotation.x = -Math.PI / 2;
    const escHolder = new THREE.Group();
    escHolder.position.set(this.E.x, 0.55, this.E.z);
    escHolder.add(esc);
    const escPinion = new THREE.Mesh(gearGeometry({ teeth: 8, module: 0.05, thickness: 0.18, spokes: 0 }), mat.steel);
    escPinion.rotation.x = -Math.PI / 2;
    escPinion.position.y = -0.22;
    escHolder.add(escPinion);
    g.add(escHolder);
    this.esc = escHolder;

    // ---- fourth and third wheels (step forward with each tick) --------------
    const m = 0.05;
    this.train = [];
    const dir4 = 0.9; // radians, direction from escape arbor to fourth wheel in plate coords
    const r4 = pitchRadius(8, m) + pitchRadius(48, m);
    const W4 = { x: this.E.x + Math.cos(dir4) * r4, z: this.E.z - Math.sin(dir4) * r4, teeth: 48, dir: dir4 };
    const wheel4 = new THREE.Mesh(gearGeometry({ teeth: 48, module: m, thickness: 0.07, spokes: 4, curved: 0.3 }), mat.brass);
    wheel4.rotation.x = -Math.PI / 2;
    const h4 = new THREE.Group();
    h4.position.set(W4.x, 0.33, W4.z);
    h4.add(wheel4);
    const pin4 = new THREE.Mesh(gearGeometry({ teeth: 8, module: m, thickness: 0.16, spokes: 0 }), mat.steel);
    pin4.rotation.x = -Math.PI / 2;
    pin4.position.y = 0.12;
    h4.add(pin4);
    g.add(h4);
    const dir3 = 2.3;
    const r3 = pitchRadius(8, m) + pitchRadius(54, m);
    const W3 = { x: W4.x + Math.cos(dir3) * r3, z: W4.z - Math.sin(dir3) * r3 };
    const wheel3 = new THREE.Mesh(gearGeometry({ teeth: 54, module: m, thickness: 0.07, spokes: 5, curved: -0.25 }), mat.brass);
    wheel3.rotation.x = -Math.PI / 2;
    const h3 = new THREE.Group();
    h3.position.set(W3.x, 0.45, W3.z);
    h3.add(wheel3);
    g.add(h3);
    this.h4 = h4;
    this.h3 = h3;
    this.dir4 = dir4;
    this.dir3 = dir3;

    // ---- bridges with jewels and blued screws --------------------------------
    const jw = jewelGeometries(0.07);
    const sgB = screwGeometry(0.1);
    const addBridge = (circles, y, jewels, screws) => {
      const shape = hullShape(circles.map(([x, z, r]) => [x, -z, r]));
      const geo = plateGeometry(shape, 0.12, 0.025);
      const br = new THREE.Mesh(geo, mat.gold);
      br.position.y = y;
      br.castShadow = true;
      br.receiveShadow = true;
      g.add(br);
      for (const [x, z] of jewels) {
        const ch = new THREE.Mesh(jw.chaton, mat.gold);
        ch.position.set(x, y, z);
        g.add(ch);
        const rb = new THREE.Mesh(jw.ruby, mat.ruby);
        rb.position.set(x, y, z);
        g.add(rb);
      }
      for (const [x, z] of screws) {
        const s = new THREE.Mesh(sgB, mat.steelBlued);
        s.position.set(x, y, z);
        s.rotation.y = (x * 7.1 + z * 3.3) % TAU;
        g.add(s);
      }
    };
    // balance cock: arm from the plate edge to the balance centre
    addBridge([[this.B.x, this.B.z, 0.3], [-2.55, 1.55, 0.42]], 1.12, [[this.B.x, this.B.z]], [[-2.55, 1.55]]);
    // pallet bridge
    addBridge([[this.P.x, this.P.z, 0.18], [this.P.x + 0.25, this.P.z + 0.75, 0.25]], 0.68, [[this.P.x, this.P.z]], [[this.P.x + 0.25, this.P.z + 0.75]]);
    // escape + fourth wheel bridge (shared)
    addBridge([[this.E.x, this.E.z, 0.2], [W4.x, W4.z, 0.22], [2.55, -1.6, 0.35]], 0.72, [[this.E.x, this.E.z], [W4.x, W4.z]], [[2.55, -1.6]]);
    addBridge([[W3.x, W3.z, 0.2], [W3.x - 0.6, W3.z + 0.9, 0.32]], 0.6, [[W3.x, W3.z]], [[W3.x - 0.6, W3.z + 0.9]]);

    // engraved regulator index on the balance cock
    const index = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.05), mat.steelBlued);
    index.position.set(this.B.x - 0.45, 1.28, this.B.z + 0.2);
    index.rotation.y = 0.5;
    g.add(index);

    // ---- outlet: brass connector where the copper root leaves the plate -------
    this.outletLocal = new THREE.Vector3(3.05, 0.05, 1.45);
    const outlet = new THREE.Mesh(collarGeometry(0.42, 0.5), mat.gold);
    outlet.position.copy(this.outletLocal);
    outlet.rotation.z = Math.PI / 2;
    outlet.rotation.y = -Math.atan2(1.45, 3.05);
    g.add(outlet);
    this.outlet = outlet;
    // glowing coupling crystal inside the outlet
    this.outletGlow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb257'), toneMapped: true }));
    this.outletGlow.position.copy(this.outletLocal);
    g.add(this.outletGlow);

    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    this.palletGlow = 0;
  }

  // Orientation of the escapement in the world (set by the garden layout).
  place(position, rotationY = 0, tiltX = 0) {
    this.group.position.copy(position);
    this.group.rotation.set(tiltX, rotationY, 0, 'YXZ');
  }

  outletWorld(target = new THREE.Vector3()) {
    return this.group.localToWorld(target.copy(this.outletLocal));
  }

  update(t, ctx) {
    const P = B.balancePeriod;
    const amp = 2.35 * sseg(t, B.balanceStart, B.balanceStart + 1.6);
    const local = t - B.balanceStart;
    const swing = local > 0 ? amp * Math.sin((TAU * local) / P) : 0;
    this.balance.rotation.y = this.restAngle + swing;

    const ts = tickState(t);
    // fork flips at each tick, snapping between its banking pins
    const flip = clamp(ts.since / 0.06);
    const side = ts.count % 2 === 0 ? 1 : -1;
    const forkAngle = ts.count === 0 ? 0.13 : side * 0.13 * (2 * easeOutCubic(flip) - 1) * -1;
    this.fork.rotation.y = this.forkBase + forkAngle;

    // escape wheel: half a tooth per tick with a small recoil
    const half = TAU / ESC_TEETH / 2;
    const steps = Math.max(0, ts.count - 1) + (ts.count > 0 ? easeOutCubic(clamp(ts.since / 0.05)) : 0);
    const recoil = ts.count > 0 ? -Math.exp(-ts.since * 40) * Math.sin(ts.since * 90) * 0.012 : 0;
    const escAngle = -(steps * half) + recoil;
    this.esc.rotation.y = escAngle;
    // fourth and third wheels mesh with the escape pinion and step with it
    const a4 = meshAngle(escAngle, 8, 48, this.dir4);
    this.h4.rotation.y = a4;
    this.h3.rotation.y = meshAngle(a4, 8, 54, this.dir3);

    // each tick sparks the pallet stones
    const spark = ts.count > 0 ? Math.exp(-ts.since * 9) : 0;
    const charge = sseg(t, 0.8, B.pulseLaunch);
    for (const s of this.pallets) s.material.emissiveIntensity = 0.6 + spark * (0.8 + 2.2 * charge);
    this.tickSpark = spark;
    this.charge = charge;

    // outlet crystal brightens as the charge builds, bursts at launch, then settles
    const burst = Math.exp(-Math.max(0, t - B.pulseLaunch) * 3) * (t > B.pulseLaunch ? 1 : 0);
    const glow = 0.12 + charge * 1.0 + spark * charge * 0.9 + burst * 3.0;
    this.outletGlow.material.color.setRGB(1.0 * glow, 0.62 * glow, 0.28 * glow);

    // hairspring breathing (only rebuild while it can be seen)
    if (ctx.visible.escapement) {
      const q = Math.round(swing * 200) / 200;
      if (q !== this._hairAngle) {
        this._hairAngle = q;
        const breath = 1 + swing * 0.035;
        const pts = spiralPoints(9, 0.1, 0.62 * breath, 360, this.restAngle + q * 0.5);
        const curve = new THREE.CatmullRomCurve3(pts);
        this.hair.geometry.dispose();
        this.hair.geometry = new THREE.TubeGeometry(curve, 360, 0.011, 5, false);
      }
    }
  }
}
