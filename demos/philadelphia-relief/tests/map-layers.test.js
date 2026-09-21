import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { regionalTile, tileBounds, archiveTiles, gaugeTrend } from '../src/map-layer-data.js';
import { createAircraftSession, AIRCRAFT_SESSION_MS } from '../src/aircraft-session.js';
import { compactGauge, compactSeries } from '../../../functions/demos/philadelphia-relief/river-gauges.js';
import { radarTimes } from '../../../functions/demos/philadelphia-relief/radar-frames.js';
import { imageSource } from '../../../functions/demos/philadelphia-relief/map-image.js';
import { propertyQuery, compactProperty } from '../../../functions/demos/philadelphia-relief/property-info.js';
import { compactShips } from '../../../functions/demos/philadelphia-relief/ships.js';
import { bounded, cached } from '../../../functions/demos/philadelphia-relief/_data.js';
import { vesselReport, createShipFeed } from '../../../scripts/philadelphia-aircraft/ships.mjs';

test('aircraft automatically expire after 30 minutes, including a suspended tab, and reset on re-enable', () => {
  let now = 1000, expired = 0, next, delay;
  const session = createAircraftSession({ now: () => now, expire: () => expired++,
    schedule: (fn, ms) => { next = fn; delay = ms; return 1; }, cancel: () => { next = null; } });
  session.start(); assert.equal(delay, 1800000);
  now += AIRCRAFT_SESSION_MS - 1; assert.equal(session.check(), false);
  now++; next(); assert.equal(expired, 1); assert.equal(session.check(), false);
  session.start(); now += 60 * 60 * 1000; assert.equal(session.check(), true); assert.equal(expired, 2);
  session.start(); now += 5000; session.stop(); now += AIRCRAFT_SESSION_MS;
  assert.equal(session.check(), false); assert.equal(expired, 2);
  session.start(); now += AIRCRAFT_SESSION_MS - 1; assert.equal(session.check(), false);
});

test('archive planning stays bounded and cannot request tiles outside the Philadelphia region', () => {
  const plan = archiveTiles({ lon: -75.16, lat: 39.95, dist: 4000 });
  assert.ok(plan.length > 0 && plan.length <= 36);
  for (const tile of plan) {
    assert.ok(regionalTile(tile.z, tile.x, tile.y));
    const b = tileBounds(tile.z, tile.x, tile.y); assert.ok(b.north > b.south && b.east > b.west);
  }
  assert.equal(regionalTile(15, 0, 0), false); assert.equal(regionalTile(25, 123, 123), false);
  const t = plan[0], params = new URLSearchParams({kind:'archive',year:'1996',...t});
  assert.ok(imageSource(params).url.startsWith('https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/'));
  params.set('year','../evil'); assert.equal(imageSource(params),null);
});

test('radar takes only advertised recent CONUS frames and enforces fixed dimensions and geography', () => {
  const now = Date.now(), recent = new Date(now - 600000).toISOString(), old = new Date(now - 86400000).toISOString();
  const xml = `<Layer><Name>conus_base_reflectivity_mosaic</Name><Dimension name="time">${old},${recent}</Dimension></Layer>`;
  assert.deepEqual(radarTimes(xml, now), [recent]);
  assert.throws(() => radarTimes('<xml/>'));
  const source = imageSource(new URLSearchParams({kind:'radar',time:recent,bbox:'0,0,1,1'}),now);
  const url = new URL(source.url); assert.equal(url.searchParams.get('bbox'), '-75.8,39.7,-74.7,40.55');
  assert.equal(url.searchParams.get('width'),'1024');
  assert.equal(imageSource(new URLSearchParams({kind:'radar',time:old}),now),null);
});

test('gauges preserve station units and missing sentinels, and do not invent a forecast', () => {
  const g = compactGauge({lid:'PADP1',name:'Schuylkill',longitude:-75.2,latitude:40,
    status:{observed:{primary:6.1,primaryUnit:'ft',validTime:new Date().toISOString()},
      forecast:{primary:-999,validTime:'0001-01-01T00:00:00Z'}}});
  assert.equal(g.observed,6.1); assert.equal(g.unit,'ft'); assert.equal(g.forecast,null);
  assert.equal(g.forecastTime,null); assert.equal(compactGauge({lid:'OTHER',longitude:0,latitude:0}),null);
  const doc = compactSeries({observed:{primaryUnits:'ft',data:[
    {primary:1,validTime:new Date(Date.now()-3600000).toISOString()},
    {primary:2,validTime:new Date().toISOString()}, {primary:-999,validTime:new Date().toISOString()}]}});
  assert.equal(doc.observed.length,2); assert.match(gaugeTrend(doc.observed),/^Rising/);
  assert.deepEqual(doc.forecast,[]);
});

test('city property cards exclude ownership and financial fields and use a limited nearest-record query', () => {
  const row=compactProperty({parcel_number:'451452200',location:'3619 WITTE ST',lon:-75.0983,lat:39.9958,
    owner_1:'Excluded',market_value:100000,year_built:'1920',distance:12.4});
  assert.equal(row.year,'1920');assert.equal(row.distance,12); assert.equal(row.owner_1,undefined);
  assert.equal(row.market_value,undefined);assert.equal(compactProperty({}),null);
  const sql=propertyQuery(-75.0983,39.9958); assert.match(sql,/LIMIT 5$/);assert.match(sql,/,60\)/);
  assert.ok(!sql.includes('owner_1'));assert.ok(!sql.includes('SELECT *'));
});

const position = (patch = {}) => ({MessageType:'PositionReport',MetaData:{MMSI:368123456,ShipName:'TEST VESSEL'},
  Message:{PositionReport:{Valid:true,Longitude:-75.15,Latitude:39.93,Sog:5,Cog:90,TrueHeading:511,...patch}}});
test('AIS validates positions, sentinels, stale data and crew-reported voyage updates separately', () => {
  const now=Date.now(), first=vesselReport(position(),null,now);
  assert.equal(first.heading,null);assert.equal(first.speed,5);assert.equal(first.destination,'');
  const voyage=vesselReport({MessageType:'ShipStaticData',MetaData:{MMSI:368123456},
    Message:{ShipStaticData:{Valid:true,Name:'TEST VESSEL@@',Destination:'PHILADELPHIA@@',Type:70}}},first,now+100);
  assert.equal(voyage.destination,'PHILADELPHIA');assert.equal(voyage.observedAt,now);
  assert.equal(vesselReport(position({Valid:false}),null,now),null);
  assert.equal(vesselReport(position({Longitude:0}),first,now).outside,true);
  const stale=position();stale.MetaData.time_utc=new Date(now-700000).toISOString();
  assert.equal(vesselReport(stale,null,now),null);
  const compact=compactShips({configured:true,state:'connected',vessels:[voyage,{...first,id:'bad'}]},now+200);
  assert.equal(compact.vessels.length,1);assert.equal(compact.vessels[0].destination,'PHILADELPHIA');
});

test('ship feed is idle until requested, shares one connection and sends only a fixed regional subscription', () => {
  const sockets=[];
  class Socket extends EventEmitter {
    constructor(url,options) {super();this.url=url;this.options=options;sockets.push(this);}
    send(s) {this.subscription=JSON.parse(s);}
    terminate() {this.emit('close');}
  }
  const feed=createShipFeed({key:'test-only',Socket});
  assert.equal(sockets.length,0);feed.snapshot();feed.snapshot();assert.equal(sockets.length,1);
  sockets[0].emit('open');assert.deepEqual(sockets[0].subscription.BoundingBoxes,[[[39.7,-75.8],[40.55,-74.7]]]);
  assert.equal(sockets[0].options.perMessageDeflate,true);
  sockets[0].emit('message',Buffer.from(JSON.stringify(position())));
  assert.equal(feed.snapshot().vessels.length,1);feed.dispose();
});

test('bounded source reader and server cache prevent unbounded payloads and repeated fetches', async () => {
  await assert.rejects(()=>bounded(new Response('123456'),3));
  const old=globalThis.caches,pending=[],entries=new Map();let calls=0;
  globalThis.caches={default:{match:async k=>entries.get(k.url)?.clone(),put:async(k,r)=>entries.set(k.url,r)}};
  const ctx={request:new Request('https://example.com/anything?url=bad'),waitUntil:p=>pending.push(p)};
  try {
    const load=async()=>{calls++;return Response.json({ok:true});};
    await cached(ctx,'/fixed',load);await Promise.all(pending);await cached(ctx,'/fixed',load);
    assert.equal(calls,1);
    const failure=await cached(ctx,'/bad',async()=>{throw new Error('private upstream data');});
    assert.equal(failure.status,503);assert.ok(!(await failure.text()).includes('private upstream data'));
  } finally {await Promise.all(pending);globalThis.caches=old;}
});
