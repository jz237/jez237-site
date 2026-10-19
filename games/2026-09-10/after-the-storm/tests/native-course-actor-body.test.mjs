import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeCourseActorBodyPoseWords as read} from '../native-course-actor-body.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {prepareNativeCourseActorFrame} from '../native-course-actor-frame.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {raceWaterActorMotionInputs} from '../race-water.js';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const b=new DataView(new ArrayBuffer(4));
const float=w=>{b.setUint32(0,w);return b.getFloat32(0);};
const digest=words=>{const out=Buffer.alloc(words.length*4);words.forEach((w,i)=>out.writeUInt32BE(w,i*4));return createHash('sha256').update(out).digest('hex');};

test('fresh body sampling keeps native position and source-cleared motion without advancing the hull',()=>{
 const a=createNativeRaceAdapter({position:{x:2,y:-3,z:5},heading:.7,scale:.025}),before=structuredClone(a.hull);
 const q=read(a,{startup:true});
 assert.deepEqual(q.map(float),[80,-120,200,0,0,0]);assert.deepEqual(a.hull,before);assert.equal(a.logicalFrames,0);
 assert.ok(Object.isFrozen(q));assert.throws(()=>read(a),/completed physical frame/);
});

test('completed body samples retain motion direction through held simulation and reject partial ticks',()=>{
 let simulationState=3;
 const a=createNativeRaceAdapter({velocity:{x:2,y:0,z:-1},heading:1,sourceState:()=>({simulationState})});
 stepNativeRaceAdapter(a,.01,{throttle:true});assert.throws(()=>read(a),/frame boundary/);
 stepNativeRaceAdapter(a,.04,{throttle:true});const q=read(a).map(float);
 for(const [i,k]of ['x','y','z'].entries()){
  assert.equal(q[i],Math.fround(a.hull.center[k]/a.hull.scale));
  assert.equal(q[i+3],Math.fround(a.hull.motionDirection[k]));
 }
 assert.notDeepEqual(q.slice(3),['x','y','z'].map(k=>Math.fround(a.hull.frame.forward[k])));
 assert.notDeepEqual(q.slice(3),['x','y','z'].map(k=>Math.fround(a.hull.motionVelocity[k])));
 assert.throws(()=>read(a,{startup:true}),/fresh physical body/);
 simulationState=0;stepNativeRaceAdapter(a,.05,{});assert.deepEqual(read(a).map(float),q);
 a.pendingFrameCompletion=true;assert.throws(()=>read(a),/frame boundary/);a.pendingFrameCompletion=false;
 a.hull.motionDirection.x=Infinity;assert.throws(()=>read(a),/Nonfinite/);
});

test('physical body-word adaptation preserves original complete AD418 scratch results',()=>{
 const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-actor-frame.json.gz',import.meta.url))));
 // Course6 reaches the complete source outer frame with no actor motion leaf.
 const cases=e.cases.filter(c=>c.input.courseIndex===6);assert.equal(cases.length,20);
 for(const c of cases){
  const a=c.input,bodyPoseWordsBySlot=a.bodyPoseWordsBySlot.map(words=>{
   const values=words.map(float),adapter=createNativeRaceAdapter({scale:1});
   Object.assign(adapter.hull.center,Object.fromEntries(['x','y','z'].map((k,i)=>[k,values[i]])));
   Object.assign(adapter.hull.motionDirection,Object.fromEntries(['x','y','z'].map((k,i)=>[k,values[i+3]])));
   return read(adapter,{startup:true});
  });
  assert.deepEqual(bodyPoseWordsBySlot,a.bodyPoseWordsBySlot);
  const actorWordsF060=[...e.baseActorWords];for(const [i,w]of a.actorOverrides)actorWordsF060[i]=w;
  const q=prepareNativeCourseActorFrame({...a,bodyPoseWordsBySlot,actorWordsF060});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(q.actorWordsF060),c.actorSHA256);
 }
});

test('live Practice actor inputs share completed water and physical owners without advancing any state',()=>{
 const state=createRace({mode:'practice',physics:'native',course:getCourse('practice')}),host=state.nativeHost;
 const retainedWordsEe20=Array.from({length:192*65},(_,i)=>0x14000000+i);
 assert.throws(()=>host.courseActorMotionInputs({retainedWordsEe20}),/completed shared/);
 for(let i=0;i<3;i++)stepRace(state,{throttle:1},1/60);
 const before=state.nativeLaunch.snapshot(),waterFrame=state.raceWater.frames,buoys=structuredClone(host.primary.state),ticks=host.world.ticks;
 const q=host.courseActorMotionInputs({retainedWordsEe20}),w=raceWaterActorMotionInputs(state.raceWater);
 assert.equal(q.waterField,state.raceWater.field);
 assert.deepEqual(q.bodyPoseWordsBySlot,[read(host.world.adapters[0])]);
 assert.deepEqual(q.selectedWaterVertexXZ,w.selectedWaterVertexXZ);assert.deepEqual(q.waterRangeWords2428,w.waterRangeWords2428);
 assert.equal(q.collisionGeometry.floor.planes.length,100);assert.equal(q.collisionGeometry.shore.lines.length-1,55);
 assert.equal(q.courseWordsEe20.length,192*65);
 assert.deepEqual(q.courseWordsEe20.slice(60*65,64*65),retainedWordsEe20.slice(60*65,64*65));
 assert.deepEqual(state.nativeLaunch.snapshot(),before);assert.deepEqual(host.primary.state,buoys);assert.equal(state.raceWater.frames,waterFrame);assert.equal(host.world.ticks,ticks);
 assert.throws(()=>host.courseActorMotionInputs(),/retained course/);
 // Earlier detached samples remain valid when the physical owner moves again.
 for(let i=0;i<3;i++)stepRace(state,{throttle:1},1/60);
 assert.notDeepEqual(host.courseActorMotionInputs({retainedWordsEe20}).bodyPoseWordsBySlot,q.bodyPoseWordsBySlot);
});
