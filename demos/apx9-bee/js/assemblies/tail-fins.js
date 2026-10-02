// Control-fin collar: four chamfered arc housings (stepped aft face, yellow inlay, chrome cap screws) on the aft rim of the cowl,
// each carrying a streamlined servo fairing with a chrome cuff and a swept, tapered airfoil trim vane (chrome leading-edge strip,
// yellow tip band). Abdomen-local frame; the collar axis is the abdomen axis, x = -a.
import { M, ex, V3, D2R } from '../kit.js';
import { sweepFrames, arcFrames, poly, hexBolt, placeM, clamp } from './tail-common.js';

export const FIN_A = 11.29;                       // collar centre plane (distance behind the petiole)
const FINS = [
  { deg: 0, half: 23, screws: [14] },
  { deg: 90, half: 33, screws: [11, 24.5] },
  { deg: 180, half: 23, screws: [14] },
  { deg: 270, half: 33, screws: [11, 24.5] },
];
const R_C = 1.79, HH = 0.13, HR = 0.17;           // housing: centre radius, half axial width, half radial height

// housing section [side = forward, up = radial]: chamfered corners and a stepped aft face (raised outer land, recessed inner land)
const HOUSING = poly([
  [-0.10, -HR, 0.01], [0.085, -HR, 0.01], [HH, -0.125, 0.01], [HH, 0.125, 0.01], [0.085, HR, 0.01], [-0.085, HR, 0.01],
  [-HH, 0.125, 0.01], [-HH, 0.0, 0.008], [-0.10, -0.03, 0.008],
], 2);
const INLAY = poly([[-0.036, HR - 0.004, 0.003], [0.036, HR - 0.004, 0.003], [0.036, HR + 0.0105, 0.004], [-0.036, HR + 0.0105, 0.004]], 1);

/** NACA four-digit-style outline of unit chord, origin at mid-chord: [[aft, thickness]...] (aft is the profile's side axis). */
function airfoil(tc, n = 10) {
  const yt = (x) => 5 * tc * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4) + 0.0015 * x;
  const upper = [], lower = [];
  for (let i = 0; i <= n; i++) {
    const x = 0.5 * (1 - Math.cos((Math.PI * i) / n));
    upper.push([x - 0.5, yt(x)]);
    if (i > 0) lower.push([x - 0.5, -yt(x)]);
  }
  return [...upper, ...lower.reverse()];
}
const VANE_P = airfoil(0.12), BAND_P = airfoil(0.145), FAIR_P = airfoil(0.42, 12), CUFF_P = airfoil(0.46, 12);
// chrome leading-edge strip: the forward 17 % of the section, standing 0.005 mm proud and tapering flush into the surface
const STRIP_P = (() => {
  const yt = (x) => 5 * 0.12 * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4) + 0.0015 * x;
  const xs = [0, 0.008, 0.02, 0.04, 0.07, 0.11, 0.17], up = [], lo = [];
  xs.forEach((x, i) => {
    const w = 1 - x / 0.17, y = yt(x) * (1 + 0.09 * w) + 0.0075 * w, xx = x - 0.5 - 0.007 * w;
    up.push([xx, y]);
    if (i > 0) lo.push([xx, -y]);
  });
  return [...up, ...lo.reverse()];
})();

/** Vane planform: root chord 0.50 mm swept back to a 0.32 mm tip (straight trailing edge); LE position is measured aft of the collar centre plane. */
const V_R0 = 1.98, V_R1 = 2.095, V_R2 = 2.74;     // root buried in the fairing / fairing top / tip
const vaneAt = (r) => {
  const u = clamp((r - V_R1) / (V_R2 - V_R1), 0, 1);
  return { le: -0.08 + 0.18 * u, chord: 0.5 - 0.18 * u };
};

function frameAt(phi, r, le, chord, k = chord, h = k) {
  const cs = Math.cos(phi), sn = Math.sin(phi);
  return { p: V3(-(FIN_A + le + 0.5 * chord), r * cs, r * sn), n: V3(0, -sn, cs), t: V3(0, cs, sn), k, h };
}

export function buildFins(stab) {
  const fins = stab.part('control-fins', {
    name: 'Control Fin Collar',
    info: 'Aft collar of four chamfered black arc housings with yellow inlay and chrome cap screws; each carries a streamlined servo fairing and a swept airfoil trim vane with a chrome leading edge and a yellow tip band that tilts to trim yaw and pitch.',
    specs: { Material: 'Black anodised housings, fairings and vanes; chrome screws, cuffs and edge strips; yellow tip bands', Mass: '0.012 g', Function: 'Aerodynamic trim vanes', Dimensions: '3.6 mm collar diameter, 5.5 mm across the vane tips, 0.65 mm vane span' },
    explode: ex([-4.5, 0, 0], 'mid', null, 'local'),
  });
  const c = V3(-FIN_A, 0, 0), u = V3(0, 1, 0), w = V3(1, 0, 0);
  const bolt = hexBolt(0.042, 0.04, 10), bolts = [];
  for (const f of FINS) {
    const phi = f.deg * D2R;
    const a0 = (f.deg - f.half) * D2R, a1 = (f.deg + f.half) * D2R, n = Math.max(6, Math.ceil(f.half / 2.2));
    // arc housing, yellow inlay along its outer face, cap screws on the raised aft land
    fins.add(sweepFrames(arcFrames(c, u, w, R_C, a0, a1, n), HOUSING, { creaseDeg: 35 }), M.black);
    fins.add(sweepFrames(arcFrames(c, u, w, R_C, a0 + 2.2 * D2R, a1 - 2.2 * D2R, n), INLAY, { creaseDeg: 50 }), M.yellow);
    for (const d of f.screws) for (const sg of [-1, 1]) {
      const a = (f.deg + sg * d) * D2R;
      bolts.push(placeM(V3(-(FIN_A + HH) + 0.003, (R_C + 0.06) * Math.cos(a), (R_C + 0.06) * Math.sin(a)), V3(-1, 0, 0)));
    }
    // servo fairing (a thick teardrop) with a chrome cuff, then the vane
    const fair = [1.93, 2.062].map((r) => frameAt(phi, r, -0.11, 0.54));
    fins.add(sweepFrames(fair, FAIR_P, { creaseDeg: 50 }), M.black);
    const cuff = [2.058, 2.098].map((r) => frameAt(phi, r, -0.113, 0.546));
    fins.add(sweepFrames(cuff, CUFF_P, { creaseDeg: 50 }), M.chrome);
    const rs = [V_R0, V_R1, 2.2, 2.35, 2.5, 2.62, V_R2];
    const vane = rs.map((r) => { const q = vaneAt(r); return frameAt(phi, r, q.le, q.chord); });
    fins.add(sweepFrames(vane, VANE_P, { creaseDeg: 50 }), M.black);
    const strip = [2.1, 2.2, 2.35, 2.5, 2.62].map((r) => { const q = vaneAt(r); return frameAt(phi, r, q.le, q.chord); });
    fins.add(sweepFrames(strip, STRIP_P, { creaseDeg: 50 }), M.chrome);
    const band = [2.62, 2.68, V_R2 + 0.004].map((r) => { const q = vaneAt(Math.min(r, V_R2)); return frameAt(phi, r, q.le, q.chord); });
    fins.add(sweepFrames(band, BAND_P, { creaseDeg: 50 }), M.yellow);
  }
  fins.addMany(bolt, M.chrome, bolts);
  return fins;
}

