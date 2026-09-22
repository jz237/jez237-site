import * as THREE from "three";
import { vacuumFragments } from "./vacuum-view.mjs";
import { slinkyCapturePose, slinkyReformPose } from "./slinky-capture.mjs";
import { birdFragmentPose } from "./bird-capture.mjs";

export function slinkyCaptureGroup(marble) {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(marble.geometry.clone(), marble.material);
  shell.castShadow = true;
  group.add(shell, vacuumFragments(marble.material));
  group.visible = false;
  return group;
}

export function updateSlinkyCapture(group, player, tick) {
  group.visible =
    player.status === "falling" &&
    !!(player.slinkyCapture || player.birdCapture);
  if (!group.visible) return;
  if (player.birdCapture) {
    const [shell, fragments] = group.children;
    shell.visible = false;
    fragments.visible = true;
    fragments.children.forEach((mesh, i) => {
      const p = birdFragmentPose(player.birdCapture, tick, i);
      mesh.visible = p.visible;
      if (!p.visible) return;
      mesh.position.set(p.position.x, p.position.y, p.position.z);
      mesh.quaternion.set(
        p.rotation.x,
        p.rotation.y,
        p.rotation.z,
        p.rotation.w,
      );
      mesh.rotateX(p.spin);
      mesh.scale.setScalar(p.scale);
    });
    return;
  }
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
