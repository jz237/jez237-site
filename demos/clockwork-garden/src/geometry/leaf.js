import * as THREE from 'three';

// A parametric enamel leaf evaluated in the vertex shader, so every instance
// has its own shape from two per-instance vec4s and one tiny grid geometry
// serves all of them (one draw call per tile of foliage):
//   aLeaf  = (aspect: half-width / length, outline 0 lanceolate · 0.5 ovate ·
//             1 cordate, cup: margins curl up, arch: rise then droop)
//   aLeaf2 = (fold: V-crease at the midrib, wave: ruffled margin, twist,
//             petiole: share of the length that is stalk)
// Local frame: the stalk is attached at the origin, the leaf runs along +Y
// (length 1, the instance matrix scales it), +Z is the upper face. The grid's
// position.xy is (s along the leaf, v across it, -1 … 1). The CPU twin
// (leafPoint) is used for placement proxies and the overlap check.

export const LEAF_GLSL = /* glsl */ `
  attribute vec4 aLeaf;
  attribute vec4 aLeaf2;
  attribute vec4 aLeaf3; // sway amplitude, wash, phase (shared by a plant), flutter
  float cgLeafW(float u, float ty) {
    float wl = pow(max(sin(3.14159 * pow(u, 0.75)), 0.0), 0.85) * (1.0 - 0.2 * u);
    float wo = pow(max(sin(3.14159 * pow(u, 0.6)), 0.0), 0.7);
    float wc = pow(max(sin(3.14159 * pow(u, 0.48)), 0.0), 0.6);
    return mix(mix(wl, wo, clamp(ty * 2.0, 0.0, 1.0)), wc, clamp(ty * 2.0 - 1.0, 0.0, 1.0));
  }
  vec3 cgLeafP(float s, float v) {
    float pet = aLeaf2.w;
    float u = clamp((s - pet) / (1.0 - pet), 0.0, 1.0);
    float ty = aLeaf.y;
    float bl = step(pet, s);
    float hw = mix(0.016, max(cgLeafW(u, ty), 0.05) * aLeaf.x, bl);
    float x = v * hw;
    float lobe = clamp(ty * 2.0 - 1.0, 0.0, 1.0) * 0.2 * pow(1.0 - u, 3.0) * abs(v) * bl;
    float y = s - lobe;
    float z = aLeaf.z * v * v * hw * (0.45 + 0.55 * sin(3.14159 * min(1.0, u * 1.1)))
            + aLeaf2.x * abs(v) * hw
            + aLeaf.w * (sin(u * 2.83) * 0.12 - u * u * 0.2) * bl
            + aLeaf2.y * abs(v) * hw * sin(u * 19.0 + v * 2.0)
            - 0.015 * pow(1.0 - abs(v), 6.0) * bl * (1.0 - u);
    float tw = aLeaf2.z * u;
    float c = cos(tw), sn = sin(tw);
    return vec3(x * c - z * sn, y, x * sn + z * c);
  }
  vec3 cgLeafPos, cgLeafNrm;
  void cgLeaf(vec2 g) {
    cgLeafPos = cgLeafP(g.x, g.y);
    float e = 0.015;
    vec3 du = cgLeafP(min(g.x + e, 1.0), g.y) - cgLeafP(max(g.x - e, 0.0), g.y);
    vec3 dv = cgLeafP(g.x, g.y + e) - cgLeafP(g.x, g.y - e);
    cgLeafNrm = normalize(cross(dv, du) + vec3(0.0, 0.0, 1e-5));
  }
`;

// CPU twin (must match the GLSL above)
const step = (e, x) => (x < e ? 0 : 1);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const mix = (a, b, k) => a + (b - a) * k;
export function leafW(u, ty) {
  const wl = Math.pow(Math.max(Math.sin(Math.PI * Math.pow(u, 0.75)), 0), 0.85) * (1 - 0.2 * u);
  const wo = Math.pow(Math.max(Math.sin(Math.PI * Math.pow(u, 0.6)), 0), 0.7);
  const wc = Math.pow(Math.max(Math.sin(Math.PI * Math.pow(u, 0.48)), 0), 0.6);
  return mix(mix(wl, wo, clamp01(ty * 2)), wc, clamp01(ty * 2 - 1));
}
// local point of a leaf with params a = [aspect, outline, cup, arch], b = [fold, wave, twist, petiole]
export function leafPoint(a, b, s, v, out = new THREE.Vector3()) {
  const pet = b[3];
  const u = clamp01((s - pet) / (1 - pet));
  const ty = a[1];
  const bl = step(pet, s);
  const hw = mix(0.016, Math.max(leafW(u, ty), 0.05) * a[0], bl);
  const x = v * hw;
  const lobe = clamp01(ty * 2 - 1) * 0.2 * Math.pow(1 - u, 3) * Math.abs(v) * bl;
  const y = s - lobe;
  const z = a[2] * v * v * hw * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.1)))
    + b[0] * Math.abs(v) * hw
    + a[3] * (Math.sin(u * 2.83) * 0.12 - u * u * 0.2) * bl
    + b[1] * Math.abs(v) * hw * Math.sin(u * 19 + v * 2)
    - 0.015 * Math.pow(1 - Math.abs(v), 6) * bl * (1 - u);
  const tw = b[2] * u;
  const c = Math.cos(tw), sn = Math.sin(tw);
  return out.set(x * c - z * sn, y, x * sn + z * c);
}
// half-width (length units) at s
export function leafHalfWidth(a, b, s) {
  const pet = b[3];
  if (s < pet) return 0.016;
  return Math.max(leafW(clamp01((s - pet) / (1 - pet)), a[1]), 0.05) * a[0];
}

// The grid: rows along s (the first row ends the stalk), columns across v.
export const LEAF_ROWS = {
  hi: [0, 0.1, 0.2, 0.31, 0.43, 0.55, 0.67, 0.79, 0.9, 1],
  lo: [0, 0.1, 0.4, 0.7, 1],
};
export const LEAF_COLS = { hi: [-1, -0.5, 0, 0.5, 1], lo: [-1, 0, 1] };

export function leafGrid(level = 'hi') {
  const rows = LEAF_ROWS[level], cols = LEAF_COLS[level];
  const pos = [], uv = [], sp = [], sw = [], idx = [];
  for (const s of rows) {
    for (const v of cols) {
      pos.push(s, v, 0);
      uv.push(clamp01((s - 0.1) / 0.9), (v + 1) / 2);
      sp.push(0, 0, 0);
      sw.push(Math.pow(s, 1.4), Math.min(1, s * 1.5), 0, 0);
    }
  }
  const nc = cols.length;
  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = 0; j < nc - 1; j++) {
      const a = i * nc + j, b = a + 1, c = a + nc, d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(pos.length).fill(0).map((_, i) => (i % 3 === 2 ? 1 : 0)), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('aSwayP', new THREE.Float32BufferAttribute(sp, 3));
  g.setAttribute('aSwayW', new THREE.Float32BufferAttribute(sw, 4));
  g.setIndex(idx);
  return g;
}

// world-space triangles of one leaf instance (for the overlap check)
export function leafTriangles(a, b, m4, level = 'hi') {
  const rows = LEAF_ROWS[level], cols = LEAF_COLS[level];
  const P = [];
  const v3 = new THREE.Vector3();
  for (const s of rows) for (const v of cols) { leafPoint(a, b, s, v, v3).applyMatrix4(m4); P.push(v3.x, v3.y, v3.z); }
  const nc = cols.length, tris = [];
  for (let i = 0; i < rows.length - 1; i++) {
    for (let j = 0; j < nc - 1; j++) {
      const p = i * nc + j, q = p + 1, r = p + nc, t = r + 1;
      tris.push([p, q, t, rows[i]], [p, t, r, rows[i]]);
    }
  }
  return { P, tris };
}
