// Post chain: MSAA HDR scene -> GTAO ambient occlusion -> bloom -> final (tone map, focus dimming, selection outline, vignette, dither).
import * as THREE from 'three';
import { EffectComposer } from '../vendor/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/postprocessing/RenderPass.js';
import { GTAOPass } from '../vendor/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from '../vendor/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from '../vendor/postprocessing/ShaderPass.js';

const FINAL_FRAG = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tId;
uniform sampler2D tFlags;
uniform vec2 uRes;
uniform float uHasId;
uniform float uFocus;
uniform float uOutlinePx;
uniform float uVig;
uniform float uGrain;
uniform float uTime;
uniform vec3 uPaper;
uniform vec3 uSelCol;
uniform vec3 uHovCol;
varying vec2 vUv;

int flagsAt(vec2 uv) {
  vec4 c = texture2D(tId, uv);
  int id = int(c.r * 255.0 + 0.5) + int(c.g * 255.0 + 0.5) * 256;
  if (id == 0) return 0;
  return int(texelFetch(tFlags, ivec2(id, 0), 0).r * 255.0 + 0.5) | 8;
}

void main() {
  vec3 col = texture2D(tDiffuse, vUv).rgb;
  float asp = uRes.x / uRes.y;
  float vg = 1.0 - uVig * smoothstep(0.30, 0.98, length((vUv - 0.5) * vec2(asp, 1.0)) * 1.15);
  col *= vg;

  float dimMask = 0.0, selOut = 0.0, selIn = 0.0, hovOut = 0.0;
  if (uHasId > 0.5) {
    int f0 = flagsAt(vUv);
    bool isPart = (f0 & 8) != 0;
    bool isSel = (f0 & 1) != 0;
    bool isHov = (f0 & 2) != 0;
    if (isPart && !isSel) dimMask = uFocus;
    float nSel = 0.0, nUnsel = 0.0, nHov = 0.0;
    vec2 px = vec2(uOutlinePx) / uRes;
    for (int i = 0; i < 8; i++) {
      float a = 0.785398163 * float(i);
      int f = flagsAt(vUv + vec2(cos(a), sin(a)) * px);
      if ((f & 1) != 0) nSel = 1.0; else nUnsel = 1.0;
      if ((f & 2) != 0) nHov = 1.0;
    }
    if (!isSel) selOut = nSel; else selIn = nUnsel;
    if (!isHov) hovOut = nHov;
  }

  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 ghost = mix(vec3(lum), uPaper, 0.52);
  col = mix(col, ghost, dimMask * 0.82);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>

  vec3 o = gl_FragColor.rgb;
  o = mix(o, vec3(0.07, 0.09, 0.12), selIn * 0.72);
  o = mix(o, uHovCol, hovOut * 0.95);
  o = mix(o, uSelCol, selOut);
  float n1 = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  float n2 = fract(sin(dot(gl_FragCoord.xy + uTime + 17.0, vec2(39.3468, 11.135))) * 24634.6345);
  o += (n1 + n2 - 1.0) * uGrain;
  gl_FragColor = vec4(o, 1.0);
}
`;

export function createPost({ stage, Q, picker }) {
  const { renderer, scene, camera } = stage;
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const hdr = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const rt = new THREE.WebGLRenderTarget(size.x, size.y, {
    type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: Q.msaa, depthBuffer: true, stencilBuffer: false,
  });
  const composer = new EffectComposer(renderer, rt);
  composer.renderTarget1.samples = 0;           // RT2 (the scene target) keeps MSAA; RT1 only holds full-screen quads
  composer.renderTarget1.depthBuffer = false;
  composer.setPixelRatio(stage.dpr);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // ambient occlusion: depth/normal from opaque geometry only (no fur, glass, guides)
  const ao = new GTAOPass(scene, camera, size.x, size.y);
  ao.output = GTAOPass.OUTPUT.Default;
  ao.blendIntensity = 1.0;
  ao.updateGtaoMaterial({ radius: 3.2, distanceExponent: 1.4, thickness: 1.6, scale: 1.15, samples: 16, distanceFallOff: 1.0, screenSpaceRadius: false });
  ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 16 });
  const aoRender = ao.render.bind(ao);
  ao.render = (...args) => {
    const m = camera.layers.mask;
    camera.layers.mask = 1;
    aoRender(...args);
    camera.layers.mask = m;
  };
  ao.enabled = Q.ao;
  composer.addPass(ao);

  const pf = (k, d) => { const v = parseFloat(Q.params.get(k)); return Number.isFinite(v) ? v : d; };
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), pf('bs', 0.16), 0.5, pf('bt', 1.55));
  // Softbox reflections on polished metal reach 15+ HDR units; cap the energy fed to the blur so only glints, not halos, bloom.
  bloom.highPassUniforms.uCap = { value: pf('bc', 1.7) };
  bloom.highPassUniforms.uKnee = { value: 0.7 };
  bloom.materialHighPassFilter.fragmentShader = `
    uniform sampler2D tDiffuse; uniform vec3 defaultColor; uniform float defaultOpacity;
    uniform float luminosityThreshold; uniform float uCap; uniform float uKnee; varying vec2 vUv;
    void main(){
      vec4 t = texture2D(tDiffuse, vUv);
      float v = max(luminance(t.rgb), 1e-4);
      float k = smoothstep(luminosityThreshold, luminosityThreshold + uKnee, v);
      gl_FragColor = vec4(t.rgb * (min(v, uCap) / v) * k, 1.0);
    }`;
  bloom.materialHighPassFilter.needsUpdate = true;
  bloom.enabled = Q.bloom;
  composer.addPass(bloom);

  const flags = new Uint8Array(1024);
  const flagsTex = new THREE.DataTexture(flags, 1024, 1, THREE.RedFormat, THREE.UnsignedByteType);
  flagsTex.minFilter = flagsTex.magFilter = THREE.NearestFilter;
  flagsTex.generateMipmaps = false;
  flagsTex.needsUpdate = true;

  const finalMat = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tId: { value: picker.rt.texture },
      tFlags: { value: flagsTex },
      uRes: { value: new THREE.Vector2(size.x, size.y) },
      uHasId: { value: 0 },
      uFocus: { value: 0 },
      uOutlinePx: { value: 2.0 },
      uVig: { value: 0.16 },
      uGrain: { value: 0.0035 },
      uTime: { value: 0 },
      uPaper: { value: new THREE.Color(0.80, 0.80, 0.78) },
      uSelCol: { value: new THREE.Color(1.0, 0.69, 0.0) },
      uHovCol: { value: new THREE.Color(0.10, 0.50, 0.95) },
    },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: FINAL_FRAG,
    depthTest: false, depthWrite: false,
  });
  const finalPass = new ShaderPass(finalMat, 'tDiffuse');
  composer.addPass(finalPass);

  const U = finalMat.uniforms;
  const post = {
    composer, ao, bloom, finalPass, uniforms: U, flags, flagsTex, passes: { renderPass, ao, bloom, finalPass },
    resize(w, h, dpr) {
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      const bw = Math.round(w * dpr), bh = Math.round(h * dpr);
      picker.setSize(bw, bh);
      U.uRes.value.set(bw, bh);
      U.uOutlinePx.value = Math.max(1.4, 1.7 * dpr);
      U.tId.value = picker.rt.texture;
    },
    setFlags(selected, hover) {
      flags.fill(0);
      for (const i of selected) flags[i + 1] |= 1;
      for (const i of hover) flags[i + 1] |= 2;
      flagsTex.needsUpdate = true;
    },
    render({ id = false, focus = 0, time = 0 } = {}) {
      if (id) picker.renderFull();
      U.uHasId.value = id ? 1 : 0;
      U.uFocus.value = focus;
      U.uTime.value = (time % 97) * 13.7;
      composer.readBuffer = composer.renderTarget2;
      composer.writeBuffer = composer.renderTarget1;
      composer.render(0.016);
    },
  };
  return post;
}
