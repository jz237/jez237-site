// Stinger cluster, modelled about +Y = the stinger axis with y = s (distance from the a = 9 ring centre); every leaf node carries
// stingerFrame(0), +X = dorsal-ish, +Z = bee right. Leaves: root-mount (flange, gussets, clamp crown), joint-1 (ball joint in a six-claw
// housing on a gold shaft), valve (black clamp ring + gold cage, thumb lever, hose barb), ampoule (amber vial in a gold cage),
// scanner-head (side camera module) and joint-2 (chrome hinge ring in two black C-clamps).
// Stack (s): root 0-0.56 | ball joint 0.6-1.36 | valve 1.34-1.70 | ampoule 1.70-2.10 | hinge ring 2.12-2.42 | sheath from 2.40.
// Everything inside the gimbal funnel (s 1.04-2.14) stays under radius 0.8 (the swirl blades reach in to 0.88).
import { THREE, M, V3, cyl, cone, box, plate, shape, sphere } from '../kit.js';
import { lathe, ringGeo, ballGeo, placeM, hexBolt, sweepFrames, rrect, arcFrames, lerp } from './tail-common.js';

const TAU = Math.PI * 2;
const qY = (a) => new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), a);
const azi = (n, ph = 0) => Array.from({ length: n }, (_, i) => ph + (i / n) * TAU);
const cs = Math.cos, sn = Math.sin;
/** Frame at radius r, azimuth th (from +X towards +Z), height y with local +Y pointing radially outward (screw heads, pins, levers). */
const radM = (r, y, th, s = 1, roll = 0) => placeM(V3(r * cs(th), y, r * sn(th)), V3(cs(th), 0, sn(th)), roll, s);
/** Placement for a plate/box built with x = radial, y = axial, z = tangential. */
const lugX = (r, y, th) => ({ p: [r * cs(th), y, r * sn(th)], q: qY(-th) });
/** Arc band about +Y: centre-line radius r, height y, th0..th1, axial width w, radial thickness t. */
const arcBand = (r, y, th0, th1, w, t, n = 8, o = {}) =>
  sweepFrames(arcFrames(V3(0, y, 0), V3(1, 0, 0), V3(0, -1, 0), r, th0, th1, n), rrect(w, t, Math.min(w, t) * 0.32, 2), { creaseDeg: 42, ...o });
/** Closed hollow ring loop (CCW in r,y) with rounded outer / inner edges. */
const loop = (rIn, rOut, y0, y1, bo = 0.015, bi = 0) => [[rIn, y0, bi], [rOut, y0, bo], [rOut, y1, bo], [rIn, y1, bi], [rIn, y0]];

const BOLT = hexBolt(0.04, 0.045, 8);
const BOLT_S = hexBolt(0.03, 0.032, 8);

/** Frames of a claw that follows the 2D path [[r, s], ...] at azimuth th (width tapers towards the tip). */
function clawFrames(path, th, tipK = 0.55, n = 12) {
  const curve = new THREE.CatmullRomCurve3(path.map(([r, s]) => V3(r, s, 0)), false, 'centripetal');
  const c = cs(th), q = sn(th), out = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, p = curve.getPointAt(u), t = curve.getTangentAt(u);
    out.push({ p: V3(p.x * c, p.y, p.x * q), n: V3(t.y * c, -t.x, t.y * q), t: V3(t.x * c, t.y, t.x * q), k: lerp(1, tipK, u * u), h: lerp(1, 0.8, u) });
  }
  return out;
}

/* ------------------------------------------------------------------ root mount */
export function rootMount(p) {
  // flange that seats on the end of the abdomen shaft, stepped neck, eight gussets, six flange screws
  p.add(lathe([[0.2, 0], [0.64, 0, 0.03], [0.64, 0.085, 0.03], [0.2, 0.085], [0.2, 0]], { segments: 56 }), M.gunmetal);
  p.add(lathe([[0.22, 0.085], [0.4, 0.085], [0.4, 0.3, 0.012], [0.22, 0.3], [0.22, 0.085]], { segments: 40 }), M.gunmetal);
  const gus = plate(shape([[0.38, 0.085, 0], [0.6, 0.085, 0.012], [0.6, 0.11, 0.012], [0.42, 0.3, 0.02], [0.38, 0.3, 0]]), 0.05, { bevel: 0.012, center: true, steps: 2 });
  for (const th of azi(8)) p.add(gus, M.gunmetal, { q: qY(-th) });
  p.addMany(BOLT, M.chrome, azi(8, TAU / 16).map((th) => [0.5 * cs(th), 0.085, 0.5 * sn(th)]));
  // black clamp crown with a chrome hoop and a chrome retaining ring under the ball housing
  p.add(lathe([[0.22, 0.3], [0.6, 0.3, 0.03], [0.6, 0.44, 0.025], [0.5, 0.55, 0.06], [0.22, 0.55], [0.22, 0.3]], { segments: 56 }), M.black);
  p.add(ringGeo(0.585, 0.622, 0.36, 0.41, 0.01, { segments: 56 }), M.chrome);
  p.add(ringGeo(0.28, 0.42, 0.55, 0.6, 0.012, { segments: 40 }), M.chrome);
  // two clamp ears on the starboard / port side, each with a radial cap screw
  const ear = box(0.17, 0.2, 0.22, 0.03);
  for (const th of [Math.PI / 2, (3 * Math.PI) / 2]) {
    p.add(ear, M.black, lugX(0.66, 0.45, th));
    p.add(BOLT, M.chrome, radM(0.745, 0.45, th));
  }
}

/* ------------------------------------------------------------------ joint-1: ball joint in a six-claw housing */
export function joint1(p) {
  const bc = 0.86;
  p.add(ballGeo(0.3, bc, { groove: 0.012, n: 22, seg: 44 }), M.chrome);
  p.add(lathe([[0.2, 0.6], [0.56, 0.6, 0.025], [0.56, 0.7, 0.025], [0.2, 0.7], [0.2, 0.6]], { segments: 48 }), M.black);
  const ths = azi(6, Math.PI / 6);
  const path = [[0.52, 0.68], [0.47, 0.78], [0.41, 0.88], [0.355, 0.98], [0.28, 1.07], [0.205, 1.125]];
  for (const th of ths) p.add(sweepFrames(clawFrames(path, th), rrect(0.24, 0.07, 0.02, 2), { creaseDeg: 45 }), M.black);
  p.addMany(BOLT, M.chrome, ths.map((th) => radM(0.535, 0.82, th)));
  p.addMany(BOLT_S, M.chrome, azi(6).map((th) => [0.46 * cs(th), 0.7, 0.46 * sn(th)]));
  // gold shaft with a chrome lock collar and a clip ring
  p.add(cyl(0.095, 0.54, { bevel: 0.01, segments: 24, y0: bc }), M.gold);
  p.add(ringGeo(0.09, 0.155, 1.14, 1.21, 0.014, { segments: 36 }), M.chrome);
  p.add(ringGeo(0.09, 0.122, 1.3, 1.335, 0.008, { segments: 28 }), M.chrome);
}

/* ------------------------------------------------------------------ valve */
export function valve(p) {
  const y0 = 1.34, yR = 1.48, y1 = 1.7, ym = (yR + y1) / 2;
  p.add(lathe([[0.14, y0], [0.58, y0, 0.03], [0.58, yR - 0.035, 0.015], [0.52, yR, 0.012], [0.14, yR], [0.14, y0]], { segments: 56 }), M.black);
  p.addMany(BOLT, M.chrome, azi(6, Math.PI / 6).map((th) => radM(0.58, y0 + 0.065, th)));
  // gold cage: two rings, eight posts with chrome rivets, black core showing through the windows
  p.add(ringGeo(0.4, 0.5, yR, yR + 0.06, 0.015, { segments: 56 }), M.gold);
  p.add(ringGeo(0.4, 0.5, y1 - 0.06, y1, 0.015, { segments: 56 }), M.gold);
  const posts = azi(8, TAU / 16);
  for (const th of posts) p.add(arcBand(0.475, ym, th - 0.24, th + 0.24, y1 - yR - 0.1, 0.06, 6), M.gold);
  p.addMany(BOLT_S, M.chrome, posts.map((th) => radM(0.505, ym, th)));
  p.add(cyl(0.44, y1 - yR, { bevel: 0.01, segments: 40, y0: yR }), M.black);
  // thumb lever on the starboard side, ribbed hose barb on the port side
  p.add(cyl(0.04, 0.3, { bevel: 0.01, segments: 14, y0: 0 }), M.chrome, radM(0.42, ym, Math.PI / 2));
  p.add(cyl(0.1, 0.07, { bevel: 0.02, segments: 24, y0: 0 }), M.chrome, radM(0.71, ym, Math.PI / 2));
  const barb = lathe([[0, 0], [0.05, 0, 0.004], [0.05, 0.1], [0.078, 0.1, 0.006], [0.046, 0.17], [0.078, 0.17, 0.006], [0.04, 0.25], [0, 0.25]], { segments: 18, steps: 1 });
  p.add(barb, M.chrome, radM(0.42, ym, (3 * Math.PI) / 2));
}

/* ------------------------------------------------------------------ ampoule */
const AMBER = M.glass.clone();
AMBER.name = 'amber glass'; AMBER.color.set('#ff9514'); AMBER.opacity = 0.5;

export function ampoule(p) {
  // brushed-titanium cage (the valve above carries the gold) around the amber vial
  const y0 = 1.704, y1 = 2.1, ym = (y0 + y1) / 2;
  for (const [a, b] of [[y0, y0 + 0.075], [y1 - 0.075, y1]]) p.add(lathe(loop(0.2, 0.5, a, b, 0.02), { segments: 56 }), M.titanium);
  for (const th of azi(4, Math.PI / 4)) p.add(arcBand(0.465, ym, th - 0.42, th + 0.42, y1 - y0 - 0.15, 0.07, 10), M.titanium);
  p.add(cyl(0.33, 0.34, { bevel: 0.08, segments: 40, y0: y0 + 0.03 }), AMBER);
  p.add(cyl(0.13, 0.32, { bevel: 0.02, segments: 24, y0: y0 + 0.04 }), M.glowAmber);
  for (const y of [1.84, 1.9, 1.96]) p.add(ringGeo(0.328, 0.336, y, y + 0.012, 0.003, { segments: 40 }), M.titanium);
  p.add(cone(0.05, 0.09, 0.09, { bevel: 0.006, segments: 20, y0: y0 - 0.09 }), M.titanium);
}

/* ------------------------------------------------------------------ scanner head: side camera module (dorsal) */
export function scannerHead(p) {
  const cx = 0.65, y0 = 1.6, y1 = 2.04, cy = (y0 + y1) / 2;
  p.add(box(0.26, y1 - y0, 0.36, 0.05), M.black, [cx, cy, 0]);
  p.add(box(0.07, 0.1, 0.28, 0.02), M.black, [0.5, y0 + 0.08, 0]);
  p.add(box(0.07, 0.1, 0.28, 0.02), M.black, [0.5, y1 - 0.08, 0]);
  for (let i = 0; i < 5; i++) p.add(box(0.04, 0.035, 0.3, 0.01), M.black, [cx + 0.14, y0 + 0.07 + i * 0.075, 0]);
  p.addMany(BOLT_S, M.black, [0.15, -0.15].flatMap((z) => [y0 + 0.08, y1 - 0.08].map((y) => placeM(V3(cx + 0.13, y, z), V3(1, 0, 0)))));
  // lens barrel facing the tip, ringed by a cyan light, with a status bar beside it
  p.add(cyl(0.105, 0.06, { bevel: 0.015, segments: 28, y0: y1 - 0.01 }), M.black, [cx, 0, 0]);
  p.add(ringGeo(0.095, 0.118, y1 + 0.045, y1 + 0.063, 0.004, { segments: 32 }), M.glowCyan, [cx, 0, 0]);
  p.add(sphere(0.085, { segments: 24, rings: 12, sy: 0.6 }), M.lens, [cx, y1 + 0.052, 0]);
  p.add(box(0.03, 0.04, 0.2, 0.008), M.glowCyan, [cx + 0.15, y1 - 0.09, 0]);
}

/* ------------------------------------------------------------------ joint-2: chrome hinge ring in two black C-clamps */
export function joint2(p) {
  const y0 = 2.12, y1 = 2.34, ym = (y0 + y1) / 2;
  p.add(lathe(loop(0.36, 0.5, y0, y1, 0.02), { segments: 56 }), M.chrome);
  p.add(lathe([[0.3, y1], [0.5, y1, 0.015], [0.5, 2.37, 0.012], [0.46, 2.42, 0.02], [0.3, 2.42], [0.3, y1]], { segments: 56 }), M.black);
  const hw = 1.0;
  for (const c of [Math.PI / 2, (3 * Math.PI) / 2]) {
    p.add(arcBand(0.545, ym, c - hw, c + hw, 0.2, 0.065, 14), M.black);
    for (const e of [-1, 1]) {
      const th = c + e * hw, tv = V3(-sn(th) * e, 0, cs(th) * e);
      p.add(box(0.13, 0.2, 0.11, 0.025), M.black, lugX(0.585, ym, th));
      p.add(BOLT, M.chrome, placeM(V3(0.585 * cs(th), ym, 0.585 * sn(th)).addScaledVector(tv, 0.055), tv));
    }
  }
  // gold pivot pins on the dorsal / ventral side
  for (const th of [0, Math.PI]) {
    p.add(cyl(0.065, 0.15, { bevel: 0.012, segments: 20, y0: 0 }), M.gold, radM(0.5, ym, th));
    p.add(BOLT_S, M.chrome, radM(0.65, ym, th));
  }
}
