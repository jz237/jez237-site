// A visual-only relief field sampled from the shared collision/render triangles.
// Symmetric height differences cancel a plane's slope, distinguishing a hollow
// from a ridge without inventing curvature on a flat ramp.
export function reliefField(meshes) {
  let minX = Infinity,
    minZ = Infinity,
    maxX = -Infinity,
    maxZ = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const g of meshes)
    for (let i = 0; i < g.vertices.length; i += 3) {
      minX = Math.min(minX, g.vertices[i]);
      maxX = Math.max(maxX, g.vertices[i]);
      minZ = Math.min(minZ, g.vertices[i + 2]);
      maxZ = Math.max(maxZ, g.vertices[i + 2]);
      minY = Math.min(minY, g.vertices[i + 1]);
      maxY = Math.max(maxY, g.vertices[i + 1]);
    }
  if (!Number.isFinite(minX)) {
    minX = minZ = minY = 0;
    maxX = maxZ = maxY = 1;
  }
  const step = Math.max(0.15, (maxX - minX) / 1020, (maxZ - minZ) / 1020);
  minX -= step * 2;
  minZ -= step * 2;
  const width = Math.ceil((maxX - minX) / step) + 3,
    height = Math.ceil((maxZ - minZ) / step) + 3,
    heights = new Float32Array(width * height).fill(NaN);
  for (const g of meshes)
    for (let f = 0; f < g.roles.length; f++) {
      if (g.roles[f] !== "top") continue;
      const ids = [0, 1, 2].map((k) => g.indices[f * 3 + k] * 3),
        [a, b, c] = ids.map((i) => [
          g.vertices[i],
          g.vertices[i + 1],
          g.vertices[i + 2],
        ]),
        denominator =
          (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2]);
      if (Math.abs(denominator) < 1e-8) continue;
      const x0 = Math.max(
          0,
          Math.floor((Math.min(a[0], b[0], c[0]) - minX) / step),
        ),
        x1 = Math.min(
          width - 1,
          Math.ceil((Math.max(a[0], b[0], c[0]) - minX) / step),
        ),
        z0 = Math.max(
          0,
          Math.floor((Math.min(a[2], b[2], c[2]) - minZ) / step),
        ),
        z1 = Math.min(
          height - 1,
          Math.ceil((Math.max(a[2], b[2], c[2]) - minZ) / step),
        );
      for (let z = z0; z <= z1; z++)
        for (let x = x0; x <= x1; x++) {
          const px = minX + x * step,
            pz = minZ + z * step,
            u =
              ((b[2] - c[2]) * (px - c[0]) + (c[0] - b[0]) * (pz - c[2])) /
              denominator,
            v =
              ((c[2] - a[2]) * (px - c[0]) + (a[0] - c[0]) * (pz - c[2])) /
              denominator;
          if (u < -1e-5 || v < -1e-5 || u + v > 1.00001) continue;
          const y = u * a[1] + v * b[1] + (1 - u - v) * c[1],
            index = z * width + x;
          if (!Number.isFinite(heights[index]) || y > heights[index])
            heights[index] = y;
        }
    }
  const data = new Uint8Array(width * height * 4),
    radius = Math.max(2, Math.round(1.8 / step)),
    sample = (x, z) =>
      x < 0 || z < 0 || x >= width || z >= height
        ? NaN
        : heights[z * width + x],
    yRange = Math.max(1, maxY - minY),
    byte = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255);
  for (let z = 0; z < height; z++)
    for (let x = 0; x < width; x++) {
      const y = sample(x, z),
        i = (z * width + x) * 4;
      data[i] = 128;
      if (!Number.isFinite(y)) continue;
      let residual = 0,
        pairs = 0,
        edge = 0;
      for (const [dx, dz] of [
        [radius, 0],
        [0, radius],
        [radius, radius],
        [radius, -radius],
      ]) {
        const a = sample(x + dx, z + dz),
          b = sample(x - dx, z - dz);
        if (
          Number.isFinite(a) &&
          Number.isFinite(b) &&
          Math.abs(a - y) < 4 &&
          Math.abs(b - y) < 4
        ) {
          residual += y - (a + b) / 2;
          pairs++;
        }
      }
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [2, 0],
        [-2, 0],
        [0, 2],
        [0, -2],
      ]) {
        const n = sample(x + dx, z + dz);
        if (!Number.isFinite(n) || y - n > 1)
          edge = Math.max(edge, Math.abs(dx + dz) === 1 ? 1 : 0.55);
      }
      data[i] = byte(0.5 + (pairs ? residual / pairs : 0) * 0.9);
      data[i + 1] = byte(edge);
      data[i + 2] = byte((y - minY) / yRange);
      data[i + 3] = 255;
    }
  // Smooth paint only, not geometry or height. Keep separate tiers separate.
  for (const [dx, dz] of [
    [1, 0],
    [0, 1],
  ]) {
    const source = data.slice();
    for (let z = 0; z < height; z++)
      for (let x = 0; x < width; x++) {
        const index = z * width + x;
        if (!Number.isFinite(heights[index])) continue;
        let red = 0,
          green = 0,
          weight = 0;
        for (let k = -3; k <= 3; k++) {
          const xx = x + dx * k,
            zz = z + dz * k,
            y = sample(xx, zz);
          if (!Number.isFinite(y) || Math.abs(y - heights[index]) > 0.8)
            continue;
          const w = 4 - Math.abs(k),
            offset = (zz * width + xx) * 4;
          red += source[offset] * w;
          green += source[offset + 1] * w;
          weight += w;
        }
        data[index * 4] = Math.round(red / weight);
        data[index * 4 + 1] = Math.round(green / weight);
      }
  }
  return { data, width, height, minX, minZ, step, minY, yRange, heights };
}
