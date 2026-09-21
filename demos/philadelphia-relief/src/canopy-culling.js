/** Keep the original crowns, but submit only spatial batches touching the view. */
export function createCanopyCulling(THREE, geometry, positions, sizes, cellSize = 4000) {
  const groups = new Map();
  for (let i = 0; i < sizes.length; i++) {
    const x = positions[i * 3], z = positions[i * 3 + 2];
    const key = `${Math.floor(x / cellSize)}:${Math.floor(z / cellSize)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(i);
  }
  const sourcePositions = new Float32Array(positions.length), sourceSizes = new Float32Array(sizes.length);
  const batches = []; let offset = 0;
  for (const indices of groups.values()) {
    const box = new THREE.Box3(); let radius = 0;
    for (const i of indices) {
      const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
      sourcePositions.set([x, y, z], offset * 3); sourceSizes[offset++] = sizes[i];
      box.expandByPoint(new THREE.Vector3(x, y, z)); radius = Math.max(radius, sizes[i]);
    }
    batches.push({ box, radius, start: offset - indices.length, end: offset });
  }
  const position = new THREE.InstancedBufferAttribute(sourcePositions.slice(), 3);
  const size = new THREE.InstancedBufferAttribute(sourceSizes.slice(), 1);
  position.setUsage(THREE.DynamicDrawUsage); size.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('aTree', position); geometry.setAttribute('aSize', size);
  geometry.instanceCount = sizes.length;
  const matrix = new THREE.Matrix4(), previous = new THREE.Matrix4();
  const frustum = new THREE.Frustum(), bounds = new THREE.Box3();
  let lastExag, lastAmount, selected = batches.map((_, i) => i).join(',');
  return {
    update(camera, exaggeration, amount) {
      matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      if (matrix.equals(previous) && exaggeration === lastExag && amount === lastAmount) return;
      previous.copy(matrix); lastExag = exaggeration; lastAmount = amount;
      frustum.setFromProjectionMatrix(matrix);
      const visible = [];
      for (let i = 0; i < batches.length; i++) {
        const b = batches[i], pad = b.radius * Math.abs(amount);
        // Includes the shader's lobes, asymmetric crown profile and trunk offset.
        bounds.min.set(b.box.min.x - pad * 1.3,
          Math.min(b.box.min.y * exaggeration, b.box.max.y * exaggeration) - pad * 2,
          b.box.min.z - pad * 1.3);
        bounds.max.set(b.box.max.x + pad * 1.3,
          Math.max(b.box.min.y * exaggeration, b.box.max.y * exaggeration) + pad * 3,
          b.box.max.z + pad * 1.3);
        if (frustum.intersectsBox(bounds)) visible.push(i);
      }
      const key = visible.join(',');
      if (key === selected) return;
      selected = key; let count = 0;
      for (const i of visible) {
        const b = batches[i];
        position.array.set(sourcePositions.subarray(b.start * 3, b.end * 3), count * 3);
        size.array.set(sourceSizes.subarray(b.start, b.end), count); count += b.end - b.start;
      }
      geometry.instanceCount = count;
      if (count) {
        position.clearUpdateRanges(); position.addUpdateRange(0, count * 3); position.needsUpdate = true;
        size.clearUpdateRanges(); size.addUpdateRange(0, count); size.needsUpdate = true;
      }
    },
  };
}
