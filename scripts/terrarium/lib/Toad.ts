import * as THREE from 'three';
import {TANK} from './Case';
import {WATER_LEVEL, PLUNGE, poolDistance, poolDepth} from './Ground';
import type {Surface} from './Surface';

/**
 * An Oriental fire-bellied toad (Bombina orientalis), about 4 cm long: bright
 * green and warty above with black blotches, scarlet with black spots below,
 * gold eyes with heart-shaped pupils. It sits on the bank, floats in the pool
 * with only its eyes and back above the water, swims with frog kicks and hops
 * on land. Threatened (the dragon close by, or a poke) it does the unken
 * reflex: arches its back and turns up its palms and soles to flash the red
 * warning colours, then makes for the water. After dark it calls, a soft
 * "oop" with its throat swelling. Timings are illustrative.
 */

const HALF = 0.0172; // half the body length (snout to vent ~ 3.5 cm)
const SIT_Y = 0.0072; // body centre above the ground when sitting
const FLOAT_Y = WATER_LEVEL - 0.0036; // body centre when floating: eyes and back above water

type V3 = THREE.Vector3;
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const smooth = (a: number, b: number, x: number) => {const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t);};

// ---------------------------------------------------------------------------
// Geometry

/** The body: a flattened, blunt-snouted ovoid with a low hump over the hips. */
function bodyGeometry() {
  const g = new THREE.SphereGeometry(1, 64, 40);
  g.rotateZ(-Math.PI / 2); // poles at the snout (+x) and the vent (-x)
  const pos = g.attributes.position as THREE.BufferAttribute;
  const n = pos.count;
  const aU = new Float32Array(n), aCy = new Float32Array(n), pat = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i);
    const u = px;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    const cy = s > 1e-4 ? py / s : 0, cz = s > 1e-4 ? pz / s : 0;
    const blunt = Math.pow(s, u > 0 ? 0.5 : 0.62);
    // broad and flat: widest over the hips, the head nearly as wide, the snout rounded
    const w = 0.0122 * (1 - 0.1 * u - 0.16 * u * u) * (1 + 0.06 * Math.exp(-(((u + 0.35) / 0.3) ** 2)));
    const top = 0.0062 * (1 + 0.22 * Math.exp(-(((u + 0.3) / 0.45) ** 2))) * (1 - 0.32 * smooth(0.3, 1, u));
    const bot = 0.0042 * (1 - 0.3 * smooth(0.4, 1, u));
    let y = cy * (cy > 0 ? top : bot) * blunt;
    const x = u * HALF * (u > 0 ? 1.0 : 1.05);
    const z = cz * w * blunt;
    y -= 0.0011 * smooth(0.45, 1, u); // the snout dips
    pos.setXYZ(i, x, y, z);
    aU[i] = u; aCy[i] = cy;
    pat.set([x * 1000, y * 1000, z * 1000], i * 3);
  }
  g.computeVertexNormals();
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  const dors = new Float32Array(n);
  for (let i = 0; i < n; i++) dors[i] = smooth(-0.72, -0.3, nrm.getY(i)); // red only underneath
  g.setAttribute('aU', new THREE.BufferAttribute(aU, 1));
  g.setAttribute('aCy', new THREE.BufferAttribute(aCy, 1));
  g.setAttribute('aPat', new THREE.BufferAttribute(pat, 3));
  g.setAttribute('aDorsal', new THREE.BufferAttribute(dors, 1));
  return g;
}

/**
 * Limbs and digits as tubes whose rings are rebuilt each frame from the joint
 * positions (in the toad's own frame). Each vertex also knows how much it faces
 * the limb's back (green) or its underside (red).
 */
class Tubes {
  readonly geometry = new THREE.BufferGeometry();
  private pos: Float32Array;
  private nrm: Float32Array;
  private dors: Float32Array;
  private offsets: number[] = [];
  constructor(readonly specs: {rings: number}[], readonly sides = 7) {
    let verts = 0;
    const idx: number[] = [];
    const pat: number[] = [];
    specs.forEach((s, t) => {
      this.offsets.push(verts);
      for (let r = 0; r < s.rings; r++) for (let k = 0; k < sides; k++) {
        const a = (k / sides) * Math.PI * 2;
        pat.push(t * 37 + r * 1.6, Math.cos(a) * 1.4, Math.sin(a) * 1.4);
      }
      for (let r = 0; r < s.rings - 1; r++) for (let k = 0; k < sides; k++) {
        const a = verts + r * sides + k, b = verts + r * sides + ((k + 1) % sides), c = a + sides, d = b + sides;
        idx.push(a, c, b, b, c, d);
      }
      verts += s.rings * sides;
    });
    this.pos = new Float32Array(verts * 3);
    this.nrm = new Float32Array(verts * 3);
    this.dors = new Float32Array(verts);
    const g = this.geometry;
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('normal', new THREE.BufferAttribute(this.nrm, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aDorsal', new THREE.BufferAttribute(this.dors, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aPat', new THREE.Float32BufferAttribute(pat, 3));
    g.setIndex(idx);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 0.08);
  }
  private t = new THREE.Vector3(); private n1 = new THREE.Vector3(); private n2 = new THREE.Vector3(); private c = new THREE.Vector3();
  /** Sets tube `i` through `pts` (one ring per point) with radii `r`; `ref` points to the limb's back. */
  set(i: number, pts: V3[], r: number[], ref: V3) {
    const S = this.sides, base = this.offsets[i];
    for (let j = 0; j < pts.length; j++) {
      const a = pts[Math.max(0, j - 1)], b = pts[Math.min(pts.length - 1, j + 1)];
      this.t.subVectors(b, a);
      if (this.t.lengthSq() < 1e-12) this.t.set(1, 0, 0);
      this.t.normalize();
      this.n1.copy(ref).addScaledVector(this.t, -ref.dot(this.t));
      if (this.n1.lengthSq() < 1e-8) this.n1.set(0, 0, 1).addScaledVector(this.t, -this.t.z);
      this.n1.normalize();
      this.n2.crossVectors(this.t, this.n1);
      for (let k = 0; k < S; k++) {
        const ang = (k / S) * Math.PI * 2;
        const ca = Math.cos(ang), sa = Math.sin(ang);
        this.c.set(this.n1.x * ca + this.n2.x * sa, this.n1.y * ca + this.n2.y * sa, this.n1.z * ca + this.n2.z * sa);
        const o = (base + j * S + k);
        this.pos[o * 3] = pts[j].x + this.c.x * r[j];
        this.pos[o * 3 + 1] = pts[j].y + this.c.y * r[j];
        this.pos[o * 3 + 2] = pts[j].z + this.c.z * r[j];
        this.nrm[o * 3] = this.c.x; this.nrm[o * 3 + 1] = this.c.y; this.nrm[o * 3 + 2] = this.c.z;
        this.dors[o] = smooth(-0.6, -0.1, ca);
      }
    }
  }
  commit() {
    const g = this.geometry;
    (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.normal as THREE.BufferAttribute).needsUpdate = true;
    (g.attributes.aDorsal as THREE.BufferAttribute).needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// Materials

const SKIN_GLSL = /* glsl */ `
varying vec3 vPat; varying float vDors; varying float vMouth;
float th(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float tn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(th(i), th(i + vec3(1, 0, 0)), f.x), mix(th(i + vec3(0, 1, 0)), th(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(th(i + vec3(0, 0, 1)), th(i + vec3(1, 0, 1)), f.x), mix(th(i + vec3(0, 1, 1)), th(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float tf(vec3 p){ return 0.5 * tn(p) + 0.25 * tn(p * 2.1 + 3.0) + 0.125 * tn(p * 4.3 + 7.0); }
// warts: the nearest of a scatter of tubercles (x = 0..1 dome, y = id)
vec2 warts(vec3 p){
  vec3 i = floor(p), f = fract(p);
  float best = 0.0, id = 0.0;
  for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec3 n = vec3(float(x), float(y), float(z));
    vec3 h = vec3(th(i + n), th(i + n + 17.0), th(i + n + 41.0));
    vec3 r = n + h - f;
    float R = 0.32 + 0.25 * h.x;
    float d = length(r) / R;
    float dome = 1.0 - d * d;
    if (dome > best) { best = dome; id = h.y; }
  }
  return vec2(best, id);
}
`;

function skinMaterial(body: boolean) {
  const m = new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.48, clearcoat: 0.75, clearcoatRoughness: 0.28});
  const u = {uThroat: {value: 0}, uBreath: {value: 0}, uArch: {value: 0}};
  m.userData.u = u;
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>
attribute vec3 aPat; attribute float aDorsal; varying vec3 vPat; varying float vDors; varying float vMouth;
uniform float uThroat, uBreath, uArch;
${body ? 'attribute float aU; attribute float aCy;' : ''}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vPat = aPat; vDors = aDorsal; vMouth = 0.0;
${body ? `
// the throat pumps (and swells when it calls); the flanks breathe; the back arches
float throat = smoothstep(0.3, 0.6, aU) * (1.0 - smoothstep(0.85, 1.0, aU)) * smoothstep(-0.1, -0.6, aCy);
transformed.y -= uThroat * 0.0042 * throat;
transformed.z *= 1.0 + uThroat * 0.25 * throat;
transformed.z *= 1.0 + uBreath * 0.035 * (1.0 - aU * aU);
transformed.y += uArch * 0.0055 * aU * aU;
vMouth = smoothstep(0.5, 0.7, aU) * (1.0 - smoothstep(0.035, 0.1, abs(aCy + 0.15)));` : ''}`);
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
${SKIN_GLSL}
float toadH = 0.0;`)
      .replace('#include <color_fragment>', `#include <color_fragment>
{
  vec3 p = vPat;
  // the back: bright grass green, warmer towards the flanks, blotched with black
  float g = tf(p * 0.35);
  vec3 back = mix(vec3(0.055, 0.2, 0.03), vec3(0.17, 0.36, 0.05), g);
  float blot = smoothstep(0.55, 0.6, tf(p * 0.2 + 3.0) + 0.14 * tn(p * 1.1));
  back = mix(back, vec3(0.015, 0.02, 0.01), blot);
  // the belly: scarlet-orange with black spots and a fine reticulation
  vec3 belly = mix(vec3(0.62, 0.07, 0.015), vec3(0.85, 0.24, 0.03), tf(p * 0.4 + 9.0));
  float spot = smoothstep(0.58, 0.64, tf(p * 0.22 + 21.0) + 0.1 * tn(p * 1.4));
  belly = mix(belly, vec3(0.02, 0.012, 0.01), spot);
  // between them the flank grades through a dusky band
  vec3 col = mix(belly, back, smoothstep(0.25, 0.75, vDors));
  col = mix(col, col * 0.45, (1.0 - abs(vDors * 2.0 - 1.0)) * 0.35);
  // warts on the back, the bigger ones tipped black
  vec2 w = warts(p * 0.85);
  float wk = smoothstep(0.35, 0.7, vDors);
  col = mix(col, mix(col * 1.2, col * 0.35, step(0.8, w.y) * smoothstep(0.6, 0.9, w.x)), wk * smoothstep(0.0, 0.3, w.x));
  // the line of the mouth
  col = mix(col, vec3(0.01, 0.012, 0.008), vMouth * 0.85);
  toadH = (w.x > 0.0 ? w.x * w.x : 0.0) * 0.25 * wk + 0.03 * tn(p * 4.0);
  diffuseColor.rgb = col;
}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  // the warts as a bump (pattern units are millimetres)
  vec3 sx = dFdx(-vViewPosition) * 1000.0, sy = dFdy(-vViewPosition) * 1000.0;
  vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
  float det = dot(sx, r1) * faceDirection;
  vec3 grad = sign(det) * (dFdx(toadH) * r1 + dFdy(toadH) * r2);
  vec3 b = abs(det) * normal - grad;
  float l2 = dot(b, b);
  if (l2 > 1e-14 && l2 < 1e14) normal = b * inversesqrt(l2);
}`);
  };
  m.customProgramCacheKey = () => body ? 'toad-skin-body-v1' : 'toad-skin-limb-v1';
  return m;
}

/** The eye: a gold iris netted with black around a heart-shaped pupil, under a wet cornea. */
function eyeMaterial() {
  const m = new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.04});
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vEyeN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvEyeN = normalize(position);');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vEyeN;
float eh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float en(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(eh(i), eh(i + vec2(1, 0)), f.x), mix(eh(i + vec2(0, 1)), eh(i + vec2(1, 1)), f.x), f.y); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
{
  // the eye looks out, up and a little forward
  vec3 gz = normalize(vec3(0.3, 0.55, 0.78));
  vec3 e1 = normalize(cross(vec3(0.0, 1.0, 0.0), gz)), e2 = cross(gz, e1);
  vec3 n = normalize(vEyeN);
  float c = dot(n, gz);
  vec2 q = vec2(dot(n, e1), dot(n, e2));
  float r = length(q);
  // heart-shaped pupil, point down
  vec2 hq = vec2(abs(q.x), q.y + 0.05);
  float heart = hq.y * 1.15 + hq.x * 1.35 - 0.12 * smoothstep(0.0, 0.18, hq.x) * smoothstep(-0.05, 0.12, hq.y);
  float pupil = (1.0 - smoothstep(0.17, 0.2, heart + abs(q.x) * 0.25)) * (1.0 - smoothstep(0.24, 0.28, length(q * vec2(1.0, 1.25))));
  float ang = atan(q.y, q.x);
  vec3 iris = mix(vec3(0.42, 0.28, 0.05), vec3(0.75, 0.55, 0.14), en(vec2(ang * 7.0, r * 30.0)));
  iris = mix(iris, vec3(0.04, 0.03, 0.01), smoothstep(0.55, 0.75, en(vec2(ang * 12.0, r * 50.0))) * 0.75);
  iris = mix(iris, vec3(0.05, 0.035, 0.01), smoothstep(0.5, 0.62, r));
  vec3 col = mix(iris, vec3(0.005), pupil);
  // beyond the iris the eyeball is in the lids: the green of the head
  col = mix(vec3(0.05, 0.16, 0.03), col, smoothstep(0.45, 0.6, c));
  diffuseColor.rgb = col;
}`);
  };
  m.customProgramCacheKey = () => 'toad-eye-v1';
  return m;
}

// ---------------------------------------------------------------------------
// Poses: joint positions in the toad's frame (+x forward, +y up, +z right) for the right side

interface Pose {shoulder: V3; elbow: V3; wrist: V3; fingers: number[]; hip: V3; knee: V3; ankle: V3; foot: V3; toes: number[]; toeDir: number}
const POSES: Record<string, Pose> = {
  // sitting: forelegs propped, hind legs folded in a Z beside the body
  sit: {shoulder: v(0.0072, -0.0015, 0.0085), elbow: v(0.0088, -0.0042, 0.0148), wrist: v(0.0142, -0.0074, 0.0142), fingers: [-0.45, 0.05, 0.5, 0.95],
    hip: v(-0.0125, -0.0015, 0.0075), knee: v(-0.0015, -0.0032, 0.0195), ankle: v(-0.0145, -0.0058, 0.0168), foot: v(-0.0072, -0.0074, 0.0215), toes: [-0.25, 0.08, 0.4, 0.72, 1.05], toeDir: 1},
  // floating: limbs spread, hind feet trailing
  float: {shoulder: v(0.008, -0.0012, 0.0072), elbow: v(0.0118, -0.002, 0.0152), wrist: v(0.0168, -0.0026, 0.0188), fingers: [-0.2, 0.3, 0.8, 1.3],
    hip: v(-0.0135, -0.0012, 0.0064), knee: v(-0.0185, -0.0016, 0.0198), ankle: v(-0.0295, -0.002, 0.0152), foot: v(-0.036, -0.0024, 0.0192), toes: [-0.2, 0.15, 0.5, 0.85, 1.2], toeDir: -1},
  // the kick / the push of a hop: hind legs straight out behind
  kick: {shoulder: v(0.008, -0.0012, 0.0072), elbow: v(0.0095, -0.003, 0.0118), wrist: v(0.0075, -0.004, 0.0128), fingers: [-1.6, -1.25, -0.9, -0.55],
    hip: v(-0.0135, -0.0012, 0.0064), knee: v(-0.026, -0.0018, 0.0108), ankle: v(-0.04, -0.0024, 0.0082), foot: v(-0.0485, -0.0028, 0.009), toes: [-0.3, -0.12, 0.05, 0.22, 0.4], toeDir: -1},
  // the unken reflex: limbs lifted and turned so the red palms and soles face up
  unken: {shoulder: v(0.008, -0.0008, 0.0072), elbow: v(0.0088, 0.0008, 0.0138), wrist: v(0.0118, 0.0034, 0.0158), fingers: [-0.3, 0.2, 0.7, 1.2],
    hip: v(-0.0135, -0.0008, 0.0064), knee: v(-0.0115, 0.0028, 0.0162), ankle: v(-0.0195, 0.0058, 0.0118), foot: v(-0.0155, 0.0085, 0.0168), toes: [-0.2, 0.15, 0.5, 0.85, 1.2], toeDir: 1},
};
const FINGER_LEN = [0.0035, 0.0046, 0.0052, 0.004];
const TOE_LEN = [0.0038, 0.0052, 0.0068, 0.0078, 0.0055];

type Mode = 'sit' | 'hop' | 'float' | 'swim' | 'unken';

export class Toad {
  readonly group = new THREE.Group();
  private body: THREE.Mesh;
  private bodyMat: THREE.MeshPhysicalMaterial;
  private eyes: THREE.Mesh[] = [];
  private tubes: Tubes;
  readonly pos = new THREE.Vector3();
  heading = 2.4;
  private pitch = 0;
  private mode: Mode = 'sit';
  private timer = 6;
  private w = {sit: 1, float: 0, kick: 0, unken: 0};
  private target = new THREE.Vector3();
  private hopFrom = new THREE.Vector3();
  private hopT = -1;
  private hopDur = 0.34;
  private hopsLeft = 0;
  private kickT = -1;
  private vel = new THREE.Vector3();
  private blinkT = 2;
  private blink = 0;
  private breathPh = 0;
  private callT = 0;
  private calling = 0;
  private unkenCool = 0;
  private after: 'water' | 'shore' = 'shore';
  private shore: [number, number][] = [];
  private pond: [number, number][] = [];
  /** A splash or ring on the water at (x, z): strength 0..1. */
  onRipple?: (x: number, z: number, strength: number) => void;
  /** A call after dark (pan -1..1). */
  onCall?: (pan: number) => void;

  constructor(private surface: Surface) {
    this.bodyMat = skinMaterial(true);
    this.body = new THREE.Mesh(bodyGeometry(), this.bodyMat);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.group.add(this.body);
    const eg = new THREE.SphereGeometry(0.0027, 28, 20);
    const em = eyeMaterial();
    for (const side of [1, -1]) {
      const e = new THREE.Mesh(eg, em);
      e.scale.z = side; // the left eye is the right one mirrored
      e.castShadow = true;
      this.eyes.push(e);
      this.group.add(e);
    }
    // four limbs, then 4 + 4 fingers and 5 + 5 toes
    const specs: {rings: number}[] = [];
    for (let i = 0; i < 4; i++) specs.push({rings: 6});
    for (let i = 0; i < 18; i++) specs.push({rings: 4});
    this.tubes = new Tubes(specs, 7);
    const limbs = new THREE.Mesh(this.tubes.geometry, skinMaterial(false));
    limbs.castShadow = true;
    limbs.receiveShadow = true;
    limbs.frustumCulled = false;
    this.group.add(limbs);
    this.group.name = 'toad';
    // where it can sit on the bank, and where it can float
    for (let x = -0.02; x <= 0.6; x += 0.012) for (let z = -0.06; z <= 0.235; z += 0.012) {
      if (Math.abs(x) > TANK.w / 2 - 0.03 || Math.abs(z) > TANK.d / 2 - 0.025) continue;
      const pd = poolDistance(x, z);
      const nearFalls = Math.hypot(x - PLUNGE.x, z - PLUNGE.z) < 0.1;
      if (pd > 0.006 && pd < 0.04 && surface.heightAt(x, z) < WATER_LEVEL + 0.03 && !nearFalls && surface.normalAt(x, z).y > 0.85) this.shore.push([x, z]);
      if (poolDepth(x, z) > 0.016 && !nearFalls) this.pond.push([x, z]);
    }
    const start = this.nearest(this.shore, 0.5, 0.12) ?? [0.5, 0.12];
    this.pos.set(start[0], this.groundY(start[0], start[1]), start[1]);
    this.update(0, {threats: [], night: 0});
  }

  private nearest(list: [number, number][], x: number, z: number) {
    let best: [number, number] | null = null, bd = Infinity;
    for (const p of list) {const d = Math.hypot(p[0] - x, p[1] - z); if (d < bd) {bd = d; best = p;}}
    return best;
  }
  private pick(list: [number, number][], awayFrom?: V3) {
    if (!list.length) return null;
    let best = list[0], score = -Infinity;
    for (let k = 0; k < 12; k++) {
      const p = list[Math.floor(Math.random() * list.length)];
      const d = Math.hypot(p[0] - this.pos.x, p[1] - this.pos.z);
      let s = -Math.abs(d - 0.1) + Math.random() * 0.05;
      if (awayFrom) s = Math.hypot(p[0] - awayFrom.x, p[1] - awayFrom.z) - d * 0.3;
      if (s > score) {score = s; best = p;}
    }
    return best;
  }
  private inWater(x = this.pos.x, z = this.pos.z) {return poolDepth(x, z) > 0.009;}
  private groundY(x: number, z: number) {
    const g = this.surface.heightAt(x, z) + SIT_Y;
    return poolDistance(x, z) < 0 ? Math.max(g, FLOAT_Y) : g;
  }

  /** Did the pointer ray touch the toad? */
  hit(ray: THREE.Ray) {return ray.distanceToPoint(this.pos) < 0.016;}

  /** A poke (or the dragon looming): the warning display, then away. */
  poke(from?: V3) {
    if (this.mode === 'unken') return;
    this.mode = 'unken';
    this.timer = 2.4 + Math.random() * 1.6;
    this.unkenCool = 9;
    this.after = 'water';
    if (from) this.target.copy(from);
    else this.target.set(this.pos.x + Math.cos(this.heading), 0, this.pos.z - Math.sin(this.heading));
  }

  private startHops(tx: number, tz: number) {
    this.target.set(tx, 0, tz);
    this.mode = 'hop';
    this.hopsLeft = Math.max(1, Math.ceil(Math.hypot(tx - this.pos.x, tz - this.pos.z) / 0.05));
    this.hopT = -0.15;
  }
  private startSwim(tx: number, tz: number) {
    this.target.set(tx, 0, tz);
    this.mode = 'swim';
    this.kickT = 0;
  }

  update(dt: number, ctx: {threats: {p: V3; r: number}[]; night: number}) {
    this.unkenCool -= dt;
    // the dragon close by: the warning display (on land or in the water)
    for (const t of ctx.threats) {
      const d = Math.hypot(t.p.x - this.pos.x, t.p.z - this.pos.z);
      if (d < t.r && this.unkenCool <= 0 && this.mode !== 'unken') this.poke(t.p);
      // never under its feet
      if (d < 0.045 && d > 1e-4 && this.mode !== 'unken') {
        this.pos.x += (this.pos.x - t.p.x) / d * (0.045 - d) * Math.min(1, dt * 6);
        this.pos.z += (this.pos.z - t.p.z) / d * (0.045 - d) * Math.min(1, dt * 6);
      }
    }
    const want = {sit: 0, float: 0, kick: 0, unken: 0};
    let arch = 0;
    switch (this.mode) {
      case 'sit': this.sit(dt, ctx, want); break;
      case 'float': this.floatAbout(dt, ctx, want); break;
      case 'hop': this.hop(dt, want); break;
      case 'swim': this.swim(dt, want); break;
      case 'unken': {
        want.unken = 1;
        arch = 1;
        this.timer -= dt;
        if (this.timer <= 0) {
          // away from whatever alarmed it, into the deep water if it can
          const threat = this.target.clone();
          const p = this.pick(this.pond, threat) ?? this.pick(this.shore, threat);
          if (p) {
            if (this.inWater()) this.startSwim(p[0], p[1]);
            else {const edge = this.nearest(this.shore, p[0], p[1]); this.startHops(...(this.inWater(p[0], p[1]) ? p : (edge ?? p))); this.after = 'water';}
          } else this.mode = 'sit';
        }
        break;
      }
    }
    // blend the pose weights
    const k = 1 - Math.exp(-dt * (this.mode === 'unken' ? 7 : 9));
    for (const key of ['sit', 'float', 'kick', 'unken'] as const) this.w[key] += (want[key] - this.w[key]) * k;
    // stay inside the glass
    this.pos.x = Math.max(-TANK.w / 2 + 0.025, Math.min(TANK.w / 2 - 0.025, this.pos.x));
    this.pos.z = Math.max(-TANK.d / 2 + 0.022, Math.min(TANK.d / 2 - 0.022, this.pos.z));
    // blinking, breathing and calling
    this.blinkT -= dt;
    if (this.blinkT < 0) {this.blink = 1; this.blinkT = 2.5 + Math.random() * 6;}
    this.blink = Math.max(0, this.blink - dt * 7);
    this.breathPh += dt * (this.mode === 'unken' ? 9 : 5.5);
    let throat = 0.12 + 0.12 * Math.sin(this.breathPh);
    if (ctx.night > 0.55 && (this.mode === 'sit' || this.mode === 'float')) {
      this.callT -= dt;
      if (this.callT < 0) {
        this.callT = Math.random() < 0.15 ? 8 + Math.random() * 20 : 1.1 + Math.random() * 0.9;
        this.calling = 1;
        this.onCall?.(Math.max(-1, Math.min(1, this.pos.x / (TANK.w / 2))) * 0.7);
      }
    }
    this.calling = Math.max(0, this.calling - dt * 3.2);
    throat = Math.max(throat, Math.sin(Math.min(1, this.calling) * Math.PI) * 1.2);
    const u = this.bodyMat.userData.u as {uThroat: {value: number}; uBreath: {value: number}; uArch: {value: number}};
    u.uThroat.value = throat;
    u.uBreath.value = Math.sin(this.breathPh * 0.35);
    u.uArch.value += (arch - u.uArch.value) * Math.min(1, dt * 6);
    this.pose();
  }

  private sit(dt: number, ctx: {night: number}, want: {sit: number; float: number}) {
    want.sit = 1;
    if (this.inWater()) {this.mode = 'float'; this.timer = 6; return;}
    this.pos.y = this.groundY(this.pos.x, this.pos.z);
    this.timer -= dt;
    if (this.timer > 0) return;
    // mostly back into the water (more so at night and in the rain); sometimes along the bank
    if (Math.random() < 0.6 + 0.2 * ctx.night) {
      const p = this.pick(this.pond);
      if (p) {const edge = this.nearest(this.pond, this.pos.x, this.pos.z); if (edge) {this.startHops(edge[0], edge[1]); this.after = 'water'; return;}}
    }
    const s = this.pick(this.shore);
    if (s) {this.startHops(s[0], s[1]); this.after = 'shore';} else this.timer = 5;
  }

  private floatAbout(dt: number, ctx: {night: number}, want: {float: number}) {
    want.float = 1;
    if (!this.inWater()) {this.mode = 'sit'; this.timer = 4; return;}
    // drifting, barely moving: a little sway on the surface
    this.vel.multiplyScalar(Math.exp(-dt * 1.5));
    this.pos.addScaledVector(this.vel, dt);
    this.pos.y += (FLOAT_Y + Math.sin(this.breathPh * 0.3) * 0.0004 - this.pos.y) * Math.min(1, dt * 4);
    this.timer -= dt;
    if (this.timer > 0) return;
    if (Math.random() < 0.55 - 0.25 * ctx.night) {
      // out onto the bank
      const s = this.pick(this.shore);
      const edge = s ? this.nearest(this.pond, s[0], s[1]) : null;
      if (s && edge) {this.startSwim(edge[0], edge[1]); this.after = 'shore'; this.target.set(edge[0], 0, edge[1]); this.hopFrom.set(s[0], 0, s[1]); return;}
    }
    const p = this.pick(this.pond);
    if (p) {this.startSwim(p[0], p[1]); this.after = 'water';} else this.timer = 6;
  }

  private turnTo(tx: number, tz: number, dt: number, rate: number) {
    const a = Math.atan2(-(tz - this.pos.z), tx - this.pos.x);
    let d = a - this.heading;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    this.heading += Math.max(-rate * dt, Math.min(rate * dt, d));
    return Math.abs(d);
  }

  private hop(dt: number, want: {sit: number; kick: number}) {
    const off = this.turnTo(this.target.x, this.target.z, dt, 5);
    if (this.hopT < 0) {
      // crouched between hops, turning to face the way
      want.sit = 1;
      this.hopT += dt;
      this.pos.y = this.groundY(this.pos.x, this.pos.z);
      if (this.hopT >= 0 && off < 0.4) {
        const d = Math.hypot(this.target.x - this.pos.x, this.target.z - this.pos.z);
        if (d < 0.008 || this.hopsLeft <= 0) {this.arrive(); return;}
        this.hopFrom.copy(this.pos);
        const step = Math.min(d, 0.035 + Math.random() * 0.025);
        this.vel.set(Math.cos(this.heading) * step, 0, -Math.sin(this.heading) * step);
        this.hopDur = 0.28 + step * 3;
        this.hopT = 0;
        this.hopsLeft--;
      } else if (this.hopT >= 0) this.hopT = -0.05;
      return;
    }
    this.hopT += dt;
    const t = Math.min(1, this.hopT / this.hopDur);
    want.kick = t < 0.7 ? 1 : 0;
    want.sit = t < 0.7 ? 0 : 1;
    const x = this.hopFrom.x + this.vel.x * t, z = this.hopFrom.z + this.vel.z * t;
    const y0 = this.hopFrom.y, y1 = this.groundY(x, z);
    this.pos.set(x, y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (0.012 + this.vel.length() * 0.2), z);
    this.pitch = (0.5 - t) * 0.7;
    if (t >= 1) {
      this.hopT = -(0.25 + Math.random() * 0.7);
      if (this.inWater()) {this.onRipple?.(x, z, 0.6); this.arrive(); return;}
    }
  }

  private swim(dt: number, want: {float: number; kick: number}) {
    want.float = 1;
    this.turnTo(this.target.x, this.target.z, dt, 3);
    this.kickT += dt;
    const ph = this.kickT % 0.75;
    // each stroke: a quick kick back, then a glide with the legs drawn up again
    if (ph < 0.16) {
      want.kick = 1; want.float = 0;
      const push = 0.11 * dt / 0.16;
      this.vel.x += Math.cos(this.heading) * push;
      this.vel.z -= Math.sin(this.heading) * push;
      if (ph < dt) this.onRipple?.(this.pos.x - Math.cos(this.heading) * 0.03, this.pos.z + Math.sin(this.heading) * 0.03, 0.25);
    }
    this.vel.multiplyScalar(Math.exp(-dt * 2.2));
    const nx = this.pos.x + this.vel.x * dt, nz = this.pos.z + this.vel.z * dt;
    if (this.inWater(nx, nz)) {this.pos.x = nx; this.pos.z = nz;} else this.vel.multiplyScalar(0.3);
    this.pos.y += (FLOAT_Y - this.pos.y) * Math.min(1, dt * 4);
    this.pitch *= Math.exp(-dt * 4);
    const d = Math.hypot(this.target.x - this.pos.x, this.target.z - this.pos.z);
    if (d < 0.012 || this.kickT > 12) {
      if (this.after === 'shore') {this.startHops(this.hopFrom.x, this.hopFrom.z); this.after = 'shore';}
      else {this.mode = 'float'; this.timer = 8 + Math.random() * 18;}
    }
  }

  private arrive() {
    this.vel.set(0, 0, 0);
    if (this.inWater()) {this.mode = 'float'; this.timer = 8 + Math.random() * 18;} else {this.mode = 'sit'; this.timer = 7 + Math.random() * 16;}
  }

  // the pose: joints from the blended poses, then the tubes, eyes and the root
  private J = Array.from({length: 8}, () => new THREE.Vector3());
  private tmp = new THREE.Vector3();
  private blendPoint(key: 'shoulder' | 'elbow' | 'wrist' | 'hip' | 'knee' | 'ankle' | 'foot', out: V3, side: number) {
    out.set(0, 0, 0);
    let sum = 0;
    for (const name of ['sit', 'float', 'kick', 'unken'] as const) {
      const w = this.w[name];
      if (w < 1e-3) continue;
      out.addScaledVector(POSES[name][key], w);
      sum += w;
    }
    out.multiplyScalar(1 / Math.max(sum, 1e-3));
    out.z *= side;
    return out;
  }
  private blendFan(key: 'fingers' | 'toes', i: number) {
    let a = 0, sum = 0, dir = 0;
    for (const name of ['sit', 'float', 'kick', 'unken'] as const) {
      const w = this.w[name];
      a += POSES[name][key][i] * w;
      dir += POSES[name].toeDir * w;
      sum += w;
    }
    return {a: a / Math.max(sum, 1e-3), dir: dir / Math.max(sum, 1e-3)};
  }

  private pose() {
    const T = this.tubes, J = this.J;
    const up = new THREE.Vector3(0, 1, 0);
    const flip = new THREE.Vector3(0, 1, 0).lerp(new THREE.Vector3(0, -1, 0), this.w.unken);
    flip.y = Math.abs(flip.y) < 0.2 ? Math.sign(flip.y || 1) * 0.2 : flip.y;
    let tube = 4;
    [1, -1].forEach((side, si) => {
      const [S, E, W, H, K, A, F] = [J[0], J[1], J[2], J[3], J[4], J[5], J[6]];
      this.blendPoint('shoulder', S, side); this.blendPoint('elbow', E, side); this.blendPoint('wrist', W, side);
      this.blendPoint('hip', H, side); this.blendPoint('knee', K, side); this.blendPoint('ankle', A, side); this.blendPoint('foot', F, side);
      // foreleg: upper arm, forearm (a slight bulge at the elbow)
      T.set(si, [S, S.clone().lerp(E, 0.5), E, E.clone().lerp(W, 0.5), W, W.clone().add(this.tmp.set(0.0006, -0.0002, 0))], [0.0027, 0.0024, 0.0019, 0.0017, 0.0014, 0.0011], up);
      // hind leg: a fat thigh, the shin, the long ankle to the foot
      T.set(2 + si, [H, H.clone().lerp(K, 0.5), K, K.clone().lerp(A, 0.5), A, F], [0.0046, 0.004, 0.0027, 0.0022, 0.0016, 0.0012], up);
      // fingers fan forward from the wrist; toes from the foot (forward when sitting, back when kicking)
      for (let f = 0; f < 4; f++) {
        const {a} = this.blendFan('fingers', f);
        const L = FINGER_LEN[f];
        const d = new THREE.Vector3(Math.cos(a), -0.05, Math.sin(a) * side);
        const p1 = W.clone().addScaledVector(d, L * 0.5).add(this.tmp.set(0, 0.0004, 0)), p2 = W.clone().addScaledVector(d, L);
        T.set(tube++, [W.clone(), p1, p2, p2.clone().addScaledVector(d, 0.0006)], [0.00085, 0.0007, 0.0007, 0.00025], flip);
      }
      for (let f = 0; f < 5; f++) {
        const {a, dir} = this.blendFan('toes', f);
        const L = TOE_LEN[f];
        const fwd = Math.max(-1, Math.min(1, dir));
        const d = new THREE.Vector3(Math.cos(a) * fwd, -0.04, Math.sin(Math.abs(a)) * side * (a < 0 ? -0.6 : 1)).normalize();
        const p1 = F.clone().addScaledVector(d, L * 0.5), p2 = F.clone().addScaledVector(d, L);
        T.set(tube++, [F.clone().addScaledVector(d, -0.0012), p1, p2, p2.clone().addScaledVector(d, 0.0007)], [0.001, 0.0007, 0.00065, 0.0003], flip);
      }
    });
    T.commit();
    // eyes sink when it blinks
    this.eyes.forEach((e, i) => {
      const side = i === 0 ? 1 : -1;
      e.position.set(0.0092, 0.0043 - this.blink * 0.0022, side * 0.0062);
      e.scale.set(1, 1 - this.blink * 0.35, side);
    });
    // the root: sitting tips the head up; floating lies flat
    const tilt = this.w.sit * 0.16 + this.w.unken * 0.05 - this.w.float * 0.03 + (this.mode === 'hop' ? this.pitch : 0);
    this.group.position.copy(this.pos);
    this.group.rotation.set(0, this.heading, tilt, 'YZX');
  }
}
