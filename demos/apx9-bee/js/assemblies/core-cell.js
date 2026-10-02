// Power core, energy side: glowing blue cell (+ filament, rib plates), cage rods, heat pipes, clamp straps, coolant lines,
// the wireless charging coil and the small items riding on the end caps (status LEDs, terminals).
// Frame: node at K.core.c; axis X; theta from +Y towards +Z (see core-util.js).
import { THREE, M, ex, S, plate, box, cyl, circlePts, circleHole, torus, spring, sweep, axisTo, sphere } from '../kit.js';
import { C, LAY, lathe, latheOpen, tube, lathePart, aroundX, atTheta, TILT_PX, ghostMesh, bolt, hexPrism, boltRing, cylPt } from './core-util.js';
import { D, X } from './core-power.js';

const rotX = (g) => g.rotateY(Math.PI / 2);                       // extrusion axis Z -> +X
const tr = (x, y = 0, z = 0) => new THREE.Matrix4().makeTranslation(x, y, z);

/* ------------------------------------------------------------------ energy cell */
export function buildCell(pc) {
  const cell = pc.part('cell', {
    name: 'Energy Cell', explode: X(D.cell),
    info: 'Translucent blue micro-battery in a chrome tie-rod cage: the glowing filament and rib plates inside show through the glass shell.',
    specs: { Material: 'Borosilicate shell, 7075 aluminium frame', Capacity: '1.2 mAh solid-state', Mass: '0.62 g' },
  });
  // rear plate with a seat for the glass tube and a hub boss around the shaft
  cell.add(lathe([
    [0.345, -2.82, .01], [1.58, -2.82, .03], [1.66, -2.76, .03], [1.66, -2.68, .02], [1.54, -2.68, .01], [1.54, -2.735, .01],
    [1.44, -2.735, .01], [1.44, -2.68, .01], [0.60, -2.68, .02], [0.54, -2.60, .02], [0.345, -2.60, .01]]), M.gunmetalDark);
  // open front flange (inserts slide out forward through the r 1.38 opening)
  cell.add(lathe([
    [1.38, -0.92, .01], [1.44, -0.92, .008], [1.44, -0.87, .008], [1.54, -0.87, .008], [1.54, -0.92, .008], [1.64, -0.92, .02],
    [1.70, -0.86, .02], [1.70, -0.80, .02], [1.38, -0.80, .015]]), M.gunmetalDark);
  // shaft collars at both ends of the cell
  cell.add(lathe([[0.345, -2.60, .01], [0.50, -2.60, .02], [0.50, -2.50, .02], [0.345, -2.50, .01]]), M.chrome);
  cell.add(lathe([[0.345, -1.04, .01], [0.50, -1.04, .02], [0.50, -0.92, .02], [0.345, -0.92, .01]]), M.chrome);
  // eight tie rods with socket heads on the front face
  cell.addMany(cyl(0.045, 1.76, { bevel: 0.012, segments: 10 }), M.chrome, aroundX(8, { x: -1.80, r: 1.63, tilt: TILT_PX }));
  boltRing(cell, M.chrome, { n: 8, r: 1.63, x: -0.80, dir: 1, rb: 0.06, hb: 0.04 });
  // glass shell (not pickable, so the parts inside stay selectable)
  ghostMesh(cell, latheOpen([[1.49, -2.72], [1.49, -0.88]], { segments: 72 }), C.cellGlass);

  buildInserts(cell);
  buildPipes(cell);
  buildStraps(cell);
  buildCoolant(cell);
  return cell;
}

function buildInserts(cell) {
  // glowing filament: dense coil around a light tube, held by two end rings
  const fil = cell.part('filament', {
    name: 'Plasma Filament', explode: X(1.0, 'fine'),
    info: 'White-hot tungsten-carbide filament coil around a light-guide core: the heart of the cell, it floods the blue shell with light.',
    specs: { Material: 'Tungsten-carbide wire, quartz light guide', Output: '38 lm', Mass: '0.09 g' },
  });
  fil.add(axisTo(spring({ radius: 0.56, wire: 0.04, turns: 15, length: 1.38, perTurn: S(18, 10), radial: 6 }), 'x'), C.filament, tr(-1.78));
  fil.add(tube(0.40, 0.46, -2.50, -1.06, 0.012), C.rod);
  fil.add(tube(0.46, 0.70, -2.52, -2.48, 0.01), C.rod);
  fil.add(tube(0.46, 0.70, -1.08, -1.04, 0.01), C.rod);
  fil.addMany(cyl(0.032, 1.46, { bevel: 0.01, segments: 8 }), C.rod, aroundX(4, { x: -1.78, r: 0.64, phase: 45, tilt: TILT_PX }));
  // soft additive haze around the filament, so the cell reads as lit from within (not pickable)
  ghostMesh(fil, sphere(1.2, { segments: 36, rings: 22, sx: 0.8 }), C.cellHaze, [-1.78, 0, 0]);

  // rib plates: annular discs with glowing rims plus radial blades
  const pl = cell.part('plates', {
    name: 'Cell Rib Plates', explode: X(0.5, 'fine'),
    info: 'Seven annular rib plates with light-guide rims and eight radial blades; they spread the charge evenly and give the cell its blue glow.',
    specs: { Material: 'Etched laminate, light-guide rims', Plates: '7', Mass: '0.18 g' },
  });
  const xs = [0, 1, 2, 3, 4, 5, 6].map((k) => -2.52 + k * 0.24);
  const disc = rotX(plate(circlePts(1.36, S(64, 24)), 0.05, { holes: [circleHole(0.66)], bevel: 0.012, center: true, bevelSegments: 1, uvScale: 0.3 }));
  pl.addMany(disc, C.plateGlow, xs.map((x) => tr(x)));
  pl.addMany(rotX(torus(1.36, 0.032, { radial: 8, tubular: 64 })), C.rib, xs.map((x) => tr(x)));
  pl.addMany(box(1.46, 0.68, 0.035, 0.008), C.rod, aroundX(8, { x: -1.78, r: 1.0, phase: 22.5 }));
}

function buildPipes(cell) {
  const hp = cell.part('heat-pipes', {
    name: 'Cell Heat Pipes', explode: ex([0, 1.5, 0], 'fine'),
    info: 'Four sintered copper heat pipes along the cell cage carry waste heat from the glowing core to the front fin pack; swaged chrome ferrules at both ends.',
    specs: { Material: 'Copper, sintered wick', Pipes: '4', Mass: '0.07 g' },
  });
  const ths = [-67.5, -22.5, 22.5, 67.5];
  hp.addMany(cyl(0.055, 1.72, { bevel: 0.02, segments: 12 }), C.copperPol, ths.map((t) => atTheta(-1.80, 1.62, t, { tilt: TILT_PX })));
  const fer = [];
  for (const t of ths) fer.push(atTheta(-2.62, 1.62, t, { tilt: TILT_PX }), atTheta(-0.98, 1.62, t, { tilt: TILT_PX }));
  hp.addMany(cyl(0.078, 0.10, { bevel: 0.02, segments: 14 }), M.chrome, fer);
}

function strapHalf(parent, id, name, th0, th1, sign) {
  const part = parent.part(id, {
    name, explode: ex([0, sign * 2.6, 0], 'fine'),
    info: sign > 0 ? 'Upper half of the cell clamp strap: two ribbed bands with bolted lugs hold the tie-rod cage and heat pipes against the shell.'
      : 'Lower half of the cell clamp strap: two ribbed bands with captive nuts clamp the cage and shell from below.',
    specs: { Material: 'Anodised aluminium, stainless fasteners', Mass: '0.08 g' },
  });
  for (const xm of [-2.38, -1.18]) {
    const x0 = xm - 0.09, x1 = xm + 0.09;
    part.add(lathePart([
      [1.69, x0, .01], [1.76, x0, .015], [1.76, xm - .035], [1.79, xm - .035, .01], [1.79, xm + .035, .01], [1.76, xm + .035],
      [1.76, x1, .015], [1.69, x1, .01]], th0, th1, { segments: 36 }), M.gunmetalDark);
    for (const z of [-1.80, 1.80]) {
      part.add(box(0.16, 0.18, 0.12, 0.02), M.gunmetalDark, [xm, sign * 0.09, z]);
      if (sign > 0) part.add(bolt(0.05, 0.04), M.steel, [xm, 0.18, z]);
      else part.add(hexPrism(0.07, 0.05), M.steel, [xm, -0.205, z]);
    }
  }
  return part;
}

function buildStraps(cell) {
  const st = cell.part('clamp-straps', { name: 'Cell Clamp Straps', info: 'Two split clamp straps that wrap the energy cell and lock its tie-rod cage; each strap opens into an upper and a lower half.' });
  strapHalf(st, 'upper', 'Upper Clamp Straps', -90, 90, 1);
  strapHalf(st, 'lower', 'Lower Clamp Straps', 90, 270, -1);
}

function hosePath(th, xRear, xFront) {
  const P = [[xFront, 1.58], [xFront, 1.74], [xFront - 0.07, 1.835], [xFront - 0.26, 1.84], [xRear + 0.22, 1.84], [xRear + 0.07, 1.835], [xRear, 1.74], [xRear, 1.58]];
  return P.map(([x, r]) => cylPt(x, r, th));
}

function buildCoolant(cell) {
  const grp = cell.part('coolant-lines', { name: 'Coolant Lines', info: 'Red supply and blue return hoses of the liquid cooling loop; they bridge the cell end plates over the clamp straps.' });
  const defs = [['supply', 'Coolant Supply Hose', 28, C.redRubber, 'Red silicone supply hose with chrome barb fittings at both ends; feeds coolant from the rear plate to the front fin pack.'],
    ['return', 'Coolant Return Hose', 56, C.blueRubber, 'Blue silicone return hose with chrome barb fittings; carries warmed coolant back to the rear plate.']];
  for (const [id, name, th, mat, info] of defs) {
    const a = th * Math.PI / 180;
    const h = grp.part(id, { name, explode: ex([0, 3.2 * Math.cos(a), 3.2 * Math.sin(a)], 'fine'), info, specs: { Material: 'Silicone, 316 stainless fittings', Bore: '0.08 mm', Mass: '0.03 g' } });
    h.add(sweep(hosePath(th, -2.71, -0.89), { radius: 0.06, radial: 10, caps: true, segments: 40 }), mat);
    h.addMany(cyl(0.09, 0.12, { bevel: 0.02, segments: 14 }), M.chrome, [-2.71, -0.89].map((x) => atTheta(x, 1.72, th)));
  }
}

/* ------------------------------------------------------------------ wireless coil */
export function buildCoil(pc) {
  const [x0, x1] = LAY.coil;
  const coil = pc.part('wireless-coil', {
    name: 'Wireless Charging Coil', explode: X(D.coil),
    info: 'Litz-wire induction coil wound between black flanges: it charges the cell from a dock with no exposed contacts.',
    specs: { Material: 'Litz copper wire, PA66 flanges', Turns: '4 x 5 layers', Mass: '0.21 g' },
  });
  coil.add(lathe([[1.36, x0, .01], [1.80, x0, .02], [1.80, x0 + .05, .02], [1.36, x0 + .05, .01]]), M.blackMatte);
  coil.add(lathe([[1.36, x1 - .05, .01], [1.80, x1 - .05, .02], [1.80, x1, .02], [1.36, x1, .01]]), M.blackMatte);
  const wx = (x0 + x1) / 2;
  for (let k = 0; k < 5; k++) {
    coil.add(axisTo(spring({ radius: 1.43 + k * 0.0625, wire: 0.03, turns: 4, length: 0.27, perTurn: S(44, 20), radial: 6 }), 'x'), C.copperPol, tr(wx));
  }
  boltRing(coil, M.chrome, { n: 10, r: 1.58, x: x0, dir: -1, rb: 0.05, hb: 0.035, phase: 9 });
  boltRing(coil, M.chrome, { n: 10, r: 1.58, x: x1, dir: 1, rb: 0.05, hb: 0.035, phase: 9 });

  const core = coil.part('core', {
    name: 'Coil Core', explode: X(-0.45, 'fine'),
    info: 'Ferrite-loaded bobbin core of the charging coil: a spoked hub carries a wide barrel that focuses the magnetic flux.',
    specs: { Material: 'Mn-Zn ferrite composite, anodised hub', Mass: '0.12 g' },
  });
  core.add(lathe([[0.70, x0 + .02, .02], [1.34, x0 + .02, .03], [1.34, x1 - .02, .03], [0.70, x1 - .02, .02]]), M.gunmetalDark);
  const holes = [];
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; holes.push(circleHole(0.095, Math.cos(a) * 0.54, Math.sin(a) * 0.54)); }
  holes.push(circleHole(0.35));
  core.add(rotX(plate(circlePts(0.72, S(48, 20)), 0.06, { holes, bevel: 0.012, center: true, bevelSegments: 1, uvScale: 0.5 })), M.steel, tr(wx));
  return coil;
}

/* ------------------------------------------------------------------ status LEDs + terminals (ride on the end caps) */
export function buildLeds(front) {
  const led = front.part('status-leds', {
    name: 'Status LEDs', explode: ex([0, 0.4, 1.5], 'fine'),
    info: 'Row of five status LEDs on the front cap rim: three green for charge level, two amber for temperature and fault.',
    specs: { Material: 'SMD LEDs, chrome bezels', Mass: '0.01 g' },
  });
  const ths = [55, 70, 85, 100, 115];
  const ledG = cyl(0.05, 0.07, { bevel: 0.012, segments: 12 });
  ths.forEach((t, i) => led.add(ledG, i % 2 ? M.glowAmber : M.glowGreen, atTheta(2.98, 1.80, t)));
  led.addMany(cyl(0.095, 0.035, { rIn: 0.05, bevel: 0.01, segments: 14 }), M.chrome, ths.map((t) => atTheta(2.98, 1.795, t)));
  return led;
}

export function buildTerminals(rear) {
  const t = rear.part('terminals', {
    name: 'Power Terminals', explode: ex([0, 2.4, 0], 'fine'),
    info: 'Two-post power terminal block on top of the rear cap: brass studs with nuts, one capped in red for the positive lead.',
    specs: { Material: 'Glass-filled nylon block, brass studs', Rating: '3.7 V / 2 A', Mass: '0.04 g' },
  });
  t.add(box(0.34, 0.22, 0.50, 0.03), M.blackMatte, [-3.08, 1.79, 0]);
  for (const [z, red] of [[-0.12, false], [0.12, true]]) {
    t.add(cyl(0.045, 0.14, { bevel: 0.01, segments: 12 }), M.brass, [-3.08, 1.93, z]);
    t.add(hexPrism(0.085, 0.05), M.brass, [-3.08, 1.905, z]);
    if (red) t.add(cyl(0.075, 0.07, { bevel: 0.02, segments: 12 }), C.redRubber, [-3.08, 1.99, z]);
  }
  return t;
}
