// The harbour at night: sky, water, skyline, bridge, barges, boats, the far
// quay and its Ferris wheel, and the terrace you watch from.
import * as THREE from 'three';
import { HASH, LIGHTS, NOISE } from './glsl.js?v=7';
import { SITE } from './site.js?v=7';
import { rng } from './physics.js?v=7';

const FOG = /* glsl */ `
uniform vec3 uFogCol;
vec3 fogged(vec3 c, float dist) {
  float T = exp(-dist * 1.15e-4);
  return c * T + uFogCol * (1.0 - T);
}
`;

// ---------------------------------------------------------------- geometry
class Builder {
  constructor() { this.p = []; this.n = []; this.c = []; this.i = []; }
  // Box from centre c with unit axes ex, ey, ez and half sizes h.
  box(c, ex, ey, ez, h, col = [1, 1, 1]) {
    const faces = [[ex, ey, ez], [ex.map(v => -v), ey, ez.map(v => -v)], [ez.map(v => -v), ey, ex], [ez, ey, ex.map(v => -v)], [ex, ez.map(v => -v), ey], [ex, ez, ey.map(v => -v)]];
    const hs = [[h[0], h[1], h[2]], [h[0], h[1], h[2]], [h[2], h[1], h[0]], [h[2], h[1], h[0]], [h[0], h[2], h[1]], [h[0], h[2], h[1]]];
    faces.forEach(([a, b, nrm], fi) => {
      const [ha, hb, hn] = hs[fi];
      const base = this.p.length / 3;
      for (const [sa, sb] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        this.p.push(c[0] + a[0] * ha * sa + b[0] * hb * sb + nrm[0] * hn, c[1] + a[1] * ha * sa + b[1] * hb * sb + nrm[1] * hn, c[2] + a[2] * ha * sa + b[2] * hb * sb + nrm[2] * hn);
        this.n.push(nrm[0], nrm[1], nrm[2]);
        this.c.push(col[0], col[1], col[2]);
      }
      this.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
    });
  }
  aabox(x0, y0, z0, x1, y1, z1, col) {
    this.box([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [1, 0, 0], [0, 1, 0], [0, 0, 1], [(x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2], col);
  }
  // Segment from a to b with square section.
  beam(a, b, t, col) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const L = Math.hypot(...d);
    const ey = d.map(v => v / L);
    let ex = Math.abs(ey[1]) < 0.9 ? cross(ey, [0, 1, 0]) : cross(ey, [1, 0, 0]);
    ex = norm(ex);
    const ez = cross(ex, ey);
    this.box([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], ex, ey, ez, [t / 2, L / 2, t / 2], col);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i);
    return g;
  }
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a); return a.map(v => v / l); };

// ---------------------------------------------------------------- sprites
// Point lights seen as glows: lamps, beacons, cable lights, nav lights.
const SPRITE_VS = /* glsl */ `
attribute vec4 iPos; attribute vec4 iCol; attribute vec4 iBl;
uniform float uTime; uniform float uFocal; uniform vec2 uRes; uniform float uGain;
uniform float uWheel; uniform vec3 uWheelC; uniform float uWheelA;
varying vec3 vCol; varying vec2 vUV;
vec3 hue(float h) { return clamp(abs(fract(h + vec3(0.0, 0.6667, 0.3333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0); }
void main() {
  vec3 p = iPos.xyz;
  vec3 col = iCol.rgb * iCol.a;
  if (uWheel > 0.5) {
    float a = iBl.z * 6.2831853 + uWheelA;
    float r = iBl.y;
    p = uWheelC + vec3(cos(a) * r, sin(a) * r, 0.0);
    float pat = fract(iBl.z * 3.0 - uTime * 0.07);
    col = mix(hue(iBl.z + uTime * 0.05), vec3(1.0, 0.95, 0.85), step(0.86, fract(iBl.z * 24.0 + uTime * 0.6))) * iCol.a;
  }
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float d = -mv.z;
  if (d < 0.3) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec3(0.0); return; }
  float rpx = iPos.w * uFocal / d;
  float px = max(rpx, iBl.w);
  float on = 1.0;
  if (uWheel < 0.5 && iBl.x > 0.0) {
    float ph = fract(uTime * iBl.x + iBl.z);
    on = smoothstep(0.0, 0.04, ph) * (1.0 - smoothstep(iBl.y, iBl.y + 0.06, ph));
  }
  vec4 cp = projectionMatrix * mv;
  cp.xy += position.xy * px * 3.0 / (0.5 * uRes) * cp.w;
  gl_Position = cp;
  float T = exp(-d * 0.9e-4);
  vCol = col * (rpx * rpx / (px * px)) * on * uGain * T;
  vUV = position.xy * 3.0;
}
`;
const SPRITE_FS = /* glsl */ `
varying vec3 vCol; varying vec2 vUV;
void main() {
  float r2 = dot(vUV, vUV);
  // fade to nothing inside the quad so a bright, close lamp stays round
  float win = 1.0 - smoothstep(4.0, 9.0, r2);
  gl_FragColor = vec4(vCol * (exp(-r2 * 1.1) + 0.02 * exp(-r2 * 0.12)) * win, 1.0);
}
`;

export class Sprites {
  constructor(shared, wheel = null) {
    this.d = [];
    this.shared = shared;
    this.wheel = wheel;
  }
  // pos, radius m, colour (linear, times intensity), blink {f, duty, phase}, min px
  add(p, r, col, blink, minPx = 1.3) {
    const b = blink || { f: 0, duty: 1, phase: 0 };
    this.d.push(p[0], p[1], p[2], r, col[0], col[1], col[2], col[3] ?? 1, b.f, b.duty, b.phase, minPx);
  }
  mesh() {
    const n = this.d.length / 12;
    const buf = new THREE.InstancedInterleavedBuffer(new Float32Array(this.d), 12, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
    g.setAttribute('iPos', new THREE.InterleavedBufferAttribute(buf, 4, 0));
    g.setAttribute('iCol', new THREE.InterleavedBufferAttribute(buf, 4, 4));
    g.setAttribute('iBl', new THREE.InterleavedBufferAttribute(buf, 4, 8));
    g.instanceCount = n;
    const u = { ...this.shared, uWheel: { value: this.wheel ? 1 : 0 }, uWheelC: { value: new THREE.Vector3() }, uWheelA: { value: 0 } };
    if (this.wheel) u.uWheelC.value.set(this.wheel.x, this.wheel.hub, this.wheel.z);
    const m = new THREE.ShaderMaterial({
      uniforms: u, vertexShader: SPRITE_VS, fragmentShader: SPRITE_FS,
      transparent: true, depthWrite: false, depthTest: true,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    mesh.renderOrder = 5;
    return mesh;
  }
}

// ---------------------------------------------------------------- shaders
const SKY_VS = /* glsl */ `
varying vec2 vNdc;
void main() { vNdc = position.xy; gl_Position = vec4(position.xy, 0.99999, 1.0); }
`;
const SKY_FS = /* glsl */ `
uniform mat4 uInvVP;
uniform float uTime;
uniform int uOct;
uniform vec3 uCloudGlow;
uniform float uClouds;
${HASH}
${NOISE}
${LIGHTS}
varying vec2 vNdc;
vec2 oct(vec3 d) {
  d /= abs(d.x) + abs(d.y) + abs(d.z);
  vec2 o = d.y >= 0.0 ? d.xz : (1.0 - abs(d.zx)) * sign(d.xz);
  return o;
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= uOct) break;
    s += a * vnoise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 17.3;
    a *= 0.5;
  }
  return s;
}
void main() {
  vec4 w = uInvVP * vec4(vNdc, 1.0, 1.0);
  vec3 dir = normalize(w.xyz / w.w - cameraPosition);
  float el = dir.y;
  float toCity = smoothstep(0.1, -0.9, dir.z);
  vec3 zen = vec3(0.00045, 0.0007, 0.0019);
  vec3 hor = vec3(0.0042, 0.0038, 0.0048);
  vec3 col = mix(hor, zen, smoothstep(-0.02, 0.55, el));
  // sodium and LED light pollution over the city
  col += vec3(0.017, 0.0098, 0.0052) * exp(-max(el, 0.0) / 0.07) * (0.25 + 0.75 * toCity);
  col += vec3(0.0045, 0.0034, 0.0028) * exp(-max(el, 0.0) / 0.2) * toCity;
  // a few stars where the glow allows
  if (el > 0.0) {
    vec2 o = oct(dir) * 520.0;
    vec2 cell = floor(o);
    vec2 f = fract(o);
    float h = h1(uint(int(cell.x) + 70000) * 0x9E3779B9u ^ uint(int(cell.y) + 70000) * 0x85EBCA6Bu);
    if (h > 0.93) {
      vec2 c = vec2(h1(uint(int(cell.x * 7.0 + 3.0)) ^ uint(int(cell.y) * 31 + 5)), fract(h * 91.7));
      float px = max(fwidth(o.x), 1e-4);
      float d = length(f - (0.2 + 0.6 * c)) / max(px * 1.1, 0.06);
      float mag = pow((h - 0.93) / 0.07, 6.0);
      float tw = 0.75 + 0.25 * sin(uTime * (2.0 + 4.0 * c.x) + h * 50.0);
      col += vec3(0.85, 0.9, 1.0) * exp(-d * d) * mag * 0.09 * tw * smoothstep(0.02, 0.3, el) * (1.0 - 0.6 * toCity);
    }
  }
  // thin cloud deck catching the city glow and the bursts
  if (el > 0.012 && uClouds > 0.0) {
    float H = 1250.0;
    float t = (H - cameraPosition.y) / el;
    vec3 P = cameraPosition + dir * t;
    vec2 q = P.xz / 1900.0 + vec2(uTime * 0.0021, uTime * 0.0006);
    float n = fbm(q);
    float cov = min(1.0, smoothstep(0.5 - 0.08 * max(uClouds - 1.0, 0.0), 0.85, n) * uClouds);
    float cityUnder = exp(-length(P.xz - vec2(-200.0, -2600.0)) / 3200.0);
    vec3 cc = uCloudGlow * (0.35 + 1.6 * cityUnder) * (0.7 + 0.6 * n);
    cc += lightAt(P) * 0.55 * (0.6 + 0.8 * n);
    float fade = exp(-t / 14000.0) * smoothstep(0.012, 0.08, el);
    col = mix(col, cc, cov * fade * 0.85);
  }
  col += inscatter(cameraPosition, dir, 12000.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

const WATER_VS = /* glsl */ `
varying vec3 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;
const WATER_FS = /* glsl */ `
uniform sampler2D uRefl;
uniform mat4 uReflVP;
uniform sampler2D uWaveN;
uniform float uTime;
uniform float uDistort;
${LIGHTS}
${FOG}
varying vec3 vW;
vec2 nrm(vec2 uv) { return texture2D(uWaveN, uv).xy * 2.0 - 1.0; }
void main() {
  vec3 toC = cameraPosition - vW;
  float dist = length(toC);
  vec3 V = toC / dist;
  vec2 w1 = vW.xz * (1.0 / 46.0) + uTime * vec2(0.0045, 0.0105);
  vec2 w2 = mat2(0.8, -0.6, 0.6, 0.8) * vW.xz * (1.0 / 15.0) + uTime * vec2(-0.016, 0.007);
  vec2 w3 = mat2(0.5, 0.86, -0.86, 0.5) * vW.xz * (1.0 / 4.3) + uTime * vec2(0.03, -0.02);
  float nearF = exp(-dist / 900.0);
  vec2 sl = (nrm(w1) * 0.6 + nrm(w2) * 0.34 + nrm(w3) * 0.14 * nearF) * 0.2;
  vec3 N = normalize(vec3(-sl.x, 1.0, -sl.y));
  float cosV = max(dot(N, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosV, 5.0);
  vec4 rc = uReflVP * vec4(vW, 1.0);
  vec2 ruv = rc.xy / rc.w * 0.5 + 0.5;
  ruv += vec2(sl.x * 0.3, sl.y * 1.1) * uDistort;
  float graze = 1.0 - V.y;
  float spread = 0.003 + 0.03 * graze * graze;
  vec3 refl = vec3(0.0);
  float ws = 0.0;
  for (int i = -4; i <= 4; i++) {
    float fi = float(i);
    float wt = exp(-fi * fi * 0.12);
    refl += texture2D(uRefl, ruv + vec2(0.0, fi * spread)).rgb * wt;
    ws += wt;
  }
  refl /= ws;
  vec3 col = refl * F;
  // glitter path of the brightest lights on the waves
  for (int i = 0; i < 6; i++) {
    if (i >= uLN) break;
    vec3 d = uLP[i].xyz - vW;
    float r2 = dot(d, d);
    vec3 L = d * inversesqrt(r2);
    vec3 H = normalize(L + V);
    float nh = dot(N, H);
    if (nh < 0.5) continue;
    float m2 = 0.012;
    float c2 = nh * nh;
    float D = exp((c2 - 1.0) / (c2 * m2)) / (3.14159 * m2 * c2 * c2);
    col += uLC[i].rgb / (r2 + uLP[i].w * uLP[i].w) * D * F * 0.08 / max(cosV, 0.08);
  }
  // light scattered in the top of the water
  col += lightAt(vW + vec3(0.0, 6.0, 0.0)) * 0.0035 + vec3(0.00025, 0.00045, 0.0006);
  gl_FragColor = vec4(fogged(col, dist), 1.0);
}
`;

const LIT_VS = /* glsl */ `
attribute vec3 color;
varying vec3 vW; varying vec3 vN; varying vec3 vC;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = color;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
// Lit surfaces: albedo from vertex colour, dynamic lights, a static lamp set,
// optional uplighting (bridge towers), fog.
const LIT_FS = /* glsl */ `
uniform vec3 uAmb;
uniform vec4 uLampP[4];
uniform vec4 uLampC[4];
uniform float uUplight;
uniform float uRim;
${LIGHTS}
${FOG}
varying vec3 vW; varying vec3 vN; varying vec3 vC;
void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  vec3 E = lightAtN(vW, N, 0.25) + uAmb * (0.6 + 0.4 * N.y);
  for (int i = 0; i < 4; i++) {
    vec3 d = uLampP[i].xyz - vW;
    float r2 = dot(d, d);
    E += uLampC[i].rgb * max(dot(N, d) * inversesqrt(r2) * 0.8 + 0.2, 0.0) / (r2 + 1.0);
  }
  vec3 col = vC * E;
  if (uRim > 0.0) {
    float rim = pow(1.0 - abs(dot(N, V)), 3.0);
    col += rim * uRim * (lightAt(vW) * 0.25 + vec3(0.004, 0.0035, 0.004));
  }
  if (uUplight > 0.0) col += vec3(1.0, 0.72, 0.42) * vC * uUplight * exp(-max(vW.y - 2.0, 0.0) / 55.0) * (0.4 + 0.6 * max(N.y * 0.0 + dot(N, normalize(vec3(-0.2, 0.0, 1.0))), 0.0));
  gl_FragColor = vec4(fogged(col, length(cameraPosition - vW)), 1.0);
}
`;

const CITY_VS = /* glsl */ `
attribute vec4 iBox; attribute vec4 iB2;
varying vec3 vW; varying vec3 vN; varying vec2 vFac; varying vec4 vSty; varying float vFace; varying vec3 vSize;
void main() {
  float c = cos(iB2.y), s = sin(iB2.y);
  vec3 sz = vec3(iBox.z, iB2.x, iBox.w);
  vec3 lp = position * sz;
  vec3 wp = vec3(c * lp.x - s * lp.z, lp.y, s * lp.x + c * lp.z) + vec3(iBox.x, 0.0, iBox.y);
  vN = vec3(c * normal.x - s * normal.z, normal.y, s * normal.x + c * normal.z);
  float face = abs(normal.x) > 0.5 ? (normal.x > 0.0 ? 0.0 : 1.0) : (normal.z > 0.0 ? 2.0 : 3.0);
  if (normal.y > 0.5) face = 4.0;
  vFace = face;
  vFac = vec2(abs(normal.x) > 0.5 ? lp.z + sz.z * 0.5 : lp.x + sz.x * 0.5, lp.y);
  vSty = iB2; vW = wp; vSize = sz;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;
const CITY_FS = /* glsl */ `
uniform vec3 uAmb;
uniform float uWin;
uniform float uTime;
${HASH}
${LIGHTS}
${FOG}
varying vec3 vW; varying vec3 vN; varying vec2 vFac; varying vec4 vSty; varying float vFace; varying vec3 vSize;
float hs(float s, float k) { return h1(uint(s * 1048576.0) * 0x9E3779B9u ^ uint(k * 7919.0 + 13.0)); }
float aab(float x, float lo, float hi, float fw) { return clamp(min(x - lo, hi - x) / max(fw, 1e-4) + 0.5, 0.0, 1.0); }
void main() {
  vec3 N = normalize(vN);
  float seed = vSty.z, style = vSty.w;
  vec3 alb = vec3(0.028, 0.03, 0.034) * (0.55 + 0.9 * hs(seed, 5.0));
  if (style == 1.0) alb *= vec3(0.75, 0.9, 1.1);
  vec3 col = alb * (lightAtN(vW, N, 0.15) + uAmb);
  float dist = length(cameraPosition - vW);
  if (vFace < 3.5) {
    float colW = 3.0 + 1.8 * hs(seed, 1.0);
    float flH = 3.4 + 0.7 * hs(seed, 2.0);
    vec2 g = vFac / vec2(colW, flH);
    vec2 fw = fwidth(g);
    vec2 cell = floor(g), f = fract(g);
    float win = aab(f.x, 0.14, 0.86, fw.x) * aab(f.y, 0.26, 0.86, fw.y);
    if (style == 1.0) win = aab(f.x, 0.04, 0.96, fw.x) * aab(f.y, 0.12, 0.92, fw.y);
    float litFrac = 0.08 + 0.26 * hs(seed, 3.0);
    float hc = h1(uint(seed * 1048576.0) ^ pcg(uint(cell.x + 512.0) * 977u + uint(cell.y) * 131071u + uint(vFace) * 7u));
    float lit = step(hc, litFrac);
    if (style == 1.0) { float fl = hs(seed + cell.y * 0.013, 9.0); lit = step(fl, 0.42) * (0.75 + 0.25 * step(hc, 0.85)); litFrac = 0.42 * 0.9; }
    float warm = step(0.45, hs(seed + cell.x * 0.31 + cell.y * 0.17, 4.0));
    vec3 wc = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.62, 0.32), warm) * (0.35 + 0.65 * fract(hc * 37.0));
    float area = style == 1.0 ? 0.92 * 0.8 : 0.72 * 0.6;
    vec3 avgC = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.62, 0.32), 0.55) * 0.67;
    float fp = max(fw.x, fw.y);
    vec3 e = mix(wc * win * lit, avgC * area * litFrac, smoothstep(0.22, 0.75, fp));
    // keep the ground floor dimmer, shops glow warmer
    if (vFac.y < 6.0) e = mix(e, vec3(1.0, 0.7, 0.4) * 0.35 * area, 0.5);
    col += e * uWin;
    // crown light bands on some towers
    if (style == 2.0 && vFac.y > vSize.y - 7.0) {
      vec3 cr = mix(vec3(0.9, 0.95, 1.0), vec3(0.3, 0.55, 1.0), step(0.5, hs(seed, 8.0)));
      if (hs(seed, 11.0) > 0.8) cr = vec3(1.0, 0.25, 0.55);
      col += cr * 0.9 * smoothstep(vSize.y - 7.0, vSize.y - 5.5, vFac.y);
    }
  }
  gl_FragColor = vec4(fogged(col, dist), 1.0);
}
`;

// ---------------------------------------------------------------- textures
function waveNormals(size = 256) {
  const r = rng(99);
  const waves = [];
  for (let i = 0; i < 70; i++) {
    let kx, ky;
    do { kx = r.int(-24, 24); ky = r.int(-24, 24); } while (kx * kx + ky * ky < 4);
    const k = Math.hypot(kx, ky);
    // waves mostly running across the river, a few cross seas
    const along = Math.abs(ky) / k;
    waves.push({ kx, ky, a: Math.pow(k, -1.6) * (0.4 + 0.9 * along) * (0.6 + 0.8 * r()), ph: r() * Math.PI * 2 });
  }
  const data = new Uint8Array(size * size * 4);
  const sx = new Float32Array(size * size), sy = new Float32Array(size * size);
  let mx = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let dx = 0, dy = 0;
    for (const w of waves) {
      const ph = (w.kx * x + w.ky * y) / size * Math.PI * 2 + w.ph;
      const c = Math.cos(ph) * w.a * Math.PI * 2;
      dx += c * w.kx; dy += c * w.ky;
    }
    sx[y * size + x] = dx; sy[y * size + x] = dy;
    mx = Math.max(mx, Math.abs(dx), Math.abs(dy));
  }
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = 128 + sx[i] / mx * 127;
    data[i * 4 + 1] = 128 + sy[i] / mx * 127;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

// ---------------------------------------------------------------- world
export class World {
  constructor(tier, lights, renderer) {
    this.tier = tier;
    this.lights = lights;
    this.sky = new THREE.Scene();
    this.far = new THREE.Scene();   // drawn in both the main and the mirrored pass
    this.near = new THREE.Scene();  // main pass only
    this.spriteU = {
      uTime: { value: 0 }, uFocal: { value: 1000 }, uRes: { value: new THREE.Vector2(1, 1) }, uGain: { value: 1 },
    };
    const fogU = { uFogCol: { value: new THREE.Vector3(0.0046, 0.0036, 0.0031) } };
    this.fogU = fogU;
    const L = lights.uniforms;

    // sky
    const tri = new THREE.BufferGeometry();
    tri.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    this.skyU = {
      uInvVP: { value: new THREE.Matrix4() }, uTime: { value: 0 }, uOct: { value: tier.cloudOct },
      uCloudGlow: { value: new THREE.Vector3(0.0075, 0.0048, 0.0032) }, uClouds: { value: 1 }, ...L,
    };
    const sky = new THREE.Mesh(tri, new THREE.ShaderMaterial({ uniforms: this.skyU, vertexShader: SKY_VS, fragmentShader: SKY_FS, depthTest: false, depthWrite: false }));
    sky.frustumCulled = false;
    this.sky.add(sky);

    // water (the river between the banks)
    this.waterU = {
      uRefl: { value: null }, uReflVP: { value: new THREE.Matrix4() }, uWaveN: { value: waveNormals() },
      uTime: { value: 0 }, uDistort: { value: 0.28 }, ...L, ...fogU,
    };
    this.waterU.uWaveN.value.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const wg = new THREE.PlaneGeometry(14000, SITE.farShoreZ * -1 - 10 + 2, 1, 1);
    wg.rotateX(-Math.PI / 2);
    wg.translate(0, 0, (SITE.farShoreZ - 10) / 2);
    const water = new THREE.Mesh(wg, new THREE.ShaderMaterial({ uniforms: this.waterU, vertexShader: WATER_VS, fragmentShader: WATER_FS }));
    water.frustumCulled = false;
    this.near.add(water);

    this.litU = {
      uAmb: { value: new THREE.Vector3(0.0035, 0.0032, 0.0036) },
      uLampP: { value: Array.from({ length: 4 }, () => new THREE.Vector4(0, -1000, 0, 0)) },
      uLampC: { value: Array.from({ length: 4 }, () => new THREE.Vector4()) },
      uUplight: { value: 0 }, uRim: { value: 0 }, ...L, ...fogU,
    };
    this.litMat = (over = {}) => new THREE.ShaderMaterial({ uniforms: { ...this.litU, ...over }, vertexShader: LIT_VS, fragmentShader: LIT_FS, side: THREE.DoubleSide });

    this.buildCity();
    this.buildBridge();
    this.buildHarbour();
    this.buildTerrace();
  }

  buildCity() {
    const r = rng(2026);
    const recs = [];
    const add = (x, z, w, d, h, rot, style) => recs.push(x, z, w, d, h, rot, r(), style);
    // far-bank waterfront: low and mid rise right along the quay
    for (let x = -3200; x < 3200;) {
      const w = r.range(22, 62);
      add(x + w / 2, SITE.farShoreZ - 40 - r.range(0, 30), w, r.range(18, 40), r.range(14, 58), 0, r.chance(0.2) ? 1 : 0);
      x += w + r.range(5, 16);
    }
    // downtown towers
    for (let i = 0; i < 150; i++) {
      const a = r() * Math.PI * 2, rad = Math.pow(r(), 0.7) * 820;
      const x = -180 + Math.cos(a) * rad * 1.35, z = -2250 + Math.sin(a) * rad * 0.7;
      const centre = 1 - rad / 820;
      const h = 70 + centre * centre * r.range(120, 300) + r.range(0, 60);
      const w = r.range(24, 52);
      add(x, z, w, w * r.range(0.7, 1.3), h, r.chance(0.3) ? r.range(-0.3, 0.3) : 0, r.chance(0.45) ? 1 : (h > 180 && r.chance(0.5) ? 2 : 0));
    }
    // a few landmark spires
    for (const [x, z, h] of [[-420, -2050, 395], [60, -2320, 352], [-150, -2600, 318], [320, -2150, 260]]) {
      add(x, z, 46, 46, h, 0.12, 2);
      add(x, z, 30, 30, h + 26, 0.12, 1);
      add(x, z, 4, 4, h + 85, 0, 0);
    }
    // midtown and the hills of suburbs behind
    for (let i = 0; i < 420; i++) {
      const x = r.range(-3600, 3600), z = r.range(-1640, -3900);
      if (Math.hypot((x + 180) / 1.35, (z + 2250) / 0.7) < 760) continue;
      add(x, z, r.range(18, 48), r.range(18, 44), r.range(12, 95) * (1 - (-z - 1600) / 3000), r.range(-0.4, 0.4), r.chance(0.25) ? 1 : 0);
    }
    for (let i = 0; i < 360; i++) {
      add(r.range(-6000, 6000), r.range(-3900, -7000), r.range(14, 40), r.range(14, 40), r.range(8, 34), r.range(-1, 1), 0);
    }
    // left headland closing the bay
    for (let i = 0; i < 120; i++) {
      add(r.range(-2600, -1250), r.range(-200, -1450), r.range(18, 44), r.range(18, 40), r.range(10, 70), r.range(-0.3, 0.3), r.chance(0.2) ? 1 : 0);
    }
    this.cityRecs = recs;
    const n = recs.length / 8;
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const g = new THREE.InstancedBufferGeometry();
    g.index = box.index;
    g.setAttribute('position', box.attributes.position);
    g.setAttribute('normal', box.attributes.normal);
    const a1 = new Float32Array(n * 4), a2 = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      a1.set([recs[i * 8], recs[i * 8 + 1], recs[i * 8 + 2], recs[i * 8 + 3]], i * 4);
      a2.set([recs[i * 8 + 4], recs[i * 8 + 5], recs[i * 8 + 6], recs[i * 8 + 7]], i * 4);
    }
    g.setAttribute('iBox', new THREE.InstancedBufferAttribute(a1, 4));
    g.setAttribute('iB2', new THREE.InstancedBufferAttribute(a2, 4));
    g.instanceCount = n;
    this.cityU = { uAmb: { value: new THREE.Vector3(0.0045, 0.0036, 0.0032) }, uWin: { value: 0.5 }, uTime: this.spriteU.uTime, ...this.lights.uniforms, ...this.fogU };
    const city = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: this.cityU, vertexShader: CITY_VS, fragmentShader: CITY_FS }));
    city.frustumCulled = false;
    this.far.add(city);

    // ground under the far bank, the headland and our own bank
    const gb = new Builder();
    gb.aabox(-9000, 0, -9000, 9000, 3.5, SITE.farShoreZ, [0.03, 0.03, 0.03]);
    gb.aabox(-9000, 0, SITE.farShoreZ, -1250, 3.5, -10, [0.03, 0.03, 0.03]);
    gb.aabox(-9000, 0, -10, 9000, SITE.terrace.y - 0.4, 9000, [0.025, 0.025, 0.024]);
    // a ridge of hills far behind the city
    const ridge = [];
    let hh = 220;
    for (let x = -12000; x <= 12000; x += 160) {
      hh += r.range(-34, 34);
      hh = Math.max(90, Math.min(460, hh + (260 - hh) * 0.03));
      ridge.push([x, -7600 - 500 * Math.sin(x / 2300), hh]);
    }
    for (let i = 0; i + 1 < ridge.length; i++) {
      const [x0, z0, h0] = ridge[i], [x1, z1, h1] = ridge[i + 1];
      const base = gb.p.length / 3;
      gb.p.push(x0, 0, z0, x1, 0, z1, x1, h1, z1, x0, h0, z0);
      for (let k = 0; k < 4; k++) { gb.n.push(0, 0.35, 0.94); gb.c.push(0.012, 0.012, 0.014); }
      gb.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
    const ground = new THREE.Mesh(gb.geometry(), this.litMat());
    this.far.add(ground);

    // beacons on the tall roofs, street-light glow along the far quay
    const sp = new Sprites(this.spriteU);
    for (let i = 0; i < n; i++) {
      const h = recs[i * 8 + 4];
      if (h > 150) sp.add([recs[i * 8], h + 1.5, recs[i * 8 + 1]], 1.4, [1.0, 0.04, 0.02, 60], { f: 0.55 + r() * 0.3, duty: 0.5, phase: r() }, 1.2);
    }
    for (let x = -3100; x < 3100; x += 24 + r() * 6) sp.add([x, 9, SITE.farShoreZ - 6], 0.9, [1.0, 0.62, 0.3, 40], null, 1.1);
    for (let x = -3100; x < 3100; x += 13 + r() * 30) sp.add([x, 4.5 + r() * 2, SITE.farShoreZ - 14 - r() * 8], 0.6, r.chance(0.5) ? [1, 0.85, 0.7, 25] : [0.8, 0.9, 1.0, 25], null, 1.0);
    // headland shore lights
    for (let z = -200; z > -1450; z -= 30 + r() * 8) sp.add([-1255, 8, z], 0.9, [1.0, 0.62, 0.3, 40], null, 1.1);
    this.far.add(sp.mesh());

    // Ferris wheel on the far quay
    const W = SITE.wheel;
    const wb = new Builder();
    wb.beam([W.x - 30, 3.5, W.z], [W.x, W.hub, W.z], 2.2, [0.05, 0.05, 0.055]);
    wb.beam([W.x + 30, 3.5, W.z], [W.x, W.hub, W.z], 2.2, [0.05, 0.05, 0.055]);
    this.far.add(new THREE.Mesh(wb.geometry(), this.litMat()));
    const ws = new Sprites(this.spriteU, W);
    for (let i = 0; i < 96; i++) ws.add([0, 0, 0], 0.9, [1, 1, 1, 30], { f: 0, duty: W.r, phase: i / 96 }, 1.0);
    for (let i = 0; i < 24; i++) for (let k = 1; k <= 3; k++) ws.add([0, 0, 0], 0.7, [1, 1, 1, 18], { f: 0, duty: W.r * k / 4, phase: i / 24 }, 0.9);
    this.wheelMesh = ws.mesh();
    this.far.add(this.wheelMesh);
  }

  buildBridge() {
    const B = SITE.bridge;
    const A = [B.a[0], 0, B.a[1]], Bp = [B.b[0], 0, B.b[1]];
    const d = [Bp[0] - A[0], 0, Bp[2] - A[2]];
    const L = Math.hypot(d[0], d[2]);
    const u = [d[0] / L, 0, d[2] / L];
    const side = [-u[2], 0, u[0]];
    const at = (s, y, off = 0) => [A[0] + u[0] * L * s + side[0] * off, y, A[2] + u[2] * L * s + side[2] * off];
    this.bridgeAt = at;
    this.bridgeL = L;
    const b = new Builder();
    const steel = [0.055, 0.058, 0.06], deckC = [0.04, 0.04, 0.042], tower = [0.075, 0.072, 0.068];
    const hw = B.width / 2;
    // deck in segments
    const segs = 40;
    for (let i = 0; i < segs; i++) {
      const s0 = -0.03 + 1.06 * i / segs, s1 = -0.03 + 1.06 * (i + 1) / segs;
      const c = at((s0 + s1) / 2, B.deckY - 2);
      b.box(c, side, [0, 1, 0], u, [hw, 2.2, L * (s1 - s0) / 2], deckC);
      // truss skirt under the deck
      b.box([c[0], B.deckY - 6, c[2]], side, [0, 1, 0], u, [hw - 1, 2, L * (s1 - s0) / 2 - 1], [0.03, 0.03, 0.032]);
    }
    // piers carrying the approach spans
    for (const s of [0.07, 0.15, 0.22, 0.78, 0.85]) {
      const c = at(s, B.deckY / 2 - 4);
      b.box(c, side, [0, 1, 0], u, [hw - 3, B.deckY / 2 - 4, 3], tower);
    }
    // towers
    const tops = [];
    for (const s of B.towers) {
      for (const o of [-hw - 3, hw + 3]) {
        const base = at(s, 0, o), top = at(s, B.towerH, o * 0.86);
        b.beam(base, top, 7.5, tower);
        tops.push(top);
      }
      for (const y of [B.deckY - 9, 108, B.towerH - 4]) {
        const k = 1 - 0.14 * y / B.towerH;
        b.beam(at(s, y, (-hw - 3) * k), at(s, y, (hw + 3) * k), 5, tower);
      }
      b.box(at(s, 2, 0), side, [0, 1, 0], u, [hw + 9, 3, 9], tower);
    }
    // main cables: side spans and the main span
    const [t1, t2] = B.towers;
    const anchors = [0.04, 0.9];
    const cableY = (s) => {
      if (s <= t1) { const x = (s - anchors[0]) / (t1 - anchors[0]); return B.deckY + 2 + (B.towerH - B.deckY - 2) * x * x * 0.4 + (B.towerH - B.deckY - 2) * 0.6 * x; }
      if (s >= t2) { const x = (anchors[1] - s) / (anchors[1] - t2); return B.deckY + 2 + (B.towerH - B.deckY - 2) * x * x * 0.4 + (B.towerH - B.deckY - 2) * 0.6 * x; }
      const x = (s - (t1 + t2) / 2) / ((t2 - t1) / 2);
      return B.deckY + 7 + (B.towerH - B.deckY - 7) * x * x;
    };
    this.cableY = cableY;
    const sp = new Sprites(this.spriteU);
    for (const o of [-hw - 1, hw + 1]) {
      let prev = null;
      for (let i = 0; i <= 160; i++) {
        const s = anchors[0] + (anchors[1] - anchors[0]) * i / 160;
        const k = s > t1 && s < t2 ? 0.86 : 0.86 + 0.14 * (s <= t1 ? 1 - (s - anchors[0]) / (t1 - anchors[0]) : 1 - (anchors[1] - s) / (anchors[1] - t2));
        const p = at(s, cableY(s), o * k);
        if (prev) b.beam(prev, p, 1.1, steel);
        prev = p;
        if (i % 2 === 0) sp.add(p, 0.7, [1.0, 0.9, 0.72, 46], null, 1.1);
      }
      // suspenders as faint lit lines are invisible at night; deck lamps instead
      for (let s = -0.02; s < 1.02; s += 0.012) sp.add(at(s, B.deckY + 7, o * 0.92), 0.6, [1.0, 0.55, 0.22, 34], null, 1.0);
    }
    for (const p of tops) sp.add([p[0], p[1] + 3, p[2]], 1.6, [1.0, 0.05, 0.02, 90], { f: 0.5, duty: 0.55, phase: 0.1 }, 1.4);
    // traffic: a few headlights and tail lights on the deck
    const r = rng(77);
    for (let i = 0; i < 26; i++) {
      const s = r(), lane = r.chance(0.5) ? 1 : -1;
      sp.add(at(s, B.deckY + 1.2, lane * r.range(3, 10)), 0.5, lane > 0 ? [1, 0.95, 0.85, 30] : [1, 0.08, 0.04, 14], null, 0.9);
    }
    const mesh = new THREE.Mesh(b.geometry(), this.litMat({ uUplight: { value: 0.55 } }));
    this.far.add(mesh);
    this.far.add(sp.mesh());
  }

  buildHarbour() {
    const r = rng(31);
    const b = new Builder();
    const hull = [0.05, 0.048, 0.046], rack = [0.06, 0.055, 0.05];
    const sp = new Sprites(this.spriteU);
    for (const g of SITE.barges) {
      b.aabox(g.x - 19, 0, g.z - 7, g.x + 19, 2.4, g.z + 7, hull);
      for (let i = 0; i < 7; i++) b.aabox(g.x - 16 + i * 4.8, 2.4, g.z - 4, g.x - 13.5 + i * 4.8, 3.6, g.z + 4, rack);
      b.aabox(g.x + 14, 2.4, g.z + 3, g.x + 18, 5.5, g.z + 6.5, rack);
      sp.add([g.x - 18.5, 3, g.z + 6.5], 0.35, [1, 0.12, 0.05, 12], null, 0.9);
      sp.add([g.x + 18.5, 3, g.z + 6.5], 0.35, [1, 0.12, 0.05, 12], null, 0.9);
      sp.add([g.x + 16, 6, g.z + 5], 0.4, [1, 0.8, 0.55, 6], null, 0.9);
    }
    // spectator boats and a fire-boat
    const boats = [[-430, -420, 0.4], [-260, -300, -0.2], [180, -380, 1.2], [330, -560, 0.6], [-640, -560, 2.0], [40, -1180, 0.3], [-160, -1300, -0.5], [420, -260, 2.6], [-80, -330, 1.9]];
    for (const [x, z, a] of boats) {
      const ex = [Math.cos(a), 0, Math.sin(a)], ez = [-Math.sin(a), 0, Math.cos(a)];
      const len = r.range(9, 20);
      b.box([x, 0.9, z], ex, [0, 1, 0], ez, [len / 2, 1.1, len / 6], [0.07, 0.07, 0.072]);
      b.box([x - ex[0] * len * 0.1, 2.8, z - ex[2] * len * 0.1], ex, [0, 1, 0], ez, [len / 5, 0.9, len / 8], [0.08, 0.08, 0.08]);
      const bow = [x + ex[0] * len * 0.48, 2.2, z + ex[2] * len * 0.48];
      sp.add([bow[0] + ez[0] * len / 7, 2.2, bow[2] + ez[2] * len / 7], 0.3, [1, 0.05, 0.03, 18], null, 0.9);
      sp.add([bow[0] - ez[0] * len / 7, 2.2, bow[2] - ez[2] * len / 7], 0.3, [0.05, 1, 0.3, 18], null, 0.9);
      sp.add([x, 6.5, z], 0.35, [1, 0.95, 0.85, 22], null, 0.9);
      sp.add([x - ex[0] * len * 0.1, 2.8, z - ex[2] * len * 0.1], 0.8, [1, 0.75, 0.45, 5], null, 0.9);
    }
    this.boats = boats;
    this.far.add(new THREE.Mesh(b.geometry(), this.litMat()));
    this.far.add(sp.mesh());
  }

  buildTerrace() {
    const T = SITE.terrace;
    const b = new Builder();
    const stone = [0.11, 0.1, 0.09], iron = [0.025, 0.025, 0.027];
    b.aabox(T.x0, 0, T.wallZ - 0.3, T.x1, T.y, T.wallZ + 0.6, [0.06, 0.055, 0.05]);
    b.aabox(T.x0, T.y - 0.4, T.wallZ, T.x1, T.y, 40, stone);
    // railing
    for (let x = T.x0; x <= T.x1; x += 1.6) b.aabox(x - 0.035, T.y, T.railZ - 0.035, x + 0.035, T.y + 1.05, T.railZ + 0.035, iron);
    b.aabox(T.x0, T.y + 1.02, T.railZ - 0.05, T.x1, T.y + 1.09, T.railZ + 0.05, iron);
    b.aabox(T.x0, T.y + 0.55, T.railZ - 0.02, T.x1, T.y + 0.59, T.railZ + 0.02, iron);
    b.aabox(T.x0, T.y + 0.06, T.railZ - 0.03, T.x1, T.y + 0.11, T.railZ + 0.03, iron);
    // lamp posts
    const lamps = [-13.5, 15.5, -41, 43];
    const sp = new Sprites(this.spriteU);
    lamps.forEach((x, i) => {
      b.aabox(x - 0.08, T.y, T.railZ + 0.25, x + 0.08, T.y + 4.3, T.railZ + 0.41, iron);
      b.aabox(x - 0.22, T.y + 4.25, T.railZ + 0.1, x + 0.22, T.y + 4.33, T.railZ + 0.56, iron);
      const lp = [x, T.y + 4.05, T.railZ + 0.33];
      sp.add(lp, 0.14, [1.0, 0.72, 0.42, 40], null, 1.5);
      sp.add(lp, 0.55, [1.0, 0.7, 0.4, 0.22], null, 2);
      this.litU.uLampP.value[i].set(lp[0], lp[1], lp[2], 0);
      this.litU.uLampC.value[i].set(1.0 * 3.2, 0.7 * 3.2, 0.4 * 3.2, 0);
    });
    // our bank's promenade lights to the sides, seen from other cameras
    for (let x = -2000; x < 2000; x += 26) if (x < T.x0 || x > T.x1) sp.add([x, T.y + 4.2, T.wallZ + 1], 0.35, [1.0, 0.68, 0.38, 26], null, 1.1);
    this.near.add(new THREE.Mesh(b.geometry(), this.litMat()));
    this.near.add(sp.mesh());
    this.lampSprites = sp;
  }

  update(t, cam) {
    this.spriteU.uTime.value = t;
    this.skyU.uTime.value = t;
    this.waterU.uTime.value = t;
    this.wheelMesh.material.uniforms.uWheelA.value = t * 0.035;
  }

  // Per-pass camera uniforms.
  setPass(cam, w, h) {
    const focal = cam.projectionMatrix.elements[5] * h / 2;
    this.spriteU.uFocal.value = focal;
    this.spriteU.uRes.value.set(w, h);
    this.skyU.uInvVP.value.multiplyMatrices(cam.matrixWorld, cam.projectionMatrixInverse);
    return focal;
  }
}
