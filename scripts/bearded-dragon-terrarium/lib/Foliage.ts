import * as THREE from 'three';
// Shared skin lighting, retained from the original dragon's material.
export const foliageUniforms = {
  uKeyDirView: {value: new THREE.Vector3(0, 1, 0)},
  uKeyColor: {value: new THREE.Color(1, 0.85, 0.65)},
};
