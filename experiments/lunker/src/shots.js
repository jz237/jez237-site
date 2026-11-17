// The shot list. Every shot is a pure function of song time, so scrubbing works.
import * as THREE from 'three';
import { poseRandy, swim, sing } from './actors.js';
import { DOCK_Y, PAPER, CATH } from './world.js';
import { BPM, PHASE } from './data.js';

export const beat = 60 / BPM, B = n => PHASE + n * beat;
const sm = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b), mix = THREE.MathUtils.lerp, PI = Math.PI;
const V = new THREE.Vector3();

export function makeShots(W, camera, post) {
  const R = W.R, bass = W.bass;
  const cam = (px, py, pz, lx, ly, lz, fov = 50) => { camera.position.set(px, py, pz); camera.lookAt(lx, ly, lz); camera.fov = fov; };
  const placeBass = (x, y, z, tx, ty, tz, s = 2.2) => { bass.g.visible = true; bass.g.position.set(x, y, z); bass.g.scale.setScalar(s); bass.g.lookAt(tx, ty, tz); };
  const fight = (t, k = 1) => poseRandy(R, { aR: [-1.25, 0.1, -0.9], aL: [-1.15, -0.25, -1.0], lean: -0.3 * k, bend: 1.3 * k + Math.sin(t * 38) * 0.12, head: [0.1, 0] });
  const laugh = t => { poseRandy(R, { aL: [-0.5, 0.9, -1.5], aR: [-0.5, 0.9, -1.5], rod: false, laugh: Math.abs(Math.sin(t * 9)), bob: Math.abs(Math.sin(t * PI / beat)) * 0.05, head: [-0.22 + Math.sin(t * 9) * 0.06, 0] }); R.crown.visible = true; W.holdTrophies(t); };
  const liftPose = t => poseRandy(R, { aL: [-2.8, 0.3, -0.15], aR: [-2.8, 0.3, -0.15], rod: false, laugh: 0.6, head: [-0.3, 0], bob: Math.abs(Math.sin(t * PI / beat)) * 0.04 });
  const choirAt = (x, y, z, t, A) => { W.choir.g.visible = true; W.choir.g.position.set(x, y, z); sing(W.choir, t, 0.25 + A.mid * 1.6); };
  const finaleFx = t => { const bar = Math.floor((t - PHASE) / beat / 4); const m = [0, 1, 2, 5][bar % 4]; post.u.mode.value = m; if (m === 1) { post.bloom.strength = 0.25; W.hemi.intensity = 2.4; W.sun.intensity = 3.2; W.skyU.top.value.set(0x3b2c9c); W.skyU.hor.value.set(0xff86c8); W.waterU.deep.value.set(0x2a3fae); W.waterU.skyCol.value.set(0xb48ae0); } if (m === 5) post.bloom.strength = 0.6; };
  const finaleSkin = t => [null, null, 'neon', null][Math.floor((t - PHASE) / beat / 4) % 4];
  const party = (t, A) => { W.fireworks.visible = true; W.fwU.time.value = t; W.fwU.size.value = 1 + A.bass; W.skyFish.visible = true; W.updateSkyFish(t); W.waterU.pulse.value = A.bass; };
  const lightning = (A, k = 1) => { const f = Math.pow(A.pulse, 3) * k; W.skyU.flash.value = f; post.u.flash.value = f * 0.12; };

  const S = [];
  const shot = (t0, style, cap, fn, o = {}) => S.push({ t0, style, cap, fn, glitch: true, ...o });

  // 1 ── office → lake (low-poly dawn)
  shot(0, 'dawn', 'chalk', (l, t) => {
    W.office.visible = true; R.g.position.set(0, 0.9, -5.2);
    const dis = sm(l, 3.8, 6.2); W.disU.dis.value = dis; W.props.scale.setScalar(1 - sm(l, 5.4, 6.4) * 0.999);
    W.paperSheet.position.z = 0.2 + sm(l, 0.6, 2.6) * 0.3; 
    W.hemi.intensity = mix(1.7, 1.0, dis); W.hemi.color.lerpColors(new THREE.Color(0xffffff), new THREE.Color(0xffd9b8), dis);
    const k = sm(l, 4.2, 7.0), a = k * PI * 0.9, r = mix(2.7, 4.6, k);
    poseRandy(R, { rod: l > 5.6, aR: l > 5.6 ? [-1.0, 0.1, -0.5] : [0.08, 0.1, -0.2], head: [0, -Math.sin(k * PI) * 0.7 + Math.sin(l * 1.3) * 0.08 * (1 - k)], bob: Math.sin(l * 2.2) * 0.008 });
    cam(Math.sin(a) * r + 0.4 * (1 - k), mix(2.55, 3.0, k), -5.2 + Math.cos(a) * r, 0, mix(2.5, 2.3, k), mix(-5.2, 6, k), mix(42, 55, k));
  }, { glitch: false });
  shot(7.0, 'dawn', 'chalk', (l, t) => {
    const z = mix(-4.5, 9.4, l / 4.6); R.g.position.set(0, z < -2 ? 0.75 : DOCK_Y, z);
    poseRandy(R, { walk: l * 7.2, aR: [-1.0, 0.1, -0.5], aL: [Math.sin(l * 7.2) * 0.4, 0.1, -0.2], bob: Math.abs(Math.sin(l * 7.2)) * 0.04, bend: Math.sin(t * 46) * 0.3 });
    cam(4.6, 1.7, z + 2.2, 0, 2.0, z + 0.6, 45);
  }, { glitch: false });
  shot(11.6, 'dawn', 'chalk', (l, t) => {
    W.mist.visible = true; W.mist.children.forEach((m, i) => m.position.x = m.userData.x + Math.sin(t * 0.2 + i) * 6);
    W.scene.fog.density = 0.019; W.waterU.fogD.value = 0.019;
    poseRandy(R, { aR: [-1.0, 0.1, -0.5], bend: Math.sin(t * 46) * 0.1 });
    cam(-2.6, mix(2.6, 5.5, sm(l, 0, 3.1)), mix(5, 3, l / 3.1), 0, 2.2, 40, 52);
  }, { glitch: false });
  shot(14.7, 'under', 'chalk', (l, t) => {
    R.g.visible = false; W.weeds.visible = W.lakeBed.visible = true; W.sign.visible = false;
    bass.g.visible = true; bass.g.scale.setScalar(2.2); bass.g.position.set(0, -5, 24); bass.g.rotation.set(0, 0.55, 0); swim(bass, t, 1.5, 0.1);
    const open = sm(l, 0.6, 2.6); bass.eyeM.emissiveIntensity = 0.05 + open * 0.9 + Math.max(0, 1 - Math.abs(l - 2.75) * 3) * 2.5;
    W.fill.position.set(3, -4.4, 26.5); W.fill.color.set(0xffd060); W.fill.intensity = open * 2;
    cam(mix(9, 4.2, sm(l, 0, 3.3)), -4.3, mix(30, 27.2, sm(l, 0, 3.3)), 1.2, -4.6, 25.4, 40);
  }, { glitch: false });

  // 2 ── title, then the choir (stage)
  shot(18.0, 'stage', 'stage', (l, t) => {
    W.titleOp = sm(l, 0.05, 0.4) * (1 - sm(l, 2.0, 2.3));
    const f = Math.max(0, 1 - l * 3) + Math.max(0, 1 - Math.abs(l - 1.2) * 5) * 0.7; W.skyU.flash.value = f; post.u.flash.value = f * 0.1;
    poseRandy(R, { aR: [-1.0, 0.1, -0.5] }); cam(0, mix(15, 11, l / 2.35), -8, 0, 0, 34, 50);
  });
  shot(20.35, 'stage', 'stage', (l, t, A) => {
    choirAt(0, -0.35, 15, t, A); W.spots.visible = true; W.spots.position.set(0, 0, 15); W.spots.children.forEach((s, i) => s.rotation.z = Math.sin(t * 1.4 + i * 1.3) * 0.25);
    const hit = t - PHASE; const f = hit > 0 ? Math.max(0, 1 - hit * 2.5) : 0; W.skyU.flash.value = f; post.u.flash.value = f * 0.25;
    poseRandy(R, { aR: [-1.0, 0.1, -0.5], bend: 0.2 }); W.fill.position.set(0, 3, 19); W.fill.color.set(0xfff0d0); W.fill.intensity = 9;
    cam(0, 2.3, hit > 0 ? 19.2 - l * 0.3 : 22 - l * 0.4, 0, 1.3, 15, hit > 0 ? 40 : 50); W.shake = 0.06;
  });
  shot(B(4), 'stage', 'stage', (l, t, A) => {
    poseRandy(R, { aR: [-2.3, 0.3, -0.3], aL: [-0.3, 0.5, -1.4], lean: -0.08, head: [-0.15, 0.3] }); R.g.rotation.y = 0.5;
    W.fill.position.set(-2, 2.5, 13); W.fill.color.set(0xfff0d0); W.fill.intensity = 10; lightning(A, 0.6);
    cam(-1.9 + l * 0.15, 1.15, 12.9, 0.5, 2.25, 10.2, 55); W.shake = 0.05;
  });
  shot(B(9), 'stage', 'stage', (l, t, A) => {
    choirAt(0, -0.35, 15, t, A); W.spots.visible = true; W.spots.position.set(0, 0, 15); W.fill.position.set(0, 3, 19); W.fill.intensity = 9;
    const x = -2.6 + l * 4; cam(x, 1.9, 17.6, x * 0.8, 1.45, 15, 34);
  });
  shot(B(12), 'stage', 'stage', (l, t, A) => {
    const k = sm(l, 0.1, 1.5); placeBass(-4.5, mix(-6, 2.6, k), 15.5, 3, mix(-6, 2.6, k) + 6, 14.5, 2.8); swim(bass, t, 9, 0.75); bass.eyeM.emissiveIntensity = 2;
    W.doSplash(-4.5, 15.5, l - 0.2, 1.1); fight(t, 0.6); R.g.rotation.x = -0.05;
    W.fill.position.set(-1, 4, 12); W.fill.color.set(0xbfe0ff); W.fill.intensity = 5; lightning(A, 0.25);
    cam(2.7, 1.4, 6.4 - l * 0.2, -2.2, mix(2.4, 3.8, k), 15, 62); W.shake = 0.12;
  });

  // 4 ── the fight (comic book)
  shot(B(18), 'comic', 'comic', (l, t) => {
    fight(t, 1); R.handle.rotation.x = t * 42; post.u.lines.value = 1;
    R.g.updateMatrixWorld(true); R.reel.getWorldPosition(V); cam(V.x - 0.75, V.y + 0.25, V.z + 0.55 + l * 0.05, V.x, V.y + 0.02, V.z, 48); W.shake = 0.04;
  });
  shot(B(22), 'comic', 'comic', (l, t) => {
    W.waterU.amp.value = 0; R.g.visible = false; cam(34, 3.2, 34, 4, 3, -8, 42);
  });
  shot(B(26), 'comic', 'comic', (l, t) => {
    fight(t, 1); const tx = Math.sin(t * 2.2) * 3, tz = 21 + Math.cos(t * 1.7) * 2; W.setLine(V.set(tx, 0, tz), 0.05); post.u.lines.value = 0.6;
    cam(-3.6 + l * 0.5, 1.25, 13.4, 0.3, 2.15, 10, 50); W.shake = 0.05;
  });
  shot(B(30), 'comic', 'comic', (l, t) => {
    fight(t, 1); const tx = Math.sin(t * 2.2) * 3, tz = 21 + Math.cos(t * 1.7) * 2; W.setLine(V.set(tx, 0, tz), 0.05);
    placeBass(tx, -0.55, tz, tx + Math.cos(t * 2.2), -0.5, tz - Math.sin(t * 1.7)); swim(bass, t, 14, 0.2); W.doSplash(tx, tz, (t * 2) % 1.4, 0.5);
    cam(0.9, 4.6 - l * 0.3, 5.2, 0, 0.6, 19, 50); W.shake = 0.05;
  });
  shot(B(34), 'comic', 'comic', (l, t) => {
    fight(t, 1); const k = sm(l, 1.75, 3.4); const y = mix(-4, 4.5, k); placeBass(0, y, 21, 0, y + 3, 20.2); swim(bass, t, 12, 0.6);
    W.setLine(V.set(0, Math.max(0, y + 2), 21), 0.05); W.waterU.amp.value = 0.5;
    const a = l - 1.84; if (a > 0) { W.ring.visible = true; W.ring.position.set(0, 0.25, 21); W.ring.scale.setScalar(1.5 + a * 7); W.ring.material.opacity = Math.max(0, 1 - a / 1.7); W.doSplash(0, 21, a, 0.8); post.u.flash.value = Math.max(0, 0.5 - a * 2); }
    cam(mix(10, 8, l / 3.5), 3.4, 13, 0, mix(0.6, 3.0, k), 21, 48); post.u.lines.value = k;
  });
  shot(B(42), 'comic', 'comic', (l, t, A) => {
    fight(t, 1); const k = l / 2.64; const x = mix(-7, 7, k), y = 5.2 + Math.sin(k * PI) * 3.2, z = mix(19, 15, k);
    placeBass(x, y, z, x + 3, y + Math.cos(k * PI) * 3, z - 1, 2.4); bass.g.rotateZ(k * 2.5); swim(bass, t, 16, 0.7); W.setLine(V.set(x, y, z), 0.02);
    lightning(A, 1.5); post.u.lines.value = 1; cam(0.6, 1.0, 4.6, 0, 5.4, 17, 66); W.shake = 0.1;
  });

  // 5 ── chorus (neon synthwave)
  const synthRandy = t => { R.g.rotation.y = PI; liftPose(t); W.sign.visible = false; W.lift.g.visible = true; W.lift.g.position.set(0, DOCK_Y + 3.1 + Math.sin(t * 6) * 0.03, 10); W.lift.g.rotation.set(0, PI / 2, Math.sin(t * 7) * 0.1); swim(W.lift, t, 12, 0.3); };
  shot(B(48), 'synth', 'synth', (l, t, A) => {
    synthRandy(t); W.waterU.pulse.value = A.bass; W.waterU.amp.value = 0.6 + A.bass * 1.5;
    const k = sm(l, 2.6, 3.5); cam(0, mix(1.0 + l * 0.25, 3.4, k), mix(6.6, 0.5, k), 0, mix(2.9, 3.4, k), 10, mix(50, 58, k));
  });
  shot(B(56), 'synth', 'synth', (l, t, A) => {
    synthRandy(t); W.waterU.pulse.value = A.bass; W.waterU.amp.value = 0.8 + A.bass * 2.5;
    const k = (l % 2.644) / 2.644, x = mix(-30, 30, k), y = 1 + Math.sin(k * PI) * 15; placeBass(x, y, 52, x + 2, y + Math.cos(k * PI) * 3.2, 52, 6.5); swim(bass, t, 8, 0.5);
    R.crown.visible = true; R.crown.position.y = mix(2.2, 0.385, sm(l, 0.85, 1.46)); R.crown.rotation.y = t * 2;
    if (l < 2.644) cam(-5.5, 1.5, 2.5, 0, 6, 26, 58); else cam(1.3 - (l - 2.644) * 0.3, 2.45, 7.5, 0, 2.95, 10, 46);
    W.shake = 0.05;
  });

  // 6 ── the legend, as a paper theatre
  shot(B(68), 'paper', 'paper', (l, t, A) => {
    W.paper.visible = true; W.water.visible = W.sky.visible = W.land.visible = false; R.g.visible = false;
    const storm = sm(l, 3.5, 4.4); W.pBg.material.color.set(0x35507a).lerp(new THREE.Color(0x1c2233), storm);
    W.pWaves.forEach((w, i) => { w.position.x = Math.sin(t * 1.3 + i * 2) * (0.7 + storm); w.position.y = [-1.2, -1.8, -2.5][i] + Math.sin(t * 2.2 + i) * 0.12 * (1 + storm * 2); });
    W.pClouds.forEach((c, i) => { c.position.x = -7 + i * 4.6 + Math.sin(t * 0.5 + i) * 0.8; c.position.y = mix(5.2 + (i % 2), 3.4 + (i % 2) * 0.7, storm); });
    W.pMoon.position.y = mix(3.4, 6.5, storm);
    W.pBolts.forEach((b, i) => { b.visible = storm > 0.5 && A.pulse > 0.45 && (A.beatN + i) % 3 === 0; });
    W.pRain.visible = storm > 0.2; W.pRain.children.forEach(r => { r.position.y = 6 - ((t * 9 + r.userData.o * 12) % 12); });
    let fx, fy, rot;
    if (l < 3.7) { fx = mix(7, 1.5, sm(l, 0.2, 3.7)); fy = -2.7 + Math.sin(t * 3) * 0.15; rot = PI + Math.sin(t * 3) * 0.1; }
    else if (l < 7.3) { const j = (l - 3.7) * 1.9; fx = 3.2 + Math.sin(j * 0.9) * 2; fy = -2.4 + Math.abs(Math.sin(j)) * 3.4; rot = PI + Math.cos(j) * 0.9; }
    else { const k = sm(l, 7.3, 8.0); fx = mix(3.2, -1.2, k); fy = mix(-1, 1.6, k); rot = mix(PI, PI * 1.5, k) + Math.sin(t * 12) * 0.15; }
    W.pFish.position.set(fx, fy, -1.3 + (l > 3.7 ? 0.9 : 0)); W.pFish.rotation.z = rot;
    const a = l < 3.7 ? 0.45 : 0.3 + Math.sin(t * 30) * 0.05 + (l > 7.3 ? 0.35 : 0); W.pArm.rotation.z = a;
    const tipx = -3.3 + Math.cos(a) * 4.2, tipy = 1.05 + Math.sin(a) * 4.2; const lp = W.pLine.geometry.attributes.position;
    lp.setXYZ(0, tipx, tipy, -0.3); lp.setXYZ(1, l < 3.7 ? tipx + 1.5 : fx - Math.cos(rot) * 1.5, l < 3.7 ? -1.6 : fy - Math.sin(rot) * 1.5, -0.3); lp.needsUpdate = true;
    post.u.flash.value = storm * Math.pow(A.pulse, 4) * 0.12;
    cam(PAPER.x + Math.sin(t * 0.4) * 0.5, PAPER.y + 0.6, PAPER.z + 17.5 - A.bass * 0.4, PAPER.x, PAPER.y + 0.6, PAPER.z, 34);
  });

  // 7 ── the riff (sonar wireframe)
  const boatShot = flip => (l, t, A) => {
    W.boat.visible = true; W.boat.position.set(0, Math.sin(t * 2) * 0.08, 30); W.boat.rotation.z = Math.sin(t * 1.7) * 0.06; W.sign.visible = false;
    R.g.position.set(0, 0.47 + W.boat.position.y, 31.3); R.g.rotation.y = flip ? 0.3 : -0.3;
    const sixteenth = Math.sin(t * PI / beat * 4);
    poseRandy(R, { aR: [-0.5, 0.25, -1.9], aL: [-0.9 + sixteenth * 0.25, 0.5, -1.0], lean: -0.28, head: [Math.sin(t * PI / beat) * 0.45, 0], bob: A.pulse * 0.05, bend: A.bass * 0.4 });
    R.rod.rotation.x = 0.55; W.waterU.pulse.value = A.bass; W.waterU.amp.value = 0.6 + A.bass;
    const a = (flip ? 2.4 : 0.6) + l * 0.45 * (flip ? -1 : 1); cam(Math.sin(a) * 3.8, 1.5 + l * 0.25, 31.3 + Math.cos(a) * 3.8, 0, 2.1, 31.3, flip ? 58 : 50); W.shake = 0.06;
  };
  const chase = front => (l, t, A) => {
    R.g.visible = false; W.weeds.visible = W.lakeBed.visible = true; W.sign.visible = false;
    const s = l + (front ? 9 : 0), z = 20 + s * 4.6, x = Math.sin(s * 0.9) * 6, y = -5 + Math.sin(s * 1.3) * 1.3;
    const z2 = z + 2, x2 = Math.sin((s + 0.43) * 0.9) * 6, y2 = -5 + Math.sin((s + 0.43) * 1.3) * 1.3;
    placeBass(x, y, z, x2, y2, z2, 2.2); swim(bass, t, 16, 0.25 + A.pulse * 0.5);
    if (front) cam(x2 * 0.8 + 1.5, y2 + 0.6, z + 8.5, x, y, z, 62); else cam(x * 0.5, y + 1.6, z - 8, x2, y2, z2 + 3, 65);
    W.shake = 0.08;
  };
  shot(B(88), 'sonar', 'sonar', boatShot(false)); shot(B(96), 'sonar', 'sonar', chase(false));
  shot(B(104), 'sonar', 'sonar', boatShot(true)); shot(B(112), 'sonar', 'sonar', chase(true));

  // 8 ── final choir (stained glass)
  const cathBase = (t, A) => {
    W.cath.visible = true; W.water.visible = W.land.visible = false; W.raysU.time.value = t; W.raysU.beat.value = A.pulse;
    R.g.position.copy(CATH); R.g.scale.setScalar(2.2); R.crown.visible = true;
    W.halo.position.set(0, 4.45, -0.7); W.halo.scale.setScalar(3 + A.pulse * 0.2);
    W.choir.g.visible = true; W.choir.g.position.set(CATH.x, CATH.y - 0.4, CATH.z + 2.3); W.choir.g.scale.setScalar(1.05); sing(W.choir, t, 0.3 + A.mid * 1.6);
  };
  const saint = t => poseRandy(R, { aR: [-0.9, 0.25, -1.3], aL: [-2.0, 0.45, -0.8], head: [-0.05, 0], bob: Math.sin(t * 2) * 0.01 });
  shot(B(120), 'glass', 'glass', (l, t, A) => { cathBase(t, A); saint(t); R.rod.rotation.x = 2.9; cam(CATH.x, CATH.y + 4.2, CATH.z + mix(15, 11.5, l / 4.85), CATH.x, CATH.y + 4.3, CATH.z, 50); });
  shot(B(131), 'glass', 'glass', (l, t, A) => { cathBase(t, A); saint(t); R.rod.rotation.x = 2.9; const x = -3 + l * 2.7; cam(CATH.x + x, CATH.y + 1.9, CATH.z + 6.3, CATH.x + x * 0.8, CATH.y + 1.5, CATH.z + 2.3, 40); });
  const liftInCath = (t, y) => { W.lift.g.visible = true; W.lift.g.scale.setScalar(1.0); W.lift.g.position.set(CATH.x, CATH.y + y, CATH.z); W.lift.g.rotation.set(0, PI / 2, Math.sin(t * 7) * 0.08); swim(W.lift, t, 10, 0.3); };
  shot(B(136), 'glass', 'glass', (l, t, A) => { cathBase(t, A); liftPose(t); liftInCath(t, 6.85); cam(CATH.x, CATH.y + 4.6, CATH.z + 12.5 - l * 0.4, CATH.x, CATH.y + 4.7, CATH.z, 52); });
  shot(B(141), 'glass', 'glass', (l, t, A) => {
    cathBase(t, A); liftPose(t); W.arch.visible = false; const k = sm(l, 0.2, 3.4); const y = mix(6.85, 50, k);
    liftInCath(t, y); W.lift.g.scale.setScalar(1.0 * (1 - sm(l, 2.7, 3.5)) + 0.001); W.lift.g.rotation.set(-k * 1.2, PI / 2, 0);
    W.constel.visible = l > 2.6; W.constelLine.opacity = sm(l, 2.9, 4.0); W.constel.scale.setScalar(sm(l, 2.6, 3.3) * (1 + A.pulse * 0.04));
    cam(CATH.x, CATH.y + mix(4.6, 46, k), CATH.z + 13, CATH.x, CATH.y + mix(5.2, 52, k), CATH.z - 4 * k, 55);
  });

  // 9 ── finale: every style at once
  const fin = { skin: finaleSkin };
  shot(B(152), 'night', 'finale', (l, t, A) => {
    finaleFx(t); party(t, A); R.g.rotation.y = PI; laugh(t); const a = -0.7 + l * 0.35;
    cam(Math.sin(a) * 3.6, 2.3, 10 - Math.cos(a) * 3.6, 0, 2.45, 10, 52); W.shake = 0.05;
  }, fin);
  shot(B(161), 'night', 'finale', (l, t, A) => {
    finaleFx(t); party(t, A); R.g.rotation.y = PI; laugh(t); const i = Math.floor(l / beat) % 2; const T = W.trophies[i].g.position;
    W.fill.position.set(T.x, T.y + 0.2, T.z - 1); W.fill.color.set(0xfff0c0); W.fill.intensity = 6;
    cam(T.x + (i ? 0.35 : -0.35), T.y + 0.1, T.z - 1.25, T.x, T.y + 0.05, T.z, 36);
  }, fin);
  shot(B(170), 'night', 'finale', (l, t, A) => {
    finaleFx(t); party(t, A); R.g.rotation.y = PI; laugh(t); choirAt(0, -0.35, 15, t, A); W.fill.position.set(0, 3, 19); W.fill.intensity = 9;
    cam(-1 + l, 2.1, 19.3, 0, 1.5, 15, 42);
  }, fin);
  shot(B(172), 'night', 'finale', (l, t, A) => {
    finaleFx(t); party(t, A); laugh(t); const bow = sm(l, 1.4, 2.5);
    bass.g.visible = true; bass.g.scale.setScalar(2.2); bass.g.position.set(0, 0.9 - bow * 0.9, 17); bass.g.rotation.set(0.35 - bow * 0.85, PI, 0); swim(bass, t, 3, 0.15);
    W.fill.position.set(2, 3, 14); W.fill.color.set(0xfff0d0); W.fill.intensity = 9;
    cam(5.6 - l * 0.3, 2.5, 6.2, -0.6, 1.7, 14, 50);
  }, fin);
  shot(B(180), 'night', 'finale', (l, t, A) => {
    finaleFx(t); party(t, A); laugh(t); W.doubters.visible = true; R.g.visible = false; W.trophies.forEach(x => x.g.visible = false);
    W.doubters.children.forEach((d, i) => { const k = 1 - sm(l, 0.5 + i * 0.85, 1.25 + i * 0.85); d.scale.set(k, k, k); d.rotation.y = 0.9 + (1 - k) * 6; });
    W.fill.position.set(-3, 3, 0); W.fill.color.set(0xfff0d0); W.fill.intensity = 9;
    cam(1.5, 1.9, 2.6, -4.3, 1.5, -3.0, 44);
  }, fin);

  // 10 ── victory lap
  shot(B(188), 'night', 'finale', (l, t, A) => {
    party(t, A); R.g.rotation.y = PI; laugh(t); choirAt(-4.5, -0.35, 13, t, A); W.choir.g.rotation.y = -0.6;
    const k = (l % 3.525) / 3.525, x = mix(-16, 16, k), y = Math.sin(k * PI) * 7 - 0.5; placeBass(x, y, 30, x + 2, y + Math.cos(k * PI) * 2.6, 30, 2.6); swim(bass, t, 9, 0.4);
    W.doSplash(-16, 30, (l % 3.525), 1.2); const a = 2.6 + l * 0.33, r = mix(5, 11, l / 10.6);
    cam(Math.sin(a) * r, mix(2.4, 5.5, l / 10.6), 10 + Math.cos(a) * r, 0, 2.8, 11, 55); W.shake = 0.03;
  });

  // 11 ── dusk, then back to the office
  shot(B(212), 'dusk', 'lowpoly', (l, t) => {
    laugh(t); poseRandy(R, { aL: [-0.5, 0.9, -1.5], aR: [-0.5, 0.9, -1.5], rod: false, laugh: 0.4, head: [-0.1, 0] }); W.holdTrophies(t * 0.3); W.waterU.amp.value = 0.6;
    W.skyFish.visible = true; W.updateSkyFish(t);
    cam(-7 + l * 0.35, mix(3.2, 5.5, l / 6.6), -13, 0, 2.2, 16, 46);
  }, { glitch: false, fadeIn: 0.6 });
  shot(122.2, 'dusk', 'lowpoly', (l, t) => {
    W.office.visible = true; W.frame.visible = true; R.g.visible = false; W.hemi.intensity = 1.5; W.hemi.color.set(0xfff4e0);
    W.paperSheet.position.z = 0.5; post.bloom.strength = 0.15; const k = sm(l, 0, 9);
    cam(mix(1.1, -0.45, k), mix(2.75, 2.5, k), mix(-4.4, -6.75, k), -1.0, 2.42, -8.08, mix(46, 38, k));
    post.u.fade.value = 1 - sm(t, 129.6, 133.6);
  }, { glitch: false, fadeIn: 0.8 });

  return S;
}
