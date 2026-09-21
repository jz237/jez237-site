import { ARCHIVES, regionalTile } from '../../../demos/philadelphia-relief/src/map-layer-data.js';
import { cached, upstream, json } from './_data.js';
import { RADAR } from './radar-frames.js';
export function imageSource(params, now = Date.now()) {
  if (params.get('kind') === 'radar') {
    const time = params.get('time'), stamp = Date.parse(time);
    if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(time || '')
      || !Number.isFinite(stamp) || stamp > now + 300000 || stamp < now - 10800000) return null;
    const url = new URL(RADAR);
    url.search = new URLSearchParams({ service: 'WMS', version: '1.1.1', request: 'GetMap',
      layers: 'conus_base_reflectivity_mosaic', styles: '', srs: 'EPSG:4326',
      bbox: '-75.8,39.7,-74.7,40.55', width: '1024', height: '1024',
      format: 'image/png', transparent: 'true', time }).toString();
    return { url: url.toString(), key: `radar/${time}`, ttl: 300 };
  }
  const year = params.get('year'), z = Number(params.get('z'));
  const x = Number(params.get('x')), y = Number(params.get('y'));
  if (params.get('kind') !== 'archive' || !Object.hasOwn(ARCHIVES, year)
    || !['z', 'x', 'y'].every(k => /^\d+$/.test(params.get(k) || '')) || !regionalTile(z, x, y)) return null;
  return { url: `https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/`
    + `${ARCHIVES[year]}/MapServer/tile/${z}/${y}/${x}`, key: `archive/${year}/${z}/${x}/${y}`, ttl: 86400 };
}
export async function onRequest(context) {
  const source = imageSource(new URL(context.request.url).searchParams);
  if (!source) return json({ error: 'Unsupported regional image' }, 0, 400);
  return cached(context, `/demos/philadelphia-relief/map-image?image=${encodeURIComponent(source.key)}`,
    async () => {
      const data = await upstream(source.url, 2097152, 'bytes');
      if (!/^image\/(png|jpeg)/.test(data.type)) throw new Error('Invalid imagery');
      return new Response(data.bytes, { headers: { 'Content-Type': data.type,
        'Cache-Control': `public, max-age=${source.ttl}`, 'X-Content-Type-Options': 'nosniff' } });
    });
}
