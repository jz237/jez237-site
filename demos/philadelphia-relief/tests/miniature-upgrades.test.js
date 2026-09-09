import test from 'node:test';
import assert from 'node:assert/strict';
import { woodlandIndex, woodlandCrown } from '../src/woodland.js';
import { overviewPoint } from '../src/orientation.js';
import { buildingFinish, streetWidth } from '../src/neighborhood-data.js';
import { buildBridge } from '../src/structures-data.js';
import { createTileStream, planImageryTiles } from '../src/imagery-tiles.js';
import { compactStreets, streetCell, streetQuery } from '../../../functions/demos/philadelphia-relief/street-detail.js';

const bounds = { west:-75.8,east:-74.7,south:39.7,north:40.55 };
const projection = { metersPerDegLon:85238,metersPerDegLat:111037 };
const settle = () => new Promise(r => setImmediate(r));

test('woodland crowns respect mapped edges and clearings, including separate multipolygons', () => {
  const ring = [[-75.3,40],[-75.2,40],[-75.2,40.1],[-75.3,40.1],[-75.3,40]];
  const hole = [[-75.26,40.04],[-75.24,40.04],[-75.24,40.06],[-75.26,40.06],[-75.26,40.04]];
  const covers = woodlandIndex({features:[{geometry:{type:'MultiPolygon',coordinates:[[ring,hole]]}}]});
  assert.equal(covers(-75.28,40.05),true);
  assert.equal(covers(-75.25,40.05),false);
  assert.equal(covers(-75.4,40.05),false);
  assert.equal(woodlandCrown(-75.25,40.05,80,covers,projection),0);
  assert.ok(woodlandCrown(-75.2999,40.05,80,covers,projection) < 1);
  assert.equal(woodlandCrown(-75.28,40.05,80,covers,projection),1);
});

test('orientation map is north-up and preserves the current geographic location', () => {
  assert.deepEqual(overviewPoint(bounds.west,bounds.north,bounds),[12,8]);
  assert.deepEqual(overviewPoint(bounds.east,bounds.south,bounds),[208,142]);
  const [x,y] = overviewPoint((bounds.east+bounds.west)/2,(bounds.north+bounds.south)/2,bounds);
  assert.ok(Math.abs(x-110)<1e-9 && Math.abs(y-75)<1e-9);
});

test('mapped neighbourhood finishes and street widths remain bounded', () => {
  assert.deepEqual(buildingFinish({}),[0,0,0,0]);
  assert.deepEqual(buildingFinish({color:'url(invalid)'}),[0,0,0,0]);
  assert.equal(buildingFinish({material:'brick'})[3],1);
  assert.deepEqual(buildingFinish({color:'#ffffff'}),[1,1,1,1]);
  assert.equal(streetWidth({width:'20 ft'}),6.096);
  assert.equal(streetWidth({width:'2000'}),35);
  assert.ok(streetWidth({highway:'footway'}) < streetWidth({highway:'residential'}));
});

test('individual trees preserve source coordinates and supported tags', () => {
  const cell = streetCell(new URLSearchParams('lon=-75.16&lat=39.95'));
  assert.match(streetQuery(cell),/node\["natural"="tree"\]/);
  const doc = compactStreets({elements:[{type:'node',id:42,lon:-75.16,lat:39.95,
    tags:{natural:'tree',height:'12',leaf_type:'broadleaved'}}]},cell);
  assert.equal(doc.elements[0].lon,-75.16); assert.equal(doc.elements[0].tags.natural,'tree');
});

test('bridge deck vertices do not double their base offsets and the suspended span is clear', () => {
  const bridge = buildBridge({type:'suspension',main_span_m:500,tower_height_m:116,
    deck_width_m:25,clearance_m:40},[[0,0],[1000,0]],()=>0);
  assert.ok(bridge.solids.info.every((v,i) => i%2===0 || v===0));
  const p = bridge.solids.position;
  for (let i=0; i<p.length; i+=3) {
    if (p[i]>280 && p[i]<720) assert.ok(p[i+1]>1,'No piers in the clear main span');
  }
  assert.ok(bridge.lines.length>100,'Parapets, bracing and hangers built');
});

test('prefetch waits for visible refinement and stops consuming a slot when new visible work arrives', async () => {
  const pose = {lon:-75.167,lat:39.95,dist:300,pitch:25,bearing:0,fov:42};
  const requests=[];
  const stream=createTileStream({region:bounds,projection,install(){},remove(){},
    load(cell,size,signal){return new Promise(resolve=>requests.push({cell,size,signal,resolve,done:false}));}});
  stream.consider({...pose,lon:pose.lon-.0005},true,1200,1,'balanced','standard',900);
  stream.consider(pose,true,1200,1,'balanced','standard',900);
  const visible = new Set(planImageryTiles(pose,bounds,projection,1200/900).visible.map(c=>c.key));
  let speculative;
  for(let round=0;round<60;round++) {
    const next=requests.find(r=>!r.done && !r.signal.aborted);
    assert.ok(next);
    if (!visible.has(next.cell.key)) { speculative=next; break; }
    next.done=true; next.resolve({image:{},source:'test'}); await settle();
  }
  assert.ok(speculative,'Nearby preview starts after visible work');
  for (const key of visible) assert.ok(requests.some(r=>r.cell.key===key && r.size===2048 && r.done));
  assert.equal(stream.stats().state,'active','Background work does not mark the visible scene as loading');
  stream.consider({...pose,lon:-75.1},true,1200,1,'balanced','standard',900);
  assert.equal(speculative.signal.aborted,true);
  stream.dispose();
});
