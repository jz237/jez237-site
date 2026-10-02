// optics-ocelli.js - the three simple eyes on the crown: chrome bezel + black sensor can (ocellus), glossy lens dome (child).
import { THREE, K, V3, M, S, revolve, cyl } from '../kit.js';
import { ellN, TAU } from './optics-frame.js';
import { capScrew, knurl } from './optics-hw.js';

const mT = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
const mRy = (a) => new THREE.Matrix4().makeRotationY(a);

/** Surface sites of the three ocelli: point on the head ellipsoid, outward normal, orientation quaternion. */
export function ocellusSites() {
  const H = K.head;
  return H.ocelli.map((p) => {
    const d = V3((p.x - H.c.x) / H.r.x, (p.y - H.c.y) / H.r.y, (p.z - H.c.z) / H.r.z).normalize();
    const s = V3(H.c.x + H.r.x * d.x, H.c.y + H.r.y * d.y, H.c.z + H.r.z * d.z);
    const n = ellN(s, H.c, H.r);
    const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), n);
    return { P: s, n, q, seat: p.clone() };
  });
}

/** Bezel ring (chrome, three set screws) and the sensor can behind it (black). Origin on the surface, +Y outward. */
export function buildOcellusBody(part, idx) {
  const bezel = revolve([
    [0.47, 0.02, 0], [0.62, -0.02, 0], [0.80, 0.00, 0.01], [0.78, 0.115, 0.04], [0.64, 0.145, 0.02], [0.55, 0.15, 0.015], [0.47, 0.11, 0.015], [0.47, 0.02],
  ], { segments: 40, steps: 2 });
  part.add(bezel, M.chrome);
  // retaining ring inside the bezel + three small screws on the flange
  const keep = revolve([[0.40, 0.00, 0], [0.50, 0.00, 0.01], [0.50, 0.10, 0.012], [0.44, 0.10, 0.01], [0.40, 0.00]], { segments: 32, steps: 1 });
  part.add(keep, M.chrome, mT(0, 0.02, 0));
  const sc = capScrew(0.055, 0.05, { seg: 12 });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU + idx * 0.7 + 0.5;
    part.add(sc, M.chrome, mT(Math.cos(a) * 0.68, 0.135, Math.sin(a) * 0.68));
  }
  // sensor can: plug through the head plate, shoulder, stepped back with three terminals
  const can = revolve([
    [0, -1.10], [0.40, -1.10, 0.04], [0.40, -0.95], [0.58, -0.95, 0.03], [0.58, 0.00, 0.02], [0.45, 0.00], [0.45, 0.04], [0.37, 0.04], [0.37, -0.12], [0, -0.12],
  ], { segments: 36, steps: 1 });
  part.add(can, M.black);
  // photodiode in the pocket under the lens: polished die inside a gold bond ring
  part.add(cyl(0.27, 0.05, { segments: 24, y0: -0.12, bevel: 0.01 }), M.chrome);
  part.add(revolve([[0.30, -0.12, 0], [0.36, -0.12, 0.008], [0.36, -0.065, 0.012], [0.30, -0.065, 0.008], [0.30, -0.12]], { segments: 28, steps: 1 }), M.gold);
  // knurled grip band, glass-to-metal seal ring on the plug, gold lead pins
  part.add(knurl(0.605, 0.55, 40, -0.66, 0.30, 0.03, 0), M.black);
  part.add(revolve([[0.27, -1.10, 0], [0.33, -1.10, 0.008], [0.33, -1.075, 0.008], [0.27, -1.075, 0], [0.27, -1.10]], { segments: 24, steps: 1 }), M.gold);
  const pin = cyl(0.045, 0.34, { segments: 8, y0: -1.44, bevel: 0.01, steps: 1 });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU + 0.5;
    part.add(pin, M.gold, mT(Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2));
  }
}

/** Lens dome: spherical cap in a short skirt, the skirt hides in the bezel. */
export function buildOcellusLens(part) {
  const prof = [[0, 0.00], [0.44, 0.00, 0.01], [0.46, 0.08, 0.01]];
  const h = 0.33, rr = 0.46;
  // cap: sphere of radius Rs through radius rr at height 0.08 and apex at 0.08 + h
  const Rs = (rr * rr + h * h) / (2 * h);
  const n = 10;
  for (let i = 1; i <= n; i++) {
    const r = rr * (1 - i / n);
    prof.push([r, 0.08 + (Math.sqrt(Math.max(Rs * Rs - r * r, 0)) - (Rs - h))]);
  }
  part.add(revolve(prof, { segments: 36, steps: 1, creaseDeg: 60 }), M.lens);
}
