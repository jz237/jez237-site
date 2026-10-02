// Pollination module, interior and mounting hardware: collection chamber (+ pollen load), distribution vanes, drive motor,
// pollen sensor (+ lens), black block frame, mounting arms with golden pegs and the corrugated hoses.
// Frame: node at K.pollination.c, axis X, brush toward +X; theta from +Y towards +Z (see core-util.js).
import { THREE, M, ex, V3, S, D2R, rng, plate, rectPts, circlePts, slotHoles, spring, sweep, cyl, box, sphere, torus, axisTo, revolve } from '../kit.js';
import { C, PL, drumR, lathe, latheOpen, tube, lathePart, aroundX, atTheta, bolt, boltRing, instanced, ghostMesh, alignY } from './core-util.js';
import { buildMotor, buildArms, buildPegs } from './core-pollen-c.js';

const X = (d, lvl = 'mid') => ex([d, 0, 0], lvl);
const tr = (x, y = 0, z = 0) => new THREE.Matrix4().makeTranslation(x, y, z);
const rectAt = (w, h, r, cx, cy) => rectPts(w, h, r).map(([x, y, rr]) => [x + cx, y + cy, rr]);
const flatY = (g) => g.rotateX(-Math.PI / 2);           // plate extruded along Z -> slab thin in Y (shape y -> -z)
const flatX = (g) => g.rotateY(Math.PI / 2);            // plate extruded along Z -> slab thin in X (shape x -> -z)
const ROT_PZ = new THREE.Matrix4().makeRotationX(Math.PI / 2);    // item +Y -> +Z
const ROT_NZ = new THREE.Matrix4().makeRotationX(-Math.PI / 2);   // item +Y -> -Z

export function buildInterior(pm) {
  buildChamber(pm);
  buildVanes(pm);
  buildMotor(pm);
  const sensor = buildSensor(pm);
  buildFrame(pm);
  buildArms(pm);
  buildPegs(pm);
  buildHoses(pm);
  return sensor;
}

/* ------------------------------------------------------------------ collection chamber */
function buildChamber(pm) {
  const [x0, x1] = PL.chamber;                                       // -1.56 .. 1.15
  const ch = pm.part('collection-chamber', {
    name: 'Collection Chamber',
    info: 'Borosilicate collection chamber between two machined bulkheads: a brass auger on the drive shaft sweeps harvested pollen forward to the distribution vanes.',
    specs: { Material: 'Borosilicate glass, gunmetal bulkheads, brass auger', Volume: '2.8 mm3', Mass: '0.012 g' },
  });
  // rear bulkhead: shaft boss, bolt ring
  ch.add(lathe([[0.15, x0, .01], [1.32, x0, .03], [1.32, x0 + .14, .03], [0.40, x0 + .14, .02], [0.40, x0 + .26, .02], [0.15, x0 + .26, .01]], { segments: 56 }), M.gunmetal);
  boltRing(ch, M.brass, { n: 10, r: 1.12, x: x0, dir: -1, rb: 0.06, hb: 0.04 });
  // front ring with a four-spoke spider around the spindle
  ch.add(lathe([[0.80, 1.0, .01], [1.32, 1.0, .03], [1.32, x1, .03], [0.80, x1, .01]], { segments: 56 }), M.gunmetal);
  ch.add(lathe([[0.20, 1.0, .01], [0.40, 1.0, .02], [0.40, x1, .02], [0.20, x1, .01]], { segments: 28 }), M.gunmetal);
  ch.addMany(new THREE.BoxGeometry(0.10, 0.46, 0.07), M.gunmetal, aroundX(4, { x: 1.075, r: 0.60, phase: 45 }));
  // three retaining bands round the glass
  for (const x of [-0.95, -0.05, 0.85]) ch.add(tube(1.27, 1.36, x - 0.05, x + 0.05, 0.014, { segments: 56 }), M.gunmetal);
  // the glass itself (not pickable)
  ghostMesh(ch, tube(1.22, 1.28, x0 + .14, 1.0, 0, { segments: 64 }), C.chamberGlass);

  // brass auger: core tube, helical flight and six struts tying them together
  const xa = x0 + 0.26, xb = 1.0, L = 2.2, xs = (xa + xb) / 2 - 0.1, turns = 6;
  ch.add(tube(0.15, 0.24, xa, xb, 0.01, { segments: 28 }), M.brass);
  ch.add(axisTo(spring({ radius: 0.62, wire: 0.06, turns, length: L, perTurn: S(16, 10), radial: 6 }), 'x'), M.brass, tr(xs));
  const strut = new THREE.BoxGeometry(0.045, 0.40, 0.045);
  for (const t of [0.04, 0.2, 0.4, 0.6, 0.8, 0.96]) {
    ch.add(strut, M.brass, atTheta(xs - L / 2 + t * L, 0.43, 180 - t * turns * 360));
  }

  buildLoad(ch);
}

/** Pollen grains lying in the bottom of the chamber (separate leaf so it can drop out of the glass). */
function buildLoad(ch) {
  const R = rng(4417);
  const pl = ch.part('pollen-load', {
    name: 'Pollen Load', explode: ex([0, -0.9, 0], 'fine'),
    info: 'Harvested pollen grains settled along the bottom of the chamber, a few drifting in the airflow around the auger.',
    specs: { Material: 'Plant pollen, 20-40 micron grains', Count: '~130', Mass: '0.004 g' },
  });
  const ms = [];
  const dummy = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();
  for (let i = 0; i < 118; i++) {                                    // settled pile
    const x = R.range(-1.15, 0.92), r = R.range(0.80, 1.12), th = 180 + R.gauss() * 32;
    const a = th * D2R, g = R.range(0.045, 0.088);
    p.set(x, r * Math.cos(a), r * Math.sin(a));
    s.set(g, g * R.range(0.85, 1.1), g);
    ms.push(dummy.clone().compose(p, q.identity(), s));
  }
  for (let i = 0; i < 24; i++) {                                     // drifting in the airflow
    const x = R.range(-1.2, 0.95), r = R.range(0.7, 1.15), th = R.range(0, 360), g = R.range(0.035, 0.06);
    const a = th * D2R;
    p.set(x, r * Math.cos(a), r * Math.sin(a));
    s.set(g, g, g);
    ms.push(dummy.clone().compose(p, q.identity(), s));
  }
  instanced(pl, sphere(1, { segments: 7, rings: 5 }), M.yellowMatte, ms);
}

/* ------------------------------------------------------------------ distribution vanes */
function buildVanes(pm) {
  const [x0, x1] = PL.vanes;                                         // 1.18 .. 1.52
  const v = pm.part('distribution-vanes', {
    name: 'Distribution Vanes', explode: X(0.9),
    info: 'Fourteen pitched titanium vanes in a shrouded rotor fling the pollen evenly over the brush; the bronze hub rides on the drive spindle.',
    specs: { Material: 'Titanium vanes, gunmetal shroud, brass bush', Vanes: '14', Mass: '0.010 g' },
  });
  v.add(lathe([[0.20, x0 + .02, .01], [0.34, x0 + .02, .03], [0.34, x1 - .02, .03], [0.20, x1 - .02, .01]], { segments: 32 }), M.gunmetalDark);
  v.add(lathe([[0.20, x0, .01], [0.27, x0, .01], [0.27, x0 + .04, .01], [0.20, x0 + .04, .01]], { segments: 24 }), M.brass);
  v.add(tube(1.275, 1.345, x0 + .02, x1 - .02, 0.02, { segments: 56 }), M.gunmetalDark);
  const blade = plate([[-0.065, 0.30, .01], [0.065, 0.30, .01], [0.165, 1.29, .035], [-0.165, 1.29, .035]], 0.03, { bevel: 0.008, bevelSegments: 1, center: true });
  const pitch = new THREE.Matrix4().makeRotationY(32 * D2R);
  v.addMany(blade, M.titanium, aroundX(14, { x: (x0 + x1) / 2, r: 0, tilt: pitch }));
}

/* ------------------------------------------------------------------ pollen sensor */
const SD = V3(Math.cos(-52 * D2R), Math.sin(-52 * D2R), 0);          // optical axis: forward and down onto the brush
const SB = V3(2.05, 2.40, 0);                                         // barrel root
const BL = 0.45;                                                      // barrel length

function buildSensor(pm) {
  const s = pm.part('pollen-sensor', {
    name: 'Pollen Sensor', explode: ex([1.4, 4.2, 0], 'mid'),
    info: 'Optical pollen analyser perched above the funnel: a tilted barrel looks down on the brush and counts grains in real time; two green LEDs show a live reading.',
    specs: { Material: 'Black anodised housing, gunmetal barrel', Sampling: '4 kHz', Mass: '0.007 g' },
  });
  s.add(box(0.66, 0.50, 0.56, 0.05), M.black, [1.75, 2.36, 0]);
  s.add(box(0.46, 0.06, 0.40, 0.012), M.gunmetal, [1.72, 2.64, 0]);
  s.add(box(0.26, 0.40, 0.44, 0.03), M.gunmetal, [1.38, 2.36, 0]);
  s.add(cyl(0.21, BL, { bevel: 0.025, segments: 32, y0: 0 }), M.gunmetal, alignY(SD, SB));
  s.add(cyl(0.235, 0.05, { bevel: 0.012, segments: 32, y0: 0 }), M.gunmetal, alignY(SD, SB.clone().addScaledVector(SD, 0.12)));
  for (const z of [-0.15, 0.15]) s.add(cyl(0.04, 0.035, { bevel: 0.01, segments: 12, y0: 0 }), M.glowGreen, [1.95, 2.665, z]);
  // side screws
  const bx = [1.55, 1.95], by = [2.22, 2.50];
  for (const x of bx) for (const y of by) {
    s.add(bolt(0.045, 0.03), M.gunmetal, new THREE.Matrix4().makeTranslation(x, y, 0.28).multiply(ROT_PZ));
    s.add(bolt(0.045, 0.03), M.gunmetal, new THREE.Matrix4().makeTranslation(x, y, -0.28).multiply(ROT_NZ));
  }

  const tip = SB.clone().addScaledVector(SD, BL);
  const lens = s.part('lens', {
    name: 'Sensor Lens', explode: ex([SD.x * 1.2, SD.y * 1.2, 0], 'fine'),
    info: 'Iridescent coated lens with a polished bezel and a cyan LED ring that illuminates the pollen it is measuring.',
    specs: { Material: 'Coated sapphire, stainless bezel', Aperture: 'f/1.4', Mass: '0.002 g' },
  });
  const at = alignY(SD, tip);
  lens.add(cyl(0.235, 0.06, { rIn: 0.15, bevel: 0.015, segments: 32, y0: 0 }), M.chrome, at);
  lens.add(revolve([[0, 0], [0.15, 0, .01], [0.15, 0.025], [0.10, 0.07, .02], [0, 0.095]], { segments: 28, steps: 3 }), M.lens, at);
  lens.add(axisTo(torus(0.19, 0.016, { radial: 8, tubular: 36 }), 'z').rotateX(0), M.glowCyan, at.clone().multiply(tr(0, 0.058, 0)));
  return s;
}

/* ------------------------------------------------------------------ black block frame */
function buildFrame(pm) {
  const f = pm.part('block-frame', {
    name: 'Block Frame', explode: ex([0, 3.8, 0], 'mid'),
    info: 'Black block frame saddled over the drum: ring-sector clamps, window plates, two instrument blocks and three tank cylinders carry the arms and the yellow marker strip.',
    specs: { Material: 'Black hard-anodised aluminium, gunmetal clamps', Mass: '0.035 g' },
  });
  // saddle clamps hugging the drum crown
  for (const [x0, x1] of [[-1.65, -1.30], [-0.15, 0.25], [0.90, 1.20]]) {
    const a = drumR(x0) + 0.015, b = drumR(x1) + 0.015;                 // seats on the tapered crown
    f.add(lathePart([[a, x0, .01], [a + 0.155, x0, .02], [b + 0.155, x1, .02], [b, x1, .01]], -30, 30, { segments: 14 }), M.gunmetalDark);
  }
  // two instrument blocks between the side plates
  f.add(box(1.50, 0.52, 1.20, 0.05), M.black, [-0.95, 2.26, 0]);
  f.add(box(1.20, 0.52, 1.20, 0.05), M.black, [0.55, 2.26, 0]);
  // window plates (both sides)
  const win = [-1.35, -0.55, 0.25, 0.95].map((x) => rectAt(0.40, 0.36, 0.06, x, 2.34));
  const side = plate(rectAt(3.05, 0.80, 0.07, -0.275, 2.30), 0.10, { holes: win, bevel: 0.02, center: true, bevelSegments: 1 });
  f.add(side, M.black, [0, 0, 0.84]);
  f.add(side, M.black, [0, 0, -0.84]);
  // top plate with two rows of slots
  const top = flatY(plate(rectAt(3.05, 1.80, 0.10, -0.275, 0), 0.09, {
    holes: [...slotHoles(4, 0.34, 0.10, 0.22, -0.275, 0.55, true, 0.04), ...slotHoles(4, 0.34, 0.10, 0.22, -0.275, -0.55, true, 0.04)], bevel: 0.02, center: true, bevelSegments: 1,
  }));
  f.add(top, M.black, [0, 2.665, 0]);
  // end plates
  const endp = flatX(plate(rectAt(1.80, 0.80, 0.07, 0, 0), 0.08, { bevel: 0.015, center: true, bevelSegments: 1 }));
  f.add(endp, M.black, [1.21, 2.30, 0]);
  f.add(endp, M.black, [-1.76, 2.30, 0]);
  // three tank cylinders with gunmetal rings and capping screws
  const tanks = [[-1.25, 0.42], [-0.55, 0.42], [0.15, 0.30]];
  for (const [x, h] of tanks) {
    f.add(cyl(0.22, h, { bevel: 0.04, segments: 32, y0: 0 }), M.black, [x, 2.71, 0]);
    for (const dy of [0.10, h - 0.14]) f.add(cyl(0.235, 0.05, { rIn: 0.19, bevel: 0.01, segments: 32, y0: 0 }), M.gunmetalDark, [x, 2.71 + dy, 0]);
    f.add(bolt(0.07, 0.045), M.gunmetalDark, [x, 2.71 + h, 0]);
  }
  // yellow marker dashes along both top edges
  const dash = new THREE.BoxGeometry(0.20, 0.05, 0.10);
  const dashes = [];
  for (let i = 0; i < 10; i++) for (const z of [-0.78, 0.78]) dashes.push(tr(-1.62 + i * 0.27, 2.735, z));
  f.addMany(dash, M.yellow, dashes);
  // corner screws on the top plate
  for (const x of [-1.62, 1.07]) for (const z of [-0.62, 0.62]) f.add(bolt(0.05, 0.035), M.gunmetalDark, [x, 2.71, z]);
}

/* ------------------------------------------------------------------ hoses */
/** Ribbed hose along a Catmull-Rom path. sweep() needs the point array (its THREE.Curve test is dead on r181). */
function corrugated(pts, r, pitch) {
  const vecs = pts.map((p) => V3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);     // same spline sweep() builds internally
  const L = curve.getLength();
  return { curve, geo: sweep(vecs, { radius: (u) => r * (1 + 0.17 * Math.sin(u * L / pitch * Math.PI * 2)), radial: 8, segments: Math.ceil(L / pitch * 5), caps: true }) };
}

function buildHoses(pm) {
  const grp = pm.part('hoses', {
    name: 'Module Hoses',
    info: 'Corrugated pneumatic hoses of the pollination module: one feeds the sensor purge air, one links the frame to the drive motor.',
  });
  const defs = [
    ['hose-a', 'Sensor Air Hose', 'Corrugated silicone hose with brass fittings that feeds purge air from the frame to the pollen sensor.', ex([0.9, 4.1, 0.2], 'mid'),
      [[1.29, 2.42, 0.42], [1.40, 2.68, 0.42], [1.58, 2.82, 0.36], [1.74, 2.78, 0.26], [1.80, 2.71, 0.20]]],
    ['hose-b', 'Motor Feed Hose', 'Corrugated feed hose with brass fittings running from the frame over the rear band to the drive motor flange.', ex([-1.4, 4.1, -0.2], 'mid'),
      [[-1.84, 2.40, -0.45], [-2.05, 2.56, -0.50], [-2.40, 2.42, -0.52], [-2.72, 2.12, -0.52], [-2.92, 1.74, -0.52]]],
  ];
  for (const [id, name, info, exp, pts] of defs) {
    const h = grp.part(id, { name, explode: exp, info, specs: { Material: 'Silicone, brass fittings', Bore: '0.06 mm', Mass: '0.004 g' } });
    const { curve, geo } = corrugated(pts, 0.055, 0.06);
    h.add(geo, M.rubber);
    for (const u of [0, 1]) {
      const p = curve.getPointAt(u), t = curve.getTangentAt(u).multiplyScalar(u ? -1 : 1);       // fitting axis points into the hose
      h.add(cyl(0.085, 0.09, { bevel: 0.015, segments: 14, y0: -0.045 }), M.brass, alignY(t, p));
    }
  }
}
