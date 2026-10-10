import * as THREE from 'three';
import {GTAOPass} from 'three/examples/jsm/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {FullScreenQuad} from 'three/examples/jsm/postprocessing/Pass.js';

/**
 * Photographic post-processing:
 * scene (MSAA, HDR) → copy for glass refraction → glass layer → GTAO → bloom →
 * depth of field → exposure, ACES, vignette, grain, faint chromatic aberration.
 */
export interface PostSettings {
  ao: boolean; bloom: boolean; dof: boolean; bloomStrength: number;
  exposure: number; focus: number; aperture: number; maxBlur: number;
}

const dofShader = {
  uniforms: {
    tColor: {value: null as THREE.Texture | null},
    tDepth: {value: null as THREE.Texture | null},
    uPixel: {value: new THREE.Vector2()},
    uNear: {value: 0.01}, uFar: {value: 20},
    uFocus: {value: 1.5}, uAperture: {value: 1}, uMaxBlur: {value: 10},
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: /* glsl */ `
precision highp float;
uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 uPixel;
uniform float uNear, uFar, uFocus, uAperture, uMaxBlur;
varying vec2 vUv;
float linDepth(vec2 uv){ float z = texture2D(tDepth, uv).x * 2.0 - 1.0; return 2.0 * uNear * uFar / (uFar + uNear - z * (uFar - uNear)); }
float coc(float d){ return clamp((1.0 / uFocus - 1.0 / d) * uAperture, -1.0, 1.0) * uMaxBlur; }
const float GOLDEN = 2.39996323;
void main(){
  float cd = linDepth(vUv);
  float cs = abs(coc(cd));
  vec3 col = texture2D(tColor, vUv).rgb;
  float tot = 1.0;
  float rad = 0.9;
  float ang = 0.0;
  for (int i = 0; i < 64; i++) {
    if (rad >= uMaxBlur) break;
    vec2 tc = vUv + vec2(cos(ang), sin(ang)) * uPixel * rad;
    vec3 sc = texture2D(tColor, tc).rgb;
    float sd = linDepth(tc);
    float ss = abs(coc(sd));
    if (sd > cd) ss = clamp(ss, 0.0, cs * 2.0);
    float m = smoothstep(rad - 0.5, rad + 0.5, ss);
    col += mix(col / tot, sc, m);
    tot += 1.0;
    rad += 1.15 / rad;
    ang += GOLDEN;
  }
  gl_FragColor = vec4(col / tot, 1.0);
}`,
};

const finalShader = {
  uniforms: {
    tColor: {value: null as THREE.Texture | null},
    tAO: {value: null as THREE.Texture | null},
    uAO: {value: 1},
    uExposure: {value: 1},
    uTime: {value: 0},
    uPixel: {value: new THREE.Vector2()},
    uGrain: {value: 0.035},
    uVignette: {value: 0.32},
    uCA: {value: 0.9},
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: /* glsl */ `
precision highp float;
uniform sampler2D tColor; uniform float uExposure, uTime, uGrain, uVignette, uCA; uniform vec2 uPixel;
varying vec2 vUv;
vec3 aces(vec3 x){
  // Stephen Hill's fitted ACES (RRT+ODT)
  const mat3 i = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
  const mat3 o = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
  x = i * x;
  vec3 a = x * (x + 0.0245786) - 0.000090537;
  vec3 b = x * (0.983729 * x + 0.4329510) + 0.238081;
  return clamp(o * (a / b), 0.0, 1.0);
}
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 0.1) * 43758.5453); }
void main(){
  vec2 c = vUv - 0.5;
  float r2 = dot(c, c);
  vec2 off = c * r2 * uCA * 4.0 * uPixel;
  vec3 col;
  col.r = texture2D(tColor, vUv - off).r;
  col.g = texture2D(tColor, vUv).g;
  col.b = texture2D(tColor, vUv + off).b;
  col *= uExposure;
  col = aces(col);
  col *= 1.0 - uVignette * smoothstep(0.08, 0.62, r2 * 1.6);
  col = toSRGB(col);
  float g = hash(gl_FragCoord.xy + fract(uTime) * 917.0) - 0.5;
  col += g * uGrain * (0.6 + 0.4 * (1.0 - dot(col, vec3(0.33))));
  gl_FragColor = vec4(col, 1.0);
}`,
};

// View distance (m) per pixel from the depth buffer, for volumes drawn in the glass pass.
const distShader = {
  uniforms: {tDepth: {value: null as THREE.Texture | null}, uInvProj: {value: new THREE.Matrix4()}},
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: `precision highp float; uniform sampler2D tDepth; uniform mat4 uInvProj; varying vec2 vUv;
void main(){ float z = texture2D(tDepth, vUv).x; vec4 v = uInvProj * vec4(vUv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); v /= v.w; gl_FragColor = vec4(z >= 1.0 ? 1e4 : length(v.xyz), 0.0, 0.0, 1.0); }`,
};

const aoShader = {
  uniforms: {tColor: {value: null as THREE.Texture | null}, tAO: {value: null as THREE.Texture | null}, uAO: {value: 1}},
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
  fragmentShader: `uniform sampler2D tColor, tAO; uniform float uAO; varying vec2 vUv;
void main(){ vec4 c = texture2D(tColor, vUv); float ao = texture2D(tAO, vUv).r; gl_FragColor = vec4(c.rgb * mix(1.0, ao, uAO), 1.0); }`,
};

export class Post {
  readonly sceneRT: THREE.WebGLRenderTarget;
  readonly refractRT: THREE.WebGLRenderTarget;
  /** Camera distance of the opaque scene, for clouds and fog in the glass pass. */
  readonly distRT: THREE.WebGLRenderTarget;
  private distQuad = new FullScreenQuad(new THREE.ShaderMaterial(distShader));
  private aRT: THREE.WebGLRenderTarget;
  private bRT: THREE.WebGLRenderTarget;
  private gtao: GTAOPass;
  private bloom: UnrealBloomPass;
  private dofQuad = new FullScreenQuad(new THREE.ShaderMaterial(dofShader));
  private finalQuad = new FullScreenQuad(new THREE.ShaderMaterial(finalShader));
  private aoQuad = new FullScreenQuad(new THREE.ShaderMaterial(aoShader));
  private copyQuad = new FullScreenQuad(new THREE.MeshBasicMaterial({toneMapped: false}));
  readonly settings: PostSettings = {ao: true, bloom: true, dof: true, bloomStrength: 0.22, exposure: 1.0, focus: 1.5, aperture: 0.6, maxBlur: 9};
  width = 1; height = 1;

  constructor(private renderer: THREE.WebGLRenderer, private scene: THREE.Scene, private camera: THREE.PerspectiveCamera) {
    const depth = new THREE.DepthTexture(1, 1);
    depth.type = THREE.UnsignedIntType;
    const msaa = new URLSearchParams(location.search).get('msaa');
    this.sceneRT = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, samples: msaa === null ? 4 : Number(msaa), depthTexture: depth});
    this.refractRT = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter});
    this.distRT = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter});
    this.aRT = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType});
    this.bRT = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType});
    this.gtao = new GTAOPass(scene, camera, 2, 2);
    this.gtao.setGBuffer(depth);
    this.gtao.output = GTAOPass.OUTPUT.Off;
    this.gtao.updateGtaoMaterial({radius: 0.06, distanceExponent: 1.4, thickness: 0.6, scale: 1.1, samples: 12, distanceFallOff: 1});
    this.gtao.updatePdMaterial({lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12});
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.22, 0.5, 1.4);
  }

  setSize(w: number, h: number, pixelRatio: number) {
    const W = Math.max(1, Math.round(w * pixelRatio)), H = Math.max(1, Math.round(h * pixelRatio));
    this.width = W; this.height = H;
    this.sceneRT.setSize(W, H);
    this.refractRT.setSize(W, H);
    this.distRT.setSize(W, H);
    this.aRT.setSize(W, H);
    this.bRT.setSize(W, H);
    this.gtao.setSize(Math.ceil(W / 2), Math.ceil(H / 2));
    this.bloom.setSize(W, H);
    const px = new THREE.Vector2(1 / W, 1 / H);
    (this.dofQuad.material as THREE.ShaderMaterial).uniforms.uPixel.value.copy(px);
    (this.finalQuad.material as THREE.ShaderMaterial).uniforms.uPixel.value.copy(px);
  }

  /**
   * Renders the opaque/transparent scene, then `overlay` (glass) with access to
   * a mip-mapped copy of what lies behind it, then the post chain to the screen.
   */
  render(time: number, overlay?: (refraction: THREE.Texture, distance: THREE.Texture) => void) {
    const r = this.renderer;
    const s = this.settings;
    r.setRenderTarget(this.sceneRT);
    r.clear();
    r.render(this.scene, this.camera);
    if (overlay) {
      (this.copyQuad.material as THREE.MeshBasicMaterial).map = this.sceneRT.texture;
      r.setRenderTarget(this.refractRT);
      this.copyQuad.render(r);
      const dm = this.distQuad.material as THREE.ShaderMaterial;
      dm.uniforms.tDepth.value = this.sceneRT.depthTexture;
      dm.uniforms.uInvProj.value.copy(this.camera.projectionMatrixInverse);
      r.setRenderTarget(this.distRT);
      this.distQuad.render(r);
      r.setRenderTarget(this.sceneRT);
      overlay(this.refractRT.texture, this.distRT.texture);
    }
    let color: THREE.WebGLRenderTarget = this.sceneRT;
    if (s.ao) {
      this.gtao.render(r, null as unknown as THREE.WebGLRenderTarget, this.sceneRT, 0, false);
      const m = this.aoQuad.material as THREE.ShaderMaterial;
      m.uniforms.tColor.value = this.sceneRT.texture;
      m.uniforms.tAO.value = this.gtao.gtaoMap;
      r.setRenderTarget(this.aRT);
      this.aoQuad.render(r);
      color = this.aRT;
    }
    if (s.bloom) {
      if (color === this.sceneRT) {
        (this.copyQuad.material as THREE.MeshBasicMaterial).map = this.sceneRT.texture;
        r.setRenderTarget(this.aRT);
        this.copyQuad.render(r);
        color = this.aRT;
      }
      this.bloom.strength = s.bloomStrength;
      this.bloom.render(r, null as unknown as THREE.WebGLRenderTarget, color, 0, false);
    }
    if (s.dof) {
      const m = this.dofQuad.material as THREE.ShaderMaterial;
      m.uniforms.tColor.value = color.texture;
      m.uniforms.tDepth.value = this.sceneRT.depthTexture;
      m.uniforms.uNear.value = this.camera.near;
      m.uniforms.uFar.value = this.camera.far;
      m.uniforms.uFocus.value = s.focus;
      m.uniforms.uAperture.value = s.aperture;
      m.uniforms.uMaxBlur.value = s.maxBlur * (this.height / 1080) * 1.4;
      const target = color === this.bRT ? this.aRT : this.bRT;
      r.setRenderTarget(target);
      this.dofQuad.render(r);
      color = target;
    }
    const f = this.finalQuad.material as THREE.ShaderMaterial;
    f.uniforms.tColor.value = color.texture;
    f.uniforms.uExposure.value = s.exposure;
    f.uniforms.uTime.value = time;
    r.setRenderTarget(null);
    this.finalQuad.render(r);
  }
}
