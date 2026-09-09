import test from 'node:test';
import assert from 'node:assert/strict';
import { labelBudget, nearbyLabel, overlapsBox } from '../src/label-policy.js';

test('label density scales to available screen area and respects spacing', () => {
  assert.ok(labelBudget(390,844,.7) < labelBudget(1920,1080,.7));
  assert.ok(labelBudget(4000,2400,1) <= 64);
  assert.equal(overlapsBox({l:0,r:50,t:0,b:20},{l:58,r:90,t:0,b:20},10),true);
  assert.equal(overlapsBox({l:0,r:50,t:0,b:20},{l:80,r:90,t:0,b:20},10),false);
});

test('close street labels cannot float over distant neighborhoods', () => {
  const pose={lon:-75.16,lat:39.95,dist:1000};
  const projection={metersPerDegLon:85000,metersPerDegLat:111000};
  assert.equal(nearbyLabel({kind:'street',lon:-75.16,lat:39.951},pose,projection),true);
  assert.equal(nearbyLabel({kind:'street',lon:-75.16,lat:40.0},pose,projection),false);
  assert.equal(nearbyLabel({kind:'landmark',lon:-75.16,lat:40.0},pose,projection),true);
});

import { LOOKS, matchingLook } from '../src/looks.js';
import { coercePatch, defaults } from '../src/schema.js';

test('lighting looks preserve geographic state and remain fully shareable', () => {
  for (const look of LOOKS) {
    assert.deepEqual(coercePatch(look.patch), look.patch);
    assert.ok(Object.keys(look.patch).every(k => !k.startsWith('cam') && k !== 'exaggeration'));
    const state={...defaults(),...look.patch};
    assert.equal(matchingLook(state),look.id);
    assert.equal(matchingLook({...state,glow:.99}),undefined);
  }
});

import { overviewLocation, cameraAction } from '../src/navigation.js';
import { overviewPoint } from '../src/orientation.js';

test('locator navigation round-trips geography and clamps clicks to map bounds', () => {
  const bounds={west:-75.8,east:-74.7,south:39.7,north:40.55};
  const point=overviewPoint(-75.16,39.95,bounds);
  assert.deepEqual(overviewLocation(...point,bounds),{lon:-75.16,lat:39.95});
  assert.deepEqual(overviewLocation(-100,999,bounds),{lon:bounds.west,lat:bounds.south});
  const pose={lon:-75.16,lat:39.95,dist:1700,pitch:50};
  assert.deepEqual(cameraAction('north',pose),{lon:pose.lon,lat:pose.lat,camDist:1700,camBearing:0});
  assert.equal(cameraAction('overhead',pose).camPitch,0);
  assert.equal(cameraAction('overhead',{...pose,pitch:0}).camPitch,50);
});

import { canopySites, canopyLevel } from '../src/canopy-layout.js';

test('woodland placement stays identical across coarse and fine tiles', () => {
  const projection={lonToX:x=>x*1000,latToZ:y=>-y*1000,xToLon:x=>x/1000,zToLat:z=>-z/1000,
    metersPerDegLon:1000,metersPerDegLat:1000};
  const big={west:0,east:1,south:0,north:1}, small={west:.2,east:.5,south:.3,north:.6};
  const a=canopySites(()=>true,projection,()=>10,big);
  const b=canopySites(()=>true,projection,()=>10,small);
  const selected=[];
  for (let i=0;i<a.positions.length;i+=3) {
    const [x,y,z]=a.positions.slice(i,i+3);
    if (x>=200 && x<500 && z>=-600 && z<-300) selected.push(x,y,z);
  }
  assert.ok(b.positions.length>0); assert.deepEqual(b.positions,selected);
  const cells=[{level:1,bounds:big},{level:0,bounds:small}];
  assert.equal(canopyLevel(cells,{lon:.9,lat:.9,dist:500}),1);
  assert.equal(canopyLevel(cells,{lon:.3,lat:.4,dist:500}),0);
  assert.equal(canopyLevel(cells,{lon:.3,lat:.4,dist:2000}),1);
});

import { awayFromPreset } from '../src/navigation.js';
test('field notes stop naming a saved scene after traveling elsewhere', () => {
  const projection={metersPerDegLon:85000,metersPerDegLat:111000};
  const preset={camera:{camLon:-75.16,camLat:39.95,camDist:1600}};
  assert.equal(awayFromPreset(preset,{camLon:-75.16,camLat:39.95,camDist:500},projection),false);
  assert.equal(awayFromPreset(preset,{camLon:-75.25,camLat:40.13,camDist:500},projection),true);
});
