import * as THREE from 'three';
import { rng } from './materials.js';

// Flashing star glints: additive point sprites that ride on jewels and gilt edges, plus a drifting cloud of motes.
// One shared ShaderMaterial; point size is derived from the live render-target height so insets stay correct.
const uniforms = { uTime: { value: 0 }, uViewH: { value: 1000 }, uGain: { value: 1 } };

const vert = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aSpark; // phase, rate, size (world units)
  attribute vec3 aDrift; // drift speed, drift span, sway
  uniform float uTime;
  uniform float uViewH;
  varying vec3 vColor;
  varying float vAmp;
  void main() {
    vec3 p = position;
    float edge = 1.0;
    if (aDrift.y > 0.0) {
      p.y = mod(position.y + uTime * aDrift.x, aDrift.y);
      float k = p.y / aDrift.y;
      edge = smoothstep(0.0, 0.1, k) * smoothstep(1.0, 0.9, k);
      p.x += sin(uTime * 0.6 + aSpark.x) * aDrift.z;
      p.z += cos(uTime * 0.5 + aSpark.x * 1.3) * aDrift.z;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float tw = sin(uTime * aSpark.y + aSpark.x);
    float flash = pow(max(0.0, tw), 7.0);
    float glow = 0.3 + 0.14 * sin(uTime * aSpark.y * 0.37 + aSpark.x * 2.1);
    vAmp = (glow + flash * 1.6) * edge;
    vColor = aColor;
    float sc = length(modelMatrix[0].xyz);
    gl_PointSize = clamp(aSpark.z * (0.5 + 0.9 * flash) * sc * projectionMatrix[1][1] * uViewH * 0.5 / max(0.1, -mv.z), 1.0, 70.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const frag = /* glsl */ `
  uniform float uGain;
  varying vec3 vColor;
  varying float vAmp;
  void main() {
    vec2 q = gl_PointCoord * 2.0 - 1.0;
    float d = length(q);
    if (d > 1.0) discard;
    float core = exp(-d * d * 14.0);
    float halo = exp(-d * 4.0) * 0.16;
    float cross = (exp(-abs(q.x) * 20.0) * exp(-abs(q.y) * 2.4) + exp(-abs(q.y) * 20.0) * exp(-abs(q.x) * 2.4));
    vec2 r = vec2(q.x + q.y, q.x - q.y) * 0.7071;
    float diag = (exp(-abs(r.x) * 26.0) * exp(-abs(r.y) * 4.0) + exp(-abs(r.y) * 26.0) * exp(-abs(r.x) * 4.0)) * 0.45;
    float a = core + halo + cross + diag;
    vec3 col = mix(vColor, vec3(1.0), clamp(core * vAmp, 0.0, 0.7));
    gl_FragColor = vec4(col * a * vAmp * uGain, 1.0);
  }
`;

const makeMaterial = (gain) =>
  new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uViewH: uniforms.uViewH, uGain: { value: gain } },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  });
export const glintMaterial = makeMaterial(1);
const moteMaterial = makeMaterial(1);

const viewport = new THREE.Vector4();
function syncView(renderer) {
  renderer.getViewport(viewport);
  uniforms.uViewH.value = viewport.w * renderer.getPixelRatio();
}

function makePoints(items, { drift = false, material = glintMaterial } = {}) {
  const n = items.length;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const spk = new Float32Array(n * 3);
  const dr = new Float32Array(n * 3);
  items.forEach((it, i) => {
    pos.set(it.pos, i * 3);
    col.set(it.color, i * 3);
    spk.set([it.phase, it.rate, it.size], i * 3);
    if (drift) dr.set(it.drift, i * 3);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aSpark', new THREE.BufferAttribute(spk, 3));
  g.setAttribute('aDrift', new THREE.BufferAttribute(dr, 3));
  const pts = new THREE.Points(g, material);
  pts.frustumCulled = false;
  pts.onBeforeRender = (renderer) => syncView(renderer);
  return pts;
}

const TINT = {
  white: [1.0, 0.96, 0.86],
  gold: [1.0, 0.72, 0.28],
  ruby: [1.0, 0.25, 0.45],
  sapphire: [0.35, 0.55, 1.0],
  emerald: [0.25, 1.0, 0.6],
  aqua: [0.3, 0.95, 1.0],
  violet: [0.75, 0.4, 1.0],
  amber: [1.0, 0.65, 0.2],
};
const TINT_KEYS = Object.keys(TINT);
export const tint = (name) => TINT[name] || TINT.white;

// Glint records live on a Batch (see geo.js); attach a Points object to every built mesh that carries them.
export function addGlints(root, seed = 4242) {
  const r = rng(seed);
  let count = 0;
  root.traverse((o) => {
    const list = o.isMesh && o.userData.glints;
    if (!list || !list.length) return;
    const items = list.map((g) => ({
      pos: g.pos,
      color: g.color.map((c) => c * (g.hot || 1)),
      phase: r() * 6.283,
      rate: g.rate || 1.4 + r() * 3.4,
      size: g.size,
    }));
    o.add(makePoints(items));
    count += items.length;
  });
  return count;
}

// A slow cloud of drifting, twinkling motes around the bloom.
export function buildMotes({ n = 360, seed = 77, box = { x: 34, y0: -40, y1: 24, z0: -14, z1: 16 } } = {}) {
  const r = rng(seed);
  const span = box.y1 - box.y0;
  const items = [];
  for (let i = 0; i < n; i++) {
    const t = TINT[TINT_KEYS[Math.floor(r() * TINT_KEYS.length)]];
    items.push({
      pos: [(r() * 2 - 1) * box.x, r() * span, box.z0 + r() * (box.z1 - box.z0)],
      color: t.map((c) => c * (0.9 + r() * 0.8)),
      phase: r() * 6.283,
      rate: 1.1 + r() * 3.2,
      size: 0.11 + r() * 0.22,
      drift: [0.5 + r() * 0.9, span, 0.3 + r() * 0.7],
    });
  }
  const pts = makePoints(items, { drift: true, material: moteMaterial });
  pts.name = 'motes';
  pts.position.y = box.y0;
  return pts;
}

export function setSparkleTime(t) {
  uniforms.uTime.value = t;
}

// Air motes are additive, so they vanish on the light parchment backdrop; fade them in with the dark one.
export function setMoteGain(g) {
  moteMaterial.uniforms.uGain.value = g;
}
