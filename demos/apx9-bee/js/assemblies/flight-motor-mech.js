// flight-motor-mech.js - mechanism of the flight motor: drive motor, three-stage spur gear train, cam + follower, slider-crank linkage.
// Motor-local frame (see flight-motor-lay.js): +X forward, +Y up, +Z bee-right. Gears lie in XZ planes on vertical axles.
import { M, ex, plate, revolve, S, spring } from '../kit.js';
import { TAU, D2R, loopRev, loopX, plateY, plateZ, circ, mAt, gearPlate, flutePts, holeRing } from './flight-util.js';
import { LAY, STANDOFFS, G1, G2A, G2B, G3, PH, LINK, linkPose, CAM, camR } from './flight-motor-lay.js';

const PI = Math.PI;
const FL1 = LAY.floor[1];                                   // tray floor top
const cylY = (r, y0, y1, f = 0.01, seg = 20) => revolve([[0, y0], [r, y0, f], [r, y1, f], [0, y1]], { segments: seg, steps: 2 });
const ringY = (ri, ro, y0, y1, f = 0.008, seg = 24) => loopRev([[ri, y0, f], [ro, y0, f], [ro, y1, f], [ri, y1, f]], { segments: seg, steps: 2 });
/** World (x, z) outline -> plateY shape coordinates (shape y runs to -z). */
const flat = (pts) => pts.map(([x, z, r]) => (r === undefined ? [x, -z] : [x, -z, r]));

/** Spur gear lying in the XZ plane, thickness y[0]..y[1], centred on x = z = 0. */
function gearG(g, y, { bore = 0.05, holes = [], phase = 0, bevel = 0.012 } = {}) {
  const geo = gearPlate(g.N, g.tip, g.root, y[1] - y[0], { bore, holes, phase, bevel });
  geo.rotateX(-PI / 2);
  geo.translate(0, (y[0] + y[1]) / 2, 0);
  return geo;
}

/** Dog-bone link outline (world x, z) between A and B with eye radii rA, rB and web half width w. */
function bone(A, B, rA, rB, w, n = 10) {
  const th = Math.atan2(B[1] - A[1], B[0] - A[0]), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const c = Math.cos(th), s = Math.sin(th);
  const loc = [];
  for (let i = 0; i <= n; i++) { const t = PI / 2 + PI * i / n; loc.push([Math.cos(t) * rA, Math.sin(t) * rA]); }
  loc.push([L * 0.36, -w], [L * 0.64, -w]);
  for (let i = 0; i <= n; i++) { const t = -PI / 2 + PI * i / n; loc.push([L + Math.cos(t) * rB, Math.sin(t) * rB]); }
  loc.push([L * 0.64, w], [L * 0.36, w]);
  return loc.map(([u, v]) => [A[0] + u * c - v * s, A[1] + u * s + v * c]);
}

/* ================================================================== drive motor */

/** Mounting flange outline in world (x, z): disc with three lugs at the standoff angles. */
function flangeOutline(rd = 0.40, rl = 0.575) {
  const out = [], n = S(96, 48);
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU;
    let k = 0;
    for (const deg of [120, 180, 240]) { const d = Math.atan2(Math.sin(a - deg * D2R), Math.cos(a - deg * D2R)); k = Math.max(k, Math.exp(-((d / 0.17) ** 2))); }
    const r = rd + (rl - rd) * k;
    out.push([LAY.g1 + Math.cos(a) * r, Math.sin(a) * r]);
  }
  return out;
}

export function buildDriveMotor(motor, F) {
  const dm = motor.part('drive-motor', {
    name: 'Drive Motor',
    info: 'Vertical coreless DC micro-motor: fluted black can, chrome end bell, brass terminals and a three-lug mounting flange held on steel standoffs; its shaft carries the drive pinion.',
    specs: { Type: 'Coreless DC, 3.7 V', Output: '38 Hz wing drive after 2.56 : 1 reduction', Can: 'dia 0.72 x 0.80 mm', Mass: '0.12 g' },
  });

  const can = dm.part('can', {
    name: 'Motor Can',
    info: 'Black fluted motor can with a chrome rolled rim, bearing end bell and two brass solder terminals, seated on the mounting flange.',
    specs: { Material: 'Black-anodised aluminium, chrome end bell', Flutes: '18', Terminals: '2 brass tabs', Mass: '0.08 g' },
    explode: ex([0, 2.4, 0], 'mid'),
  });
  const body = plateY(flutePts(18, 0.36, 0.022, 4), 0.80, { bevel: 0.012, bevelSegments: 1, steps: 2 });
  body.translate(LAY.g1, -0.45, 0);
  can.add(body, M.black);
  const holes = STANDOFFS.map(([x, z]) => circ(0.032, 10, x, -z));
  const fl = plateY(flat(flangeOutline()), 0.04, { bevel: 0.008, bevelSegments: 1, steps: 2, holes: holes.concat([circ(0.30, 28, LAY.g1, 0)]) });
  fl.translate(0, -0.49, 0);
  can.add(fl, M.black);
  const bell = revolve([[0, 0.35], [0.352, 0.35, 0.008], [0.352, 0.374, 0.01], [0.31, 0.374], [0.31, 0.386, 0.01], [0.175, 0.394, 0.012], [0.175, 0.404], [0.095, 0.404, 0.01], [0.095, 0.428, 0.01], [0, 0.43]],
    { segments: 36, steps: 2 });
  can.add(bell, M.chrome, [LAY.g1, 0, 0]);
  const lowRim = ringY(0.30, 0.372, -0.455, -0.43, 0.008, 36);
  can.add(lowRim, M.chrome, [LAY.g1, 0, 0]);
  const tab = revolve([[0, 0], [0.035, 0, 0.004], [0.035, 0.012, 0.004], [0.026, 0.05, 0.01], [0.016, 0.065, 0.008], [0, 0.065]], { segments: 10, steps: 1 });
  for (const s of [-1, 1]) {
    can.add(tab, M.brass, [LAY.g1 + s * 0.235, 0.394, 0.0]);
    can.add(tab, M.brass, [LAY.g1 + s * 0.235, 0.394, 0.0]);
  }

  const so = dm.part('standoffs', {
    name: 'Motor Standoffs',
    info: 'Three steel standoff posts that rise from pads in the tray floor to the motor flange, each closed by a chrome socket screw.',
    specs: { Material: 'Stainless steel posts, chrome screws', Count: '3', Height: '0.54 mm', Mass: '0.01 g' },
    explode: ex([0, 1.3, 0], 'fine'),
  });
  const post = F.pin(0.045, -0.49 - (FL1 + 0.065)), cap = F.cap(0.055);
  STANDOFFS.forEach(([x, z], i) => {
    so.add(post, M.steel, [x, FL1 + 0.065, z]);
    so.add(cap, M.chrome, mAt([x, -0.45, z], [0, 1, 0], i * 1.7));
  });
  return dm;
}

/* ================================================================== gear train */

export function buildGearTrain(motor, F) {
  const gt = motor.part('gear-train', {
    name: 'Gear Train',
    info: 'Two-stage spur reduction in module 0.07 mm: the 10-tooth motor pinion drives the 16/10-tooth compound gear, which drives the 16-tooth crank gear; teeth are phased so every pair really meshes.',
    specs: { Gears: '10T pinion, 16T/10T compound, 16T crank gear', Module: '0.07 mm', Ratio: '2.56 : 1', Mass: '0.05 g' },
    explode: ex([0, 1.0, 0], 'mid'),
  });
  const [yLo, yHi] = [LAY.yLo, LAY.yHi];

  const pn = gt.part('pinion', {
    name: 'Drive Pinion',
    info: 'Ten-tooth brass pinion pressed on the motor shaft, with a chrome clamp collar and the stepped steel shaft that runs down into the tray bearing seat.',
    specs: { Teeth: '10', Module: '0.07 mm', Material: 'Brass pinion, steel shaft', Mass: '0.004 g' },
  });
  pn.add(gearG(G1, yLo, { bore: 0.04, phase: PH.g1, bevel: 0.01 }), M.brass, [LAY.g1, 0, 0]);
  const shaft = revolve([[0, -1.03], [0.036, -1.03, 0.01], [0.036, -0.92], [0.05, -0.92, 0.006], [0.05, -0.88], [0.036, -0.88], [0.036, -0.74], [0.075, -0.74, 0.008], [0.075, -0.68, 0.008], [0.036, -0.68], [0.036, -0.45], [0, -0.45]],
    { segments: 20, steps: 1 });
  pn.add(shaft, M.chrome, [LAY.g1, 0, 0]);

  const cg = gt.part('compound-gear', {
    name: 'Compound Gear',
    info: 'Two gears on one hub: a lightened 16-tooth brushed wheel that meets the pinion and a 10-tooth brass pinion above it that drives the crank gear.',
    specs: { Teeth: '16T + 10T', Material: 'Brushed steel wheel, brass pinion, chrome hub', Lightening: '5 holes', Mass: '0.012 g' },
  });
  cg.add(gearG(G2A, yLo, { bore: 0.10, holes: holeRing(5, 0.30, 0.07, 0.3, 14), phase: PH.g2a }), M.brushed, [LAY.g2, 0, 0]);
  cg.add(gearG(G2B, yHi, { bore: 0.10, phase: PH.g2b }), M.brass, [LAY.g2, 0, 0]);
  cg.add(cylY(0.115, -0.88, -0.52, 0.01, 24), M.chrome, [LAY.g2, 0, 0]);

  const cr = gt.part('crank-gear', {
    name: 'Crank Gear',
    info: 'Sixteen-tooth lightened brushed steel gear that turns the crank: an offset chrome crank pin with a brass spacer stands on its upper face.',
    specs: { Teeth: '16', Crank: '0.22 mm radius', Lightening: '5 holes', Mass: '0.012 g' },
  });
  const [cx, cz] = [linkPose().cx, linkPose().cz];
  cr.add(gearG(G3, yHi, { bore: 0.10, holes: holeRing(5, 0.32, 0.065, 0.63, 14), phase: PH.g3 }), M.brushed, [LAY.g3, 0, 0]);
  cr.add(cylY(0.11, -0.70, -0.52, 0.01, 24), M.chrome, [LAY.g3, 0, 0]);
  cr.add(cylY(0.04, -0.56, -0.355, 0.008, 14), M.chrome, [cx, 0, cz]);
  cr.add(ringY(0.04, 0.065, -0.56, -0.447, 0.006, 20), M.brass, [cx, 0, cz]);

  const ax = gt.part('axles', {
    name: 'Gear Axles',
    info: 'Two stepped steel axles that stand in the tray bearing seats and carry the compound and crank gears, each with a brass sleeve and thrust washer.',
    specs: { Material: 'Hardened steel, brass sleeves', Diameter: '0.10 mm', Count: '2', Mass: '0.004 g' },
    explode: ex([0, -1.0, 0], 'fine'),
  });
  const axle = (top) => revolve([[0, -1.03], [0.05, -1.03, 0.01], [0.05, top - 0.01], [0.04, top, 0.006], [0, top]], { segments: 18, steps: 1 });
  ax.add(axle(-0.44), M.chrome, [LAY.g2, 0, 0]);
  ax.add(axle(-0.52), M.chrome, [LAY.g3, 0, 0]);
  const sleeve = (y0, y1) => loopRev([[0.052, y0, 0.006], [0.085, y0, 0.01], [0.085, y1, 0.01], [0.052, y1, 0.006]], { segments: 20, steps: 1 });
  ax.add(sleeve(-1.0, -0.88), M.brass, [LAY.g2, 0, 0]);
  ax.add(sleeve(-1.0, -0.70), M.brass, [LAY.g3, 0, 0]);
  return gt;
}

/* ================================================================== cam + follower */

function camOutline() {
  const out = [], n = S(72, 48);
  for (let i = 0; i < n; i++) { const a = i * 360 / n, r = camR(a); out.push([LAY.g2 + Math.cos(a * D2R) * r, Math.sin(a * D2R) * r]); }
  return out;
}

export function buildCam(motor, F) {
  const cm = motor.part('cam', {
    name: 'Cam and Follower',
    info: 'Eccentric cam disc on the compound gear axle with a spring-loaded roller follower on its own pivot post; it times the wing stroke against the slider-crank.',
    specs: { Lift: '0.085 mm', Follower: 'Roller lever with torsion spring', Material: 'Brushed steel, chrome roller', Mass: '0.02 g' },
    explode: ex([0, 2.0, 0], 'mid'),
  });
  const disc = cm.part('cam-disc', {
    name: 'Cam Disc',
    info: 'Brushed steel eccentric cam with two lightening holes, a chrome clamp hub and a socket-screw cap that locks it on the compound axle.',
    specs: { Profile: 'Eccentric, lift 0.085 mm', Thickness: '0.08 mm', Material: 'Brushed steel, chrome cap', Mass: '0.004 g' },
  });
  const a0 = CAM.a0 * D2R;
  const lh = [[0.12, a0 + PI + 1.15], [0.12, a0 + PI - 1.15]].map(([r, a]) => circ(0.035, 10, Math.cos(a) * r + LAY.g2, -Math.sin(a) * r));
  const cd = plateY(flat(camOutline()), 0.08, { bevel: 0.01, bevelSegments: 1, steps: 2, holes: lh.concat([circ(0.05, 14, LAY.g2, 0)]) });
  cd.translate(0, LAY.camY[0], 0);
  disc.add(cd, M.brushed);
  disc.add(ringY(0.05, 0.095, LAY.camY[1], LAY.camY[1] + 0.025, 0.006, 22), M.chrome, [LAY.g2, 0, 0]);
  disc.add(F.cap(0.06), M.chrome, mAt([LAY.g2, LAY.camY[1] + 0.025, 0], [0, 1, 0], 0.4));

  const fo = cm.part('follower', {
    name: 'Cam Follower',
    info: 'Steel follower lever with a chrome roller riding the cam, pivoting on a chrome post that stands on the tray floor; a brass torsion spring preloads it.',
    specs: { Roller: 'dia 0.09 mm', Spring: 'Brass torsion coil, 4 turns', Pivot: 'Chrome post on the tray floor', Mass: '0.005 g' },
  });
  const P = CAM.pivot, rr = camR(CAM.a0) + CAM.roller;
  const R = [LAY.g2 + Math.cos(a0) * rr, Math.sin(a0) * rr];
  const lev = plateY(flat(bone(R, P, 0.05, 0.068, 0.028)), 0.04, { bevel: 0.008, bevelSegments: 1, steps: 2, holes: [circ(0.021, 10, R[0], -R[1]), circ(0.043, 12, P[0], -P[1])] });
  lev.translate(0, -0.50, 0);
  fo.add(lev, M.steel);
  fo.add(cylY(0.045, -0.52, -0.44, 0.008, 22), M.chrome, [R[0], 0, R[1]]);
  fo.add(cylY(0.021, -0.44, -0.415, 0.004, 10), M.chrome, [R[0], 0, R[1]]);
  const post = revolve([[0, -1.09], [0.08, -1.09, 0.01], [0.08, -1.05, 0.01], [0.04, -1.05], [0.04, -0.405], [0.062, -0.405, 0.006], [0.062, -0.375, 0.012], [0, -0.372]], { segments: 18, steps: 1 });
  fo.add(post, M.chrome, [P[0], 0, P[1]]);
  const sp = spring({ radius: 0.074, wire: 0.012, turns: 4, length: 0.045, perTurn: S(12, 8), radial: S(6, 5) });
  fo.add(sp, M.brass, [P[0], -0.4325, P[1]]);
  return cm;
}

/* ================================================================== slider-crank linkage */

export function buildLinkage(motor, F) {
  const P = linkPose();
  const lk = motor.part('crank-linkage', {
    name: 'Crank Linkage',
    info: 'Slider-crank that turns the crank gear rotation into a 0.44 mm reciprocating stroke: crank pin, connecting rod, clevis slider in a chrome U-guide and a ribbed output rod through the front tower.',
    specs: { Stroke: '0.44 mm', Conrod: '0.31 mm centre distance', Output: 'Ribbed rod through the front tower', Mass: '0.03 g' },
    explode: ex([0, 1.8, 0], 'mid'),
  });
  const [cy0, cy1] = LINK.conrodY;

  const cap = lk.part('crank-cap', {
    name: 'Crank Pin Cap',
    info: 'Chrome socket cap and brass washer that clamp the connecting rod onto the crank pin.',
    specs: { Material: 'Chrome steel, brass washer', Head: 'dia 0.15 mm', Mass: '0.002 g' },
    explode: ex([0, 1.0, 0], 'fine'),
  });
  cap.add(ringY(0.04, 0.088, cy1, cy1 + 0.012, 0.004, 20), M.brass, [P.cx, 0, P.cz]);
  cap.add(F.cap(0.075), M.chrome, mAt([P.cx, cy1 + 0.012, P.cz], [0, 1, 0], 0.9));

  const cr = lk.part('conrod', {
    name: 'Connecting Rod',
    info: 'Steel dog-bone connecting rod with chrome bushings in both eyes; the big end rides the crank pin and the small end pivots in the slider clevis.',
    specs: { Length: '0.31 mm eye to eye', Material: 'Brushed steel, chrome bushings', Thickness: '0.05 mm', Mass: '0.002 g' },
    explode: ex([0, 0.5, 0], 'fine'),
  });
  const rod = plateY(flat(bone([P.cx, P.cz], [P.sx, 0], 0.085, 0.066, 0.04)), cy1 - cy0, { bevel: 0.01, bevelSegments: 1, steps: 2, holes: [circ(0.047, 14, P.cx, -P.cz), circ(0.037, 12, P.sx, 0)] });
  rod.translate(0, cy0, 0);
  cr.add(rod, M.steel);
  cr.add(ringY(0.04, 0.056, cy0 - 0.004, cy1 + 0.004, 0.005, 20), M.chrome, [P.cx, 0, P.cz]);
  cr.add(ringY(0.031, 0.046, cy0 - 0.004, cy1 + 0.004, 0.005, 16), M.chrome, [P.sx, 0, 0]);

  const sl = lk.part('slider', {
    name: 'Clevis Slider',
    info: 'Gunmetal C-section slider block with a rear clevis slot that holds the connecting rod end on a vertical chrome pin; it runs inside the U-guide and pushes the output rod.',
    specs: { Block: '0.21 x 0.19 x 0.24 mm', Pin: 'dia 0.06 mm chrome', Material: 'Gunmetal, chrome', Mass: '0.004 g' },
  });
  const x0 = P.sx - LINK.blockBack, x1 = P.sx + LINK.blockFront, xs = P.sx + 0.07, [by0, by1] = LINK.blockY;
  const blk = plate([[x0, by0, 0.01], [x1, by0, 0.02], [x1, by1, 0.02], [x0, by1, 0.01], [x0, cy1 + 0.02], [xs, cy1 + 0.02, 0.012], [xs, cy0 - 0.02, 0.012], [x0, cy0 - 0.02]], 0.24,
    { bevel: 0.014, bevelSegments: 1, center: true, steps: 3 });
  sl.add(blk, M.gunmetal);
  sl.add(cylY(0.03, by0 - 0.012, by1 + 0.004, 0.006, 16), M.chrome, [P.sx, 0, 0]);
  sl.add(F.cap(0.05), M.chrome, mAt([P.sx, by1 + 0.004, 0], [0, 1, 0], 1.1));
  for (const s of [-1, 1]) sl.add(F.cap(0.032), M.chrome, mAt([P.sx + 0.1, by1, s * 0.07], [0, 1, 0], s));

  const gd = lk.part('u-guide', {
    name: 'U Guide',
    info: 'Chrome U-section guide channel that keeps the slider on its line; it butts against the front tower and is clamped to it.',
    specs: { Section: 'U, 0.45 x 0.30 mm, wall 0.04 mm', Length: '0.51 mm', Material: 'Polished chrome steel', Mass: '0.004 g' },
    explode: ex([0, -0.6, 0], 'fine'),
  });
  const gx = LINK.guideX[1] - LINK.guideX[0];
  const g = plateZ([[-0.225, -0.555, 0.006], [0.225, -0.555, 0.006], [0.225, -0.26, 0.006], [0.185, -0.26, 0.004], [0.185, -0.515, 0.004], [-0.185, -0.515, 0.004], [-0.185, -0.26, 0.004], [-0.225, -0.26, 0.006]], gx,
    { bevel: 0.008, bevelSegments: 1, steps: 2 });
  g.translate(LINK.guideX[1], 0, 0);
  gd.add(g, M.chrome);

  const out = lk.part('output-rod', {
    name: 'Output Rod',
    info: 'Ribbed chrome output rod screwed into the slider front; it passes through the slot of the front tower and ends in a threaded stub with a gold stop ring.',
    specs: { Diameter: '0.10 mm, ribs to 0.12 mm', Travel: '0.44 mm', Material: 'Chrome steel, gold stop ring', Mass: '0.004 g' },
    explode: ex([0, 0.4, 0], 'fine'),
  });
  const xa = x1 - 0.004, prof = [[0, xa], [0.05, xa, 0.006], [0.05, 1.12], [0.064, 1.12, 0.006], [0.064, 1.16, 0.006], [0.05, 1.16], [0.05, 1.46]];
  const nr = 8, xr0 = 1.56, pr = 0.04;
  for (let i = 0; i < nr; i++) { const x = xr0 + i * pr; prof.push([0.05, x + 0.004], [0.06, x + 0.012, 0.004], [0.06, x + 0.028, 0.004], [0.05, x + 0.036]); }
  prof.push([0.05, 1.89], [0.036, 1.89, 0.01], [0.036, LINK.rodEnd - 0.01, 0.01], [0, LINK.rodEnd]);
  out.add(revolve(prof, { axis: 'x', segments: 20, steps: 1 }), M.chrome, [0, -0.42, 0]);
  out.add(loopX([[0.05, 1.46, 0.006], [0.074, 1.46, 0.008], [0.074, 1.52, 0.008], [0.05, 1.52, 0.006]], { segments: 24, steps: 1 }), M.gold, [0, -0.42, 0]);
  return lk;
}
