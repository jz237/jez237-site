// Abdomen belt: the black ribbed collar that joins the yellow cap to the first fur band (a = 3.40 .. 4.78).
// Chrome and gunmetal seam rings with bolt rings, two chrome-framed display strips with cyan microtext, the finely ribbed
// belt ring itself and four ladder latch brackets. All parts are 'shell' parts of the abdomen-shell root.
import { THREE, M } from '../kit.js';
import { TAU, ringLathe, plateAP, rectAP, flankChart, decalGeo, placeAt, frameAt, frameMer, hexBolt, cuboid, pin, loc, mk, exl } from './abdomen-common.js';
import { atlas } from './abdomen-tex.js';

/** Axial layout of the belt (a = mm behind the petiole). */
export const BELT = { front: 3.40, strip0: 3.565, strip1: 3.995, mid0: 4.00, mid1: 4.08, rear0: 4.62, rear1: 4.78 };
const AREF = 2.2;
const RX90 = new THREE.Matrix4().makeRotationX(Math.PI / 2);
const RZ90 = new THREE.Matrix4().makeRotationZ(Math.PI / 2);

/** n bolt heads around the axis at axial position a, radial offset off; heads point out of the body. */
function boltRing(part, geo, mat, a, off, n, phase = 0, skip = null) {
  for (let i = 0; i < n; i++) {
    const phi = phase + (i / n) * TAU;
    if (skip && skip(phi)) continue;
    part.add(geo, mat, placeAt(a, phi, off, phi * 3));
  }
}

/** A seam ring: flange profile with a shallow bolt channel in the middle (chrome). */
function seamLoop(a0, a1, out = 0.075, wall = 0.46) {
  const c = 0.035;
  return [[a0, -wall, 0.02], [a0, out, 0.028], [a0 + c, out], [a0 + c, out - 0.035], [a1 - c, out - 0.035], [a1 - c, out], [a1, out, 0.028], [a1, -wall, 0.02]];
}

/** Ladder latch bracket on a flank chart: gunmetal base plate, two chrome rails, three rungs, chrome pivot pins. */
function bracket(part, chart, side, a, psi, lift) {
  const b = frameAt(chart, a, psi, { side, lift });
  part.add(cuboid(0.40, 0.62, 0.05), M.gunmetalDark, loc(b, 0, 0, 0.025));
  for (const dx of [-0.16, 0.16]) part.add(cuboid(0.05, 0.66, 0.05), M.chrome, loc(b, dx, 0, 0.075));
  for (const dy of [-0.23, 0, 0.23]) part.add(cuboid(0.30, 0.04, 0.04), M.chrome, loc(b, 0, dy, 0.12));
  for (const dy of [-0.34, 0.34]) part.add(pin(0.032, 0.09, 8), M.chrome, loc(b, 0, dy, 0.1).multiply(RX90));
  part.add(cuboid(0.10, 0.10, 0.05), M.chrome, loc(b, 0, 0.0, 0.17));
}

export function buildBelt(root) {
  const t = atlas();

  /* ------------------------------------------------------------ front seam ring */
  const bolt = hexBolt(0.04, 0.034);
  {
    const p = mk(root, 'seam-ring-front', 'Front Seam Ring',
      'Chrome closing ring where the yellow cap meets the belt; a shallow channel carries a ring of 28 gunmetal hex bolts that clamp the cap liner.',
      { tag: 'shell', explode: exl(-1.3, 0, 0, 'fine'), specs: { Material: 'Hard-chrome stainless steel', Fasteners: '28 hex bolts', Mass: '0.02 g' } });
    p.add(ringLathe(seamLoop(BELT.front, BELT.strip0 - 0.005), { rel: true, seg: 96, crease: 50, maxStep: 0.3, steps: 2 }), M.chrome);
    boltRing(p, bolt, M.gunmetalDark, (BELT.front + BELT.strip0 - 0.005) / 2, 0.04, 28, 0.06);
  }

  /* ------------------------------------------------------------ display strips */
  for (const side of [1, -1]) {
    const tag = side > 0 ? 'r' : 'l';
    const chart = flankChart(side, AREF);
    const a0 = (BELT.strip0 + BELT.strip1) / 2;
    const p = mk(root, `display-strip-${tag}`, `${side > 0 ? 'Right' : 'Left'} Display Strip`,
      `${side > 0 ? 'Right' : 'Left'} status display: a chrome-framed strip of dark glass with scrolling cyan microtext for link, thermal, payload and hydraulic readings.`,
      { tag: 'shell', explode: exl(-2.2, 0, side * 3.2, 'fine'), specs: { Material: 'Chrome bezel, tempered glass, cyan micro-LED', Size: '0.43 x 7.5 mm', Mass: '0.01 g' } });
    const bez = rectAP(a0, 90, 0.215, 43.5, 0.14);
    p.add(plateAP(chart, bez, { side, thick: 0.10, outer: 0.10, bevel: 0.03, holes: [rectAP(a0, 90, 0.15, 38.6, 0.07)], bevelSegments: 1, maxEdge: 1.0, steps: 3 }), M.chrome);
    p.add(plateAP(chart, rectAP(a0, 90, 0.16, 39.2, 0.075), { side, thick: 0.03, outer: 0.052, bevel: 0, maxEdge: 1.0, steps: 2 }), M.lens);
    const [cx, cy] = chart.inv(a0, 90 * side);
    p.add(decalGeo(chart.at(cx, cy), 0.28, 5.6, [0, 0, 1, 1], { lift: 0.062, rot: 0, maxEdge: 0.4 }), t.glow);
    for (const dpsi of [-41.4, 41.4]) p.add(hexBolt(0.036, 0.03), M.chrome, placeAt(a0, (side * (90 + dpsi)) * Math.PI / 180, 0.10));
  }

  /* ------------------------------------------------------------ ribbed belt ring */
  {
    const p = mk(root, 'ring-ribs', 'Rib Ring',
      'Black anodised belt ring with six fine circumferential ribs and yellow piping; it seats the display strips and clamps and gives the fur bands a rigid collar.',
      { tag: 'shell', explode: exl(-2.2, 0, 0, 'mid'), specs: { Material: 'Black-anodised aluminium, yellow inlay', Ribs: '6 x 0.07 mm pitch', Mass: '0.12 g' } });
    const a0 = BELT.strip0 - 0.005, a1 = BELT.rear0;
    const loop = [[a0, -0.55, 0.02], [a0, 0.0], [4.10, 0.0]];
    for (let i = 0; i < 6; i++) {
      const c = 4.155 + i * 0.075;
      loop.push([c - 0.03, 0.0], [c - 0.019, 0.036], [c + 0.019, 0.036], [c + 0.03, 0.0]);
    }
    loop.push([a1, 0.0], [a1, -0.55, 0.02]);
    p.add(ringLathe(loop, { rel: true, seg: 96, crease: 40, maxStep: 0.3, steps: 2 }), M.black);
    for (const [x0, x1] of [[a0 + 0.012, a0 + 0.062], [a1 - 0.062, a1 - 0.012]]) {
      p.add(ringLathe([[x0, -0.03], [x0, 0.012], [x1, 0.012], [x1, -0.03]], { rel: true, seg: 96, crease: 50, maxStep: 0.4 }), M.yellow);
    }
  }

  /* ------------------------------------------------------------ middle clamp band */
  {
    const p = mk(root, 'seam-ring-mid', 'Clamp Band',
      'Gunmetal clamp band around the belt with a ring of 24 steel bolts and a tensioning bridge on the underside; it pins the display strips onto the rib ring.',
      { tag: 'shell', explode: exl(-1.35, 0, 0, 'fine'), specs: { Material: 'Gunmetal steel, A2 bolts', Fasteners: '24 + 1 tension bolt', Mass: '0.02 g' } });
    const a0 = BELT.mid0, a1 = BELT.mid1, am = (a0 + a1) / 2;
    p.add(ringLathe([[a0, -0.05], [a0, 0.085, 0.02], [a1, 0.085, 0.02], [a1, -0.05]], { rel: true, seg: 96, crease: 50, maxStep: 0.3, steps: 2 }), M.gunmetal);
    const near = (phi) => Math.abs(((phi - 2.9 + Math.PI) % TAU + TAU) % TAU - Math.PI) < 0.26;
    boltRing(p, hexBolt(0.028, 0.026), M.steel, am, 0.085, 24, 0.13, near);
    // tensioning bridge: two blocks and a cross bolt
    const bm = frameMer(am, 2.9, 0.085);
    for (const dx of [-0.13, 0.13]) p.add(cuboid(0.17, 0.095, 0.08), M.gunmetal, loc(bm, dx, 0, 0.04));
    p.add(pin(0.022, 0.4, 8), M.steel, loc(bm, 0, 0, 0.055).multiply(RZ90));
  }

  /* ------------------------------------------------------------ rear seam ring */
  {
    const p = mk(root, 'seam-ring-rear', 'Rear Seam Ring',
      'Chrome seam ring that closes the belt against the first fur band; a ring of 32 gunmetal hex bolts locks the whole band stack onto the frame.',
      { tag: 'shell', explode: exl(-2.8, 0, 0, 'mid'), specs: { Material: 'Hard-chrome stainless steel', Fasteners: '32 hex bolts', Mass: '0.03 g' } });
    p.add(ringLathe(seamLoop(BELT.rear0, BELT.rear1, 0.07, 0.5), { rel: true, seg: 96, crease: 50, maxStep: 0.3, steps: 2 }), M.chrome);
    boltRing(p, bolt, M.gunmetalDark, (BELT.rear0 + BELT.rear1) / 2, 0.035, 32, 0.0);
  }

  /* ------------------------------------------------------------ latch brackets */
  for (const side of [1, -1]) {
    const tag = side > 0 ? 'r' : 'l';
    const chart = flankChart(side, AREF);
    const p = mk(root, `clamp-brackets-${tag}`, `${side > 0 ? 'Right' : 'Left'} Latch Brackets`,
      `Pair of ladder latches on the ${side > 0 ? 'right' : 'left'} belt: gunmetal base plates with chrome rails, rungs and pivot pins that lock the belt to the frame.`,
      { tag: 'shell', explode: exl(-2.2, 0, side * 2.6, 'fine'), specs: { Material: 'Gunmetal base, chrome rails and pins', Count: '2 per side', Mass: '0.02 g' } });
    for (const psi of [33, 146]) bracket(p, chart, side, 4.34, psi, 0.036);
  }
}
