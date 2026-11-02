// The four shifts. Each build fn fills a Builder with geometry, physics and descriptors.
import * as THREE from 'three';
import { boxGeo } from './builder.js';
import { rr } from './util.js';

const HW = 1.0, JB = 0.7;

// Grid floor: spec.x[zi] = string per X-line (one char per segment), spec.z[xi] per Z-line.
// 'D' decked walkway, 'B' bare I-beam (tightrope), 'G' girder socket, 'R' old bolted beam (demolition), '0' nothing.
function gridFloor(B, y, XS, ZS, spec) {
  const sx = (zi, i) => (i < 0 || i >= XS.length - 1) ? '0' : spec.x[zi][i];
  const sz = (xi, j) => (j < 0 || j >= ZS.length - 1) ? '0' : spec.z[xi][j];
  const node = (xi, zi) => {
    const a = [sx(zi, xi - 1), sx(zi, xi), sz(xi, zi - 1), sz(xi, zi)];
    if (a.includes('D')) return HW;
    return a.some(c => c !== '0') ? JB : 0;
  };
  const off = c => c === 'D' ? HW : c === 'G' || c === 'R' ? 0.27 : 0.15;
  for (let xi = 0; xi < XS.length; xi++) for (let zi = 0; zi < ZS.length; zi++) {
    const h = node(xi, zi); if (!h) continue;
    B.deck(XS[xi] - h, ZS[zi] - h, XS[xi] + h, ZS[zi] + h, y, { beams: false });
    if (spec.cols !== false && !(spec.noCol || []).some(([a, b]) => a === xi && b === zi)) B.column(XS[xi], ZS[zi], y - 4, y + (spec.colTop || 0));
  }
  for (let zi = 0; zi < ZS.length; zi++) for (let i = 0; i < XS.length - 1; i++) {
    const c = sx(zi, i), x0 = XS[i] + node(i, zi), x1 = XS[i + 1] - node(i + 1, zi), z = ZS[zi];
    if (c === 'D') { B.deck(x0, z - HW, x1, z + HW, y, { beams: false, toe: spec.toe ? ['z0', 'z1'] : null }); B.ibeam('x', x0, x1, y - .12, z); }
    else if (c === 'B') { B.ibeam('x', x0, x1, y, z); B.solid(x0, y - .42, z - .15, x1, y, z + .15, { surf: 'steel', beam: true }); }
    else if (c === 'G' || c === 'R') B.sockets.push({ axis: 'x', a0: x0, a1: x1, c: z, y, demo: c === 'R' });
  }
  for (let xi = 0; xi < XS.length; xi++) for (let j = 0; j < ZS.length - 1; j++) {
    const c = sz(xi, j), z0 = ZS[j] + node(xi, j), z1 = ZS[j + 1] - node(xi, j + 1), x = XS[xi];
    if (c === 'D') { B.deck(x - HW, z0, x + HW, z1, y, { beams: false }); B.ibeam('z', z0, z1, y - .12, x); }
    else if (c === 'B') { B.ibeam('z', z0, z1, y, x); B.solid(x - .15, y - .42, z0, x + .15, y, z1, { surf: 'steel', beam: true }); }
    else if (c === 'G' || c === 'R') B.sockets.push({ axis: 'z', a0: z0, a1: z1, c: x, y, demo: c === 'R' });
  }
  for (const [i, j] of spec.plates || []) {
    const x0 = XS[i] + off(sz(i, j)), x1 = XS[i + 1] - off(sz(i + 1, j));
    const z0 = ZS[j] + off(sx(j, i)), z1 = ZS[j + 1] - off(sx(j + 1, i));
    B.deck(x0, z0, x1, z1, y, { beams: true, th: .1 });
  }
}

function yardFence(B, x0, z0, x1, z1, gapX = null) {
  const mat = B.M.galv, post = 3;
  const run = (ax, az, bx, bz) => {
    const L = Math.hypot(bx - ax, bz - az), n = Math.round(L / post);
    for (let k = 0; k <= n; k++) { const t = k / n; B.geo(boxGeo(.08, 2.2, .08, 1, ax + (bx - ax) * t, 1.1, az + (bz - az) * t), mat); }
    const alongX = Math.abs(bx - ax) > 1;
    const g = alongX ? boxGeo(L, 1.9, .02, 1, (ax + bx) / 2, 1.15, az) : boxGeo(.02, 1.9, L, 1, ax, 1.15, (az + bz) / 2);
    B.geo(g, B.fenceMat);
    B.solid(Math.min(ax, bx) - .05, 0, Math.min(az, bz) - .05, Math.max(ax, bx) + .05, 2.2, Math.max(az, bz) + .05, { noFloor: true });
  };
  if (!B.fenceMat) {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    g.strokeStyle = '#c9ced2'; g.lineWidth = 3;
    for (let k = -64; k < 128; k += 16) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 64, 64); g.stroke(); g.beginPath(); g.moveTo(k + 64, 0); g.lineTo(k, 64); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1); t.colorSpace = THREE.SRGBColorSpace;
    B.fenceMat = new THREE.MeshStandardMaterial({ map: t, alphaTest: .5, transparent: false, side: THREE.DoubleSide, metalness: .8, roughness: .4 });
  }
  run(x0, z0, x1, z0); run(x1, z0, x1, z1); run(x0, z0, x0, z1);
  if (gapX) { run(x0, z1, gapX[0], z1); run(gapX[1], z1, x1, z1); } else run(x0, z1, x1, z1);
}

function towerCrane(B, x, z, h, jibLen = 28, opts = {}) {
  B.lattice(x, z, 0, h, 1.8);
  B.block(x - 2, 0, z - 2, x + 2, .6, z + 2, B.M.concrete, {}, 3);
  const top = new THREE.Group(); top.position.set(x, h, z);
  const jib = B.boom(jibLen, 1.3, B.M.yellow, 9); top.add(jib);
  const cab = new THREE.Mesh(boxGeo(1.6, 1.6, 1.6, 1), B.M.yellow); cab.position.set(1.2, -1, 1.4); top.add(cab); cab.castShadow = true;
  const glass = new THREE.Mesh(boxGeo(1.62, .7, 1.2, 1), B.M.glass); glass.position.set(1.2, -.8, 1.4); top.add(glass);
  const cw = new THREE.Mesh(boxGeo(2.4, 1.6, 1.8, 1), B.M.concrete); cw.position.set(-7.5, -.6, 0); top.add(cw); cw.castShadow = true;
  const peak = new THREE.Mesh(new THREE.CylinderGeometry(.15, .6, 5, 4), B.M.yellow); peak.position.set(0, 3.2, 0); top.add(peak);
  const trolley = new THREE.Mesh(boxGeo(1.4, .5, 1.4, 1), B.M.dark); trolley.position.set(opts.trolley || jibLen * .7, -.2, 0); top.add(trolley);
  B.group.add(top);
  B.cranes = B.cranes || []; B.cranes.push({ top, trolley, spin: opts.spin ?? .05, phase: opts.phase || 0, x, z, h });
  return top;
}

function workLight(B, x, z, h = 7, dir = 0) { B.lampPost(x, 0, z, h, 0xfff1d6, dir); }

function scatterProps(B, list) {
  for (const p of list) {
    if (p[0] === 'cone') B.cone(p[1], p[2] || 0, p[3]);
    else if (p[0] === 'barrel') B.barrel(p[1], 0, p[2], p[3]);
    else if (p[0] === 'crate') B.crate(p[1], 0, p[2], p[3] || 1.1);
    else if (p[0] === 'barrier') B.barrier(p[1], 0, p[2], p[3], p[4] || 3);
    else if (p[0] === 'pipes') B.pipes(p[1], 0, p[2], p[3], p[4] || 3);
  }
}

function portaPotty(B, x, z, rot = 0) {
  B.block(x - .6, 0, z - .6, x + .6, 2.3, z + .6, B.M.paint(0x2266cc, .5, .1));
  B.geo(boxGeo(1.3, .12, 1.3, 1, x, 2.36, z), B.M.paint(0xf2f2f2, .5, .1));
}

function mixerTruck(B, x, z, axis = 'x') {
  const s = axis === 'x' ? 1 : 0;
  const L = (a, b) => s ? [a, b] : [b, a];
  const [w, d] = L(8, 2.5);
  B.block(x - w / 2, .5, z - d / 2, x + w / 2, 1.2, z + d / 2, B.M.dark);
  const [cx, cz] = L(3.2, 0);
  B.block(x + cx - 1, 1.2, z + cz - 1.2, x + cx + 1, 3.3, z + cz + 1.2, B.M.paint(0xf4f4f4, .35, .2));
  B.geo(boxGeo(...(s ? [.05, .8, 2] : [2, .8, .05]), 1, x + (s ? cx + 1.01 : 0), 2.6, z + (s ? 0 : cx + 1.01)), B.M.glass);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.2, .8, 4.6, 20), B.M.paint(0xf28c28, .4, .3));
  drum.rotation.z = s ? Math.PI / 2 - .2 : 0; drum.rotation.x = s ? 0 : Math.PI / 2 - .2;
  drum.position.set(x - (s ? 1.2 : 0), 2.5, z - (s ? 0 : 1.2)); drum.castShadow = true; B.group.add(drum);
  (B.spinners = B.spinners || []).push({ obj: drum, axis: s ? 'x' : 'z', speed: 1.2 });
  for (const k of [-2.6, -.6, 3]) for (const side of [-1, 1]) {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .35, 16), B.M.rubber);
    wh.rotation.x = s ? Math.PI / 2 : 0; wh.rotation.z = s ? 0 : Math.PI / 2;
    wh.position.set(x + (s ? k : side * 1.1), .5, z + (s ? side * 1.1 : k)); B.group.add(wh); wh.castShadow = true;
  }
  B.solid(x - w / 2, 0, z - d / 2, x + w / 2, 3.6, z + d / 2, { noFloor: true });
}

function excavator(B, x, z) {
  B.block(x - 1.6, 0, z - 2, x + 1.6, .9, z + 2, B.M.dark);
  B.block(x - 1.4, .9, z - 1.4, x + 1.4, 2.8, z + 1.4, B.M.yellow);
  B.geo(boxGeo(1.2, .9, .05, 1, x - .5, 2.2, z + 1.42), B.M.glass);
  const arm = new THREE.Group(); arm.position.set(x + .8, 2.4, z + .4);
  const a1 = new THREE.Mesh(boxGeo(.4, .5, 4, 1, 0, 1.2, 1.6), B.M.yellow); a1.rotation.x = -.6; arm.add(a1);
  const a2 = new THREE.Mesh(boxGeo(.35, 3, .4, 1, 0, 1.3, 3.6), B.M.yellow); a2.rotation.x = .3; arm.add(a2);
  B.group.add(arm); arm.traverse(o => o.castShadow = true);
  B.solid(x - 1.6, 0, z - 2, x + 1.6, 2.8, z + 2, { surf: 'steel' });
}

// ===================== SHIFT 1: STEEL SKELETON =====================
function build1(B) {
  const M = B.M, XS = [-12, -6, 0, 6, 12], ZS = [-6, 0, 6];
  B.block(-40, -2, -30, 40, 0, 30, M.dirt, { surf: 'dirt' }, 7);
  B.block(-13.4, 0, -7.4, 13.4, .12, 7.4, M.concrete, { surf: 'concrete' }, 4);
  for (const x of XS) for (const z of ZS) B.block(x - .45, .12, z - .45, x + .45, .3, z + .45, M.concrete, {}, 2);
  gridFloor(B, 4, XS, ZS, { x: ['DDDD', 'BDDB', 'DDDD'], z: ['DD', 'BB', 'DD', 'BB', 'DD'], plates: [[0, 1], [2, 0]] });
  gridFloor(B, 8, XS, ZS, { x: ['DDBD', 'DGDD', 'DD0D'], z: ['DD', 'B0', 'BD', 'DD', 'DD'], plates: [[3, 0]] });
  gridFloor(B, 12, XS, ZS, { x: ['DB0D', 'DDDD', 'DDGD'], z: ['DD', 'GB', 'BD', 'D0', 'DD'], plates: [[0, 1], [1, 1]] });
  gridFloor(B, 16, XS, ZS, { x: ['DDDD', 'DDGD', 'D00D'], z: ['DD', 'B0', 'DD', 'B0', 'DD'], colTop: 2.6 });
  // ladders
  B.ladder(-9, 7.25, 0, 4, '+z'); B.ladder(9, -7.25, 0, 4, '-z');
  B.ladder(-9, 1.25, 4, 8, '+z'); B.ladder(9, -1.25, 8, 12, '-z'); B.ladder(-3, 1.25, 12, 16, '+z');
  // hoist elevator on the east side
  B.lattice(17.1, 0, 0, 20, 1.2, M.galv);
  B.movers.push({ type: 'elevator', x0: 13.1, z0: -1.3, x1: 16.2, z1: 1.3, stops: [0.25, 4, 8, 12, 16], wait: 1.6, speed: 2.4 });
  B.block(13, 0, -1.6, 16.6, .1, 1.6, M.hazard, { visualOnly: true }, 1);
  // girders: pile in the yard, one on F1, one on F3
  B.items.push({ type: 'girder', x: -17, y: 0, z: 9, axis: 'x' }, { type: 'girder', x: -17, y: .45, z: 9, axis: 'x' });
  B.items.push({ type: 'girder', x: 3, y: 4, z: -6, axis: 'x' }, { type: 'girder', x: -8.6, y: 12, z: 3, axis: 'z' });
  B.block(-19.6, 0, 8.4, -14.4, .12, 9.6, M.wood, { visualOnly: true }, 1);
  B.items.push({ type: 'coffee', x: 3, y: 4, z: -3 }, { type: 'hardhat', x: -9, y: 16, z: -6 }, { type: 'cash', x: 26, y: 0, z: -20 });
  B.hazards.push({ type: 'bolts', rate: 3.2 });
  B.checkpoints.push({ x: -10.2, y: 4, z: 6 }, { x: 10.6, y: 8, z: -3.6 }, { x: -10.4, y: 12, z: 3.8 });
  B.enemies.push({ kind: 'vandal', x: 18, y: 0, z: -14 }, { kind: 'inspector', x: -6, y: 8, z: -6, minRound: 2 }, { kind: 'vandal', x: -4, y: 16, z: -6, minRound: 3 });
  // yard dressing
  yardFence(B, -36, -26, 36, 26, [-6, 6]);
  towerCrane(B, -20, -15, 30, 30, { spin: .045 });
  B.trailer(-27, 0, 15); portaPotty(B, -31, 20); portaPotty(B, -29.6, 20);
  mixerTruck(B, 20, 15);
  scatterProps(B, [['cone', -4, 0, 13], ['cone', 4, 0, 13], ['cone', -6, 0, 9], ['cone', 6, 0, 9], ['barrier', 0, -12, 'x', 4], ['barrier', -24, -6, 'z', 3],
    ['pipes', 24, -12, 'x', 3], ['crate', -24, 4], ['crate', -22.8, 4.2, .9], ['barrel', 22, 4], ['barrel', 22.7, 4.6, 0x8a2f2f], ['barrel', 21.6, 5.2]]);
  workLight(B, -15, 13, 7, -.8); workLight(B, 15, 13, 7, -2.3); workLight(B, -15, -12, 7, .8); workLight(B, 15, -12, 7, 2.3);
  B.sign(['MAC & SONS', 'CONSTRUCTION'], 0, 3.2, 26.2, 7, 2, Math.PI, { bg: '#f2b10a' });
  B.sign(['SAFETY FIRST'], 22, 1.6, 26.2, 4, 1, Math.PI, { bg: '#1c7a3a', fg: '#ffffff', stripe: false });
  B.sign(['HARD HAT AREA'], -22, 1.6, 26.2, 4, 1, Math.PI, { bg: '#f4f4f0', fg: '#c01c1c', stripe: false });
  B.sign(['DAYS WITHOUT AN', 'ACCIDENT: 0'], -13.6, 2.4, 3, 2.8, 1.4, -Math.PI / 2, { bg: '#ffffff', fg: '#1c1a17', stripe: false });
  Object.assign(B, {
    name: 'STEEL SKELETON', time: '7:00 AM', sky: 'morning', music: 'mus_l1', amb: 'amb_site', timeLimit: 200,
    spawn: { x: 0, y: 0, z: 12, yaw: Math.PI }, camYaw: 0, killY: -20,
    brief: 'Carry the four girders to the glowing gaps in the frame, drop them in and hold ACT to rivet them tight. The vandal yanks out any girder you leave loose.',
    objective: { type: 'girders' }, voice: 'fm_l1', bounds: [-36, -26, 36, 26],
  });
}

// ===================== SHIFT 2: CRANE YARD =====================
function build2(B) {
  const M = B.M;
  B.block(-36, -2, -28, 36, 0, 28, M.dirt, { surf: 'dirt' }, 7);
  B.block(-10, 0, 12, 10, .1, 22, M.concrete, { surf: 'concrete' }, 4);
  // ---- container stack west
  B.container(-21, 0, -10, 'x', 0xb5402a); B.container(-15, 0, -10, 'x', 0x2a6db5);
  B.container(-18, 2.59, -10, 'x', 0x2f8f4e);
  B.container(-16.5, 5.18, -10, 'x', 0xd8a21c, { visualOnly: true });
  B.solid(-18, 5.18, -11.22, -15, 7.77, -8.78, { surf: 'steel' });
  B.ladder(-22, -8.53, 0, 2.59, '+z'); B.ladder(-21.28, -10, 2.59, 5.18, '-x'); B.ladder(-18.25, -10, 5.18, 7.77, '-x');
  B.container(-24, 0, -16, 'z', 0x7d4a9a); B.container(-8, 0, -18, 'x', 0x4a7d8f); B.container(-8, 2.59, -18, 'x', 0xb0402a);
  // ---- conveyor from the stack (5.18) south to the scaffold
  B.conveyor(-19.6, -8.78, -18.2, 6, 5.18, 0, 2.2);
  for (const z of [-4, 1, 5]) B.column(-18.9, z, 0, 5.0, true, .3);
  // ---- scaffold tower
  const sx0 = -22, sx1 = -14, sz0 = 6, sz1 = 10;
  for (const x of [sx0, -18, sx1]) for (const z of [sz0, sz1]) { B.geo(boxGeo(.08, 9, .08, 1, x, 4.5, z), M.galv); B.solid(x - .06, 0, z - .06, x + .06, 9, z + .06, { noFloor: true }); }
  for (const y of [1.3, 3.9, 6.5]) { B.geo(boxGeo(8, .05, .05, 1, -18, y, sz0), M.galv); B.geo(boxGeo(8, .05, .05, 1, -18, y, sz1), M.galv); }
  B.plankDeck(sx0, sz0, sx1, sz1, 2.6);
  B.plankDeck(sx0, sz0, sx1, 7.5, 5.2); B.plankDeck(sx0, 7.5, -16.7, sz1, 5.2); B.plankDeck(-15.3, 7.5, sx1, sz1, 5.2); B.plankDeck(-16.7, 9, -15.3, sz1, 5.2);
  B.plankDeck(sx0, sz0, sx1, 7.5, 7.8); B.plankDeck(sx0, 7.5, -20.7, sz1, 7.8); B.plankDeck(-19.3, 7.5, sx1, sz1, 7.8); B.plankDeck(-20.7, 9, -19.3, sz1, 7.8);
  B.ladder(-13.75, 8, 0, 2.6, '+x'); B.ladder(-16, 7.6, 2.6, 5.2, '+z'); B.ladder(-20, 7.6, 5.2, 7.8, '+z');
  B.rail(sx0, sz1, sx1, sz1, 7.8); B.rail(sx0, sz0, sx0, sz1, 7.8); B.rail(sx1, sz0, sx1, sz1, 7.8); B.rail(sx0, sz0, sx1, sz0, 7.8);
  B.rail(sx0, sz1, sx1, sz1, 5.2); B.rail(sx0, sz0, sx0, sz1, 5.2);
  // ---- silo (reachable only by the crane magnet; its ladder starts 4 m up)
  B.geo(new THREE.CylinderGeometry(2.3, 2.3, 8.6, 28).translate(12.2, 4.3, -8.4), M.galv);
  B.geo(new THREE.CylinderGeometry(2.45, 2.45, .2, 28).translate(12.2, 8.5, -8.4), M.hazard);
  B.solid(10, 0, -10.6, 14.4, 8.6, -6.2, { surf: 'steel' });
  B.ladder(9.65, -8.4, 4, 8.6, '-x');
  B.rail(10.2, -10.2, 14.2, -10.2, 8.6, { solid: false }); B.rail(14.2, -10.2, 14.2, -6.6, 8.6, { solid: false });
  // ---- tower crane with magnet
  B.lattice(0, -4, 0, 24, 1.8); B.block(-2, 0, -6, 2, .6, -2, M.concrete, {}, 3);
  B.solid(-.95, 0, -4.95, .95, 24, -3.05, { noFloor: true });
  B.movers.push({ type: 'crane', cx: 0, cz: -4, h: 24, R: 13, aA: Math.PI / 2, aB: -0.346, yLow: .3, yHigh: 10.6, yDrop: 8.92, size: 3.2 });
  B.block(-2, 0, 7.4, 2, .06, 10.6, M.hazard, { visualOnly: true }, 1);
  // ---- rolling pipe lane (east -> west) along z = 2.5
  B.hazards.push({ type: 'pipes', z: 2.5, x0: 27, x1: -30, r: .62, speed: 4.6, every: 3.4 });
  B.block(-31, 0, .9, 31, .04, 4.1, M.asphalt, { visualOnly: true }, 4);
  B.block(26, 0, 0, 31, 2.2, 5, M.paint(0x2f5d8a, .5, .4), { surf: 'steel' });
  B.pipes(28.5, 2.2, 2.5, 'z', 2, .6, 4.5, 0x8d9196);
  B.barrier(-32.5, 0, 2.5, 'z', 3.6);
  // ---- dressing
  mixerTruck(B, 9, 15, 'x'); excavator(B, 24, -18); B.trailer(20, 0, 14);
  portaPotty(B, 27, 21); portaPotty(B, 28.4, 21);
  scatterProps(B, [['cone', -3, 0, 6], ['cone', 3, 0, 6], ['cone', -3, 0, -1], ['cone', 3, 0, -1], ['barrel', 6, -16], ['barrel', 6.7, -15.4], ['crate', -4, -14], ['crate', -2.9, -14, .9],
    ['pipes', 22, -2, 'x', 3], ['barrier', -10, 9, 'z', 3], ['barrier', 26, 8, 'x', 3], ['crate', 14, 20], ['crate', 15.1, 20], ['crate', 14.5, 20, .8]]);
  for (const [x, z, d] of [[-27, 18, -.6], [27, -24, 2.4], [-27, -24, .8], [0, 22, -1.57], [16, 6, 3.5]]) workLight(B, x, z, 7.5, d);
  yardFence(B, -34, -26, 34, 26, [-6, 6]);
  B.sign(['MAC & SONS', 'CRANE YARD'], 0, 3.2, 26.2, 7, 2, Math.PI);
  B.sign(['NO LUNCH ON', 'THE CRANE!'], -9.9, 1.4, -5, 2.4, 1.2, Math.PI / 2, { bg: '#ffffff', fg: '#c01c1c', stripe: false });
  // lunchboxes
  B.items.push({ type: 'lunch', x: 16, y: 0, z: -15 }, { type: 'lunch', x: -16.5, y: 7.77, z: -10 }, { type: 'lunch', x: -15.2, y: 7.8, z: 8.6 },
    { type: 'lunch', x: 12.2, y: 8.6, z: -8.4 }, { type: 'lunch', x: -18.9, y: 5.18, z: -.5 });
  B.items.push({ type: 'coffee', x: -21, y: 2.59, z: -10 }, { type: 'stopwatch', x: 22, y: 0, z: 1 }, { type: 'hardhat', x: -20, y: 2.6, z: 7 });
  B.checkpoints.push({ x: -23, y: 2.59, z: -10 }, { x: -21, y: 5.2, z: 9.2 });
  B.enemies.push({ kind: 'vandal', x: 8, y: 0, z: -12 }, { kind: 'dog', x: 18, y: 0, z: -20 }, { kind: 'vandal', x: -18, y: 2.6, z: 8, minRound: 2 }, { kind: 'inspector', x: -6, y: 0, z: 10, minRound: 3 });
  Object.assign(B, {
    name: 'CRANE YARD', time: '6:30 PM', sky: 'dusk', music: 'mus_l2', amb: 'amb_yard', timeLimit: 210,
    spawn: { x: 0, y: .1, z: 18, yaw: Math.PI }, camYaw: 0, killY: -20,
    brief: 'The crew left five lunchboxes around the yard. Ride the conveyor, climb the scaffold and hitch a ride on the crane magnet to reach them all. Jump the rolling pipes!',
    objective: { type: 'collect' }, voice: 'fm_l2', bounds: [-34, -26, 34, 26],
  });
}

// ===================== SHIFT 3: THE MILL =====================
function build3(B) {
  const M = B.M;
  // floor with the molten channel cut out
  B.block(-40, -2, -30, 40, -.02, 30, M.dirt, { surf: 'dirt' }, 7);
  B.block(-22, -1, 2, 22, 0, 10, M.concrete, { surf: 'concrete' }, 4);
  B.block(-22, -1, -14, 22, 0, -6, M.concrete, { surf: 'concrete' }, 4);
  B.block(-22, -1, -6, -7, 0, 2, M.concrete, { surf: 'concrete' }, 4);
  B.block(7, -1, -6, 22, 0, 2, M.concrete, { surf: 'concrete' }, 4);
  B.block(-7, -1.6, -6, 7, -1.2, 2, M.dark, { visualOnly: true });
  B.hazards.push({ type: 'molten', x0: -7, z0: -6, x1: 7, z1: 2, y: -.45 });
  for (const [a, b, c, d] of [[-7.2, -6.2, 7.2, -5.8], [-7.2, 1.8, 7.2, 2.2], [-7.2, -6.2, -6.8, 2.2], [6.8, -6.2, 7.2, 2.2]]) B.block(a, -.02, b, c, .25, d, M.hazard, { surf: 'steel' }, 1);
  // back wall + columns + trusses
  B.block(-24, 0, -15, 24, 18, -14, M.brick, { surf: 'concrete' }, 3);
  for (let x = -18; x <= 18; x += 9) B.block(x - 2, 6, -13.98, x + 2, 11, -13.9, M.glow(0xffa040, .6), { visualOnly: true });
  for (const x of [-22, -11, 11, 22]) B.column(x, 10, 0, 18);
  for (let x = -22; x <= 22; x += 11) B.column(x, -13.6, 0, 18, false);
  for (let x = -22; x <= 22; x += 11) B.ibeam('z', -14, 10, 18.4, x, .8, .4);
  B.ibeam('x', -22, 22, 18.4, 10, .8, .4); B.ibeam('x', -22, 22, 18.4, -13.6, .8, .4);
  // M1 (y=4): back gantry + west + east platforms
  B.deck(-20, -13, 20, -10, 4, { toe: ['z1'] }); B.deck(-20, -10, -12, 4, 4); B.deck(12, -10, 20, 0, 4);
  for (const [x, z] of [[-20, -10], [-12, -10], [-20, 4], [-12, 4], [12, 0], [20, 0], [-6, -10], [6, -10], [20, -10], [12, -10]]) B.column(x, z, 0, 4);
  B.rail(-20, -13, 20, -13, 4, { solid: true });
  // M2 (y=8)
  B.deck(-20, -9.6, -13, -1, 8); B.deck(13, -9.6, 20, -1, 8);
  for (const [x, z] of [[-20, -1], [-13, -1], [13, -1], [20, -1]]) B.column(x, z, 4, 8);
  B.conveyor(-13, -5.2, 13, -3.8, 8, 2.4, 0);
  for (const x of [-7, 0, 7]) { B.geo(boxGeo(.3, 8.8, .3, 1, x, 3.6, -4.5), M.beam); }
  // T (y=12) upper gantry with hopper
  // the gantry runs the full width so each side has two ladders up (the inspector can't block both)
  B.deck(-20, -13, 20, -10, 12, { toe: ['z1'] });
  for (const x of [-20, -16, -8, 8, 16, 20]) B.column(x, -10, 8, 12, Math.abs(x) < 20, .3); // the corner posts stay out of the way of the drop to M1
  B.rail(-20, -13, 20, -13, 12);
  B.block(-1.7, 12, -13, 1.7, 13.3, -11.4, M.dark, { surf: 'steel' });
  B.block(-1.4, 13.3, -12.8, 1.4, 13.35, -11.6, M.glow(0xff7a20, 2.2), { visualOnly: true });
  B.hopper = { x: 0, y: 12, z: -11.6 };
  // ladders
  B.ladder(-14, 4.25, 0, 4, '+z'); B.ladder(16, .25, 0, 4, '+z');
  B.ladder(-17, -.75, 4, 8, '+z'); B.ladder(17, -.75, 4, 8, '+z');
  B.ladder(-15, -9.75, 8, 12, '+z'); B.ladder(15, -9.75, 8, 12, '+z');
  B.ladder(-18.6, -9.75, 8, 12, '+z'); B.ladder(18.6, -9.75, 8, 12, '+z');
  // hazards
  B.hazards.push({ type: 'press', x: -3.2, z: -11.5, y: 4, w: 2.2, phase: 0 }, { type: 'press', x: 3.2, z: -11.5, y: 4, w: 2.2, phase: 2.2 });
  B.hazards.push({ type: 'vent', x: 0, y: 0, z: -8.2, phase: 0, power: 17.5 });
  B.hazards.push({ type: 'arc', x: 13.6, y: 4, z0: -10, z1: 0, on: 1.4, off: 2.6 });
  B.hazards.push({ type: 'ladle' });
  // crates
  B.items.push({ type: 'crate', x: -16, y: 0, z: 6 }, { type: 'crate', x: 18, y: 0, z: -10 }, { type: 'crate', x: -16, y: 4, z: -6 }, { type: 'crate', x: 17, y: 8, z: -5 });
  B.items.push({ type: 'coffee', x: 12, y: 0, z: 7 }, { type: 'hardhat', x: -10, y: 12, z: -11.5 }, { type: 'cash', x: 19, y: 4, z: -12 });
  // dressing
  scatterProps(B, [['barrel', -20, 8, 0x5a5a5a], ['barrel', -19.3, 8.6, 0x8a2f2f], ['barrel', 20, 8], ['crate', 14, 8], ['crate', 15.1, 8], ['crate', 14.5, 8.2, .8], ['pipes', 12, -12.5, 'x', 2],
    ['barrier', 0, 4, 'x', 3]]);
  B.block(-21, 0, -9, -17, 2.2, -12, M.paint(0x3a4048, .4, .7), { surf: 'steel' });
  B.sign(['DANGER', 'MOLTEN METAL'], 0, 1.6, 2.4, 3.2, 1.1, 0, { bg: '#c01c1c', fg: '#ffffff', stripe: false });
  B.sign(['HOPPER', '↓'], 0, 14.7, -13.9, 2.2, 1.4, 0, { bg: '#f2b10a', glow: .4 });
  B.sign(['MAC & SONS STEEL'], -9, 15.6, -13.95, 8, 1.6, 0, { bg: '#1c1a17', fg: '#f2b10a', stripe: false, glow: .5 });
  // high-bay lamps hanging from the trusses
  for (const [x, z] of [[-11, -11.5], [11, -11.5], [0, -11.5], [-16, 0], [16, 0], [-11, 6], [11, 6], [0, 6]]) {
    B.geo(boxGeo(.04, 1.6, .04, 1, x, 17.2, z), M.cable);
    B.geo(new THREE.CylinderGeometry(.25, .6, .5, 12).translate(x, 16.2, z), M.dark);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(.55, 16), M.glow(0xffd9a0, 0)); glow.rotation.x = Math.PI / 2; glow.position.set(x, 15.94, z); B.group.add(glow);
    B.lamps.push({ mesh: glow, pos: new THREE.Vector3(x, 15.5, z), color: 0xffcf96 });
  }
  B.checkpoints.push({ x: -18.5, y: 4, z: 1.5 }, { x: 18.6, y: 8, z: -3.4 }, { x: -12.5, y: 12, z: -11.6 });
  B.enemies.push({ kind: 'inspector', x: 8, y: 12, z: -11 }, { kind: 'vandal', x: -18, y: 0, z: -10 }, { kind: 'vandal', x: 16, y: 4, z: -6, minRound: 2 });
  Object.assign(B, {
    name: 'THE MILL', time: '11:00 PM', sky: 'night', music: 'mus_l3', amb: 'amb_mill', timeLimit: 220,
    spawn: { x: 0, y: 0, z: 7.5, yaw: Math.PI }, camYaw: 0, killY: -20, indoor: true,
    brief: 'Night shift. Carry four crates up to the furnace hopper on the top gantry. Mind the presses, the arc and the steam vent. Don\'t even think about the molten channel.',
    objective: { type: 'crates' }, voice: 'fm_l3', bounds: [-24, -15, 24, 12],
  });
}

// ===================== SHIFT 4: TOPPING OUT =====================
function build4(B) {
  const M = B.M, XS = [-12, -6, 0, 6, 12], ZS = [-6, 0, 6];
  // roof slab of the 40-storey tower, tower body below
  B.block(-14, -1, -9, 14, 0, 9, M.concrete, { surf: 'concrete' }, 4);
  B.tower = { x0: -14.5, z0: -9.5, x1: 14.5, z1: 9.5, top: -1, depth: 160 };
  for (const [a, b, c, d, gap] of [[-14, -9, 14, -9], [14, -9, 14, 9], [-14, -9, -14, 9], [-14, 9, -3, 9], [3, 9, 14, 9]]) B.rail(a, b, c, d, 0, { h: 1.1 });
  // F-A y=4 (full grid)
  gridFloor(B, 4, XS, ZS, { x: ['DDDD', 'DBGD', 'D00D'], z: ['DD', 'BD', 'DD', 'DB', 'DD'], plates: [[0, 0], [3, 1]], noCol: [] });
  // F-B y=8: two halves with a chasm at x in (-3, 3)
  // west half
  B.deck(-13, -7, -3, -5, 8); B.deck(-13, -1, -3, 1, 8);
  B.deck(-13, -5, -11, -1, 8); B.deck(-13, 1, -11, 7, 8);
  B.deck(-7, 1, -5, 7, 8); B.deck(-6, -5, -3, -1, 8, { th: .1 });
  B.sockets.push({ axis: 'x', a0: -11, a1: -7, c: 6, y: 8 });
  // east half (back line split by socket S2, bare beam on the front line)
  B.deck(3, -7, 7, -5, 8); B.deck(11, -7, 13, -5, 8); B.deck(3, -1, 13, 1, 8);
  B.deck(11, -5, 13, -1, 8); B.deck(11, 1, 13, 7, 8);
  B.deck(5, 1, 7, 7, 8); B.deck(3, -5, 6, -1, 8, { th: .1 });
  B.sockets.push({ axis: 'x', a0: 7, a1: 11, c: -6, y: 8 });
  B.ibeam('x', 7, 11, 8, 6); B.solid(7, 7.58, 5.85, 11, 8, 6.15, { surf: 'steel', beam: true });
  for (const s of [-1, 1]) for (const x of [6, 12]) for (const z of ZS) B.column(s * x, z, 4, 8);
  // crown pads y=12 + final socket
  B.deck(-6, -7, -2.3, -5, 12, { toe: ['z0', 'z1'] }); B.deck(2.3, -7, 6, -5, 12, { toe: ['z0', 'z1'] });
  for (const x of [-6, 6]) B.column(x, -6, 8, 12);
  B.column(-2.3, -6, 4, 13.2); B.column(2.3, -6, 4, 13.2);
  B.sockets.push({ axis: 'x', a0: -2.3, a1: 2.3, c: -6, y: 12, final: true });
  // ladders
  B.ladder(-9, 7.25, 0, 4, '+z'); B.ladder(9, 7.25, 0, 4, '+z');
  B.ladder(-9, -1.25, 4, 8, '-z'); B.ladder(9, 1.25, 4, 8, '+z');
  B.ladder(-4.5, -4.75, 8, 12, '+z'); B.ladder(4.5, -4.75, 8, 12, '+z');
  // swinging beam across the chasm
  // crane-carried beam shuttling across the chasm, 0.32 m above the decks
  B.movers.push({ type: 'swing', px: 0, py: 14.4, pz: 0, L: 7.2, amp: .56, period: 7.5, len: 3.2, top: 8.32 });
  // wrecking ball from the neighbouring demolition crane, swinging along z over the x=0 spine of F-A
  B.hazards.push({ type: 'wreck', px: -1.1, py: 22, pz: 0, L: 17, amp: .42, period: 7.2, axis: 'z' });
  B.hazards.push({ type: 'wind' });
  // girder pallet + crane
  B.block(-10.4, 0, 3.4, -5.6, .14, 4.6, M.wood, { visualOnly: true }, 1);
  B.items.push({ type: 'girder', x: -8, y: .14, z: 4, axis: 'x', len: 3.4 }, { type: 'girder', x: -8, y: .59, z: 4, axis: 'x', len: 3.4 }, { type: 'girder', x: -8, y: 1.04, z: 4, axis: 'x', len: 3.4 });
  B.topBeamSpot = { x: 7.5, y: .14, z: 3.8 };
  B.block(5, 0, 3.2, 10, .14, 4.4, M.wood, { visualOnly: true }, 1);
  towerCrane(B, -11.5, -7.6, 26, 24, { spin: .03, phase: 1.2 });
  B.items.push({ type: 'coffee', x: 9, y: 4, z: -6 }, { type: 'hardhat', x: -9, y: 8, z: -6 }, { type: 'stopwatch', x: 0, y: 0, z: -7.5 });
  B.checkpoints.push({ x: -10.4, y: 4, z: 6 }, { x: 10.4, y: 4, z: 6 }, { x: -4.4, y: 8, z: -2.3 }, { x: 4.4, y: 8, z: -2.3 });
  B.enemies.push({ kind: 'vandal', x: 10, y: 4, z: -6 }, { kind: 'inspector', x: -6, y: 0, z: -3, minRound: 2 }, { kind: 'vandal', x: -9, y: 8, z: 0, minRound: 2 });
  B.sign(['TOPPING OUT', 'FLOOR 40'], -14.15, 1.6, 0, 3.6, 1.4, -Math.PI / 2, { bg: '#f2b10a' });
  Object.assign(B, {
    name: 'TOPPING OUT', time: '7:40 PM', sky: 'sunset', music: 'mus_l4', amb: 'amb_high', timeLimit: 240,
    spawn: { x: 0, y: 0, z: 6.5, yaw: Math.PI }, camYaw: 0, killY: -14, high: true,
    brief: 'Forty floors up in the wind. Set and rivet three girders, then carry the topping-out beam to the crown and raise the flag. Ride the swinging beam across the gap.',
    objective: { type: 'topout' }, voice: 'fm_l4', bounds: [-14, -9, 14, 9],
  });
}


// ===================== THE PIT: flooded foundation =====================
function buildPit(B) {
  const M = B.M;
  // street level around the excavation (the hole is x -16..16, z -12..8)
  B.block(-44, -10, -32, 44, 0, -12, M.dirt, { surf: 'dirt' }, 7);
  B.block(-44, -10, 8, 44, 0, 32, M.dirt, { surf: 'dirt' }, 7);
  B.block(-44, -10, -12, -16, 0, 8, M.dirt, { surf: 'dirt' }, 7);
  B.block(16, -10, -12, 44, 0, 8, M.dirt, { surf: 'dirt' }, 7);
  B.block(-6, 0, 10, 6, .1, 32, M.concrete, { surf: 'concrete' }, 4);
  // mud floor 8 m down, concrete benches cut into the north and east walls 4 m down
  B.block(-16, -12, -12, 16, -8, 8, M.dirt, { surf: 'dirt' }, 5);
  B.block(-16, -8, -12, 16, -4, -7, M.concrete, { surf: 'concrete' }, 4);
  B.block(11, -8, -7, 16, -4, 8, M.concrete, { surf: 'concrete' }, 4);
  // shoring: soldier piles with timber lagging
  for (const x of [-12, -8, -4, 0, 4, 8, 12]) { B.column(x, -11.82, -4, .5, false, .3); B.column(x, 7.82, -8, .5, false, .3); }
  for (const z of [-6, -2, 2, 6]) B.column(-15.82, z, -8, .5, false, .3);
  for (const z of [-5, 3, 7]) B.column(15.82, z, -4, .5, false, .3);
  for (let y = -3.75; y < -.1; y += .46) { B.geo(boxGeo(32, .4, .06, 2, 0, y, -11.94), M.wood); B.geo(boxGeo(.06, .4, 15, 2, 15.94, y, .5), M.wood); }
  for (let y = -7.75; y < -.1; y += .46) { B.geo(boxGeo(32, .4, .06, 2, 0, y, 7.94), M.wood); B.geo(boxGeo(.06, .4, 20, 2, -15.94, y, -2), M.wood); }
  for (const [a, b, c, d] of [[-16.2, -12.25, 16.2, -12], [-16.2, 8, 16.2, 8.25], [-16.25, -12, -16, 8], [16, -12, 16.25, 8]]) B.block(a, 0, b, c, .03, d, M.hazard, { visualOnly: true }, 1);
  // ladders: street - north bench - floor, floor - east bench - street, and one long one up the south wall
  B.ladder(-10, -11.95, -4, 0, '+z'); B.ladder(10, -11.95, -4, 0, '+z');
  B.ladder(-4, -7.05, -8, -4, '+z'); B.ladder(6, -7.05, -8, -4, '+z');
  B.ladder(11.05, 2, -8, -4, '-x'); B.ladder(15.95, -2, -4, 0, '-x');
  B.ladder(-6, 7.95, -8, 0, '-z');
  // the four pumps (hold ACT on the valve); the water rises until they run
  B.stations.push({ kind: 'valve', x: -13.4, y: -8, z: 5, yaw: Math.PI / 2, need: 3.4 }, { kind: 'valve', x: 8.6, y: -8, z: 6.6, yaw: Math.PI, need: 3.4 },
    { kind: 'valve', x: 13.6, y: -4, z: -11.2, yaw: 0, need: 3.4 }, { kind: 'valve', x: -24, y: 0, z: -16, yaw: 0, need: 3.4 });
  B.hazards.push({ type: 'water', x0: -16, z0: -12, x1: 16, z1: 8, y0: -8.7, max: -6, rate: .017, color: 0x5d5642, deadly: .9 });
  B.hazards.push({ type: 'piledriver', x: -8.6, y: -8, z: -2.4 });
  B.hazards.push({ type: 'bolts', kind: 'rock', rate: 4.4 });
  // generator and hose for the street pump
  B.block(-27.2, 0, -18.2, -25.2, 1.7, -14, M.paint(0x2f6a3a, .5, .4), { surf: 'steel' });
  B.geo(boxGeo(.16, .16, 3.4, 1, -23.6, .08, -14.1), M.dark); B.geo(boxGeo(7.6, .16, .16, 1, -19.8, .08, -12.4), M.dark); B.geo(boxGeo(.16, 8, .16, 1, -16, -4, -12.4), M.dark);
  B.items.push({ type: 'coffee', x: 9.5, y: -4, z: -9.5 }, { type: 'hardhat', x: 13.5, y: -4, z: 6 }, { type: 'stopwatch', x: -13, y: -8, z: -5 }, { type: 'cash', x: 26, y: 0, z: 20 });
  B.checkpoints.push({ x: -12.5, y: -4, z: -9.6 }, { x: -1, y: -8, z: 6.5 }, { x: 13.6, y: -4, z: 2.5 });
  B.enemies.push({ kind: 'dog', x: 0, y: -8, z: 4 }, { kind: 'vandal', x: 20, y: 0, z: -18 }, { kind: 'inspector', x: 2, y: -4, z: -9.5, minRound: 2 }, { kind: 'vandal', x: -20, y: 0, z: 14, minRound: 3 });
  excavator(B, 26, -18); mixerTruck(B, 24, 16, 'x'); B.trailer(-26, 0, 16);
  scatterProps(B, [['cone', -5, 0, 9], ['cone', 5, 0, 9], ['cone', -17, 0, 9], ['cone', 17, 0, 9], ['barrier', 22, -14, 'x', 3], ['pipes', -26, 4, 'z', 3], ['barrel', 20, 4], ['barrel', 20.7, 4.6, 0x8a2f2f]]);
  for (const [x, z, d] of [[-18, 10, -.8], [18, 10, -2.3], [-18, -14, .8], [18, -14, 2.3]]) workLight(B, x, z, 8, d);
  yardFence(B, -36, -26, 36, 26, [-6, 6]);
  B.sign(['MAC & SONS', 'FOUNDATIONS'], 0, 3.2, 26.2, 7, 2, Math.PI);
  B.sign(['DANGER', 'DEEP EXCAVATION'], 9, 1.3, 8.6, 3, 1.1, 0, { bg: '#c01c1c', fg: '#ffffff', stripe: false });
  Object.assign(B, {
    name: 'THE PIT', time: '5:50 AM', sky: 'dawn', music: 'mus_l5', amb: 'amb_pit', timeLimit: 220,
    spawn: { x: 0, y: .1, z: 16, yaw: Math.PI }, camYaw: 0, killY: -20, cityHole: [-44, -32, 44, 32],
    brief: 'Last night\'s storm flooded the foundation. Get all four pumps running (hold ACT on each valve) before the water rises over the pit floor. The yard dog doesn\'t mind getting wet.',
    objective: { type: 'pumps' }, voice: 'fm_l5', bounds: [-30, -24, 30, 24],
  });
}

// ===================== RIVER SPAN: steel bridge deck =====================
function buildBridge(B) {
  const M = B.M, XS = [-6, 0, 6], ZS = [-24, -18, -12, -6, 0, 6, 12, 18, 24];
  // banks at road level, the river 9 m below
  B.block(-60, -14, 24, 60, 0, 60, M.dirt, { surf: 'dirt' }, 7);
  B.block(-60, -14, -60, 60, 0, -24, M.dirt, { surf: 'dirt' }, 7);
  B.block(-60, -14.6, -24, 60, -14, 24, M.dirt, { visualOnly: true }, 7);
  B.block(-60, -14, -24, 60, 0, -23.4, M.concrete, { surf: 'concrete' }, 4); B.block(-60, -14, 23.4, 60, 0, 24, M.concrete, { surf: 'concrete' }, 4);
  B.block(-7, 0, 25, 7, .05, 60, M.concrete, { surf: 'concrete' }, 4); B.block(-7, 0, -60, 7, .05, -25, M.concrete, { surf: 'concrete' }, 4);
  // the deck: decked side walkways, a bare centre beam, cross members; two cross lines still need their girders
  gridFloor(B, 0, XS, ZS, { cols: false, toe: true, z: ['DDDDDDDD', 'BBBBBBBB', 'DDDDDDDD'], x: ['DD', 'DD', 'GG', 'BB', 'DD', 'BB', 'GG', 'DD', 'DD'], plates: [[0, 0], [1, 0], [0, 7], [1, 7]] });
  for (const z of [-18, 0, 18]) B.block(-7, -14.5, z - .9, 7, -.6, z + .9, M.concrete, {}, 4);
  // through trusses with a walkway on each top chord
  for (const s of [-1, 1]) {
    const x = s * 7.6;
    for (const z of ZS.slice(1, -1)) B.column(x, z, 0, 5, true, .3);
    for (let k = 1; k < ZS.length - 2; k++) {
      const z0 = ZS[k], z1 = ZS[k + 1], L = Math.hypot(z1 - z0, 5), g = new THREE.BoxGeometry(.18, L, .18);
      g.rotateX((k & 1 ? 1 : -1) * Math.atan2(z1 - z0, 5)); g.translate(x, 2.5, (z0 + z1) / 2); B.geo(g, M.beam);
    }
    B.deck(x - .6, -18, x + .6, 18, 5, { beams: false }); B.ibeam('z', -18, 18, 4.88, x, .4, .5);
    B.rail(x + s * .6, -18, x + s * .6, 18, 5);
  }
  B.ladder(-6.95, -15, 0, 5, '+x'); B.ladder(-6.95, 9, 0, 5, '+x'); B.ladder(6.95, -9, 0, 5, '-x'); B.ladder(6.95, 15, 0, 5, '-x');
  for (const z of [-12, 12]) B.ibeam('x', -7.6, 7.6, 5.55, z, .4, .3);
  B.ibeam('x', -7, 7, 5, 0); B.solid(-7, 4.58, -.15, 7, 5, .15, { surf: 'steel', beam: true }); // overhead brace you can walk
  // river, barges, a crawler crane swinging a girder bundle across the deck
  B.hazards.push({ type: 'water', x0: -60, z0: -24, x1: 60, z1: 24, y0: -9, deadly: -.3, color: 0x2f5a62, flow: [1, 0], opacity: 1 });
  B.hazards.push({ type: 'boats', y: -9.25, lanes: [[-9, 1], [11, -1]] });
  B.hazards.push({ type: 'wreck', load: 'girders', px: 0, py: 15, pz: 6, L: 14, amp: .5, period: 8, axis: 'x', noBoom: true });
  B.block(17.5, 0, 4, 21.5, 1.2, 8, M.dark, { surf: 'steel' }, 2); B.block(18, 1.2, 4.6, 21, 3.4, 7.4, M.yellow, { surf: 'steel' }, 2);
  const boom = new THREE.Group(); boom.position.set(18, 3, 6); boom.rotation.z = Math.PI - Math.atan2(12.4, 18); boom.add(B.boom(21.9, 1, M.yellow)); B.group.add(boom);
  B.hazards.push({ type: 'bolts', kind: 'gull', rate: 3.8 }, { type: 'wind', power: 6 });
  // girders on both banks
  B.items.push({ type: 'girder', x: -11, y: 0, z: 30, axis: 'x' }, { type: 'girder', x: -11, y: .45, z: 30, axis: 'x' }, { type: 'girder', x: 11, y: 0, z: -30, axis: 'x' }, { type: 'girder', x: 11, y: .45, z: -30, axis: 'x' });
  B.items.push({ type: 'coffee', x: -7.6, y: 5, z: 3 }, { type: 'hardhat', x: 7.6, y: 5, z: -3 }, { type: 'stopwatch', x: 0, y: 0, z: 0 }, { type: 'cash', x: -12, y: 0, z: -34 });
  B.checkpoints.push({ x: 3, y: 0, z: 21 }, { x: 3.5, y: 0, z: 0 }, { x: -3, y: 0, z: -21 });
  B.enemies.push({ kind: 'vandal', x: 8, y: 0, z: -30 }, { kind: 'vandal', x: 7.6, y: 5, z: 10, minRound: 2 }, { kind: 'inspector', x: -6, y: 0, z: 30, minRound: 2 });
  scatterProps(B, [['barrier', -4, 40, 'x', 3], ['barrier', 4, 40, 'x', 3], ['cone', -8, 0, 26], ['cone', 8, 0, 26], ['cone', -8, 0, -26], ['cone', 8, 0, -26], ['pipes', 18, -32, 'x', 3], ['crate', -18, 34], ['crate', -16.9, 34.2, .9]]);
  B.trailer(-22, 0, 40); portaPotty(B, 22, 38); B.trailer(22, 0, -40);
  B.sign(['MAC & SONS', 'RIVER SPAN'], -10.5, 2.2, 25.6, 5, 1.6, 0);
  Object.assign(B, {
    name: 'RIVER SPAN', time: '12:10 PM', sky: 'noon', music: 'mus_l6', amb: 'amb_river', timeLimit: 230,
    spawn: { x: 0, y: .05, z: 33, yaw: Math.PI }, camYaw: 0, killY: -12, river: { z0: -24, z1: 24, y: -9 },
    brief: 'Four deck girders are missing from the new bridge. Carry them out from both banks, drop them in the gaps and rivet them. Mind the swinging bundle, the gusts and the gulls. It\'s a long way down to the river.',
    objective: { type: 'girders' }, voice: 'fm_l6', bounds: [-16, -38, 16, 38],
  });
}

// ===================== WRECKING CREW: demolition =====================
function buildWreck(B) {
  const M = B.M, XS = [-12, -6, 0, 6, 12], ZS = [-6, 0, 6];
  B.block(-40, -2, -30, 40, 0, 30, M.dirt, { surf: 'dirt' }, 7);
  B.block(-13.4, 0, -7.4, 13.4, .12, 7.4, M.concrete, { surf: 'concrete' }, 4);
  // three old slab floors; 'R' marks a bolted old beam to take out, gaps are ladder wells or cracked slabs
  gridFloor(B, 4, XS, ZS, { x: ['DDDD', 'DRDD', 'DDDD'], z: ['DD', 'DD', 'DD', 'DD', 'DD'], plates: [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [3, 1]] });
  gridFloor(B, 8, XS, ZS, { x: ['DDDD', 'DDDD', 'DDRD'], z: ['DD', 'DD', 'DD', 'DD', 'DD'], plates: [[1, 0], [3, 0], [0, 1], [2, 1]] });
  gridFloor(B, 12, XS, ZS, { x: ['RDDD', 'DDDD', 'DDDR'], z: ['DD', 'DD', 'DD', 'DD', 'DD'], plates: [[0, 0], [1, 0], [2, 1], [3, 1]], colTop: 1.2 });
  B.hazards.push({ type: 'crumble', slabs: [[-11, -5, -7, -1, 8], [7, 1, 11, 5, 8], [-5, 1, -1, 5, 12], [1, -5, 5, -1, 12]] });
  B.ladder(-9, 7.25, 0, 4, '+z'); B.ladder(9, -7.25, 0, 4, '-z');
  B.ladder(-3, 1.25, 4, 8, '+z'); B.ladder(3, -1.25, 4, 8, '-z');
  B.ladder(9, -1.25, 8, 12, '-z'); B.ladder(-9, 1.25, 8, 12, '+z');
  // what's left of the walls, rubble and rebar
  const brick = M.brick;
  for (const [x0, x1, h] of [[-13.2, -10, 3.4], [-10, -7.4, 2.2], [-7.4, -4, 2.9], [-4, -2.2, 1.4]]) B.block(x0, .12, -7.4, x1, .12 + h, -7.05, brick, { surf: 'concrete' }, 3);
  for (const [z0, z1, h] of [[-7.4, -4, 2.6], [-4, -1.5, 1.7]]) B.block(13.05, 4, z0, 13.4, 4 + h, z1, brick, { surf: 'concrete' }, 3);
  B.block(-13.4, 8, 3, -13.05, 9.8, 7.4, brick, { surf: 'concrete' }, 3);
  for (const [x, z, s] of [[-20, 6, 1.2], [-18.6, 7.2, .8], [20, -4, 1.4], [21.2, -2.6, .9], [-6, 11, .9], [8, -12, 1.1]]) B.block(x - s, 0, z - s, x + s, s * .5, z + s, M.dirt, { surf: 'dirt' }, 3);
  for (let k = 0; k < 14; k++) { const x = -12 + k * 1.8, g = boxGeo(.04, .04, .9, 1, x, 11.9, 7.4 + .45); g.rotateX(rr(-.4, .3)); B.geo(g, M.dark); }
  // scrap bin by the gate
  const green = M.paint(0x2f6a3a, .55, .35);
  B.block(15.2, 0, 7.6, 18.8, .25, 10.4, M.dark, { surf: 'steel' }, 1);
  for (const [a, b, c, d] of [[15.2, 7.6, 18.8, 7.8], [15.2, 10.2, 18.8, 10.4], [15.2, 7.6, 15.4, 10.4], [18.6, 7.6, 18.8, 10.4]]) B.block(a, 0, b, c, 1.6, d, green, { surf: 'steel' }, 1);
  B.sign(['SCRAP'], 17, .95, 10.45, 1.8, .6, 0, { bg: '#f2b10a' });
  B.bin = { x: 17, y: 0, z: 9 };
  // the demolition crane's wrecking ball keeps working the west face, bricks drop from above
  B.lattice(-19, 0, 0, 22.5, 1.6); B.block(-21, 0, -2, -17, .6, 2, M.concrete, {}, 3);
  B.geo(boxGeo(8, .7, .7, 1, -16.2, 21.6, 0), M.yellow);
  B.hazards.push({ type: 'wreck', px: -12.6, py: 21.2, pz: 0, L: 16.2, amp: .42, period: 7.4, axis: 'z', noBoom: true });
  B.hazards.push({ type: 'bolts', kind: 'brick', rate: 3.6 });
  B.items.push({ type: 'coffee', x: -9, y: 4, z: -3 }, { type: 'hardhat', x: 3, y: 12, z: 3 }, { type: 'stopwatch', x: -20, y: 0, z: 2 }, { type: 'cash', x: -10.2, y: 8, z: 4 });
  B.checkpoints.push({ x: -3, y: 4, z: -3 }, { x: -3.5, y: 8, z: -3 }, { x: -9.5, y: 12, z: -3 });
  B.enemies.push({ kind: 'inspector', x: 9.5, y: 8, z: -3 }, { kind: 'vandal', x: -20, y: 0, z: -14 }, { kind: 'dog', x: 22, y: 0, z: -10 }, { kind: 'vandal', x: -3, y: 12, z: -3, minRound: 2 });
  yardFence(B, -36, -26, 36, 26, [-6, 6]);
  for (const [x, z, d] of [[-16, 13, -.8], [16, 13, -2.3], [-16, -12, .8], [16, -12, 2.3]]) workLight(B, x, z, 7, d);
  scatterProps(B, [['barrier', 0, -12, 'x', 4], ['barrier', 24, 4, 'z', 3], ['cone', -4, 0, 13], ['cone', 4, 0, 13], ['barrel', 24, 14], ['barrel', 24.7, 14.6, 0x8a2f2f]]);
  mixerTruck(B, -24, 16, 'x');
  B.sign(['MAC & SONS', 'DEMOLITION'], 0, 3.2, 26.2, 7, 2, Math.PI);
  B.sign(['KEEP OFF', 'CRACKED SLABS'], 13.5, 1.5, 3, 2.6, 1.1, Math.PI / 2, { bg: '#ffffff', fg: '#c01c1c', stripe: false });
  Object.assign(B, {
    name: 'WRECKING CREW', time: '3:15 PM', sky: 'overcast', music: 'mus_l7', amb: 'amb_demo', timeLimit: 240,
    spawn: { x: 0, y: 0, z: 12, yaw: Math.PI }, camYaw: 0, killY: -20,
    brief: 'The old frame is coming down. Hold ACT to unbolt the four marked beams, then haul each one down to the scrap bin by the gate. Cracked slabs give way under you, and the wrecking ball is still swinging.',
    objective: { type: 'scrap' }, voice: 'fm_l7', bounds: [-36, -26, 36, 26],
  });
}

// ===================== STORM WATCH: beacons in a thunderstorm =====================
function buildStorm(B) {
  const M = B.M, XS = [-12, -6, 0, 6, 12], ZS = [-6, 0, 6];
  B.block(-40, -2, -30, 40, 0, 30, M.dirt, { surf: 'dirt' }, 7);
  B.block(-13.4, 0, -7.4, 13.4, .12, 7.4, M.concrete, { surf: 'concrete' }, 4);
  for (const x of XS) for (const z of ZS) B.block(x - .45, .12, z - .45, x + .45, .3, z + .45, M.concrete, {}, 2);
  gridFloor(B, 4, XS, ZS, { x: ['DDDD', 'BDDB', 'DDDD'], z: ['DD', 'BB', 'DD', 'BB', 'DD'], plates: [[0, 0], [2, 1]] });
  gridFloor(B, 8, XS, ZS, { x: ['DD0D', 'DDDD', 'DDBD'], z: ['DD', '0B', 'DB', 'DD', 'DD'], plates: [[3, 1]] });
  gridFloor(B, 12, XS, ZS, { x: ['DDDD', 'DDDD', 'DB0D'], z: ['DD', 'BD', 'DB', '0D', 'DD'], plates: [[0, 0], [1, 0]] });
  gridFloor(B, 16, XS, ZS, { x: ['D00D', 'DDDD', 'DDDD'], z: ['DD', '0B', 'DD', '0B', 'DD'], colTop: 2.6 });
  B.ladder(-9, -7.25, 0, 4, '-z'); B.ladder(9, 7.25, 0, 4, '+z');
  B.ladder(-9, -1.25, 4, 8, '-z'); B.ladder(9, 1.25, 8, 12, '+z'); B.ladder(-3, -1.25, 12, 16, '-z');
  B.lattice(17.1, 0, 0, 20, 1.2, M.galv);
  B.movers.push({ type: 'elevator', x0: 13.1, z0: -1.3, x1: 16.2, z1: 1.3, stops: [0.25, 4, 8, 12, 16], wait: 1.8, speed: 2.4 });
  B.block(13, 0, -1.6, 16.6, .1, 1.6, M.hazard, { visualOnly: true }, 1);
  // five aircraft warning beacons on the frame: hold ACT on each switch box
  const bea = (x, y, z, yaw) => B.stations.push({ kind: 'beacon', x, y, z, yaw });
  bea(-12.3, 16, -6.3, .785); bea(12.3, 16, 6.3, -2.356); bea(12.3, 12, -6.3, -.785); bea(-12.3, 8, 6.3, 2.356); bea(-12.3, 12, 6.3, 2.356);
  B.hazards.push({ type: 'bolts', kind: 'lightning', rate: 4.6 }, { type: 'wind', power: 8.5 });
  B.items.push({ type: 'coffee', x: 3, y: 4, z: 3 }, { type: 'hardhat', x: -9, y: 16, z: 6 }, { type: 'stopwatch', x: 0, y: 8, z: 0 }, { type: 'cash', x: 26, y: 0, z: 20 });
  B.checkpoints.push({ x: -10.2, y: 4, z: -6 }, { x: 10.6, y: 8, z: 3.6 }, { x: -10.4, y: 12, z: -3.8 });
  B.enemies.push({ kind: 'vandal', x: 16, y: 0, z: 10 }, { kind: 'inspector', x: -6, y: 8, z: 6 }, { kind: 'vandal', x: -4, y: 16, z: 6, minRound: 2 });
  yardFence(B, -36, -26, 36, 26, [-6, 6]);
  towerCrane(B, 20, 15, 30, 26, { spin: .08, phase: 2 });
  B.trailer(27, 0, -15); portaPotty(B, 31, -20); mixerTruck(B, -20, -15);
  for (const [x, z] of [[-6, 10], [5, 11], [-15, -10], [18, 3], [-22, 5]]) B.block(x - 1.4, 0, z - .9, x + 1.4, .02, z + .9, M.paint(0x223044, .03, .85), { visualOnly: true }, 1);
  scatterProps(B, [['cone', -4, 0, -13], ['cone', 4, 0, -13], ['barrier', 0, 12, 'x', 4], ['pipes', -24, 12, 'x', 3], ['crate', 24, -4], ['crate', 22.8, -4.2, .9], ['barrel', -22, -4]]);
  for (const [x, z, d] of [[-15, 13, -.8], [15, 13, -2.3], [-15, -12, .8], [15, -12, 2.3]]) workLight(B, x, z, 7, d);
  B.sign(['MAC & SONS', 'STORM WATCH'], 0, 3.2, -26.2, 7, 2, 0);
  Object.assign(B, {
    name: 'STORM WATCH', time: '9:40 PM', sky: 'storm', music: 'mus_l8', amb: 'amb_storm', timeLimit: 230, rain: true,
    spawn: { x: 0, y: 0, z: -12, yaw: 0 }, camYaw: Math.PI, killY: -20,
    brief: 'A thunderstorm is rolling over the frame. Switch on the five aircraft warning beacons (hold ACT at each switch box). Lightning strikes where the ground crackles, gusts shove you around and the bare beams are slick with rain.',
    objective: { type: 'beacons' }, voice: 'fm_l8', bounds: [-36, -26, 36, 26],
  });
}

export const LEVELS = [build1, build2, build3, buildPit, buildBridge, buildWreck, buildStorm, build4];
// id keys the per-shift records (medals, best times, ghosts, boards); par is the medal time in seconds
export const LEVEL_INFO = [
  { id: 'skeleton', name: 'STEEL SKELETON', time: '7:00 AM', desc: 'Set & rivet 4 girders', par: 110 },
  { id: 'yard', name: 'CRANE YARD', time: '6:30 PM', desc: 'Find 5 lunchboxes', par: 100 },
  { id: 'mill', name: 'THE MILL', time: '11:00 PM', desc: 'Load 4 crates', par: 130 },
  { id: 'pit', name: 'THE PIT', time: '5:50 AM', desc: 'Get 4 pumps running', par: 75 },
  { id: 'bridge', name: 'RIVER SPAN', time: '12:10 PM', desc: 'Set 4 deck girders', par: 120 },
  { id: 'wreck', name: 'WRECKING CREW', time: '3:15 PM', desc: 'Scrap 4 old beams', par: 165 },
  { id: 'storm', name: 'STORM WATCH', time: '9:40 PM', desc: 'Light 5 beacons', par: 105 },
  { id: 'topout', name: 'TOPPING OUT', time: '7:40 PM', desc: 'Top out the tower', par: 120 },
];
