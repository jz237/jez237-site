// Hero (assault trooper + morph wheel, one rig) and the world-3 attack fighter.
import * as THREE from 'three';
import { G, Rig, xf, warp, mirrorZ, lin, clamp, lerp, smooth, approach, TAU, ik2, V3 } from './lib.mjs';

const C = {
  slate: '#56677a', slateD: '#3d4957', bone: '#a7a294', orange: '#c35f28', suit: '#2c2f34', suitD: '#1c1e22',
  pouch: '#434336', metal: '#767c86', gun: '#3a3e45', steel: '#9aa3ad',
};
const VISOR = lin('#6cf3ff', 3.6), SEAM = lin('#6cf3ff', 2.4), THRUST = lin('#86dcff', 3.2), RED = lin('#ff4d3a', 4), GREEN = lin('#5dff8a', 4), WHITE = [5, 5, 5];
export const WEAPON_GLOW = { spread: '#ffd23f', beam: '#6cf3ff', bounce: '#ff7ad9' };

// helper: translate a geometry
const at = (g, x, y, z, r, s) => xf(g, [x, y, z], r, s);
const curveZ = (k, zc = 0, from = -1e9) => (v) => { const d = v.z - zc; if (v.y > from) v.x -= k * d * d; };

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
const GUN0 = new V3(2.3, 21.3, 1.0);       // gun bone, model space
export const MUZZLE_LOCAL = new V3(11.0, 0.25, 0);
const GRIP = new V3(1.25, -2.0, 0.8), FORE = new V3(4.7, -1.5, -0.3);
const UA = 4.9, FA = 4.7, SHZ = 4.1;

export function buildHero() {
  const r = new Rig(1 / 20);
  r.bone('body', 'root', 0, 0, 0)
    .bone('pelvis', 'body', 0, 15.4, 0).bone('spine', 'pelvis', 0, 17.2, 0).bone('chest', 'spine', 0, 20.4, 0)
    .bone('head', 'chest', 0.5, 25.0, 0)
    .bone('uaN', 'chest', -0.4, 23.0, SHZ).bone('faN', 'uaN', -0.4, 23.0 - UA, SHZ)
    .bone('uaF', 'chest', -0.4, 23.0, -SHZ).bone('faF', 'uaF', -0.4, 23.0 - UA, -SHZ)
    .bone('gun', 'chest', GUN0.x, GUN0.y, GUN0.z)
    .bone('pack', 'chest', -3.3, 21.6, 0).bone('thrN', 'pack', -5.5, 17.4, 1.9).bone('thrF', 'pack', -5.5, 17.4, -1.9)
    .bone('thN', 'pelvis', 0, 15.0, 2.3).bone('shN', 'thN', 0, 8.2, 2.3).bone('ftN', 'shN', 0, 1.6, 2.35)
    .bone('thF', 'pelvis', 0, 15.0, -2.3).bone('shF', 'thF', 0, 8.2, -2.3).bone('ftF', 'shF', 0, 1.6, -2.35)
    .bone('ball', 'root', 0, 8, 0);

  // ---- helmet (angular; visor slit wraps the sides so it reads in profile) ----
  const H = (g) => at(g, 0.5, 25.0, 0);
  const helm = G.ext([[-2.2, -0.3], [-2.75, 1.0], [-2.55, 3.1], [-1.5, 4.45], [0.5, 4.85], [2.2, 4.25], [3.3, 3.05], [2.9, 2.75], [3.0, 1.85], [3.25, 1.0], [2.95, -0.1], [1.6, -0.85], [-0.2, -0.95], [-1.6, -0.75]], 4.4, 0.45, { steps: 3 });
  warp(helm, (v) => { if (v.x > 0) v.x -= 0.05 * v.z * v.z * (v.x / 3); if (v.y > 3) v.y -= 0.06 * v.z * v.z * (v.y - 3) / 2; });
  r.add('head', 'paint', H(helm), C.slate);
  r.add('head', 'paint', H(G.ext([[-2.3, 3.35], [-1.4, 4.6], [0.5, 5.2], [2.1, 4.65], [3.0, 3.6], [2.0, 3.95], [0.4, 4.45], [-1.2, 4.0]], 1.6, 0.25)), C.bone);
  r.add('head', 'paint', H(G.ext([[-2.65, 0.7], [-1.0, 0.35], [-1.2, -1.15], [-2.45, -0.75]], 4.0, 0.25)), C.slateD);
  r.add('head', 'metal', H(G.ext([[2.75, 1.7], [3.2, 1.78], [3.12, 2.88], [2.7, 2.8]], 3.6, 0.1)), C.suitD);
  r.add('head', 'glow', H(G.ext([[2.95, 2.05], [3.28, 2.1], [3.25, 2.5], [2.92, 2.46]], 3.3, 0.06)), VISOR);
  for (const s of [1, -1]) {
    const zs = s * 2.2;
    // side slit: recessed dark channel + bright tapered strip
    r.add('head', 'metal', H(at(G.ext([[0.2, 1.95], [3.15, 1.72], [3.2, 2.88], [0.5, 2.7]], 0.3, 0.08), 0, 0, zs)), C.suitD);
    r.add('head', 'glow', H(at(G.ext([[0.55, 2.12], [3.2, 2.0], [3.22, 2.55], [0.8, 2.48]], 0.22, 0.05), 0, 0, zs + s * 0.1)), VISOR);
    r.add('head', 'paint', H(at(G.ext([[0.5, -0.75], [2.95, -0.05], [3.15, 1.55], [1.6, 1.68], [0.2, 0.6]], 0.45, 0.14), 0, 0, zs + s * 0.05)), C.slateD);
    r.add('head', 'paint', H(at(G.ext([[-2.4, 3.0], [-0.6, 3.75], [1.8, 3.55], [1.6, 3.15], [-0.5, 3.3], [-2.2, 2.6]], 0.3, 0.1), 0, 0, zs + s * 0.06)), C.orange);
    r.add('head', 'metal', H(at(G.box(1.5, 1.7, 0.5, 0.18), -1.25, 1.55, zs + s * 0.12)), C.metal);
    r.add('head', 'metal', H(at(G.box(0.9, 0.25, 0.3, 0.06), -1.25, 1.0, zs + s * 0.4)), C.gun);
    r.add('head', 'metal', H(at(G.box(0.9, 0.25, 0.3, 0.06), -1.25, 1.55, zs + s * 0.4)), C.gun);
    r.add('head', 'metal', H(at(G.cyl(0.42, 0.48, 0.8, 8), 3.0, 0.35, s * 0.85, [0, 0, -Math.PI / 2 + 0.25])), C.gun);
  }
  r.add('head', 'metal', H(at(G.cyl(0.1, 0.13, 4.0, 5), -1.8, 4.5, 2.35, [0, 0, 0.3])), C.metal);
  r.add('head', 'glow', H(at(G.sph(0.2, 6, 4), -2.38, 6.42, 2.35)), RED);
  r.add('head', 'suit', H(at(G.cyl(1.25, 1.4, 1.8, 10), 0.0, -1.0, 0)), C.suit);

  // ---- torso ----------------------------------------------------------------
  r.add('chest', 'suit', at(G.box(5.6, 6.4, 7.2, 1.6, 1), 0, 22.0, 0), C.suit);
  const chestPlate = G.ext([[-2.4, 19.6], [2.5, 19.8], [3.4, 21.4], [3.35, 23.2], [2.2, 24.4], [-1.0, 24.6], [-2.7, 23.6], [-3.0, 21.0]], 8.2, 0.6, { steps: 5 });
  warp(chestPlate, curveZ(0.06));
  r.add('chest', 'paint', chestPlate, C.slate);
  const sternum = G.ext([[1.0, 20.2], [3.25, 20.9], [3.65, 22.6], [3.0, 23.7], [1.4, 23.5]], 3.2, 0.35, { steps: 3 });
  warp(sternum, (v) => { v.x -= 0.06 * v.z * v.z - 0.12; });
  r.add('chest', 'paint', sternum, C.bone);
  for (const s of [1, -1]) {
    r.add('chest', 'paint', at(G.ext([[-1.8, 23.9], [1.7, 23.55], [1.9, 23.1], [-1.8, 23.45]], 0.4, 0.1), 0, 0, s * 3.85), C.orange);
    r.add('chest', 'metal', at(G.box(0.9, 0.9, 0.5, 0.2), 2.3, 21.2, s * 3.7), C.metal);   // chest fasteners
  }
  r.add('chest', 'metal', at(G.torus(1.9, 0.45, 6, 16), 0.3, 24.6, 0, [Math.PI / 2, 0, 0]), C.gun);
  for (let i = 0; i < 3; i++) r.add('chest', 'metal', at(G.box(0.25, 2.8 - i * 0.4, 0.25), 3.25 + 0.1 * i, 22.2, 1.1 - i * 1.1), C.gun); // vents on sternum side
  // abdomen
  r.add('spine', 'suit', at(G.box(4.6, 4.2, 6.0, 1.2, 1), 0.1, 18.2, 0), C.suit);
  for (let i = 0; i < 3; i++) {
    const y0 = 16.55 + i * 1.25;
    const band = G.ext([[-2.2, y0], [2.4 - i * 0.1, y0 + 0.05], [2.6 - i * 0.1, y0 + 0.6], [2.35 - i * 0.1, y0 + 1.1], [-2.1, y0 + 1.1]], 6.6 - i * 0.2, 0.3, { steps: 3 });
    warp(band, curveZ(0.06));
    r.add('spine', 'paint', band, C.slateD);
  }
  // pelvis / belt
  r.add('pelvis', 'suit', at(G.box(5.0, 1.6, 7.0, 0.5), 0.1, 15.9, 0), C.suitD);
  r.add('pelvis', 'metal', at(G.box(0.7, 1.2, 1.8, 0.2), 2.6, 15.9, 0), C.steel);
  r.add('pelvis', 'paint', at(G.ext([[1.0, 15.2], [2.7, 15.1], [2.4, 13.4], [1.4, 13.0]], 2.6, 0.3), 0, 0, 0), C.slateD);
  for (const s of [1, -1]) {
    r.add('pelvis', 'suit', at(G.box(1.6, 1.8, 1.2, 0.35), -1.5, 15.5, s * 3.45), C.pouch);
    r.add('pelvis', 'suit', at(G.box(1.4, 1.6, 1.1, 0.35), 0.8, 15.6, s * 3.5), C.pouch);
    r.add('pelvis', 'suit', at(G.sph(1.5, 8, 6), 0, 15.0, s * 2.3), C.suit);
  }
  r.add('pelvis', 'suit', at(G.box(1.2, 2.0, 4.4, 0.4), -2.6, 15.4, 0), C.pouch);

  // ---- backpack -------------------------------------------------------------
  r.add('pack', 'paint', at(G.box(3.4, 6.6, 6.2, 0.8, 1), -5.0, 21.3, 0), C.slateD);
  r.add('pack', 'paint', at(G.ext([[-6.6, 24.2], [-3.4, 24.4], [-3.3, 25.0], [-4.4, 25.5], [-6.4, 25.1]], 5.0, 0.3), 0, 0, 0), C.bone);
  for (let i = -1; i <= 1; i++) r.add('pack', 'metal', at(G.box(0.35, 5.2, 0.6, 0.12), -6.75, 21.3, i * 1.8), C.gun);
  for (const s of [1, -1]) {
    r.add('pack', 'metal', at(G.cyl(0.85, 0.85, 4.6, 10), -5.0, 21.4, s * 3.45), C.metal);
    r.add('pack', 'metal', at(G.torus(0.86, 0.14, 4, 12), -5.0, 22.8, s * 3.45, [Math.PI / 2, 0, 0]), C.gun);
    r.add('pack', 'metal', at(G.torus(0.86, 0.14, 4, 12), -5.0, 20.0, s * 3.45, [Math.PI / 2, 0, 0]), C.gun);
    r.add('pack', 'glow', at(G.box(0.2, 1.4, 0.2), -4.15, 21.4, s * 3.9), THRUST.map(c => c * 0.6));
    // thrusters: nozzle shells (pack bone) + inner glow + flame (thr bones)
    const nz = G.lathe([[0.45, 0], [0.7, -0.2], [0.95, -1.1], [1.02, -1.6], [0.86, -1.62], [0.62, -0.5], [0.4, -0.3]], 12);
    r.add('pack', 'metal', at(nz, -5.5, 19.0, s * 1.9, [0, 0, -0.25]), C.gun);
    r.add('pack', 'glow', at(G.cyl(0.78, 0.78, 0.12, 10), -5.85, 17.5, s * 1.9, [0, 0, -0.25]), THRUST);
    const flame = G.lathe([[0.7, 0], [0.55, -1.2], [0.3, -2.6], [0.02, -3.6]], 8);
    r.add(s > 0 ? 'thrN' : 'thrF', 'glow', at(flame, -5.5, 17.4, s * 1.9, [0, 0, -0.25]), THRUST.map(c => c * 0.8));
  }

  // ---- arms --------------------------------------------------------------------
  for (const s of [1, -1]) {
    const ua = s > 0 ? 'uaN' : 'uaF', fa = s > 0 ? 'faN' : 'faF', z = s * SHZ, X = -0.4, Y = 23.0;
    r.add(ua, 'suit', at(G.sph(1.35, 8, 6), X, Y, z), C.suit);
    r.add(ua, 'suit', at(G.capsule(1.05, 3.0, 3, 8), X, Y - 2.6, z), C.suit);
    const K = 0.68;
    const sc = (pts) => pts.map(([x, y]) => [x * K, y * K + 0.35]);
    const lame = (pts, d, zo, col, tilt) => r.add(ua, 'paint', at(G.ext(sc(pts), d, 0.16, { steps: 2 }), X, Y, z + s * zo, [s * -tilt, 0, 0]), col);
    lame([[-2.9, 0.2], [-2.1, 2.2], [0.6, 2.75], [2.6, 1.8], [2.9, -0.2], [0.2, -0.75], [-2.6, -0.5]], 0.5, 1.45, C.slate, 0.22);
    lame([[-2.8, -0.4], [2.7, -0.4], [2.5, -1.75], [-2.4, -1.85]], 0.45, 1.25, C.slateD, 0.12);
    lame([[-2.5, -1.55], [2.4, -1.5], [2.1, -2.75], [-2.1, -2.85]], 0.4, 1.08, C.slate, 0.05);
    r.add(ua, 'paint', at(G.ext(sc([[-2.7, 0.9], [-1.8, 2.45], [0.8, 2.85], [2.7, 1.7], [1.8, 1.2], [-1.5, 1.4]]), 3.0, 0.25), X, Y, z * 1.04 + s * 0.15), C.bone);
    r.add(ua, 'paint', at(G.ext(sc([[-1.6, 2.15], [0.7, 2.55], [2.2, 1.85], [2.0, 1.55], [0.6, 2.15], [-1.5, 1.85]]), 0.26, 0.07), X, Y, z + s * 1.72, [s * -0.22, 0, 0]), C.orange);
    r.add(ua, 'metal', at(G.cyl(0.26, 0.26, 0.26, 8), X - 1.15, Y + 0.6, z + s * 1.78, [Math.PI / 2, 0, 0]), C.metal);
    r.add(ua, 'metal', at(G.cyl(0.26, 0.26, 0.26, 8), X + 1.25, Y + 0.6, z + s * 1.78, [Math.PI / 2, 0, 0]), C.metal);
    let bic = G.shell(1.35, 1.8, 1.35, 0.3, -0.6, Math.PI + 0.6, 0.6, 2.4, 8, 4);
    if (s < 0) bic = mirrorZ(bic);
    r.add(ua, 'paint', at(bic, X, Y - 3.1, z), C.slateD);
    // forearm
    const E = Y - UA;
    r.add(fa, 'suit', at(G.sph(1.05, 8, 6), X, E, z), C.suit);
    r.add(fa, 'paint', at(G.sph(1.0, 8, 6), X - 0.35, E + 0.1, z, null, [0.8, 1, 1]), C.slateD);
    r.add(fa, 'paint', at(G.box(2.1, 3.0, 2.1, 0.55, 1), X, E - 2.0, z), C.slate);
    r.add(fa, 'metal', at(G.box(0.4, 2.0, 1.0, 0.1), X + 1.05, E - 2.0, z + s * 0.2), C.gun);
    r.add(fa, 'glow', at(G.box(0.15, 0.8, 0.5), X + 1.12, E - 1.6, z + s * 0.6), VISOR.map(c => c * 0.5));
    r.add(fa, 'suit', at(G.box(1.6, 1.7, 1.5, 0.45, 1), X, E - FA + 0.25, z), C.suitD);
    r.add(fa, 'metal', at(G.box(0.5, 1.2, 1.3, 0.15), X + 0.75, E - FA + 0.3, z), C.gun);
  }

  // ---- legs ---------------------------------------------------------------------
  for (const s of [1, -1]) {
    const th = s > 0 ? 'thN' : 'thF', sh = s > 0 ? 'shN' : 'shF', ft = s > 0 ? 'ftN' : 'ftF', z = s * 2.3;
    r.add(th, 'suit', at(G.capsule(1.5, 4.6, 3, 8), 0, 11.6, z), C.suit);
    const tp = G.ext([[-1.2, 14.0], [1.85, 13.9], [2.05, 11.2], [1.55, 9.5], [-0.4, 9.55], [-1.5, 11.8]], 1.6, 0.4, { steps: 2 });
    warp(tp, curveZ(0.25, 0));
    r.add(th, 'paint', at(tp, 0, 0, z + s * 0.75), C.slate);
    r.add(th, 'paint', at(G.ext([[1.75, 13.6], [2.2, 13.5], [2.3, 10.5], [1.8, 10.0]], 2.4, 0.2), 0, 0, z), C.slateD);
    r.add(th, 'paint', at(G.ext([[-1.6, 15.5], [1.9, 15.35], [1.75, 13.0], [-1.3, 13.4]], 0.6, 0.18), 0, 0, z + s * 1.6, [s * 0.12, 0, 0]), C.slateD);
    r.add(th, 'paint', at(G.box(1.2, 0.3, 0.3, 0.1), 0.3, 14.6, z + s * 1.95), C.orange);
    // shin
    r.add(sh, 'suit', at(G.capsule(1.15, 4.4, 3, 8), 0, 4.9, z), C.suit);
    const knee = at(G.ext([[0.2, 9.4], [1.5, 9.2], [2.05, 8.2], [1.75, 6.9], [0.6, 7.1]], 2.2, 0.4, { steps: 2 }), 0, 0, z);
    warp(knee, curveZ(0.3, z));
    r.add(sh, 'paint', knee, C.bone);
    const guard = at(G.ext([[0.35, 7.5], [1.55, 7.3], [1.68, 5.0], [1.38, 2.8], [0.35, 2.6]], 2.5, 0.3, { steps: 3 }), 0, 0, z);
    warp(guard, curveZ(0.2, z));
    r.add(sh, 'paint', guard, C.slate);
    r.add(sh, 'paint', at(G.box(1.2, 3.4, 2.0, 0.45), -0.95, 5.4, z), C.slateD);
    r.add(sh, 'metal', at(G.box(0.3, 1.6, 0.4, 0.1), 1.65, 5.6, z), C.gun);
    // boot
    const boot = at(G.ext([[-1.5, 0.45], [3.0, 0.45], [3.55, 0.8], [3.25, 1.2], [1.8, 1.7], [1.3, 2.8], [-1.2, 3.0], [-1.75, 1.7]], 2.6, 0.42, { steps: 2 }), 0, 0, z);
    warp(boot, curveZ(0.12, z));
    r.add(ft, 'paint', boot, C.slateD);
    r.add(ft, 'suit', at(G.ext([[-1.65, 0], [3.3, 0], [3.7, 0.55], [-1.8, 0.6]], 2.75, 0.2), 0, 0, z), C.suitD);
    r.add(ft, 'metal', at(G.box(1.1, 0.8, 2.2, 0.3), 2.8, 1.0, z), C.metal);
  }

  // ---- rifle (gun bone) --------------------------------------------------------
  const Gp = (g) => at(g, GUN0.x, GUN0.y, GUN0.z);
  r.add('gun', 'paint', Gp(G.ext([[-1.6, -1.1], [4.6, -1.1], [4.95, -0.4], [4.95, 1.0], [4.2, 1.45], [-0.8, 1.45], [-1.6, 0.9]], 1.9, 0.3)), '#46505c');
  r.add('gun', 'suit', Gp(G.ext([[-6.0, -1.7], [-4.9, -1.75], [-1.6, -0.9], [-1.6, 1.0], [-2.4, 1.3], [-5.6, 0.95], [-6.2, 0.2]], 1.5, 0.3)), C.suit);
  r.add('gun', 'suit', Gp(at(G.box(0.6, 2.8, 1.6, 0.2), -6.15, -0.4, 0)), C.suitD);
  r.add('gun', 'suit', Gp(G.ext([[0.6, -1.0], [1.95, -1.0], [1.65, -3.4], [0.6, -3.65], [0.3, -3.2]], 1.2, 0.25)), C.suitD);
  r.add('gun', 'metal', Gp(G.ext([[2.4, -1.0], [3.7, -1.0], [3.95, -3.5], [2.85, -3.8]], 1.3, 0.2)), C.gun);
  r.add('gun', 'paint', Gp(at(G.cyl(0.8, 0.8, 4.6, 12), 7.2, 0.25, 0, [0, 0, -Math.PI / 2])), C.slate);
  for (const x of [5.9, 6.9, 7.9, 8.9]) r.add('gun', 'metal', Gp(at(G.torus(0.8, 0.13, 4, 12), x, 0.25, 0, [0, Math.PI / 2, 0])), C.gun);
  r.add('gun', 'metal', Gp(at(G.cyl(0.38, 0.38, 1.2, 8), 10.0, 0.25, 0, [0, 0, -Math.PI / 2])), C.metal);
  const brake = G.lathe([[0.3, 0], [0.65, 0], [0.65, 0.3], [0.5, 0.36], [0.5, 0.6], [0.65, 0.66], [0.65, 1.05], [0.3, 1.05]], 10);
  r.add('gun', 'metal', Gp(at(brake, 10.0, 0.25, 0, [0, 0, -Math.PI / 2])), C.steel);
  r.add('gun', 'metal', Gp(at(G.box(4.6, 0.3, 0.8, 0.1), 1.6, 1.6, 0)), C.gun);
  r.add('gun', 'suit', Gp(at(G.cyl(0.55, 0.6, 2.7, 10), 1.8, 2.35, 0, [0, 0, -Math.PI / 2])), C.suitD);
  r.add('gun', 'metal', Gp(at(G.box(0.8, 0.8, 0.9, 0.2), 1.2, 1.95, 0)), C.gun);
  r.add('gun', 'accent', Gp(at(G.cyl(0.42, 0.42, 0.1, 10), 3.2, 2.35, 0, [0, 0, -Math.PI / 2])), [1, 1, 1]);
  r.add('gun', 'accent', Gp(at(G.capsule(0.42, 2.4, 2, 8), 6.6, -0.95, 0, [0, 0, Math.PI / 2])), [1, 1, 1]);
  for (const x of [5.4, 7.8]) r.add('gun', 'metal', Gp(at(G.torus(0.48, 0.12, 4, 10), x, -0.95, 0, [0, Math.PI / 2, 0])), C.gun);
  for (const s of [1, -1]) r.add('gun', 'accent', Gp(at(G.box(4.4, 0.22, 0.1), 1.9, 0.5, s * 0.97)), [1, 1, 1]);
  r.add('gun', 'suit', Gp(G.ext([[5.0, -0.8], [5.9, -0.8], [5.75, -2.6], [5.15, -2.6]], 1.0, 0.2)), C.suitD);

  // ---- morph wheel (ball bone) ----------------------------------------------------
  const B = (g) => at(g, 0, 8, 0);
  r.add('ball', 'suit', B(G.sph(6.9, 12, 8)), C.suitD);
  r.add('ball', 'glow', B(G.torus(7.1, 0.3, 4, 28)), SEAM);
  r.add('ball', 'glow', B(at(G.torus(7.1, 0.3, 4, 28), 0, 0, 0, [Math.PI / 2, 0, 0])), SEAM);
  r.add('ball', 'glow', B(at(G.torus(7.1, 0.3, 4, 28), 0, 0, 0, [0, Math.PI / 2, 0])), SEAM);
  for (let k = 0; k < 4; k++) for (let h = 0; h < 2; h++) {
    const u0 = k * Math.PI / 2 + 0.065, u1 = (k + 1) * Math.PI / 2 - 0.065;
    const v0 = h ? Math.PI / 2 + 0.06 : 0.07, v1 = h ? Math.PI - 0.07 : Math.PI / 2 - 0.06;
    r.add('ball', 'paint', B(G.shell(7.75, 7.75, 7.75, 0.7, u0, u1, v0, v1, 5, 4)), (k + h) % 2 ? C.slate : C.bone);
  }
  for (const s of [1, -1]) {
    r.add('ball', 'metal', B(at(G.cyl(2.3, 2.6, 1.2, 14), 0, 0, s * 7.35, [Math.PI / 2, 0, 0])), C.metal);
    r.add('ball', 'glow', B(at(G.torus(1.55, 0.2, 4, 18), 0, 0, s * 7.98)), SEAM);
    r.add('ball', 'metal', B(at(G.cyl(0.7, 0.7, 0.5, 6), 0, 0, s * 8.0, [Math.PI / 2, 0, 0])), C.gun);
  }
  return r.build();
}

// pose helpers
function legH(th, sh) { return 6.8 * Math.cos(th) + 6.6 * Math.cos(th + sh) + 1.6; }
const POSE_KEYS = ['thN', 'shN', 'ftN', 'thF', 'shF', 'ftF', 'spine', 'chest', 'head', 'pelvisY', 'pelvisX', 'twist', 'spreadN', 'spreadF'];
function zeroPose() { const p = {}; for (const k of POSE_KEYS) p[k] = 0; return p; }
function addPose(out, p, w) { if (w <= 0) return; for (const k of POSE_KEYS) out[k] += (p[k] || 0) * w; }

const _tgt = new V3(), _pole = new V3(), _gm = new THREE.Matrix4(), _mv = new V3();
const POLE_N = new V3(-0.4, -1, 1.2), POLE_F = new V3(-0.2, -1, -1.1);

export function heroAnimator(inst, kitMats) {
  const B = inst.bones;
  const st = { yaw: 0, morph: 0, crouch: 0, air: 0, water: 0, phase: 0, run: 0, land: 0, prevVy: 0, wasGround: true,
    aim: 0, recoil: 0, lastCd: 0, time: 0, pose: zeroPose(), roll: 0, thrust: 0, fireGlow: 0, weapon: null, aimDown: 0 };
  const accent = inst.byMat.accent;
  const muzzle = new V3();
  function setWeapon(w) {
    if (st.weapon === w) return; st.weapon = w;
    const c = new THREE.Color(WEAPON_GLOW[w] || WEAPON_GLOW.spread);
    accent.userData.baseColor.setRGB(c.r * 4, c.g * 4, c.b * 4); inst.fx.dirty = true;
  }
  function update(p, s, dt, t) {
    dt = Math.min(dt, 0.05);
    st.time += dt;
    setWeapon(p.weapon);
    st.water = approach(st.water, p.inWater ? 1 : 0, 5, dt);
    const slow = 1 - 0.45 * st.water;
    // facing: turn through the camera side
    st.yaw = approach(st.yaw, (p.facing >= 0 ? 0 : -Math.PI), 24, dt);
    // morph (0.15 s)
    const mt = p.morph ? 1 : 0; st.morph = mt > st.morph ? Math.min(1, st.morph + dt / 0.15) : Math.max(0, st.morph - dt / 0.15);
    st.crouch = approach(st.crouch, p.crouch ? 1 : 0, 28, dt);
    const ground = !!p.onGround;
    st.air = approach(st.air, ground ? 0 : 1, ground ? 30 : 14, dt);
    if (ground && !st.wasGround && st.prevVy > 260) st.land = clamp(st.prevVy / 650, 0.35, 1);
    st.land = Math.max(0, st.land - dt * 5.5);
    st.wasGround = ground; st.prevVy = p.vy;
    const speed = Math.abs(p.vx), sf = clamp(speed / 205, 0, 1);
    if (ground) { const cyc = lerp(22, 62, sf); st.phase += (speed * dt) / cyc * TAU; }
    st.run = approach(st.run, ground && !p.crouch && speed > 8 ? smooth(speed / 70) : 0, 12, dt);

    // ---- aim ---------------------------------------------------------------
    let aimT = 0, beam = false;
    if (p.beamActive && p.beam) { aimT = Math.atan2(-p.beam.dy, Math.abs(p.beam.dx) || 1e-3); beam = true; }
    else if (p.weapon === 'spread' && p.aimDir) aimT = p.aimDir < 0 ? Math.PI / 2 : -Math.PI / 2;
    if (p.crouch) aimT = Math.min(aimT, 0) - 0.04;
    st.aim = approach(st.aim, aimT, beam ? 40 : 22, dt);
    st.aimDown = approach(st.aimDown, !ground && aimT < -1 ? 1 : 0, 16, dt);
    // recoil when the cooldown is re-armed (a shot just left the barrel)
    if (p.cooldown > st.lastCd + 1e-4 && !beam) { st.recoil = 1; st.fireGlow = 1; }
    st.lastCd = p.cooldown || 0;
    if (beam) { st.recoil = Math.max(st.recoil, 0.25 + 0.15 * Math.sin(st.time * 90)); st.fireGlow = 1; }
    st.recoil = Math.max(0, st.recoil - dt * 9); st.fireGlow = Math.max(0, st.fireGlow - dt * 5);

    // ---- pose blend -----------------------------------------------------------
    const T = st.time * slow, ph = st.phase;
    const P = zeroPose();
    // idle
    const idle = { thN: 0.06, shN: -0.14, ftN: 0.08, thF: -0.1, shF: -0.1, ftF: 0.2, spine: -0.03, chest: 0.015 * Math.sin(T * 1.7), head: 0.02 * Math.sin(T * 0.7) };
    // run (near leg phase ph, far leg ph + PI)
    const amp = lerp(0.5, 1.0, sf);
    const leg = (q) => ({ th: (0.66 * Math.sin(q) + 0.06) * amp, sh: -(0.18 + 1.3 * Math.pow(Math.max(0, Math.cos(q + 0.5)), 1.3)) * amp, ft: 0.35 * Math.cos(q + 0.2) * amp - 0.05 });
    const ln = leg(ph), lf = leg(ph + Math.PI);
    const run = { thN: ln.th, shN: ln.sh, ftN: ln.ft, thF: lf.th, shF: lf.sh, ftF: lf.ft, spine: -0.14 * sf, chest: -0.03, head: 0.1 * sf, twist: 0.1 * Math.sin(ph) * sf };
    // air
    const fall = smooth((p.vy + 120) / 520);
    const rise = { thN: 1.0, shN: -1.55, ftN: 0.25, thF: -0.3, shF: -0.8, ftF: -0.35, spine: -0.06, head: 0.08 };
    const drop = { thN: 0.35, shN: -0.45, ftN: -0.1, thF: -0.12, shF: -0.35, ftF: -0.3, spine: 0.04, head: -0.05, spreadN: 0.08, spreadF: 0.08 };
    const tuck = { thN: 1.35, shN: -2.1, ftN: 0.3, thF: 1.15, shF: -1.95, ftF: 0.2, spine: -0.15, head: -0.1 };
    // swim (in water, off the ground): slow scissor kick
    const kick = Math.sin(T * 2.4);
    const swim = { thN: 0.25 + 0.35 * kick, shN: -0.55 - 0.3 * Math.sin(T * 2.4 + 1), ftN: -0.35, thF: 0.25 - 0.35 * kick, shF: -0.55 - 0.3 * Math.sin(T * 2.4 + 1 + Math.PI), ftF: -0.35, spine: -0.18, head: 0.15 };
    // crouch: near knee down, far foot planted
    const crouch = { thN: 0.28, shN: -1.88, ftN: -1.25, thF: 1.55, shF: -1.75, ftF: 0.18, spine: -0.42, chest: -0.08, head: 0.38, pelvisX: -0.6 };
    // morph curl
    const curl = { thN: 1.6, shN: -2.3, thF: 1.6, shF: -2.3, spine: -0.9, chest: -0.4, head: -0.4 };

    const wAir = st.air * (1 - st.crouch), wGround = 1 - wAir;
    const wCrouch = st.crouch * wGround, wRun = st.run * (1 - st.crouch) * wGround, wIdle = Math.max(0, wGround - wCrouch - wRun);
    addPose(P, idle, wIdle); addPose(P, run, wRun); addPose(P, crouch, wCrouch);
    if (wAir > 0) {
      const inWater = st.water;
      const airPose = zeroPose();
      addPose(airPose, rise, (1 - fall) * (1 - st.aimDown)); addPose(airPose, drop, fall * (1 - st.aimDown)); addPose(airPose, tuck, st.aimDown);
      addPose(P, airPose, wAir * (1 - inWater)); addPose(P, swim, wAir * inWater);
    }
    if (st.morph > 0) { const w = smooth(st.morph); for (const k of POSE_KEYS) P[k] = lerp(P[k], curl[k] || 0, w); }
    // floaty smoothing (much softer in water)
    const rate = lerp(26, 6, st.water);
    for (const k of POSE_KEYS) st.pose[k] = approach(st.pose[k], P[k], rate, dt);
    const Q = st.pose;

    // ---- apply ---------------------------------------------------------------------
    B.body.rotation.set(0, st.yaw, 0);
    const bodyS = Math.max(0.0001, 1 - smooth(st.morph * 1.7));
    B.body.scale.setScalar(bodyS); B.body.position.set(0, 8 * (1 - bodyS), 0);
    const ballS = Math.max(0.0001, smooth((st.morph - 0.12) / 0.7));
    B.ball.scale.setScalar(ballS);
    // wheel rolls in world space (the ball is not under the facing yaw)
    st.roll -= (p.vx * dt) / 7.8;
    B.ball.rotation.set(0, 0, st.roll + (1 - ballS) * 2.5);

    B.thN.rotation.set(Q.spreadN, 0, Q.thN); B.shN.rotation.set(0, 0, Q.shN); B.ftN.rotation.set(0, 0, Q.ftN);
    B.thF.rotation.set(-Q.spreadF, 0, Q.thF); B.shF.rotation.set(0, 0, Q.shF); B.ftF.rotation.set(0, 0, Q.ftF);
    // ground contact: the longer leg carries the hips
    let py;
    const hN = legH(Q.thN, Q.shN), hF = legH(Q.thF, Q.shF);
    const groundY = Math.max(hN, hF) - 15.0;
    const airY = -1.2 * (1 - fall) * (1 - st.water);
    py = lerp(groundY, airY, wAir) - st.land * 2.4 + (wIdle * 0.12 * Math.sin(T * 1.7));
    if (st.crouch > 0.01) py = lerp(py, -6.8, wCrouch);
    B.pelvis.position.set(Q.pelvisX, 15.4 + py, 0);
    B.pelvis.rotation.set(0, Q.twist * 0.5, 0);
    B.spine.rotation.set(0, -Q.twist * 0.4, Q.spine - st.land * 0.25 + st.aim * 0.08);
    B.chest.rotation.set(0, -Q.twist * 0.5, Q.chest + st.aim * 0.1);
    B.chest.scale.set(1, 1 + 0.012 * Math.sin(T * 1.7) * wIdle, 1);
    B.head.rotation.set(0, 0, Q.head + st.aim * 0.35 - (Q.spine + Q.chest) * 0.5);
    B.pack.rotation.set(0, 0, -st.land * 0.12 + (p.vy || 0) * 0.00012 * wAir);

    // rifle: world aim minus the inherited torso tilt
    const inherited = Q.spine - st.land * 0.25 + st.aim * 0.08 + Q.chest + st.aim * 0.1;
    const ga = st.aim - inherited;
    B.gun.rotation.set(0, 0, ga);
    const rk = st.recoil * 1.1;
    B.gun.position.set(B.gun.userData.rest.x - Math.cos(ga) * rk, B.gun.userData.rest.y - Math.sin(ga) * rk, B.gun.userData.rest.z);
    if (st.crouch > 0.01) B.gun.position.y -= 0.8 * wCrouch;
    B.gun.updateMatrix();
    // arms by IK onto the grips (chest space)
    _tgt.copy(GRIP).applyMatrix4(B.gun.matrix); ik2(B.uaN, B.faN, _tgt, POLE_N, UA, FA);
    _tgt.copy(FORE).applyMatrix4(B.gun.matrix); ik2(B.uaF, B.faF, _tgt, POLE_F, UA, FA);

    // thrusters: burn on the way up and while swimming upward
    const thrT = wAir * (p.vy < 0 ? 1 : 0.25) * (1 - st.water * 0.7) * (1 - st.morph);
    st.thrust = approach(st.thrust, thrT, 14, dt);
    const fl = st.thrust * (0.85 + 0.15 * Math.sin(st.time * 47));
    B.thrN.scale.set(0.6 + 0.4 * fl, Math.max(0.0001, fl * 1.1), 0.6 + 0.4 * fl);
    B.thrF.scale.copy(B.thrN.scale);
    inst.fx.pulse(accent, 1 + st.fireGlow * 0.9 + (beam ? 0.4 : 0));
    inst.fx.apply(0, 0);
    // muzzle position (root-local), for beam / flash placement
    _mv.copy(MUZZLE_LOCAL);
    B.gun.updateWorldMatrix(true, false);
    muzzle.copy(_mv).applyMatrix4(B.gun.matrixWorld);
  }
  return { update, st, muzzle };
}

// ---------------------------------------------------------------------------
// FIGHTER (26 x 14, origin at hitbox centre, faces +x)
// ---------------------------------------------------------------------------
export function buildFighter() {
  const r = new Rig(1 / 20);
  r.bone('body', 'root', 0, 0, 0).bone('flA', 'body', -13.8, -0.4, 3.0).bone('flB', 'body', -13.8, -0.4, -3.0).bone('strobe', 'body', -9.6, 5.6, 0)
    .bone('tipN', 'body', -8.7, -0.2, 10.4).bone('tipF', 'body', -8.7, -0.2, -10.4);
  // fuselage (lathe around x)
  const fus = G.lathe([[0.001, 13.2], [0.5, 12.4], [1.2, 10.4], [2.0, 7.0], [2.55, 3.5], [2.75, 0], [2.6, -5], [2.3, -9], [1.9, -11.6], [1.4, -12.2], [0.001, -12.3]], 16);
  xf(fus, null, [0, 0, -Math.PI / 2]);
  warp(fus, (v) => { v.y *= 0.72; if (v.y < 0) v.y *= 0.8; v.z *= 1.15; }, 'smooth');
  r.add('body', 'paint', fus, C.bone);
  // dorsal spine + intake cheeks
  r.add('body', 'paint', G.ext([[-10.5, 1.0], [2.0, 1.3], [5.5, 1.6], [3.0, 2.4], [-6.0, 2.6], [-10.8, 2.0]], 2.2, 0.35), C.slate);
  for (const s of [1, -1]) {
    r.add('body', 'paint', at(G.ext([[-3.5, -1.6], [4.5, -1.2], [5.6, -0.2], [4.2, 0.9], [-3.5, 1.0]], 1.6, 0.35), 0, 0, s * 2.2), C.slate);
    r.add('body', 'metal', at(G.box(0.4, 2.0, 1.2, 0.1), 5.4, -0.3, s * 2.3), C.suitD);
    r.add('body', 'accent', at(G.box(3.5, 0.18, 0.12), 1.0, -0.4, s * 3.06), lin('#6cf3ff', 3));
    // wings (planform in x/z, thin in y)
    let wing = G.ext([[4.0, -1.8], [-5.5, -10.6], [-9.2, -10.6], [-8.6, -2.2]], 0.55, 0.2);
    xf(wing, null, [Math.PI / 2, 0, 0]); // shape y -> +z
    if (s < 0) wing = mirrorZ(wing);
    r.add('body', 'paint', at(wing, 0, -0.6, 0, [s * -0.05, 0, 0]), C.slate);
    let flap = G.ext([[-6.0, -3.0], [-8.9, -9.8], [-9.9, -9.8], [-9.6, -3.0]], 0.4, 0.12);
    xf(flap, null, [Math.PI / 2, 0, 0]); if (s < 0) flap = mirrorZ(flap);
    r.add('body', 'paint', at(flap, 0, -0.55, 0), C.orange);
    // nacelles
    r.add('body', 'metal', at(G.cyl(1.55, 1.7, 8.4, 14), -8.2, -0.4, s * 3.0, [0, 0, Math.PI / 2]), C.metal);
    r.add('body', 'paint', at(G.cyl(1.7, 1.75, 3.4, 14), -6.5, -0.4, s * 3.0, [0, 0, Math.PI / 2]), C.slateD);
    const noz = G.lathe([[1.5, 0], [1.75, -0.4], [1.55, -1.6], [1.25, -1.62], [1.3, -0.4]], 14);
    r.add('body', 'metal', at(noz, -12.3, -0.4, s * 3.0, [0, 0, -Math.PI / 2]), C.gun);
    r.add('body', 'glow', at(G.cyl(1.25, 1.25, 0.1, 12), -13.8, -0.4, s * 3.0, [0, 0, Math.PI / 2]), THRUST);
    const flame = G.lathe([[1.15, 0], [0.9, -2], [0.45, -4.2], [0.02, -5.6]], 10);
    r.add(s > 0 ? 'flA' : 'flB', 'glow', at(flame, -13.8, -0.4, s * 3.0, [0, 0, -Math.PI / 2]), THRUST.map(c => c * 0.7));
    // tail fins
    r.add('body', 'paint', at(G.ext([[-11.2, 1.4], [-8.0, 1.6], [-9.0, 6.0], [-10.6, 6.2]], 0.5, 0.15), 0, 0, s * 2.0, [s * 0.32, 0, 0]), C.slate);
    // canards
    let can = G.ext([[8.6, -2.0], [6.4, -4.2], [5.4, -4.2], [6.2, -2.0]], 0.35, 0.1);
    xf(can, null, [Math.PI / 2, 0, 0]); if (s < 0) can = mirrorZ(can);
    r.add('body', 'paint', at(can, 0, 0.2, 0), C.slateD);
    // gun pods
    r.add('body', 'metal', at(G.capsule(0.55, 4.0, 2, 8), -1.0, -1.0, s * 6.4, [0, 0, Math.PI / 2]), C.gun);
    r.add('body', 'metal', at(G.cyl(0.22, 0.22, 2.5, 6), 2.2, -1.0, s * 6.4, [0, 0, Math.PI / 2]), C.metal);
    r.add(s > 0 ? 'tipN' : 'tipF', 'glow', at(G.sph(0.42, 6, 4), -8.7, -0.2, s * 10.4), s > 0 ? GREEN : RED);
  }
  // canopy
  r.add('body', 'crystal', at(G.ell(3.6, 1.35, 1.35, 14, 8), 3.6, 1.65, 0), '#1c4658');
  r.add('body', 'metal', at(G.torus(1.42, 0.16, 4, 14, Math.PI), 3.0, 1.6, 0, [0, Math.PI / 2, 0]), C.gun);
  r.add('strobe', 'glow', at(G.sph(0.32, 6, 4), -9.6, 5.9, 0), WHITE);
  return r.build();
}

export function fighterAnimator(inst) {
  const B = inst.bones, st = { pitch: 0, roll: 0, thrust: 0.6, time: 0 };
  function update(p, s, dt) {
    dt = Math.min(dt, 0.05); st.time += dt;
    const vy = p.vy || 0, vx = p.vx || 0;
    st.pitch = approach(st.pitch, clamp(-vy / 240, -1, 1) * 0.2, 10, dt);
    st.roll = approach(st.roll, clamp(vy / 240, -1, 1) * 0.55, 8, dt);
    st.thrust = approach(st.thrust, clamp(0.55 + vx / 240 * 0.5, 0.2, 1.1), 10, dt);
    B.body.rotation.set(st.roll + Math.sin(st.time * 1.3) * 0.03, 0, st.pitch + Math.sin(st.time * 1.7) * 0.015);
    B.body.position.y = Math.sin(st.time * 2.1) * 0.25;
    const f = st.thrust * (0.88 + 0.12 * Math.sin(st.time * 53));
    B.flA.scale.set(Math.max(0.0001, f), 0.7 + 0.3 * f, 0.7 + 0.3 * f); B.flB.scale.copy(B.flA.scale);
    const blink = (st.time % 1.1) < 0.07 ? 1 : 0.0001;
    B.strobe.scale.setScalar(blink);
    const tip = 0.75 + 0.25 * Math.sin(st.time * 6);
    B.tipN.scale.setScalar(tip); B.tipF.scale.setScalar(tip);
    inst.fx.apply(0, 0);
  }
  return { update, st };
}
