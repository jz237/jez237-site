import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { createCityStreets } from '../src/city-streets.js';
import { createCityUniforms } from '../src/city-lighting.js';

const doc={roads:[{id:1,oneway:0,width:10,points:[[1,0,0],[2,100,0],[3,200,0]]}]};
function fixture(onReady){
  const scene=new THREE.Scene();
  const streets=createCityStreets(THREE,{scene,projection:{lonToX:x=>x,latToZ:z=>z,
    xToLon:x=>x,zToLat:z=>z},sampleElevation:()=>4,lighting:{uniforms:createCityUniforms(THREE)},onReady});
  const params={camera:{position:new THREE.Vector3(50,500,500)},pose:{lon:50,lat:0,dist:900},
    state:{era:'present',compareMode:'off',lightweight:false,layers:{structures:true},
      streetLife:true,animationSpeed:1},exaggeration:1,sunDir:new THREE.Vector3(.3,1,0),
    dt:1,reducedMotion:true,archive:false,quality:'balanced'};
  return {scene,streets,params};
}

test('a failed street download retries after backoff only when the layer is visible',async()=>{
  const original=globalThis.fetch,warning=console.warn;let attempts=0;
  globalThis.fetch=async()=>{attempts++;if(attempts===1)throw new Error('temporary network failure');
    return {ok:true,json:async()=>doc};};
  console.warn=()=>{};
  const f=fixture();
  try{
    f.streets.update(f.params);await new Promise(resolve=>setImmediate(resolve));
    f.streets.update(f.params);assert.equal(attempts,1,'failure must not create a per-frame request loop');
    const hidden={...f.params,dt:10,state:{...f.params.state,streetLife:false}};
    for(let i=0;i<4;i++)f.streets.update(hidden);
    assert.equal(attempts,1,'hidden scenery makes no requests');
    f.streets.update(f.params);await new Promise(resolve=>setImmediate(resolve));
    f.streets.update(f.params);assert.equal(attempts,2);
    assert.ok(f.streets.group.children[2].count>0,'traffic recovers without a page reload');
  }finally{f.streets.dispose();globalThis.fetch=original;console.warn=warning;}
});

test('disposing street scenery aborts an unfinished request and ignores a late response',async()=>{
  const original=globalThis.fetch;let finish,signal;
  globalThis.fetch=(_url,options)=>{signal=options.signal;return new Promise(resolve=>{finish=resolve;});};
  const f=fixture();
  try{
    f.streets.update(f.params);f.streets.dispose();assert.equal(signal.aborted,true);
    finish({ok:true,json:async()=>doc});await new Promise(resolve=>setImmediate(resolve));
    f.streets.update(f.params);
    assert.equal(f.scene.children.length,0);assert.equal(f.streets.group.children[2].count,0);
  }finally{globalThis.fetch=original;}
});

test('disposing after cars become ready prevents deferred sidewalks from attaching',async()=>{
  const original=globalThis.fetch;let signal,notifications=0;
  globalThis.fetch=async(_url,options)=>{signal=options.signal;return {ok:true,json:async()=>doc};};
  const f=fixture(()=>{notifications++;f.streets.dispose();});
  try{
    f.streets.update(f.params);await new Promise(resolve=>setImmediate(resolve));
    assert.equal(signal.aborted,true);assert.equal(notifications,1);
    assert.equal(f.scene.children.length,0);
    assert.equal(f.streets.group.getObjectByName('sidewalk-walkers').count,0);
  }finally{globalThis.fetch=original;}
});

test('explicit Play advances vehicle transforms even when the computer requests reduced motion',async()=>{
  const original=globalThis.fetch;globalThis.fetch=async()=>({ok:true,json:async()=>doc});
  const f=fixture();
  try{
    f.streets.update(f.params);await new Promise(resolve=>setImmediate(resolve));f.streets.update(f.params);
    const mesh=f.streets.group.children[2],before=Array.from(mesh.instanceMatrix.array);
    f.streets.update(f.params);assert.deepEqual(Array.from(mesh.instanceMatrix.array),before);
    f.params.state.streetMotion='on';
    for(let i=0;i<20;i++)f.streets.update({...f.params,dt:.05});
    assert.notDeepEqual(Array.from(mesh.instanceMatrix.array),before);
    assert.ok(f.streets.stats().cars>0);assert.ok(f.streets.stats().moving>0);
    f.params.state.streetMotion='off';f.streets.update(f.params);
    assert.equal(f.streets.animating,false);assert.equal(f.streets.stats().moving,0);
  }finally{f.streets.dispose();globalThis.fetch=original;}
});

test('street motion covers the same ground at two FPS as at twenty FPS',async()=>{
  const original=globalThis.fetch;globalThis.fetch=async()=>({ok:true,json:async()=>doc});
  const slow=fixture(),fast=fixture();
  try{
    for(const f of [slow,fast]){
      f.params.state.streetMotion='on';f.params.dt=0;f.streets.update(f.params);
    }
    await new Promise(resolve=>setImmediate(resolve));
    for(const f of [slow,fast])f.streets.update(f.params);
    for(let i=0;i<4;i++)slow.streets.update({...slow.params,dt:.5});
    for(let i=0;i<40;i++)fast.streets.update({...fast.params,dt:.05});
    const a=slow.streets.group.children[2],b=fast.streets.group.children[2];
    assert.equal(a.count,b.count);assert.ok(a.count>0);
    for(let i=0;i<a.count*16;i++)assert.ok(Math.abs(a.instanceMatrix.array[i]-b.instanceMatrix.array[i])<.0001);
  }finally{slow.streets.dispose();fast.streets.dispose();globalThis.fetch=original;}
});
