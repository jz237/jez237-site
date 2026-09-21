import { cached, upstream, json, inside, clean } from './_data.js';

const BASE = 'https://api.water.noaa.gov/nwps/v1/gauges';
const LIST = `${BASE}?bbox.xmin=-75.8&bbox.ymin=39.7&bbox.xmax=-74.7&bbox.ymax=40.55&srid=EPSG_4326`;
const value = v => Number.isFinite(v) && v > -900 ? v : null;
const validTime = s => Number.isFinite(Date.parse(s)) && Date.parse(s) > 946684800000 ? s : null;
export function compactGauge(g) {
  if (!/^[A-Z0-9]{5}$/.test(g?.lid) || !inside(g.longitude, g.latitude)) return null;
  const o = g.status?.observed || {}, f = g.status?.forecast || {};
  return { id: g.lid, name: clean(g.name), lon: g.longitude, lat: g.latitude,
    observed: value(o.primary), unit: clean(o.primaryUnit, 12), time: validTime(o.validTime),
    category: clean(o.floodCategory, 30), forecast: value(f.primary),
    forecastUnit: clean(f.primaryUnit, 12), forecastTime: validTime(f.validTime) };
}
export function compactSeries(doc) {
  const series = (part, future) => (part?.data || []).filter(p => value(p.primary) !== null
    && validTime(p.validTime) && (future ? Date.parse(p.validTime) >= Date.now()
      : Date.parse(p.validTime) >= Date.now() - 86400000 && Date.parse(p.validTime) <= Date.now() + 300000))
    .sort((a, b) => Date.parse(a.validTime) - Date.parse(b.validTime))
    .slice(future ? 0 : -96, future ? 48 : undefined)
    .map(p => ({ time: p.validTime, value: p.primary }));
  return { observed: series(doc.observed, false), forecast: series(doc.forecast, true),
    unit: clean(doc.observed?.primaryUnits, 12), forecastUnit: clean(doc.forecast?.primaryUnits, 12) };
}
export async function onRequest(context) {
  const id = new URL(context.request.url).searchParams.get('id');
  if (id && !/^[A-Z0-9]{5}$/.test(id)) return json({ error: 'Invalid station' }, 0, 400);
  return cached(context, `/demos/philadelphia-relief/river-gauges?schema=1${id ? `&id=${id}` : ''}`, async () => {
    const data = await upstream(LIST);
    if (!Array.isArray(data.gauges)) throw new Error('Invalid stations');
    const gauges = data.gauges.map(compactGauge).filter(Boolean).slice(0, 100);
    if (!id) return json({ gauges, checkedAt: new Date().toISOString(), source: 'NOAA / NWS' });
    const gauge = gauges.find(g => g.id === id);
    if (!gauge) return json({ error: 'Station outside this region' }, 600, 404);
    return json({ gauge, ...compactSeries(await upstream(`${BASE}/${id}/stageflow`, 2097152)) });
  });
}
