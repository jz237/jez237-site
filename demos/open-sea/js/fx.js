// Scene composite: rain veil above water, physically based underwater medium below (absorption, path radiance,
// caustic-modulated sun shafts), plus the caustic map that drives the shafts.
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS } from './gl.js';
import { bindLighting } from './lighting.js';
import './glsl.js';

export const CAUSTIC_SIZE = 24;
export const CAUSTIC_RES = 512;

import { defineChunk } from './gl.js';
defineChunk('underwater', `
uniform float uUseSun;       // 1: sun drives the underwater beam, 0: moon
uniform sampler2D uCaustic;
uniform vec3 uCausticInfo;   // camera x, z modulo the caustic tile, tile size (m)
// Focusing of the sun beam at a point rel (camera-relative) that lies z metres below the surface.
float causticGainRel(vec3 rel, float z, vec3 sunW, float dtBlur) {
  vec2 q = rel.xz - sunW.xz * (z / max(-sunW.y, 0.15));
  vec2 uv = fract((uCausticInfo.xy + q) / uCausticInfo.z);
  float lod = clamp(log2(max(dtBlur * 0.6, 0.047) / 0.047), 0.0, 6.0);
  vec2 g = textureLod(uCaustic, uv, lod).rg;
  return z < 2.2 ? mix(1.0, g.x, z / 2.2) : (z < 7.0 ? mix(g.x, g.y, (z - 2.2) / 4.8) : mix(g.y, 1.0, smoothstep(7.0, 45.0, z)));
}
const vec3 CATT = vec3(0.41, 0.100, 0.046);     // beam attenuation c = a + b   (1/m)
const vec3 KD   = vec3(0.34, 0.078, 0.030);     // diffuse attenuation
const vec3 RRS  = vec3(0.0045, 0.0200, 0.0330); // remote-sensing reflectance of clear blue water (1/sr)
// Light entering the sea at the camera: refracted beam direction, beam irradiance and total downwelling irradiance.
void underwaterLight(out vec3 sunW, out vec3 beam, out vec3 Ed0) {
  float sh = cloudShadowAt(vec2(0.0));
  vec3 Ld = uUseSun > 0.5 ? uSunDir : uMoonDir;
  vec3 E = (uUseSun > 0.5 ? lightSun() : lightMoon()) * sh;
  float mu = max(Ld.y, 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - mu, 5.0);
  sunW = refract(-Ld, vec3(0.0, 1.0, 0.0), 0.75);
  if (Ld.y < 0.03) { sunW = vec3(0.0, -1.0, 0.0); E = vec3(0.0); }
  beam = E * (1.0 - F);
  Ed0 = beam * mu + lightSky() * 0.94 + (uUseSun > 0.5 ? lightMoon() * max(uMoonDir.y, 0.0) : vec3(0.0));
}
`);

// ---------------------------------------------------------------------------------------------------------------
const CAUSTIC_FS = `
#include <common>
#include <water.uv>
in vec2 vUv;
uniform sampler2DArray uSlope;
uniform vec3 uSunDirW;       // direction light travels in water (downwards)
uniform vec2 uDepths;        // reference depths
uniform vec2 uTileInfo;      // world position of the tile origin corner: handled through uv
uniform vec2 uCenterOff;     // camera-snapped centre modulo tile (metres)
uniform float uSize;
out vec4 o;
vec2 slopeAt(vec2 g) {
  vec2 S = vec2(0.0);
  for (int i = 0; i < 5; i++) {
    if (i >= uCascades) break;
    vec4 s = textureLod(uSlope, vec3(cascUV(i, g), float(i)), 0.0);
    S += toWorld(s.xy, i);
  }
  return S;
}
vec2 mapTo(vec2 g, float D) {
  vec2 S = slopeAt(g);
  vec3 n = normalize(vec3(-S.x, 1.0, -S.y));
  vec3 r = refract(uSunDirW, n, 1.0 / 1.333);
  if (r.y > -0.02) return g;
  return g + r.xz * (D / -r.y);
}
void main() {
  vec2 g = (vUv - 0.5) * uSize;      // offset from the (snapped) centre in metres
  float e = 0.05;
  vec2 gain = vec2(1.0);
  for (int k = 0; k < 2; k++) {
    float D = k == 0 ? uDepths.x : uDepths.y;
    vec2 a = mapTo(g, D), bx = mapTo(g + vec2(e, 0.0), D), bz = mapTo(g + vec2(0.0, e), D);
    vec2 ex = (bx - a) / e, ez = (bz - a) / e;
    float det = ex.x * ez.y - ex.y * ez.x;
    float ga = clamp(1.0 / max(abs(det), 0.06), 0.0, 7.0);
    // Fresnel transmission at the entry point
    vec2 S = slopeAt(g); vec3 n = normalize(vec3(-S.x, 1.0, -S.y));
    float ci = max(dot(-uSunDirW, n), 0.0);
    float F = 0.02 + 0.98 * pow(1.0 - ci, 5.0);
    if (k == 0) gain.x = ga * (1.0 - F); else gain.y = ga * (1.0 - F);
  }
  o = vec4(gain, 0.0, 1.0);
}`;

const FX_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
in vec2 vUv;
#include <underwater>
uniform sampler2D uScene, uDepth;
uniform mat4 uInvVP;
uniform vec3 uFwd;
uniform float uNear, uFar;
uniform vec3 uCam;            // absolute camera position, y = height above mean sea level
uniform float uUnder, uSurfY;
uniform float uRain, uTime, uCloudBase, uFlash;
out vec4 o;
vec3 uSunW, uBeamCol, uEd0;
const float BSC = 0.085;                        // scattering coefficient (1/m)

float hg(float c, float g) { float g2 = g * g; return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * c, 1.5)); }
float causticGain(vec3 p, float z, float dt) { return causticGainRel(p - uCam, z, uSunW, dt); }

void main() {
  vec3 scene = texture(uScene, vUv).rgb;
  float dRaw = texture(uDepth, vUv).r;
  vec4 c = uInvVP * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 dir = normalize(c.xyz / c.w);
  float zn = 2.0 * dRaw - 1.0;
  float viewZ = 2.0 * uNear * uFar / (uFar + uNear - zn * (uFar - uNear));
  float dist = dRaw >= 0.99999 ? 1e5 : viewZ / max(dot(dir, uFwd), 0.05);
  vec3 col = scene;

  if (uUnder > 0.5) {
    underwaterLight(uSunW, uBeamCol, uEd0);
    float dmax = min(dist, 110.0);
    float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    const int N = 30;
    vec3 T = vec3(1.0), Lp = vec3(0.0), Lsh = vec3(0.0);
    float cosS = -dot(uSunW, dir);
    float ph = 0.85 * hg(cosS, 0.89) + 0.02;
    // the underwater light field is far brighter looking up than down
    float aniso = mix(0.45, 2.4, smoothstep(-1.0, 0.25, dir.y)) * (1.0 + 0.6 * smoothstep(0.25, 1.0, dir.y));
    for (int i = 0; i < N; i++) {
      float fa = (float(i) + jit * 0.0) / float(N), fb = (float(i) + 1.0) / float(N);
      float ta = dmax * fa * fa, tb = dmax * fb * fb;
      float t = 0.5 * (ta + tb), dt = tb - ta;
      vec3 p = uCam + dir * t;
      float z = max(uSurfY - p.y, 0.0);
      vec3 Ts = exp(-CATT * dt);
      Lp += T * RRS * uEd0 * exp(-KD * z) * aniso * (1.0 - Ts);
      vec3 beam = uBeamCol * exp(-CATT * z / max(-uSunW.y, 0.25));
      Lsh += T * beam * (causticGain(p, z, dt) * BSC * ph * dt);
      T *= Ts;
    }
    if (dist < 1e4) {
      vec3 ph_ = uCam + dir * dist;
      float zo = max(uSurfY - ph_.y, 0.0);
      col = scene * exp(-KD * zo);
    } else col = vec3(0.0);
    // remaining transmittance for the part of the path beyond dmax
    col = col * T + Lp + Lsh;
  } else if (uRain > 0.01) {
    // rain veil: absorption/scatter by falling rain, patchy in space so heavy squall curtains show against the horizon
    float dm = min(dist, 16000.0);
    const int N = 12;
    float tau = 0.0;
    vec3 base = uCam;
    float dens0 = uRain * uRain * 0.00046 + uRain * 0.00007;
    for (int i = 0; i < N; i++) {
      float f0 = float(i) / float(N), f1 = float(i + 1) / float(N);
      float t = dm * 0.5 * (f0 * f0 + f1 * f1), dt = dm * (f1 * f1 - f0 * f0);
      vec3 p = base + dir * t;
      float cellN = vnoise((p.xz + vec2(uTime * 14.0, uTime * 6.0)) / 1900.0) * 0.6 + vnoise((p.xz + vec2(uTime * 25.0, 0.0)) / 620.0) * 0.4;
      float hm = smoothstep(uCloudBase + 200.0, uCloudBase - 300.0, p.y);
      float ptch = mix(0.35, 1.9, smoothstep(0.3, 0.75, cellN));
      tau += dens0 * ptch * hm * dt;
    }
    float Tr = exp(-tau);
    vec3 fog = (lightSky() / PI * 0.72 + lightSun() * 0.03 * uShadowAvg + lightMoon() * 0.05) * (1.0 + uFlash * 3.0);
    col = scene * Tr + fog * (1.0 - Tr);
  }
  o = vec4(col, 1.0);
}`;

export class Fx {
  constructor() {
    this.prog = new Program('fx.composite', FS_VERT, FX_FS);
    this.pCaustic = new Program('fx.caustic', FS_VERT, CAUSTIC_FS);
    this.caustic = tex2D(CAUSTIC_RES, CAUSTIC_RES, { fmt: 'rg16f', filter: 'linear', wrap: 'repeat', mips: true });
    this.fCaustic = makeFBO([this.caustic]);
  }

  updateCaustics(sim, sunW, cam) {
    const tex = CAUSTIC_SIZE / CAUSTIC_RES;
    const cx = Math.round(cam.x / tex) * tex, cz = Math.round(cam.z / tex) * tex;
    const { scale, off } = sim.cascadeUniforms(cx, cz);
    bindFBO(this.fCaustic); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    this.pCaustic.use().t('uSlope', 0, sim.slope).i('uCascades', sim.count).v4v('uCasc', scale).v2v('uCen', off)
      .v3('uSunDirW', sunW[0], sunW[1], sunW[2]).v2('uDepths', 2.2, 7.0).f('uSize', CAUSTIC_SIZE)
      .v2('uNoiseOrg', scale[5] * cx + scale[6] * cz, -scale[6] * cx + scale[5] * cz);
    drawFS();
    gl.bindTexture(gl.TEXTURE_2D, this.caustic.tex); gl.generateMipmap(gl.TEXTURE_2D);
    this.center = [cx, cz];
  }

  // bind the caustic map (unit 6) and its addressing for any program that includes the 'underwater' chunk
  bindCaustic(p, cam) {
    const S = CAUSTIC_SIZE, m = v => v - Math.floor(v / S) * S;
    p.t('uCaustic', 6, this.caustic).v3('uCausticInfo', m(cam.x), m(cam.z), S);
  }

  composite(post, ctx, o) {
    const p = this.prog.use();
    bindLighting(p, ctx);
    p.t('uScene', 4, post.colorCopy).t('uDepth', 5, post.depthCopy);
    this.bindCaustic(p, ctx.cam);
    p.m4('uInvVP', o.invVP).v3('uFwd', o.fwd[0], o.fwd[1], o.fwd[2]).f('uNear', o.near).f('uFar', o.far)
      .v3('uCam', ctx.cam.x, ctx.cam.y, ctx.cam.z).f('uUnder', o.under ? 1 : 0).f('uSurfY', o.surfY)
      .f('uRain', o.rain).f('uTime', ctx.time).f('uCloudBase', o.cloudBase).f('uFlash', o.flash)
      .f('uUseSun', o.useSun ? 1 : 0);
    drawFS();
  }
}
