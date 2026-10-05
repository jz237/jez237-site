import * as THREE from 'three';

// three draws a transparent double-sided mesh in two passes (back faces, then
// front faces) and flags its material for a full shader-program re-check
// before each pass, so the garden's ~45 such meshes (the creatures' glass wings
// and wing-blur discs, the glazing) cost ~95 program look-ups and twice the
// draws every frame. For a flat mesh the two passes draw exactly the
// triangles a single pass would, in the same order (every triangle faces the
// same way), so its material renders single-pass with identical pixels.
// Curved glass (the vault, cloches, bell jars) keeps the two passes.

const planar = (geometry) => {
  const pos = geometry.attributes.position;
  if (!pos || pos.count < 3) return true;
  // a plane through the first non-degenerate triangle; every vertex on it
  const a = new THREE.Vector3().fromBufferAttribute(pos, 0);
  const b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), p = new THREE.Vector3();
  let found = false;
  for (let i = 1; i < pos.count && !found; i++) {
    b.fromBufferAttribute(pos, i);
    for (let j = i + 1; j < Math.min(pos.count, i + 64); j++) {
      c.fromBufferAttribute(pos, j);
      n.subVectors(b, a).cross(p.subVectors(c, a));
      if (n.lengthSq() > 1e-12) { found = true; break; }
    }
  }
  if (!found) return true;
  n.normalize();
  if (!geometry.boundingSphere) geometry.computeBoundingSphere();
  const tol = 1e-4 * Math.max(1e-3, geometry.boundingSphere.radius);
  for (let i = 0; i < pos.count; i++) if (Math.abs(p.fromBufferAttribute(pos, i).sub(a).dot(n)) > tol) return false;
  return true;
};

export function singlePassFlatGlass(root) {
  const byMat = new Map();
  root.traverse((o) => {
    if (!o.isMesh || !o.material) return;
    for (const m of [].concat(o.material)) {
      if (!(m.transparent && m.side === THREE.DoubleSide && !m.forceSinglePass)) continue;
      let l = byMat.get(m);
      if (!l) byMat.set(m, (l = []));
      l.push(o);
    }
  });
  let n = 0;
  for (const [m, meshes] of byMat) {
    // morphs or skinning could bend a flat mesh at draw time
    if (meshes.every((o) => !o.isSkinnedMesh && !o.morphTargetInfluences && planar(o.geometry))) { m.forceSinglePass = true; n++; }
  }
  return n;
}
