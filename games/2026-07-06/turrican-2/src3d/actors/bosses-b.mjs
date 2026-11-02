// Bosses part B: FORGE COLOSSUS (colossus), HIVE QUEEN (queen), THE SOVEREIGN (machine).
import * as THREE from 'three';
import { G, Rig, xf, warp, at, tube3, rock, blob, crystals, lin, clamp, lerp, smooth, approach, TAU } from './ekit.mjs';
import { damage, shed, breakup, shake } from './bkit.mjs';

const zig = (x0, y0, x1, y1, z, n, amp, seed) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n; const h = Math.sin(seed * 13.7 + i * 7.3) * amp; p.push([x0 + (x1 - x0) * t + h * 0.4, y0 + (y1 - y0) * t + h, z]); } return p; };
const MOLTEN = lin('#ff6a14', 3.4), YELLOW = lin('#ffcf3a', 3.2), CRACK = lin('#ff8a2a', 3.0);

// =============================== FORGE COLOSSUS (72 x 84) ===============================
const FC = { iron: '#302c2a', ironL: '#48423e', steel: '#5c6066', steelL: '#7c8086', brass: '#a07a3a', hazard: '#d8a12a', dark: '#1a1716', rust: '#6e3a20' };
function colossusBuild() {
  const r = new Rig(1 / 26);
  r.bone('pelvis', 'root', 0, 34, 0).bone('torso', 'pelvis', 0, 40, 0).bone('head', 'torso', 9, 70, 0)
    .bone('core', 'torso', 6, 49, 0).bone('doorN', 'torso', 14.5, 49, 13.4).bone('doorF', 'torso', 14.5, 49, -13.4).bone('stacks', 'torso', -10, 70, 0)
    .bone('armN', 'torso', 0, 64, 18).bone('forN', 'armN', 4, 47, 21).bone('armF', 'torso', 0, 64, -18).bone('forF', 'armF', 4, 47, -21)
    .bone('plate0', 'torso', -6, 57, 13).bone('plate1', 'torso', -6, 57, -13).bone('plate2', 'torso', 0, 71, 0)
    .bone('cracks1', 'torso', 0, 50, 0).bone('cracks2', 'torso', 0, 50, 0).bone('spark', 'torso', 0, 56, 0);
  for (const [n, s] of [['N', 1], ['F', -1]]) r.bone('th' + n, 'pelvis', -2, 34, s * 10).bone('sh' + n, 'th' + n, 4, 19, s * 11).bone('ft' + n, 'sh' + n, -1, 5, s * 11);
  // pelvis
  r.add('pelvis', 'paint', at(G.box(22, 10, 20, 1.6, 2), -1, 34, 0), FC.iron);
  for (let k = 0; k < 6; k++) r.add('pelvis', 'paint', at(G.box(2.4, 3.2, 20.4), -9 + k * 3.6, 31.6, 0, [0, 0, 0.6]), k % 2 ? FC.dark : FC.hazard);
  for (const s of [1, -1]) r.add('pelvis', 'metal', at(G.cyl(5, 5, 4.4, 16), -2, 34, s * 10.4, [Math.PI / 2, 0, 0]), FC.steelL);
  // torso frame + plating
  r.add('torso', 'metal', G.ext([[-16, 38], [14, 38], [19, 48], [18, 62], [10, 70], [-10, 70], [-18, 60]], 24, 2.4, { steps: 2 }), FC.steel);
  for (const s of [1, -1]) {
    r.add('torso', 'paint', at(G.ext([[-16, 39], [2, 39], [2, 47], [-17, 47]], 1.4, 0.5), 0, 0, s * 12.4), FC.ironL);
    r.add('torso', 'metal', at(G.torus(8.6, 1.3, 6, 22), 6, 49, s * 12.4), FC.brass);
    for (let k = 0; k < 4; k++) r.add('torso', 'metal', at(G.box(16, 0.9, 0.6), 6, 44 + k * 3.2, s * 12.6), FC.dark);
    for (let k = 0; k < 3; k++) r.add('torso', 'accent', at(G.box(6, 0.6, 0.4), 12, 62 + k * 1.6, s * 12.2, [0, 0, -0.35]), MOLTEN);
    r.add('torso', 'glow', G.tube([[-15, 50, s * 11.8], [-8, 54, s * 12], [-12, 60, s * 12], [-4, 64, s * 11.8]], 0.7, 12, 5), MOLTEN.map(c => c * 0.6));
    r.add('torso', 'metal', at(G.torus(3.4, 0.9, 6, 14), -10, 58, s * 11.8), FC.steelL);
    r.add('torso', 'suit', tube3([-12, 64, s * 8], [-6, 69, s * 14], [0, 64, s * 18], 1.1, 1.0, 10, 6), FC.dark);
  }
  r.add('torso', 'paint', at(G.ext([[10, 60], [19, 52], [20, 58], [14, 67]], 18, 1.2), 0, 0, 0), FC.ironL);
  // furnace core + doors
  r.add('core', 'core', at(G.cyl(8, 8, 25.2, 20), 6, 49, 0, [Math.PI / 2, 0, 0]), lin('#ff9a40', 3.3));
  for (const s of [1, -1]) for (let k = -2; k <= 2; k++) r.add('torso', 'metal', at(G.box(0.7, 15, 0.7), 6 + k * 3.0, 49, s * 12.8), FC.dark);
  for (const [b, s] of [['doorN', 1], ['doorF', -1]]) {
    r.add(b, 'paint', at(G.ext([[-2, -7.4], [14.5, -7.4], [15.8, -5], [15.8, 5], [14.5, 7.4], [-2, 7.4], [-3.2, 5], [-3.2, -5]], 1.6, 0.5), -1.2, 49, s * 13.6), FC.ironL);
    r.add(b, 'metal', at(G.box(14, 1.0, 0.5), 6, 49, s * 14.5), FC.brass);
    for (const y of [44, 54]) r.add(b, 'metal', at(G.cyl(0.8, 0.8, 2.4, 8), 14.5, y, s * 13.4), FC.steelL);
  }
  // head cab
  r.add('head', 'paint', at(G.ext([[-5, -4.5], [6, -4.5], [8.5, 0], [6.5, 5], [-4, 5.2], [-6, 1]], 9.4, 1.0), 9, 70, 0), FC.ironL);
  for (const s of [1, -1]) {
    r.add('head', 'metal', at(G.ext([[11, 70], [17.4, 69.6], [17.4, 71.6], [11.6, 71.8]], 0.3, 0.08), 0, 0, s * 4.75), FC.dark);
    r.add('head', 'glow', at(G.ext([[11.6, 70.4], [17.2, 70.1], [17.2, 71.2], [12, 71.4]], 0.3, 0.06), 0, 0, s * 4.95), YELLOW);
  }
  r.add('head', 'glow', at(G.box(0.4, 1.0, 7), 17.5, 70.7, 0), YELLOW);
  r.add('head', 'metal', at(G.cyl(0.25, 0.25, 6, 5), 4, 77, 3, [0, 0, 0.3]), FC.steelL);
  // smokestacks
  for (const s of [1, -1]) {
    r.add('stacks', 'paint', at(G.cyl(2.6, 3.0, 14, 14), -12, 76, s * 6), FC.iron);
    for (const y of [72, 79]) r.add('stacks', 'metal', at(G.torus(2.9, 0.45, 5, 14), -12, y, s * 6, [Math.PI / 2, 0, 0]), FC.brass);
    r.add('stacks', 'accent', at(G.cyl(2.2, 2.2, 0.3, 12), -12, 83.1, s * 6), MOLTEN);
  }
  // hammer arm (near)
  r.add('armN', 'metal', at(G.cyl(5.4, 5.4, 6, 16), 0, 64, 18, [Math.PI / 2, 0, 0]), FC.steelL);
  r.add('armN', 'paint', at(G.ext([[-8, 64], [-4, 71], [6, 71], [9, 64], [4, 60], [-5, 60]], 4, 1.0), 0, 0, 20), FC.ironL);
  for (let k = 0; k < 4; k++) r.add('armN', 'paint', at(G.box(1.6, 2.6, 0.4), -4 + k * 3, 66, 22.1, [0, 0, 0.6]), k % 2 ? FC.dark : FC.hazard);
  r.add('armN', 'metal', tube3([0, 64, 18.5], [2, 56, 20], [4, 47, 21], 3.4, 3.0, 10, 8), FC.steel);
  r.add('armN', 'metal', at(G.cyl(1.0, 1.0, 12, 8), 4, 56, 23.2, [0, 0, 0.2]), FC.steelL);
  r.add('forN', 'metal', at(G.sph(3.6, 12, 8), 4, 47, 21), FC.brass);
  r.add('forN', 'paint', tube3([4, 47, 21], [7, 40, 21], [9, 34, 21], 3.6, 3.2, 10, 8), FC.ironL);
  r.add('forN', 'paint', at(G.box(11, 15, 12, 1.6, 2), 10, 26, 21), FC.iron);
  for (const y of [21, 31]) r.add('forN', 'metal', at(G.box(11.6, 1.4, 12.6, 0.3), 10, y, 21), FC.brass);
  r.add('forN', 'accent', at(G.box(0.6, 12, 10), 15.8, 26, 21), MOLTEN);
  // slag cannon arm (far)
  r.add('armF', 'metal', at(G.cyl(5.4, 5.4, 6, 16), 0, 64, -18, [Math.PI / 2, 0, 0]), FC.steelL);
  r.add('armF', 'paint', at(G.ext([[-8, 64], [-4, 71], [6, 71], [9, 64], [4, 60], [-5, 60]], 4, 1.0), 0, 0, -20), FC.ironL);
  r.add('armF', 'metal', tube3([0, 64, -18.5], [2, 56, -20], [4, 47, -21], 3.4, 3.0, 10, 8), FC.steel);
  r.add('forF', 'metal', at(G.sph(3.6, 12, 8), 4, 47, -21), FC.brass);
  r.add('forF', 'paint', at(G.box(16, 7.5, 8, 1.4, 2), 12, 45, -21), FC.ironL);
  r.add('forF', 'metal', at(G.cyl(2.8, 3.2, 12, 14), 24, 45, -21, [0, 0, -Math.PI / 2]), FC.steel);
  for (const x of [20, 26]) r.add('forF', 'metal', at(G.torus(3.2, 0.5, 5, 14), x, 45, -21, [0, Math.PI / 2, 0]), FC.brass);
  r.add('forF', 'accent', at(G.cyl(2.2, 2.2, 0.3, 12), 30.2, 45, -21, [0, 0, -Math.PI / 2]), MOLTEN);
  // legs
  for (const [n, s] of [['N', 1], ['F', -1]]) {
    r.add('th' + n, 'metal', tube3([-2, 34, s * 10], [2, 26, s * 11], [4, 19, s * 11], 4.6, 3.8, 10, 8), FC.steel);
    r.add('th' + n, 'paint', at(G.ext([[-4, 31], [6, 30], [7, 21], [-1, 22]], 2.0, 0.6), 0, 0, s * 15), FC.ironL);
    r.add('th' + n, 'metal', at(G.cyl(0.9, 0.9, 12, 8), -3, 26, s * 15.6, [0, 0, -0.25]), FC.steelL);
    r.add('sh' + n, 'metal', at(G.cyl(4.0, 4.0, 7, 14), 4, 19, s * 11, [Math.PI / 2, 0, 0]), FC.brass);
    r.add('sh' + n, 'paint', at(G.box(7.5, 14, 8.5, 1.4, 2), 1.6, 12, s * 11, [0, 0, 0.2]), FC.iron);
    for (let k = 0; k < 3; k++) r.add('sh' + n, 'paint', at(G.box(1.4, 2.2, 0.4), 0 + k * 2.4, 14, s * 15.4, [0, 0, 0.6]), k % 2 ? FC.dark : FC.hazard);
    r.add('ft' + n, 'paint', at(G.ext([[-9, 0], [12, 0], [13.5, 2.6], [8, 6], [-6, 6], [-10, 3]], 11, 1.2), 0, 0, s * 11), FC.ironL);
    for (const z of [-3.4, 0, 3.4]) r.add('ft' + n, 'metal', at(G.box(3.2, 2.6, 2.6, 0.6), 13, 1.6, s * 11 + z), FC.steelL);
  }
  for (const [b, s] of [['plate0', 1], ['plate1', -1]]) {
    r.add(b, 'paint', at(G.ext([[-17, 50], [0, 50], [2, 63], [-8, 67], [-17, 62]], 2.2, 0.7, { steps: 2 }), 0, 0, s * 13.2), FC.ironL);
    for (let k = 0; k < 4; k++) r.add(b, 'paint', at(G.box(1.8, 3.0, 0.4), -14 + k * 3.4, 53, s * 14.4, [0, 0, 0.6]), k % 2 ? FC.dark : FC.hazard);
  }
  r.add('plate2', 'paint', at(G.ext([[-12, 68], [10, 68], [12, 73], [-12, 74]], 30, 1.2), 0, 0, 0), FC.ironL);
  for (const s of [1, -1]) {
    r.add('cracks1', 'glow', G.tube(zig(-14, 40, 0, 46, s * 13.3, 5, 1.0, 1), 0.36, 14, 4), CRACK);
    r.add('cracks1', 'glow', G.tube(zig(12, 58, 18, 66, s * 9.2, 4, 0.8, 2), 0.36, 10, 4), CRACK);
    r.add('cracks2', 'glow', G.tube(zig(-16, 60, -4, 68, s * 12.6, 5, 1.0, 3), 0.38, 14, 4), CRACK);
    for (let k = 0; k < 3; k++) r.add('spark', 'glow', at(G.box(0.7, 0.7, 0.7), -6 + k * 4, 56 + k * 2, s * 13.4), lin('#ffd27a', 5));
  }
  return r.build();
}
function colossusPose(B, st, b, s, dt, inst) {
  const sh = shake(st, st.die * 2.6 + (st.kind === 'shockwave' ? st.kick * 1.6 : 0));
  B.root.rotation.y = st.yaw;
  B.root.position.set(sh[0], sh[1] - st.die * st.die * 18, sh[2]);
  const T = st.teleS, nx = st.next, O = st.open, t = st.time;
  const dashing = st.kind === 'dash';
  st.phase = (st.phase || 0) + Math.abs(st.vx) * dt / (dashing ? 60 : 46) * TAU;
  const walk = clamp(Math.abs(st.vx) / 40, 0, 1), br = Math.sin(t * 1.5);
  let crouch = 0, lean = 0, ham = 0, can = 0;
  if (b.state === 'tele') { if (nx === 'dash') { crouch = 0.7 * T; lean = -0.1 * T; } else if (nx === 'shockwave') { ham = T; lean = -0.1 * T; } else { can = T; } }
  if (dashing) { lean = 0.28; crouch = 0.3; }
  else if (st.kind === 'shockwave') { const a = st.ap; ham = a < 0.16 ? 1 - (a / 0.16) * 1.3 : -0.3 + (a - 0.16) * 0.4; crouch = 0.8 - a * 0.6; lean = 0.2 * (1 - a); }
  else if (st.kind === 'volley') can = 1;
  lean += 0.08 * O; crouch += 0.25 * O;
  B.pelvis.position.set(0, 34 - crouch * 4.5 + 0.3 * br * (1 - walk) + walk * 1.1 * Math.abs(Math.sin(st.phase)), 0);
  B.torso.rotation.set(0, 0.04 * Math.sin(t * 0.6), -lean + 0.012 * br);
  for (const [n, o] of [['N', 0], ['F', Math.PI]]) {
    const q = st.phase + o, amp = dashing ? 0.55 : 0.34;
    B['th' + n].rotation.z = walk * amp * Math.sin(q) + crouch * 0.42;
    B['sh' + n].rotation.z = -walk * amp * 1.2 * Math.max(0, Math.cos(q)) - crouch * 0.75;
    B['ft' + n].rotation.z = crouch * 0.33 - walk * 0.12 * Math.sin(q);
  }
  B.armN.rotation.set(0, 0, 2.0 * ham + 0.04 * br + (dashing ? -0.4 : 0));
  B.forN.rotation.set(0, 0, 0.8 * Math.max(0, ham));
  B.armF.rotation.set(0, 0, 0.2 * can + 0.04 * br + (dashing ? -0.4 : 0));
  B.forF.rotation.set(0, 0, can * (st.aim - 0.2));
  const rF = B.forF.userData.rest; B.forF.position.set(rF.x - (st.kind === 'volley' ? 2.4 * st.kick : 0), rF.y, rF.z);
  B.head.rotation.set(0, 0.25 * Math.sin(t * 0.4) * (1 - T), -0.1 * O + 0.15 * can * st.aim);
  B.stacks.rotation.z = 0.03 * Math.sin(t * 2.3);
  B.doorN.rotation.y = -1.7 * O; B.doorF.rotation.y = 1.7 * O;
  const flick = 0.85 + 0.15 * Math.sin(t * 19) * Math.sin(t * 6.3);
  inst.fx.pulse(inst.byMat.core, (0.5 + O * 2.0) * flick + st.die * Math.abs(Math.sin(t * 31)) * 2);
  inst.fx.pulse(inst.byMat.accent, (0.45 + 1.6 * T + 1.4 * st.atk) * flick);
  damage(B, st, b); shed(B, st, b, ['plate0', 'plate1', 'plate2'], dt);
  breakup(B, st, ['head', 'armN', 'armF', 'stacks', 'doorN', 'doorF'], 17, 54);
}

// =============================== HIVE QUEEN (70 x 70, hover) ===============================
const HQ = { crys: '#7a3ff0', crysD: '#5a2ab8', crysL: '#a57aff', flesh: '#4a2240', fleshL: '#6a3256', sac: '#6e3c5e', bone: '#cdbba2', chitin: '#24162a', wing: '#b48cff' };
const ACID = lin('#8fff3f', 3.2);
function queenBuild() {
  const r = new Rig(1 / 24);
  r.bone('thorax', 'root', 0, 40, 0).bone('head', 'thorax', 15, 46, 0).bone('jaw', 'head', 22, 43, 0).bone('abd', 'thorax', -10, 37, 0).bone('abd2', 'abd', -24, 30, 0)
    .bone('wN', 'thorax', -2, 51, 6).bone('wF', 'thorax', -2, 51, -6).bone('wN2', 'thorax', -5, 50, 5).bone('wF2', 'thorax', -5, 50, -5)
    .bone('cpN', 'thorax', 3, 41, 8.5).bone('cpF', 'thorax', 3, 41, -8.5).bone('core', 'thorax', 3, 40, 0)
    .bone('plate0', 'thorax', -2, 48, 6).bone('plate1', 'thorax', -2, 48, -6).bone('cracks1', 'thorax', 0, 40, 0).bone('cracks2', 'thorax', 0, 40, 0).bone('spark', 'thorax', 4, 44, 0);
  for (const [n, s] of [['N', 1], ['F', -1]]) r.bone('sc' + n, 'thorax', 10, 36, s * 8).bone('sc' + n + 'k', 'sc' + n, 18, 24, s * 11);
  const LX = [6, 2, -2, -6];
  LX.forEach((x, i) => { const s = i % 2 ? -1 : 1; r.bone('l' + i, 'thorax', x, 32, s * 5.5).bone('l' + i + 'k', 'l' + i, x + 2, 22, s * 9); });
  // thorax
  r.add('thorax', 'flesh', at(blob(12.5, 9.5, 8.6, 51, 0.08), 2, 40, 0), HQ.flesh);
  r.add('thorax', 'flesh', at(G.ell(8, 4, 6.4, 12, 8), 4, 33.6, 0), HQ.fleshL);
  r.add('thorax', 'core', at(G.sph(5.2, 14, 10), 3, 40, 0), lin('#a6ff5a', 3.2));
  crystals(r, 'thorax', [[-4, 48, 0, 1.8, 9, 0, 0.6, 3], [2, 49, 0, 1.6, 8, 0, 0.3, 5], [8, 48, 0, 1.3, 6, 0, -0.1, 7], [-9, 45, 0, 1.2, 5, 0, 1.0, 9]], HQ.crys);
  r.add('thorax', 'crystal', at(G.shell(12.6, 9.6, 8.8, 0.6, 0, TAU, 0, 0.9, 16, 4), 2, 40.4, 0), HQ.crys);
  for (const [b, s] of [['cpN', 1], ['cpF', -1]]) r.add(b, 'crystal', at(G.shell(10.5, 8.5, 9.2, 0.7, s > 0 ? 0.35 : -2.8, s > 0 ? 2.8 : -0.35, 0.8, 2.1, 10, 5), 3, 40, 0), HQ.crysD);
  for (const [b, s] of [['plate0', 1], ['plate1', -1]]) r.add(b, 'crystal', at(G.shell(12.8, 9.8, 9.0, 0.7, s > 0 ? 1.7 : -3.0, s > 0 ? 3.0 : -1.7, 0.3, 1.4, 8, 4), 2, 40.2, 0), HQ.crys);
  // head
  r.add('head', 'flesh', at(blob(9.0, 6.4, 6.0, 52, 0.08), 21, 47, 0, [0, 0, -0.2]), HQ.fleshL);
  r.add('head', 'crystal', at(G.shell(9.4, 6.8, 6.4, 0.5, -0.6, 3.74, 0, 1.2, 12, 4), 20, 47.4, 0, [0, 0, -0.2]), HQ.crysD);
  crystals(r, 'head', [[15, 52, 0, 1.6, 10, 0, 1.0, 11], [16, 53, 2.6, 1.2, 8, 0.4, 1.1, 13], [16, 53, -2.6, 1.2, 8, -0.4, 1.1, 15], [21, 53, 0, 1.0, 5, 0, 0.4, 17]], HQ.crys);
  for (const s of [1, -1]) for (let k = 0; k < 3; k++) r.add('head', 'glow', at(G.sph(1.0 - k * 0.15, 8, 6), 25.5 + k * 1.8, 48.8 - k * 0.7, s * (4.6 - k * 0.6)), ACID);
  for (const s of [1, -1]) {
    r.add('jaw', 'paint', tube3([22, 43, s * 1.8], [26, 41, s * 2.2], [27.5, 38, s * 0.8], 0.8, 0.15, 8, 5), HQ.bone);
    r.add('jaw', 'paint', tube3([23, 44, s * 2.4], [26.5, 43.6, s * 2.8], [28.4, 41.6, s * 1.6], 0.6, 0.12, 8, 5), HQ.bone);
  }
  r.add('jaw', 'glow', at(G.sph(1.2, 8, 6), 25.5, 42.4, 0), ACID);
  // abdomen / egg sac
  r.add('abd', 'flesh', at(blob(14, 11.5, 10.5, 53, 0.07), -17, 31, 0, [0, 0, 0.25]), HQ.sac);
  for (let k = 0; k < 4; k++) r.add('abd', 'paint', at(G.torus(9.6 - Math.abs(k - 1.2) * 1.4, 0.6, 6, 22), -9 - k * 5, 34 - k * 1.6, 0, [0, Math.PI / 2, 0.25]), HQ.bone);
  for (let k = 0; k < 5; k++) { const a = k * 1.25; r.add('abd', 'accent', G.tube([[-6, 34 + Math.cos(a) * 6, Math.sin(a) * 6], [-16, 31 + Math.cos(a + 0.4) * 10.5, Math.sin(a + 0.4) * 9.6], [-26, 28 + Math.cos(a + 0.8) * 6, Math.sin(a + 0.8) * 5.6]], 0.3, 12, 4), ACID.map(c => c * 0.6)); }
  r.add('abd2', 'flesh', at(G.ell(4.5, 3.6, 3.6, 10, 8), -30, 27, 0, [0, 0, 0.5]), HQ.fleshL);
  r.add('abd2', 'accent', at(G.sph(1.8, 10, 8), -33.4, 24.6, 0), ACID);
  // wings
  const wing = (len, h) => G.membrane([[0, 0], [-len * 0.2, h * 0.7], [-len * 0.6, h], [-len, h * 0.8], [-len * 0.75, h * 0.25], [-len * 0.3, -0.5]]);
  for (const [b, z, len, h] of [['wN', 6, 26, 18], ['wF', -6, 26, 18], ['wN2', 5, 20, 13], ['wF2', -5, 20, 13]]) {
    const ox = b.endsWith('2') ? -5 : -2, oy = b.endsWith('2') ? 50 : 51;
    r.add(b, 'membrane', at(wing(len, h), ox, oy, z), HQ.wing);
    r.add(b, 'crystal', G.tube([[ox, oy, z], [ox - len * 0.3, oy + h * 0.85, z], [ox - len, oy + h * 0.8, z]], 0.35, 10, 4), HQ.crysL);
    r.add(b, 'crystal', G.tube([[ox - len * 0.2, oy + h * 0.4, z], [ox - len * 0.55, oy + h * 0.55, z], [ox - len * 0.8, oy + h * 0.4, z]], 0.22, 8, 4), HQ.crysL);
  }
  // scythe forelimbs
  for (const [n, s] of [['N', 1], ['F', -1]]) {
    r.add('sc' + n, 'paint', tube3([10, 36, s * 8], [15, 31, s * 10], [18, 24, s * 11], 1.6, 1.2, 10, 6), HQ.chitin);
    r.add('sc' + n + 'k', 'paint', at(G.sph(1.4, 8, 6), 18, 24, s * 11), HQ.bone);
    const blade = G.shard(1.6, 22, 5, 70 + s, 0.1); xf(blade, null, null, [1, 1, 0.45]);
    r.add('sc' + n + 'k', 'crystal', at(blade, 22, 31, s * 11, [0, 0, -0.55]), HQ.crysL);
  }
  // hanging legs
  LX.forEach((x, i) => {
    const s = i % 2 ? -1 : 1;
    r.add('l' + i, 'paint', tube3([x, 32, s * 5.5], [x + 1.5, 27, s * 7.8], [x + 2, 22, s * 9], 0.9, 0.6, 8, 5), HQ.chitin);
    r.add('l' + i + 'k', 'paint', tube3([x + 2, 22, s * 9], [x + 0.6, 15, s * 9.5], [x - 1.4, 8, s * 9], 0.6, 0.12, 8, 5), HQ.bone);
  });
  for (const s of [1, -1]) {
    r.add('cracks1', 'glow', G.tube(zig(-8, 44, 10, 48, s * 9.4, 5, 0.8, 1), 0.3, 14, 4), ACID);
    r.add('cracks2', 'glow', G.tube(zig(-6, 34, 10, 36, s * 8.6, 5, 0.8, 2), 0.3, 14, 4), ACID);
    for (let k = 0; k < 3; k++) r.add('spark', 'glow', at(G.box(0.5, 0.5, 0.5), 2 + k * 3, 44 + k, s * 9.6), lin('#e6ffb0', 5));
  }
  return r.build();
}
const _ax = new THREE.Vector3();
function queenPose(B, st, b, s, dt, inst) {
  const sh = shake(st, st.die * 2.0);
  B.root.rotation.y = st.yaw;
  B.root.position.set(sh[0], sh[1] - st.die * st.die * 20, sh[2]);
  const T = st.teleS, nx = st.next, O = st.open, t = st.time;
  let sac = 0, scy = 0, rear = 0, lunge = 0, wingK = 1;
  if (b.state === 'tele') { if (nx === 'spawn') sac = T; else if (nx === 'dash') { scy = T; wingK = 1.6; } else rear = T; }
  if (st.kind === 'spawn') sac = 1 - st.ap * 0.8;
  else if (st.kind === 'dash') { scy = -0.8; lunge = 1; wingK = 2.2; }
  else if (st.kind === 'lob') rear = 1 - st.ap * 1.6;
  B.thorax.rotation.set(0.04 * Math.sin(t * 1.2), 0, -0.18 * lunge + 0.04 * Math.sin(t * 1.6) + 0.1 * rear * 0.5 - st.die * 0.4);
  B.thorax.position.set(3 * lunge, 40 + Math.sin(t * 2.2) * 0.8, 0);
  B.head.rotation.set(0, 0.12 * Math.sin(t * 0.8), 0.3 * rear - 0.1 * lunge);
  B.jaw.rotation.z = -0.25 * Math.max(rear, O * 0.5) - 0.06 * Math.sin(t * 3);
  const pulse = Math.sin(t * 2 + sac * 6);
  B.abd.rotation.z = 0.06 * Math.sin(t * 1.1) - 0.15 * sac;
  B.abd.scale.set(1 - 0.1 * sac + 0.03 * pulse, 1 - 0.12 * sac + 0.03 * pulse, 1 - 0.08 * sac + 0.03 * pulse);
  B.abd2.rotation.z = 0.12 * Math.sin(t * 1.4 - 0.7) - 0.3 * sac;
  const f = Math.sin(t * TAU * 9 * wingK);
  B.wN.rotation.x = -0.3 - 0.55 * f; B.wF.rotation.x = 0.3 + 0.55 * f;
  B.wN2.rotation.x = -0.4 - 0.5 * Math.sin(t * TAU * 9 * wingK + 1); B.wF2.rotation.x = 0.4 + 0.5 * Math.sin(t * TAU * 9 * wingK + 1);
  for (const n of ['N', 'F']) { B['sc' + n].rotation.z = 0.15 * Math.sin(t * 1.3) + 0.9 * scy; B['sc' + n + 'k'].rotation.z = 0.2 * Math.sin(t * 1.3 + 0.6) + 0.6 * Math.max(0, scy) - 0.5 * Math.max(0, -scy); }
  for (let i = 0; i < 4; i++) { B['l' + i].rotation.z = 0.15 * Math.sin(t * 1.7 + i) - 0.3 * lunge; B['l' + i + 'k'].rotation.z = 0.2 * Math.sin(t * 1.7 + i + 0.8) - 0.2; }
  for (const [n, sg] of [['cpN', 1], ['cpF', -1]]) {
    const r0 = B[n].userData.rest; B[n].position.set(r0.x, r0.y + 3 * O, r0.z + sg * 4 * O);
    B[n].quaternion.setFromAxisAngle(_ax.set(1, 0, 0), -sg * 0.9 * O);
  }
  inst.fx.pulse(inst.byMat.core, 0.4 + 0.25 * Math.sin(t * 3) + O * 2.0 + st.die * Math.abs(Math.sin(t * 29)) * 2);
  inst.fx.pulse(inst.byMat.accent, 0.45 + 1.6 * Math.max(T, sac) + 1.2 * st.atk);
  damage(B, st, b); shed(B, st, b, ['plate0', 'plate1'], dt);
  breakup(B, st, ['head', 'wN', 'wF', 'wN2', 'wF2', 'scN', 'scF', 'abd', 'cpN', 'cpF'], 19, 44);
}

// =============================== THE SOVEREIGN (key 'machine', 86 x 96, hover) ===============================
// A colossal crystal-machine intelligence: a violet mind-crystal behind an iris of
// armoured petals, gyroscopic rings, orbiting shards and hanging cable-tendrils.
const SV = { metal: '#2a2430', metalL: '#433a4c', crys: '#8a4dff', crysL: '#c09aff', flesh: '#3a1a30', bone: '#cdbba2' };
const VIOLET = lin('#c58aff', 3.2), GREEN = lin('#8fff3f', 3.2);
function sovereignBuild() {
  const r = new Rig(1 / 28);
  const C = [0, 52, 0];
  r.bone('body', 'root', 0, 52, 0).bone('core', 'body', 0, 52, 0).bone('pupil', 'core', 0, 52, 8).bone('crown', 'body', 0, 74, 0)
    .bone('r0', 'body', 0, 52, 0).bone('r1', 'body', 0, 52, 0).bone('r2', 'body', 0, 52, 0).bone('orbit', 'body', 0, 52, 0)
    .bone('plate0', 'body', 30, 52, 0).bone('plate1', 'body', -30, 52, 0)
    .bone('cracks1', 'core', 0, 52, 0).bone('cracks2', 'core', 0, 52, 0).bone('spark', 'body', 0, 52, 0);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + Math.PI / 2; r.bone('p' + k, 'body', Math.cos(a) * 11, 52 + Math.sin(a) * 11, 13.5); }
  for (let k = 0; k < 4; k++) { const x = -12 + k * 8; r.bone('td' + k, 'body', x, 30, (k % 2 ? -1 : 1) * 3).bone('td' + k + 'b', 'td' + k, x * 1.1, 16, (k % 2 ? -1 : 1) * 3); }
  // mind crystal
  r.add('core', 'crystal', at(G.shard(12, 40, 8, 91, 0.1), ...C), SV.crys);
  r.add('core', 'core', at(G.shard(5.6, 34, 8, 92, 0.1), ...C), lin('#d6a8ff', 3.0));
  r.add('core', 'core', at(G.torus(5.2, 0.9, 6, 24), 0, 52, 8.4), GREEN);
  r.add('pupil', 'metal', at(G.cyl(2.6, 2.6, 0.8, 16), 0, 52, 9.6, [Math.PI / 2, 0, 0]), '#0c0a10');
  r.add('pupil', 'glow', at(G.torus(2.7, 0.3, 4, 16), 0, 52, 10.0), GREEN);
  // housing behind the crystal + throat below
  r.add('body', 'metal', at(G.lathe([[0.001, 0], [14, 2], [17, 8], [15, 14], [10, 18], [0.001, 19]], 14), 0, 26, -6, [0, 0, 0]), SV.metal);
  r.add('body', 'paint', at(G.torus(16, 2.2, 8, 28), 0, 52, -7), SV.metalL);
  r.add('body', 'paint', at(G.cyl(15, 15, 4, 24), 0, 52, -10, [Math.PI / 2, 0, 0]), SV.metal);
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; r.add('body', 'glow', at(G.box(0.5, 3.2, 0.5), Math.cos(a) * 16.4, 52 + Math.sin(a) * 16.4, -4.6, [0, 0, a + Math.PI / 2]), VIOLET.map(c => c * 0.7)); }
  // petals (iris)
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * TAU + Math.PI / 2, cx = Math.cos(a) * 11, cy = 52 + Math.sin(a) * 11;
    const pet = G.ext([[0, -4.2], [22, -2.2], [30, 0], [22, 2.2], [0, 4.2], [-1.6, 0]], 2.2, 0.6, { steps: 2 });
    const edge = G.ext([[2, -4.6], [22, -2.6], [31, 0], [22, -1.6], [2, -3.6]], 2.4, 0.2);
    r.add('p' + k, 'paint', at(pet, cx, cy, 13.5 + k * 0.05, [0, 0, a]), SV.metalL);
    r.add('p' + k, 'glow', at(edge, cx, cy, 13.6 + k * 0.05, [0, 0, a]), VIOLET);
    r.add('p' + k, 'metal', at(G.cyl(1.6, 1.6, 3.2, 10), cx, cy, 13.5, [Math.PI / 2, 0, 0]), SV.metal);
    r.add('p' + k, 'crystal', at(G.crystal(1.1, 4.4, 5, 0.5, 100 + k), cx + Math.cos(a) * 16, cy + Math.sin(a) * 16, 15.0, [Math.PI / 2, 0, 0]), SV.crysL);
  }
  // gyroscopic rings
  r.add('r0', 'paint', at(G.torus(36, 1.8, 6, 56), 0, 52, 0), SV.metal);
  r.add('r0', 'glow', at(G.torus(36, 0.5, 4, 56), 0, 52, 1.6), VIOLET.map(c => c * 0.8));
  r.add('r1', 'paint', at(G.torus(29, 1.4, 6, 48), 0, 52, 0, [1.1, 0, 0]), SV.metalL);
  r.add('r1', 'glow', at(G.torus(29, 0.4, 4, 48), 0, 52, 0, [1.1, 0, 0]), GREEN.map(c => c * 0.6));
  r.add('r2', 'paint', at(G.torus(23, 1.2, 6, 40), 0, 52, 0, [0, 1.2, 0]), SV.metalL);
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; r.add('r0', 'metal', at(G.box(3.2, 3.2, 4.4, 0.6), Math.cos(a) * 36, 52 + Math.sin(a) * 36, 0, [0, 0, a]), SV.metalL); }
  // shed ring segments (phase 2)
  r.add('plate0', 'paint', at(G.torus(40, 1.6, 6, 14, 1.2), 0, 52, -2, [0, 0, -0.6]), SV.metalL);
  r.add('plate1', 'paint', at(G.torus(40, 1.6, 6, 14, 1.2), 0, 52, -2, [0, 0, Math.PI - 0.6]), SV.metalL);
  // orbiting shards
  for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; r.add('orbit', 'crystal', at(G.shard(1.9, 9, 6, 110 + k), Math.cos(a) * 41, 52 + Math.sin(a) * 41, Math.sin(a * 2) * 4, [0.3, 0, a]), SV.crysL); }
  // crown spires
  crystals(r, 'crown', [[0, 68, -3, 3.0, 26, 0, 0, 3], [-8, 66, -4, 2.2, 18, -0.1, 0.35, 5], [8, 66, -4, 2.2, 18, -0.1, -0.35, 7], [-15, 63, -5, 1.6, 11, 0, 0.7, 9], [15, 63, -5, 1.6, 11, 0, -0.7, 11]], SV.crys);
  r.add('crown', 'metal', at(G.box(30, 4, 8, 1.2), 0, 68, -4), SV.metal);
  // tendrils
  for (let k = 0; k < 4; k++) {
    const x = -12 + k * 8, z = (k % 2 ? -1 : 1) * 3;
    r.add('td' + k, 'flesh', tube3([x, 31, z], [x * 1.05, 24, z], [x * 1.1, 16, z], 1.5, 1.1, 10, 6), SV.flesh);
    for (const y of [27, 21]) r.add('td' + k, 'metal', at(G.torus(1.55, 0.4, 4, 10), x * (1 + (31 - y) / 300), y, z, [Math.PI / 2, 0, 0]), SV.metalL);
    r.add('td' + k + 'b', 'flesh', tube3([x * 1.1, 16, z], [x * 1.15, 9, z], [x * 1.25, 3, z], 1.1, 0.35, 10, 6), SV.flesh);
    r.add('td' + k + 'b', 'glow', at(G.sph(0.9, 8, 6), x * 1.25, 2.4, z), GREEN);
  }
  // damage
  r.add('cracks1', 'glow', G.tube([[-6, 66, 7], [-2, 58, 9], [-5, 50, 10], [1, 42, 9]], 0.35, 12, 4), GREEN);
  r.add('cracks1', 'glow', G.tube([[6, 64, 7], [3, 56, 9.5], [7, 48, 8]], 0.35, 10, 4), GREEN);
  r.add('cracks2', 'glow', G.tube([[-8, 54, 8], [-1, 52, 10.5], [9, 54, 8]], 0.4, 10, 4), GREEN);
  r.add('cracks2', 'glow', G.tube([[2, 70, 4], [-3, 62, 8], [3, 60, 9]], 0.4, 10, 4), GREEN);
  for (let k = 0; k < 4; k++) r.add('spark', 'glow', at(G.box(0.7, 0.7, 0.7), -12 + k * 8, 40 + (k % 2) * 20, 9), lin('#f0d8ff', 5));
  return r.build();
}
const _pa = new THREE.Vector3();
function sovereignPose(B, st, b, s, dt, inst) {
  const sh = shake(st, st.die * 2.4 + (st.kind === 'barrage' ? 0.4 : 0));
  B.root.rotation.y = 0; // the Sovereign faces the camera; its eye does the tracking
  const T = st.teleS, nx = st.next, O = st.open, t = st.time, k = st.kind;
  let flare = 0, ringDrop = 0, spin = 1, lunge = 0, beam = 0, shardSpd = 1;
  if (b.state === 'tele') {
    if (nx === 'volley' || nx === 'spawn') flare = 0.4 * T; else if (nx === 'shockwave') ringDrop = -0.5 * T; else if (nx === 'beam') beam = T;
    else if (nx === 'barrage') spin = 1 + 5 * T; else if (nx === 'dash') { lunge = -0.3 * T; } else if (nx === 'lob') shardSpd = 1 + 3 * T;
  }
  if (k === 'volley') flare = 0.6 * (1 - st.ap);
  else if (k === 'shockwave') ringDrop = st.ap < 0.2 ? -0.5 + st.ap * 7 : 0.9 * (1 - st.ap);
  else if (k === 'beam') beam = 1;
  else if (k === 'spawn') flare = 0.5;
  else if (k === 'barrage') spin = 7;
  else if (k === 'dash') lunge = 1;
  else if (k === 'lob') shardSpd = 4 * (1 - st.ap) + 1;
  B.root.position.set(sh[0] + lunge * 10 * (st.dir || -1), sh[1] - st.die * st.die * 24, sh[2]);
  B.body.position.set(0, 52 + 1.2 * Math.sin(t * 1.1) - 6 * Math.max(0, ringDrop) * 0.3, 0);
  B.body.rotation.set(0.04 * Math.sin(t * 0.7), 0.08 * Math.sin(t * 0.5), 0.03 * Math.sin(t * 0.9) + st.die * 0.3 * Math.sin(t * 7));
  // iris: closed petals lean forward over the crystal; open splays them back
  const close = clamp(1 - O - flare - st.die, 0, 1);
  st.close = approach(st.close == null ? 1 : st.close, close, 8, dt);
  for (let i = 0; i < 6; i++) B['p' + i].rotation.set(0, 0, 2.2 * st.close + 0.03 * Math.sin(t * 2 + i));
  st.r0 = (st.r0 || 0) + dt * 0.25 * spin; st.r1 = (st.r1 || 0) + dt * 0.6 * spin; st.r2 = (st.r2 || 0) + dt * -0.9 * spin; st.orb = (st.orb || 0) + dt * 0.4 * shardSpd;
  B.r0.rotation.set(0, 0, st.r0); B.r0.position.y = ringDrop * 10; B.r0.scale.setScalar(1 + Math.max(0, ringDrop) * 0.12);
  B.r1.rotation.set(0, st.r1, 0); B.r1.position.y = ringDrop * 7;
  B.r2.rotation.set(st.r2, 0, 0);
  B.orbit.rotation.set(0, 0, st.orb);
  B.crown.rotation.z = 0.02 * Math.sin(t * 1.3);
  // eye tracking (pupil slides toward the player; beam sweeps it)
  const ax = Math.cos(st.aim) * (st.dir || -1), ay = Math.sin(st.aim);
  const sweep = beam > 0 && k === 'beam' ? (-0.9 + st.ap * 1.5) : null;
  const tx = sweep != null ? Math.cos(sweep) * (st.dir || -1) : ax, ty = sweep != null ? -Math.sin(sweep) : ay;
  st.px2 = approach(st.px2 || 0, tx * 2.4, 8, dt); st.py2 = approach(st.py2 || 0, ty * 2.4, 8, dt);
  B.pupil.position.set(st.px2, st.py2, 8);
  B.pupil.scale.setScalar(1 - 0.35 * beam + 0.2 * O);
  for (let i = 0; i < 4; i++) { B['td' + i].rotation.set(0.1 * Math.sin(t * 1.3 + i), 0, 0.12 * Math.sin(t * 1.1 + i * 1.7) - lunge * 0.3 * (st.dir || -1)); B['td' + i + 'b'].rotation.z = 0.2 * Math.sin(t * 1.1 + i * 1.7 - 0.8); }
  B.core.scale.setScalar(1 + 0.03 * Math.sin(t * 2.4) + st.die * 0.15 * Math.sin(t * 23));
  inst.fx.pulse(inst.byMat.core, 0.5 + 0.25 * Math.sin(t * 2.2) + O * 1.8 + beam * 1.2 + st.die * Math.abs(Math.sin(t * 33)) * 2);
  damage(B, st, b); shed(B, st, b, ['plate0', 'plate1'], dt);
  if ((b.phase || 0) >= 1 && !b.dying) B.r0.rotation.x = 0.15 * Math.sin(t * 3.1); // damaged gyro wobbles
  breakup(B, st, ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'r0', 'r1', 'r2', 'crown', 'orbit'], 23, 60);
}

export const BOSSES_B = {
  colossus: { build: colossusBuild, pose: colossusPose },
  queen: { build: queenBuild, pose: queenPose },
  machine: { build: sovereignBuild, pose: sovereignPose },
};
