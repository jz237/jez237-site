import {
  THREE,
  V3,
  M,
  child,
  at,
  rod,
  boltRing,
  bearing,
  axialPlate,
  harness,
  cyl,
  box,
  circlePts,
} from './finish-kit.js';
import { K, HIP_N } from '../kit.js';
export function buildChassis(W) {
  const { chassis } = W;
  // Four load-bearing annular bulkheads with radial webs, bearing races and flange screws.
  for (const [i, x] of [-0.2, 1.7, 4.2, 6.2].entries()) {
    const r = i === 0 || i === 3 ? 2.45 : 3.25;
    const p = child(
      chassis,
      `bulkhead-${i + 1}`,
      `Titanium Bulkhead ${i + 1}`,
      'Annular machined bulkhead with radial webs and a central core aperture. It carries the chassis rails and transfers wing and leg loads.',
      [(i - 1.5) * 1.15, 0, 0],
      'mid',
    );
    bearing(p, [x, 0.35, 0], r, r - 0.38, [1, 0, 0], 0.28);
    for (let j = 0; j < 8; j++) {
      const a = (j * Math.PI) / 4;
      rod(
        p,
        [x, 0.35 + Math.cos(a) * 2.02, Math.sin(a) * 2.02],
        [x, 0.35 + Math.cos(a) * (r - 0.15), Math.sin(a) * (r - 0.15)],
        0.105,
        M.titanium,
      );
    }
    boltRing(p, [x + 0.2, 0.35, 0], r - 0.2, 12, [1, 0, 0], 0.085);
  }
  for (let j = 0; j < 6; j++) {
    const a = ((j + 0.5) * Math.PI) / 3,
      y = 0.35 + Math.cos(a) * 2.6,
      z = Math.sin(a) * 2.6;
    const p = child(
      chassis,
      `rail-${j + 1}`,
      `Chassis Stringer ${j + 1}`,
      'Longitudinal carbon-composite structural rail with metal end shoes and locking bolts.',
      [0, Math.cos(a) * 0.7, Math.sin(a) * 0.7],
    );
    rod(p, [-0.5, y, z], [6.4, y, z], 0.17, M.carbon);
    for (const x of [-0.4, 1.7, 4.2, 6.3]) {
      p.add(box(0.38, 0.42, 0.42, 0.06), M.gunmetal, [x, y, z]);
      boltRing(p, [x + 0.21, y, z], 0.14, 4, [1, 0, 0], 0.055);
    }
  }
  for (const side of [-1, 1])
    for (const leg of K.legs) {
      const c = leg.coxa.clone(),
        n = HIP_N.clone();
      c.z *= side;
      n.z *= side;
      const p = child(
        chassis,
        `hip-${leg.id}-${side > 0 ? 'r' : 'l'}`,
        `${side > 0 ? 'Right' : 'Left'} ${leg.id} Hip Socket`,
        'Bolted titanium socket and cross-braced mounting bracket seating the coxa rotary servo of this articulated leg.',
        [0, -0.8, side * 0.9],
      );
      bearing(p, c.toArray(), 0.86, 0.49, n.toArray(), 0.42);
      boltRing(p, c.clone().addScaledVector(n, 0.28).toArray(), 0.71, 8, n.toArray(), 0.075);
      for (const dx of [-0.42, 0.42]) rod(p, [c.x + dx, -1.8, side * 2], [c.x + dx, c.y, c.z], 0.15, M.titanium);
    }
  for (const [id, y, r] of [
    ['core', 0.3, 2.03],
    ['pollination', -4.1, 1.65],
  ]) {
    const p = child(
      chassis,
      `${id}-cradle`,
      `${id === 'core' ? 'Power Core' : 'Pollination'} Cradle`,
      'Twin split-band cartridge supports with isolating pads, captive fasteners and lower frame ties.',
      [0, -0.65, 0],
    );
    for (const x of [0.2, 4.6]) {
      p.add(cyl(r, 0.32, { rIn: r - 0.22, axis: 'x', segments: 48 }), M.gunmetalDark, [x, y, 0]);
      for (const s of [-1, 1]) {
        p.add(box(0.7, 0.36, 0.55, 0.06), M.titanium, [x, y - r * 0.8, s * r * 0.75]);
        rod(p, [x, -2.1, s * 1.8], [x, y - r * 0.8, s * r * 0.75], 0.12, M.steel);
      }
    }
  }
  for (const s of [-1, 1]) {
    const p = child(
      chassis,
      `bus-${s > 0 ? 'r' : 'l'}`,
      `${s > 0 ? 'Right' : 'Left'} Thorax Control Bus`,
      'Gold-contact control backplane with driver chips, connector blocks and routed copper signal bundles.',
      [0, 0.6, s * 0.8],
    );
    p.add(box(3.1, 0.12, 0.72, 0.06), M.pcb, [2.8, -1.55, s * 1.65]);
    for (let i = 0; i < 5; i++) {
      p.add(box(0.38, 0.16, 0.42, 0.03), M.black, [1.65 + i * 0.55, -1.4, s * 1.65]);
      for (let k = 0; k < 4; k++)
        p.add(box(0.055, 0.06, 0.12, 0.006), M.gold, [1.5 + i * 0.55 + k * 0.095, -1.39, s * 1.95]);
    }
    const h = child(
      chassis,
      `harness-${s > 0 ? 'r' : 'l'}`,
      `${s > 0 ? 'Right' : 'Left'} Flex Harness`,
      'Individually routed power and telemetry cables linking the neck, sensor boards, leg drivers and battery interface.',
      [0, -0.5, s * 0.9],
    );
    for (let k = 0; k < 5; k++)
      harness(
        h,
        [
          [-0.6, -0.6, s * (1.75 + k * 0.14)],
          [1, -1.5, s * (2.15 + k * 0.12)],
          [4.8, -1.2, s * (2.1 + k * 0.1)],
          [6.8, 0.15, s * (1.1 + k * 0.1)],
        ],
        0.045,
        k % 2 ? M.copper : M.black,
      );
  }
}
