import { BufferAttribute, BufferGeometry } from "three";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";

// Keep vertices in compiler order for wave updates. Only the draw index is
// reordered: each material can then render in one call instead of one call
// for every alternating run of top and wall triangles.
export function surfaceGeometry(compiled) {
  const source = new BufferGeometry();
  source.setAttribute("position", new BufferAttribute(compiled.vertices, 3));
  source.setIndex(new BufferAttribute(compiled.indices, 1));
  const geometry = ["wave", "terrain"].includes(compiled.part?.motion?.axis)
    ? source.toNonIndexed()
    : toCreasedNormals(source, Math.PI / 5);
  if (["wave", "terrain"].includes(compiled.part?.motion?.axis))
    geometry.computeVertexNormals();
  source.dispose();

  const order = new Uint32Array(compiled.indices.length);
  let cursor = 0;
  for (const materialIndex of [0, 1]) {
    const start = cursor;
    for (let triangle = 0; triangle < compiled.roles.length; triangle++) {
      if ((compiled.roles[triangle] === "top" ? 0 : 1) !== materialIndex)
        continue;
      for (let vertex = 0; vertex < 3; vertex++)
        order[cursor++] = triangle * 3 + vertex;
    }
    if (cursor > start) geometry.addGroup(start, cursor - start, materialIndex);
  }
  geometry.setIndex(new BufferAttribute(order, 1));
  return geometry;
}
