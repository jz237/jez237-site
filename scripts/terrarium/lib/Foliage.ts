import * as THREE from 'three';

/** Shared shader hooks for plants: gentle sway, wind gusts and thin-leaf translucency. */
export const foliageUniforms = {
  uTime: {value: 0},
  uWind: {value: new THREE.Vector3()},
  uKeyDirView: {value: new THREE.Vector3(0, 1, 0)},
  uKeyColor: {value: new THREE.Color(1, 0.8, 0.6)},
  uWet: {value: 0},
  /** Up to three spheres (x, y, z, radius) that push foliage aside: the lizard's head, chest and hips. */
  uPush: {value: [new THREE.Vector4(0, -1, 0, 0), new THREE.Vector4(0, -1, 0, 0), new THREE.Vector4(0, -1, 0, 0)]},
};

/**
 * Adds sway to a material. `heightAttr` chooses where flexibility comes from:
 * 'y' uses the local vertex height (instanced clumps); 'flex' uses an attribute.
 */
export function addFoliage(material: THREE.MeshStandardMaterial, opts: {height?: number; translucency?: number; flexAttr?: boolean; key: string}) {
  const height = opts.height ?? 0.3;
  const translucency = opts.translucency ?? 0.6;
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, foliageUniforms);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>
uniform float uTime; uniform vec3 uWind; uniform vec4 uPush[3];
${opts.flexAttr ? 'attribute float aFlex;' : ''}
varying float vFlex;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
{
  float flex = ${opts.flexAttr ? 'aFlex' : `clamp(position.y / ${height.toFixed(4)}, 0.0, 1.0)`};
  flex *= flex;
  vFlex = flex;
  vec3 wpos = vec3(0.0);
  #ifdef USE_INSTANCING
    wpos = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  #else
    wpos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  #endif
  float ph = dot(wpos.xz, vec2(7.3, 5.1)) + position.x * 9.0;
  float idle = sin(uTime * 0.7 + ph) * 0.004 + sin(uTime * 1.9 + ph * 1.7) * 0.0015;
  float gust = 0.5 + 0.5 * sin(uTime * 2.3 + ph * 0.5);
  vec3 sway = vec3(idle, 0.0, idle * 0.6) + uWind * (0.6 + 0.6 * gust) * 0.02;
  // Express the world-space sway in the object's local frame.
  #ifdef USE_INSTANCING
    mat3 toLocal = inverse(mat3(modelMatrix) * mat3(instanceMatrix));
  #else
    mat3 toLocal = inverse(mat3(modelMatrix));
  #endif
  transformed += toLocal * sway * flex;
  // bend away from the lizard as it pushes through
  #ifdef USE_INSTANCING
    vec3 vw = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
  #else
    vec3 vw = (modelMatrix * vec4(transformed, 1.0)).xyz;
  #endif
  vec3 push = vec3(0.0);
  for (int i = 0; i < 3; i++) {
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
varying float vFlex;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.25, uWet * 0.6);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  // Light passing through the blade when it is lit from behind.
  vec3 nG = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  float back = max(0.0, dot(-nG, uKeyDirView));
  float view = max(0.0, dot(normalize(vViewPosition), uKeyDirView));
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * (back * 0.6 + view * view * 0.4) * ${translucency.toFixed(3)} * 0.55;
}`);
  };
  material.customProgramCacheKey = () => `foliage-${opts.key}`;
}
