import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeGraphicsCornerState,createNativeGraphicsCornerBootState,patchNativeGraphicsCornerState,
 advanceNativeGraphicsCornerState,nativeGraphicsCornerView} from '../native-graphics-corner-state.js';
import {nativeAICameraCornerSnapshot} from '../native-ai-perception.js';
import {prepareNativeAIInitialization} from '../native-ai-initialization.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-graphics-corner-lifetime.json',import.meta.url)));
const input={rngState:17,racerCount:1,primaryHumanIndex:0,hullProfilesB64:[0,1,2,3],avatarsB68:[3,2,1,0],
 sourceOrder:[0],retainedRoleWords:[0,0,0,0],adjacentRoleWord:0,objectTypes4c:[]};
const create=()=>createRace({mode:'time',physics:'native',course:getCourse('greyhaven'),seaState:'course'});

test('retained byte storage and selection match eighteen actual original buffer switches',()=>{
 for(const c of fixture.cases){
  let state=createNativeGraphicsCornerState(c.initial);
  for(const expected of c.frames){
   state=advanceNativeGraphicsCornerState(state);
   assert.deepEqual(state,{renderBufferIndex:expected.renderBufferIndex,buffers:expected.buffers});
   const view=nativeGraphicsCornerView(state);
   assert.deepEqual(view.cornerBuffersNative,expected.cornerBuffersNative);
   assert.deepEqual(view.cameraCornersNative,expected.cornerBuffersNative[expected.renderBufferIndex]);
   assert.deepEqual(nativeAICameraCornerSnapshot(view),view.cameraCornersNative);
  }
  assert.deepEqual(state.buffers,c.initial.buffers);
 }
});

test('cold boot is explicit; warm AI setup preserves every coordinate, alpha and selector',()=>{
 const cold=createNativeGraphicsCornerBootState(),another=createNativeGraphicsCornerBootState();
 assert.equal(cold.renderBufferIndex,0);assert.notEqual(cold.buffers[0],cold.buffers[1]);
 assert.notEqual(cold.buffers[0],another.buffers[0]);assert.ok(cold.buffers.flat().every(v=>v===0));
 const source=fixture.cases[1].initial,prepared=prepareNativeAIInitialization(input);
 const next=patchNativeGraphicsCornerState(source,prepared.cameraBytePatches);
 assert.equal(next.renderBufferIndex,1);
 assert.deepEqual(nativeGraphicsCornerView(next),nativeGraphicsCornerView(source));
 for(let b=0;b<2;b++)for(let i=0;i<112;i++){
  const vertex=Math.floor(i/16),offset=i%16;
  const expected=vertex<3&&offset>=12?[255,0,0,255][offset-12]:
   vertex>=3&&(offset===2||offset===3)?0:vertex>=3&&offset>=12&&offset<=14?255:source.buffers[b][i];
  assert.equal(next.buffers[b][i],expected,`buffer${b} byte${i}`);
 }
 assert.ok(Object.isFrozen(next)&&Object.isFrozen(next.buffers)&&next.buffers.every(Object.isFrozen));
 assert.throws(()=>{next.buffers[0][48]=0;},TypeError);
});

test('explicit coordinate writes remain possible, signed16 is retained, and invalid batches are atomic',()=>{
 const source=createNativeGraphicsCornerBootState();
 const next=patchNativeGraphicsCornerState(source,[{cameraIndex:0,relativeByteOffset:0,value:128},
  {cameraIndex:0,relativeByteOffset:4,value:127},{cameraIndex:0,relativeByteOffset:5,value:255},
  {cameraIndex:1,relativeByteOffset:0,value:0},{cameraIndex:1,relativeByteOffset:0,value:255},
  {cameraIndex:1,relativeByteOffset:1,value:255}]);
 assert.deepEqual(nativeGraphicsCornerView(next).cornerBuffersNative.map(b=>b[0]),[{x:-32768,z:32767},{x:-1,z:0}]);
 assert.ok(source.buffers.flat().every(v=>v===0));
 for(const bad of [{cameraIndex:2,relativeByteOffset:0,value:0},{cameraIndex:0,relativeByteOffset:-49,value:0},
  {cameraIndex:1,relativeByteOffset:64,value:0},{cameraIndex:0,relativeByteOffset:0,value:256},undefined]){
  assert.throws(()=>patchNativeGraphicsCornerState(next,[{cameraIndex:0,relativeByteOffset:0,value:0},bad]));
  assert.equal(nativeGraphicsCornerView(next).cameraCornersNative[0].x,-32768);
 }
 for(const bad of [undefined,{renderBufferIndex:2,buffers:source.buffers},
  {renderBufferIndex:0,buffers:[source.buffers[0]]},{renderBufferIndex:0,buffers:[Array(112),source.buffers[1]]}])
  assert.throws(()=>createNativeGraphicsCornerState(bad));
 const detached=structuredClone(next),restored=createNativeGraphicsCornerState(detached);detached.buffers[0][48]=0;
 assert.equal(nativeGraphicsCornerView(restored).cameraCornersNative[0].x,-32768);
});

test('canonical graphics operations preserve unrelated owners and reject late failures without committing',()=>{
 const initial={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),scene:{},graphicsCorners:fixture.cases[0].initial};
 const state=createNativeRaceState(initial),patches=prepareNativeAIInitialization(input).cameraBytePatches;
 const next=prepareNativeRaceStateOperations(state,[{kind:'graphicsCornerPatch',patches},{kind:'graphicsBufferAdvance'}]);
 assert.deepEqual(next.state.graphicsCorners,advanceNativeGraphicsCornerState(patchNativeGraphicsCornerState(initial.graphicsCorners,patches)));
 assert.deepEqual(next.effects,[]);assert.deepEqual(next.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(next.state.hudWords7788,state.hudWords7788);
 assert.throws(()=>prepareNativeRaceStateOperations(state,[{kind:'graphicsBufferAdvance'},
  {kind:'graphicsCornerPatch',patches:[{cameraIndex:0,relativeByteOffset:64,value:0}]}]));
 assert.deepEqual(state.graphicsCorners,initial.graphicsCorners);
 const snapshot=nativeRaceStateSnapshot(state);snapshot.graphicsCorners.buffers[0][48]^=255;
 assert.deepEqual(state.graphicsCorners,initial.graphicsCorners,'mutable snapshots remain detached from canonical storage');
 const missing={...initial};delete missing.graphicsCorners;
 assert.throws(()=>prepareNativeRaceStateOperations(missing,[{kind:'graphicsBufferAdvance'}]),/retained graphicsCorners/);
});

test('live launch consumes initializer patches in its canonical owner and retains restored coordinates',()=>{
 const race=create(),cold=race.nativeLaunch.snapshot();
 assert.deepEqual(cold.graphicsCorners,patchNativeGraphicsCornerState(createNativeGraphicsCornerBootState(),prepareNativeAIInitialization(input).cameraBytePatches));
 const retained=structuredClone(cold);retained.graphicsCorners=structuredClone(fixture.cases[1].initial);
 const runtime=createNativeRaceLaunchRuntime({racers:structuredClone(race.racers),courseIndex:1,players:1,initialState:retained});
 const before=runtime.snapshot(),prepared=runtime.initializeAI(input);
 assert.deepEqual(runtime.snapshot().graphicsCorners,patchNativeGraphicsCornerState(before.graphicsCorners,prepared.cameraBytePatches));
 assert.deepEqual(runtime.aiCameraCorners(),nativeGraphicsCornerView(before.graphicsCorners));
 for(const f of fixture.cases[1].frames)assert.deepEqual(runtime.advanceGraphicsBuffer().cameraCornersNative,f.cornerBuffersNative[f.renderBufferIndex]);
 assert.deepEqual(retained.graphicsCorners,fixture.cases[1].initial);
 const missing=structuredClone(cold);delete missing.graphicsCorners;
 const old=createNativeRaceLaunchRuntime({racers:structuredClone(race.racers),courseIndex:1,players:1,initialState:missing});
 const untouched=old.snapshot();assert.throws(()=>old.initializeAI(input),/retained graphicsCorners/);assert.deepEqual(old.snapshot(),untouched);
});
