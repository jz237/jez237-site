// Lancewing renderer. The sim's 2D slice (x round the ring, y up) is bent onto a cylinder of radius F.R round
// the storm spire; the camera orbits outside the ring and follows the player, so play is 2.5D but everything
// is real 3D: skyrays and their lancers, floating rock ledges with each sector's stone, the storm sea, the
// spire and its lightning, telegraph ribbons for every hazard and boss attack, HDR post with bloom.
// Nothing here changes the world.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=17';
import * as TX from './textures.js?v=17';
import * as MD from './models.js?v=17';
import { FX, CALM } from './fx.js?v=17';
import { F, POWERUPS, BOSSES, HUNTER, LAYOUT, SECTORS, rockHang, rockDrop } from './config.js?v=17';
import { weakPos, ledgeUnder } from './sim.js?v=17';

export { CALM };
const RR = F.R, H = F.H;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const dXr = (a, b) => ((b - a + F.C * 1.5) % F.C) - F.C / 2;
const hdr = MD.hdr;
const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _m = new THREE.Matrix4(), _c = new THREE.Color(), _tint = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _e = new THREE.Euler();
const UP = new THREE.Vector3(0, 1, 0);
const _v4 = new THREE.Vector3(), _v5 = new THREE.Vector3();
const TURN_RATE = Math.PI / 0.26;   // a jouster swings right round in about a quarter of a second
// one wing beat as a stroke from wings up (+1, phase 0) down to wings down (-1, phase 0.38) and back up
function stroke(p) { p = ((p % 1) + 1) % 1; if (p < 0.38) { const f = p / 0.38; return 1 - 2 * f * f * (3 - 2 * f); } const f = (p - 0.38) / 0.62; return -1 + 2 * f * f * (3 - 2 * f); }
// sim (x, y) -> world, at radius RR + dr
export function toWorld(x, y, out = new THREE.Vector3(), dr = 0) { const th = x / RR; return out.set(Math.sin(th) * (RR + dr), y, Math.cos(th) * (RR + dr)); }
const tangent = (x, out) => { const th = x / RR; return out.set(Math.cos(th), 0, -Math.sin(th)); };
const radial = (x, out) => { const th = x / RR; return out.set(Math.sin(th), 0, Math.cos(th)); };
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash3 = (x, y, z) => { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, t) => a + (b - a) * t;
  const c = (i, j, k) => hash3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
}

// 1.9: medium (phones) bakes its procedural textures at 512 (a quarter of the work at boot; the ledges look the same
// on a phone screen)
export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), shadow: 2048, msaa: true, bloomLevels: 5, tex: 1024, dust: 2000, sparks: 1500, debris: 200, flashLights: 4, props: 1, waves: 1 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), shadow: 2048, msaa: true, bloomLevels: 4, tex: 512, dust: 1300, sparks: 1000, debris: 130, flashLights: 3, props: 0.8, waves: 1 },
    low: { name: 'low', dpr: 1, shadow: 1024, msaa: false, bloomLevels: 3, tex: 512, dust: 700, sparks: 500, debris: 70, flashLights: 2, props: 0.5, waves: 0 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ sector looks
export const LOOKS = [
  // 1 SUNSET RUINS: a low gold sun over a storm sea at dusk, rose clouds, warm haze
  { key: 'ruins', sky: [0x1a2850, 0xb0606a, 0xffb070], sun: 0xffd0a0, sunDir: [-0.5, 0.09, -0.86], sunDisc: 1, keyI: 3.4, hemi: [0x7a90d0, 0x5a3a30, 0.72], fill: 0xff8a5a, fillI: 0.5,
    fog: 0x9a6a66, fogD: 0.0068, exposure: 1.05, bloom: 0.8, grade: [1.05, 0.99, 0.93], sea: [0x0a1624, 0x2a3c50, 0xf0d8c0, 0x000000], rock: 'ruins', top: 'pavers', topTint: 0xd8c8b0,
    accent: 0xffb347, spire: 0xffc890, dust: 0xa89080, dustLight: 1.2, env: [0xffb070, 0x5a5a8a, 0x2a2020], amb: 'embers', cloud: [0xffa080, 0x3a3050], stars: 0, rune: 0xffa040 },
  // 2 CRYSTAL CAVERNS: bioluminescent sea cliffs under a teal night, a pale moon, glowing plankton in the swell
  { key: 'caverns', sky: [0x020812, 0x04222c, 0x0a4a52], sun: 0xb8fff4, sunDir: [0.35, 0.5, -0.78], sunDisc: 1, keyI: 2.0, hemi: [0x3aa8b0, 0x0a2422, 0.95], fill: 0x30ffc8, fillI: 0.75,
    fog: 0x08323a, fogD: 0.0105, exposure: 1.3, bloom: 0.95, grade: [0.94, 1.03, 1.03], sea: [0x021412, 0x0a3a38, 0x9affe8, 0x14d8a8], rock: 'caverns', top: 'rock', topTint: 0x9ab8c0,
    accent: 0x40ffd0, spire: 0x60fff0, dust: 0x507a78, dustLight: 0.9, env: [0x80fff0, 0x1a5a54, 0x020606], amb: 'spores', cloud: [0x1a5a62, 0x04141a], stars: 1, rune: 0x40ffd0 },
  // 3 SKY FOUNDRY: forge platforms under a smoke-dark sky lit orange from below, sparks everywhere
  { key: 'foundry', sky: [0x120e0d, 0x3a1c12, 0xb8541a], sun: 0xffd0a0, sunDir: [0.45, 0.4, -0.8], sunDisc: 0, keyI: 2.7, hemi: [0x8a7c7a, 0x3a1406, 0.62], fill: 0xff6a1a, fillI: 0.95,
    fog: 0x3a2016, fogD: 0.0094, exposure: 1.0, bloom: 0.85, grade: [1.04, 0.98, 0.92], sea: [0x0c0806, 0x30201a, 0xffb070, 0x4a1400], rock: 'foundry', top: 'plate', topTint: 0xb8b0a8,
    accent: 0xff7a2a, spire: 0xff8a40, dust: 0x5a4a40, dustLight: 1.0, env: [0xff7a2a, 0x3a2418, 0x080504], amb: 'sparks', cloud: [0x7a4024, 0x1a120e], stars: 0, rune: 0xff6a1a },
  // 4 AURORA GLACIER: ice ledges under a starry night, green and violet aurora, snow drifting
  { key: 'glacier', sky: [0x030820, 0x0e2a54, 0x3a7090], sun: 0xd8ecff, sunDir: [-0.4, 0.42, -0.8], sunDisc: 1, keyI: 2.7, hemi: [0x8ab0e8, 0x30404c, 0.82], fill: 0x60ffb0, fillI: 0.5,
    fog: 0x1c3450, fogD: 0.0088, exposure: 1.1, bloom: 0.8, grade: [0.95, 1.0, 1.07], sea: [0x061424, 0x284a66, 0xe8f4ff, 0x000000], rock: 'glacier', top: 'rock', topTint: 0xe8f2ff,
    accent: 0x8ae8ff, spire: 0xa8ffe0, dust: 0xc0d0e0, dustLight: 1.3, env: [0xc0e8ff, 0x2a4a6a, 0x04080c], amb: 'snow', cloud: [0x4a6a8a, 0x0a1a2a], aurora: 1, stars: 1, rune: 0x8ae8ff },
  // 5 ECLIPSE CITADEL: a black sun with a burning corona over an obsidian citadel, violet haze
  { key: 'eclipse', sky: [0x050308, 0x1c1028, 0x4a2a40], sun: 0xffc070, sunDir: [0.2, 0.3, -0.93], sunDisc: 2, keyI: 3.5, hemi: [0xa090d8, 0x463448, 1.75], fill: 0xc890ff, fillI: 1.4,
    fog: 0x24182e, fogD: 0.0092, exposure: 1.38, bloom: 0.95, grade: [1.0, 0.97, 1.05], sea: [0x0a0814, 0x2a2042, 0xd8c4ff, 0x140828], rock: 'eclipse', top: 'panel', topTint: 0xd8d0e0,
    accent: 0xc080ff, spire: 0xffc070, dust: 0x40384a, dustLight: 0.8, env: [0xffc070, 0x2a1a40, 0x020104], amb: 'ash', cloud: [0x4a2a58, 0x0a0610], stars: 1, rune: 0xc080ff },
];

// ------------------------------------------------------------------ shaders
const SKY_VERT = /* glsl */ `varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uTop, uMid, uLow, uSun, uSunDir, uCloudA, uCloudB; uniform float uFlash, uTime, uDisc, uAurora, uStars;
varying vec3 vD;
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
float fb(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * n2(p); p *= 2.07; a *= 0.5; } return s; }
void main(){
  vec3 d = normalize(vD);
  float h = d.y;
  vec3 c = mix(uLow, uMid, smoothstep(-0.04, 0.2, h));
  c = mix(c, uTop, smoothstep(0.2, 0.7, h));
  vec3 sdir = normalize(uSunDir);
  float sd = max(0.0, dot(d, sdir));
  // the sky brightens toward the sun all the way down to the horizon
  c += uSun * pow(sd, 4.0) * 0.18 * (1.0 - smoothstep(0.1, 0.8, h));
  if (uStars > 0.5) {
    vec2 sc = vec2(atan(d.x, d.z), asin(clamp(h, -1.0, 1.0))) * 160.0;
    vec2 ci = floor(sc);
    float st = step(0.9965, h2(ci)) * smoothstep(0.06, 0.35, h);
    float tw = 0.55 + 0.45 * sin(uTime * 1.7 + h2(ci + 7.0) * 40.0);
    float fall = 1.0 - smoothstep(0.08, 0.5, length(fract(sc) - 0.5));
    c += vec3(0.85, 0.9, 1.0) * st * tw * fall * 1.6;
  }
  if (uDisc > 1.5) {
    // the black sun: a dark disc, a burning ring and long shimmering corona rays
    float r = acos(clamp(dot(d, sdir), -1.0, 1.0));
    vec3 up = abs(sdir.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 ax = normalize(cross(sdir, up)), ay = cross(ax, sdir);
    float ang = atan(dot(d, ay), dot(d, ax));
    float rays = 0.55 + 0.45 * n2(vec2(ang * 9.0, uTime * 0.15)) + 0.35 * n2(vec2(ang * 23.0, -uTime * 0.2));
    c += uSun * (exp(-pow((r - 0.07) * 70.0, 2.0)) * 7.0 + exp(-(r - 0.07) * 7.0) * 0.9 * rays * step(0.07, r) + exp(-r * 2.2) * 0.12);
    c = mix(c, vec3(0.004, 0.002, 0.006), smoothstep(0.069, 0.064, r));
  } else if (uDisc > 0.5) {
    c += uSun * (smoothstep(0.9993, 0.9997, sd) * 14.0 + pow(sd, 260.0) * 2.5 + pow(sd, 24.0) * 0.45 + pow(sd, 5.0) * 0.12);
  } else {
    // no sun disc: a glow on the horizon from the fires below
    c += uSun * pow(sd, 6.0) * 0.1 + uLow * exp(-max(h, 0.0) * 9.0) * 0.45;
  }
  // a hazy band along the horizon
  c = mix(c, uLow * 1.08 + uSun * pow(sd, 3.0) * 0.1, exp(-abs(h) * 16.0) * 0.45);
  // two drifting cloud layers, edges lit by the sun
  vec2 cp = d.xz / max(0.1, h + 0.22) * 1.3;
  float n1 = fb(cp + vec2(uTime * 0.010, uTime * 0.004));
  float n2v = fb(cp * 2.2 - vec2(uTime * 0.016, 0.0) + 13.0);
  float band = smoothstep(-0.06, 0.18, h) * (1.0 - smoothstep(0.42, 0.85, h));
  float cl = smoothstep(0.46, 0.8, n1) * band;
  float cl2 = smoothstep(0.55, 0.85, n2v) * band * 0.6;
  vec3 cc = mix(uCloudB, uCloudA, smoothstep(0.0, 0.45, h) * 0.6 + pow(sd, 2.0) * 0.6);
  float lit = pow(sd, 6.0) * (1.0 - smoothstep(0.62, 0.82, n1));
  c = mix(c, cc + uSun * lit * 0.6, cl * 0.82);
  c = mix(c, cc * 0.9 + uSun * pow(sd, 8.0) * 0.4, cl2 * 0.5);
  if (uAurora > 0.5) {
    float az = atan(d.x, d.z);
    float a = sin(az * 3.0 + uTime * 0.07 + fb(d.xz * 3.0 + uTime * 0.02) * 4.0);
    float curtain = smoothstep(0.2, 0.36, h) * (1.0 - smoothstep(0.42, 0.78, h)) * (0.5 + 0.5 * a);
    float rays = 0.6 + 0.4 * sin(az * 90.0 + fb(vec2(az * 8.0, uTime * 0.1)) * 6.0);
    c += (vec3(0.15, 1.0, 0.55) * 0.6 + vec3(0.55, 0.2, 0.95) * 0.25 * smoothstep(0.35, 0.6, h)) * curtain * rays * (1.0 - cl * 0.7);
  }
  c += vec3(0.6, 0.65, 1.0) * uFlash * smoothstep(-0.1, 0.5, h);
  gl_FragColor = vec4(c, 1.0);
}`;
const SEA_VERT = /* glsl */ `
uniform float uTime, uWaves; varying vec3 vW; varying float vH;
float wave(vec2 p, vec2 d, float f, float s){ return sin(dot(p, d) * f + uTime * s); }
void main(){
  vec3 p = position;
  vec4 w = modelMatrix * vec4(p, 1.0);
  float h = (wave(w.xz, vec2(0.8, 0.6), 0.22, 1.1) * 0.45 + wave(w.xz, vec2(-0.5, 0.86), 0.35, 1.7) * 0.25 + wave(w.xz, vec2(0.2, -0.98), 0.6, 2.3) * 0.12) * uWaves;
  w.y += h; vH = h; vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const SEA_FRAG = /* glsl */ `
uniform vec3 uDeep, uShallow, uFoam, uGlow, uSkyLow, uSkyMid, uSun, uSunDir, uFogC; uniform float uTime, uFogD, uFlash;
varying vec3 vW; varying float vH;
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
float rip(vec2 p, float det){ return n2(p * 0.18 + uTime * 0.05) * 1.6 + det * (n2(p * 0.6 + uTime * 0.25) + 0.5 * n2(p * 1.7 - uTime * 0.4)); }
void main(){
  vec3 toC = cameraPosition - vW;
  float dist = length(toC);
  vec3 V = toC / dist;
  vec2 p = vW.xz;
  float det = 1.0 - smoothstep(35.0, 150.0, dist);
  float e = 0.35;
  float a0 = rip(p, det), ax = rip(p + vec2(e, 0.0), det), az = rip(p + vec2(0.0, e), det);
  vec3 N = normalize(vec3((a0 - ax) * 1.3, 1.0, (a0 - az) * 1.3));
  float fres = clamp(0.03 + 0.97 * pow(1.0 - max(0.0, dot(N, V)), 5.0), 0.0, 0.92);
  vec3 col = mix(uDeep, uShallow, clamp(vH * 0.6 + 0.4, 0.0, 1.0) * 0.6);
  vec3 R = reflect(-V, N);
  vec3 sky = mix(uSkyLow, uSkyMid, smoothstep(0.0, 0.45, R.y));
  col = mix(col, sky, fres);
  float sd = max(0.0, dot(R, normalize(uSunDir)));
  col += uSun * (pow(sd, mix(80.0, 500.0, det)) * mix(1.4, 3.2, det) + pow(sd, 12.0) * 0.12);
  float foam = smoothstep(0.78, 0.98, vH * 0.9 + n2(p * 3.1 + uTime * 0.6) * 0.25 * det) * det;
  col = mix(col, uFoam * 0.6, foam * 0.35);
  float gl = n2(p * 0.35 - uTime * 0.12) * n2(p * 0.9 + uTime * 0.2);
  col += uGlow * (0.12 + 0.8 * smoothstep(0.25, 0.6, gl)) * (0.6 + foam) * 0.6;
  col += vec3(0.6, 0.65, 1.0) * uFlash * 0.3;
  float f = 1.0 - exp(-pow(dist * uFogD, 2.0));
  col = mix(col, uFogC, clamp(f, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;
// glowing additive ribbons (telegraphs, lightning, beams): uK = brightness, dashed when uDash > 0
const RIB_VERT = /* glsl */ `attribute float aU; varying float vU; varying vec2 vUv; void main(){ vU = aU; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const RIB_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uDash, uTime;
varying float vU; varying vec2 vUv;
void main(){
  float edge = clamp(1.0 - abs(vUv.y * 2.0 - 1.0), 0.0, 1.0);   // clamped: pow() of a hair below zero is NaN and NaN blooms into a white blot
  float a = edge * sqrt(edge) * (0.6 + 0.4 * edge);
  if (uDash > 0.0) a *= step(0.45, fract(vU * uDash - uTime * 3.0));
  gl_FragColor = vec4(uColor * a * uK, 1.0);
}`;
const COL_VERT = /* glsl */ `varying vec2 vUv; varying vec3 vN, vV, vW;
void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = -mv.xyz; vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * mv; }`;
// a column of light (rider forming): brightest through its middle, rippling upward, no seam
const COL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uTime;
varying vec2 vUv; varying vec3 vN, vV, vW;
void main(){
  float f = abs(dot(normalize(vN), normalize(vV)));
  float s = 0.6 + 0.4 * sin(vUv.y * 22.0 - uTime * 9.0 + sin(vUv.x * 18.849) * 1.5);
  float top = 1.0 - smoothstep(0.65, 1.0, vUv.y);
  gl_FragColor = vec4(uColor * pow(f, 1.8) * s * top * uK * 0.55, 1.0);
}`;
// a sea spout: a translucent churning water column with foam streaks racing upward
const SPOUT_FRAG = /* glsl */ `
uniform vec3 uColor, uDeep; uniform float uK, uTime, uFire;
varying vec2 vUv; varying vec3 vN, vV, vW;
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
void main(){
  float f = abs(dot(normalize(vN), normalize(vV)));
  float st = n2(vec2((vW.x - vW.z) * 1.4, vW.y * 0.45 - uTime * 5.0)) * 0.65 + n2(vec2((vW.x + vW.z) * 3.1, vW.y * 1.2 - uTime * 7.0)) * 0.35;
  float top = 1.0 - smoothstep(0.7, 1.0, vUv.y);
  vec3 col = mix(uDeep, uColor, clamp(0.35 + st * 0.7 + (1.0 - f) * 0.35, 0.0, 1.0));
  float a = clamp((0.02 + (1.0 - f) * 0.26 + smoothstep(0.52, 0.85, st) * 0.32) * top * uK, 0.0, 0.7);
  if (uFire > 0.5) {
    // a molten jet (Sky Foundry): hottest through its middle, licking flames racing up, edges fade away at grazing angles
    float fl = n2(vec2((vW.x - vW.z) * 2.2, vW.y * 0.8 - uTime * 6.5)) * 0.6 + n2(vec2((vW.x + vW.z) * 4.3, vW.y * 2.1 - uTime * 10.0)) * 0.4;
    float core = pow(f, 1.6);
    float heat = clamp(core * 0.85 + fl * 0.45 - vUv.y * 0.4, 0.0, 1.0);
    vec3 fc = mix(vec3(0.55, 0.07, 0.0), vec3(1.0, 0.42, 0.06), smoothstep(0.15, 0.6, heat));
    fc = mix(fc, vec3(1.0, 0.86, 0.55), smoothstep(0.7, 1.0, heat));
    float fa = clamp(core * smoothstep(0.2, 0.7, fl + core * 0.45) * (1.0 - smoothstep(0.55, 1.0, vUv.y)) * uK, 0.0, 1.0);
    gl_FragColor = vec4(fc * 1.35, fa);
  } else gl_FragColor = vec4(col, a);
}`;

// a camera-facing strip along a path in sim coordinates
class Ribbon {
  constructor(scene, n = 32, color = 0xff4a3a) {
    this.n = n;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 2 * 3);
    const uv = new Float32Array(n * 2 * 2), au = new Float32Array(n * 2), idx = [];
    for (let i = 0; i < n; i++) { uv.set([i / (n - 1), 0, i / (n - 1), 1], i * 4); au[i * 2] = au[i * 2 + 1] = i / (n - 1); if (i < n - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); }
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    this.au = new THREE.BufferAttribute(au, 1);
    g.setAttribute('aU', this.au);
    g.setIndex(idx);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
    this.mat = new THREE.ShaderMaterial({ vertexShader: RIB_VERT, fragmentShader: RIB_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(color) }, uK: { value: 1 }, uDash: { value: 0 }, uTime: { value: 0 } } });
    this.mesh = new THREE.Mesh(g, this.mat);
    this.mesh.frustumCulled = false; this.mesh.visible = false; this.mesh.renderOrder = 4;
    scene.add(this.mesh);
    this.t = 0; this.max = 0; this.k = 1; this.used = false;
  }
  // pts: [[x, y], ...] in sim coords (any count, resampled to n), w = width in metres, dr = radial offset
  set(pts, w, dr = 0.6) {
    const n = this.n, P = this.pos;
    for (let i = 0; i < n; i++) {
      const f = (i / (n - 1)) * (pts.length - 1), a = Math.floor(f), b = Math.min(pts.length - 1, a + 1), t = f - a;
      const x = pts[a][0] + (pts[b][0] - pts[a][0]) * t, y = pts[a][1] + (pts[b][1] - pts[a][1]) * t;
      // direction along the path, in sim space
      const j0 = Math.max(0, a), j1 = Math.min(pts.length - 1, j0 + 1);
      let dx = pts[j1][0] - pts[j0][0], dy = pts[j1][1] - pts[j0][1];
      const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      // the side vector is perpendicular to the path within the playfield
      const sx = -dy * w * 0.5, sy = dx * w * 0.5;
      toWorld(x + sx, y + sy, _v, dr); P[i * 6] = _v.x; P[i * 6 + 1] = _v.y; P[i * 6 + 2] = _v.z;
      toWorld(x - sx, y - sy, _v, dr); P[i * 6 + 3] = _v.x; P[i * 6 + 4] = _v.y; P[i * 6 + 5] = _v.z;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.visible = true;
  }
  hide() { this.mesh.visible = false; this.used = false; }
}
// a jagged lightning path between two sim points
function boltPath(x0, y0, x1, y1, n = 18, jit = 0.9) {
  const pts = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1), j = i === 0 || i === n - 1 ? 0 : (Math.random() - 0.5) * jit * 2 * Math.sin(t * Math.PI); pts.push([x0 + (x1 - x0) * t + j, y0 + (y1 - y0) * t + j * 0.4]); }
  return pts;
}

// ------------------------------------------------------------------ the renderer
export class Renderer {
  constructor(canvas, q) {
    this.q = q;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(q.dpr);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    this.r = r;
    this.scale = 1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.3, 1200);
    this.post = new Post(r, q);
    this.T = TX.sprites();
    this.pm = new THREE.PMREMGenerator(r);
    this.envs = [];
    MD.materials(null, TX.grimeTex(), TX.stripeTex(), TX.panelNormal(q.tex >= 1024 ? 512 : 256), q.name === 'high');
    this.suit = [{ armor: 0xc4ccd8, cloth: 0x1f4fb8, accent: 0x7fe0ff, hide: 0x5e6c7a }, { armor: 0xd8c8a8, cloth: 0xa82424, accent: 0xffc860, hide: 0x6e5e52 }];
    this.time = 0; this.trauma = 0;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.shocks = [];
    this.lookI = -1; this.look = LOOKS[0];
    this.camTh = 0; this.camY = 12; this.camD = 34; this.camPos = new THREE.Vector3(0, 14, 50); this.camLook = new THREE.Vector3(0, 12, 0); this.camFov = 40;
    this.shot = null;
    this.lights();
    this.buildSky();
    this.buildSea();
    this.fx = new FX(this.scene, this.T, { dust: q.dust, sparks: q.sparks, debris: q.debris, flashLights: q.flashLights }, (x, z) => this.heightAt(x, z));
    this.views = { r: new Map(), p: new Map(), c: new Map(), pk: new Map() };
    this.ghosts = [];
    this.ledgeSets = []; this.rockSets = []; this.ledges = null; this.W = null;
    this.ribbons = []; for (let i = 0; i < 28; i++) this.ribbons.push(new Ribbon(this.scene));
    this.flashes = [];   // lightning ribbons fading out
    this.makeColumns();
    this.makeShots();
    this.makeSpire();
    this.hunterV = null; this.bossV = null; this.bossKey = null;
    this.resize();
    addEventListener('resize', () => this.resize());
    this.envDefer = true; this.setLook(0);   // its lighting map comes in the warm-up (envForAsync)
  }

  // ---------------------------------------------------------------- lights, sky, sea, environment
  lights() {
    const k = new THREE.DirectionalLight(0xffffff, 3);
    k.castShadow = true;
    k.shadow.mapSize.set(this.q.shadow, this.q.shadow);
    const c = k.shadow.camera;
    c.left = -26; c.right = 26; c.top = 22; c.bottom = -18; c.near = 1; c.far = 140;
    k.shadow.bias = -0.0004; k.shadow.normalBias = 0.04;
    this.scene.add(k, k.target);
    this.key = k;
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.4);
    this.scene.add(this.hemi, this.fill);
    // FIXED light pools: the light count never changes after boot (that would recompile every material)
    this.lightPool = [];
    for (let i = 0; i < 6; i++) { const l = new THREE.PointLight(0xffffff, 0, 26, 1.8); l.position.set(0, -50, 0); this.scene.add(l); this.lightPool.push(l); }
    this.lanceLights = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.PointLight(0x9fe8ff, 0, 8, 2); l.position.set(0, -50, 0); this.scene.add(l); this.lanceLights.push(l); }
  }
  buildSky() {
    this.skyMat = new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uLow: { value: new THREE.Color() }, uSun: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3() },
        uCloudA: { value: new THREE.Color() }, uCloudB: { value: new THREE.Color() }, uFlash: { value: 0 }, uTime: { value: 0 }, uDisc: { value: 1 }, uAurora: { value: 0 }, uStars: { value: 0 } } });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), this.skyMat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -10;
    this.scene.add(this.sky);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
  }
  buildSea() {
    this.seaMat = new THREE.ShaderMaterial({ vertexShader: SEA_VERT, fragmentShader: SEA_FRAG,
      uniforms: { uTime: { value: 0 }, uWaves: { value: 1 }, uDeep: { value: new THREE.Color() }, uShallow: { value: new THREE.Color() }, uFoam: { value: new THREE.Color() }, uGlow: { value: new THREE.Color() },
        uSkyLow: { value: new THREE.Color() }, uSkyMid: { value: new THREE.Color() }, uSun: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3() }, uFogC: { value: new THREE.Color() }, uFogD: { value: 0.01 }, uFlash: { value: 0 } } });
    const g = new THREE.CircleGeometry(520, 160, 0, Math.PI * 2);
    g.rotateX(-Math.PI / 2);
    // more vertices near the ring for the swell
    const sea = new THREE.Mesh(g, this.seaMat);
    sea.position.y = -0.15; sea.frustumCulled = false;
    this.sea = sea;
    this.scene.add(sea);
    const near = new THREE.Mesh(new THREE.RingGeometry(2, 70, 96, 24), this.seaMat);
    near.rotation.x = -Math.PI / 2; near.position.y = -0.1; near.frustumCulled = false;
    this.scene.add(near);
  }
  envFor(i, s = this.envScene(i)) {
    if (this.envs[i]) return this.envs[i];
    this.envs[i] = this.pm.fromScene(s, 0.03).texture;
    return this.envs[i];
  }
  // the first look's map in the warm-up: its little scene's programs compile in the background first
  async envForAsync(i) {
    if (this.envs[i]) return this.envs[i];
    const s = this.envScene(i);
    try { await this.r.compileAsync(s, this.camera); } catch { /* compiled in fromScene instead */ }
    return this.envFor(i, s);
  }
  envScene(i) {
    const L = LOOKS[i], s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { a: { value: new THREE.Color(L.env[0]) }, b: { value: new THREE.Color(L.env[1]) }, c: { value: new THREE.Color(L.env[2]) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 a,b,c; varying vec3 vP; void main(){ vec3 d = normalize(vP); vec3 col = mix(c, b, smoothstep(-0.2, 0.3, d.y)); col += a * pow(max(0.0, d.y), 6.0) * 2.5; gl_FragColor = vec4(col, 1.0); }' })));
    for (let k = 0; k < 5; k++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), new THREE.MeshBasicMaterial({ color: hdr(L.env[0], 4), side: THREE.DoubleSide }));
      const a = (k / 5) * Math.PI * 2; m.position.set(Math.cos(a) * 8, 4 + (k % 2) * 2, Math.sin(a) * 8); m.lookAt(0, 0, 0); s.add(m);
    }
    return s;
  }
  // 1.9: the other sectors' ledges, scenery and lighting maps are prepared after the title is up (in idle time; a
  // test page waits for all of it before its title). Each set is compiled in the background (shown for the compile
  // call only: compile walks visible things), then hidden until its sector comes
  async compileHidden(g) {
    const vis = g.visible; g.visible = true;
    const p = this.r.compileAsync(g, this.camera, this.scene);
    g.visible = vis;
    try { await p; } catch { /* compiled when first drawn */ }
  }
  async prepLook(i) {
    if (!this.ledgeSets[i]) { const S = this.buildLedgeSet(i); S.visible = this.lookI === i; this.ledgeSets[i] = S; await this.compileHidden(S); }
    if (!this.scenery) this.scenery = [];
    if (!this.scenery[i]) { const S = this.buildScenery(i); S.visible = this.lookI === i; this.scenery[i] = S; await this.compileHidden(S); }
    if (!this.envs[i]) this.envFor(i);
  }
  get prepared() { return LOOKS.every((L, k) => this.envs[k] && this.ledgeSets[k] && this.scenery && this.scenery[k]); }
  async prepareAll(idle = true) {
    const wait = () => new Promise((r) => (idle && window.requestIdleCallback ? requestIdleCallback(r, { timeout: 2500 }) : setTimeout(r, idle ? 300 : 0)));
    if (idle) await new Promise((r) => setTimeout(r, 600));
    for (let i = 0; i < LOOKS.length; i++) { if (this.ledgeSets[i] && this.scenery && this.scenery[i] && this.envs[i]) continue; await wait(); await this.prepLook(i); }
  }
  heightAt(x, z) {
    const r = Math.hypot(x, z);
    if (Math.abs(r - RR) > 2.4 || !this.W) return -1;
    let sx = Math.atan2(x, z) * RR; if (sx < 0) sx += F.C;
    let best = -1;
    for (const L of this.W.ledges) { if (L.st === 2) continue; let d = Math.abs(((sx - L.x) % F.C + F.C * 1.5) % F.C - F.C / 2); if (d < L.w && L.y > best) best = L.y; }
    return best;
  }

  // ---------------------------------------------------------------- sector set: ledges, spire colours, scenery
  setLook(i) {
    i = ((i % 5) + 5) % 5;
    if (i === this.lookI) return;
    this.lookI = i;
    const L = this.look = LOOKS[i];
    this.scene.environment = this.envDefer ? this.envs[i] || this.envAny || null : this.envFor(i);
    const u = this.skyMat.uniforms;
    u.uTop.value.set(L.sky[0]); u.uMid.value.set(L.sky[1]); u.uLow.value.set(L.sky[2]); u.uSun.value.set(L.sun); u.uSunDir.value.set(...L.sunDir).normalize();
    u.uCloudA.value.set(L.cloud[0]); u.uCloudB.value.set(L.cloud[1]); u.uDisc.value = L.sunDisc; u.uAurora.value = L.aurora ? 1 : 0; u.uStars.value = L.stars ? 1 : 0;
    const s = this.seaMat.uniforms;
    s.uDeep.value.set(L.sea[0]); s.uShallow.value.set(L.sea[1]); s.uFoam.value.set(L.sea[2]); s.uGlow.value.set(L.sea[3]).multiplyScalar(0.6); s.uSkyLow.value.set(L.sky[2]).lerp(_c.set(L.fog), 0.35); s.uSkyMid.value.set(L.sky[1]).lerp(_c.set(L.sky[0]), 0.3);
    s.uSun.value.set(L.sun); s.uSunDir.value.set(...L.sunDir).normalize(); s.uFogC.value.set(L.fog); s.uFogD.value = L.fogD * 0.8;
    this.scene.fog.color.set(L.fog); this.scene.fog.density = L.fogD;
    this.key.color.set(L.sun); this.key.intensity = L.keyI;
    this.hemi.color.set(L.hemi[0]); this.hemi.groundColor.set(L.hemi[1]); this.hemi.intensity = L.hemi[2];
    this.fill.color.set(L.fill); this.fill.intensity = L.fillI; this.fill.position.set(-L.sunDir[0], 0.6, -L.sunDir[2]);
    this.fx.setLook(L);
    this.crownMat.color.copy(hdr(L.spire, 3.2));
    this.spireRune.color.copy(hdr(L.rune, 2.2));
    for (const S of this.ledgeSets) if (S) S.visible = false;
    if (!this.ledgeSets[i]) this.ledgeSets[i] = this.buildLedgeSet(i);
    this.ledgeSets[i].visible = true;
    this.ledges = this.ledgeSets[i];
    this.ledgeRams = !!(this.ledgeRamsBy && this.ledgeRamsBy[i]);
    const rk = this.rockSets[i], sm = this.spireMat;
    if (sm.map !== rk.map) { const first = !sm.map; sm.map = rk.map; sm.normalMap = rk.normalMap; sm.roughnessMap = rk.roughnessMap; if (first) sm.needsUpdate = true; }
    sm.color.set(L.key === 'glacier' ? 0xc8d8e8 : L.key === 'ruins' ? 0xc0a898 : 0xa8a0a0);

    for (const S of this.scenery || []) if (S) S.visible = false;
    if (!this.scenery) this.scenery = [];
    if (!this.scenery[i]) this.scenery[i] = this.buildScenery(i);
    this.scenery[i].visible = true;
    this.amb = L.amb;
  }
  buildLedgeSet(i) {
    const L = LOOKS[i], grp = new THREE.Group();
    const rock = TX.rockSet(L.rock, this.q.tex >= 1024 ? 512 : 256);
    this.rockSets[i] = rock;
    const rockMat = new THREE.MeshStandardMaterial({ map: rock.map, normalMap: rock.normalMap, roughnessMap: rock.roughnessMap, roughness: 1, metalness: 0.05, color: 0xffffff, envMapIntensity: 0.6 });
    const topSet = L.top === 'rock' ? rock : TX.floorSet(L.top, this.q.tex >= 1024 ? 1024 : 512);
    const topMat = new THREE.MeshStandardMaterial({ map: topSet.map, normalMap: topSet.normalMap, roughnessMap: topSet.roughnessMap, roughness: 1, metalness: L.top === 'plate' ? 0.6 : 0.08, color: L.topTint, envMapIntensity: 0.8 });
    const trimMat = MD.paint(L.key === 'foundry' ? 0x6a5a4a : L.key === 'eclipse' ? 0xd8a84a : 0x9a8a78, 0.5, L.key === 'ruins' ? 0.1 : 0.7);
    const runeMat = MD.glow(L.accent, 2.4);
    LAYOUT[i].forEach(([f, y, w], k) => {
      const lg = new THREE.Group();
      const geo = ledgeGeometry(f * F.C, y, w, i * 31 + k * 7);
      for (const [g, mat] of splitTwo(geo)) { const m = new THREE.Mesh(g, mat ? topMat : rockMat); m.castShadow = true; m.receiveShadow = true; lg.add(m); }
      // a carved lip along the outer edge with a few runes, and sector dressing
      const rnd = mkr(i * 97 + k * 13);
      const lip = new THREE.Mesh(arcBox(f * F.C, y + 0.09, w * 0.96, 0.18, 0.22, 2.15), trimMat); lip.castShadow = true; lip.receiveShadow = true; lg.add(lip);
      const nR = Math.max(1, Math.round(w / 2));
      for (let j = 0; j < nR; j++) { const x = f * F.C + (j - (nR - 1) / 2) * 1.8; const rm = new THREE.Mesh(MD.GEO.box(0.5, 0.06, 0.06), runeMat); toWorld(x, y + 0.2, rm.position, 2.27); rm.lookAt(toWorld(x, y + 0.2, _v, 10)); lg.add(rm); }
      this.dress(lg, L.key, f * F.C, y, w, rnd);
      mergeByMaterial(lg);
      lg.userData = { id: k, y0: 0 };
      grp.add(lg);
    });
    // ledges that can never crumble never move: merge all of them into one mesh per material (draw calls). Where the
    // boss flies it smashes any ledge in its way, so there those ledges are also kept one by one (sharing the merged
    // geometry's sources), shown only during the boss fight in place of the merged set
    const stat = new THREE.Group(), rams = ['gale', 'wyvern', 'sovereign'].includes(SECTORS[i] && SECTORS[i].boss);
    for (const lg of [...grp.children]) {
      if (LAYOUT[i][lg.userData.id][3].includes('c')) continue;
      if (rams) { for (const m of lg.children) stat.add(m.clone()); lg.userData.bossOnly = true; lg.visible = false; }
      else { for (const m of [...lg.children]) stat.add(m); grp.remove(lg); }
    }
    mergeByMaterial(stat);
    stat.userData = { static: true };
    this.ledgeRamsBy = this.ledgeRamsBy || {}; this.ledgeRamsBy[i] = rams;
    grp.add(stat);
    this.scene.add(grp);
    return grp;
  }
  // per-sector props on and under a ledge
  dress(g, key, x0, y, w, rnd) {
    const P = this.q.props;
    const put = (geo, mat, x, yy, dr, rx = 0, ry = 0, rz = 0, s = 1) => { const m = new THREE.Mesh(geo, mat); toWorld(x, yy, m.position, dr); m.rotation.set(rx, ry + x / RR, rz); m.scale.setScalar(s); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    const stone = MD.paint(0xb8a890, 0.85, 0.02), iron = MD.paint(0x3a3430, 0.5, 0.85), ice = MD.paint(0xd8eef8, 0.12, 0.05), obs = MD.paint(0x0e0c12, 0.2, 0.6), gold = MD.paint(0xd8a84a, 0.28, 1);
    const n = Math.max(1, Math.round(w * 0.5 * P));
    for (let i = 0; i < n; i++) {
      const x = x0 + (rnd() - 0.5) * w * 1.7, dr = -1.6 + rnd() * 0.6;
      if (key === 'ruins') {
        // broken columns at the back edge
        const h = 1.2 + rnd() * 2.6;
        put(MD.GEO.cyl(0.34, 0.38, h, 14), stone, x, y + h / 2, dr);
        put(MD.GEO.box(1.0, 0.25, 1.0), stone, x, y + 0.12, dr);
        if (rnd() < 0.5) put(MD.GEO.box(0.9, 0.3, 0.9), stone, x, y + h + 0.15, dr, 0, 0, rnd() * 0.4);
      } else if (key === 'caverns') {
        for (let k = 0; k < 3; k++) put(MD.GEO.cyl(0.0, 0.16 + rnd() * 0.12, 0.8 + rnd() * 1.4, 6), MD.glow(0x40ffd0, 2 + Math.round(rnd() * 4) * 0.5), x + (rnd() - 0.5), y + 0.5, dr + rnd() * 0.5, (rnd() - 0.5) * 0.6, 0, (rnd() - 0.5) * 0.6);
      } else if (key === 'foundry') {
        put(MD.GEO.box(0.5, 2.4, 0.5), iron, x, y + 1.2, dr);
        put(MD.GEO.cyl(0.45, 0.3, 0.4, 12), iron, x, y + 2.5, dr);
        put(MD.GEO.cyl(0.36, 0.36, 0.06, 12), MD.glow(0xff7a2a, 4), x, y + 2.72, dr);
      } else if (key === 'glacier') {
        put(MD.GEO.cyl(0.0, 0.3 + rnd() * 0.3, 1.5 + rnd() * 2.2, 7), ice, x, y + 0.9, dr, 0, 0, (rnd() - 0.5) * 0.3);
      } else {
        put(MD.GEO.cyl(0.0, 0.35, 2.5 + rnd() * 2.5, 5), obs, x, y + 1.6, dr, 0, 0, (rnd() - 0.5) * 0.25);
        put(MD.GEO.tor(0.4, 0.04, 16, 6), gold, x, y + 1.2, dr - 0.1, 0, Math.PI / 2, 0);
      }
    }
    // things hanging under the ledge: from the back half of the rock (the riders fly through the middle) and short
    for (let i = 0; i < Math.round(2 * P); i++) {
      const x = x0 + (rnd() - 0.5) * w * 1.2, dr = -1.25 - rnd() * 0.6, v = dr / 2.3;
      const under = y - F.ledgeT - rockDrop(w, x - x0) * Math.pow(1 - v * v, 0.9) * 0.93 + 0.15;
      if (key === 'caverns') { const l = 0.6 + rnd() * 0.5; put(MD.GEO.cyl(0.16, 0.0, l, 6), MD.glow(0x60e8ff, 2.5), x, under - l / 2, dr); }
      else if (key === 'glacier') { const l = 0.7 + rnd() * 0.6; put(MD.GEO.cyl(0.2, 0.0, l, 6), ice, x, under - l / 2, dr); }
      else if (key === 'foundry') { for (let k = 0; k < 4; k++) put(MD.GEO.tor(0.14, 0.04, 8, 6), iron, x, under - 0.1 - k * 0.24, dr, 0, k % 2 ? 0 : Math.PI / 2, 0); }
    }
  }
  buildScenery(i) {
    const L = LOOKS[i], g = new THREE.Group(), rnd = mkr(500 + i * 17);
    const rock = TX.rockSet(L.rock, 256);
    const mat = new THREE.MeshStandardMaterial({ map: rock.map, normalMap: rock.normalMap, roughness: 0.95, metalness: 0.05, color: L.topTint });
    // distant floating islands round the ring, in an instanced mesh
    const N = Math.round(40 * this.q.props);
    const I = new THREE.InstancedMesh(islandGeometry(i * 7 + 3), mat, N);
    for (let k = 0; k < N; k++) {
      const a = rnd() * Math.PI * 2, r = 60 + rnd() * 140, s = 3 + rnd() * 12;
      _v.set(Math.sin(a) * r, 6 + rnd() * 50, Math.cos(a) * r);
      _e.set(rnd() * 0.3, rnd() * 6, rnd() * 0.3); _q.setFromEuler(_e); _s.set(s, s * (0.5 + rnd() * 0.6), s);
      I.setMatrixAt(k, _m.compose(_v, _q, _s));
    }
    I.receiveShadow = true;
    g.add(I);
    // sea stacks rising from the water
    const M = Math.round(24 * this.q.props);
    const J = new THREE.InstancedMesh(MD.GEO.cyl(0.6, 1, 1, 9), mat, M);
    for (let k = 0; k < M; k++) {
      const a = rnd() * Math.PI * 2, r = 36 + rnd() * 70, h = 6 + rnd() * 24, s = 2 + rnd() * 4;
      _v.set(Math.sin(a) * r, h / 2 - 1, Math.cos(a) * r); _e.set(0, rnd() * 6, (rnd() - 0.5) * 0.15); _q.setFromEuler(_e); _s.set(s, h, s);
      J.setMatrixAt(k, _m.compose(_v, _q, _s));
    }
    J.castShadow = false; J.receiveShadow = true;
    g.add(J);
    this.scene.add(g);
    return g;
  }
  makeSpire() {
    const g = new THREE.Group();
    const pts = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(new THREE.Vector2(3.5 * Math.pow(1 - t, 0.85) + 0.8 + Math.sin(t * 23) * 0.18 + (i % 5 === 0 ? 0.22 : 0), -4 + t * 50)); }
    const geo = new THREE.LatheGeometry(pts, 44);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x) + y * 0.05, r = Math.hypot(x, z) * (0.8 + vnoise(x * 0.5, y * 0.25, z * 0.5) * 0.36 + vnoise(x * 2.2, y * 1.4, z * 2.2) * 0.08);
      p.setXYZ(i, Math.cos(a) * r, y, Math.sin(a) * r);
      uv.setXY(i, uv.getX(i) * 6, uv.getY(i) * 12);
    }
    geo.computeVertexNormals();
    this.spireMat = new THREE.MeshStandardMaterial({ color: 0xa8a0a0, roughness: 1, metalness: 0.05, envMapIntensity: 0.5 });
    const sp = new THREE.Mesh(geo, this.spireMat); sp.castShadow = false; sp.receiveShadow = true;
    g.add(sp);
    // carved rune bands that glow in the sector's colour
    this.spireRune = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const iron = MD.paint(0x3a3430, 0.4, 0.9);
    for (const [y, k] of [[6, 0], [17, 1], [27, 0], [36, 1], [43, 0]]) {
      const t = (y + 4) / 50, r = 3.5 * Math.pow(1 - t, 0.85) + 0.8;
      const band = new THREE.Mesh(new THREE.TorusGeometry(r * 0.98, 0.07, 6, 48), this.spireRune); band.position.y = y; band.rotation.x = Math.PI / 2; g.add(band);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r * 1.01, 0.16, 8, 48), iron); rim.position.y = y + (k ? 0.35 : -0.35); rim.rotation.x = Math.PI / 2; g.add(rim);
    }
    // rune stones round the base
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; const m = new THREE.Mesh(MD.GEO.box(0.5, 1.6, 0.18), this.spireRune); m.position.set(Math.cos(a) * 4.05, 1.5 + (k % 2) * 0.6, Math.sin(a) * 4.05); m.rotation.y = -a; m.scale.set(0.6, 1, 0.4); g.add(m); }
    // the crown: a cage of iron prongs holding a storm crystal, a slow halo
    this.crownMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const crown = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 0), this.crownMat); crown.position.y = 49.6; crown.scale.set(1, 1.6, 1); g.add(crown);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2, pr = new THREE.Mesh(new THREE.ConeGeometry(0.22, 5.5, 6), iron);
      pr.position.set(Math.cos(a) * 1.9, 48.2, Math.sin(a) * 1.9); pr.rotation.set(Math.sin(a) * 0.32, 0, -Math.cos(a) * 0.32); g.add(pr);
    }
    for (let k = 0; k < 3; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6 + k * 0.9, 0.12, 8, 40), iron); ring.position.y = 46 + k * 1.3; ring.rotation.x = Math.PI / 2 + k * 0.2; g.add(ring); }
    mergeByMaterial(g);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.06, 6, 64), this.spireRune); halo.position.y = 49.6; halo.rotation.x = Math.PI / 2 - 0.25; g.add(halo); this.halo = halo;
    this.crown = crown;
    this.spire = g;
    this.scene.add(g);
  }
  makeColumns() {
    // spout columns (water) and rider-forming columns (light), both additive, both pooled
    const geo = new THREE.CylinderGeometry(1, 1, 1, 20, 1, true); geo.translate(0, 0.5, 0);
    this.cols = [];
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.ShaderMaterial({ vertexShader: COL_VERT, fragmentShader: COL_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color(0xbfe8ff) }, uK: { value: 1 }, uTime: { value: 0 } } });
      const m = new THREE.Mesh(geo, mat); m.visible = false; m.frustumCulled = false; m.renderOrder = 3;
      this.scene.add(m); this.cols.push(m);
    }
    this.spouts = [];
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.ShaderMaterial({ vertexShader: COL_VERT, fragmentShader: SPOUT_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color(0xd8ecff) }, uDeep: { value: new THREE.Color(0x203040) }, uK: { value: 1 }, uTime: { value: 0 }, uFire: { value: 0 } } });
      const m = new THREE.Mesh(geo, mat); m.visible = false; m.frustumCulled = false; m.renderOrder = 3;
      this.scene.add(m); this.spouts.push(m);
    }
    const ringGeo = new THREE.RingGeometry(0.7, 1, 40); ringGeo.rotateX(-Math.PI / 2);
    this.rings = [];
    for (let i = 0; i < 12; i++) { const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xff5a3a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); m.visible = false; m.renderOrder = 3; this.scene.add(m); this.rings.push(m); }
  }
  makeShots() {
    const mk = (geo, mat, n) => { const I = new THREE.InstancedMesh(geo, mat, n); I.count = 0; I.frustumCulled = false; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.scene.add(I); return I; };
    this.shotI = {
      shard: mk(new THREE.OctahedronGeometry(0.45, 0), new THREE.MeshBasicMaterial({ color: hdr(0x7ff0ff, 4), toneMapped: false }), 40),
      blob: mk(new THREE.IcosahedronGeometry(0.55, 1), new THREE.MeshBasicMaterial({ color: hdr(0xff7a2a, 5), toneMapped: false }), 40),
      ice: mk(new THREE.ConeGeometry(0.35, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, roughness: 0.1, metalness: 0.1, emissive: 0x2a6a8a }), 40),
      orb: mk(new THREE.SphereGeometry(0.6, 16, 12), new THREE.MeshBasicMaterial({ color: hdr(0xa060ff, 3.5), toneMapped: false }), 40),
    };
  }
  takeRibbon() { for (const r of this.ribbons) if (!r.used) { r.used = true; return r; } return null; }
  takeCol() { for (const c of this.cols) if (!c.visible) return c; return null; }
  takeSpout() { for (const c of this.spouts) if (!c.visible) return c; return null; }
  takeRing() { for (const c of this.rings) if (!c.visible) return c; return null; }

  // ---------------------------------------------------------------- views
  riderView(kind, elite, pid) {
    const o = pid ? { ...this.suit[pid - 1] } : { elite };
    const v = MD.lancer(pid ? 'player' : kind, o);
    const outer = new THREE.Group();
    outer.matrixAutoUpdate = false;
    outer.add(v.g);
    this.scene.add(outer);
    return { outer, v, turn: 1, face: 1, phi: 0, kind, pid, t: Math.random() * 10, bank: 0, lvx: 0, roll: 0.2, ph: Math.random(), lastBeat: 9, amp: 0.6,
      fold: 1, dive: 0, tuck: 0, reach: 0, land: 0, wasAir: false, jaw: 0, cape: -0.4, look: 0, lookY: 0 };
  }
  // place a jouster turned phi round the vertical from facing +x along the ring (0) to facing back (PI). It swings
  // round through facing the camera, so a turn shows the skyray's head and chest and not a flat card; past halfway
  // the model is mirrored so its lance side ends up toward the camera whichever way it flies (as before)
  placeTurn(outer, x, y, phi, dr = 0) {
    tangent(x, _v); radial(x, _v2);
    const c = Math.cos(phi), s = Math.sin(phi);
    _v4.copy(_v).multiplyScalar(c).addScaledVector(_v2, s);          // the nose
    _v5.copy(_v2).multiplyScalar(c).addScaledVector(_v, -s);         // its right side
    if (phi > Math.PI / 2) _v5.negate();
    _m.makeBasis(_v4, UP, _v5);
    toWorld(x, y, _v3, dr);
    _m.setPosition(_v3);
    outer.matrix.copy(_m);
    outer.matrixWorldNeedsUpdate = true;
  }
  // 1.10: the big fliers (bosses, the Stormhunter) turn round like the jousters: a damped spring swings them from
  // facing along the ring to facing back THROUGH facing the camera (head and chest toward you, wings spread across the
  // view) instead of squashing their width through zero like a paper card. yaw turns them a little toward the camera
  // at rest (as the old fixed -0.2 did). Returns 0..1, how far into the turn they are (for banking)
  turnSpring(V, face, dt, k, yaw) {
    const phT = face > 0 ? yaw : Math.PI - yaw, s = Math.min(dt, 1 / 30);
    if (V.phi === undefined) { V.phi = phT; V.phiV = 0; }
    V.phiV += ((phT - V.phi) * k - V.phiV * 2 * Math.sqrt(k)) * s;
    V.phi = clamp(V.phi + V.phiV * s, 0, Math.PI);
    V.face = V.phi > Math.PI / 2 ? -1 : 1;
    return clamp((Math.sin(V.phi) - Math.sin(yaw)) / (1 - Math.sin(yaw)), 0, 1);
  }
  // place a model at sim (x, y) facing face (+1 along the ring / -1 back); mirrored so its right side always faces the camera
  place(outer, x, y, sx, dr = 0) {
    tangent(x, _v); radial(x, _v2);
    _v.multiplyScalar(sx);
    _m.makeBasis(_v, UP, _v2);
    toWorld(x, y, _v3, dr);
    _m.setPosition(_v3);
    outer.matrix.copy(_m);
    outer.matrixWorldNeedsUpdate = true;
  }
  animRider(V, b, dt, t) {
    const v = V.v, air = b.on < 0, W = this.W, k5 = Math.min(1, dt * 5), k9 = Math.min(1, dt * 9);
    // a real turn: it swings round through facing the camera and banks into it
    V.face = b.face;
    // the turn swings round on a critically damped spring: it eases out and settles instead of starting and stopping dead
    const ds = Math.min(dt, 1 / 30), phT = b.face > 0 ? 0 : Math.PI;
    V.phiV = (V.phiV || 0) + ((phT - V.phi) * 230 - (V.phiV || 0) * 30) * ds;
    V.phiV = clamp(V.phiV, -TURN_RATE * 1.4, TURN_RATE * 1.4);
    V.phi = clamp(V.phi + V.phiV * ds, -0.05, Math.PI + 0.05);
    this.placeTurn(V.outer, b.x, b.y, clamp(V.phi, 0, Math.PI));
    const turning = Math.sin(clamp(V.phi, 0, Math.PI)), fwd = b.vx * b.face, spd = Math.hypot(b.vx, b.vy);
    // velocities are smoothed before they tilt the body: a wing beat changes the sim's speed in one step, and a raw
    // pitch or bank from it would snap
    if (V.svx === undefined) V.lvx = b.vx;
    V.svx = (V.svx ?? b.vx) + (b.vx - (V.svx ?? b.vx)) * Math.min(1, dt * 10);
    V.svy = (V.svy ?? b.vy) + (b.vy - (V.svy ?? b.vy)) * Math.min(1, dt * 7);
    const acc = (V.svx - V.lvx) / Math.max(dt, 1e-3); V.lvx = V.svx;
    V.bank += (clamp(-acc * 0.02 * b.face, -0.4, 0.4) - V.bank) * Math.min(1, dt * 4);
    V.roll += ((air ? 0.34 : 0.1) - V.roll) * k5;
    // hovering (in the air, nearly still): it works for it - quicker, deeper beats, nose up, bobbing on each stroke
    V.hov = (V.hov || 0) + (((air && spd < 3.5 && !b.gliding) ? 1 : 0) - (V.hov || 0)) * Math.min(1, dt * 4);
    V.pitch = (V.pitch || 0) + ((air ? clamp(V.svy * 0.035, -0.4, 0.32) + V.hov * 0.2 : 0) - (V.pitch || 0)) * Math.min(1, dt * 9);
    v.g.rotation.set((air ? V.bank : 0) + V.roll + turning * 0.5, -0.34, V.pitch, 'YXZ');
    // wings: every beat from the sim is a power stroke; between beats it keeps flapping to hold itself up (deeper
    // and quicker while it climbs), a glide spreads them, a fast drop sweeps them back, on a ledge they fold
    if (b.beat < V.lastBeat - 1e-6) V.ph = 0;
    V.lastBeat = b.beat;
    const climb = clamp(b.vy / 6, -1, 1), dive = air && b.vy < -8 && !b.gliding ? 1 : 0;
    const ampT = !air ? 0 : b.gliding ? 0.14 : 0.62 + Math.max(0, climb) * 0.38 - Math.max(0, -climb) * 0.2 + V.hov * 0.3;
    V.amp += (ampT - V.amp) * k5;
    V.fold += ((air ? 0 : 1) - V.fold) * Math.min(1, dt * (air ? 9 : 4));
    V.dive += (dive - V.dive) * Math.min(1, dt * 4);
    V.ph = (V.ph + dt * (b.gliding ? 1.4 : 2.3 + Math.max(0, climb) * 1.1 + V.hov * 1.3)) % 1;
    const A = V.amp, F0 = V.fold, D0 = V.dive * (1 - F0);
    const w1 = (0.12 + A * 0.85 * stroke(V.ph)) * (1 - F0) + 0.42 * F0 + 0.15 * D0, f1 = 0.62 * F0 + 0.85 * D0;
    const w2 = (0.06 + A * 0.5 * stroke(V.ph - 0.07)) * (1 - F0) - 0.25 * F0, f2 = 1.25 * F0 + 0.6 * D0;
    const w3 = (A * 0.45 * stroke(V.ph - 0.15)) * (1 - F0) + 0.1 * F0, f3 = 0.9 * F0 + 0.45 * D0;
    if (v.wingR) {
      v.wingR.rotation.set(-w1, -f1, 0); v.wingL.rotation.set(w1, f1, 0);
      v.midR.rotation.set(-w2, -f2, 0); v.midL.rotation.set(w2, f2, 0);
      v.tipR.rotation.set(-w3, -f3, 0); v.tipL.rotation.set(w3, f3, 0);
    }
    // legs: tucked back in flight, reaching for a ledge below it as it comes down, striding when it runs, a crouch on landing
    if (air !== V.wasAir) { if (!air) V.land = 1; V.wasAir = air; }
    V.land = Math.max(0, V.land - dt * 4);
    const below = air && b.vy < 0.5 && W ? ledgeUnder(W, b.x, b.y) : null;
    V.reach += ((below && b.y - below.y < 2.6 ? 1 : 0) - V.reach) * k9;
    V.tuck += ((air ? 1 - V.hov * 0.6 : 0) - V.tuck) * Math.min(1, dt * 7);   // legs hang down in a hover
    const gait = !air ? Math.min(1, Math.abs(b.vx) / 3) : 0, rp = b.run * 2.4 * Math.sign(fwd || 1);
    if (v.legR) for (const [L, S, Ft, off] of [[v.legR, v.shinR, v.footR, 0], [v.legL, v.shinL, v.footL, Math.PI]]) {
      const tk = V.tuck * (1 - V.reach), rc = V.reach * V.tuck, s = Math.sin(rp + off), c = Math.cos(rp + off);
      L.rotation.z = -1.15 * tk + 0.35 * rc + s * 0.55 * gait + 0.25 * V.land;
      S.rotation.z = 1.5 * tk - 0.25 * rc + Math.max(0, c) * 0.7 * gait - 0.45 * V.land;
      Ft.rotation.z = 0.9 * tk - 0.35 * rc - s * 0.35 * gait + 0.2 * V.land;
    }
    // tail: a whip that ripples with the beats and droops on a ledge
    if (v.tail) {
      const tw = t * 2.6 + V.t;
      v.tail.rotation.set(0, Math.sin(tw) * 0.12, air ? clamp(-b.vy * 0.03, -0.3, 0.3) : 0.15);
      v.tail2.rotation.set(0, Math.sin(tw - 0.9) * 0.22, A * 0.12 * stroke(V.ph - 0.3));
      v.tail3.rotation.set(0, Math.sin(tw - 1.8) * 0.32, A * 0.18 * stroke(V.ph - 0.45) + (air ? 0 : 0.1));
    }
    // neck and head: the head rides the beats and looks at whoever is closest; the jaw opens on a beat and screeches in a dive
    let tg = null, td = 14;
    if (W) for (const q of b.input ? W.riders : W.players) { if (!q.alive) continue; const d = Math.abs(((q.x - b.x + F.C * 1.5) % F.C) - F.C / 2); if (d < td) { td = d; tg = q; } }
    const dyT = tg ? clamp((tg.y - b.y) / Math.max(2, td), -0.8, 0.8) : 0;
    V.lookY += (dyT - V.lookY) * Math.min(1, dt * 3);
    if (v.neck) {
      v.neck.rotation.set(0, Math.sin(t * 0.9 + V.t) * 0.08, (air ? clamp(b.vy * 0.025, -0.2, 0.25) : -0.1) - A * 0.07 * stroke(V.ph + 0.1));
      v.head.rotation.set(0, Math.sin(t * 1.3 + V.t) * 0.06, V.lookY * 0.35 + Math.sin(t * 1.7 + V.t) * 0.04);
      const open = 0.06 + Math.max(0, 1 - b.beat / 0.22) * 0.25 + V.dive * 0.35 + (air ? 0 : Math.max(0, Math.sin(t * 0.7 + V.t * 3) - 0.92) * 4);
      V.jaw += (open - V.jaw) * Math.min(1, dt * 12);
      v.jaw.rotation.z = -V.jaw;
      const fl = 0.15 + V.jaw * 0.9 + A * 0.12 * stroke(V.ph);
      v.frillR.rotation.x = -fl; v.frillL.rotation.x = fl;
    }
    // the body rides each stroke (a lift after the downstroke), more in a hover
    if (v.mount) v.mount.position.y = air ? A * (0.05 + V.hov * 0.07) * stroke(V.ph + 0.3) : Math.abs(Math.sin(b.run * 2.4)) * 0.05 * gait - 0.05 * V.land;
    // the knight: leans into the climb or the run, looks about (back over the shoulder at a threat behind); the cape
    // and the pennant stream in the wind of its flight
    if (v.torso) {
      v.torso.rotation.set(0, 0, (air ? clamp(b.vy * 0.02, -0.15, 0.15) : 0) - clamp(fwd * 0.012, -0.08, 0.1) + A * 0.03 * stroke(V.ph + 0.2) + 0.12 * V.land);
      const behind = tg && (((tg.x - b.x + F.C * 1.5) % F.C) - F.C / 2) * b.face < -1 ? 1 : 0;
      V.look += (behind - V.look) * Math.min(1, dt * 4);
      v.helm.rotation.set(0, -0.95 * V.look + Math.sin(t * 0.6 + V.t) * 0.12 * (1 - V.look), V.lookY * 0.45);
      v.foreR.rotation.set(0, 0, A * 0.04 * stroke(V.ph + 0.25));
      v.armL.rotation.set(Math.sin(t * 1.1 + V.t) * 0.05, 0, A * 0.06 * stroke(V.ph + 0.3) - 0.05 * V.land);
      const cx = -fwd * 0.13 - 0.15, cy = -1.6 - b.vy * 0.2;
      V.cape += (clamp(Math.atan2(cx, -cy), -2.3, -0.3) - V.cape) * Math.min(1, dt * 6);
      const fl = Math.min(1, spd / 9);
      v.cape.rotation.set(0, 0, V.cape + Math.sin(t * 9 + V.t) * 0.06 * fl);
      v.cape2.rotation.set(Math.sin(t * 7 + V.t) * 0.08 * fl, 0, -0.25 * fl + Math.sin(t * 11 + V.t + 1) * 0.16 * fl);
      v.pennant.rotation.set(Math.sin(t * 9 + V.t) * 0.12 * (0.3 + fl), Math.sin(t * 14 + V.t) * 0.3 * (0.3 + fl), 0);
    }
    if (v.tip) v.tip.scale.setScalar(1 + Math.sin(t * 9 + V.t) * 0.12);
  }
  sync(W, dt) {
    this.W = W;
    const t = this.time;
    // ledges: cracking, falling, rebuilt
    if (this.ledges) for (const lg of this.ledges.children) {
      const bossSet = W.kind === 'boss';
      if (lg.userData.static) { lg.visible = !(bossSet && this.ledgeRams); continue; }
      if (lg.userData.bossOnly && !bossSet) { lg.visible = false; continue; }
      const L = W.ledges[lg.userData.id];
      if (!L) { lg.visible = false; continue; }
      if (L.st === 0) {
        lg.visible = true; lg.userData.fall = 0;
        const gr = lg.userData.grow;
        if (gr !== undefined && gr < 1) { lg.userData.grow = Math.min(1, gr + dt * 1.6); const e = 1 - lg.userData.grow; lg.position.set(0, -e * e * 7, 0); }
        else lg.position.set(0, 0, 0);
      }
      else if (L.st === 1) { lg.visible = true; const s = 0.04 + (L.t / L.T) * 0.12; lg.position.set((Math.random() - 0.5) * s, (Math.random() - 0.5) * s, (Math.random() - 0.5) * s); }
      else { lg.userData.fall = (lg.userData.fall || 0) + dt; lg.position.y = -lg.userData.fall * lg.userData.fall * 9; lg.visible = lg.userData.fall < 1.8; }
    }
    // players and riders
    const seen = new Set();
    W.players.forEach((p) => {
      let V = this.views.p.get(p.id);
      if (!V) { V = this.riderView('player', false, p.id); this.views.p.set(p.id, V); }
      V.outer.visible = p.alive && !(p.inv > 0 && Math.floor(p.inv * 10) % 2 === 0 && p.inv < F.inv - 0.2);
      if (p.alive) this.animRider(V, p, dt, t);
      const sp = p.alive && p.on < 0 ? Math.hypot(p.vx, p.vy) : 0;
      if (sp > 11 && V.v.tipR && !CALM.on) {
        const n = (sp - 11) * dt * 9;
        for (const [tip, s] of [[V.v.tipR, 1], [V.v.tipL, -1]]) if (Math.random() < n) {
          tip.localToWorld(_v.set(-0.15, 0, s * 0.55));   // near the wingtip
          this.fx.fireP.add({ x: _v.x, y: _v.y, z: _v.z, vx: 0, vy: 0, vz: 0, s0: 0.11, s1: 0.02, max: 0.32, a: 0.55, r: 0.85, g: 0.92, b: 1, drag: 3, grav: 0, fade: 0.4 });
        }
      }
      this.hitFlash(V, p.alive ? p.hitT : 0, dt, 0.13);   // players: not on their own win (0.12) - only real knocks
      const LL = this.lanceLights[p.id - 1];
      if (LL) { if (p.alive) { toWorld(p.x + p.face * 2.1, p.y + F.lanceH, LL.position, 0.6); LL.intensity = 6 + Math.sin(t * 9) * 1.5; LL.color.set(this.suit[p.id - 1].accent); } else LL.intensity = 0; }
    });
    for (const r of W.riders) {
      seen.add(r.id);
      let V = this.views.r.get(r.id);
      if (!V) { V = this.riderView(r.type, r.elite, 0); this.views.r.set(r.id, V); V.born = 0; }
      V.born += dt;
      const s = Math.min(1, V.born / 0.35);
      V.v.g.scale.setScalar(0.3 + 0.7 * s);
      this.animRider(V, r, dt, t);
      this.hitFlash(V, r.hitT, dt);
    }
    for (const [id, V] of this.views.r) if (!seen.has(id)) { this.scene.remove(V.outer); MD.release(V.v.g); this.views.r.delete(id); }
    // ghosts: unhorsed riders tumbling away. The skyray and its knight break apart and fall on their own; a ledge
    // (and its hanging rock) stops them like anything else, and whatever comes to rest on one slowly fades away
    for (const G of this.ghosts) if (G.v.flashOn) this.flashView(G.v, false);
    this.ghosts = this.ghosts.filter((G) => {
      if (G.wz === undefined) { G.wx = G.w * 0.6; G.wz = G.w; G.rx = G.rz = 0; G.solid = !!G.split; G.fadeAt = 1.6; G.fadeD = 0.6; }
      G.t += dt;
      if (G.split && G.v.rider && !G.parts) this.throwParts(G);
      const PS = G.parts || [];
      this.fallBody(W, G, dt, G);
      this.place(G.outer, G.x, G.y, G.face);
      G.v.g.rotation.set(G.rx, -0.3, G.rz, 'YXZ');
      for (const K of PS) { this.fallBody(W, K, dt, G); this.place(K.outer, K.x, K.y, G.face); K.joint.rotation.set(K.rx, K.ry || 0, K.rz); }
      if (G.split) this.limpGhost(G, PS.find((K) => K.kind === 'knight'), dt);
      for (const B of [G, ...PS]) if (B.y < 0.2 && !B.splashed) { B.splashed = true; toWorld(B.x, 0, _v); this.fx.splash(_v.x, 0, _v.z, B === G ? 1.2 : B.kind === 'knight' ? 0.7 : 0.35); }
      const a = 1 - clamp((G.t - G.fadeAt) / G.fadeD, 0, 1);
      if (a < 1) this.fadeGhost(G, a);
      if (a <= 0 || [G, ...PS].every((B) => B.y < -6)) {
        this.scene.remove(G.outer); for (const K of PS) this.scene.remove(K.outer);
        MD.release(G.v.g); return false;
      }
      return true;
    });
    this.syncCores(W, dt, t);
    this.syncPickups(W, t);
    this.syncHunter(W, dt, t);
    this.syncBoss(W, dt, t);
    if (this.bossV && W.boss) this.hitFlash(this.bossV, W.boss.hitT, dt);
    this.syncHaz(W, dt, t);
    this.syncShots(W);
    this.syncBooms(W);
    this.markWeak(W, t);
    // the spire crown pulses before lightning
    let charge = 0;
    for (const h of W.haz) if (h.k === 'bolt' && h.t < h.T) charge = Math.max(charge, h.t / h.T);
    this.crown.scale.setScalar(1 + charge * 0.6 + Math.sin(t * 2) * 0.05);
    const CL = this.lightPool[0];
    CL.position.set(0, 49.5, 0); CL.intensity = 40 + charge * 400; CL.distance = 60; CL.color.set(this.look.spire);
  }
  sfx() { /* main.js points this at the game's 3D audio: (name, x, y, opts) */ }
  // a dead skyray is limp: falling, the air lifts its wings and they flutter, its neck and tail trail; on a ledge they
  // splay out flat and its head and jaw sag. The thrown knight flails his arms until he lands, then lies slack
  limpGhost(G, K, dt) {
    const v = G.v, k = 1 - Math.exp(-dt * 7), air = !G.L, t = G.t * 13;
    const ez = (o, x, y, z) => { if (!o) return; o.rotation.x += (x - o.rotation.x) * k; o.rotation.y += (y - o.rotation.y) * k; o.rotation.z += (z - o.rotation.z) * k; };
    if (v.wingR) {
      const a1 = air ? 0.7 + Math.sin(t) * 0.18 : -0.1, a2 = air ? 0.35 + Math.sin(t - 0.8) * 0.25 : -0.22, a3 = air ? 0.3 + Math.sin(t - 1.6) * 0.35 : -0.18;
      ez(v.wingR, -a1, air ? -0.2 : 0, 0); ez(v.wingL, a1, air ? 0.2 : 0, 0);
      ez(v.midR, -a2, 0, 0); ez(v.midL, a2, 0, 0);
      ez(v.tipR, -a3, 0, 0); ez(v.tipL, a3, 0, 0);
    }
    if (v.neck) { ez(v.neck, 0, Math.sin(t * 0.4) * 0.15 * (air ? 1 : 0), air ? 0.25 : -0.35); ez(v.head, 0, 0, air ? 0.25 : -0.25); ez(v.jaw, 0, 0, -0.35); }
    if (v.frillR) { ez(v.frillR, -0.05, 0, 0); ez(v.frillL, 0.05, 0, 0); }
    if (v.tail) { ez(v.tail, 0, air ? Math.sin(t * 0.7) * 0.3 : 0.1, air ? 0.2 : 0.05); ez(v.tail2, 0, air ? Math.sin(t * 0.7 - 1) * 0.4 : 0.15, 0); ez(v.tail3, 0, air ? Math.sin(t * 0.7 - 2) * 0.5 : 0.2, 0); }
    if (v.legR) for (const [L, S, Ft] of [[v.legR, v.shinR, v.footR], [v.legL, v.shinL, v.footL]]) { ez(L, 0, 0, air ? 0.2 : 0.35); ez(S, 0, 0, air ? 0.3 : -0.3); ez(Ft, 0, 0, 0.2); }
    if (!K) return;
    const ka = !K.L, s = t * 1.2;
    ez(v.torso, 0, 0, ka ? Math.sin(s * 0.7) * 0.3 : 0.1);
    ez(v.helm, 0, ka ? Math.sin(s * 0.9) * 0.5 : 0.3, ka ? 0.2 : -0.3);
    ez(v.armR, ka ? Math.sin(s) * 1.1 : 0.2, 0, ka ? 1 + Math.sin(s * 1.3) * 0.7 : 0.4);
    ez(v.foreR, 0, 0, ka ? 0.6 + Math.sin(s * 1.7) * 0.5 : 0.3);
    ez(v.armL, ka ? Math.sin(s + 2) * 1.1 : -0.2, 0, ka ? 1 + Math.sin(s * 1.1 + 1) * 0.7 : 0.3);
    if (v.cape) { ez(v.cape, 0, 0, ka ? -1.9 + Math.sin(s * 2) * 0.2 : -0.5); ez(v.cape2, 0, 0, ka ? Math.sin(s * 2.4) * 0.3 : 0); }
  }
  // the jouster breaks apart: the knight is thrown clear of the saddle and loses his lance and shield. Each of those
  // joints moves to a frame of its own (the skinned meshes follow their joints wherever they are), starting where it
  // was, so each piece can fly, land and settle apart from the skyray
  throwParts(G) {
    this.place(G.outer, G.x, G.y, G.face);
    G.v.g.rotation.set(0, -0.3, 0, 'YXZ');
    G.outer.updateMatrixWorld(true);
    G.v.g.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; });   // the pieces end up metres apart
    const f = G.face, rnd = () => Math.random() - 0.5;
    const spec = [
      ['knight', G.v.rider, -1.8 * f + rnd() * 1.5, 2.6, rnd() * 3, 5 + Math.random() * 2],
      ['lance', G.v.lance, 3.2 * f + rnd() * 2, 4.2 + Math.random() * 1.5, rnd() * 2, (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 4)],
      ['shield', G.v.shield, -0.8 * f + rnd() * 2.5, 3.4 + Math.random() * 1.2, (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 3), rnd() * 4],
    ];
    G.parts = [];
    // where each piece is, read before any of them leaves the hierarchy (the lance and shield hang off the knight)
    const at = spec.map(([, joint]) => joint && joint.getWorldPosition(new THREE.Vector3()));
    spec.forEach(([kind, joint, dvx, dvy, wx, wz], i) => {
      if (!joint) return;
      const w = at[i], th = Math.atan2(w.x, w.z), x = ((th * RR) % F.C + F.C) % F.C;
      const outer = new THREE.Group();
      outer.matrixAutoUpdate = false; this.scene.add(outer);
      outer.add(joint); joint.position.set(0, 0, 0); joint.rotation.set(0, 0, 0);
      G.parts.push({ kind, joint, outer, x, y: w.y, vx: G.vx + dvx, vy: G.vy + dvy, rx: 0, rz: 0, wx, wz, solid: true });
    });
  }
  // one falling piece of an unhorsed jouster (render only; the sim has moved on). hr: how high its origin sits above
  // whatever it lies on (a skyray belly down sits low, on its back high; a knight lies flat; a lance or shield flatter)
  bodyHr(B) { return B.kind === 'knight' ? 0.24 : B.kind ? 0.05 : 0.39 - 0.37 * Math.cos(B.rx) * Math.cos(B.rz); }
  fallBody(W, B, dt, G) {
    if (B.L) {   // at rest: it slides to a stop and settles into a heap, and falls on if the ledge goes or it slides off
      const L = B.L;
      B.vx *= Math.exp(-dt * 7); B.x += B.vx * dt;
      if (L.st !== 2 && Math.abs(dXr(L.x, B.x)) <= L.w + 0.25) {
        const k = 1 - Math.exp(-dt * 9);
        B.rx += (B.tx - B.rx) * k; B.rz += (B.tz - B.rz) * k;
        B.y += (L.y + this.bodyHr(B) - B.y) * Math.min(1, dt * 14);
        return;
      }
      B.L = null;
    }
    const px = B.x, py = B.y, hr0 = this.bodyHr(B);
    B.vy -= 14 * dt; B.x += B.vx * dt; B.y += B.vy * dt; B.rx += B.wx * dt; B.rz += B.wz * dt;
    if (!W || !B.solid) return;
    const hr = this.bodyHr(B);
    // its lowest point came down through a ledge top: it lands
    if (B.vy < 0) for (const L of W.ledges) {
      if (L.st === 2 || Math.abs(dXr(L.x, B.x)) > L.w + 0.25) continue;
      if (py - hr0 >= L.y - 0.05 && B.y - hr < L.y) { this.landBody(B, L, G); return; }
    }
    // the slab's ends and the rock hanging under it are solid too (unless it started inside, then it falls out)
    if (this.inSolid(W, B.x, B.y, hr) && !this.inSolid(W, px, py, hr0)) {
      if (!this.inSolid(W, px, B.y, hr)) { B.x = px; B.vx *= -0.35; }
      else if (!this.inSolid(W, B.x, py, hr)) { B.y = py; B.vy = B.vy > 0 ? -B.vy * 0.25 : 0; }
      else { B.x = px; B.y = py; B.vx *= -0.35; B.vy = B.vy > 0 ? -B.vy * 0.25 : 0; }
    }
  }
  // does a body (its origin x, y; about half a unit tall above its lowest point) overlap a ledge's slab or rock?
  inSolid(W, x, y, hr) {
    const lo = y - hr, hi = lo + 0.5;
    for (const L of W.ledges) {
      if (L.st === 2) continue;
      const a = Math.abs(dXr(L.x, x));
      if (a > L.w + 0.25 || lo >= L.y - 0.02) continue;
      const c = Math.max(0, a - 0.25);
      if (c < L.w && hi > L.y - F.ledgeT - rockDrop(L.w, c)) return true;
    }
    return false;
  }
  // a hard landing bounces once (a lance or shield clatters twice); then it comes to rest flat (a skyray on its belly
  // or its back, a knight on his side, a lance along the ledge, a shield face down or up), throws up a little dust
  // with a thud or a clank, and the whole jouster starts to fade
  landBody(B, L, G) {
    toWorld(B.x, L.y + 0.1, _v);
    const kind = B.kind || 'mount', hard = Math.min(1, -B.vy / 12);
    this.fx.dust(_v.x, _v.y, _v.z, { n: kind === 'mount' ? 10 : kind === 'knight' ? 6 : 3, s0: 0.3, s1: kind === 'mount' ? 1.1 : 0.7, life: 0.7, vy: 1.2, up: 1, jit: 0.8, a: 0.5, k: 1.4, grav: 2 });
    if (kind === 'mount') this.sfx('thud', B.x, L.y, { vol: 0.35 + hard * 0.45, rate: 0.85, gap: 0.08, key: 'thudM' });
    else if (kind === 'knight') this.sfx('thud', B.x, L.y, { vol: 0.25 + hard * 0.3, rate: 1.15, gap: 0.08, key: 'thudK' });
    else this.sfx('clatter', B.x, L.y, { vol: 0.15 + hard * 0.3, rate: kind === 'lance' ? 1.15 : 0.9, gap: 0.05, vary: 0.2, key: 'clat' + kind });
    const bounces = kind === 'lance' || kind === 'shield' ? 2 : 1;
    if (B.vy < -3 && (B.bounced || 0) < bounces) {
      B.bounced = (B.bounced || 0) + 1; B.vy = -B.vy * (kind === 'mount' || kind === 'knight' ? 0.28 : 0.35); B.vx *= 0.6; B.wx *= 0.5; B.wz *= 0.5;
      B.y = L.y + this.bodyHr(B) + 0.02;
      return;
    }
    B.L = L; B.vy = 0; B.wx = B.wz = 0;
    const nearest = (a, o, s) => o + Math.round((a - o) / s) * s;
    if (kind === 'knight') { B.tz = nearest(B.rz, 0, Math.PI); B.tx = nearest(B.rx, Math.PI / 2, Math.PI); }   // on his side
    else if (kind === 'lance') { B.tz = nearest(B.rz, 0, Math.PI); B.tx = nearest(B.rx, 0, Math.PI); }
    else if (kind === 'shield') { B.tz = nearest(B.rz, Math.PI / 2, Math.PI); B.tx = nearest(B.rx, 0, Math.PI); }   // its face to the ledge
    else { B.tz = nearest(B.rz, 0, Math.PI); B.tx = nearest(B.rx, 0, Math.PI) + (Math.random() - 0.5) * 0.3; }
    if (!G.landed) {
      G.landed = true;
      const a0 = 1 - clamp((G.t - G.fadeAt) / G.fadeD, 0, 1);
      G.fadeAt = a0 >= 1 ? Math.min(G.fadeAt, G.t + 0.45) : G.t - (1 - a0) * 1.4;
      G.fadeD = 1.4;
    }
  }
  // fading: the ghost gets its own see-through copies of its materials (their programs are compiled in the warm-up;
  // the copies are never disposed, so those programs stay)
  fadeGhost(G, a) {
    if (!G.fade) {
      G.fade = [];
      const grab = (o) => {
        if (!o.isMesh || o.isInstancedMesh || !o.material || Array.isArray(o.material)) return;
        const m = o.material.clone(); m.transparent = true;
        G.fade.push([o, m, o.material.opacity]); o.material = m; o.frustumCulled = false;
      };
      G.outer.traverse(grab); for (const K of G.parts || []) K.outer.traverse(grab);
    }
    for (const [o, m, b] of G.fade) { m.opacity = b * a; if (a < 0.5) o.castShadow = false; }
  }
  syncCores(W, dt, t) {
    const seen = new Set();
    for (const c of W.cores) {
      seen.add(c.id);
      let V = this.views.c.get(c.id);
      if (!V) { V = MD.core(); this.scene.add(V.g); this.views.c.set(c.id, V); }
      toWorld(c.x, c.y, V.g.position);
      const urg = c.rush ? 0 : clamp((c.t - (c.T - 3)) / 3, 0, 1);
      V.cage.rotation.y += dt * (1.2 + urg * 5);
      const pulse = 1 + urg * 0.5 * (0.5 + 0.5 * Math.sin(t * (6 + urg * 16)));
      V.crystal.scale.set(pulse, 1.6 * pulse, pulse);
      V.heart.scale.setScalar(1 + urg * 1.2);
      V.g.scale.setScalar(c.st === 'form' ? 1 + c.fT * 1.4 : 1);
      V.g.visible = !(c.rush && c.t > 18 && Math.floor(t * 8) % 2);
    }
    for (const [id, V] of this.views.c) if (!seen.has(id)) { this.scene.remove(V.g); this.views.c.delete(id); }
  }
  syncPickups(W, t) {
    const seen = new Set();
    for (const q of W.pickups) {
      seen.add(q.id);
      let V = this.views.pk.get(q.id);
      if (!V) { V = MD.pickup(POWERUPS[q.kind].color); this.scene.add(V.g); this.views.pk.set(q.id, V); }
      toWorld(q.x, q.y + Math.sin(t * 2.2 + q.id) * 0.25, V.g.position);
      V.ring.rotation.y = t * 1.6; V.ring.rotation.x = t * 0.7;
      V.g.visible = q.life - q.t > 3 || Math.floor(t * 6) % 2 === 0;
    }
    for (const [id, V] of this.views.pk) if (!seen.has(id)) { this.scene.remove(V.g); this.views.pk.delete(id); }
  }
  syncHunter(W, dt, t) {
    const h = W.hunter;
    if (!h) { if (this.hunterV) this.hunterV.outer.visible = false; return; }
    if (!this.hunterV) { const v = MD.hunter(); const outer = new THREE.Group(); outer.matrixAutoUpdate = false; outer.add(v.g); this.scene.add(outer); this.hunterV = { v, outer }; }
    const V = this.hunterV;
    V.outer.visible = true;
    const tw = this.turnSpring(V, h.face, dt, 160, 0.25);
    this.placeTurn(V.outer, h.x, h.y, V.phi);
    V.v.g.rotation.set(tw * 0.45, 0, clamp(h.vy * 0.05, -0.5, 0.5), 'YXZ');
    const a = Math.sin(t * 16) * 0.5;
    V.v.wingR.rotation.x = -a; V.v.wingL.rotation.x = a;
    V.v.tail.rotation.y = Math.sin(t * 5) * 0.2;
    V.v.eye.scale.setScalar(1 + Math.sin(t * 20) * 0.2);
  }
  // a hit knocks the boss back from the blow (a damped spring, render only: the sim body does not move) and makes it
  // flinch: a jolt of its body, wings and head, and a brief squash
  bossKick(W, e, k) {
    const V = this.bossV, B = W.boss;
    if (!V || !B) return;
    const dir = Math.sign(dXr(e.x, B.x)) || 1, below = e.y > B.y ? -1 : 0.4;
    V.rvx = (V.rvx || 0) + dir * 12 * k; V.rvy = (V.rvy || 0) + below * 8 * k;
    V.flv = (V.flv || 0) + 14 * k; V.fdir = dir;
  }
  bossRecoil(V, dt) {
    const s = Math.min(dt, 1 / 30);
    for (const [p, v] of [['rx', 'rvx'], ['ry', 'rvy'], ['fl', 'flv']]) {
      V[v] = (V[v] || 0) + (-(V[p] || 0) * 140 - V[v] * 13) * s;
      V[p] = (V[p] || 0) + V[v] * s;
    }
    V.rx = clamp(V.rx, -1.6, 1.6); V.ry = clamp(V.ry, -1.2, 1.2); V.fl = clamp(V.fl, -0.6, 0.9);
  }
  syncBoss(W, dt, t) {
    const B = W.boss;
    if (!B) { if (this.bossV) { this.scene.remove(this.bossV.outer); this.bossV = null; } return; }
    if (!this.bossV || this.bossV.key !== B.key) {
      if (this.bossV) this.scene.remove(this.bossV.outer);
      const v = MD.boss(B.key), outer = new THREE.Group(); outer.matrixAutoUpdate = false; outer.add(v.g); this.scene.add(outer);
      v.g.scale.setScalar({ sovereign: 1.4, wyvern: 1.18, gale: 1.05 }[B.key] || 1);
      // the Forge Colossus wades in the sea just inside the ring, behind the ledges' rock (it is far too tall to pass
      // between them); the Leviathan's coils dip behind any rock they would cut through
      this.bossV = { v, outer, key: B.key, lane: B.key === 'colossus' ? COLOSSUS_LANE : 0, segLane: null, segPrev: null };
      if (B.key === 'leviathan') { outer.matrix.identity(); outer.matrixWorldNeedsUpdate = true; for (const s of v.segs) s.matrixAutoUpdate = false; }
    }
    const V = this.bossV, v = V.v;
    const hit = B.hitT > 0 ? 1 + B.hitT * 0.15 : 1;
    this.bossRecoil(V, dt);
    const rcx = V.rx || 0, rcy = V.ry || 0, fl = V.fl || 0;
    if (V.s0 === undefined) V.s0 = v.g.scale.x;
    if (B.key === 'leviathan') {
      if (!V.segLane) { V.segLane = B.seg.map(() => 0); V.segPrev = B.seg.map((s) => [s.x, s.y]); }
      const k = Math.min(1, dt * 7);
      B.seg.forEach((s, i) => {
        // where this coil will be in a moment: behind the ring while it would be in a ledge's rock
        const pv = V.segPrev[i], vx = dt > 0 ? (((s.x - pv[0] + F.C * 1.5) % F.C) - F.C / 2) / dt : 0, vy = dt > 0 ? (s.y - pv[1]) / dt : 0;
        pv[0] = s.x; pv[1] = s.y;
        const inR = s.y > -2.5 && (inRockR(W, s.x, s.y, 1.6) || inRockR(W, s.x + clamp(vx, -30, 30) * 0.25, s.y + clamp(vy, -30, 30) * 0.25, 1.6));
        V.segLane[i] += ((inR ? -LEV_LANE : 0) - V.segLane[i]) * k;
      });
      B.seg.forEach((s, i) => {
        const m = v.segs[i]; if (!m) return;
        const prev = B.seg[Math.max(0, i - 1)], next = B.seg[Math.min(B.seg.length - 1, i + 1)];
        let dx = ((prev.x - next.x + F.C * 1.5) % F.C) - F.C / 2, dy = prev.y - next.y;
        if (i === 0) { dx = ((s.x - next.x + F.C * 1.5) % F.C) - F.C / 2; dy = s.y - next.y; }
        const l = Math.hypot(dx, dy) || 1;
        tangent(s.x, _v).multiplyScalar(dx / l).addScaledVector(UP, dy / l).normalize();
        radial(s.x, _v2);
        _v3.crossVectors(_v2, _v).normalize();
        const kr = Math.max(0, 1 - i / 6);
        _m.makeBasis(_v, _v3, _v2); toWorld(s.x + rcx * kr, s.y + rcy * kr, _v3, V.segLane[i]); _m.setPosition(_v3);
        m.matrix.copy(_m); m.matrixWorldNeedsUpdate = true;
        m.visible = s.y > -3.5;
      });
      v.pts.forEach((g, i) => { g.visible = B.pts[i] && B.pts[i].hp > 0; g.scale.setScalar(hit * (1 + Math.sin(t * 6 + i) * 0.08)); });
      return;
    }
    // the Colossus wades and always faces the camera; the fliers swing round on a slow, heavy spring and bank into it
    let tw = 0;
    if (B.key === 'colossus') { V.face = 1; this.place(V.outer, B.x + rcx, B.y + rcy, 1, V.lane); }
    else { tw = this.turnSpring(V, B.face, dt, 26, 0.2); this.placeTurn(V.outer, B.x + rcx, B.y + rcy, V.phi, V.lane); }
    // the flinch: pitched back from the blow, rolled a little, squashed for an instant
    const fd = (V.fdir || 1) * V.face;
    v.g.rotation.set(fl * 0.18 + tw * 0.32, 0, (B.key === 'colossus' ? 0 : clamp(B.vy * 0.04, -0.3, 0.3)) + fl * 0.32 * fd, 'YXZ');
    v.g.scale.set(V.s0 * (1 + fl * 0.06), V.s0 * (1 - fl * 0.09), V.s0 * (1 + fl * 0.06));
    if (B.st === 'down') { v.g.rotation.z += B.t * 0.1; }
    const flap = B.key === 'colossus' ? 0 : Math.sin(t * (B.key === 'gale' ? 2.2 : 3)) * (B.key === 'sovereign' ? 0.25 : 0.4) + fl * 0.6;
    if (v.wingR) { v.wingR.rotation.x = -flap; v.wingL.rotation.x = flap; }
    if (v.tipR) { v.tipR.rotation.x = -flap * 0.6; v.tipL.rotation.x = flap * 0.6; }
    if (v.tail) v.tail.rotation.y = Math.sin(t * 1.5) * 0.15 + fl * 0.4;
    if (v.head && B.key !== 'colossus') { v.head.rotation.x = fl * 0.25; v.head.rotation.z = fl * 0.3; }
    v.pts.forEach((g, i) => {
      const q = B.pts[i];
      if (!q) return;
      g.visible = q.hp > 0 && (q.on || B.key === 'gale');
      if (B.key === 'gale' && q.core) g.visible = q.on && q.hp > 0;
      g.scale.setScalar(q.on ? hit * (1 + Math.sin(t * 5 + i) * 0.06) : 1);
    });
    if (v.hatch) { const open = B.pts.some((q) => q.core && q.on); v.hatch.rotation.x += ((open ? -1.6 : 0) - v.hatch.rotation.x) * Math.min(1, dt * 3); v.hatch.position.z = open ? 1.2 : 0; }
    if (B.key === 'colossus' && v.armR) {
      const c = B.cur, raise = c && c.kind === 'slam' ? (c.t < c.T ? Math.min(1, c.t / (c.T * 0.7)) : Math.max(0, 1 - (c.t - c.T) * 4)) : 0;
      v.armR.rotation.x = 0; v.armR.rotation.z = raise * 2.2;
      v.armL.rotation.z = -Math.sin(t * 0.8) * 0.1 - fl * 0.5;
      v.armR.rotation.z += fl * 0.3;
      if (v.head) v.head.rotation.y = Math.sin(t * 0.5) * 0.3;
    }
    if (v.halo) { v.halo.position.set(0, 2.2, -2.4); v.halo.rotation.set(0, Math.PI / 2, 0); v.halo.scale.setScalar(1 + Math.sin(t) * 0.04); }
    V.outer.visible = !(B.st === 'shift' && B.stT > 0.4 && B.stT < 1.4);
  }
  syncHaz(W, dt, t) {
    for (const r of this.ribbons) if (r.used && !r.fade) r.hide();
    for (const c of this.cols) c.visible = false;
    for (const c of this.spouts) c.visible = false;
    for (const c of this.rings) c.visible = false;
    const blink = 0.55 + 0.45 * Math.sin(t * 22);
    for (const h of W.haz) {
      const pre = h.t < h.T, f = pre ? h.t / h.T : 0, act = !pre && h.t < h.T + h.A;
      if (h.k === 'spout') {
        const rg = this.takeRing(); if (rg) { toWorld(h.x, 0.1, rg.position); rg.scale.setScalar(h.w * (1 + f * 0.6)); rg.visible = true; rg.material.color.setRGB(1, 0.5 + f * 0.4, 0.4).multiplyScalar(pre ? 1.5 * blink : 0.6); }
        if (pre && Math.random() < dt * 30) { toWorld(h.x + (Math.random() - 0.5) * h.w * 2, 0.1, _v); this.fx.dust(_v.x, 0.1, _v.z, { n: 1, s0: 0.3, s1: 1, life: 0.6, vy: 1 + f * 3, up: 1, jit: 0.4, a: 0.5, k: 1.4, grav: 2 }); }
        if (act) { const c = this.takeSpout(); if (c) { toWorld(h.x, -0.2, c.position); const grow = Math.min(1, (h.t - h.T) / 0.25), fade = Math.min(1, (h.T + h.A - h.t) / 0.3); c.scale.set(h.w * (0.8 + 0.2 * grow), h.top * grow + 0.5, h.w * (0.8 + 0.2 * grow)); const u = c.material.uniforms, fire = this.look.key === 'foundry'; u.uFire.value = fire ? 1 : 0; c.material.blending = fire ? THREE.AdditiveBlending : THREE.NormalBlending; u.uColor.value.set(this.look.sea[2]).lerp(_c.set(0xf4f8ff), 0.55); u.uDeep.value.set(this.look.sea[1]).lerp(_c.set(this.look.fog), 0.3); u.uK.value = fade; u.uTime.value = t; c.visible = true; } if (Math.random() < dt * 40) { toWorld(h.x, h.top * Math.random(), _v); if (this.look.key === 'foundry') this.fx.sparks(_v.x, _v.y, _v.z, { n: 2, speed: 3, vy: 4, s: 0.12, life: 0.9, g: 0.5, b: 0.15 }); else this.fx.splash(_v.x, _v.y, _v.z, 0.25); } }
      } else if (h.k === 'bolt') {
        if (pre) { const r = this.takeRibbon(); if (r) { r.set([[h.x, H], [h.x, h.bot]], h.w * 2 * (0.3 + 0.7 * f), 0.8); r.mat.uniforms.uColor.value.set(0xff4a3a); r.mat.uniforms.uK.value = 0.35 + f * 0.6 * blink; r.mat.uniforms.uDash.value = 0; } }
      } else if (h.k === 'arc') {
        if (pre) { const r = this.takeRibbon(); if (r) { r.set([[h.x, h.y], [h.x + h.dx, h.y + h.dy]], 0.12 + f * 0.25, 0.8); r.mat.uniforms.uColor.value.set(0xffd040); r.mat.uniforms.uK.value = 0.6 + f * blink; r.mat.uniforms.uDash.value = 6; r.mat.uniforms.uTime.value = t; } }
        else if (act && Math.random() < dt * 30) this.lightning([[h.x, h.y], [h.x + h.dx, h.y + h.dy]], 0xbfd8ff, 0.5, 0.12);
      } else if (h.k === 'beam') {
        const r = this.takeRibbon();
        if (r) { r.set([[h.x, h.y], [h.x + h.dir * h.len, h.y]], pre ? 0.15 + f * 0.2 : 1.6 + Math.sin(t * 40) * 0.2, 0.9); r.mat.uniforms.uColor.value.set(pre ? 0xff5a3a : this.bossBeamColor(W)); r.mat.uniforms.uK.value = pre ? 0.5 + f * blink : 2.5; r.mat.uniforms.uDash.value = pre ? 3 : 0; r.mat.uniforms.uTime.value = t; }
      } else if (h.k === 'slam') {
        const L = W.ledges[h.ledge];
        if (L) { const r = this.takeRibbon(); if (r) { r.set([[L.x - L.w, L.y + 0.3], [L.x + L.w, L.y + 0.3]], pre ? 0.5 + f : 2.4, 1.0); r.mat.uniforms.uColor.value.set(0xff7a2a); r.mat.uniforms.uK.value = pre ? 0.4 + f * blink : 2; r.mat.uniforms.uDash.value = 0; } }
      } else if (h.k === 'drop') {
        if (pre) { const r = this.takeRibbon(); if (r) { r.set([[h.x, H], [h.x, 1]], 0.25 + f * 0.4, 0.7); r.mat.uniforms.uColor.value.set(h.kind === 'ice' ? 0x8ae8ff : 0xff7a2a); r.mat.uniforms.uK.value = 0.3 + f * 0.7 * blink; r.mat.uniforms.uDash.value = 5; r.mat.uniforms.uTime.value = t; } }
      } else if (h.k === 'line') {
        if (pre) { const r = this.takeRibbon(); if (r) { const pts = h.sea ? [[h.x, 0.3], [h.x + h.dx, 0.3]] : [[h.x, h.y], [h.x + h.dx, h.y + h.dy]]; r.set(pts, 0.3 + f * 0.5, 1.0); r.mat.uniforms.uColor.value.set(h.sea ? 0x8ae8ff : 0xff3a2a); r.mat.uniforms.uK.value = 0.5 + f * blink; r.mat.uniforms.uDash.value = 4; r.mat.uniforms.uTime.value = t; } }
      } else if (h.k === 'charge') {
        // a boss gathering orbs or calling a rider: a ring that closes in on it
        const B = W.boss;
        if (pre && B) { const r = this.takeRibbon(); if (r) { const cy = h.kind === 'summon' ? clamp(B.y + 2, 3, H - 3) : B.y + 0.4, rad = 1.2 + 4.2 * (1 - f), pts = []; for (let i = 0; i <= 20; i++) { const a = (i / 20) * Math.PI * 2 + t * 1.5; pts.push([B.x + Math.cos(a) * rad, cy + Math.sin(a) * rad]); } r.set(pts, 0.16 + f * 0.32, 1.2); r.mat.uniforms.uColor.value.set(h.kind === 'summon' ? 0xffc040 : 0xb070ff); r.mat.uniforms.uK.value = 0.5 + f * blink; r.mat.uniforms.uDash.value = 6; r.mat.uniforms.uTime.value = t; } }
      } else if (h.k === 'gust') {
        if (pre && Math.random() < dt * 24) { const s = Math.random() < 0.5 ? -1 : 1; toWorld(h.x + s * h.r * Math.random(), h.y + (Math.random() - 0.5) * 6, _v); this.fx.dust(_v.x, _v.y, _v.z, { n: 1, s0: 0.3, s1: 1.2, life: 0.6, vy: 0, up: 0.2, jit: 0.5, a: 0.3, k: 1.3, grav: 0 }); }
      }
    }
    // forming riders: a rune and a growing column of light
    for (const P of W.portals) {
      const f = P.t / P.T;
      const rg = this.takeRing(); if (rg) { toWorld(P.x, P.y + 0.06, rg.position); rg.scale.setScalar(1.3); rg.visible = true; rg.material.color.set(this.look.accent).multiplyScalar(0.6 + f * 1.4); }
      const c = this.takeCol(); if (c) { toWorld(P.x, P.y, c.position); c.scale.set(0.5 + f * 0.4, 1 + f * 4, 0.5 + f * 0.4); c.material.uniforms.uColor.value.set(this.look.accent); c.material.uniforms.uK.value = 0.4 + f * 1.2; c.material.uniforms.uTime.value = t; c.visible = true; }
    }
    for (const c of W.cores) if (c.st === 'form') { const col = this.takeCol(); if (col) { toWorld(c.x, c.y - 0.4, col.position); col.scale.set(0.7, 1 + c.fT * 5, 0.7); col.material.uniforms.uColor.value.set(0xff7a2a); col.material.uniforms.uK.value = 1.2; col.material.uniforms.uTime.value = t; col.visible = true; } }
    // lightning flashes fade
    this.flashes = this.flashes.filter((L) => { L.t -= dt; L.r.mat.uniforms.uK.value = L.k * Math.max(0, L.t / L.max) * (0.6 + Math.random() * 0.4); if (L.t <= 0) { L.r.fade = false; L.r.hide(); return false; } return true; });
  }
  bossBeamColor(W) { return W.boss && W.boss.key === 'leviathan' ? 0x8ae8ff : W.boss && W.boss.key === 'sovereign' ? 0xc080ff : W.boss && W.boss.key === 'colossus' ? 0xff8a30 : 0x7ff0ff; }
  lightning(pts, color = 0xd8e8ff, w = 0.5, dur = 0.25) {
    const r = this.takeRibbon(); if (!r) return;
    const path = [];
    for (let i = 0; i < pts.length - 1; i++) { const seg = boltPath(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 14, 0.8); if (i) seg.shift(); path.push(...seg); }
    r.set(path, w, 0.9);
    r.mat.uniforms.uColor.value.set(color); r.mat.uniforms.uDash.value = 0; r.mat.uniforms.uK.value = 4;
    r.fade = true;
    this.flashes.push({ r, t: dur, max: dur, k: 4 });
  }
  syncShots(W) {
    for (const k in this.shotI) this.shotI[k].count = 0;
    const t = this.time;
    for (const s of W.shots) {
      const I = this.shotI[s.kind]; if (!I || I.count >= 40) continue;
      toWorld(s.x, s.y, _v);
      _e.set(t * 3, t * 2, s.kind === 'ice' ? Math.PI : 0); _q.setFromEuler(_e);
      if (s.kind === 'ice') _q.identity().setFromEuler(_e.set(Math.PI, 0, 0));
      _s.setScalar(s.kind === 'orb' ? 1 + Math.sin(t * 8 + s.id) * 0.12 : 1);
      I.setMatrixAt(I.count++, _m.compose(_v, _q, _s));
    }
    for (const k in this.shotI) this.shotI[k].instanceMatrix.needsUpdate = true;
  }

  // ---------------------------------------------------------------- visual reactions to sim events
  onEvent(e, W) {
    const fx = this.fx, P = (x, y, dr = 0.3) => toWorld(x, y, _v, dr);
    switch (e.k) {
      case 'unhorse': {
        P(e.x, e.y + 1.2); fx.sparks(_v.x, _v.y, _v.z, { n: 30, speed: 9, r: 1, g: 0.85, b: 0.5 }); fx.debris(_v.x, _v.y, _v.z, { metal: true, n: 8, speed: 6, size: 0.3, trail: true }); fx.flash(_v.x, _v.y, _v.z, 30, 0xffc080, 0.3);
        this.shock(e.x, e.y + 1, 0.6); this.trauma = Math.min(1, this.trauma + (e.pid ? 0.45 : 0.3));
        const V = this.views.r.get(e.id);
        if (V) { this.views.r.delete(e.id); this.ghosts.push({ outer: V.outer, v: V.v, x: e.x, y: e.y, vx: e.vx * 0.5 + (Math.random() - 0.5) * 4, vy: 5, face: V.face, spin: 0, w: (Math.random() < 0.5 ? -1 : 1) * 5, t: 0, split: true }); }
        break;
      }
      case 'flee': case 'drown': { const V = this.views.r.get(e.id); if (V) { this.views.r.delete(e.id); this.ghosts.push({ outer: V.outer, v: V.v, x: e.x, y: e.y || 0, vx: 0, vy: e.k === 'flee' ? 14 : -2, face: V.face, spin: 0, w: 0, t: 0.9 }); } break; }
      case 'clang': P(e.x, e.y); fx.sparks(_v.x, _v.y, _v.z, { n: e.soft ? 8 : 22, speed: e.soft ? 4 : 8, r: 1, g: 0.9, b: 0.6 }); if (!e.soft) { fx.flash(_v.x, _v.y, _v.z, 14, 0xfff0c0, 0.15); this.trauma = Math.min(1, this.trauma + 0.28); } break;
      case 'death': {
        P(e.x, e.y + 1); fx.explode(_v.x, _v.y, _v.z, 1.4, { metal: true, color: 0xffa060 }); this.trauma = Math.min(1, this.trauma + 0.6); this.shock(e.x, e.y + 1, 1);
        const V = this.views.p.get(e.pid);
        if (V && e.cause !== 'sea') { const v = MD.lancer('player', { ...this.suit[e.pid - 1] }); const outer = new THREE.Group(); outer.matrixAutoUpdate = false; outer.add(v.g); this.scene.add(outer); this.ghosts.push({ outer, v, x: e.x, y: e.y, vx: (e.vx || 0) * 0.4, vy: 4, face: V.face, spin: 0, w: 6, t: 0, split: true }); }
        this.flashScreen(0.75, 0xff3a24, 1.1); this.hurtT = 1;
        break;
      }
      case 'armor': P(e.x, e.y + 1); fx.sparks(_v.x, _v.y, _v.z, { n: 18, speed: 6, r: 0.6, g: 0.85, b: 1 }); this.ring3(e.x, e.y + 1, 2.2, 0x7fd8ff); this.trauma = Math.min(1, this.trauma + 0.3); this.flashScreen(0.45, 0x7fd8ff, 1.6); this.hurtT = Math.max(this.hurtT || 0, 0.5); break;
      case 'splash': P(e.x, 0, 0); fx.splash(_v.x, 0, _v.z, e.big ? 1.6 : 1); break;
      case 'collect': P(e.x, e.y); fx.fire(_v.x, _v.y, _v.z, { n: 8, s: 0.7, sp: 0.4 }); fx.sparks(_v.x, _v.y, _v.z, { n: 14, speed: 5, r: 1, g: 0.7, b: 0.3 }); this.ring3(e.x, e.y, 1.6, 0xffa040); break;
      case 'hatch': P(e.x, e.y); fx.flash(_v.x, _v.y, _v.z, 10, 0xff7a2a, 0.5); break;
      case 'reform': case 'form': P(e.x, e.y + 1); fx.sparks(_v.x, _v.y, _v.z, { n: 16, speed: 5, r: 0.8, g: 0.8, b: 1 }); fx.flash(_v.x, _v.y, _v.z, 12, this.look.accent, 0.3); break;
      case 'spout': P(e.x, 0, 0); fx.splash(_v.x, 0, _v.z, 2.2); this.trauma = Math.min(1, this.trauma + 0.12); break;
      case 'bolt': {
        this.lightning([[e.x - 2, H + 6], [e.x, H], [e.x, e.bot]], 0xe0ecff, 0.9, 0.3);
        this.lightning([[e.x + 1, H + 3], [e.x, e.bot]], 0xb0c8ff, 0.4, 0.22);
        P(e.x, e.bot + 0.3); fx.sparks(_v.x, _v.y, _v.z, { n: 30, speed: 10, r: 0.8, g: 0.9, b: 1 }); fx.flash(_v.x, _v.y + 2, _v.z, 60, 0xc8d8ff, 0.3);
        if (e.bot < 0.5) fx.splash(_v.x, 0, _v.z, 1.2);
        this.skyMat.uniforms.uFlash.value = CALM.on ? 0.2 : 0.7; this.trauma = Math.min(1, this.trauma + 0.3); this.shock(e.x, e.bot + 1, 0.8);
        break;
      }
      case 'arc': this.lightning([[e.x, e.y], [e.x + e.dx, e.y + e.dy]], 0xd8e8ff, 0.6, 0.3); P(e.x + e.dx, e.y + e.dy); fx.sparks(_v.x, _v.y, _v.z, { n: 12, speed: 6, r: 0.8, g: 0.9, b: 1 }); break;
      case 'slam': P(e.x, e.y + 0.2); fx.debris(_v.x, _v.y, _v.z, { n: 14, speed: 7, size: 0.3 }); fx.sparks(_v.x, _v.y, _v.z, { n: 30, speed: 9 }); fx.dust(_v.x, _v.y, _v.z, { n: 12, s0: 1, s1: 3.5, life: 2.4, spread: e.w * 2 }); this.trauma = Math.min(1, this.trauma + 0.5); this.shock(e.x, e.y, 1); break;
      case 'gust': this.shock(e.x, e.y, 1.4); this.ring3(e.x, e.y, 6, 0xd8e8ff); break;
      case 'bosshit': this.bossKick(W, e, 1); P(e.x, e.y, 0.3 + this.bossLaneAt(W.boss, null, e.x)); fx.sparks(_v.x, _v.y, _v.z, { n: 36, speed: 10, r: 1, g: 0.8, b: 0.5 }); fx.flash(_v.x, _v.y, _v.z, 40, 0xffd0a0, 0.25); this.shock(e.x, e.y, 0.9); this.trauma = Math.min(1, this.trauma + 0.35); break;
      case 'wpdown': P(e.x, e.y); fx.explode(_v.x, _v.y, _v.z, 2, { metal: true }); this.trauma = Math.min(1, this.trauma + 0.6); this.flashScreen(0.25, 0xffe0c0); break;
      case 'bossdown': this.bossFinale(e, W); break;
      case 'rebuild': if (e.ram && this.ledges) { const lg = this.ledges.children.find((o) => o.userData.id === e.id); if (lg) lg.userData.grow = 0; P(e.x, e.y); fx.dust(_v.x, _v.y - 0.5, _v.z, { n: 14, s0: 0.6, s1: 2.2, life: 1.4, vy: 0.6, up: 1, jit: 2.5, a: 0.45 }); } break;
      case 'wpdown': this.bossKick(W, e, 2.2); break;
      case 'bossphase': this.bossKick(W, { x: W.boss ? W.boss.x : 0, y: W.boss ? W.boss.y + 2 : 0 }, 1.6); break;
      case 'hunterdown': P(e.x, e.y + 0.8); fx.explode(_v.x, _v.y, _v.z, 2, { metal: true, color: 0xff6a40 }); this.trauma = Math.min(1, this.trauma + 0.5); break;
      case 'crumble': if (e.ram) { P(e.x, e.y - 0.3); fx.debris(_v.x, _v.y, _v.z, { n: 16, speed: 9, size: 0.5, sp: 3 }); this.shock(e.x, e.y, 0.8); this.trauma = Math.min(1, this.trauma + 0.35); } P(e.x, e.y - 0.5); fx.debris(_v.x, _v.y, _v.z, { n: 20, speed: 4, size: 0.4, sp: 3 }); fx.dust(_v.x, _v.y, _v.z, { n: 14, s0: 1.2, s1: 4, life: 3, spread: 5 }); break;
      case 'shatter': P(e.x, e.y); if (e.kind === 'blob') fx.fire(_v.x, _v.y, _v.z, { n: 8, s: 0.8 }); else fx.sparks(_v.x, _v.y, _v.z, { n: 14, speed: 6, r: e.kind === 'orb' ? 0.7 : 0.8, g: e.kind === 'orb' ? 0.4 : 0.95, b: 1 }); if (e.sea) fx.splash(_v.x, 0, _v.z, 0.6); break;
      case 'orbpop': P(e.x, e.y); fx.sparks(_v.x, _v.y, _v.z, { n: 20, speed: 7, r: 0.8, g: 0.5, b: 1 }); break;
      case 'bonk': if (e.rock) { P(e.x, e.y); fx.dust(_v.x, _v.y, _v.z, { n: 3, s0: 0.35, s1: 1.2, life: 0.9, vy: -0.6, up: 0.3, jit: 1.6, a: 0.45, grav: 1.2 }); } break;
      case 'land': if (e.v > 7) { P(e.x, e.y + 0.1); fx.dust(_v.x, _v.y, _v.z, { n: 4, s0: 0.5, s1: 1.8, life: 1.4, vy: 0.4, up: 0.5, jit: 2, a: 0.4 }); } break;
      case 'skid': P(e.x, e.y + 0.1); fx.sparks(_v.x, _v.y, _v.z, { n: 6, speed: 3, down: true }); fx.dust(_v.x, _v.y, _v.z, { n: 2, s0: 0.4, s1: 1.4, life: 1, a: 0.35 }); break;
      case 'coresink': P(e.x, 0, 0); fx.splash(_v.x, 0, _v.z, 0.5); break;
      case 'spawn': P(e.x, e.y + 1); fx.sparks(_v.x, _v.y, _v.z, { n: 24, speed: 6, r: 0.6, g: 0.9, b: 1 }); this.ring3(e.x, e.y + 0.1, 2.5, 0x9fe8ff); break;
      case 'pickup': P(e.x, e.y); fx.sparks(_v.x, _v.y, _v.z, { n: 20, speed: 6, r: 0.8, g: 1, b: 0.9 }); this.ring3(e.x, e.y, 2, POWERUPS[e.kind].color); break;
      case 'breach': P(e.x, 0, 0); fx.splash(_v.x, 0, _v.z, 2.5); this.trauma = Math.min(1, this.trauma + 0.4); break;
      case 'summon': P(e.x, e.y + 2); fx.flash(_v.x, _v.y, _v.z, 20, this.look.accent, 0.4); break;
      default: break;
    }
  }
  // boss kill finale: a long white-gold flash, accent shockwaves and a chain of big blasts timed on the WORLD clock
  // (W.t), so pause, slow-mo and hit-stop hold them (they used real-time setTimeout before). No new lights: fx.flash uses the pool.
  bossFinale(e, W) {
    const B = W.boss, fx = this.fx, x = B ? B.x : e.x, y = B ? Math.max(B.y, 1) : (e.y || 8), acc = this.look.accent, dr = this.bossLaneAt(B, null, x);
    toWorld(x, y, _v, dr); fx.explode(_v.x, _v.y, _v.z, 3.4, { metal: true }); fx.flash(_v.x, _v.y, _v.z, 90, 0xfff0d0, 0.6);
    fx.sparks(_v.x, _v.y, _v.z, { n: 60, speed: 14, r: 1, g: 0.85, b: 0.55 });
    this.shock(x, y, 1.8); this.ring3(x, Math.max(0.3, y - 1), 7, acc); this.trauma = Math.min(1, this.trauma + 0.7);
    this.flashScreen(0.85, 0xfff4e0, 0.75);
    this.booms = (this.booms || []).filter((b) => b.W === W);
    const t0 = W.t;
    for (let i = 0; i < 6; i++) this.booms.push({ W, at: t0 + 0.18 + i * 0.24, x: x + (Math.random() - 0.5) * 7, y: y + (Math.random() - 0.3) * 4, s: 2.4 + i * 0.25, last: i === 5, dr });
  }
  syncBooms(W) {
    if (!this.booms || !this.booms.length) return;
    const fx = this.fx;
    this.booms = this.booms.filter((b) => {
      if (b.W !== W) return false;   // another world is drawn now (a new scene, an instant replay): drop them
      if (W.t < b.at) return true;
      toWorld(b.x, b.y, _v, b.dr || 0); fx.explode(_v.x, _v.y, _v.z, b.s, { metal: true }); fx.flash(_v.x, _v.y, _v.z, 50, this.look.accent, 0.35);
      this.trauma = Math.min(1, this.trauma + 0.45); this.shock(b.x, b.y, b.last ? 1.6 : 0.8);
      if (b.last) { this.ring3(b.x, Math.max(0.3, b.y - 1), 9, this.look.accent); this.flashScreen(0.6, this.look.accent, 1.2); }
      return false;
    });
  }
  // a short white flash when the sim sets a fresh hitT (clang, lost duel, weak point struck): the view's meshes swap to one
  // glow material for 0.09 s (MeshBasic like every glow part = an already warmed program, nothing compiles)
  hitFlash(V, h, dt, min = 0) {
    const fresh = V.hitP !== undefined && h > V.hitP + 0.01 && h >= min; V.hitP = h;
    if (fresh) V.flashT = CALM.on ? 0.05 : 0.09;
    V.flashT = Math.max(0, (V.flashT || 0) - dt);
    this.flashView(V.v, V.flashT > 0);
  }
  flashView(v, on) {   // the state lives on the model (v) so a ghost (unhorsed, tumbling) can be put back
    if (on === !!v.flashOn) return;
    v.flashOn = on;
    // instanced / skinned / morphing meshes would need their own variant of the glow program (a runtime compile): never swapped
    // (the jousters' skinned meshes take a twin of the flash material, compiled in the warm-up)
    if (!v.mats) { v.mats = []; v.g.traverse((o) => { if (o.isMesh && !o.isInstancedMesh && !o.isBatchedMesh && !o.morphTargetInfluences) v.mats.push([o, o.material]); }); }
    const fm = MD.glow(0xfff2dc, CALM.on ? 0.8 : 1.2);
    if (!this.flashSk) this.flashSk = new Map();
    if (!this.flashSk.has(fm)) this.flashSk.set(fm, fm.clone());
    const fs = this.flashSk.get(fm);
    for (const [o, m] of v.mats) o.material = on ? (o.isSkinnedMesh ? fs : fm) : m;
  }
  // live boss weak points: a pulsing camera-facing ring round each one that can be struck now (own small pool, the same
  // additive MeshBasic program as the sea rings)
  markWeak(W, t) {
    if (!this.wpMarks) {
      const g = new THREE.RingGeometry(0.88, 1, 36);
      this.wpMarks = [];
      for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false })); m.visible = false; m.renderOrder = 4; m.frustumCulled = false; this.scene.add(m); this.wpMarks.push(m); }
    }
    const B = W.boss; let n = 0;
    if (B && B.st === 'fight' && B.pts) for (const q of B.pts) {
      if (n >= this.wpMarks.length) break;
      if (!(q.hp > 0 && q.on)) continue;
      const [x, y] = weakPos(B, q);
      if (y < -0.4) continue;
      const m = this.wpMarks[n++], pu = 0.5 + 0.5 * Math.sin(t * 6 + q.i);
      toWorld(x, y, m.position, 1.4 + this.bossLaneAt(B, q.seg));
      m.quaternion.copy(this.camera.quaternion);
      m.scale.setScalar(clamp(q.r || 0.8, 0.55, 1.1) * (1.05 + pu * 0.3));
      m.material.color.set(this.look.accent).multiplyScalar(0.3 + pu * 0.6);
      m.visible = true;
    }
    if (this.wpMarks) for (let i = n; i < this.wpMarks.length; i++) this.wpMarks[i].visible = false;
  }
  // how far behind the ring the boss (or the Leviathan coil nearest x, or segment seg) is drawn
  bossLaneAt(B, seg, x) {
    const V = this.bossV;
    if (!B || !V || V.key !== B.key) return 0;
    if (!V.segLane) return V.lane || 0;
    if (seg !== null && seg !== undefined) return V.segLane[seg] || 0;
    if (x === undefined) return 0;
    let bi = 0, bd = 1e9;
    B.seg.forEach((s, i) => { const d = Math.abs(((s.x - x + F.C * 1.5) % F.C) - F.C / 2); if (d < bd) { bd = d; bi = i; } });
    return V.segLane[bi] || 0;
  }
  ring3(x, y, r, color) { toWorld(x, y, _v, 0.8); this.fx.ring(_v.x, _v.y, _v.z, r, color); }

  // ---------------------------------------------------------------- camera
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
  frameShot(pts, dur) { this.shot = { pts, t: dur }; }
  // o: { focus: [{x, y}], cine, shake, snap }
  updateCamera(dt, o = {}) {
    const tall = this.portrait;
    let th, cy, dist, fov, speed = 3;
    if (o.cine) {
      this.camTh += dt * 0.05;
      th = this.camTh; cy = 13 + Math.sin(this.time * 0.07) * 3; dist = 44; fov = tall ? 62 : 42; speed = 1.5;
    } else if (this.shot && this.shot.t > 0) {
      this.shot.t -= dt;
      let sx = 0, sy = 0; const p0 = this.shot.pts[0];
      for (const p of this.shot.pts) { sx += ((p[0] - p0[0] + F.C * 1.5) % F.C) - F.C / 2; sy += p[1]; }
      th = (p0[0] + sx / this.shot.pts.length) / RR; cy = sy / this.shot.pts.length; dist = 17; fov = tall ? 58 : 38; speed = 5;
    } else {
      const f = o.focus && o.focus.length ? o.focus : [{ x: this.camTh * RR, y: 12 }];
      const p0 = f[0];
      let mx = 0, my = 0, spread = 0;
      for (const p of f) { const d = ((p.x - p0.x + F.C * 1.5) % F.C) - F.C / 2; mx += d; my += p.y; spread = Math.max(spread, Math.abs(d)); }
      mx /= f.length; my /= f.length;
      th = (p0.x + mx) / RR;
      cy = clamp(my * 0.75 + 4.5, 9.5, 19);   // follow high riders up so they never hide under the HUD
      dist = (tall ? 29 : 29) + Math.max(0, spread - 8) * 1.1;
      fov = tall ? 62 : 42;
      speed = 4;
    }
    // shortest way round
    let d = th - this.camTh; d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    const k = o.snap ? 1 : 1 - Math.exp(-dt * speed);
    if (o.snap) { this.camTh += d; this.camY = cy; this.camD = dist; this.cv = [0, 0, 0]; }
    else {
      // a critically damped follow: it gathers speed and settles smoothly (a plain exponential lurches as a target starts
      // moving); the height follows slower so the camera does not bob with every wing beat
      const cv = this.cv || (this.cv = [0, 0, 0]), T = 1.15 / speed;
      const sd = (cur, tgt, i, t) => { const w = 2 / t, x = w * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x), ch = cur - tgt, tmp = (cv[i] + w * ch) * dt; cv[i] = (cv[i] - w * tmp) * e; return tgt + (ch + tmp) * e; };
      this.camTh = sd(this.camTh, this.camTh + d, 0, T);
      this.camY = sd(this.camY, cy, 1, T * 1.8);
      this.camD = sd(this.camD, dist, 2, T * 1.5);
    }
    this.camFov += (fov - this.camFov) * k;
    const s = Math.sin(this.camTh), c = Math.cos(this.camTh);
    this.camPos.set(s * (RR + this.camD), this.camY + 5.2, c * (RR + this.camD));
    this.camLook.set(s * (RR - 3), this.camY, c * (RR - 3));
    this.trauma = Math.max(0, this.trauma - dt * 1.7);
    const sh = (this.trauma * this.trauma * 0.45 + this.trauma * 0.22) * (o.shake ?? 1);   // linear term: small hits (clang, unhorse) still move the frame a few px
    const cam = this.camera;
    cam.position.copy(this.camPos);
    if (sh > 0) { cam.position.x += (Math.random() - 0.5) * sh; cam.position.y += (Math.random() - 0.5) * sh; cam.position.z += (Math.random() - 0.5) * sh; }
    cam.up.set(0, 1, 0);
    cam.lookAt(this.camLook);
    if (cam.fov !== this.camFov) { cam.fov = this.camFov; cam.updateProjectionMatrix(); }
    this.sky.position.copy(cam.position);
    // the shadow camera follows the focus point
    const L = this.look.sunDir;
    this.key.target.position.copy(this.camLook);
    this.key.position.set(this.camLook.x + L[0] * 60, this.camLook.y + Math.max(0.35, L[1]) * 60, this.camLook.z + L[2] * 60);
  }
  project(x, y, out) {
    toWorld(x, y, _v).project(this.camera);
    out.x = (_v.x * 0.5 + 0.5) * innerWidth; out.y = (-_v.y * 0.5 + 0.5) * innerHeight; out.z = _v.z;
    return out;
  }
  shock(x, y, k = 1) { this.shocks.push({ x, y, t: 0, max: 0.55, k }); if (this.shocks.length > 6) this.shocks.shift(); }
  flashScreen(a, color = 0xffffff, decay = 3) { const w = a * (CALM.on ? 0.25 : 0.55); if (w >= this.flash.w) this.flashK = decay; _c.set(color); this.flash.set(_c.r, _c.g, _c.b, Math.max(this.flash.w, w)); }

  render(dt, p = {}) {
    this.time += dt;
    const t = this.time;
    this.fx.update(dt);
    this.skyMat.uniforms.uTime.value = t;
    this.seaMat.uniforms.uTime.value = t;
    const fl = this.skyMat.uniforms.uFlash.value * Math.exp(-dt * 6);
    this.skyMat.uniforms.uFlash.value = fl; this.seaMat.uniforms.uFlash.value = fl;
    this.hemi.intensity = this.look.hemi[2] + fl * 1.5;
    this.spire.rotation.y = t * 0.01;
    // portrait: the spire sits straight behind the play slice, so it stands slimmer and further back there (play reads; the set piece stays)
    const sk = this.portrait ? 0.5 : 1; this.spire.scale.set(sk, 1, sk); this.spire.position.y = this.portrait ? -1.5 : 0;
    // ambient particles near the camera's view of the ring
    const ax = this.camTh * RR + (Math.random() - 0.5) * 50, ay = Math.random() * 26;
    if (Math.random() < dt * 16) {
      toWorld(ax, ay, _v, (Math.random() - 0.5) * 8);
      if (this.amb === 'embers' || this.amb === 'sparks') this.fx.sparks(_v.x, this.amb === 'sparks' ? 0.5 : _v.y, _v.z, { n: 1, speed: 1, vy: 2.5, s: 0.14, life: 3, g: 0.55, b: 0.2 });
      else if (this.amb === 'snow') this.fx.dust(_v.x, _v.y, _v.z, { n: 1, s0: 0.12, s1: 0.16, life: 4, vy: -1.2, up: 0, jit: 0.6, a: 0.8, k: 1.6, grav: 0.05, drag: 0.2 });
      else if (this.amb === 'spores') this.fx.sparks(_v.x, _v.y, _v.z, { n: 1, speed: 0.4, vy: 0.4, s: 0.12, life: 4, r: 0.3, g: 1, b: 0.85 });
      else this.fx.dust(_v.x, _v.y, _v.z, { n: 1, s0: 0.15, s1: 0.25, life: 4, vy: -0.4, up: 0, jit: 0.4, a: 0.5, k: 0.4, grav: 0.02, drag: 0.2 });
    }
    for (const c of this.cols) if (c.visible) c.material.uniforms.uTime.value = t;
    this.halo.rotation.z = t * 0.2;
    if ((p.sea || 0) > 0.15 && Math.random() < dt * 36 * p.sea) {   // spray off the swell under a rider dropping toward it
      toWorld(p.seaX + (Math.random() - 0.5) * 1.6, 0.1, _v, (Math.random() - 0.5) * 0.8);
      this.fx.splash(_v.x, 0, _v.z, 0.25 + p.sea * 0.35);
    }
    this.flash.w = Math.max(0, this.flash.w - dt * (this.flashK || 3)); this.hurtT = Math.max(0, (this.hurtT || 0) - dt * 1.4);
    const shocks = [];
    for (const s of this.shocks) {
      s.t += dt;
      const f = s.t / s.max;
      if (f >= 1) continue;
      this.project(s.x, s.y, P0);
      shocks.push(new THREE.Vector4(P0.x / innerWidth, 1 - P0.y / innerHeight, f * 0.3 * s.k, (1 - f) * (CALM.on ? 0.3 : 0.7) * s.k));
    }
    this.shocks = this.shocks.filter((s) => s.t < s.max);
    const L = this.look;
    this.post.render(this.scene, this.camera, {
      bloom: L.bloom * (p.bloom ?? 1), threshold: 1.1, exposure: L.exposure * (p.exposure ?? 1), chroma: 0.0016 + (p.slow ? 0.003 : 0), time: t, desat: (p.desat || 0) + (p.slow ? 0.25 : 0), fade: p.fade || 0, vignette: (p.slow ? 0.6 : 0.42) + (this.hurtT || 0) * (CALM.on ? 0.1 : 0.3) + (p.sea || 0) * (CALM.on ? 0.15 : 0.4),
      flash: this.flash, tint: p.slow ? _tint.set(L.grade[0] * 0.95, L.grade[1] * 0.92, L.grade[2] * 1.15) : _tint.set(L.grade[0] * (1 + (p.sea || 0) * 0.22), L.grade[1] * (1 - (p.sea || 0) * 0.14), L.grade[2] * (1 - (p.sea || 0) * 0.16)), shocks, lens: [],
    });
  }

  // draw one of everything once at boot so nothing compiles a shader in the middle of play
  async warmUp() {
    const tmp = [];
    const addTmp = (g, x) => { toWorld(x, 10, g.position); this.scene.add(g); tmp.push(g); };
    // the jousters are skinned: they stand close together inside the sun's shadow camera (aimed at them first), so
    // their skinned shadow programs (with and without a texture) compile here and not in the middle of play
    this.updateCamera(0, { snap: true, focus: [{ x: 12, y: 10 }] });
    let x = 0, j = 0;
    const addJ = (g) => { toWorld(4 + (j % 8) * 2.4, 6 + Math.floor(j / 8) * 3.5, g.position); this.scene.add(g); tmp.push(g); j++; };
    for (const k of ['skirmisher', 'lancer', 'reaver', 'shieldbearer', 'twinblade', 'stormcaller']) { addJ(MD.lancer(k).g); addJ(MD.lancer(k, { elite: true }).g); }
    addJ(MD.lancer('player', this.suit[0]).g); addJ(MD.lancer('player', this.suit[1]).g);
    const lit = MD.lancer('lancer'); addJ(lit.g); this.flashView(lit, true);
    const faded = MD.lancer('lancer'); addJ(faded.g); this.fadeGhost({ outer: faded.g }, 0.6);   // a ghost fading out
    x = 40;
    addTmp(MD.hunter().g, x += 3); addTmp(MD.core().g, x += 3);
    for (const k in POWERUPS) addTmp(MD.pickup(POWERUPS[k].color).g, x += 2);
    for (const k of Object.keys(BOSSES)) addTmp(MD.boss(k).g, x += 8);
    for (const k in this.shotI) { this.shotI[k].count = 1; this.shotI[k].setMatrixAt(0, _m.identity()); }
    for (const r of this.ribbons.slice(0, 2)) r.set([[0, 5], [3, 8]], 1);
    for (const c of [...this.cols.slice(0, 1), ...this.spouts.slice(0, 1), ...this.rings.slice(0, 1)]) c.visible = true;
    this.fx.explode(...toWorld(2, 8, _v).toArray(), 1, { metal: true });
    this.fx.splash(_v.x, 0, _v.z, 1);
    this.fx.flash(_v.x, 8, _v.z, 1);
    const pr = { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] };
    // 1.9: only the current sector's set is here (the rest: prepareAll); the programs compile in parallel
    // (compileAsync, KHR_parallel_shader_compile) while the page stays responsive, then one drawn frame per look
    // fills in what compile cannot reach (the shadow pass, the post passes)
    const first = this.lookI;
    this.envAny = await this.envForAsync(first); this.scene.environment = this.envAny;
    try { await this.r.compileAsync(this.scene, this.camera); } catch { this.r.compile(this.scene, this.camera); }
    this.envDefer = false;
    this.post.render(this.scene, this.camera, pr);
    for (const k in this.shotI) this.shotI[k].count = 0;
    for (const r of this.ribbons) r.hide();
    for (const c of [...this.cols, ...this.spouts, ...this.rings]) c.visible = false;
    this.flashView(lit, false);
    for (const o of tmp) { this.scene.remove(o); MD.release(o); }
    this.fx.clear();
    void HUNTER; void weakPos;
  }
}
const P0 = { x: 0, y: 0, z: 0 };
const COLOSSUS_LANE = -5.6, LEV_LANE = 4.4;
// is the circle (x, y, r) in any standing ledge's slab or rock?
function inRockR(W, x, y, r) {
  for (const L of W.ledges) {
    if (L.st === 2) continue;
    const d = ((x - L.x + F.C * 1.5) % F.C) - F.C / 2, a = Math.abs(d);
    if (a > L.w + r || y - r > L.y + 0.3 || y + r < L.y - F.ledgeT - rockDrop(L.w, 0)) continue;
    const c = Math.max(0, a - r * 0.7);
    if (c < L.w && y + r * 0.7 > L.y - F.ledgeT - rockDrop(L.w, c)) return true;
  }
  return false;
}

// a ledge: a box bent round the ring, top flat, the underside hanging in a rock point. The point is solid in the
// sim (config.js rockDrop): across the riders' plane it follows that curve to within a few per cent, rough only in
// its surface, and thins away toward the front and back faces
function ledgeGeometry(x0, y0, w, seed) {
  const D = 2.3, T = F.ledgeT;
  const g = new THREE.BoxGeometry(2 * w, 1, 2 * D, Math.max(8, Math.round(w * 4)), 6, 8);
  const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
  const hang = rockHang(w);
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), z = p.getZ(i);
    const y = p.getY(i), ny = n.getY(i), nx = n.getX(i);
    const u = x / w, v = z / D, t = y + 0.5;
    let yy;
    if (y > 0.499) { yy = (Math.abs(u) > 0.92 || Math.abs(v) > 0.9 ? -0.06 * vnoise(x * 3 + seed, 0, z * 3) : 0); }
    else {
      const prof = Math.max(0, 1 - u * u) * Math.pow(Math.max(0, 1 - v * v), 0.9);
      const nz = vnoise(x * 0.7 + seed, z * 0.7, seed * 0.3);
      const bottom = -T - hang * prof * (0.93 + 0.12 * nz);
      yy = bottom + (0 - bottom) * Math.pow(t, 0.9);
      const j = (1 - t) * 0.16 + 0.06;
      x += (vnoise(x * 1.3, y * 3 + seed, z * 1.3) - 0.5) * j * 2;
      z += (vnoise(z * 1.3 + seed, y * 3, x * 1.3) - 0.5) * j * 2;
    }
    // uv in metres (top: floor tiles of TX.TILE metres; sides: rock of ~4 m)
    if (ny > 0.5) uv.setXY(i, (x0 + x) / TX.TILE, z / TX.TILE);
    else if (Math.abs(nx) > 0.5) uv.setXY(i, z / 4, yy / 4);
    else uv.setXY(i, (x0 + x) / 4, yy / 4);
    const th = (x0 + x) / RR, r = RR + z;
    p.setXYZ(i, Math.sin(th) * r, y0 + yy, Math.cos(th) * r);
  }
  g.computeVertexNormals();
  return g;
}
// a distant floating island: a flat-topped rock with a hanging, ragged underside
function islandGeometry(seed) {
  const pts = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(t < 0.15 ? 0.05 + t * 6 : 1 - Math.pow((t - 0.15) / 0.85, 1.4) * 0.97, t < 0.15 ? 0.06 : -Math.pow((t - 0.15) / 0.85, 0.9) * 1.8)); }
  pts.reverse();
  const g = new THREE.LatheGeometry(pts, 18);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 0.75 + vnoise(x * 1.7 + seed, y * 2.1, z * 1.7) * 0.5;
    p.setXYZ(i, x * k, y < 0 ? y * (0.8 + vnoise(x * 3, y + seed, z * 3) * 0.5) : y + vnoise(x * 4, seed, z * 4) * 0.08, z * k);
  }
  g.computeVertexNormals();
  return g;
}
// a thin box bent round the ring (trim)
function arcBox(x0, y0, w, h, d, dr) {
  const g = new THREE.BoxGeometry(2 * w, h, d, Math.max(4, Math.round(w * 2)), 1, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const th = (x0 + x) / RR, r = RR + dr + z; p.setXYZ(i, Math.sin(th) * r, y0 + y, Math.cos(th) * r); }
  g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------- static merging: one draw call per material
// bake each mesh's local transform into a copy of its geometry and concatenate (position, normal, uv)
function mergeGeos(list) {
  let n = 0;
  const parts = list.map(([geo, mat4]) => { const g = (geo.index ? geo.toNonIndexed() : geo.clone()).applyMatrix4(mat4); n += g.attributes.position.count; return g; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  let o = 0;
  for (const g of parts) {
    const c = g.attributes.position.count;
    pos.set(g.attributes.position.array, o * 3);
    if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
    o += c; g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.computeBoundingSphere();
  return out;
}
// merge the single-material meshes directly under a group by material (keeps shadow flags of the first)
function mergeByMaterial(grp) {
  const by = new Map();
  for (const m of [...grp.children]) {
    if (!m.isMesh || m.isInstancedMesh || Array.isArray(m.material) || m.children.length) continue;
    if (!by.has(m.material)) by.set(m.material, []);
    by.get(m.material).push(m);
  }
  for (const [mat, list] of by) {
    if (list.length < 2) continue;
    const geo = mergeGeos(list.map((m) => { m.updateMatrix(); return [m.geometry, m.matrix]; }));
    const mm = new THREE.Mesh(geo, mat); mm.castShadow = list[0].castShadow; mm.receiveShadow = list[0].receiveShadow;
    for (const m of list) grp.remove(m);
    grp.add(mm);
  }
}
// a bent ledge box as two geometries: [rock faces, false] and [the top, true]
function splitTwo(geo) {
  const g = twoGroups(geo), idx = g.index.array, out = [];
  for (const gr of g.groups) { const q = new THREE.BufferGeometry(); for (const k in g.attributes) q.setAttribute(k, g.attributes[k]); q.setIndex(Array.from(idx.subarray(gr.start, gr.start + gr.count))); q.computeBoundingSphere(); out.push([q, gr.materialIndex === 1]); }
  return out;
}
// a box bent into a ledge has 6 face groups: put the rock faces together (1 draw) and the top on its own (1 draw)
function twoGroups(g) {
  const idx = g.index.array, rock = [], top = [];
  for (const gr of g.groups) { const dst = gr.materialIndex === 2 ? top : rock; for (let i = gr.start; i < gr.start + gr.count; i++) dst.push(idx[i]); }
  g.setIndex([...rock, ...top]);
  g.clearGroups(); g.addGroup(0, rock.length, 0); g.addGroup(rock.length, top.length, 1);
  return g;
}
