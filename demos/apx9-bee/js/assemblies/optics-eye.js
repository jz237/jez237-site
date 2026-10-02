// optics-eye.js - internals of the compound eye, built in the eye-local frame (X = forward in the rim plane,
// Y = eye axis pointing out of the head, Z = in-plane, bee-down). Origin = centroid of the orbital contour.
// Every builder receives a Part and adds geometry to it; the caller sets pivots and explode.
import { THREE, V3, M, S, revolve, cyl, sphere, box, plate, sweep, spring, merge, gear, gearShape, rectPts, circleHole, circlePts, rng } from '../kit.js';
import { TAU, placeMat } from './optics-frame.js';
import { capScrew, washer, screwWithWasher, threadedShank, knurl } from './optics-hw.js';

export const XC = -0.05, ZC = 0.12;          // housing / shaft axis in the local frame
export const KZ = 1.14;                       // egg-shape: housing and rings are stretched along Z
const rev = (prof, o = {}) => revolve(prof, { steps: 2, ...o });
const mT = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
const mS = (x, y, z) => new THREE.Matrix4().makeScale(x, y, z);
const mRy = (a) => new THREE.Matrix4().makeRotationY(a);
const mRx = (a) => new THREE.Matrix4().makeRotationX(a);
const mRz = (a) => new THREE.Matrix4().makeRotationZ(a);
/** local->eye matrix of axis-symmetric parts that are stretched to the egg-shaped housing */
const ellM = (y = 0) => mT(XC, y, ZC).multiply(mS(1, 1, KZ));
const axisM = (y = 0, spin = 0) => mT(XC, y, ZC).multiply(mRy(spin));

/** Biconvex-ish lens disc: bottom centre -> bottom edge -> top edge -> top centre (counter-clockwise). */
function lensGeo(r, y0, tEdge, sagTop, sagBot, seg = 44) {
  const prof = [[0, y0 - sagBot]];
  const n = 6;
  for (let i = 1; i <= n; i++) { const t = i / n; prof.push([r * t, y0 - sagBot * (1 - t * t)]); }
  prof.push([r, y0 + tEdge]);
  for (let i = n - 1; i >= 0; i--) { const t = i / n; prof.push([r * t, y0 + tEdge + sagTop * (1 - t * t)]); }
  return rev(prof, { segments: seg, steps: 1, creaseDeg: 50 });
}
const ringGeo = (rIn, rOut, y0, h, b = 0.02, seg = 56, st = 2) => rev([[rIn, y0, b * 0.5], [rOut, y0, b], [rOut, y0 + h, b], [rIn, y0 + h, b * 0.5], [rIn, y0, 0]], { segments: seg, steps: st });

/** satin graphite for machined barrels: lighter than gunmetal, so knurl and rings read against the dark housing */
const graphite = new THREE.MeshPhysicalMaterial({ name: 'satin graphite', color: new THREE.Color(0x6a7079), metalness: 0.92, roughness: 0.4, clearcoat: 0.25, clearcoatRoughness: 0.22 });

/** polished steel with a darker base colour: keeps form on small races instead of clipping to white */
const satinSteel = new THREE.MeshStandardMaterial({ name: 'satin steel', color: new THREE.Color(0x8e949d), metalness: 1, roughness: 0.27 });

/* ------------------------------------------------------------------ back housing */
export function buildHousing(part) {
  const prof = [
    [0.70, -1.38, 0.02],                          // back boss around the shaft bore: two steps
    [1.06, -1.38, 0.025],
    [1.06, -1.33],
    [1.16, -1.33, 0.015],
    [1.16, -1.28],
    [1.88, -1.28, 0.10],
    [2.14, -0.44, 0],
    [2.14, -0.40],
    [2.08, -0.40],
    [2.08, -0.30],
    [2.14, -0.30],
    [2.14, -0.14],
    [2.32, -0.14, 0.03],
    [2.32, 0.06, 0.04],
    [1.98, 0.06, 0.02],
    [1.90, -0.10],
    [1.84, -1.00, 0.05],
    [0.98, -1.00, 0.04],
    [0.98, -0.78, 0.05],
    [0.74, -0.78, 0.02],
    [0.70, -1.38],
  ];
  part.add(rev(prof, { segments: 60 }), M.black, ellM());
  // radial ribs on the floor
  const rib = box(0.88, 0.11, 0.07, 0.015);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + TAU / 16;
    part.add(rib, M.black, ellM().multiply(mT(Math.cos(a) * 1.41, -0.95, Math.sin(a) * 1.41)).multiply(mRy(-a)));
  }
  // concentric chrome rings: floor rings, gasket bead on the flange, collar on the boss
  const rings = [[1.30, -1.0, 0.07, 0.09], [1.62, -1.0, 0.06, 0.10], [2.19, 0.06, 0.035, 0.09], [0.98, -0.78, 0.035, 0.07]];
  for (const [r, y0, h, w] of rings) part.add(ringGeo(r - w / 2, r + w / 2, y0, h, 0.012, 56, 1), M.chrome, ellM());
  // bolt bosses on the flange
  const boss = cyl(0.16, 0.05, { segments: 20, y0: 0.06, bevel: 0.012 });
  for (const [x, z] of boltSpots()) part.add(boss, M.black, mT(x, 0, z));
  // two cable clips on the back wall
  const clip = box(0.34, 0.5, 0.06, 0.012);
  part.add(clip, M.chrome, ellM().multiply(mT(0, -0.78, 2.07)));
  part.add(clip, M.chrome, ellM().multiply(mT(0, -0.78, -2.07)));

  // ---- machined exterior: cooling fins around the wall, gussets on the back face, set screws (all gunmetal / chrome)
  // fin = tapered plate in (radial x, axial y), 0.07 thick; its inner edge is buried in the conical wall
  const fin = plate([[1.86, -1.22], [2.12, -1.22], [2.24, -1.10], [2.24, -0.70], [2.16, -0.54], [2.07, -0.54]], 0.07, { center: true, bevel: 0.014, bevelSegments: 1, steps: 1 });
  const nFin = 28;
  for (let i = 0; i < nFin; i++) {
    const a = ((i + 0.5) / nFin) * TAU;
    if (Math.abs(Math.abs(Math.sin(a)) - 1) < 0.02) continue;                // keep the two cable clips (a = +-90 deg) free
    part.add(fin, M.brushed, ellM().multiply(mRy(-a)));
  }
  // gussets: triangular ribs that stiffen the back face (clear of the servo flange and the connector at a = +90 deg)
  const gus = plate([[1.06, -1.38], [1.80, -1.30], [1.80, -1.26], [1.06, -1.26]], 0.09, { center: true, bevel: 0.012, bevelSegments: 1, steps: 1 });
  for (let i = 0; i < 12; i++) {
    const a = ((i + 0.5) / 12) * TAU;
    if (Math.abs(Math.sin(a) - 1) < 0.13) continue;
    part.add(gus, M.brushed, ellM().multiply(mRy(-a)));
  }
  part.add(ringGeo(0.77, 0.87, -1.415, 0.035, 0.008, 48, 1), M.brushed, ellM());      // satin snap ring on the boss face
  const set = capScrew(0.075, 0.05, { seg: 12 });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU;
    part.add(set, M.chrome, ellM().multiply(mT(Math.cos(a) * 1.42, -1.28, Math.sin(a) * 1.42)).multiply(mRx(Math.PI)));
  }
}

export function boltSpots(n = 6) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + TAU / 12;
    out.push([XC + Math.cos(a) * 2.15, ZC + Math.sin(a) * 2.15 * KZ]);
  }
  return out;
}

/* ------------------------------------------------------------------ bolts */
export function buildBolts(part) {
  // flange bolts: washer + socket head + threaded shank (the shank is what the exploded view shows)
  const bolt = merge([screwWithWasher(0.10, 0.075, { washerR: 1.5, washerH: 0.025, seg: 12 }), threadedShank(0.058, 0.23, { ridges: 4, seg: 10 })]);
  boltSpots().forEach(([x, z], i) => part.add(bolt, M.steel, mT(x, 0.11, z).multiply(mRy(i * 0.7))));
}

/* ------------------------------------------------------------------ lens stack */
export function buildLensStack(part) {
  const E = axisM();
  // satin gunmetal barrel: base flange, neck groove, focus-ring seat, shoulder, stepped front section
  const tube = [[1.74, 0.16, 0.01], [2.03, 0.16, 0.025], [2.03, 0.27, 0.02], [1.94, 0.27], [1.94, 0.31], [1.98, 0.31], [1.98, 0.60],
    [1.94, 0.60], [1.94, 0.64], [1.99, 0.64, 0.01], [1.99, 0.72, 0.02], [1.62, 0.72], [1.62, 1.04, 0.02], [1.40, 1.04, 0.01], [1.40, 0.62], [1.74, 0.62], [1.74, 0.16]];
  part.add(rev(tube, { segments: 56 }), graphite, E);
  part.add(knurl(2.02, 1.90, 80, 0.31, 0.29, 0.03, 0), graphite, E);                        // knurled focus ring
  part.add(ringGeo(1.93, 1.995, 0.60, 0.04, 0.008, 56, 1), M.chrome, E);                          // polished index band in the groove
  part.add(ringGeo(0.92, 1.45, 1.04, 0.10, 0.025, 56), M.chrome, E);                           // front bezel
  part.add(ringGeo(0.96, 1.16, 1.14, 0.17, 0.02, 40), graphite, E);                          // inner hood
  // three bayonet lugs on the front section
  const lug = box(0.13, 0.10, 0.30, 0.02);
  for (let i = 0; i < 3; i++) part.add(lug, graphite, E.clone().multiply(mRy((i / 3) * TAU + 0.5)).multiply(mT(1.665, 0.90, 0)));
  // optical train: coated elements and the spacer rings between them
  part.add(lensGeo(1.70, 0.26, 0.12, 0.10, 0.04), M.lens, E);
  part.add(lensGeo(1.66, 0.46, 0.10, 0.02, 0.12), M.lens, E);
  part.add(lensGeo(1.36, 0.80, 0.12, 0.16, 0.05), M.lens, E);
  part.add(lensGeo(1.33, 0.95, 0.09, 0.14, 0.03, 48), M.lens, E);
  part.add(ringGeo(1.52, 1.74, 0.42, 0.04, 0.008, 48, 1), graphite, E);
  part.add(ringGeo(1.18, 1.40, 0.78, 0.04, 0.008, 40, 1), graphite, E);
}

/** wire-grid polariser film: the stripes turn by 36 deg from sector to sector (object space = the polariser wheel frame) */
const polarFilm = new THREE.MeshPhysicalMaterial({ name: 'polariser film', color: 0x7fb0ff, metalness: 0.15, roughness: 0.1, transparent: true, opacity: 0.6, clearcoat: 1, clearcoatRoughness: 0.03, side: THREE.DoubleSide, depthWrite: false });
polarFilm.onBeforeCompile = (sh) => {
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vPolP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPolP = position;');
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vPolP;').replace('#include <color_fragment>', `#include <color_fragment>
    {
      float ang = atan(vPolP.x, vPolP.z);
      float sec = mod(floor(ang / 1.2566371), 5.0);
      float th = sec * 0.6283185 + 0.35;
      float c = dot(vPolP.xz, vec2(cos(th), sin(th))) * 16.0;
      float w = fwidth(c);
      float st = abs(fract(c) - 0.5) * 2.0;
      float line = smoothstep(0.5 - w, 0.5 + w, st);
      line = mix(line, 0.5, smoothstep(0.3, 0.8, w));
      vec3 tint = mix(vec3(0.45, 0.80, 1.0), vec3(1.0, 0.55, 0.95), sec / 4.0);
      diffuseColor.rgb *= tint * (0.45 + 0.9 * line);
      diffuseColor.a *= 0.25 + 0.9 * line;
    }`);
};
polarFilm.customProgramCacheKey = () => 'apx9-polar-film-1';

/* ------------------------------------------------------------------ polarizer wheel (pivot on the shaft axis) */
export function buildPolarizer(part) {
  // geometry is relative to the node origin (on the axis, y = wheel mid-plane)
  const g = plate(gearShape({ teeth: 44, rOut: 1.90, rRoot: 1.82, bore: 1.58 }), 0.11, { bevel: 0.015, center: true, bevelSegments: 1, steps: 12, creaseDeg: 45 });
  g.rotateX(Math.PI / 2);
  part.add(g, satinSteel);
  // stepped hub (flange + boss) with a radial set screw, 5 tapered spokes with lightening slots, rivets at the rim
  part.add(rev([[0.22, -0.08, 0.01], [0.52, -0.08, 0.02], [0.52, -0.03, 0.01], [0.44, -0.03], [0.44, 0.14, 0.03], [0.22, 0.14], [0.22, -0.08]], { segments: 40, steps: 1 }), satinSteel);
  part.add(capScrew(0.05, 0.045, { seg: 12 }), satinSteel, mT(0.44, 0.055, 0).multiply(mRz(-Math.PI / 2)));
  const slot = rectPts(0.52, 0.04, 0.018).map(([x, y, r]) => [x + 0.06, y, r]);
  const spoke = plate([[-0.62, -0.10, 0.02], [0.62, -0.062, 0.02], [0.62, 0.062, 0.02], [-0.62, 0.10, 0.02]], 0.08, { center: true, bevel: 0.012, bevelSegments: 1, steps: 2, holes: [slot] });
  spoke.rotateX(Math.PI / 2);
  const rivet = capScrew(0.05, 0.035, { seg: 12 });
  // lathe angle phi puts a point at (sin phi, cos phi) in (x, z); spokes and films share that angle
  for (let i = 0; i < 5; i++) {
    const phi = (i / 5) * TAU;
    part.add(spoke, satinSteel, mRy(phi - Math.PI / 2).premultiply(mT(Math.sin(phi) * 1.0, 0, Math.cos(phi) * 1.0)));
    part.add(rivet, satinSteel, mT(Math.sin(phi) * 1.70, 0.055, Math.cos(phi) * 1.70));
    // polarising film sector between the spokes
    const film = rev([[0.46, -0.012], [1.60, -0.012], [1.60, 0.012], [0.46, 0.012], [0.46, -0.012]], { segments: 18, phi0: phi + 0.13, phi: TAU / 5 - 0.26, steps: 1 });
    part.add(film, polarFilm);
  }
}

/* ------------------------------------------------------------------ UV / IR sensor board */
export function buildSensorBoard(part) {
  const y = -0.57;
  const board = plate(rectPts(3.5, 3.9, 0.35), 0.1, { holes: [circleHole(0.32)], center: true, bevel: 0.015, steps: 6 });
  board.rotateX(-Math.PI / 2);
  part.add(board, M.pcb, axisM(y));
  // sensor die + micro-lens grid
  const die = plate(rectPts(2.3, 2.7, 0.12), 0.07, { center: true, bevel: 0.012, holes: [circleHole(0.5)], steps: 8 });
  die.rotateX(-Math.PI / 2);
  part.add(die, M.pcb, axisM(y + 0.085));
  const mic = rev([[0, 0], [0.17, 0], [0.17, 0.035], [0.13, 0.075], [0.07, 0.105], [0, 0.115]], { segments: 12, steps: 1 });
  const rnd = rng(11);
  for (let i = -2; i <= 2; i++) for (let j = -3; j <= 3; j++) {
    const x = i * 0.42, z = j * 0.37;
    if (Math.hypot(x, z) < 0.62) continue;
    part.add(mic, M.lens, mT(XC + x, y + 0.12, ZC + z));
  }
  // gold bond pads along the long edges + standoffs
  const pad = box(0.2, 0.025, 0.11, 0);
  for (let i = 0; i < 10; i++) for (const s of [-1, 1]) part.add(pad, M.gold, mT(XC + s * 1.5, y + 0.06, ZC + (i - 4.5) * 0.36).multiply(mRy(Math.PI / 2)));
  const post = cyl(0.11, 0.42, { segments: 14, y0: -0.40, bevel: 0.015, steps: 1 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) part.add(post, M.gold, mT(XC + sx * 1.38, y, ZC + sz * 1.65));
}

/* ------------------------------------------------------------------ shaft, bearing */
export function buildShaft(part) {
  const E = axisM();
  // ground body: chamfered drive end, relieved neck, journal, polariser seat; the top takes a socket retaining screw
  const prof = [[0, -1.72], [0.15, -1.72], [0.19, -1.68], [0.19, -1.40], [0.205, -1.40], [0.205, -1.22], [0.22, -1.22, 0.008], [0.22, 0.24], [0, 0.24]];
  part.add(rev(prof, { segments: 36, creaseDeg: 40 }), satinSteel, E);
  part.add(knurl(0.272, 0.20, 16, -1.40, 0.18, 0.04, 0), satinSteel, E);                      // splined coupling
  part.add(spring({ radius: 0.222, wire: 0.02, turns: 5, length: 0.45, perTurn: S(10, 6), radial: 4 }), satinSteel, axisM(-0.245));   // thread
  part.add(box(0.10, 0.20, 0.09, 0.012), satinSteel, axisM(0.13).multiply(mT(0.22, 0, 0)));      // feather key under the polariser hub
  part.add(capScrew(0.25, 0.12, { seg: 24, hex: 0.42, depth: 0.55, chamfer: 0.14 }), satinSteel, axisM(0.24));
  // brass shaft collar with set screw, brass cross pin through the drive end
  part.add(rev([[0.215, -0.62, 0.012], [0.30, -0.62, 0.02], [0.30, -0.52, 0.02], [0.215, -0.52, 0.012]], { segments: 36, steps: 1 }), M.brass, E);
  part.add(capScrew(0.05, 0.04, { seg: 12 }), M.brass, axisM(-0.57).multiply(mT(0.30, 0, 0)).multiply(new THREE.Matrix4().makeRotationZ(-Math.PI / 2)));
  part.add(cyl(0.04, 0.46, { axis: 'x', segments: 10, bevel: 0.01, steps: 1 }), M.brass, axisM(-1.56));
}

export function buildBearing(part) {
  const E = axisM();
  // outer race with flange, inner race, balls and a shield
  part.add(rev([[0.50, -1.14, 0.015], [0.68, -1.14, 0.02], [0.68, -0.82], [0.80, -0.82, 0.01], [0.80, -0.76, 0.015], [0.50, -0.76, 0.01], [0.50, -1.14]], { segments: 48 }), satinSteel, E);
  part.add(rev([[0.22, -1.12, 0.01], [0.40, -1.12, 0.015], [0.40, -0.80, 0.015], [0.22, -0.80, 0.01], [0.22, -1.12]], { segments: 36 }), satinSteel, E);
  const ball = sphere(0.085, { segments: 12, rings: 8 });
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU;
    part.add(ball, M.chrome, mT(XC + Math.cos(a) * 0.45, -0.96, ZC + Math.sin(a) * 0.45));
  }
  part.add(ringGeo(0.425, 0.475, -0.985, 0.035, 0.008, 36, 1), graphite, E);                 // cage band through the ball equators
}

/* ------------------------------------------------------------------ gimbal servo */
export function buildServo(part) {
  const E = axisM();
  const can = [[0, -1.70], [0.52, -1.70, 0.05], [0.60, -1.58, 0.02], [0.60, -1.36, 0.02], [0.52, -1.34], [0.52, -1.31], [0, -1.31]];
  part.add(rev(can, { segments: 48 }), graphite, E);
  part.add(knurl(0.615, 0.57, 44, -1.56, 0.17, 0.025, 0), graphite, E);                      // knurled grip band
  part.add(rev([[0.21, -1.70, 0], [0.27, -1.70, 0.008], [0.27, -1.725, 0.01], [0.21, -1.725, 0.008], [0.21, -1.70]], { segments: 28, steps: 1 }), M.gold, E);   // brazed back ring
  // mounting flange with ears and two screws
  const ears = plate(rectPts(1.9, 0.5, 0.22), 0.07, { center: true, bevel: 0.015, holes: [circleHole(0.09, -0.78), circleHole(0.09, 0.78)], steps: 6 });
  ears.rotateX(-Math.PI / 2);
  part.add(ears, graphite, axisM(-1.33));
  const sc = capScrew(0.075, 0.05, { seg: 12 });
  for (const s of [-1, 1]) part.add(sc, M.gold, axisM(-1.33).multiply(mT(s * 0.78, 0.035, 0)));
  // output spline boss
  part.add(rev([[0.12, -1.31, 0.01], [0.28, -1.31, 0.02], [0.28, -1.22, 0.02], [0.2, -1.2, 0.01], [0.12, -1.2], [0.12, -1.31]], { segments: 28 }), M.gold, E);
  // gimbal ring around the can: pitch ring on two pivot pins
  const ring = new THREE.TorusGeometry(0.76, 0.05, 8, 48);
  ring.rotateX(Math.PI / 2);
  part.add(ring, M.gold, axisM(-1.50));
  const pin = cyl(0.06, 0.2, { segments: 12, axis: 'x', bevel: 0.01, steps: 1 });
  for (const s of [-1, 1]) part.add(pin, M.gold, axisM(-1.50).multiply(mT(s * 0.64, 0, 0)));
  const cap = sphere(0.085, { segments: 12, rings: 8 });
  for (const s of [-1, 1]) part.add(cap, M.gold, axisM(-1.50).multiply(mT(s * 0.82, 0, 0)));
  // solder terminals on the back and three wires leaving to a connector under the housing
  const term = cyl(0.045, 0.14, { segments: 8, y0: -0.14, bevel: 0.008, steps: 1 });
  const xs = [-0.17, 0, 0.17];
  xs.forEach((x) => part.add(term, M.gold, axisM(-1.70).multiply(mT(x, 0, 0.18))));
  xs.forEach((x, i) => {
    const k = i - 1;
    const path = [V3(XC + x, -1.80, ZC + 0.18), V3(XC + x * 1.3, -1.93, ZC + 0.55), V3(XC + x * 1.7 + 0.12, -1.94, ZC + 1.05),
      V3(XC + x * 1.8 + 0.24, -1.74, ZC + 1.55), V3(XC + x * 0.5 + 0.28, -1.50, ZC + 1.80), V3(XC + x * 0.5 + 0.28, -1.42, ZC + 1.86)];
    part.add(sweep(path, { radius: 0.04, radial: S(6, 5), segments: S(40, 24) }), M.rubber);
  });
  part.add(box(0.62, 0.16, 0.30, 0.03), M.rubber, mT(XC + 0.28, -1.40, ZC + 1.88));
  [-0.17, 0, 0.17].forEach((x) => part.add(cyl(0.028, 0.1, { segments: 8, y0: 0, bevel: 0.005, steps: 1 }), M.gold, mT(XC + 0.28 + x * 0.9, -1.33, ZC + 1.88)));
}
