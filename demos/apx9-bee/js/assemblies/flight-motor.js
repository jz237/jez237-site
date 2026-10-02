// flight-motor.js - APX-9 flight drive unit (CONTRACT 13.4 "flight-motor"). Motor-local frame: origin at bee (2.5, 3.6, 0), +X forward, +Y up, +Z bee-right.
// Housing modules: dark tray with chrome rim, yellow vented hood (decal + blue screws), flange stack with hanging pins, PCB posts, arch strap.
import { THREE, M, ex, plate, armorPanel, revolve, S, T, decalPatch, box } from '../kit.js';
import { TAU, loopRev, plateY, plateZ, shiftPts, rrect, slotPts, circ, mAt } from './flight-util.js';
import { LAY, HOOD, MOTOR_POS, PINS, BOLTS, POSTS, STANDOFFS, PORT, hoodY, hoodSurface } from './flight-motor-lay.js';

const W = LAY.W, TL = LAY.x1 - LAY.x0, CX = (LAY.x0 + LAY.x1) / 2, WL = LAY.wall;
const FL0 = LAY.floor[0], FL1 = LAY.floor[1], RIM = LAY.rim;
export const TOWER_X = 1.31;                       // front face of the tray tower
const AXLES = [LAY.g1, LAY.g2, LAY.g3];

/* ------------------------------------------------------------------ tray (lower shell) */

function trayFloor() {
  const holes = [];
  for (const [x, z] of PINS) holes.push(circ(0.045, 10, x, -z));
  for (const [x, z] of BOLTS) holes.push(circ(0.045, 10, x, -z));
  const g = plateY(shiftPts(rrect(TL, 2 * W, 0.17), CX, 0), FL1 - FL0, { bevel: 0.025, bevelSegments: 2, steps: 3, holes });
  g.translate(0, FL0, 0);
  return g;
}

function trayWalls() {
  const outer = shiftPts(rrect(TL, 2 * W, 0.17), CX, 0);
  const inner = shiftPts(rrect(TL - 2 * WL, 2 * (W - WL), 0.10), CX, 0);
  const g = plateY(outer, RIM - FL1, { bevel: 0.02, bevelSegments: 2, steps: 3, holes: [inner] });
  g.translate(0, FL1, 0);
  return g;
}

/** Chrome band around the top of the wall (overhangs 0.012 outside and 0.01 inside so no face is coplanar with the wall). */
function trayTrim() {
  const t = 0.012;
  const outer = shiftPts(rrect(TL + 2 * t, 2 * (W + t), 0.17 + t), CX, 0);
  const inner = shiftPts(rrect(TL - 2 * (WL - 0.01), 2 * (W - WL + 0.01), 0.09), CX, 0);
  const g = plateY(outer, 0.05, { bevel: 0.012, bevelSegments: 2, steps: 3, holes: [inner] });
  g.translate(0, RIM - 0.045, 0);
  return g;
}

/** Front tower, thickness 0.10 behind x = TOWER_X: two pillars with a notch in between for the slider carriage. */
function towerPlate() {
  const pts = [[-0.60, -1.09], [0.60, -1.09], [0.60, -0.80], [0.36, -0.80, 0.03], [0.36, -0.24, 0.04], [0.17, -0.24, 0.04], [0.17, -0.60, 0.02],
    [-0.17, -0.60, 0.02], [-0.17, -0.24, 0.04], [-0.36, -0.24, 0.04], [-0.36, -0.80, 0.03], [-0.60, -0.80]];
  const g = plateZ(pts, 0.10, { bevel: 0.02, bevelSegments: 1, steps: 3 });
  g.translate(TOWER_X, 0, 0);
  return g;
}

/** Bearing seat in the tray floor: stepped boss with a centre dimple. */
function bearingBoss() {
  return revolve([[0, FL1], [0.165, FL1], [0.165, -1.04, 0.014], [0.115, -1.04, 0.006], [0.115, -1.00, 0.012], [0.07, -1.00, 0.006], [0.07, -1.03], [0, -1.03]],
    { segments: 28, steps: 2 });
}

function buildTray(cont, F) {
  const lo = cont.part('lower-shell', {
    name: 'Motor Tray',
    info: 'Dark gunmetal machined tray that carries the gear train: chrome rim band, vertical flank ribs, bearing seats, three motor standoff pads, coupling ports on both flanks and a slotted front tower for the slider.',
    specs: { Material: 'Gunmetal-anodised aluminium, chrome rim band', Footprint: '3.2 x 1.6 mm', Wall: '0.075 mm', Mass: '0.05 g' },
  });
  lo.add(trayFloor(), M.gunmetalDark);
  lo.add(trayWalls(), M.gunmetalDark);
  lo.add(towerPlate(), M.gunmetalDark);
  lo.add(trayTrim(), M.chrome);
  const boss = bearingBoss();
  for (const x of AXLES) lo.add(boss, M.chrome, [x, 0, 0]);

  // vertical ribs on both flanks (clear of the coupling port)
  const rib = box(0.06, 0.20, 0.05, 0.012);
  for (const x of [-1.74, -1.34, -0.94, -0.54, -0.14, 0.26, 1.04]) for (const s of [-1, 1]) lo.add(rib, M.gunmetalDark, [x, -0.95, s * W]);

  // coupling ports: flush gunmetal rings on the flanks
  const port = F.washer(0.15, 0.075, 0.05);
  for (const s of [-1, 1]) lo.add(port, M.gunmetalDark, mAt([PORT.x, PORT.y, s * (W - 0.005)], [0, 0, s]));

  // standoff pads for the motor flange
  const pad = revolve([[0, FL1], [0.08, FL1], [0.08, FL1 + 0.045, 0.012], [0.045, FL1 + 0.045], [0.045, FL1 + 0.065], [0, FL1 + 0.065]], { segments: 14, steps: 2 });
  for (const [x, z] of STANDOFFS) lo.add(pad, M.gunmetalDark, [x, 0, z]);
  return lo;
}

/* ------------------------------------------------------------------ hood (upper shell) */

const HOOD_HW = 0.785;      // half width of the top plate (covers the skirts)
const SK_Z = 0.73;          // inner face of the skirts
const SK_T = 0.05;

function hoodTop() {
  const xv = LAY.g1 - HOOD.xc;
  const vents = [];
  for (const v of [-0.30, -0.15, 0, 0.15, 0.30]) vents.push(slotPts(xv - 0.13, v, xv + 0.13, v, 0.03, 6));
  return armorPanel({
    shape: rrect(HOOD.len - 0.01, 2 * HOOD_HW, 0.10), holes: vents, surface: hoodSurface(), thickness: HOOD.t, bevel: 0.02, bevelSegments: 2,
    maxEdge: 0.13, uvScale: 0.6, steps: 3,
  });
}

/** Side skirt in XY (thickness +Z): sits on the tray rim, louvre slots above the motor can. */
function hoodSkirt() {
  const n = 10, pts = [[HOOD.xr, RIM + 0.005, 0.02], [HOOD.xf, RIM + 0.005, 0.02]];
  for (let i = n; i >= 0; i--) {
    const x = HOOD.xr + (HOOD.xf - HOOD.xr) * i / n;
    pts.push([x, hoodY(x, 0.75) + 0.015, i === n || i === 0 ? 0.02 : 0]);
  }
  const holes = [];
  for (const y of [-0.58, -0.46, -0.34]) holes.push(slotPts(LAY.g1 - 0.21, y, LAY.g1 + 0.21, y, 0.026, 5));
  return plate(pts, SK_T, { bevel: 0.012, bevelSegments: 1, steps: 2, holes });
}

/** End plate in the (Z, Y) plane. yBot = bottom edge, x = plane x (used for the roof height), holes in (z, y). */
function hoodEnd(x, yBot, holes = []) {
  const n = 12, pts = [[-SK_Z, yBot, 0.02], [SK_Z, yBot, 0.02]];
  for (let i = 0; i <= n; i++) { const z = SK_Z - 2 * SK_Z * i / n; pts.push([z, hoodY(x, z) + 0.015, i === 0 || i === n ? 0.02 : 0]); }
  return plateZ(pts, 0.05, { bevel: 0.012, bevelSegments: 1, steps: 2, holes });
}

/** Where a screw at bee (x, z) meets the hood: plate top point and outward normal. */
function hoodTopAt(x, z) {
  const s = hoodSurface()(x - HOOD.xc, -z);
  return { p: s.p.clone().addScaledVector(s.n, HOOD.t), n: s.n, under: s.p };
}
export const HOOD_SCREWS = [[-0.30, -0.52], [-0.30, 0.52], [-1.80, 0]];

function hoodDecalMap() {
  return T.canvasTex(440, 600, (c, w, h) => {
    c.fillStyle = '#0e0e11';
    c.textBaseline = 'top';
    c.font = `900 100px ${T.FONT}`;
    c.fillText('APX-9', 12, 6);
    c.fillRect(14, 140, w - 28, 8);
    c.font = `800 46px ${T.FONT}`;
    c.fillText('FLIGHT DRIVE', 12, 166);
    c.font = `700 40px ${T.MONO}`;
    c.fillText('FD-12   38 Hz', 12, 232);
    c.fillText('1.2 g  SN 0904-17', 12, 282);
    // barcode strip
    let x = 14, i = 0;
    const bars = [3, 2, 5, 2, 3, 6, 2, 2, 4, 3, 2, 5, 3, 2, 2, 6, 3, 2, 4, 2, 3, 5, 2, 3, 2, 6, 2, 4];
    for (const b of bars) { if (i % 2 === 0) c.fillRect(x, 352, b * 3, 86); x += b * 3; i++; }
    c.font = `600 30px ${T.MONO}`;
    c.fillText('0904-17-FD12', 14, 452);
    // hazard chevrons
    c.save();
    c.beginPath(); c.rect(14, 510, w - 28, 62); c.clip();
    for (let k = -2; k < 14; k++) { c.beginPath(); c.moveTo(14 + k * 44, 572); c.lineTo(14 + k * 44 + 22, 572); c.lineTo(14 + k * 44 + 22 + 62, 510); c.lineTo(14 + k * 44 + 62, 510); c.closePath(); c.fill(); }
    c.restore();
  }, { repeat: false });
}

function buildHood(cont, F) {
  const up = cont.part('upper-shell', {
    name: 'Yellow Hood',
    info: 'Yellow clear-coated hood over the motor can and the first gear stage: barrel-shaped top with five vent slots, louvred side skirts, rivets and a printed type plate.',
    specs: { Material: 'Yellow-anodised aluminium, 0.06 mm skin', Vents: '5 top slots, 6 side louvres', Marking: 'APX-9 FD-12', Mass: '0.06 g' },
    explode: ex([0, 3.4, 0], 'fine'),
  });
  up.add(hoodTop(), M.yellow);
  const sk = hoodSkirt();
  const mR = new THREE.Matrix4().makeTranslation(0, 0, SK_Z);
  const mL = new THREE.Matrix4().makeScale(1, 1, -1).multiply(mR);
  up.add(sk, M.yellow, mR);
  up.add(sk, M.yellow, mL);

  // rear plate with three vent slots, front lintel above the gear window
  const rearHoles = [];
  for (const y of [-0.56, -0.44, -0.32]) rearHoles.push(slotPts(-0.24, y, 0.24, y, 0.03, 5));
  up.add(hoodEnd(HOOD.xr + 0.025, RIM + 0.005, rearHoles), M.yellow, [HOOD.xr + 0.05, 0, 0]);
  const lintel = hoodEnd(HOOD.xf - 0.025, -0.36);
  up.add(lintel, M.yellow, [HOOD.xf, 0, 0]);

  // interior screw bosses
  const boss = revolve([[0, 0], [0.075, 0, 0.012], [0.075, 0.30], [0, 0.30]], { segments: 14, steps: 2 });
  for (const [x, z] of HOOD_SCREWS) up.add(boss, M.yellow, [x, hoodY(x, z) - 0.28, z]);

  // pressed rivets along the lower skirt edges
  const rv = F.button(0.04);
  for (const x of [-1.80, -1.55, -1.05, -0.80, -0.50, -0.28]) for (const s of [-1, 1]) up.add(rv, M.yellow, mAt([x, -0.72, s * (SK_Z + SK_T)], [0, 0, s]));

  // type plate
  const d = decalPatch({ surface: hoodSurface(-0.72 - HOOD.xc, 0), w: 0.66, h: 0.90, map: hoodDecalMap(), lift: HOOD.t + 0.008, maxEdge: 0.1 });
  up.add(d.geometry, d.material);
  return up;
}

function buildHoodScrews(cont, F) {
  const hs = cont.part('hood-screws', {
    name: 'Hood Screws',
    info: 'Three dark-blue anodised socket-head screws that clamp the yellow hood to its interior bosses; shanks run through the hood skin.',
    specs: { Material: 'Anodised titanium', Thread: 'M0.17 x 0.34 mm', Count: '3', Mass: '0.005 g' },
    explode: ex([0, 4.0, 0], 'fine'),
  });
  const head = F.cap(0.085), shank = F.pin(0.04, 0.34);
  for (const [x, z] of HOOD_SCREWS) {
    const t = hoodTopAt(x, z);
    hs.add(head, M.anodizedBlue, mAt([t.p.x, t.p.y, t.p.z], [t.n.x, t.n.y, t.n.z], x * 3));
    hs.add(shank, M.anodizedBlue, mAt([t.p.x, t.p.y, t.p.z], [-t.n.x, -t.n.y, -t.n.z]));
  }
  return hs;
}

export function buildHousing(motor, F) {
  const cont = motor.part('housing', {
    name: 'Motor Housing',
    info: 'Two-shell housing of the flight motor: a dark gunmetal tray that carries the mechanism and a yellow vented hood that closes the rear half.',
    specs: { Shells: '2 (tray + hood)', Fasteners: '3 blue socket screws', Mass: '0.12 g' },
  });
  buildTray(cont, F);
  buildHood(cont, F);
  buildHoodScrews(cont, F);
  return cont;
}

/* ------------------------------------------------------------------ flange stack under the tray */

const BASE_Y = [-1.25, -1.19];
const FL_C = [-0.33, 1.44];

export function buildFlangeStack(motor, F) {
  const cont = motor.part('flange-stack', {
    name: 'Flange Stack',
    info: 'Bolted stack under the tray: a base plate, chrome bearing flanges below each gear axle, flange bolts and four hanging locating pins with yellow caps.',
    specs: { Layers: 'Base plate + 3 bearing flanges', Bolts: '6 hex + 12 flange hex', Pins: '4 hanging pins', Mass: '0.05 g' },
    explode: ex([0, -1.6, 0], 'mid'),
  });

  const bp = cont.part('base-plate', {
    name: 'Base Plate',
    info: 'Gunmetal base plate bolted to the underside of the tray, with lightening slots, locating pin holes and bolt holes.',
    specs: { Material: 'Gunmetal-anodised aluminium', Thickness: '0.06 mm', Mass: '0.02 g' },
  });
  const holes = [];
  for (const [x, z] of PINS) holes.push(circ(0.045, 10, x, -z));
  for (const [x, z] of BOLTS) holes.push(circ(0.045, 10, x, -z));
  for (const x of [(LAY.g1 + LAY.g2) / 2, (LAY.g2 + LAY.g3) / 2]) holes.push(slotPts(x, -0.26, x, 0.26, 0.05, 6));
  const plt = plateY(shiftPts(rrect(2.95, FL_C[1], 0.14), FL_C[0], 0), BASE_Y[1] - BASE_Y[0], { bevel: 0.014, bevelSegments: 2, steps: 3, holes });
  plt.translate(0, BASE_Y[0], 0);
  bp.add(plt, M.gunmetal);

  const fb = cont.part('flange-bolts', {
    name: 'Flange Bolts',
    info: 'Chrome bearing flanges with a bolt circle under each gear axle, plus the six hex bolts that clamp the base plate to the tray floor.',
    specs: { Material: 'Polished chrome steel', Flange: 'dia 0.60 mm x 0.05 mm', Bolts: '12 flange + 6 plate', Mass: '0.01 g' },
    explode: ex([0, -0.5, 0], 'fine'),
  });
  const ring = loopRev([[0.075, -1.30, 0.008], [0.30, -1.30, 0.012], [0.30, -1.25, 0.01], [0.075, -1.25, 0.008]], { segments: 40, steps: 2 });
  const plug = revolve([[0, -1.345], [0.055, -1.345, 0.02], [0.055, -1.30], [0, -1.30]], { segments: 16, steps: 2 });
  const hex = F.hex(0.05), plateHex = F.hex(0.055), shankPlate = F.pin(0.04, 0.16);
  for (const x of AXLES) {
    fb.add(ring, M.chrome, [x, 0, 0]);
    fb.add(plug, M.chrome, [x, 0, 0]);
    for (let k = 0; k < 4; k++) {
      const a = TAU * (k + 0.5) / 4;
      fb.add(hex, M.chrome, mAt([x + Math.cos(a) * 0.20, -1.30, Math.sin(a) * 0.20], [0, -1, 0], a));
    }
  }
  for (const [x, z] of BOLTS) {
    fb.add(plateHex, M.chrome, mAt([x, BASE_Y[0], z], [0, -1, 0], x * 5));
    fb.add(shankPlate, M.chrome, [x, BASE_Y[0], z]);
  }

  const hp = cont.part('hanging-pins', {
    name: 'Hanging Pins',
    info: 'Four chrome locating pins that pass up through the base plate and tray floor, each ending in a yellow anodised cap under the stack.',
    specs: { Material: 'Chrome steel pin, yellow anodised cap', Pin: 'dia 0.08 mm', Count: '4', Mass: '0.01 g' },
    explode: ex([0, -1.4, 0], 'fine'),
  });
  const shank = F.pin(0.04, 0.30);
  const cap = revolve([[0, -1.375], [0.07, -1.375, 0.02], [0.10, -1.34, 0.012], [0.10, -1.30, 0.008], [0, -1.30]], { segments: 20, steps: 2 });
  for (const [x, z] of PINS) {
    hp.add(shank, M.chrome, [x, -1.30, z]);
    hp.add(cap, M.yellow, [x, 0, z]);
  }
  return cont;
}

/* ------------------------------------------------------------------ PCB posts and arch strap */

export function buildPosts(motor, F) {
  const ps = motor.part('post-set', {
    name: 'Support Posts',
    info: 'Four black stand-off posts with chrome caps that rise from the tray floor to carry the controller board; the two front posts continue up to the bracket arm.',
    specs: { Material: 'Black anodised aluminium, chrome caps', Count: '4 (2 short, 2 tall)', Mass: '0.02 g' },
  });
  const yb = FL1, py = LAY.pcbY;
  const shoulder = py[0] - 0.06;
  const rear = [[0, yb], [0.115, yb], [0.115, yb + 0.05, 0.012], [0.07, yb + 0.05], [0.07, shoulder, 0], [0.10, shoulder, 0.008], [0.10, py[0], 0.008], [0.05, py[0]], [0.05, py[1] + 0.005], [0, py[1] + 0.005]];
  const front = [[0, yb], [0.115, yb], [0.115, yb + 0.05, 0.012], [0.07, yb + 0.05], [0.07, shoulder, 0], [0.10, shoulder, 0.008], [0.10, py[0], 0.008], [0.05, py[0]], [0.05, py[1]],
    [0.07, py[1], 0.004], [0.07, 0.66], [0.10, 0.66, 0.008], [0.10, 0.74, 0.008], [0.045, 0.74], [0.045, 0.82], [0, 0.82]];
  const gR = revolve(rear, { segments: 24, steps: 2 });
  const gF = revolve(front, { segments: 24, steps: 2 });
  const cap = revolve([[0, py[1]], [0.10, py[1], 0.01], [0.10, py[1] + 0.055, 0.02], [0.075, py[1] + 0.10, 0.02], [0, py[1] + 0.105]], { segments: 22, steps: 3 });
  const dimple = F.washer(0.035, 0.0, 0.0);
  for (const [x, z] of POSTS.rear) { ps.add(gR, M.black, [x, 0, z]); ps.add(cap, M.chrome, [x, 0, z]); }
  for (const [x, z] of POSTS.front) ps.add(gF, M.black, [x, 0, z]);
  void dimple;
  return ps;
}

export function buildStrap(motor, F) {
  const st = motor.part('arch-strap', {
    name: 'Arch Strap',
    info: 'Yellow anodised arch strap that bridges the tray walls in front of the hood and holds the gear window closed; steel screws on both feet and the crown.',
    specs: { Material: 'Yellow-anodised spring aluminium', Section: '0.13 x 0.05 mm', Mass: '0.01 g' },
    explode: ex([0, 3.2, 0], 'mid'),
  });
  const zc = 0.74, t = 0.05, y0 = RIM + 0.005, yc = -0.40, ro = zc + t / 2, ri = zc - t / 2, n = 16;
  const pts = [[ro + 0.025, y0, 0.01], [ro + 0.025, y0 + 0.04, 0.01], [ro, y0 + 0.04, 0.01], [ro, yc]];
  for (let i = 1; i < n; i++) { const a = Math.PI * i / n; pts.push([Math.cos(a) * ro, yc + Math.sin(a) * ro]); }
  pts.push([-ro, yc], [-ro, y0 + 0.04, 0.01], [-ro - 0.025, y0 + 0.04, 0.01], [-ro - 0.025, y0, 0.01], [-ri, y0], [-ri, yc]);
  for (let i = n - 1; i >= 1; i--) { const a = Math.PI * i / n; pts.push([Math.cos(a) * ri, yc + Math.sin(a) * ri]); }
  pts.push([ri, yc], [ri, y0]);
  const band = plateZ(pts, 0.13, { bevel: 0.012, bevelSegments: 1, steps: 2 });
  band.translate(0.005, 0, 0);
  st.add(band, M.yellow);
  const sx = -0.06, head = F.cap(0.045);
  for (const s of [-1, 1]) st.add(head, M.steel, mAt([sx, y0 + 0.04, s * (zc + 0.005)], [0, 1, 0], s));
  st.add(head, M.steel, mAt([sx, yc + ro, 0], [0, 1, 0]));
  return st;
}

/* ------------------------------------------------------------------ top-level part */

export function createMotor(bee) {
  return bee.part('flight-motor', {
    name: 'Flight Motor', group: 'wing-mount', pos: MOTOR_POS,
    info: 'Central flight drive unit above the thorax core: a vertical DC motor, two-stage spur gear train and slider-crank linkage in a vented tray with yellow hood, controller board, heat sink and flex couplings to both wing mounts.',
    specs: { Drive: 'Vertical DC motor, 3 spur gears + compound', Reduction: '2.56 : 1 (10/16 x 10/16, module 0.07)', Stroke: '0.6 mm slider-crank', Mass: '0.4 g' },
    explode: ex([0, 10, 0], 'top'),
  });
}
