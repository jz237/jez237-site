// APX-9 legs: knee. knee-servo (chrome disc on the knee axis), knee-bracket (vented brushed clamp on the tibia flank),
// hydraulic-joint (ribbed micro-cylinder across the knee on the free flank), shock-absorber (coil-over damper over the
// convex corner), hoses (copper + rubber lines from the ram ports to a gold manifold), joint-covers (yellow knee guard
// on the convex corner + chrome hinge-pin cap on the free flank).
import { M, ex, revolve, cyl, box, plate, rectPts, spring, sweep, slotHoles } from '../kit.js';
import { THREE, V3, PI, hingeFrm, yzFrm, mapSurf, bandPoly, grooves, slit, taperOutline, flankFrame, screwOn, alongN, once, lerp, clamp } from './legs-core.js';
import { servoStack } from './legs-hip.js';
import { panel } from './legs-panels.js';

/** Point on a segment at local height y, lateral offset x (along the hinge axis), shifted dz along the outer axis from the pod centre line. */
const fpt = (seg, pod, y, x, dz = 0) => seg.pt(x, y, pod.at(y).cz + dz);

function kneeServo(ctx, L, top) {
  const side = L.kneeSide, R = 0.86 * (L.p.servoR ?? 1);
  const part = top.part('knee-servo', {
    name: `${L.p.title} Knee Rotary Servo`,
    info: 'Knee actuator on the hinge axis: knurled chrome ring with a five-bolt circle, stepped disc, gold ring and hub, cable gland facing the hip.',
    specs: { Material: 'Chrome-plated steel, gold anodised hub', Function: 'Tibia pitch drive' },
    explode: ex(L.kAxis.clone().multiplyScalar(side * 3.0), 'mid'),
  });
  const F = hingeFrm(L.Kn.clone().addScaledVector(L.kAxis, side * L.kPlane), L.kAxis, L.knee.o, side);
  L.kneeF = F;
  L.kneeGland = servoStack(part, F, { R, side, teeth: 36, bolts: 5 });
  return part;
}

function kneeBracket(ctx, L, top) {
  const pod = L.podT, T = L.tibia, side = L.kneeSide;
  const part = top.part('knee-bracket', {
    name: `${L.p.title} Knee Clamp Bracket`,
    info: 'Brushed-aluminium clamp bracket on the tibia flank below the knee servo: vented, bolted at the corners over a black backing plate, closed by a gold collar band.',
    specs: { Material: 'Brushed aluminium, black backing, gold anodised collar' },
    explode: ex(L.kAxis.clone().multiplyScalar(side * 1.6), 'fine'),
  });
  const sfn = pod.surface(side > 0 ? 0 : PI);
  const v0 = 1.05, v1 = Math.min(2.4, T.len - 1.2), k = 0.64;
  const outline = taperOutline(pod, v0, v1, k, { dim: 'rz', rb: 0.12, rt: 0.12, n: 2 });
  const holes = slotHoles(3, 0.09, (v1 - v0) * 0.55, 0.14, 0, (v0 + v1) / 2, true, 0.04);
  part.add(panel({ shape: outline, holes, surface: sfn, thickness: 0.15, bevel: 0.045, bevelSegments: 1, lift: 0.05, maxEdge: 0.5, steps: 3, uvScale: 0.5 }), M.brushed, T.m);
  part.add(panel({ shape: taperOutline(pod, v0 - 0.05, v1 + 0.05, k, { dim: 'rz', margin: 0.05, rb: 0.15, rt: 0.15, n: 2 }), surface: sfn, thickness: 0.05, bevel: 0.02, bevelSegments: 1, lift: 0.0, maxEdge: 0.9, steps: 3 }), M.black, T.m);
  // corner screws
  for (const v of [v0 + 0.17, v1 - 0.17]) {
    const hw = pod.at(v).rz * k - 0.15;
    for (const x of [-hw, hw]) {
      const s = sfn(x, v);
      screwOn(part, M.brushed, T, s.p.clone().addScaledVector(s.n, 0.2), s.n, 0.07, x * 7 + v);
    }
  }
  // gold collar band closing the bracket, one on the tibia body
  const c0 = v1 + 0.1;
  part.add(pod.wrap(bandPoly(c0, c0 + 0.2, -0.02, 0.07, 0.04, 2), { radial: 28 }), M.gold, T.m);
  return part;
}

/** Hydraulic micro-cylinder across the knee on the free (non-disc) flank. */
function hydraulic(ctx, L, top) {
  const fem = L.femur, tib = L.tibia, nd = -L.kneeSide, p = L.p;
  const yA = fem.len - 2.5, yB = 1.7;
  const A = fpt(fem, L.podF, yA, nd * (L.podF.at(yA).rx + 0.30));
  const B = fpt(tib, L.podT, yB, nd * (L.podT.at(yB).rx + 0.28));
  const dir = B.clone().sub(A), D = dir.length();
  const Fh = yzFrm(A, dir, L.kAxis.clone().multiplyScalar(nd));
  L.ram = { F: Fh, D, A, B, yA, yB };
  const part = top.part('hydraulic-joint', {
    name: `${p.title} Hydraulic Joint`,
    info: 'Micro-hydraulic cylinder spanning the knee on the free flank: ribbed black barrel, gold end collars and ports, chrome piston rod, pinned clevis eyes on pedestals.',
    specs: { Material: 'Black anodised barrel, chrome rod, gold fittings', Function: 'Knee damping' },
    explode: ex(L.kAxis.clone().multiplyScalar(nd * 3.2), 'mid'),
  });
  const y0b = 0.36, Lb = D * 0.5, y1b = y0b + Lb;
  const key = `${p.key}|${D.toFixed(2)}`;
  part.add(once(`hy-barrel|${key}`, () => revolve([[0, y0b], [0.2, y0b, 0.03], ...grooves(0.2, y0b + 0.16, y1b - 0.16, 5, 0.07, 0.035, 0.02), [0.2, y1b, 0.03], [0, y1b]], { segments: 20, steps: 1 })), M.black, Fh.m);
  part.add(once('hy-collar', () => cyl(0.235, 0.12, { y0: 0, bevel: 0.03, segments: 20, steps: 1 })), M.gold, Fh.at(0, y0b - 0.06, 0));
  part.add(once('hy-collar', () => cyl(0.235, 0.12, { y0: 0, bevel: 0.03, segments: 20, steps: 1 })), M.gold, Fh.at(0, y1b - 0.06, 0));
  // chrome: rod, necks, clevis eyes, pins and pedestals
  part.add(once(`hy-rod|${key}`, () => cyl(0.075, D - 0.24 - y1b, { y0: 0, bevel: 0.01, segments: 14, steps: 1 })), M.chrome, Fh.at(0, y1b, 0));
  part.add(once('hy-neckB', () => cyl(0.105, 0.22, { y0: 0, bevel: 0.02, segments: 14, steps: 1 })), M.chrome, Fh.at(0, D - 0.3, 0));
  part.add(once('hy-neckA', () => cyl(0.105, 0.26, { y0: 0, bevel: 0.02, segments: 14, steps: 1 })), M.chrome, Fh.at(0, 0.12, 0));
  const eye = once('hy-eye', () => cyl(0.17, 0.16, { rIn: 0.065, axis: 'z', bevel: 0.025, bevelIn: 0.01, segments: 20, steps: 1 }));
  const post = once('hy-post', () => cyl(0.1, 0.3, { axis: 'z', bevel: 0.02, segments: 12, steps: 1 }));
  const head = once('hy-pinhead', () => cyl(0.085, 0.045, { axis: 'z', bevel: 0.015, segments: 12, steps: 1 }));
  for (const y of [0, D]) {
    part.add(eye, M.chrome, Fh.at(0, y, 0));
    part.add(post, M.chrome, Fh.at(0, y, -0.2));
    part.add(head, M.chrome, Fh.at(0, y, 0.115));
  }
  // gold hose ports on the barrel (both toward the femur side)
  const port = once('hy-port', () => cyl(0.045, 0.2, { axis: 'x', bevel: 0.012, segments: 10, steps: 1 }));
  for (const sx of [1, -1]) part.add(port, M.gold, Fh.at(sx * 0.3, y0b + 0.24, 0));
  return part;
}

/** Coil-over shock absorber over the convex corner of the knee. */
function shock(ctx, L, top) {
  const fem = L.femur, tib = L.tibia, nd = -L.kneeSide, p = L.p;
  const yA = fem.len - 2.1, yB = 1.3, x = nd * 0.16, up = p.shockUp ?? 0;
  const S1 = fpt(fem, L.podF, yA, x, L.podF.at(yA).rz + 0.625 + up);
  const S2 = fpt(tib, L.podT, yB, x, L.podT.at(yB).rz + 0.625 + up);
  const dir = S2.clone().sub(S1), D = dir.length();
  const Fs = yzFrm(S1, dir, L.knee.o);
  L.shock = { F: Fs, D, S1, S2 };
  const part = top.part('shock-absorber', {
    name: `${p.title} Shock Absorber`,
    info: 'Coil-over damper bridging the outer corner of the knee: black damper body, polished rod, steel spring between gold seats and pinned eyelets on bolted feet.',
    specs: { Material: 'Black anodised damper, spring steel coil, gold seats', Function: 'Landing shock damping' },
    explode: ex(L.knee.o.clone().multiplyScalar(5.6), 'mid'),
  });
  const key = `${p.key}|${D.toFixed(2)}`;
  const y0 = 0.2, y1 = 0.2 + D * 0.42;
  part.add(once(`sk-body|${key}`, () => revolve([[0, y0], [0.15, y0, 0.03], ...grooves(0.15, y0 + 0.2, y1 - 0.1, 3, 0.05, 0.02, 0.012), [0.15, y1, 0.03], [0, y1]], { segments: 18, steps: 1 })), M.black, Fs.m);
  const ys0 = 0.5, ys1 = D - 0.5;
  part.add(once(`sk-spring|${key}`, () => spring({ radius: 0.23, wire: 0.034, turns: Math.round((ys1 - ys0) / 0.17), length: ys1 - ys0, perTurn: 10, radial: 5 }).translate(0, (ys0 + ys1) / 2, 0)), M.steel, Fs.m);
  part.add(once('sk-seat', () => cyl(0.27, 0.07, { bevel: 0.02, segments: 18, steps: 1 })), M.gold, Fs.at(0, ys0, 0));
  part.add(once('sk-seat', () => cyl(0.27, 0.07, { bevel: 0.02, segments: 18, steps: 1 })), M.gold, Fs.at(0, ys1, 0));
  // polished rod, dust cap, eyes, feet
  part.add(once(`sk-rod|${key}`, () => cyl(0.055, D - 0.2 - y1, { y0: 0, bevel: 0.01, segments: 12, steps: 1 })), M.steel, Fs.at(0, y1, 0));
  part.add(once('sk-cap', () => cyl(0.18, 0.1, { y0: 0, bevel: 0.03, segments: 16, steps: 1 })), M.steel, Fs.at(0, y1 - 0.02, 0));
  const eye = once('sk-eye', () => cyl(0.13, 0.15, { rIn: 0.05, axis: 'x', bevel: 0.02, bevelIn: 0.008, segments: 16, steps: 1 }));
  const dz = 0.475 + up;
  const post = once(`sk-post|${dz.toFixed(2)}`, () => cyl(0.065, dz - 0.015, { axis: 'z', bevel: 0.015, segments: 10, steps: 1 }));
  const foot = once('sk-foot', () => plate(rectPts(0.3, 0.3, 0.06), 0.05, { bevel: 0.015, center: true, bevelSegments: 1 }));
  const bolt = once('sk-bolthead', () => cyl(0.05, 0.04, { axis: 'x', bevel: 0.01, segments: 8, steps: 1 }));
  for (const y of [0, D]) {
    part.add(eye, M.steel, Fs.at(0, y, 0));
    part.add(post, M.steel, Fs.at(0, y, -dz / 2 - 0.02));
    part.add(foot, M.steel, Fs.at(0, y, -dz + 0.02));
    part.add(bolt, M.gold, Fs.at(0.1, y, 0));
  }
  return part;
}

/** Smooth hose run: cubic Bezier leaving P along d0 and arriving at Q against d1, resampled evenly (tangent-continuous fittings, no kinks). */
const hoseRun = (P, d0, Q, d1, k0, k1, n) =>
  new THREE.CubicBezierCurve3(P.clone(), P.clone().addScaledVector(d0, k0), Q.clone().addScaledVector(d1, k1), Q.clone()).getSpacedPoints(n);

/** Copper lines from the ram ports to a gold manifold on the femur flank, and a ribbed rubber supply hose clipped along the femur. */
function hoses(ctx, L, top) {
  const fem = L.femur, pod = L.podF, nd = -L.kneeSide, p = L.p, R = L.ram;
  const part = top.part('hoses', {
    name: `${p.title} Hydraulic Hoses`,
    info: 'Two copper pressure lines with gold crimp ferrules run from the ram ports to a gold manifold block on the femur flank, fed by a ribbed black rubber supply hose that dives into a grommet near the hip.',
    specs: { Material: 'Copper line, rubber hose, gold fittings' },
    explode: ex(L.kAxis.clone().multiplyScalar(nd * 2.0), 'fine'),
  });
  const Fh = R.F;
  const yM = R.yA - 1.15;
  const Fm = flankFrame(fem, pod, yM, nd, 0);                     // local Y = off the flank, X = along the limb, Z = outer side
  const up = Fm.dir(0, 1, 0).normalize();
  part.add(once('hs-block', () => box(0.46, 0.2, 0.34, 0.035)), M.gold, Fm.at(0, 0.09, 0));
  for (const z of [-0.12, 0.12]) screwOn(part, M.gold, Fm, V3(0, 0.19, z), V3(0, 1, 0), 0.045, z * 9);
  const nip = once('hs-nip', () => cyl(0.05, 0.16, { bevel: 0.012, segments: 10, steps: 1 }));
  const crimp = once('hs-crimp', () => cyl(0.088, 0.15, { bevel: 0.024, segments: 10, steps: 1 }));
  const Q = [];
  for (const sx of [1, -1]) {
    part.add(nip, M.gold, Fm.at(sx * 0.15, 0.24, 0.0));
    Q.push(Fm.pt(sx * 0.15, 0.3, 0));
  }
  // copper lines: manifold nipple -> ram port, each a smooth tangent-continuous run with a crimp ferrule at both ends
  [1, -1].forEach((sx, i) => {
    const out = Fh.dir(sx, 0, 0).normalize();
    const P = Fh.pt(sx * 0.4, 0.6, 0), q = Q[1 - i], c = P.distanceTo(q);
    part.add(sweep(hoseRun(q, up, P, out, c * 0.4, c * 0.4, 24), { radius: 0.055, radial: 8, segments: 24, caps: false }), M.copper);
    part.add(crimp, M.gold, alongN(q.clone().addScaledVector(up, -0.03), up));
    part.add(crimp, M.gold, alongN(P.clone().addScaledVector(out, -0.04), out));
  });
  // ribbed rubber supply hose along the lower (inner) edge of the flank to a grommet near the hip
  const yE = 0.95, zE = -0.5;
  const Fe = flankFrame(fem, pod, yE, nd, 0);
  const E = Fe.pt(0, 0.1, zE * pod.at(yE).rz);
  const S0 = Fm.pt(0, 0.3, 0);
  const wp = [S0, Fm.pt(0, 0.45, 0.1)];
  for (const f of [0.35, 0.7]) {
    const y = lerp(yM, yE, f);
    const Fy = flankFrame(fem, pod, y, nd, 0);
    wp.push(Fy.pt(0, 0.12 + 0.1 * Math.sin(f * 3.1), lerp(0, zE * pod.at(y).rz, Math.min(1, f * 1.6))));
  }
  wp.push(E);
  const curve = new THREE.CatmullRomCurve3(wp, false, 'centripetal');
  const len = curve.getLength(), nS = Math.max(16, Math.round(len / 0.055));
  part.add(sweep(curve.getSpacedPoints(nS), { radius: (u) => 0.068 * (1 + 0.14 * Math.cos((u * len / 0.19) * 2 * PI)), radial: 8, segments: nS, caps: false }), M.rubber);
  part.add(once('hs-ferrule', () => cyl(0.1, 0.12, { bevel: 0.02, segments: 12, steps: 1 })), M.gold, alongN(S0.clone().addScaledVector(up, 0.02), up));
  part.add(once('hs-grommet', () => cyl(0.14, 0.07, { rIn: 0.065, bevel: 0.015, segments: 14, steps: 1 })), M.gold, Fe.at(0, 0.01, zE * pod.at(yE).rz));
  // hose clamp band at mid length
  part.add(once('hs-clamp', () => cyl(0.1, 0.07, { rIn: 0.062, bevel: 0.012, segments: 10, steps: 1 })), M.gold, alongN(curve.getPointAt(0.55), curve.getTangentAt(0.55)));
  return part;
}

/** Yellow knee guard over the convex corner of the joint + chrome hinge-pin cap on the free flank. */
function jointCovers(ctx, L, top) {
  const nd = -L.kneeSide, p = L.p, fem = L.femur, tib = L.tibia;
  const part = top.part('joint-covers', {
    name: `${p.title} Knee Joint Covers`, tag: 'shell',
    info: 'Yellow clear-coat knee guard curving over the outer corner of the joint with inlay slits and chrome bolts, plus a chrome hinge-pin cap with a black gasket on the free flank.',
    specs: { Material: 'Clear-coat yellow composite, chrome pin cap, black gasket' },
    explode: ex(L.knee.o.clone().multiplyScalar(3.6), 'mid'),
  });
  // knee guard on a cylinder about the hinge axis
  const X = L.kAxis.clone();
  const O = fem.a.clone().sub(tib.a).normalize();
  O.addScaledVector(X, -O.dot(X)).normalize();
  const Y = new THREE.Vector3().crossVectors(O, X).normalize();
  const Rg = L.guardR = 0.95;
  const sfn = mapSurf((u, v) => {
    const a = v / Rg;
    return L.Kn.clone().addScaledVector(X, u).addScaledVector(O, Rg * Math.cos(a)).addScaledVector(Y, Rg * Math.sin(a));
  });
  const outline = [[-0.38, -1.05, 0.16], [0.38, -1.05, 0.16], [0.56, -0.5, 0.1], [0.56, 0.5, 0.1], [0.38, 1.05, 0.16], [-0.38, 1.05, 0.16], [-0.56, 0.5, 0.1], [-0.56, -0.5, 0.1]];
  const holes = [slit(0, 0.62, 0.34, 0.1), slit(0, -0.62, 0.34, 0.1), slit(0.3, 0, 0.1, 0.62), slit(-0.3, 0, 0.1, 0.62)];
  part.add(panel({ shape: outline, holes, surface: sfn, thickness: 0.1, bevel: 0.035, bevelSegments: 1, lift: 0.03, maxEdge: 0.45, steps: 3, uvScale: 0.2 }), M.yellow);
  part.add(panel({ shape: outline.map(([x, y, r]) => [x * 1.07, y * 1.04, r]), surface: sfn, thickness: 0.05, bevel: 0.02, bevelSegments: 1, lift: 0.0, maxEdge: 0.9, steps: 3 }), M.black);
  const sc = sfn(0, 0);
  screwOn(part, M.chrome, { m: new THREE.Matrix4() }, sc.p.clone().addScaledVector(sc.n, 0.13), sc.n, 0.12, 0.3);
  for (const [u, v] of [[-0.3, -0.9], [0.3, -0.9], [-0.3, 0.9], [0.3, 0.9]]) {
    const s = sfn(u, v);
    screwOn(part, M.chrome, { m: new THREE.Matrix4() }, s.p.clone().addScaledVector(s.n, 0.13), s.n, 0.06, u + v);
  }
  // hinge-pin cap + gasket on the free flank
  const pl = Math.max(L.podF.at(fem.len - 0.3).rx, L.podT.at(0.3).rx) + 0.03;
  const Fp = hingeFrm(L.Kn.clone().addScaledVector(L.kAxis, nd * pl), L.kAxis, O, nd);
  part.add(once('jc-gasket', () => revolve([[0.46, 0], [0.56, 0, 0.015], [0.56, 0.06, 0.015], [0.46, 0.06]], { segments: 32, steps: 1 })), M.black, Fp.m);
  part.add(once('jc-cap', () => revolve([[0, 0.04], [0.5, 0.04, 0.02], [0.5, 0.1], [0.42, 0.14], [0.42, 0.2, 0.03], [0.28, 0.25], [0.28, 0.31], [0.12, 0.33], [0, 0.33]], { segments: 32, steps: 1 })), M.chrome, Fp.m);
  return part;
}

export function buildKnee(ctx, L, top) {
  L.kPlane = Math.max(L.podF.at(L.femur.len - 0.3).rx, L.podT.at(0.3).rx) + 0.09;
  const steps = [kneeServo, kneeBracket, hydraulic, shock, hoses, jointCovers];
  for (const fn of steps) {
    try { fn(ctx, L, top); } catch (e) { console.warn(`[legs] ${L.p.key} ${fn.name} failed:`, e && e.stack ? e.stack : e); }
  }
}
