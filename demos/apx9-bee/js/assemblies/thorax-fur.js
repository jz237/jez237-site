// Thorax fur: two golden domes (front behind the neck collar, rear in front of the petiole socket) and the black bands that
// hug the wing collars and the plates. Everything is sampled from one developed grid of the armour ellipsoid:
//   grid cell -> blocked by collar / cap / plates / pod / end collars / belly  -> distance field -> zones -> strands.
// Hair is built from textured hair cards (dense fuzz, coverage-preserving alpha mips) plus a thinner set of single guard strands (silhouette);
// both are fur meshes (layer 2). Each fur part also owns a continuous dark pelt base and an id proxy for picking.
import { THREE, M, Q, ex, rng } from '../kit.js';
import { strandMesh, cardMesh, hairTexture } from './thorax-strands.js';
import { TC, TR, BELLY, clamp, smooth, lerp, apS, hubCoords, vnoise } from './thorax-common.js';
import { collarClear } from './thorax-collars.js';

export const DEBUG = {};
const TAU = Math.PI * 2;
const NT = 150, NP = 300;                 // developed grid: theta (0..pi about +X) x phi (0..2pi, 0 = dorsal, 90 = right)
const A = TR.x, B = TR.y;                 // spheroid about the X axis (TR.y == TR.z)
export const FUR_X0 = -0.6, FUR_X1 = 6.6;  // rear / front limits (end collar faces)
export const FUR_Y0 = BELLY - 0.12;       // lowest fur root
const DENS_CARD = 390, DENS_STRAND = 110;  // cards / guard strands per mm^2 at Q.fur = 1
const ROOT_K = 0.985;                     // roots sit a little under the armour surface

const cellP = (th, ph, k, out) => out.set(TC.x + A * k * Math.cos(th), TC.y + B * k * Math.sin(th) * Math.cos(ph), B * k * Math.sin(th) * Math.sin(ph));
const normalAt = (p, out) => out.set((p.x - TC.x) / (A * A), (p.y - TC.y) / (B * B), p.z / (B * B)).normalize();

/* ------------------------------------------------------------------ developed grid + distance fields */
function makeGrid(W) {
  const N = NT * NP;
  const blocked = new Uint8Array(N), hard = new Uint8Array(N), area = new Float32Array(N), skin = new Uint8Array(N);
  const dTh = Math.PI / NT, dPh = TAU / NP;
  const p = new THREE.Vector3(), mp = new THREE.Vector3();
  for (let i = 0; i < NT; i++) {
    const th = (i + 0.5) * dTh, cth = Math.cos(th), sth = Math.sin(th);
    for (let j = 0; j < NP; j++) {
      const ph = (j + 0.5) * dPh, id = i * NP + j;
      cellP(th, ph, 1, p);
      area[id] = B * sth * Math.sqrt(B * B * cth * cth + A * A * sth * sth) * dTh * dPh;
      if (p.x < FUR_X0 || p.x > FUR_X1 || p.y < FUR_Y0) { blocked[id] = 1; continue; }
      let h = false, bore = false;
      for (const side of [1, -1]) {
        if (apS(p, side) < -1.5) continue;
        const c = hubCoords(p, side);
        if (c.rho < 1.57) bore = true;
        if (c.rho < collarClear(c.az)) { h = true; break; }
      }
      skin[id] = bore ? 0 : 1;
      if (!h) {
        mp.set(p.x, p.y, -p.z);
        for (const m of W.keep.both) if (m(p) || m(mp)) { h = true; break; }
        if (!h) for (const m of W.keep.right) if (m(p)) { h = true; break; }
      }
      if (h) { blocked[id] = 1; hard[id] = 1; }
    }
  }
  // chamfer distance (mm) to the nearest blocked / hard-blocked cell
  const stepT = new Float32Array(NT), stepP = new Float32Array(NT);
  for (let i = 0; i < NT; i++) {
    const th = (i + 0.5) * dTh;
    stepT[i] = Math.sqrt(A * A * Math.sin(th) ** 2 + B * B * Math.cos(th) ** 2) * dTh;
    stepP[i] = B * Math.sin(th) * dPh;
  }
  const chamfer = (src) => {
    const d = new Float32Array(N);
    for (let k = 0; k < N; k++) d[k] = src[k] ? 0 : 1e6;
    const relax = (i, j, ii, jj, cost) => {
      if (ii < 0 || ii >= NT) return;
      jj = (jj + NP) % NP;
      const v = d[ii * NP + jj] + cost;
      if (v < d[i * NP + j]) d[i * NP + j] = v;
    };
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < NT; i++) for (let j = 0; j < NP; j++) {
        const sT = stepT[i], sP = stepP[i], sD = Math.hypot(sT, sP);
        relax(i, j, i - 1, j - 1, sD); relax(i, j, i - 1, j, sT); relax(i, j, i - 1, j + 1, sD); relax(i, j, i, j - 1, sP);
      }
      for (let i = NT - 1; i >= 0; i--) for (let j = NP - 1; j >= 0; j--) {
        const sT = stepT[i], sP = stepP[i], sD = Math.hypot(sT, sP);
        relax(i, j, i + 1, j + 1, sD); relax(i, j, i + 1, j, sT); relax(i, j, i + 1, j - 1, sD); relax(i, j, i, j + 1, sP);
      }
    }
    return d;
  };
  const dHard = chamfer(hard);
  return { N, blocked, hard, area, dHard, skin, stepT, stepP, dTh, dPh };
}

/* ------------------------------------------------------------------ zones */
/** Probability that a strand rooted at (x, y) with distance dh to the nearest hard blocker is black. */
function blackProb(x, y, dh) {
  const edge = smooth(0.62, 0.12, dh);
  const belly = smooth(-0.25, -1.0, y);
  const neck = smooth(5.45, 5.85, x);
  const rear = smooth(0.7, 0.2, x);
  return clamp(Math.max(edge * 0.95, belly * 0.95, neck * 0.7, rear * 0.7));
}

const lin = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };

/** Own fur materials: M.fur's cream sheen washes the gold out, so the golden strands get a warm faint sheen and the black ones a cool one. */
let furMats = null;
function getFurMats() {
  if (furMats) return furMats;
  const mk = (name, key, o) => {
    const m = new THREE.MeshPhysicalMaterial({ name, color: 0xffffff, vertexColors: true, metalness: 0, side: THREE.DoubleSide, ...o });
    m.onBeforeCompile = (shader) => {         // one shading normal on both faces, like M.fur
      shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''));
    };
    m.customProgramCacheKey = () => key;
    return m;
  };
  const card = { map: hairTexture(), alphaTest: 0.5, alphaToCoverage: true };
  furMats = {
    gold: mk('thorax fur gold', 'apx-thorax-fur-gold-v1', { roughness: 0.8, sheen: 0.5, sheenColor: new THREE.Color('#ffc43a'), sheenRoughness: 0.55 }),
    black: mk('thorax fur black', 'apx-thorax-fur-black-v2', { roughness: 0.85, sheen: 0.25, sheenColor: new THREE.Color('#6a7384'), sheenRoughness: 0.6 }),
    cardGold: mk('thorax hair gold', 'apx-thorax-hair-gold-v1', { ...card, roughness: 0.74, sheen: 0.6, sheenColor: new THREE.Color('#ffd25a'), sheenRoughness: 0.5 }),
    cardBlack: mk('thorax hair black', 'apx-thorax-hair-black-v2', { ...card, roughness: 0.85, sheen: 0.22, sheenColor: new THREE.Color('#6a7384'), sheenRoughness: 0.6 }),
  };
  return furMats;
}
const GOLD_A = lin('#ffd23a'), GOLD_B = lin('#e8a010'), GOLD_P = lin('#fff1bd'), GOLD_D = lin('#c27a08');
const BLK = [0.03, 0.026, 0.022];

/** Deterministic hash of a lock cell -> [0, 1). */
function h3(i, j, k) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(k, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/* ------------------------------------------------------------------ strands */
const LOCKS = { card: 0.34, strand: 0.26 };   // lock (clump) size, mm
function sampleStrands(W, G, kind) {
  const { N, blocked, area, dHard, stepT, stepP, dTh, dPh } = G;
  const card = kind === 'card';
  const LOCK = LOCKS[kind];
  const r = rng(card ? 7141 : 9013);
  const ids = [], cum = [];
  let total = 0;
  for (let id = 0; id < N; id++) {
    if (blocked[id] || dHard[id] <= (card ? 0.05 : 0.09)) continue;
    ids.push(id); total += area[id]; cum.push(total);
  }
  const count = Math.round(total * (card ? DENS_CARD : DENS_STRAND) * Q.fur);
  const recs = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3(), t = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), g = new THREE.Vector3();
  const cm = new THREE.Vector3(), nb = new THREE.Vector3();
  for (let k = 0; k < count; k++) {
    const u = r() * total;
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < u) lo = m + 1; else hi = m; }
    const id = ids[lo], i = (id / NP) | 0, j = id % NP;
    const th = (i + r()) * dTh, ph = (j + r()) * dPh;
    cellP(th, ph, card ? 0.99 : ROOT_K, p);
    const pr = cellP(th, ph, 1, cm);
    normalAt(pr, n);
    const dh = Math.min(3, dHard[id]);
    // distance gradient (tangent): away from collars / plates
    const dI = (ii, jj) => dHard[Math.min(NT - 1, Math.max(0, ii)) * NP + ((jj + NP) % NP)];
    const gT = (dI(i + 1, j) - dI(i - 1, j)) / (2 * stepT[i]), gP = (dI(i, j + 1) - dI(i, j - 1)) / (2 * stepP[i]);
    const sT = Math.sin(th), cT = Math.cos(th), sP = Math.sin(ph), cP = Math.cos(ph);
    e1.set(-A * sT, B * cT * cP, B * cT * sP).normalize();
    e2.set(0, -sP, cP);
    g.set(0, 0, 0).addScaledVector(e1, gT).addScaledVector(e2, gP);
    const gl = g.length();
    if (gl > 1e-4) g.divideScalar(gl);
    // lock cell (arc-length coordinates on the surface)
    const ia = Math.floor((th * 4.25) / LOCK), ip = Math.floor((ph * B * sT) / LOCK);
    const hA = h3(ia, ip, 1), hB = h3(ia, ip, 2), hC = h3(ia, ip, 3), hD = h3(ia, ip, 4), hE = h3(ia, ip, 5);
    // comb: sweep rearwards and down, fanning out from the body axis, with a slow swirl and a per-lock twist
    const ry = pr.y - TC.y, rz = pr.z, rl = Math.hypot(ry, rz) || 1;
    t.set(-0.9, -0.28 + 0.3 * ry / rl, 0.3 * rz / rl);
    t.addScaledVector(n, -t.dot(n));
    t.normalize();
    const swirl = (vnoise(pr.x * 0.85 + 1.7, pr.y * 0.85, pr.z * 0.85 + 4.3) - 0.5) * 1.5 + (hA - 0.5) * 0.7 + (r() - 0.5) * (card ? 0.3 : 0.18);
    nb.crossVectors(n, t);
    t.multiplyScalar(Math.cos(swirl)).addScaledVector(nb, Math.sin(swirl)).normalize();
    const wEdge = 0.85 * smooth(0.9, 0.05, dh);
    if (gl > 1e-4 && wEdge > 0) { t.multiplyScalar(1 - wEdge).addScaledVector(g, wEdge); t.addScaledVector(n, -t.dot(n)).normalize(); }
    const b = blackProb(pr.x, pr.y, dh);
    const black = r() < b;
    const nz2 = vnoise(pr.x * 3.3, pr.y * 3.3 + 9.2, pr.z * 3.3);
    let c, tip = 0, tipCol = BLK;
    if (black) {
      const v = 0.7 + hB * 0.9 + r() * 0.25;
      c = [BLK[0] * v, BLK[1] * v, BLK[2] * v];
      if (hE < 0.2) { tip = 0.5 + r() * 0.4; tipCol = GOLD_D.map((q) => q * 0.8); }
    } else {
      const mix = clamp(vnoise(pr.x * 1.7 + 3.1, pr.y * 1.7, pr.z * 1.7) * 0.8 + hD * 0.4 + r() * 0.15);
      c = [lerp(GOLD_A[0], GOLD_B[0], mix), lerp(GOLD_A[1], GOLD_B[1], mix), lerp(GOLD_A[2], GOLD_B[2], mix)];
      const clump = smooth(0.67, 0.92, nz2) * 0.25 + b * 0.22;
      if (hE < clump) { tip = 0.65 + r() * 0.35; tipCol = [BLK[0] * 1.6, BLK[1] * 1.6, BLK[2] * 1.6]; }
      else if (hC > 0.62) { tip = 0.5 + r() * 0.4; tipCol = GOLD_P; }
    }
    // shape: puffy and upright in the open, laid flat against the blockers
    const open = smooth(0.1, 0.95, dh);
    const lift = (card ? lerp(0.45, 1.0, open) : lerp(0.6, 1.2, open)) * (0.86 + 0.28 * hB) + (r() - 0.5) * 0.2;
    const lenK = (black ? 1.05 : 1.4) * (card ? 1.15 : 1) * (0.5 + 0.62 * smooth(0.0, 1.1, dh)) * (0.82 + 0.36 * hC) * (0.9 + 0.2 * r());
    recs.push({
      p: p.clone(), n: n.clone(), t: t.clone(), c, len: lenK, lift, tip, tipCol, spin: r() * 6.283, x: pr.x, z: pr.z, black,
      wid: card ? 0.22 + 0.14 * r() : (black ? 1.05 : 1) * (0.8 + 0.4 * r()),
      bT: 0.28 + 0.26 * hD + r() * 0.1, bN: 0.2 + 0.18 * hB + r() * 0.08, u0: r(), flip: r() < 0.5,
    });
  }
  return { recs, total, count };
}

/* ------------------------------------------------------------------ under-layer mat + pick proxy (coarse quads on the armour) */
const CG = 3;                             // coarse = 3 x 3 fine cells
function coarseQuads(G, pick) {
  const quads = [];
  const nt = Math.floor(NT / CG), np = Math.floor(NP / CG);
  const pp = new THREE.Vector3();
  for (let ci = 0; ci < nt; ci++) for (let cj = 0; cj < np; cj++) {
    let ok = 0, dsum = 0;
    for (let a = 0; a < CG; a++) for (let b = 0; b < CG; b++) {
      const id = (ci * CG + a) * NP + (cj * CG + b);
      if (!G.blocked[id] && G.dHard[id] > 0.09) { ok++; dsum += Math.min(3, G.dHard[id]); }
    }
    if (ok * 2 < CG * CG) continue;
    const th = (ci + 0.5) * CG * G.dTh, ph = (cj + 0.5) * CG * G.dPh;
    cellP(th, ph, 1, pp);
    quads.push({ ci, cj, which: pick(pp, dsum / ok) });
  }
  return quads;
}
function quadGeo(quads, G, k, colorFn) {
  const pos = [], nor = [], col = [], idx = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3();
  let v = 0;
  for (const q of quads) {
    const th0 = q.ci * CG * G.dTh, th1 = (q.ci + 1) * CG * G.dTh, ph0 = q.cj * CG * G.dPh, ph1 = (q.cj + 1) * CG * G.dPh;
    const c = colorFn ? colorFn(q) : null;
    for (const [th, ph] of [[th0, ph0], [th1, ph0], [th1, ph1], [th0, ph1]]) {
      cellP(th, ph, k, p); normalAt(p, n);
      pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      if (c) col.push(c[0], c[1], c[2]);
    }
    idx.push(v, v + 1, v + 2, v, v + 2, v + 3); v += 4;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  if (colorFn) geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  return geo;
}

/** Pelt base: a continuous dark skin under everything (also under plates and cap), vertex coloured by the zone field. */
let skinMat = null;
function getSkinMat() {
  if (!skinMat) skinMat = new THREE.MeshStandardMaterial({ name: 'thorax pelt base', vertexColors: true, roughness: 1, metalness: 0, side: THREE.DoubleSide });
  return skinMat;
}
function skinQuads(G, pick) {
  const quads = [];
  const nt = Math.floor(NT / CG), np = Math.floor(NP / CG);
  const pp = new THREE.Vector3();
  for (let ci = 0; ci < nt; ci++) for (let cj = 0; cj < np; cj++) {
    let ok = 0;
    for (let a = 0; a < CG; a++) for (let b = 0; b < CG; b++) if (G.skin[(ci * CG + a) * NP + (cj * CG + b)]) ok++;
    if (ok < CG * CG) continue;
    const mid = (ci * CG + 1) * NP + (cj * CG + 1);
    const th = (ci + 0.5) * CG * G.dTh, ph = (cj + 0.5) * CG * G.dPh;
    cellP(th, ph, 1, pp);
    quads.push({ ci, cj, which: pick(pp, Math.min(3, G.dHard[mid])) });
  }
  return quads;
}
/** Shared-vertex grid mesh of coarse quads at radius factor k; colour per corner from colorAt(th, ph). */
function skinGeo(quads, G, k, colorAt) {
  const pos = [], nor = [], col = [], idx = [];
  const map = new Map();
  const p = new THREE.Vector3(), n = new THREE.Vector3();
  const np1 = Math.floor(NP / CG) + 1;
  const vert = (ci, cj) => {
    const key = ci * np1 + cj;
    let v = map.get(key);
    if (v !== undefined) return v;
    const th = ci * CG * G.dTh, ph = cj * CG * G.dPh;
    cellP(th, ph, k, p); normalAt(p, n);
    const c = colorAt(th, ph);
    v = pos.length / 3;
    pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); col.push(c[0], c[1], c[2]);
    map.set(key, v);
    return v;
  };
  for (const q of quads) {
    const a = vert(q.ci, q.cj), b = vert(q.ci + 1, q.cj), c = vert(q.ci + 1, q.cj + 1), d = vert(q.ci, q.cj + 1);
    idx.push(a, b, c, a, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  return geo;
}

/* ------------------------------------------------------------------ parts */
export function buildFur(W) {
  const { armor } = W;
  const G = makeGrid(W);
  const cards = sampleStrands(W, G, 'card');
  const guards = sampleStrands(W, G, 'strand');
  const { total } = cards;
  DEBUG.W = W; DEBUG.G = G; DEBUG.recs = cards.recs; DEBUG.guards = guards.recs; DEBUG.total = total; DEBUG.count = cards.count;

  // class of a strand / quad -> part
  const classOf = (x, z, black) => (black ? (z >= 0 ? 'r' : 'l') : (x >= TC.x ? 'front' : 'rear'));
  const lists = { front: [], rear: [], r: [], l: [] }, glists = { front: [], rear: [], r: [], l: [] };
  for (const s of cards.recs) lists[classOf(s.x, s.z, s.black)].push(s);
  for (const s of guards.recs) glists[classOf(s.x, s.z, s.black)].push(s);

  const defs = {
    front: { id: 'fur-dome-front', name: 'Fur Dome Front', info: 'Golden biomimetic fur dome behind the neck collar: dense black-rooted synthetic hairs with dark clumped tips on a dark base mat.', mass: '0.05 g', exv: [3.4, 2.2, 0], lvl: 'mid', seed: 11 },
    rear: { id: 'fur-dome-rear', name: 'Fur Dome Rear', info: 'Golden biomimetic fur dome in front of the petiole socket: dense black-rooted synthetic hairs with dark clumped tips on a dark base mat.', mass: '0.04 g', exv: [-3.2, 1.8, 0], lvl: 'mid', seed: 23 },
    r: { id: 'black-band-r', name: 'Black Band Right', info: 'Black synthetic fur band hugging the right wing collar and the lower flank, with a few golden-tipped hairs that blend into the domes.', mass: '0.04 g', exv: [0.4, 1.2, 3.8], lvl: 'mid', seed: 37 },
    l: { id: 'black-band-l', name: 'Black Band Left', info: 'Black synthetic fur band hugging the left wing collar and the lower flank, with a few golden-tipped hairs that blend into the domes.', mass: '0.04 g', exv: [0.4, 1.2, -3.8], lvl: 'mid', seed: 41 },
  };
  const SKIN_GOLD = [0.32, 0.17, 0.02], SKIN_BLACK = [0.016, 0.014, 0.012];
  const colorAt = (th, ph) => {
    const pq = cellP(th, ph, 1, new THREE.Vector3());
    const i = Math.min(NT - 1, Math.max(0, Math.floor(th / G.dTh))), j = ((Math.floor(ph / G.dPh) % NP) + NP) % NP;
    const b = blackProb(pq.x, pq.y, Math.min(3, G.dHard[i * NP + j]));
    return [lerp(SKIN_GOLD[0], SKIN_BLACK[0], b), lerp(SKIN_GOLD[1], SKIN_BLACK[1], b), lerp(SKIN_GOLD[2], SKIN_BLACK[2], b)];
  };
  // quads by class (the quad's black probability decides dome vs band): free quads feed the pick proxy, all skin quads the pelt base
  const pick = (pp, dh) => classOf(pp.x, pp.z, blackProb(pp.x, pp.y, dh) > 0.5);
  const quads = coarseQuads(G, pick);
  const skinQ = skinQuads(G, pick);
  const furScale = Q.fur > 0 ? 1 / Math.sqrt(Math.max(0.2, Q.fur)) : 1;
  const out = {};
  for (const key of ['front', 'rear', 'r', 'l']) {
    const d = defs[key];
    const part = armor.part(d.id, {
      name: d.name, group: 'thorax-armor', tag: 'shell', info: d.info,
      bullets: ['Synthetic golden and black hairs', 'Dark base mat', 'Clumped dark tips'],
      specs: { Material: 'Synthetic fur on carbon mat', Mass: d.mass },
      explode: ex(d.exv, d.lvl),
    });
    out[key] = part;
    const mine = quads.filter((q) => q.which === key), skinMine = skinQ.filter((q) => q.which === key);
    if (skinMine.length) part.add(skinGeo(skinMine, G, 0.985, colorAt), getSkinMat());
    if (mine.length) part.idProxy(quadGeo(mine, G, 1.12, null));
    const black = key === 'r' || key === 'l', mats = getFurMats();
    if (lists[key].length) {
      for (const s of lists[key]) s.wid *= furScale;
      part.addMesh(cardMesh(lists[key], { mat: black ? mats.cardBlack : mats.cardGold, rootDark: black ? 0.7 : 0.34 }), { layers: [2], cast: false, receive: false, pick: false });
    }
    if (glists[key].length) {
      part.addMesh(strandMesh(glists[key], { segments: 2, width: 0.02 * furScale, rootDark: black ? 0.7 : 0.36, mat: black ? mats.black : mats.gold }), { layers: [2], cast: false, receive: false, pick: false });
    }
  }
  return out;
}
