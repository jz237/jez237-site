// Atmosphere LUTs and the sky background pass (sun, moon, stars, clouds composite).
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS } from './gl.js';
import './glsl.js';
import { waterParams } from './water-types.js';

const DEFAULT_WATER_PARAMS = waterParams();

const TRANS_FS = `
#include <common>
#include <atmo>
in vec2 vUv;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy / vec2(256.0, 64.0);
  float r, mu; transParams(uv, r, mu);
  vec3 pos = vec3(0.0, r, 0.0), dir = vec3(sqrt(max(0.0, 1.0 - mu * mu)), mu, 0.0);
  float tMax = raySphere(pos, dir, RT);
  const int N = 48;
  float dt = tMax / float(N);
  vec3 od = vec3(0.0);
  for (int i = 0; i < N; i++) {
    vec3 x = pos + dir * ((float(i) + 0.5) * dt);
    vec3 sR, ext; float sM; atmoMedium(length(x) - RG, 1.0, sR, sM, ext);
    od += ext * dt;
  }
  o = vec4(exp(-od), 1.0);
}`;

const MS_FS = `
#include <common>
#include <atmo>
uniform sampler2D uTransLUT;
uniform float uHaze;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy / 32.0;
  float cosSun = uv.x * 2.0 - 1.0;
  float alt = 100.0 * uv.y * uv.y;
  vec3 sunDir = vec3(sqrt(max(0.0, 1.0 - cosSun * cosSun)), cosSun, 0.0);
  vec3 pos = vec3(0.0, RG + max(alt, 0.0005), 0.0);
  vec3 Lsum = vec3(0.0), Fsum = vec3(0.0);
  for (int a = 0; a < 8; a++) for (int b = 0; b < 8; b++) {
    float u1 = (float(a) + 0.5) / 8.0, u2 = (float(b) + 0.5) / 8.0;
    float cosT = 1.0 - 2.0 * u1, sinT = sqrt(max(0.0, 1.0 - cosT * cosT)), phi = TAU * u2;
    vec3 dir = vec3(sinT * cos(phi), cosT, sinT * sin(phi));
    float tG = raySphere(pos, dir, RG), tT = raySphere(pos, dir, RT);
    bool hitG = tG > 0.0;
    float tMax = hitG ? tG : tT;
    const int N = 20;
    float dt = tMax / float(N);
    vec3 T = vec3(1.0), L = vec3(0.0), F = vec3(0.0);
    for (int i = 0; i < N; i++) {
      vec3 x = pos + dir * ((float(i) + 0.5) * dt);
      float r = length(x);
      vec3 sR, ext; float sM; atmoMedium(r - RG, uHaze, sR, sM, ext);
      vec3 sunT = texture(uTransLUT, transUV(r, dot(x / r, sunDir))).rgb;
      float sh = raySphere(x, sunDir, RG) > 0.0 ? 0.0 : 1.0;
      vec3 Ts = exp(-ext * dt);
      vec3 integ = (1.0 - Ts) / max(ext, vec3(1e-9));
      vec3 scat = sR + sM;
      L += T * (scat * sunT * sh / (4.0 * PI)) * integ;
      F += T * scat * integ;
      T *= Ts;
    }
    if (hitG) {
      vec3 x = pos + dir * tG; float r = length(x);
      vec3 n = x / r;
      vec3 sunT = texture(uTransLUT, transUV(r, dot(n, sunDir))).rgb;
      L += T * sunT * max(dot(n, sunDir), 0.0) * 0.06 / PI;
    }
    Lsum += L; Fsum += F;
  }
  vec3 Lavg = Lsum / 64.0, Favg = Fsum / 64.0;
  o = vec4(Lavg / (1.0 - Favg), 1.0);
}`;

const SKYVIEW_FS = `
#include <common>
#include <atmo>
uniform sampler2D uTransLUT, uMSLUT;
uniform float uCamR, uHaze;
uniform vec3 uSunDir, uSunCol, uMoonDir, uMoonCol;
uniform vec2 uSize;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec3 dir = skyUVToDir(uv);
  vec3 pos = vec3(0.0, uCamR, 0.0);
  float tG = raySphere(pos, dir, RG), tT = raySphere(pos, dir, RT);
  float tMax = tG > 0.0 ? tG : tT;
  const int N = 32;
  vec3 L = vec3(0.0), T = vec3(1.0);
  for (int i = 0; i < N; i++) {
    float fa = float(i) / float(N), fb = float(i + 1) / float(N);
    float ta = tMax * fa * fa, tb = tMax * fb * fb;
    float t = 0.5 * (ta + tb), dt = tb - ta;
    vec3 x = pos + dir * t;
    float r = length(x); vec3 up = x / r;
    vec3 sR, ext; float sM; atmoMedium(r - RG, uHaze, sR, sM, ext);
    vec3 S = vec3(0.0);
    for (int l = 0; l < 2; l++) {
      vec3 ld = l == 0 ? uSunDir : uMoonDir;
      vec3 lc = l == 0 ? uSunCol : uMoonCol;
      float mu = dot(up, ld);
      vec3 lt = texture(uTransLUT, transUV(r, mu)).rgb;
      float sh = raySphere(x, ld, RG) > 0.0 ? 0.0 : 1.0;
      float cv = dot(dir, ld);
      S += lc * ((sR * phaseR(cv) + sM * phaseM(cv, 0.8)) * lt * sh + (sR + sM) * texture(uMSLUT, msUV(r, mu)).rgb);
    }
    vec3 Ts = exp(-ext * dt);
    L += T * (S - S * Ts) / max(ext, vec3(1e-9));
    T *= Ts;
  }
  o = vec4(L, 1.0);
}`;

const SKY_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
in vec2 vUv;
uniform mat4 uInvVP;
uniform mat3 uStarRot;
uniform float uStarLevel, uTime;
uniform sampler2D uCloud;
uniform float uCloudOn;
uniform vec2 uCloudTexel;
out vec4 o;

// ---- stars ------------------------------------------------------------------------------
vec3 starLayer(vec3 dc, float scale, float density, float pixel) {
  vec3 p = dc * scale, ip = floor(p), fp = p - ip;
  vec3 h = hash33(ip);
  if (h.x > density) return vec3(0.0);
  vec3 sp = 0.2 + 0.6 * hash33(ip + 7.7);
  float d = length(fp - sp);
  float sigma = max(0.55 * pixel * scale, 0.0015);
  float mag = pow(hash31(ip + 3.3), 6.0);
  float e = exp(-0.5 * sq(d / sigma));
  float area = sq(sigma) / sq(0.0015);
  vec3 tint = mix(vec3(1.0, 0.72, 0.5), vec3(0.65, 0.78, 1.0), hash31(ip + 11.1));
  tint = mix(vec3(1.0), tint, 0.55);
  return tint * e * (0.25 + 5.0 * mag) * (0.0015 * 0.0015 * 6.0) / max(sq(sigma), 1e-8) * 0.6;
}
vec3 milkyWay(vec3 dc) {
  vec3 g = normalize(vec3(0.41, 0.78, 0.47));
  float b = dot(dc, g);
  float band = exp(-sq(b / 0.16));
  vec3 q = dc * 5.0;
  float n = fbm2(q.xy * 1.3 + q.z * 2.1) * 0.7 + fbm2(q.zx * 3.7 + 4.0) * 0.5;
  float lane = smoothstep(0.35, 0.75, fbm2(q.yz * 4.5 + 9.0)) * exp(-sq(b / 0.06));
  float core = exp(-sq((dot(dc, normalize(vec3(-0.6, 0.15, 0.78)))) * 0.0 + b / 0.28));
  return vec3(0.85, 0.9, 1.0) * band * (0.45 * n + 0.25) * (1.0 - 0.6 * lane) * 0.055;
}

void main() {
  vec4 c = uInvVP * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 d = normalize(c.xyz / c.w);
  vec3 L = skyRadiance(d);
  float px = length(fwidth(d));

  // sun
  const float SUN_R = 0.004675;
  vec3 sunE = sunIrradiance(0.0);
  // Chord distance avoids subtracting almost-equal dot products near 1.0.
  // Cosine thresholds can round to identical edges on phone shader hardware.
  float chord = length(d-uSunDir), radius=2.0*sin(SUN_R*.5);
  float discWidth=max(1.0e-6,px*1.2);
  float edge = 1.0-smoothstep(radius-discWidth,radius+discWidth,chord);
  float rr = clamp(chord/radius, 0.0, 1.0);
  float limb = 0.4 + 0.6 * sqrt(max(1.0 - rr * rr, 0.0));
  L += min(sunE / (PI * SUN_R * SUN_R) * limb, vec3(60000.0)) * edge * step(0.0, d.y + 0.004);

  // moon
  const float MOON_R = 0.00453;
  vec3 mE = uMoonCol;
  float mc = dot(d, uMoonDir);
  if (mc > cos(MOON_R * 1.6)) {
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), uMoonDir));
    vec3 upv = cross(uMoonDir, right);
    vec2 ab = vec2(dot(d, right), dot(d, upv)) / MOON_R;
    float r2 = dot(ab, ab);
    float cov = smoothstep(1.0 + 1.5 * px / MOON_R, 1.0 - 1.5 * px / MOON_R, sqrt(r2));
    if (cov > 0.0) {
      vec3 nrm = normalize(vec3(ab, sqrt(max(1.0 - r2, 0.0))));
      vec3 wn = ab.x * right + ab.y * upv - sqrt(max(1.0 - r2, 0.0)) * uMoonDir;
      float lit = max(dot(wn, uSunDir), 0.0);
      float m = fbm2(ab * 1.9 + 3.1) * 0.6 + fbm2(ab * 5.0 + 9.0) * 0.4;
      float maria = smoothstep(0.42, 0.62, m);
      float crater = pow(hash21(floor(ab * 14.0)), 12.0) * 0.5;
      float alb = mix(0.16, 0.075, maria) * (1.0 + crater);
      float limbd = 0.75 + 0.25 * nrm.z;
      float sunPre = uSunCol.r; // pre-exposure carrier (sun col = pre)
      float mvis = smoothstep(-0.012, 0.004, uMoonDir.y);
      vec3 moonL = vec3(sunPre) * alb / PI * lit * limbd * mvis * vec3(1.0, 0.97, 0.92);
      L = mix(L, L + min(moonL, vec3(50000.0)), cov);
    }
  }
  // stars
  if (uStarLevel > 0.0 && d.y > -0.05) {
    vec3 dc = uStarRot * d;
    vec3 s = starLayer(dc, 38.0, 0.22, px) + starLayer(dc, 92.0, 0.18, px) + starLayer(dc, 190.0, 0.14, px);
    s += milkyWay(dc);
    float horizon = smoothstep(-0.02, 0.12, d.y);
    L += s * uStarLevel * horizon * 16.0;
  }
  // clouds
  float alpha = 1.0;
  if (uCloudOn > 0.5) {
    vec4 cl = texture(uCloud, vUv);
    L = L * cl.a + cl.rgb;
  }
  o = vec4(min(L, vec3(60000.0)), 1.0);
}`;

export class Sky {
  constructor() {
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    this.trans = tex2D(256, 64, { fmt: 'rgba16f' });
    this.ms = tex2D(32, 32, { fmt: 'rgba16f' });
    this.view = tex2D(256, 128, { fmt: 'rgba16f', wrapS: 'repeat', wrapT: 'clamp' });
    this.fTrans = makeFBO([this.trans]); this.fMS = makeFBO([this.ms]); this.fView = makeFBO([this.view]);
    this.pTrans = new Program('sky.trans', FS_VERT, TRANS_FS);
    this.pMS = new Program('sky.ms', FS_VERT, MS_FS);
    this.pView = new Program('sky.view', FS_VERT, SKYVIEW_FS);
    this.pSky = new Program('sky.draw', FS_VERT, SKY_FS);
    bindFBO(this.fTrans); this.pTrans.use(); drawFS();
    this.haze = -1;
  }

  // Multiple-scattering table depends only on the haze scale.
  _ms(haze) {
    if (Math.abs(haze - this.haze) < 0.02) return;
    this.haze = haze;
    bindFBO(this.fMS); this.pMS.use().t('uTransLUT', 0, this.trans).f('uHaze', haze); drawFS();
  }

  setLightUniforms(p, s, camAlt) {
    p.v3('uSunDir', s.sunDir).v3('uSunCol', s.sunCol).v3('uMoonDir', s.moonDir).v3('uMoonCol', s.moonCol)
      .v3('uAirglow', s.airglow).f('uCamAlt', camAlt).f('uHaze', s.haze).f('uOvercast', s.overcast || 0);
    const w = s.water || DEFAULT_WATER_PARAMS;
    p.v3v('uCATT', w.catt).v3v('uKD', w.kd).v3v('uRRS', w.rrs).v3v('uRw', w.rw).v3v('uSSS', w.sss);
  }

  updateLUT(s, camAlt) {
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    this._ms(s.haze);
    bindFBO(this.fView);
    this.pView.use().t('uTransLUT', 0, this.trans).t('uMSLUT', 1, this.ms)
      .f('uCamR', 6360 + Math.max(camAlt, 0.5) * 0.001).f('uHaze', s.haze)
      .v3('uSunDir', s.sunDir).v3('uSunCol', s.sunCol).v3('uMoonDir', s.moonDir).v3('uMoonCol', s.moonCol)
      .v2('uSize', 256, 128);
    drawFS();
  }

  draw(s, camAlt, invVP, starRot, time, cloudTex) {
    const p = this.pSky.use();
    p.t('uTransLUT', 0, this.trans).t('uSkyLUT', 1, this.view);
    this.setLightUniforms(p, s, camAlt);
    p.m4('uInvVP', invVP).m3('uStarRot', starRot).f('uStarLevel', s.starLevel).f('uTime', time);
    if (cloudTex) { p.t('uCloud', 2, cloudTex).f('uCloudOn', 1); } else p.f('uCloudOn', 0);
    drawFS();
  }
}
