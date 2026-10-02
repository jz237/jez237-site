// Thorax: right-flank armour pieces built on the flank plate frame: the tall rear cowl that carries the legend (text-plate),
// the louvred vent plate in front of it (side-plate-r) and the front environmental sensor pod. The skin under the (large)
// wing collars is the only free flank, so the pieces are fitted to the collar clearance curve measured in work/thorax/NOTES.md.
import { THREE, V3, M, ex, armorPanel, box, shape, cyl, sphere, revolve, T, decalPatch } from '../kit.js';
import { plateFrame, raised, studXf, flankPoint, placeUp, pip, distPoly, inset, roundCorners, tableFn, tidy, clamp, smooth, D2R } from './thorax-common.js';

export const FLANK = plateFrame({ dir: V3(0, 0, 1), up: V3(0, 1, 0) });
/** Highest free flank y (world) for each x under the wing collar clearance (measured). */
export const flankClear = (x) => FLANK_CLEAR(x)[0];
const FLANK_CLEAR = tableFn([[-0.8, 2.9], [-0.4, 3.0], [0, 2.0], [0.4, 1.65], [0.8, 1.45], [1.2, 1.3], [1.6, 1.2], [2.0, 1.1], [2.4, 1.1],
  [2.8, 1.1], [3.2, 1.1], [3.6, 1.15], [4.0, 1.25], [4.4, 1.35], [4.8, 1.5], [5.2, 1.7], [5.6, 2.05], [6.0, 3.7]]);

export const TEXT = { x0: 0.24, x1: 2.46, yb: -1.1, cap: 1.62 };    // rear cowl
export const SIDE = { x0: 2.64, x1: 3.64, yb: -1.1, cap: 0.86 };    // vent plate
export const POD = { x: 5.42, y: 0.34, r: 0.5 };
const topOf = (R) => (x) => Math.min(flankClear(x) - 0.3, R.cap);

const toP = (x, y) => { const p = flankPoint(x, y); return p ? FLANK.toPlate(p) : [x - 2.9, y - 0.8]; };
const toPoly = (pts) => pts.map(([x, y]) => toP(x, y));
/** walk a closed polyline, emitting a point every `spacing` mm */
function along(poly, spacing, off = 0) {
  const out = [];
  let carry = off;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let d = carry;
    while (d < L) { const t = d / L; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); d += spacing; }
    carry = d - L;
  }
  return out;
}
const slot = (cx, cy, w, h, r = 0.04) => [[cx - w / 2, cy - h / 2, r], [cx + w / 2, cy - h / 2, r], [cx + w / 2, cy + h / 2, r], [cx - w / 2, cy + h / 2, r]];
/** plate polygon (world x, y) of a flank piece: chamfered bottom corners, top edge following the collar clearance */
function flankPoly(R, step) {
  const top = topOf(R);
  const pts = [[R.x0 + 0.26, R.yb], [R.x1 - 0.26, R.yb], [R.x1, R.yb + 0.26]];
  for (let x = R.x1; x >= R.x0 - 1e-6; x -= step) pts.push([x, top(x)]);
  pts.push([R.x0, R.yb + 0.26]);
  return pts;
}
export const textPolyW = () => flankPoly(TEXT, 0.2);
export const sidePolyW = () => flankPoly(SIDE, 0.14);

export function buildFlank(W) {
  const { armor, fx, mirrors } = W;
  const F = FLANK;
  W.F = F;
  const ME = 0.3;                              // plate tessellation edge (mm)

  /* ======================================================================= text-plate (rear cowl, right side only) */
  const tp = armor.part('text-plate', {
    name: 'Text Plate', group: 'thorax-armor', tag: 'shell',
    info: 'Tall angled yellow cowl on the right rear flank carrying the printed motto, the bee mark and hazard stripes, with a chrome light strip and hinge barrels.',
    specs: { Material: 'Yellow composite, printed legend', Mass: '0.12 g' },
    explode: ex([-1.4, -0.4, 6.2], 'mid'),
  });
  const tpPoly = tidy(roundCorners(toPoly(textPolyW()), 0.18, 3), 0.07);
  const topT = toP(0, TEXT.cap)[1], botT = toP(0, TEXT.yb)[1];
  const tilt = (x, y) => 0.03 + 0.5 * clamp((topT - y) / (topT - botT));          // skirt flares out towards the lower edge
  const sk = raised(F.surface, tilt);
  tp.add(armorPanel({ shape: shape(inset(tpPoly, -0.08), [], { steps: 3 }), surface: raised(F.surface, (x, y) => tilt(x, y) - 0.14), thickness: 0.14, bevel: 0.03, maxEdge: ME, creaseDeg: 40 }), M.black);
  tp.add(armorPanel({ shape: shape(tpPoly, [], { steps: 3 }), surface: sk, thickness: 0.17, bevel: 0.055, maxEdge: ME, creaseDeg: 40 }), M.yellow);
  // raised border bead
  {
    const ring = inset(tpPoly, 0.1), inner = inset(tpPoly, 0.18);
    tp.add(armorPanel({ shape: shape(ring, [inner], { steps: 3 }), surface: sk, thickness: 0.06, bevel: 0.015, maxEdge: ME, lift: 0.17, creaseDeg: 40 }), M.yellow);
  }
  // legend: motto + bee mark + hazard stripes
  const legend = T.canvasTex(1024, 640, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    T.drawBee(c, w * 0.15, h * 0.33, h * 0.33, '#111');
    c.fillStyle = '#111'; c.textBaseline = 'alphabetic';
    c.font = `800 92px ${T.FONT}`;
    c.fillText('POLLINATE A', w * 0.3, h * 0.31); c.fillText('TOMORROW', w * 0.3, h * 0.52); c.fillText('BRIGHTER', w * 0.3, h * 0.73);
    c.fillRect(w * 0.04, h * 0.82, w * 0.92, 6);
    c.save(); c.beginPath(); c.rect(w * 0.04, h * 0.86, w * 0.92, h * 0.1); c.clip();
    for (let i = -6; i < 30; i++) { c.beginPath(); const x = w * 0.04 + i * 46; c.moveTo(x, h * 0.96); c.lineTo(x + 24, h * 0.96); c.lineTo(x + 24 + h * 0.1, h * 0.86); c.lineTo(x + h * 0.1, h * 0.86); c.closePath(); c.fill(); }
    c.restore();
  }, { repeat: false });
  const [tcx, tcy] = toP(1.56, -0.3);
  const dec = decalPatch({ surface: (x, y) => sk(tcx + x, tcy + y), w: 1.62, h: 1.01, map: legend, lift: 0.245, maxEdge: 0.4 });
  tp.add(dec.geometry, dec.material);
  // chrome light strip near the rear edge: frame, dark glass, LED dashes; a black seam groove beside it
  {
    const lx = TEXT.x0 + 0.42, yTop = topOf(TEXT)(lx) - 0.38, yBot = TEXT.yb + 0.36;
    const [cx, cy0] = toP(lx, yBot), cy1 = toP(lx, yTop)[1];
    const mid = (cy0 + cy1) / 2, len = cy1 - cy0;
    const rr = (w, h, r) => slot(cx, mid, w, h, r);
    tp.add(armorPanel({ shape: rr(0.24, len, 0.1), surface: sk, thickness: 0.07, bevel: 0.025, maxEdge: ME, lift: 0.175, creaseDeg: 40 }), M.chrome);
    tp.add(armorPanel({ shape: rr(0.17, len - 0.07, 0.07), surface: sk, thickness: 0.05, bevel: 0.012, maxEdge: ME, lift: 0.225, creaseDeg: 40 }), M.black);
    const nd = 7;
    for (let i = 0; i < nd; i++) {
      const y = cy0 + len * (0.12 + 0.76 * (i / (nd - 1)));
      tp.add(box(0.1, 0.03, 0.02, 0.006), i % 3 === 2 ? M.glowAmber : M.glowCyan, F.frameAt(cx, y, tilt(cx, y) + 0.285, 0));
    }
    const sx = toP(lx + 0.3, 0)[0];
    const sy0 = toP(0, yBot)[1], sy1 = cy1;
    tp.add(armorPanel({ shape: [[sx - 0.012, sy0, 0.005], [sx + 0.012, sy0, 0.005], [sx + 0.012, sy1, 0.005], [sx - 0.012, sy1, 0.005]], surface: sk, thickness: 0.025, bevel: 0.006, maxEdge: ME, lift: 0.178, creaseDeg: 40 }), M.black);
  }
  for (const [x, y] of along(inset(tpPoly, 0.12), 0.56, 0.1)) tp.add(fx.rivetS, M.chrome, studXf(F, x, y, 0.23, { h: tilt }));
  // hinge barrels and a quarter-turn latch
  for (let i = 0; i < 2; i++) {
    const [px, py] = toP(TEXT.x0 + 0.09, -0.62 + i * 1.12);
    tp.add(cyl(0.075, 0.46, { bevel: 0.015, segments: 14, axis: 'y' }), M.chrome, F.frameAt(px, py, 0.15 + tilt(px, py), 0));
  }
  {
    const [px, py] = toP(TEXT.x1 - 0.3, -0.52);
    tp.add(cyl(0.14, 0.07, { bevel: 0.02, segments: 20, y0: 0 }), M.chrome, studXf(F, px, py, 0.2, { h: tilt }));
    tp.add(box(0.22, 0.03, 0.045, 0.008), M.black, F.frameAt(px, py, tilt(px, py) + 0.285, 35));
  }

  /* ======================================================================= side-plate-r (vent plate) */
  const sp = armor.part('side-plate-r', {
    name: 'Side Plate Right', group: 'thorax-armor', tag: 'shell',
    info: 'Yellow composite vent plate on the right flank between the cowl and the fur dome: black gasket, six louvre slots, stepped inner panel and quarter-turn latches.',
    specs: { Material: 'Yellow composite over EPDM gasket', Mass: '0.06 g' },
    explode: ex([0.8, 0.5, 4.6], 'mid'),
  });
  const spPoly = tidy(roundCorners(toPoly(sidePolyW()), 0.17, 3), 0.06);
  const spIn2 = inset(spPoly, 0.24), spGasket = inset(spPoly, -0.09);
  const slots = [];
  const nsl = 6;
  for (let i = 0; i < nsl; i++) {
    const [cx, cy] = toP((SIDE.x0 + SIDE.x1) / 2, -0.83 + i * 0.2);
    slots.push(slot(cx, cy, 0.58, 0.085, 0.04));
  }
  sp.add(armorPanel({ shape: shape(spGasket, [], { steps: 3 }), surface: F.surface, thickness: 0.09, bevel: 0.03, maxEdge: ME, lift: 0.0, creaseDeg: 40 }), M.black);
  sp.add(armorPanel({ shape: shape(spPoly, slots, { steps: 3 }), surface: F.surface, thickness: 0.2, bevel: 0.06, maxEdge: ME, lift: 0.05, creaseDeg: 40 }), M.yellow);
  sp.add(armorPanel({ shape: shape(spIn2, slots, { steps: 3 }), surface: F.surface, thickness: 0.1, bevel: 0.04, maxEdge: ME, lift: 0.27, creaseDeg: 40 }), M.yellow);
  {
    const [a] = toP(SIDE.x0 + 0.3, 0), [b] = toP(SIDE.x1 - 0.3, 0);
    const y0 = toP(0, SIDE.yb + 0.15)[1], y1 = toP(0, SIDE.yb + 0.23)[1];
    sp.add(armorPanel({ shape: [[a, y0, 0.02], [b, y0, 0.02], [b, y1, 0.02], [a, y1, 0.02]], surface: F.surface, thickness: 0.05, bevel: 0.015, maxEdge: ME, lift: 0.36 }), M.chrome);
  }
  for (const [x, y] of along(spIn2, 0.58, 0.2)) sp.add(fx.rivetS, M.chrome, studXf(F, x, y, 0.3, {}));
  const latch = cyl(0.12, 0.07, { bevel: 0.02, segments: 20, y0: 0 });
  for (const [wx, wy] of [[(SIDE.x0 + SIDE.x1) / 2, topOf(SIDE)((SIDE.x0 + SIDE.x1) / 2) - 0.34]]) {
    const [px, py] = toP(wx, wy);
    sp.add(latch, M.chrome, studXf(F, px, py, 0.36));
    sp.add(box(0.2, 0.03, 0.04, 0.008), M.black, F.frameAt(px, py, 0.44, 35));
  }

  /* ======================================================================= sensor-pod-r */
  const pod = armor.part('sensor-pod-r', {
    name: 'Sensor Pod Right', group: 'thorax-armor', tag: 'shell',
    info: 'Environmental sensor pod behind the neck collar: chrome bezel, blue optical dome and a short whip antenna.',
    specs: { Material: 'Black polymer base, chrome bezel, sapphire dome', Mass: '0.03 g' },
    explode: ex([1.4, 0.6, 3.6], 'fine'),
  });
  const [pxp, pyp] = toP(POD.x, POD.y);
  const sf = F.surface(pxp, pyp);
  const at = (lift = 0, spin = 0, s = 1) => placeUp(sf.p.clone().addScaledVector(sf.n, lift), sf.n, spin, s);
  pod.add(revolve([[0.3, 0], [0.5, 0, 0.02], [0.5, 0.07, 0.03], [0.43, 0.14, 0.03], [0.3, 0.14], [0.3, 0]], { segments: 40, steps: 2 }), M.black, at(-0.02));
  pod.add(revolve([[0.25, 0.11], [0.35, 0.11, 0.02], [0.35, 0.23, 0.03], [0.29, 0.29, 0.03], [0.2, 0.29], [0.2, 0.11], [0.25, 0.11]], { segments: 40, steps: 2 }), M.chrome, at(-0.02));
  pod.add(sphere(0.19, { segments: 28, rings: 16, sy: 0.85 }), M.glassBlue, at(0.27));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4 + 0.125) * Math.PI * 2;
    pod.add(fx.screwXS, M.chrome, new THREE.Matrix4().multiply(at(0.12, 0)).multiply(new THREE.Matrix4().makeTranslation(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4)));
  }
  pod.add(cyl(0.025, 0.38, { bevel: 0.01, segments: 8, y0: 0 }), M.chrome, (() => { const m = at(0.1); return m.multiply(new THREE.Matrix4().makeTranslation(-0.2, 0.25, -0.25)).multiply(new THREE.Matrix4().makeRotationZ(0.35)); })());
  mirrors.push(sp, pod);

  /* ----------------------------------------------------------------- fur keep-out masks */
  const maskOf = (poly, margin) => {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    x0 -= margin; x1 += margin; y0 -= margin; y1 += margin;
    return (pq) => { const [x, y] = F.toPlate(pq); if (x < x0 || x > x1 || y < y0 || y > y1) return false; return pip(poly, x, y) || distPoly(poly, x, y) < margin; };
  };
  const mSide = maskOf(spGasket, 0.12), mText = maskOf(inset(tpPoly, -0.08), 0.12);
  W.keep.both.push((pq) => pq.z > 0.2 && mSide(pq));
  W.keep.right.push((pq) => pq.z > 0.2 && mText(pq));
  W.keep.both.push((pq) => pq.z > 0.2 && Math.hypot(pq.x - sf.p.x, pq.y - sf.p.y, pq.z - sf.p.z) < POD.r + 0.16);
  void smooth; void D2R; void V3;
  return { sp, tp, pod };
}
