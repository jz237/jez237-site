// Swarmbreak renderer: a walled arena in real 3D seen from a high three-quarter camera that fits the
// whole arena to the screen (turned on its side on portrait phones). Five sector looks, each with its
// own floor material, sky, light rig and scenery; every machine, survivor and the Warden animated from
// the simulation; floor decals for every warning (gates, boss tells, aim lines, arcs); HDR post.
// Nothing here changes the world.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=5';
import * as TX from './textures.js?v=5';
import * as MD from './models.js?v=5';
import { FX, CALM } from './fx.js?v=5';
import { F, GATES, POWERUPS } from './config.js?v=5';
import { dronePos } from './sim.js?v=5';

export { CALM };
const { AW, AH } = F;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const hdr = MD.hdr;

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), shadow: 4096, msaa: true, bloomLevels: 5, tex: 1024, dust: 2200, sparks: 1600, debris: 220, flashLights: 4, props: 1, rain: 2600 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), shadow: 2048, msaa: true, bloomLevels: 4, tex: 1024, dust: 1400, sparks: 1000, debris: 140, flashLights: 3, props: 0.8, rain: 1500 },
    low: { name: 'low', dpr: 1, shadow: 1024, msaa: false, bloomLevels: 3, tex: 512, dust: 700, sparks: 500, debris: 70, flashLights: 2, props: 0.5, rain: 700 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ sector looks
export const LOOKS = [
  { key: 'roof', floor: 'pavers', tint: 0xffffff, outer: 0x6f6a62, wall: 0x8c8378, accent: 0xffb347, sky: [0x18203c, 0x6a4e78, 0xff9a5a], fog: 0x5a4250, fogD: 0.006,
    sun: 0xffdcb8, keyI: 3.3, keyDir: [-0.75, 0.45, 0.48], hemi: [0x8fa0d8, 0x4a3a30, 0.55], fill: 0x6f8cff, fillI: 0.5, exposure: 1.0, grade: [1.03, 0.99, 0.95],
    dust: 0x9b9184, dustLight: 1.3, env: [0xffb070, 0x3a4a80, 0x201a20], shot: 0x8fe4ff, bloom: 0.75 },
  { key: 'metro', floor: 'tiles', tint: 0xffffff, outer: 0x2e3434, wall: 0x2b5e5a, accent: 0x3ff0c8, sky: [0x020405, 0x061012, 0x0b1a1c], fog: 0x081414, fogD: 0.014,
    sun: 0xd8f0ff, keyI: 1.9, keyDir: [-0.35, 1, 0.3], hemi: [0x5a8a88, 0x101818, 0.4], fill: 0x3ff0c8, fillI: 0.35, exposure: 1.0, grade: [0.96, 1.02, 1.02],
    dust: 0x70807c, dustLight: 0.9, env: [0xd8f0ff, 0x1d5a54, 0x050808], shot: 0x8fe4ff, bloom: 0.85 },
  { key: 'foundry', floor: 'plate', tint: 0xffffff, outer: 0x2a2420, wall: 0x4a3f36, accent: 0xff7a2a, sky: [0x0a0606, 0x2a1408, 0x6a2a0a], fog: 0x2a1508, fogD: 0.012,
    sun: 0xffd2a0, keyI: 1.5, keyDir: [0.4, 0.8, -0.5], hemi: [0x604038, 0x150a05, 0.4], fill: 0xff6a1a, fillI: 0.35, exposure: 0.95, grade: [1.05, 0.98, 0.92],
    dust: 0x5a4a40, dustLight: 1.0, env: [0xff7a2a, 0x3a2418, 0x080504], shot: 0x8fe4ff, bloom: 0.95 },
  { key: 'vault', floor: 'panel', tint: 0xffffff, outer: 0x101318, wall: 0x1c2430, accent: 0x3fb8ff, sky: [0x010205, 0x040a14, 0x0a1830], fog: 0x040a14, fogD: 0.013,
    sun: 0xb0d0ff, keyI: 1.7, keyDir: [-0.3, 0.9, 0.35], hemi: [0x40608a, 0x05070a, 0.4], fill: 0x3fb8ff, fillI: 0.5, exposure: 1.25, grade: [0.95, 1.0, 1.06],
    dust: 0x5a6070, dustLight: 0.8, env: [0x9fd0ff, 0x1a2a40, 0x020304], shot: 0xffd27a, bloom: 0.9 },
  { key: 'reactor', floor: 'grate', tint: 0xffffff, outer: 0x1a1c22, wall: 0x2a2838, accent: 0x9f7bff, sky: [0x04050a, 0x121428, 0x2a2850], fog: 0x0c0e1c, fogD: 0.011,
    sun: 0x9fb0ff, keyI: 1.6, keyDir: [0.5, 0.75, 0.42], hemi: [0x50589a, 0x08080c, 0.45], fill: 0x6fe8ff, fillI: 0.7, exposure: 1.3, grade: [0.94, 0.98, 1.08],
    dust: 0x6a6a80, dustLight: 0.8, env: [0x9fb0ff, 0x2a2850, 0x030306], shot: 0xffd27a, bloom: 0.95 },
];

// ------------------------------------------------------------------ shaders
const DECAL_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
// one shader for every warning on the floor. kind 0 = disc, 1 = lane (rect), 2 = wedge (sweep), 3 = gate portal
const DECAL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uProg, uLive, uTime, uKind, uA0, uA1, uAlpha;
varying vec2 vUv;
void main(){
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float a = 0.0;
  if (uKind < 0.5) {
    if (r > 1.0) discard;
    float edge = smoothstep(0.9, 0.97, r) * (1.0 - smoothstep(0.97, 1.0, r));
    float fill = step(r, uProg) * 0.32 + smoothstep(uProg - 0.04, uProg, r) * step(r, uProg) * 0.7;
    float hatch = step(0.5, fract((p.x + p.y) * 6.0 - uTime * 0.6)) * 0.12;
    a = edge * 0.95 + fill + hatch * (1.0 - uLive);
    if (uLive > 0.5) { float n = 0.6 + 0.4 * sin(r * 14.0 - uTime * 5.0); a = 0.55 + 0.45 * n * (1.0 - r * 0.4) + edge; }
  } else if (uKind < 1.5) {
    float ax = abs(p.x), ay = vUv.y;
    float edge = smoothstep(0.86, 0.95, ax) * (1.0 - smoothstep(0.97, 1.0, ax));
    float chev = step(0.55, fract(ay * 22.0 - abs(p.x) * 1.4 - uTime * 2.5)) * 0.35;
    a = (edge * 0.9 + chev * step(ay, max(uProg, uLive)) + 0.08) * (1.0 - smoothstep(0.85, 1.0, ay));
  } else if (uKind < 2.5) {
    if (r > 1.0) discard;
    float ang = atan(p.y, p.x);
    float lo0 = min(uA0, uA1), hi0 = max(uA0, uA1);
    float lo = mod(lo0 + 3.14159265, 6.2831853) - 3.14159265, hi = lo + (hi0 - lo0);
    float t = ang; if (t < lo) t += 6.2831853;
    float inW = step(lo, t) * step(t, hi);
    float rim = 1.0 - smoothstep(0.0, 0.05, min(abs(t - lo), abs(t - hi)));
    a = inW * (0.14 + 0.1 * step(0.5, fract(r * 10.0 - uTime * 1.5))) * smoothstep(0.08, 0.2, r) + rim * 0.8 * step(0.06, r);
    a *= 1.0 - smoothstep(0.85, 1.0, r);
  } else {
    if (r > 1.0) discard;
    float ring = smoothstep(0.72, 0.86, r) * (1.0 - smoothstep(0.92, 1.0, r));
    float sweep = fract(atan(p.y, p.x) / 6.2831853 + uTime * 0.5);
    float fill = (1.0 - smoothstep(0.0, 0.8, r)) * uProg * 0.6;
    float arcF = step(sweep, uProg) * ring;
    a = ring * 0.35 + arcF * 0.9 + fill;
  }
  gl_FragColor = vec4(uColor * a * uAlpha, 1.0);
}`;
const SKY_VERT = /* glsl */ `varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uTop, uMid, uLow; uniform float uFlash;
varying vec3 vD;
void main(){
  float h = vD.y;
  vec3 c = mix(uLow, uMid, smoothstep(-0.05, 0.18, h));
  c = mix(c, uTop, smoothstep(0.18, 0.7, h));
  c += vec3(0.6, 0.65, 1.0) * uFlash * smoothstep(-0.1, 0.5, h);
  gl_FragColor = vec4(c, 1.0);
}`;
const SHIELD_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uK, uTime;
varying vec3 vN; varying vec3 vV;
void main(){
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
  float hex = 0.5 + 0.5 * sin(vN.x * 30.0 + uTime * 2.0) * sin(vN.y * 30.0) * sin(vN.z * 30.0 - uTime);
  gl_FragColor = vec4(uColor * (f * (0.7 + hex * 0.5)) * uK, 1.0);
}`;
const SHIELD_VERT = /* glsl */ `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const FLOW_FRAG = /* glsl */ `
uniform float uTime; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = vec2(vUv.x * 30.0 - uTime * 0.6, vUv.y * 3.0);
  float v = n(p) * 0.6 + n(p * 2.3 + 7.0) * 0.4;
  float crust = smoothstep(0.55, 0.75, v);
  vec3 hot = mix(vec3(6.0, 1.6, 0.25), vec3(9.0, 4.0, 1.0), n(p * 4.0));
  gl_FragColor = vec4(mix(hot, vec3(0.08, 0.03, 0.02), crust), 1.0);
}`;

const _v = new THREE.Vector3(), _c = new THREE.Color(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler(), _tint = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

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
    this.camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.3, 900);
    this.post = new Post(r, q);
    this.T = TX.sprites();
    this.pm = new THREE.PMREMGenerator(r);
    this.envs = [];
    this.floors = {};
    MD.materials(null, TX.grimeTex(), TX.stripeTex(), TX.panelNormal(q.tex >= 1024 ? 512 : 256), q.name === 'high');
    this.suit = { color: 0x2f8cff, accent: 0x9fe8ff };
    this.time = 0; this.trauma = 0;
    this.flash = new THREE.Vector4(1, 1, 1, 0);
    this.shocks = [];
    this.lookI = -1; this.look = LOOKS[0];
    this.camPos = new THREE.Vector3(0, 40, 30); this.camLook = new THREE.Vector3(); this.camFov = 38;
    this.lean = new THREE.Vector3();
    this.shot = null;
    this.fitCache = {};
    this.lights();
    this.buildSky();
    this.buildArena();
    this.fx = new FX(this.scene, this.T, { dust: q.dust, sparks: q.sparks, debris: q.debris, flashLights: q.flashLights }, () => 0);
    this.views = { p: new Map(), e: new Map(), s: new Map(), orbs: [], pk: new Map(), dr: new Map() };
    this.view = 'close';
    this.follow = new THREE.Vector3();
    this.bossView = null;
    this.makeShots();
    this.makeDecals();
    this.makeArcs();
    this.resize();
    addEventListener('resize', () => this.resize());
    this.setLook(0);
  }

  // ---------------------------------------------------------------- lights, sky, environment
  lights() {
    const k = new THREE.DirectionalLight(0xffffff, 3);
    k.castShadow = true;
    k.shadow.mapSize.set(this.q.shadow, this.q.shadow);
    const c = k.shadow.camera;
    c.left = -30; c.right = 30; c.top = 22; c.bottom = -22; c.near = 1; c.far = 160;
    k.shadow.bias = -0.0003; k.shadow.normalBias = 0.03;
    this.scene.add(k, k.target);
    this.key = k;
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.4);
    this.scene.add(this.hemi, this.fill);
    // FIXED light pools. The number of lights in the scene never changes after boot: each sector reuses
    // these (unused ones go dark), so changing sector or spawning a Warden never triggers a shader rebuild.
    this.lightPool = [];
    for (let i = 0; i < 10; i++) { const l = new THREE.PointLight(0xffffff, 0, 20, 1.8); l.position.set(0, -50, 0); this.scene.add(l); this.lightPool.push(l); }
    this.wardenLights = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.PointLight(0x9fe8ff, 0, 7, 2); this.scene.add(l); this.wardenLights.push(l); }
  }
  buildSky() {
    this.skyMat = new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color() }, uMid: { value: new THREE.Color() }, uLow: { value: new THREE.Color() }, uFlash: { value: 0 } } });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), this.skyMat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -10;
    this.scene.add(this.sky);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
  }
  // a soft studio environment in the sector's colours for reflections on metal, glass and wet floors
  envFor(i) {
    if (this.envs[i]) return this.envs[i];
    const L = LOOKS[i], s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { a: { value: new THREE.Color(L.env[0]) }, b: { value: new THREE.Color(L.env[1]) }, c: { value: new THREE.Color(L.env[2]) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 a,b,c; varying vec3 vP; void main(){ vec3 d = normalize(vP); vec3 col = mix(c, b, smoothstep(-0.2, 0.3, d.y)); col += a * pow(max(0.0, d.y), 6.0) * 2.5; gl_FragColor = vec4(col, 1.0); }' })));
    // a few bright panels for highlights
    for (let k = 0; k < 5; k++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 1), new THREE.MeshBasicMaterial({ color: hdr(L.env[0], 4), side: THREE.DoubleSide }));
      const a = (k / 5) * Math.PI * 2; m.position.set(Math.cos(a) * 8, 4 + (k % 2) * 2, Math.sin(a) * 8); m.lookAt(0, 0, 0); s.add(m);
    }
    this.envs[i] = this.pm.fromScene(s, 0.03).texture;
    return this.envs[i];
  }

  // ---------------------------------------------------------------- the arena (floor, walls, gates) and scenery
  buildArena() {
    const S = this.scene;
    this.floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0.1, normalScale: new THREE.Vector2(1, 1) });
    const fg = new THREE.PlaneGeometry(AW * 2, AH * 2, 1, 1); fg.rotateX(-Math.PI / 2);
    const uv = fg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (AW * 2) / TX.TILE, uv.getY(i) * (AH * 2) / TX.TILE);
    this.floor = new THREE.Mesh(fg, this.floorMat); this.floor.receiveShadow = true;
    S.add(this.floor);
    this.outerMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1, metalness: 0.1 });
    const og = new THREE.PlaneGeometry(260, 200, 1, 1); og.rotateX(-Math.PI / 2);
    const ou = og.attributes.uv; for (let i = 0; i < ou.count; i++) ou.setXY(i, ou.getX(i) * 260 / TX.TILE, ou.getY(i) * 200 / TX.TILE);
    this.outer = new THREE.Mesh(og, this.outerMat); this.outer.position.y = -0.02; this.outer.receiveShadow = true;
    S.add(this.outer);
    // walls with a light strip, and gate frames
    this.wallMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.55, metalness: 0.5 });
    this.stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const T = 0.5, H = 0.9;
    const walls = new THREE.Group();
    const seg = (x, z, w, d) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, H, d), this.wallMat); m.position.set(x, H / 2, z); m.castShadow = m.receiveShadow = true; walls.add(m);
      const s = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.06, w - 0.02), 0.05, Math.max(0.06, d - 0.02)), this.stripMat); s.position.set(x, H + 0.03, z); walls.add(s);
    };
    seg(0, -AH - T / 2, AW * 2 + T * 2, T); seg(0, AH + T / 2, AW * 2 + T * 2, T);
    seg(-AW - T / 2, 0, T, AH * 2); seg(AW + T / 2, 0, T, AH * 2);
    S.add(walls);
    this.gates = [];
    const gateMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    for (const [gx, gz] of GATES) {
      const g = new THREE.Group();
      const onX = Math.abs(gz) > AH - 1.5;          // gate in a top/bottom wall
      g.position.set(onX ? gx : Math.sign(gx) * (AW + T / 2), 0, onX ? Math.sign(gz) * (AH + T / 2) : gz);
      if (!onX) g.rotation.y = Math.PI / 2;
      for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.7), this.wallMat); p.position.set(s * 1.2, 0.9, 0); p.castShadow = true; g.add(p); }
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.3, 0.7), this.wallMat); top.position.y = 1.85; g.add(top);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.72), this.stripMat); lamp.position.y = 1.68; g.add(lamp);
      const door = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.6), gateMat()); door.position.y = 0.85; g.add(door);
      this.scene.add(g);
      this.gates.push({ g, door, x: gx, z: gz, k: 0 });
    }
    this.props = new THREE.Group();
    S.add(this.props);
    this.lookLights = [];
    this.anim = [];
  }

  setLook(i) {
    if (i === this.lookI) return;
    this.lookI = i; const L = this.look = LOOKS[i];
    this.scene.environment = this.envFor(i);
    if (!this.floors[L.floor]) this.floors[L.floor] = TX.floorSet(L.floor, this.q.tex);
    const fs = this.floors[L.floor];
    Object.assign(this.floorMat, { map: fs.map, normalMap: fs.normalMap, roughnessMap: fs.roughnessMap, metalness: L.floor === 'plate' || L.floor === 'grate' ? 0.6 : L.floor === 'panel' ? 0.3 : 0.05 });
    this.floorMat.color.set(L.tint); this.floorMat.needsUpdate = true;
    Object.assign(this.outerMat, { map: fs.map, normalMap: fs.normalMap, roughnessMap: fs.roughnessMap });
    this.outerMat.color.set(L.outer); this.outerMat.needsUpdate = true;
    this.wallMat.color.set(L.wall);
    this.stripMat.color.copy(hdr(L.accent, 2.6));
    this.skyMat.uniforms.uTop.value.set(L.sky[0]); this.skyMat.uniforms.uMid.value.set(L.sky[1]); this.skyMat.uniforms.uLow.value.set(L.sky[2]);
    this.scene.fog.color.set(L.fog); this.scene.fog.density = L.fogD;
    this.key.color.set(L.sun); this.key.intensity = L.keyI;
    this.key.position.set(...L.keyDir).normalize().multiplyScalar(80); this.key.target.position.set(0, 0, 0);
    this.hemi.color.set(L.hemi[0]); this.hemi.groundColor.set(L.hemi[1]); this.hemi.intensity = L.hemi[2];
    this.fill.color.set(L.fill); this.fill.intensity = L.fillI; this.fill.position.set(-L.keyDir[0], 0.6, -L.keyDir[2]);
    this.fx.setLook(L);
    this.shotMat.color.copy(hdr(L.shot, 5));
    this.buildProps(i);
  }

  // ---------------------------------------------------------------- scenery per sector
  buildProps(i) {
    const P = this.props, q = this.q.props;
    for (const c of [...P.children]) P.remove(c);
    for (const l of this.lightPool) { l.intensity = 0; l.position.set(0, -50, 0); }
    this.lookLights = []; this.anim = []; this.rain = null;
    const r = mkr(i * 31 + 7);
    const light = (color, I, x, y, z, d = 30) => { const l = this.lightPool[this.lookLights.length]; if (!l) return null; l.color.set(color); l.intensity = I; l.distance = d; l.position.set(x, y, z); this.lookLights.push(l); return l; };
    const inst = (geo, mat, list, shadow = true) => {
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((t, k) => { _e.set(t.rx || 0, t.ry || 0, t.rz || 0); _q.setFromEuler(_e); _s.set(t.sx, t.sy, t.sz); _p.set(t.x, t.y, t.z); _m.compose(_p, _q, _s); m.setMatrixAt(k, _m); });
      m.castShadow = shadow; m.receiveShadow = true;
      P.add(m); return m;
    };
    const ring = (n, inner, fn) => { const out = []; for (let k = 0; k < n; k++) { const t = fn(k, r); if (t && (Math.abs(t.x) > AW + inner || Math.abs(t.z) > AH + inner)) out.push(t); } return out; };
    const L = LOOKS[i];
    if (L.key === 'roof') {
      // planters with shrubs and trees around the roof edge, HVAC boxes, string lights, the skyline
      const planters = [], shrubs = [], trunks = [], crowns = [], hvac = [];
      for (let k = 0; k < 26 * q; k++) {
        const side = k % 4, f = (Math.floor(k / 4) + 0.5) / Math.ceil(26 * q / 4);
        const x = side < 2 ? -AW + f * AW * 2 : (side === 2 ? -1 : 1) * (AW + 3.2), z = side < 2 ? (side ? 1 : -1) * (AH + 3.2) : -AH + f * AH * 2;
        planters.push({ x, y: 0.4, z, sx: side < 2 ? 3 : 1.4, sy: 0.8, sz: side < 2 ? 1.4 : 3 });
        for (let j = 0; j < 3; j++) shrubs.push({ x: x + (r() - 0.5) * 2, y: 1.0, z: z + (r() - 0.5) * 1.6, sx: 0.5 + r() * 0.4, sy: 0.4 + r() * 0.3, sz: 0.5 + r() * 0.4 });
        if (k % 3 === 0) { trunks.push({ x, y: 1.6, z, sx: 0.12, sy: 1.6, sz: 0.12 }); crowns.push({ x, y: 3.0, z, sx: 1.3, sy: 1.5, sz: 1.3 }); }
      }
      for (let k = 0; k < 8; k++) hvac.push({ x: (k % 2 ? 1 : -1) * (AW + 9 + r() * 6), y: 0.8, z: -AH + r() * AH * 2, sx: 2.5, sy: 1.6, sz: 2 });
      const soil = new THREE.MeshStandardMaterial({ color: 0x6b5e52, roughness: 0.9 }), leaf = new THREE.MeshStandardMaterial({ color: 0x3d6a2c, roughness: 0.8 }), leaf2 = new THREE.MeshStandardMaterial({ color: 0x55803a, roughness: 0.75 });
      inst(MD.GEO.box(1, 1, 1), soil, planters); inst(MD.GEO.sph(1, 10, 8), leaf, shrubs); inst(MD.GEO.cyl(1, 1, 1, 8), MD.paint(0x4a3524, 0.9, 0), trunks); inst(MD.GEO.sph(1, 12, 9), leaf2, crowns);
      inst(MD.GEO.box(1, 1, 1), MD.paint(0x8a9098, 0.45, 0.7), hvac);
      // string lights along the long walls
      const bulbs = [];
      for (const s of [-1, 1]) for (let k = 0; k < 40; k++) { const x = -AW + (k / 39) * AW * 2; bulbs.push({ x, y: 2.6 - Math.sin((k % 8) / 7 * Math.PI) * 0.5, z: s * (AH + 1.6), sx: 0.09, sy: 0.09, sz: 0.09 }); }
      inst(MD.GEO.sph(1, 8, 6), MD.glow(0xffc070, 6), bulbs, false);
      this.skyline(r, 70, 0x2c303a, true);
      light(0xffb060, 30, -AW - 4, 3, 0, 26); light(0xffb060, 30, AW + 4, 3, 0, 26);
    } else if (L.key === 'metro') {
      // tiled station walls, columns, a stopped train along the top, strip lights, water
      const wt = TX.wallTileTex(); wt.repeat.set(16, 2);
      const wallM = new THREE.MeshStandardMaterial({ map: wt, roughness: 0.3, metalness: 0.05 });
      for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(AW * 2 + 30, 9, 0.6), wallM); w.position.set(0, 4.5, s * (AH + 13)); w.receiveShadow = true; P.add(w); }
      for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.6, 9, AH * 2 + 26), wallM); w.position.set(s * (AW + 14), 4.5, 0); P.add(w); }
      const cols = [];
      for (let k = 0; k < 14; k++) { const x = -AW + 2 + k * (AW * 2 - 4) / 13; cols.push({ x, y: 4, z: AH + 3.2, sx: 0.55, sy: 8, sz: 0.55 }); cols.push({ x, y: 2.2, z: -AH - 4.5, sx: 0.55, sy: 4.4, sz: 0.55 }); }
      inst(MD.GEO.box(1, 1, 1), MD.paint(0x2b5e5a, 0.35, 0.4), cols);
      // the train: carriages with lit windows
      const win = TX.windowTex(12); win.repeat.set(3, 0.4);
      const carM = MD.paint(0xb8bec6, 0.3, 0.8), winM = new THREE.MeshBasicMaterial({ map: win, color: hdr(0xffffff, 1.8), toneMapped: false });
      for (let k = 0; k < 3; k++) {
        const c = new THREE.Group(); c.position.set(-AW + 6 + k * 16.5, 0, -AH - 7.5);
        const b = new THREE.Mesh(MD.GEO.box(16, 3.4, 3.2), carM); b.position.y = 1.9; b.castShadow = true; c.add(b);
        const w = new THREE.Mesh(new THREE.PlaneGeometry(14.5, 1.0), winM); w.position.set(0, 2.3, 1.62); c.add(w);
        const stripe = new THREE.Mesh(MD.GEO.box(16.02, 0.3, 3.22), MD.paint(0x2b7c76, 0.4, 0.4)); stripe.position.y = 1.2; c.add(stripe);
        P.add(c);
      }
      const rails = new THREE.Mesh(MD.GEO.box(AW * 2 + 30, 0.15, 2.0), MD.paint(0x3a3430, 0.8, 0.5)); rails.position.set(0, 0.05, -AH - 7.5); P.add(rails);
      const bars = [];
      for (let k = 0; k < 8; k++) bars.push({ x: -AW + 3 + k * (AW * 2 - 6) / 7, y: 6.5, z: AH + 4.5, sx: 3.2, sy: 0.12, sz: 0.3 });
      for (let k = 0; k < 8; k++) bars.push({ x: -AW + 3 + k * (AW * 2 - 6) / 7, y: 2.6, z: -AH - 3.2, sx: 3.2, sy: 0.12, sz: 0.3 });
      inst(MD.GEO.box(1, 1, 1), MD.glow(0xd8f0ff, 3), bars, false);
      for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) light(k ? 0x3ff0c8 : 0xd8f0ff, 25, k * 16, 5, s * (AH + 2), 22);
    } else if (L.key === 'foundry') {
      // molten channels on the long sides, crucible vats, I-beam columns, a crane rail
      const flow = new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: FLOW_FRAG, uniforms: { uTime: { value: 0 } } });
      this.anim.push((t) => { flow.uniforms.uTime.value = t; });
      for (const s of [-1, 1]) {
        const ch = new THREE.Mesh(new THREE.PlaneGeometry(AW * 2 + 20, 3.2), flow); ch.rotation.x = -Math.PI / 2; ch.position.set(0, -0.25, s * (AH + 3.4)); P.add(ch);
        const lip = new THREE.Mesh(MD.GEO.box(AW * 2 + 20, 0.5, 0.4), MD.paint(0x3a332c, 0.7, 0.6)); lip.position.set(0, 0.0, s * (AH + 5.2)); P.add(lip);
        for (let k = -2; k <= 2; k++) light(0xff6a1a, 9, k * 10, 1.2, s * (AH + 3.4), 12);
      }
      const vats = [], beams = [];
      for (const s of [-1, 1]) for (let k = 0; k < 3; k++) vats.push({ x: s * (AW + 6), y: 1.6, z: -AH + 4 + k * (AH - 4), sx: 2.4, sy: 3.2, sz: 2.4 });
      inst(MD.GEO.cyl(1, 1.1, 1, 20), MD.paint(0x403833, 0.6, 0.7), vats);
      const vg = []; for (const v of vats) vg.push({ ...v, y: 3.25, sy: 0.05, sx: 2.0, sz: 2.0 });
      inst(MD.GEO.cyl(1, 1, 1, 20), MD.glow(0xff7a2a, 4), vg, false);
      for (let k = 0; k < 8; k++) for (const s of [-1, 1]) beams.push({ x: -AW + 2 + k * (AW * 2 - 4) / 7, y: s > 0 ? 6 : 4, z: s * (AH + 7), sx: 0.6, sy: s > 0 ? 12 : 8, sz: 0.6 });
      inst(MD.GEO.box(1, 1, 1), MD.paint(0x5a4a3a, 0.5, 0.8), beams);
      for (const s of [-1, 1]) { const g = new THREE.Mesh(MD.GEO.box(AW * 2 + 6, 0.8, 0.6), MD.paint(0xc8a030, 0.5, 0.6)); g.position.set(0, s > 0 ? 11.5 : 7.6, s * (AH + 7)); P.add(g); }
      this.embers = true;
    } else if (L.key === 'vault') {
      // rows of server racks with blinking lights, cable trays overhead
      const em = TX.rackTex(), alb = TX.rackAlbedo();
      const rackM = new THREE.MeshStandardMaterial({ map: alb, emissiveMap: em, emissive: hdr(0xffffff, 2.2), roughness: 0.4, metalness: 0.7 });
      this.anim.push((t) => { rackM.emissiveIntensity = 0.75 + 0.25 * Math.sin(t * 3.1) * Math.sin(t * 1.7); em.offset.y = Math.floor(t * 2) * 0.13; });
      const racks = [];
      for (let row = 0; row < 3; row++) for (const s of [-1, 1]) for (let k = 0; k < 16 * q; k++) racks.push({ x: -AW - 4 + k * 3.2, y: 1.3, z: s * (AH + 3 + row * 3.4), sx: 1.2, sy: 2.6, sz: 1.0, ry: 0 });
      for (let row = 0; row < 2; row++) for (const s of [-1, 1]) for (let k = 0; k < 8 * q; k++) racks.push({ x: s * (AW + 3 + row * 3.4), y: 1.3, z: -AH + k * 3.6, sx: 1.0, sy: 2.6, sz: 1.2 });
      inst(MD.GEO.box(1, 1, 1), rackM, racks);
      const trays = [];
      for (const s of [-1, 1]) for (let k = 0; k < 2; k++) trays.push({ x: 0, y: 4.2, z: s * (AH + 4.7 + k * 3.4), sx: AW * 2 + 20, sy: 0.12, sz: 0.6 });
      inst(MD.GEO.box(1, 1, 1), MD.paint(0x3a4250, 0.4, 0.8), trays);
      const lines = [];
      for (let k = -5; k <= 5; k++) lines.push({ x: k * 4, y: 0.012, z: 0, sx: 0.03, sy: 0.01, sz: AH * 2 - 0.2 });
      inst(MD.GEO.box(1, 1, 1), MD.glow(0x3fb8ff, 0.7), lines, false);
      for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) light(0x3fb8ff, 22, k * 14, 4, s * (AH + 3), 20);
    } else {
      // the storm reactor: a glowing ring structure, pylons, catwalks, rain and lightning
      const torus = new THREE.Mesh(new THREE.TorusGeometry(AW + 10, 1.1, 16, 120), MD.paint(0x2a2838, 0.35, 0.8));
      torus.rotation.x = Math.PI / 2; torus.position.y = -0.6; torus.scale.set(1, (AH + 10) / (AW + 10), 1); P.add(torus);
      const core = new THREE.Mesh(new THREE.TorusGeometry(AW + 10, 0.32, 10, 160), MD.glow(0x6fe8ff, 4));
      core.rotation.x = Math.PI / 2; core.position.y = 0.6; core.scale.copy(torus.scale); P.add(core);
      this.anim.push((t) => { core.material.color.copy(hdr(0x6fe8ff, 3 + Math.sin(t * 2.3) * 1.2)); });
      const towers = [];
      for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; towers.push({ x: Math.cos(a) * (AW + 16), y: 6, z: Math.sin(a) * (AH + 14), sx: 1.6, sy: 12, sz: 1.6 }); }
      inst(MD.GEO.cyl(1, 1.3, 1, 8), MD.paint(0x34324a, 0.4, 0.8), towers);
      const caps = towers.map((t) => ({ ...t, y: 12.3, sx: 0.7, sy: 0.7, sz: 0.7 }));
      inst(MD.GEO.sph(1, 10, 8), MD.glow(0x9f7bff, 5), caps, false);
      this.skyline(r, 50, 0x14161e, false);
      for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4; light(0x6fe8ff, 22, Math.cos(a) * (AW + 8), 2, Math.sin(a) * (AH + 8), 22); }
      this.makeRain();
    }
    if (L.key !== 'foundry') this.embers = false;
    void ring;
  }
  // distant buildings around the arena (lit windows at night)
  skyline(r, n, color, day) {
    const win = TX.windowTex(7), list = [];
    for (let k = 0; k < n * this.q.props; k++) {
      const a = r() * Math.PI * 2, d = 70 + r() * 90;
      const h = 20 + r() * 70;
      list.push({ x: Math.cos(a) * d * 1.5, y: h / 2 - 30, z: Math.sin(a) * d, sx: 8 + r() * 10, sy: h, sz: 8 + r() * 10 });
    }
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.3, emissiveMap: win, emissive: hdr(0xffffff, day ? 1.4 : 2.0) });
    win.repeat.set(2, 3);
    const im = new THREE.InstancedMesh(MD.GEO.box(1, 1, 1), m, list.length);
    list.forEach((t, k) => { _m.compose(_p.set(t.x, t.y, t.z), _q.identity(), _s.set(t.sx, t.sy, t.sz)); im.setMatrixAt(k, _m); });
    this.props.add(im);
  }
  makeRain() {
    const n = this.q.rain, pos = new Float32Array(n * 6);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    const drops = [];
    for (let k = 0; k < n; k++) drops.push({ x: (Math.random() - 0.5) * 80, y: Math.random() * 30, z: (Math.random() - 0.5) * 56, v: 22 + Math.random() * 10 });
    const lines = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: hdr(0x9fb0ff, 0.9), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
    lines.frustumCulled = false;
    this.props.add(lines);
    this.rain = { drops, pos, g };
    this.lightningT = 4;
  }

  // ---------------------------------------------------------------- shots, bolts, decals, arcs
  makeShots() {
    this.shotMat = new THREE.MeshBasicMaterial({ color: hdr(0x8fe4ff, 5), toneMapped: false });
    const sg = new THREE.CapsuleGeometry(0.07, 0.75, 3, 6); sg.rotateZ(Math.PI / 2);
    this.shotI = new THREE.InstancedMesh(sg, this.shotMat, 400); this.shotI.frustumCulled = false; this.shotI.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.boltMat = new THREE.MeshBasicMaterial({ color: hdr(0xff4ae0, 4), toneMapped: false });
    this.boltBig = new THREE.MeshBasicMaterial({ color: hdr(0xff8a2a, 4), toneMapped: false });
    this.boltI = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), this.boltMat, 300);
    this.boltBI = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), this.boltBig, 300);
    for (const m of [this.boltI, this.boltBI]) { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); }
    // a soft halo under every bolt so they read on any floor
    const hg = new THREE.PlaneGeometry(1, 1); hg.rotateX(-Math.PI / 2);
    this.haloMat = new THREE.MeshBasicMaterial({ map: this.T.glow, color: hdr(0xff4ae0, 1.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.haloI = new THREE.InstancedMesh(hg, this.haloMat, 600); this.haloI.frustumCulled = false; this.haloI.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.haloI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(600 * 3), 3);
    this.scene.add(this.shotI, this.boltI, this.boltBI, this.haloI);
    // RAIL LANCE shots are long violet lances, SEEKERS orange darts
    const rg = new THREE.CapsuleGeometry(0.09, 1.5, 3, 6); rg.rotateZ(Math.PI / 2);
    this.railI = new THREE.InstancedMesh(rg, new THREE.MeshBasicMaterial({ color: hdr(0xd6c2ff, 6), toneMapped: false }), 200);
    this.seekI = new THREE.InstancedMesh(sg, new THREE.MeshBasicMaterial({ color: hdr(0xff8a3a, 6), toneMapped: false }), 200);
    for (const m of [this.railI, this.seekI]) { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.scene.add(m); }
    // soft contact shadows under everything that stands on the floor
    const cg = new THREE.PlaneGeometry(1, 1); cg.rotateX(-Math.PI / 2);
    this.blobI = new THREE.InstancedMesh(cg, new THREE.MeshBasicMaterial({ map: this.T.glow, color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false }), 220);
    this.blobI.frustumCulled = false; this.blobI.renderOrder = 1; this.blobI.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.blobI);
    this.icons = {};
  }
  iconFor(kind) {
    if (this.icons[kind]) return this.icons[kind];
    const P = POWERUPS[kind], c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), col = '#' + new THREE.Color(P.color).getHexString();
    g.fillStyle = 'rgba(0,0,0,0.55)'; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.fill();
    g.lineWidth = 7; g.strokeStyle = col; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.stroke();
    g.fillStyle = col; g.font = 'bold 64px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(P.glyph, 64, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return (this.icons[kind] = new THREE.SpriteMaterial({ map: t, color: hdr(0xffffff, 1.6), toneMapped: false, depthWrite: false, transparent: true }));
  }
  decalMat(kind, color) {
    return new THREE.ShaderMaterial({ vertexShader: DECAL_VERT, fragmentShader: DECAL_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(color) }, uProg: { value: 0 }, uLive: { value: 0 }, uTime: { value: 0 }, uKind: { value: kind }, uA0: { value: 0 }, uA1: { value: 1 }, uAlpha: { value: 1 } } });
  }
  makeDecals() {
    const pl = new THREE.PlaneGeometry(2, 2); pl.rotateX(-Math.PI / 2);
    const lane = new THREE.PlaneGeometry(2, 1); lane.rotateX(-Math.PI / 2); lane.translate(0, 0, -0.5); lane.rotateY(-Math.PI / 2);   // along +x from the origin, uv.y = 0 at the origin
    this.decalPool = [];
    for (let k = 0; k < 24; k++) {
      const m = new THREE.Mesh(pl, this.decalMat(0, 0xff3a2a)); m.visible = false; m.renderOrder = 4; this.scene.add(m);
      this.decalPool.push(m);
    }
    this.laneMesh = new THREE.Mesh(lane, this.decalMat(1, 0xff3a2a)); this.laneMesh.visible = false; this.laneMesh.renderOrder = 4; this.scene.add(this.laneMesh);
    // sector hazards: warning lanes on the floor, laser sheets, lightning bolts
    this.strips = [];
    for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(lane, this.decalMat(1, 0x6fe8ff)); m.visible = false; m.renderOrder = 4; this.scene.add(m); this.strips.push(m); }
    const sheet = new THREE.BoxGeometry(1, 1, 1); sheet.translate(0.5, 0.5, 0);
    this.lasers = [];
    for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(sheet, new THREE.MeshBasicMaterial({ color: hdr(0xff2a3a, 3), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); m.visible = false; this.scene.add(m); this.lasers.push(m); }
    const bolt = new THREE.CylinderGeometry(0.08, 0.2, 1, 6, 1, true); bolt.translate(0, 0.5, 0);
    this.bolts3 = [];
    for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(bolt, new THREE.MeshBasicMaterial({ color: hdr(0xc8d4ff, 8), toneMapped: false })); m.visible = false; this.scene.add(m); this.bolts3.push(m); }
    // portal columns of light
    const cg = new THREE.CylinderGeometry(1, 1, 1, 24, 1, true); cg.translate(0, 0.5, 0);
    this.colMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color() }, uK: { value: 1 }, uTime: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 uColor; uniform float uK, uTime; varying vec2 vUv; void main(){ float a = (1.0 - vUv.y) * (0.55 + 0.45 * sin(vUv.y * 20.0 - uTime * 8.0)); gl_FragColor = vec4(uColor * a * uK, 1.0); }' });
    this.cols = [];
    for (let k = 0; k < 16; k++) { const m = new THREE.Mesh(cg, this.colMat.clone()); m.visible = false; this.scene.add(m); this.cols.push(m); }
    // aim lines (spitters)
    const ag = new THREE.PlaneGeometry(1, 1); ag.rotateX(-Math.PI / 2); ag.translate(0.5, 0, 0);
    this.aimMat = new THREE.MeshBasicMaterial({ color: hdr(0xff3df0, 1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    this.aims = [];
    for (let k = 0; k < 24; k++) { const m = new THREE.Mesh(ag, this.aimMat.clone()); m.visible = false; m.renderOrder = 5; this.scene.add(m); this.aims.push(m); }
    // a beam for the sweep attack
    const bg = new THREE.BoxGeometry(1, 1, 1); bg.translate(0.5, 0, 0);
    this.beam = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ color: hdr(0x7fd8ff, 6), toneMapped: false })); this.beam.visible = false; this.scene.add(this.beam);
    this.beamGlow = new THREE.Mesh(ag, new THREE.MeshBasicMaterial({ color: hdr(0x3fb8ff, 1.5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); this.beamGlow.visible = false; this.scene.add(this.beamGlow);
    // survivor beacons
    this.beaconMat = this.decalMat(3, 0x7dff9a);
  }
  makeArcs() {
    this.arcs = [];
    for (let k = 0; k < 16; k++) {
      const n = 14, pos = new Float32Array(n * 2 * 3), idx = [];
      for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setIndex(idx);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: hdr(0x9fe8ff, 5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
      m.frustumCulled = false; m.visible = false; this.scene.add(m);
      this.arcs.push({ m, pos, n });
    }
  }
  setArc(A, ax, az, bx, bz, w, jit, y = 1.6) {
    const { pos, n } = A;
    const dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), j = i === 0 || i === n - 1 ? 0 : (Math.random() - 0.5) * jit;
      const x = ax + dx * t + nx * j, z = az + dz * t + nz * j, yy = y + (Math.random() - 0.5) * jit * 0.5;
      pos[i * 6] = x - nx * w; pos[i * 6 + 1] = yy; pos[i * 6 + 2] = z - nz * w;
      pos[i * 6 + 3] = x + nx * w; pos[i * 6 + 4] = yy; pos[i * 6 + 5] = z + nz * w;
    }
    A.m.geometry.attributes.position.needsUpdate = true;
    A.m.visible = true;
  }

  // ---------------------------------------------------------------- views
  playerView(p) {
    const color = p.id === 1 ? this.suit.color : 0xff5a3a, accent = p.id === 1 ? this.suit.accent : 0xffd27a;
    const v = MD.warden(color, accent);
    const sh = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 20), new THREE.ShaderMaterial({ vertexShader: SHIELD_VERT, fragmentShader: SHIELD_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: hdr(accent, 1.4) }, uK: { value: 0 }, uTime: { value: 0 } } }));
    sh.position.y = 1.0; sh.scale.set(1, 0.95, 1); v.g.add(sh); v.shield = sh;
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.72, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: hdr(accent, 2.5), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    ring.position.y = 0.03; v.g.add(ring); v.ring = ring;
    v.light = this.wardenLights[(p.id - 1) % 2]; v.light.color.set(accent);
    v.flash = 0; v.hurt = 0; v.legA = 0;
    this.scene.add(v.g);
    return v;
  }
  enemyView(e) {
    const t = e.type;
    const v = t === 'crawler' ? MD.crawler() : t === 'brute' ? MD.brute() : t === 'spitter' ? MD.spitter() : t === 'hive' ? MD.hive() : t === 'dart' ? MD.dart()
      : t === 'pylon' ? MD.pylon() : t === 'splitter' ? MD.splitter(false) : t === 'shard' ? MD.splitter(true) : MD.dummy();
    v.type = t; v.yaw = -e.a; v.hit = 0;
    this.scene.add(v.g);
    return v;
  }
  survivorView(s) {
    const v = MD.survivor(s.look);
    const b = new THREE.Mesh(this.decalPlane || (this.decalPlane = new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2)), this.beaconMat);
    b.scale.setScalar(0.75); b.position.y = 0.04; b.renderOrder = 3; v.g.add(b); v.beacon = b;
    const gem = new THREE.Mesh(MD.GEO.sph(0.12, 8, 6), MD.glow(0x7dff9a, 5)); gem.scale.set(1, 1.6, 1); gem.position.y = 2.2; v.g.add(gem); v.gem = gem;
    this.scene.add(v.g);
    return v;
  }

  // ---------------------------------------------------------------- per-frame sync from the world
  sync(W, dt) {
    this.W = W;
    const t = this.time;
    // Wardens
    const seenP = new Set();
    for (const p of W.players) {
      seenP.add(p.id);
      let v = this.views.p.get(p.id);
      if (!v) { v = this.playerView(p); this.views.p.set(p.id, v); }
      this.updatePlayer(v, p, dt, W);
    }
    for (const [id, v] of this.views.p) if (!seenP.has(id)) { this.scene.remove(v.g); this.views.p.delete(id); }
    // machines
    const seen = new Set();
    for (const e of W.enemies) {
      if (e.hp <= 0) continue;
      seen.add(e.id);
      let v = this.views.e.get(e.id);
      if (!v) { v = this.enemyView(e); this.views.e.set(e.id, v); }
      this.updateEnemy(v, e, dt, W);
    }
    for (const [id, v] of this.views.e) if (!seen.has(id)) { this.scene.remove(v.g); this.views.e.delete(id); }
    // survivors
    const seenS = new Set();
    for (const s of W.survivors) {
      seenS.add(s.id);
      let v = this.views.s.get(s.id);
      if (!v) { v = this.survivorView(s); this.views.s.set(s.id, v); }
      v.g.position.set(s.x, 0, s.z);
      const sp = Math.hypot(s.vx, s.vz);
      if (sp > 0.05) v.g.rotation.y = -Math.atan2(s.vz, s.vx);
      const ph = t * (4 + sp * 3) + s.id;
      v.legs[0].rotation.z = Math.sin(ph) * 0.5 * Math.min(1, sp); v.legs[1].rotation.z = -Math.sin(ph) * 0.5 * Math.min(1, sp);
      // waving for help when standing, arms pumping when running
      v.arms[0].rotation.x = sp < 0.2 ? 2.6 + Math.sin(t * 6 + s.id) * 0.4 : -0.2;
      v.arms[1].rotation.z = -Math.sin(ph) * 0.6 * Math.min(1, sp);
      v.gem.position.y = 2.15 + Math.sin(t * 3 + s.id) * 0.12; v.gem.rotation.y = t * 2;
    }
    for (const [id, v] of this.views.s) if (!seenS.has(id)) { this.scene.remove(v.g); this.views.s.delete(id); }
    this.beaconMat.uniforms.uTime.value = t; this.beaconMat.uniforms.uProg.value = 0.5 + 0.5 * Math.sin(t * 2);
    this.syncPickups(W, t);
    this.syncDrones(W, dt, t);
    this.syncBlobs(W);
    this.syncBoss(W, dt);
    this.syncShots(W);
    this.syncDecals(W);
  }

  syncPickups(W, t) {
    const seen = new Set();
    for (const q of W.pickups || []) {
      seen.add(q.id);
      let v = this.views.pk.get(q.id);
      if (!v) {
        v = MD.pickup(POWERUPS[q.kind].color);
        v.icon = new THREE.Sprite(this.iconFor(q.kind)); v.icon.scale.setScalar(0.75); v.icon.position.y = 2.15; v.g.add(v.icon);
        this.scene.add(v.g); this.views.pk.set(q.id, v);
      }
      v.g.position.set(q.x, 0, q.z);
      const born = Math.min(1, q.t / 0.35);
      v.g.scale.setScalar(0.3 + 0.7 * born);
      v.pod.position.y = 1.05 + Math.sin(t * 2.6 + q.id) * 0.12;
      v.pod.rotation.y = t * 1.4;
      v.ring.rotation.set(Math.sin(t * 1.3) * 0.5, t * 2.2, Math.cos(t * 1.1) * 0.4);
      v.ring.position.y = v.pod.position.y;
      v.core.scale.setScalar(1 + 0.15 * Math.sin(t * 7));
      v.icon.position.y = 2.15 + Math.sin(t * 2.6 + q.id) * 0.12;
      // blink before it times out
      v.g.visible = q.life > 3 || Math.sin(t * (q.life < 1.2 ? 30 : 16)) > -0.2;
    }
    for (const [id, v] of this.views.pk) if (!seen.has(id)) { this.scene.remove(v.g); this.views.pk.delete(id); }
  }
  syncDrones(W, dt, t) {
    for (const p of W.players) {
      let v = this.views.dr.get(p.id);
      const on = p.alive && p.pw && p.pw.drone > 0;
      if (!on) { if (v) v.g.visible = false; continue; }
      if (!v) { v = MD.wingdrone(); this.scene.add(v.g); this.views.dr.set(p.id, v); }
      v.g.visible = p.pw.drone > 2 || Math.sin(t * 20) > 0;
      const [x, z] = dronePos(p);
      v.g.position.set(x, Math.sin(t * 3) * 0.1, z);
      v.g.rotation.y = -(p.droneA + Math.PI / 2);
      v.rotors.forEach((r, i) => { r.rotation.y = t * 40 * (i % 2 ? 1 : -1); });
    }
  }
  syncBlobs(W) {
    let n = 0;
    const put = (x, z, r) => { if (n >= 220) return; _m.compose(_p.set(x, 0.025, z), _q.identity(), _s.set(r, 1, r)); this.blobI.setMatrixAt(n++, _m); };
    for (const p of W.players) if (p.alive) put(p.x, p.z, 1.8);
    for (const e of W.enemies) if (e.hp > 0 && e.type !== 'dart') put(e.x, e.z, e.r * 2.8);
    for (const s of W.survivors) put(s.x, s.z, 1.0);
    for (const q of W.pickups || []) put(q.x, q.z, 1.3);
    if (W.boss) put(W.boss.x, W.boss.z, W.boss.r * 2.6);
    this.blobI.count = n; this.blobI.instanceMatrix.needsUpdate = true;
  }

  updatePlayer(v, p, dt, W) {
    v.g.visible = p.alive;
    if (!p.alive) { v.light.intensity = 0; return; }
    v.g.position.set(p.x, 0, p.z);
    v.light.position.set(p.x + Math.cos(p.aim) * 0.6, 1.6, p.z + Math.sin(p.aim) * 0.6);
    const sp = Math.hypot(p.vx, p.vz);
    // legs face where you run, the torso where you aim
    if (sp > 0.4) { const want = -Math.atan2(p.vz, p.vx); v.legA += angD(v.legA, want) * Math.min(1, dt * 12); }
    v.lower.rotation.y = v.legA;
    v.upper.rotation.y = -p.aim;
    const ph = p.walk * 2.1, k = Math.min(1, sp / 4);
    v.L.hip.rotation.z = Math.sin(ph) * 0.65 * k; v.R.hip.rotation.z = -Math.sin(ph) * 0.65 * k;
    v.L.knee.rotation.z = -Math.max(0, Math.sin(ph + 1.2)) * 0.8 * k; v.R.knee.rotation.z = -Math.max(0, -Math.sin(ph + 1.2)) * 0.8 * k;
    v.upper.position.y = Math.abs(Math.sin(ph)) * 0.05 * k;
    v.flash = Math.max(0, v.flash - dt * 12);
    v.gun.position.x = 0.4 - v.flash * 0.06;
    v.muzzle.scale.setScalar(1 + v.flash * 3);
    // shield bubble: faint while charged, bright when it takes a hit, blinking while invulnerable
    v.hurt = Math.max(0, v.hurt - dt * 2.5);
    const u = v.shield.material.uniforms;
    u.uTime.value = this.time;
    u.uK.value = (p.shield > 0 ? 0.35 : 0) + v.hurt * 2.2 + (p.inv > 0 && v.hurt <= 0 ? 0.25 + 0.25 * Math.sin(this.time * 30) : 0);
    v.shield.visible = u.uK.value > 0.01;
    v.ring.material.opacity = 0.6 + 0.4 * Math.sin(this.time * 4);
    v.light.intensity = 4 + v.flash * 30;
    void W;
  }

  updateEnemy(v, e, dt, W) {
    const t = this.time;
    v.g.position.set(e.x, 0, e.z);
    const born = e.born > 0 ? 1 - e.born / 0.45 : 1;
    const pop = e.hitT > 0 ? 1.12 : 1;
    v.hit = Math.max(v.hit - dt * 8, e.hitT > 0 ? 1 : 0);
    let s = Math.max(0.05, born) * (1 + (pop - 1) * v.hit);
    // face the way it moves (smoothly)
    const sp = Math.hypot(e.vx, e.vz);
    let want = v.yaw;
    if (e.type === 'spitter' && (e.aimT > 0)) want = -e.aimA;
    else if (sp > 0.2) want = -Math.atan2(e.vz, e.vx);
    else if (e.type === 'spitter' || e.type === 'brute') { const P = W.players.find((q) => q.alive); if (P) want = -Math.atan2(P.z - e.z, P.x - e.x); }
    v.yaw += angD(v.yaw, want) * Math.min(1, dt * (e.type === 'dart' ? 14 : 8));
    v.g.rotation.y = v.yaw;
    switch (e.type) {
      case 'crawler': {
        const ph = t * 14 * Math.min(1.5, sp / 1.5 + 0.3) + e.id;
        v.legs.forEach((L, i) => { L.hip.rotation.x = Math.sin(ph + i * Math.PI * 0.5 + (i % 2) * Math.PI) * 0.35; L.hip.rotation.y = Math.cos(ph + i * 1.7) * 0.3; });
        v.body.position.y = 0.42 + Math.abs(Math.sin(ph * 2)) * 0.04;
        break;
      }
      case 'brute': v.body.position.y = Math.sin(t * 9 + e.id) * 0.02; v.arm.rotation.z = Math.sin(t * 1.5 + e.id) * 0.12; v.lamp.material = MD.glow(0xff8a1a, Math.sin(t * 6) > 0 ? 7 : 1.5); break;
      case 'spitter': {
        const k = e.aimT > 0 ? 1 - e.aimT / Math.max(0.01, (e.aimLock / 0.38)) : 0;
        v.core.scale.setScalar(1 + k * 1.6 + Math.sin(t * 20) * 0.1 * k);
        v.tip.scale.setScalar(1 + k * 2.2);
        v.head.position.y = 1.15 + Math.sin(t * 3 + e.id) * 0.05;
        v.legs.forEach((L, i) => { L.rotation.z = Math.sin(t * 6 + i * 2 + e.id) * 0.06 * Math.min(1, sp); });
        break;
      }
      case 'hive': {
        const tell = e.tell > 0 ? 1 : 0;
        v.body.scale.set(1 + Math.sin(t * 3) * 0.03 + tell * 0.08, 1 + Math.sin(t * 3 + 1) * 0.03 + tell * 0.12, 1 + Math.sin(t * 3) * 0.03 + tell * 0.08);
        v.vents.forEach((r, i) => { r.scale.setScalar(1 + 0.05 * Math.sin(t * 5 + i) + tell * 0.1); });
        break;
      }
      case 'dart': v.body.rotation.x = Math.sin(t * 9 + e.id) * 0.35; v.body.position.y = 0.9 + Math.sin(t * 7 + e.id) * 0.08; break;
      case 'pylon': v.top.scale.setScalar(1 + (e.arc === 1 ? 0.4 + Math.random() * 0.3 : e.arc === 2 ? 0.5 : 0.1 * Math.sin(t * 5))); break;
      case 'splitter': case 'shard': v.body.rotation.y = t * 3; v.body.rotation.x = t * 1.7; v.core.scale.setScalar(1 + 0.15 * Math.sin(t * 8 + e.id)); break;
      default: if (v.disc) v.disc.rotation.y = Math.sin(t + e.id) * 0.4;
    }
    v.g.scale.setScalar(s);
  }

  syncBoss(W, dt) {
    const B = W.boss;
    if (!B) {
      if (this.bossView) { this.scene.remove(this.bossView.g); this.bossView = null; }
      for (const o of this.views.orbs) this.scene.remove(o.g);
      this.views.orbs = [];
      return;
    }
    let v = this.bossView;
    if (!v || v.key !== B.key) {
      if (v) this.scene.remove(v.g);
      v = this.bossView = MD.boss(B.key); v.key = B.key; v.yaw = -B.a; v.hit = 0;
      this.scene.add(v.g);
    }
    const t = this.time;
    v.g.position.set(B.x, 0, B.z);
    v.yaw += angD(v.yaw, -B.a) * Math.min(1, dt * 3);
    v.g.rotation.y = v.yaw;
    v.hit = Math.max(v.hit - dt * 8, B.hitT > 0 ? 1 : 0);
    const tell = B.state === 'tell' ? B.cur.t / B.cur.T : 0;
    const sc = 1 + v.hit * 0.03 + tell * 0.04;
    v.g.scale.setScalar(sc);
    if (v.spin) v.spin.rotation.y = B.spin;
    if (v.eye) v.eye.scale.setScalar(1 + tell * 0.6 + 0.1 * Math.sin(t * 6));
    for (const gl of v.glows) gl.scale.setScalar(1 + tell * 0.3);
    const walking = B.state === 'idle' || B.state === 'in';
    v.legs.forEach((L, i) => { L.rotation.x = walking ? Math.sin(t * 3 + i * Math.PI / 2) * 0.15 : 0; L.position.y = 2.2 + (walking ? Math.max(0, Math.sin(t * 3 + i * Math.PI / 2)) * 0.25 : 0) - (B.state === 'act' && B.cur && B.cur.kind === 'stomp' ? 0.4 : 0); });
    if (v.body && B.key === 'foreman') v.body.position.y = 2.4 - (B.state === 'tell' && B.cur && B.cur.kind === 'stomp' ? tell * 0.6 : 0);
    if (v.body && B.key === 'archivist') v.body.position.y = 2.6 + Math.sin(t * 1.5) * 0.25;
    if (B.state === 'stun') v.g.rotation.z = Math.sin(t * 20) * 0.03;
    else v.g.rotation.z = 0;
    if (B.state === 'dying') { v.g.rotation.z = Math.sin(t * 30) * 0.05; v.g.position.y = -((2.4 - B.st) / 2.4) * 0.8; if (Math.random() < 0.18) this.fx.explode(B.x + (Math.random() - 0.5) * 4, 1 + Math.random() * 3, B.z + (Math.random() - 0.5) * 3, 1.1, { metal: true, rock: false, scorch: false }); }
    // orbs
    while (this.views.orbs.length < B.orbs.length) { const o = MD.orb(); this.scene.add(o.g); this.views.orbs.push(o); }
    B.orbs.forEach((o, i) => { const ov = this.views.orbs[i]; ov.g.visible = o.hp > 0; ov.g.position.set(o.x, Math.sin(t * 2 + i) * 0.2, o.z); ov.core.scale.setScalar(0.8 + 0.2 * Math.sin(t * 5 + i)); });
    for (let i = B.orbs.length; i < this.views.orbs.length; i++) this.views.orbs[i].g.visible = false;
  }

  syncShots(W) {
    let n = 0, nr = 0, ns = 0;
    for (const s of W.shots) {
      const a = Math.atan2(s.vz, s.vx);
      _q.setFromAxisAngle(UP, -a);
      _m.compose(_p.set(s.x, s.drone ? 1.8 : 1.3, s.z), _q, _s.set(1, 1, 1));
      if (s.rail) { if (nr < 200) this.railI.setMatrixAt(nr++, _m); }
      else if (s.seek) { if (ns < 200) this.seekI.setMatrixAt(ns++, _m); }
      else if (n < 400) this.shotI.setMatrixAt(n++, _m);
    }
    this.shotI.count = n; this.shotI.instanceMatrix.needsUpdate = true;
    this.railI.count = nr; this.railI.instanceMatrix.needsUpdate = true;
    this.seekI.count = ns; this.seekI.instanceMatrix.needsUpdate = true;
    let a = 0, b = 0, h = 0;
    for (const q of W.bolts) {
      const big = !!q.big, I = big ? this.boltBI : this.boltI, k = big ? b++ : a++;
      if (k >= 300) continue;
      _m.compose(_p.set(q.x, 1.15, q.z), _q.identity(), _s.setScalar(q.r * 1.15));
      I.setMatrixAt(k, _m);
      if (h < 600) { _m.compose(_p.set(q.x, 0.05, q.z), _q.identity(), _s.setScalar(q.r * 9)); this.haloI.setMatrixAt(h, _m); this.haloI.instanceColor.setXYZ(h, big ? 1.4 : 1.2, big ? 0.5 : 0.25, big ? 0.15 : 1.0); h++; }
    }
    this.boltI.count = Math.min(a, 300); this.boltBI.count = Math.min(b, 300);
    this.haloI.count = h;
    for (const I of [this.boltI, this.boltBI, this.haloI]) I.instanceMatrix.needsUpdate = true;
    this.haloI.instanceColor.needsUpdate = true;
    this.haloMat.color.setRGB(1, 1, 1);
  }

  syncDecals(W) {
    const t = this.time;
    let d = 0;
    const use = (kind, color) => { const m = this.decalPool[d++]; if (!m) return null; m.visible = true; const u = m.material.uniforms; u.uKind.value = kind; u.uColor.value.set(color); u.uTime.value = t; u.uLive.value = 0; u.uAlpha.value = 1; m.rotation.set(0, 0, 0); return m; };
    // gates: portals opening
    for (const G of this.gates) G.k = Math.max(0, G.k - 0.02);
    let c = 0;
    for (const P of W.portals) {
      const prog = clamp(P.t / P.T, 0, 1);
      const col = P.types[0] === 'dummy' ? 0xffd070 : P.types[0] === 'pylon' ? 0x6fe8ff : P.types[0] === 'hive' ? 0xc070ff : 0xff3a2a;
      const m = use(3, col);
      if (m) { m.position.set(P.x, 0.03, P.z); m.scale.setScalar(1.3 + P.types.length * 0.25); m.material.uniforms.uProg.value = prog; }
      if (P.x2 !== undefined) { const m2 = use(3, col); if (m2) { m2.position.set(P.x2, 0.03, P.z2); m2.scale.setScalar(1.2); m2.material.uniforms.uProg.value = prog; } }
      const cm = this.cols[c++];
      if (cm) { cm.visible = true; cm.position.set(P.x, 0, P.z); cm.scale.set(0.9 + P.types.length * 0.15, 2 + prog * 4, 0.9 + P.types.length * 0.15); cm.material.uniforms.uColor.value.set(col); cm.material.uniforms.uK.value = 0.25 + prog * 0.9; cm.material.uniforms.uTime.value = t; }
      for (const G of this.gates) if (Math.hypot(G.x - P.x, G.z - P.z) < 2) G.k = Math.max(G.k, prog);
    }
    for (; c < this.cols.length; c++) this.cols[c].visible = false;
    for (const G of this.gates) G.door.material.color.copy(hdr(G.k > 0 ? 0xff3a2a : this.look.accent, G.k > 0 ? 0.6 + G.k * 2.5 * (0.7 + 0.3 * Math.sin(t * 16)) : 0.12));
    // boss tells and live hazards
    this.laneMesh.visible = false; this.beam.visible = false; this.beamGlow.visible = false;
    let si = 0, li = 0, bi = 0, sa = 12;
    for (const h of W.hazards) {
      const prog = h.state === 'tell' ? clamp(h.t / h.T, 0, 1) : 1;
      if (h.kind === 'strip') {
        const m = this.strips[si++]; if (!m) continue;
        const c = Math.cos(h.a), sn = Math.sin(h.a), col = h.style === 'laser' ? 0xff2a3a : 0x6fe8ff;
        m.visible = true; m.position.set(h.x - c * h.hl, 0.05, h.z - sn * h.hl); m.rotation.y = -h.a; m.scale.set(h.hl * 2, 1, h.w);
        const u = m.material.uniforms; u.uProg.value = prog; u.uTime.value = t; u.uLive.value = h.state === 'live' ? 1 : 0; u.uColor.value.set(col); u.uAlpha.value = h.state === 'live' ? 1.6 : 0.7 + prog * 0.6;
        if (h.state === 'live' && h.style === 'surge') {
          // a bundle of crackling arcs along the live lane
          for (let k = 0; k < 2; k++) { const A = this.arcs[sa++]; if (A) { this.setArc(A, h.x - c * h.hl, h.z - sn * h.hl, h.x + c * h.hl, h.z + sn * h.hl, 0.08, 1.1, 0.35 + k * 0.3); A.m.material.opacity = 1; } }
        }
        if (h.state === 'live' && h.style === 'laser') {
          const L = this.lasers[li++];
          if (L) { L.visible = true; L.position.set(h.x - c * h.hl, 0, h.z - sn * h.hl); L.rotation.y = -h.a; L.scale.set(h.hl * 2, 1.5, 0.06 + Math.random() * 0.03); L.material.opacity = 0.45 + Math.random() * 0.25; }
        }
        continue;
      }
      if (h.style === 'storm' && h.state === 'live') {
        const B = this.bolts3[bi++];
        if (B) { B.visible = true; B.position.set(h.x + (Math.random() - 0.5) * 0.3, 0, h.z + (Math.random() - 0.5) * 0.3); B.scale.set(1 + Math.random(), 32, 1 + Math.random()); B.rotation.set((Math.random() - 0.5) * 0.06, 0, (Math.random() - 0.5) * 0.06); }
      }
      if (h.kind === 'ring' || h.kind === 'pool') {
        const m = use(0, h.kind === 'pool' ? 0xff7a1a : h.style === 'storm' ? 0xa8b8ff : 0xff3a2a);
        if (!m) continue;
        m.position.set(h.x, 0.04, h.z); m.scale.setScalar(h.r);
        const u = m.material.uniforms; u.uProg.value = prog; u.uLive.value = h.state === 'live' ? 1 : 0;
        if (h.kind === 'ring' && h.state === 'live') u.uAlpha.value = 1.5;
      } else if (h.kind === 'lane') {
        const m = this.laneMesh; m.visible = true;
        const len = Math.min(h.len, laneLen(h.x, h.z, h.a));
        m.position.set(h.x, 0.05, h.z); m.rotation.y = -h.a; m.scale.set(len, 1, h.w);
        const u = m.material.uniforms; u.uProg.value = prog; u.uTime.value = t; u.uLive.value = h.state === 'live' ? 1 : 0; u.uColor.value.set(0xff3a2a);
      } else if (h.kind === 'beam') {
        const m = use(2, 0x7fd8ff);
        if (m) {
          m.position.set(h.x, 0.05, h.z); m.scale.setScalar(Math.min(h.len, 40));
          const a1 = h.a0 + h.dir * h.sweep;
          // decal uv angle: plane rotated -90 about x, so uv.y runs along -z
          m.material.uniforms.uA0.value = -h.a0; m.material.uniforms.uA1.value = -a1;
          if (h.state === 'tell') m.material.uniforms.uAlpha.value = 0.5 + prog * 0.8;
        }
        if (h.state === 'live') {
          this.beam.visible = true; this.beam.position.set(h.x, 1.5, h.z); this.beam.rotation.y = -h.a; this.beam.scale.set(laneLen(h.x, h.z, h.a), 0.25, 0.25);
          this.beamGlow.visible = true; this.beamGlow.position.set(h.x, 0.06, h.z); this.beamGlow.rotation.y = -h.a; this.beamGlow.scale.set(laneLen(h.x, h.z, h.a), 1, h.w * 4);
        }
      }
    }
    // the hive's next dart, pylons arming
    for (const e of W.enemies) {
      if (e.type === 'hive' && e.tell > 0) { const m = use(0, 0xc070ff); if (m) { m.position.set(e.x, 0.03, e.z); m.scale.setScalar(1.6); m.material.uniforms.uProg.value = 1 - e.tell / Math.max(0.6, W.R.warn * 0.55); } }
    }
    for (; d < this.decalPool.length; d++) this.decalPool[d].visible = false;
    for (; si < this.strips.length; si++) this.strips[si].visible = false;
    for (; li < this.lasers.length; li++) this.lasers[li].visible = false;
    for (; bi < this.bolts3.length; bi++) this.bolts3[bi].visible = false;
    for (; sa < 16; sa++) this.arcs[sa].m.visible = false;
    // spitter aim lines
    let a = 0;
    for (const e of W.enemies) {
      if (e.type !== 'spitter' || !(e.aimT > 0) || e.hp <= 0) continue;
      const m = this.aims[a++]; if (!m) break;
      const T = e.aimLock / 0.38, k = 1 - e.aimT / T, locked = e.aimT <= e.aimLock;
      m.visible = true; m.position.set(e.x + Math.cos(e.aimA) * 0.8, 1.15, e.z + Math.sin(e.aimA) * 0.8); m.rotation.y = -e.aimA;
      m.scale.set(laneLen(e.x, e.z, e.aimA), 1, locked ? 0.09 : 0.05);
      m.material.opacity = (0.25 + k * 0.75) * (locked ? 0.8 + 0.2 * Math.sin(t * 40) : 0.6);
    }
    for (; a < this.aims.length; a++) this.aims[a].visible = false;
    // arcs between pylons
    let r = 0;
    for (const e of W.enemies) {
      if (e.type !== 'pylon' || !e.link || e.id > e.link || e.hp <= 0 || !e.arc) continue;
      const o = W.enemies.find((q) => q.id === e.link);
      const A = this.arcs[r++]; if (!o || !A) continue;
      if (e.arc === 2) { this.setArc(A, e.x, e.z, o.x, o.z, 0.07, 0.5); A.m.material.opacity = 1; }
      else { if (Math.random() < 0.5) this.setArc(A, e.x, e.z, o.x, o.z, 0.03, 0.25); A.m.material.opacity = 0.3 + Math.random() * 0.3; }
    }
    for (; r < 12; r++) this.arcs[r].m.visible = false;
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
    this.fitCache = {};
  }
  setScale(s) { if (Math.abs(s - this.scale) < 0.02) return; this.scale = s; this.resize(); }
  get portrait() { return this.camera.aspect < 0.85; }

  // the camera distance that fits the arena inside the frame (below the HUD)
  fit(pitch, yaw, fov, top, hx = AW + 0.6, hz = AH + 0.6) {
    const key = [pitch, yaw, fov, top, hx, hz, this.camera.aspect.toFixed(3)].join();
    if (this.fitCache[key]) return this.fitCache[key];
    const cam = new THREE.PerspectiveCamera(fov, this.camera.aspect, 0.1, 2000);
    const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    const target = new THREE.Vector3(0, 0, 0.8);
    const pts = [];
    for (const x of [-hx, hx]) for (const z of [-hz, hz]) for (const y of [0, 1.0]) pts.push(new THREE.Vector3(x, y, z));
    let lo = 5, hi = 300;
    for (let i = 0; i < 26; i++) {
      const d = (lo + hi) / 2;
      cam.position.copy(target).addScaledVector(dir, d); cam.lookAt(target); cam.updateMatrixWorld();
      let ok = true;
      for (const p of pts) { _v.copy(p).project(cam); if (Math.abs(_v.x) > 0.97 || _v.y > top || _v.y < -0.95 || _v.z > 1) { ok = false; break; } }
      if (ok) hi = d; else lo = d;
    }
    const res = { pos: target.clone().addScaledVector(dir, hi), look: target.clone(), fov };
    this.fitCache[key] = res;
    return res;
  }
  gameView() {
    const tall = this.portrait;
    if (this.view === 'close') {
      // CLOSE: about two thirds of the arena around the Warden, a slightly lower, more cinematic angle
      const hx = tall ? AW * 0.55 : AW * 0.64, hz = tall ? AH * 0.78 : AH * 0.66;
      const v = this.fit(tall ? 1.25 : 0.98, tall ? Math.PI / 2 : 0, tall ? 46 : 40, tall ? 0.78 : 0.8, hx, hz);
      return { ...v, hx, hz };
    }
    return this.fit(tall ? 1.32 : 1.08, tall ? Math.PI / 2 : 0, tall ? 46 : 38, tall ? 0.78 : 0.8);
  }
  // frame a few points closely (demo slow-mo shots, boss intros)
  frameShot(pts, dur) { this.shot = { pts, t: dur }; }
  // o: { me: {x,z} or null, cine, shake }
  updateCamera(dt, o = {}) {
    let want;
    if (o.cine) {
      const a = this.time * 0.045;
      const r = 46;
      want = { pos: new THREE.Vector3(Math.sin(a) * r, 15 + Math.sin(a * 1.3) * 3, Math.cos(a) * r * 0.8), look: new THREE.Vector3(0, 0, 0), fov: 44, speed: 1.5 };
    } else if (this.shot && this.shot.t > 0) {
      this.shot.t -= dt;
      const pts = this.shot.pts;
      let cx = 0, cz = 0; for (const p of pts) { cx += p[0]; cz += p[1]; } cx /= pts.length; cz /= pts.length;
      let span = 7; for (const p of pts) span = Math.max(span, Math.abs(p[0] - cx) * 1.2 + 4, Math.abs(p[1] - cz) * 1.8 + 4);
      const tall = this.portrait;
      want = tall ? { pos: new THREE.Vector3(cx + span * 1.1, span * 1.6, cz), look: new THREE.Vector3(cx, 0, cz), fov: 46, speed: 5 }
        : { pos: new THREE.Vector3(cx, span * 1.25, cz + span * 1.0), look: new THREE.Vector3(cx, 0.5, cz), fov: 42, speed: 5 };
    } else {
      const g = this.gameView();
      if (g.hx) {
        // follow the Warden, but never show much beyond the walls
        const mx = Math.max(0, AW + 1.5 - g.hx), mz = Math.max(0, AH + 1.5 - g.hz);
        const tx = o.me ? clamp(o.me.x, -mx, mx) : this.follow.x, tz = o.me ? clamp(o.me.z, -mz, mz) : this.follow.z;
        this.follow.x += (tx - this.follow.x) * Math.min(1, dt * 2.6); this.follow.z += (tz - this.follow.z) * Math.min(1, dt * 2.6);
        if (o.snap) this.follow.set(tx, 0, tz);
        want = { pos: g.pos.clone().add(this.follow), look: g.look.clone().add(this.follow), fov: g.fov, speed: 6 };
      } else {
        if (o.me) { this.lean.x += (o.me.x * 0.05 - this.lean.x) * Math.min(1, dt * 1.5); this.lean.z += (o.me.z * 0.04 - this.lean.z) * Math.min(1, dt * 1.5); }
        want = { pos: g.pos.clone().add(this.lean), look: g.look.clone().add(this.lean), fov: g.fov, speed: 3 };
      }
    }
    const k = o.snap ? 1 : 1 - Math.exp(-dt * (want.speed || 3));
    this.camPos.lerp(want.pos, k); this.camLook.lerp(want.look, k); this.camFov += (want.fov - this.camFov) * k;
    this.trauma = Math.max(0, this.trauma - dt * 1.7);
    const sh = this.trauma * this.trauma * (o.shake ?? 1) * 0.5;
    const c = this.camera;
    c.position.copy(this.camPos);
    if (sh > 0) { c.position.x += (Math.random() - 0.5) * sh; c.position.z += (Math.random() - 0.5) * sh; }
    c.up.set(0, 1, 0);
    c.lookAt(this.camLook);
    if (c.fov !== this.camFov) { c.fov = this.camFov; c.updateProjectionMatrix(); }
    this.sky.position.copy(c.position);
  }
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
    for (const f of this.anim) f(t);
    for (const m of this.decalPool) if (m.visible) m.material.uniforms.uTime.value = t;
    // ambient particles: embers over the foundry, rain over the reactor
    if (this.embers && Math.random() < dt * 14) this.fx.sparks((Math.random() - 0.5) * AW * 2.4, 0.2, (Math.random() < 0.5 ? -1 : 1) * (AH + 3.4), { n: 1, speed: 1.5, vy: 3, s: 0.16, life: 2.2, g: 0.5, b: 0.15 });
    if (this.rain) {
      const R = this.rain, P = R.pos;
      R.drops.forEach((d, i) => {
        d.y -= d.v * dt; d.x -= d.v * dt * 0.15;
        if (d.y < 0) { d.y = 26 + Math.random() * 4; d.x = (Math.random() - 0.5) * 80; d.z = (Math.random() - 0.5) * 56; if (Math.random() < 0.05) this.fx.dust(d.x, 0.05, d.z, { n: 1, s0: 0.1, s1: 0.4, life: 0.4, a: 0.25, vy: 0.4, up: 0.3, jit: 0.3, k: 1.3 }); }
        P[i * 6] = d.x; P[i * 6 + 1] = d.y; P[i * 6 + 2] = d.z; P[i * 6 + 3] = d.x + 0.12; P[i * 6 + 4] = d.y + 0.8; P[i * 6 + 5] = d.z;
      });
      R.g.attributes.position.needsUpdate = true;
      this.lightningT -= dt;
      let fl = this.skyMat.uniforms.uFlash.value * Math.exp(-dt * 6);
      if (this.lightningT <= 0) { this.lightningT = 5 + Math.random() * 9; fl = CALM.on ? 0.25 : 0.8; }
      this.skyMat.uniforms.uFlash.value = fl;
      this.hemi.intensity = LOOKS[this.lookI].hemi[2] + fl * 1.2;
    }
    this.colMat.uniforms.uTime.value = t;
    this.flash.w = Math.max(0, this.flash.w - dt * 3);
    const shocks = [];
    for (const s of this.shocks) {
      s.t += dt;
      const f = s.t / s.max;
      if (f >= 1) continue;
      this.project(s.x, 0.5, s.z, P0);
      shocks.push(new THREE.Vector4(P0.x / innerWidth, 1 - P0.y / innerHeight, f * 0.35 * s.k, (1 - f) * (CALM.on ? 0.3 : 0.8) * s.k));
    }
    this.shocks = this.shocks.filter((s) => s.t < s.max);
    const L = this.look;
    this.post.render(this.scene, this.camera, {
      bloom: L.bloom * (p.bloom ?? 1), threshold: 1.1, exposure: L.exposure * (p.exposure ?? 1), chroma: 0.0016 + (p.warp ? 0.004 : 0), time: t, desat: (p.desat || 0) + (p.warp ? 0.35 : 0), fade: p.fade || 0, vignette: p.warp ? 0.6 : 0.42,
      flash: this.flash, tint: p.warp ? _tint.set(L.grade[0] * 0.85, L.grade[1] * 1.02, L.grade[2] * 1.2) : _tint.set(...L.grade), shocks, lens: [],
    });
  }

  // draw one of everything once at boot so the first appearance of anything does not stall on a shader compile
  warmUp() {
    const tmp = [MD.pickup(0x8fe4ff).g, MD.wingdrone().g, MD.warden().g, MD.crawler().g, MD.brute().g, MD.spitter().g, MD.hive().g, MD.dart().g, MD.pylon().g, MD.splitter().g, MD.splitter(true).g, MD.dummy().g, MD.survivor(0).g, MD.orb().g];
    for (const k of ['foreman', 'tramline', 'crucible', 'archivist', 'overseer']) tmp.push(MD.boss(k).g);
    tmp.forEach((o, i) => { o.position.set(-20 + i * 2.5, 0, 0); this.scene.add(o); });
    const pv = this.playerView({ id: 1 }), sv = this.survivorView({ look: 0 });
    for (const m of [...this.decalPool.slice(0, 3), this.laneMesh, this.beam, this.beamGlow, ...this.cols.slice(0, 1), ...this.aims.slice(0, 1), this.strips[0], this.lasers[0], this.bolts3[0]]) m.visible = true;
    this.setArc(this.arcs[0], 0, 0, 3, 3, 0.05, 0.3);
    this.fx.explode(0, 1, 0, 1, { metal: true });
    this.fx.flash(0, 1, 0, 1);
    // everything else that only appears later: the second Warden, power-up icons, rail / seeker shots, contact shadows
    const pv2 = MD.warden(0xff5a3a, 0xffd27a); pv2.g.position.set(4, 0, 4); tmp.push(pv2.g); this.scene.add(pv2.g);
    const icon = new THREE.Sprite(this.iconFor('triple')); icon.position.set(0, 2, 0); tmp.push(icon); this.scene.add(icon);
    for (const I of [this.railI, this.seekI, this.blobI, this.shotI, this.boltI, this.boltBI, this.haloI]) { I.count = 1; I.setMatrixAt(0, _m.identity()); }
    // build and compile every sector's floor, environment and scenery now, behind the loading screen, so
    // nothing compiles a shader in the middle of play (each compile was a visible freeze)
    const pr = { bloom: 0.7, threshold: 1.2, exposure: 1, chroma: 0, time: 0, desat: 0, fade: 1, vignette: 0.4, flash: this.flash, tint: _tint.set(1, 1, 1), shocks: [], lens: [] };
    const first = this.lookI;
    for (let i = LOOKS.length - 1; i >= 0; i--) {
      this.setLook(i);
      if (this.rain) for (const R of [this.rain]) R.g.attributes.position.needsUpdate = true;
      this.r.compile(this.scene, this.camera);
      this.post.render(this.scene, this.camera, pr);
    }
    if (first !== 0) this.setLook(first);
    for (const I of [this.railI, this.seekI, this.blobI, this.shotI, this.boltI, this.boltBI, this.haloI]) I.count = 0;
    for (const o of tmp) this.scene.remove(o);
    this.scene.remove(pv.g); this.scene.remove(sv.g);
    for (const m of [...this.decalPool, this.laneMesh, this.beam, this.beamGlow, ...this.cols, ...this.aims, ...this.strips, ...this.lasers, ...this.bolts3]) m.visible = false;
    this.arcs[0].m.visible = false;
    this.fx.clear();
  }
}
const P0 = { x: 0, y: 0, z: 0 };
function angD(a, b) { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; }
// how far a ray from (x, z) at angle a runs before it leaves the arena
function laneLen(x, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const tx = c > 1e-6 ? (AW - x) / c : c < -1e-6 ? (-AW - x) / c : 1e9;
  const tz = s > 1e-6 ? (AH - z) / s : s < -1e-6 ? (-AH - z) / s : 1e9;
  return Math.max(0.5, Math.min(tx, tz));
}
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
