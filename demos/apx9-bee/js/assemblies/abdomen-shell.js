// Abdomen shell, front half: the yellow armoured cap (flank plates with the bee logo, tagline and hazard marks, crown,
// belly plate, black liner), its fasteners, the data plate and the two service hatches.
// All plates follow the body profile K.abdomen.R through the chart helpers of abdomen-common.js; outlines are written in
// (a, psi) space (psi = angle around the axis in degrees, 0 = dorsal, 90 = bee-right) and mirrored for the left flank.
import { THREE, M, screw, box, cyl, rng } from '../kit.js';
import { ringLathe, plateAP, rectAP, frameAt, frameY, flankChart, dorsalChart, ventralChart, decalAt, strokeOnChart, insetAP, inkUV, mk, exl } from './abdomen-common.js';
import { atlas } from './abdomen-tex.js';

const AREF = 2.2;
const HATCH_A = 2.62, HATCH_P = 121;

/** Right flank armour plate, [a, psi, fillet]: stepped notch at the top, bulging rear edge, chamfered lower front. */
export const FLANK = [
  [0.80, 41, 0.14], [1.72, 38.5, 0.06], [1.72, 46.5, 0.05], [2.34, 46.5, 0.05], [2.34, 38.5, 0.06], [3.14, 38.5, 0.22],
  [3.34, 56, 0.3], [3.42, 90, 1.0], [3.34, 124, 0.3], [3.18, 144, 0.22], [2.06, 148, 0.2], [1.22, 139, 0.14],
  [0.80, 122, 0.14], [0.72, 90, 0.5], [0.76, 62, 0.14],
];
/** Crown / belly plate (psi about its own centre line). */
export const CROWN = [
  [0.90, -31, 0.12], [2.94, -31, 0.1], [3.26, -24, 0.3], [3.40, 0, 1.2], [3.26, 24, 0.3], [2.94, 31, 0.1], [0.90, 31, 0.12],
];
const rearEdge = (psi) => {
  const e = [[38.5, 3.14], [56, 3.34], [90, 3.42], [124, 3.34], [144, 3.18]];
  for (let i = 0; i < e.length - 1; i++) if (psi <= e[i + 1][0]) { const t = (psi - e[i][0]) / (e[i + 1][0] - e[i][0]); return e[i][1] + (e[i + 1][1] - e[i][1]) * t; }
  return e[e.length - 1][1];
};

/** Fastener positions (a, psi) along the edges of a flank plate, inset from the outline. */
export function flankScrews() {
  const pts = [];
  for (const psi of [51, 62, 74, 86, 98, 109, 131]) pts.push([rearEdge(psi) - 0.16, psi]);
  for (const a of [1.14, 1.5, 2.66, 2.96]) pts.push([a, 42.3]);
  for (const a of [1.74, 2.14, 2.54, 2.94]) pts.push([a, 144.6]);
  for (const psi of [58, 74, 106]) pts.push([0.98, psi]);
  pts.push([1.3, 137], [0.98, 118]);
  return pts;
}

function atlasUV() { const t = atlas(); return t.uv; }

export function buildShell(root) {
  const uv = atlasUV();
  const ink = atlas().ink;
  const cap = mk(root, 'cap-plate', 'Cap Plate',
    'Armoured yellow front cap in five pieces: two flank plates with the bee logo, tagline and hazard marks, a crown plate, a belly plate and the black liner behind them.',
    { explode: exl(-1.0, 0, 0, 'mid'), specs: { Material: 'Clear-coated yellow composite over black liner', Fasteners: '60 socket-head screws', Mass: '0.22 g' } });

  /* ------------------------------------------------------------ flank plates */
  for (const side of [1, -1]) {
    const tag = side > 0 ? 'r' : 'l';
    const chart = flankChart(side, AREF);
    const fl = mk(cap, `flank-${tag}`, `${side > 0 ? 'Right' : 'Left'} Flank Plate`,
      side > 0
        ? 'Right yellow flank plate with the black bee logo, tagline, hazard stripes, vent slots and a recessed service hatch; clear-coated composite, screwed to the liner.'
        : 'Left yellow flank plate with the black bee logo and tagline, vent slots and a recessed service hatch; clear-coated composite, screwed to the liner.',
      { tag: 'shell', explode: exl(0.2, 0.3, side * 4.4, 'mid'), specs: { Material: 'Yellow composite, clear coat', Thickness: '0.2 mm', Mass: '0.05 g' } });
    const holes = [
      rectAP(HATCH_A, HATCH_P, 0.44, 5.5, 0.14),               // service hatch opening
      rectAP(2.45, 52.5, 0.17, 1.35, 0.07),                    // vent slots below the notch
      rectAP(2.85, 52.5, 0.17, 1.35, 0.07),
    ];
    fl.add(plateAP(chart, FLANK, { side, thick: 0.2, outer: 0, bevel: 0.055, holes, maxEdge: 0.5 }), M.yellow);
    // engraved panel lines and the black bore of the sensor eye
    const fp = FLANK.filter((q, i) => i !== 2 && i !== 3 && i !== 4);
    fl.add(inkUV(strokeOnChart(chart, insetAP(chart, fp, 0.2, side), { w: 0.022, lift: 0.01, closed: true })), ink);
    // decals
    const dec = [];
    dec.push(decalAt(chart, uv('logo'), 2.0, 91, 1.5, 1.5, { side, lift: 0.018 }));
    dec.push(decalAt(chart, uv('tag'), 2.0, 64, 2.1, 0.394, { side, lift: 0.018 }));
    if (side > 0) {
      dec.push(decalAt(chart, uv('hazard'), 1.55, 130, 0.96, 0.24, { side, lift: 0.018 }));
      dec.push(decalAt(chart, uv('serial'), 2.5, 139.5, 0.78, 0.195, { side, lift: 0.018 }));
    } else {
      dec.push(decalAt(chart, uv('hazard'), 1.45, 50, 0.9, 0.225, { side, lift: 0.018 }));
      dec.push(decalAt(chart, uv('arrows'), 1.3, 112, 0.7, 0.175, { side, lift: 0.018 }));
    }
    dec.push(decalAt(chart, uv('wear'), 2.0, 90, 2.5, 2.5, { side, lift: 0.014, maxEdge: 0.5 }));
    for (const g of dec) fl.add(g, ink);
  }

  /* ------------------------------------------------------------ crown and belly */
  {
    const chart = dorsalChart(AREF);
    const crown = mk(cap, 'crown', 'Crown Plate',
      'Dorsal yellow crown plate with two banks of louvred vent slots and the serial stamp; the black liner shows through the slots.',
      { tag: 'shell', explode: exl(0.3, 4.4, 0, 'mid'), specs: { Material: 'Yellow composite, clear coat', Mass: '0.04 g' } });
    const holes = [];
    for (const sg of [-1, 1]) for (let i = 0; i < 4; i++) holes.push(rectAP(1.62 + i * 0.22, sg * 14.5, 0.055, 5.2, 0.04));
    holes.push(rectAP(2.74, 0, 0.16, 5.8, 0.07));
    crown.add(plateAP(chart, CROWN, { thick: 0.2, outer: 0.02, bevel: 0.055, holes, maxEdge: 0.5 }), M.yellow);
    crown.add(inkUV(strokeOnChart(chart, insetAP(chart, CROWN, 0.2, 1), { w: 0.022, lift: 0.03, closed: true })), ink);
    crown.add(decalAt(chart, uv('serial'), 1.34, 0, 0.9, 0.225, { rot: 2, lift: 0.04 }), ink);
    crown.add(decalAt(chart, uv('stripe'), 3.0, 0, 1.0, 0.25, { rot: 2, lift: 0.04 }), ink);
    crown.add(decalAt(chart, uv('wear'), 2.1, 0, 2.4, 2.4, { rot: 2, lift: 0.035, maxEdge: 0.5 }), ink);

    const vch = ventralChart(AREF);
    const belly = mk(cap, 'cap-belly', 'Cap Belly Plate',
      'Ventral yellow plate of the cap with a pair of cooling slots and the hazard chevrons; it closes the underside of the front liner.',
      { tag: 'shell', explode: exl(0.3, -4.4, 0, 'mid'), specs: { Material: 'Yellow composite, clear coat', Mass: '0.03 g' } });
    const VN = (pts) => pts.map(([a, p, r]) => (r === undefined ? [a, 180 + p] : [a, 180 + p, r]));
    const bh = [];
    for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) bh.push(rectAP(1.7 + i * 0.24, 180 + sg * 13, 0.055, 6, 0.04));
    belly.add(plateAP(vch, VN(CROWN), { thick: 0.2, outer: 0.0, bevel: 0.055, holes: bh, maxEdge: 0.5 }), M.yellow);
    belly.add(inkUV(strokeOnChart(vch, insetAP(vch, VN(CROWN), 0.2, 1), { w: 0.022, lift: 0.01, closed: true })), ink);
    belly.add(decalAt(vch, uv('hazard'), 2.9, 180, 1.4, 0.35, { lift: 0.018 }), ink);
    belly.add(decalAt(vch, uv('arrows'), 1.3, 180, 0.8, 0.2, { lift: 0.018 }), ink);
  }

  /* ------------------------------------------------------------ liner */
  {
    const liner = mk(cap, 'liner', 'Cap Liner',
      'Black matt composite liner that lines the cap behind the plates; four gunmetal hoops stiffen it and a rolled lip seals the front opening against the petiole collar.',
      { tag: 'shell', explode: exl(-0.3, 0, 0, 'fine'), specs: { Material: 'Black-anodised composite, gunmetal hoops', Mass: '0.06 g' } });
    const skin = [[0.64, -0.50, 0.03], [0.64, -0.22, 0.04], [1.0, -0.23, 0.0], [3.38, -0.23, 0.04], [3.38, -0.50, 0.03]];
    liner.add(ringLathe(skin, { rel: true, seg: 80, crease: 50, maxStep: 0.45 }), M.blackMatte);
    for (const a of [1.12, 1.84, 2.52, 3.18]) {
      const hoop = [[a - 0.09, -0.49], [a - 0.07, -0.70, 0.03], [a + 0.07, -0.70, 0.03], [a + 0.09, -0.49]];
      liner.add(ringLathe(hoop, { rel: true, seg: 72, crease: 50, maxStep: 0.5 }), M.gunmetal);
    }
    // front lip: rolled gunmetal ring
    liner.add(ringLathe([[0.60, -0.72, 0.05], [0.60, -0.20, 0.08], [0.78, -0.20, 0.06], [0.78, -0.72, 0.05]], { rel: true, seg: 80, crease: 50, maxStep: 0.5 }), M.gunmetal);
  }

  /* ------------------------------------------------------------ fasteners */
  const head = screw(0.082, 0.05);
  const headBig = screw(0.1, 0.06);
  const rnd = rng(77);
  for (const side of [1, -1]) {
    const tag = side > 0 ? 'r' : 'l';
    const chart = flankChart(side, AREF);
    const fs = mk(root, `cap-fasteners-${tag}`, `${side > 0 ? 'Right' : 'Left'} Cap Screws`,
      'Socket-head stainless screws that pin the flank plate to the liner; two larger ones mark the hinge line of the service hatch.',
      { tag: 'shell', explode: exl(-0.8, 0.3, side * 5.6, 'mid'), specs: { Material: 'A2 stainless steel', Drive: 'Hex socket 0.5 mm', Count: '32' } });
    for (const [a, psi] of flankScrews()) {
      const m = frameY(chart, a, psi, { side, lift: 0.0 });
      m.multiply(new THREE.Matrix4().makeRotationY(rnd() * 6.28));
      fs.add(head, M.steel, m);
    }
    for (const [a, psi] of [[1.9, 112.5], [1.9, 119.5]]) fs.add(headBig, M.steel, frameY(chart, a, psi, { side, lift: -0.02 }));
  }

  /* ------------------------------------------------------------ data plate (left flank) */
  {
    const chart = flankChart(-1, AREF);
    const dp = mk(root, 'data-plate', 'Data Plate',
      'Black anodised data plate riveted to the left flank, engraved in gold with the unit name, payload mass and serial number.',
      { tag: 'shell', explode: exl(-0.8, -0.6, -6.6, 'fine'), specs: { Material: 'Black-anodised aluminium, gold laser etch', Size: '1.5 x 0.8 mm', Mass: '0.01 g' } });
    const ol = rectAP(1.85, 135, 0.72, 3.8, 0.1);
    dp.add(plateAP(chart, ol, { side: -1, thick: 0.1, outer: 0.09, bevel: 0.03 }), M.black);
    dp.add(strokeOnChart(chart, insetAP(chart, ol, 0.09, -1), { w: 0.018, lift: 0.101, closed: true }), M.steel);
    dp.add(decalAt(chart, uv('label'), 1.85, 135, 1.22, 0.61, { side: -1, lift: 0.108 }), atlas().ink);
    for (const [a, psi] of [[1.23, 132.2], [1.23, 137.8], [2.47, 132.2], [2.47, 137.8]]) dp.add(rivetGeo, M.steel, frameY(chart, a, psi, { side: -1, lift: 0.092 }));
  }

  /* ------------------------------------------------------------ service hatches */
  for (const side of [1, -1]) {
    const tag = side > 0 ? 'r' : 'l';
    const chart = flankChart(side, AREF);
    const hz = mk(root, `side-hatch-${tag}`, `${side > 0 ? 'Right' : 'Left'} Service Hatch`,
      'Yellow service hatch set into the flank plate on a pair of chrome hinge barrels, held shut by a spring latch and four screws; gives access to the liner bay.',
      { tag: 'shell', explode: exl(-0.8, 0.2, side * 7.2, 'fine'), specs: { Material: 'Yellow composite, steel hardware', Fasteners: '4 screws + latch', Mass: '0.02 g' } });
    const A0 = HATCH_A, P0 = HATCH_P;
    const out = rectAP(A0, P0, 0.39, 4.8, 0.12);
    hz.add(plateAP(chart, out, { side, thick: 0.14, outer: -0.02, bevel: 0.04 }), M.yellow);
    hz.add(strokeOnChart(chart, insetAP(chart, out, 0.14, side), { w: 0.02, lift: -0.002, closed: true }), M.blackMatte);
    // gasket frame under the hatch (black)
    const gk = rectAP(A0, P0, 0.46, 5.6, 0.14);
    hz.add(plateAP(chart, gk, { side, thick: 0.05, outer: -0.2, bevel: 0.01, holes: [rectAP(A0, P0, 0.4, 4.9, 0.12)] }), M.blackMatte);
    // hinge barrels along the front edge, latch at the rear
    for (const dp of [-3.4, 0, 3.4]) {
      hz.add(cyl(0.065, 0.3, { axis: 'y', segments: 18, bevel: 0.015 }), M.steel, frameAt(chart, A0 - 0.41, P0 + dp, { side, lift: 0.04 }));
    }
    hz.add(box(0.15, 0.4, 0.07, 0.02), M.steel, frameAt(chart, A0 + 0.3, P0, { side, lift: 0.1 }));
    hz.add(cyl(0.06, 0.1, { axis: 'y', segments: 16, bevel: 0.015 }), M.steel, frameY(chart, A0 + 0.3, P0 - 3.6, { side, lift: 0.1 }));
    for (const [da, dp] of [[-0.27, -3.6], [0.27, -3.6], [-0.27, 3.6], [0.27, 3.6]]) hz.add(screw(0.05, 0.035), M.steel, frameY(chart, A0 + da, P0 + dp, { side, lift: 0.1 }));
  }
}

const rivetGeo = screw(0.06, 0.04);
