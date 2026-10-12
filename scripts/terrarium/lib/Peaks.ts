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
// craggy relief: vertical fissures and flutes with blocky fractures across them
float cragH(vec3 p){
  float flute = 1.0 - abs(2.0 * pn(p * vec3(34.0, 7.0, 34.0) + pn(p * 12.0) * 1.5) - 1.0);
  float block = pn(p * vec3(18.0, 26.0, 18.0) + 4.0);
  return flute * 0.65 + block * 0.35 + pn(p * 90.0) * 0.15;
}
`;

const FALL_SPOTS = 24;

/** Procedural basalt peaks baked at build time (see tools/bake-peaks.mjs). */
export class Peaks {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    uWet: {value: 0}, uTime: {value: 0},
    uFall: {value: Array.from({length: FALL_SPOTS}, () => new THREE.Vector4())},
    /** min x, min z, max x, max z of everything the falls wet (the rest of the rock skips them) */
    uFallBox: {value: new THREE.Vector4(1, 1, -1, -1)},
  };
  /** Where the falls wet the rock: points along their path with a reach (m). */
  setFallSpots(spots: THREE.Vector4[]) {
    this.uniforms.uFall.value.forEach((v, i) => (spots[i] ? v.copy(spots[i]) : v.set(0, 0, 0, 0)));
    const box = this.uniforms.uFallBox.value.set(1, 1, -1, -1);
    for (const f of spots.slice(0, FALL_SPOTS)) box.set(Math.min(box.x, f.x - f.w), Math.min(box.y, f.z - f.w), Math.max(box.z, f.x + f.w), Math.max(box.w, f.z + f.w));
  }

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
uniform float uWet, uTime; uniform vec4 uFall[${FALL_SPOTS}]; uniform vec4 uFallBox;
varying float vAO; varying vec3 vWP; varying vec3 vWN;
${ROCK_GLSL}
// soaked by the falls and their spray: within reach of the water's path
float fallWet(vec3 P){
  float w = 0.0;
  if (any(lessThan(P.xz, uFallBox.xy)) || any(greaterThan(P.xz, uFallBox.zw))) return w;
  for (int i = 0; i < ${FALL_SPOTS}; i++) {
    vec4 f = uFall[i];
    if (f.w > 0.0) w = max(w, 1.0 - smoothstep(0.5, 1.0, length(P - f.xyz) / f.w));
  }
  return w;
}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
vec3 P = vWP;
vec3 N = normalize(vWN);
float up = N.y;
float strata = sin((P.y + P.x * 0.25 + P.z * 0.15) * 120.0 + pf(P * 15.0) * 4.0) * 0.5 + 0.5;
float tone = pf(P * 30.0);
float crag = cragH(P);
vec3 basalt = mix(vec3(0.03, 0.028, 0.026), vec3(0.095, 0.086, 0.076), tone);
basalt = mix(basalt, vec3(0.1, 0.09, 0.08), smoothstep(0.75, 0.95, pn(P * vec3(90.0, 12.0, 90.0))) * 0.5);
basalt *= 0.9 + 0.18 * strata * strata;
// fissures run dark, the ribs between them catch the light
basalt *= mix(0.35, 1.2, smoothstep(0.2, 0.9, crag));
// lava rock is full of gas holes: small dark pits, some in clusters
float vesG = pn(P * 70.0);
float ves = smoothstep(0.7, 0.85, pn(P * 520.0 + vesG * 3.0)) * (0.55 + 0.45 * smoothstep(0.35, 0.7, vesG));
basalt *= 1.0 - 0.8 * ves;
// the lumps' crowns catch the lamp and the creases between them stay black
basalt *= mix(0.45, 1.15, vAO);
// wet dark rock where the falls run and splash
float wetC = fallWet(P);
// pale lichen speckles on exposed faces (none in the splash zone)
float lichen = smoothstep(0.78, 0.86, pf(P * 160.0)) * smoothstep(-0.2, 0.4, N.z + 0.3) * (1.0 - smoothstep(0.6, 0.9, up)) * (1.0 - wetC);
basalt = mix(basalt, vec3(0.32, 0.33, 0.27), lichen * 0.55);
// moss: on ledges and up-facing shoulders, creeping into crevices
float crev = 1.0 - vAO;
float mossN = pf(P * 45.0);
float mossBig = pf(P * 14.0);
// (mostly on the tops: the faces stay bare, dark lava rock)
float moss = smoothstep(0.62, 0.76, up * 0.9 + mossBig * 0.45 + crev * 0.12 + mossN * 0.15 + (1.0 - crag) * 0.08 - 0.12);
moss = max(moss, smoothstep(0.8, 0.9, mossBig + crev * 0.25 + (1.0 - crag) * 0.1) * 0.7);
// cushion moss: lime on the sunny tops, deeper green in the shade
vec3 mossC = mix(vec3(0.04, 0.085, 0.012), vec3(0.15, 0.24, 0.03), pf(P * 160.0));
mossC = mix(mossC, vec3(0.26, 0.3, 0.05), smoothstep(0.65, 0.9, pn(P * 600.0)) * 0.4);
mossC *= mix(0.7, 1.15, smoothstep(0.2, 0.9, up));
// nothing grows where the water itself runs: bare, slick rock in the channel
moss *= 1.0 - smoothstep(0.55, 0.95, wetC);
vec3 col = mix(basalt, mossC, moss);
col *= mix(1.0, 0.55, max(wetC, uWet * 0.5));
diffuseColor.rgb = col;
float rockMoss = moss; float rockWet = max(wetC, uWet);`)
        .replace('#include <roughnessmap_fragment>', `float roughnessFactor = mix(mix(0.82, 0.95, rockMoss), 0.42, rockWet * 0.85);`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  float e = 0.0005;
  float g0 = grainH(P);
  vec3 gN = vec3(grainH(P + vec3(e, 0, 0)) - g0, grainH(P + vec3(0, e, 0)) - g0, grainH(P + vec3(0, 0, e)) - g0) / e;
  // (a film of water fills the fine grain: wet rock shines smooth, not glittering)
  float amp = mix(0.0005, 0.0012, rockMoss) * (1.0 - 0.75 * rockWet);
  float c0 = cragH(P);
  float ec = 0.0015;
  vec3 cN = vec3(cragH(P + vec3(ec, 0, 0)) - c0, cragH(P + vec3(0, ec, 0)) - c0, cragH(P + vec3(0, 0, ec)) - c0) / ec;
  vec3 tilt = (gN - dot(gN, N) * N) * amp + (cN - dot(cN, N) * N) * 0.009 * (1.0 - rockMoss * 0.6);
  vec3 wN = normalize(N - tilt);
  normal = normalize((viewMatrix * vec4(wN, 0.0)).xyz);
}`)
        .replace('#include <aomap_fragment>', `
reflectedLight.indirectDiffuse *= vAO; reflectedLight.indirectSpecular *= vAO; reflectedLight.directDiffuse *= mix(1.0, vAO, 0.5);
#include <aomap_fragment>`);
    };
    m.customProgramCacheKey = () => 'peaks-basalt-v4';
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
