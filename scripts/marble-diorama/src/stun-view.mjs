import * as THREE from "three";

// Blue circling strokes are visible around the original dizzy marble. Each
// miniature mark is a curved, solid tube, with real depth and occlusion.
export function stunMarks() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: "#2459ec",
    roughness: 0.35,
    metalness: 0.1,
  });
  for (let i = 0; i < 3; i++) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0, -0.06),
      new THREE.Vector3(-0.08, 0.06, 0),
      new THREE.Vector3(0.04, 0.03, 0.05),
      new THREE.Vector3(0.17, 0, 0),
    ]);
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 12, 0.035, 6, false),
      material,
    );
    mesh.castShadow = true;
    group.add(mesh);
  }
  group.visible = false;
  return group;
}
export function updateStunMarks(group, player, seconds, position) {
  group.visible =
    player.status === "racing" &&
    seconds * 120 >= player.stunTick &&
    seconds * 120 < player.stunnedUntil;
  if (!group.visible) return;
  group.position.copy(position);
  const age = seconds - player.stunTick / 120;
  group.children.forEach((mesh, i) => {
    const a = age * 9 + (i * Math.PI * 2) / 3;
    mesh.position.set(
      Math.cos(a) * 0.72,
      0.2 + Math.sin(a * 2) * 0.08,
      Math.sin(a) * 0.72,
    );
    mesh.rotation.y = -a;
  });
}
