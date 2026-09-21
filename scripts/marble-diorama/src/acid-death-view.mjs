import * as THREE from "three";
import { acidCapturePose, acidReturnPose } from "./acid-capture.mjs";
import { vacuumFragments } from "./vacuum-view.mjs";

export function acidDeathGroup(marble, playerIndex) {
  const group = new THREE.Group();
  const material = marble.material.clone();
  const shell = new THREE.Mesh(marble.geometry.clone(), material);
  shell.castShadow = true;
  shell.userData.positions = shell.geometry.attributes.position.array.slice();
  shell.userData.map = material.map;
  shell.userData.color = playerIndex === 0 ? "#cf563f" : "#448fbb";
  group.add(shell, vacuumFragments(marble.material));
  group.visible = false;
  return group;
}
export function updateAcidDeath(
  group,
  player,
  zone,
  seconds,
  machineSpeed = 1,
) {
  group.visible = player.status === "falling" && !!player.acidCapture && !!zone;
  if (!group.visible) return;
  const capture = player.acidCapture;
  const pose = acidCapturePose(capture, zone, seconds, machineSpeed);
  const [shell, fragments] = group.children;
  shell.visible = pose.visible;
  if (shell.visible) {
    const radius = shell.geometry.parameters.radius;
    const initialCut = 0.125 - capture.offset.y;
    const cut = initialCut + (radius - initialCut) * pose.dissolved;
    const position = shell.geometry.attributes.position;
    const original = shell.userData.positions;
    // A closed cap retreats into the puddle instead of a whole sphere remaining
    // visible beneath the track when the diorama is viewed from the side.
    const rotation = new THREE.Quaternion(
      ...["x", "y", "z", "w"].map((k) => capture.rotation[k]),
    );
    const vertex = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      vertex.fromArray(original, i * 3).applyQuaternion(rotation);
      position.setXYZ(i, vertex.x, Math.max(vertex.y, cut), vertex.z);
    }
    position.needsUpdate = true;
    shell.geometry.computeVertexNormals();
    shell.geometry.computeBoundingSphere();
    shell.position.set(pose.position.x, pose.position.y - cut, pose.position.z);
    const map = pose.flash ? null : shell.userData.map;
    if (shell.material.map !== map) {
      shell.material.map = map;
      shell.material.needsUpdate = true;
    }
    shell.material.color.set(pose.flash ? shell.userData.color : "#ffffff");
  }
  fragments.visible = true;
  fragments.children.forEach((mesh, i) => {
    const pose = acidReturnPose(capture, seconds, i);
    mesh.visible = pose.visible;
    if (!pose.visible) return;
    mesh.position.set(pose.position.x, pose.position.y, pose.position.z);
    mesh.scale.setScalar(pose.scale);
    mesh.rotation.set(...pose.rotation);
  });
}
