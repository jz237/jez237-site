import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRiderWaterState} from '../native-rider-water-state.js';
import {createNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
import {createRaceWater} from '../race-water.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {queryNativeWaterField} from '../native-water-field.js';
const evidence=JSON.parse(readFileSync(new URL('./fixtures/native-rider-water-audio-reference.json',import.meta.url)));

test('physical water-state bridge preserves all108 original cases and lazy scalar queries',()=>{
 for(const c of evidence.cases){
  const calls=[],previous={bodyC84:17,bodyC86:c.previous},before={...previous};
  const q=prepareNativeRiderWaterState(previous,{actorState:c.input.actorC54,jointWorld:c.input.point6b4Native,scale:1,
   queryNative:(x,z)=>{calls.push({x,z});return c.input.waterQueryNative;}});
  assert.deepEqual(q,c.expected);assert.deepEqual(previous,before);
  assert.equal(calls.length,[5,23].includes(c.input.actorC54)?1:0);
  if(calls.length)assert.deepEqual(calls[0],{x:Math.fround(c.input.point6b4Native.x),z:Math.fround(c.input.point6b4Native.z)});
 }
});

function worldFor(simulationState){
 const water=createRaceWater({crafts:[{x:0,y:0,z:0,heading:0}],baseAmplitudeNative:0,datumNative:100,initialNoise:false});
 const queries=[],adapters=Array.from({length:4},(_,slot)=>{
  const position={x:slot*5,y:0,z:0},bundle=createAuthoredNativeRider({initialHull:createNativeHull({position})});
  return createNativeRaceAdapter({position,...bundle,sourceState:{actorState:5,simulationState},
   riderWaterQuery:(x,z)=>{
    const a=adapters[slot],joint=bundle.articulatedRider.jointWorld;
    assert.equal(bundle.articulatedRider.logicalFrames,simulationState===0?0:a.logicalFrames,'query follows the completed pose');
    assert.equal(water.frames,a.logicalFrames-1,'query precedes this frame water evolution');
    assert.deepEqual([x,z],[Math.fround(joint.x/a.hull.scale),Math.fround(joint.z/a.hull.scale)]);
    const height=queryNativeWaterField(water.field,x,z).sourcePlaneQueryNative;
    queries.push({slot,frame:a.logicalFrames,height});return height;
   }});
 });
 const world=createNativeRaceWorld({adapters,water,craftContacts:false,
  beforeWater:w=>{w.frame.water.datumNative=-100;}});
 return {world,queries};
}

test('every physical racer samples rider water in descending order before the shared field advances',()=>{
 for(const simulation of [0,3]){
  const {world,queries}=worldFor(simulation);
  stepNativeRaceWorld(world,.05,[{},{},{},{}]);
  assert.deepEqual(queries.map(q=>q.slot),[3,2,1,0]);
  assert.ok(queries.every(q=>q.height>0));assert.equal(world.water.field.datumNative,-100);
  for(const a of world.adapters)assert.deepEqual(a.lastFrame.riderWater,{bodyC84:0,bodyC86:1});
  stepNativeRaceWorld(world,.05,[{},{},{},{}]);
  for(const a of world.adapters){
   assert.deepEqual(a.lastFrame.riderWater,{bodyC84:1,bodyC86:0});
   const snap=nativeRaceSnapshot(a);snap.source.riderWater.bodyC86=123;
   assert.equal(a.riderWaterState.bodyC86,0);
  }
  const count=queries.length;stepNativeRaceWorld(world,1,null,{active:false});assert.equal(queries.length,count);
 }
});

test('rider water histories and query timing remain identical at30,60 and144Hz',()=>{
 const histories=[];
 for(const hz of [30,60,144]){
  const {world,queries}=worldFor(3);
  for(let i=0;i<hz/2;i++)stepNativeRaceWorld(world,1/hz,[{},{},{},{}]);
  histories.push({queries,riders:world.adapters.map(a=>nativeRaceSnapshot(a)),waterFrames:world.water.frames});
 }
 assert.deepEqual(histories[1],histories[0]);assert.deepEqual(histories[2],histories[0]);
});

test('a failed reached query retains prior water flags and non-water actors do not require a joint',()=>{
 const previous={bodyC84:0,bodyC86:1};
 assert.throws(()=>prepareNativeRiderWaterState(previous,{actorState:23,jointWorld:{x:0,y:0,z:0},scale:.025,queryNative:()=>NaN}),/query/);
 assert.deepEqual(previous,{bodyC84:0,bodyC86:1});
 assert.deepEqual(prepareNativeRiderWaterState(previous,{actorState:22}),{bodyC84:1,bodyC86:0});
});
