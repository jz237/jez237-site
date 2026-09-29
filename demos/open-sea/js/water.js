// Ocean surface: camera-centred geometry clipmap displaced by the FFT cascades, shaded per pixel.
import { gl, Program, defineChunk } from './gl.js';
import './fx.js';
import './glsl.js';

export const CLIP_M = 48;          // half-extent in cells per level
export const CLIP_LEVELS = 14;
export const CLIP_S0 = 0.2;        // finest cell size (m)

const WATER_VS = `
#include <common>
#include <wake>
#include <water.uv>
layout(location = 0) in vec2 aGrid;
uniform mat4 uVP;
uniform vec2 uCenterRel;   // level centre relative to the camera (xz)
uniform float uSpacing, uCamY;
uniform sampler2DArray uDisp;
uniform float uGridN;      // texture size N
uniform vec4 uWake;        // reserved
out vec3 vRel;
out vec2 vG;
out float vJ;
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
  // ship wake (long components only; the fragment stage adds the finer ripples)
  int wt = uSpacing < 1.0 ? 20 : (uSpacing < 3.0 ? 14 : 8);
  rel.y += kelvinWake(rel.xz, uSpacing > 12.0 ? 0 : wt).x;
  float r2 = dot(rel.xz, rel.xz);
  rel.y -= r2 / (2.0 * 6371000.0);
  vRel = rel; vG = g; vJ = J;
  gl_Position = uVP * vec4(rel, 1.0);
}`;

defineChunk('water.uv', `
uniform int uCascades;
uniform vec2 uCen[5];
uniform vec4 uCasc[5];
uniform vec2 uNoiseOrg;    // level centre in the cascade-1 frame (metres, unwrapped)
vec2 cascUV(int i, vec2 g) {
  vec4 c = uCasc[i];
  vec2 uv = uCen[i] + vec2(c.y * g.x + c.z * g.y, -c.z * g.x + c.y * g.y) * c.x;
  if (i >= 3) {
    // smooth low-frequency warp of the finest cascades breaks up the visible repetition of their tiles
    vec4 c1 = uCasc[1];
    vec2 a = uNoiseOrg + vec2(c1.y * g.x + c1.z * g.y, -c1.z * g.x + c1.y * g.y);
    float sc = i == 3 ? 130.0 : 60.0, amp = i == 3 ? 20.0 : 9.0;
    vec2 w = vec2(vnoise(a / sc), vnoise(a / sc + 17.3)) * 2.0 - 1.0;
    uv += w * amp * c.x;
  }
  return uv;
}
vec2 toWorld(vec2 v, int i) { vec4 c = uCasc[i]; return vec2(c.y * v.x - c.z * v.y, c.z * v.x + c.y * v.y); }
`);

defineChunk('foam', `
vec2 worley2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 r = o + hash22(i + o) - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return sqrt(vec2(d1, d2));
}
// Filament network of bubble-cell walls; fades to its mean when a cell is smaller than a pixel.
float lace(vec2 p, float pxCells) {
  vec2 w = worley2(p);
  float e = w.y - w.x;
  float f = 1.0 - smoothstep(0.0, 0.20 + pxCells * 0.8, e);
  return mix(f, 0.42, smoothstep(0.25, 0.8, pxCells));
}
`);

const WATER_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
#include <underwater>
#include <wake>
#include <water.uv>
#include <foam>
in vec3 vRel;
in vec2 vG;
in float vJ;
uniform sampler2DArray uSlope;
uniform sampler2DArray uFoam;
uniform float uMssRes, uTime, uHs;
uniform vec2 uWind;        // wind direction (unit)
uniform float uWindSpeed;
uniform float uUnder;
uniform int uDbg;
uniform sampler2D uTrail, uRipple, uScene, uSceneDepth;
uniform vec3 uRippleInfo;   // camera x, z modulo tile, tile size
uniform vec2 uRes;
uniform vec3 uFwdV;
uniform float uNear, uFar, uRippleAmt, uRippleTexel, uHasScene, uCamDepth;
uniform vec3 uTrailInfo;   // origin x, origin z (camera position modulo map), map size
layout(location = 0) out vec4 o;

vec3 Rw_foamUnder(vec3 Ed0) { return vec3(0.35, 0.55, 0.65) * Ed0 * 0.6; }
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
    if (uDbg == i + 1) continue;
    vec4 s = texture(uSlope, vec3(cascUV(i, vG), float(i)));
    S += toWorld(s.xy, i);
    varSum += max(s.z - s.x * s.x, 0.0) + max(s.w - s.y * s.y, 0.0);
  }
  float comp = max(1.0 + vJ, 0.45);
  S /= comp;
  vec3 wk = kelvinWake(rel.xz, NW);
  S += wk.yz;
  if (uRippleAmt > 0.0) {
    float rm = smoothstep(15.5, 9.0, length(rel.xz)) * uRippleAmt;
    if (rm > 0.0) {
      vec2 ruv = fract((uRippleInfo.xy + rel.xz) / uRippleInfo.z);
      float e = uRippleTexel;
      float hl = texture(uRipple, ruv - vec2(e, 0.0)).r, hr = texture(uRipple, ruv + vec2(e, 0.0)).r;
      float hd = texture(uRipple, ruv - vec2(0.0, e)).r, hu = texture(uRipple, ruv + vec2(0.0, e)).r;
      S += vec2(hr - hl, hu - hd) / (2.0 * e * uRippleInfo.z) * rm;
      varSum += 0.0;
    }
  }
  float trail = 0.0;
  {
    vec2 dy = rel.xz - uWakeA.xy;
    float m = smoothstep(58.0, 46.0, length(dy)) * uWakeB.z;
    if (m > 0.0) trail = texture(uTrail, fract((uTrailInfo.xy + rel.xz) / uTrailInfo.z)).r * m;
  }
  float sigma2 = 0.5 * varSum + 0.5 * uMssRes;
  vec3 n = normalize(vec3(-S.x, 1.0, -S.y));
  if (!gl_FrontFacing) n = -n;
  if (!gl_FrontFacing) {
    // seen from below: Snell's window onto the sky, total internal reflection outside it
    vec3 Nd = n;                                   // already flipped: points down towards the viewer
    vec3 I = -V;
    vec3 sunWv, beamV, Ed0;
    underwaterLight(sunWv, beamV, Ed0);
    vec3 Lunder = RRS * Ed0 * exp(-KD * max(uCamDepth, 0.2));   // medium radiance at the camera's depth: no seam at the horizon
    float cosI = max(dot(-I, Nd), 1e-3);
    vec3 rf = refract(I, Nd, 1.333);
    vec3 colU = Lunder;
    if (dot(rf, rf) > 0.0) {
      float cosT = max(dot(rf, -Nd), 1e-3);
      float rs = (1.333 * cosI - cosT) / (1.333 * cosI + cosT), rp = (cosI - 1.333 * cosT) / (cosI + 1.333 * cosT);
      float Fr = 0.5 * (rs * rs + rp * rp);
      vec3 rfd = normalize(vec3(rf.x, max(rf.y, 0.004), rf.z));
      float shd = cloudShadowAt(rel.xz);
      vec3 Lw = envRadiance(rfd, clamp(log2(1.0 + sqrt(sigma2) * 30.0), 0.0, 5.0));
      // the sun seen through the wavy surface
      float cs = dot(rfd, uSunDir);
      const float SR = 0.004675;
      float px = length(fwidth(rfd));
      float disc = smoothstep(cos(SR) - 1.5 * px * SR, cos(SR) + 1.5 * px * SR, cs);
      Lw += min(lightSun() * shd / (PI * SR * SR), vec3(60000.0)) * disc * step(0.0, uSunDir.y);
      colU = mix(Lunder, Lw, 1.0 - Fr);
      colU = Lw * (1.0 - Fr) + Lunder * Fr;
      colU = mix(colU, Lunder, smoothstep(0.35, 0.02, cosT) * 0.0);
    }
    // foam and bubbles seen from underneath
    float Db = 0.0;
    for (int i = 1; i < 4; i++) { if (i >= uCascades) break; Db = max(Db, texture(uFoam, vec3(cascUV(i, vG), float(i))).x); }
    colU = mix(colU, colU + Rw_foamUnder(Ed0) , smoothstep(0.35, 0.9, Db) * 0.6);
    o = vec4(colU, 1.0);
    return;
  }
  float nv = max(dot(n, V), 0.02);
  vec3 R = reflect(-V, n);
  float below = smoothstep(-0.30, 0.0, R.y);
  R.y = max(R.y, 0.005); R = normalize(R);

  float shadow = cloudShadowAt(rel.xz);
  vec3 sunE = lightSun() * shadow, moonE = lightMoon() * shadow;
  vec3 skyE = lightSky();
  float lodR = clamp(log2(1.0 + sqrt(sigma2) * 40.0) * 1.2, 0.0, 6.0);
  vec3 Lsky = envRadiance(R, lodR);
  float F = fresnelRough(nv, sigma2);
  vec3 refl = F * Lsky * mix(0.35, 1.0, below);
  float alpha2 = 2.0 * sigma2;
  vec3 spec = glitter(n, V, uSunDir, sunE, alpha2) + glitter(n, V, uMoonDir, moonE, alpha2);

  // ---- water body: light scattered up out of the sea --------------------------------------
  float worldY = rel.y + uCamAbs.y;
  float crest = clamp(worldY / max(uHs * 0.9, 0.15) * 0.5 + 0.35, 0.0, 1.0);
  float ndl = max(dot(n, uSunDir), 0.0), ndm = max(dot(n, uMoonDir), 0.0);
  vec3 Ed = sunE * (0.25 * max(uSunDir.y, 0.0) + 0.75 * ndl) + moonE * (0.25 * max(uMoonDir.y, 0.0) + 0.75 * ndm) + skyE * (0.55 + 0.45 * n.y);
  vec3 Rw = vec3(0.006, 0.036, 0.058);
  vec3 body = Rw * Ed / PI * (1.0 - F);
  // light transmitted through thin crests towards the viewer
  vec3 Lt = normalize(uSunDir + n * 0.35);
  float sss = pow(sat(dot(V, -Lt)), 3.0) * crest * crest * sat(uSunDir.y * 2.0);
  body += vec3(0.020, 0.150, 0.115) * sunE * sss * 0.09;
  body *= mix(0.72, 1.0, crest);
  if (uHasScene > 0.5) {
    vec2 suv = gl_FragCoord.xy / uRes;
    float zw = dot(rel, uFwdV);
    float d0 = texture(uSceneDepth, suv).r;
    if (d0 < 0.99999) {
      float zs = 2.0 * uNear * uFar / (uFar + uNear - (2.0 * d0 - 1.0) * (uFar - uNear));
      float thick = (zs - zw) / max(dot(-V, uFwdV), 0.1);
      if (thick > 0.0 && thick < 40.0) {
        vec2 ruv = suv + S * 0.05 * clamp(thick, 0.0, 2.5) / max(zw * 0.06, 1.0);
        float d1 = texture(uSceneDepth, ruv).r;
        float z1 = 2.0 * uNear * uFar / (uFar + uNear - (2.0 * d1 - 1.0) * (uFar - uNear));
        if (z1 < zw) ruv = suv;
        vec3 sc = texture(uScene, ruv).rgb;
        vec3 Tw = exp(-CATT * thick);
        body = body * (1.0 - Tw) + sc * Tw * (1.0 - F) * exp(-KD * thick * 0.6);
      }
    }
  }

  // ---- foam -------------------------------------------------------------------------------
  float D = 0.0;
  for (int i = 1; i < 4; i++) {
    if (i >= uCascades) break;
    float f = texture(uFoam, vec3(cascUV(i, vG), float(i))).x;
    D = max(D, i == 3 ? f * 0.85 : f);
  }
  D = max(D, min(trail, 1.2) * 0.95);
  vec3 col = refl + body;
  if (D > 0.015) {
    float wnd = smoothstep(6.0, 24.0, uWindSpeed);
    vec4 c1 = uCasc[1];
    vec2 x0 = uNoiseOrg + vec2(c1.y * vG.x + c1.z * vG.y, -c1.z * vG.x + c1.y * vG.y);   // absolute lagrangian metres, cascade-1 frame
    vec2 wl = vec2(c1.y * uWind.x + c1.z * uWind.y, -c1.z * uWind.x + c1.y * uWind.y);
    vec2 perp = vec2(-wl.y, wl.x);
    vec2 base = vec2(dot(x0, wl) / (1.0 + 2.2 * wnd), dot(x0, perp));
    vec2 pxm = vec2(length(dFdx(base)), length(dFdy(base)));
    float pm = max(pxm.x, pxm.y);
    vec2 warp = vec2(vnoise(base * 0.8 + 3.0), vnoise(base * 0.8 + 9.0)) - 0.5;
    vec2 q = base + warp * 1.4;
    float l1 = lace(q * 1.6, pm * 1.6), l2 = lace(q * 5.5 + 7.0, pm * 5.5), l3 = lace(q * 19.0 + 3.0, pm * 19.0);
    float lc = 0.5 * l1 + 0.32 * l2 + 0.18 * l3;
    float mottle = vnoise(q * 0.7 + 21.0) * 0.6 + vnoise(q * 2.3) * 0.4;
    float t = D * 1.35 + (lc - 0.5) * 0.9 * (1.0 - 0.5 * D) + (mottle - 0.5) * 0.35 - 0.42;
    float cov = smoothstep(0.0, 0.20, t);
    float thick = smoothstep(0.05, 0.85, t);
    vec3 Efoam = sunE * (0.25 * max(uSunDir.y, 0.0) + 0.75 * ndl) + moonE * (0.25 * max(uMoonDir.y, 0.0) + 0.75 * ndm) + skyE * (0.6 + 0.4 * n.y);
    float alb = mix(0.42, 0.86, thick) * (0.80 + 0.30 * l2 + 0.1 * l3);
    vec3 foamCol = vec3(alb, alb * 0.995, alb * 0.985) * Efoam / PI * (0.78 + 0.22 * l1);
    // thin foam lets some of the water colour through
    foamCol = mix(foamCol, foamCol * vec3(0.78, 0.92, 1.0) + body * 0.6, (1.0 - thick) * 0.5);
    col = mix(col, foamCol, cov);
  }
  col += spec * (1.0 - clamp(D * 1.6, 0.0, 0.9));

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
    p.f('uHs', sim.cur.hs).f('uMssRes', Math.max(0.004, 0.003 + 0.00512 * sim.cur.U - sim.mss * 0.85));
    if (setExtra) setExtra(p);
    let prev = null;
    for (let l = 0; l < CLIP_LEVELS; l++) {
      const s = CLIP_S0 * Math.pow(2, l), snap = 2 * s;
      const cx = Math.round(cam.x / snap) * snap, cz = Math.round(cam.z / snap) * snap;
      const { scale, off } = sim.cascadeUniforms(cx, cz);
      p.v4v('uCasc', scale).v2v('uCen', off).f('uSpacing', s).v2('uCenterRel', cx - cam.x, cz - cam.z);
      if (sim.count > 1) { const cs = scale[5], sn = scale[6]; p.v2('uNoiseOrg', cs * cx + sn * cz, -sn * cx + cs * cz); }
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
