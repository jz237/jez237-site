import * as THREE from 'three';

export interface Ledge {cx: number; top: number; cz: number; hw: number; hd: number; thick: number; tilt: number}
interface PeaksData {file: string; vertexCount: number; indexCount: number; offsets: Record<string, number>; ledges: Ledge[]}

const ROCK_GLSL = /* glsl */ `
float ph(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float pn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(ph(i), ph(i+vec3(1,0,0)), f.x), mix(ph(i+vec3(0,1,0)), ph(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(ph(i+vec3(0,0,1)), ph(i+vec3(1,0,1)), f.x), mix(ph(i+vec3(0,1,1)), ph(i+vec3(1,1,1)), f.x), f.y), f.z); }
float pf(vec3 p){ return 0.5*pn(p) + 0.25*pn(p*2.03+3.1) + 0.125*pn(p*4.1+7.7) + 0.0625*pn(p*8.3+1.3); }
float grainH(vec3 p){ return pf(p * 420.0) * 0.6 + pn(p * 1500.0) * 0.4; }
`;

/** Procedural basalt peaks baked at build time (see tools/bake-peaks.mjs). */
export class Peaks {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {uWet: {value: 0}, uTime: {value: 0}, uCascade: {value: new THREE.Vector4(0.045, -0.06, 0.04, 0)}};
  constructor(readonly data: PeaksData, buffer: ArrayBuffer) {
    const g = new THREE.BufferGeometry();
    const V = data.vertexCount;
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, data.offsets.position, V * 3), 3));
    g.setAttribute('normal', new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(new Int8Array(buffer, data.offsets.normal, V * 4), 4), 3, 0, true));
    g.setAttribute('aAO', new THREE.BufferAttribute(new Uint8Array(buffer, data.offsets.ao, V), 1, true));
    g.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, data.offsets.index, data.indexCount), 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.85});
    const u = this.uniforms;
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, u);
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aAO; varying float vAO; varying vec3 vWP; varying vec3 vWN;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvAO = aAO; vWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
uniform float uWet, uTime; uniform vec4 uCascade;
varying float vAO; varying vec3 vWP; varying vec3 vWN;
${ROCK_GLSL}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
vec3 P = vWP;
vec3 N = normalize(vWN);
float up = N.y;
float strata = sin((P.y + P.x * 0.25 + P.z * 0.15) * 120.0 + pf(P * 15.0) * 4.0) * 0.5 + 0.5;
float tone = pf(P * 30.0);
vec3 basalt = mix(vec3(0.022, 0.021, 0.02), vec3(0.065, 0.06, 0.055), tone);
basalt = mix(basalt, vec3(0.1, 0.09, 0.08), smoothstep(0.75, 0.95, pn(P * vec3(90.0, 12.0, 90.0))) * 0.5);
basalt *= 0.9 + 0.18 * strata * strata;
// pale lichen speckles on exposed faces
float lichen = smoothstep(0.78, 0.86, pf(P * 160.0)) * smoothstep(-0.2, 0.4, N.z + 0.3) * (1.0 - smoothstep(0.6, 0.9, up));
basalt = mix(basalt, vec3(0.32, 0.33, 0.27), lichen * 0.55);
// moss: on ledges and up-facing shoulders, creeping into crevices
float crev = 1.0 - vAO;
float mossN = pf(P * 45.0);
float mossBig = pf(P * 14.0);
float moss = smoothstep(0.62, 0.78, up * 0.75 + mossBig * 0.5 + crev * 0.2 + mossN * 0.15 - 0.12);
moss = max(moss, smoothstep(0.76, 0.86, mossBig + crev * 0.3) * 0.8);
vec3 mossC = mix(vec3(0.022, 0.045, 0.01), vec3(0.07, 0.115, 0.022), pf(P * 160.0));
mossC = mix(mossC, vec3(0.13, 0.15, 0.035), smoothstep(0.65, 0.9, pn(P * 600.0)) * 0.35);
// wet dark streak where the cascade runs
float cd = length((P.xz - uCascade.xy) / vec2(0.07, 0.16));
float wetC = smoothstep(1.0, 0.5, cd) * smoothstep(0.45, 0.13, P.y);
vec3 col = mix(basalt, mossC, moss);
col *= mix(1.0, 0.55, max(wetC, uWet * 0.5));
diffuseColor.rgb = col;
float rockMoss = moss; float rockWet = max(wetC, uWet);`)
        .replace('#include <roughnessmap_fragment>', `float roughnessFactor = mix(mix(0.82, 0.95, rockMoss), 0.3, rockWet * 0.85);`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  float e = 0.0005;
  float g0 = grainH(P);
  vec3 gN = vec3(grainH(P + vec3(e, 0, 0)) - g0, grainH(P + vec3(0, e, 0)) - g0, grainH(P + vec3(0, 0, e)) - g0) / e;
  float amp = mix(0.0005, 0.0012, rockMoss);
  vec3 wN = normalize(N - (gN - dot(gN, N) * N) * amp);
  normal = normalize((viewMatrix * vec4(wN, 0.0)).xyz);
}`)
        .replace('#include <aomap_fragment>', `
reflectedLight.indirectDiffuse *= vAO; reflectedLight.indirectSpecular *= vAO; reflectedLight.directDiffuse *= mix(1.0, vAO, 0.5);
#include <aomap_fragment>`);
    };
    m.customProgramCacheKey = () => 'peaks-basalt-v1';
    this.mesh = new THREE.Mesh(g, m);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = 'peaks';
  }

  static async load(base: string) {
    const data = (await (await fetch(`${base}peaks.json`)).json()) as PeaksData;
    const buf = await (await fetch(`${base}${data.file}`)).arrayBuffer();
    return new Peaks(data, buf);
  }
}
