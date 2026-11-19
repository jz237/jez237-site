import { Box3, DynamicDrawUsage, Vector3 } from 'three';
import { GLASS_CLEAR } from '../render/scape/mesh.mjs';
import { LEAF_STRIDE, LEAN_CAP, MOTION_VERTEX_STRIDE, leafReach, placeVertices, plantCollide, plantSolids } from '../render/scape/plantMotion.mjs';

// Use the authored stalk and blade motion on the small raster meshes. The same
// positions go to WebGL, Learn's raycaster, and the fish's collision capsules.
export function movingPlant(mesh, geometry, obstacles) {
  const rest = mesh.positions, { vertex, leaves } = mesh.motion;
  const count = leaves.length / LEAF_STRIDE;
  const tips = new Int32Array(count);
  const furthest = new Float32Array(count).fill(-1);
  const lean = new Float32Array(count * 4);
  const point = new Vector3(), flow = [0, 0, 0];
  const attr = geometry.getAttribute('position').clone().setUsage(DynamicDrawUsage);
  geometry.setAttribute('position', attr);
  geometry.getAttribute('normal').setUsage(DynamicDrawUsage);
  const moved = attr.array;
  const reach = Array.from({ length: count }, (_, i) => {
    const b = i * LEAF_STRIDE;
    return leafReach(leaves, i) + LEAN_CAP * (2 * leaves[b + 7] + 1.5 * leaves[b + 11]);
  });
  // Only these vertices can reach the glass or a rock/branch. Narrow the
  // collision list once, then use the shared contact model on each update.
  const solids = plantSolids(obstacles, rest);
  const boxes = solids.map(s => new Box3().setFromPoints([new Vector3(...s.a), new Vector3(...s.b)]).expandByScalar(s.r));
  const contacts = [];
  for (let v = 0; v < rest.length / 3; v++) {
    const o = v * MOTION_VERTEX_STRIDE, leaf = vertex[o];
    if (leaf < 0) continue;
    if (vertex[o + 1] > furthest[leaf]) { tips[leaf] = v; furthest[leaf] = vertex[o + 1]; }
    point.fromArray(rest, 3 * v);
    const nearby = solids.filter((s, j) => boxes[j].distanceToPoint(point) <= reach[leaf]);
    if (nearby.length || point.length() + reach[leaf] >= GLASS_CLEAR - 0.004) contacts.push({ offset: 3 * v, nearby });
  }
  geometry.computeBoundingSphere();
  geometry.boundingSphere.radius += Math.max(...reach);

  function update(t, dt, surface, rotation, omega, bedAt) {
    const e = rotation.elements, follow = -Math.expm1(-dt / 0.30);
    for (let i = 0; i < count; i++) {
      const { x, y, z } = point.fromArray(moved, 3 * tips[i]).applyMatrix3(rotation);
      const top = surface.currentAt(x, y, z, bedAt(x, z), flow);
      // Relative water speed at the leaf tip, into the turning plant's frame.
      const wet = Math.max(0, Math.min(1, 1 + (top - y) / 0.12));
      const ux = flow[0] - (omega[1] * z - omega[2] * y);
      const uy = flow[1] - (omega[2] * x - omega[0] * z);
      const uz = flow[2] - (omega[0] * y - omega[1] * x);
      for (let k = 0; k < 3; k++) {
        const local = e[3 * k] * ux + e[3 * k + 1] * uy + e[3 * k + 2] * uz;
        lean[4 * i + k] += (0.35 * wet * local - lean[4 * i + k]) * follow;
      }
    }
    placeVertices(rest, vertex, leaves, t, lean, moved);
    for (const c of contacts) plantCollide(moved, c.offset, c.nearby);
    attr.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  function moveEnd(out, from, anchors) {
    out.fromArray(from);
    for (const [v, weight] of anchors) {
      const i = 3 * v;
      out.x += weight * (moved[i] - rest[i]);
      out.y += weight * (moved[i + 1] - rest[i + 1]);
      out.z += weight * (moved[i + 2] - rest[i + 2]);
    }
    return out;
  }
  return { update, moveEnd };
}
