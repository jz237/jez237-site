// Sini 2026 renderer: a wrap-around asteroid field in real 3D, seen from a high camera that follows the
// ship. Five sector looks (nebula sky, parallax star layers, a giant backdrop body, rock material, light
// rig), real 3D asteroids with a procedural rock shader and crystal studs, every ship and machine animated
// from the simulation, the construct assembling plate by plate, warnings drawn on the plane (aim lines,
// tractor ring, lunge lane, warp gates) and HDR post. Nothing here changes the world.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=2';
import * as TX from './textures.js?v=2';
import * as MD from './models.js?v=2';
import { FX, CALM } from './fx.js?v=2';
import { NOISE } from './shaders.js?v=2';
import { F, WS, CONSTRUCTS, POWERUPS, P2_LIVERY, LIVERIES } from './config.js?v=2';
import { wd, isAwake, coreOpen } from './sim.js?v=2';

export { CALM };
const hdr = MD.hdr;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;
const _q2 = new THREE.Quaternion(), _eu = new THREE.Euler(), _v = new THREE.Vector3(), _c = new THREE.Color(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _ax = new THREE.Vector3(), _tint = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0), WHITE = new THREE.Color(1, 1, 1);

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), msaa: true, bloomLevels: 5, tex: 1024, dust: 2200, sparks: 2400, debris: 220, flashLights: 4, rockDetail: 4, stars: 1, pieces: 160 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), msaa: true, bloomLevels: 4, tex: 1024, dust: 1400, sparks: 1600, debris: 140, flashLights: 3, rockDetail: 4, stars: 0.75, pieces: 110 },
    low: { name: 'low', dpr: 1, msaa: false, bloomLevels: 3, tex: 512, dust: 700, sparks: 900, debris: 70, flashLights: 2, rockDetail: 3, stars: 0.5, pieces: 60 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ the five looks
export const LOOKS = [
  { key: 'amber', sun: 0xffd6a8, sunI: 3.4, sunDir: [-0.55, 0.9, -0.35], hemi: [0x9a7658, 0x140c06, 0.42], fill: 0x6f86ff, fillI: 0.35,
    env: [0xffc890, 0x6a4a30, 0x0c0704], neb: [0x120804, 0x6a3510, 0xffa860], nebK: 1.0, star: 0xfff0dc, dust: 0x9a8670, dustLight: 1.2,
    rock: { color: 0x7a6650, alt: 0x4f4034, rough: 0.93, metal: 0.04, crack: 0, crackK: 0, bump: 0.55 }, planet: 'gas', pc: [0xc89a64, 0x8a5a36, 0xf0d2a0],
    exposure: 1.05, bloom: 0.8, grade: [1.04, 1.0, 0.94], crystal: 0x52ffd8 },
  { key: 'frost', sun: 0xdcecff, sunI: 3.6, sunDir: [0.45, 0.9, -0.4], hemi: [0x86a8d8, 0x081018, 0.5], fill: 0x9fd8ff, fillI: 0.4,
    env: [0xe8f4ff, 0x46688a, 0x04070c], neb: [0x02060e, 0x123a6a, 0x9fd8ff], nebK: 0.85, star: 0xe8f2ff, dust: 0xb8c8d8, dustLight: 1.3,
    rock: { color: 0xc4d4e4, alt: 0x6f8296, rough: 0.42, metal: 0.05, crack: 0x6fd8ff, crackK: 0.35, bump: 0.42, ice: 1 }, planet: 'ringed', pc: [0x9ab8d8, 0x5a7aa0, 0xe8f0ff],
    exposure: 1.0, bloom: 0.85, grade: [0.96, 1.0, 1.06], crystal: 0x52ffd8 },
  { key: 'iron', sun: 0xffb08a, sunI: 3.0, sunDir: [-0.4, 0.85, 0.45], hemi: [0x805a50, 0x0c0606, 0.4], fill: 0xff7a5a, fillI: 0.3,
    env: [0xff9a70, 0x40302c, 0x060404], neb: [0x080303, 0x3a120c, 0xff6a3a], nebK: 0.7, star: 0xffe0d0, dust: 0x6a5a54, dustLight: 0.9,
    rock: { color: 0x5a5452, alt: 0x2e2a2a, rough: 0.5, metal: 0.55, crack: 0, crackK: 0, bump: 0.5 }, planet: 'dwarf', pc: [0xff5a2a, 0xffa060, 0xffe0b0],
    exposure: 1.05, bloom: 0.85, grade: [1.05, 0.98, 0.95], crystal: 0x52ffd8 },
  { key: 'ember', sun: 0xffb070, sunI: 2.8, sunDir: [0.5, 0.8, 0.35], hemi: [0x8a4a30, 0x100604, 0.38], fill: 0xff5a1a, fillI: 0.45,
    env: [0xff8a40, 0x4a2014, 0x080302], neb: [0x0c0302, 0x5a1408, 0xff7a2a], nebK: 1.0, star: 0xffd8c0, dust: 0x5a4038, dustLight: 0.9,
    rock: { color: 0x3a2e2a, alt: 0x1c1614, rough: 0.88, metal: 0.05, crack: 0xff6a1a, crackK: 2.6, bump: 0.6 }, planet: 'lava', pc: [0x2a1a14, 0xff5a10, 0xffb040],
    exposure: 1.0, bloom: 0.95, grade: [1.06, 0.97, 0.92], crystal: 0x52ffd8 },
  { key: 'void', sun: 0xc8b8ff, sunI: 2.4, sunDir: [-0.3, 0.9, 0.5], hemi: [0x5a4a8a, 0x05040a, 0.36], fill: 0xa070ff, fillI: 0.45,
    env: [0xb8a0ff, 0x2a2048, 0x030206], neb: [0x020106, 0x24104a, 0xb070ff], nebK: 0.6, star: 0xe8e0ff, dust: 0x5a5470, dustLight: 0.8,
    rock: { color: 0x2a2830, alt: 0x121016, rough: 0.3, metal: 0.25, crack: 0x9a6aff, crackK: 0.8, bump: 0.4 }, planet: 'hole', pc: [0xffd2a0, 0xff7ad8, 0x9a70ff],
    exposure: 1.1, bloom: 1.0, grade: [0.97, 0.96, 1.07], crystal: 0x52ffd8 },
];

// ------------------------------------------------------------------ shaders
const SKY_VERT = /* glsl */ `varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uA, uB, uC, uStar; uniform float uK;
varying vec3 vD;
${NOISE}
void main(){
  vec3 d = normalize(vD);
  float n = fbm(d * 2.1 + vec3(3.0, 1.0, 7.0));
  float n2 = fbm(d * 4.6 + vec3(11.0, 5.0, 2.0));
  float cloud = smoothstep(0.38, 0.82, n);
  vec3 c = uA;
  c = mix(c, uB, cloud * uK);
  c += uC * pow(smoothstep(0.5, 0.95, n * 0.75 + n2 * 0.4), 2.2) * uK * 0.9;
  c *= 0.45 + 0.55 * smoothstep(0.22, 0.62, n2);          // dark dust lanes
  // stars: one per lit cell
  vec3 q = d * 420.0; vec3 cell = floor(q); float h = hash13(cell);
  float st = step(0.982, h) * smoothstep(0.42, 0.0, length(fract(q) - 0.5)) * (0.4 + 2.2 * hash13(cell + 7.0));
  vec3 q2 = d * 140.0; vec3 cell2 = floor(q2); float h2 = hash13(cell2 + 3.0);
  st += step(0.993, h2) * smoothstep(0.35, 0.0, length(fract(q2) - 0.5)) * 3.5;
  c += uStar * st * (0.7 + 0.6 * cloud);
  gl_FragColor = vec4(c, 1.0);
}`;
// decals on the flight plane. kind 0 = disc/ring warning, 1 = lane, 3 = gate (warp-in), 4 = progress ring
const DECAL_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const DECAL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uProg, uLive, uTime, uKind, uAlpha;
varying vec2 vUv;
void main(){
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float a = 0.0;
  if (uKind < 0.5) {
    if (r > 1.0) discard;
    float edge = smoothstep(0.92, 0.97, r) * (1.0 - smoothstep(0.97, 1.0, r));
    float sweep = 1.0 - smoothstep(0.0, 0.06, abs(r - (1.0 - uProg)));
    float hatch = step(0.5, fract((p.x + p.y) * 9.0 - uTime * 0.8)) * 0.035 * smoothstep(0.75, 1.0, r);
    a = edge * 0.95 + sweep * 0.7 + hatch;
    if (uLive > 0.5) { float w = 0.5 + 0.5 * sin(r * 26.0 + uTime * 14.0); a = edge + w * 0.22 * smoothstep(0.15, 1.0, r); }
  } else if (uKind < 1.5) {
    float ax = abs(p.x), ay = vUv.y;
    float edge = smoothstep(0.84, 0.94, ax) * (1.0 - smoothstep(0.96, 1.0, ax));
    float chev = step(0.55, fract(ay * 16.0 - abs(p.x) * 1.2 - uTime * 3.0)) * 0.4;
    a = (edge * 0.9 + chev * step(ay, uProg) + 0.06) * (1.0 - smoothstep(0.85, 1.0, ay));
  } else if (uKind < 3.5) {
    if (r > 1.0) discard;
    float ring = smoothstep(0.7, 0.86, r) * (1.0 - smoothstep(0.92, 1.0, r));
    float ang = atan(p.y, p.x);
    float spokes = step(0.6, fract(ang / 6.2831853 * 12.0 + uTime * 0.8)) * smoothstep(0.3, 0.8, r) * (1.0 - smoothstep(0.8, 0.95, r));
    float core = (1.0 - smoothstep(0.0, 0.7, r)) * uProg;
    a = ring * (0.4 + 0.6 * uProg) + spokes * 0.5 * uProg + core * 0.8;
  } else {
    if (r > 1.0 || r < 0.86) discard;
    float ang = fract(atan(-p.x, p.y) / 6.2831853 + 0.5);
    float on = step(ang, uProg);
    float tick = step(0.82, fract(ang * 24.0));
    a = (on * (0.75 - tick * 0.5) + (1.0 - on) * 0.12) * smoothstep(0.86, 0.9, r) * (1.0 - smoothstep(0.96, 1.0, r));
  }
  gl_FragColor = vec4(uColor * a * uAlpha, 1.0);
}`;
const SHIELD_VERT = /* glsl */ `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const SHIELD_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uTime;
varying vec3 vN; varying vec3 vV;
void main(){
  float f = pow(clamp(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0), 2.4);
  float hex = 0.5 + 0.5 * sin(vN.x * 26.0 + uTime * 2.0) * sin(vN.y * 26.0) * sin(vN.z * 26.0 - uTime);
  gl_FragColor = vec4(uColor * (f * (0.7 + hex * 0.5)) * uK, 1.0);
}`;
// a flat additive streak (aim lines, mining beams): uKind 0 = dashed aim line, 1 = beam
const STREAK_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uTime, uKind;
varying vec2 vUv;
void main(){
  float across = clamp(1.0 - abs(vUv.x * 2.0 - 1.0), 0.0, 1.0);
  float a;
  if (uKind < 0.5) { float dash = step(0.45, fract(vUv.y * 14.0 - uTime * 4.0)); a = pow(across, 3.0) * dash * (1.0 - vUv.y) * 0.9 + pow(across, 12.0) * 0.5 * (1.0 - vUv.y); }
  else { float fl = 0.75 + 0.25 * sin(vUv.y * 40.0 - uTime * 50.0); a = (pow(across, 2.0) * 0.6 + pow(across, 10.0) * 1.4) * fl; }
  gl_FragColor = vec4(uColor * a * uK, 1.0);
}`;
// the accretion disc round the Void Crown's black hole
const DISC_FRAG = /* glsl */ `
uniform float uTime; uniform vec3 uA, uB;
varying vec2 vUv;
${NOISE}
void main(){
  vec2 p = vUv * 2.0 - 1.0; float r = length(p);
  if (r > 1.0 || r < 0.32) discard;
  float ang = atan(p.y, p.x);
  float sw = fbm(vec3(ang * 2.0 + uTime * 0.05 - r * 6.0, r * 8.0, 1.0));
  float band = smoothstep(0.32, 0.4, r) * (1.0 - smoothstep(0.7, 1.0, r));
  vec3 c = mix(uA, uB, smoothstep(0.35, 0.9, r)) * (0.4 + 1.6 * sw) * band * (1.8 - r);
  gl_FragColor = vec4(c, 1.0);
}`;

// ------------------------------------------------------------------ procedural asteroids
// value noise in JS for shaping the rock geometry (render side only: Math.random never touches the world)
function hash3(x, y, z) { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  let fx = x - ix, fy = y - iy, fz = z - iz;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const l = (a, b, t) => a + (b - a) * t;
  return l(l(l(hash3(ix, iy, iz), hash3(ix + 1, iy, iz), fx), l(hash3(ix, iy + 1, iz), hash3(ix + 1, iy + 1, iz), fx), fy),
    l(l(hash3(ix, iy, iz + 1), hash3(ix + 1, iy, iz + 1), fx), l(hash3(ix, iy + 1, iz + 1), hash3(ix + 1, iy + 1, iz + 1), fx), fy), fz);
}
function fbmJS(x, y, z, o = 4) { let a = 0.5, s = 0; for (let i = 0; i < o; i++) { s += a * vnoise(x, y, z); x = x * 2.03 + 1.7; y = y * 2.03 + 9.2; z = z * 2.03 + 3.1; a *= 0.5; } return s; }
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function rockGeo(seed, detail) {
  const r = mkr(seed * 977 + 5);
  const src = new THREE.IcosahedronGeometry(1, detail);
  // weld the polyhedron's vertices so the displaced surface stays smooth
  const P = src.attributes.position, map = new Map(), pos = [], idx = [];
  for (let i = 0; i < P.count; i++) {
    const k = `${Math.round(P.getX(i) * 1e4)},${Math.round(P.getY(i) * 1e4)},${Math.round(P.getZ(i) * 1e4)}`;
    let j = map.get(k);
    if (j === undefined) { j = pos.length / 3; map.set(k, j); pos.push(P.getX(i), P.getY(i), P.getZ(i)); }
    idx.push(j);
  }
  src.dispose();
  const ox = r() * 50, oy = r() * 50, oz = r() * 50;
  const sx = 0.8 + r() * 0.35, sy = 0.62 + r() * 0.3, sz = 0.78 + r() * 0.35;
  const craters = [];
  for (let i = 0; i < 9; i++) { const a = r() * TAU, b = Math.acos(r() * 2 - 1); craters.push([Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a), 0.18 + r() * 0.32, 0.05 + r() * 0.08]); }
  const n = pos.length / 3, col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
    let d = 0.82 + 0.42 * fbmJS(x * 1.25 + ox, y * 1.25 + oy, z * 1.25 + oz) + 0.1 * fbmJS(x * 4 + oz, y * 4 + ox, z * 4 + oy, 3);
    let shade = 1;
    for (const [cx, cy, cz, cr, dep] of craters) {
      const dt = Math.acos(clamp(x * cx + y * cy + z * cz, -1, 1));
      if (dt < cr * 1.3) {
        const u = dt / cr;
        if (u < 1) { d -= dep * (1 - u * u); shade *= 0.82 + 0.18 * u; }
        else d += dep * 0.5 * (1 - (u - 1) / 0.3);
      }
    }
    pos[i * 3] = x * d * sx; pos[i * 3 + 1] = y * d * sy; pos[i * 3 + 2] = z * d * sz;
    const m = fbmJS(x * 3 + 20, y * 3, z * 3, 3);
    const v = shade * (0.78 + 0.4 * m);
    col[i * 3] = v; col[i * 3 + 1] = v; col[i * 3 + 2] = v;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  // a few points on the surface (mostly on top) where crystal studs grow
  const studs = [];
  for (let i = 0; i < 7; i++) {
    let best = 0, by = -9;
    for (let t = 0; t < 6; t++) { const k = Math.floor(r() * n); if (pos[k * 3 + 1] > by) { by = pos[k * 3 + 1]; best = k; } }
    const nx = g.attributes.normal.getX(best), ny = g.attributes.normal.getY(best), nz = g.attributes.normal.getZ(best);
    studs.push({ p: new THREE.Vector3(pos[best * 3], pos[best * 3 + 1], pos[best * 3 + 2]), n: new THREE.Vector3(nx, ny, nz).normalize(), s: 0.7 + r() * 0.6, tw: r() * TAU });
  }
  g.userData.studs = studs;
  return g;
}
function rockMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9, metalness: 0.05, envMapIntensity: 0.6 });
  const U = { uBump: { value: 0.5 }, uCrack: { value: new THREE.Color(0) }, uCrackK: { value: 0 }, uIce: { value: 0 }, uTime: { value: 0 } };
  m.userData.U = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\n  vOP = position * length(instanceMatrix[0].xyz);\n#else\n  vOP = position;\n#endif');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vOP; uniform float uBump, uCrackK, uIce, uTime; uniform vec3 uCrack;
${NOISE}
vec3 rockBump(vec3 sp, vec3 sn, vec2 dH, float fd){ vec3 sx = dFdx(sp), sy = dFdy(sp); vec3 r1 = cross(sy, sn), r2 = cross(sn, sx); float det = dot(sx, r1) * fd; vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * sn - g); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  float rn = fbm(vOP * 0.32);
  float rn2 = vnoise(vOP * 1.7);
  diffuseColor.rgb *= 0.62 + 0.75 * rn;
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.08, 1.0, 0.92), smoothstep(0.45, 0.7, rn2));`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  roughnessFactor = clamp(roughnessFactor * (0.8 + 0.4 * rn2) - uIce * 0.25 * smoothstep(0.4, 0.7, rn), 0.05, 1.0);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
  float hh = fbm3(vOP * 0.42) * 0.8 + vnoise(vOP * 1.5) * 0.22 + vnoise(vOP * 3.8) * 0.05;
  normal = rockBump(-vViewPosition, normal, vec2(dFdx(hh), dFdy(hh)) * uBump * 3.2, faceDirection);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  if (uCrackK > 0.0) {
    float cv = fbm3(vOP * 0.22 + 4.0);
    float cr = 1.0 - smoothstep(0.0, 0.028, abs(cv - 0.5));
    float glowc = cr * (0.75 + 0.25 * sin(uTime * 1.3 + vOP.x * 0.4));
    totalEmissiveRadiance += uCrack * glowc * uCrackK;
    diffuseColor.rgb *= 1.0 - cr * 0.6;
  }
  if (uIce > 0.0) { float fr = pow(clamp(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 3.0); totalEmissiveRadiance += vec3(0.25, 0.45, 0.7) * fr * 0.25 * uIce; }`);
  };
  return m;
}
// a crystal: a cluster of long faceted shards
function crystalGeo(n = 3, seed = 4) {
  const r = mkr(seed), parts = [];
  for (let i = 0; i < n; i++) {
    const g = new THREE.OctahedronGeometry(1, 0);
    g.scale(0.22 + r() * 0.08, 0.75 + r() * 0.35, 0.22 + r() * 0.08);
    g.translate(0, 0.4, 0);
    const a = r() * TAU, t = i ? 0.5 + r() * 0.35 : 0.08;
    g.rotateZ(t); g.rotateY(a);
    parts.push(g.index ? g.toNonIndexed() : g);
  }
  let total = 0;
  for (const g of parts) total += g.attributes.position.count;
  const pos = new Float32Array(total * 3);
  let o = 0;
  for (const g of parts) { pos.set(g.attributes.position.array, o * 3); o += g.attributes.position.count; g.dispose(); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.computeVertexNormals();
  g.translate(0, -0.35, 0);
  return g;
}
// canvas textures for the backdrop bodies
function bandTex(cols, seed, lava) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d'), r = mkr(seed);
  const C = cols.map((h) => new THREE.Color(h));
  for (let y = 0; y < 256; y++) {
    const v = y / 256, t = 0.5 + 0.5 * Math.sin(v * 38 + Math.sin(v * 9) * 3 + fbmJS(v * 6, 1, 2) * 6);
    const a = C[0].clone().lerp(C[1], t).lerp(C[2], Math.max(0, Math.sin(v * 13 + 1) * 0.5 - 0.1));
    g.fillStyle = `#${a.getHexString()}`; g.fillRect(0, y, 512, 1);
  }
  // storms and swirls
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.03 + r() * 0.05})`; g.beginPath(); g.ellipse(r() * 512, r() * 256, 10 + r() * 50, 2 + r() * 6, 0, 0, 7); g.fill(); }
  if (lava) {
    const id = g.getImageData(0, 0, 512, 256), d = id.data;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) {
      const n = fbmJS(x / 40, y / 40, 3), k = Math.max(0, 1 - Math.abs(n - 0.5) / 0.03), i = (y * 512 + x) * 4;
      const base = 0.12 + fbmJS(x / 20, y / 20, 9) * 0.2;
      d[i] = 255 * Math.min(1, base * 0.9 + k * 1.0); d[i + 1] = 255 * Math.min(1, base * 0.7 + k * 0.45); d[i + 2] = 255 * Math.min(1, base * 0.6 + k * 0.1);
    }
    g.putImageData(id, 0, 0);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping;
  return t;
}
function ringTex(seed) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 8;
  const g = c.getContext('2d'), r = mkr(seed);
  for (let x = 0; x < 512; x++) { const v = x / 512; const a = (0.25 + 0.75 * fbmJS(v * 40, 0, 0)) * Math.sin(Math.PI * v) * (r() < 0.04 ? 0.2 : 1); g.fillStyle = `rgba(230,240,255,${a.toFixed(3)})`; g.fillRect(x, 0, 1, 8); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Renderer {
  constructor(canvas, q) {
    this.q = q;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(q.dpr);
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    this.r = r;
    this.scale = 1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.5, 5000);
    this.post = new Post(r, q);
    this.T = TX.sprites();
    this.pm = new THREE.PMREMGenerator(r);
    this.envs = [];
    MD.materials(null, TX.grimeTex(), TX.stripeTex(), TX.panelNormal(q.tex >= 1024 ? 512 : 256), q.name === 'high');
    this.livery = LIVERIES[0];
    this.time = 0; this.trauma = 0;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.shocks = [];
    this.lookI = -1; this.look = LOOKS[0];
    this.cx = 0; this.cz = 0; this.zoom = 1;
    this.camPos = new THREE.Vector3(0, 50, 30); this.camLook = new THREE.Vector3();
    this.shot = null;
    this.lights();
    this.buildSky();
    this.fx = new FX(this.scene, this.T, { dust: q.dust, sparks: q.sparks, debris: q.debris, flashLights: q.flashLights }, () => -1e9);
    this.views = { p: new Map(), e: new Map(), pods: new Map() };
    this.pieces = [];
    this.cView = null; this.cKey = null;
    this.makeRocks();
    this.makeCrystals();
    this.makeProjectiles();
    this.makeDecals();
    this.resize();
    addEventListener('resize', () => this.resize());
    this.setLook(0);
  }

  // ---------------------------------------------------------------- lights, sky, backdrop
  lights() {
    const k = new THREE.DirectionalLight(0xffffff, 3);
    this.scene.add(k, k.target);
    this.key = k;
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.4);
    this.scene.add(this.hemi, this.fill, this.fill.target);
    // FIXED light pools: the number of lights never changes after boot (no shader rebuilds mid-play)
    this.shipLights = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.PointLight(0xfff0dc, 0, 26, 1.6); this.scene.add(l); this.shipLights.push(l); }
    this.coreLight = new THREE.PointLight(0xff8a40, 0, 60, 1.4); this.scene.add(this.coreLight);
    this.bombLights = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.PointLight(0xc8b0ff, 0, 18, 1.8); this.scene.add(l); this.bombLights.push(l); }
  }
  buildSky() {
    this.skyMat = new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false,
      uniforms: { uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() }, uStar: { value: new THREE.Color() }, uK: { value: 1 } } });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(3000, 48, 24), this.skyMat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -10;
    this.scene.add(this.sky);
    // parallax star layers far below the flight plane, plus fine dust motes just under it
    this.starLayers = [];
    const layer = (n, y, T, size, alpha, warm) => {
      n = Math.round(n * this.q.stars);
      const pos = new Float32Array(n * 9 * 3), col = new Float32Array(n * 9 * 3), r = mkr(n + y | 0);
      const base = [];
      for (let i = 0; i < n; i++) base.push([r() * T, r() * T, 0.3 + r() * 0.7, r()]);
      let o = 0;
      for (let tx = -1; tx <= 1; tx++) for (let tz = -1; tz <= 1; tz++) for (const [x, z, b, h] of base) {
        pos[o * 3] = x + tx * T; pos[o * 3 + 1] = (r() - 0.5) * Math.abs(y) * 0.15; pos[o * 3 + 2] = z + tz * T;
        _c.setHSL(warm ? 0.08 + h * 0.06 : 0.55 + h * 0.15, 0.35, 0.75).multiplyScalar(b);
        col[o * 3] = _c.r; col[o * 3 + 1] = _c.g; col[o * 3 + 2] = _c.b; o++;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
      const m = new THREE.PointsMaterial({ size, map: this.T.glow, vertexColors: true, transparent: true, opacity: alpha, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
      const pts = new THREE.Points(g, m);
      pts.frustumCulled = false; pts.renderOrder = -5;
      this.scene.add(pts);
      this.starLayers.push({ pts, y, T, m });
    };
    layer(260, -420, 900, 7, 0.9, false);
    layer(220, -160, 420, 3.6, 0.85, true);
    layer(320, -45, 150, 1.4, 0.55, false);
    layer(380, -7, 80, 0.32, 0.35, true);   // dust motes
    this.backdrops = {};
  }
  backdrop(i) {
    if (this.backdrops[i]) return this.backdrops[i];
    const L = LOOKS[i], g = new THREE.Group();
    // the body is lit from one side by its own "sun", so it shows a crescent and a terminator
    const planetMat = (map, o = {}) => new THREE.ShaderMaterial({
      uniforms: { map: { value: map }, uL: { value: new THREE.Vector3(-0.85, 0.25, 0.45).normalize() }, uAtm: { value: hdr(o.atm ?? L.pc[2], o.atmK ?? 1) }, uGlow: { value: o.glow || 0 }, uTime: { value: 0 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec2 vUv; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: `uniform sampler2D map; uniform vec3 uL, uAtm; uniform float uGlow, uTime; varying vec3 vN; varying vec3 vV; varying vec2 vUv;
        void main(){ vec3 n = normalize(vN); float d = dot(n, uL); float lit = smoothstep(-0.12, 0.55, d);
          vec3 alb = texture2D(map, vUv + vec2(uTime * 0.0015, 0.0)).rgb;
          float rim = pow(clamp(1.0 - dot(n, normalize(vV)), 0.0, 1.0), 2.6);
          vec3 c = alb * lit * 1.5 + uAtm * rim * (0.08 + 0.9 * smoothstep(-0.3, 0.4, d));
          if (uGlow > 0.0) c += alb * vec3(1.6, 0.5, 0.12) * uGlow * pow(max(alb.r - alb.b, 0.0), 1.5) * (1.0 - lit * 0.7);
          gl_FragColor = vec4(c, 1.0); }` });
    if (L.planet === 'gas' || L.planet === 'ringed') {
      const s = new THREE.Mesh(new THREE.SphereGeometry(260, 64, 40), planetMat(bandTex(L.pc, i + 3, false)));
      s.rotation.set(0.25, 0, 0.35); g.add(s);
      if (L.planet === 'ringed') {
        const rg = new THREE.RingGeometry(330, 560, 160, 1);
        const uv = rg.attributes.uv, P = rg.attributes.position;
        for (let k = 0; k < P.count; k++) { const rr = Math.hypot(P.getX(k), P.getY(k)); uv.setXY(k, (rr - 330) / 230, 0.5); }
        const ring = new THREE.Mesh(rg, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { map: { value: ringTex(7) }, uC: { value: hdr(0xdce8f8, 1.1) } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: 'uniform sampler2D map; uniform vec3 uC; varying vec2 vUv; void main(){ vec4 t = texture2D(map, vUv); gl_FragColor = vec4(uC * t.rgb, t.a * 0.85); }' }));
        ring.rotation.set(-Math.PI / 2 + 0.5, 0, 0.35); g.add(ring);
      }
    } else if (L.planet === 'lava') {
      const s = new THREE.Mesh(new THREE.SphereGeometry(230, 64, 40), planetMat(bandTex([0x241812, 0x3a2418, 0x120a08], i + 9, true), { glow: 1.6, atm: 0xff7a3a, atmK: 0.7 }));
      s.rotation.set(0.4, 0.1, 0.3); g.add(s);
    } else if (L.planet === 'dwarf') {
      const s = new THREE.Mesh(new THREE.SphereGeometry(170, 48, 32), new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uA: { value: hdr(L.pc[0], 2.2) }, uB: { value: hdr(L.pc[2], 4) } },
        vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }',
        fragmentShader: `uniform float uTime; uniform vec3 uA, uB; varying vec3 vP; varying vec3 vN; varying vec3 vV; ${NOISE}
          void main(){ float n = fbm(vP * 0.025 + vec3(uTime * 0.03)); float f = pow(clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0), 0.7); gl_FragColor = vec4(mix(uA * 0.6, uB, n * f), 1.0); }` }));
      g.add(s);
      const cor = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: hdr(L.pc[1], 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      cor.scale.set(900, 900, 1); g.add(cor);
    } else if (L.planet === 'hole') {
      const s = new THREE.Mesh(new THREE.SphereGeometry(90, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      g.add(s);
      const disc = new THREE.Mesh(new THREE.PlaneGeometry(760, 760), new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: DISC_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uA: { value: hdr(L.pc[0], 3.0) }, uB: { value: hdr(L.pc[2], 1.0) } } }));
      disc.rotation.set(-Math.PI / 2 + 0.35, 0, 0.3); disc.renderOrder = 1; g.add(disc);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.ring, color: hdr(L.pc[0], 1.3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      halo.scale.set(260, 260, 1); g.add(halo);
      g.userData.disc = disc;
    }
    g.traverse((o) => { o.renderOrder = o.renderOrder || -4; o.frustumCulled = false; });
    g.visible = false;
    this.scene.add(g);
    this.backdrops[i] = g;
    return g;
  }
  envFor(i) {
    if (this.envs[i]) return this.envs[i];
    const L = LOOKS[i], s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { a: { value: new THREE.Color(L.env[0]) }, b: { value: new THREE.Color(L.env[1]) }, c: { value: new THREE.Color(L.env[2]) }, sd: { value: new THREE.Vector3(...L.sunDir).normalize() } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 a,b,c,sd; varying vec3 vP; void main(){ vec3 d = normalize(vP); vec3 col = mix(c, b, smoothstep(-0.4, 0.5, d.y) * 0.6); col += a * pow(max(0.0, dot(d, sd)), 8.0) * 3.0; gl_FragColor = vec4(col, 1.0); }' })));
    for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.2), new THREE.MeshBasicMaterial({ color: hdr(L.env[0], 3), side: THREE.DoubleSide }));
      const a = (k / 4) * TAU; m.position.set(Math.cos(a) * 8, 5, Math.sin(a) * 8); m.lookAt(0, 0, 0); s.add(m);
    }
    this.envs[i] = this.pm.fromScene(s, 0.03).texture;
    return this.envs[i];
  }
  setLook(i) {
    if (i === this.lookI) return;
    this.lookI = i; const L = this.look = LOOKS[i];
    this.scene.environment = this.envFor(i);
    this.skyMat.uniforms.uA.value.set(L.neb[0]); this.skyMat.uniforms.uB.value.set(L.neb[1]); this.skyMat.uniforms.uC.value.copy(hdr(L.neb[2], 1.0)); this.skyMat.uniforms.uStar.value.copy(hdr(L.star, 1.6)); this.skyMat.uniforms.uK.value = L.nebK;
    this.key.color.set(L.sun); this.key.intensity = L.sunI;
    this.key.position.set(...L.sunDir).normalize().multiplyScalar(100);
    this.hemi.color.set(L.hemi[0]); this.hemi.groundColor.set(L.hemi[1]); this.hemi.intensity = L.hemi[2];
    this.fill.color.set(L.fill); this.fill.intensity = L.fillI; this.fill.position.set(-L.sunDir[0], -0.4, -L.sunDir[2]).multiplyScalar(100);
    this.fx.setLook(L);
    for (const k in this.backdrops) this.backdrops[k].visible = false;
    this.backdrop(i).visible = true;
    const RK = L.rock, U = this.rockMat.userData.U;
    this.rockMat.color.set(0xffffff); this.rockMat.roughness = RK.rough; this.rockMat.metalness = RK.metal;
    U.uBump.value = RK.bump; U.uCrack.value.copy(hdr(RK.crack || 0, 1)); U.uCrackK.value = RK.crackK; U.uIce.value = RK.ice || 0;
    this.rockTint = [new THREE.Color(RK.color), new THREE.Color(RK.alt)];
    this.rockSeen = new Map();
  }

  // ---------------------------------------------------------------- rocks, crystals, shots, warnings
  makeRocks() {
    this.rockMat = rockMaterial();
    this.rockGeos = [];
    for (let i = 0; i < 6; i++) this.rockGeos.push(rockGeo(i + 1, this.q.rockDetail));
    this.rockI = this.rockGeos.map((g) => {
      const I = new THREE.InstancedMesh(g, this.rockMat, 48);
      I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); I.frustumCulled = false; I.count = 0;
      I.setColorAt(0, _c.set(1, 1, 1));
      this.scene.add(I); return I;
    });
  }
  makeCrystals() {
    const L = LOOKS[0];
    this.crystalMat = new THREE.MeshStandardMaterial({ color: 0x9ffff0, emissive: hdr(L.crystal, 2.4), roughness: 0.12, metalness: 0.1, envMapIntensity: 1.5 });
    this.crystalI = new THREE.InstancedMesh(crystalGeo(3, 4), this.crystalMat, 120);
    this.studI = new THREE.InstancedMesh(crystalGeo(2, 9), this.crystalMat, 300);
    for (const I of [this.crystalI, this.studI]) { I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); I.frustumCulled = false; I.count = 0; this.scene.add(I); }
    // a soft glow round every free crystal
    const n = 120, g = new THREE.BufferGeometry();
    this.cgPos = new Float32Array(n * 3); this.cgCol = new Float32Array(n * 3);
    g.setAttribute('position', new THREE.BufferAttribute(this.cgPos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.cgCol, 3).setUsage(THREE.DynamicDrawUsage));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    this.crystalGlow = new THREE.Points(g, new THREE.PointsMaterial({ size: 4.2, map: this.T.glow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.crystalGlow.frustumCulled = false; this.crystalGlow.renderOrder = 4;
    this.scene.add(this.crystalGlow);
  }
  makeProjectiles() {
    const mk = (geo, color, max) => { const I = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color, toneMapped: false }), max); I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); I.frustumCulled = false; I.count = 0; this.scene.add(I); return I; };
    const cyl = new THREE.CylinderGeometry(1, 1, 1, 8); cyl.rotateZ(Math.PI / 2);
    this.shotI = mk(cyl, hdr(0xffd27a, 6), 160);
    this.shotGlowI = mk(cyl, hdr(0xff9a3a, 0.8), 160);
    this.shotGlowI.material.transparent = true; this.shotGlowI.material.blending = THREE.AdditiveBlending; this.shotGlowI.material.depthWrite = false;
    this.boltI = mk(new THREE.SphereGeometry(1, 14, 10), hdr(0xff3a4a, 7), 80);
    const tail = new THREE.ConeGeometry(1, 1, 10, 1, true); tail.rotateZ(Math.PI / 2); tail.translate(-0.5, 0, 0);
    this.boltTailI = mk(tail, hdr(0xff2a3a, 2.4), 80);
    this.boltTailI.material.transparent = true; this.boltTailI.material.blending = THREE.AdditiveBlending; this.boltTailI.material.depthWrite = false; this.boltTailI.material.side = THREE.DoubleSide;
    this.abI = mk(new THREE.SphereGeometry(1, 10, 8), hdr(0xffa020, 7), 40);
    this.bombI = mk(new THREE.IcosahedronGeometry(1, 2), hdr(0xe0d0ff, 9), 40);
    this.bombHalo = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 5, map: this.T.glow, color: hdr(0xa880ff, 1.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.bhPos = new Float32Array(40 * 3);
    this.bombHalo.geometry.setAttribute('position', new THREE.BufferAttribute(this.bhPos, 3).setUsage(THREE.DynamicDrawUsage));
    this.bombHalo.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    this.bombHalo.frustumCulled = false; this.bombHalo.renderOrder = 4;
    this.scene.add(this.bombHalo);
  }
  decalMat(kind, color) {
    return new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: DECAL_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(color) }, uProg: { value: 0 }, uLive: { value: 0 }, uTime: { value: 0 }, uKind: { value: kind }, uAlpha: { value: 1 } } });
  }
  makeDecals() {
    const plane = new THREE.PlaneGeometry(2, 2); plane.rotateX(-Math.PI / 2);
    const mk = (kind, color) => { const m = new THREE.Mesh(plane, this.decalMat(kind, color)); m.visible = false; m.renderOrder = 2; m.frustumCulled = false; this.scene.add(m); return m; };
    this.gates = Array.from({ length: 10 }, () => mk(3, 0xff4a3a));
    this.pullRing = mk(0, 0xff5a3a);
    this.dangerRing = mk(0, 0xff3a2a);
    this.buildRing = mk(4, 0xffb347);
    this.coreRing = mk(4, 0x7dff9a);
    // guidance: how close a rock is to giving up its next crystal, which gatherers carry one, and what the autopilot is after
    this.chipRings = Array.from({ length: 5 }, () => mk(4, 0x52ffd8));
    this.carriers = Array.from({ length: 8 }, () => mk(3, 0x52ffd8));
    this.reticle = mk(3, 0x9fffe8);
    this.rockHitT = new Map();
    this.intent = null;
    const lane = new THREE.PlaneGeometry(2, 1); lane.rotateX(-Math.PI / 2); lane.translate(0, 0, -0.5);
    this.laneMesh = new THREE.Mesh(lane, this.decalMat(1, 0xff4a2a)); this.laneMesh.visible = false; this.laneMesh.renderOrder = 2; this.laneMesh.frustumCulled = false; this.scene.add(this.laneMesh);
    // streaks: reaver aim lines and mining beams
    const sg = new THREE.PlaneGeometry(1, 1); sg.rotateX(-Math.PI / 2); sg.translate(0, 0, -0.5);
    const smat = (kind, color) => new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: STREAK_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: hdr(color, 1) }, uK: { value: 1 }, uTime: { value: 0 }, uKind: { value: kind } } });
    this.aims = Array.from({ length: 10 }, () => { const m = new THREE.Mesh(sg, smat(0, 0xff3a4a)); m.visible = false; m.renderOrder = 3; m.frustumCulled = false; this.scene.add(m); return m; });
    this.beams = Array.from({ length: 10 }, () => { const m = new THREE.Mesh(sg, smat(1, 0xff7a3a)); m.visible = false; m.renderOrder = 3; m.frustumCulled = false; this.scene.add(m); return m; });
    this.intentLine = new THREE.Mesh(sg, smat(0, 0x9fffe8)); this.intentLine.visible = false; this.intentLine.renderOrder = 3; this.intentLine.frustumCulled = false; this.scene.add(this.intentLine);
    this.shieldMat = new THREE.ShaderMaterial({ vertexShader: SHIELD_VERT, fragmentShader: SHIELD_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(0x7fd8ff, 1.6) }, uK: { value: 0 }, uTime: { value: 0 } } });
  }
  // a flat streak from (ax, az) to (bx, bz), w wide
  setStreak(m, ax, az, bx, bz, w, y = 0.3) {
    const dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 0.01;
    m.position.set(ax, y, az); m.rotation.set(0, Math.atan2(-dx, -dz), 0); m.scale.set(w, 1, l); m.visible = true;
  }

  // ---------------------------------------------------------------- views
  playerView(p) {
    let v = this.views.p.get(p.id);
    if (v) return v;
    const L = p.id === 2 ? P2_LIVERY : this.livery;
    const S = MD.ship(L.color, L.accent);
    const sh = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 20), this.shieldMat.clone());
    sh.material.uniforms = THREE.UniformsUtils.clone(this.shieldMat.uniforms);
    S.g.add(sh);
    v = { ...S, sh, roll: 0, lastA: p.a, flash: 0, hurt: 0, trailT: 0 };
    this.scene.add(S.g);
    this.views.p.set(p.id, v);
    return v;
  }
  enemyView(e) {
    let v = this.views.e.get(e.id);
    if (v) return v;
    if (e.type === 'gath') v = { ...MD.gatherer(), type: e.type, open: 0 };
    else {
      v = { ...MD.reaver(), type: e.type, roll: 0, lastA: e.a };
      if (v.emitter) { v.emitter.material = v.emitter.material.clone(); v.emBase = v.emitter.material.color.clone(); }
    }
    this.scene.add(v.g);
    this.views.e.set(e.id, v);
    return v;
  }
  podView(q) {
    let v = this.views.pods.get(q.id);
    if (v) return v;
    const P = POWERUPS[q.kind];
    v = MD.pod(P.color);
    const icon = new THREE.Sprite(this.iconFor(q.kind)); icon.scale.set(1.7, 1.7, 1); icon.position.y = 2.2; v.g.add(icon);
    this.scene.add(v.g);
    this.views.pods.set(q.id, v);
    return v;
  }
  iconFor(kind) {
    this.icons = this.icons || {};
    if (this.icons[kind]) return this.icons[kind];
    const P = POWERUPS[kind], c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); g.fillStyle = '#' + P.color.toString(16).padStart(6, '0'); g.font = 'bold 84px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#000'; g.shadowBlur = 12; g.fillText(P.glyph, 64, 70);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return (this.icons[kind] = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }));
  }
  constructView(key) {
    if (this.cView && this.cKey === key) return this.cView;
    if (this.cView) this.scene.remove(this.cView.g);
    const v = MD.construct(key);
    v.coreMat = v.core.material = v.core.material.clone();
    v.coreBase = v.coreMat.color.clone();
    v.shown = v.plates.length; v.iris = 0; v.hit = 0; v.dropT = v.plates.map(() => 0);
    this.scene.add(v.g);
    this.cView = v; this.cKey = key;
    return v;
  }
  setLivery(L) {
    this.livery = L;
    const v = this.views.p.get(1);
    if (v) { this.scene.remove(v.g); this.views.p.delete(1); }
  }
  // draw position of a field point, on the side of the wrap nearest the camera
  X(x) { return this.cx + wd(x - this.cx); }
  Z(z) { return this.cz + wd(z - this.cz); }

  // ---------------------------------------------------------------- break things apart (zero g)
  breakApart(v, o = {}) {
    const parts = MD.partsOf(v.g);
    v.g.updateMatrixWorld(true);
    if (parts) {
      const max = o.max || 14;
      const pick = parts.length > max ? parts.filter((_, i) => i % Math.ceil(parts.length / max) === 0) : parts;
      for (const q of pick) {
        const mesh = MD.partMesh(q);
        const par = q.parent ? v.g.getObjectByName(q.parent) : null;
        _m.multiplyMatrices((par || v.g).matrixWorld, q.m);
        _m.decompose(mesh.position, mesh.quaternion, mesh.scale);
        this.addPiece(mesh, v.g.position, o);
      }
    }
    if (!o.keep) this.scene.remove(v.g);
  }
  addPiece(obj, from, o = {}) {
    const dx = obj.position.x - from.x, dz = obj.position.z - from.z, d = Math.hypot(dx, dz) || 1;
    const sp = (o.power || 1) * (3 + Math.random() * 5);
    this.scene.add(obj);
    this.pieces.push({ o: obj, vx: (dx / d) * sp + (o.vx || 0) * 0.5, vy: (Math.random() - 0.3) * sp * 0.5, vz: (dz / d) * sp + (o.vz || 0) * 0.5, wx: (Math.random() - 0.5) * 6, wy: (Math.random() - 0.5) * 6, wz: (Math.random() - 0.5) * 6, t: 0, life: (o.life || 2.4) + Math.random() * 1.4, s0: obj.scale.clone(), burn: o.burn ? 1 : 0 });
    while (this.pieces.length > this.q.pieces) { const P = this.pieces.shift(); this.scene.remove(P.o); }
  }
  updatePieces(dt) {
    for (const P of this.pieces) {
      P.t += dt;
      const dr = Math.exp(-0.3 * dt);
      P.vx *= dr; P.vy *= dr; P.vz *= dr;
      P.o.position.x += P.vx * dt; P.o.position.y += P.vy * dt; P.o.position.z += P.vz * dt;
      P.o.rotation.x += P.wx * dt; P.o.rotation.y += P.wy * dt; P.o.rotation.z += P.wz * dt;
      const k = Math.min(1, (P.life - P.t) / 0.7);
      if (k < 1) P.o.scale.copy(P.s0).multiplyScalar(Math.max(0.001, k));
      if (P.burn && Math.random() < dt * 8) this.fx.fire(P.o.position.x, P.o.position.y, P.o.position.z, { n: 1, s: 0.8, sp: 0.4, jit: 1 });
    }
    const keep = [];
    for (const P of this.pieces) { if (P.t < P.life) keep.push(P); else this.scene.remove(P.o); }
    this.pieces = keep;
  }
  breakEnemy(id, o) { const v = this.views.e.get(id); if (!v) return; this.views.e.delete(id); this.breakApart(v, { max: v.type === 'reaver' ? 14 : 8, ...o }); }
  breakPlayer(pid, o) { const v = this.views.p.get(pid); if (!v) return; v.sh.visible = false; this.breakApart(v, { max: 18, keep: true, ...o }); v.g.visible = false; }
  // knock the outermost fitted plates off the construct
  throwPlates(n, o = {}) {
    const v = this.cView; if (!v) return;
    v.g.updateMatrixWorld(true);
    let thrown = 0;
    for (let i = v.plates.length - 1; i >= 0 && thrown < n; i--) {
      const pl = v.plates[i];
      if (!pl.visible) continue;
      const c = pl.clone(true);
      pl.matrixWorld.decompose(c.position, c.quaternion, c.scale);
      pl.visible = false;
      this.addPiece(c, v.g.position, { power: o.power || 1.6, life: 3.2, burn: true, vx: o.vx, vz: o.vz });
      thrown++;
    }
    v.shown = v.plates.filter((p) => p.visible).length;
  }
  breakConstruct() {
    const v = this.cView; if (!v) return;
    this.throwPlates(99, { power: 2.4 });
    this.breakApart({ g: v.g }, { max: 10, power: 2 });
    this.cView = null; this.cKey = null;
  }

  // ---------------------------------------------------------------- sync the scene to the world
  sync(W, dt) {
    const t = this.time;
    // ships
    const seenP = new Set();
    for (const p of W.players) {
      const v = this.playerView(p);
      seenP.add(p.id);
      const L = this.shipLights[p.id - 1];
      if (!p.alive) { v.g.visible = false; if (L) L.intensity = 0; continue; }
      v.g.visible = !(p.inv > 0 && p.inv < F.inv && Math.floor(t * 14) % 3 === 0);
      if (!v.g.visible && p.inv <= 0) v.g.visible = true;
      v.g.position.set(this.X(p.x), 0, this.Z(p.z));
      v.g.rotation.y = -p.a;
      const turn = clamp(-wdA(p.a - v.lastA) / Math.max(dt, 1e-3), -6, 6);
      v.lastA = p.a;
      v.roll += (turn * 0.13 - v.roll) * Math.min(1, dt * 6);
      if (v.bank) v.bank.rotation.x = clamp(v.roll, -0.75, 0.75);
      const th = p.thrust || 0;
      for (const f of v.flames || []) f.scale.x = 0.25 + th * 1.25 + Math.sin(t * 50 + f.id) * 0.08;
      // engine trail
      if (th > 0.25 && !CALM.on) {
        v.trailT -= dt;
        if (v.trailT <= 0) {
          v.trailT = 0.03;
          const c = Math.cos(p.a), s = Math.sin(p.a);
          for (const side of [-0.55, 0.55]) this.fx.fireP.add({ x: v.g.position.x - c * 1.9 - s * side, y: 0, z: v.g.position.z - s * 1.9 + c * side, vx: -c * 6 + p.vx * 0.5, vy: 0, vz: -s * 6 + p.vz * 0.5, s0: 0.75, s1: 0.15, max: 0.32, a: 0.75, r: 0.55, g: 0.8, b: 1, drag: 2, grav: 0, fade: 0.6 });
        }
      }
      const shK = (p.shield > 0 ? 0.07 + 0.03 * Math.sin(t * 3) : 0) + v.hurt;
      v.hurt = Math.max(0, v.hurt - dt * 2.2);
      v.sh.material.uniforms.uK.value = shK; v.sh.material.uniforms.uTime.value = t; v.sh.visible = shK > 0.01;
      if (L) { L.position.set(v.g.position.x, 6, v.g.position.z); L.intensity = 38; }
    }
    for (const [id, v] of this.views.p) if (!seenP.has(id)) { this.scene.remove(v.g); this.views.p.delete(id); }
    for (let i = W.players.length; i < 2; i++) this.shipLights[i].intensity = 0;

    // machines
    const seen = new Set();
    let ai = 0;
    for (const e of W.enemies) {
      if (e.hp <= 0) continue;
      const v = this.enemyView(e);
      seen.add(e.id);
      const x = this.X(e.x), z = this.Z(e.z);
      v.g.position.set(x, 0, z);
      v.g.rotation.y = -e.a;
      const born = e.born > 0 ? 1 - e.born / 0.9 : 1;
      const sc = born < 1 ? Math.max(0.01, Math.pow(born, 2)) : 1 + (e.hitT > 0 ? 0.12 : 0);
      v.g.scale.setScalar(sc);
      if (e.type === 'gath') {
        const want = e.carry ? 0.05 : (e.tgt ? 0.75 : 0.3);
        v.open += (want - v.open) * Math.min(1, dt * 5);
        if (v.claws) for (const c of v.claws) c.rotation.z = v.open;
        if (v.lamp) v.lamp.scale.setScalar(0.85 + 0.25 * Math.sin(t * 6 + e.id));
        if (v.body) v.body.position.y = Math.sin(t * 2.2 + e.id) * 0.08;
      } else {
        const turn = clamp(-wdA(e.a - v.lastA) / Math.max(dt, 1e-3), -5, 5);
        v.lastA = e.a; v.roll += (turn * 0.12 - v.roll) * Math.min(1, dt * 5);
        if (v.bank) v.bank.rotation.x = clamp(v.roll, -0.8, 0.8);
        if (v.emitter) {
          const R = W.R, k = e.tell > 0 ? 1 - e.tell / R.warn : 0;
          v.emitter.material.color.copy(v.emBase).multiplyScalar(0.6 + k * 5 + (k > 0.7 ? Math.sin(t * 40) * 1.5 : 0));
          v.emitter.scale.setScalar(1 + k * 0.9);
          if (e.tell > 0 && ai < this.aims.length) {
            const A = this.aims[ai++], len = 30;
            this.setStreak(A, x + Math.cos(e.aimA) * 1.6, z + Math.sin(e.aimA) * 1.6, x + Math.cos(e.aimA) * len, z + Math.sin(e.aimA) * len, 0.5 + k * 0.4, 0.2);
            A.material.uniforms.uK.value = (0.25 + k * 1.1) * (CALM.on ? 0.6 : 1);
            A.material.uniforms.uTime.value = t;
          }
        }
        for (const f of v.flames || []) f.scale.x = 0.6 + Math.hypot(e.vx, e.vz) / 14 + Math.sin(t * 40 + e.id) * 0.1;
      }
    }
    for (; ai < this.aims.length; ai++) this.aims[ai].visible = false;
    for (const [id, v] of this.views.e) if (!seen.has(id)) { this.scene.remove(v.g); this.views.e.delete(id); }
    // warp gates for machines arriving
    let gi = 0;
    for (const e of W.enemies) {
      if (e.born <= 0 || gi >= this.gates.length) continue;
      const m = this.gates[gi++];
      m.position.set(this.X(e.x), -0.4, this.Z(e.z)); m.scale.setScalar(3.4); m.visible = true;
      m.material.uniforms.uProg.value = 1 - e.born / 0.9; m.material.uniforms.uTime.value = t;
      m.material.uniforms.uColor.value.set(e.type === 'reaver' ? 0xff4a3a : 0xffc04a);
    }
    for (; gi < this.gates.length; gi++) this.gates[gi].visible = false;
    // mining beams
    let bi = 0;
    for (const b of W.beams) {
      const e = W.enemies.find((q) => q.id === b.eid), k = W.rocks.find((q) => q.id === b.rid);
      if (!e || !k || bi >= this.beams.length) continue;
      const ex = this.X(e.x), ez = this.Z(e.z), kx = ex + wd(k.x - e.x), kz = ez + wd(k.z - e.z);
      const d = Math.hypot(kx - ex, kz - ez) || 1;
      const m = this.beams[bi++];
      this.setStreak(m, ex, ez, kx - ((kx - ex) / d) * k.r * 0.85, kz - ((kz - ez) / d) * k.r * 0.85, 0.35, 0.1);
      m.material.uniforms.uK.value = Math.min(1, b.t * 3) * 1.4; m.material.uniforms.uTime.value = t;
    }
    for (; bi < this.beams.length; bi++) this.beams[bi].visible = false;

    this.syncRocks(W, t);
    this.syncGuides(W, t);
    this.syncCrystals(W, t);
    this.syncShots(W);
    this.syncConstruct(W, dt, t);
    // pods
    const seenQ = new Set();
    for (const q of W.pods) {
      const v = this.podView(q); seenQ.add(q.id);
      v.g.position.set(this.X(q.x), 0.4 + Math.sin(t * 2 + q.id) * 0.2, this.Z(q.z));
      v.g.rotation.y = t * 1.3; v.g.visible = q.life > 3 || Math.floor(t * 8) % 2 === 0;
    }
    for (const [id, v] of this.views.pods) if (!seenQ.has(id)) { this.scene.remove(v.g); this.views.pods.delete(id); }
  }
  syncRocks(W, t) {
    const counts = this.rockI.map(() => 0);
    const tint = this.rockTint;
    let sn = 0;
    const S = this.studI;
    for (const k of W.rocks) {
      const gi = k.shape % 6, I = this.rockI[gi];
      if (counts[gi] >= 48) continue;
      const x = this.X(k.x), z = this.Z(k.z);
      _ax.set(Math.cos(k.tilt), 0.7, Math.sin(k.tilt)).normalize();
      _q.setFromAxisAngle(_ax, k.rot);
      _s.setScalar(k.r * 1.0);
      _p.set(x, -k.r * 0.15, z);
      _m.compose(_p, _q, _s);
      I.setMatrixAt(counts[gi], _m);
      const f = ((k.shape >> 3) % 100) / 100;
      _c.copy(tint[0]).lerp(tint[1], f * 0.8);
      if (k.hitT > 0) _c.lerp(WHITE, Math.min(1, k.hitT * 1.2));
      I.setColorAt(counts[gi], _c);
      counts[gi]++;
      // crystal studs show how much is left in it
      const studs = this.rockGeos[gi].userData.studs;
      const show = Math.min(studs.length, k.ore);
      for (let i = 0; i < show && sn < 300; i++) {
        const st = studs[i];
        _v.copy(st.p).multiplyScalar(k.r).applyQuaternion(_q).add(_p);
        const qs = _q2.setFromUnitVectors(UP, _ax.copy(st.n).applyQuaternion(_q));
        const ss = st.s * (0.7 + k.r * 0.12);
        S.setMatrixAt(sn++, _m.compose(_v, qs, _s.setScalar(ss)));
      }
    }
    this.rockI.forEach((I, i) => { I.count = counts[i]; I.instanceMatrix.needsUpdate = true; if (I.instanceColor) I.instanceColor.needsUpdate = true; });
    S.count = sn; S.instanceMatrix.needsUpdate = true;
    this.rockMat.userData.U.uTime.value = t;
  }
  syncCrystals(W, t) {
    const I = this.crystalI;
    this.heldBy = this.heldBy || new Map(); this.heldBy.clear();
    for (const e of W.enemies) if (e.carry) this.heldBy.set(e.id, e);
    let n = 0;
    const col = _c.set(this.look.crystal);
    for (const c of W.crystals) {
      if (n >= 120) break;
      const x = this.X(c.x), z = this.Z(c.z);
      const blink = c.held ? 1 : c.life < 3 ? (Math.floor(t * 8) % 2 ? 0.25 : 1) : 1;
      _q.setFromEuler(_eu.set(0.5, c.spin, 0.3 * Math.sin(c.spin)));
      _p.set(x, 0.2 + Math.sin(t * 2 + c.id) * 0.15, z);
      if (c.held) { const e = this.heldBy.get(c.held); if (e) _p.set(this.X(e.x) + Math.cos(e.a) * 1.0, 0.15, this.Z(e.z) + Math.sin(e.a) * 1.0); }
      I.setMatrixAt(n, _m.compose(_p, _q, _s.setScalar(c.held ? 0.8 : 1.05)));
      this.cgPos[n * 3] = x; this.cgPos[n * 3 + 1] = _p.y; this.cgPos[n * 3 + 2] = z;
      const k = 0.7 * blink;
      this.cgCol[n * 3] = col.r * k; this.cgCol[n * 3 + 1] = col.g * k; this.cgCol[n * 3 + 2] = col.b * k;
      n++;
    }
    I.count = n; I.instanceMatrix.needsUpdate = true;
    for (let i = n; i < 120; i++) { this.cgCol[i * 3] = this.cgCol[i * 3 + 1] = this.cgCol[i * 3 + 2] = 0; }
    const g = this.crystalGlow.geometry; g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
    g.setDrawRange(0, n);
    this.crystalMat.emissive.copy(hdr(this.look.crystal, 2.2 + 0.4 * Math.sin(t * 3)));
  }
  syncShots(W) {
    let n = 0;
    for (const s of W.shots) {
      if (n >= 160) break;
      const a = Math.atan2(s.vz, s.vx);
      _q.setFromAxisAngle(UP, -a);
      _p.set(this.X(s.x), 0.3, this.Z(s.z));
      this.shotI.setMatrixAt(n, _m.compose(_p, _q, _s.set(1.1, 0.06, 0.06)));
      this.shotGlowI.setMatrixAt(n, _m.compose(_p, _q, _s.set(1.5, 0.13, 0.13)));
      n++;
    }
    this.shotI.count = this.shotGlowI.count = n;
    let b = 0, ab = 0;
    for (const q of W.bolts) {
      const a = Math.atan2(q.vz, q.vx), x = this.X(q.x), z = this.Z(q.z);
      if (q.ab) { if (ab < 40) this.abI.setMatrixAt(ab++, _m.compose(_p.set(x, 0.3, z), _q.identity(), _s.setScalar(0.32))); continue; }
      if (b >= 80) continue;
      _p.set(x, 0.3, z);
      this.boltI.setMatrixAt(b, _m.compose(_p, _q.identity(), _s.setScalar(q.r * 0.85)));
      _q.setFromAxisAngle(UP, -a);
      this.boltTailI.setMatrixAt(b, _m.compose(_p, _q, _s.set(2.6, q.r * 0.7, q.r * 0.7)));
      b++;
    }
    this.boltI.count = this.boltTailI.count = b; this.abI.count = ab;
    let k = 0;
    for (const q of W.bombs) {
      if (k >= 40) break;
      const x = this.X(q.x), z = this.Z(q.z);
      this.bombI.setMatrixAt(k, _m.compose(_p.set(x, 0.5, z), _q.setFromAxisAngle(UP, this.time * 9), _s.setScalar(0.42 + 0.06 * Math.sin(this.time * 30 + k))));
      this.bhPos[k * 3] = x; this.bhPos[k * 3 + 1] = 0.5; this.bhPos[k * 3 + 2] = z;
      if (k < 2) { this.bombLights[k].position.set(x, 2.5, z); this.bombLights[k].intensity = 30; }
      if (!CALM.on || k % 2 === 0) {
        const c = Math.cos(q.a), s = Math.sin(q.a);
        this.fx.fireP.add({ x: x - c * 0.6, y: 0.5, z: z - s * 0.6, vx: -c * 4, vy: 0, vz: -s * 4, s0: 1.0, s1: 0.2, max: 0.45, a: 0.8, r: 0.75, g: 0.6, b: 1, drag: 1.5, grav: 0, fade: 0.6 });
        if (Math.random() < 0.5) this.fx.dustP.add({ x: x - c, y: 0.4, z: z - s, vx: 0, vy: 0, vz: 0, s0: 0.4, s1: 1.5, max: 1.2, a: 0.22, r: 0.5, g: 0.48, b: 0.6, drag: 1, grav: 0, fade: 0.7 });
      }
      k++;
    }
    for (let i = k; i < 2; i++) this.bombLights[i].intensity = 0;
    this.bombI.count = k;
    this.bombHalo.geometry.setDrawRange(0, k); this.bombHalo.geometry.attributes.position.needsUpdate = true;
    for (const I of [this.shotI, this.shotGlowI, this.boltI, this.boltTailI, this.abI, this.bombI]) I.instanceMatrix.needsUpdate = true;
  }
  syncConstruct(W, dt, t) {
    const C = W.C;
    if (!C || C.st === 'gone') {
      if (this.cView && (!C || C.st === 'gone')) { this.scene.remove(this.cView.g); this.cView = null; this.cKey = null; }
      for (const m of [this.pullRing, this.dangerRing, this.buildRing, this.laneMesh]) m.visible = false;
      this.coreLight.intensity = 0;
      return;
    }
    const v = this.constructView(C.key);
    const x = this.X(C.x), z = this.Z(C.z);
    const awake = isAwake(C);
    v.g.position.set(x, -1.2, z);
    v.g.rotation.y = -C.a;
    // plates: the build progress, then the armour left once it is awake
    const N = v.plates.length;
    const want = C.st === 'dying' ? 0 : awake ? Math.max(1, Math.ceil(N * C.hp / C.max)) : Math.round(N * C.pieces / C.N);
    if (want < v.shown) this.throwPlates(v.shown - want);
    else if (want > v.shown) {
      for (let i = 0; i < N && v.shown < want; i++) if (!v.plates[i].visible) { v.plates[i].visible = true; v.dropT[i] = 0.7; v.shown++; }
    }
    for (let i = 0; i < N; i++) {
      const pl = v.plates[i];
      if (v.dropT[i] > 0) {
        v.dropT[i] = Math.max(0, v.dropT[i] - dt);
        const f = v.dropT[i] / 0.7;
        pl.scale.setScalar(1 + f * 0.35);
        pl.userData.y0 ??= pl.position.y;
        pl.position.y = pl.userData.y0 + f * f * 4;
      } else if (pl.userData.y0 !== undefined) { pl.position.y = pl.userData.y0; pl.scale.setScalar(1); }
    }
    v.iris += ((C.iris || 0) - v.iris) * Math.min(1, dt * 3);
    if (v.setIris) v.setIris(v.iris);
    if (v.spin) v.spin(t, awake ? 1 : 0);
    v.hit = Math.max(0, v.hit - dt * 2.5);
    const pulse = awake ? 2.2 + Math.sin(t * (C.st === 'tell' || C.st === 'ltell' ? 18 : 4)) * 0.8 : 0.45 + 0.2 * Math.sin(t * 1.5);
    v.coreMat.color.copy(v.coreBase).multiplyScalar(pulse + v.hit * 6);
    this.coreLight.position.set(x, 6, z); this.coreLight.intensity = awake ? 220 + v.hit * 400 : 40;
    this.coreLight.color.copy(v.coreBase);
    if (C.st === 'dying') { v.g.position.x += (Math.random() - 0.5) * 0.8; v.g.position.z += (Math.random() - 0.5) * 0.8; }
    // warnings: the tractor ring, the lunge lane, the danger ring and the build ring
    const pr = this.pullRing;
    if (C.st === 'tell' || C.st === 'pull') {
      pr.visible = true; pr.position.set(x, -0.3, z); pr.scale.setScalar(48);
      const U = pr.material.uniforms; U.uTime.value = t; U.uLive.value = C.st === 'pull' ? 1 : 0; U.uProg.value = C.st === 'tell' ? clamp(1 - C.stT / Math.max(0.1, W.R.pullTell), 0, 1) : 1;
      U.uAlpha.value = CALM.on ? 0.55 : 0.85;
      if (C.st === 'pull' && Math.random() < dt * 40) {
        const a = Math.random() * TAU, d = 30 + Math.random() * 18;
        this.fx.fireP.add({ x: x + Math.cos(a) * d, y: 0, z: z + Math.sin(a) * d, vx: -Math.cos(a) * 26, vy: 0, vz: -Math.sin(a) * 26, s0: 0.5, s1: 0.2, max: 1.1, a: 0.7, r: 1, g: 0.45, b: 0.3, drag: 0, grav: 0, fade: 0.5 });
      }
    } else pr.visible = false;
    const ln = this.laneMesh;
    if (C.st === 'ltell' || C.st === 'lunge') {
      const a = C.st === 'lunge' ? Math.atan2(C.lz, C.lx) : Math.atan2(C.lz, C.lx);
      ln.visible = true; ln.position.set(x, -0.25, z); ln.rotation.y = -a - Math.PI / 2;
      ln.scale.set(C.hitR * 1.1, 1, 46);
      const U = ln.material.uniforms; U.uTime.value = t; U.uProg.value = C.st === 'lunge' ? 1 : clamp(1 - C.stT / 1.0, 0, 1); U.uAlpha.value = 0.9;
    } else ln.visible = false;
    const dr = this.dangerRing;
    dr.visible = awake && C.st !== 'dying'; dr.position.set(x, -0.35, z); dr.scale.setScalar(C.hitR + 1.6);
    dr.material.uniforms.uLive.value = 0; dr.material.uniforms.uProg.value = 0; dr.material.uniforms.uTime.value = t; dr.material.uniforms.uAlpha.value = 0.55;
    const br = this.buildRing;
    br.visible = C.st === 'build'; br.position.set(x, -0.35, z); br.scale.setScalar(C.R + 4.5);
    br.material.uniforms.uProg.value = C.pieces / C.N; br.material.uniforms.uTime.value = t; br.material.uniforms.uAlpha.value = 0.8;
    // half built: the build ring turns teal (a charge now wakes it early)
    br.material.uniforms.uColor.value.set(C.pieces >= Math.ceil(C.N / 2) ? 0x52ffd8 : 0xffb347);
    // awake: a timer ring for the core, green while open (charges hurt it), red while shut (they bounce off)
    const cr = this.coreRing, live = awake && C.st !== 'wake' && C.st !== 'dying';
    cr.visible = live; cr.position.set(x, -0.3, z); cr.scale.setScalar(C.R + 5.5);
    if (live) {
      const open = coreOpen(C), T = Math.max(0.1, open ? W.R.openT : W.R.shutT);
      cr.material.uniforms.uProg.value = clamp((C.cycT || 0) / T, 0, 1);
      cr.material.uniforms.uColor.value.set(open ? 0x7dff9a : 0xff4a3a);
      cr.material.uniforms.uAlpha.value = open ? 1.1 : 0.8; cr.material.uniforms.uTime.value = t;
    }
  }

  // the autopilot's goal: a reticle on its target and a dashed line to it (demo / playthrough)
  setIntent(target, me) { this.intent = target && me && me.alive ? { target, me } : null; }
  syncGuides(W, t) {
    // mining progress on rocks being shot (fills toward the next crystal)
    let ci = 0;
    for (const k of W.rocks) if (k.hitT > 0.05) this.rockHitT.set(k.id, t);
    for (const k of W.rocks) {
      const lt = this.rockHitT.get(k.id);
      if (lt === undefined || t - lt > 1.8 || k.ore <= 0 || k.hits <= 0 || ci >= this.chipRings.length) continue;
      const m = this.chipRings[ci++];
      m.visible = true; m.position.set(this.X(k.x), -0.2, this.Z(k.z)); m.scale.setScalar(k.r + 2.2);
      const U = m.material.uniforms; U.uProg.value = clamp(k.hits / Math.max(1, W.R.chip), 0, 1); U.uTime.value = t; U.uAlpha.value = 0.7 * Math.min(1, (1.8 - (t - lt)) * 2);
    }
    for (; ci < this.chipRings.length; ci++) this.chipRings[ci].visible = false;
    if (this.rockHitT.size > 200) this.rockHitT.clear();
    // gatherers carrying a crystal
    let gi = 0;
    for (const e of W.enemies) {
      if (!e.carry || e.hp <= 0 || gi >= this.carriers.length) continue;
      const m = this.carriers[gi++];
      m.visible = true; m.position.set(this.X(e.x), -0.3, this.Z(e.z)); m.scale.setScalar(2.4 + 0.25 * Math.sin(t * 6 + e.id));
      const U = m.material.uniforms; U.uProg.value = 0.6; U.uTime.value = t; U.uAlpha.value = 0.9;
    }
    for (; gi < this.carriers.length; gi++) this.carriers[gi].visible = false;
    // what the autopilot is going for
    const I = this.intent, rt = this.reticle, ln = this.intentLine;
    if (!I) { rt.visible = false; ln.visible = false; return; }
    const tx = this.X(I.target.x), tz = this.Z(I.target.z), px = this.X(I.me.x), pz = this.Z(I.me.z);
    rt.visible = true; rt.position.set(tx, -0.15, tz); rt.scale.setScalar(Math.max(2, I.target.r || 2));
    rt.material.uniforms.uProg.value = 0.35 + 0.25 * Math.sin(t * 4); rt.material.uniforms.uTime.value = t; rt.material.uniforms.uAlpha.value = 0.9;
    const dx = tx - px, dz = tz - pz, d = Math.hypot(dx, dz) || 1, rr = Math.max(2, I.target.r || 2);
    if (d > rr + 4) { this.setStreak(ln, px + (dx / d) * 2.4, pz + (dz / d) * 2.4, tx - (dx / d) * rr, tz - (dz / d) * rr, 0.35, 0.15); ln.material.uniforms.uK.value = 0.55; ln.material.uniforms.uTime.value = t; }
    else ln.visible = false;
  }

  // ---------------------------------------------------------------- camera
  addTrauma(t) { this.trauma = Math.min(1, this.trauma + t); }
  resize() {
    const w = innerWidth, h = innerHeight;
    this.r.setPixelRatio(this.q.dpr * this.scale);
    this.r.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    const pw = Math.round(w * this.q.dpr * this.scale), ph = Math.round(h * this.q.dpr * this.scale);
    this.post.setSize(pw, ph);
    for (const p of [this.fx.dustP, this.fx.fireP]) p.mat.uniforms.uScale.value = ph * 0.85;
  }
  setScale(s) { if (Math.abs(s - this.scale) < 0.02) return; this.scale = s; this.resize(); }
  get portrait() { return this.camera.aspect < 0.85; }
  // frame a few field points closely (demo slow-mo shots)
  frameShot(pts, dur) { this.shot = { pts: pts.map(([x, z]) => [this.X(x), this.Z(z)]), t: dur }; }
  // o: { me: player or null, C: construct, cine, snap, shake }
  updateCamera(dt, o = {}) {
    const pitch = 1.1;   // about 63 degrees down
    let tx = this.cx, tz = this.cz, width = this.portrait ? 44 : 64;
    if (o.cine) {
      const a = this.time * 0.05;
      tx = this.cx + Math.cos(a) * 0.02; tz = this.cz - dt * 4; width = this.portrait ? 60 : 92;
    } else if (this.shot && this.shot.t > 0) {
      this.shot.t -= dt;
      let x = 0, z = 0; for (const p of this.shot.pts) { x += p[0]; z += p[1]; }
      x /= this.shot.pts.length; z /= this.shot.pts.length;
      let span = 14; for (const p of this.shot.pts) span = Math.max(span, Math.abs(p[0] - x) * 2.4 + 10, Math.abs(p[1] - z) * 3.2 + 10);
      tx = x; tz = z; width = span;
    } else if (o.me) {
      tx = this.X(o.me.x) + o.me.vx * 0.42; tz = this.Z(o.me.z) + o.me.vz * 0.42;
      // an awake construct close by stays in frame: lean toward it and pull back so both fit
      if (o.C && isAwake(o.C) && o.C.st !== 'dying') {
        const dx = wd(o.C.x - o.me.x), dz = wd(o.C.z - o.me.z), d = Math.hypot(dx, dz);
        const k = clamp((85 - d) / 30, 0, 1);
        if (k > 0) {
          tx += dx * 0.3 * k; tz += dz * 0.3 * k;
          const need = Math.max(Math.abs(dx) * 0.7 * 1.25 + 26, (Math.abs(dz) * 0.7 * 1.5 + 22) * this.camera.aspect);
          width = Math.min(this.portrait ? 80 : 118, Math.max(width, width + (need - width) * k));
        }
      }
    }
    const k = o.snap ? 1 : 1 - Math.exp(-dt * (this.shot && this.shot.t > 0 ? 4 : 3.2));
    this.cx += (tx - this.cx) * k; this.cz += (tz - this.cz) * k;
    this.zoom += (width - this.zoom) * (o.snap ? 1 : 1 - Math.exp(-dt * 1.5));
    const vf = THREE.MathUtils.degToRad(this.camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * this.camera.aspect);
    const d = this.zoom / (2 * Math.tan(hf / 2));
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    const sh = this.trauma * this.trauma * (o.shake ?? 1) * 0.9;
    const c = this.camera;
    c.position.set(this.cx + (sh ? (Math.random() - 0.5) * sh : 0), Math.sin(pitch) * d, this.cz + Math.cos(pitch) * d + (sh ? (Math.random() - 0.5) * sh : 0));
    c.up.set(0, 1, 0);
    c.lookAt(this.cx, 0, this.cz);
    this.sky.position.copy(c.position);
    // the backdrop body sits far away, fixed against the sky; star layers tile and drift with depth
    const bd = this.backdrops[this.lookI];
    if (bd) {
      // fixed against the sky: up and to the right of the view, partly off screen
      const q = c.quaternion;
      _ax.set(0.62, 0.36, -1).normalize().applyQuaternion(q).multiplyScalar(1500);
      bd.position.copy(c.position).add(_ax);
      bd.quaternion.copy(q);
    }
    for (const L of this.starLayers) L.pts.position.set(Math.floor(this.cx / L.T) * L.T - L.T * 0.5, L.y, Math.floor(this.cz / L.T) * L.T - L.T * 0.5);
    this.key.target.position.set(this.cx, 0, this.cz); this.key.position.set(...this.look.sunDir).normalize().multiplyScalar(100).add(this.key.target.position);
    this.fill.target.position.set(this.cx, 0, this.cz); this.fill.position.set(-this.look.sunDir[0] * 100 + this.cx, -40, -this.look.sunDir[2] * 100 + this.cz);
  }
  project(x, y, z, out) {
    _v.set(this.X(x), y, this.Z(z)).project(this.camera);
    out.x = (_v.x * 0.5 + 0.5) * innerWidth; out.y = (-_v.y * 0.5 + 0.5) * innerHeight; out.z = _v.z;
    return out;
  }
  shock(x, z, k = 1) { this.shocks.push({ x, z, t: 0, max: 0.6, k }); if (this.shocks.length > 6) this.shocks.shift(); }
  flashScreen(a, color = 0xffffff) { _c.set(color); this.flash.set(_c.r, _c.g, _c.b, Math.max(this.flash.w, a * (CALM.on ? 0.25 : 0.55))); }

  render(dt, p = {}) {
    this.time += dt;
    const t = this.time;
    this.fx.update(dt);
    this.updatePieces(dt);
    for (const m of [...this.gates, this.pullRing, this.dangerRing, this.buildRing, this.coreRing, this.reticle, this.laneMesh]) if (m.visible) m.material.uniforms.uTime.value = t;
    const bd = this.backdrops[this.lookI];
    if (bd) { if (bd.userData.disc) bd.userData.disc.material.uniforms.uTime.value = t; bd.traverse((o) => { if (o.material && o.material.uniforms && o.material.uniforms.uTime) o.material.uniforms.uTime.value = t; }); }
    this.flash.w = Math.max(0, this.flash.w - dt * 3);
    const shocks = [];
    for (const s of this.shocks) {
      s.t += dt;
      const f = s.t / s.max;
      if (f >= 1) continue;
      this.project(s.x, 0, s.z, P0);
      shocks.push(new THREE.Vector4(P0.x / innerWidth, 1 - P0.y / innerHeight, f * 0.35 * s.k, (1 - f) * (CALM.on ? 0.3 : 0.8) * s.k));
    }
    this.shocks = this.shocks.filter((s) => s.t < s.max);
    const L = this.look;
    this.post.render(this.scene, this.camera, {
      bloom: L.bloom * (p.bloom ?? 1), threshold: 1.1, exposure: L.exposure * (p.exposure ?? 1), chroma: 0.0014 + (p.chroma || 0), time: t, desat: p.desat || 0, fade: p.fade || 0, vignette: 0.45 + (p.vignette || 0),
      flash: this.flash, tint: _tint.set(...L.grade), shocks, lens: [],
    });
  }

  // draw one of everything once at boot so the first appearance of anything does not stall on a shader compile
  warmUp() {
    const tmp = [MD.ship(LIVERIES[0].color, LIVERIES[0].accent).g, MD.ship(P2_LIVERY.color, P2_LIVERY.accent).g, MD.gatherer().g, MD.reaver().g];
    for (const k of PW_KEYSW) tmp.push(MD.pod(POWERUPS[k].color).g);
    for (const k of Object.keys(CONSTRUCTS)) tmp.push(MD.construct(k).g);
    tmp.forEach((o, i) => { o.position.set(this.cx - 30 + i * 5, 0, this.cz); this.scene.add(o); });
    const sh = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 10), this.shieldMat); sh.position.set(this.cx, 0, this.cz); this.scene.add(sh); tmp.push(sh);
    const icon = new THREE.Sprite(this.iconFor('twin')); icon.position.set(this.cx, 2, this.cz); tmp.push(icon); this.scene.add(icon);
    const vis = [...this.gates.slice(0, 1), this.pullRing, this.dangerRing, this.buildRing, this.coreRing, this.reticle, this.intentLine, this.chipRings[0], this.carriers[0], this.laneMesh, this.aims[0], this.beams[0]];
    for (const m of vis) { m.visible = true; m.position.set(this.cx, 0, this.cz); m.scale.setScalar(2); }
    for (const I of [this.shotI, this.shotGlowI, this.boltI, this.boltTailI, this.abI, this.bombI, this.crystalI, this.studI, ...this.rockI]) { I.count = 1; I.setMatrixAt(0, _m.makeTranslation(this.cx, 0, this.cz)); I.instanceMatrix.needsUpdate = true; }
    this.fx.explode(this.cx, 0, this.cz, 1, { metal: true, rock: true });
    this.fx.flash(this.cx, 1, this.cz, 1);
    this.breakApart({ g: tmp[2] }, { keep: true, max: 6 });
    const pr = { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] };
    const first = this.lookI;
    for (let i = LOOKS.length - 1; i >= 0; i--) {
      this.lookI = -1; this.setLook(i);
      this.updateCamera(0.016, { snap: true });
      this.r.compile(this.scene, this.camera);
      this.post.render(this.scene, this.camera, pr);
    }
    if (first !== 0) { this.lookI = -1; this.setLook(first); }
    for (const o of tmp) this.scene.remove(o);
    for (const m of vis) m.visible = false;
    for (const I of [this.shotI, this.shotGlowI, this.boltI, this.boltTailI, this.abI, this.bombI, this.crystalI, this.studI, ...this.rockI]) I.count = 0;
    for (const P of this.pieces) this.scene.remove(P.o);
    this.pieces = [];
    this.fx.clear();
  }
}
const PW_KEYSW = Object.keys(POWERUPS);
const P0 = { x: 0, y: 0, z: 0 };
function wdA(d) { d %= TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
void WS;
