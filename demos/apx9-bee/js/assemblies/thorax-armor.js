// Thorax armour: the segmented yellow dorsal cap (rear lamella, vented centre bridge, two front lamellae).
// The wing apertures leave only a slender valley on the dorsal midline, so the cap is a raised keel that rides between the
// two chrome collars (hourglass outline fitted to the collar clearance) and flares out into lamellae at both ends.
import { THREE, V3, M, ex, armorPanel, box, shape, cyl, T, decalPatch } from '../kit.js';
import { plateFrame, raised, studXf, plateXf, tableFn, pip, TC, TR, clamp, smooth } from './thorax-common.js';

/** table rows: [plate y (along x), half width, lift above the armour surface] */
export const SPINE = tableFn([
  [-4.15, 1.05, 0.08], [-3.9, 1.8, 0.10], [-3.55, 2.2, 0.12], [-3.2, 1.8, 0.20], [-3.0, 1.38, 0.30], [-2.6, 0.84, 0.42],
  [-2.2, 0.54, 0.56], [-1.6, 0.37, 0.70], [-1.0, 0.285, 0.78], [-0.5, 0.25, 0.82], [0.0, 0.36, 0.84], [0.5, 0.50, 0.78],
  [1.0, 0.70, 0.64], [1.5, 0.95, 0.50], [2.0, 1.22, 0.34], [2.5, 1.7, 0.22], [2.9, 2.15, 0.14],
]);
export const spineHW = (y) => SPINE(y)[0];
export const spineL = (y) => SPINE(y)[1];

const PIECES = {
  rear: { id: 'cap-segment-1', y0: -4.12, y1: -2.02, lift: 0.0 },
  mid: { id: 'dorsal-cap', y0: -2.14, y1: 0.95, lift: 0.045 },
  front: { id: 'cap-segment-2', y0: 0.84, y1: 1.96, lift: 0.09 },
  nose: { id: 'cap-segment-3', y0: 1.86, y1: 2.88, lift: 0.135 },
};

/** Outline (plate coords) of a cap piece with rounded ends; `inset` shrinks it (mm). */
export function pieceOutline(y0, y1, { rc = 0.16, inset = 0 } = {}) {
  const n = Math.max(8, Math.ceil((y1 - y0) / 0.13));
  const R = [], L = [];
  for (let i = 0; i <= n; i++) {
    const y = y0 + (y1 - y0) * i / n;
    const h = Math.max(0.1, spineHW(y) * 0.96 - inset);
    const corner = i === 0 || i === n ? rc : 0;
    R.push([h, y + (i === 0 ? inset : i === n ? -inset : 0), corner]);
    L.push([-h, y + (i === 0 ? inset : i === n ? -inset : 0), corner]);
  }
  return R.concat(L.reverse());
}

export function buildCap(W) {
  const { armor, fx, mirrors } = W;
  const D = plateFrame({ dir: V3(0, 1, 0), up: V3(1, 0, 0) });
  W.D = D;
  const CROWN = 0.11;
  const hField = (extra) => (x, y) => spineL(y) + extra + CROWN * (1 - clamp((x / Math.max(0.12, spineHW(y))) ** 2));
  const surfShell = (extra) => raised(D.surface, hField(extra));
  const surfKeel = (extra) => raised(D.surface, (x, y) => spineL(y) + extra - 0.5);

  const info = {
    'cap-segment-1': ['Cap Segment 1', 'Rear lamella of the dorsal cap: yellow composite shell over a black keel, louvre vents and riveted edges.', 'Yellow composite, black keel', 0.05],
    'dorsal-cap': ['Dorsal Cap', 'Central bridge of the dorsal cap between the wing collars, carrying the black ribbed vent for the flight motor.', 'Yellow composite, ribbed black vent', 0.08],
    'cap-segment-2': ['Cap Segment 2', 'Front lamella of the dorsal cap: yellow composite plate that overlaps the vented bridge and shields the flight motor.', 'Yellow composite, black keel', 0.04],
    'cap-segment-3': ['Cap Segment 3', 'Nose plate of the dorsal cap sitting behind the neck collar, with twin sensor windows and hazard marking.', 'Yellow composite, black keel', 0.04],
  };
  const exv = { rear: [-2.2, 3.2, 0], mid: [0.2, 5.2, 0], front: [1.8, 3.6, 0], nose: [3.2, 2.8, 0] };

  const parts = {};
  for (const [key, pc] of Object.entries(PIECES)) {
    const [name, inf, mat, mass] = info[pc.id];
    const p = armor.part(pc.id, { name, group: 'thorax-armor', tag: 'shell', info: inf, specs: { Material: mat, Mass: `${mass.toFixed(2)} g` }, explode: ex(exv[key], 'mid') });
    parts[key] = p;
    const outline = pieceOutline(pc.y0, pc.y1);
    // black keel under the plate (the cap rides above the surface between the collars)
    p.add(armorPanel({ shape: pieceOutline(pc.y0 + 0.02, pc.y1 - 0.02, { inset: 0.07, rc: 0.1 }), surface: surfKeel(pc.lift), thickness: 0.55, bevel: 0.08, maxEdge: 0.3, lift: 0, creaseDeg: 40 }), M.black);

    // holes: vent louvres (rear), vent window (mid), sensor windows (nose)
    const holes = [];
    if (key === 'rear') {
      for (let i = 0; i < 5; i++) {
        const y = -3.72 + i * 0.3, h = Math.min(0.62, spineHW(y) * 0.78);
        holes.push([[-h, y - 0.06, 0.05], [h, y - 0.06, 0.05], [h, y + 0.06, 0.05], [-h, y + 0.06, 0.05]]);
      }
    } else if (key === 'mid') {
      const y0 = -1.55, y1 = 0.45;
      const n = 8, R = [], L = [];
      for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; const h = Math.max(0.07, spineHW(y) * 0.55); R.push([h, y, i === 0 || i === n ? 0.06 : 0]); L.push([-h, y, i === 0 || i === n ? 0.06 : 0]); }
      holes.push(R.concat(L.reverse()));
    } else if (key === 'nose') {
      for (const sx of [-1, 1]) {
        const cx = sx * 0.95, cy = 2.4, r = 0.17, c = [];
        for (let k = 0; k < 16; k++) c.push([cx + Math.cos(k / 16 * 6.283) * r, cy + Math.sin(k / 16 * 6.283) * r]);
        holes.push(c);
      }
    }
    p.add(armorPanel({ shape: shape(outline, holes, { steps: 3 }), surface: surfShell(pc.lift), thickness: 0.22, bevel: 0.07, maxEdge: 0.3, lift: 0, creaseDeg: 40 }), M.yellow);

    // second, thinner raised overlay: a smaller yellow panel (layered armour look) on the wide lamellae
    if (key === 'rear' || key === 'nose' || key === 'front') {
      const inner = pieceOutline(pc.y0 + 0.25, pc.y1 - 0.25, { inset: 0.2, rc: 0.1 });
      p.add(armorPanel({ shape: shape(inner, [], { steps: 3 }), surface: surfShell(pc.lift + 0.2), thickness: 0.1, bevel: 0.04, maxEdge: 0.3, lift: 0, creaseDeg: 40 }), M.yellowDeep);
    }

    // rivets / screws along both edges
    const nR = Math.max(3, Math.round((pc.y1 - pc.y0) / 0.62));
    for (let i = 0; i < nR; i++) {
      const y = pc.y0 + 0.28 + (pc.y1 - pc.y0 - 0.56) * (nR === 1 ? 0.5 : i / (nR - 1));
      const h = spineHW(y) * 0.96 - 0.13;
      if (h < 0.12) continue;
      for (const sx of [-1, 1]) p.add(fx.rivetS, M.chrome, studXf(D, sx * h, y, 0.2, { s: 1, h: hField(pc.lift) }));
    }
  }

  // ribbed vent (child of the dorsal cap)
  const vent = parts.mid.part('vent', {
    name: 'Dorsal Vent', group: 'thorax-armor', tag: 'shell',
    info: 'Black ribbed exhaust vent over the flight motor, framed by a chrome bezel; ribs shed heat from the wing drive.',
    specs: { Material: 'Black anodised aluminium ribs, chrome bezel', Mass: '0.02 g' },
    explode: ex([0, 2.4, 0], 'fine'),
  });
  {
    const y0 = -1.5, y1 = 0.4, nRib = 9;
    for (let i = 0; i < nRib; i++) {
      const y = y0 + (y1 - y0) * (i + 0.5) / nRib;
      const h = Math.max(0.06, spineHW(y) * 0.55) - 0.02;
      vent.add(box(h * 2, 0.08, 0.11, 0.025), M.black, plateXf(D, 0, y, 0.13 + spineL(y) + 0.045 + CROWN * 0.4));
    }
    // dark floor and chrome bezel bars
    const floor = shape((() => { const n = 8, R = [], L = []; for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; const h = Math.max(0.05, spineHW(y) * 0.55 - 0.02); R.push([h, y]); L.push([-h, y]); } return R.concat(L.reverse()); })(), [], { steps: 2 });
    vent.add(armorPanel({ shape: floor, surface: raised(D.surface, (x, y) => spineL(y) + 0.18), thickness: 0.06, bevel: 0.015, maxEdge: 0.3 }), M.gunmetalDark);
    for (const yb of [y0 - 0.03, y1 + 0.03]) {
      const h = Math.max(0.1, spineHW(yb) * 0.55 + 0.04);
      vent.add(box(h * 2, 0.07, 0.12, 0.02), M.chrome, plateXf(D, 0, yb, 0.2 + spineL(yb) + 0.045));
    }
  }

  // A narrow segmented service spine lets the golden mantle crest above the wing roots.
  // Compress the plate and all of its fasteners together, preserving the mating seams.
  const narrow = new THREE.Matrix4().makeScale(1, 1, 0.72);
  narrow.setPosition(0, -0.22, 0);
  for (const root of Object.values(parts)) for (const p of root.walk()) {
    for (const batch of p.queue.values()) for (const geo of batch) geo.applyMatrix4(narrow);
  }

  // keep-out region for the fur (plate coordinates of the dorsal frame)
  W.keep.both.push((p) => {
    const [x, y] = D.toPlate(p);
    if (y < -4.3 || y > 3.0) return false;
    return Math.abs(x) < spineHW(y) * 0.72 + 0.12;
  });
  void TC; void TR; void smooth; void pip; void T; void decalPatch; void cyl; void THREE; void mirrors;
  return parts;
}
