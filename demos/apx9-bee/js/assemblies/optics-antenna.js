// optics-antenna.js - the right antenna module (optics.js mirrors it to the left):
// base socket, scape, elbow knuckle, six flagellum barrels, amber tip sensor, side chemical cartridge, airflow vane, wiring.
//
// Every segment is its own part whose node frame follows the bent chain: origin = start joint, +Y along the segment axis,
// +X toward the bend ("down" in the bee), +Z = X x Y (the bend-plane normal, pointing outward). The explode choreography
// straightens the chain with a rotation about local Z and slides every segment onto the socket axis (the line through
// K.head.antennaR.base along K.head.antennaR.dir), one gap per segment.
import { THREE, K, V3, M, S, ex, revolve, cyl, sphere, box, plate, sweep, gear, hexNut, torus, rectPts, circleHole, rng } from '../kit.js';
import { TAU, placeMat } from './optics-frame.js';
import { capScrew, bumpGeo, knurl } from './optics-hw.js';

const D2R = Math.PI / 180;
const mT = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
const mRx = (a) => new THREE.Matrix4().makeRotationX(a);
const mRy = (a) => new THREE.Matrix4().makeRotationY(a);
const mRz = (a) => new THREE.Matrix4().makeRotationZ(a);

/** polished dark antenna body: near-black metal under a mirror clear-coat (crisp softbox streaks, like the reference) */
export const antBody = new THREE.MeshPhysicalMaterial({ name: 'antenna body', color: new THREE.Color(0x1a1e25), metalness: 0.92, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 });

/** satin titanium for flat sheet metal (a mirror-like flat plate would only ever show one dark patch of the studio) */
const vaneMat = new THREE.MeshPhysicalMaterial({ name: 'vane satin titanium', color: new THREE.Color(0xd2cdc4), metalness: 0.62, roughness: 0.4, clearcoat: 0.45, clearcoatRoughness: 0.22 });

/* ------------------------------------------------------------------ chain layout (mm, along the axis from the base point) */
const US = 0.6;                 // everything beyond the base socket is modelled at the sizes below and placed at this scale (slender, head-height antenna)
const LS = 4.3;                 // scape length
const S0 = 0.85;                // scape start (boot height, unscaled: the socket mates the head bore 1:1)
const EIN = 0.55, EOUT = 0.55;  // scape end -> elbow centre -> first flagellum
const AE = 30 * D2R;            // bend at the elbow
const DJ = 7.5 * D2R;           // extra bend at every flagellum joint
const LF = [1.5, 1.45, 1.4, 1.35, 1.3, 1.25];
const RF = [0.425, 0.4, 0.375, 0.35, 0.325, 0.3];   // start radius of each flagellum barrel
const TIPL = 1.2;
const SH = (i) => 0.9 + 0.8 * i; // exploded shift along the axis of segment i (scape 0, elbow 1, F1..F6 2..7, tip 8)
const mmS = (v, d = 2) => (v * US).toFixed(d);   // modelled size -> real size, for the spec sheet

let _chain = null;
/** frames of every antenna part in bee space (right antenna), plus the straight-line explode offsets */
export function antennaChain() {
  if (_chain) return _chain;
  const A = K.head.antennaR;
  const B = A.base.clone(), d0 = A.dir.clone().normalize();
  const gdn = V3(0.25, -1, 0.15);
  const b0 = gdn.addScaledVector(d0, -gdn.dot(d0)).normalize();          // bend direction (down, perpendicular to the axis)
  const z0 = new THREE.Vector3().crossVectors(b0, d0).normalize();        // bend-plane normal (outward)
  const dirAt = (a) => d0.clone().multiplyScalar(Math.cos(a)).addScaledVector(b0, Math.sin(a));
  const binAt = (a) => b0.clone().multiplyScalar(Math.cos(a)).addScaledVector(d0, -Math.sin(a));
  const at = (s) => B.clone().addScaledVector(d0, s);
  const mk = (P, a, s, shift, sc = US) => {
    const x = binAt(a), y = dirAt(a), z = new THREE.Vector3().crossVectors(x, y);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    const off = at(s + shift).sub(P);
    return { P: P.clone(), a, s, q, shift, off, rotDeg: a / D2R, y, sc };
  };
  const seg = {};
  seg.socket = mk(B, 0, 0, 0, 1);
  seg.scape = mk(at(S0), 0, S0, SH(0));
  const sC = S0 + US * (LS + EIN);
  const C = at(sC);
  seg.elbow = mk(C, AE / 2, sC, SH(1));
  const P = C.clone().addScaledVector(dirAt(AE), US * EOUT);
  let s = sC + US * EOUT;
  for (let k = 0; k < 6; k++) {
    const a = AE + k * DJ;
    seg['f' + (k + 1)] = mk(P, a, s, SH(2 + k));
    P.addScaledVector(dirAt(a), US * LF[k]);
    s += US * LF[k];
  }
  seg.tip = mk(P, AE + 6 * DJ, s, SH(8));
  _chain = { B, d0, b0, z0, seg, tipEnd: P.clone().addScaledVector(dirAt(AE + 6 * DJ), US * TIPL), length: s + US * TIPL };
  return _chain;
}

/* ------------------------------------------------------------------ small helpers */
const ringGeo = (rIn, rOut, y0, h, b = 0.02, seg = 48) =>
  revolve([[rIn, y0, b * 0.5], [rOut, y0, b], [rOut, y0 + h, b], [rIn, y0 + h, b * 0.5], [rIn, y0, 0]], { segments: seg, steps: 1 });
/** arc of a ring about +Y: lathe angle phi puts a point at (sin phi, y, cos phi); centre of the arc = angle c (rad) */
const arcGeo = (rIn, rOut, y0, h, c, span, b = 0.015) =>
  revolve([[rIn, y0, b * 0.5], [rOut, y0, b], [rOut, y0 + h, b], [rIn, y0 + h, b * 0.5], [rIn, y0, 0]], { segments: 24, steps: 2, phi0: c - span / 2, phi: span });
/** direction in the XZ plane of a point at angle psi measured from +Z toward +X */
const rad = (psi) => [Math.sin(psi), Math.cos(psi)];

/* ------------------------------------------------------------------ base socket */
export function buildSocket(part) {
  // chrome: plug that goes into the head bore + flange rim
  const chromePart = revolve([
    [0, -0.82], [0.50, -0.82, 0.05], [0.56, -0.74, 0.02], [0.56, -0.62], [0.505, -0.62], [0.505, -0.52], [0.56, -0.52],
    [0.56, 0.18], [0.99, 0.18, 0.03], [0.99, 0.46, 0.05], [0.80, 0.46, 0.02], [0.80, 0.34], [0, 0.34],
  ], { segments: 56, steps: 2 });
  part.add(chromePart, M.chrome);
  // black bellows boot with three ribs
  const prof = [[0, 0.38], [0.78, 0.38, 0.01], [0.78, 0.50, 0.04]];
  const n = 18;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const r = 0.78 - 0.20 * Math.pow(t, 0.85) + 0.045 * Math.max(0, Math.sin(t * Math.PI * 3.0 - 0.3)) * (1 - t * 0.35);
    prof.push([r, 0.50 + 0.35 * t]);
  }
  prof.push([0, 0.85]);
  part.add(revolve(prof, { segments: 48, steps: 2, creaseDeg: 50 }), antBody);
  // gold retaining ring where boot and scape meet + four small gold screws on the flange rim
  part.add(ringGeo(0.52, 0.65, 0.78, 0.08, 0.02, 44), M.gold);
  const sc = capScrew(0.055, 0.05, { seg: 12 });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + 0.4;
    part.add(sc, M.gold, mT(Math.sin(a) * 0.89, 0.46, Math.cos(a) * 0.89).multiply(mRy(a * 2)));
  }
}

/* ------------------------------------------------------------------ scape */
const scapeR = (y) => 0.47 - 0.026 * (y / LS);
export function buildScape(part) {
  // black tube with three shallow grooves
  const prof = [[0, 0.05], [scapeR(0.05) - 0.04, 0.05], [scapeR(0.2), 0.2, 0.03]];
  for (const yg of [1.3, 2.2, 3.1]) {
    const r = scapeR(yg);
    prof.push([r, yg - 0.06, 0.012], [r - 0.022, yg - 0.03], [r - 0.022, yg + 0.03], [r, yg + 0.06, 0.012]);
  }
  prof.push([scapeR(LS - 0.06), LS - 0.06, 0.02], [scapeR(LS) - 0.05, LS], [0, LS]);
  part.add(revolve(prof, { segments: 56, steps: 2 }), antBody);
  // milled grip band between the first and second groove
  part.add(knurl(scapeR(1.75) + 0.012, scapeR(1.75) - 0.06, 40, 1.47, 0.56, 0.026, 0), antBody);
  // chrome: base collar, split clamp with lugs and bolt, end flange
  part.add(ringGeo(0.44, 0.56, 0.0, 0.2, 0.03, 48), M.chrome);
  part.add(ringGeo(0.44, 0.545, LS - 0.70, 0.30, 0.025, 48), M.chrome);
  part.add(ringGeo(0.43, 0.55, LS - 0.12, 0.12, 0.02, 48), M.chrome);
  const lug = box(0.11, 0.30, 0.15, 0.02);
  for (const s of [-1, 1]) part.add(lug, M.chrome, mT(s * 0.068, LS - 0.55, 0.57));
  const bolt = capScrew(0.05, 0.045, { seg: 12 });
  part.add(bolt, M.chrome, mT(0.125, LS - 0.55, 0.57).multiply(mRz(-Math.PI / 2)));
  part.add(cyl(0.028, 0.26, { axis: 'x', segments: 10, bevel: 0.005, steps: 1 }), M.chrome, mT(0, LS - 0.55, 0.57));
  // gold: band after the first groove, thin stripe, plus a gold lock ring under the clamp
  part.add(ringGeo(0.455, 0.505, 0.62, 0.075, 0.015, 48), M.gold);
  part.add(ringGeo(scapeR(3.6) - 0.01, scapeR(3.6) + 0.03, 3.6, 0.05, 0.01, 48), M.gold);
  part.add(ringGeo(0.45, 0.50, LS - 0.80, 0.08, 0.015, 48), M.gold);
}

/* ------------------------------------------------------------------ elbow knuckle (bisector frame) */
export function buildElbow(part) {
  const h = AE / 2;
  // hinge drum (axis = local Z) with chrome cap + hex bolt on the outer side, gold washer on the inner side
  part.add(cyl(0.60, 1.0, { axis: 'z', bevel: 0.07, segments: 48 }), antBody);
  part.add(cyl(0.47, 0.07, { axis: 'z', y0: 0.5, bevel: 0.018, segments: 40 }), M.chrome);
  const nut = hexNut(0.16, 0.12);
  nut.rotateX(Math.PI / 2);
  part.add(nut, M.chrome, mT(0, 0, 0.62));
  part.add(ringGeo(0.19, 0.30, 0, 0.03, 0.008, 36).rotateX(Math.PI / 2), M.gold, mT(0, 0, 0.575));
  part.add(ringGeo(0.30, 0.52, 0, 0.05, 0.012, 44).rotateX(Math.PI / 2), M.gold, mT(0, 0, -0.55));
  part.add(cyl(0.22, 0.05, { axis: 'z', y0: -0.60, bevel: 0.015, segments: 40 }), M.chrome);
  // stubs toward the scape (rotated +h) and toward the first flagellum (rotated -h), each with a chrome clamp
  const inStub = cyl(0.41, 0.66, { y0: -0.66, bevel: 0.03, segments: 40 });
  part.add(inStub, antBody, mRz(h));
  part.add(ringGeo(0.38, 0.49, -0.50, 0.15, 0.025, 44), M.chrome, mRz(h));
  const outStub = cyl(0.395, 0.66, { y0: 0, bevel: 0.03, segments: 40 });
  part.add(outStub, antBody, mRz(-h));
  part.add(ringGeo(0.37, 0.475, 0.34, 0.15, 0.025, 44), M.chrome, mRz(-h));
}

/* ------------------------------------------------------------------ flagellum barrels */
export function buildFlagellum(part, k) {
  const r0 = RF[k], r1 = r0 * 0.94, L = LF[k];
  const prof = [
    [0, 0], [r0 * 0.82, 0, 0.012], [r0 * 0.82, 0.17], [r0 * 0.97, 0.23, 0.04], [r0, 0.36], [r1, L - 0.34], [r1, L - 0.26, 0.02],
    [r1 * 0.86, L - 0.22], [r1 * 0.86, L - 0.14], [r1 * 0.95, L - 0.10, 0.02], [r1 * 0.95, L - 0.04], [r1 * 0.80, L, 0.03], [0, L],
  ];
  part.add(revolve(prof, { segments: 40, steps: 2, creaseDeg: 45 }), antBody);
  // knurled gold collar at the start; a gold sensor-port ring on the outer side
  part.add(knurl(r0 + 0.036, r0 * 0.80, 28, -0.045, 0.12, 0.016, 0), M.gold);
  const ang = (-0.5 + k * 0.28) * 0.8;
  const n = V3(Math.sin(ang), 0, Math.cos(ang));
  const yP = L * 0.58;
  const rr = r0 + (r1 - r0) * 0.58;
  const ringP = torus(0.075, 0.02, { radial: 6, tubular: 20 });
  part.add(ringP, M.gold, placeMat(V3(n.x * (rr + 0.004), yP, n.z * (rr + 0.004)), n, 0).multiply(mRx(Math.PI / 2)));
  const pit = cyl(0.058, 0.02, { segments: 16, bevel: 0.004, steps: 1, y0: 0 });
  part.add(pit, antBody, placeMat(V3(n.x * (rr + 0.004), yP, n.z * (rr + 0.004)), n, 0));
  // index dots: segment k+1 carries k+1 small gold pips in a row around the barrel (macro detail, reads as part numbering)
  const yD = 0.50, rD = r0 + (r1 - r0) * ((yD - 0.36) / Math.max(L - 0.70, 0.5));
  const dot = bumpGeo(0.027, 0.014, 8);
  for (let d = 0; d <= k; d++) {
    const a = ang + 0.2 + (d - k / 2) * 0.17 + 0.5;
    const nd = V3(Math.sin(a), 0, Math.cos(a));
    part.add(dot, M.gold, placeMat(V3(nd.x * (rD - 0.003), yD, nd.z * (rD - 0.003)), nd, 0));
  }
}

/* ------------------------------------------------------------------ tip sensor */
export const tipGlow = new THREE.MeshPhysicalMaterial({
  name: 'antenna tip glow', color: new THREE.Color(0x1a0a00), emissive: new THREE.Color(0xffa418), emissiveIntensity: 1.55,
  roughness: 0.35, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04,
});
// lamp-like falloff: hot yellow-white where the window faces the viewer, deep orange toward the silhouette
tipGlow.onBeforeCompile = (sh) => {
  sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
    float tgF = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
    totalEmissiveRadiance = mix(totalEmissiveRadiance * 0.30, vec3(1.35, 0.40, 0.02), pow(tgF, 1.3));`);
};
tipGlow.customProgramCacheKey = () => 'apx9-optics-tipglow-2';
export function buildTip(part) {
  part.add(knurl(0.315, 0.22, 24, -0.04, 0.12, 0.016, 0), M.gold);
  // black sleeve that holds the window: seat, shoulder, small lip
  part.add(revolve([[0, 0.07], [0.235, 0.07, 0.01], [0.235, 0.15], [0.29, 0.19, 0.03], [0.29, 0.30, 0.02], [0.262, 0.35], [0.262, 0.39], [0, 0.39]], { segments: 44, steps: 2 }), antBody);
  // glowing amber window (glossy sheath over an emissive core) with two thin black ribs
  part.add(revolve([[0, 0.35], [0.232, 0.35, 0.01], [0.232, 0.96, 0.04], [0, 0.98]], { segments: 48, steps: 2, creaseDeg: 60 }), tipGlow);
  part.add(ringGeo(0.226, 0.246, 0.655, 0.022, 0.006, 36), antBody);
  // gold end cap with a small dark seat ring under it
  part.add(ringGeo(0.226, 0.268, 0.95, 0.04, 0.008, 36), antBody);
  part.add(revolve([[0.0, 0.98], [0.27, 0.98, 0.01], [0.27, 1.07, 0.05], [0.215, 1.18, 0.06], [0, 1.2]], { segments: 44, steps: 5, creaseDeg: 60 }), M.gold);
}

/* ------------------------------------------------------------------ chemical sensor (scape frame, clipped under the scape) */
export function buildChem(part) {
  const cx = 0.69, y0 = 2.35, len = 1.35;
  part.add(cyl(0.205, len, { y0, bevel: 0.05, segments: 40 }), M.brushed, mT(cx, 0, 0));
  // sintered pores
  const r = rng(5);
  const pore = bumpGeo(0.036, 0.016, 8);
  for (let i = 0; i < 74; i++) {
    const a = r() * TAU, y = y0 + 0.14 + r() * (len - 0.28);
    if (Math.abs(y - (y0 + 0.32)) < 0.07 || Math.abs(y - (y0 + len - 0.32)) < 0.07) continue;   // keep the clip bands clear
    const n = V3(Math.sin(a), 0, Math.cos(a));
    part.add(pore, M.black, placeMat(V3(cx + n.x * 0.2045, y, n.z * 0.2045), n, r() * TAU));
  }
  // platinum heater coil wound over the sintered body (metal-oxide gas sensors are held hot)
  {
    const yA = y0 + 0.5, yB = y0 + len - 0.5, rc = 0.2135, turns = 5, N = 60, pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = t * turns * TAU;
      pts.push(V3(cx + Math.sin(a) * rc, yA + (yB - yA) * t, Math.cos(a) * rc));
    }
    part.add(sweep(pts, { radius: 0.012, radial: 4, segments: 120 }), M.chrome);
  }
  // cartridge end cap (with its hex-socket plug screw) + clips around the cartridge and half-saddles around the scape
  part.add(cyl(0.21, 0.07, { y0: y0 + len, bevel: 0.025, segments: 40 }), M.chrome, mT(cx, 0, 0));
  part.add(capScrew(0.08, 0.04, { seg: 12 }), M.chrome, mT(cx, y0 + len + 0.07, 0));
  part.add(cyl(0.12, 0.10, { y0: y0 - 0.1, bevel: 0.02, segments: 28 }), M.chrome, mT(cx, 0, 0));
  for (const yc of [y0 + 0.32, y0 + len - 0.32]) {
    part.add(ringGeo(0.2, 0.28, yc - 0.07, 0.14, 0.02, 36), M.chrome, mT(cx, 0, 0));
    part.add(arcGeo(0.45, 0.545, yc - 0.07, 0.14, Math.PI / 2, 2.3), M.chrome);
    part.add(box(0.12, 0.14, 0.16, 0.02), M.chrome, mT(0.56, yc, 0.0));
  }
}

/* ------------------------------------------------------------------ airflow vane (scape frame, on top of the scape) */
/** closed loop along a polygon with chamfered corners (Catmull-Rom rounds them), for the rolled edge bead of the fin */
function beadPath(poly, c, z = 0) {
  const out = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const p = poly[i], a = poly[(i + n - 1) % n], q = poly[(i + 1) % n];
    const da = V3(a[0] - p[0], a[1] - p[1], 0), dq = V3(q[0] - p[0], q[1] - p[1], 0);
    const la = da.length(), lq = dq.length();
    const A = V3(p[0], p[1], z).addScaledVector(da, Math.min(c, la * 0.4) / la);
    const B = V3(p[0], p[1], z).addScaledVector(dq, Math.min(c, lq * 0.4) / lq);
    out.push(A, B, V3((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, z));   // corner entry / exit, then the edge midpoint
  }
  return out;
}
export function buildVane(part) {
  const yc = 2.75;
  // saddle clamp (top half of the scape) with two ears and screws, stalk with ferrule collars
  part.add(arcGeo(0.46, 0.55, yc - 0.12, 0.24, -Math.PI / 2, 2.4), M.chrome);
  const pip = cyl(0.04, 0.03, { segments: 10, bevel: 0.008, steps: 1, y0: 0 });         // rivet / screw head, base at y = 0
  for (const sz of [-1, 1]) {
    part.add(box(0.12, 0.24, 0.07, 0.015), M.chrome, mT(-0.19, yc, sz * 0.545));
    part.add(pip, M.chrome, mT(-0.19, yc, sz * 0.58).multiply(mRx(sz * Math.PI / 2)));
  }
  part.add(cyl(0.05, 0.62, { axis: 'x', segments: 14, bevel: 0.012, steps: 1 }), M.chrome, mT(-0.76, yc, 0));
  part.add(cyl(0.085, 0.07, { axis: 'x', segments: 18, bevel: 0.02, steps: 1 }), M.chrome, mT(-0.52, yc, 0));
  part.add(cyl(0.068, 0.05, { axis: 'x', segments: 14, bevel: 0.012, steps: 1 }), M.chrome, mT(-0.70, yc, 0));
  part.add(cyl(0.068, 0.05, { axis: 'x', segments: 14, bevel: 0.012, steps: 1 }), M.chrome, mT(-0.96, yc, 0));
  // the fin: swept blade in the XY plane (shape x = local X, up is negative; shape y = along the axis), two lightening slots
  const hgt = (b, hh, r = 0.03) => [-1.08 - hh, yc + b, r];
  const pts = [hgt(1.05, 0.12), hgt(0.55, 0.0), hgt(-0.30, 0.0), hgt(-0.70, 0.62), hgt(-0.38, 0.62), hgt(0.05, 0.34), hgt(0.52, 0.24)];
  const hole = circleHole(0.045, -1.08 - 0.10, yc + 0.0);
  const slot = (cx, cy, w, h) => rectPts(w, h, Math.min(w, h) * 0.45).map((q) => [q[0] + cx, q[1] + cy, q[2]]);
  const fin = plate(pts, 0.04, { center: true, bevel: 0.012, holes: [hole, slot(-1.205, yc + 0.32, 0.09, 0.30), slot(-1.55, yc - 0.50, 0.16, 0.07)], steps: 2 });
  part.add(fin, vaneMat);
  // rolled edge bead (titanium) and rivets along the root edge
  part.add(sweep(beadPath(pts, 0.07), { radius: 0.019, radial: 5, closed: true, segments: 38 }), vaneMat);
  const rv = cyl(0.028, 0.02, { segments: 10, bevel: 0.007, steps: 1, y0: 0 });
  for (const b of [-0.16, 0.40]) {
    part.add(rv, M.chrome, mT(-1.145, yc + b, 0.02).multiply(mRx(Math.PI / 2)));
    part.add(rv, M.chrome, mT(-1.145, yc + b, -0.02).multiply(mRx(-Math.PI / 2)));
  }
  // pivot pin through the fin with domed heads on both faces
  part.add(cyl(0.03, 0.12, { axis: 'z', segments: 10, bevel: 0 }), M.chrome, mT(-1.18, yc, 0));
  part.add(cyl(0.062, 0.03, { axis: 'z', segments: 14, bevel: 0.01, steps: 1 }), M.chrome, mT(-1.18, yc, 0.05));
  part.add(cyl(0.062, 0.03, { axis: 'z', segments: 14, bevel: 0.01, steps: 1 }), M.chrome, mT(-1.18, yc, -0.05));
  // counterweight: rod, lock nut and ball
  part.add(cyl(0.012, 0.50, { segments: 8, bevel: 0 }), M.chrome, mT(-1.08, yc + 0.80, 0));
  part.add(cyl(0.05, 0.05, { segments: 6, bevel: 0.008, steps: 1 }), M.chrome, mT(-1.08, yc + 0.875, 0));
  part.add(sphere(0.07, { segments: 14, rings: 10 }), M.chrome, mT(-1.06, yc + 1.08, 0));
}

/* ------------------------------------------------------------------ wiring (scape frame): twisted 3-core lead with partial clips */
export function buildWiring(part) {
  const psiC = 0.05;           // bundle on the outer (+Z) side
  const e = 0.047;             // core offset from the bundle axis
  const y0 = -0.10, y1 = LS - 0.52;
  const turns = (y1 - y0) / 1.5;
  const mats = [M.copper, M.anodizedBlue, M.rubber];
  const n = Math.round(turns * 12) + 2;
  const [sx, cz] = rad(psiC);
  for (let w = 0; w < 3; w++) {
    const path = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, y = y0 + (y1 - y0) * t;
      const rc = scapeR(Math.max(y, 0)) + 0.094;
      const th = (w / 3) * TAU + t * turns * TAU;
      // bundle centre + twisted offset (radial / tangential)
      const rr = rc + e * Math.cos(th), tt = e * Math.sin(th);
      path.push(V3(sx * rr + cz * tt, y, cz * rr - sx * tt));
    }
    part.add(sweep(path, { radius: 0.04, radial: S(7, 5), segments: S(n * 3, 40) }), mats[w]);
  }
  // rubber P-clips: a moulded loop around the three-core bundle and a thin strap that follows the scape surface,
  // riveted (copper) at both strap ends
  const rv = cyl(0.036, 0.03, { segments: 10, bevel: 0.008, steps: 1, y0: 0 });
  for (const yc of [0.55, 1.75, 2.95]) {
    const R = scapeR(yc), rcc = R + 0.094;
    part.add(ringGeo(0.092, 0.145, yc - 0.06, 0.12, 0.022, 24), M.rubber, mT(sx * rcc, 0, cz * rcc));
    part.add(arcGeo(R - 0.004, R + 0.046, yc - 0.06, 0.12, psiC, 2.5, 0.014), M.rubber);
    for (const sg of [-1, 1]) {
      const [ex_, ez_] = rad(psiC + sg * 1.12);
      part.add(rv, M.copper, placeMat(V3(ex_ * (R + 0.044), yc, ez_ * (R + 0.044)), V3(ex_, 0, ez_), 0));
    }
  }
  // terminal ferrules at the elbow end
  const fer = cyl(0.05, 0.22, { segments: 10, bevel: 0.012, steps: 1, y0: y1 - 0.12 });
  for (let w = 0; w < 3; w++) {
    const th = (w / 3) * TAU + turns * TAU;
    const rr = scapeR(y1) + 0.094 + e * Math.cos(th), tt = e * Math.sin(th);
    part.add(fer, M.copper, mT(sx * rr + cz * tt, 0, cz * rr - sx * tt));
  }
}

/* ------------------------------------------------------------------ assembly */
export function buildAntenna(bee) {
  const C = antennaChain();
  const sg = C.seg;
  const root = bee.part('antenna-r', {
    name: 'Right Antenna Module', group: 'antenna',
    info: 'Articulated tactile antenna: socket, scape, elbow knuckle, six flagellum barrels and an amber tip sensor, with a side chemical cartridge, airflow vane and signal wiring.',
    specs: { Material: 'Black-anodised aluminium, gold-plated collars, chrome joints', Mass: '0.125 g', Function: 'Tactile, airflow and chemical sensing' },
    explode: ex([18, 8, 8], 'top'),
  });
  const mid = (v, rotDeg = 0) => ex(v.toArray ? v.toArray() : v, 'mid', rotDeg ? [0, 0, rotDeg] : null);
  const make = (id, name, info, specs, s, builder, offset, rotDeg = 0, group = 'antenna') => {
    const p = root.part(id, { name, group, info, specs, pos: s.P.toArray(), quat: s.q, scale: s.sc, explode: mid(offset, rotDeg) });
    builder(p);
    return p;
  };
  make('base-socket', 'Base Socket',
    'Chrome plug and black bellows boot that seat the antenna in the head bore, locked by a gold retaining ring and four small flange screws.',
    { Material: 'Chrome-plated brass, black elastomer boot, gold ring', Mass: '0.02 g', Dimensions: '2.0 mm dia x 1.7 mm' },
    sg.socket, buildSocket, sg.socket.off, 0);
  make('scape', 'Scape',
    'Long black tube that carries the antenna out of the socket; chrome collars, a gold band and a bolted split clamp mark its length.',
    { Material: 'Black-anodised aluminium, chrome collars', Mass: '0.03 g', Dimensions: `${mmS(0.94, 1)} mm dia x ${mmS(LS, 1)} mm` },
    sg.scape, buildScape, sg.scape.off, 0);
  make('elbow-joint', 'Elbow Joint',
    'Hinge knuckle that lets the antenna droop; a chrome side cap with a hex bolt and a gold washer hold the pivot.',
    { Material: 'Black-anodised aluminium, chrome cap, gold washer', Mass: '0.01 g', Function: 'Single-axis hinge, 30 degree bend' },
    sg.elbow, buildElbow, sg.elbow.off, sg.elbow.rotDeg);
  for (let k = 0; k < 6; k++) {
    make(`flagellum-${k + 1}`, `Flagellum Segment ${k + 1}`,
      `Tapered black barrel ${k + 1} of 6 with a knurled gold collar and a sensor port; the chain curves progressively downward.`,
      { Material: 'Black-anodised aluminium, gold collar', Mass: '0.006 g', Dimensions: `${mmS(RF[k] * 2)} mm dia x ${mmS(LF[k])} mm` },
      sg['f' + (k + 1)], (p) => buildFlagellum(p, k), sg['f' + (k + 1)].off, sg['f' + (k + 1)].rotDeg);
  }
  make('tip-sensor', 'Tip Sensor',
    'Gold-capped sensor head with a long glowing amber window at the end of the flagellum; reads touch and light.',
    { Material: 'Black-anodised aluminium, gold cap, amber LED window', Mass: '0.004 g', Dimensions: `${mmS(0.6, 1)} mm dia x ${mmS(TIPL, 1)} mm` },
    sg.tip, buildTip, sg.tip.off, sg.tip.rotDeg);
  // parts in the scape frame: they ride with the scape, then separate sideways (chemical: down, vane: up, wiring: outward)
  const shift = C.d0.clone().multiplyScalar(sg.scape.shift);
  make('chemical-sensor', 'Chemical Sensor',
    'Porous sintered cartridge clipped under the scape; its pores sample airborne chemicals for the neural processor.',
    { Material: 'Sintered steel, chrome clips', Mass: '0.01 g', Dimensions: `${mmS(0.4, 1)} mm dia x ${mmS(1.4, 1)} mm` },
    sg.scape, buildChem, shift.clone().addScaledVector(C.b0, 1.3), 0);
  make('airflow-vane', 'Airflow Vane',
    'Tiny titanium vane on a chrome stalk that feels the direction of the air-flow; a saddle clamp holds it on top of the scape.',
    { Material: 'Titanium fin, chrome stalk', Mass: '0.004 g', Dimensions: `${mmS(1.7, 1)} mm x ${mmS(0.8, 1)} mm` },
    sg.scape, buildVane, shift.clone().addScaledVector(C.b0, -1.3), 0);
  make('wiring', 'Antenna Wiring',
    'Three-core twisted lead in copper, blue and black insulation, held along the scape by three rubber clips.',
    { Material: 'Copper cores, silicone insulation', Mass: '0.005 g', Dimensions: `${mmS(0.12, 2)} mm cores x ${mmS(3.7, 1)} mm` },
    sg.scape, buildWiring, shift.clone().addScaledVector(C.z0, 1.2), 0);
  bee.mirror(root);
}
