// APX-9 legs: tibia. tibia-frame (glossy black ribbed core, titanium collar / rib rings / plates, gold clamp bands + socket ring, knee axle barrel),
// tibia-shell (yellow shin plate with inlay windows, black under-layer, ankle cuff, chrome fasteners) and, on the REAR legs only,
// pollen-brush (gold holder strip + clumped golden bristles made with makeFur + idProxy).
import { M, Q, ex, cyl, slotHoles, sphere, makeFur } from '../kit.js';
import { THREE, V3, PI, limbPod, bandPoly, slit, taperOutline, screwOn, once, lerp, clamp, sstep, mergeGeometries } from './legs-core.js';
import { panel, panelOutline, halfWidth, edgeRivets, rivetsAlong, ringPoly, collarPoly } from './legs-panels.js';

const SH = 0.9;   // half-angle (pod section parameter) kept clear around the outer shin plate
const BR = 0.8;   // half-angle kept clear around the knee bracket on the disc flank
const shellSpan = (L) => [0.95, L.tibia.len - 0.82];

/** Vented titanium plate on one flank of the tibia with four gold screws. */
function flankPlate(part, L, side, v0, v1) {
  const pod = L.podT, T = L.tibia;
  if (v1 - v0 < 0.5) return;
  const sfn = pod.surface(side > 0 ? 0 : PI);
  const k = 0.64;
  const n = Math.max(1, Math.floor((v1 - v0 - 0.12) / 0.2));
  const holes = slotHoles(n, 0.36, 0.07, 0.13, 0, (v0 + v1) / 2, false, 0.03);
  part.add(panel({ shape: taperOutline(pod, v0, v1, k, { dim: 'rz', rb: 0.14, rt: 0.14, n: 3 }), holes, surface: sfn, thickness: 0.05, bevel: 0.02, bevelSegments: 1, lift: 0.004, maxEdge: 0.6, steps: 3 }), M.titanium, T.m);
  for (const v of [v0 + 0.14, v1 - 0.14]) {
    const hw = pod.at(v).rz * k - 0.12;
    for (const x of [-hw, hw]) {
      const s = sfn(x, v);
      screwOn(part, M.gold, T, s.p.clone().addScaledVector(s.n, 0.05), s.n, 0.045, x * 5 + v);
    }
  }
}

function tibiaFrame(ctx, L, top) {
  const pod = L.podT, T = L.tibia, len = T.len, p = L.p, ks = L.kneeSide, nd = -ks;
  const part = top.part('tibia-frame', {
    name: `${p.title} Tibia Frame`,
    info: 'Structural core of the tibia: glossy black body with titanium rib rings and gold clamp bands, a knee axle barrel, vented titanium flank plates and a gold socket ring that holds the ankle ball joint.',
    specs: { Material: 'Black composite core, titanium ribs and plates, gold anodised bands', Mass: '0.03 g' },
    explode: ex([0, 0, 0], 'fine'),
  });
  // glossy black core, a hair inside the shell surfaces; short distal cap (the socket ring closes it)
  const core = limbPod(T, p.tib, { w: 0.97, d: 0.97, y0: pod.y0, y1: pod.y1, n: 2.8, capA: { d: 0.4, p: 2 }, capB: { d: 0.12, p: 2 }, bow: 1 });
  part.add(core.geo({ radial: 28, step: 0.4, uv: 0.5 }), M.black, T.m);
  // proximal collar below the knee: stepped titanium collar plus a thin retaining ring
  part.add(pod.wrap(collarPoly(0.3, 0.47, 0.64, -0.02, 0.04, 0.075, 0.015), { radial: 36 }), M.titanium, T.m);
  part.add(pod.wrap(ringPoly(0.7, 0.76, -0.02, 0.05, 0.012), { radial: 32 }), M.titanium, T.m);
  // bellows-style rib clusters (three thin ribs) separated by gold clamp bands; they leave the arcs under the shin plate and the knee bracket free
  const [s0, s1] = shellSpan(L);
  const ring = (va, vb, g1, mat) => {
    const vm = (va + vb) / 2;
    let t0 = 0, t1 = 2 * PI;
    if (vm > s0 - 0.08 && vm < s1 + 0.08) { t0 = PI / 2 + SH; t1 = 2.5 * PI - SH; }
    if (vm > 0.98 && vm < 2.58) { if (ks < 0) t0 = PI + BR; else t1 = 2 * PI - BR; }
    part.add(pod.wrap(ringPoly(va, vb, -0.02, g1, 0.012), { t0, t1, radial: 24 }), mat, T.m);
  };
  const vBot = len - 1.0;
  for (let v = 0.86; v < vBot;) {
    for (let j = 0; j < 3 && v + 0.055 < vBot; j++, v += 0.115) ring(v, v + 0.055, 0.04, M.titanium);
    v += 0.06;
    if (v + 0.1 < vBot) { ring(v, v + 0.1, 0.055, M.gold); v += 0.2; }
  }
  // ankle: low titanium collar under the shell strap, a hex jam nut, a thin gold ring and the socket cup that holds the ball joint of the tarsus
  part.add(pod.wrap(ringPoly(len - 0.8, len - 0.52, -0.02, 0.045, 0.015), { radial: 28 }), M.titanium, T.m);
  const nutR = pod.at(len - 0.45).rx + 0.09;
  part.add(once(`tf-nut|${nutR.toFixed(3)}`, () => cyl(nutR, 0.12, { segments: 6, bevel: 0.02, steps: 1, y0: 0 })), M.titanium, T.at(0, len - 0.51, pod.at(len - 0.45).cz));
  part.add(pod.wrap(ringPoly(len - 0.385, len - 0.325, -0.02, 0.06, 0.012), { radial: 28 }), M.gold, T.m);
  const rr = pod.at(len - 0.28).rx + 0.045, cu = pod.at(len - 0.14);
  part.add(once(`tf-ring|${rr.toFixed(3)}`, () => cyl(rr, 0.26, { rIn: 0.27, bevel: 0.025, bevelIn: 0.015, segments: 28, y0: 0, steps: 1 })), M.titanium, T.at(0, len - 0.26, cu.cz));
  for (let j = 0; j < 6; j++) {
    const a = (j / 6) * 2 * PI + 0.3, n = V3(Math.cos(a), 0, Math.sin(a));
    screwOn(part, M.gold, T, V3(n.x * (rr - 0.008), len - 0.13, cu.cz + n.z * (rr - 0.008)), n, 0.04, a);
  }
  // knee axle barrel through the hinge point (shows in the notch on the inner side of the knee)
  const kp = L.kPlane - 0.06;
  part.add(once(`tf-axle|${kp.toFixed(3)}`, () => cyl(0.4, 2 * kp, { bevel: 0.04, segments: 28, steps: 1 })), M.black, L.knee.m);
  part.add(once(`tf-axlering|${kp.toFixed(3)}`, () => cyl(0.46, 0.3, { bevel: 0.05, segments: 28, steps: 1 })), M.titanium, L.knee.m);
  // vented flank plates: the free flank carries one from the ram pedestal down, the disc flank only below the bracket
  const vEnd = len - 0.88;
  flankPlate(part, L, nd, 2.05, vEnd);
  flankPlate(part, L, ks, 2.9, vEnd);
  return part;
}

function tibiaShell(ctx, L, top) {
  const pod = L.podT, T = L.tibia, len = T.len, p = L.p, hs = L.hipSide;
  const part = top.part('tibia-shell', {
    name: `${p.title} Tibia Shell`, tag: 'shell',
    info: 'Clear-coated yellow shin plate on the outer face of the tibia: a tapered two-part shield with louvre slits over a black inlay, a raised distal cap, edge rivets, a wrap-around cuff at the ankle end and chrome fasteners.',
    specs: { Material: 'Clear-coat yellow composite, black under-layer, chrome fasteners' },
    explode: ex(T.o.clone().multiplyScalar(2.4), 'mid'),
  });
  const sfn = pod.surface(PI / 2);
  const [v0, v1] = shellSpan(L);
  const kb = 0.8, kt = 0.62;
  const kOf = (v) => lerp(kb, kt, (v - v0) / (v1 - v0));
  const wx = hs * 0.17;
  const vs = v1 - 0.69, vc = vs + 0.07;                    // seam between the shield and the raised distal cap
  // louvre slits (staggered lengths), clear of the shock absorber foot on the upper plate
  const wa = 1.74, wb = vs - 0.12;
  const nl = wb - wa > 1.1 ? 4 : 3;
  const windows = [];
  for (let i = 0; i < nl; i++) {
    const len_ = (wb - wa) * (i % 2 ? 0.74 : 1);
    windows.push(slit(wx + (i - (nl - 1) / 2) * 0.14, wb - len_ / 2, 0.082, len_, 0.036));
  }
  part.add(panel({ shape: panelOutline(pod, v0, vs, { dim: 'rx', kb, kt: kOf(vs), cb: 0.18, ct: 0.04, n: 4 }), holes: windows, surface: sfn, thickness: 0.1, bevel: 0.035, bevelSegments: 1, lift: 0.04, maxEdge: 0.5, steps: 3, uvScale: 0.2 }), M.yellow, T.m);
  const kc0 = kOf(vc) - 0.05, kc1 = kt - 0.05;
  part.add(panel({ shape: panelOutline(pod, vc, v1, { kb: kc0, kt: kc1, cb: 0.03, ct: 0.2, n: 3 }), holes: [slit(0, (vc + v1) / 2 - 0.02, 0.34, 0.06, 0.026)], surface: sfn, thickness: 0.11, bevel: 0.035, bevelSegments: 1, lift: 0.065, maxEdge: 0.5, steps: 3, uvScale: 0.2 }), M.yellow, T.m);
  // black under-layer: a chunky frame around both plates that shows through the slits and the seam
  part.add(panel({ shape: panelOutline(pod, v0 - 0.06, v1 + 0.06, { margin: 0.08, kb, kt, cb: 0.26, ct: 0.28, rc: 0.05, n: 5 }), surface: sfn, thickness: 0.085, bevel: 0.025, bevelSegments: 1, lift: 0.0, maxEdge: 0.9, steps: 3 }), M.black, T.m);
  // wrap-around strap at the ankle end with a chrome bolt at each end
  part.add(pod.wrap(ringPoly(len - 0.74, len - 0.5, -0.015, 0.1, 0.024), { t0: -0.5, t1: PI + 0.5, radial: 28 }), M.yellow, T.m);
  const cfn = pod.surface(PI / 2, 0.1);
  for (const x of [-1, 1]) {
    const rm = Math.hypot(pod.at(len - 0.62).rx, pod.at(len - 0.62).rz) / Math.SQRT2;
    const sv = cfn(x * 1.62 * rm, len - 0.62);
    screwOn(part, M.chrome, T, sv.p.clone().addScaledVector(sv.n, -0.006), sv.n, 0.05, x * 3);
  }
  // fasteners: edge rivets, corner screws (the upper pair stays clear of the shock absorber foot)
  rivetsAlong(part, M.chrome, T, sfn, edgeRivets(pod, v0, vs, { kb, kt: kOf(vs), inset: 0.095, end: 0.42, pitch: 0.55 }), 0.135, 0.032);
  rivetsAlong(part, M.chrome, T, sfn, edgeRivets(pod, vc, v1, { kb: kc0, kt: kc1, inset: 0.09, end: 0.4, pitch: 0.5 }), 0.17, 0.032);
  const hwA = halfWidth(pod, v0, vs, { kb, kt: kOf(vs) }), hwB = halfWidth(pod, vc, v1, { kb: kc0, kt: kc1 });
  for (const [v, hwf, lift] of [[v0 + 0.2, hwA, 0.135], [v1 - 0.2, hwB, 0.17]]) {
    for (const x of [-1, 1]) {
      const u = x * (hwf(v) - 0.17);
      const sv = sfn(u, v);
      screwOn(part, M.chrome, T, sv.p.clone().addScaledVector(sv.n, lift), sv.n, 0.058, u * 5 + v);
    }
  }
  return part;
}

let furMat = null;
/**
 * Derived fur material: the shared M.fur with its cream sheen turned down so the amber vertex colours (and the dark roots) survive at macro
 * range. M.fur itself is not touched; makeFur must have run once so that M.fur carries the double-sided normal patch we reuse.
 */
function legFurMaterial() {
  if (!furMat) {
    furMat = M.fur.clone();
    furMat.name = 'fur (legs)';
    furMat.sheen = 0.14; furMat.sheenColor.set('#f0c060'); furMat.sheenRoughness = 0.5;
    furMat.onBeforeCompile = M.fur.onBeforeCompile;
    furMat.customProgramCacheKey = () => 'apx-fur-v1-legs';
  }
  return furMat;
}

/**
 * REAR legs only: the pollen brush. Two gold holder rails (inner face of the lower femur and of the upper tibia, each with clamp bands)
 * carry a dense beard of golden-amber bristles with dark roots that hangs over the inner side of the knee like a bee's scopa.
 */
function pollenBrush(ctx, L, top) {
  if (L.p.key !== 'rear') return null;
  const T = L.tibia, F = L.femur, len = T.len, flen = F.len, p = L.p;
  const bis = F.o.clone().add(T.o).normalize();                          // inner side of the knee = -bisector
  const part = top.part('pollen-brush', {
    name: `${p.title} Pollen Brush`, tag: 'shell',
    info: 'Golden pollen brush on the inner side of the rear knee: two gold holder rails with clamp bands on the lower femur and upper tibia carry a dense beard of fine bristles that comb pollen off the body hairs.',
    specs: { Material: 'Gold anodised holder rails, synthetic golden bristles' },
    explode: ex(bis.clone().multiplyScalar(-3.2), 'mid'),
  });
  const tc = 1.5 * PI;
  const rails = [
    { seg: T, pod: L.podT, v0: 0.72, v1: len * 0.8, k: 0.62, lift: 0.02, th: 0.06, bias: 0.8, wgt: 1.0, l0: 1.0, l1: 0.5, comb: T.a.clone() },
    { seg: F, pod: L.podF, v0: flen - 2.3, v1: flen - 0.42, k: 0.5, lift: 0.16, th: 0.06, bias: 1.0, wgt: 0.62, l0: 0.5, l1: 1.0, comb: F.a.clone().add(V3(0, -0.7, 0)).normalize() },
  ];
  for (const R of rails) {
    R.sfn = R.pod.surface(tc);
    R.root = R.lift + R.th;
    part.add(panel({ shape: taperOutline(R.pod, R.v0 - 0.06, R.v1 + 0.06, R.k, { rb: 0.12, rt: 0.12, n: 5 }), surface: R.sfn, thickness: R.th, bevel: 0.025, bevelSegments: 1, lift: R.lift, maxEdge: 0.5, steps: 3 }), M.gold, R.seg.m);
    for (const v of [R.v0 - 0.2, R.v1 - 0.02]) part.add(R.pod.wrap(bandPoly(v, v + 0.14, -0.02, R.root + 0.05, 0.04, 2), { t0: tc - 1.2, t1: tc + 1.2, radial: 28 }), M.gold, R.seg.m);
  }

  // bristles: clumps of strands rooted on the rails, combed down the leg and fanned sideways; a short deep-amber undercoat plus long bright guard hairs
  const count = Math.max(500, Math.round(4400 * Q.fur));
  const wsum = rails.reduce((a, R) => a + R.wgt, 0);
  const ca = new THREE.Color('#dba31a'), cb = new THREE.Color('#7a4308'), cc = new THREE.Color();
  let clump = null, left = 0;
  const sample = (r) => {
    if (left <= 0) {
      let x = r() * wsum, R = rails[0];
      for (const q of rails) { if (x <= q.wgt) { R = q; break; } x -= q.wgt; }
      const f = Math.pow(r(), R.bias);
      const v = lerp(R.v0, R.v1, f);
      const hw = R.pod.at(clamp(v, R.pod.y0, R.pod.y1)).rx * R.k * 0.95;
      clump = { R, u: (r() * 2 - 1) * hw, v, hw, l: lerp(R.l0, R.l1, sstep(0, 1, f)), c: r() };
      left = 6 + ((r() * 5) | 0);
    }
    left--;
    const R = clump.R;
    const u = clamp(clump.u + (r() - 0.5) * 0.2, -clump.hw, clump.hw);
    const v = clamp(clump.v + (r() - 0.5) * 0.22, R.v0, R.v1);
    const s = R.sfn(u, v), s2 = R.sfn(u + 0.03, v);
    const lat = s2.p.sub(s.p).transformDirection(R.seg.m);                // direction of +u on the surface (fan outward with it)
    const pb = s.p.applyMatrix4(R.seg.m);
    const n = s.n.transformDirection(R.seg.m);
    const t = R.comb.clone().addScaledVector(n, -R.comb.dot(n)).addScaledVector(lat, (u / clump.hw) * 0.6);
    t.addScaledVector(n, -t.dot(n)).normalize();
    const under = r() < 0.42;
    cc.copy(ca).lerp(cb, under ? 0.55 + 0.45 * r() : clump.c * 0.65);
    return { p: pb.addScaledVector(n, R.root - 0.01), n, t, l: clump.l * (under ? 0.5 + 0.2 * r() : 0.85 + 0.3 * r()), w: under ? 1.25 : 0.95, c: [cc.r, cc.g, cc.b] };
  };
  const fur = makeFur({ seed: 4117, count, sample, length: 0.8, lengthJitter: 0.35, width: 0.1, bend: 0.55, lean: 0.5, segments: 3, colors: { a: '#dba31a', b: '#7a4308' }, rootDark: 0.25, gravity: 0.25 });
  fur.material = legFurMaterial();
  part.addMesh(fur, { layers: [2], cast: false, receive: false, pick: false });
  // selection proxy: one ellipsoid per rail hugging the beard, merged
  const ell = [];
  for (const R of rails) {
    const ym = (R.v0 + R.v1) / 2 + 0.15, hy = (R.v1 - R.v0) / 2 + 0.25, e = R.pod.at(ym);
    const xf = new THREE.Matrix4().multiplyMatrices(R.seg.m, new THREE.Matrix4().compose(V3(0, ym, e.cz - e.rz * 0.95), new THREE.Quaternion(), V3(e.rx * R.k + 0.2, hy, 0.6)));
    ell.push(sphere(1, { segments: 14, rings: 9 }).clone().applyMatrix4(xf));
  }
  part.idProxy(mergeGeometries(ell), new THREE.Matrix4());
  return part;
}

export function buildTibia(ctx, L, top) {
  for (const fn of [tibiaFrame, tibiaShell, pollenBrush]) {
    try { fn(ctx, L, top); } catch (e) { console.warn(`[legs] ${L.p.key} ${fn.name} failed:`, e && e.stack ? e.stack : e); }
  }
}
