import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type {ScanSet} from './Assets';
import {Surface, SurfaceKind} from './Surface';
import {addFoliage} from './Foliage';
import {mulberry32} from './Textures';
import {fbm, WATER_LEVEL, poolDistance} from './Ground';
import {TANK} from './Case';

const texLoader = new THREE.TextureLoader();
function alphaTex(url: string) {
  const t = texLoader.load(url);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/** Moss density used by both the ground shader and the moss tufts. */
export class MossMap {
  readonly w = 300;
  readonly h = 125;
  readonly data: Float32Array;
  readonly texture: THREE.DataTexture;
  constructor() {
    this.data = new Float32Array(this.w * this.h);
    const bytes = new Uint8Array(this.w * this.h);
    for (let j = 0; j < this.h; j++) for (let i = 0; i < this.w; i++) {
      const x = -TANK.w / 2 + (i / (this.w - 1)) * TANK.w, z = -TANK.d / 2 + (j / (this.h - 1)) * TANK.d;
      let m = fbm(x * 9 + 4, z * 9 + 1, 4) + 0.2 + (fbm(x * 30, z * 30, 3) - 0.5) * 0.25;
      m = Math.min(1, Math.max(0, (m - 0.42) / 0.22));
      // a worn path where the lizard walks between the log and the pool
      const path = Math.exp(-(((x + 0.1) / 0.075) ** 2) - (((z - 0.15) / 0.1) ** 2));
      m *= 1 - 0.8 * path;
      // shore: wet gravel rather than moss
      const pd = poolDistance(x, z);
      m *= Math.min(1, Math.max(0, (pd - 0.04) / 0.1));
      this.data[j * this.w + i] = m;
      bytes[j * this.w + i] = m * 255;
    }
    this.texture = new THREE.DataTexture(bytes, this.w, this.h, THREE.RedFormat);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.needsUpdate = true;
  }
  at(x: number, z: number) {
    const i = Math.round(((x + TANK.w / 2) / TANK.w) * (this.w - 1));
    const j = Math.round(((z + TANK.d / 2) / TANK.d) * (this.h - 1));
    return this.data[Math.min(this.h - 1, Math.max(0, j)) * this.w + Math.min(this.w - 1, Math.max(0, i))];
  }
}

// ---------------------------------------------------------------------------
// Procedural leaves

interface LeafOpts {
  length: number; width: number;
  shape: (u: number) => number; // half-width profile 0..1 along the blade
  arch: number; cup: number; twist?: number; wave?: number; segs?: [number, number];
}
function leafGeometry(o: LeafOpts) {
  const [nu, nv] = o.segs ?? [12, 6];
  const pos: number[] = [], uv: number[] = [], idx: number[] = [], flex: number[] = [];
  for (let i = 0; i <= nu; i++) {
    const u = i / nu;
    const hw = o.width * 0.5 * o.shape(u);
    for (let j = 0; j <= nv; j++) {
      const v = (j / nv) * 2 - 1;
      const x = u * o.length;
      const y = o.arch * Math.sin(u * Math.PI * 0.9) * o.length - o.arch * u * u * o.length * 0.6 + o.cup * v * v * hw + (o.wave ?? 0) * Math.sin(u * 22 + v * 2) * hw * Math.abs(v);
      const z = v * hw;
      const tw = (o.twist ?? 0) * u;
      pos.push(x, y * Math.cos(tw) - z * Math.sin(tw), y * Math.sin(tw) + z * Math.cos(tw));
      uv.push(u, j / nv);
      flex.push(u);
    }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = i * (nv + 1) + j, b = a + nv + 1;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('aFlex', new THREE.Float32BufferAttribute(flex, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function stemGeometry(points: THREE.Vector3[], r0: number, r1: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const g = new THREE.TubeGeometry(curve, 6, 1, 5, false);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const nrm = g.attributes.normal as THREE.BufferAttribute;
  // TubeGeometry has a fixed radius; taper it along its length.
  const uvA = g.attributes.uv as THREE.BufferAttribute;
  const center = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const t = uvA.getX(i);
    curve.getPointAt(Math.min(1, t), center);
    const r = r0 + (r1 - r0) * t;
    pos.setXYZ(i, center.x + nrm.getX(i) * r, center.y + nrm.getY(i) * r, center.z + nrm.getZ(i) * r);
  }
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {uv[i * 2] = -1; uv[i * 2 + 1] = 0.5;}
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const flex = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) flex[i] = uvA.getX(i) * 0.6;
  g.setAttribute('aFlex', new THREE.BufferAttribute(flex, 1));
  return g;
}

function placeLeaf(g: THREE.BufferGeometry, at: THREE.Vector3, yaw: number, pitch: number, roll: number, scale: number) {
  const m = new THREE.Matrix4().compose(at, new THREE.Quaternion().setFromEuler(new THREE.Euler(roll, yaw, pitch, 'YZX')), new THREE.Vector3(scale, scale, scale));
  const c = g.clone();
  c.applyMatrix4(m);
  return c;
}

function tag(g: THREE.BufferGeometry, kind: number, tint: number) {
  const n = g.attributes.position.count;
  g.setAttribute('aKind', new THREE.BufferAttribute(new Float32Array(n).fill(kind), 1));
  g.setAttribute('aTint', new THREE.BufferAttribute(new Float32Array(n).fill(tint), 1));
  return g;
}

const LEAF_KIND = {pilea: 0, fittonia: 1, cryptanthus: 2, stem: 3, creeper: 4};

function pilea(rnd: () => number) {
  const parts: THREE.BufferGeometry[] = [];
  const leaf = leafGeometry({length: 1, width: 0.95, shape: (u) => Math.sqrt(Math.max(0, Math.sin(Math.PI * Math.min(1, u * 1.02)))) * (1 - 0.15 * u), arch: 0.06, cup: 0.18, segs: [10, 8]});
  const count = 9 + Math.floor(rnd() * 6);
  for (let i = 0; i < count; i++) {
    const yaw = (i / count) * Math.PI * 2 + rnd() * 0.5;
    const h = 0.025 + rnd() * 0.06;
    const reach = 0.02 + rnd() * 0.035;
    const tip = new THREE.Vector3(Math.cos(yaw) * reach, h, -Math.sin(yaw) * reach);
    parts.push(tag(stemGeometry([new THREE.Vector3(0, 0, 0), new THREE.Vector3(tip.x * 0.3, h * 0.6, tip.z * 0.3), tip], 0.0016, 0.0009), LEAF_KIND.stem, rnd()));
    const s = 0.024 + rnd() * 0.02;
    // peltate: the petiole attaches near the middle of the round blade
    const base = tip.clone().add(new THREE.Vector3(-Math.cos(yaw) * s * 0.45, 0.002, Math.sin(yaw) * s * 0.45));
    parts.push(tag(placeLeaf(leaf, base, yaw, 0.15 + rnd() * 0.35, (rnd() - 0.5) * 0.4, s), LEAF_KIND.pilea, rnd()));
  }
  return parts;
}

function fittonia(rnd: () => number) {
  const parts: THREE.BufferGeometry[] = [];
  const leaf = leafGeometry({length: 1, width: 0.62, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.8), arch: 0.08, cup: 0.12, segs: [10, 6]});
  const stems = 5 + Math.floor(rnd() * 4);
  for (let s = 0; s < stems; s++) {
    const yaw = rnd() * Math.PI * 2;
    const lean = 0.2 + rnd() * 0.6;
    const len = 0.04 + rnd() * 0.05;
    const dir = new THREE.Vector3(Math.cos(yaw) * Math.sin(lean), Math.cos(lean), -Math.sin(yaw) * Math.sin(lean));
    const pts = [new THREE.Vector3(), dir.clone().multiplyScalar(len * 0.5).add(new THREE.Vector3(0, 0.006, 0)), dir.clone().multiplyScalar(len)];
    parts.push(tag(stemGeometry(pts, 0.0018, 0.001), LEAF_KIND.stem, rnd()));
    const pairs = 3;
    for (let p = 0; p < pairs; p++) {
      const t = 0.35 + (p / pairs) * 0.65;
      const at = dir.clone().multiplyScalar(len * t);
      for (const side of [-1, 1]) {
        const ly = yaw + side * Math.PI / 2 + p * 0.9 + (rnd() - 0.5) * 0.4;
        const sc = (0.02 + rnd() * 0.012) * (1.1 - p * 0.18);
        parts.push(tag(placeLeaf(leaf, at, ly, 0.25 + rnd() * 0.3, (rnd() - 0.5) * 0.3, sc), LEAF_KIND.fittonia, rnd()));
      }
    }
  }
  return parts;
}

function cryptanthus(rnd: () => number) {
  const parts: THREE.BufferGeometry[] = [];
  const count = 9 + Math.floor(rnd() * 4);
  for (let i = 0; i < count; i++) {
    const leaf = leafGeometry({length: 1, width: 0.24, shape: (u) => Math.pow(Math.sin(Math.PI * Math.min(1, 0.15 + u * 0.95)), 0.6), arch: 0.12, cup: -0.25, wave: 0.12, twist: (rnd() - 0.5) * 0.4, segs: [16, 4]});
    const yaw = (i / count) * Math.PI * 2 + rnd() * 0.3;
    const len = 0.06 + rnd() * 0.035;
    parts.push(tag(placeLeaf(leaf, new THREE.Vector3(0, 0.004, 0), yaw, 0.32 + rnd() * 0.25 - (i % 2) * 0.12, 0, len), LEAF_KIND.cryptanthus, rnd()));
  }
  // smaller central leaves
  for (let i = 0; i < 5; i++) {
    const leaf = leafGeometry({length: 1, width: 0.28, shape: (u) => Math.pow(Math.sin(Math.PI * Math.min(1, 0.15 + u * 0.95)), 0.6), arch: 0.1, cup: -0.25, wave: 0.1, segs: [12, 4]});
    parts.push(tag(placeLeaf(leaf, new THREE.Vector3(0, 0.006, 0), rnd() * Math.PI * 2, 0.7 + rnd() * 0.3, 0, 0.03 + rnd() * 0.015), LEAF_KIND.cryptanthus, rnd()));
  }
  return parts;
}

function creeper(rnd: () => number, length: number) {
  const parts: THREE.BufferGeometry[] = [];
  const leaf = leafGeometry({length: 1, width: 0.75, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.75), arch: 0.05, cup: 0.1, segs: [7, 4]});
  const pts: THREE.Vector3[] = [];
  let p = new THREE.Vector3();
  let yaw = rnd() * Math.PI * 2;
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    pts.push(p.clone());
    yaw += (rnd() - 0.5) * 0.9;
    p = p.clone().add(new THREE.Vector3(Math.cos(yaw) * length / steps, 0.0015 * Math.sin(i), -Math.sin(yaw) * length / steps));
  }
  parts.push(tag(stemGeometry(pts, 0.0008, 0.0006), LEAF_KIND.stem, rnd()));
  const curve = new THREE.CatmullRomCurve3(pts);
  const n = Math.floor(length / 0.006);
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const at = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    const side = i % 2 ? 1 : -1;
    const ly = Math.atan2(-tan.z, tan.x) + side * (0.9 + rnd() * 0.4);
    parts.push(tag(placeLeaf(leaf, at, ly, 0.25 + rnd() * 0.3, 0, 0.007 + rnd() * 0.004), LEAF_KIND.creeper, rnd()));
  }
  return parts;
}

function leafMaterial() {
  const m = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.42, side: THREE.DoubleSide});
  addFoliage(m, {flexAttr: true, translucency: 0.8, key: 'leaf'});
  const base = m.onBeforeCompile;
  m.onBeforeCompile = (s, r) => {
    base(s, r);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aKind; attribute float aTint; varying float vKind; varying float vTint; varying vec2 vLeafUv; varying float vInstTint;\n#ifdef USE_INSTANCING\nattribute float aInstTint;\n#endif')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvKind = aKind; vTint = aTint; vLeafUv = uv;\n#ifdef USE_INSTANCING\nvInstTint = aInstTint;\n#else\nvInstTint = 0.5;\n#endif');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vKind; varying float vTint; varying vec2 vLeafUv; varying float vInstTint;
float lh(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float ln(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(lh(i), lh(i+vec2(1,0)), f.x), mix(lh(i+vec2(0,1)), lh(i+vec2(1,1)), f.x), f.y); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float u = vLeafUv.x, v = vLeafUv.y * 2.0 - 1.0;
vec3 col;
float vein = 0.0;
float mid = 1.0 - smoothstep(0.0, 0.035, abs(v));
if (vKind < 0.5) { // pilea: radiating veins from the peltate point
  vec2 q = vec2(u - 0.45, v * 0.5);
  float a = atan(q.y, q.x);
  vein = (1.0 - smoothstep(0.0, 0.06, abs(sin(a * 4.5)))) * smoothstep(0.03, 0.12, length(q)) * 0.5;
  col = mix(vec3(0.035, 0.1, 0.018), vec3(0.07, 0.16, 0.03), vTint);
  col = mix(col, col * 1.5, vein * 0.4);
} else if (vKind < 1.5) { // fittonia: white vein network
  float lat = abs(fract(u * 7.0 - abs(v) * 1.6) - 0.5);
  float net = abs(fract(u * 21.0 + abs(v) * 3.0 + ln(vec2(u, v) * 12.0)) - 0.5);
  vein = max(mid, max(1.0 - smoothstep(0.0, 0.06, lat), (1.0 - smoothstep(0.0, 0.05, net)) * 0.7));
  col = mix(vec3(0.04, 0.11, 0.025), vec3(0.08, 0.17, 0.04), vTint);
  col = mix(col, mix(vec3(0.75, 0.75, 0.68), vec3(0.6, 0.2, 0.2), step(0.7, vTint)), vein * 0.8);
} else if (vKind < 2.5) { // cryptanthus: bronze-red bands
  float band = smoothstep(0.35, 0.6, sin(u * 34.0 + ln(vec2(u * 8.0, v)) * 3.0));
  col = mix(vec3(0.16, 0.05, 0.03), vec3(0.3, 0.1, 0.06), vTint);
  col = mix(col, vec3(0.42, 0.24, 0.16), band * 0.35);
  col = mix(col, vec3(0.12, 0.1, 0.04), (1.0 - u) * 0.6);
  col = mix(col, col * 1.3, 1.0 - smoothstep(0.0, 0.25, abs(abs(v) - 0.7)));
  vein = mid * 0.4;
} else if (vKind < 3.5) { // stems
  col = mix(vec3(0.12, 0.16, 0.06), vec3(0.2, 0.14, 0.08), vTint);
} else if (vKind < 4.5) { // creeping fig
  col = mix(vec3(0.05, 0.13, 0.03), vec3(0.09, 0.2, 0.05), vTint);
  vein = mid * 0.5;
} else { // fallen leaf litter
  float t = vInstTint;
  col = mix(vec3(0.07, 0.04, 0.02), vec3(0.17, 0.1, 0.045), t);
  col = mix(col, vec3(0.08, 0.05, 0.03), smoothstep(0.5, 0.9, ln(vec2(u, v) * 6.0 + t * 10.0)) * 0.7);
  vein = mid * 0.3;
}
col *= 0.85 + 0.3 * ln(vec2(u, v) * 30.0);
col = mix(col, col * 1.25 + vec3(0.02, 0.02, 0.0), mid * 0.5 * step(vKind, 2.5));
float edge = smoothstep(0.85, 1.0, abs(v));
col = mix(col, col * 0.7 + vec3(0.03, 0.025, 0.0), edge * 0.5);
diffuseColor.rgb = col;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = vKind < 0.5 ? 0.38 : (vKind < 1.5 ? 0.55 : (vKind < 2.5 ? 0.5 : (vKind < 4.5 ? 0.45 : 0.8)));`);
  };
  m.customProgramCacheKey = () => 'leaf-plants-v1';
  return m;
}

// ---------------------------------------------------------------------------

export interface PlantSite {x: number; z: number; y: number; normal: THREE.Vector3}

export class Plants {
  readonly group = new THREE.Group();
  readonly moss = new MossMap();
  /** Clumps the lizard should walk around (x, z, radius). */
  readonly obstacles: {x: number; z: number; r: number}[] = [];

  constructor(scans: ScanSet, surface: Surface) {
    const rnd = mulberry32(1234);
    this.ferns(scans, surface, rnd);
    this.leafPlants(surface, rnd);
    this.litter(surface, rnd);
  }

  private site(surface: Surface, x: number, z: number): PlantSite {
    return {x, z, y: surface.heightAt(x, z), normal: surface.normalAt(x, z)};
  }

  private ferns(scans: ScanSet, surface: Surface, rnd: () => number) {
    const srcMat = scans.ferns[0].material as THREE.MeshStandardMaterial;
    const mat = srcMat.clone();
    mat.alphaMap = alphaTex('./models/fern_02/textures/fern_02_alpha_2k.png');
    mat.alphaTest = 0.45;
    mat.transparent = false;
    mat.side = THREE.DoubleSide;
    mat.color = new THREE.Color(0.62, 0.78, 0.5);
    mat.roughness = 1;
    addFoliage(mat, {height: 0.35, translucency: 0.9, key: 'fern'});
    const spots: [number, number, number, number][] = [
      [-0.53, -0.19, 0.3, 0], [-0.33, -0.18, 0.27, 1], [-0.02, -0.21, 0.24, 0], [0.31, -0.19, 0.29, 1], [0.5, -0.17, 0.32, 0],
      [-0.15, -0.02, 0.16, 2], [-0.08, 0.06, 0.14, 3], [0.53, -0.01, 0.2, 2], [-0.55, 0.16, 0.18, 3], [-0.4, -0.09, 0.2, 2],
      [0.21, -0.04, 0.16, 3], [0.42, -0.21, 0.24, 1], [-0.22, -0.22, 0.22, 1], [0.14, -0.23, 0.2, 2],
    ];
    const byVariant = new Map<number, THREE.Matrix4[]>();
    for (const [x, z, s, v] of spots) {
      const site = this.site(surface, x, z);
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, site.y - 0.004, z), new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.15, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.15)), new THREE.Vector3(s, s * 1.45, s));
      const list = byVariant.get(v) ?? [];
      list.push(m);
      byVariant.set(v, list);
      this.obstacles.push({x, z, r: s * 0.18});
    }
    for (const [v, list] of byVariant) {
      const geo = scans.ferns[v].geometry.clone();
      geo.center();
      const box = new THREE.Box3().setFromBufferAttribute(geo.attributes.position as THREE.BufferAttribute);
      geo.translate(0, -box.min.y, 0);
      const inst = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((m, i) => inst.setMatrixAt(i, m));
      inst.castShadow = true;
      inst.receiveShadow = true;
      inst.name = `ferns-${v}`;
      this.group.add(inst);
    }
  }

  private mossTufts(scans: ScanSet, surface: Surface, rnd: () => number) {
    const srcMat = scans.moss[0].material as THREE.MeshStandardMaterial;
    const mat = srcMat.clone();
    mat.alphaMap = alphaTex('./models/moss_01/textures/moss_01_alpha_2k.png');
    mat.alphaTest = 0.4;
    mat.transparent = false;
    mat.depthWrite = true;
    mat.side = THREE.DoubleSide;
    mat.color = new THREE.Color(0.75, 0.9, 0.55);
    addFoliage(mat, {height: 0.02, translucency: 1.0, key: 'moss'});
    // Tuft variants: a dozen scanned shoots packed into a small cushion.
    const tufts: THREE.BufferGeometry[] = [];
    for (let t = 0; t < 4; t++) {
      const parts: THREE.BufferGeometry[] = [];
      const n = 16;
      for (let i = 0; i < n; i++) {
        const src = scans.moss[Math.floor(rnd() * 10)].geometry.clone();
        src.center();
        const box = new THREE.Box3().setFromBufferAttribute(src.attributes.position as THREE.BufferAttribute);
        src.translate(0, -box.min.y, 0);
        const r = Math.sqrt(rnd()) * 0.011;
        const a = rnd() * Math.PI * 2;
        const s = 0.35 + rnd() * 0.25;
        const m = new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * r, -0.001, Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.6, rnd() * 6.28, (rnd() - 0.5) * 0.6)), new THREE.Vector3(s, s * (0.8 + rnd() * 0.4), s));
        src.applyMatrix4(m);
        for (const k of Object.keys(src.attributes)) if (!['position', 'normal', 'uv'].includes(k)) src.deleteAttribute(k);
        parts.push(src);
      }
      tufts.push(mergeGeometries(parts)!);
    }
    const lists: THREE.Matrix4[][] = tufts.map(() => []);
    const tryPlace = (x: number, z: number, density: number) => {
      if (rnd() > density) return;
      const k = surface.kindAt(x, z);
      if (k === SurfaceKind.Water) return;
      const y = surface.heightAt(x, z);
      if (y < WATER_LEVEL + 0.003) return;
      const n = surface.normalAt(x, z);
      if (n.y < 0.55) return;
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28));
      const s = 0.8 + rnd() * 0.6;
      lists[Math.floor(rnd() * tufts.length)].push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, s * (0.7 + rnd() * 0.5), s)));
    };
    for (let i = 0; i < 9000; i++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.01), z = (rnd() - 0.5) * (TANK.d - 0.01);
      const k = surface.kindAt(x, z);
      const onHard = k === SurfaceKind.Rock || k === SurfaceKind.Wood;
      const d = onHard ? 0.35 * (fbm(x * 25, z * 25) > 0.5 ? 1 : 0.2) : this.moss.at(x, z);
      tryPlace(x, z, d * 0.55);
    }
    tufts.forEach((geo, i) => {
      const list = lists[i];
      const inst = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((m, j) => inst.setMatrixAt(j, m));
      inst.castShadow = false;
      inst.receiveShadow = true;
      inst.name = `moss-${i}`;
      this.group.add(inst);
    });
  }

  /** Fallen leaves on the bare soil and under the plants. */
  private litter(surface: Surface, rnd: () => number) {
    const leaf = leafGeometry({length: 1, width: 0.5, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.8), arch: 0.02, cup: 0.12, twist: 0.25, segs: [8, 4]});
    const n = leaf.attributes.position.count;
    leaf.setAttribute('aKind', new THREE.BufferAttribute(new Float32Array(n).fill(5), 1));
    leaf.setAttribute('aTint', new THREE.BufferAttribute(new Float32Array(n).fill(0.5), 1));
    const mat = leafMaterial();
    const list: THREE.Matrix4[] = [];
    for (let i = 0; i < 1400 && list.length < 140; i++) {
      const x = (rnd() - 0.5) * (TANK.w - 0.02), z = (rnd() - 0.5) * (TANK.d - 0.02);
      const k = surface.kindAt(x, z);
      if (k === SurfaceKind.Water || k === SurfaceKind.Rock) continue;
      const y = surface.heightAt(x, z);
      if (y < WATER_LEVEL + 0.002) continue;
      const bare = 1 - this.moss.at(x, z);
      if (rnd() > bare * 0.8 + 0.02) continue;
      const nrm = surface.normalAt(x, z);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), nrm).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.5, rnd() * 6.28, (rnd() - 0.5) * 0.3)));
      const s = 0.008 + rnd() * 0.009;
      list.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y + 0.0008, z), q, new THREE.Vector3(s, s, s)));
    }
    const inst = new THREE.InstancedMesh(leaf, mat, list.length);
    list.forEach((m, i) => inst.setMatrixAt(i, m));
    const tint = new Float32Array(list.length);
    for (let i = 0; i < list.length; i++) tint[i] = rnd();
    inst.geometry.setAttribute('aInstTint', new THREE.InstancedBufferAttribute(tint, 1));
    inst.receiveShadow = true;
    inst.castShadow = true;
    inst.name = 'litter';
    this.group.add(inst);
  }

  private leafPlants(surface: Surface, rnd: () => number) {
    const mat = leafMaterial();
    const plants: [string, number, number, number][] = [
      ['pilea', -0.5, 0.12, 1.0], ['pilea', -0.27, 0.15, 0.8], ['pilea', 0.56, 0.08, 0.9], ['pilea', 0.08, -0.07, 0.7], ['pilea', -0.46, -0.12, 0.9],
      ['fittonia', -0.12, 0.14, 1.0], ['fittonia', 0.42, -0.1, 1.0], ['fittonia', -0.56, 0.02, 0.9], ['fittonia', 0.26, -0.09, 0.8],
      ['cryptanthus', -0.47, 0.0, 1.0], ['cryptanthus', 0.16, -0.0, 0.85],
      ['creeper', -0.58, 0.2, 1], ['creeper', -0.32, 0.21, 1], ['creeper', -0.05, 0.215, 1], ['creeper', 0.58, -0.08, 1],
      ['fittonia', 0.4, -0.09, 1.0], ['pilea', 0.5, -0.1, 1.1], ['fittonia', 0.56, -0.06, 0.9], ['pilea', 0.33, -0.1, 0.8],
      ['creeper', 0.36, -0.06, 1], ['creeper', 0.47, -0.05, 1], ['fittonia', 0.12, -0.07, 0.8],
    ];
    const parts: THREE.BufferGeometry[] = [];
    for (const [kind, x, z, s] of plants) {
      // keep land plants out of the water
      if (poolDistance(x, z) < 0.06) continue;
      const site = this.site(surface, x, z);
      const local = kind === 'pilea' ? pilea(rnd) : kind === 'fittonia' ? fittonia(rnd) : kind === 'cryptanthus' ? cryptanthus(rnd) : creeper(rnd, 0.12 + rnd() * 0.06);
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, site.y - 0.002, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd() * 6.28, 0)), new THREE.Vector3(s, s, s));
      for (const p of local) {
        p.applyMatrix4(m);
        parts.push(p);
      }
      if (kind !== 'creeper') this.obstacles.push({x, z, r: 0.03 * s});
    }
    // Drape creepers over the terrain they cross.
    const merged = mergeGeometries(parts)!;
    const pos = merged.attributes.position as THREE.BufferAttribute;
    const kindA = merged.attributes.aKind as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      if (kindA.getX(i) < 2.5) continue;
      const x = pos.getX(i), z = pos.getZ(i);
      const y = surface.heightAt(x, z);
      if (pos.getY(i) < y + 0.002) pos.setY(i, y + 0.002 + (pos.getY(i) - y) * 0.2);
    }
    merged.computeVertexNormals();
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = 'leaf-plants';
    this.group.add(mesh);
  }
}
