import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advisoryRank, advisoryTime, basinFor, buildStorms, direction, escapeHtml,
  fetchLayers, forecastTime, intensity, mapFeature, mapPosition, matchingFeatures, number, officialUrl,
  position, probability, queryUrl, validateCollection, validateForecastCollection, wind
} from '../weather/hurricane-data.mjs';

const NOW = Date.UTC(2026, 9, 11, 0);
const EMPTY = { type:'FeatureCollection', features:[] };
const point = (overrides = {}, coordinates = [-64.5, 24.2]) => ({
  type:'Feature', geometry:{type:'Point',coordinates}, properties:{
    stormname:'Hurricane Example', basin:'AL', stormtype:'HU', idp_subset:'al012026',
    advisnum:'8', tau:0, maxwind:100, gust:120, mslp:950, tcdir:315, tcspd:10,
    advdate:'800 PM EDT Sat Oct 10 2026', validtime:'10/2100',
    idp_filedate:NOW, binnumber:'AT1', ...overrides
  }
});
const collection = features => ({type:'FeatureCollection',features});

test('missing measurements never become zero wind or pressure', () => {
  for (const value of [null, undefined, '', '  ', false, 'unknown', NaN, Infinity]) {
    assert.equal(number(value), null);
    assert.equal(wind(value), '—');
  }
  const storm = buildStorms(collection([point({maxwind:null, mslp:0, tcspd:null})]), NOW)[0];
  assert.equal(storm.pressure, null);
  assert.equal(storm.movement, null);
  assert.equal(storm.label, 'Intensity unavailable');
});

test('wind conversion and categories use source knots, not rounded display speeds', () => {
  assert.equal(wind(100), '115');
  assert.equal(wind(100, 'km/h'), '185');
  assert.equal(wind(100, 'kt'), '100');
  for (const [knots, category] of [[63,0],[64,1],[82,1],[83,2],[95,2],[96,3],[112,3],[113,4],[136,4],[137,5]]) {
    assert.equal(intensity(knots, 'HU').category, category);
  }
  assert.equal(intensity(33).badge, 'D');
  assert.equal(intensity(34).badge, 'S');
  assert.equal(intensity(-1).badge, '?');
});

test('post-tropical and subtropical classifications are not turned into hurricanes', () => {
  assert.equal(intensity(70, 'PTC').label, 'Post-tropical');
  assert.equal(intensity(50, 'STS').label, 'Subtropical storm');
  assert.equal(intensity(25, 'STD').label, 'Subtropical depression');
  assert.equal(intensity(35, 'PC').badge, 'P');
});

test('advisory times handle midnight, noon, local time zones and malformed dates', () => {
  assert.equal(advisoryTime('800 PM EDT Sat Oct 10 2026'), NOW);
  assert.equal(advisoryTime('1100 AM HST Sat Oct 10 2026'), Date.UTC(2026,9,10,21));
  assert.equal(advisoryTime('1200 AM AST Sun Oct 11 2026'), Date.UTC(2026,9,11,4));
  assert.equal(advisoryTime('1200 PM CST Sat Oct 10 2026'), Date.UTC(2026,9,10,18));
  for (const invalid of ['bad','1400 PM EDT Sat Oct 10 2026','800 PM XYZ Sat Oct 10 2026','800 PM EDT Sat Feb 31 2026']) assert.equal(advisoryTime(invalid), null);
});

test('forecast timestamps cross month and year boundaries using validtime', () => {
  assert.equal(forecastTime({validtime:'01/0600',tau:12}, Date.UTC(2026,11,31,21)), Date.UTC(2027,0,1,6));
  assert.equal(forecastTime({validtime:'31/1800',tau:0}, Date.UTC(2026,10,1,0)), Date.UTC(2026,9,31,18));
  assert.equal(forecastTime({validtime:'01/0600',tau:12}, Date.UTC(2028,1,29,21)), Date.UTC(2028,2,1,6));
  assert.equal(forecastTime({validtime:'35/9900',tau:12}, NOW), null);
  assert.equal(forecastTime({validtime:'11/0600'}, null), null);
});

test('current position uses the advisory time when an intermediate file retains the old forecast cycle', () => {
  const storm = buildStorms(collection([point(),point({tau:12,validtime:'11/0600'})]), NOW)[0];
  assert.equal(storm.current.time, NOW);
  assert.equal(storm.points[1].time, Date.UTC(2026,9,11,6));
  assert.equal(storm.issuedAt, NOW);
});

test('a newer intermediate advisory replaces the previous forecast, without merging their points', () => {
  const storm = buildStorms(collection([
    point({advisnum:'8',tau:24}), point({advisnum:'8a',tau:12}),
    point({advisnum:'8'}), point({advisnum:'8a',maxwind:105})
  ]), NOW)[0];
  assert.equal(storm.advisory, '8a');
  assert.deepEqual(storm.points.map(p=>p.hour), [0,12]);
  assert.equal(storm.current.wind, 105);
  assert.ok(advisoryRank('9') > advisoryRank('8A'));
  assert.equal(advisoryRank('unknown'), -1);
});

test('a missing current point or invalid geometry never becomes a fabricated storm position', () => {
  assert.deepEqual(buildStorms(collection([point({tau:12})]),NOW), []);
  assert.deepEqual(buildStorms(collection([point({},[-75,200])]),NOW), []);
  assert.deepEqual(buildStorms(collection([point({idp_subset:'',idp_source:''})]),NOW), []);
  for (const feature of [null, {}, {geometry:{type:'Point'}}, point({},['',null])]) assert.equal(position(feature), null);
});

test('matching a storm accepts uppercase history IDs but rejects a different cone advisory', () => {
  const storm = buildStorms(collection([point()]), NOW)[0];
  const data = collection([
    point({idp_subset:undefined,idp_source:'AL012026_pts',advisnum:'8'}),
    point({advisnum:'7'}), point({idp_subset:'al022026',advisnum:'8'})
  ]);
  assert.equal(matchingFeatures(data,storm).length, 2);
  assert.equal(matchingFeatures(data,storm,true).length, 1);
});

test('old and unverified advisory times are visibly stale; fresh issuance survives older ingest time', () => {
  assert.equal(buildStorms(collection([point()]),NOW)[0].stale, false);
  assert.equal(buildStorms(collection([point()]),NOW+13*3600000)[0].stale, true);
  assert.equal(buildStorms(collection([point({advdate:'unknown',idp_filedate:null})]),NOW)[0].stale, true);
  assert.equal(buildStorms(collection([point()]),NOW-2*3600000)[0].stale, true);
});

test('probability, basin and movement normalization preserve unavailable data', () => {
  assert.equal(probability('70%'),70);
  assert.equal(probability('0%'),0);
  assert.equal(probability('unknown'),null);
  assert.equal(probability('101%'),null);
  assert.equal(probability(null),null);
  assert.equal(basinFor({basin:'Atlantic'}),'atlantic');
  assert.equal(basinFor({basin:'cp'}),'pacific');
  assert.equal(basinFor({basin:'North Pacific'}),'unknown');
  assert.equal(direction(360),'N');
  assert.equal(direction(-45),'NW');
  assert.equal(direction(null),'—');
});

test('source strings are escaped and official advisory links cannot inject arbitrary URLs', () => {
  assert.equal(escapeHtml('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
  assert.equal(officialUrl({bin:'AT1'}),'https://www.nhc.noaa.gov/graphics_at1.shtml');
  assert.equal(officialUrl({bin:'javascript:alert(1)'}),'https://www.nhc.noaa.gov/');
  assert.equal(new URL(queryUrl(5)).origin,'https://mapservices.weather.noaa.gov');
});

test('Pacific tracks and split polygons stay continuous across the date line', () => {
  assert.deepEqual(mapPosition([20,179],'pacific'),[20,-181]);
  assert.deepEqual(mapPosition([20,-179],'pacific'),[20,-179]);
  assert.deepEqual(mapPosition([20,5],'atlantic'),[20,5]);
  const polygon={type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[[[179,20],[-179,20],[-179,22],[179,20]]]}};
  const shifted=mapFeature(polygon,'pacific');
  assert.equal(shifted.geometry.coordinates[0][0][0],-181);
  assert.equal(polygon.geometry.coordinates[0][0][0],179);
  const storm=buildStorms(collection([point({basin:'CP',idp_subset:'cp012026'},[-179,20]),point({basin:'CP',idp_subset:'cp012026',tau:12},[179,21])]),NOW)[0];
  assert.equal(Math.abs(storm.points[0].latlng[1]-storm.points[1].latlng[1]),2);
});

test('a real empty FeatureCollection is valid; API errors and truncated responses are not', () => {
  assert.equal(validateCollection(EMPTY),EMPTY);
  for (const invalid of [{error:{code:500}},{features:[]},{...EMPTY,exceededTransferLimit:true},{...EMPTY,properties:{exceededTransferLimit:true}}]) assert.throws(()=>validateCollection(invalid));
});

test('a failed mandatory feed is not interpreted as no storms, while independent outlook can load', async () => {
  const bundle = await fetchLayers(async url => {
    if (url.includes('/5/')) throw new Error('offline');
    return {ok:true,json:async()=>EMPTY};
  }, NOW);
  assert.equal(bundle.layers.points,undefined);
  assert.deepEqual(bundle.layers.outlook,EMPTY);
  assert.deepEqual(bundle.errors,['points']);
});

test('populated but incomplete forecasts cannot masquerade as empty or complete storm feeds', async () => {
  assert.equal(validateForecastCollection(EMPTY), EMPTY);
  assert.doesNotThrow(() => validateForecastCollection(collection([point(), point({tau:12})])));
  for (const features of [
    [point({tau:12})], [point({idp_subset:'',idp_source:''})], [null],
    [point(), point({idp_subset:'ep012026',tau:12})],
    [point(), point({advisnum:'9',tau:12})],
    [point({tau:null})], [point({advisnum:'unknown'})], [point({},[-75,200])]
  ]) assert.throws(() => validateForecastCollection(collection(features)));
  const bundle = await fetchLayers(async url => ({ok:true, json:async()=>url.includes('/5/') ? collection([point({tau:12})]) : EMPTY}), NOW);
  assert.equal(bundle.layers.points, undefined);
  assert.deepEqual(bundle.errors, ['points']);
});

test('an optional layer failure preserves other live layers and its explicit error state', async () => {
  const bundle = await fetchLayers(async url => ({ok:!url.includes('/7/'),status:503,json:async()=>EMPTY}), NOW);
  assert.deepEqual(bundle.layers.points, EMPTY);
  assert.equal(bundle.layers.cones, undefined);
  assert.deepEqual(bundle.errors,['cones']);
  assert.equal(bundle.checkedAt,NOW);
});

test('a temporary ArcGIS error retries only its failed layer using the same deadline', async () => {
  const calls = [];
  const bundle = await fetchLayers(async (url, options) => {
    calls.push({url, options});
    const firstPointsAttempt = url.includes('/5/') && calls.filter(call => call.url === url).length === 1;
    return {ok:true,json:async()=>firstPointsAttempt ? {error:{code:400,message:'Failed to execute query.'}} : EMPTY};
  }, NOW);
  assert.deepEqual(bundle.errors, []);
  assert.equal(calls.length, 6);
  const retries = calls.filter(call => call.url.includes('/5/'));
  assert.equal(retries.length, 2);
  assert.equal(retries[0].options.signal, retries[1].options.signal);
  assert.equal(retries[0].options.cache, 'no-cache');
  assert.equal(retries[1].options.cache, 'no-store');
});

test('persistent errors stop after one retry; rate limits are not retried', async () => {
  const calls = new Map();
  const bundle = await fetchLayers(async url => {
    calls.set(url, (calls.get(url) || 0) + 1);
    if (url.includes('/7/')) return {ok:false,status:429};
    if (url.includes('/5/')) throw new TypeError('Network failure');
    return {ok:true,json:async()=>EMPTY};
  }, NOW);
  assert.deepEqual(bundle.errors, ['points','cones']);
  assert.equal(calls.get(queryUrl(5)), 2);
  assert.equal(calls.get(queryUrl(7)), 1);
  assert.equal(calls.get(queryUrl(3)), 1);
});
