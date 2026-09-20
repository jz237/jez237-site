// Public viewing destinations and observation stations for this diorama only.
export const REGION = { west: -75.8, east: -74.7, south: 39.7, north: 40.55 };
export const STATIONS = [
  { id: 'KPHL', name: 'Philadelphia International Airport', lon: -75.22678, lat: 39.87327 },
  { id: 'KPNE', name: 'Northeast Philadelphia Airport', lon: -75.01361, lat: 40.07889 },
  { id: 'KTTN', name: 'Trenton–Mercer Airport', lon: -74.81639, lat: 40.27639 },
  { id: 'KDYL', name: 'Doylestown Airport', lon: -75.12286, lat: 40.33016 },
  // Just south of the model; the nearest observing station for Wilmington.
  { id: 'KILG', name: 'Wilmington Airport', lon: -75.60567, lat: 39.67442 },
];
export const PARKWAY = { name: 'The Franklin Institute', lon: -75.1731, lat: 39.9582 };
export const GAUGE = { name: 'Philadelphia river gauge', lon: -75.142, lat: 39.9331 };
export const STREET_PLACES = [
  { name: 'City Hall', lat: 39.9526, lon: -75.1636 },
  { name: 'Bauder Signs', lat: 39.99592532, lon: -75.09834015 },
  { name: 'The Hidden Reef', lat: 40.1368222, lon: -74.8827262 },
];
export const CAMERA_SOURCES = [
  { name: 'Benjamin Franklin Parkway', kind: 'Public webcam', provider: 'EarthCam · The Franklin Institute',
    text: 'Views toward Logan Square, the Parkway and the Philadelphia Museum of Art.',
    url: 'https://www.earthcam.com/usa/pennsylvania/philadelphia/', place: PARKWAY },
  { name: 'Philadelphia traffic cameras', kind: 'Traffic network', provider: 'PennDOT · 511PA',
    text: 'Greater Philadelphia highways, incidents and road conditions. Enable Cameras in the viewer.',
    url: 'https://511pa.com/region/Greater%20Philadelphia' },
  { name: 'Camden & New Jersey approaches', kind: 'Traffic network', provider: 'NJDOT · 511NJ',
    text: 'Choose the Camden–Trenton area and the camera layer in the official statewide viewer.',
    url: 'https://511nj.org/' },
  { name: 'Wilmington & northern Delaware', kind: 'Traffic network', provider: 'DelDOT',
    text: 'Northern Delaware roads and approaches. Choose Traffic Cameras in Map Layers.',
    url: 'https://deldot.gov/map/' },
  { name: 'Philadelphia skyline views', kind: 'Public webcam collection', provider: 'FOX 29',
    text: 'The broadcaster’s Philadelphia-area camera selection and current availability.',
    url: 'https://www.fox29.com/live-cameras' },
];

export function inRegion(pose) {
  return Number.isFinite(pose?.lon) && Number.isFinite(pose?.lat)
    && pose.lon >= REGION.west && pose.lon <= REGION.east
    && pose.lat >= REGION.south && pose.lat <= REGION.north;
}
export function nearestStation(pose) {
  if (!inRegion(pose)) return null;
  const distance = s => ((s.lon - pose.lon) * Math.cos(pose.lat * Math.PI / 180)) ** 2
    + (s.lat - pose.lat) ** 2;
  return STATIONS.reduce((best, s) => distance(s) < distance(best) ? s : best);
}
export function streetViewUrl(pose) {
  if (!inRegion(pose)) return null;
  const query = new URLSearchParams({ api: '1', map_action: 'pano',
    viewpoint: `${pose.lat.toFixed(6)},${pose.lon.toFixed(6)}` });
  return `https://www.google.com/maps/@?${query}`;
}
export function observationTime(timestamp, now = Date.now()) {
  const time = Date.parse(timestamp);
  if (!Number.isFinite(time) || time > now + 300000) return 'Observation time unavailable';
  const minutes = Math.max(0, Math.round((now - time) / 60000));
  const age = minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} h ago`;
  const clock = new Date(time).toLocaleString('en-US', {
    timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
  return `${clock} ET · ${age}${minutes > 120 ? ' · delayed observation' : ''}`;
}
