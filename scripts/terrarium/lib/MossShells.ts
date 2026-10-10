import * as THREE from 'three';
import {TANK} from './Case';
import type {MossMap} from './Plants';
import type {Surface} from './Surface';
import {WATER_LEVEL, groundHeight} from './Ground';
import {foliageUniforms} from './Foliage';

/**
 * Cushion moss rendered as stacked shells: each layer keeps only the strands
 * tall enough to reach it, so the carpet has real depth, soft tips and
 * self-shadowed gaps.
 */
export class MossShells {
  readonly mesh: THREE.InstancedMesh;
  readonly uniforms = {uShells: {value: 14}, uHeight: {value: 0.0065}, tMoss: {value: null as THREE.Texture | null}, uPress: {value: new THREE.Vector4(0, 0, 0, 0)}};

  constructor(surface: Surface, moss: MossMap, shells = 14) {
    this.uniforms.uShells.value = shells;
    this.uniforms.tMoss.value = moss.texture;
    const NX = 260, NZ = 108;
    const x0 = -TANK.w / 2 + 0.003, z0 = -TANK.d / 2 + 0.003;
    const W = TANK.w - 0.006, D = TANK.d - 0.006;
    const pos: number[] = [], nrm: number[] = [], idx: number[] = [];
    const keep = new Uint8Array((NX + 1) * (NZ + 1));
    const n = new THREE.Vector3();
    for (let j = 0; j <= NZ; j++) for (let i = 0; i <= NX; i++) {
      const x = x0 + (i / NX) * W, z = z0 + (j / NZ) * D;
      // Shells follow the ground itself; rocks and the log simply cover them.
      const y = groundHeight(x, z);
      const e = 0.002;
      n.set(groundHeight(x - e, z) - groundHeight(x + e, z), 2 * e, groundHeight(x, z - e) - groundHeight(x, z + e)).normalize();
      pos.push(x, y, z);
      nrm.push(n.x, n.y, n.z);
      keep[j * (NX + 1) + i] = moss.at(x, z) > 0.04 && y > WATER_LEVEL + 0.004 && n.y > 0.6 && surface.heightAt(x, z) < y + 0.03 ? 1 : 0;
    }
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1;
      if (keep[a] | keep[b] | keep[c] | keep[d]) idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
    g.setIndex(idx);
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.9});
    const u = this.uniforms;
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, u, {uTime: foliageUniforms.uTime, uWind: foliageUniforms.uWind, uWet: foliageUniforms.uWet, uTank: {value: new THREE.Vector2(TANK.w, TANK.d)}});
      s.vertexShader = s.vertexShader
        .replace('#include <common>', `#include <common>
uniform float uShells, uHeight, uTime; uniform vec3 uWind; uniform sampler2D tMoss; uniform vec2 uTank; uniform vec4 uPress;
varying float vShell; varying vec3 vMW; varying float vMossH; varying float vMoss;`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>
{
  float sh = float(gl_InstanceID) / (uShells - 1.0);
  vShell = sh;
  float mm = texture2D(tMoss, position.xz / uTank + 0.5).r;
  vMoss = mm;
  // cushions: the carpet swells into low mounds
  float cush = 0.55 + 0.45 * sin(position.x * 61.0 + sin(position.z * 47.0) * 2.0) * sin(position.z * 53.0 + position.x * 9.0);
  float h = uHeight * smoothstep(0.03, 0.5, mm) * (0.6 + 0.6 * cush);
  // pressed flat where the lizard lies or walks
  float press = 1.0 - uPress.w * exp(-dot(position.xz - uPress.xy, position.xz - uPress.xy) / (uPress.z * uPress.z));
  h *= press;
  vMossH = h;
  vec3 sway = vec3(sin(uTime * 1.3 + position.x * 40.0), 0.0, cos(uTime * 1.1 + position.z * 37.0)) * 0.0004 + uWind * 0.004;
  transformed += objectNormal * (sh * h + 0.0004) + sway * sh * sh;
  vMW = transformed;
}`)
        .replace('#include <project_vertex>', `vec4 mvPosition = vec4(transformed, 1.0);
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`);
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uWet;
uniform sampler2D tMoss; uniform vec2 uTank;
varying float vShell; varying vec3 vMW; varying float vMossH; varying float vMoss;
float mh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 mh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float mn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(mh(i), mh(i+vec2(1,0)), f.x), mix(mh(i+vec2(0,1)), mh(i+vec2(1,1)), f.x), f.y); }`)
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
float mossF = texture2D(tMoss, vMW.xz / uTank + 0.5).r;
if (mossF < 0.07 + 0.12 * mh(floor(vMW.xz * 1900.0)) + vShell * 0.25 || (vMossH < 0.0006 && vShell > 0.05)) discard;
vec2 sp = vMW.xz * 1900.0;
vec2 ci = floor(sp), cf = fract(sp);
vec2 jit = mh2(ci);
float strandH = 0.3 + 0.7 * mh(ci + 3.7) * mh(ci + 1.3);
// strand thins toward its tip
float r = length(cf - (0.25 + 0.5 * jit)) / 0.5;
float keep = strandH - vShell;
if (vShell > 0.02 && (keep < 0.0 || r > 0.95 * (1.0 - vShell / strandH * 0.8))) discard;
float tipLight = smoothstep(0.0, 1.0, vShell);`)
        .replace('#include <color_fragment>', `#include <color_fragment>
{
  float hue = mn(vMW.xz * 60.0);
  vec3 deep = vec3(0.012, 0.02, 0.006);
  vec3 midC = mix(vec3(0.05, 0.1, 0.018), vec3(0.09, 0.14, 0.02), hue);
  vec3 tip = mix(vec3(0.13, 0.22, 0.035), vec3(0.26, 0.28, 0.06), mn(vMW.xz * 220.0) * 0.7 + mn(vMW.xz * 31.0) * 0.3);
  vec3 c = mix(deep, midC, smoothstep(0.0, 0.5, vShell));
  c = mix(c, tip, smoothstep(0.45, 1.0, vShell) * (0.6 + 0.4 * mh(ci)));
  c *= 0.8 + 0.4 * mh(ci + 9.1);
  diffuseColor.rgb = c * mix(1.0, 0.7, uWet);
}`)
        .replace('#include <roughnessmap_fragment>', `float roughnessFactor = mix(0.95, 0.55, uWet);`)
        .replace('#include <aomap_fragment>', `
{
  float ao = mix(0.25, 1.0, smoothstep(0.0, 0.9, vShell));
  reflectedLight.indirectDiffuse *= ao; reflectedLight.indirectSpecular *= ao; reflectedLight.directDiffuse *= mix(0.45, 1.0, smoothstep(0.0, 0.8, vShell));
}
#include <aomap_fragment>`);
    };
    m.customProgramCacheKey = () => 'moss-shells-v1';
    this.mesh = new THREE.InstancedMesh(g, m, shells);
    const I = new THREE.Matrix4();
    for (let i = 0; i < shells; i++) this.mesh.setMatrixAt(i, I);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'moss-shells';
    // Layer 5: drawn by the main camera, skipped by the pool's mirror render.
    this.mesh.layers.set(5);
  }

  /** Flattens the carpet under a resting body (x, z, radius, amount). */
  press(x: number, z: number, r: number, amount: number) {this.uniforms.uPress.value.set(x, z, r, amount);}
}
