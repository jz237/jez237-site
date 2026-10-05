import * as THREE from 'three';
import { LEAF_GLSL } from '../geometry/leaf.js';

// The living garden: one coherent breeze for every leaf, frond, stem, bloom,
// ivy swag and lantern, plus the wing-wash of APX-9 (and the push of the
// interactive cameras) bending nearby foliage aside with a springy recovery.
//
// Everything is driven by uniforms set once a frame from a clock (the film's
// t, or the explore clock), so the film stays a pure function of t:
//   · gusts: bands of stronger wind that travel down the house from the open
//     doors (a smooth field of position and time), so a gust visibly crosses
//     the beds instead of every leaf jiggling on its own;
//   · each part bends about its own pivot (its stalk, petiole or hinge) by an
//     angle, and keeps its length (the bent vertex is put back on its sphere
//     round the pivot), with stiffness by part (profiles below);
//   · wing-wash: a trail of APX-9's recent positions with the weights of a
//     damped spring's response, so leaves bend away as it passes, swing back
//     past rest and settle; a hard clamp keeps every vertex out of the bee's
//     body and out of the lens.
// Vertex work only (onBeforeCompile on the existing materials, and matching
// depth materials so shadows move with the geometry); colliders stay static.

const N_WASH = 10;
// ages (seconds) of the trail samples: dense near now, sparse later
export const WASH_AGES = [0, 0.035, 0.075, 0.12, 0.17, 0.23, 0.3, 0.39, 0.5, 0.64];

const dir = new THREE.Vector2(0.26, -0.966).normalize(); // in through the near doors, down the house

export const WIND = {
  dir,
  strength: 1,
  u: {
    uWindT: { value: 0 },
    uWind: { value: new THREE.Vector4(dir.x, dir.y, 1, 0) }, // xy direction, z strength
    uWashS: { value: Array.from({ length: N_WASH }, () => new THREE.Vector4(0, -1e5, 0, 0)) },
    uWashP: { value: new THREE.Vector4(5.5, 1.1, 2.2, 0) }, // reach, inner radius, downwash, on
    uWashB: { value: new THREE.Vector4(0, -1e5, 0, 0) }, // bound of the trail (centre, radius)
    uCamP: { value: new THREE.Vector4(0, -1e5, 0, 0) }, // camera, push radius (0: off)
    uCamT: { value: new THREE.Vector4(0, -1e5, 0, 0) }, // what it looks at (APX-9), sightline radius
    uClampA: { value: new THREE.Vector4(0, -1e5, 0, 0) }, // bee body: centre, radius
    uClampB: { value: new THREE.Vector4(0, -1e5, 0, 0) }, // lens: centre, radius
  },
};

// stiffness by part. k: [gust bend (rad), sway (rad), sway freq (rad/s), flutter (rad)]
//                    k2: [wash gain (rad), flutter freq (rad/s), max angle (rad), swing (units)]
export const PROFILES = {
  leaf: { k: [0.09, 0.045, 2.1, 0.045], k2: [0.85, 9.0, 0.95, 0] },
  smallLeaf: { k: [0.13, 0.06, 2.6, 0.05], k2: [1.0, 11.0, 1.1, 0] },
  dome: { k: [0.06, 0.035, 2.3, 0.05], k2: [0.7, 10.0, 0.8, 0] },
  fern: { k: [0.09, 0.045, 1.7, 0.04], k2: [0.6, 8.0, 0.7, 0] },
  palm: { k: [0.04, 0.022, 1.05, 0.035], k2: [0.25, 6.0, 0.4, 0] },
  ivy: { k: [0.06, 0.04, 2.4, 0.08], k2: [0.8, 10.0, 0.9, 2.2] },
  vine: { k: [0, 0, 1, 0], k2: [0, 1, 0, 2.2] },
  petal: { k: [0, 0, 1, 0.025], k2: [0.55, 8.0, 0.6, 0] },
  rose: { k: [0.03, 0.02, 2.0, 0.02], k2: [0.4, 7.0, 0.5, 0] },
  hero: { k: [0.025, 0.012, 1.6, 0.012], k2: [0.35, 7.0, 0.35, 0] },
};
for (const p of Object.values(PROFILES)) {
  p.u = { uSwayK: { value: new THREE.Vector4(...p.k) }, uSwayK2: { value: new THREE.Vector4(...p.k2) } };
}

// ---- the gust field (GLSL and its CPU twin must match) ----------------------
const GUST_GLSL = /* glsl */ `
  float cgGust(vec2 p, float t) {
    vec2 d = uWind.xy;
    vec2 s = vec2(-d.y, d.x);
    float al = dot(p, d), ac = dot(p, s);
    float a = al * 0.011 - t * 0.9 + 1.6 * sin(ac * 0.0075 + t * 0.11);
    float b = al * 0.026 - t * 1.7 + 1.1 * sin(ac * 0.017 - t * 0.23 + 1.3);
    float g = 0.5 + 0.5 * sin(a);
    float h = 0.5 + 0.5 * sin(b);
    return g * g * (0.55 + 0.45 * h);
  }`;
export function gust(x, z, t) {
  const d = WIND.dir;
  const al = x * d.x + z * d.y, ac = -x * d.y + z * d.x;
  const a = al * 0.011 - t * 0.9 + 1.6 * Math.sin(ac * 0.0075 + t * 0.11);
  const b = al * 0.026 - t * 1.7 + 1.1 * Math.sin(ac * 0.017 - t * 0.23 + 1.3);
  const g = 0.5 + 0.5 * Math.sin(a);
  const h = 0.5 + 0.5 * Math.sin(b);
  return g * g * (0.55 + 0.45 * h);
}

// CPU twin of the shader's bend for a rigid part (flower heads on brass
// stems, lanterns): the angle vector (radians, horizontal) at pivot (x, z)
export function bendAngle(x, z, t, k, phase, out) {
  const g = gust(x, z, t);
  const d = WIND.dir, s = WIND.strength;
  const o1 = Math.sin(t * k[2] + phase);
  const o2 = Math.sin(t * k[2] * 1.41 + phase * 1.7 + 1.0);
  const a = k[0] * g + (o1 * k[1]) * (0.3 + g);
  const b = (o2 * 0.7 * k[1]) * (0.3 + g);
  out.x = (d.x * a - d.y * b) * s;
  out.z = (d.y * a + d.x * b) * s;
  out.y = -0.3 * k[0] * g * s;
  return out;
}

// CPU twin of the wash at point p: a push vector (unit-ish, summed over the
// trail with the spring weights)
const _q = new THREE.Vector3();
export function washAt(p, out) {
  out.set(0, 0, 0);
  const P = WIND.u.uWashP.value, Bd = WIND.u.uWashB.value;
  if (P.w <= 0) return out;
  if (Math.hypot(p.x - Bd.x, p.y - Bd.y, p.z - Bd.z) > Bd.w) return out;
  for (const s of WIND.u.uWashS.value) {
    if (s.w === 0) continue;
    _q.set(p.x - s.x, p.y - s.y, p.z - s.z);
    const ey = _q.y * (_q.y < 0 ? 0.55 : 1.3);
    const dd = Math.hypot(_q.x, ey, _q.z);
    const f = 1 - smoothstep(P.y, P.x, dd);
    if (f <= 0) continue;
    _q.y -= P.z;
    const l = _q.length() || 1;
    out.addScaledVector(_q, (f * s.w) / l);
  }
  return out;
}
function smoothstep(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

// ---- vertex patch -------------------------------------------------------------
const HEAD = /* glsl */ `
  uniform float uWindT;
  uniform vec4 uWind, uWashP, uWashB, uCamP, uCamT, uClampA, uClampB, uSwayK, uSwayK2;
  uniform vec4 uWashS[${N_WASH}];
  attribute vec3 aSwayP;
  attribute vec4 aSwayW;
  #ifdef CG_SWING
    attribute float aSwing;
  #endif
  ${GUST_GLSL}
  vec3 cgWash(vec3 P) {
    vec3 acc = vec3(0.0);
    if (uWashP.w > 0.0 && distance(P, uWashB.xyz) < uWashB.w) {
      for (int k = 0; k < ${N_WASH}; k++) {
        vec4 s = uWashS[k];
        vec3 q = P - s.xyz;
        vec3 e = vec3(q.x, q.y * (q.y < 0.0 ? 0.55 : 1.3), q.z);
        float f = 1.0 - smoothstep(uWashP.y, uWashP.x, length(e));
        acc += normalize(q - vec3(0.0, uWashP.z, 0.0) + vec3(1e-4)) * (f * s.w);
      }
    }
    if (uCamP.w > 0.0) {
      vec3 q = P - uCamP.xyz;
      float dd = length(q);
      float f = 1.0 - smoothstep(uCamP.w * 0.3, uCamP.w, dd);
      acc += q / max(dd, 1e-3) * (f * 1.3);
      // and parts leaves along its sightline to APX-9 (fading out near the bee)
      if (uCamT.w > 0.0) {
        vec3 ab = uCamT.xyz - uCamP.xyz;
        float k = clamp(dot(P - uCamP.xyz, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
        vec3 qs = P - (uCamP.xyz + ab * k);
        float ds = length(qs);
        float rad = uCamT.w * (1.0 - smoothstep(0.55, 0.9, k));
        float fs = 1.0 - smoothstep(rad * 0.35, rad + 1e-3, ds);
        acc += qs / max(ds, 1e-3) * (fs * 1.1);
      }
    }
    return acc;
  }
  vec3 cgClamp(vec3 Q, vec4 c) {
    vec3 q = Q - c.xyz;
    float l = length(q);
    float k = 0.45 * c.w;
    if (l < c.w + k && l > 1e-4) {
      // smooth max(l, r): the part wraps round the sphere without a crease
      float h = max(k - abs(l - c.w), 0.0) / k;
      float nl = max(l, c.w) + h * h * k * 0.25;
      Q = c.xyz + q * (nl / l);
    }
    return Q;
  }
  vec3 cgSway(vec3 P, vec3 A, vec3 N, vec4 W) {
    vec3 d = P - A;
    float r = length(d);
    float t = uWindT;
    float g = cgGust(A.xz, t);
    #ifdef CG_LEAF
      // neighbours on one plant share a phase: they sway together, never through each other
      float ph = (aLeaf3.z + W.z) * 6.2832 + dot(A.xz, vec2(0.021, 0.017));
      vec4 cgK = vec4(abs(aLeaf3.x), aLeaf3.yzw); // (a negative amplitude marks a leaf rooted at the soil)
    #else
      float ph = (fract(sin(dot(A, vec3(12.9898, 78.233, 37.719))) * 43758.5453) + W.z) * 6.2832;
      vec4 cgK = vec4(1.0);
    #endif
    vec3 wd = vec3(uWind.x, 0.0, uWind.y);
    vec3 sd = vec3(-uWind.y, 0.0, uWind.x);
    float o1 = sin(t * uSwayK.z + ph);
    float o2 = sin(t * uSwayK.z * 1.41 + ph * 1.7 + 1.0);
    vec3 bend = wd * (uSwayK.x * g) + (wd * o1 + sd * (o2 * 0.7)) * (uSwayK.y * (0.3 + g));
    bend.y -= 0.3 * uSwayK.x * g;
    bend *= uWind.z * cgK.x;
    float fl = sin(t * uSwayK2.y + ph * 2.3 + r * 0.7) * uSwayK.w * W.y * (0.35 + g) * uWind.z * cgK.w;
    vec3 off = (bend * W.x + normalize(N + vec3(0.0, 1e-5, 0.0)) * fl) * r;
    off += cgWash(P) * (uSwayK2.x * W.x * r * cgK.y);
    float cap = uSwayK2.z * r;
    float lo = length(off);
    if (lo > cap) off *= cap / lo;
    vec3 Q = P + off;
    if (r > 1e-3) Q = A + normalize(Q - A) * r;
    #ifdef CG_LEAF
      // leaves rooted at the soil are pressed flat by the downwash, never into it
      if (aLeaf3.x < 0.0) Q.y = max(Q.y, A.y - 0.05);
    #endif
    #ifdef CG_SWING
      // swags and tendrils swing as a whole (sag-weighted), coherently along the vine
      float gs = cgGust(P.xz, t - 0.4);
      float sw = sin(t * 1.15 + dot(P.xz, vec2(0.006, 0.004)));
      Q += (wd * (gs * 0.8) + sd * (sw * 0.55) + wd * (sw * 0.25)) * (aSwing * uSwayK2.w * uWind.z);
      Q += cgWash(Q) * (aSwing * 0.8);
    #endif
    Q = cgClamp(Q, uClampA);
    Q = cgClamp(Q, uClampB);
    return Q;
  }
`;

const PROJECT = /* glsl */ `
  #ifdef USE_INSTANCING
    mat4 cgM = modelMatrix * instanceMatrix;
  #else
    mat4 cgM = modelMatrix;
  #endif
  vec4 cgW = cgM * vec4(transformed, 1.0);
  #ifdef CG_LEAF
    vec3 cgNo = cgLeafNrm;
  #else
    vec3 cgNo = normal;
  #endif
  cgW.xyz = cgSway(cgW.xyz, (cgM * vec4(aSwayP, 1.0)).xyz, mat3(cgM) * cgNo, aSwayW);
  vec4 mvPosition = viewMatrix * cgW;
  gl_Position = projectionMatrix * mvPosition;
`;
const WORLDPOS = /* glsl */ `
  #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
    vec4 worldPosition = cgW;
  #endif
`;

// the parametric leaf (geometry/leaf.js): position and normal from the grid
const LEAF_NORMAL = /* glsl */ `
  cgLeaf(position.xy);
  #define CG_LEAF_DONE
  vec3 objectNormal = cgLeafNrm;
  #ifdef USE_TANGENT
    vec3 objectTangent = vec3( tangent.xyz );
  #endif
`;
const LEAF_BEGIN = /* glsl */ `
  #ifndef CG_LEAF_DONE
    cgLeaf(position.xy);
  #endif
  vec3 transformed = cgLeafPos;
`;

function patchShader(sh, profile, swing, leaf = false) {
  Object.assign(sh.uniforms, WIND.u, PROFILES[profile].u);
  if (swing) sh.defines = { ...(sh.defines || {}), CG_SWING: '' };
  if (leaf) sh.defines = { ...(sh.defines || {}), CG_LEAF: '' };
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', '#include <common>\n' + (leaf ? LEAF_GLSL : '') + HEAD)
    .replace('#include <project_vertex>', PROJECT)
    .replace('#include <worldpos_vertex>', WORLDPOS);
  if (leaf) sh.vertexShader = sh.vertexShader
    .replace('#include <beginnormal_vertex>', LEAF_NORMAL)
    .replace('#include <begin_vertex>', LEAF_BEGIN);
}

// Patch a material in place (chains any existing onBeforeCompile).
const own = (m, k) => Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null;
export function swayMaterial(m, profile, { swing = false, leaf = false } = {}) {
  if (own(m, 'onBeforeCompile')?.sway) return m;
  const prev = own(m, 'onBeforeCompile');
  const key = own(m, 'customProgramCacheKey');
  m.userData.sway = { profile, swing, leaf };
  m.userData.swayOrig = { prev, key };
  const prevSrc = prev ? prev.toString() : '';
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev.call(m, sh, r);
    patchShader(sh, profile, swing, leaf);
  };
  m.onBeforeCompile.sway = profile;
  m.customProgramCacheKey = () => (key ? key.call(m) : prevSrc) + '|sway-' + profile + (swing ? '-s' : '') + (leaf ? '-l' : '');
  return m;
}

// a clone of a (possibly already patched) material, patched for a profile
export function swayClone(m, profile, opts = {}) {
  const orig = own(m, 'onBeforeCompile')?.sway ? m.userData.swayOrig : { prev: own(m, 'onBeforeCompile'), key: own(m, 'customProgramCacheKey') };
  const c = m.clone();
  c.userData = {};
  if (orig.prev) c.onBeforeCompile = orig.prev;
  if (orig.key) c.customProgramCacheKey = orig.key;
  return swayMaterial(c, profile, opts);
}

const depthCache = new Map();
export function swayDepth(profile, swing = false, leaf = false) {
  const key = profile + (swing ? '-s' : '') + (leaf ? '-l' : '');
  if (!depthCache.has(key)) {
    const d = new THREE.MeshDepthMaterial();
    d.onBeforeCompile = (sh) => patchShader(sh, profile, swing, leaf);
    d.customProgramCacheKey = () => 'sway-depth-' + key;
    depthCache.set(key, d);
  }
  return depthCache.get(key);
}

// patch a mesh: its material (in place unless clone) and a matching shadow material
export function swayMesh(mesh, profile, { swing = false, clone = false } = {}) {
  if (!mesh.geometry.attributes.aSwayP) addSway(mesh.geometry, { length: 1 });
  mesh.material = clone ? swayClone(mesh.material, profile, { swing }) : swayMaterial(mesh.material, profile, { swing });
  mesh.customDepthMaterial = swayDepth(profile, swing);
  mesh.userData.sway = { profile, swing };
  return mesh;
}

// ---- geometry attributes ----------------------------------------------------------
// aSwayP: the part's pivot (local); aSwayW: (bend flex 0..1, flutter 0..1, phase, -)
// Default for a single leaf grown along +Y from the origin: pivot at the origin,
// flex rising toward the tip.
export function addSway(geo, { pivot = null, length = null, flex = 1.4, flutter = 1, phase = 0, along = 'y' } = {}) {
  const p = geo.attributes.position;
  const n = p.count;
  const P = new Float32Array(n * 3), W = new Float32Array(n * 4);
  let L = length;
  if (!L) { geo.computeBoundingBox(); const b = geo.boundingBox; L = Math.max(1e-3, along === 'y' ? b.max.y : b.max.length()); }
  for (let i = 0; i < n; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const px = pivot ? pivot[0] : 0, py = pivot ? pivot[1] : 0, pz = pivot ? pivot[2] : 0;
    P[i * 3] = px; P[i * 3 + 1] = py; P[i * 3 + 2] = pz;
    const d = along === 'y' ? Math.max(0, y - py) : Math.hypot(x - px, y - py, z - pz);
    const u = Math.min(1, d / L);
    W[i * 4] = Math.pow(u, flex);
    W[i * 4 + 1] = flutter * Math.min(1, u * 1.5);
    W[i * 4 + 2] = phase;
  }
  geo.setAttribute('aSwayP', new THREE.BufferAttribute(P, 3));
  geo.setAttribute('aSwayW', new THREE.BufferAttribute(W, 4));
  return geo;
}

// zero sway attributes (stalks, tubes) so a geometry merges with leaf parts
export function zeroSway(geo) {
  const n = geo.attributes.position.count;
  geo.setAttribute('aSwayP', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geo.setAttribute('aSwayW', new THREE.BufferAttribute(new Float32Array(n * 4), 4));
  return geo;
}

// a merged part list: give each part its own pivot (the translation it was
// moved by) and an optional phase; flex/flutter stay as the part's own
export function pivotParts(merged, parts, pivots, phases = null) {
  const P = merged.attributes.aSwayP, W = merged.attributes.aSwayW;
  let o = 0;
  parts.forEach((g, k) => {
    const n = g.attributes.position.count;
    const pv = pivots[k];
    for (let i = o; i < o + n; i++) {
      P.setXYZ(i, pv.x, pv.y, pv.z);
      if (phases) W.setZ(i, phases[k]);
    }
    o += n;
  });
  merged.userData.parts = parts.map((g) => g.attributes.position.count);
  return merged;
}

// a whole merged plant (frond: stalk and leaflets) bending about one pivot:
// flex by distance from it; each leaflet keeps its own (signed) flutter weight
export function wholeFlex(merged, length, flex = 1.6, pivot = new THREE.Vector3()) {
  const p = merged.attributes.position, P = merged.attributes.aSwayP, W = merged.attributes.aSwayW;
  for (let i = 0; i < p.count; i++) {
    P.setXYZ(i, pivot.x, pivot.y, pivot.z);
    const d = Math.hypot(p.getX(i) - pivot.x, p.getY(i) - pivot.y, p.getZ(i) - pivot.z);
    W.setX(i, Math.pow(Math.min(1, d / length), flex));
  }
  return merged;
}

// set the sway attributes of a part already merged into a bigger geometry
// (vertex range [start, start + count)): its own pivot and phase
export function swayPart(geo, start, count, pivot, { length = 1, flex = 1.4, flutter = 1, phase = 0, base = 0 } = {}) {
  const p = geo.attributes.position, P = geo.attributes.aSwayP, W = geo.attributes.aSwayW;
  for (let i = start; i < start + count; i++) {
    P.setXYZ(i, pivot.x, pivot.y, pivot.z);
    const d = Math.hypot(p.getX(i) - pivot.x, p.getY(i) - pivot.y, p.getZ(i) - pivot.z);
    const u = Math.min(1, d / length);
    W.setXYZW(i, base + (1 - base) * Math.pow(u, flex), flutter * Math.min(1, u * 1.5), phase, 0);
  }
}

// ---- the wash trail -------------------------------------------------------------------
// Spring response weights for the trail samples: a share responds at once
// (contact), the rest as an underdamped spring (overshoot, then settle).
const ALPHA = 0.35, W0 = 13, ZETA = 0.3;
const WD = W0 * Math.sqrt(1 - ZETA * ZETA);
const G = (s) => 1 - Math.exp(-ZETA * W0 * s) * (Math.cos(WD * s) + (ZETA * W0 / WD) * Math.sin(WD * s));
export const WASH_WEIGHTS = WASH_AGES.map((a, k) => {
  const lo = k === 0 ? 0 : (WASH_AGES[k - 1] + a) / 2;
  const hi = k === WASH_AGES.length - 1 ? Infinity : (a + WASH_AGES[k + 1]) / 2;
  const w = (hi === Infinity ? 1 : G(hi)) - G(lo);
  return (1 - ALPHA) * w + (k === 0 ? ALPHA : 0);
});

// fill the wash uniforms from a sampler: at(age, outVec3) → strength (0 = no wash)
const _p = new THREE.Vector3();
export function setWash(at, body = null, bodyR = 1.9) {
  const S = WIND.u.uWashS.value;
  let on = 0;
  const c = new THREE.Vector3();
  let cnt = 0;
  for (let k = 0; k < N_WASH; k++) {
    const st = at(WASH_AGES[k], _p);
    S[k].set(_p.x, _p.y, _p.z, st * WASH_WEIGHTS[k]);
    if (st > 0) { on = 1; c.add(_p); cnt++; }
  }
  const P = WIND.u.uWashP.value;
  P.w = WIND.noWash ? 0 : on; // (review tools can switch the wash off for A/B frames)
  if (WIND.noWash) body = null;
  const Bd = WIND.u.uWashB.value;
  if (cnt) {
    c.multiplyScalar(1 / cnt);
    let r = 0;
    for (const s of S) if (s.w !== 0) r = Math.max(r, Math.hypot(s.x - c.x, s.y - c.y, s.z - c.z));
    Bd.set(c.x, c.y, c.z, r + P.x * 1.9 + 1);
  } else Bd.set(0, -1e5, 0, 0);
  if (body) WIND.u.uClampA.value.set(body.x, body.y, body.z, bodyR);
  else WIND.u.uClampA.value.set(0, -1e5, 0, 0);
}

export function setCamera(pos = null, push = 4.5, clampR = 1.15, target = null, sight = 2.6) {
  if (pos) { WIND.u.uCamP.value.set(pos.x, pos.y, pos.z, push); WIND.u.uClampB.value.set(pos.x, pos.y, pos.z, clampR); }
  else { WIND.u.uCamP.value.set(0, -1e5, 0, 0); WIND.u.uClampB.value.set(0, -1e5, 0, 0); }
  if (pos && target) WIND.u.uCamT.value.set(target.x, target.y, target.z, sight);
  else WIND.u.uCamT.value.set(0, -1e5, 0, 0);
}

export function setTime(t, strength = 1) {
  WIND.u.uWindT.value = t;
  WIND.strength = WIND.freeze ? 0 : strength; // review tools can hold the rest pose
  WIND.u.uWind.value.z = WIND.strength;
}

// A recorded trail (interactive modes): positions and wing strength stamped
// with the explore clock, sampled back at fixed ages.
export class WashTrail {
  constructor() { this.buf = []; }
  reset() { this.buf.length = 0; }
  record(t, pos, strength = 1) {
    const b = this.buf;
    const last = b[b.length - 1];
    if (last && t < last.t - 1e-6) b.length = 0; // the clock went back: start again
    if (last && Math.abs(t - last.t) < 1e-6) { last.p.copy(pos); last.s = strength; return; }
    b.push({ t, p: pos.clone(), s: strength });
    while (b.length > 2 && b[1].t < t - 1.0) b.shift();
  }
  at(t, out) {
    const b = this.buf;
    if (!b.length) return 0;
    if (t >= b[b.length - 1].t) { out.copy(b[b.length - 1].p); return b[b.length - 1].s; }
    if (t <= b[0].t) { out.copy(b[0].p); return b[0].s; }
    let i = b.length - 1;
    while (i > 0 && b[i - 1].t > t) i--;
    const a = b[i - 1], c = b[i];
    const k = (t - a.t) / Math.max(1e-6, c.t - a.t);
    out.copy(a.p).lerp(c.p, k);
    return a.s + (c.s - a.s) * k;
  }
}
