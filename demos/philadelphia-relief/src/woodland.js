/** Spatially indexed mapped woodland, including unwooded interior rings. */
export function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > y) !== (b[1] > y)
        && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

export function woodlandIndex(doc) {
  const buckets = new Map(), size = .025;
  for (const feature of doc?.features || []) {
    const g = feature.geometry;
    const polygons = g?.type === 'Polygon' ? [g.coordinates]
      : g?.type === 'MultiPolygon' ? g.coordinates : [];
    for (const rings of polygons) {
      if (!rings[0]?.length) continue;
      const xs = rings[0].map(p => p[0]), ys = rings[0].map(p => p[1]);
      const west = Math.max(-75.8, Math.min(...xs)), east = Math.min(-74.7, Math.max(...xs));
      const south = Math.max(39.7, Math.min(...ys)), north = Math.min(40.55, Math.max(...ys));
      const polygon={rings,holes:rings.slice(1),west,east,south,north};
      for (let x = Math.floor(west / size); x <= Math.floor(east / size); x++) {
        for (let y = Math.floor(south / size); y <= Math.floor(north / size); y++) {
          const key = `${x},${y}`;
          if (!buckets.has(key)) buckets.set(key, []);
          buckets.get(key).push(polygon);
        }
      }
    }
  }
  return (lon, lat) => (buckets.get(`${Math.floor(lon / size)},${Math.floor(lat / size)}`) || [])
    .some(p => lon>=p.west && lon<=p.east && lat>=p.south && lat<=p.north
      && inRing(lon,lat,p.rings[0]) && !p.holes.some(r => inRing(lon,lat,r)));
}

/** Keep the enlarged illustrative crown inside the mapped forest's edge. */
export function woodlandCrown(lon, lat, radius, coverage, projection) {
  if (!coverage(lon, lat)) return 0;
  const dx = radius / projection.metersPerDegLon, dy = radius / projection.metersPerDegLat;
  const neighbours = [[dx,0],[-dx,0],[0,dy],[0,-dy],[dx,dy],[-dx,-dy],[dx,-dy],[-dx,dy]];
  const fraction = neighbours.filter(([x,y]) => coverage(lon+x,lat+y)).length / neighbours.length;
  return .22 + .78 * fraction;
}
