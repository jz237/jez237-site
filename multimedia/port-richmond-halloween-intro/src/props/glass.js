// Window glass for the props: MeshStandardMaterial patched to output premultiplied colour so specular
// reflections stay at full strength while the pane stays mostly see-through (no transmission pass).
// Optional: grime (procedural), and an impact-vibration vertex displacement driven by uniforms.
import * as THREE from 'three';

let nightEnv = null;
// A tiny procedural "night street" environment (dark sky, sodium/LED blobs, lit windows) for glass reflections
// when the scene has no environment of its own.
export function getNightEnv(renderer) {
  if (nightEnv) return nightEnv;
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, '#03050a'); sky.addColorStop(0.45, '#0b1018'); sky.addColorStop(0.52, '#171513'); sky.addColorStop(1, '#050505');
  g.fillStyle = sky; g.fillRect(0, 0, 512, 256);
  // building silhouettes band with a few lit windows
  g.fillStyle = '#0a0a0b'; g.fillRect(0, 100, 512, 40);
  const blob = (x, y, r, col, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = a; g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.globalAlpha = 1; };
  blob(90, 70, 26, '#e8f0ff', 0.9); blob(340, 64, 22, '#dfe9ff', 0.8); blob(220, 118, 10, '#ffb060', 0.8); blob(430, 120, 8, '#ff9a40', 0.7); blob(30, 124, 7, '#ffc070', 0.6);
  for (let i = 0; i < 18; i++) { g.fillStyle = i % 3 ? 'rgba(255,190,110,0.5)' : 'rgba(170,200,255,0.35)'; g.fillRect(15 + i * 28, 106 + (i % 2) * 12, 6, 8); }
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer);
  nightEnv = pm.fromEquirectangular(t).texture;
  pm.dispose();
  t.dispose();
  return nightEnv;
}

const GRIME_GLSL = /* glsl */`
float gHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float gNoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(gHash(i), gHash(i+vec2(1,0)), u.x), mix(gHash(i+vec2(0,1)), gHash(i+vec2(1,1)), u.x), u.y); }
float gFbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ s += a*gNoise(p); p *= 2.03; a *= 0.5; } return s; }
`;

// opts: { tint, opacity, roughness, grime (0..1), envMap, impact: true to add vibration uniforms, name, metres: [w,h] }
export function makeGlass(opts = {}) {
  const mat = new THREE.MeshStandardMaterial({
    name: opts.name || 'PropGlass', color: opts.tint ?? 0xd8e2e6, roughness: opts.roughness ?? 0.05, metalness: 0,
    transparent: true, opacity: opts.opacity ?? 0.14, depthWrite: false, side: opts.side ?? THREE.DoubleSide,
    envMap: opts.envMap || null, envMapIntensity: opts.envMapIntensity ?? 2.4,
  });
  mat.blending = THREE.CustomBlending;
  mat.blendSrc = THREE.OneFactor;
  mat.blendDst = THREE.OneMinusSrcAlphaFactor;
  mat.blendSrcAlpha = THREE.OneFactor;
  mat.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
  const uniforms = {
    uGrime: { value: opts.grime ?? 0.35 },
    uMetres: { value: new THREE.Vector2(...(opts.metres || [1, 1])) },
    uVib: { value: 0 },      // centre displacement (m) of the (1,1) membrane mode
    uVib2: { value: 0 },     // (2,1) mode
    uShift: { value: 0 },    // whole-pane rattle along the normal (m)
  };
  mat.userData.uniforms = uniforms;
  const impact = !!opts.impact;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        varying vec2 vGUv;
        uniform float uVib; uniform float uVib2; uniform float uShift; uniform vec2 uMetres;`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        ${impact ? `{
          vec2 q = uv;
          float PI_ = 3.14159265;
          float dzdu = uVib * PI_ * cos(PI_*q.x) * sin(PI_*q.y) + uVib2 * 2.0*PI_ * cos(2.0*PI_*q.x) * sin(PI_*q.y);
          float dzdv = uVib * PI_ * sin(PI_*q.x) * cos(PI_*q.y) + uVib2 * PI_ * sin(2.0*PI_*q.x) * cos(PI_*q.y);
          objectNormal = normalize(objectNormal - vec3(dzdu / uMetres.x, dzdv / uMetres.y, 0.0) * 6.0);
        }` : ''}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vGUv = uv;
        ${impact ? `{
          float PI_ = 3.14159265;
          transformed.z += uShift + uVib * sin(PI_*uv.x) * sin(PI_*uv.y) + uVib2 * sin(2.0*PI_*uv.x) * sin(PI_*uv.y);
        }` : ''}`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec2 vGUv; uniform float uGrime; uniform vec2 uMetres;
        ${GRIME_GLSL}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        vec2 gp = vGUv * uMetres;
        float grime = gFbm(gp * 9.0) * 0.6 + gFbm(gp * 40.0) * 0.4;
        float edge = smoothstep(0.0, 0.06, min(min(vGUv.x, 1.0 - vGUv.x), min(vGUv.y, 1.0 - vGUv.y)));
        float streak = gFbm(vec2(gp.x * 60.0, gp.y * 2.0)) * smoothstep(0.55, 0.0, vGUv.y);
        float dirt = uGrime * clamp(grime * 0.8 + (1.0 - edge) * 0.6 + streak * 0.5, 0.0, 1.0);
        roughnessFactor = clamp(roughnessFactor + dirt * 0.45, 0.0, 1.0);`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        { vec2 gp2 = vGUv * uMetres; float d2 = uGrime * (gFbm(gp2 * 9.0) * 0.5 + 0.5 * smoothstep(0.06, 0.0, min(min(vGUv.x, 1.0 - vGUv.x), min(vGUv.y, 1.0 - vGUv.y))));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.32, 0.29, 0.25), clamp(d2, 0.0, 0.8));
          diffuseColor.a = clamp(diffuseColor.a + d2 * 0.22, 0.0, 1.0); }`)
      .replace('#include <opaque_fragment>', `
        vec3 gSpec = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
        vec3 gDiff = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
        float gA = diffuseColor.a;
        gl_FragColor = vec4(gDiff * gA + gSpec, gA);`);
  };
  mat.customProgramCacheKey = () => (impact ? 'propglass_impact' : 'propglass');
  return mat;
}
