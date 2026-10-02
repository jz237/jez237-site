// Abdomen underside: the yellow keel plate that runs along the belly through the fur bands (a = 4.88 .. 8.55), with the pollen
// payload door and the louvred climate vent set into it. The fur bands keep clear of the keel footprint (inBelly).
import { THREE, M } from '../kit.js';
import { TAU, ventralChart, plateAP, rectAP, frameAt, frameY, decalAt, strokeOnChart, insetAP, inkUV, hexBolt, cuboid, pin, mk, exl } from './abdomen-common.js';
import { atlas } from './abdomen-tex.js';

const D2R = Math.PI / 180;
const TOP = 0.07;          // outer face of the keel plate above the nominal shell radius
const FLAT = [[4.88, 14], [5.2, 20], [7.6, 15.5], [8.55, 11]];   // half width (deg about the ventral line) along a

/** Keel plate outline [a, psi (deg about the ventral centre line), fillet]: rounded plate narrowing toward the tail. */
export const KEEL = [[4.88, -14, 0.2], [5.2, -20, 0.25], [7.6, -15.5, 0.25], [8.55, -11, 0.25], [8.55, 11, 0.25], [7.6, 15.5, 0.25], [5.2, 20, 0.25], [4.88, 14, 0.2]];
const keelHalf = (a) => {
  if (a < FLAT[0][0] || a > FLAT[3][0]) return 0;
  for (let i = 0; i < 3; i++) if (a <= FLAT[i + 1][0]) return FLAT[i][1] + (FLAT[i + 1][1] - FLAT[i][1]) * ((a - FLAT[i][0]) / (FLAT[i + 1][0] - FLAT[i][0]));
  return 0;
};
const wrapPi = (x) => ((x + Math.PI) % TAU + TAU) % TAU - Math.PI;
/** True when the surface point (a, phi) lies under (or just beside) the keel plate: no fur grows there. */
export const inBelly = (a, phi) => a > 4.8 && a < 8.62 && Math.abs(wrapPi(phi - Math.PI)) < keelHalf(Math.min(8.55, Math.max(4.88, a))) * D2R + 0.04;

export function buildBelly(root) {
  const t = atlas();
  const uv = t.uv;
  const vch = ventralChart(6.4);
  const V = (pts) => pts.map(([a, p, r]) => (r === undefined ? [a, 180 + p] : [a, 180 + p, r]));

  const DOOR = { a: 5.925, da: 0.62, dp: 11.7 }, VENT = { a: 7.5, da: 0.56, dp: 9.0 };

  /* ------------------------------------------------------------ keel plate */
  const plate = mk(root, 'underbelly-plate', 'Underbelly Plate',
    'Yellow keel plate along the belly through the fur bands: hazard bridge, serial stamp, a dozen steel bolts, and openings for the pollen door and the climate vent.',
    { tag: 'shell', explode: exl(0, -3.0, 0, 'mid'), specs: { Material: 'Clear-coated yellow composite', Fasteners: '12 hex bolts', Length: '3.7 mm', Mass: '0.04 g' } });
  const holes = [rectAP(DOOR.a, 180, DOOR.da, DOOR.dp, 0.12), rectAP(VENT.a, 180, VENT.da, VENT.dp, 0.1)];
  plate.add(plateAP(vch, V(KEEL), { thick: 0.2, outer: TOP, bevel: 0.05, holes, maxEdge: 0.5, bevelSegments: 1 }), M.yellow);
  plate.add(inkUV(strokeOnChart(vch, insetAP(vch, V(KEEL), 0.17, 1), { w: 0.02, lift: TOP + 0.004, closed: true, maxEdge: 0.4 })), t.ink);
  plate.add(decalAt(vch, uv('hazard'), 6.75, 180, 0.3, 1.36, { rot: 1, lift: TOP + 0.008 }), t.ink);
  plate.add(decalAt(vch, uv('serial'), 5.11, 180, 0.2, 0.9, { rot: 1, lift: TOP + 0.008 }), t.ink);
  const bolt = hexBolt(0.032, 0.03);
  for (const [a, p] of [[5.0, 9.5], [5.55, 16.8], [6.3, 15.5], [7.1, 14.0], [7.9, 11.6], [8.3, 8.6]]) {
    for (const sg of [-1, 1]) plate.add(bolt, M.steel, frameY(vch, a, 180 + sg * p, { lift: TOP - 0.004 }));
  }

  /* ------------------------------------------------------------ payload door */
  const dRect = rectAP(DOOR.a, 180, DOOR.da - 0.045, DOOR.dp - 0.55, 0.1);
  const door = mk(plate, 'payload-door', 'Payload Door',
    'Hinged yellow pollen-bay door in the keel plate: two chrome hinge barrels at the front, a flush latch bar at the rear; it swings off the bay for refilling.',
    { tag: 'shell', explode: exl(0, -2.6, 0, 'fine'), specs: { Material: 'Yellow composite, chrome hinges', Opening: '1.2 x 2.0 mm', Mass: '0.02 g' } });
  door.add(plateAP(vch, dRect, { thick: 0.16, outer: TOP, bevel: 0.035, maxEdge: 0.5, bevelSegments: 1 }), M.yellow);
  door.add(inkUV(strokeOnChart(vch, insetAP(vch, dRect, 0.12, 1), { w: 0.018, lift: TOP + 0.004, closed: true, maxEdge: 0.4 })), t.ink);
  for (const dp of [-6.2, 6.2]) door.add(pin(0.05, 0.42, 12), M.chrome, frameAt(vch, DOOR.a - DOOR.da + 0.07, 180 + dp, { lift: TOP + 0.03 }));
  door.add(cuboid(0.12, 0.62, 0.05), M.chrome, frameAt(vch, DOOR.a + DOOR.da - 0.22, 180, { lift: TOP + 0.025 }));
  door.add(cuboid(0.05, 0.4, 0.04), M.chrome, frameAt(vch, DOOR.a + DOOR.da - 0.22, 180, { lift: TOP + 0.07 }));

  /* ------------------------------------------------------------ climate vent */
  const vent = mk(plate, 'climate-vent', 'Climate Vent',
    'Louvred exhaust grille of the climate unit: a chrome frame around seven angled black slats that pass warm air out of the belly.',
    { tag: 'shell', explode: exl(0, -2.2, 0, 'fine'), specs: { Material: 'Chrome frame, black anodised louvres', Slats: '7 at 35 deg', Mass: '0.01 g' } });
  vent.add(plateAP(vch, rectAP(VENT.a, 180, VENT.da - 0.04, VENT.dp - 0.5, 0.09),
    { thick: 0.12, outer: TOP + 0.01, bevel: 0.03, maxEdge: 0.5, bevelSegments: 1, holes: [rectAP(VENT.a, 180, VENT.da - 0.17, VENT.dp - 1.5, 0.06)] }), M.chrome);
  const slat = cuboid(0.085, 1.0, 0.018);
  const tilt = new THREE.Matrix4().makeRotationY(35 * D2R);
  for (let i = 0; i < 7; i++) vent.add(slat, M.black, frameAt(vch, VENT.a - 0.33 + i * 0.11, 180, { lift: TOP - 0.03 }).multiply(tilt));
  return plate;
}
