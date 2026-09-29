// HDR target, auto exposure, bloom and the film-like display transform.
import { gl, Program, FS_VERT, tex2D, depthTex, makeFBO, bindFBO, drawFS, generateMips } from './gl.js';
import './glsl.js';

const DOWN_FS = `
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform float uFirst;
out vec4 o;
vec3 fetch(vec2 uv) { vec3 c = texture(uSrc, uv).rgb; return uFirst > 0.5 ? min(c, vec3(4000.0)) : c; }
void main() {
  vec2 uv = vUv, t = uTexel;
  vec3 a = fetch(uv + t * vec2(-2, 2)), b = fetch(uv + t * vec2(0, 2)), c = fetch(uv + t * vec2(2, 2));
  vec3 d = fetch(uv + t * vec2(-2, 0)), e = fetch(uv), f = fetch(uv + t * vec2(2, 0));
  vec3 g = fetch(uv + t * vec2(-2, -2)), h = fetch(uv + t * vec2(0, -2)), i = fetch(uv + t * vec2(2, -2));
  vec3 j = fetch(uv + t * vec2(-1, 1)), k = fetch(uv + t * vec2(1, 1)), l = fetch(uv + t * vec2(-1, -1)), m = fetch(uv + t * vec2(1, -1));
  vec3 r = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  o = vec4(r, 1.0);
}`;

const UP_FS = `
in vec2 vUv;
uniform sampler2D uLow, uHigh;
uniform vec2 uTexel;
uniform float uMix;
out vec4 o;
void main() {
  vec2 t = uTexel; vec3 s = vec3(0.0);
  s += texture(uLow, vUv + t * vec2(-1, 1)).rgb + texture(uLow, vUv + t * vec2(1, 1)).rgb;
  s += texture(uLow, vUv + t * vec2(-1, -1)).rgb + texture(uLow, vUv + t * vec2(1, -1)).rgb;
  s += 2.0 * (texture(uLow, vUv + t * vec2(0, 1)).rgb + texture(uLow, vUv + t * vec2(0, -1)).rgb + texture(uLow, vUv + t * vec2(-1, 0)).rgb + texture(uLow, vUv + t * vec2(1, 0)).rgb);
  s += 4.0 * texture(uLow, vUv).rgb;
  o = vec4(s / 16.0 * uMix + texture(uHigh, vUv).rgb, 1.0);
}`;

const EXPO_FS = `
#include <common>
in vec2 vUv;
uniform sampler2D uHdr, uPrev;
uniform float uKey, uDt, uLod, uFirst, uMin, uMax;
out vec4 o;
void main() {
  float sum = 0.0, wsum = 0.0;
  for (int y = 0; y < 9; y++) for (int x = 0; x < 16; x++) {
    vec2 uv = (vec2(x, y) + 0.5) / vec2(16.0, 9.0);
    vec2 q = uv - 0.5;
    float w = exp(-dot(q, q) * 3.0) * (0.35 + 0.65 * smoothstep(0.0, 0.5, 0.72 - uv.y * 0.6));
    float l = luma(textureLod(uHdr, uv, uLod).rgb);
    sum += w * log2(min(l, 3000.0) + 1e-4); wsum += w;
  }
  float avg = exp2(sum / wsum);
  float target = clamp(uKey / avg, uMin, uMax);
  float prev = texture(uPrev, vec2(0.5)).r;
  float e = target;
  if (uFirst < 0.5 && prev > 0.0) {
    float tau = target < prev ? 0.6 : 2.2; // close down quickly on brightening, open up slowly
    e = exp(mix(log(prev), log(target), 1.0 - exp(-uDt / tau)));
  }
  o = vec4(e, avg, 0.0, 1.0);
}`;

const TONE_FS = `
#include <common>
in vec2 vUv;
uniform sampler2D uHdr, uBloom, uExpo;
uniform float uBloomAmt, uTime, uGrain, uVignette, uEVBias, uFlash;
uniform vec2 uRes;
out vec4 o;
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  vec3 hdr = texture(uHdr, vUv).rgb;
  vec3 bloom = texture(uBloom, vUv).rgb;
  float E = texture(uExpo, vec2(0.5)).r * uEVBias;
  vec3 c = (hdr + bloom * uBloomAmt) * E;
  // gentle highlight desaturation like a film shoulder
  float l = luma(c);
  c = mix(c, vec3(l), smoothstep(1.0, 8.0, l) * 0.5);
  c = aces(c * 0.92);
  vec2 q = vUv - 0.5;
  c *= 1.0 - uVignette * smoothstep(0.25, 0.85, dot(q, q) * 1.6);
  vec3 s = srgb(c);
  // triangular dither + fine grain to break banding in smooth skies
  vec2 px = gl_FragCoord.xy;
  float n1 = hash21(px + fract(uTime) * 71.0), n2 = hash21(px * 1.37 + 13.0 + fract(uTime * 1.3) * 53.0);
  float tri = n1 + n2 - 1.0;
  s += tri * (1.0 / 255.0) * (1.0 + uGrain * 3.0 * (1.0 - l));
  o = vec4(s, 1.0);
}`;

export class Post {
  constructor() {
    this.pDown = new Program('bloom.down', FS_VERT, DOWN_FS);
    this.pUp = new Program('bloom.up', FS_VERT, UP_FS);
    this.pExpo = new Program('expo', FS_VERT, EXPO_FS);
    this.pTone = new Program('tone', FS_VERT, TONE_FS);
    this.expo = [tex2D(1, 1, { fmt: 'rgba32f', filter: 'nearest' }), tex2D(1, 1, { fmt: 'rgba32f', filter: 'nearest' })];
    this.expoFbo = this.expo.map(t => makeFBO([t]));
    this.expoIdx = 0;
    this.first = true;
    this.w = 0; this.h = 0;
  }

  resize(w, h) {
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.color = tex2D(w, h, { fmt: 'rgba16f', filter: 'linear', mips: true });
    this.depth = depthTex(w, h);
    this.fbo = makeFBO([this.color], this.depth);
    // copies for refraction reads
    this.colorCopy = tex2D(w, h, { fmt: 'rgba16f', filter: 'linear' });
    this.depthCopy = depthTex(w, h);
    this.fboCopy = makeFBO([this.colorCopy], this.depthCopy);
    this.down = []; this.up = [];
    let bw = Math.max(2, w >> 1), bh = Math.max(2, h >> 1);
    for (let i = 0; i < 6; i++) {
      const a = tex2D(bw, bh, { fmt: 'rgba16f' }), b = tex2D(bw, bh, { fmt: 'rgba16f' });
      this.down.push({ t: a, f: makeFBO([a]), w: bw, h: bh }); this.up.push({ t: b, f: makeFBO([b]), w: bw, h: bh });
      bw = Math.max(2, bw >> 1); bh = Math.max(2, bh >> 1);
    }
  }

  bloom() {
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    let src = this.color;
    const d = this.pDown.use();
    for (let i = 0; i < this.down.length; i++) {
      const L = this.down[i];
      bindFBO(L.f);
      d.t('uSrc', 0, src).v2('uTexel', 1 / (i === 0 ? this.w : this.down[i - 1].w), 1 / (i === 0 ? this.h : this.down[i - 1].h)).f('uFirst', i === 0 ? 1 : 0);
      drawFS(); src = L.t;
    }
    const n = this.down.length;
    // copy lowest into up[n-1] by blending with zero-weight up
    const u = this.pUp.use();
    bindFBO(this.up[n - 1].f);
    u.t('uLow', 0, this.down[n - 1].t).t('uHigh', 1, this.down[n - 1].t).v2('uTexel', 1 / this.down[n - 1].w, 1 / this.down[n - 1].h).f('uMix', 0);
    drawFS();
    for (let i = n - 2; i >= 0; i--) {
      bindFBO(this.up[i].f);
      u.t('uLow', 0, this.up[i + 1].t).t('uHigh', 1, this.down[i].t).v2('uTexel', 1 / this.up[i + 1].w, 1 / this.up[i + 1].h).f('uMix', 1);
      drawFS();
    }
  }

  exposure(dt, key, first) {
    generateMips(this.color);
    const prev = this.expo[this.expoIdx], nextI = 1 - this.expoIdx;
    bindFBO(this.expoFbo[nextI]);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    const lod = Math.max(0, Math.floor(Math.log2(Math.min(this.w, this.h) / 24)));
    this.pExpo.use().t('uHdr', 0, this.color).t('uPrev', 1, prev).f('uKey', key).f('uDt', dt).f('uLod', lod)
      .f('uFirst', first || this.first ? 1 : 0).f('uMin', 1e-3).f('uMax', 5e4);
    drawFS();
    this.expoIdx = nextI; this.first = false;
  }

  tonemap(w, h, time, opts = {}) {
    bindFBO(null, w, h);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    this.pTone.use().t('uHdr', 0, this.color).t('uBloom', 1, this.up[0].t).t('uExpo', 2, this.expo[this.expoIdx])
      .f('uBloomAmt', opts.bloom ?? 0.035).f('uTime', time).f('uGrain', opts.grain ?? 0.5).f('uVignette', opts.vignette ?? 0.28)
      .f('uEVBias', opts.ev ?? 1).f('uFlash', 0).v2('uRes', w, h);
    drawFS();
  }
}
