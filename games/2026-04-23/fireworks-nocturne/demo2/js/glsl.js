// Shared GLSL. Every firework particle moves on a closed-form path, so the
// vertex shaders evaluate position from (birth state, age) with no history:
// trails are the same path sampled at earlier times, and the show can be
// paused, slowed or seeked without any simulation state on the GPU.

export const NL = 12; // dynamic lights passed to every lit shader

export const HASH = /* glsl */ `
uint pcg(uint v) {
  uint s = v * 747796405u + 2891336453u;
  uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}
float h1(uint v) { return float(pcg(v)) * (1.0 / 4294967295.0); }
float h1f(float seed, float n) { return h1(uint(seed * 16777215.0) * 0x9E3779B9u ^ uint(int(n) + 1048576) * 0x85EBCA6Bu); }
vec3 h3f(float seed, float n) {
  uint b = uint(seed * 16777215.0) * 0x9E3779B9u ^ uint(int(n) + 1048576) * 0x85EBCA6Bu;
  return vec3(h1(b), h1(b ^ 0x68E31DA4u), h1(b ^ 0xB5297A4Du));
}
vec3 sphereDir(vec3 r) {
  float z = r.x * 2.0 - 1.0;
  float a = r.y * 6.2831853;
  float s = sqrt(max(0.0, 1.0 - z * z));
  return vec3(s * cos(a), z, s * sin(a));
}
`;

export const MOTION = /* glsl */ `
uniform vec3 uWind;
const vec3 GRAV = vec3(0.0, -9.81, 0.0);

// Star: quadratic drag along the launch direction (ln law) plus a linear-drag
// fall toward terminal velocity (gravity + wind). c = quadratic drag, kg = fall drag.
vec3 starPos(vec3 p0, vec3 v0, float c, float kg, float t) {
  float sp = length(v0);
  vec3 d = sp > 1e-4 ? v0 / sp : vec3(0.0);
  float radial = c > 1e-6 ? log(1.0 + c * sp * t) / c : sp * t;
  vec3 vt = uWind + GRAV / kg;
  return p0 + d * radial + vt * (t - (1.0 - exp(-kg * t)) / kg);
}
vec3 starVel(vec3 p0, vec3 v0, float c, float kg, float t) {
  float sp = length(v0);
  vec3 d = sp > 1e-4 ? v0 / sp : vec3(0.0);
  vec3 vt = uWind + GRAV / kg;
  return d * (sp / (1.0 + c * sp * t)) + vt * (1.0 - exp(-kg * t));
}
// Spark shed by a star: linear drag toward its own terminal velocity.
vec3 sparkPos(vec3 pb, vec3 vb, float ks, float a) {
  vec3 vt = uWind + GRAV / ks;
  return pb + vt * a + (vb - vt) * ((1.0 - exp(-ks * a)) / ks);
}
`;

// Planckian colour, linear sRGB, normalised to the red channel.
export const BLACKBODY = /* glsl */ `
vec3 blackbody(float k) {
  if (k < 1500.0) return mix(vec3(1.0, 0.035, 0.0), vec3(1.0, 0.15, 0.0), clamp((k - 1000.0) / 500.0, 0.0, 1.0));
  if (k < 2000.0) return mix(vec3(1.0, 0.15, 0.0), vec3(1.0, 0.25, 0.006), (k - 1500.0) / 500.0);
  if (k < 2500.0) return mix(vec3(1.0, 0.25, 0.006), vec3(1.0, 0.356, 0.065), (k - 2000.0) / 500.0);
  if (k < 3000.0) return mix(vec3(1.0, 0.356, 0.065), vec3(1.0, 0.456, 0.147), (k - 2500.0) / 500.0);
  if (k < 4000.0) return mix(vec3(1.0, 0.456, 0.147), vec3(1.0, 0.637, 0.366), (k - 3000.0) / 1000.0);
  return mix(vec3(1.0, 0.637, 0.366), vec3(1.0), clamp((k - 4000.0) / 2500.0, 0.0, 1.0));
}
`;

// Dynamic lights: xyz = position, w = softening radius; colour rgb * intensity.
export const LIGHTS = /* glsl */ `
#define NL ${NL}
uniform vec4 uLP[NL];
uniform vec4 uLC[NL];
uniform int uLN;
// Light received at p (illuminance), with each light softened by its radius.
vec3 lightAt(vec3 p) {
  vec3 s = vec3(0.0);
  for (int i = 0; i < NL; i++) {
    if (i >= uLN) break;
    vec3 d = uLP[i].xyz - p;
    s += uLC[i].rgb / (dot(d, d) + uLP[i].w * uLP[i].w);
  }
  return s;
}
vec3 lightAtN(vec3 p, vec3 n, float wrap) {
  vec3 s = vec3(0.0);
  for (int i = 0; i < NL; i++) {
    if (i >= uLN) break;
    vec3 d = uLP[i].xyz - p;
    float r2 = dot(d, d);
    float nl = (dot(n, d) * inversesqrt(r2) + wrap) / (1.0 + wrap);
    s += uLC[i].rgb * max(nl, 0.0) / (r2 + uLP[i].w * uLP[i].w);
  }
  return s;
}
// Single scattering in uniform haze along o + t*d, t in [0, L], closed form.
uniform float uHaze;
vec3 inscatter(vec3 o, vec3 d, float L) {
  vec3 s = vec3(0.0);
  for (int i = 0; i < NL; i++) {
    if (i >= uLN) break;
    vec3 q = uLP[i].xyz - o;
    float tc = dot(q, d);
    float h2 = max(dot(q, q) - tc * tc, 0.0) + uLP[i].w * uLP[i].w * 0.25 + 1.0;
    float h = sqrt(h2);
    s += uLC[i].rgb * ((atan((L - tc) / h) + atan(tc / h)) / h);
  }
  return s * uHaze * 0.0795775; // isotropic phase 1/(4 pi)
}
`;

export const NOISE = /* glsl */ `
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = h1(uint(int(i.x) + 4096) * 0x9E3779B9u ^ uint(int(i.y) + 4096) * 0x85EBCA6Bu);
  float b = h1(uint(int(i.x) + 4097) * 0x9E3779B9u ^ uint(int(i.y) + 4096) * 0x85EBCA6Bu);
  float c = h1(uint(int(i.x) + 4096) * 0x9E3779B9u ^ uint(int(i.y) + 4097) * 0x85EBCA6Bu);
  float e = h1(uint(int(i.x) + 4097) * 0x9E3779B9u ^ uint(int(i.y) + 4097) * 0x85EBCA6Bu);
  return mix(mix(a, b, f.x), mix(c, e, f.x), f.y);
}
`;
