// Abdomen fur bands (a = 4.78 .. 8.80): four alternating golden / black bands, each a CPU-baked fur shell over a spool-shaped
// black ring with an undercoat sleeve, plus the chrome end ring that closes the shell against the tail mount (a = 8.80 .. 8.97).
// Strands are rooted on the body surface (abdomen-local axes) and combed tailward; the ventral keel footprint is kept fur-free.
import { THREE, M, Q, makeFur } from '../kit.js';
import { R, Rp, TAU, P, Nout, Tail, ringLathe, placeAt, hexBolt, lin, mk, exl } from './abdomen-common.js';
import { inBelly } from './abdomen-belly.js';

/** Band layout: axial extent, colour family, aft travel d (mm) when exploded, strand density per mm^2 and mean strand length. */
export const BANDS = [
  { id: 'band-1', name: 'Golden Fur Band 1', a0: 4.78, a1: 6.08, gold: true, d: 3.5, dens: 235, len: 0.84, lean: 0.14, bend: 0.3, seed: 1101 },
  { id: 'band-2', name: 'Black Fur Band 2', a0: 6.08, a1: 7.02, gold: false, d: 4.3, dens: 270, len: 0.78, lean: 0.12, bend: 0.26, seed: 1202 },
  { id: 'band-3', name: 'Golden Fur Band 3', a0: 7.02, a1: 7.98, gold: true, d: 5.1, dens: 235, len: 0.8, lean: 0.14, bend: 0.3, seed: 1303 },
  { id: 'band-4', name: 'Black Fur Band 4', a0: 7.98, a1: 8.80, gold: false, d: 5.9, dens: 270, len: 0.72, lean: 0.12, bend: 0.26, seed: 1404 },
];

const GOLD = ['#c88a1a', '#e8a92a', '#f4c552', '#fbe0a0', '#fff0c8'].map(lin);
const BLACK = ['#050506', '#0b0b0e', '#17161a', '#242124', '#2f2a26'].map(lin);
const BOLT = lin('#8d9097');

let blackFur = null;
/** Fur material for the black bands: M.fur's cream sheen would grey them out, so this twin has a cool, faint sheen. */
function blackFurMat() {
  if (blackFur) return blackFur;
  blackFur = new THREE.MeshPhysicalMaterial({
    name: 'fur black', color: 0xffffff, vertexColors: true, roughness: 0.8, metalness: 0, side: THREE.DoubleSide,
    sheen: 0.7, sheenColor: new THREE.Color('#8c93a1'), sheenRoughness: 0.5,
  });
  blackFur.onBeforeCompile = (shader) => {   // one shading normal on both faces, like M.fur
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''));
  };
  blackFur.customProgramCacheKey = () => 'apx-fur-black-v1';
  return blackFur;
}

/** Constant vertex colour (the undercoat material is vertex coloured). */
function tint(g, rgb) {
  const n = g.attributes.position.count, c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { c[3 * i] = rgb[0]; c[3 * i + 1] = rgb[1]; c[3 * i + 2] = rgb[2]; }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

/** Surface area weight of a ring at a (circumference times slant). */
const wArea = (a) => R(a) * Math.sqrt(1 + Rp(a) * Rp(a));

/** Surface area of the band (mm^2), used to size the strand count. */
function bandArea(a0, a1) {
  let s = 0;
  const n = 24;
  for (let i = 0; i < n; i++) s += TAU * 1.02 * wArea(a0 + ((i + 0.5) / n) * (a1 - a0)) * ((a1 - a0) / n);
  return s;
}

/** Deterministic integer hash of a clump cell -> [0, 1). */
function h2(i, j, k) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(k, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Strand sampler for one band: area weighted, hair grown in locks (clumps share tilt, length and shade), soft colour
 *  blend at the band edges, puffy length profile across the band. */
function sampler(b) {
  const { a0, a1, gold } = b;
  const own = gold ? GOLD : BLACK, other = gold ? BLACK : GOLD;
  let wmax = 0;
  for (let i = 0; i <= 24; i++) wmax = Math.max(wmax, wArea(a0 + (i / 24) * (a1 - a0)));
  const bt = new THREE.Vector3();
  return (r) => {
    const a = a0 + r() * (a1 - a0);
    if (r() * wmax > wArea(a)) return null;
    const phi = r() * TAU;
    if (inBelly(a, phi)) return null;
    const u = (a - a0) / (a1 - a0), edge = Math.min(a - a0, a1 - a);
    // lock (clump) cell: about 0.17 mm along the axis and 0.16 mm around
    const ia = Math.floor((a - a0) / 0.17), ip = Math.floor((phi * R(a)) / 0.16);
    const kb = h2(ia, ip, b.seed);
    const mixP = Math.pow(Math.max(0, 1 - edge / 0.22), 2) * 0.45;
    const pal = r() < mixP ? other : own;
    const x = 0.6 * kb + 0.4 * r();
    let c;
    if (pal === GOLD) c = x < 0.12 ? GOLD[0] : x < 0.38 ? GOLD[1] : x < 0.72 ? GOLD[2] : x < 0.9 ? GOLD[3] : GOLD[4];
    else c = x < 0.22 ? BLACK[0] : x < 0.52 ? BLACK[1] : x < 0.78 ? BLACK[2] : x < 0.93 ? BLACK[3] : BLACK[4];
    let l = (0.55 + 0.7 * Math.pow(Math.sin(Math.PI * u), 0.8)) * (0.82 + 0.4 * h2(ia, ip, 3)) * (0.9 + 0.2 * r());
    const guard = r() < 0.05;                        // a few long, fine guard hairs break the silhouette
    if (guard) l *= 1.35;
    l = Math.min(l, (a1 - a + 0.1) / (0.55 * b.len));   // strands stay inside their own band: short at the aft edge, so the next band shows
    // depth shading: the short undercoat and the strands deep in the grooves between bands are darker than the long tips
    const depth = (0.5 + 0.5 * Math.min(1, l / 1.0)) * (0.82 + 0.18 * Math.min(1, edge / 0.25));
    c = [c[0] * depth, c[1] * depth, c[2] * depth];
    const n = Nout(a, phi), t = Tail(a, phi);
    bt.crossVectors(n, t);
    const tt = (h2(ia, ip, 1) - 0.5) * 0.8, tb = (h2(ia, ip, 2) - 0.5) * 0.8;
    n.addScaledVector(t, tt).addScaledVector(bt, tb).normalize();
    return { p: P(a, phi, -0.08), n, t, c, l, w: (0.8 + 0.4 * r()) * (guard ? 0.7 : 1) };
  };
}

const RZ_FWD = new THREE.Matrix4().makeRotationZ(-Math.PI / 2);   // local +Y -> +X (toward the head)

function buildBand(root, b) {
  const { a0, a1, gold } = b;
  const p = mk(root, b.id, b.name,
    gold
      ? 'Golden fur band: dense combed fur grown over a black spool ring with a tan undercoat and a ring of steel bolts; the whole band slides off the frame toward the tail.'
      : 'Black fur band: short dense dark fur over a black spool ring with a black undercoat and a ring of steel bolts; it slides off the frame toward the tail between golden bands.',
    { tag: 'shell', explode: exl(-b.d, 0, 0, 'mid'), specs: { Material: 'Synthetic fur, black anodised spool ring', Hair: `${Math.round(b.len * 100) / 100} mm combed tailward`, Mass: gold ? '0.07 g' : '0.05 g' } });

  // spool ring: raised rims at both edges, groove between (hidden under the undercoat sleeve)
  const rim = 0.16;
  p.add(ringLathe([[a0, -0.55, 0.02], [a0, -0.07, 0.02], [a0 + rim, -0.07], [a0 + rim, -0.14], [a1 - rim, -0.14], [a1 - rim, -0.07], [a1, -0.07, 0.02], [a1, -0.55, 0.02]],
    { rel: true, seg: 96, crease: 50, maxStep: 0.4, steps: 2 }), M.black);

  // undercoat sleeve the strands grow from, plus the bolt ring on the front face of the spool (steel grey, vertex coloured)
  p.add(tint(ringLathe([[a0 + 0.02, -0.1], [a1 - 0.02, -0.1]], { rel: true, closed: false, seg: 96, maxStep: 0.4 }), gold ? lin('#946512') : lin('#060607')), M.furBase);
  const bolt = tint(hexBolt(0.04, 0.035), BOLT);
  for (let i = 0; i < 24; i++) {
    const phi = (i / 24) * TAU + 0.07;
    p.add(bolt, M.furBase, new THREE.Matrix4().makeTranslation(...P(a0, phi, -0.32).toArray()).multiply(RZ_FWD));
  }

  // fur
  const count = Math.round(bandArea(a0, a1) * b.dens * Q.fur);
  const fur = makeFur({
    seed: b.seed, count, sample: sampler(b), length: b.len, lengthJitter: 0.25, width: 0.042, bend: b.bend, lean: b.lean, segments: 2,
    rootDark: gold ? 0.5 : 0.7, gravity: 0,
  });
  if (!gold) fur.material = blackFurMat();
  p.addMesh(fur, { layers: [2], cast: false, receive: false, pick: false });
  // selection volume (fur is never drawn in the id pass)
  p.idProxy(ringLathe([[a0, -0.4], [a0, 0.85], [a1, 0.85], [a1, -0.4]], { rel: true, seg: 28, maxStep: 0.5, minSeg: 14, crease: 50 }));
  return p;
}

export function buildBands(root) {
  for (const b of BANDS) buildBand(root, b);

  /* ------------------------------------------------------------ end ring */
  const e = mk(root, 'end-ring', 'End Ring',
    'Chrome closing ring at the rear of the shell with a channel of 24 gunmetal bolts; it seats the stack against the tail mount ring and holds the last fur band.',
    { tag: 'shell', explode: exl(-6.7, 0, 0, 'mid'), specs: { Material: 'Hard-chrome stainless steel', Fasteners: '24 hex bolts', Mass: '0.03 g' } });
  const a0 = 8.80, a1 = 8.97, c = 0.035;
  e.add(ringLathe([[a0, -0.5, 0.02], [a0, 0.05, 0.03], [a0 + c, 0.05], [a0 + c, 0.015], [a1 - c, 0.015], [a1 - c, 0.05], [a1, 0.05, 0.03], [a1, -0.5, 0.02]],
    { rel: true, seg: 96, crease: 50, maxStep: 0.3, steps: 2 }), M.chrome);
  const bolt = hexBolt(0.04, 0.034);
  for (let i = 0; i < 24; i++) e.add(bolt, M.gunmetalDark, placeAt((a0 + a1) / 2, (i / 24) * TAU + 0.05, 0.015, i * 2.1));
  return e;
}
