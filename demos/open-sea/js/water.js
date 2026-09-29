// Ocean surface: camera-centred geometry clipmap displaced by the FFT cascades, shaded per pixel.
import { gl, Program, defineChunk } from './gl.js';
import './glsl.js';

export const CLIP_M = 48;          // half-extent in cells per level
export const CLIP_LEVELS = 14;
export const CLIP_S0 = 0.2;        // finest cell size (m)

const WATER_VS = `
#include <common>
layout(location = 0) in vec2 aGrid;
uniform mat4 uVP;
uniform vec2 uCenterRel;   // level centre relative to the camera (xz)
uniform float uSpacing, uCamY;
uniform int uCascades;
uniform vec2 uCen[5];
uniform vec4 uCasc[5];     // invL, cos, sin, L
uniform sampler2DArray uDisp;
uniform float uGridN;      // texture size N
uniform vec4 uWake;        // reserved
out vec3 vRel;
out vec2 vG;
out float vJ;
vec2 cascUV(int i, vec2 g) {
  vec4 c = uCasc[i];
  return uCen[i] + vec2(c.y * g.x + c.z * g.y, -c.z * g.x + c.y * g.y) * c.x;
}
vec2 toWorld(vec2 v, int i) { vec4 c = uCasc[i]; return vec2(c.y * v.x - c.z * v.y, c.z * v.x + c.y * v.y); }
void main() {
  // geo-morph: odd lattice vertices slide onto the coarser lattice near the level's outer edge
  vec2 gi = aGrid;
  float e = max(abs(gi.x), abs(gi.y)) / ${CLIP_M.toFixed(1)};
  float k = smoothstep(0.72, 1.0, e);
  vec2 odd = mod(gi, 2.0);          // 0 or 1 (aGrid may be negative; mod keeps [0,2))
  gi += odd * k;
  vec2 g = gi * uSpacing;
  vec3 D = vec3(0.0);
  float J = 0.0;
  for (int i = 0; i < 5; i++) {
    if (i >= uCascades) break;
    float texel = uCasc[i].w / uGridN;
    float lod = max(log2(uSpacing * (1.0 + k) * 1.2 / texel), 0.0);
    vec4 d = textureLod(uDisp, vec3(cascUV(i, g), float(i)), lod);
    vec2 dw = toWorld(d.xz, i);
    D += vec3(dw.x, d.y, dw.y);
    J += d.w;
  }
  vec3 rel = vec3(uCenterRel.x + g.x + D.x, D.y - uCamY, uCenterRel.y + g.y + D.z);
  float r2 = dot(rel.xz, rel.xz);
  rel.y -= r2 / (2.0 * 6371000.0);
  vRel = rel; vG = g; vJ = J;
  gl_Position = uVP * vec4(rel, 1.0);
}`;

defineChunk('water.uv', `
uniform int uCascades;
uniform vec2 uCen[5];
uniform vec4 uCasc[5];
vec2 cascUV(int i, vec2 g) {
  vec4 c = uCasc[i];
  return uCen[i] + vec2(c.y * g.x + c.z * g.y, -c.z * g.x + c.y * g.y) * c.x;
}
vec2 toWorld(vec2 v, int i) { vec4 c = uCasc[i]; return vec2(c.y * v.x - c.z * v.y, c.z * v.x + c.y * v.y); }
`);

const WATER_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <water.uv>
in vec3 vRel;
in vec2 vG;
in float vJ;
uniform sampler2DArray uSlope;
uniform sampler2DArray uFoam;
uniform float uMssRes, uTime;
uniform vec2 uWind;        // wind direction (unit)
uniform float uWindSpeed;
uniform float uExposureBias;
layout(location = 0) out vec4 o;

vec3 skyIrradiance() {
  vec3 e = 0.372 * skyRadiance(vec3(0.0, 1.0, 0.0));
  vec3 a = vec3(0.0), b = vec3(0.0), c = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float az = float(i) * 1.5708 + 0.3927;
    vec2 cs = vec2(cos(az), sin(az));
    a += skyRadiance(normalize(vec3(cs.x * 0.574, 0.819, cs.y * 0.574)));
    b += skyRadiance(normalize(vec3(cs.x * 0.891, 0.454, cs.y * 0.891)));
    c += skyRadiance(normalize(vec3(cs.x * 0.993, 0.122, cs.y * 0.993)));
  }
  return e + 1.49 * 0.25 * a + 1.09 * 0.25 * b + 0.21 * 0.25 * c;
}

float fresnelRough(float nv, float sigma2) {
  float s = sqrt(sigma2);
  float F0 = 0.02;
  float k = pow(1.0 - nv, 5.0 * exp(-2.69 * s)) / (1.0 + 22.7 * pow(s, 1.5));
  return F0 + (1.0 - F0) * clamp(k, 0.0, 1.0);
}

// Gaussian-slope (Beckmann) sun/moon glitter
vec3 glitter(vec3 n, vec3 V, vec3 Ld, vec3 E, float alpha2) {
  vec3 H = normalize(V + Ld);
  float nh = max(dot(n, H), 1e-4), nl = dot(n, Ld), nv = max(dot(n, V), 1e-3);
  if (nl <= 0.0 || Ld.y <= -0.02) return vec3(0.0);
  float a2 = max(alpha2, 4.4e-5);
  float t2 = (1.0 - nh * nh) / (nh * nh);
  float D = exp(-t2 / a2) / (PI * a2 * nh * nh * nh * nh);
  float vh = max(dot(V, H), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - vh, 5.0);
  float G = 1.0 / (1.0 + 0.5 * (sqrt(1.0 + a2 * (1.0 / (nv * nv) - 1.0)) - 1.0) + 0.5 * (sqrt(1.0 + a2 * (1.0 / (nl * nl) - 1.0)) - 1.0));
  return E * (D * F * G / (4.0 * nv)) * step(0.0, Ld.y + 0.02);
}

void main() {
  vec3 rel = vRel;
  float dist = length(rel);
  vec3 V = -rel / dist;
  vec2 S = vec2(0.0);
  float varSum = 0.0;
  for (int i = 0; i < 5; i++) {
    if (i >= uCascades) break;
    vec4 s = texture(uSlope, vec3(cascUV(i, vG), float(i)));
    S += toWorld(s.xy, i);
    varSum += max(s.z - s.x * s.x, 0.0) + max(s.w - s.y * s.y, 0.0);
  }
  float comp = max(1.0 + vJ, 0.3);
  S /= comp;
  float sigma2 = 0.5 * varSum + 0.5 * uMssRes;
  vec3 n = normalize(vec3(-S.x, 1.0, -S.y));
  if (!gl_FrontFacing) n = -n;
  float nv = max(dot(n, V), 0.02);
  vec3 R = reflect(-V, n);
  float below = smoothstep(-0.05, 0.12, R.y);
  R.y = max(R.y, 0.005); R = normalize(R);

  vec3 sunE = sunIrradiance(0.0), moonE = moonIrradiance();
  vec3 Lsky = skyRadiance(R);
  float F = fresnelRough(nv, sigma2);
  vec3 refl = F * Lsky * mix(0.25, 1.0, below);
  float alpha2 = 2.0 * sigma2;
  vec3 spec = glitter(n, V, uSunDir, sunE, alpha2) + glitter(n, V, uMoonDir, moonE, alpha2);

  vec3 Ed = sunE * max(uSunDir.y, 0.0) + moonE * max(uMoonDir.y, 0.0) + skyIrradiance();
  vec3 body = vec3(0.004, 0.030, 0.050) * Ed / PI * (1.0 - F);

  // foam
  float foam = 0.0;
  for (int i = 1; i < 4; i++) {
    if (i >= uCascades) break;
    foam = max(foam, texture(uFoam, vec3(cascUV(i, vG), float(i))).x);
  }
  vec3 foamCol = vec3(0.8) * (sunE * max(dot(n, uSunDir), 0.0) + moonE * max(dot(n, uMoonDir), 0.0) + skyIrradiance()) / PI;
  float fa = smoothstep(0.35, 0.8, foam);

  vec3 col = mix(refl + body, foamCol, fa) + spec * (1.0 - fa);
  // aerial perspective toward the horizon colour in this azimuth
  vec3 hd = normalize(vec3(-V.x, 0.0, -V.z));
  vec3 Lh = skyRadiance(normalize(vec3(hd.x, 0.01, hd.z)));
  vec3 ext = (RAY_S + (MIE_S + MIE_A) * uHaze) * 0.001; // per metre at sea level
  vec3 T = exp(-ext * dist);
  col = col * T + Lh * (1.0 - T);
  o = vec4(col, 1.0);
}`;

export class Water {
  constructor() {
    this.prog = new Program('water', WATER_VS, WATER_FS);
    const M = CLIP_M, side = 2 * M + 1;
    const verts = new Float32Array(side * side * 2);
    for (let j = 0; j < side; j++) for (let i = 0; i < side; i++) { verts[(j * side + i) * 2] = i - M; verts[(j * side + i) * 2 + 1] = j - M; }
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // index buffers: [0] full grid, then 9 ring variants keyed by hole offset
    this.ib = new Map();
    const build = (ox, oz, ring) => {
      const idx = [];
      for (let j = 0; j < 2 * M; j++) for (let i = 0; i < 2 * M; i++) {
        const ci = i - M, cj = j - M; // cell min corner in grid coords
        if (ring) {
          const inHole = ci >= -M / 2 + ox && ci < M / 2 + ox && cj >= -M / 2 + oz && cj < M / 2 + oz;
          if (inHole) continue;
        }
        const a = j * side + i, b = a + 1, c = a + side, d = c + 1;
        // CCW when viewed from +Y (grid x -> +x, grid y -> +z means looking down flips handedness)
        idx.push(a, c, b, b, c, d);
      }
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
      return { buf, count: idx.length };
    };
    this.ib.set('full', build(0, 0, false));
    for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) this.ib.set(`${ox},${oz}`, build(ox, oz, true));
  }

  // Draw all levels. `cam` = {x,y,z}; `sim` = OceanSim; `u` = extra uniform setter.
  draw(cam, sim, vp, setExtra) {
    const p = this.prog.use();
    gl.bindVertexArray(this.vao);
    p.m4('uVP', vp).f('uCamY', cam.y).i('uCascades', sim.count).f('uGridN', sim.N);
    p.t('uDisp', 8, sim.disp).t('uSlope', 9, sim.slope).t('uFoam', 10, sim.foamTex);
    p.f('uMssRes', Math.max(0.004, 0.003 + 0.00512 * sim.cur.U - sim.mss * 0.85));
    if (setExtra) setExtra(p);
    let prev = null;
    for (let l = 0; l < CLIP_LEVELS; l++) {
      const s = CLIP_S0 * Math.pow(2, l), snap = 2 * s;
      const cx = Math.round(cam.x / snap) * snap, cz = Math.round(cam.z / snap) * snap;
      const { scale, off } = sim.cascadeUniforms(cx, cz);
      p.v4v('uCasc', scale).v2v('uCen', off).f('uSpacing', s).v2('uCenterRel', cx - cam.x, cz - cam.z);
      let key = 'full';
      if (l > 0) {
        // hole offset = fine level centre relative to this level's centre, in this level's cells
        const ox = Math.round((prev.cx - cx) / s), oz = Math.round((prev.cz - cz) / s);
        key = `${Math.max(-1, Math.min(1, ox))},${Math.max(-1, Math.min(1, oz))}`;
      }
      const ib = this.ib.get(key);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib.buf);
      gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 0);
      prev = { cx, cz };
    }
  }
}
