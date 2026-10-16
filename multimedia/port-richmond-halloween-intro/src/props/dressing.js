// Halloween set dressing on the stoops of both sides: carved jack-o'-lanterns (candle flicker from t), whole
// pumpkins, fake cobweb on iron railings, orange/purple mini string lights, foam tombstones, paper bats taped in
// a lit window, a witch hat and broom, a hand-painted BOO sign. Nothing on or against Bauder Graphics.
import * as THREE from 'three';
import { HERO, kitPoint, kitRotY, placeOnKit, inBauderZone } from './site.js';
import { CUES } from '../film/cues.js';
import { windAt } from './timings.js';
import { box, rbox, cyl, lathe, merge, xform, tube, rod, mergeStatic } from './geo.js';
import { canvasTexture, cobwebTexture, tombstoneTexture, batTexture, booSignTexture } from './textures.js';
import { makeGlass } from './glass.js';
import { doubleHungWindow, furnitureMaterials } from './furniture.js';
import { rng, fbm1, noise1, clamp, kelvinRGB } from './util.js';
import { frontage3607, DISPLAY } from './porch.js';

const STEP_TOP = { SM_R_Steps_3: [0.54, 0.36, 0.18], SM_R_Steps_2: [0.36, 0.18], SM_R_Steps_1: [0.18] };
// kit-local point on a stoop: tread index 0 = landing (by 0.004..0.546), 1.. = lower treads (0.28 deep each)
function stoopPoint(st, bx, tread, frac = 0.5) {
  const tops = STEP_TOP[st.m];
  const t = Math.min(tread, tops.length - 1);
  const by0 = t === 0 ? 0.004 : 0.55 + (t - 1) * 0.28, by1 = t === 0 ? 0.546 : by0 + 0.276;
  return kitPoint(st, bx, by0 + (by1 - by0) * frac, tops[t]);
}

// candle flicker 0..~1.1, deterministic per seed; dips when the wind gusts
export function candleFlicker(t, seed) {
  const w = windAt(t);
  const base = 0.86 + 0.08 * fbm1(t * 6.5 + seed * 3.1, seed) + 0.05 * noise1(t * 21 + seed, seed + 7);
  const gustDip = clamp((w - 0.55) * 0.5, 0, 0.3) * (0.6 + 0.4 * noise1(t * 9 + seed, seed + 3));
  return Math.max(0.35, base - gustDip);
}

// ---- procedural pumpkin fallback (replaced by assets/props/pumpkins.glb when present) ----
function pumpkinSkinTexture(face, seed) {
  return canvasTexture('pkskin' + face + seed, 512, 256, (g, w, h) => {
    const R = rng(seed);
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#b4560f'); gr.addColorStop(0.5, '#e07a1a'); gr.addColorStop(1, '#a24a0c');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(90,40,5,0.35)'; g.fillRect((i / 12) * w - 3, 0, 6, h); }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(120,70,20,${R() * 0.25})`; g.beginPath(); g.arc(R() * w, R() * h, 1 + R() * 4, 0, 7); g.fill(); }
  }, { wrap: true });
}
function pumpkinFaceEmissive(face) {
  // emissive mask (white = carved hole) on the same UV layout; face centred at u=0.75 (front, +Z)
  return canvasTexture('pkface' + face, 512, 256, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    if (face === 'none') return;
    g.fillStyle = '#ffd9a0';
    const cx = w * 0.75, cy = h * 0.5;
    const tri = (x, y, s, up = true) => { g.beginPath(); g.moveTo(x - s, y + (up ? s * 0.6 : -s * 0.6)); g.lineTo(x + s, y + (up ? s * 0.6 : -s * 0.6)); g.lineTo(x, y + (up ? -s * 0.7 : s * 0.7)); g.closePath(); g.fill(); };
    if (face === 'A' || face === 'D') { tri(cx - 34, cy - 26, 16); tri(cx + 34, cy - 26, 16); tri(cx, cy + 2, 9); }
    if (face === 'B') { g.beginPath(); g.arc(cx - 32, cy - 24, 13, 0, 7); g.arc(cx + 32, cy - 24, 13, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx, cy + 30, 14, 18, 0, 0, 7); g.fill(); }
    if (face === 'C' || face === 'E') { g.beginPath(); g.moveTo(cx - 50, cy - 40); g.lineTo(cx - 14, cy - 24); g.lineTo(cx - 44, cy - 14); g.fill(); g.beginPath(); g.moveTo(cx + 50, cy - 40); g.lineTo(cx + 14, cy - 24); g.lineTo(cx + 44, cy - 14); g.fill(); }
    g.beginPath(); g.moveTo(cx - 56, cy + 22);
    for (let i = 0; i <= 8; i++) { const x = cx - 56 + i * 14; g.lineTo(x, cy + (i % 2 ? 38 : 26) + (face === 'D' ? i * 2 : 0)); }
    g.lineTo(cx + 56, cy + 22); g.quadraticCurveTo(cx, cy + 70, cx - 56, cy + 22); g.fill();
  }, { wrap: true });
}
function proceduralPumpkin(face, seed, size) {
  const geo = new THREE.SphereGeometry(0.5, 48, 24);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(z, x);
    const rib = 1 - 0.07 * Math.pow(Math.abs(Math.cos(a * 6)), 2.5);
    const flat = y < -0.3 ? 1 - (-0.3 - y) * 0.5 : 1;
    p.setXYZ(i, x * rib, y * 0.78 * flat + (y > 0.42 ? -(y - 0.42) * 0.6 : 0), z * rib);
  }
  geo.computeVertexNormals();
  geo.translate(0, 0.39, 0);
  geo.scale(size, size, size);
  const mat = new THREE.MeshStandardMaterial({ name: 'PumpkinSkinProc', map: pumpkinSkinTexture(face, seed), roughness: 0.52, emissive: 0xffa040, emissiveMap: pumpkinFaceEmissive(face), emissiveIntensity: face === 'none' ? 0 : 2.5 });
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; g.add(m);
  const stem = new THREE.Mesh(cyl(0.012 * size * 4, 0.02 * size * 4, 0.06 * size * 2.2, 0, 0.8 * size, 0, 0.2, 0, 0.15, 7), new THREE.MeshStandardMaterial({ name: 'PumpkinStemProc', color: 0x5a5a2a, roughness: 0.9 }));
  g.add(stem);
  return { group: g, flesh: face === 'none' ? null : mat, fleshKey: 'emissiveIntensity', fleshBase: 2.5 };
}

// ---------------------------------------------------------------- HERO PUMPKIN (P1 insert)
const HERO_SCALE = 1.06;          // pumpkin_D at 1.06: ~0.33 m tall, ~0.32 m wide (fits the 0.46 m P1 insert)
const HERO_FACE_YAW = -0.3;       // world yaw of the carved face (local +Z): at the P1 camera (yaw -0.22), a touch toward the street
// candle level 0..~1.1 for the hero: normal flicker, then at CUES.pumpkinGutter it dips nearly out, sputters and
// recovers weaker (~0.7). Shared by the flame, the flesh glow, its light and the smoke (pure function of t).
export function heroFlameLevel(t) {
  const base = candleFlicker(t, 77);
  const x = t - CUES.pumpkinGutter;
  if (x < -0.15) return base;
  let k;
  if (x < 0) k = 1 - 0.15 * smooth01(-0.15, 0, x);                         // the flame leans and shrinks first
  else if (x < 0.22) k = 0.85 - 0.78 * smooth01(0, 0.22, x);               // dips nearly out
  else if (x < 1.05) {                                                       // sputters: brief flare-ups
    const s = (x - 0.22) / 0.83;
    k = 0.07 + 0.3 * s * s + Math.max(0, noise1(t * 26, 41)) * (1 - s) * 0.5 + Math.max(0, noise1(t * 9, 43)) * 0.15;
  } else k = 0.42 + 0.28 * smooth01(1.05, 2.6, x);                         // recovers weaker
  return base * Math.min(1.1, k);
}
function smooth01(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
// smoke envelope + head height (m) of the thin wisp out of the lid gap after the gutter
function heroSmoke(t) {
  const x = t - (CUES.pumpkinGutter + 0.12);
  if (x < 0) return { a: 0, head: 0 };
  return { a: smooth01(0, 0.35, x) * (1 - smooth01(1.6, 3.4, x)), head: Math.min(1, 0.06 + x * 0.42) };
}
function heroSkinMaterial(src) {
  const m = new THREE.MeshPhysicalMaterial({
    name: 'PumpkinSkinHeroWet', map: src.map || null, normalMap: src.normalMap || null,
    color: (src.color ? src.color.clone() : new THREE.Color(1, 1, 1)).multiply(new THREE.Color(0.66, 0.56, 0.48)),
    roughness: 0.55, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.18,
  });
  if (src.normalMap && src.normalScale) m.normalScale.copy(src.normalScale);
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vObjPos;
float pkH3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float pkVn(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(pkH3(i), pkH3(i + vec3(1, 0, 0)), f.x), mix(pkH3(i + vec3(0, 1, 0)), pkH3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(pkH3(i + vec3(0, 0, 1)), pkH3(i + vec3(1, 0, 1)), f.x), mix(pkH3(i + vec3(0, 1, 1)), pkH3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
  float pkRn = pkVn(vObjPos * 19.0) * 0.6 + pkVn(vObjPos * 53.0) * 0.4;
  float pkRot = smoothstep(0.5, 0.78, pkRn) * 0.8 + smoothstep(0.09, 0.0, vObjPos.y) * 0.5 + smoothstep(0.24, 0.31, vObjPos.y) * 0.25;
  diffuseColor.rgb *= mix(vec3(1.0), vec3(0.36, 0.3, 0.16), clamp(pkRot, 0.0, 0.9));`);
  };
  m.customProgramCacheKey = () => 'pkHeroSkinWet';
  return m;
}
const BILLBOARD_VS = /* glsl */`
  uniform float uW, uH;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 base = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 right = normalize(vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]));
    vec3 world = base + right * position.x * uW + vec3(0.0, 1.0, 0.0) * position.y * uH;
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  }`;
function buildHeroExtras(ctx, node, pos, sources, anchors) {
  node.updateMatrixWorld(true);
  const L = (x, y, z) => node.localToWorld(new THREE.Vector3(x, y, z));
  const faceDir = new THREE.Vector3(Math.sin(HERO_FACE_YAW), 0, Math.cos(HERO_FACE_YAW));
  const wick = L(0, 0.046, 0);
  const extras = new THREE.Group(); extras.name = 'HeroPumpkinFX';
  // flame: camera-facing teardrop (additive), shrinks/dims with heroFlameLevel
  const plane = new THREE.PlaneGeometry(1, 1); plane.translate(0, 0.5, 0);
  const fU = { uW: { value: 0.02 }, uH: { value: 0.05 }, uTime: { value: 0 }, uLevel: { value: 1 } };
  const flame = new THREE.Mesh(plane, new THREE.ShaderMaterial({
    name: 'HeroCandleFlame', uniforms: fU, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    vertexShader: BILLBOARD_VS,
    fragmentShader: /* glsl */`
      uniform float uTime, uLevel;
      varying vec2 vUv;
      void main() {
        float v = vUv.y;
        float hw = 0.5 * pow(max(0.0, sin(3.14159 * pow(v, 0.6))), 0.85) * (1.0 - 0.3 * v);
        float flick = (0.05 * sin(uTime * 23.0 + v * 9.0) + 0.04 * sin(uTime * 37.0 + 2.1)) * v * v;
        float d = abs(vUv.x - 0.5 - flick) / max(hw, 0.001);
        float a = smoothstep(1.0, 0.5, d) * smoothstep(0.0, 0.07, v);
        float core = smoothstep(0.7, 0.0, d) * smoothstep(0.9, 0.12, v);
        vec3 col = mix(vec3(1.0, 0.38, 0.06), vec3(1.0, 0.86, 0.52), core);
        col = mix(col, vec3(0.22, 0.32, 1.0), smoothstep(0.17, 0.02, v) * 0.55);
        gl_FragColor = vec4(col * (1.6 + 2.6 * core) * uLevel, a);
      }`,
  }));
  flame.position.copy(wick); flame.frustumCulled = false; flame.renderOrder = 7; flame.name = 'HeroFlame';
  extras.add(flame);
  // smoke wisp out of the lid gap (normal blending, thin, rises after the gutter)
  const sU = { uW: { value: 0.11 }, uH: { value: 0.46 }, uTime: { value: 0 }, uA: { value: 0 }, uHead: { value: 0 } };
  const smoke = new THREE.Mesh(plane, new THREE.ShaderMaterial({
    name: 'HeroSmoke', uniforms: sU, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: BILLBOARD_VS,
    fragmentShader: /* glsl */`
      uniform float uTime, uA, uHead;
      varying vec2 vUv;
      void main() {
        float y = vUv.y;
        float x0 = 0.5 + (0.16 * sin(y * 8.0 - uTime * 2.0) + 0.07 * sin(y * 21.0 - uTime * 3.6)) * y;
        float w = 0.03 + 0.16 * y * y;
        float d = (vUv.x - x0) / w;
        float a = exp(-d * d * 2.2) * smoothstep(0.0, 0.05, y) * (1.0 - smoothstep(uHead - 0.18, uHead, y)) * (1.0 - 0.6 * y);
        gl_FragColor = vec4(vec3(0.66, 0.62, 0.58), a * 0.4 * uA);
      }`,
  }));
  smoke.position.copy(L(0.03, 0.262, -0.035)); smoke.frustumCulled = false; smoke.renderOrder = 7; smoke.name = 'HeroSmoke';
  extras.add(smoke);
  ctx.scene && void 0;
  // its light: a high-priority real pool light during the P1 insert, ordinary candle priority afterwards
  const lp = wick.clone().add(new THREE.Vector3(0, 0.07, 0)).addScaledVector(faceDir, 0.05);
  const col = new THREE.Color(...kelvinRGB(1850));
  sources.push({ id: 'pumpkin_hero_p1', kind: 'point', position: lp, color: col, intensity: 0.75, distance: 2.4, decay: 2, priority: 900,
    enabledAt: (t) => t < CUES.shotP2, intensityAt: (t) => heroFlameLevel(t) * ctx.lightScale });
  sources.push({ id: 'pumpkin_hero', kind: 'point', position: lp, color: col, intensity: 0.6, distance: 2.4, decay: 2, priority: 22,
    enabledAt: (t) => t >= CUES.shotP2 && ctx.quality !== 'low', intensityAt: (t) => heroFlameLevel(t) * ctx.lightScale });
  const top = L(0, 0.31, 0);
  // P1 framing hint (same direction rule as shots.js, but far enough to hold the whole carved face at fov 32)
  const centre = L(0, 0.155, 0);
  const lampP = new THREE.Vector3(-1.196, 8.663, -20.396);
  const toLamp = lampP.clone().sub(centre).normalize();
  const yawP = Math.atan2(toLamp.x, toLamp.z) - THREE.MathUtils.degToRad(27);
  const dirP = new THREE.Vector3(Math.sin(yawP), -Math.tan(THREE.MathUtils.degToRad(10)), Math.cos(yawP)).normalize();
  const hintCam = centre.clone().addScaledVector(dirP, -0.74);
  const camHint = { position: hintCam, lookAt: hintCam.clone().add(dirP.clone().add(lampP.clone().sub(hintCam).normalize()).normalize().multiplyScalar(10)), fov: 32, focus: 0.74 - 0.15,
    note: 'suggested P1 camera: 0.74 m from the centre (the whole face at fov 32); focus on the carved face surface (~0.59 m), not the centre' };
  anchors.heroPumpkin = {
    camHint,
    position: L(0, 0.155, 0), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, HERO_FACE_YAW, 0)),
    face: faceDir.clone(), flame: wick.clone(), top, radius: 0.19 * HERO_SCALE / 1.22 * 1.0,
    note: 'hero jack-o\'-lantern on the 3607 landing (-Z front corner): position = centre, quaternion local +Z / face = carved-face direction (toward +Z and the street), flame = wick point; candle gutters at CUES.pumpkinGutter (heroFlameLevel)',
  };
  return {
    group: extras,
    update(t) {
      const lv = heroFlameLevel(t);
      fU.uTime.value = t; fU.uLevel.value = lv;
      const s = Math.sqrt(Math.max(0, lv));
      fU.uH.value = 0.05 * (0.2 + 0.8 * s); fU.uW.value = 0.02 * (0.55 + 0.45 * s);
      const sm = heroSmoke(t);
      sU.uTime.value = t; sU.uA.value = sm.a; sU.uHead.value = sm.head;
      smoke.visible = sm.a > 0.001;
    },
  };
}

export async function buildDressing(ctx) {
  const group = new THREE.Group(); group.name = 'HalloweenDressing';
  let heroNode = null, heroIndex = -1;
  const fm = furnitureMaterials();
  const update = [];
  const sources = [];
  const anchors = {};

  // ---------------- pumpkins ----------------
  let lib = null;
  try {
    const gltf = await ctx.loadGLTF('pumpkins.glb');
    lib = {};
    gltf.scene.traverse((o) => { if (o.name && o.name.startsWith('pumpkin_')) lib[o.name] = o; });
  } catch (e) { lib = null; }
  const H = HERO;
  // [steps item, bx, tread, frac, variant, lit-light rank (0 = emissive only), yaw jitter]
  // v2: the 3607 display (porch.js DISPLAY: bale pair z 5.86-7.17, skeleton chair z ~7.6) gets its own sidewalk
  // pumpkins below (SIDEWALK_PK); the hero jack-o'-lantern is built separately (HERO PUMPKIN section)
  const P = [
    [H.steps3605, 0.42, 0, 0.62, 'A', 3, 0.2], [H.steps3605, -0.45, 1, 0.5, 'C', 0, -0.3], [H.steps3605, 0.44, 2, 0.5, 'whole_1', 0, 0.5],
    [H.steps3603, -0.42, 0, 0.55, 'B', 0, -0.25], [H.steps3603, 0.45, 2, 0.45, 'whole_3', 0, 0.9],
    [H.steps3607, -0.44, 1, 0.5, 'whole_2', 0, 0.6], [H.steps3607, -0.4, 2, 0.45, 'B', 0, -0.5],
    [H.steps3609, -0.45, 1, 0.5, 'D', 4, -0.2], [H.steps3609, 0.42, 0, 0.2, 'whole_2', 0, 1.2],
    [H.steps3611, -0.43, 0, 0.45, 'A', 3, -0.35], [H.steps3611, -0.5, 1, 0.55, 'whole_1', 0, 0.2],
    [H.steps3617, 0.45, 0, 0.5, 'B', 0, 0.3], [H.steps3617, 0.46, 1, 0.5, 'whole_2', 0, -0.4],
    [H.steps3619, -0.42, 0, 0.5, 'C', 0, -0.2], [H.steps3619, 0.42, 1, 0.5, 'whole_3', 0, 0.6],
    [H.steps3602, -0.42, 0, 0.55, 'E', 5, 0.25], [H.steps3602, -0.45, 1, 0.5, 'whole_1', 0, -0.6],
    [H.steps3604, 0.42, 0, 0.5, 'D', 0, -0.3], [H.steps3604, 0.44, 2, 0.5, 'whole_2', 0, 0.3],
    [H.steps3606, -0.4, 0, 0.5, 'A', 0, 0.15],
    [H.steps3608, 0.4, 0, 0.5, 'whole_3', 0, -0.2], [H.steps3608, -0.4, 1, 0.5, 'C', 0, 0.4],
  ];
  const carvedNames = { A: 'pumpkin_A', B: 'pumpkin_B', C: 'pumpkin_C', D: 'pumpkin_D', E: 'pumpkin_E' };
  const pumpkinFlesh = [];
  // one flesh material + one flame material for all GLB pumpkins; each pumpkin's geometry carries its index (aPk)
  // and the candle flicker comes from a uniform array updated per frame (same values as the pool lights)
  const MAXPK = 32;
  const uPk = { value: new Float32Array(MAXPK).fill(1) };
  const pkPatch = (mat, key, apply) => {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uPk = uPk;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aPk;\nvarying float vPk;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvPk = aPk;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nvarying float vPk;\nuniform float uPk[${MAXPK}];`).replace(apply[0], apply[0] + '\n' + apply[1]);
    };
    mat.customProgramCacheKey = () => key;
    return mat;
  };
  let sharedFlesh = null, sharedFlame = null;
  const withIndex = (geo, idx) => { const g = geo.clone(); g.setAttribute('aPk', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count).fill(idx), 1)); return g; };
  let seed = 1;
  const warm = new THREE.Color(...kelvinRGB(1900));
  const entries = [];
  for (const [st, bx, tread, frac, variant, rank, yawJ] of P) {
    if (!st) continue;
    entries.push({ pos: stoopPoint(st, bx, tread, frac), yaw: kitRotY(st) + yawJ, variant, rank });
  }
  // the 3607 display's sidewalk pumpkins: [world z, metres out from the facade, variant, rank, yaw jitter]
  const SIDEWALK_PK = [
    [5.98, 0.84, 'C', 1, 0.5],        // at the decoration's feet (warm under-light on both scarecrows)
    [8.14, 0.62, 'E', 2, -0.45],      // beside the skeleton chair (+Z side)
    [8.42, 0.3, 'whole_1', 0, 0.3],
    [5.86, 0.32, 'whole_3', 0, -0.2], // tucked between the stoop and the bale
  ];
  for (const [z, out, variant, rank, yawJ] of SIDEWALK_PK) entries.push({ pos: frontage3607(z, out, ctx.groundY), yaw: kitRotY(H.steps3607) + yawJ, variant, rank });
  // HERO jack-o'-lantern (P1 insert, 30-40 cm): 3607 landing, -Z front corner; face turned toward the P1 camera
  // (which shots.js places ~0.45 m on its +Z side) and a little toward the street
  const heroPos = stoopPoint(H.steps3607, 0.40, 0, 0.62);
  entries.push({ pos: heroPos, yaw: HERO_FACE_YAW, variant: 'D', rank: 0, hero: true });
  for (const { pos, yaw, variant, rank, hero } of entries) {
    if (inBauderZone(pos.x, pos.z, 0.2)) continue;
    const carved = !variant.startsWith('whole');
    const s = seed++;
    const node = new THREE.Group();
    node.position.copy(pos);
    node.rotation.y = yaw;
    if (hero) node.scale.setScalar(HERO_SCALE);
    let flesh = null, fleshMats = [];
    const srcName = carved ? carvedNames[variant] : 'pumpkin_' + variant;
    const src = lib && lib[srcName];
    if (src) {
      const c = src.clone(true);
      c.position.set(0, 0, 0); c.rotation.set(0, 0, 0);
      // candle/flame/lid: children of the pumpkin node in pumpkins.glb (only add them if exported as siblings)
      for (const k of ['_lid', '_candle', '_flame']) {
        const sib = lib[srcName + k];
        let isChild = false; if (sib) sib.traverseAncestors((a) => { if (a === src) isChild = true; });
        if (sib && !isChild) { const sc = sib.clone(true); sc.position.sub(src.position); node.add(sc); }
      }
      node.add(c);
      const pkIndex = pumpkinFlesh.length;
      node.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (carved && /PumpkinFlesh/.test(m.name)) {
          if (!sharedFlesh) {
            // AgX-safe candle glow (asset author's calibration): amber emissive modulated by the flesh's own map
            sharedFlesh = m.clone(); sharedFlesh.name = 'PumpkinFleshLit';
            sharedFlesh.emissive = new THREE.Color(1.0, 0.55, 0.16); sharedFlesh.emissiveMap = m.map || null; sharedFlesh.emissiveIntensity = 1.15;
            pkPatch(sharedFlesh, 'pkflesh', ['#include <emissivemap_fragment>', 'totalEmissiveRadiance *= uPk[int(vPk + 0.5)];']);
          }
          o.geometry = withIndex(o.geometry, pkIndex); o.material = sharedFlesh;
        } else if (carved && /CandleFlame/.test(m.name)) {
          if (hero) { o.visible = false; o.castShadow = false; return; }   // the hero gets a real flame (heroFlame)
          if (!sharedFlame) { sharedFlame = new THREE.MeshBasicMaterial({ name: 'CandleFlame', color: new THREE.Color(1.6, 0.85, 0.3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }); pkPatch(sharedFlame, 'pkflame', ['#include <color_fragment>', 'diffuseColor.rgb *= uPk[int(vPk + 0.5)];']); }
          o.geometry = withIndex(o.geometry, pkIndex); o.material = sharedFlame; o.castShadow = false;
        } else if (hero && /PumpkinSkin/.test(m.name)) {
          o.material = heroSkinMaterial(m, Array.isArray(o.material) ? null : undefined);
          o.userData.noMerge = true;
        }
      });
      fleshMats = carved ? ['shared'] : [];
      if (hero) {
        node.userData.noMerge = true;
        node.traverse((o) => { o.userData.noMerge = true; });
        heroNode = node; heroIndex = pkIndex;
      }
    } else {
      const sz = carved ? 0.3 + (s % 3) * 0.03 : 0.26 + (s % 4) * 0.04;
      const pr = proceduralPumpkin(carved ? variant : 'none', s, sz);
      node.add(pr.group);
      if (pr.flesh) { pr.flesh.userData.base = pr.fleshBase; fleshMats.push(pr.flesh); }
    }
    group.add(node);
    if (carved && fleshMats.length) {
      pumpkinFlesh.push({ mats: fleshMats, seed: s, rank, pos, level: hero ? heroFlameLevel : null });
      if (rank > 0) {
        const lp = pos.clone().add(new THREE.Vector3(0, 0.16, 0)).add(new THREE.Vector3(-0.0, 0, 0));
        // priority tuned so the 1-3 pumpkins nearest the camera beat distant porch lanterns for a real pool slot
        sources.push({ id: 'pumpkin_' + s, kind: 'point', position: lp, color: warm, intensity: 0.55, distance: 2.6, decay: 2, priority: rank === 3 ? 24 : 18,
          enabledAt: () => ctx.quality === 'high' ? true : ctx.quality === 'medium' ? rank <= 3 : false,
          intensityAt: (t) => candleFlicker(t, s) * ctx.lightScale });
      }
    }
  }
  const hero = heroNode ? buildHeroExtras(ctx, heroNode, heroPos, sources, anchors) : null;
  if (hero) update.push(hero.update);
  update.push((t) => {
    for (let i = 0; i < pumpkinFlesh.length; i++) {
      const p = pumpkinFlesh[i];
      const f = p.level ? p.level(t) : candleFlicker(t, p.seed);
      if (i < MAXPK) uPk.value[i] = f * ctx.lightScale;
      for (const m of p.mats) {
        if (m === 'shared') continue;
        if (m.userData.flame) m.color.setRGB(3.2 * f, 2.0 * f, 0.8 * f);
        else m.emissiveIntensity = (m.userData.base ?? 2.2) * f * ctx.lightScale;
      }
    }
  });

  // ---------------- 3605 iron railing (between the 3605 and 3603 stoops) ----------------
  const iron = new THREE.MeshStandardMaterial({ name: 'WroughtIron', color: 0x111111, roughness: 0.55, metalness: 0.6 });
  const st5 = H.steps3605;
  const railBx = -0.66;
  const railGeo = [];
  const topA = kitPoint(st5, railBx, 0.06, 0.54 + 0.9), topB = kitPoint(st5, railBx, 1.06, 0.18 + 0.86);
  const botA = kitPoint(st5, railBx, 0.06, 0.54 + 0.1), botB = kitPoint(st5, railBx, 1.06, 0.18 + 0.1);
  railGeo.push(rod(topA, topB, 0.016, 8));
  railGeo.push(rod(botA, botB, 0.009, 6));
  railGeo.push(rod(kitPoint(st5, railBx, 0.06, 0.54), kitPoint(st5, railBx, 0.06, 0.54 + 0.95), 0.02, 8));
  railGeo.push(rod(kitPoint(st5, railBx, 1.06, 0.0), kitPoint(st5, railBx, 1.06, 0.18 + 0.92), 0.02, 8));
  const nBal = 9;
  for (let i = 1; i < nBal; i++) {
    const f = i / nBal;
    const a = new THREE.Vector3().lerpVectors(botA, botB, f), b = new THREE.Vector3().lerpVectors(topA, topB, f);
    railGeo.push(rod(a, b, 0.0065, 4));
  }
  const railMesh = new THREE.Mesh(merge(railGeo), iron);
  railMesh.castShadow = true; railMesh.name = 'Railing3605';
  group.add(railMesh);
  anchors.railing3605 = { position: topA.clone().lerp(topB, 0.5), quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, kitRotY(st5), 0)), a: topA, b: topB, note: 'top rail of the iron railing added between the 3605/3603 stoops (rail-tap)' };
  const railLines = [
    { a: topA, b: topB, name: '3605' },
  ];

  // ---------------- fake cobweb on railings ----------------
  const webMats = {};   // one material per web texture so mergeStatic batches the sheets
  const webMat = (s) => webMats[s] || (webMats[s] = new THREE.MeshStandardMaterial({ name: 'FakeCobweb' + s, map: cobwebTexture(s), transparent: true, alphaTest: 0.01, depthWrite: false, side: THREE.DoubleSide, roughness: 1, color: 0xeeeeee }));
  function railTopLine(rail) {
    if (!rail) return null;
    const len = rail.m.includes('_3') ? 1.235 : rail.m.includes('_2') ? 0.955 : 0.7;
    const topH = rail.m.includes('_3') ? 1.475 : rail.m.includes('_2') ? 1.295 : 1.1;
    return { a: kitPoint(rail, 0, 0.06, topH - 0.05), b: kitPoint(rail, 0, len - 0.03, topH - 0.05 - (len * 0.62)), rail };
  }
  const webLines = [railTopLine(H.rail3611a), railTopLine(H.rail3611b), railTopLine(H.rail3602), railTopLine(H.rail3606), railTopLine(H.rail3604), { a: topA, b: topB }];
  let ws = 1;
  for (const L of webLines) {
    if (!L) continue;
    // web sheet hanging from the rail line, stretched down to the steps with sag; two layers for fluff
    for (let layer = 0; layer < 2; layer++) {
      const sx = 10, sy = 6;
      const g = new THREE.PlaneGeometry(1, 1, sx, sy);
      const p = g.attributes.position;
      const R = rng(ws * 31 + layer);
      const dir = new THREE.Vector3().subVectors(L.b, L.a);
      const len = dir.length();
      const along = dir.clone().normalize();
      const side = new THREE.Vector3(-along.z, 0, along.x).normalize();
      const drop = 0.42 + R() * 0.2;
      for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) + 0.5, v = 0.5 - p.getY(i); // v=0 at the rail
        const pt = new THREE.Vector3().copy(L.a).addScaledVector(dir, 0.08 + u * 0.84);
        const sag = Math.sin(Math.PI * u) * 0.08 * v;
        pt.y -= v * drop * (0.7 + 0.3 * Math.sin(u * 7 + layer)) + sag;
        pt.addScaledVector(side, (R() - 0.5) * 0.06 * v + (layer ? 0.02 : -0.02));
        p.setXYZ(i, pt.x, pt.y, pt.z);
      }
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, webMat((ws % 4) + 1));
      m.name = 'Cobweb'; m.renderOrder = 5;
      group.add(m);
    }
    ws++;
  }

  // ---------------- mini string lights (orange + purple) ----------------
  const bulbGeo = new THREE.CapsuleGeometry(0.0035, 0.007, 2, 6);
  const bulbs = [];
  const wireMat = new THREE.MeshStandardMaterial({ name: 'LightWire', color: 0x1a2a14, roughness: 0.6 });
  function stringLights(points, spacing = 0.1, deadRate = 0.04, sd = 1) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const len = curve.getLength();
    const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(8, Math.round(len * 30)), 0.0012, 4, false), wireMat);
    group.add(wire);
    const n = Math.floor(len / spacing);
    const R = rng(sd * 97);
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n;
      const p = curve.getPointAt(u);
      const tan = curve.getTangentAt(u);
      bulbs.push({ p: p.add(new THREE.Vector3(0, -0.006, 0)), tan, purple: i % 2 === 1, dead: R() < deadRate, sd: R() });
    }
  }
  // wrapped spiral along the 3605 railing top rail
  {
    const pts = [];
    const nTurn = 14;
    for (let i = 0; i <= nTurn * 6; i++) {
      const f = i / (nTurn * 6);
      const c = new THREE.Vector3().lerpVectors(topA, topB, f);
      const a = f * nTurn * Math.PI * 2;
      const along = new THREE.Vector3().subVectors(topB, topA).normalize();
      const s1 = new THREE.Vector3(-along.z, 0, along.x).normalize(), s2 = new THREE.Vector3().crossVectors(along, s1);
      pts.push(c.addScaledVector(s1, Math.cos(a) * 0.024).addScaledVector(s2, Math.sin(a) * 0.024));
    }
    stringLights(pts, 0.11, 0.05, 1);
  }
  // v2: swagged along the front edge of the 3607 door canopy (frames the display from above in P2)
  {
    const pts = [];
    const a = kitPoint(H.steps3607, 0.72, 0.56, 2.86), b = kitPoint(H.steps3607, -0.72, 0.56, 2.86);
    for (let i = 0; i <= 24; i++) { const f = i / 24; const p = new THREE.Vector3().lerpVectors(a, b, f); p.y -= 0.1 * Math.abs(Math.sin(f * Math.PI * 2)); pts.push(p); }
    stringLights(pts, 0.09, 0.04, 4);
  }
  // v2: along the front face of the scarecrows' hay bale (under their knees)
  {
    const base = frontage3607(DISPLAY.bale.z, DISPLAY.bale.outFromFacade, ctx.groundY);
    const yaw = kitRotY(H.steps3607) + DISPLAY.bale.yawJitter, c = Math.cos(yaw), s = Math.sin(yaw);
    const W = (x, y, z) => new THREE.Vector3(base.x + x * c + z * s, base.y + y, base.z - x * s + z * c);
    const pts = [];
    for (let i = 0; i <= 16; i++) { const f = i / 16; const x = -0.64 + 1.26 * f; pts.push(W(x, 0.27 + 0.03 * Math.sin(f * Math.PI * 3), 0.355)); }
    stringLights(pts, 0.085, 0.05, 5);
  }
  // draped along the 3611 handrails (warm light on the porch figures)
  for (const r of [H.rail3611b]) {
    const L = railTopLine(r); if (!L) continue;
    const pts = []; for (let i = 0; i <= 12; i++) { const f = i / 12; const p = new THREE.Vector3().lerpVectors(L.a, L.b, f); p.y += 0.02 - Math.sin(f * Math.PI * 4) * 0.035; pts.push(p); }
    stringLights(pts, 0.085, 0.03, 2);
  }
  // around the inside of the 3602 picture window (purple heavy)
  if (H.pic3602) {
    const w = H.pic3602;
    const pts = [];
    const hw = 0.86, hh = 1.4;
    for (let i = 0; i <= 40; i++) {
      const f = i / 40; let bx, bz;
      if (f < 0.25) { bx = -hw + 2 * hw * (f / 0.25); bz = hh; } else if (f < 0.5) { bx = hw; bz = hh - hh * ((f - 0.25) / 0.25); } else if (f < 0.75) { bx = hw - 2 * hw * ((f - 0.5) / 0.25); bz = 0.05; } else { bx = -hw; bz = 0.05 + hh * ((f - 0.75) / 0.25); }
      pts.push(kitPoint(w, bx * 0.98, -0.2, bz + (bz > 1 ? -0.04 * Math.sin(f * 60) : 0)));
    }
    stringLights(pts, 0.1, 0.06, 3);
  }
  const bulbMat = new THREE.MeshBasicMaterial({ name: 'MiniBulb', color: new THREE.Color(1.6, 1.6, 1.6) });
  const bulbMesh = new THREE.InstancedMesh(bulbGeo, bulbMat, bulbs.length);
  const dm = new THREE.Matrix4(), dq = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), col = new THREE.Color();
  bulbs.forEach((b, i) => {
    dq.setFromUnitVectors(up, new THREE.Vector3(b.tan.z, -0.6, -b.tan.x).normalize());
    dm.compose(b.p, dq, one);
    bulbMesh.setMatrixAt(i, dm);
    if (b.dead) col.setRGB(0.02, 0.02, 0.02); else if (b.purple) col.setRGB(0.32, 0.02, 1.0); else col.setRGB(1.0, 0.24, 0.0);
    bulbMesh.setColorAt(i, col);
  });
  bulbMesh.name = 'MiniLights';
  group.add(bulbMesh);
  // one faint coloured glow source per string (only near the camera, high quality)
  sources.push({ id: 'lights_3605', kind: 'point', position: topA.clone().lerp(topB, 0.5).add(new THREE.Vector3(-0.15, 0, 0)), color: new THREE.Color(1.0, 0.5, 0.35), intensity: 0.12, distance: 1.6, decay: 2, priority: 0.45, enabledAt: () => ctx.quality === 'high' });

  // ---------------- foam tombstones ----------------
  function tombstone(w, h, sd, text) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, 0, Math.PI, false); s.lineTo(-w / 2, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 16 });
    const uv = g.attributes.uv, p = g.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, p.getY(i) / h);
    g.translate(0, 0, -0.025);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ name: 'FoamTombstone', map: tombstoneTexture(sd, text), roughness: 0.95 }));
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  const tombs = [
    [H.steps3603, -1.25, 0.32, 0.03, 0.44, 0.3, 'R.I.P.', -0.12], // in front of the 3603 (bat) window, leaning on the facade
    [H.steps3604, -1.05, 0.3, 0.02, 0.4, 0.28, 'R.I.P.', 0.15],
    [H.steps3611, -1.92, 0.22, 0.0, 0.36, 0.26, 'BOO', 0.1],
    [H.steps3607, -3.42, 0.2, 0.0, 0.44, 0.3, 'R.I.P.', -0.1],   // v2: beside the skeleton chair, against the 3607 facade
  ];
  for (const [st, bx, by, bz, h, w, text, lean] of tombs) {
    if (!st) continue;
    const t = tombstone(w, h, bx * 10 | 0, text);
    const base = kitPoint(st, bx, by, 0);
    base.y = ctx.groundY(base.x, base.z) + bz;
    if (inBauderZone(base.x, base.z)) continue;
    t.position.copy(base);
    t.rotation.set(-lean, kitRotY(st) + (bx > 0 ? 0.12 : -0.15), (bx > 0 ? 0.04 : -0.05));
    group.add(t);
  }

  // ---------------- paper bats taped inside the 3603 window (lit room behind) ----------------
  if (H.win3603a) {
    const w = H.win3603a;
    const wg = new THREE.Group(); placeOnKit(wg, w); group.add(wg);
    const inside = !!(ctx.open && ctx.open.win3603a);
    // see-through window: our sashes/glass + a lit room behind; otherwise the bats sit on the world's glass with a
    // warm glow layer just in front of it (the world's opaque night glass is ~0.12-0.15 m inside the facade)
    const zb = inside ? -0.165 : -0.108, zg = inside ? -0.6 : -0.112;
    if (inside) { const win = doubleHungWindow(makeGlass({ name: 'Glass3603', grime: 0.4, opacity: 0.14, metres: [0.64, 0.57], envMap: ctx.envMap })); if (ctx.hasWorld) win.group.children[0].visible = false; wg.add(win.group); }
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(inside ? 1.0 : 0.66, inside ? 1.5 : 1.2), new THREE.MeshStandardMaterial({ name: 'WarmRoom3603', color: 0x1a1008, emissive: 0xffa04a, emissiveIntensity: inside ? 0.55 : 0.4, roughness: 1 }));
    glow.position.set(0, 0.72, zg); wg.add(glow);
    if (inside) {
      const shade = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.35), new THREE.MeshStandardMaterial({ name: 'Shade3603', color: 0xd8c8a8, emissive: 0x7a5530, emissiveIntensity: 0.6, roughness: 1 }));
      shade.position.set(0, 1.18, -0.2); wg.add(shade);
    } else {
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 1.2), makeGlass({ name: 'Glass3603Front', grime: 0.4, opacity: 0.1, metres: [0.64, 1.2], envMap: ctx.envMap }));
      gl.position.set(0, 0.72, -0.09); gl.renderOrder = 2; wg.add(gl);
    }
    const bmat = new THREE.MeshStandardMaterial({ name: 'PaperBat', map: batTexture(), alphaTest: 0.5, side: THREE.DoubleSide, color: 0xffffff, roughness: 0.95 });
    const R = rng(3603);
    const batPos = [[-0.18, 0.95, 0.5], [0.14, 1.08, 0.35], [-0.05, 0.62, 0.42], [0.2, 0.42, 0.3], [-0.22, 0.3, 0.28], [0.06, 1.24, 0.25]];
    const tapeMat = new THREE.MeshStandardMaterial({ name: 'Tape', color: 0xe8e0c8, transparent: true, opacity: 0.55, roughness: 0.4 });
    for (const [x, y, s] of batPos) {
      const b = new THREE.Mesh(new THREE.PlaneGeometry(0.42 * s, 0.21 * s), bmat);
      b.position.set(x, y, zb);
      b.rotation.z = (R() - 0.5) * 0.7;
      wg.add(b);
      const tape = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.012), tapeMat);
      tape.position.set(x, y + 0.02 * s, zb + 0.002); tape.rotation.z = b.rotation.z + 0.3; wg.add(tape);
    }
  }

  const twineMat = new THREE.MeshStandardMaterial({ name: 'Twine', color: 0x74603e, roughness: 1 });  // broom binding + sign string
  // ---------------- witch hat + broom (3604 stoop, NW side) ----------------
  if (H.steps3604) {
    const felt = new THREE.MeshStandardMaterial({ name: 'WitchHatFelt', color: 0x141216, roughness: 0.95, side: THREE.DoubleSide });
    const band = new THREE.MeshStandardMaterial({ name: 'WitchHatBand', color: 0x3a1650, roughness: 0.7 });
    const hat = new THREE.Group();
    const coneG = lathe([[0.11, 0], [0.095, 0.08], [0.07, 0.17], [0.045, 0.25], [0.02, 0.32], [0.004, 0.36], [0, 0.365]], 24);
    const cp = coneG.attributes.position;
    for (let i = 0; i < cp.count; i++) { const y = cp.getY(i); const bend = Math.max(0, y - 0.18); cp.setX(i, cp.getX(i) + bend * bend * 1.6); cp.setY(i, y - bend * bend * 0.4); }
    coneG.computeVertexNormals();
    hat.add(new THREE.Mesh(coneG, felt));
    const brim = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.24, 40, 2).rotateX(-Math.PI / 2), felt);
    const bp = brim.geometry.attributes.position;
    for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), z = bp.getZ(i); bp.setY(i, 0.012 * Math.sin(Math.atan2(z, x) * 3) * (Math.hypot(x, z) - 0.1) * 4); }
    brim.geometry.computeVertexNormals();
    hat.add(brim);
    hat.add(new THREE.Mesh(cyl(0.101, 0.106, 0.035, 0, 0.02, 0, 0, 0, 0, 24, true), band));
    hat.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const hp = stoopPoint(H.steps3604, -0.38, 0, 0.35);
    // the wavy, slightly tilted brim dips up to ~2 cm below the hat origin: lift it so the brim rests on the landing
    hat.position.copy(hp); hat.position.y += 0.02; hat.rotation.set(0.04, 1.1, -0.03);
    group.add(hat);
    // broom leaning on the facade beside the door
    const broom = new THREE.Group();
    broom.add(new THREE.Mesh(cyl(0.012, 0.012, 1.05, 0, 0.62, 0, 0, 0, 0, 8), new THREE.MeshStandardMaterial({ name: 'BroomHandle', color: 0x6a4a2a, roughness: 0.7 })));
    const bristle = lathe([[0.0, 0], [0.09, 0.0], [0.08, 0.1], [0.045, 0.22], [0.02, 0.3], [0, 0.3]], 16);
    const brp = bristle.attributes.position; for (let i = 0; i < brp.count; i++) { const a = Math.atan2(brp.getZ(i), brp.getX(i)); const k = 1 + 0.08 * Math.sin(a * 23); brp.setX(i, brp.getX(i) * k); brp.setZ(i, brp.getZ(i) * k * 0.55); }
    bristle.computeVertexNormals();
    broom.add(new THREE.Mesh(bristle, new THREE.MeshStandardMaterial({ name: 'BroomStraw', color: 0x9a7a3a, roughness: 0.95 })));
    broom.add(new THREE.Mesh(cyl(0.05, 0.05, 0.02, 0, 0.24, 0, 0, 0, 0, 16, true), twineMat));
    broom.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    const bp2 = kitPoint(H.door3604 || H.steps3604, -0.68, 0.18, 0.0);
    broom.position.copy(bp2); broom.position.y = H.steps3604.p[1] + 0.54;
    broom.rotation.set(0, kitRotY(H.steps3604), 0.2);
    broom.rotateX(-0.22);
    group.add(broom);
  }

  // ---------------- BOO sign beside the 3603 door ----------------
  if (H.door3603) {
    const sign = new THREE.Group();
    const board = new THREE.Mesh(box(0.38, 0.19, 0.012, 0, 0, 0, 0, 0, 0, false), [
      new THREE.MeshStandardMaterial({ name: 'SignEdge', color: 0x241a12, roughness: 0.9 }), new THREE.MeshStandardMaterial({ name: 'SignEdge', color: 0x241a12, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ name: 'SignEdge', color: 0x241a12, roughness: 0.9 }), new THREE.MeshStandardMaterial({ name: 'SignEdge', color: 0x241a12, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ name: 'BooSign', map: booSignTexture(), roughness: 0.85 }), new THREE.MeshStandardMaterial({ name: 'SignBack', color: 0x2a1c12, roughness: 0.9 }),
    ]);
    board.castShadow = true;
    sign.add(board);
    const twine = new THREE.Mesh(merge([rod(new THREE.Vector3(-0.15, 0.09, 0.004), new THREE.Vector3(0, 0.2, 0.004), 0.0018, 4), rod(new THREE.Vector3(0.15, 0.09, 0.004), new THREE.Vector3(0, 0.2, 0.004), 0.0018, 4)]), twineMat);
    twine.castShadow = true;
    sign.add(twine);
    const sp = kitPoint(H.door3603, -0.78, 0.03, 1.32);
    sign.position.copy(sp);
    sign.rotation.set(0, kitRotY(H.door3603), 0.035);
    group.add(sign);
  }

  // batch the static dressing (pumpkin flesh / flames keep per-pumpkin materials, so they stay separate)
  mergeStatic(group, (m) => m.isInstancedMesh, { extra: ['aPk'] });
  if (hero) group.add(hero.group);
  return {
    group, sources, anchors,
    railLines,
    update(t) { for (const f of update) f(t); },
    api: { pumpkins: pumpkinFlesh, candleFlicker, stringLights: bulbMesh },
  };
}
