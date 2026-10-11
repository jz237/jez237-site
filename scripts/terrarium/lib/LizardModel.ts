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
      // Pogona's eye: a round black pupil in a golden-amber iris, a bright
      // ring around the pupil, radial fibres and flecks, a dark limbus
      let r: number, g: number, b: number;
      const fleck = rnd(x * 7 + Math.floor(theta * 40) * 131) > 0.93 ? 0.55 : 1;
      if (theta < 0.25) {r = 3; g = 2; b = 2;}
      else if (theta < 0.31) {const t = (theta - 0.25) / 0.06; r = 236 - 20 * t; g = 196 - 30 * t; b = 110 - 40 * t;}
      else if (theta < 1.0) {
        const t = (theta - 0.31) / 0.69;
        r = (214 - 70 * t + 30 * (f - 0.5)) * fleck; g = (150 - 72 * t + 24 * (f - 0.5)) * fleck; b = (52 - 28 * t + 10 * (f - 0.5)) * fleck;
      } else if (theta < 1.14) {const t = (theta - 1.0) / 0.14; r = 120 - 90 * t; g = 70 - 55 * t; b = 28 - 20 * t;}
      else {r = 14; g = 10; b = 8;}
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
  uScaleDir: {value: THREE.Vector3[]};
  uEye: {value: THREE.Vector3};
}

function skinMaterial(profileTex: THREE.DataTexture, scaleDirs: THREE.Vector3[], eye: THREE.Vector3): {material: THREE.MeshPhysicalMaterial; uniforms: SkinUniforms} {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.6, metalness: 0,
    sheen: 0.15, sheenRoughness: 0.6, sheenColor: new THREE.Color(0.5, 0.4, 0.3),
    specularIntensity: 0.55,
  });
  const uniforms: SkinUniforms = {
    uProfile: {value: profileTex}, uDisplay: {value: 0}, uWet: {value: 0}, uDust: {value: 0.08},
    uScaleMeters: {value: LIZARD_SCALE},
    uScaleDir: {value: scaleDirs},
    uEye: {value: eye},
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
attribute vec4 aux;
uniform vec3 uScaleDir[${scaleDirs.length}];
varying vec3 vRest; varying vec3 vRestN; varying vec4 vAux; varying mat3 vSkinN; varying vec3 vScaleDir;`)
      .replace('#include <skinnormal_vertex>', `#include <skinnormal_vertex>
#ifdef USE_SKINNING
  vSkinN = normalMatrix * mat3(skinMatrix);
#else
  vSkinN = normalMatrix;
#endif`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vRest = position; vRestN = normal; vAux = aux;
#ifdef USE_SKINNING
// the way the scales point (towards the free edges): down the limbs, back along the body
vScaleDir = uScaleDir[int(skinIndex.x)] * skinWeight.x + uScaleDir[int(skinIndex.y)] * skinWeight.y + uScaleDir[int(skinIndex.z)] * skinWeight.z + uScaleDir[int(skinIndex.w)] * skinWeight.w;
#else
vScaleDir = vec3(-1.0, 0.0, 0.0);
#endif`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform sampler2D uProfile; uniform vec3 uEye; uniform float uDisplay; uniform float uWet; uniform float uDust; uniform float uScaleMeters;
varying vec3 vRest; varying vec3 vRestN; varying vec4 vAux; varying mat3 vSkinN; varying vec3 vScaleDir;
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
// (a 4-norm: the loft's cross-sections are superellipses, boxy at the crown)
float onLoft = 1.0 - smoothstep(1.05, 1.3, pow(pow(zn, 4.0) + pow(abs(yn), 4.0), 0.25));
vec3 nR = normalize(vRestN);
float up = mix(smoothstep(-0.35, 0.65, nR.y), smoothstep(-0.25, 0.55, yn), onLoft);
float belly = mix(smoothstep(-0.2, -0.8, nR.y), smoothstep(-0.25, -0.75, yn) * smoothstep(-0.1, -0.6, nR.y), onLoft);
float headW = smoothstep(9.2, 9.8, P.x);
float tailW = smoothstep(-0.3, -1.6, P.x);
// --- scales: one field whose size, shape and overlap follow the body ---
// Limbs and tail carry large keeled scales overlapping toward the toes and the
// tail tip; the belly small smooth overlapping ones; the head fine granular
// beads; the lips a row of rectangular plates.
vec3 sdir = normalize(vScaleDir + vec3(1e-4));
float clawK = smoothstep(0.25, 0.6, vAux.y);
float limb = (1.0 - onLoft) * (1.0 - clawK) * (1.0 - smoothstep(9.0, 9.4, P.x));
float headK = headW * (1.0 - limb); // granular beads all over the head, jaw and throat
float freq = mix(12.5, 10.0, belly);
freq = mix(freq, 7.2, limb);
freq = mix(freq, 7.8, tailW * (1.0 - limb));
freq = mix(freq, 15.0, headK);
float elong = mix(0.85, 0.62, max(limb, tailW));
elong = mix(elong, 0.7, belly);
elong = mix(elong, 1.0, headK);
float keelK = mix(0.25, 0.8, max(limb, tailW)) * (1.0 - belly) * (1.0 - headK);
float overlap = mix(0.7, 1.0, max(limb, max(tailW, belly))) * (1.0 - headK);
vec3 sp = P * freq;
sp += sdir * dot(sp, sdir) * (elong - 1.0);
vec3 vg1, vgb;
vec3 vc = lzVoronoi(sp, mix(0.55, 0.9, headK), vg1, vgb);
vec3 rel = vg1 * vc.x; // from the scale's centre to here, in cell units
float alongS = dot(rel, sdir);
float ew = mix(0.12, 0.3, headK);
float et = clamp(vc.y / ew, 0.0, 1.0);
float edgeS = et * et * (3.0 - 2.0 * et);
vec3 gEdge = vgb * (6.0 * et * (1.0 - et) / ew);
// imbricate scales rise toward their free edge and drop onto the next one
float rampR = 0.5 + alongS * 1.15;
float ramp = clamp(rampR, 0.0, 1.0);
vec3 gRamp = sdir * (rampR > 0.0 && rampR < 1.0 ? 1.15 : 0.0);
float dk = mix(1.3, 2.2, headK); // granular beads are round
float domeS = 1.0 - clamp(vc.x * vc.x * dk, 0.0, 1.0);
vec3 gDome = vg1 * (vc.x * vc.x * dk < 1.0 ? -2.0 * dk * vc.x : 0.0);
vec3 perp = rel - sdir * alongS;
float keelG = keelK * exp(-dot(perp, perp) / 0.0144) * smoothstep(-0.45, 0.25, alongS);
vec3 gKeel = perp * (-2.0 / 0.0144) * keelG;
float M = mix(domeS, ramp * 0.8 + 0.2 * domeS, overlap);
vec3 gM = mix(gDome, gRamp * 0.8 + gDome * 0.2, overlap);
float sH = edgeS * (M + keelG);
vec3 sGrad = gEdge * (M + keelG) + edgeS * (gM + gKeel);
// back from scale space to the body (cm)
sGrad = freq * (sGrad + (elong - 1.0) * sdir * dot(sdir, sGrad));
vec3 sCell = vc;
float spikeT = vAux.w;
float isSpike = step(0.005, spikeT);
float pix = length(fwidth(P)) * freq;
float detail = (1.0 - smoothstep(0.5, 1.6, pix)) * (1.0 - isSpike * smoothstep(0.02, 0.15, spikeT));
// the mouth line and the labial plates either side of it
float mY = pr.w - 0.04 - 0.24 * (1.0 - smoothstep(10.0, 12.7, P.x)) + 0.1 * exp(-pow((P.x - 10.3) / 0.45, 2.0));
float dyM = P.y - mY;
float lipW = dyM > 0.0 ? 0.085 : 0.1;
float lipBand = headW * smoothstep(0.8, 0.93, zn) * smoothstep(0.02, 0.04, abs(dyM)) * (1.0 - smoothstep(lipW - 0.03, lipW, abs(dyM))) * smoothstep(10.2, 10.45, P.x);
float lcOff = dyM > 0.0 ? 0.0 : 0.5;
float lc = fract(P.x * 5.6 + lcOff), lc2 = fract((P.x + 0.004) * 5.6 + lcOff);
float plate = smoothstep(0.0, 0.12, lc) * smoothstep(1.0, 0.88, lc);
float plate2 = smoothstep(0.0, 0.12, lc2) * smoothstep(1.0, 0.88, lc2);
sH = mix(sH, plate * 0.9, lipBand);
sGrad = mix(sGrad, vec3((plate2 - plate) / 0.004 * 0.9, 0.0, 0.0), lipBand);
// the ear: a deep, dark opening behind the corner of the mouth
vec3 earC = vec3(9.92, pr.w + 0.04, sign(P.z) * (pr.x + 0.02));
float earD = length((P - earC) / vec3(0.2, 0.27, 0.24));
float ear = (1.0 - smoothstep(0.75, 1.15, earD)) * smoothstep(9.4, 9.7, P.x) * (1.0 - smoothstep(10.3, 10.5, P.x));
// --- colour pattern (linear): Pogona vitticeps, sandy tan with dark reticulated blotches ---
vec3 cBase = vec3(0.32, 0.165, 0.045);
vec3 cLight = vec3(0.52, 0.33, 0.11);
vec3 cDark = vec3(0.085, 0.048, 0.022);
vec3 cMid = vec3(0.2, 0.11, 0.045);
vec3 cBelly = vec3(0.6, 0.48, 0.31);
vec3 cOrange = vec3(0.62, 0.22, 0.04);
vec3 cCream = vec3(0.64, 0.52, 0.34);
float mott = lzFbm(P * 0.9 + vec3(2.0, 0.0, 5.0));
vec3 col = cBase * (0.86 + 0.28 * mott);
float torso = smoothstep(-0.2, 0.8, P.x) * (1.0 - smoothstep(8.4, 9.3, P.x));
float back = up * torso;
// Dorsal pattern of Pogona vitticeps: a pale vertebral stripe flanked by two
// rows of irregular dark blotches, pale dorsolateral stripes, and reticulated
// darker flanks; the whole back a shade browner than the face.
vec3 g0, g1;
float edgeN = (lzFbm(P * 2.6) - 0.5) * 0.55;
col = mix(col, mix(cBase, cMid, 0.45), back * 0.55);
float midline = 1.0 - smoothstep(0.06, 0.16, zn + edgeN * 0.08);
// paravertebral blotches: a row each side, roughly every 0.9 cm along the body
float rowBand = smoothstep(0.1, 0.2, zn + edgeN * 0.1) * (1.0 - smoothstep(0.48, 0.62, zn + edgeN * 0.12));
float along = sin(P.x * 6.2 + sign(P.z) * 0.9 + edgeN * 5.0 + mott * 2.5 + lzNoise(P * vec3(0.8, 1.0, 4.0)) * 2.0);
float breakup = smoothstep(0.32, 0.58, lzFbm(P * vec3(1.7, 2.4, 3.2) + vec3(9.0)));
float blotch = smoothstep(-0.25, 0.45, along) * rowBand * mix(0.35, 1.0, breakup);
col = mix(col, cDark, blotch * back * 0.85);
// blotch rims a little darker still, interiors broken by pale scales
col = mix(col, cLight * 0.9, back * blotch * smoothstep(0.75, 0.95, lzNoise(P * 9.0)) * 0.35);
col = mix(col, cLight, midline * back * 0.55);
// dorsolateral pale stripe with dark spots below it
float dl = exp(-pow((zn - 0.7 + edgeN * 0.08) / 0.06, 2.0));
col = mix(col, cLight, dl * back * 0.45);
// flanks: dark reticulum with pale spots, under the fringe
float flank = smoothstep(0.62, 0.85, zn) * onLoft * torso * smoothstep(-0.7, 0.3, yn) * (1.0 - belly);
vec3 fb = lzVoronoi(vec3(P.x * 2.4, P.y * 2.4, P.z * 0.6), 0.85, g0, g1);
float net = 1.0 - smoothstep(0.04, 0.12, fb.y);
col = mix(col, cMid * 0.8, flank * 0.55);
col = mix(col, cDark, flank * net * 0.7);
col = mix(col, cLight, flank * (1.0 - smoothstep(0.12, 0.24, fb.x)) * step(0.5, fb.z) * 0.55);
// the neck and nape: dark lateral bars behind the head
float nape = smoothstep(7.8, 8.4, P.x) * (1.0 - smoothstep(9.2, 9.6, P.x)) * up;
col = mix(col, cDark * 1.3, nape * smoothstep(0.2, 0.6, sin(P.x * 9.0 + 1.0)) * smoothstep(0.3, 0.6, zn) * 0.6);
// fine dark speckling everywhere above
float speck = smoothstep(0.72, 0.88, lzNoise(P * 8.5 + 3.0));
col = mix(col, cDark * 1.4, speck * up * 0.4);
// tail: dark bands that fade toward the tip, speckled
float tb = smoothstep(0.05, 0.6, sin(P.x * 2.7 + mott * 1.4));
col = mix(col, mix(col, cMid, 0.6), tailW * up * 0.5);
col = mix(col, cDark * 1.3, tb * tailW * up * 0.7 * smoothstep(-16.0, -6.0, P.x));
col = mix(col, cLight, (1.0 - tb) * tailW * up * 0.15);
// head: orange flush on the jowls, the beard's base and around the eyes
float jowl = smoothstep(8.9, 9.5, P.x) * (1.0 - smoothstep(10.9, 11.6, P.x)) * smoothstep(0.5, 0.9, zn) * (1.0 - belly * 0.5);
col = mix(col, cOrange, jowl * 0.65);
// the crown: browner, mottled, with darker scales among the pale ones
float crownM = smoothstep(0.42, 0.62, lzFbm(P * 3.6 + vec3(5.0)));
col = mix(col, mix(cMid, cBase, 0.25), headW * up * (0.45 + 0.5 * crownM) * (1.0 - jowl));
vec3 eyeC = vec3(uEye.x, uEye.y, sign(P.z) * uEye.z);
float eyeD = length(P - eyeC);
float eyeRing = exp(-pow(eyeD / 0.6, 2.0)) * headW;
col = mix(col, cOrange * 1.1, eyeRing * 0.55);
// the scaly turret around the eye: darker orange-brown
col = mix(col, vec3(0.2, 0.085, 0.025), (1.0 - smoothstep(0.3, 0.42, eyeD)) * headW * 0.6);
// dark stripe from the eye back to the ear
float streak = headW * exp(-pow((P.y - (pr.w + 0.2 + (P.x - 10.75) * 0.12)) / 0.12, 2.0)) * smoothstep(9.75, 10.3, P.x) * (1.0 - smoothstep(10.75, 11.1, P.x)) * smoothstep(0.6, 0.95, zn);
col = mix(col, cDark, streak * 0.6);
// head top: finer, warmer
col = mix(col, col * vec3(1.05, 0.95, 0.85), headW * up * 0.5);
// pale lips and labial scales
col = mix(col, cCream * (0.78 + 0.22 * plate), lipBand * 0.42);
// cream belly, faint grey barring
col = mix(col, cBelly * (0.9 + 0.2 * mott) * (1.0 - 0.12 * smoothstep(0.4, 0.9, sin(P.x * 2.2))), belly);
// beard: orange-tan, turning sooty black when displayed
float beard = smoothstep(8.7, 9.3, P.x) * (1.0 - smoothstep(10.8, 11.3, P.x)) * smoothstep(-0.15, -0.6, yn);
vec3 cBeard = mix(mix(cOrange * 0.8, cBelly * 0.8, 0.45), vec3(0.02, 0.018, 0.016), uDisplay);
col = mix(col, cBeard, beard * (0.6 + 0.4 * uDisplay));
// limbs: tan with darker blotches and banding
col = mix(col, mix(col, cMid, 0.4), limb * up * 0.6);
col = mix(col, cDark * 1.4, limb * smoothstep(0.25, 0.75, sin((P.y + P.x * 0.4) * 5.0 + mott * 3.0)) * up * 0.6);
// Per-scale tint and crevices.
float tint = 0.93 + 0.14 * sCell.z;
// salt-and-pepper: occasional dark and pale scales
float sp1 = fract(sCell.z * 17.31);
tint *= sp1 < mix(0.07, 0.16, headW * up) ? 0.6 : (sp1 > 0.92 ? 1.3 : 1.0);
col *= mix(1.0, tint, detail);
col *= mix(1.0, mix(0.84 + 0.16 * smoothstep(0.0, 0.6, sH), 0.72 + 0.4 * smoothstep(0.1, 0.9, sH), headK), detail);
// far away: the average of scale tops and darker crevices, plus fine mottling
col = mix(col, col * (0.8 + 0.12 * lzNoise(P * 9.0)), (1.0 - detail) * 0.9);
// Spines: pale horn tips.
// Spines: ivory, warmer at the base and faintly amber at the tip
col = mix(col, cCream * 0.95, isSpike * smoothstep(0.0, 0.45, spikeT) * 0.82);
col = mix(col, vec3(0.42, 0.26, 0.12), isSpike * smoothstep(0.8, 1.0, spikeT) * 0.45);
// the ear opening
col = mix(col, vec3(0.025, 0.016, 0.012), ear * 0.92);
// Claws and mouth.
vec3 claw = vec3(0.018, 0.015, 0.013);
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
  // bump from the scale height field's gradient (rest space, cm)
  vec3 nRest = normalize(vRestN);
  float amp = mix(0.011, 0.022, max(limb, tailW)) * mix(1.0, 0.7, belly * (1.0 - headK)) * mix(1.0, 1.5, headK) * mix(1.0, 0.8, lipBand);
  vec3 g = sGrad * amp * detail * (1.0 - clawK) * (1.0 - vAux.z) * (1.0 - ear);
  vec3 nP = normalize(nRest - (g - dot(g, nRest) * nRest));
  normal = normalize(vSkinN * nP);
}
`)
      .replace('#include <aomap_fragment>', `
{
  float ao = vAux.x;
  float micro = mix(1.0, mix(0.55, 0.68, headK) + mix(0.45, 0.32, headK) * smoothstep(0.0, 0.45, sH), detail) * (1.0 - ear * 0.8);
  reflectedLight.indirectDiffuse *= ao * micro;
  reflectedLight.indirectSpecular *= ao * micro;
  reflectedLight.directDiffuse *= mix(1.0, ao, 0.45) * mix(1.0, micro, 0.5);
}
`);
  };
  material.customProgramCacheKey = () => 'lizard-skin-v3';
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
float e = pow(h / 0.66, 2.0) + pow((v - c) / max(0.56 * o, 1e-3), 2.0);
if (o > 0.02 && e < 1.0) discard;
float margin = o > 0.02 ? 1.0 - smoothstep(1.0, 1.5, e) : 0.0;
`)
      .replace('#include <color_fragment>', `#include <color_fragment>
// rings of small scales around the opening, finer at the margin
float ringR = sqrt(max(e, 0.0));
float ri = (ringR - 1.0) * 9.0;
float ang = atan(v - c, h);
float nAround = 26.0 + floor(max(ri, 0.0)) * 3.0;
vec2 rc = vec2(fract(ri), fract(ang / 6.2832 * nAround + floor(ri) * 0.5));
float bead = smoothstep(0.62, 0.25, length(rc - 0.5));
// dark at the margin, then rings of orange-brown scales fading to the face's tan
vec3 lid = mix(vec3(0.16, 0.07, 0.025), vec3(0.42, 0.19, 0.055), smoothstep(1.0, 1.35, ringR));
lid = mix(lid, vec3(0.36, 0.2, 0.07), smoothstep(1.6, 2.6, ringR));
diffuseColor.rgb = lid * (0.62 + 0.45 * bead) * (0.9 + 0.2 * fract(sin(dot(floor(vec2(ri, ang / 6.2832 * nAround)), vec2(12.9, 78.2))) * 43758.5));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.022, 0.016), margin * 0.9);
`);
  };
  material.customProgramCacheKey = () => 'lizard-lid-v3';
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
    // scales point down the limbs (along each limb bone) and back along the body
    const scaleDirs = data.bones.map((b) => /upper|lower|hand|_d\d/.test(b.name) ? new THREE.Vector3(...b.axes[0]).normalize() : new THREE.Vector3(-1, 0, 0));
    const {material, uniforms} = skinMaterial(profileTex, scaleDirs, new THREE.Vector3(data.eye.centre[0], data.eye.centre[1], Math.abs(data.eye.centre[2])));
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
    const eyeMat = new THREE.MeshPhysicalMaterial({map: iris, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.03, specularIntensity: 0.6, ior: 1.38, envMapIntensity: 0.3});
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
      // the lids form a scaly turret around a small opening, as in agamids
      const lid = new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 48, 28, 0, Math.PI * 2, 0, 1.75), lidM.material);
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
    const mouthY = data.mouth.find((m) => m[0] <= 11.8)![1];
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
