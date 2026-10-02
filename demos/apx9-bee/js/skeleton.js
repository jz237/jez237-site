// APX-9 reference skeleton. Every assembly is modelled against these numbers so the six jobs mate up.
// Units: millimetres.  Bee space: +X forward (head), +Y up (dorsal), +Z the bee's RIGHT side.
// Origin: the thorax centre line at its lower third. The assembled bee is ~28 mm long, ~52 mm across the wings.
import * as THREE from 'three';
import { D2R, V3 } from './geo.js';

/** Smooth 1-D profile through [u, value] control points (cubic Hermite / Catmull-Rom). */
export function profile(pts) {
  const n = pts.length;
  return (u) => {
    if (u <= pts[0][0]) return pts[0][1];
    if (u >= pts[n - 1][0]) return pts[n - 1][1];
    let i = 0;
    while (u > pts[i + 1][0]) i++;
    const [u0, y0] = pts[i];
    const [u1, y1] = pts[i + 1];
    const a = pts[Math.max(i - 1, 0)];
    const b = pts[Math.min(i + 2, n - 1)];
    const h = u1 - u0;
    const t = (u - u0) / h;
    const m0 = ((y1 - a[1]) / (u1 - a[0])) * h;
    const m1 = ((b[1] - y0) / (b[0] - u0)) * h;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * m1;
  };
}

const MIRROR_Z = new THREE.Matrix4().makeScale(1, 1, -1);
const mirrorV = (a) => [a[0], a[1], -a[2]];

/* ------------------------------------------------------------------ abdomen */
// Local abdomen frame: origin at the petiole (waist) joint, +X forward along the abdomen axis, the tail extends
// along local -X. The whole abdomen is tipped tail-down by `tilt` about the bee-space Z axis.
const abdomenTilt = 9 * D2R;
const abdomenOrigin = V3(-1.15, 0.55, 0);
const abdomenFrame = new THREE.Matrix4()
  .makeTranslation(abdomenOrigin.x, abdomenOrigin.y, abdomenOrigin.z)
  .multiply(new THREE.Matrix4().makeRotationZ(abdomenTilt));
// Outer shell radius as a function of distance a (0..LEN) behind the petiole (height half-extent).
const ABD_LEN = 11.6;
const abdomenR = profile([[0, 2.2], [0.8, 3.6], [2.2, 4.7], [4.4, 5.0], [6.6, 4.6], [8.6, 3.5], [10.2, 2.0], [11.0, 1.2], [ABD_LEN, 0.9]]);

/* ------------------------------------------------------------------ wings */
// Wing local frame: x = span (root -> tip), y = toward the leading edge, z = upper-surface normal.
// The origin is the wing hinge. Right wing is built; the left wing is its mirror image.
const wingRoot = V3(2.4, 3.9, 2.5);
const wingSpan = V3(-0.72, 0.32, 0.62).normalize();
const wingLead = (() => {
  const f = V3(1, 0, 0);
  f.addScaledVector(wingSpan, -f.dot(wingSpan)).normalize();
  return f.applyAxisAngle(wingSpan, 15 * D2R);   // roll about the span so more of the membrane faces the hero camera
})();
const wingNormal = new THREE.Vector3().crossVectors(wingSpan, wingLead).normalize();
const wingFrameR = new THREE.Matrix4().makeBasis(wingSpan, wingLead, wingNormal).setPosition(wingRoot);

export const K = {
  length: 28,
  wingspan: 52,
  mass: 12,

  thorax: {
    c: V3(2.9, 0.8, 0),
    r: V3(4.3, 4.2, 4.2),            // outer armour envelope (inside the fur)
    furR: V3(5.1, 4.9, 4.9),         // visible fuzzy envelope
    x0: -1.4, x1: 7.2,
  },

  head: {
    c: V3(10.6, 0.1, 0),
    r: V3(3.2, 3.6, 3.5),            // shell envelope
    faceX: 13.7,                     // front of the face plate
    neck: V3(7.4, 0.2, 0),           // neck joint to the thorax
    eyeR: { c: V3(10.9, 0.9, 2.55), r: V3(2.5, 3.0, 1.9) },   // right compound eye ellipsoid (mirror for left)
    antennaR: { base: V3(13.1, 1.6, 1.0), dir: V3(0.82, 0.38, 0.42).normalize() },
    ocelli: [V3(11.6, 3.3, 0), V3(10.9, 3.2, 1.3), V3(10.9, 3.2, -1.3)],
  },

  abdomen: {
    frame: abdomenFrame,
    tilt: abdomenTilt,
    origin: abdomenOrigin,
    len: ABD_LEN,
    R: abdomenR,                     // (a) => outer radius at distance a behind the petiole
    aspect: 1.04,                    // width / height
    tail: V3(-12.5, -1.9, 0),        // approx. bee-space position of the stinger root
    stingerTip: V3(-14.4, -3.0, 0),
  },

  wing: {
    root: wingRoot,
    frameR: wingFrameR,
    frame(side = 1) { return side >= 0 ? wingFrameR.clone() : MIRROR_Z.clone().multiply(wingFrameR); },
    span: 23.5,                      // hinge -> tip
    chord: 9.0,                      // max chord
    span2: wingSpan,
    lead: wingLead,
    normal: wingNormal,
  },

  // Leg sockets on the thorax underside and the intended foot-contact points (right side; mirror z for left).
  legs: [
    { id: 'front', coxa: V3(6.0, -3.5, 2.5), foot: V3(11.6, -14.0, 6.6), pair: 0 },
    { id: 'mid',   coxa: V3(3.1, -3.9, 3.0), foot: V3(3.6, -14.0, 9.0),  pair: 1 },
    { id: 'rear',  coxa: V3(0.2, -3.6, 2.8), foot: V3(-6.2, -14.0, 7.2), pair: 2 },
  ],
  footLevel: -14.0,

  // Internal volumes shared by several assemblies.
  core: { c: V3(1.6, 0.3, 0), r: 1.9, len: 6.5 },          // central power core axis lies along X
  pollination: { c: V3(3.6, -4.9, 0), r: 1.9, len: 6.0 }, // barrel under the thorax, brush toward the front
};

/** Outward normal of every hip mount plate (right side; mirror z for the left). The hip servos rotate about it. */
export const HIP_N = V3(0, -0.9, 0.44).normalize();

// The abdomen shell ends at a = split; the tail module (stabilizer ring + stinger) takes over from there. Both are
// modelled in the abdomen-local frame (container matrix K.abdomen.frame), cross-section at distance a:
//   local point = (-a, R(a) cos(phi), R(a) * aspect * sin(phi))
K.abdomen.split = 9.0;
K.abdomen.rSplit = abdomenR(9.0);
K.abdomen.tipLocal = K.abdomen.stingerTip.clone().applyMatrix4(abdomenFrame.clone().invert());   // stinger tip, abdomen-local

K.neck = { c: V3(7.4, 0.2, 0), r: 2.0 };                  // head <-> thorax joint, axis along X
K.petiole = { c: abdomenOrigin.clone(), r: 2.2 };         // thorax <-> abdomen joint, axis along the abdomen X (tilted 9 deg)

/**
 * Closed curve (right side, bee space) where the right compound-eye ellipsoid emerges from the head-shell
 * ellipsoid: the orbital rim frame follows it. n points, counter-clockwise seen from +Z. Mirror z for the left eye.
 */
export function eyeContour(n = 96) {
  const e = K.head.eyeR, h = K.head;
  const f = (p) => ((p.x - h.c.x) / h.r.x) ** 2 + ((p.y - h.c.y) / h.r.y) ** 2 + ((p.z - h.c.z) / h.r.z) ** 2 - 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2, dx = Math.cos(th), dy = Math.sin(th);
    const at = (phi) => V3(e.c.x + e.r.x * Math.sin(phi) * dx, e.c.y + e.r.y * Math.sin(phi) * dy, e.c.z + e.r.z * Math.cos(phi));
    let lo = 0, hi = Math.PI;
    const steps = 240;
    for (let k = 1; k <= steps; k++) {
      const phi = (k / steps) * Math.PI;
      if (f(at(phi)) < 0) { hi = phi; lo = ((k - 1) / steps) * Math.PI; break; }
    }
    for (let it = 0; it < 28; it++) { const mid = (lo + hi) / 2; if (f(at(mid)) < 0) hi = mid; else lo = mid; }
    out.push(at((lo + hi) / 2));
  }
  return out;
}

/** Bee-space point on the thorax armour ellipsoid in the direction d (from the thorax centre). */
export function thoraxPoint(d, k = 1) {
  const c = K.thorax.c, r = K.thorax.r;
  const q = d.clone().divide(r);
  const t = 1 / q.length();
  return d.clone().multiplyScalar(t * k).add(c);
}

export const mirrorPos = mirrorV;
export { MIRROR_Z };
