// Power core, mechanical stack along the shaft (local +X): shaft + collar + nut, end caps, five chrome rings,
// bearing stack (races, balls, cage, seals), thermal fins and the annular power board.
// Frame: node at K.core.c; axis X; theta measured from +Y towards +Z (see core-util.js).
import { THREE, M, ex, plate, box, cyl, circlePts, gearShape, sphere, torus, sweep, V3, rng, mergeGeometries, D2R } from '../kit.js';
import { C, LAY, lathe, latheOpen, tube, aroundX, atTheta, TILT_PX, TILT_NX, bolt, hexPrism, boltRing, polyHole, arcSlot } from './core-util.js';

/** Absolute axial travel (mm) of every slider in the stack; all use the same 'mid' level so the order can never cross. */
export const D = {
  capR: -3.8, cell: -3.0, ringA: -2.0, bear: -1.4, ringB: -0.4, board: 0.3, ringC: 0.9, fins: 1.4,
  ringD: 2.0, coil: 2.6, ringE: 3.2, capF: 3.9, shaft: 1.4,
};
export const X = (d, lvl = 'mid') => ex([d, 0, 0], lvl);

const rotX = (g) => g.rotateY(Math.PI / 2);   // extrusion axis Z -> +X
const tr = (x, y = 0, z = 0) => new THREE.Matrix4().makeTranslation(x, y, z);
/** Plate-plane (x, y) of the point at radius r and bee theta (deg): plate x = -r sin th, y = r cos th (see rotX). */
const plateXY = (r, th) => [-r * Math.sin(th * D2R), r * Math.cos(th * D2R)];

/* ------------------------------------------------------------------ shaft, collar, nut */
function shaftGeo() {
  const p = [[0, -3.6], [0.25, -3.6, 0.02], [0.34, -3.5, 0.03], [0.34, -3.15]];
  p.push([0.29, -3.15, 0.012], [0.29, -3.09, 0.012], [0.34, -3.09], [0.34, -1.55]);        // rear snap-ring groove
  p.push([0.30, -1.55, 0.01], [0.30, -1.5, 0.01], [0.34, -1.5], [0.34, 2.05]);              // mid groove
  p.push([0.30, 2.05, 0.01], [0.30, 2.1, 0.01], [0.34, 2.1], [0.34, 2.78]);
  for (let k = 0; k < 12; k++) {                                                              // fine thread at the front end
    const x = 2.78 + k * 0.045;
    p.push([0.305, x + 0.004], [0.345, x + 0.0225], [0.305, x + 0.041]);
  }
  p.push([0.34, 3.34], [0.27, 3.4, 0.015], [0, 3.4]);
  return latheOpen(p, { segments: 56, steps: 2 });
}

export function buildShaft(pc) {
  const sh = pc.part('shaft', {
    name: 'Drive Shaft', explode: X(D.shaft),
    info: 'Hardened chrome-steel main shaft with keyway, snap-ring grooves and a fine thread for the retaining nut; the whole stack is clamped along it.',
    specs: { Material: '17-4PH stainless, hard chrome', Diameter: '0.68 mm', Length: '7.0 mm', Mass: '0.18 g' },
  });
  sh.add(shaftGeo(), M.chrome);
  // key sitting in the rear keyway
  sh.add(box(0.3, 0.07, 0.1, 0.012), M.steel, [-3.38, 0.335, 0]);
  sh.add(box(0.36, 0.018, 0.14, 0.005), M.gunmetalDark, [-3.38, 0.311, 0]);

  const col = sh.part('collar', {
    name: 'Knurled Collar', explode: X(3.0),
    info: 'Knurled steel locking collar with a chrome flange and a hex set screw; seats in the dish of the front end cap.',
    specs: { Material: 'Knurled stainless steel', Mass: '0.05 g' },
  });
  col.add(lathe([[0.345, 3.04, .015], [0.60, 3.04, .025], [0.60, 3.17, .025], [0.345, 3.17, .015]]), M.knurled);
  col.add(lathe([[0.345, 3.005, .01], [0.68, 3.005, .015], [0.68, 3.04, .015], [0.345, 3.04, .01]]), M.chrome);
  col.add(bolt(0.085, 0.07), M.steel, atTheta(3.105, 0.595, 0));
  col.add(bolt(0.085, 0.07), M.steel, atTheta(3.105, 0.595, 90));

  const nut = sh.part('retaining-nut', {
    name: 'Retaining Nut', explode: X(4.4),
    info: 'Hex retaining nut with a lock washer: it clamps the front end cap, collar and ring stack onto the shaft.',
    specs: { Material: 'A4 stainless', Thread: 'M0.7 fine', Mass: '0.03 g' },
  });
  nut.add(hexPrism(0.46, 0.15, 0.335, 'x'), M.steel, [3.27, 0, 0]);
  nut.add(lathe([[0.34, 3.17, .008], [0.58, 3.17, .012], [0.58, 3.195, .008], [0.34, 3.195, .008]]), M.chrome);
  return sh;
}

/* ------------------------------------------------------------------ end caps */
/** Triangular stiffening ribs across a cap face. dir +1 faces +X, -1 faces -X; heights are measured from the face plane. */
function gussets(part, mat, { n, x, dir, r0, r1, h0, h1, w = 0.07, phase = 0 }) {
  const pts = [[-0.03 * dir, r0], [h0 * dir, r0], [h1 * dir, r1], [-0.03 * dir, r1]];
  part.addMany(plate(pts, w, { bevel: 0.012, center: true, bevelSegments: 1, steps: 2 }), mat, aroundX(n, { x, r: 0, phase }));
}

export function buildCaps(pc) {
  const rear = pc.part('end-cap-rear', {
    name: 'Rear End Cap', explode: X(D.capR),
    info: 'Flanged gunmetal end cap closing the rear of the power cell; ribbed dished face, gold inlay ring, chrome lip, bolt circles and a hub bearing the shaft.',
    specs: { Material: 'Gunmetal anodised aluminium, gold inlay', Mass: '0.22 g' },
  });
  rear.add(lathe([
    [0.38, -3.25, .02], [0.78, -3.25, .03], [0.78, -3.17, .012], [0.86, -3.15, .01],
    [1.40, -3.15, .03], [1.47, -3.25, .03], [1.70, -3.25, .05], [1.78, -3.17, .04],
    [1.78, -3.13], [1.745, -3.115], [1.78, -3.10], [1.78, -3.06], [1.745, -3.045], [1.78, -3.03], [1.78, -2.98, .02],
    [1.58, -2.98, .02], [1.58, -2.82, .03], [0.60, -2.82, .02], [0.38, -2.82, .02]]), M.gunmetalDark);
  rear.add(lathe([[1.405, -3.255, .008], [1.50, -3.255, .01], [1.50, -3.2, .008], [1.38, -3.2, .008]]), M.chrome);
  rear.add(tube(1.19, 1.21, -3.153, -3.125, .008), M.gold);                     // gold wire inlay in the dish
  rear.add(tube(1.52, 1.548, -3.262, -3.24, .006), M.gold);                     // gold ring on the lip
  gussets(rear, M.gunmetalDark, { n: 8, x: -3.15, dir: -1, r0: 0.80, r1: 1.38, h0: 0.085, h1: 0.025 });
  boltRing(rear, M.chrome, { n: 8, r: 1.08, x: -3.15, dir: -1, rb: 0.075, hb: 0.05, phase: 22.5 });
  boltRing(rear, M.chrome, { n: 12, r: 1.62, x: -3.25, dir: -1, rb: 0.045, hb: 0.03 });

  const front = pc.part('end-cap-front', {
    name: 'Front End Cap', explode: X(D.capF),
    info: 'Flanged gunmetal front cap with a ribbed dished face that cradles the shaft collar, gold inlay ring, chrome lip and socket bolts; carries the status LEDs.',
    specs: { Material: 'Gunmetal anodised aluminium, gold inlay', Mass: '0.26 g' },
  });
  front.add(lathe([
    [0.38, 2.62, .02], [1.58, 2.62, .03], [1.58, 2.88, .02], [1.78, 2.88, .02],
    [1.78, 2.935], [1.745, 2.95], [1.78, 2.965], [1.78, 3.01], [1.745, 3.025], [1.78, 3.04], [1.78, 3.08, .03],
    [1.70, 3.25, .05], [1.47, 3.25, .03], [1.40, 3.0, .03], [0.50, 3.0, .03], [0.38, 3.0, .02]]), M.gunmetalDark);
  front.add(lathe([[1.405, 3.255, .008], [1.50, 3.255, .01], [1.50, 3.2, .008], [1.38, 3.2, .008]]), M.chrome);
  front.add(tube(1.19, 1.21, 2.975, 3.003, .008), M.gold);
  front.add(tube(1.52, 1.548, 3.24, 3.262, .006), M.gold);
  gussets(front, M.gunmetalDark, { n: 8, x: 3.0, dir: 1, r0: 0.74, r1: 1.38, h0: 0.12, h1: 0.03 });
  boltRing(front, M.chrome, { n: 8, r: 1.0, x: 3.0, dir: 1, rb: 0.075, hb: 0.05, phase: 22.5 });
  boltRing(front, M.chrome, { n: 12, r: 1.62, x: 3.25, dir: 1, rb: 0.045, hb: 0.03 });
  return { rear, front };
}

/* ------------------------------------------------------------------ chrome rings */
/** Ring outline: outer = [[r, x, f?]...] along the outer surface (low x to high x); optional recessed face annulus. */
function ringLoop(x0, x1, rIn, outer, step = null) {
  const L = [[rIn, x0, .02]];
  if (step) L.push([step.r0, x0, .012], [step.r0 + .04, x0 + step.d, .012], [step.r1 - .04, x0 + step.d, .012], [step.r1, x0, .012]);
  L.push(...outer);
  if (step) L.push([step.r1, x1, .012], [step.r1 - .04, x1 - step.d, .012], [step.r0 + .04, x1 - step.d, .012], [step.r0, x1, .012]);
  L.push([rIn, x1, .02]);
  return lathe(L);
}

export function buildRings(pc) {
  const mk = (id, name, info, d, spec) => pc.part(id, { name, info, explode: X(d), specs: spec });
  const [aX0, aX1] = LAY.ringA, [bX0, bX1] = LAY.ringB, [cX0, cX1] = LAY.ringC, [dX0, dX1] = LAY.ringD, [eX0, eX1] = LAY.ringE;

  // A: retainer flange with a V-bead rim and eight kidney lightening slots (the cell glows through them)
  const a = mk('chrome-ring-a', 'Chrome Retainer Ring A',
    'Mirror-polished retainer flange closing the rear of the bearing stack: V-bead rim, hub sleeve and eight kidney slots that let the cell light through.', D.ringA,
    { Material: 'Polished stainless', Width: '0.18 mm', Mass: '0.06 g' });
  a.add(ringLoop(aX0, aX1, 1.56, [[1.86, aX0, .025], [1.86, aX0 + .05], [1.80, aX0 + .09, .01], [1.86, aX0 + .13], [1.86, aX1, .025]]), M.chrome);
  a.add(tube(0.9, 1.04, aX0, aX1, .018), M.chrome);
  const flA = new THREE.Shape(circlePts(1.60, 72).map(([x, y]) => new THREE.Vector2(x, y)));
  flA.holes.push(polyHole(1.0, 48));
  for (let k = 0; k < 8; k++) flA.holes.push(arcSlot(1.13, 1.43, 45 * k + 4, 45 * k + 41));
  a.add(rotX(plate(flA, 0.07, { bevel: 0.012, center: true, bevelSegments: 1, creaseDeg: 30 })), M.chrome, tr((aX0 + aX1) / 2));

  // B: wide ring with two black rubber inlays
  const b = mk('chrome-ring-b', 'Chrome Bearing Ring B',
    'Wide chrome ring around the front bearing: recessed faces with a bolt circle, V grooves and a black rubber damping band.', D.ringB,
    { Material: 'Polished stainless, silicone band', Width: '0.40 mm', Mass: '0.14 g' });
  b.add(ringLoop(bX0, bX1, 0.9, [
    [1.88, bX0, .03], [1.88, bX0 + .04], [1.82, bX0 + .07, .01], [1.88, bX0 + .10], [1.88, bX0 + .12],
    [1.84, bX0 + .13], [1.84, bX0 + .27], [1.88, bX0 + .28], [1.88, bX0 + .30], [1.82, bX0 + .33, .01], [1.88, bX0 + .36], [1.88, bX1, .03]],
  { r0: 1.18, r1: 1.60, d: 0.03 }), M.chrome);
  b.add(tube(1.80, 1.868, bX0 + .14, bX0 + .26, .012), M.rubber);
  boltRing(b, M.chrome, { n: 10, r: 1.39, x: bX1 - 0.03, dir: 1, rb: 0.05, hb: 0.03, phase: 9 });
  boltRing(b, M.chrome, { n: 10, r: 1.39, x: bX0 + 0.03, dir: -1, rb: 0.05, hb: 0.03, phase: 27 });

  // C: ridged knurl ring
  const c = mk('chrome-ring-c', 'Chrome Knurl Ring C',
    'Ridged chrome clamp ring with a fine groove pattern and a socket-screw circle; locks the thermal fin pack against the power board.', D.ringC,
    { Material: 'Polished stainless', Width: '0.26 mm', Mass: '0.09 g' });
  const cs = [[1.84, cX0, .02]];
  for (let k = 0; k < 6; k++) { const x = cX0 + .03 + k * .033; cs.push([1.84, x]); cs.push([1.795, x + .0165]); cs.push([1.84, x + .033]); }
  cs.push([1.84, cX1, .02]);
  c.add(ringLoop(cX0, cX1, 0.9, cs, { r0: 1.2, r1: 1.62, d: 0.025 }), M.chrome);
  boltRing(c, M.chrome, { n: 12, r: 1.41, x: cX1 - 0.025, dir: 1, rb: 0.05, hb: 0.03, phase: 15 });

  // D: conical flange with gold inlay
  const d = mk('chrome-ring-d', 'Chrome Flange Ring D',
    'Conical chrome flange with a gold inlay band; separates the fin pack from the wireless charging coil.', D.ringD,
    { Material: 'Polished stainless, gold inlay', Width: '0.22 mm', Mass: '0.08 g' });
  d.add(ringLoop(dX0, dX1, 0.9, [[1.80, dX0, .015], [1.88, dX0 + .08, .02], [1.88, dX1 - .06, .02], [1.84, dX1, .015]], { r0: 1.15, r1: 1.62, d: 0.025 }), M.chrome);
  d.add(tube(1.862, 1.90, dX0 + .105, dX1 - .085, .01), M.gold);

  // E: castellated lock ring
  const e = mk('chrome-ring-e', 'Chrome Castellated Ring E',
    'Narrow castellated lock ring between the charging coil and the front end cap: 32 notches take a spanner, a stepped lip seats the cap.', D.ringE,
    { Material: 'Polished stainless', Width: '0.14 mm', Mass: '0.05 g' });
  const sE = gearShape({ teeth: 32, rOut: 1.84, rRoot: 1.74, tip: 0.30, root: 0.42 });
  sE.holes.push(polyHole(1.30, 56));
  for (let k = 0; k < 16; k++) { const a = (k + 0.5) / 16 * Math.PI * 2; sE.holes.push(polyHole(0.06, 8, Math.cos(a) * 1.52, Math.sin(a) * 1.52)); }
  e.add(rotX(plate(sE, 0.08, { bevel: 0.012, center: true, bevelSegments: 1, creaseDeg: 30 })), M.chrome, tr(eX0 + 0.04));
  e.add(lathe([[0.9, eX0, .02], [1.34, eX0, .01], [1.34, eX0 + .08], [1.72, eX0 + .08, .01], [1.72, eX1, .02], [0.9, eX1, .02]]), M.chrome);
  return [a, b, c, d, e];
}

/* ------------------------------------------------------------------ bearing stack */
export function buildBearings(pc) {
  const st = pc.part('bearing-stack', {
    name: 'Bearing Stack', explode: X(D.bear),
    info: 'Two deep-groove micro ball bearings with a spacer sleeve: the stack carries the shaft and keeps the rotor concentric inside the housing.',
    specs: { Type: 'Deep-groove ball, 2 rows', Bore: '0.76 mm', Mass: '0.30 g' },
  });
  const [x0, x1] = LAY.bear;
  const rows = [[x0, x0 + 0.44], [x1 - 0.44, x1]];
  const outer = st.part('outer-races', { name: 'Bearing Outer Races', explode: X(0, 'fine'),
    info: 'Two polished outer races with grooved raceways and a black spacer ring between them.', specs: { Material: '440C stainless', Mass: '0.12 g' } });
  const inner = st.part('inner-races', { name: 'Bearing Inner Races', explode: X(0.7, 'fine'),
    info: 'Inner races joined by a steel sleeve; the raceway grooves guide the balls around the shaft.', specs: { Material: '440C stainless', Mass: '0.09 g' } });
  const balls = st.part('balls', { name: 'Bearing Balls and Cage', explode: X(0.5, 'fine'),
    info: 'Fourteen precision steel balls per row, held at even spacing by thin brass cage rings.', specs: { Material: 'Grade-5 steel balls, brass cage', Mass: '0.05 g' } });
  const seals = st.part('seals', { name: 'Bearing Seals', explode: X(-0.4, 'fine'),
    info: 'Red and blue silicone seal rings that keep dust and pollen out of the raceways.', specs: { Material: 'Silicone', Mass: '0.01 g' } });
  const ball = sphere(0.17, { segments: 10, rings: 7 });
  rows.forEach(([xa, xb], i) => {
    const xm = (xa + xb) / 2, i0 = xa + 0.02, i1 = xb - 0.02;
    outer.add(lathe([[1.40, xa, .02], [1.74, xa, .045], [1.74, xb, .045], [1.40, xb, .02], [1.31, xb - .09, .03], [1.27, xm, .06], [1.31, xa + .09, .03]]), M.chrome);
    inner.add(lathe([[0.38, i0, .02], [0.92, i0, .03], [1.0, i0 + .06, .02], [0.96, i0 + .14, .03], [0.94, xm, .06], [0.96, i1 - .14, .03], [1.0, i1 - .06, .02], [0.92, i1, .03], [0.38, i1, .02]]), M.chrome);
    balls.addMany(ball, M.steel, aroundX(14, { x: xm, r: 1.13, phase: i * 12 }));
    balls.add(tube(1.05, 1.21, xm - 0.03, xm + 0.03, .012), M.brass);
    seals.add(tube(1.0, 1.37, xa + 0.003, xa + 0.04, .012), i === 0 ? C.redRubber : C.blueRubber);
  });
  // spacer between the rows
  const sx0 = rows[0][1], sx1 = rows[1][0];
  outer.add(tube(1.30, 1.72, sx0, sx1, .015), M.blackMatte);
  inner.add(tube(0.38, 0.92, sx0 - 0.02, sx1 + 0.02, .01), M.steel);
  return st;
}

/* ------------------------------------------------------------------ thermal fins */
export function buildFins(pc) {
  const fins = pc.part('thermal-fins', {
    name: 'Thermal Fin Pack', explode: X(D.fins),
    info: 'Seven die-cut aluminium cooling fins with kidney airflow slots on a central sleeve, clamped by socket screws; copper heat pipes thread through the pack.',
    specs: { Material: '6061 aluminium, copper pipes', Fins: '7', Mass: '0.16 g' },
  });
  // every fin shares the kidney-slot pattern; alternate fins are a little smaller so the pack reads as layered from the side
  const pipeTh = [45, 135, 225, 315];
  const mkFin = (rOut, rRoot) => {
    const sh = gearShape({ teeth: 48, rOut, rRoot, tip: 0.26, root: 0.40 });
    sh.holes.push(polyHole(0.60, 32));
    for (let k = 0; k < 8; k++) sh.holes.push(arcSlot(0.93, 1.23, 45 * k - 19, 45 * k + 19, 4, 3));
    for (const th of pipeTh) { const [px, py] = plateXY(1.38, th); sh.holes.push(polyHole(0.062, 10, px, py)); }
    return rotX(plate(sh, 0.045, { bevel: 0.01, center: true, bevelSegments: 1, creaseDeg: 28 }));
  };
  const finA = mkFin(1.76, 1.69), finB = mkFin(1.70, 1.63);
  for (let k = 0; k < 7; k++) fins.add(k % 2 ? finB : finA, C.alu, [1.25 + 0.1 * k, 0, 0]);
  fins.add(tube(0.40, 0.70, LAY.fins[0], LAY.fins[1], .02), C.alu);
  // socket screws clamp both ends of the pack (they sit in the recessed faces of rings C and D)
  boltRing(fins, M.chrome, { n: 8, r: 1.52, x: 1.25 - 0.0225, dir: -1, rb: 0.055, hb: 0.035, phase: 22.5 });
  boltRing(fins, M.chrome, { n: 8, r: 1.52, x: 1.85 + 0.0225, dir: 1, rb: 0.055, hb: 0.035, phase: 22.5 });
  // copper heat pipes thread through the pack (through-holes in every fin)
  const pipe = sweep([V3(LAY.fins[0] + 0.005, 0, 0), V3(LAY.fins[1] - 0.005, 0, 0)], { radius: 0.05, radial: 8, caps: true });
  for (const th of pipeTh) fins.add(pipe, C.copperPol, [0, 1.38 * Math.cos(th * D2R), 1.38 * Math.sin(th * D2R)]);
  return fins;
}

/* ------------------------------------------------------------------ power board */
/** SMD IC: body + gull-wing leads (gold) on four sides, lying in the XZ plane, +Y up. Returns [body, leads]. */
function chipGeo(w, h, pinsPerSide) {
  const body = box(w, h, w, 0.012);
  const leads = [];
  for (let s = 0; s < 4; s++) {
    for (let i = 0; i < pinsPerSide; i++) {
      const g = new THREE.BoxGeometry(0.05, 0.011, 0.02);
      g.translate(w / 2 + 0.012, -h / 2 + 0.0055, (i - (pinsPerSide - 1) / 2) * (w * 0.8 / pinsPerSide));
      g.rotateY(s * Math.PI / 2);
      leads.push(g);
    }
  }
  return [body, mergeGeometries(leads.map((g) => g.toNonIndexed()), false)];
}

export function buildBoard(pc) {
  const pb = pc.part('power-board', {
    name: 'Power Management Board', explode: X(D.board),
    info: 'Annular power-management PCB: cell balancing, charge controller and telemetry ICs, chokes, electrolytic caps and gold test pads, with two board-to-board connectors.',
    specs: { Material: 'FR4 6-layer, ENIG pads', Components: '60 SMD', Mass: '0.12 g' },
  });
  const R = rng(4242);
  const bx = 0.87;                                            // board mid plane
  const P = plateXY;
  const holes = [polyHole(0.62, 40)];
  const mount = [];
  for (let k = 0; k < 6; k++) { const th = 30 + 60 * k, [px, py] = P(1.5, th); holes.push(polyHole(0.055, 10, px, py)); mount.push(th); }
  pb.add(rotX(plate(circlePts(1.86, 96), 0.06, { holes, bevel: 0.008, center: true, bevelSegments: 1, uvScale: 0.55 })), M.pcb, [bx, 0, 0]);

  // collision-free scatter of components on both faces (side +1 = front, -1 = rear)
  const placed = { 1: [], '-1': [] };
  for (const s of [1, -1]) for (const th of mount) { const [px, py] = P(1.5, th); placed[s].push([px, py, 0.11]); }
  const spot = (side, rad, rMin, rMax) => {
    for (let t = 0; t < 80; t++) {
      const r = R.range(rMin, rMax), th = R.range(0, 360), [px, py] = P(r, th);
      const dth = Math.min(Math.abs(th - 70), Math.abs(th - 290), Math.abs(th - 70 + 360), Math.abs(th - 290 - 360));
      if (r > 1.45 && dth < 16) continue;                       // keep clear of the edge connectors
      if (placed[side].every(([qx, qy, qr]) => Math.hypot(qx - px, qy - py) > qr + rad + 0.03)) { placed[side].push([px, py, rad]); return [r, th]; }
    }
    return null;
  };
  const put = (geo, mat, side, h, rad, rMin, rMax, spin = true) => {
    const s = spot(side, rad, rMin, rMax);
    if (!s) return;
    const m = atTheta(bx + side * (0.03 + h / 2), s[0], s[1], { tilt: side > 0 ? TILT_PX : TILT_NX });
    if (spin) m.multiply(new THREE.Matrix4().makeRotationY(R.pick([0, Math.PI / 2])));
    pb.add(geo, mat, m);
  };
  const [qBody, qLeads] = chipGeo(0.30, 0.04, 6);
  const [qBodyS, qLeadsS] = chipGeo(0.20, 0.036, 5);
  for (const [side, n] of [[1, 3], [-1, 2]]) {
    for (let i = 0; i < n; i++) {
      const s = spot(side, 0.24, 0.95, 1.5);
      if (!s) continue;
      const m = atTheta(bx + side * (0.03 + 0.02), s[0], s[1], { tilt: side > 0 ? TILT_PX : TILT_NX });
      m.multiply(new THREE.Matrix4().makeRotationY(R.range(0, Math.PI * 2)));
      pb.add(qBody, M.blackMatte, m); pb.add(qLeads, M.gold, m);
    }
    for (let i = 0; i < 2; i++) {
      const s = spot(side, 0.17, 0.95, 1.55);
      if (!s) continue;
      const m = atTheta(bx + side * (0.03 + 0.018), s[0], s[1], { tilt: side > 0 ? TILT_PX : TILT_NX });
      m.multiply(new THREE.Matrix4().makeRotationY(R.range(0, Math.PI * 2)));
      pb.add(qBodyS, M.blackMatte, m); pb.add(qLeadsS, M.gold, m);
    }
  }
  const can = cyl(0.085, 0.11, { bevel: 0.015, segments: 14 }), canTop = cyl(0.062, 0.012, { bevel: 0.004, segments: 12 });
  for (const [side, n] of [[1, 4], [-1, 2]]) {
    for (let i = 0; i < n; i++) {
      const s = spot(side, 0.11, 0.85, 1.6);
      if (!s) continue;
      pb.add(can, M.blackMatte, atTheta(bx + side * (0.03 + 0.055), s[0], s[1], { tilt: side > 0 ? TILT_PX : TILT_NX }));
      pb.add(canTop, M.gold, atTheta(bx + side * (0.03 + 0.11), s[0], s[1], { tilt: side > 0 ? TILT_PX : TILT_NX }));
    }
  }
  const choke = torus(0.07, 0.034, { radial: 8, tubular: 20 }).rotateX(Math.PI / 2);
  for (const [side, n] of [[1, 2], [-1, 2]]) for (let i = 0; i < n; i++) put(choke, M.blackMatte, side, 0.07, 0.12, 0.9, 1.55, false);
  const smd = new THREE.BoxGeometry(0.075, 0.03, 0.04);
  for (const [side, n] of [[1, 24], [-1, 20]]) for (let i = 0; i < n; i++) put(smd, M.blackMatte, side, 0.03, 0.05, 0.85, 1.62);
  const tp = cyl(0.028, 0.008, { bevel: 0.003, segments: 8 });
  for (const [side, n] of [[1, 16], [-1, 10]]) for (let i = 0; i < n; i++) put(tp, M.gold, side, 0.008, 0.035, 0.85, 1.62, false);

  // gold annular pads around the mounting holes
  const padRing = tube(0.058, 0.098, -0.0035, 0.0035, 0.002, { segments: 10 });
  for (const th of mount) for (const s of [1, -1]) pb.add(padRing, M.gold, tr(bx + s * 0.0305, 1.5 * Math.cos(th * D2R), 1.5 * Math.sin(th * D2R)));
  // gold edge pads
  const pad = new THREE.BoxGeometry(0.05, 0.004, 0.1);
  for (const s of [1, -1]) pb.addMany(pad, M.gold, aroundX(36, { x: bx + s * 0.031, r: 1.7, tilt: s > 0 ? TILT_PX : TILT_NX }));
  // two edge connectors
  for (const th of [-70, 70]) {
    pb.add(box(0.14, 0.16, 0.30, 0.012), M.blackMatte, atTheta(bx, 1.78, th, { tilt: TILT_PX }));
    pb.addMany(new THREE.BoxGeometry(0.02, 0.05, 0.02), M.gold, [-0.1, -0.05, 0, 0.05, 0.1].map((o) => {
      const m = atTheta(bx, 1.858, th, { tilt: TILT_PX }); m.multiply(new THREE.Matrix4().makeTranslation(0, 0, o)); return m;
    }));
  }
  return pb;
}
