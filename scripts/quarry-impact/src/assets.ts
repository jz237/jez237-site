import {buildClassicVehicle} from './classic-vehicles';
import {CLASSIC_VEHICLES,isClassicKind} from './classic-vehicle-specs';
import * as THREE from 'three';
import { GLTFLoader } from './model-loader';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import type { CarKind } from './rules';
import { finishGlass, finishPaint } from './car-materials';
import { configureCoupe } from './coupe-realism';
import { prepareWreckGeometry } from './wreck-geometry';
import { wreckTopology } from './wreck-topology';
import { alignWreckSeams } from './wreck-seams';
import {constructionRole,type ConstructionRole} from './vehicle-construction';
import {prepareWheelPresentation,attachWheelPresentation} from './wheel-presentation';
export const base = import.meta.env?.BASE_URL ?? './';
export const url = (p: string) => base + p;
export const templates = new Map<CarKind, THREE.Group>();
// Batch decoration by material, retaining independent wheels and deformable body panels.
function batch(group: THREE.Object3D, root: boolean) {
  group.updateMatrixWorld(true);
  const inv = group.matrixWorld.clone().invert();
  const batches = new Map<string, {material:THREE.Material;role:ConstructionRole;geometries:THREE.BufferGeometry[]}>();
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
    const role=root?constructionRole(o.name):'skin',key=m.uuid+':'+role;
    if(!batches.has(key))batches.set(key,{material:m,role,geometries:[]});
    batches.get(key)!.geometries.push(geo);
    remove.push(o);
  });
  for (const o of remove) o.removeFromParent();
  for (const {material:m,role,geometries:geos} of batches.values()) {
    const g = mergeGeometries(geos);
    if (g) {
      const mesh = new THREE.Mesh(g, m);
      // Interiors, radiator fins and brake hardware do not need a second full
      // render into the shadow map. Outer panels and tires supply the silhouette.
      mesh.castShadow = !root && m.name.startsWith('Tire');
      mesh.receiveShadow = true;
      mesh.name = 'detail_' + (role==='skin'?'':role+'_') + m.name;
      mesh.userData.constructionRole=role;
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
  const legacyKinds: CarKind[] = ['coupe', 'sedan', 'hatch'];
  const kinds: CarKind[] = [...legacyKinds,'muscle','wagon'];
  // Start independent transfers together; preserve template processing order.
  const [loaded] = await Promise.all([Promise.all(legacyKinds.map(kind => loader.loadAsync(url('models/' + kind + '.glb')))),prepareWheelPresentation()]);
  for (const [index, kind] of kinds.entries()) {
    progress('Preparing ' + kind + ' bodywork');
    const gltf = isClassicKind(kind)?{scene:buildClassicVehicle(kind)}:loaded[index];
    alignWreckSeams(gltf.scene);
    // Keep the window seals with the moving door instead of batching them
    // into a fixed material group across the whole car.
    gltf.scene.traverse(o=>{if(o.name.startsWith('seal_BodyDoor'))o.name='panel_'+o.name;});
    batch(gltf.scene, true);
    // Shared refined templates are built once. Cars clone their deformable
    // buffers; no remeshing, loading or asynchronous work occurs during a hit.
    gltf.scene.traverse(o => {
      if (!(o instanceof THREE.Mesh)) return;
      let parent = o.parent;
      while (parent && parent !== gltf.scene) {
        if (parent.name.startsWith('wheel_')) return;
        parent = parent.parent;
      }
      const old = o.geometry;
      o.geometry = wreckTopology(old, o.name.startsWith('detail_') ? .23 : .14);
      old.dispose();
    });
    templates.set(kind, gltf.scene);
  }
}
export function cloneCar(kind: CarKind, color: number) {
  const root = templates.get(kind)!.clone(true);
  if(!isClassicKind(kind))attachWheelPresentation(root);
  const materials = new Map<THREE.Material, THREE.Material>();
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    o.castShadow = o.name.startsWith('panel_') && !/Handle|Mirror|Interior|Topgrill/i.test(o.name) || o.name.includes('Tire');
    o.receiveShadow = true;
    const old = o.material as THREE.MeshStandardMaterial;
    // One paint material per color per car; wear is carried by each panel's
    // vertex attribute. Window material instances keep independent crack states.
    const glass = o.name.startsWith('glass_');
    if (!glass && materials.has(old)) o.material = materials.get(old)!;
    else {
      o.material = old.clone();
      if (!glass) materials.set(old, o.material);
    }
    const m = o.material as THREE.MeshPhysicalMaterial;
    if (old.name.startsWith('paint')) {
      const trim = old.name.includes('Paint 2');
      m.color.setHex(trim ? 0x202529 : color);
      m.metalness = trim ? .18 : 0.48;
      m.roughness = trim ? .38 : 0.24;
      m.normalScale.setScalar(.055);
      if ('clearcoat' in m) { m.clearcoat = trim ? .45 : 1; m.clearcoatRoughness = 0.12; }
      finishPaint(m, kind !== 'coupe');
    }
    if (o.name.startsWith('panel_')) {
      o.geometry = o.geometry.clone();
      o.userData.original = new Float32Array(
        o.geometry.attributes.position.array,
      );
      o.userData.originalNormals = new Float32Array(o.geometry.attributes.normal.array);
      o.geometry.setAttribute('impactWear', new THREE.BufferAttribute(new Float32Array(o.geometry.attributes.position.count * 2), 2));
      o.userData.damage = 0;
    }
    if (old.name.includes('Headlight')) {
      m.emissive.setHex(0xe2f1ff);
      m.emissiveIntensity = 3;
    }
    if (old.name.includes('Brakelight')) {
      m.emissive.setHex(0xff1105);
      m.emissiveIntensity = 0.8;
    }
    if (old.name.includes('Tire')) { m.roughness = 0.94; m.metalness = 0; m.color.copy(old.color).multiplyScalar(.72); }
    if (old.name.startsWith('Interior')) m.roughness = Math.max(.7, m.roughness);
    if (o.name.startsWith('glass_')) {
      m.transmission = 0;
      m.color.setHex(0x476166);
      m.metalness = 0.15;
      m.transparent = true;
      m.opacity = 0.28;
      m.side = THREE.FrontSide;
      m.depthWrite = false;
      m.roughness = 0.055;
      m.envMapIntensity = 1.2;
      finishGlass(m, o.geometry);
      o.userData.damage = 0;
      o.castShadow = false;
    }
  });
  prepareWreckGeometry(root);
  if (kind === 'coupe') configureCoupe(root);
  root.position.y = -(isClassicKind(kind)?CLASSIC_VEHICLES[kind].modelOffset:kind === 'coupe' ? 1 : kind === 'sedan' ? 1.04 : 1.05);
  return root;
}
export const textures = new Map<string, THREE.Texture>();
const surfaceTextures = new Map<string, THREE.Texture>();
export function texture(name: string, repeat = 1, color = false) {
  // Terrain, shoulders and cliff shaders often use the same maps. Share only
  // identical sampling/color settings; different UV repeats need separate objects.
  const key = `${name}:${repeat}:${color ? 'srgb' : 'linear'}`;
  const existing = surfaceTextures.get(key);
  if (existing) return existing;
  const t = new THREE.TextureLoader().load(url('assets/' + name + '.jpg'));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  surfaceTextures.set(key, t);
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
  scene.backgroundRotation.y = 1.1;
  scene.environmentRotation.y = 1.1;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromEquirectangular(hdr);
  scene.environment = target.texture;
  scene.environmentIntensity = 0.54;
  pmrem.dispose();
  return target;
}
