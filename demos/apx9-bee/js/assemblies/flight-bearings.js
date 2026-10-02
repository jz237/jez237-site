// Flight assembly: the bearing stack, spacer rings and retaining ring of one wing mount.
// Mount-local frame: x = s along the wing span axis (outboard +), y = lead, z = wing normal.
import { M, THREE, circlePts, S } from '../kit.js';
import { TAU, loopX, arcPts, ridgePts, plateX, mAt, ball, holeRing, exS } from './flight-util.js';

/**
 * Deep-groove ball bearing generator. Every bearing is symmetric about its mid plane sc; faces carry a counterbore that hosts
 * the (optional) shield. All numbers are millimetres in the mount frame.
 */
export const BRG = {
  b1: { sc: 0.03, hw: 0.25, rO: 1.95, rb: 0.58, Rp: 1.30, ballR: 0.19, n: 16, shield: [0.90, 1.60], ridges: 3, ihw: 0.29, ring: true },
  b2: { sc: -0.75, hw: 0.15, rO: 1.30, rb: 0.60, Rp: 0.93, ballR: 0.115, n: 12, shield: [0.70, 1.08], ridges: 2, ihw: 0.19, ring: false },
  b3: { sc: -1.135, hw: 0.115, rO: 1.00, rb: 0.58, Rp: 0.76, ballR: 0.085, n: 10, shield: null, ridges: 0, ihw: 0.15, ring: false },
};

const groove = (b) => {
  const rho = b.ballR * 1.07;
  const d = b.ballR * 0.70;
  const gw = Math.sqrt(rho * rho - d * d);
  return { rho, d, gw, th: Math.asin(gw / rho) };
};

/** Face of the outer race (outer rim -> bore) for one side; sg = +1 (outboard) or -1 (inboard). Returns [r, s, f] points. */
function outerFace(b, sg) {
  const { sc, hw, rO, Rp, shield, ridges } = b;
  const g = groove(b);
  const rBore = Rp + g.d;
  const sTop = sc + sg * hw;
  const out = [];
  if (shield) {
    const rc = shield[1];
    const base = sTop - sg * 0.045;
    const r0 = rO - 0.11;
    const pts = ridgePts(r0, rc + 0.06, base, sg * 0.045, ridges);
    out.push([rO, sTop, 0.04]);
    for (const p of pts) out.push(p);
    const floor = sTop - sg * 0.13;
    out.push([rc, base, 0.012], [rc, floor, 0.012], [rBore, floor, 0.012]);
  } else {
    out.push([rO, sTop, 0.035], [rBore + 0.1, sTop, 0.02], [rBore, sTop, 0.02]);
  }
  return out;
}

function outerRaceProfile(b) {
  const { sc, hw, rO, Rp } = b;
  const g = groove(b);
  const rBore = Rp + g.d;
  const sB = sc + hw;
  const up = outerFace(b, +1);
  const dn = outerFace(b, -1).reverse();
  const pts = [];
  // bottom (inboard) face from bore outward, then the outer cylinder, then the outboard face inward, then the raceway
  for (const p of dn) pts.push(p);
  if (b.ring) pts.push([rO, sB - 0.17, 0.012], [rO - 0.05, sB - 0.17, 0.01], [rO - 0.05, sB - 0.07, 0.01], [rO, sB - 0.07, 0.012]);
  for (const p of up) pts.push(p);
  pts.push([rBore, sc + g.gw, 0.01]);
  for (const p of arcPts(Rp, sc, g.rho, g.th, -g.th, 6)) pts.push([p[0], p[1], 0]);
  return pts;
}

function innerRaceProfile(b) {
  const { sc, ihw, rb, Rp, shield } = b;
  const g = groove(b);
  const rIo = Rp - g.d;
  const iA = sc - ihw, iB = sc + ihw;
  const pts = [];
  const hub = shield ? shield[0] : rIo - 0.12;
  const floorUp = sc + b.hw - 0.13, floorDn = sc - b.hw + 0.13;
  // bottom face: bore corner -> hub wall -> counterbore floor -> outer surface
  pts.push([rb, iA, 0.03]);
  if (shield) pts.push([hub, iA, 0.03], [hub, floorDn, 0.012], [rIo, floorDn, 0.012]);
  else pts.push([rIo + 0.0, iA, 0.03]);
  pts.push([rIo, sc - g.gw, 0.01]);
  for (const p of arcPts(Rp, sc, g.rho, Math.PI + g.th, Math.PI - g.th, 6)) pts.push([p[0], p[1], 0]);
  if (shield) pts.push([rIo, floorUp, 0.012], [hub, floorUp, 0.012], [hub, iB, 0.03]);
  else pts.push([rIo, iB, 0.03]);
  pts.push([rb, iB, 0.03]);
  return pts;
}

function shieldProfile(b, sg) {
  const [r0, r1] = b.shield;
  const sBase = b.sc + sg * (b.hw - 0.13);
  const t = 0.05;
  const dir = sg;
  const nR = b.ridges + 1;
  const pts = [];
  // underside (against the counterbore floors) then the dished, ridged face; ordered counter-clockwise for sg = +1
  const top = [];
  const N = nR * 4 + 1;
  for (let i = 0; i <= N; i++) {
    const u = i / N; // 0 at outer rim -> 1 at inner rim
    const r = r1 - (r1 - r0) * u;
    const dish = -0.022 * Math.sin(Math.PI * u);
    const rib = (i % 4 === 2) ? 0.028 : 0;
    top.push([r, sBase + dir * (t + dish + rib), i === 0 || i === N ? 0.008 : 0.01]);
  }
  pts.push([r0, sBase, 0.01], [r1, sBase, 0.01]);
  for (const p of top) pts.push(p);
  if (sg < 0) { pts.reverse(); }
  return pts;
}

function ballMatrices(b) {
  const out = [];
  for (let i = 0; i < b.n; i++) {
    const a = i / b.n * TAU + 0.2;
    out.push(mAt([b.sc, Math.cos(a) * b.Rp, Math.sin(a) * b.Rp], [0, 1, 0]));
  }
  return out;
}

function cageGeo(b) {
  const holes = holeRing(b.n, b.Rp, b.ballR * 0.5, 0.2, 12);
  const rIn = b.Rp - b.ballR * 0.76, rOut = b.Rp + b.ballR * 0.76;
  const g = plateX(circlePts(rOut, S(56, 24)), b.ballR * 0.34, { bevel: b.ballR * 0.08, bevelSegments: 1, steps: 2, holes: [...holes, circlePts(rIn, S(56, 24))] });
  g.translate(b.sc + b.ballR * 0.5, 0, 0);
  return g;
}

/**
 * Builds the bearing stack (container + three bearings with separate races, balls, cages, shields) and the C retaining ring.
 * Returns { stack } so the caller can attach other parts.
 */
export function buildBearings(mount) {
  const stack = mount.part('bearing-stack', {
    name: 'Root Bearing Stack',
    info: 'Three preloaded deep-groove bearings in a stepped stack carry the oscillating wing shaft and take the flapping thrust load.',
    specs: { Material: 'Chrome steel races, brass cages', Mass: '0.09 g', Function: 'Radial and axial shaft support' },
    explode: exS(-0.35, 'mid'),
  });

  const defs = [
    { key: 'b1', id: 'bearing-1', name: 'Main Root Bearing', ex: -0.9, info: 'Large outboard root bearing: chrome races with a ridged face, 16 hardened balls and a dished sealing shield.',
      o: 'chrome', i: 'chrome', bl: 'steel', cg: 'brass', sh: 'black' },
    { key: 'b2', id: 'bearing-2', name: 'Secondary Bearing', ex: -1.9, info: 'Mid-stack bearing that shares the radial load and keeps the shaft concentric with the servo gearbox.',
      o: 'steel', i: 'chrome', bl: 'steel', cg: 'brass', sh: 'black' },
    { key: 'b3', id: 'bearing-3', name: 'Preload Bearing', ex: -2.8, info: 'Small open bearing with a gold-anodised inner ring that sets the axial preload on the stack.',
      o: 'chrome', i: 'gold', bl: 'steel', cg: 'gunmetal', sh: null },
  ];

  const parts = {};
  for (const d of defs) {
    const b = BRG[d.key];
    const cont = stack.part(d.id, {
      name: d.name, info: d.info,
      specs: { Balls: `${b.n} x dia ${(b.ballR * 2).toFixed(2)} mm`, Outer: `dia ${(b.rO * 2).toFixed(1)} mm`, Bore: `dia ${(b.rb * 2).toFixed(2)} mm` },
      explode: exS(d.ex, 'mid'),
    });
    const outer = cont.part('outer-race', {
      name: `${d.name} Outer Race`, info: 'Hardened outer ring with a ground raceway groove; the outboard face carries a circlip groove and stiffening ridges.',
      explode: exS(0.0, 'fine'),
    });
    outer.add(loopX(outerRaceProfile(b), { segments: d.key === 'b1' ? 64 : d.key === 'b2' ? 56 : 48, steps: 1 }), M[d.o]);
    const inner = cont.part('inner-race', {
      name: `${d.name} Inner Race`, info: 'Inner ring pressed on the output shaft; its raceway groove guides the ball set and its hub stands proud of the outer ring.',
      explode: exS(-0.85, 'fine'),
    });
    inner.add(loopX(innerRaceProfile(b), { segments: d.key === 'b1' ? 56 : 48, steps: 1 }), M[d.i]);
    const balls = cont.part('balls', {
      name: `${d.name} Balls`, info: `Set of ${b.n} ground steel balls that roll between the two raceways.`,
      explode: exS(-0.42, 'fine'),
    });
    balls.addMany(ball(b.ballR, 14, 10), M[d.bl], ballMatrices(b));
    const cage = cont.part('cage', {
      name: `${d.name} Cage`, info: 'Pressed ring that spaces the balls evenly and stops them touching as the bearing oscillates.',
      explode: exS(0.45, 'fine'),
    });
    cage.add(cageGeo(b), M[d.cg]);
    parts[d.key] = { cont, outer, inner, balls, cage };
    if (b.shield) {
      const seal = cont.part('shield-out', {
        name: `${d.name} Shield`, info: 'Black pressed dust shield with concentric ribs; it snaps into the counterbore and keeps lubricant in.',
        explode: exS(d.key === 'b1' ? 1.05 : 0.8, 'fine'),
      });
      seal.add(loopX(shieldProfile(b, +1), { segments: d.key === 'b1' ? 56 : 48, steps: 1 }), M[d.sh]);
      parts[d.key].shield = seal;
      if (d.key === 'b1') {
        const seal2 = cont.part('shield-in', {
          name: `${d.name} Inner Shield`, info: 'Inboard dust shield of the main bearing, identical in section to the outer one but without the stiffening ribs.',
          explode: exS(-1.35, 'fine'),
        });
        seal2.add(loopX(shieldProfile(b, -1), { segments: 56, steps: 1 }), M[d.sh]);
      }
    }
  }
  return { stack, parts };
}

/** C-shaped retaining ring (circlip) with two lugs that sits in the groove of the main bearing's outer race. */
export function buildRetainingRing(mount) {
  const b = BRG.b1;
  const part = mount.part('retaining-ring', {
    name: 'Bearing Retaining Ring',
    info: 'Chrome C-shaped circlip with two lugs; it locks the main bearing into the thorax aperture sleeve.',
    specs: { Material: 'Spring steel, chrome plated', Mass: '0.01 g' },
    explode: exS(2.0, 'mid'),
  });
  const sB = b.sc + b.hw;
  const s0 = sB - 0.17, s1 = sB - 0.07;
  const prof = [[b.rO - 0.055, s0, 0.015], [b.rO + 0.085, s0, 0.02], [b.rO + 0.085, s1, 0.02], [b.rO - 0.055, s1, 0.015]];
  const phi = 250 * Math.PI / 180;
  const arc = loopX(prof, { segments: 48, phi0: 0.0, phi, steps: 2 });
  arc.rotateX(-phi / 2 + Math.PI * 1.5);
  part.add(arc, M.chrome);
  // lugs: two small plates at the arc ends with eye holes
  for (const sgn of [1, -1]) {
    const a = (Math.PI * 1.5) + sgn * phi / 2;
    const lug = plateX([[0, -0.09, 0.03], [0.2, -0.1, 0.05], [0.2, 0.1, 0.05], [0, 0.09, 0.03]], 0.1, { bevel: 0.025, bevelSegments: 1, steps: 2, holes: [circlePts(0.035, 10, 0.12, 0)], center: true });
    const m = new THREE.Matrix4().makeRotationX(a);
    m.multiply(new THREE.Matrix4().makeTranslation((s0 + s1) / 2, b.rO + 0.0, 0));
    part.add(lug, M.chrome, m);
  }
  return part;
}

/** Spacer sleeve (steel) and spacer ring (brass) that sit between the main and secondary bearings. */
export function buildSpacers(mount) {
  const cont = mount.part('spacer-rings', {
    name: 'Bearing Spacer Rings',
    info: 'Precision-ground sleeve and shim ring that hold the bearings at the exact spacing needed to preload the stack.',
    specs: { Material: 'Hardened steel and brass', Mass: '0.02 g' },
    explode: exS(-1.4, 'mid'),
  });
  const b1 = BRG.b1, b2 = BRG.b2;
  const a = cont.part('spacer-ring-a', {
    name: 'Spacer Sleeve', info: 'Hardened steel sleeve with a flange that spaces the inner races of the two largest bearings.',
    explode: exS(-0.55, 'fine'),
  });
  const sTop = b1.sc - b1.ihw, sBot = b2.sc + b2.ihw;
  a.add(loopX([[0.58, sBot, 0.02], [0.97, sBot, 0.02], [0.97, sTop - 0.07, 0.015], [1.08, sTop - 0.07, 0.02], [1.08, sTop, 0.02], [0.58, sTop, 0.02]], { segments: 48, steps: 1 }), M.steel);
  const bz = cont.part('spacer-ring-b', {
    name: 'Brass Shim Ring', info: 'Brass shim ring with a scalloped rim that spaces the outer races and takes up thermal growth in the stack.',
    explode: exS(0.2, 'fine'),
  });
  const o1 = b1.sc - b1.hw, o2 = b2.sc + b2.hw;
  const rimPts = [];
  const N = 16;
  for (let i = 0; i < N * 4; i++) {
    const t = i / (N * 4) * TAU;
    const k = 0.5 + 0.5 * Math.cos(t * N);
    const r = 1.5 - 0.07 * (1 - k);
    rimPts.push([Math.cos(t) * r, Math.sin(t) * r]);
  }
  const shim = plateX(rimPts, o1 - o2, { bevel: 0.03, bevelSegments: 1, steps: 2, holes: [circlePts(1.1, S(48, 24)), ...holeRing(8, 1.3, 0.07, 0.2, 10)] });
  shim.translate(o2, 0, 0);
  bz.add(shim, M.brass);
  return cont;
}

