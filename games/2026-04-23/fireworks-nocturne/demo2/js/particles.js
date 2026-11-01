// GPU firework particles. Each launch or break becomes a group: one interleaved
// instance buffer of star records drawn twice, as screen-space ribbons (the
// star's own light smeared over the eye's persistence, or a camera exposure)
// and as points (the sparks each star sheds along its path).
import * as THREE from 'three';
import { HASH, MOTION, BLACKBODY } from './glsl.js?v=5';

export const STRIDE = 32; // floats per star record (8 x vec4)

// Star kinds
export const K_STAR = 0, K_CRACKLE = 1, K_FLASH = 2, K_FUSE = 3, K_GERB = 4;
// Tail kinds
export const T_NONE = 0, T_GOLD = 1, T_SILVER = 2, T_GLITTER = 3, T_COLOR = 4, T_KAMURO = 5, T_STROBE = 6, T_FALL = 7;

const NEVER = 1e6;

export function writeStar(a, i, s) {
  const o = i * STRIDE;
  const p = s.p0, v = s.v0, ca = s.colA, cb = s.colB || s.colA;
  a[o] = p[0]; a[o + 1] = p[1]; a[o + 2] = p[2]; a[o + 3] = s.t0;
  a[o + 4] = v[0]; a[o + 5] = v[1]; a[o + 6] = v[2]; a[o + 7] = s.c ?? 0.03;
  a[o + 8] = ca[0]; a[o + 9] = ca[1]; a[o + 10] = ca[2]; a[o + 11] = s.life;
  a[o + 12] = cb[0]; a[o + 13] = cb[1]; a[o + 14] = cb[2]; a[o + 15] = s.tChange ?? NEVER;
  a[o + 16] = s.kg ?? 0.8; a[o + 17] = s.strobe ?? 0; a[o + 18] = s.glowR ?? 0.5; a[o + 19] = s.seed ?? Math.random();
  a[o + 20] = s.kind ?? K_STAR; a[o + 21] = s.popT ?? NEVER; a[o + 22] = s.flicker ?? 0.15; a[o + 23] = s.head ?? 1;
  const t = s.tail;
  if (t) {
    a[o + 24] = t.rate; a[o + 25] = t.life; a[o + 26] = t.eject ?? 2; a[o + 27] = t.inherit ?? 0.25;
    a[o + 28] = t.ks ?? 3; a[o + 29] = t.kind; a[o + 30] = t.power ?? 0.2; a[o + 31] = t.delay ?? 0;
  } else {
    a[o + 24] = 0; a[o + 25] = 0; a[o + 26] = 0; a[o + 27] = 0;
    a[o + 28] = 1; a[o + 29] = T_NONE; a[o + 30] = 0; a[o + 31] = 0;
  }
}

// How long a record can still put light on screen after its own birth.
export function recordSpan(s, trailMax) {
  const end = s.kind === K_CRACKLE ? s.popT + 0.1 : s.life;
  const tail = s.tail ? s.tail.life * 1.45 : 0;
  return end + tail + trailMax;
}

const STAR_ATTRS = ['iP', 'iV', 'iA', 'iB', 'iF', 'iG', 'iT', 'iU'];

const STAR_COMMON = /* glsl */ `
attribute vec4 iP; attribute vec4 iV; attribute vec4 iA; attribute vec4 iB;
attribute vec4 iF; attribute vec4 iG; attribute vec4 iT; attribute vec4 iU;
uniform float uTime;
uniform float uFocal;
uniform vec2 uRes;
uniform float uGain;
${HASH}
${MOTION}
${BLACKBODY}
float endTime() { return iG.x == 1.0 ? iG.y + 0.05 : iA.w; }
`;

const RIBBON_VS = /* glsl */ `
${STAR_COMMON}
uniform float uTrail;
uniform float uM;
uniform float uLong;
varying vec3 vCol;
varying vec2 vUV;

float bright(float ts, float life) {
  float kind = iG.x;
  if (ts < 0.0 || ts > endTime()) return 0.0;
  if (kind == 2.0) return exp(-ts / max(life * 0.28, 0.004));
  if (kind == 1.0) {
    if (ts < iG.y) return 0.035;
    return 35.0 * exp(-(ts - iG.y) / 0.011);
  }
  float x = ts / life;
  float b;
  if (kind == 3.0) b = 0.6 + 0.4 * h1f(iF.w, floor(ts * 30.0));
  else if (kind == 4.0) b = smoothstep(0.0, 0.6, ts) * (1.0 - smoothstep(0.92, 1.0, x)) * (0.75 + 0.5 * h1f(iF.w, floor(ts * 22.0)));
  else {
    b = smoothstep(0.0, 0.07, ts) * (1.0 - smoothstep(0.72, 1.0, x)) * (1.08 - 0.25 * x);
    // burning stars wobble a little and sputter as they die
    float fl = h1f(iF.w, floor(ts * 26.0)) - 0.5;
    b *= 1.0 + iG.z * fl * (1.0 + 2.5 * smoothstep(0.6, 1.0, x));
    b *= 1.0 + 1.8 * exp(-ts * 14.0); // ignition flare
  }
  if (iF.y > 0.0) b *= step(fract(ts * iF.y + iF.w * 13.0), 0.3) * 3.2;
  return b;
}

void main() {
  float age = uTime - iP.w;
  float life = iA.w;
  float endT = endTime();
  float trail = uTrail;
  if (iG.x == 2.0) trail = min(trail, 0.02);
  if (age < 0.0 || age - trail > endT || iG.w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec3(0.0); return; }
  float f = position.x / uM;
  float side = position.y;
  float ts = age - f * trail;
  float tc = clamp(ts, 0.0, endT);
  vec3 p = iP.xyz, ph = iP.xyz, pt = iP.xyz;
  if (iG.x != 4.0) {
    p = starPos(iP.xyz, iV.xyz, iV.w, iF.x, tc);
    ph = starPos(iP.xyz, iV.xyz, iV.w, iF.x, min(age, endT));
    pt = starPos(iP.xyz, iV.xyz, iV.w, iF.x, clamp(age - trail, 0.0, endT));
  }
  mat4 vp = projectionMatrix * viewMatrix;
  vec4 cp = vp * vec4(p, 1.0);
  vec4 ch = vp * vec4(ph, 1.0);
  vec4 ct = vp * vec4(pt, 1.0);
  if (ch.w < 1.0 || ct.w < 1.0 || cp.w < 1.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec3(0.0); return; }
  vec2 sh = ch.xy / ch.w * 0.5 * uRes;
  vec2 st = ct.xy / ct.w * 0.5 * uRes;
  vec2 dir = sh - st;
  float L = length(dir);
  dir = L > 1e-3 ? dir / L : vec2(1.0, 0.0);
  float dist = cp.w;
  float rpx = iF.z * uFocal / dist;
  float w = max(2.0 * rpx, 1.7);
  float wgt = uLong > 0.5 ? 1.0 : 3.16 * exp(-3.0 * f);
  float E = uFocal * uFocal / (dist * dist) * trail;
  float I = E * wgt / (w * max(L, w)) * uGain * iG.w;
  vec2 perp = vec2(-dir.y, dir.x);
  vec2 off = perp * side * w * 0.5;
  float endx = 0.0;
  if (position.x < 0.5) { off += dir * w * 0.5; endx = 1.0; }
  if (position.x > uM - 0.5) { off -= dir * w * 0.5; endx = -1.0; }
  cp.xy += off / (0.5 * uRes) * cp.w;
  gl_Position = cp;
  vec3 col = mix(iA.rgb, iB.rgb, smoothstep(iB.w - 0.05, iB.w + 0.05, tc));
  if (iG.x == 1.0 && ts >= iG.y) col = vec3(1.0, 0.92, 0.75);
  vCol = col * (bright(ts, life) * I);
  vUV = vec2(side, endx);
}
`;

const RIBBON_FS = /* glsl */ `
varying vec3 vCol;
varying vec2 vUV;
void main() {
  float a = exp(-vUV.x * vUV.x * 2.4) * exp(-vUV.y * vUV.y * 1.2);
  gl_FragColor = vec4(vCol * a, 1.0);
}
`;

const SPARK_VS = /* glsl */ `
${STAR_COMMON}
uniform float uRateScale;
varying vec3 vCol;
void cull() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vCol = vec3(0.0); }
void main() {
  float rate = iT.x * uRateScale;
  if (rate <= 0.0) { cull(); return; }
  float age = uTime - iP.w;
  float n = floor(age * rate) - position.x;
  float tb = (n + h1f(iF.w, n)) / rate;
  float tEnd = iG.x == 1.0 ? iG.y : iA.w;
  if (n < 0.0 || tb < iU.w || tb > tEnd) { cull(); return; }
  float a = age - tb;
  vec3 r = h3f(iF.w + 0.371, n);
  float slife = iT.y * (0.55 + 0.9 * r.x);
  if (a < 0.0 || a > slife) { cull(); return; }
  vec3 pb = iP.xyz, vb = vec3(0.0);
  if (iG.x != 4.0) {
    pb = starPos(iP.xyz, iV.xyz, iV.w, iF.x, tb);
    vb = starVel(iP.xyz, iV.xyz, iV.w, iF.x, tb);
  }
  vec3 r2 = h3f(iF.w + 0.719, n);
  vec3 ej = sphereDir(r2) * iT.z * (0.25 + 0.75 * r.y);
  float kind = iU.y;
  if (iG.x == 4.0) ej = normalize(vec3(ej.x, -abs(ej.y) - iT.z * 0.6, ej.z)) * length(ej);
  vec3 p = sparkPos(pb, vb * iT.w + ej, iU.x, a);
  if (p.y < 0.15) { cull(); return; }
  float x = a / slife;
  vec3 col; float b;
  if (kind == 1.0) { // charcoal: cools from ~2100 K
    float k = mix(2150.0, 1150.0, pow(x, 0.7));
    col = blackbody(k);
    b = pow(1.0 - x, 1.4) * pow(k / 2150.0, 3.0) * (0.7 + 0.6 * h1f(iF.w + r.z, floor(a * 25.0)));
  } else if (kind == 2.0) { // titanium: white, short, fierce
    col = mix(vec3(1.0, 0.97, 0.92), blackbody(2600.0), x);
    b = pow(1.0 - x, 2.2) * 2.2;
  } else if (kind == 3.0) { // glitter: dark, then a spritz of light
    float d = (0.2 + 0.65 * r.z) * slife;
    col = mix(vec3(1.0, 0.93, 0.78), blackbody(2400.0), 0.4);
    b = a < d ? 0.04 : (exp(-(a - d) / 0.035) * 9.0 + 0.04);
  } else if (kind == 4.0) { // shed in the star's own colour
    col = mix(iA.rgb, iB.rgb, smoothstep(iB.w - 0.05, iB.w + 0.05, tb)) / max(max(iA.r, max(iA.g, iA.b)), 1e-3);
    b = pow(1.0 - x, 1.8);
  } else if (kind == 5.0) { // kamuro / brocade: dense gold with silver twinkle
    float k = mix(2450.0, 1350.0, pow(x, 0.8));
    float tw = step(0.72, h1f(iF.w + r.z * 7.0, floor(a * 16.0)));
    col = mix(blackbody(k), vec3(1.0, 0.95, 0.85), tw * 0.7);
    b = pow(1.0 - x, 1.1) * (0.55 + 1.6 * tw);
  } else if (kind == 7.0) { // waterfall: burns most of the way down
    col = mix(vec3(1.0, 0.95, 0.86), blackbody(1900.0), smoothstep(0.25, 1.0, x));
    if (iA.r > iA.b * 1.6) col *= vec3(1.0, 0.72, 0.42);
    b = (1.0 - x * x * x) * (0.55 + 0.9 * h1f(iF.w + r.z, floor(a * 18.0)));
  } else { // strobing tail
    col = vec3(1.0, 0.98, 0.95);
    b = step(0.75, h1f(iF.w + r.z, floor(a * 14.0))) * 4.0 * (1.0 - x);
  }
  vec4 cp = projectionMatrix * viewMatrix * vec4(p, 1.0);
  if (cp.w < 1.0) { cull(); return; }
  float dist = cp.w;
  float spx = max(0.32 * uFocal / dist, 1.6);
  float I = iU.z * b * uFocal * uFocal / (dist * dist) * 0.08 / (spx * spx) * uGain;
  gl_Position = cp;
  gl_PointSize = spx * 1.6;
  vCol = col * I;
}
`;

const SPARK_FS = /* glsl */ `
varying vec3 vCol;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float a = exp(-dot(q, q) * 4.2);
  gl_FragColor = vec4(vCol * a * 2.2, 1.0);
}
`;

function ribbonBase(M) {
  const pos = new Float32Array((M + 1) * 2 * 3);
  const idx = [];
  for (let j = 0; j <= M; j++) {
    pos.set([j, -1, 0], (j * 2) * 3);
    pos.set([j, 1, 0], (j * 2 + 1) * 3);
    if (j < M) {
      const a = j * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, b, c, b, d, c);
    }
  }
  return { position: new THREE.BufferAttribute(pos, 3), index: new THREE.BufferAttribute(new Uint16Array(idx), 1), M };
}

export class Particles {
  constructor(tier) {
    this.tier = tier;
    this.scene = new THREE.Scene();
    this.groups = [];
    this.uniforms = {
      uTime: { value: 0 },
      uFocal: { value: 1000 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uGain: { value: 1 },
      uWind: { value: new THREE.Vector3(2, 0, -0.5) },
      uTrail: { value: 0.085 },
      uM: { value: 6 },
      uLong: { value: 0 },
      uRateScale: { value: 1 },
    };
    this.baseShort = ribbonBase(6);
    this.baseLong = ribbonBase(48);
    this.base = this.baseShort;
    const K = tier.sparkK;
    const sp = new Float32Array(K * 3);
    for (let k = 0; k < K; k++) sp[k * 3] = k;
    this.sparkBase = new THREE.BufferAttribute(sp, 3);
    const additive = {
      transparent: true, depthWrite: false, depthTest: true,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation,
    };
    this.ribbonMat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: RIBBON_VS, fragmentShader: RIBBON_FS, ...additive });
    this.sparkMat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: SPARK_VS, fragmentShader: SPARK_FS, ...additive });
    this.liveStars = 0;
  }

  // Add a finished batch of star records (Float32Array, count) living until tEnd.
  add(data, count, tEnd, hasTails) {
    if (!count) return;
    const buf = new THREE.InstancedInterleavedBuffer(data.subarray(0, count * STRIDE), STRIDE, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.setIndex(this.base.index);
    geo.setAttribute('position', this.base.position);
    STAR_ATTRS.forEach((n, i) => geo.setAttribute(n, new THREE.InterleavedBufferAttribute(buf, 4, i * 4)));
    geo.instanceCount = count;
    const ribbons = new THREE.Mesh(geo, this.ribbonMat);
    ribbons.frustumCulled = false;
    this.scene.add(ribbons);
    let sparks = null;
    if (hasTails) {
      const sg = new THREE.InstancedBufferGeometry();
      sg.setAttribute('position', this.sparkBase);
      STAR_ATTRS.forEach((n, i) => sg.setAttribute(n, new THREE.InterleavedBufferAttribute(buf, 4, i * 4)));
      sg.instanceCount = count;
      sparks = new THREE.Points(sg, this.sparkMat);
      sparks.frustumCulled = false;
      this.scene.add(sparks);
    }
    this.groups.push({ ribbons, sparks, tEnd, count });
    this.liveStars += count;
  }

  setLongExposure(on) {
    const base = on ? this.baseLong : this.baseShort;
    if (base === this.base) return;
    this.base = base;
    this.uniforms.uM.value = base.M;
    this.uniforms.uLong.value = on ? 1 : 0;
    for (const g of this.groups) {
      g.ribbons.geometry.setIndex(base.index);
      g.ribbons.geometry.setAttribute('position', base.position);
    }
  }

  update(time) {
    this.uniforms.uTime.value = time;
    let live = 0;
    for (let i = this.groups.length - 1; i >= 0; i--) {
      const g = this.groups[i];
      if (time > g.tEnd) {
        this.scene.remove(g.ribbons);
        g.ribbons.geometry.dispose();
        if (g.sparks) { this.scene.remove(g.sparks); g.sparks.geometry.dispose(); }
        this.groups.splice(i, 1);
      } else live += g.count;
    }
    this.liveStars = live;
  }

  setSparksVisible(on) {
    for (const g of this.groups) if (g.sparks) g.sparks.visible = on;
  }

  clear() {
    for (const g of this.groups) g.tEnd = -1;
    this.update(this.uniforms.uTime.value);
  }
}

// Collects star records for one group.
export class StarBatch {
  constructor(cap = 256) {
    this.data = new Float32Array(cap * STRIDE);
    this.n = 0;
    this.span = 0;
    this.t0min = Infinity;
    this.tails = false;
  }
  push(s, trailMax = 2.2) {
    if ((this.n + 1) * STRIDE > this.data.length) {
      const d = new Float32Array(this.data.length * 2);
      d.set(this.data);
      this.data = d;
    }
    writeStar(this.data, this.n++, s);
    this.span = Math.max(this.span, s.t0 + recordSpan(s, trailMax));
    this.t0min = Math.min(this.t0min, s.t0);
    if (s.tail && s.tail.rate > 0) this.tails = true;
  }
  commit(particles) {
    particles.add(this.data, this.n, this.span + 0.25, this.tails);
    const g = particles.groups[particles.groups.length - 1];
    if (g) g.tStart = this.t0min - 0.5;
  }
}
