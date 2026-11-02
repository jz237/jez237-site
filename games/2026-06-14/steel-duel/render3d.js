/* Steel Duel — three.js 3D renderer. Draws the deterministic sim's state (read through the api handed to
   init) as a lit, shadowed 3D arena and turns sim events into 3D effects. ES module; sets window.SD3D. */
import * as THREE from 'three';
import { EffectComposer } from './vendor/addons/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from './vendor/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from './vendor/addons/utils/BufferGeometryUtils.js';

let api = null, C = null, ready = false;
let R, scene, camera, composer, bloomPass, sun, hemi;
let viewW = 1, viewH = 1, dpr = 1, quality = 'auto', tier = 'high', postOn = true;
let now = 0;                                     // renderer clock (s), advances with advance(dt)
const v3 = new THREE.Vector3(), v3b = new THREE.Vector3(), m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e3 = new THREE.Euler();
const ONE = new THREE.Vector3(1, 1, 1), ZERO_S = new THREE.Vector3(0, 0, 0);

const WALL_H = 26, BORDER_H = 36, TURRET_Y = 13;
const wx = x => x - C.FW / 2, wz = y => y - C.HUD_H - C.FH / 2;
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ===================== procedural textures ===================== */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function tex(c, srgb, repeat) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.anisotropy = 8;
  return t;
}
function speckle(g, w, h, n, a0, a1, light) {
  for (let i = 0; i < n; i++) {
    const v = light ? 255 : 0, a = rnd(a0, a1);
    g.fillStyle = `rgba(${v},${v},${v},${a})`;
    const s = Math.random() < 0.9 ? 1 : 2; g.fillRect(Math.random() * w, Math.random() * h, s, s);
  }
}
function blotches(g, w, h, n, color, r0, r1) {
  for (let i = 0; i < n; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = rnd(r0, r1);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
}
function makeConcrete() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#c9c8c3'; g.fillRect(0, 0, 256, 256);
  blotches(g, 256, 256, 26, 'rgba(70,72,76,0.14)', 12, 50);
  blotches(g, 256, 256, 14, 'rgba(255,255,255,0.14)', 10, 40);
  speckle(g, 256, 256, 2600, 0.05, 0.22, false); speckle(g, 256, 256, 1200, 0.05, 0.2, true);
  g.strokeStyle = 'rgba(40,36,30,0.35)'; g.lineWidth = 1;                  // form-work seams
  g.beginPath(); g.moveTo(0, 86); g.lineTo(256, 86); g.moveTo(0, 172); g.lineTo(256, 172); g.stroke();
  const grime = g.createLinearGradient(0, 0, 0, 256); grime.addColorStop(0, 'rgba(0,0,0,0)'); grime.addColorStop(1, 'rgba(55,50,44,0.3)');
  g.fillStyle = grime; g.fillRect(0, 0, 256, 256);
  return tex(c, true);
}
function makeCracks() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = '#2a2622'; g.lineCap = 'round';
  for (let k = 0; k < 9; k++) {
    let x = rnd(30, 226), y = rnd(30, 226), a = rnd(0, 7);
    g.lineWidth = rnd(1.2, 3.2); g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < 14; s++) { a += rnd(-0.7, 0.7); x += Math.cos(a) * rnd(6, 14); y += Math.sin(a) * rnd(6, 14); g.lineTo(x, y); }
    g.stroke();
  }
  blotches(g, 256, 256, 6, 'rgba(30,24,18,0.5)', 10, 26);
  const t = tex(c, false, true); return t;
}
function makeDirt() {
  const [c, g] = canvas(512, 512);
  g.fillStyle = '#5b4a38'; g.fillRect(0, 0, 512, 512);
  blotches(g, 512, 512, 60, 'rgba(120,98,70,0.25)', 20, 80);
  blotches(g, 512, 512, 40, 'rgba(30,24,18,0.25)', 15, 60);
  speckle(g, 512, 512, 9000, 0.05, 0.3, false); speckle(g, 512, 512, 5000, 0.04, 0.2, true);
  return tex(c, true, true);
}
function makeTread() {
  const [c, g] = canvas(64, 32);
  g.fillStyle = '#1b1b1d'; g.fillRect(0, 0, 64, 32);
  for (let i = 0; i < 8; i++) { g.fillStyle = '#4a4a4f'; g.fillRect(i * 8 + 1, 2, 4, 28); g.fillStyle = '#2a2a2e'; g.fillRect(i * 8 + 5, 2, 1, 28); }
  g.fillStyle = 'rgba(120,100,70,0.25)'; g.fillRect(0, 0, 64, 32);
  return tex(c, true, true);
}
function makeGrime() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#e8e8e8'; g.fillRect(0, 0, 256, 256);
  blotches(g, 256, 256, 30, 'rgba(70,60,45,0.22)', 8, 40);
  speckle(g, 256, 256, 3000, 0.04, 0.18, false);
  g.strokeStyle = 'rgba(30,30,30,0.25)'; g.lineWidth = 1;                  // panel lines
  for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.stroke(); }
  return tex(c, true, true);
}
function makeHazard() {
  const [c, g] = canvas(256, 64);
  const steel = g.createLinearGradient(0, 0, 0, 64); steel.addColorStop(0, '#5d636c'); steel.addColorStop(1, '#2c3036');
  g.fillStyle = steel; g.fillRect(0, 0, 256, 64);
  g.save(); g.beginPath(); g.rect(0, 22, 256, 18); g.clip();
  g.fillStyle = '#e8b420'; g.fillRect(0, 22, 256, 18);
  g.fillStyle = '#16161a'; for (let x = -40; x < 300; x += 32) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x + 16, 40); g.lineTo(x + 34, 22); g.lineTo(x + 18, 22); g.fill(); }
  g.restore();
  speckle(g, 256, 64, 900, 0.05, 0.25, false);
  g.fillStyle = 'rgba(0,0,0,0.35)'; for (let x = 8; x < 256; x += 32) { g.beginPath(); g.arc(x, 10, 2, 0, 7); g.fill(); g.beginPath(); g.arc(x, 54, 2, 0, 7); g.fill(); }
  return tex(c, true, true);
}
function makeRadial(stops, size) {
  const [c, g] = canvas(size || 128, size || 128); const s = (size || 128) / 2;
  const gr = g.createRadialGradient(s, s, 0, s, s, s);
  for (const [o, col] of stops) gr.addColorStop(o, col);
  g.fillStyle = gr; g.fillRect(0, 0, s * 2, s * 2);
  return tex(c, false);
}
function makeAO() {                               // blurred square: contact shadow under a block
  const [c, g] = canvas(64, 64);
  g.filter = 'blur(7px)'; g.fillStyle = '#fff'; g.fillRect(14, 14, 36, 36);
  return tex(c, false);
}
function makeSmoke() {
  const [c, g] = canvas(128, 128);
  for (let i = 0; i < 22; i++) {
    const x = 64 + rnd(-22, 22), y = 64 + rnd(-22, 22), r = rnd(16, 36);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,0.32)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  const fade = g.createRadialGradient(64, 64, 30, 64, 64, 64); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = fade; g.fillRect(0, 0, 128, 128);
  return tex(c, false);
}
function makeScorch() {
  const [c, g] = canvas(128, 128);
  for (let i = 0; i < 18; i++) {
    const a = rnd(0, 7), d = rnd(0, 26), x = 64 + Math.cos(a) * d, y = 64 + Math.sin(a) * d, r = rnd(14, 34);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  for (let i = 0; i < 26; i++) {                                             // spatter rays
    const a = rnd(0, 7); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = rnd(1, 3);
    g.beginPath(); g.moveTo(64 + Math.cos(a) * 20, 64 + Math.sin(a) * 20); g.lineTo(64 + Math.cos(a) * rnd(38, 60), 64 + Math.sin(a) * rnd(38, 60)); g.stroke();
  }
  return tex(c, false);
}
function makeTrackMark() {
  const [c, g] = canvas(32, 32);
  g.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 4; i++) g.fillRect(i * 8 + 1, 4, 5, 24);
  return tex(c, false);
}
function makeGradientLine() {
  const [c, g] = canvas(128, 16);
  const gr = g.createLinearGradient(0, 0, 128, 0);
  gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.75, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,1)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 16);
  const v = g.createLinearGradient(0, 0, 0, 16); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = v; g.fillRect(0, 0, 128, 16);
  return tex(c, false);
}
function makeBeam() {
  const [c, g] = canvas(16, 128);
  const gr = g.createLinearGradient(0, 128, 0, 0);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 16, 128);
  return tex(c, false);
}

let T = {};                                       // texture bank
function makeTextures() {
  T.concrete = makeConcrete(); T.cracks = makeCracks(); T.dirt = makeDirt(); T.tread = makeTread(); T.grime = makeGrime(); T.hazard = makeHazard();
  T.glow = makeRadial([[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']]);
  T.spark = makeRadial([[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']], 64);
  T.ring = makeRadial([[0, 'rgba(255,255,255,0)'], [0.62, 'rgba(255,255,255,0)'], [0.8, 'rgba(255,255,255,0.9)'], [0.9, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']]);
  T.disc = makeRadial([[0, 'rgba(255,255,255,0.8)'], [0.7, 'rgba(255,255,255,0.25)'], [1, 'rgba(255,255,255,0)']]);
  T.ao = makeAO(); T.smoke = makeSmoke(); T.scorch = makeScorch(); T.track = makeTrackMark(); T.line = makeGradientLine(); T.beam = makeBeam();
  T.dirt.repeat.set(26, 26); T.hazard.repeat.set(1, 1);
}

/* ===================== GPU particle-ish systems ===================== */
const COMMON_FRAG_TAIL = '\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n';   // includes must start a line
class Billboards {                                // camera-facing instanced quads, CPU-simulated
  constructor(max, map, additive, order) {
    this.max = max; this.list = [];
    const quad = new THREE.PlaneGeometry(1, 1), geo = new THREE.InstancedBufferGeometry();
    geo.index = quad.index; geo.setAttribute('position', quad.attributes.position); geo.setAttribute('uv', quad.attributes.uv);
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.aCol = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.aSR = new THREE.InstancedBufferAttribute(new Float32Array(max * 2), 2).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('iPos', this.aPos); geo.setAttribute('iCol', this.aCol); geo.setAttribute('iSR', this.aSR);
    geo.instanceCount = 0;
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: map } }, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `attribute vec3 iPos; attribute vec4 iCol; attribute vec2 iSR; varying vec2 vUv; varying vec4 vCol;
        void main(){ vUv = uv; vCol = iCol; vec4 mv = modelViewMatrix * vec4(iPos, 1.0);
          float s = sin(iSR.y), c = cos(iSR.y); vec2 p = position.xy * iSR.x;
          mv.xy += vec2(p.x * c - p.y * s, p.x * s + p.y * c); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying vec4 vCol;
        void main(){ vec4 t = texture2D(map, vUv); gl_FragColor = vec4(vCol.rgb * t.rgb, vCol.a * t.a); ${COMMON_FRAG_TAIL} }`,
    });
    this.mesh = new THREE.Mesh(geo, mat); this.mesh.frustumCulled = false; this.mesh.renderOrder = order || 0;
    this.geo = geo;
  }
  add(p) {
    if (this.list.length >= this.max) this.list.shift();
    p.age = 0; p.rot = p.rot == null ? Math.random() * 6.28 : p.rot; p.vr = p.vr || 0;
    this.list.push(p); return p;
  }
  clear() { this.list.length = 0; this.geo.instanceCount = 0; }
  update(dt) {
    const L = this.list; let w = 0;
    for (let i = 0; i < L.length; i++) {
      const p = L[i]; p.age += dt; if (p.age >= p.life) continue;
      const k = p.age / p.life, dr = Math.exp(-(p.drag || 0) * dt);
      p.vx *= dr; p.vy *= dr; p.vz *= dr; p.vy -= (p.grav || 0) * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.rot += p.vr * dt;
      if (p.y < 0.6) { p.y = 0.6; p.vy = Math.abs(p.vy) * 0.25; }
      L[w++] = p;
    }
    L.length = w;
    const P = this.aPos.array, Cc = this.aCol.array, S = this.aSR.array;
    for (let i = 0; i < w; i++) {
      const p = L[i], k = p.age / p.life;
      const fin = p.fadeIn ? Math.min(1, k / p.fadeIn) : 1, a = p.a * fin * Math.pow(1 - k, p.fp || 1);
      const c0 = p.c, c1 = p.c2 || p.c, ck = p.c2 ? Math.min(1, k * (p.ck || 1)) : 0;
      P[i * 3] = p.x; P[i * 3 + 1] = p.y; P[i * 3 + 2] = p.z;
      Cc[i * 4] = c0[0] + (c1[0] - c0[0]) * ck; Cc[i * 4 + 1] = c0[1] + (c1[1] - c0[1]) * ck; Cc[i * 4 + 2] = c0[2] + (c1[2] - c0[2]) * ck; Cc[i * 4 + 3] = a;
      S[i * 2] = p.s0 + (p.s1 - p.s0) * (1 - Math.pow(1 - k, 2)); S[i * 2 + 1] = p.rot;
    }
    this.geo.instanceCount = w;
    this.aPos.needsUpdate = this.aCol.needsUpdate = this.aSR.needsUpdate = true;
  }
}

class Decals {                                    // flat instanced quads on the floor; fade by age in the shader
  constructor(max, map, color, life, y, additive) {
    this.max = max; this.n = 0; this.head = 0;
    const quad = new THREE.PlaneGeometry(1, 1), geo = new THREE.InstancedBufferGeometry();
    geo.index = quad.index; geo.setAttribute('position', quad.attributes.position); geo.setAttribute('uv', quad.attributes.uv);
    this.aD = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4); this.aS = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    geo.setAttribute('iD', this.aD); geo.setAttribute('iS', this.aS); geo.instanceCount = 0;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: map }, uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uLife: { value: life }, uY: { value: y } },
      transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `attribute vec4 iD; attribute vec3 iS; uniform float uTime, uLife, uY; varying vec2 vUv; varying float vA;
        void main(){ vUv = uv; float age = uTime - iD.w;
          vA = iS.z * (uLife > 0.0 ? clamp(1.0 - age / uLife, 0.0, 1.0) : 1.0) * clamp(age * 12.0, 0.0, 1.0);
          vec2 p = position.xy * iS.xy; float s = sin(iD.z), c = cos(iD.z);
          vec3 w = vec3(iD.x + p.x * c - p.y * s, uY, iD.y + p.x * s + p.y * c);
          gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0); }`,
      fragmentShader: `uniform sampler2D map; uniform vec3 uColor; varying vec2 vUv; varying float vA;
        void main(){ vec4 t = texture2D(map, vUv); gl_FragColor = vec4(uColor * t.rgb, t.a * vA); ${COMMON_FRAG_TAIL} }`,
    });
    this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.frustumCulled = false; this.geo = geo;
  }
  add(x, z, rot, sx, sz, alpha) {
    const i = this.head; this.head = (this.head + 1) % this.max; this.n = Math.min(this.max, this.n + 1);
    this.aD.array.set([x, z, rot, now], i * 4); this.aS.array.set([sx, sz, alpha], i * 3);
    this.aD.needsUpdate = this.aS.needsUpdate = true; this.geo.instanceCount = this.n;
  }
  clear() { this.n = 0; this.head = 0; this.geo.instanceCount = 0; }
  tick() { this.mat.uniforms.uTime.value = now; }
}

class Chunks {                                    // physical debris: tumbling instanced rocks/metal
  constructor(max, rest) {
    this.max = max; this.list = []; this.rest = !!rest;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0.15 });
    this.mesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), mat, max);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.mesh.count = 0;
    this.mesh.castShadow = true; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false;
    this.mesh.setColorAt(0, new THREE.Color(1, 1, 1));
    this.col = new THREE.Color();
  }
  add(p) { if (this.list.length >= this.max) this.list.shift(); p.age = 0; p.rx = rnd(0, 6); p.ry = rnd(0, 6); p.rz = rnd(0, 6); this.list.push(p); this.dirty = true; }
  clear() { this.list.length = 0; this.mesh.count = 0; this.dirty = false; }
  update(dt) {
    if (this.rest && !this.dirty) return;            // settled rubble only re-uploads when a pile is added
    this.dirty = false;
    const L = this.list; let w = 0;
    for (const p of L) {
      p.age += dt; if (p.life && p.age >= p.life) continue;
      if (!p.still) {
        p.vy -= 320 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        p.rx += p.ax * dt; p.ry += p.ay * dt; p.rz += p.az * dt;
        if (p.y < p.s * 0.6) {
          p.y = p.s * 0.6; p.vy = -p.vy * 0.32; p.vx *= 0.55; p.vz *= 0.55; p.ax *= 0.5; p.ay *= 0.5; p.az *= 0.5;
          if (Math.abs(p.vy) < 12 && Math.hypot(p.vx, p.vz) < 6) p.still = true;
        }
      }
      L[w++] = p;
    }
    L.length = w;
    if (!w && !this.mesh.count) return;
    for (let i = 0; i < w; i++) {
      const p = L[i], fade = p.life ? clamp((p.life - p.age) / 0.6, 0, 1) : 1, s = p.s * fade;
      e3.set(p.rx, p.ry, p.rz); q4.setFromEuler(e3); v3.set(p.x, p.y, p.z); v3b.set(s * (p.sx || 1), s * (p.sy || 1), s * (p.sz || 1));
      m4.compose(v3, q4, v3b); this.mesh.setMatrixAt(i, m4);
      this.col.setRGB(p.c[0], p.c[1], p.c[2]); this.mesh.setColorAt(i, this.col);
    }
    this.mesh.count = w; this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}

/* ===================== scene state ===================== */
let ADD, SMOKE, SPARKS, DEBRIS, RUBBLE, SCORCH, TRACKS, GLOWDEC;
let wallMesh, wallDmg, aoMesh, wallCache = [], borderGroup, floorMesh, floorKey = '';
let lightPool = [], ringPool = [], beamPool = [];
const tankViews = new Map(), mineViews = new Map(), pickViews = new Map(), shellViews = new Map(), wrecks = [];
let reticle, aimLine, shake = 0, flashT = 0;
const shared = {};                                // shared materials/geometries

/* ===================== environment ===================== */
function buildEnvironment() {
  scene.background = new THREE.Color(0x1c2230);
  scene.fog = new THREE.Fog(0x3a3442, 1700, 4200);
  // sky dome only feeds PMREM reflections (the play camera looks down at the arena)
  const skyScene = new THREE.Scene();
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec3 vP; void main(){ float h = vP.y;
      vec3 top = vec3(0.10, 0.16, 0.32), hor = vec3(1.05, 0.62, 0.36), gnd = vec3(0.16, 0.13, 0.11);
      vec3 c = h > 0.0 ? mix(hor, top, pow(h, 0.55)) : mix(hor * 0.6, gnd, clamp(-h * 3.0, 0.0, 1.0));
      float sunD = max(dot(vP, normalize(vec3(-0.6, 0.35, 0.72))), 0.0); c += vec3(2.4, 1.5, 0.8) * pow(sunD, 60.0);
      gl_FragColor = vec4(c, 1.0); }`,
  });
  skyScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), skyMat));
  const pmrem = new THREE.PMREMGenerator(R);
  scene.environment = pmrem.fromScene(skyScene, 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  hemi = new THREE.HemisphereLight(0x9fb4d8, 0x4a3a2a, 0.7); scene.add(hemi);
  sun = new THREE.DirectionalLight(0xffd2a0, 3.0);
  sun.position.set(-330, 560, -400); sun.target.position.set(0, 0, 0);   // low from behind-left: shadows fall toward the camera
  sun.castShadow = true;
  const sc = sun.shadow.camera; sc.left = -620; sc.right = 620; sc.top = 480; sc.bottom = -480; sc.near = 50; sc.far = 1600;
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.8; sun.shadow.radius = 2.5;
  scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight(0x6f8fd0, 0.45); fill.position.set(420, 300, -380); scene.add(fill);

  // outer ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ map: T.dirt, roughness: 0.95, metalness: 0, color: 0x9a8a78 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.6; ground.receiveShadow = true; scene.add(ground);

  // arena floor (texture regenerated per layout)
  floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(C.FW, C.FH), new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.05 }));
  floorMesh.rotation.x = -Math.PI / 2; floorMesh.receiveShadow = true; scene.add(floorMesh);

  buildBorder();
  buildProps();
}

function buildBorder() {
  borderGroup = new THREE.Group(); scene.add(borderGroup);
  const steelTop = new THREE.MeshStandardMaterial({ color: 0x5a616b, roughness: 0.45, metalness: 0.7, map: T.grime });
  const mk = (len, depth, x, z, alongX) => {
    const g = new THREE.BoxGeometry(alongX ? len : depth, BORDER_H, alongX ? depth : len);
    const uv = g.attributes.uv;                                             // stretch stripe UVs along the long faces
    for (let f = 0; f < 6; f++) {
      const along = (alongX && (f === 4 || f === 5)) || (!alongX && (f === 0 || f === 1));
      const across = (alongX && (f === 0 || f === 1)) || (!alongX && (f === 4 || f === 5));
      const rep = along ? len / 96 : across ? depth / 96 : 1;
      for (let k = 0; k < 4; k++) uv.setX(f * 4 + k, uv.getX(f * 4 + k) * rep);
    }
    const side = new THREE.MeshStandardMaterial({ map: T.hazard, roughness: 0.5, metalness: 0.55 });
    const m = new THREE.Mesh(g, [side, side, steelTop, steelTop, side, side]);
    m.position.set(x, BORDER_H / 2, z); m.castShadow = true; m.receiveShadow = true; borderGroup.add(m);
  };
  const t = C.TILE, hw = C.FW / 2, hh = C.FH / 2;
  mk(C.FW, t, 0, -hh + t / 2, true); mk(C.FW, t, 0, hh - t / 2, true);
  mk(C.FH - 2 * t, t, -hw + t / 2, 0, false); mk(C.FH - 2 * t, t, hw - t / 2, 0, false);
  // corner bollards with warning lamps
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x220800, emissive: 0xff5a1a, emissiveIntensity: 3 });
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 5, 12), lampMat);
    lamp.position.set(sx * (hw - t / 2), BORDER_H + 2.5, sz * (hh - t / 2)); borderGroup.add(lamp);
  }
  shared.cornerLamp = lampMat;
}

function buildProps() {
  const hw = C.FW / 2, hh = C.FH / 2;
  // floodlight towers at the four corners
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x3b4048, roughness: 0.5, metalness: 0.7 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0x222, emissive: 0xfff1d0, emissiveIntensity: 5 });
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(3, 4.5, 170, 8), poleMat); pole.position.y = 85; pole.castShadow = true; g.add(pole);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 6), poleMat); bar.position.y = 168; g.add(bar);
    for (const o of [-13, 0, 13]) { const h = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 6), headMat); h.position.set(o, 176, 0); g.add(h); }
    g.position.set(sx * (hw + 70), 0, sz * (hh + 60)); g.rotation.y = Math.atan2(sx, sz); scene.add(g);
  }
  // sandbag berms, drums and crates around the outside
  const bagGeo = new THREE.SphereGeometry(1, 10, 6); bagGeo.scale(7, 3.2, 4);
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x9c8a62, roughness: 1 });
  const drumGeo = new THREE.CylinderGeometry(5, 5, 13, 14);
  const drumMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.5, map: T.grime });
  const crateGeo = new RoundedBoxGeometry(16, 13, 16, 1, 1.2);
  const crateMat = new THREE.MeshStandardMaterial({ color: 0x8a6a3f, roughness: 0.85, map: T.grime });
  const bags = [], drums = [], crates = [];
  let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ring = (cx, cz, rad, a0, a1) => { for (let row = 0; row < 2; row++) for (let a = a0; a < a1; a += 0.36) bags.push([cx + Math.cos(a) * rad, row * 5.5 + 3, cz + Math.sin(a) * rad, -a + (row ? 0.18 : 0)]); };
  ring(-hw - 46, -60, 26, -1.2, 1.2); ring(hw + 46, 80, 26, Math.PI - 1.2, Math.PI + 1.2); ring(-hw - 40, hh + 34, 22, -2.2, 0.4); ring(hw + 40, -hh - 30, 22, 1, 3.6);
  for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1; drums.push([side * (hw + 20 + r() * 70), 6.5, (r() - 0.5) * C.FH * 1.2, r()]); }
  for (let i = 0; i < 18; i++) { const side = i % 2 ? 1 : -1; crates.push([side * (hw + 30 + r() * 90), 6.5, (r() - 0.5) * C.FH * 1.3, r() * 3]); }
  for (let i = 0; i < 10; i++) crates.push([(r() - 0.5) * C.FW * 1.1, 6.5, (i % 2 ? 1 : -1) * (hh + 30 + r() * 60), r() * 3]);
  const inst = (geo, mat, list, colorFn) => {
    const m = new THREE.InstancedMesh(geo, mat, list.length); m.castShadow = true; m.receiveShadow = true;
    list.forEach((p, i) => { q4.setFromEuler(e3.set(0, p[3] * 6.28, 0)); m4.compose(v3.set(p[0], p[1], p[2]), q4, ONE); m.setMatrixAt(i, m4); if (colorFn) m.setColorAt(i, colorFn(i)); });
    scene.add(m);
  };
  const drumCols = [0x8a2a1e, 0x3f5a35, 0x2f4f6a, 0x7a6a2a].map(c => new THREE.Color(c));
  inst(bagGeo, bagMat, bags); inst(drumGeo, drumMat, drums, i => drumCols[i % 4]); inst(crateGeo, crateMat, crates);
}

/* ===================== arena floor (per layout) ===================== */
function paintFloor(info) {
  const S = 2, W = C.FW * S, H = C.FH * S, t = C.TILE * S;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#7d7a73'; g.fillRect(0, 0, W, H);
  let seed = 11; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let y = 0; y < C.ROWS; y += 2) for (let x = 0; x < C.COLS; x += 2) {   // 2x2-tile slabs with tone variation
    const v = 112 + r() * 26 | 0; g.fillStyle = `rgb(${v},${v - 3},${v - 9})`; g.fillRect(x * t, y * t, t * 2, t * 2);
  }
  blotches(g, W, H, 90, 'rgba(40,34,26,0.18)', 20, 90);
  blotches(g, W, H, 26, 'rgba(15,12,10,0.28)', 10, 40);                     // oil stains
  speckle(g, W, H, 26000, 0.04, 0.2, false); speckle(g, W, H, 12000, 0.03, 0.14, true);
  g.strokeStyle = 'rgba(35,30,25,0.55)'; g.lineWidth = 2;                   // slab seams
  g.beginPath(); for (let x = 0; x <= C.COLS; x += 2) { g.moveTo(x * t, 0); g.lineTo(x * t, H); } for (let y = 0; y <= C.ROWS; y += 2) { g.moveTo(0, y * t); g.lineTo(W, y * t); } g.stroke();
  g.strokeStyle = 'rgba(35,30,25,0.18)'; g.lineWidth = 1;
  g.beginPath(); for (let x = 1; x <= C.COLS; x += 2) { g.moveTo(x * t, 0); g.lineTo(x * t, H); } for (let y = 1; y <= C.ROWS; y += 2) { g.moveTo(0, y * t); g.lineTo(W, y * t); } g.stroke();
  // painted inner boundary line
  g.strokeStyle = 'rgba(230,190,60,0.55)'; g.lineWidth = 5; g.setLineDash([26, 14]);
  g.strokeRect(t + 10, t + 10, W - 2 * t - 20, H - 2 * t - 20); g.setLineDash([]);
  if (info.mineRect) {                                                     // duel: hazard-striped minefield border + stencil
    const m = info.mineRect, x0 = m.c0 * t - 6, y0 = m.r0 * t - 6, w = (m.c1 - m.c0 + 1) * t + 12, h = (m.r1 - m.r0 + 1) * t + 12;
    g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.rect(x0 + 12, y0 + 12, w - 24, h - 24); g.clip('evenodd');
    g.fillStyle = 'rgba(220,170,30,0.8)'; g.fillRect(x0, y0, w, h);
    g.fillStyle = 'rgba(25,22,18,0.85)'; for (let k = -h; k < w + h; k += 28) { g.beginPath(); g.moveTo(x0 + k, y0); g.lineTo(x0 + k + 14, y0); g.lineTo(x0 + k + 14 - h, y0 + h); g.lineTo(x0 + k - h, y0 + h); g.fill(); }
    g.restore();
    g.fillStyle = 'rgba(200,40,40,0.45)'; g.font = 'bold 30px Arial Black, Arial, sans-serif'; g.textAlign = 'center';
    g.fillText('DANGER  ·  MINES', x0 + w / 2, y0 - 12); g.save(); g.translate(x0 + w / 2, y0 + h + 34); g.fillText('DANGER  ·  MINES', 0, 0); g.restore();
  }
  for (const sp of info.spawns || []) {                                    // spawn pads in team colours
    const x = sp.c * t + t / 2, y = sp.r * t + t / 2;
    g.strokeStyle = sp.color; g.globalAlpha = 0.55; g.lineWidth = 5;
    g.beginPath(); g.arc(x, y, t * 0.78, 0, 7); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.arc(x, y, t * 0.6, 0, 7); g.stroke();
    g.globalAlpha = 0.18; g.fillStyle = sp.color; g.beginPath(); g.arc(x, y, t * 0.78, 0, 7); g.fill(); g.globalAlpha = 1;
  }
  const grad = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.62);  // edge grime
  grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(25,20,15,0.35)'); g.fillStyle = grad; g.fillRect(0, 0, W, H);
  const old = floorMesh.material.map; floorMesh.material.map = tex(c, true); floorMesh.material.needsUpdate = true; if (old) old.dispose();
}

/* ===================== walls ===================== */
function buildWalls() {
  const n = C.ROWS * C.COLS;
  const geo = new RoundedBoxGeometry(C.TILE, WALL_H, C.TILE, 2, 3);
  wallDmg = new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2); geo.setAttribute('aDmg', wallDmg);
  const mat = new THREE.MeshStandardMaterial({ map: T.concrete, color: 0xc4c3bf, roughness: 0.9, metalness: 0.02 });
  mat.onBeforeCompile = sh => {
    sh.uniforms.crackMap = { value: T.cracks };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec2 aDmg; varying vec2 vDmg; varying float vLy;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvDmg = aDmg; vLy = position.y;`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D crackMap; varying vec2 vDmg; varying float vLy;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        float crack = texture2D(crackMap, vMapUv * 0.85 + vDmg.y).r;
        diffuseColor.rgb *= mix(1.0, crack, smoothstep(0.08, 0.6, vDmg.x));
        diffuseColor.rgb *= mix(1.0, 0.55, vDmg.x * vDmg.x);
        diffuseColor.rgb *= mix(0.6, 1.0, smoothstep(${(-WALL_H / 2).toFixed(1)}, ${(-WALL_H / 2 + 11).toFixed(1)}, vLy));`);
  };
  wallMesh = new THREE.InstancedMesh(geo, mat, n);
  wallMesh.castShadow = true; wallMesh.receiveShadow = true; wallMesh.frustumCulled = false;
  wallMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const col = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const v = 0.86 + ((i * 2654435761 >>> 0) % 1000) / 1000 * 0.16; col.setRGB(v, v * 0.985, v * 0.96);
    wallMesh.setColorAt(i, col); wallMesh.setMatrixAt(i, m4.compose(v3.set(0, -999, 0), q4.identity(), ZERO_S));
    wallDmg.setY(i, ((i * 40503) % 997) / 997);
  }
  scene.add(wallMesh);
  // soft contact shadow under every block (follows destruction)
  const aoGeo = new THREE.PlaneGeometry(C.TILE * 1.7, C.TILE * 1.7); aoGeo.rotateX(-Math.PI / 2);
  aoMesh = new THREE.InstancedMesh(aoGeo, new THREE.MeshBasicMaterial({ map: T.ao, color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), n);
  aoMesh.frustumCulled = false; aoMesh.renderOrder = -1;
  for (let i = 0; i < n; i++) aoMesh.setMatrixAt(i, m4.compose(v3.set(0, -999, 0), q4.identity(), ZERO_S));
  scene.add(aoMesh);
  wallCache = new Array(n).fill(null);
}
function syncWalls(fresh) {
  const solid = api.solid(), hp = api.wallHP(); if (!solid || !solid.length) return;
  let changed = false;
  for (let r = 0; r < C.ROWS; r++) for (let c = 0; c < C.COLS; c++) {
    const i = r * C.COLS + c, border = r === 0 || c === 0 || r === C.ROWS - 1 || c === C.COLS - 1;
    if (border) continue;
    const s = solid[r] && solid[r][c], h = s ? hp[r][c] : -1;
    if (wallCache[i] === h) continue;
    const was = wallCache[i]; wallCache[i] = h; changed = true;
    if (!s) {
      wallMesh.setMatrixAt(i, m4.compose(v3.set(0, -999, 0), q4.identity(), ZERO_S)); aoMesh.setMatrixAt(i, m4);
      if (!fresh && was != null && was >= 0) rubblePile(c, r);
      continue;
    }
    const dmg = clamp(1 - h / C.WALL_MAX, 0, 1), sy = 1 - 0.24 * dmg;
    const tilt = dmg > 0.5 ? (dmg - 0.5) * 0.08 : 0;
    q4.setFromEuler(e3.set(tilt * (((i * 7) % 3) - 1), 0, tilt * (((i * 13) % 3) - 1)));
    wallMesh.setMatrixAt(i, m4.compose(v3.set(wx(c * C.TILE + C.TILE / 2), WALL_H * sy / 2, wz(C.HUD_H + r * C.TILE + C.TILE / 2)), q4, v3b.set(1, sy, 1)));
    wallDmg.setX(i, dmg);
    aoMesh.setMatrixAt(i, m4.compose(v3.set(wx(c * C.TILE + C.TILE / 2), 0.08, wz(C.HUD_H + r * C.TILE + C.TILE / 2)), q4.identity(), ONE));
  }
  if (changed) { wallMesh.instanceMatrix.needsUpdate = true; wallDmg.needsUpdate = true; aoMesh.instanceMatrix.needsUpdate = true; }
}
function rubblePile(c, r) {
  const x = wx(c * C.TILE + C.TILE / 2), z = wz(C.HUD_H + r * C.TILE + C.TILE / 2);
  for (let k = 0; k < 9; k++) {
    const g = rnd(0.42, 0.62);
    RUBBLE.add({ x: x + rnd(-13, 13), y: 2, z: z + rnd(-13, 13), vx: 0, vy: 0, vz: 0, ax: 0, ay: 0, az: 0, s: rnd(3, 6.5), sy: rnd(0.5, 0.9), still: true, c: [g, g * 0.98, g * 0.94] });
  }
  SCORCH.add(x, z, rnd(0, 6), 40, 40, 0.5);
}

/* ===================== mines ===================== */
function mineModel() {
  if (!shared.mine) {
    const body = new THREE.CylinderGeometry(8, 9, 3.4, 18); body.translate(0, 1.7, 0);
    const plate = new THREE.CylinderGeometry(4.5, 5, 1.6, 14); plate.translate(0, 4.1, 0);
    const prongs = [];
    for (let k = 0; k < 4; k++) { const p = new THREE.BoxGeometry(11, 1.6, 2.2); p.translate(5.5, 3.6, 0); p.rotateY(Math.PI / 4 + k * Math.PI / 2); prongs.push(p); }
    shared.mineBody = merge([body, plate]); shared.mineProngs = merge(prongs);
    shared.mineMat = new THREE.MeshStandardMaterial({ color: 0x4a4f36, roughness: 0.6, metalness: 0.55, map: T.grime });
    shared.mineProngMat = new THREE.MeshStandardMaterial({ color: 0x9a9c92, roughness: 0.35, metalness: 0.85 });
    shared.ledGeo = new THREE.SphereGeometry(1.5, 10, 8);
    shared.mine = true;
  }
  const g = new THREE.Group();
  const b = new THREE.Mesh(shared.mineBody, shared.mineMat); b.castShadow = true; b.receiveShadow = true; g.add(b);
  const p = new THREE.Mesh(shared.mineProngs, shared.mineProngMat); p.castShadow = true; g.add(p);
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x200000, emissive: 0xff2040, emissiveIntensity: 4 });
  const led = new THREE.Mesh(shared.ledGeo, ledMat); led.position.y = 5.4; g.add(led);
  const glowMat = new THREE.MeshBasicMaterial({ map: T.glow, color: 0xff2a50, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.6 });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), glowMat); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.5; g.add(glow);
  return { g, ledMat, glowMat };
}
function syncMines() {
  const mines = api.mines(), seen = new Set();
  for (const m of mines) {
    const key = Math.round(m.x) + '|' + Math.round(m.y); seen.add(key);
    let v = mineViews.get(key);
    if (!v) { v = mineModel(); v.ph = m.ph || 0; v.g.position.set(wx(m.x), 0, wz(m.y)); v.g.rotation.y = v.ph; scene.add(v.g); mineViews.set(key, v); }
    const pulse = 0.5 + 0.5 * Math.sin(now * 4 + v.ph), blink = Math.sin(now * 7 + v.ph * 3) > 0.55 ? 1 : 0.18;
    v.ledMat.emissiveIntensity = 1.5 + blink * 7; v.glowMat.opacity = 0.25 + 0.35 * pulse;
  }
  for (const [k, v] of mineViews) if (!seen.has(k)) { scene.remove(v.g); v.ledMat.dispose(); v.glowMat.dispose(); mineViews.delete(k); }
}

/* ===================== tanks ===================== */
function merge(list) {
  const geos = list.map(g => { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k); return n; });
  const m = mergeGeometries(geos, false); m.computeBoundingSphere(); return m;
}
function hullGeo(L, W, H, nose, tail, bev) {
  const s = new THREE.Shape();
  s.moveTo(-L / 2, 1.5); s.lineTo(L / 2 - nose * 0.5, 1.5); s.lineTo(L / 2, H * 0.5); s.lineTo(L / 2 - nose, H);
  s.lineTo(-L / 2 + tail, H); s.lineTo(-L / 2, H * 0.62); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 1, curveSegments: 1 });
  g.translate(0, 0, -W / 2); return g;
}
function turretGeo(R, Hh, flat) {
  const s = new THREE.Shape(), pts = flat
    ? [[R, R * 0.55], [R * 0.2, R * 0.85], [-R * 0.85, R * 0.85], [-R, R * 0.55], [-R, -R * 0.55], [-R * 0.85, -R * 0.85], [R * 0.2, -R * 0.85], [R, -R * 0.55]]
    : [[R * 0.95, R * 0.35], [R * 0.55, R * 0.8], [-R * 0.55, R * 0.85], [-R, R * 0.45], [-R, -R * 0.45], [-R * 0.55, -R * 0.85], [R * 0.55, -R * 0.8], [R * 0.95, -R * 0.35]];
  s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: Hh, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 1.1, bevelSegments: 2, curveSegments: 1 });
  g.rotateX(-Math.PI / 2); return g;
}
function barrelGeo(len, r, z, y) {
  const b = new THREE.CylinderGeometry(r, r * 1.12, len, 12, 1); b.rotateZ(-Math.PI / 2); b.translate(len / 2 + 4, y, z);
  const brake = new THREE.CylinderGeometry(r * 1.55, r * 1.55, 3.2, 12, 1); brake.rotateZ(-Math.PI / 2); brake.translate(len + 3.4, y, z);
  const sleeve = new THREE.CylinderGeometry(r * 1.6, r * 1.8, 5, 12, 1); sleeve.rotateZ(-Math.PI / 2); sleeve.translate(5.5, y, z);
  return merge([b, brake, sleeve]);
}
const KINDS = {
  mbt:    { L: 28, W: 14, H: 8.5, tw: 6.2, th: 7.5, tr: 8.6, ty: 5.6, guns: [[17, 1.45, 0]], cupola: 1 },
  scout:  { L: 24, W: 12, H: 7, tw: 5.2, th: 6.4, tr: 6.6, ty: 4.6, guns: [[13, 1.1, 0]], antenna: 1, flat: 1 },
  brute:  { L: 31, W: 16, H: 10, tw: 7.4, th: 8.4, tr: 10.2, ty: 6.6, guns: [[15, 1.6, -2.7], [15, 1.6, 2.7]], skirts: 1, flat: 1 },
  sniper: { L: 27, W: 13, H: 8, tw: 5.8, th: 7, tr: 7.4, ty: 5, guns: [[25, 1.05, 0]], scope: 1 },
  layer:  { L: 28, W: 14, H: 8.5, tw: 6.2, th: 7.5, tr: 7.6, ty: 5, guns: [[12, 1.3, 0]], rack: 1 },
  warden: { L: 28, W: 15, H: 9, tw: 6.4, th: 7.8, tr: 8.2, ty: 5.4, guns: [[15, 1.5, 0]], shield: 1, antenna: 1 },
};
function kindGeos(kind) {
  const key = 'k_' + kind; if (shared[key]) return shared[key];
  const K = KINDS[kind] || KINDS.mbt, out = {};
  out.hull = hullGeo(K.L, K.W, K.H, 8, 4, 1.1);
  const trackLen = K.L + 1, tz = K.W / 2 + K.tw / 2 + 0.6;
  const tl = new RoundedBoxGeometry(trackLen, K.th, K.tw, 2, 2.6); tl.translate(0, K.th / 2, -tz);
  const tr = new RoundedBoxGeometry(trackLen, K.th, K.tw, 2, 2.6); tr.translate(0, K.th / 2, tz);
  out.tracks = merge([tl, tr]);
  const det = [];
  const fender = (z) => { const f = new THREE.BoxGeometry(K.L + 2, 1.2, K.tw + 1.2); f.translate(0, K.th + 0.6, z); return f; };
  det.push(fender(-tz), fender(tz));
  if (K.skirts) for (const z of [-tz - K.tw / 2 - 0.4, tz + K.tw / 2 + 0.4]) { const s = new THREE.BoxGeometry(K.L - 2, K.th * 0.75, 1.4); s.translate(0, K.th * 0.62, z); det.push(s); }
  const deck = new THREE.BoxGeometry(K.L * 0.32, 1.4, K.W * 0.7); deck.translate(-K.L * 0.3, K.H + 0.6, 0); det.push(deck);   // engine deck
  for (const z of [-K.W * 0.25, 0, K.W * 0.25]) { const g = new THREE.BoxGeometry(K.L * 0.26, 0.8, 1.2); g.translate(-K.L * 0.3, K.H + 1.6, z); det.push(g); }
  for (const z of [-K.W * 0.38, K.W * 0.38]) { const l = new THREE.CylinderGeometry(1.3, 1.3, 1.4, 10); l.rotateZ(Math.PI / 2); l.translate(K.L / 2 - 2.2, K.H * 0.62, z); det.push(l); }  // headlights
  if (K.rack) for (let k = 0; k < 3; k++) { const m = new THREE.CylinderGeometry(3.2, 3.2, 1.4, 12); m.translate(-K.L / 2 + 3.5, K.H + 1 + k * 1.6, 0); det.push(m); }
  out.details = merge(det);
  out.turret = turretGeo(K.tr, K.ty, K.flat); out.turret.translate(-1, 0, 0);
  const tdet = [];
  if (K.cupola) { const c = new THREE.CylinderGeometry(2.4, 2.8, 2.2, 12); c.translate(-K.tr * 0.35, K.ty + 1.6, K.tr * 0.3); tdet.push(c); }
  if (K.antenna) { const a = new THREE.CylinderGeometry(0.25, 0.35, 14, 5); a.translate(-K.tr * 0.7, K.ty + 7, -K.tr * 0.45); tdet.push(a); }
  if (K.scope) { const s = new THREE.BoxGeometry(5, 2.2, 2.4); s.translate(1, K.ty + 1.8, -K.tr * 0.4); tdet.push(s); }
  for (const z of [-1, 1]) for (let k = 0; k < 2; k++) { const d = new THREE.CylinderGeometry(0.8, 0.8, 3, 8); d.rotateZ(Math.PI / 2); d.rotateY(z * 0.5); d.translate(K.tr * 0.35 + k * 1.6, K.ty * 0.6, z * K.tr * 0.8); tdet.push(d); }
  const bustle = new THREE.BoxGeometry(K.tr * 0.7, K.ty * 0.7, K.tr * 1.2); bustle.translate(-K.tr * 1.05, K.ty * 0.45, 0); tdet.push(bustle);
  out.turretDet = merge(tdet);
  out.guns = K.guns.map(([len, r, z]) => barrelGeo(len, r, z, K.ty * 0.55));
  const sl = new THREE.BoxGeometry(K.tr * 1.2, 1.1, 0.5); sl.translate(-1, K.ty * 0.55, K.tr * 0.86 + 0.2);
  const sr = new THREE.BoxGeometry(K.tr * 1.2, 1.1, 0.5); sr.translate(-1, K.ty * 0.55, -K.tr * 0.86 - 0.2);
  out.stripe = merge([sl, sr]);
  if (K.shield) { const p = new THREE.BoxGeometry(2.4, K.H + 3, K.W + K.tw * 2 + 4); p.translate(K.L / 2 + 3, (K.H + 3) / 2, 0); out.shield = p; }
  out.K = K;
  shared[key] = out; return out;
}
function teamColor(t) {
  if (t.team === 'enemy') return t.enemyColor || '#ff5277';
  if (t.team === 'ally') return ['#ffb347', '#a8f06f', '#6fb7f0', '#f0d96f'][t.id] || '#ffb347';
  return t.id === 0 ? '#ffb347' : '#46d6e8';
}
function darkMat() { return shared.dark || (shared.dark = new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.42, metalness: 0.85 })); }
function makeTankView(t) {
  if (t.boss) return makeBossView(t);
  const kind = t.team === 'enemy' && KINDS[t.type] ? t.type : 'mbt', G = kindGeos(kind), K = G.K;
  const col = new THREE.Color(teamColor(t));
  const paint = new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.78), roughness: 0.52, metalness: 0.38, map: T.grime });
  const tread = T.tread.clone(); tread.needsUpdate = true; tread.repeat.set(3, 1);
  const trackMat = new THREE.MeshStandardMaterial({ map: tread, roughness: 0.75, metalness: 0.4, color: 0xcccccc });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: col, emissiveIntensity: 2.2 });
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const mk = (geo, mat, parent) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  mk(G.hull, paint, body); mk(G.tracks, trackMat, body); mk(G.details, darkMat(), body);
  const turret = new THREE.Group(); turret.position.y = K.H; body.add(turret);
  mk(G.turret, paint, turret); mk(G.turretDet, darkMat(), turret); mk(G.stripe, stripeMat, turret);
  const guns = G.guns.map(g => mk(g, darkMat(), turret));
  let shieldPlate = null;
  if (G.shield) { shieldPlate = new THREE.MeshStandardMaterial({ color: 0x3a4c7a, metalness: 0.8, roughness: 0.3, emissive: 0x4f7dff, emissiveIntensity: 0.6 }); mk(G.shield, shieldPlate, body); }
  const ringMat = new THREE.MeshBasicMaterial({ map: T.ring, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(48, 48), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.45; root.add(ring);
  const v = { root, body, turret, guns, gunSets: [], paint, trackMat, stripeMat, ringMat, shieldPlate, col, base: col.clone().multiplyScalar(0.78), K, kind,
    halfTrack: K.W / 2 + K.tw / 2 + 0.6, lastDist: t.dist || 0, recoil: 0, hitT: 0, pitch: 0, lastSpeed: 0, smokeAcc: 0, dustAcc: 0, trackAcc: 0, lastX: t.x, lastY: t.y };
  addBubble(v, 22);
  scene.add(root);
  return v;
}
function addBubble(v, r) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(0x66d8ff) }, uA: { value: 0 }, uT: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix * mv; }',
    fragmentShader: `uniform vec3 uCol; uniform float uA, uT; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 2.2); float hex = 0.5 + 0.5 * sin(vP.y * 0.9 - uT * 6.0) * sin(atan(vP.z, vP.x) * 9.0);
        gl_FragColor = vec4(uCol * (f * 2.2 + hex * 0.25), uA * (0.25 + f)); ${COMMON_FRAG_TAIL} }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), mat);
  m.visible = false; v.root.add(m); v.bubble = m; v.bubbleMat = mat;
}

/* ---- bosses ---- */
function makeBossView(t) {
  const col = new THREE.Color(t.enemyColor || '#ff7043'), type = t.bossType;
  const paint = new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.62), roughness: 0.48, metalness: 0.5, map: T.grime });
  const core = new THREE.MeshStandardMaterial({ color: 0x110500, emissive: 0xffb050, emissiveIntensity: 2.5 });
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const mk = (geo, mat, parent) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
  const turret = new THREE.Group(); body.add(turret);
  const v = { root, body, turret, guns: [], gunSets: [], paint, core, col, base: paint.color.clone(), boss: true, type, hitT: 0, recoil: 0, pitch: 0, lastSpeed: 0, smokeAcc: 0, dustAcc: 0, trackAcc: 0, lastDist: t.dist || 0, lastX: t.x, lastY: t.y };
  const R = t.hitR || 28;
  if (type === 'bastion') {
    const base = new THREE.CylinderGeometry(R, R + 5, 20, 8); base.translate(0, 10, 0);
    const rim = new THREE.CylinderGeometry(R + 1.2, R + 1.2, 3, 8); rim.translate(0, 20.5, 0);
    mk(merge([base]), new THREE.MeshStandardMaterial({ map: T.concrete, color: 0xb0aaa0, roughness: 0.9 }), body);
    mk(rim, darkMat(), body);
    const band = new THREE.CylinderGeometry(R + 0.6, R + 0.6, 2, 8, 1, true); band.translate(0, 14, 0);
    const bm = new THREE.Mesh(band, core); body.add(bm);
    turret.position.y = 22;
    mk(new THREE.SphereGeometry(13, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), paint, turret);
    const sets = [[0], [-0.16, 0, 0.16], [-0.26, -0.13, 0, 0.13, 0.26]];
    v.gunSets = sets.map(set => { const g = new THREE.Group(); for (const a of set) { const b = new THREE.Mesh(barrelGeo(22, 2.1, 0, 4), darkMat()); b.rotation.y = -a; b.castShadow = true; g.add(b); } turret.add(g); return g; });
  } else {
    const big = type === 'warlord', L = big ? 62 : 54, W = big ? 34 : 30, H = big ? 16 : 14;
    mk(hullGeo(L, W, H, 14, 7, 2), paint, body);
    const tz = W / 2 + 6;
    const tl = new RoundedBoxGeometry(L + 2, 13, 11, 2, 4); tl.translate(0, 6.5, -tz); const tr = new RoundedBoxGeometry(L + 2, 13, 11, 2, 4); tr.translate(0, 6.5, tz);
    const tread = T.tread.clone(); tread.needsUpdate = true; tread.repeat.set(5, 1);
    v.trackMat = new THREE.MeshStandardMaterial({ map: tread, roughness: 0.75, metalness: 0.4, color: 0xbbbbbb });
    mk(merge([tl, tr]), v.trackMat, body);
    if (type === 'mauler') {                                                 // dozer ram + glowing front armour
      const plow = new THREE.BoxGeometry(5, 16, W + 26); plow.translate(L / 2 + 6, 8, 0);
      v.armorMat = new THREE.MeshStandardMaterial({ color: 0x2c3a5c, metalness: 0.85, roughness: 0.28, emissive: 0x4f7dff, emissiveIntensity: 1.2 });
      mk(plow, v.armorMat, body);
      const spikes = []; for (let k = -3; k <= 3; k++) { const s = new THREE.ConeGeometry(2, 7, 6); s.rotateZ(-Math.PI / 2); s.translate(L / 2 + 11, 9, k * 6); spikes.push(s); }
      mk(merge(spikes), darkMat(), body);
    }
    turret.position.y = H;
    mk(turretGeo(big ? 17 : 14, big ? 11 : 9, true), paint, turret);
    const coreGeo = new THREE.CylinderGeometry(5, 5, 2, 16); coreGeo.translate(-4, (big ? 11 : 9) + 1.2, 0); turret.add(new THREE.Mesh(coreGeo, core));
    const g = new THREE.Group(); turret.add(g); v.gunSets = [g];
    const angles = big ? [0, Math.PI / 2, Math.PI, -Math.PI / 2] : [-0.2, 0, 0.2];
    for (const a of angles) { const b = new THREE.Mesh(barrelGeo(big ? 26 : 22, 2.2, 0, big ? 5.5 : 4.5), darkMat()); b.rotation.y = -a; b.castShadow = true; g.add(b); }
    if (big) for (const s of [-1, 1]) { const pod = new THREE.Mesh(new RoundedBoxGeometry(14, 7, 8, 1, 2), darkMat()); pod.position.set(-6, 6, s * 21); pod.castShadow = true; turret.add(pod); }
  }
  const ringMat = new THREE.MeshBasicMaterial({ map: T.ring, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(R * 3.6, R * 3.6), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.5; root.add(ring); v.ringMat = ring.material;
  v.halfTrack = type === 'bastion' ? 0 : (type === 'warlord' ? 23 : 21);
  addBubble(v, R + 10);
  scene.add(root);
  return v;
}

function syncTanks(dt) {
  const tanks = api.tanks(), seen = new Set();
  for (const t of tanks) {
    if (!t) continue;
    const id = t.id; seen.add(id);
    let v = tankViews.get(id);
    const sig = (t.boss ? 'b' + t.bossType : t.team + (t.type || '')) + (t.enemyColor || '');
    if (v && v.sig !== sig) { disposeView(v); tankViews.delete(id); v = null; }
    if (!v) { v = makeTankView(t); v.sig = sig; tankViews.set(id, v); }
    v.root.visible = !!t.alive;
    if (!t.alive) { v.lastX = t.x; v.lastY = t.y; v.lastDist = t.dist || 0; continue; }
    const X = wx(t.x), Z = wz(t.y);
    v.root.position.set(X, 0, Z); v.root.rotation.y = -t.heading;
    v.turret.rotation.y = -(t.turret - t.heading);
    // hull pitch from acceleration + recoil rock
    const sp = t.speed || 0, acc = (sp - v.lastSpeed) / Math.max(dt, 1e-3); v.lastSpeed = sp;
    v.pitch += (clamp(acc * 0.004, -0.05, 0.05) - v.pitch) * Math.min(1, dt * 8);
    v.recoil = Math.max(0, v.recoil - dt * 5);
    v.body.rotation.z = v.pitch + v.recoil * 0.07;
    for (const g of v.guns) g.position.x = -v.recoil * 3.2;
    for (const g of v.gunSets) g.position.x = -v.recoil * 4;
    if (v.boss && v.type === 'bastion') v.gunSets.forEach((g, i) => { g.visible = (t.phase || 1) === i + 1; });
    // treads scroll with distance travelled
    const d = t.dist || 0, dd = d - v.lastDist; v.lastDist = d;
    if (v.trackMat) v.trackMat.map.offset.x -= dd / 26;
    // hit flash + damage tint
    v.hitT = Math.max(0, v.hitT - dt * 4);
    const hpK = t.maxHp ? clamp(t.hp / t.maxHp, 0, 1) : clamp((t.hp == null ? 4 : t.hp) / 4, 0, 1);
    v.paint.color.copy(v.base).multiplyScalar(0.45 + 0.55 * hpK);
    v.paint.emissive.setRGB(v.hitT * 1.6, v.hitT * 1.3, v.hitT * 1.0);
    if (v.ringMat) v.ringMat.opacity = (v.boss ? 0.5 : 0.4) + 0.15 * Math.sin(now * 3 + id);
    if (v.boss) {
      const ph = t.phase || 1, cc = ph >= 3 ? [3.2, 0.6, 0.15] : ph >= 2 ? [2.6, 1.2, 0.25] : [1.6, 1.3, 0.8];
      v.core.emissive.setRGB(cc[0], cc[1], cc[2]); v.core.emissiveIntensity = 1 + 0.5 * Math.sin(now * (3 + ph * 2));
      if (v.armorMat) v.armorMat.emissiveIntensity = 0.8 + 0.6 * Math.sin(now * 5);
    }
    if (v.shieldPlate) v.shieldPlate.emissiveIntensity = 0.5 + 0.3 * Math.sin(now * 4 + id);
    // shield / spawn-protection bubble
    const inv = Math.max(t.shieldT || 0, t.invuln || 0);
    v.bubble.visible = inv > 0;
    if (inv > 0) { v.bubbleMat.uniforms.uA.value = clamp(inv * 2, 0, 1) * (inv < 1.5 && (t.shieldT || 0) > 0 ? 0.55 + 0.45 * Math.sin(now * 20) : 1); v.bubbleMat.uniforms.uT.value = now; v.bubbleMat.uniforms.uCol.value.set((t.shieldT || 0) > 0 ? 0x6fe8ff : 0xffffff); }
    // rapid-fire glow on the stripe
    if (v.stripeMat) v.stripeMat.emissiveIntensity = (t.rapidT || 0) > 0 ? 3.5 + 1.5 * Math.sin(now * 16) : 2.2;
    // smoke & fire when damaged, dust + track marks when moving
    const hd = Math.cos(t.heading), hs = Math.sin(t.heading);
    if (hpK < 0.55) {
      v.smokeAcc += dt * (hpK < 0.3 ? 14 : 6);
      while (v.smokeAcc > 1) {
        v.smokeAcc--;
        const bx = X - hd * 8, bz = Z - hs * 8, dark = hpK < 0.3 ? 0.12 : 0.32;
        SMOKE.add({ x: bx + rnd(-3, 3), y: 12, z: bz + rnd(-3, 3), vx: rnd(-4, 4), vy: rnd(18, 30), vz: rnd(-4, 4) - 6, life: rnd(1.4, 2.2), s0: 5, s1: 22, c: [dark, dark, dark], a: 0.55, fadeIn: 0.15, drag: 0.8, vr: rnd(-1, 1) });
        if (hpK < 0.3 && Math.random() < 0.5) ADD.add({ x: bx, y: 11, z: bz, vx: rnd(-3, 3), vy: rnd(14, 24), vz: rnd(-3, 3), life: rnd(0.25, 0.45), s0: 6, s1: 2, c: [3.5, 1.4, 0.35], c2: [1.2, 0.2, 0.05], a: 0.9 });
      }
    }
    const moved = Math.hypot(t.x - v.lastX, t.y - v.lastY); v.lastX = t.x; v.lastY = t.y;
    if (moved > 0.2 && moved < 40) {
      v.trackAcc += moved;
      if (v.trackAcc > 6 && v.halfTrack) {
        v.trackAcc = 0; const px = -hs * v.halfTrack, pz = hd * v.halfTrack, w = v.boss ? 10 : 6, len = v.boss ? 12 : 8;
        TRACKS.add(X + px, Z + pz, t.heading, len, w, 0.55); TRACKS.add(X - px, Z - pz, t.heading, len, w, 0.55);
      }
      v.dustAcc += moved * (v.boss ? 0.25 : 0.12);
      while (v.dustAcc > 1) {
        v.dustAcc--;
        const side = Math.random() < 0.5 ? 1 : -1, bx = X - hd * 12 + -hs * (v.halfTrack || 10) * side, bz = Z - hs * 12 + hd * (v.halfTrack || 10) * side;
        SMOKE.add({ x: bx, y: 2.5, z: bz, vx: -hd * 8 + rnd(-5, 5), vy: rnd(3, 8), vz: -hs * 8 + rnd(-5, 5), life: rnd(0.7, 1.2), s0: 4, s1: v.boss ? 26 : 15, c: [0.55, 0.47, 0.36], a: 0.22, fadeIn: 0.2, drag: 1.5 });
      }
    }
  }
  for (const [id, v] of tankViews) if (!seen.has(id)) { disposeView(v); tankViews.delete(id); }
}
function disposeView(v) {
  scene.remove(v.root);
  v.root.traverse(o => { if (o.material && o.material !== shared.dark && !Array.isArray(o.material)) { if (o.material.map && o.material.map !== T.grime && o.material.map !== T.ring && o.material.map !== T.concrete) o.material.map.dispose(); o.material.dispose(); } });
}

/* ===================== shells ===================== */
function syncShells(dt) {
  const shells = api.shells(), seen = new Set();
  if (!shared.shellGeo) {
    shared.shellGeo = new THREE.CapsuleGeometry(1.5, 4, 3, 8); shared.shellGeo.rotateZ(Math.PI / 2);
    shared.shellMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 4.6, 2.2) });
    shared.trailGeo = new THREE.PlaneGeometry(1, 1); shared.trailGeo.rotateX(-Math.PI / 2); shared.trailGeo.translate(-0.5, 0, 0);
  }
  for (const s of shells) {
    const key = s.sid != null ? s.sid : (s.owner + ':' + Math.round(s.vx * 10) + ':' + Math.round(s.vy * 10));
    seen.add(key);
    let v = shellViews.get(key);
    if (!v) {
      const g = new THREE.Group();
      const core = new THREE.Mesh(shared.shellGeo, shared.shellMat); g.add(core);
      const enemy = isEnemyShell(s);
      const tm = new THREE.MeshBasicMaterial({ map: T.line, color: enemy ? new THREE.Color(3.2, 0.6, 0.35) : new THREE.Color(3.0, 1.9, 0.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const trail = new THREE.Mesh(shared.trailGeo, tm); g.add(trail);
      const glow = new THREE.Mesh(shared.glowPlane || (shared.glowPlane = new THREE.PlaneGeometry(1, 1)), new THREE.MeshBasicMaterial({ map: T.glow, color: enemy ? new THREE.Color(2.4, 0.5, 0.3) : new THREE.Color(2.2, 1.5, 0.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      glow.rotation.x = -Math.PI / 2; glow.position.y = -TURRET_Y + 0.6; glow.scale.set(26, 26, 1); g.add(glow);
      scene.add(g); v = { g, trail, tm, glow }; shellViews.set(key, v);
    }
    const ang = Math.atan2(s.vy, s.vx), X = wx(s.x), Z = wz(s.y);
    v.g.position.set(X, TURRET_Y, Z); v.g.rotation.y = -ang;
    const travelled = s.sx != null ? Math.hypot(s.x - s.sx, s.y - s.sy) : 30;
    v.trail.scale.set(Math.min(52, travelled), 1, 3.2);
    v.lastX = s.x; v.lastY = s.y;
  }
  for (const [k, v] of shellViews) if (!seen.has(k)) { scene.remove(v.g); v.tm.dispose(); v.glow.material.dispose(); shellViews.delete(k); }
}
function isEnemyShell(s) {
  const t = api.tanks()[s.owner];
  return !!(t && t.team === 'enemy');
}

/* ===================== pickups ===================== */
const PICK_COLORS = { repair: 0x5dff7a, shield: 0x5fd8ff, rapid: 0xffa040, life: 0xff5fa8 };
function syncPickups(dt) {
  const list = api.pickups ? api.pickups() : [], seen = new Set();
  for (const p of list) {
    seen.add(p.id);
    let v = pickViews.get(p.id);
    if (!v) {
      const col = new THREE.Color(PICK_COLORS[p.kind] || 0xffffff);
      const g = new THREE.Group();
      const crate = new THREE.Mesh(shared.crateGeo || (shared.crateGeo = new RoundedBoxGeometry(14, 14, 14, 2, 2)), new THREE.MeshStandardMaterial({ color: 0x30343c, metalness: 0.6, roughness: 0.4, emissive: col, emissiveIntensity: 0.9, map: T.grime }));
      crate.castShadow = true; g.add(crate);
      const icon = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ map: iconTex(p.kind), color: col.clone().multiplyScalar(2.5), transparent: true, depthWrite: false }));
      icon.rotation.x = -Math.PI / 2; icon.position.y = 7.2; crate.add(icon);
      const beam = new THREE.Mesh(shared.beamGeo || (shared.beamGeo = new THREE.CylinderGeometry(9, 9, 60, 16, 1, true)), new THREE.MeshBasicMaterial({ map: T.beam, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: 0.5 }));
      beam.position.y = 30; g.add(beam);
      const ring = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), new THREE.MeshBasicMaterial({ map: T.ring, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.5; g.add(ring);
      g.position.set(wx(p.x), 0, wz(p.y)); scene.add(g);
      v = { g, crate, beam, ring, born: now }; pickViews.set(p.id, v);
    }
    const age = now - v.born, drop = Math.max(0, 1 - age / 0.45);
    v.crate.position.y = 11 + Math.sin(now * 3 + p.id) * 2 + drop * drop * 140;
    v.crate.rotation.y = now * 1.6 + p.id;
    const blink = (p.t != null && p.t < 3) ? (Math.sin(now * 18) > 0 ? 1 : 0.25) : 1;
    v.beam.material.opacity = 0.42 * blink; v.ring.material.opacity = 0.7 * blink; v.crate.visible = blink > 0.5 || p.t >= 3;
  }
  for (const [k, v] of pickViews) if (!seen.has(k)) { scene.remove(v.g); v.g.traverse(o => { if (o.material) o.material.dispose(); }); pickViews.delete(k); }
}
const iconCache = {};
function iconTex(kind) {
  if (iconCache[kind]) return iconCache[kind];
  const [c, g] = canvas(64, 64); g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineCap = 'round';
  if (kind === 'repair') { g.fillRect(26, 10, 12, 44); g.fillRect(10, 26, 44, 12); }
  else if (kind === 'shield') { g.beginPath(); g.moveTo(32, 8); g.lineTo(54, 16); g.lineTo(50, 38); g.lineTo(32, 56); g.lineTo(14, 38); g.lineTo(10, 16); g.closePath(); g.fill(); }
  else if (kind === 'rapid') { for (const x of [16, 32, 48]) { g.beginPath(); g.moveTo(x - 6, 50); g.lineTo(x, 12); g.lineTo(x + 6, 50); g.fill(); } }
  else { g.beginPath(); g.moveTo(32, 54); g.bezierCurveTo(4, 34, 12, 8, 32, 22); g.bezierCurveTo(52, 8, 60, 34, 32, 54); g.fill(); }
  return (iconCache[kind] = tex(c, true));
}

/* ===================== pooled lights, rings, beams ===================== */
function buildPools() {
  for (let i = 0; i < 6; i++) { const l = new THREE.PointLight(0xffaa55, 0, 220, 1.6); l.position.y = 20; scene.add(l); lightPool.push({ l, t: 0, life: 1, i0: 0 }); }
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: T.ring, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.rotation.x = -Math.PI / 2; m.visible = false; scene.add(m); ringPool.push({ m, t: 0, life: 1 });
  }
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 120, 20, 1, true), new THREE.MeshBasicMaterial({ map: T.beam, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    m.visible = false; scene.add(m); beamPool.push({ m, t: 0, life: 1 });
  }
}
function flashLight(x, z, y, color, intensity, life) {
  let best = lightPool[0];
  for (const p of lightPool) if (p.t >= p.life) { best = p; break; } else if (p.life - p.t < best.life - best.t) best = p;
  best.l.position.set(x, y, z); best.l.color.set(color); best.i0 = intensity; best.t = 0; best.life = life; best.l.intensity = intensity;
}
function ring(x, z, color, r0, r1, life, a) {
  const p = ringPool.find(p => p.t >= p.life) || ringPool[0];
  p.m.position.set(x, 0.7, z); p.m.material.color.set(color); p.r0 = r0; p.r1 = r1; p.t = 0; p.life = life; p.a = a || 1; p.m.visible = true;
}
function beam(x, z, color, life) {
  const p = beamPool.find(p => p.t >= p.life) || beamPool[0];
  p.m.position.set(x, 60, z); p.m.material.color.set(color); p.t = 0; p.life = life; p.m.visible = true;
}
function updatePools(dt) {
  for (const p of lightPool) { if (p.t < p.life) { p.t += dt; const k = clamp(p.t / p.life, 0, 1); p.l.intensity = p.i0 * (1 - k) * (1 - k); } else p.l.intensity = 0; }
  for (const p of ringPool) if (p.m.visible) { p.t += dt; const k = p.t / p.life; if (k >= 1) { p.m.visible = false; continue; } const r = p.r0 + (p.r1 - p.r0) * (1 - Math.pow(1 - k, 3)); p.m.scale.set(r * 2, r * 2, 1); p.m.material.opacity = p.a * (1 - k); }
  for (const p of beamPool) if (p.m.visible) { p.t += dt; const k = p.t / p.life; if (k >= 1) { p.m.visible = false; continue; } p.m.scale.set(1 - k * 0.6, 1, 1 - k * 0.6); p.m.material.opacity = (1 - k) * 0.9; }
}

/* ===================== wrecks ===================== */
function spawnWreck(v, t) {
  if (!v) return;
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.9, metalness: 0.3, emissive: 0xff4a10, emissiveIntensity: 0.25, map: T.grime });
  const hull = v.body.clone(true), wreckTurret = v.turret.clone(true);
  for (const c of [...hull.children]) if (c.isGroup) hull.remove(c);         // the turret group flies off separately
  [hull, wreckTurret].forEach(o => o.traverse(m => { if (m.isMesh) { m.material = mat; m.castShadow = true; } }));
  const g = new THREE.Group(); g.position.copy(v.root.position); g.rotation.copy(v.root.rotation);
  g.add(hull); scene.add(g);
  // turret pops off and tumbles
  const tw = new THREE.Group(); tw.add(wreckTurret); wreckTurret.position.set(0, 0, 0); wreckTurret.rotation.set(0, v.turret.rotation.y, 0);
  tw.position.set(g.position.x, v.boss ? 20 : (v.K ? v.K.H : 9), g.position.z); tw.rotation.y = g.rotation.y; scene.add(tw);
  const a = rnd(0, 6.28), sp = v.boss ? rnd(20, 40) : rnd(25, 55);
  const w = { g, tw, mat, age: 0, life: v.boss ? 9 : 6.5, vx: Math.cos(a) * sp, vz: Math.sin(a) * sp, vy: v.boss ? 110 : rnd(120, 170), ax: rnd(-6, 6), az: rnd(-6, 6), landed: false, fireAcc: 0, boss: !!v.boss };
  wrecks.push(w);
  while (wrecks.length > 14) removeWreck(wrecks[0]);
}
function removeWreck(w) { scene.remove(w.g); scene.remove(w.tw); w.mat.dispose(); wrecks.splice(wrecks.indexOf(w), 1); }
function updateWrecks(dt) {
  for (let i = wrecks.length - 1; i >= 0; i--) {
    const w = wrecks[i]; w.age += dt;
    if (!w.landed) {
      w.vy -= 330 * dt; w.tw.position.x += w.vx * dt; w.tw.position.y += w.vy * dt; w.tw.position.z += w.vz * dt;
      w.tw.rotation.x += w.ax * dt; w.tw.rotation.z += w.az * dt;
      if (w.tw.position.y < 3 && w.vy < 0) {
        w.vy = -w.vy * 0.3; w.vx *= 0.4; w.vz *= 0.4; w.ax *= 0.3; w.az *= 0.3;
        if (Math.abs(w.vy) < 25) { w.landed = true; w.tw.position.y = 3; w.tw.rotation.x = Math.round(w.tw.rotation.x / Math.PI) * Math.PI * 0.12; w.tw.rotation.z = 0.25; }
        SMOKE.add({ x: w.tw.position.x, y: 3, z: w.tw.position.z, vx: 0, vy: 6, vz: 0, life: 1, s0: 8, s1: 26, c: [0.4, 0.35, 0.3], a: 0.35, fadeIn: 0.1 });
      }
    }
    w.mat.emissiveIntensity = Math.max(0, 0.25 - w.age * 0.16) * (0.75 + 0.25 * Math.sin(now * 13 + w.age));
    const burn = w.age < w.life - 2;
    w.fireAcc += dt * (burn ? (w.boss ? 30 : 16) : 4);
    while (w.fireAcc > 1) {
      w.fireAcc--;
      const x = w.g.position.x + rnd(-6, 6), z = w.g.position.z + rnd(-6, 6);
      if (burn && Math.random() < 0.55) ADD.add({ x, y: rnd(6, 12), z, vx: rnd(-4, 4), vy: rnd(18, 34), vz: rnd(-4, 4), life: rnd(0.3, 0.6), s0: rnd(7, 12), s1: 3, c: [4, 1.6, 0.4], c2: [1.4, 0.25, 0.05], a: 0.85 });
      SMOKE.add({ x, y: 12, z, vx: rnd(-5, 5) - 7, vy: rnd(22, 36), vz: rnd(-5, 5) + 3, life: rnd(2, 3.2), s0: 8, s1: 42, c: [0.09, 0.085, 0.08], a: 0.62, fp: 0.8, fadeIn: 0.12, drag: 0.6, vr: rnd(-0.8, 0.8) });
    }
    if (w.age > w.life - 1.5) { const k = (w.age - (w.life - 1.5)) / 1.5; w.g.position.y = -k * 14; w.tw.position.y = Math.min(w.tw.position.y, 3 - k * 10); }
    if (w.age >= w.life) removeWreck(w);
  }
}

/* ===================== events → effects ===================== */
function hexArr(hex, m) { const c = new THREE.Color(hex); return [c.r * (m || 1), c.g * (m || 1), c.b * (m || 1)]; }
function sparks(x, y, z, n, col, spd, life) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, 6.28), up = rnd(-0.2, 1), s = rnd(spd * 0.4, spd);
    SPARKS.add({ x, y, z, vx: Math.cos(a) * s, vy: up * s * 0.8 + 20, vz: Math.sin(a) * s, life: rnd(life * 0.5, life), s0: rnd(1.6, 2.8), s1: 0.6, c: col, a: 1, grav: 260, drag: 1.2 });
  }
}
function fireball(x, y, z, n, size, life, hot) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, 6.28), s = rnd(10, 60) * size / 20;
    ADD.add({ x: x + rnd(-3, 3), y: y + rnd(0, 6), z: z + rnd(-3, 3), vx: Math.cos(a) * s, vy: rnd(10, 50) * size / 20, vz: Math.sin(a) * s, life: rnd(life * 0.5, life), s0: size * rnd(0.4, 0.7), s1: size * rnd(1, 1.5), c: hot || [5, 2.6, 0.9], c2: [1.6, 0.25, 0.04], ck: 1.6, a: 1, drag: 3, fp: 1.4 });
  }
}
function smokeBurst(x, y, z, n, size, col, life, rise) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, 6.28), s = rnd(4, 30) * size / 20;
    SMOKE.add({ x: x + rnd(-4, 4), y: y + rnd(0, 6), z: z + rnd(-4, 4), vx: Math.cos(a) * s, vy: rnd(rise * 0.5, rise), vz: Math.sin(a) * s, life: rnd(life * 0.6, life), s0: size * 0.5, s1: size * rnd(1.6, 2.4), c: col, a: 0.78, fp: 0.75, fadeIn: 0.08, drag: 1.4, vr: rnd(-1, 1) });
  }
}
function chunks(x, y, z, n, cols, spd, size, life) {
  for (let i = 0; i < n; i++) {
    const a = rnd(0, 6.28), s = rnd(spd * 0.3, spd), c = cols[i % cols.length];
    DEBRIS.add({ x, y, z, vx: Math.cos(a) * s, vy: rnd(60, 150) * spd / 90, vz: Math.sin(a) * s, ax: rnd(-12, 12), ay: rnd(-12, 12), az: rnd(-12, 12), s: rnd(size * 0.5, size), sx: rnd(0.7, 1.4), sz: rnd(0.6, 1.2), c, life: life || rnd(5, 8) });
  }
}
function addShake(n) { shake = Math.max(shake, n); }

function onEvent(e) {
  if (!ready || !e) return;
  const X = e.x != null ? wx(e.x) : 0, Z = e.y != null ? wz(e.y) : 0;
  const v = e.id != null ? tankViews.get(e.id) : null;
  switch (e.k) {
    case 'fire': {
      const ca = Math.cos(e.a), sa = Math.sin(e.a), big = !!e.big, y = big ? 20 : TURRET_Y;
      if (v) v.recoil = 1;
      ADD.add({ x: X, y, z: Z, vx: 0, vy: 0, vz: 0, life: 0.09, s0: big ? 30 : 20, s1: big ? 40 : 26, c: [7, 5, 2.6], a: 1 });
      for (let i = 0; i < 4; i++) ADD.add({ x: X + ca * i * 3, y, z: Z + sa * i * 3, vx: ca * (60 + i * 30), vy: 0, vz: sa * (60 + i * 30), life: 0.12, s0: 10 - i, s1: 4, c: [5, 2.4, 0.7], a: 0.9, drag: 8 });
      smokeBurst(X + ca * 3, y - 2, Z + sa * 3, 3, 9, [0.55, 0.52, 0.48], 0.9, 10);
      for (const s of [-1, 1]) SMOKE.add({ x: X, y: y - 2, z: Z, vx: -sa * s * 40 + ca * 10, vy: 4, vz: ca * s * 40 + sa * 10, life: 0.6, s0: 5, s1: 14, c: [0.6, 0.57, 0.52], a: 0.35, drag: 4 });
      flashLight(X + ca * 6, Z + sa * 6, y + 4, 0xffc070, big ? 9000 : 5200, 0.12);
      addShake(big ? 2.2 : 1.1);
      break;
    }
    case 'wall': {
      const steel = e.border;
      sparks(X, TURRET_Y, Z, steel ? 16 : 10, steel ? [5, 3.4, 1.4] : [4, 2.6, 1.1], 120, 0.5);
      ADD.add({ x: X, y: TURRET_Y, z: Z, vx: 0, vy: 0, vz: 0, life: 0.1, s0: 14, s1: 22, c: [5, 3.2, 1.4], a: 1 });
      if (!steel) {
        smokeBurst(X, TURRET_Y - 4, Z, e.broke ? 12 : 4, e.broke ? 16 : 9, [0.62, 0.6, 0.56], e.broke ? 2.2 : 1.2, e.broke ? 18 : 10);
        const g = 0.58; chunks(X, TURRET_Y, Z, e.broke ? 14 : 4, [[g, g, g * 0.95], [g * 0.8, g * 0.78, g * 0.74]], e.broke ? 110 : 70, e.broke ? 4 : 2.4);
      }
      flashLight(X, Z, TURRET_Y + 6, 0xffb060, 2600, 0.1);
      addShake(e.broke ? 2.5 : 0.8);
      break;
    }
    case 'hit': {
      if (v) v.hitT = 1;
      sparks(X, TURRET_Y, Z, 18, [6, 3.4, 1.2], 150, 0.55);
      ADD.add({ x: X, y: TURRET_Y, z: Z, vx: 0, vy: 0, vz: 0, life: 0.12, s0: 18, s1: 26, c: [6, 3.6, 1.6], a: 1 });
      smokeBurst(X, TURRET_Y, Z, 3, 9, [0.25, 0.24, 0.23], 1.2, 16);
      flashLight(X, Z, TURRET_Y + 6, 0xff9a40, 4000, 0.14);
      addShake(1.6);
      break;
    }
    case 'deflect': {
      if (v) v.hitT = 0.5;
      sparks(X, TURRET_Y, Z, 22, [2.6, 3.6, 6], 190, 0.45);
      ring(X, Z, 0x6fa8ff, 4, 22, 0.25, 0.9);
      flashLight(X, Z, TURRET_Y + 4, 0x7fb0ff, 3000, 0.1);
      break;
    }
    case 'kill': {
      const big = !!e.boss, sz = big ? 2.2 : 1;
      if (v) spawnWreck(v, e);
      fireball(X, 8, Z, big ? 26 : 14, 26 * sz, 0.9, [6, 3, 1]);
      smokeBurst(X, 10, Z, big ? 26 : 15, 24 * sz, [0.12, 0.11, 0.1], 3.2, 40);
      sparks(X, 14, Z, big ? 70 : 36, [6, 3.2, 1.2], 220 * Math.sqrt(sz), 0.9);
      const tc = hexArr(e.color || '#888', 0.7);
      chunks(X, 12, Z, big ? 26 : 12, [tc, [0.12, 0.12, 0.13], [0.2, 0.19, 0.18]], 130 * Math.sqrt(sz), big ? 5 : 3.2);
      ring(X, Z, 0xffb070, 8, 90 * sz, 0.5, 1); ring(X, Z, 0xffffff, 4, 45 * sz, 0.25, 0.8);
      SCORCH.add(X, Z, rnd(0, 6), 64 * sz, 64 * sz, 0.85);
      flashLight(X, Z, 30, 0xff9040, big ? 40000 : 16000, big ? 0.9 : 0.5);
      addShake(big ? 14 : 8);
      if (big) { flashT = 1; for (let k = 1; k <= 5; k++) setTimeout(() => { const ox = X + rnd(-30, 30), oz = Z + rnd(-30, 30); fireball(ox, 10, oz, 10, 30, 0.8); sparks(ox, 14, oz, 20, [6, 3, 1], 180, 0.7); flashLight(ox, oz, 26, 0xff8030, 14000, 0.4); addShake(6); }, k * 220); }
      break;
    }
    case 'mine': {
      fireball(X, 4, Z, 12, 24, 0.7, [6, 3.4, 1.2]);
      for (let i = 0; i < 16; i++) SMOKE.add({ x: X + rnd(-5, 5), y: 4, z: Z + rnd(-5, 5), vx: rnd(-25, 25), vy: rnd(70, 140), vz: rnd(-25, 25), life: rnd(1.2, 2.2), s0: 8, s1: 28, c: [0.33, 0.26, 0.18], a: 0.65, fadeIn: 0.05, drag: 2.2, grav: 30 });
      chunks(X, 4, Z, 14, [[0.3, 0.24, 0.17], [0.22, 0.18, 0.13], [0.35, 0.36, 0.3]], 110, 2.6);
      ring(X, Z, 0xff7040, 6, 70, 0.45, 1);
      SCORCH.add(X, Z, rnd(0, 6), 58, 58, 0.9);
      flashLight(X, Z, 18, 0xff7a30, 18000, 0.45);
      addShake(9);
      break;
    }
    case 'mineDrop': smokeBurst(X, 2, Z, 4, 8, [0.5, 0.44, 0.34], 0.9, 6); SCORCH.add(X, Z, rnd(0, 6), 22, 22, 0.4); break;
    case 'flak': sparks(X, TURRET_Y, Z, 16, [5, 4, 2.4], 140, 0.4); ADD.add({ x: X, y: TURRET_Y, z: Z, vx: 0, vy: 0, vz: 0, life: 0.14, s0: 16, s1: 30, c: [5, 3.6, 1.6], a: 1 }); smokeBurst(X, TURRET_Y, Z, 3, 8, [0.4, 0.38, 0.36], 1, 8); flashLight(X, Z, TURRET_Y, 0xffd080, 3000, 0.12); break;
    case 'phase': if (v) v.hitT = 1; ring(X, Z, 0xff4020, 10, 160, 0.8, 1); flashLight(X, Z, 40, 0xff3010, 30000, 0.7); addShake(10); flashT = 0.6; break;
    case 'spawn': {
      const col = new THREE.Color(teamColor({ team: e.team, id: e.id, enemyColor: e.color }));
      beam(X, Z, col, 0.7); ring(X, Z, col, 4, 40, 0.5, 1);
      smokeBurst(X, 2, Z, 6, 12, [0.55, 0.5, 0.42], 1, 8);
      break;
    }
    case 'drop': ring(X, Z, PICK_COLORS[e.kind] || 0xffffff, 4, 30, 0.6, 1); break;
    case 'pick': {
      const col = hexArr(PICK_COLORS[e.kind] || 0xffffff, 4);
      sparks(X, 12, Z, 26, col, 130, 0.6); ring(X, Z, PICK_COLORS[e.kind] || 0xffffff, 6, 50, 0.4, 1);
      flashLight(X, Z, 18, PICK_COLORS[e.kind] || 0xffffff, 5000, 0.3);
      break;
    }
    case 'shellEnd': smokeBurst(X, TURRET_Y, Z, 2, 6, [0.5, 0.48, 0.45], 0.7, 6); break;
  }
}

/* ===================== camera ===================== */
let camMode = 'auto';                              // auto | overview | follow
const camPos = new THREE.Vector3(0, 900, 700), camTgt = new THREE.Vector3(), wantPos = new THREE.Vector3(), wantTgt = new THREE.Vector3();
let camSnap = true, overviewCache = null, orbitA = 0;
function hudPx() { return api.hudH ? api.hudH() : 64; }
function fitOverview() {
  const key = viewW + 'x' + viewH + ':' + hudPx();
  if (overviewCache && overviewCache.key === key) return overviewCache;
  const pitch = THREE.MathUtils.degToRad(viewW < viewH ? 64 : 55), top = 1 - 2 * (hudPx() + 6) / viewH, bot = -0.97;
  const corners = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { corners.push(new THREE.Vector3(sx * C.FW / 2, 0, sz * C.FH / 2), new THREE.Vector3(sx * C.FW / 2, BORDER_H, sz * C.FH / 2)); }
  const cam = camera.clone(); cam.aspect = viewW / viewH; cam.updateProjectionMatrix();
  let tz = 0, d = 1000;
  const place = (dist) => { cam.position.set(0, Math.sin(pitch) * dist, tz + Math.cos(pitch) * dist); cam.lookAt(0, 0, tz); cam.updateMatrixWorld(); };
  const range = () => { let x = 0, y0 = 9, y1 = -9; for (const c of corners) { v3.copy(c).project(cam); x = Math.max(x, Math.abs(v3.x)); y0 = Math.min(y0, v3.y); y1 = Math.max(y1, v3.y); } return [x, y0, y1]; };
  for (let it = 0; it < 6; it++) {
    let lo = 200, hi = 5000;
    for (let k = 0; k < 26; k++) { const mid = (lo + hi) / 2; place(mid); const [x, y0, y1] = range(); if (x <= 0.97 && (y1 - y0) <= (top - bot)) hi = mid; else lo = mid; }
    d = hi; place(d); const [, y0, y1] = range();
    tz -= ((y0 + y1) / 2 - (top + bot) / 2) * C.FH * 0.45;
  }
  overviewCache = { key, pos: new THREE.Vector3(0, Math.sin(pitch) * d, tz + Math.cos(pitch) * d), tgt: new THREE.Vector3(0, 0, tz), d, pitch };
  return overviewCache;
}
function updateCamera(dt) {
  const st = api.state(), ov = fitOverview(), mobile = api.mobile && api.mobile();
  let mode = camMode === 'auto' ? (mobile ? 'follow' : 'overview') : camMode;
  const focus = api.focus ? api.focus() : null;
  if (st === 'attract' || st === 'over') mode = 'orbit';
  if (mode === 'orbit') {
    orbitA += dt * 0.07;
    const d = ov.d * (mobile ? 0.95 : 0.9), p = THREE.MathUtils.degToRad(47);
    wantTgt.set(0, 0, 0); wantPos.set(Math.sin(orbitA) * Math.cos(p) * d, Math.sin(p) * d, Math.cos(orbitA) * Math.cos(p) * d);
  } else if (mode === 'follow' && focus) {
    const pitch = THREE.MathUtils.degToRad(viewW < viewH ? 62 : 56);
    const visH = viewW < viewH ? clamp(470 * viewH / viewW, 380, 1100) : clamp(viewH * 1.05, 380, 760);   // portrait: keep ~470 units of width
    const d = visH / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    const visW = visH * viewW / viewH;
    let fx = wx(focus.x) + (focus.vx || 0) * 14, fz = wz(focus.y) + (focus.vy || 0) * 14;
    const mx = Math.max(0, C.FW / 2 - visW / 2 + 60), mz = Math.max(0, C.FH / 2 - visH * 0.42 + 50);
    fx = clamp(fx, -mx, mx); fz = clamp(fz, -mz, mz);
    wantTgt.set(fx, 0, fz + 18); wantPos.set(fx, Math.sin(pitch) * d, fz + 18 + Math.cos(pitch) * d);
  } else {
    wantTgt.copy(ov.tgt); wantPos.copy(ov.pos);
    if (focus) { const dx = clamp(wx(focus.x) * 0.06, -24, 24), dz = clamp(wz(focus.y) * 0.05, -14, 14); wantTgt.x += dx; wantPos.x += dx; wantTgt.z += dz; wantPos.z += dz; }
  }
  const k = camSnap ? 1 : 1 - Math.exp(-dt * (mode === 'orbit' ? 1.6 : 4.5));
  camPos.lerp(wantPos, k); camTgt.lerp(wantTgt, k); camSnap = false;
  shake = Math.max(0, shake - dt * 22);
  const s = shake * 0.9;
  camera.position.set(camPos.x + rnd(-s, s), camPos.y + rnd(-s, s) * 0.5, camPos.z + rnd(-s, s));
  camera.lookAt(camTgt.x + rnd(-s, s) * 0.3, camTgt.y, camTgt.z + rnd(-s, s) * 0.3);
}

/* ===================== reticle ===================== */
function buildReticle() {
  reticle = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), new THREE.MeshBasicMaterial({ map: reticleTex(), color: new THREE.Color(2.4, 1.6, 0.7), transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }));
  reticle.rotation.x = -Math.PI / 2; reticle.renderOrder = 10; reticle.visible = false; scene.add(reticle);
  aimLine = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2).translate(0.5, 0, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, 0.7, 0.3), transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
  aimLine.visible = false; scene.add(aimLine);
}
function reticleTex() {
  const [c, g] = canvas(128, 128); g.strokeStyle = '#fff'; g.lineWidth = 6;
  g.beginPath(); g.arc(64, 64, 34, 0, 7); g.stroke();
  g.lineWidth = 7; for (const [a, b, cc, d] of [[64, 6, 64, 30], [64, 98, 64, 122], [6, 64, 30, 64], [98, 64, 122, 64]]) { g.beginPath(); g.moveTo(a, b); g.lineTo(cc, d); g.stroke(); }
  g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 5, 0, 7); g.fill();
  return tex(c, false);
}
function updateReticle() {
  const r = api.reticle ? api.reticle() : null;
  reticle.visible = !!r; aimLine.visible = !!r;
  if (!r) return;
  const X = wx(r.x), Z = wz(r.y);
  reticle.position.set(X, 1, Z); reticle.rotation.z = now * 0.8;
  const t = r.from; if (!t) { aimLine.visible = false; return; }
  const tx = wx(t.x), tz = wz(t.y), len = Math.hypot(X - tx, Z - tz);
  aimLine.position.set(tx, 1, tz); aimLine.rotation.y = -Math.atan2(Z - tz, X - tx); aimLine.scale.set(len, 1, 1.2);
}

/* ===================== quality / resize ===================== */
let ftAvg = 16, ftLow = 0;
function applyQuality() {
  const mobile = api.mobile && api.mobile();
  tier = quality === 'auto' ? (tier || (mobile ? 'medium' : 'high')) : quality;
  const pr = tier === 'high' ? Math.min(dpr, 2) : tier === 'medium' ? Math.min(dpr, 1.5) : 1;
  R.setPixelRatio(pr);
  R.shadowMap.enabled = tier !== 'low';
  sun.castShadow = tier !== 'low';
  const ms = tier === 'high' ? 2048 : 1024;
  if (sun.shadow.mapSize.x !== ms) { sun.shadow.mapSize.set(ms, ms); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
  postOn = tier !== 'low';
  R.setSize(viewW, viewH, false);
  if (composer) { composer.setPixelRatio(pr); composer.setSize(viewW, viewH); }
  if (bloomPass) bloomPass.resolution.set(viewW * pr / 2, viewH * pr / 2);
  scene.traverse(o => { if (o.material && 'needsUpdate' in o.material && !Array.isArray(o.material)) o.material.needsUpdate = true; });
}
function adaptQuality(dt) {
  if (quality !== 'auto') return;
  ftAvg += (dt * 1000 - ftAvg) * 0.05;
  if (ftAvg > 26) ftLow += dt; else ftLow = Math.max(0, ftLow - dt * 0.5);
  if (ftLow > 3 && tier !== 'low') { tier = tier === 'high' ? 'medium' : 'low'; ftLow = 0; ftAvg = 16; applyQuality(); }
}

/* ===================== public API ===================== */
function init(glCanvas, gameApi) {
  try {
    api = gameApi; C = api.consts();
    R = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: false, powerPreference: 'high-performance', alpha: false });
    R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFShadowMap;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1, 5, 7000);
    makeTextures();
    buildEnvironment(); buildWalls(); buildPools(); buildReticle();
    ADD = new Billboards(2400, T.smoke, true, 3); SPARKS = new Billboards(1600, T.spark, true, 4); SMOKE = new Billboards(1800, T.smoke, false, 2);
    DEBRIS = new Chunks(360); RUBBLE = new Chunks(900, true);
    SCORCH = new Decals(160, T.scorch, 0x0b0907, 0, 0.18); TRACKS = new Decals(1200, T.track, 0x14110d, 14, 0.12);
    for (const o of [ADD.mesh, SPARKS.mesh, SMOKE.mesh, DEBRIS.mesh, RUBBLE.mesh, SCORCH.mesh, TRACKS.mesh]) scene.add(o);
    const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(R, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.62, 0.42, 1.0); composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    glCanvas.addEventListener('webglcontextlost', e => { e.preventDefault(); ready = false; if (api.onLost) api.onLost(); });
    ready = true;
    return true;
  } catch (err) { console.warn('[Steel Duel] 3D unavailable', err); ready = false; return false; }
}
function resize(w, h, ratio) {
  if (!ready) return;
  viewW = Math.max(1, w); viewH = Math.max(1, h); dpr = ratio || 1;
  camera.aspect = viewW / viewH; camera.updateProjectionMatrix(); overviewCache = null;
  applyQuality();
}
function reset() {
  if (!ready) return;
  for (const [, v] of tankViews) disposeView(v); tankViews.clear();
  for (const [, v] of shellViews) { scene.remove(v.g); v.tm.dispose(); v.glow.material.dispose(); } shellViews.clear();
  while (wrecks.length) removeWreck(wrecks[0]);
  ADD.clear(); SMOKE.clear(); SPARKS.clear(); DEBRIS.clear(); RUBBLE.clear(); SCORCH.clear(); TRACKS.clear();
  wallCache.fill(null); syncWalls(true);
  const info = api.layout ? api.layout() : {}, key = JSON.stringify(info);
  if (key !== floorKey) { floorKey = key; paintFloor(info); }
}
let lastLayoutCheck = '';
function advance(dt) {
  if (!ready) return;
  now += dt;
  const info = api.layout ? api.layout() : {}, key = JSON.stringify(info);
  if (key !== floorKey) { floorKey = key; paintFloor(info); }
  syncWalls(false); syncMines(); syncTanks(dt); syncShells(dt); syncPickups(dt);
  ADD.update(dt); SPARKS.update(dt); SMOKE.update(dt); DEBRIS.update(dt); RUBBLE.update(dt); SCORCH.tick(); TRACKS.tick();
  updatePools(dt); updateWrecks(dt);
  shared.cornerLamp.emissiveIntensity = 1.5 + 2.5 * (Math.sin(now * 3) > 0 ? 1 : 0);
  flashT = Math.max(0, flashT - dt * 1.8);
}
function render(dt) {
  if (!ready) return;
  dt = Math.min(0.1, Math.max(0, dt || 0));
  advance(dt);
  updateCamera(dt); updateReticle();
  adaptQuality(dt);
  if (postOn) composer.render(); else R.render(scene, camera);
}
const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -TURRET_Y), ndc = new THREE.Vector2();
function pick(clientX, clientY, rect) {
  if (!ready) return null;
  ndc.set((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
  camera.updateMatrixWorld(); ray.setFromCamera(ndc, camera);
  const hit = ray.ray.intersectPlane(plane, v3); if (!hit) return null;
  return { x: hit.x + C.FW / 2, y: hit.z + C.HUD_H + C.FH / 2 };
}
function toScreen(x, y, h) {
  if (!ready) return null;
  v3.set(wx(x), h || 0, wz(y)).project(camera);
  return { x: (v3.x + 1) / 2 * viewW, y: (1 - v3.y) / 2 * viewH, behind: v3.z > 1 };
}
window.SD3D = {
  init, resize, reset, render, advance, event: onEvent, pick, toScreen,
  get ready() { return ready; },
  setQuality(q) { quality = q || 'auto'; tier = quality === 'auto' ? null : quality; if (ready) applyQuality(); },
  get quality() { return quality; }, get tier() { return tier; },
  setCamMode(m) { camMode = m; }, get camMode() { return camMode; },
  snapCamera() { camSnap = true; },
  get flash() { return flashT; },
  info() { return ready ? { calls: R.info.render.calls, tris: R.info.render.triangles, tier, particles: ADD.list.length + SMOKE.list.length + SPARKS.list.length, add: ADD.list.length, smoke: SMOKE.list.length, sparks: SPARKS.list.length, smokeN: SMOKE.geo.instanceCount, debris: DEBRIS.list.length, tanks: tankViews.size, shells: shellViews.size, mines: mineViews.size, wrecks: wrecks.length } : null; },
};
window.dispatchEvent(new Event('sd3d-ready'));
