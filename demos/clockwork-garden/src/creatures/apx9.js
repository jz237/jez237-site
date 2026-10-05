import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { strokeFan } from './common.js';
import { gearGeometry } from '../geometry/gears.js';
import { lerp, clamp } from '../core/ease.js';
import { K, abdomenR, buildNetwork, yLE, surfaceZ, TAG, XT, mk } from './apx9Shape.js';

// APX-9, the garden's resident pollinator: Jez's mechanical pollination bee
// (demos/apx9-bee), rebuilt at film scale. Same blueprint (apx9Shape.js):
// gloss-yellow armour and dense yellow fur banded in black, hex-faceted black
// compound eyes in riveted yellow bezels, black-and-gold antennae, smart-glass
// wings with a gold vein lattice (its nodes glowing) on a black spar, chrome flight drives, six
// chunky yellow legs with chrome knee wheels and gold clamp feet, a pollen
// drum with a golden brush under the head, pollen brushes on the hind legs and
// a pollen gauge on the abdomen cuff.
//
// Budget: every rigid part is ONE merged mesh whose paint / chrome / gold /
// rubber finishes are per-vertex (colour + metalness/roughness/clearcoat/glow
// attributes on one shared physical material), so the hero costs ~40 draw
// calls; `detail: 'lod'` builds the same rig with a fraction of the geometry
// and fur for the bees seen far away in the finale.
//
// Local frame (same as the other creatures): +Z forward (head), +Y up,
// origin at the thorax centre. 1 APX-9 millimetre = MM film units.

const TAU = Math.PI * 2;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const MM = 0.105;
const S = MM;
const TC = K.thorax.c;
// APX-9 bee space (mm: x forward, y up) + signed side offset (mm, film X) → film body space
const A = (x, y, side = 0) => V(side * S, (y - TC[1]) * S, (x - TC[0]) * S);

/* ------------------------------------------------------------------ finishes */
// [sRGB colour, metalness, roughness, clearcoat, glow]
const FINISH = {
  yellow: ['#f4b100', 0, 0.34, 1, 0],
  yellowDeep: ['#d98e08', 0, 0.4, 1, 0],
  black: ['#0b0b0d', 0, 0.26, 0.9, 0],
  matte: ['#141416', 0, 0.6, 0.15, 0],
  chrome: ['#eef1f4', 1, 0.13, 0, 0],
  steel: ['#c4c8ce', 1, 0.26, 0, 0],
  gold: ['#e2b13c', 1, 0.2, 0, 0],
  gunmetal: ['#3b3f47', 0.95, 0.3, 0.2, 0],
  rubber: ['#161618', 0, 0.85, 0, 0],
  lens: ['#06090f', 0.4, 0.05, 1, 0],
  furRoot: ['#5a3c08', 0, 0.95, 0, 0],
  furRootDark: ['#100d0a', 0, 0.95, 0, 0],
  cyan: ['#46dcff', 0, 0.4, 0.3, 1.3],
  blueLens: ['#9fdcff', 0.2, 0.1, 1, 0.35],
  orange: ['#ff8a26', 0, 0.4, 0.3, 1.8],
  amber: ['#ffb020', 0, 0.4, 0.3, 2.2],
  node: ['#ffcf70', 0.3, 0.3, 0.5, 0.5], // the wing lattice's glowing nodes
};
const finishCache = {};
function finish(name) {
  if (!finishCache[name]) {
    const [hex, m, r, cc, e] = FINISH[name];
    finishCache[name] = { color: new THREE.Color(hex), pbr: [m, r, cc, e] };
  }
  return finishCache[name];
}

/* ------------------------------------------------------------------ materials (shared) */
let MATS = null;
function materials() {
  if (MATS) return MATS;
  const glow = { value: 1 };
  // one physical material for every opaque APX-9 part: colour per vertex,
  // metalness / roughness / clearcoat / glow from the `pbr` attribute
  const body = new THREE.MeshPhysicalMaterial({ color: '#ffffff', vertexColors: true, metalness: 1, roughness: 1, clearcoat: 1, clearcoatRoughness: 0.07 });
  body.onBeforeCompile = (sh) => {
    sh.uniforms.uGlow = glow;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 pbr;\nvarying vec4 vPbr;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPbr = pbr;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vPbr;\nuniform float uGlow;')
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vPbr.y;')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vPbr.x;')
      .replace('#include <lights_physical_fragment>', THREE.ShaderChunk.lights_physical_fragment.replace('material.clearcoat = clearcoat;', 'material.clearcoat = clearcoat * vPbr.z;'))
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor.rgb * vPbr.w * uGlow;');
  };
  body.customProgramCacheKey = () => 'apx9-body-v1';

  const eye = new THREE.MeshPhysicalMaterial({
    color: '#04050a', metalness: 0.78, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.04,
    normalMap: hexFacetTexture(), normalScale: new THREE.Vector2(1.1, 1.1),
    iridescence: 0.2, iridescenceIOR: 1.4, iridescenceThicknessRange: [140, 260],
  });

  const membrane = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', vertexColors: true, transparent: true, metalness: 0, roughness: 0.07,
    clearcoat: 1, clearcoatRoughness: 0.03, iridescence: 1, iridescenceIOR: 1.45, iridescenceThicknessRange: [160, 520],
    side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.1,
  });

  MATS = { body, eye, membrane, fur: furMaterial(), glow };
  return MATS;
}

// Fur ribbons are double-sided but keep one shading normal (as in APX-9's fur.js).
function furMaterial({ glow = false } = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', vertexColors: true, roughness: 0.8, metalness: 0, sheen: 0.7, sheenColor: new THREE.Color('#ffd860'), sheenRoughness: 0.45,
    side: THREE.DoubleSide,
    emissive: glow ? new THREE.Color('#ffae3c') : new THREE.Color('#000000'), emissiveIntensity: 0,
  });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''));
  };
  m.customProgramCacheKey = () => 'apx9-fur-v1';
  return m;
}

// Tileable hex-dome normal map: each compound-eye facet is a tiny lens.
let hexTex = null;
function hexFacetTexture() {
  if (hexTex) return hexTex;
  const cols = 8, rows = 8; // rows must be even for a seamless tile
  const W = 256;
  const r = W / (cols * Math.sqrt(3)); // hex circumradius in px
  const H = Math.round(rows * 1.5 * r);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(W, H);
  const hw = Math.sqrt(3) * r, vh = 1.5 * r;
  const ri = (Math.sqrt(3) / 2) * r;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let best = 1e9, bx = 0, by = 0;
      const j0 = Math.floor(y / vh);
      for (let j = j0 - 1; j <= j0 + 1; j++) {
        const cy = j * vh;
        const off = ((j % 2) + 2) % 2 ? hw / 2 : 0;
        const i0 = Math.floor((x - off) / hw);
        for (let i = i0 - 1; i <= i0 + 1; i++) {
          const cx = i * hw + off;
          const d = (x - cx) ** 2 + (y - cy) ** 2;
          if (d < best) { best = d; bx = x - cx; by = y - cy; }
        }
      }
      // hexagonal distance → dome with a sharp crease at the cell edge
      const ax = Math.abs(bx), ay = Math.abs(by);
      const hexD = Math.max(ay, ax * 0.866 + ay * 0.5) / ri; // 0 centre … 1 edge (pointy-top)
      const k = Math.min(1, hexD);
      const slope = 0.55 + 2.4 * Math.pow(k, 6);
      let nx = (bx / ri) * slope, ny = (-by / ri) * slope;
      const nz = 1;
      const l = Math.hypot(nx, ny, nz);
      const o = (y * W + x) * 4;
      img.data[o] = (nx / l * 0.5 + 0.5) * 255;
      img.data[o + 1] = (ny / l * 0.5 + 0.5) * 255;
      img.data[o + 2] = (nz / l * 0.5 + 0.5) * 255;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  hexTex = new THREE.CanvasTexture(c);
  hexTex.wrapS = hexTex.wrapT = THREE.RepeatWrapping;
  hexTex.repeat.set(5, 3.4);
  hexTex.anisotropy = 4;
  hexTex.colorSpace = THREE.NoColorSpace;
  return hexTex;
}

/* ------------------------------------------------------------------ geometry kit */
function ensureIndexed(g) {
  if (g.index) return g;
  const n = g.attributes.position.count;
  const idx = new Uint32Array(n);
  for (let i = 0; i < n; i++) idx[i] = i;
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}
function flipWinding(g) {
  const idx = g.index.array;
  for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  g.index.needsUpdate = true;
}
const _q = new THREE.Quaternion(), _e = new THREE.Euler();
function T(pos = null, rot = null, scl = null) {
  const q = rot ? (rot.isQuaternion ? rot : _q.setFromEuler(_e.set(rot[0], rot[1], rot[2], rot[3] || 'XYZ'))) : _q.identity();
  const s = scl ? (scl.isVector3 ? scl : typeof scl === 'number' ? V(scl, scl, scl) : V(scl[0], scl[1], scl[2])) : V(1, 1, 1);
  return new THREE.Matrix4().compose(pos ?? V(), q, s);
}

// Accumulates primitives with a finish, then merges them into one mesh.
class Kit {
  constructor() { this.geos = []; }
  add(geo, fin, matrix = null, colorFn = null) {
    const g = ensureIndexed(geo.clone());
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    const n = g.attributes.position.count;
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    if (matrix) { g.applyMatrix4(matrix); if (matrix.determinant() < 0) flipWinding(g); }
    const f = finish(fin);
    const col = new Float32Array(n * 3), pbr = new Float32Array(n * 4);
    const p = g.attributes.position;
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      if (colorFn) colorFn(p.getX(i), p.getY(i), p.getZ(i), c.copy(f.color)); else c.copy(f.color);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      pbr.set(f.pbr, i * 4);
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('pbr', new THREE.BufferAttribute(pbr, 4));
    this.geos.push(g);
    return this;
  }
  geometry() {
    if (!this.geos.length) return null;
    const geo = mergeGeometries(this.geos, false);
    this.geos = [];
    geo.computeBoundingSphere();
    return geo;
  }
  mesh(material, { shadow = true } = {}) {
    const geo = this.geometry();
    if (!geo) return null;
    const m = new THREE.Mesh(geo, material);
    m.castShadow = shadow;
    m.receiveShadow = true;
    return m;
  }
}

// primitives -------------------------------------------------------------
const ell = (rx, ry, rz, ws = 24, hs = 16, ...range) => new THREE.SphereGeometry(1, ws, hs, ...range).scale(rx, ry, rz);
// cylinder between two points (radius r0 at a, r1 at b)
function cylBetween(a, b, r0, r1 = r0, seg = 8, open = false) {
  const d = b.clone().sub(a);
  const len = d.length();
  const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1, open);
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.normalize());
  return g.applyMatrix4(new THREE.Matrix4().compose(a.clone().lerp(b, 0.5), q, V(1, 1, 1)));
}
// surface of revolution about the Z axis; profile [[z, r]] with z increasing
function revolve(profile, seg = 32, { w = 1, phi0 = 0, phiLen = TAU } = {}) {
  const pos = [], nrm = [], uv = [], idx = [];
  const n = profile.length;
  for (let i = 0; i < n; i++) {
    const [z, r] = profile[i];
    const p0 = profile[Math.max(0, i - 1)], p1 = profile[Math.min(n - 1, i + 1)];
    let dz = p1[0] - p0[0], dr = p1[1] - p0[1];
    const l = Math.hypot(dz, dr) || 1;
    dz /= l; dr /= l;
    for (let j = 0; j <= seg; j++) {
      const ph = phi0 + (phiLen * j) / seg;
      const sx = Math.sin(ph), cy = Math.cos(ph);
      pos.push(r * w * sx, r * cy, z);
      const nx = (dz * sx) / w, ny = dz * cy, nz = -dr;
      const nl = Math.hypot(nx, ny, nz) || 1;
      nrm.push(nx / nl, ny / nl, nz / nl);
      uv.push(j / seg, i / (n - 1));
    }
  }
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * (seg + 1) + j, b = a + 1, c = a + seg + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  orientOutward(g);
  return g;
}
// make triangle winding agree with the supplied vertex normals
function orientOutward(g) {
  const p = g.attributes.position, nr = g.attributes.normal, idx = g.index.array;
  const a = V(), b = V(), c = V(), fnm = V(), vn = V();
  let vote = 0;
  for (let t = 0; t < idx.length && Math.abs(vote) < 40; t += 3) {
    a.fromBufferAttribute(p, idx[t]); b.fromBufferAttribute(p, idx[t + 1]); c.fromBufferAttribute(p, idx[t + 2]);
    fnm.crossVectors(b.clone().sub(a), c.clone().sub(a));
    if (fnm.lengthSq() < 1e-14) continue;
    vn.fromBufferAttribute(nr, idx[t]);
    vote += fnm.dot(vn) > 0 ? 1 : -1;
  }
  if (vote < 0) flipWinding(g);
  return g;
}
function tubeThrough(points, radius, segs = 24, radial = 6, closed = false) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, closed, 'centripetal'), segs, radius, radial, closed);
}

/* ------------------------------------------------------------------ fur */
// Tapered, bent ribbon strands merged into one geometry with vertex colours
// (a port of APX-9's fur.js). sample(rng) → { p, n, t, c, l } in film units.
function furGeometry({ seed = 1, count, sample, length, lengthJitter = 0.4, width, bend = 0.45, lean = 0.35, segments = 3, rootDark = 0.4 }) {
  const r = mk(seed);
  const segs = Math.max(2, segments | 0);
  const vPer = 2 * segs + 1, tPer = 2 * (segs - 1) + 1;
  const pos = new Float32Array(count * vPer * 3), nor = new Float32Array(count * vPer * 3), col = new Float32Array(count * vPer * 3);
  const idx = new Uint32Array(count * tPer * 3);
  const p = V(), n = V(), t = V(), dir = V(), bendV = V(), ref = V(), tan = V(), side = V(), faceN = V(), nn = V(), pt = V(), prev = V();
  let made = 0, tries = 0;
  while (made < count && tries < count * 6) {
    tries++;
    const s = sample(r);
    if (!s) continue;
    p.copy(s.p); n.copy(s.n).normalize();
    t.copy(s.t).normalize();
    const L = length * (s.l ?? 1) * (1 - lengthJitter + r() * lengthJitter * 2);
    const Wd = width * (s.w ?? 1) * (0.75 + r() * 0.5);
    const lean0 = Math.min(1, Math.max(0, lean * (0.6 + r() * 0.8)));
    dir.copy(n).multiplyScalar(1 - lean0).addScaledVector(t, lean0);
    dir.x += (r() - 0.5) * 0.5; dir.y += (r() - 0.5) * 0.5; dir.z += (r() - 0.5) * 0.5;
    dir.normalize();
    bendV.copy(t).multiplyScalar(bend * (0.6 + r() * 0.8));
    ref.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    const vary = 0.86 + r() * 0.28;
    const cr = s.c[0] * vary, cg = s.c[1] * vary, cb = s.c[2] * vary;
    const vb = made * vPer;
    prev.copy(p);
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      pt.copy(p).addScaledVector(dir, L * u).addScaledVector(bendV, L * u * u);
      tan.copy(pt).sub(prev);
      if (tan.lengthSq() < 1e-14) tan.copy(dir);
      tan.normalize();
      prev.copy(pt);
      side.crossVectors(tan, ref);
      if (side.lengthSq() < 1e-8) side.crossVectors(tan, n);
      side.normalize();
      faceN.crossVectors(tan, side).normalize();
      nn.copy(n).multiplyScalar(0.72).addScaledVector(faceN, faceN.dot(n) < 0 ? -0.28 : 0.28).normalize();
      const shade = rootDark + (1 - rootDark) * Math.pow(u, 0.7);
      const taper = i === segs ? 0 : Wd * (1 - 0.82 * u) * 0.5;
      const rings = i === segs ? 1 : 2;
      for (let k = 0; k < rings; k++) {
        const vi = vb + (i === segs ? 2 * segs : 2 * i + k);
        const sg = k === 0 ? -1 : 1;
        pos[vi * 3] = pt.x + side.x * taper * sg; pos[vi * 3 + 1] = pt.y + side.y * taper * sg; pos[vi * 3 + 2] = pt.z + side.z * taper * sg;
        nor[vi * 3] = nn.x; nor[vi * 3 + 1] = nn.y; nor[vi * 3 + 2] = nn.z;
        col[vi * 3] = cr * shade; col[vi * 3 + 1] = cg * shade; col[vi * 3 + 2] = cb * shade;
      }
    }
    let ti = made * tPer * 3;
    for (let i = 0; i < segs - 1; i++) {
      const a = vb + 2 * i, b = a + 1, c = a + 2, d = a + 3;
      idx[ti++] = a; idx[ti++] = c; idx[ti++] = b;
      idx[ti++] = b; idx[ti++] = c; idx[ti++] = d;
    }
    const a = vb + 2 * (segs - 1);
    idx[ti++] = a; idx[ti++] = vb + 2 * segs; idx[ti++] = a + 1;
    made++;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.slice(0, made * vPer * 3), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor.slice(0, made * vPer * 3), 3));
  g.setAttribute('color', new THREE.BufferAttribute(col.slice(0, made * vPer * 3), 3));
  g.setIndex(new THREE.BufferAttribute(idx.slice(0, made * tPer * 3), 1));
  g.computeBoundingSphere();
  return g;
}
const lin = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };
const FUR_Y = [lin('#f9c00e'), lin('#e29806')];
const FUR_K = [lin('#1a1612'), lin('#0c0a08')];
const furColor = (r, black = false) => {
  const [a, b] = black ? FUR_K : FUR_Y;
  const k = r();
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};

/* ------------------------------------------------------------------ wing (shared per detail level) */
const WING = 0.9; // the film wing is APX-9's planform at 90 % (so it folds over the abdomen)
const wingCache = new Map();
function wingParts(hero) {
  const key = hero ? 'hero' : 'lod';
  if (wingCache.has(key)) return wingCache.get(key);
  const net = buildNetwork({ seed: 42 });
  const W = S * WING;
  // wing mm (x span, y toward the leading edge, z camber) → hinge-local film (span +X, camber +Y, LE at z≈0, chord −Z)
  const P = (x, y, lift = 0) => V(x * W, (surfaceZ(x, y) + lift) * W, y * W);
  const kit = new Kit();
  const rs = hero ? 8 : 5;
  // black carbon spar along the leading edge, root → tip, with gold collars
  const spar = [];
  for (let x = 0; x <= 23.0; x += 0.5) spar.push(P(x, yLE(x), 0.15));
  const sparGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spar), hero ? 80 : 30, 1, rs, false);
  // taper the spar: thick at the root, slimmer at the tip
  {
    const pp = sparGeo.attributes.position, path = sparGeo.parameters.path;
    const segs = sparGeo.parameters.tubularSegments, rad = sparGeo.parameters.radialSegments;
    const c = V(), q = V();
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      path.getPointAt(u, c);
      const rr = (0.95 - 0.4 * u) * W;
      for (let j = 0; j <= rad; j++) {
        const vi = i * (rad + 1) + j;
        q.fromBufferAttribute(pp, vi).sub(c).multiplyScalar(rr).add(c);
        pp.setXYZ(vi, q.x, q.y, q.z);
      }
    }
  }
  kit.add(sparGeo, 'black');
  const collars = [2.6, 3.4, 5.6, 6.2, 8.4, 9.0, 11.2, 11.8, 14.0, 14.6, 16.8, 17.4, 19.6, 20.2, 21.9];
  for (const x of collars) {
    const u = x / 23.0;
    const a = P(x - 0.22, yLE(x - 0.22), 0.15), b = P(x + 0.22, yLE(x + 0.22), 0.15);
    kit.add(cylBetween(a, b, (1.25 - 0.45 * u) * W, (1.25 - 0.45 * u) * W, rs + 2), 'gold');
  }
  kit.add(new THREE.SphereGeometry(0.85 * W, rs + 2, 6), 'gold', T(P(23.15, yLE(23.15), 0.15)));
  // chrome root knuckle that turns inside the flight drive
  kit.add(cylBetween(P(-0.6, 0, 0.15), P(2.2, yLE(2.2), 0.15), 1.25 * W, 1.15 * W, rs + 4), 'chrome');
  kit.add(cylBetween(P(0.6, yLE(0.6), 0.15), P(1.2, yLE(1.2), 0.15), 1.55 * W, 1.55 * W, rs + 4), 'gold');
  // gold rim round the trailing edge and tip
  const ol = net.outline;
  const rim = [];
  let started = false;
  for (const q of ol) {
    if (q[2] === TAG.te || q[2] === TAG.tip) { rim.push(P(q[0], q[1])); started = true; } else if (started) break;
  }
  kit.add(tubeThrough(rim, 0.24 * W, hero ? 140 : 50, hero ? 5 : 4), 'gold');
  // root edge closes the frame
  kit.add(cylBetween(P(3.4, 0.14), P(3.15, -0.95), 0.22 * W, 0.22 * W, 5), 'gold');
  // the vein lattice
  const vr = (hero ? 0.17 : 0.24) * W;
  for (const v of net.veins) {
    const a = net.verts[v.a], b = net.verts[v.b];
    kit.add(cylBetween(P(a.x, a.y), P(b.x, b.y), vr, vr, hero ? 5 : 3, true), 'gold');
  }
  if (hero) {
    const stud = new THREE.SphereGeometry(0.3 * W, 6, 4);
    // (each node of the lattice a small warm light, like a honeycomb strung with lamps)
    for (const v of net.verts) if (v.deg >= 3 || v.rim) kit.add(stud, 'node', T(P(v.x, v.y, 0.05)));
    // "smart glass": a few chips and an amber status bar on the membrane
    const chip = new THREE.BoxGeometry(1.0 * W, 0.12 * W, 0.7 * W);
    for (const [x, y] of [[10.5, -3.2], [14.6, -5.6], [17.6, -2.6]]) kit.add(chip, 'gunmetal', T(P(x, y, 0.08), [0, -0.12, 0]));
    const bar = new THREE.BoxGeometry(2.2 * W, 0.1 * W, 0.42 * W);
    kit.add(bar, 'amber', T(P(12.6, -4.6, 0.08), [0, -0.12, 0]));
  }
  const frame = kit.geometry();

  // membrane: every cell fanned from its centroid so it follows the camber;
  // most panes clear and faintly tinted, some frosted (smart-glass)
  const pos = [], col = [], idx = [];
  const R = mk(7);
  for (const cell of net.cells) {
    const frosted = R() < 0.22;
    const tint = frosted ? [0.92, 0.95, 1.0, 0.36] : [0.86 + R() * 0.1, 0.92 + R() * 0.06, 1.0, 0.14 + R() * 0.06];
    const base = pos.length / 3;
    const c = P(cell.cx, cell.cy, -0.02);
    pos.push(c.x, c.y, c.z);
    col.push(...tint);
    for (const id of cell.ids) {
      const v = net.verts[id];
      const q = P(v.x, v.y, -0.02);
      pos.push(q.x, q.y, q.z);
      col.push(tint[0], tint[1], tint[2], tint[3] * 1.15);
    }
    const m = cell.ids.length;
    for (let k = 0; k < m; k++) idx.push(base, base + 1 + k, base + 1 + ((k + 1) % m));
  }
  const mem = new THREE.BufferGeometry();
  mem.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  mem.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  mem.setIndex(idx);
  mem.computeVertexNormals();
  const out = { frame, membrane: mem, span: XT * W };
  wingCache.set(key, out);
  return out;
}

/* ------------------------------------------------------------------ the bee */
export class APX9Bee {
  constructor(mat, { detail = 'hero', quality = null } = {}) {
    this.species = 'apx9';
    const hero = detail === 'hero';
    this.hero = hero;
    const furScale = hero ? (quality?.tier === 'low' ? 0.55 : 1) : 0.14;
    this.furScale = furScale;
    const M = materials();
    this.M = M;
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    // per-instance glowing materials (pollen)
    this.pollenMat = new THREE.MeshStandardMaterial({ color: '#ffc45a', roughness: 0.7, emissive: new THREE.Color('#ffa53a'), emissiveIntensity: 0.5 });
    this.brushMat = furMaterial({ glow: true });
    this.gaugeMat = gaugeMaterial();

    this._thorax(hero);
    this._head(hero);
    this._abdomen(hero);
    this._wings(hero);
    this._legs(hero);
    if (!hero) this.group.traverse((o) => { if (o.isMesh) { o.castShadow = false; } });
    this.pollen = 0;
    this.setPose({ t: 0 });
  }

  /* ---------------------------------------------------------------- thorax */
  _thorax(hero) {
    const kit = new Kit();
    const seg = hero ? 40 : 18;
    const R0 = [4.3 * S, 4.25 * S, 4.4 * S]; // fur root ellipsoid (x side, y, z long)
    kit.add(ell(R0[0], R0[1], R0[2], seg, seg * 0.7), 'furRoot');
    // neck and petiole collars
    kit.add(new THREE.TorusGeometry(2.35 * S, 0.32 * S, 8, seg), 'chrome', T(A(6.85, 0.35), [0, 0, 0]));
    kit.add(cylBetween(A(6.2, 0.35), A(7.0, 0.3), 2.5 * S, 2.25 * S, seg), 'gunmetal');
    kit.add(new THREE.TorusGeometry(2.45 * S, 0.3 * S, 8, seg), 'chrome', T(A(-1.05, 0.55)));
    kit.add(cylBetween(A(-0.4, 0.55), A(-1.1, 0.55), 2.7 * S, 2.45 * S, seg), 'gunmetal');

    const sides = [-1, 1];
    // side armour plates (yellow shells over the lower flanks)
    this._plates = [];
    for (const s of sides) {
      const phiC = s < 0 ? 0 : Math.PI; // SphereGeometry: phi 0 → −X
      const plate = new THREE.SphereGeometry(1, hero ? 18 : 8, hero ? 10 : 5, phiC - 0.55, 1.1, 1.72, 0.62);
      const sc = [5.05 * S, 4.95 * S, 5.1 * S];
      kit.add(plate, 'yellow', T(A(3.3, 0.45), null, sc));
      // inner face so the plate has thickness from grazing angles
      kit.add(plate, 'yellowDeep', T(A(3.3, 0.45), null, [sc[0] * 0.97, sc[1] * 0.97, sc[2] * 0.97]));
      // plate border bead
      const edge = [];
      for (let k = 0; k <= 16; k++) {
        const ph = phiC - 0.55 + (1.1 * k) / 16;
        for (const th of [1.72]) edge.push(V(-Math.cos(ph) * Math.sin(th) * sc[0], Math.cos(th) * sc[1], Math.sin(ph) * Math.sin(th) * sc[2]).add(A(3.3, 0.45)));
      }
      kit.add(tubeThrough(edge, 0.22 * S, 24, 5), 'chrome');
      if (hero) {
        // chrome LED studs and a black vent on the plate
        const stud = new THREE.SphereGeometry(0.32 * S, 8, 6);
        for (let k = 0; k < 4; k++) {
          const th = 1.82 + k * 0.13, ph = phiC + 0.35 * (s < 0 ? 1 : -1);
          const d = V(-Math.cos(ph) * Math.sin(th) * sc[0], Math.cos(th) * sc[1], Math.sin(ph) * Math.sin(th) * sc[2]).multiplyScalar(1.02);
          kit.add(stud, k === 0 ? 'cyan' : 'chrome', T(d.add(A(3.3, 0.45))));
        }
        const vent = new THREE.BoxGeometry(0.35 * S, 0.5 * S, 2.2 * S);
        const ph = phiC - 0.3 * (s < 0 ? 1 : -1), th = 2.05;
        const d = V(-Math.cos(ph) * Math.sin(th) * sc[0], Math.cos(th) * sc[1], Math.sin(ph) * Math.sin(th) * sc[2]).multiplyScalar(1.01).add(A(3.3, 0.45));
        kit.add(vent, 'black', T(d, [0, 0, s * 0.5]));
      }
      // the chrome side bolt above the plate (inside a ring of black fur)
      const boltDir = V(s, 0.32, 0.05).normalize();
      const bp = V(boltDir.x * R0[0] * 1.08, boltDir.y * R0[1] * 1.08, boltDir.z * R0[2] * 1.08);
      kit.add(cylBetween(bp.clone().multiplyScalar(0.92), bp.clone().multiplyScalar(1.08), 0.85 * S, 0.8 * S, hero ? 16 : 8), 'chrome');
      kit.add(cylBetween(bp.clone().multiplyScalar(1.07), bp.clone().multiplyScalar(1.1), 0.42 * S, 0.42 * S, 10), 'blueLens');
    }
    // flight drives: chrome drums at the wing roots, with gear rings
    const gear = gearGeometry({ teeth: 20, module: 0.24 * S, thickness: 0.45 * S, spokes: 0, bevel: false });
    for (const s of sides) {
      const root = A(K.wingRoot[0], K.wingRoot[1], s * K.wingRoot[2]);
      const axis = V(s * 0.9, 0.42, -0.2).normalize();
      // big chrome motor drums standing proud of the fur (an APX-9 signature)
      const inner = root.clone().addScaledVector(axis, -2.6 * S);
      const outer = root.clone().addScaledVector(axis, 0.45 * S);
      kit.add(cylBetween(inner, outer, 2.25 * S, 2.0 * S, hero ? 28 : 10), 'chrome');
      for (const k of [0.45, 1.05, 1.65]) kit.add(cylBetween(inner.clone().addScaledVector(axis, k * S), inner.clone().addScaledVector(axis, (k + 0.28) * S), 2.42 * S, 2.42 * S, hero ? 28 : 10), k === 1.05 ? 'black' : 'gunmetal');
      const q = new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), axis);
      if (hero) kit.add(gear, 'steel', T(inner.clone().addScaledVector(axis, 2.35 * S), q));
      kit.add(cylBetween(outer, outer.clone().addScaledVector(axis, 0.3 * S), 1.5 * S, 1.35 * S, hero ? 20 : 8), 'gold');
    }
    // pollination drum under the thorax, brush toward the head
    const pc = K.pollination;
    const drumC = A(pc.c[0], pc.c[1]);
    const r = pc.r, L = pc.len;
    const prof = [[-L / 2, 0.2], [-L / 2 + 0.05, r * 0.85], [-L / 2 + 0.4, r], [L / 2 - 1.3, r], [L / 2 - 1.2, r * 1.08], [L / 2 - 0.5, r * 1.08], [L / 2 - 0.4, r * 0.9], [L / 2, r * 0.9]].map(([z, rr]) => [z * S, rr * S]);
    kit.add(revolve(prof, hero ? 28 : 12), 'yellow', T(drumC));
    for (const z of [-L / 2 + 0.6, L / 2 - 1.25, L / 2 - 0.45]) kit.add(new THREE.TorusGeometry(r * 1.06 * S, 0.14 * S, 6, hero ? 28 : 12), z > 0 ? 'chrome' : 'gunmetal', T(drumC.clone().add(V(0, 0, z * S))));
    kit.add(cylBetween(drumC.clone().add(V(0, 0, (L / 2 - 1.15) * S)), drumC.clone().add(V(0, 0, (L / 2 - 0.55) * S)), r * 1.12 * S, r * 1.12 * S, hero ? 28 : 12), 'black');
    kit.add(cylBetween(drumC.clone().add(V(0, 0, (L / 2 - 0.05) * S)), drumC.clone().add(V(0, 0, (L / 2 + 0.25) * S)), r * 0.75 * S, r * 0.7 * S, 16), 'gold');
    // hip mounts: chrome collars with struts up into the thorax
    for (const leg of K.legs) {
      for (const s of sides) {
        const c = A(leg.coxa[0], leg.coxa[1], s * leg.coxa[2]);
        kit.add(cylBetween(c.clone().add(V(0, 0.07, 0)), c.clone().add(V(0, -0.02, 0)), 0.85 * S, 0.95 * S, hero ? 16 : 8), 'chrome');
        kit.add(new THREE.TorusGeometry(0.95 * S, 0.16 * S, 5, 14), 'gold', T(c.clone().add(V(0, 0.07, 0)), [Math.PI / 2, 0, 0]));
        if (hero) for (const dz of [-0.45, 0.45]) kit.add(cylBetween(c.clone().add(V(-s * 0.15 * S, 0.05, dz * S)), c.clone().add(V(-s * 0.6 * S, 0.22, dz * S)), 0.16 * S, 0.16 * S, 6), 'chrome');
      }
    }
    const m = kit.mesh(this.M.body);
    this.body.add(m);

    // dense yellow fur over the thorax (not under the plates, drives, collars)
    const drives = sides.map((s) => A(K.wingRoot[0], K.wingRoot[1], s * K.wingRoot[2]).normalize());
    const bolts = sides.map((s) => V(s, 0.32, 0.05).normalize());
    const sample = (rn) => {
      const z = rn() * 2 - 1, a = rn() * TAU, sq = Math.sqrt(1 - z * z);
      const d = V(sq * Math.cos(a), z, sq * Math.sin(a)); // unit direction (x side, y, z long)
      if (d.y < -0.5) return null;
      if (d.z > 0.8 || d.z < -0.8) return null;
      if (Math.abs(d.x) > 0.55 && d.y < -0.1 && d.y > -0.75 && d.z > -0.5 && d.z < 0.55) return null; // plates
      for (const dv of drives) if (d.distanceTo(dv) < 0.42) return null;
      let black = false;
      for (const b of bolts) { const db = d.distanceTo(b); if (db < 0.13) return null; if (db < 0.34) black = true; }
      const p = V(d.x * R0[0], d.y * R0[1], d.z * R0[2]);
      const n = V(d.x / R0[0], d.y / R0[1], d.z / R0[2]).normalize();
      const comb = V(0, 0.25, -1);
      const t = comb.addScaledVector(n, -comb.dot(n)).normalize();
      return { p, n, t, c: furColor(rn, black), l: black ? 0.8 : 1 };
    };
    const fur = new THREE.Mesh(furGeometry({ seed: 11, count: Math.round(8000 * this.furScale), sample, length: 1.05 * S, width: (this.hero ? 0.15 : 0.3) * S, bend: 0.45, lean: 0.5, segments: this.hero ? 3 : 2 }), this.M.fur);
    fur.castShadow = false;
    this.body.add(fur);

    // the golden pollen brush on the front of the drum (glows as it gathers)
    const brushC = drumC.clone().add(V(0, 0, (L / 2 + 0.25) * S));
    const brushSample = (rn) => {
      const rr = Math.sqrt(rn()) * r * 0.85 * S, a = rn() * TAU;
      const p = brushC.clone().add(V(Math.cos(a) * rr, Math.sin(a) * rr, 0));
      const radial = V(Math.cos(a), Math.sin(a), 0);
      return { p, n: V(0, 0, 1).addScaledVector(radial, 0.9 * (rr / (r * S))).normalize(), t: radial, c: lin(rn() < 0.5 ? '#f4c21e' : '#e4a817') };
    };
    const brushGeo = furGeometry({ seed: 12, count: this.hero ? 900 : 120, sample: brushSample, length: 1.5 * S, width: (this.hero ? 0.12 : 0.3) * S, bend: 0.2, lean: 0.2, segments: 2, rootDark: 0.6 });
    brushGeo.translate(-brushC.x, -brushC.y, -brushC.z);
    this.brush = new THREE.Mesh(brushGeo, this.brushMat);
    this.brush.position.copy(brushC);
    this.brush.castShadow = false;
    this.body.add(this.brush);
    this.brushC = brushC;

    // luminous pollen drawn up from the anthers into the spinning brush
    if (this.hero) {
      const N = 56;
      const R = mk(77);
      this.motes = [];
      for (let i = 0; i < N; i++) {
        this.motes.push({
          start: V((R() - 0.5) * 2.4, -0.95 + R() * 1.1, 1.25 + R() * 1.0),
          seed: R(), rate: 0.4 + R() * 0.4, swirl: (R() - 0.5) * 2, size: 0.03 + R() * 0.026,
        });
      }
      this.moteMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(4.0, 3.0, 1.3) });
      this.moteMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), this.moteMat, N);
      this.moteMesh.castShadow = false;
      this.moteMesh.frustumCulled = false;
      this.body.add(this.moteMesh);
    }
  }

  /* ---------------------------------------------------------------- head */
  _head(hero) {
    const neck = A(K.head.neck[0], K.head.neck[1]);
    const head = new THREE.Group();
    head.position.copy(neck);
    this.body.add(head);
    this.head = head;
    const H = (x, y, side = 0) => A(x, y, side).sub(neck);
    const kit = new Kit();
    const seg = hero ? 36 : 16;
    const hc = H(K.head.c[0], K.head.c[1]);
    const hr = K.head.r;
    kit.add(ell(hr[2] * 0.8 * S, hr[1] * 0.94 * S, hr[0] * S, seg, seg * 0.75), 'yellow', T(hc));
    // neck sleeve
    kit.add(cylBetween(H(7.2, 0.15), H(8.6, 0.1), 2.15 * S, 2.3 * S, seg), 'gunmetal');
    kit.add(new THREE.TorusGeometry(2.25 * S, 0.25 * S, 6, seg), 'chrome', T(H(7.6, 0.15)));
    // compound-eye bezels: thick riveted yellow rings round each eye
    const eyeKit = new Kit();
    const e = K.eye;
    for (const s of [-1, 1]) {
      const ec = H(e.c[0], e.c[1], s * e.c[2]);
      eyeKit.add(ell(e.r[2] * S, e.r[1] * S, e.r[0] * S, hero ? 40 : 18, hero ? 30 : 12), 'black', T(ec));
      const off = -0.3;
      const k = Math.sqrt(1 - (off / e.r[2]) ** 2);
      const ring = [];
      const n = 40;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU;
        ring.push(ec.clone().add(V(s * off * S, Math.sin(a) * e.r[1] * k * S * 1.02, Math.cos(a) * e.r[0] * k * S * 1.02)));
      }
      const ringGeo = tubeThrough(ring, 0.62 * S, hero ? 80 : 32, hero ? 10 : 6, true);
      // flatten the ring across the eye axis
      ringGeo.translate(-ec.x - s * off * S, 0, 0).scale(0.7, 1, 1).translate(ec.x + s * off * S, 0, 0);
      kit.add(ringGeo, 'yellow');
      if (hero) {
        const rivet = new THREE.SphereGeometry(0.2 * S, 6, 5);
        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * TAU + 0.1;
          kit.add(rivet, 'chrome', T(ec.clone().add(V(s * (off + 0.3) * S, Math.sin(a) * (e.r[1] * k + 0.05) * S, Math.cos(a) * (e.r[0] * k + 0.05) * S))));
        }
      }
    }
    const eyeGeo = eyeKit.geometry();
    this.eyes = new THREE.Mesh(eyeGeo, this.M.eye);
    this.eyes.castShadow = hero;
    head.add(this.eyes);
    // face plate: chrome sensor block with a lens, between the eyes
    kit.add(new THREE.BoxGeometry(1.5 * S, 2.1 * S, 0.7 * S), 'chrome', T(H(13.55, -0.35)));
    kit.add(new THREE.SphereGeometry(0.55 * S, 12, 8), 'lens', T(H(13.95, -0.1)));
    kit.add(new THREE.BoxGeometry(0.9 * S, 0.35 * S, 0.3 * S), 'black', T(H(13.95, -1.0)));
    // ocelli on the crown
    for (const [x, y, z] of K.ocelli) {
      kit.add(new THREE.SphereGeometry(0.42 * S, 10, 8), 'lens', T(H(x, y, z)));
      if (hero) kit.add(new THREE.TorusGeometry(0.48 * S, 0.12 * S, 5, 12), 'chrome', T(H(x, y - 0.05, z), [Math.PI / 2 - 0.3, 0, 0]));
    }
    // probe / mandible arms under the face
    for (const s of [-1, 1]) {
      kit.add(cylBetween(H(12.1, -2.6, s * 0.75), H(12.6, -4.2, s * 0.55), 0.22 * S, 0.17 * S, 6), 'chrome');
      kit.add(cylBetween(H(12.6, -4.2, s * 0.55), H(12.75, -4.8, s * 0.45), 0.2 * S, 0.06 * S, 6), 'black');
    }
    // antenna sockets
    const sockets = [];
    for (const s of [-1, 1]) {
      const b = H(K.antenna.base[0], K.antenna.base[1], s * K.antenna.base[2]);
      kit.add(new THREE.SphereGeometry(0.62 * S, 12, 8), 'chrome', T(b));
      sockets.push({ s, b });
    }
    head.add(kit.mesh(this.M.body));

    // antennae: black-and-gold segmented scape + long curving flagellum with an orange tip
    this.antennae = [];
    const scL = 4.2 * S, flL = 8.8 * S;
    for (const { s, b } of sockets) {
      const scape = new THREE.Group();
      scape.position.copy(b);
      head.add(scape);
      const sk = new Kit();
      sk.add(cylBetween(V(0, 0, 0), V(0, scL, 0), 0.36 * S, 0.32 * S, hero ? 10 : 6), 'black');
      for (const y of [0.25, 0.55, 0.85]) sk.add(cylBetween(V(0, (y - 0.06) * scL, 0), V(0, (y + 0.06) * scL, 0), 0.45 * S, 0.45 * S, hero ? 10 : 6), 'gold');
      sk.add(new THREE.SphereGeometry(0.48 * S, 10, 8), 'chrome', T(V(0, scL, 0)));
      scape.add(sk.mesh(this.M.body));
      const elbow = new THREE.Group();
      elbow.position.y = scL;
      scape.add(elbow);
      const fk = new Kit();
      const pts = [];
      for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(V(0, u * flL, u * u * flL * 0.42)); }
      const curve = new THREE.CatmullRomCurve3(pts);
      fk.add(new THREE.TubeGeometry(curve, hero ? 40 : 14, 0.3 * S, hero ? 8 : 5, false), 'black');
      const nSeg = hero ? 8 : 4;
      for (let i = 1; i < nSeg; i++) {
        const u = i / nSeg;
        const a = curve.getPointAt(Math.max(0, u - 0.012)), c = curve.getPointAt(Math.min(1, u + 0.012));
        fk.add(cylBetween(a, c, 0.36 * S, 0.36 * S, hero ? 8 : 5), 'gold');
      }
      const tip0 = curve.getPointAt(0.95), tip1 = curve.getPointAt(1).addScaledVector(curve.getTangentAt(1), 0.4 * S);
      fk.add(cylBetween(tip0, tip1, 0.34 * S, 0.3 * S, 8), 'orange');
      elbow.add(fk.mesh(this.M.body));
      this.antennae.push({ scape, elbow, s });
    }
  }

  /* ---------------------------------------------------------------- abdomen */
  _abdomen(hero) {
    const ab = K.abdomen;
    const abd = new THREE.Group();
    abd.position.copy(A(ab.origin[0], ab.origin[1]));
    this.body.add(abd);
    this.abdomen = abd;
    const tilt = new THREE.Group();
    tilt.rotation.x = -ab.tilt;
    abd.add(tilt);
    const w = ab.aspect;
    const seg = hero ? 44 : 18;
    const kit = new Kit();
    const Z = (a) => -a * S; // distance behind the petiole → local z
    // petiole joint
    kit.add(cylBetween(V(0, 0, 0.35 * S), V(0, 0, Z(0.5)), 2.1 * S, 2.3 * S, seg), 'chrome');
    // the yellow cuff (hard shell) with chrome rims and the black gauge ring
    const shell = [[0.15, 2.5], [0.4, 3.5], [0.9, 4.4], [1.6, 5.0], [2.5, 5.3], [3.4, 5.35], [3.5, 5.2]];
    kit.add(revolve(shell.slice().reverse().map(([a, r]) => [Z(a), r * S]), seg, { w }), 'yellow');
    kit.add(revolve([[Z(4.2), 4.9 * S], [Z(4.15), 5.32 * S], [Z(3.55), 5.32 * S], [Z(3.5), 5.0 * S]], seg, { w }), 'black');
    for (const a of [3.47, 4.18]) kit.add(new THREE.TorusGeometry(5.4 * S, 0.14 * S, 5, seg), 'chrome', T(V(0, 0, Z(a)), null, [w, 1, 1]));
    kit.add(new THREE.TorusGeometry(2.55 * S, 0.22 * S, 6, seg), 'chrome', T(V(0, 0, Z(0.18)), null, [w, 1, 1]));
    if (hero) {
      // rivets round the cuff and a latch on each side
      const rivet = new THREE.SphereGeometry(0.2 * S, 6, 5);
      for (let i = 0; i < 16; i++) {
        const ph = (i / 16) * TAU;
        kit.add(rivet, 'chrome', T(V(Math.sin(ph) * 5.38 * w * S, Math.cos(ph) * 5.38 * S, Z(3.1))));
      }
      for (const s of [-1, 1]) kit.add(new THREE.BoxGeometry(0.4 * S, 1.0 * S, 1.3 * S), 'chrome', T(V(s * 5.42 * w * S, -1.6 * S, Z(1.9)), [0, 0, s * 0.3]));
    }
    // under-fur body (dark roots under yellow and black fur bands)
    const black = (a) => (a > 5.15 && a < 6.45) || (a > 7.3 && a < 8.5);
    const under = [];
    for (let a = 9.3; a >= 3.9; a -= 0.3) under.push([Z(a), (abdomenR(a) - 0.15) * S]);
    const fy = finish('furRoot').color, fk = finish('furRootDark').color;
    kit.add(revolve(under, seg, { w }), 'furRoot', null, (x, y, z, c) => c.copy(black(-z / S) ? fk : fy));
    // tail module: ribbed black cone in a yellow frame, fins and the stinger probe
    const tail = [];
    for (let a = 11.7; a >= 9.0; a -= 0.15) {
      const rib = Math.round((a - 9.0) / 0.15) % 2 ? 0.0 : 0.22;
      tail.push([Z(a), (abdomenR(a) + 0.1 + rib) * S]);
    }
    tail.push([Z(8.9), (abdomenR(8.9) - 0.4) * S]);
    kit.add(revolve(tail, hero ? 28 : 12, { w }), 'black');
    kit.add(new THREE.TorusGeometry((abdomenR(9.0) + 0.4) * S, 0.2 * S, 6, seg), 'chrome', T(V(0, 0, Z(9.0)), null, [w, 1, 1]));
    kit.add(new THREE.TorusGeometry((abdomenR(11.5) + 0.3) * S, 0.16 * S, 6, 20), 'chrome', T(V(0, 0, Z(11.5)), null, [w, 1, 1]));
    for (let i = 0; i < 4; i++) {
      const ph = Math.PI / 4 + (i * Math.PI) / 2;
      const p0 = V(Math.sin(ph) * (abdomenR(9.1) + 0.5) * w * S, Math.cos(ph) * (abdomenR(9.1) + 0.5) * S, Z(9.1));
      const p1 = V(Math.sin(ph) * (abdomenR(11.3) + 0.45) * w * S, Math.cos(ph) * (abdomenR(11.3) + 0.45) * S, Z(11.3));
      kit.add(cylBetween(p0, p1, 0.32 * S, 0.3 * S, 4), 'yellow');
      // fins on the diagonals, black with yellow tips
      const fph = (i * Math.PI) / 2;
      const fr = abdomenR(11.0);
      const dir = V(Math.sin(fph), Math.cos(fph), 0);
      const fc = V(0, 0, Z(10.9)).addScaledVector(dir, (fr + 0.9) * S);
      const fq = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir);
      kit.add(new THREE.BoxGeometry(0.15 * S, 1.8 * S, 1.2 * S), 'black', T(fc, fq));
      kit.add(new THREE.BoxGeometry(0.2 * S, 0.45 * S, 1.25 * S), 'yellow', T(fc.clone().addScaledVector(dir, 1.0 * S), fq));
    }
    // stinger probe
    const tipL = V(0, -1.43 * S, Z(13.64));
    kit.add(cylBetween(V(0, -0.2 * S, Z(11.4)), tipL, 0.55 * S, 0.02 * S, hero ? 12 : 6), 'chrome');
    kit.add(cylBetween(V(0, -0.15 * S, Z(11.3)), V(0, -0.35 * S, Z(12.0)), 0.75 * S, 0.65 * S, hero ? 12 : 6), 'gunmetal');
    tilt.add(kit.mesh(this.M.body));

    // pollen gauge: LED bars on the black cuff ring that fill amber as pollen is gathered
    const gauge = new Kit();
    for (const s of [-1, 1]) gauge.add(revolve([[Z(4.05), 5.36 * S], [Z(3.62), 5.36 * S]], 16, { w, phi0: s > 0 ? Math.PI * 0.62 : -Math.PI * 0.62, phiLen: s > 0 ? -Math.PI * 0.42 : Math.PI * 0.42 }), 'cyan');
    this.gauge = new THREE.Mesh(gauge.geometry(), this.gaugeMat);
    this.gauge.castShadow = false;
    tilt.add(this.gauge);

    // fur: yellow, black, yellow, black, yellow between the cuff and the tail
    const sample = (rn) => {
      // area-weighted a
      const a = 4.15 + rn() * 5.1;
      const R = abdomenR(a);
      if (rn() > R / 5.0) return null;
      const ph = rn() * TAU;
      const sx = Math.sin(ph), cy = Math.cos(ph);
      const p = V(R * w * sx * S, R * cy * S, Z(a));
      const dR = (abdomenR(a + 0.05) - abdomenR(a - 0.05)) / 0.1;
      const n = V(sx / w, cy, dR).normalize();
      const comb = V(0, -0.1, -1);
      const t = comb.addScaledVector(n, -comb.dot(n)).normalize();
      return { p, n, t, c: furColor(rn, black(a)), l: 1 - 0.25 * clamp((a - 8.4) / 0.9) };
    };
    const fur = new THREE.Mesh(furGeometry({ seed: 21, count: Math.round(11000 * this.furScale), sample, length: 1.15 * S, width: (this.hero ? 0.16 : 0.34) * S, bend: 0.6, lean: 0.7, segments: this.hero ? 3 : 2 }), this.M.fur);
    fur.castShadow = false;
    tilt.add(fur);
  }

  /* ---------------------------------------------------------------- wings */
  _wings(hero) {
    const wp = wingParts(hero);
    this.wings = [];
    this.wings.fans = [];
    for (const s of [-1, 1]) {
      const hinge = new THREE.Group();
      hinge.position.copy(A(K.wingRoot[0], K.wingRoot[1], s * K.wingRoot[2]));
      const w = new THREE.Group();
      const frame = new THREE.Mesh(wp.frame, this.M.body);
      frame.castShadow = hero;
      frame.receiveShadow = true;
      const mem = new THREE.Mesh(wp.membrane, this.M.membrane);
      mem.renderOrder = 3;
      w.add(frame, mem);
      if (s < 0) w.scale.x = -1;
      hinge.add(w);
      this.body.add(hinge);
      this.wings.push({ hinge, s, fore: true, mesh: w });
      const fan = strokeFan(wp.span * 1.02, 2.2, '#f4e6c8');
      fan.position.copy(hinge.position);
      fan.rotation.set(0, s > 0 ? 0 : Math.PI, 0.18);
      this.body.add(fan);
      this.wings.fans.push(fan);
    }
  }

  /* ---------------------------------------------------------------- legs */
  _legs(hero) {
    this.legs = [];
    // femur, tibia, tarsus lengths (film units): front, mid, hind
    const LEN = [[0.5, 0.52, 0.42], [0.54, 0.58, 0.46], [0.6, 0.68, 0.5]];
    for (let pair = 0; pair < 3; pair++) {
      for (const s of [-1, 1]) {
        const c = K.legs[pair].coxa;
        const root = new THREE.Group();
        root.position.copy(A(c[0], c[1], s * c[2]));
        this.body.add(root);
        const joints = [];
        let parent = root;
        const L = LEN[pair];
        for (let i = 0; i < 3; i++) {
          const j = new THREE.Group();
          parent.add(j);
          const kit = new Kit();
          this._legSegment(kit, i, L[i], s, pair, hero);
          j.add(kit.mesh(this.M.body, { shadow: hero }));
          const next = new THREE.Group();
          next.position.y = L[i];
          j.add(next);
          joints.push(j);
          parent = next;
        }
        const rec = { leg: { root, joints }, s, pair };
        if (pair === 2) {
          // pollen brush and the pollen load on the hind tibia
          const tib = joints[1];
          const d = -s; // dorsal side in the joint frame
          const Lt = L[1];
          const brushSample = (rn) => {
            const y = (0.12 + rn() * 0.8) * Lt;
            const a = rn() * TAU;
            const back = Math.cos(a), dor = Math.sin(a);
            if (back > 0.35) return null; // bristles on the back and outer faces
            const p = V(d * dor * 0.055, y, back * 0.05);
            const n = V(d * dor, 0, back).normalize();
            return { p, n, t: V(0, 1, 0), c: furColor(rn, false), l: 0.7 + 0.6 * Math.sin((y / Lt) * Math.PI) };
          };
          const brush = new THREE.Mesh(furGeometry({ seed: 31 + (s > 0 ? 1 : 0), count: hero ? Math.round(500 * this.furScale) : 0, sample: brushSample, length: 1.1 * S, width: 0.14 * S, bend: 0.5, lean: 0.6, segments: 2 }), this.M.fur);
          brush.castShadow = false;
          if (hero) tib.add(brush);
          const load = new THREE.Mesh(pollenClump(hero), this.pollenMat);
          load.position.set(d * 0.075, Lt * 0.5, -0.045);
          load.castShadow = false;
          tib.add(load);
          rec.basket = load;
        }
        this.legs.push(rec);
      }
    }
  }

  // one leg segment in its joint frame: +Y along the segment, knee hinge about Z,
  // dorsal side toward −s·X
  _legSegment(kit, i, L, s, pair, hero) {
    const d = -s;
    const seg = hero ? 12 : 6;
    if (i === 0) {
      // hip collar
      kit.add(cylBetween(V(0, -0.03, 0), V(0, 0.05, 0), 0.07, 0.07, seg), 'chrome');
      kit.add(new THREE.TorusGeometry(0.07, 0.012, 5, seg), 'gold', T(V(0, 0.05, 0), [Math.PI / 2, 0, 0]));
      // femur: chunky yellow armour with a black underside panel and a chrome piston
      kit.add(cylBetween(V(d * 0.012, 0.06, 0), V(d * 0.012, L * 0.92, 0), 0.075, 0.06, seg), 'yellow', null);
      kit.add(new THREE.BoxGeometry(0.05, L * 0.62, 0.085), 'black', T(V(-d * 0.055, L * 0.5, 0)));
      kit.add(cylBetween(V(-d * 0.085, L * 0.18, 0.035), V(-d * 0.085, L * 0.86, 0.035), 0.013, 0.013, 6), 'chrome');
      if (hero) {
        kit.add(helix(V(-d * 0.085, L * 0.3, 0.035), L * 0.32, 0.024, 7, 0.006), 'steel');
        kit.add(new THREE.BoxGeometry(0.04, L * 0.3, 0.03), 'gunmetal', T(V(d * 0.07, L * 0.45, 0)));
      }
      // chrome knee wheel with gear rings and a gold hub
      kit.add(cylBetween(V(0, L, -0.07), V(0, L, 0.07), 0.068, 0.068, hero ? 18 : 8), 'chrome');
      if (hero) {
        const g = gearGeometry({ teeth: 14, module: 0.0095, thickness: 0.026, spokes: 0, bevel: false });
        for (const z of [-0.06, 0.06]) kit.add(g, 'steel', T(V(0, L, z)));
      }
      kit.add(cylBetween(V(0, L, -0.082), V(0, L, 0.082), 0.03, 0.03, 10), 'gold');
    } else if (i === 1) {
      kit.add(cylBetween(V(d * 0.01, 0.04, 0), V(d * 0.01, L * 0.9, 0), 0.07, 0.052, seg), 'yellow');
      kit.add(new THREE.BoxGeometry(0.05, L * 0.5, 0.11), 'yellow', T(V(d * 0.04, L * 0.42, 0)));
      kit.add(new THREE.BoxGeometry(0.04, L * 0.55, 0.07), 'black', T(V(-d * 0.045, L * 0.45, 0)));
      kit.add(cylBetween(V(-d * 0.07, L * 0.12, -0.03), V(-d * 0.06, L * 0.8, -0.03), 0.011, 0.011, 6), 'chrome');
      if (hero) kit.add(helix(V(-d * 0.07, L * 0.15, -0.03), L * 0.22, 0.02, 6, 0.005), 'steel');
      // ankle ring
      kit.add(cylBetween(V(0, L * 0.9, 0), V(0, L * 1.02, 0), 0.05, 0.044, seg), 'chrome');
    } else {
      // tarsus: black segments with gold rings, ending in a gold clamp foot
      const n = hero ? 4 : 3;
      for (let k = 0; k < n; k++) {
        const y0 = (k / n) * L, y1 = ((k + 1) / n) * L;
        kit.add(cylBetween(V(0, y0 + 0.008, 0), V(0, y1 - 0.008, 0), 0.034 - k * 0.003, 0.028 - k * 0.003, hero ? 8 : 5), 'black');
        kit.add(cylBetween(V(0, y1 - 0.014, 0), V(0, y1 + 0.008, 0), 0.038 - k * 0.003, 0.038 - k * 0.003, hero ? 8 : 5), 'gold');
      }
      kit.add(cylBetween(V(0, L, 0), V(0, L + 0.025, 0), 0.05, 0.05, hero ? 14 : 6), 'gold');
      kit.add(cylBetween(V(0, L + 0.025, 0), V(0, L + 0.045, 0), 0.043, 0.04, hero ? 14 : 6), 'rubber');
      if (hero) {
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * TAU + Math.PI / 4;
          const out = V(Math.cos(a), 0, Math.sin(a));
          const p0 = V(0, L + 0.02, 0).addScaledVector(out, 0.045);
          const p1 = p0.clone().addScaledVector(out, 0.03).add(V(0, 0.035, 0));
          const p2 = p1.clone().addScaledVector(out, -0.012).add(V(0, 0.02, 0));
          kit.add(cylBetween(p0, p1, 0.008, 0.007, 4), 'gold');
          kit.add(cylBetween(p1, p2, 0.007, 0.002, 4), 'gold');
        }
      }
    }
  }

  // pose: { t, flap (0..1 wing activity), grip (0 tucked → 1 standing),
  //         walk (phase or null), pitch, roll, look (head yaw), pollen, fold, freq }
  setPose({ t = 0, flap = 0, grip = 0, walk = null, pitch = 0, roll = 0, look = 0, pollen = 0, fold = 0, freq = 23.7, collect: collect_ = null, brush = null, fan = 1 }) {
    this.pollen = pollen;
    this.body.rotation.set(pitch, 0, roll, 'YXZ');
    this.head.rotation.set(Math.sin(t * 2.3) * 0.04 - grip * 0.05, look, 0);
    // wings: flap about the body axis with a figure-eight sweep; folded at rest
    const beat = t * freq * TAU;
    const amp = 1.05 * flap;
    for (const w of this.wings) {
      const flapA = Math.sin(beat) * amp;
      const sweep = Math.cos(beat) * 0.45 * flap;
      // folded wings lie swept back over the abdomen, lifted clear of the fur
      const back = lerp(0.12, 1.42, fold) + sweep;
      const up = lerp(0.22, 0.13, fold) + flapA;
      w.hinge.rotation.set(0, w.s * back, w.s * up, 'YZX');
    }
    for (const f of this.wings.fans) f.material.opacity = 0.045 * fan * clamp((flap - 0.5) * 2);
    // abdomen breathing
    const pump = Math.sin(t * 3.1) * 0.025;
    this.abdomen.rotation.x = pump + (1 - flap) * 0.03 - flap * 0.04;
    // antennae: forward and out like APX-9's, alert when landing, twitching gently
    for (const a of this.antennae) {
      a.scape.rotation.set(1.0 + Math.sin(t * 4.7 + a.s) * 0.05 - grip * 0.08, 0, -a.s * 0.5);
      a.elbow.rotation.set(0.35 + Math.sin(t * 3.3 + a.s * 2) * 0.08 + grip * 0.2, 0, a.s * 0.12);
    }
    // legs
    for (const r of this.legs) {
      const { leg, s, pair } = r;
      // femur direction: out to the side, raised (insect stance) or dropped
      // below horizontal (tucked in flight), swung forward (front pair) or
      // back (hind pair); knees bend about local Z
      const fwdGrip = [1.0, 0.12, -0.95][pair];
      const fwdTuck = [0.45, -0.2, -0.8][pair];
      let fwd, drop, k1, k2;
      if (walk !== null) {
        const ph = walk * TAU + ((pair + (s > 0 ? 0 : 1)) % 2 ? Math.PI : 0);
        const lift = Math.max(0, Math.sin(ph));
        fwd = fwdGrip + Math.cos(ph) * 0.3;
        drop = -0.35 - lift * 0.3;
        k1 = 1.85 + lift * 0.15;
        k2 = -0.75 + lift * 0.4;
      } else {
        fwd = lerp(fwdTuck, fwdGrip, grip);
        drop = lerp(0.95, -0.35, grip);
        k1 = lerp(1.0, 1.85, grip) + Math.sin(t * 2 + pair) * 0.04 * (1 - grip);
        k2 = lerp(0.45, -0.75, grip);
      }
      leg.root.rotation.set(0, 0, 0);
      leg.joints[0].rotation.set(0, -s * fwd, -s * (Math.PI / 2 + drop), 'YZX');
      leg.joints[1].rotation.set(0, 0, -s * k1);
      leg.joints[2].rotation.set(0, 0, -s * k2);
    }
    // pollen: the hind-leg loads swell and glow, the drum brush lights, the gauge fills
    const pg = this.pollen;
    for (const r of this.legs) {
      if (!r.basket) continue;
      r.basket.visible = pg > 0.02;
      r.basket.scale.setScalar(0.3 + pg * 0.9);
    }
    this.pollenMat.emissiveIntensity = 0.6 + pg * 3.2;
    this.brushMat.emissiveIntensity = pg * 0.45;
    // the brush spins while it gathers; motes stream in only while collecting
    // (interactive modes pass `collect` explicitly: gathering happens at any load)
    const collect = collect_ ?? clamp(pg * 6) * clamp((1 - pg) * 6) * (1 - flap);
    this.brush.rotation.z = brush ?? t * (2 + collect * 14);
    if (this.moteMesh) {
      const m4 = this._m4 || (this._m4 = new THREE.Matrix4());
      const p = V(), q = new THREE.Quaternion();
      this.motes.forEach((m, i) => {
        const ph = (t * m.rate + m.seed) % 1;
        const k = ph * ph * (3 - 2 * ph);
        p.copy(m.start).lerp(this.brushC, k);
        const a = ph * 9 + m.seed * TAU, rr = (1 - k) * 0.12 * m.swirl;
        p.x += Math.cos(a) * rr; p.y += Math.sin(a) * rr * 0.6;
        const sc = collect * m.size * Math.sin(Math.PI * ph);
        m4.compose(p, q, V(sc, sc, sc));
        this.moteMesh.setMatrixAt(i, m4);
      });
      this.moteMesh.instanceMatrix.needsUpdate = true;
      this.moteMesh.visible = collect > 0.001;
    }
    this.gaugeMat.uniforms.uFill.value = pg;
    this.gaugeMat.uniforms.uTime.value = t;
  }
}

// a lumpy clump of luminous pollen (icosphere with seeded bumps)
let clumpCache = {};
function pollenClump(hero) {
  const key = hero ? 'h' : 'l';
  if (clumpCache[key]) return clumpCache[key];
  const g = new THREE.IcosahedronGeometry(1, hero ? 3 : 1);
  const p = g.attributes.position;
  const v = V();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 9.1) * Math.sin(v.y * 7.3 + 1.2) * Math.sin(v.z * 8.7 + 0.4);
    v.multiplyScalar(1 + n * 0.18);
    p.setXYZ(i, v.x * 0.06, v.y * 0.13, v.z * 0.055);
  }
  g.computeVertexNormals();
  clumpCache[key] = g;
  return g;
}

// coil spring along +Y starting at p0
function helix(p0, len, radius, turns, wire) {
  const pts = [];
  const n = turns * 10;
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = u * turns * TAU;
    pts.push(p0.clone().add(V(Math.cos(a) * radius, u * len, Math.sin(a) * radius)));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, wire, 4, false);
}

// LED bar segments: cyan idle, filling amber with gathered pollen
function gaugeMaterial() {
  const m = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const u = { uFill: { value: 0 }, uTime: { value: 0 } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vGuv;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvGuv = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vGuv;\nuniform float uFill, uTime;')
      .replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
        float segs = 7.0;
        float k = vGuv.x * segs;
        float cell = floor(k);
        float gap = smoothstep(0.0, 0.12, fract(k)) * smoothstep(1.0, 0.88, fract(k));
        float lit = step(cell + 0.5, uFill * segs);
        vec3 idle = vec3(0.10, 0.55, 0.75) * (0.55 + 0.15 * sin(uTime * 3.0 + cell));
        vec3 full = vec3(2.4, 1.25, 0.32);
        vec4 diffuseColor = vec4(mix(idle, full, lit) * gap + vec3(0.01), opacity);`);
  };
  m.customProgramCacheKey = () => 'apx9-gauge-v1';
  m.uniforms = u;
  return m;
}
