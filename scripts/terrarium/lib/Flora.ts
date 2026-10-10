import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {Surface, SurfaceKind} from './Surface';
import {addFoliage} from './Foliage';
import {mulberry32} from './Textures';
import {WATER_LEVEL, poolDistance, poolDepth} from './Ground';
import {TANK} from './Case';
import {leafGeometry, stemGeometry, placeLeaf, tag} from './Plants';

/**
 * The understorey that makes the case feel lived-in: bromeliads and air
 * plants, a flowering miniature orchid, Calathea, sedges and spikemoss, small
 * ferns tucked into the rock, creeping fig climbing the peaks, mushrooms by the
 * log, twigs, pebbles, and leaves floating on the pool.
 */
const K = {bromOuter: 6, bromInner: 7, orchidLeaf: 8, petal: 9, cap: 10, stipe: 11, grass: 12, tilly: 13, spike: 14, calathea: 15, fernlet: 16, twig: 17, fig: 18, lily: 19};

type Parts = THREE.BufferGeometry[];
const up = new THREE.Vector3(0, 1, 0);

function bromeliad(rnd: () => number, size: number): Parts {
  const parts: Parts = [];
  const n = 14 + Math.floor(rnd() * 5);
  const hue = rnd();
  for (let i = 0; i < n; i++) {
    const t = i / n; // 0 outer .. 1 inner
    const leaf = leafGeometry({length: 1, width: 0.2 + 0.04 * rnd(), shape: (u) => Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + u * 0.92)), 0.5) * (1 - 0.3 * u), arch: 0.16 - 0.08 * t, cup: -0.28, wave: 0.04, twist: (rnd() - 0.5) * 0.3, segs: [14, 4]});
    const yaw = i * 2.39996 + rnd() * 0.2;
    const len = size * (0.075 - 0.035 * t) * (0.85 + 0.3 * rnd());
    const pitch = 0.28 + t * 0.95 + rnd() * 0.1;
    parts.push(tag(placeLeaf(leaf, new THREE.Vector3(0, 0.003 + t * 0.006, 0), yaw, pitch, 0, len), t > 0.55 ? K.bromInner : K.bromOuter, hue * 0.5 + t * 0.5));
  }
  return parts;
}

function tillandsia(rnd: () => number, size: number): Parts {
  const parts: Parts = [];
  const n = 22 + Math.floor(rnd() * 10);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const leaf = leafGeometry({length: 1, width: 0.09, shape: (u) => Math.pow(1 - u, 0.8) * Math.min(1, u * 8 + 0.3), arch: 0.25 + 0.2 * rnd(), cup: -0.15, segs: [10, 2]});
    const yaw = i * 2.39996;
    const pitch = 0.2 + t * 1.0 + (rnd() - 0.5) * 0.3;
    parts.push(tag(placeLeaf(leaf, new THREE.Vector3(0, 0.002, 0), yaw, pitch, (rnd() - 0.5) * 0.6, size * (0.022 + 0.014 * rnd())), K.tilly, rnd()));
  }
  return parts;
}

function orchid(rnd: () => number): Parts {
  const parts: Parts = [];
  const leaf = leafGeometry({length: 1, width: 0.42, shape: (u) => Math.pow(Math.sin(Math.PI * Math.min(1, 0.08 + u * 0.95)), 0.65), arch: 0.06, cup: 0.18, segs: [12, 5]});
  for (let i = 0; i < 4; i++) {
    parts.push(tag(placeLeaf(leaf, new THREE.Vector3(0, 0.004 + i * 0.002, 0), i * 2.6 + rnd() * 0.3, 0.12 + rnd() * 0.15, (rnd() - 0.5) * 0.3, 0.045 + rnd() * 0.015), K.orchidLeaf, rnd()));
  }
  // an arching flower spike
  const yaw = rnd() * Math.PI * 2;
  const dir = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const pts = [new THREE.Vector3(0, 0.005, 0), new THREE.Vector3(0, 0.06, 0).addScaledVector(dir, 0.01), new THREE.Vector3(0, 0.1, 0).addScaledVector(dir, 0.035), new THREE.Vector3(0, 0.105, 0).addScaledVector(dir, 0.075)];
  parts.push(tag(stemGeometry(pts, 0.0012, 0.0008), K.stipe, 0.9));
  const curve = new THREE.CatmullRomCurve3(pts);
  const flowers = 3 + Math.floor(rnd() * 3);
  const hue = rnd();
  const petal = leafGeometry({length: 1, width: 0.85, shape: (u) => Math.pow(Math.sin(Math.PI * Math.min(1, u)), 0.7), arch: 0.04, cup: 0.12, segs: [6, 4]});
  for (let f = 0; f < flowers; f++) {
    const at = curve.getPointAt(0.55 + (f / flowers) * 0.45);
    at.y -= 0.006;
    const face = yaw + (rnd() - 0.5) * 0.6 - Math.PI / 2;
    for (let k = 0; k < 5; k++) {
      // three sepals and two broad petals, facing outward from the spike
      const a = face + (k / 5) * Math.PI * 2;
      const big = k === 1 || k === 4 ? 1.25 : 0.9;
      const g = placeLeaf(petal, new THREE.Vector3(), 0, 0, a, 0.009 * big);
      g.rotateY(face);
      g.translate(at.x, at.y, at.z);
      parts.push(tag(g, K.petal, hue));
    }
    // the lip
    const lip = placeLeaf(petal, new THREE.Vector3(), 0, -0.4, -Math.PI / 2, 0.006);
    lip.rotateY(face);
    lip.translate(at.x, at.y, at.z);
    parts.push(tag(lip, K.petal, hue + 2));
  }
  return parts;
}

function mushrooms(rnd: () => number): Parts {
  const parts: Parts = [];
  const n = 3 + Math.floor(rnd() * 5);
  const hue = rnd();
  for (let i = 0; i < n; i++) {
    const h = 0.004 + rnd() * 0.01, r = 0.0025 + rnd() * 0.004;
    const ox = (rnd() - 0.5) * 0.025, oz = (rnd() - 0.5) * 0.025;
    const lean = new THREE.Vector3((rnd() - 0.5) * 0.3, 1, (rnd() - 0.5) * 0.3).normalize();
    const top = new THREE.Vector3(ox, 0, oz).addScaledVector(lean, h);
    parts.push(tag(stemGeometry([new THREE.Vector3(ox, -0.001, oz), new THREE.Vector3(ox, 0, oz).addScaledVector(lean, h * 0.5), top], r * 0.22, r * 0.18), K.stipe, hue));
    const prof: THREE.Vector2[] = [];
    for (let k = 0; k <= 8; k++) {
      const a = (k / 8) * Math.PI * 0.5;
      prof.push(new THREE.Vector2(Math.sin(a) * r, Math.cos(a) * r * 0.55));
    }
    prof.push(new THREE.Vector2(r * 0.9, -r * 0.08), new THREE.Vector2(r * 0.2, -r * 0.05));
    const cap = new THREE.LatheGeometry(prof.reverse(), 12);
    cap.deleteAttribute('uv');
    const uv = new Float32Array(cap.attributes.position.count * 2);
    for (let k = 0; k < cap.attributes.position.count; k++) {uv[k * 2] = cap.attributes.position.getY(k) / (r * 0.55); uv[k * 2 + 1] = 0.5;}
    cap.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    cap.setAttribute('aFlex', new THREE.BufferAttribute(new Float32Array(cap.attributes.position.count).fill(0.2), 1));
    cap.translate(top.x, top.y, top.z);
    parts.push(tag(cap.toNonIndexed(), K.cap, hue));
  }
  return parts.map((p) => (p.index ? p.toNonIndexed() : p));
}

function sedge(rnd: () => number, size: number): Parts {
  const parts: Parts = [];
  const n = 16 + Math.floor(rnd() * 12);
  for (let i = 0; i < n; i++) {
    const blade = leafGeometry({length: 1, width: 0.035, shape: (u) => Math.pow(1 - u, 0.6), arch: 0.35 + 0.25 * rnd(), cup: 0.1, twist: (rnd() - 0.5) * 1.2, segs: [12, 2]});
    parts.push(tag(placeLeaf(blade, new THREE.Vector3((rnd() - 0.5) * 0.006, 0, (rnd() - 0.5) * 0.006), rnd() * Math.PI * 2, 0.7 + rnd() * 0.65, (rnd() - 0.5) * 0.3, size * (0.05 + rnd() * 0.05)), K.grass, rnd()));
  }
  return parts;
}

function spikemoss(rnd: () => number): Parts {
  const parts: Parts = [];
  const leaflet = leafGeometry({length: 1, width: 0.6, shape: (u) => Math.sin(Math.PI * Math.min(1, u)), arch: 0.05, cup: 0.1, segs: [3, 2]});
  const fronds = 6 + Math.floor(rnd() * 4);
  for (let f = 0; f < fronds; f++) {
    const yaw = (f / fronds) * Math.PI * 2 + rnd() * 0.5;
    const len = 0.03 + rnd() * 0.025;
    const dir = new THREE.Vector3(Math.cos(yaw), 0.25, -Math.sin(yaw)).normalize();
    const pts = [new THREE.Vector3(), dir.clone().multiplyScalar(len * 0.5).add(new THREE.Vector3(0, 0.006, 0)), dir.clone().multiplyScalar(len).add(new THREE.Vector3(0, 0.002, 0))];
    parts.push(tag(stemGeometry(pts, 0.0006, 0.0003), K.spike, 0.5));
    const curve = new THREE.CatmullRomCurve3(pts);
    for (let k = 1; k < 16; k++) {
      const t = k / 16;
      const at = curve.getPointAt(t);
      for (const side of [-1, 1]) parts.push(tag(placeLeaf(leaflet, at, yaw + side * 1.1, 0.15, side * 0.3, 0.0035 * (1 - t * 0.5)), K.spike, rnd()));
    }
  }
  return parts;
}

function calathea(rnd: () => number): Parts {
  const parts: Parts = [];
  const blade = leafGeometry({length: 1, width: 0.5, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.85)), 0.75), arch: 0.06, cup: 0.08, wave: 0.05, segs: [14, 6]});
  const n = 5 + Math.floor(rnd() * 3);
  const hue = rnd();
  for (let i = 0; i < n; i++) {
    const yaw = (i / n) * Math.PI * 2 + rnd() * 0.6;
    const lean = 0.25 + rnd() * 0.3;
    const h = 0.05 + rnd() * 0.05;
    const dir = new THREE.Vector3(Math.cos(yaw) * Math.sin(lean), Math.cos(lean), -Math.sin(yaw) * Math.sin(lean));
    const tip = dir.clone().multiplyScalar(h);
    parts.push(tag(stemGeometry([new THREE.Vector3(), dir.clone().multiplyScalar(h * 0.5), tip], 0.0014, 0.001), K.stipe, 0.3));
    parts.push(tag(placeLeaf(blade, tip, yaw, 0.35 + rnd() * 0.4, (rnd() - 0.5) * 0.4, 0.06 + rnd() * 0.03), K.calathea, hue));
  }
  return parts;
}

function fernlet(rnd: () => number, size: number): Parts {
  const parts: Parts = [];
  const pinna = leafGeometry({length: 1, width: 0.32, shape: (u) => Math.pow(Math.sin(Math.PI * Math.min(1, u)), 0.8), arch: 0.05, cup: 0.15, segs: [4, 2]});
  const fronds = 5 + Math.floor(rnd() * 3);
  for (let f = 0; f < fronds; f++) {
    const yaw = (f / fronds) * Math.PI * 2 + rnd() * 0.4;
    const len = size * (0.045 + rnd() * 0.03);
    const dir = new THREE.Vector3(Math.cos(yaw) * 0.7, 0.75, -Math.sin(yaw) * 0.7).normalize();
    const pts = [new THREE.Vector3(), dir.clone().multiplyScalar(len * 0.55).add(new THREE.Vector3(0, len * 0.08, 0)), dir.clone().multiplyScalar(len).add(new THREE.Vector3(0, -len * 0.15, 0))];
    parts.push(tag(stemGeometry(pts, 0.0007, 0.0003), K.fernlet, 0.2));
    const curve = new THREE.CatmullRomCurve3(pts);
    const m = 12;
    for (let k = 1; k < m; k++) {
      const t = k / m;
      const at = curve.getPointAt(t);
      const pl = len * 0.22 * Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.05));
      for (const side of [-1, 1]) parts.push(tag(placeLeaf(pinna, at, yaw + side * 1.25, -0.1, side * 0.2, pl), K.fernlet, rnd()));
    }
  }
  return parts;
}

function twig(rnd: () => number): Parts {
  const pts: THREE.Vector3[] = [];
  let p = new THREE.Vector3();
  let yaw = rnd() * Math.PI * 2;
  const n = 4 + Math.floor(rnd() * 3), len = 0.02 + rnd() * 0.05;
  for (let i = 0; i <= n; i++) {
    pts.push(p.clone());
    yaw += (rnd() - 0.5) * 0.7;
    p = p.clone().add(new THREE.Vector3(Math.cos(yaw) * len / n, 0, -Math.sin(yaw) * len / n));
  }
  const parts = [tag(stemGeometry(pts, 0.0012 + rnd() * 0.001, 0.0006), K.twig, rnd())];
  if (rnd() < 0.5) {
    const at = pts[Math.floor(n / 2)];
    const b = [at.clone(), at.clone().add(new THREE.Vector3(Math.cos(yaw + 0.8) * 0.012, 0.002, -Math.sin(yaw + 0.8) * 0.012))];
    parts.push(tag(stemGeometry(b, 0.0007, 0.0004), K.twig, rnd()));
  }
  return parts;
}

function floraMaterial() {
  const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.45, side: THREE.DoubleSide});
  addFoliage(m, {flexAttr: true, height: 0.08, translucency: 0.75, key: 'flora'});
  const base = m.onBeforeCompile;
  m.onBeforeCompile = (s, r) => {
    base(s, r);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aKind; attribute float aTint; varying float vKind; varying float vTint; varying vec2 vLeafUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvKind = aKind; vTint = aTint; vLeafUv = uv;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vKind; varying float vTint; varying vec2 vLeafUv;
float fh(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float fn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(fh(i), fh(i+vec2(1,0)), f.x), mix(fh(i+vec2(0,1)), fh(i+vec2(1,1)), f.x), f.y); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float u = vLeafUv.x, v = vLeafUv.y * 2.0 - 1.0;
float mid = 1.0 - smoothstep(0.0, 0.05, abs(v));
float k = vKind;
vec3 col = vec3(0.05, 0.1, 0.03);
float rough = 0.45;
if (k < 6.5) {        // bromeliad, outer: green with a wine blush and speckles toward the base
  col = mix(vec3(0.05, 0.11, 0.025), vec3(0.09, 0.15, 0.03), fract(vTint * 3.7));
  col = mix(col, vec3(0.22, 0.03, 0.05), (1.0 - smoothstep(0.0, 0.55, u)) * 0.55);
  col = mix(col, vec3(0.3, 0.05, 0.08), smoothstep(0.8, 0.95, fn(vec2(u * 30.0, v * 6.0))) * 0.6);
  rough = 0.35;
} else if (k < 7.5) { // bromeliad heart: glossy red
  col = mix(vec3(0.38, 0.03, 0.06), vec3(0.2, 0.02, 0.06), u);
  col = mix(col, vec3(0.08, 0.13, 0.03), smoothstep(0.75, 1.0, u) * 0.6);
  rough = 0.28;
} else if (k < 8.5) { // orchid leaf: thick, glossy, dark
  col = vec3(0.035, 0.085, 0.025) * (0.85 + 0.3 * vTint);
  rough = 0.25;
} else if (k < 9.5) { // orchid petals: white or pink with magenta veins
  float pink = step(0.5, fract(vTint));
  col = mix(vec3(0.85, 0.82, 0.8), vec3(0.75, 0.32, 0.55), pink);
  col = mix(col, vec3(0.55, 0.08, 0.3), smoothstep(0.85, 1.0, sin(v * 18.0)) * (0.3 + 0.4 * pink) * (1.0 - u));
  if (vTint > 1.5) col = mix(vec3(0.85, 0.55, 0.1), vec3(0.6, 0.06, 0.2), u);
  rough = 0.55;
} else if (k < 10.5) { // mushroom caps: tan to rust, paler at the rim
  col = mix(vec3(0.38, 0.22, 0.1), vec3(0.32, 0.12, 0.05), vTint);
  col = mix(col, vec3(0.6, 0.5, 0.36), smoothstep(0.3, 0.0, u) * 0.6);
  col *= 0.85 + 0.3 * fn(vec2(u * 20.0, v * 20.0));
  rough = 0.6;
} else if (k < 11.5) { // stems and stalks
  col = mix(vec3(0.5, 0.42, 0.3), vec3(0.15, 0.2, 0.06), step(0.25, vTint) * step(vTint, 0.95));
  rough = 0.6;
} else if (k < 12.5) { // sedge blades
  col = mix(vec3(0.05, 0.12, 0.03), vec3(0.11, 0.17, 0.04), vTint);
  col = mix(col, vec3(0.2, 0.17, 0.08), smoothstep(0.75, 1.0, u) * 0.5);
  rough = 0.4;
} else if (k < 13.5) { // air plant: silvery trichomes over grey-green
  col = mix(vec3(0.1, 0.15, 0.09), vec3(0.18, 0.23, 0.15), vTint);
  col = mix(col, vec3(0.3, 0.08, 0.1), smoothstep(0.6, 1.0, 1.0 - u) * 0.35);
  rough = 0.75;
} else if (k < 14.5) { // spikemoss: bright, almost emerald
  col = mix(vec3(0.05, 0.15, 0.04), vec3(0.09, 0.22, 0.05), vTint);
  rough = 0.4;
} else if (k < 15.5) { // calathea: dark green, feathered pale bands, purple below
  col = vec3(0.025, 0.07, 0.03);
  float feather = smoothstep(0.55, 0.75, sin(u * 22.0 - abs(v) * 6.0)) * smoothstep(0.95, 0.55, abs(v)) * smoothstep(0.05, 0.2, u);
  col = mix(col, vec3(0.14, 0.24, 0.08), feather * 0.8);
  col = mix(col, vec3(0.2, 0.28, 0.1), mid * 0.6);
  if (!gl_FrontFacing) col = vec3(0.16, 0.03, 0.08);
  rough = 0.4;
} else if (k < 16.5) { // small ferns
  col = mix(vec3(0.05, 0.12, 0.03), vec3(0.1, 0.19, 0.04), vTint);
  rough = 0.5;
} else if (k < 17.5) { // twigs: grey-brown bark
  col = mix(vec3(0.12, 0.08, 0.05), vec3(0.2, 0.16, 0.11), vTint) * (0.8 + 0.4 * fn(vec2(u * 40.0, v * 4.0)));
  rough = 0.85;
} else if (k < 18.5) { // creeping fig
  col = mix(vec3(0.04, 0.11, 0.025), vec3(0.08, 0.17, 0.04), vTint);
  rough = 0.42;
} else {             // floating leaves, waterlogged
  col = mix(vec3(0.1, 0.07, 0.03), vec3(0.18, 0.11, 0.04), vTint);
  rough = 0.3;
}
col *= 0.88 + 0.24 * fn(vec2(u, v) * 24.0);
float edge = smoothstep(0.85, 1.0, abs(v));
col = mix(col, col * 0.75, edge * 0.4);
diffuseColor.rgb = col;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = rough;`);
    s.fragmentShader = s.fragmentShader.replace('void main() {', 'float rough = 0.45;\nvoid main() {');
  };
  m.customProgramCacheKey = () => 'flora-v1';
  return m;
}

export class Flora {
  readonly group = new THREE.Group();
  readonly obstacles: {x: number; z: number; r: number}[] = [];
  private parts: Parts = [];

  constructor(private surface: Surface, rockMeshes: THREE.Mesh[], logMesh: THREE.Mesh) {
    const rnd = mulberry32(4321);
    const at = (local: Parts, x: number, z: number, opts: {y?: number; normal?: THREE.Vector3; scale?: number; yaw?: number; sink?: number} = {}) => {
      const y = opts.y ?? surface.heightAt(x, z);
      const n = opts.normal ?? up;
      const q = new THREE.Quaternion().setFromUnitVectors(up, n.clone().lerp(up, 0.5).normalize()).multiply(new THREE.Quaternion().setFromAxisAngle(up, opts.yaw ?? rnd() * Math.PI * 2));
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y - (opts.sink ?? 0.002), z), q, new THREE.Vector3().setScalar(opts.scale ?? 1));
      for (const p of local) {p.applyMatrix4(m); this.parts.push(p);}
    };
    const dry = (x: number, z: number) => poolDistance(x, z) > 0.05 && surface.kindAt(x, z) !== SurfaceKind.Water;
    const inside = (x: number, z: number, m = 0.03) => Math.abs(x) < TANK.w / 2 - m && Math.abs(z) < TANK.d / 2 - m;

    // Bromeliads on the rock shelves and at the foot of the peaks.
    const rockSites = this.rockShelves(rockMeshes, rnd);
    rockSites.slice(0, 7).forEach((s, i) => at(bromeliad(rnd, 0.8 + rnd() * 0.5), s.p.x, s.p.z, {y: s.p.y, normal: s.n, sink: 0.003 + i * 0}));
    // Small ferns and spikemoss in the crevices.
    rockSites.slice(7, 19).forEach((s) => at(rnd() < 0.6 ? fernlet(rnd, 0.8 + rnd() * 0.5) : spikemoss(rnd), s.p.x, s.p.z, {y: s.p.y, normal: s.n}));
    // Air plants wired onto the log.
    const logBox = new THREE.Box3().setFromObject(logMesh);
    for (let i = 0, placed = 0; i < 200 && placed < 4; i++) {
      const x = logBox.min.x + 0.02 + rnd() * (logBox.max.x - logBox.min.x - 0.04), z = logBox.min.z + rnd() * (logBox.max.z - logBox.min.z);
      if (surface.kindAt(x, z) !== SurfaceKind.Wood) continue;
      if (Math.abs(x + 0.4) < 0.06 && Math.abs(z - 0.04) < 0.05) continue; // keep the basking spot clear
      const n = surface.normalAt(x, z);
      if (n.y > 0.85 || n.y < 0.45) continue; // on the upper flank of the log, not the top or underside
      at(tillandsia(rnd, 0.9 + rnd() * 0.4), x, z, {normal: n, sink: 0.001});
      placed++;
    }
    // A flowering orchid and two calatheas toward the back.
    const spots: [() => Parts, number, number, number][] = [
      [() => orchid(rnd), 0.47, -0.14, 0.04], [() => orchid(rnd), -0.52, -0.18, 0.04],
      [() => calathea(rnd), 0.53, -0.19, 0.06], [() => calathea(rnd), -0.38, -0.205, 0.06], [() => calathea(rnd), 0.38, -0.2, 0.05],
    ];
    for (const [f, x, z, r] of spots) if (dry(x, z)) {at(f(), x, z); this.obstacles.push({x, z, r});}
    // Sedges along the shore and in the back corners.
    for (let i = 0, placed = 0; i < 400 && placed < 16; i++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.06), z = (rnd() - 0.5) * (TANK.d - 0.06);
      const pd = poolDistance(x, z);
      const shore = pd > 0.06 && pd < 0.3;
      const back = z < -0.15;
      if (!(shore || back) || !inside(x, z) || surface.kindAt(x, z) !== SurfaceKind.Ground) continue;
      if (rnd() > (shore ? 0.6 : 0.3)) continue;
      at(sedge(rnd, 0.8 + rnd() * 0.5), x, z);
      placed++;
    }
    // Spikemoss carpets in the damp shade.
    for (let i = 0, placed = 0; i < 400 && placed < 14; i++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.06), z = (rnd() - 0.5) * (TANK.d - 0.06);
      if (!dry(x, z) || !inside(x, z) || surface.kindAt(x, z) !== SurfaceKind.Ground) continue;
      at(spikemoss(rnd), x, z, {normal: surface.normalAt(x, z)});
      placed++;
    }
    // Mushrooms by the log and among the ferns.
    for (let i = 0, placed = 0; i < 400 && placed < 7; i++) {
      const x = logBox.min.x + rnd() * (logBox.max.x - logBox.min.x + 0.1) - 0.05, z = logBox.min.z - 0.04 + rnd() * (logBox.max.z - logBox.min.z + 0.08);
      if (surface.kindAt(x, z) !== SurfaceKind.Ground || !inside(x, z)) continue;
      at(mushrooms(rnd), x, z, {normal: surface.normalAt(x, z)});
      placed++;
    }
    for (const [x, z] of [[-0.24, -0.2], [0.44, -0.2], [-0.55, -0.05]]) if (dry(x, z)) at(mushrooms(rnd), x, z);
    // Twigs on the floor.
    for (let i = 0, placed = 0; i < 500 && placed < 34; i++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.06), z = (rnd() - 0.5) * (TANK.d - 0.06);
      if (!dry(x, z) || surface.kindAt(x, z) !== SurfaceKind.Ground) continue;
      at(twig(rnd), x, z, {normal: surface.normalAt(x, z), sink: 0.0004});
      placed++;
    }
    // Leaves fallen onto the pool float in the still corners.
    const lily = leafGeometry({length: 1, width: 0.5, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.8), arch: 0.0, cup: 0.04, twist: 0.1, segs: [8, 4]});
    for (let i = 0, placed = 0; i < 300 && placed < 9; i++) {
      const x = 0.05 + rnd() * 0.5, z = -0.05 + rnd() * 0.28;
      if (poolDepth(x, z) < 0.004 || Math.hypot(x - 0.1, z - 0.075) < 0.07) continue;
      const g = placeLeaf(lily, new THREE.Vector3(x, WATER_LEVEL + 0.0006, z), rnd() * Math.PI * 2, 0, 0, 0.01 + rnd() * 0.008);
      this.parts.push(tag(g, K.lily, rnd()));
      placed++;
    }
    // Creeping fig climbing the faces of the peaks.
    this.climbers(rockMeshes, rnd);

    const merged = mergeGeometries(this.parts.map((p) => {
      const q = p.index ? p.toNonIndexed() : p;
      for (const k of Object.keys(q.attributes)) if (!['position', 'normal', 'uv', 'aFlex', 'aKind', 'aTint'].includes(k)) q.deleteAttribute(k);
      if (!q.attributes.aFlex) q.setAttribute('aFlex', new THREE.BufferAttribute(new Float32Array(q.attributes.position.count).fill(0.3), 1));
      if (!q.attributes.normal) q.computeVertexNormals();
      return q;
    }));
    if (merged) {
      merged.computeVertexNormals();
      const mesh = new THREE.Mesh(merged, floraMaterial());
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = 'flora';
      this.group.add(mesh);
    }
    this.pebbles(rnd);
  }

  /** Upward-facing pockets on the rock: where soil collects and plants take hold. */
  private rockShelves(rocks: THREE.Mesh[], rnd: () => number) {
    const ray = new THREE.Raycaster();
    (ray as unknown as {firstHitOnly: boolean}).firstHitOnly = true;
    const sites: {p: THREE.Vector3; n: THREE.Vector3}[] = [];
    for (let i = 0; i < 4000 && sites.length < 24; i++) {
      const x = -0.36 + rnd() * 0.74, z = -0.2 + rnd() * 0.24;
      ray.set(new THREE.Vector3(x, 0.6, z), new THREE.Vector3(0, -1, 0));
      const hit = ray.intersectObjects(rocks, false)[0];
      if (!hit || !hit.face) continue;
      const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
      if (n.y < 0.72 || hit.point.y < 0.15 || hit.point.y > 0.44) continue;
      if (Math.abs(x - 0.06) < 0.06 && z > -0.14) continue; // not in the falls
      if (sites.some((s) => s.p.distanceTo(hit.point) < 0.05)) continue;
      sites.push({p: hit.point.clone(), n});
    }
    return sites;
  }

  /** Creeping fig: stems that find their way up the rock faces, leaves alternating. */
  private climbers(rocks: THREE.Mesh[], rnd: () => number) {
    const ray = new THREE.Raycaster();
    (ray as unknown as {firstHitOnly: boolean}).firstHitOnly = true;
    const leaf = leafGeometry({length: 1, width: 0.78, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.75), arch: 0.04, cup: 0.12, segs: [6, 4]});
    const starts = [[-0.25, -0.02], [-0.1, 0.0], [0.24, 0.0], [0.33, -0.04], [-0.31, -0.08], [0.15, -0.02]];
    for (const [sx, sz] of starts) {
      // aim horizontally from in front of the rock toward its interior
      const pts: THREE.Vector3[] = [];
      let y = 0.135 + rnd() * 0.02;
      let x = sx;
      for (let k = 0; k < 26; k++) {
        ray.set(new THREE.Vector3(x, y, 0.2), new THREE.Vector3(0, 0, -1));
        const hit = ray.intersectObjects(rocks, false)[0];
        if (!hit) break;
        const p = hit.point.clone().add(new THREE.Vector3(0, 0, 0.0015));
        if (pts.length && p.distanceTo(pts[pts.length - 1]) > 0.04) break;
        pts.push(p);
        y += 0.008 + rnd() * 0.006;
        x += (rnd() - 0.5) * 0.012;
        if (y > 0.36) break;
      }
      if (pts.length < 4) continue;
      this.parts.push(tag(stemGeometry(pts, 0.0007, 0.0005), K.twig, 0.3));
      const curve = new THREE.CatmullRomCurve3(pts);
      const n = Math.floor(curve.getLength() / 0.006);
      for (let i = 1; i < n; i++) {
        const t = i / n;
        const p = curve.getPointAt(t);
        const side = i % 2 ? 1 : -1;
        // leaves lie flat against the rock, pointing up and out
        const g = placeLeaf(leaf, new THREE.Vector3(), side * (0.6 + rnd() * 0.5), Math.PI / 2 - 0.3, Math.PI / 2, 0.007 + rnd() * 0.004);
        g.translate(p.x, p.y, p.z + 0.001);
        this.parts.push(tag(g, K.fig, rnd()));
      }
    }
  }

  /** Pebbles and grit scattered over the soil and along the beach. */
  private pebbles(rnd: () => number) {
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const n = 1 + 0.12 * Math.sin(v.x * 5.1 + v.y * 3.3) * Math.cos(v.z * 4.7);
      pos.setXYZ(i, v.x * n * 1.25, v.y * n * 0.6, v.z * n);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.75});
    mat.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vSeed;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvSeed = instanceMatrix[3].xyz;');
      s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vSeed;\nfloat ph(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }')
        .replace('#include <color_fragment>', `#include <color_fragment>
float r = ph(floor(vSeed * 2000.0));
vec3 c = mix(vec3(0.09, 0.08, 0.07), vec3(0.2, 0.18, 0.14), r);
c = mix(c, vec3(0.05, 0.045, 0.04), step(0.7, fract(r * 7.3)));
c = mix(c, vec3(0.26, 0.22, 0.17), step(0.9, fract(r * 13.1)));
diffuseColor.rgb = c;`);
    };
    const list: THREE.Matrix4[] = [];
    for (let i = 0; i < 3000 && list.length < 260; i++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.02), z = (rnd() - 0.5) * (TANK.d - 0.02);
      const pd = poolDistance(x, z);
      const kind = this.surface.kindAt(x, z);
      if (kind === SurfaceKind.Rock || kind === SurfaceKind.Wood) continue;
      const beach = pd > -0.02 && pd < 0.2;
      if (pd < -0.02) continue;
      if (rnd() > (beach ? 0.9 : 0.25)) continue;
      const y = Math.max(this.surface.heightAt(x, z), pd < 0 ? -1 : 0);
      const s = 0.002 + rnd() * rnd() * 0.007;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.4, rnd() * 6.28, (rnd() - 0.5) * 0.4));
      list.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y + s * 0.15, z), q, new THREE.Vector3(s, s, s)));
    }
    const inst = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((m, i) => inst.setMatrixAt(i, m));
    inst.castShadow = true;
    inst.receiveShadow = true;
    inst.name = 'pebbles';
    this.group.add(inst);
  }
}
