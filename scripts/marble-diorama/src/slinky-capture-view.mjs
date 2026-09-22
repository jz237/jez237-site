import * as THREE from "three";
import { vacuumFragments } from "./vacuum-view.mjs";
import { slinkyCapturePose, slinkyReformPose } from "./slinky-capture.mjs";

export function slinkyCaptureGroup(marble) {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(marble.geometry.clone(), marble.material);
  shell.castShadow = true;
  group.add(shell, vacuumFragments(marble.material));
  group.visible = false;
  return group;
}

export function updateSlinkyCapture(group, player, tick) {
  group.visible = player.status === "falling" && !!player.slinkyCapture;
  if (!group.visible) return;
  const capture = player.slinkyCapture,
    [shell, fragments] = group.children;
  const pose = slinkyCapturePose(capture, tick);
  shell.visible = pose.visible;
  if (pose.visible) {
    shell.position.set(pose.position.x, pose.position.y, pose.position.z);
    shell.quaternion.set(
      pose.rotation.x,
      pose.rotation.y,
      pose.rotation.z,
      pose.rotation.w,
    );
    shell.scale.setScalar(pose.scale);
  }
  fragments.visible = true;
  fragments.children.forEach((mesh, i) => {
    const pose = slinkyReformPose(capture, tick, i);
    mesh.visible = pose.visible;
    if (!pose.visible) return;
    mesh.position.set(pose.position.x, pose.position.y, pose.position.z);
    mesh.rotation.set(...pose.rotation);
    mesh.scale.setScalar(pose.scale);
  });
}
