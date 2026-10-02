// Flight assembly: planetary servo gearbox, angle sensor and oscillation servo (inboard end of one wing mount).
// Mount-local frame: x = s along the wing span axis (outboard +), y = lead, z = wing normal.
import { M, circlePts, ngonPts, box, S } from '../kit.js';
import { TAU, D2R, loopX, rx, plateX, gearPts, flutePts, sectorWin, mAt, exS } from './flight-util.js';

/** Axial layout of the inboard stack (mount-frame s in mm). */
export const GB = {
  front: [-1.47, -1.40], gear: [-1.585, -1.475], ring: [-1.595, -1.465], rear: [-1.66, -1.60],
  orbit: 0.40, rRing: 0.80,
};
export const SN = { hub: [-1.725, -1.66], disc: [-1.76, -1.725], board: [-1.835, -1.80] };
export const SV = { flange: [-1.90, -1.86], can: [-2.16, -1.90] };

const PLANET_ANG = [0, 90, 180, 270].map((a) => a * D2R);
const yz = (R, a) => [Math.cos(a) * R, Math.sin(a) * R];

/* ------------------------------------------------------------------ planetary gearbox */

/** Carrier plate outline: disc with the shaft bore, four pin holes and four kidney windows between the pins. */
function carrierHoles(rBore, rWin0, rWin1, pinR) {
  const holes = [circlePts(rBore, S(28, 14))];
  for (const a of PLANET_ANG) holes.push(circlePts(pinR, 12, ...yz(GB.orbit, a)));
  for (let k = 0; k < 4; k++) {
    const c = (45 + 90 * k) * D2R;
    holes.push(sectorWin(rWin0, rWin1, c - 26 * D2R, c + 26 * D2R, 6, 0.04));
  }
  return holes;
}

export function buildGearbox(mount, F) {
  const cont = mount.part('servo-gearbox', {
    name: 'Planetary Servo Gearbox',
    info: 'Four-planet reduction stage between the oscillation servo and the output shaft: a 10-tooth sun drives four planets inside a 30-tooth ring gear for a 4:1 reduction.',
    specs: { Ratio: '4 : 1 (sun 10T, planets 10T, ring 30T)', Module: '0.04 mm', Material: 'Hardened steel and brass', Mass: '0.05 g' },
    explode: exS(-4.7, 'mid'),
  });
  const { front, gear, ring, rear, orbit } = GB;

  // front carrier plate (pressed onto the shaft stub) carrying the four steel planet pins
  const cf = cont.part('carrier-front', {
    name: 'Carrier Plate and Pins',
    info: 'Gunmetal carrier plate pressed onto the output shaft stub; its four steel pins carry the planet gears, so whatever the planets do drives the shaft.',
    specs: { Material: 'Gunmetal plate, hardened steel pins', Pins: '4 x dia 0.09 mm' },
    explode: exS(0, 'fine'),
  });
  const plate = plateX(circlePts(0.62, S(52, 26)), front[1] - front[0], { bevel: 0.016, bevelSegments: 1, steps: 1, holes: carrierHoles(0.30, 0.35, 0.50, 0.046) });
  plate.translate(front[0], 0, 0);
  cf.add(plate, M.gunmetal);
  const pinLen = front[1] - rear[0];
  for (const a of PLANET_ANG) cf.add(F.pin(0.045, pinLen), M.gunmetal, mAt([front[1] - 0.005, ...yz(orbit, a)], [-1, 0, 0]));

  // planet gears on the pins (brass)
  const pl = cont.part('planets', {
    name: 'Planet Gears',
    info: 'Four 10-tooth brass planet gears with 0.04 mm module teeth; each runs on its own carrier pin and meshes with both the sun and the ring gear.',
    specs: { Teeth: '10 each', Material: 'Brass', Module: '0.04 mm' },
    explode: exS(-0.95, 'fine'),
  });
  const pg = plateX(gearPts(10, 0.24, 0.15, { phase: 18 * D2R }), gear[1] - gear[0], { bevel: 0.009, bevelSegments: 1, steps: 1, creaseDeg: 45, holes: [circlePts(0.05, 12)] });
  pg.translate(gear[0], 0, 0);
  PLANET_ANG.forEach((a,i)=>{const planet=pl.part(`planet-${i}`,{name:`Planet Gear ${i+1}`,info:'Individually rotating brass planet on the carrier pin.'});planet.add(pg,M.brass,[0,...yz(orbit,a)]);});

  // ring gear (grounded) with four gold retaining bolts
  const rg = cont.part('ring-gear', {
    name: 'Ring Gear',
    info: 'Titanium ring gear with 30 internal teeth, held still by four gold bolts; it is the fixed member that makes the planets walk around the sun.',
    specs: { Teeth: '30 internal', Material: 'Titanium with gold bolts', Outer: 'dia 1.6 mm' },
    explode: exS(-1.8, 'fine'),
  });
  const cav = gearPts(30, 0.65, 0.56, { tipW: 0.20, rootW: 0.37, phase: 6 * D2R });
  const bolts = [45, 135, 225, 315].map((a) => yz(0.725, a * D2R));
  const rh = [cav, ...bolts.map((b) => circlePts(0.04, 10, b[0], b[1]))];
  const rgg = plateX(circlePts(GB.rRing, S(64, 32)), ring[1] - ring[0], { bevel: 0.02, bevelSegments: 2, steps: 1, creaseDeg: 45, holes: rh });
  rgg.translate(ring[0], 0, 0);
  rg.add(rgg, M.titanium);
  for (const b of bolts) rg.add(F.cap(0.062), M.titanium, mAt([ring[1] - 0.004, b[0], b[1]], [1, 0, 0], 0.3));

  // sun gear and its input spindle
  const sg = cont.part('sun-gear', {
    name: 'Sun Gear and Spindle',
    info: 'Ten-tooth hardened steel sun gear on a ground spindle; the spindle is the servo output, so one turn of the servo moves the carrier a quarter turn.',
    specs: { Teeth: '10', Material: 'Hardened steel', Spindle: 'dia 0.22 mm' },
    explode: exS(-2.7, 'fine'),
  });
  const sun = plateX(gearPts(10, 0.24, 0.15, { phase: 0 }), gear[1] - gear[0], { bevel: 0.009, bevelSegments: 1, steps: 1, creaseDeg: 45 });
  sun.translate(gear[0], 0, 0);
  sg.add(sun, M.steel);
  sg.add(rx([[0, -2.02], [0.11, -2.02, 0.012], [0.11, -1.50, 0.008], [0, -1.50]], { segments: 18, steps: 1 }), M.steel);

  // rear carrier plate
  const cr = cont.part('carrier-rear', {
    name: 'Rear Carrier Plate',
    info: 'Steel plate that closes the planet cage at the back and takes the free ends of the four carrier pins; the encoder hub is screwed to its rear face.',
    specs: { Material: 'Stainless steel', Thickness: '0.06 mm' },
    explode: exS(-3.6, 'fine'),
  });
  const rp = plateX(circlePts(0.60, S(52, 26)), rear[1] - rear[0], { bevel: 0.014, bevelSegments: 1, steps: 1, holes: carrierHoles(0.15, 0.30, 0.47, 0.046) });
  rp.translate(rear[0], 0, 0);
  cr.add(rp, M.steel);
  return cont;
}

/* ------------------------------------------------------------------ angle sensor */

export function buildSensor(mount, F) {
  const cont = mount.part('angle-sensor', {
    name: 'Angle Sensor',
    info: 'Optical encoder that reads the wing angle: a slotted steel disc turns with the carrier while a black fork sensor on its own board counts the slits.',
    specs: { Principle: 'Optical slit encoder', Resolution: '40 slits per turn', Mass: '0.02 g' },
    explode: exS(-6.0, 'mid'),
  });
  const disc = cont.part('encoder-disc', {
    name: 'Encoder Disc',
    info: 'Thin stainless disc with forty radial slits on a steel hub; it turns with the planet carrier so the sensor sees the wing angle.',
    specs: { Material: 'Stainless steel', Slits: '40', Thickness: '0.035 mm' },
    explode: exS(0.0, 'fine'),
  });
  const slits = [];
  for (let k = 0; k < 40; k++) {
    const a = k / 40 * TAU, c = Math.cos(a), s = Math.sin(a);
    const w = 0.022;
    const P = (u, v) => [c * u - s * v, s * u + c * v];
    slits.push([P(0.40, -w), P(0.53, -w), P(0.53, w), P(0.40, w)]);
  }
  const dg = plateX(circlePts(0.58, S(60, 30)), SN.disc[1] - SN.disc[0], { bevel: 0.01, bevelSegments: 1, steps: 1, holes: [circlePts(0.24, S(24, 12)), ...slits] });
  dg.translate(SN.disc[0], 0, 0);
  disc.add(dg, M.steel);
  disc.add(loopX([[0.145, SN.disc[0], 0.008], [0.24, SN.disc[0], 0.008], [0.24, SN.disc[1], 0.006], [0.30, SN.disc[1], 0.01], [0.30, SN.hub[1], 0.01], [0.145, SN.hub[1], 0.008]], { segments: 28, steps: 1 }), M.steel);

  const bd = cont.part('sensor-board', {
    name: 'Sensor Board',
    info: 'Crescent circuit board carrying the fork sensor, two driver chips and the harness connector; it is held to the ring gear by two brass standoffs.',
    specs: { Material: 'FR4 board, brass standoffs', Sensor: 'Slotted fork, 0.15 mm gap' },
    explode: exS(-1.0, 'fine'),
  });
  const a0 = 200 * D2R, a1 = 340 * D2R;
  const holes = [];
  for (const a of [225, 315]) holes.push(circlePts(0.04, 10, ...yz(0.70, a * D2R)));
  const bg = plateX(sectorWin(0.26, 0.86, a0, a1, S(14, 8), 0.07), SN.board[1] - SN.board[0], { bevel: 0.008, bevelSegments: 1, steps: 2, holes });
  bg.translate(SN.board[0], 0, 0);
  bd.add(bg, M.pcb);
  // black fork sensor straddling the disc rim at the 270 deg position, two driver chips, connector
  const sB = SN.board[1];
  bd.add(box(0.12, 0.2, 0.08, 0.008), M.black, [sB - 0.06 + 0.115, 0, -0.66]);
  bd.add(box(0.026, 0.2, 0.30, 0.006), M.black, [-1.7875, 0, -0.52]);
  bd.add(box(0.026, 0.2, 0.30, 0.006), M.black, [-1.6975, 0, -0.52]);
  for (const [a, rr, w, h] of [[246, 0.66, 0.2, 0.12], [296, 0.50, 0.16, 0.2]]) {
    const p = yz(rr, a * D2R);
    bd.add(box(0.03, w, h, 0.006), M.black, [sB + 0.015, p[0], p[1]]);
  }
  // brass hex standoffs from the ring gear down to the board, closed by a button screw behind the board
  const so = plateX(ngonPts(6, 0.05, Math.PI / 6), GB.ring[0] - SN.board[1], { bevel: 0.006, bevelSegments: 1, steps: 1 });
  so.translate(SN.board[1], 0, 0);
  for (const a of [225, 315]) {
    const p = yz(0.70, a * D2R);
    bd.add(so, M.black, [0, p[0], p[1]]);
    bd.add(F.button(0.065), M.black, mAt([SN.board[0], p[0], p[1]], [-1, 0, 0]));
  }
  return cont;
}

/* ------------------------------------------------------------------ oscillation servo */

export function buildServo(mount, F) {
  const cont = mount.part('oscillation-servo', {
    name: 'Oscillation Servo',
    info: 'Coreless micro servo that swings the wing: a ribbed black can holds the motor, a steel flange bolts it to the gearbox and gold terminals take the drive harness.',
    specs: { Type: 'Coreless DC micro servo', Body: 'dia 0.92 mm, ribbed can', Mass: '0.04 g' },
    explode: exS(-8.1, 'mid'),
  });
  const fl = cont.part('servo-flange', {
    name: 'Servo Flange',
    info: 'Titanium mounting flange with a bearing boss for the spindle and three gold cap screws that clamp the can to the gearbox standoffs.',
    specs: { Material: 'Titanium, gold screws', Screws: '3 x socket cap' },
    explode: exS(0.0, 'fine'),
  });
  const fg = plateX(circlePts(0.58, S(48, 24)), SV.flange[1] - SV.flange[0], { bevel: 0.012, bevelSegments: 1, steps: 1, holes: [circlePts(0.2, 20), ...[90, 210, 330].map((a) => circlePts(0.04, 10, ...yz(0.46, a * D2R)))] });
  fg.translate(SV.flange[0], 0, 0);
  fl.add(fg, M.titanium);
  fl.add(loopX([[0.125, SV.flange[0], 0.01], [0.2, SV.flange[0], 0.01], [0.2, SV.flange[1] + 0.05, 0.01], [0.125, SV.flange[1] + 0.05, 0.01]], { segments: 24, steps: 1 }), M.titanium);
  for (const a of [90, 210, 330]) fl.add(F.cap(0.06), M.gold, mAt([SV.flange[1], ...yz(0.46, a * D2R)], [1, 0, 0], a * D2R));

  const can = cont.part('servo-can', {
    name: 'Servo Can',
    info: 'Ribbed black motor can with chrome crimp bands at both ends; the 24 axial flutes give grip during assembly and stiffen the thin wall.',
    specs: { Material: 'Black-anodised aluminium, chrome bands', Flutes: '24', Length: '0.26 mm' },
    explode: exS(-0.8, 'fine'),
  });
  const cg = plateX(flutePts(24, 0.46, 0.03, 4), SV.can[1] - SV.can[0], { bevel: 0.014, bevelSegments: 1, steps: 1 });
  cg.translate(SV.can[0], 0, 0);
  can.add(cg, M.black);
  for (const s of [SV.can[1] - 0.045, SV.can[0] + 0.0]) can.add(loopX([[0.40, s, 0.01], [0.475, s, 0.01], [0.475, s + 0.045, 0.01], [0.40, s + 0.045, 0.01]], { segments: 40, steps: 1 }), M.chrome);

  const cap = cont.part('servo-cap', {
    name: 'Servo End Cap',
    info: 'Brass end cap with a stepped boss and three gold terminal pins where the drive harness is soldered or plugged in.',
    specs: { Material: 'Brass cap, gold pins', Pins: '3' },
    explode: exS(-1.6, 'fine'),
  });
  cap.add(rx([[0, -2.30], [0.26, -2.30, 0.02], [0.26, -2.20, 0.015], [0.405, -2.20, 0.012], [0.405, SV.can[0], 0.012], [0, SV.can[0]]], { segments: 36, steps: 2 }), M.brass);
  for (let k = 0; k < 3; k++) {
    const a = (90 + k * 120) * D2R;
    cap.add(F.pin(0.03, 0.22), M.brass, mAt([-2.28, ...yz(0.15, a)], [-1, 0, 0]));
  }
  return cont;
}
