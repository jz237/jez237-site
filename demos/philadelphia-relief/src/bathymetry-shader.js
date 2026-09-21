// Shared geographic sampling for terrain, aerial patches and the water surface.
// No texture fetches while the optional layer is disabled. Zero marks no data.
export const BATHYMETRY_GLSL = /* glsl */ `
  uniform sampler2D uBathymetry;
  uniform vec4 uBathBounds;
  uniform vec2 uBathTexel;
  uniform float uBathOn;
  uniform float uBathScale;
  vec2 bathymetryAt(vec2 regionUv) {
    if (uBathOn < .5) return vec2(0.0);
    vec2 uv = (regionUv - uBathBounds.xy) / (uBathBounds.zw - uBathBounds.xy);
    if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec2(0.0);
    vec4 sampleValue = texture2D(uBathymetry, uv);
    // The coverage channel is interpolated too: require all contributing samples.
    if (sampleValue.b < .999) return vec2(0.0);
    return vec2(-dot(sampleValue.rg, vec2(652.8, 2.55)), 1.0);
  }
`;

export function bathymetryUniforms(THREE, placeholder = null) {
  return {
    uBathymetry: { value: placeholder },
    uBathBounds: { value: new THREE.Vector4(0, 0, 1, 1) },
    uBathTexel: { value: new THREE.Vector2(1, 1) },
    uBathOn: { value: 0 },
    uBathScale: { value: 6 },
  };
}

export function sampleRiverbed(pixels, meta, lon, lat) {
  if (!pixels || !meta) return null;
  const b = meta.bounds;
  if (lon < b.west || lon >= b.east || lat <= b.south || lat > b.north) return null;
  const x = Math.floor((lon - b.west) / (b.east - b.west) * meta.width);
  const y = Math.floor((b.north - lat) / (b.north - b.south) * meta.height);
  const i = (y * meta.width + x) * 4;
  return pixels[i + 2] === 255 ? -(pixels[i] * 256 + pixels[i + 1]) / 100 : null;
}
