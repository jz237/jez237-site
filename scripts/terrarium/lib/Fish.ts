import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {TANK} from './Case';
import {WATER_LEVEL, POOL, PLUNGE, poolDepth} from './Ground';
import {foliageUniforms} from './Foliage';

/**
 * A school of neon tetras (Paracheirodon innesi, about 2.4 cm) in the pool.
 *
 * Each fish is sculpted in code: a laterally flattened body lofted from
 * measured-looking height and width profiles, a forked tail, dorsal, adipose,
 * anal, pelvic and pectoral fins with rays, and large silvery eyes. The shader
 * paints the iridescent stripe (blue to green with the viewing angle), the red
 * rear half, the silver belly and the scales, and bends the body in a travelling
 * wave whose beat follows the swimming speed. They school as boids inside the
 * water that is deep enough for them, dart from fingers, rain, lightning and the
 * wading dragon, rise to flakes from the Feed tool and rest low at night (when,
 * like real neons, their colours fade).
 */
const N_FISH = 14;
const LEN = 0.024;
const MAX_FLAKES = 40;

// body profiles along u (0 = tail end, 1 = snout), in body lengths
const HH: [number, number][] = [[0, 0.044], [0.08, 0.048], [0.22, 0.085], [0.42, 0.126], [0.58, 0.134], [0.72, 0.122], [0.84, 0.097], [0.93, 0.066], [1, 0.0]];
const HW: [number, number][] = [[0, 0.018], [0.08, 0.022], [0.28, 0.042], [0.52, 0.056], [0.72, 0.055], [0.86, 0.046], [0.95, 0.03], [1, 0.0]];
function profile(pts: [number, number][], u: number) {
  if (u <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (u <= pts[i][0]) {
      const [u0, v0] = pts[i - 1], [u1, v1] = pts[i];
      let t = (u - u0) / (u1 - u0);
      t = t * t * (3 - 2 * t);
      return v0 + (v1 - v0) * t;
    }
  }
  return pts[pts.length - 1][1];
}
// the snout is rounded rather than pinched
const hh = (u: number) => u > 0.9 ? profile(HH, 0.9) * Math.sqrt(Math.max(0, 1 - ((u - 0.9) / 0.1) ** 2)) : profile(HH, u);
const hw = (u: number) => u > 0.9 ? profile(HW, 0.9) * Math.sqrt(Math.max(0, 1 - ((u - 0.9) / 0.1) ** 2)) : profile(HW, u);

/** Body and eyes (opaque); local x forward (head at +0.5), y up, z to the right; one body length = 1. */
function bodyGeometry() {
  const M = 34, R = 22;
  const pos: number[] = [], sect: number[] = [], eye: number[] = [], idx: number[] = [];
  for (let i = 0; i < M; i++) {
    const u = 0.5 - 0.5 * Math.cos((Math.PI * i) / (M - 1));
    const h = hh(Math.min(u, 0.995)), w = hw(Math.min(u, 0.995));
    // the belly is a little fuller than the back, and the back rises to a ridge
    const cy = -0.008 * Math.sin(Math.PI * u);
    for (let j = 0; j < R; j++) {
      const a = (j / R) * Math.PI * 2;
      const s = Math.sin(a), c = Math.cos(a);
      const y = cy + h * s * (s > 0 ? 1 : 0.94);
      const z = w * c * (1 - 0.18 * Math.max(0, s) ** 3);
      pos.push(u - 0.5, y, z);
      sect.push(u, s, 0, 0);
      eye.push(0, 0, 0);
    }
  }
  for (let i = 0; i < M - 1; i++) for (let j = 0; j < R; j++) {
    const a = i * R + j, b = i * R + (j + 1) % R, c = a + R, d = b + R;
    idx.push(a, c, b, b, c, d);
  }
  // close the tail end and the snout
  const tailC = pos.length / 3; pos.push(-0.5, 0, 0); sect.push(0, 0, 0, 0); eye.push(0, 0, 0);
  const noseC = pos.length / 3; pos.push(0.5, -0.004, 0); sect.push(1, 0, 0, 0); eye.push(0, 0, 0);
  for (let j = 0; j < R; j++) {
    idx.push(tailC, j, (j + 1) % R);
    idx.push(noseC, (M - 1) * R + (j + 1) % R, (M - 1) * R + j);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aSect', new THREE.Float32BufferAttribute(sect, 4));
  g.setAttribute('aEye', new THREE.Float32BufferAttribute(eye, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  // big, slightly bulging eyes
  const parts = [g];
  for (const side of [1, -1]) {
    const e = new THREE.SphereGeometry(0.048, 18, 12);
    e.scale(1, 1, 0.5);
    const ep = e.attributes.position as THREE.BufferAttribute;
    const es = new Float32Array(ep.count * 4), ee = new Float32Array(ep.count * 3);
    for (let i = 0; i < ep.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(ep, i).normalize();
      es.set([0.87, 0, 2, 0], i * 4);
      ee.set([v.x, v.y, v.z * side], i * 3);
    }
    e.translate(0.37, 0.016, side * (hw(0.87) - 0.016));
    e.setAttribute('aSect', new THREE.BufferAttribute(es, 4));
    e.setAttribute('aEye', new THREE.BufferAttribute(ee, 3));
    e.deleteAttribute('uv');
    parts.push(e);
  }
  return mergeGeometries(parts)!;
}

/** The fins (translucent): aSect = (u at the root, t along the rays, s across, fin type). */
function finGeometry() {
  const parts: THREE.BufferGeometry[] = [];
  const grid = (type: number, nt: number, ns: number, at: (t: number, s: number) => THREE.Vector3, sRange: [number, number] = [0, 1]) => {
    const pos: number[] = [], sect: number[] = [], idx: number[] = [];
    for (let i = 0; i <= nt; i++) for (let j = 0; j <= ns; j++) {
      const t = i / nt, s = sRange[0] + (sRange[1] - sRange[0]) * (j / ns);
      const p = at(t, s);
      pos.push(p.x, p.y, p.z);
      sect.push(p.x + 0.5, t, s, type);
    }
    for (let i = 0; i < nt; i++) for (let j = 0; j < ns; j++) {
      const a = i * (ns + 1) + j, b = a + 1, c = a + ns + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aSect', new THREE.Float32BufferAttribute(sect, 4));
    g.setIndex(idx);
    g.computeVertexNormals();
    parts.push(g);
  };
  // forked tail: longer lobes above and below, a notch in the middle
  grid(1, 8, 12, (t, s) => {
    const L = 0.1 + 0.13 * Math.pow(Math.abs(s), 1.4);
    return new THREE.Vector3(-0.49 - t * L, s * (0.04 + 0.13 * Math.pow(t, 0.75)), 0);
  }, [-1, 1]);
  // dorsal fin, raked back
  grid(2, 6, 6, (t, s) => {
    const u = 0.44 + 0.12 * s, x = u - 0.5;
    const top = hh(u) * 0.97 - 0.004;
    return new THREE.Vector3(x - t * (0.05 + 0.02 * (1 - s)), top + t * (0.07 + 0.035 * s), 0);
  });
  // the small adipose fin near the tail
  grid(3, 4, 4, (t, s) => {
    const u = 0.15 + 0.05 * s, x = u - 0.5;
    return new THREE.Vector3(x - t * 0.015, hh(u) * 0.95 + t * (0.022 + 0.008 * Math.sin(Math.PI * s)), 0);
  });
  // anal fin: a long base under the rear half, deepest at the front
  grid(4, 6, 10, (t, s) => {
    const u = 0.1 + 0.3 * s, x = u - 0.5;
    const bot = -hh(u) * 0.92 - 0.006;
    return new THREE.Vector3(x - t * 0.035, bot - t * (0.035 + 0.045 * s), 0);
  });
  // pelvic and pectoral fins, a pair each
  for (const side of [1, -1]) {
    grid(5, 5, 4, (t, s) => {
      const u = 0.55 + 0.03 * s, x = u - 0.5;
      return new THREE.Vector3(x - t * 0.05, -hh(u) * 0.86 - t * 0.03, side * (0.012 + t * 0.012));
    });
    grid(6, 5, 4, (t, s) => {
      const x = 0.27, y = -0.03 + 0.02 * s;
      return new THREE.Vector3(x - t * 0.065, y - t * 0.012, side * (hw(0.77) - 0.004 + t * 0.03));
    });
  }
  return mergeGeometries(parts)!;
}

/** Vertex wave shared by body and fins: a travelling wave to the tail, a turn bend and fin flutter. */
const WAVE_GLSL = /* glsl */ `
attribute vec4 aSect; attribute float aBeat; attribute float aAmp; attribute float aBend; attribute float aTint;
uniform float uFishTime;
varying vec4 vSect; varying float vTint;
vec3 fishWave(vec3 p){
  float u = p.x + 0.5;
  float tailw = 1.0 - clamp(u, -0.3, 1.0);
  float env = 0.012 + 0.17 * tailw * tailw;
  float ph = aBeat * 6.28318 - u * 5.2;
  float dz = aAmp * env * sin(ph) + aBend * (u - 0.62) * (u - 0.62) * 0.9;
  // pectoral fins scull in small strokes; the others ripple a little at their edges
  if (aSect.w > 5.5) dz += aSect.y * sin(uFishTime * 13.0 + aTint * 30.0) * 0.018 * sign(p.z);
  else if (aSect.w > 0.5) dz += aSect.y * aSect.y * sin(uFishTime * 7.0 + aSect.z * 4.0 + aTint * 9.0) * 0.006;
  return vec3(p.x, p.y, p.z + dz);
}
float fishSlope(vec3 p){
  float u = p.x + 0.5;
  float tailw = 1.0 - clamp(u, -0.3, 1.0);
  float env = 0.012 + 0.17 * tailw * tailw;
  float ph = aBeat * 6.28318 - u * 5.2;
  return aAmp * (-0.34 * tailw * sin(ph) - env * 5.2 * cos(ph)) + aBend * 2.0 * (u - 0.62) * 0.9;
}`;

function addWave(s: {vertexShader: string; uniforms: Record<string, THREE.IUniform>}, shared: Record<string, THREE.IUniform>) {
  Object.assign(s.uniforms, shared);
  s.vertexShader = s.vertexShader
    .replace('#include <common>', `#include <common>\n${WAVE_GLSL}\nattribute vec3 aEye; varying vec3 vEye;`)
    .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
{
  float k = fishSlope(position);
  objectNormal = normalize(vec3(objectNormal.x - objectNormal.z * k, objectNormal.y, objectNormal.z + objectNormal.x * k));
}`)
    .replace('#include <begin_vertex>', `#include <begin_vertex>
transformed = fishWave(position);
vSect = aSect; vTint = aTint; vEye = aEye;`);
}

const BODY_FRAG = /* glsl */ `
uniform float uDay; uniform vec3 uKeyDirView, uKeyColor;
varying vec4 vSect; varying float vTint; varying vec3 vEye;
float fh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// small overlapping scales: distance to the nearest scale centre on a staggered grid
vec2 fishScales(vec2 p){
  vec2 q = vec2(p.x, p.y + 0.5 * mod(floor(p.x), 2.0));
  vec2 c = fract(q) - 0.5;
  float d = length(c * vec2(1.0, 1.25));
  return vec2(d, fh(floor(q)));
}`;

export class FishSchool {
  readonly group = new THREE.Group();
  private body: THREE.InstancedMesh;
  private fins: THREE.InstancedMesh;
  private fish: {p: THREE.Vector3; v: THREE.Vector3; size: number; beat: number; cruise: number; burst: number; yaw: number; yawRate: number; tint: number; wander: THREE.Vector3}[] = [];
  private aBeat: THREE.InstancedBufferAttribute;
  private aAmp: THREE.InstancedBufferAttribute;
  private aBend: THREE.InstancedBufferAttribute;
  private home = new THREE.Vector3(PLUNGE.x + 0.09, WATER_LEVEL - 0.02, PLUNGE.z + 0.02);
  private homeT = 0;
  readonly uniforms = {uFishTime: {value: 0}, uDay: {value: 1}, uKeyDirView: foliageUniforms.uKeyDirView, uKeyColor: foliageUniforms.uKeyColor};
  /** Food on (or sinking through) the water. */
  private flakes: {p: THREE.Vector3; size: number; age: number; spin: number}[] = [];
  private flakeMesh: THREE.InstancedMesh;
  private time = 0;
  /** A fish snapped at a flake on the surface (a tiny ring). */
  onBite?: (x: number, z: number) => void;

  constructor() {
    const bg = bodyGeometry(), fg = finGeometry();
    const tint = new Float32Array(N_FISH);
    for (let i = 0; i < N_FISH; i++) tint[i] = Math.random();
    this.aBeat = new THREE.InstancedBufferAttribute(new Float32Array(N_FISH), 1).setUsage(THREE.DynamicDrawUsage);
    this.aAmp = new THREE.InstancedBufferAttribute(new Float32Array(N_FISH), 1).setUsage(THREE.DynamicDrawUsage);
    this.aBend = new THREE.InstancedBufferAttribute(new Float32Array(N_FISH), 1).setUsage(THREE.DynamicDrawUsage);
    const aTint = new THREE.InstancedBufferAttribute(tint, 1);
    for (const g of [bg, fg]) {
      g.setAttribute('aBeat', this.aBeat);
      g.setAttribute('aAmp', this.aAmp);
      g.setAttribute('aBend', this.aBend);
      g.setAttribute('aTint', aTint);
    }
    if (!fg.attributes.aEye) fg.setAttribute('aEye', new THREE.Float32BufferAttribute(new Float32Array(fg.attributes.position.count * 3), 3));
    this.body = new THREE.InstancedMesh(bg, this.bodyMaterial(), N_FISH);
    this.fins = new THREE.InstancedMesh(fg, this.finMaterial(), N_FISH);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.fins.renderOrder = 1;
    for (const m of [this.body, this.fins]) {
      m.frustumCulled = false;
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }
    this.body.name = 'neon-tetras';
    this.group.add(this.body, this.fins);
    // start as a loose school over the deep pocket
    for (let i = 0; i < N_FISH; i++) {
      const p = this.home.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.05));
      this.keepInWater(p);
      const a = Math.random() * Math.PI * 2;
      this.fish.push({p, v: new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(0.03), size: LEN * (0.85 + Math.random() * 0.25), beat: Math.random(), cruise: 0.03 + Math.random() * 0.02, burst: 0, yaw: a, yawRate: 0, tint: tint[i], wander: new THREE.Vector3()});
    }
    // fish food: little torn flakes, orange and green
    const fl = new THREE.CircleGeometry(0.0016, 6);
    const fp = fl.attributes.position as THREE.BufferAttribute;
    for (let i = 1; i < fp.count; i++) fp.setXYZ(i, fp.getX(i) * (0.6 + Math.random() * 0.7), fp.getY(i) * (0.6 + Math.random() * 0.7), 0);
    fl.rotateX(-Math.PI / 2);
    this.flakeMesh = new THREE.InstancedMesh(fl, new THREE.MeshStandardMaterial({roughness: 0.8, side: THREE.DoubleSide}), MAX_FLAKES);
    this.flakeMesh.setColorAt(0, new THREE.Color(0.5, 0.2, 0.05));
    this.flakeMesh.count = 0;
    this.flakeMesh.frustumCulled = false;
    this.flakeMesh.name = 'fish-flakes';
    this.group.add(this.flakeMesh);
    this.sync();
  }

  private bodyMaterial() {
    const m = new THREE.MeshPhysicalMaterial({color: 0xffffff, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25});
    m.onBeforeCompile = (s) => {
      addWave(s, this.uniforms);
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>\n${BODY_FRAG}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
float u = vSect.x, yN = vSect.y, part = vSect.z;
float isEye = step(1.5, part);
// colours fade at night, as a resting neon's do
float vivid = mix(0.35, 1.0, uDay);
// back: translucent olive-green with a darker dorsal line and faint speckles
vec3 back = mix(vec3(0.13, 0.13, 0.075), vec3(0.06, 0.065, 0.04), smoothstep(0.72, 1.0, yN));
back *= 0.92 + 0.16 * fh(floor(vec2(u * 70.0, yN * 10.0)));
// belly: silver white
vec3 belly = vec3(0.62, 0.63, 0.66);
vec3 col = mix(belly, back, smoothstep(-0.1, 0.55, yN));
// the red rear half below the stripe, from the tail root to mid-body
float red = smoothstep(0.03, 0.1, u) * (1.0 - smoothstep(0.42, 0.56, u)) * (1.0 - smoothstep(-0.05, 0.12, yN)) * smoothstep(-1.0, -0.55, yN) * 1.2;
col = mix(col, vec3(0.62, 0.025, 0.02) * mix(0.75, 1.15, vTint), clamp(red, 0.0, 1.0) * vivid);
// the neon stripe: eye to adipose fin, a little above the midline
float stripeBand = smoothstep(0.02, 0.1, yN) * (1.0 - smoothstep(0.32, 0.42, yN));
float stripe = stripeBand * smoothstep(0.14, 0.24, u) * (1.0 - smoothstep(0.84, 0.9, u));
// head: translucent silver, a darker gill cover edge and snout
float head = smoothstep(0.78, 0.84, u);
col = mix(col, vec3(0.34, 0.34, 0.36), head * (1.0 - stripe));
col *= 1.0 - 0.35 * exp(-(((u - 0.8) / 0.012) * ((u - 0.8) / 0.012))) * smoothstep(-0.8, 0.2, yN);
col *= 1.0 - 0.4 * smoothstep(0.96, 1.0, u);
// scales: thin darker rims and a little sheen from scale to scale
vec2 sc = fishScales(vec2(u * 34.0, yN * 5.0));
col *= (0.93 + 0.07 * (1.0 - smoothstep(0.3, 0.42, sc.x))) * (0.97 + 0.06 * sc.y);
// the eye: a big black pupil in a dark silver iris, blue-green across its top
float er = length(vEye.xy);
float front = step(0.0, vEye.z);
float pupil = (1.0 - smoothstep(0.46, 0.52, er)) * front;
vec3 iris = mix(vec3(0.16, 0.17, 0.18), vec3(0.05, 0.3, 0.32), smoothstep(0.1, 0.7, vEye.y));
vec3 eyeC = mix(iris, vec3(0.01, 0.01, 0.012), pupil);
eyeC = mix(eyeC, col * 0.8, smoothstep(0.82, 0.97, er));
col = mix(col, eyeC, isEye);
diffuseColor.rgb = col;`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(mix(0.42, 0.22, 1.0 - smoothstep(-0.6, 0.2, yN)), 0.06, isEye);`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  // iridescence: the stripe is a stack of reflecting platelets, blue face-on,
  // turning green-cyan at a glancing view, brightest at the lamp's mirror angle
  vec3 V = normalize(vViewPosition);
  vec3 Nn = normalize(normal);
  float glance = pow(1.0 - abs(dot(Nn, V)), 1.3);
  vec3 irid = mix(vec3(0.03, 0.22, 1.0), vec3(0.05, 0.85, 0.62), glance);
  float spec = pow(max(0.0, dot(reflect(V, Nn), uKeyDirView)), 5.0);
  float lit = dot(uKeyColor, vec3(0.33));
  totalEmissiveRadiance += irid * stripe * vivid * (0.08 + 0.55 * lit * (0.35 + spec)) * (1.0 - isEye);
  diffuseColor.rgb = mix(diffuseColor.rgb, irid * 0.35, stripe * vivid * (1.0 - isEye));
  // light through the thin fish
  totalEmissiveRadiance += diffuseColor.rgb * uKeyColor * max(0.0, dot(-Nn, uKeyDirView)) * 0.25 * (1.0 - isEye);
}`);
    };
    m.customProgramCacheKey = () => 'neon-body-1';
    return m;
  }

  private finMaterial() {
    const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.4, transparent: true, depthWrite: false, side: THREE.DoubleSide});
    m.onBeforeCompile = (s) => {
      addWave(s, this.uniforms);
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>\n${BODY_FRAG}`)
        .replace('#include <color_fragment>', `#include <color_fragment>
float type = vSect.w, t = vSect.y, s = vSect.z;
// fin rays from the root to the edge, with the membrane between them
float rays = type < 1.5 ? 11.0 : type < 2.5 ? 7.0 : type < 3.5 ? 1.0 : type < 4.5 ? 14.0 : 5.0;
float ray = 1.0 - smoothstep(0.0, 0.16, abs(fract(s * rays) - 0.5) - 0.32);
float a = 0.14 + 0.2 * ray * (1.0 - t * 0.5);
vec3 col = vec3(0.72, 0.72, 0.7);
// a faint red at the tail's root, and the white leading edge of the anal fin
float vivid = mix(0.35, 1.0, uDay);
col = mix(col, vec3(0.6, 0.06, 0.04), (type < 1.5 ? 1.0 - smoothstep(0.0, 0.35, t) : 0.0) * 0.6 * vivid);
float lead = type > 3.5 && type < 4.5 ? smoothstep(0.82, 0.98, s) : 0.0;
col = mix(col, vec3(0.95), lead);
a += lead * 0.35 + (1.0 - smoothstep(0.0, 0.12, t)) * 0.12;
// ragged, softly fading edges
a *= 1.0 - smoothstep(0.85, 1.0, t) * 0.6;
diffuseColor.rgb = col;
diffuseColor.a = a;`);
    };
    m.customProgramCacheKey = () => 'neon-fins-1';
    return m;
  }

  /** Water deep enough to swim in here (m); 0 outside the pool. */
  private depth(x: number, z: number) {
    if (Math.abs(x) > TANK.w / 2 - 0.012 || z > TANK.d / 2 - 0.006) return 0;
    return poolDepth(x, z);
  }

  /** Puts a point back into the water: under the surface, above the bed, in water deep enough. */
  private keepInWater(p: THREE.Vector3, prev?: THREE.Vector3) {
    if (this.depth(p.x, p.z) < 0.008 && prev && this.depth(prev.x, prev.z) >= 0.008) {p.x = prev.x; p.z = prev.z;}
    const d = this.depth(p.x, p.z);
    const top = WATER_LEVEL - 0.0035, bot = WATER_LEVEL - d + 0.004;
    p.y = THREE.MathUtils.clamp(p.y, Math.min(bot, top), top);
  }

  /** Something disturbed the water at (x, z): fish nearby dart away. */
  startle(x: number, z: number, strength = 1, radius = 0.12) {
    for (const f of this.fish) {
      const dx = f.p.x - x, dz = f.p.z - z;
      const d = Math.hypot(dx, dz);
      if (d > radius) continue;
      const k = strength * (1 - d / radius);
      const away = d > 1e-4 ? new THREE.Vector3(dx / d, 0, dz / d) : new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
      f.v.addScaledVector(away, 0.25 * k + 0.05);
      f.v.y -= 0.03 * k;
      f.burst = Math.max(f.burst, 0.6 * k + 0.2);
    }
  }

  /** A pinch of flakes scattered on the water at (x, z). Returns false if that is not water. */
  feed(x: number, z: number) {
    if (poolDepth(x, z) <= 0) return false;
    for (let i = 0; i < 9 && this.flakes.length < MAX_FLAKES; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 0.025;
      this.flakes.push({p: new THREE.Vector3(x + Math.cos(a) * r, WATER_LEVEL + 0.0003, z + Math.sin(a) * r), size: 0.8 + Math.random() * 0.6, age: 0, spin: Math.random() * 6.28});
    }
    return true;
  }

  /**
   * @param threats points in the water to keep clear of (the wading dragon), with radii
   * @param day 0 night .. 1 day
   * @param wind surface drift for the flakes (m/s)
   */
  update(dt: number, threats: {p: THREE.Vector3; r: number}[], day: number, wind: THREE.Vector2) {
    this.time += dt;
    this.uniforms.uFishTime.value = this.time;
    this.uniforms.uDay.value = THREE.MathUtils.smoothstep(day, 0.05, 0.5);
    const night = day < 0.2;
    // the school's favourite spot wanders about the deeper water
    this.homeT -= dt;
    if (this.homeT < 0) {
      this.homeT = 6 + Math.random() * 10;
      for (let k = 0; k < 20; k++) {
        const x = POOL.cx + (Math.random() - 0.5) * POOL.rx * 1.6, z = POOL.cz + (Math.random() - 0.5) * POOL.rz * 1.6;
        const d = this.depth(x, z);
        // not right under the falls
        if (d > (night ? 0.018 : 0.014) && Math.hypot(x - PLUNGE.x - 0.03, z - PLUNGE.z) > 0.05) {this.home.set(x, WATER_LEVEL - d * (night ? 0.75 : 0.45), z); break;}
      }
    }
    // flakes: float, drift, soak and sink, and are nibbled away
    for (const fl of this.flakes) {
      fl.age += dt;
      if (fl.p.y > WATER_LEVEL) {
        fl.p.x += wind.x * 0.05 * dt; fl.p.z += wind.y * 0.05 * dt;
        if (fl.age > 18 + fl.spin * 2) fl.p.y = WATER_LEVEL - 0.0005;
      } else {
        const bed = WATER_LEVEL - poolDepth(fl.p.x, fl.p.z) + 0.0004;
        fl.p.y = Math.max(bed, fl.p.y - 0.004 * dt);
      }
      if (poolDepth(fl.p.x, fl.p.z) <= 0) {fl.p.x -= wind.x * 0.05 * dt; fl.p.z -= wind.y * 0.05 * dt;}
    }
    this.flakes = this.flakes.filter((f) => f.size > 0.15 && f.age < 120);
    const sep = new THREE.Vector3(), ali = new THREE.Vector3(), coh = new THREE.Vector3(), acc = new THREE.Vector3(), tmp = new THREE.Vector3();
    for (const f of this.fish) {
      sep.set(0, 0, 0); ali.set(0, 0, 0); coh.set(0, 0, 0); acc.set(0, 0, 0);
      let n = 0;
      for (const o of this.fish) {
        if (o === f) continue;
        const d = f.p.distanceTo(o.p);
        if (d > 0.055) continue;
        n++;
        ali.add(o.v);
        coh.add(o.p);
        if (d < 0.02) sep.add(tmp.subVectors(f.p, o.p).multiplyScalar((0.02 - d) / Math.max(d, 1e-4)));
      }
      if (n) {
        ali.divideScalar(n).sub(f.v);
        coh.divideScalar(n).sub(f.p);
        acc.addScaledVector(sep, 9).addScaledVector(ali, night ? 0.4 : 1.4).addScaledVector(coh, night ? 0.3 : 1.1);
      }
      // drawn back towards the school's spot (more strongly when strayed far)
      tmp.subVectors(this.home, f.p);
      acc.addScaledVector(tmp, 0.35 + 3 * Math.max(0, tmp.length() - 0.12));
      // wander
      f.wander.x += (Math.random() - 0.5) * dt * 2; f.wander.z += (Math.random() - 0.5) * dt * 2; f.wander.y += (Math.random() - 0.5) * dt * 0.6;
      f.wander.multiplyScalar(Math.exp(-dt * 0.8));
      acc.addScaledVector(f.wander, 0.06);
      // shallow water ahead: turn towards the deeper side
      const sp = f.v.length();
      const dir = sp > 1e-4 ? tmp.copy(f.v).divideScalar(sp) : tmp.set(1, 0, 0);
      const ax = f.p.x + dir.x * 0.03, az = f.p.z + dir.z * 0.03;
      if (this.depth(ax, az) < 0.012) {
        const e = 0.012;
        const gx = this.depth(f.p.x + e, f.p.z) - this.depth(f.p.x - e, f.p.z);
        const gz = this.depth(f.p.x, f.p.z + e) - this.depth(f.p.x, f.p.z - e);
        acc.x += Math.sign(gx) * 0.6 - dir.x * 0.4;
        acc.z += Math.sign(gz) * 0.6 - dir.z * 0.4;
      }
      // the falls' churn
      const fdx = f.p.x - PLUNGE.x - 0.03, fdz = f.p.z - PLUNGE.z, fd = Math.hypot(fdx, fdz);
      if (fd < 0.045) {acc.x += (fdx / Math.max(fd, 1e-3)) * 0.8; acc.z += (fdz / Math.max(fd, 1e-3)) * 0.8;}
      // keep clear of the dragon
      for (const th of threats) {
        const dx = f.p.x - th.p.x, dz = f.p.z - th.p.z, d = Math.hypot(dx, dz);
        if (d < th.r) {
          acc.x += (dx / Math.max(d, 1e-3)) * 2.5 * (1 - d / th.r);
          acc.z += (dz / Math.max(d, 1e-3)) * 2.5 * (1 - d / th.r);
          f.burst = Math.max(f.burst, 0.3 * (1 - d / th.r));
        }
      }
      // food: rise to the nearest flake and snap at it
      if (!night && this.flakes.length) {
        let best: (typeof this.flakes)[number] | null = null, bd = 0.22;
        for (const fl of this.flakes) {const d = f.p.distanceTo(fl.p); if (d < bd) {bd = d; best = fl;}}
        if (best) {
          tmp.subVectors(best.p, f.p);
          acc.addScaledVector(tmp.normalize(), 0.5 + 0.6 * (1 - bd / 0.22));
          if (bd < 0.006 && Math.random() < dt * 4) {
            best.size -= 0.25;
            f.v.addScaledVector(tmp, -0.05);
            if (best.p.y > WATER_LEVEL - 0.001) this.onBite?.(best.p.x, best.p.z);
          }
        }
      }
      // vertical comfort band: mid-water by day, low at night
      const dHere = this.depth(f.p.x, f.p.z);
      const wantY = WATER_LEVEL - dHere * (night ? 0.75 : 0.45);
      acc.y += (wantY - f.p.y) * 2.5;
      // speed: an easy cruise, bursts when startled
      f.burst = Math.max(0, f.burst - dt * 1.4);
      const cruise = (night ? 0.008 : f.cruise) + f.burst * 0.32;
      f.v.addScaledVector(acc, dt);
      f.v.y *= Math.exp(-dt * 3);
      // steering turns them; the speed eases to the cruise (or the burst)
      const s2 = f.v.length();
      if (s2 > 1e-5) f.v.multiplyScalar((s2 + (cruise - s2) * (1 - Math.exp(-dt * 2.5))) / s2);
      const prev = f.p.clone();
      f.p.addScaledVector(f.v, dt);
      this.keepInWater(f.p, prev);
      // heading, turn rate and the tail beat that goes with the speed
      const sp2 = Math.hypot(f.v.x, f.v.z);
      if (sp2 > 1e-4) {
        const yaw = Math.atan2(-f.v.z, f.v.x);
        let dy = yaw - f.yaw;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        const turn = THREE.MathUtils.clamp(dy, -dt * 9, dt * 9);
        f.yaw += turn;
        f.yawRate = THREE.MathUtils.lerp(f.yawRate, turn / Math.max(dt, 1e-3), 1 - Math.exp(-dt * 8));
      }
      const spd = f.v.length();
      f.beat += dt * (2.5 + spd * 75);
    }
    this.sync();
  }

  private sync() {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, 'YZX'), s = new THREE.Vector3();
    this.fish.forEach((f, i) => {
      const spd = f.v.length();
      const pitch = THREE.MathUtils.clamp(Math.atan2(f.v.y, Math.hypot(f.v.x, f.v.z) + 1e-4) * 0.7, -0.45, 0.45);
      e.set(THREE.MathUtils.clamp(-f.yawRate * 0.05, -0.35, 0.35), f.yaw, pitch);
      q.setFromEuler(e);
      s.setScalar(f.size);
      m.compose(f.p, q, s);
      this.body.setMatrixAt(i, m);
      this.fins.setMatrixAt(i, m);
      this.aBeat.setX(i, f.beat % 1000);
      this.aAmp.setX(i, 0.3 + Math.min(1, spd / 0.15) * 0.55);
      this.aBend.setX(i, THREE.MathUtils.clamp(-f.yawRate * 0.06, -0.35, 0.35));
    });
    this.body.instanceMatrix.needsUpdate = this.fins.instanceMatrix.needsUpdate = true;
    this.aBeat.needsUpdate = this.aAmp.needsUpdate = this.aBend.needsUpdate = true;
    // flakes
    const fm = new THREE.Matrix4(), c = new THREE.Color();
    this.flakes.forEach((fl, i) => {
      fm.compose(fl.p, q.setFromEuler(e.set(0.2 * Math.sin(fl.spin * 3), fl.spin, 0.2 * Math.cos(fl.spin * 5))), s.setScalar(Math.max(0.2, fl.size)));
      this.flakeMesh.setMatrixAt(i, fm);
      this.flakeMesh.setColorAt(i, c.setRGB(...((fl.spin * 7) % 1 < 0.55 ? [0.55, 0.16, 0.03] : (fl.spin * 7) % 1 < 0.8 ? [0.22, 0.32, 0.05] : [0.6, 0.45, 0.12]) as [number, number, number]));
    });
    this.flakeMesh.count = this.flakes.length;
    this.flakeMesh.instanceMatrix.needsUpdate = true;
    if (this.flakeMesh.instanceColor) this.flakeMesh.instanceColor.needsUpdate = true;
  }

  /** Where the fish are (for tests and the camera). */
  positions() {return this.fish.map((f) => f.p);}
}
