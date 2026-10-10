import * as THREE from 'three';
import {WIND_GLSL} from './WindField';

/** Shared shader hooks for plants: wind from the flow field, gust waves, flutter and thin-leaf translucency. */
export const foliageUniforms = {
  uTime: {value: 0},
  uKeyDirView: {value: new THREE.Vector3(0, 1, 0)},
  uKeyColor: {value: new THREE.Color(1, 0.8, 0.6)},
  uWet: {value: 0},
  tWind: {value: null as THREE.Texture | null},
  uWindBox: {value: new THREE.Vector4(-0.6, -0.25, 1.2, 0.5)},
  uGust: {value: new THREE.Vector3()},
  /** Up to four spheres (x, y, z, radius) that push foliage aside: the lizard's head, chest, hips and the hand. */
  uPush: {value: [new THREE.Vector4(0, -1, 0, 0), new THREE.Vector4(0, -1, 0, 0), new THREE.Vector4(0, -1, 0, 0), new THREE.Vector4(0, -1, 0, 0)]},
};

/** Vertex GLSL: bend `transformed` (local) for a plant rooted at world `root` with flexibility `flex` and height `H`. */
export const FOLIAGE_WIND_GLSL = WIND_GLSL + /* glsl */ `
vec3 foliageWind(vec3 root, float flex, float H, float phase, float stiff){
  vec4 wt = windTex(root.xz);
  vec2 w = windAt(root.xz, uTime);
  float sp = length(w);
  vec2 dir = sp > 1e-4 ? w / sp : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  // travelling gust crests: bands of plants lean further as each one passes
  float wave = 0.5 + 0.5 * sin(dot(root.xz, dir) * 23.0 - uTime * (2.2 + min(sp * 4.0, 4.0) * 0.5) + wgn(root.xz * 8.0) * 5.0);
  wave = wave * wave * (3.0 - 2.0 * wave);
  float amt = (1.0 - exp(-sp * 2.2 / stiff)) * (0.68 + 0.64 * wave);
  float turb = wt.a;
  float flutter = sin(uTime * (6.5 + 4.0 * fract(phase * 7.13)) + phase * 11.0) * (0.035 + 0.16 * turb + 0.035 * min(sp * 4.0, 4.0)) / stiff;
  float idle = sin(uTime * 0.7 + phase) * 0.012 + sin(uTime * 1.9 + phase * 1.7) * 0.005;
  vec2 lean = dir * amt * 0.42 + perp * (flutter * (0.3 + amt) + idle) + vec2(idle * 0.6, 0.0);
  vec3 top = vec3(lean.x, 0.0, lean.y) * H;
  // keep the stem length: bending also lowers the tip
  top.y = -dot(top.xz, top.xz) / max(H, 1e-3) * 0.55;
  return top * flex;
}
`;

/**
 * Adds wind, push and translucency to a material. `flexAttr` reads flexibility
 * from an attribute; otherwise it comes from the local vertex height.
 */
export function addFoliage(material: THREE.MeshStandardMaterial, opts: {height?: number; translucency?: number; flexAttr?: boolean; stiffness?: number; key: string}) {
  const height = opts.height ?? 0.3;
  const translucency = opts.translucency ?? 0.6;
  const stiff = opts.stiffness ?? 1;
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, foliageUniforms);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>
uniform float uTime; uniform vec4 uPush[4];
${opts.flexAttr ? 'attribute float aFlex;' : ''}
varying float vFlex; varying float vGust;
${FOLIAGE_WIND_GLSL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
{
  float flex = ${opts.flexAttr ? 'aFlex' : `clamp(position.y / ${height.toFixed(4)}, 0.0, 1.0)`};
  flex *= flex;
  vFlex = flex;
  #ifdef USE_INSTANCING
    mat4 toWorld = modelMatrix * instanceMatrix;
  #else
    mat4 toWorld = modelMatrix;
  #endif
  vec3 root = (toWorld * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float ph = dot(root.xz, vec2(73.0, 51.0)) + position.x * 9.0;
  vec3 vw = (toWorld * vec4(transformed, 1.0)).xyz;
  // plants rooted in one spot sway about that spot; long creepers about each vertex
  vec3 anchor = ${opts.flexAttr ? 'vw' : 'root'};
  vec3 bend = foliageWind(vec3(anchor.x, root.y, anchor.z), flex, ${(height * 1.0).toFixed(4)}, ph, ${stiff.toFixed(3)});
  vGust = length(bend.xz) / ${(height * 0.25).toFixed(4)};
  mat3 toLocal = inverse(mat3(toWorld));
  transformed += toLocal * bend;
  vw += bend;
  // bend away from the lizard (and the hand) as they push through
  vec3 push = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec4 p = uPush[i];
    vec3 d = vw - p.xyz;
    float dist = length(d.xz);
    if (p.w > 0.0 && dist < p.w && abs(d.y) < p.w * 1.6) {
      vec2 away = dist > 1e-4 ? d.xz / dist : vec2(1.0, 0.0);
      float k = (p.w - dist) / p.w;
      push += vec3(away.x, -0.6 * k, away.y) * (p.w - dist) * 1.1;
    }
  }
  transformed += toLocal * push * max(flex, 0.25);
}`);
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uKeyDirView; uniform vec3 uKeyColor; uniform float uWet;
varying float vFlex; varying float vGust;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.25, uWet * 0.6);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  // Light passing through the blade when it is lit from behind.
  vec3 nG = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  float back = max(0.0, dot(-nG, uKeyDirView));
  float view = max(0.0, dot(normalize(vViewPosition), uKeyDirView));
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * (back * 0.6 + view * view * 0.4) * ${translucency.toFixed(3)} * 0.55;
  // leaves turned by a gust flash their paler undersides
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * clamp(vGust, 0.0, 1.0) * vFlex * 0.25;
}`);
  };
  material.customProgramCacheKey = () => `foliage2-${opts.key}`;
}
