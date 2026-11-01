// HDR pipeline: the scene renders to half-float targets; a composite pass adds
// the smoke layer and the glow the bursts put into the haze between the eye
// and each surface; then bloom, a slow eye adaptation, ACES, vignette, grain.
import * as THREE from 'three';
import { LIGHTS, HASH } from './glsl.js';

const FS_VS = /* glsl */ `
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const COMPOSITE_FS = /* glsl */ `
uniform sampler2D uHdr;
uniform sampler2D uSmoke;
uniform sampler2D uDepth;
uniform mat4 uInvVP;
uniform vec3 uCam;
uniform float uSmokeOn;
${LIGHTS}
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uHdr, vUv).rgb;
  if (any(isnan(c)) || any(isinf(c))) c = vec3(0.0);
  c = min(c, vec3(6.0e4));
  float z = texture2D(uDepth, vUv).r;
  if (z < 0.999999) {
    vec4 w = uInvVP * vec4(vUv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0);
    vec3 d = w.xyz / w.w - uCam;
    float L = length(d);
    c += inscatter(uCam, d / L, L);
  }
  if (uSmokeOn > 0.5) {
    vec4 s = texture2D(uSmoke, vUv);
    if (!any(isnan(s))) c = c * (1.0 - s.a * 0.7) + s.rgb;
  }
  gl_FragColor = vec4(c, 1.0);
}
`;

const DOWN_FS = /* glsl */ `
uniform sampler2D uSrc;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec2 t = uTexel;
  vec3 a = texture2D(uSrc, vUv + t * vec2(-2.0, 2.0)).rgb;
  vec3 b = texture2D(uSrc, vUv + t * vec2(0.0, 2.0)).rgb;
  vec3 c = texture2D(uSrc, vUv + t * vec2(2.0, 2.0)).rgb;
  vec3 d = texture2D(uSrc, vUv + t * vec2(-2.0, 0.0)).rgb;
  vec3 e = texture2D(uSrc, vUv).rgb;
  vec3 f = texture2D(uSrc, vUv + t * vec2(2.0, 0.0)).rgb;
  vec3 g = texture2D(uSrc, vUv + t * vec2(-2.0, -2.0)).rgb;
  vec3 h = texture2D(uSrc, vUv + t * vec2(0.0, -2.0)).rgb;
  vec3 i = texture2D(uSrc, vUv + t * vec2(2.0, -2.0)).rgb;
  vec3 j = texture2D(uSrc, vUv + t * vec2(-1.0, 1.0)).rgb;
  vec3 k = texture2D(uSrc, vUv + t * vec2(1.0, 1.0)).rgb;
  vec3 l = texture2D(uSrc, vUv + t * vec2(-1.0, -1.0)).rgb;
  vec3 m = texture2D(uSrc, vUv + t * vec2(1.0, -1.0)).rgb;
  vec3 o = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(min(o, vec3(6.0e4)), 1.0);
}
`;

const UP_FS = /* glsl */ `
uniform sampler2D uLow;
uniform sampler2D uCur;
uniform vec2 uTexel;
uniform float uW;
varying vec2 vUv;
void main() {
  vec2 t = uTexel;
  vec3 s = texture2D(uLow, vUv).rgb * 4.0;
  s += (texture2D(uLow, vUv + vec2(t.x, 0.0)).rgb + texture2D(uLow, vUv - vec2(t.x, 0.0)).rgb + texture2D(uLow, vUv + vec2(0.0, t.y)).rgb + texture2D(uLow, vUv - vec2(0.0, t.y)).rgb) * 2.0;
  s += texture2D(uLow, vUv + t).rgb + texture2D(uLow, vUv - t).rgb + texture2D(uLow, vUv + vec2(t.x, -t.y)).rgb + texture2D(uLow, vUv + vec2(-t.x, t.y)).rgb;
  gl_FragColor = vec4(s / 16.0 + texture2D(uCur, vUv).rgb * uW, 1.0);
}
`;

const LUM_FS = /* glsl */ `
uniform sampler2D uSrc;
uniform sampler2D uPrev;
uniform float uRate;
varying vec2 vUv;
void main() {
  float s = 0.0;
  for (int y = 0; y < 6; y++) for (int x = 0; x < 8; x++) {
    vec2 uv = (vec2(float(x), float(y)) + 0.5) / vec2(8.0, 6.0);
    uv = mix(vec2(0.1, 0.18), vec2(0.9, 0.95), uv);
    vec3 c = texture2D(uSrc, uv).rgb;
    s += log(dot(c, vec3(0.2126, 0.7152, 0.0722)) + 1e-4);
  }
  float cur = exp(s / 48.0);
  float prev = texture2D(uPrev, vec2(0.5)).r;
  float a = prev <= 0.0 ? 1.0 : uRate;
  gl_FragColor = vec4(mix(prev, cur, a), 0.0, 0.0, 1.0);
}
`;

const FINAL_FS = /* glsl */ `
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uLum;
uniform float uBloomK;
uniform float uExposure;
uniform float uAdapt;
uniform float uTime;
uniform float uGrain;
uniform vec2 uRes;
uniform float uCA;
${HASH}
varying vec2 vUv;
const mat3 AIN = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
const mat3 AOUT = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
vec3 aces(vec3 v) {
  v = AIN * v;
  vec3 a = v * (v + 0.0245786) - 0.000090537;
  vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return clamp(AOUT * (a / b), 0.0, 1.0);
}
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  vec2 q = vUv - 0.5;
  vec3 c;
  if (uCA > 0.0) {
    vec2 o = q * dot(q, q) * uCA;
    c = vec3(texture2D(uScene, vUv - o).r, texture2D(uScene, vUv).g, texture2D(uScene, vUv + o).b);
  } else c = texture2D(uScene, vUv).rgb;
  c += texture2D(uBloom, vUv).rgb * uBloomK;
  float lum = texture2D(uLum, vec2(0.5)).r;
  float e = uExposure * mix(1.0, clamp(pow(0.02 / max(lum, 1e-4), 0.3), 0.7, 1.2), uAdapt);
  c *= e / 0.6;
  c *= 1.0 - dot(q, q) * 0.6;
  c = srgb(aces(c));
  uint px = uint(gl_FragCoord.x) * 1973u + uint(gl_FragCoord.y) * 9277u + uint(uTime * 60.0) * 26699u;
  float n1 = h1(px), n2 = h1(px ^ 0x5bd1e995u);
  float l = dot(c, vec3(0.3, 0.55, 0.15));
  c += (n1 - 0.5) * uGrain * (1.0 - l) * 1.2 + (n1 + n2 - 1.0) / 255.0;
  gl_FragColor = vec4(c, 1.0);
}
`;

function rt(w, h, opts = {}) {
  return new THREE.WebGLRenderTarget(Math.max(1, w | 0), Math.max(1, h | 0), {
    type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    depthBuffer: false, generateMipmaps: false, ...opts,
  });
}

export class Post {
  constructor(renderer, tier, lights) {
    this.r = renderer;
    this.tier = tier;
    this.fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.fsScene = new THREE.Scene();
    const tri = new THREE.BufferGeometry();
    tri.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    this.quad = new THREE.Mesh(tri, null);
    this.quad.frustumCulled = false;
    this.fsScene.add(this.quad);
    const mk = (fs, u) => new THREE.ShaderMaterial({ uniforms: u, vertexShader: FS_VS, fragmentShader: fs, depthTest: false, depthWrite: false });
    this.compMat = mk(COMPOSITE_FS, {
      uHdr: { value: null }, uSmoke: { value: null }, uDepth: { value: null }, uInvVP: { value: new THREE.Matrix4() },
      uCam: { value: new THREE.Vector3() }, uSmokeOn: { value: 1 }, ...lights.uniforms,
    });
    this.downMat = mk(DOWN_FS, { uSrc: { value: null }, uTexel: { value: new THREE.Vector2() } });
    this.upMat = mk(UP_FS, { uLow: { value: null }, uCur: { value: null }, uTexel: { value: new THREE.Vector2() }, uW: { value: 1 } });
    this.lumMat = mk(LUM_FS, { uSrc: { value: null }, uPrev: { value: null }, uRate: { value: 0.05 } });
    this.finalMat = mk(FINAL_FS, {
      uScene: { value: null }, uBloom: { value: null }, uLum: { value: null }, uBloomK: { value: 0.12 },
      uExposure: { value: 0.95 }, uAdapt: { value: 0.35 }, uTime: { value: 0 }, uGrain: { value: 0.035 }, uRes: { value: new THREE.Vector2() }, uCA: { value: 0.012 },
    });
    this.lumA = rt(1, 1, { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
    this.lumB = rt(1, 1, { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
    this.w = 0; this.h = 0;
  }

  setSize(w, h) {
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    [this.hdr, this.scene2, this.smoke, this.refl, ...(this.down || []), ...(this.up || [])].forEach(t => t && t.dispose());
    const depthTexture = new THREE.DepthTexture(w, h, THREE.UnsignedIntType);
    this.hdr = rt(w, h, { depthBuffer: true, depthTexture, samples: this.tier.msaa });
    this.scene2 = rt(w, h);
    const sr = this.tier.smokeRes, rr = this.tier.reflRes;
    this.smoke = rt(w * sr, h * sr);
    this.refl = rt(w * rr, h * rr, { depthBuffer: true });
    this.down = []; this.up = [];
    let bw = w >> 1, bh = h >> 1;
    for (let i = 0; i < this.tier.bloomLevels && (i === 0 || bh >= 4); i++) {
      this.down.push(rt(bw, bh));
      this.up.push(rt(bw, bh));
      bw = Math.max(1, bw >> 1); bh = Math.max(1, bh >> 1);
    }
  }

  pass(mat, target) {
    this.quad.material = mat;
    this.r.setRenderTarget(target);
    this.r.render(this.fsScene, this.fsCam);
  }

  composite(cam, smokeOn) {
    const u = this.compMat.uniforms;
    u.uHdr.value = this.hdr.texture;
    u.uDepth.value = this.hdr.depthTexture;
    u.uSmoke.value = this.smoke.texture;
    u.uSmokeOn.value = smokeOn ? 1 : 0;
    u.uInvVP.value.multiplyMatrices(cam.matrixWorld, cam.projectionMatrixInverse);
    u.uCam.value.copy(cam.position);
    this.pass(this.compMat, this.scene2);
  }

  finish(time, dt) {
    // bloom chain
    let src = this.scene2;
    for (let i = 0; i < this.down.length; i++) {
      this.downMat.uniforms.uSrc.value = src.texture;
      this.downMat.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
      this.pass(this.downMat, this.down[i]);
      src = this.down[i];
    }
    const n = this.down.length;
    let low = this.down[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      const u = this.upMat.uniforms;
      u.uLow.value = low.texture;
      u.uCur.value = this.down[i].texture;
      u.uTexel.value.set(1 / low.width, 1 / low.height);
      u.uW.value = 1.0 + i * 0.0;
      this.pass(this.upMat, this.up[i]);
      low = this.up[i];
    }
    // eye adaptation from a small mip
    const li = Math.min(n - 1, 4);
    this.lumMat.uniforms.uSrc.value = this.down[li].texture;
    this.lumMat.uniforms.uPrev.value = this.lumA.texture;
    this.lumMat.uniforms.uRate.value = 1 - Math.exp(-dt / 1.4);
    this.pass(this.lumMat, this.lumB);
    [this.lumA, this.lumB] = [this.lumB, this.lumA];
    const f = this.finalMat.uniforms;
    f.uScene.value = this.scene2.texture;
    f.uBloom.value = (n > 1 ? this.up[0] : this.down[0]).texture;
    f.uLum.value = this.lumA.texture;
    f.uTime.value = time;
    f.uRes.value.set(this.w, this.h);
    f.uBloomK.value = this.bloomK / Math.max(1, n);
    this.pass(this.finalMat, null);
  }
}
