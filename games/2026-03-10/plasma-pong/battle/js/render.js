// The 3D arena: sky, planet, deck, mirror floor, rails, curtains, plus everything synced from the sim.
import * as THREE from '../vendor/three.module.min.js';
import { F, ARENAS, POWERUPS } from './config.js?v=4';
import { bumperPos, sliderPos, cellIndex } from './sim.js?v=4';
import { NOISE } from './shaders.js?v=4';
import { Post } from './post.js?v=4';
import { Sparks, Shards, patchShardMaterial, Lightning, Rings } from './fx.js?v=4';
import { PaddleView, BallView, BoltView, OrbView, DroneView, CellView, CoreView, HoleView, glowSprite, floorGlow, BALL_Y, CALM } from './views.js?v=4';

const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function pickQuality(name) {
  const coarse = matchMedia('(pointer:coarse)').matches;
  const mobile = coarse || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const tiers = {
    ultra: { name: 'ultra', pr: 2, msaa: true, bloomLevels: 6, refl: 0.5, sparks: 6000, shards: 420 },
    high: { name: 'high', pr: 1.5, msaa: true, bloomLevels: 6, refl: 0.38, sparks: 4000, shards: 300 },
    low: { name: 'low', pr: 1.15, msaa: false, bloomLevels: 5, refl: 0.0, sparks: 2200, shards: 160 },
  };
  if (name && tiers[name]) return tiers[name];
  return mobile ? { ...tiers.high, name: 'auto-mobile', pr: Math.min(1.6, devicePixelRatio || 1), refl: 0.3, sparks: 3000 } : tiers.ultra;
}

// ------------------------------------------------------------------ shaders
const SKY_FRAG = /* glsl */ `
uniform vec3 uA, uB, uC; uniform float uTime;
varying vec3 vDir;
${NOISE}
float stars(vec3 d, float sc){
  vec3 p = d * sc; vec3 i = floor(p); vec3 f = fract(p) - 0.5;
  float h = hash13(i);
  vec3 o = vec3(hash13(i + 1.3), hash13(i + 2.7), hash13(i + 5.1)) - 0.5;
  float dist = length(f - o * 0.7);
  float tw = 0.6 + 0.4 * sin(uTime * (1.0 + h * 4.0) + h * 40.0);
  return step(0.93, h) * smoothstep(0.09, 0.0, dist) * (h - 0.93) * 16.0 * tw;
}
void main(){
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(uA, uB * 0.5, 0.5 + 0.5 * h);
  float n = fbm(d * 2.2 + vec3(0.0, uTime * 0.006, 0.0));
  float n2 = fbm(d * 4.6 + vec3(5.0, 1.0, uTime * 0.01));
  float n3 = fbm(d * 9.0 + vec3(2.0, 7.0, 0.0));
  col += uB * pow(n, 2.6) * 4.5;
  col += uC * pow(n2, 3.2) * 7.0 * (0.6 + 0.4 * n3);
  col += mix(uB, uC, 0.5) * pow(max(0.0, n3 - 0.45), 2.0) * 3.0;
  col += vec3(stars(d, 220.0) + stars(d, 480.0) * 0.6);
  gl_FragColor = vec4(col, 1.0);
}`;

const PLANET_FRAG = /* glsl */ `
uniform vec3 uColor; uniform vec3 uSun; uniform float uTime;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
${NOISE}
void main(){
  vec3 n = normalize(vN);
  float l = max(dot(n, normalize(uSun)), 0.0);
  float bands = fbm(vec3(vP.y * 0.09, vP.x * 0.01 + uTime * 0.01, vP.z * 0.01)) ;
  vec3 surf = uColor * (0.25 + bands * 0.9);
  float rim = pow(max(1.0 - max(dot(n, normalize(vV)), 0.0), 0.0), 3.0);
  vec3 col = (surf * (0.03 + l * 0.6) + uColor * rim * 0.9 * (0.25 + l)) * 0.75;
  gl_FragColor = vec4(col, 1.0);
}`;
const FRES_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz; vP = position; gl_Position = projectionMatrix * viewMatrix * w; }`;
const UV_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FLOOR_VERT = /* glsl */ `
uniform mat4 uReflMat;
varying vec3 vW; varying vec4 vR;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vR = uReflMat * w; gl_Position = projectionMatrix * viewMatrix * w; }`;
const FLOOR_FRAG = /* glsl */ `
uniform float uTime; uniform vec3 uGrid, uP1, uP2;
uniform vec4 uBalls[6]; uniform vec3 uBallCol[6];
uniform vec4 uWells[3];
uniform vec4 uRip[10]; uniform vec3 uRipCol[10];
uniform sampler2D uRefl; uniform float uReflK; uniform vec2 uReflTexel;
uniform float uDanger1, uDanger2, uChrono1, uChrono2, uBeat;
varying vec3 vW; varying vec4 vR;
${NOISE}
float grid(vec2 p, float w){ vec2 fw = fwidth(p); vec2 g = abs(fract(p - 0.5) - 0.5) / max(fw, vec2(1e-4)); return 1.0 - min(min(g.x, g.y) / w, 1.0); }
void main(){
  vec2 p = vW.xz;
  vec2 q = p;
  for (int i = 0; i < 3; i++) { vec4 w = uWells[i]; if (w.z <= 0.0) continue; vec2 d = w.xy - p; float r2 = dot(d, d); q += d * w.z * 0.03 / (r2 + 1.2); }
  vec3 lightC = vec3(0.0);
  for (int i = 0; i < 6; i++) { vec4 b = uBalls[i]; if (b.z <= 0.0) continue; vec2 d = b.xy - p; float r2 = dot(d, d); q += d * 0.35 * b.z / (r2 + 0.9); lightC += uBallCol[i] * b.z * exp(-r2 * 0.75); }
  vec3 ripC = vec3(0.0);
  for (int i = 0; i < 10; i++) {
    vec4 r = uRip[i]; if (r.w <= 0.0) continue;
    vec2 d = p - r.xy; float dist = length(d);
    float front = r.z * 13.0;
    float band = exp(-pow((dist - front) * 2.4, 2.0));
    float fade = exp(-r.z * 2.4) * r.w;
    q += (d / max(dist, 1e-3)) * band * fade * 0.22;
    ripC += uRipCol[i] * band * fade;
  }
  float g1 = grid(q, 1.1);
  float g2 = grid(q * 4.0, 0.9) * 0.22;
  float side = smoothstep(-1.5, 1.5, p.y);
  vec3 team = mix(uP2, uP1, side);
  vec3 col = vec3(0.004, 0.006, 0.014);
  float pulse = 0.85 + 0.15 * uBeat;
  col += mix(uGrid, team, 0.35) * (g1 * 0.5 + g2) * pulse;
  col += team * smoothstep(6.5, 11.6, abs(p.y)) * 0.07;
  float cl = 1.0 - smoothstep(0.0, fwidth(p.y) * 2.0 + 0.03, abs(p.y));
  float circ = 1.0 - smoothstep(0.0, 0.05, abs(length(p) - 2.2));
  col += vec3(0.6, 0.85, 1.0) * (cl + circ) * 0.55;
  // goal danger lines
  float gl = 1.0 - smoothstep(0.0, 0.05, abs(abs(p.y) - 11.55));
  col += team * gl * 1.2;
  col += lightC * 0.9 + ripC * 0.9;
  vec2 ruv = vR.xy / vR.w + (q - p) * 0.015;
  vec3 refl = texture2D(uRefl, ruv).rgb * 0.4 + (texture2D(uRefl, ruv + uReflTexel * vec2(2.0, 1.0)).rgb + texture2D(uRefl, ruv - uReflTexel * vec2(2.0, 1.0)).rgb + texture2D(uRefl, ruv + uReflTexel * vec2(-1.0, 2.0)).rgb) * 0.2;
  col += refl * uReflK;
  float alarm = 0.5 + 0.5 * sin(uTime * 9.0);
  col += vec3(1.0, 0.05, 0.08) * (uDanger1 * smoothstep(5.5, 11.5, p.y) + uDanger2 * smoothstep(5.5, 11.5, -p.y)) * alarm * 0.18;
  float ch = uChrono1 * step(0.0, p.y) + uChrono2 * step(p.y, 0.0);
  col += vec3(0.3, 0.9, 1.0) * ch * (0.04 + 0.06 * (0.5 + 0.5 * sin(length(p - vec2(0.0, sign(p.y) * 6.0)) * 3.0 - uTime * 4.0)));
  col *= smoothstep(7.25, 6.6, abs(p.x)) * 0.6 + 0.4;
  gl_FragColor = vec4(col, 1.0);
}`;

const DECK_VERT = /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const DECK_FRAG = /* glsl */ `
uniform float uTime; uniform vec3 uGrid, uP1, uP2; uniform float uDW, uDL;
uniform vec4 uBalls[6]; uniform vec3 uBallCol[6];
varying vec3 vW;
${NOISE}
float line(float d, float w){ return 1.0 - smoothstep(0.0, w + fwidth(d) * 1.5, abs(d)); }
void main(){
  vec2 p = vW.xz;
  if (vW.y < -0.5) { gl_FragColor = vec4(0.004, 0.005, 0.01, 1.0); return; }
  vec2 g = fract(p / 1.6) - 0.5;
  float seam = max(line(g.x, 0.012), line(g.y, 0.012));
  vec2 cell = floor(p / 1.6);
  float tone = hash12(cell) * 0.02;
  vec3 col = vec3(0.018, 0.021, 0.032) + tone - seam * 0.012;
  float bolt = smoothstep(0.06, 0.03, length(abs(g) - 0.42)) * 0.04;
  col += bolt;
  float side = smoothstep(-2.0, 2.0, p.y);
  vec3 team = mix(uP2, uP1, side);
  float inner = line(max(abs(p.x) - 7.85, abs(p.y) - 12.4), 0.03);
  float pulse = 0.6 + 0.4 * sin(p.y * 0.8 - uTime * 3.0);
  col += mix(uGrid, team, 0.6) * inner * 2.2 * pulse;
  vec2 q = abs(p) - vec2(uDW, uDL) + 0.55;
  float rim = line(length(max(q, 0.0)) + min(max(q.x, q.y), 0.0), 0.03);
  col += uGrid * rim * 1.8;
  float chev = line(abs(fract(p.y * 0.5 - abs(p.x) * 0.35 + uTime * 0.4 * sign(p.y)) - 0.5) - 0.25, 0.03) * step(abs(p.x), 2.4) * step(12.4, abs(p.y)) * step(abs(p.y), 15.6);
  col += team * chev * 0.5;
  for (int i = 0; i < 6; i++) { vec4 b = uBalls[i]; if (b.z <= 0.0) continue; vec2 d = b.xy - p; col += uBallCol[i] * b.z * exp(-dot(d, d) * 0.12) * 0.25; }
  gl_FragColor = vec4(col, 1.0);
}`;

const RAIL_FRAG = /* glsl */ `
uniform vec3 uColor; uniform vec3 uColor2; uniform float uTime; uniform vec4 uHits[4]; uniform float uLen;
varying vec3 vL; varying vec3 vN; varying vec3 vV;
void main(){
  float top = smoothstep(0.24, 0.275, vL.y);
  float fres = pow(max(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0), 2.0);
  vec3 team = mix(uColor2, uColor, smoothstep(-2.0, 2.0, vL.z));
  float flow = 0.5 + 0.5 * sin(vL.z * 1.4 - uTime * 6.0);
  vec3 col = team * (0.05 + fres * 0.3) + team * top * (2.5 + flow * 1.2);
  for (int i = 0; i < 4; i++) {
    vec4 h = uHits[i]; if (h.w <= 0.0) continue;
    float d = abs(vL.z - h.x);
    col += vec3(1.0, 0.95, 0.9) * exp(-d * d * 2.0) * exp(-h.y * 5.0) * 5.0 * h.w;
  }
  gl_FragColor = vec4(col, 1.0);
}`;
const LOCAL_VERT = /* glsl */ `
varying vec3 vL; varying vec3 vN; varying vec3 vV;
void main(){ vL = position; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vV = cameraPosition - w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;

const CURTAIN_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uGaps[7]; uniform vec2 uHit; uniform float uAmt;
varying vec2 vUv;
float hexd(vec2 p){ p = abs(p); return max(p.x * 0.866 + p.y * 0.5, p.y); }
void main(){
  float x = (vUv.x - 0.5) * 14.0;
  int ci = int(clamp(floor((x + 7.0) / 2.0), 0.0, 6.0));
  float gap = 0.0;
  for (int i = 0; i < 7; i++) if (i == ci) gap = uGaps[i];
  vec2 p = vec2(vUv.x * 24.0, vUv.y * 4.0 - uTime * 0.5);
  vec2 r = vec2(1.0, 1.732);
  vec2 a = mod(p, r) - r * 0.5, b = mod(p - r * 0.5, r) - r * 0.5;
  vec2 g = dot(a, a) < dot(b, b) ? a : b;
  float edge = smoothstep(0.38, 0.5, hexd(g));
  float fall = pow(max(1.0 - vUv.y, 0.0), 1.6);
  vec3 c = mix(uColor, vec3(1.0, 0.08, 0.12), gap);
  float alarm = gap * (0.6 + 0.4 * sin(uTime * 12.0));
  float base = (0.1 + edge * 0.55) * fall * (1.0 + alarm * 2.0);
  base += exp(-vUv.y * 30.0) * (1.5 + gap * 2.0);
  float hd = abs(x - uHit.x);
  base += exp(-hd * hd * 0.8) * exp(-uHit.y * 3.0) * 6.0 * fall;
  gl_FragColor = vec4(c * base * uAmt, 1.0);
}`;

const SHIELD_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uAmt; uniform vec2 uHit;
varying vec2 vUv;
void main(){
  vec2 p = vec2(vUv.x * 30.0, vUv.y * 2.0);
  float lines = smoothstep(0.85, 1.0, sin(p.x * 3.14159 + uTime * 3.0)) * 0.3 + smoothstep(0.9, 1.0, sin(p.y * 12.0 - uTime * 8.0)) * 0.4;
  float fall = 1.0 - vUv.y;
  float x = (vUv.x - 0.5) * 14.0;
  float hit = exp(-pow(x - uHit.x, 2.0) * 0.6) * exp(-uHit.y * 4.0) * 5.0;
  gl_FragColor = vec4(uColor * (0.25 + lines + hit) * fall * uAmt + uColor * exp(-vUv.y * 25.0) * 2.0 * uAmt, 1.0);
}`;

const PATH_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uTime; uniform float uAmt;
varying float vAlong; varying float vEdge;
void main(){
  float dash = step(0.45, fract(vAlong * 18.0 - uTime * 3.0));
  float e = 1.0 - abs(vEdge);
  gl_FragColor = vec4(uColor * e * (0.3 + dash * 0.9) * uAmt * smoothstep(0.0, 0.08, vAlong), 1.0);
}`;
const PATH_VERT = /* glsl */ `
attribute float along; attribute float edge; varying float vAlong; varying float vEdge;
void main(){ vAlong = along; vEdge = edge; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

// A dashed path lying flat on the floor (AI intent / scope power-up)
class FlatPath {
  constructor(scene, color, n = 160, width = 0.07) {
    this.n = n; this.width = width;
    this.pos = new Float32Array(n * 2 * 3);
    const along = new Float32Array(n * 2), edge = new Float32Array(n * 2), idx = [];
    for (let i = 0; i < n; i++) {
      along[i * 2] = along[i * 2 + 1] = i / (n - 1);
      edge[i * 2] = -1; edge[i * 2 + 1] = 1;
      if (i < n - 1) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('along', new THREE.BufferAttribute(along, 1));
    g.setAttribute('edge', new THREE.BufferAttribute(edge, 1));
    g.setIndex(idx);
    g.setDrawRange(0, 0);
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({ vertexShader: PATH_VERT, fragmentShader: PATH_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: hdr(color, 2.2) }, uTime: { value: 0 }, uAmt: { value: 1 } } });
    this.mesh = new THREE.Mesh(g, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 6;
    scene.add(this.mesh);
  }
  set(flat, y = 0.06) {
    // flat = [x0, z0, x1, z1, ...]
    const m = Math.min(this.n, flat.length / 2);
    if (m < 2) { this.geo.setDrawRange(0, 0); return; }
    for (let i = 0; i < m; i++) {
      const j = Math.round((i / (m - 1)) * (flat.length / 2 - 1));
      const x = flat[j * 2], z = flat[j * 2 + 1];
      const ja = Math.max(0, j - 1), jb = Math.min(flat.length / 2 - 1, j + 1);
      let tx = flat[jb * 2] - flat[ja * 2], tz = flat[jb * 2 + 1] - flat[ja * 2 + 1];
      const l = Math.hypot(tx, tz) || 1;
      tx /= l; tz /= l;
      const k = (this.n - m + i) * 6;
      this.pos[k] = x - tz * this.width; this.pos[k + 1] = y; this.pos[k + 2] = z + tx * this.width;
      this.pos[k + 3] = x + tz * this.width; this.pos[k + 4] = y; this.pos[k + 5] = z - tx * this.width;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.setDrawRange((this.n - m) * 6, (m - 1) * 6);
  }
  hide() { this.geo.setDrawRange(0, 0); }
}

// ------------------------------------------------------------------ renderer
export class Renderer {
  constructor(canvas, quality) {
    this.q = quality;
    this.canvas = canvas;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false });
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NoToneMapping;
    this.r = r;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 3000);
    this.camera.position.set(0, 16, 20);
    this.camera.lookAt(0, 0, 0);
    this.post = new Post(r, quality);
    this.time = 0;
    this.scale = 1;            // dynamic resolution
    this.colors = { 1: new THREE.Color(0x2ff5ff), '-1': new THREE.Color(0xff3dd8) };
    this.build();
    this.views = { paddles: new Map(), balls: new Map(), orbs: new Map(), drones: new Map(), wells: new Map() };
    this.bolts = [];
    this.flashLights = [];
    this.shocks = [];
    this.railHits = { 1: [], '-1': [] };
    this.curtainHit = { 1: [0, 9], '-1': [0, 9] };
    this.barrierHit = { 1: [0, 9], '-1': [0, 9] };
    this.ripples = [];
    this.kick = { chroma: 0, flash: new THREE.Vector4(1, 1, 1, 0), fade: 0, desat: 0 };
    this.calmFlash = new THREE.Vector4(1, 1, 1, 0);
    this.pending = [];
    this.arcT = 0;
    this.resize();
  }

  build() {
    const S = this.scene;
    // sky
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
      fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false,
      uniforms: { uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() }, uTime: { value: 0 } },
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1000, 48, 24), this.skyMat);
    this.sky.renderOrder = -10;
    this.sky.frustumCulled = false;
    S.add(this.sky);
    // planet + ring
    this.planetMat = new THREE.ShaderMaterial({ vertexShader: FRES_VERT, fragmentShader: PLANET_FRAG,
      uniforms: { uColor: { value: new THREE.Color() }, uSun: { value: new THREE.Vector3(0.6, 0.3, 0.7) }, uTime: { value: 0 } } });
    this.planet = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), this.planetMat);
    S.add(this.planet);
    const ringGeo = new THREE.RingGeometry(1.35, 2.3, 128, 1);
    this.pRing = new THREE.Mesh(ringGeo, new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `uniform vec3 uColor; varying vec3 vP; ${NOISE}
        void main(){ float r = length(vP.xy); float b = vnoise(vec3(r * 22.0, 0.0, 0.0)); float a = smoothstep(1.35, 1.45, r) * smoothstep(2.3, 2.0, r) * (0.25 + b * 0.75); gl_FragColor = vec4(uColor * a, 1.0); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color() } },
    }));
    this.planet.add(this.pRing);
    this.pRing.rotation.set(1.2, 0.3, 0.2);

    // env map for the metals
    this.pmrem = new THREE.PMREMGenerator(this.r);

    // deck (the floating platform around the court)
    const deckShape = new THREE.Shape();
    const dw = 10.2, dl = 16.6, rr = 2.6;
    deckShape.moveTo(-dw + rr, -dl);
    deckShape.lineTo(dw - rr, -dl); deckShape.quadraticCurveTo(dw, -dl, dw, -dl + rr);
    deckShape.lineTo(dw, dl - rr); deckShape.quadraticCurveTo(dw, dl, dw - rr, dl);
    deckShape.lineTo(-dw + rr, dl); deckShape.quadraticCurveTo(-dw, dl, -dw, dl - rr);
    deckShape.lineTo(-dw, -dl + rr); deckShape.quadraticCurveTo(-dw, -dl, -dw + rr, -dl);
    const hole = new THREE.Path();
    hole.moveTo(-F.hw, -F.goalZ); hole.lineTo(F.hw, -F.goalZ); hole.lineTo(F.hw, F.goalZ); hole.lineTo(-F.hw, F.goalZ); hole.lineTo(-F.hw, -F.goalZ);
    deckShape.holes.push(hole);
    const deckGeo = new THREE.ExtrudeGeometry(deckShape, { depth: 1.6, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 2, curveSegments: 12 });
    deckGeo.rotateX(Math.PI / 2);
    deckGeo.translate(0, -0.03, 0);
    this.deckMat = new THREE.MeshStandardMaterial({ color: 0x0b0e16, metalness: 0.85, roughness: 0.42 });
    this.deckTop = new THREE.ShaderMaterial({ vertexShader: DECK_VERT, fragmentShader: DECK_FRAG,
      uniforms: { uTime: { value: 0 }, uGrid: { value: new THREE.Color() }, uP1: { value: new THREE.Color() }, uP2: { value: new THREE.Color() }, uDW: { value: dw }, uDL: { value: dl }, uBalls: null, uBallCol: null } });
    this.deck = new THREE.Mesh(deckGeo, [this.deckTop, this.deckMat]);
    S.add(this.deck);
    this.trimMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 2, 2) });
    // scrolling LED boards along the long sides
    this.boards = [];
    for (const sx of [-1, 1]) {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 64;
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      // two single-sided faces back to back, so the text reads correctly from both sides
      const m = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color(1.8, 1.8, 1.8) });
      const geo = new THREE.PlaneGeometry(dl * 1.7, 0.75);
      const f1 = new THREE.Mesh(geo, mat), f2 = new THREE.Mesh(geo, mat);
      f2.rotation.y = Math.PI;
      m.add(f1, f2);
      m.position.set(sx * (dw - 0.75), 0.42, 0);
      m.rotation.y = -sx * Math.PI / 2;
      m.userData = { c, tex, dir: sx, len: dl * 1.7 };
      S.add(m);
      this.boards.push(m);
    }
    // the floor
    this.reflRT = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true });
    this.reflCam = new THREE.PerspectiveCamera();
    this.reflMat = new THREE.Matrix4();
    const vec4s = (n) => Array.from({ length: n }, () => new THREE.Vector4());
    const cols = (n) => Array.from({ length: n }, () => new THREE.Color());
    this.floorMat = new THREE.ShaderMaterial({
      vertexShader: FLOOR_VERT, fragmentShader: FLOOR_FRAG,
      uniforms: {
        uTime: { value: 0 }, uGrid: { value: new THREE.Color() }, uP1: { value: new THREE.Color() }, uP2: { value: new THREE.Color() },
        uBalls: { value: vec4s(6) }, uBallCol: { value: cols(6) }, uWells: { value: vec4s(3) }, uRip: { value: vec4s(10) }, uRipCol: { value: cols(10) },
        uRefl: { value: this.reflRT.texture }, uReflK: { value: 0.55 }, uReflMat: { value: this.reflMat }, uReflTexel: { value: new THREE.Vector2(0.002, 0.002) },
        uDanger1: { value: 0 }, uDanger2: { value: 0 }, uChrono1: { value: 0 }, uChrono2: { value: 0 }, uBeat: { value: 0 },
      },
    });
    this.deckTop.uniforms.uBalls = this.floorMat.uniforms.uBalls;
    this.deckTop.uniforms.uBallCol = this.floorMat.uniforms.uBallCol;
    const floorGeo = new THREE.PlaneGeometry(F.hw * 2, F.goalZ * 2, 1, 1);
    floorGeo.rotateX(-Math.PI / 2);
    this.floor = new THREE.Mesh(floorGeo, this.floorMat);
    S.add(this.floor);
    // rails
    this.railMats = [];
    for (const sx of [-1, 1]) {
      const mat = new THREE.ShaderMaterial({ vertexShader: LOCAL_VERT, fragmentShader: RAIL_FRAG,
        uniforms: { uColor: { value: new THREE.Color() }, uColor2: { value: new THREE.Color() }, uTime: { value: 0 }, uHits: { value: vec4s(4) }, uLen: { value: F.goalZ } } });
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, F.goalZ * 2 + 0.6), mat);
      rail.position.set(sx * (F.hw + 0.15), 0.275, 0);
      S.add(rail);
      this.railMats.push(mat);
    }
    // goal curtains + barrier shields
    this.curtains = {};
    this.barriers = {};
    for (const s of [1, -1]) {
      const g = new THREE.PlaneGeometry(F.hw * 2, 1.35);
      g.translate(0, 0.675, 0);
      const gaps = [0, 0, 0, 0, 0, 0, 0];
      const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: CURTAIN_FRAG, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color() }, uTime: { value: 0 }, uGaps: { value: gaps }, uHit: { value: new THREE.Vector2(0, 9) }, uAmt: { value: 1 } } }));
      m.position.set(0, 0, s * (F.goalZ + 0.02));
      m.renderOrder = 2;
      S.add(m);
      this.curtains[s] = m;
      const bg = new THREE.PlaneGeometry(F.hw * 2, 0.95);
      bg.translate(0, 0.475, 0);
      const b = new THREE.Mesh(bg, new THREE.ShaderMaterial({ vertexShader: UV_VERT, fragmentShader: SHIELD_FRAG, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uColor: { value: hdr(0x2ff5d2, 1.4) }, uTime: { value: 0 }, uAmt: { value: 0 }, uHit: { value: new THREE.Vector2(0, 9) } } }));
      b.position.set(0, 0, s * (F.cellZ - F.cellHD - 0.55));
      b.visible = false;
      S.add(b);
      this.barriers[s] = b;
    }
    // floodlight pylons at the deck corners
    this.pylonLights = [];
    for (const [x, z] of [[-8.8, -15.2], [8.8, -15.2], [-8.8, 15.2], [8.8, 15.2]]) {
      const py = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 4, 10), this.deckMat);
      py.position.set(x, 2, z);
      S.add(py);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.4), this.trimMat);
      lamp.position.set(x, 4.1, z);
      lamp.lookAt(0, 0, 0);
      S.add(lamp);
      const gl = glowSprite(0xffffff, 0.45, 2.2);
      gl.position.copy(lamp.position);
      S.add(gl);
      this.pylonLights.push(gl);
    }
    // lights
    this.hemi = new THREE.HemisphereLight(0x6070ff, 0x100818, 0.6);
    S.add(this.hemi);
    this.key = new THREE.DirectionalLight(0xffffff, 0.8);
    this.key.position.set(-6, 14, 8);
    S.add(this.key);
    this.lights = [];
    for (let i = 0; i < 6; i++) {
      const L = new THREE.PointLight(0xffffff, 0, 10, 2);
      L.position.set(0, -50, 0);
      S.add(L);
      this.lights.push(L);
    }
    // fx
    this.sparks = new Sparks(this.q.sparks);
    S.add(this.sparks.points);
    this.shards = new Shards(this.q.shards);
    patchShardMaterial(this.shards.mat);
    S.add(this.shards.mesh);
    this.lightning = new Lightning(S, 16);
    this.rings = new Rings(S, 14);
    this.paths = [new FlatPath(S, 0x2ff5ff), new FlatPath(S, 0xff3dd8), new FlatPath(S, 0xffffff, 120, 0.05), new FlatPath(S, 0xffffff, 120, 0.05)];
    this.reticles = [1, -1].map(() => { const r = floorGlow(0xffffff, 2.5, 1.4, 1.4); r.visible = false; S.add(r); return r; });
    // boss laser
    const tg = new THREE.PlaneGeometry(0.16, F.goalZ * 2);
    tg.rotateX(-Math.PI / 2);
    this.laserTele = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ color: hdr(0xff2020, 3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.laserTele.position.y = 0.06;
    this.laserTele.visible = false;
    S.add(this.laserTele);
    const bg = new THREE.CylinderGeometry(0.22, 0.22, F.goalZ * 2, 12, 1, true);
    bg.rotateX(Math.PI / 2);
    this.laserBeam = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ color: hdr(0xff4030, 8), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.laserBeam.position.y = 0.5;
    this.laserBeam.visible = false;
    S.add(this.laserBeam);
    this.hazard = new THREE.Group();
    S.add(this.hazard);
  }

  makeEnv(arena) {
    const es = new THREE.Scene();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 8), new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: new THREE.Color(arena.sky[1]).multiplyScalar(0.6) }));
    es.add(sky);
    const panel = (color, k, x, y, z, w, h) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: hdr(color, k), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m);
    };
    panel(0xffffff, 3, 0, 30, 0, 30, 6);
    panel(arena.grid, 4, -30, 8, 0, 6, 30);
    panel(arena.accent, 4, 30, 8, 0, 6, 30);
    panel(this.colors[1].getHex(), 3, 0, 6, 30, 30, 4);
    panel(this.colors[-1].getHex(), 3, 0, 6, -30, 30, 4);
    const t = this.pmrem.fromScene(es, 0.03).texture;
    es.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    return t;
  }

  // ------------------------------------------------------------------ world binding
  setWorld(W, sides) {
    this.W = W;
    this.sides = sides; // { 1: {color, pilot}, -1: {...} }
    this.colors[1].set(sides[1].color);
    this.colors[-1].set(sides[-1].color);
    const A = W.arena;
    this.arena = A;
    this.skyMat.uniforms.uA.value.set(A.sky[0]);
    this.skyMat.uniforms.uB.value.set(A.sky[1]);
    this.skyMat.uniforms.uC.value.set(A.sky[2]);
    const P = A.planet;
    this.planet.position.set(...P.pos);
    this.planet.scale.setScalar(P.r);
    this.planetMat.uniforms.uColor.value.set(P.color);
    this.planetMat.uniforms.uSun.value.set(-P.pos[0], 80, -P.pos[2] * 0.2).normalize();
    this.pRing.visible = P.ring;
    this.pRing.material.uniforms.uColor.value.set(P.color).multiplyScalar(0.4);
    this.floorMat.uniforms.uGrid.value.set(A.grid).multiplyScalar(0.9);
    this.floorMat.uniforms.uP1.value.copy(this.colors[1]);
    this.floorMat.uniforms.uP2.value.copy(this.colors[-1]);
    this.trimMat.color.set(A.grid).multiplyScalar(2.2);
    this.deckTop.uniforms.uGrid.value.set(A.grid);
    this.deckTop.uniforms.uP1.value.copy(this.colors[1]);
    this.deckTop.uniforms.uP2.value.copy(this.colors[-1]);
    for (const b of this.boards) this.paintBoard(b, A, sides);
    for (const m of this.railMats) { m.uniforms.uColor.value.copy(this.colors[1]); m.uniforms.uColor2.value.copy(this.colors[-1]); }
    for (const s of [1, -1]) this.curtains[s].material.uniforms.uColor.value.copy(this.colors[s]).multiplyScalar(1.2);
    this.hemi.color.set(A.grid);
    this.hemi.groundColor.set(A.sky[0]);
    if (this.env) this.env.dispose();
    this.env = this.makeEnv(A);
    this.scene.environment = this.env;
    this.deckMat.envMap = this.env; this.deckMat.needsUpdate = true;
    // clear old views
    for (const [, v] of this.views.paddles) this.scene.remove(v.group, v.under);
    for (const [, v] of this.views.balls) v.remove(this.scene);
    for (const [, v] of this.views.orbs) v.remove();
    for (const [, v] of this.views.drones) v.remove();
    for (const [, v] of this.views.wells) v.remove();
    for (const k of Object.keys(this.views)) this.views[k].clear();
    if (this.cellViews) for (const v of this.cellViews) this.scene.remove(v.mesh);
    if (this.coreViews) for (const v of this.coreViews) this.scene.remove(v.group);
    this.cellViews = [];
    for (const s of [1, -1]) for (const c of W.cells[s]) this.cellViews.push(new CellView(this.scene, c, this.colors[s]));
    this.coreViews = [1, -1].map((s) => new CoreView(this.scene, W.cores[s], this.colors[s], this.env, W.cores[s].max));
    this.sparks.clear(); this.shards.clear();
    this.buildHazards(W);
    this.ripples = [];
    this.shocks = [];
  }

  paintBoard(b, A, sides) {
    const { c, tex, len } = b.userData;
    let g = c.getContext('2d');
    const font = 'bold 40px Orbitron, sans-serif';
    const words = ['PLASMA PONG', A.name, `${sides[1].name}  VS  ${sides[-1].name}`, 'BATTLE EDITION'];
    const cols = ['#' + new THREE.Color(A.grid).getHexString(), '#ffffff', '#' + new THREE.Color(A.accent).getHexString(), '#ffd23f'];
    // one seamless cycle of text squeezed into the fixed-size canvas (a GPU texture can't change
    // size once allocated); the texture repeats the cycle along the board
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, c.width, c.height);
    g.font = font;
    g.textBaseline = 'middle';
    let cycle = 0;
    for (const w of words) cycle += g.measureText(w).width + 100;
    const k = c.width / cycle;
    g.setTransform(k, 0, 0, 1, 0, 0);
    let x = 0;
    words.forEach((w, i) => {
      g.fillStyle = cols[i];
      g.fillText(w, x, 34);
      x += g.measureText(w).width + 30;
      g.fillStyle = '#ffffff';
      g.fillText('\u25C6', x, 34);
      x += 70;
    });
    g.setTransform(1, 0, 0, 1, 0, 0);
    tex.repeat.x = (len * (c.height / 0.75)) / cycle;
    g.globalCompositeOperation = 'destination-out';
    g.fillStyle = 'rgba(0,0,0,0.55)';
    for (let y = 0; y < c.height; y += 4) g.fillRect(0, y, c.width, 1);
    for (let xx = 0; xx < c.width; xx += 4) g.fillRect(xx, 0, 1, c.height);
    g.globalCompositeOperation = 'source-over';
    tex.needsUpdate = true;
  }

  buildHazards(W) {
    const g = this.hazard;
    while (g.children.length) g.remove(g.children[0]);
    this.holeView && this.holeView.remove();
    this.holeView = null;
    this.bumperViews = [];
    this.sliderViews = [];
    this.portalViews = [];
    const A = W.arena;
    if (W.hole) this.holeView = new HoleView(this.scene, 1.4, 0xffb050, 0x8a3cff);
    if (W.bumpers) {
      for (let i = 0; i < W.bumpers.n; i++) {
        const b = new THREE.Group();
        const r = W.bumpers.r;
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.1, 0.7, 32), new THREE.MeshStandardMaterial({ color: 0x0a1a18, metalness: 0.7, roughness: 0.2, envMap: this.env }));
        body.position.y = 0.35;
        b.add(body);
        const ringMat = new THREE.MeshBasicMaterial({ color: hdr(A.grid, 4) });
        for (const y of [0.08, 0.66]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r * 1.05, 0.05, 8, 40), ringMat); t.rotation.x = Math.PI / 2; t.position.y = y; b.add(t); }
        const cap = new THREE.Mesh(new THREE.CircleGeometry(r * 0.8, 32), new THREE.MeshBasicMaterial({ color: hdr(A.accent, 3) }));
        cap.rotation.x = -Math.PI / 2; cap.position.y = 0.71;
        b.add(cap);
        b.add(floorGlow(A.grid, 1.5, 3, 3));
        b.userData = { ringMat, pop: 0 };
        g.add(b);
        this.bumperViews.push(b);
      }
    }
    if (W.sliders) {
      const S = W.sliders;
      for (let i = 0; i < 2; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(S.hw * 2, 0.5, S.hd * 2), new THREE.MeshStandardMaterial({ color: 0x1a1206, metalness: 0.8, roughness: 0.3, envMap: this.env, emissive: new THREE.Color(A.grid), emissiveIntensity: 0.5 }));
        m.position.y = 0.25;
        const edge = new THREE.Mesh(new THREE.BoxGeometry(S.hw * 2 + 0.04, 0.06, S.hd * 2 + 0.04), new THREE.MeshBasicMaterial({ color: hdr(A.grid, 5) }));
        edge.position.y = 0.26;
        m.add(edge);
        m.add(floorGlow(A.grid, 1.2, S.hw * 2 + 1.5, 1.6));
        g.add(m);
        this.sliderViews.push(m);
      }
    }
    if (W.portals) {
      const P = W.portals;
      const pairs = [[-1, P.z, 0xff9a2a], [1, -P.z, 0xff9a2a], [-1, -P.z, 0x3ac8ff], [1, P.z, 0x3ac8ff]];
      for (const [wall, z, color] of pairs) {
        const geo = new THREE.PlaneGeometry(P.len, 1.5);
        const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: UV_VERT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
          fragmentShader: /* glsl */ `uniform vec3 uColor; uniform float uTime; uniform float uFlash; varying vec2 vUv; ${NOISE}
            void main(){ vec2 p = (vUv - 0.5) * vec2(2.0, 2.0); float r = length(p * vec2(1.0, 1.2)); float a = atan(p.y, p.x);
              float sw = fbm3(vec3(cos(a * 3.0 + r * 6.0 - uTime * 4.0), sin(a * 3.0 + r * 6.0 - uTime * 4.0), r * 2.0));
              float body = smoothstep(1.0, 0.6, r); float rim = exp(-pow((r - 0.92) * 14.0, 2.0));
              gl_FragColor = vec4(uColor * (body * (0.3 + sw * 1.4) + rim * 3.0) * (1.0 + uFlash * 3.0), 1.0); }`,
          uniforms: { uColor: { value: hdr(color, 1.5) }, uTime: { value: 0 }, uFlash: { value: 0 } } }));
        m.position.set(wall * (F.hw + 0.02), 0.75, z);
        m.rotation.y = Math.PI / 2;
        m.renderOrder = 3;
        g.add(m);
        this.portalViews.push({ m, wall, z });
      }
    }
    this.stormT = 2;
  }

  ensureViews(W) {
    const S = this.scene;
    const V = this.views;
    for (const p of W.paddles) {
      if (!V.paddles.has(p.id)) {
        const pilot = this.sides[p.side];
        const v = new PaddleView(p, this.colors[p.side], this.env, { boss: p.boss || p.look === 'boss' });
        S.add(v.group, v.under);
        V.paddles.set(p.id, v);
      }
    }
    for (const [id, v] of V.paddles) if (!W.paddles.some((p) => p.id === id)) { S.remove(v.group, v.under); V.paddles.delete(id); }
    const ids = new Set();
    for (const b of W.balls) {
      ids.add(b.id);
      if (!V.balls.has(b.id)) V.balls.set(b.id, new BallView(S, this.camera));
    }
    for (const [id, v] of V.balls) if (!ids.has(id)) { v.remove(S); V.balls.delete(id); }
    ids.clear();
    for (const o of W.orbs) { ids.add(o.id); if (!V.orbs.has(o.id)) V.orbs.set(o.id, new OrbView(S, o)); }
    for (const [id, v] of V.orbs) if (!ids.has(id)) { v.remove(); V.orbs.delete(id); }
    ids.clear();
    for (const d of W.drones) { ids.add(d.id); if (!V.drones.has(d.id)) V.drones.set(d.id, new DroneView(S, d, this.colors[d.side], this.env)); }
    for (const [id, v] of V.drones) if (!ids.has(id)) { v.remove(); V.drones.delete(id); }
    ids.clear();
    for (const w of W.wells) { ids.add(w.id); if (!V.wells.has(w.id)) { const h = new HoleView(S, 0.95, 0xff70ff, 0x5030ff); h.w = w; V.wells.set(w.id, h); } }
    for (const [id, v] of V.wells) if (!ids.has(id)) { v.remove(); V.wells.delete(id); }
    while (this.bolts.length < W.bolts.length) this.bolts.push(new BoltView(S, 0xffffff));
  }

  // ------------------------------------------------------------------ per frame
  sync(W, dt, overlay) {
    this.time += dt;
    const time = this.time;
    this.ensureViews(W);
    for (const [, v] of this.views.paddles) v.update(W, dt, time);
    for (const b of W.balls) this.views.balls.get(b.id).update(W, b, dt, time, this.colors);
    for (const [, v] of this.views.orbs) v.update(W, dt, time);
    for (const [, v] of this.views.drones) v.update(W, dt, time);
    for (const [, v] of this.views.wells) {
      const w = v.w;
      const amt = Math.min(1, (W.t - w.born) * 2, w.life * 1.5);
      v.group.position.set(w.x, 0, w.z);
      v.update(time, amt, this.camera);
    }
    W.bolts.forEach((o, i) => this.bolts[i].set(o, this.colors[o.side]));
    for (let i = W.bolts.length; i < this.bolts.length; i++) this.bolts[i].group.visible = false;
    for (const c of this.cellViews) c.update(W, dt, time);
    for (const c of this.coreViews) c.update(W, dt, time);

    // hazards
    if (this.holeView) { this.holeView.group.position.set(W.hole.x, 0, W.hole.z); this.holeView.update(time, 1, this.camera); }
    this.bumperViews.forEach((b, i) => {
      const [x, z] = bumperPos(W, i, W.t);
      b.position.set(x, 0, z);
      b.userData.pop = Math.max(0, b.userData.pop - dt * 5);
      b.scale.setScalar(1 + b.userData.pop * 0.25);
      b.userData.ringMat.color.set(W.arena.grid).multiplyScalar(4 + b.userData.pop * 10);
    });
    this.sliderViews.forEach((m, i) => { const [x, z] = sliderPos(W, i, W.t); m.position.set(x, 0.25, z); });
    for (const p of this.portalViews) { p.m.material.uniforms.uTime.value = time; p.m.material.uniforms.uFlash.value = Math.max(0, p.m.material.uniforms.uFlash.value - dt * 4); }
    if (W.arena.hazards.storm && !W.over) {
      this.stormT -= dt;
      if (this.stormT <= 0) {
        this.stormT = (2.5 + Math.random() * 4) * (CALM.on ? 2.5 : 1);
        const a = new THREE.Vector3((Math.random() - 0.5) * 60, 30, -40 - Math.random() * 40);
        const b = new THREE.Vector3(a.x + (Math.random() - 0.5) * 20, -2, a.z + 10);
        this.lightning.strike(a, b, 0xff9a8a, 0.35, 0.4, 0.25);
        this.addFlashLight(new THREE.Vector3(a.x * 0.2, 12, -14), 0xff8070, 40, 0.3);
      }
    }
    // boss laser
    const L = W.boss && W.boss.laser;
    this.laserTele.visible = !!(L && L.charge > 0);
    this.laserBeam.visible = !!(L && L.charge <= 0);
    if (L) {
      this.laserTele.position.x = L.x;
      this.laserTele.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(time * (CALM.on ? 4 : 14 - L.charge * 6)));
      this.laserBeam.position.x = L.x;
      const j = CALM.on ? 0 : 0.4;
      this.laserBeam.scale.set(1 + Math.random() * j, 1, 1 + Math.random() * j);
    }

    // side-wide effects
    for (const s of [1, -1]) {
      const fx = W.fx[s];
      const b = this.barriers[s];
      b.visible = fx.barrier > 0;
      if (b.visible) {
        b.material.uniforms.uTime.value = time;
        b.material.uniforms.uAmt.value = Math.min(1, fx.barrier) * (fx.barrierHits >= 2 ? 1 : 0.6 + 0.4 * Math.sin(time * 15));
        b.material.uniforms.uHit.value.set(this.barrierHit[s][0], this.barrierHit[s][1] += dt);
      }
      const c = this.curtains[s].material.uniforms;
      c.uTime.value = time;
      // seen from behind (cinematic shots past the goal) the curtain dims so it never fills the frame
      c.uAmt.value = this.camera.position.z * s > F.goalZ ? 0.22 : 1;
      W.cells[s].forEach((cell, i) => { c.uGaps.value[i] = cell.hp <= 0 ? 1 : 0; });
      c.uHit.value.set(this.curtainHit[s][0], this.curtainHit[s][1] += dt);
    }

    // floor uniforms
    const fu = this.floorMat.uniforms;
    fu.uTime.value = time;
    for (let i = 0; i < 6; i++) {
      const b = W.balls[i];
      if (b) { fu.uBalls.value[i].set(b.x, b.z, b.fire ? 1.4 : 1, 0); fu.uBallCol.value[i].copy(this.views.balls.get(b.id).color).multiplyScalar(b.fire ? 1.5 : 1); }
      else fu.uBalls.value[i].set(0, 0, 0, 0);
    }
    let wi = 0;
    if (W.hole) fu.uWells.value[wi++].set(W.hole.x, W.hole.z, W.hole.m / 40, 0);
    for (const w of W.wells) if (wi < 3) fu.uWells.value[wi++].set(w.x, w.z, (w.m / 40) * Math.min(1, w.life), 0);
    for (; wi < 3; wi++) fu.uWells.value[wi].set(0, 0, 0, 0);
    for (let i = 0; i < 10; i++) {
      const r = this.ripples[i];
      if (r) { r.age += dt; fu.uRip.value[i].set(r.x, r.z, r.age, r.age < 1.6 ? r.k : 0); fu.uRipCol.value[i].copy(r.color); }
      else fu.uRip.value[i].set(0, 0, 0, 0);
    }
    this.ripples = this.ripples.filter((r) => r.age < 1.6);
    fu.uDanger1.value = W.cores[1].hp <= 2 && W.cores[1].hp > 0 ? 1 : 0;
    fu.uDanger2.value = W.cores[-1].hp <= 2 && W.cores[-1].hp > 0 ? 1 : 0;
    fu.uChrono1.value = W.fx[1].chrono > 0 ? 1 : 0;
    fu.uChrono2.value = W.fx[-1].chrono > 0 ? 1 : 0;
    fu.uBeat.value = overlay.beat || 0;
    for (const m of this.railMats) {
      m.uniforms.uTime.value = time;
      const s = m === this.railMats[0] ? -1 : 1;
      const hits = this.railHits[s];
      for (let i = 0; i < 4; i++) {
        const h = hits[i];
        if (h) { h.age += dt; m.uniforms.uHits.value[i].set(h.z, h.age, 0, h.age < 1 ? 1 : 0); }
        else m.uniforms.uHits.value[i].set(0, 0, 0, 0);
      }
      this.railHits[s] = hits.filter((h) => h.age < 1);
    }
    this.skyMat.uniforms.uTime.value = time;
    this.deckTop.uniforms.uTime.value = time;
    for (const b of this.boards) b.userData.tex.offset.x = (time * 0.025 * b.userData.dir) % 1;
    this.planetMat.uniforms.uTime.value = time;
    this.planet.rotation.y = time * 0.01;
    this.pylonLights.forEach((g, i) => g.material.color.setScalar(0.45 + 0.08 * Math.sin(time * 2 + i)));

    // tactical overlays: AI intent paths, scope power-up
    this.drawOverlay(W, overlay);

    // effects
    this.sparks.update(dt);
    this.shards.update(dt);
    this.lightning.update(dt, this.camera.position);
    this.rings.update(dt);
    this.stunArcs(W, dt);
    this.updateLights(W, dt);
    for (const pend of this.pending) pend.t -= dt;
    const due = this.pending.filter((p) => p.t <= 0);
    this.pending = this.pending.filter((p) => p.t > 0);
    for (const p of due) p.fn();
  }

  drawOverlay(W, ov) {
    const paths = this.paths;
    for (let i = 0; i < 4; i++) paths[i].mat.uniforms.uTime.value = this.time;
    const show = ov.tactical;
    [1, -1].forEach((s, k) => {
      const ai = ov.ai && ov.ai[s];
      const plan = ai && ai.plan;
      const out = paths[k], inc = paths[k + 2], ret = this.reticles[k];
      if (show && ai && ai.track && ai.track.path) {
        inc.mat.uniforms.uColor.value.copy(this.colors[s]).multiplyScalar(0.9);
        inc.set(ai.track.path);
      } else inc.hide();
      if (show && plan && plan.path && W.t - plan.t0 < plan.eta + 1.2) {
        out.mat.uniforms.uColor.value.copy(this.colors[s]).multiplyScalar(2.4);
        out.set(plan.path);
        ret.visible = plan.x3 !== undefined;
        if (ret.visible) {
          ret.position.set(plan.x3, 0.04, -s * (F.cellZ - 0.9));
          ret.material.color.copy(this.colors[s]).multiplyScalar(2.5 + Math.sin(this.time * 10));
          ret.scale.setScalar(1.2 + 0.2 * Math.sin(this.time * 8));
        }
      } else { out.hide(); ret.visible = false; }
      // the scope power-up shows the human where every incoming ball goes
      if (!show && ov.scope && ov.scope[s]) {
        const sc = ov.scope[s];
        out.mat.uniforms.uColor.value.set(0xaaff4a).multiplyScalar(2);
        out.set(sc);
      }
    });
  }

  stunArcs(W, dt) {
    this.arcT -= dt;
    if (this.arcT > 0) return;
    this.arcT = CALM.on ? 0.3 : 0.07;
    for (const p of W.paddles) {
      if (p.stun <= 0) continue;
      const a = new THREE.Vector3(p.x + (Math.random() - 0.5) * p.hw * 2, 0.35 + Math.random() * 0.4, p.z);
      const b = new THREE.Vector3(p.x + (Math.random() - 0.5) * p.hw * 2.4, 0.1, p.z + (Math.random() - 0.5) * 0.9);
      this.lightning.strike(a, b, 0x9ad8ff, 0.12, 0.05, 0.4);
    }
  }

  addFlashLight(pos, color, k, life) {
    this.flashLights.push({ pos: pos.clone(), color: new THREE.Color(color), k, life, max: life });
  }

  updateLights(W, dt) {
    const req = [];
    for (const b of W.balls) {
      const v = this.views.balls.get(b.id);
      req.push({ pos: v.mesh.position, color: b.fire ? FIRE : v.color, k: b.fire ? 22 : 14, d: 9 });
    }
    const fk = CALM.on ? 0.35 : 1;
    for (const f of this.flashLights) { f.life -= dt; if (f.life > 0) req.push({ pos: f.pos, color: f.color, k: f.k * fk * (f.life / f.max), d: 16 }); }
    this.flashLights = this.flashLights.filter((f) => f.life > 0);
    req.sort((a, b) => b.k - a.k);
    for (let i = 0; i < this.lights.length; i++) {
      const L = this.lights[i], r = req[i];
      if (r) { L.position.copy(r.pos); L.position.y = Math.max(r.pos.y, 0.6); L.color.copy(r.color); L.intensity = r.k; L.distance = r.d; }
      else { L.intensity = 0; }
    }
  }

  // ------------------------------------------------------------------ sim events -> pyrotechnics
  event(e, W) {
    const c = (s) => this.colors[s] || WHITE;
    const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
    switch (e.k) {
      case 'hit': {
        const col = c(e.side);
        const big = e.smash > 0;
        this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: big ? 70 : 26, speed: big ? 13 : 7, color: col, intensity: big ? 5 : 3, dir: [0, 0.3, -e.side], spread: 0.9, life: big ? 0.8 : 0.5, size: 0.2 });
        this.ripple(e.x, e.z, col, big ? 1.4 : 0.7);
        if (big) {
          this.rings.spawn(e.x, e.z, col, 6, 0.6);
          this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: 30, speed: 16, color: 0xffffff, intensity: 6, dir: [0, 0.2, -e.side], spread: 0.4, life: 0.4, size: 0.12, grav: 2 });
          this.shock(e.x, BALL_Y, e.z, 0.6);
          this.kick.chroma = Math.max(this.kick.chroma, 0.01);
          this.addFlashLight(v3(e.x, 1, e.z), col, 40, 0.25);
        }
        break;
      }
      case 'graze': this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: 10, speed: 5, color: c(e.side), intensity: 3 }); break;
      case 'wall': {
        const s = e.x > 0 ? 1 : -1;
        this.railHits[s].push({ z: e.z, age: 0 });
        if (this.railHits[s].length > 4) this.railHits[s].shift();
        this.sparks.burst({ x: e.x - s * 0.1, y: BALL_Y, z: e.z, n: 14, speed: 5, color: 0xffffff, intensity: 2.5, dir: [-s, 0.4, 0], spread: 0.8, life: 0.4 });
        this.ripple(e.x, e.z, new THREE.Color(0.7, 0.8, 1), 0.4);
        break;
      }
      case 'cell': {
        const col = c(e.side);
        this.curtainHit[e.side] = [e.x, 0];
        if (e.hp <= 0) {
          this.shards.burst({ x: e.x, z: e.z, n: 34, color: col, speed: 7, w: 1.8, intensity: 3, vz: -e.side * 2 });
          this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 80, speed: 10, color: col, intensity: 4, life: 0.8 });
          this.rings.spawn(e.x, e.z, col, 7, 0.7);
          this.shock(e.x, 0.4, e.z, 0.8);
          this.addFlashLight(v3(e.x, 1.2, e.z), col, 50, 0.4);
        } else {
          this.shards.burst({ x: e.x, z: e.z, n: 8, color: col, speed: 4, w: 1.4, intensity: 2 });
          this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 30, speed: 6, color: col, intensity: 3 });
          this.addFlashLight(v3(e.x, 1, e.z), col, 20, 0.2);
        }
        this.ripple(e.x, e.z, col, 1);
        break;
      }
      case 'core': {
        const col = c(e.side);
        const z = e.side * 13.7;
        this.shards.burst({ x: 0, y: 1.6, z, n: 60, color: col, speed: 11, w: 1.5, h: 1, up: 8, intensity: 4, scale: 1.4 });
        this.sparks.burst({ x: 0, y: 1.6, z, n: 260, speed: 16, color: col, intensity: 5, life: 1.2, up: 0.3, grav: 4 });
        this.sparks.burst({ x: e.x, y: 0.5, z: e.z, n: 120, speed: 12, color: 0xffffff, intensity: 5, life: 0.6 });
        this.rings.spawn(0, z, col, 22, 1.1);
        this.rings.spawn(e.x, e.z, 0xffffff, 10, 0.6);
        this.ripple(e.x, e.z, col, 2.5);
        this.shock(0, 1.6, z, 1.6);
        this.shock(e.x, 0.5, e.z, 1.0);
        this.addFlashLight(v3(0, 3, z), col, 120, 0.8);
        this.kick.chroma = 0.025;
        this.kick.flash.set(1, 1, 1, 0.35);
        for (let i = 0; i < (CALM.on ? 2 : 5); i++) this.lightning.strike(v3(0, 1.7, z), v3((Math.random() - 0.5) * 10, 0, z - e.side * (1 + Math.random() * 4)), col.getHex(), 0.35, 0.09);
        break;
      }
      case 'ko': {
        const s = e.side, col = c(s), z = s * 13.7;
        for (let i = 0; i < 7; i++) {
          this.later(i * 0.18, () => {
            const x = (Math.random() - 0.5) * 6, y = 1 + Math.random() * 2, zz = z + (Math.random() - 0.5) * 3;
            this.sparks.burst({ x, y, z: zz, n: 160, speed: 18, color: i % 2 ? 0xffffff : col, intensity: 6, life: 1.4, up: 0.4, grav: 5 });
            this.shards.burst({ x, y, z: zz, n: 30, color: col, speed: 14, up: 10, intensity: 4, scale: 1.6 });
            this.shock(x, y, zz, 1.4);
            this.addFlashLight(v3(x, y + 1, zz), i % 2 ? 0xffffff : col, 160, 0.5);
          });
        }
        this.later(1.3, () => {
          this.sparks.burst({ x: 0, y: 2, z, n: 600, speed: 26, color: 0xffffff, intensity: 7, life: 2.2, up: 0.5, grav: 6 });
          this.rings.spawn(0, z, 0xffffff, 40, 1.6);
          this.shock(0, 2, z, 2.5);
          this.kick.flash.set(1, 1, 1, 0.8);
          this.addFlashLight(v3(0, 4, z), 0xffffff, 300, 1.2);
        });
        break;
      }
      case 'bolt': this.sparks.burst({ x: e.x, y: 0.45, z: e.z - e.side * 0.4, n: 8, speed: 5, color: c(e.side), intensity: 4, dir: [0, 0.2, -e.side], spread: 0.5, life: 0.25 }); break;
      case 'stun': {
        this.sparks.burst({ x: e.x, y: 0.5, z: e.z, n: 50, speed: 8, color: 0x9ad8ff, intensity: 5 });
        for (let i = 0; i < (CALM.on ? 1 : 4); i++) this.lightning.strike(v3(e.x, 2.5, e.z), v3(e.x + (Math.random() - 0.5) * 3, 0.2, e.z + (Math.random() - 0.5)), 0x9ad8ff, 0.3, 0.07);
        this.addFlashLight(v3(e.x, 1, e.z), 0x9ad8ff, 40, 0.3);
        break;
      }
      case 'deflect': this.sparks.burst({ x: e.x, y: 0.5, z: e.z, n: 30, speed: 7, color: 0xffd23f, intensity: 4 }); break;
      case 'boltball': this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: 30, speed: 8, color: c(e.side), intensity: 4 }); this.ripple(e.x, e.z, c(e.side), 0.8); break;
      case 'boltcell': this.sparks.burst({ x: e.x, y: 0.45, z: e.z, n: 18, speed: 6, color: c(e.side), intensity: 3 }); this.curtainHit[e.side] = [e.x, 0]; break;
      case 'boltbolt': this.sparks.burst({ x: e.x, y: 0.45, z: e.z, n: 40, speed: 9, color: 0xffffff, intensity: 4 }); this.rings.spawn(e.x, e.z, 0xffffff, 3, 0.4); break;
      case 'fizzle': this.sparks.burst({ x: e.x, y: 0.45, z: e.z, n: 12, speed: 4, color: c(-e.side), intensity: 2 }); break;
      case 'orb': this.sparks.burst({ x: e.x, y: 1, z: e.z, n: 40, speed: 5, color: POWERUPS[e.kind].color, intensity: 3, up: 0.9, grav: -2 }); this.rings.spawn(e.x, e.z, POWERUPS[e.kind].color, 4, 0.8); break;
      case 'orbgone': this.sparks.burst({ x: e.x, y: 1, z: e.z, n: 25, speed: 4, color: 0xffffff, intensity: 2 }); break;
      case 'pu': {
        const pc = POWERUPS[e.kind].color;
        this.sparks.burst({ x: e.x, y: 1, z: e.z, n: 90, speed: 10, color: pc, intensity: 5, life: 0.9 });
        this.rings.spawn(e.x, e.z, pc, 8, 0.8);
        this.ripple(e.x, e.z, new THREE.Color(pc), 1.5);
        this.addFlashLight(v3(e.x, 1.5, e.z), pc, 50, 0.4);
        // a streak to the claimer's paddle
        const p = W.paddles.find((q) => q.side === e.side);
        if (p) this.lightning.strike(v3(e.x, 1, e.z), v3(p.x, 0.5, p.z), pc, 0.35, 0.06, 0.15);
        if (e.kind === 'repair') for (const cv of this.cellViews) if (cv.c.side === e.side) this.sparks.burst({ x: cv.c.x, y: 0.4, z: e.side * F.cellZ, n: 12, speed: 3, color: 0x7dffb0, intensity: 3, up: 1, grav: -3 });
        break;
      }
      case 'multi': this.rings.spawn(e.x, e.z, 0x6af7ff, 5, 0.5); this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: 50, speed: 9, color: 0x6af7ff, intensity: 4 }); break;
      case 'serve': this.sparks.burst({ x: 0, y: BALL_Y, z: 0, n: 50, speed: 6, color: 0xffffff, intensity: 3, up: 0.8 }); this.rings.spawn(0, 0, 0xffffff, 5, 0.7); this.ripple(0, 0, new THREE.Color(1, 1, 1), 1); break;
      case 'bump': {
        const bv = this.bumperViews[e.i];
        if (bv) bv.userData.pop = 1;
        this.sparks.burst({ x: e.x, y: 0.6, z: e.z, n: 30, speed: 8, color: W.arena.accent, intensity: 4 });
        this.ripple(e.x, e.z, new THREE.Color(W.arena.grid), 1);
        break;
      }
      case 'portal': {
        this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: 30, speed: 6, color: 0xffb040, intensity: 4 });
        this.sparks.burst({ x: e.x2, y: BALL_Y, z: e.z2, n: 30, speed: 6, color: 0x40c0ff, intensity: 4 });
        for (const p of this.portalViews) if (Math.abs(p.z - e.z) < 2 || Math.abs(p.z - e.z2) < 2) p.m.material.uniforms.uFlash.value = 1;
        break;
      }
      case 'slider': this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 14, speed: 5, color: W.arena.grid, intensity: 3 }); break;
      case 'barrier': this.barrierHit[e.side] = [e.x, 0]; this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 30, speed: 6, color: 0x2ff5d2, intensity: 4 }); break;
      case 'lightning': {
        this.later(e.delay || 0, () => {
          this.lightning.strike(v3(e.x + (Math.random() - 0.5) * 4, 16, e.z - e.side * 4), v3(e.x, 0.4, e.z), 0xfff27a, 0.45, 0.14, 0.28);
          this.sparks.burst({ x: e.x, y: 0.4, z: e.z, n: 70, speed: 10, color: 0xfff27a, intensity: 5 });
          if (e.hp <= 0) this.shards.burst({ x: e.x, z: e.z, n: 30, color: this.colors[e.side], speed: 8, w: 1.8, intensity: 3 });
          this.addFlashLight(v3(e.x, 3, e.z), 0xfff27a, 80, 0.3);
          this.kick.flash.set(1, 1, 0.85, 0.12);
        });
        break;
      }
      case 'od': {
        const p = W.paddles.find((q) => q.side === e.side);
        if (p) {
          this.rings.spawn(p.x, p.z, 0xffc23a, 9, 0.8);
          this.sparks.burst({ x: p.x, y: 0.5, z: p.z, n: 120, speed: 12, color: 0xffc23a, intensity: 5, up: 0.7 });
          for (let i = 0; i < (CALM.on ? 2 : 6); i++) this.lightning.strike(v3(p.x, 4, p.z), v3(p.x + (Math.random() - 0.5) * 4, 0.3, p.z), 0xffd23f, 0.4, 0.08);
          this.shock(p.x, 0.5, p.z, 1);
        }
        this.kick.flash.set(1, 0.85, 0.4, 0.2);
        break;
      }
      case 'catch': case 'release': this.rings.spawn(e.x, e.z, 0x3a9cff, 3, 0.45); this.sparks.burst({ x: e.x, y: BALL_Y, z: e.z, n: 20, speed: 4, color: 0x3a9cff, intensity: 3 }); break;
      case 'dronekill': case 'droneend': this.sparks.burst({ x: e.x, y: 1.1, z: e.z, n: 60, speed: 8, color: c(e.side), intensity: 4 }); this.shards.burst({ x: e.x, y: 1.1, z: e.z, n: 12, color: c(e.side), speed: 5 }); break;
      case 'lasercharge': break;
      case 'laser': {
        this.sparks.burst({ x: e.x, y: 0.5, z: e.z, n: 90, speed: 12, color: 0xff4030, intensity: 6 });
        this.shock(e.x, 0.5, e.z, 1.1);
        this.addFlashLight(v3(e.x, 1, e.z), 0xff3020, 80, 0.4);
        this.kick.chroma = 0.02;
        if (e.hit === 'cell' && e.hp <= 0) this.shards.burst({ x: e.x, z: e.z, n: 30, color: this.colors[e.side], speed: 8, w: 1.8, intensity: 3 });
        break;
      }
      case 'phase2': {
        this.sparks.burst({ x: 0, y: 1, z: -9, n: 300, speed: 18, color: 0xff2a3a, intensity: 6, life: 1.2 });
        this.shock(0, 1, -9, 2);
        this.kick.flash.set(1, 0.2, 0.15, 0.4);
        break;
      }
    }
  }

  later(t, fn) { this.pending.push({ t, fn }); }
  ripple(x, z, color, k) {
    this.ripples.push({ x, z, color: color instanceof THREE.Color ? color.clone() : new THREE.Color(color), k, age: 0 });
    if (this.ripples.length > 10) this.ripples.shift();
  }
  shock(x, y, z, k) {
    this.shocks.push({ p: new THREE.Vector3(x, y, z), age: 0, k });
    if (this.shocks.length > 6) this.shocks.shift();
  }

  project(x, y, z) {
    _p.set(x, y, z).project(this.camera);
    return { x: (_p.x * 0.5 + 0.5) * this.cssW, y: (-_p.y * 0.5 + 0.5) * this.cssH, behind: _p.z > 1 };
  }

  resize() {
    const w = innerWidth, h = innerHeight;
    this.cssW = w; this.cssH = h;
    const pr = Math.min(devicePixelRatio || 1, this.q.pr) * this.scale;
    this.pr = pr;
    this.r.setPixelRatio(1);
    this.r.setSize(Math.round(w * pr), Math.round(h * pr), false);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.post.setSize(Math.round(w * pr), Math.round(h * pr));
    const rs = this.q.refl;
    if (rs > 0) { this.reflRT.setSize(Math.max(2, Math.round(w * pr * rs)), Math.max(2, Math.round(h * pr * rs))); this.floorMat.uniforms.uReflTexel.value.set(1 / (w * pr * rs), 1 / (h * pr * rs)); }
    this.floorMat.uniforms.uReflK.value = rs > 0 ? 0.55 : 0;
  }

  renderReflection() {
    if (this.q.refl <= 0) return;
    const cam = this.camera, rc = this.reflCam;
    rc.copy(cam);
    rc.position.set(cam.position.x, -cam.position.y, cam.position.z);
    _d.set(0, 0, -1).applyQuaternion(cam.quaternion);
    _t.copy(cam.position).add(_d);
    _t.y = -_t.y;
    _u.set(0, 1, 0).applyQuaternion(cam.quaternion);
    _u.y = -_u.y;
    rc.up.copy(_u);
    rc.lookAt(_t);
    rc.updateMatrixWorld();
    rc.projectionMatrix.copy(cam.projectionMatrix);
    this.reflMat.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.reflMat.multiply(rc.projectionMatrix).multiply(rc.matrixWorldInverse);
    this.floor.visible = false;
    this.deck.visible = false;
    for (const p of this.paths) p.mesh.visible = false;
    this.r.setRenderTarget(this.reflRT);
    this.r.clear();
    this.r.render(this.scene, rc);
    this.floor.visible = true;
    this.deck.visible = true;
    for (const p of this.paths) p.mesh.visible = true;
  }

  render(dt, look) {
    this.renderReflection();
    // screen-space shocks + lensing
    const shocks = [];
    for (const s of this.shocks) {
      s.age += dt;
      const pp = this.project(s.p.x, s.p.y, s.p.z);
      if (pp.behind) continue;
      shocks.push(new THREE.Vector4(pp.x / this.cssW, 1 - pp.y / this.cssH, s.age * 0.9 * s.k, Math.max(0, 1 - s.age * 1.4) * s.k * (CALM.on ? 0.3 : 1)));
    }
    this.shocks = this.shocks.filter((s) => s.age < 0.8);
    const lens = [];
    const addLens = (x, z, k) => {
      const c = this.project(x, 0.5, z);
      if (c.behind) return;
      const e = this.project(x + 1.2, 0.5, z);
      const r = Math.hypot(e.x - c.x, e.y - c.y) / this.cssH;
      lens.push(new THREE.Vector4(c.x / this.cssW, 1 - c.y / this.cssH, r, k));
    };
    if (this.W && this.W.hole) addLens(this.W.hole.x, this.W.hole.z, 0.5);
    if (this.W) for (const w of this.W.wells) if (lens.length < 3) addLens(w.x, w.z, 0.4 * Math.min(1, w.life, (this.W.t - w.born) * 2));
    const k = this.kick;
    k.chroma = Math.max(0, k.chroma - dt * 0.05);
    k.flash.w = Math.max(0, k.flash.w - dt * 1.6);
    const calm = CALM.on;
    if (calm) this.calmFlash.copy(k.flash).setW(Math.min(0.05, k.flash.w * 0.15));
    this.post.render(this.scene, this.camera, {
      bloom: (look.bloom ?? 0.9) * (calm ? 0.8 : 1), threshold: 1.0, exposure: look.exposure ?? 1.0, chroma: calm ? 0.0012 : 0.0022 + k.chroma + (look.chroma || 0),
      vignette: 0.5, time: this.time, desat: look.desat || 0, fade: look.fade || 0, flash: calm ? this.calmFlash : k.flash,
      tint: look.tint || ONE3, shocks, lens,
    });
  }
}
const _p = new THREE.Vector3(), _d = new THREE.Vector3(), _t = new THREE.Vector3(), _u = new THREE.Vector3();
const WHITE = new THREE.Color(1, 1, 1);
const FIRE = new THREE.Color(1, 0.45, 0.08);
const ONE3 = new THREE.Vector3(1, 1, 1);
