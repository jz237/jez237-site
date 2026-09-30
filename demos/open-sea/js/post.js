// HDR target, auto exposure, bloom and the film-like display transform.
import { gl, Program, FS_VERT, tex2D, depthTex, makeFBO, bindFBO, drawFS, generateMips } from './gl.js';
import './glsl.js';

const DOWN_FS = `
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform float uFirst;
out vec4 o;
vec3 fetch(vec2 uv) { vec3 c = texture(uSrc, uv).rgb; return uFirst > 0.5 ? min(c, vec3(1200.0)) : c; }
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
uniform float uBloomAmt, uTime, uGrain, uVignette, uEVBias, uFlash, uNight;
uniform vec2 uRes;
out vec4 o;
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
// AgX display transform (Blender / three.js formulation): keeps hue in bright, saturated regions instead of clipping to cyan
vec3 agxContrast(vec3 x) {
  vec3 x2 = x * x, x4 = x2 * x2;
  return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
}
vec3 agx(vec3 color) {
  const mat3 toRec2020 = mat3(vec3(0.6274, 0.0691, 0.0164), vec3(0.3293, 0.9195, 0.0880), vec3(0.0433, 0.0113, 0.8956));
  const mat3 fromRec2020 = mat3(vec3(1.6605, -0.1246, -0.0182), vec3(-0.5876, 1.1329, -0.1006), vec3(-0.0728, -0.0083, 1.1187));
  const mat3 inset = mat3(vec3(0.856627153315983, 0.137318972929847, 0.11189821299995), vec3(0.0951212405381588, 0.761241990602591, 0.0767994186031903), vec3(0.0482516061458583, 0.101439036467562, 0.811302368396859));
  const mat3 outset = mat3(vec3(1.1271005818144368, -0.1413297634984383, -0.14132976349843826), vec3(-0.11060664309660323, 1.157823702216272, -0.11060664309660294), vec3(-0.016493938717834573, -0.016493938717834257, 1.2519364065950405));
  color = toRec2020 * color;
  color = inset * color;
  color = max(color, vec3(1e-10));
  color = log2(color);
  color = (color + 12.47393) / (12.47393 + 4.026069);
  color = clamp(color, 0.0, 1.0);
  color = agxContrast(color);
  color = outset * color;
  color = pow(max(color, vec3(0.0)), vec3(2.2));
  color = fromRec2020 * color;
  return clamp(color, 0.0, 1.0);
}
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  vec3 hdr = texture(uHdr,vUv).rgb;
  hdr=mix(hdr,vec3(0.0),isnan(hdr));hdr=clamp(hdr,vec3(0.0),vec3(60000.0));
  vec3 bloom = texture(uBloom, vUv).rgb;
  float E = texture(uExpo, vec2(0.5)).r * uEVBias;
  vec3 c = (hdr + bloom * uBloomAmt) * E;
  // low light: rods take over (less colour, blue shift) and the sensor gets noisy
  float ll0 = luma(c);
  c = mix(c, vec3(ll0) * vec3(0.86, 0.97, 1.18), 0.5 * uNight);
  c *= 1.0 + (hash21(gl_FragCoord.xy * 1.13 + fract(uTime * 3.1) * 91.0) - 0.5) * 0.10 * uNight;
  // gentle highlight desaturation like a film shoulder
  float l = luma(c);
  c = mix(c, vec3(l), smoothstep(1.0, 8.0, l) * 0.5);
  c = agx(c);
  c = mix(c, c * c * (3.0 - 2.0 * c), 0.38);   // extra shoulder/toe contrast for a photographic look
  float lc = luma(c); c = clamp(mix(vec3(lc), c, 1.14), 0.0, 1.0);
  vec2 q = vUv - 0.5;
  c *= 1.0 - uVignette * smoothstep(0.25, 0.85, dot(q, q) * 1.6);
  vec3 s = srgb(c);
  // triangular dither + fine grain to break banding in smooth skies
  vec2 px = gl_FragCoord.xy;
  float n1 = hash21(px + fract(uTime) * 71.0), n2 = hash21(px * 1.37 + 13.0 + fract(uTime * 1.3) * 53.0);
  float tri = n1 + n2 - 1.0;
  s += tri * (1.0 / 255.0) * (1.0 + uGrain * 3.0 * (1.0 - min(l, 1.0)) + 4.0 * uNight);
  o = vec4(s, 1.0);
}`;

// Edge resolve samples the bounded display buffer, never raw sun radiance.
const AA_FS = `
#include <common>
in vec2 vUv;
uniform sampler2D uDisplay;
uniform vec2 uRes;
out vec4 o;
// Resolve subpixel wave edges, rigging and fins after exposure and tone mapping.
vec3 antialiasDisplay(vec2 uv) {
  vec2 px = 1.0 / uRes;
  vec3 c = textureLod(uDisplay, uv, 0.0).rgb;
  float m = sqrt(max(luma(c), 0.0));
  float nw = sqrt(max(luma(textureLod(uDisplay, uv + px * vec2(-1, 1), 0.0).rgb), 0.0));
  float ne = sqrt(max(luma(textureLod(uDisplay, uv + px * vec2(1, 1), 0.0).rgb), 0.0));
  float sw = sqrt(max(luma(textureLod(uDisplay, uv + px * vec2(-1, -1), 0.0).rgb), 0.0));
  float se = sqrt(max(luma(textureLod(uDisplay, uv + px * vec2(1, -1), 0.0).rgb), 0.0));
  float lo = min(m, min(min(nw, ne), min(sw, se)));
  float hi = max(m, max(max(nw, ne), max(sw, se)));
  if (hi - lo < max(0.008, hi * 0.10)) return c;
  vec2 dir = vec2(-(nw + ne - sw - se), nw + sw - ne - se);
  float reduce = max((nw + ne + sw + se) * 0.03125, 0.0001);
  dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), -4.0, 4.0) * px;
  vec3 a = 0.5 * (textureLod(uDisplay, uv - dir / 6.0, 0.0).rgb + textureLod(uDisplay, uv + dir / 6.0, 0.0).rgb);
  vec3 b = a * 0.5 + 0.25 * (textureLod(uDisplay, uv - dir * 0.5, 0.0).rgb + textureLod(uDisplay, uv + dir * 0.5, 0.0).rgb);
  float lb = sqrt(max(luma(b), 0.0));
  return lb < lo || lb > hi ? a : b;
}

void main(){o=vec4(antialiasDisplay(vUv),1.0);}
`;

export class Post {
  constructor() {
    this.pDown = new Program('bloom.down', FS_VERT, DOWN_FS);
    this.pUp = new Program('bloom.up', FS_VERT, UP_FS);
    this.pExpo = new Program('expo', FS_VERT, EXPO_FS);
    this.pTone = new Program('tone', FS_VERT, TONE_FS);
    this.pAA = new Program('display.resolve', FS_VERT, AA_FS);
    this.expo = [tex2D(1, 1, { fmt: 'rgba32f', filter: 'nearest' }), tex2D(1, 1, { fmt: 'rgba32f', filter: 'nearest' })];
    this.expoFbo = this.expo.map(t => makeFBO([t]));
    this.expoIdx = 0;
    this.first = true;
    this.w = 0; this.h = 0;
  }

  resize(w, h) {
    if (w === this.w && h === this.h) return;
    if (this.color) {
      for (const t of [this.color, this.depth, this.colorCopy, this.depthCopy, this.display]) gl.deleteTexture(t.tex);
      for (const f of [this.fbo, this.fboCopy, this.displayFbo]) gl.deleteFramebuffer(f.fbo);
      for (const l of [...this.down, ...this.up]) { gl.deleteTexture(l.t.tex); gl.deleteFramebuffer(l.f.fbo); }
    }
    this.w = w; this.h = h;
    this.color = tex2D(w, h, { fmt: 'rgba16f', filter: 'linear', mips: true });
    this.depth = depthTex(w, h);
    this.fbo = makeFBO([this.color], this.depth);
    this.display=tex2D(w,h,{fmt:'rgba8',filter:'linear'});
    this.displayFbo=makeFBO([this.display]);
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

  // Copy the scene colour and depth so passes can read what has been drawn so far.
  copyScene() {
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.fbo.fbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fboCopy.fbo);
    gl.blitFramebuffer(0, 0, this.w, this.h, 0, 0, this.w, this.h, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.fbo);     // keep drawing into the HDR target
    gl.viewport(0, 0, this.w, this.h);
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
    bindFBO(this.displayFbo);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
    this.pTone.use().t('uHdr', 0, this.color).t('uBloom', 1, this.up[0].t).t('uExpo', 2, this.expo[this.expoIdx])
      .f('uBloomAmt', opts.bloom ?? 0.02).f('uTime', time).f('uGrain', opts.grain ?? 0.5).f('uVignette', opts.vignette ?? 0.28)
      .f('uEVBias', opts.ev ?? 1).f('uFlash', 0).f('uNight', opts.night ?? 0).v2('uRes', w, h);
    drawFS();
    bindFBO(null,w,h);
    this.pAA.use().t('uDisplay',0,this.display).v2('uRes',w,h);drawFS();
  }
}
