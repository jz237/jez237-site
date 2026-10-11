import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CACHE_MAX_AGE, advisoryRank, advisoryTime, basinFor, buildStorms, cacheIsRecent, direction, escapeHtml,
  fetchLayers, forecastTime, intensity, mapFeature, mapPosition, matchingFeatures, number, officialUrl,
  position, probability, queryUrl, validateCollection, validateForecastCollection, validateLayerCollection, wind
} from '../weather/hurricane-data.mjs';
import { satelliteTime } from '../weather/hurricane-satellite.mjs';
import { WPC_INDEX, combinedStorms, fetchWpcForecasts, parseWpcForecast, validateWpcCollection } from '../weather/hurricane-wpc.mjs';

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

test('satellite images require a recent, explicitly advertised observation time', () => {
  const time = '2026-10-11T00:00:00Z';
  assert.equal(satelliteTime(time, '2026-10-10T23:00:00.000Z,2026-10-11T00:00:00.000Z', NOW), NOW);
  for (const invalid of [null, '', 'current', '2026-10-11', '2026-10-11T01:00:00Z', '2026-10-10T17:00:00Z', '2026-02-31T00:00:00Z']) {
    assert.throws(() => satelliteTime(invalid, invalid, NOW));
  }
  assert.throws(() => satelliteTime(time, '2026-10-10T23:00:00Z', NOW));
  assert.throws(() => satelliteTime(time, '', NOW));
});

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
  assert.equal(buildStorms(collection([point({advdate:'unknown',idp_filedate:NOW})]),NOW)[0].stale, true);
  assert.equal(buildStorms(collection([point({idp_filedate:NOW-24*3600000})]),NOW)[0].stale, false);
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
  assert.equal(basinFor(null),'unknown');
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

test('optional map geometry is checked before rendering, including rings and multipart shapes', () => {
  const ring = [[-70,20],[-68,20],[-68,22],[-70,20]];
  const feature = geometry => ({type:'Feature',properties:{basin:'AL'},geometry});
  for (const name of ['cones','outlook']) {
    for (const geometry of [{type:'Polygon',coordinates:[ring]}, {type:'MultiPolygon',coordinates:[[ring]]}]) {
      assert.doesNotThrow(()=>validateLayerCollection(name,collection([feature(geometry)])));
    }
    for (const bad of [null, {}, {type:'Polygon',coordinates:[]}, {type:'Polygon',coordinates:[ring.slice(0,-1)]},
      {type:'Polygon',coordinates:[[...ring.slice(0,-1),[-70,21]]]}, {type:'MultiPolygon',coordinates:[[[]]]},
      {type:'Polygon',coordinates:[[[null,20],[-68,20],[-68,22],[null,20]]]}, {type:'toString',coordinates:ring},
      {type:'Point',coordinates:[-70,20]}]) assert.throws(()=>validateLayerCollection(name,collection([feature(bad)])));
  }
  assert.doesNotThrow(()=>validateLayerCollection('warnings',collection([feature({type:'MultiLineString',coordinates:[ring.slice(0,2)]})])));
  assert.throws(()=>validateLayerCollection('warnings',collection([feature({type:'LineString',coordinates:[[-70,91],[-69,20]]})])));
  assert.doesNotThrow(()=>validateLayerCollection('history',collection([point()])));
  assert.throws(()=>validateLayerCollection('history',collection([point({},['-70',20])])));
  for (const bad of [null, {}, {...feature({type:'Polygon',coordinates:[ring]}),properties:[]}]) assert.throws(()=>validateLayerCollection('cones',collection([bad])));
  assert.throws(()=>validateLayerCollection('outlook',collection([{...feature({type:'Polygon',coordinates:[ring]}),properties:null}])));
  assert.doesNotThrow(()=>validateLayerCollection('warnings',EMPTY));
});

test('saved data has a 24-hour limit and cannot use an invalid or future check time', () => {
  assert.equal(cacheIsRecent(NOW, NOW),true);
  assert.equal(cacheIsRecent(NOW-CACHE_MAX_AGE, NOW),true);
  for (const bad of [null, undefined, NaN, Infinity, '2026-10-11', NOW-CACHE_MAX_AGE-1, NOW+60001]) assert.equal(cacheIsRecent(bad,NOW),false);
});

test('malformed optional geometry makes only its layer unavailable', async () => {
  const malformed = collection([{type:'Feature',properties:{basin:'AL'},geometry:{type:'Polygon',coordinates:[[null]]}}]);
  const bundle = await fetchLayers(async url => ({ok:true,json:async()=>url.includes('/3/') ? malformed : url.includes('/5/') ? collection([point()]) : EMPTY}),NOW);
  assert.equal(bundle.layers.outlook,undefined);
  assert.deepEqual(bundle.errors,['outlook']);
  assert.equal(bundle.layers.points.features.length,1);
  assert.deepEqual(bundle.layers.cones,EMPTY);
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

const wpcProduct = () => ({
  id:'11111111-1111-4111-8111-111111111111',issuingOffice:'KWNH',productCode:'TCM',wmoCollectiveId:'WTNT24',issuanceTime:'2026-10-10T20:37:00Z',
  productText:`000
WTNT24 KWNH 102037
TCMAT4
POST-TROPICAL CYCLONE EXAMPLE FORECAST/ADVISORY NUMBER  17
NWS WEATHER PREDICTION CENTER COLLEGE PARK MD   AL092026
2100 UTC SAT OCT 10 2026
POST-TROPICAL CYCLONE CENTER LOCATED NEAR 33.5N  86.9W AT 10/2100Z
PRESENT MOVEMENT TOWARD THE NORTH-NORTHEAST OR  25 DEGREES AT  13 KT
ESTIMATED MINIMUM CENTRAL PRESSURE 1007 MB
MAX SUSTAINED WINDS  25 KT WITH GUSTS TO  35 KT.
FORECAST VALID 11/0600Z 35.2N  86.0W...POST-TROP/INLAND
MAX WIND  25 KT...GUSTS  35 KT.
FORECAST VALID 11/1800Z 37.9N  81.9W...POST-TROP/INLAND
MAX WIND  25 KT...GUSTS  35 KT.
FORECAST VALID 12/1800Z...DISSIPATED
NEXT ADVISORY AT 11/0300Z
$$`
});

test('WPC handoff preserves official positions, valid times, source knots and dissipation without an invented endpoint', () => {
  const data = parseWpcForecast(wpcProduct(),NOW);
  const storm = combinedStorms(EMPTY,data,NOW)[0];
  assert.equal(storm.name,'Example');
  assert.equal(storm.source,'WPC');
  assert.equal(storm.label,'Post-tropical');
  assert.equal(storm.advisory,'17');
  assert.equal(storm.issuedAt,Date.UTC(2026,9,10,21));
  assert.deepEqual(storm.current.latlng,[33.5,-86.9]);
  assert.deepEqual(storm.points.map(p=>p.hour),[0,9,21]);
  assert.deepEqual(storm.points[2].latlng,[37.9,-81.9]);
  assert.equal(storm.current.wind,25);
  assert.equal(storm.current.gust,35);
  assert.equal(storm.pressure,1007);
  assert.equal(storm.movement,13);
  assert.equal(storm.direction,'NNE');
  assert.equal(storm.dissipatedAt,Date.UTC(2026,9,12,18));
  assert.equal(officialUrl(storm),'https://www.wpc.ncep.noaa.gov/tropical/tropical_advisories.php?storm=EXAMPLE');
});

test('WPC forecasts cross year boundaries and classify future post-tropical positions independently', () => {
  const product=wpcProduct();
  product.issuanceTime='2026-12-31T20:37:00Z';
  product.productText=product.productText.replace('SAT OCT 10','THU DEC 31').replace('AT 10/2100Z','AT 31/2100Z').replaceAll('11/','01/').replaceAll('12/','02/').replace('POST-TROPICAL CYCLONE EXAMPLE','TROPICAL STORM EXAMPLE');
  const storm=combinedStorms(EMPTY,parseWpcForecast(product,Date.UTC(2027,0,1)),Date.UTC(2027,0,1))[0];
  assert.equal(storm.current.type,'TS');
  assert.equal(storm.points[1].type,'PTC');
  assert.equal(storm.points[1].time,Date.UTC(2027,0,1,6));
  assert.equal(storm.dissipatedAt,Date.UTC(2027,0,2,18));
});

test('WPC missing measurements stay unknown while a published calm wind remains zero', () => {
  const product=wpcProduct();
  product.productText=product.productText.replace(/PRESENT MOVEMENT[^\n]+\n|ESTIMATED MINIMUM CENTRAL PRESSURE[^\n]+\n|MAX SUSTAINED WINDS[^\n]+\n/g,'').replace('MAX WIND  25 KT...GUSTS  35 KT.','MAX WIND  0 KT.');
  const storm=combinedStorms(EMPTY,parseWpcForecast(product,NOW),NOW)[0];
  for (const value of [storm.pressure,storm.movement,storm.current.wind,storm.current.gust]) assert.equal(value,null);
  assert.equal(storm.points[1].wind,0);
  assert.equal(storm.points[1].gust,null);
});

test('malformed WPC identities, dates, positions and forecast ordering cannot create a map marker', () => {
  for (const transform of [
    p=>{p.issuingOffice='KNHC';}, p=>{p.id='../arbitrary-url';}, p=>{p.wmoCollectiveId='WTPZ24';},
    p=>{p.productText=p.productText.replace('OCT 10','FEB 31');},
    p=>{p.productText=p.productText.replace('33.5N','93.5N');},
    p=>{p.productText=p.productText.replace('AT 10/2100Z','AT 10/1800Z');},
    p=>{p.productText=p.productText.replace('FORECAST VALID 11/1800Z','FORECAST VALID 11/0600Z');},
    p=>{p.productText=p.productText.replace('FORECAST VALID 11/0600Z','FORECAST VALID INVALID');},
    p=>{p.productText=p.productText.replace('35.2N  86.0W','POSITION UNAVAILABLE');},
    p=>{p.productText=p.productText.replace('...DISSIPATED','...UNRECOGNIZED');},
    p=>{p.productText=p.productText.replace('POST-TROPICAL CYCLONE CENTER LOCATED NEAR','REPEAT...CENTER LOCATED NEAR');},
    p=>{p.issuanceTime='2025-10-10T20:37:00Z';}
  ]) { const product=wpcProduct();transform(product);assert.throws(()=>parseWpcForecast(product,NOW)); }
  assert.throws(()=>parseWpcForecast(wpcProduct(),Date.UTC(2026,9,10,18)));
  assert.deepEqual(parseWpcForecast(wpcProduct(),NOW+12*3600000),EMPTY,'A new feed check cannot revive an expired WPC advisory');
});

test('NHC and WPC duplicate IDs keep only the newer complete advisory', () => {
  const remnants=parseWpcForecast(wpcProduct(),NOW);
  const nhc=collection([point({idp_subset:'al092026',advdate:'400 AM CDT Sat Oct 10 2026',advisnum:'15',maxwind:30})]);
  const storms=combinedStorms(nhc,remnants,NOW);
  assert.equal(storms.length,1);
  assert.equal(storms[0].source,'WPC');
  assert.equal(storms[0].points.length,3);
  nhc.features[0].properties.advdate='800 PM EDT Sat Oct 10 2026';
  nhc.features[0].properties.advisnum='18';
  const returned=combinedStorms(nhc,remnants,NOW);
  assert.equal(returned.length,1);
  assert.equal(returned[0].source,'NHC');
  assert.equal(returned[0].points.length,1);
});

test('WPC discovery fetches only the newest product for a slot, shares a deadline and ignores arbitrary feed URLs', async () => {
  const product=wpcProduct();
  const meta={...product,'@id':'https://example.invalid/injected'};
  delete meta.productText;
  const earlier={...meta,id:'22222222-2222-4222-8222-222222222222',issuanceTime:'2026-10-10T14:37:00Z'};
  const calls=[];
  const data=await fetchWpcForecasts(async (url,options)=>{
    calls.push({url,options});
    return {ok:true,json:async()=>url===WPC_INDEX ? {'@graph':[earlier,meta]} : product};
  },NOW);
  assert.equal(data.features.length,3);
  assert.deepEqual(calls.map(c=>c.url),[WPC_INDEX,`https://api.weather.gov/products/${product.id}`]);
  assert.equal(calls[0].options.signal,calls[1].options.signal);
});

test('a WPC slot returned to NHC or an older WPC report is not resurrected', async () => {
  const product=wpcProduct();
  for (const items of [[],[{...product,issuanceTime:'2026-10-09T20:37:00Z'}],[product,{...product,issuingOffice:'KNHC',issuanceTime:'2026-10-10T23:37:00Z'}]]) {
    const calls=[];
    const data=await fetchWpcForecasts(async url=>{calls.push(url);return {ok:true,json:async()=>({'@graph':items})};},NOW);
    assert.deepEqual(data,EMPTY);
    assert.equal(calls.length,1);
  }
});

test('failed or malformed WPC feeds remain unavailable instead of reporting no inland systems', async () => {
  await assert.rejects(fetchWpcForecasts(async()=>({ok:false,status:503}),NOW));
  await assert.rejects(fetchWpcForecasts(async()=>({ok:true,json:async()=>({})}),NOW));
  await assert.rejects(fetchWpcForecasts(async url=>({ok:true,json:async()=>url===WPC_INDEX ? {'@graph':[wpcProduct()]} : {...wpcProduct(),id:'22222222-2222-4222-8222-222222222222'}}),NOW));
  const data=parseWpcForecast(wpcProduct(),NOW);
  data.features[0].properties.source_agency='NHC';
  assert.throws(()=>validateWpcCollection(data));
});
