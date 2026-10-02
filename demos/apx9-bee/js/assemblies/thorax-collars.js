// Thorax: wing-root collars (chrome sleeve + knurled bezel + stepped flange) and the yellow C-bracket aperture rims.
// Right side only; the left hand parts are mirrors made at the end of build().
import { THREE, V3, M, ex, revolve } from '../kit.js';
import { ROOT, SPAN, LEAD, WNORM, D2R, clamp, smooth, hubRing, wingAxisFrame, placeUp, hubSurface } from './thorax-common.js';

const TAU = Math.PI * 2;
const wrapPi = (a) => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };

/** Outer radius of the stepped chrome flange (cam shaped: small towards the dorsal valley, large outboard). az 90 = valley side. */
export const flangeRho = (az) => 2.6 + 0.14 * (0.5 + 0.5 * Math.cos(az - 1.5 * Math.PI));
/** Yellow C-bracket arc (centred outboard, az 270). */
export const BR_HALF = 128 * D2R;
export const bracketOuter = (az) => {
  const d = Math.abs(wrapPi(az - 1.5 * Math.PI));
  if (d >= BR_HALF) return 0;
  const t = 1 - d / BR_HALF;
  return flangeRho(az) + 0.34 * smooth(0, 0.5, t);
};
/** Radius that plates / fur must stay clear of at azimuth az. */
export const collarClear = (az) => Math.max(flangeRho(az) + 0.12, bracketOuter(az) + 0.08) * 0.65;
/** The collar's tallest surface (rim top) along the span axis. */
export const RIM_S = 0.62;

function sleeveGeo() {
  // profile in (r, s) about the span axis; closed loop so the bore is a surface too
  const P = [
    [2.27, -1.5], [2.58, -1.5, 0.03], [2.58, -0.46, 0.03], [2.5, -0.46], [2.5, -0.38], [2.58, -0.38, 0.02],
    [2.58, -0.02, 0.04], [2.5, -0.02], [2.5, 0.1], [2.27, 0.1],
  ];
  return revolve(P.concat([[2.27, -1.5]]), { segments: 72, steps: 3 });
}
function bezelGeo() {
  // knurled bezel ring on top of the sleeve with a raised inner lip
  const P = [
    [2.3, 0.1], [2.74, 0.1, 0.03], [2.74, 0.42, 0.06], [2.62, 0.5, 0.04], [2.46, 0.5], [2.4, 0.62, 0.025], [2.3, 0.62, 0.02], [2.3, 0.1],
  ];
  return revolve(P, { segments: 96, steps: 3 });
}

export function buildCollars(W) {
  const { armor, fx, mirrors } = W;
  const col = armor.part('wing-collar-r', {
    name: 'Wing Collar Right', group: 'thorax-armor', tag: 'shell',
    info: 'Chrome aperture collar around the right wing root: bore for the flight motor, knurled bezel, stepped flange and bayonet lugs.',
    specs: { Material: 'Polished chrome-moly steel, knurled bezel', Aperture: 'R 1.56 mm', Mass: '0.06 g' },
    explode: ex([-1.8, 5.0, 3.9], 'mid'),            // along the wing axis (outward and up)
  });
  const A = wingAxisFrame(0);
  col.add(sleeveGeo(), M.chrome, A);
  col.add(bezelGeo(), M.knurled, A);

  // stepped flange: chrome, follows the armour surface
  const flange = hubRing({
    side: 1, naz: 120, width: (az) => [2.5, flangeRho(az)],
    profile: [[0, 0.02], [0.05, 0.13], [0.34, 0.13], [0.4, 0.2], [0.58, 0.2], [0.64, 0.13], [0.88, 0.1], [0.96, 0.04], [1, 0.0]],
    lift: 0.0,
  });
  col.add(flange, M.chrome);
  // black groove inlay in the flange
  const groove = hubRing({ side: 1, naz: 120, width: (az) => [2.5 + (flangeRho(az) - 2.5) * 0.4, 2.5 + (flangeRho(az) - 2.5) * 0.56], profile: [[0, 0.205], [1, 0.205]], lift: 0.0 });
  col.add(groove, M.black);

  // black hex-socket screws on the flange and on the bezel lip
  const nF = 18;
  for (let i = 0; i < nF; i++) {
    const az = (i + 0.5) / nF * TAU;
    const r0 = 2.5 + (flangeRho(az) - 2.5) * 0.78;
    const sf = hubSurface(r0, az, 1, 1);
    if (!sf) continue;
    col.add(fx.screwXS, M.black, placeUp(sf.p.clone().addScaledVector(sf.n, 0.11), sf.n, i * 37, 1));
  }
  const nB = 12;
  for (let i = 0; i < nB; i++) {
    const az = (i + 0.25) / nB * TAU;
    const u = LEAD.clone().multiplyScalar(Math.cos(az)).addScaledVector(WNORM, Math.sin(az));
    const p = ROOT.clone().addScaledVector(u, 2.53).addScaledVector(SPAN, 0.5);
    col.add(fx.screwS, M.black, placeUp(p, SPAN, i * 29, 1));
  }
  // bayonet lugs under the bezel
  const lug = revolve([[2.5, -0.3], [2.66, -0.3, 0.02], [2.66, -0.12, 0.02], [2.5, -0.12]].concat([[2.5, -0.3]]), { segments: 10, phi: 0.34, steps: 2 });
  for (let k = 0; k < 3; k++) col.add(lug, M.chrome, new THREE.Matrix4().multiply(A).multiply(new THREE.Matrix4().makeRotationY((k * 120 + 20) * D2R)));

  /* ----------------------------------------------------------- aperture rim: yellow C bracket + seal */
  const rim = armor.part('aperture-rim-r', {
    name: 'Aperture Rim Right', group: 'thorax-armor', tag: 'shell',
    info: 'Yellow C-bracket and black seal ring that frame the right wing aperture and tie the collar into the dorsal armour.',
    specs: { Material: 'Yellow composite bracket, EPDM seal', Mass: '0.04 g' },
    explode: ex([-0.6, 3.0, 2.3], 'mid'),
  });
  const a0 = 1.5 * Math.PI - BR_HALF, a1 = 1.5 * Math.PI + BR_HALF;
  const brk = hubRing({
    side: 1, az0: a0, az1: a1, naz: 90, closed: false,
    width: (az) => { const d = Math.abs(wrapPi(az - 1.5 * Math.PI)); const t = 1 - d / BR_HALF; const k = smooth(0, 0.3, t); return [flangeRho(az) - 0.1 * k, flangeRho(az) - 0.1 * k + (bracketOuter(az) - flangeRho(az) + 0.1) * Math.max(k, 0.02)]; },
    profile: [[0, 0.17], [0.1, 0.34], [0.3, 0.46], [0.62, 0.34], [0.86, 0.14], [1, 0.0]],
    lift: 0.0,
  });
  rim.add(brk, M.yellow);
  // under-face of the bracket (black) so it reads as a bent plate, not a sheet
  const under = hubRing({
    side: 1, az0: a0 + 0.02, az1: a1 - 0.02, naz: 90, closed: false,
    width: (az) => { const d = Math.abs(wrapPi(az - 1.5 * Math.PI)); const t = 1 - d / BR_HALF; const k = smooth(0, 0.3, t); return [flangeRho(az) - 0.1 * k, flangeRho(az) - 0.1 * k + (bracketOuter(az) - flangeRho(az) + 0.1) * Math.max(k, 0.02)]; },
    profile: [[0, 0.17], [0.1, 0.3], [0.3, 0.4], [0.62, 0.28], [0.86, 0.1], [1, 0.0]], lift: -0.012, flip: true,
  });
  rim.add(under, M.black);
  // black seal ring round the whole flange
  const seal = hubRing({ side: 1, naz: 120, width: (az) => [flangeRho(az) - 0.02, flangeRho(az) + 0.17], profile: [[0, 0.0], [0.15, 0.07], [0.5, 0.1], [0.85, 0.07], [1, 0.0]], lift: 0.0 });
  rim.add(seal, M.black);
  // chrome rivets along the bracket
  const nR = 11;
  for (let i = 0; i < nR; i++) {
    const t = (i + 0.5) / nR;
    const az = a0 + (a1 - a0) * t;
    const d = Math.abs(wrapPi(az - 1.5 * Math.PI));
    const k = 1 - d / BR_HALF;
    if (k < 0.22) continue;
    const rho = flangeRho(az) + (bracketOuter(az) - flangeRho(az)) * 0.3;
    const sf = hubSurface(rho, az, 1, 1);
    if (!sf) continue;
    rim.add(fx.rivetM, M.chrome, placeUp(sf.p.clone().addScaledVector(sf.n, 0.43 * smooth(0, 0.5, k) + 0.12), sf.n, 0, 1));
  }
  // Keep the circular wing-root fitting proportional to the compound eye.
  // Scale radial dimensions in its own frame while preserving the hinge axis.
  const basis = wingAxisFrame(0);
  const compact = basis.clone().multiply(new THREE.Matrix4().makeScale(.65,1,.65)).multiply(basis.clone().invert());
  for(const part of [col,rim]) for(const list of part.queue.values()) for(const geo of list) geo.applyMatrix4(compact);
  mirrors.push(col, rim);
  return { col, rim };
}
