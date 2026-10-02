// Gimbal ring: black C-arcs with chrome clamp blocks and actuator lugs, a chrome ball-bearing ring around the mouth of a
// conical turbine funnel lined with gold swirl blades, a stepped aft hub, four spokes and two trunnion pins.
// Modelled about +Y = the stinger axis (y = s, distance from the a = 9 ring centre); the node carries stingerFrame(0).
import { M, ex, V3, THREE, D2R, cyl, plate, shape, box, sphere, circlePts } from '../kit.js';
import {
  GIM, AXD, ACT, LUG_R, toGimbal, stingerFrame, lathe, ringGeo, arcFrames, sweepFrames, rrect, poly, hexBolt, placeM, swirlBlade, clamp, lerp, radialM,
} from './tail-common.js';

const S0 = GIM.s, RR = GIM.rRing;
/** Inner radius of the turbine funnel at axial position s. */
export const funnelR = (s) => 1.05 + 0.3 * Math.pow(clamp((2.15 - s) / 1.11, 0, 1), 2);
const F0 = 1.04, F1 = 2.2;

/** Frame of a plate lying in the radial-axial plane at angle th: plate x = radial, y = axial, z = tangential. */
const plateM = (th, s = S0) => new THREE.Matrix4().makeBasis(V3(Math.cos(th), 0, Math.sin(th)), V3(0, 1, 0), V3(-Math.sin(th), 0, Math.cos(th))).setPosition(0, s, 0);

/** Polygon of a tapered bar between two points in plate (radial, axial) coordinates. */
function barPts(p1, p2, w1, w2) {
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1], l = Math.hypot(dx, dy);
  const nx = -dy / l, ny = dx / l;
  return [[p1[0] + nx * w1, p1[1] + ny * w1, 0.02], [p2[0] + nx * w2, p2[1] + ny * w2, 0.02], [p2[0] - nx * w2, p2[1] - ny * w2, 0.02], [p1[0] - nx * w1, p1[1] - ny * w1, 0.02]];
}

const TAU = Math.PI * 2;
const WALLT = 0.045;
/** d funnelR / ds */
const dFun = (s) => (s >= 2.15 || s <= 1.04 ? 0 : (-0.6 * (2.15 - s)) / (1.11 * 1.11));
/** Point (offset `off` outside the outer wall) with outward normal n and tangent t (towards +s) of the funnel wall at (s, th). */
function wallFrame(s, th, off = 0) {
  const c = Math.cos(th), sn = Math.sin(th), d = dFun(s), L = Math.hypot(1, d);
  const rad = V3(c, 0, sn);
  const r = funnelR(s) + WALLT + off;
  return { p: V3(r * c, s, r * sn), n: rad.clone().multiplyScalar(1 / L).add(V3(0, -d / L, 0)), t: rad.clone().multiplyScalar(d / L).add(V3(0, 1 / L, 0)) };
}
/** Low-poly domed cap screw, head up (+Y), base at y = 0. */
const CAP = lathe([[0, 0], [0.03, 0], [0.03, 0.022, 0.008], [0.017, 0.034], [0, 0.034]], { segments: 8, steps: 1 });
const RIB = poly([[-0.034, -0.02], [0.034, -0.02], [0.028, 0.045], [0.015, 0.078], [-0.015, 0.078], [-0.028, 0.045]], 1);
const FLANGES = [1.38, 1.7, 1.98];

function funnel(g) {
  // polished chrome trumpet casing (outer surface first so the normals face out), mouth in the bearing race
  const N = 28, W = WALLT, loop = [];
  for (let i = 0; i <= N; i++) { const s = lerp(F0, F1, i / N); loop.push([funnelR(s) + W, s, i === 0 ? 0.012 : 0]); }
  for (let i = N; i >= 0; i--) { const s = lerp(F0, F1, i / N); loop.push([funnelR(s), s, i === 0 ? 0.012 : 0]); }
  loop.push(loop[0].slice(0, 2));
  g.add(lathe(loop, { segments: 96, steps: 1, creaseDeg: 45 }), M.chrome);
  // sixteen black stiffening ribs along the casing and three black flange rings with sixteen chrome screws each
  const NR = 16;
  for (let k = 0; k < NR; k++) {
    const th = ((k + 0.5) / NR) * TAU, frames = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14, f = wallFrame(lerp(1.1, 2.1, u), th, 0);
      frames.push({ ...f, h: lerp(1, 0.55, u) });
    }
    g.add(sweepFrames(frames, RIB, { creaseDeg: 50 }), M.black);
  }
  for (const s of FLANGES) {
    const rr = funnelR(s) + W;
    g.add(lathe([[rr - 0.03, s - 0.04], [rr + 0.07, s - 0.04, 0.016], [rr + 0.07, s + 0.04, 0.016], [rr - 0.03, s + 0.04], [rr - 0.03, s - 0.04]], { segments: 96, steps: 1, creaseDeg: 45 }), M.black);
    const items = [];
    for (let k = 0; k < NR; k++) { const th = (k / NR) * TAU, c = Math.cos(th), sn = Math.sin(th); items.push(placeM(V3((rr + 0.064) * c, s, (rr + 0.064) * sn), V3(c, 0, sn))); }
    g.addMany(CAP, M.chrome, items);
  }
  // stepped aft hub: chrome body, black band and end flange carrying twelve screws on its rim
  g.add(lathe([[1.05, 2.12], [1.17, 2.12, 0.02], [1.17, 2.32], [1.10, 2.32], [1.10, 2.55, 0.02], [1.05, 2.55], [1.05, 2.12]], { segments: 72 }), M.chrome);
  g.add(ringGeo(1.12, 1.19, 2.19, 2.27, 0.014, { segments: 72 }), M.black);
  g.add(lathe([[1.06, 2.44], [1.18, 2.44, 0.012], [1.18, 2.55, 0.012], [1.06, 2.55], [1.06, 2.44]], { segments: 72, steps: 1 }), M.black);
  const hs = [];
  for (let k = 0; k < 12; k++) { const th = ((k + 0.5) / 12) * TAU, c = Math.cos(th), sn = Math.sin(th); hs.push(placeM(V3(1.174 * c, 2.495, 1.174 * sn), V3(c, 0, sn))); }
  g.addMany(CAP, M.chrome, hs);
  // swirl blades on the inside wall: stand taller towards the mouth so their tips stay on a 0.9 mm radius around the probe
  const NB = 16;
  for (let k = 0; k < NB; k++) {
    g.add(swirlBlade({ rOf: (s) => funnelR(s) + 0.004, s0: 1.1, s1: 2.14, th0: (k / NB) * TAU, sweep: 1.15, H: (s) => clamp(funnelR(s) - 0.9, 0.17, 0.42), thick: 0.032, n: 16, taper: 0.4, inward: true }), M.gold);
  }
}

function bearing(g) {
  const Y = S0 - 0.06;
  g.add(lathe([[1.3, Y], [1.355, Y], [1.37, Y + 0.03], [1.4, Y + 0.045], [1.43, Y + 0.03], [1.445, Y], [1.5, Y, 0.02], [1.5, Y + 0.14, 0.02], [1.3, Y + 0.14, 0.02], [1.3, Y]], { segments: 96, creaseDeg: 40 }), M.chrome);
  const ball = sphere(0.046, { segments: 10, rings: 7 });
  const items = [];
  for (let k = 0; k < 28; k++) { const a = (k / 28) * Math.PI * 2; items.push([1.4 * Math.cos(a), Y, 1.4 * Math.sin(a)]); }
  g.addMany(ball, M.chrome, items);
}

function frame(g) {
  const c = V3(0, S0, 0), u = V3(1, 0, 0), w = V3(0, -1, 0);
  const arcP = rrect(0.26, 0.14, 0.04, 3), inlay = rrect(0.06, 0.03, 0.01, 2);
  for (const deg of [0, 90, 180, 270]) {
    const a0 = (deg - 39) * D2R, a1 = (deg + 39) * D2R;
    g.add(sweepFrames(arcFrames(c, u, w, RR, a0, a1, 20), arcP, { creaseDeg: 50 }), M.black);
    g.add(sweepFrames(arcFrames(c, u, w, RR + 0.078, a0 + 0.1, a1 - 0.1, 18), inlay, { creaseDeg: 50 }), M.chrome);
  }
  // chrome clamp blocks bridging the diagonal gaps, each with a clevis lug for its actuator, and a black spoke to the hub
  const block = box(0.46, 0.32, 0.2, 0.03), bolt = hexBolt(0.04, 0.04, 8);
  const cheek = plate(shape([[1.62, -0.14, 0], [1.92, -0.14, 0.1], [1.92, 0.14, 0.1], [1.62, 0.14, 0]], [circlePts(0.05, 14, LUG_R, 0)]), 0.07, { bevel: 0.015, bevelSegments: 2, center: true, steps: 4, uvScale: 0.6 });
  const pin = cyl(0.04, 0.32, { bevel: 0.01, segments: 14, axis: 'z', y0: -0.16 }), nut = cyl(0.062, 0.03, { bevel: 0.008, segments: 14, axis: 'z', y0: 0 });
  for (const a of ACT) {
    const th = a.th, c0 = Math.cos(th), s0 = Math.sin(th);
    g.add(block, M.chrome, radialM(th, RR, S0));
    for (const d of [-0.1, 0.1]) g.add(bolt, M.chrome, placeM(V3((RR + 0.1) * c0, S0 + d, (RR + 0.1) * s0), V3(c0, 0, s0)));
    g.add(plate(shape(barPts([RR + 0.03, 0.12], [1.15, 1.3], 0.075, 0.05), [circlePts(0.03, 12, 1.45, 0.592), circlePts(0.028, 12, 1.3, 0.946)]), 0.1, { bevel: 0.014, bevelSegments: 2, center: true, steps: 3, uvScale: 0.6 }), M.black, plateM(th));
    // clevis cheeks stand in the plane that contains the pushrod (x = radial, y = rod direction, z = pin axis)
    const rg = toGimbal(a.radL), hg = toGimbal(a.hL), zg = new THREE.Vector3().crossVectors(rg, hg);
    const Ml = new THREE.Matrix4().makeBasis(rg, hg, zg).setPosition(0, S0, 0);
    const at = (x, y, z) => Ml.clone().multiply(new THREE.Matrix4().makeTranslation(x, y, z));
    g.add(cheek, M.chrome, at(0, 0, 0.13));
    g.add(cheek, M.chrome, at(0, 0, -0.13));
    g.add(pin, M.chrome, at(LUG_R, 0, 0));
    g.add(nut, M.chrome, at(LUG_R, 0, 0.165));
    g.add(nut, M.chrome, at(LUG_R, 0, -0.195));
  }
  // trunnion pins through the arc centres at 90 and 270 deg
  const tp = cyl(0.055, 0.66, { bevel: 0.012, segments: 16, y0: 0 }), cap = cyl(0.085, 0.04, { bevel: 0.012, segments: 16, y0: 0 });
  const collar = cyl(0.1, 0.04, { bevel: 0.01, segments: 16, y0: 0 });
  for (const th of [Math.PI / 2, (3 * Math.PI) / 2]) {
    const c0 = Math.cos(th), s0 = Math.sin(th), n = V3(c0, 0, s0);
    g.add(tp, M.chrome, placeM(V3(1.32 * c0, S0, 1.32 * s0), n));
    g.add(collar, M.chrome, placeM(V3(1.74 * c0, S0, 1.74 * s0), n));
    g.add(cap, M.chrome, placeM(V3(1.96 * c0, S0, 1.96 * s0), n));
  }
}

export function buildGimbal(stab) {
  const g = stab.part('gimbal-ring', {
    name: 'Gimbal Ring Assembly', matrix: stingerFrame(0),
    info: 'Black C-ring on chrome clamp blocks around a ball-bearing race and a conical turbine funnel lined with gold swirl blades; the four actuators tilt it so the stinger can aim.',
    specs: { Material: 'Black anodised ring and funnel, hard-chrome bearing race, gold swirl blades', Mass: '0.045 g', Function: 'Two-axis stinger gimbal and exhaust swirl', Dimensions: '3.8 mm ring diameter, 1.5 mm deep' },
    explode: ex([AXD.x * 2.6, AXD.y * 2.6, 0], 'mid', null, 'local'),
  });
  frame(g);
  bearing(g);
  funnel(g);
  return g;
}
