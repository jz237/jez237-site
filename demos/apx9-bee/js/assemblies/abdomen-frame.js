import { M, child, rod, boltRing, bearing, harness, cyl, box, at, gear } from './finish-kit.js';
import { R, A } from './abdomen-common.js';
export function buildFrame(frame) {
  for (const [i, a] of [1.1, 3.1, 5.8, 8.35].entries()) {
    const r = R(a) - 0.55,
      p = child(
        frame,
        `ring-${i + 1}`,
        `Abdomen Bulkhead ${i + 1}`,
        'Stepped titanium bulkhead with black seal channels, bearing races and twelve recessed assembly screws.',
        [-i * 0.7, 0, 0],
        'mid',
      );
    bearing(p, [-a, 0, 0], r, r - 0.37, [1, 0, 0], 0.3);
    boltRing(p, [-a + 0.2, 0, 0], r - 0.2, 12, [1, 0, 0], 0.08);
    for (let k = 0; k < 6; k++) {
      const t = (k * Math.PI) / 3;
      rod(
        p,
        [-a, Math.cos(t) * 0.75, Math.sin(t) * 0.75],
        [-a, Math.cos(t) * (r - 0.15), Math.sin(t) * (r - 0.15)],
        0.09,
        M.gunmetal,
      );
    }
  }
  for (let k = 0; k < 6; k++) {
    const t = ((k + 0.5) * Math.PI) / 3;
    const p = child(
      frame,
      `spine-${k + 1}`,
      `Payload Cage Rail ${k + 1}`,
      'Curved load rail following the abdomen profile, with reinforced collars at each supporting bulkhead.',
      [0, Math.cos(t) * 0.6, Math.sin(t) * 0.6],
    );
    const pts = [1.1, 2.1, 3.1, 4.3, 5.8, 7.1, 8.35].map((a) => [
      -a,
      (R(a) - 0.7) * Math.cos(t),
      (R(a) - 0.7) * Math.sin(t) * A,
    ]);
    harness(p, pts, 0.13, M.titanium);
  }
  const shaft = child(
    frame,
    'shaft',
    'Abdomen Drive Shaft',
    'Stepped longitudinal stabilizer shaft with sealed support bearings, splined coupler and a rear reduction gear.',
    [-1, 0, 0],
    'mid',
  );
  rod(shaft, [-0.3, 0, 0], [-8.8, 0, 0], 0.28, M.chrome);
  for (const x of [-1.1, -3.1, -5.8, -8.35]) bearing(shaft, [x, 0, 0], 0.62, 0.29, [1, 0, 0], 0.3);
  shaft.add(gear({ teeth: 22, rOut: 0.96, rRoot: 0.8, bore: 0.3 }, 0.18), M.steel, { p: [-7.8, 0, 0], r: [0, 90, 0] });
  const bay = child(
    frame,
    'payload-bay',
    'Pollen Payload Reservoir',
    'Sealed pollen reservoir with a removable inspection lid, yellow retaining straps, metering ports and a fine stainless screen.',
    [0, 1.6, 0],
    'mid',
  );
  bay.add(box(3.7, 1.8, 2.75, 0.25), M.gunmetalDark, [-4.4, 1.65, 0]);
  const lid = child(
    bay,
    'lid',
    'Payload Inspection Lid',
    'Perforated titanium service cover with stiffened edges and recessed attachment screws.',
    [0, 1.1, 0],
  );
  lid.add(box(3.65, 0.16, 2.72, 0.1), M.titanium, [-4.4, 2.62, 0]);
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 5; j++)
      lid.add(cyl(0.065, 0.018, { segments: 8 }), M.black, [-5.8 + i * 0.4, 2.715, -0.8 + j * 0.4]);
  for (const x of [-5.9, -2.9])
    for (const s of [-1, 1]) {
      bay.add(box(0.18, 1.85, 0.14, 0.03), M.yellow, [x, 1.62, s * 1.4]);
      lid.add(cyl(0.11, 0.07, { segments: 6 }), M.steel, [x, 2.75, s * 1.1]);
    }
  for (const s of [-1, 1]) {
    const p = child(
      frame,
      `climate-${s > 0 ? 'r' : 'l'}`,
      `${s > 0 ? 'Right' : 'Left'} Thermal Management Pack`,
      'Finned heat exchanger with a micro-pump, copper cooling loops and flexible lines routed around the pollen bay.',
      [0, -0.7, s * 1.25],
      'mid',
    );
    p.add(box(2.7, 0.72, 0.65, 0.1), M.black, [-4.7, -1.8, s * 1.75]);
    for (let j = 0; j < 15; j++) p.add(box(0.075, 1.02, 0.92, 0.016), M.steel, [-5.95 + j * 0.18, -1.8, s * 1.75]);
    p.add(cyl(0.36, 0.85, { axis: 'x', segments: 24 }), M.gunmetal, [-2.7, -1.8, s * 1.75]);
    for (let j = 0; j < 3; j++)
      harness(
        p,
        [
          [-6, -1.25, s * (1.4 + j * 0.15)],
          [-6.9, -0.4, s * 2.1],
          [-2.7, -0.6, s * 2.15],
          [-2.3, -1.8, s * 1.75],
        ],
        0.055,
        M.copper,
      );
  }
  const board = child(
    frame,
    'control',
    'Payload Control Board',
    'Carbon-backed sensor PCB with calibrated metering controller, memory packages and gold connector pads.',
    [0, -1.6, 0],
    'mid',
  );
  board.add(box(2.6, 0.13, 1.8, 0.08), M.pcb, [-4, -2.5, 0]);
  for (let j = 0; j < 4; j++) board.add(box(0.4, 0.13, 0.65, 0.03), M.black, [-4.9 + j * 0.58, -2.38, 0]);
  for (let j = 0; j < 16; j++) board.add(box(0.075, 0.03, 0.3, 0.005), M.gold, [-5.1 + j * 0.145, -2.41, 0.76]);
}
