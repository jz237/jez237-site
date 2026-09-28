import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { url } from './assets';

// Each section keeps an independent bound for main, shadow and reflection views.
// The file contains geometry only; both surfaces reuse maps already in the scene.
export async function loadQuarryHeadwall(
  parent: T.Group,
  rock: T.MeshStandardMaterial,
  scannedRock: T.MeshStandardMaterial,
): Promise<T.LOD[]> {
  const gltf = await new GLTFLoader().loadAsync(url('models/quarry-headwall.glb'));
  gltf.scene.updateMatrixWorld(true);
  const rubble = scannedRock.clone();
  rubble.vertexColors = true;
  const sections = new Map<number, Map<number, T.Mesh[]>>();
  const importedMaterials = new Set<T.Material>();
  gltf.scene.traverse(object => {
    if (!(object instanceof T.Mesh)) return;
    const match = /^Headwall(Rock|Rubble)_(\d+)(?:_(near|far))?$/i.exec(object.name);
    if (!match) throw new Error(`Unknown quarry headwall mesh: ${object.name}`);
    const section = Number(match[2]), level = match[3]?.toLowerCase() === 'far' ? 1 : 0;
    if (!sections.has(section)) sections.set(section, new Map());
    const levels = sections.get(section)!;
    if (!levels.has(level)) levels.set(level, []);
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    const isWall = match[1].toLowerCase() === 'rock';
    if (isWall) {
      // Blender writes glTF UVs for glTF's unflipped image convention. These
      // walls reuse the ring's TextureLoader material, so restore its UV frame.
      // Rubble retains the imported glTF atlas and must keep its exported UVs.
      const uv = geometry.getAttribute('uv');
      for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
      geometry.deleteAttribute('tangent');
    }
    const mesh = new T.Mesh(geometry, isWall ? rock : rubble);
    mesh.name = object.name;
    mesh.castShadow = mesh.receiveShadow = true;
    levels.get(level)!.push(mesh);
    for (const material of Array.isArray(object.material) ? object.material : [object.material])
      importedMaterials.add(material);
    object.geometry.dispose();
  });
  const lods: T.LOD[] = [];
  for (const [index, levels] of sections) {
    if (levels.get(0)?.length !== 2 || levels.get(1)?.length !== 2)
      throw new Error(`Quarry headwall section ${index} is missing a surface or detail level`);
    const bounds = new T.Box3();
    for (const mesh of levels.get(0)!) {
      mesh.geometry.computeBoundingBox();
      bounds.union(mesh.geometry.boundingBox!);
    }
    const centre = bounds.getCenter(new T.Vector3());
    const lod = new T.LOD();
    lod.name = `authored-quarry-headwall-${index}`;
    lod.autoUpdate = false;
    lod.position.copy(centre);
    for (const [level, meshes] of [...levels].sort((a, b) => a[0] - b[0])) {
      const group = new T.Group();
      for (const mesh of meshes) {
        mesh.geometry.translate(-centre.x, -centre.y, -centre.z);
        mesh.geometry.computeBoundingSphere();
        group.add(mesh);
      }
      group.visible = level === 1;
      lod.addLevel(group, level === 0 ? 0 : 120, .12);
    }
    parent.add(lod);
    lods.push(lod);
  }
  if (lods.length !== 3) throw new Error('Quarry headwall must contain three adjoining sections');
  for (const material of importedMaterials) material.dispose();
  return lods;
}
