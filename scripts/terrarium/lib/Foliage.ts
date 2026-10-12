import * as THREE from 'three';
import {WIND_GLSL} from './WindField';
import {TANK} from './Case';

export const PUSHERS = 8;

/** Shared shader hooks for plants: wind from the flow field, gust waves, flutter and thin-leaf translucency. */
export const foliageUniforms = {
  uTime: {value: 0},
  uKeyDirView: {value: new THREE.Vector3(0, 1, 0)},
  uKeyColor: {value: new THREE.Color(1, 0.8, 0.6)},
  uWet: {value: 0},
  /** 0..1: the moisture the case's humid air leaves on the leaves (a film and, close up, dew). */
  uHumid: {value: 0.5},
  tWind: {value: null as THREE.Texture | null},
  uWindBox: {value: new THREE.Vector4(-0.6, -0.25, 1.2, 0.5)},
  uGust: {value: new THREE.Vector3()},
  /**
   * What pushes the foliage aside: capsules from (x, y, z, radius) to uPushB's
   * (x, y, z, strength 0..1). The hand, then the lizard's head, body and tail,
   * and the wake it leaves as the plants spring back.
   */
  uPush: {value: Array.from({length: PUSHERS}, () => new THREE.Vector4(0, -1, 0, 0))},
  uPushB: {value: Array.from({length: PUSHERS}, () => new THREE.Vector4(0, -1, 0, 0))},
  /** Inner faces of the glass (half width, half depth), just inside the panes. */
  uGlass: {value: new THREE.Vector2(TANK.w / 2 - 0.004, TANK.d / 2 - 0.004)},
  /** Height of whatever lies on top (ground, stones, the log) over the tank, and its box. */
  tTop: {value: null as THREE.Texture | null},
  uTopBox: {value: new THREE.Vector4(-TANK.w / 2, -TANK.d / 2, TANK.w, TANK.d)},
  /** The lamp (world), for the shadow lookup. */
  uFolKeyPos: {value: new THREE.Vector3(0, 1, 0)},
};

/** Every point of a part belongs to the plant rooted at (x, y, z): it leans with that plant when pushed. */
export function setRoot(g: THREE.BufferGeometry, x: number, y: number, z: number) {
  const n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;}
  g.setAttribute('aRoot', new THREE.BufferAttribute(a, 3));
}

/** Side veins running out from a leaf's midrib towards its tip (leaf uv: u along, v across -1..1). */
export const PINNATE_GLSL = /* glsl */ `
float pinnate(float u, float v, float n, float s, float w, vec2 fw){ return folLine(u * n - abs(v) * s, w, fw.x * n + fw.y * s); }`;

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
 * from an attribute; otherwise it comes from the local vertex height. `push:
 * false` is for things lying flat (fallen leaves), which nothing pushes aside.
 */
export function addFoliage(material: THREE.MeshStandardMaterial, opts: {height?: number; translucency?: number; flexAttr?: boolean; phaseAttr?: boolean; rootAttr?: boolean; stiffness?: number; push?: boolean; micro?: number; key: string}) {
  const height = opts.height ?? 0.3;
  const translucency = opts.translucency ?? 0.6;
  const stiff = opts.stiffness ?? 1;
  const micro = opts.micro ?? 1;
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, foliageUniforms);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>
#define PUSHERS ${PUSHERS}
uniform float uTime; uniform vec4 uPush[${PUSHERS}]; uniform vec4 uPushB[${PUSHERS}]; uniform vec2 uGlass; uniform sampler2D tTop; uniform vec4 uTopBox; uniform vec3 uFolKeyPos;
${opts.flexAttr ? 'attribute float aFlex;' : ''}
${opts.phaseAttr ? 'attribute float aPhase;' : ''}
${opts.rootAttr ? 'attribute vec3 aRoot;' : ''}
varying float vFlex; varying float vGust; varying vec3 vFolW; varying vec3 vFolRest;
float foliageTop(vec2 xz){ return texture2D(tTop, clamp((xz - uTopBox.xy) / uTopBox.zw, 0.0, 1.0)).r; }
// The push of everything parting the plants, read at \`at\` (xz) for a point at height
// vw.y: k is how hard it pushes aside, downK how hard it presses down. The field is
// smooth everywhere, so nothing a leaf can straddle tears it.
vec3 folPush(vec2 at, vec3 vw, float k, float downK){
  vec3 push = vec3(0.0);
  for (int i = 0; i < PUSHERS; i++) {
    vec4 p = uPush[i], q = uPushB[i];
    if (p.w <= 0.0 || q.w <= 0.0) continue;
    vec3 ab = q.xyz - p.xyz;
    float l2 = dot(ab.xz, ab.xz);
    float t = l2 > 1e-8 ? clamp(dot(at - p.xz, ab.xz) / l2, 0.0, 1.0) : 0.0;
    vec3 c = p.xyz + ab * t;
    vec2 d = at - c.xz;
    float dy = vw.y - c.y;
    float R = p.w * 1.35;
    float r = length(d);
    if (r >= R) continue;
    float s = 1.0 - r / R;
    // the part above the contact moves with it (fading well above it); below, toward the root, less
    float vy = smoothstep(-2.2 * p.w, -0.3 * p.w, dy) * (1.0 - smoothstep(3.0 * p.w, 7.0 * p.w, dy));
    // aside: from nothing at the centre to a peak a third of the way out, back to nothing at the rim
    vec2 side = d * (k * s * s);
    // pressed down under the body (not above it, where it would sink into it)
    float down = -downK * p.w * s * s * (1.0 - smoothstep(-0.2 * p.w, p.w, dy));
    push += vec3(side.x, down, side.y) * vy * q.w;
  }
  return push;
}
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
  // where this point lies on its plant (it moves with the plant, not with the
  // wind), so the fine detail drawn there never swims over the leaf
  vFolRest = position * length(toWorld[0].xyz) + root;
  // the wind is read where each part of the plant actually is, so a gust
  // crossing a fern bends its near fronds before its far ones
  vec3 anchor = ${opts.flexAttr ? 'vw' : 'mix(root, vw, 0.8)'};
  vec3 bend = foliageWind(vec3(anchor.x, root.y, anchor.z), flex, ${(height * 1.0).toFixed(4)}, ph, ${stiff.toFixed(3)});
  vGust = length(bend.xz) / ${(height * 0.25).toFixed(4)};
  mat3 toLocal = inverse(mat3(toWorld));
  transformed += toLocal * bend;
  vw += bend;
  // bend away from the lizard (and the hand) as they push through. Each plant
  // leans as a whole: the push is read between its root and the point, so a
  // leaf moves with its stem instead of being pulled apart, plus a little of
  // the push right at the point to keep leaves out of the body.
  vec3 folRootW = ${opts.rootAttr ? '(modelMatrix * vec4(aRoot, 1.0)).xyz' : (opts.flexAttr ? 'vw' : 'root')};
  vec3 push = ${opts.push === false ? 'vec3(0.0)' : 'folPush(mix(folRootW.xz, vw.xz, 0.3), vw, 2.0, 0.45) + folPush(vw.xz, vw, 0.4, 0.0)'};
  float pushLen = length(push.xz);
  if (pushLen > 0.045) push.xz *= 0.045 / pushLen;
  transformed += toLocal * push * max(flex, 0.25);
  vec3 wf = vw + push * max(flex, 0.25);
  // the glass: a leaf that reaches it presses flat against it, never through it
  vec3 wc = vec3(clamp(wf.x, -uGlass.x, uGlass.x), wf.y, clamp(wf.z, -uGlass.y, uGlass.y));
  // ...and a leaf pushed down (by the dragon, by a gust) comes to rest on whatever
  // is under it, the ground, a stone or the log, never inside it. Only parts that
  // stand in the open count (a frond tucked under an overhang is left alone), and
  // none is lifted above where it hung before it was pushed.
  if (vw.y > foliageTop(vw.xz) - 0.002) {
    float topY = foliageTop(wc.xz);
    if (wc.y < topY + 0.0012) {
      float cap = vw.y + 0.003;
      if (topY + 0.0012 > cap) {
        // pushed sideways into the flank of a stone or the log: it goes only as
        // far as the side
        vec2 from = clamp(vw.xz, -uGlass, uGlass), to = wc.xz;
        float f = 0.0;
        for (int k = 1; k <= 3; k++) {
          float t = 1.0 - float(k) * 0.25;
          if (f == 0.0 && foliageTop(mix(from, to, t)) + 0.0012 <= cap) f = t;
        }
        wc.xz = mix(from, to, f);
        wc.y = mix(vw.y, wc.y, f);
        topY = foliageTop(wc.xz);
      }
      wc.y = clamp(topY + 0.0012, wc.y, max(wc.y, cap));
    }
  }
  transformed += toLocal * (wc - wf);
  vFolW = wc;
}`)
      .replace('#include <shadowmap_vertex>', `#include <shadowmap_vertex>
#if NUM_SPOT_LIGHT_COORDS > 0 && defined( USE_SHADOWMAP )
  // a leaf is thinner than the lamp's shadow map can tell from itself: look its
  // shadow up a few millimetres towards the lamp so it doesn't shade itself
  vSpotLightCoord[ 0 ] = spotLightMatrix[ 0 ] * vec4(worldPosition.xyz + normalize(uFolKeyPos - worldPosition.xyz) * 0.003, 1.0);
#endif`);
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uKeyDirView; uniform vec3 uKeyColor; uniform float uWet, uHumid;
varying float vFlex; varying float vGust; varying vec3 vFolW; varying vec3 vFolRest;
// Relief of the leaf surface in millimetres (veins, ribs, the puckering
// between them), drawn as a bump: each material adds its own pattern.
float folRelief = 0.0;
float folH3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float folVN(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(folH3(i), folH3(i + vec3(1, 0, 0)), f.x), mix(folH3(i + vec3(0, 1, 0)), folH3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(folH3(i + vec3(0, 0, 1)), folH3(i + vec3(1, 0, 1)), f.x), mix(folH3(i + vec3(0, 1, 1)), folH3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
/**
 * Antialiased vein lines at the integers of x, half-width w (in x units), where
 * fw is how far x moves across one pixel; too fine to draw, it is its average.
 */
float folLine(float x, float w, float fw){
  float d = abs(fract(x + 0.5) - 0.5);
  float a = 1.0 - smoothstep(max(w - fw, 0.0), w + fw, d);
  return mix(a, 2.0 * w, smoothstep(0.12, 0.4, fw));
}
// a bump from the height h (mm) on the view-space normal n (derivatives: call it in uniform control flow)
vec3 folBump(vec3 n, float h, float faceDir){
  vec3 sx = dFdx(-vViewPosition) * 1000.0, sy = dFdy(-vViewPosition) * 1000.0;
  vec3 r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 g = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  vec3 b = abs(det) * n - g;
  float l2 = dot(b, b);
  return (l2 > 1e-14 && l2 < 1e14) ? b * inversesqrt(l2) : n;
}
// water beaded on the leaf after rain or misting: little domes in 2-3 mm cells
float folHash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
// (xyz: where the point lies across the bead, centre 0 to rim 1; w: coverage)
vec4 folBead(vec3 w, float wet){
  vec3 bp = w * 380.0;
  vec3 bi = floor(bp), bf = fract(bp) - 0.5;
  float h = folHash(bi);
  float r = 0.22 + 0.2 * fract(h * 7.31);
  vec3 off = bf - (vec3(fract(h * 3.1), fract(h * 5.7), fract(h * 9.3)) - 0.5) * 0.3;
  float on = step(1.0 - wet * 0.6, h);
  return vec4(off / r, on * (1.0 - smoothstep(r * 0.8, r, length(off))));
}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
// Close up, the leaf has a surface: a fine net of veinlets and the sheen of its
// cells. Each layer comes in only once the camera is near enough to resolve it.
vec3 folMm = vFolRest * 1000.0;
float folPx = length(fwidth(folMm));
float folNetK = (1.0 - smoothstep(0.1, 0.32, folPx)) * ${micro.toFixed(3)};
float folCellK = (1.0 - smoothstep(0.018, 0.06, folPx)) * ${micro.toFixed(3)};
if (folNetK > 0.0) {
  float n1 = folVN(folMm * 1.25), n2 = folVN(folMm * 3.1 + 7.0);
  float net = max(smoothstep(0.86, 0.97, 1.0 - abs(2.0 * n1 - 1.0)), 0.6 * smoothstep(0.88, 0.98, 1.0 - abs(2.0 * n2 - 1.0)));
  float cell = folCellK > 0.0 ? folVN(folMm * 16.0) : 0.5;
  diffuseColor.rgb *= 1.0 + folNetK * (0.16 * net - 0.05 * (n1 - 0.5)) + folCellK * 0.1 * (cell - 0.5);
  roughnessFactor = clamp(roughnessFactor + folNetK * 0.1 * net - folCellK * 0.12 * (cell - 0.5), 0.05, 1.0);
  folRelief += folNetK * (0.008 * net + 0.01 * n1) + folCellK * 0.0025 * cell;
}
// The case's humid air leaves a film of moisture on every leaf: a wet sheen
// (the lamp's own, shadowed highlight, sharpened) and a slightly deeper colour;
// rain or misting soaks them further.
float folFilm = clamp(max(uHumid * 0.8, uWet), 0.0, 1.0);
roughnessFactor = mix(roughnessFactor, 0.22, folFilm * 0.6);
diffuseColor.rgb *= 1.0 - 0.1 * folFilm;
// Beads of water: dew in the humid air, more after rain. Only drawn where a
// pixel can resolve them (at a distance they would only glitter).
float folBeadK = 1.0 - smoothstep(0.3, 0.8, folPx);
float folBeadAmt = clamp(uWet * 1.4 + uHumid * 0.3, 0.0, 1.0);
vec4 bead = (folBeadAmt > 0.04 && folBeadK > 0.0) ? folBead(vFolW, folBeadAmt) : vec4(0.0);
bead.w *= folBeadK;
// a drop is a little lens: the leaf seen through it, ringed by a thin dark rim
float beadR = length(bead.xyz);
diffuseColor.rgb *= 1.0 - 0.4 * smoothstep(0.7, 0.98, beadR) * bead.w;
roughnessFactor = mix(roughnessFactor, 0.05, bead.w);`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
// (the film of water reflects more than the leaf's own cuticle)
reflectedLight.directSpecular *= 1.0 + folFilm * 0.7;`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = folBump(normal, folRelief, faceDirection);
// each bead is a low dome: the normal tilts towards its rim
normal = normalize(normal + (viewMatrix * vec4(bead.xyz, 0.0)).xyz * bead.w * 0.9);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  // Light passing through the blade when it is lit from behind.
  vec3 nG = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  float back = max(0.0, dot(-nG, uKeyDirView));
  float view = max(0.0, dot(normalize(vViewPosition), uKeyDirView));
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * (back * 0.6 + view * view * 0.4) * ${translucency.toFixed(3)} * 0.55;
  // leaves turned by a gust flash their paler undersides
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * clamp(vGust, 0.0, 1.0) * vFlex * 0.25;
  // light gathered through each bead brightens the leaf under it, and a pin of
  // the lamp shines on its shoulder towards the lamp
  vec3 keyW = (vec4(uKeyDirView, 0.0) * viewMatrix).xyz;
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * (1.0 - smoothstep(0.15, 0.75, beadR)) * bead.w * 0.3;
  totalEmissiveRadiance += uKeyColor * bead.w * (1.0 - smoothstep(0.0, 0.26, length(bead.xyz - keyW * 0.4))) * 1.1;
}`);
  };
  material.customProgramCacheKey = () => `foliage13-${opts.key}`;
}
