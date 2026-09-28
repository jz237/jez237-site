import * as T from 'three';
import placements from './quarry-north-backdrop.json';
import atlas from './quarry-north-backdrop-atlas.json';
import { backdropGeometryMaterial, createNorthImpostorMaterial, NORTH_BACKDROP_FADE } from './scenery-north-impostor';

type Materials = { wood: T.MeshStandardMaterial; needles: T.MeshStandardMaterial; trunks: T.MeshStandardMaterial[] };
type RidgeCell = { lod: T.LOD; centers: T.Vector3[]; near: T.Group; far: T.Group; images: T.Group };
const cells: RidgeCell[] = [];

/** Only the retained local photo-card identities are replaced; other species stay untouched. */
export function replacesNorthBackdropCard(x: number, z: number) {
  const angle = (Math.atan2(x / 1.08, z) * 180 / Math.PI + 360) % 360;
  return angle >= 350 || angle <= 45;
}

export async function loadNorthRidge(parent: T.Group, geometry: ReadonlyMap<string, T.BufferGeometry>, source: Materials) {
  const images = await Promise.all(atlas.variants.map(variant => createNorthImpostorMaterial({ ...atlas, ...variant })));
  const wood = backdropGeometryMaterial(source.wood), needles = backdropGeometryMaterial(source.needles);
  const trunks = source.trunks.map(backdropGeometryMaterial);
  const dummy = new T.Object3D();
  for (const stand of placements.stands) {
    const trees = placements.trees.filter(tree => tree.stand === stand.id);
    const lod = new T.LOD(); lod.name = 'north-ridge-' + stand.id; lod.autoUpdate = false;
    lod.position.set(stand.x, stand.y, stand.z);
    const near = new T.Group(), far = new T.Group(), cards = new T.Group();
    near.name = lod.name + '-near'; far.name = lod.name + '-far'; cards.name = lod.name + '-atlas';
    for (const variant of new Set(trees.map(tree => tree.variant))) {
      const groupTrees = trees.filter(tree => tree.variant === variant);
      const setInstances = (mesh: T.InstancedMesh) => {
        groupTrees.forEach((tree, index) => {
          dummy.position.set(tree.x - stand.x, tree.y - stand.y, tree.z - stand.z);
          dummy.rotation.set(0, tree.yaw, 0);
          dummy.scale.set(tree.height * tree.width, tree.height, tree.height * tree.width);
          dummy.updateMatrix(); mesh.setMatrixAt(index, dummy.matrix);
        });
        mesh.computeBoundingSphere(); mesh.computeBoundingBox();
      };
      for (const [suffix, group] of [['near', near], ['far', far]] as const) {
        for (const part of ['Wood', 'Needles', 'Trunk']) {
          const meshGeometry = geometry.get(`NorthFir_${variant}_${suffix}_${part}`);
          if (!meshGeometry) throw new Error('Missing ridge geometry: ' + variant + '/' + suffix + '/' + part);
          const material = part === 'Wood' ? wood : part === 'Needles' ? needles : trunks[variant];
          const mesh = new T.InstancedMesh(meshGeometry, material, groupTrees.length);
          mesh.name = `${lod.name}-${suffix}-${variant}-${part}`;
          setInstances(mesh);
          // The complete fixed map already contains every highest-detail tree.
          // Repeating distant foliage in the moving vehicle shadow pass doubles
          // its vertex cost without adding useful close branch resolution.
          mesh.castShadow = suffix === 'near'; mesh.receiveShadow = true;
          group.add(mesh);
        }
      }
      const image = images[variant];
      const plane = new T.PlaneGeometry(1, 1);
      // The shader rotates the full normalized frame, so its CPU culling bounds
      // must enclose every camera azimuth/elevation rather than the source plane.
      plane.boundingSphere = new T.Sphere(new T.Vector3().fromArray(atlas.center), Math.hypot(...atlas.frameSize) * .5);
      plane.boundingBox = new T.Box3().setFromCenterAndSize(new T.Vector3().fromArray(atlas.center),
        new T.Vector3().setScalar(Math.hypot(...atlas.frameSize)));
      const mesh = new T.InstancedMesh(plane, image.material, groupTrees.length);
      mesh.name = `${lod.name}-atlas-${variant}`;
      setInstances(mesh); mesh.onBeforeRender = image.beforeRender;
      mesh.castShadow = false; mesh.receiveShadow = true;
      cards.add(mesh);
    }
    // StaticQuarryShadows selects levels[0] even when camera-selected meshes
    // are hidden, retaining actual branch silhouettes instead of rotated cards.
    lod.addLevel(near, 0); lod.addLevel(far, 50); lod.addLevel(cards, NORTH_BACKDROP_FADE.end);
    near.visible = far.visible = false; cards.visible = true;
    parent.add(lod);
    cells.push({ lod, centers: trees.map(tree => new T.Vector3(tree.x, tree.y + tree.height * .5, tree.z)),
      near, far, images: cards });
  }
}

export function updateNorthRidgeView(camera: T.Camera) {
  const position = camera.getWorldPosition(new T.Vector3());
  for (const cell of cells) {
    const closest = Math.min(...cell.centers.map(center => center.distanceTo(position)));
    // The reflection origin can be up to the inspector's22m from the main eye.
    // Keep geometry available across that difference; its per-pass shader uses
    // the actual render camera for the complementary65–90m coverage fade.
    const geometryNeeded = closest < NORTH_BACKDROP_FADE.end + 32;
    cell.near.visible = geometryNeeded && closest < 50;
    cell.far.visible = geometryNeeded && !cell.near.visible;
    cell.images.visible = true;
  }
}

export function northRidgeDiagnostics(camera: T.Camera) {
  const position = camera.getWorldPosition(new T.Vector3());
  return cells.map(cell => ({ id: cell.lod.name, trees: cell.centers.length,
    closest: Math.min(...cell.centers.map(center => center.distanceTo(position))),
    near: cell.near.visible, far: cell.far.visible, atlas: cell.images.visible }));
}
