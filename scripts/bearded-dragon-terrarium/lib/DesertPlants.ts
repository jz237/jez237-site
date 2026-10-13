import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {dataTexture, mulberry32, tileFbm, tileNoise} from './Textures';
import {groundHeight} from './Ground';
import {TANK} from './Case';
import {foliageUniforms} from './Foliage';

const TAU = Math.PI * 2, UP = new THREE.Vector3(0, 1, 0);
export const plantLightStrength = {value: 0};
const aloePhoto = {value: new THREE.Texture()}, cactusPhoto = {value: new THREE.Texture()};

export async function loadPlantReferences() {
  const loader = new THREE.TextureLoader();
  const maps = await Promise.all(['aloe', 'cactus'].map(name => loader.loadAsync(`./plants/${name}-reference.png`)));
  for (const map of maps) {map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;}
  aloePhoto.value = maps[0]; cactusPhoto.value = maps[1];
}

function surface(kind: 'aloe' | 'cactus' | 'sage') {
  const color = dataTexture(512, 1024, (x, y, out) => {
    const u = x / 512, v = y / 1024;
    const patches = tileFbm(u * 8, v * 16, 8, 3, 38);
    const pore = tileNoise(u * 256, v * 512, 256, 87);
    const vein = Math.sin(u * TAU * 48 + patches * 3) * 0.014;
    const shade = 0.91 + patches * 0.16 + vein + (pore - 0.5) * 0.07;
    const speckle = kind === 'aloe' ? THREE.MathUtils.smoothstep(tileNoise(u * 45, v * 90, 45, 14), 0.80, 0.97) * 0.20 : 0;
    const base = kind === 'aloe' ? [103, 136, 87] : kind === 'cactus' ? [73, 108, 70] : [130, 137, 102];
    for (let k = 0; k < 3; k++) out[k] = base[k] * shade + speckle * 185;
  });
  const bump = dataTexture(256, 512, (x, y, out) => {
    const u = x / 256, v = y / 512;
    const pores = tileNoise(u * 128, v * 256, 128, 65);
    out[0] = out[1] = out[2] = 126 + (pores - 0.5) * 36 + Math.sin(u * TAU * 48) * 5;
  }, false);
  const material = new THREE.MeshPhysicalMaterial({map: color, bumpMap: bump, bumpScale: kind === 'sage' ? 0.00011 : 0.00008,
    roughness: kind === 'sage' ? 0.96 : 0.81, clearcoat: kind === 'sage' ? 0 : 0.055, clearcoatRoughness: 0.77,
    vertexColors: true, side: THREE.DoubleSide});
  if (kind !== 'sage') {
    material.onBeforeCompile = shader => {
      shader.uniforms.uPlantPhoto = kind === 'aloe' ? aloePhoto : cactusPhoto;
      shader.uniforms.uPlantLight = plantLightStrength;
      shader.uniforms.uPlantKeyDir = foliageUniforms.uKeyDirView;
      shader.uniforms.uPlantKeyColor = foliageUniforms.uKeyColor;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vPlantUv;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPlantUv=uv;');
      // Sample uninterrupted cuticle, keeping photographed spines out of the skin map.
      const roi = kind === 'aloe' ? 'vec4(.7422,.1016,.1465,.1465)' : 'vec4(.6087,.5410,.0944,.0830)';
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
varying vec2 vPlantUv;
uniform sampler2D uPlantPhoto;
uniform float uPlantLight;
uniform vec3 uPlantKeyDir;
uniform vec3 uPlantKeyColor;`)
        .replace('#include <color_fragment>', `#include <color_fragment>
vec4 plantRoi=${roi};
vec3 plantPhoto=texture2D(uPlantPhoto,plantRoi.xy+vPlantUv*plantRoi.zw).rgb;
diffuseColor.rgb=mix(diffuseColor.rgb,plantPhoto*vColor.rgb,${kind === 'aloe' ? '.64' : '.52'});`);
      if (kind === 'aloe') shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
float throughLeaf=pow(max(0.,dot(-normal,uPlantKeyDir)),2.);
reflectedLight.indirectDiffuse+=diffuseColor.rgb*uPlantKeyColor*throughLeaf*uPlantLight*.14;`);
    };
    material.customProgramCacheKey = () => `desert-${kind}-photo-surface-v1`;
  }
  return material;
}

let materials: ReturnType<typeof makeMaterials> | undefined;
function makeMaterials() {
  const bark = dataTexture(128, 256, (x, y, out) => {
    const shade = 0.75 + tileFbm(x / 16, y / 32, 8, 3, 12) * 0.35 + Math.sin(x * 2.8 + y * 0.04) * 0.065;
    out[0] = 129 * shade; out[1] = 113 * shade; out[2] = 87 * shade;
  });
  return {aloe: surface('aloe'), cactus: surface('cactus'), sage: surface('sage'),
    bark: new THREE.MeshStandardMaterial({map: bark, roughness: 0.97}),
    teeth: new THREE.MeshStandardMaterial({color: 0xd9cfa2, roughness: 0.89}),
    areoles: new THREE.MeshStandardMaterial({color: 0xd0c5ab, roughness: 1}),
    needles: new THREE.MeshStandardMaterial({color: 0xb99e6e, roughness: 0.78}),
    seeds: new THREE.MeshStandardMaterial({color: 0x9e865b, roughness: 0.94})};
}
const mats = () => materials ??= makeMaterials();
function joined(parts: THREE.BufferGeometry[], material: THREE.Material, group: THREE.Group, name: string) {
  if (!parts.length) return;
  const geometry = mergeGeometries(parts)!;
  const mesh = new THREE.Mesh(geometry, material); mesh.name = name; mesh.castShadow = mesh.receiveShadow = true; group.add(mesh);
  for (const part of parts) part.dispose();
}
function instances(geometry: THREE.BufferGeometry, material: THREE.Material, matrices: THREE.Matrix4[], group: THREE.Group, name: string) {
  if (!matrices.length) {geometry.dispose(); return;}
  const mesh = new THREE.InstancedMesh(geometry, material, matrices.length); mesh.name = name;
  matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix)); mesh.castShadow = mesh.receiveShadow = true; group.add(mesh);
}
function matrix(position: THREE.Vector3, direction: THREE.Vector3, scale: THREE.Vector3) {
  return new THREE.Matrix4().compose(position, new THREE.Quaternion().setFromUnitVectors(UP, direction.clone().normalize()), scale);
}

/** Fleshy upper and lower surfaces, a closed rim, and a curved pointed blade. */
export function rosette(x: number, z: number, size: number, seed: number) {
  const group = new THREE.Group(), random = mulberry32(seed), leaves: THREE.BufferGeometry[] = [], teeth: THREE.Matrix4[] = [];
  group.name = 'photographic-aloe-rosette'; group.position.set(x, groundHeight(x, z), z);
  const count = size > 0.09 ? 22 : 17;
  for (let leaf = 0; leaf < count; leaf++) {
    const age = leaf / count, angle = leaf * 2.39996 + seed * 0.2 + (random() - 0.5) * 0.2;
    const length = size * (0.66 + age * 0.28) * (0.88 + random() * 0.14);
    const inclination = 0.28 + age * 0.91 + (random() - 0.5) * 0.12;
    let reach = length * Math.cos(inclination);
    const dx = Math.cos(angle), dz = Math.sin(angle), edge = 0.009;
    if (dx > 0) reach = Math.min(reach, (TANK.w / 2 - edge - x) / dx);
    if (dx < 0) reach = Math.min(reach, (-TANK.w / 2 + edge - x) / dx);
    if (dz > 0) reach = Math.min(reach, (TANK.d / 2 - edge - z) / dz);
    if (dz < 0) reach = Math.min(reach, (-TANK.d / 2 + edge - z) / dz);
    const width = length * (0.105 + random() * 0.027), thickness = length * 0.044;
    const fadedTip = age < 0.3 && random() < 0.65, tone = 0.89 + random() * 0.12;
    const point = (t: number, s: number, bottom = false) => {
      const half = Math.max(0.000035, Math.sin(Math.PI * (0.05 + t * 0.95)) ** 0.7 * width * (1 - t * 0.52));
      const radial = 0.003 * (1 - age) + reach * t;
      const midY = 0.003 + age * 0.006 + length * Math.sin(inclination) * t - length * (1 - age) * 0.16 * t * t;
      const flesh = thickness * (0.30 + 0.70 * Math.sin(Math.PI * t)) * (1 - t * 0.92);
      const section = bottom ? -flesh * Math.sqrt(Math.max(0, 1 - s * s)) : half * s * s * 0.23 + flesh * 0.2;
      return new THREE.Vector3(dx * radial - dz * half * s, midY + section, dz * radial + dx * half * s);
    };
    const N = 22, S = 6, row = S + 1, layer = (N + 1) * row, positions: number[] = [], uv: number[] = [], colors: number[] = [], index: number[] = [];
    for (const bottom of [false, true]) for (let j = 0; j <= N; j++) for (let k = 0; k <= S; k++) {
      const t = j / N, s = k / S * 2 - 1, p = point(t, s, bottom);
      positions.push(p.x, p.y, p.z); uv.push(k / S, t);
      const dry = fadedTip ? THREE.MathUtils.smoothstep(t, 0.87, 1) : 0;
      colors.push(tone * (1 - dry * 0.08), tone * (1 - dry * 0.36), tone * (1 - dry * 0.63));
    }
    for (let j = 0; j < N; j++) for (let k = 0; k < S; k++) {
      const a = j * row + k, b = a + row;
      index.push(a, a + 1, b, a + 1, b + 1, b);
      index.push(a + layer, b + layer, a + 1 + layer, a + 1 + layer, b + layer, b + 1 + layer);
    }
    for (let j = 0; j < N; j++) for (const k of [0, S]) {
      const a = j * row + k, b = a + row;
      if (k === 0) index.push(a, b, a + layer, b, b + layer, a + layer);
      else index.push(a, a + layer, b, b, a + layer, b + layer);
    }
    for (const j of [0, N]) for (let k = 0; k < S; k++) {
      const a = j * row + k;
      if (j === 0) index.push(a, a + layer, a + 1, a + 1, a + layer, a + layer + 1);
      else index.push(a, a + 1, a + layer, a + 1, a + layer + 1, a + layer);
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(index); geometry.computeVertexNormals(); leaves.push(geometry);
    for (let k = 0; k < 10; k++) for (const side of [-1, 1]) {
      const t = 0.14 + k * 0.075, base = point(t, side), direction = new THREE.Vector3(-dz * side, 0.30, dx * side).normalize();
      const length = size * (0.010 + random() * 0.004) * (1 - t * 0.4);
      teeth.push(matrix(base.addScaledVector(direction, length * 0.45), direction, new THREE.Vector3(1, length, 1)));
    }
  }
  joined(leaves, mats().aloe, group, 'fleshy-curved-aloe-leaves');
  instances(new THREE.ConeGeometry(size * 0.0018, 1, 5), mats().teeth, teeth, group, 'fine-aloe-margin-teeth');
  return group;
}

function flower(radius: number, top: number, group: THREE.Group, random: () => number) {
  const parts: THREE.BufferGeometry[] = [], color = new THREE.MeshPhysicalMaterial({color: 0xbb4ca1, roughness: 0.75, side: THREE.DoubleSide});
  for (let i = 0; i < 32; i++) {
    const layer = Math.floor(i / 11), angle = i * 2.39996, length = radius * (0.87 - layer * 0.15), vertices: number[] = [], uv: number[] = [], index: number[] = [];
    for (let j = 0; j <= 12; j++) for (const side of [-1, 0, 1]) {
      const t = j / 12, width = Math.sin(t * Math.PI) ** 0.75 * radius * 0.15, radial = radius * 0.12 + length * t;
      vertices.push(Math.cos(angle) * radial - Math.sin(angle) * width * side, top + 0.002 + t * length * (0.28 + layer * 0.38) + width * side * side * 0.2, Math.sin(angle) * radial + Math.cos(angle) * width * side); uv.push(side * 0.5 + 0.5, t);
    }
    for (let j = 0; j < 12; j++) for (let s = 0; s < 2; s++) {const a = j * 3 + s; index.push(a, a + 1, a + 3, a + 1, a + 4, a + 3);}
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(index); geometry.computeVertexNormals(); parts.push(geometry);
  }
  joined(parts, color, group, 'layered-cactus-flower-petals');
  const stamens: THREE.Matrix4[] = [];
  for (let i = 0; i < 28; i++) {const a = i * 2.4, r = Math.sqrt(random()) * radius * 0.18; stamens.push(matrix(new THREE.Vector3(Math.cos(a) * r, top + 0.006, Math.sin(a) * r), UP, new THREE.Vector3(1, 0.003 + random() * 0.002, 1)));}
  instances(new THREE.ConeGeometry(0.0003, 1, 5), new THREE.MeshStandardMaterial({color: 0xe4c56e, roughness: 0.8}), stamens, group, 'golden-flower-stamens');
}

export function cactus(x: number, z: number, height: number, radius: number, seed: number, flowering = false) {
  const group = new THREE.Group(), random = mulberry32(seed), ribs = flowering ? 13 : 12, N = 96, R = 56;
  group.name = 'photographic-ribbed-cactus'; group.position.set(x, groundHeight(x, z), z);
  const phase = seed * 0.13, leanX = (random() - 0.5) * 0.009, leanZ = (random() - 0.5) * 0.007;
  const profile = (t: number) => Math.sqrt(Math.max(0.0004, 1 - Math.max(0, (t - 0.78) / 0.22) ** 2)) * (0.92 + 0.055 * Math.sin(t * 3.5 + seed));
  const point = (t: number, a: number) => {
    const r = radius * profile(t) * (1 + 0.115 * Math.cos((a - phase) * ribs));
    return new THREE.Vector3(Math.cos(a) * r + leanX * t * t, t * height, Math.sin(a) * r + leanZ * t * t);
  };
  const positions: number[] = [], uv: number[] = [], colors: number[] = [], index: number[] = [];
  for (let j = 0; j <= R; j++) for (let i = 0; i <= N; i++) {
    const t = j / R, a = (i === N ? 0 : i / N) * TAU, p = point(t, a);
    positions.push(p.x, p.y, p.z); uv.push(i / N, t);
    const cork = (1 - THREE.MathUtils.smoothstep(t, 0.025, 0.16)) * (0.25 + 0.40 * Math.max(0, Math.sin(a * 5 + seed)));
    const shade = 0.91 + Math.sin(a * 3 + seed) * 0.055;
    colors.push(shade * (1 + cork * 0.48), shade * (1 - cork * 0.10), shade * (1 - cork * 0.39));
  }
  for (let j = 0; j < R; j++) for (let i = 0; i < N; i++) {const a = j * (N + 1) + i; index.push(a, a + N + 1, a + 1, a + 1, a + N + 1, a + N + 2);}
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(index); geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, mats().cactus); mesh.name = 'rounded-cactus-ribs'; mesh.castShadow = mesh.receiveShadow = true; group.add(mesh);
  const tufts: THREE.Matrix4[] = [], needles: THREE.Matrix4[] = [], rows = Math.max(5, Math.round(height / 0.014));
  for (let rib = 0; rib < ribs; rib++) for (let row = 1; row < rows; row++) {
    const t = (row + (rib % 2) * 0.28 + (random() - 0.5) * 0.12) / rows;
    if (t > 0.98) continue;
    const a = rib / ribs * TAU + phase, p = point(t, a), outward = new THREE.Vector3(Math.cos(a), THREE.MathUtils.smoothstep(t, 0.82, 1) * 1.3, Math.sin(a)).normalize();
    tufts.push(matrix(p.clone().addScaledVector(outward, 0.00055), outward, new THREE.Vector3(0.0012, 0.00065, 0.00145)));
    const vertical = new THREE.Vector3(0, 1, 0).addScaledVector(outward, -outward.y).normalize(), lateral = new THREE.Vector3().crossVectors(outward, vertical).normalize();
    for (let spine = 0; spine < 7; spine++) {
      const angle = spine / 6 * TAU + random() * 0.15;
      const direction = spine === 6 ? outward.clone() : outward.clone().multiplyScalar(0.45).addScaledVector(vertical, Math.cos(angle)).addScaledVector(lateral, Math.sin(angle)).normalize();
      const length = (0.0038 + random() * 0.0027) * (flowering ? 0.8 : 1);
      needles.push(matrix(p.clone().addScaledVector(outward, 0.001).addScaledVector(direction, length * 0.48), direction, new THREE.Vector3(1, length, 1)));
    }
  }
  instances(new THREE.IcosahedronGeometry(1, 0), mats().areoles, tufts, group, 'woolly-cactus-areoles');
  instances(new THREE.ConeGeometry(0.00014, 1, 5), mats().needles, needles, group, 'straw-radial-cactus-spines');
  if (flowering) flower(radius, height, group, random);
  return group;
}

function twig(curve: THREE.CatmullRomCurve3, radius: number) {
  const geometry = new THREE.TubeGeometry(curve, 9, radius, 5, false), p = geometry.getAttribute('position');
  for (let j = 0; j <= 9; j++) {
    const center = curve.getPoint(j / 9), taper = 1 - j / 9 * 0.75;
    for (let i = 0; i <= 5; i++) {const k = j * 6 + i; p.setXYZ(k, center.x + (p.getX(k) - center.x) * taper, center.y + (p.getY(k) - center.y) * taper, center.z + (p.getZ(k) - center.z) * taper);}
  }
  geometry.computeVertexNormals(); return geometry;
}

export function dryShrub(x: number, z: number, height: number, seed: number) {
  const group = new THREE.Group(), random = mulberry32(seed), stems: THREE.BufferGeometry[] = [], leaves: THREE.BufferGeometry[] = [], seeds: THREE.Matrix4[] = [];
  group.name = 'photographic-desert-shrub'; group.position.set(x, groundHeight(x, z), z);
  const leaf = (base: THREE.Vector3, direction: THREE.Vector3, length: number, dried: boolean) => {
    const vertices: number[] = [], uv: number[] = [], colors: number[] = [], index: number[] = [], side = new THREE.Vector3().crossVectors(direction, UP).normalize();
    for (let j = 0; j <= 10; j++) for (const s of [-1, 0, 1]) {
      const t = j / 10, width = Math.sin(Math.PI * t) ** 0.65 * length * 0.09;
      const p = base.clone().addScaledVector(direction, length * t).addScaledVector(side, width * s); p.y += Math.sin(t * Math.PI) * length * 0.16 + width * s * s * 0.38;
      vertices.push(p.x, p.y, p.z); uv.push(s * 0.5 + 0.5, t); colors.push(dried ? 0.98 : 0.83, dried ? 0.78 : 0.88, dried ? 0.48 : 0.81);
    }
    for (let j = 0; j < 10; j++) for (let s = 0; s < 2; s++) {const a = j * 3 + s; index.push(a, a + 1, a + 3, a + 1, a + 4, a + 3);}
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(index); geometry.computeVertexNormals(); leaves.push(geometry);
  };
  for (let stem = 0; stem < 18; stem++) {
    const angle = stem * 2.4 + random() * 0.5, h = height * (0.38 + random() * 0.62), spread = h * (0.27 + random() * 0.16);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3((random() - 0.5) * 0.009, 0, (random() - 0.5) * 0.009), new THREE.Vector3(Math.cos(angle) * spread * 0.3, h * 0.48, Math.sin(angle) * spread * 0.3), new THREE.Vector3(Math.cos(angle) * spread, h, Math.sin(angle) * spread)]);
    stems.push(twig(curve, 0.0008 + random() * 0.0004));
    for (let shoot = 0; shoot < 4; shoot++) {
      const t = 0.27 + shoot * 0.17, base = curve.getPoint(t), a = angle + (shoot % 2 ? 1 : -1) * (0.65 + random() * 0.7);
      const dir = new THREE.Vector3(Math.cos(a) * 0.72, 0.52 + random() * 0.4, Math.sin(a) * 0.72).normalize(), reach = height * (0.10 + random() * 0.13);
      const end = base.clone().addScaledVector(dir, reach), sideTwig = new THREE.CatmullRomCurve3([base, base.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.003, 0)), end]);
      stems.push(twig(sideTwig, 0.00042));
      for (let i = 0; i < 3; i++) {
        const p = sideTwig.getPoint(0.25 + i * 0.25), turn = a + (i % 2 ? 0.7 : -0.7);
        leaf(p, new THREE.Vector3(Math.cos(turn), 0.24 + random() * 0.5, Math.sin(turn)).normalize(), 0.009 + random() * 0.008, random() < 0.35);
      }
      if (random() < 0.45) for (let k = 0; k < 5; k++) {const p = end.clone().add(new THREE.Vector3((random() - 0.5) * 0.004, random() * 0.009, (random() - 0.5) * 0.004)); seeds.push(matrix(p, dir, new THREE.Vector3(0.0008, 0.0014, 0.0008)));}
    }
  }
  joined(stems, mats().bark, group, 'tapered-branching-dry-twigs'); joined(leaves, mats().sage, group, 'curled-silver-olive-leaves');
  instances(new THREE.IcosahedronGeometry(1, 0), mats().seeds, seeds, group, 'papery-dry-seed-clusters');
  return group;
}
