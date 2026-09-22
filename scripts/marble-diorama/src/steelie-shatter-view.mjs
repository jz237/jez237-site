import * as THREE from "three";
import { vacuumFragmentGeometry } from "./vacuum-view.mjs";
import { steelieBreakPose, steelieChipPose } from "./steelie-shatter.mjs";

export function steelieShatterGroup(material) {
  const group = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(vacuumFragmentGeometry(i), material);
    mesh.castShadow = true;
    group.add(mesh);
  }
  const chips = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    material,
    24,
  );
  chips.castShadow = true;
  group.add(chips);
  group.visible = false;
  return group;
}

const spin = new THREE.Quaternion(),
  axis = new THREE.Vector3(1, 0.6, 0.35).normalize(),
  vertex = new THREE.Vector3(),
  chip = new THREE.Object3D();
export function updateSteelieShatter(group, enemy, sourceTime) {
  const c = enemy.steelieShatter;
  group.visible =
    !!c && !!enemy.nativeSteelie.loaded && enemy.nativeSteelie.breaking;
  if (!group.visible) return;
  group.position.set(c.origin.x, c.origin.y, c.origin.z);
  for (let i = 0; i < 8; i++) {
    const mesh = group.children[i],
      p = steelieBreakPose(c, sourceTime, i);
    mesh.visible = p.visible;
    if (!p.visible) continue;
    mesh.position.set(p.position.x, p.position.y, p.position.z);
    mesh.scale.setScalar(p.scale);
    mesh.quaternion.set(c.rotation.x, c.rotation.y, c.rotation.z, c.rotation.w);
    spin.setFromAxisAngle(axis, p.spin);
    mesh.quaternion.premultiply(spin);
    // Settle closed chips on the landing plane even as their cut faces rotate.
    // They are a non-colliding retirement effect, never a hidden obstacle.
    const positions = mesh.geometry.attributes.position;
    let bottom = Infinity;
    for (let j = 0; j < positions.count; j++) {
      vertex.fromBufferAttribute(positions, j).applyQuaternion(mesh.quaternion);
      bottom = Math.min(bottom, vertex.y * p.scale);
    }
    mesh.position.y = Math.max(mesh.position.y, -c.radius - bottom);
  }
  const chips = group.children[8];
  chips.visible = steelieChipPose(c, sourceTime, 0).visible;
  if (!chips.visible) return;
  for (let i = 0; i < 24; i++) {
    const p = steelieChipPose(c, sourceTime, i);
    chip.position.set(p.position.x, p.position.y, p.position.z);
    chip.scale.setScalar(p.scale);
    chip.rotation.set(i, i * 0.7, i * 0.3);
    chip.updateMatrix();
    chips.setMatrixAt(i, chip.matrix);
  }
  chips.instanceMatrix.needsUpdate = true;
  chips.computeBoundingSphere();
}
