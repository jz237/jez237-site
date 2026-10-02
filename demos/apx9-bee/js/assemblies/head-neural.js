// APX-9 head: neural processor. A vertical card in the plane z = 0 (x 9.55..12.4, y -2.55..1.55) standing in the lower
// pocket of the skull between the two optics servo cans. Front (+z) carries the die under a finned heat spreader, memory
// sticks, a QFP, a BGA, inductors and a status LED row; the back (-z) carries flash, QFNs, a back-plate and the second
// memory bank. A flat ribbon cable leaves the rear edge and runs through the neck.
import * as THREE from 'three';
import { box, cyl, plate, shape, rectPts, circlePts, sphere, rng, crease } from '../geo.js';
import { Bag, T, V, qBasis, chip, loft, secRRect, boltsAt } from './head-mech.js';
import { canvasTex } from '../textures.js';

const ZF = 0.05;                                  // half board thickness
const LID = { cx: 11.0, cy: -1.7, w: 1.4, h: 1.3 };
const MOUNTS = [[9.85, -2.3], [11.95, -2.3]];
const STICK_X = [9.8, 10.08];
const STICK_Y = -1.45;
const BOARD = [[9.55, -2.55, 0.1], [12.05, -2.55, 0.04], [12.4, -2.2, 0.04], [12.4, 0.55, 0.04], [11.7, 1.55, 0.08], [9.95, 1.55, 0.08], [9.55, 1.15, 0.08]];

/* ------------------------------------------------------------------------------------------------ helpers */
const BG = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
const bx = (sx, sy, sz, x, y, z) => T(BG, { p: [x, y, z], s: [sx, sy, sz] });
/** frame sitting on a board face: local +Y = outward face normal, local x = bee x, base at the face */
const faceM = (side, x, y) => new THREE.Matrix4().compose(V([x, y, side * ZF]), new THREE.Quaternion().setFromEuler(new THREE.Euler(side * Math.PI / 2, 0, 0)), new THREE.Vector3(1, 1, 1));
const inPoly = (poly, x, y) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
};
const polyDist = (poly, x, y) => {
  let d = 1e9;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
    d = Math.min(d, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t));
  }
  return d;
};
const uvShift = (g, du, dv) => {
  const uv = g.attributes.uv;
  if (uv) for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) + du, uv.getY(i) + dv);
  return g;
};
const planarUV = (g, w, h) => {
  const p = g.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { uv[i * 2] = p.getX(i) / w + 0.5; uv[i * 2 + 1] = p.getY(i) / h + 0.5; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
};

let dieMat = null;
/** reflective silicon with a painted floor-plan and a faint thin-film iridescence */
function dieMaterial() {
  if (dieMat) return dieMat;
  const R = rng(77);
  const map = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#0b1220'; c.fillRect(0, 0, w, h);
    const fills = ['#27407a', '#1d5f72', '#4a2f7a', '#2c3b5c', '#6b5a2a', '#1a2a4a'];
    const split = (x, y, ww, hh, d) => {
      if (d === 0 || ww < 22 || hh < 22) {
        c.fillStyle = fills[Math.floor(R() * fills.length)]; c.fillRect(x + 2, y + 2, ww - 4, hh - 4);
        c.strokeStyle = 'rgba(200,162,74,0.75)'; c.lineWidth = 1.2; c.strokeRect(x + 2.5, y + 2.5, ww - 5, hh - 5);
        c.fillStyle = 'rgba(200,162,74,0.55)';
        for (let i = 6; i < ww - 6; i += 6) c.fillRect(x + i, y + hh / 2, 1.5, hh * 0.3 * R());
        return;
      }
      if (ww > hh) { const s = ww * (0.35 + R() * 0.3); split(x, y, s, hh, d - 1); split(x + s, y, ww - s, hh, d - 1); }
      else { const s = hh * (0.35 + R() * 0.3); split(x, y, ww, s, d - 1); split(x, y + s, ww, hh - s, d - 1); }
    };
    split(8, 8, w - 16, h - 16, 4);
    c.strokeStyle = '#c8a24a'; c.lineWidth = 3; c.strokeRect(3, 3, w - 6, h - 6);
  }, { repeat: false, aniso: 4 });
  dieMat = new THREE.MeshPhysicalMaterial({
    name: 'silicon die', color: new THREE.Color('#ffffff'), map, metalness: 0.75, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.04,
    iridescence: 1, iridescenceIOR: 1.55, iridescenceThicknessRange: [220, 560],
  });
  return dieMat;
}

/* ------------------------------------------------------------------------------------------------ PCB */
function boardGeo() {
  const holes = MOUNTS.map(([x, y]) => circlePts(0.12, 16, x, y));
  return plate(shape(BOARD, holes, { steps: 3 }), ZF * 2, { bevel: 0.012, center: true, uvScale: 0.1, steps: 3 });
}

/** passive component: body + two terminals; long axis along x (ax = 0) or y (ax = 1) */
function passive(bag, side, x, y, ax, L, W, H, body = 'blackMatte') {
  const z = side * (ZF + H / 2);
  const sx = ax === 0 ? L : W, sy = ax === 0 ? W : L;
  bag.add(body, bx(sx, sy, H, x, y, z));
  const e = L * 0.24, o = L / 2 - e / 2;
  const dx = ax === 0 ? o : 0, dy = ax === 0 ? 0 : o;
  const ex_ = ax === 0 ? e : W * 1.04, ey_ = ax === 0 ? W * 1.04 : e;
  bag.add('gold', bx(ex_, ey_, H * 1.04, x + dx, y + dy, z));
  bag.add('gold', bx(ex_, ey_, H * 1.04, x - dx, y - dy, z));
}

function sideParts(bag, side, plan, R) {
  const rects = plan.rects.slice();
  const taken = (x, y, r) => rects.some((q) => x + r > q[0] && x - r < q[2] && y + r > q[1] && y - r < q[3]);
  for (const c of plan.chips) {
    chip(bag, faceM(side, c.x, c.y), { w: c.w, d: c.d, h: c.h, pins: c.pins, pitch: c.pitch || 0.1, body: 'blackMatte', lead: 'gold', bevel: 0.015 });
    rects.push([c.x - c.w / 2 - 0.07, c.y - c.d / 2 - 0.07, c.x + c.w / 2 + 0.07, c.y + c.d / 2 + 0.07]);
  }
  for (const c of plan.inductors) {
    bag.add('blackMatte', T(box(c.w, c.d, c.h, 0.02), { p: [c.x, c.y, side * (ZF + c.h / 2)] }));
    bag.add('gold', bx(0.06, c.d * 0.98, c.h * 0.7, c.x - c.w / 2 + 0.03, c.y, side * (ZF + c.h * 0.4)));
    bag.add('gold', bx(0.06, c.d * 0.98, c.h * 0.7, c.x + c.w / 2 - 0.03, c.y, side * (ZF + c.h * 0.4)));
    rects.push([c.x - c.w / 2 - 0.06, c.y - c.d / 2 - 0.06, c.x + c.w / 2 + 0.06, c.y + c.d / 2 + 0.06]);
  }
  // scatter of passives on a jittered grid, outside the reserved rectangles and clear of the board edge
  for (let gx = 9.72; gx < 12.35; gx += 0.17) for (let gy = -2.45; gy < 1.5; gy += 0.15) {
    if (R() > plan.density) continue;
    const x = gx + (R() - 0.5) * 0.05, y = gy + (R() - 0.5) * 0.04;
    const kind = R();
    const [L, W, H] = kind < 0.55 ? [0.12, 0.06, 0.05] : kind < 0.88 ? [0.17, 0.09, 0.06] : [0.24, 0.13, 0.1];
    const ax = R() < 0.5 ? 0 : 1;
    const r = L * 0.6 + 0.02;
    if (!inPoly(BOARD, x, y) || polyDist(BOARD, x, y) < r + 0.05 || taken(x, y, r)) continue;
    if (plan.maxH && H > plan.maxH) continue;
    passive(bag, side, x, y, ax, L, W, H);
    rects.push([x - r, y - r, x + r, y + r]);
  }
}

function buildPcb(M, part) {
  const bag = new Bag();
  bag.add('pcb', boardGeo());
  // mount-hole lands (gold annuli) on both faces
  for (const [x, y] of MOUNTS) for (const s of [1, -1]) bag.add('gold', T(cyl(0.2, 0.012, { rIn: 0.12, segments: 20, bevel: 0.002 }), { p: [x, y, s * (ZF + 0.006)], e: [Math.PI / 2, 0, 0] }));
  // gold edge fingers along the lower edge (both faces)
  for (let i = 0; i < 10; i++) for (const s of [1, -1]) bag.add('gold', bx(0.07, 0.18, 0.012, 10.4 + i * 0.13, -2.45, s * (ZF + 0.006)));

  const R = rng(5);
  const common = [
    [LID.cx - 0.92, LID.cy - 0.78, LID.cx + 0.92, LID.cy + 0.78],
    [9.65, -2.05, 10.25, -0.85], [9.5, -0.72, 9.98, 1.12], [12.0, -0.45, 12.42, 0.45],
    ...MOUNTS.map(([x, y]) => [x - 0.32, y - 0.32, x + 0.32, y + 0.32]),
    [12.0, -2.1, 12.4, -0.85],
  ];
  sideParts(bag, 1, {
    rects: common, density: 0.5, maxH: 0.1,
    chips: [
      { x: 10.45, y: 0.8, w: 0.9, d: 0.9, h: 0.1, pins: 'quad', pitch: 0.13 },
      { x: 11.4, y: 0.72, w: 0.8, d: 0.8, h: 0.1, pins: 'bga' },
      { x: 11.62, y: -0.4, w: 0.55, d: 0.42, h: 0.09, pins: 'gull', pitch: 0.1 },
    ],
    inductors: [{ x: 10.15, y: -0.35, w: 0.4, d: 0.4, h: 0.13 }, { x: 10.6, y: -0.35, w: 0.4, d: 0.4, h: 0.13 }, { x: 11.05, y: -0.35, w: 0.4, d: 0.4, h: 0.13 }],
  }, R);
  sideParts(bag, -1, {
    rects: common, density: 0.5, maxH: 0.1,
    chips: [
      { x: 10.5, y: 0.75, w: 0.85, d: 0.85, h: 0.1, pins: 'quad', pitch: 0.12 },
      { x: 11.55, y: 0.35, w: 0.6, d: 0.95, h: 0.09, pins: 'gull', pitch: 0.1 },
      { x: 10.85, y: -0.4, w: 0.7, d: 0.4, h: 0.09, pins: 'quad', pitch: 0.12 },
    ],
    inductors: [{ x: 11.5, y: -0.55, w: 0.4, d: 0.4, h: 0.13 }],
  }, R);

  // memory sockets (both faces): black housing with steel latches, under each stick
  for (const s of [1, -1]) for (const x of STICK_X) {
    bag.add('blackMatte', bx(0.14, 1.08, 0.1, x, STICK_Y, s * (ZF + 0.05)));
    for (const sy of [-1, 1]) bag.add('gold', bx(0.12, 0.06, 0.2, x, STICK_Y + sy * 0.57, s * (ZF + 0.1)));
  }
  // ribbon connector on the rear edge and a board-to-board connector on the front edge
  bag.add('blackMatte', T(box(0.3, 1.72, 0.22, 0.03), { p: [9.72, 0.2, 0] }));
  bag.add('gold', bx(0.05, 1.5, 0.05, 9.58, 0.2, 0.0));
  for (const s of [1, -1]) {
    bag.add('blackMatte', bx(0.3, 0.74, 0.13, 12.2, 0.0, s * (ZF + 0.065)));
    for (let i = 0; i < 8; i++) bag.add('gold', bx(0.05, 0.05, 0.03, 12.2, -0.28 + i * 0.08, s * (ZF + 0.145)));
  }
  // back-plate behind the die with four brass screws
  bag.add('gold', T(plate(rectPts(1.2, 1.08, 0.1), 0.04, { bevel: 0.01, center: true, uvScale: 0.5 }), { p: [LID.cx, LID.cy, -ZF - 0.02] }));
  const sp = [[-0.5, -0.43], [0.5, -0.43], [-0.5, 0.43], [0.5, 0.43]].map(([a, b]) => [LID.cx + a, LID.cy + b, -ZF - 0.04]);
  bag.add('gold', boltsAt(sp, [0, 0, -1], { kind: 'hex', br: 0.07 }));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ die + heat spreader */
function buildDie(M, part) {
  const bag = new Bag();
  const x = LID.cx, y = LID.cy;
  bag.add('pcb', uvShift(T(plate(rectPts(1.0, 1.0, 0.06), 0.06, { bevel: 0.01, center: true, uvScale: 0.3 }), { p: [x, y, ZF + 0.03] }), 0.3, 0.1));
  bag.add('blackMatte', T(plate(rectPts(0.74, 0.74, 0.04), 0.045, { bevel: 0.008, center: true }), { p: [x, y, ZF + 0.06 + 0.0225] }));
  bag.add(dieMaterial(), T(planarUV(plate(rectPts(0.62, 0.62, 0.03), 0.075, { bevel: 0.01, center: true }), 0.62, 0.62), { p: [x, y, ZF + 0.06 + 0.0375] }));
  // decoupling caps around the substrate
  for (const [dx, dy, ax] of [[-0.42, -0.3, 1], [-0.42, 0.3, 1], [0.42, -0.3, 1], [0.42, 0.3, 1], [-0.25, 0.42, 0], [0.25, 0.42, 0], [-0.25, -0.42, 0], [0.25, -0.42, 0]]) {
    const sx = ax === 0 ? 0.12 : 0.06, sy = ax === 0 ? 0.06 : 0.12;
    bag.add('blackMatte', bx(sx, sy, 0.04, x + dx, y + dy, ZF + 0.09));
  }
  return bag.flush(part, M);
}

function buildSpreader(M, part) {
  const bag = new Bag();
  const { cx, cy, w, h } = LID;
  const zU = ZF + 0.16;                                  // underside of the top plate
  bag.add('copper', T(plate(rectPts(w, h, 0.14), 0.09, { bevel: 0.025, center: true, uvScale: 0.4 }), { p: [cx, cy, zU + 0.045] }));
  bag.add('copper', T(plate(shape(rectPts(w, h, 0.14), [rectPts(w - 0.17, h - 0.17, 0.06)]), 0.16, { bevel: 0.012, center: true, uvScale: 0.4 }), { p: [cx, cy, ZF + 0.08] }));
  // fin base rail and eight fins along y
  const zT = zU + 0.09;
  bag.add('brushed', bx(1.1, 1.0, 0.03, cx, cy, zT + 0.015));
  const nF = 8;
  for (let i = 0; i < nF; i++) bag.add('brushed', T(box(0.06, 1.0, 0.34, 0.012), { p: [cx - 0.5 + i * (1.0 / (nF - 1)), cy, zT + 0.03 + 0.17] }));
  // retaining clip: bridge over the fins, legs and screws into the board
  const zC = zT + 0.03 + 0.34 + 0.025;
  bag.add('steel', T(box(1.64, 0.13, 0.045, 0.01), { p: [cx, cy, zC] }));
  for (const sx of [-1, 1]) {
    bag.add('steel', T(box(0.06, 0.13, zC - ZF - 0.02, 0.01), { p: [cx + sx * 0.8, cy, (zC + ZF) / 2] }));
    bag.add('steel', T(box(0.22, 0.2, 0.03, 0.008), { p: [cx + sx * 0.88, cy, ZF + 0.015] }));
    bag.add('steel', boltsAt([[cx + sx * 0.9, cy, ZF + 0.03]], [0, 0, 1], { kind: 'hex', br: 0.065 }));
  }
  // mid-height retention screws in the skirt corners
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) bag.add('steel', boltsAt([[cx + sx * 0.63, cy + sy * 0.57, zU + 0.09]], [0, 0, 1], { kind: 'dome', br: 0.05 }));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ memory sticks */
function stickBank(M, part, side) {
  const bag = new Bag();
  const R = rng(41);
  for (let k = 0; k < STICK_X.length; k++) {
    const x = STICK_X[k];
    // stick-local frame: shape x -> bee y, shape y -> bee z (outward), extrusion -> bee x
    const ex_ = [0, 1, 0], ey = [0, 0, side], ez = [side, 0, 0];
    const xf = new THREE.Matrix4().compose(V([x, STICK_Y, 0]), qBasis(ex_, ey, ez), new THREE.Vector3(1, 1, 1));
    const z0 = side * 0 + ZF + 0.1 - 0.05;                       // seated 0.05 into the socket
    const zH = 0.62;
    const board = plate([[-0.5, 0, 0], [0.5, 0, 0], [0.5, zH - 0.06, 0], [0.44, zH, 0], [-0.44, zH, 0], [-0.5, zH - 0.06, 0]], 0.05, { bevel: 0.008, center: true, uvScale: 0.25 });
    bag.addAt('pcb', uvShift(T(board, { p: [0, z0 + 0.0, 0] }), R(), R()), xf);
    // chips on the +x face (4) and the -x face (2)
    for (let i = 0; i < 4; i++) bag.addAt('blackMatte', T(box(0.2, 0.2, 0.06, 0.012), { p: [-0.375 + i * 0.25, z0 + 0.34, 0.055] }), xf);
    for (let i = 0; i < 2; i++) bag.addAt('blackMatte', T(box(0.2, 0.18, 0.06, 0.012), { p: [-0.18 + i * 0.36, z0 + 0.34, -0.055] }), xf);
    // gold contact fingers above the socket on both faces
    for (let i = 0; i < 12; i++) for (const f of [1, -1]) bag.addAt('gold', T(BG, { p: [-0.44 + i * 0.08, z0 + 0.12, f * 0.027], s: [0.045, 0.11, 0.012] }), xf);
    // thermal strip across the chips (gold foil)
    bag.addAt('gold', T(box(0.92, 0.035, 0.012, 0.004), { p: [0, z0 + 0.46, 0.088] }), xf);
  }
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ ribbon cable */
function buildRibbon(M, part) {
  const bag = new Bag();
  const path = [[9.64, 0.2, 0], [9.25, 0.2, -0.06], [8.9, 0.2, -0.28], [8.45, 0.2, -0.47], [7.8, 0.2, -0.5], [7.1, 0.2, -0.46], [6.55, 0.2, -0.42]];
  bag.add('kapton', loft(path, () => secRRect(0.75, 0.022, 0.012, 2), { n: 44, up: [0, 1, 0], caps: true, creaseDeg: 60 }));
  // conductor lines: thin gold strips riding on the upper surface
  for (let i = 0; i < 9; i++) {
    const yo = -0.6 + i * 0.15;
    const pts = path.map(([x, y, z]) => [x, y + yo - 0.0, z]);
    bag.add('gold', loft(pts, () => secRRect(0.018, 0.026, 0, 0), { n: 26, up: [0, 1, 0], caps: false, creaseDeg: 60 }));
  }
  // plug tongue stiffener at the card end and the far connector block
  bag.add('blackMatte', T(box(0.34, 1.62, 0.12, 0.02), { p: [9.5, 0.2, 0.0] }));
  bag.add('gold', bx(0.2, 1.45, 0.03, 9.43, 0.2, 0.065));
  bag.add('blackMatte', T(box(0.42, 1.66, 0.3, 0.04), { p: [6.4, 0.2, -0.42] }));
  for (let i = 0; i < 12; i++) bag.add('gold', bx(0.06, 0.06, 0.06, 6.17, -0.42 + i * 0.113, -0.42));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ LEDs */
function buildLeds(M, part) {
  const bag = new Bag();
  const ys = [-1.95, -1.66, -1.37, -1.08];
  ys.forEach((y, i) => {
    const xf = faceM(1, 12.12, y);
    bag.addAt('blackMatte', T(cyl(0.095, 0.05, { bevel: 0.012, segments: 16, rIn: 0.065 }), { p: [0, 0.025, 0] }), xf);
    bag.addAt(i % 2 ? 'glowCyan' : 'glowAmber', T(sphere(0.062, { segments: 12, rings: 7 }), { p: [0, 0.045, 0], s: [1, 0.85, 1] }), xf);
  });
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ mounting posts */
function hexPost(r, l) {
  const hex = new THREE.CylinderGeometry(r, r, l, 6, 1);
  hex.translate(0, l / 2, 0);
  return crease(hex.toNonIndexed(), 30);
}
function buildPosts(M, part) {
  const bag = new Bag();
  const HEX = hexPost(0.17, 0.95);
  for (const [x, y] of MOUNTS) {
    const xf = faceM(1, x, y);
    bag.addAt('brass', HEX, xf);
    // through-bolt: shank in the board hole, washer and head outside the cradle rail (local y 0.95 .. 1.11 is the rail)
    bag.addAt('steel', T(cyl(0.065, 1.0, { bevel: 0.01, segments: 10 }), { p: [0, 0.47, 0] }), xf);
    bag.addAt('blackMatte', T(cyl(0.2, 0.025, { bevel: 0.006, segments: 18, rIn: 0.07 }), { p: [0, 1.1225, 0] }), xf);
    bag.addAt('steel', T(cyl(0.12, 0.07, { bevel: 0.02, segments: 14 }), { p: [0, 1.17, 0] }), xf);
  }
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ assembly */
export function buildNeural(ctx, neural) {
  const { M, ex, bee } = ctx;
  const mats = { ...M, kapton: ctx.paint('#c97d1f', { rough: 0.45, coat: 0.5 }) };

  const pcb = neural.part('pcb', {
    name: 'Neural Card (PCB)',
    info: 'Vertical four-layer control card with etched gold traces, QFP and BGA processors, inductors, edge fingers, memory sockets and board connectors on both faces.',
    specs: { Layers: '4', Thickness: '0.1 mm' },
  });
  buildPcb(mats, pcb);

  const die = neural.part('die', {
    name: 'Neural Die', explode: ex([0.3, 0.9, 1.8], 'mid'),
    info: 'Bare silicon neural die on its ceramic BGA substrate with underfill and decoupling capacitors; the floor-plan blocks show cores, cache and I/O.',
    specs: { Process: '5 nm class', Cores: '64 neuron tiles' },
  });
  buildDie(mats, die);

  const hs = neural.part('heat-spreader', {
    name: 'Heat Spreader', explode: ex([0.5, 1.9, 3.8], 'mid'),
    info: 'Copper integrated heat spreader with eight brushed fins and a spring clip. Its fins pass heat to the crown thermal fins above the card.',
    specs: { Material: 'Plated copper, steel clip' },
  });
  buildSpreader(mats, hs);

  const mem = neural.part('memory-modules', {
    name: 'Memory Modules',
    info: 'Four stacked memory sticks, two on each face of the card; each carries DRAM packages and a gold contact edge seated in a latched socket.',
  });
  const bankR = mem.part('bank-r', { name: 'Right Memory Bank', explode: ex([-1.1, -1.2, 2.6], 'mid'), info: 'Two memory sticks seated on the right face of the card, each with four DRAM chips and a foil heat strip.' });
  stickBank(mats, bankR, 1);
  bee.mirror(bankR, { parent: mem });

  const rib = neural.part('ribbon-cable', {
    name: 'Ribbon Cable', explode: ex([-2.8, 0.2, -0.4], 'mid'),
    info: 'Amber polyimide flex cable with gold conductor lines; a tongue plugs into the rear card connector and the far block mates with the thorax socket.',
  });
  buildRibbon(mats, rib);

  const led = neural.part('status-led', {
    name: 'Status LEDs', explode: ex([0.8, 0.7, 1.7], 'fine'),
    info: 'Row of four status LEDs in black bezels at the front edge of the card, alternating amber and cyan to show boot, link, load and fault.',
  });
  buildLeds(mats, led);

  const posts = neural.part('mounting-posts', {
    name: 'Mounting Posts',
    info: 'Brass hex standoffs and through-bolts that clamp the card between the two cradle rails of the head frame.',
  });
  const postsR = posts.part('posts-r', { name: 'Right Mounting Posts', explode: ex([0.6, -1.5, 3.2], 'mid'), info: 'Two brass standoffs with steel through-bolts on the right face of the card, tied to the right cradle rail.' });
  buildPosts(mats, postsR);
  bee.mirror(postsR, { parent: posts });
}
