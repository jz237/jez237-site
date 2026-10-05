import * as THREE from 'three';
import { Batch, addJewel, frameMatrix, tubeAlong, TAU } from './geo.js';
import { GEM_COLORS, enamelMaterial, rng } from './materials.js';
import { makeBlade, rimPoints } from './petals.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Enamelled leaf on a jeweled pivot hub with a cranked petiole arm.
// Local frame: hub at the origin, blade along +Y, concave face toward +Z.
// `attach` is the stem clamp point in local coordinates.
export function buildLeaf(mats, { L = 10, W = 3.9, kind = 'leaf', seed = 1, attach = V(1.6, -4.5, 0.2), bend = -0.55, sweep = 0.1, hubR = 0.82 } = {}) {
  const r = rng(seed * 53 + 9);
  const blade = makeBlade({ L, W, cup: 0.42, bend: (s) => bend * Math.pow(s, 1.6), lip: 0.2, base: 0.2, shoulder: 0.82, power: 0.95, taper: 0, sweep, nu: 30, nv: 52 });
  const group = new THREE.Group();
  const enamel = new THREE.Mesh(blade.geometry, enamelMaterial(kind, seed, { veins: 'leaf' }));
  enamel.position.z = 0.0;
  group.add(enamel);

  const golds = new Batch(false);
  const gems = new Batch(true);
  golds.add(tubeAlong(rimPoints(blade, 1.0, 70, 0, 0.02, 1), 0.058, { closed: true, seg: 260, radial: 6 }));
  golds.add(tubeAlong(rimPoints(blade, 0.84, 60, 0.012, 0.12, 0.93), 0.022, { closed: true, seg: 200, radial: 4 }));
  // midrib and lateral veins
  const mid = [];
  for (let i = 0; i <= 30; i++) {
    const f = blade.frame(0.04 + (i / 30) * 0.92, 0);
    mid.push(f.pos.clone().addScaledVector(f.n, 0.02));
  }
  golds.add(tubeAlong(mid, 0.045, { seg: 60, radial: 5 }));
  for (let k = 0; k < 9; k++) {
    const s0 = 0.1 + k * 0.095;
    for (const side of [-1, 1]) {
      const pts = [];
      for (let u = 0; u <= 1.001; u += 0.125) {
        const s = Math.min(0.97, s0 + 0.2 * Math.pow(u, 1.25));
        const t = side * 0.9 * Math.pow(u, 0.9);
        const f = blade.frame(s, t);
        pts.push(f.pos.clone().addScaledVector(f.n, 0.018));
      }
      golds.add(tubeAlong(pts, 0.018, { seg: 14, radial: 4 }));
    }
  }
  // jeweled mounts along the border
  const cols = [GEM_COLORS.sapphire, GEM_COLORS.ruby, GEM_COLORS.aqua, GEM_COLORS.emerald, GEM_COLORS.amber];
  for (let i = 0; i < 9; i++) {
    const s = 0.22 + i * 0.075;
    const side = i % 2 ? 1 : -1;
    const f = blade.frame(s, side * 0.86);
    addJewel(gems, golds, frameMatrix(f.pos.clone().addScaledVector(f.n, 0.02), f.n, f.ps), 0.085 + r() * 0.04, cols[i % cols.length], { prongs: 0 });
  }
  addJewel(gems, golds, frameMatrix(blade.frame(0.93, 0).pos.clone().add(V(0, 0, 0.03)), V(0, 0, 1), V(0, 1, 0)), 0.1, GEM_COLORS.ruby, { prongs: 0 });

  // pivot hub
  const hubGeo = new THREE.CylinderGeometry(hubR, hubR * 1.08, 0.5, 32);
  hubGeo.rotateX(Math.PI / 2);
  golds.add(hubGeo, new THREE.Matrix4().makeTranslation(0, 0, 0.1));
  for (const [rad, z, tube] of [[hubR * 0.98, 0.36, 0.07], [hubR * 0.62, 0.38, 0.05], [hubR * 1.06, -0.12, 0.07]]) {
    const t = new THREE.TorusGeometry(rad, tube, 8, 40);
    golds.add(t, new THREE.Matrix4().makeTranslation(0, 0, z));
  }
  addJewel(gems, golds, frameMatrix(V(0, 0, 0.4), V(0, 0, 1), V(0, 1, 0)), hubR * 0.42, GEM_COLORS.sapphire, { prongs: 8 });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    const stud = new THREE.SphereGeometry(0.06, 8, 6);
    golds.add(stud, new THREE.Matrix4().makeTranslation(Math.cos(a) * hubR * 0.8, Math.sin(a) * hubR * 0.8, 0.4));
  }
  // cranked petiole to the stem clamp
  const mid1 = attach.clone().multiplyScalar(0.45).add(V(-0.6, 0.0, -0.45));
  const pts = [V(0, 0, -0.1), V(0.1, -0.7, -0.35), mid1, attach.clone().lerp(mid1, 0.35), attach];
  golds.add(tubeAlong(pts, 0.2, { seg: 50, radial: 10 }));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const band = new THREE.TorusGeometry(0.27, 0.075, 8, 18);
  const p1 = curve.getPoint(0.55);
  const tg = curve.getTangent(0.55);
  golds.add(band, frameMatrix(p1, tg, V(0, 0, 1)));
  const ring = new THREE.TorusGeometry(0.27, 0.06, 8, 18);
  golds.add(ring, frameMatrix(curve.getPoint(0.2), curve.getTangent(0.2), V(0, 0, 1)));
  addJewel(gems, golds, frameMatrix(p1.clone().add(V(0, 0, 0.28)), V(0, 0, 1), V(0, 1, 0)), 0.1, GEM_COLORS.emerald, { prongs: 0 });
  const clamp = new THREE.TorusGeometry(0.42, 0.11, 8, 22);
  golds.add(clamp, frameMatrix(attach, curve.getTangent(1), V(0, 0, 1)));

  const sparkRim = rimPoints(blade, 1.0, 60, 0.06);
  for (let i = Math.floor(r() * 4); i < sparkRim.length; i += 6 + Math.floor(r() * 4)) {
    gems.glints.push({ pos: sparkRim[i].toArray(), color: [1.0, 0.82, 0.5], size: 0.22 + r() * 0.12, hot: 1.0, rate: 2.2 + r() * 3.6 });
  }
  const mg = golds.build(mats.gold);
  const mm = gems.build(mats.gem);
  if (mg) group.add(mg);
  if (mm) group.add(mm);

  group.userData = { blade, hub: V(0, 0, 0.4), attach };
  return group;
}
