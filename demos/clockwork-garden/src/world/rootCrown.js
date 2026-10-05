import * as THREE from 'three';
import { gearGeometry, GearTrain, pitchRadius } from '../geometry/gears.js';
import { screwGeometry, collarGeometry, jewelGeometries } from '../geometry/parts.js';
import { hullShape } from '../geometry/shapes.js';
import { B } from '../direction/beats.js';
import { clamp, rampIntegral, sseg } from '../core/ease.js';

// The root crown: an upright movement at the foot of the hero flower.
// The copper root from the escapement plugs into the mainspring barrel. When
// the pulse arrives the click releases, the barrel turns, and the whole train
// spins up together (meshing gears always share one input angle). The last
// pinion drives a bevel pair that turns the drive shaft up the stem.

export class RootCrown {
  constructor(mat) {
    this.group = new THREE.Group();
    this.group.name = 'rootCrown';
    const g = this.group;
    const m = 0.075;
    const train = new GearTrain(m);
    this.train = train;
    // Layout in the plate's local XY (Z faces outward toward the viewer).
    const barrel = train.addRoot({ teeth: 48, x: -1.5, y: 1.25, ratio: 1, layer: 0, mat: mat.brass, spokes: 0 });
    const p2 = train.addMesh(barrel, { teeth: 12, dir: 0.35, layer: 0, mat: mat.steel });
    const w2 = train.addCompound(p2, { teeth: 40, layer: 1, mat: mat.gold, spokes: 5, curved: 0.3 });
    const p3 = train.addMesh(w2, { teeth: 12, dir: 1.2, layer: 1, mat: mat.steel });
    const w3 = train.addCompound(p3, { teeth: 34, layer: 2, mat: mat.brass, spokes: 6, curved: -0.3 });
    const p4 = train.addMesh(w3, { teeth: 10, dir: 0.15, layer: 2, mat: mat.steel });
    const w4 = train.addCompound(p4, { teeth: 28, layer: 3, mat: mat.rosegold, spokes: 4, curved: 0.25 });
    // an idler on the left to fill the composition (meshes with w2)
    const idler = train.addMesh(w2, { teeth: 26, dir: 2.75, layer: 1, mat: mat.brassAged, spokes: 4 });
    this.barrel = barrel;
    this.finalGear = w4;

    // backplate following the train
    const circles = [];
    for (const gr of train.gears) circles.push([gr.x, gr.y, pitchRadius(gr.teeth, m) + 0.35]);
    circles.push([-1.5, -0.8, 1.6], [1.6, -0.8, 1.4]);
    const plateShape = hullShape(circles);
    const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(plateShape, { depth: 0.25, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }), mat.brassPlate);
    plate.position.z = -0.6;
    g.add(plate);

    this.meshes = [];
    for (const gr of train.gears) {
      const holder = new THREE.Group();
      holder.position.set(gr.x, gr.y, -0.2 + gr.layer * 0.24);
      const geo = gearGeometry({ teeth: gr.teeth, module: m, thickness: gr.teeth < 16 ? 0.22 : 0.13, spokes: gr.spokes ?? 0, curved: gr.curved ?? 0 });
      const mesh = new THREE.Mesh(geo, gr.mat);
      holder.add(mesh);
      // arbor and jewel/screw cap
      if (gr.kind !== 'compound') {
        const arbor = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.3, 8), mat.steel);
        arbor.rotation.x = Math.PI / 2;
        arbor.position.z = 0.1;
        holder.add(arbor);
      }
      g.add(holder);
      this.meshes.push({ gr, holder });
    }
    // mainspring barrel details: ratchet wheel + click, cover with glow window
    const ratchet = new THREE.Mesh(gearGeometry({ teeth: 30, module: 0.06, thickness: 0.1, spokes: 5, curved: 0.35 }), mat.steelBlued);
    const ratchetHolder = new THREE.Group();
    ratchetHolder.position.set(barrel.x, barrel.y, 0.05);
    ratchetHolder.add(ratchet);
    g.add(ratchetHolder);
    this.ratchet = ratchetHolder;
    this.click = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.1), mat.steel);
    this.click.geometry.translate(0.45, 0, 0);
    this.clickHolder = new THREE.Group();
    this.clickHolder.position.set(barrel.x - 1.55, barrel.y + 0.45, 0.06);
    this.clickHolder.add(this.click);
    g.add(this.clickHolder);
    // barrel glow (the stored energy) visible through a crystal window
    this.barrelGlow = new THREE.Mesh(new THREE.CircleGeometry(0.85, 40), new THREE.MeshBasicMaterial({ color: '#ffa640', transparent: true, opacity: 1 }));
    this.barrelGlow.position.set(barrel.x, barrel.y, -0.05);
    g.add(this.barrelGlow);
    const coverRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 8, 48), mat.gold);
    coverRing.position.set(barrel.x, barrel.y, 0.02);
    g.add(coverRing);

    // bridges with blued screws over the upper layers
    const sg = screwGeometry(0.11);
    const jw = jewelGeometries(0.07);
    const bridge = (pts, z) => {
      const shape = hullShape(pts.map(([x, y]) => [x, y, 0.32]));
      const br = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }), mat.gold);
      br.position.z = z;
      g.add(br);
      for (const [x, y, kind] of pts) {
        if (kind === 'j') {
          const c = new THREE.Mesh(jw.chaton, mat.gold);
          c.rotation.x = Math.PI / 2;
          c.position.set(x, y, z + 0.1);
          g.add(c);
          const r = new THREE.Mesh(jw.ruby, mat.ruby);
          r.rotation.x = Math.PI / 2;
          r.position.set(x, y, z + 0.1);
          g.add(r);
        } else {
          const s = new THREE.Mesh(sg, mat.steelBlued);
          s.rotation.x = Math.PI / 2;
          s.position.set(x, y, z + 0.1);
          g.add(s);
        }
      }
    };
    bridge([[w3.x, w3.y, 'j'], [w4.x, w4.y, 'j'], [w4.x + 1.2, w4.y - 1.3, 's']], 0.62);
    bridge([[w2.x, w2.y, 'j'], [w2.x - 0.6, w2.y + 1.5, 's']], 0.5);

    // bevel pair up to the drive shaft: crown wheel on the final arbor
    const crown = new THREE.Group();
    crown.position.set(w4.x, w4.y, 0.8);
    const crownWheel = new THREE.Mesh(gearGeometry({ teeth: 20, module: 0.07, thickness: 0.25, spokes: 0 }), mat.gold);
    crown.add(crownWheel);
    g.add(crown);
    this.crown = crown;
    this.outputLocal = new THREE.Vector3(w4.x, w4.y + 0.9, 0.8);

    // socket where the copper root enters the barrel arbor
    this.inletLocal = new THREE.Vector3(barrel.x - 0.2, barrel.y - 0.2, 0.9);
    const sock = new THREE.Mesh(collarGeometry(0.45, 0.6), mat.gold);
    sock.position.copy(this.inletLocal);
    sock.rotation.x = Math.PI / 2;
    g.add(sock);

    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  place(position, faceAngle) {
    // faceAngle: world-space heading (radians, about Y) the gear face points toward
    this.group.position.copy(position);
    this.group.rotation.set(0, faceAngle, 0);
  }

  inletWorld(target = new THREE.Vector3()) {
    return this.group.localToWorld(target.copy(this.inletLocal));
  }

  update(t) {
    // barrel speed ramps when the click releases; everything follows it
    const input = -rampIntegral(t, B.hubSpin[0], B.hubSpin[1], 0.11);
    this.train.solve(input);
    for (const { gr, holder } of this.meshes) holder.rotation.z = gr.angle;
    this.ratchet.rotation.z = input;
    this.crown.rotation.z = this.finalGear.angle;
    // click lifts as the barrel lets go
    this.clickHolder.rotation.z = -0.25 - sseg(t, B.pulseArrive - 0.1, B.pulseArrive + 0.25) * 0.18;
    // barrel window glows with stored energy
    const charge = sseg(t, B.pulseArrive - 0.4, B.pulseArrive + 0.2);
    const drain = sseg(t, B.hubSpin[0], B.hubSpin[1] + 4) * 0.6;
    const g = (charge * (1 - drain) * 0.55 + 0.04) * (1 + 0.15 * Math.sin(t * 9));
    this.barrelGlow.material.color.setRGB(1.0 * g, 0.6 * g, 0.24 * g);
    this.energy = charge;
  }
}
