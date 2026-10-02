// APX-9 legs: hip assembly. coxa-shell (yaw bearing flange + drum + yellow sleeve, starts exactly at the hip point H)
// and rotary-servo (the hip pitch servo at J1: chrome ring, stepped disc, gold ring, hub, bolt circle, cable gland).
// servoStack() is shared with the knee servo.
import { M, ex, revolve, plate, gearShape, cyl } from '../kit.js';
import { THREE, V3, hingeFrm, grooves, boltCircle, once, screwOn } from './legs-core.js';
import { ventedSleeve } from './legs-panels.js';

const PI = Math.PI;

/** Chrome-ringed servo output stack. F: Frm whose origin lies on the mounting plane with +Y pointing away from the limb. */
export function servoStack(part, F, o = {}) {
  const R = o.R ?? 1, side = o.side ?? 1, teeth = o.teeth ?? 44, bolts = o.bolts ?? 6;
  const seg = 40, k = (x) => x * R;
  const key = `${R}|${teeth}`;
  // black housing flange + channel floor
  part.add(once(`sv-base|${key}`, () => revolve([[0, -0.05], [k(1.03), -0.05, 0.02], [k(1.03), 0.12, 0.03], [k(0.95), 0.16, 0.02], [k(0.8), 0.16], [k(0.8), 0.3], [0, 0.3]], { segments: seg, steps: 2 })), M.black, F.m);
  // knurled chrome ring
  part.add(once(`sv-ring|${key}`, () => {
    const g = plate(gearShape({ teeth, rOut: R, rRoot: R * 0.955, tip: 0.3, root: 0.42, bore: R * 0.8 }), 0.26, { bevel: 0.022, center: true, bevelSegments: 1, steps: 10, creaseDeg: 45 });
    g.rotateX(-PI / 2); g.translate(0, 0.29, 0);
    return g;
  }), M.chrome, F.m);
  // inner chrome plate with fine concentric grooves
  part.add(once(`sv-plate|${key}`, () => revolve([[k(0.3), 0.3], [k(0.5), 0.3], [k(0.5), 0.44, 0.012], [k(0.45), 0.46, 0.01], [k(0.43), 0.46], [k(0.425), 0.435], [k(0.395), 0.435], [k(0.39), 0.46],
    [k(0.36), 0.46], [k(0.355), 0.44], [k(0.335), 0.44], [k(0.33), 0.46], [k(0.3), 0.46]], { segments: seg, steps: 1 })), M.chrome, F.m);
  // gold ring and hub with a dark bore
  part.add(once(`sv-gold|${key}`, () => revolve([[k(0.5), 0.3], [k(0.58), 0.3], [k(0.58), 0.47, 0.02], [k(0.5), 0.47, 0.015]], { segments: seg, steps: 2 })), M.gold, F.m);
  part.add(once(`sv-hub|${key}`, () => revolve([[0, 0.3], [k(0.3), 0.3], [k(0.3), 0.5, 0.02], [k(0.22), 0.57, 0.04], [k(0.11), 0.57], [k(0.11), 0.5], [0, 0.5]], { segments: 32, steps: 2 })), M.gold, F.m);
  part.add(once(`sv-bore|${key}`, () => revolve([[0, 0.5], [k(0.095), 0.5], [k(0.095), 0.512], [0, 0.512]], { segments: 20, steps: 1 })), M.black, F.m);
  // bolt circle on the ring face
  boltCircle(part, M.chrome, F.m, bolts, 0.9 * R, 0.052 * Math.sqrt(R), PI / bolts, 0.415);
  // cable gland on the rim (points toward the hip)
  if (o.gland !== false) {
    part.add(once('sv-gland', () => cyl(0.115, 0.36, { axis: 'x', bevel: 0.03, segments: 16, steps: 1 })), M.black, F.at(side * (R + 0.12), 0.06, 0));
    part.add(once('sv-nut', () => cyl(0.15, 0.09, { axis: 'x', bevel: 0.02, segments: 16, steps: 1 })), M.gold, F.at(side * (R + 0.02), 0.06, 0));
  }
  return { gland: F.pt(side * (R + 0.3), 0.06, 0), glandDir: F.dir(side, 0, 0).normalize() };
}

/** Hip bearing flange on the thorax hip boss, drum and yellow shoulder sleeve. */
function coxaShell(ctx, L, top) {
  const t = L.p.title, C = L.coxa;
  const part = top.part('coxa-shell', {
    name: `${t} Hip Coxa Shell`, tag: 'shell',
    info: 'Hip yaw housing: knurled chrome bearing flange, black drum under a two-part vented yellow armour sleeve with hinge pins and cap screws, chrome retaining rings and a grooved lower collar.',
    explode: ex(L.N.clone().multiplyScalar(-2.3), 'mid'),
  });
  // chrome bearing flange (inner face on the hip point): plain base disc, knurled step and an eight-screw bolt circle
  part.add(once('cx-flange', () => revolve([[0.68, 0], [1.14, 0, 0.025], [1.14, 0.1, 0.02], [0.68, 0.1]], { segments: 48, steps: 2 })), M.chrome, C.m);
  part.add(once('cx-knurl', () => {
    const g = plate(gearShape({ teeth: 40, rOut: 1.02, rRoot: 0.97, tip: 0.3, root: 0.42, bore: 0.7 }), 0.14, { bevel: 0.018, center: true, bevelSegments: 1, steps: 8, creaseDeg: 45 });
    g.rotateX(-PI / 2); g.translate(0, 0.17, 0);
    return g;
  }), M.chrome, C.m);
  boltCircle(part, M.chrome, C.m, 8, 0.84, 0.062, PI / 8, 0.236);
  // black drum: slim core under the sleeve, grooved collar below it, domed end that closes over the pitch hinge
  const prof = [[0, 0.1], [0.74, 0.1], [0.76, 0.3], [0.76, 1.2], [0.8, 1.23], ...grooves(0.8, 1.25, 1.52, 2, 0.07, 0.04, 0.015), [0.78, 1.5, 0.1], [0.52, 1.66, 0.12], [0, 1.7]];
  part.add(once('cx-drum', () => revolve(prof, { segments: 40, steps: 2 })), M.black, C.m);
  // black gasket and chrome retaining rings above and below the sleeve
  part.add(once('cx-seal', () => cyl(0.88, 0.1, { rIn: 0.74, bevel: 0.03, segments: 40, y0: 0.23, steps: 1 })), M.black, C.m);
  part.add(once('cx-ringA', () => cyl(0.97, 0.1, { rIn: 0.74, bevel: 0.026, segments: 44, y0: 0.33, steps: 1 })), M.chrome, C.m);
  part.add(once('cx-ringB', () => cyl(0.95, 0.1, { rIn: 0.74, bevel: 0.026, segments: 44, y0: 1.13, steps: 1 })), M.chrome, C.m);
  // two-part yellow armour sleeve (hinged at the flanks) with five vent slots per half over the black drum, a screw above each slot
  const rIn = 0.77, rOut = 0.9, y0 = 0.43, y1 = 1.13;
  const slotA = [-1.2, -0.6, 0, 0.6, 1.2];
  const cuts = [{ a: PI / 2, hw: 0.075 }, { a: -PI / 2, hw: 0.075 }];
  for (const a0 of [0, PI]) for (const da of slotA) cuts.push({ a: a0 + da, hw: 0.085, v0: 0.58, v1: 0.92 });
  part.add(once('cx-sleeve', () => ventedSleeve({ rOut, rIn, y0, y1, cuts })), M.yellow, C.m);
  for (const a0 of [0, PI]) {
    for (const da of slotA) {
      const a = a0 + da;
      screwOn(part, M.chrome, C, V3((rOut - 0.005) * Math.sin(a), 1.02, (rOut - 0.005) * Math.cos(a)), V3(Math.sin(a), 0, Math.cos(a)), 0.05, a * 7);
    }
  }
  // hinge pins running in the two seams
  for (const sx of [-1, 1]) part.add(once('cx-pin', () => cyl(0.045, 0.7, { bevel: 0.012, segments: 8, y0: 0.43, steps: 1 })), M.chrome, C.at(sx * 0.835, 0, 0));
  return part;
}

/** Hip pitch servo at J1: chrome ring / stepped disc / gold hub on the camera-facing flank of the femur. */
function rotaryServo(ctx, L, top) {
  const t = L.p.title, side = L.hipSide;
  const R = L.p.servoR ?? 1.0;
  const plane = L.hipPlane;
  const face = L.femur.s.clone().multiplyScalar(side);
  const F = hingeFrm(L.J1.clone().addScaledVector(face, plane), L.femur.s, L.nOut, side);
  L.hipF = F;
  const part = top.part('rotary-servo', {
    name: `${t} Hip Rotary Servo`,
    info: 'Hip pitch actuator: knurled chrome ring with a six-bolt circle, stepped output disc, gold ring and hub, and a cable gland toward the hip.',
    specs: { Material: 'Chrome-plated steel, gold anodised hub', Function: 'Femur pitch drive' },
    explode: ex(face.clone().multiplyScalar(3.4), 'mid'),
  });
  const g = servoStack(part, F, { R, side });
  L.hipGland = g;
  return part;
}

export function buildHip(ctx, L, top) {
  L.hipPlane = L.podF.at(0.05).rx + 0.07;
  coxaShell(ctx, L, top);
  rotaryServo(ctx, L, top);
}
