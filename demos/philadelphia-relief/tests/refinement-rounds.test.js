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
