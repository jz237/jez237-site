import test from 'node:test';
import assert from 'node:assert/strict';
import { planImageryTiles, groundPoint, createTileStream } from '../src/imagery-tiles.js';
import { detailRequest } from '../../../../functions/games/demos/philadelphia-relief/detail-imagery.js';
import { streetCell, compactStreets, streetQuery } from '../../../../functions/games/demos/philadelphia-relief/street-detail.js';
import { roofProfile, localBuildingSolids, neighborhoodLabels, metres } from '../src/neighborhood-data.js';

const region = { west:-75.8,east:-74.7,south:39.7,north:40.55 };
const projection = { metersPerDegLon:85220,metersPerDegLat:111033 };
const pose = { lon:-75.1677,lat:39.9278,dist:300,bearing:0.8,pitch:35,fov:42 };
const contains = (b,p) => p.lon >= b.west-1e-8 && p.lon <= b.east+1e-8
  && p.lat >= b.south-1e-8 && p.lat <= b.north+1e-8;

test('visible tiles cover screen corners and interiors across close zooms, rotations and aspect ratios', () => {
  for (const dist of [200,350,800,1600,4907]) for (const pitch of [0,12,35,73.7]) {
    for (const aspect of [0.5,1.7,2.5]) for (const bearing of [0,47,180,270]) {
      const view = {...pose,dist,pitch,bearing};
      const plan = planImageryTiles(view,region,projection,aspect);
      assert.ok(plan.visible.length <= 24);
      for (let y = -1; y <= 1; y += 0.2) for (let x = -1; x <= 1; x += 0.2) {
        const p = groundPoint(view,projection,aspect,x,y);
        if (!p || !contains(region,p)) continue;
        assert.ok(plan.visible.some(c => contains(c.bounds,p)),
          `gap at ${JSON.stringify({dist,pitch,aspect,bearing,x,y,count:plan.visible.length})}`);
      }
    }
  }
});

test('tile server bounds precisely match client geometry', () => {
  for (const dist of [200,1800,4907,14000]) {
    const plan = planImageryTiles({...pose,dist},region,projection,1.7);
    for (const cell of plan.visible) for (const size of [512,1024,2048]) {
      const request = detailRequest(new URLSearchParams({tier:cell.tier,
        lon:cell.lon.toFixed(4),lat:cell.lat.toFixed(4),size:String(size)}));
      assert.ok(request);
      for (const key of Object.keys(cell.bounds)) assert.ok(Math.abs(request.bounds[key]-cell.bounds[key])<1e-9);
    }
  }
});

test('look-ahead follows travel and data saver disables speculative requests', () => {
  const before = {...pose,lon:pose.lon-0.0004};
  const plan = planImageryTiles(pose,region,projection,1.7,'standard',before);
  assert.ok(plan.ahead.length > 0 && plan.ahead.length <= 2);
  assert.ok(plan.ahead.every(c => c.lon > pose.lon));
  assert.equal(planImageryTiles(pose,region,projection,1.7,'data',before).ahead.length,0);
});

test('tile scheduler bounds requests, retains useful panning downloads, and releases textures', async () => {
  const requests = [], installed = [], removed = [];
  const stream = createTileStream({region,projection,install:e=>installed.push(e),remove:k=>removed.push(k),
    load(cell,size,signal) { return new Promise(resolve=>requests.push({cell,size,signal,resolve})); }});
  stream.consider(pose,true,1700,1,'balanced','standard',1000);
  assert.ok(requests.length > 0 && requests.length <= 3);
  const first = requests[0];
  stream.consider({...pose,lon:pose.lon+0.0001},true,1700,1,'balanced','standard',1000);
  assert.equal(first.signal.aborted,false);
  first.resolve({image:{},source:'test'});
  await new Promise(r=>setImmediate(r));
  assert.equal(installed.length,1);
  assert.ok(stream.stats().pending<=3);
  stream.dispose();
  assert.equal(removed.length,1);
  assert.ok(requests.slice(1).every(r=>r.signal.aborted));
});

test('local extracts reject invalid/incomplete input and retain only mapped address data', () => {
  for (const query of ['', 'lon=foo&lat=40','lon=-90&lat=40']) assert.equal(streetCell(new URLSearchParams(query)),null);
  const cell = streetCell(new URLSearchParams('lon=-75.16&lat=39.95'));
  assert.ok(streetQuery(cell).includes('[timeout:20]'));
  assert.throws(()=>compactStreets({remark:'timeout',elements:[]},cell));
  const doc = compactStreets({elements:[{id:1,type:'node',lon:-75.16,lat:39.95,
    tags:{'addr:housenumber':'123','addr:street':'Market Street',unrelated:'discard'}}]},cell);
  assert.equal(doc.elements[0].tags.unrelated,undefined);
  assert.equal(neighborhoodLabels(doc)[0].note,'123 Market Street');
});

test('mapped roof profiles produce a raised ridge, flat unknown roofs and finite consolidated geometry', () => {
  const b = {poly:new Float32Array([0,0,20,0,20,10,0,10]),height:12,minHeight:0,
    roofHeight:3,roofShape:'gabled'};
  const roof = roofProfile(b);
  assert.equal(roof(10,5),12); assert.equal(roof(10,0),9);
  assert.equal(roofProfile({...b,roofShape:'unknown'})(10,0),12);
  assert.equal(metres('30 ft'),9.144);
  const packed = localBuildingSolids([b],()=>5);
  assert.ok(packed.position.every(Number.isFinite));
  assert.equal(packed.indexCount,packed.buildingEnd[0]);
  assert.ok(packed.index.every(i=>i<packed.vertexCount));
  assert.ok([...packed.position].some((n,i)=>i%3===1 && n===12));
});
