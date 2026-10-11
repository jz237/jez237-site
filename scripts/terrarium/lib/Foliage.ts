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
  /** Spheres (x, y, z, radius) that push foliage aside: the hand, then the lizard's head, chest, mid-body, hips and tail. */
  uPush: {value: Array.from({length: 6}, () => new THREE.Vector4(0, -1, 0, 0))},
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
export function addFoliage(material: THREE.MeshStandardMaterial, opts: {height?: number; translucency?: number; flexAttr?: boolean; phaseAttr?: boolean; stiffness?: number; key: string}) {
  const height = opts.height ?? 0.3;
  const translucency = opts.translucency ?? 0.6;
  const stiff = opts.stiffness ?? 1;
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, foliageUniforms);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>
uniform float uTime; uniform vec4 uPush[6];
${opts.flexAttr ? 'attribute float aFlex;' : ''}
${opts.phaseAttr ? 'attribute float aPhase;' : ''}
varying float vFlex; varying float vGust; varying vec3 vFolW;
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
  float ph = ${opts.phaseAttr ? 'aPhase' : 'dot(root.xz, vec2(73.0, 51.0)) + position.x * 9.0'};
  vec3 vw = (toWorld * vec4(transformed, 1.0)).xyz;
  // the wind is read where each part of the plant actually is, so a gust
  // crossing a fern bends its near fronds before its far ones
  vec3 anchor = ${opts.flexAttr ? 'vw' : 'mix(root, vw, 0.8)'};
  vec3 bend = foliageWind(vec3(anchor.x, root.y, anchor.z), flex, ${(height * 1.0).toFixed(4)}, ph, ${stiff.toFixed(3)});
  vGust = length(bend.xz) / ${(height * 0.25).toFixed(4)};
  mat3 toLocal = inverse(mat3(toWorld));
  transformed += toLocal * bend;
  vw += bend;
  // bend away from the lizard (and the hand) as they push through
  vec3 push = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    vec4 p = uPush[i];
    vec3 d = vw - p.xyz;
    float dist = length(d.xz);
    if (p.w > 0.0 && dist < p.w && d.y < p.w * 1.6 && d.y > -p.w * 2.5) {
      vec2 away = dist > 1e-4 ? d.xz / dist : vec2(1.0, 0.0);
      float k = (p.w - dist) / p.w;
      push += vec3(away.x, -1.1 * k, away.y) * (p.w - dist) * 1.2;
    }
  }
  transformed += toLocal * push * max(flex, 0.25);
  vFolW = vw + push * max(flex, 0.25);
}`);
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uKeyDirView; uniform vec3 uKeyColor; uniform float uWet;
varying float vFlex; varying float vGust; varying vec3 vFolW;
// water beaded on the leaf after rain or misting: little domes in 2-3 mm cells
float folHash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
vec4 folBead(vec3 w, float wet){
  vec3 bp = w * 380.0;
  vec3 bi = floor(bp), bf = fract(bp) - 0.5;
  float h = folHash(bi);
  float r = 0.22 + 0.2 * fract(h * 7.31);
  vec3 off = bf - (vec3(fract(h * 3.1), fract(h * 5.7), fract(h * 9.3)) - 0.5) * 0.3;
  float on = step(1.0 - wet * 0.6, h);
  float d = length(off);
  return vec4(off / max(d, 1e-3), on * (1.0 - smoothstep(r * 0.7, r, d)));
}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.25, uWet * 0.6);
vec4 bead = uWet > 0.04 ? folBead(vFolW, clamp(uWet * 1.4, 0.0, 1.0)) : vec4(0.0);
roughnessFactor = mix(roughnessFactor, 0.03, bead.w);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
// each bead is a little lens: tilt the normal across its dome so it catches the lamp
normal = normalize(normal + (viewMatrix * vec4(bead.xyz, 0.0)).xyz * bead.w * 1.6);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  // Light passing through the blade when it is lit from behind.
  vec3 nG = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  float back = max(0.0, dot(-nG, uKeyDirView));
  float view = max(0.0, dot(normalize(vViewPosition), uKeyDirView));
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * (back * 0.6 + view * view * 0.4) * ${translucency.toFixed(3)} * 0.55;
  // leaves turned by a gust flash their paler undersides
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * clamp(vGust, 0.0, 1.0) * vFlex * 0.25;
  // a bright pin of light at the top of each bead
  totalEmissiveRadiance += uKeyColor * bead.w * pow(max(0.0, dot(normal, uKeyDirView)), 24.0) * 0.6;
}`);
  };
  material.customProgramCacheKey = () => `foliage5-${opts.key}`;
}
