// APX-9 head: neck joint. Everything is coaxial with the neck axis (y = 0.2, z = 0) and stays inside r = 2.0 over x 6.6..8.4.
// Back to front: ring servo (x 6.64..7.12), ball bearing (7.16..7.56), gunmetal ring with flange and spigot (7.62..8.44) and a
// hose bundle (x 6.45..8.85) that threads the whole stack together with the flat ribbon of the neural processor.
import * as THREE from 'three';
import { box, revolve, torus, sphere, cyl, shape, circlePts } from '../geo.js';
import { Bag, T, tubeCyl, boltCircle, boltsAt, tube, extrudeX } from './head-mech.js';

const NY = 0.2;
/** place a geometry whose local +Y is radial at angle `a` (about the x axis, 0 = up) and radius r */
const radial = (g, x, r, a, extra = {}) => T(g, { p: [x, NY + r * Math.cos(a), r * Math.sin(a)], e: [a, 0, 0], ...extra });
const along = (g, x) => T(g, { p: [x, NY, 0] });

/* ------------------------------------------------------------------------------------------------ servo */
function buildServo(M, part) {
  const bag = new Bag();
  const X0 = 6.64;
  const N = 12;
  // laminated stator yoke, rear cap, front plate
  bag.add('steel', along(tubeCyl(1.9, 1.62, 0.34, { axis: 'x', bevel: 0.03, bevelIn: 0.02, segments: 64, steps: 1 }), X0 + 0.24));
  for (let i = 0; i < 3; i++) bag.add('gunmetalDark', along(tubeCyl(1.905, 1.89, 0.014, { axis: 'x', bevel: 0.004, bevelIn: 0.004, segments: 48, steps: 1 }), X0 + 0.14 + i * 0.1));
  bag.add('gunmetalDark', along(tubeCyl(1.96, 1.28, 0.08, { axis: 'x', bevel: 0.03, bevelIn: 0.02, segments: 64, steps: 1 }), X0 + 0.04));
  bag.add('gunmetalDark', along(tubeCyl(1.96, 1.45, 0.08, { axis: 'x', bevel: 0.03, bevelIn: 0.02, segments: 64, steps: 1 }), X0 + 0.44));
  // 12 teeth, each wrapped by a copper coil, 3 coil leads on the rear face
  const tooth = new THREE.BoxGeometry(0.34, 0.34, 0.15).toNonIndexed(), shoe = new THREE.BoxGeometry(0.34, 0.06, 0.34).toNonIndexed(), coil = box(0.42, 0.22, 0.4, 0.04);
  for (let i = 0; i < N; i++) {
    const a = (i + 0.5) / N * Math.PI * 2;
    bag.add('steel', radial(tooth, X0 + 0.24, 1.5, a));
    bag.add('steel', radial(shoe, X0 + 0.24, 1.33, a));
    bag.add('copper', radial(coil, X0 + 0.24, 1.52, a));
  }
  // front plate screws and rear-cap ears
  bag.add('steel', boltCircle({ c: [X0 + 0.48, NY, 0], axis: [1, 0, 0], r: 1.74, n: 8, kind: 'pan', br: 0.075 }));
  bag.add('steel', boltCircle({ c: [X0 + 0.0, NY, 0], axis: [-1, 0, 0], r: 1.58, n: 4, kind: 'pan', br: 0.06, phase: 0.2 }));
  // three motor leads leaving the rear cap in a loop, brass lugs on the coil ends
  const leadPath = (a0) => {
    const pts = [];
    for (let k = 0; k <= 5; k++) {
      const t = k / 5, a = a0 + t * 0.55, r = 1.62 + 0.12 * Math.sin(t * Math.PI);
      pts.push([X0 - 0.02 - 0.34 * Math.sin(t * Math.PI), NY + r * Math.cos(a), r * Math.sin(a)]);
    }
    return pts;
  };
  for (let j = 0; j < 3; j++) bag.add('copper', tube(leadPath(1.0 + j * 0.12), 0.035, { radial: 6, n: 10 }));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ bearing */
function buildBearing(M, part) {
  const bag = new Bag();
  const X0 = 7.21, L = 0.38, xc = X0 + L / 2;
  bag.add('chrome', along(revolve([[1.71, xc], [1.76, xc - 0.07], [1.76, X0, 0.025], [1.95, X0, 0.04], [1.95, X0 + L, 0.04], [1.76, X0 + L, 0.025], [1.76, xc + 0.07], [1.71, xc]],
    { axis: 'x', segments: 64, steps: 1 }), 0));
  bag.add('chrome', along(revolve([[1.26, xc], [1.26, X0, 0.025], [1.5, X0, 0.03], [1.5, xc - 0.07], [1.455, xc], [1.5, xc + 0.07], [1.5, X0 + L, 0.03], [1.26, X0 + L, 0.025], [1.26, xc]],
    { axis: 'x', segments: 64, steps: 1 }), 0));
  const NB = 14, RP = 1.59;
  const ball = sphere(0.12, { segments: 10, rings: 7 });
  for (let i = 0; i < NB; i++) {
    const a = i / NB * Math.PI * 2;
    bag.add('steel', T(ball, { p: [xc, NY + RP * Math.cos(a), RP * Math.sin(a)] }));
    // cage pillar between neighbouring balls
    const b = (i + 0.5) / NB * Math.PI * 2;
    bag.add('brass', T(cyl(0.032, 0.34, { bevel: 0.008, segments: 6, axis: 'x', steps: 1 }), { p: [xc, NY + RP * Math.cos(b), RP * Math.sin(b)] }));
  }
  for (const s of [-1, 1]) bag.add('brass', along(tubeCyl(1.73, 1.51, 0.04, { axis: 'x', bevel: 0.012, bevelIn: 0.01, segments: 56, steps: 1 }), xc + s * 0.16));
  // dust seal lips
  bag.add('steel', along(tubeCyl(1.74, 1.7, 0.012, { axis: 'x', bevel: 0.003, bevelIn: 0.003, segments: 56, steps: 1 }), X0 + L - 0.004));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ ring */
function buildRing(M, part) {
  const bag = new Bag();
  const XF0 = 7.62, XF1 = 7.92, XT = 8.44;
  // spigot: turned barrel with an O-ring seat and a shoulder that butts against the flange
  bag.add('gunmetal', along(revolve([[1.12, XF0], [1.42, XF0, 0.02], [1.42, 8.15], [1.35, 8.15], [1.35, 8.27], [1.42, 8.27], [1.42, XT, 0.04], [1.12, XT, 0.03], [1.12, XF0]],
    { axis: 'x', segments: 64, steps: 1 }), 0));
  // double-D flange: full radius above and below, wrench flats at |z| = FLAT so it clears the orbital rims of the eyes
  const FLAT = 1.6, RF = 2.0;
  const out = [];
  for (let i = 0; i < 96; i++) {
    const a = i / 96 * Math.PI * 2, zz = RF * Math.sin(a), yy = NY + RF * Math.cos(a);
    out.push([Math.max(-FLAT, Math.min(FLAT, zz)), yy]);
  }
  const clean = out.filter((q, i) => { const a = out[(i + out.length - 1) % out.length], b = out[(i + 1) % out.length]; return !(Math.abs(q[0]) === FLAT && Math.abs(a[0]) === FLAT && Math.abs(b[0]) === FLAT); });
  bag.add('gunmetal', extrudeX(shape(clean, [circlePts(1.42, 56, 0, NY)], { steps: 1 }), XF0, XF1 - XF0, { bevel: 0.05, bevelSegments: 2, steps: 1 }));
  // front-face step ring and a polished land on the flange
  bag.add('gunmetal', along(tubeCyl(1.58, 1.42, 0.035, { axis: 'x', bevel: 0.012, bevelIn: 0.01, segments: 64, steps: 1 }), XF1 + 0.015));
  // O-ring on the spigot
  bag.add('rubber', T(torus(1.385, 0.05, { radial: 8, tubular: 56 }), { p: [8.21, NY, 0], e: [0, Math.PI / 2, 0] }));
  // flange bolts: two per lobe on the front face (hex) and one dowel per lobe
  const lobe = (r, t) => [XF1, NY + r * Math.cos(t), r * Math.sin(t)];
  const front = [], dowel = [];
  for (const base of [0, Math.PI]) {
    for (const d of [-0.5, 0.5]) front.push(lobe(1.8, base + d));
    dowel.push(lobe(1.8, base));
  }
  bag.add('steel', boltsAt(front, [1, 0, 0], { kind: 'hex', br: 0.1 }));
  bag.add('steel', boltsAt(dowel, [1, 0, 0], { kind: 'dome', br: 0.06 }));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ cable bundle */
const HOSES = [
  { dy: 0.5, dz: 0.55, r: 0.17, key: 'red' },
  { dy: -0.25, dz: 0.75, r: 0.17, key: 'blue' },
  { dy: -0.7, dz: 0.25, r: 0.15, key: 'red' },
  { dy: 0.0, dz: 0.22, r: 0.15, key: 'blue' },
];
function buildCables(M, part) {
  const bag = new Bag();
  for (const h of HOSES) {
    const path = [];
    const xs = [6.42, 6.8, 7.3, 7.8, 8.3, 8.62, 8.86];
    xs.forEach((x, k) => {
      const f = Math.max(0, (x - 8.3) / 0.56);          // fan out inside the skull
      const sw = 0.05 * Math.sin(k * 1.7 + h.dy * 5);
      path.push([x, NY + h.dy * (1 + 0.5 * f) + sw, h.dz * (1 + 0.25 * f) + sw * 0.6]);
    });
    bag.add(h.key, tube(path, h.r, { radial: 10, n: 22 }));
    // brass ferrules at both ends and a ribbed strain-relief
    for (const [x, k] of [[6.5, 0], [8.8, 6]]) {
      const p = path[k];
      bag.add('brass', T(tubeCyl(h.r + 0.05, h.r - 0.01, 0.2, { axis: 'x', bevel: 0.02, bevelIn: 0.01, segments: 14, steps: 1 }), { p: [x, p[1], p[2]] }));
      bag.add('brass', T(cyl(h.r + 0.07, 0.04, { bevel: 0.01, segments: 14, axis: 'x', steps: 1 }), { p: [x - (k ? 0.1 : -0.1), p[1], p[2]] }));
    }
  }
  // bundle clamp: brass band with a screw lug, around the hoses and the ribbon cable
  bag.add('brass', along(tubeCyl(1.07, 0.97, 0.16, { axis: 'x', bevel: 0.03, bevelIn: 0.02, segments: 40, steps: 1 }), 6.98));
  bag.add('brass', T(box(0.16, 0.2, 0.24, 0.03), { p: [6.98, NY + 1.12, 0] }));
  bag.add('brass', T(cyl(0.05, 0.1, { bevel: 0.015, segments: 10, axis: 'z' }), { p: [6.98, NY + 1.14, 0.14] }));
  return bag.flush(part, M);
}

/* ------------------------------------------------------------------------------------------------ assembly */
export function buildNeck(ctx, neck) {
  const { M, ex } = ctx;
  const mats = { ...M, red: ctx.paint('#c42a1c', { rough: 0.32, coat: 0.9 }), blue: ctx.paint('#1d58c8', { rough: 0.32, coat: 0.9 }) };

  const servo = neck.part('servo', {
    name: 'Neck Servo', explode: ex([-3, 0, 0], 'mid'),
    info: 'Low-profile ring servo that nods the head: a laminated stator with twelve copper-wound teeth in a gunmetal can, with its motor leads looped out the back.',
    specs: { Windings: '12 coils, 3-phase', Torque: '0.8 mN-m' },
  });
  buildServo(mats, servo);

  const bearing = neck.part('bearing', {
    name: 'Neck Bearing', explode: ex([-1.5, 0, 0], 'mid'),
    info: 'Chrome deep-groove ball bearing with fourteen steel balls held by a brass cage; it carries the head load while the hose bundle passes through its bore.',
    specs: { Balls: '14 x 0.24 mm', Bore: '2.5 mm' },
  });
  buildBearing(mats, bearing);

  const ring = neck.part('ring', {
    name: 'Neck Ring',
    info: 'Turned gunmetal double-D flange with a spigot that seats in the rear ring of the head frame; hex bolts, dowels and an O-ring seal the joint.',
    specs: { Material: 'Gunmetal, steel fasteners', Fasteners: '4 hex + 2 dowel' },
  });
  buildRing(mats, ring);

  const cables = neck.part('cable-bundle', {
    name: 'Cable Bundle', explode: ex([-5.4, 0, 0], 'mid'),
    info: 'Four colour-coded hoses that run from the thorax through the neck into the skull, with brass ferrules and a clamp that also holds the ribbon cable.',
    specs: { Hoses: '4 x 0.3 mm', Fittings: 'Brass ferrules' },
  });
  buildCables(mats, cables);
}
