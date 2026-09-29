// Volumetric cloud layer: noise volumes, ray-marched view pass, sun-projected shadow map for the sea,
// and a hemi-octahedral environment map (sky + clouds) used for reflections and ambient light.
import { gl, Program, FS_VERT, tex2D, tex3D, makeFBO, bindFBO, drawFS } from './gl.js';
import './glsl.js';

const NOISE_LIB = `
#include <common>
float gradNoise(vec3 p, float per) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float v[8];
  for (int k = 0; k < 8; k++) {
    vec3 o = vec3(float(k & 1), float((k >> 1) & 1), float((k >> 2) & 1));
    vec3 c = mod(i + o, per);
    vec3 g = normalize(hash33(c) * 2.0 - 1.0);
    v[k] = dot(g, f - o);
  }
  float r = mix(mix(mix(v[0], v[1], u.x), mix(v[2], v[3], u.x), u.y), mix(mix(v[4], v[5], u.x), mix(v[6], v[7], u.x), u.y), u.z);
  return r * 0.85 + 0.5;
}
float worley(vec3 p, float per) {
  vec3 i = floor(p), f = fract(p);
  float d = 1e3;
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 c = mod(i + o, per);
    vec3 r = o + hash33(c) - f;
    d = min(d, dot(r, r));
  }
  return 1.0 - clamp(sqrt(d), 0.0, 1.0);
}
float perlinFbm(vec3 p, float per) {
  float a = 0.5, s = 0.0, n = 0.0;
  for (int i = 0; i < 4; i++) { s += a * gradNoise(p * exp2(float(i)), per * exp2(float(i))); n += a; a *= 0.5; }
  return s / n;
}
`;

const SHAPE_FS = `${NOISE_LIB}
in vec2 vUv;
uniform float uSlice;
out vec4 o;
void main() {
  vec3 p = vec3(gl_FragCoord.xy / 128.0, uSlice);
  float pn = perlinFbm(p * 4.0, 4.0);
  float w1 = worley(p * 4.0, 4.0), w2 = worley(p * 8.0, 8.0), w3 = worley(p * 16.0, 16.0), w4 = worley(p * 32.0, 32.0);
  float wf = w1 * 0.625 + w2 * 0.25 + w3 * 0.125;
  float pw = clamp(remap(pn, 0.0, 1.0, wf, 1.0), 0.0, 1.0);
  o = vec4(pw, w2, w3, w4);
}`;
const DETAIL_FS = `${NOISE_LIB}
in vec2 vUv;
uniform float uSlice;
out vec4 o;
void main() {
  vec3 p = vec3(gl_FragCoord.xy / 32.0, uSlice);
  o = vec4(worley(p * 2.0, 2.0), worley(p * 4.0, 4.0), worley(p * 8.0, 8.0), 1.0);
}`;
const WEATHER_FS = `${NOISE_LIB}
in vec2 vUv;
out vec4 o;
float tile(vec2 p, float per) {
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 5; i++) { s += a * gradNoise(vec3(p * exp2(float(i)), 3.7), per * exp2(float(i))); n += a; a *= 0.5; }
  return s / n;
}
void main() {
  vec2 p = gl_FragCoord.xy / 256.0;
  o = vec4(tile(p * 3.0, 3.0), tile(p * 5.0 + 11.0, 5.0), tile(p * 9.0 + 3.0, 9.0), 1.0);
}`;

// ---- shared cloud model -----------------------------------------------------------------------
import { defineChunk } from './gl.js';
defineChunk('clouds', `
uniform sampler3D uShape, uDetail;
uniform sampler2D uWeather;
uniform vec4 uCloudA;   // cover, type (0 cumulus .. 1 stratus), base(m), top(m)
uniform vec4 uCloudB;   // extinction per unit density (1/m), dark (0..1), wind offset x, z
uniform vec3 uCamAbs;   // absolute camera position
uniform vec4 uFlash;    // xyz position relative to camera (m), w pre-exposed intensity

float heightGrad(float h, float type) {
  float cu = smoothstep(0.0, 0.09, h) * smoothstep(1.0, 0.5, h);
  float st = smoothstep(0.0, 0.14, h) * smoothstep(0.62, 0.30, h);
  return mix(cu, st, type);
}
float cloudPresence(vec2 xz) {
  vec3 w = texture(uWeather, (xz + uCloudB.zw) / 52000.0).rgb;
  float wn = (w.r * 0.6 + w.g * 0.28 + w.b * 0.12 - 0.5) * 1.9 + 0.5;   // stretch contrast of the weather noise
  float c = uCloudA.x;
  float thr = 0.64 - 0.30 * c - 0.32 * smoothstep(0.82, 1.0, c);      // approx. quantile of the noise
  return smoothstep(thr - 0.07, thr + 0.07, wn) * step(0.004, c);
}
float cloudDensity(vec3 p, float detailAmt) {
  float h = (p.y - uCloudA.z) / (uCloudA.w - uCloudA.z);
  if (h <= 0.0 || h >= 1.0) return 0.0;
  float pres = cloudPresence(p.xz);
  if (pres <= 0.0) return 0.0;
  vec2 xz = p.xz + uCloudB.zw;
  vec4 s = texture(uShape, vec3(xz.x, p.y * 1.15, xz.y) / 5600.0);
  float fbmL = dot(s.gba, vec3(0.625, 0.25, 0.125));
  float base = remap(s.r, -(1.0 - fbmL), 1.0, 0.0, 1.0);
  base *= heightGrad(h, uCloudA.y);
  base = remap(base, 1.0 - pres, 1.0, 0.0, 1.0) * pres;
  if (base > 0.0 && detailAmt > 0.0) {
    vec3 dn = texture(uDetail, vec3(xz.x, p.y * 1.3, xz.y) / 950.0).rgb;
    float dfbm = dot(dn, vec3(0.625, 0.25, 0.125));
    float hi = mix(dfbm, 1.0 - dfbm, sat(h * 8.0));
    // a second, finer erosion octave gives the tops their cauliflower edge and the bases their ragged rims
    vec3 dn2 = texture(uDetail, vec3(xz.x, p.y * 1.7, xz.y) / 280.0 + 0.37).rgb;
    float hi2 = mix(dot(dn2, vec3(0.625, 0.25, 0.125)), 1.0 - dot(dn2, vec3(0.625, 0.25, 0.125)), sat(h * 6.0));
    base = remap(base, (hi * 0.5 + hi2 * 0.22) * detailAmt, 1.0, 0.0, 1.0);
  }
  return sat(base) * mix(1.0, 0.8, uCloudA.y);
}
float hgPhase(float c, float g) { float g2 = g * g; return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * c, 1.5)); }
float cloudPhase(float c, float k) { return mix(hgPhase(c, 0.62 * k), hgPhase(c, -0.28 * k), 0.28); }

// Irradiance at cloud height (sun stays lit at cloud level a little after it sets on the surface)
vec3 lightAtCloud(vec3 ld, vec3 lc, float alt, float dip) {
  float r = RG + alt * 0.001;
  float vis = smoothstep(-dip - 0.014, -dip + 0.004, ld.y);
  return lc * texture(uTransLUT, transUV(r, max(ld.y, -0.06))).rgb * vis;
}

// Returns premultiplied radiance in rgb and view transmittance in a.
vec4 marchClouds(vec3 rd, float jitter, int steps, float detailAmt) {
  vec3 ro = uCamAbs;
  float yb = uCloudA.z, yt = uCloudA.w;
  if (rd.y < 0.0004 || uCloudA.x < 0.004) return vec4(0.0, 0.0, 0.0, 1.0);
  float tN, tF;
  if (ro.y < yb) { tN = (yb - ro.y) / rd.y; tF = (yt - ro.y) / rd.y; }
  else if (ro.y < yt) { tN = 0.0; tF = (yt - ro.y) / rd.y; }
  else return vec4(0.0, 0.0, 0.0, 1.0);
  const float MAXD = 165000.0;
  if (tN > MAXD) return vec4(0.0, 0.0, 0.0, 1.0);
  tF = min(min(tF, tN + 34000.0), MAXD);
  float len = tF - tN;

  float midAlt = 0.5 * (yb + yt);
  vec3 Es = lightAtCloud(uSunDir, uSunCol, midAlt, 0.03);
  vec3 Em = lightAtCloud(uMoonDir, uMoonCol, midAlt, 0.03);
  bool useSun = luma(Es) >= luma(Em);
  vec3 ld = useSun ? uSunDir : uMoonDir;
  vec3 E = useSun ? Es : Em;
  float cosT = dot(rd, ld);
  vec3 ambTop = skyRadiance(normalize(vec3(0.0, 1.0, 0.0))) * 0.9 + skyRadiance(normalize(vec3(rd.x, 0.5, rd.z))) * 0.5;
  vec3 hz = skyRadiance(normalize(vec3(rd.x, 0.03, rd.z)));
  // light inside a cloud has scattered many times and loses the blue of the open sky
  ambTop = mix(vec3(luma(ambTop)), ambTop, 0.38) * 1.15;
  vec3 ambBot = mix(vec3(luma(hz)), hz, 0.5) * 0.36 + ambTop * 0.10;
  float sigma = uCloudB.x * (1.0 + uCloudB.y * 0.6);
  float dark = uCloudB.y;

  vec3 L = vec3(0.0);
  float T = 1.0;
  float tHit = -1.0;
  float sunPhase[3];
  sunPhase[0] = cloudPhase(cosT, 1.0); sunPhase[1] = cloudPhase(cosT, 0.5); sunPhase[2] = cloudPhase(cosT, 0.25);
  // adaptive march: coarse strides through empty air, fine steps once inside a cloud
  float t = tN + jitter * clamp(40.0 + tN * 0.004, 40.0, 220.0);
  bool fine = false;
  int emptyRun = 0;
  for (int i = 0; i < 220; i++) {
    if (i >= steps || t >= tF) break;
    float dtF = clamp(36.0 + t * 0.0045 * (64.0 / float(steps)), 36.0, 260.0);
    float dt = fine ? dtF : dtF * 4.0;
    vec3 p = ro + rd * (t + 0.5 * dt);
    if (!fine) {
      float r0 = cloudDensity(p, 0.0);
      if (r0 > 0.0) { fine = true; emptyRun = 0; continue; }   // re-run this stride in fine steps
      t += dt; continue;
    }
    float rho = cloudDensity(p, detailAmt);
    if (rho <= 0.002) { if (++emptyRun > 5) fine = false; t += dt; continue; }
    emptyRun = 0;
    if (tHit < 0.0) tHit = t;
    float ext = rho * sigma;
    float h = (p.y - yb) / (yt - yb);
    float od = 0.0, sd = 0.0;
    for (int j = 0; j < 5; j++) {
      float sl = 45.0 * exp2(float(j));
      sd += sl * 0.5;
      od += cloudDensity(p + ld * sd, 0.0) * sigma * sl;
      sd += sl * 0.5;
    }
    vec3 Ls = vec3(0.0);
    float a = 1.0, b = 1.0;
    for (int n = 0; n < 3; n++) { Ls += b * exp(-od * a) * sunPhase[n]; a *= 0.5; b *= 0.5; }
    float powder = 1.0 - 0.55 * exp(-ext * dt * 0.6);
    vec3 S = E * Ls * mix(1.0, 0.5, dark) * mix(0.55, 1.0, powder) * 4.0 * PI * 0.12;
    float ambOcc = (0.30 + 0.70 * exp(-od * 0.06 * (1.0 - h))) * mix(1.0, 0.55, dark);
    S += mix(ambBot, ambTop, sat(h * 1.2)) * ambOcc * (1.0 - 0.35 * dark);
    if (uFlash.w > 0.0) {
      vec3 fd = uFlash.xyz - (p - ro);
      float fr = length(fd);
      S += vec3(0.75, 0.82, 1.0) * uFlash.w / (1.0 + sq(fr / 900.0)) * cloudPhase(dot(rd, fd / fr), 0.5) * 8.0;
    }
    S *= ext;
    float Ti = exp(-ext * dt);
    L += T * (S - S * Ti) / max(ext, 1e-6);
    T *= Ti;
    if (T < 0.01) { T = 0.0; break; }
    t += dt;
  }
  // aerial perspective: light lost to and gained from the air between camera and cloud
  float dHit = tHit < 0.0 ? tN : tHit;
  vec3 extA = (RAY_S + (MIE_S + MIE_A) * uHaze) * 0.001;
  vec3 Ta = exp(-extA * dHit * 0.8);
  vec3 Linf = skyRadiance(rd);
  L = L * Ta + Linf * (1.0 - Ta) * (1.0 - T);
  // fade the far rim of the layer into the haze
  float fade = smoothstep(MAXD * 0.45, MAXD, tN);
  L *= 1.0 - fade; T = mix(T, 1.0, fade);
  return vec4(L, T);
}
`);

const CLOUD_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <clouds>
in vec2 vUv;
uniform mat4 uInvVP;
uniform float uFrame;
uniform int uSteps;
out vec4 o;
void main() {
  vec4 c = uInvVP * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 d = normalize(c.xyz / c.w);
  float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))) + uFrame * 0.61803398);
  o = marchClouds(d, jit, uSteps, 1.0);
}`;

const SHADOW_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <clouds>
in vec2 vUv;
uniform vec2 uCenter;   // absolute xz of map centre
uniform float uExtent;  // half size (m)
uniform int uSteps;
out vec4 o;
void main() {
  vec2 q = uCenter + (vUv * 2.0 - 1.0) * uExtent;
  bool sunMain = luma(uSunCol) * smoothstep(-0.03, 0.02, uSunDir.y) >= luma(uMoonCol);
  vec3 ld = sunMain ? uSunDir : uMoonDir;
  float T = 1.0;
  if (ld.y > 0.03 && uCloudA.x > 0.004) {
    float yb = uCloudA.z, yt = uCloudA.w;
    float tN = yb / ld.y, tF = yt / ld.y;
    float len = min(tF - tN, 9000.0);
    float tau = 0.0;
    float sigma = uCloudB.x * (1.0 + uCloudB.y * 0.6);
    for (int i = 0; i < 24; i++) {
      if (i >= uSteps) break;
      float t = tN + len * (float(i) + 0.5) / float(uSteps);
      vec3 p = vec3(q.x, 0.0, q.y) + ld * t;
      tau += cloudDensity(p, 0.0) * sigma * len / float(uSteps);
    }
    T = exp(-tau * 0.7);
    T = mix(T, 1.0, 0.06);
  }
  o = vec4(T, 0.0, 0.0, 1.0);
}`;

const ENV_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <clouds>
in vec2 vUv;
uniform int uSteps;
out vec4 o;
vec3 hemiOctToDir(vec2 e) {
  e = e * 2.0 - 1.0;
  vec2 p = vec2(e.x + e.y, e.x - e.y) * 0.5;
  float y = 1.0 - abs(p.x) - abs(p.y);
  return normalize(vec3(p.x, max(y, 0.0), p.y));
}
void main() {
  vec3 d = hemiOctToDir(vUv);
  vec3 L = skyRadiance(d);
  vec4 cl = marchClouds(d, 0.5, uSteps, 0.6);
  L = L * cl.a + cl.rgb;
  o = vec4(min(L, vec3(60000.0)), 1.0);
}`;

export class Clouds {
  constructor() {
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    // noise volumes (generated once)
    this.shape = tex3D(128, 128, 128, { fmt: 'rgba8', filter: 'linear', wrap: 'repeat' });
    this.detail = tex3D(32, 32, 32, { fmt: 'rgba8', filter: 'linear', wrap: 'repeat' });
    const gen = (name, fs, tex, size) => {
      const p = new Program(name, FS_VERT, fs);
      p.use();
      for (let z = 0; z < size; z++) {
        const f = makeFBO([{ tex, layer: z }]);
        bindFBO(f); p.f('uSlice', (z + 0.5) / size); drawFS();
      }
    };
    gen('cloud.shape', SHAPE_FS, this.shape, 128);
    gen('cloud.detail', DETAIL_FS, this.detail, 32);
    this.weather = tex2D(256, 256, { fmt: 'rgba8', filter: 'linear', wrap: 'repeat', mips: false });
    const wp = new Program('cloud.weather', FS_VERT, WEATHER_FS);
    const wf = makeFBO([this.weather]); bindFBO(wf); wp.use(); drawFS();

    this.pCloud = new Program('cloud.view', FS_VERT, CLOUD_FS);
    this.pShadow = new Program('cloud.shadow', FS_VERT, SHADOW_FS);
    this.pEnv = new Program('cloud.env', FS_VERT, ENV_FS);
    this.shadowRes = 256; this.shadowExtent = 14000;
    this.shadow = tex2D(this.shadowRes, this.shadowRes, { fmt: 'r16f', filter: 'linear', wrap: 'clamp' });
    this.fShadow = makeFBO([this.shadow]);
    this.envRes = 256;
    this.env = tex2D(this.envRes, this.envRes, { fmt: 'rgba16f', filter: 'linear', wrap: 'clamp', mips: true });
    this.fEnv = makeFBO([this.env]);
    this.w = 0; this.h = 0;
    this.windOff = [0, 0];
    this.p = { cover: 0.4, type: 0, base: 1500, top: 2900, dark: 0, density: 0.05 };
  }

  resize(w, h) {
    this.w = Math.max(2, w >> 1); this.h = Math.max(2, h >> 1);
    this.rt = tex2D(this.w, this.h, { fmt: 'rgba16f', filter: 'linear', wrap: 'clamp' });
    this.fRT = makeFBO([this.rt]);
  }

  // Map the user's cloud slider (0..1) plus storminess to layer parameters.
  setWeather(cloud, storm) {
    const c = Math.min(1, Math.max(0, cloud));
    const cover = c < 0.02 ? 0 : Math.min(1, 0.06 + 0.98 * Math.pow(c, 0.9));
    const type = Math.min(1, Math.max(0, (c - 0.62) / 0.3));
    const base = 1650 - 850 * type - 350 * storm;
    const thick = 1500 - 700 * type + 1500 * storm;
    this.p = { cover, type, base, top: base + thick, dark: Math.min(1, Math.max(0, 0.15 * type + storm * 0.95 + 0.0)), density: 0.05 };
  }

  advance(dt, windVec) {
    // clouds drift slower than the surface wind
    this.windOff[0] += windVec[0] * dt; this.windOff[1] += windVec[1] * dt;
  }

  _uniforms(p, sky, s, camAbs, flash) {
    sky.setLightUniforms(p, s, camAbs[1]);
    p.t('uTransLUT', 0, sky.trans).t('uSkyLUT', 1, sky.view);
    p.t('uShape', 2, this.shape, gl.TEXTURE_3D).t('uDetail', 3, this.detail, gl.TEXTURE_3D).t('uWeather', 4, this.weather);
    const c = this.p;
    p.v4('uCloudA', c.cover, c.type, c.base, c.top).v4('uCloudB', c.density, c.dark, this.windOff[0], this.windOff[1])
      .v3('uCamAbs', camAbs[0], camAbs[1], camAbs[2]).v4('uFlash', flash ? flash : [0, 0, 0, 0]);
  }

  renderView(sky, s, camAbs, invVP, frame, steps, flash) {
    bindFBO(this.fRT); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p = this.pCloud.use();
    this._uniforms(p, sky, s, camAbs, flash);
    p.m4('uInvVP', invVP).f('uFrame', frame % 64).i('uSteps', steps);
    drawFS();
  }

  renderShadow(sky, s, camAbs, steps = 12) {
    bindFBO(this.fShadow); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p = this.pShadow.use();
    this._uniforms(p, sky, s, camAbs, null);
    const snap = (2 * this.shadowExtent) / this.shadowRes;
    this.shadowCenter = [Math.round(camAbs[0] / snap) * snap, Math.round(camAbs[2] / snap) * snap];
    p.v2('uCenter', this.shadowCenter[0], this.shadowCenter[1]).f('uExtent', this.shadowExtent).i('uSteps', steps);
    drawFS();
  }

  renderEnv(sky, s, camAbs, steps = 24, flash) {
    bindFBO(this.fEnv); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p = this.pEnv.use();
    this._uniforms(p, sky, s, camAbs, flash);
    p.i('uSteps', steps);
    drawFS();
    gl.bindTexture(gl.TEXTURE_2D, this.env.tex); gl.generateMipmap(gl.TEXTURE_2D);
  }
}
