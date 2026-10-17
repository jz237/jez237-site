// Post-processing chain: HDR render -> (GTAO on high) -> depth of field -> camera motion blur -> bloom (warm halation
// tint in its wide mips) -> tone map/sRGB -> display grade (sharpen, black point, filmic contrast, three-way colour,
// chromatic aberration, vignette, grain, impact response) -> SMAA.
// All time-varying parameters are driven from t for determinism (motion blur: the camera at t - shutter, from shots).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

// The release grade (display space, after AgX). Tunable at runtime through post.look (lab: tools/lab.mjs --eval).
export const LOOK = {
  sharpen: 0.35,        // unsharp mask amount (the MSAA resolve, SMAA and DOF soften texture detail)
  black: 0.010,         // black point: display values below this go to black (AgX alone leaves blacks milky)
  contrast: 1.30,       // filmic S-curve slope around the pivot (1 = none); main.js exposure 1.10 feeds it
  pivot: 0.32,
  sat: 1.0,             // saturation in the mids/highlights
  shadowSat: 0.58,      // and in the shadows (night film: colour drains out of the dark)
  shadowTint: [0.80, 0.965, 1.20],  // cold steel-blue night shadows
  midTint: [0.94, 1.0, 1.05],
  hiTint: [1.11, 0.99, 0.83],       // warm practicals: tungsten / old sodium lamps, pumpkins
  lift: [0.004, 0.0065, 0.011],     // a cool film-base black
  gain: [1.0, 1.0, 1.0],
  halation: [[1, 1, 1], [1, 0.97, 0.94], [1.04, 0.9, 0.8], [1.1, 0.8, 0.66], [1.16, 0.7, 0.55]], // bloom mip tints
};

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.045 },
    uVignette: { value: 0.32 },
    uCA: { value: 0.0018 },
    uSharpen: { value: LOOK.sharpen },
    uBlack: { value: LOOK.black },
    uContrast: { value: LOOK.contrast },
    uPivot: { value: LOOK.pivot },
    uSat: { value: LOOK.sat },
    uShadowSat: { value: LOOK.shadowSat },
    uShadowTint: { value: new THREE.Vector3(...LOOK.shadowTint) },
    uMidTint: { value: new THREE.Vector3(...LOOK.midTint) },
    uHiTint: { value: new THREE.Vector3(...LOOK.hiTint) },
    uLift: { value: new THREE.Vector3(...LOOK.lift) },
    uGain: { value: new THREE.Vector3(...LOOK.gain) },
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
    uniform float uTime, uGrain, uVignette, uCA, uSat, uShadowSat, uImpact, uFade, uSharpen, uBlack, uContrast, uPivot;
    uniform vec3 uLift, uGain, uShadowTint, uMidTint, uHiTint;
    uniform vec2 uRes;
    varying vec2 vUv;
    // small-multiplier hash (Hoskins hash12): stays precise for pixel coordinates in the thousands, where the old
    // large-multiplier hash degraded into vertical stripes late in the film
    float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
    // per-channel filmic S-curve around the pivot: a power toe below it, the mirrored shoulder above (print-like:
    // it also lifts saturation in the mids, which the saturation controls then shape)
    vec3 sCurve(vec3 x) {
      x = clamp(x, 0.0, 1.0);
      vec3 lo = uPivot * pow(x / uPivot, vec3(uContrast));
      vec3 hi = 1.0 - (1.0 - uPivot) * pow(max((1.0 - x) / (1.0 - uPivot), 0.0), vec3(uContrast));
      return mix(lo, hi, step(vec3(uPivot), x));
    }
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      // radial chromatic aberration, stronger toward the edges and on impact
      float ca = uCA * (0.4 + r2 * 2.2) * (1.0 + uImpact * 2.5);
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + c * ca).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - c * ca).b;
      // unsharp mask against the 4-neighbour mean
      vec2 px = 1.0 / uRes;
      vec3 nb = texture2D(tDiffuse, vUv + vec2(px.x, 0.0)).rgb + texture2D(tDiffuse, vUv - vec2(px.x, 0.0)).rgb
              + texture2D(tDiffuse, vUv + vec2(0.0, px.y)).rgb + texture2D(tDiffuse, vUv - vec2(0.0, px.y)).rgb;
      col = max(col + (col - nb * 0.25) * uSharpen, 0.0);
      // black point, then contrast
      col = max(col - uBlack, 0.0) / (1.0 - uBlack);
      col = sCurve(col);
      // colour: saturation drains out of the shadows; cold shadows, neutral mids, warm highlights
      float l = luma(col);
      col = mix(vec3(l), col, mix(uShadowSat, uSat, smoothstep(0.02, 0.32, l)) + uImpact * 0.12);
      float wS = 1.0 - smoothstep(0.0, 0.30, l);
      float wH = smoothstep(0.32, 0.85, l);
      col *= uShadowTint * wS + uMidTint * max(1.0 - wS - wH, 0.0) + uHiTint * wH;
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
    uFrame: { value: 0 },
    uClamp: { value: 5.0 },
    uRes: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse, tDepth;
    uniform float uNear, uFar, uFocus, uAperture, uMaxPx, uFrame, uClamp;
    uniform vec2 uRes;
    varying vec2 vUv;
    // interleaved gradient noise: a per-pixel rotation of the sample spiral turns its fixed pattern (rings of dots
    // around small bright highlights, e.g. catchlights) into fine noise the film grain hides
    float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
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
      float rot = ign(gl_FragCoord.xy + uFrame * 5.588238) * 6.2831853;
      for (int i = 0; i < N; i++) {
        float fi = float(i) + 0.5;
        float r = sqrt(fi / float(N)) * maxR;
        float a = fi * 2.39996323 + rot;
        vec2 suv = vUv + vec2(cos(a), sin(a)) * r / uRes;
        float zs = linZ(suv);
        float cs = cocPx(zs);
        // a farther sample may only spread as far as this pixel's own blur; a nearer one spreads freely
        float reach = zs > zc ? min(cs, cc) : cs;
        float w = clamp(reach - r + 1.0, 0.0, 1.0);
        // HDR clamp: one sample landing on a tiny very bright spot must not stamp it into the blur as a dot
        acc += min(texture2D(tDiffuse, suv).rgb, vec3(uClamp)) * w;
        wsum += w;
      }
      gl_FragColor = vec4(acc / wsum, c0.a);
    }
  `,
};

// Camera motion blur: every pixel's world position (from depth) is reprojected with the camera of t - shutter; the
// colour is gathered along that screen-space path. A fixed film shutter (main.js SHUTTER) whatever the display rate,
// so the handheld drift, the running bob and the scares' camera thrash smear like a film camera. Camera motion only
// (the creatures' own motion isn't in it).
const MotionBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    uInvViewProj: { value: new THREE.Matrix4() },
    uPrevViewProj: { value: new THREE.Matrix4() },
    uMaxPx: { value: 48 },
    uFrame: { value: 0 },
    uRes: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse, tDepth;
    uniform mat4 uInvViewProj, uPrevViewProj;
    uniform float uMaxPx, uFrame;
    uniform vec2 uRes;
    varying vec2 vUv;
    float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
    void main() {
      vec4 c0 = texture2D(tDiffuse, vUv);
      float d = texture2D(tDepth, vUv).x;
      vec4 wp = uInvViewProj * vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
      wp /= wp.w;
      vec4 pp = uPrevViewProj * vec4(wp.xyz, 1.0);
      if (pp.w <= 0.0) { gl_FragColor = c0; return; }
      vec2 v = vUv - (pp.xy / pp.w * 0.5 + 0.5);
      float L = length(v * uRes);
      if (L < 0.75) { gl_FragColor = c0; return; }
      if (L > uMaxPx) v *= uMaxPx / L;
      const int N = 12;
      float j = ign(gl_FragCoord.xy + uFrame * 5.588238);
      vec3 acc = vec3(0.0);
      for (int i = 0; i < N; i++) {
        vec2 suv = clamp(vUv + v * ((float(i) + j) / float(N) - 0.5), vec2(0.0), vec2(1.0));
        acc += texture2D(tDiffuse, suv).rgb;
      }
      gl_FragColor = vec4(acc / float(N), c0.a);
    }
  `,
};

const _vp = new THREE.Matrix4(), _pvp = new THREE.Matrix4(), _v4 = new THREE.Vector4();
// largest screen displacement (px) between two view-projections over a few probe points at 1.5 m and 12 m: lets the
// renderer skip the blur pass (and medium's depth prepass) when the camera is effectively still
function maxShiftPx(invVP, prevVP, res, near, far) {
  let m = 0;
  const ndcZ = (zv) => (far + near) / (far - near) - (2 * far * near) / ((far - near) * zv);
  for (const [x, y] of [[0, 0], [-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) {
    for (const zn of [ndcZ(1.5), ndcZ(12)]) {
      _v4.set(x, y, zn, 1).applyMatrix4(invVP);
      _v4.divideScalar(_v4.w);
      _v4.w = 1;
      _v4.applyMatrix4(prevVP);
      if (_v4.w <= 0) return 1e3;
      const dx = (_v4.x / _v4.w - x) * 0.5 * res.x, dy = (_v4.y / _v4.w - y) * 0.5 * res.y;
      m = Math.max(m, Math.hypot(dx, dy));
    }
  }
  return m;
}

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
    // GTAO draws normals/depth with scene.overrideMaterial, which ignores the hair cards' alpha test (the strands would
    // go in as solid quads: dark AO rectangles, wrong DOF depth) and also ignores colorWrite/depthWrite = false, so an
    // invisible occluder or shadow proxy would z-fight the real surfaces there (the 3609 sofa "sparkle" was exactly
    // that) and additive/transparent effects (halos, light volumes, rain) would land as solid dark shapes. Keep hair,
    // invisible proxies, depth-less transparent effects and anything flagged userData.noAO out of that pass.
    const hairList = [];
    let hairScanned = 0;
    const skipAO = (o) => {
      if (!(o.isMesh || o.isPoints || o.isLine || o.isSprite)) return false;
      if (o.name === 'Hair' || (o.userData && o.userData.noAO)) return true;
      const ms = Array.isArray(o.material) ? o.material : [o.material];
      return ms.every((m) => m && (m.colorWrite === false || (m.transparent && m.depthWrite === false) || m.blending === THREE.AdditiveBlending));
    };
    const gtaoRender = gtao.render.bind(gtao);
    gtao.render = (renderer_, writeBuffer, readBuffer, deltaTime, maskActive) => {
      if (hairScanned < 3) { // the cast loads before the first frames; rescan a few times, then keep the list
        hairList.length = 0;
        scene.traverse((o) => { if (skipAO(o)) hairList.push(o); });
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
  // camera motion blur: high only (it reuses GTAO's depth; on medium it would cost a depth prepass on every moving frame)
  let mb = null;
  if (quality === 'high') {
    mb = new ShaderPass(MotionBlurShader);
    mb.enabled = false;
    composer.addPass(mb);
  }
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.32, 0.55, 0.92);
  LOOK.halation.forEach((c, i) => bloom.bloomTintColors[i].set(...c)); // warm red-orange wide glow: film halation
  if (quality !== 'low') composer.addPass(bloom);
  const output = new OutputPass();
  composer.addPass(output);
  const grade = new ShaderPass(GradeShader);
  if (quality !== 'high') grade.uniforms.uSharpen.value = LOOK.sharpen * 0.6;
  composer.addPass(grade);
  let smaa = null;
  if (quality !== 'low') {
    smaa = new SMAAPass(size.x * dpr, size.y * dpr);
    composer.addPass(smaa);
  }

  // depth for DOF/motion blur: GTAO's on high; medium renders a half-resolution depth prepass, only on DOF frames
  function prepassDepth() {
    if (gtao) return gtao.depthTexture;
    const ov = scene.overrideMaterial;
    scene.overrideMaterial = depthMat;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(depthRT);
    renderer.clear(true, true, false);
    renderer.render(scene, camera);
    renderer.setRenderTarget(prev);
    scene.overrideMaterial = ov;
    return depthRT.depthTexture;
  }

  // the grade's live uniforms from a LOOK-shaped object (lab tuning: post.applyLook({ contrast: 1.3 }))
  function applyLook(l = {}) {
    Object.assign(LOOK, l);
    const u = grade.uniforms;
    u.uSharpen.value = LOOK.sharpen * (quality === 'high' ? 1 : 0.6);
    u.uBlack.value = LOOK.black; u.uContrast.value = LOOK.contrast; u.uPivot.value = LOOK.pivot;
    u.uSat.value = LOOK.sat; u.uShadowSat.value = LOOK.shadowSat;
    u.uShadowTint.value.set(...LOOK.shadowTint); u.uMidTint.value.set(...LOOK.midTint); u.uHiTint.value.set(...LOOK.hiTint);
    u.uLift.value.set(...LOOK.lift); u.uGain.value.set(...LOOK.gain);
    LOOK.halation.forEach((c, i) => bloom.bloomTintColors[i].set(...c));
  }

  const flags = { mb: true }; // diagnostics (lab/perf): post.flags.mb = false
  return {
    composer,
    grade,
    bloom,
    gtao,
    dof,
    mb,
    flags,
    look: LOOK,
    applyLook,
    setSize(w, h) {
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(w, h);
      grade.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      if (dof) dof.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      if (mb) mb.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      if (depthRT) { depthRT.setSize(Math.max(2, (w * renderer.getPixelRatio()) >> 1), Math.max(2, (h * renderer.getPixelRatio()) >> 1)); }
    },
    // params: { fade, impact, grain, vignette, bloom, dof: { enabled, focus, aperture }, prevCamera (motion blur) }
    render(t, params = {}) {
      const u = grade.uniforms;
      const frame = Math.floor(t * 30) % 64; // animated sampling noise, a function of t
      u.uTime.value = t;
      u.uFade.value = params.fade ?? 1;
      u.uImpact.value = params.impact ?? 0;
      u.uGrain.value = params.grain ?? (quality === 'low' ? 0.035 : 0.045);
      u.uVignette.value = params.vignette ?? 0.32;
      bloom.strength = params.bloom ?? 0.32;
      // GTAO multiplies the whole lit image, emissive glints included: shots can ease it off (under car B: the underbody's
      // glints and the street bounce are the only light, and full AO buried them)
      if (gtao) gtao.blendIntensity = 0.85 * (params.ao ?? 1);
      const visible = (params.fade ?? 1) > 0.001;
      let depth = null;
      if (dof) {
        const d = params.dof;
        const on = !!(d && d.enabled && d.aperture > 0 && visible);
        dof.enabled = on;
        if (on) {
          const du = dof.uniforms;
          du.uFocus.value = Math.max(0.05, d.focus);
          du.uAperture.value = d.aperture;
          du.uNear.value = camera.near; du.uFar.value = camera.far;
          du.uFrame.value = frame;
          du.tDepth.value = depth = prepassDepth();
        }
      }
      if (mb) {
        let on = false;
        const pc = params.prevCamera;
        if (pc && visible && flags.mb) {
          camera.updateMatrixWorld();
          _vp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).invert();
          _pvp.multiplyMatrices(pc.projectionMatrix, pc.matrixWorldInverse);
          on = maxShiftPx(_vp, _pvp, mb.uniforms.uRes.value, camera.near, camera.far) > 1.0;
          if (on) {
            const mu = mb.uniforms;
            mu.uInvViewProj.value.copy(_vp);
            mu.uPrevViewProj.value.copy(_pvp);
            mu.uMaxPx.value = 32 * (mu.uRes.value.y / 1080);
            mu.uFrame.value = frame;
            mu.tDepth.value = depth || (depth = prepassDepth());
          }
        }
        mb.enabled = on;
      }
      composer.render();
    },
  };
}
