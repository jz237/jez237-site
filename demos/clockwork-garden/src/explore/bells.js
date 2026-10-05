import * as THREE from 'three';
import { leafGeometry, taperedTube } from '../geometry/shapes.js';
import { RNG } from '../core/rng.js';
import { clamp } from '../core/ease.js';
import { groundHeight } from './bounds.js';

// Porcelain bellflowers: arching brass stems hung with gilt-rimmed porcelain
// bells, each tuned to a note of D-major pentatonic. Brush past one and it
// swings on its pedicel and rings like a music box. Instanced; only bells
// that are moving update their matrices.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const SCALE = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88, 90, 93];

const SPOTS = [
  [22, 14], [-24, -4], [4, 26], [-2, -26], [28, -24], [-38, 30], [34, 42], [34, -120], [104, -140],
  [34, -330], [104, -390], [14, -548], [128, -585], [-60, -300], [190, -100], [-150, 60], [210, -420], [-120, -520],
];

export class Bellflowers {
  constructor(mat, bounds) {
    this.group = new THREE.Group();
    this.group.name = 'bellflowers';
    const rng = new RNG('bells');
    // canonical plant (height 1): rises then arches over and down
    const curve = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0.02, 0.5, 0), V(0.12, 0.88, 0), V(0.36, 1.0, 0), V(0.58, 0.88, 0), V(0.7, 0.68, 0)]);
    this.curve = curve;
    const stemGeo = taperedTube(curve, 0.022, 0.008, 40, 6);
    // a bell: domed crown, straight waist, then a flared, slightly rolled lip
    const spline = new THREE.SplineCurve([
      new THREE.Vector2(0.001, 0.0), new THREE.Vector2(0.15, -0.02), new THREE.Vector2(0.25, -0.08), new THREE.Vector2(0.29, -0.17),
      new THREE.Vector2(0.295, -0.3), new THREE.Vector2(0.31, -0.41), new THREE.Vector2(0.36, -0.5), new THREE.Vector2(0.45, -0.58),
      new THREE.Vector2(0.52, -0.62), new THREE.Vector2(0.5, -0.635),
    ]);
    const prof = spline.getPoints(26);
    const bellGeo = new THREE.LatheGeometry(prof, 22);
    const rimGeo = new THREE.TorusGeometry(prof[prof.length - 1].x, 0.018, 5, 26);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, -0.62, 0);
    const capGeo = new THREE.SphereGeometry(0.07, 8, 6);
    const clapGeo = new THREE.SphereGeometry(0.055, 8, 6);
    clapGeo.translate(0, -0.55, 0);
    const pedGeo = new THREE.CylinderGeometry(0.008, 0.008, 1, 4);
    pedGeo.translate(0, -0.5, 0);
    const leaf = leafGeometry({ length: 7, width: 2.4, fold: 0.5, arch: 0.7, segU: 8, segV: 3 }).geometry;

    this.plants = [];
    this.bells = [];
    for (let i = 0; i < SPOTS.length; i++) {
      let [x, z] = SPOTS[i];
      for (let t = 0; t < 10 && bounds.clearance(V(x, groundHeight(x, z) + 8, z)) < 3; t++) { x += rng.range(-6, 6); z += rng.range(-6, 6); }
      const H = rng.range(16, 26);
      const yaw = rng.range(0, TAU);
      const base = V(x, groundHeight(x, z) - 0.2, z);
      const plant = { base, H, yaw, q: new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), yaw) };
      this.plants.push(plant);
      const nb = 5 + Math.floor(rng.float() * 3);
      const root = SCALE[Math.floor(rng.float() * 5)];
      for (let b = 0; b < nb; b++) {
        const k = 0.5 + (b / (nb - 1)) * 0.46;
        const p = curve.getPointAt(k);
        const ped = 0.06 + rng.range(0.02, 0.06);
        const local = V(p.x, p.y - 0.01, p.z + rng.range(-0.03, 0.03));
        const pivot = local.clone().multiplyScalar(H).applyQuaternion(plant.q).add(base);
        const size = H * (0.11 - (b / nb) * 0.035);
        const note = SCALE[Math.min(SCALE.length - 1, SCALE.indexOf(root) + (nb - 1 - b))];
        this.bells.push({ plant, pivot, ped: ped * H, size, note, th: 0, om: 0, ax: V(1, 0, 0), last: -10, idx: this.bells.length });
      }
    }
    const n = this.bells.length;
    const P = this.plants.length;
    this.stems = new THREE.InstancedMesh(stemGeo, mat.brassAged, P);
    this.leaves = new THREE.InstancedMesh(leaf, new THREE.MeshPhysicalMaterial({ color: '#6f8247', metalness: 0.65, roughness: 0.45, side: THREE.DoubleSide, clearcoat: 0.3 }), P * 4);
    this.bellMesh = new THREE.InstancedMesh(bellGeo, mat.porcelain, n);
    this.rims = new THREE.InstancedMesh(rimGeo, mat.gold, n);
    this.caps = new THREE.InstancedMesh(capGeo, mat.gold, n);
    this.claps = new THREE.InstancedMesh(clapGeo, mat.brass, n);
    this.peds = new THREE.InstancedMesh(pedGeo, mat.brassAged, n);
    const m4 = new THREE.Matrix4(), s = V(), q = new THREE.Quaternion(), e = new THREE.Euler();
    this.plants.forEach((pl, i) => {
      m4.compose(pl.base, pl.q, s.setScalar(pl.H));
      this.stems.setMatrixAt(i, m4);
      for (let k = 0; k < 4; k++) {
        q.setFromEuler(e.set(rng.range(0.7, 1.2), pl.yaw + k * 1.6 + rng.range(-0.3, 0.3), 0, 'YXZ'));
        m4.compose(pl.base.clone().add(V(0, rng.range(0.5, 4), 0)), q, s.setScalar(rng.range(0.9, 1.4)));
        this.leaves.setMatrixAt(i * 4 + k, m4);
      }
    });
    for (const m of [this.stems, this.leaves, this.bellMesh, this.rims, this.caps, this.claps, this.peds]) {
      m.castShadow = m === this.bellMesh || m === this.stems || m === this.leaves;
      m.receiveShadow = true;
      m.computeBoundingSphere();
      this.group.add(m);
    }
    for (const b of this.bells) this._place(b);
    for (const m of [this.bellMesh, this.rims, this.caps, this.claps, this.peds]) { m.instanceMatrix.needsUpdate = true; m.computeBoundingSphere(); }
    // colliders: stems only (bells are meant to be brushed)
    for (const pl of this.plants) {
      const pts = [0, 0.35, 0.7, 0.85, 1].map((k) => curve.getPointAt(k).multiplyScalar(pl.H).applyQuaternion(pl.q).add(pl.base));
      bounds.chain(pts, 0.6, 'bellstem');
    }
    this.onRing = null;
  }

  _place(b) {
    const m4 = this._m4 || (this._m4 = new THREE.Matrix4());
    const q = new THREE.Quaternion().setFromAxisAngle(b.ax, b.th);
    const s = V();
    // pedicel from the stem down to the bell's crown
    m4.compose(b.pivot, q, s.set(1, b.ped, 1));
    this.peds.setMatrixAt(b.idx, m4);
    const crown = V(0, -b.ped, 0).applyQuaternion(q).add(b.pivot);
    const qb = q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(b.ax, b.th * 0.4));
    m4.compose(crown, qb, s.setScalar(b.size));
    this.bellMesh.setMatrixAt(b.idx, m4);
    this.rims.setMatrixAt(b.idx, m4);
    this.caps.setMatrixAt(b.idx, m4);
    // the clapper lags the swing
    const qc = q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(b.ax, -b.th * 0.5));
    m4.compose(crown, qc, s.setScalar(b.size));
    this.claps.setMatrixAt(b.idx, m4);
    b.mouth = V(0, -0.45 * b.size, 0).applyQuaternion(qb).add(crown);
  }

  // bee: { pos, vel } ; returns nothing, calls onRing(bell, strength)
  update(t, dt, bodies) {
    let moved = false;
    for (const b of this.bells) {
      for (const body of bodies) {
        if (!body) continue;
        const d = body.pos.distanceTo(b.mouth || b.pivot);
        if (d < b.size * 0.75 + 1.4) {
          const v = body.vel;
          const sp = Math.hypot(v.x, v.z);
          if (t - b.last > 0.35 && (sp > 1.5 || Math.abs(v.y) > 1.5 || body.touch)) {
            // swing away from the touch
            b.ax.set(-v.z, 0, v.x);
            if (b.ax.lengthSq() < 1e-4) b.ax.set(1, 0, 0);
            b.ax.normalize();
            b.om += clamp(0.6 + sp * 0.05, 0.6, 2.4);
            b.last = t;
            this.onRing?.(b, clamp(0.4 + sp / 30, 0.4, 1));
          }
        }
      }
      if (Math.abs(b.th) > 1e-4 || Math.abs(b.om) > 1e-4) {
        // damped pendulum on the pedicel
        const w0 = 7.5 / Math.sqrt(b.size);
        b.om += (-w0 * w0 * b.th - 1.6 * b.om) * dt;
        b.th += b.om * dt;
        if (Math.abs(b.th) < 1e-4 && Math.abs(b.om) < 1e-3) { b.th = 0; b.om = 0; }
        this._place(b);
        moved = true;
      }
    }
    if (moved) for (const m of [this.bellMesh, this.rims, this.caps, this.claps, this.peds]) m.instanceMatrix.needsUpdate = true;
  }
}
