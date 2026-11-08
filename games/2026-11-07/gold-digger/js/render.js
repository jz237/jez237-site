// Rendering: the cave (cavemesh.js), its dressing (ladders, ropes, planks, water, lava, gates, rubble, decor),
// creatures, the digger and the bosses, danger telegraphs, effects and the HDR post chain.
// Lights are a FIXED set (helmet spot with shadows, a fill, a hemisphere and a pool of point lights that are
// re-aimed every frame at the nearest flares, fires, lanterns, crystals and lava): their number never changes,
// so no material ever recompiles mid-game.
import * as THREE from '../vendor/three.module.min.js';
import { T, SOLID, PHYS, TOOLS, GEMS, BIOMES, variantOf } from './config.js?v=18';
import { Cave, rockMaterial } from './cavemesh.js?v=18';
import { rockTextures, spriteTextures, waterTextures } from './textures.js?v=18';
import { FX, CALM } from './fx.js?v=18';
import { Post } from './post.js?v=18';
import * as MD from './models.js?v=18';
import { buildDecor, bake } from './decor.js?v=18';
import { Digger, loadDiggerAsset } from './digger.js?v=18';
import { buildDetail } from './detail.js?v=18';
import { buildLiving } from './living.js?v=18';

export function pickQuality(name) {
  const mobile = matchMedia('(pointer:coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const tiers = {
    high: { name: 'high', dpr: Math.min(devicePixelRatio || 1, 2), shadow: 2048, msaa: true, bloomLevels: 5, dust: 2200, sparks: 1600, debris: 160, lights: 8, decor: 1 },
    medium: { name: 'medium', dpr: Math.min(devicePixelRatio || 1, 1.6), shadow: 1536, msaa: true, bloomLevels: 4, dust: 1400, sparks: 1000, debris: 110, lights: 7, decor: 0.8 },
    low: { name: 'low', dpr: 1, shadow: 1024, msaa: false, bloomLevels: 3, dust: 700, sparks: 500, debris: 60, lights: 5, decor: 0.5 },
  };
  return tiers[name] || (mobile ? tiers.medium : tiers.high);
}

// ------------------------------------------------------------------ biome looks
export const LOOKS = [
  { key: 'copper', rock: [0.36, 0.28, 0.21], rock2: [0.29, 0.25, 0.22], front: [0.09, 0.075, 0.065], rubble: [0.58, 0.47, 0.34], fog: [0.05, 0.036, 0.026], fogD: 0.018,
    hemiS: [0.13, 0.1, 0.075], hemiG: [0.035, 0.025, 0.018], dust: [0.78, 0.64, 0.46], partAmb: [0.09, 0.07, 0.05], wet: 0.04, goldDust: 0.3, glow: [1, 0.45, 0.12],
    lamp: 0xffd6a0, accent: [1.0, 0.62, 0.28], exposure: 1.3, bloom: 0.75, gemTint: [0.7, 0.3, 0.25], tint: [1.03, 1.0, 0.95] },
  { key: 'glow', rock: [0.17, 0.2, 0.23], rock2: [0.21, 0.21, 0.25], front: [0.045, 0.06, 0.07], rubble: [0.3, 0.34, 0.34], fog: [0.008, 0.036, 0.042], fogD: 0.02,
    hemiS: [0.04, 0.11, 0.12], hemiG: [0.01, 0.03, 0.03], dust: [0.45, 0.78, 0.7], partAmb: [0.03, 0.08, 0.08], wet: 0.12, moss: 1, mossCol: [0.07, 0.3, 0.24], mossGlow: 0.4, glow: [0.15, 0.95, 0.78],
    lamp: 0xffe2bc, accent: [0.25, 1.0, 0.85], exposure: 1.35, bloom: 0.95, gemTint: [0.2, 0.6, 0.55], tint: [0.95, 1.02, 1.04] },
  { key: 'geode', rock: [0.25, 0.21, 0.29], rock2: [0.31, 0.27, 0.35], front: [0.07, 0.05, 0.09], rubble: [0.42, 0.38, 0.46], fog: [0.032, 0.016, 0.052], fogD: 0.019,
    hemiS: [0.09, 0.06, 0.14], hemiG: [0.025, 0.015, 0.035], dust: [0.75, 0.66, 0.95], partAmb: [0.07, 0.05, 0.1], wet: 0.06, glow: [0.75, 0.45, 1.0],
    lamp: 0xffe6d0, accent: [0.75, 0.45, 1.0], exposure: 1.32, bloom: 1.0, gemTint: [0.6, 0.35, 0.9], tint: [1.0, 0.98, 1.05] },
  { key: 'drowned', rock: [0.21, 0.26, 0.25], rock2: [0.26, 0.29, 0.27], front: [0.045, 0.065, 0.065], rubble: [0.36, 0.4, 0.37], fog: [0.01, 0.032, 0.038], fogD: 0.021,
    hemiS: [0.05, 0.1, 0.11], hemiG: [0.012, 0.028, 0.03], dust: [0.55, 0.72, 0.78], partAmb: [0.04, 0.07, 0.08], wet: 0.5, moss: 0.75, mossCol: [0.1, 0.26, 0.16], mossGlow: 0.1, glow: [0.3, 0.9, 1.0],
    lamp: 0xffe4c4, accent: [0.4, 0.85, 1.0], exposure: 1.32, bloom: 0.85, gemTint: [0.25, 0.55, 0.7], tint: [0.96, 1.01, 1.05] },
  { key: 'ember', rock: [0.14, 0.115, 0.105], rock2: [0.19, 0.135, 0.11], front: [0.035, 0.025, 0.022], rubble: [0.3, 0.22, 0.18], fog: [0.07, 0.02, 0.008], fogD: 0.018,
    hemiS: [0.16, 0.06, 0.025], hemiG: [0.05, 0.015, 0.005], dust: [0.62, 0.46, 0.4], partAmb: [0.12, 0.05, 0.03], wet: 0.0, cracks: 0.85, glow: [1.0, 0.33, 0.06],
    lamp: 0xffdcb0, accent: [1.0, 0.42, 0.12], exposure: 1.25, bloom: 1.1, gemTint: [0.9, 0.3, 0.15], tint: [1.05, 0.98, 0.94] },
];
// every level of a depth has its own look: the first is the depth's own (LOOKS), these are the second and third.
// Besides colours: crust (settled on ledges) and stain (streaks down the walls) feed the rock shader, roughK makes it
// glossy, shape changes the cave (back: how deep the hollows go, jag: how rough, cols: stone columns behind the play
// plane), and set picks the props, particles and falls in decor.js.
export const VARIANTS = [
  [null,
    { set: 'rust', rock: [0.31, 0.22, 0.17], rock2: [0.25, 0.2, 0.17], front: [0.08, 0.05, 0.04], rubble: [0.6, 0.34, 0.2], fog: [0.06, 0.022, 0.012], fogD: 0.02,
      hemiS: [0.14, 0.08, 0.05], hemiG: [0.04, 0.018, 0.012], dust: [0.86, 0.5, 0.3], partAmb: [0.1, 0.05, 0.03], glow: [1, 0.32, 0.08], accent: [1, 0.45, 0.2],
      stain: [0.62, 0.2, 0.05], stainA: 0.95, strata: 1.25, spark: [0.65, 0.32, 0.14], goldDust: 0.15, exposure: 1.28, bloom: 0.8, tint: [1.05, 0.96, 0.9], shape: { jag: 1.5, back: 0.85, style: 'strata' } },
    { set: 'patina', rock: [0.24, 0.23, 0.21], rock2: [0.19, 0.21, 0.2], front: [0.05, 0.06, 0.06], rubble: [0.44, 0.44, 0.4], fog: [0.012, 0.03, 0.028], fogD: 0.022,
      hemiS: [0.05, 0.1, 0.09], hemiG: [0.014, 0.03, 0.025], dust: [0.55, 0.78, 0.7], partAmb: [0.04, 0.07, 0.065], glow: [0.3, 1, 0.75], accent: [0.35, 0.95, 0.75],
      stain: [0.1, 0.5, 0.38], stainA: 0.9, crust: [0.3, 0.62, 0.55], crustA: 0.3, wet: 0.3, caus: [0.05, 0.17, 0.14], spark: [0.3, 0.62, 0.5], goldDust: 0.1,
      exposure: 1.33, bloom: 0.85, tint: [0.96, 1.02, 1.0], shape: { jag: 0.65, back: 1.25, style: 'scallop' } },
  ],
  [null,
    { set: 'bluecap', rock: [0.12, 0.14, 0.22], rock2: [0.16, 0.16, 0.27], front: [0.03, 0.035, 0.07], rubble: [0.26, 0.28, 0.38], fog: [0.008, 0.012, 0.05], fogD: 0.022,
      hemiS: [0.04, 0.05, 0.15], hemiG: [0.01, 0.012, 0.035], dust: [0.5, 0.6, 0.95], partAmb: [0.03, 0.04, 0.1], wet: 0.15, moss: 0.6, mossCol: [0.1, 0.13, 0.35], mossGlow: 0.55,
      glow: [0.3, 0.5, 1], accent: [0.35, 0.55, 1], spark: [0.3, 0.4, 0.85], caus: [0.06, 0.1, 0.26], strata: 0.5, exposure: 1.36, bloom: 1.05, tint: [0.95, 0.98, 1.06], shape: { back: 1.2, style: 'flow' } },
    { set: 'roots', rock: [0.26, 0.2, 0.15], rock2: [0.22, 0.19, 0.15], front: [0.07, 0.055, 0.04], rubble: [0.45, 0.36, 0.26], fog: [0.035, 0.025, 0.012], fogD: 0.016,
      hemiS: [0.12, 0.09, 0.05], hemiG: [0.03, 0.022, 0.012], dust: [0.95, 0.8, 0.45], partAmb: [0.09, 0.07, 0.04], wet: 0.05, moss: 0.9, mossCol: [0.2, 0.3, 0.08], mossGlow: 0.2,
      glow: [1, 0.68, 0.2], accent: [1, 0.72, 0.3], spark: [0.6, 0.5, 0.2], caus: [0.03, 0.03, 0.01], strata: 0.8, exposure: 1.3, bloom: 0.9, tint: [1.04, 1.0, 0.93], shape: { back: 1.6, jag: 1.1, style: 'scallop' } },
  ],
  [null,
    { set: 'frost', rock: [0.3, 0.34, 0.4], rock2: [0.38, 0.42, 0.48], front: [0.06, 0.07, 0.09], rubble: [0.6, 0.65, 0.72], fog: [0.02, 0.035, 0.06], fogD: 0.02,
      hemiS: [0.08, 0.11, 0.16], hemiG: [0.02, 0.03, 0.045], dust: [0.85, 0.92, 1], partAmb: [0.07, 0.08, 0.11], glow: [0.5, 0.85, 1], accent: [0.55, 0.85, 1],
      crust: [0.78, 0.86, 0.96], crustA: 0.6, stain: [0.72, 0.82, 0.92], stainA: 0.35, roughK: 0.6, spark: [0.8, 0.9, 1], strata: 0.35, gemTint: [0.4, 0.6, 0.9],
      exposure: 1.1, bloom: 1.0, tint: [0.97, 1.0, 1.06], shape: { jag: 1.25, style: 'facet' } },
    { set: 'rose', rock: [0.3, 0.21, 0.21], rock2: [0.36, 0.26, 0.24], front: [0.08, 0.05, 0.05], rubble: [0.5, 0.4, 0.38], fog: [0.05, 0.018, 0.03], fogD: 0.019,
      hemiS: [0.14, 0.07, 0.09], hemiG: [0.035, 0.016, 0.02], dust: [1, 0.75, 0.8], partAmb: [0.1, 0.06, 0.07], glow: [1, 0.5, 0.7], accent: [1, 0.55, 0.7],
      stain: [0.75, 0.48, 0.2], stainA: 0.35, strata: 1.15, spark: [1, 0.7, 0.6], gemTint: [0.9, 0.4, 0.5], exposure: 1.3, bloom: 1.0, tint: [1.04, 0.98, 1.0], shape: { back: 1.35, style: 'strata' } },
  ],
  [null,
    { set: 'salt', rock: [0.4, 0.37, 0.31], rock2: [0.47, 0.44, 0.38], front: [0.09, 0.085, 0.075], rubble: [0.62, 0.58, 0.5], fog: [0.035, 0.04, 0.04], fogD: 0.019,
      hemiS: [0.12, 0.13, 0.12], hemiG: [0.03, 0.032, 0.03], dust: [0.9, 0.9, 0.85], partAmb: [0.08, 0.085, 0.08], wet: 0.25, moss: 0, glow: [0.4, 0.95, 0.9], accent: [0.45, 0.95, 0.9],
      crust: [0.84, 0.82, 0.76], crustA: 0.7, stain: [0.86, 0.84, 0.77], stainA: 0.5, caus: [0.12, 0.25, 0.25], strata: 0.9, spark: [0.7, 0.75, 0.75],
      exposure: 0.98, bloom: 0.8, tint: [1.0, 1.0, 0.98], shape: { back: 1.35, cols: 0.8, colR: 0.85, style: 'strata' } },
    { set: 'tide', rock: [0.1, 0.14, 0.16], rock2: [0.12, 0.17, 0.2], front: [0.025, 0.04, 0.05], rubble: [0.25, 0.3, 0.32], fog: [0.004, 0.02, 0.035], fogD: 0.024,
      hemiS: [0.02, 0.06, 0.09], hemiG: [0.005, 0.015, 0.025], dust: [0.4, 0.8, 0.95], partAmb: [0.02, 0.06, 0.08], wet: 0.7, moss: 0.8, mossCol: [0.05, 0.28, 0.28], mossGlow: 0.6,
      glow: [0.2, 0.9, 1], accent: [0.3, 0.9, 1], caus: [0.2, 0.42, 0.5], spark: [0.3, 0.7, 0.9], strata: 0.5, exposure: 1.4, bloom: 1.15, tint: [0.95, 1.01, 1.05], shape: { jag: 0.75, back: 1.3, style: 'flow' } },
  ],
  [null,
    { set: 'obsidian', rock: [0.065, 0.05, 0.075], rock2: [0.1, 0.07, 0.11], front: [0.02, 0.015, 0.025], rubble: [0.2, 0.15, 0.2], fog: [0.04, 0.012, 0.03], fogD: 0.018,
      hemiS: [0.12, 0.05, 0.12], hemiG: [0.035, 0.012, 0.03], dust: [0.7, 0.45, 0.75], partAmb: [0.1, 0.04, 0.09], cracks: 0.6, glow: [1, 0.2, 0.45], accent: [1, 0.3, 0.55],
      roughK: 0.35, spark: [0.8, 0.4, 0.9], strata: 0.3, gemTint: [0.7, 0.25, 0.6], exposure: 1.35, bloom: 1.15, tint: [1.02, 0.96, 1.03], shape: { jag: 1.4, back: 1.1, style: 'facet' } },
    { set: 'sulfur', rock: [0.22, 0.2, 0.15], rock2: [0.18, 0.17, 0.13], front: [0.06, 0.055, 0.035], rubble: [0.42, 0.38, 0.24], fog: [0.04, 0.036, 0.014], fogD: 0.022,
      hemiS: [0.1, 0.095, 0.06], hemiG: [0.03, 0.028, 0.014], dust: [0.9, 0.86, 0.5], partAmb: [0.1, 0.09, 0.04], cracks: 0.35, glow: [1, 0.55, 0.1], accent: [1, 0.85, 0.3],
      crust: [0.85, 0.72, 0.2], crustA: 0.38, stain: [0.62, 0.52, 0.14], stainA: 0.4, spark: [0.9, 0.8, 0.3], strata: 0.7, exposure: 1.18, bloom: 0.95, tint: [1.0, 1.0, 0.95], shape: { back: 1.15, style: 'strata' } },
  ],
];
// the rock shader's per-depth extras (each variant may override)
const ROCKFX = { caus: [[0.05, 0.05, 0.04], [0.08, 0.22, 0.2], [0.05, 0.05, 0.04], [0.13, 0.26, 0.3], [0, 0, 0]], strata: [1, 0.6, 0.45, 0.55, 0.85],
  spark: [[0.55, 0.42, 0.22], [0.25, 0.5, 0.45], [0.85, 0.7, 1.0], [0.35, 0.45, 0.5], [0.7, 0.28, 0.08]] };
// endless strata: the level's look with a hue twist so every stratum looks new
function strataLook(i, n, vi = 0) {
  const v = (VARIANTS[i] || [])[vi];
  const b = v ? { ...LOOKS[i], ...v } : LOOKS[i];
  if (!n) return b;
  const rot = ((n * 0.37) % 1) * 0.5 - 0.25, sat = 0.85 + (n % 3) * 0.12;
  const tw = (c) => { const col = new THREE.Color().fromArray(c); const hsl = {}; col.getHSL(hsl); col.setHSL((hsl.h + rot + 1) % 1, Math.min(1, hsl.s * sat), hsl.l); return col.toArray(); };
  const o = { ...b };
  for (const k of ['rock', 'rock2', 'front', 'rubble', 'fog', 'hemiS', 'hemiG', 'dust', 'glow', 'accent', 'mossCol', 'crust', 'stain', 'caus', 'spark']) if (b[k]) o[k] = tw(b[k]);
  return o;
}

const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpC = new THREE.Color();
const BEAM_DOWN = new THREE.Vector3(0, -1, 0);
const BEAM_VERT = `varying float vT; varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vL;
void main(){ vT = uv.y; vL = position.xy; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mv = viewMatrix * w; vV = -mv.xyz; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }`;
const SHAFT_VERT = `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const SHAFT_FRAG = `uniform float uT; uniform float uI; varying vec2 vUv; varying vec3 vW;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  float x = abs(vUv.x - 0.5) * 2.0;
  float side = pow(max(0.0, 1.0 - x * x), 3.0);
  float up = smoothstep(0.0, 0.06, vUv.y) * pow(max(0.0, 1.0 - vUv.y), 1.3);
  float dust = 0.65 + 0.45 * n(vec2(vW.x * 3.0, vW.y * 1.4 - uT * 0.35)) + 0.2 * n(vec2(vW.x * 9.0, vW.y * 4.0 - uT * 0.8));
  gl_FragColor = vec4(1.0, 0.8, 0.48, uI * side * up * dust);
}`;
const BEAM_FRAG = `uniform vec3 uCol; uniform float uI; uniform float uT; varying float vT; varying vec3 vN; varying vec3 vV; varying vec3 vW; varying vec2 vL;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  float along = clamp(1.0 - vT, 0.0, 1.0);
  float across = clamp(vL.x / max(0.0001, -vL.y), -1.0, 1.0);
  float soft = pow(1.0 - across * across, 2.5);
  float rest = 1.0 - along;
  float fade = smoothstep(0.0, 0.3, along) * rest * rest;
  float dust = 0.6 + 0.55 * n(vW.xy * 2.2 + vec2(uT * 0.21, uT * 0.13)) + 0.25 * n(vW.xy * 7.0 - vec2(uT * 0.4, -uT * 0.25));
  gl_FragColor = vec4(uCol, uI * soft * fade * dust);
}`;
const lerp = (a, b, t) => a + (b - a) * t;
const obj = (x) => (x && x.group) ? x.group : x;
const has = (n) => typeof MD[n] === 'function';
function make(name, ...a) {
  if (has(name)) { try { const r = MD[name](...a), o = obj(r); if (o && o.userData) o.userData.kind = name; return r; } catch (e) { console.warn('model', name, e); } }
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0xff00ff }));
  return { group: m };
}

// ------------------------------------------------------------------ zone (telegraph) material
const ZVERT = `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const ZFRAG = `uniform vec3 uCol; uniform float uA; uniform float uT; uniform float uShape; uniform float uLive;
varying vec2 vUv; varying vec3 vW;
void main(){
  vec2 p = vUv - 0.5;
  float a;
  if (uShape < 0.5) {
    // a band: soft edges, moving hazard stripes
    float edge = smoothstep(0.5, 0.42, abs(p.x)) * smoothstep(0.5, 0.36, abs(p.y));
    float stripe = 0.55 + 0.45 * step(0.5, fract((vW.x + vW.y) * 0.9 - uT * 1.6));
    float rim = smoothstep(0.36, 0.5, max(abs(p.x), abs(p.y)));
    a = edge * (0.35 * stripe + rim * 0.9);
  } else {
    float r = length(p) * 2.0;
    float ring = smoothstep(1.0, 0.88, r) * smoothstep(0.62, 0.86, r);
    float fill = smoothstep(1.0, 0.0, r) * 0.35;
    float pulse = 0.6 + 0.4 * sin(uT * 10.0);
    a = ring * pulse + fill;
  }
  gl_FragColor = vec4(uCol * (1.0 + uLive * 2.5), a * uA);
}`;

export class Renderer {
  constructor(canvas, q) {
    this.q = q; this.canvas = canvas;
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.setPixelRatio(q.dpr);
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.outputColorSpace = THREE.LinearSRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
    this.r = r; this.scale = 1;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.3, 160);
    this.camera.position.set(0, 5, 16);
    this.post = new Post(r, q);
    this.tex = { ...spriteTextures(), rock: rockTextures(512, 7), water: waterTextures(256) };
    this.look = LOOKS[0];
    this.rockMat = rockMaterial(this.tex.rock, this.look);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.03);
    // the fixed light rig
    this.hemi = new THREE.HemisphereLight(0x332820, 0x0a0806, 2.6); this.scene.add(this.hemi);
    this.lamp = new THREE.SpotLight(0xffd6a0, 100, 30, 0.72, 0.6, 1.15);
    this.lamp.castShadow = true; this.lamp.shadow.mapSize.set(q.shadow, q.shadow); this.lamp.shadow.bias = -0.0004; this.lamp.shadow.normalBias = 0.03; this.lamp.shadow.camera.near = 0.2; this.lamp.shadow.camera.far = 34;
    this.scene.add(this.lamp, this.lamp.target);
    {
      const g = new THREE.ConeGeometry(1, 1, 28, 1, true); g.translate(0, -0.5, 0);
      this.beam = new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: BEAM_VERT, fragmentShader: BEAM_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        uniforms: { uCol: { value: new THREE.Color(1, 0.85, 0.62) }, uI: { value: 0 }, uT: { value: 0 } } }));
      this.beam.frustumCulled = false; this.beam.renderOrder = 4; this.beamI = 0; this.scene.add(this.beam);
      // a soft contact shadow under the digger's boots
      this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.tex.glow, color: 0x000000, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      this.blob.rotation.x = -Math.PI / 2; this.blob.renderOrder = 1; this.blob.visible = false; this.scene.add(this.blob);
    }
    this.fill = new THREE.PointLight(0xffc890, 14, 16, 1.4); this.scene.add(this.fill);
    this.pool = [];
    for (let i = 0; i < q.lights; i++) { const l = new THREE.PointLight(0xffa060, 0, 14, 2.0); this.scene.add(l); this.pool.push({ l, key: null, target: 0 }); }
    this.flashes = [];
    for (let i = 0; i < 2; i++) { const l = new THREE.PointLight(0xffa060, 0, 18, 1.6); this.scene.add(l); this.flashes.push({ l, t: 0, max: 1, i0: 0 }); }
    this.fi = 0;
    this.fx = new FX(this.scene, this.tex, q, (x, y) => this.solidAt(x, y), (x, y, z, i, c, d, rng) => this.flash(x, y, z, i, c, d, rng));
    this.level = new THREE.Group(); this.scene.add(this.level);
    this.views = new Map();
    this.zoneMeshes = [];
    this.zoneMat = new THREE.ShaderMaterial({ vertexShader: ZVERT, fragmentShader: ZFRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uCol: { value: new THREE.Color(1, 0.6, 0.2) }, uA: { value: 1 }, uT: { value: 0 }, uShape: { value: 0 }, uLive: { value: 0 } } });
    this.cam = { x: 0, y: 0, d: 16, tx: 0, ty: 0, shake: 0, kick: 0, cine: null, fov: 38 };
    this.time = 0; this.shocks = [];
    this.flashScreen = new THREE.Vector4(1, 1, 1, 0);
    this.player = null;
    this.digGltf = null;
    this.emitters = [];
    this.view = { reduced: false, shake: 1 };
  }

  resize(w, h) {
    this.w = w; this.h = h;
    this.r.setSize(w, h, false);
    const pr = this.r.getPixelRatio();
    this.post.setSize(Math.round(w * pr), Math.round(h * pr));
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    for (const P of [this.fx.dustP, this.fx.fireP, this.fx.glintP]) P.mat.uniforms.uScale.value = h * pr * 0.9;
  }
  setScale(s) { this.scale = s; this.r.setPixelRatio(this.q.dpr * s); this.resize(this.w, this.h); }

  solidAt(x, y) { const M = this.M; if (!M) return false; const tx = Math.floor(x), ty = Math.floor(y); if (tx < 0 || ty < 0 || tx >= M.w || ty >= M.h) return true; return SOLID[M.tiles[ty * M.w + tx]] === 1; }
  flash(x, y, z, intensity, color, dur, range = 16) {
    const F = this.flashes[this.fi]; this.fi = (this.fi + 1) % this.flashes.length;
    F.l.position.set(x, y, z); F.l.color.set(color); F.l.distance = range; F.t = dur; F.max = dur; F.i0 = intensity;
  }

  // the realistic digger (a skinned, motion-captured body); the old built digger stands in if it fails to load
  async loadDigger() {
    try { this.digGltf = await loadDiggerAsset('assets/digger.glb?v=18'); } catch (e) { console.warn('digger asset', e); }
  }
  makePlayer() {
    if (this.digGltf) {
      const dig = new Digger(this.digGltf, MD.minerGear());
      this.player = { root: dig.root, rig: { pick: dig.pick, lampLens: dig.lampLens, lampAnchor: dig.lampAnchor }, mats: dig.mats, dig, phase: 0, swing: 0 };
      this.scene.add(dig.root);
      return;
    }
    const d = make('digger');
    this.player = { root: obj(d), rig: d.rig || {}, phase: 0, swing: 0 };
    this.player.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.scene.add(this.player.root);
    // the materials glow red when hurt: clone so only the digger flashes
    this.player.mats = [];
    this.player.root.traverse((o) => { if (o.isMesh && o.material && o.material.emissive) { o.material = o.material.clone(); this.player.mats.push(o.material); } });
  }

  // ------------------------------------------------------------------ building a level
  load(W) {
    const M = W.M; this.M = M; this.W = W;
    // clear the old level
    if (this.living) { this.living.dispose(); this.living = null; }
    for (const c of [...this.level.children]) { this.level.remove(c); c.traverse?.((o) => { if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); }
    this.views.clear(); this.emitters = [];
    this.fx.clear();
    const look = this.look = strataLook(M.biome, W.endless ? Math.floor(W.endlessN / 5) : 0, variantOf(M));
    Object.assign(this.rockMat.userData.U.uGlow.value, new THREE.Color().fromArray(look.glow));
    this.rockMat.userData.U.uMoss.value.fromArray(look.mossCol || [0.1, 0.3, 0.2]);
    const RU = this.rockMat.userData.U, b5 = M.biome % 5;
    RU.uCaus.value.fromArray(look.caus || ROCKFX.caus[b5]);
    RU.uStrata.value = look.strata ?? ROCKFX.strata[b5];
    RU.uSpark.value.fromArray(look.spark || ROCKFX.spark[b5]);
    RU.uCrust.value.fromArray(look.crust || [1, 1, 1]); RU.uCrustA.value = look.crustA || 0;
    RU.uStain.value.fromArray(look.stain || [0, 0, 0]); RU.uStainA.value = look.stainA || 0;
    RU.uRoughK.value = look.roughK || 1;
    this.scene.fog.color.fromArray(look.fog); this.scene.fog.density = look.fogD;
    this.hemi.color.fromArray(look.hemiS); this.hemi.groundColor.fromArray(look.hemiG);
    this.lamp.color.set(this.lampCol || look.lamp);
    this.fx.setLook(look);
    this.r.setClearColor(new THREE.Color().fromArray(look.fog), 1);
    // the rock
    this.cave = new Cave(M, look, this.rockMat, { fine: this.q.name === 'high' });
    this.level.add(this.cave.group);
    this.buildDressing(W);
    // decorations and set pieces (decor.js), with their light emitters
    const D = buildDecor(M, look, W, { make, obj, tex: this.tex, q: this.q, cave: this.cave });
    this.level.add(D.group);
    this.emitters.push(...D.emitters);
    this.decor = D;
    // the small stuff: pebbles, rubble, boulders, ledges, drips, clutter and hanging growth (detail.js)
    this.detail = buildDetail(M, look, W, { make, obj, q: this.q, cave: this.cave, rockMat: this.rockMat });
    this.level.add(this.detail.group);
    // the living cave: growth that bends as you push through, glow that wakes as you pass, things to kick and break (living.js)
    this.living = buildLiving(M, look, W, { cave: this.cave, q: this.q, fx: this.fx, solidAt: (x, y) => this.solidAt(x, y), sfx: (n, o) => { if (this.sfx) this.sfx(n, o); } });
    this.level.add(this.living.group);
    // the digger
    if (!this.player) this.makePlayer();
    if (this.loadout) this.setLoadout(this.loadout);
    // the lift cages
    this.startCage = obj(make('cage')); this.level.add(this.startCage);
    const winch = obj(make('winch')); winch.position.set(M.start.x, M.h + 0.5, -0.8); this.level.add(winch);
    if (M.exit) { this.exitCage = obj(make('cage')); this.level.add(this.exitCage); } else this.exitCage = null;
    // boss
    this.boss = null;
    if (W.boss) this.buildBoss(W.boss.kind);
    // camera snaps
    const P = W.players[0];
    this.cam.x = this.cam.tx = P.x; this.cam.y = this.cam.ty = P.y + 1.2; this.cam.cine = null;
    this.trail = [];
    this.shocks.length = 0;
  }

  buildDressing(W) {
    const M = W.M, look = this.look;
    const G = new THREE.Group(); this.level.add(G);
    const wood = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0 });
    const iron = new THREE.MeshStandardMaterial({ color: 0x3a3836, roughness: 0.55, metalness: 0.85 });
    const rope = new THREE.MeshStandardMaterial({ color: 0x8a7350, roughness: 0.95 });
    const at = (x, y) => (x < 0 || y < 0 || x >= M.w || y >= M.h) ? T.ROCK : M.tiles[y * M.w + x];
    // merged boxes helper
    const parts = { pos: [], nrm: [], col: [], idx: [] };
    const box = (cx, cy, cz, sx, sy, sz, c, rz = 0) => {
      const g = new THREE.BoxGeometry(sx, sy, sz);
      if (rz) g.rotateZ(rz);
      g.translate(cx, cy, cz);
      const base = parts.pos.length / 3, p = g.attributes.position, n = g.attributes.normal;
      for (let i = 0; i < p.count; i++) { parts.pos.push(p.getX(i), p.getY(i), p.getZ(i)); parts.nrm.push(n.getX(i), n.getY(i), n.getZ(i)); const v = 0.85 + Math.random() * 0.3; parts.col.push(c[0] * v, c[1] * v, c[2] * v); }
      for (const k of g.index.array) parts.idx.push(base + k);
      g.dispose();
    };
    const woodC = [0.36, 0.25, 0.15], darkWood = [0.24, 0.17, 0.1];
    // ladders: two rails and a rung per cell
    for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) {
      const t = at(x, y);
      if (t === T.LADDER) {
        const top = at(x, y + 1) !== T.LADDER;
        box(x + 0.18, y + 0.5 + (top ? 0.12 : 0), 0.05, 0.075, top ? 1.24 : 1.0, 0.075, woodC);
        box(x + 0.82, y + 0.5 + (top ? 0.12 : 0), 0.05, 0.075, top ? 1.24 : 1.0, 0.075, woodC);
        box(x + 0.5, y + 0.25, 0.05, 0.62, 0.05, 0.05, darkWood); box(x + 0.5, y + 0.75, 0.05, 0.62, 0.05, 0.05, darkWood);
      } else if (t === T.PLANK) {
        box(x + 0.5, y + 0.93, 0.35, 1.02, 0.1, 0.42, woodC); box(x + 0.5, y + 0.93, -0.2, 1.02, 0.1, 0.42, [0.32, 0.22, 0.13]);
        box(x + 0.5, y + 0.84, 0.95, 1.02, 0.08, 0.12, darkWood);
        if (at(x - 1, y) !== T.PLANK || at(x + 1, y) !== T.PLANK) { const sx = at(x - 1, y) !== T.PLANK ? x + 0.12 : x + 0.88; box(sx, y + 0.45, 0.6, 0.1, 0.9, 0.1, darkWood); box(sx, y + 0.45, -0.5, 0.1, 0.9, 0.1, darkWood); }
      }
    }
    if (parts.idx.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(parts.pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(parts.nrm, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(parts.col, 3));
      g.setIndex(parts.idx);
      const m = new THREE.Mesh(g, wood); m.castShadow = true; m.receiveShadow = true; G.add(m);
    }
    // ropes: one tube per column of rope cells, knotted, hanging from the rock
    for (let x = 0; x < M.w; x++) {
      let y = M.h - 1;
      while (y >= 0) {
        if (at(x, y) !== T.ROPE) { y--; continue; }
        const y1 = y + 1; while (y >= 0 && (at(x, y) === T.ROPE || at(x, y) === T.LADDER)) y--;
        const y0 = y + 1;
        const pts = []; for (let k = 0; k <= 12; k++) { const f = k / 12; pts.push(new THREE.Vector3(x + 0.5 + Math.sin(f * 7 + x) * 0.03, lerp(y1, y0 + 0.2, f), 0.05 + Math.sin(f * 5) * 0.03)); }
        const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.04, 6), rope); tube.castShadow = true; G.add(tube);
        for (let k = y0 + 0.6; k < y1; k += 0.9) { const kn = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), rope); kn.position.set(x + 0.5, k, 0.05); kn.scale.y = 0.7; G.add(kn); }
      }
    }
    // spikes: a few sharp stalagmites per cell
    const spikeCells = [];
    for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) if (at(x, y) === T.SPIKES) spikeCells.push([x, y]);
    if (spikeCells.length) {
      const sg = new THREE.ConeGeometry(0.11, 1, 6); sg.translate(0, 0.5, 0);
      const sm = new THREE.MeshStandardMaterial({ color: new THREE.Color().fromArray(look.rock2).multiplyScalar(1.6), roughness: 0.6, metalness: 0.1 });
      const im = new THREE.InstancedMesh(sg, sm, spikeCells.length * 5);
      const m4 = new THREE.Matrix4(); let n = 0;
      for (const [x, y] of spikeCells) for (let k = 0; k < 5; k++) {
        const h = 0.35 + Math.random() * 0.35;
        m4.compose(tmpV.set(x + 0.12 + k * 0.19, y, (Math.random() - 0.5) * 1.6), new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.3)), tmpV2.set(1, h, 1));
        im.setMatrixAt(n++, m4);
      }
      im.castShadow = true; im.receiveShadow = true; G.add(im);
    }
    // water and lava: a surface strip per run, and a translucent front so you can see in
    const waterMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.05, 0.16, 0.18), roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.38, normalMap: this.tex.water.nrm, normalScale: new THREE.Vector2(0.45, 0.45), depthWrite: false });
    this.tex.water.nrm.repeat.set(0.35, 0.35);
    // the body of the water seen through its camera-side face: clear at the top, deep and dark below
    const vol = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, vertexShader: ZVERT,
      uniforms: { uCol: { value: new THREE.Color().fromArray(look.accent).multiplyScalar(0.12) } },
      fragmentShader: `uniform vec3 uCol; uniform float uT; varying vec2 vUv; varying vec3 vW;
        void main(){
          float d = 1.0 - vUv.y;
          float side = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
          float rip = 0.5 + 0.5 * sin(vW.x * 2.3 + uT * 1.7 + sin(vW.y * 3.1 - uT) * 1.5);
          float band = smoothstep(0.75, 1.0, vUv.y) * (0.35 + 0.65 * rip);
          vec3 c = mix(uCol * 2.2, uCol * 0.18, d) + uCol * band * 3.0;
          gl_FragColor = vec4(c, (0.1 + d * 0.32 + band * 0.12) * side);
        }` });
    vol.uniforms.uT = { value: 0 }; this.waterVol = vol;
    const lavaMat = this.lavaMat = new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 } }, vertexShader: ZVERT,
      fragmentShader: `uniform float uT; varying vec2 vUv; varying vec3 vW;
        float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
        void main(){ vec2 p = vW.xz * 0.8 + vec2(uT * 0.12, uT * 0.05); float a = n(p) * 0.6 + n(p * 2.3 - uT * 0.2) * 0.4;
          float crust = smoothstep(0.45, 0.62, a); vec3 hot = mix(vec3(4.0, 1.1, 0.15), vec3(1.6, 0.25, 0.03), a);
          vec3 c = mix(hot, vec3(0.05, 0.02, 0.015), crust * 0.85); gl_FragColor = vec4(c, 1.0); }` });
    for (const [kind, mat] of [[T.WATER, waterMat], [T.LAVA, lavaMat]]) {
      for (let y = 0; y < M.h; y++) {
        let x = 0;
        while (x < M.w) {
          if (at(x, y) !== kind || at(x, y + 1) === kind) { x++; continue; }
          const x0 = x; while (x < M.w && at(x, y) === kind && at(x, y + 1) !== kind) x++;
          const top = kind === T.WATER ? y + 0.92 : y + 0.75;
          const surf = new THREE.Mesh(new THREE.PlaneGeometry(x - x0, kind === T.WATER ? 4.3 : 5.5), mat);
          surf.rotation.x = -Math.PI / 2; surf.position.set((x0 + x) / 2, top, kind === T.WATER ? -0.25 : -0.6); surf.receiveShadow = true; surf.renderOrder = 2;
          G.add(surf);
          // depth of the body under this run
          let yb = y; while (yb > 0 && at(x0, yb - 1) === kind) yb--;
          if (kind === T.WATER) {
            const front = new THREE.Mesh(new THREE.PlaneGeometry(x - x0, top - yb), vol); front.position.set((x0 + x) / 2, (top + yb) / 2, 1.9); front.renderOrder = 1; G.add(front);
            this.emitters.push({ x: (x0 + x) / 2, y: top - 0.3, z: 0, col: look.accent, int: 0.0, pri: 0 });
          } else {
            this.emitters.push({ x: (x0 + x) / 2, y: top + 0.6, z: 0.4, col: [1, 0.35, 0.08], int: 9 + (x - x0) * 1.5, pri: 2, flick: 1, range: 10 });
            const glow = new THREE.Mesh(new THREE.PlaneGeometry(x - x0, 2.5), new THREE.MeshBasicMaterial({ map: this.tex.glow, color: 0xff5a10, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
            glow.position.set((x0 + x) / 2, top + 0.6, 1.2); G.add(glow);
          }
        }
      }
    }
    this.waterMat = waterMat;
    // locked gates
    this.gates = [];
    for (const d of M.keyDoors) {
      const g = new THREE.Group();
      for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.1, 8), iron); b.position.set(0.12 + i * 0.19, 2.05, 0.2); b.castShadow = true; g.add(b); }
      for (const yy of [0.4, 2.0, 3.7]) { const b = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 0.08), iron); b.position.set(0.5, yy, 0.2); g.add(b); }
      const lock = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.14), new THREE.MeshStandardMaterial({ color: 0x8a6a2a, metalness: 0.9, roughness: 0.35 }));
      lock.position.set(0.5, 1.5, 0.32); g.add(lock);
      g.position.set(d.x, d.y0, 0); G.add(g); this.gates.push({ d, g });
    }
    // crumbling slabs and the props that say "break me"
    this.breakProps = new Map();
    // rounded, lumpy stones (a smooth sphere pushed about by low-frequency bumps, not faceted cubes)
    const chip = new THREE.IcosahedronGeometry(0.5, 3);
    { const p = chip.attributes.position, ph = [Math.random() * 6, Math.random() * 6, Math.random() * 6];
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const k = 0.82 + 0.12 * Math.sin(x * 5 + ph[0]) * Math.cos(y * 4 + ph[1]) + 0.08 * Math.sin(z * 7 + ph[2]); p.setXYZ(i, x * k, y * k * 0.78, z * k); }
      chip.computeVertexNormals(); }
    const rubbleMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().fromArray(look.rubble).multiplyScalar(0.9), roughness: 0.95 });
    const slabMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().fromArray(look.rock2).multiplyScalar(1.5), roughness: 0.85 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffc24a, metalness: 1, roughness: 0.28, emissive: 0x201000 });
    for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) {
      const t = at(x, y);
      if (t !== T.SOFT && t !== T.CRUMBLE && t !== T.VEIN && t !== T.GEMV && t !== T.HARD && t !== T.FOSSIL) continue;
      const g = new THREE.Group(); g.position.set(x, y, 0);
      // the open side(s) of the cell
      const sides = [[-1, 0], [1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => !SOLID[at(x + dx, y + dy)]);
      if (t === T.CRUMBLE) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.42, 4.4), slabMat); s.position.set(0.5, 0.79, -0.4); s.castShadow = true; s.receiveShadow = true; g.add(s);
        for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(chip, slabMat); c.position.set(0.15 + k * 0.35, 0.5, 1.6 - k * 0.3); c.scale.setScalar(0.3); g.add(c); }
      } else if (t === T.SOFT) {
        for (const [dx, dy] of sides) for (let k = 0; k < 4; k++) {
          const c = new THREE.Mesh(chip, rubbleMat);
          c.position.set(0.5 + dx * 0.55 + (dy ? (Math.random() - 0.5) * 0.8 : 0), 0.5 + dy * 0.55 + (dx ? (Math.random() - 0.5) * 0.8 : 0), (Math.random() - 0.3) * 2.2);
          c.scale.setScalar(0.28 + Math.random() * 0.22); c.rotation.set(Math.random() * 3, Math.random() * 3, 0); c.castShadow = true; g.add(c);
        }
      } else if (t === T.HARD) {
        for (const [dx, dy] of sides) if (Math.random() < 0.7) { const c = new THREE.Mesh(chip, slabMat); c.position.set(0.5 + dx * (0.3 + Math.random() * 0.25) + (dy ? (Math.random() - 0.5) * 0.6 : 0), 0.5 + dy * 0.35 + (dx ? (Math.random() - 0.5) * 0.7 : 0), (Math.random() - 0.5) * 1.6); c.scale.set(0.5 + Math.random() * 0.45, 0.45 + Math.random() * 0.4, 0.7 + Math.random() * 0.6); c.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); c.castShadow = true; g.add(c); }
      } else if (t === T.VEIN) {
        for (const [dx, dy] of sides) for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(chip, goldMat); c.position.set(0.5 + dx * 0.52 + (dy ? (Math.random() - 0.5) * 0.7 : 0), 0.5 + dy * 0.52 + (dx ? (Math.random() - 0.5) * 0.7 : 0), (Math.random() - 0.4) * 1.6); c.scale.setScalar(0.08 + Math.random() * 0.08); g.add(c); }
        this.emitters.push({ x: x + 0.5, y: y + 0.5, z: 0.6, col: [1, 0.75, 0.3], int: 0.6, pri: 0.2, glint: 1 });
      } else if (t === T.GEMV) {
        const sp = W.loot && null;
        const gi = (x * 7 + y * 13) % GEMS.length;
        for (const [dx, dy] of sides.slice(0, 1)) { const c = obj(make('crystal', 0.35, GEMS[gi].col)); c.position.set(0.5 + dx * 0.45, 0.5 + dy * 0.45, 0.3); c.rotation.z = dx ? -dx * Math.PI / 2 : dy < 0 ? Math.PI : 0; g.add(c); }
        this.emitters.push({ x: x + 0.5, y: y + 0.5, z: 0.6, col: new THREE.Color(GEMS[gi].col).toArray(), int: 1.2, pri: 0.6 });
      } else if (t === T.FOSSIL) {
        const f = obj(make('fossilSlab'));
        const [dx, dy] = sides[0] || [0, 1];
        f.position.set(0.5 + dx * 0.52, 0.5 + dy * 0.52, 0.2); f.rotation.y = dx ? dx * Math.PI / 2 : 0; if (dy) { f.rotation.x = -dy * Math.PI / 2; }
        g.add(f);
      }
      G.add(g);
      this.breakProps.set(y * M.w + x, g);
    }
  }

  // ------------------------------------------------------------------ the loadout (lamp colour, pick skin, keen eye)
  setLoadout(o) {
    this.loadout = o || {};
    this.lampCol = o && o.lampCol != null ? new THREE.Color(o.lampCol) : null;
    const pl = this.player; if (!pl) return;
    if (pl.rig.lampLens && pl.rig.lampLens.material && pl.rig.lampLens.material.emissive) pl.rig.lampLens.material.emissive.set(this.lampCol || 0xffe0b0);
    const pick = pl.rig.pick; if (!pick) return;
    let skin = null;
    if (o && o.pickMat) { const m = o.pickMat; skin = new THREE.MeshStandardMaterial({ color: m.color, metalness: m.metalness, roughness: m.roughness, emissive: m.emissive || 0x000000, emissiveIntensity: m.emissive ? 1.4 : 0 }); }
    pick.traverse((x) => {
      if (!x.isMesh) return;
      if (!x.userData.origMat) x.userData.origMat = x.material;
      const n = x.userData.origMat.name || '';
      x.material = skin && /metal|polish/.test(n) ? skin : x.userData.origMat;
    });
  }

  // ------------------------------------------------------------------ the relic museum
  // An old mine hall: one alcove per depth (three pedestals, that depth's fossils on the wall) and one for the
  // Endless Deep. Found relics turn on their pedestals under a lantern; missing ones are empty plinths.
  loadMuseum(journal, biomes) {
    if (this.living) { this.living.dispose(); this.living = null; }
    for (const c of [...this.level.children]) { this.level.remove(c); c.traverse?.((o) => { if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); }
    this.views.clear(); this.emitters = []; this.fx.clear(); this.boss = null; this.cave = null; this.M = null;
    const look = this.look = LOOKS[0];
    this.scene.fog.color.setRGB(0.035, 0.026, 0.02); this.scene.fog.density = 0.02;
    this.hemi.color.setRGB(0.16, 0.12, 0.09); this.hemi.groundColor.setRGB(0.04, 0.03, 0.02);
    this.r.setClearColor(new THREE.Color(0.035, 0.026, 0.02), 1);
    this.fx.setLook(look);
    const G = new THREE.Group(); this.level.add(G);
    const stone = new THREE.MeshStandardMaterial({ map: this.tex.rock.alb, color: 0x9a8670, roughness: 0.9 });
    this.tex.rock.alb.repeat.set(6, 2);
    const N = 6, gap = 8;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(N * gap + 16, 16), new THREE.MeshStandardMaterial({ map: this.tex.rock.alb, color: 0x6e5d4c, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set((N - 1) * gap / 2, 0, -1); floor.receiveShadow = true; G.add(floor);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(N * gap + 16, 12), stone); wall.position.set((N - 1) * gap / 2, 5, -4.6); wall.receiveShadow = true; G.add(wall);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(N * gap + 16, 16), stone); ceil.rotation.x = Math.PI / 2; ceil.position.set((N - 1) * gap / 2, 7.5, -1); G.add(ceil);
    const statics = [];
    const relicIds = [];
    const alcoves = [];
    for (let i = 0; i < N; i++) {
      const ax = i * gap;
      const frame = obj(make('timberFrame', 7.4, 7)); frame.position.set(ax, 0, -3.3); statics.push(frame);
      const slots = [];
      let ids;
      if (i < 5) ids = [i * 3, i * 3 + 1, i * 3 + 2];
      else ids = journal.endless.filter((e) => e.kind === 'relic').slice(-3).map((e) => e.id);
      while (ids.length < 3) ids.push(-1);
      ids.forEach((id, k) => {
        const px = ax + (k - 1) * 2.3;
        const ped = obj(make('pedestal')); ped.position.set(px, 0, -2.2); statics.push(ped);
        const found = id >= 0 && (id >= 100 ? journal.endless.some((e) => e.kind === 'relic' && e.id === id) : journal.relic.includes(id));
        let rel = null;
        if (found) { rel = obj(make('relic', id)); rel.position.set(px, 1.05, -2.2); rel.scale.multiplyScalar(1.6); G.add(rel); }
        else { const q = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: this.tex.glow, color: 0x6a5a48, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })); q.position.set(px, 1.35, -2.2); G.add(q); }
        slots.push({ id, found, rel, x: px });
      });
      if (i < 5) for (const k of [0, 1]) {
        const fid = i * 2 + k;
        if (!journal.fossil.includes(fid)) continue;
        const f = obj(make('fossilSlab')); f.position.set(ax + (k ? 2.4 : -2.4), 3.9, -4.45); f.scale.setScalar(1.25); statics.push(f);
      }
      const ln = obj(make('lantern')); ln.position.set(ax, 6.2, -2.0); statics.push(ln);
      const any = slots.some((s) => s.found);
      const acc = i < 5 ? LOOKS[i].accent : [0.9, 0.8, 1];
      alcoves.push({ x: ax, slots, any, acc, name: i < 5 ? biomes[i].name : 'THE ENDLESS DEEP' });
      this.emitters.push({ key: 'm' + i, x: ax, y: 5.4, z: -1.5, col: any ? [1, 0.72, 0.42] : [0.5, 0.42, 0.34], int: any ? 22 : 7, range: 14, pri: 5, flick: 1 });
      // a coloured glow behind each depth's alcove
      const back = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 6), new THREE.MeshBasicMaterial({ map: this.tex.glow, color: new THREE.Color().fromArray(acc).multiplyScalar(any ? 0.5 : 0.15), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      back.position.set(ax, 3.2, -4.4); G.add(back);
    }
    G.add(bake(statics));
    this.museum = { alcoves, t: 0, camX: 0 };
    if (!this.player) this.makePlayer();
    const pl = this.player; pl.root.position.set(-3.35, 0, 0.6); pl.root.rotation.set(0, Math.PI / 2, 0); pl.root.visible = true;
    this.cam.x = 0; this.cam.y = 2; this.cam.d = 8;
  }
  museumFrame(dt, sel) {
    const Mu = this.museum; if (!Mu) return;
    this.time += dt; Mu.t += dt;
    if (this.beam) this.beam.visible = false;
    if (this.blob) this.blob.visible = false;
    const A = Mu.alcoves[sel] || Mu.alcoves[0], t = this.time;
    // the camera drifts to the chosen alcove; the digger walks over to look
    Mu.camX += (A.x - Mu.camX) * (1 - Math.exp(-dt * 3));
    const cam = this.camera;
    cam.position.set(Mu.camX + Math.sin(t * 0.25) * 0.4, 2.0, 6.0); cam.lookAt(Mu.camX, 0.15, -2.4);
    const pl = this.player; if (Mu.digX == null) Mu.digX = pl.root.position.x;
    const px = Mu.digX, want = A.x - 3.35;   // by the timber post, out of the way of the plinths
    const walking = Math.abs(want - px) > 0.05;
    Mu.digX += Math.max(-dt * 3.5, Math.min(dt * 3.5, want - px)); pl.root.position.x = Mu.digX;
    pl.root.rotation.y += ((walking ? (want > px ? 0 : Math.PI) : Math.PI / 2) - pl.root.rotation.y) * Math.min(1, dt * 8);
    pl.phase += dt * (walking ? 9 : 0);
    if (pl.dig) {
      const nx = Mu.digX;
      pl.dig.update(dt, { x: nx + 0.55, y: 0, z: -0.35, yaw: walking ? (want > px ? 0 : Math.PI) : 0.75, face: want > px ? 1 : -1, vx: walking ? 3.5 * Math.sign(want - px) : 0, vy: 0, ground: true, pickF: -1, throwF: -1, aim: 0 });
    }
    const R = pl.rig, s = Math.sin(pl.phase) * (walking ? 0.6 : 0);
    if (!pl.dig && R.legL) { R.legL.rotation.z = s; R.legR.rotation.z = -s; R.armL.rotation.z = -s * 0.7; R.armR.rotation.z = s * 0.7; R.hips.position.y = 0.9 + Math.abs(Math.cos(pl.phase)) * 0.04 * (walking ? 1 : 0); }
    for (const al of Mu.alcoves) for (const sl of al.slots) if (sl.rel) { sl.rel.rotation.y = t * 0.5 + sl.x; sl.rel.position.y = 1.08 + Math.sin(t * 1.4 + sl.x) * 0.05; if (Math.random() < dt * 1.5) this.fx.glint(sl.x + (Math.random() - 0.5) * 0.5, 1.2 + Math.random() * 0.6, -2.0, 0.6, [1, 0.9, 0.7]); }
    // light: the lanterns (pool) and the helmet lamp as a key light on the chosen alcove
    const L = this.pool;
    Mu.alcoves.forEach((al, i) => { const l = L[i]; if (!l) return; l.l.position.set(al.x, 5.4, -1.2); l.l.color.setRGB(1, 0.72, 0.45); l.l.distance = 14; l.l.intensity = (al.any ? 12 : 4) * (0.92 + Math.sin(t * 6 + i) * 0.04); });
    for (let i = Mu.alcoves.length; i < L.length; i++) L[i].l.intensity = 0;
    for (const F of this.flashes) F.l.intensity = 0;
    this.lamp.position.set(Mu.camX + 1.5, 6.5, 5); this.lamp.target.position.set(Mu.camX, 1, -2.5); this.lamp.intensity = 140; this.lamp.distance = 24; this.lamp.angle = 0.55;
    this.fill.position.set(pl.root.position.x, 2, 1.5); this.fill.intensity = 6;
    if (Math.random() < dt * 10) this.fx.dust(Mu.camX + (Math.random() - 0.5) * 8, 0.5 + Math.random() * 5, (Math.random() - 0.5) * 3, { n: 1, s0: 0.05, s1: 0.08, life: 4, vy: 0.05, up: 0.1, jit: 0.15, a: 0.5, grav: -0.01, drag: 0.2, k: 1.4 });
    this.fx.U.uLampPos.value.copy(this.lamp.position); this.fx.U.uLampDir.value.copy(this.lamp.target.position).sub(this.lamp.position).normalize(); this.fx.U.uLampCol.value.setRGB(1, 0.85, 0.6);
    this.fx.update(dt);
    this.post.render(this.scene, this.camera, { bloom: 0.8, exposure: 1.2, chroma: 0.002, time: t, desat: 0, fade: 0, vignette: 0.6, flash: this.flashScreen, tint: tmpV2.set(1.04, 1, 0.95), shocks: [], lens: [], threshold: 0.95 });
  }

  // a rolled-up treasure map with a red ribbon, and the X that marks the dig spot
  scroll() {
    const g = new THREE.Group();
    const paper = new THREE.MeshStandardMaterial({ color: 0xe6d3a3, roughness: 0.85 });
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.46, 14), paper); roll.rotation.z = Math.PI / 2; g.add(roll);
    const flap = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.2), new THREE.MeshStandardMaterial({ color: 0xd9c08a, roughness: 0.9, side: THREE.DoubleSide }));
    flap.position.set(0, -0.08, 0.06); flap.rotation.x = -0.7; g.add(flap);
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.014, 6, 16), new THREE.MeshStandardMaterial({ color: 0xb01818, roughness: 0.5 }));
    rib.rotation.y = Math.PI / 2; g.add(rib);
    const ink = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xff3020, transparent: true, opacity: 0.85 }));
    ink.position.set(0.1, -0.09, 0.075); ink.rotation.x = -0.7; ink.rotation.z = Math.PI / 4; g.add(ink);
    return g;
  }
  xMarker() {
    const g = new THREE.Group(), mats = [];
    // an upright red X hovering over the spot (a flat one is lost at this camera angle)
    const xg = new THREE.Group(); xg.position.y = 1.15; g.add(xg); g.userData.x = xg;
    g.userData.isX = true;
    const bar = (rz) => { const mt = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 0.32, 0.16), transparent: true, opacity: 0.95, depthWrite: false }); mt.userData.o = 0.95; mats.push(mt); const m = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 0.06), mt); m.rotation.z = rz; m.renderOrder = 7; xg.add(m); };
    bar(Math.PI / 4); bar(-Math.PI / 4);
    const halo = new THREE.MeshBasicMaterial({ map: this.tex.glow, color: new THREE.Color(1.8, 0.35, 0.15), transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    halo.userData.o = 0.7; mats.push(halo);
    const h = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), halo); h.position.z = -0.05; xg.add(h);
    const glowMat = new THREE.MeshBasicMaterial({ map: this.tex.glow, color: new THREE.Color(1.6, 0.3, 0.12), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    glowMat.userData.o = 0.55; mats.push(glowMat);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), glowMat); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.02; g.add(pool);
    const beamMat = new THREE.MeshBasicMaterial({ map: this.tex.glow, color: new THREE.Color(1.4, 0.35, 0.15), transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
    beamMat.userData.o = 0.45; mats.push(beamMat);
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 6), beamMat); beam.position.y = 2.9; beam.scale.x = 0.7; g.add(beam);
    return { m: g, mats };
  }

  // ------------------------------------------------------------------ bosses
  buildBoss(kind) {
    const m = make(kind);
    const B = { kind, m, root: obj(m), t: 0, trail: [] };
    // own material copies, so the hit flash only lights the boss
    const own = new Map();
    const mine = (o) => { if (o.isMesh && o.material && !Array.isArray(o.material)) { if (!own.has(o.material)) own.set(o.material, o.material.clone()); o.material = own.get(o.material); o.castShadow = true; o.receiveShadow = true; } };
    B.root.traverse(mine);
    for (const k of ['segs']) if (m[k]) for (const s of m[k]) s.traverse(mine);
    for (const k of ['fistL', 'fistR']) if (m[k]) m[k].traverse(mine);
    B.mats = [...own.values()].filter((mt) => mt.emissive);
    this.level.add(B.root);
    if (m.segs) for (const s of m.segs) if (!s.parent || s.parent === B.root) { this.level.add(s); }
    if (m.fistL) { this.level.add(m.fistL); this.level.add(m.fistR); }
    this.boss = B;
  }

  // ------------------------------------------------------------------ events from the sim -> effects
  event(e, W) {
    const fx = this.fx, z = 0.3;
    if (this.living) this.living.event(e, W);
    switch (e.k) {
      case 'break': {
        this.cave.rebuildAround(Math.floor(e.x), Math.floor(e.y));
        const key = Math.floor(e.y) * this.M.w + Math.floor(e.x), g = this.breakProps.get(key);
        if (g) { g.visible = false; }
        fx.debris(e.x, e.y, z, { n: e.t === T.HARD ? 16 : 9, speed: e.how === 'blast' ? 7 : 3.5, size: 0.17 });
        fx.dust(e.x, e.y - 0.3, z, { n: 8, s0: 0.6, s1: 2.2, life: 3, a: 0.45 });
        if (e.t === T.VEIN) { fx.debris(e.x, e.y, z, { gold: true, n: 6, speed: 3, size: 0.09 }); for (let i = 0; i < 4; i++) fx.glint(e.x + (Math.random() - 0.5), e.y + Math.random() * 0.6, z + 0.5, 0.7); }
        break;
      }
      case 'pick': case 'ore': fx.sparks(e.x, e.y, z + 0.4, { n: e.k === 'ore' ? 10 : 6, speed: 5, dir: Math.PI / 2, cone: 3, g: e.k === 'ore' ? 0.85 : 0.7 }); fx.debris(e.x, e.y, z, { n: 2, speed: 2.5, size: 0.08 }); fx.dust(e.x, e.y - 0.2, z, { n: 2, s0: 0.3, s1: 1, life: 1.2, a: 0.35 }); if (e.k === 'ore') fx.glint(e.x, e.y, z + 0.6, 0.8); this.kick(0.08); break;
      case 'clink': fx.sparks(e.x, e.y, z + 0.4, { n: 8, speed: 6, s: 0.12 }); break;
      case 'blast': fx.explode(e.x, e.y, z, 1.25); this.shake(0.75); this.shock(e.x, e.y, 0.9); if (e.wet) fx.splash(e.x, e.y + 0.5, z, 1.4); break;
      case 'crumble': fx.debris(e.x, e.y, z, { n: 10, speed: 2, size: 0.2 }); fx.dust(e.x, e.y, z, { n: 6, life: 2.5 }); { const g = this.breakProps.get(Math.floor(e.y) * this.M.w + Math.floor(e.x)); if (g) g.visible = false; } break;
      case 'creak': fx.dust(e.x, e.y, z, { n: 3, s0: 0.2, s1: 0.8, life: 1, vy: -0.5, a: 0.4 }); break;
      case 'land': if (e.v > 2.5) fx.dust(e.x, e.y, z, { n: Math.min(8, Math.round(e.v)), s0: 0.3, s1: 1.4, life: 1.4, jit: 2.2, vy: 0.3, up: 0.3, a: 0.35 }); if (e.v > 5) this.kick(0.15); break;
      case 'splash': fx.splash(e.x, e.y, z, Math.min(2, e.v / 8)); break;
      case 'hurt': this.flashScreen.set(0.9, 0.1, 0.05, CALM.on ? 0.12 : 0.25); this.shake(0.45); this.player.hurtT = 0.35; this.player.hurtNow = true; break;
      case 'helmet': fx.sparks(e.x, e.y, z + 0.4, { n: 14, speed: 5, g: 0.9 }); this.shake(0.3); break;
      case 'death': this.shake(0.6); fx.dust(e.x, e.y, z, { n: 10, life: 2.5 }); break;
      case 'gold': for (let i = 0; i < 3; i++) fx.glint(e.x + (Math.random() - 0.5) * 0.4, e.y + 0.3 + Math.random() * 0.4, z + 0.6, 0.6); fx.sparks(e.x, e.y + 0.3, z, { n: 6, speed: 2.5, grav: 3, s: 0.1, g: 0.85, b: 0.4 }); break;
      case 'gem': { const c = new THREE.Color(GEMS[e.gem || 0].col); for (let i = 0; i < 5; i++) fx.glint(e.x + (Math.random() - 0.5) * 0.5, e.y + 0.3 + Math.random() * 0.5, z + 0.6, 0.8, [c.r * 1.5 + 0.3, c.g * 1.5 + 0.3, c.b * 1.5 + 0.3]); } break;
      case 'chest': for (let i = 0; i < 10; i++) fx.glint(e.x + (Math.random() - 0.5), e.y + 0.6 + Math.random(), z + 0.6, 0.9); this.flash(e.x, e.y + 1, 1, 14, 0xffc860, 0.8); break;
      case 'kill': fx.dust(e.x, e.y, z, { n: 5, life: 1.5, a: 0.4 }); if (e.what === 'crawler') fx.debris(e.x, e.y + 0.3, z, { n: 5, speed: 3, size: 0.1 }); break;
      case 'dispel': for (let i = 0; i < 12; i++) fx.glint(e.x + (Math.random() - 0.5), e.y + (Math.random() - 0.5) * 1.5, z, 0.7, [0.8, 0.9, 1]); break;
      case 'stalhit': fx.debris(e.x, e.y, z, { n: 10, speed: 3.5, size: 0.14 }); fx.dust(e.x, e.y, z, { n: 6, life: 2.4 }); this.shake(0.25); break;
      case 'crack': fx.dust(e.x, e.y, z, { n: 3, s0: 0.2, s1: 0.7, life: 1.5, vy: -1, a: 0.5 }); break;
      case 'geyser': fx.splash(e.x, e.y, z, 0.8); break;
      case 'secret': this.flash(e.x, e.y, 1.5, 6, 0xffe0a0, 1.2); break;
      case 'find': if (e.kind === 'cache') { fx.debris(e.x, e.y + 0.5, z, { gold: true, n: 14, speed: 5, size: 0.1 }); fx.debris(e.x, e.y + 0.5, z, { n: 10, speed: 4, size: 0.15 }); this.shake(0.3); }
        if (!e.quiet) { for (let i = 0; i < 16; i++) fx.glint(e.x + (Math.random() - 0.5) * 1.2, e.y + Math.random() * 1.6, z + 0.6, 1.0, [1, 0.9, 0.6]); this.flash(e.x, e.y + 1, 1.2, 10, 0xfff0c0, 1.6); } break;
      case 'camp': this.flash(e.x, e.y + 0.8, 1, 12, 0xff9a40, 1.2); break;
      case 'door': fx.dust(e.x, e.y, z, { n: 6, life: 2 }); break;
      case 'slam': fx.debris(e.x, e.y + 0.3, z, { n: 14, speed: 6, size: 0.22 }); fx.dust(e.x, e.y, z, { n: 12, s0: 1, s1: 3.5, life: 3.5, jit: 4, a: 0.5 }); this.shake(0.9); this.shock(e.x, e.y + 0.5, 0.7); break;
      case 'bosshit': fx.sparks(e.x, e.y, z + 0.8, { n: 16, speed: 6, g: 0.75 }); this.flashBoss = 0.2; this.kick(0.12); break;
      case 'bossdie': this.shake(1.2); this.flash(e.x, e.y, 2, 40, 0xffd090, 1.5, 30); fx.explode(e.x, e.y, z, 2); break;
      case 'bossphase': this.shake(0.6); break;
      case 'beam': this.beamT = 0.5; this.beamY = e.y; this.beamDir = e.dir; break;
      case 'bosswake': this.shake(0.8); break;
      case 'projhit': fx.splash(e.x, e.y, z, 0.6); break;
      case 'flare': fx.sparks(e.x + 0.3, e.y, z, { n: 10, speed: 3, r: 1, g: 0.3, b: 0.2 }); break;
      case 'respawn': this.cam.cine = null; break;
    }
  }
  shake(a) { if (this.view.shake > 0) this.cam.shake = Math.min(1.4, this.cam.shake + a * this.view.shake); }
  kick(a) { this.cam.kick = Math.min(0.4, this.cam.kick + a * this.view.shake); }
  shock(x, y, s) { if (CALM.on) s *= 0.4; this.shocks.push({ x, y, t: 0, s }); }

  // ------------------------------------------------------------------ per-frame sync
  frame(W, dt, o = {}) {
    if (!this.M) return;
    this.time += dt;
    const t = this.time, P = W.players[0], M = W.M;
    this.rockMat.userData.U.uTime.value = t;
    this.rockMat.userData.U.uLampP.value.copy(this.lamp.position);
    if (this.lavaMat) this.lavaMat.uniforms.uT.value = t;
    if (this.waterVol) this.waterVol.uniforms.uT.value = t;
    this.tex.water.nrm.offset.set(t * 0.02, t * 0.013);
    // the digger
    this.animPlayer(W, P, dt);
    // cages
    if (this.startCage) { this.startCage.position.set(M.start.x, W.cage.y, -0.1); this.startCage.visible = W.cage.y < M.h + 6; }
    if (this.exitCage && W.exitCage) this.exitCage.position.set(M.exit.x, W.exitCage.y, -0.1);
    // gates
    for (const g of this.gates) { if (g.d.open && g.g.position.y < g.d.y0 + 4.2) g.g.position.y += dt * 2.5; }
    // entity views
    this.syncEntities(W, dt);
    if (this.boss) this.animBoss(W, dt);
    this.syncZones(W, dt);
    this.lights(W, dt);
    this.updateCamera(W, dt, o);
    this.fx.update(dt);
    // particle lighting follows the lamp
    this.fx.U.uLampPos.value.copy(this.lamp.position);
    tmpV.copy(this.lamp.target.position).sub(this.lamp.position).normalize(); this.fx.U.uLampDir.value.copy(tmpV);
    this.fx.U.uLampCol.value.copy(this.lamp.color).multiplyScalar(this.lamp.intensity / 120);
    // ambient dust motes drifting in the lamp beam
    if (Math.random() < dt * 14 && !CALM.on) {
      const d = 1.5 + Math.random() * 5;
      this.fx.dust(P.x + P.face * d + (Math.random() - 0.5) * 2, P.y + 0.5 + Math.random() * 2.5, (Math.random() - 0.5) * 2.5, { n: 1, s0: 0.05, s1: 0.08, life: 4, vy: 0.05, up: 0.1, jit: 0.15, a: 0.55, grav: -0.01, drag: 0.2, k: 1.4 });
    }
    if (this.decor && this.decor.update) this.decor.update(t, dt, P, this.fx);
    if (this.detail && this.detail.update) this.detail.update(t, dt, P, this.fx, this.emitters);
    if (this.living) this.living.update(t, dt, P, W, this.lamp);
    // post
    for (const s of this.shocks) s.t += dt;
    this.shocks = this.shocks.filter((s) => s.t < 0.9);
    const shocks = [];
    for (const s of this.shocks.slice(-6)) { tmpV.set(s.x, s.y, 0).project(this.camera); shocks.push(new THREE.Vector4(tmpV.x * 0.5 + 0.5, tmpV.y * 0.5 + 0.5, s.t * 0.55, (1 - s.t / 0.9) * s.s)); }
    this.flashScreen.w = Math.max(0, this.flashScreen.w - dt * 1.4);
    const L = this.look;
    const dark = P.oil <= 0 ? 0.35 : 0;
    this.post.render(this.scene, this.camera, { bloom: L.bloom * 1.1, exposure: L.exposure * (o.exposure ?? 1), chroma: 0.0025, time: t, desat: dark + (o.desat || 0), fade: o.fade || 0, vignette: 0.55 + dark * 0.3,
      flash: this.flashScreen, tint: tmpV2.fromArray(L.tint), shocks, lens: [], threshold: 0.95, heat: W.M && W.M.biome === 4 ? (CALM.on ? 0.35 : 1) : 0 });
  }

  animPlayer(W, P, dt) {
    const pl = this.player, R = pl.rig, root = pl.root;
    root.visible = !P.inCage || W.cage.y < W.M.start.y + 9;
    const climb = P.state === 'climb';
    // standing on rock, his boots follow the drawn floor where it rounds off at a lip (never up into it). Visual only.
    let want = 0;
    if (P.ground && !climb && !P.inWater && !P.inCage && !P.dead && this.cave && this.cave.solid(Math.floor(P.x), Math.ceil(P.y - 0.01) - 1)) {
      let g = -Infinity;
      for (const dx of [-0.13, 0, 0.13]) { const v = this.cave.groundY(P.x + dx, P.y + 0.4, 0.05, 0.6); if (v !== null && v > g) g = v; }
      if (g > -Infinity) want = Math.max(-0.16, Math.min(0, g - P.y));
    }
    this.footDY = (this.footDY || 0) + (want - (this.footDY || 0)) * Math.min(1, dt * (P.ground ? 14 : 8));
    if (pl.dig) {
      const M = W.M, tx = Math.floor(P.x), ty = Math.floor(P.y + 0.9);
      const rope = M.tiles[ty * M.w + tx] === T.ROPE || M.tiles[Math.floor(P.y + 0.2) * M.w + tx] === T.ROPE;
      pl.dig.update(dt, {
        x: P.x, y: P.y + this.footDY, face: P.face, vx: P.vx, vy: P.vy, ground: !!P.ground, climb, rope, swim: !!P.inWater, dead: !!P.dead, cage: !!P.inCage,
        pickF: P.pickT > 0 ? 1 - P.pickT / PHYS.pickT : -1, aim: P.pickAim || 0, throwF: P.throwT > 0 ? 1 - P.throwT / PHYS.throwT : -1,
        hurt: !!pl.hurtNow, ladderX: tx + 0.5,
      });
      pl.hurtNow = false;
    } else this.animOld(W, P, dt, climb);
    this.animPlayerTail(W, P, dt, climb);
  }

  animOld(W, P, dt, climb) {
    const pl = this.player, R = pl.rig, root = pl.root;
    root.position.set(P.x, P.y, 0);
    // facing: left/right, or the back to the camera on a ladder
    const wantYaw = climb ? -Math.PI / 2 : (P.face > 0 ? 0 : Math.PI);
    let dy = wantYaw - root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    root.rotation.y += dy * Math.min(1, dt * 14);
    const sp = Math.abs(P.vx);
    pl.phase += dt * (climb ? Math.abs(P.vy) * 2.2 : sp * 2.1);
    const ph = pl.phase;
    const set = (o, x, y, z) => { if (o) { o.rotation.x = x; o.rotation.y = y; o.rotation.z = z; } };
    let legL = 0, legR = 0, shinL = 0, shinR = 0, armL = 0, armR = 0, foreL = 0.2, foreR = 0.2, torso = 0, head = 0, hipsY = 0.9, lean = 0;
    if (P.dead) {
      root.rotation.z = lerp(root.rotation.z, P.face > 0 ? 1.45 : -1.45, Math.min(1, dt * 5));
      armL = 1.2; armR = 1.0; legL = 0.3; legR = -0.2;
    } else {
      root.rotation.z = lerp(root.rotation.z, 0, Math.min(1, dt * 10));
      if (climb) {
        const s = Math.sin(ph);
        armL = 2.6 + s * 0.4; armR = 2.6 - s * 0.4; foreL = -0.5; foreR = -0.5; legL = 0.5 + s * 0.4; legR = 0.5 - s * 0.4; shinL = -0.8; shinR = -0.8;
      } else if (P.inWater) {
        const s = Math.sin(t2(this) * 4);
        lean = 0.9; armL = 2.4 + s * 0.8; armR = 2.4 - s * 0.8; legL = 0.3 + s * 0.4; legR = 0.3 - s * 0.4; foreL = -0.3; foreR = -0.3;
      } else if (!P.ground) {
        const up = P.vy > 0;
        legL = up ? 0.8 : 0.3; legR = up ? -0.2 : -0.4; shinL = -1.2; shinR = up ? -0.4 : -0.8; armL = up ? 2.2 : 1.6; armR = up ? 0.6 : 1.2; foreL = -0.4; foreR = -0.6;
      } else if (sp > 0.3) {
        const s = Math.sin(ph), k = Math.min(1, sp / PHYS.run);
        legL = s * 0.75 * k; legR = -s * 0.75 * k; shinL = -Math.max(0, -Math.cos(ph)) * 1.1 * k - 0.1; shinR = -Math.max(0, Math.cos(ph)) * 1.1 * k - 0.1;
        armL = -s * 0.55 * k; armR = s * 0.55 * k; foreL = -0.5; foreR = -0.5; hipsY = 0.9 + Math.abs(Math.cos(ph)) * 0.05 * k; lean = 0.12 * k;
      } else {
        const b = Math.sin(this.time * 1.6);
        hipsY = 0.9 + b * 0.008; armL = 0.06 + b * 0.02; armR = 0.1; head = Math.sin(this.time * 0.4) * 0.08;
      }
      // the pick swing overrides the right arm (and the throw)
      if (P.pickT > 0) {
        const f = 1 - P.pickT / PHYS.pickT;
        const wind = f < 0.35 ? f / 0.35 : 1 - (f - 0.35) / 0.65;
        const aim = P.pickAim;
        const top = aim === 1 ? 3.3 : 2.9, bot = aim === -1 ? -0.9 : aim === 1 ? 1.8 : 0.1;
        armR = f < 0.35 ? lerp(armR, top, wind) : lerp(bot, top, wind);
        foreR = f < 0.35 ? -1.2 * wind : -0.2;
        torso = (f < 0.35 ? -0.2 * wind : 0.25 * (1 - wind)) * (aim === -1 ? 1.6 : 1);
      }
      if (P.throwT > 0) { const f = 1 - P.throwT / PHYS.throwT; armL = f < 0.4 ? lerp(0, 2.8, f / 0.4) : lerp(2.8, 0.6, (f - 0.4) / 0.6); foreL = -0.3; }
    }
    root.rotation.x = 0;
    if (R.hips) { R.hips.position.y = hipsY; R.hips.rotation.z = -lean; }
    set(R.torso, 0, 0, torso); set(R.head, 0, 0, head);
    set(R.legL, 0, 0, legL); set(R.legR, 0, 0, legR); set(R.shinL, 0, 0, shinL); set(R.shinR, 0, 0, shinR);
    set(R.armL, 0, 0, armL); set(R.armR, 0, 0, armR); set(R.foreL, 0, 0, foreL); set(R.foreR, 0, 0, foreR);
  }

  animPlayerTail(W, P, dt, climb) {
    const pl = this.player, R = pl.rig, root = pl.root;
    // hurt flash and invulnerability blink
    pl.hurtT = Math.max(0, (pl.hurtT || 0) - dt);
    // (the lifts keep you safe without the blink: riding one down you stay in sight)
    const riding = P.inCage || (W.exitCage && W.exitCage.state === 'down');
    const blink = P.inv > 0 && !P.dead && !riding && Math.sin(this.time * 30) > 0;
    for (const m of pl.mats) { m.emissive.setRGB(pl.hurtT > 0 ? 0.6 : 0, 0, 0); }
    root.traverse((o) => { if (o.isMesh) o.visible = !blink || o === R.lampLens; });
    // the lamp: aimed ahead and a little down, dimming as the oil runs out
    const lp = tmpV;
    if (R.lampAnchor) R.lampAnchor.getWorldPosition(lp); else lp.set(P.x + P.face * 0.15, P.y + 1.75, 0.1);
    this.lamp.position.copy(lp);
    const oil = P.oil / P.oilMax;
    const aimDown = climb ? -0.6 : -0.28;
    this.lamp.target.position.set(lp.x + (climb ? 0 : P.face * 6), lp.y + aimDown * 6 + (P.pickAim === 1 ? 4 : 0), climb ? -3 : 0.5);
    const lampLvl = P.up.lamp || 0;
    const flick = oil < 0.2 ? (0.75 + 0.25 * Math.sin(this.time * 23) * Math.sin(this.time * 7.3)) : 1;
    const k = (oil <= 0 ? 0.16 : (0.45 + Math.min(1, oil * 2.2) * 0.55)) * flick;
    this.lamp.intensity = (100 + lampLvl * 22) * k * (climb ? 0.4 : 1);   // on a ladder it is inches from the rungs
    this.lamp.distance = 30 + lampLvl * 5;
    this.lamp.angle = 0.72 + lampLvl * 0.06;
    this.fill.position.set(P.x + P.face * 0.6, P.y + 1.3, 1.2);
    if (this.lampCol) { this.lamp.color.copy(this.lampCol); this.fill.color.copy(this.lampCol).lerp(tmpC.setRGB(1, 0.78, 0.56), 0.5); } else this.fill.color.setRGB(1, 0.78, 0.56);
    // KEEN EYE: walls hiding a secret room glint gold when you are near
    if (this.loadout && this.loadout.keen && W.M.seals) for (const s of W.M.seals) if (Math.abs(s.x - P.x) < 12 && Math.abs(s.y - P.y) < 8 && Math.random() < dt * 3 && SOLID[W.M.tiles[Math.floor(s.y) * W.M.w + Math.floor(s.x)]]) this.fx.glint(s.x + (Math.random() - 0.5) * 0.8, s.y + (Math.random() - 0.5) * 2.5, 0.8, 0.7, [1, 0.8, 0.35]);
    this.fill.intensity = (oil <= 0 ? 3 : 14 + lampLvl * 3) * flick;
    // running feet kick up little puffs
    if (P.ground && !climb && !P.inWater && !P.dead && Math.abs(P.vx) > 2.4) {
      this.stepAcc = (this.stepAcc || 0) + Math.abs(P.vx) * dt;
      if (this.stepAcc > 1.05) { this.stepAcc = 0; this.fx.dust(P.x - P.face * 0.15, P.y + 0.06, 0.15, { n: 1, s0: 0.12, s1: 0.65, life: 0.8, jit: 0.5, vy: 0.35, up: 0.15, a: 0.2 }); }
    }
    // contact shadow: on the floor under the boots, fading as the digger rises above it
    if (this.blob) {
      let d = 0, fy = P.y + (this.footDY || 0);
      if (!P.ground) { while (d < 4 && !this.solidAt(P.x, P.y - d - 0.01)) d += 0.2; fy = Math.floor(P.y - d - 0.01) + 1; d = P.y - fy; }
      const op = climb || P.dead || P.inWater || d >= 3.5 ? 0 : 0.85 * (1 - d / 3.5);
      this.blob.visible = op > 0.01; this.blob.material.opacity = op;
      const sc = 1 + d * 0.18; this.blob.position.set(P.x, fy + 0.02, 0.1); this.blob.scale.set(1.5 * sc, 1.7 * sc, 1);
    }
    // the beam: a faint cone of lit dust ahead of the lamp, stopped where the rock is
    if (this.beam) {
      const bd = tmpV2.copy(this.lamp.target.position).sub(lp).normalize();
      let len = 0.3; while (len < 9 && !this.solidAt(lp.x + bd.x * len, lp.y + bd.y * len)) len += 0.2;
      const want = climb || P.dead || W.isBoss && W.boss && W.boss.dead ? 0 : 0.26 * k * (1 + lampLvl * 0.15) * (CALM.on ? 0.6 : 1);
      this.beamI += (want - this.beamI) * Math.min(1, dt * 6);
      this.beamLen = this.beamLen ? this.beamLen + (len - this.beamLen) * Math.min(1, dt * 14) : len;
      const L = Math.max(0.5, this.beamLen) + 0.35, r = L * (0.3 + lampLvl * 0.03);
      this.beam.visible = this.beamI > 0.002;
      this.beam.position.copy(lp); this.beam.quaternion.setFromUnitVectors(BEAM_DOWN, bd); this.beam.scale.set(r, L, Math.min(0.6, r * 0.25));
      const u = this.beam.material.uniforms; u.uI.value = this.beamI; u.uT.value = this.time; u.uCol.value.copy(this.lamp.color);
    }
    if (R.lampLens && R.lampLens.material && R.lampLens.material.emissive) R.lampLens.material.emissiveIntensity = 4 * k * (climb ? 0.3 : 1);   // facing the ladder: the lens is turned away from us
  }

  syncEntities(W, dt) {
    const seen = new Set(), t = this.time;
    const view = (key, build) => { let v = this.views.get(key); if (!v) { v = build(); v.root = obj(v.m); v.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; } }); this.level.add(v.root); this.views.set(key, v); } seen.add(key); return v; };
    for (const l of W.loot) {
      if (l.got) continue;
      const key = 'l' + l.id;
      const v = view(key, () => {
        const kindMap = { gold: 'nugget', oil: 'oilCan', dyn: 'dynamite', flare: 'flare', heart: 'canteen', chest: 'chest' };
        if (l.k === 'gem') return { m: make('gem', GEMS[l.gem || 0].col) };
        return { m: make(kindMap[l.k] || 'nugget') };
      });
      const bob = l.k === 'chest' ? 0 : 0.12 + Math.sin(t * 2.4 + l.id) * 0.06;
      v.root.position.set(l.x, l.y + bob, 0.15);
      if (l.k !== 'chest') v.root.rotation.y = t * 1.3 + l.id;
      if ((l.k === 'gold' || l.k === 'gem') && Math.random() < dt * 0.9) this.fx.glint(l.x + (Math.random() - 0.5) * 0.2, l.y + 0.25 + bob, 0.5, 0.45);
    }
    for (const k of W.keys) if (!k.got) { const v = view('k' + k.id, () => ({ m: make('key') })); v.root.position.set(k.x, k.y + 0.4 + Math.sin(t * 2) * 0.08, 0.15); v.root.rotation.y = t; if (Math.random() < dt) this.fx.glint(k.x, k.y + 0.5, 0.5, 0.5, [0.8, 0.85, 1]); }
    for (const k of W.kegs) { const v = view('g' + k.id, () => ({ m: make(k.what === 'flare' ? 'flareCrate' : 'keg') })); v.root.position.set(k.x, k.y, -0.5); }
    for (const c of W.camps) {
      const v = view('c' + c.id, () => ({ m: make('campfire') }));
      v.root.position.set(c.x, c.y, -0.4);
      if (c.lit && !CALM.on && Math.random() < dt * 30) this.fx.fire(c.x, c.y + 0.35, -0.3, { n: 1, s: 0.55, life: 0.7 });
      if (c.lit && Math.random() < dt * 3) this.fx.sparks(c.x, c.y + 0.4, -0.3, { n: 1, speed: 1.5, dir: Math.PI / 2, cone: 0.8, grav: -1, life: 1.4, s: 0.08 });
    }
    for (const f of W.finds) {
      if (f.kind === 'fossil' || f.kind === 'wonder') continue;
      if (f.kind === 'cache') {
        if (f.got || !W.mapFound) continue;
        const v = view('x' + f.id, () => this.xMarker());
        v.root.position.set(f.x, f.y + 1.08, 0.35);
        if (v.m.userData.x) { v.m.userData.x.position.y = 1.15 + Math.sin(t * 2.6) * 0.12; v.m.userData.x.rotation.y = Math.sin(t * 1.3) * 0.35; }
        const pulse = 0.65 + 0.35 * Math.sin(t * 4);
        for (const m of v.mats) m.opacity = m.userData.o * pulse;
        if (Math.random() < dt * 5) this.fx.glint(f.x + (Math.random() - 0.5) * 0.6, f.y + 1.1, 0.4, 0.5, [1, 0.35, 0.25]);
        continue;
      }
      if (f.got && f.kind !== 'relic') continue;
      const v = view('f' + f.id, () => {
        if (f.kind === 'relic') {
          const g = new THREE.Group(); const ped = obj(make('pedestal')); const rel = obj(make('relic', f.fid)); rel.position.y = 1.02; g.add(ped, rel);
          // a soft shaft of light falls on a relic nobody has taken yet
          let hh = 1; while (hh < 6 && !this.solidAt(f.x, f.y + hh + 0.5)) hh++;
          const shaft = new THREE.Mesh(new THREE.PlaneGeometry(1.5, hh + 0.4), new THREE.ShaderMaterial({ vertexShader: SHAFT_VERT, fragmentShader: SHAFT_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uT: { value: 0 }, uI: { value: 0 } } }));
          shaft.position.set(0, (hh + 0.4) / 2 + 0.05, -0.4); shaft.renderOrder = 3; shaft.frustumCulled = false; g.add(shaft);   // always drawn, so its shader compiles when the level loads, not mid-run
          return { m: g, rel, shaft };
        }
        if (f.kind === 'map') return { m: this.scroll() };
        return { m: make('note') };
      });
      if (f.kind === 'map') { v.root.position.set(f.x, f.y + 0.32 + Math.sin(t * 2.2) * 0.07, 0.15); v.root.rotation.y = t * 0.9; if (Math.random() < dt * 2.5) this.fx.glint(f.x, f.y + 0.4, 0.5, 0.5, [1, 0.85, 0.55]); continue; }
      v.root.position.set(f.x, f.y, f.kind === 'relic' ? -0.3 : 0.15);
      if (v.shaft) { const u = v.shaft.material.uniforms; u.uT.value = t; u.uI.value += ((f.got ? 0 : 0.32) - u.uI.value) * Math.min(1, dt * 2); v.shaft.visible = u.uI.value > 0.003; }
      if (v.rel) { v.rel.visible = !f.got; v.rel.rotation.y = t * 0.6; v.rel.position.y = 1.05 + Math.sin(t * 1.6) * 0.05; if (!f.got && Math.random() < dt * 4) this.fx.glint(f.x + (Math.random() - 0.5) * 0.5, f.y + 1.1 + Math.random() * 0.5, 0.2, 0.6, [1, 0.9, 0.7]); }
    }
    // creatures
    for (const b of W.bats) {
      if (b.gone) continue;
      const v = view('b' + b.id, () => ({ m: make('bat') }));
      v.root.position.set(b.x, b.y, 0.2);
      const hang = b.st === 'hang';
      v.root.rotation.z = hang ? Math.PI : b.st === 'dead' ? Math.PI * 0.8 : 0;
      v.root.rotation.y = b.face > 0 ? 0 : Math.PI;
      const fl = hang ? 0.1 : b.st === 'wake' ? Math.sin(t * 9) * 0.5 : Math.sin(t * (b.st === 'swoop' ? 26 : 18)) * 0.9;
      if (v.m.wingL) { v.m.wingL.rotation.x = hang ? 1.2 : fl; v.m.wingR.rotation.x = hang ? -1.2 : -fl; }
    }
    for (const c of W.crawlers) {
      if (c.dead) continue;
      const v = view('w' + c.id, () => ({ m: make('crawler') }));
      v.root.position.set(c.x, c.y, 0.1);
      v.root.rotation.y = c.dir > 0 ? 0 : Math.PI;
      if (v.m.legs) v.m.legs.forEach((lg, i) => { lg.rotation.y = Math.sin(t * 14 + i * 2.1) * 0.35; });
    }
    for (const s of W.shades) {
      if (s.dead) continue;
      const v = view('s' + s.id, () => ({ m: make('shade') }));
      v.root.position.set(s.x, s.y + Math.sin(t * 1.7 + s.id) * 0.15, 0.4);
      v.root.rotation.y = Math.sin(t * 0.5) * 0.4;
      const a = s.st === 'form' ? Math.min(1, s.t / 1.5) * 0.5 : s.st === 'fade' ? Math.max(0, 1 - s.t) : 0.85 + Math.sin(t * 5) * 0.1;
      const mats = v.m.mats || (v.m.mat ? [v.m.mat] : []);
      if (!v.ownMats) { v.ownMats = true; const cl = new Map(); v.root.traverse((o) => { if (o.isMesh && mats.includes(o.material)) { if (!cl.has(o.material)) cl.set(o.material, o.material.clone()); o.material = cl.get(o.material); } }); v.mats = [...cl.values()]; v.base = v.mats.map((m) => m.opacity); }
      v.mats.forEach((m, i) => { m.opacity = v.base[i] * a; });
    }
    for (const e of W.eels) {
      if (e.st === 'dead') continue;
      const v = view('e' + e.id, () => ({ m: make('eel') }));
      const out = e.st === 'lunge' || e.st === 'back';
      v.root.visible = out || e.st === 'warn';
      v.root.position.set(e.x, e.st === 'warn' ? e.hy - 0.3 + Math.sin(t * 6) * 0.1 : e.y, 0.2);
      v.root.rotation.z = out ? Math.atan2(e.y - e.hy, (e.x - e.hx) || 0.01) * 0.6 + (e.st === 'back' ? -1 : 0.4) : 0.3;
      v.root.rotation.y = (e.tx || e.x) >= e.hx ? 0 : Math.PI;
      if (v.m.segs) v.m.segs.forEach((sg, i) => { sg.rotation.z = Math.sin(t * 7 - i * 0.7) * 0.18; });
      if (e.st === 'warn' && Math.random() < dt * 8) this.fx.bubbles(e.hx + (Math.random() - 0.5), e.hy + 0.4, 0.3, 1);
    }
    for (const s of W.stalac) {
      if (s.st === 'gone') continue;
      const v = view('t' + s.id, () => ({ m: make('stalactite', 1.3) }));
      const shake = s.st === 'shake' ? Math.sin(t * 60) * 0.04 : 0;
      v.root.position.set(s.x + shake, s.y + 0.02, 0.1);
      if (s.st === 'shake' && Math.random() < dt * 10) this.fx.dust(s.x, s.y - 0.2, 0.2, { n: 1, s0: 0.1, s1: 0.4, life: 1.2, vy: -2, a: 0.5, grav: 4 });
    }
    for (const g of W.geysers) {
      const v = view('y' + g.id, () => { const grp = new THREE.Group(); const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 0.25, 10, 1, true), new THREE.MeshStandardMaterial({ color: 0x3a3330, roughness: 0.6, side: THREE.DoubleSide })); vent.position.y = 0.1; grp.add(vent); return { m: grp }; });
      v.root.position.set(g.x, g.y, 0.1);
      if (g.st === 'warn' && Math.random() < dt * 14) this.fx.dust(g.x, g.y + 0.2, 0.2, { n: 1, s0: 0.2, s1: 0.7, life: 1, vy: 1.5, jit: 0.3, a: 0.4, col: [0.85, 0.88, 0.9] });
      if (g.st === 'erupt' && !CALM.on) {
        // a hot fast core, slow billows that spread and linger above it, and spray at the vent
        for (let i = 0; i < 3; i++) this.fx.dust(g.x + (Math.random() - 0.5) * 0.15, g.y + 0.2, 0.2, { n: 1, s0: 0.18, s1: 1.1, life: 0.85, vy: 12 + Math.random() * 4, jit: 0.25, a: 0.3, col: [0.95, 0.97, 1.0], grav: 2, drag: 0.35 });
        if (Math.random() < dt * 16) this.fx.dust(g.x + (Math.random() - 0.5) * 0.6, g.y + 4 + Math.random() * 3, 0.0, { n: 1, s0: 0.8, s1: 2.8, life: 2.6, vy: 1.1, jit: 1.1, a: 0.13, col: [0.86, 0.89, 0.93], grav: -0.15, drag: 0.9 });
      } else if (Math.random() < dt * 1.2) this.fx.dust(g.x, g.y + 0.25, 0.15, { n: 1, s0: 0.15, s1: 0.8, life: 2.2, vy: 0.5, jit: 0.15, a: 0.16, col: [0.85, 0.88, 0.9] });
    }
    for (const b of W.bombs) {
      if (b.dead) continue;
      const v = view('d' + b.id, () => ({ m: make('dynamiteStick') }));
      v.root.position.set(b.x, b.y + 0.08, 0.2); v.root.rotation.z = b.rest ? Math.PI / 2 : t * 9;
      if (Math.random() < dt * 40) this.fx.sparks(b.x + 0.15, b.y + 0.25, 0.3, { n: 1, speed: 2, life: 0.3, s: 0.1, grav: 2 });
    }
    for (const f of W.flares) {
      if (f.dead) continue;
      const v = view('r' + f.id, () => ({ m: make('flare') }));
      v.root.position.set(f.x, f.y + 0.06, 0.2); v.root.rotation.z = f.rest ? Math.PI / 2 : t * 7;
      if (!CALM.on && Math.random() < dt * 28) this.fx.fire(f.x, f.y + 0.15, 0.25, { n: 1, s: 0.4, life: 0.5, r: 1, g: 0.25, b: 0.15, vy: 1.6 });
      if (Math.random() < dt * 10) this.fx.dust(f.x, f.y + 0.4, 0.2, { n: 1, s0: 0.3, s1: 1.6, life: 2.5, vy: 0.8, jit: 0.4, a: 0.25, col: [0.9, 0.5, 0.45] });
    }
    for (const p of W.proj) {
      if (p.dead) continue;
      const v = view('p' + p.id, () => ({ m: new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), new THREE.MeshStandardMaterial({ color: 0x9adfff, roughness: 0.05, transparent: true, opacity: 0.8, emissive: 0x1a5070 })) }));
      v.root.position.set(p.x, p.y, 0.3);
      if (Math.random() < dt * 20) this.fx.splash(p.x, p.y, 0.3, 0.05);
    }
    for (const [k, v] of this.views) if (!seen.has(k)) { this.level.remove(v.root); this.views.delete(k); }
  }

  animBoss(W, dt) {
    const B = W.boss, V = this.boss, m = V.m, t = this.time, A = W.M.arena;
    V.t += dt;
    const hitk = this.flashBoss = Math.max(0, (this.flashBoss || 0) - dt);
    for (const mt of V.mats) { if (!mt.userData.e0) mt.userData.e0 = mt.emissive.clone(); mt.emissive.copy(mt.userData.e0).lerp(tmpC.setRGB(1, 0.9, 0.8), hitk * 3); }
    const deadF = B.dead ? Math.min(1, B.deathT / 3) : 0;
    // a dying guardian goes off in stages: bursts of fire, rock and dust round it, then one last flash
    if (B.dead) {
      V.dieT = (V.dieT || 0) - dt;
      if (B.deathT < 3.6 && V.dieT <= 0) {
        V.dieT = 0.22 + Math.random() * 0.2;
        const ox = (Math.random() - 0.5) * 5, oy = Math.random() * 3;
        this.fx.explode(B.weak.x + ox, B.weak.y + oy - 1, 0.4, 0.55 + Math.random() * 0.5, { color: V.kind === 'gloomwing' || V.kind === 'wyrm' ? 0x9fd8ff : 0xffa060 });
        this.shake(0.25);
      }
      if (B.deathT > 3.6 && !V.finalFx) { V.finalFx = true; this.flash(B.weak.x, B.weak.y + 1, 2, 70, 0xfff0d0, 1.4, 34); this.shock(B.weak.x, B.weak.y, 1.2); this.fx.debris(B.weak.x, B.weak.y, 0.4, { n: 30, speed: 9, size: 0.3 }); this.fx.dust(B.weak.x, B.weak.y - 1, 0.4, { n: 24, s0: 1.5, s1: 5, life: 6, jit: 5, a: 0.5 }); }
    }
    // Rockjaw tunnelling under the floor throws up a line of dust and grit where it is
    if (V.kind === 'rockjaw' && B.hidden && !B.dead && Math.random() < dt * 22) {
      const fy = A.floorY;
      this.fx.dust(B.x + (Math.random() - 0.5) * 1.5, fy + 0.05, 0.4, { n: 1, s0: 0.4, s1: 1.4, life: 1.2, vy: 1.2, jit: 0.8, a: 0.45 });
      if (Math.random() < 0.3) this.fx.debris(B.x, fy + 0.1, 0.4, { n: 1, speed: 2.5, size: 0.1, dir: Math.PI / 2, cone: 1.2 });
    }
    if (V.kind === 'rockjaw' || V.kind === 'wyrm') {
      // the head leads, the segments follow its recorded path
      const head = m.head || V.root;
      V.root.position.set(B.x, B.y - deadF * 4, V.kind === 'wyrm' ? -0.4 : 0);
      V.root.visible = !B.hidden || V.kind === 'wyrm' && B.st === 'spit';
      V.root.rotation.y = B.face > 0 ? 0 : Math.PI;
      const tr = V.trail;
      const last = tr[tr.length - 1];
      if (!last || Math.hypot(B.x - last.x, B.y - last.y) > 0.35) tr.push({ x: B.x, y: B.y, hid: B.hidden });
      if (tr.length > 80) tr.shift();
      if (m.segs) {
        const n = m.segs.length;
        m.segs.forEach((s, i) => {
          let p = tr[Math.max(0, tr.length - 1 - (i + 1) * 3)] || { x: B.x, y: B.y };
          if (V.kind === 'wyrm') {
            // the body arcs back into the pool
            const f = (i + 1) / (n + 1), px = lerp(B.x, (B.sx ?? B.x) + (B.x > 22 ? -3 : 3), f), py = lerp(B.y, 1.5, f) + Math.sin(f * Math.PI) * 2.2;
            p = { x: px, y: py };
          }
          const df = B.dead ? Math.max(0, Math.min(1, (B.deathT - i * 0.12) / 2.2)) : 0;
          s.position.set(p.x + df * Math.sin(i * 1.7) * 1.2, p.y - df * df * 5.5, (V.kind === 'wyrm' ? -0.6 : -0.2) - i * 0.05);
          const q = tr[Math.max(0, tr.length - 2 - (i + 1) * 3)] || p;
          s.rotation.z = Math.atan2(p.y - q.y, p.x - q.x) + df * (i % 2 ? 1.4 : -1.2);
          s.rotation.x = df * (i % 3) * 0.6;
          s.visible = V.kind === 'wyrm' ? !(B.hidden && B.st !== 'spit') : (p.y > A.floorY - 1.2 && !(B.hidden && i < 3));
        });
      }
      if (m.maw) m.maw.scale.setScalar(1 + (B.st === 'stuck' ? 0.15 * Math.sin(t * 8) : 0));
      if (m.gills && m.gills.material) m.gills.material.emissiveIntensity = B.vuln > 0 ? 6 + Math.sin(t * 12) * 3 : 2;
    } else if (V.kind === 'gloomwing') {
      V.root.position.set(B.x, B.y - deadF * 6, -0.3);
      V.root.rotation.y = B.face > 0 ? 0 : Math.PI;
      const fallen = B.st === 'fallen';
      V.root.rotation.z = fallen ? 0.3 : B.st === 'swoop' ? -0.25 : 0;
      const fl = fallen ? 0.2 : Math.sin(t * (B.st === 'swoop' ? 9 : 5)) * 0.8;
      if (m.wingL) { m.wingL.rotation.x = fl; m.wingR.rotation.x = -fl; }
    } else if (V.kind === 'warden') {
      V.root.position.set(B.x, A.floorY - deadF * 3, -0.6);
      V.root.rotation.y = B.face > 0 ? 0 : Math.PI;
      const walk = B.st === 'idle' ? Math.sin(t * 3) : 0;
      if (m.legL) { m.legL.rotation.z = walk * 0.3; m.legR.rotation.z = -walk * 0.3; }
      const kneel = B.st === 'stuck' ? 1 : 0;
      V.root.position.y -= kneel * 0.9;
      if (m.armR) m.armR.rotation.z = B.st === 'slam' ? lerp(0, 2.8, Math.min(1, B.t / W.ramp.bossWarn)) : B.st === 'beam' ? 1.5 : kneel * -0.6;
      if (m.armL) m.armL.rotation.z = B.st === 'beam' ? 1.5 : 0;
      if (m.crystals) m.crystals.traverse((o) => { if (o.material && o.material.emissive) o.material.emissiveIntensity = B.vuln > 0 ? 5 + Math.sin(t * 10) * 2 : 2; });
      if (this.beamT > 0) {
        this.beamT -= dt;
        for (let i = 0; i < 6; i++) this.fx.fire(B.x + (this.beamDir || 1) * (2 + Math.random() * 30), this.beamY + (Math.random() - 0.5) * 0.4, 0.4, { n: 1, s: 0.9, life: 0.25, r: 0.8, g: 0.5, b: 1.4, vy: 0 });
      }
    } else if (V.kind === 'heart') {
      V.root.position.set(B.x, B.y - 6 - deadF * 5, -7);
      if (m.core && m.core.material) m.core.material.emissiveIntensity = (4 + Math.sin(t * 3) * 1.5 + (B.phase * 1.5)) * (1 + deadF * 3);
      V.root.rotation.z = deadF * 0.25 * Math.sin(t * 7);
      if (B.fists && m.fistL) {
        for (const [i, F] of B.fists.entries()) { const f = i ? m.fistR : m.fistL; f.position.set(F.x, F.y - deadF * deadF * 7, -0.8); f.rotation.z = (F.st === 'raise' ? 0.4 : 0) + deadF * (i ? 1.1 : -1.1); }
      }
      if (!CALM.on && Math.random() < dt * 6) this.fx.fire(B.x + (Math.random() - 0.5) * 10, A.floorY - 0.2, -3, { n: 1, s: 1.2, life: 1, vy: 2 });
    }
  }

  syncZones(W, dt) {
    let i = 0;
    for (const z of W.zones) {
      if (z.dead || z.shape === 'curve' && false) continue;
      let m = this.zoneMeshes[i];
      if (!m) { m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.zoneMat.clone()); m.renderOrder = 6; this.level.add(m); this.zoneMeshes[i] = m; }
      if (m.parent !== this.level) this.level.add(m);
      m.visible = true; i++;
      const live = z.t >= z.warn ? 1 : 0, f = Math.min(1, z.t / Math.max(0.01, z.warn));
      const U = m.material.uniforms;
      U.uT.value = this.time; U.uLive.value = live;
      U.uCol.value.setRGB(1, lerp(0.75, 0.15, f), lerp(0.25, 0.05, f));
      U.uA.value = (CALM.on ? 0.5 : 0.8) * (0.35 + f * 0.65);
      if (z.shape === 'rect') {
        // rolling waves throw up their element along the front
        if (z.vx && live && !CALM.on && Math.random() < dt * 40) {
          const fx = z.vx > 0 ? z.x1 : z.x0, y = z.y0 + 0.2;
          if (z.look === 'lava') this.fx.fire(fx, y + 0.3, 0.4, { n: 1, s: 1.1, life: 0.5, vy: 2 });
          else if (z.look === 'surge') this.fx.splash(fx, y + 0.6, 0.4, 0.4);
          else this.fx.dust(fx, y, 0.4, { n: 1, s0: 0.5, s1: 1.6, life: 0.9, vy: 1.6, jit: 0.8, a: 0.5 });
        }
        U.uShape.value = 0; m.rotation.set(0, 0, 0);
        m.position.set((z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2, 0.6); m.scale.set(Math.max(0.1, z.x1 - z.x0), Math.max(0.1, z.y1 - z.y0), 1);
      } else if (z.shape === 'circle') {
        U.uShape.value = 1; m.rotation.set(-Math.PI / 2, 0, 0);
        m.position.set(z.x, z.y - 0.75, 0.2); m.scale.set(z.r * 2, z.r * 2, 1);
        // the falling thing, timed to land as the warning ends
        if (z.look && z.look !== 'impact' && z.t < z.warn && !CALM.on && Math.random() < dt * 6) this.fx.dust(z.x + (Math.random() - 0.5), z.y + 8 + Math.random() * 3, 0.2, { n: 1, s0: 0.1, s1: 0.4, life: 1.2, vy: -3, a: 0.4, grav: 3 });
        if (z.look && z.look !== 'impact' && z.t >= z.warn && !z.fxDone) { z.fxDone = true; if (z.look === 'magma') this.fx.explode(z.x, z.y - 0.6, 0.3, 0.4); else if (z.look === 'splash') this.fx.splash(z.x, z.y - 0.6, 0.3, 0.8); else { this.fx.debris(z.x, z.y - 0.4, 0.3, { n: 8, speed: 4, size: 0.2 }); this.fx.dust(z.x, z.y - 0.6, 0.3, { n: 5, life: 2 }); } }
      } else if (z.shape === 'curve') {
        U.uShape.value = 1; m.rotation.set(0, 0, 0);
        const u = 0.5, x = (1 - u) * (1 - u) * z.x0 + 2 * u * (1 - u) * z.x1 + u * u * z.x2, y = (1 - u) * (1 - u) * z.y0 + 2 * u * (1 - u) * z.y1 + u * u * z.y2;
        m.position.set(x, y, 0.6); m.scale.set(3, 3, 1);
        if (Math.random() < dt * 30) { const s = Math.random(), xx = (1 - s) * (1 - s) * z.x0 + 2 * s * (1 - s) * z.x1 + s * s * z.x2, yy = (1 - s) * (1 - s) * z.y0 + 2 * s * (1 - s) * z.y1 + s * s * z.y2; this.fx.glint(xx, yy, 0.6, 0.9, [1, 0.45 + (1 - f) * 0.3, 0.2]); }
      }
    }
    for (; i < this.zoneMeshes.length; i++) this.zoneMeshes[i].visible = false;
  }

  // point-light pool: aim at the most important emitters near the camera focus
  lights(W, dt) {
    const cx = this.cam.x, cy = this.cam.y, t = this.time;
    const cand = [];
    for (const f of W.flares) if (!f.dead) cand.push({ key: 'f' + f.id, x: f.x, y: f.y + 0.4, z: 0.6, col: [1, 0.28, 0.16], int: 16 * Math.min(1, f.life / 3) * (0.85 + Math.random() * 0.3), range: TOOLS.flareRadius * 1.6, pri: 10 });
    for (const c of W.camps) if (c.lit) cand.push({ key: 'c' + c.id, x: c.x, y: c.y + 0.6, z: 0, col: [1, 0.55, 0.22], int: 9 * (0.85 + Math.sin(t * 13) * 0.08 + Math.sin(t * 7.7) * 0.07), range: 9, pri: 6 });
    for (const b of W.bombs) if (!b.dead) cand.push({ key: 'b' + b.id, x: b.x, y: b.y + 0.3, z: 0.4, col: [1, 0.6, 0.3], int: 1.5, range: 3, pri: 5 });
    if (W.boss && this.boss && W.boss.kind === 'heart') cand.push({ key: 'boss', x: W.boss.x, y: W.boss.y + 4, z: -3, col: [1, 0.35, 0.1], int: 30, range: 26, pri: 8 });
    if (W.boss && this.boss && W.boss.kind === 'warden') cand.push({ key: 'boss', x: W.boss.x, y: W.M.arena.floorY + 3, z: 1, col: [0.7, 0.45, 1], int: 8, range: 12, pri: 8 });
    for (const e of this.emitters) { if (e.int > 0) cand.push(e); }
    for (const c of cand) { const d2 = (c.x - cx) ** 2 + (c.y - cy) ** 2; c.score = (c.pri + 1) / (1 + d2 / 120); }
    cand.sort((a, b) => b.score - a.score);
    const used = new Set();
    // keep current assignments that are still wanted (no popping)
    const want = cand.slice(0, this.pool.length);
    const wantKeys = new Set(want.map((c) => c.key ?? c));
    for (const s of this.pool) if (s.key !== null && !wantKeys.has(s.key)) s.key = null;
    for (const s of this.pool) if (s.key !== null) used.add(s.key);
    for (const c of want) { const k = c.key ?? c; if (used.has(k)) continue; const s = this.pool.find((p) => p.key === null); if (!s) break; s.key = k; s.l.intensity = 0; used.add(k); }
    for (const s of this.pool) {
      const c = s.key !== null ? want.find((w) => (w.key ?? w) === s.key) : null;
      if (!c) { s.l.intensity = Math.max(0, s.l.intensity - dt * 30); continue; }
      s.l.position.set(c.x, c.y, (c.z ?? 0) + 0.8);
      s.l.color.setRGB(c.col[0], c.col[1], c.col[2]);
      s.l.distance = c.range || 9;
      const target = c.int * 0.6 * (c.flick ? 0.85 + Math.sin(t * 5 + c.x) * 0.1 + Math.sin(t * 13.1 + c.y) * 0.05 : 1);
      s.l.intensity += (target - s.l.intensity) * Math.min(1, dt * 8);
    }
    for (const F of this.flashes) { if (F.t <= 0) { F.l.intensity = 0; continue; } F.t -= dt; const f = Math.max(0, F.t / F.max); F.l.intensity = F.i0 * f * f; }
  }

  updateCamera(W, dt, o) {
    const C = this.cam, P = W.players[0], M = W.M, cam = this.camera;
    const aspect = this.w / Math.max(1, this.h);
    let tx, ty, dist;
    if (W.boss && M.arena) {
      const A = M.arena;
      const span = A.x1 - A.x0 + 2;
      dist = Math.max(span * 0.5 / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) / aspect, 22) * 0.92;
      tx = lerp((A.x0 + A.x1) / 2, P.x, 0.25); ty = A.floorY + 7.5 + (aspect < 1 ? 2 : 0);
      if (aspect < 1) { tx = lerp((A.x0 + A.x1) / 2, P.x, 0.65); dist = Math.min(dist, 36); }
    } else {
      dist = aspect < 1 ? 19 : aspect < 1.4 ? 17 : 15.5;
      tx = P.x + P.face * 1.4 + P.vx * 0.25; ty = P.y + 1.3 + (P.state === 'climb' ? P.vy * 0.3 : 0);
    }
    if (C.cine) {
      C.cine.t += dt;
      const f = Math.min(1, C.cine.t / 1.2) * Math.min(1, Math.max(0, (C.cine.dur - C.cine.t) / 1.0));
      tx = lerp(tx, C.cine.x, f); ty = lerp(ty, C.cine.y, f); dist = lerp(dist, C.cine.d, f);
      if (C.cine.t > C.cine.dur) C.cine = null;
    }
    if (o.title) { tx = o.title.x; ty = o.title.y; dist = o.title.d; }
    const k = 1 - Math.exp(-dt * (C.cine ? 2 : 4.2));
    C.x += (tx - C.x) * k; C.y += (ty - C.y) * k; C.d += (dist - C.d) * (1 - Math.exp(-dt * 2.5));
    C.shake = Math.max(0, C.shake - dt * 1.6); C.kick = Math.max(0, C.kick - dt * 3);
    const sh = C.shake * C.shake * 0.45, t = this.time;
    const sx = Math.sin(t * 37) * sh + Math.sin(t * 17.3) * sh * 0.6, sy = Math.cos(t * 31) * sh + C.kick * 0.25 * Math.sin(t * 50);
    cam.position.set(C.x + sx + (o.title ? Math.sin(t * 0.13) * 1.5 : 0), C.y + 1.6 + sy, C.d);
    cam.lookAt(C.x + sx * 0.5, C.y + sy * 0.5, 0);
  }
  cinematic(x, y, d, dur) { this.cam.cine = { x, y, d, dur, t: 0 }; }
  // world -> screen (for HUD popups)
  toScreen(x, y, z = 0) { tmpV.set(x, y, z).project(this.camera); return [(tmpV.x * 0.5 + 0.5) * this.w, (-tmpV.y * 0.5 + 0.5) * this.h, tmpV.z < 1]; }
}
function t2(R) { return R.time; }
