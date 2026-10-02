// APX-9 legs: foot. tarsus-1..3 (glossy black ball joints on three different barrels: ribbed round, hex prism with bolts,
// pleated bellows; gold clamp rings, tombstone clevis lugs with gold pins that alternate their hinge axis) and foot-pad
// (ankle ball and ribbed neck, gold bolted palm flange, clevis-hinged hooked black toes with gold clamp rings, knurled rubber
// sole whose underside sits exactly on y = K.footLevel).
import { M, ex, cyl, sphere, box, plate, rectPts, sweep, revolve, gearShape, ngonPts } from '../kit.js';
import { THREE, V3, Frm, PI, grooves, once, lerp, clamp, screwOn, alongN } from './legs-core.js';

const BALL = [0.25, 0.225, 0.205, 0.19];     // ball joint radii (tibia socket, tarsus 1/2/3 distal, ankle), scaled by the leg size
const TOE = [[0.38, 0.6], [0.68, 0.61], [0.95, 0.7], [1.11, 0.88], [1.15, 1.06], [1.07, 1.18]];
const HEEL = [[0.38, 0.62], [0.62, 0.65], [0.79, 0.77], [0.84, 0.93], [0.76, 1.03]];
const TOES = { front: [-62, 0, 62], mid: [-58, 0, 58], rear: [-72, -26, 26, 72] };
const EXPLODE = [0.55, 1.25, 1.95];

/** Claw frame: origin at the ankle point A, local +Y down, local -X forward, +Z outboard (bee-aligned so the toes point straight ahead). */
const clawFrame = (A) => new Frm(new THREE.Matrix4().makeBasis(V3(-1, 0, 0), V3(0, -1, 0), V3(0, 0, 1)).setPosition(A));

/** Tombstone clevis lug (plate in XY, thickness along Z): width w, height h, round end at +y (its centre = pin axis). */
const lugPts = (w, h) => [[-w / 2, -h / 2, 0.025], [w / 2, -h / 2, 0.025], [w / 2, h / 2, w / 2 * 0.98], [-w / 2, h / 2, w / 2 * 0.98]];

function tarsusPiece(ctx, L, top, i) {
  const p = L.p, T = L.tarsus, tl = T.len, sc = p.servoR;
  const lens = p.tarsus;
  const ya = lens.slice(0, i).reduce((a, b) => a + b, 0), h = lens[i];
  const rad = (y) => lerp(0.235, 0.172, y / tl) * sc;
  const rb = BALL[i] * sc, rbN = BALL[i + 1] * sc;
  const r = rad(ya + h * 0.5);
  const ordinal = ['First', 'Second', 'Third'][i];
  const part = top.part(`tarsus-${i + 1}`, {
    name: `${p.title} Tarsus ${i + 1}`,
    info: [
      'First tarsal segment: a black ball joint seated in the tibia socket, a ribbed barrel with a gold clamp ring and a tombstone clevis that carries the next joint on a gold pin.',
      'Second tarsal segment: glossy black ball joint, a hex-prism barrel with gold clamp bands and hex bolts, and a pinned clevis lug that carries the next ball joint.',
      'Third tarsal segment: glossy black ball joint, a pleated bellows barrel with a gold clamp ring, and a pinned clevis lug that cradles the ankle ball of the foot pad.',
    ][i],
    specs: { Material: 'Black anodised steel, gold anodised rings and pins', Mass: '0.004 g' },
    explode: ex(L.tdir.clone().multiplyScalar(EXPLODE[i]), 'fine'),
  });
  const PF = new Frm(T.at(0, ya, 0, 0, (i % 2) * 90, 0));             // piece frame: origin on the proximal ball centre, hinge axis alternates
  const key = `${p.key}|${i}`;
  // ball joint
  part.add(once(`ta-ball|${rb.toFixed(3)}`, () => sphere(rb, { segments: 18, rings: 12 })), M.black, PF.m);
  // barrel
  const rc = rbN * 0.86;                                               // clevis lug half-width
  const y0 = rb * 0.5, y1 = h - rc * 0.8;
  const yb0 = y0 + rb * 0.7;                                           // barrel shoulder (just past the ball)
  if (i === 0) {
    const nG = clamp(Math.floor((y1 - 0.16 - (yb0 + 0.14)) / 0.075), 0, 4);
    const prof = [[0, y0], [r * 0.72, y0, 0], [r * 0.72, yb0], [r * 0.92, yb0 + 0.08, 0.025]];
    if (nG > 0) prof.push(...grooves(r * 0.92, yb0 + 0.14, y1 - 0.16, nG, 0.035, 0.018, 0.012));
    prof.push([r * 0.92, y1 - 0.1], [r * 1.12, y1 - 0.08, 0.015], [r * 1.12, y1, 0.015], [0, y1]);
    part.add(once(`ta-barrel|${key}|${r.toFixed(3)}`, () => revolve(prof, { segments: 24, steps: 1 })), M.black, PF.m);
  } else if (i === 1) {
    // hex prism barrel with chamfered ends, a gold hex clamp band and two hex bolts on the side flats
    const hl = y1 - yb0 - 0.05, rh = r * 1.12;
    part.add(once(`ta-hex|${key}|${rh.toFixed(3)}`, () => {
      const g = plate(ngonPts(6, rh, PI / 6), hl, { bevel: 0.035, center: true, bevelSegments: 1, steps: 1, creaseDeg: 40 });
      g.rotateX(-PI / 2); g.translate(0, yb0 + 0.05 + hl / 2, 0);
      return g;
    }), M.black, PF.m);
    part.add(once(`ta-neck|${key}|${r.toFixed(3)}`, () => revolve([[0, y0], [r * 0.72, y0, 0], [r * 0.72, yb0 + 0.12], [0, yb0 + 0.12]], { segments: 20, steps: 1 })), M.black, PF.m);
    part.add(once(`ta-hexband|${rh.toFixed(3)}`, () => {
      const g = plate(ngonPts(6, rh * 1.14, PI / 6), 0.07, { bevel: 0.018, center: true, bevelSegments: 1, steps: 1, holes: [], creaseDeg: 40 });
      g.rotateX(-PI / 2);
      return g;
    }), M.gold, PF.at(0, yb0 + 0.12 + 0.035, 0));
    const ym = (yb0 + 0.05 + y1) / 2 + 0.03;
    for (const sz of [1, -1]) screwOn(part, M.gold, PF, V3(0, ym, sz * rh * 0.866), V3(0, 0, sz), 0.055);
  } else {
    // pleated bellows
    const np = 5, ys = yb0 + 0.04, ye = y1 - 0.12, pit = (ye - ys) / np;
    const prof = [[0, y0], [r * 0.72, y0, 0], [r * 0.72, ys], [r * 0.96, ys + 0.02]];
    for (let k = 0; k < np; k++) prof.push([r * 1.14, ys + pit * (k + 0.5)], [r * 0.9, ys + pit * (k + 1)]);
    prof.push([r * 1.1, ye + 0.02], [r * 1.1, y1, 0.015], [0, y1]);
    part.add(once(`ta-bell|${key}|${r.toFixed(3)}`, () => revolve(prof, { segments: 24, steps: 1, creaseDeg: 55 })), M.black, PF.m);
  }
  // gold clamp ring
  part.add(once(`ta-ring|${r.toFixed(3)}|${i}`, () => cyl(r * (i === 1 ? 1.5 : 1.34), 0.075, { rIn: r * 0.85, bevel: 0.016, bevelIn: 0.006, segments: 24, steps: 1, y0: 0 })), M.gold, PF.at(0, y1 - 0.2, 0));
  // clevis lugs around the next ball: two tombstone cheeks with the pin through their round ends, pin heads and washers
  const xc = rbN + 0.06;
  const lt = h + rc - (y1 - 0.06), ycen = h + rc - lt / 2;
  const lug = once(`ta-lug|${key}|${rc.toFixed(3)}`, () => plate(lugPts(rc * 2, lt), 0.06, { bevel: 0.014, center: true, bevelSegments: 1, steps: 5 }));
  for (const sx of [1, -1]) part.add(lug, M.black, PF.at(sx * xc, ycen, 0, 0, 90, 0));
  part.add(once(`ta-pin|${xc.toFixed(3)}`, () => cyl(0.034, xc * 2 + 0.1, { axis: 'x', bevel: 0.008, segments: 10, steps: 1 })), M.gold, PF.at(0, h, 0));
  const head = once('ta-pinhead', () => cyl(0.062, 0.04, { axis: 'x', bevel: 0.012, segments: 14, steps: 1 }));
  for (const sx of [1, -1]) part.add(head, M.gold, PF.at(sx * (xc + 0.05), h, 0));
  return part;
}

function footPad(ctx, L, top) {
  const p = L.p, sc = p.servoR;
  const part = top.part('foot-pad', {
    name: `${p.title} Foot Pad`,
    info: 'Claw foot pad: black ankle ball and ribbed neck under a gold bolted palm flange, clevis-hinged hooked toes with gold clamp rings, and a knurled rubber sole whose underside rests on the ground plane.',
    specs: { Material: 'Black anodised steel toes, gold palm, rubber sole', Mass: '0.01 g' },
    explode: ex(L.tdir.clone().multiplyScalar(2.75), 'fine'),
  });
  const C = clawFrame(L.A);
  const yb = p.claw;                                                    // ground, claw frame (y down)
  const pY = 0.62;                                                      // toe plane
  // ankle ball (held in the clevis of tarsus-3), ribbed neck and gold collar
  part.add(once(`fp-ball|${sc}`, () => sphere(BALL[3] * sc, { segments: 18, rings: 12 })), M.black, C.m);
  part.add(once(`fp-neck|${sc}`, () => revolve([[0, 0.1], [0.13 * sc, 0.1, 0], [0.12 * sc, 0.2], [0.15 * sc, 0.22, 0.01], [0.15 * sc, 0.3], [0.12 * sc, 0.32, 0.01], [0.12 * sc, 0.4], [0.17 * sc, 0.43, 0.02], [0.2 * sc, 0.5, 0.02], [0, 0.5]], { segments: 22, steps: 1 })), M.black, C.m);
  part.add(once(`fp-collar|${sc}`, () => cyl(0.25 * sc, 0.075, { rIn: 0.1 * sc, bevel: 0.016, bevelIn: 0.006, segments: 22, steps: 1 })), M.gold, C.at(0, 0.27, 0));
  const capScrew = once('fp-screw', () => revolve([[0, 0], [0.1, 0], [0.1, 0.045, 0.014], [0.075, 0.075, 0.01], [0, 0.075]], { segments: 8, steps: 1, creaseDeg: 50 }));
  // palm flange: gold disc with a stepped rim, a split groove on the top face and a ring of cap screws
  part.add(once('fp-palm', () => revolve([[0, 0.5], [0.34, 0.5], [0.35, 0.526], [0.39, 0.526], [0.4, 0.5], [0.54, 0.5, 0.03], [0.62, 0.58, 0.02], [0.62, 0.69, 0.02], [0.54, 0.77, 0.03], [0, 0.77]], { segments: 30, steps: 1 })), M.gold, C.m);
  for (let k = 0; k < 6; k++) {
    const a = PI / 6 + (k / 6) * PI * 2 + (p.key === 'rear' ? 0.1 : 0);
    part.add(capScrew, M.gold, C.m.clone().multiply(alongN(V3(Math.cos(a) * 0.47, 0.5, Math.sin(a) * 0.47), V3(0, -1, 0), 0, 0.5)));
  }
  // hub under the palm, gold retaining ring and knurled rubber sole (flat underside exactly on the ground plane)
  part.add(once('fp-hub', () => revolve([[0, 0.77], [0.3, 0.77], [0.28, 0.82, 0], [0.28, 0.9], [0, 0.9]], { segments: 22, steps: 1 })), M.black, C.m);
  part.add(once('fp-clip', () => cyl(0.37, 0.06, { rIn: 0.26, bevel: 0.015, bevelIn: 0.006, segments: 26, steps: 1, y0: 0 })), M.gold, C.at(0, 0.84, 0));
  const sh = 0.34;                                                      // sole height
  part.add(once(`fp-sole|${yb}`, () => {
    const g = plate(gearShape({ teeth: 18, rOut: 0.47, rRoot: 0.43, tip: 0.3, root: 0.42 }), sh, { bevel: 0.045, center: true, bevelSegments: 1, steps: 1, creaseDeg: 45 });
    g.rotateX(-PI / 2); g.translate(0, yb - sh / 2, 0);
    return g;
  }), M.rubber, C.m);
  // hooked toes: tapered black hook, tombstone clevis cheeks with a gold pin, and a gold clamp ring on the finger
  const radius = (u) => 0.088 * Math.pow(1 - u, 0.9) + 0.016;
  const hradius = (u) => 0.074 * Math.pow(1 - u, 0.9) + 0.016;
  const toeGeo = once('fp-toe', () => sweep(TOE.map(([rr, y]) => V3(-rr, y, 0)), { radius, radial: 8, segments: 15, caps: true }));
  const heelGeo = once('fp-heel', () => sweep(HEEL.map(([rr, y]) => V3(-rr, y, 0)), { radius: hradius, radial: 8, segments: 12, caps: true }));
  const toeCurve = new THREE.CatmullRomCurve3(TOE.map(([rr, y]) => V3(-rr, y, 0)), false, 'catmullrom', 0.5);
  const heelCurve = new THREE.CatmullRomCurve3(HEEL.map(([rr, y]) => V3(-rr, y, 0)), false, 'catmullrom', 0.5);
  const lugT = once('fp-lug', () => plate(lugPts(0.3, 0.38), 0.05, { bevel: 0.014, center: true, bevelSegments: 1, steps: 3 }));
  const lugH = once('fp-lug-h', () => plate(lugPts(0.25, 0.32), 0.045, { bevel: 0.012, center: true, bevelSegments: 1, steps: 3 }));
  const pin = once('fp-pin', () => cyl(0.032, 0.34, { axis: 'z', bevel: 0.008, segments: 10, steps: 1 }));
  const pinHead = once('fp-pinhead', () => cyl(0.058, 0.034, { axis: 'z', bevel: 0.01, segments: 8, steps: 1 }));
  const clamp1 = once('fp-clamp', () => cyl(0.105, 0.1, { rIn: 0.055, bevel: 0.018, bevelIn: 0.006, segments: 12, steps: 1 }));
  const clamp2 = once('fp-clamp-b', () => cyl(0.09, 0.07, { rIn: 0.045, bevel: 0.014, bevelIn: 0.005, segments: 12, steps: 1 }));
  const angles = [...TOES[p.key], 180];
  for (const a of angles) {
    const heel = a === 180;
    const TF = C.at(0, 0, 0, 0, a, 0);
    part.add(heel ? heelGeo : toeGeo, M.black, TF);
    const cv = heel ? heelCurve : toeCurve;
    // clevis lugs straddling the finger root (round end carries the pin)
    const px = heel ? -0.7 : -0.78, py = heel ? 0.65 : 0.63;
    const lg = heel ? lugH : lugT, lh = heel ? 0.32 : 0.38;
    const m4 = (x, y, z, rx = 0, ry = 0, rz = 0) => C.m.clone().multiply(new THREE.Matrix4().makeRotationY(a * PI / 180)).multiply(new THREE.Matrix4().compose(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx * PI / 180, ry * PI / 180, rz * PI / 180)), V3(1, 1, 1)));
    // lug outline: round end is +y in plate space, but the finger needs it pointing outward (-x in the toe frame): rotate the plate -90 about z
    for (const sz of [1, -1]) {
      part.add(lg, M.black, m4(px + (heel ? 0.1 : 0.12), py, sz * (heel ? 0.1 : 0.115), 0, 0, 90));
      part.add(pinHead, M.gold, m4(px, py, sz * (heel ? 0.152 : 0.167)));
    }
    part.add(pin, M.gold, m4(px, py, 0));
    // gold clamp rings on the finger
    for (const [u, g] of heel ? [[0.62, clamp2]] : [[0.5, clamp1], [0.8, clamp2]]) {
      const pt = cv.getPointAt(u), tg = cv.getTangentAt(u);
      part.add(g, M.gold, C.m.clone().multiply(new THREE.Matrix4().makeRotationY(a * PI / 180)).multiply(alongN(pt, tg)));
    }
  }
  return part;
}

export function buildFoot(ctx, L, top) {
  const jobs = [[`tarsus-1`, () => tarsusPiece(ctx, L, top, 0)], [`tarsus-2`, () => tarsusPiece(ctx, L, top, 1)], [`tarsus-3`, () => tarsusPiece(ctx, L, top, 2)], ['foot-pad', () => footPad(ctx, L, top)]];
  for (const [name, fn] of jobs) {
    try { fn(); } catch (e) { console.warn(`[legs] ${L.p.key} ${name} failed:`, e && e.stack ? e.stack : e); }
  }
}
