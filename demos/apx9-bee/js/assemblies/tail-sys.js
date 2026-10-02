// Stabilizer subsystems inside the cowl: four micro-thrusters (one per gap between the panels), the attitude sensor under
// the dorsal panel, the four pinwheel pushrods of the gimbal and the flex cable between sensor and mount ring.
// Abdomen-local frame (x = -a). Every leaf collects its geometry per material (Bag) and places it with its own matrix.
import { M, ex, V3, THREE, D2R, cyl, box, plate, shape, circlePts, rectPts, hexNut, paint } from '../kit.js';
import { skP, skN, lathe, hexBolt, placeM, basisM, sweepFrames, rrect, pathFrames, ACT, mergeList, xf } from './tail-common.js';
import { THR_PHI, thrP } from './tail-ring.js';

const T4 = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
const POLY = paint('#d9821c', { rough: 0.42, coat: 0.2 });
POLY.name = 'polyimide flex';

/** Geometry collected per material key; emit() merges each key into one geometry and adds it to a leaf. */
class Bag {
  constructor() { this.l = {}; }
  put(key, g, m = null) { (this.l[key] ||= []).push(m ? xf(g, m) : g); }
  emit(leaf, mats, m = null) { for (const k of Object.keys(this.l)) leaf.add(mergeList(this.l[k]), mats[k], m); }
}

/** Frame with local +Y = u (origin p) and local +Z = z (a unit vector perpendicular to u). */
function frameUZ(p, u, z) {
  const x = new THREE.Vector3().crossVectors(u, z).normalize();
  const zz = new THREE.Vector3().crossVectors(x, u);
  return new THREE.Matrix4().makeBasis(x, u, zz).setPosition(p);
}

/* ------------------------------------------------------------------ micro-thrusters */
const A_T0 = 9.95, A_T1 = 11.3;   // thruster axis runs between these two stations of the cowl, 0.2 mm under the skin

/** One thruster in its own frame: +Y along the axis (aft and inward), +X outward, origin at the a = 9.95 station. */
function thrusterBag() {
  const b = new Bag();
  // propellant feed block with a fill fitting and a test-port screw
  b.put('black', box(0.26, 0.4, 0.34, 0.03), T4(0, -0.4, 0));
  b.put('chrome', hexNut(0.085, 0.07), T4(0, -0.635, 0));
  b.put('chrome', cyl(0.034, 0.11, { bevel: 0.008, segments: 12, steps: 1, y0: -0.75 }));
  b.put('chrome', hexBolt(0.04, 0.045, 8), placeM(V3(0.13, -0.4, 0), V3(1, 0, 0)));
  // solenoid valve with chrome end rims, then the propellant tube with a clamp collar
  b.put('black', cyl(0.15, 0.5, { bevel: 0.02, segments: 28, steps: 1, y0: -0.2 }));
  b.put('chrome', cyl(0.158, 0.03, { bevel: 0.008, segments: 28, steps: 1, y0: -0.2 }));
  b.put('chrome', cyl(0.158, 0.03, { bevel: 0.008, segments: 28, steps: 1, y0: 0.27 }));
  b.put('chrome', cyl(0.105, 0.74, { bevel: 0.012, segments: 24, steps: 1, y0: 0.3 }));
  b.put('chrome', cyl(0.128, 0.06, { bevel: 0.012, segments: 24, steps: 1, y0: 0.6 }));
  // black heat shield ahead of the nozzle
  b.put('black', cyl(0.14, 0.16, { bevel: 0.02, segments: 28, steps: 1, y0: 0.94 }));
  // bell nozzle: thin chrome shell, closed throat, rolled lip
  const oc = (t) => 0.078 + 0.142 * Math.pow(t, 0.62), ic = (t) => 0.052 + 0.143 * Math.pow(t, 0.62);
  const prof = [[0, 1.1], [0.105, 1.1, 0.012]];
  for (let i = 0; i <= 10; i++) prof.push([oc(i / 10), 1.12 + 0.5 * (i / 10), i === 10 ? 0.014 : 0]);
  for (let i = 10; i >= 0; i--) prof.push([ic(i / 10), 1.14 + 0.48 * (i / 10), i === 10 ? 0.012 : 0]);
  prof.push([0, 1.14]);
  b.put('chrome', lathe(prof, { segments: 36, steps: 1, creaseDeg: 40 }));
  // glowing emitter in the throat and a lit ring just inside the lip
  b.put('glow', lathe([[0, 1.14], [0.046, 1.14], [0.05, 1.2], [0.042, 1.32], [0.025, 1.4], [0, 1.43]], { segments: 20, steps: 1, creaseDeg: 60 }));
  b.put('glow', lathe([[0.172, 1.592], [0.196, 1.592], [0.196, 1.612], [0.172, 1.612], [0.172, 1.592]], { segments: 36, steps: 1 }));
  // two clamp straps (chrome band, clamp lug with a bolt, black isolator foot that rests on the longeron)
  const strap = (y, rIn, rOut, w) => {
    b.put('chrome', lathe([[rIn, y - w / 2], [rOut, y - w / 2, 0.01], [rOut, y + w / 2, 0.01], [rIn, y + w / 2], [rIn, y - w / 2]], { segments: 28, steps: 2 }));
    b.put('chrome', box(0.1, 0.09, 0.075, 0.015), T4(rOut + 0.03, y, 0));
    b.put('chrome', hexBolt(0.032, 0.035, 8), placeM(V3(rOut + 0.08, y, 0), V3(1, 0, 0)));
    b.put('black', box(0.034, 0.07, 0.24, 0.008), T4(-(rOut + 0.017), y, 0));
  };
  strap(0.065, 0.158, 0.205, 0.07);
  strap(0.62, 0.13, 0.176, 0.07);
  return b;
}

export function buildThrusters(stab) {
  const bag = thrusterBag();
  const where = ['Dorsal Starboard', 'Ventral Starboard', 'Ventral Port', 'Dorsal Port'];
  THR_PHI.forEach((deg, i) => {
    const phi = deg * D2R;
    const p0 = thrP(A_T0, deg), p1 = thrP(A_T1, deg);
    const d = p1.clone().sub(p0).normalize();
    const MT = basisM(p0, d, skN(10.5, phi));
    const out = V3(0, Math.cos(phi), Math.sin(phi));
    const v = d.clone().multiplyScalar(1.6).addScaledVector(out, 1.0);
    const t = stab.part(`thruster-${i + 1}`, {
      name: `Micro-Thruster, ${where[i]}`,
      info: 'Cold-gas micro-thruster clamped to a longeron in the gap between two cowl panels: black valve and feed block, chrome tube and a bell nozzle with a cyan glow.',
      specs: { Material: 'Chrome-plated steel, black anodised valve body, cyan emitter', Mass: '0.006 g', Function: 'Attitude trim thrust through the cowl gap', Dimensions: '2.2 mm long, 0.45 mm nozzle' },
      explode: ex([v.x, v.y, v.z], 'mid', null, 'local'),
    });
    bag.emit(t, { black: M.black, chrome: M.chrome, glow: M.glowCyan }, MT);
  });
}

/* ------------------------------------------------------------------ attitude sensor + flex cable */
const S_A = 10.42, S_D = -0.4;    // sensor board: station and depth under the skin of the dorsal panel
/** Sensor frame: x towards the ring along the skin, y out of the skin, z to the bee's right. */
const sensorFrame = () => basisM(skP(S_A, 0, S_D), skN(S_A, 0), V3(1, 0, 0));

function sensorBag() {
  const b = new Bag();
  const board = box(1.0, 0.06, 0.9, 0.012);
  b.put('pcb', board);
  const frame = plate(shape(rectPts(1.3, 1.2, 0.1), [rectPts(1.03, 0.93, 0.04)]), 0.14, { bevel: 0.022, bevelSegments: 2, center: true, steps: 3, uvScale: 0.6 });
  frame.rotateX(-Math.PI / 2);
  b.put('black', frame, T4(0, 0.01, 0));
  // dies: a big MEMS package with a chrome lid, two smaller chips, two connectors and some passives
  b.put('black', box(0.4, 0.07, 0.4, 0.012), T4(0.06, 0.065, 0));
  b.put('chrome', box(0.3, 0.014, 0.3, 0.004), T4(0.06, 0.107, 0));
  b.put('black', box(0.24, 0.05, 0.2, 0.01), T4(-0.28, 0.055, -0.22));
  b.put('black', box(0.2, 0.045, 0.18, 0.01), T4(-0.3, 0.052, 0.22));
  for (const z of [-0.28, 0.28]) {
    b.put('black', box(0.16, 0.08, 0.22, 0.012), T4(0.38, 0.07, z));
    b.put('chrome', box(0.02, 0.02, 0.18, 0.004), T4(0.46, 0.09, z));
  }
  const smd = box(0.07, 0.03, 0.04, 0.006);
  for (const [x, z] of [[-0.05, 0.35], [0, -0.34], [0.22, 0.34], [-0.4, 0], [-0.42, -0.35], [0.1, -0.33], [-0.18, 0.02], [0.3, 0.04]]) b.put('black', smd, T4(x, 0.045, z));
  // bezel screws, mounting ears, base plate on four chrome standoffs
  const screw = hexBolt(0.045, 0.05, 8);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    b.put('chrome', screw, T4(sx * 0.575, 0.08, sz * 0.525));
    b.put('chrome', cyl(0.05, 0.0925, { bevel: 0.008, segments: 12, steps: 1, y0: -0.1225 }), T4(sx * 0.5, 0, sz * 0.44));
  }
  for (const sz of [-1, 1]) {
    b.put('black', box(0.3, 0.1, 0.22, 0.02), T4(0, 0.01, sz * 0.7));
    b.put('chrome', screw, T4(0, 0.06, sz * 0.72));
  }
  b.put('black', box(1.14, 0.035, 0.98, 0.01), T4(0, -0.14, 0));
  return b;
}

export function buildSensor(stab) {
  const part = stab.part('attitude-sensor', {
    name: 'Attitude Sensor',
    info: 'Inertial measurement board with gyro and accelerometer chips in a black bezel on four standoffs; its glowing traces show through the dorsal louvres.',
    specs: { Material: 'Glass-epoxy board, black bezel, chrome fasteners', Mass: '0.008 g', Function: 'Measures roll, pitch and yaw rate', Dimensions: '1.3 x 1.2 mm bezel, 0.25 mm thick' },
    explode: ex([-3.2, 0.9, 0], 'mid', null, 'local'),
  });
  sensorBag().emit(part, { pcb: M.pcbGlow, black: M.black, chrome: M.chrome }, sensorFrame());
  return part;
}

export function buildFlex(stab) {
  const part = stab.part('flex-cable', {
    name: 'Flex Cable',
    info: 'Orange polyimide flex ribbon with ten printed gold traces, black stiffeners and gold contact pads; carries sensor data from the attitude board to the connector on the mount ring.',
    specs: { Material: 'Polyimide with gold-plated copper traces, black stiffeners', Mass: '0.002 g', Function: 'Sensor data link to the mount ring', Dimensions: '0.5 mm wide, 1.4 mm long, 0.02 mm thick' },
    explode: ex([-1.5, 0.35, 0], 'mid', null, 'local'),
  });
  const Mb = sensorFrame();
  const loc = (x) => V3(x, 0, 0).applyMatrix4(Mb);
  const pts = [loc(0.6), loc(0.8), V3(-9.585, 2.34, 0), V3(-9.545, 2.47, 0), V3(-9.52, 2.6, 0), V3(-9.46, 2.665, 0), V3(-9.4, 2.675, 0)];
  const frames = pathFrames(pts, 40, V3(0, 1, 0));
  part.add(sweepFrames(frames, rrect(0.5, 0.02, 0.006, 1), { creaseDeg: 50 }), POLY);
  const b = new Bag();
  // ten printed traces (0.05 mm pitch) along the ribbon, widening into contact pads at both ends
  const side = new THREE.Vector3();
  const lane = (o, i0, i1) => {
    const fr = [];
    for (let i = i0; i <= i1; i++) {
      const f = frames[i];
      side.crossVectors(f.n, f.t).normalize();
      fr.push({ p: f.p.clone().addScaledVector(side, o).addScaledVector(f.n, 0.0115), n: f.n, t: f.t });
    }
    return fr;
  };
  const trace = [[-0.007, 0], [0.007, 0], [0.007, 0.006], [-0.007, 0.006]];
  const pad = [[-0.02, 0], [0.02, 0], [0.02, 0.005], [-0.02, 0.005]];
  for (let k = 0; k < 10; k++) {
    const o = (k - 4.5) * 0.05;
    b.put('gold', sweepFrames(lane(o, 4, 36), trace, { creaseDeg: 60 }));
    for (const [i0, i1] of [[1, 4], [36, 39]]) b.put('gold', sweepFrames(lane(o, i0, i1), pad, { creaseDeg: 60 }));
  }
  // connector housing on the aft face of the ring with a comb of gold pins on its forward side, black stiffener at the sensor end
  b.put('black', box(0.14, 0.09, 0.6, 0.015), T4(-9.41, 2.675, 0));
  b.put('black', box(0.05, 0.03, 0.56, 0.008), T4(-9.465, 2.738, 0));
  const pin = box(0.12, 0.022, 0.03, 0.004);
  for (let k = 0; k < 10; k++) b.put('gold', pin, T4(-9.3, 2.675, (k - 4.5) * 0.05));
  b.put('black', box(0.3, 0.03, 0.54, 0.008), Mb.clone().multiply(T4(0.72, -0.025, 0)));
  b.emit(part, { black: M.black, gold: M.gold });
  return part;
}

/* ------------------------------------------------------------------ pushrod actuators */
/** Keyhole-shaped rod eye in the XY plane (head round the origin, neck towards dir * y), thickness along Z, cross-bore 0.044. */
function eyeGeo(dir) {
  const R = 0.115, w = 0.07, L = 0.3, k = Math.sqrt(R * R - w * w);
  const a0 = Math.atan2(k, -w), a1 = Math.atan2(k, w) + Math.PI * 2;
  const pts = [[-w, L]];
  for (let i = 0; i <= 14; i++) { const a = a0 + ((a1 - a0) * i) / 14; pts.push([R * Math.cos(a), R * Math.sin(a)]); }
  pts.push([w, L]);
  const P = dir > 0 ? pts : pts.map(([x, y]) => [x, -y]);
  return plate(shape(P, [circlePts(0.044, 14)]), 0.16, { bevel: 0.022, bevelSegments: 2, center: true, steps: 3, uvScale: 0.6 });
}

export function buildActuators(stab) {
  const part = stab.part('actuators', {
    name: 'Gimbal Actuators',
    info: 'Four chrome-rod linear actuators in a pinwheel between the ring ears and the gimbal clamp blocks; clevis eyes on cross pins at both ends tilt the gimbal ring.',
    specs: { Material: 'Black anodised barrels, chrome rods and eyes, gold bands', Mass: '0.012 g', Function: 'Tilts the gimbal ring', Dimensions: '2.0 mm pin-to-pin, 0.2 mm barrels' },
    explode: ex([-1.2, -0.4, 0], 'mid', null, 'local'),
  });
  const b = new Bag();
  const eyeE = eyeGeo(1), eyeL = eyeGeo(-1), nut = hexNut(0.075, 0.05);
  const barrel = cyl(0.1, 0.78, { bevel: 0.016, segments: 24, steps: 1, y0: 0.28 });
  const cap = cyl(0.106, 0.04, { bevel: 0.01, segments: 24, steps: 1, y0: 0.28 });
  const band = cyl(0.106, 0.04, { bevel: 0.008, segments: 24, steps: 1, y0: 0.5 });
  const bush = cyl(0.064, 0.07, { bevel: 0.01, segments: 16, steps: 1, y0: 1.06 });
  for (const a of ACT) {
    const ME = frameUZ(a.E, a.u, a.nE), ML = frameUZ(a.L, a.u, a.nL);
    b.put('chrome', eyeE, ME);
    b.put('chrome', eyeL, ML);
    b.put('black', barrel, ME);
    b.put('chrome', cap, ME);
    b.put('chrome', cap, ME.clone().multiply(T4(0, 0.74, 0)));
    b.put('gold', band, ME);
    b.put('gold', band, ME.clone().multiply(T4(0, 0.3, 0)));
    b.put('chrome', bush, ME);
    const rl = a.len - 0.3 - 1.06;
    b.put('chrome', cyl(0.043, rl, { bevel: 0.006, segments: 14, steps: 1, y0: 1.06 }), ME);
    b.put('chrome', nut, ME.clone().multiply(T4(0, a.len - 0.4, 0)));
  }
  b.emit(part, { black: M.black, chrome: M.chrome, gold: M.gold });
  return part;
}

export function buildSys(stab) {
  buildThrusters(stab);
  buildSensor(stab);
  buildActuators(stab);
  buildFlex(stab);
}
