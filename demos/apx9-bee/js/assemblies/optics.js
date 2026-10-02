// optics.js - APX-9 optics assembly (compound eyes, ocelli, antennae).
//
// INVENTORY (CONTRACT 13.2)
//   eye-r   (optics)  dome, orbital-rim, back-housing, lens-stack, uv-ir-array, polarizer, shaft, bearing, gimbal-servo, bolts
//                     -> bee.mirror -> eye-l
//   ocelli  (optics)  ocellus-1..3
//   antenna-r (antenna) base-socket, scape, elbow-joint, flagellum-1..6, tip-sensor, chemical-sensor, airflow-vane, wiring
//                     -> bee.mirror -> antenna-l
import { THREE, M, ex } from '../kit.js';
import { eyeFrame, placeMat } from './optics-frame.js';
import { buildDome, domeLens, domeRidge, domeLiner } from './optics-dome.js';
import { buildRim, rimScrewGeo } from './optics-rim.js';
import { XC, ZC, buildHousing, buildBolts, buildLensStack, buildPolarizer, buildSensorBoard, buildShaft, buildBearing, buildServo } from './optics-eye.js';
import { ocellusSites, buildOcellusBody, buildOcellusLens } from './optics-ocelli.js';
import { buildAntenna } from './optics-antenna.js';

export async function build(ctx) {
  const { bee } = ctx;
  buildEye(bee);
  buildOcelli(bee);
  buildAntenna(bee);
}

// ------------------------------------------------------------------------------------------------ ocelli (centre line, not mirrored)
function buildOcelli(bee) {
  const root = bee.part('ocelli', {
    name: 'Ocelli Array', group: 'optics',
    info: 'Three simple eyes on the crown of the head: glossy lens domes in chrome bezels with retaining rings, over black sensor cans.',
    specs: { Material: 'Sapphire lenses, chrome bezels, black sensor cans', Mass: '0.05 g', Function: 'Light-level and horizon sensing' },
    explode: ex([10, 14, 0], 'top'),
  });
  ocellusSites().forEach((s, i) => {
    const o = root.part(`ocellus-${i + 1}`, {
      name: `Ocellus ${i + 1}`, group: 'optics',
      info: 'Chrome bezel with a retaining ring and three set screws, seated over a black sensor can with solder terminals.',
      specs: { Material: 'Chrome-plated brass bezel, black sensor can', Mass: '0.01 g', Dimensions: '1.6 mm dia x 1.5 mm' },
      pos: s.P.toArray(), quat: s.q,
      explode: ex([0, 2.0, 0], 'mid', null, 'local'),
    });
    buildOcellusBody(o, i);
    const lens = o.part('lens', {
      name: `Ocellus ${i + 1} Lens`, group: 'optics',
      info: 'Glossy sapphire dome lens that sits in the bezel and focuses the sky onto the sensor can.',
      specs: { Material: 'Sapphire glass', Mass: '0.003 g', Dimensions: '0.9 mm dia x 0.4 mm' },
      explode: ex([0, 1.2, 0], 'fine', null, 'local'),
    });
    buildOcellusLens(lens);
  });
}

function buildEye(bee) {
  const F = eyeFrame();
  const eyeQ = new THREE.Quaternion().setFromRotationMatrix(F.M);
  const toLocalP = (p) => F.toLocal(p);
  const toLocalN = (n) => n.clone().transformDirection(F.Minv);
  const L = (v, lvl = 'mid', rot = null) => ex(v, lvl, rot, 'local');

  const eye = bee.part('eye-r', {
    name: 'Right Compound Eye', group: 'optics',
    info: 'Faceted compound eye: glossy micro-lens dome in a yellow orbital rim, with lens stack, UV/IR sensor board, polarizer wheel and gimbal servo behind it.',
    specs: { Material: 'Sapphire micro-lens array, anodized aluminium rim', Mass: '0.15 g', Function: 'Wide-field imaging and polarization sensing' },
    pos: [F.c0.x, F.c0.y, F.c0.z], quat: eyeQ,
    explode: ex([8, 0, 12], 'top'),
  });

  // ---------------------------------------------------------------- dome
  const dome = eye.part('dome', {
    name: 'Faceted Dome', group: 'optics',
    info: 'Egg-shaped compound-eye dome with hundreds of convex micro-lenses set in a metallic ridge lattice over a black liner.',
    specs: { Material: 'Sapphire lens array on metal lattice', Mass: '0.04 g', Dimensions: '5.0 x 5.6 x 2.3 mm' },
    explode: L([0, 5.0, 0]),
  });
  const d = buildDome();
  dome.add(d.lens, domeLens, F.Minv);
  dome.add(d.ridge, domeRidge, F.Minv);
  dome.add(d.liner, domeLiner, F.Minv);

  // ---------------------------------------------------------------- orbital rim
  const rim = eye.part('orbital-rim', {
    name: 'Orbital Rim', group: 'optics', tag: 'shell',
    info: 'Thick chamfered yellow orbital rim that follows the head contour, with a black gasket ring and a ring of small socket-head screws.',
    specs: { Material: 'Clear-coated anodized aluminium, EPDM gasket', Mass: '0.03 g', Function: 'Retains the dome and seals the socket' },
    explode: L([0, 2.5, 0]),
  });
  const r = buildRim();
  rim.add(r.yellow, M.yellow, F.Minv);
  rim.add(r.gasket, M.black, F.Minv);
  const sg = rimScrewGeo();
  r.items.forEach((it, i) => rim.add(sg, M.steel, placeMat(toLocalP(it.P), toLocalN(it.n), i * 0.9)));

  // ---------------------------------------------------------------- lens stack
  const lens = eye.part('lens-stack', {
    name: 'Lens Stack', group: 'optics',
    info: 'Barrel with four coated optical elements and spacer rings; relays the micro-lens image onto the sensor board.',
    specs: { Material: 'Coated optical glass, gunmetal barrel', Mass: '0.02 g', Dimensions: '3.9 mm dia x 1.3 mm' },
    explode: L([0, 3.7, 0]),
  });
  buildLensStack(lens);

  // ---------------------------------------------------------------- polarizer wheel (pivot on the shaft axis)
  const pol = eye.part('polarizer', {
    name: 'Polarizer Wheel', group: 'optics',
    info: 'Geared wheel with five polarising film sectors on a spoked hub; it turns on the shaft to read the polarization pattern of the sky.',
    specs: { Material: 'Stainless wheel, dichroic film', Mass: '0.01 g', Dimensions: '3.8 mm dia x 0.1 mm' },
    pos: [XC, 0.10, ZC],
    explode: L([0, 1.5, 0], 'mid', [0, 72, 0]),
  });
  buildPolarizer(pol);

  // ---------------------------------------------------------------- UV / IR sensor board
  const pcb = eye.part('uv-ir-array', {
    name: 'UV/IR Sensor Array', group: 'optics',
    info: 'Rounded sensor board with a micro-lens grid, gold bond pads and four standoffs; reads the ultraviolet and infrared bands.',
    specs: { Material: 'FR-4 board, gold pads, sapphire micro-lenses', Mass: '0.02 g', Dimensions: '3.5 x 3.9 x 0.1 mm' },
    explode: L([0, 0.6, 0]),
  });
  buildSensorBoard(pcb);

  // ---------------------------------------------------------------- back housing
  const hous = eye.part('back-housing', {
    name: 'Back Housing', group: 'optics',
    info: 'Machined black cup that carries the lens stack, sensor board and bearing, with floor ribs, chrome rings and a bolted flange.',
    specs: { Material: 'Black-anodized aluminium, chrome rings', Mass: '0.03 g', Dimensions: '4.6 x 5.2 x 1.4 mm' },
    explode: L([0, 0, 0]),
  });
  buildHousing(hous);

  // ---------------------------------------------------------------- bolts
  const bolts = eye.part('bolts', {
    name: 'Flange Bolts', group: 'optics',
    info: 'Six socket-head bolts with washers clamp the housing flange to the head.',
    specs: { Material: 'Stainless steel', Mass: '0.004 g', Function: 'Flange clamp' },
    explode: L([0, 1.0, 0], 'fine'),
  });
  buildBolts(bolts);

  // ---------------------------------------------------------------- bearing, shaft, servo (pull out the back)
  const brg = eye.part('bearing', {
    name: 'Shaft Bearing', group: 'optics',
    info: 'Ball bearing with nine chrome balls and a shield ring; carries the polarizer shaft with almost no friction.',
    specs: { Material: 'Hardened steel races, chrome balls', Mass: '0.006 g', Dimensions: '1.6 mm dia x 0.4 mm' },
    explode: L([0, -1.3, 0], 'fine'),
  });
  buildBearing(brg);

  const shaft = eye.part('shaft', {
    name: 'Drive Shaft', group: 'optics',
    info: 'Polished steel drive shaft with a retaining groove and a splined end; couples the servo to the polarizer wheel.',
    specs: { Material: 'Polished stainless steel', Mass: '0.003 g', Dimensions: '0.44 mm dia x 2.1 mm' },
    explode: L([0, -3.0, 0], 'fine'),
  });
  buildShaft(shaft);

  const servo = eye.part('gimbal-servo', {
    name: 'Gimbal Servo', group: 'optics',
    info: 'Micro servo in a gold gimbal yoke, with three solder terminals and fine wires; steers the polarizer wheel.',
    specs: { Material: 'Gunmetal can, gold-plated yoke', Mass: '0.012 g', Dimensions: '1.2 mm dia x 0.5 mm' },
    explode: L([0, -4.3, 0], 'fine'),
  });
  buildServo(servo);

  bee.mirror(eye);
}
