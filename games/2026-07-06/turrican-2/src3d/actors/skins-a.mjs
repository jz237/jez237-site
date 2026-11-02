import * as THREE from 'three';
// Enemy skins, worlds 1 (Shattered Mesa) and 2 (Drowned Vaults).
import { G, Rig, at, tube3, rock, blob, crystals, leg, lin, clamp, lerp, smooth, approach, TAU,
  faceYaw, playerDir, aimAt, turretSignals, hopSignals, applyMount, mountAim, yawPitch, legSwing } from './ekit.mjs';

import { strata } from './lib.mjs';
const W1 = { chitin: '#6e3320', chitinL: '#8e4628', chitinD: '#3e1d12', rock: strata('#7c4a32', '#5e3424', 2.2, '#9a6a48'), rockL: strata('#8e5a3c', '#6e402a', 2.0, '#b08060'), rockD: '#4a2a1c', crys: '#4f97ff', bronze: '#7a6040', bone: '#d2bc98' };
const AMBER = lin('#ffad3a', 3.2), BLUE = lin('#7fc4ff', 3.0);
const W2 = { shell: '#3e555c', shellL: '#58747a', stone: '#4f5f66', stoneD: '#333f44', patina: '#4d6b5e', patinaD: '#344a42', flesh: '#6a4a5a', fleshL: '#86607a', crys: '#3fd6c8', eelD: '#24393f', eelL: '#5b7f86' };
const TEAL = lin('#3fe6d4', 3.2), TEALC = lin('#45f0dc', 3.6);

// ======================= WORLD 1 =============================================
// scarab: armoured crystal-backed beetle walker (20x22)
function scarabBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 7, 0).bone('head', 'body', 7.2, 7.6, 0).bone('crys', 'body', -1, 10.8, 0);
  r.add('body', 'suit', at(G.ell(7.0, 2.5, 4.4, 14, 8), -0.4, 6.3, 0), W1.chitinD);
  r.add('body', 'paint', at(G.ell(4.4, 3.0, 4.2, 12, 8), -4.4, 7.3, 0), W1.chitinD);
  for (const s of [1, -1]) {
    r.add('body', 'paint', at(G.shell(8.2, 5.4, 5.7, 0.55, s > 0 ? 0.06 : Math.PI + 0.06, s > 0 ? Math.PI - 0.06 : TAU - 0.06, 0, 1.64, 12, 6), -1.6, 7.5, 0), W1.chitin);
    for (const [x, y, z, k] of [[-3.2, 12.0, 3.1, 2], [0.8, 12.3, 2.7, 3], [-6.0, 10.4, 3.7, 4], [3.6, 10.6, 3.6, 5]])
      r.add('body', 'suit', at(rock(1.0, k * 7 + (s > 0 ? 1 : 2), 0.35, 0, 1.6, 0.55, 1.15), x, y, s * z, [s * 0.5, 0, 0]), W1.rockL);
    r.add('body', 'glow', at(G.box(2.6, 0.22, 0.2), -1.8, 9.2, s * 5.55, [0, 0, 0.05]), BLUE.map(c => c * 0.5));
  }
  r.add('body', 'paint', at(G.shell(3.8, 3.3, 4.5, 0.5, 0, TAU, 0, 1.75, 12, 5), 4.2, 7.6, 0), W1.chitinL);
  r.add('head', 'paint', at(G.ell(2.3, 2.1, 2.8, 10, 8), 8.0, 7.5, 0), W1.chitinD);
  for (const s of [1, -1]) {
    r.add('head', 'glow', at(G.ell(0.7, 0.8, 0.5, 8, 6), 9.5, 8.4, s * 1.7), AMBER);
    r.add('head', 'paint', tube3([9.8, 6.8, s * 1.3], [11.4, 6.6, s * 1.05], [11.7, 5.5, s * 0.2], 0.55, 0.1), W1.chitinD);
    r.add('head', 'suit', tube3([9.4, 9.2, s * 1.0], [11, 11.4, s * 1.8], [13.2, 12.1, s * 2.4], 0.17, 0.07, 6, 4), W1.chitinD);
  }
  crystals(r, 'crys', [[-1.2, 10.6, 0, 1.75, 9.8, 0.05, 0.14, 3], [-3.9, 10.4, 1.5, 1.25, 7.0, 0.32, 0.36, 5], [1.6, 11.0, -1.1, 1.1, 6.2, -0.26, -0.3, 7],
    [-5.9, 9.6, -1.7, 0.9, 4.2, -0.42, 0.6, 9], [2.9, 10.4, 1.9, 0.8, 3.6, 0.45, -0.42, 11], [-2.6, 10.9, -2.4, 0.7, 3.0, -0.6, 0.2, 13]], W1.crys);
  const HX = [4.2, 0.6, -3.2], DX = [2.4, 0.3, -2.2];
  for (let i = 0; i < 6; i++) {
    const s = i % 2 ? -1 : 1, k = Math.floor(i / 2), hx = HX[k], dx = DX[k];
    leg(r, 'l' + i, 'body', [hx, 6.6, s * 3.6], [hx + dx * 0.5, 9.8, s * 7.6], [hx + dx, 0.3, s * 9.3], 0.8, 'paint', W1.chitinD);
  }
  return r.build();
}
function scarabPose(B, st, e, s, dt) {
  B.root.rotation.y = faceYaw(st, e.facing || -1, dt, 8);
  st.phase += Math.abs(e.vx || 0) * dt / 15 * TAU;
  for (let i = 0; i < 6; i++) {
    const side = i % 2 ? -1 : 1, grpA = (i === 0 || i === 3 || i === 4);
    const ph = st.phase + (grpA ? 0 : Math.PI);
    const lift = 0.34 * Math.max(0, Math.cos(ph));
    legSwing(B['l' + i], side, 0.36 * Math.sin(ph), lift);
    B['l' + i + 'k'].rotation.x = -side * lift * 0.7;
  }
  B.body.position.y = 7 + 0.35 * Math.abs(Math.sin(st.phase * 2)) + 0.12 * Math.sin(st.time * 2);
  B.body.rotation.x = 0.04 * Math.sin(st.phase);
  B.head.rotation.y = 0.18 * Math.sin(st.time * 1.3);
  B.crys.rotation.z = 0.025 * Math.sin(st.time * 2.2);
}

// rockmite: hopping boulder mite (22x22)
function rockmiteBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 10, 0).bone('head', 'body', 6.6, 9.6, 0);
  r.add('body', 'suit', at(rock(7.0, 4, 0.22, 1, 1.18, 0.95, 1.0), -0.6, 11.2, 0), W1.rock);
  r.add('body', 'suit', at(rock(3.2, 5, 0.3, 0, 1.6, 0.55, 1.25), -2.2, 17.4, 0.4, [0, 0, 0.15]), W1.rockL);
  r.add('body', 'suit', at(rock(2.6, 6, 0.3, 0, 1.5, 0.55, 1.2), 2.6, 16.4, -1.6, [0.2, 0, -0.25]), W1.rockL);
  r.add('body', 'suit', at(rock(2.4, 7, 0.3, 0, 1.5, 0.6, 1.1), -5.6, 14.6, 1.8, [-0.2, 0, 0.6]), W1.rockL);
  r.add('body', 'suit', at(G.ell(5.6, 2.4, 4.6, 12, 6), 0, 6.6, 0), W1.rockD);
  crystals(r, 'body', [[-3.2, 15.2, 3.6, 0.95, 4.2, 0.55, 0.3, 2], [1.4, 16.8, -3.0, 0.85, 3.6, -0.6, -0.2, 4], [-6.0, 12.8, -2.4, 0.7, 3.0, -0.45, 0.8, 6], [4.6, 14.0, 2.6, 0.6, 2.4, 0.5, -0.6, 8]], W1.crys);
  r.add('head', 'paint', at(G.ell(2.7, 2.2, 3.0, 10, 8), 7.4, 9.1, 0), W1.rockD);
  r.add('head', 'suit', at(rock(1.7, 9, 0.3, 0, 1.3, 0.7, 1.4), 7.2, 10.8, 0), W1.rock);
  for (const s of [1, -1]) {
    r.add('head', 'glow', at(G.sph(0.55, 6, 4), 9.6, 9.8, s * 1.3), AMBER);
    r.add('head', 'glow', at(G.sph(0.38, 6, 4), 9.1, 10.7, s * 2.0), AMBER);
    r.add('head', 'paint', tube3([9.4, 8.0, s * 1.4], [10.9, 7.6, s * 1.2], [11.2, 6.7, s * 0.4], 0.5, 0.1), W1.chitinD);
  }
  const HX = [3.6, 3.6, -3.6, -3.6];
  for (let i = 0; i < 4; i++) {
    const s = i % 2 ? -1 : 1, hx = HX[i];
    leg(r, 'l' + i, 'body', [hx, 8.2, s * 4.4], [hx * 1.35, 11.6, s * 8.4], [hx * 1.55, 0.3, s * 9.6], 1.15, 'paint', W1.chitinD);
  }
  return r.build();
}
function rockmitePose(B, st, e, s, dt) {
  const h = hopSignals(e, 1.2);
  const dir = Math.abs(e.vx || 0) > 1 ? Math.sign(e.vx) : playerDir(e, s);
  B.root.rotation.y = faceYaw(st, dir, dt, 9);
  st.cr = approach(st.cr || 0, h.crouch, 20, dt);
  st.air = approach(st.air || 0, h.air, 14, dt);
  const rising = Math.max(0, -st.air), falling = Math.max(0, st.air);
  B.body.position.y = 10 - 3.4 * st.cr + 0.15 * Math.sin(st.time * 2.5);
  B.body.rotation.z = -0.22 * st.air + 0.12 * st.cr;
  for (let i = 0; i < 4; i++) {
    const side = i % 2 ? -1 : 1, front = i < 2 ? 1 : -1;
    const lift = 0.45 * st.cr - 0.35 * rising + 0.15 * falling;
    legSwing(B['l' + i], side, front * (0.1 + 0.25 * rising - 0.2 * falling), lift);
    B['l' + i + 'k'].rotation.x = side * (0.5 * st.cr - 0.25 * rising);
  }
  B.head.rotation.z = 0.12 * st.cr + 0.06 * Math.sin(st.time * 3);
}

// cliffpod: rock-embedded sensor turret (20x20), mounts on floor / ceiling / walls
function cliffpodBuild() {
  const r = new Rig();
  r.bone('yaw', 'root', 0, 9, 0).bone('aim', 'yaw', 0, 10.2, 0).bone('gun', 'aim', 0, 10.2, 0);
  r.add('root', 'suit', at(rock(6.0, 11, 0.3, 1, 1.4, 0.55, 1.1), 0, 2.0, 0), W1.rock);
  r.add('root', 'suit', at(rock(3.0, 12, 0.35, 0, 1.2, 0.8, 1.2), -7.2, 1.6, 2.6), W1.rockD);
  r.add('root', 'suit', at(rock(2.4, 13, 0.35, 0, 1.3, 0.7, 1.1), 6.8, 1.2, -2.2), W1.rockL);
  crystals(r, 'root', [[-4.5, 3.8, 4.2, 0.8, 3.6, 0.6, 0.4, 3], [5.2, 3.4, 3.8, 0.7, 3.0, 0.7, -0.5, 5]], W1.crys);
  r.add('root', 'metal', at(G.torus(5.0, 0.85, 6, 20), 0, 6.8, 0, [Math.PI / 2, 0, 0]), W1.bronze);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.add('root', 'metal', at(G.cyl(0.4, 0.4, 0.8, 6), Math.cos(a) * 5, 7.6, Math.sin(a) * 5), '#4a4036'); }
  r.add('yaw', 'metal', at(G.cyl(3.4, 4.2, 3.0, 12), 0, 8.4, 0), '#3e3a34');
  r.add('aim', 'paint', at(G.sph(5.4, 16, 12), 0, 10.6, 0), '#8a5636');
  r.add('aim', 'paint', at(G.shell(5.9, 5.9, 5.9, 0.5, -1.2, 1.2, 0.35, 2.4, 10, 6), 0, 10.6, 0), W1.rockL);
  for (const s of [1, -1]) r.add('aim', 'paint', at(G.ext([[-4, -1], [2, -0.6], [3.5, 1.6], [-3.2, 2.2]], 0.6, 0.2), 0, 10.6, s * 5.8), W1.chitinD);
  r.add('aim', 'metal', at(G.torus(1.9, 0.45, 6, 16), 5.1, 11.2, 0, [0, Math.PI / 2, 0]), '#2e2a26');
  r.add('aim', 'core', at(G.sph(1.7, 12, 10), 5.4, 11.6, 0, null, [0.75, 1, 1]), lin('#ff8a3a', 2.6));
  r.add('aim', 'metal', at(G.torus(1.75, 0.3, 5, 16), 5.6, 11.6, 0, [0, Math.PI / 2, 0]), '#2e2a26');
  for (const z of [2.3, -2.3]) {
    r.add('gun', 'metal', at(G.cyl(0.75, 0.85, 7.0, 10), 7.6, 8.9, z, [0, 0, -Math.PI / 2]), '#3a3632');
    r.add('gun', 'metal', at(G.cyl(0.95, 0.95, 1.2, 10), 11.0, 8.9, z, [0, 0, -Math.PI / 2]), '#6a5a44');
  }
  return r.build();
}
function cliffpodPose(B, st, e, s, dt, inst) {
  const m = applyMount(st, inst, e, s, 20);
  const a = mountAim(m, e.aim != null ? -e.aim : aimAt(e, s));
  const pitch = yawPitch(st, a, dt, -0.5, 1.5);
  B.yaw.rotation.y = st.yaw; B.aim.rotation.z = pitch;
  turretSignals(st, e, dt);
  B.gun.position.x = -st.kick * 1.6;
  inst.fx.pulse(inst.byMat.core, 0.7 + st.charge * 1.6 + 0.15 * Math.sin(st.time * 4));
}

// wasp: crystal-stinger flyer (22x16)
function waspBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8, 0).bone('head', 'body', 5.6, 8.6, 0)
    .bone('ab0', 'body', -2.2, 8.0, 0).bone('ab1', 'ab0', -5.4, 7.6, 0).bone('ab2', 'ab1', -8.2, 7.0, 0)
    .bone('wN', 'body', 0.6, 10.2, 1.5).bone('wF', 'body', 0.6, 10.2, -1.5).bone('wN2', 'body', -1.2, 10.0, 1.3).bone('wF2', 'body', -1.2, 10.0, -1.3);
  r.add('body', 'paint', at(G.ell(3.4, 2.7, 2.6, 12, 8), 0.6, 8.4, 0), W1.chitin);
  r.add('body', 'paint', at(G.shell(3.6, 3.0, 2.8, 0.4, 0, TAU, 0, 1.2, 12, 4), 0.6, 8.6, 0), '#b8742e');
  r.add('head', 'paint', at(G.ell(2.0, 2.0, 2.1, 10, 8), 6.0, 8.6, 0), W1.chitinD);
  for (const s of [1, -1]) {
    r.add('head', 'glow', at(G.ell(1.0, 1.35, 0.8, 8, 6), 6.8, 9.2, s * 1.35), AMBER);
    r.add('head', 'paint', tube3([7.4, 7.6, s * 0.8], [8.6, 7.0, s * 0.7], [8.7, 6.2, s * 0.15], 0.38, 0.08), W1.chitinD);
    r.add('head', 'suit', tube3([6.8, 10.2, s * 0.6], [8, 12.4, s * 1.0], [9.6, 13.0, s * 1.4], 0.14, 0.06, 6, 4), W1.chitinD);
    for (let k = 0; k < 3; k++) r.add('body', 'suit', tube3([1.8 - k * 1.4, 6.3, s * 0.9], [2.4 - k * 1.8, 3.6, s * 2.2], [1.6 - k * 2.4, 1.0, s * 2.6], 0.22, 0.07, 6, 4), W1.chitinD);
  }
  r.add('ab0', 'paint', at(G.ell(2.4, 2.3, 2.3, 10, 8), -3.0, 7.9, 0), '#b8742e');
  r.add('ab0', 'paint', at(G.torus(2.1, 0.32, 4, 14), -4.4, 7.7, 0, [0, Math.PI / 2, 0.15]), W1.chitinD);
  r.add('ab1', 'paint', at(G.ell(2.6, 2.4, 2.4, 10, 8), -6.2, 7.3, 0), W1.chitinD);
  r.add('ab1', 'paint', at(G.torus(2.25, 0.34, 4, 14), -6.4, 7.3, 0, [0, Math.PI / 2, 0.25]), '#b8742e');
  r.add('ab2', 'paint', at(G.ell(2.0, 1.8, 1.8, 10, 8), -9.0, 6.6, 0), '#b8742e');
  r.add('ab2', 'crystal', at(G.crystal(0.7, 4.2, 6, 0.4, 5), -10.4, 6.2, 0, [0, 0, Math.PI / 2 + 0.35]), W1.crys);
  r.add('ab2', 'glow', at(G.sph(0.45, 6, 4), -10.6, 6.2, 0), BLUE);
  const wing = (len, h) => G.membrane([[0, 0], [-1.2, h * 0.6], [-len * 0.55, h], [-len, h * 0.85], [-len * 0.7, h * 0.35], [-len * 0.25, 0.2]]);
  for (const [b, z, len, hh] of [['wN', 1.5, 9, 8.5], ['wF', -1.5, 9, 8.5], ['wN2', 1.3, 6.5, 6], ['wF2', -1.3, 6.5, 6]]) {
    const ox = b.endsWith('2') ? -1.2 : 0.6, oy = b.endsWith('2') ? 10.0 : 10.2;
    r.add(b, 'membrane', at(wing(len, hh), ox, oy, z), '#d8b07a');
    r.add(b, 'paint', tube3([ox, oy, z], [ox - len * 0.3, oy + hh * 0.85, z], [ox - len, oy + hh * 0.85, z], 0.18, 0.06, 8, 4), W1.chitinD);
  }
  return r.build();
}
function waspPose(B, st, e, s, dt) {
  const dir = playerDir(e, s);
  B.root.rotation.y = faceYaw(st, dir, dt, 6);
  const vy = st.py != null && dt > 0 ? (e.y - st.py) / dt : 0; st.py = e.y;
  st.bank = approach(st.bank || 0, clamp(-vy / 120, -1, 1), 6, dt);
  B.body.rotation.z = st.bank * 0.25;
  const f = Math.sin(st.time * TAU * 14), f2 = Math.sin(st.time * TAU * 14 + 1.2);
  B.wN.rotation.x = -0.25 - 0.9 * f; B.wF.rotation.x = 0.25 + 0.9 * f;
  B.wN2.rotation.x = -0.35 - 0.8 * f2; B.wF2.rotation.x = 0.35 + 0.8 * f2;
  B.ab0.rotation.z = 0.1 * Math.sin(st.time * 3); B.ab1.rotation.z = 0.14 * Math.sin(st.time * 3 - 0.7) - 0.1; B.ab2.rotation.z = 0.2 * Math.sin(st.time * 3 - 1.4) - 0.15;
  B.head.rotation.y = 0.15 * Math.sin(st.time * 1.7);
}

// windmine: floating spore mine with membrane sails (16x16)
function windmineBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8, 0).bone('spin', 'body', 0, 8, 0);
  r.add('body', 'flesh', at(blob(4.3, 4.5, 4.3, 3, 0.1), 0, 8, 0), '#8a5a3a');
  r.add('body', 'core', at(G.torus(4.15, 0.34, 6, 24), 0, 8, 0, [Math.PI / 2, 0, 0]), lin('#7fc4ff', 2.0));
  r.add('body', 'core', at(G.sph(1.1, 8, 6), 0, 12.4, 0), lin('#9fd4ff', 1.6));
  const n = 12;
  for (let i = 0; i < n; i++) {
    const y = 1 - (i + 0.5) / n * 2, rr = Math.sqrt(1 - y * y), a = i * 2.39996;
    const d = [Math.cos(a) * rr, y, Math.sin(a) * rr];
    if (Math.abs(y) > 0.92) continue;
    const g = G.cone(0.42, 3.4, 6); g.translate(0, 1.7, 0);
    const base = [d[0] * 3.9, 8 + d[1] * 4.1, d[2] * 3.9];
    r.add('spin', 'paint', orient(g, d, base), '#9a7a58');
    r.add('spin', 'crystal', orient(at(G.crystal(0.32, 1.4, 5, 0.5, i + 3), 0, 3.3, 0), d, base), W1.crys);
  }
  for (let k = 0; k < 3; k++) {
    const a = k / 3 * TAU;
    const sail = G.membrane([[0, -1.2], [5.8, -0.4], [7.2, 1.8], [4.2, 2.6], [0, 1.4]]);
    r.add('spin', 'membrane', at(sail, Math.cos(a) * 3.6, 8, Math.sin(a) * 3.6, [0, -a, 0]), '#b08a5a');
    r.add('spin', 'paint', at(tube3([0, 0, 0], [3.6, 2.0, 0], [7.2, 1.8, 0], 0.16, 0.08, 6, 4), Math.cos(a) * 3.6, 8, Math.sin(a) * 3.6, [0, -a, 0]), W1.bone);
  }
  return r.build();
}
function windminePose(B, st, e, s, dt, inst) {
  B.spin.rotation.y += dt * 1.7;
  B.body.rotation.set(0.18 * Math.sin(st.time * 1.3), 0, 0.22 * Math.sin(st.time * 1.7));
  const p = s.player; const d = p ? Math.hypot(p.x - e.x, p.y - e.y) : 999;
  const rate = d < 90 ? 9 : 3;
  inst.fx.pulse(inst.byMat.core, 0.5 + 0.7 * (0.5 + 0.5 * Math.sin(st.time * rate)));
}

// ======================= WORLD 2 =============================================
// crab: vault crab, faces the camera and scuttles sideways (20x22)
function crabBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8.6, 0).bone('clN', 'body', 5.0, 9.0, 3.4).bone('clF', 'body', -5.0, 9.0, 3.4);
  r.add('body', 'flesh', at(G.shell(8.8, 5.2, 6.6, 0.6, 0, TAU, 0, 1.72, 16, 7), 0, 9.2, 0), W2.shell);
  r.add('body', 'suit', at(G.ell(7.0, 2.6, 5.4, 14, 8), 0, 8.4, 0), W2.stoneD);
  for (let k = 0; k < 7; k++) { const a = (k / 6 - 0.5) * 2.2; r.add('body', 'paint', at(G.cone(0.55, 1.6, 5), Math.sin(a) * 8.6, 8.6, Math.cos(a) * 6.4 * 0.98, [Math.PI / 2 - 0.3, 0, -a * 0.3]), W2.shellL); }
  crystals(r, 'body', [[-2.0, 12.8, -1.2, 1.45, 7.6, -0.2, 0.15, 3], [2.6, 13.0, -2.0, 1.1, 6.0, -0.3, -0.3, 5], [0.2, 13.4, -3.6, 0.9, 4.6, -0.5, 0, 7], [-4.6, 11.8, -2.6, 0.8, 3.6, -0.4, 0.5, 9], [4.8, 11.6, 0.4, 0.6, 2.6, 0.3, -0.6, 11]], W2.crys);
  for (let k = 0; k < 8; k++) { const a = (k / 7) * Math.PI; r.add('body', 'glow', at(G.sph(0.35, 6, 4), Math.cos(a) * 7.6, 10.4 + Math.sin(a) * 1.2, Math.sin(a) * 4.8 + 1.2), TEAL); }
  for (const s of [1, -1]) {
    r.add('body', 'paint', tube3([s * 1.6, 12.2, 4.0], [s * 1.9, 13.4, 4.4], [s * 2.1, 14.4, 4.7], 0.32, 0.22, 6, 4), W2.shellL);
    r.add('body', 'glow', at(G.sph(0.62, 8, 6), s * 2.1, 14.7, 4.8), TEALC);
    const cl = s > 0 ? 'clN' : 'clF';
    r.add(cl, 'flesh', tube3([s * 5.0, 9.0, 3.4], [s * 6.9, 10.6, 5.8], [s * 6.1, 12.4, 7.4], 1.15, 0.9), W2.shell);
    r.add(cl, 'flesh', at(G.ell(2.1, 1.6, 1.4, 10, 8), s * 5.5, 13.3, 8.1, [0, 0, s * 0.4]), W2.shellL);
    r.add(cl, 'paint', at(G.cone(0.75, 3.2, 6), s * 4.1, 15.0, 8.4, [0, 0, s * 0.75]), W2.shellL);
    r.add(cl, 'paint', at(G.cone(0.6, 2.6, 6), s * 5.0, 15.3, 7.6, [0, 0, s * 0.2]), W2.stone);
    r.add(cl, 'glow', at(G.sph(0.3, 6, 4), s * 5.8, 13.6, 9.4), TEAL);
  }
  const ZS = [1.8, -0.6, -3.0];
  for (let i = 0; i < 6; i++) {
    const sx = i % 2 ? -1 : 1, z = ZS[Math.floor(i / 2)];
    leg(r, 'l' + i, 'body', [sx * 5.4, 8.0, z], [sx * 8.8, 11.2, z * 1.3], [sx * 9.9, 0.3, z * 1.5], 0.72, 'paint', W2.stone);
  }
  return r.build();
}
function crabPose(B, st, e, s, dt) {
  st.phase += Math.abs(e.vx || 0) * dt / 13 * TAU;
  B.root.rotation.y = approach(B.root.rotation.y, -(e.facing || -1) * 0.22, 6, dt);
  for (let i = 0; i < 6; i++) {
    const sx = i % 2 ? -1 : 1, ph = st.phase + Math.floor(i / 2) * 2.1 + (sx > 0 ? 0 : Math.PI);
    const lift = 0.36 * Math.max(0, Math.sin(ph));
    B['l' + i].rotation.set(0, 0.16 * Math.cos(ph), sx * (lift + 0.08 * Math.cos(ph)));
    B['l' + i + 'k'].rotation.z = -sx * lift * 0.5;
  }
  B.body.position.set(0.3 * Math.sin(st.phase * 2), 8.6 + 0.3 * Math.abs(Math.sin(st.phase * 2)) + 0.1 * Math.sin(st.time * 1.6), 0);
  const snap = Math.max(0, Math.sin(st.time * 1.4)) ** 6;
  B.clN.rotation.set(-0.15 * snap, 0, 0.1 * Math.sin(st.time * 1.1));
  B.clF.rotation.set(-0.15 * Math.max(0, Math.sin(st.time * 1.4 + 2)) ** 6, 0, -0.1 * Math.sin(st.time * 1.1 + 1));
}

// eel: vault eel, 6-bone undulating chain (30x12)
function eelBuild() {
  const r = new Rig();
  const X = [9, 5, 1, -3, -7, -11];
  r.bone('s0', 'root', X[0], 6, 0);
  for (let i = 1; i < 6; i++) r.bone('s' + i, 's' + (i - 1), X[i], 6, 0);
  r.bone('jaw', 's0', 9.6, 5.3, 0);
  r.add('s0', 'flesh', at(G.ell(4.3, 2.6, 2.4, 14, 10), 11.4, 6.3, 0), W2.eelD);
  r.add('s0', 'flesh', at(G.ell(3.0, 1.2, 2.0, 10, 6), 10.6, 7.6, 0), W2.eelL);
  r.add('jaw', 'flesh', at(G.ell(3.8, 1.0, 2.0, 12, 6), 12.0, 4.7, 0), W2.eelL);
  for (let k = 0; k < 5; k++) for (const s of [1, -1]) {
    r.add('jaw', 'paint', at(G.cone(0.22, 0.9, 4), 10.4 + k * 0.85, 5.6, s * (1.6 - k * 0.22)), '#e8e0cc');
    r.add('s0', 'paint', at(G.cone(0.22, 0.9, 4), 10.6 + k * 0.85, 5.4, s * (1.7 - k * 0.22), [Math.PI, 0, 0]), '#e8e0cc');
  }
  for (const s of [1, -1]) {
    r.add('s0', 'glow', at(G.sph(0.6, 8, 6), 13.2, 7.0, s * 1.55), TEALC);
    for (let k = 0; k < 3; k++) r.add('s0', 'glow', at(G.box(0.18, 1.5, 0.15), 8.6 - k * 0.7, 6.1, s * 2.25), TEAL.map(c => c * 0.7));
    r.add('s0', 'suit', tube3([14.6, 5.2, s * 0.8], [15.6, 3.8, s * 1.4], [15.0, 2.4, s * 1.6], 0.14, 0.05, 6, 3), W2.eelL);
  }
  r.add('s0', 'flesh', at(G.ell(3.4, 2.75, 2.35, 12, 8), 7.4, 6.0, 0), W2.eelD);
  const RY = [2.7, 2.6, 2.35, 2.0, 1.55, 1.0];
  for (let i = 1; i < 6; i++) {
    const x = X[i] - 2, ry = RY[i];
    r.add('s' + i, 'flesh', at(G.ell(3.6, ry, ry * 0.86, 12, 8), x + 0.4, 6.0, 0), i % 2 ? W2.eelD : '#2b434a');
    r.add('s' + i, 'membrane', at(G.membrane([[2.6, 0], [-2.4, 0], [-2.4, ry * 0.7 + 0.8], [2.6, RY[i - 1] * 0.7 + 0.8]]), x + 0.2, 6 + ry * 0.62, 0), '#5fd8c8');
    for (const s of [1, -1]) r.add('s' + i, 'glow', at(G.sph(0.28, 6, 4), x + 0.8, 6.2, s * ry * 0.84), TEAL);
  }
  r.add('s5', 'membrane', at(G.membrane([[-11, 0], [-15.4, 3.4], [-14.6, 0], [-15.4, -3.0]]), 0, 6, 0), '#5fd8c8');
  return r.build();
}
function eelPose(B, st, e, s, dt) {
  B.root.rotation.y = faceYaw(st, e.facing || 1, dt, 7);
  const amp = [0.05, 0.2, 0.24, 0.26, 0.28, 0.3];
  for (let i = 0; i < 6; i++) B['s' + i].rotation.set(0.12 * Math.sin(st.time * 6 - i * 0.9), 0, amp[i] * Math.sin(st.time * 6 - i * 0.9));
  B.jaw.rotation.z = -0.32 * (0.5 + 0.5 * Math.sin(st.time * 2.1)) ** 2;
}

// polyp: lobbing anemone on vault stone (20x20)
function polypBuild() {
  const r = new Rig();
  r.bone('stalk', 'root', 0, 4.2, 0).bone('head', 'stalk', 0, 11.2, 0);
  r.add('root', 'suit', at(rock(6.2, 21, 0.3, 1, 1.45, 0.55, 1.1), 0, 2.0, 0), W2.stone);
  crystals(r, 'root', [[-6.0, 2.6, 2.6, 0.75, 3.2, 0.5, 0.6, 3], [5.6, 2.2, 3.4, 0.6, 2.6, 0.7, -0.5, 5]], W2.crys);
  for (let k = 0; k < 6; k++) { const a = k * 1.3; r.add('root', 'paint', at(G.cone(0.7, 1.2, 6), Math.cos(a) * 6, 3.2, Math.sin(a) * 4.5), '#c7c0b0'); }
  r.add('stalk', 'flesh', G.taperTube([[0, 3.6, 0], [0.6, 7.6, 0], [0, 11.4, 0]], (t) => lerp(2.7, 2.0, t), 8, 10), W2.flesh);
  for (const y of [6.2, 8.4, 10.4]) r.add('stalk', 'flesh', at(G.torus(2.35 - (y - 6) * 0.08, 0.32, 5, 14), 0.3, y, 0, [Math.PI / 2, 0, 0]), W2.fleshL);
  r.add('head', 'flesh', at(G.ell(4.2, 3.3, 4.2, 14, 10), 0, 12.8, 0), W2.fleshL);
  r.add('head', 'core', at(G.cyl(1.9, 2.5, 0.6, 14), 0, 15.7, 0), lin('#45f0dc', 3.2));
  r.add('head', 'flesh', at(G.torus(2.6, 0.55, 6, 16), 0, 15.8, 0, [Math.PI / 2, 0, 0]), W2.flesh);
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * TAU, cx = Math.cos(a) * 3.0, cz = Math.sin(a) * 3.0;
    r.bone('t' + k, 'head', cx, 15.6, cz);
    r.add('t' + k, 'flesh', tube3([cx, 15.6, cz], [cx * 1.6, 17.6, cz * 1.6], [cx * 2.1, 18.4, cz * 2.1], 0.55, 0.14, 8, 5), '#9a7088');
    r.add('t' + k, 'glow', at(G.sph(0.3, 6, 4), cx * 2.15, 18.5, cz * 2.15), TEALC);
  }
  return r.build();
}
function polypPose(B, st, e, s, dt, inst) {
  turretSignals(st, e, dt, 2.1);
  const dir = playerDir(e, s);
  st.lean = approach(st.lean || 0, dir * 0.12, 3, dt);
  B.stalk.rotation.set(0.05 * Math.sin(st.time * 1.2), 0, -st.lean + 0.04 * Math.sin(st.time * 1.6));
  const sq = st.charge * 0.18 - st.kick * 0.22;
  B.head.scale.set(1 + sq * 0.6, 1 - sq, 1 + sq * 0.6);
  for (let k = 0; k < 6; k++) {
    const w = Math.sin(st.time * 2.2 + k * 1.1);
    const a = k / 6 * TAU, flare = 0.3 * st.kick - 0.35 * st.charge;
    B['t' + k].rotation.set(Math.sin(a) * (0.2 * w + flare), 0, -Math.cos(a) * (0.2 * w + flare));
  }
  inst.fx.pulse(inst.byMat.core, 0.7 + st.charge * 1.3 + st.kick * 1.5 + 0.15 * Math.sin(st.time * 3));
}

// sentry: ancient vault drone with a tracking eye (22x16)
function sentryBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8.4, 0).bone('eye', 'body', 1.6, 8.4, 0).bone('vN', 'body', -1, 8.4, 4.4).bone('vF', 'body', -1, 8.4, -4.4);
  r.add('body', 'paint', at(G.torus(4.3, 1.55, 8, 22), 0.6, 8.4, 0, [0, Math.PI / 2, 0]), W2.patina);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.add('body', 'paint', at(G.box(1.2, 1.6, 2.2, 0.3), 1.4, 8.4 + Math.cos(a) * 4.3, Math.sin(a) * 4.3, [a, 0, 0]), W2.patinaD); }
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + 0.4; r.add('body', 'glow', at(G.box(0.2, 1.4, 0.3), 2.2, 8.4 + Math.cos(a) * 4.4, Math.sin(a) * 4.4, [a, 0, 0]), TEAL); }
  r.add('body', 'paint', at(G.ell(3.6, 4.0, 4.0, 12, 10), -2.4, 8.4, 0), W2.patinaD);
  r.add('body', 'paint', at(G.cone(2.0, 3.0, 8), -6.2, 8.4, 0, [0, 0, Math.PI / 2]), W2.patina);
  r.add('eye', 'core', at(G.sph(2.6, 14, 10), 1.8, 8.4, 0), lin('#3fe6d4', 2.6));
  r.add('eye', 'metal', at(G.sph(1.05, 10, 8), 4.0, 8.4, 0), '#0b1a1a');
  r.add('eye', 'paint', at(G.torus(2.5, 0.35, 5, 18), 2.6, 8.4, 0, [0, Math.PI / 2, 0]), '#2a3a34');
  for (const [b, s] of [['vN', 1], ['vF', -1]]) {
    r.add(b, 'paint', at(G.ext([[0, -0.4], [-4.8, 2.4], [-8.2, 2.0], [-6.0, 0.2], [-3.6, -1.2]], 0.5, 0.18), -1, 8.4, s * 4.6), W2.patina);
    r.add(b, 'glow', at(G.box(3.0, 0.16, 0.14), -4.2, 9.3, s * 4.9, [0, 0, -0.3]), TEAL);
  }
  for (const z of [1.2, -1.2, 0]) r.add('body', 'suit', tube3([-2.6, 5.0, z], [-4.2, 3.2, z * 1.4], [-6.2, 2.2, z * 1.6], 0.28, 0.08, 8, 4), W2.patinaD);
  r.scaleAll(1.3, 0, 8, 0);
  return r.build();
}
function sentryPose(B, st, e, s, dt) {
  const dir = playerDir(e, s);
  B.root.rotation.y = faceYaw(st, dir, dt, 5);
  const a = aimAt(e, s); const local = dir > 0 ? a : Math.PI - a;
  let l = local > Math.PI ? local - TAU : local;
  st.look = approach(st.look || 0, clamp(l, -0.7, 0.7), 6, dt);
  B.eye.rotation.z = st.look;
  B.body.rotation.z = 0.06 * Math.sin(st.time * 1.4);
  B.body.position.y = 8.4 + 0.4 * Math.sin(st.time * 2.2);
  B.vN.rotation.x = -0.15 - 0.15 * Math.sin(st.time * 3); B.vF.rotation.x = 0.15 + 0.15 * Math.sin(st.time * 3);
}

// bubblemine: spiked core inside a rising bubble (16x16)
function bubbleBuild() {
  const r = new Rig();
  r.bone('body', 'root', 0, 8, 0).bone('core', 'body', 0, 8, 0);
  r.add('body', 'bubble', at(G.sph(7.4, 20, 14), 0, 8, 0), '#bff4ff');
  r.add('core', 'metal', at(G.ico(3.0, 1), 0, 8, 0), '#4f6466');
  r.add('core', 'core', at(G.torus(3.05, 0.3, 5, 20), 0, 8, 0, [Math.PI / 2, 0, 0]), TEALC);
  r.add('core', 'core', at(G.torus(3.05, 0.3, 5, 20), 0, 8, 0, [0, 0, 0]), TEALC);
  const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], [0.7, 0.7, 0], [-0.7, -0.7, 0]];
  for (const d of dirs) r.add('core', 'paint', orient(at(G.cone(0.6, 2.2, 6), 0, 1.1, 0), d, [d[0] * 2.8, 8 + d[1] * 2.8, d[2] * 2.8]), '#8a7a50');
  return r.build();
}
function bubblePose(B, st, e, s, dt, inst) {
  B.core.rotation.set(st.time * 0.6, st.time * 0.9, 0);
  const w = Math.sin(st.time * 2.4);
  B.body.scale.set(1 + 0.035 * w, 1 - 0.035 * w, 1 + 0.02 * w);
  const p = s.player; const d = p ? Math.hypot(p.x - e.x, p.y - e.y) : 999;
  inst.fx.pulse(inst.byMat.core, 0.7 + 0.6 * (0.5 + 0.5 * Math.sin(st.time * (d < 90 ? 10 : 3.5))));
}

// orient a +y-pointing geometry along direction d, then translate to base
const _q = new THREE.Quaternion(), _m = new THREE.Matrix4(), _up = new THREE.Vector3(0, 1, 0), _d = new THREE.Vector3();
export function orient(g, d, base) {
  _d.set(d[0], d[1], d[2]).normalize(); _q.setFromUnitVectors(_up, _d);
  _m.makeRotationFromQuaternion(_q); _m.setPosition(base[0], base[1], base[2]);
  g.applyMatrix4(_m); return g;
}

export const SKINS_A = {
  scarab: { type: 'walker', build: scarabBuild, pose: scarabPose },
  rockmite: { type: 'hopper', build: rockmiteBuild, pose: rockmitePose },
  cliffpod: { type: 'turret', build: cliffpodBuild, pose: cliffpodPose },
  wasp: { type: 'flyer', build: waspBuild, pose: waspPose },
  windmine: { type: 'drifter', build: windmineBuild, pose: windminePose },
  crab: { type: 'walker', build: crabBuild, pose: crabPose },
  eel: { type: 'eel', build: eelBuild, pose: eelPose },
  polyp: { type: 'turret', build: polypBuild, pose: polypPose },
  sentry: { type: 'flyer', build: sentryBuild, pose: sentryPose },
  bubblemine: { type: 'drifter', build: bubbleBuild, pose: bubblePose },
};
