import * as THREE from "three";
import { acidShape, acidPositionAt } from "./acid.mjs";
export function acidMesh(zone) {
  const data = acidShape(zone, 0),
    geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(data.vertices.slice(), 3),
  );
  geometry.setIndex(new THREE.BufferAttribute(data.indices.slice(), 1));
  const colors = new Float32Array(data.vertices.length);
  for (let i = 0; i < colors.length / 3; i++) {
    const shade = i < 40 ? 0.7 : i < 80 ? 1 : i < 120 ? 0.68 : 0.62;
    colors.set([shade, shade, shade], i * 3);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: "#15930c",
      vertexColors: true,
      emissive: "#062000",
      emissiveIntensity: 0.08,
      roughness: 0.2,
      metalness: 0.02,
    }),
  );
  const p = acidPositionAt(zone, 0);
  mesh.position.set(p.x, p.y, p.z);
  return mesh;
}
export function updateAcidMesh(
  mesh,
  zone,
  previousTime,
  currentTime,
  alpha,
  currentPosition,
) {
  const current = acidShape(zone, currentTime),
    previous = acidShape(zone, previousTime);
  const position = mesh.geometry.attributes.position;
  for (let i = 0; i < position.array.length; i++)
    position.array[i] =
      previous.vertices[i] +
      (current.vertices[i] - previous.vertices[i]) * alpha;
  position.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeBoundingSphere();
  const before = acidPositionAt(zone, previousTime),
    now = currentPosition ?? acidPositionAt(zone, currentTime);
  mesh.position.set(
    before.x + (now.x - before.x) * alpha,
    before.y + (now.y - before.y) * alpha,
    before.z + (now.z - before.z) * alpha,
  );
}
