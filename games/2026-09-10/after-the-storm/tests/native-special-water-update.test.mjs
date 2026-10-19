import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeSpecialWaterUpdate as prepare,prepareNativeWaterDisturbance,applyNativeSpecialWaterField,NATIVE_SPECIAL_WATER_DATA} from '../native-special-water-update.js';
import {createNativeWaterField} from '../native-water-field.js';
import {createNativeRaceState,prepareNativeSpecialWaterFrameUpdate} from '../native-race-state.js';
import {prepareNativeWaterSceneInitialization} from '../native-water-scene-initialization.js';
import {createRaceWater,installRaceWaterMenuScene,advanceRaceWaterMenuFrame,stepRaceWater,captureRaceWater} from '../race-water.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-special-water-update.json',import.meta.url)));
test('canonical motion and shared RNG are authoritative and preserve unrelated state',()=>{
 for(const c of reference.cases){
  const {main638,simulation648,field64c,rngState4640}=c.input;
  const state=createNativeRaceState({raceWords1f94:Array(1693).fill(123),hudWords7788:Array(1442).fill(234),
   scene:{main638,simulation648,field64c,rngState4640},menuWaterMotionWords47c4:c.input.motionWords47c4});
  const before=structuredClone(state),q=prepareNativeSpecialWaterFrameUpdate(state,{...c.input,main638:1,field64c:0,rngState4640:99,
   motionWords47c4:[],sineLookup:i=>c.input.sineSamples[i]});
  assert.deepEqual(q.state.menuWaterMotionWords47c4,c.motionWords47c4);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.state.hudWords7788,state.hudWords7788);assert.deepEqual(state,before);
  assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='waterCellWrite'||o.kind==='waterPatchRequest'));
 }
});
test('live menu installation keeps field identity and phase, uses a separate clock and rejects partial reinstallation',()=>{
 const crafts=[{x:0,y:0,z:0,heading:0}],water=createRaceWater({crafts,baseAmplitudeNative:20,amplitudeThresholdNative:2000,phaseCounter:71,initialNoise:false});
 const scene=prepareNativeWaterSceneInitialization({variant:1,players:1,datumNative:0,amplitudeNative:20,rngState4640:17});
 const field=water.field,original=structuredClone(field),bad={...scene,noise:{...scene.noise,velocityQ:[...scene.noise.velocityQ]}};
 bad.noise.velocityQ[49151]=NaN;assert.throws(()=>installRaceWaterMenuScene(water,bad),/noise/);assert.deepEqual(field,original);assert.equal(water.menuActive,false);
 const initialBounds=water.boundaryWords24ac;
 assert.throws(()=>installRaceWaterMenuScene(water,{...scene,setupWords:{...scene.setupWords,[0xa0]:0x7fc00000}}),/boundary float/);
 assert.deepEqual(field,original);assert.equal(water.boundaryWords24ac,initialBounds);assert.equal(water.menuActive,false);
 installRaceWaterMenuScene(water,scene);assert.equal(water.field,field);assert.equal(field.phaseCounter,71);
 assert.deepEqual(water.boundaryWords24ac,Array.from({length:6},(_,i)=>scene.setupWords[0x8c+i*4]));
 assert.ok(Object.isFrozen(water.boundaryWords24ac));assert.notEqual(water.boundaryWords24ac,initialBounds);
 assert.deepEqual(Array.from(field.heightQ),scene.noise.heightQ);assert.deepEqual(Array.from(field.velocityQ),scene.noise.velocityQ);
 const q=prepare({...reference.cases.find(c=>c.input.main638===9&&c.input.simulation648===3).input});
 const revision=water.revision;advanceRaceWaterMenuFrame(water,q.operations);
 assert.equal(water.menuFrames,1);assert.equal(water.frames,0);assert.equal(water.rollerFrames,0);assert.equal(water.revision,revision+1);
 assert.equal(captureRaceWater(water).revision,water.revision);assert.equal(field.phaseCounter,71);assert.equal(field.patchUpdates,1);
 const snapshot=structuredClone(field);assert.throws(()=>installRaceWaterMenuScene(water,scene),/completed race boundary/);assert.deepEqual(field,snapshot);
 assert.throws(()=>stepRaceWater(water,crafts,.05),/scene owner/);assert.equal(water.remainder,0);
 stepRaceWater(water,crafts,.05,{active:false});assert.equal(water.menuFrames,1);
});
test('complete moving disturbance and patch evolution match all original field bytes over consecutive frames',()=>{
 const whole=JSON.parse(readFileSync(new URL('./fixtures/native-special-water-field.json',import.meta.url)));
 for(const c of whole.cases){
  const field=createNativeWaterField({variant:1,phaseCounter:47});
  for(let i=0;i<49152;i++){field.heightQ[i]=(i*349+73)%8001-4000;field.velocityQ[i]=(i*157+19)%2001-1000;}
  let input={...c.input,sineLookup:i=>c.sineSamples[i]};
  for(const expected of c.frames){
   const q=prepare(input);applyNativeSpecialWaterField(field,q.operations);
   input={...input,motionWords47c4:q.motionWords47c4??input.motionWords47c4,rngState4640:q.rngState4640??input.rngState4640};
   const bytes=Buffer.alloc(49152*4);for(let i=0;i<49152;i++){bytes.writeInt16BE(field.heightQ[i],i*4);bytes.writeInt16BE(field.velocityQ[i],i*4+2);}
   assert.equal(createHash('sha256').update(bytes).digest('hex'),expected.fieldSha256);
   assert.deepEqual(input.motionWords47c4,expected.motionWords47c4);assert.equal(input.rngState4640,expected.rngState4640);
   assert.equal(field.phaseCounter,47);assert.equal(field.forcingCalls,0);
  }
 }
});
test('special menu disturbance matches full original caller, shared RNG and triangle stores',()=>{
 assert.deepEqual(NATIVE_SPECIAL_WATER_DATA,reference.numeric);
 for(const c of reference.cases){
  const before=structuredClone(c.input),q=prepare({...c.input,sineLookup:i=>c.input.sineSamples[i]});
  assert.deepEqual(q.operations,c.operations);
  if(c.input.main638===9){assert.deepEqual(q.motionWords47c4,c.motionWords47c4);assert.equal(q.rngState4640,c.rngState4640);}
  assert.deepEqual(c.input,before);
 }
 for(const c of reference.stamps)assert.deepEqual(prepareNativeWaterDisturbance(c.input).operations,c.operations);
});
test('held simulation still stamps the disturbance while main6 does not advance motion or RNG',()=>{
 const c=reference.cases.find(c=>c.input.main638===9&&c.input.simulation648===0),field=createNativeWaterField({variant:1,phaseCounter:123});
 field.heightQ.fill(117);field.velocityQ.fill(29);
 const q=prepare(c.input),out=applyNativeSpecialWaterField(field,q.operations),cells=new Set(q.operations.filter(o=>o.kind==='waterCellWrite').map(o=>o.index));
 assert.equal(cells.size,3);assert.equal(field.phaseCounter,123);assert.equal(field.patchUpdates,0);assert.equal(field.forcingCalls,0);
 for(let i=0;i<49152;i++){assert.equal(field.heightQ[i],cells.has(i)?-12800:117);assert.equal(field.velocityQ[i],cells.has(i)?0:29);}
 assert.equal(out.patch.radius,16);
 const held=prepare({main638:6,field64c:1,simulation648:0});
 assert.deepEqual(held.operations,[{kind:'waterPatchRequest',playerIndex:0,xNative:0,zNative:0,radius:16,evolve:false}]);
 const before=field.heightQ.slice();applyNativeSpecialWaterField(field,held.operations);assert.deepEqual(field.heightQ,before);
});
test('invalid final field operations leave every cell and phase unchanged',()=>{
 const field=createNativeWaterField({variant:1,phaseCounter:31}),before=structuredClone(field);
 const c=reference.cases.find(c=>c.input.main638===9),ops=structuredClone(prepare(c.input).operations);
 ops.at(-1).radius=12;assert.throws(()=>applyNativeSpecialWaterField(field,ops),/patch/);assert.deepEqual(field,before);
 assert.throws(()=>prepare({...c.input,sineLookup:()=>NaN}),/sine/);
 assert.throws(()=>prepare({...c.input,field64c:0}),/field64c/);
});
