import * as THREE from "three";
import { flagBlend, flagClothPoint } from "./native-flags.mjs";

export function nativeFlagGroup(pole) {
  const group = new THREE.Group();
  group.position.set(pole.x, pole.y, pole.z);
  group.rotation.y = -(pole.angle ?? 0);
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: "#e1d7bb",
    roughness: 0.38,
    metalness: 0.4,
  });
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(
      pole.height * 0.015,
      pole.height * 0.018,
      pole.height,
      12,
    ),
    poleMaterial,
  );
  stem.position.y = pole.height / 2;
  stem.castShadow = true;
  group.add(stem);
  const finial = new THREE.Mesh(
    new THREE.SphereGeometry(pole.height * 0.025, 12, 8),
    poleMaterial,
  );
  finial.position.y = pole.height;
  group.add(finial);
  const positions = [],
    colors = [],
    samples = [];
  const cream = new THREE.Color("#f2eee2"),
    black = new THREE.Color("#222727");
  const columns = 12,
    rows = 8;
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < columns; col++) {
      const color =
        (Math.floor(row / (rows / 2)) + Math.floor(col / (columns / 2))) % 2
          ? cream
          : black;
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
        [1, 1],
        [0, 1],
      ]) {
        const u = (col + dx) / columns,
          v = (row + dy) / rows;
        const point = flagClothPoint(pole, u, v, 0);
        samples.push([u, v]);
        positions.push(point.x, point.y, point.z);
        colors.push(color.r, color.g, color.b);
      }
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const cloth = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.88,
    }),
  );
  cloth.castShadow = cloth.receiveShadow = true;
  cloth.frustumCulled = false;
  group.add(cloth);
  group.userData = { pole, cloth, samples };
  group.visible = false;
  return group;
}

export function updateNativeFlag(group, actor, fraction) {
  const blend = flagBlend(actor, Math.max(0, Math.min(1, fraction)));
  group.visible = blend !== null;
  if (!group.visible || group.userData.blend === blend) return;
  const { pole, cloth, samples } = group.userData;
  const positions = cloth.geometry.attributes.position;
  samples.forEach(([u, v], i) => {
    const point = flagClothPoint(pole, u, v, blend);
    positions.setXYZ(i, point.x, point.y, point.z);
  });
  positions.needsUpdate = true;
  cloth.geometry.computeVertexNormals();
  group.userData.blend = blend;
}
