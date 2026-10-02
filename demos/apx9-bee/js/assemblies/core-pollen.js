// Pollination module, outer shell: yellow drum (upper / lower half shells), banded rings, chrome ring, black ribbed
// ring (fan guard) and the golden pollen brush. Frame: node at K.pollination.c, axis X, brush toward +X (core-util.js).
// The interior (chamber, vanes, motor, sensor, block frame, arms, pegs, hoses) lives in core-pollen-b.js.
import { THREE, M, ex, V3, S, D2R, rng, surf, decalPatch, T, armorPanel, rectPts, slotHoles, plate, cyl, sphere } from '../kit.js';
import { C, PL, drumR, lathe, latheOpen, lathePart, tube, aroundX, atTheta, bolt, boltRing, boltBand, instanced } from './core-util.js';
import { buildInterior } from './core-pollen-b.js?v=fbebb9cf6772';

const X = (d, lvl = 'mid') => ex([d, 0, 0], lvl);
/** Surface wrapper: plate x runs around the drum, plate y along the axis (right-handed, so artwork is not mirrored). */
const swap = (base) => (px, py) => base(py, px);
const YUP = V3(0, 1, 0), ONE = V3(1, 1, 1);

export function buildPollen(pm) {
  buildDrum(pm);
  buildBands(pm);
  buildRibbedRing(pm);
  buildBrush(pm);
  buildInterior(pm);
}

/** Bold top-down bee emblem (head up): solid thorax, abdomen with three yellow stripes cut through it, ink-tinted wings with heavy outlines, legs, antennae. */
function boldBee(size) {
  return T.canvasTex(size, size, (ctx) => {
    const k = size * 0.96 / 100;
    ctx.translate(size / 2 - 50 * k, size / 2 - 50 * k);
    ctx.scale(k, k);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ink = '#0b0b0b';
    const ell = (x, y, rx, ry, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); };
    // wings first, so the body sits on top of them
    ctx.fillStyle = 'rgba(11,11,11,0.36)'; ctx.strokeStyle = ink; ctx.lineWidth = 3.3;
    for (const [x, y, rx, ry, rot] of [[27, 33, 23, 10.5, -0.6], [73, 33, 23, 10.5, 0.6], [32, 50, 17.5, 7.6, -0.3], [68, 50, 17.5, 7.6, 0.3]]) {
      ell(x, y, rx, ry, rot); ctx.fill(); ctx.stroke();
    }
    ctx.strokeStyle = ink; ctx.lineWidth = 2.6;
    for (const mirror of [false, true]) {                                 // six legs
      const X = (x) => (mirror ? 100 - x : x);
      for (const [a, b, c] of [[[44, 33], [31, 29], [23, 35]], [[43, 38], [28, 42], [20, 51]], [[44, 43], [31, 54], [26, 66]]]) {
        ctx.beginPath(); ctx.moveTo(X(a[0]), a[1]); ctx.quadraticCurveTo(X(b[0]), b[1], X(c[0]), c[1]); ctx.stroke();
      }
    }
    ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(46, 17); ctx.quadraticCurveTo(40, 6, 30, 5); ctx.moveTo(54, 17); ctx.quadraticCurveTo(60, 6, 70, 5); ctx.stroke();
    ctx.fillStyle = ink;
    ell(50, 20.5, 7.4, 6.6); ctx.fill();                                  // head
    ell(50, 36, 11.6, 9.8); ctx.fill();                                   // thorax
    ell(50, 64, 14.8, 23); ctx.fill();                                    // abdomen
    ctx.beginPath(); ctx.moveTo(46.6, 85); ctx.lineTo(50, 97); ctx.lineTo(53.4, 85); ctx.closePath(); ctx.fill();   // sting
    ctx.globalCompositeOperation = 'destination-out';                     // yellow stripes through the abdomen
    ctx.lineWidth = 3.8;
    for (const y of [54.5, 63.5, 72.5]) { ctx.beginPath(); ctx.ellipse(50, y, 17, 4.4, 0, 0, Math.PI); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
  }, { repeat: false });
}

/** Stencilled data label (transparent ground, black ink), drawn left to right; rotateUV() lays it along the drum axis. */
function labelTex() {
  return T.canvasTex(1024, 128, (ctx) => {
    ctx.fillStyle = '#0b0b0b';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 58px Arial, Helvetica, sans-serif';
    ctx.fillText('APX-9  POLLEN DRUM', 14, 56);
    ctx.fillRect(14, 70, 996, 5);
    ctx.font = '600 33px "Courier New", monospace';
    ctx.fillText('PN 9047-PD   MAX 12000 RPM   LOT 5C-0417', 14, 112);
    ctx.fillRect(14, 4, 160, 8);
    for (let i = 0; i < 9; i++) ctx.fillRect(560 + i * 50, 6, 24, 6);
  }, { repeat: false });
}
/** Re-map a decalPatch (u = across, v = along the patch) so the texture reads along the patch's long axis; side > 0: right flank. */
function rotateUV(geo, side) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (side > 0) uv.setXY(i, v, 1 - u); else uv.setXY(i, 1 - v, u);
  }
  uv.needsUpdate = true;
}

/* ------------------------------------------------------------------ drum */
// egg-like outer skin: cylinder, a long taper that closes onto the funnel, rounded shoulder; two shallow panel grooves
const groove = (x0, x1, d = 0.035) => [[drumR(x0), x0], [drumR(x0 + .02) - d, x0 + .02], [drumR(x1 - .02) - d, x1 - .02], [drumR(x1), x1]];
const sh = (x) => [drumR(x), x];
const SHELL = [
  [1.50, -0.98, .02], [1.90, -0.98, .05],
  ...groove(-0.84, -0.74),
  sh(0.2), sh(0.45), sh(0.7), sh(0.95), sh(1.15), sh(1.32), sh(1.44),
  ...groove(1.50, 1.58),
  sh(1.62), sh(1.66), sh(1.70), [1.545, 1.72], [1.50, 1.72, .015],
];
const LINER = [
  [1.44, -0.94, .01], [1.49, -0.94], [1.49, 1.56], [1.44, 1.56, .01],
  [1.44, 0.40], [1.395, 0.38], [1.395, 0.30], [1.44, 0.28],               // stiffener beads
  [1.44, -0.38], [1.395, -0.40], [1.395, -0.46], [1.44, -0.48],
];

function buildDrum(pm) {
  const drum = pm.part('drum', {
    name: 'Pollen Drum',
    info: 'Yellow clear-coated drum in two half shells over a black liner; carries the bee emblem, service hatches, slanted vent slots and seam fasteners.',
    specs: { Material: 'Clear-coated 6061 aluminium', Diameter: '3.8 mm', Mass: '0.19 g' },
  });
  const shell = (id, name, info, th0, th1, exp) => {
    const p = drum.part(id, { name, info, tag: 'shell', explode: exp, specs: { Material: 'Clear-coated aluminium, Kevlar liner', Finish: 'Yellow polyurethane', Mass: '0.095 g' } });
    p.add(lathePart(SHELL, th0, th1, { segments: 34 }), M.yellow);
    p.add(lathePart(LINER, th0 - 2.7, th1 + 2.7, { segments: 24 }), M.blackMatte);     // liner shows in the seam gap
    return p;
  };
  const up = shell('shell-upper', 'Drum Shell, Upper',
    'Upper half shell of the pollen drum: clear-coated yellow aluminium carrying the bee emblem on both flanks and two service hatches, bolted to the lower half along the seam.',
    -88.8, 88.8, ex([0, 3.0, 0], 'mid'));
  const lo = shell('shell-lower', 'Drum Shell, Lower',
    'Lower half shell of the pollen drum with four slanted vent slots and a stencilled data label on each flank; seam-bolted to the upper half over a black liner.',
    91.2, 268.8, ex([0, -2.6, 0], 'mid'));

  const base = (x0, th0) => swap(surf.revolvedX(drumR, { x0, theta0: th0 }));

  // bee emblem on both flanks (head toward the brush, +X); one shared decal material
  const map = boldBee(512);
  const logoA = decalPatch({ surface: base(0.1, 55), w: 1.5, h: 1.5, map, lift: 0.04, maxEdge: 0.3, roughness: 0.55 });
  const logoB = decalPatch({ surface: base(0.1, -55), w: 1.5, h: 1.5, map, lift: 0.04, maxEdge: 0.3, roughness: 0.55 });
  up.add(logoA.geometry, logoA.material);
  up.add(logoB.geometry, logoA.material);
  logoB.material.dispose();

  // raised service hatches with four screws each (upper shell, both flanks)
  const hatch = (part, x0, th0, w, h) => {
    const surface = base(x0, th0);
    part.add(armorPanel({ shape: rectPts(w, h, 0.1), surface, thickness: 0.09, bevel: 0.035, lift: -0.01, maxEdge: 0.5 }), M.yellow);
    const sx = w / 2 - 0.12, sy = h / 2 - 0.12;
    for (const [a, b] of [[-sx, -sy], [sx, -sy], [sx, sy], [-sx, sy]]) {
      const s = surface(a, b);
      part.add(bolt(0.05, 0.04), M.blackMatte, new THREE.Matrix4().compose(s.p.clone().addScaledVector(s.n, 0.07), new THREE.Quaternion().setFromUnitVectors(YUP, s.n), ONE));
    }
  };
  hatch(up, 1.27, 44, 0.5, 0.64);
  hatch(up, 1.27, -44, 0.5, 0.64);

  // vent bezels on the lower flanks: a raised yellow frame with four slanted slots over black recesses and corner screws
  const hazard = (part, x0, th0) => {
    const surface = base(x0, th0), a = 28 * D2R, ca = Math.cos(a), sa = Math.sin(a);
    const slots = [];
    for (let k = 0; k < 4; k++) {
      const cy = (k - 1.5) * 0.2;
      slots.push([[-0.30, -0.05, .014], [0.30, -0.05, .014], [0.30, 0.05, .014], [-0.30, 0.05, .014]].map(([x, y, r]) => [x * ca - y * sa, x * sa + y * ca + cy, r]));
    }
    part.add(armorPanel({ shape: rectPts(0.98, 1.0, 0.07), holes: slots, surface, thickness: 0.075, bevel: 0.022, bevelSegments: 1, lift: -0.012, maxEdge: 0.3 }), M.yellow);
    for (const sl of slots) part.add(armorPanel({ shape: sl, surface, thickness: 0.035, bevel: 0.006, bevelSegments: 1, lift: 0.0, maxEdge: 0.3 }), M.blackMatte);
    for (const [px, py] of [[-0.39, -0.41], [0.39, -0.41], [0.39, 0.41], [-0.39, 0.41]]) {
      const q = surface(px, py);
      part.add(bolt(0.045, 0.035), M.blackMatte, new THREE.Matrix4().compose(q.p.clone().addScaledVector(q.n, 0.058), new THREE.Quaternion().setFromUnitVectors(YUP, q.n), ONE));
    }
  };
  hazard(lo, 1.0, 128);
  hazard(lo, 1.0, 232);
  // stencilled data label along each lower flank
  const lab = labelTex();
  const tR = decalPatch({ surface: base(0.1, 156), w: 0.24, h: 1.9, map: lab, lift: 0.008, maxEdge: 0.3, roughness: 0.6 });
  const tL = decalPatch({ surface: base(0.1, 204), w: 0.24, h: 1.9, map: lab, lift: 0.008, maxEdge: 0.3, roughness: 0.6 });
  rotateUV(tR.geometry, 1); rotateUV(tL.geometry, -1);
  lo.add(tR.geometry, tR.material);
  lo.add(tL.geometry, tR.material);
  tL.material.dispose();

  // seam screws just above / below the split plane (both sides)
  for (let k = 0; k < 5; k++) {
    const x = -0.7 + k * 0.5, r = drumR(x) - 0.004;
    for (const th of [-84, 84]) up.add(bolt(0.065, 0.05), M.blackMatte, atTheta(x, r, th));
    for (const th of [96, 264]) lo.add(bolt(0.065, 0.05), M.blackMatte, atTheta(x, r, th));
  }
}

/* ------------------------------------------------------------------ bands and rings */
function buildBands(pm) {
  const [aX0, aX1] = PL.bandA, [cX0, cX1] = PL.chromeR, [bX0, bX1] = PL.bandB, [kX0, kX1] = PL.bandC;
  const seg = { segments: 64 };

  // rear yellow band: stepped flange, bolt channel, black gasket liner
  const a = pm.part('band-a', {
    name: 'Rear Drum Band', tag: 'shell', explode: X(-2.5),
    info: 'Thick yellow rear band of the drum: stepped flange with a recessed bolt channel and a black gasket liner; it clamps the motor housing.',
    specs: { Material: 'Clear-coated aluminium', Fasteners: '28 x M0.3 socket', Mass: '0.055 g' },
  });
  a.add(lathe([
    [1.50, aX0, .03], [1.90, aX0, .06],
    [1.90, aX0 + .22], [1.86, aX0 + .24], [1.86, aX0 + .32], [1.90, aX0 + .34],
    [1.90, aX1, .05], [1.52, aX1, .03],
  ], seg), M.yellow);
  a.add(tube(1.44, 1.53, aX0 + .04, aX1 - .04, .02, seg), M.blackMatte);
  boltBand(a, M.blackMatte, { n: 16, r: 1.858, x: aX0 + .28, rb: 0.055, hb: 0.042 });
  boltRing(a, M.blackMatte, { n: 12, r: 1.81, x: aX0, dir: -1, rb: 0.06, hb: 0.04, phase: 15 });

  // polished spacer ring: V bead on the rim, black elastomer seal on its rear face
  const c = pm.part('chrome-ring', {
    name: 'Chrome Drum Ring', tag: 'shell', explode: X(-1.7),
    info: 'Mirror-polished stainless spacer ring between the drum bands; V bead on the rim and a black elastomer seal on its rear face.',
    specs: { Material: 'Polished 316 stainless steel', Width: '0.18 mm', Mass: '0.025 g' },
  });
  c.add(lathe([
    [1.55, cX0, .02], [1.93, cX0, .025], [1.96, cX0 + .03, .02], [1.96, cX0 + .07], [1.915, cX0 + .09, .01], [1.96, cX0 + .11],
    [1.96, cX1 - .03, .02], [1.93, cX1, .025], [1.55, cX1, .02],
  ], seg), M.chrome);
  c.add(tube(1.46, 1.56, cX0 - .02, cX0 + .02, .01, seg), M.blackMatte);

  // mid yellow band: rear bolt channel, front hairline channel and eight index ticks
  const b = pm.part('band-b', {
    name: 'Mid Drum Band', tag: 'shell', explode: X(-0.95),
    info: 'Yellow mid band with a recessed bolt channel and indexed tick marks, riding on a black liner; the bearing for the collection chamber sits behind it.',
    specs: { Material: 'Clear-coated aluminium', Index: '8 positions', Mass: '0.040 g' },
  });
  b.add(lathe([
    [1.50, bX0, .03], [1.90, bX0, .05],
    [1.90, bX0 + .12], [1.865, bX0 + .14], [1.865, bX0 + .26], [1.90, bX0 + .28],
    [1.90, bX1 - .14], [1.865, bX1 - .12], [1.865, bX1 - .08], [1.90, bX1 - .06],
    [1.90, bX1, .05], [1.52, bX1, .03],
  ], seg), M.yellow);
  b.add(tube(1.44, 1.53, bX0 + .04, bX1 - .04, .02, seg), M.blackMatte);
  boltBand(b, M.blackMatte, { n: 12, r: 1.862, x: bX0 + .20, rb: 0.055, hb: 0.042, phase: 15 });
  b.addMany(new THREE.BoxGeometry(0.15, 0.035, 0.06), M.blackMatte, aroundX(8, { x: bX0 + .47, r: 1.897 }));

  // narrow black band: raised ridges, gold inlay and chrome edge lips
  const k = pm.part('band-c', {
    name: 'Black Drum Band', tag: 'shell', explode: X(-0.35),
    info: 'Narrow black ribbed band with a gold inlay and chrome edge lips; it locks the yellow bands against the drum and shields the seam.',
    specs: { Material: 'Hard-anodised aluminium, gold inlay', Mass: '0.030 g' },
  });
  const ridges = [];
  for (const dx of [.075, .12, .165]) ridges.push([1.92, kX0 + dx - .014], [1.947, kX0 + dx - .007], [1.947, kX0 + dx + .007], [1.92, kX0 + dx + .014]);
  k.add(lathe([[1.52, kX0, .02], [1.92, kX0, .03], ...ridges, [1.92, kX1, .03], [1.52, kX1, .02]], seg), M.blackMatte);
  k.add(lathe([[1.915, kX0 + .20, .004], [1.935, kX0 + .20, .006], [1.935, kX0 + .235, .006], [1.915, kX0 + .235, .004]], seg), M.gold);
  k.add(lathe([[1.80, kX0 - .005, .008], [1.945, kX0 - .005, .01], [1.945, kX0 + .035, .01], [1.80, kX0 + .035, .008]], seg), M.chrome);
  k.add(lathe([[1.80, kX1 - .035, .008], [1.945, kX1 - .035, .01], [1.945, kX1 + .005, .01], [1.80, kX1 + .005, .008]], seg), M.chrome);
}

/* ------------------------------------------------------------------ black ribbed ring (fan guard) */
/** Inner wall radius of the funnel at axial position x: throat 1.22 at x 1.76, flaring to 1.44 at the mouth. */
const funnelW = (x) => (x < 1.95 ? 1.22 + 0.474 * (x - 1.76) : 1.31 + 0.5417 * (x - 1.95));

function buildRibbedRing(pm) {
  const r = pm.part('black-ribbed-ring', {
    name: 'Black Ribbed Ring', tag: 'shell', explode: X(1.7),
    info: 'Black trumpet-shaped fan guard at the drum mouth: 48 internal guide ribs funnel pollen to the brush; knurled chrome rim and gold bolts.',
    specs: { Material: 'Carbon-filled PEEK, chrome knurl', Ribs: '48', Mass: '0.050 g' },
  });
  const [x0, x1] = PL.ribbed;                                                  // 1.55 .. 2.24
  r.add(lathe([
    [1.22, x0, .02], [1.45, x0, .02], [1.45, 1.72], [1.70, 1.72, .03], [1.70, 1.92, .05], [1.64, x1 - .02, .08], [1.52, x1, .05],
    [1.44, x1 - .05, .04], [1.31, 1.95, .06], [1.22, 1.76],
  ], { segments: 64 }), M.blackMatte);
  // inner guide ribs follow the flare of the trumpet
  const xb = x1 - 0.07, w = funnelW;
  const blade = plate([[1.80, w(1.80) + .03], [1.95, w(1.95) + .03], [xb, w(xb) + .03], [xb, w(xb) - .02, .008], [1.95, w(1.95) - .07, .015], [1.80, w(1.80) - .12, .02]],
    0.034, { bevel: 0.008, bevelSegments: 1, center: true });
  r.addMany(blade, M.blackMatte, aroundX(48, { phase: 3.75 }));
  // knurled chrome ridges on the flange, chrome lip on the mouth, gold bolts on the lip
  r.addMany(new THREE.BoxGeometry(0.15, 0.05, 0.04), M.chrome, aroundX(60, { x: 1.82, r: 1.70 }));
  r.add(lathe([[1.54, x1 - .005, .008], [1.63, x1 - .005, .01], [1.63, x1 + .02, .01], [1.54, x1 + .02, .008]], { segments: 64 }), M.chrome);
  boltRing(r, M.gold, { n: 12, r: 1.585, x: x1 + .02, dir: 1, rb: 0.045, hb: 0.032, phase: 15 });
}

/* ------------------------------------------------------------------ pollen brush */
/**
 * Blunt tapered bristle: 6-sided frustum (base radius 1 at y 0, tip radius 0.5 at y 0.9) with a low domed tip; the base is buried in
 * the hub. Vertex colour darkens towards the root so the dense ball keeps its depth (ambient occlusion by hand).
 */
function bristleGeo() {
  const g = new THREE.CylinderGeometry(0.5, 1, 0.9, 6, 1, true);
  g.translate(0, 0.45, 0);
  const pos = Array.from(g.attributes.position.array), nor = Array.from(g.attributes.normal.array), uv = Array.from(g.attributes.uv.array);
  const idx = Array.from(g.index.array);
  const apex = pos.length / 3;
  pos.push(0, 1.10, 0); nor.push(0, 1, 0); uv.push(0.5, 1);
  const rim = [];                                                        // dedicated dome ring so the cap shades like a rounded tip
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2, c = Math.sin(a), d = Math.cos(a);
    rim.push(pos.length / 3); pos.push(0.5 * c, 0.9, 0.5 * d); nor.push(0.62 * c, 0.78, 0.62 * d); uv.push(i / 6, 0.9);
  }
  for (let i = 0; i < 6; i++) idx.push(apex, rim[i], rim[(i + 1) % 6]);
  const col = [];
  for (let i = 0; i < pos.length; i += 3) { const k = 0.34 + 0.66 * Math.min(1, Math.max(0, pos[i + 1] / 0.95)) ** 0.8; col.push(k, k * 0.97, k * 0.9); }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  out.setIndex(idx);
  return out;
}

function buildBrush(pm) {
  const b = pm.part('pollen-brush', {
    name: 'Pollen Brush', explode: X(3.2),
    info: 'Golden pollen brush: more than a thousand thick tapered gold-plated bristles radiate from a dark disc hub and sweep pollen off visiting flowers.',
    specs: { Material: 'Gold-plated bristles, steel hub and spindle, brass flange', Bristles: '~1000', Mass: '0.036 g' },
  });
  const cx = PL.brush, Rh = 0.90, SX = 0.64;                                    // flattened (oblate) hub: disc-like, like the reference
  // spindle (coupled to the motor shaft), brass back flange and the dark hub that shows between the bristles
  b.add(cyl(0.12, 0.92, { axis: 'x', bevel: 0.012, segments: 24 }), M.gunmetalDark, [1.34, 0, 0]);
  b.add(lathe([[0.30, cx - 0.36, .015], [0.78, cx - 0.36, .02], [0.78, cx - 0.26, .02], [0.60, cx - 0.20, .02], [0.30, cx - 0.20, .01]], { segments: 40 }), M.brass);
  b.add(sphere(Rh, { segments: 48, rings: 28, sx: SX }), M.gunmetalDark, [cx, 0, 0]);
  // brass ring round a dark socket at the pole
  const xp = cx + Rh * SX;
  b.add(lathe([[0.16, xp - 0.07, .008], [0.30, xp - 0.07, .012], [0.30, xp + 0.04, .02], [0.16, xp + 0.04, .012]], { segments: 36 }), M.brass);
  b.add(lathe([[0.0001, xp - 0.05], [0.16, xp - 0.05], [0.16, xp - 0.045], [0.0001, xp - 0.045]], { segments: 36 }), M.gunmetalDark);

  // bristles on a golden-angle (phyllotaxis) spiral over the front of the hub; shorter behind the equator
  const R = rng(5309);
  const q = new THREE.Quaternion(), p = V3(), s = V3(), d = V3(), m = new THREE.Matrix4();
  const mats = [], tint = [];
  const N = S(1000, 340), phi0 = 0.52, cos0 = Math.cos(phi0), cosMax = Math.cos(104 * D2R), GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(cos0 - (i + 0.5) / N * (cos0 - cosMax)), psi = i * GA;
    d.set(Math.cos(phi), Math.sin(phi) * Math.cos(psi), Math.sin(phi) * Math.sin(psi));
    d.x += R.range(-0.11, 0.11); d.y += R.range(-0.11, 0.11); d.z += R.range(-0.11, 0.11); d.normalize();     // ragged, hand-made fuzz
    const shape = 0.74 + 0.26 * Math.min(1, phi / 0.9) - 0.14 * Math.max(0, (phi - 1.45) / 0.37);
    const len = 0.31 * shape * (R.range(0, 1) < 0.18 ? R.range(1.2, 1.55) : R.range(0.78, 1.12)), wid = 0.084 * R.range(0.9, 1.15);
    p.set(cx, 0, 0).addScaledVector(d, Rh * 0.94);
    p.x = cx + (p.x - cx) * SX;
    q.setFromUnitVectors(YUP, d);
    s.set(wid, len, wid);
    mats.push(m.compose(p, q, s).clone());
    const t = R.range(0.9, 1.08);
    tint.push(new THREE.Color(t, t * R.range(0.93, 1.02), t * R.range(0.8, 1.0)));
  }
  instanced(b, bristleGeo(), C.bristle, mats, { colors: tint });
}
