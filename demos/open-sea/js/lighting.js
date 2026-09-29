// Per-frame lighting table (sun/moon/sky irradiance) and the shared GLSL used by every lit program.
import { gl, Program, FS_VERT, tex2D, makeFBO, bindFBO, drawFS, defineChunk } from './gl.js';
import './glsl.js';

defineChunk('lighting', `
uniform sampler2D uEnv, uCloudShadow, uLightTex;
uniform vec3 uCamAbs;
uniform vec3 uShadowInfo;   // centre x, centre z, extent
uniform float uShadowAvg;
uniform vec4 uFlashLight;   // xyz direction to flash, w pre-exposed irradiance
vec3 envRadiance(vec3 d, float lod) { return textureLod(uEnv, dirToHemiOct(d), lod).rgb; }
// Colour of the air at the horizon in a given azimuth, including whatever cloud deck lies there (env map), for aerial perspective.
vec3 horizonColor(vec3 dirH) { return envRadiance(normalize(vec3(dirH.x, 0.03, dirH.z)), 1.2); }
vec3 lightSun() { return texelFetch(uLightTex, ivec2(0, 0), 0).rgb; }
vec3 lightMoon() { return texelFetch(uLightTex, ivec2(1, 0), 0).rgb; }
vec3 lightSky() { return texelFetch(uLightTex, ivec2(2, 0), 0).rgb; }   // irradiance on a horizontal plane
vec3 lightGround() { return texelFetch(uLightTex, ivec2(3, 0), 0).rgb; } // radiance bounced up from the sea
vec3 flashE(vec3 n) {   // irradiance from a nearby lightning stroke, relative to the ambient sky level
  if (uFlashLight.w <= 0.0) return vec3(0.0);
  return vec3(0.78, 0.86, 1.0) * uFlashLight.w * luma(lightSky()) * (0.35 + 0.65 * max(dot(n, uFlashLight.xyz), 0.0));
}
float cloudShadowAt(vec2 relXZ) {
  vec2 q = (uCamAbs.xz + relXZ - uShadowInfo.xy) / (2.0 * uShadowInfo.z) + 0.5;
  float edge = smoothstep(0.80, 0.98, max(abs(q.x - 0.5), abs(q.y - 0.5)) * 2.0);
  float t = textureLod(uCloudShadow, q, 0.0).r;
  return mix(t, uShadowAvg, edge);
}
// Diffuse ambient radiance arriving at a surface with normal n (cosine-weighted, blurred env).
vec3 ambientFor(vec3 n) {
  float t = clamp(n.y, -1.0, 1.0);
  vec3 sky = lightSky() / PI;                                 // uniform-hemisphere equivalent radiance (not zenith-blue)
  vec3 hemi = sky * mix(0.62, 1.05, smoothstep(-0.2, 1.0, t));
  vec3 side = envRadiance(normalize(vec3(n.x, 0.28, n.z)), 5.0);   // sun-side / horizon glow for walls
  vec3 a = mix(hemi, 0.65 * hemi + 0.35 * side, 1.0 - abs(t));
  return mix(a, lightGround(), smoothstep(0.1, -0.7, t) * 0.85);
}
`);

const LIGHT_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
uniform sampler2D uEnv;
uniform float uFlashE;
in vec2 vUv;
out vec4 o;
vec3 envR(vec3 d, float lod) { return textureLod(uEnv, dirToHemiOct(d), lod).rgb; }
void main() {
  int i = int(gl_FragCoord.x);
  vec3 r = vec3(0.0);
  if (i == 0) r = sunIrradiance(0.0);
  else if (i == 1) r = moonIrradiance();
  else if (i == 2) {
    // irradiance on a horizontal plane: cosine-weighted bands of the blurred env map
    vec3 e = 0.372 * envR(vec3(0.0, 1.0, 0.0), 5.0);
    vec3 a = vec3(0.0), b = vec3(0.0), c = vec3(0.0);
    for (int k = 0; k < 4; k++) {
      float az = float(k) * 1.5708 + 0.3927;
      vec2 cs = vec2(cos(az), sin(az));
      a += envR(normalize(vec3(cs.x * 0.574, 0.819, cs.y * 0.574)), 5.0);
      b += envR(normalize(vec3(cs.x * 0.891, 0.454, cs.y * 0.891)), 5.0);
      c += envR(normalize(vec3(cs.x * 0.993, 0.122, cs.y * 0.993)), 5.0);
    }
    r = e + 1.49 * 0.25 * a + 1.09 * 0.25 * b + 0.21 * 0.25 * c;
    // skylight is scattered again by ground, sea, cloud and aerosol: the irradiance is less blue than the zenith radiance
    r = mix(vec3(dot(r, vec3(0.2126, 0.7152, 0.0722))), r, 0.52);
  } else if (i == 3) {
    // light bounced up from a dark sea: a fraction of what falls on it, tinted teal
    vec3 s = sunIrradiance(0.0) * max(uSunDir.y, 0.0) + moonIrradiance() * max(uMoonDir.y, 0.0);
    vec3 e = 0.372 * envR(vec3(0.0, 1.0, 0.0), 5.0) + envR(vec3(0.7, 0.4, 0.0), 5.0) * 1.3 + envR(vec3(-0.7, 0.4, 0.0), 5.0) * 1.3;
    r = (s + e) * vec3(0.012, 0.030, 0.038) + envR(vec3(0.0, 0.05, 1.0), 6.0) * 0.06;
  }
  o = vec4(r, 1.0);
}`;

export class Lighting {
  constructor() {
    this.tex = tex2D(8, 1, { fmt: 'rgba32f', filter: 'nearest' });
    this.fbo = makeFBO([this.tex]);
    this.prog = new Program('lighting.table', FS_VERT, LIGHT_FS);
  }
  update(sky, sk, camAlt, envTex) {
    bindFBO(this.fbo); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const p = this.prog.use();
    sky.setLightUniforms(p, sk, camAlt);
    p.t('uTransLUT', 0, sky.trans).t('uSkyLUT', 1, sky.view).t('uEnv', 2, envTex);
    drawFS();
  }
}

// Bind everything the 'lighting' chunk (and atmo.sample) need. Units 0,1 and 11..14 are reserved.
export function bindLighting(p, ctx) {
  const { sky, clouds, light, sk, camAbs } = ctx;
  sky.setLightUniforms(p, sk, camAbs[1]);
  p.t('uTransLUT', 0, sky.trans).t('uSkyLUT', 1, sky.view);
  p.t('uEnv', 11, clouds.env).t('uCloudShadow', 12, clouds.shadow).t('uLightTex', 13, light.tex);
  p.v3('uCamAbs', camAbs[0], camAbs[1], camAbs[2]).v3('uShadowInfo', clouds.shadowCenter[0], clouds.shadowCenter[1], clouds.shadowExtent);
  p.f('uShadowAvg', 1 - 0.55 * clouds.p.cover);
  p.v4('uFlashLight', ctx.flashLight || [0, 1, 0, 0]);
}
