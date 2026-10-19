import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeSceneGraphicsFrame as prepare,nativeSceneGraphicsBufferIndex as index} from '../native-scene-graphics-frame.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeSceneGraphicsFrameUpdate as update} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-scene-graphics-frame.json.gz',import.meta.url))));

test('complete original6A264 matches all writes across activity, latch, selector and signed-counter overflow',()=>{
 for(const c of evidence.cases){const before=structuredClone(c.input),q=prepare(c.input);assert.deepEqual(q.operations,c.operations);assert.equal(q.diagnostic.bufferIndex,c.input.graphicsSelector4b0c);assert.deepEqual(c.input,before);}
});

test('canonical scene frame keeps AI/actor graphics independent and installs the incoming selected buffer',()=>{
 for(const c of evidence.cases){
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:0,players:1,mode620:4}));
  Object.assign(state.scene,c.input,{graphicsPointerE948:123,graphicsPointerE94c:123,matrixCountE950:123});state.graphicsCorners.renderBufferIndex=c.input.graphicsSelector4b0c^1;
  const before=structuredClone(state),q=update(state);
  for(const [field,v]of Object.entries(c.expected))assert.equal(q.state.scene[field]>>>0,v,field);
  assert.equal(index(q.state.scene.graphicsPointerE948),c.input.graphicsSelector4b0c);assert.equal(q.state.scene.graphicsSelector4b0c,c.input.graphicsSelector4b0c^1);
  assert.deepEqual(q.state.graphicsCorners,state.graphicsCorners);assert.deepEqual(q.effects,[]);assert.deepEqual(state,before);
  for(const k of Object.keys(state))if(k!=='scene')assert.deepEqual(q.state[k],state[k]);
 }
});

test('held activity still alternates buffers and resets allocation without reading a gameplay counter',()=>{
 let a={graphicsLatch4b08:1,activity624:0,graphicsFrame4b04:0,graphicsSelector4b0c:0};
 for(let i=0;i<8;i++){
  const q=prepare(a);assert.equal(q.operations.some(o=>o.field==='ambientD4b00'),false);assert.equal(q.diagnostic.bufferIndex,i%2);
  for(const o of q.operations)a[o.field]=o.value|0;assert.equal(a.matrixCountE950,0);assert.equal(a.graphicsFrame4b04,i+1);
 }
 for(const p of [undefined,0,0x80198369,0x80198368+2*0xb2f0])assert.throws(()=>index(p),/pointer/);
});

test('actual race host executes full scene workspace once before physical preparation with independent selectors',()=>{
 const options={mode:'time',physics:'native',course:getCourse('greyhaven')},seed=createRace(options).nativeLaunch.snapshot();
 assert.equal(seed.scene.graphicsFrame4b04,0);assert.equal(seed.scene.graphicsLatch4b08,1);assert.equal(seed.scene.graphicsSelector4b0c,0);
 assert.equal(seed.scene.graphicsPointerE948,undefined,'fresh allocation does not pretend the first frame ran');
 for(const activity624 of [-1,0])for(const simulation648 of [0,3])for(const selector of [0,1]){
  const retained=structuredClone(seed);
  Object.assign(retained.scene,{activity624,simulation648,phase650:3,graphicsFrame4b04:2147483647,graphicsLatch4b08:7,
   graphicsSelector4b0c:selector,ambientD4b00:2147483647,graphicsPointerE948:123,graphicsPointerE94c:456,matrixCountE950:37});
  retained.graphicsCorners.renderBufferIndex=selector;
  const race=createRace({...options,nativeInitialRaceState:retained}),host=race.nativeHost,initial=race.nativeLaunch.snapshot(),expected=update(initial),read=host.world.beforeFrame;
  let calls=0;
  host.world.beforeFrame=(world,context)=>{
   read(world,context);const actual=race.nativeLaunch.snapshot();calls++;
   assert.equal(world.frames,0);assert.equal(world.ticks,0);
   for(const op of expected.operations)assert.equal(actual.scene[op.field]>>>0,op.value,op.field);
   assert.equal(index(actual.scene.graphicsPointerE948),selector);
   assert.equal(actual.graphicsCorners.renderBufferIndex,selector^1,'AI/actor buffer runs its independent46D2C stage');
  };
  stepNativeRaceHost(host,1,[{}],{active:false});assert.equal(calls,0);
  stepNativeRaceHost(host,.009,[{}]);assert.equal(calls,0);
  stepNativeRaceHost(host,.041,[{}]);assert.equal(calls,1);
  const actual=race.nativeLaunch.snapshot();
  assert.equal(actual.scene.graphicsFrame4b04,-2147483648);assert.equal(actual.scene.graphicsLatch4b08,0);
  assert.equal(actual.scene.matrixCountE950,0);assert.equal(actual.scene.graphicsSelector4b0c,selector^1);
  assert.equal(actual.scene.ambientD4b00,activity624===-1?-2147483648:2147483647);
  assert.equal(host.world.ticks,simulation648?5:0);
 }
});
