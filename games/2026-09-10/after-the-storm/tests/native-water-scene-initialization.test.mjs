import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeWaterSceneSetup as setup,prepareNativeWaterSceneInitialization as initialize,nativeWaterWrapBounds} from '../native-water-scene-initialization.js';
import {createNativeWaterField,createNativeWaterPatch,nativeWaterVertexIndex} from '../native-water-field.js';
import {createNativeRaceState,prepareNativeRaceWaterSceneInitialization as canonical} from '../native-race-state.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-water-scene-initialization.json',import.meta.url)));
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
function gridHash(q){const b=Buffer.alloc(49152*4);q.heightQ.forEach((v,i)=>{b.writeInt16BE(v,i*4);b.writeInt16BE(q.velocityQ[i],i*4+2);});return createHash('sha256').update(b).digest('hex');}
test('complete scene setup matches ordered original writes across all variant/player branches',()=>{
 assert.equal(source.forcingPhase47c0Retained,true);
 for(const c of source.cases){const before=structuredClone(c.input),q=setup(c.input);
  assert.equal(q.operations.length,c.operationCount);assert.equal(hash(q.operations),c.operationsSha256,JSON.stringify(c.input));
  assert.deepEqual(q.operations.filter(o=>o.kind==='waterSetupWrite'),c.setupWrites);assert.deepEqual(c.input,before);
  assert.deepEqual(nativeWaterWrapBounds(),Array.from({length:6},(_,i)=>q.setupWords[0x8c+i*4]));
  assert.equal(q.operations.filter(o=>o.kind==='waterNoiseInitialization').length,1);
  assert.equal(q.diagnostic.forcingPhase47c0Retained,true);assert.ok(Object.isFrozen(q.coordinates[0]));
 }
});
test('generated simulation patch order matches existing water selection without changing forcing phase',()=>{
 for(const variant of [0,1,2,3])for(const players of [1,2]){
  const q=setup({variant,players,datumNative:0,amplitudeNative:20}),field=createNativeWaterField({variant,players,phaseCounter:17});
  const patch=createNativeWaterPatch(field),indices=q.coordinates.map(([u,v])=>nativeWaterVertexIndex(u,v));
  assert.deepEqual(indices,patch.indices);assert.equal(q.vertices.length,indices.length);assert.equal(field.phaseCounter,17);
  const graphics=q.operations.filter(o=>o.kind==='waterGraphicsWrite');
  assert.equal(graphics[0].bufferIndex,1);assert.equal(graphics.at(-1).bufferIndex,0);
  assert.equal(q.diagnostic.highResolutionMeshChanged,false);
 }
});
test('canonical scene preparation carries shared RNG through full noise and keeps other owners intact',()=>{
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0x12345678),hudWords7788:Array(1442).fill(0x87654321),
  scene:{rngState4640:0xdeadbeef,field64c:1,players:1,wave49b0:20,gameStateAb24:52,initLatch63c:1}});
 const before=structuredClone(state),q=canonical(state,{datumNative:0});
 assert.equal(q.waterScene.parameters.radius,16);assert.equal(q.state.scene.rngState4640,4186349699);
 assert.equal(gridHash(q.waterScene.noise),'543cf2203e58cd70f3f59e0adf9e1b704d517b7c04306146d6e68c2c3bb87d27');
 assert.equal(q.diagnostic.rngCalls,98316);assert.equal(q.state.scene.initLatch63c,1);
 assert.deepEqual(q.state.scene,{...before.scene,rngState4640:4186349699});assert.deepEqual(state,before);
 assert.deepEqual(q.state.hudWords7788,before.hudWords7788);assert.deepEqual(q.state.raceWords1f94,before.raceWords1f94);
 assert.deepEqual(q.effects,[]);assert.equal(q.diagnostic.liveFieldUpdated,false);
 assert.throws(()=>canonical(state,{datumNative:32768}),/datumNative/);assert.deepEqual(state,before);
});
test('missing selection, invalid late RNG and invalid datum cannot partly initialize a scene',()=>{
 for(const input of [{},{players:1},{variant:0},{variant:0,players:1,datumNative:0,amplitudeNative:128}])assert.throws(()=>setup(input));
 const input={variant:0,players:1,datumNative:-173,amplitudeNative:20,rngState4640:-1},before=structuredClone(input);
 assert.throws(()=>initialize(input),/rngState4640/);assert.deepEqual(input,before);
});
