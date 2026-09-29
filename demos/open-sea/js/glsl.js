// Shared GLSL chunks: math/hash helpers and the atmosphere model.
import { defineChunk } from './gl.js';

defineChunk('common', `
const float PI = 3.14159265359;
const float TAU = 6.28318530718;
float sat(float x) { return clamp(x, 0.0, 1.0); }
vec3 sat(vec3 x) { return clamp(x, 0.0, 1.0); }
float sq(float x) { return x * x; }
float remap(float v, float a, float b, float c, float d) { return c + (v - a) / (b - a) * (d - c); }
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
uint pcg(uint v) { uint s = v * 747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float hash11(float p) { return float(pcg(floatBitsToUint(p))) * (1.0 / 4294967295.0); }
float hash21(vec2 p) { return float(pcg(pcg(floatBitsToUint(p.x)) + floatBitsToUint(p.y))) * (1.0 / 4294967295.0); }
float hash31(vec3 p) { return float(pcg(pcg(pcg(floatBitsToUint(p.x)) + floatBitsToUint(p.y)) + floatBitsToUint(p.z))) * (1.0 / 4294967295.0); }
vec2 hash22(vec2 p) { uint a = pcg(pcg(floatBitsToUint(p.x)) + floatBitsToUint(p.y)); uint b = pcg(a); return vec2(float(a), float(b)) * (1.0 / 4294967295.0); }
vec3 hash33(vec3 p) { uint a = pcg(pcg(pcg(floatBitsToUint(p.x)) + floatBitsToUint(p.y)) + floatBitsToUint(p.z)); uint b = pcg(a); uint c = pcg(b); return vec3(float(a), float(b), float(c)) * (1.0 / 4294967295.0); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), f.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), f.x), f.y);
}
float fbm2(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 17.3; a *= 0.5; } return s; }
`);

// Atmosphere (Hillaire 2020 style): transmittance / multiple-scattering / sky-view LUTs.
defineChunk('atmo', `
const float RG = 6360.0;   // km
const float RT = 6460.0;
const vec3 RAY_S = vec3(0.005802, 0.013558, 0.0331);
const float MIE_S = 0.003996;
const float MIE_A = 0.004400;
const vec3 OZO_A = vec3(0.000650, 0.001881, 0.000085);

void atmoMedium(float h, float mieScale, out vec3 sR, out float sM, out vec3 ext) {
  h = max(h, 0.0);
  float dR = exp(-h / 8.0);
  float dM = exp(-h / 1.2) * mieScale;
  float dO = max(0.0, h < 25.0 ? h / 15.0 - 2.0 / 3.0 : -h / 15.0 + 8.0 / 3.0);
  sR = RAY_S * dR; sM = MIE_S * dM;
  ext = sR + (MIE_S + MIE_A) * dM + OZO_A * dO;
}
float raySphere(vec3 o, vec3 d, float r) {
  float b = dot(o, d), c = dot(o, o) - r * r, disc = b * b - c;
  if (disc < 0.0) return -1.0;
  float s = sqrt(disc), t0 = -b - s, t1 = -b + s;
  return t0 > 0.0 ? t0 : (t1 > 0.0 ? t1 : -1.0);
}
vec2 transUV(float r, float mu) {
  float H = sqrt(max(0.0, RT * RT - RG * RG));
  float rho = sqrt(max(0.0, r * r - RG * RG));
  float disc = r * r * (mu * mu - 1.0) + RT * RT;
  float d = max(0.0, -r * mu + sqrt(max(disc, 0.0)));
  float dMin = RT - r, dMax = rho + H;
  return vec2((d - dMin) / (dMax - dMin), rho / H);
}
void transParams(vec2 uv, out float r, out float mu) {
  float H = sqrt(RT * RT - RG * RG);
  float rho = H * uv.y;
  r = sqrt(rho * rho + RG * RG);
  float dMin = RT - r, dMax = rho + H;
  float d = dMin + uv.x * (dMax - dMin);
  mu = d == 0.0 ? 1.0 : clamp((H * H - rho * rho - d * d) / (2.0 * r * d), -1.0, 1.0);
}
float phaseR(float c) { return 3.0 / (16.0 * PI) * (1.0 + c * c); }
float phaseM(float c, float g) {
  float k = 3.0 / (8.0 * PI) * (1.0 - g * g) / (2.0 + g * g);
  return k * (1.0 + c * c) / pow(1.0 + g * g - 2.0 * g * c, 1.5);
}
vec2 msUV(float r, float mu) { return vec2(mu * 0.5 + 0.5, sqrt(clamp((r - RG) / 100.0, 0.0, 1.0))); }

vec2 skyDirToUV(vec3 d) {
  float el = asin(clamp(d.y, -1.0, 1.0));
  float az = atan(d.z, d.x);
  float v = 0.5 + 0.5 * sign(el) * sqrt(abs(el) / (0.5 * PI));
  return vec2(az / TAU + 0.5, v);
}
vec3 skyUVToDir(vec2 uv) {
  float t = (uv.y - 0.5) * 2.0;
  float el = sign(t) * t * t * 0.5 * PI;
  float az = (uv.x - 0.5) * TAU;
  return vec3(cos(el) * cos(az), sin(el), cos(el) * sin(az));
}
`);

// Runtime sampling helpers; the including program declares the samplers.
defineChunk('atmo.sample', `
uniform sampler2D uTransLUT;
uniform sampler2D uSkyLUT;
uniform vec3 uSunDir, uSunCol, uMoonDir, uMoonCol; // colours are pre-exposed illuminance at top of atmosphere
uniform vec3 uAirglow;
uniform float uCamAlt;    // metres above sea level
uniform float uHaze;      // Mie scale
vec3 sunIrradiance(float extraAlt) {
  float r = RG + max(uCamAlt + extraAlt, 0.0) * 0.001;
  float vis = smoothstep(-0.012, 0.004, uSunDir.y);
  return uSunCol * texture(uTransLUT, transUV(r, max(uSunDir.y, -0.05))).rgb * vis;
}
vec3 moonIrradiance() {
  float r = RG + max(uCamAlt, 0.0) * 0.001;
  float vis = smoothstep(-0.012, 0.004, uMoonDir.y);
  return uMoonCol * texture(uTransLUT, transUV(r, max(uMoonDir.y, -0.05))).rgb * vis;
}
vec3 skyRadiance(vec3 d) {
  vec2 uv = skyDirToUV(d);
  return texture(uSkyLUT, uv).rgb + uAirglow;
}
`);
