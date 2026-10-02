import { M, child, rod, boltRing, bearing, axialPlate, harness, cyl, box, circlePts } from './finish-kit.js';
export function buildHeadFrame(ctx) {
  const p = ctx.bee.part('head-frame', {
    name: 'Head Sensor Chassis',
    group: 'chassis',
    info: 'Open titanium sensor cage with lightened bulkheads, optical saddles, antenna sockets and neural-card guide rails.',
    explode: ctx.ex([9.5, 0.2, 0], 'top'),
  });
  for (const [i, x] of [8.15, 10.15, 12.15].entries()) {
    const f = child(
      p,
      `bulkhead-${i + 1}`,
      `Head Bulkhead ${i + 1}`,
      'Machined annular support with a large cable bore, relieved radial webs and peripheral optical mounting bosses.',
      [i * 0.5, 0, 0],
    );
    bearing(f, [x, 0.15, 0], i === 1 ? 2.66 : 2.35, 1.6, [1, 0, 0], 0.24);
    boltRing(f, [x + 0.17, 0.15, 0], i === 1 ? 2.48 : 2.18, 10, [1, 0, 0], 0.075);
  }
  for (const s of [-1, 1]) {
    const name = s > 0 ? 'Right' : 'Left';
    const e = child(
      p,
      `optical-saddle-${s > 0 ? 'r' : 'l'}`,
      `${name} Optical Saddle`,
      'Triangulated optical mounting bridge aligning the compound-eye cartridge to the head cage.',
      [0, 0, s * 0.8],
    );
    for (const y of [-1.6, 1.85]) rod(e, [8.4, y, s * 1.4], [12, y, s * 1.4], 0.12, M.titanium);
    rod(e, [9, -1.6, s * 1.4], [11.7, 1.85, s * 1.4], 0.1, M.gunmetal);
    bearing(e, [10.9, 0.9, s * 2], 1.65, 1.32, [0, 0, s], 0.22);
    const a = child(
      p,
      `antenna-seat-${s > 0 ? 'r' : 'l'}`,
      `${name} Antenna Seat`,
      'Stepped sensor stalk socket with spring contacts and a locking flange.',
      [0.8, 0.3, s * 0.5],
    );
    bearing(a, [12.7, 1.5, s * 1], 0.43, 0.21, [1, 0.2, s * 0.2], 0.4);
    rod(a, [11.6, 0.4, s * 1.2], [12.7, 1.5, s * 1], 0.16, M.gunmetal);
    const h = child(
      p,
      `optic-cable-${s > 0 ? 'r' : 'l'}`,
      `${name} Optics Ribbon Bundle`,
      'Shielded optical data harness routed from the eye sensor bed to the neural processor.',
      [0, -0.5, s * 0.4],
    );
    for (let j = 0; j < 5; j++)
      harness(
        h,
        [
          [11, 0.7, s * 2],
          [10, 1.7, s * (1.5 + j * 0.1)],
          [8.4, 0.4, s * (0.65 + j * 0.13)],
        ],
        0.04,
        j % 2 ? M.copper : M.black,
      );
  }
  const guides = child(
    p,
    'card-guides',
    'Neural Card Guides',
    'Paired insulated rails securing the processor card against shock and vibration.',
    [0, 0.8, 0],
  );
  for (const s of [-1, 1]) guides.add(box(2.8, 0.28, 0.24, 0.04), M.black, [10, 0.5, s * 0.85]);
}
export function buildMandibles(ctx) {
  const p = ctx.bee.part('mandibles', {
    name: 'Mandibles and Sampling Probe',
    group: 'head-shell',
    info: 'Paired articulated grippers around a telescoping micro-probe, with geared pivots, hydraulic links and return springs.',
    explode: ctx.ex([9.5, -9.5, 0], 'top'),
  });
  for (const s of [-1, 1]) {
    const n = s > 0 ? 'Right' : 'Left';
    const hinge = child(
      p,
      `hinge-${s > 0 ? 'r' : 'l'}`,
      `${n} Mandible Hinge`,
      'Sealed rotary hinge with a machined retaining ring and radially arranged fasteners.',
      [0.4, -0.5, s * 0.8],
    );
    bearing(hinge, [12.05, -2.1, s * 0.85], 0.49, 0.23, [0, 0, s], 0.43);
    boltRing(hinge, [12.05, -2.1, s * 1.1], 0.38, 8, [0, 0, s], 0.055);
    const jaw = child(
      p,
      `jaw-${s > 0 ? 'r' : 'l'}`,
      `${n} Articulated Mandible`,
      'Tapered carbon-and-steel gripper with a serrated inner edge and a replaceable gold-plated contact tip.',
      [0.4, -1, s * 1.25],
    );
    const pts = [
      [11.9, -2.1],
      [12.5, -2.05],
      [13.2, -3.3],
      [13.15, -4.4],
      [12.8, -4.65],
      [12.85, -3.5],
      [12.3, -3.0],
    ];
    const g = ctx.plate(pts, 0.33, { bevel: 0.07 });
    g.translate(0, 0, s * 0.62 - 0.16);
    jaw.add(g, M.gunmetalDark);
    rod(jaw, [12.25, -2.3, s * 0.85], [12.95, -3.45, s * 0.74], 0.09, M.chrome);
    for (let i = 0; i < 5; i++) jaw.add(box(0.17, 0.12, 0.36, 0.025), M.steel, [12.82, -3.4 - i * 0.19, s * 0.62]);
    jaw.add(cyl(0.13, 0.3, { segments: 12 }), M.gold, [12.87, -4.45, s * 0.62]);
    const piston = child(
      p,
      `actuator-${s > 0 ? 'r' : 'l'}`,
      `${n} Mandible Actuator`,
      'Miniature hydraulic cylinder and chrome piston rod operating the gripper linkage.',
      [0, -0.6, s * 1.5],
    );
    rod(piston, [11.25, -1.8, s * 0.9], [12.1, -3.2, s * 0.9], 0.16, M.black);
    rod(piston, [12.1, -3.2, s * 0.9], [12.8, -3.6, s * 0.74], 0.075, M.chrome);
  }
  const probe = child(
    p,
    'probe',
    'Telescoping Nectar Probe',
    'Concentric stainless sampling tubes ending in a micro-capillary intake, supported by a ribbed protective sleeve.',
    [1.1, -1.8, 0],
    'mid',
  );
  rod(probe, [12.25, -2.45, 0], [13.5, -5.05, 0], 0.16, M.gunmetal);
  rod(probe, [13.5, -5.05, 0], [13.72, -5.6, 0], 0.065, M.chrome);
  for (let j = 0; j < 9; j++)
    bearing(probe, [12.35 + j * 0.11, -2.66 - j * 0.23, 0], 0.2, 0.16, [0.44, -0.9, 0], 0.055);
}
