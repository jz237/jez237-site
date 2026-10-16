import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {photoBudget,photoFailure} from '../src/photo-policy.js';
import {streetMotionEnabled,streetStatus} from '../src/street-policy.js';
import {defaults} from '../src/schema.js';
import {encodeState,decodeState} from '../src/urlstate.js';

test('photo framebuffer is bounded on high-DPI and 4K displays; retry lowers cache and tile detail',()=>{
  const normal=photoBudget(3840,2160,2),retry=photoBudget(3840,2160,2,'auto',true);
  assert.ok(3840*2160*normal.scale**2<=2500001);
  assert.ok(3840*2160*retry.scale**2<=1500001);
  assert.ok(retry.cacheBytes<normal.cacheBytes);assert.ok(retry.detail>normal.detail);
  assert.equal(photoBudget(1000,700,1,'cinematic').detail,2);
});

test('photo errors distinguish access denial and rate limits without echoing credentials',()=>{
  assert.match(photoFailure({statusCode:403,message:'secret'},'tiles'),/denied access/);
  assert.match(photoFailure({status:429},'tiles'),/rate limited/);
  assert.doesNotMatch(photoFailure(new Error('secret'),'tiles'),/secret/);
});

test('traffic follows reduced motion by default but explicit play survives a shared URL',()=>{
  const state=defaults();assert.equal(streetMotionEnabled(state,true),false);
  state.streetMotion='on';assert.equal(streetMotionEnabled(state,true),true);
  assert.equal(decodeState(encodeState(state)).streetMotion,'on');
  state.streetMotion='off';assert.equal(streetMotionEnabled(state,false),false);
  state.streetMotion='on';state.animationSpeed=0;assert.equal(streetMotionEnabled(state,false),false);
});

test('traffic status explains simulated photo cars, paused animation and unavailable street coverage',()=>{
  const state=defaults(),pose={dist:350},stats={cars:12,moving:3};
  assert.match(streetStatus(state,pose,stats,{photo:true}),/Moving cars are simulated/);
  assert.match(streetStatus(state,pose,stats,{photo:true,reducedMotion:true}),/paused by reduced motion/);
  assert.match(streetStatus(state,pose,stats,{reducedMotion:true}),/paused by reduced motion/);
  assert.match(streetStatus(state,pose,{...stats,radius:650}),/3 moving \/ 9 waiting within 650 m/);
  assert.match(streetStatus(state,pose,stats),/Includes off-screen streets/);
  assert.match(streetStatus(state,pose,{cars:0}),/No simulated cars/);
  assert.match(streetStatus(state,pose,{failed:true}),/could not load/);
});

test('the pinned same-origin Cesium package contains its engine, workers, widget CSS and license',async()=>{
  const root=new URL('../vendor/cesium-1.145.0/',import.meta.url);
  for(const file of ['Cesium.js','Widgets/widgets.css','Workers/createGeometry.js','LICENSE.md'])
    await access(new URL(file,root));
  const source=await readFile(new URL('../src/photographic.js',import.meta.url),'utf8');
  assert.match(source,/window.CESIUM_BASE_URL=ENGINE/);
  assert.doesNotMatch(source,/cdn.jsdelivr.net/);
});
