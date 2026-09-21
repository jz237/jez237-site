import {
  Group,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  MeshStandardMaterial,
} from "three";

export function actorMesh(solids) {
  const group = new Group();
  group.userData.articulated = true;
  for (const solid of solids) {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(solid.vertices.slice(), 3),
    );
    geometry.setIndex(new BufferAttribute(solid.indices, 1));
    geometry.computeVertexNormals();
    const mesh = new Mesh(
      geometry,
      new MeshStandardMaterial({
        color: solid.color,
        roughness: 0.36,
        metalness: 0.06,
      }),
    );
    mesh.name = solid.name;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

export function updateActorMesh(group, solids) {
  solids.forEach((solid, i) => {
    if (!solid.dynamic) return;
    const geometry = group.children[i].geometry;
    geometry.attributes.position.array.set(solid.vertices);
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  });
}
