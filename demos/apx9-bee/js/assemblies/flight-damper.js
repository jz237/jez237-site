// Flight assembly: end-stop damper, lever arm with flat return spring, signal harness and floating clamps of one wing mount.
// Mount-local frame: x = s along the wing span axis (outboard +), y = lead, z = wing normal.
import { THREE, M, plate, box, circlePts, S, V3 } from '../kit.js';
import {
  D2R, TAU, loopX, loopRev, rx, plateX, toMountX, rotPts, shiftPts, rrect, slotPts, mAt, basisM, exS, exL,
  springX, spiralBand, ribbedTube,
} from './flight-util.js';
import { PLATE } from './flight-mount.js';

/** The damper stands parallel to the shaft on the free (-normal) flank of the mount. */
const AD = 285 * D2R;
const RD = 1.82;
const CA = Math.cos(AD), SA = Math.sin(AD);
const DY = CA * RD, DZ = SA * RD;            // damper axis in (y, z)
const ER = [0, CA, SA];                      // radial unit vector (away from the shaft)
const ET = [0, -SA, CA];                     // tangential unit vector
const at = (s, t = 0, r = 0) => [s, DY + ET[1] * t + ER[1] * r, DZ + ET[2] * t + ER[2] * r];

const POD = { pad: [-0.375, PLATE.iS], body: [-0.90, -0.375], gland: [-0.95, -0.90], pin: -0.62 };
const ARM = { s: [-1.325, -1.285], rHub: 0.78, rBore: 0.575, rTip: 0.17 };
const SPIRAL_S = -1.365;

/* ------------------------------------------------------------------ damper strut */

/** Cheek outline in (s, radial): straight base, semicircular ear around the pivot pin. */
function cheekPts() {
  const u0 = -0.36, uc = POD.pin, R = 0.27, n = 10;
  const pts = [[u0, -R, 0.035]];
  for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 - Math.PI * i / n; pts.push([uc + Math.cos(a) * R, Math.sin(a) * R]); }
  pts.push([u0, R, 0.035]);
  return pts;
}

/** Ribbed damper can profile (r, s), solid, from the gland end to the pad end. */
function canProfile() {
  const [sA, sB] = POD.body;
  const rv = 0.148, rc = 0.166, n = 5, pitch = (sB - sA) / (n + 1);
  const pts = [[0, sA], [rv, sA, 0.012]];
  for (let k = 0; k < n; k++) {
    const c = sA + pitch * (k + 1), hw = 0.022, e = 0.016;
    pts.push([rv, c - hw - e, 0.006], [rc, c - hw, 0.01], [rc, c + hw, 0.01], [rv, c + hw + e, 0.006]);
  }
  pts.push([rv, sB, 0.012], [0, sB]);
  return pts;
}

export function buildDamper(mount, F) {
  const cont = mount.part('damper', {
    name: 'End-Stop Damper',
    info: 'Spring-loaded buffer on the free flank of the mount: a yoke-mounted ribbed cylinder with a chrome plunger that cushions the lever arm at the end of the wing stroke.',
    specs: { Type: 'Spring plunger end-stop', Stroke: '0.35 mm', Spring: '6 turns, wire dia 0.05 mm', Mass: '0.03 g' },
    explode: exS(-2.6, 'mid'),
  });

  // yellow yoke: foot pad on the inboard clamp plate, two ear cheeks, gold pivot pin and pad screws
  const br = cont.part('damper-bracket', {
    name: 'Damper Yoke Bracket',
    info: 'Yellow anodised yoke: a foot pad screwed to the inboard clamp plate and two ear cheeks that hold the damper body on a gold pivot pin.',
    specs: { Material: 'Yellow anodised aluminium', Pivot: 'dia 0.1 mm gold pin', Mass: '0.01 g' },
    explode: exS(0, 'fine'),
  });
  const pad = plateX(shiftPts(rotPts(rrect(0.66, 0.54, 0.09), 15 * D2R), DY, DZ), POD.pad[1] - POD.pad[0], { bevel: 0.014, bevelSegments: 1, steps: 2 });
  pad.translate(POD.pad[0], 0, 0);
  br.add(pad, M.yellow);
  // cheek plates: shape x -> s, shape y -> radial, extrusion -> tangential (centred on the cheek plane)
  const cheek = plate(cheekPts(), 0.04, { bevel: 0.01, bevelSegments: 1, steps: 2, center: true, holes: [circlePts(0.05, 12, POD.pin, 0)] });
  for (const side of [-1, 1]) br.add(cheek, M.yellow, basisM(at(0, side * 0.195, 0), [1, 0, 0], ER, ET));
  br.add(F.pin(0.05, 0.5), M.gold, mAt(at(POD.pin, -0.25), ET));
  br.add(F.button(0.085), M.gold, mAt(at(POD.pin, 0.25), ET));
  for (const side of [-1, 1]) br.add(F.button(0.05), M.gold, mAt(at(POD.pad[0], side * 0.275), [-1, 0, 0]));

  // black ribbed body with chrome end collar and hex gland nut
  const bd = cont.part('damper-body', {
    name: 'Damper Body',
    info: 'Black anodised damper cylinder with five turned grip ribs, a chrome crimp collar at the foot and a chrome hex gland nut that guides the plunger.',
    specs: { Material: 'Black anodised aluminium, chrome collar and gland', Bore: 'dia 0.3 mm', Mass: '0.01 g' },
    explode: exS(0, 'fine'),
  });
  const o = [0, DY, DZ];
  bd.add(rx(canProfile(), { segments: S(40, 18), steps: 1, creaseDeg: 40 }), M.black, o);
  bd.add(loopX([[0.14, -0.445, 0.01], [0.172, -0.445, 0.01], [0.172, -0.375, 0.01], [0.14, -0.375, 0.01]], { segments: S(36, 16), steps: 1 }), M.chrome, o);
  bd.add(loopX([[0.05, POD.gland[0], 0.008], [0.19, POD.gland[0], 0.008], [0.21, -0.935, 0.008], [0.21, -0.915, 0.008], [0.19, POD.gland[1], 0.008], [0.05, POD.gland[1], 0.008]], { segments: 6, steps: 1, creaseDeg: 50, phi0: Math.PI / 6 }), M.chrome, o);

  // black coil spring around the plunger
  const sp = cont.part('damper-spring', {
    name: 'Damper Spring',
    info: 'Six-turn black oxide steel compression spring that pushes the plunger out against the lever arm and returns it after each stroke.',
    specs: { Material: 'Black-oxide spring steel', Turns: '6', Wire: 'dia 0.05 mm', Rate: '0.4 N/mm' },
    explode: exS(-0.45, 'fine'),
  });
  sp.add(springX(0.23, 0.026, 6, 0.23, 14, 6), M.black, [-1.09, DY, DZ]);

  // chrome plunger with gold spring seat
  const pi = cont.part('damper-piston', {
    name: 'Damper Plunger',
    info: 'Chrome plunger rod with a rounded nose that meets the lever arm, and a gold spring seat that takes the load of the coil spring.',
    specs: { Material: 'Chrome-plated steel rod, gold seat', Rod: 'dia 0.09 mm', Stroke: '0.35 mm' },
    explode: exS(-0.9, 'fine'),
  });
  pi.add(rx([[0, -1.2835], [0.025, -1.281], [0.04, -1.27], [0.045, -1.255], [0.045, -0.92], [0, -0.92]], { segments: S(24, 12), steps: 1 }), M.chrome, o);
  pi.add(loopX([[0.044, -1.235, 0.006], [0.24, -1.235, 0.012], [0.24, -1.205, 0.012], [0.044, -1.205, 0.006]], { segments: S(32, 14), steps: 1 }), M.gold, o);
  return cont;
}

/* ------------------------------------------------------------------ lever arm and flat return spring */

/** Hull of two circles (hub r0 at the origin, tip r1 at distance d along phi); counter-clockwise. */
function leverPts(r0, r1, d, phi, n0, n1) {
  const th = Math.acos((r0 - r1) / d);
  const cx = Math.cos(phi) * d, cy = Math.sin(phi) * d;
  const out = [];
  for (let i = 0; i <= n1; i++) { const a = phi - th + 2 * th * i / n1; out.push([cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]); }
  for (let i = 1; i < n0; i++) { const a = phi + th + (TAU - 2 * th) * i / n0; out.push([Math.cos(a) * r0, Math.sin(a) * r0]); }
  return out;
}

export function buildLever(mount) {
  const arm = mount.part('damper-arm', {
    name: 'Stop Lever Arm',
    info: 'Gunmetal lever clamped on the output shaft just behind the bearings; at the end of each wing stroke its tip meets the damper plunger.',
    specs: { Material: 'Gunmetal', Thickness: '0.04 mm', Reach: '1.82 mm from the shaft axis', Mass: '0.01 g' },
    explode: exS(-3.9, 'mid'),
  });
  const ux = Math.cos(AD), uy = Math.sin(AD);
  const holes = [
    circlePts(ARM.rBore, S(44, 22)),
    circlePts(0.045, 12, DY, DZ),
    slotPts(ux * 0.98, uy * 0.98, ux * 1.42, uy * 1.42, 0.085, 6),
  ];
  for (const k of [-1, 0, 1]) { const a = AD + Math.PI + k * 0.75; holes.push(circlePts(0.05, 10, Math.cos(a) * 0.68, Math.sin(a) * 0.68)); }
  const g = plateX(leverPts(ARM.rHub, ARM.rTip, RD, AD, S(28, 14), S(12, 6)), ARM.s[1] - ARM.s[0], { bevel: 0.01, bevelSegments: 1, steps: 2, holes });
  g.translate(ARM.s[0], 0, 0);
  arm.add(g, M.gunmetal);

  const rs = mount.part('return-spring', {
    name: 'Return Spring',
    info: 'Flat chrome clock spring wound around the shaft collar; it returns the wing hinge to centre and is pre-loaded against the stop lever.',
    specs: { Material: 'Chrome spring steel', Turns: '2.6', Band: '0.05 x 0.06 mm', Mass: '0.005 g' },
    explode: exS(-4.3, 'mid'),
  });
  const sg = toMountX(spiralBand({ turns: 2.6, r0: 0.47, r1: 0.93, w: 0.05, t: 0.058, n: 110 }));
  sg.translate(SPIRAL_S, 0, 0);
  rs.add(sg, M.chrome);
  return arm;
}

/* ------------------------------------------------------------------ harness and floating clamps */

const pol = (s, R, aDeg) => [s, R * Math.cos(aDeg * D2R), R * Math.sin(aDeg * D2R)];
/** Centre line of the signal harness in the mount frame: from the sensor board edge out along the free flank. */
export const harnessPath = () => [pol(-1.845, 0.78, 305), pol(-2.02, 0.90, 300), pol(-2.30, 1.20, 292), pol(-2.62, 1.55, 280), pol(-2.90, 1.78, 270)];

function clipMatrix(p, t, n) {
  const T = t.clone().normalize();
  const N = V3(n[0], n[1], n[2]);
  N.addScaledVector(T, -N.dot(T)).normalize();
  const Zb = new THREE.Vector3().crossVectors(N, T);
  return new THREE.Matrix4().makeBasis(N, T, Zb).setPosition(p.x, p.y, p.z);
}

export function buildHarness(mount, F) {
  const pts = harnessPath().map((p) => V3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);   // same curve geo.sweep builds from the points
  const hs = mount.part('harness', {
    name: 'Signal Harness',
    info: 'Corrugated black sleeve carrying the servo and encoder wires from the sensor board out along the free flank; yellow ferrules crimp both ends.',
    specs: { Material: 'Corrugated nylon sleeve, yellow ferrules', Conductors: '5 x 0.03 mm', Mass: '0.01 g' },
    explode: exS(-7.4, 'mid'),
  });
  hs.add(ribbedTube(pts, { radius: 0.07, ribs: 16, amp: 0.34, radial: 10, perRib: 5 }), M.black);
  const fer = loopRev([[0.074, 0, 0.01], [0.108, 0, 0.014], [0.108, 0.17, 0.014], [0.082, 0.17, 0.01]], { segments: S(22, 10), steps: 1 });
  const p0 = curve.getPointAt(0), t0 = curve.getTangentAt(0);
  const p1 = curve.getPointAt(1), t1 = curve.getTangentAt(1);
  hs.add(fer, M.yellow, mAt([p0.x, p0.y, p0.z], [t0.x, t0.y, t0.z]));
  const e1 = p1.clone().addScaledVector(t1, 0.05);
  hs.add(fer, M.yellow, mAt([e1.x, e1.y, e1.z], [-t1.x, -t1.y, -t1.z]));

  const fc = mount.part('floating-clamps', {
    name: 'Floating Harness Clamps',
    info: 'Two yellow P-clip clamps with gold screws that normally hold the harness to the mount; once released they hover beside the sleeve.',
    specs: { Material: 'Yellow anodised aluminium, gold screws', Count: '2 clamps', Mass: '0.004 g' },
    explode: exL([-7.5, 0.12, -0.70], 'mid'),
  });
  const ring = loopRev([[0.092, -0.05, 0.012], [0.136, -0.05, 0.014], [0.136, 0.05, 0.014], [0.092, 0.05, 0.012]], { segments: S(26, 12), steps: 1 });
  const tab = box(0.16, 0.1, 0.045, 0.012);
  tab.translate(0.19, 0, 0);
  for (const u of [0.38, 0.72]) {
    const p = curve.getPointAt(u), t = curve.getTangentAt(u);
    const m = clipMatrix(p, t, [0, p.y, p.z]);
    fc.add(ring, M.yellow, m);
    fc.add(tab, M.yellow, m);
    fc.add(F.cap(0.04), M.gold, m.clone().multiply(mAt([0.2, 0, 0.0225], [0, 0, 1])));
  }
  return hs;
}
