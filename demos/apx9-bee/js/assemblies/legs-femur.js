// APX-9 legs: femur. femur-shell-outer (slim yellow armour shell with a black inlay window and a wrap-around cuff),
// femur-shell-inner (dark belly plate with a vent cassette, yellow bezel and bolted rings), femur-frame (glossy black body, titanium collars, louvred flank plates, flanged encoder cap).
import { M, ex, revolve, cyl, slotHoles } from '../kit.js';
import { PI, limbPod, bandPoly, taperOutline, slit, flankFrame, screwOn, boltCircle, alongN, lerp, once } from './legs-core.js';
import { panel, panelOutline, halfWidth, edgeRivets, rivetsAlong } from './legs-panels.js';

function femurShellOuter(ctx, L, top) {
  const pod = L.podF, F = L.femur, len = F.len, t = L.p.title, hs = L.hipSide;
  const part = top.part('femur-shell-outer', {
    name: `${t} Femur Outer Shell`, tag: 'shell',
    info: 'Clear-coated yellow armour shell on the outer face of the femur: a two-part plate with a raised end cap, twin gill slits over a black inlay, edge rivets, a wrap-around yellow cuff at the knee end and chrome fasteners.',
    specs: { Material: 'Clear-coat yellow composite, black under-layer, chrome fasteners' },
    explode: ex(F.o.clone().multiplyScalar(3.0), 'mid'),
  });
  const sfn = pod.surface(PI / 2);
  const v0 = 0.5, v1 = len - 1.1, span = v1 - v0;
  const KB = 0.62, KT = 0.7;
  const kOf = (v) => lerp(KB, KT, (v - v0) / span);
  const vs = v1 - 0.92;                                   // seam between the main plate and the raised end cap
  const vc = vs + 0.07;
  const mid = (v0 + vs) / 2, ms = vs - v0;
  // main plate: cut lower corners, twin gill slits near the hip-side edge, one short slot at the foot of the plate
  const holes = [
    slit(hs * 0.34, mid + 0.06, 0.1, ms * 0.76, 0.045),
    slit(hs * 0.14, mid - 0.18, 0.075, ms * 0.5, 0.034),
    slit(-hs * 0.28, v0 + 0.42, 0.34, 0.085, 0.035),
  ];
  part.add(panel({ shape: panelOutline(pod, v0, vs, { kb: KB, kt: kOf(vs), cb: 0.2, ct: 0.04 }), holes, surface: sfn, thickness: 0.1, bevel: 0.035, bevelSegments: 1, lift: 0.04, maxEdge: 0.5, steps: 3, uvScale: 0.2 }), M.yellow, F.m);
  // raised end cap, a touch narrower, with a transverse vent slot
  const kc0 = kOf(vc) - 0.045, kc1 = KT - 0.05;
  part.add(panel({ shape: panelOutline(pod, vc, v1, { kb: kc0, kt: kc1, cb: 0.04, ct: 0.21 }), holes: [slit(0, (vc + v1) / 2 - 0.03, 0.46, 0.07, 0.03)], surface: sfn, thickness: 0.11, bevel: 0.035, bevelSegments: 1, lift: 0.065, maxEdge: 0.5, steps: 3, uvScale: 0.2 }), M.yellow, F.m);
  // black under-layer: a chunky frame around both plates that shows through the slits and the seam
  part.add(panel({ shape: panelOutline(pod, v0 - 0.06, v1 + 0.06, { margin: 0.09, kb: KB, kt: KT, cb: 0.26, ct: 0.3, rc: 0.05 }), surface: sfn, thickness: 0.085, bevel: 0.025, bevelSegments: 1, lift: 0.0, maxEdge: 0.9, steps: 3 }), M.black, F.m);
  // chrome slivers on the floor of the slits
  for (const [x, c, h, w] of [[hs * 0.34 - 0.03, mid + 0.06, ms * 0.76 - 0.12, 0.022], [hs * 0.14 - 0.022, mid - 0.18, ms * 0.5 - 0.1, 0.018]]) {
    part.add(panel({ shape: slit(x, c, w, h, 0.008), surface: sfn, thickness: 0.02, bevel: 0.006, bevelSegments: 1, lift: 0.05, maxEdge: 1.2, steps: 2 }), M.chrome, F.m);
  }
  // wrap-around cuff at the knee end of the femur
  part.add(pod.wrap(bandPoly(len - 1.0, len - 0.32, -0.015, 0.075, 0.05, 2), { t0: -0.55, t1: PI + 0.55, radial: 40 }), M.yellow, F.m);
  // fasteners: rivets along the long edges of the main plate, a pair on the cap, four corner screws
  rivetsAlong(part, M.chrome, F, sfn, edgeRivets(pod, v0, vs, { kb: KB, kt: kOf(vs), inset: 0.095, end: 0.42, pitch: 0.62 }), 0.135, 0.034);
  rivetsAlong(part, M.chrome, F, sfn, edgeRivets(pod, vc, v1, { kb: kc0, kt: kc1, inset: 0.095, end: 0.5, pitch: 0.7 }), 0.17, 0.034);
  const hwOf = halfWidth(pod, v0, vs, { kb: KB, kt: kOf(vs) });
  const hwC = halfWidth(pod, vc, v1, { kb: kc0, kt: kc1 });
  for (const [v, hwf, lift] of [[v0 + 0.22, hwOf, 0.135], [vs - 0.17, hwOf, 0.135], [vc + 0.16, hwC, 0.17], [v1 - 0.2, hwC, 0.17]]) {
    for (const x of [-1, 1]) {
      const u = x * (hwf(v) - 0.19);
      const s = sfn(u, v);
      screwOn(part, M.chrome, F, s.p.clone().addScaledVector(s.n, lift), s.n, 0.062, u * 5 + v);
    }
  }
  return part;
}

function femurShellInner(ctx, L, top) {
  const pod = L.podF, F = L.femur, len = F.len, t = L.p.title;
  const part = top.part('femur-shell-inner', {
    name: `${t} Femur Inner Shell`, tag: 'shell',
    info: 'Dark gunmetal belly plate on the inner face of the femur: a yellow bezel with black bolts frames a louvred vent cassette and two bolted access rings, over a black under-layer.',
    specs: { Material: 'Gunmetal composite, yellow bezel, black fasteners' },
    explode: ex(F.o.clone().multiplyScalar(-2.2), 'mid'),
  });
  const sfn = pod.surface(PI * 1.5);
  const v0 = 0.8, v1 = len - 0.7, k = 0.72, vm = (v0 + v1) / 2;
  const ns = 5, sw = 0.72, sh = 0.085, sg = 0.12, tot = ns * sh + (ns - 1) * sg;
  // dark main plate with the louvre cassette cut into its middle, black under-layer a hair larger (shows through the louvres)
  part.add(panel({ shape: taperOutline(pod, v0, v1, k, { rb: 0.26, rt: 0.26 }), holes: slotHoles(ns, sw, sh, sg, 0, vm, false, 0.035), surface: sfn, thickness: 0.09, bevel: 0.03, bevelSegments: 1, lift: 0.035, maxEdge: 0.8, steps: 3 }), M.gunmetalDark, F.m);
  part.add(panel({ shape: taperOutline(pod, v0 - 0.04, v1 + 0.04, k, { margin: 0.05, rb: 0.3, rt: 0.3 }), surface: sfn, thickness: 0.05, bevel: 0.02, bevelSegments: 1, lift: 0.0, maxEdge: 1.0, steps: 3 }), M.black, F.m);
  // raised black rim around the cassette
  part.add(panel({ shape: slit(0, vm, sw + 0.32, tot + 0.32, 0.07), holes: [slit(0, vm, sw + 0.1, tot + 0.1, 0.04)], surface: sfn, thickness: 0.07, bevel: 0.02, bevelSegments: 1, lift: 0.1, maxEdge: 0.9, steps: 2 }), M.black, F.m);
  // yellow bezel: rails along both long edges and bars across the ends
  const bezOut = taperOutline(pod, v0 - 0.03, v1 + 0.03, k, { margin: 0.03, rb: 0.3, rt: 0.3 });
  const bezIn = taperOutline(pod, v0 + 0.2, v1 - 0.2, k, { margin: -0.1, rb: 0.12, rt: 0.12, n: 3 });
  part.add(panel({ shape: bezOut, holes: [bezIn], surface: sfn, thickness: 0.12, bevel: 0.035, bevelSegments: 1, lift: 0.085, maxEdge: 0.8, steps: 3 }), M.yellow, F.m);
  // bolted access rings: black collar with a yellow hex bolt on the plate; black bolts on the yellow end bars
  const ring = once('fi-ring', () => cyl(0.19, 0.06, { rIn: 0.1, bevel: 0.014, bevelIn: 0.01, segments: 16, steps: 1, y0: 0 }));
  for (const v of [v0 + 0.62, v1 - 0.62]) {
    const s = sfn(0, v);
        part.add(ring, M.black, F.m.clone().multiply(alongN(s.p.clone().addScaledVector(s.n, 0.115), s.n)));
    screwOn(part, M.yellow, F, s.p.clone().addScaledVector(s.n, 0.12), s.n, 0.075, v * 3);
  }
  for (const v of [v0 + 0.085, v1 - 0.085]) for (const x of [-0.32, 0.32]) {
    const s = sfn(x, v);
        screwOn(part, M.black, F, s.p.clone().addScaledVector(s.n, 0.2), s.n, 0.055, x * 7 + v);
  }
  return part;
}

/** Encoder housing standing on a flank: titanium bearing flange with a six-bolt circle, stepped matte cap and a centre knob. */
function encoderCap(part, fr) {
  part.add(once('fm-cap', () => revolve([[0, 0.04], [0.45, 0.04, 0.02], [0.45, 0.12], [0.41, 0.15], [0.41, 0.21, 0.03], [0.3, 0.25], [0.19, 0.25], [0.19, 0.3, 0.02], [0, 0.3]], { segments: 32, steps: 1 })), M.blackMatte, fr.m);
  part.add(once('fm-flange', () => revolve([[0.3, 0], [0.6, 0, 0.012], [0.6, 0.055, 0.012], [0.3, 0.055]], { segments: 36, steps: 1 })), M.titanium, fr.m);
  boltCircle(part, M.titanium, fr.m, 6, 0.53, 0.04, 0.26, 0.05);
}

function femurFrame(ctx, L, top) {
  const pod = L.podF, F = L.femur, len = F.len, t = L.p.title, p = L.p;
  const part = top.part('femur-frame', {
    name: `${t} Femur Frame`,
    info: 'Structural core of the femur: a glossy black body with titanium collars at both ends, matte flank plates with louvred vent grilles over silver floors, bolted corners and a flanged encoder cap on the hip flank.',
    specs: { Material: 'Glossy black composite core, titanium collars and fasteners, matte black plates', Mass: '0.05 g' },
    explode: ex([0, 0, 0], 'fine'),
  });
  // glossy body, a hair inside the shell surfaces
  const core = limbPod(F, p.fem, { w: 0.985, d: 0.985, y0: pod.y0, y1: pod.y1, n: 2.7, capA: { d: 0.5, p: 2 }, capB: { d: 0.4, p: 2 }, bow: 1 });
  part.add(core.geo({ radial: 32, step: 0.5, uv: 0.5 }), M.black, F.m);
  // titanium collars at both ends of the body
  for (const [a, b] of [[0.0, 0.34], [len - 0.52, len - 0.2]]) part.add(pod.wrap(bandPoly(a, b, -0.02, 0.07, 0.04, 2), { radial: 40 }), M.titanium, F.m);
  // matte flank plates on both flanks: louvred vent grilles on the hip-servo flank, end windows on the free one
  for (const side of [1, -1]) {
    const sfn = pod.surface(side > 0 ? 0 : PI);
    const v0 = 1.05, v1 = len - 1.0;
    const hw = (v) => pod.at(v).rz * 0.72;
    const out = [];
    const nv = 4;
    for (let i = 0; i <= nv; i++) { const v = lerp(v0, v1, i / nv); out.push([hw(v), v, i === 0 || i === nv ? 0.22 : 0]); }
    for (let i = nv; i >= 0; i--) { const v = lerp(v0, v1, i / nv); out.push([-hw(v), v, i === 0 || i === nv ? 0.22 : 0]); }
    const mid = (v0 + v1) / 2;
    const faceDisc = side === L.hipSide;
    const holes = [], floors = [];
    if (faceDisc) {
      // louvred vent grilles either side of the encoder: thin slots over a silver floor
      for (const [a, b] of [[v0 + 0.3, mid - 0.74], [mid + 0.74, v1 - 0.3]]) {
        const n = Math.max(3, Math.round((b - a) / 0.145) + 1), c = (a + b) / 2;
        const w = 2 * (Math.min(hw(a), hw(b)) - 0.19), tot = n * 0.06 + (n - 1) * 0.085;
        holes.push(...slotHoles(n, w, 0.06, 0.085, 0, c, false, 0.028));
        floors.push([c, w + 0.07, tot + 0.08]);
      }
    } else {
      // free flank: a window at each end, plain plate in the middle for the plumbing
      const hh = 0.38;
      for (const v of [v0 + 0.3, v1 - 0.3]) { holes.push(slit(0, v, 0.42, hh, 0.1)); floors.push([v, 0.35, hh - 0.07]); }
    }
    part.add(panel({ shape: out, holes, surface: sfn, thickness: 0.05, bevel: 0.02, bevelSegments: 1, lift: 0.002, maxEdge: 0.8, steps: 3 }), M.blackMatte, F.m);
    // silver floors under the vents
    for (const [c, w, h] of floors) part.add(panel({ shape: slit(0, c, w, h, 0.05), surface: sfn, thickness: 0.02, bevel: 0.006, bevelSegments: 1, lift: 0.012, maxEdge: 1.2, steps: 2 }), M.titanium, F.m);
    // four corner screws
    for (const v of [v0 + 0.2, v1 - 0.2]) for (const x of [-1, 1]) {
      const u = x * (hw(v) - 0.17);
      const sp = sfn(u, v);
      screwOn(part, M.titanium, F, sp.p.clone().addScaledVector(sp.n, 0.05), sp.n, 0.05, u * 9 + v);
    }
    if (faceDisc) encoderCap(part, flankFrame(F, pod, mid, side, 0.045));
  }
  return part;
}

export function buildFemur(ctx, L, top) {
  femurShellOuter(ctx, L, top);
  femurShellInner(ctx, L, top);
  femurFrame(ctx, L, top);
}
