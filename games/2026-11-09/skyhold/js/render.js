// Skyhold 2026 renderer: a small planet seen side-on. The sim's flat band (x along the ground, y altitude) is
// wrapped round a cylinder of radius RP whose axis is world Z; the camera sits off the planet's side (+Z) and
// rolls with the ship, so the ground curves away at the screen edges. The sun is fixed in the world, so flying
// round the planet takes you from day through sunset into night (stars, aurora, colony lights) and back.
// Five looks (sky, terrain, sea, scenery, bodies in the sky), real 3D models for everything, curved beams,
// warnings drawn in the play plane, HDR post. Nothing here changes the world.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=3';
import * as TX from './textures.js?v=3';
import * as MD from './models.js?v=3';
import { FX, CALM } from './fx.js?v=3';
import { NOISE } from './shaders.js?v=3';
import { F, C, RP, H, ENEMY, BOSSES, POWERUPS, P2_LIVERY, LIVERIES, SETTLER } from './config.js?v=3';
import { wd, wp, nodePos, beamRange } from './sim.js?v=3';

export { CALM };
const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _v4 = new THREE.Vector3(), _v5 = new THREE.Vector3();
const _c = new THREE.Color(), _c2 = new THREE.Color(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _e = new THREE.Euler();
const ZAX = new THREE.Vector3(0, 0, 1);
const VIS = 1.3;   // models are drawn a little larger than their hit boxes so they read at this camera distance

// sim (x, y) at depth z -> world point on the planet (y = altitude above the ground). The planet is a sphere of
// radius RP: x runs round its equator, z is arc length north (+, toward the camera) or south of it
export function toW(x, y, out = new THREE.Vector3(), z = 0) { const th = x / RP, ph = z / RP, r = RP + y, c = Math.cos(ph); return out.set(Math.sin(th) * r * c, Math.cos(th) * r * c, Math.sin(ph) * r); }
const sph = (th, ph, rr, out) => { const c = Math.cos(ph); return out.set(Math.sin(th) * rr * c, Math.cos(th) * rr * c, Math.sin(ph) * rr); };
const tangent = (x, out) => { const th = x / RP; return out.set(Math.cos(th), -Math.sin(th), 0); };
const radial = (x, out) => { const th = x / RP; return out.set(Math.sin(th), Math.cos(th), 0); };

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), msaa: true, bloomLevels: 5, tex: 1024, dust: 2400, sparks: 2600, debris: 220, flashLights: 4, shadow: 2048, terrain: 1, props: 1, clouds: 1, stars: 1 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), msaa: true, bloomLevels: 4, tex: 512, dust: 1400, sparks: 1600, debris: 140, flashLights: 3, shadow: 1024, terrain: 0.7, props: 0.75, clouds: 0.7, stars: 0.8 },
    low: { name: 'low', dpr: 1, msaa: false, bloomLevels: 3, tex: 512, dust: 700, sparks: 900, debris: 70, flashLights: 2, shadow: 0, terrain: 0.5, props: 0.5, clouds: 0.5, stars: 0.6 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ the five worlds
// sky: [day zenith, day horizon, dusk, night zenith, night horizon]; ground: [shore, low, mid, high, peak];
// sea: kind + [shallow, deep, glow]; bodies: things in the sky (fixed to the world, they rise and set as you fly)
export const LOOKS = [
  { key: 'verdant', sky: [0x2f6fcf, 0xa8d4ff, 0xff9050, 0x040916, 0x14284a], sun: 0xfff1d8, sunI: 3.3, moon: 0x9db6ff, moonI: 0.7, hemi: [0x9ac8ff, 0x3a4a2a], fog: [0xa8cdf0, 0x0a1428], fogD: 0.0034,
    ground: [0xd8c690, 0x4f8f3a, 0x3d6e2e, 0x77786a, 0xeef2f6], relief: 'hills', sea: { kind: 'water', c: [0x2aa6b8, 0x06304c, 0x000000] }, props: 'verdant',
    bodies: [{ kind: 'moon', dir: 0.9, el: 0.55, r: 150, c: [0xcfd2d6, 0x8a8e96] }, { kind: 'moon', dir: 2.6, el: 0.35, r: 80, c: [0xd8c6a8, 0x8a7a64] }],
    clouds: 0xffffff, cloudN: 70, exposure: 1.0, bloom: 0.75, grade: [1.02, 1.0, 0.98], aurora: 0, ash: 0, lights: 0xffd890 },
  { key: 'dune', sky: [0x5a86c8, 0xf3cfa0, 0xff6030, 0x0a0614, 0x2a1428], sun: 0xffe2b0, sunI: 3.6, moon: 0xffc8a0, moonI: 0.55, hemi: [0xf0c8a0, 0x6a3a1c], fog: [0xe8b888, 0x140a14], fogD: 0.0038,
    ground: [0xd9a46a, 0xc77b3e, 0xb0602e, 0x7a3e24, 0xe8c49a], relief: 'dunes', sea: { kind: 'none', c: [0, 0, 0] }, props: 'dune', sun2: 1,
    bodies: [{ kind: 'moon', dir: 1.8, el: 0.45, r: 110, c: [0xf0d8c0, 0xa07860] }],
    clouds: 0xffe2c0, cloudN: 18, exposure: 1.0, bloom: 0.8, grade: [1.05, 0.99, 0.93], aurora: 0, ash: 0.2, lights: 0xffc070 },
  { key: 'frost', sky: [0x2a62b8, 0xa8d0f4, 0xff98c0, 0x02040e, 0x0a1a34], sun: 0xeef6ff, sunI: 2.6, moon: 0xa8d8ff, moonI: 0.8, hemi: [0x9cc4ec, 0x40566e], fog: [0x9ec4e8, 0x06122a], fogD: 0.0026,
    ground: [0xc4dcef, 0xe8f2fa, 0xd0e2f2, 0x6f8aa6, 0xffffff], relief: 'spires', sea: { kind: 'ice', c: [0xbfe6ff, 0x3a7aa8, 0x6fd8ff] }, props: 'frost',
    bodies: [{ kind: 'ringed', dir: 1.2, el: 0.5, r: 220, c: [0x9ab8d8, 0x5a7aa0, 0xe8f0ff] }],
    clouds: 0xf4f8ff, cloudN: 40, exposure: 1.0, bloom: 0.85, grade: [0.97, 1.0, 1.05], aurora: 1, ash: 0.15, lights: 0x9fe0ff },
  { key: 'cinder', sky: [0x5a3428, 0xc0683a, 0xff4a18, 0x0a0302, 0x2a0a04], sun: 0xffc090, sunI: 2.8, moon: 0xffa878, moonI: 0.95, hemi: [0xb06a48, 0x2a0c06], fog: [0x8a4a30, 0x1a0804], fogD: 0.0042,
    ground: [0x3a2e2a, 0x54423a, 0x463830, 0x5e4a40, 0x7a6a60], relief: 'jagged', sea: { kind: 'lava', c: [0xff8a2a, 0x3a0800, 0xff5a10] }, props: 'cinder',
    bodies: [{ kind: 'star', dir: 2.2, el: 0.4, r: 260, c: [0xff5a2a, 0xffa060, 0xffe0b0] }],
    clouds: 0x6a5048, cloudN: 30, exposure: 1.05, bloom: 0.95, grade: [1.06, 0.97, 0.92], aurora: 0, ash: 1, lights: 0xff9a40 },
  { key: 'umbra', sky: [0x2a2050, 0x6a5a9a, 0xb06aff, 0x020108, 0x120a28], sun: 0xd8c8ff, sunI: 2.6, moon: 0xb8a0ff, moonI: 0.75, hemi: [0x8070c0, 0x1a1428], fog: [0x4a3a7a, 0x08041a], fogD: 0.0034,
    ground: [0x3a3650, 0x2a2838, 0x342f48, 0x4a4660, 0x8a80b0], relief: 'mesas', sea: { kind: 'water', c: [0x4a3aa0, 0x0a0620, 0x9a70ff] }, props: 'umbra',
    bodies: [{ kind: 'giant', dir: 0.4, el: 0.6, r: 420, c: [0xc8a0ff, 0x6a4ab0, 0xffd2f0] }],
    clouds: 0x8a7ab8, cloudN: 30, exposure: 1.1, bloom: 1.0, grade: [0.98, 0.96, 1.07], aurora: 0.5, ash: 0.3, lights: 0xc8a0ff },
];
// the sun sits over x = 0 (noon there, midnight at C / 2); a little tilted so dawn and dusk are not symmetric
const SUN = new THREE.Vector3(0.18, 1, 0.42).normalize();
const MOON = new THREE.Vector3(-0.3, -1, 0.5).normalize();

// ------------------------------------------------------------------ shaders
const SKY_VERT = /* glsl */ `varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uZen, uHor, uDusk, uNZen, uNHor, uSunC, uUp, uSun, uSun2;
uniform float uDay, uTime, uAurora, uSun2K;
varying vec3 vD;
${NOISE}
void main(){
  vec3 d = normalize(vD);
  float el = dot(d, uUp);                       // elevation above the local horizon
  float day = smoothstep(-0.25, 0.35, uDay);
  float dusk = exp(-pow(uDay * 3.2, 2.0));       // strongest at the terminator
  float h = pow(1.0 - clamp(el, 0.0, 1.0), 6.0);
  vec3 dayC = mix(uZen, uHor, h);
  vec3 nightC = mix(uNZen, uNHor, h);
  vec3 c = mix(nightC, dayC, day);
  float sd = max(dot(d, uSun), 0.0);
  c += uDusk * dusk * h * (0.55 + 1.6 * pow(sd, 4.0));
  // the sun, its glow, and (for twin-sun worlds) a second smaller sun
  c += uSunC * (pow(sd, 900.0) * 40.0 + pow(sd, 18.0) * 0.6 * (0.4 + day)) * smoothstep(-0.1, 0.05, el + 0.06);
  float sd2 = max(dot(d, uSun2), 0.0);
  c += uSunC * uSun2K * (pow(sd2, 1600.0) * 30.0 + pow(sd2, 30.0) * 0.35) * smoothstep(-0.1, 0.05, el + 0.06);
  // stars (fade in at night), one per lit cell
  float night = 1.0 - smoothstep(-0.35, 0.1, uDay);
  vec3 q = d * 380.0; vec3 cell = floor(q); float hs = hash13(cell);
  float st = step(0.985, hs) * smoothstep(0.42, 0.0, length(fract(q) - 0.5)) * (0.4 + 2.2 * hash13(cell + 7.0));
  vec3 q2 = d * 120.0; vec3 cell2 = floor(q2);
  st += step(0.994, hash13(cell2 + 3.0)) * smoothstep(0.35, 0.0, length(fract(q2) - 0.5)) * 3.0;
  float mw = smoothstep(0.55, 0.95, fbm(d * 3.0 + vec3(1.0, 9.0, 4.0))) * 0.25;   // a faint galaxy band
  c += (vec3(st) + vec3(0.6, 0.7, 1.0) * mw) * night * smoothstep(-0.05, 0.25, el);
  // aurora curtains on the night side of an ice world
  if (uAurora > 0.0) {
    float ax = atan(d.x, d.z);
    float band = fbm(vec3(ax * 3.0, el * 2.0 - uTime * 0.05, uTime * 0.03));
    float cur = smoothstep(0.08, 0.5, el) * (1.0 - smoothstep(0.5, 0.95, el)) * smoothstep(0.45, 0.8, band);
    float ray = 0.6 + 0.4 * sin(ax * 90.0 + band * 12.0 + uTime * 0.6);
    c += mix(vec3(0.15, 1.0, 0.55), vec3(0.6, 0.3, 1.0), smoothstep(0.25, 0.7, el)) * cur * ray * night * uAurora * 1.4;
  }
  // under the horizon: the planet's own haze
  c = mix(c, mix(uNHor, uHor, day) * 0.6, smoothstep(0.0, -0.25, el));
  gl_FragColor = vec4(c, 1.0);
}`;
// the sea band: water, lava or an ice sheet; lit by the day factor
const SEA_VERT = /* glsl */ `varying vec3 vW; varying vec2 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vP = vec2(atan(w.x, w.y) * ${RP.toFixed(3)}, asin(clamp(w.z / length(w.xyz), -1.0, 1.0)) * ${RP.toFixed(3)}); gl_Position = projectionMatrix * viewMatrix * w; }`;
const SEA_FRAG = /* glsl */ `
uniform vec3 uA, uB, uG, uSky, uSunC, uSun, uFog; uniform float uKind, uTime, uDay, uFogD;
varying vec3 vW; varying vec2 vP;
${NOISE}
void main(){
  vec3 up = normalize(vW);
  vec3 V = normalize(cameraPosition - vW);
  float day = smoothstep(-0.25, 0.35, uDay);
  vec2 p = vP;
  vec3 c;
  if (uKind < 1.5) {
    // water: two scrolling ripple layers tilt the normal; fresnel mixes in the sky, a glint for the sun
    float n1 = fbm(vW * 0.11 + vec3(uTime * 0.06, 0.0, uTime * 0.05));
    float n2 = fbm(vW * 0.37 + vec3(3.0, -uTime * 0.1, uTime * 0.08));
    vec3 tan = normalize(cross(up, vec3(0.0, 0.0, 1.0)));
    vec3 bit = normalize(cross(tan, up));
    vec3 N = normalize(up + tan * (n1 - 0.5) * 0.35 + bit * (n2 - 0.5) * 0.35);
    float fr = pow(1.0 - max(dot(N, V), 0.0), 4.0);
    c = mix(uB, uA, 0.35 + 0.4 * n1) * (0.25 + 0.75 * day);
    c = mix(c, uSky, fr * 0.8);
    vec3 R = reflect(-V, N);
    c += uSunC * pow(max(dot(R, uSun), 0.0), 220.0) * 6.0 * smoothstep(-0.05, 0.2, uDay);
    c += uG * (0.25 + 0.75 * n2) * 0.35;
  } else if (uKind < 2.5) {
    // lava: cooling crust over glowing channels
    float n = fbm(vW * 0.08 + vec3(0.0, 0.0, uTime * 0.04));
    float m = fbm(vW * 0.3 + vec3(n * 2.0, n * 2.0, uTime * 0.07));
    float glow = smoothstep(0.42, 0.72, m);
    c = mix(uB * 0.4, uA * 3.5, glow) + uG * pow(glow, 3.0) * 4.0;
    c *= 0.85 + 0.15 * sin(uTime * 2.0 + n * 8.0);
  } else {
    // an ice sheet: pale, cracked, glittering
    float n = fbm(vW * 0.2 + vec3(1.0));
    float cr = 1.0 - smoothstep(0.0, 0.03, abs(fbm(vW * 0.6 + vec3(4.0)) - 0.5));
    c = mix(uB, uA, n) * (0.3 + 0.7 * day) + uG * cr * (0.3 + 0.7 * (1.0 - day)) * 0.6;
    float fr = pow(1.0 - max(dot(up, V), 0.0), 3.0);
    c = mix(c, uSky, fr * 0.5);
    c += uSunC * step(0.996, hash13(floor(vW * 6.0))) * day * 2.0;
  }
  float dist = length(cameraPosition - vW);
  float f = 1.0 - exp(-pow(dist * uFogD, 2.0));
  gl_FragColor = vec4(mix(c, uFog, f), 1.0);
}`;
// glowing ribbons in the play plane: beams, bolt trails, aim lines, tractor beams, warnings
const RIB_VERT = /* glsl */ `attribute vec2 aUv; attribute float aW; varying vec2 vUv; void main(){ vUv = aUv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const RIB_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uDash, uTime, uSoft, uHead;
varying vec2 vUv;
void main(){
  float across = clamp(1.0 - abs(vUv.y * 2.0 - 1.0), 0.0, 1.0);
  float core = pow(across, 10.0) * 1.6 + pow(across, uSoft) * 0.7;
  float a = core;
  if (uDash > 0.0) a *= step(0.45, fract(vUv.x * uDash - uTime * 3.0));
  a *= mix(1.0, smoothstep(0.0, 0.85, vUv.x), uHead);
  gl_FragColor = vec4(uColor * a * uK, 1.0);
}`;
// a fresnel bubble (shields, warp-ins)
const BUBBLE_VERT = /* glsl */ `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const BUBBLE_FRAG = /* glsl */ `uniform vec3 uColor; uniform float uK, uTime; varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4); float s = 0.75 + 0.25 * sin(uTime * 9.0 + vN.y * 12.0); gl_FragColor = vec4(uColor * f * s * uK, 1.0); }`;
// a body in the sky: lit by the real sun direction so it shows phases as you fly round
const BODY_VERT = /* glsl */ 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }';
const BODY_FRAG = /* glsl */ `uniform vec3 uA, uB, uC, uSun; uniform float uKind, uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  vec3 n = normalize(vN); float d = dot(n, uSun);
  float lit = smoothstep(-0.1, 0.5, d);
  vec3 p = normalize(vP);
  vec3 alb;
  if (uKind < 0.5) { float cr = fbm(p * 6.0); float cr2 = smoothstep(0.55, 0.62, fbm(p * 14.0 + 3.0)); alb = mix(uB, uA, cr) * (1.0 - cr2 * 0.35); }
  else if (uKind < 1.5) { float b = sin(p.y * 22.0 + fbm(p * 3.0) * 6.0); alb = mix(uA, uB, 0.5 + 0.5 * b); alb = mix(alb, uC, smoothstep(0.6, 1.0, fbm(p * 5.0 + uTime * 0.01))); }
  else { float n2 = fbm(p * 4.0 + vec3(uTime * 0.02)); gl_FragColor = vec4(mix(uA, uC, n2) * 2.5 * (0.7 + 0.5 * pow(abs(dot(n, vV)), 0.5)), 1.0); return; }
  float rim = pow(clamp(1.0 - dot(n, vV), 0.0, 1.0), 2.5);
  vec3 c = alb * (0.03 + lit * 1.4) + uC * rim * 0.5 * smoothstep(-0.3, 0.4, d);
  gl_FragColor = vec4(c, 1.0);
}`;

// ------------------------------------------------------------------ value noise for the terrain (render side only)
function hash3(x, y, z) { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const L = (a, b, t) => a + (b - a) * t, c = (i, j, k) => hash3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
function fbm(x, y, z, o = 4) { let a = 0.5, s = 0; for (let i = 0; i < o; i++) { s += a * vnoise(x, y, z); x = x * 2.03 + 1.7; y = y * 2.03 + 9.2; z = z * 2.03 + 3.1; a *= 0.5; } return s; }
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ground height at angle th (radians round the planet) and depth z (+ toward the camera); periodic round the planet
function groundH(L, th, z) {
  const px = Math.sin(th) * RP * 0.05, py = Math.cos(th) * RP * 0.05, pz = z * 0.05;
  const n = fbm(px, py, pz, 4);
  if (z > 1.2) {
    // the near strip falls away toward the camera into the sea (or the lava, or the ice)
    const k = z - 1.2;
    return Math.max(-3.2, -0.25 - k * 0.32 - k * k * 0.01) + (n - 0.5) * 1.4 * Math.min(1, k / 4);
  }
  const walk = (n - 0.5) * 0.25;
  if (z > -3.5) return walk;
  const t = clamp((-z - 6) / 110, 0, 1), amp = 1.6 + 30 * Math.pow(t, 1.15);
  let h;
  const m = fbm(px * 0.35 + 5, py * 0.35, pz * 0.4, 5);
  switch (L.relief) {
    case 'dunes': { const ridge = Math.abs(Math.sin(th * 260 + m * 6 + z * 0.08)); h = amp * (0.25 * m + 0.25 * ridge * ridge) + (m > 0.62 ? (m - 0.62) * amp * 2.2 : 0); break; }
    case 'spires': { const r = 1 - Math.abs(m * 2 - 1); h = amp * (0.3 * m + Math.pow(r, 4) * 0.9); break; }
    case 'jagged': { const r = 1 - Math.abs(m * 2 - 1); h = amp * (0.15 + Math.pow(r, 2.2) * 0.85) - (n > 0.6 ? 6 * t : 0); break; }
    case 'mesas': { const q = sstep(0.46, 0.52, m); h = amp * (0.15 * n + q * 0.55) + (q > 0.5 ? (n - 0.5) * 2 : 0); break; }
    default: { const r = 1 - Math.abs(m * 2 - 1); h = amp * (0.35 * m + 0.6 * r * r * m); }
  }
  return walk + h * sstep(-3.5, -14, z) - sstep(-4, -9, z) * (L.relief === 'hills' && n < 0.38 ? 2.2 : 0);
}

// ------------------------------------------------------------------ a ribbon of quads in the play plane
class Ribbon {
  constructor(scene, n, color, o = {}) {
    this.n = n;
    const pos = new Float32Array((n + 1) * 2 * 3), uv = new Float32Array((n + 1) * 2 * 2), idx = [];
    for (let i = 0; i <= n; i++) { uv.set([i / n, 0, i / n, 1], i * 4); if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('aUv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    this.mat = new THREE.ShaderMaterial({ vertexShader: RIB_VERT, fragmentShader: RIB_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(color) }, uK: { value: 1 }, uDash: { value: 0 }, uTime: { value: 0 }, uSoft: { value: o.soft ?? 2 }, uHead: { value: 0 } } });
    this.m = new THREE.Mesh(g, this.mat);
    this.m.frustumCulled = false; this.m.renderOrder = 5; this.m.visible = false;
    scene.add(this.m);
    this.used = false;
  }
  // pts: [[x, y], ...] in sim coords (any spacing); w: width (number, or a function of 0..1 along it); z: depth
  set(pts, w, z = 0.3) {
    const P = this.m.geometry.attributes.position, A = P.array, n = this.n;
    // cumulative length along the polyline (wrap-aware)
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(wd(pts[i][0] - pts[i - 1][0]), pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1] || 1;
    let j = 0;
    for (let i = 0; i <= n; i++) {
      const s = (i / n) * tot;
      while (j < pts.length - 2 && L[j + 1] < s) j++;
      const seg = (L[j + 1] - L[j]) || 1, f = clamp((s - L[j]) / seg, 0, 1);
      const a = pts[j], b = pts[Math.min(pts.length - 1, j + 1)];
      const x = a[0] + wd(b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
      toW(x, y, _v, z);
      // across the ribbon: the in-plane normal of its direction
      const dx = wd(b[0] - a[0]), dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      tangent(x, _v2).multiplyScalar(dx / l); radial(x, _v3).multiplyScalar(dy / l); _v2.add(_v3);   // along
      _v3.crossVectors(ZAX, _v2).normalize();
      const ww = (typeof w === 'function' ? w(i / n) : w) * 0.5;
      A[i * 6] = _v.x - _v3.x * ww; A[i * 6 + 1] = _v.y - _v3.y * ww; A[i * 6 + 2] = z;
      A[i * 6 + 3] = _v.x + _v3.x * ww; A[i * 6 + 4] = _v.y + _v3.y * ww; A[i * 6 + 5] = z;
    }
    P.needsUpdate = true;
    this.m.visible = true; this.used = true;
    return this;
  }
  hide() { this.m.visible = false; this.used = false; }
}

// ------------------------------------------------------------------ the renderer
export class Renderer {
  constructor(canvas, q) {
    this.q = q;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(q.dpr);
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    if (q.shadow) { r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; }
    this.r = r;
    this.scale = 1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.5, 9000);
    this.post = new Post(r, q);
    this.post.comp.uniforms.uGrain.value = 0.006;
    this.T = TX.sprites();
    this.pm = new THREE.PMREMGenerator(r);
    this.envs = [];
    MD.materials(null, TX.grimeTex(), TX.stripeTex(), TX.panelNormal(q.tex >= 1024 ? 512 : 256), q.name === 'high');
    this.livery = LIVERIES[0];
    this.time = 0; this.trauma = 0; this.day = 1;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.shocks = [];
    this.lookI = -1; this.look = LOOKS[0];
    this.camLift = 4; this.lookLift = -1.5; this.needH = H + 15; this.cyK = 0.6; this.cx = 0; this.cy = 18; this.lead = 0; this.leadV = 0; this.zoom = 1; this.cvx = 0;
    this.shot = null; this.intent = null;
    this.fx = new FX(this.scene, this.T, { dust: q.dust, sparks: q.sparks, debris: q.debris, flashLights: q.flashLights }, () => -1e9);
    this.fx.planet = { R: RP, g: 14 };
    this.fx.onLand = (d) => { if (this.sfx) this.sfx('debris', d); };
    this.lights();
    this.buildSky();
    this.terrains = []; this.seas = []; this.propSets = []; this.cloudSets = []; this.lightSets = [];
    this.views = { p: new Map(), e: new Map(), s: new Map(), pods: new Map() };
    this.pools = {};
    this.pieces = [];
    this.bossV = null;
    this.ribbons = [];
    for (let i = 0; i < 40; i++) this.ribbons.push(new Ribbon(this.scene, 16, 0xffffff));
    this.makeProjectiles();
    this.makeMarks();
    this.trails = new Map();
    this.colony = null; this.colonyKey = '';
    this.resize();
    addEventListener('resize', () => this.resize());
    this.setLook(0);
  }

  // ---------------------------------------------------------------- lights, sky
  lights() {
    // one key light that is the sun by day and the moon by night (they cross over at the terminator, where both are dim)
    const k = new THREE.DirectionalLight(0xffffff, 3);
    this.scene.add(k, k.target);
    this.key = k;
    if (this.q.shadow) {
      k.castShadow = true;
      k.shadow.mapSize.set(this.q.shadow, this.q.shadow);
      const sc = k.shadow.camera; sc.left = -70; sc.right = 70; sc.top = 45; sc.bottom = -45; sc.near = 1; sc.far = 420;
      k.shadow.bias = -0.0006; k.shadow.normalBias = 0.05;
    }
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.6);
    this.scene.add(this.hemi);
    // FIXED light pools: the number of lights never changes after boot (no shader rebuilds mid-play)
    this.shipLights = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.PointLight(0xfff0dc, 0, 24, 1.6); this.scene.add(l); this.shipLights.push(l); }
    this.beamLight = new THREE.PointLight(0xff6a50, 0, 30, 1.5); this.scene.add(this.beamLight);
    this.bossLight = new THREE.PointLight(0xff8a40, 0, 70, 1.4); this.scene.add(this.bossLight);
  }
  buildSky() {
    const u = { uZen: new THREE.Color(), uHor: new THREE.Color(), uDusk: new THREE.Color(), uNZen: new THREE.Color(), uNHor: new THREE.Color(), uSunC: new THREE.Color(),
      uUp: new THREE.Vector3(0, 1, 0), uSun: SUN.clone(), uSun2: new THREE.Vector3(), uDay: 1, uTime: 0, uAurora: 0, uSun2K: 0 };
    const uniforms = {}; for (const k in u) uniforms[k] = { value: u[k] };
    this.skyMat = new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, uniforms });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(6000, 48, 24), this.skyMat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -10;
    this.scene.add(this.sky);
    this.scene.fog = new THREE.FogExp2(0x88aacc, 0.003);
    this.bodies = [];
  }
  bodyMat(b) {
    const kind = b.kind === 'moon' ? 0 : b.kind === 'star' ? 2 : 1;
    return new THREE.ShaderMaterial({ vertexShader: BODY_VERT, fragmentShader: BODY_FRAG, fog: false,
      uniforms: { uA: { value: hdr(b.c[0], 1) }, uB: { value: hdr(b.c[1], 1) }, uC: { value: hdr(b.c[2] ?? b.c[0], 1) }, uSun: { value: SUN }, uKind: { value: kind }, uTime: { value: 0 } } });
  }
  makeBodies(i) {
    const L = LOOKS[i], list = [];
    for (const b of L.bodies) {
      const g = new THREE.Group();
      const s = new THREE.Mesh(new THREE.SphereGeometry(b.r, 48, 32), this.bodyMat(b));
      g.add(s);
      if (b.kind === 'ringed' || b.kind === 'giant') {
        const r0 = b.r * 1.35, r1 = b.r * 2.3;
        const rg = new THREE.RingGeometry(r0, r1, 160, 1), uv = rg.attributes.uv, P = rg.attributes.position;
        for (let k = 0; k < P.count; k++) { const rr = Math.hypot(P.getX(k), P.getY(k)); uv.setXY(k, (rr - r0) / (r1 - r0), 0.5); }
        const ring = new THREE.Mesh(rg, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
          uniforms: { uC: { value: hdr(b.c[2], 1.0) } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: `uniform vec3 uC; varying vec2 vUv; ${NOISE} void main(){ float x = vUv.x; float b = 0.55 + 0.45 * sin(x * 60.0) * sin(x * 23.0 + 1.0); float gap = smoothstep(0.42, 0.45, x) * (1.0 - smoothstep(0.5, 0.53, x)); float a = (b * 0.7 + 0.3) * (1.0 - gap * 0.9) * smoothstep(0.0, 0.05, x) * (1.0 - smoothstep(0.92, 1.0, x)); gl_FragColor = vec4(uC * a * 0.8, a * 0.8); }` }));
        ring.rotation.set(1.2, 0.3, 0.2); g.add(ring);
      }
      if (b.kind === 'star') {
        const cor = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: hdr(b.c[1], 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
        cor.scale.set(b.r * 4.5, b.r * 4.5, 1); g.add(cor);
      }
      // fixed in the world: direction round the planet (dir, radians), how far up out of the play plane (el)
      const D = 4200;
      g.position.set(Math.sin(b.dir) * D * Math.cos(b.el), Math.cos(b.dir) * D * Math.cos(b.el), -D * Math.sin(b.el));
      g.traverse((o) => { o.renderOrder = -6; o.frustumCulled = false; });
      g.visible = false;
      this.scene.add(g);
      list.push(g);
    }
    return list;
  }
  envFor(i) {
    if (this.envs[i]) return this.envs[i];
    const L = LOOKS[i], s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { a: { value: new THREE.Color(L.sky[1]) }, b: { value: new THREE.Color(L.sky[0]) }, c: { value: new THREE.Color(L.ground[1]).multiplyScalar(0.4) }, sd: { value: new THREE.Vector3(0.3, 0.8, 0.5).normalize() }, sc: { value: hdr(L.sun, 1) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 a,b,c,sd,sc; varying vec3 vP; void main(){ vec3 d = normalize(vP); vec3 col = d.y > 0.0 ? mix(a, b, d.y) : c; col += sc * pow(max(0.0, dot(d, sd)), 10.0) * 3.0; gl_FragColor = vec4(col, 1.0); }' })));
    for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.2), new THREE.MeshBasicMaterial({ color: hdr(L.sky[1], 2.2), side: THREE.DoubleSide }));
      const a = (k / 4) * TAU; m.position.set(Math.cos(a) * 8, 5, Math.sin(a) * 8); m.lookAt(0, 0, 0); s.add(m);
    }
    this.envs[i] = this.pm.fromScene(s, 0.03).texture;
    return this.envs[i];
  }

  // ---------------------------------------------------------------- the planet: terrain, sea, scenery, clouds, lights
  terrain(i) {
    if (this.terrains[i]) return this.terrains[i];
    const L = LOOKS[i];
    const NT = Math.round(1100 * this.q.terrain);
    const ZS = [64, 48, 36, 27, 20, 14, 9.5, 6, 3.6, 2, 1, 0.2, -0.6, -1.6, -2.8, -4.2, -6, -8.5, -11.5, -15, -19.5, -25, -32, -40, -50, -62, -76, -92, -112, -136, -165, -200];
    const NZ = ZS.length;
    const pos = new Float32Array((NT + 1) * NZ * 3), col = new Float32Array((NT + 1) * NZ * 3), hs = new Float32Array((NT + 1) * NZ);
    const G = L.ground.map((c) => new THREE.Color(c));
    for (let a = 0; a <= NT; a++) {
      const th = (a / NT) * TAU;
      for (let j = 0; j < NZ; j++) {
        const z = ZS[j], h = groundH(L, th, z), k = a * NZ + j;
        hs[k] = h;
        sph(th, z / RP, RP + h, _v);
        pos[k * 3] = _v.x; pos[k * 3 + 1] = _v.y; pos[k * 3 + 2] = _v.z;
      }
    }
    // colours from height, slope and a little noise
    for (let a = 0; a <= NT; a++) {
      const th = (a / NT) * TAU;
      for (let j = 0; j < NZ; j++) {
        const k = a * NZ + j, h = hs[k];
        const hn = j < NZ - 1 ? hs[k + 1] : h, dz = Math.abs(ZS[j] - (ZS[j + 1] ?? ZS[j] - 1)) || 1;
        const slope = Math.abs(h - hn) / dz;
        const n = fbm(Math.sin(th) * 40, Math.cos(th) * 40, ZS[j] * 0.2, 3);
        if (h < 0.4) _c.copy(G[0]).lerp(G[1], sstep(-0.2, 0.4, h));
        else if (h < 9) _c.copy(G[1]).lerp(G[2], sstep(0.4, 9, h + (n - 0.5) * 4));
        else if (h < 30) _c.copy(G[2]).lerp(G[3], sstep(9, 30, h + (n - 0.5) * 8));
        else _c.copy(G[3]).lerp(G[4], sstep(30, 44, h + (n - 0.5) * 10));
        _c.lerp(G[3], clamp(slope * 0.8, 0, 0.7));
        _c.multiplyScalar(0.85 + n * 0.3);
        col[k * 3] = _c.r; col[k * 3 + 1] = _c.g; col[k * 3 + 2] = _c.b;
      }
    }
    const idx = [];
    for (let a = 0; a < NT; a++) for (let j = 0; j < NZ - 1; j++) { const k = a * NZ + j, k2 = (a + 1) * NZ + j; idx.push(k, k2, k + 1, k + 1, k2, k2 + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals();
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RP + 120);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: L.key === 'frost' ? 0.55 : 0.92, metalness: 0, map: this.detailTex(), envMapIntensity: 0.4 });
    const m = new THREE.Mesh(g, mat);
    m.receiveShadow = true; m.frustumCulled = false;
    const rest = new THREE.Mesh(new THREE.SphereGeometry(RP - 0.6, 96, 48), new THREE.MeshStandardMaterial({ color: new THREE.Color(L.ground[2]).multiplyScalar(0.7), roughness: 0.95 }));
    rest.frustumCulled = false; m.add(rest);
    m.visible = false;
    this.scene.add(m);
    this.terrains[i] = m;
    return m;
  }
  detailTex() {
    if (this._detail) return this._detail;
    const N = 256, cv = document.createElement('canvas'); cv.width = cv.height = N;
    const g = cv.getContext('2d'), d = g.createImageData(N, N), r = mkr(9);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const v = 200 + (fbm(x / 9, y / 9, 1, 3) - 0.5) * 90 + (r() - 0.5) * 30; const o = (y * N + x) * 4; d.data[o] = d.data[o + 1] = d.data[o + 2] = clamp(v, 0, 255); d.data[o + 3] = 255; }
    g.putImageData(d, 0, 0);
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
    this._detail = t;
    return t;
  }
  sea(i) {
    if (this.seas[i] !== undefined) return this.seas[i];
    const L = LOOKS[i];
    if (L.sea.kind === 'none') { this.seas[i] = null; return null; }
    const kind = L.sea.kind === 'water' ? 1 : L.sea.kind === 'lava' ? 2 : 3;
    const g = new THREE.SphereGeometry(RP - 0.35, Math.round(360 * this.q.terrain), Math.round(180 * this.q.terrain));
    const mat = new THREE.ShaderMaterial({ vertexShader: SEA_VERT, fragmentShader: SEA_FRAG, side: THREE.DoubleSide,
      uniforms: { uA: { value: hdr(L.sea.c[0], 1) }, uB: { value: hdr(L.sea.c[1], 1) }, uG: { value: hdr(L.sea.c[2], 1) }, uSky: { value: new THREE.Color() }, uSunC: { value: new THREE.Color() }, uSun: { value: SUN },
        uFog: { value: new THREE.Color() }, uFogD: { value: L.fogD }, uKind: { value: kind }, uTime: { value: 0 }, uDay: { value: 1 } } });
    const m = new THREE.Mesh(g, mat);
    m.frustumCulled = false; m.visible = false;
    this.scene.add(m);
    this.seas[i] = m;
    return m;
  }
  // instanced scenery round the whole planet (the colony sites are placed per world in setWorld)
  props(i) {
    if (this.propSets[i]) return this.propSets[i];
    const L = LOOKS[i], set = MD.scenery(L.props) || [];
    const r = mkr(31 + i * 17), meshes = [];
    const nature = set.filter((s) => !/dome|tower|hab|pad|mast|antenna|colony|base/i.test(s.kind));
    const pool = nature.length ? nature : set;
    const N = Math.round(520 * this.q.props);
    const per = pool.map(() => []);
    for (let k = 0; k < N; k++) {
      const s = (r() * pool.length) | 0, th = r() * TAU;
      // most behind the walkway, a few on the slope in front
      // a few on the slope in front, the rest behind the walkway; the tall ones well back so the sky stays open
      const z = r() < 0.12 ? 3 + r() * 14 : -9 - Math.pow(r(), 0.8) * 110;
      // small near the walkway (the fight happens in front of them), bigger and hazier further back
      const sc = (z > -25 ? 0.4 + r() * 0.25 : 0.65 + r() * 0.7) * (z < -60 ? 1.5 : 1) * (z > 0 ? 0.6 : 1);
      per[s].push([th, z, sc, r() * TAU]);
    }
    pool.forEach((p, s) => {
      const list = per[s]; if (!list.length) return;
      const mk = (geo, mat) => {
        const I = new THREE.InstancedMesh(geo, mat, list.length);
        list.forEach(([th, z, sc, rot], k) => { this.propMatrix(L, th, z, sc, rot, _m); I.setMatrixAt(k, _m); });
        I.castShadow = true; I.receiveShadow = true; I.frustumCulled = false; I.visible = false;
        this.scene.add(I); meshes.push(I);
        return I;
      };
      mk(p.geo, p.mat);
      if (p.glowGeo) { const I = mk(p.glowGeo, p.glowMat); I.castShadow = false; I.userData.glow = true; }
    });
    this.propSets[i] = meshes;
    return meshes;
  }
  propMatrix(L, th, z, sc, rot, out) {
    const h = groundH(L, th, z) - 0.15 * sc;
    sph(th, z / RP, RP + h, _v);
    _v2.copy(_v).normalize();                          // up
    _q.setFromUnitVectors(_v3.set(0, 1, 0), _v2);
    _q.multiply(new THREE.Quaternion().setFromAxisAngle(_v3, rot));
    _s.setScalar(sc);
    return out.compose(_v, _q, _s);
  }
  clouds(i) {
    if (this.cloudSets[i]) return this.cloudSets[i];
    const L = LOOKS[i], n = Math.round(L.cloudN * this.q.clouds), r = mkr(77 + i);
    const g = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({ map: this.T.soft, color: L.clouds, transparent: true, opacity: 0.38, depthWrite: false, fog: true });
    const I = new THREE.InstancedMesh(g, mat, Math.max(1, n));
    I.count = n;
    for (let k = 0; k < n; k++) {
      const th = r() * TAU, z = -30 - r() * 160, alt = 40 + r() * 70, w = 18 + r() * 40;
      sph(th, z / RP, RP + alt, _v);
      _q.setFromAxisAngle(ZAX, -th);
      _s.set(w, w * (0.22 + r() * 0.18), 1);
      _m.compose(_v, _q, _s);
      I.setMatrixAt(k, _m);
    }
    I.frustumCulled = false; I.renderOrder = -3; I.visible = false;
    this.scene.add(I);
    this.cloudSets[i] = I;
    return I;
  }
  // far-off colony and city lights scattered on the hills: they come on at night
  cityLights(i) {
    if (this.lightSets[i]) return this.lightSets[i];
    const L = LOOKS[i], n = Math.round(1400 * this.q.props), r = mkr(5 + i * 3);
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    let k = 0;
    for (let c = 0; c < 60 && k < n; c++) {
      const th0 = r() * TAU, z0 = -10 - r() * 120, m = 10 + (r() * 30) | 0;
      for (let q = 0; q < m && k < n; q++) {
        const th = th0 + (r() - 0.5) * 0.04, z = z0 + (r() - 0.5) * 14, h = groundH(L, th, z) + 0.4;
        sph(th, z / RP, RP + h, _v); pos[k * 3] = _v.x; pos[k * 3 + 1] = _v.y; pos[k * 3 + 2] = _v.z;
        _c.set(L.lights).multiplyScalar(0.6 + r() * 1.4); col[k * 3] = _c.r; col[k * 3 + 1] = _c.g; col[k * 3 + 2] = _c.b; k++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, k * 3), 3)); g.setAttribute('color', new THREE.BufferAttribute(col.subarray(0, k * 3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    const m = new THREE.PointsMaterial({ size: 1.6, map: this.T.glow, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const p = new THREE.Points(g, m); p.frustumCulled = false; p.visible = false;
    this.scene.add(p);
    this.lightSets[i] = p;
    return p;
  }
  // the colony for this world: domes and buildings at the sim's sites
  setWorld(W) {
    const key = W.k + ':' + W.sites.map((s) => s.toFixed(1)).join(',');
    if (key === this.colonyKey) return;
    this.colonyKey = key;
    if (this.colony) { for (const m of this.colony) { this.scene.remove(m); } }
    this.colony = [];
    const L = LOOKS[W.k], set = (MD.scenery(L.props) || []).filter((s) => /dome|tower|hab|pad|mast|antenna|colony|base/i.test(s.kind));
    if (!set.length) return;
    const r = mkr(W.seed + 3), place = set.map(() => []);
    for (const site of W.sites) {
      const n = 4 + ((r() * 3) | 0);
      for (let k = 0; k < n; k++) {
        const s = (r() * set.length) | 0;
        place[s].push([(site + (r() - 0.5) * 26) / RP, -4.5 - r() * 9, 0.85 + r() * 0.4, r() * 0.5 - 0.25]);
      }
    }
    set.forEach((p, s) => {
      const list = place[s]; if (!list.length) return;
      const mk = (geo, mat, glow) => {
        const I = new THREE.InstancedMesh(geo, mat, list.length);
        list.forEach(([th, z, sc, rot], k) => { this.propMatrix(L, th, z, sc, rot, _m); I.setMatrixAt(k, _m); });
        I.castShadow = !glow; I.receiveShadow = !glow; I.frustumCulled = false; I.userData.glow = glow;
        this.scene.add(I); this.colony.push(I);
      };
      mk(p.geo, p.mat, false);
      if (p.glowGeo) mk(p.glowGeo, p.glowMat, true);
    });
  }
  setLook(i) {
    if (i === this.lookI) return;
    this.lookI = i; const L = this.look = LOOKS[i];
    this.scene.environment = this.envFor(i);
    MD.setEnv && MD.setEnv(this.scene.environment);
    for (const [k, list] of [[this.terrains], [this.seas], [this.propSets], [this.cloudSets], [this.lightSets]].map((a) => [0, a[0]])) { void k; list.forEach((m, j) => { if (!m) return; if (Array.isArray(m)) for (const x of m) x.visible = j === i; else m.visible = j === i; }); }
    this.terrain(i).visible = true;
    const s = this.sea(i); if (s) s.visible = true;
    for (const p of this.props(i)) p.visible = true;
    this.clouds(i).visible = true;
    this.cityLights(i).visible = true;
    for (const b of this.bodies) b.visible = false;
    if (!this.bodySets) this.bodySets = [];
    if (!this.bodySets[i]) this.bodySets[i] = this.makeBodies(i);
    for (const set of this.bodySets) if (set) for (const b of set) b.visible = set === this.bodySets[i];
    const u = this.skyMat.uniforms;
    u.uZen.value.set(L.sky[0]); u.uHor.value.set(L.sky[1]); u.uDusk.value.set(L.sky[2]).multiplyScalar(0.9); u.uNZen.value.set(L.sky[3]); u.uNHor.value.set(L.sky[4]);
    u.uSunC.value.set(L.sun); u.uAurora.value = L.aurora; u.uSun2K.value = L.sun2 ? 1 : 0;
    u.uSun2.value.set(0.45, 0.85, 0.3).normalize();
    this.fx.setLook({ dust: L.key === 'cinder' ? 0x4a3a34 : L.key === 'dune' ? 0xc89a70 : 0x9a9690, dustLight: 1.1 });
  }

  // ---------------------------------------------------------------- projectiles, marks
  makeProjectiles() {
    const boltGeo = new THREE.SphereGeometry(0.32, 10, 8);
    this.boltI = new THREE.InstancedMesh(boltGeo, new THREE.MeshBasicMaterial({ color: hdr(0xff5a3a, 6), toneMapped: false }), 120);
    this.boltGlowI = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.T.glow, color: hdr(0xff6a40, 2.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 120);
    for (const I of [this.boltI, this.boltGlowI]) { I.count = 0; I.frustumCulled = false; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); I.renderOrder = 6; this.scene.add(I); }
    this.shieldMat = new THREE.ShaderMaterial({ vertexShader: BUBBLE_VERT, fragmentShader: BUBBLE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uColor: { value: hdr(0x7fd8ff, 2) }, uK: { value: 0 }, uTime: { value: 0 } } });
    this.shields = [];
    for (let i = 0; i < 2; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), this.shieldMat.clone()); m.visible = false; m.renderOrder = 7; this.scene.add(m); this.shields.push(m); }
    // warp-in gates: a shimmering disc that opens where a machine is arriving
    this.gateMat = new THREE.ShaderMaterial({ vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uColor; uniform float uK, uTime, uF; varying vec2 vUv; ${NOISE}
        void main(){ vec2 p = vUv * 2.0 - 1.0; float r = length(p); float a = atan(p.y, p.x);
          float sw = fbm(vec3(a * 2.0 + uTime * 2.0, r * 5.0 - uTime * 3.0, 1.0));
          float ring = smoothstep(0.05, 0.0, abs(r - (0.55 + 0.35 * uF))) * 1.5;
          float fill = smoothstep(1.0, 0.2, r) * sw * uF;
          gl_FragColor = vec4(uColor * (ring + fill) * uK, 1.0); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uColor: { value: new THREE.Color() }, uK: { value: 1 }, uTime: { value: 0 }, uF: { value: 0 } } });
    this.gates = [];
    for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.gateMat.clone()); m.visible = false; m.renderOrder = 4; this.scene.add(m); this.gates.push(m); }
    this.icons = new Map();
    // the nova: a fresnel shell of light that sweeps out across the screen
    this.novaMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), this.shieldMat.clone());
    this.novaMesh.material.uniforms.uColor.value = hdr(0xffd8a8, 3); this.novaMesh.visible = false; this.novaMesh.renderOrder = 8; this.scene.add(this.novaMesh);
    this.novaT = 0;
    // shooting stars on the night side
    this.meteors = [];
  }
  novaWave(x, y) { toW(x, y, this.novaMesh.position, 0); this.novaT = 0.01; this.novaMesh.visible = true; }
  makeMarks() {
    // the autopilot's target reticle (a ring facing the camera)
    this.reticle = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.75, 40), new THREE.MeshBasicMaterial({ color: hdr(0x52ffd8, 2.5), transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false }));
    this.reticle.visible = false; this.reticle.renderOrder = 8; this.scene.add(this.reticle);
  }
  takeRibbon() { for (const r of this.ribbons) if (!r.used) { r.used = true; return r; } return null; }
  iconFor(kind) {
    if (this.icons.has(kind)) return this.icons.get(kind);
    const P = POWERUPS[kind], cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const g = cv.getContext('2d'); g.fillStyle = '#' + P.color.toString(16).padStart(6, '0'); g.font = 'bold 44px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(P.glyph, 32, 34);
    const t = new THREE.CanvasTexture(cv);
    const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, color: hdr(0xffffff, 2) });
    this.icons.set(kind, m);
    return m;
  }

  // ---------------------------------------------------------------- placing models on the planet
  // place a model at sim (x, y) depth z, turned phi from facing +x along the ground (0) to facing back (PI). It
  // swings round through facing the camera; past halfway it is mirrored so its detailed side faces the camera.
  placeTurn(outer, x, y, phi, z = 0, s = 1) {
    tangent(x, _v); radial(x, _v2);
    const c = Math.cos(phi), sn = Math.sin(phi);
    _v4.copy(_v).multiplyScalar(c).addScaledVector(ZAX, sn);        // the nose
    _v5.copy(ZAX).multiplyScalar(c).addScaledVector(_v, -sn);       // its +z side
    if (phi > Math.PI / 2) _v5.negate();
    _m.makeBasis(_v4.multiplyScalar(s), _v2.multiplyScalar(s), _v5.multiplyScalar(s));
    toW(x, y, _v3, z);
    _m.setPosition(_v3);
    outer.matrix.copy(_m);
    outer.matrixWorldNeedsUpdate = true;
  }
  turnSpring(V, face, dt, k = 160, yaw = 0) {
    const phT = face > 0 ? yaw : Math.PI - yaw, st = Math.min(dt, 1 / 30);
    if (V.phi === undefined) { V.phi = phT; V.phiV = 0; }
    V.phiV += ((phT - V.phi) * k - V.phiV * 2 * Math.sqrt(k)) * st;
    V.phi = clamp(V.phi + V.phiV * st, 0, Math.PI);
    return clamp((Math.sin(V.phi) - Math.sin(yaw)) / (1 - Math.sin(yaw)), 0, 1);
  }
  at(x, y, z = 0.4) { return toW(x, y, this._at || (this._at = new THREE.Vector3()), z); }
  // a sim velocity (along the ground, up) as a world vector
  vel(x, vx, vy, out = this._vel || (this._vel = new THREE.Vector3())) { tangent(x, _v); radial(x, _v2); return out.copy(_v).multiplyScalar(vx).addScaledVector(_v2, vy); }

  pool(key, make) {
    const P = this.pools[key] || (this.pools[key] = []);
    for (const v of P) if (!v.used) { v.used = true; v.outer.visible = true; return v; }
    const v = make(); v.used = true;
    const outer = new THREE.Group(); outer.matrixAutoUpdate = false; outer.add(v.g); v.outer = outer;
    v.g.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
    this.scene.add(outer);
    P.push(v);
    return v;
  }
  release(v) { v.used = false; v.outer.visible = false; v.phi = undefined; }
  playerView(p) {
    let v = this.views.p.get(p.id);
    if (!v) {
      const L = p.id === 1 ? this.livery : P2_LIVERY;
      const m = MD.ship(L.color, L.accent);
      const outer = new THREE.Group(); outer.matrixAutoUpdate = false; outer.add(m.g);
      m.g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      this.scene.add(outer);
      v = { ...m, outer, hurt: 0, bank: 0, pitch: 0, roll: 0, trail: [[], []], ph: 0 };
      this.views.p.set(p.id, v);
    }
    return v;
  }
  setLivery(L) {
    this.livery = L;
    const v = this.views.p.get(1);
    if (v) { this.scene.remove(v.outer); this.views.p.delete(1); }
  }
  enemyView(e) {
    let v = this.views.e.get(e.id);
    if (v && v.type !== e.type) { this.breakView(v, { soft: true }); this.release(v); this.views.e.delete(e.id); v = null; }
    if (!v) {
      v = this.pool(e.type, () => { const m = MD[e.type](); return { ...m, type: e.type }; });
      v.hit = 0; v.born = 1;
      this.views.e.set(e.id, v);
    }
    return v;
  }
  cheer(id) { const v = this.views.s.get(id); if (v) v.cheer = 2.2; }
  settlerView(s) {
    let v = this.views.s.get(s.id);
    if (!v) {
      const col = [0xf2f2f2, 0xffb347, 0x8fd8ff, 0xc8ff8a][s.id % 4];
      v = this.pool('settler' + (s.id % 4), () => MD.settler(col));
      v.fade = 1;
      this.views.s.set(s.id, v);
    }
    return v;
  }
  podView(q) {
    let v = this.views.pods.get(q.id);
    if (!v) {
      v = this.pool('pod:' + q.kind, () => { const m = MD.pod(POWERUPS[q.kind].color); const icon = new THREE.Sprite(this.iconFor(q.kind)); icon.scale.setScalar(1.3); icon.position.set(0, 1.4, 0.4); m.g.add(icon); return m; });
      this.views.pods.set(q.id, v);
    }
    return v;
  }

  // ---------------------------------------------------------------- break-apart: a machine flies to pieces, the pieces fall and land
  breakView(v, o = {}) {
    if (!v || !v.outer) return;
    v.outer.updateMatrixWorld(true);
    const parts = [];
    v.g.traverse((m) => { if (m.isMesh && m.geometry && parts.length < (o.max || 5)) parts.push(m); });
    for (const m of parts) {
      const c = m.clone();
      m.getWorldPosition(_v); m.getWorldQuaternion(_q); m.getWorldScale(_s);
      c.position.copy(_v); c.quaternion.copy(_q); c.scale.copy(_s);
      this.scene.add(c);
      const up = _v2.set(_v.x, _v.y, 0).normalize();
      const sp = (o.power || 1) * (o.soft ? 2 : 6);
      this.pieces.push({ o: c, vx: up.x * sp * Math.random() + (Math.random() - 0.5) * sp + (o.vx || 0), vy: up.y * sp * Math.random() + (Math.random() - 0.5) * sp + (o.vy || 0), vz: (Math.random() - 0.2) * sp * 0.6,
        wx: (Math.random() - 0.5) * 8, wy: (Math.random() - 0.5) * 8, t: 0, life: 5 + Math.random() * 2, rest: false, smoke: Math.random() < 0.7 });
    }
    while (this.pieces.length > this.q.debris * 0.4) { const P = this.pieces.shift(); this.scene.remove(P.o); }
  }
  breakEnemy(id, o) { const v = this.views.e.get(id); if (v) { this.breakView(v, o); this.release(v); this.views.e.delete(id); } }
  breakPlayer(pid, o) { const v = this.views.p.get(pid); if (v) this.breakView(v, { ...o, max: 7 }); }
  updatePieces(dt) {
    for (const P of this.pieces) {
      P.t += dt;
      const o = P.o, r = o.position.length() || 1, nx = o.position.x / r, ny = o.position.y / r, nz = o.position.z / r;
      if (!P.rest) {
        P.vx -= nx * 14 * dt; P.vy -= ny * 14 * dt; P.vz -= nz * 14 * dt;
        o.position.x += P.vx * dt; o.position.y += P.vy * dt; o.position.z += P.vz * dt;
        o.rotation.x += P.wx * dt; o.rotation.y += P.wy * dt;
        const th = Math.atan2(o.position.x, o.position.y), gh = RP + Math.max(-0.35, groundH(this.look, th, Math.asin(clamp(nz, -1, 1)) * RP)) + 0.15;
        if (r < gh) {
          const vn = P.vx * nx + P.vy * ny + P.vz * nz;
          o.position.set(nx * gh, ny * gh, nz * gh);
          if (vn < -2.5) { P.vx -= 1.4 * vn * nx; P.vy -= 1.4 * vn * ny; P.vz -= 1.4 * vn * nz; P.vx *= 0.5; P.vy *= 0.5; P.vz *= 0.5; P.wx *= 0.5; P.wy *= 0.5; if (!P.landed) { P.landed = true; if (this.sfx) this.sfx('debris', { x: o.position.x, y: o.position.y, z: o.position.z }); } }
          else { P.rest = true; }
        }
        if (P.smoke && Math.random() < dt * 14) this.fx.fireP.add({ x: o.position.x, y: o.position.y, z: o.position.z, vx: 0, vy: 0, vz: 0, s0: 0.5, s1: 0.1, max: 0.3, a: 0.7, r: 1, g: 0.5, b: 0.2, drag: 1, grav: 0, fade: 0.6 });
      } else if (P.smoke && P.t < P.life - 1 && Math.random() < dt * 3) {
        this.fx.dustP.add({ x: o.position.x, y: o.position.y, z: o.position.z, vx: nx * 0.9, vy: ny * 0.9, vz: nz * 0.9, s0: 0.4, s1: 2.2, max: 2.6, a: 0.25, r: 0.14, g: 0.13, b: 0.13, drag: 0.5, grav: 0, fade: 0.7 });
      }
      if (P.t > P.life - 1) o.scale.multiplyScalar(Math.max(0.9, 1 - dt * 2.5));
    }
    this.pieces = this.pieces.filter((P) => { if (P.t > P.life) { this.scene.remove(P.o); return false; } return true; });
  }

  // ---------------------------------------------------------------- sync the world into the scene
  sync(W, dt) {
    const t = this.time;
    this.W = W;
    this.setWorld(W);
    for (const r of this.ribbons) if (r.used && !r.keep) r.hide();
    // a fallen colony: its lights go out and the sites burn
    if (this.colony) for (const m of this.colony) if (m.userData.glow) m.visible = !W.fallen;
    if (W.fallen && !CALM.on) for (const site of W.sites) {
      if (Math.abs(wd(site - this.cx)) > 90 || Math.random() > dt * 9) continue;
      toW(site + (Math.random() - 0.5) * 22, 0.4, _v, -5 - Math.random() * 8);
      this.fx.fire(_v.x, _v.y, _v.z, { n: 2, s: 1.1, sp: 1.5, jit: 1, life: 0.7 });
      radial(site, _v2);
      this.fx.dustP.add({ x: _v.x, y: _v.y, z: _v.z, vx: _v2.x * 2.2, vy: _v2.y * 2.2, vz: 0, s0: 1, s1: 5, max: 4, a: 0.35, r: 0.1, g: 0.09, b: 0.09, drag: 0.4, grav: 0, fade: 0.7 });
    }
    // ---- players
    const seenP = new Set();
    W.players.forEach((p, i) => {
      const v = this.playerView(p);
      seenP.add(p.id);
      const L = this.shipLights[i];
      if (!p.alive) { v.outer.visible = false; if (L) L.intensity = 0; this.shields[i].visible = false; v.trail = [[], []]; return; }
      const blink = p.inv > 0 && p.inv < F.inv && Math.floor(t * 16) % 2 === 0 && p.inv > F.hitInv * 0.5;
      v.outer.visible = !blink || true;
      // the turn: a quick spring swing through facing the camera, banked
      const tw = this.turnSpring(v, p.face, dt, 420, 0.06);
      v.pitch += (clamp(p.vy * 0.022, -0.45, 0.45) - v.pitch) * Math.min(1, dt * 8);
      v.roll += (clamp(-p.vy * 0.012, -0.25, 0.25) + tw * 0.7 - v.roll) * Math.min(1, dt * 10);
      this.placeTurn(v.outer, p.x, p.y, v.phi, 0, VIS);
      v.g.rotation.set(v.roll, 0, v.pitch, 'YXZ');
      // engines: flame length with thrust and speed
      const thr = clamp(0.25 + p.thrust * 0.75 + Math.abs(p.vx) / F.vmax * 0.3, 0, 1.3);
      if (v.flames) for (const f of v.flames) { f.scale.set(1, 1, 1); f.scale.x = 0.4 + thr * (0.9 + Math.random() * 0.25); }
      if (L) { this.at(p.x - p.face * 2.4, p.y); L.position.copy(this._at); L.color.set(0xffa860); L.intensity = 6 + thr * 18; }
      // shield bubble while invulnerable or just hit
      const sh = this.shields[i];
      const sk = p.hurtT > 0 ? p.hurtT * 2 : p.inv > 0 ? 0.35 + 0.2 * Math.sin(t * 12) : 0;
      sh.visible = sk > 0.02;
      if (sh.visible) { this.at(p.x, p.y, 0); sh.position.copy(this._at); sh.scale.set(3.2, 1.9, 1.9); sh.quaternion.setFromAxisAngle(ZAX, -p.x / RP); sh.material.uniforms.uK.value = sk; sh.material.uniforms.uTime.value = t; }
      // engine trails: two curved ribbons that follow where the nozzles have been
      for (let k = 0; k < 2; k++) {
        const tr = v.trail[k];
        tr.unshift([wp(p.x - p.face * 2.2), p.y + (k ? -0.25 : 0.25)]);
        if (tr.length > 18) tr.pop();
        if (tr.length > 3 && Math.abs(p.vx) > 6) {
          const rb = this.takeRibbon();
          if (rb) { rb.set(tr, (q) => 0.34 * (1 - q), 0.15 - k * 0.3); rb.mat.uniforms.uColor.value.set(0xffa860).multiplyScalar(1.4); rb.mat.uniforms.uK.value = clamp(Math.abs(p.vx) / F.vmax, 0, 1) * (CALM.on ? 0.5 : 0.9); rb.mat.uniforms.uDash.value = 0; rb.mat.uniforms.uHead.value = 0; rb.mat.uniforms.uSoft.value = 2; }
        }
      }
      // no shield left: the ship trails smoke and the odd spark (it is one hit from going down)
      if (p.shield === 0 && Math.random() < dt * 14) {
        this.at(p.x - p.face * 1.4, p.y + 0.2);
        const q = this._at;
        this.fx.dustP.add({ x: q.x, y: q.y, z: q.z, vx: 0, vy: 0, vz: 0, s0: 0.3, s1: 1.6, max: 1.2, a: 0.35, r: 0.12, g: 0.12, b: 0.13, drag: 1, grav: 0, fade: 0.7 });
        if (Math.random() < 0.25) this.fx.sparks(q.x, q.y, q.z, { n: 2, speed: 3, s: 0.15, life: 0.3, r: 1, g: 0.6, b: 0.3 });
      }
    });
    for (const [id, v] of this.views.p) if (!seenP.has(id)) { this.scene.remove(v.outer); this.views.p.delete(id); }
    // ---- machines
    const seen = new Set();
    for (const e of W.enemies) {
      if (e.hp <= 0) continue;
      seen.add(e.id);
      const v = this.enemyView(e);
      const born = e.born > 0;
      const s = (e.type === 'mine' ? 1.2 : VIS) * (born ? 0.2 + 0.8 * clamp(1 - e.born / 1.2, 0, 1) : 1);
      const tw = e.type === 'mine' ? 0 : this.turnSpring(v, e.face || 1, dt, 90, 0.18);
      this.placeTurn(v.outer, e.x, e.y, e.type === 'mine' ? 0.3 : v.phi, 0, s);
      const bob = Math.sin(t * 2.2 + e.id) * 0.06;
      v.g.rotation.set(tw * 0.4 + (e.type === 'lifter' ? 0 : clamp(e.vy * 0.03, -0.4, 0.4)), 0, clamp(-(e.vx || 0) * 0.012 * (e.face || 1), -0.3, 0.3) + bob, 'YXZ');
      if (e.type === 'mine') { v.g.rotation.y = t * 1.5 + e.id; if (v.lamp) v.lamp.visible = Math.floor(t * 4 + e.id) % 2 === 0; }
      if (e.type === 'lifter' && v.legs) { const close = e.st === 'grab' || e.st === 'lift' ? 1 : e.st === 'down' ? 0.5 : 0; v.cl = (v.cl || 0) + (close - (v.cl || 0)) * Math.min(1, dt * 4); v.legs.forEach((g) => { g.rotation.z = v.cl * 0.55; }); }
      if (v.core) { const pulse = 1 + Math.sin(t * 6 + e.id) * 0.12 + (e.tell > 0 ? 0.6 * (0.5 + 0.5 * Math.sin(t * 40)) : 0) + (e.hitT > 0 ? 0.8 : 0); v.core.scale.setScalar(pulse); }
      if (e.type === 'hive' && v.inner) v.inner.rotation.x += dt * 1.2;
      if (e.type === 'sower' && v.bay) v.bay.rotation.z = 0.25 + Math.sin(t * 2 + e.id) * 0.2;
      if (e.type === 'stinger' && v.wings) { const f = Math.sin(t * 40 + e.id) * 0.5; v.wings[0].rotation.x = -f; v.wings[1].rotation.x = f; }
      // warp-in gate
      if (born) this.gate(e.x, e.y, 1 - e.born / 1.8, e.type === 'prowler' ? 0xff4a5a : e.type === 'lifter' ? 0x8dff7a : 0xffb347, 2.6);
      // a machine about to fire: a dashed red line toward the pilot it is aiming at
      if (e.tell > 0) {
        const p = W.players.find((q) => q.alive);
        if (p && Math.abs(wd(p.x - e.x)) < 46) { const rb = this.takeRibbon(); if (rb) { rb.set([[e.x, e.y], [p.x, p.y]], 0.1 + (1 - e.tell / (W.R.warn * 0.6)) * 0.12, 0.25); rb.mat.uniforms.uColor.value.set(0xff3a2a).multiplyScalar(1.6); rb.mat.uniforms.uK.value = 0.5 + 0.5 * Math.sin(t * 30); rb.mat.uniforms.uDash.value = 5; rb.mat.uniforms.uTime.value = t; rb.mat.uniforms.uHead.value = 0; } }
      }
      // tractor beam: a widening cone from the lifter's dish down to its settler
      if (e.type === 'lifter' && (e.st === 'grab' || e.st === 'lift' || e.st === 'down')) {
        const rb = this.takeRibbon();
        if (rb) {
          const k = e.st === 'down' ? 0.25 : e.st === 'grab' ? clamp(e.t / Math.max(0.1, W.R.grabT), 0.3, 1) : 1;
          const bot = e.st === 'lift' ? Math.max(0, e.y - SETTLER.hang - 0.6) : 0;
          rb.set([[e.x, e.y - 0.7], [e.x, bot]], (q) => 0.6 + q * 1.6, -0.2);
          rb.mat.uniforms.uColor.value.set(0x8dff7a).multiplyScalar(1.2); rb.mat.uniforms.uK.value = k * (0.55 + 0.25 * Math.sin(t * 14)); rb.mat.uniforms.uDash.value = 3; rb.mat.uniforms.uTime.value = -t; rb.mat.uniforms.uSoft.value = 1.2; rb.mat.uniforms.uHead.value = 0;
        }
        // motes drifting up the beam
        if (e.st !== 'down' && !CALM.on && Math.random() < dt * 18) { const yy = Math.random() * Math.max(1, e.y - 1); toW(e.x + (Math.random() - 0.5) * (0.6 + yy * 0.08), yy, _v, 0.2); radial(e.x, _v2); this.fx.fireP.add({ x: _v.x, y: _v.y, z: _v.z, vx: _v2.x * 3, vy: _v2.y * 3, vz: 0, s0: 0.22, s1: 0.05, max: 0.7, a: 0.9, r: 0.5, g: 1, b: 0.45, drag: 0.5, grav: 0, fade: 0.5 }); }
      }
    }
    for (const [id, v] of this.views.e) if (!seen.has(id)) { this.release(v); this.views.e.delete(id); }
    // ---- settlers
    const seenS = new Set();
    for (const s of W.settlers) {
      if (s.st === 'dead') continue;
      seenS.add(s.id);
      const v = this.settlerView(s);
      const walking = s.st === 'walk' && s.mark <= 0;
      const dir = s.vx >= 0 ? 1 : -1;
      this.turnSpring(v, s.st === 'walk' ? dir : 1, dt, 60, 0.35);
      this.placeTurn(v.outer, s.x, Math.max(0, s.y), v.phi, 0.8, 1.6);
      const ph = s.t * 7;
      if (v.cheer > 0) v.cheer -= dt;
      const cheering = v.cheer > 0 && s.st === 'walk';
      const sw = walking && !cheering ? Math.sin(ph) * 0.6 : 0;
      const up = s.st === 'held' || s.st === 'fall' || s.st === 'carried';
      if (v.legL) { v.legL.rotation.z = sw + (up ? Math.sin(t * 9 + s.id) * 0.4 : 0); v.legR.rotation.z = -sw + (up ? -Math.sin(t * 9 + s.id) * 0.4 : 0); }
      if (v.armL) {
        const wave = s.mark > 0 || up || cheering ? Math.PI * 0.85 + Math.sin(t * (cheering ? 14 : 10) + s.id) * 0.35 : 0;
        v.armL.rotation.z = -sw * 0.8 + wave; v.armR.rotation.z = sw * 0.8 + (up || cheering ? wave : 0);
      }
      v.g.position.y = cheering ? Math.abs(Math.sin(t * 9 + s.id)) * 0.35 : walking ? Math.abs(Math.cos(ph)) * 0.04 : 0;
      v.g.rotation.z = s.st === 'fall' ? Math.sin(t * 5 + s.id) * 0.25 : 0;
      if (v.lamp) v.lamp.visible = true;
    }
    for (const [id, v] of this.views.s) if (!seenS.has(id)) { this.release(v); this.views.s.delete(id); }
    // ---- pods
    const seenQ = new Set();
    for (const q of W.pods) {
      seenQ.add(q.id);
      const v = this.podView(q);
      this.placeTurn(v.outer, q.x, q.y + Math.sin(t * 2 + q.id) * 0.25, 0.4 + t * 0.8 % TAU, 0.3, 1);
      v.outer.visible = DROP_LIFE - q.t > 3 || Math.floor(t * 6) % 2 === 0;
    }
    for (const [id, v] of this.views.pods) if (!seenQ.has(id)) { this.release(v); this.views.pods.delete(id); }
    // ---- beams
    const range = beamRange(W);
    for (const s of W.shots) {
      const head = Math.min(range, F.beamV * s.t), tail = Math.max(0, F.beamV * s.t - F.beamLen);
      const end = s.done ? (s.hitD ?? head) : Math.min(head, s.hitD ?? head);
      if (end <= tail) continue;
      const rb = this.takeRibbon(); if (!rb) break;
      const pts = []; for (let k = 0; k <= 6; k++) pts.push([wp(s.x0 + s.dir * (tail + (end - tail) * k / 6)), s.y]);
      if (s.dir < 0) pts.reverse();
      rb.set(pts, 0.42, 0.35);
      rb.mat.uniforms.uColor.value.set(W.players.find((q) => q.id === s.pid)?.pw?.twin ? 0x8fe4ff : 0xff6a50).multiplyScalar(2.4);
      rb.mat.uniforms.uK.value = 1.4; rb.mat.uniforms.uDash.value = 0; rb.mat.uniforms.uSoft.value = 3; rb.mat.uniforms.uHead.value = 0;
    }
    // ---- bolts
    let n = 0;
    for (const b of W.bolts) {
      if (n >= 120) break;
      toW(b.x, b.y, _v, 0.3);
      _m.makeTranslation(_v.x, _v.y, _v.z); this.boltI.setMatrixAt(n, _m);
      const s = 1.6 + Math.sin(t * 30 + b.id) * 0.25;
      _q.identity(); _s.set(s, s, 1); _m.compose(_v, _q, _s); this.boltGlowI.setMatrixAt(n, _m);
      n++;
    }
    this.boltI.count = this.boltGlowI.count = n;
    this.boltI.instanceMatrix.needsUpdate = this.boltGlowI.instanceMatrix.needsUpdate = true;
    this.syncBoss(W, dt, t);
    this.syncGates(dt);
    // a tractor link from a gunship to the settler it carries; a red marker over settlers a lifter is going for
    for (const p of W.players) {
      if (!p.alive || !p.carry) continue;
      const s = W.settlers.find((q) => q.id === p.carry);
      if (!s) continue;
      const rb = this.takeRibbon(); if (rb) { rb.set([[p.x, p.y - 0.3], [s.x, s.y + 0.6]], (q) => 0.25 + q * 0.5, 0.6); rb.mat.uniforms.uColor.value.set(0x8dff8a).multiplyScalar(1.4); rb.mat.uniforms.uK.value = 0.6 + 0.3 * Math.sin(t * 12); rb.mat.uniforms.uDash.value = 4; rb.mat.uniforms.uTime.value = -t; rb.mat.uniforms.uHead.value = 0; }
    }
    for (const s of W.settlers) {
      if (s.st !== 'walk' || !(s.mark > 0)) continue;
      this.gate(s.x, 1.3, 0.4 + 0.3 * Math.sin(t * 8), 0xff4a3a, 1.8);
    }
    // shooting stars at night
    if ((this.nightK || 0) > 0.6 && !CALM.on && Math.random() < dt * 0.25 && this.meteors.length < 2) this.meteors.push({ x: this.cx + (Math.random() - 0.5) * 120, y: 60 + Math.random() * 30, vx: (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 40), vy: -18 - Math.random() * 12, t: 0, T: 0.9 + Math.random() * 0.6 });
    this.meteors = this.meteors.filter((m) => {
      m.t += dt; if (m.t > m.T) return false;
      const rb = this.takeRibbon(); if (!rb) return true;
      const hx = m.x + m.vx * m.t, hy = m.y + m.vy * m.t;
      rb.set([[hx - m.vx * 0.18, hy - m.vy * 0.18], [hx, hy]], (q) => 0.06 + q * 0.3, -60);
      rb.mat.uniforms.uColor.value.set(0xe8f0ff).multiplyScalar(2.2); rb.mat.uniforms.uK.value = Math.sin(Math.PI * m.t / m.T); rb.mat.uniforms.uDash.value = 0; rb.mat.uniforms.uHead.value = 1;
      return true;
    });
    if (this.intent && this.intent.t) {
      const T = this.intent.t;
      toW(T.x, T.y, _v, 0.6); this.reticle.position.copy(_v); this.reticle.rotation.z = t * 1.5; this.reticle.visible = true;
      const me = this.intent.me;
      if (me && me.alive) { const rb = this.takeRibbon(); if (rb) { rb.set([[me.x, me.y], [T.x, T.y]], 0.12, 0.5); rb.mat.uniforms.uColor.value.set(0x52ffd8); rb.mat.uniforms.uK.value = 0.7; rb.mat.uniforms.uDash.value = 4; rb.mat.uniforms.uTime.value = t; rb.mat.uniforms.uHead.value = 0; } }
    } else this.reticle.visible = false;
  }
  gate(x, y, f, color, size) {
    const m = this.gates.find((g) => !g.visible);
    if (!m) return;
    toW(x, y, _v, 0.2);
    m.position.copy(_v); m.scale.setScalar(size * (0.6 + 0.6 * clamp(f, 0, 1))); m.rotation.z = -x / RP;
    m.material.uniforms.uColor.value.set(color).multiplyScalar(2); m.material.uniforms.uF.value = clamp(f, 0, 1); m.material.uniforms.uTime.value = this.time; m.material.uniforms.uK.value = CALM.on ? 0.5 : 1;
    m.visible = true; m.userData.used = true;
  }
  syncGates() { for (const g of this.gates) { if (!g.userData.used) g.visible = false; g.userData.used = false; } }

  // the carrier: weak points, the turn, its attack warnings
  syncBoss(W, dt, t) {
    const B = W.boss;
    if (!B) { if (this.bossV) { this.scene.remove(this.bossV.outer); this.bossV = null; } this.bossLight.intensity = 0; return; }
    if (!this.bossV || this.bossV.key !== B.key) {
      if (this.bossV) this.scene.remove(this.bossV.outer);
      const v = MD.boss(B.key), outer = new THREE.Group(); outer.matrixAutoUpdate = false; outer.add(v.g); this.scene.add(outer);
      v.g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      this.bossV = { ...v, outer, key: B.key, len: BOSSES[B.key].len, s0: 1 };
      this.bossRecoil(this.bossV, 0);
    }
    const V = this.bossV;
    this.bossRecoil(V, dt);
    const warp = B.st === 'warp' ? clamp(1 - B.stT / 3.2, 0, 1) : 1;
    const tw = this.turnSpring(V, B.face, dt, 26, 0.18);
    this.placeTurn(V.outer, B.x + (V.rx || 0), B.y + (V.ry || 0), V.phi, -0.5, V.s0 * (0.3 + 0.7 * warp));
    const fl = V.fl || 0, sink = B.st === 'dying' ? (2.6 - B.stT) * 0.15 : 0;
    V.g.rotation.set(tw * 0.3 + fl * 0.15, 0, clamp(B.vy * 0.03, -0.25, 0.25) + fl * 0.2 * (V.fdir || 1) - sink, 'YXZ');
    V.outer.visible = B.st !== 'warp' || Math.random() < 0.3 + warp;
    if (B.st === 'warp') this.gate(B.x, B.y, warp, 0xff6a3a, 16);
    if (V.spin) { const ax = { ark: 'y', reaper: 'x', loom: 'z', throne: 'z' }[B.key] || 'z'; V.spin.rotation[ax] += dt * (0.6 + (B.atk ? 2.5 : 0)); }
    if (V.hatch) { const open = B.atk && (B.atk.kind === 'drop' || B.atk.kind === 'mines') ? 1.3 : 0; V.hatch.rotation.z += (open - V.hatch.rotation.z) * Math.min(1, dt * 4); }
    if (V.nodes) V.nodes.forEach((g, i) => { const n = B.nodes[i]; g.visible = !!n && n.hp > 0; if (n && n.hp > 0) g.scale.setScalar(1 + Math.sin(t * 5 + i) * 0.08 + (B.hitT > 0 ? 0.3 : 0)); });
    // wounds: every destroyed weak point burns and trails smoke; an enraged carrier glows red
    if (B.st !== 'warp' && !CALM.on) B.nodes.forEach((n, i) => {
      if (n.hp > 0 || Math.random() > dt * (B.st === 'dying' ? 30 : 12)) return;
      const [nx, ny] = nodePos(B, i);
      toW(nx, ny, _v, 1.5);
      this.fx.fire(_v.x, _v.y, _v.z, { n: 1, s: 0.9, sp: 0.6, jit: 1, life: 0.5 });
      radial(nx, _v2);
      this.fx.dustP.add({ x: _v.x, y: _v.y, z: _v.z, vx: _v2.x * 2.5 - (B.vx || 0) * 0.3, vy: _v2.y * 2.5, vz: 0, s0: 0.6, s1: 3.6, max: 2.6, a: 0.4, r: 0.1, g: 0.09, b: 0.09, drag: 0.5, grav: 0, fade: 0.7 });
    });
    toW(B.x, B.y - 2, _v, 3); this.bossLight.position.copy(_v);
    this.bossLight.color.set(B.rage ? 0xff3a2a : 0xff8a40); this.bossLight.intensity = B.st === 'fight' ? 40 + Math.sin(t * 3) * 10 : 20;
    // attack warnings
    const a = B.atk;
    if (a && a.t < a.T) {
      const f = a.t / a.T, blink = 0.5 + 0.5 * Math.sin(t * 22);
      if (a.kind === 'sweep') { const rb = this.takeRibbon(); if (rb) { rb.set([[B.x, B.y - 2], [B.x, 0.2]], 0.3 + f * 0.6, 0.5); rb.mat.uniforms.uColor.value.set(0xff4a3a).multiplyScalar(2); rb.mat.uniforms.uK.value = 0.4 + f * blink; rb.mat.uniforms.uDash.value = 5; rb.mat.uniforms.uTime.value = t; rb.mat.uniforms.uHead.value = 0; } }
      if (a.kind === 'rush') { const rb = this.takeRibbon(); if (rb) { const pts = []; for (let k = 0; k <= 8; k++) pts.push([wp(B.x + a.dir * k * 7), a.y]); rb.set(pts, 0.6 + f * 1.2, 0.5); rb.mat.uniforms.uColor.value.set(0xff3a2a).multiplyScalar(2); rb.mat.uniforms.uK.value = 0.35 + f * blink; rb.mat.uniforms.uDash.value = 8; rb.mat.uniforms.uTime.value = t; rb.mat.uniforms.uHead.value = 0; } }
      if (a.kind === 'volley' || a.kind === 'mines' || a.kind === 'drop') this.gate(B.x, B.y - 1, f, a.kind === 'volley' ? 0xff4a3a : a.kind === 'mines' ? 0xffb347 : 0x8dff7a, 6 + f * 4);
    } else if (a && a.kind === 'sweep') {
      const rb = this.takeRibbon(); if (rb) { rb.set([[B.sweepX, B.y - 2], [B.sweepX, 0]], 2.2 + Math.sin(t * 40) * 0.3, 0.5); rb.mat.uniforms.uColor.value.set(this.look.key === 'frost' ? 0x8ae8ff : 0xff7a3a).multiplyScalar(3); rb.mat.uniforms.uK.value = 2.2; rb.mat.uniforms.uDash.value = 0; rb.mat.uniforms.uHead.value = 0; rb.mat.uniforms.uSoft.value = 1.5; }
      if (Math.random() < dt * 30) { toW(B.sweepX, 0.2, _v, 0.5); this.fx.sparks(_v.x, _v.y, _v.z, { n: 3, speed: 6, s: 0.25, life: 0.5, r: 1, g: 0.6, b: 0.3 }); }
    }
  }
  bossKick(e, k) { const V = this.bossV, B = this.W && this.W.boss; if (!V || !B) return; const dir = Math.sign(wd(B.x - e.x)) || 1; V.rvx = (V.rvx || 0) + dir * 5 * k; V.flv = (V.flv || 0) + 10 * k; V.fdir = dir; }
  bossRecoil(V, dt) {
    const s = Math.min(dt, 1 / 30);
    for (const [p, v] of [['rx', 'rvx'], ['ry', 'rvy'], ['fl', 'flv']]) { V[v] = (V[v] || 0) + (-(V[p] || 0) * 150 - (V[v] || 0) * 14) * s; V[p] = (V[p] || 0) + V[v] * s; }
    V.rx = clamp(V.rx, -1.5, 1.5); V.fl = clamp(V.fl, -0.6, 0.9);
  }

  // ---------------------------------------------------------------- camera, day and night
  resize() {
    const w = innerWidth, h = innerHeight;
    if (!w || !h) return;   // a hidden or collapsed window: keep the last good size (a 0 height makes the aspect NaN)
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
  setIntent(t, me) { this.intent = t ? { t, me } : null; }
  // o: { me: player or null, cine, snap, shake, x (fallback centre) }
  updateCamera(dt, o = {}) {
    const c = this.camera, vf = THREE.MathUtils.degToRad(c.fov);
    // the whole sky (ground to ceiling plus room for the HUD) fits the view; a phone held upright pulls back so the
    // view is at least 46 m wide
    const needH = this.needH, Dh = (needH / 2) / Math.tan(vf / 2), Dw = (46 / 2) / (Math.tan(vf / 2) * c.aspect);
    const D = Math.max(Dh, Dw) * (o.cine ? 1.12 : 1);
    const halfW = D * Math.tan(vf / 2) * c.aspect;
    let tx = this.cx, ty = H * this.cyK;
    if (o.cine) { tx = this.cx + dt * 9; }
    else if (this.shot && this.shot.t > 0) { this.shot.t -= dt; tx = this.shot.pts[0][0]; }
    else if (o.me) {
      // the ship sits toward the trailing side so you can see ahead; the lead swings over when you turn round
      const want = o.me.face * halfW * 0.38 + o.me.vx * 0.12;
      const st = Math.min(dt, 1 / 20), w0 = 2.6;
      this.leadV += ((want - this.lead) * w0 * w0 - this.leadV * 2 * w0) * st;
      this.lead += this.leadV * st;
      tx = o.me.x + this.lead;
    }
    const k = o.snap ? 1 : 1 - Math.exp(-dt * 7);
    this.cx = wp(this.cx + wd(tx - this.cx) * k);
    this.cy += (ty - this.cy) * (o.snap ? 1 : 1 - Math.exp(-dt * 2));
    if (o.snap) { this.lead = o.me ? o.me.face * halfW * 0.38 : 0; this.leadV = 0; }
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    const sh = this.trauma * this.trauma * (o.shake ?? 1) * 0.8;
    const th = this.cx / RP;
    radial(this.cx, _v2); tangent(this.cx, _v);
    // a little above the play plane, looking slightly down at the ground band
    // the camera hangs out over the near side of the planet, D metres from the play band and a little above its
    // middle, looking back across it (the ground falls away behind, so ships fight against open sky)
    const sx = sh ? (Math.random() - 0.5) * sh * 2 : 0, sy = sh ? (Math.random() - 0.5) * sh : 0;
    _v4.set(0, 0, 0); toW(this.cx, this.cy, _v4, 0);
    radial(this.cx, _v2);
    c.position.copy(_v4).addScaledVector(ZAX, D).addScaledVector(_v2, this.camLift + sy).addScaledVector(_v, sx);
    toW(this.cx, this.cy + this.lookLift, _v3, 0);
    c.up.copy(_v2);
    c.lookAt(_v3);
    void th;
    this.sky.position.copy(c.position);
    // day and night: how high the sun stands over this spot
    this.day = _v2.dot(SUN);
    const L = this.look, day = sstep(-0.25, 0.35, this.day), dusk = Math.exp(-Math.pow(this.day * 3.2, 2)), night = 1 - sstep(-0.35, 0.1, this.day);
    const u = this.skyMat.uniforms;
    u.uUp.value.copy(_v2); u.uDay.value = this.day;
    // the key light: the sun by day, the moon by night (both fade at the terminator)
    const useSun = this.day > -0.05;
    const kd = useSun ? SUN : MOON;
    const sunK = sstep(-0.05, 0.25, this.day), moonK = sstep(-0.05, -0.3, this.day);
    this.key.intensity = useSun ? L.sunI * sunK : L.moonI * moonK * 2.4;
    _c.set(useSun ? L.sun : L.moon); if (useSun) _c.lerp(_c2.set(L.sky[2]), dusk * 0.55);
    this.key.color.copy(_c);
    toW(this.cx, this.cy, this.key.target.position, -2);
    this.key.position.copy(this.key.target.position).addScaledVector(kd, 180);
    this.hemi.position.copy(_v2);
    this.hemi.color.set(L.hemi[0]).multiplyScalar(0.25 + 0.75 * day).lerp(_c2.set(L.sky[4]), night * 0.6);
    this.hemi.groundColor.set(L.hemi[1]).multiplyScalar(0.3 + 0.7 * day);
    this.hemi.intensity = 0.55 + 0.35 * day + night * 0.85;
    this.scene.environmentIntensity = 0.25 + 0.75 * day;
    _c.set(L.fog[0]).lerp(_c2.set(L.fog[1]), 1 - day).lerp(_c2.set(L.sky[2]), dusk * 0.35);
    this.scene.fog.color.copy(_c); this.scene.fog.density = L.fogD;
    const sea = this.seas[this.lookI];
    if (sea) { const su = sea.material.uniforms; su.uSky.value.set(L.sky[1]).lerp(_c2.set(L.sky[4]), 1 - day); su.uSunC.value.set(L.sun).multiplyScalar(2); su.uFog.value.copy(_c); su.uDay.value = this.day; }
    const cs = this.cloudSets[this.lookI];
    if (cs) cs.material.color.set(L.clouds).multiplyScalar(0.12 + 0.88 * day).lerp(_c2.set(L.sky[2]), dusk * 0.4);
    const cl = this.lightSets[this.lookI];
    if (cl) cl.material.opacity = night * 0.95;
    this.nightK = night; this.dayK = day; this.duskK = dusk;
  }
  // a sim point (x, y) to screen pixels
  project(x, y, out, z = 0) {
    toW(x, y, _v, z).project(this.camera);
    out.x = (_v.x * 0.5 + 0.5) * innerWidth; out.y = (-_v.y * 0.5 + 0.5) * innerHeight; out.z = _v.z;
    return out;
  }
  shock(x, y, k = 1) { this.shocks.push({ x, y, t: 0, max: 0.6, k }); if (this.shocks.length > 6) this.shocks.shift(); }
  flashScreen(a, color = 0xffffff) { _c.set(color); this.flash.set(_c.r, _c.g, _c.b, Math.max(this.flash.w, a * (CALM.on ? 0.25 : 0.55))); }
  addTrauma(k) { this.trauma = Math.min(1, this.trauma + k); }

  render(dt, p = {}) {
    this.time += dt;
    const t = this.time;
    this.fx.update(dt);
    this.updatePieces(dt);
    this.skyMat.uniforms.uTime.value = t;
    const sea = this.seas[this.lookI]; if (sea) sea.material.uniforms.uTime.value = t;
    if (this.bodySets && this.bodySets[this.lookI]) for (const g of this.bodySets[this.lookI]) g.traverse((o) => { if (o.material && o.material.uniforms && o.material.uniforms.uTime) o.material.uniforms.uTime.value = t; });
    for (const r of this.ribbons) if (r.m.visible) r.mat.uniforms.uTime.value = r.mat.uniforms.uTime.value || t;
    // colony windows and ship lamps glow brighter at night
    if (MD.setNight) MD.setNight(this.nightK || 0);
    // ash or dust drifting through the air
    const L = this.look;
    if (L.ash > 0 && !CALM.on && Math.random() < dt * 30 * L.ash) {
      toW(this.cx + (Math.random() - 0.5) * 120, Math.random() * 40, _v, (Math.random() - 0.3) * 30);
      const ash = L.key === 'cinder';
      this.fx.dustP.add({ x: _v.x, y: _v.y, z: _v.z, vx: (Math.random() - 0.5) * 2, vy: -0.5, vz: 0, s0: ash ? 0.12 : 0.08, s1: ash ? 0.12 : 0.08, max: 4, a: ash ? 0.6 : 0.4, r: ash ? 1 : 0.95, g: ash ? 0.45 : 0.9, b: ash ? 0.2 : 0.85, drag: 0.1, grav: 0, fade: 0.5 });
    }
    if (this.novaT > 0) {
      this.novaT += dt;
      const f = this.novaT / 0.7, s = 4 + 52 * Math.pow(Math.min(1, f), 0.6);
      this.novaMesh.scale.setScalar(s); this.novaMesh.material.uniforms.uK.value = Math.max(0, 1 - f) * (CALM.on ? 0.35 : 1); this.novaMesh.material.uniforms.uTime.value = this.time;
      if (f >= 1) { this.novaT = 0; this.novaMesh.visible = false; }
    }
    this.flash.w = Math.max(0, this.flash.w - dt * 3);
    const shocks = [];
    for (const s of this.shocks) {
      s.t += dt;
      const f = s.t / s.max;
      if (f >= 1) continue;
      this.project(s.x, s.y, P0);
      shocks.push(new THREE.Vector4(P0.x / innerWidth, 1 - P0.y / innerHeight, f * 0.35 * s.k, (1 - f) * (CALM.on ? 0.3 : 0.8) * s.k));
    }
    this.shocks = this.shocks.filter((s) => s.t < s.max);
    const night = this.nightK || 0;
    this.post.render(this.scene, this.camera, {
      bloom: L.bloom * (1 + night * 0.35) * (p.bloom ?? 1), threshold: 1.05, exposure: L.exposure * (1 + night * 0.25) * (p.exposure ?? 1), chroma: 0.0012 + (p.chroma || 0), time: t, desat: p.desat || 0, fade: p.fade || 0,
      vignette: 0.42 + (p.vignette || 0), flash: this.flash, tint: _tint.set(...L.grade), shocks, lens: [],
    });
  }

  // compile one of everything for the current world so nothing stalls mid-play on a shader compile
  warmUp() {
    const tmp = [MD.ship(LIVERIES[0].color, LIVERIES[0].accent).g, MD.ship(P2_LIVERY.color, P2_LIVERY.accent).g, MD.settler(0xffffff).g];
    for (const k of Object.keys(ENEMY)) tmp.push(MD[k]().g);
    for (const k of Object.keys(POWERUPS)) tmp.push(MD.pod(POWERUPS[k].color).g);
    for (const k of Object.keys(BOSSES)) tmp.push(MD.boss(k).g);
    // packed close together inside the sun's shadow box, so their shadow (depth) programs compile now too
    tmp.forEach((o, i) => { toW(this.cx - 20 + (i % 14) * 3, 6 + Math.floor(i / 14) * 12, o.position, 0); o.traverse((m) => { if (m.isMesh) m.castShadow = true; }); this.scene.add(o); });
    for (const m of [...this.shields, this.gates[0], this.reticle, this.novaMesh]) { m.visible = true; toW(this.cx, 10, m.position, 0); }
    const rb = this.takeRibbon(); rb.set([[this.cx, 10], [this.cx + 5, 10]], 0.4);
    this.boltI.count = this.boltGlowI.count = 1;
    this.fx.explode(...toW(this.cx, 10, _v).toArray(), 1, { metal: true, rock: true });
    const icon = new THREE.Sprite(this.iconFor('twin')); toW(this.cx, 12, icon.position); this.scene.add(icon); tmp.push(icon);
    return { tmp, rb };
  }
  finishWarm(w) {
    for (const o of w.tmp) this.scene.remove(o);
    for (const m of [...this.shields, this.gates[0], this.reticle, this.novaMesh]) m.visible = false;
    w.rb.hide();
    this.boltI.count = this.boltGlowI.count = 0;
    this.fx.clear();
  }
  async warmUpAsync() {
    const w = this.warmUp();
    this.updateCamera(0.016, { snap: true, cine: true });
    try { if (this.r.compileAsync) await this.r.compileAsync(this.scene, this.camera); else this.r.compile(this.scene, this.camera); } catch { this.r.compile(this.scene, this.camera); }
    const pr = { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] };
    const ki = this.key.intensity; this.key.intensity = Math.max(ki, 0.5);
    this.post.render(this.scene, this.camera, pr);
    this.updateCamera(0.016, { snap: true, me: { x: this.cx, y: 14, face: 1, vx: 0 } });
    this.post.render(this.scene, this.camera, pr);
    this.key.intensity = ki;
    this.finishWarm(w);
  }
  // build the other worlds in idle time (terrain, sea, scenery, clouds, lights, sky bodies, env maps)
  async prepareAll(idle = true) {
    const wait = () => new Promise((res) => (idle && window.requestIdleCallback ? requestIdleCallback(() => res(), { timeout: 400 }) : setTimeout(res, idle ? 30 : 0)));
    for (let i = 0; i < LOOKS.length; i++) {
      if (i === this.lookI) continue;
      for (const f of [() => this.terrain(i), () => this.sea(i), () => this.props(i), () => this.clouds(i), () => this.cityLights(i), () => this.envFor(i), () => { if (!this.bodySets) this.bodySets = []; if (!this.bodySets[i]) this.bodySets[i] = this.makeBodies(i); }]) { f(); await wait(); }
      // compile what this world uses while it is hidden
      const show = [this.terrains[i], this.seas[i], ...this.propSets[i], this.cloudSets[i], this.lightSets[i], ...this.bodySets[i]].filter(Boolean);
      const was = show.map((m) => m.visible);
      show.forEach((m) => { m.visible = true; });
      try { if (this.r.compileAsync) await this.r.compileAsync(this.scene, this.camera); } catch { /* compiled on first use */ }
      show.forEach((m, k) => { m.visible = was[k]; });
      await wait();
    }
    this.ready = true;
  }
  get prepared() { return !!this.ready; }
}
const DROP_LIFE = 14;
const P0 = { x: 0, y: 0, z: 0 };
const _tint = new THREE.Vector3();
void C;
