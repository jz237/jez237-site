// APX-9 head: partition of the yellow armour into plates (pure data + signed-distance fields; no parts are created).
// Every plate is an SDF in the plate coordinates of its own ellipsoid frame. Neighbouring plates share the same cuts on
// the head's normalised sphere (planes through the centre), inset by GAP/2, so plates can never overlap.
import { ellFrame, eyeKeep, pointKeep, cutPlane, cutPsi, onSphere, HC, HR, D2R, RM } from './head-util.js';
import { K } from '../skeleton.js';
import { circle, union, inter, sub, grow, band, rbox, stroke } from './head-sdf.js';

export const CLEAR = 0.5;      // yellow plates stay this far from the eye contour (contract: >= 0.35)
export const LINER_EYE = 0.5;  // the black liner keeps the same distance from the eye contour
export const GAP = 0.16;       // seam between neighbouring plates
const H2 = GAP / 2;

/** direction (bee-space ray from the head centre) for a point of the normalised sphere given as psi / lateral c */
export const dirPsi = (psiDeg, c = 0) => {
  const p = psiDeg * D2R, rho = Math.sqrt(Math.max(0, 1 - c * c));
  const u = [Math.cos(p) * rho, Math.sin(p) * rho, c];
  return [u[0] * HR[0], u[1] * HR[1], u[2] * HR[2]];
};

/* cuts (functions of the normalised-sphere vector u, negative on the named side) */
export const before = (psi) => cutPsi(psi, +1);   // angle < psi  (towards the face / chin)
export const behind = (psi) => cutPsi(psi, -1);   // angle > psi  (towards the crown / rear)
export const latLess = (c0) => cutPlane([0, 0, 1], c0);        // c < c0
export const latMore = (c0) => cutPlane([0, 0, -1], -c0);      // c > c0
export const xFront = (a0) => cutPlane([-1, 0, 0], -a0);       // a > a0 (in front of)
export const xBack = (a0) => cutPlane([1, 0, 0], a0);          // a < a0 (behind)

export const OCELLI = K.head.ocelli.map((p) => [p.x, p.y, p.z]);
export const ANT_BASE = K.head.antennaR.base.toArray();
export const ANT_DIR = K.head.antennaR.dir.toArray();
export const NECK_C = K.neck.c.toArray();
const mz = (a) => [a[0], a[1], -a[2]];
const shrink = (f) => grow(f, -H2);           // inset a shared cut by half a seam

/** sensor housing window on the lower face (centre-line) */
export const SENSOR = { psi: -14.5, hw: 0.84, hh: 1.25, r: 0.45 };
export const SENSOR_DIR = dirPsi(SENSOR.psi);
/** antenna socket hole in the plates (inner 0.6 + collar) */
export const ANT_HOLE = 0.7;
/** boundary between the lower face plate and the two forehead (brow) plates, psi in degrees */
export const FORE_PSI = 15;
/** boundary between the face plate and the clypeus, degrees */
export const LOW_PSI = -44;

/** distance from the neck axis of the surface point at plate (x, y), minus r: negative inside the socket opening */
const socket = (fr, r) => (x, y) => { const p = fr.point(x, y); return Math.hypot(p[1] - NECK_C[1], p[2] - NECK_C[2]) - r; };

/* ---- vent geometry shared by the plates (cut-outs) and the vent-slats part (louvres behind them) ---- */
const arcPts = (cx, cy, r, a0, a1, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * D2R; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
/** occipital vents: arc slots concentric with the neck socket, plate coordinates of 'occipital-plate' */
export const OCC_SLOTS = [
  { c: [0, 0.1], r: 2.86, a0: -140, a1: -40, w: 0.17 },
  { c: [0, 0.1], r: 3.2, a0: -128, a1: -52, w: 0.17 },
];
/** cheek vents (right cheek frame): across-the-plate slots */
export const CHEEK_SLOTS = [[0.5, -0.30, 0.32], [0.95, -0.27, 0.30], [1.4, -0.28, 0.22], [1.85, -0.33, 0.10], [2.3, -0.44, -0.05]].map(([y, x0, x1]) => ({ a: [x0, y], b: [x1, y], w: 0.15 }));
/** thermal-fin window in the crown plate (crown frame) */
export const FIN_WINDOW = { cx: 0, cy: -0.9, hw: 0.62, hh: 0.44, r: 0.12 };
const slotSdf = (s) => (s.a ? stroke([s.a, s.b], s.w / 2) : stroke(arcPts(s.c[0], s.c[1], s.r, s.a0, s.a1), s.w / 2));
export const slotLoops = (s) => (s.a ? [s.a, s.b] : arcPts(s.c[0], s.c[1], s.r, s.a0, s.a1));

/** Recipes. `make(fr)` returns f(x, y) (negative inside) for the plate; right-hand plates are designed with +Z. */
export const PLATES = {
  /* ---------------------------------------------------------------- centre-line plates */
  'face-plate': {
    frame: { dir: dirPsi(-8), up: [0, 1, 0] }, box: [-2.9, -3.6, 2.9, 3.6], step: 0.05,
    make(fr) {
      const S = (g) => onSphere(fr, g);
      const kR = eyeKeep(fr, 1, CLEAR), kL = eyeKeep(fr, -1, CLEAR);
      const body = inter(shrink(S(before(FORE_PSI))), shrink(S(behind(LOW_PSI))), shrink(S(latLess(0.40))), shrink(S(latMore(-0.40))));
      const sc = fr.inv(headPoint2(SENSOR_DIR));
      const win = rbox(sc[0], sc[1], SENSOR.hw + H2, SENSOR.hh + H2, SENSOR.r + H2);
      return sub(body, kR, kL, win);
    },
  },
  'clypeus-plate': {
    frame: { dir: dirPsi(-64), up: [0, 1, 0] }, box: [-2.7, -2.7, 2.7, 2.7], step: 0.05,
    make(fr) {
      const S = (g) => onSphere(fr, g);
      const kR = eyeKeep(fr, 1, CLEAR), kL = eyeKeep(fr, -1, CLEAR);
      const body = inter(shrink(S(before(LOW_PSI))), S(behind(-104)), shrink(S(latLess(0.40))), shrink(S(latMore(-0.40))));
      return sub(body, kR, kL);
    },
  },
  'crown-plate': {
    frame: { dir: dirPsi(86), up: [1, 0, 0] }, box: [-1.9, -3.2, 1.9, 3.2], step: 0.05,
    make(fr) {
      const S = (g) => onSphere(fr, g);
      const kR = eyeKeep(fr, 1, CLEAR), kL = eyeKeep(fr, -1, CLEAR);
      const oc = pointKeep(fr, OCELLI, 0.86, 0.0);
      const body = inter(shrink(S(behind(56))), shrink(S(before(116))));
      const fw = rbox(FIN_WINDOW.cx, FIN_WINDOW.cy, FIN_WINDOW.hw + H2, FIN_WINDOW.hh + H2, FIN_WINDOW.r);
      return sub(body, kR, kL, oc, fw);
    },
  },
  'occipital-plate': {
    frame: { dir: [-1, 0, 0], up: [0, 1, 0] }, box: [-3.4, -3.5, 3.4, 3.5], step: 0.05,
    make(fr) {
      const S = (g) => onSphere(fr, g);
      const kR = eyeKeep(fr, 1, CLEAR), kL = eyeKeep(fr, -1, CLEAR);
      const body = shrink(S(xBack(-0.45)));
      const sock = socket(fr, 2.2 + 0.1);
      return sub(body, kR, kL, sock, ...OCC_SLOTS.map(slotSdf));
    },
  },
  /* ---------------------------------------------------------------- right-hand plates */
  'brow-plate-r': {
    frame: { dir: dirPsi(30, 0.3), up: [0, 1, 0] }, box: [-2.6, -3.0, 2.6, 3.0], step: 0.05,
    make(fr) {
      const S = (g) => onSphere(fr, g);
      const k1 = eyeKeep(fr, 1, CLEAR);
      const hole = pointKeep(fr, [ANT_BASE], ANT_HOLE, 0);
      const body = inter(shrink(S(before(54))), shrink(S(behind(FORE_PSI))), shrink(S(latMore(0))));
      return sub(body, k1, hole);
    },
  },
  'cheek-plate-r': {
    frame: { dir: dirPsi(-96, 0.55), up: [1, 0, 0] }, box: [-3.4, -3.4, 3.4, 3.4], step: 0.05,
    make(fr) {
      const S = (g) => onSphere(fr, g);
      const k1 = eyeKeep(fr, 1, CLEAR);
      const body = inter(shrink(S(latMore(0.40))), shrink(S(xFront(-0.45))), shrink(S(before(FORE_PSI))));
      return sub(body, k1, ...CHEEK_SLOTS.map(slotSdf));
    },
  },
  /* ---------------------------------------------------------------- black under-shell (liner) halves */
  'liner-r': {
    frame: { dir: [0, 0, 1], up: [0, 1, 0] }, box: [-5.6, -5.6, 5.6, 5.6], step: 0.1, fine: false,
    make(fr) {
      const rho = 3.5 * 88 * D2R;
      const sock = socket(fr, 2.35);
      const holes = [pointKeep(fr, [ANT_BASE], 0.8, 0), pointKeep(fr, OCELLI, 0.96, 0)];
      return sub(circle(0, 0, rho), sock, eyeKeep(fr, 1, LINER_EYE), ...holes);
    },
  },
};
export function plateFrame(name) {
  const def = PLATES[name];
  return ellFrame(def.frame.dir, def.frame.up, def.frame.roll || 0);
}

/* ---- helpers needing the plate frame ---- */
/** point of the head surface along a ray from the centre (dir in bee space, any length) */
export function headPoint2(dir) {
  // point of the head surface along a ray from the centre
  const t = 1 / Math.hypot(dir[0] / HR[0], dir[1] / HR[1], dir[2] / HR[2]);
  return [HC[0] + dir[0] * t, HC[1] + dir[1] * t, HC[2] + dir[2] * t];
}
void RM; void circle; void band;
