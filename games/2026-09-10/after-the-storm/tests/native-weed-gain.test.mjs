import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,stepNativeHull,nativeHullIntegrationGain} from '../native-hull.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('source weed word selects drag for every axis on each hull pass',()=>{
 for(const word of [0,1,2,-1,2147483647,-2147483648]){
  const gain=nativeHullIntegrationGain(word),velocity={x:3,y:4,z:5},h=createNativeHull({velocity});
  assert.equal(Math.fround(gain),word===0?0.9919999837875366:0.9729999899864197);
  h.integrationGain=gain;stepNativeHull(h,.05);
  for(const axis of ['x','y','z']){
   close(h.velocity[axis],velocity[axis]*gain**5);
   close(h.center[axis],velocity[axis]*.01*gain*(1-gain**5)/(1-gain));
  }
 }
 for(const value of [NaN,.5,2147483648,-2147483649])assert.throws(()=>nativeHullIntegrationGain(value),/signed source word/);
});

test('weed is sampled once per physical frame and leaving it restores ordinary drag',()=>{
 let word=0,calls=0;
 const a=createNativeRaceAdapter({sourceState:()=>{calls++;return {weed2c50:word};}});
 stepNativeRaceAdapter(a,.01,{});assert.equal(a.hull.integrationGain,.992);assert.equal(calls,1);
 word=1;stepNativeRaceAdapter(a,.04,{});assert.equal(a.hull.integrationGain,.992);assert.equal(calls,1);
 stepNativeRaceAdapter(a,.01,{});assert.equal(a.hull.integrationGain,.973);assert.equal(calls,2);
 word=0;stepNativeRaceAdapter(a,.04,{});assert.equal(a.hull.integrationGain,.973);
 stepNativeRaceAdapter(a,.01,{});assert.equal(a.hull.integrationGain,.992);assert.equal(calls,3);
 assert.throws(()=>createNativeRaceAdapter({sourceState:{weed2c50:.5}}),/weed2c50/);
});

test('a driven Drake Stunt run consumes the preceding canonical weed flag',()=>{
 const s=createRace({mode:'stunt',physics:'native',course:getCourse('reed'),waveSeed:17});
 const pilot=createNativeRacePilot({course:s.course}),r=s.racers[0],a=s.nativeHost.world.adapters[0];
 const onFrame=s.nativeHost.onFrame;let prior=0,wetFrames=0,exits=0,frames=0;
 s.nativeHost.onFrame=(...args)=>{
  assert.equal(a.frame.weed2c50,prior);
  assert.equal(a.hull.integrationGain,nativeHullIntegrationGain(prior));
  const next=s.nativeLaunch.riderForceContext(0).weed2c50;
  if(prior!==0)wetFrames++;if(prior!==0&&next===0)exits++;
  prior=next;frames++;return onFrame(...args);
 };
 for(let i=0;i<2400&&s.phase!=='results';i++)stepRace(s,()=>pilot.input(s,r),.05);
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.complete,true);
 assert.ok(frames>500);assert.ok(wetFrames>0,'physical route crosses original weed zones');assert.ok(exits>0,'route exits a weed zone');
 assert.throws(()=>s.nativeLaunch.riderForceContext(1),/source slot/);
});
