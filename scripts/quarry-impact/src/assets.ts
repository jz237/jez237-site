import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import type { CarKind } from './rules';
export const base = import.meta.env?.BASE_URL ?? './';
export const url = (p: string) => base + p;
export const templates = new Map<CarKind, THREE.Group>();
// Batch decoration by material, retaining independent wheels and deformable body panels.
function batch(group: THREE.Object3D, root: boolean) {
  group.updateMatrixWorld(true);
  const inv = group.matrixWorld.clone().invert();
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const remove: THREE.Object3D[] = [];
  group.traverse((o) => {
    if (
      !(o instanceof THREE.Mesh) ||
      o.name.startsWith('panel_') ||
      o.name.startsWith('glass_')
    )
      return;
    let p = o.parent;
    while (p && p !== group) {
      if (p.name.startsWith('wheel_')) return;
      p = p.parent;
    }
    const geo = o.geometry.clone();
    geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    geo.deleteAttribute('tangent');
    if (!geo.attributes.uv1 && geo.attributes.uv)
      geo.setAttribute('uv1', geo.attributes.uv.clone());
    const m = o.material as THREE.Material;
    if (!batches.has(m)) batches.set(m, []);
    batches.get(m)!.push(geo);
    remove.push(o);
  });
  for (const o of remove) o.removeFromParent();
  for (const [m, geos] of batches) {
    const g = mergeGeometries(geos);
    if (g) {
      const mesh = new THREE.Mesh(g, m);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = 'detail_' + m.name;
      group.add(mesh);
    }
    for (const g of geos) g.dispose();
  }
  if (root)
    for (const name of ['FL', 'FR', 'RL', 'RR']) {
      const w = group.getObjectByName('wheel_' + name);
      if (w) batch(w, false);
    }
}
export async function loadCars(progress: (s: string) => void) {
  const loader = new GLTFLoader();
  for (const kind of ['coupe', 'sedan', 'hatch'] as CarKind[]) {
    progress('Preparing ' + kind + ' bodywork');
    const gltf = await loader.loadAsync(url('models/' + kind + '.glb'));
    batch(gltf.scene, true);
    templates.set(kind, gltf.scene);
  }
}
export function cloneCar(kind: CarKind, color: number) {
  const root = templates.get(kind)!.clone(true);
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const old = o.material as THREE.MeshStandardMaterial;
    o.material = old.clone();
    const m = o.material as THREE.MeshPhysicalMaterial;
    if (old.name.startsWith('paint')) {
      m.color.setHex(color);
      m.metalness = 0.65;
      m.roughness = 0.28;
      if ('clearcoat' in m) m.clearcoat = 0.8;
    }
    if (o.name.startsWith('panel_')) {
      o.geometry = o.geometry.clone();
      o.userData.original = new Float32Array(
        o.geometry.attributes.position.array,
      );
    }
    if (old.name.includes('Headlight')) {
      m.emissive.setHex(0xe2f1ff);
      m.emissiveIntensity = 2;
    }
    if (old.name.includes('Brakelight')) {
      m.emissive.setHex(0xff1105);
      m.emissiveIntensity = 1.5;
    }
    if (o.name.startsWith('glass_')) {
      m.transmission = 0;
      m.color.setHex(0x29434a);
      m.metalness = 0.25;
      m.transparent = true;
      m.opacity = 0.5;
      m.side = THREE.DoubleSide;
      m.depthWrite = false;
      m.roughness = 0.12;
    }
  });
  root.position.y = -0.8;
  return root;
}
export const textures = new Map<string, THREE.Texture>();
export function texture(name: string, repeat = 1, color = false) {
  const t = new THREE.TextureLoader().load(url('assets/' + name + '.jpg'));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  textures.set(name, t);
  return t;
}
export function pbr(
  prefix: string,
  repeat: number,
  options: THREE.MeshStandardMaterialParameters = {},
) {
  return new THREE.MeshStandardMaterial({
    map: texture(prefix + '_diff', repeat, true),
    normalMap: texture(prefix + '_nor_gl', repeat),
    roughnessMap: texture(prefix + '_rough', repeat),
    roughness: 1,
    ...options,
  });
}
export async function environment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
) {
  const hdr = await new HDRLoader().loadAsync(url('assets/sky.hdr'));
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdr;
  scene.backgroundRotation.y = 1.9;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromEquirectangular(hdr);
  scene.environment = target.texture;
  scene.environmentIntensity = 0.65;
  pmrem.dispose();
  return target;
}
