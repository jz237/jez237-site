// Swarmbreak 2.0 visuals that sit on top of the renderer: a sky with a sun, clouds and stars; floors that
// are alive (cloud shadows, standing water with rain rings, heat in the seams, data running along the lines,
// energy under the grate) and carry pulses of light; instanced warp-in beams; glowing shot trails; and air
// traffic in the distance. Purely visual: nothing here touches the simulation.
import * as THREE from '../vendor/three.module.min.js';

// ------------------------------------------------------------------ sky
export const SKY_VERT = /* glsl */ `varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`;
export const SKY_FRAG = /* glsl */ `
uniform vec3 uTop, uMid, uLow, uSunDir, uSunCol; uniform float uFlash, uTime, uCloud, uStars;
varying vec3 vD;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * vn(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
void main(){
  vec3 d = normalize(vD);
  float h = d.y;
  vec3 c = mix(uLow, uMid, smoothstep(-0.05, 0.18, h));
  c = mix(c, uTop, smoothstep(0.18, 0.7, h));
  float sd = max(dot(d, uSunDir), 0.0);
  // the sun (or moon): a hot disc, a tight halo and a wide warm wash
  c += uSunCol * (smoothstep(0.9993, 0.9997, sd) * 9.0 + pow(sd, 60.0) * 0.6 + pow(sd, 7.0) * 0.25);
  if (uStars > 0.0) {
    vec2 sp = d.xz / (abs(h) + 0.35) * 46.0; vec2 id = floor(sp); float r = h21(id);
    vec2 o = fract(sp) - 0.5 - (vec2(h21(id + 3.1), h21(id + 7.7)) - 0.5) * 0.7;
    float st = smoothstep(0.1, 0.0, length(o)) * step(0.84, r);
    c += vec3(0.8, 0.9, 1.0) * st * uStars * (0.55 + 0.45 * sin(uTime * (1.0 + r * 3.0) + r * 40.0)) * smoothstep(0.02, 0.3, h);
  }
  if (uCloud > 0.0 && h > -0.02) {
    // a cloud deck on a plane overhead, lit from the sun's side
    vec2 cp = d.xz / (h + 0.2) * 1.5 + vec2(uTime * 0.011, uTime * 0.004);
    float n = fbm(cp);
    float cov = smoothstep(0.62 - uCloud * 0.5, 0.92 - uCloud * 0.5, n);
    float lit = fbm(cp + uSunDir.xz * 0.22);
    vec3 cc = mix(uMid * 0.5 + uTop * 0.25, uSunCol * 0.85 + uLow * 0.35, clamp((n - lit) * 3.5 + 0.45 + pow(sd, 4.0) * 0.7, 0.0, 1.0));
    cc += vec3(0.6, 0.66, 1.0) * uFlash * 2.2 * n;
    c = mix(c, cc, cov * smoothstep(-0.02, 0.07, h) * 0.92);
  }
  c += vec3(0.6, 0.65, 1.0) * uFlash * smoothstep(-0.1, 0.5, h) * 0.7;
  gl_FragColor = vec4(c, 1.0);
}`;

// ------------------------------------------------------------------ living floors
const FLOOR_HEAD = /* glsl */ `
varying vec3 vWp;
uniform float uFT, uFStyle, uFAmt; uniform vec3 uFAcc; uniform vec4 uFPulse[3]; uniform vec3 uFPulseCol[3];
float fh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(fh(i), fh(i+vec2(1,0)), f.x), mix(fh(i+vec2(0,1)), fh(i+vec2(1,1)), f.x), f.y); }
float fWet = 0.0; vec2 fRip = vec2(0.0); vec3 fGlow = vec3(0.0);
`;
const FLOOR_SURF = /* glsl */ `
{
  vec2 wp = vWp.xz;
  float luma = dot(diffuseColor.rgb, vec3(0.3, 0.6, 0.1));
  if (uFStyle < 0.5) {
    // rooftop: cloud shadows drift across the pavers
    float sh = fn(wp * 0.07 + vec2(uFT * 0.05, uFT * 0.02)) * 0.6 + fn(wp * 0.17 - vec2(uFT * 0.03, 0.0)) * 0.4;
    diffuseColor.rgb *= mix(1.0, 0.7, smoothstep(0.5, 0.7, sh) * uFAmt);
  } else if (uFStyle < 1.5) {
    // metro: standing water. Dark glossy puddles, rain rings spreading across them
    float m = fn(wp * 0.22 + 3.7) * 0.65 + fn(wp * 0.6 + 9.1) * 0.35;
    fWet = smoothstep(0.4, 0.56, m) * uFAmt;
    vec2 cell = floor(wp / 2.6), lp = fract(wp / 2.6) - 0.5;
    float hsh = fh(cell);
    float ph = fract(uFT * (0.35 + hsh * 0.3) + hsh * 7.0);
    vec2 c0 = (vec2(fh(cell + 1.3), fh(cell + 5.9)) - 0.5) * 0.6;
    float dd = length(lp - c0) * 2.6, rr = ph * 1.15;
    float rq = (dd - rr) * 5.0;
    float ring = sin((dd - rr) * 22.0) * exp(-rq * rq) * (1.0 - ph) * step(0.4, hsh);
    fRip = normalize(lp - c0 + 1e-4) * ring * 0.5 * fWet;
    fRip += (vec2(fn(wp * 1.7 + uFT * 0.6), fn(wp * 1.7 - uFT * 0.5 + 4.0)) - 0.5) * 0.1 * fWet;
    diffuseColor.rgb *= mix(1.0, 0.4, fWet);
    roughnessFactor = mix(roughnessFactor, 0.05, fWet);
    fGlow = uFAcc * fWet * max(0.0, ring) * 0.05;
  } else if (uFStyle < 2.5) {
    // foundry: heat glows in the seams between the plates, hotter toward the molten channels
    vec2 g = abs(fract(wp / 4.0) - 0.5);
    float seam = smoothstep(0.468, 0.497, max(g.x, g.y));
    float heat = fn(wp * 0.25 + vec2(0.0, uFT * 0.12));
    float side = smoothstep(3.0, 13.0, abs(wp.y));
    fGlow = vec3(1.0, 0.3, 0.05) * seam * (0.13 + 1.5 * smoothstep(0.42, 0.8, heat)) * (0.45 + 1.2 * side) * uFAmt;
    fGlow += vec3(1.0, 0.3, 0.05) * side * side * 0.06 * uFAmt;
  } else if (uFStyle < 3.5) {
    // vault: packets of data run along the floor lines
    vec2 q = wp / 4.0, g = abs(fract(q) - 0.5);
    float lx = smoothstep(0.484, 0.499, g.x), lz = smoothstep(0.484, 0.499, g.y);
    float ix = floor(q.x + 0.5), iz = floor(q.y + 0.5);
    float px = smoothstep(0.85, 1.0, fract(wp.y * 0.06 * (fh(vec2(ix, 1.0)) > 0.5 ? 1.0 : -1.0) + uFT * (0.25 + 0.3 * fh(vec2(ix, 2.0))) + fh(vec2(ix, 3.0))));
    float pz = smoothstep(0.85, 1.0, fract(wp.x * 0.045 * (fh(vec2(iz, 4.0)) > 0.5 ? 1.0 : -1.0) + uFT * (0.2 + 0.3 * fh(vec2(iz, 5.0))) + fh(vec2(iz, 6.0))));
    fGlow = uFAcc * (lx * (0.14 + px * 1.8) + lz * (0.14 + pz * 1.8)) * uFAmt;
  } else {
    // reactor: the energy under the grate shows through its holes, in slow waves out from the core
    float hole = 1.0 - smoothstep(0.012, 0.05, luma);
    float w = 0.5 + 0.5 * sin(length(wp) * 0.55 - uFT * 1.6);
    float fl = fn(wp * 0.4 + uFT * 0.3);
    fGlow = mix(uFAcc, vec3(0.3, 0.9, 1.0), fl) * hole * (0.015 + 0.16 * w * w * w * w * w) * uFAmt;
  }
  // pulses of light that run out across the floor (a wave starting or ending, a PULSE, a streak)
  for (int i = 0; i < 3; i++) {
    vec4 P = uFPulse[i];
    if (P.w <= 0.0) continue;
    float d = length(wp - P.xy);
    float rq = (d - P.z) / 1.15;
    float ring = exp(-rq * rq);
    vec2 g = abs(fract(wp / 2.0) - 0.5);
    float grid = smoothstep(0.4, 0.5, max(g.x, g.y));
    fGlow += uFPulseCol[i] * ring * P.w * (0.3 + 0.7 * grid);
  }
}
`;
const FLOOR_NORMAL = /* glsl */ `
if (fWet > 0.0) normal = normalize(mix(normal, nonPerturbedNormal, fWet * 0.9) + (viewMatrix * vec4(fRip.x, 0.0, fRip.y, 0.0)).xyz);
`;
// U: { uFT, uFStyle, uFAmt, uFAcc, uFPulse, uFPulseCol } (shared uniform objects, updated by the renderer)
export function livingFloor(mat, U) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FLOOR_HEAD)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + FLOOR_SURF)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FLOOR_NORMAL)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += fGlow;');
  };
  mat.customProgramCacheKey = () => 'living-floor-1';
}
export function floorUniforms() {
  return {
    uFT: { value: 0 }, uFStyle: { value: 0 }, uFAmt: { value: 1 }, uFAcc: { value: new THREE.Color(1, 1, 1) },
    uFPulse: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
    uFPulseCol: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color()] },
  };
}

// ------------------------------------------------------------------ warp-ins
// Every group of machines arriving gets a column of light and a ring on the floor that closes as it lands.
// All of them are two instanced draws, however many arrive at once.
const WARP_VERT = /* glsl */ `
attribute vec3 aCol; attribute float aK; varying vec2 vUv; varying vec3 vCol; varying float vK;
void main(){ vUv = uv; vCol = aCol; vK = aK; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const BEAM_FRAG = /* glsl */ `
uniform float uTime; varying vec2 vUv; varying vec3 vCol; varying float vK;
void main(){
  float y = clamp(vUv.y, 0.0, 1.0);
  float band = 0.5 + 0.5 * sin(y * 30.0 - uTime * 16.0 + vUv.x * 12.566);
  float a = pow(1.0 - y, 1.7) * (0.3 + 0.7 * band) * (0.3 + 1.3 * vK) + pow(1.0 - y, 9.0) * 1.6 * vK;
  gl_FragColor = vec4(vCol * a, 1.0);
}`;
const RUNE_FRAG = /* glsl */ `
uniform float uTime; varying vec2 vUv; varying vec3 vCol; varying float vK;
void main(){
  vec2 p = vUv * 2.0 - 1.0; float r = length(p); if (r > 1.0) discard;
  float ang = atan(p.y, p.x) / 6.2831853;
  float outer = smoothstep(0.8, 0.86, r) * (1.0 - smoothstep(0.92, 0.99, r));
  float closing = smoothstep(0.045, 0.0, abs(r - (1.0 - vK) * 0.76));
  float ticks = step(0.5, fract(ang * 12.0 + uTime * 0.5)) * smoothstep(0.56, 0.6, r) * (1.0 - smoothstep(0.73, 0.77, r));
  float sweep = step(fract(ang - uTime * 0.7), vK) * outer;
  float fill = (1.0 - smoothstep(0.0, 0.9, r)) * vK * vK * 0.75;
  float a = outer * 0.35 + sweep * 0.9 + closing * 0.9 + ticks * (0.2 + 0.5 * vK) + fill;
  gl_FragColor = vec4(vCol * a, 1.0);
}`;
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color(), _up = new THREE.Vector3(0, 1, 0);
export class Warp {
  constructor(scene, max = 72) {
    this.max = max; this.n = 0;
    const mk = (geo, frag, order) => {
      geo.setAttribute('aCol', new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aK', new THREE.InstancedBufferAttribute(new Float32Array(max), 1).setUsage(THREE.DynamicDrawUsage));
      const mat = new THREE.ShaderMaterial({ vertexShader: WARP_VERT, fragmentShader: frag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uTime: { value: 0 } } });
      const I = new THREE.InstancedMesh(geo, mat, max);
      I.frustumCulled = false; I.count = 0; I.renderOrder = order; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(I);
      return I;
    };
    const cg = new THREE.CylinderGeometry(1, 0.55, 1, 20, 1, true); cg.translate(0, 0.5, 0);
    const pg = new THREE.PlaneGeometry(2, 2); pg.rotateX(-Math.PI / 2);
    this.beam = mk(cg, BEAM_FRAG, 5);
    this.rune = mk(pg, RUNE_FRAG, 4);
  }
  begin() { this.n = 0; }
  add(x, z, size, color, prog) {
    const i = this.n; if (i >= this.max) return;
    _c.set(color);
    for (const I of [this.beam, this.rune]) { const g = I.geometry; g.attributes.aCol.setXYZ(i, _c.r, _c.g, _c.b); g.attributes.aK.setX(i, prog); }
    this.beam.setMatrixAt(i, _m.compose(_p.set(x, 0, z), _q.identity(), _s.set(size * 0.62, 2.2 + prog * 5.5, size * 0.62)));
    this.rune.setMatrixAt(i, _m.compose(_p.set(x, 0.035, z), _q.identity(), _s.set(size, 1, size)));
    this.n++;
  }
  end(t) {
    for (const I of [this.beam, this.rune]) {
      I.count = this.n; I.material.uniforms.uTime.value = t;
      if (!this.n) continue;
      I.instanceMatrix.needsUpdate = true; I.geometry.attributes.aCol.needsUpdate = true; I.geometry.attributes.aK.needsUpdate = true;
    }
  }
  warm(on) { if (on) { this.begin(); this.add(0, 0, 1, 0xffffff, 0.5); this.end(0); } else { this.begin(); this.end(0); } }
}

// ------------------------------------------------------------------ shot trails
// a soft streak behind every shot, lying flat at the shot's height: one instanced draw
function streakTex() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 32;
  const g = c.getContext('2d'), im = g.createImageData(128, 32);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 128; x++) {
    const u = x / 127, v = Math.abs(y / 31 - 0.5) * 2;
    const a = Math.pow(u, 1.8) * Math.pow(Math.max(0, 1 - v), 2.2) * (1 - Math.pow(u, 14) * 0.4);
    const i = (y * 128 + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = Math.round(255 * a);
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export class Trails {
  constructor(scene, max = 700) {
    this.max = max; this.n = 0;
    const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2); g.translate(-0.5, 0, 0);   // the head is at the origin, the tail runs back along -x
    this.I = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ map: streakTex(), color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }), max);
    this.I.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    this.I.frustumCulled = false; this.I.count = 0; this.I.renderOrder = 3; this.I.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.I);
  }
  begin() { this.n = 0; }
  // angle in the XZ plane (atan2(vz, vx)), length and width in metres, colour as linear r,g,b (HDR allowed)
  add(x, y, z, ang, len, wid, r, g, b) {
    const i = this.n; if (i >= this.max) return;
    this.I.setMatrixAt(i, _m.compose(_p.set(x, y, z), _q.setFromAxisAngle(_up, -ang), _s.set(len, 1, wid)));
    this.I.instanceColor.setXYZ(i, r, g, b);
    this.n++;
  }
  end() { this.I.count = this.n; if (this.n) { this.I.instanceMatrix.needsUpdate = true; this.I.instanceColor.needsUpdate = true; } }
  warm(on) { this.begin(); if (on) this.add(0, 1, 0, 0, 1, 1, 1, 1, 1); this.end(); }
}

// ------------------------------------------------------------------ air traffic
// small craft crossing the sky on long loops, each with a white nose light and a red tail light
export class Traffic {
  constructor(group, n, glowMat, tailMat, bodyMat, rand) {
    this.n = n; this.list = [];
    const body = new THREE.BoxGeometry(2.6, 0.5, 1.0), dot = new THREE.SphereGeometry(0.22, 8, 6);
    this.body = new THREE.InstancedMesh(body, bodyMat, n);
    this.nose = new THREE.InstancedMesh(dot, glowMat, n);
    this.tail = new THREE.InstancedMesh(dot, tailMat, n);
    for (const I of [this.body, this.nose, this.tail]) { I.frustumCulled = false; I.instanceMatrix.setUsage(THREE.DynamicDrawUsage); group.add(I); }
    for (let k = 0; k < n; k++) {
      const lane = k % 3;
      this.list.push({ a: rand() * 6.283, rx: 58 + lane * 22 + rand() * 10, rz: 44 + lane * 18 + rand() * 8, y: 7 + lane * 9 + rand() * 6, w: (0.05 + rand() * 0.05) * (k % 2 ? 1 : -1), ph: rand() * 6.283 });
    }
  }
  update(t) {
    this.list.forEach((c, k) => {
      const a = c.a + t * c.w, x = Math.cos(a) * c.rx, z = Math.sin(a) * c.rz, y = c.y + Math.sin(t * 0.4 + c.ph) * 0.8;
      const dx = -Math.sin(a) * c.rx * Math.sign(c.w), dz = Math.cos(a) * c.rz * Math.sign(c.w), ang = Math.atan2(dz, dx);
      _q.setFromAxisAngle(_up, -ang);
      this.body.setMatrixAt(k, _m.compose(_p.set(x, y, z), _q, _s.set(1, 1, 1)));
      const l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l;
      this.nose.setMatrixAt(k, _m.compose(_p.set(x + ux * 1.4, y, z + uz * 1.4), _q, _s.set(1, 1, 1)));
      this.tail.setMatrixAt(k, _m.compose(_p.set(x - ux * 1.4, y + 0.1, z - uz * 1.4), _q, _s.set(0.8, 0.8, 0.8)));
    });
    for (const I of [this.body, this.nose, this.tail]) I.instanceMatrix.needsUpdate = true;
  }
}

// ------------------------------------------------------------------ foliage
// a lumpy crown for trees and shrubs: a subdivided icosahedron pushed in and out by a few sine lobes, with
// darker undersides baked into vertex colours
export function crownGeometry(seed = 1, detail = 2) {
  const g = new THREE.IcosahedronGeometry(1, detail), p = g.attributes.position, col = new Float32Array(p.count * 3);
  const s1 = seed * 1.7, s2 = seed * 2.9;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + 0.16 * Math.sin(x * 4.1 + s1) * Math.cos(z * 3.7 + s2) + 0.12 * Math.sin(y * 5.3 + s2) + 0.07 * Math.sin((x + z) * 9.0 + s1);
    p.setXYZ(i, x * k, y * k * 0.92, z * k);
    const lit = 0.55 + 0.45 * Math.max(0, y) + 0.12 * Math.sin(x * 7 + z * 5 + s1);
    col[i * 3] = lit * 0.92; col[i * 3 + 1] = lit; col[i * 3 + 2] = lit * 0.8;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));   // (the sphere's own normals are kept: smooth shading)
  return g;
}

// ------------------------------------------------------------------ scenery textures
// a neon sign: glowing text on a clear background
export function signTex(text, color = '#3ff0c8', sub = '') {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `900 ${sub ? 62 : 78}px "Arial Narrow", "Segoe UI", system-ui, sans-serif`;
  g.shadowColor = color; g.shadowBlur = 18; g.fillStyle = color;
  for (let k = 0; k < 2; k++) g.fillText(text, 256, sub ? 50 : 66, 488);
  g.shadowBlur = 0; g.fillStyle = '#ffffff'; g.globalAlpha = 0.85; g.fillText(text, 256, sub ? 50 : 66, 488);
  if (sub) { g.globalAlpha = 0.9; g.font = '600 26px "Segoe UI", system-ui, sans-serif'; g.fillStyle = color; g.fillText(sub, 256, 104, 488); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
// a tiling normal map of small waves for standing water
export function waterNormal(size = 256) {
  const S = size, H = new Float32Array(S * S);
  let s = 1234567;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  // a sum of wrapped sine waves in random directions: tiles exactly
  const waves = [];
  for (let k = 0; k < 14; k++) waves.push({ fx: Math.round((rnd() - 0.5) * 16), fy: Math.round((rnd() - 0.5) * 16), ph: rnd() * 6.283, a: 0.4 + rnd() * 0.6 });
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let h = 0;
    for (const w of waves) h += Math.sin(((x * w.fx + y * w.fy) / S) * 6.283185 + w.ph) * w.a / (1 + Math.hypot(w.fx, w.fy) * 0.25);
    H[y * S + x] = h;
  }
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'), im = g.createImageData(S, S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = H[y * S + ((x + 1) % S)] - H[y * S + ((x + S - 1) % S)], dy = H[((y + 1) % S) * S + x] - H[((y + S - 1) % S) * S + x];
    let nx = -dx * 1.4, ny = -dy * 1.4, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const i = (y * S + x) * 4; im.data[i] = (nx * 0.5 + 0.5) * 255; im.data[i + 1] = (ny * 0.5 + 0.5) * 255; im.data[i + 2] = (nz * 0.5 + 0.5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
// a jagged bolt of lightning from (0, h, 0) down to the ground, as a thin ribbon
export function boltGeometry(h = 120, seed = 1) {
  let s = seed * 9973 + 17;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const n = 16, pos = [], idx = [];
  let x = 0, z = 0;
  for (let i = 0; i <= n; i++) {
    const y = h * (1 - i / n), w = 0.5 + (1 - i / n) * 0.5;
    if (i) { x += (rnd() - 0.5) * h * 0.09; z += (rnd() - 0.5) * h * 0.05; }
    pos.push(x - w, y, z, x + w, y, z);
    if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  return g;
}
