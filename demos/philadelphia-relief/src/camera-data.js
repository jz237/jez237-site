// Published FOX 29 / WMVision image widgets, checked 2026-09-20.
// Coordinates identify the published host or viewed area, not a surveyed mount.
const fox = (id, name, lon, lat, uid, location, area = false) => ({
  id, name, lon, lat, location, area, provider: 'FOX 29 · WMVision',
  url: `https://www.fox29.com/${id}`,
  preview: `https://api.wetmet.net/widgets/image/frame.php?uid=${uid}`,
});
export const WEBCAMS = [
  fox('philadelphia-webcam', 'Benjamin Franklin Parkway', -75.168, 39.956,
    '263dd5cc083ccb2008eeb1ae16b1269f', '1709 Benjamin Franklin Parkway'),
  fox('camden-webcam', 'Camden waterfront', -75.130258, 39.943377,
    '6b8d95fb42d2f3be038f140e39251c9b', 'Adventure Aquarium · Riverside Drive'),
  fox('doylestown-webcam', 'Doylestown · Main Street', -75.130433, 40.311198,
    'f3b535ee369a95f6c6ab40cf9147a33d', 'Former Bucks County Courthouse'),
  fox('independence-mall-webcam', 'Independence Mall', -75.1491, 39.9508,
    'e3fd58dc6f8d6955e5c7e4af8ade46bb', 'Independence Mall · viewed area', true),
  fox('independence-mall-panoramic-webcam', 'Independence Mall · panorama', -75.1491, 39.9508,
    '82bc4f98ec470741682e769f715ada76', 'Independence Mall · viewed area', true),
  fox('king-of-prussia-webcam', 'King of Prussia', -75.367791, 40.09308,
    '706bf01f988fbdfde46969b9bd403829', 'The Alloy · 301 W Dekalb Pike'),
  fox('media-webcam', 'Media · State Street', -75.3893, 39.9175,
    '4b91cc441c4f08cfc20947a94ae2387d', 'State Street · viewed area', true),
  fox('philadelphia-international-airport-camera', 'Philadelphia airport', -75.22678, 39.87327,
    '6890b158439935a968125f5ab471076c', 'Philadelphia International Airport · viewed area', true),
  fox('philadelphia-stadium-complex-webcam', 'Philadelphia stadiums', -75.170979, 39.896532,
    '8c88166ce2d13d1d859ecfcc15791300', 'Courtyard Philadelphia South at the Navy Yard'),
  fox('philadelphia-stadium-complex-panoramic-webcam', 'Philadelphia stadiums · panorama',
    -75.170979, 39.896532,
    '2fceeb92ea042526f15456ae4a763007', 'Courtyard Philadelphia South at the Navy Yard'),
  fox('west-chester-webcam', 'West Chester · Courthouse', -75.605331, 39.960502,
    '79af68966dff773157d467165b5b2a6b', 'Across from the Historic Chester County Courthouse'),
  fox('wilmington-webcam', 'Wilmington riverfront', -75.563759, 39.731335,
    '9aade9d4f3ae2424a99c099d5c7a2720', 'Westin Wilmington · 818 Shipyard Drive'),
];

export function trafficCameras(doc) {
  const seen = new Set();
  return (doc?.cameras || []).filter(p => {
    if (!p || typeof p.id !== 'string' || !/^\d+$/.test(p.id) || seen.has(p.id)) return false;
    if (typeof p.name !== 'string' || !p.name.trim()) return false;
    if (!Number.isFinite(p.lon) || !Number.isFinite(p.lat)) return false;
    if (p.lon < -75.8 || p.lon > -74.7 || p.lat < 39.7 || p.lat > 40.55) return false;
    seen.add(p.id); return true;
  }).map(p => ({ ...p, provider: 'PennDOT · 511PA',
    location: 'Published 511PA location · availability varies',
    url: `https://511pa.com/map#camera-${p.id}`, traffic: true }));
}

// Screen-space groups keep every camera represented without hundreds of overlapping targets.
// Preview cameras stay separate from traffic-only groups so their images are easy to discover.
export function groupCameras(points, size = 48) {
  const groups = [];
  for (const p of points) {
    const group = groups.find(g => g.traffic === !!p.item.traffic
      && Math.hypot(g.x - p.x, g.y - p.y) < size);
    if (group) {
      group.items.push(p.item);
      group.x += (p.x - group.x) / group.items.length;
      group.y += (p.y - group.y) / group.items.length;
    } else groups.push({ x: p.x, y: p.y, traffic: !!p.item.traffic, items: [p.item] });
  }
  return groups;
}

export function popupPosition(x, y, width, height, cardWidth, cardHeight) {
  const left = Math.max(8, Math.min(width - cardWidth - 8, x - cardWidth / 2));
  const above = y - cardHeight - 26;
  return { left, top: Math.max(8, Math.min(height - cardHeight - 8, above >= 90 ? above : y + 26)) };
}
