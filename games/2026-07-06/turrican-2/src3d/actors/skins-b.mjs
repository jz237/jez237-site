import * as THREE from 'three';
// Enemy skins, worlds 3 (Rift Run), 4 (Cinder Foundry), 5 (Hollow Spire) + fallback shardling.
import { G, Rig, xf, warp, at, tube3, rock, blob, crystals, leg, lin, clamp, lerp, smooth, approach, TAU,
  faceYaw, playerDir, aimAt, turretSignals, hopSignals, applyMount, mountAim, yawPitch, legSwing } from './ekit.mjs';
import { orient } from './skins-a.mjs';

const W3 = { hull: '#30353c', hullL: '#4a5059', hullD: '#1f2328', red: '#8a1c1c', stripe: '#b8862e', metal: '#5c6168' };
const RED = lin('#ff3b2f', 3.6), ORANGE = lin('#ff7a2a', 3.4);
const W4 = { iron: '#302c2a', ironL: '#46403c', rust: '#7a3b1e', brass: '#a07a3a', hazard: '#d8a12a', steel: '#6a6e74', steelL: '#8a8e94' };
const MOLTEN = lin('#ff6a14', 3.6), YELLOW = lin('#ffcf3a', 3.4);
const W5 = { crys: '#8a4dff', crysL: '#b98cff', flesh: '#5a2a4a', fleshL: '#7a3c5e', fleshD: '#3a1a30', bone: '#cdbba2', chitin: '#2a1a2e' };
const ACID = lin('#8fff3f', 3.2), ACIDC = lin('#9cff4a', 3.6);

// ======================= WORLD 3 =============================================
function walturBuild() {
  const r = new Rig();
  r.bone('yaw', 'root', 0, 6, 0).bone('aim', 'yaw', 0, 10.4, 0).bone('gun', 'aim', 0, 10.4, 0);
  r.add('root', 'paint', at(G.cyl(9.4, 10, 2.2, 6), 0, 1.1, 0, [0, Math.PI / 6, 0]), W3.hull);
  r.add('root', 'paint', at(G.torus(8.2, 0.3, 4, 6), 0, 2.3, 0, [Math.PI / 2, 0, Math.PI / 6]), W3.stripe);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.add('root', 'metal', at(G.cyl(0.55, 0.55, 0.6, 6), Math.cos(a) * 7.6, 2.4, Math.sin(a) * 7.6), W3.metal); }
  r.add('root', 'metal', at(G.cyl(5.0, 6.2, 4.4, 12), 0, 4.2, 0), W3.hullD);
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; r.add('root', 'metal', at(G.box(0.5, 3.4, 1.0, 0.1), Math.cos(a) * 5.7, 4.2, Math.sin(a) * 5.7, [0, -a, 0]), W3.metal); }
  r.add('yaw', 'paint', at(G.shell(6.4, 5.6, 6.4, 0.6, 0, TAU, 0, Math.PI / 2 + 0.3, 16, 6), 0, 8.6, 0), W3.hullL);
  r.add('yaw', 'paint', at(G.torus(6.3, 0.45, 5, 18), 0, 7.4, 0, [Math.PI / 2, 0, 0]), W3.red);
  r.add('aim', 'paint', at(G.box(5.0, 4.4, 6.6, 0.9, 2), 3.2, 10.4, 0), W3.hull);
  r.add('aim', 'core', at(G.box(0.3, 0.8, 2.6), 5.75, 11.9, 0), RED);
  for (const z of [1.7, -1.7]) {
    r.add('gun', 'metal', at(G.cyl(0.72, 0.8, 8.6, 10), 9.2, 10.0, z, [0, 0, -Math.PI / 2]), W3.metal);
    r.add('gun', 'metal', at(G.cyl(1.0, 1.0, 1.4, 8), 13.2, 10.0, z, [0, 0, -Math.PI / 2]), W3.hullD);
    r.add('gun', 'core', at(G.torus(0.78, 0.18, 4, 10), 14.0, 10.0, z, [0, Math.PI / 2, 0]), ORANGE);
  }
  return r.build();
}
function walturPose(B, st, e, s, dt, inst) {
  const m = applyMount(st, inst, e, s, 20);
  const a = mountAim(m, e.aim != null ? -e.aim : aimAt(e, s));
  const pitch = yawPitch(st, a, dt, -0.25, 1.5);
  B.yaw.rotation.y = st.yaw; B.aim.rotation.z = pitch;
  turretSignals(st, e, dt);
  B.gun.position.x = -st.kick * 1.8;
  inst.fx.pulse(inst.byMat.core, 0.6 + st.charge * 1.8 + st.kick * 1.2);
}

function interceptorBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8, 0).bone('flame', 'body', -10.0, 8, 0);
  const fus = G.lathe([[0.001, 11.4], [0.6, 10.4], [1.4, 7.6], [2.1, 3.6], [2.3, 0], [2.2, -4], [1.9, -7.6], [1.5, -9.2], [0.001, -9.3]], 14);
  xf(fus, [0, 8, 0], [0, 0, -Math.PI / 2]);
  warp(fus, (v) => { const dy = v.y - 8; v.y = 8 + dy * (dy > 0 ? 1.05 : 0.9); v.z *= 0.9; }, 'smooth');
  r.add('body', 'paint', fus, W3.hull);
  r.add('body', 'crystal', at(G.ell(3.0, 1.1, 1.1, 12, 8), 4.4, 9.3, 0), '#8a3a10');
  r.add('body', 'paint', at(G.ext([[-6.0, 6.2], [3.0, 6.0], [5.0, 5.0], [-5.0, 3.6]], 2.4, 0.4), 0, 0, 0), W3.hullD);
  r.add('body', 'glow', at(G.box(1.6, 0.6, 2.0), 4.2, 5.4, 0), ORANGE.map(c => c * 0.6));
  for (const s of [1, -1]) {
    let wing = G.ext([[-3.8, -1.4], [2.6, -9.6], [0.6, -10.2], [-7.6, -2.6]], 0.5, 0.18);
    xf(wing, null, [Math.PI / 2, 0, 0]); if (s < 0) wing = xf(wing, null, null, [1, 1, -1]);
    r.add('body', 'paint', at(wing, 0, 7.4, 0, [s * -0.42, 0, 0]), W3.hullL);
    r.add('body', 'glow', at(G.box(0.3, 0.25, 7.2), -0.8, 7.4 + 2.4, s * 5.5, [s * -0.42, s * 0.62, 0]), RED);
    r.add('body', 'paint', at(G.ext([[-9.0, 8.4], [-6.0, 8.8], [-7.6, 13.6], [-9.4, 14.0]], 0.45, 0.14), 0, 0, s * 1.6, [s * 0.35, 0, 0]), W3.hullL);
    r.add('body', 'paint', at(G.box(2.6, 1.0, 0.5, 0.15), -8.4, 13.2, s * 2.9, [s * 0.35, 0, 0]), W3.red);
    r.add('body', 'metal', at(G.cyl(0.25, 0.25, 3.2, 6), 9.0, 6.6, s * 1.2, [0, 0, -Math.PI / 2]), W3.metal);
    r.add('body', 'metal', at(G.box(3.2, 1.4, 1.2, 0.3), 3.2, 7.2, s * 2.1), W3.hullD);
  }
  r.add('body', 'metal', at(G.cyl(1.7, 1.4, 1.6, 12), -9.2, 8, 0, [0, 0, Math.PI / 2]), W3.hullD);
  r.add('body', 'glow', at(G.cyl(1.3, 1.3, 0.1, 12), -10.05, 8, 0, [0, 0, Math.PI / 2]), ORANGE);
  r.add('flame', 'glow', at(G.lathe([[1.2, 0], [0.9, -2.2], [0.4, -4.0], [0.02, -5.2]], 10), -10.0, 8, 0, [0, 0, -Math.PI / 2]), lin('#ff6a3a', 2.6));
  return r.build();
}
function interceptorPose(B, st, e, s, dt) {
  const dir = playerDir(e, s);
  B.root.rotation.y = faceYaw(st, dir, dt, 4);
  const vy = st.py != null && dt > 0 ? (e.y - st.py) / dt : 0; st.py = e.y;
  st.bank = approach(st.bank || 0, clamp(vy / 100, -1, 1), 5, dt);
  B.body.rotation.set(st.bank * 0.6, 0, -st.bank * 0.12);
  const f = 0.85 + 0.15 * Math.sin(st.time * 47);
  B.flame.scale.set(f, 1, 1);
}

function seekerBuild() {
  const r = new Rig();
  r.bone('aim', 'root', 0, 8, 0).bone('roll', 'aim', 0, 8, 0).bone('flame', 'roll', -6.1, 8, 0);
  r.add('roll', 'paint', at(G.sph(4.5, 16, 12), 0, 8, 0), W3.hull);
  r.add('roll', 'paint', at(G.torus(4.55, 0.4, 5, 20), 0, 8, 0, [0, Math.PI / 2, 0]), W3.red);
  r.add('roll', 'paint', at(G.torus(4.2, 0.3, 5, 20), -2.2, 8, 0, [0, Math.PI / 2, 0]), W3.stripe);
  r.add('roll', 'metal', at(G.cyl(1.7, 2.6, 1.8, 12), 4.6, 8, 0, [0, 0, -Math.PI / 2]), W3.hullD);
  r.add('roll', 'core', at(G.sph(1.2, 10, 8), 5.6, 8, 0), RED);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.add('roll', 'metal', orient(at(G.cone(0.5, 2.0, 6), 0, 1.0, 0), [0.35, Math.cos(a), Math.sin(a)], [0.8, 8 + Math.cos(a) * 4.0, Math.sin(a) * 4.0]), W3.metal); }
  for (let k = 0; k < 4; k++) {
    const fin = G.ext([[-3.0, 0], [-7.4, 3.6], [-7.8, 3.6], [-6.4, 0]], 0.4, 0.12);
    r.add('roll', 'paint', at(fin, 0, 8, 0, [k * Math.PI / 2 + Math.PI / 4, 0, 0]), W3.hullL);
  }
  r.add('roll', 'metal', at(G.cyl(1.3, 1.6, 1.6, 10), -5.2, 8, 0, [0, 0, Math.PI / 2]), W3.metal);
  r.add('roll', 'glow', at(G.cyl(1.1, 1.1, 0.1, 10), -6.05, 8, 0, [0, 0, Math.PI / 2]), ORANGE);
  r.add('flame', 'glow', at(G.lathe([[1.0, 0], [0.7, -1.8], [0.02, -3.6]], 8), -6.1, 8, 0, [0, 0, -Math.PI / 2]), lin('#ff7a3a', 2.4));
  r.scaleAll(1.12, 0, 8, 0);
  return r.build();
}
function seekerPose(B, st, e, s, dt, inst) {
  const a = aimAt(e, s);
  const right = Math.cos(a) >= 0;
  B.root.rotation.y = faceYaw(st, right ? 1 : -1, dt, 6);
  let pitch = right ? a : Math.PI - a; if (pitch > Math.PI) pitch -= TAU;
  st.pitch = approach(st.pitch || 0, pitch, 7, dt);
  B.aim.rotation.z = st.pitch;
  B.roll.rotation.x = st.time * 3.2;
  B.flame.scale.set(0.8 + 0.2 * Math.sin(st.time * 41), 1, 1);
  inst.fx.pulse(inst.byMat.core, 0.6 + 0.8 * ((st.time * 4) % 1 < 0.5 ? 1 : 0.2));
}

// ======================= WORLD 4 =============================================
function statueBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 3, 0).bone('jaw', 'body', 5.2, 13.6, 0);
  r.add('root', 'paint', at(G.box(18, 3, 12, 0.6, 2), 0, 1.5, 0), W4.ironL);
  r.add('root', 'paint', at(G.box(18.4, 0.6, 12.4, 0.2), 0, 2.9, 0), W4.brass);
  const torso = G.ext([[-5.2, 3], [4.2, 3], [5.4, 8], [4.8, 12.2], [2.2, 15.4], [-2.6, 16], [-5.4, 12]], 9.6, 0.8, { steps: 3 });
  warp(torso, (v) => { v.x -= 0.03 * v.z * v.z; }, true);
  r.add('body', 'paint', torso, W4.iron);
  r.add('body', 'paint', at(G.ext([[-1.2, 12.8], [5.6, 13.0], [6.6, 16.4], [4.2, 19.6], [-0.4, 19.9], [-2.6, 17.2]], 7.2, 0.6, { steps: 2 }), 0, 0, 0), W4.ironL);
  r.add('body', 'paint', at(G.ext([[-3.0, 17.6], [0, 20.4], [3.4, 20.0], [4.6, 18.8], [0.4, 19.0]], 4.0, 0.4), 0, 0, 0), W4.rust);
  r.add('body', 'metal', at(G.box(0.9, 1.6, 4.6, 0.2), 6.3, 15.4, 0), '#1a1716');
  for (let k = 0; k < 3; k++) r.add('body', 'core', at(G.box(0.3, 0.28, 3.8), 6.75, 14.9 + k * 0.5, 0), MOLTEN);
  for (const s of [1, -1]) {
    r.add('body', 'core', at(G.box(0.3, 0.4, 0.9), 6.2, 17.4, s * 1.5, [0, 0, -0.2]), YELLOW);
    r.add('body', 'paint', at(G.ext([[-4.6, 9.5], [1.6, 10.2], [3.6, 13.6], [0.6, 16.0], [-4.2, 14.6]], 2.2, 0.5), 0, 0, s * 5.4), W4.ironL);
    r.add('body', 'paint', at(G.ext([[-3.6, 13.6], [0.4, 14.8], [-0.2, 15.4], [-3.8, 14.6]], 2.3, 0.2), 0, 0, s * 5.4), W4.brass);
    r.add('body', 'paint', tube3([1.0, 10.6, s * 5.6], [4.8, 7.8, s * 5.8], [6.8, 4.6, s * 5.0], 1.5, 1.2), W4.iron);
    r.add('body', 'paint', at(G.box(3.0, 2.2, 2.6, 0.5), 7.2, 4.2, s * 4.6), W4.ironL);
    r.add('body', 'core', at(G.box(1.8, 0.25, 0.2), -1.0, 6.0 + 1.4, s * 4.85), MOLTEN.map(c => c * 0.6));
    r.add('body', 'core', at(G.box(1.8, 0.25, 0.2), -1.0, 6.0, s * 4.85), MOLTEN.map(c => c * 0.6));
  }
  r.add('body', 'paint', at(G.torus(3.6, 0.5, 6, 18), 1.6, 13.6, 0, [Math.PI / 2, 0, 0.35]), W4.brass);
  r.add('jaw', 'paint', at(G.ext([[4.0, 13.8], [6.8, 14.1], [6.6, 12.4], [4.6, 12.0]], 4.6, 0.3), 0, 0, 0), W4.ironL);
  return r.build();
}
function statuePose(B, st, e, s, dt, inst) {
  B.root.rotation.y = faceYaw(st, playerDir(e, s), dt, 3);
  turretSignals(st, e, dt);
  const p = s.player; const d = p ? Math.abs(p.x - e.x) : 999;
  const near = d < 190 ? 1 : 0;
  st.heat = approach(st.heat || 0, near ? Math.max(st.charge, 0.35) : 0.1, 4, dt);
  B.jaw.rotation.z = -0.5 * Math.max(st.kick, st.heat > 0.6 ? (st.heat - 0.6) : 0);
  B.body.rotation.z = -0.04 * st.kick;
  const flick = 0.85 + 0.15 * Math.sin(st.time * 23) * Math.sin(st.time * 7.1);
  inst.fx.pulse(inst.byMat.core, (0.55 + st.heat * 1.6 + st.kick * 1.5) * flick);
}

function beltdroneBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 13, 0);
  for (const [n, z] of [['N', 2.7], ['F', -2.7]]) r.bone('l' + n, 'body', 0, 11.2, z).bone('l' + n + 'k', 'l' + n, 3.0, 6.6, z).bone('l' + n + 'f', 'l' + n + 'k', -1.2, 1.6, z);
  r.add('body', 'paint', at(G.box(12, 7, 8, 1.2, 2), 0.4, 15.0, 0), W4.steel);
  for (let k = 0; k < 5; k++) r.add('body', 'paint', at(G.box(1.1, 2.0, 0.2), -4.2 + k * 2.2, 13.2, 4.05, [0, 0, 0.55]), k % 2 ? '#1a1716' : W4.hazard);
  for (const s of [1, -1]) r.add('body', 'paint', at(G.box(11.4, 0.5, 0.2), 0.4, 14.5, s * 4.08), W4.hazard);
  r.add('body', 'metal', at(G.cyl(0.9, 1.0, 3.6, 10), -3.4, 19.6, -1.6), W4.ironL);
  r.add('body', 'core', at(G.cyl(0.65, 0.65, 0.2, 10), -3.4, 21.45, -1.6), MOLTEN.map(c => c * 0.7));
  for (const y of [12.6, 14.6]) r.add('body', 'metal', at(G.cyl(0.8, 0.8, 7.6, 10), 6.6, y, 0, [Math.PI / 2, 0, 0]), W4.steelL);
  r.add('body', 'paint', at(G.box(4.2, 3.2, 5.0, 0.6), 6.4, 17.2, 0), W4.iron);
  r.add('body', 'metal', at(G.torus(1.2, 0.3, 5, 14), 8.55, 17.4, 0, [0, Math.PI / 2, 0]), W4.brass);
  r.add('body', 'core', at(G.cyl(0.95, 0.95, 0.3, 12), 8.6, 17.4, 0, [0, 0, -Math.PI / 2]), YELLOW);
  r.add('body', 'suit', tube3([-5.6, 16.6, 2.0], [-7.6, 15.0, 3.0], [-6.2, 12.0, 3.6], 0.35, 0.3, 8, 4), '#1a1716');
  r.add('body', 'metal', at(G.box(1.2, 3.6, 1.2, 0.2), 3.4, 10.6, 0), W4.ironL);
  r.add('body', 'metal', tube3([3.4, 9.0, 0], [5.4, 8.0, 0], [6.4, 9.0, 0], 0.32, 0.2, 6, 4), W4.steelL);
  for (const [n, z] of [['N', 2.7], ['F', -2.7]]) {
    r.add('l' + n, 'paint', at(G.sph(1.6, 10, 8), 0, 11.2, z), W4.ironL);
    r.add('l' + n, 'paint', tube3([0, 11.2, z], [1.8, 9.2, z], [3.0, 6.6, z], 1.15, 0.9), W4.steel);
    r.add('l' + n, 'metal', tube3([0.6, 11.6, z + Math.sign(z) * 1.0], [2.0, 9.4, z + Math.sign(z) * 1.0], [3.3, 7.2, z + Math.sign(z) * 1.0], 0.28, 0.28, 6, 4), W4.steelL);
    r.add('l' + n + 'k', 'paint', at(G.sph(1.0, 8, 6), 3.0, 6.6, z), W4.iron);
    r.add('l' + n + 'k', 'paint', tube3([3.0, 6.6, z], [1.0, 4.2, z], [-1.2, 1.6, z], 0.85, 0.6), W4.ironL);
    r.add('l' + n + 'f', 'paint', at(G.ext([[-2.4, 0], [3.2, 0], [3.6, 0.7], [0.4, 1.7], [-1.8, 1.6]], 2.2, 0.3), 0, 0, z), W4.iron);
    r.add('l' + n + 'f', 'paint', at(G.box(1.0, 0.5, 2.3, 0.15), 3.0, 0.45, z), W4.hazard);
  }
  return r.build();
}
function beltdronePose(B, st, e, s, dt) {
  B.root.rotation.y = faceYaw(st, e.facing || -1, dt, 8);
  st.phase += Math.abs(e.vx || 0) * dt / 22 * TAU;
  const p = st.phase;
  for (const [n, o] of [['N', 0], ['F', Math.PI]]) {
    const q = p + o;
    B['l' + n].rotation.z = 0.42 * Math.sin(q);
    B['l' + n + 'k'].rotation.z = -0.35 * Math.max(0, Math.cos(q)) - 0.05;
    B['l' + n + 'f'].rotation.z = -0.42 * Math.sin(q) + 0.35 * Math.max(0, Math.cos(q));
  }
  B.body.position.y = 13 + 0.5 * Math.abs(Math.cos(p)) - 0.4 + 0.08 * Math.sin(st.time * 9);
  B.body.rotation.z = 0.04 * Math.sin(p * 2);
}

function boltspinBuild() {
  const r = new Rig();
  r.bone('spin', 'root', 0, 9, 0);
  r.add('spin', 'paint', at(G.cyl(6.6, 6.6, 4.6, 6), 0, 9, 0, [Math.PI / 2, 0, 0]), W4.ironL);
  r.add('spin', 'metal', at(G.cyl(6.0, 6.6, 0.6, 6), 0, 9, 2.6, [Math.PI / 2, 0, 0]), W4.steel);
  r.add('spin', 'metal', at(G.cyl(6.6, 6.0, 0.6, 6), 0, 9, -2.6, [Math.PI / 2, 0, 0]), W4.steel);
  for (let k = 0; k < 10; k++) {
    const a = k / 10 * TAU;
    const tooth = G.ext([[0, -1.3], [2.6, -0.2], [2.2, 0.9], [0, 1.1]], 2.2, 0.2);
    r.add('spin', 'metal', at(tooth, Math.cos(a) * 6.3, 9 + Math.sin(a) * 6.3, 0, [0, 0, a]), W4.steelL);
  }
  r.add('spin', 'metal', at(G.cyl(2.4, 2.4, 9.6, 12), 0, 9, 0, [Math.PI / 2, 0, 0]), W4.steelL);
  r.add('spin', 'metal', at(G.cyl(3.6, 3.6, 1.4, 6), 0, 9, 4.6, [Math.PI / 2, 0, 0]), W4.steel);
  r.add('spin', 'core', at(G.torus(4.4, 0.42, 5, 6), 0, 9, 2.95, [0, 0, Math.PI / 6]), MOLTEN);
  r.add('spin', 'core', at(G.torus(4.4, 0.42, 5, 6), 0, 9, -2.95, [0, 0, Math.PI / 6]), MOLTEN);
  return r.build();
}
function boltspinPose(B, st, e, s, dt, inst) {
  B.spin.rotation.set(0.1 * Math.sin(st.time * 2), 0.12 * Math.sin(st.time * 1.3), -st.time * 9);
  inst.fx.pulse(inst.byMat.core, 0.8 + 0.25 * Math.sin(st.time * 13));
}

function arcdroneBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 9, 0).bone('rN', 'body', -1, 11.6, 5.6).bone('rF', 'body', -1, 11.6, -5.6).bone('arc0', 'body', 4, 5.4, 1.5).bone('arc1', 'body', 4, 5.4, -1.5);
  r.add('body', 'paint', at(G.capsule(2.8, 6.6, 4, 12), 0, 9.4, 0, [0, 0, Math.PI / 2]), W4.steel);
  r.add('body', 'paint', at(G.cyl(2.9, 2.9, 1.2, 12), -1.0, 9.4, 0, [0, 0, Math.PI / 2]), W4.hazard);
  for (let k = 0; k < 4; k++) r.add('body', 'paint', at(G.box(0.4, 1.3, 6.0), -1.6 + k * 0.4, 9.4, 0, [0, 0, 0]), k % 2 ? '#1a1716' : W4.hazard);
  r.add('body', 'core', at(G.sph(1.1, 10, 8), 5.9, 9.8, 0), YELLOW);
  r.add('body', 'metal', at(G.torus(1.2, 0.25, 5, 12), 5.6, 9.8, 0, [0, Math.PI / 2, 0]), W4.iron);
  for (const [b, s] of [['rN', 1], ['rF', -1]]) {
    r.add('body', 'paint', tube3([-0.5, 10.6, s * 2.4], [-0.8, 11.4, s * 4.0], [-1.0, 11.6, s * 5.0], 0.5, 0.4, 6, 5), W4.ironL);
    r.add('body', 'paint', at(G.torus(3.0, 0.55, 6, 20), -1, 11.6, s * 5.6, [Math.PI / 2, 0, 0]), W4.iron);
    r.add(b, 'metal', at(G.box(5.6, 0.14, 0.7), -1, 11.6, s * 5.6), W4.steelL);
    r.add(b, 'metal', at(G.box(0.7, 0.14, 5.6), -1, 11.6, s * 5.6), W4.steelL);
    r.add(b, 'metal', at(G.cyl(0.5, 0.5, 0.6, 8), -1, 11.6, s * 5.6), W4.brass);
  }
  for (const [b, z] of [['arc0', 1.5], ['arc1', -1.5]]) {
    r.add('body', 'metal', tube3([3, 7.6, z], [4.2, 6.0, z], [5.6, 4.6, z], 0.4, 0.28, 6, 4), W4.steelL);
    for (let k = 0; k < 3; k++) r.add('body', 'metal', at(G.torus(0.5, 0.18, 4, 10), 3.6 + k * 0.6, 6.8 - k * 0.6, z, [0, 0, 0.8]), '#b06a2a');
    const pts = [[5.6, 4.6, z], [6.6, 3.6, z * 0.6], [5.9, 2.6, z * 0.2], [6.9, 1.6, -z * 0.2]];
    r.add(b, 'glow', G.tube(pts, 0.16, 8, 4), lin('#bfe8ff', 4.5));
  }
  r.add('body', 'suit', tube3([-3, 6.8, 0], [-4.4, 4.6, 0.6], [-3.6, 3.2, 1.0], 0.3, 0.2, 8, 4), '#1a1716');
  r.scaleAll(1.25, 0, 8, 0);
  return r.build();
}
function arcdronePose(B, st, e, s, dt) {
  B.root.rotation.y = faceYaw(st, playerDir(e, s), dt, 5);
  B.rN.rotation.y = st.time * 40; B.rF.rotation.y = -st.time * 40;
  B.body.rotation.set(0.08 * Math.sin(st.time * 1.7), 0, 0.08 * Math.sin(st.time * 2.3));
  const h = (k) => { const v = Math.sin(Math.floor(st.time * 24) * 12.9898 + k * 78.2) * 43758.5; return v - Math.floor(v); };
  const a0 = h(1) > 0.35 ? 1 : 0.0001, a1 = h(2) > 0.35 ? 1 : 0.0001;
  B.arc0.scale.set(1, a0 * (0.7 + 0.3 * h(3)), a0); B.arc1.scale.set(1, a1 * (0.7 + 0.3 * h(4)), a1);
}

function armhubBuild() {
  const r = new Rig();
  r.bone('drum', 'root', 0, 4, 0).bone('hL', 'drum', -6, 18.6, 0).bone('hR', 'drum', 6, 18.6, 0);
  const AR = [[0.6, 1], [Math.PI - 0.6, 1], [-Math.PI / 2, 1]];
  AR.forEach(([a], i) => { const cx = Math.cos(a) * 8.6, cz = Math.sin(a) * 8.6; r.bone('a' + i, 'drum', cx, 14, cz).bone('a' + i + 'k', 'a' + i, cx * 1.45, 20, cz * 1.45); });
  r.add('root', 'paint', at(G.cyl(12.6, 13.6, 4, 12), 0, 2, 0), W4.ironL);
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; r.add('root', 'paint', at(G.box(2.2, 3.4, 0.3), Math.cos(a) * 13.3, 2, Math.sin(a) * 13.3, [0, -a + Math.PI / 2, 0.5]), k % 2 ? '#1a1716' : W4.hazard); }
  r.add('drum', 'paint', at(G.cyl(8.4, 9.4, 14, 16), 0, 11, 0), W4.steel);
  for (const y of [5.2, 11, 16.6]) r.add('drum', 'metal', at(G.torus(9.0 - (y - 5) * 0.06, 0.4, 5, 24), 0, y, 0, [Math.PI / 2, 0, 0]), W4.iron);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + 0.3; r.add('drum', 'core', at(G.box(0.3, 3.2, 1.2), Math.cos(a) * 9.0, 8.2, Math.sin(a) * 9.0, [0, -a, 0]), MOLTEN); }
  r.add('drum', 'metal', at(G.cyl(7.6, 8.4, 1.4, 16), 0, 18.6, 0), W4.ironL);
  r.add('drum', 'core', at(G.cyl(5.6, 5.6, 0.4, 16), 0, 18.9, 0), YELLOW);
  for (const [b, s] of [['hL', -1], ['hR', 1]]) {
    r.add(b, 'paint', at(G.box(6.0, 1.0, 11.6, 0.3), s * 3.0, 19.8, 0), W4.ironL);
    r.add(b, 'paint', at(G.box(5.4, 0.3, 1.0), s * 3.0, 20.4, 0), W4.hazard);
  }
  AR.forEach(([a], i) => {
    const cx = Math.cos(a) * 8.6, cz = Math.sin(a) * 8.6, ex = cx * 1.45, ez = cz * 1.45;
    r.add('a' + i, 'paint', at(G.sph(1.6, 10, 8), cx, 14, cz), W4.ironL);
    r.add('a' + i, 'paint', tube3([cx, 14, cz], [cx * 1.3, 17.6, cz * 1.3], [ex, 20, ez], 1.0, 0.8), W4.hazard);
    r.add('a' + i + 'k', 'paint', at(G.sph(1.0, 8, 6), ex, 20, ez), W4.iron);
    r.add('a' + i + 'k', 'metal', tube3([ex, 20, ez], [ex * 0.9, 23.2, ez * 0.9], [ex * 0.7, 25.4, ez * 0.7], 0.7, 0.5), W4.steelL);
    for (const o of [-0.8, 0.8]) r.add('a' + i + 'k', 'metal', tube3([ex * 0.7, 25.4, ez * 0.7], [ex * 0.65 + o, 26.8, ez * 0.65], [ex * 0.55 + o * 0.4, 27.6, ez * 0.55], 0.32, 0.12, 6, 4), W4.iron);
  });
  return r.build();
}
function spawnSignals(st, e, every) {
  const t = e.spawnT != null ? e.spawnT : every;
  if (st.lastSp != null && t > st.lastSp + 0.2) st.burst = 1;
  st.lastSp = t; st.burst = Math.max(0, (st.burst || 0) - 1 / 60 * 1.6);
  st.antic = t < 0.6 ? 1 - t / 0.6 : 0;
}
function armhubPose(B, st, e, s, dt, inst) {
  spawnSignals(st, e, 2.4);
  const open = Math.max(st.antic, st.burst);
  st.open = approach(st.open || 0, open, 10, dt);
  B.hL.rotation.z = st.open * 1.2; B.hR.rotation.z = -st.open * 1.2;
  for (let i = 0; i < 3; i++) {
    const w = Math.sin(st.time * 1.6 + i * 2.1);
    B['a' + i].rotation.set(0.25 * w * (i === 2 ? 1 : 0), 0.3 * w, (i === 2 ? 0 : (i ? -1 : 1) * (0.15 * w - 0.35 * st.open)));
    B['a' + i + 'k'].rotation.z = 0.4 * Math.sin(st.time * 2.2 + i) * (i === 2 ? 0 : 1);
    B['a' + i + 'k'].rotation.x = i === 2 ? 0.4 * Math.sin(st.time * 2.2) - 0.4 * st.open : 0;
  }
  B.drum.scale.set(1 + st.burst * 0.04, 1 - st.burst * 0.03, 1 + st.burst * 0.04);
  inst.fx.pulse(inst.byMat.core, 0.6 + st.open * 1.6 + 0.1 * Math.sin(st.time * 5));
}

// ======================= WORLD 5 =============================================
function huggerBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 4.4, 0);
  r.add('body', 'flesh', at(blob(5.0, 2.0, 3.8, 7, 0.12), 0, 3.9, 0), W5.flesh);
  r.add('body', 'crystal', at(G.shell(5.5, 3.2, 4.4, 0.4, 0, TAU, 0, 1.55, 12, 5), -0.4, 4.4, 0), W5.crys);
  crystals(r, 'body', [[-0.4, 6.8, 0, 0.9, 3.6, 0, 0.35, 3], [-2.8, 6.4, 0.8, 0.7, 2.8, 0.3, 0.6, 5], [1.8, 6.6, -0.6, 0.6, 2.4, -0.3, -0.2, 7], [-4.4, 5.6, -1.0, 0.5, 2.0, -0.3, 0.9, 9]], W5.crysL);
  for (const s of [1, -1]) {
    r.add('body', 'glow', at(G.box(3.4, 0.25, 0.2), -0.6, 2.9, s * 3.55), ACID);
    r.add('body', 'glow', at(G.sph(0.42, 6, 4), 5.2, 4.6, s * 1.0), ACIDC);
    r.add('body', 'glow', at(G.sph(0.3, 6, 4), 4.8, 5.3, s * 1.7), ACIDC);
    r.add('body', 'paint', tube3([5.0, 3.6, s * 1.0], [6.6, 3.4, s * 1.1], [7.0, 2.6, s * 0.3], 0.34, 0.08, 6, 4), W5.bone);
  }
  const HX = [2.6, 0, -2.6];
  for (let i = 0; i < 6; i++) {
    const s = i % 2 ? -1 : 1, hx = HX[Math.floor(i / 2)];
    leg(r, 'l' + i, 'body', [hx, 3.8, s * 2.8], [hx + 0.6, 6.0, s * 5.6], [hx + 1.4, 0.2, s * 6.6], 0.5, 'paint', W5.chitin);
  }
  return r.build();
}
function huggerPose(B, st, e, s, dt) {
  const h = hopSignals(e, 0.65);
  const dir = Math.abs(e.vx || 0) > 1 ? Math.sign(e.vx) : playerDir(e, s);
  B.root.rotation.y = faceYaw(st, dir, dt, 14);
  const speed = Math.abs(e.vx || 0);
  st.phase += (speed * 0.12 + (h.ground ? 0 : 6) + 2) * dt * 2.5;
  for (let i = 0; i < 6; i++) {
    const side = i % 2 ? -1 : 1, grpA = (i === 0 || i === 3 || i === 4), ph = st.phase + (grpA ? 0 : Math.PI);
    const air = h.ground ? 0 : 0.35;
    legSwing(B['l' + i], side, 0.4 * Math.sin(ph), 0.3 * Math.max(0, Math.cos(ph)) + air - 0.3 * h.crouch);
    B['l' + i + 'k'].rotation.x = side * 0.4 * h.crouch;
  }
  B.body.position.y = 4.4 - 1.6 * h.crouch + 0.2 * Math.abs(Math.sin(st.phase * 2));
  B.body.rotation.z = -0.25 * h.air;
}

function leaperBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 10, 0).bone('head', 'body', 5.6, 12.0, 0);
  for (const [n, s] of [['N', 1], ['F', -1]]) {
    r.bone('h' + n, 'body', -2.6, 10.2, s * 3.0).bone('h' + n + 'k', 'h' + n, -6.4, 15.4, s * 4.4).bone('h' + n + 'f', 'h' + n + 'k', -4.0, 2.0, s * 5.0);
    r.bone('f' + n, 'body', 3.4, 8.6, s * 2.4).bone('f' + n + 'k', 'f' + n, 5.0, 6.0, s * 3.6);
  }
  r.add('body', 'flesh', at(blob(6.2, 3.6, 3.7, 11, 0.12), -0.4, 10.6, 0, [0, 0, 0.18]), W5.flesh);
  r.add('body', 'flesh', at(G.ell(4.6, 2.2, 2.8, 12, 8), 0.6, 8.6, 0), W5.fleshL);
  crystals(r, 'body', [[-3.6, 12.6, 0, 1.0, 5.0, 0, 0.7, 3], [-0.8, 13.8, 0.4, 0.95, 5.4, 0.1, 0.4, 5], [2.0, 14.2, -0.3, 0.75, 4.0, -0.1, 0.15, 7], [-5.8, 11.4, -0.6, 0.6, 3.0, -0.2, 1.0, 9]], W5.crys);
  r.add('body', 'glow', at(G.box(5.0, 0.22, 0.2), -0.2, 8.1, 2.8, [0, 0, 0.18]), ACID.map(c => c * 0.55));
  r.add('body', 'glow', at(G.box(5.0, 0.22, 0.2), -0.2, 8.1, -2.8, [0, 0, 0.18]), ACID.map(c => c * 0.55));
  r.add('head', 'flesh', at(G.ell(2.9, 2.4, 2.4, 12, 8), 6.6, 12.4, 0), '#6a3256');
  r.add('head', 'crystal', at(G.crystal(0.6, 3.6, 5, 0.45, 13), 6.4, 14.0, 0, [0, 0, -0.9]), W5.crysL);
  for (const s of [1, -1]) {
    r.add('head', 'glow', at(G.ell(0.7, 0.55, 0.45, 8, 6), 8.4, 13.2, s * 1.4), ACIDC);
    r.add('head', 'paint', tube3([8.6, 11.4, s * 1.0], [10.0, 10.6, s * 0.9], [10.2, 9.6, s * 0.2], 0.42, 0.08, 6, 4), W5.bone);
  }
  for (const [n, s] of [['N', 1], ['F', -1]]) {
    r.add('h' + n, 'flesh', tube3([-2.6, 10.2, s * 3.0], [-3.6, 13.6, s * 3.9], [-6.4, 15.4, s * 4.4], 1.9, 1.1), W5.fleshL);
    r.add('h' + n + 'k', 'suit', at(G.sph(1.0, 8, 6), -6.4, 15.4, s * 4.4), W5.chitin);
    r.add('h' + n + 'k', 'paint', tube3([-6.4, 15.4, s * 4.4], [-5.8, 8.6, s * 4.8], [-4.0, 2.0, s * 5.0], 0.85, 0.45), W5.chitin);
    r.add('h' + n + 'k', 'crystal', at(G.crystal(0.35, 2.0, 5, 0.5, 21), -6.6, 15.8, s * 4.4, [0, 0, 0.6]), W5.crysL);
    r.add('h' + n + 'f', 'paint', tube3([-4.0, 2.0, s * 5.0], [-2.0, 0.6, s * 5.0], [0.4, 0.3, s * 5.0], 0.5, 0.15, 6, 4), W5.bone);
    r.add('f' + n, 'paint', tube3([3.4, 8.6, s * 2.4], [4.6, 7.6, s * 3.2], [5.0, 6.0, s * 3.6], 0.5, 0.4, 6, 4), W5.chitin);
    r.add('f' + n + 'k', 'paint', tube3([5.0, 6.0, s * 3.6], [5.6, 3.0, s * 3.8], [6.0, 0.3, s * 3.9], 0.4, 0.12, 6, 4), W5.bone);
  }
  return r.build();
}
function leaperPose(B, st, e, s, dt) {
  const h = hopSignals(e, 1.2);
  const dir = Math.abs(e.vx || 0) > 1 ? Math.sign(e.vx) : playerDir(e, s);
  B.root.rotation.y = faceYaw(st, dir, dt, 9);
  st.cr = approach(st.cr || 0, h.crouch, 18, dt); st.air = approach(st.air || 0, h.air, 12, dt);
  const rising = Math.max(0, -st.air), falling = Math.max(0, st.air);
  B.body.position.y = 10 - 3.0 * st.cr + 0.15 * Math.sin(st.time * 3);
  B.body.rotation.z = 0.15 * st.cr - 0.3 * st.air;
  for (const n of ['N', 'F']) {
    B['h' + n].rotation.z = -0.35 * st.cr + 0.55 * rising - 0.2 * falling;
    B['h' + n + 'k'].rotation.z = 0.5 * st.cr - 1.1 * rising + 0.3 * falling;
    B['h' + n + 'f'].rotation.z = -0.3 * st.cr + 0.6 * rising;
    B['f' + n].rotation.z = 0.5 * rising - 0.3 * falling + 0.2 * st.cr;
    B['f' + n + 'k'].rotation.z = -0.3 * rising;
  }
  B.head.rotation.z = 0.1 * Math.sin(st.time * 2) - 0.15 * st.cr;
}

function eggpodBuild() {
  const r = new Rig();
  r.bone('sac', 'root', 0, 1, 0).bone('core', 'sac', 0, 15, 0);
  for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + 0.3; r.bone('p' + k, 'sac', Math.cos(a) * 5.4, 9.5, Math.sin(a) * 5.4); }
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.add('root', 'flesh', tube3([Math.cos(a) * 3, 2.0, Math.sin(a) * 3], [Math.cos(a) * 6, 0.8, Math.sin(a) * 6], [Math.cos(a) * 8.6, 0.3, Math.sin(a) * 8.0], 1.0, 0.25, 6, 5), W5.fleshD); }
  crystals(r, 'root', [[-6.4, 0.4, 3.0, 0.8, 3.4, 0.4, 0.7, 3], [6.0, 0.4, -2.6, 0.7, 3.0, -0.4, -0.6, 5], [3.6, 0.3, 4.4, 0.5, 2.0, 0.6, -0.3, 7]], W5.crys);
  const sac = blob(6.4, 7.6, 6.4, 17, 0.08);
  warp(sac, (v) => { if (v.y > 0) { const k = 1 - 0.28 * (v.y / 7.6); v.x *= k; v.z *= k; } }, 'smooth');
  r.add('sac', 'flesh', at(sac, 0, 8.4, 0), '#6a3a5a');
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * TAU + 0.9;
    const pts = []; for (let j = 0; j <= 4; j++) { const t = j / 4, y = 1.6 + t * 12.6; const rr = (Math.sin(t * Math.PI) * 0.35 + 0.72) * 6.4 * (y > 8.4 ? 1 - 0.28 * ((y - 8.4) / 7.6) : 1) + 0.15; pts.push([Math.cos(a + t * 0.5) * rr, y, Math.sin(a + t * 0.5) * rr]); }
    r.add('sac', 'core', G.tube(pts, 0.16, 10, 4), ACID.map(c => c * 0.4));
  }
  r.add('core', 'core', at(G.sph(2.6, 12, 10), 0, 15.2, 0), ACID.map(c => c * 0.9));
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * TAU + 0.3, cx = Math.cos(a) * 5.4, cz = Math.sin(a) * 5.4;
    const pet = G.shard(2.7, 13.0, 5, 30 + k, 0.1);
    xf(pet, null, [0, -a + Math.PI / 2, 0], [1, 1, 0.5]);
    pet.applyMatrix4(leanMatrix(cx, cz, a));
    r.add('p' + k, 'crystal', pet, W5.crys);
  }
  return r.build();
}
// helper matrix: rotate a petal (built vertical at origin) to lean inward from its hinge
function leanMatrix(cx, cz, a) {
  const m = new THREE.Matrix4();
  const lean = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)), 0.5);
  const up = new THREE.Matrix4().makeTranslation(0, 6.0, 0);
  const pos = new THREE.Matrix4().makeTranslation(cx, 9.5, cz);
  m.multiply(pos).multiply(lean).multiply(up);
  return m;
}
function eggpodPose(B, st, e, s, dt, inst) {
  const p = s.player; const hd = (e.cfg && e.cfg.hatchDist) || 90;
  const dx = p ? Math.abs((p.x + p.w / 2) - (e.x + e.w / 2)) : 999, dy = p ? Math.abs(p.y - e.y) : 999;
  const open = dy < 80 ? smooth((hd * 2.3 - dx) / (hd * 1.3)) : 0;
  st.open = approach(st.open || 0, open, 5, dt);
  const beat = Math.pow(0.5 + 0.5 * Math.sin(st.time * (2.6 + st.open * 6)), 3);
  B.sac.scale.set(1 + beat * 0.04, 1 + beat * 0.03, 1 + beat * 0.04);
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * TAU + 0.3;
    const tremble = st.open * 0.05 * Math.sin(st.time * 30 + k * 2);
    const ang = -(st.open * 0.85 + tremble);
    B['p' + k].quaternion.setFromAxisAngle(new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)), ang);
  }
  B.core.scale.setScalar(0.85 + 0.25 * st.open + 0.1 * beat);
  inst.fx.pulse(inst.byMat.core, 0.45 + 0.35 * beat + 1.3 * st.open);
}

function acidmawBuild() {
  const r = new Rig();
  r.bone('stalk', 'root', 0, 3.4, 0).bone('maw', 'stalk', 0, 12, 0);
  for (let k = 0; k < 3; k++) { const a = k / 3 * TAU + 0.5; r.bone('j' + k, 'maw', Math.cos(a) * 3.2, 15.4, Math.sin(a) * 3.2); }
  r.add('root', 'flesh', at(blob(7.2, 3.0, 6.2, 23, 0.15), 0, 1.4, 0), W5.fleshD);
  crystals(r, 'root', [[-5.6, 1.2, 2.4, 1.1, 5.0, 0.35, 0.6, 3], [5.2, 1.0, -2.8, 0.9, 4.2, -0.4, -0.6, 5], [4.0, 0.8, 3.6, 0.7, 3.0, 0.6, -0.4, 7], [-3.4, 0.8, -4.0, 0.6, 2.6, -0.6, 0.4, 9]], W5.crys);
  r.add('stalk', 'flesh', G.taperTube([[0, 2.6, 0], [0.9, 7.6, 0], [0, 12.2, 0]], (t) => lerp(3.0, 2.2, t), 8, 10), '#6a3256');
  for (const y of [5.2, 7.6, 10.0]) r.add('stalk', 'paint', at(G.torus(2.75 - (y - 5) * 0.08, 0.36, 5, 14), 0.5, y, 0, [Math.PI / 2, 0, 0]), W5.bone);
  r.add('stalk', 'core', G.tube([[1.8, 3.0, 2.0], [2.6, 7.0, 1.4], [1.6, 11.6, 1.6]], 0.2, 8, 4), ACID.map(c => c * 0.7));
  r.add('maw', 'flesh', at(G.ell(4.2, 3.0, 4.2, 14, 10), 0, 13.6, 0), W5.fleshL);
  r.add('maw', 'core', at(G.cyl(2.2, 2.6, 0.4, 14), 0, 16.3, 0), ACIDC);
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; r.add('maw', 'crystal', at(G.crystal(0.38, 2.0, 5, 0.5, 40 + k), Math.cos(a) * 2.5, 15.8, Math.sin(a) * 2.5, [Math.sin(a) * -0.5, 0, Math.cos(a) * 0.5]), '#d8c0ff'); }
  for (let k = 0; k < 3; k++) {
    const a = k / 3 * TAU + 0.5;
    const lip = G.shell(4.6, 3.2, 4.6, 0.6, a - 0.95, a + 0.95, 0.15, 1.1, 8, 4);
    r.add('j' + k, 'flesh', at(lip, 0, 14.4, 0), W5.flesh);
  }
  return r.build();
}
function acidmawPose(B, st, e, s, dt, inst) {
  turretSignals(st, e, dt, 2.1);
  const dir = playerDir(e, s);
  st.lean = approach(st.lean || 0, dir * 0.14, 3, dt);
  B.stalk.rotation.set(0.04 * Math.sin(st.time * 1.3), 0, -st.lean + 0.05 * Math.sin(st.time * 1.7) - st.kick * 0.1 * dir);
  const sq = st.charge * 0.16 - st.kick * 0.2;
  B.maw.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
  for (let k = 0; k < 3; k++) {
    const a = k / 3 * TAU + 0.5, op = 0.15 + 0.6 * st.kick - 0.25 * st.charge + 0.06 * Math.sin(st.time * 2 + k);
    B['j' + k].quaternion.setFromAxisAngle(new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)), -op);
  }
  inst.fx.pulse(inst.byMat.core, 0.6 + st.charge * 1.2 + st.kick * 1.8 + 0.12 * Math.sin(st.time * 4));
}

function hivenodeBuild() {
  const r = new Rig();
  r.bone('mass', 'root', 0, 0, 0);
  for (let k = 0; k < 3; k++) r.bone('o' + k, 'mass', [-5, 4.5, 0.5][k], [9, 7, 15][k], [6.4, 6.6, 7.4][k]);
  r.add('mass', 'flesh', at(blob(12.4, 9.4, 9.6, 31, 0.16, 18, 12), 0, 8.4, 0), '#4a2240');
  r.add('mass', 'flesh', at(blob(6.0, 4.6, 5.0, 32, 0.2), -8.4, 4.4, 3.6), W5.flesh);
  r.add('mass', 'flesh', at(blob(5.4, 4.0, 4.6, 33, 0.2), 8.6, 4.0, -2.4), W5.flesh);
  crystals(r, 'mass', [[-2.0, 14.0, -2.6, 2.0, 12.6, -0.15, 0.12, 3], [4.6, 13.0, -3.6, 1.5, 9.0, -0.25, -0.3, 5], [-7.0, 11.6, -1.6, 1.2, 6.4, -0.1, 0.55, 7],
    [8.6, 9.6, 1.6, 1.0, 5.0, 0.3, -0.7, 9], [1.6, 15.4, 2.6, 0.9, 4.2, 0.4, -0.2, 11], [-10.6, 6.0, -3.0, 0.8, 3.6, -0.4, 0.9, 13]], W5.crys);
  for (let k = 0; k < 3; k++) {
    const x = [-5, 4.5, 0.5][k], y = [9, 7, 15][k], z = [6.4, 6.6, 7.4][k];
    const tilt = [0.35, 0.4, -0.1][k];
    r.add('o' + k, 'flesh', at(G.torus(1.9, 0.75, 6, 14), x, y, z, [tilt, 0, x * 0.03]), W5.fleshL);
    r.add('o' + k, 'core', at(G.cyl(1.5, 1.5, 0.3, 12), x, y, z - 0.3, [Math.PI / 2 + tilt, 0, x * 0.03]), ACIDC);
  }
  for (let k = 0; k < 4; k++) { const z = -4 + k * 2.6; r.add('mass', 'paint', tube3([-11.4, 2, z], [-6 + k, 18.6 - Math.abs(k - 1.5), z * 1.1], [10.8, 3, z * 0.9], 0.55, 0.45, 12, 5), W5.bone); }
  for (let k = 0; k < 5; k++) { const a = k * 1.25; r.add('mass', 'core', G.tube([[Math.cos(a) * 11, 3, Math.sin(a) * 8.5], [Math.cos(a + 0.3) * 9.6, 9.6, Math.sin(a + 0.3) * 8.6], [Math.cos(a + 0.5) * 5.6, 15.6, Math.sin(a + 0.5) * 5.4]], 0.24, 10, 4), ACID.map(c => c * 0.6)); }
  return r.build();
}
function hivenodePose(B, st, e, s, dt, inst) {
  spawnSignals(st, e, 2.4);
  const breathe = Math.sin(st.time * 1.8);
  const b = st.burst, a = st.antic;
  B.mass.scale.set(1 + 0.025 * breathe + 0.06 * b + 0.03 * a, 1 - 0.02 * breathe + 0.05 * b, 1 + 0.025 * breathe + 0.06 * b);
  for (let k = 0; k < 3; k++) { const pk = 1 + 0.25 * a * Math.sin(st.time * 20 + k) + 0.35 * b; B['o' + k].scale.set(pk, pk, 1); }
  inst.fx.pulse(inst.byMat.core, 0.55 + 0.25 * (0.5 + 0.5 * breathe) + 1.2 * a + 1.8 * b);
}

// fallback flyer (e.g. minions spawned by THE SOVEREIGN): violet crystal drone
function shardlingBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8, 0).bone('ring', 'body', 0, 8, 0);
  const core = G.oct(3.4); xf(core, [0, 8, 0], null, [1, 1.45, 1]);
  r.add('body', 'crystal', core, W5.crysL);
  r.add('body', 'core', at(G.oct(1.5), 0, 8, 0, null, [1, 1.4, 1]), lin('#c8a0ff', 3.4));
  r.add('ring', 'paint', at(G.torus(5.6, 0.7, 6, 24), 0, 8, 0), '#2a2430');
  r.add('ring', 'glow', at(G.torus(5.6, 0.22, 4, 24), 0, 8, 0.66), ACID.map(c => c * 0.8));
  for (let k = 0; k < 3; k++) { const a = k / 3 * TAU; r.add('ring', 'crystal', at(G.shard(1.0, 5.2, 5, 50 + k), Math.cos(a) * 7.8, 8 + Math.sin(a) * 7.8, 0, [0, 0, a - Math.PI / 2]), W5.crys); }
  return r.build();
}
function shardlingPose(B, st, e, s, dt, inst) {
  B.root.rotation.y = faceYaw(st, playerDir(e, s), dt, 4);
  B.ring.rotation.z = st.time * 2.4;
  B.body.rotation.y = Math.sin(st.time * 1.3) * 0.4;
  inst.fx.pulse(inst.byMat.core, 0.8 + 0.3 * Math.sin(st.time * 6));
}

export const SKINS_B = {
  walltur: { type: 'turret', build: walturBuild, pose: walturPose },
  interceptor: { type: 'flyer', build: interceptorBuild, pose: interceptorPose },
  seeker: { type: 'drifter', build: seekerBuild, pose: seekerPose },
  statue: { type: 'turret', build: statueBuild, pose: statuePose },
  beltdrone: { type: 'walker', build: beltdroneBuild, pose: beltdronePose },
  boltspin: { type: 'spinner', build: boltspinBuild, pose: boltspinPose },
  arcdrone: { type: 'flyer', build: arcdroneBuild, pose: arcdronePose },
  armhub: { type: 'spawner', build: armhubBuild, pose: armhubPose },
  hugger: { type: 'hugger', build: huggerBuild, pose: huggerPose },
  leaper: { type: 'hopper', build: leaperBuild, pose: leaperPose },
  eggpod: { type: 'egg', build: eggpodBuild, pose: eggpodPose },
  acidmaw: { type: 'turret', build: acidmawBuild, pose: acidmawPose },
  hivenode: { type: 'spawner', build: hivenodeBuild, pose: hivenodePose },
  shardling: { type: 'flyer', build: shardlingBuild, pose: shardlingPose },
};
