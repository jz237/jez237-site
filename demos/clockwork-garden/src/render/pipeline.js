import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Render pipeline:
//   ScenePass  – renders the scene (MSAA, HDR, depth) for one or two cameras,
//                applies a gather-based bokeh depth of field, and cross-
//                dissolves between shots when needed.
//   Bloom      – restrained; only true highlights (emissive > 1) bloom.
//   GradePass  – exposure, split-tone grade, ACES tone map, vignette, fade,
//                fine grain, sRGB output.

const DOF_FRAG = /* glsl */ `
  #include <packing>
  uniform sampler2D tColorA, tDepthA, tColorB, tDepthB;
  uniform vec2 uTexel;
  uniform float uNearA, uFarA, uFocusA, uApertureA;
  uniform float uNearB, uFarB, uFocusB, uApertureB;
  uniform float uMaxBlur, uMix;
  uniform int uSteps;
  varying vec2 vUv;
  const float GOLDEN = 2.39996323;

  float viewDist(sampler2D d, vec2 uv, float n, float f) {
    float z = texture2D(d, uv).x;
    return -perspectiveDepthToViewZ(z, n, f);
  }
  float blurSize(float dist, float focus, float ap) {
    return clamp(abs(1.0 - focus / max(dist, 1e-3)) * ap, 0.0, uMaxBlur);
  }
  vec3 bokeh(sampler2D col, sampler2D dep, float n, float f, float focus, float ap) {
    vec3 center = min(texture2D(col, vUv).rgb, vec3(14.0));
    float cd = viewDist(dep, vUv, n, f);
    float cs = blurSize(cd, focus, ap);
    if (ap < 0.01 || any(isnan(center))) return any(isnan(center)) ? vec3(0.0) : center;
    vec3 acc = center;
    float tot = 1.0;
    float radius = 0.6;
    float ang = 0.0;
    for (int i = 0; i < 160; i++) {
      if (i >= uSteps || radius >= uMaxBlur) break;
      vec2 tc = vUv + vec2(cos(ang), sin(ang)) * uTexel * radius;
      vec3 sc = min(texture2D(col, tc).rgb, vec3(14.0));
      float sd = viewDist(dep, tc, n, f);
      float ss = blurSize(sd, focus, ap);
      if (sd > cd) ss = clamp(ss, 0.0, cs * 2.0);
      float m = smoothstep(radius - 0.5, radius + 0.5, ss);
      // highlights bloom into soft discs (cheap bokeh weighting)
      float lum = dot(sc, vec3(0.299, 0.587, 0.114));
      float w = 1.0 + smoothstep(1.5, 8.0, lum) * 0.6 * m;
      acc += mix(acc / tot, sc, m) * w;
      tot += w;
      radius += 1.0 / radius * 1.6;
      ang += GOLDEN;
    }
    return acc / tot;
  }
  void main() {
    vec3 a = bokeh(tColorA, tDepthA, uNearA, uFarA, uFocusA, uApertureA);
    if (uMix > 0.001) {
      vec3 b = bokeh(tColorB, tDepthB, uNearB, uFarB, uFocusB, uApertureB);
      a = mix(a, b, uMix);
    }
    gl_FragColor = vec4(a, 1.0);
  }
`;

const RAY_TINT = new THREE.Color('#ffd6a0');
const VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

function makeTarget(w, h, samples) {
  const depthTexture = new THREE.DepthTexture(w, h);
  depthTexture.type = THREE.FloatType;
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType,
    samples,
    depthTexture,
    depthBuffer: true,
  });
  return rt;
}

class ScenePass extends Pass {
  constructor(scene, w, h, quality) {
    super();
    this.scene = scene;
    this.quality = quality;
    this.rtA = makeTarget(w, h, quality.msaa);
    this.rtB = makeTarget(w, h, quality.msaa);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tColorA: { value: this.rtA.texture },
        tDepthA: { value: this.rtA.depthTexture },
        tColorB: { value: this.rtB.texture },
        tDepthB: { value: this.rtB.depthTexture },
        uTexel: { value: new THREE.Vector2(1 / w, 1 / h) },
        uNearA: { value: 0.1 }, uFarA: { value: 1000 }, uFocusA: { value: 10 }, uApertureA: { value: 0 },
        uNearB: { value: 0.1 }, uFarB: { value: 1000 }, uFocusB: { value: 10 }, uApertureB: { value: 0 },
        uMaxBlur: { value: 20 },
        uMix: { value: 0 },
        uSteps: { value: quality.dofSteps },
      },
      vertexShader: VERT,
      fragmentShader: DOF_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    this.fsQuad = new FullScreenQuad(this.material);
    this.shotA = null;
    this.shotB = null;
    this.mix = 0;
    this.height = h;
  }
  setSize(w, h) {
    this.rtA.setSize(w, h);
    this.rtB.setSize(w, h);
    this.material.uniforms.uTexel.value.set(1 / w, 1 / h);
    this.height = h;
  }
  // view: { camera, focus, aperture } – aperture is blur in px at 1080p for a
  // subject at infinity; scaled to the actual render height.
  setViews(a, b = null, mix = 0) {
    this.shotA = a;
    this.shotB = b;
    this.mix = b ? mix : 0;
  }
  render(renderer, writeBuffer) {
    const u = this.material.uniforms;
    const scale = this.height / 1080;
    u.uMaxBlur.value = Math.max(2, 26 * scale);
    const draw = (view, rt, suffix) => {
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(this.scene, view.camera);
      u['uNear' + suffix].value = view.camera.near;
      u['uFar' + suffix].value = view.camera.far;
      u['uFocus' + suffix].value = view.focus;
      u['uAperture' + suffix].value = this.quality.dof ? view.aperture * scale : 0;
    };
    if (this.shotA.before) this.shotA.before();
    draw(this.shotA, this.rtA, 'A');
    if (this.shotB && this.mix > 0.001) {
      if (this.shotB.before) this.shotB.before();
      draw(this.shotB, this.rtB, 'B');
      if (this.shotA.before) this.shotA.before();
    }
    u.uMix.value = this.mix;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.fsQuad.render(renderer);
  }
}

// Screen-space light shafts: sky visible through the glazing (depth = far)
// is marched toward the sun's screen position; iron ribs and plants occlude.
const RAYS_FRAG = /* glsl */ `
  uniform sampler2D tDiffuse, tDepth;
  uniform vec2 uSun;
  uniform float uIntensity, uDecay, uDensity, uSunVisible;
  uniform vec3 uTint;
  varying vec2 vUv;
  float skyMask(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
    float d = texture2D(tDepth, uv).x;
    vec3 c = min(texture2D(tDiffuse, uv).rgb, vec3(8.0));
    float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
    float near = exp(-length((uv - uSun) * vec2(1.6, 1.0)) * 1.6);
    return step(0.99999, d) * smoothstep(0.2, 1.4, lum) * near;
  }
  void main() {
    vec3 base = texture2D(tDiffuse, vUv).rgb;
    if (uIntensity <= 0.001) { gl_FragColor = vec4(base, 1.0); return; }
    vec2 delta = (vUv - uSun) * uDensity / 56.0;
    vec2 uv = vUv;
    float illum = 1.0, acc = 0.0;
    float jitter = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
    uv -= delta * jitter;
    for (int i = 0; i < 56; i++) {
      uv -= delta;
      acc += skyMask(uv) * illum;
      illum *= uDecay;
    }
    acc /= 56.0;
    gl_FragColor = vec4(base + uTint * acc * uIntensity, 1.0);
  }
`;

const GRADE_FRAG = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uExposure, uFade, uVignette, uGrain, uTime, uSat, uWarm, uShadowAmt, uGrainLum;
  uniform vec3 uShadowTint, uHighTint;
  uniform vec2 uRes;
  varying vec2 vUv;
  vec3 aces(vec3 x) {
    // Hill / Narkowicz fitted ACES (RRT+ODT)
    const mat3 inM = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
    const mat3 outM = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
    x = inM * x;
    vec3 a = x * (x + 0.0245786) - 0.000090537;
    vec3 b = x * (0.983729 * x + 0.4329510) + 0.238081;
    return clamp(outM * (a / b), 0.0, 1.0);
  }
  vec3 toSRGB(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 uv = vUv;
    // whisper of lateral chromatic aberration toward the frame edges
    vec2 dc = uv - 0.5;
    float ca = dot(dc, dc) * 0.0035;
    vec3 col;
    col.r = texture2D(tDiffuse, uv - dc * ca).r;
    col.g = texture2D(tDiffuse, uv).g;
    col.b = texture2D(tDiffuse, uv + dc * ca).b;
    col *= uExposure;
    // split-tone grade in scene-linear: teal in the shadows, gold in highlights
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    float sh = 1.0 - smoothstep(0.0, 0.35, lum);
    float hi = smoothstep(0.4, 2.5, lum);
    col *= mix(vec3(1.0), uShadowTint, sh * uShadowAmt);
    col *= mix(vec3(1.0), uHighTint, hi * 0.5);
    col = mix(vec3(lum), col, uSat);
    vec3 mapped = aces(col);
    // vignette (in display space)
    float v = smoothstep(0.95, 0.25, length(dc * vec2(uRes.x / uRes.y, 1.0)) * 0.9);
    mapped *= mix(1.0, v, uVignette);
    mapped *= (1.0 - uFade);
    vec3 outc = toSRGB(mapped);
    // fine animated grain, stronger in the mids
    float g = hash(uv * uRes + fract(uTime * 7.31) * 100.0) - 0.5;
    outc += g * uGrain * (0.4 + 0.6 * (1.0 - abs(min(lum, uGrainLum) - 0.5)));
    gl_FragColor = vec4(outc, 1.0);
  }
`;

export class Pipeline {
  constructor(renderer, scene, quality) {
    this.renderer = renderer;
    this.quality = quality;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(1);
    this.composer.setSize(size.x, size.y);
    this.scenePass = new ScenePass(scene, size.x, size.y, quality);
    this.composer.addPass(this.scenePass);
    // light shafts through the glazing
    this.rays = new Pass();
    this.rays.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tDepth: { value: this.scenePass.rtA.depthTexture },
        uSun: { value: new THREE.Vector2(0.5, 1.2) },
        uIntensity: { value: 0 },
        uDecay: { value: 0.975 },
        uDensity: { value: 0.85 },
        uSunVisible: { value: 1 },
        uTint: { value: new THREE.Color('#ffd6a0') },
      },
      vertexShader: VERT,
      fragmentShader: RAYS_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    this.rays.fsQuad = new FullScreenQuad(this.rays.material);
    this.rays.render = function (renderer, writeBuffer, readBuffer) {
      this.material.uniforms.tDiffuse.value = readBuffer.texture;
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      this.fsQuad.render(renderer);
    };
    if (quality.tier !== 'low') this.composer.addPass(this.rays);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x / 2, size.y / 2), 0.32, 0.55, 1.15);
    if (quality.bloom) this.composer.addPass(this.bloom);
    this.grade = new Pass();
    this.grade.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uExposure: { value: 1 },
        uFade: { value: 0 },
        uVignette: { value: 0.55 },
        uGrain: { value: 0.035 },
        uTime: { value: 0 },
        uSat: { value: 1.05 },
        uWarm: { value: 0 },
        uShadowAmt: { value: 0.6 },
        uGrainLum: { value: 1e6 }, // the interactive modes cap it: glowing petals stay smooth
        uShadowTint: { value: new THREE.Color('#7fb7c0') },
        uHighTint: { value: new THREE.Color('#ffe2b5') },
        uRes: { value: new THREE.Vector2(size.x, size.y) },
      },
      vertexShader: VERT,
      fragmentShader: GRADE_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    this.grade.fsQuad = new FullScreenQuad(this.grade.material);
    this.grade.render = function (renderer, writeBuffer, readBuffer) {
      this.material.uniforms.tDiffuse.value = readBuffer.texture;
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      this.fsQuad.render(renderer);
    };
    this.composer.addPass(this.grade);
  }

  setSize(w, h) {
    this.composer.setSize(w, h);
    this.scenePass.setSize(w, h);
    this.bloom.setSize(w / 2, h / 2);
    this.grade.material.uniforms.uRes.value.set(w, h);
  }

  render(viewA, viewB, mix, look) {
    this.scenePass.setViews(viewA, viewB, mix);
    const u = this.grade.material.uniforms;
    u.uExposure.value = look.exposure;
    u.uFade.value = look.fade;
    u.uTime.value = look.time;
    u.uVignette.value = look.vignette ?? 0.55;
    u.uSat.value = look.saturation ?? 1.05;
    u.uShadowAmt.value = look.shadowTint ?? 0.5;
    u.uGrainLum.value = look.grainLum ?? 1e6;
    this.bloom.strength = look.bloom ?? 0.32;
    // light shafts: project the sun into screen space for camera A
    const ru = this.rays.material.uniforms;
    ru.uIntensity.value = 0;
    if ((look.godrays ?? 0) > 0.001 && look.sunDir) {
      const cam = viewA.camera;
      const p = cam.position.clone().addScaledVector(look.sunDir, -1000).project(cam);
      const inFront = cam.getWorldDirection(new THREE.Vector3()).dot(look.sunDir) < 0;
      // (look.rayNear: march only when the light is on or near the frame, as the moon's faint rays are)
      if (inFront && (!look.rayNear || (Math.abs(p.x) < look.rayNear && Math.abs(p.y) < look.rayNear))) {
        ru.uSun.value.set(p.x * 0.5 + 0.5, p.y * 0.5 + 0.5);
        ru.uIntensity.value = look.godrays * 0.9;
      }
    }
    // (the interactive modes tint the rays: cool moon rays by night)
    ru.uTint.value.copy(look.rayTint ?? RAY_TINT);
    this.composer.render();
  }
}
