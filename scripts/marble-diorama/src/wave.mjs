const TAU = 2 * Math.PI;
export const WAVE_INDICES = new Uint32Array([
  0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6,
  7, 2, 7, 3, 3, 7, 4, 3, 4, 0,
]);
export const WAVE_ROLES = ["top", "top", ...Array(10).fill("side")];
// Localized positive crests reproduce a wave traveling down an otherwise flat
// lane. The legacy sinusoid remains available to imported/custom courses.
export function waveHeight(m, s, time) {
  if (m.profile === "crest") {
    const phase =
      (((s / m.wavelength - time / m.period + (m.phase ?? 0)) % 1) + 1) % 1;
    const distance = phase * m.wavelength;
    if (distance >= m.crestWidth) return 0;
    const peak = m.crestWidth * m.crestPeak;
    const u =
      distance < peak
        ? distance / peak
        : (m.crestWidth - distance) / (m.crestWidth - peak);
    const smooth = u * u * (3 - 2 * u);
    const end = Math.min(1, s / m.anchorLength, (m.total - s) / m.anchorLength);
    const anchor = Math.max(0, end);
    return m.amplitude * smooth * anchor * anchor * (3 - 2 * anchor);
  }
  return (
    m.amplitude *
    Math.sin(TAU * (s / m.wavelength - time / m.period)) *
    Math.sin((Math.PI * s) / m.total)
  );
}
export function wavePose(p, time) {
  const m = p.motion;
  const height = (s) => waveHeight(m, s, time);
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
  const vertices = new Float32Array([
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
  ]);
  if (m.profile === "crest") {
    // Keep the underside on the undeformed footprint. Adjacent panels share
    // their bottom edges too, so a raised crest is solid instead of fanning
    // open into separate tilted slabs. Rendering and the convex hull use this.
    for (let i = 4; i < 8; i++) {
      const sign = i === 4 || i === 7 ? -1 : 1;
      const y = -h - (a + b) / 2 + (sign * (m.rise ?? 0)) / 2;
      const z = (sign * p.d) / 2;
      vertices[i * 3 + 1] = Math.cos(pitch) * y + Math.sin(pitch) * z;
      vertices[i * 3 + 2] = -Math.sin(pitch) * y + Math.cos(pitch) * z;
    }
  }
  return {
    position: { x: p.x, y: p.y + (a + b) / 2, z: p.z },
    rotation: { x: cy * sx, y: sy * cx, z: -sy * sx, w: cy * cx },
    vertices,
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
    profile,
    crestWidth = 3.6,
    crestPeak = 0.2,
    anchorLength = 0.8,
    phase = 0,
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
        ...(profile
          ? { profile, crestWidth, crestPeak, anchorLength, phase }
          : {}),
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
