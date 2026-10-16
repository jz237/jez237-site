// The puddle beside car B (CAR agent): where the face-paint infected's cheek lies in U3. A shallow, irregular sheet of
// water on the asphalt with
//   high:        a planar reflection (three's Reflector, HDR target at ~half the screen size, rendered at most once per
//                film update and only while the camera is near) distorted by the ripple normals, Fresnel-weighted;
//   medium/low:  a glossy standard material (env + the light pool's speculars) with the same ripple normals.
// Ripples (all pure functions of t): rain (a jittered grid of drop sites, each re-hit on its own period), drip
// landings from carB_drips.js, breath rings from addBreath(times, pos) and a continuous local disturbance from
// setBreathSource(pos, strength) (the lead calls it every frame AFTER props.update; props.update resets it to 0).
//   buildPuddle(ctx, { center, radius, quality, carFrame }) -> { group, center, radius, y, api, update(t, camera, landings) }
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

const MAX_BREATH = 16, MAX_LAND = 6;

const RIPPLE_GLSL = /* glsl */`
uniform float uTime;
uniform vec4 uBreath[${MAX_BREATH}];   // xz = pos, z = time, w = strength
uniform vec4 uLand[${MAX_LAND}];       // xz = pos, z = time, w = strength
uniform vec4 uSrc;                     // continuous breath source: xz, strength (z), unused w
uniform float uRain;
float pHash(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
// gradient (d/dx, d/dz) of the ripple height field at world xz
vec2 ringGrad(vec2 p, vec2 c, float age, float amp, float speed, float freq) {
  if (age <= 0.0 || age > 2.6) return vec2(0.0);
  vec2 d = p - c; float r = length(d) + 1e-4;
  float front = speed * age;
  float x = r - front;
  float env = exp(-x * x / (0.0016 + 0.004 * age)) * exp(-age * 2.2) * amp / (1.0 + r * 9.0);
  float w = cos(x * freq) * env * freq;
  return d / r * w;
}
vec2 rippleGrad(vec2 p) {
  vec2 g = vec2(0.0);
  // rain: 0.11 m cells, each hit every 0.7..1.7 s at a jittered point
  vec2 cell = floor(p / 0.11);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 id = cell + vec2(float(i), float(j));
    for (int k = 0; k < 2; k++) {
      float h = pHash(id + float(k) * 17.7);
      float per = mix(0.7, 1.7, pHash(id * 1.3 + 5.1 + float(k)));
      float ph = h * per;
      float n = floor((uTime + ph) / per);
      float age = uTime + ph - n * per;
      vec2 c = (id + vec2(pHash(id + n * 1.31 + float(k)), pHash(id * 2.1 + n + float(k) * 3.3))) * 0.11;
      g += ringGrad(p, c, age, 0.0005 * uRain, 0.32, 160.0);
    }
  }
  for (int b = 0; b < ${MAX_BREATH}; b++) {
    vec4 B = uBreath[b];
    if (B.w <= 0.0) continue;
    float age = uTime - B.z;
    g += ringGrad(p, B.xy, age, 0.0026 * B.w, 0.16, 120.0);
    g += ringGrad(p, B.xy, age - 0.22, 0.0017 * B.w, 0.16, 120.0);
    g += ringGrad(p, B.xy, age - 0.45, 0.001 * B.w, 0.16, 120.0);
  }
  for (int l = 0; l < ${MAX_LAND}; l++) {
    vec4 L = uLand[l];
    if (L.w <= 0.0) continue;
    g += ringGrad(p, L.xy, uTime - L.z, 0.0022 * L.w, 0.3, 150.0);
    g += ringGrad(p, L.xy, uTime - L.z - 0.12, 0.0011 * L.w, 0.3, 150.0);
  }
  if (uSrc.z > 0.0) {
    vec2 d = p - uSrc.xy; float r = length(d) + 1e-4;
    float w = sin(r * 70.0 - uTime * 9.0) * exp(-r / 0.11) * uSrc.z * 0.16;
    g += d / r * w;
  }
  return g;
}
`;

function blobGeometry(radius, seed) {
  // irregular outline (polar noise), elongated along the gutter (local y = world -z after the -90 deg X rotation)
  const segs = 96, rings = 10;
  const pos = [], shore = [], idx = [];
  const R = (a) => radius * (1 + 0.16 * Math.sin(2 * a + seed) + 0.09 * Math.sin(3 * a + seed * 1.7) + 0.05 * Math.sin(5 * a + seed * 2.3) + 0.03 * Math.sin(9 * a + seed));
  pos.push(0, 0, 0); shore.push(0);
  for (let r = 1; r <= rings; r++) {
    const f = r / rings;
    for (let s = 0; s < segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const rr = R(a) * f;
      pos.push(Math.cos(a) * rr * 0.82, Math.sin(a) * rr * 1.18, 0);
      shore.push(f);
    }
  }
  for (let s = 0; s < segs; s++) idx.push(0, 1 + s, 1 + ((s + 1) % segs));
  for (let r = 1; r < rings; r++) {
    const a0 = 1 + (r - 1) * segs, a1 = 1 + r * segs;
    for (let s = 0; s < segs; s++) {
      const s1 = (s + 1) % segs;
      idx.push(a0 + s, a1 + s, a1 + s1, a0 + s, a1 + s1, a0 + s1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aShore', new THREE.Float32BufferAttribute(shore, 1));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 2 ? 1 : 0)), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((pos.length / 3) * 2), 2));
  g.setIndex(idx);
  return g;
}

export function buildPuddle(ctx, { center, radius = 0.5, quality = 'high' } = {}) {
  const group = new THREE.Group();
  group.name = 'CarB_puddle';
  const y = ctx.groundY(center.x, center.z) + 0.006;
  const c = new THREE.Vector3(center.x, y, center.z);
  const uniforms = {
    uTime: { value: 0 },
    uBreath: { value: Array.from({ length: MAX_BREATH }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uLand: { value: Array.from({ length: MAX_LAND }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uSrc: { value: new THREE.Vector4(0, 0, 0, 0) },
    uRain: { value: 1 },
    uReflK: { value: 1.0 },
  };
  const geo = blobGeometry(radius, 2.3);
  const reflective = quality === 'high';
  let mesh;
  let pending = false, nearCam = false;
  if (reflective) {
    const shader = {
      name: 'CarBPuddleReflector',
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, ...uniforms },
      vertexShader: /* glsl */`
        uniform mat4 textureMatrix;
        attribute float aShore;
        varying vec4 vUv; varying vec3 vWorld; varying float vShore;
        void main() {
          vUv = textureMatrix * vec4(position, 1.0);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorld = wp.xyz; vShore = aShore;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 color; uniform sampler2D tDiffuse; uniform float uReflK;
        varying vec4 vUv; varying vec3 vWorld; varying float vShore;
        ${RIPPLE_GLSL}
        void main() {
          vec2 g = rippleGrad(vWorld.xz);
          vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
          vec3 v = normalize(cameraPosition - vWorld);
          float cosT = clamp(dot(n, v), 0.0, 1.0);
          float fres = 0.03 + 0.97 * pow(1.0 - cosT, 4.0);
          vec4 uvp = vUv; uvp.xy += vec2(g.x, -g.y) * 0.35 * uvp.w;
          vec3 refl = texture2DProj(tDiffuse, uvp).rgb;
          vec3 body = vec3(0.004, 0.0045, 0.005);                 // dark asphalt under 1-2 cm of water
          vec3 col = body * (1.0 - fres) + refl * fres * uReflK * color;
          float a = 1.0 - smoothstep(0.72, 1.0, vShore);          // shoreline melts into the wet asphalt
          gl_FragColor = vec4(col, a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    };
    mesh = new Reflector(geo, { shader, color: 0xd8e0e4, textureWidth: 768, textureHeight: 432, clipBias: 0.002, multisample: 0 });
    mesh.material.transparent = true;
    mesh.material.depthWrite = false;
    // share the ripple uniforms with the reflector's clone of them
    for (const k of Object.keys(uniforms)) mesh.material.uniforms[k] = uniforms[k];
    const orig = mesh.onBeforeRender;
    mesh.onBeforeRender = function (renderer, scene, camera, ...rest) {
      // once per film update, never during override passes (GTAO normals / depth prepass)
      if (!pending || !nearCam || scene.overrideMaterial) return;
      pending = false;
      orig.call(this, renderer, scene, camera, ...rest);
    };
  } else {
    const mat = new THREE.MeshStandardMaterial({ name: 'CarBPuddleGloss', color: 0x0b0c0d, roughness: 0.03, metalness: 0.0, envMap: ctx.envMap, envMapIntensity: 1.4, transparent: true, depthWrite: false });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, uniforms);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aShore; varying float vShore; varying vec3 vPW;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvShore = aShore; vPW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>\nvarying float vShore; varying vec3 vPW;\n${RIPPLE_GLSL}`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          { vec2 g = rippleGrad(vPW.xz); vec3 nw = normalize(vec3(-g.x, 1.0, -g.y)); normal = normalize((viewMatrix * vec4(nw, 0.0)).xyz); }`)
        .replace('#include <opaque_fragment>', '#include <opaque_fragment>\ngl_FragColor.a *= 1.0 - smoothstep(0.72, 1.0, vShore);');
    };
    mat.customProgramCacheKey = () => 'carB_puddle_gloss';
    mesh = new THREE.Mesh(geo, mat);
  }
  mesh.name = 'carB_puddleWater';
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.copy(c);
  mesh.renderOrder = 3;
  mesh.receiveShadow = false; mesh.castShadow = false;
  group.add(mesh);

  // breath + landing state (pure functions of t: lists are static after setup)
  let breaths = [];          // { t, pos: Vector3 | fn, s }
  const v4 = new THREE.Vector4();
  const _p = new THREE.Vector3();
  const api = {
    center: c.clone(), radius, y,
    mesh,
    addBreath(times, pos, strength = 1) {
      for (const t of times || []) breaths.push({ t, pos, s: strength });
      breaths.sort((a, b) => a.t - b.t);
    },
    clearBreaths() { breaths = []; },
    setBreathSource(pos, strength = 1) {
      if (!pos || !(strength > 0)) { uniforms.uSrc.value.set(0, 0, 0, 0); return; }
      uniforms.uSrc.value.set(pos.x, pos.z, Math.min(1.5, strength), 0);
    },
    setCenter(x, z) { c.set(x, ctx.groundY(x, z) + 0.006, z); mesh.position.copy(c); api.center.copy(c); api.y = c.y; },
    setRain(k) { uniforms.uRain.value = k; },
    setReflectionStrength(k) { uniforms.uReflK.value = k; },
    get reflective() { return reflective; },
  };
  const camP = new THREE.Vector3();
  function update(t, camera, landings) {
    uniforms.uTime.value = t;
    uniforms.uSrc.value.set(0, 0, 0, 0); // the lead sets it again after props.update (choreo) when breathing
    // the most recent breaths (up to MAX_BREATH) that are still rippling
    let k = 0;
    for (let i = breaths.length - 1; i >= 0 && k < MAX_BREATH; i--) {
      const b = breaths[i];
      if (b.t > t || t - b.t > 3.2) continue;
      const p = typeof b.pos === 'function' ? b.pos(b.t) : b.pos;
      uniforms.uBreath.value[k++].set(p.x, p.z, b.t, b.s);
    }
    for (; k < MAX_BREATH; k++) uniforms.uBreath.value[k].set(0, 0, 0, 0);
    let l = 0;
    if (landings) for (let i = 0; i < 64 && l < MAX_LAND; i++) {
      const e = landings(t, i);
      if (!e) break;
      if (Math.hypot(e.x - c.x, e.z - c.z) < radius * 1.3) uniforms.uLand.value[l++].set(e.x, e.z, e.t, e.s ?? 1);
    }
    for (; l < MAX_LAND; l++) uniforms.uLand.value[l].set(0, 0, 0, 0);
    nearCam = camera ? camera.getWorldPosition(camP).distanceTo(c) < 9 : true;
    mesh.visible = nearCam;
    pending = true;
  }
  void v4; void _p;
  return { group, center: api.center, radius, y, api, update };
}
