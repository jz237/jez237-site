// Rimstorm 2026 renderer: the lane-web is a physical structure (smoked-glass lane panels, machined rails
// with emissive edge strips, a heavy rim, structural ribs and a glowing throat at the far end) running
// away from the camera into fog. The camera rides behind the Rimrunner and rolls so its lane is always at
// the bottom of the screen; on a dive it flies down the tube. Five sector backdrops (gas giant, abyss,
// molten core, ice moon, black hole with lensing), every enemy, boss and effect from the simulation, and
// HDR post. Nothing here changes the world. The light count never changes after boot.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=8';
import * as TX from './textures.js?v=8';
import * as MD from './models.js?v=8';
import { FX, CALM } from './fx.js?v=8';
import { SHAPES, BOSSES, POWERUPS, F, BOSS_KEYS } from './config.js?v=8';

export { CALM };
export const TUBE = { R: 10, DEPTH: 64, FAR: 0.58 };
const { R: TR, DEPTH, FAR } = TUBE;
const hdr = MD.hdr;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const TAU = Math.PI * 2;

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), msaa: true, bloomLevels: 5, tex: 1024, dust: 1800, sparks: 1600, debris: 180, flashLights: 4, stars: 3000, motes: 1600, props: 1 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), msaa: true, bloomLevels: 4, tex: 512, dust: 1100, sparks: 1000, debris: 120, flashLights: 4, stars: 2000, motes: 1000, props: 0.75 },
    low: { name: 'low', dpr: 1, msaa: false, bloomLevels: 3, tex: 512, dust: 600, sparks: 500, debris: 60, flashLights: 4, stars: 1200, motes: 500, props: 0.5 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ sector looks
//   rail = edge strip colour, lane = lane glass tint, fog, key light, exposure, bloom; shot / bolt colours
export const LOOKS = [
  { key: 'orbit', rail: 0x6fd8ff, lane: 0x8aa4c0, laneEm: 0x050a12, rib: 0x7a8794, fog: 0x0a1222, fogD: 0.0042, sky: 0x02040a, key: 0xfff0dc, keyI: 3.0, keyDir: [0.6, 0.5, 0.6], hemi: [0x7fa0d8, 0x2a1a14, 0.5], fill: 0xff9a5a, fillI: 0.8,
    throat: 0x5ad8ff, exposure: 1.05, bloom: 0.55, grade: [1.0, 1.0, 1.04], shot: 0x9fe8ff, bolt: 0xff6a3a, dust: 0x8090a0, dustLight: 1.6, lamp: 0x5ad8ff, lampI: 60 },
  { key: 'abyss', rail: 0x3fffc0, lane: 0x4a7a80, laneEm: 0x021210, rib: 0x2c4a50, fog: 0x01121a, fogD: 0.014, sky: 0x000608, key: 0x9fe8ff, keyI: 1.2, keyDir: [-0.2, 1, 0.3], hemi: [0x2a6a7a, 0x020606, 0.45], fill: 0x3fffc0, fillI: 0.6,
    throat: 0x3fffc0, exposure: 1.2, bloom: 0.6, grade: [0.92, 1.02, 1.06], shot: 0xbfffe8, bolt: 0xff5a8a, dust: 0x5a8a90, dustLight: 1.2, lamp: 0x3fffc0, lampI: 80 },
  { key: 'core', rail: 0xff8a3a, lane: 0x6a4a3a, laneEm: 0x1a0602, rib: 0x4a3024, fog: 0x2a0c04, fogD: 0.011, sky: 0x0a0202, key: 0xffc890, keyI: 1.3, keyDir: [0.3, -0.6, 0.5], hemi: [0x803a20, 0x200804, 0.5], fill: 0xff5a1a, fillI: 0.55,
    throat: 0xff6a1a, exposure: 1.0, bloom: 0.6, grade: [1.06, 0.98, 0.9], shot: 0x9fe8ff, bolt: 0xff4fd8, dust: 0x8a6a5a, dustLight: 1.5, lamp: 0xff6a1a, lampI: 58, throatK: 0.42 },
  { key: 'moon', rail: 0xbfe8ff, lane: 0x9ab8d0, laneEm: 0x060c14, rib: 0x8094a8, fog: 0x1a2a3e, fogD: 0.0075, sky: 0x060a14, key: 0xe8f4ff, keyI: 2.6, keyDir: [-0.5, 0.6, 0.6], hemi: [0xa0c0e8, 0x283040, 0.6], fill: 0x8fb8ff, fillI: 0.7,
    throat: 0xbfe8ff, exposure: 1.0, bloom: 0.55, grade: [0.96, 1.0, 1.06], shot: 0xffd27a, bolt: 0xff5a5a, dust: 0xb0c4d8, dustLight: 1.6, lamp: 0x9fd0ff, lampI: 60 },
  { key: 'horizon', rail: 0xc09aff, lane: 0x5a5070, laneEm: 0x08040e, rib: 0x4a4060, fog: 0x06040c, fogD: 0.0038, sky: 0x000000, key: 0xffd8b0, keyI: 0.85, keyDir: [0.2, 0.4, -0.8], laneEnv: 0.4, laneR: 0.6, hemi: [0x6a58a0, 0x0a0610, 0.45], fill: 0xffa060, fillI: 1.0,
    throat: 0xc09aff, exposure: 1.1, bloom: 0.6, grade: [1.0, 0.97, 1.06], shot: 0xffd27a, bolt: 0x7af0ff, dust: 0x7a70a0, dustLight: 1.3, lamp: 0xc09aff, lampI: 70 },
];

// ------------------------------------------------------------------ shaders
// lane strips: the player's lane highlight and every lane warning (kind 0 = highlight, 1 = tell, 2 = live strike, 3 = pull)
const STRIP_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const STRIP_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uProg, uTime, uKind, uAlpha;
varying vec2 vUv;
void main(){
  float x = abs(vUv.x * 2.0 - 1.0), y = vUv.y;
  float edge = smoothstep(0.8, 0.96, x) * (1.0 - smoothstep(0.97, 1.0, x));
  float a = 0.0;
  if (uKind < 0.5) {
    float chev = step(0.6, fract(y * 18.0 + x * 1.2 - uTime * 1.6));
    a = edge * 0.6 + chev * 0.06 * (1.0 - y) + 0.03;
    a *= 1.0 - smoothstep(0.55, 1.0, y);
  } else if (uKind < 1.5) {
    float fill = step(y, uProg) * 0.22;
    float chev = step(0.5, fract(y * 10.0 - x * 0.8 + uTime * 3.0)) * 0.3;
    a = edge * 0.9 + fill + chev * (0.4 + 0.6 * uProg);
    a *= 0.55 + 0.45 * sin(uTime * 18.0) * uProg;
  } else if (uKind < 2.5) {
    // a live strike: an energy sheet pouring up the lane (a hot core line, bands racing toward the rim)
    float flow = fract(y * 9.0 - uTime * 5.0);
    float bands = smoothstep(0.0, 0.12, flow) * (1.0 - smoothstep(0.3, 0.55, flow));
    float wav = 0.5 + 0.5 * sin(y * 46.0 - uTime * 28.0 + x * 5.0);
    float core = 1.0 - smoothstep(0.0, 0.3, x);
    a = 0.3 + edge * 1.1 + core * (0.55 + 0.35 * wav) + bands * 0.45 * (1.0 - x * 0.6);
  } else {
    float chev = step(0.5, fract(y * 6.0 + uTime * 2.0));
    a = edge * 0.8 + chev * 0.35;
  }
  gl_FragColor = vec4(uColor * a * uAlpha, 1.0);
}`;
const THROAT_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; varying vec2 vUv;
void main(){
  vec2 p = vUv * 2.0 - 1.0; float r = length(p); if (r > 1.0) discard;
  float a = atan(p.y, p.x);
  float swirl = 0.5 + 0.5 * sin(a * 6.0 + r * 14.0 - uTime * 2.2);
  float k = (1.0 - smoothstep(0.0, 1.0, r)) * (0.5 + 0.5 * swirl) + smoothstep(0.75, 0.98, r) * (1.0 - smoothstep(0.98, 1.0, r)) * 2.0;
  gl_FragColor = vec4(uColor * k, 1.0);
}`;
const DISK_FRAG = /* glsl */ `
uniform float uTime; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = vUv * 2.0 - 1.0; float r = length(p); if (r > 1.0 || r < 0.36) discard;
  float a = atan(p.y, p.x);
  float t = (r - 0.36) / 0.64;
  float s = n(vec2(a * 6.0 + uTime * 0.6 / (r + 0.2), r * 18.0)) * 0.6 + n(vec2(a * 14.0 - uTime, r * 40.0)) * 0.4;
  vec3 hot = mix(vec3(3.2, 2.3, 1.5), vec3(1.2, 0.36, 0.1), smoothstep(0.0, 0.7, t));
  float k = pow(1.0 - t, 1.6) * (0.35 + 0.9 * s) * smoothstep(0.0, 0.05, t);
  gl_FragColor = vec4(hot * k, 1.0);
}`;
// the sky dome: soft value-noise nebula, a glow toward one side (one program for every look)
const SKY_VERT = /* glsl */ `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uA, uB, uC, uDir; uniform float uSeed, uK; varying vec3 vP;
float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
void main(){
  vec3 d = normalize(vP);
  vec3 q = d * 2.2 + uSeed;
  float n = n3(q) * 0.5 + n3(q * 2.1 + 3.1) * 0.3 + n3(q * 4.3 + 7.7) * 0.2;
  float neb = smoothstep(0.42, 0.85, n);
  float side = pow(max(0.0, dot(d, uDir)), 3.0);
  vec3 col = uA + uB * neb * (0.4 + 0.6 * side) * uK + uC * side * 0.35 * uK;
  gl_FragColor = vec4(col, 1.0);
}`;
// aurora curtains over the crystal moon
const AURORA_FRAG = /* glsl */ `
uniform float uTime; varying vec2 vUv;
void main(){
  float x = vUv.x, y = vUv.y;
  float w = sin(x * 18.0 + uTime * 0.3) * 0.5 + sin(x * 41.0 - uTime * 0.5) * 0.25 + sin(x * 7.0 + uTime * 0.15);
  float band = smoothstep(0.0, 0.25, y) * (1.0 - smoothstep(0.35, 1.0, y));
  float rays = 0.6 + 0.25 * sin(x * 97.0 + w * 3.0) + 0.15 * sin(x * 211.0 - w * 5.0);
  float k = band * rays * (0.6 + 0.4 * w) * smoothstep(0.0, 0.15, x) * (1.0 - smoothstep(0.85, 1.0, x));
  vec3 col = mix(vec3(0.1, 1.0, 0.6), vec3(0.5, 0.3, 1.0), y);
  gl_FragColor = vec4(col * max(k, 0.0) * 0.35, 1.0);
}`;
const ATMO_VERT = /* glsl */ `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
const ATMO_FRAG = /* glsl */ `uniform vec3 uColor; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - max(0.0, dot(vN, vV)), 3.0); gl_FragColor = vec4(uColor * f, 1.0); }`;
const SHIELD_VERT = ATMO_VERT;
const SHIELD_FRAG = /* glsl */ `uniform vec3 uColor; uniform float uK, uTime; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.0); float hex = 0.5 + 0.5 * sin(vN.x * 30.0 + uTime * 3.0) * sin(vN.y * 30.0) * sin(vN.z * 30.0 - uTime); gl_FragColor = vec4(uColor * f * (0.7 + hex * 0.5) * uK, 1.0); }`;

const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _c = new THREE.Color(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler(), _tint = new THREE.Vector3(), _up = new THREE.Vector3();
const ZAXIS = new THREE.Vector3(0, 0, 1), YAXIS = new THREE.Vector3(0, 1, 0);
const LP = { x: 0, y: 0, z: 0, tx: 1, ty: 0, nx: 0, ny: 1, a: 0 };
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Renderer {
  constructor(canvas, q) {
    this.q = q;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(q.dpr);
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    this.r = r; this.scale = 1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.3, 3000);
    this.post = new Post(r, q);
    this.T = TX.sprites();
    this.pm = new THREE.PMREMGenerator(r);
    this.envs = [];
    MD.materials(null, TX.grimeTex(), TX.stripeTex(), TX.panelNormal(q.tex >= 1024 ? 512 : 256), q.name === 'high');
    this.suit = { color: 0x2f8cff, accent: 0x9fe8ff };
    this.time = 0; this.trauma = 0;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.shocks = []; this.lens = [];
    this.draggers = new Map(); // pid -> the rider view that grabbed that Rimrunner (it rides it down the lane)
    this.lookI = -1; this.look = LOOKS[0];
    this.camPos = new THREE.Vector3(0, 0, 30); this.camLook = new THREE.Vector3(0, 0, -30); this.camUp = new THREE.Vector3(0, 1, 0); this.camFov = 60; this.camRoll = 0;
    this.shot = null;
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.lights();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.006);
    this.buildWeb();
    this.buildBackdrops();
    this.fx = new FX(this.scene, this.T, { dust: q.dust, sparks: q.sparks, debris: q.debris, flashLights: q.flashLights }, () => -1e9);
    this.fx.grav = 0.6;
    this.views = { p: new Map(), e: new Map(), pk: new Map(), dr: new Map() };
    this.bossV = null;
    this.pieces = [];
    this.makePools();
    this.shapeKey = null;
    this.resize();
    addEventListener('resize', () => this.resize());
    this.setLook(0);
    this.setWeb('circle', 0, 0);
  }

  // ---------------------------------------------------------------- lights (a fixed set: only intensities change)
  lights() {
    const S = this.scene;
    this.key = new THREE.DirectionalLight(0xffffff, 2.5); S.add(this.key, this.key.target);
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5); S.add(this.hemi);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.5); S.add(this.fill);
    // the Rimrunner's headlights shine down its lane
    this.heads = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.SpotLight(0xdff4ff, 0, 70, 0.42, 0.6, 1.2); S.add(l, l.target); this.heads.push(l); }
    // lamps deep in the tube, tinted per sector
    this.lamps = [];
    for (let i = 0; i < 3; i++) { const l = new THREE.PointLight(0xffffff, 0, 60, 1.4); l.position.set(0, 0, -20 - i * 20); S.add(l); this.lamps.push(l); }
  }
  envFor(i) {
    if (this.envs[i]) return this.envs[i];
    const L = LOOKS[i], s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { a: { value: new THREE.Color(L.key) }, b: { value: new THREE.Color(L.hemi[0]) }, c: { value: new THREE.Color(L.fog) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 a,b,c; varying vec3 vP; void main(){ vec3 d = normalize(vP); vec3 col = mix(c, b * 0.6, smoothstep(-0.3, 0.4, d.y)); col += a * pow(max(0.0, d.y), 5.0) * 2.0; gl_FragColor = vec4(col, 1.0); }' })));
    for (let k = 0; k < 6; k++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), new THREE.MeshBasicMaterial({ color: hdr(k % 2 ? L.rail : L.key, 2.2), side: THREE.DoubleSide }));
      const a = (k / 6) * TAU; m.position.set(Math.cos(a) * 8, 3 + (k % 3) * 2 - 2, Math.sin(a) * 8); m.lookAt(0, 0, 0); s.add(m);
    }
    this.envs[i] = this.pm.fromScene(s, 0.03).texture;
    return this.envs[i];
  }

  // ---------------------------------------------------------------- the web: lanes, rails, rim, ribs, throat
  buildWeb() {
    const lt = TX.laneTex(this.q.tex >= 1024 ? 512 : 256), mt = TX.metalTex(256);
    lt.map.repeat.set(1, 1); lt.normalMap.repeat.set(1, 1);
    this.laneMat = new THREE.MeshStandardMaterial({ color: 0x8aa4c0, map: lt.map, normalMap: lt.normalMap, normalScale: new THREE.Vector2(0.15, 0.15), roughness: 0.46, metalness: 0.25, transparent: true, opacity: 0.84, side: THREE.DoubleSide, emissive: 0x050a12, envMapIntensity: 0.85, depthWrite: true });
    this.railMat = new THREE.MeshStandardMaterial({ color: 0xb8c0ca, map: mt.map, normalMap: mt.normalMap, roughnessMap: mt.roughnessMap, metalness: 0.95, roughness: 0.3, envMapIntensity: 1.4 });
    this.ribMat = new THREE.MeshStandardMaterial({ color: 0x7a8794, map: mt.map, metalness: 0.85, roughness: 0.45 });
    this.glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.glowDim = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    // lane surfaces: up to 16 lanes, SEG segments down the tube each (so fog and the headlights shade them well)
    const SEG = 10, MAXL = 16;
    this.SEG = SEG;
    const g = new THREE.BufferGeometry();
    const nv = MAXL * (SEG + 1) * 2;
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(nv * 2), 2));
    const idx = [];
    for (let l = 0; l < MAXL; l++) for (let s = 0; s < SEG; s++) { const b = (l * (SEG + 1) + s) * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    g.setIndex(idx);
    const uv = g.attributes.uv;
    for (let l = 0; l < MAXL; l++) for (let s = 0; s <= SEG; s++) { const b = (l * (SEG + 1) + s) * 2; uv.setXY(b, 0, (s / SEG) * 8); uv.setXY(b + 1, 1, (s / SEG) * 8); }
    this.laneGeo = g;
    this.lanes = new THREE.Mesh(g, this.laneMat); this.lanes.frustumCulled = false; this.lanes.renderOrder = 1;
    this.root.add(this.lanes);
    const along = (geo) => { geo.rotateX(Math.PI / 2); return geo; };   // unit length along z
    this.rails = new THREE.InstancedMesh(along(new THREE.CylinderGeometry(0.2, 0.2, 1, 10)), this.railMat, 17);
    this.railGlow = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.08, 1), this.glowMat, 17);
    this.rimBar = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.55, 0.9), this.railMat, 16);
    this.rimGlow = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.08, 0.08), this.glowMat, 16);
    this.rimCap = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 14).rotateX(Math.PI / 2), this.railMat, 17);
    this.ribs = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.22, 0.35), this.ribMat, 16 * 8);
    this.throatRing = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.12, 0.12), this.glowMat, 16);
    // the web's outer frame: girders around the outside at five stations, X-braces between them and spars
    // along every rail (seen through the glass and from above on open trenches)
    this.outer = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), this.ribMat, 16 * 9 + 17);
    for (let i = 0; i < 16; i++) this.rimGlow.setColorAt(i, _c.setRGB(1, 1, 1));
    for (const m of [this.rails, this.railGlow, this.rimBar, this.rimGlow, this.rimCap, this.ribs, this.throatRing, this.outer]) { m.frustumCulled = false; this.root.add(m); }
    this.throatMat = new THREE.ShaderMaterial({ vertexShader: STRIP_VERT, fragmentShader: THROAT_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uColor: { value: new THREE.Color() }, uTime: { value: 0 } } });
    this.throat = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.throatMat);
    this.throat.position.z = -DEPTH - 0.5; this.root.add(this.throat);
  }
  // rebuild the web geometry for a shape (the materials stay, so nothing recompiles)
  setWeb(shape, rot, breathe) {
    if (this.shapeKey !== shape) {
      this.shapeKey = shape;
      const S = SHAPES[shape] || SHAPES.circle;
      this.closed = S.closed; this.n = S.n;
      this.P = S.pts().map(([x, y]) => [x * TR, y * TR]);
      this.buildWebGeometry();
    }
    this.root.rotation.z = rot;
    const s = 1 + breathe;
    this.root.scale.set(s, s, 1);
  }
  // lane coordinate c at depth d -> local point + lane tangent/normal (into LP)
  lanePt(c, d, out = LP) {
    const n = this.n, P = this.P;
    let u = c + 0.5;
    if (this.closed) u = ((u % n) + n) % n; else u = clamp(u, 0, n);
    let i = Math.floor(u), f = u - i;
    if (!this.closed && i >= n) { i = n - 1; f = 1; }
    const A = P[i], B = P[this.closed ? (i + 1) % n : i + 1];
    const s = 1 - d * (1 - FAR);
    const x = A[0] + (B[0] - A[0]) * f, y = A[1] + (B[1] - A[1]) * f;
    let tx = B[0] - A[0], ty = B[1] - A[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    out.x = x * s; out.y = y * s; out.z = -d * DEPTH; out.tx = tx; out.ty = ty; out.nx = -ty; out.ny = tx; out.a = Math.atan2(ty, tx); out.w = tl * s;
    return out;
  }
  buildWebGeometry() {
    const n = this.n, P = this.P, SEG = this.SEG, g = this.laneGeo, pos = g.attributes.position, nor = g.attributes.normal;
    const nPts = this.closed ? n : n + 1;
    for (let l = 0; l < n; l++) {
      const A = P[l], B = P[this.closed ? (l + 1) % n : l + 1];
      let tx = B[0] - A[0], ty = B[1] - A[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      for (let s = 0; s <= SEG; s++) {
        const d = s / SEG, k = 1 - d * (1 - FAR), z = -d * DEPTH, b = (l * (SEG + 1) + s) * 2;
        pos.setXYZ(b, A[0] * k, A[1] * k, z); pos.setXYZ(b + 1, B[0] * k, B[1] * k, z);
        nor.setXYZ(b, -ty, tx, 0); nor.setXYZ(b + 1, -ty, tx, 0);
      }
    }
    pos.needsUpdate = true; nor.needsUpdate = true;
    g.setDrawRange(0, n * SEG * 6);
    g.computeBoundingSphere();
    // rails along every border, a heavy rim bar per lane, ribs every 8 m, the throat ring
    for (let k = 0; k < 17; k++) {
      if (k >= nPts) { for (const m of [this.rails, this.railGlow, this.rimCap]) m.setMatrixAt(k, _m.makeScale(0, 0, 0)); continue; }
      const A = P[k % n === k || !this.closed ? k : k % n];
      const ax = A[0], ay = A[1], bx = A[0] * FAR, by = A[1] * FAR;
      // outward from the centre a little so the rail sits on the panel edges
      const L = Math.hypot(bx - ax, by - ay, DEPTH);
      _p.set((ax + bx) / 2, (ay + by) / 2, -DEPTH / 2);
      _w.set(bx - ax, by - ay, -DEPTH).normalize();
      _q.setFromUnitVectors(ZAXIS, _w.multiplyScalar(-1));
      this.rails.setMatrixAt(k, _m.compose(_p, _q, _s.set(1, 1, L)));
      // the glow strip on the inside of the rail
      const r0 = Math.hypot(ax, ay) || 1, ix = -ax / r0 * 0.22, iy = -ay / r0 * 0.22;
      _p.x += ix; _p.y += iy;
      this.railGlow.setMatrixAt(k, _m.compose(_p, _q, _s.set(1, 1, L)));
      this.rimCap.setMatrixAt(k, _m.compose(_v.set(ax, ay, 0.1), _q.identity(), _s.set(1, 1, 1)));
    }
    for (let l = 0; l < 16; l++) {
      if (l >= n) { for (const m of [this.rimBar, this.rimGlow, this.throatRing]) m.setMatrixAt(l, _m.makeScale(0, 0, 0)); for (let j = 0; j < 8; j++) this.ribs.setMatrixAt(l * 8 + j, _m.makeScale(0, 0, 0)); continue; }
      const A = P[l], B = P[this.closed ? (l + 1) % n : l + 1];
      const tx = B[0] - A[0], ty = B[1] - A[1], tl = Math.hypot(tx, ty), a = Math.atan2(ty, tx), nx = -ty / tl, ny = tx / tl;
      _q.setFromAxisAngle(ZAXIS, a);
      this.rimBar.setMatrixAt(l, _m.compose(_v.set((A[0] + B[0]) / 2 - nx * 0.28, (A[1] + B[1]) / 2 - ny * 0.28, 0.1), _q, _s.set(tl, 1, 1)));
      this.rimGlow.setMatrixAt(l, _m.compose(_v.set((A[0] + B[0]) / 2 + nx * 0.02, (A[1] + B[1]) / 2 + ny * 0.02, 0.56), _q, _s.set(tl * 0.96, 1, 1)));
      this.throatRing.setMatrixAt(l, _m.compose(_v.set((A[0] + B[0]) / 2 * FAR, (A[1] + B[1]) / 2 * FAR, -DEPTH), _q, _s.set(tl * FAR, 1.6, 1.6)));
      for (let j = 0; j < 8; j++) {
        const d = (j + 1) / 9, k = 1 - d * (1 - FAR);
        this.ribs.setMatrixAt(l * 8 + j, _m.compose(_v.set(((A[0] + B[0]) / 2 - nx * 0.18) * k, ((A[1] + B[1]) / 2 - ny * 0.18) * k, -d * DEPTH), _q, _s.set(tl * k * 1.02, 1, 1)));
      }
    }
    // outer frame: o = how far outside the glass it sits
    {
      const o = 0.85, NS = 5;
      const seg = (i, ax, ay, az, bx, by, bz, w) => { _w.set(bx - ax, by - ay, bz - az); const L = _w.length(); _q.setFromUnitVectors(YAXIS, _w.normalize()); this.outer.setMatrixAt(i, _m.compose(_v.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2), _q, _s.set(w, L, w))); };
      let k = 0;
      for (let l = 0; l < 16; l++) {
        if (l >= n) { for (let j = 0; j < 9; j++) this.outer.setMatrixAt(k++, _m.makeScale(0, 0, 0)); continue; }
        const A = P[l], B = P[this.closed ? (l + 1) % n : l + 1];
        const tx = B[0] - A[0], ty = B[1] - A[1], tl = Math.hypot(tx, ty) || 1, ox = ty / tl * o, oy = -tx / tl * o;
        const at = (C, j) => { const d = j / (NS - 1), kk = 1 - d * (1 - FAR); return [C[0] * kk + ox, C[1] * kk + oy, -d * DEPTH]; };
        for (let j = 0; j < NS; j++) { const a = at(A, j), b = at(B, j); seg(k++, ...a, ...b, j === 0 ? 0.42 : 0.3); }
        for (let j = 0; j < NS - 1; j++) { const flip = (l + j) % 2; const a = at(flip ? B : A, j), b = at(flip ? A : B, j + 1); seg(k++, ...a, ...b, 0.14); }
      }
      for (let i = 0; i < 17; i++) {
        if (i >= nPts) { this.outer.setMatrixAt(k++, _m.makeScale(0, 0, 0)); continue; }
        const A = P[i % n === i || !this.closed ? i : i % n], r = Math.hypot(A[0], A[1]) || 1, ux = A[0] / r * o * 1.2, uy = A[1] / r * o * 1.2;
        seg(k++, A[0] + ux, A[1] + uy, 0.2, A[0] * FAR + ux, A[1] * FAR + uy, -DEPTH, 0.22);
      }
    }
    for (const m of [this.rails, this.railGlow, this.rimBar, this.rimGlow, this.rimCap, this.ribs, this.throatRing, this.outer]) m.instanceMatrix.needsUpdate = true;
    // the far end: a swirling disc for a closed tube, nothing for an open trench
    this.throat.visible = this.closed;
    this.throat.scale.set(TR * FAR * 1.1, TR * FAR * 1.1, 1);
  }

  // ---------------------------------------------------------------- backdrops (all built at boot, one shown)
  buildBackdrops() {
    this.backs = [];
    const q = this.q, S = this.scene;
    const stars = (n, r, size, seed, tint = [1, 1, 1]) => {
      const rnd = mkr(seed), pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const u = rnd() * 2 - 1, a = rnd() * TAU, s = Math.sqrt(1 - u * u);
        pos[i * 3] = Math.cos(a) * s * r; pos[i * 3 + 1] = u * r; pos[i * 3 + 2] = Math.sin(a) * s * r;
        const k = 0.4 + Math.pow(rnd(), 3) * 3.5;
        col[i * 3] = k * tint[0] * (0.8 + rnd() * 0.3); col[i * 3 + 1] = k * tint[1] * (0.85 + rnd() * 0.2); col[i * 3 + 2] = k * tint[2];
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const p = new THREE.Points(g, new THREE.PointsMaterial({ size, sizeAttenuation: false, vertexColors: true, map: this.T.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      p.frustumCulled = false; p.renderOrder = -5;
      return p;
    };
    const motes = (n, spread, color, size, seed, k = 2.5) => {
      const rnd = mkr(seed), pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { const a = rnd() * TAU, r = TR * 1.3 + rnd() * spread; pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.sin(a) * r; pos[i * 3 + 2] = 20 - rnd() * (DEPTH + 120); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const p = new THREE.Points(g, new THREE.PointsMaterial({ size, color: hdr(color, k), map: this.T.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
      p.frustumCulled = false;
      return p;
    };
    // the sky: one shader for every look (soft nebula clouds, a horizon band, a glow from one side)
    const sky = (FG, a, b, c, seed, o = {}) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1400, 48, 24), new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false,
        uniforms: { uA: { value: hdr(a, 1) }, uB: { value: hdr(b, 1) }, uC: { value: hdr(c, 1) }, uSeed: { value: seed }, uDir: { value: new THREE.Vector3(...(o.dir || [0, 1, 0])).normalize() }, uK: { value: o.k ?? 1 } } }));
      m.renderOrder = -10; m.frustumCulled = false; FG.add(m);
      return m;
    };
    // a rough inside-out cavern around the tube (abyss trench walls, the molten core's chamber)
    const cavern = (group, mat, r, seed, rep = [6, 8]) => {
      const g = new THREE.CylinderGeometry(r, r, 420, 72, 28, true);
      g.rotateX(Math.PI / 2);
      const p = g.attributes.position, rnd = mkr(seed);
      const bumps = Array.from({ length: 46 }, () => [rnd() * TAU, -rnd() * 420 + 210, 4 + rnd() * 14, 6 + rnd() * 18]);
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(y, x);
        let k = 1 + Math.sin(a * 5 + z * 0.03) * 0.06 + Math.sin(a * 13 - z * 0.07) * 0.03 + Math.sin(a * 29 + z * 0.19) * 0.012;
        for (const [ba, bz, bh, bw] of bumps) { const da = Math.abs(((a - ba + Math.PI * 3) % TAU) - Math.PI) * r, dz = z - bz, d2 = (da * da + dz * dz) / (bw * bw); if (d2 < 4) k -= (bh / r) * Math.exp(-d2); }
        p.setXYZ(i, x * k, y * k, z);
      }
      g.computeVertexNormals();
      const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * rep[0], uv.getY(i) * rep[1]);
      const m = new THREE.Mesh(g, mat); m.position.z = -100; group.add(m);
      return m;
    };
    const rockSet = TX.rockTex(this.q.tex >= 1024 ? 512 : 256, 23);
    for (const t of [rockSet.map, rockSet.normalMap, rockSet.roughnessMap]) t.repeat.set(1, 1);
    const lava = TX.lavaTex(512, 29), spots = TX.spotsTex(512, 41);
    // smooth boulders floating around the tube
    const rocksIn = (group, n, seed, mat, rad, sz, ys = 1) => {
      const rnd = mkr(seed), geo = MD.boulderGeometry(seed);
      const I = new THREE.InstancedMesh(geo, mat, n);
      for (let i = 0; i < n; i++) {
        const a = rnd() * TAU, s = sz[0] + rnd() * (sz[1] - sz[0]), sy = s * ys * (0.6 + rnd()), r = Math.max(rad[0] + rnd() * (rad[1] - rad[0]), TR * 1.45 + Math.max(s, sy) * 1.35);
        _e.set(rnd() * 3, rnd() * 3, rnd() * 3); _q.setFromEuler(_e);
        const z = 30 - rnd() * (DEPTH + 160), rr = z < -DEPTH + 12 ? Math.max(r, 46 + Math.max(s, sy) * 1.35) : r;
        I.setMatrixAt(i, _m.compose(_v.set(Math.cos(a) * rr, Math.sin(a) * rr, z), _q, _s.set(s, sy, s)));
      }
      group.add(I);
      return I;
    };
    // blinking beacons (small glowing beads whose size pulses; one instanced mesh per look)
    const beacons = (group, pts, color, size) => {
      const I = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: hdr(color, 6), toneMapped: false }), pts.length);
      I.frustumCulled = false; group.add(I);
      group.userData.anim.push((t) => { pts.forEach(([x, y, z, ph], i) => { const k = Math.pow(Math.max(0, Math.sin(t * 2.2 + ph)), 12) * size + size * 0.15; I.setMatrixAt(i, _m.compose(_v.set(x, y, z), _q.identity(), _s.set(k, k, k))); }); I.instanceMatrix.needsUpdate = true; });
      return I;
    };
    // each look: G holds the scenery around the tube (fixed in the world, so a dive flies past it) and
    // G.userData.far the sky (stars, planets, the black hole) that rides with the camera
    const look = () => { const G = new THREE.Group(), FG = new THREE.Group(); G.userData.anim = []; G.userData.far = FG; return [G, FG]; };
    // 1 ORBITAL RING: a banded gas giant with its own rings below, a hot sun, a far moon, the arc of the
    // orbital ring overhead and the web's trusses running off into space with habitat pods and beacons
    {
      const [G, FG] = look();
      sky(FG, 0x01030a, 0x1a1030, 0x2a3a6a, 3.1, { dir: [0.7, 0.4, -0.6], k: 0.8 });
      FG.add(stars(q.stars, 1500, 2.2, 11));
      const planet = new THREE.Mesh(new THREE.SphereGeometry(420, 96, 64), new THREE.MeshStandardMaterial({ map: TX.bandsTex(5), roughness: 0.95, metalness: 0, fog: false }));
      planet.position.set(-160, -560, -820); planet.rotation.set(0.35, 0, 0.22); FG.add(planet);
      const atmo = new THREE.Mesh(new THREE.SphereGeometry(436, 64, 48), new THREE.ShaderMaterial({ vertexShader: ATMO_VERT, fragmentShader: ATMO_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uColor: { value: new THREE.Color(1.2, 0.8, 0.5) } }, fog: false }));
      atmo.position.copy(planet.position); FG.add(atmo);
      const rt = TX.ringTex(7);
      const ringG = new THREE.RingGeometry(520, 860, 128, 1);
      { const p = ringG.attributes.position, uv = ringG.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (Math.hypot(p.getX(i), p.getY(i)) - 520) / 340, 0.5); }
      const rings = new THREE.Mesh(ringG, new THREE.MeshBasicMaterial({ map: rt, color: hdr(0xffe8d0, 0.6), transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      rings.position.copy(planet.position); rings.rotation.set(-Math.PI / 2 + 0.35, 0.1, 0.22); FG.add(rings);
      const moon = new THREE.Mesh(new THREE.SphereGeometry(38, 32, 24), new THREE.MeshStandardMaterial({ color: 0x9a9690, map: rockSet.map, roughness: 1, fog: false }));
      moon.position.set(-620, 240, -1000); FG.add(moon);
      G.userData.anim.push((t) => { planet.rotation.y = t * 0.004; rings.rotation.z = 0.22 + t * 0.001; });
      const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: hdr(0xfff0d0, 8), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      sun.position.set(700, 420, -1400); sun.scale.set(240, 240, 1); FG.add(sun);
      const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: hdr(0xffd8a0, 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      streak.position.copy(sun.position); streak.scale.set(1400, 22, 1); FG.add(streak);
      // ring trusses: long girders leaving the tube to both sides, with habitat pods and beacons
      const truss = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), this.ribMat, 200);
      let k = 0; const bp = [];
      for (const s of [-1, 1]) for (let i = 0; i < 20; i++) {
        const x = s * (TR * 1.4 + i * 9);
        for (const y of [-2.2, 2.2]) truss.setMatrixAt(k++, _m.compose(_v.set(x, y - 3, -18), _q.identity(), _s.set(9.2, 0.5, 0.5)));
        for (const z of [-15.5, -20.5]) truss.setMatrixAt(k++, _m.compose(_v.set(x, -3, z), _q.identity(), _s.set(9.2, 0.35, 0.35)));
        _q.setFromAxisAngle(ZAXIS, s * 0.6); truss.setMatrixAt(k++, _m.compose(_v.set(x, -3, -18), _q, _s.set(0.35, 5.2, 0.35)));
        if (i % 5 === 2) bp.push([x, 0.2, -18, i * 1.3]);
      }
      truss.count = k; G.add(truss);
      const hab = new THREE.InstancedMesh(new THREE.CylinderGeometry(2.2, 2.2, 7, 20).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd8dce2, metalness: 0.6, roughness: 0.35 }), 6);
      [[-1, 4], [1, 7], [-1, 13], [1, 15], [-1, 18], [1, 2]].forEach(([s, i], n) => hab.setMatrixAt(n, _m.compose(_v.set(s * (TR * 1.4 + i * 9), -6.5, -18), _q.identity(), _s.set(1, 1, 1))));
      G.add(hab);
      beacons(G, bp, 0xff4a3a, 0.6);
      this.backs.push(G);
    }
    // 2 ABYSS TRENCH: black water, walls crusted with glowing colonies, smooth boulders, drifting jellies,
    // marine snow and faint light from far above
    {
      const [G, FG] = look();
      sky(FG, 0x000204, 0x001a1a, 0x0a3a44, 7.7, { dir: [0, 1, 0], k: 0.7 });
      const wall = new THREE.MeshStandardMaterial({ color: 0x22363c, map: rockSet.map, normalMap: rockSet.normalMap, roughness: 0.9, side: THREE.BackSide, emissive: 0xffffff, emissiveIntensity: 0.3, emissiveMap: spots });
      cavern(G, wall, 70, 5, [7, 9]);
      const rock = new THREE.MeshStandardMaterial({ color: 0x2c444a, map: rockSet.map, normalMap: rockSet.normalMap, roughness: 0.85, metalness: 0.05, emissive: 0xffffff, emissiveIntensity: 0.22, emissiveMap: spots });
      rocksIn(G, Math.round(46 * q.props), 21, rock, [TR * 2.0, TR * 6], [2.5, 7], 1.2);
      const m1 = motes(q.motes, 40, 0x3fffc0, 0.45, 31, 2.2), m2 = motes(Math.round(q.motes * 0.5), 30, 0xc8e8ff, 0.22, 37, 1.4);
      G.add(m1, m2);
      G.userData.anim.push((t) => { m1.position.y = Math.sin(t * 0.2) * 1.5; m1.rotation.z = t * 0.01; m2.position.y = -((t * 0.8) % 12) + 6; m2.rotation.z = -t * 0.004; });
      // jellies: glowing bells with trailing tentacles, pulsing as they drift
      const jm = new THREE.MeshBasicMaterial({ color: hdr(0x7affd0, 1.1), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const NJ = 28, jelly = new THREE.InstancedMesh(MD.jellyGeometry(), jm, NJ);
      jelly.setColorAt(0, _c.setRGB(1, 1, 1));
      const rj = mkr(41), jp = [];
      for (let i = 0; i < NJ; i++) { const a = rj() * TAU, r = TR * 1.6 + rj() * 34; jp.push([Math.cos(a) * r, Math.sin(a) * r, 10 - rj() * 140, 1.0 + rj() * 2.2, rj() * 6]); const cc = rj(); jelly.setColorAt(i, cc < 0.6 ? _c.setRGB(0.6, 1.2, 1.0) : cc < 0.85 ? _c.setRGB(0.6, 0.8, 1.4) : _c.setRGB(1.3, 0.6, 1.2)); }
      jelly.frustumCulled = false; G.add(jelly);
      G.userData.anim.push((t) => { jp.forEach((j, i) => { const b = Math.sin(t * 1.4 + j[4]) * 0.12; _e.set(Math.sin(t * 0.2 + j[4]) * 0.3, t * 0.1 + j[4], 0); _q.setFromEuler(_e); jelly.setMatrixAt(i, _m.compose(_v.set(j[0], j[1] + Math.sin(t * 0.3 + j[4]) * 2 + ((t * 0.6 + j[4] * 3) % 8), j[2]), _q, _s.set(j[3] * (1 + b), j[3] * (1 - b * 1.5), j[3] * (1 + b)))); }); jelly.instanceMatrix.needsUpdate = true; });
      this.backs.push(G);
    }
    // 3 MOLTEN CORE: dark basalt walls split by broad rivers of lava, molten falls pouring down, glowing
    // boulders and embers rising toward the furnace light at the bottom of the shaft
    {
      const [G, FG] = look();
      sky(FG, 0x0a0201, 0x3a0a02, 0xff5a10, 13.3, { dir: [0, 0, -1], k: 0.6 });
      const wall = new THREE.MeshStandardMaterial({ color: 0x2a201c, map: rockSet.map, normalMap: rockSet.normalMap, roughness: 0.88, side: THREE.BackSide, emissive: 0xffffff, emissiveIntensity: 0.55, emissiveMap: lava });
      cavern(G, wall, 62, 9, [2, 3]);
      const rock = new THREE.MeshStandardMaterial({ color: 0x3a2c26, map: rockSet.map, normalMap: rockSet.normalMap, roughness: 0.9, metalness: 0.05, emissive: 0xff6a1a, emissiveIntensity: 1.3, emissiveMap: TX.crackTex(512, 17) });
      rocksIn(G, Math.round(56 * q.props), 51, rock, [TR * 2.1, TR * 5.5], [2.5, 6.5], 1.0);
      // lava falls: flowing sheets on the cavern wall
      const fallTex = TX.lavaTex(256, 77); fallTex.repeat.set(0.25, 2);
      const fallMat = new THREE.MeshBasicMaterial({ map: fallTex, color: hdr(0xffffff, 0.8), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false });
      const rf = mkr(91);
      for (let i = 0; i < 8; i++) { const a = rf() * TAU, s = new THREE.Mesh(new THREE.PlaneGeometry(9 + rf() * 8, 220), fallMat); s.position.set(Math.cos(a) * 52, Math.sin(a) * 52, -60 - rf() * 80); _m.makeBasis(_v.set(-Math.sin(a), Math.cos(a), 0), _w.set(0, 0, 1), _p.set(Math.cos(a), Math.sin(a), 0)); s.quaternion.setFromRotationMatrix(_m); G.add(s); }
      G.userData.anim.push((t) => { fallTex.offset.y = -t * 0.15; });
      const em = motes(Math.round(q.motes * 0.8), 30, 0xff7a2a, 0.35, 57, 3);
      G.add(em);
      G.userData.anim.push((t) => { em.position.y = (t * 2.5) % 20 - 10; em.rotation.z = t * 0.02; });
      const glowBall = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: hdr(0xff5a10, 3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      glowBall.position.set(0, 0, -DEPTH - 200); glowBall.scale.set(260, 260, 1); FG.add(glowBall);
      this.backs.push(G);
    }
    // 4 CRYSTAL MOON: the web hangs above a frozen moon (a curved ice plain with crystal spires), a ringed
    // planet and aurora in the sky, ice crystals around the tube and drifting snow
    {
      const [G, FG] = look();
      sky(FG, 0x02060e, 0x0a2a3a, 0x3a6a9a, 21.9, { dir: [0, 1, 0], k: 0.9 });
      FG.add(stars(Math.round(q.stars * 0.6), 1500, 1.8, 61, [0.8, 0.9, 1.1]));
      const planet = new THREE.Mesh(new THREE.SphereGeometry(180, 64, 48), new THREE.MeshStandardMaterial({ map: TX.bandsTex(13, [[0.62, 0.72, 0.86], [0.5, 0.6, 0.78], [0.78, 0.86, 0.95], [0.42, 0.5, 0.68]]), roughness: 1, fog: false }));
      planet.position.set(520, 330, -1150); planet.scale.setScalar(0.8); FG.add(planet);
      const ringG = new THREE.RingGeometry(230, 380, 128, 1);
      { const p = ringG.attributes.position, uv = ringG.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (Math.hypot(p.getX(i), p.getY(i)) - 230) / 150, 0.5); }
      const rings = new THREE.Mesh(ringG, new THREE.MeshBasicMaterial({ map: TX.ringTex(19, [0.8, 0.9, 1]), color: hdr(0xffffff, 0.8), transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      rings.position.copy(planet.position); rings.scale.setScalar(0.8); rings.rotation.set(-1.2, 0.3, 0.1); FG.add(rings);
      // aurora curtains
      this.auroraMat = new THREE.ShaderMaterial({ vertexShader: STRIP_VERT, fragmentShader: AURORA_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false, uniforms: { uTime: { value: 0 } } });
      for (let i = 0; i < 3; i++) { const a = new THREE.Mesh(new THREE.PlaneGeometry(1600, 260, 64, 1), this.auroraMat); a.position.set(-300 + i * 300, 380 + i * 40, -1100 + i * 120); a.rotation.set(0.25, -0.3 + i * 0.3, 0); FG.add(a); }
      // the moon's surface: a vast curved ice plain under the web, with spires of crystal rising out of it
      const ice = TX.iceTex(this.q.tex >= 1024 ? 512 : 256, 61);
      for (const t of [ice.map, ice.normalMap, ice.roughnessMap]) t.repeat.set(10, 10);
      const gg = new THREE.PlaneGeometry(1400, 1400, 96, 96); gg.rotateX(-Math.PI / 2);
      { const p = gg.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, -(x * x + z * z) / 2000 + Math.sin(x * 0.05) * Math.sin(z * 0.04) * 3); } gg.computeVertexNormals(); }
      const ground = new THREE.Mesh(gg, new THREE.MeshStandardMaterial({ color: 0xd0e6ff, map: ice.map, normalMap: ice.normalMap, roughnessMap: ice.roughnessMap, roughness: 1, metalness: 0.05, envMapIntensity: 1.3 }));
      ground.position.set(0, -95, -120); G.add(ground);
      const iceMat = new THREE.MeshStandardMaterial({ color: 0xbfe0ff, roughness: 0.1, metalness: 0.15, transparent: true, opacity: 0.72, emissive: 0x2a6aa8, emissiveIntensity: 0.55, envMapIntensity: 2.2, flatShading: true });
      const cg = MD.crystalCluster(), rs = mkr(83), NS = Math.round(50 * q.props);
      const spires = new THREE.InstancedMesh(cg, iceMat, NS);
      for (let i = 0; i < NS; i++) {
        const x = (rs() - 0.5) * 420, z = 40 - rs() * 380, y = -97 - (x * x + (z + 120) * (z + 120)) / 2000;
        _q.setFromUnitVectors(YAXIS, _w.set((rs() - 0.5) * 0.5, 1, (rs() - 0.5) * 0.5).normalize());
        const s = 5 + rs() * 12;
        spires.setMatrixAt(i, _m.compose(_p.set(x, y, z), _q, _s.set(s, s * (1.2 + rs() * 1.4), s)));
      }
      G.add(spires);
      const rc = mkr(71), N = Math.round(56 * q.props);
      const I = new THREE.InstancedMesh(MD.crystalCluster(), iceMat, N);
      for (let i = 0; i < N; i++) {
        const a = rc() * TAU, s = 0.8 + rc() * 2.4, r = TR * 1.5 + s * 2.6 + rc() * TR * 3;
        _v.set(Math.cos(a), Math.sin(a), 0);
        _q.setFromUnitVectors(YAXIS, _w.set(_v.x + (rc() - 0.5) * 0.8, _v.y + (rc() - 0.5) * 0.8, (rc() - 0.5) * 0.6).normalize());
        I.setMatrixAt(i, _m.compose(_p.set(_v.x * r, _v.y * r, 20 - rc() * (DEPTH + 120)), _q, _s.set(s, s * 1.3, s)));
      }
      G.add(I);
      const sn = motes(Math.round(q.motes * 0.7), 26, 0xdfefff, 0.3, 77);
      G.add(sn);
      G.userData.anim.push((t) => { sn.position.y = -((t * 1.2) % 16) + 8; planet.rotation.y = t * 0.01; this.auroraMat.uniforms.uTime.value = t; });
      this.backs.push(G);
    }
    // 5 EVENT HORIZON: a black hole with a blazing accretion disc, a photon ring and twin jets (the post pass
    // bends light around it), a violet nebula, and debris spiralling in past the web
    {
      const [G, FG] = look();
      sky(FG, 0x000000, 0x1a0a2a, 0x3a1a5a, 31.7, { dir: [0, 0.2, -1], k: 0.9 });
      FG.add(stars(Math.round(q.stars * 1.2), 1500, 2.0, 81, [1, 0.95, 1.1]));
      const bh = new THREE.Group(); bh.position.set(-330, 200, -760); bh.rotation.set(0.2, 0.4, 0); FG.add(bh);
      bh.add(new THREE.Mesh(new THREE.SphereGeometry(70, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000, fog: false })));
      this.diskMat = new THREE.ShaderMaterial({ vertexShader: STRIP_VERT, fragmentShader: DISK_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uTime: { value: 0 } }, fog: false });
      const disk = new THREE.Mesh(new THREE.PlaneGeometry(560, 560), this.diskMat); disk.rotation.x = -1.32; bh.add(disk);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(74, 1.6, 12, 96), new THREE.MeshBasicMaterial({ color: hdr(0xffc890, 2.2), fog: false })); bh.add(halo);
      const photon = new THREE.Mesh(new THREE.TorusGeometry(79, 0.7, 8, 96), new THREE.MeshBasicMaterial({ color: hdr(0xfff0e0, 3.5), fog: false })); bh.add(photon);
      const jetMat = new THREE.MeshBasicMaterial({ map: this.T.glow, color: hdr(0x9ab8ff, 1.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
      for (const s of [-1, 1]) { const j = new THREE.Mesh(new THREE.PlaneGeometry(40, 520), jetMat); j.position.y = s * 300; bh.add(j); const j2 = j.clone(); j2.rotation.y = Math.PI / 2; bh.add(j2); }
      G.userData.anim.push((t) => { this.diskMat.uniforms.uTime.value = t; bh.rotation.z = Math.sin(t * 0.05) * 0.05; });
      G.userData.lens = bh;
      // debris and gas spiralling in past the web
      const rk = new THREE.MeshStandardMaterial({ color: 0x3a3440, map: rockSet.map, normalMap: rockSet.normalMap, roughness: 0.8, metalness: 0.2 });
      const deb = rocksIn(G, Math.round(30 * q.props), 97, rk, [TR * 2.2, TR * 6], [1, 4], 1);
      const sw = motes(Math.round(q.motes * 0.7), 60, 0xc09aff, 0.5, 99, 2.2);
      G.add(sw);
      G.userData.anim.push((t) => { sw.rotation.z = t * 0.06; deb.rotation.z = t * 0.012; });
      this.backs.push(G);
    }
    for (const G of this.backs) { G.visible = false; G.userData.far.visible = false; S.add(G, G.userData.far); }
  }

  setLook(i) {
    if (i === this.lookI) return;
    this.lookI = i; const L = this.look = LOOKS[i];
    this.scene.environment = this.envFor(i);
    this.scene.background = new THREE.Color(L.sky);
    this.backs.forEach((G, k) => { G.visible = k === i; G.userData.far.visible = k === i; });
    this.scene.fog.color.set(L.fog); this.scene.fog.density = L.fogD;
    this.key.color.set(L.key); this.key.intensity = L.keyI; this.key.position.set(...L.keyDir).normalize().multiplyScalar(80);
    this.hemi.color.set(L.hemi[0]); this.hemi.groundColor.set(L.hemi[1]); this.hemi.intensity = L.hemi[2];
    this.fill.color.set(L.fill); this.fill.intensity = L.fillI; this.fill.position.set(-L.keyDir[0], -L.keyDir[1], 0.4);
    this.laneMat.color.set(L.lane); this.laneMat.emissive.set(L.laneEm); this.laneMat.envMapIntensity = L.laneEnv ?? 0.85; this.laneMat.roughness = L.laneR ?? 0.46;
    this.ribMat.color.set(L.rib);
    this.glowMat.color.copy(hdr(L.rail, 2.2));
    this.throatMat.uniforms.uColor.value.copy(hdr(L.throat, L.throatK ?? 0.9));
    for (const l of this.lamps) { l.color.set(L.lamp); l.intensity = L.lampI * 0.35; }
    this.shotMat.color.copy(hdr(L.shot, 5));
    this.boltMat.color.copy(hdr(L.bolt, 5));
    this.fx.setLook(L);
  }

  // ---------------------------------------------------------------- pools: shots, bolts, spines, lane strips
  makePools() {
    const R = this.root;
    this.shotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.shotI = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.14, 1.6, 4, 8).rotateX(Math.PI / 2), this.shotMat, 96);
    this.haloMat = new THREE.MeshBasicMaterial({ map: this.T.glow, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    this.boltMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.boltI = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.42, 0), this.boltMat, 64);
    this.boltHalo = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: this.T.glow, color: hdr(0xff8a4a, 1.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 64);
    this.spineMat = new THREE.MeshStandardMaterial({ color: 0xd8b8ff, roughness: 0.08, metalness: 0.2, emissive: 0x6a2ad8, emissiveIntensity: 1.1, transparent: true, opacity: 0.88, envMapIntensity: 2.4 });
    this.spineI = new THREE.InstancedMesh(MD.spineGeometry(), this.spineMat, 900);
    // a soft halo in each threat's class colour behind every climber and pod (readable at phone size)
    this.haloI = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.T.glow, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 96);
    for (let i = 0; i < 96; i++) this.haloI.setColorAt(i, _c.setRGB(1, 1, 1));
    this.haloI.renderOrder = 2;
    for (const I of [this.shotI, this.boltI, this.boltHalo, this.spineI, this.haloI]) { I.frustumCulled = false; I.count = 0; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); R.add(I); }
    // dive streaks: light lines rushing past the camera while it flies down the tube
    this.streakMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false });
    this.streaks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.025, 0.025, 1), this.streakMat, 160);
    this.streaks.frustumCulled = false; this.streaks.visible = false; this.streaks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const rs = mkr(5);
    this.streakP = Array.from({ length: 160 }, () => [rs() * TAU, 3.5 + rs() * 7, rs(), 0.5 + rs()]);
    this.scene.add(this.streaks);
    this.streakK = 0;
    this.boltHalo.renderOrder = 4;
    // lane strips
    this.strips = [];
    for (let i = 0; i < 20; i++) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), 2));
      g.setIndex([0, 1, 2, 1, 3, 2]);
      const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: STRIP_VERT, fragmentShader: STRIP_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color() }, uProg: { value: 0 }, uTime: { value: 0 }, uKind: { value: 0 }, uAlpha: { value: 1 } } }));
      m.frustumCulled = false; m.visible = false; m.renderOrder = 3;
      R.add(m); this.strips.push(m);
    }
    this.stripN = 0;
    // the boss's pull, crush and charge glow: a soft sprite
    this.glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.T.glow, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    this.glowSprite.visible = false; R.add(this.glowSprite);
  }
  strip(L, d0, d1, color, kind, prog = 0, alpha = 1, lift = 0.06) {
    const m = this.strips[this.stripN++];
    if (!m) return;
    const p = m.geometry.attributes.position;
    const a = this.lanePt(L - 0.5, d0, { ...LP }), b = this.lanePt(L + 0.5, d0, { ...LP }), c = this.lanePt(L - 0.5, d1, { ...LP }), e = this.lanePt(L + 0.5, d1, { ...LP });
    const mid = this.lanePt(L, 0.5, _lp2);
    const lx = mid.nx * lift, ly = mid.ny * lift;
    p.setXYZ(0, a.x + lx, a.y + ly, a.z); p.setXYZ(1, b.x + lx, b.y + ly, b.z); p.setXYZ(2, c.x + lx, c.y + ly, c.z); p.setXYZ(3, e.x + lx, e.y + ly, e.z);
    p.needsUpdate = true;
    const u = m.material.uniforms;
    u.uColor.value.copy(hdr(color, kind === 2 ? 3.4 : 2.2)); u.uKind.value = kind; u.uProg.value = prog; u.uAlpha.value = alpha * (CALM.on && kind === 2 ? 0.55 : 1); u.uTime.value = this.time;
    m.visible = true;
  }

  // ---------------------------------------------------------------- views
  place(g, c, d, lift = 0.5, faceRim = false, roll = 0, yaw = 0) {
    const P = this.lanePt(c, d, _lp1);
    g.position.set(P.x + P.nx * lift, P.y + P.ny * lift, P.z);
    g.rotation.order = 'ZYX';
    g.rotation.set(roll, (faceRim ? Math.PI : 0) + yaw, P.a);
    const s = 1 - d * (1 - FAR) * 0.5;
    g.scale.setScalar(s);
    return P;
  }
  playerView(p) {
    // the local player wears this device's paint; the co-op partner stays red-orange (localPid: 1, or 2 on a co-op guest)
    const mine = p.id === (this.localPid || 1);
    const color = mine ? this.suit.color : 0xff5a3a, accent = mine ? this.suit.accent : 0xffd27a;
    const v = MD.rimrunner(color, accent);
    const sh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 20), new THREE.ShaderMaterial({ vertexShader: SHIELD_VERT, fragmentShader: SHIELD_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(accent, 1.4) }, uK: { value: 0 }, uTime: { value: 0 } } }));
    sh.scale.set(1, 0.55, 1.2); sh.position.y = 0.4; v.g.add(sh); v.shield = sh;
    v.flash = 0; v.recoil = 0; v.dead = false;
    this.root.add(v.g);
    return v;
  }
  enemyView(e) {
    const t = e.type;
    const v = t === 'splitter' ? MD.splitter() : t === 'hopper' ? MD.hopper() : t === 'spinewright' ? MD.spinewright() : t === 'mite' ? MD.mite() : t === 'lancer' ? MD.lancer() : t === 'shocker' ? MD.shocker() : MD.mirror();
    v.type = t; v.hit = 0;
    this.ownMaterials(v);
    this.root.add(v.g);
    return v;
  }
  ownMaterials(v) {
    const map = new Map(); v.flashMats = [];
    v.g.traverse((m) => {
      if (!m.isMesh || !m.material || !m.material.isMeshStandardMaterial) return;
      let c = map.get(m.material);
      if (!c) { c = m.material.clone(); map.set(m.material, c); v.flashMats.push(c); }
      m.material = c;
    });
    v.flashK = 0;
  }
  // boss hit punch: the core flashes hot white and kicks back down the tube for a moment (render only)
  bossHitLook(V, dt) {
    // a punch left over from the killing blow must not carry into the next boss
    if (this.punchV !== V) { this.punchV = V; this.bossPunch = 0; }
    const p = this.bossPunch || 0;
    if (p <= 0) return;
    this.bossPunch = Math.max(0, p - dt * 7);
    const k = p * p;
    this.setFlash(V.core, Math.max(V.core.flashK || 0, k * (CALM.on ? 0.25 : 0.55)));
    V.core.g.position.z -= k * 1.6;
    V.core.g.scale.multiplyScalar(1 + k * 0.06);
  }
  setFlash(v, k) {
    if (!v.flashMats || Math.abs(k - (v.flashK || 0)) < 0.01) return;
    v.flashK = k;
    for (const m of v.flashMats) m.emissive.setRGB(k * 1.5, k * 1.45, k * 1.35);
  }
  // the world position of a lane point (for effects, sounds and the HUD)
  worldAt(c, d, lift = 0.6, out = _wpos) {
    const P = this.lanePt(c, d, _lp1);
    out.set(P.x + P.nx * lift, P.y + P.ny * lift, P.z);
    return this.root.localToWorld(out);
  }

  sync(W, dt) {
    const t = this.time;
    this.setWeb(W.shape, W.rot, W.breathe);
    this.stripN = 0;
    // a turning web sends a chase of light round its rim in the turning direction; a breathing web's rim
    // swells and dims with it
    {
      const rv = W.def ? W.def.rot || 0 : 0, bv = W.def ? W.def.breathe || 0 : 0;
      if (rv || bv || this.rimLit) {
        for (let l = 0; l < this.n; l++) {
          let k = 1;
          if (rv) { const ph = l / this.n - t * 0.45 * Math.sign(rv); k += 2.4 * Math.pow(Math.max(0, Math.cos(ph * TAU * 2)), 12); }
          if (bv) k += 1.1 * (0.5 + 0.5 * W.breathe / bv);
          this.rimGlow.setColorAt(l, _c.setRGB(k, k, k));
        }
        this.rimGlow.instanceColor.needsUpdate = true; this.rimLit = !!(rv || bv);
      }
    }
    // players
    const seenP = new Set();
    for (const p of W.players) {
      seenP.add(p.id);
      let v = this.views.p.get(p.id);
      if (!v) { v = this.playerView(p); this.views.p.set(p.id, v); }
      const show = p.alive || p.drag > 0;
      v.g.visible = show && !v.broken;
      if (p.alive) v.broken = false;
      if (!show) continue;
      const hop = p.hop > 0 ? Math.sin(Math.PI * (1 - p.hop / F.hopT)) * 2.6 : 0;
      const spin = p.drag > 0 ? p.drag * 9 : 0;
      this.place(v.g, p.pos, p.alive ? p.d : p.drag, 0.55 + hop + Math.sin(t * 3 + p.id) * 0.05, false, -p.tilt * 0.35 + spin, 0);
      v.g.scale.multiplyScalar(1.05);
      v.recoil = Math.max(0, v.recoil - dt * 8);
      if (v.barL) { v.barL.position.z = -0.95 + v.recoil * 0.18; v.barR.position.z = -0.95 + v.recoil * 0.18; }
      const thr = 1 + Math.abs(p.vel) * 0.04 + (W.phase === 'dive' ? 1.2 : 0) + Math.sin(t * 40) * 0.08;
      if (v.engL) { v.engL.scale.set(1, 1, thr); v.engR.scale.set(1, 1, thr); }
      v.shield.material.uniforms.uK.value = p.inv > 0 ? 0.5 + 0.5 * Math.sin(t * 20) : p.plate > 0 ? 0.28 : 0;
      v.shield.material.uniforms.uTime.value = t;
      v.flash = Math.max(0, v.flash - dt * 4);
    }
    for (const [id, v] of this.views.p) if (!seenP.has(id)) { this.root.remove(v.g); this.views.p.delete(id); }
    // a rider that grabbed a Rimrunner rides it down the lane, claws shut, until the drag is over
    for (const [pid, D] of this.draggers) {
      const p = W.players.find((q) => q.id === pid);
      if (!p || p.alive || !(p.drag > 0)) { this.root.remove(D.v.g); this.draggers.delete(pid); continue; }
      this.place(D.v.g, p.pos, Math.min(1, p.drag + 0.028), 0.62, true, p.drag * 5, 0);
      D.v.g.scale.multiplyScalar(1.22);
      if (D.v.arms && D.v.arms[0]) { D.v.arms[0].rotation.y = -0.75; D.v.arms[1].rotation.y = 0.75; }
      if (D.v.legs) for (let i = 0; i < D.v.legs.length; i++) D.v.legs[i].rotation.x = 0.6 + Math.sin(t * 14 + i) * 0.15;
      this.setFlash(D.v, 0.3 + 0.25 * Math.sin(t * 24));
    }
    // the headlights follow player 1 down its lane
    const me = W.players[0];
    for (let i = 0; i < 2; i++) {
      const H = this.heads[i], p = W.players[i] || null;
      if (p && p.alive) {
        this.worldAt(p.pos, p.d, 1.4, H.position);
        this.worldAt(p.pos, Math.min(1, p.d + 0.6), 0.2, H.target.position);
        H.intensity = 110;
      } else H.intensity = 0;
    }
    void me;
    // enemies
    const seen = new Set();
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.gone) continue;
      seen.add(e.id);
      let v = this.views.e.get(e.id);
      if (!v) { v = this.enemyView(e); this.views.e.set(e.id, v); }
      this.poseEnemy(v, e, W, dt);
    }
    for (const [id, v] of this.views.e) if (!seen.has(id)) { this.root.remove(v.g); this.views.e.delete(id); }
    this.syncShots(W);
    this.syncHalos(W, t);
    this.syncSpines(W);
    this.syncPods(W, t);
    this.syncDroids(W, dt);
    this.syncBoss(W, dt);
    this.syncStrips(W);
    for (let i = this.stripN; i < this.strips.length; i++) this.strips[i].visible = false;
  }
  poseEnemy(v, e, W, dt) {
    const t = this.time;
    let c = e.lane, lift = 0.35, roll = 0;
    // a hop between lanes: up and over in an arc
    if (e.fl && e.tell <= 0 && e.type !== 'mite') { const f = Math.min(1, e.fl.t / e.fl.T); lift += Math.sin(Math.PI * f) * 1.6; roll = Math.sin(Math.PI * f) * 0.6 * Math.sign(e.fl.b - e.fl.a); }
    const crouch = e.tell > 0 ? 1 : 0;
    const emerge = Math.min(1, (0.6 - e.born) / 0.6 + 0.001);
    this.place(v.g, c, e.d, lift - crouch * 0.15, true, roll, 0);
    v.g.scale.multiplyScalar(1.22 * (0.25 + 0.75 * emerge));
    v.hit = Math.max(v.hit - dt * 6, e.hitT > 0 ? 1 : 0);
    this.setFlash(v, v.hit * 0.8 + (e.grabT > 0 ? 0.4 + 0.4 * Math.sin(t * 30) : 0));
    switch (e.type) {
      case 'splitter': {
        const k = Math.max(0, 1 - (e.d - 0.3) / 0.15);
        if (v.L) { v.L.position.x = -0.42 - k * 0.25; v.R.position.x = 0.42 + k * 0.25; }
        v.g.rotation.z += Math.sin(t * 2 + e.id) * 0.08;
        break;
      }
      case 'hopper':
        for (let i = 0; i < v.legs.length; i++) v.legs[i].rotation.x = (crouch ? 0.5 : 0) + Math.sin(t * 8 + i) * 0.1;
        if (v.arms[0]) { const g = e.grabT > 0 ? 0.6 : 0.1 + Math.sin(t * 3) * 0.1; v.arms[0].rotation.y = -g; v.arms[1].rotation.y = g; }
        break;
      case 'spinewright': v.segs.forEach((s, i) => { s.position.x = Math.sin(t * 5 - i * 0.9) * 0.12; }); break;
      case 'mite': if (v.ring) { v.ring.rotation.z = t * 6; v.ring.rotation.x = Math.sin(t * 3) * 0.6; } if (v.core) v.core.scale.setScalar(0.85 + Math.random() * 0.35 + (e.tell > 0 ? 0.4 : 0)); break;
      case 'lancer': if (v.charge) v.charge.scale.setScalar(e.cool ? 1.2 + Math.sin(t * 30) * 0.3 : 0.7); break;
      case 'shocker': {
        const z = W.zaps.find((q) => q.src === e.id);
        const k = z ? (z.t < 0 ? 1 + (1 + z.t / z.T) * 1.5 : 2.6) : 0.8;
        for (const tip of v.tips) if (tip) tip.scale.setScalar(k + Math.random() * 0.2);
        break;
      }
      case 'mirror': if (v.shell) { v.shell.rotation.y = t * 1.4; v.shell.rotation.x = t * 0.7; v.shell.visible = e.sh > 0; } break;
    }
  }
  syncShots(W) {
    let n = 0;
    for (const s of W.shots) {
      if (n >= 96) break;
      const P = this.lanePt(s.lane, Math.min(1, s.d), _lp1);
      const lift = 0.7;
      _q.setFromAxisAngle(ZAXIS, P.a);
      const k = 1 - s.d * (1 - FAR) * 0.6;
      if (s.twin) {
        for (const o of [-0.38, 0.38]) { if (n >= 96) break; this.shotI.setMatrixAt(n++, _m.compose(_v.set(P.x + P.nx * lift + P.tx * o, P.y + P.ny * lift + P.ty * o, P.z - 0.8), _q, _s.set(k, k, k))); }
      } else this.shotI.setMatrixAt(n++, _m.compose(_v.set(P.x + P.nx * lift, P.y + P.ny * lift, P.z - 0.8), _q, _s.set(k * (s.droid ? 0.7 : 1), k * (s.droid ? 0.7 : 1), k)));
    }
    this.shotI.count = n; this.shotI.instanceMatrix.needsUpdate = true;
    let b = 0;
    const cam = this.camera;
    this.root.getWorldQuaternion(_q2).invert(); _q3.copy(cam.quaternion).premultiply(_q2);
    for (const q of W.bolts) {
      if (b >= 64) break;
      const P = this.lanePt(q.lane, q.d, _lp1);
      _e.set(this.time * 4 + q.id, this.time * 3, 0); _q.setFromEuler(_e);
      const s = q.kind === 'reflect' ? 0.8 : 1;
      _v.set(P.x + P.nx * 0.75, P.y + P.ny * 0.75, P.z);
      this.boltI.setMatrixAt(b, _m.compose(_v, _q, _s.set(s, s, s)));
      // the halo faces the camera
      this.boltHalo.setMatrixAt(b, _m.compose(_v, _q3, _s.set(s, s, s)));
      b++;
    }
    this.boltI.count = b; this.boltHalo.count = b;
    this.boltI.instanceMatrix.needsUpdate = true; this.boltHalo.instanceMatrix.needsUpdate = true;
  }
  syncHalos(W, t) {
    let n = 0;
    const put = (c, d, lift, size, hex, k) => {
      if (n >= 96) return;
      const P = this.lanePt(c, d, _lp1), s = (1 - d * (1 - FAR) * 0.5) * size;
      this.haloI.setMatrixAt(n, _m.compose(_v.set(P.x + P.nx * lift, P.y + P.ny * lift, P.z - 0.2), _q3, _s.set(s, s, s)));
      _c.set(hex).multiplyScalar(k * (CALM.on ? 0.7 : 1));
      this.haloI.setColorAt(n, _c); n++;
    };
    for (const e of W.enemies) {
      if (e.hp <= 0) continue;
      const hot = e.tell > 0 || e.cool || e.grabT > 0 ? 1.2 + 0.5 * Math.sin(t * 24) : 0.7;
      put(e.lane, e.d, 1.0, 4.4, MD.CLASS_COLOR[e.type] || 0xffffff, hot * Math.min(1, (0.6 - e.born) / 0.6 + 0.2));
    }
    for (const q of W.pods) put(q.lane, q.d, 1.2, 3.2, POWERUPS[q.kind].color, 0.7 + 0.2 * Math.sin(t * 6 + q.id));
    this.haloI.count = n; this.haloI.instanceMatrix.needsUpdate = true;
    if (this.haloI.instanceColor) this.haloI.instanceColor.needsUpdate = true;
  }
  syncSpines(W) {
    let n = 0;
    for (let L = 0; L < W.spine.length; L++) {
      const sp = W.spine[L];
      if (sp >= 1) continue;
      const len = (1 - sp) * DEPTH, cnt = Math.max(1, Math.ceil(len / 1.7));
      for (let i = 0; i < cnt && n < 900; i++) {
        const d = sp + ((i + 0.5) / cnt) * (1 - sp);
        const P = this.lanePt(L + Math.sin(i * 1.7 + L) * 0.12, d, _lp1);
        _e.set(Math.sin(i * 2.3) * 0.25, Math.cos(i * 1.3) * 0.2, P.a + i * 0.9); _q.setFromEuler(_e);
        const k = (1 - d * (1 - FAR) * 0.6) * (i === 0 ? 1.25 : 1);
        this.spineI.setMatrixAt(n++, _m.compose(_v.set(P.x + P.nx * 0.45, P.y + P.ny * 0.45, P.z), _q, _s.set(k * 1.6, k * 1.6, (len / cnt) * 1.05)));
      }
    }
    this.spineI.count = n; this.spineI.instanceMatrix.needsUpdate = true;
  }
  syncPods(W, t) {
    const seen = new Set();
    for (const q of W.pods) {
      seen.add(q.id);
      let v = this.views.pk.get(q.id);
      if (!v) { v = MD.pod(POWERUPS[q.kind].color, q.kind); this.root.add(v.g); this.views.pk.set(q.id, v); }
      this.place(v.g, q.lane, q.d, 0.6 + Math.sin(t * 4 + q.id) * 0.15, true, 0, t * 2);
    }
    for (const [id, v] of this.views.pk) if (!seen.has(id)) { this.root.remove(v.g); this.views.pk.delete(id); }
  }
  syncDroids(W, dt) {
    const seen = new Set();
    for (const q of W.droids) {
      seen.add(q.id);
      let v = this.views.dr.get(q.id);
      if (!v) { v = MD.droid(); this.root.add(v.g); this.views.dr.set(q.id, v); }
      this.place(v.g, q.lane, 0.015, 0.5, false, 0, 0);
      if (v.head) v.head.rotation.y = Math.sin(this.time * 2) * 0.15;
      v.g.scale.multiplyScalar(q.t < 1.5 ? (Math.sin(this.time * 20) > 0 ? 1 : 0.6) : 1);
    }
    for (const [id, v] of this.views.dr) if (!seen.has(id)) { this.root.remove(v.g); this.views.dr.delete(id); }
    void dt;
  }
  syncBoss(W, dt) {
    const B = W.boss;
    // the middle tube lamp moves up in front of a boss and burns brighter (same light, only moved)
    const lamp = this.lamps[1];
    if (B && B.state !== 'dying') { lamp.position.set(0, 0, -B.d * DEPTH + 18); lamp.intensity = this.look.lampI * 0.6; }
    else { lamp.position.set(0, 0, -40); lamp.intensity = this.look.lampI * 0.35; }
    if (!B) { if (this.bossV) this.clearBoss(); return; }
    if (B.state === 'dying') { if (this.bossV) this.bossV.core.g.scale.multiplyScalar(1 + dt * 0.25); return; }
    if (!this.bossV || this.bossV.key !== B.key || this.bossV.n !== W.nl) this.makeBoss(B, W);
    const V = this.bossV, t = this.time;
    // the core sits on the tube axis at the boss's depth
    const s = 1 - B.d * (1 - FAR);
    V.core.g.position.set(0, 0, -B.d * DEPTH);
    V.core.g.scale.setScalar(s * 1.7);
    V.core.g.rotation.z = B.rot * (TAU / W.nl) * (B.key === 'furnace' ? 1 : 0.5);
    if (V.core.spin) { V.core.spin.rotation.z = t * 0.8; V.core.spin.rotation.x = Math.sin(t * 0.5) * 0.3; }
    if (V.core.core) {
      const open = B.eye ? B.eye.open : !(B.segs && B.segs.some((x) => x > 0)) || B.heads.length && !B.heads.some((h) => h.hp > 0);
      V.core.core.scale.setScalar((open ? 1.15 : 0.95) + Math.sin(t * 6) * 0.04 + B.hitT * 2);
    }
    this.setFlash(V.core, Math.pow(Math.min(1, Math.max(0, B.hitT) / 0.15), 6) * 0.14);
    this.bossHitLook(V, dt);
    // armour segments, one per lane, turning with B.rot
    if (V.segs.length) V.segs.forEach((sv, i) => {
      const alive = B.segs[i] > 0;
      sv.g.visible = alive;
      if (!alive) return;
      this.place(sv.g, i + B.rot, B.d, 0.2, true, 0, 0);
      const k = sv.g.scale.x;
      sv.g.scale.set(this.lanePt(i + B.rot, B.d, _lp1).w / 2.9, k * 1.4, k * 1.4);
    });
    // hydra heads
    V.heads.forEach((hv, i) => {
      const h = B.heads[i];
      hv.g.visible = !!h && h.hp > 0;
      if (!hv.g.visible) return;
      const lunge = h.lunge > 0 ? Math.max(0, 1 - h.lunge / 0.9) : 0;
      this.place(hv.g, h.lane, Math.max(0.02, h.d - lunge * h.d), 0.6 + Math.sin(t * 2 + i) * 0.3, true, Math.sin(t * 1.5 + i) * 0.15, 0);
      hv.g.scale.multiplyScalar(1.8);
      if (hv.jaw) hv.jaw.rotation.x = -(0.2 + Math.sin(t * 4 + i) * 0.15 + lunge * 0.6);
      this.setFlash(hv, Math.min(0.4, Math.max(0, h.hitT) * 4));
    });
    // the prism queen's eye glows in its lane
    if (B.eye) {
      const E = B.eye, G = this.glowSprite;
      const P = this.lanePt(E.lane, B.d - 0.02, _lp1);
      G.position.set(P.x * 0.4, P.y * 0.4, P.z + 1);
      const tell = !E.open && E.t < 1 ? 1 - E.t : 0;
      G.material.color.copy(hdr(0xff5ad0, E.open ? 4 : 1 + tell * 2));
      G.scale.setScalar(E.open ? 9 : 4 + tell * 3);
      G.visible = true;
    } else this.glowSprite.visible = false;
    void dt;
  }
  makeBoss(B, W) {
    this.clearBoss();
    const core = MD.bossCore(B.key);
    this.ownMaterials(core);
    // a boss is a heavy dark machine: its own material copies take less of the bright tube reflection
    // (uniforms only, so nothing recompiles)
    for (const m of core.flashMats) { m.envMapIntensity = 0.45; if (m.clearcoat) m.clearcoatRoughness = 0.5; }
    this.root.add(core.g);
    const segs = [];
    if (B.segs) for (let i = 0; i < W.nl; i++) { const sv = MD.armourSeg(B.key); this.root.add(sv.g); segs.push(sv); }
    const heads = [];
    for (let i = 0; i < B.heads.length; i++) { const hv = MD.hydraHead(); this.ownMaterials(hv); this.root.add(hv.g); heads.push(hv); }
    this.bossV = { key: B.key, n: W.nl, core, segs, heads };
  }
  clearBoss() {
    const V = this.bossV;
    if (!V) return;
    this.root.remove(V.core.g);
    for (const s of V.segs) this.root.remove(s.g);
    for (const h of V.heads) this.root.remove(h.g);
    this.bossV = null; this.glowSprite.visible = false;
  }
  syncStrips(W) {
    const me = W.players[0];
    const L = this.look;
    for (const p of W.players) if (p.alive && W.phase !== 'intro') this.strip(p.lane, Math.max(0, p.d), Math.min(1, p.d + 0.9), p.id === (this.localPid || 1) ? L.rail : 0xff9a5a, 0, 0, W.phase === 'dive' ? 0.5 : 0.9);
    for (const z of W.zaps) {
      const col = z.kind === 'shock' || z.kind === 'sweep' ? 0x9fe8ff : z.kind === 'flare' ? 0xff7a2a : z.kind === 'beam' ? 0xff5ad0 : z.kind === 'pull' ? 0xb08aff : 0xff5a3a;
      if (z.t < 0) this.strip(z.lane, 0, 1, col, 1, 1 + z.t / z.T, 0.9);
      else this.strip(z.lane, 0, 1, col, 2, 1, 1);
    }
    // lancer charges and boss volley tells: a short strip from the shooter up to the rim
    for (const e of W.enemies) if (e.type === 'lancer' && e.cool) this.strip(Math.round(e.lane), 0, e.d, 0xffb03a, 1, 1 - Math.max(0, e.fireT) / Math.max(0.01, W.R.warn), 0.6);
    const B = W.boss;
    if (B && B.cur && !B.cur.passive && B.cur.lanes) for (const Ln of B.cur.lanes) this.strip(Ln, 0, B.d, B.cur.kind === 'pull' ? 0xb08aff : 0xff8a3a, B.cur.kind === 'pull' ? 3 : 1, B.cur.t / B.cur.T, 0.85);
    if (B && B.pull) this.strip(B.pull.lane, 0, 1, 0xb08aff, 3, 1, 0.8);
    // rim riders about to grab: their lane flickers red at the rim
    for (const e of W.enemies) if (e.rim && e.grabT > 0) this.strip(Math.round(e.lane), 0, 0.12, this.tellSafe ? 0xffc21a : 0xff3a2a, 2, 1, 0.8);
    for (const e of W.enemies) {
      if (e.hp <= 0 || !(e.tell > 0)) continue;
      if (e.type === 'mite' && e.d < 0.1) this.strip(Math.round(e.lane), 0, 0.14, 0x5ae8ff, 1, 1, 0.75);
      // a pounce: the Rimrunner's own lane flares red and fills as the crouch runs out
      else if (e.fl && e.pounce) this.strip(Math.round(e.fl.b), 0, 0.24, this.tellSafe ? 0xffc21a : 0xff2412, 1, 1 - Math.max(0, e.tell) / Math.max(0.05, e.tellT || 0.5), 0.95);
      else if (e.fl && e.d < 0.12) this.strip(Math.round(e.fl.b), 0, 0.12, this.tellSafe ? 0x4f7bff : 0x7dff6a, 1, 1, 0.6);
    }
    void me;
  }

  // ---------------------------------------------------------------- effects from events
  // break a model into its real parts that tumble away down the tube
  breakApart(v, o = {}) {
    if (!v || !v.g) return;
    const g = v.g; g.updateMatrixWorld(true);
    const parts = MD.partsOf(g);
    if (!parts) { if (!o.clone) this.root.remove(g); return; }
    const cap = o.max ?? 18, pw = o.power ?? 1;
    const list = parts.filter((q) => !q.mat.transparent).map((q) => { if (!q.g.boundingSphere) q.g.computeBoundingSphere(); _s.setFromMatrixScale(q.m); return { q, size: q.g.boundingSphere.radius * Math.max(_s.x, _s.y, _s.z) }; }).sort((a, b) => b.size - a.size).slice(0, cap);
    const wm = new THREE.Matrix4(), center = new THREE.Vector3().setFromMatrixPosition(g.matrixWorld);
    for (const { q, size } of list) {
      if (size < 0.03) continue;
      if (this.pieces.length >= 220) this.scene.remove(this.pieces.shift().g);
      const parent = q.parent ? g.getObjectByName(q.parent) : g;
      if (!parent) continue;
      wm.multiplyMatrices(parent.matrixWorld, q.m);
      const c = q.g.boundingSphere.center, wc = c.clone().applyMatrix4(wm);
      wm.decompose(_p, _q, _s);
      const pivot = new THREE.Group(); pivot.position.copy(wc); pivot.quaternion.copy(_q); pivot.scale.copy(_s);
      const mesh = MD.partMesh(q); mesh.position.copy(c).multiplyScalar(-1);
      pivot.add(mesh); this.scene.add(pivot);
      _v.subVectors(wc, center); if (_v.lengthSq() < 1e-4) _v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5); _v.normalize();
      const light = clamp(0.35 / Math.max(0.05, size), 0.5, 1.6), sp = (2 + Math.random() * 4) * pw * light, life = 1.2 + Math.random() * 1.2;
      this.pieces.push({ g: pivot, vx: _v.x * sp, vy: _v.y * sp, vz: _v.z * sp - 4 * Math.random(), wx: (Math.random() - 0.5) * 12, wy: (Math.random() - 0.5) * 12, wz: (Math.random() - 0.5) * 12, life, max: life, sc: _s.clone() });
    }
    if (o.clone) { g.visible = false; v.broken = true; } else this.root.remove(g);
  }
  updatePieces(dt) {
    if (!this.pieces.length) return;
    const keep = [];
    for (const P of this.pieces) {
      P.life -= dt;
      if (P.life <= 0) { this.scene.remove(P.g); continue; }
      const g = P.g;
      P.vx *= 1 - dt * 0.4; P.vy *= 1 - dt * 0.4; P.vz -= 3 * dt;
      g.position.x += P.vx * dt; g.position.y += P.vy * dt; g.position.z += P.vz * dt;
      _e.set(P.wx * dt, P.wy * dt, P.wz * dt); _q.setFromEuler(_e); g.quaternion.multiply(_q);
      g.scale.copy(P.sc).multiplyScalar(Math.min(1, P.life / 0.5));
      keep.push(P);
    }
    this.pieces = keep;
  }
  burst(c, d, size, o = {}) {
    const w = this.worldAt(c, d, 0.6, _wb);
    this.fx.explode(w.x, w.y, w.z, size, { metal: true, rock: false, shards: true, color: o.color, ringColor: o.ring, smoke: o.smoke });
    if (o.shock !== false) this.shock(w, size * 0.6);
    this.trauma = Math.min(1, this.trauma + (o.shake ?? 0.12 * size));
  }
  sparksAt(c, d, o = {}) { const w = this.worldAt(c, d, o.lift ?? 0.6, _wb); this.fx.sparks(w.x, w.y, w.z, o); }
  // a kill deep in the tube still pops on screen: a flare that keeps a minimum on-screen size
  farPop(c, d, color) {
    if (d < 0.35) return;
    const w = this.worldAt(c, d, 0.6, _wb);
    this.fx.pop(w.x, w.y, w.z, w.distanceTo(this.camera.position), color);
  }
  // a boss hit: hot sparks, a flash light at the core, a punch on the core and a pulse on the HUD bar
  bossHitFx(e) {
    this.sparksAt(e.lane, e.d, { n: 16, speed: 9, r: 1, g: 0.8, b: 0.5 });
    this.sparksAt(e.lane, e.d, { n: 6, speed: 4, s: 0.4, life: 0.9, grav: 3, r: 1, g: 0.55, b: 0.2 });
    const w = this.worldAt(e.lane, e.d, 0.6, _wb);
    this.fx.flash(w.x, w.y, w.z, 22, 0xffd0a0, 0.18);
    this.fx.pop(w.x, w.y, w.z, w.distanceTo(this.camera.position) * 0.7, 0xffc080);
    this.bossPunch = 1; this.bossHits = (this.bossHits || 0) + 1;
    this.trauma = Math.min(1, this.trauma + 0.08);
  }
  onEvent(e, W) {
    const L = this.look;
    switch (e.k) {
      case 'kill': {
        const v = this.views.e.get(e.id);
        const size = { splitter: 1.2, hopper: 1.0, spinewright: 1.4, mite: 0.8, lancer: 1.3, shocker: 1.3, mirror: 1.2 }[e.type] || 1;
        if (v) { this.breakApart(v, { max: 14 }); this.views.e.delete(e.id); }
        this.burst(e.lane, e.d, size, { color: e.type === 'mite' ? 0x9fe8ff : 0xffa060 });
        this.farPop(e.lane, e.d, e.type === 'mite' ? 0x9fe8ff : 0xffb070);
        break;
      }
      case 'hit': this.sparksAt(e.lane, e.d, { n: 8, speed: 6, r: 1, g: 0.85, b: 0.6 }); break;
      case 'reflect': this.sparksAt(e.lane, e.d, { n: 16, speed: 7, r: 1, g: 0.4, b: 0.9 }); this.flashScreen(0.08, 0xff5ad0); break;
      case 'boltpop': this.sparksAt(e.lane, e.d, { n: 7, speed: 5, r: 1, g: 0.6, b: 0.3 }); break;
      case 'chip': this.sparksAt(e.lane, e.d, { n: e.gone ? 18 : 8, speed: 6, r: 0.8, g: 0.6, b: 1 }); break;
      case 'split': this.sparksAt(e.lane, e.d, { n: 20, speed: 7, r: 1, g: 0.5, b: 0.2 }); break;
      case 'death': {
        const v = this.views.p.get(e.pid);
        const p = W.players.find((q) => q.id === e.pid);
        if (e.cause !== 'grab' && v) { this.breakApart(v, { max: 20, clone: true, power: 1.4 }); this.burst(e.lane, e.d, 2.2, { color: 0xff8a4a, shake: 0.6 }); }
        else {
          this.trauma = Math.min(1, this.trauma + 0.4);
          // the rider that grabbed it keeps hold and drags it down the lane (the sim has already let it go)
          const gv = e.src != null && this.views.e.get(e.src);
          if (gv) { this.views.e.delete(e.src); const old = this.draggers.get(e.pid); if (old) this.root.remove(old.v.g); this.draggers.set(e.pid, { v: gv }); }
        }
        if (p) this.flashScreen(0.3, 0xff6040);
        break;
      }
      case 'plate': { this.sparksAt(e.lane, 0, { n: 26, speed: 8, r: 0.6, g: 0.9, b: 1 }); this.flashScreen(0.12, 0x9fe8ff); this.trauma = Math.min(1, this.trauma + 0.25); break; }
      case 'purge': {
        this.flashScreen(e.full ? 0.5 : 0.25, 0xd7a6ff);
        for (let i = 0; i < (e.full ? 3 : 1); i++) { const w = this.worldAt(e.lane, 0.15 + i * 0.3, 0, _wb); this.shock(w, 1.4); }
        this.trauma = Math.min(1, this.trauma + 0.35);
        break;
      }
      case 'zap': this.sparksAt(e.lane, 0.05, { n: 14, speed: 6, r: 0.6, g: 0.9, b: 1 }); break;
      case 'bosshit': this.bossHitFx(e); break;
      case 'clank': case 'refract': this.sparksAt(e.lane, e.d, { n: 5, speed: 5, r: 0.7, g: 0.8, b: 1 }); break;
      case 'seg': this.burst(e.lane, e.d, 1.2, { color: 0x9fe8ff }); break;
      case 'headdown': this.burst(e.lane, e.d, 1.8, { color: 0x7dffd8 }); break;
      case 'bosskill': {
        const V = this.bossV;
        if (V) { this.breakApart(V.core, { max: 40, power: 2 }); for (const s of V.segs) if (s.g.visible) this.breakApart(s, { max: 4, power: 1.6 }); for (const h of V.heads) if (h.g.visible) this.breakApart(h, { max: 8, power: 1.6 }); this.bossV = null; this.glowSprite.visible = false; }
        const w = _wb.set(0, 0, -e.d * DEPTH); this.root.localToWorld(w);
        for (let i = 0; i < 4; i++) this.fx.explode(w.x + (Math.random() - 0.5) * 6, w.y + (Math.random() - 0.5) * 6, w.z + (Math.random() - 0.5) * 4, 4, { metal: true, rock: false, shards: true });
        this.shock(w, 3); this.flashScreen(0.5, 0xffe0b0); this.trauma = 1;
        break;
      }
      case 'crush': this.flashScreen(0.4, 0xb08aff); this.trauma = 1; break;
      case 'webclear': this.flashScreen(0.12, L.rail); break;
      case 'pickup': this.sparksAt(e.lane, 0, { n: 24, speed: 6, r: 0.6, g: 1, b: 0.7 }); break;
      case 'emerge': this.sparksAt(e.lane, 1, { n: 6, speed: 3, r: 0.8, g: 0.8, b: 1, lift: 0.5 }); break;
      case 'web': if (W.n > 2) { this.fadeIn = 1; this.snapNext = true; } break;
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
  }
  setScale(s) { if (Math.abs(s - this.scale) < 0.02) return; this.scale = s; this.resize(); }
  get portrait() { return this.camera.aspect < 0.85; }
  frameShot(c, d, dur) { this.shot = { c, d, t: dur }; }
  // boss fights: while the boss rises the camera swings toward the tube axis and looks at it (a title shot),
  // then it stays pushed in a little so the boss fills more of the frame; sets this.bossFov (added to the fov)
  bossCam(W, P, pos, look, ux, uy, tall) {
    const B = W.boss; this.bossFov = 0;
    if (!B || B.state === 'dying') return;
    const bz = -B.d * DEPTH;
    if (B.state === 'in') {
      const f = Math.min(1, Math.max(0, (1.3 - B.d) / Math.max(0.05, 1.3 - (B.d0 ?? 1))));
      const sm = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
      const k = sm(0, 0.15, f) * (1 - sm(0.82, 1, f)) * 0.8;
      pos.lerp(_dv.set(P.x * 0.45 + ux * 2.2, P.y * 0.45 + uy * 2.2, P.z + (tall ? 20 : 13)), k);
      look.lerp(_dl.set(0, 0, bz), k);
      this.bossFov = -(tall ? 8 : 12) * k;
      return;
    }
    // in the fight: lean the view toward the boss and narrow the lens a little
    // (portrait keeps its lens: the whole web just fits a tall screen, a narrower fov cuts off the far rim lanes)
    look.lerp(_dl.set(0, 0, bz), tall ? 0.1 : 0.16);
    this.bossFov = tall ? 0 : -7;
  }
  // o: { W, me (player) or null, cine, shake }
  updateCamera(dt, o = {}) {
    const W = o.W, tall = this.portrait;
    let pos = _cp.set(0, 0, 30), look = _cl.set(0, 0, -30), up = _cu.set(0, 1, 0), fov = tall ? 78 : 62, speed = 4;
    if (o.cine || !W) {
      // the title: a slow drift around the outside of the web, looking into it
      const a = this.time * 0.06;
      pos.set(Math.sin(a) * 36, 10 + Math.sin(a * 0.7) * 8, 26 + Math.cos(a) * 14);
      look.set(0, 0, -DEPTH * 0.45); fov = tall ? 80 : 58; speed = 1.5;
    } else {
      const me = o.me || W.players.find((p) => p.alive) || W.players[0];
      const d = me ? (me.alive ? me.d : (me.drag || me.d)) : 0;
      const c = me ? me.pos : 0;
      const P = this.lanePt(c, Math.min(1, d), _lp3);
      // the camera sits behind the rim, above the Rimrunner toward the tube's centre, and rolls so the
      // lane's inward normal points up the screen (open trenches only lean a little)
      // a chase view: above and behind the sled, tilted ~7 degrees down the tube
      const ux = P.nx, uy = P.ny;
      if (tall) {
        // portrait: the classic view into the tube from behind the rim, so the whole web fits a narrow screen
        // (nearer than a plain fit and leaning toward the player's side, so the web fills more of a tall screen)
        const fit = Math.min(1, 0.62 / Math.max(0.3, this.camera.aspect));
        pos.set(P.x * 0.5 + ux * 2.4, P.y * 0.5 + uy * 2.4, P.z + 25 + 4 * fit);
        look.set(-P.x * 0.06, -P.y * 0.06, P.z - 46);
      } else {
        const back = 15.5, high = 5.4, ahead = 28, drop = high - Math.tan(0.12) * (back + ahead);
        pos.set(P.x + P.nx * high, P.y + P.ny * high, P.z + back);
        look.set(P.x + P.nx * drop, P.y + P.ny * drop, P.z - ahead);
      }
      up.set(ux, uy, 0);
      if (W.phase === 'dive') {
        const f = Math.min(1, W.diveT / Math.max(0.1, W.diveDur)), k = f * f * (3 - 2 * f) * 0.85 + Math.min(1, f * 4) * 0.15;
        pos.lerp(_dv.set(P.x * 0.42 + ux * 1.6, P.y * 0.42 + uy * 1.6, P.z + 10), k);
        look.lerp(_dl.set(0, 0, P.z - 40), k);
        fov += 6 + 10 * k; speed = 8;
      }
      this.bossFov = 0; if (W.phase !== 'dive') this.bossCam(W, P, pos, look, ux, uy, tall);
      fov += this.bossFov;
      if (this.shot && this.shot.t > 0) {
        this.shot.t -= dt;
        const S = this.lanePt(this.shot.c, this.shot.d, _lp3);
        pos.set(S.x * 0.6 + S.nx * 3, S.y * 0.6 + S.ny * 3, S.z + 9); look.set(S.x, S.y, S.z - 2); fov = tall ? 70 : 50; speed = 5;
      }
      this.root.localToWorld(pos); this.root.localToWorld(look);
      up.applyQuaternion(this.root.quaternion);
    }
    if (this.dbgCam) { pos.fromArray(this.dbgCam.pos); look.fromArray(this.dbgCam.look); up.set(0, 1, 0); fov = this.dbgCam.fov || 40; o.snap = true; }
    if (this.snapNext) { o.snap = true; this.snapNext = false; }
    const k = o.snap ? 1 : 1 - Math.exp(-dt * speed);
    this.camPos.lerp(pos, k); this.camLook.lerp(look, k); this.camUp.lerp(up, o.snap ? 1 : 1 - Math.exp(-dt * speed * 0.8)).normalize();
    this.camFov += (fov - this.camFov) * k;
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    const sh = this.trauma * this.trauma * (o.shake ?? 1) * 0.6;
    const c = this.camera;
    c.position.copy(this.camPos);
    if (sh > 0) { c.position.x += (Math.random() - 0.5) * sh; c.position.y += (Math.random() - 0.5) * sh; }
    c.up.copy(this.camUp);
    c.lookAt(this.camLook);
    if (Math.abs(c.fov - this.camFov) > 0.01) { c.fov = this.camFov; c.updateProjectionMatrix(); }
    // backdrops ride with the camera (they are far away)
    for (const G of this.backs) if (G.visible) G.userData.far.position.copy(c.position);
  }
  project(x, y, z, out) {
    _v.set(x, y, z).project(this.camera);
    out.x = (_v.x * 0.5 + 0.5) * innerWidth; out.y = (-_v.y * 0.5 + 0.5) * innerHeight; out.z = _v.z;
    return out;
  }
  projectLane(c, d, out, lift = 1.2) { const w = this.worldAt(c, d, lift, _wb); return this.project(w.x, w.y, w.z, out); }
  shock(w, k = 1) {
    this.project(w.x, w.y, w.z, P0);
    if (P0.z > 1) return;
    this.shocks.push({ x: P0.x / innerWidth, y: 1 - P0.y / innerHeight, t: 0, max: 0.55, k });
    if (this.shocks.length > 6) this.shocks.shift();
  }
  flashScreen(a, color = 0xffffff) { _c.set(color); this.flash.set(_c.r, _c.g, _c.b, Math.max(this.flash.w, a * (CALM.on ? 0.25 : 0.55))); }

  render(dt, p = {}) {
    this.time += dt;
    const t = this.time;
    this.fx.update(dt);
    this.updatePieces(dt);
    const G = this.backs[this.lookI];
    if (G) for (const f of G.userData.anim) f(t);
    this.throatMat.uniforms.uTime.value = t;
    for (const m of this.strips) if (m.visible) m.material.uniforms.uTime.value = t;
    this.flash.w = Math.max(0, this.flash.w - dt * 3);
    const shocks = [];
    for (const s of this.shocks) { s.t += dt; const f = s.t / s.max; if (f >= 1) continue; shocks.push(_sv[shocks.length].set(s.x, s.y, f * 0.35 * s.k, (1 - f) * (CALM.on ? 0.3 : 0.8) * s.k)); if (shocks.length >= 6) break; }
    this.shocks = this.shocks.filter((s) => s.t < s.max);
    // the black hole bends light around itself
    const lens = [];
    if (G && G.userData.lens) {
      G.userData.lens.getWorldPosition(_v);
      this.project(_v.x, _v.y, _v.z, P0);
      // the warp is masked by depth in post.js: only the far background bends, never the web or anything on it
      if (P0.z < 1 && this.post.depthOK) { const rad = 70 / Math.max(1, this.camera.position.distanceTo(_v)) / Math.tan((this.camera.fov * Math.PI) / 360); lens.push(_lv.set(P0.x / innerWidth, 1 - P0.y / innerHeight, rad * 1.1, 0.022)); }
    }
    const L = this.look;
    this.updateStreaks(dt, p.dive ? 1 : 0);
    this.fadeIn = Math.max(0, (this.fadeIn || 0) - dt * 2.5);
    this.post.render(this.scene, this.camera, {
      bloom: L.bloom * (p.bloom ?? 1), threshold: 1.05, exposure: L.exposure * (p.exposure ?? 1) * (1 + (p.diveK || 0) * 0.6), chroma: 0.0018 + (p.dive ? 0.004 : 0), time: t, desat: p.desat || 0, fade: Math.max(p.fade || 0, this.fadeIn * 0.85), vignette: p.dive ? 0.55 : 0.4,
      flash: this.flash, tint: _tint.set(...L.grade), shocks, lens,
    });
  }

  // light streaks rushing past the camera on a dive (they ride the camera; only the dive shows them)
  updateStreaks(dt, on) {
    this.streakK += ((on ? 1 : 0) - this.streakK) * Math.min(1, dt * (on ? 3 : 6));
    const vis = this.streakK > 0.02;
    this.streaks.visible = vis;
    if (!vis) return;
    const c = this.camera, L = this.look;
    this.streakMat.color.copy(hdr(L.rail, 2.6 * this.streakK * (CALM.on ? 0.5 : 1)));
    c.getWorldDirection(_w);
    _q.setFromUnitVectors(ZAXIS, _w);
    for (let i = 0; i < this.streakP.length; i++) {
      const S = this.streakP[i];
      S[2] -= dt * S[3] * 1.6;
      if (S[2] < 0) S[2] += 1;
      const z = 4 + S[2] * 110, len = (6 + S[3] * 10) * this.streakK;
      _v.set(Math.cos(S[0]) * S[1], Math.sin(S[0]) * S[1], -z).applyQuaternion(c.quaternion).add(c.position);
      this.streaks.setMatrixAt(i, _m.compose(_v, _q, _s.set(1 + S[3], 1 + S[3], len)));
    }
    this.streaks.instanceMatrix.needsUpdate = true;
  }

  // draw one of everything once at boot, for every sector look, so nothing compiles a shader mid-game
  warmUp() {
    const tmp = [];
    const add = (v, x) => { v.g.position.set(x, 0, -10); this.root.add(v.g); tmp.push(v.g); return v; };
    let x = -20;
    for (const f of [MD.splitter, MD.hopper, MD.spinewright, MD.mite, MD.lancer, MD.shocker, MD.mirror, MD.droid]) { const v = add(f(), x); this.ownMaterials(v); x += 3; }
    for (const k of Object.keys(POWERUPS)) { add(MD.pod(POWERUPS[k].color, k), x); x += 2; }
    for (const k of BOSS_KEYS) { const v = add(MD.bossCore(k), x); this.ownMaterials(v); x += 8; if (BOSSES[k].armour) add(MD.armourSeg(k), x); }
    { const v = add(MD.hydraHead(), x); this.ownMaterials(v); }
    const pv = this.playerView({ id: 1 }), pv2 = this.playerView({ id: 2 });
    tmp.push(pv.g, pv2.g);
    for (const I of [this.shotI, this.boltI, this.boltHalo, this.spineI, this.haloI]) { I.count = 1; I.setMatrixAt(0, _m.identity()); I.instanceMatrix.needsUpdate = true; }
    this.streaks.visible = true;
    for (let i = 0; i < 4; i++) this.strips[i].visible = true;
    this.glowSprite.visible = true;
    this.fx.explode(0, 0, -10, 1, { metal: true }); this.fx.sparks(0, 0, -10, { n: 4 });
    // a broken part of each class
    const parts = MD.partsOf(tmp[0]);
    if (parts) for (const q of parts.slice(0, 6)) { const m = MD.partMesh(q); m.position.set(0, 0, -12); this.root.add(m); tmp.push(m); }
    const pr = { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] };
    const first = Math.max(0, this.lookI);
    for (let i = LOOKS.length - 1; i >= 0; i--) {
      this.lookI = -1; this.setLook(i);
      for (const s of ['circle', 'v']) { this.setWeb(s, 0, 0); this.r.compile(this.scene, this.camera); this.post.render(this.scene, this.camera, pr); }
    }
    this.lookI = -1; this.setLook(first);
    for (const I of [this.shotI, this.boltI, this.boltHalo, this.spineI, this.haloI]) I.count = 0;
    this.streaks.visible = false;
    for (const s of this.strips) s.visible = false;
    this.glowSprite.visible = false;
    for (const o of tmp) this.root.remove(o);
    this.views.p.clear();
    this.fx.clear();
  }
}
const _lp1 = { ...LP }, _lp2 = { ...LP }, _lp3 = { ...LP };
const _dv = new THREE.Vector3(), _dl = new THREE.Vector3();
const _wpos = new THREE.Vector3(), _wb = new THREE.Vector3(), _cp = new THREE.Vector3(), _cl = new THREE.Vector3(), _cu = new THREE.Vector3(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion(), _lv = new THREE.Vector4();
const _sv = Array.from({ length: 6 }, () => new THREE.Vector4());
const P0 = { x: 0, y: 0, z: 0 };
