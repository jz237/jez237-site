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
