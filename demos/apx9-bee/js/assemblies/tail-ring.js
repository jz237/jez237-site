// Stabilizer structure: mount ring (with actuator ears and the longerons that carry the thrusters), the axial ring bolts and the
// hand-off to the control-fin collar (tail-fins.js). Everything is in the abdomen-local frame; y = a (distance behind the petiole).
import { M, ex, V3, THREE, D2R, cyl, box } from '../kit.js';
import {
  A0, skR, skP, skN, rp, toA, lathe, smooth, lerp, sweepFrames, rrect, hexBolt, placeM, ACT, EAR_A, EAR_R, earP,
} from './tail-common.js';
import { buildFins } from './tail-fins.js';

export const RING = { rIn: 2.62, a0: A0, a1: 9.34 };
/** Thruster azimuths (deg) and the thruster axis: a point at distance a along the gap, 0.2 mm under the skin. */
export const THR_PHI = [40, 140, 220, 320];
export const thrP = (a, phiDeg) => rp(a, phiDeg * D2R, skR(a) - 0.2);
export { EAR_A, EAR_R, earP };

const G = (loop, o = {}) => toA(lathe(loop, { segments: 88, ...o }));

/* ------------------------------------------------------------------ mount ring */
function ringBody(ring) {
  const RI = RING.rIn;
  const body = [[RI, 9.0], [skR(9.0), 9.0, 0.025]];
  for (const a of [9.1, 9.2, 9.3]) body.push([skR(a), a]);
  body.push([skR(9.34), 9.34, 0.025], [RI, 9.34], [RI, 9.0]);
  ring.add(G(body), M.gunmetal);
  // chrome front bead, black seal ring, chrome inner race
  ring.add(G([[2.95, 9.0], [3.2, 9.0, 0.02], [3.15, 9.075, 0.02], [2.95, 9.075], [2.95, 9.0]]), M.chrome);
  ring.add(G([[2.95, 9.16], [skR(9.16) + 0.02, 9.16, 0.012], [skR(9.2) + 0.02, 9.2, 0.012], [2.95, 9.2], [2.95, 9.16]]), M.black);
  ring.add(G([[2.56, 9.06], [2.64, 9.06, 0.01], [2.64, 9.3], [2.56, 9.3, 0.01], [2.56, 9.06]]), M.chrome);
  // radial flange bolts between the bead and the seal
  const bolt = hexBolt(0.04, 0.04, 8);
  const items = [];
  for (let k = 0; k < 16; k++) {
    const phi = (k / 16) * Math.PI * 2 + Math.PI / 16;
    items.push(placeM(skP(9.118, phi, -0.004), skN(9.118, phi)));
  }
  ring.addMany(bolt, M.chrome, items);
}

/**
 * Clevis ear for each actuator: a base plate on the ring's inner wall, a web, two cheeks and a chrome pin. The cheeks
 * stand in the plane that contains the pushrod (see ACT in tail-common.js), so the plate is yawed per ear.
 */
function ears(ring) {
  const base = box(0.5, 0.07, 0.5, 0.02), cheek = box(0.34, 0.3, 0.07, 0.025), web = box(0.2, 0.22, 0.15, 0.02);
  const pin = cyl(0.04, 0.32, { bevel: 0.01, segments: 14, axis: 'z', y0: -0.16 });
  const nut = cyl(0.062, 0.03, { bevel: 0.008, segments: 14, axis: 'z', y0: 0 });
  const black = [], chrome = [];
  for (const a of ACT) {
    const c = Math.cos(a.phi), s = Math.sin(a.phi);
    const rad = V3(0, c, s), aft = V3(-1, 0, 0), tan = new THREE.Vector3().crossVectors(aft, rad);
    const wall = rp(9.25, a.phi, RING.rIn - 0.02);
    const M0 = new THREE.Matrix4().makeBasis(aft, rad, tan).setPosition(wall);
    black.push([base, M0.clone().multiply(new THREE.Matrix4().makeTranslation(0, -0.035, 0))]);
    const z = new THREE.Vector3().crossVectors(a.hE, a.radE);
    const Mc = new THREE.Matrix4().makeBasis(a.hE, a.radE, z).setPosition(a.E);
    const at = (x, y, zz = 0) => Mc.clone().multiply(new THREE.Matrix4().makeTranslation(x, y, zz));
    black.push([cheek, at(-0.02, -0.01, 0.13)], [cheek, at(-0.02, -0.01, -0.13)], [web, at(-0.14, 0.06, 0)]);
    chrome.push([pin, Mc], [nut, at(0, 0, 0.165)], [nut, at(0, 0, -0.195)]);
  }
  for (const [g, m] of black) ring.add(g, M.black, m);
  for (const [g, m] of chrome) ring.add(g, M.chrome, m);
}

/** Diagonal longeron under each thruster gap, rising from the ring wall; the thruster clamps sit on it. */
function longerons(ring) {
  for (const deg of THR_PHI) {
    const phi = deg * D2R, pts = [];
    for (let i = 0; i <= 12; i++) {
      const a = lerp(9.12, 10.66, i / 12);
      const drop = 0.2 + 0.26 * smooth((a - 9.12) / 0.5);
      pts.push({ a, p: rp(a, phi, skR(a) - drop), n: skN(a, phi) });
    }
    const frames = pts.map((q, i) => ({ p: q.p, n: q.n, t: pts[Math.min(12, i + 1)].p.clone().sub(pts[Math.max(0, i - 1)].p).normalize() }));
    ring.add(sweepFrames(frames, rrect(0.24, 0.085, 0.02), { creaseDeg: 40 }), M.black);
  }
}

/* ------------------------------------------------------------------ ring bolts (loose hardware on the ring's aft face) */
function buildBolts(stab) {
  const bolts = stab.part('bolts', {
    name: 'Ring Bolts',
    info: 'Twelve chrome socket-head cap screws that clamp the cowl panels to the aft face of the mount ring; they back out along the axis when the stabilizer opens.',
    specs: { Material: 'Hard-chrome steel', Mass: '0.003 g', Function: 'Panel and ring fastening', Dimensions: 'M0.12 x 0.3 mm' },
    explode: ex([-1.6, 0, 0], 'fine', null, 'local'),
  });
  const bolt = hexBolt(0.062, 0.07, 12);
  const shank = cyl(0.024, 0.2, { bevel: 0.004, segments: 8, y0: -0.2 });
  const items = [], shanks = [];
  for (let k = 0; k < 12; k++) {
    const phi = (k / 12) * Math.PI * 2 + Math.PI / 12;
    const p = rp(RING.a1, phi, 2.70);
    items.push(placeM(p, V3(-1, 0, 0)));
    shanks.push(placeM(p, V3(-1, 0, 0)));
  }
  bolts.addMany(bolt, M.chrome, items);
  bolts.addMany(shank, M.chrome, shanks);
  return bolts;
}

export function buildRing(stab) {
  const ring = stab.part('mount-ring', {
    name: 'Mount Ring',
    info: 'Gunmetal ring that ties the stabilizer to the abdomen at the a = 9 section: chrome bead, flange bolts, four yawed clevis ears for the actuators and four longerons that carry the thrusters.',
    specs: { Material: 'Gunmetal alloy ring, chrome bead and race, black longerons', Mass: '0.04 g', Function: 'Structural interface to the abdomen', Dimensions: '6.4 mm diameter, 0.34 mm deep' },
  });
  ringBody(ring);
  ears(ring);
  longerons(ring);
  buildBolts(stab);
  buildFins(stab);
  return ring;
}
