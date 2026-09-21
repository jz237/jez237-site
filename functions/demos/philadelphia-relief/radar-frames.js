import { cached, upstream, json } from './_data.js';
export const RADAR = 'https://nowcoast.noaa.gov/geoserver/observations/weather_radar/ows';
export function radarTimes(xml, now = Date.now()) {
  const layer = xml.match(/<Name>conus_base_reflectivity_mosaic<\/Name>([\s\S]*?)<\/Layer>/)?.[1];
  const dimension = layer?.match(/<Dimension\b[^>]*name="time"[^>]*>([\s\S]*?)<\/Dimension>/)?.[1];
  if (!dimension) throw new Error('Radar times unavailable');
  return [...new Set(dimension.trim().split(',').filter(t => /^\d{4}-\d\d-\d\dT/.test(t)
    && Date.parse(t) <= now + 300000 && Date.parse(t) >= now - 7200000))].sort().slice(-12);
}
export async function onRequest(context) {
  return cached(context, '/demos/philadelphia-relief/radar-frames?schema=1', async () => {
    const xml = await upstream(`${RADAR}?service=WMS&version=1.3.0&request=GetCapabilities`, 1048576, 'text');
    const frames = radarTimes(xml); if (!frames.length) throw new Error('Radar outdated');
    return json({ frames, source: 'NOAA nowCOAST', checkedAt: new Date().toISOString() }, 120);
  });
}
