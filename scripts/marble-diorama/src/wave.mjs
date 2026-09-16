const TAU = 2 * Math.PI;
export const WAVE_INDICES = new Uint32Array([
  0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6,
  7, 2, 7, 3, 3, 7, 4, 3, 4, 0,
]);
export const WAVE_ROLES = ["top", "top", ...Array(10).fill("side")];
export function wavePose(p, time) {
  const m = p.motion;
  const height = (s) =>
    m.amplitude *
    Math.sin(TAU * (s / m.wavelength - time / m.period)) *
    Math.sin((Math.PI * s) / m.total);
  const a = height(m.from),
    b = height(m.to),
    dy = (m.rise ?? 0) + b - a,
    length = Math.hypot(p.d, dy),
    pitch = -Math.atan2(dy, p.d),
    sx = Math.sin(pitch / 2),
    cx = Math.cos(pitch / 2),
    sy = Math.sin(m.heading / 2),
    cy = Math.cos(m.heading / 2),
    w = p.w / 2,
    d = length / 2,
    h = p.h ?? 0.3;
  return {
    position: { x: p.x, y: p.y + (a + b) / 2, z: p.z },
    rotation: { x: cy * sx, y: sy * cx, z: -sy * sx, w: cy * cx },
    vertices: new Float32Array([
      -w,
      0,
      -d,
      -w,
      0,
      d,
      w,
      0,
      d,
      w,
      0,
      -d,
      -w,
      -h,
      -d,
      -w,
      -h,
      d,
      w,
      -h,
      d,
      w,
      -h,
      -d,
    ]),
  };
}

// Endpoint displacement is shared by adjacent panels; pitch and chord length
// make their top edges coincide exactly. Both ends of the strip are anchored.
export function waveStrip(
  id,
  start,
  end,
  width,
  {
    amplitude = 0.45,
    period = 3,
    wavelength = 6,
    segmentLength = 0.6,
    material = "green",
  } = {},
) {
  const dx = end.x - start.x,
    dz = end.z - start.z,
    total = Math.hypot(dx, dz),
    count = Math.ceil(total / segmentLength);
  return Array.from({ length: count }, (_, i) => {
    const f = (i + 0.5) / count;
    return {
      id: `${id}-${i}`,
      kind: "moving",
      x: start.x + dx * f,
      y: start.y + (end.y - start.y) * f,
      z: start.z + dz * f,
      w: width,
      d: total / count,
      h: 0.3,
      material,
      motion: {
        axis: "wave",
        heading: Math.atan2(dx, dz),
        amplitude,
        period,
        wavelength,
        total,
        from: (total * i) / count,
        to: (total * (i + 1)) / count,
        rise: (end.y - start.y) / count,
      },
    };
  });
}
