import * as THREE from 'three';
import {voronoiChunk} from './ScaleShader';

export interface LizardLimbData {
  kind: 'front' | 'hind'; side: number;
  bones: {upper: number; lower: number; hand: number; digits: number[]};
  root: number[]; mid: number[]; wrist: number[]; palm: number[]; forward: number[];
  upperLength: number; lowerLength: number; plane: number[];
  digits: {base: number[]; dir: number[]; length: number; tip: number[]}[];
}
export interface LizardData {
  file: string; vertexCount: number; indexCount: number; offsets: Record<string, number>;
  bones: {name: string; origin: number[]; axes: number[][]}[];
  limbs: LizardLimbData[];
  eye: {radius: number; centre: number[]; axis: number[]};
  hingeX: number; mouth: number[][];
  spine: {name: string; x: number; y: number}[];
  profile: number[][];
}

/** Lizard length is 30.5 cm in the sculpt; scene units are metres. */
export const LIZARD_SCALE = 0.0105;

function irisTexture(): THREE.DataTexture {
  const W = 256, H = 256;
  const data = new Uint8Array(W * H * 4);
  const rnd = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
  const fibre = new Float32Array(W);
  for (let i = 0; i < W; i++) fibre[i] = 0.6 * rnd(i) + 0.4 * rnd(Math.floor(i / 3) + 999);
  for (let y = 0; y < H; y++) {
    const theta = ((H - 1 - y) / (H - 1)) * Math.PI; // 0 = centre of the pupil (+Y pole)
    for (let x = 0; x < W; x++) {
      const f = fibre[x] * 0.7 + fibre[(x + 1) % W] * 0.3;
      let r: number, g: number, b: number;
      if (theta < 0.2) {r = 4; g = 3; b = 3;}
      else if (theta < 0.3) {const t = (theta - 0.2) / 0.1; r = 175 + 40 * f - 60 * t; g = 118 + 30 * f - 50 * t; b = 48 - 20 * t;}
      else if (theta < 1.12) {
        const t = (theta - 0.3) / 0.82;
        r = 70 - 34 * t + 40 * f * (1 - t); g = 44 - 22 * t + 26 * f * (1 - t); b = 22 - 10 * t + 10 * f * (1 - t);
      } else {r = 18; g = 12; b = 9;}
      const i = (y * W + x) * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, W, H);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export interface SkinUniforms {
  uProfile: {value: THREE.DataTexture};
  uDisplay: {value: number};
  uWet: {value: number};
  uDust: {value: number};
  uScaleMeters: {value: number};
}

function skinMaterial(profileTex: THREE.DataTexture): {material: THREE.MeshPhysicalMaterial; uniforms: SkinUniforms} {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.6, metalness: 0,
    sheen: 0.15, sheenRoughness: 0.6, sheenColor: new THREE.Color(0.5, 0.4, 0.3),
    specularIntensity: 0.55,
  });
  const uniforms: SkinUniforms = {
    uProfile: {value: profileTex}, uDisplay: {value: 0}, uWet: {value: 0}, uDust: {value: 0.08},
    uScaleMeters: {value: LIZARD_SCALE},
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
attribute vec4 aux;
varying vec3 vRest; varying vec3 vRestN; varying vec4 vAux; varying mat3 vSkinN;`)
      .replace('#include <skinnormal_vertex>', `#include <skinnormal_vertex>
#ifdef USE_SKINNING
  vSkinN = normalMatrix * mat3(skinMatrix);
#else
  vSkinN = normalMatrix;
#endif`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vRest = position; vRestN = normal; vAux = aux;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform sampler2D uProfile; uniform float uDisplay; uniform float uWet; uniform float uDust; uniform float uScaleMeters;
varying vec3 vRest; varying vec3 vRestN; varying vec4 vAux; varying mat3 vSkinN;
${voronoiChunk}
float lzNoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float n000 = lzHash1(i), n100 = lzHash1(i+vec3(1,0,0)), n010 = lzHash1(i+vec3(0,1,0)), n110 = lzHash1(i+vec3(1,1,0));
  float n001 = lzHash1(i+vec3(0,0,1)), n101 = lzHash1(i+vec3(1,0,1)), n011 = lzHash1(i+vec3(0,1,1)), n111 = lzHash1(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y), mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float lzFbm(vec3 p){ return 0.55*lzNoise(p) + 0.3*lzNoise(p*2.03+7.1) + 0.15*lzNoise(p*4.1+3.3); }
vec4 lzProfile(float x){ float u = ((clamp(x, -17.2, 13.3) + 17.2) / 0.5 + 0.5) / 62.0; return texture2D(uProfile, vec2(u, 0.5)); }
`)
      .replace('#include <color_fragment>', `#include <color_fragment>
vec3 P = vRest;
vec4 pr = lzProfile(P.x);
float yn = (P.y - pr.w) / (P.y > pr.w ? pr.y : pr.z);
float zn = abs(P.z) / max(pr.x, 0.05);
float onLoft = 1.0 - smoothstep(1.05, 1.3, length(vec2(zn, yn)));
vec3 nR = normalize(vRestN);
float up = mix(smoothstep(-0.35, 0.65, nR.y), smoothstep(-0.25, 0.55, yn), onLoft);
float belly = mix(smoothstep(-0.2, -0.8, nR.y), smoothstep(-0.25, -0.75, yn) * smoothstep(-0.1, -0.6, nR.y), onLoft);
float spikeT = vAux.w;
float isSpike = step(0.005, spikeT);
float headW = smoothstep(9.2, 9.8, P.x);
float tailW = smoothstep(-0.3, -1.6, P.x);
// --- scales ---
float freq = mix(11.0, 8.5, belly) * mix(1.0, 0.88, tailW);
vec3 sp = P * freq;
sp.x *= mix(1.0, 0.72, max(belly, tailW * 0.6));
vec3 sGrad, sCell;
float sH = lzScale(sp, 0.9, 0.48, mix(0.75, 0.4, belly), sGrad, sCell);
sGrad *= freq;
float pix = length(fwidth(P)) * freq;
float detail = (1.0 - smoothstep(0.5, 1.6, pix)) * (1.0 - isSpike * smoothstep(0.02, 0.15, spikeT));
// Larger head plates.
float plate = headW * smoothstep(-0.1, 0.4, yn) * (1.0 - belly);
vec3 hGrad = vec3(0.0), hCell = vec3(0.5);
float hH = 0.0;
if (plate > 0.01) {
  float hf = 10.0;
  hH = lzScale(P * hf + vec3(13.7), 0.95, 0.42, 0.65, hGrad, hCell);
  hGrad *= hf;
  float hpix = length(fwidth(P)) * hf;
  float hdetail = 1.0 - smoothstep(0.5, 1.6, hpix);
  sH = mix(sH, hH, plate); sGrad = mix(sGrad, hGrad, plate) * mix(detail, hdetail, plate) / max(detail, 1e-3);
  sCell = mix(sCell, hCell, plate);
  detail = mix(detail, hdetail, plate);
}
// --- colour pattern (linear): Pogona vitticeps, sandy tan with dark reticulated blotches ---
vec3 cBase = vec3(0.4, 0.225, 0.088);
vec3 cLight = vec3(0.56, 0.37, 0.17);
vec3 cDark = vec3(0.075, 0.045, 0.022);
vec3 cMid = vec3(0.19, 0.1, 0.042);
vec3 cBelly = vec3(0.56, 0.45, 0.29);
vec3 cOrange = vec3(0.6, 0.21, 0.045);
float mott = lzFbm(P * 0.9 + vec3(2.0, 0.0, 5.0));
vec3 col = cBase * (0.86 + 0.28 * mott);
float torso = smoothstep(-0.2, 0.8, P.x) * (1.0 - smoothstep(8.4, 9.3, P.x));
float back = up * torso;
// dorsal blotches: dark cells in a reticulum, grouped into loose transverse bands
vec3 g0, g1;
vec3 bl = lzVoronoi(vec3(P.x * 1.4, P.y * 0.35, P.z * 1.4 + 0.5), 0.8, g0, g1);
float edgeN = (lzNoise(P * 3.1) - 0.5) * 0.3;
float bandMod = 0.6 + 0.4 * smoothstep(-0.3, 0.6, sin(P.x * 1.2 + 0.5 + mott * 1.2));
float blotch = (1.0 - smoothstep(0.3, 0.48, bl.x + edgeN)) * step(0.28, bl.z) * bandMod;
float midline = 1.0 - smoothstep(0.0, 0.18, abs(P.z) / max(pr.x, 0.1));
col = mix(col, cDark, blotch * back * 0.95 * (1.0 - midline * 0.5));
col = mix(col, cMid, (1.0 - smoothstep(0.42, 0.62, bl.x + edgeN)) * (1.0 - blotch) * back * 0.35);
// pale spots in the gaps
float pale = (1.0 - smoothstep(0.1, 0.22, bl.x)) * (1.0 - step(0.28, bl.z));
col = mix(col, cLight, pale * back * 0.7);
// a pale stripe along the spine and on the dorsolateral line
col = mix(col, cLight, midline * back * 0.25);
// flanks: darker vertical bars under the fringe
float flank = smoothstep(0.55, 0.85, zn) * onLoft * torso * smoothstep(-0.6, 0.3, yn) * (1.0 - belly);
col = mix(col, cMid, flank * smoothstep(0.2, 0.7, sin(P.x * 3.4 + mott * 2.0)) * 0.6);
// fine dark speckling everywhere above
float speck = smoothstep(0.72, 0.88, lzNoise(P * 8.5 + 3.0));
col = mix(col, cDark * 1.4, speck * up * 0.4);
// tail: bands that fade toward the tip, speckled
float tb = smoothstep(0.05, 0.6, sin(P.x * 2.7 + mott * 1.4));
col = mix(col, mix(col, cMid, 0.85), tb * tailW * up * 0.8);
col = mix(col, cLight, (1.0 - tb) * tailW * up * 0.15);
// head: orange flush on the jowls, the beard's base and around the eyes
float jowl = smoothstep(8.9, 9.5, P.x) * (1.0 - smoothstep(10.9, 11.6, P.x)) * smoothstep(0.5, 0.9, zn) * (1.0 - belly * 0.5);
col = mix(col, cOrange, jowl * 0.5);
vec3 eyeC = vec3(11.0, pr.w + 0.24, sign(P.z) * (pr.x - 0.2));
float eyeRing = exp(-pow(length(P.yz - eyeC.yz) / 0.5, 2.0)) * exp(-pow((P.x - eyeC.x) / 0.55, 2.0)) * headW;
col = mix(col, cOrange * 1.1, eyeRing * 0.55);
// dark stripe from the eye back to the ear
float streak = headW * exp(-pow((P.y - (pr.w + 0.2 + (P.x - 10.75) * 0.12)) / 0.12, 2.0)) * smoothstep(9.75, 10.3, P.x) * (1.0 - smoothstep(10.75, 11.1, P.x)) * smoothstep(0.6, 0.95, zn);
col = mix(col, cDark, streak * 0.6);
// head top: finer, warmer
col = mix(col, col * vec3(1.05, 0.95, 0.85), headW * up * 0.5);
// pale lips and labial scales
float lip = headW * smoothstep(0.82, 0.98, zn) * exp(-pow((yn + 0.12) / 0.16, 2.0));
col = mix(col, cBelly, lip * 0.6);
// cream belly, faint grey barring
col = mix(col, cBelly * (0.9 + 0.2 * mott) * (1.0 - 0.12 * smoothstep(0.4, 0.9, sin(P.x * 2.2))), belly);
// beard: orange-tan, turning sooty black when displayed
float beard = smoothstep(8.7, 9.3, P.x) * (1.0 - smoothstep(10.8, 11.3, P.x)) * smoothstep(-0.15, -0.6, yn);
vec3 cBeard = mix(mix(cOrange * 0.8, cBelly * 0.8, 0.45), vec3(0.02, 0.018, 0.016), uDisplay);
col = mix(col, cBeard, beard * (0.6 + 0.4 * uDisplay));
// limbs: tan with darker blotches and banding
float limb = 1.0 - onLoft;
col = mix(col, mix(col, cMid, 0.7), limb * smoothstep(0.25, 0.75, sin((P.y + P.x * 0.4) * 5.0 + mott * 3.0)) * up * 0.7);
// Per-scale tint and crevices.
float tint = 0.93 + 0.14 * sCell.z;
// salt-and-pepper: occasional dark and pale scales
float sp1 = fract(sCell.z * 17.31);
tint *= sp1 < 0.07 ? 0.62 : (sp1 > 0.93 ? 1.3 : 1.0);
col *= mix(1.0, tint, detail);
col *= mix(1.0, 0.84 + 0.16 * smoothstep(0.0, 0.6, sH), detail);
// far away: the average of scale tops and darker crevices, plus fine mottling
col = mix(col, col * (0.8 + 0.12 * lzNoise(P * 9.0)), (1.0 - detail) * 0.9);
// Spines: pale horn tips.
col = mix(col, vec3(0.62, 0.48, 0.3), isSpike * smoothstep(0.3, 1.0, spikeT) * 0.55);
// Claws and mouth.
vec3 claw = mix(vec3(0.035, 0.028, 0.022), vec3(0.2, 0.16, 0.12), smoothstep(0.4, 1.0, vAux.y) * 0.25);
col = mix(col, claw, smoothstep(0.25, 0.6, vAux.y));
float deep = smoothstep(0.4, 0.15, zn);
col = mix(col, mix(vec3(0.07, 0.035, 0.03), vec3(0.5, 0.19, 0.16), deep), vAux.z);
// Dust on the dry skin.
col = mix(col, vec3(0.45, 0.37, 0.27), uDust * up * (0.5 + 0.5 * lzNoise(P * 6.0)) * (1.0 - uWet));
diffuseColor.rgb = col;
`)
      .replace('#include <roughnessmap_fragment>', `
float roughnessFactor = mix(0.66, 0.5, smoothstep(0.3, 0.9, sH) * detail);
roughnessFactor = mix(roughnessFactor, 0.78, (1.0 - smoothstep(0.0, 0.25, sH)) * detail);
roughnessFactor = mix(roughnessFactor, 0.4, smoothstep(0.25, 0.6, vAux.y));
roughnessFactor = mix(roughnessFactor, 0.28, vAux.z);
roughnessFactor = mix(roughnessFactor, 0.48, isSpike);
roughnessFactor = mix(roughnessFactor, 0.22, uWet * 0.8);
`)
      .replace('#include <normal_fragment_maps>', `
{
  vec3 nRest = normalize(vRestN);
  vec3 g = sGrad * 0.011 * detail * (1.0 - vAux.y) * (1.0 - vAux.z);
  vec3 nP = normalize(nRest - (g - dot(g, nRest) * nRest));
  normal = normalize(vSkinN * nP);
}
`)
      .replace('#include <aomap_fragment>', `
{
  float ao = vAux.x;
  float micro = mix(1.0, 0.6 + 0.4 * smoothstep(0.0, 0.4, sH), detail);
  reflectedLight.indirectDiffuse *= ao * micro;
  reflectedLight.indirectSpecular *= ao * micro;
  reflectedLight.directDiffuse *= mix(1.0, ao, 0.45) * mix(1.0, micro, 0.5);
}
`);
  };
  material.customProgramCacheKey = () => 'lizard-skin-v2';
  return {material, uniforms};
}

function eyelidMaterial(): {material: THREE.MeshPhysicalMaterial; open: {value: number}} {
  const open = {value: 1};
  const material = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.5, 0.34, 0.2), roughness: 0.62, sheen: 0.3, sheenColor: new THREE.Color(0.5, 0.42, 0.32)});
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uOpen = open;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLid;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLid = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uOpen; varying vec3 vLid;
${voronoiChunk}`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
vec3 q = normalize(vLid);
float h = atan(q.x, q.y);
float v = atan(q.z, q.y);
float o = max(uOpen, 0.0);
float c = -0.16 * (1.0 - o);
float e = pow(h / 0.98, 2.0) + pow((v - c) / max(0.78 * o, 1e-3), 2.0);
if (o > 0.02 && e < 1.0) discard;
float margin = o > 0.02 ? 1.0 - smoothstep(1.0, 1.5, e) : 0.0;
`)
      .replace('#include <color_fragment>', `#include <color_fragment>
vec3 lg, lc; float lh = lzScale(vLid * 60.0, 0.8, 0.2, 0.4, lg, lc);
diffuseColor.rgb *= (0.8 + 0.3 * lc.z) * (0.7 + 0.3 * lh);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.05, 0.035, 0.025), margin * 0.85);
`);
  };
  material.customProgramCacheKey = () => 'lizard-lid-v1';
  return {material, open};
}

export interface EyeRig {
  group: THREE.Group; eyeball: THREE.Mesh; lid: THREE.Mesh; open: {value: number};
  rest: THREE.Matrix4; side: number; look: THREE.Euler;
}

export class LizardModel {
  readonly root = new THREE.Group();
  readonly mesh: THREE.SkinnedMesh;
  readonly bones: THREE.Bone[] = [];
  readonly bind: THREE.Matrix4[] = [];
  readonly boneIndex = new Map<string, number>();
  readonly skin: SkinUniforms;
  readonly eyes: EyeRig[] = [];
  readonly tongue: THREE.Mesh;
  tongueOut = 0;
  private tongueRest = new THREE.Matrix4();
  private tmp = new THREE.Matrix4();
  private tmp2 = new THREE.Matrix4();

  constructor(readonly data: LizardData, buffer: ArrayBuffer) {
    const {offsets, vertexCount: V, indexCount: I} = data;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, offsets.position, V * 3), 3));
    // three expects a 3-component normal; use an interleaved view over the padded Int8 data.
    const nrm = new THREE.InterleavedBuffer(new Int8Array(buffer, offsets.normal, V * 4), 4);
    g.setAttribute('normal', new THREE.InterleavedBufferAttribute(nrm, 3, 0, true));
    g.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint8Array(buffer, offsets.skinIndex, V * 4), 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(new Uint8Array(buffer, offsets.skinWeight, V * 4), 4, true));
    g.setAttribute('aux', new THREE.BufferAttribute(new Uint8Array(buffer, offsets.aux, V * 4), 4, true));
    g.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, offsets.index, I), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e3);

    const prof = new Float32Array(data.profile.length * 4);
    data.profile.forEach((p, i) => prof.set([p[1], p[2], p[3], p[4]], i * 4));
    const profileTex = new THREE.DataTexture(prof, data.profile.length, 1, THREE.RGBAFormat, THREE.FloatType);
    profileTex.magFilter = THREE.LinearFilter;
    profileTex.minFilter = THREE.LinearFilter;
    profileTex.needsUpdate = true;
    const {material, uniforms} = skinMaterial(profileTex);
    this.skin = uniforms;

    data.bones.forEach((b, i) => {
      const bone = new THREE.Bone();
      bone.name = b.name;
      bone.matrixAutoUpdate = false;
      const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...b.axes[0]), new THREE.Vector3(...b.axes[1]), new THREE.Vector3(...b.axes[2]));
      m.setPosition(b.origin[0], b.origin[1], b.origin[2]);
      this.bind.push(m);
      this.bones.push(bone);
      this.boneIndex.set(b.name, i);
      this.root.add(bone);
    });
    const skeleton = new THREE.Skeleton(this.bones, this.bind.map((m) => m.clone().invert()));
    this.mesh = new THREE.SkinnedMesh(g, material);
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.root.add(this.mesh);
    this.mesh.bind(skeleton, new THREE.Matrix4());
    this.mesh.bindMode = THREE.DetachedBindMode;

    // Eyes and lids follow the head bone.
    const iris = irisTexture();
    const eyeMat = new THREE.MeshPhysicalMaterial({map: iris, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.025, specularIntensity: 1, ior: 1.38});
    const r = data.eye.radius;
    for (const side of [1, -1]) {
      const c = new THREE.Vector3(data.eye.centre[0], data.eye.centre[1], data.eye.centre[2] * side);
      const axis = new THREE.Vector3(data.eye.axis[0], data.eye.axis[1], data.eye.axis[2] * side).normalize();
      const fwd = new THREE.Vector3(1, 0, 0).addScaledVector(axis, -axis.x).normalize();
      const upv = new THREE.Vector3().crossVectors(fwd, axis); // right eye: down; left eye: up
      if (upv.y < 0) upv.negate();
      const rest = new THREE.Matrix4().makeBasis(fwd, axis, upv).setPosition(c);
      const group = new THREE.Group();
      group.matrixAutoUpdate = false;
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 32), eyeMat);
      eyeball.castShadow = false;
      const lidM = eyelidMaterial();
      const lid = new THREE.Mesh(new THREE.SphereGeometry(r * 1.045, 40, 24, 0, Math.PI * 2, 0, 1.75), lidM.material);
      lid.castShadow = false;
      lid.receiveShadow = true;
      group.add(eyeball, lid);
      this.root.add(group);
      this.eyes.push({group, eyeball, lid, open: lidM.open, rest, side, look: new THREE.Euler()});
    }
    // A thick, fleshy agamid tongue resting on the floor of the mouth.
    const tg = new THREE.CapsuleGeometry(0.14, 0.62, 6, 16);
    tg.rotateZ(Math.PI / 2);
    tg.scale(1, 0.55, 1);
    const tongueMat = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.62, 0.24, 0.22), roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2, sheen: 0.4, sheenColor: new THREE.Color(0.9, 0.5, 0.5)});
    this.tongue = new THREE.Mesh(tg, tongueMat);
    this.tongue.matrixAutoUpdate = false;
    const mouthY = data.mouth.find((m) => m[0] <= 12.0)![1];
    this.tongueRest.makeTranslation(10.95, mouthY - 0.1, 0);
    this.root.add(this.tongue);
    this.setBindPose(new THREE.Matrix4());
  }

  static async load(base: string): Promise<LizardModel> {
    const data = (await (await fetch(`${base}lizard.json`)).json()) as LizardData;
    const buffer = await (await fetch(`${base}${data.file}`)).arrayBuffer();
    return new LizardModel(data, buffer);
  }

  bone(name: string) {return this.boneIndex.get(name)!;}

  /** Places every bone at its bind frame, transformed by `world` (metres) and the sculpt scale. */
  setBindPose(world: THREE.Matrix4) {
    const s = new THREE.Matrix4().makeScale(LIZARD_SCALE, LIZARD_SCALE, LIZARD_SCALE);
    this.bones.forEach((b, i) => b.matrix.copy(world).multiply(s).multiply(this.bind[i]));
    this.syncAttachments();
  }

  /** Call after bone matrices change: follows the eyes, lids and tongue. */
  syncAttachments() {
    const head = this.bone('head'), jaw = this.bone('jaw');
    // headWorld * inverse(headBind) maps sculpt-space positions on the head into the scene.
    const headM = this.tmp.copy(this.bones[head].matrix).multiply(this.tmp2.copy(this.bind[head]).invert());
    for (const e of this.eyes) {
      e.group.matrix.copy(headM).multiply(e.rest);
      const look = new THREE.Matrix4().makeRotationFromEuler(e.look);
      e.eyeball.matrixAutoUpdate = false;
      e.eyeball.matrix.copy(look);
    }
    const jawM = new THREE.Matrix4().copy(this.bones[jaw].matrix).multiply(new THREE.Matrix4().copy(this.bind[jaw]).invert());
    const ext = this.tongueOut;
    const t = new THREE.Matrix4().makeTranslation(ext * 0.95, ext * -0.05, 0).multiply(this.tongueRest).multiply(new THREE.Matrix4().makeScale(1 + ext * 0.3, 1, 1 - ext * 0.15));
    this.tongue.matrix.copy(jawM).multiply(t);
    this.tongue.visible = true;
  }
}
