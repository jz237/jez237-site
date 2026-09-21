import { cached, upstream, json, inside, clean } from './_data.js';
export function propertyQuery(lon, lat) {
  // Only numeric, rounded coordinates are interpolated. No client-provided SQL or field names.
  const point = `ST_SetSRID(ST_Point(${lon.toFixed(5)},${lat.toFixed(5)}),4326)::geography`;
  return 'SELECT parcel_number,location,building_code_description,category_code_description,year_built,'
    + 'number_stories,total_livable_area,zoning,assessment_date,ST_X(the_geom) AS lon,ST_Y(the_geom) AS lat,'
    + `ST_Distance(the_geom::geography,${point}) AS distance FROM opa_properties_public `
    + `WHERE ST_DWithin(the_geom::geography,${point},60) ORDER BY distance LIMIT 5`;
}
export function compactProperty(p) {
  if (!inside(p?.lon, p?.lat) || !/^\d{9}$/.test(p.parcel_number) || !clean(p.location)) return null;
  return { id: p.parcel_number, address: clean(p.location), type: clean(p.building_code_description),
    use: clean(p.category_code_description), year: clean(p.year_built, 16), zoning: clean(p.zoning, 30),
    stories: Number.isFinite(p.number_stories) ? p.number_stories : null,
    area: Number.isFinite(p.total_livable_area) ? p.total_livable_area : null,
    lon: p.lon, lat: p.lat, distance: Number.isFinite(p.distance) ? Math.round(p.distance) : null,
    updated: clean(p.assessment_date, 32) };
}
export async function onRequest(context) {
  const query = new URL(context.request.url).searchParams;
  const lon = query.has('lon') ? Number(query.get('lon')) : NaN;
  const lat = query.has('lat') ? Number(query.get('lat')) : NaN;
  if (!inside(lon, lat)) return json({ error: 'Choose a location inside the map' }, 0, 400);
  return cached(context, `/demos/philadelphia-relief/property-info?lon=${lon.toFixed(5)}&lat=${lat.toFixed(5)}`,
    async () => {
      const url = new URL('https://phl.carto.com/api/v2/sql'); url.searchParams.set('q', propertyQuery(lon, lat));
      const data = await upstream(url.toString(), 65536);
      if (!Array.isArray(data.rows)) throw new Error('Property lookup unavailable');
      return json({ properties: data.rows.map(compactProperty).filter(Boolean),
        source: 'Philadelphia Office of Property Assessment', checkedAt: new Date().toISOString() }, 86400);
    });
}
