import test from 'node:test';
import assert from 'node:assert/strict';
import { detailMessage } from '../src/experience.js';
import { cameraCaption } from '../src/navigation.js';
import { labelPriority } from '../src/label-policy.js';

test('landmark labels win over local addresses and image status distinguishes preview refinement', () => {
  assert.ok(labelPriority({kind:'landmark',rank:3}) < labelPriority({kind:'address',rank:1}));
  assert.equal(detailMessage({state:'loading',loaded:2,visible:5}),'Loading view · 2/5 areas');
  assert.equal(detailMessage({state:'loading',refining:true}),'Sharpening rooftops…');
  assert.equal(detailMessage({state:'active',resolutionM:.172}),'0.17 m sampling');
  assert.match(cameraCaption({dist:200,pitch:0,bearing:0}),/Overhead/);
  assert.match(cameraCaption({dist:80000,pitch:50,bearing:90}),/Region/);
});
