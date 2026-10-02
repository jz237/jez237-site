// Flight assembly: the outboard hardware of one wing mount (shaft, nut, cross pin, hinge clamp, clamp plates, bolt circles).
// Mount-local frame: x = s along the wing span axis (outboard +), y = lead edge, z = wing normal.
import { M, revolve, circlePts, S } from '../kit.js';
import { TAU, D2R, loopX, plateX, mAt, exS } from './flight-util.js';

/* ------------------------------------------------------------------ output shaft */

/** Chrome output shaft: carrier stub (s -1.47) -> bearing journal -> shoulder -> threaded stub ending at the wing clevis (s +1.0). */
export function buildShaft(mount) {
  const part = mount.part('output-shaft', {
    name: 'Output Shaft',
    info: 'Hardened chrome shaft that carries the oscillation from the gearbox carrier through the bearing stack to the wing clevis at its threaded tip.',
    specs: { Material: 'Chrome-plated tool steel', Journal: 'dia 1.14 mm', Thread: 'M0.8 stub, ends at s = +1.0 mm', Mass: '0.02 g' },
    explode: exS(0.5, 'mid'),
  });
  const rM = 0.57;
  const prof = [[0, -1.47], [0.3, -1.47, 0.02], [0.3, -1.40, 0.012], [0.45, -1.40, 0.012], [0.45, -1.33, 0.012], [rM, -1.33, 0.02]];
  // journal with relief grooves (circlip seats) that show once the bearings are pulled off
  for (const g of [-0.97, -0.58, -0.285]) prof.push([rM, g - 0.035, 0.008], [rM - 0.05, g - 0.035, 0.006], [rM - 0.05, g + 0.035, 0.006], [rM, g + 0.035, 0.008]);
  prof.push([rM, 0.49, 0.02], [0.40, 0.49, 0.012]);
  // thread: shallow V ridges
  const t0 = 0.54, pitch = 0.085, nT = 5;
  for (let k = 0; k < nT; k++) { const s = t0 + k * pitch; prof.push([0.40, s], [0.352, s + pitch / 2]); }
  prof.push([0.40, t0 + nT * pitch], [0.40, 0.965, 0.01], [0.31, 1.0, 0.0], [0, 1.0]);
  part.add(revolve(prof, { segments: 40, axis: 'x', steps: 2, creaseDeg: 40 }), M.chrome);
  return part;
}

/** Gold clevis pin across the threaded stub with a split pin through its tail. */
export function buildShaftPin(mount, F) {
  const part = mount.part('shaft-pin', {
    name: 'Cross Pin',
    info: 'Gold clevis pin through the cross hole in the threaded stub with a split pin through its tail; it keeps the shaft nut from backing off while the wing oscillates.',
    specs: { Material: 'Gold-plated brass', Diameter: '0.15 mm', Mass: '0.002 g' },
    explode: exS(2.6, 'fine'),
  });
  const sx = 0.885;
  part.add(F.pin(0.075, 1.04), M.gold, mAt([sx, 0, -0.52], [0, 0, 1]));
  part.add(F.button(0.12), M.gold, mAt([sx, 0, 0.52], [0, 0, 1]));
  part.add(F.pin(0.028, 0.34), M.gold, mAt([sx, -0.17, -0.40], [0, 1, 0]));
  return part;
}

/** Gold hex nut and chrome washer on the stub. */
export function buildShaftNut(mount) {
  const part = mount.part('shaft-nut', {
    name: 'Shaft Nut and Washer',
    info: 'Gold chamfered hex nut on a chrome washer; it clamps the wing hinge collar against the main bearing hub.',
    specs: { Material: 'Gold-anodised nut, chrome washer', Thread: 'M0.8', Mass: '0.01 g' },
    explode: exS(3.4, 'mid'),
  });
  part.add(loopX([[0.41, 0.53], [0.6, 0.53], [0.66, 0.585], [0.66, 0.70], [0.6, 0.75], [0.41, 0.75]], { segments: 6, steps: 1, creaseDeg: 50, phi0: Math.PI / 6 }), M.gold);
  part.add(loopX([[0.42, 0.49, 0.008], [0.80, 0.49, 0.012], [0.80, 0.53, 0.012], [0.42, 0.53, 0.008]], { segments: 48 }), M.gold);
  return part;
}

/* ------------------------------------------------------------------ hinge bracket (yellow split clamp) */

export function buildHinge(mount, F) {
  const part = mount.part('hinge-bracket', {
    name: 'Hinge Bracket',
    info: 'Yellow split-clamp collar that locks the wing hinge to the output shaft; a pinch screw across the two ears closes the slit.',
    specs: { Material: 'Yellow anodised aluminium', Fastener: 'M0.3 socket pinch screw', Mass: '0.03 g' },
    explode: exS(1.75, 'mid'),
  });
  const rIn = 0.575, rOut = 1.04, ear = 1.36, hw = 0.30, slit = 0.04, s0 = 0.33, th = 0.16;
  const x0 = Math.sqrt(rOut * rOut - hw * hw);
  const a0 = Math.asin(hw / rOut);
  const pts = [[ear, slit], [ear, hw, 0.09], [x0, hw]];
  const nA = S(44, 18);
  for (let i = 0; i <= nA; i++) { const a = a0 + (TAU - 2 * a0) * i / nA; pts.push([Math.cos(a) * rOut, Math.sin(a) * rOut]); }
  pts.push([x0, -hw], [ear, -hw, 0.09], [ear, -slit]);
  const b0 = Math.asin(slit / rIn);
  const nB = S(40, 16);
  for (let i = 0; i <= nB; i++) { const a = -b0 - (TAU - 2 * b0) * i / nB; pts.push([Math.cos(a) * rIn, Math.sin(a) * rIn]); }
  const collar = plateX(pts, th, { bevel: 0.035, bevelSegments: 2, steps: 3 });
  collar.translate(s0, 0, 0);
  part.add(collar, M.yellow);
  const xs = s0 + th / 2, ey = 1.13;
  part.add(F.cap(0.13), M.steel, mAt([xs, ey, hw], [0, 0, 1]));
  part.add(F.hex(0.16), M.steel, mAt([xs, ey, -hw], [0, 0, -1], Math.PI / 6));
  for (const a of [110, 250]) {
    const r = 0.83, aa = a * D2R;
    part.add(F.button(0.065), M.steel, mAt([s0 + th, Math.cos(aa) * r, Math.sin(aa) * r], [1, 0, 0]));
  }
  return part;
}

/* ------------------------------------------------------------------ clamp plates */

/** Ring with `tabs` rounded lobes (bolt ears) that stick out beyond rBase. Outline in (Y, Z). */
function tabbedRing(rBase, rTab, hwT, tabs, phase, nArc = 20) {
  const out = [];
  const d = Math.asin(hwT / rBase);
  const u0 = Math.sqrt(rBase * rBase - hwT * hwT);
  for (let k = 0; k < tabs; k++) {
    const phi = phase + k * TAU / tabs;
    const c = Math.cos(phi), s = Math.sin(phi);
    const put = (u, v) => out.push([c * u - s * v, s * u + c * v]);
    put(u0, -hwT);
    const nS = 8;
    for (let i = 0; i <= nS; i++) { const t = -Math.PI / 2 + Math.PI * i / nS; put(rTab + Math.cos(t) * hwT, Math.sin(t) * hwT); }
    put(u0, hwT);
    const a1 = phi + d, a2 = phi + TAU / tabs - d;
    for (let i = 1; i < nArc; i++) { const a = a1 + (a2 - a1) * i / nArc; out.push([Math.cos(a) * rBase, Math.sin(a) * rBase]); }
  }
  return out;
}

export const PLATE = { oS: 0.285, oT: 0.07, iS: -0.30, iT: 0.08, rBolt: 2.02, rInner: 1.70 };

export function buildClampPlates(mount) {
  const cont = mount.part('clamp-plates', {
    name: 'Bearing Clamp Plates',
    info: 'Two thin retaining plates sandwich the main bearing: a black tabbed ring on the outboard face and a gunmetal ring on the inboard face.',
    specs: { Material: 'Black-oxide steel and gunmetal', Mass: '0.04 g' },
    explode: exS(0.0, 'mid'),
  });
  const outer = cont.part('plate-outer', {
    name: 'Outer Clamp Plate',
    info: 'Black three-tabbed ring that presses on the rim of the main bearing; each tab carries a gold hex bolt.',
    specs: { Material: 'Black-oxide spring steel', Thickness: '0.07 mm' },
    explode: exS(2.3, 'fine'),
  });
  const ph = 90 * D2R;
  const holes = [circlePts(1.86, S(72, 32))];
  for (let k = 0; k < 3; k++) { const a = ph + k * TAU / 3; holes.push(circlePts(0.06, 10, Math.cos(a) * PLATE.rBolt, Math.sin(a) * PLATE.rBolt)); }
  const A = plateX(tabbedRing(2.02, PLATE.rBolt, 0.17, 3, ph), PLATE.oT, { bevel: 0.02, bevelSegments: 1, steps: 2, holes });
  A.translate(PLATE.oS, 0, 0);
  outer.add(A, M.black);
  const inner = cont.part('plate-inner', {
    name: 'Inner Clamp Plate',
    info: 'Gunmetal washer plate behind the main bearing with six bolt holes; it takes the clamping load of the outer plate.',
    specs: { Material: 'Gunmetal', Thickness: '0.08 mm' },
    explode: exS(-2.2, 'fine'),
  });
  const ih = [circlePts(1.56, S(64, 28))];
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + 0.26; ih.push(circlePts(0.085, 12, Math.cos(a) * PLATE.rInner, Math.sin(a) * PLATE.rInner)); }
  const B = plateX(circlePts(1.98, S(72, 32)), PLATE.iT, { bevel: 0.025, bevelSegments: 1, steps: 2, holes: ih });
  B.translate(PLATE.iS, 0, 0);
  inner.add(B, M.gunmetal);
  return cont;
}

/* ------------------------------------------------------------------ bolt circles */

export function buildBoltCircles(mount, F) {
  const cont = mount.part('bolt-circles', {
    name: 'Bolt Circles',
    info: 'Two rings of fasteners: gold hex bolts and steel button screws on the outer clamp plate, six steel cap screws on the inner plate.',
    specs: { Material: 'Gold-plated and stainless steel', Count: '3 hex + 3 button + 6 socket', Mass: '0.01 g' },
    explode: exS(0.0, 'mid'),
  });
  const o = cont.part('bolts-outer', {
    name: 'Outer Bolts',
    info: 'Gold chamfered hex bolts and steel button screws that pin the outer clamp plate to the thorax sleeve.',
    specs: { Material: 'Gold-plated steel', Count: '3 hex + 3 button' },
    explode: exS(3.6, 'fine'),
  });
  const A0 = 90 * D2R, sTop = PLATE.oS + PLATE.oT;
  for (let k = 0; k < 3; k++) {
    const a = A0 + k * TAU / 3;
    o.add(F.hex(0.14), M.gold, mAt([sTop - 0.005, Math.cos(a) * PLATE.rBolt, Math.sin(a) * PLATE.rBolt], [1, 0, 0], k));
    const b = a + TAU / 6;
    o.add(F.button(0.075), M.gold, mAt([sTop - 0.005, Math.cos(b) * 1.94, Math.sin(b) * 1.94], [1, 0, 0]));
  }
  const i = cont.part('bolts-inner', {
    name: 'Inner Cap Screws',
    info: 'Six steel socket-head cap screws that hold the inner clamp plate against the back of the main bearing.',
    specs: { Material: 'Stainless steel', Count: '6 socket' },
    explode: exS(-3.8, 'fine'),
  });
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * TAU + 0.26;
    i.add(F.cap(0.11), M.steel, mAt([PLATE.iS + 0.005, Math.cos(a) * PLATE.rInner, Math.sin(a) * PLATE.rInner], [-1, 0, 0], a));
  }
  return cont;
}
