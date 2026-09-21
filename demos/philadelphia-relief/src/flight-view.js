// Geographic camera poses only: tracking supplies no video or aircraft attitude.
const RAD = Math.PI / 180;
export const FLIGHT_VIEWS = {
  forward: 'Forward', left: 'Left window', right: 'Right window', chase: 'Chase',
};

export function flightView(position, mode, ground = 0) {
  if (!position || !Object.hasOwn(FLIGHT_VIEWS, mode)
    || ![position.lon, position.lat, position.height, position.track].every(Number.isFinite)) return null;
  const heading = ((position.track % 360) + 360) % 360;
  const height = Math.max(ground + 35, position.height);
  const chase = mode === 'chase', distance = chase ? -300 : 0;
  const lon = position.lon + Math.sin(heading * RAD) * distance / (111320 * Math.cos(position.lat * RAD));
  const lat = position.lat + Math.cos(heading * RAD) * distance / 111320;
  return { lon, lat, height: height + (chase ? 100 : 0),
    heading: (heading + (mode === 'left' ? 270 : mode === 'right' ? 90 : 0)) % 360,
    pitch: chase ? -Math.atan2(100, 300) / RAD : mode === 'forward' ? -4 : -12, mode };
}

export function viewDelay(position, now = Date.now()) {
  return Math.max(0, Math.round((now - position.observedAt) / 1000));
}
