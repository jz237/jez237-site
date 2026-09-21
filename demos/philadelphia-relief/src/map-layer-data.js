export const MAP_BOUNDS = { west: -75.8, east: -74.7, south: 39.7, north: 40.55 };
export const ARCHIVES = {
  '1996': 'CityImagery_1996_6in', '2000': 'CityImagery_2000_18in',
  '2004': 'CityImagery_2004_6in', '2008': 'CityImagery_2008_3in',
};
export const tileX = (lon, z) => (lon + 180) / 360 * 2 ** z;
export const tileY = (lat, z) => (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * 2 ** z;
export function tileBounds(z, x, y) {
  const latitude = n => Math.atan(Math.sinh(Math.PI * (1 - 2 * n / 2 ** z))) * 180 / Math.PI;
  return { west: x / 2 ** z * 360 - 180, east: (x + 1) / 2 ** z * 360 - 180,
    north: latitude(y), south: latitude(y + 1) };
}
export function regionalTile(z, x, y) {
  if (![z, x, y].every(Number.isInteger) || z < 9 || z > 19 || x < 0 || y < 0
    || x >= 2 ** z || y >= 2 ** z) return false;
  const b = tileBounds(z, x, y), r = MAP_BOUNDS;
  return b.west < r.east && b.east > r.west && b.south < r.north && b.north > r.south;
}
export function archiveTiles(pose) {
  const z = Math.max(9, Math.min(19, Math.floor(Math.log2(160000000 / Math.max(100, pose.dist)))));
  const cx = Math.floor(tileX(pose.lon, z)), cy = Math.floor(tileY(pose.lat, z)), tiles = [];
  for (let y = cy - 3; y <= cy + 3; y++) for (let x = cx - 3; x <= cx + 3; x++) {
    if (regionalTile(z, x, y)) tiles.push({ z, x, y, distance: Math.hypot(x - cx, y - cy) });
  }
  return tiles.sort((a, b) => a.distance - b.distance).slice(0, 36);
}
export function ageLabel(time) {
  const date = typeof time === 'number' ? time : Date.parse(time);
  const minutes = Math.round((Date.now() - date) / 60000);
  if (!Number.isFinite(date) || date < 946684800000) return 'Time unavailable';
  const clock = new Date(date).toLocaleString('en-US', { timeZone: 'America/New_York',
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  return `${clock} ET${minutes > 120 ? ' · delayed' : ''}`;
}
export function gaugeTrend(points) {
  if (!points || points.length < 2) return 'Trend unavailable';
  const last = points.at(-1);
  const earlier = points.find(p => Date.parse(p.time) >= Date.parse(last.time) - 10800000);
  if (!earlier || earlier === last) return 'Trend unavailable';
  const delta = last.value - earlier.value;
  const direction = Math.abs(delta) < .03 ? 'Steady' : delta > 0 ? 'Rising' : 'Falling';
  return `${direction} over recent observations`;
}
