// CPU-baked fur: tapered, bent ribbon strands merged into one BufferGeometry with vertex colours.
// Strands sit on layer 2 (visible to the main camera only: no shadows, AO or ID pass; give the part an idProxy for selection).
import * as THREE from 'three';
import { rng } from './geo.js';
import { M } from './materials.js';

const _c0 = new THREE.Color(), _c1 = new THREE.Color();

// Fur is double-sided but must keep one consistent shading normal; the stock shader flips it on back faces.
let furPatched = false;
function patchFurMaterial() {
  if (furPatched) return;
  furPatched = true;
  M.fur.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', '')
    );
  };
  M.fur.customProgramCacheKey = () => 'apx-fur-v1';
  M.fur.needsUpdate = true;
}

/**
 * makeFur({ seed, count, sample(rng) -> { p, n, t, c?, l?, w? } | null, length, lengthJitter, width, bend, lean, segments,
 *           colors:{a,b}, rootDark, gravity })
 *  p: surface point (Vector3 or [x,y,z]); n: outward unit normal; t: comb direction (unit, tangent to the surface)
 *  c: optional [r,g,b] linear colour overriding the random blend; l, w: length / width multipliers
 * Returns a Mesh (layer 2 only). Add with part.addMesh(mesh, { layers: [2], cast: false, receive: false, pick: false }).
 */
export function makeFur({
  seed = 1, count = 20000, sample, length = 1.1, lengthJitter = 0.4, width = 0.04, bend = 0.45, lean = 0.35,
  segments = 3, colors = { a: '#f7c31c', b: '#e1a10f' }, rootDark = 0.42, gravity = 0,
} = {}) {
  patchFurMaterial();
  const r = rng(seed);
  const segs = Math.max(2, segments | 0);
  const vPer = 2 * segs + 1;
  const tPer = 2 * (segs - 1) + 1;
  const pos = new Float32Array(count * vPer * 3);
  const nor = new Float32Array(count * vPer * 3);
  const col = new Float32Array(count * vPer * 3);
  const idx = new Uint32Array(count * tPer * 3);
  _c0.set(colors.a); _c1.set(colors.b);

  const p = new THREE.Vector3(), n = new THREE.Vector3(), t = new THREE.Vector3();
  const dir = new THREE.Vector3(), bendV = new THREE.Vector3(), ref = new THREE.Vector3();
  const tan = new THREE.Vector3(), side = new THREE.Vector3(), faceN = new THREE.Vector3(), nn = new THREE.Vector3();
  const pt = new THREE.Vector3(), prev = new THREE.Vector3();

  let made = 0, tries = 0;
  while (made < count && tries < count * 4) {
    tries++;
    const s = sample(r);
    if (!s) continue;
    if (Array.isArray(s.p)) p.set(s.p[0], s.p[1], s.p[2]); else p.copy(s.p);
    n.copy(s.n).normalize();
    t.copy(s.t ?? ref.set(0, 1, 0).cross(n)).normalize();
    const L = length * (s.l ?? 1) * (1 - lengthJitter + r() * lengthJitter * 2);
    const W = width * (s.w ?? 1) * (0.75 + r() * 0.5);
    const lean0 = Math.min(1, Math.max(0, lean * (0.6 + r() * 0.8)));
    dir.copy(n).multiplyScalar(1 - lean0).addScaledVector(t, lean0);
    dir.x += (r() - 0.5) * 0.5; dir.y += (r() - 0.5) * 0.5; dir.z += (r() - 0.5) * 0.5;
    dir.normalize();
    bendV.copy(t).multiplyScalar(bend * (0.6 + r() * 0.8));
    bendV.y -= gravity;
    ref.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize();

    // colour
    let cr, cg, cb;
    if (s.c) { cr = s.c[0]; cg = s.c[1]; cb = s.c[2]; }
    else { const k = r(); cr = _c0.r + (_c1.r - _c0.r) * k; cg = _c0.g + (_c1.g - _c0.g) * k; cb = _c0.b + (_c1.b - _c0.b) * k; }
    const vary = 0.86 + r() * 0.28;
    cr *= vary; cg *= vary; cb *= vary;

    const vb = made * vPer;
    prev.copy(p);
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      pt.copy(p).addScaledVector(dir, L * u).addScaledVector(bendV, L * u * u);
      tan.copy(pt).sub(prev);
      if (tan.lengthSq() < 1e-12) tan.copy(dir); tan.normalize();
      prev.copy(pt);
      side.crossVectors(tan, ref);
      if (side.lengthSq() < 1e-8) side.crossVectors(tan, n);
      side.normalize();
      faceN.crossVectors(tan, side).normalize();
      nn.copy(n).multiplyScalar(0.72).addScaledVector(faceN, faceN.dot(n) < 0 ? -0.28 : 0.28).normalize();
      const shade = rootDark + (1 - rootDark) * Math.pow(u, 0.7);
      const taper = i === segs ? 0 : W * (1 - 0.82 * u) * 0.5;
      const rings = i === segs ? 1 : 2;
      for (let k = 0; k < rings; k++) {
        const vi = vb + (i === segs ? 2 * segs : 2 * i + k);
        const sgn = k === 0 ? -1 : 1;
        pos[vi * 3] = pt.x + side.x * taper * sgn; pos[vi * 3 + 1] = pt.y + side.y * taper * sgn; pos[vi * 3 + 2] = pt.z + side.z * taper * sgn;
        nor[vi * 3] = nn.x; nor[vi * 3 + 1] = nn.y; nor[vi * 3 + 2] = nn.z;
        col[vi * 3] = cr * shade; col[vi * 3 + 1] = cg * shade; col[vi * 3 + 2] = cb * shade;
      }
    }
    // indices
    let ti = made * tPer * 3;
    for (let i = 0; i < segs - 1; i++) {
      const a = vb + 2 * i, b = a + 1, c = a + 2, d = a + 3;
      idx[ti++] = a; idx[ti++] = c; idx[ti++] = b;
      idx[ti++] = b; idx[ti++] = c; idx[ti++] = d;
    }
    const a = vb + 2 * (segs - 1), b = a + 1, tip = vb + 2 * segs;
    idx[ti++] = a; idx[ti++] = tip; idx[ti++] = b;
    made++;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(made === count ? pos : pos.slice(0, made * vPer * 3), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(made === count ? nor : nor.slice(0, made * vPer * 3), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(made === count ? col : col.slice(0, made * vPer * 3), 3));
  geo.setIndex(new THREE.BufferAttribute(made === count ? idx : idx.slice(0, made * tPer * 3), 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  const mesh = new THREE.Mesh(geo, M.fur);
  mesh.userData.fur = true;
  mesh.layers.disableAll();
  mesh.layers.enable(2);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

/** Sample a point on an ellipsoid surface with a comb direction: helper for thorax / abdomen fur. */
export function ellipsoidSampler({ center, radii, region, comb = [-1, 0, 0], color }) {
  const c = new THREE.Vector3(...(Array.isArray(center) ? center : [center.x, center.y, center.z]));
  const rr = Array.isArray(radii) ? radii : [radii.x, radii.y, radii.z];
  const combV = new THREE.Vector3(...comb).normalize();
  return (r) => {
    // uniform direction on the sphere
    const z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    const d = new THREE.Vector3(s * Math.cos(a), z, s * Math.sin(a));
    if (region && !region(d)) return null;
    const p = new THREE.Vector3(d.x * rr[0], d.y * rr[1], d.z * rr[2]).add(c);
    const n = new THREE.Vector3(d.x / rr[0], d.y / rr[1], d.z / rr[2]).normalize();
    const t = combV.clone().addScaledVector(n, -combV.dot(n));
    if (t.lengthSq() < 1e-4) t.set(0, 1, 0).addScaledVector(n, -n.y);
    t.normalize();
    const out = { p, n, t };
    if (color) out.c = color(d, p, r);
    return out;
  };
}
