// Post-processing chain: HDR render -> (GTAO on high) -> bloom -> tone map/sRGB -> display grade (grain,
// vignette, chromatic aberration, split tone, impact response) -> SMAA.
// All time-varying parameters are driven from t for determinism.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.045 },
    uVignette: { value: 0.32 },
    uCA: { value: 0.0018 },
    uLift: { value: new THREE.Vector3(0.010, 0.013, 0.020) },
    uGain: { value: new THREE.Vector3(1.02, 1.0, 0.97) },
    uSat: { value: 0.86 },
    uImpact: { value: 0 }, // 0..1, brief contrast/saturation punch on impacts (no flashing)
    uFade: { value: 1 }, // 0 = black
    uRes: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uGrain, uVignette, uCA, uSat, uImpact, uFade;
    uniform vec3 uLift, uGain;
    uniform vec2 uRes;
    varying vec2 vUv;
    // small-multiplier hash (Hoskins hash12): stays precise for pixel coordinates in the thousands, where the old
    // large-multiplier hash degraded into vertical stripes late in the film
    float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      // radial chromatic aberration, stronger toward the edges and on impact
      float ca = uCA * (0.4 + r2 * 2.2) * (1.0 + uImpact * 2.5);
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + c * ca).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - c * ca).b;
      // split tone + lift/gain (display space)
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, uSat + uImpact * 0.12);
      vec3 shadowTint = vec3(0.86, 0.95, 1.10);
      vec3 hiTint = vec3(1.06, 1.0, 0.92);
      col *= mix(shadowTint, hiTint, smoothstep(0.05, 0.6, l));
      col = col * uGain + uLift * (1.0 - col);
      col = mix(col, col * col * (3.0 - 2.0 * col), uImpact * 0.25);
      // vignette
      float vig = smoothstep(0.85, 0.18, sqrt(r2) * (1.0 + uVignette * 0.6));
      col *= mix(1.0, vig, uVignette * 1.6);
      // film grain: 24 fps grain, luminance-weighted (stronger in shadows like real stock)
      vec2 gp = vUv * uRes + mod(floor(uTime * 24.0), 61.0) * vec2(37.0, 91.0);
      float g = (hash(gp) + hash(gp * 1.37 + 13.7) - 1.0) * 0.5; // per-pixel, softer distribution
      col += g * uGrain * (1.15 - l * 0.8);
      col *= uFade;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
};

// Depth of field (v2): gather bokeh in linear HDR, before bloom. Circle of confusion from a thin-lens-like
// |1/focus - 1/z| term; background samples may not bleed onto sharper foreground (scatter-as-gather weights).
const DofShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    uNear: { value: 0.03 },
    uFar: { value: 420 },
    uFocus: { value: 10 },
    uAperture: { value: 0 },
    uMaxPx: { value: 22 },
    uRes: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse, tDepth;
    uniform float uNear, uFar, uFocus, uAperture, uMaxPx;
    uniform vec2 uRes;
    varying vec2 vUv;
    float linZ(vec2 uv) {
      float d = texture2D(tDepth, uv).x;
      float z = d * 2.0 - 1.0;
      return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
    }
    float cocPx(float z) {
      float k = uRes.y / 1080.0;
      return clamp(uAperture * 40.0 * abs(1.0 / uFocus - 1.0 / z) * k, 0.0, uMaxPx * k);
    }
    void main() {
      vec4 c0 = texture2D(tDiffuse, vUv);
      if (uAperture <= 0.0) { gl_FragColor = c0; return; }
      float zc = linZ(vUv);
      float cc = cocPx(zc);
      float maxR = uMaxPx * (uRes.y / 1080.0);
      vec3 acc = c0.rgb; float wsum = 1.0;
      const int N = 40;
      for (int i = 0; i < N; i++) {
        float fi = float(i) + 0.5;
        float r = sqrt(fi / float(N)) * maxR;
        float a = fi * 2.39996323;
        vec2 suv = vUv + vec2(cos(a), sin(a)) * r / uRes;
        float zs = linZ(suv);
        float cs = cocPx(zs);
        // a farther sample may only spread as far as this pixel's own blur; a nearer one spreads freely
        float reach = zs > zc ? min(cs, cc) : cs;
        float w = clamp(reach - r + 1.0, 0.0, 1.0);
        acc += texture2D(tDiffuse, suv).rgb * w;
        wsum += w;
      }
      gl_FragColor = vec4(acc / wsum, c0.a);
    }
  `,
};

export function createPost(renderer, scene, camera, quality) {
  const size = renderer.getSize(new THREE.Vector2());
  const dpr = renderer.getPixelRatio();
  const rt = new THREE.WebGLRenderTarget(size.x * dpr, size.y * dpr, { type: THREE.HalfFloatType, samples: quality === 'high' ? 4 : 0 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(dpr);
  composer.setSize(size.x, size.y);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  let gtao = null;
  if (quality === 'high') {
    gtao = new GTAOPass(scene, camera, size.x, size.y);
    gtao.output = GTAOPass.OUTPUT.Default;
    gtao.blendIntensity = 0.85;
    gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 12 });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
    composer.addPass(gtao);
    // GTAO draws normals/depth with scene.overrideMaterial, which ignores the hair cards' alpha test: the strands would
    // go in as solid quads (dark AO rectangles, wrong DOF depth). Keep alpha-tested hair out of that pass.
    const hairList = [];
    let hairScanned = 0;
    const gtaoRender = gtao.render.bind(gtao);
    gtao.render = (renderer_, writeBuffer, readBuffer, deltaTime, maskActive) => {
      if (hairScanned < 3) { // the cast loads before the first frames; rescan a few times, then keep the list
        hairList.length = 0;
        scene.traverse((o) => { if (o.isMesh && o.name === 'Hair') hairList.push(o); });
        hairScanned++;
      }
      const was = hairList.map((o) => o.visible);
      for (const o of hairList) o.visible = false;
      gtaoRender(renderer_, writeBuffer, readBuffer, deltaTime, maskActive);
      hairList.forEach((o, i) => { o.visible = was[i]; });
    };
  }
  // depth of field: high reuses GTAO's depth; medium renders a half-resolution depth prepass only on DOF shots
  let dof = null, depthRT = null, depthMat = null;
  if (quality !== 'low') {
    dof = new ShaderPass(DofShader);
    dof.enabled = false;
    if (!gtao) {
      depthRT = new THREE.WebGLRenderTarget(Math.max(2, (size.x * dpr) >> 1), Math.max(2, (size.y * dpr) >> 1), { depthBuffer: true });
      depthRT.depthTexture = new THREE.DepthTexture(depthRT.width, depthRT.height);
      depthMat = new THREE.MeshBasicMaterial({ colorWrite: false });
    }
    composer.addPass(dof);
  }
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.32, 0.55, 0.92);
  if (quality !== 'low') composer.addPass(bloom);
  const output = new OutputPass();
  composer.addPass(output);
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);
  let smaa = null;
  if (quality !== 'low') {
    smaa = new SMAAPass(size.x * dpr, size.y * dpr);
    composer.addPass(smaa);
  }

  return {
    composer,
    grade,
    bloom,
    gtao,
    dof,
    setSize(w, h) {
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(w, h);
      grade.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      if (dof) dof.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      if (depthRT) { depthRT.setSize(Math.max(2, (w * renderer.getPixelRatio()) >> 1), Math.max(2, (h * renderer.getPixelRatio()) >> 1)); }
    },
    // params: { fade, impact, grain, vignette, bloom, dof: { enabled, focus, aperture } }
    render(t, params = {}) {
      const u = grade.uniforms;
      u.uTime.value = t;
      u.uFade.value = params.fade ?? 1;
      u.uImpact.value = params.impact ?? 0;
      u.uGrain.value = params.grain ?? (quality === 'low' ? 0.035 : 0.045);
      u.uVignette.value = params.vignette ?? 0.32;
      bloom.strength = params.bloom ?? 0.32;
      if (dof) {
        const d = params.dof;
        const on = !!(d && d.enabled && d.aperture > 0 && (params.fade ?? 1) > 0.001);
        dof.enabled = on;
        if (on) {
          const du = dof.uniforms;
          du.uFocus.value = Math.max(0.05, d.focus);
          du.uAperture.value = d.aperture;
          du.uNear.value = camera.near; du.uFar.value = camera.far;
          if (gtao) du.tDepth.value = gtao.depthTexture;
          else {
            const ov = scene.overrideMaterial;
            scene.overrideMaterial = depthMat;
            const prev = renderer.getRenderTarget();
            renderer.setRenderTarget(depthRT);
            renderer.clear(true, true, false);
            renderer.render(scene, camera);
            renderer.setRenderTarget(prev);
            scene.overrideMaterial = ov;
            du.tDepth.value = depthRT.depthTexture;
          }
        }
      }
      composer.render();
    },
  };
}
