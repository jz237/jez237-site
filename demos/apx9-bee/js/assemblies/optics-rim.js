// optics-rim.js - thick chamfered yellow orbital rim, black gasket ring and rim screws (all follow eyeContour()).
import { THREE, V3, S } from '../kit.js';
import { screwWithWasher } from './optics-hw.js';
import { eyeFrame, contourFrames, sweepProfile, circleSection, clamp } from './optics-frame.js';

/** Rim cross-section (o along the outward in-surface direction, h along the head normal), traversed CCW. */
function rimProfile(f) {
  const L = f.lean;
  const wi = (h) => -L * h;               // inner wall follows the dome wall (tangent plane of the eye ellipsoid)
  return [
    [0.84, -0.14],                        // buried outer foot
    [0.84, 0.10],
    [0.81, 0.20],                         // outer fillet
    [0.74, 0.29],
    [0.60, 0.40],                         // outer chamfer
    [0.30, 0.40],                         // flat top
    [0.19, 0.335],                        // inner chamfer
    [0.12, 0.335],                        // small inner shoulder
    [0.12, 0.25],
    [wi(0.22) + 0.04, 0.22],              // seat for the gasket
    [wi(-0.14) + 0.04, -0.14],            // buried inner foot
  ];
}

/** Returns { yellow, gasket, screwItems, washerItems } in bee space. */
export function buildRim() {
  const F = eyeFrame();
  const frames = contourFrames(S(140, 80));
  const yellow = sweepProfile(frames, rimProfile, { crease: 38, uvTile: 2.2 });
  const gasket = sweepProfile(frames, (f) => circleSection(-f.lean * 0.17 - 0.03, 0.18, 0.17, S(10, 6)), { crease: 60, uvTile: 1.6, closedProfile: true });

  // screw positions: evenly spaced by arc length on the flat top
  const nScrew = 17;
  const items = [];
  const total = frames.total;
  const pos = (s) => {
    let k = 0;
    while (k < frames.length - 2 && frames[k + 1].s < s) k++;
    const a = frames[k], b = frames[k + 1];
    const t = clamp((s - a.s) / Math.max(b.s - a.s, 1e-6), 0, 1);
    const P = a.P.clone().lerp(b.P, t);
    const O = a.O.clone().lerp(b.O, t).normalize();
    const n = a.n.clone().lerp(b.n, t).normalize();
    return { P, O, n };
  };
  for (let i = 0; i < nScrew; i++) {
    const { P, O, n } = pos(((i + 0.5) / nScrew) * total);
    const Q = P.clone().addScaledVector(O, 0.45).addScaledVector(n, 0.40);
    items.push({ P: Q, n });
  }
  return { yellow, gasket, items, frames };
}

/** Rim screw: washer + socket cap head with hex recess, head up +Y. */
export function rimScrewGeo() {
  return screwWithWasher(0.125, 0.085, { washerR: 1.55, washerH: 0.035, seg: 12 });
}
