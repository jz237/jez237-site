import * as T from 'three';
import { GLTFLoader } from './model-loader';
import { url } from './assets';

export interface RoadsideMaterials {
  ground: T.MeshStandardMaterial;
  rock: T.MeshStandardMaterial;
  scannedRock: T.MeshStandardMaterial;
}

/** Spatial chunks keep independent bounds in main, shadow and reflection passes. */
export async function loadQuarryRoadside(parent: T.Group, materials: RoadsideMaterials): Promise<T.LOD[]> {
  const source = await new GLTFLoader().loadAsync(url('models/quarry-roadside.glb'));
  source.scene.updateMatrixWorld(true);
  const fragments = materials.scannedRock.clone();
  fragments.vertexColors = true;
  const chunks = new Map<number, Map<number, T.Mesh[]>>();
  const importedMaterials = new Set<T.Material>();
  source.scene.traverse(object => {
    if (!(object instanceof T.Mesh)) return;
    const match = /^Roadside(Ground|Fragments)_([0-2])_(near|far)$/.exec(object.name);
    if (!match) throw new Error(`Unknown roadside mesh: ${object.name}`);
    const chunk = Number(match[2]), level = match[3] === 'near' ? 0 : 1;
    if (!chunks.has(chunk)) chunks.set(chunk, new Map());
    const levels = chunks.get(chunk)!;
    if (!levels.has(level)) levels.set(level, []);
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    const ground = match[1] === 'Ground';
    if (ground) {
      // TextureLoader's world-aligned ground uses the original UV frame. Imported
      // fragments retain glTF atlas coordinates and must not receive this flip.
      const uv = geometry.getAttribute('uv');
      for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
      geometry.deleteAttribute('tangent');
      if (!geometry.hasAttribute('color')) throw new Error('Roadside ground is missing its material masks');
    }
    const mesh = new T.Mesh(geometry, ground ? materials.ground : fragments);
    mesh.name = object.name;
    mesh.castShadow = !ground;
    mesh.receiveShadow = true;
    levels.get(level)!.push(mesh);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) importedMaterials.add(material);
    object.geometry.dispose();
  });
  const result: T.LOD[] = [];
  for (const [chunk, levels] of chunks) {
    if (levels.get(0)?.length !== 2 || levels.get(1)?.length !== 2) throw new Error(`Incomplete roadside chunk ${chunk}`);
    const bounds = new T.Box3();
    for (const mesh of levels.get(0)!) { mesh.geometry.computeBoundingBox(); bounds.union(mesh.geometry.boundingBox!); }
    const centre = bounds.getCenter(new T.Vector3());
    const lod = new T.LOD();
    lod.name = `authored-quarry-roadside-${chunk}`;
    lod.position.copy(centre);
    lod.autoUpdate = false;
    for (const [level, meshes] of [...levels].sort((a, b) => a[0] - b[0])) {
      const group = new T.Group();
      for (const mesh of meshes) {
        mesh.geometry.translate(-centre.x, -centre.y, -centre.z);
        mesh.geometry.computeBoundingSphere();
        group.add(mesh);
      }
      group.visible = level === 1;
      lod.addLevel(group, level === 0 ? 0 : 105, .12);
    }
    parent.add(lod);
    result.push(lod);
  }
  if (result.length !== 3) throw new Error('Roadside requires three connected spatial chunks');
  for (const material of importedMaterials) material.dispose();
  return result;
}
