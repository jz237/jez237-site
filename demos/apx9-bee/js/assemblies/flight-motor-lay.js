// Flight motor layout constants shared by the flight-motor-*.js modules. Millimetres.
// Motor-local frame: origin at bee (2.5, 3.6, 0), no rotation: +X forward, +Y up, +Z bee-right (identical to bee axes).
import { V3 } from '../kit.js';
import { TAU } from './flight-util.js';

export const MOTOR_POS = [2.5, 3.6, 0];

export const LAY = {
  W: 0.78,                         // tray half width (z)
  x0: -1.92, x1: 1.30,             // tray extent along x
  base: [-1.30, -1.19],            // flange stack (plates under the tray)
  floor: [-1.19, -1.09],           // tray floor
  rim: -0.80,                      // top of the tray walls
  wall: 0.075,
  // vertical-axis gear train, module 0.07, all on z = 0
  g1: -1.30, g2: -0.39, g3: 0.52,
  yLo: [-0.88, -0.74],             // gear level 1: motor pinion G1 and the big gear of the compound G2
  yHi: [-0.70, -0.56],             // gear level 2: small gear of the compound G2 and the crank gear G3
  camY: [-0.52, -0.44],            // cam disc above the compound gear
  crankR: 0.22, crankA: 70,        // crank pin radius (mm) and angle on the crank gear (deg, from +x toward +z)
  rodY: -0.42,                     // slider / output-rod axis height
  canY: [-0.45, 0.40],             // drive-motor can
  pcbY: [0.20, 0.24],              // controller board
};

/* ------------------------------------------------------------------ fixed hardware positions (x, z) */
export const PINS = [[-1.66, -0.64], [-1.66, 0.64], [1.04, -0.64], [1.04, 0.64]];                      // hanging pins through the flange stack
export const BOLTS = [[-1.15, -0.64], [-1.15, 0.64], [-0.30, -0.64], [-0.30, 0.64], [0.45, -0.64], [0.45, 0.64]];   // flange bolts
export const POSTS = { rear: [[0.15, -0.62], [0.15, 0.62]], front: [[1.08, -0.46], [1.08, 0.46]] };   // PCB posts (rear short, front tall)
export const SO_R = 0.49;                                                                              // standoff radius around the motor axis
export const STANDOFFS = [120, 180, 240].map((a) => [LAY.g1 + Math.cos(a * Math.PI / 180) * SO_R, Math.sin(a * Math.PI / 180) * SO_R]);
export const PORT = { x: 0.65, y: -0.95 };                                                             // coupling ports on the tray flanks (z = +-W)

/* ------------------------------------------------------------------ gears (module 0.07) */
export const MOD = 0.07;
export const gearSpec = (N) => { const R = N * MOD / 2; return { N, R, tip: R + MOD, root: R - 1.25 * MOD, p: TAU / N }; };
export const G1 = gearSpec(10);     // motor pinion
export const G2A = gearSpec(16);    // compound, big gear (meshes G1)
export const G2B = gearSpec(10);    // compound, small gear (meshes G3)
export const G3 = gearSpec(16);     // crank gear
// Meshing phases (all gears share the line of centres +x): when A carries a tooth on the line, B must carry a gap there.
export const PH = { g1: 0, g2a: Math.PI - 0.5 * G2A.p, g2b: 0, g3: Math.PI - 0.5 * G3.p };

/** Crank pin position (motor-local x, z). */
export function crankXZ() {
  const a = LAY.crankA * Math.PI / 180;
  return [LAY.g3 + Math.cos(a) * LAY.crankR, Math.sin(a) * LAY.crankR];
}

/* ------------------------------------------------------------------ slider-crank + cam */
export const LINK = { L: 0.31, rodEnd: 1.90, guideX: [0.70, 1.21], blockBack: 0.045, blockFront: 0.16, conrodY: [-0.445, -0.395], blockY: [-0.515, -0.325] };
/** Crank pin (cx, cz) and slider pin x (sx) for the displayed pose. */
export function linkPose() {
  const [cx, cz] = crankXZ();
  return { cx, cz, sx: cx + Math.sqrt(LINK.L * LINK.L - cz * cz) };
}
export const CAM = { r0: 0.19, lift: 0.085, a0: -52, roller: 0.045, pivot: [0.065, -0.56] };
/** Cam radius at world angle a (degrees from +x toward +z). */
export const camR = (a) => CAM.r0 + CAM.lift * 0.5 * (1 + Math.cos((a - CAM.a0) * Math.PI / 180));

/* ------------------------------------------------------------------ hood (yellow upper shell) */
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const HOOD = { xr: -1.92, xf: -0.20, t: 0.06, kz: 0.30, top: 0.66, droop: 0.20, d0: -1.45, d1: -1.92 };
HOOD.xc = (HOOD.xr + HOOD.xf) / 2;
HOOD.len = HOOD.xf - HOOD.xr;
/** Height of the hood plate underside on the centre line, dropping toward the rear. */
export const hoodY0 = (x) => HOOD.top - HOOD.droop * smooth(HOOD.d0, HOOD.d1, x);
/** Height of the hood plate underside: gentle barrel across z. */
export const hoodY = (x, z) => hoodY0(x) - HOOD.kz * z * z;
/**
 * armorPanel / decalPatch surface for the hood top. Plate (u, v) maps to bee x = xc + u + du, bee z = -(v + dv), so text
 * (plate +y up) reads upright when seen from the bee's right side. du/dv shift the plate origin (decals).
 */
export function hoodSurface(du = 0, dv = 0) {
  return (u, v) => {
    const x = HOOD.xc + u + du, z = -(v + dv);
    const h = 1e-3;
    const dydx = (hoodY0(x + h) - hoodY0(x - h)) / (2 * h);
    const dydz = -2 * HOOD.kz * z;
    return { p: V3(x, hoodY(x, z), z), n: V3(-dydx, 1, -dydz).normalize() };
  };
}
