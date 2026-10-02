// Stinger / probe unit: the cluster leaves live in tail-probe.js (root mount, ball joint, valve, ampoule, scanner head, hinge
// ring); this file holds the 7-segment telescoping sheath, tip knuckle, needle and sampling tube and assembles the unit.
// Every leaf is modelled about +Y = the stinger axis (y = distance s from the a = 9 ring centre) and carries stingerFrame(0);
// explode offsets are expressed in the abdomen-local frame along the axis (space 'local').
import { M, V3, ex, cyl, emissive, metal } from '../kit.js';
import { stingerFrame, AXD, AXX, SLEN, lathe, sweepFrames, poly } from './tail-common.js';
import { rootMount, joint1, valve, ampoule, scannerHead, joint2 } from './tail-probe.js';

const SF = stingerFrame(0);
const SAMPLE = emissive('#9dffb0', 1.0);
// polished black-chrome cone shell: dark metal with a mirror clearcoat, so every facet picks up its own slice of the studio
const CONE = metal('#463f3b', 0.17, { clearcoat: 1, clearcoatRoughness: 0.03 });
CONE.name = 'black chrome';

// distance s along the axis -> abdomen-local explode vector (+ optional lift along the frame +X)
const along = (d, lift = 0) => [AXD.x * d + AXX.x * lift, AXD.y * d + AXX.y * lift, AXD.z * d];
const exa = (d, level = 'mid', lift = 0) => ex(along(d, lift), level, null, 'local');

// sheath: seven telescoping sections from s = 2.38 (r 0.345) to s = 4.30 (r 0.085); the cone is a 24-sided fluted cone
// with a dorsal arris (a vertex of the lathe lies on +X) that carries the gold ridge line
export const SH_B = [2.38, 2.73, 3.06, 3.37, 3.66, 3.92, 4.14, 4.30];
const R_A = 0.345, R_B = 0.085, NF = 24;
export const rS = (s) => R_A + ((R_B - R_A) * (s - SH_B[0])) / (SH_B[7] - SH_B[0]);
const WALL = 0.03, CH = 0.007, SPIG_W = 0.02, SPIG_L = 0.44;
const RIDGE = poly([[-0.062, -0.014], [0.062, -0.014], [0.05, 0.008], [0.03, 0.019], [-0.03, 0.019], [-0.05, 0.008]], 1);
const FACET = { segments: NF, steps: 1, creaseDeg: 11 };

/* ------------------------------------------------------------------ sheath section k (0-based) */
function sheathSeg(p, k) {
  const sa = SH_B[k], sb = SH_B[k + 1], ra = rS(sa), rb = rS(sb);
  // glossy black thin-wall faceted cone, hairline chamfered seam at both ends
  p.add(lathe([[ra - WALL, sa], [ra - CH, sa], [ra, sa + CH], [rb, sb - CH], [rb - CH, sb], [rb - WALL, sb], [ra - WALL, sa]], FACET), CONE);
  // from the second section on: a polished faceted spigot that slides into the previous section
  const L = Math.min(SPIG_L, sa - 2.43);
  if (L > 0.05) {
    const rho = ra - WALL - 0.002;
    p.add(lathe([[rho - SPIG_W, sa - L], [rho, sa - L], [rho, sa + 0.04], [rho - SPIG_W, sa + 0.04], [rho - SPIG_W, sa - L]], FACET), M.chrome);
  }
  // gold ridge line along the dorsal arris (continuous across the seams, tapering with the cone)
  const slope = (rb - ra) / (sb - sa), nn = V3(1, -slope, 0).normalize(), tt = V3(slope, 1, 0).normalize(), fr = [];
  for (let i = 0; i <= 5; i++) {
    const s = sa + ((sb - sa) * i) / 5, f = (rS(s) - R_B) / (R_A - R_B);
    fr.push({ p: V3(rS(s) - 0.004, s, 0), n: nn, t: tt, k: 0.2 + 0.8 * f, h: 0.5 + 0.5 * f });
  }
  p.add(sweepFrames(fr, RIDGE, { creaseDeg: 50 }), M.gold);
}

/* ------------------------------------------------------------------ joint-3: two-band tip knuckle with a needle guide */
function joint3(p) {
  const s0 = SH_B[7];
  p.add(lathe([[0.04, s0], [0.108, s0, 0.01], [0.108, s0 + 0.08, 0.01], [0.04, s0 + 0.08], [0.04, s0]], { segments: 40 }), M.gold);
  p.add(lathe([[0.038, s0 + 0.08], [0.074, s0 + 0.08], [0.074, s0 + 0.112], [0.038, s0 + 0.112], [0.038, s0 + 0.08]], { segments: 32, steps: 1 }), M.gunmetalDark);
  p.add(lathe([[0.038, s0 + 0.112], [0.094, s0 + 0.112, 0.009], [0.08, s0 + 0.18, 0.009], [0.038, s0 + 0.18], [0.038, s0 + 0.112]], { segments: 40 }), M.gold);
  p.add(lathe([[0.036, s0 + 0.18], [0.062, s0 + 0.18, 0.007], [0.046, s0 + 0.25, 0.007], [0.036, s0 + 0.25], [0.036, s0 + 0.18]], { segments: 28 }), M.gunmetalDark);
}

/* ------------------------------------------------------------------ needle and sampling tube */
function needle(p) {
  const r = 0.026, y0 = 1.86;
  p.add(lathe([[0, 1.9], [r, 1.9, 0.004], [r, SLEN - 0.16], [0.005, SLEN], [0, SLEN]], { segments: 14, steps: 1 }), M.steel);
  p.add(cyl(0.075, 0.1, { bevel: 0.02, segments: 24, y0 }), M.chrome);
  p.add(cyl(0.05, 0.12, { bevel: 0.01, segments: 16, y0: y0 + 0.1 }), M.chrome);
}
function samplingTube(p) {
  const y0 = 1.95, y1 = 4.2;
  p.add(lathe([[0.034, y0], [0.046, y0, 0.005], [0.046, y1, 0.005], [0.034, y1], [0.034, y0]], { segments: 20, steps: 1 }), M.glass);
  p.add(cyl(0.029, 0.95, { bevel: 0.008, segments: 14, y0: 2.8 }), SAMPLE);
}

/* ------------------------------------------------------------------ assembly */
export function buildStinger(stinger) {
  const mk = (id, o) => stinger.part(id, { matrix: SF, ...o });

  rootMount(mk('root-mount', {
    name: 'Stinger Root Mount',
    info: 'Machined gunmetal flange with eight gussets and a black clamp crown that bolt the probe unit to the abdomen shaft and carry the first ball joint.',
    specs: { Material: 'Gunmetal flange, black anodised clamp, hard-chrome bolts', Mass: '0.04 g', Function: 'Structural interface to the abdomen', Dimensions: '1.3 mm flange, 0.55 mm deep' },
  }));

  joint1(mk('joint-1', {
    name: 'Ball Joint Knuckle', explode: exa(0.9),
    info: 'Hard-chrome ball held by six black claws on a gold shaft; lets the whole probe aim a few degrees off the abdomen axis.',
    specs: { Material: 'Chrome ball, black claw housing, gold shaft', Mass: '0.03 g', Function: 'Probe aiming joint', Dimensions: '0.6 mm ball' },
  }));

  valve(mk('valve', {
    name: 'Flow Valve', explode: exa(1.8),
    info: 'Metering valve in a gold cage with a starboard thumb lever and a port hose barb that gate the sample and injection lines.',
    specs: { Material: 'Black valve body, gold cage, chrome fittings', Mass: '0.03 g', Function: 'Sample and injection flow control' },
  }));

  scannerHead(mk('scanner-head', {
    name: 'Plant Scanner Head', explode: exa(2.4, 'mid', 2.6),
    info: 'Compact spectral scanner on the dorsal side: a coated lens ringed by a cyan light, cooling fins and a status bar that reads plant health before the probe touches down.',
    specs: { Material: 'Black composite housing, coated glass lens, LED ring', Mass: '0.02 g', Function: 'Plant-health scanning' },
  }));

  ampoule(mk('ampoule', {
    name: 'Injection Ampoule', explode: exa(2.7),
    info: 'Amber glass micro-injection cartridge held in a gold cage; the windows show the glowing fill of the pollination serum.',
    specs: { Material: 'Amber borosilicate glass, gold cage, serum core', Mass: '0.03 g', Function: 'Micro-dose carrier', Dimensions: '0.7 mm bore, 0.4 mm long' },
  }));

  joint2(mk('joint-2', {
    name: 'Mid Knuckle', explode: exa(3.7),
    info: 'Chrome hinge ring clamped by two black C-halves with gold pivot pins; couples the cluster to the telescoping sheath.',
    specs: { Material: 'Polished chrome, gold pins, black clamp halves', Mass: '0.02 g', Function: 'Sheath hinge' },
  }));

  const sheath = stinger.part('sheath', {
    name: 'Stinger Sheath', matrix: SF, explode: exa(4.7),
    info: 'Seven telescoping glossy black sections with chrome seam rings and a continuous gold ridge line, tapering from the cluster to the tip.',
    specs: { Material: 'Glossy black polymer, chrome seals, gold ridge', Mass: '0.08 g', Dimensions: '1.9 mm long, 0.9 to 0.21 mm diameter' },
  });
  for (let k = 0; k < 7; k++) {
    sheathSeg(sheath.part(`seg-${k + 1}`, {
      name: `Sheath Segment ${k + 1}`, tag: 'shell', explode: ex([0, k * 0.36, 0], 'fine', null, 'local'),
      info: `Telescoping sheath section ${k + 1} of 7: glossy black cone with a chamfered seam, a chrome seal ring, a dorsal gold ridge${k ? ' and a polished spigot that slides into the previous section' : ''}.`,
      specs: { Material: 'Black polymer, chrome seal and spigot, gold ridge' },
    }), k);
  }

  joint3(mk('joint-3', {
    name: 'Tip Knuckle', explode: exa(8.4),
    info: 'Two gold bands around a dark neck and a gunmetal nozzle that guide the needle out of the sheath.',
    specs: { Material: 'Gold bands, dark gunmetal neck and nozzle', Mass: '0.01 g', Function: 'Needle guide' },
  }));

  needle(mk('needle', {
    name: 'Probe Needle', explode: exa(10.2),
    info: 'Hair-fine steel needle that extends past the tip to pierce the flower and retracts into the sheath.',
    specs: { Material: 'Polished steel', Mass: '0.002 g', Function: 'Retractable micro-injector', Dimensions: '3.0 mm long, 0.06 mm diameter' },
  }));

  samplingTube(mk('sampling-tube', {
    name: 'Sampling Tube', explode: exa(6.2),
    info: 'Clear glass capillary running the length of the sheath; the pale green column is the collected plant sample.',
    specs: { Material: 'Borosilicate glass', Mass: '0.005 g', Function: 'Sample capillary' },
  }));
}
