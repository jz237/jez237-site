// Bosses part A: DUNE WARDEN (warden), ABYSS MAW (maw), BLOCKADE GUNSHIP (gunship).
import { G, Rig, xf, warp, at, tube3, rock, blob, crystals, lin, clamp, lerp, smooth, approach, TAU } from './ekit.mjs';
import { strata } from './lib.mjs';
import { damage, shed, breakup, shake } from './bkit.mjs';

const zig = (x0, y0, x1, y1, z, n, amp, seed) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n; const h = Math.sin(seed * 13.7 + i * 7.3) * amp; p.push([x0 + (x1 - x0) * t + h * 0.4, y0 + (y1 - y0) * t + h, z]); } return p; };
const CRACK = lin('#ff8a2a', 3.0);

// =============================== DUNE WARDEN (64 x 74) ===============================
const WD = { rock: strata('#6e4030', '#3a2218', 2.4, '#8a6048'), rockD: strata('#4e2c20', '#2e1a12', 2.0, '#6a4430'), rockL: strata('#7e5038', '#4a2c1e', 2.6, '#9a7058'), frame: '#34302c', frameL: '#56504a', head: '#46403c', crys: '#4f97ff' };
function wardenBuild() {
  const r = new Rig(1 / 26);
  r.bone('pelvis', 'root', 0, 30, 0).bone('torso', 'pelvis', 0, 36, 0).bone('head', 'torso', 12, 58, 0)
    .bone('core', 'torso', 9, 46, 0).bone('sN', 'torso', 9, 46, 13.6).bone('sF', 'torso', 9, 46, -13.6).bone('pods', 'torso', -11, 60, 0)
    .bone('armN', 'torso', 2, 55, 16).bone('forN', 'armN', 8, 40, 19).bone('armF', 'torso', 2, 55, -16).bone('forF', 'armF', 8, 40, -19)
    .bone('plate0', 'torso', -6, 53, 11.8).bone('plate1', 'torso', -6, 53, -11.8).bone('plate2', 'torso', 0, 64, 0)
    .bone('cracks1', 'torso', 0, 46, 0).bone('cracks2', 'torso', 0, 46, 0).bone('spark', 'torso', 6, 50, 0);
  for (const [n, s] of [['N', 1], ['F', -1]]) r.bone('th' + n, 'pelvis', -1, 30, s * 9).bone('sh' + n, 'th' + n, 5, 16, s * 10).bone('ft' + n, 'sh' + n, 0, 4, s * 10);
  // pelvis
  r.add('pelvis', 'metal', at(G.box(18, 9, 17, 1.5, 2), -1, 30, 0), WD.frame);
  r.add('pelvis', 'suit', at(rock(5, 3, 0.25, 1, 1.2, 0.8, 1.1), 7, 28, 0), WD.rockD);
  for (const s of [1, -1]) r.add('pelvis', 'metal', at(G.cyl(4.2, 4.2, 4, 14), -1, 30, s * 9.5, [Math.PI / 2, 0, 0]), WD.frameL);
  // torso
  r.add('torso', 'metal', G.ext([[-15, 34], [13, 36], [18, 45], [16, 57], [7, 64], [-9, 63], [-16, 52]], 22, 2, { steps: 2 }), WD.frame);
  r.add('torso', 'suit', at(rock(9, 5, 0.16, 2, 1.0, 1.15, 1.2), 13, 45, 0), WD.rock);
  r.add('torso', 'suit', at(rock(7, 6, 0.16, 2, 1.1, 0.7, 1.25), 9, 37, 0), WD.rockD);
  r.add('torso', 'suit', at(rock(11, 7, 0.16, 2, 1.1, 0.85, 1.0), -8, 54, 0), WD.rock);
  r.add('torso', 'suit', at(rock(6, 8, 0.2, 1, 1.4, 0.7, 1.6), -14, 44, 0), WD.rockD);
  for (const s of [1, -1]) {
    r.add('torso', 'suit', at(rock(7, 70 + s, 0.18, 1, 1.9, 0.75, 0.32), -3, 40.5, s * 11.4), WD.rockD);
    r.add('torso', 'metal', at(G.torus(6.2, 1.1, 6, 18), 9, 46, s * 11.4), WD.frameL);
    r.add('core', 'core', at(G.cyl(5.2, 5.2, 0.3, 16), 9, 46, s * 11.2, [Math.PI / 2, 0, 0]), lin('#5fb8ff', 2.4));
    r.add('torso', 'glow', G.tube([[-14, 46, s * 10.7], [-6, 50, s * 10.9], [2, 47, s * 10.9], [6, 52, s * 10.7]], 0.7, 12, 5), lin('#6fc0ff', 2.4));
    r.add('torso', 'metal', at(G.cyl(1.1, 1.1, 9, 8), -8, 54, s * 10.6, [0, 0, 0.6]), WD.frameL);
    r.add('torso', 'metal', at(G.cyl(1.6, 1.6, 4, 8), -11, 50.5, s * 10.6, [0, 0, 0.6]), WD.frame);
    r.add('torso', 'suit', tube3([-6, 58, s * 8], [-2, 61, s * 13], [2, 56, s * 16], 1.0, 0.9, 10, 6), '#1e1c1a');
  }
  crystals(r, 'torso', [[-10, 61, 4, 2.6, 12, 0.3, 0.4, 3], [-4, 62.5, -3, 2.2, 10, -0.3, -0.1, 5], [-14, 57, -5, 1.8, 8, -0.5, 0.6, 7], [-6, 60, 7, 1.6, 7, 0.6, 0.2, 9], [16, 52, 6, 1.2, 5, 0.6, -0.6, 11]], WD.crys);
  r.add('torso', 'metal', at(G.box(6, 5, 9, 1), 9, 57, 0), WD.frameL);
  // core heart (crystal through the torso, shutters on both sides)
  r.add('core', 'crystal', at(G.shard(5.4, 31, 6, 11), 9, 46, 0, [Math.PI / 2, 0, 0]), WD.crys);
  r.add('core', 'core', at(G.shard(2.8, 33, 6, 12), 9, 46, 0, [Math.PI / 2, 0, 0]), lin('#8fd8ff', 3.2));
  r.add('sN', 'suit', at(rock(6.8, 21, 0.2, 1, 1.15, 1.05, 0.42), 9, 46, 14.0), WD.rockL);
  r.add('sF', 'suit', at(rock(6.8, 22, 0.2, 1, 1.15, 1.05, 0.42), 9, 46, -14.0), WD.rockL);
  // shed plates
  for (const [b, s] of [['plate0', 1], ['plate1', -1]]) { r.add(b, 'suit', at(rock(9, 72 + s, 0.16, 2, 1.25, 1.0, 0.36), -6, 54, s * 12.4), WD.rockL); crystals(r, b, [[-8, 60, s * 14.5, 1.1, 5, s * 0.8, 0.3, 25 + s]], WD.crys); }
  r.add('plate2', 'suit', at(rock(8, 31, 0.16, 2, 1.3, 0.5, 1.1), 0, 64, 0), WD.rockL);
  crystals(r, 'plate2', [[2, 66, 2, 1.4, 6, 0.2, -0.3, 13]], WD.crys);
  // head
  r.add('head', 'metal', at(G.ext([[-6, -4.5], [6, -4.5], [9.5, -1], [8.5, 3], [3, 6], [-5, 5.5], [-7.5, 1]], 10, 1.2, { steps: 2 }), 12, 58, 0), WD.head);
  r.add('head', 'suit', at(rock(4.6, 30, 0.25, 0, 1.3, 0.5, 1.15), 15, 62.5, 0), WD.rockD);
  for (const s of [1, -1]) {
    r.add('head', 'metal', at(G.ext([[14, 57.8], [21.4, 57.4], [21.6, 60.2], [14.4, 60.4]], 0.35, 0.1), 0, 0, s * 5.0), '#151312');
    r.add('head', 'glow', at(G.ext([[15, 58.4], [21.3, 58.1], [21.4, 59.6], [15.4, 59.8]], 0.3, 0.08), 0, 0, s * 5.2), lin('#ffad3a', 3.4));
  }
  r.add('head', 'glow', at(G.box(0.4, 1.4, 8), 21.3, 58.9, 0), lin('#ffad3a', 3.4));
  r.add('head', 'metal', at(G.box(3, 2.6, 7, 0.4), 19.5, 55, 0), WD.frameL);
  crystals(r, 'head', [[10, 63, 0, 1.0, 4.5, 0, 0.5, 15]], WD.crys);
  // mortar pods
  for (const s of [1, -1]) {
    r.add('pods', 'suit', at(rock(4.4, 40 + s, 0.25, 1, 1.4, 0.9, 1.0), -12, 60, s * 6.5), WD.rockD);
    for (let k = 0; k < 3; k++) {
      const z = s * (4.2 + k * 2.4);
      r.add('pods', 'metal', at(G.cyl(1.4, 1.6, 9, 10), -13 + k * 0.4, 65, z, [0, 0, 0.55]), WD.frame);
      r.add('pods', 'accent', at(G.torus(1.25, 0.3, 4, 10), -15.4 + k * 0.4, 68.8, z, [Math.PI / 2, 0, 0.55]), lin('#ffad3a', 3));
    }
  }
  // cannon arm (near)
  r.add('armN', 'metal', at(G.sph(5, 12, 10), 2, 55, 16), WD.frameL);
  r.add('armN', 'metal', tube3([2, 55, 16], [4, 48, 18], [8, 40, 19], 3.6, 3.0, 10, 8), WD.frame);
  r.add('armN', 'suit', at(rock(8.5, 41, 0.17, 2, 1.15, 0.75, 0.95), 1, 60.5, 18.5), WD.rock);
  crystals(r, 'armN', [[0, 64, 19, 1.4, 6, 0.3, 0.3, 17]], WD.crys);
  r.add('forN', 'metal', at(G.sph(3.4, 10, 8), 8, 40, 19), WD.frameL);
  r.add('forN', 'metal', at(G.box(15, 6.5, 7.5, 1.5, 2), 15.5, 38, 19), WD.frame);
  r.add('forN', 'suit', at(rock(4.6, 42, 0.25, 0, 1.6, 0.6, 1.0), 14, 42, 19), WD.rockD);
  for (const o of [-1.8, 1.8]) {
    r.add('forN', 'metal', at(G.cyl(1.5, 1.7, 10, 12), 26, 37.6, 19 + o, [0, 0, -Math.PI / 2]), WD.frameL);
    r.add('forN', 'accent', at(G.torus(1.55, 0.35, 5, 12), 31, 37.6, 19 + o, [0, Math.PI / 2, 0]), lin('#7fd0ff', 3.2));
  }
  // fist arm (far)
  r.add('armF', 'metal', at(G.sph(5, 12, 10), 2, 55, -16), WD.frameL);
  r.add('armF', 'metal', tube3([2, 55, -16], [4, 48, -18], [8, 40, -19], 3.6, 3.0, 10, 8), WD.frame);
  r.add('armF', 'suit', at(rock(8.5, 43, 0.17, 2, 1.15, 0.75, 0.95), 1, 60.5, -18.5), WD.rock);
  crystals(r, 'armF', [[0, 64, -19, 1.4, 6, -0.3, 0.3, 27]], WD.crys);
  r.add('forF', 'metal', at(G.sph(3.4, 10, 8), 8, 40, -19), WD.frameL);
  r.add('forF', 'metal', tube3([8, 40, -19], [12, 32, -20], [14, 26, -20], 3.8, 3.4, 10, 8), WD.frame);
  r.add('forF', 'suit', at(rock(5, 44, 0.25, 1, 1.0, 1.3, 0.8), 12, 32, -22), WD.rockD);
  r.add('forF', 'metal', at(G.box(11, 11, 10, 2.2, 2), 16, 20, -20), WD.frameL);
  r.add('forF', 'suit', at(rock(5.6, 45, 0.16, 2, 0.9, 1.1, 1.1), 21, 21, -20), WD.rock);
  crystals(r, 'forF', [[24, 25, -17, 1.0, 5, 0.2, -1.2, 19], [24, 20, -21, 1.0, 5, 0, -1.4, 21], [24, 24, -23, 0.8, 4, -0.2, -1.1, 23]], WD.crys);
  // legs
  for (const [n, s] of [['N', 1], ['F', -1]]) {
    r.add('th' + n, 'metal', tube3([-1, 30, s * 9], [3, 24, s * 10], [5, 16, s * 10], 4.6, 3.6, 10, 8), WD.frame);
    r.add('th' + n, 'suit', at(rock(6.2, 60 + s, 0.22, 1, 0.9, 1.4, 0.6), 3, 24, s * 13), WD.rock);
    r.add('sh' + n, 'metal', at(G.sph(3.6, 10, 8), 5, 16, s * 10), WD.frameL);
    r.add('sh' + n, 'suit', at(rock(3.8, 62 + s, 0.25, 0, 1.0, 1.0, 1.2), 8.5, 17, s * 10), WD.rockL);
    r.add('sh' + n, 'metal', tube3([5, 16, s * 10], [3, 10, s * 10], [0, 4, s * 10], 3.6, 3.0, 10, 8), WD.frame);
    r.add('sh' + n, 'suit', at(rock(4.8, 64 + s, 0.22, 1, 0.9, 1.4, 0.6), 5, 10, s * 12.2), WD.rockD);
    r.add('ft' + n, 'metal', at(G.ext([[-9, 0], [11, 0], [13, 3], [7, 6.5], [-6, 6.5], [-10, 3]], 9, 1.2), 0, 0, s * 10), WD.frame);
    r.add('ft' + n, 'suit', at(rock(4.5, 66 + s, 0.22, 1, 1.2, 0.8, 1.1), 10, 3.5, s * 10), WD.rock);
  }
  // damage
  for (const s of [1, -1]) {
    r.add('cracks1', 'glow', G.tube(zig(12, 38, 19, 52, s * 10.9, 5, 1.2, 1), 0.38, 14, 4), CRACK);
    r.add('cracks1', 'glow', G.tube(zig(-14, 56, -2, 50, s * 10.6, 5, 1.4, 2), 0.38, 14, 4), CRACK);
    r.add('cracks2', 'glow', G.tube(zig(-6, 62, 6, 66, s * 7, 4, 1.0, 3), 0.4, 10, 4), CRACK);
    r.add('cracks2', 'glow', G.tube(zig(4, 34, 14, 40, s * 11.6, 4, 1.0, 4), 0.4, 10, 4), CRACK);
    for (let k = 0; k < 3; k++) r.add('spark', 'glow', at(G.box(0.6, 0.6, 0.6), 6 + k * 3, 50 + k * 2, s * 12), lin('#ffd27a', 5));
  }
  return r.build();
}
function wardenPose(B, st, b, s, dt, inst) {
  const sh = shake(st, st.die * 2.4 + (st.kind === 'shockwave' ? st.kick * 1.4 : 0));
  B.root.rotation.y = st.yaw;
  B.root.position.set(sh[0], -st.die * st.die * 16 + sh[1], sh[2]);
  st.phase = (st.phase || 0) + Math.abs(st.vx) * dt / 44 * TAU;
  const walk = clamp(Math.abs(st.vx) / 40, 0, 1), br = Math.sin(st.time * 1.6), T = st.teleS, nx = st.next;
  let crouch = 0, lean = 0, fist = 0, cannon = 0, pod = 0;
  if (b.state === 'tele') { if (nx === 'shockwave') { fist = T; crouch = 0.5 * T; lean = -0.12 * T; } else if (nx === 'lob') { pod = T; lean = 0.08 * T; crouch = 0.3 * T; } else { cannon = T; } }
  if (st.kind === 'shockwave') { const a = st.ap; fist = a < 0.16 ? 1 - (a / 0.16) * 1.25 : -0.25 + (a - 0.16) * 0.4; crouch = 0.9 - a * 0.7; lean = 0.24 * (1 - a); }
  else if (st.kind === 'lob') { pod = 1 - st.ap * 0.6; lean = 0.12 * (1 - st.ap); }
  else if (st.kind === 'volley') cannon = 1;
  const O = st.open; lean += 0.1 * O; crouch += 0.3 * O;
  B.pelvis.position.set(0, 30 - crouch * 4.5 + 0.35 * br * (1 - walk) + walk * 0.9 * Math.abs(Math.sin(st.phase)), 0);
  B.torso.rotation.set(0, 0.05 * Math.sin(st.time * 0.7), -lean + 0.012 * br);
  for (const [n, o] of [['N', 0], ['F', Math.PI]]) {
    const q = st.phase + o;
    B['th' + n].rotation.z = walk * 0.32 * Math.sin(q) + crouch * 0.42;
    B['sh' + n].rotation.z = -walk * 0.42 * Math.max(0, Math.cos(q)) - crouch * 0.75;
    B['ft' + n].rotation.z = crouch * 0.33 - walk * 0.12 * Math.sin(q);
  }
  B.armF.rotation.set(0.45 * O, 0, 1.9 * fist + 0.04 * br - 0.75 * O);
  B.forF.rotation.set(0, 0, 0.7 * Math.max(0, fist));
  B.armN.rotation.set(-0.45 * O, 0, 0.3 * cannon + 0.04 * br - 0.75 * O);
  B.forN.rotation.set(0, 0, cannon * (st.aim - 0.3));
  const rN = B.forN.userData.rest; B.forN.position.set(rN.x - (st.kind === 'volley' ? 2.4 * st.kick : 0), rN.y, rN.z);
  B.pods.rotation.z = 0.28 * pod; const rP = B.pods.userData.rest; B.pods.position.set(rP.x - (st.kind === 'lob' ? 2.2 * st.kick : 0), rP.y, rP.z);
  B.head.rotation.set(0, 0.22 * Math.sin(st.time * 0.5) * (1 - T), -0.12 * O + 0.2 * cannon * st.aim);
  for (const [n, sg] of [['sN', 1], ['sF', -1]]) { const r0 = B[n].userData.rest; B[n].position.set(r0.x - 1.5 * O, r0.y + 12 * O, r0.z + sg * 3.5 * O); B[n].rotation.set(-sg * 0.55 * O, 0, 0.2 * O); }
  inst.fx.pulse(inst.byMat.core, 0.45 + 0.25 * Math.sin(st.time * 3) + O * (2.0 + 0.4 * Math.sin(st.time * 14)) + st.die * 2 * Math.abs(Math.sin(st.time * 31)));
  inst.fx.pulse(inst.byMat.accent, 0.3 + 1.7 * T + 1.5 * st.atk + st.kick);
  damage(B, st, b); shed(B, st, b, ['plate0', 'plate1', 'plate2'], dt);
  breakup(B, st, ['head', 'armN', 'armF', 'pods', 'sN', 'sF', 'core'], 7, 52);
}

// =============================== ABYSS MAW (72 x 58, hover) ===============================
const MW = { skin: '#2c4a50', skinD: '#1d3237', belly: '#6f8f86', plate: '#45606a', plateL: '#5f7e84', crys: '#3fd6c8', tooth: '#dfe8dc', fin: '#2a8f86' };
const TEAL = lin('#3fe6d4', 3.2);
function mawBuild() {
  const r = new Rig(1 / 24);
  r.bone('body', 'root', 0, 29, 0).bone('head', 'body', 6, 30, 0).bone('jaw', 'head', 9, 24, 0).bone('core', 'head', 17, 27, 0)
    .bone('lure', 'head', 14, 46, 0).bone('lure2', 'lure', 24, 54, 0)
    .bone('finN', 'body', -3, 24, 12).bone('finF', 'body', -3, 24, -12)
    .bone('t0', 'body', -12, 30, 0).bone('t1', 't0', -22, 30, 0).bone('t2', 't1', -30, 30, 0)
    .bone('plate0', 'head', 14, 41, 9).bone('plate1', 'head', 14, 41, -9).bone('plate2', 'head', 22, 40, 0)
    .bone('cracks1', 'head', 14, 34, 0).bone('cracks2', 'body', 0, 30, 0).bone('spark', 'head', 16, 36, 0);
  // head mass
  r.add('head', 'flesh', at(blob(17, 12.5, 12.5, 41, 0.08, 22, 14), 15, 32, 0), MW.skin);
  r.add('head', 'flesh', at(blob(12, 6, 10, 42, 0.08), 18, 25, 0), MW.belly);
  r.add('head', 'flesh', at(G.ell(9, 4, 8, 14, 8), 21, 25.5, 0), '#3a1c22');
  for (let k = 0; k < 9; k++) { const x = 16 + k * 2.0, z = 9.2 - Math.abs(k - 4) * 0.25; for (const s of [1, -1]) r.add('head', 'crystal', at(G.crystal(0.75, 3.6 - Math.abs(k - 5) * 0.2, 5, 0.5, 60 + k), x, 27.2, s * (z - 2.8 + k * 0.05), [Math.PI, 0, 0]), MW.tooth); }
  for (const s of [1, -1]) {
    for (let k = 0; k < 3; k++) r.add('head', 'glow', at(G.sph(0.9 - k * 0.15, 8, 6), 25 + k * 2.2, 36.5 + k * 0.7, s * (10.2 - k * 0.6)), TEAL);
    for (let k = 0; k < 4; k++) r.add('head', 'accent', at(G.box(0.5, 6.0 - k * 0.6, 0.4), 4 + k * 2.2, 31, s * 12.1, [0, 0, 0.12]), TEAL);
    for (let k = 0; k < 5; k++) r.add('head', 'paint', at(G.shell(4.2, 3.2, 2.6, 0.5, -0.9, 0.9, 0.4, 2.0, 6, 4), 4 + k * 4.6, 39 - Math.abs(k - 2) * 0.8, s * (11.0 - Math.abs(k - 2) * 0.5), [0, s * -Math.PI / 2, 0]), k % 2 ? MW.plate : MW.plateL);
  }
  crystals(r, 'head', [[10, 43, 2, 2.2, 9, 0.2, 0.5, 3], [5, 42, -3, 1.8, 7, -0.3, 0.7, 5], [16, 44, -1, 1.6, 6, -0.1, -0.2, 7], [0, 40, 4, 1.4, 5, 0.4, 1.0, 9]], MW.crys);
  // jaw
  r.add('jaw', 'flesh', at(blob(14, 4.6, 10.5, 43, 0.08), 19, 20.5, 0), MW.belly);
  r.add('jaw', 'paint', at(G.ext([[8, 18], [30, 18.5], [33, 21], [30, 22], [10, 21]], 18, 1.0), 0, 0, 0), MW.plate);
  for (let k = 0; k < 8; k++) for (const s of [1, -1]) r.add('jaw', 'crystal', at(G.crystal(0.7, 3.2 - Math.abs(k - 4) * 0.2, 5, 0.5, 80 + k), 17 + k * 2.0, 22.2, s * (8.4 - k * 0.2)), MW.tooth);
  // throat core
  r.add('core', 'core', at(G.sph(4.8, 14, 10), 17, 27, 0), lin('#9ffff0', 3.4));
  r.add('core', 'flesh', at(G.torus(5.2, 1.2, 6, 16), 17, 27, 0, [0, Math.PI / 2, 0]), '#5a2430');
  // lure
  r.add('lure', 'flesh', tube3([14, 46, 0], [18, 54, 0], [24, 54, 0], 1.0, 0.6, 12, 6), MW.skinD);
  r.add('lure2', 'flesh', tube3([24, 54, 0], [29, 54, 0], [31, 50, 0], 0.6, 0.35, 10, 5), MW.skinD);
  r.add('lure2', 'core', at(G.sph(2.0, 12, 8), 31, 48.6, 0), lin('#b6fff4', 3.0));
  // body + tail
  r.add('body', 'flesh', at(blob(14, 11.5, 11.5, 44, 0.08), -5, 30, 0), MW.skinD);
  r.add('body', 'flesh', at(G.ell(11, 5, 9, 14, 8), -4, 22, 0), MW.belly);
  for (let k = 0; k < 7; k++) r.add('body', 'paint', at(G.cone(1.0, 4.2 - Math.abs(k - 3) * 0.4, 6), 6 - k * 3.2, 41 - Math.abs(k - 2) * 0.5, 0, [0, 0, 0.35]), MW.plate);
  for (let k = 0; k < 6; k++) for (const s of [1, -1]) r.add('body', 'paint', at(G.shell(3.4, 2.8, 2.2, 0.45, -0.9, 0.9, 0.4, 2.0, 6, 4), -14 + k * 3.6, 35 + Math.sin(k * 1.3) * 0.6, s * 10.2, [0, s * -Math.PI / 2, 0]), k % 2 ? MW.plate : MW.plateL);
  for (let k = 0; k < 6; k++) for (const s of [1, -1]) r.add('body', 'glow', at(G.sph(0.55, 6, 4), -14 + k * 3.2, 28 + Math.sin(k) * 1.5, s * 11), TEAL);
  crystals(r, 'body', [[-6, 40, 3, 1.4, 5, 0.3, 0.4, 11], [-12, 38, -4, 1.1, 4, -0.4, 0.6, 13]], MW.crys);
  r.add('t0', 'flesh', at(blob(9.5, 8, 8, 45, 0.08), -17, 30, 0), MW.skin);
  for (let k = 0; k < 3; k++) r.add('t0', 'paint', at(G.cone(0.8, 3.0, 6), -12 - k * 3.2, 37.5, 0, [0, 0, 0.4]), MW.plate);
  r.add('t1', 'flesh', at(blob(7, 5.5, 5.5, 46, 0.08), -26, 30, 0), MW.skinD);
  r.add('t2', 'flesh', at(blob(4.5, 3.6, 3.6, 47, 0.08), -32, 30, 0), MW.skin);
  r.add('t2', 'membrane', at(G.membrane([[-31, 0], [-36, 12], [-38.5, 11], [-35.5, 0], [-38.5, -11], [-36, -12]]), 0, 30, 0), MW.fin);
  for (const a of [-0.9, -0.45, 0, 0.45, 0.9]) r.add('t2', 'paint', G.tube([[-31.5, 30, 0], [-34.5 - Math.abs(a), 30 + a * 6, 0], [-37.6, 30 + a * 12.4, 0]], 0.22, 6, 4), MW.skinD);
  for (const [b, s] of [['finN', 1], ['finF', -1]]) {
    r.add(b, 'membrane', at(G.membrane([[0, 0], [-6, -8], [-14, -14], [-16, -10], [-10, -2]]), -3, 24, s * 12), MW.fin);
    for (const e of [[-6, -8], [-11, -12], [-15, -12]]) r.add(b, 'paint', G.tube([[-3, 24, s * 12], [-3 + e[0] * 0.55, 24 + e[1] * 0.5, s * 12.1], [-3 + e[0], 24 + e[1], s * 12.1]], 0.2, 6, 4), MW.skinD);
    r.add(b, 'flesh', tube3([-3, 24, s * 12], [-9, 17, s * 12.5], [-17, 12, s * 12.2], 0.6, 0.25, 10, 4), MW.skinD);
  }
  // shed armour plates (head)
  for (const [b, s] of [['plate0', 1], ['plate1', -1]]) {
    r.add(b, 'paint', at(G.shell(11, 8, 7, 1.2, s > 0 ? 0.1 : -1.5, s > 0 ? 1.5 : -0.1, 0.15, 1.1, 10, 5), 14, 35, s * 3.5), MW.plate);
    crystals(r, b, [[12, 43, s * 8, 1.2, 5, s * 0.6, 0.3, 21 + s]], MW.crys);
  }
  r.add('plate2', 'paint', at(G.shell(9, 7, 9, 1.0, -0.8, 0.8, 0.3, 1.3, 8, 5), 18, 34, 0), MW.plateL);
  // damage
  for (const s of [1, -1]) {
    r.add('cracks1', 'glow', G.tube(zig(6, 36, 22, 40, s * 11.6, 5, 1.0, 5), 0.32, 14, 4), lin('#9ffff0', 3));
    r.add('cracks2', 'glow', G.tube(zig(-14, 26, 2, 34, s * 11.2, 5, 1.2, 6), 0.32, 14, 4), lin('#9ffff0', 3));
    for (let k = 0; k < 3; k++) r.add('spark', 'glow', at(G.box(0.5, 0.5, 0.5), 12 + k * 3, 38 - k, s * 11), lin('#d8fff8', 5));
  }
  return r.build();
}
function mawPose(B, st, b, s, dt, inst) {
  const sh = shake(st, st.die * 2.0);
  B.root.rotation.y = st.yaw;
  B.root.position.set(sh[0], sh[1] - st.die * st.die * 18, sh[2]);
  const T = st.teleS, nx = st.next, O = st.open, t = st.time;
  let jaw = 0.08 + 0.05 * Math.sin(t * 1.3), headUp = 0, stretch = 0, tailCoil = 0, swim = 1;
  if (b.state === 'tele') { if (nx === 'dash') { headUp = -0.1 * T; tailCoil = T; jaw = 0.02; } else if (nx === 'volley') { jaw = 0.25 * T; } else { headUp = 0.25 * T; jaw = 0.1 + 0.1 * T; } }
  if (st.kind === 'dash') { stretch = 1; jaw = 0.55; swim = 2.6; tailCoil = -0.4; }
  else if (st.kind === 'volley') { jaw = 0.7 * (1 - st.ap * 0.6); headUp = 0.1; }
  else if (st.kind === 'lob') { headUp = 0.35 * (1 - st.ap); jaw = 0.4; }
  jaw = Math.max(jaw, 0.75 * O); headUp += 0.18 * O;
  if (st.die > 0) { jaw = 0.6 + 0.2 * Math.sin(t * 9); headUp = -0.3 * st.die; swim = 0.3; }
  st.jaw = approach(st.jaw || 0, jaw, 14, dt);
  B.body.rotation.set(0.04 * Math.sin(t * 1.1), 0, -0.05 * stretch + 0.03 * Math.sin(t * 1.5) + st.die * -0.25);
  B.body.position.set(stretch * 3, 29 + Math.sin(t * 2.2) * 0.8, 0);
  B.head.rotation.set(0, 0, headUp + 0.03 * Math.sin(t * 1.5 + 1));
  B.jaw.rotation.z = -st.jaw;
  const w = t * 3.2 * swim;
  B.t0.rotation.set(0, 0.12 * Math.sin(w - 0.6), 0.12 * Math.sin(w - 0.6) + 0.25 * tailCoil);
  B.t1.rotation.set(0, 0.18 * Math.sin(w - 1.3), 0.18 * Math.sin(w - 1.3) + 0.35 * tailCoil);
  B.t2.rotation.set(0, 0.25 * Math.sin(w - 2.0), 0.25 * Math.sin(w - 2.0) + 0.45 * tailCoil);
  B.finN.rotation.x = -0.25 - 0.25 * Math.sin(t * 2.2 * swim); B.finF.rotation.x = 0.25 + 0.25 * Math.sin(t * 2.2 * swim);
  B.lure.rotation.z = 0.12 * Math.sin(t * 1.4) - 0.1 * headUp; B.lure2.rotation.z = 0.2 * Math.sin(t * 1.4 - 0.8);
  B.core.scale.setScalar(0.8 + 0.3 * O);
  inst.fx.pulse(inst.byMat.core, 0.4 + 0.2 * Math.sin(t * 2.5) + O * 2.0 + st.die * Math.abs(Math.sin(t * 27)) * 2);
  inst.fx.pulse(inst.byMat.accent, 0.4 + 1.6 * T + 1.2 * st.atk);
  damage(B, st, b); shed(B, st, b, ['plate0', 'plate1', 'plate2'], dt);
  breakup(B, st, ['jaw', 'lure', 'finN', 'finF', 't1', 't2'], 11, 40);
}

// =============================== BLOCKADE GUNSHIP (84 x 66, hover, shmup) ===============================
const GS = { hull: '#30353c', hullL: '#4a5059', hullD: '#1e2227', red: '#8a1c1c', stripe: '#b8862e', metal: '#5c6168' };
const RED = lin('#ff3b2f', 3.4), ORANGE = lin('#ff7a2a', 3.4);
function gunshipBuild() {
  const r = new Rig(1 / 26);
  r.bone('hull', 'root', 0, 33, 0).bone('chin', 'hull', 26, 22, 0).bone('gat', 'chin', 30, 22, 0).bone('tur', 'hull', 8, 47, 0).bone('tgun', 'tur', 10, 50, 0)
    .bone('vls', 'hull', -16, 46, 0).bone('engN', 'hull', -14, 30, 22).bone('engF', 'hull', -14, 30, -22)
    .bone('flN', 'engN', -32.4, 30, 22).bone('flF', 'engF', -32.4, 30, -22)
    .bone('hTN', 'hull', 2, 34, 14.2).bone('hBN', 'hull', 2, 34, 14.2).bone('hTF', 'hull', 2, 34, -14.2).bone('hBF', 'hull', 2, 34, -14.2)
    .bone('core', 'hull', 2, 34, 0).bone('plate0', 'hull', -10, 40, 13.4).bone('plate1', 'hull', -10, 40, -13.4)
    .bone('cracks1', 'hull', 0, 34, 0).bone('cracks2', 'hull', 0, 34, 0).bone('spark', 'hull', 10, 38, 0).bone('nav', 'hull', 0, 33, 0);
  const hull = G.ext([[-36, 22], [20, 20], [36, 26], [41, 32], [30, 42], [6, 48], [-26, 46], [-38, 36]], 26, 2.5, { steps: 4 });
  warp(hull, (v) => { v.y -= 0.012 * v.z * v.z * (v.y > 34 ? 1 : -0.6); }, true);
  r.add('hull', 'paint', hull, GS.hull);
  r.add('hull', 'paint', at(G.ext([[-30, 41], [18, 40], [26, 44], [4, 50], [-24, 48]], 18, 1.5), 0, 0, 0), GS.hullL);
  for (const s of [1, -1]) {
    r.add('hull', 'paint', at(G.ext([[-34, 26], [16, 24], [30, 29], [24, 31], [-32, 32]], 1.0, 0.3), 0, 0, s * 13.2), GS.hullL);
    r.add('hull', 'paint', at(G.ext([[-30, 31.5], [22, 30.8], [24, 32], [-30, 33]], 1.1, 0.2), 0, 0, s * 13.3), GS.red);
    r.add('hull', 'metal', at(G.torus(8.2, 1.4, 6, 24), 2, 34, s * 13.4), GS.metal);
    for (let k = 0; k < 5; k++) r.add('hull', 'metal', at(G.box(2.4, 0.6, 0.6), -26 + k * 4.2, 38.8, s * 13.3), GS.hullD);
    r.add('hull', 'glow', at(G.box(10, 0.5, 0.3), 24, 27, s * 12.4, [0, 0, 0.25]), RED);
    // stub wings to the engines
    r.add('hull', 'paint', at(G.box(12, 2.2, 12, 0.6), -14, 30, s * 16), GS.hullD);
    r.add('hull', 'paint', at(G.ext([[-24, 40], [-12, 40], [-16, 54], [-24, 56]], 0.9, 0.3), 0, 0, s * 9, [s * 0.25, 0, 0]), GS.hullL);
    r.add('hull', 'paint', at(G.box(5, 1.6, 0.95), -21, 53, s * 9.6, [s * 0.25, 0, 0]), GS.red);
  }
  // reactor core + iris hatches
  r.add('core', 'core', at(G.cyl(7.2, 7.2, 27.4, 20), 2, 34, 0, [Math.PI / 2, 0, 0]), lin('#ffb066', 3.2));
  for (const [t, bb, s] of [['hTN', 'hBN', 1], ['hTF', 'hBF', -1]]) {
    r.add(t, 'paint', at(G.ext([[-7.6, 0], [7.6, 0], [6.6, 3.8], [3.8, 6.6], [0, 7.6], [-3.8, 6.6], [-6.6, 3.8]], 1.4, 0.4), 2, 34, s * 14.0), GS.hullL);
    r.add(bb, 'paint', at(G.ext([[-7.6, 0], [-6.6, -3.8], [-3.8, -6.6], [0, -7.6], [3.8, -6.6], [6.6, -3.8], [7.6, 0]], 1.4, 0.4), 2, 34, s * 14.0), GS.hull);
    r.add(t, 'paint', at(G.box(12, 0.5, 0.3), 2, 34.6, s * 14.8), GS.stripe);
  }
  // chin gatling
  r.add('chin', 'metal', at(G.sph(5, 12, 10), 26, 22, 0), GS.hullD);
  r.add('chin', 'paint', at(G.shell(5.4, 5.4, 5.4, 0.6, -1.0, 1.0, 0.3, 2.2, 8, 6), 26, 22, 0), GS.hullL);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.add('gat', 'metal', at(G.cyl(0.6, 0.6, 12, 8), 35, 22 + Math.cos(a) * 1.6, Math.sin(a) * 1.6, [0, 0, -Math.PI / 2]), GS.metal); }
  r.add('gat', 'metal', at(G.cyl(2.4, 2.4, 1.2, 12), 32, 22, 0, [0, 0, -Math.PI / 2]), GS.hullD);
  r.add('gat', 'metal', at(G.cyl(2.4, 2.4, 1.0, 12), 39, 22, 0, [0, 0, -Math.PI / 2]), GS.hullD);
  r.add('gat', 'accent', at(G.torus(2.0, 0.3, 4, 12), 41.2, 22, 0, [0, Math.PI / 2, 0]), ORANGE);
  // top turret
  r.add('tur', 'paint', at(G.shell(7, 5, 7, 0.6, 0, TAU, 0, Math.PI / 2 + 0.2, 16, 5), 8, 47, 0), GS.hullL);
  r.add('tur', 'paint', at(G.torus(6.9, 0.4, 4, 18), 8, 47.4, 0, [Math.PI / 2, 0, 0]), GS.red);
  r.add('tgun', 'paint', at(G.box(6, 4, 6, 1, 2), 11, 50, 0), GS.hull);
  for (const z of [1.6, -1.6]) {
    r.add('tgun', 'metal', at(G.cyl(0.85, 0.95, 16, 10), 21, 50.4, z, [0, 0, -Math.PI / 2]), GS.metal);
    r.add('tgun', 'accent', at(G.torus(0.95, 0.25, 4, 10), 29.2, 50.4, z, [0, Math.PI / 2, 0]), ORANGE);
  }
  r.add('tgun', 'core', at(G.box(0.3, 0.8, 2.6), 14.1, 51.2, 0), RED);
  // VLS pods
  r.add('vls', 'paint', at(G.box(14, 5, 14, 1, 2), -16, 48, 0), GS.hullD);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    r.add('vls', 'metal', at(G.box(3.4, 0.6, 4.4, 0.2), -20.5 + i * 4.5, 50.7, -3 + j * 6), GS.metal);
    r.add('vls', 'accent', at(G.cone(1.2, 2.4, 8), -20.5 + i * 4.5, 51.8, -3 + j * 6), RED);
  }
  // engines
  for (const [b, f, s] of [['engN', 'flN', 1], ['engF', 'flF', -1]]) {
    r.add(b, 'paint', at(G.cyl(5.4, 6.0, 24, 16), -16, 30, s * 22, [0, 0, Math.PI / 2]), GS.hull);
    r.add(b, 'metal', at(G.torus(5.7, 0.8, 5, 18), -4.5, 30, s * 22, [0, Math.PI / 2, 0]), GS.metal);
    r.add(b, 'metal', at(G.lathe([[5.6, 0], [6.4, -0.6], [5.6, -4.0], [4.6, -4.2], [4.8, -0.6]], 16), -28, 30, s * 22, [0, 0, Math.PI / 2]), GS.hullD);
    r.add(b, 'glow', at(G.cyl(4.6, 4.6, 0.2, 16), -32.2, 30, s * 22, [0, 0, Math.PI / 2]), ORANGE);
    r.add(b, 'paint', at(G.box(16, 1.2, 0.6), -14, 30, s * 27.6), GS.stripe);
    r.add(b, 'paint', at(G.ext([[-26, 35], [-10, 35], [-14, 42], [-24, 43]], 0.8, 0.25), 0, 0, s * 22), GS.hullL);
    r.add(f, 'glow', at(G.lathe([[4.4, 0], [3.2, -4], [1.6, -8], [0.05, -11]], 12), -32.4, 30, s * 22, [0, 0, Math.PI / 2]), lin('#ff8a4a', 2.4));
  }
  r.add('nav', 'glow', at(G.sph(0.8, 6, 4), -36, 37, 0), RED);
  r.add('nav', 'glow', at(G.sph(0.8, 6, 4), 30, 42, 0), lin('#ffffff', 4));
  // shed plates over the hull sides
  for (const [b, s] of [['plate0', 1], ['plate1', -1]]) r.add(b, 'paint', at(G.ext([[-28, 35], [-6, 35], [-4, 44], [-26, 45]], 1.4, 0.5), 0, 0, s * 13.6), GS.hullL);
  for (const s of [1, -1]) {
    r.add('hull', 'glow', G.tube([[-26, 38, s * 12.9], [-18, 42, s * 12.9], [-10, 37, s * 12.9], [-4, 41, s * 12.9]], 0.6, 12, 5), ORANGE.map(c => c * 0.7));
    r.add('cracks1', 'glow', G.tube(zig(14, 28, 30, 36, s * 13.6, 5, 1.0, 7), 0.32, 14, 4), CRACK);
    r.add('cracks2', 'glow', G.tube(zig(-34, 30, -16, 26, s * 13.6, 5, 1.0, 8), 0.32, 14, 4), CRACK);
    for (let k = 0; k < 3; k++) r.add('spark', 'glow', at(G.box(0.6, 0.6, 0.6), 8 + k * 4, 40 - k, s * 14), lin('#ffd27a', 5));
  }
  return r.build();
}
function gunshipPose(B, st, b, s, dt, inst) {
  const sh = shake(st, st.die * 2.2 + (st.kind === 'barrage' ? 0.35 : 0));
  B.root.rotation.y = st.yaw;
  B.root.position.set(sh[0], sh[1] - st.die * st.die * 26, sh[2]);
  const T = st.teleS, nx = st.next, O = st.open, t = st.time;
  B.hull.rotation.set(0.04 * Math.sin(t * 0.9) + st.die * 0.3, 0, 0.03 * Math.sin(t * 1.3) - st.die * 0.35);
  // turret tracks the player during volley / tele-volley
  const tv = (b.state === 'tele' && nx === 'volley') || st.kind === 'volley' ? 1 : 0;
  st.tv = approach(st.tv || 0, tv, 6, dt);
  B.tur.rotation.y = 0; B.tgun.rotation.z = st.tv * clamp(st.aim, -0.5, 0.6);
  const rg = B.tgun.userData.rest; B.tgun.position.set(rg.x - (st.kind === 'volley' ? 2.5 * st.kick : 0), rg.y, rg.z);
  st.gspin = (st.gspin || 0) + dt * (st.kind === 'barrage' ? 30 : (b.state === 'tele' && nx === 'barrage' ? 12 * T : 0.5));
  B.gat.rotation.x = st.gspin;
  B.chin.rotation.z = (st.kind === 'barrage' || (b.state === 'tele' && nx === 'barrage')) ? clamp(st.aim, -0.6, 0.3) : 0;
  const lobUp = (st.kind === 'lob' ? 1 - st.ap : 0) + (b.state === 'tele' && nx === 'lob' ? T * 0.5 : 0);
  B.vls.position.y = B.vls.userData.rest.y + 1.5 * lobUp;
  for (const [tb, bb] of [['hTN', 'hBN'], ['hTF', 'hBF']]) { B[tb].position.y = B[tb].userData.rest.y + 8 * O; B[bb].position.y = B[bb].userData.rest.y - 8 * O; }
  const f = 0.85 + 0.15 * Math.sin(t * 43) + 0.25 * (st.kind ? 1 : 0);
  B.flN.scale.set(f, 1, 1); B.flF.scale.set(f * (0.97 + 0.03 * Math.sin(t * 37)), 1, 1);
  B.nav.scale.setScalar((t % 1.2) < 0.1 ? 1 : 0.0001);
  inst.fx.pulse(inst.byMat.core, 0.35 + 0.15 * Math.sin(t * 3) + O * 2.4 + st.die * 2 * Math.abs(Math.sin(t * 29)));
  inst.fx.pulse(inst.byMat.accent, 0.3 + 1.8 * T + 1.6 * st.atk);
  damage(B, st, b); shed(B, st, b, ['plate0', 'plate1'], dt);
  breakup(B, st, ['engN', 'engF', 'tur', 'vls', 'chin', 'hTN', 'hBF'], 13, 56);
}

export const BOSSES_A = {
  warden: { build: wardenBuild, pose: wardenPose },
  maw: { build: mawBuild, pose: mawPose },
  gunship: { build: gunshipBuild, pose: gunshipPose },
};
