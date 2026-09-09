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

import { savedViews } from '../src/saved-views.js';
import { timelineSeek, captureName } from '../src/experience.js';

test('saved views validate storage and timeline keyboard seeking stays inside the tour', () => {
  assert.deepEqual(savedViews({}),[]);
  assert.deepEqual(savedViews([{name:'Broken',state:{camLon:'bad',camLat:40}}]),[]);
  const views=savedViews([{name:'River',state:{camLon:-75.1,camLat:40,camDist:999999,unknown:42}}]);
  assert.equal(views[0].state.camDist,190000); assert.equal(views[0].state.unknown,undefined);
  assert.equal(timelineSeek('ArrowLeft',2,100),0);
  assert.equal(timelineSeek('ArrowRight',99,100),99.99);
  assert.equal(timelineSeek('Escape',10,100),null);
  assert.equal(captureName({camLon:-75.1234,camLat:40.1234},'20260909'),
    'philadelphia-relief-40.1234N-75.1234W-20260909.png');
});

import { searchScore } from '../src/search-match.js';
import { overviewPaths } from '../src/orientation.js';

test('search handles listed addresses, abbreviations and reordered words without unrelated matches', () => {
  const entry={name:'Bauder Signs',searchText:'3613 Witte Street Philadelphia Bauder Graphics'};
  assert.ok(Number.isFinite(searchScore(entry,'3613 witte st')));
  assert.ok(Number.isFinite(searchScore(entry,'graphics bauder')));
  assert.equal(searchScore(entry,'9999 Witte Street'),Infinity);
  assert.ok(searchScore(entry,'Bauder Signs') < searchScore(entry,'3613 witte'));
  const outer=[[0,0],[1,0],[1,1],[0,0]], hole=[[.2,.2],[.3,.2],[.3,.3],[.2,.2]];
  const paths=overviewPaths({type:'Polygon',coordinates:[outer,hole]});
  assert.equal(paths.length,1); assert.equal(paths[0].rings.length,2);
});
