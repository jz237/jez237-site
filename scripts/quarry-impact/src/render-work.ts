import * as T from 'three';

/** Authored scenery never changes transforms. LOD visibility and billboard
 * shader uniforms still update, while cars, loose props and cameras stay live. */
export function freezeSceneryTransforms(root: T.Object3D) {
  root.updateWorldMatrix(true, true);
  root.traverse(object => {
    object.matrixAutoUpdate = false;
    object.matrixWorldAutoUpdate = false;
  });
}
