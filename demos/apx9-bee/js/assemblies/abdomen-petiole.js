// Petiole joint: the waist between thorax and abdomen. A chrome ball sits in a black socket ring behind the thorax collar,
// two small servos drive its pitch / yaw, a ribbed rubber bellows seals the gap and a cable bundle runs back to the frame hub.
// Abdomen-local frame (a = distance behind the petiole centre, x = -a).
import { THREE, V3, M, S, cyl, sphere, torus, box, sweep, screw, hexNut } from '../kit.js';
import { R, ringLathe, tube, axisRing, mk, exl } from './abdomen-common.js';

const BALL = 1.5;

export function buildPetiole(root) {
  /* ---------------------------------------------------------------- ball */
  const ball = mk(root, 'ball', 'Chrome Ball', 'Polished chrome ball of the waist joint. A cross pin through its equator lets the servos pitch and yaw the abdomen against the thorax collar.', {
    explode: exl(-1.2, 0, 0, 'mid'), specs: { Material: 'Hard-chrome 440C', Diameter: `${(BALL * 2).toFixed(1)} mm`, Mass: '0.03 g' },
  });
  ball.add(sphere(BALL, { segments: 64, rings: 40 }), M.chrome);
  for (const x of [-0.66, 0.66]) {          // two dark seam grooves around the ball
    const r = Math.sqrt(BALL * BALL - x * x) - 0.01;
    ball.add(torus(r, 0.045, { radial: 8, tubular: 80 }).rotateY(Math.PI / 2), M.gunmetalDark, { p: [x, 0, 0] });
  }
  // cross pin along Z with chrome end caps and socket screws
  ball.add(cyl(0.2, 4.0, { axis: 'z', bevel: 0.03, segments: 24 }), M.steel);
  for (const s of [-1, 1]) {
    ball.add(cyl(0.46, 0.2, { axis: 'z', bevel: 0.06, segments: 32 }), M.chrome, { p: [0, 0, s * 1.62] });
    ball.add(cyl(0.3, 0.16, { axis: 'z', bevel: 0.04, segments: 24, rIn: 0.13 }), M.gunmetal, { p: [0, 0, s * 1.82] });
  }
  // rear cable gland
  ball.add(tube(1.18, 1.72, 0.74, 0.4, { bevel: 0.06, seg: 40 }), M.gunmetal);
  ball.add(tube(1.5, 1.66, 0.84, 0.4, { bevel: 0.04, seg: 40 }), M.chrome);

  /* ---------------------------------------------------------------- socket ring */
  const sock = mk(root, 'socket-ring', 'Socket Ring', 'Anodised black cup that holds the ball from behind, closed by a chrome retaining ring and bolted to the frame hub through a wide flange.', {
    explode: exl(-3.0, 0, 0, 'mid'), specs: { Material: 'Black-anodised 7075 aluminium', Fasteners: '8 + 6 socket-head', Mass: '0.04 g' },
  });
  const cup = [[0.48, 1.52, 0.02], [0.48, 2.02, 0.05], [1.42, 2.02, 0.05], [1.42, 2.56, 0.06], [1.84, 2.56, 0.06], [1.84, 0.58, 0.04],
    [1.5, 0.6, 0.0], [1.32, 0.84, 0.0], [1.1, 1.08, 0.0], [0.86, 1.28, 0.0], [0.64, 1.44, 0.0]];
  sock.add(ringLathe(cup, { seg: 72, rel: false, crease: 40 }), M.gunmetalDark);
  sock.add(tube(0.26, 0.54, 2.18, 1.52, { bevel: 0.07, seg: 72 }), M.chrome);
  const head = screw(0.13, 0.1);
  sock.inst(head, M.steel, axisRing(8, 1.84, 2.27, { dir: -1, phase: 0.2 }).map((q) => ({ p: q.p, n: q.n, s: 1.1 })));
  sock.inst(head, M.steel, axisRing(6, 0.26, 1.86, { dir: 1, phase: 0.5 }).map((q) => ({ p: q.p, n: q.n, s: 0.9 })));

  /* ---------------------------------------------------------------- servos */
  const servo = mk(root, 'servo', 'Joint Servos', 'A pair of micro servos in gunmetal housings; short crank arms on their output bosses drive the ball\'s pitch and yaw pivot.', {
    explode: exl(-1.8, 0, 0, 'mid'), specs: { Material: 'Gunmetal housing, yellow label plate', Torque: '4 mN.m', Mass: '0.02 g' },
  });
  const sx = -1.12;
  for (const s of [-1, 1]) {
    servo.add(box(0.95, 0.86, 0.8, 0.07), M.gunmetalDark, { p: [sx, 0, s * 2.52] });
    servo.add(box(0.7, 0.58, 0.06, 0.025), M.yellow, { p: [sx, 0, s * 2.94] });
    servo.add(cyl(0.3, 0.26, { axis: 'z', bevel: 0.05, segments: 24 }), M.chrome, { p: [sx + 0.1, 0, s * 2.02] });
    servo.add(box(0.7, 0.14, 0.06, 0.03), M.steel, { p: [sx + 0.45, 0, s * 1.9] , r: [0, 0, 0] });
    servo.add(cyl(0.12, 0.28, { axis: 'z', bevel: 0.03, segments: 14 }), M.steel, { p: [sx + 0.8, 0, s * 1.88] });
    servo.inst(screw(0.06, 0.05), M.steel, [[-0.3, 0.26], [0.3, 0.26], [-0.3, -0.26], [0.3, -0.26]].map(([u, v]) => ({ p: [sx + u, v, s * 2.97], n: [0, 0, s], s: 1 })));
  }

  /* ---------------------------------------------------------------- bellows */
  const bel = mk(root, 'bellows', 'Bellows Sleeve', 'Ribbed flexible rubber sleeve that seals the waist gap between the thorax collar and the abdomen cap while the joint articulates.', {
    explode: exl(-1.0, 0, 0, 'mid'), specs: { Material: 'Silicone-rubber, 14 convolutions', Mass: '0.01 g' },
  });
  const loop = [];
  const a0 = -0.5, a1 = 0.72, n = 12;
  loop.push([a0, -0.62, 0.02]);
  for (let k = 0; k < n; k++) {
    const t = a0 + ((a1 - a0) * (k + 0.5)) / n;
    loop.push([t - (a1 - a0) / n * 0.33, -0.3, 0.035], [t + (a1 - a0) / n * 0.33, -0.3, 0.035]);
    loop.push([t + (a1 - a0) / n * 0.5, -0.5, 0.0]);
  }
  loop.push([a1, -0.62, 0.02]);
  bel.add(ringLathe(loop, { seg: 64, rel: true, crease: 50, maxStep: 0.6 }), M.rubber);

  /* ---------------------------------------------------------------- cable bundle */
  const cab = mk(root, 'cable-bundle', 'Cable Bundle', 'Power and signal harness leaving the ball\'s rear gland: copper, black, blue and gold conductors twist together into a braided sleeve that ends at the hub connector.', {
    explode: exl(-4.6, 0, 0, 'mid'), specs: { Material: 'Silver-plated copper, braided PET sleeve', Conductors: '6', Mass: '0.01 g' },
  });
  const cols = [M.black, M.copper, M.anodizedBlue, M.gold, M.black, M.copper];
  cols.forEach((m, i) => {
    const th0 = (i / cols.length) * Math.PI * 2;
    const pts = [];
    for (let k = 0; k <= 8; k++) {
      const u = k / 8, a = 1.72 + 0.92 * u, rad = 0.17 + 0.16 * Math.sin(u * Math.PI) * 0.6 + 0.08 * u, th = th0 + u * 1.6;
      pts.push(V3(-a, rad * Math.cos(th), rad * Math.sin(th)));
    }
    cab.add(sweep(pts, { radius: 0.085, radial: 8, caps: true }), m);
  });
  cab.add(tube(1.9, 2.3, 0.5, 0.3, { bevel: 0.05, seg: 36 }), M.rubber);
  cab.add(tube(2.3, 2.55, 0.56, 0.3, { bevel: 0.05, seg: 36 }), M.steel);
  void R; void hexNut; void THREE; void S;
}
