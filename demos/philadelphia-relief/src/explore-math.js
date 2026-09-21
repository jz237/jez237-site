// All heights are metres above the existing terrain/imagery, never a survey.
const RAD = Math.PI / 180;
export const SPOTTERS = [
  { name: 'PHL · river side', lon: -75.224, lat: 39.861 },
  { name: 'PHL · eastern approach', lon: -75.196, lat: 39.884 },
];

export function observerView(observer, target, ground = 0) {
  if (!target || ![target.lon, target.lat, target.height].every(Number.isFinite)) return null;
  const east = (target.lon - observer.lon) * 111320 * Math.cos(observer.lat * RAD);
  const north = (target.lat - observer.lat) * 111320;
  const height = ground + 8;
  return { ...observer, height, heading: (Math.atan2(east, north) / RAD + 360) % 360,
    pitch: Math.atan2(target.height - height, Math.max(1, Math.hypot(east, north))) / RAD,
    clearance: 2, mode: 'spotter' };
}

export function exhibitBounds(lon, lat, size, projection) {
  const half = Math.max(150, Math.min(2500, size / 2));
  const { bounds: b } = projection;
  return { west: Math.max(b.west, lon - half / projection.metersPerDegLon),
    east: Math.min(b.east, lon + half / projection.metersPerDegLon),
    south: Math.max(b.south, lat - half / projection.metersPerDegLat),
    north: Math.min(b.north, lat + half / projection.metersPerDegLat) };
}

export function insideExhibit(point, bounds) {
  return !bounds || point.lon >= bounds.west && point.lon <= bounds.east
    && point.lat >= bounds.south && point.lat <= bounds.north;
}

// Extend a compiled shader only while the exhibit is open. This also supports
// the relief shaders, whose terrain deformation happens after modelMatrix.
export function clippedShader(source, vertex) {
  const body = source.replace(/void\s+main\s*\(\s*(?:void)?\s*\)/, 'void exhibitMain()');
  return (vertex ? 'uniform mat4 exhibitInverseVP;\nvarying vec3 exhibitWorld;\n'
    : 'uniform vec4 exhibitBounds;\nvarying vec3 exhibitWorld;\n') + body + (vertex ? `
void main() {
  exhibitMain();
  vec4 world = exhibitInverseVP * gl_Position;
  exhibitWorld = world.xyz / world.w;
}` : `
void main() {
  if (exhibitWorld.x < exhibitBounds.x || exhibitWorld.x > exhibitBounds.y
    || exhibitWorld.z < exhibitBounds.z || exhibitWorld.z > exhibitBounds.w) discard;
  exhibitMain();
}`);
}
