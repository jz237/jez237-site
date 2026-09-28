import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { url } from './assets';
import bounds from './quarry-road-approach-bounds.json';

export const ROAD_APPROACH_START = bounds.startSegment;
export const ROAD_APPROACH_END = bounds.endSegmentExclusive;

export interface RoadApproachMaterials {
  lane: T.MeshStandardMaterial;
  skirt: T.MeshStandardMaterial;
  scannedRock: T.MeshStandardMaterial;
}

/** Two continuous surface draws plus two independently culled fragment chunks. */
export async function loadQuarryRoadApproach(parent: T.Group, materials: RoadApproachMaterials): Promise<T.LOD[]> {
  const source = await new GLTFLoader().loadAsync(url('models/quarry-road-approach.glb'));
  source.scene.updateMatrixWorld(true);
  const fragments = materials.scannedRock.clone();
  fragments.vertexColors = true;
  const chunks = new Map<number, Map<number, T.Mesh>>();
  const importedMaterials = new Set<T.Material>();
  let surfaces = 0;
  source.scene.traverse(object => {
    if (!(object instanceof T.Mesh)) return;
    const ground = object.name === 'RoadLane' || object.name === 'RoadSkirt';
    const match = /^RoadFragments_([01])_(near|far)$/.exec(object.name);
    if (!ground && !match) throw new Error(`Unknown road approach mesh: ${object.name}`);
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    if (ground) {
      const uv = geometry.getAttribute('uv');
      for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
      geometry.deleteAttribute('tangent');
      if (!geometry.hasAttribute('color')) throw new Error('Road approach material masks are missing');
    }
    const material = ground ? object.name === 'RoadLane' ? materials.lane : materials.skirt : fragments;
    const mesh = new T.Mesh(geometry, material);
    mesh.name = object.name;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    geometry.computeBoundingSphere();
    if (ground) { parent.add(mesh); surfaces++; }
    else {
      const chunk = Number(match![1]), level = match![2] === 'near' ? 0 : 1;
      if (!chunks.has(chunk)) chunks.set(chunk, new Map());
      chunks.get(chunk)!.set(level, mesh);
    }
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) importedMaterials.add(material);
    object.geometry.dispose();
  });
  const result: T.LOD[] = [];
  for (const [chunk, levels] of chunks) {
    if (levels.size !== 2) throw new Error(`Incomplete road fragment chunk ${chunk}`);
    const near = levels.get(0)!;
    near.geometry.computeBoundingBox();
    const centre = near.geometry.boundingBox!.getCenter(new T.Vector3());
    const lod = new T.LOD();
    lod.name = `quarry-road-fragments-${chunk}`;
    lod.autoUpdate = false;
    lod.position.copy(centre);
    for (const [level, mesh] of [...levels].sort((a, b) => a[0] - b[0])) {
      mesh.geometry.translate(-centre.x, -centre.y, -centre.z);
      mesh.geometry.computeBoundingSphere();
      mesh.visible = level === 1;
      lod.addLevel(mesh, level === 0 ? 0 : 65, .12);
    }
    parent.add(lod);
    result.push(lod);
  }
  if (surfaces !== 2 || result.length !== 2) throw new Error('Road approach requires two surfaces and two fragment chunks');
  for (const material of importedMaterials) material.dispose();
  return result;
}
