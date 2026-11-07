// Voltmaze renderer: one facility room at a time in real 3D, seen from a steep three-quarter camera that
// fits the whole room to the screen (turned on its side on portrait phones). Five sector looks, each with
// its own floor material, light rig, haze and scenery outside the walls; electrified barriers drawn as
// live energy fields between pylons; the infiltrator's flashlight throws real shadows; every robot, the
// Seeker and the bosses animated from the simulation; floor decals for every telegraph; HDR post.
// Fixed light pools (only intensities change) and a warm-up that compiles everything at load.
// Nothing here changes the world.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=7';
import * as TX from './textures.js?v=7';
import * as MD from './models.js?v=7';
import { FX, CALM } from './fx.js?v=7';
import { F, ROOM, ENEMY, BOSSES, POWERUPS, ATTACK, PW_KEYS, SEEKER, BURST_A } from './config.js?v=7';
import { WK, inZone, beamLen } from './sim.js?v=7';

export { CALM };
const { RW, RH, wallT: WT, door: DOOR } = ROOM;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hdr = MD.hdr;
const _v = new THREE.Vector3(), _c = new THREE.Color(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler(), _tint = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
function angD(a, b) { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; }
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), shadow: 2048, spotShadow: 1024, msaa: true, bloomLevels: 5, tex: 1024, dust: 1800, sparks: 1600, debris: 200, flashLights: 3, props: 1 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), shadow: 1024, spotShadow: 512, msaa: true, bloomLevels: 4, tex: 1024, dust: 1100, sparks: 1000, debris: 120, flashLights: 2, props: 0.8 },
    low: { name: 'low', dpr: 1, shadow: 1024, spotShadow: 0, msaa: false, bloomLevels: 3, tex: 512, dust: 600, sparks: 500, debris: 60, flashLights: 2, props: 0.55 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ sector looks
export const LOOKS = [
  { key: 'labs', floor: 'labtile', tint: 0xc2c8d0, rough: 0.9, metal: 0.05, outer: 0x4a5058, wall: 0xdfe4ea, base: 0x3a4048, field: 0x7fd8ff, seal: 0xff5a3a, accent: 0x7fd8ff,
    fog: 0x10161e, fogD: 0.016, keyC: 0xf4f8ff, keyI: 0.95, keyDir: [-0.35, 1, 0.45], hemi: [0xdfe8ff, 0x22262c, 0.26], fill: 0x9fc8ff, fillI: 0.3, exposure: 1.0, glowI: 1.1, grade: [0.98, 1.0, 1.04],
    haze: 0x9fc0e0, hazeK: 0.05, dust: 0xb0b8c0, dustLight: 1.1, env: [0xffffff, 0x8090a8, 0x1a1e24], bolt: 0xff5a2a, shot: 0x8fe8ff, bloom: 0.75, flash: 0xfff2dc, envK: 0.7, envI: 0.42, depth: 0, shaft: 0xe8f4ff, shaftK: 0.05, up: 0 },
  { key: 'cryo', floor: 'ice', tint: 0xdfeef8, rough: 0.8, metal: 0.4, outer: 0x5a6a78, wall: 0xb8cfdf, base: 0x2a3a48, field: 0x8fe0ff, seal: 0xff5a7a, accent: 0x9fe8ff,
    fog: 0x0a1622, fogD: 0.022, keyC: 0xcfe6ff, keyI: 1.4, keyDir: [0.3, 1, 0.25], hemi: [0x9fc8ff, 0x10202c, 0.55], fill: 0x6fc8ff, fillI: 0.35, exposure: 1.05, grade: [0.93, 1.0, 1.08],
    haze: 0xbfe4ff, hazeK: 0.11, dust: 0xd0e4f0, dustLight: 1.2, env: [0xdff4ff, 0x4a7090, 0x0a141c], bolt: 0xff6a3a, shot: 0x9ff4ff, bloom: 0.8, flash: 0xe8f4ff, envI: 0.7, depth: 7, shaft: 0xbfe8ff, shaftK: 0.06, up: 0 },
  { key: 'foundry', floor: 'plate', tint: 0xffffff, rough: 1, metal: 0.6, outer: 0x2a2420, wall: 0x5a4a3e, base: 0x2a221c, field: 0xffa040, seal: 0xff3a2a, accent: 0xff7a2a,
    fog: 0x1a0d06, fogD: 0.018, keyC: 0xffd2a0, keyI: 1.2, keyDir: [0.4, 1, -0.4], hemi: [0x6a4032, 0x150a05, 0.45], fill: 0xff6a1a, fillI: 0.45, exposure: 1.0, grade: [1.06, 0.98, 0.9],
    haze: 0xff9a50, hazeK: 0.06, dust: 0x5a4a40, dustLight: 1.0, env: [0xff9a4a, 0x3a2418, 0x080504], bolt: 0xff4a9a, shot: 0x8fe8ff, bloom: 0.95, flash: 0xffc890, envI: 0.8, depth: 9, shaft: 0xffb070, shaftK: 0.05, up: 1 },
  { key: 'server', floor: 'panel', tint: 0xffffff, rough: 1, metal: 0.3, outer: 0x101318, wall: 0x232c3a, base: 0x10141a, field: 0x3cc8ff, seal: 0xff4a6a, accent: 0x3cc8ff,
    fog: 0x030812, fogD: 0.02, keyC: 0xb0d0ff, keyI: 1.1, keyDir: [-0.3, 1, 0.3], hemi: [0x40608a, 0x05070a, 0.45], fill: 0x3cb8ff, fillI: 0.5, exposure: 1.2, grade: [0.94, 1.0, 1.07],
    haze: 0x3ca8ff, hazeK: 0.05, dust: 0x5a6070, dustLight: 0.8, env: [0x9fd0ff, 0x1a2a40, 0x020304], bolt: 0xff6a2a, shot: 0xffe08a, bloom: 0.9, flash: 0xcfe8ff, envI: 0.85, depth: 8, shaft: 0x7fc8ff, shaftK: 0.04, up: 0 },
  { key: 'reactor', floor: 'grate', tint: 0xb4bcb8, rough: 1, metal: 0.6, outer: 0x14181a, wall: 0x2c3230, base: 0x141818, field: 0xc4ecff, seal: 0xff4a2a, accent: 0x7dff6a,
    fog: 0x061008, fogD: 0.02, keyC: 0xf0fff4, keyI: 1.0, keyDir: [0.4, 1, 0.3], hemi: [0xa0aaa4, 0x060a06, 0.26], fill: 0x8affb0, fillI: 0.16, exposure: 1.0, grade: [1.0, 1.01, 0.99],
    haze: 0xa8e8bc, hazeK: 0.07, dust: 0x6a7a6a, dustLight: 0.9, env: [0xe0f4e6, 0x2a3a30, 0x020403], bolt: 0xff7a3a, shot: 0x8fe8ff, bloom: 0.95, flash: 0xd8ffd0, envI: 0.5, depth: 10, shaft: 0xb0ffb0, shaftK: 0.055, up: 1 },
];

// ------------------------------------------------------------------ shaders
const INST = /* glsl */ `
#ifdef USE_INSTANCING
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
#else
  vec4 wp = modelMatrix * vec4(position, 1.0);
#endif`;
// an electrified barrier: rising bands, crawling noise and bright edges, in world space so every segment matches
const FIELD_VERT = /* glsl */ `varying vec3 vW; varying vec2 vUv; void main(){ ${INST}
  vW = wp.xyz; vUv = uv; gl_Position = projectionMatrix * viewMatrix * wp; }`;
const FIELD_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime, uK, uTop;
varying vec3 vW; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  float s = vW.x * 1.7 + vW.z * 1.7;
  float y = vW.y;
  float band = pow(0.5 + 0.5 * sin(y * 16.0 - uTime * 7.0 + s * 0.6), 6.0);
  float noise = n(vec2(s * 2.0 + uTime * 1.3, y * 5.0 - uTime * 3.0));
  float bolt = smoothstep(0.92, 1.0, n(vec2(s * 6.0 - uTime * 9.0, y * 2.0 + uTime * 4.0)));
  float top = smoothstep(uTop - 0.06, uTop, y), bot = 1.0 - smoothstep(0.3, 0.45, y);
  float a = (0.18 + band * 0.35 + noise * 0.25 + bolt * 1.4) * (0.65 + 0.35 * sin(uTime * 23.0 + s)) + top * 1.2 + bot * 0.4;
  gl_FragColor = vec4(uColor * a * uK, 1.0);
}`;
// one shader for every telegraph on the floor. kind 0 = disc, 1 = lane, 2 = ring
const DECAL_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// zone decals (molten pools, rings...) are clipped to the platform: nothing hangs out over the depths
const DECALW_VERT = /* glsl */ `varying vec2 vUv; varying vec2 vW; void main(){ vUv = uv; vW = (modelMatrix * vec4(position, 1.0)).xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const DECAL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uProg, uLive, uTime, uKind, uAlpha; uniform vec2 uClip;
varying vec2 vUv; varying vec2 vW;
void main(){
  if (abs(vW.x) > uClip.x || abs(vW.y) > uClip.y) discard;
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float a = 0.0;
  if (uKind < 0.5) {
    if (r > 1.0) discard;
    float edge = smoothstep(0.88, 0.96, r) * (1.0 - smoothstep(0.97, 1.0, r));
    float fill = step(r, uProg) * 0.28 + smoothstep(uProg - 0.05, uProg, r) * step(r, uProg) * 0.7;
    float hatch = step(0.5, fract((p.x + p.y) * 5.0 - uTime * 0.7)) * 0.12;
    a = edge * 0.95 + fill + hatch * (1.0 - uLive);
    if (uLive > 0.5) { float k = 0.6 + 0.4 * sin(r * 13.0 - uTime * 6.0); a = 0.5 + 0.5 * k * (1.0 - r * 0.4) + edge; }
  } else if (uKind < 1.5) {
    float ax = abs(p.x), ay = vUv.y;
    float edge = smoothstep(0.86, 0.95, ax) * (1.0 - smoothstep(0.97, 1.0, ax));
    float chev = step(0.55, fract(ay * 18.0 - abs(p.x) * 1.4 - uTime * 2.5)) * 0.35;
    a = edge * 0.9 + chev * step(ay, max(uProg, uLive)) + 0.06 + uLive * 0.6;
  } else {
    if (r > 1.0) discard;
    float ring = smoothstep(0.8, 0.9, r) * (1.0 - smoothstep(0.93, 1.0, r));
    float sweep = step(fract(atan(p.y, p.x) / 6.2831853 + 0.25), uProg);
    a = ring * (0.35 + 0.65 * sweep) + (1.0 - smoothstep(0.0, 0.9, r)) * uProg * 0.25;
  }
  gl_FragColor = vec4(uColor * a * uAlpha, 1.0);
}`;
// slow drifting mist over the floor
const HAZE_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime, uK; varying vec3 vW;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = vW.xz * 0.12;
  float v = n(p + vec2(uTime * 0.05, uTime * 0.02)) * 0.6 + n(p * 2.7 - vec2(uTime * 0.07, 0.0)) * 0.4;
  float edge = smoothstep(0.0, 6.0, 18.0 - abs(vW.x)) * smoothstep(0.0, 4.0, 12.0 - abs(vW.z));
  gl_FragColor = vec4(uColor * v * uK * (0.4 + 0.6 * edge), 1.0);
}`;
// the flashlight's beam in the haze
const CONE_VERT = /* glsl */ `varying float vL; varying vec3 vN; varying vec3 vV; void main(){ vL = uv.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const CONE_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK; varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  float ln = length(vN), lv = length(vV);
  float f = ln > 1e-5 && lv > 1e-5 ? abs(dot(vN / ln, vV / lv)) : 0.0;
  float l = clamp(vL, 0.0, 1.0);
  float a = uK * f * sqrt(f) * l * sqrt(l);
  if (!(a >= 0.0) || a > 10.0) a = 0.0;   // never let a NaN into the HDR buffer (bloom spreads it)
  gl_FragColor = vec4(uColor * a, 1.0);
}`;
const FLOW_FRAG = /* glsl */ `
uniform float uTime, uK; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = vec2(vUv.x * 6.0 - uTime * 0.25, vUv.y * 6.0 + uTime * 0.1);
  float v = n(p) * 0.6 + n(p * 2.3 + 7.0) * 0.4;
  float crust = smoothstep(0.55, 0.75, v);
  vec3 hot = mix(vec3(6.0, 1.6, 0.25), vec3(9.0, 4.0, 1.0), n(p * 4.0));
  gl_FragColor = vec4(mix(hot, vec3(0.08, 0.03, 0.02), crust) * uK, 1.0);
}`;
// the EMP: a crackling sphere of light that races out and fades (fresnel rim + moving noise bands)
const DOME_VERT = /* glsl */ `varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const DOME_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uTime, uF; varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){
  float ln = length(vN), lv = length(vV);
  float f = ln > 1e-5 && lv > 1e-5 ? 1.0 - abs(dot(vN / ln, vV / lv)) : 0.0;
  float bands = 0.6 + 0.4 * sin(vP.y * 18.0 - uTime * 30.0 + sin(vP.x * 7.0 + uTime * 9.0) * 2.0);
  float a = uK * (pow(f, 2.5) * 1.6 + 0.08) * bands * (1.0 - uF);
  if (!(a >= 0.0) || a > 20.0) a = 0.0;
  gl_FragColor = vec4(uColor * a, 1.0);
}`;
const HOLO_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; varying vec2 vUv;
void main(){
  float scan = 0.6 + 0.4 * sin(vUv.y * 120.0 - uTime * 6.0);
  float grid = step(0.94, fract(vUv.x * 12.0)) + step(0.94, fract(vUv.y * 8.0));
  float bars = step(fract(vUv.x * 6.0), 0.7) * step(vUv.y, 0.25 + 0.6 * fract(sin(floor(vUv.x * 6.0) * 12.9 + floor(uTime * 1.5)) * 43758.5));
  float edge = 1.0 - smoothstep(0.0, 0.04, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  gl_FragColor = vec4(uColor * (0.15 + grid * 0.25 + bars * 0.5 + edge) * scan, 1.0);
}`;

// light on the wet floor: every electrified field, seal and door lamp throws a glow onto the floor around it
// and a streaky mirror image toward the camera where the floor is wet (sampled from the floor's roughness
// map); overhead lamps leave soft pools. One instanced quad per emitter, additive, clipped to the room.
const SPILL_VERT = /* glsl */ `
attribute vec4 aBox; attribute vec3 aCol; attribute vec3 aPar;
varying vec2 vP; varying vec4 vBox; varying vec3 vCol; varying vec3 vPar; varying vec3 vW;
void main(){
  vec2 ext = aPar.z < 0.5 ? aBox.zw + vec2(aPar.y * 1.7) : aBox.zw;
  vec2 p = position.xy * ext;
  vP = p; vBox = aBox; vCol = aCol; vPar = aPar;
  vW = vec3(aBox.x + p.x, 0.025, aBox.y + p.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0);
}`;
const SPILL_FRAG = /* glsl */ `
uniform sampler2D tRough; uniform float uTile, uTime, uK; uniform vec2 uCam, uRW;
varying vec2 vP; varying vec4 vBox; varying vec3 vCol; varying vec3 vPar; varying vec3 vW;
void main(){
  if (abs(vW.x) > uRW.x || abs(vW.z) > uRW.y) discard;
  float rough = texture2D(tRough, vec2((vW.x + uRW.x) / uTile, (uRW.y - vW.z) / uTile)).g;
  float wet = clamp(1.0 - rough * 1.5, 0.0, 1.0);
  float a;
  if (vPar.z < 0.5) {
    vec2 q = max(abs(vP) - vBox.zw, 0.0);
    float d = length(q), R = max(vPar.y, 0.1);
    float spill = exp(-d * 3.2 / R) * 0.75 + exp(-d * 1.1 / R) * 0.14;
    vec2 dir = sign(vP) * q; float dl = length(dir);
    float toCam = dl > 1e-4 ? clamp(dot(dir / dl, uCam), 0.0, 1.0) : 0.0;
    float streak = 0.55 + 0.45 * sin(dot(vW.xz, vec2(1.3, 9.0)) + sin(vW.x * 3.1) * 2.0);
    float refl = toCam * toCam * exp(-d * 1.5 / R) * (0.15 + wet * 1.6) * streak;
    float flick = 0.86 + 0.14 * sin(uTime * 23.0 + vW.x * 1.7 + vW.z);
    a = (spill * (0.4 + wet * 0.9) + refl) * flick;
  } else {
    float r = length(vP / max(vBox.zw, vec2(0.01)));
    a = (1.0 - smoothstep(0.15, 1.0, r)) * (0.3 + wet * 0.9);
  }
  a *= vPar.x * uK;
  if (!(a >= 0.0) || a > 30.0) a = 0.0;   // never let a NaN into the HDR buffer
  gl_FragColor = vec4(vCol * a, 1.0);
}`;

const N_WALL = 72, N_FIELD = 64, N_POST = 160, N_SPILL = 120;
// models are drawn a little larger than their collision size so they read at phone size
const HERO_S = 1.22, ROBOT_S = 1.18;
// every robot class has its own colour: a soft ring on the floor under it, readable at a glance
const CLS = { sentry: 0xffe23a, patroller: 0xff7418, marksman: 0xff2a3a, aegis: 0x6ab8ff, mortar: 0x9a4aff, ripper: 0xff5ae0, twin: 0x2affb0, drone: 0xeaf2ff };

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
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.3, 400);
    this.post = new Post(r, q);
    this.T = TX.sprites();
    this.pm = new THREE.PMREMGenerator(r);
    this.envs = [];
    this.floors = {};
    this.panelN = TX.panelNormal(q.tex >= 1024 ? 512 : 256);
    MD.materials(null, TX.grimeTex(), TX.stripeTex(), this.panelN, q.name === 'high');
    this.time = 0; this.trauma = 0;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.shocks = [];
    this.lookI = -1; this.look = LOOKS[0];
    this.camPos = new THREE.Vector3(0, 30, 18); this.camLook = new THREE.Vector3(); this.camFov = 40;
    this.lean = new THREE.Vector3(); this.slide = new THREE.Vector3(); this.zoom = 1; this.zc = { x: 0, z: 0 };
    this.shot = null; this.fitCache = {}; this.fade = 0;
    this.roomKey = null;
    this.lights();
    this.buildBase();
    this.buildWalls();
    this.buildDepth();
    // debris that flies off the platform falls into the depths
    const PX = RW + WT + 0.4, PZ = RH + WT + 0.4;
    this.fx = new FX(this.scene, this.T, { dust: q.dust, sparks: q.sparks, debris: q.debris, flashLights: q.flashLights },
      (x, z) => ((Math.abs(x) > PX && Math.abs(z) > DOOR / 2 + 0.2) || (Math.abs(z) > PZ && Math.abs(x) > DOOR / 2 + 0.2) ? -(this.look.depth || 0) : 0));
    this.makeFX();
    this.views = { p: new Map(), e: new Map(), pk: new Map(), heads: [], plates: [] };
    this.pieces = [];
    this.makeShots();
    this.makeDecals();
    this.makeArcs();
    this.propSets = [];
    this.anim = [];
    this.resize();
    addEventListener('resize', () => this.resize());
    this.setLook(0);
  }

  // ---------------------------------------------------------------- lights (a fixed set: only intensities change)
  lights() {
    const k = new THREE.DirectionalLight(0xffffff, 2);
    k.castShadow = true;
    k.shadow.mapSize.set(this.q.shadow, this.q.shadow);
    const c = k.shadow.camera;
    c.left = -20; c.right = 20; c.top = 14; c.bottom = -14; c.near = 1; c.far = 120;
    k.shadow.bias = -0.0004; k.shadow.normalBias = 0.03;
    this.scene.add(k, k.target);
    this.key = k;
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.3);
    this.scene.add(this.hemi, this.fill);
    // the infiltrators' flashlights (two: co-op), shadow-casting on the better tiers
    this.spots = [];
    for (let i = 0; i < 2; i++) {
      const s = new THREE.SpotLight(0xfff2dc, 0, 22, 0.5, 0.45, 1.4);
      if (this.q.spotShadow) { s.castShadow = true; s.shadow.mapSize.set(this.q.spotShadow, this.q.spotShadow); s.shadow.bias = -0.0006; s.shadow.normalBias = 0.04; s.shadow.camera.near = 0.3; s.shadow.camera.far = 22; }
      this.scene.add(s, s.target);
      this.spots.push(s);
    }
    // wall glow, the Seeker, robot muzzles: a fixed pool of point lights
    this.pool = [];
    for (let i = 0; i < 8; i++) { const l = new THREE.PointLight(0xffffff, 0, 9, 1.8); l.position.set(0, -20, 0); this.scene.add(l); this.pool.push(l); }
  }
  envFor(i) {
    if (this.envs[i]) return this.envs[i];
    const L = LOOKS[i], s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { a: { value: new THREE.Color(L.env[0]) }, b: { value: new THREE.Color(L.env[1]) }, c: { value: new THREE.Color(L.env[2]) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 a,b,c; varying vec3 vP; void main(){ vec3 d = normalize(vP); vec3 col = mix(c, b, smoothstep(-0.2, 0.3, d.y)); col += a * pow(max(0.0, d.y), 6.0) * 2.5; gl_FragColor = vec4(col, 1.0); }' })));
    // ceiling light panels for long highlights on the wet floor
    for (let k = 0; k < 6; k++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.6), new THREE.MeshBasicMaterial({ color: hdr(L.env[0], 5), side: THREE.DoubleSide }));
      m.position.set(-5 + (k % 3) * 5, 8, k < 3 ? -2.5 : 2.5); m.rotation.x = Math.PI / 2; s.add(m);
    }
    const f = new THREE.Mesh(new THREE.PlaneGeometry(20, 1), new THREE.MeshBasicMaterial({ color: hdr(L.field, 3), side: THREE.DoubleSide })); f.position.set(0, 1, -9); s.add(f);
    this.envs[i] = this.pm.fromScene(s, 0.02).texture;
    return this.envs[i];
  }

  // ---------------------------------------------------------------- floor, haze, the room's walls
  buildBase() {
    const S = this.scene;
    this.floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0.1, envMapIntensity: 1.2 });
    const fg = new THREE.PlaneGeometry(RW * 2, RH * 2, 1, 1); fg.rotateX(-Math.PI / 2);
    const uv = fg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (RW * 2) / TX.TILE, uv.getY(i) * (RH * 2) / TX.TILE);
    this.floor = new THREE.Mesh(fg, this.floorMat); this.floor.receiveShadow = true;
    S.add(this.floor);
    this.outerMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1, metalness: 0.2 });
    const og = new THREE.PlaneGeometry(120, 90, 1, 1); og.rotateX(-Math.PI / 2);
    const ou = og.attributes.uv; for (let i = 0; i < ou.count; i++) ou.setXY(i, ou.getX(i) * 120 / TX.TILE, ou.getY(i) * 90 / TX.TILE);
    this.outer = new THREE.Mesh(og, this.outerMat); this.outer.position.y = -0.03; this.outer.receiveShadow = true;
    S.add(this.outer);
    // mist layers
    this.hazeMat = new THREE.ShaderMaterial({ vertexShader: FIELD_VERT, fragmentShader: HAZE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color() }, uTime: { value: 0 }, uK: { value: 0.05 } } });
    this.hazes = [];
    for (const y of [0.35, 1.3]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(RW * 2 + 8, RH * 2 + 8), this.hazeMat); m.rotation.x = -Math.PI / 2; m.position.y = y; m.renderOrder = 4; S.add(m); this.hazes.push(m); }
    // lift pad (boss rooms)
    this.lift = MD.liftPad(); this.lift.g.visible = false; S.add(this.lift.g);
    this.lift.ringMat = this.lift.ring.material = this.lift.ring.material.clone();
  }
  buildDepth() {
    const S = this.scene;
    // light spill / wet reflections (see SPILL_FRAG)
    const pg = new THREE.PlaneGeometry(2, 2), sg = new THREE.InstancedBufferGeometry();
    sg.index = pg.index; sg.setAttribute('position', pg.attributes.position); sg.setAttribute('uv', pg.attributes.uv);
    const ia = (n) => new THREE.InstancedBufferAttribute(new Float32Array(N_SPILL * n), n).setUsage(THREE.DynamicDrawUsage);
    this.spillBox = ia(4); this.spillCol = ia(3); this.spillPar = ia(3);
    sg.setAttribute('aBox', this.spillBox); sg.setAttribute('aCol', this.spillCol); sg.setAttribute('aPar', this.spillPar);
    sg.instanceCount = 0;
    this.spillMat = new THREE.ShaderMaterial({ vertexShader: SPILL_VERT, fragmentShader: SPILL_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { tRough: { value: null }, uTile: { value: TX.TILE }, uTime: { value: 0 }, uK: { value: 1 }, uCam: { value: new THREE.Vector2(0, 1) }, uRW: { value: new THREE.Vector2(RW, RH) } } });
    this.spill = new THREE.Mesh(sg, this.spillMat); this.spill.frustumCulled = false; this.spill.renderOrder = 1;
    S.add(this.spill);
    // the room is a platform over the sector's depths: a skirt of dark plating with a lit rim, and ribs
    const sk = this.skirt = new THREE.Group();
    const bx = new THREE.BoxGeometry(1, 1, 1); bx.translate(0, -0.5, 0);
    const OX = RW + WT, OZ = RH + WT;
    for (const [x, z, w, d] of [[0, -OZ - 0.2, OX * 2 + 0.8, 0.4], [0, OZ + 0.2, OX * 2 + 0.8, 0.4], [-OX - 0.2, 0, 0.4, OZ * 2], [OX + 0.2, 0, 0.4, OZ * 2]]) {
      const m = new THREE.Mesh(bx, this.baseMat); m.position.set(x, 0, z); m.scale.set(w, 1, d); m.receiveShadow = true; sk.add(m);
      const st = new THREE.Mesh(bx, this.stripMat); st.position.set(x + Math.sign(x) * 0.02, -0.32, z + Math.sign(z) * 0.02); st.scale.set(w + (w > 1 ? 0.06 : 0.02), 0.07, d + (d > 1 ? 0.06 : 0.02)); st.userData.strip = 1; sk.add(st);
    }
    const ribs = [];
    for (let x = -OX; x <= OX + 0.01; x += 3.5) ribs.push([x, -OZ - 0.45], [x, OZ + 0.45]);
    for (let z = -OZ + 3.5; z < OZ - 0.5; z += 3.5) ribs.push([-OX - 0.45, z], [OX + 0.45, z]);
    this.ribI = new THREE.InstancedMesh(bx, this.postMat, ribs.length);
    ribs.forEach(([x, z], i) => { _m.compose(_p.set(x, -0.15, z), _q.identity(), _s.set(0.35, 1, 0.35)); this.ribI.setMatrixAt(i, _m); });
    this.ribI.frustumCulled = false; sk.add(this.ribI);
    S.add(sk);
    // layered mist in the depths: the deeper something is, the more layers of murk sit in front of it
    this.mistMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false, fog: false });
    this.mists = [];
    const mg = new THREE.PlaneGeometry(200, 150); mg.rotateX(-Math.PI / 2);
    for (const y of [-1.6, -3.6, -6, -8.5]) { const m = new THREE.Mesh(mg, this.mistMat); m.position.y = y; m.renderOrder = -1; m.visible = false; S.add(m); this.mists.push(m); }
    // overhead lamps: soft volumetric shafts down through the haze (same shader as the flashlight beam)
    const shg = new THREE.ConeGeometry(1.9, 12, 20, 1, true); shg.translate(0, -6, 0);
    const suv = shg.attributes.uv; for (let i = 0; i < suv.count; i++) suv.setY(i, 0.35 + suv.getY(i) * 0.65);
    this.shaftMat = this.coneMatProto().clone(); this.shaftMat.uniforms.uK.value = 0.05; this.shaftMat.uniforms.uColor.value = new THREE.Color(0xffffff);
    this.shafts = [];
    for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(shg, this.shaftMat); m.renderOrder = 5; m.frustumCulled = false; m.visible = false; S.add(m); this.shafts.push(m); }
  }
  coneMatProto() {
    if (!this._coneProto) this._coneProto = new THREE.ShaderMaterial({ vertexShader: CONE_VERT, fragmentShader: CONE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uColor: { value: new THREE.Color(0xfff2dc) }, uK: { value: 0.12 } } });
    return this._coneProto;
  }
  buildWalls() {
    const S = this.scene, box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const inst = (geo, mat, n, shadow = true) => { const I = new THREE.InstancedMesh(geo, mat, n); I.count = 0; I.castShadow = shadow; I.receiveShadow = true; I.frustumCulled = false; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); S.add(I); return I; };
    this.wallMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.5, normalMap: this.panelN, normalScale: new THREE.Vector2(0.6, 0.6) });
    this.baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.35, metalness: 0.85, normalMap: this.panelN, normalScale: new THREE.Vector2(0.5, 0.5) });
    this.stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.capMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.postMat = new THREE.MeshStandardMaterial({ color: 0x4a5058, roughness: 0.3, metalness: 0.9 });
    this.fieldMat = new THREE.ShaderMaterial({ vertexShader: FIELD_VERT, fragmentShader: FIELD_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color() }, uTime: { value: 0 }, uK: { value: 1 }, uTop: { value: 1.05 } } });
    this.sealMat = this.fieldMat.clone(); this.sealMat.uniforms.uTop.value = 1.6;
    this.liftDoorMat = new THREE.MeshStandardMaterial({ map: MD.mat().stripes.map, roughness: 0.5, metalness: 0.4 });
    this.wallI = inst(box, this.wallMat, N_WALL);
    this.stripI = inst(box, this.stripMat, N_WALL * 2, false);
    this.baseI = inst(box, this.baseMat, N_FIELD);
    this.fieldI = inst(box, this.fieldMat, N_FIELD, false);
    this.sealI = inst(box, this.sealMat, 4, false);
    this.liftDoorI = inst(box, this.liftDoorMat, 2);
    const post = new THREE.CylinderGeometry(0.11, 0.14, 1, 10); post.translate(0, 0.5, 0);
    this.postI = inst(post, this.postMat, N_POST);
    const cap = new THREE.SphereGeometry(0.1, 10, 8);
    this.capI = inst(cap, this.capMat, N_POST, false);
    // door frames: posts with a lamp (green: a way out, red: sealed)
    this.doorMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.doorPostI = inst(box, this.postMat, 8);
    this.doorLampI = inst(box, this.doorMat, 8, false);
    this.doorLampI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(8 * 3), 3);
    // corridor floor strips outside the open doors
    this.corrMat = new THREE.MeshStandardMaterial({ color: 0x555a60, roughness: 0.4, metalness: 0.6, normalMap: this.panelN });
    this.corrI = inst(box, this.corrMat, 4, false);
    this.chevMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.chevI = inst(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), this.chevMat, 12, false);
    this.railI = inst(box, this.stripMat, 8, false);
    this.railPostI = inst(post, this.postMat, 48);
    this.sealBox = [];
  }
  // rebuild the walls whenever the room changes
  buildRoom(W) {
    const room = W.room, L = this.look;
    this.roomKey = room.key;
    let nw = 0, ns = 0, nb = 0, nf = 0, nseal = 0, nl = 0, np = 0, nsp = 0;
    const fc = new THREE.Color(L.field), sc = new THREE.Color(L.seal);
    const sp = (cx, cz, hx, hz, col, k, reach, kind = 0) => { if (nsp >= N_SPILL) return; this.spillBox.setXYZW(nsp, cx, cz, hx, hz); this.spillCol.setXYZ(nsp, col.r, col.g, col.b); this.spillPar.setXYZ(nsp, k, reach, kind); nsp++; };
    const set = (I, i, x0, z0, x1, z1, y0, h) => { _m.compose(_p.set((x0 + x1) / 2, y0, (z0 + z1) / 2), _q.identity(), _s.set(Math.max(0.01, x1 - x0), h, Math.max(0.01, z1 - z0))); I.setMatrixAt(i, _m); };
    const postAt = (x, z, h) => { if (np >= N_POST) return; _m.compose(_p.set(x, 0, z), _q.identity(), _s.set(1, h, 1)); this.postI.setMatrixAt(np, _m); _m.compose(_p.set(x, h + 0.05, z), _q.identity(), _s.set(1, 1, 1)); this.capI.setMatrixAt(np, _m); np++; };
    for (const w of room.walls) {
      const [x0, z0, x1, z1, k] = w;
      if (k === WK.OUTER) {
        if (nw < N_WALL) set(this.wallI, nw++, x0, z0, x1, z1, 0, 1.1);
        // the electrified strip on the inner face
        const ix0 = x0, iz0 = z0, ix1 = x1, iz1 = z1;
        const thin = 0.05;
        let sx0 = ix0, sz0 = iz0, sx1 = ix1, sz1 = iz1;
        if (z1 <= -RH + 0.01) { sz0 = -RH - thin; sz1 = -RH + 0.01; } else if (z0 >= RH - 0.01) { sz0 = RH - 0.01; sz1 = RH + thin; }
        else if (x1 <= -RW + 0.01) { sx0 = -RW - thin; sx1 = -RW + 0.01; } else if (x0 >= RW - 0.01) { sx0 = RW - 0.01; sx1 = RW + thin; }
        if (ns < N_WALL * 2 - 1) { set(this.stripI, ns++, sx0, sz0, sx1, sz1, 0.18, 0.06); set(this.stripI, ns++, sx0, sz0, sx1, sz1, 1.0, 0.04); }
        sp((x0 + x1) / 2, (z0 + z1) / 2, (x1 - x0) / 2, (z1 - z0) / 2, fc, 0.5, 1.0);
      } else if (k === WK.BARRIER || k === WK.PILLAR) {
        if (nb < N_FIELD) set(this.baseI, nb++, x0, z0, x1, z1, 0, k === WK.PILLAR ? 0.5 : 0.22);
        const ins = 0.12;
        if (nf < N_FIELD) set(this.fieldI, nf++, x0 + ins, z0 + ins, x1 - ins, z1 - ins, 0.22, k === WK.PILLAR ? 1.3 : 0.85);
        sp((x0 + x1) / 2, (z0 + z1) / 2, (x1 - x0) / 2, (z1 - z0) / 2, fc, k === WK.PILLAR ? 1.2 : 1, k === WK.PILLAR ? 1.6 : 1.3);
        // pylons at the corners and every ~1.6 m along the long side
        const lx = x1 - x0, lz = z1 - z0, h = k === WK.PILLAR ? 1.6 : 1.15;
        if (lx >= lz) { const n = Math.max(1, Math.round(lx / 1.6)); for (let i = 0; i <= n; i++) postAt(x0 + (lx * i) / n, (z0 + z1) / 2, h); }
        else { const n = Math.max(1, Math.round(lz / 1.6)); for (let i = 0; i <= n; i++) postAt((x0 + x1) / 2, z0 + (lz * i) / n, h); }
      } else if (k === WK.SEAL) { if (nseal < 4) { this.sealBox[nseal] = [x0, z0, x1, z1]; set(this.sealI, nseal++, x0, z0, x1, z1, 0, 1.6); } sp((x0 + x1) / 2, (z0 + z1) / 2, (x1 - x0) / 2, (z1 - z0) / 2, sc, 1.3, 1.6); }
      else if (k === WK.LIFTDOOR) { if (nl < 2) set(this.liftDoorI, nl++, x0, z0, x1, z1, 0, 1.6); }
    }
    for (const [I, n] of [[this.wallI, nw], [this.stripI, ns], [this.baseI, nb], [this.fieldI, nf], [this.sealI, nseal], [this.liftDoorI, nl], [this.postI, np], [this.capI, np]]) { I.count = n; I.instanceMatrix.needsUpdate = true; }
    // door frames and corridors
    let nd = 0, nc = 0, nch = 0, nr = 0, nrp = 0;
    const D = DOOR / 2;
    for (const s of ['n', 'e', 's', 'w']) {
      const st = room.doors[s];
      if (!st) continue;
      const col = st === 1 ? _c.setHex(0x5dff8a).multiplyScalar(4) : st === 3 ? _c.setHex(0xffc24a).multiplyScalar(3) : _c.copy(new THREE.Color(L.seal)).multiplyScalar(4);
      for (const t of [-1, 1]) {
        let x, z;
        if (s === 'n' || s === 's') { x = t * (D + 0.12); z = s === 'n' ? -RH - WT / 2 : RH + WT / 2; } else { z = t * (D + 0.12); x = s === 'w' ? -RW - WT / 2 : RW + WT / 2; }
        _m.compose(_p.set(x, 0, z), _q.identity(), _s.set(0.34, 1.5, 0.34)); this.doorPostI.setMatrixAt(nd, _m);
        _m.compose(_p.set(x, 1.5, z), _q.identity(), _s.set(0.36, 0.1, 0.36)); this.doorLampI.setMatrixAt(nd, _m); this.doorLampI.setColorAt(nd, col);
        nd++;
      }
      // a lamp's glow on the floor just inside the door
      { const lx = s === 'e' ? RW - 0.3 : s === 'w' ? -RW + 0.3 : 0, lz = s === 's' ? RH - 0.3 : s === 'n' ? -RH + 0.3 : 0; sp(lx, lz, s === 'n' || s === 's' ? D : 0.2, s === 'n' || s === 's' ? 0.2 : D, col, 0.22, 1.1); }
      if (nc < 4) {
        const len = 9, deep = L.depth > 0;
        let b;
        if (s === 'n') b = [-D, -RH - len, D, -RH]; else if (s === 's') b = [-D, RH, D, RH + len]; else if (s === 'w') b = [-RW - len, -D, -RW, D]; else b = [RW, -D, RW + len, D];
        set(this.corrI, nc++, b[0], b[1], b[2], b[3], -0.4, 0.4);
        if (deep) for (const t of [-1, 1]) {
          const ns2 = s === 'n' || s === 's';
          const rx0 = ns2 ? t * (D + 0.05) - 0.03 : b[0], rx1 = ns2 ? t * (D + 0.05) + 0.03 : b[2], rz0 = ns2 ? b[1] : t * (D + 0.05) - 0.03, rz1 = ns2 ? b[3] : t * (D + 0.05) + 0.03;
          if (nr < 8) set(this.railI, nr++, rx0, rz0, rx1, rz1, 0.62, 0.05);
          for (let q = 0; q <= 5 && nrp < 48; q++) {
            const f = q / 5, px = ns2 ? t * (D + 0.05) : b[0] + (b[2] - b[0]) * f, pz = ns2 ? b[1] + (b[3] - b[1]) * f : t * (D + 0.05);
            _m.compose(_p.set(px, 0, pz), _q.identity(), _s.set(0.4, 0.66, 0.4)); this.railPostI.setMatrixAt(nrp++, _m);
          }
        }
      }
      if (st === 1) {
        // chevrons pointing out (green on the way to the lift)
        for (let i = 0; i < 3 && nch < 12; i++) {
          const d = 1.0 + i * 1.1, a = s === 'e' ? 0 : s === 'w' ? Math.PI : s === 's' ? Math.PI / 2 : -Math.PI / 2;
          const x = s === 'e' ? RW + d : s === 'w' ? -RW - d : 0, z = s === 's' ? RH + d : s === 'n' ? -RH - d : 0;
          _q.setFromEuler(_e.set(0, -a, 0)); _m.compose(_p.set(x, 0.02, z), _q, _s.set(0.7, 1, 1.6)); this.chevI.setMatrixAt(nch++, _m);
        }
      }
    }
    this.doorPostI.count = nd; this.doorLampI.count = nd; this.doorPostI.instanceMatrix.needsUpdate = true; this.doorLampI.instanceMatrix.needsUpdate = true; if (this.doorLampI.instanceColor) this.doorLampI.instanceColor.needsUpdate = true;
    this.corrI.count = nc; this.corrI.instanceMatrix.needsUpdate = true; this.chevI.count = nch; this.chevI.instanceMatrix.needsUpdate = true;
    this.railI.count = nr; this.railI.instanceMatrix.needsUpdate = true; this.railPostI.count = nrp; this.railPostI.instanceMatrix.needsUpdate = true;
    this.nSeal = nseal; this.sealT = 0;
    // overhead lamps: shafts through the haze and soft pools where they land (placed per room, never moved)
    {
      const rr = mkr([...room.key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
      const spots = [[-0.55, -0.5], [0.5, -0.55], [-0.15, 0.5], [0.62, 0.4], [-0.75, 0.3], [0.1, -0.1]];
      const shc = new THREE.Color(L.shaft);
      const off = Math.floor(rr() * 6);
      for (let i = 0; i < this.shafts.length; i++) {
        const q = spots[(i + off) % 6], m = this.shafts[i];
        const x = q[0] * RW + (rr() - 0.5) * 3, z = q[1] * RH + (rr() - 0.5) * 2;
        const tx = (rr() - 0.5) * 0.3, tz = (rr() - 0.5) * 0.3;
        m.position.set(x - Math.sin(tz) * 11.5, 11.5, z + Math.sin(tx) * 11.5); m.rotation.set(tx, 0, tz);
        m.visible = (!room.boss || i < 2) && (this.q.name !== 'low' || i < 1);
        if (m.visible) sp(x, z, 2.1, 1.9, shc, L.shaftK * 9, 1, 1);
      }
      this.shaftMat.uniforms.uColor.value.copy(shc); this.shaftMat.uniforms.uK.value = L.shaftK;
    }
    this.spill.geometry.instanceCount = nsp;
    for (const a of [this.spillBox, this.spillCol, this.spillPar]) a.needsUpdate = true;
    this.lift.g.visible = !!room.boss;
    // wall glow lights: spread over the barriers
    const fields = room.walls.filter((w) => w[4] === WK.BARRIER || w[4] === WK.PILLAR);
    this.glowLights = [];
    for (let i = 0; i < 5; i++) {
      const l = this.pool[i], w = fields[Math.floor((i * fields.length) / 5)];
      if (!w) { l.intensity = 0; continue; }
      l.position.set((w[0] + w[2]) / 2, 0.7, (w[1] + w[3]) / 2); l.color.set(L.field); l.distance = 5; l.decay = 2;
      this.glowLights.push(l);
    }
    for (let i = this.glowLights.length; i < 5; i++) this.pool[i].intensity = 0;
    this.fx.clear();
    for (const v of this.views.e.values()) this.scene.remove(v.g);
    this.views.e.clear();
    for (const v of this.views.pk.values()) this.scene.remove(v.g);
    this.views.pk.clear();
    this.pieces.forEach((p) => this.scene.remove(p.m)); this.pieces = [];
  }

  setLook(i) {
    if (i === this.lookI) return;
    this.lookI = i; const L = this.look = LOOKS[i];
    const env = this.envFor(i);
    this.scene.environment = env;
    // scene.environment ignores a material's envMapIntensity: the whole look's image lighting is scaled here
    this.scene.environmentIntensity = L.envI ?? 0.8;
    this.floorMat.envMap = env;
    if (!this.floors[L.floor]) this.floors[L.floor] = TX.floorSet(L.floor, this.q.tex);
    const fs = this.floors[L.floor];
    Object.assign(this.floorMat, { map: fs.map, normalMap: fs.normalMap, roughnessMap: fs.roughnessMap, metalness: L.metal, roughness: L.rough, envMapIntensity: L.envK ?? 1.2 });
    this.floorMat.color.set(L.tint);
    Object.assign(this.outerMat, { map: fs.map, normalMap: fs.normalMap, roughnessMap: fs.roughnessMap });
    this.outerMat.color.set(L.outer);
    this.wallMat.color.set(L.wall); this.baseMat.color.set(L.base);
    this.stripMat.color.copy(hdr(L.field, 3.2)); this.capMat.color.copy(hdr(L.field, 4));
    this.fieldMat.uniforms.uColor.value.set(L.field); this.sealMat.uniforms.uColor.value.set(L.seal);
    this.chevMat.color.copy(hdr(0x5dff8a, 1.6));
    this.hazeMat.uniforms.uColor.value.set(L.haze); this.hazeMat.uniforms.uK.value = L.hazeK;
    this.scene.fog = this.scene.fog || new THREE.FogExp2(0x000000, 0.01);
    this.scene.fog.color.set(L.fog); this.scene.fog.density = L.fogD; this.scene.background.set(L.fog);
    this.key.color.set(L.keyC); this.key.intensity = L.keyI;
    this.key.position.set(...L.keyDir).normalize().multiplyScalar(60); this.key.target.position.set(0, 0, 0);
    this.hemi.color.set(L.hemi[0]); this.hemi.groundColor.set(L.hemi[1]); this.hemi.intensity = L.hemi[2];
    this.fill.color.set(L.fill); this.fill.intensity = L.fillI; this.fill.position.set(-L.keyDir[0], L.up ? -0.7 : 0.6, -L.keyDir[2]);
    // the platform over the depths
    const Dp = L.depth || 0;
    this.outer.position.y = -Dp - 0.03;
    this.skirt.visible = Dp > 0;
    for (const m of this.skirt.children) if (!m.isInstancedMesh && !m.userData.strip) m.scale.y = Dp + 0.5;
    this.ribI.scale.y = Dp + 0.5;
    this.spillMat.uniforms.tRough.value = fs.roughnessMap;
    this.mistMat.color.set(L.fog);
    this.mists.forEach((m, k) => { m.visible = Dp > 0 && m.position.y > -Dp + 0.3 && (this.q.name !== 'low' || k % 2 === 1); });
    this.fx.setLook(L);
    this.shotMat.color.copy(hdr(L.shot, 5)); this.boltMat.color.copy(hdr(L.bolt, 5));
    if (!this.propSets[i]) { this.buildProps(i); this.propSets[i].position.y = -Dp; }
    this.propSets.forEach((g, k) => { if (g) g.visible = k === i; });
    this.roomKey = null;
  }

  // ---------------------------------------------------------------- scenery outside the room, per sector
  buildProps(i) {
    const L = LOOKS[i], g = new THREE.Group(), r = mkr(31 + i * 17), G = MD.GEO, M = MD.mat();
    this.scene.add(g);
    this.propSets[i] = g;
    const S = (x) => x * this.q.props;
    const deep = L.depth > 0, near = deep ? 2.4 : 1.8, spread = deep ? 10 : 4, Dp = L.depth || 0;
    const ring = (n, f) => { // spots around the room, outside the walls, leaving the door corridors clear
      for (let k = 0; k < S(n) * (deep ? 1.5 : 1); k++) {
        const side = k % 4, t = r() * 2 - 1;
        let x, z;
        if (side < 2) { x = t * (RW + (deep ? 9 : 3)); z = (side ? 1 : -1) * (RH + near + r() * spread); } else { z = t * (RH + (deep ? 8 : 2)); x = (side === 2 ? 1 : -1) * (RW + near + r() * spread); }
        if (Math.abs(x) < DOOR && Math.abs(z) > RH) continue;
        if (Math.abs(z) < DOOR && Math.abs(x) > RW) continue;
        f(x, z, r(), k);
      }
    };
    const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => MD.add(g, geo, mat, x, y, z, rx, ry, rz);
    if (L.key === 'labs') {
      const white = MD.paintMat(0xe8ecf0, 0.3, 0.2), glass = M.glassT;
      ring(22, (x, z, q) => {
        if (q < 0.45) { // lab bench with monitors and glassware
          const a = Math.abs(z) > RH ? 0 : Math.PI / 2;
          add(G.rbox(2.4, 0.9, 0.9, 0.05), white, x, 0.45, z, 0, a, 0);
          add(G.rbox(2.42, 0.05, 0.92, 0.02), M.steel, x, 0.92, z, 0, a, 0);
          const mon = add(G.rbox(0.6, 0.38, 0.05, 0.02), M.black, x, 1.2, z, 0, a, 0);
          void mon;
          add(G.cyl(0.08, 0.1, 0.3, 12), glass, x + 0.6, 1.08, z + 0.1);
          add(G.cyl(0.06, 0.06, 0.24, 12), glass, x - 0.7, 1.05, z - 0.1);
        } else if (q < 0.7) { add(G.rbox(1.0, 2.0, 0.7, 0.05), white, x, 1.0, z); add(G.box(0.9, 0.04, 0.02), MD.glowMat(L.accent, 3), x, 1.6, z + 0.36); }
        else { add(G.box(2.6, 2.2, 0.05), glass, x, 1.1, z, 0, Math.abs(z) > RH ? 0 : Math.PI / 2, 0); }
      });
    } else if (L.key === 'cryo') {
      const frost = MD.paintMat(0xc8dce8, 0.25, 0.5);
      ring(20, (x, z, q) => {
        if (q < 0.55) { // cryo pod: a frosted glass cylinder with a lit base
          add(G.cyl(0.6, 0.7, 0.3, 20), M.frame, x, 0.15, z);
          add(G.cyl(0.52, 0.52, 2.0, 20), M.glassT, x, 1.3, z);
          add(G.cyl(0.6, 0.6, 0.25, 20), frost, x, 2.4, z);
          add(G.tor(0.6, 0.03, 24, 6), MD.glowMat(L.accent, 3), x, 0.32, z, Math.PI / 2, 0, 0);
          add(G.cap(0.18, 0.9, 10), MD.paintMat(0x5a6a78, 0.4, 0.3), x, 1.3, z);
        } else { add(G.cyl(0.25, 0.25, 6, 14), frost, x, 0.6, z, 0, 0, Math.PI / 2); add(G.tor(0.27, 0.04, 14, 6), M.frame, x, 0.6, z, 0, Math.PI / 2, 0); }
      });
      this.mistFX = 1;
    } else if (L.key === 'foundry') {
      const iron = MD.paintMat(0x3a302a, 0.6, 0.7);
      this.flowMat = this.flowMat || new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: FLOW_FRAG, uniforms: { uTime: { value: 0 }, uK: { value: 1 } } });
      this.riverMat = this.riverMat || (() => { const m = this.flowMat.clone(); m.uniforms.uK.value = 0.4; m.uniforms.uTime = this.flowMat.uniforms.uTime; return m; })();
      ring(16, (x, z, q) => {
        if (q < 0.4) { // crucible with molten metal
          add(G.cyl(1.0, 0.8, 1.2, 20), iron, x, 0.6, z);
          const top = new THREE.Mesh(new THREE.CircleGeometry(0.9, 24), this.flowMat); top.rotation.x = -Math.PI / 2; top.position.set(x, 1.21, z); g.add(top);
        } else if (q < 0.75) { add(G.rbox(1.6, 0.6, 1.0, 0.06), iron, x, 0.3, z, 0, r() * 3, 0); add(G.box(1.4, 0.15, 0.4), MD.glowMat(0xff7a2a, 2.5), x, 0.62, z); }
        else { add(G.cyl(0.35, 0.4, 3.0, 12), iron, x, 1.5, z); add(G.cyl(0.42, 0.42, 0.2, 12), M.black, x, 3.0, z); }
      });
      this.embers = 1;
    } else if (L.key === 'server') {
      const rackM = new THREE.MeshStandardMaterial({ map: TX.rackAlbedo(), emissiveMap: TX.rackTex(i), emissive: new THREE.Color(1.6, 1.6, 1.6), roughness: 0.4, metalness: 0.6 });
      this.holoMat = this.holoMat || new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: HOLO_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uColor: { value: new THREE.Color(0x3cc8ff) }, uTime: { value: 0 } } });
      ring(26, (x, z, q) => {
        const a = Math.abs(z) > RH ? 0 : Math.PI / 2;
        if (q < 0.75) { const n = deep ? 2 + Math.floor(r() * 3) : 1; for (let j = 0; j < n; j++) add(G.box(0.8, 2.2, 1.0), rackM, x, 1.1 + j * 2.3, z, 0, a, 0); }
        else { const h = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), this.holoMat); h.position.set(x, 1.4, z); h.rotation.y = a; g.add(h); }
      });
    } else {
      const pipe = MD.paintMat(0x3a443a, 0.4, 0.8);
      ring(18, (x, z, q) => {
        if (q < 0.4) { add(G.cyl(0.9, 0.9, 2.6, 24), pipe, x, 1.3, z); add(G.tor(0.92, 0.06, 28, 6), MD.glowMat(L.accent, 3.5), x, 1.6, z, Math.PI / 2, 0, 0); add(G.tor(0.92, 0.06, 28, 6), MD.glowMat(L.accent, 3.5), x, 0.6, z, Math.PI / 2, 0, 0); }
        else if (q < 0.8) { add(G.cyl(0.3, 0.3, 7, 14), pipe, x, 0.5, z, Math.PI / 2, r() * 3, 0); }
        else { add(G.cyl(0.18, 0.22, 0.4, 12), M.frame, x, 0.2, z); this.steamAt = this.steamAt || []; this.steamAt.push([x, z]); }
      });
      this.steamAt = this.steamAt || [];
    }
    if (deep) {
      // structure rising out of the depths: columns at the corners and girders under the bridges
      const colM = MD.paintMat(L.key === 'foundry' ? 0x3a2c22 : L.key === 'reactor' ? 0x26302a : L.key === 'cryo' ? 0x5a6c7a : 0x1a2028, 0.5, 0.7);
      for (const [x, z] of [[-RW - 4.5, -RH - 4], [RW + 4.5, -RH - 4], [-RW - 6, RH + 5], [RW + 6, RH + 5], [0, -RH - 8], [-RW - 9, 0], [RW + 9, 0]]) {
        add(G.box(1.4, Dp + 1.2, 1.4), colM, x, (Dp + 1.2) / 2 - 0.3, z);
        for (let y = 2; y < Dp; y += 3) add(G.box(1.6, 0.25, 1.6), M.frame, x, y, z);
        add(G.box(1.44, 0.07, 1.44), MD.glowMat(L.accent, 1.8), x, Dp - 0.7, z);
        add(G.box(1.44, 0.07, 1.44), MD.glowMat(L.accent, 1.8), x, Dp * 0.4, z);
      }
      for (const [x0, z0, x1, z1] of [[-RW - 4.5, -RH - 4, RW + 4.5, -RH - 4], [-RW - 6, RH + 5, RW + 6, RH + 5]]) {
        const l = Math.hypot(x1 - x0, z1 - z0); add(G.box(l, 0.5, 0.4), M.frame, (x0 + x1) / 2, Dp - 1.2, (z0 + z1) / 2, 0, -Math.atan2(z1 - z0, x1 - x0), 0);
      }
      if (L.key === 'foundry') { // rivers of molten metal far below
        for (const z of [-RH - 7, RH + 8]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(90, 5), this.riverMat); m.rotation.x = -Math.PI / 2; m.position.set(0, 0.05, z); g.add(m); }
        const m = new THREE.Mesh(new THREE.PlaneGeometry(5, 40), this.riverMat); m.rotation.x = -Math.PI / 2; m.position.set(-RW - 7, 0.05, 0); g.add(m);
      }
      if (L.key === 'reactor') { // the reactor's coolant pool glowing far below
        // coolant towers rising out of the murk, ringed with lit bands
        for (const [x, z] of [[-RW - 8, -RH - 6], [RW + 9, RH + 6], [RW + 7, -RH - 9], [-RW - 10, RH + 4]]) {
          add(G.cyl(1.6, 1.9, Dp - 1, 28), MD.paintMat(0x2e3830, 0.45, 0.7), x, (Dp - 1) / 2, z);
          for (let y = 1.5; y < Dp - 1; y += 2.2) add(G.tor(1.75, 0.08, 36, 6), MD.glowMat(0x7dff6a, 2.2), x, y, z, Math.PI / 2, 0, 0);
          add(G.cyl(1.2, 1.2, 0.3, 24), M.frame, x, Dp - 0.85, z);
          this.steamAt.push([x, z]);
        }
      }
      if (L.key === 'cryo') { // frozen coolant lines down in the mist
        for (let k = 0; k < 6; k++) add(G.cyl(0.35, 0.35, 70, 14), MD.paintMat(0xc8dce8, 0.25, 0.5), 0, 1 + k * 0.9, (k % 2 ? 1 : -1) * (RH + 4 + k), 0, 0, Math.PI / 2);
      }
    }
    // below the high tier the scenery outside the walls casts no shadows (40-100 fewer draw calls per shadow pass)
    if (this.q.name !== 'high') g.traverse((o) => { o.castShadow = false; });
    g.visible = false;
  }

  // ---------------------------------------------------------------- shots, bolts, mines, decals, arcs
  makeShots() {
    const cap = new THREE.CapsuleGeometry(0.07, 0.5, 4, 8); cap.rotateZ(Math.PI / 2);
    const inst = (geo, mat, n) => { const I = new THREE.InstancedMesh(geo, mat, n); I.count = 0; I.frustumCulled = false; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.scene.add(I); return I; };
    this.shotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.shotI = inst(cap, this.shotMat, 48);
    this.boltMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const bg = new THREE.CapsuleGeometry(0.11, 0.3, 4, 8); bg.rotateZ(Math.PI / 2);
    this.boltI = inst(bg, this.boltMat, 160);
    this.haloMat = new THREE.MeshBasicMaterial({ map: this.T.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff });
    const hg = new THREE.PlaneGeometry(1, 1); hg.rotateX(-Math.PI / 2);
    this.haloI = inst(hg, this.haloMat, 160);
    this.haloI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(160 * 3), 3);
    // class rings under the robots
    this.ringMat = new THREE.MeshBasicMaterial({ map: this.T.ring, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff });
    this.ringI = inst(hg, this.ringMat, 40);
    this.ringI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(40 * 3), 3);
    // the suits' own ground rings (same material and layout as the class rings, so no new shader program)
    this.youRingI = inst(hg, this.ringMat, 2);
    this.youRingI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(2 * 3), 3);
    // mines: a disc with a lamp
    const mg = new THREE.CylinderGeometry(0.28, 0.32, 0.12, 14);
    this.mineMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.8 });
    this.mineI = inst(mg, this.mineMat, 24); this.mineI.castShadow = true;
    this.mineLampMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.mineLampI = inst(new THREE.SphereGeometry(0.08, 8, 6), this.mineLampMat, 24);
    this.mineLampI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(24 * 3), 3);
    // the boss's sweep beam
    this.beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.beam = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1).translate(0.5, 0, 0), this.beamMat); this.beam.visible = false; this.beam.frustumCulled = false; this.scene.add(this.beam);
    this.beamCore = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1).translate(0.5, 0, 0), new THREE.MeshBasicMaterial({ color: hdr(0xffffff, 6), toneMapped: false })); this.beamCore.visible = false; this.scene.add(this.beamCore);
    // flashlight beams
    this.coneMat = new THREE.ShaderMaterial({ vertexShader: CONE_VERT, fragmentShader: CONE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uColor: { value: new THREE.Color(0xfff2dc) }, uK: { value: 0.12 } } });
    const cg = new THREE.ConeGeometry(2.2, 9, 24, 1, true); cg.translate(0, -4.5, 0); cg.rotateZ(Math.PI / 2);
    this.cones = [0, 1].map(() => { const m = new THREE.Mesh(cg, this.coneMat); m.visible = false; m.renderOrder = 5; m.frustumCulled = false; this.scene.add(m); return m; });
  }
  makeDecals() {
    this.decalPool = [];
    const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
    for (let i = 0; i < 28; i++) {
      const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: DECALW_VERT, fragmentShader: DECAL_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color() }, uProg: { value: 0 }, uLive: { value: 0 }, uTime: { value: 0 }, uKind: { value: 0 }, uAlpha: { value: 1 }, uClip: { value: new THREE.Vector2(RW + WT, RH + WT) } } }));
      m.visible = false; m.renderOrder = 2; m.frustumCulled = false; this.scene.add(m); this.decalPool.push(m);
    }
    // aim lines: a thin glowing strip from a robot along its aim
    this.aimMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const ag = new THREE.PlaneGeometry(1, 1); ag.rotateX(-Math.PI / 2); ag.translate(0.5, 0, 0);
    this.aims = [];
    for (let i = 0; i < 36; i++) { const m = new THREE.Mesh(ag, this.aimMat.clone()); m.visible = false; m.renderOrder = 3; m.frustumCulled = false; this.scene.add(m); this.aims.push(m); }
    this.makeAimGlints();
  }
  makeArcs() {
    this.arcs = [];
    for (let i = 0; i < 14; i++) {
      const g = new THREE.BufferGeometry(), pos = new Float32Array(12 * 3);
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      const m = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.visible = false; m.frustumCulled = false; m.renderOrder = 6; this.scene.add(m);
      this.arcs.push({ m, pos, t: 0 });
    }
    this.arcI = 0;
  }
  // a crackling arc between two points (life: seconds it stays, used for wall sparks)
  setArc(A, ax, ay, az, bx, by, bz, jit, color) {
    const n = 12, P = A.pos;
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1), j = Math.sin(f * Math.PI) * jit;
      P[i * 3] = ax + (bx - ax) * f + (Math.random() - 0.5) * j; P[i * 3 + 1] = ay + (by - ay) * f + (Math.random() - 0.5) * j; P[i * 3 + 2] = az + (bz - az) * f + (Math.random() - 0.5) * j;
    }
    A.m.geometry.attributes.position.needsUpdate = true;
    A.m.material.color.copy(color);
    A.m.visible = true;
  }
  spark(x, z, big) {
    // a short arc jumping off the wall plus sparks
    const A = this.arcs[8 + (this.arcI++ % 6)], L = this.look;
    const a = Math.random() * Math.PI * 2, l = big ? 1.2 : 0.6;
    this.setArc(A, x, 0.5 + Math.random() * 0.4, z, x + Math.cos(a) * l, 0.2 + Math.random() * 0.6, z + Math.sin(a) * l, big ? 0.5 : 0.25, _c.set(L.field).multiplyScalar(5));
    A.t = big ? 0.18 : 0.08;
    const fc = _c.set(L.field);
    this.fx.sparks(x, 0.6, z, { n: big ? 18 : 5, speed: big ? 6 : 3.5, s: 0.15, life: 0.45, r: 0.6 + fc.r * 0.4, g: 0.6 + fc.g * 0.4, b: 0.6 + fc.b * 0.4 });
  }

  // ---------------------------------------------------------------- views
  playerView(p) {
    let v = this.views.p.get(p.id);
    if (!v) {
      v = MD.infiltrator(p.id === 2 ? 0x6a3d3d : 0x3d4a5c, p.id === 2 ? 0xffb347 : 0x6fe3ff);
      v.g.scale.setScalar(HERO_S);
      v.walk = 0; v.recoil = 0; v.deadT = 0; v.aimY = 0;
      this.scene.add(v.g); this.views.p.set(p.id, v);
    }
    return v;
  }
  robotView(e) {
    let v = this.views.e.get(e.id);
    if (!v) {
      v = MD.ROBOT_MODELS[e.type]();
      v.type = e.type; v.walk = Math.random() * 6; v.eyeMat = null;
      // below the high tier only a robot's big parts cast shadows (the small ones barely show from overhead)
      if (this.q.name !== 'high') {
        const cs = [];
        v.g.traverse((o) => { if (o.isMesh && o.castShadow) { if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); cs.push(o); } });
        const big = Math.max(0, ...cs.map((o) => o.geometry.boundingSphere.radius));
        for (const o of cs) if (o.geometry.boundingSphere.radius < big * 0.7) o.castShadow = false;
      }
      if (v.eye) { v.eyeMat = v.eye.material.clone(); v.eye.material = v.eyeMat; v.eyeBase = v.eyeMat.color.clone(); }
      this.scene.add(v.g); this.views.e.set(e.id, v);
    }
    return v;
  }
  bossView(key) {
    if (this.bv && this.bv.key === key) return this.bv;
    if (this.bv) { this.scene.remove(this.bv.g); for (const h of this.views.heads) this.scene.remove(h.g); for (const p of this.views.plates) this.scene.remove(p.g); }
    const v = this.bv = MD.boss(key);
    if (v.eye) { v.eyeMat = v.eye.material.clone(); v.eye.material = v.eyeMat; v.eyeBase = v.eyeMat.color.clone(); }
    this.scene.add(v.g);
    this.views.heads = []; this.views.plates = [];
    const D = BOSSES[key];
    for (let i = 0; i < (D.heads || 0); i++) { const h = MD.hydraHead(); this.scene.add(h.g); this.views.heads.push(h); }
    for (let i = 0; i < (D.plates || 0); i++) { const p = MD.overPlate(); this.scene.add(p.g); this.views.plates.push(p); }
    return v;
  }
  seekerView() { if (!this.sv) { this.sv = MD.seeker(); this.scene.add(this.sv.g); } return this.sv; }

  // ---------------------------------------------------------------- per-frame sync with the world
  sync(W, dt) {
    if (W.room && W.room.key !== this.roomKey) this.buildRoom(W);
    const t = this.time, L = this.look;
    // players
    const seenP = new Set();
    W.players.forEach((p, i) => {
      const v = this.playerView(p);
      seenP.add(p.id);
      this.updatePlayer(v, p, dt, W, i);
    });
    for (const [id, v] of this.views.p) if (!seenP.has(id)) { this.scene.remove(v.g); this.views.p.delete(id); }
    for (let i = W.players.length; i < 2; i++) { this.spots[i].intensity = 0; this.cones[i].visible = false; }
    // a dark flashlight (single player's spare, a downed suit) skips its shadow pass; no recompile, the map stays
    for (const s of this.spots) if (s.castShadow) s.shadow.autoUpdate = s.intensity > 0 || !s.shadow.map;
    // robots
    const seen = new Set();
    for (const e of W.robots) {
      if (e.hp <= 0) continue;
      seen.add(e.id);
      this.updateRobot(this.robotView(e), e, dt, W);
    }
    for (const [id, v] of this.views.e) if (!seen.has(id)) { this.scene.remove(v.g); this.views.e.delete(id); }
    let nr = 0;
    for (const e of W.robots) {
      if (e.hp <= 0 || nr >= 40) continue;
      const k = e.boot > 0 ? 0.25 : e.aimT > 0 ? 1.3 + Math.sin(t * 30) * 0.4 : 0.75, rr = (e.r || 0.5) * 3.4;
      _m.compose(_p.set(e.x, 0.03, e.z), _q.identity(), _s.set(rr, 1, rr)); this.ringI.setMatrixAt(nr, _m);
      this.ringI.setColorAt(nr, _c.setHex(CLS[e.type] || 0xffffff).multiplyScalar(k * (CALM.on ? 0.7 : 1)));
      nr++;
    }
    this.ringI.count = nr; this.ringI.instanceMatrix.needsUpdate = true; if (this.ringI.instanceColor) this.ringI.instanceColor.needsUpdate = true;
    this.syncYouRings(W, t);
    this.syncBoss(W, dt);
    this.syncSeeker(W, dt);
    this.syncShots(W);
    this.syncDecals(W);
    this.syncPickups(W, t);
    // twin tethers
    let ai = 0;
    for (const e of W.robots) if (e.type === 'twin' && e.lead && e.pair && e.boot <= 0) {
      const o = W.robots.find((q) => q.id === e.pair && q.hp > 0);
      if (!o || ai >= 4) continue;
      const A = this.arcs[ai++];
      this.setArc(A, e.x, 0.95, e.z, o.x, 0.95, o.z, 0.25, _c.set(0x7dfff0).multiplyScalar(2.5));
    }
    for (let i = ai; i < 4; i++) this.arcs[i].m.visible = false;
    // wall arcs fade
    for (let i = 8; i < 14; i++) { const A = this.arcs[i]; if (A.t > 0) { A.t -= dt; if (A.t <= 0) A.m.visible = false; } }
    // wall glow flicker
    if (this.glowLights) this.glowLights.forEach((l, i) => { l.intensity = (1 + Math.sin(t * 19 + i * 3) * 0.2 + (Math.random() < 0.02 ? 1.2 : 0)) * (L.glowI ?? 1.6) * (CALM.on ? 0.8 : 1); });
    this.sealMat.uniforms.uK.value = W.room && W.room.seekWarned && !W.seeker && !W.room.boss ? 1.7 + Math.sin(t * 12) * 0.7 : 1;
    // the door you came in by: the seal field rises out of the floor behind you
    if (this.sealT < 1 && this.nSeal) {
      this.sealT = Math.min(1, this.sealT + dt * 1.7);
      const e = 1 - Math.pow(1 - this.sealT, 3);
      for (let i = 0; i < this.nSeal; i++) { const b = this.sealBox[i]; _m.compose(_p.set((b[0] + b[2]) / 2, 0, (b[1] + b[3]) / 2), _q.identity(), _s.set(Math.max(0.01, b[2] - b[0]), 1.6 * Math.max(0.02, e), Math.max(0.01, b[3] - b[1]))); this.sealI.setMatrixAt(i, _m); }
      this.sealI.instanceMatrix.needsUpdate = true;
    }
    // lift pad
    if (W.room && W.room.boss) {
      const on = W.room.liftOn;
      this.lift.ringMat.color.copy(hdr(on ? 0x7dff9a : 0x405048, on ? 3 + Math.sin(t * 6) * 1.2 : 0.6));
      this.lift.g.position.y = W.phase === 'liftup' ? Math.min(2.5, (2.6 - W.phaseT) * 1.4) : 0;
    }
    this.lastW = W;
  }
  updatePlayer(v, p, dt, W, i) {
    const g = v.g;
    const lifting = W.phase === 'liftup';
    v.g.visible = p.alive || p.deadT < 2.2;
    const spot = this.spots[i], cone = this.cones[i];
    if (!p.alive) {
      // death: the suit shorts out and folds
      v.deadT += dt;
      const f = Math.min(1, v.deadT / 0.7);
      v.upper.rotation.z = -f * 1.2; v.lower.rotation.z = -f * 0.4; v.g.position.y = -f * 0.55;
      spot.intensity = 0; cone.visible = false;
      if (v.cell) v.cell.visible = Math.random() < 0.3;
      return;
    }
    if (v.deadT > 0) { v.deadT = 0; v.upper.rotation.z = 0; v.lower.rotation.z = 0; v.g.position.y = 0; if (v.cell) v.cell.visible = true; }
    const sp = Math.hypot(p.vx, p.vz);
    g.position.set(p.x, lifting ? Math.min(2.5, (2.6 - W.phaseT) * 1.4) : 0, p.z);
    // legs face the run direction, the torso turns to the aim
    const runA = sp > 0.4 ? Math.atan2(p.vz, p.vx) : v.runA ?? p.aim;
    let da = angD(v.runA ?? runA, runA);
    v.runA = (v.runA ?? runA) + da * Math.min(1, dt * 12);
    let twist = angD(v.runA, p.aim);
    if (Math.abs(twist) > 1.6) { v.runA += twist > 0 ? twist - 1.6 : twist + 1.6; twist = clamp(twist, -1.6, 1.6); }   // turn the hips when the twist gets too big
    g.rotation.y = -v.runA;
    v.upper.rotation.y = -twist;
    v.walk += sp * dt * 2.3;
    const s = Math.sin(v.walk), k = Math.min(1, sp / F.speed);
    v.L.hip.rotation.z = s * 0.75 * k; v.R.hip.rotation.z = -s * 0.75 * k;
    v.L.knee.rotation.z = -Math.max(0, -s) * 1.1 * k - 0.05; v.R.knee.rotation.z = -Math.max(0, s) * 1.1 * k - 0.05;
    v.lower.position.y = Math.abs(Math.cos(v.walk)) * 0.05 * k;
    v.upper.position.y = v.lower.position.y;
    v.upper.rotation.x = 0;
    v.upper.rotation.z = -k * 0.12 - (p.dashT > 0 ? 0.3 : 0);
    v.recoil = Math.max(0, v.recoil - dt * 9);
    v.gun.position.x = 0.3 - v.recoil * 0.06;
    // invulnerable: flicker
    g.visible = !(p.inv > 0 && Math.floor(this.time * 14) % 2 === 0 && W.phase === 'play');
    // flashlight
    const ga = p.aim;
    const lx = p.x + Math.cos(ga) * 0.5, lz = p.z + Math.sin(ga) * 0.5;
    spot.position.set(lx, 1.25, lz);
    spot.target.position.set(p.x + Math.cos(ga) * 8, 0, p.z + Math.sin(ga) * 8);
    spot.intensity = (i === 0 || W.coop) ? 60 : 0;
    cone.visible = true;
    cone.position.set(lx, 1.2, lz);
    cone.rotation.set(0, -ga, -0.13);
  }
  updateRobot(v, e, dt, W) {
    const g = v.g;
    g.position.set(e.x, 0, e.z);
    const a = e.a || 0;
    g.rotation.y = -a;
    const booting = e.boot > 0;
    const sp = Math.hypot(e.vx, e.vz);
    v.walk += sp * dt * 3.2;
    const s = Math.sin(v.walk);
    if (v.eyeMat) {
      // the eye: dark while booting, glows up through the aim, flashes on firing
      let k = booting ? 0.15 + 0.85 * Math.max(0, 1 - e.boot / 0.5) * (Math.floor(this.time * 10) % 2) : 1;
      if (e.aimT > 0) { const f = 1 - e.aimT / Math.max(0.01, e.aimTot || 1); k = 1.5 + f * 4 + (e.aimT < (e.aimTot || 1) * 0.3 ? Math.sin(this.time * 40) * 1.5 + 1.5 : 0); }
      if (e.rage) k *= 1.6;
      v.eyeMat.color.copy(v.eyeBase).multiplyScalar(k * (CALM.on ? 0.7 : 1));
    }
    if (v.body) { v.body.position.y = (v.type === 'twin' || v.type === 'drone' ? Math.sin(this.time * 3 + e.id) * 0.08 : Math.abs(Math.cos(v.walk)) * 0.04) + (booting ? -0.1 * Math.min(1, e.boot) : 0); v.body.rotation.z = -Math.min(0.25, sp * 0.04); }
    if (v.legs) v.legs.forEach((L, i) => { L.rotation.z = (i % 2 ? s : -s) * 0.5 * Math.min(1, sp); });
    if (v.wheel) v.wheel.rotation.z -= sp * dt / 0.3;
    if (v.head && v.type === 'patroller') v.head.rotation.y = e.mode === 'patrol' ? Math.sin(this.time * 1.5 + e.id) * 0.9 : 0;
    if (v.tube) v.tube.rotation.z = e.aimT > 0 ? -0.6 : -0.15;
    if (v.blades) { const k = e.aimT > 0 ? 0.6 : e.lunge > 0 ? -0.8 : 0; v.blades.forEach((b, i) => { b.rotation.y = (i ? -1 : 1) * k; }); if (e.aimT > 0) g.position.y = -0.12; }
    if (v.rotors) v.rotors.forEach((r) => { r.rotation.y += dt * 40; });
    if (v.ring) v.ring.rotation.z += dt * 2;
    if (v.field) v.field.material.opacity = 1;
    // hit flash
    // a reinforcement warping in grows out of its arrival flare over its first half second
    g.scale.setScalar((e.hitT > 0 ? 1.1 : 1) * ROBOT_S * (e.warp && e.t < 0.5 ? 0.2 + 1.6 * e.t : 1));
  }
  syncBoss(W, dt) {
    const B = W.boss;
    if (!B && this.wreckHold(W, dt)) return;
    if (!B) { if (this.bv) this.bv.g.visible = false; for (const h of this.views.heads) h.g.visible = false; for (const p of this.views.plates) p.g.visible = false; this.beam.visible = this.beamCore.visible = false; return; }
    const v = this.bossView(B.key), t = this.time;
    v.g.visible = true;
    const hover = B.fly ? 0.4 + Math.sin(t * 1.5) * 0.25 : 0;
    const dying = B.state === 'dying';
    v.g.position.set(B.x + (dying ? (Math.random() - 0.5) * 0.2 : 0), (B.state === 'in' ? -Math.max(0, B.st - 0.6) * 1.5 : 0) + hover - (dying ? (1.8 - B.st) * 0.4 : 0), B.z);
    v.g.rotation.y = -B.a;
    if (v.legs.length) { v.walk = (v.walk || 0) + Math.hypot(B.vx, B.vz) * dt * 1.4; v.legs.forEach((L, i) => { L.rotation.z = Math.sin(v.walk + i * Math.PI) * 0.35; }); }
    for (const f of v.fans) f.rotation.y += dt * 25;
    if (v.spin) v.spin.rotation.y = B.spin;
    if (v.hammer) { const C = B.cur; let k = 0; if (C && C.kind === 'slam') k = C.t < C.T ? Math.min(1, C.t / C.T) * 0.9 : -0.25; v.hammer.rotation.z = k; }
    if (v.eyeMat) { const C = B.cur; let k = 1 + (C && C.t < C.T ? 2 + Math.sin(t * 30) : 0) + (B.hitT > 0 ? 2 : 0) + (B.stun > 0 ? -0.6 : 0); v.eyeMat.color.copy(v.eyeBase).multiplyScalar(Math.max(0.2, k)); }
    v.g.scale.setScalar(B.hitT > 0 ? 1.02 : 1);
    // heads and plates
    this.views.heads.forEach((h, i) => {
      const q = B.heads[i];
      h.g.visible = !!q && q.hp > 0;
      if (!q) return;
      h.g.position.set(q.x, 0, q.z);
      const T = W.players[0];
      h.g.rotation.y = -(T ? Math.atan2(T.z - q.z, T.x - q.x) : 0);
    });
    this.views.plates.forEach((p, k) => {
      p.g.visible = k < B.plates;
      const a = B.spin + (k / Math.max(1, B.plates)) * Math.PI * 2;
      p.g.position.set(B.x + Math.cos(a) * 2.5, 2.6 + hover, B.z + Math.sin(a) * 2.5);
      p.g.rotation.y = -a;
    });
    // the sweep beam
    const C = B.cur;
    if (C && C.kind === 'sweep') {
      const live = C.t >= C.T, a = live ? C.beam : C.a0, len = beamLen(W, B, a);
      this.beam.visible = this.beamCore.visible = true;
      this.beam.position.set(B.x, 1.2, B.z); this.beam.rotation.set(0, -a, 0);
      const w = live ? ATTACK.sweep.w * 2.2 : 0.08;
      this.beam.scale.set(len, live ? 0.5 : 0.05, w);
      this.beamMat.color.copy(hdr(this.look.seal, live ? 3 : 1.5 + Math.sin(this.time * 30)));
      this.beamCore.position.copy(this.beam.position); this.beamCore.rotation.copy(this.beam.rotation); this.beamCore.scale.set(len, live ? 0.18 : 0.02, live ? 0.2 : 0.02);
    } else this.beam.visible = this.beamCore.visible = false;
  }
  syncSeeker(W, dt) {
    const S = W.seeker, v = this.seekerView(), l = this.pool[5];
    if (!S) { v.g.visible = false; l.intensity = 0; for (let i = 4; i < 7; i++) this.arcs[i].m.visible = false; return; }
    v.g.visible = true;
    const t = this.time, k = S.inT > 0 ? 1 - S.inT / SEEKER.inT : 1;
    v.g.position.set(S.x, Math.sin(t * 2) * 0.2, S.z);
    v.g.scale.setScalar(0.3 + 0.7 * k);
    v.shell.rotation.y += dt * 0.7; v.shell.rotation.x += dt * 0.4;
    v.halo.rotation.y -= dt * 1.4; v.halo2.rotation.x += dt * 1.1;
    const T = W.players.find((p) => p.alive);
    if (T) v.iris.rotation.y = -Math.atan2(T.z - S.z, T.x - S.x);
    l.position.set(S.x, 1.5, S.z); l.color.setHex(0xff3a2a); l.distance = 9; l.intensity = (6 + Math.sin(t * 13) * 2) * k;
    // tendrils reaching for the floor
    for (let i = 0; i < 3; i++) {
      const A = this.arcs[4 + i];
      if (Math.random() < 0.5) { const a = t * 2 + i * 2.1, d = 1.5 + Math.random() * 1.5; this.setArc(A, S.x, 1.5, S.z, S.x + Math.cos(a) * d, 0.05, S.z + Math.sin(a) * d, 0.7, _c.setHex(0xff4a3a).multiplyScalar(4 * k)); }
    }
  }
  syncShots(W) {
    let n = 0;
    for (const s of W.shots) {
      if (n >= 48) break;
      const a = Math.atan2(s.vz, s.vx);
      _q.setFromEuler(_e.set(0, -a, 0)); _m.compose(_p.set(s.x, 1.4, s.z), _q, _s.set(1, 1, 1)); this.shotI.setMatrixAt(n++, _m);
    }
    this.shotI.count = n; this.shotI.instanceMatrix.needsUpdate = true;
    let b = 0;
    const L = this.look;
    for (const q of W.bolts) {
      if (b >= 160) break;
      const a = Math.atan2(q.vz, q.vx), k = q.big ? 2.2 : q.r > 0.17 ? 1.4 : 1;
      _q.setFromEuler(_e.set(0, -a, 0)); _m.compose(_p.set(q.x, 1.2, q.z), _q, _s.set(k, k, k)); this.boltI.setMatrixAt(b, _m);
      _m.compose(_p.set(q.x, 0.04, q.z), _q.identity(), _s.set(1.6 * k, 1, 1.6 * k)); this.haloI.setMatrixAt(b, _m);
      this.haloI.setColorAt(b, _c.set(q.big ? 0xff8a2a : L.bolt).multiplyScalar(0.6));
      b++;
    }
    this.boltI.count = b; this.boltI.instanceMatrix.needsUpdate = true;
    this.haloI.count = b; this.haloI.instanceMatrix.needsUpdate = true; if (this.haloI.instanceColor) this.haloI.instanceColor.needsUpdate = true;
    // mines
    let m = 0;
    for (const q of W.mines) {
      if (m >= 24) break;
      let y = 0.06;
      if (q.state === 'fly') { const f = Math.min(1, q.t / q.T); y = 0.6 + Math.sin(f * Math.PI) * 4.5; }
      _m.compose(_p.set(q.x, y, q.z), _q.identity(), _s.set(1, 1, 1)); this.mineI.setMatrixAt(m, _m);
      _m.compose(_p.set(q.x, y + 0.08, q.z), _q.identity(), _s.set(1, 1, 1)); this.mineLampI.setMatrixAt(m, _m);
      const blink = q.state === 'fuse' ? (Math.floor(this.time * 16) % 2 ? 6 : 1) : q.state === 'armed' ? (Math.floor(this.time * 3) % 2 ? 3 : 0.6) : 2;
      this.mineLampI.setColorAt(m, _c.setHex(0xff3a2a).multiplyScalar(blink));
      m++;
    }
    this.mineI.count = m; this.mineI.instanceMatrix.needsUpdate = true; this.mineLampI.count = m; this.mineLampI.instanceMatrix.needsUpdate = true; if (this.mineLampI.instanceColor) this.mineLampI.instanceColor.needsUpdate = true;
  }
  decal(i, x, z, sx, sz, rot, kind, color, prog, live, alpha = 1) {
    const m = this.decalPool[i];
    if (!m) return;
    m.visible = true; m.position.set(x, 0.035 + i * 0.001, z); m.scale.set(sx, 1, sz); m.rotation.set(0, rot, 0);
    const u = m.material.uniforms;
    u.uKind.value = kind; u.uColor.value.copy(color); u.uProg.value = prog; u.uLive.value = live; u.uAlpha.value = alpha * (CALM.on ? 0.7 : 1);
  }
  syncDecals(W) {
    let n = 0;
    const L = this.look;
    const red = _tint;
    void red;
    for (const z of W.zones) {
      if (n >= this.decalPool.length) break;
      const live = z.t >= z.T ? 1 : 0, prog = Math.min(1, z.t / Math.max(0.01, z.T));
      const col = z.style === 'frost' || z.style === 'ice' ? _c.setHex(0x9fe8ff).multiplyScalar(z.style === 'ice' ? 0.6 : 2.2)
        : z.style === 'molten' ? _c.setHex(0xff7a2a).multiplyScalar(2.6) : z.style === 'plasma' ? _c.setHex(0x9dff6a).multiplyScalar(2.4)
        : z.style === 'storm' ? _c.setHex(0xc8d8ff).multiplyScalar(2.6) : z.style === 'lane' ? _c.setHex(0xffb347).multiplyScalar(1.8) : _c.set(L.seal).multiplyScalar(2.4);
      if (z.shape === 'circle') this.decal(n++, z.x, z.z, z.r * 2, z.r * 2, 0, 0, col, prog, z.style === 'ice' ? 1 : live, z.style === 'ice' ? 0.5 : 1);
      else {
        const dx = z.bx - z.ax, dz = z.bz - z.az, len = Math.hypot(dx, dz), a = Math.atan2(dz, dx);
        this.decal(n++, (z.ax + z.bx) / 2, (z.az + z.bz) / 2, z.w, len, -a + Math.PI / 2, 1, col, prog, live && z.style !== 'lane' ? 1 : 0);
      }
    }
    // mortar landing rings
    for (const m of W.mines) {
      if (n >= this.decalPool.length) break;
      const R = ENEMY.mortar.mineR;
      if (m.state === 'fly') this.decal(n++, m.tx, m.tz, R * 2, R * 2, 0, 2, _c.setHex(0xff6a2a).multiplyScalar(2), Math.min(1, m.t / m.T), 0);
      else if (m.state === 'fuse') this.decal(n++, m.x, m.z, R * 2, R * 2, 0, 0, _c.setHex(0xff3a2a).multiplyScalar(2.5), 1, 0);
    }
    // the Seeker is coming through the door you came in by
    if (W.room && W.room.seekWarned && !W.seeker && !W.room.boss && n < this.decalPool.length) {
      const e = W.room.entry, ex = e === 'w' ? -RW + 1.1 : e === 'e' ? RW - 1.1 : 0, ez = e === 'n' ? -RH + 1.1 : e === 's' ? RH - 1.1 : 0;
      this.decal(n++, ex, ez, 3.4, 3.4, 0, 2, _c.setHex(0xff3a2a).multiplyScalar(2.2 + Math.sin(this.time * 12) * 0.8), (this.time * 0.8) % 1, 0);
    }
    // the lift pad's call ring
    if (W.room && W.room.liftOn && n < this.decalPool.length) this.decal(n++, 0, 0, F.liftR * 2.4, F.liftR * 2.4, 0, 2, _c.setHex(0x7dff9a).multiplyScalar(2), Math.min(1, W.room.liftT / F.liftHold), 0);
    for (let i = n; i < this.decalPool.length; i++) this.decalPool[i].visible = false;
    // robot aim glints: a line that brightens and locks
    let a = 0;
    const walls = W.room ? W.room.walls : [];
    for (const e of W.robots) {
      if (a >= this.aims.length) break;
      if (!(e.aimT > 0) || e.type === 'mortar') continue;
      const m = this.aims[a++];
      const f = 1 - e.aimT / Math.max(0.01, e.aimTot || 1), locked = e.aimT < (e.aimTot || 1) * 0.3;
      const len = rayLen(walls, e.x, e.z, Math.cos(e.aimA), Math.sin(e.aimA), e.type === 'ripper' ? 6 : 24);
      m.visible = true; m.position.set(e.x, 0.05, e.z); m.rotation.set(0, -e.aimA, 0); m.scale.set(len, 1, e.type === 'ripper' ? 0.9 : locked ? 0.09 : 0.05);
      m.material.color.copy(_c.set(e.type === 'ripper' ? 0xff9a3a : L.seal).multiplyScalar((0.6 + f * 2.2) * (locked ? 1.6 + Math.sin(this.time * 40) * 0.5 : 1)));
      this.aimRed(m, e, f, locked);
      // a burst: fainter lines for the extra bolts either side
      for (let k = 1; k < (e.burstN || 1) && a < this.aims.length; k++) {
        const q = this.aims[a++], ang = e.aimA + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * BURST_A;
        const l2 = rayLen(walls, e.x, e.z, Math.cos(ang), Math.sin(ang), 24);
        q.visible = true; q.position.set(e.x, 0.05, e.z); q.rotation.set(0, -ang, 0); q.scale.set(l2, 1, locked ? 0.06 : 0.035);
        q.material.color.copy(m.material.color).multiplyScalar(0.6);
        q.material.blending = m.material.blending; q.material.opacity = m.material.opacity * 0.75;
      }
    }
    for (let i = a; i < this.aims.length; i++) this.aims[i].visible = false;
    this.endAimGlints();
  }
  // aim telegraphs that read on bright floors: a solid red line (normal blending, so a pale floor cannot wash it out)
  // and a red star glinting at the muzzle that grows through the aim and flickers once the aim locks
  makeAimGlints() {
    const g = new THREE.PlaneGeometry(1, 1);
    this.glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.glints = [];
    for (let i = 0; i < 32; i++) { const m = new THREE.Mesh(g, this.glintMat.clone()); m.visible = false; m.renderOrder = 6; m.frustumCulled = false; this.scene.add(m); this.glints.push(m); }
    this.nGlint = 0;
  }
  aimRed(m, e, f, locked) {
    const M = m.material;
    if (e.type === 'ripper') { M.blending = THREE.AdditiveBlending; M.opacity = 1; return; }
    const k = (0.9 + f * 1.1) * (locked ? 1.35 + Math.sin(this.time * 40) * 0.35 : 1) * (CALM.on ? 0.8 : 1);
    M.blending = THREE.NormalBlending; M.opacity = 0.62 + f * 0.38; m.scale.z *= 1.8;
    M.color.setRGB(1.4 * k, 0.04 * k, 0.035 * k);
    // the muzzle glint: two crossed bars facing the camera
    if (this.nGlint + 2 > this.glints.length) return;
    const ca = Math.cos(e.aimA), sa = Math.sin(e.aimA), r = (e.r || 0.5) + 0.25, y = e.type === 'drone' ? 1.5 : 1.0;
    const s = (0.7 + f * 1.0) * (locked ? 1.25 + Math.sin(this.time * 40) * 0.25 : 1), spin = this.time * 2.5 + (+e.id || 0);
    for (let j = 0; j < 2; j++) {
      const q = this.glints[this.nGlint++], Q = q.material;
      q.visible = true; q.position.set(e.x + ca * r, y, e.z + sa * r);
      q.quaternion.copy(this.camera.quaternion); q.rotateZ(spin + j * Math.PI / 2);
      q.scale.set(s * (j ? 0.75 : 1), s * 0.16, 1);
      Q.color.setRGB(2.6 * k, (locked ? 0.3 : 0.06) * k, (locked ? 0.25 : 0.05) * k);
    }
  }
  endAimGlints() {
    for (let i = this.nGlint; i < this.glints.length; i++) this.glints[i].visible = false;
    this.nGlint = 0;
  }
  // the player's ground ring: cyan (partner lime), flickers while invulnerable after a respawn
  syncYouRings(W, t) {
    let n = 0;
    (W.players || []).forEach((p, i) => {
      if (!p.alive || n >= 2) return;
      const k = (p.inv > 0 ? 0.55 + 0.75 * (0.5 + 0.5 * Math.sin(t * 18)) : 1.05) * (CALM.on ? 0.7 : 1), rr = 1.55;
      _m.compose(_p.set(p.x, 0.035, p.z), _q.identity(), _s.set(rr, 1, rr)); this.youRingI.setMatrixAt(n, _m);
      this.youRingI.setColorAt(n, _c.setHex(i === 1 ? 0xb4ff4a : 0x38e8ff).multiplyScalar(k));
      n++;
    });
    this.youRingI.count = n; this.youRingI.instanceMatrix.needsUpdate = true; if (this.youRingI.instanceColor) this.youRingI.instanceColor.needsUpdate = true;
  }
  syncPickups(W, t) {
    const seen = new Set();
    for (const q of W.pickups) {
      seen.add(q.id);
      let v = this.views.pk.get(q.id);
      if (!v) { v = MD.pickup(POWERUPS[q.kind].color); this.scene.add(v.g); this.views.pk.set(q.id, v); }
      v.g.position.set(q.x, 0, q.z);
      v.pod.position.y = 0.9 + Math.sin(t * 2.4 + q.id) * 0.12;
      v.pod.rotation.y = t * 1.5; v.ring.rotation.x = Math.sin(t) * 0.5; v.ring.rotation.z = t * 0.8;
      v.g.visible = q.life > 3 || Math.floor(t * 8) % 2 === 0;
    }
    for (const [id, v] of this.views.pk) if (!seen.has(id)) { this.scene.remove(v.g); this.views.pk.delete(id); }
  }

  // ---------------------------------------------------------------- break a robot into its real pieces
  breakRobot(id, o = {}) {
    const v = this.views.e.get(id);
    if (!v) return;
    const parts = MD.partsOf(v.g);
    this.scene.remove(v.g); this.views.e.delete(id);
    if (!parts) return;
    v.g.updateMatrixWorld(true);
    const list = parts.filter((p, i) => i % 3 === 0).slice(0, 14);
    for (const q of list) {
      const m = MD.partMesh(q);
      const parent = q.parent ? v.g.getObjectByName(q.parent) : v.g;
      if (!parent) continue;
      _m.multiplyMatrices(parent.matrixWorld, q.m);
      _m.decompose(m.position, m.quaternion, m.scale);
      m.castShadow = true;
      this.scene.add(m);
      const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 4 * (o.k || 1);
      this.pieces.push({ m, vx: Math.cos(a) * sp + (o.vx || 0), vy: 2 + Math.random() * 4, vz: Math.sin(a) * sp + (o.vz || 0), wx: (Math.random() - 0.5) * 12, wz: (Math.random() - 0.5) * 12, life: 2.5 + Math.random() });
    }
    if (this.pieces.length > 90) { for (const p of this.pieces.splice(0, this.pieces.length - 90)) this.scene.remove(p.m); }
  }
  updatePieces(dt) {
    for (const p of this.pieces) {
      p.life -= dt;
      p.vy -= 12 * dt;
      p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt;
      if (p.m.position.y < 0.05) { p.m.position.y = 0.05; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; p.wx *= 0.6; p.wz *= 0.6; }
      p.m.rotation.x += p.wx * dt; p.m.rotation.z += p.wz * dt;
      if (p.life < 0.5) p.m.scale.multiplyScalar(1 - dt * 2);
    }
    for (const p of this.pieces) if (p.life <= 0) this.scene.remove(p.m);
    this.pieces = this.pieces.filter((p) => p.life > 0);
  }
  muzzle(pid) { const v = this.views.p.get(pid); if (v) v.recoil = 1; }

  // ---------------------------------------------------------------- big effects: EMP dome, lightning, shock rings
  makeFX() {
    this.domeMat = new THREE.ShaderMaterial({ vertexShader: DOME_VERT, fragmentShader: DOME_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(0x8fb4ff) }, uK: { value: 1 }, uTime: { value: 0 }, uF: { value: 0 } } });
    this.domes = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), this.domeMat.clone()); m.visible = false; m.frustumCulled = false; m.renderOrder = 6; this.scene.add(m); return { m, t: 0, max: 0.55, r: 1 }; });
    this.di = 0;
    // lightning: a few jagged ribbons built once, reused with a random turn
    this.boltMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.strikes = [];
    for (let k = 0; k < 4; k++) {
      const pts = [], r = mkr(77 + k * 13);
      let x = 0, z = 0;
      for (let i = 0; i <= 14; i++) { pts.push(new THREE.Vector3(x, i, z)); x += (r() - 0.5) * 1.1; z += (r() - 0.5) * 1.1; }
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1), 42, 0.07, 5, false);
      const m = new THREE.Mesh(g, this.boltMat2.clone()); m.visible = false; m.frustumCulled = false; m.renderOrder = 7; this.scene.add(m);
      this.strikes.push({ m, t: 0 });
    }
    this.sk = 0;
  }
  emp(x, z, r) {
    const D = this.domes[this.di++ % this.domes.length];
    D.m.position.set(x, 0, z); D.t = 0; D.r = r; D.m.visible = true; D.m.scale.setScalar(0.3);
  }
  lightning(x, z, color = 0xc8d8ff) {
    const S = this.strikes[this.sk++ % this.strikes.length];
    S.m.position.set(x, 0, z); S.m.rotation.y = Math.random() * 6.28; S.t = 0.22; S.m.visible = true;
    S.m.material.color.copy(_c.setHex(color).multiplyScalar(CALM.on ? 3 : 7));
    this.fx.flash(x, 3, z, 40, color, 0.3);
    this.fx.sparks(x, 0.2, z, { n: 16, speed: 7, r: 0.8, g: 0.9, b: 1 });
    this.fx.scorch(x, z, 1.1);
    this.fx.ring(x, 0, z, 3.2, color);
    this.shock(x, z, 0.5);
  }
  // a hazard on the floor going live: each style its own burst
  zoneFx(e) {
    const L = this.look, x = e.x, z = e.z, r = e.r || 1.5;
    switch (e.style) {
      case 'storm': this.lightning(x, z); break;
      case 'frost':
        this.fx.dust(x, 0.1, z, { n: 10, s0: 0.8, s1: 2.6, life: 2.2, a: 0.5, jit: 3, vy: 0.4, up: 0.6, k: 1.6, spread: r });
        this.fx.sparks(x, 0.3, z, { n: 18, speed: 5, r: 0.75, g: 0.92, b: 1, s: 0.16, life: 0.8 });
        this.fx.ring(x, 0, z, r * 1.5, 0xbfeaff); this.fx.flash(x, 1, z, 14, 0x9fe8ff, 0.3);
        break;
      case 'molten': case 'pools':
        this.fx.fire(x, 0.2, z, { n: 6, s: 1.1, sp: r * 0.8, life: 0.6 });
        this.fx.sparks(x, 0.3, z, { n: 16, speed: 5, vy: 3, r: 1, g: 0.55, b: 0.15, life: 0.9 });
        this.fx.flash(x, 1, z, 16, 0xff7a2a, 0.4);
        break;
      case 'plasma': this.fx.sparks(x, 0.3, z, { n: 16, speed: 5, r: 0.6, g: 1, b: 0.4, life: 0.8 }); this.fx.flash(x, 1, z, 14, 0x9dff6a, 0.35); this.fx.ring(x, 0, z, r * 1.4, 0x9dff6a); break;
      case 'data': this.fx.sparks(x, 0.3, z, { n: 16, speed: 6, r: 0.5, g: 0.8, b: 1, life: 0.6 }); this.fx.flash(x, 1, z, 14, 0x3cc8ff, 0.3); this.fx.ring(x, 0, z, r * 1.4, 0x3cc8ff); break;
      default: this.fx.sparks(x, 0.3, z, { n: 12, speed: 5, r: 1, g: 0.6, b: 0.5 }); this.fx.ring(x, 0, z, r * 1.4, L.seal); break;
    }
  }
  quake(x, z, k = 1) {
    // a boss stomp / slam: shock rings racing out across the floor, dust and loose debris
    this.fx.ring(x, 0, z, 6 * k, this.look.seal); this.fx.ring(x, 0, z, 3.5 * k, 0xffffff);
    this.fx.debris(x, 0.2, z, { n: 8, speed: 5, size: 0.14, sp: 2.5 });
  }
  updateFX(dt) {
    const t = this.time;
    for (const D of this.domes) {
      if (!D.m.visible) continue;
      D.t += dt;
      const f = D.t / D.max;
      if (f >= 1) { D.m.visible = false; continue; }
      const e = 1 - Math.pow(1 - f, 3);
      D.m.scale.set(D.r * (0.25 + 0.75 * e), D.r * (0.25 + 0.75 * e) * 0.55, D.r * (0.25 + 0.75 * e));
      const u = D.m.material.uniforms; u.uTime.value = t; u.uF.value = f * f; u.uK.value = CALM.on ? 1.2 : 2.6;
    }
    for (const S of this.strikes) {
      if (!S.m.visible) continue;
      S.t -= dt;
      if (S.t <= 0) { S.m.visible = false; continue; }
      S.m.material.opacity = CALM.on ? 0.6 : Math.floor(t * 40) % 3 === 0 ? 0.35 : 1;
    }
  }

  // ---------------------------------------------------------------- camera
  resize() {
    const w = innerWidth, h = innerHeight;
    this.r.setPixelRatio(this.q.dpr * this.scale);
    this.r.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    const pw = Math.round(w * this.q.dpr * this.scale), ph = Math.round(h * this.q.dpr * this.scale);
    this.post.setSize(pw, ph);
    for (const p of [this.fx.dustP, this.fx.fireP]) p.mat.uniforms.uScale.value = ph * 0.85;
    this.fitCache = {};
  }
  setScale(s) { if (Math.abs(s - this.scale) < 0.02) return; this.scale = s; this.resize(); }
  get portrait() { return this.camera.aspect < 0.85; }
  // the camera distance that fits the room inside the frame (below the HUD)
  fit(pitch, yaw, fov, top, hx, hz) {
    const key = [pitch, yaw, fov, top, hx, hz, this.camera.aspect.toFixed(3)].join();
    if (this.fitCache[key]) return this.fitCache[key];
    const cam = new THREE.PerspectiveCamera(fov, this.camera.aspect, 0.1, 2000);
    const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    const target = new THREE.Vector3(0, 0, 0.5);
    const pts = [];
    for (const x of [-hx, hx]) for (const z of [-hz, hz]) for (const y of [0, 1.1]) pts.push(new THREE.Vector3(x, y, z));
    let lo = 5, hi = 300;
    for (let i = 0; i < 26; i++) {
      const d = (lo + hi) / 2;
      cam.position.copy(target).addScaledVector(dir, d); cam.lookAt(target); cam.updateMatrixWorld();
      let ok = true;
      for (const p of pts) { _v.copy(p).project(cam); if (Math.abs(_v.x) > 0.97 || _v.y > top || _v.y < -0.96 || _v.z > 1) { ok = false; break; } }
      if (ok) hi = d; else lo = d;
    }
    const res = { pos: target.clone().addScaledVector(dir, hi), look: target.clone(), fov };
    this.fitCache[key] = res;
    return res;
  }
  gameView() {
    const tall = this.portrait;
    return this.fit(tall ? 1.12 : 0.97, tall ? Math.PI / 2 : 0, tall ? 50 : 40, tall ? 0.74 : 0.8, RW + 0.9, RH + 0.9);
  }
  // a boss kill: the sim drops the boss at once, so keep its view as a burning wreck for ~1.5 s (presentation only)
  bossWreck(x, z) { if (this.bv) this.wreck = { t: 1.6, x, z, y: this.bv.g.position.y, tilt: 0, room: null }; }
  wreckHold(W, dt) {
    const k = this.wreck;
    if (!k || !this.bv) return false;
    if (k.room === null) k.room = W.room;
    if (k.t <= 0 || k.room !== W.room) { this.wreck = null; return false; }
    k.t -= dt;
    const v = this.bv, g = v.g, f = 1 - Math.max(0, k.t) / 1.6;
    g.visible = true;
    g.position.set(k.x + (Math.random() - 0.5) * 0.12 * (1 - f), k.y - f * f * 1.1, k.z);
    g.rotation.z = Math.sin(f * 1.4) * 0.18; g.rotation.x = f * 0.1;
    if (v.eyeMat) v.eyeMat.color.copy(v.eyeBase).multiplyScalar(Math.max(0, 0.6 - f) * (Math.random() < 0.3 ? 2 : 0.4));
    for (const h of this.views.heads) h.g.visible = false;
    for (const p of this.views.plates) p.g.visible = false;
    this.beam.visible = this.beamCore.visible = false;
    if (Math.random() < dt * (CALM.on ? 8 : 16)) this.fx.fire(k.x + (Math.random() - 0.5) * 2.4, 1.2 + Math.random() * 1.2, k.z + (Math.random() - 0.5) * 2.4, { n: 2, s: 1.1, sp: 0.6, life: 0.6 });
    if (Math.random() < dt * 6) this.fx.dust(k.x + (Math.random() - 0.5) * 2, 1.8, k.z + (Math.random() - 0.5) * 2, { n: 1, s0: 1, s1: 3.2, life: 2, vy: 1.2, up: 0.8, k: 0.35, a: 0.45 });
    if (k.t <= 0) { g.visible = false; g.rotation.x = g.rotation.z = 0; }
    return true;
  }
  frameShot(pts, dur, wide) { this.shot = { pts, t: dur, wide }; }
  // a boss intro: pulled back and lower, so the boss reads as a silhouette against the room
  wideShot(want, cx, cz, span, tall) {
    if (tall) { want.pos.set(cx + span * 1.6, span * 1.25, cz); want.fov = 52; }
    else { want.pos.set(cx, span * 0.8, cz + span * 1.35); want.fov = 40; }
    want.look.set(cx, 1.3, cz); want.speed = 5;
  }
  // o: { me: {x,z} or null, cine, shake, snap }
  updateCamera(dt, o = {}) {
    let want;
    if (o.cine) {
      const a = this.time * 0.05, r = 26;
      want = { pos: new THREE.Vector3(Math.sin(a) * r, 13 + Math.sin(a * 1.3) * 2, Math.cos(a) * r * 0.7), look: new THREE.Vector3(0, 0.5, 0), fov: 46, speed: 1.5 };
    } else if (this.shot && this.shot.t > 0) {
      this.shot.t -= dt;
      const pts = this.shot.pts;
      let cx = 0, cz = 0; for (const p of pts) { cx += p[0]; cz += p[1]; } cx /= pts.length; cz /= pts.length;
      let span = 5; for (const p of pts) span = Math.max(span, Math.abs(p[0] - cx) * 1.2 + 3, Math.abs(p[1] - cz) * 1.8 + 3);
      const tall = this.portrait;
      want = tall ? { pos: new THREE.Vector3(cx + span * 1.0, span * 1.5, cz), look: new THREE.Vector3(cx, 0.4, cz), fov: 48, speed: 5 }
        : { pos: new THREE.Vector3(cx, span * 1.2, cz + span * 1.0), look: new THREE.Vector3(cx, 0.6, cz), fov: 42, speed: 5 };
      if (this.shot.wide) this.wideShot(want, cx, cz, this.shot.wide, tall);
    } else if (o.W && o.W.phase === 'liftup' && o.W.room && o.W.room.boss) {
      // riding the lift: the camera drops in close and rises with the platform
      const y = this.lift.g.position.y;
      want = this.portrait ? { pos: new THREE.Vector3(7.5, 9.5 + y, 0), look: new THREE.Vector3(0, y + 0.9, 0), fov: 48, speed: 2.4 }
        : { pos: new THREE.Vector3(0, 9 + y, 7.5), look: new THREE.Vector3(0, y + 0.9, 0), fov: 42, speed: 2.4 };
    } else {
      const g = this.gameView();
      // ACTION camera: frame the infiltrator and every live threat (robots, the Seeker, bolts heading in,
      // mines, telegraphs), never tighter than ZMIN of the room and never outside it. Nothing that can hurt
      // you is ever off screen; once a room thins out the camera closes in on the suit.
      let zt = 1, cx = 0, cz = 0;
      const W = o.W;
      if (o.auto && W && o.me && W.room && !W.boss && W.phase !== 'liftup') {
        const me = o.me;
        let x0 = me.x - 4.2, x1 = me.x + 4.2, z0 = me.z - 3.2, z1 = me.z + 3.2;
        const inc = (x, z, p) => { if (x - p < x0) x0 = x - p; if (x + p > x1) x1 = x + p; if (z - p < z0) z0 = z - p; if (z + p > z1) z1 = z + p; };
        for (const p of W.players) if (p.alive && p !== me) inc(p.x, p.z, 3);
        for (const e of W.robots) if (e.hp > 0) inc(e.x, e.z, e.aimT > 0 ? 2.6 : 2);
        if (W.seeker) inc(W.seeker.x, W.seeker.z, 3);
        for (const b of W.bolts) if (Math.abs(b.x - me.x) + Math.abs(b.z - me.z) < 12) inc(b.x, b.z, 1.2);
        for (const m of W.mines) inc(m.state === 'fly' ? m.tx : m.x, m.state === 'fly' ? m.tz : m.z, 2.2);
        for (const z of W.zones) if (z.shape === 'circle') inc(z.x, z.z, z.r + 0.8);
        for (const q of W.pickups) if (Math.abs(q.x - me.x) + Math.abs(q.z - me.z) < 10) inc(q.x, q.z, 1.2);
        if (W.room.t < 1.2) { x0 = -RW; x1 = RW; z0 = -RH; z1 = RH; }   // a look round the room as you walk in
        const HX = RW + 0.9, HZ = RH + 0.9;
        zt = clamp(Math.max((x1 - x0) / 2 / HX, (z1 - z0) / 2 / HZ), this.portrait ? 0.6 : 0.62, 1);
        // the frame may run a little past the walls so a suit at a door is never pinned under the HUD
        const mx = HX * (1 - zt) + (zt < 0.98 ? 2.4 : 0), mz = HZ * (1 - zt) + (zt < 0.98 ? 2.0 : 0);
        cx = clamp((x0 + x1) / 2, -mx, mx); cz = clamp((z0 + z1) / 2, -mz, mz);
      }
      // widen fast when something new turns up, close in slowly
      const zk = 1 - Math.exp(-dt * (zt > this.zoom ? 3.2 : 0.55));
      this.zoom += (zt - this.zoom) * (o.snap ? 1 : zk);
      const ck = 1 - Math.exp(-dt * 2.2);
      this.zc.x += (cx - this.zc.x) * (o.snap ? 1 : ck); this.zc.z += (cz - this.zc.z) * (o.snap ? 1 : ck);
      if (o.me && this.zoom > 0.97) { this.lean.x += (o.me.x * 0.06 - this.lean.x) * Math.min(1, dt * 1.5); this.lean.z += (o.me.z * 0.05 - this.lean.z) * Math.min(1, dt * 1.5); }
      else this.lean.multiplyScalar(Math.exp(-dt * 2));
      this.slide.multiplyScalar(Math.exp(-dt * 5));
      const z = this.zoom;
      const look = g.look.clone().multiplyScalar(z).add(_v.set(this.zc.x, 0, this.zc.z));
      const pos = g.pos.clone().sub(g.look).multiplyScalar(z).add(look);
      want = { pos: pos.add(this.lean).add(this.slide), look: look.add(this.lean).add(this.slide), fov: g.fov, speed: o.snap ? 99 : 6 };
    }
    const k = o.snap ? 1 : 1 - Math.exp(-dt * (want.speed || 3));
    this.camPos.lerp(want.pos, k); this.camLook.lerp(want.look, k); this.camFov += (want.fov - this.camFov) * k;
    this.trauma = Math.max(0, this.trauma - dt * 1.8);
    const sh = this.trauma * this.trauma * (o.shake ?? 1) * 0.45;
    const c = this.camera;
    c.position.copy(this.camPos);
    if (sh > 0) { c.position.x += (Math.random() - 0.5) * sh; c.position.z += (Math.random() - 0.5) * sh; }
    c.up.set(0, 1, 0);
    c.lookAt(this.camLook);
    if (c.fov !== this.camFov) { c.fov = this.camFov; c.updateProjectionMatrix(); }
  }
  // entering a new room: the camera arrives from the side you walked in
  arrive(side) {
    const d = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] }[side] || [0, 0];
    this.slide.set(d[0] * 7, 0, d[1] * 5);
    this.fade = 1;
  }
  shake(k) { this.trauma = Math.min(1, this.trauma + k * (CALM.on ? 0.5 : 1)); }
  project(x, y, z, out) {
    _v.set(x, y, z).project(this.camera);
    out.x = (_v.x * 0.5 + 0.5) * innerWidth; out.y = (-_v.y * 0.5 + 0.5) * innerHeight; out.z = _v.z;
    return out;
  }
  shock(x, z, k = 1) { this.shocks.push({ x, z, t: 0, max: 0.55, k }); if (this.shocks.length > 6) this.shocks.shift(); }
  flashScreen(a, color = 0xffffff) { _c.set(color); this.flash.set(_c.r, _c.g, _c.b, Math.max(this.flash.w, a * (CALM.on ? 0.25 : 0.55))); }

  render(dt, p = {}) {
    this.time += dt;
    const t = this.time;
    this.fx.update(dt);
    this.updatePieces(dt);
    this.updateFX(dt);
    this.fieldMat.uniforms.uTime.value = t; this.sealMat.uniforms.uTime.value = t; this.hazeMat.uniforms.uTime.value = t;
    if (this.flowMat) this.flowMat.uniforms.uTime.value = t;
    if (this.holoMat) this.holoMat.uniforms.uTime.value = t;
    for (const m of this.decalPool) if (m.visible) m.material.uniforms.uTime.value = t;
    const L = this.look;
    { const su = this.spillMat.uniforms; su.uTime.value = t; this.camera.getWorldDirection(_v); const l = Math.hypot(_v.x, _v.z) || 1; su.uCam.value.set(-_v.x / l, -_v.z / l); su.uK.value = CALM.on ? 0.75 : 1; }
    // ambient particles: embers in the foundry, mist in the cryo vault, steam in the reactor
    if (L.key === 'foundry' && Math.random() < dt * 10) this.fx.sparks((Math.random() - 0.5) * RW * 2.4, 0.2, (Math.random() < 0.5 ? -1 : 1) * (RH + 2.5), { n: 1, speed: 1.5, vy: 3, s: 0.14, life: 2, g: 0.5, b: 0.15 });
    if (L.key === 'cryo' && Math.random() < dt * 6) this.fx.dust((Math.random() - 0.5) * RW * 2, 0.1, (Math.random() - 0.5) * RH * 2, { n: 1, s0: 1.5, s1: 4, life: 5, a: 0.18, vy: 0.05, up: 0.1, jit: 0.4, k: 1.4, grav: 0 });
    if (L.key === 'reactor' && this.steamAt && this.steamAt.length && Math.random() < dt * 8) { const q = this.steamAt[(Math.random() * this.steamAt.length) | 0]; this.fx.dust(q[0], 0.4, q[1], { n: 1, s0: 0.5, s1: 3, life: 3, a: 0.3, vy: 2, up: 1, jit: 0.4, k: 1.6, grav: -0.3 }); }
    this.flash.w = Math.max(0, this.flash.w - dt * 3);
    this.fade = Math.max(0, this.fade - dt * 3.5);
    const shocks = [];
    for (const s of this.shocks) {
      s.t += dt;
      const f = s.t / s.max;
      if (f >= 1) continue;
      this.project(s.x, 0.5, s.z, P0);
      shocks.push(new THREE.Vector4(P0.x / innerWidth, 1 - P0.y / innerHeight, f * 0.3 * s.k, (1 - f) * (CALM.on ? 0.3 : 0.7) * s.k));
    }
    this.shocks = this.shocks.filter((s) => s.t < s.max);
    this.post.render(this.scene, this.camera, {
      bloom: L.bloom * (p.bloom ?? 1), threshold: 1.1, exposure: L.exposure * (p.exposure ?? 1), chroma: 0.0015, time: t, desat: p.desat || 0, fade: Math.max(p.fade || 0, this.fade), vignette: 0.45,
      flash: this.flash, tint: _tint.set(...L.grade), shocks, lens: [],
    });
  }

  // draw one of everything once at boot so the first appearance of anything does not stall on a shader compile
  warmUp() {
    const tmp = [MD.infiltrator().g, MD.infiltrator(0x6a3d3d, 0xffb347).g, MD.seeker().g, MD.hydraHead().g, MD.overPlate().g, MD.liftPad().g];
    for (const k in MD.ROBOT_MODELS) tmp.push(MD.ROBOT_MODELS[k]().g);
    for (const k of Object.keys(BOSSES)) tmp.push(MD.boss(k).g);
    for (const k of PW_KEYS) tmp.push(MD.pickup(POWERUPS[k].color).g);
    tmp.forEach((o, i) => { o.position.set(-12 + (i % 10) * 2.6, 0, -6 + Math.floor(i / 10) * 4); this.scene.add(o); });
    // a stand-in room with every kind of wall, so every instanced wall material compiles
    const fake = { key: 'warm', walls: [[-RW - WT, -RH - WT, RW + WT, -RH, WK.OUTER], [-3, -3, 3, -2.55, WK.BARRIER], [5, 3, 6.5, 4.5, WK.PILLAR], [-1.7, RH, 1.7, RH + WT, WK.SEAL], [-RW - WT, -1.7, -RW, 1.7, WK.LIFTDOOR]],
      doors: { n: 1, e: 2, s: 3, w: 0 }, boss: true, liftOn: 1, liftT: 0 };
    this.buildRoom({ room: fake, robots: [], players: [] });
    for (const m of [...this.decalPool.slice(0, 3), ...this.aims.slice(0, 1), this.beam, this.beamCore, ...this.cones, this.domes[0].m, this.strikes[0].m]) m.visible = true;
    for (const A of this.arcs.slice(0, 2)) this.setArc(A, 0, 1, 0, 2, 1, 2, 0.3, _c.setHex(0xffffff));
    this.fx.explode(0, 1, 0, 1, { metal: true });
    this.fx.flash(0, 1, 0, 1);
    for (const I of [this.shotI, this.boltI, this.haloI, this.mineI, this.mineLampI, this.ringI]) { I.count = 1; I.setMatrixAt(0, _m.identity()); }
    // every sector's floor, environment and scenery, compiled now behind the loading screen
    const pr = { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] };
    const first = this.lookI;
    for (let i = LOOKS.length - 1; i >= 0; i--) {
      this.setLook(i);
      this.buildRoom({ room: fake, robots: [], players: [] });
      this.r.compile(this.scene, this.camera);
      this.post.render(this.scene, this.camera, pr);
    }
    if (first !== 0) this.setLook(first);
    for (const I of [this.shotI, this.boltI, this.haloI, this.mineI, this.mineLampI, this.ringI]) I.count = 0;
    for (const o of tmp) this.scene.remove(o);
    for (const m of [...this.decalPool, ...this.aims, this.beam, this.beamCore, ...this.cones, ...this.domes.map((d) => d.m), ...this.strikes.map((q) => q.m)]) m.visible = false;
    for (const A of this.arcs) A.m.visible = false;
    this.fx.clear();
    this.roomKey = null;
  }
}
const P0 = { x: 0, y: 0, z: 0 };
// how far an aim line runs before a wall
function rayLen(walls, x, z, ux, uz, L) {
  let best = L;
  for (const w of walls) {
    let t0 = 0, t1 = best;
    if (Math.abs(ux) < 1e-9) { if (x < w[0] || x > w[2]) continue; } else { let a = (w[0] - x) / ux, b = (w[2] - x) / ux; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
    if (Math.abs(uz) < 1e-9) { if (z < w[1] || z > w[3]) continue; } else { let a = (w[1] - z) / uz, b = (w[3] - z) / uz; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
    if (t0 < best) best = t0;
  }
  return Math.max(0.5, best);
}
void inZone; void UP;
