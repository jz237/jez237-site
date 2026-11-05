// HDR post (shared with Asteroids 2026): scene -> MSAA half-float target -> dual-filter bloom chain -> composite with
// shockwave refraction, chromatic aberration, ACES, grade, vignette and grain (lens slots unused here).
import * as THREE from '../vendor/three.module.min.js';
import { TONE, NOISE } from './shaders.js?v=3';

const VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const DOWN = /* glsl */ `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uPrefilter; uniform float uThreshold;
varying vec2 vUv;
vec3 s(vec2 o){ return texture2D(tSrc, vUv + o * uTexel).rgb; }
void main(){
  // 13-tap (Jimenez) downsample
  vec3 a = s(vec2(-2,2)), b = s(vec2(0,2)), c = s(vec2(2,2));
  vec3 d = s(vec2(-1,1)), e = s(vec2(1,1));
  vec3 f = s(vec2(-2,0)), g = s(vec2(0,0)), h = s(vec2(2,0));
  vec3 i = s(vec2(-1,-1)), j = s(vec2(1,-1));
  vec3 k = s(vec2(-2,-2)), l = s(vec2(0,-2)), m = s(vec2(2,-2));
  vec3 col = (d+e+i+j)*0.125 + (a+b+f+g)*0.03125 + (b+c+g+h)*0.03125 + (f+g+k+l)*0.03125 + (g+h+l+m)*0.03125;
  if (uPrefilter > 0.5) {
    float br = max(col.r, max(col.g, col.b));
    float soft = clamp(br - uThreshold + 0.5, 0.0, 1.0); soft = soft * soft * 0.5;
    float w = max(soft, br - uThreshold) / max(br, 1e-4);
    col *= w;
    col = min(col, vec3(60.0));
  }
  if (any(isnan(col)) || any(isinf(col))) col = vec3(0.0);
  gl_FragColor = vec4(col, 1.0);
}`;

const UP = /* glsl */ `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uRadius;
varying vec2 vUv;
void main(){
  vec2 t = uTexel * uRadius;
  vec3 c = texture2D(tSrc, vUv).rgb * 4.0;
  c += (texture2D(tSrc, vUv + vec2(-t.x, 0)).rgb + texture2D(tSrc, vUv + vec2(t.x, 0)).rgb + texture2D(tSrc, vUv + vec2(0, -t.y)).rgb + texture2D(tSrc, vUv + vec2(0, t.y)).rgb) * 2.0;
  c += texture2D(tSrc, vUv + vec2(-t.x, -t.y)).rgb + texture2D(tSrc, vUv + vec2(t.x, -t.y)).rgb + texture2D(tSrc, vUv + vec2(-t.x, t.y)).rgb + texture2D(tSrc, vUv + vec2(t.x, t.y)).rgb;
  gl_FragColor = vec4(c / 16.0, 1.0);
}`;

const COMP = /* glsl */ `
uniform sampler2D tScene; uniform sampler2D tBloom;
uniform float uBloom, uExposure, uChroma, uVignette, uGrain, uTime, uDesat, uFade, uAspect, uScan;
uniform vec4 uFlash; uniform vec3 uTint;
uniform vec4 uShock[6]; uniform vec4 uLens[3];
varying vec2 vUv;
${NOISE}
${TONE}
void main(){
  vec2 uv = vUv;
  vec2 off = vec2(0.0);
  // shockwave rings refract the image outward
  for (int i = 0; i < 6; i++) {
    vec4 s = uShock[i];
    if (s.w <= 0.0) continue;
    vec2 d = uv - s.xy; d.x *= uAspect;
    float r = length(d);
    float ring = exp(-pow((r - s.z) * 26.0, 2.0));
    off += normalize(d + 1e-5) * ring * s.w * 0.035 * vec2(1.0 / uAspect, 1.0);
  }
  // gravitational lensing around black holes
  for (int i = 0; i < 3; i++) {
    vec4 L = uLens[i];
    if (L.w <= 0.0) continue;
    vec2 d = uv - L.xy; d.x *= uAspect;
    float r = max(length(d), 1e-4);
    float k = L.w * L.z * L.z / (r * r + L.z * L.z * 0.25);
    off -= (d / r) * min(k, r * 0.95) * vec2(1.0 / uAspect, 1.0);
  }
  uv += off;
  vec2 cd = (uv - 0.5);
  float ca = uChroma * (0.35 + dot(cd, cd) * 2.5);
  vec3 col;
  col.r = texture2D(tScene, uv + cd * ca).r;
  col.g = texture2D(tScene, uv).g;
  col.b = texture2D(tScene, uv - cd * ca).b;
  vec3 bl = texture2D(tBloom, uv).rgb;
  if (any(isnan(col)) || any(isinf(col))) col = vec3(0.0);
  col += bl * uBloom;
  col *= uExposure;
  col = aces(col * uTint);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, vec3(l), uDesat);
  col = mix(col, uFlash.rgb, uFlash.a);
  // vignette + scanlines + grain
  float v = smoothstep(1.25, 0.25, length(cd * vec2(uAspect * 0.8, 1.0)));
  col *= mix(1.0 - uVignette, 1.0, v);
  col *= 1.0 - uScan * (0.5 + 0.5 * sin(gl_FragCoord.y * 3.14159));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 917.0) - 0.5) * uGrain;
  col *= 1.0 - uFade;
  gl_FragColor = vec4(toSRGB(clamp(col, 0.0, 1.0)), 1.0);
}`;

export class Post {
  constructor(renderer, q) {
    this.r = renderer;
    this.q = q;
    this.scene = new THREE.Scene();
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
    const isGL2 = renderer.capabilities.isWebGL2;
    this.rt = new THREE.WebGLRenderTarget(4, 4, {
      type: THREE.HalfFloatType, samples: isGL2 && q.msaa ? 4 : 0, depthBuffer: true,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    });
    this.levels = q.bloomLevels;
    this.mips = [];
    for (let i = 0; i < this.levels; i++) {
      this.mips.push(new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }));
    }
    this.down = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: DOWN, depthTest: false, depthWrite: false,
      uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uPrefilter: { value: 0 }, uThreshold: { value: 1.0 } } });
    this.up = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: UP, depthTest: false, depthWrite: false,
      blending: THREE.AdditiveBlending, transparent: true,
      uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uRadius: { value: 1.0 } } });
    const shocks = []; for (let i = 0; i < 6; i++) shocks.push(new THREE.Vector4());
    const lens = []; for (let i = 0; i < 3; i++) lens.push(new THREE.Vector4());
    this.comp = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: COMP, depthTest: false, depthWrite: false,
      uniforms: {
        tScene: { value: this.rt.texture }, tBloom: { value: this.mips[0].texture },
        uBloom: { value: 0.9 }, uExposure: { value: 1.0 }, uChroma: { value: 0.004 }, uVignette: { value: 0.45 },
        uGrain: { value: 0.016 }, uTime: { value: 0 }, uDesat: { value: 0 }, uFade: { value: 0 }, uAspect: { value: 1 },
        uScan: { value: 0.025 }, uFlash: { value: new THREE.Vector4(1, 1, 1, 0) }, uTint: { value: new THREE.Vector3(1, 1, 1) },
        uShock: { value: shocks }, uLens: { value: lens },
      } });
    this.w = 0; this.h = 0;
  }

  setSize(w, h) {
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.rt.setSize(w, h);
    let mw = Math.max(1, w >> 1), mh = Math.max(1, h >> 1);
    for (const m of this.mips) { m.setSize(mw, mh); mw = Math.max(1, mw >> 1); mh = Math.max(1, mh >> 1); }
    this.comp.uniforms.uAspect.value = w / h;
  }

  pass(mat, target) {
    this.quad.material = mat;
    this.r.setRenderTarget(target);
    this.r.render(this.scene, this.cam);
  }

  render(scene, camera, p) {
    const r = this.r;
    r.setRenderTarget(this.rt);
    r.clear();
    r.render(scene, camera);
    // bloom: down the chain, then back up with additive tent filters
    let src = this.rt;
    for (let i = 0; i < this.levels; i++) {
      this.down.uniforms.tSrc.value = src.texture;
      this.down.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
      this.down.uniforms.uPrefilter.value = i === 0 ? 1 : 0;
      this.down.uniforms.uThreshold.value = p.threshold ?? 1.0;
      this.pass(this.down, this.mips[i]);
      src = this.mips[i];
    }
    r.autoClear = false;
    for (let i = this.levels - 1; i > 0; i--) {
      const s = this.mips[i];
      this.up.uniforms.tSrc.value = s.texture;
      this.up.uniforms.uTexel.value.set(1 / s.width, 1 / s.height);
      this.pass(this.up, this.mips[i - 1]);
    }
    r.autoClear = true;
    const u = this.comp.uniforms;
    u.uBloom.value = p.bloom / this.levels; u.uExposure.value = p.exposure; u.uChroma.value = p.chroma; u.uTime.value = p.time;
    u.uDesat.value = p.desat; u.uFade.value = p.fade; u.uVignette.value = p.vignette;
    u.uFlash.value.copy(p.flash); u.uTint.value.copy(p.tint);
    for (let i = 0; i < 6; i++) u.uShock.value[i].copy(p.shocks[i] || ZERO4);
    for (let i = 0; i < 3; i++) u.uLens.value[i].copy(p.lens[i] || ZERO4);
    this.pass(this.comp, null);
  }
}
const ZERO4 = new THREE.Vector4(0, 0, 0, 0);
