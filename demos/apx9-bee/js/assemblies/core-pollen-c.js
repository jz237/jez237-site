// Pollination module, drive train and mounting hardware: drive motor (end bell, can with winding, stator, shaft), the mounting
// arms and the golden pogo pegs. Frame: node at K.pollination.c, axis X, brush toward +X; theta from +Y towards +Z (core-util.js).
import { THREE, M, ex, S, plate, rectPts, circlePts, cyl, box, spring, axisTo, revolve } from '../kit.js';
import { lathe, latheOpen, tube, aroundX, atTheta, bolt, boltRing, hexPrism, polyHole, arcSlot } from './core-util.js';

const X = (d, lvl = 'mid') => ex([d, 0, 0], lvl);
const tr = (x, y = 0, z = 0) => new THREE.Matrix4().makeTranslation(x, y, z);
const rectAt = (w, h, r, cx, cy) => rectPts(w, h, r).map(([x, y, rr]) => [x + cx, y + cy, rr]);
const rotX = (g) => g.rotateY(Math.PI / 2);                      // plate extrusion Z -> +X (plate x -> -z, plate y -> y)
const flatY = (g) => g.rotateX(-Math.PI / 2);                    // plate extrusion Z -> +Y (plate y -> -z)
const ROT_PZ = new THREE.Matrix4().makeRotationX(Math.PI / 2);    // item +Y -> +Z
const ROT_NZ = new THREE.Matrix4().makeRotationX(-Math.PI / 2);   // item +Y -> -Z

/* ------------------------------------------------------------------ drive motor */
export function buildMotor(pm) {
  const m = pm.part('drive-motor', {
    name: 'Drive Motor', explode: X(-3.6),
    info: 'Brushless inrunner on the drum axis: slotted end bell, finned can with a copper winding band, a twelve-coil stator and one polished shaft driving auger, vanes and brush.',
    specs: { Material: 'Gunmetal aluminium, copper windings, stainless shaft', Power: '85 mW', Mass: '0.07 g' },
  });
  motorBell(m);
  motorCan(m);
  motorStator(m);
  motorShaft(m);
}

/** Rear end bell: kidney-slotted plate, raised rim, bearing hub with chrome cap, bolt circle and the radial hose port. */
function motorBell(m) {
  const b = m.part('motor-end-bell', {
    name: 'Motor End Bell', explode: ex([-1.0, 0, 0], 'fine'),
    info: 'Machined rear end bell: six kidney vent slots, a raised rim, a bearing hub under a chrome cap, a bolt circle to the can and the radial feed port for the motor hose.',
    specs: { Material: 'Gunmetal aluminium, stainless fasteners', Mass: '0.012 g' },
  });
  const sh = new THREE.Shape(circlePts(1.72, 72).map(([x, y]) => new THREE.Vector2(x, y)));
  sh.holes.push(polyHole(0.46, 32));
  for (let k = 0; k < 6; k++) sh.holes.push(arcSlot(0.70, 1.14, 60 * k + 8, 60 * k + 52, 7, 5));
  b.add(rotX(plate(sh, 0.10, { bevel: 0.014, center: true, bevelSegments: 1, creaseDeg: 30 })), M.gunmetal, tr(-2.90));
  b.add(tube(1.60, 1.72, -2.99, -2.85, 0.022, { segments: 72 }), M.brushed);                       // raised rim
  b.add(lathe([[0.36, -3.0, .02], [0.62, -3.0, .03], [0.62, -2.85, .02], [0.36, -2.85, .02]], { segments: 40 }), M.brushed);      // bearing hub
  b.add(latheOpen([[0, -3.05], [0.24, -3.05, .04], [0.34, -3.01, .02], [0.34, -2.95], [0, -2.95]], { segments: 36 }), M.chrome);   // cap
  boltRing(b, M.chrome, { n: 6, r: 0.49, x: -3.0, dir: -1, rb: 0.045, hb: 0.03, phase: 30 });
  boltRing(b, M.chrome, { n: 8, r: 1.43, x: -2.95, dir: -1, rb: 0.07, hb: 0.05, phase: 22.5 });
  // radial feed port (the motor hose clips on here) with a hex collar
  const th = -16.6;
  b.add(cyl(0.10, 0.20, { bevel: 0.02, segments: 16 }), M.gunmetal, atTheta(-2.91, 1.73, th));
  b.add(hexPrism(0.15, 0.04, 0, 'y'), M.gunmetal, atTheta(-2.91, 1.77, th));
}

/** Finned can: recessed rear face, flange ring, axial cooling fins and a helically wound copper band. */
function motorCan(m) {
  const c = m.part('motor-can', {
    name: 'Motor Can',
    info: 'Gunmetal motor can with a recessed rear face, a bolted flange ring, twelve axial cooling fins and a copper band of tightly wound magnet wire.',
    specs: { Material: 'Gunmetal aluminium, enamelled copper wire', Turns: '12', Mass: '0.032 g' },
  });
  c.add(latheOpen([[0, -2.74], [1.10, -2.74, .02], [1.10, -2.88], [1.72, -2.88, .02], [1.72, -2.78, .02], [1.24, -2.78, .03],
    [1.24, -2.04, .02], [1.12, -2.04], [1.12, -1.94, .02], [0.52, -1.94, .03], [0.52, -1.82, .02], [0, -1.82]], { segments: 64 }), M.gunmetal);
  c.add(tube(1.22, 1.38, -2.50, -2.45, 0.01, { segments: 56 }), M.gunmetal);                       // winding retainer ring
  c.addMany(box(0.30, 0.13, 0.04, 0.008), M.gunmetal, aroundX(12, { x: -2.64, r: 1.295, phase: 15 }));   // cooling fins
  // winding: a copper core under a single helix of wire
  c.add(lathe([[1.22, -2.45, .01], [1.292, -2.45, .01], [1.292, -2.03], [1.22, -2.03]], { segments: 56 }), M.copper);
  c.add(axisTo(spring({ radius: 1.30, wire: 0.0165, turns: 12, length: 0.40, perTurn: S(36, 20), radial: 4 }), 'x'), M.copper, tr(-2.24));
  // fastener circle on the flange ring (cap screws seen from the front)
  boltRing(c, M.gunmetal, { n: 8, r: 1.43, x: -2.78, dir: 1, rb: 0.06, hb: 0.04, phase: 22.5 });
}

/** Twelve laminated teeth with copper coils on the front face of the can. */
function motorStator(m) {
  const s = m.part('motor-stator', {
    name: 'Motor Stator', explode: ex([0.8, 0, 0], 'fine'),
    info: 'Twelve laminated stator teeth, each wound with a copper coil, ring the shaft hub on the front face of the can; switching them in turn spins the rotor.',
    specs: { Material: 'Silicon-steel laminations, copper windings', Poles: '12', Mass: '0.014 g' },
  });
  s.addMany(box(0.12, 0.50, 0.13, 0.012), M.gunmetal, aroundX(12, { x: -1.88, r: 0.85 }));              // teeth
  s.addMany(box(0.12, 0.07, 0.34, 0.012), M.gunmetal, aroundX(12, { x: -1.88, r: 1.085 }));              // pole shoes
  s.addMany(box(0.16, 0.34, 0.26, 0.045), M.copper, aroundX(12, { x: -1.885, r: 0.80 }));                // coils
  s.add(tube(0.52, 0.60, -1.94, -1.84, 0.012, { segments: 40 }), M.gunmetal);                             // inner retaining ring
}

/** Polished shaft with a brass set-screw collar and two snap-ring grooves. */
function motorShaft(m) {
  const s = m.part('motor-shaft', {
    name: 'Motor Shaft', explode: ex([0.8, 0, 0], 'fine'),
    info: 'Polished stainless drive shaft with snap-ring grooves and a brass set-screw collar; it runs forward through the chamber and carries the auger, vanes and brush.',
    specs: { Material: 'Ground stainless steel, brass collar', Diameter: '0.24 mm', Mass: '0.006 g' },
  });
  const p = [[0, -2.30], [0.12, -2.30, .012], [0.12, -2.00], [0.10, -2.00], [0.10, -1.96], [0.12, -1.96], [0.12, 0.60], [0.10, 0.60], [0.10, 0.64], [0.12, 0.64],
    [0.12, 0.88], [0.20, 0.88, .012], [0.20, 0.97, .012], [0, 0.97]];
  s.add(latheOpen(p, { segments: 24 }), M.chrome);
  s.add(lathe([[0.115, -1.76, .01], [0.20, -1.76, .015], [0.20, -1.60, .015], [0.115, -1.60, .01]], { segments: 28 }), M.brass);
  s.add(bolt(0.045, 0.04), M.chrome, atTheta(-1.68, 0.20, 90));
}

/* ------------------------------------------------------------------ mounting arms */
export const PEG_X = [-1.0, 0.7];
const ARM_Z = 1.12;                  // centre of the arm web (|z|)
export const ARM_TOP = 2.88;         // top face of the flange: the pegs stand on its bosses
const WEB_TOP = ARM_TOP - 0.08;
const OUTLINE = [[-1.25, 1.75, .07], [0.85, 1.75, .07], [1.12, 2.30, .10], [1.12, WEB_TOP, .05], [-1.45, WEB_TOP, .05], [-1.45, 2.30, .10]];
const WIN_X = [-0.85, -0.18, 0.50];

export function buildArms(pm) {
  const grp = pm.part('mounting-arms', {
    name: 'Mounting Arms',
    info: 'Pair of yellow T-section side brackets that lift the pollination module into the thorax cradle; each carries two golden pogo pegs on a bossed top flange.',
  });
  const web = plate(OUTLINE, 0.10, { holes: WIN_X.map((x) => rectAt(0.46, 0.34, 0.07, x, 2.245)), bevel: 0.012, bevelSegments: 1, center: true });
  const rim = plate(OUTLINE, 0.10, { holes: [rectAt(2.00, 0.63, 0.10, -0.18, 2.245)], bevel: 0.012, bevelSegments: 1, center: true });
  const rib = box(0.06, 0.63, 0.08, 0.008);
  const pad = cyl(0.27, 0.07, { bevel: 0.02, segments: 28, y0: 0 });
  const ring = cyl(0.19, 0.02, { rIn: 0.115, bevel: 0.005, segments: 24, y0: 0 });
  const post = cyl(0.06, 0.10, { bevel: 0.01, segments: 10, y0: 0 });
  const bolts = [[-0.77, 2.68], [0.385, 2.68], [-1.31, 2.25], [0.96, 2.25], [-0.9, 1.84], [-0.1, 1.84], [0.5, 1.84]];
  for (const [id, name, s] of [['arm-r', 'Mounting Arm, Right', 1], ['arm-l', 'Mounting Arm, Left', -1]]) {
    const a = grp.part(id, {
      name, explode: ex([0, 4.6, 0.9 * s], 'mid'),
      info: `${s > 0 ? 'Right' : 'Left'} yellow mounting arm: a pocketed web with three windows under a bossed top flange, braced by gussets and bolted to the frame.`,
      specs: { Material: 'Clear-coated aluminium, stainless fasteners', Mass: '0.008 g' },
    });
    a.add(web, M.yellow, tr(0, 0, ARM_Z * s));
    a.add(rim, M.yellow, tr(0, 0, (ARM_Z + 0.10) * s));
    for (const x of [-0.515, 0.16]) a.add(rib, M.yellow, tr(x, 2.245, (ARM_Z + 0.09) * s));
    // top flange (overhangs both sides of the web, standing on spacer posts over the frame side plate)
    a.add(flatY(plate(rectAt(2.57, 0.75, 0.08, -0.165, -1.175 * s), 0.08, { bevel: 0.012, bevelSegments: 1, center: true })), M.yellow, tr(0, ARM_TOP - 0.04, 0));
    for (const x of [-1.2, -0.2, 0.9]) a.add(post, M.blackMatte, tr(x, 2.71, 0.84 * s));
    // three gussets under the outer overhang
    for (const [x, yb] of [[-1.33, 2.50], [-0.2, 2.56], [0.97, 2.50]]) {
      const g = rotX(plate([[0, yb], [0, WEB_TOP], [-0.26 * s, WEB_TOP]], 0.06, { bevel: 0.008, bevelSegments: 1, center: true }));
      a.add(g, M.yellow, tr(x, 0, (ARM_Z + 0.15) * s));
    }
    for (const x of PEG_X) {
      a.add(pad, M.yellowDeep, tr(x, ARM_TOP, ARM_Z * s));
      a.add(ring, M.blackMatte, tr(x, ARM_TOP + 0.07, ARM_Z * s));
    }
    const out = ARM_Z + 0.15;
    for (const [x, y] of bolts) a.add(bolt(0.05, 0.035), M.blackMatte, tr(x, y, out * s).multiply(s > 0 ? ROT_PZ : ROT_NZ));
  }
}

/* ------------------------------------------------------------------ golden pogo pegs */
export function buildPegs(pm) {
  const grp = pm.part('golden-pegs', {
    name: 'Golden Pegs',
    info: 'Two pairs of gold-plated spring-loaded pogo pegs: brass nut, ground barrel, black coil spring and a domed plunger that seats in the thorax pollination cradle.',
  });
  const base = ARM_TOP + 0.07;
  const o = { segments: 22, steps: 2 };
  const barrel = revolve([[0, 0.07], [0.115, 0.07, .008], [0.115, 0.11], [0.095, 0.115], [0.095, 0.135], [0.115, 0.14], [0.115, 0.30, .01], [0.095, 0.305], [0.095, 0.31], [0, 0.31]], o);
  const plunger = revolve([[0, 0.53], [0.115, 0.53, .008], [0.115, 0.57, .006], [0.075, 0.575], [0.075, 0.67], [0.058, 0.70, .02], [0.03, 0.725, .02], [0, 0.73]], o);
  const coil = spring({ radius: 0.087, wire: 0.02, turns: 6, length: 0.22, perTurn: S(10, 6), radial: 4 });
  const rod = cyl(0.058, 0.24, { segments: 10, y0: 0 });
  const nut = hexPrism(0.17, 0.07, 0, 'y');
  for (const [id, name, s] of [['peg-r', 'Golden Pegs, Right', 1], ['peg-l', 'Golden Pegs, Left', -1]]) {
    const p = grp.part(id, {
      name, explode: ex([0, 5.6, 0.9 * s], 'mid'),
      info: `Pair of ${s > 0 ? 'right' : 'left'} gold-plated pogo pegs with black coil springs and brass nuts; they seat in the thorax pollination cradle.`,
      specs: { Material: 'Gold-plated brass, spring steel', Stroke: '0.08 mm', Mass: '0.005 g' },
    });
    for (const x of PEG_X) {
      const at = tr(x, base, ARM_Z * s);
      p.add(nut, M.brass, tr(x, base + 0.035, ARM_Z * s));
      p.add(barrel, M.gold, at);
      p.add(plunger, M.gold, at);
      p.add(rod, M.blackMatte, tr(x, base + 0.30, ARM_Z * s));
      p.add(coil, M.blackMatte, tr(x, base + 0.42, ARM_Z * s));
    }
  }
}
