import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeMenuCameraInitialization as prepare,NATIVE_MENU_CAMERA_DATA as data} from '../native-menu-camera-initialization.js';
import {nativeWaterCameraBasis} from '../native-water-schedule.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-menu-camera-initialization.json',import.meta.url)));
const hi=a=>(a-0x7788)/4,b=new DataView(new ArrayBuffer(4)),float=w=>{b.setUint32(0,w);return b.getFloat32(0);};
test('menu camera setup matches every original numeric write and graphics request',()=>{
 assert.deepEqual(data,source.sourceNumericData);
 for(const {input,operations,hudWords7788}of source.cases){
  const before=structuredClone(input),q=prepare(input);
  assert.deepEqual(q.operations,operations);assert.deepEqual(q.hudWords7788,hudWords7788);assert.deepEqual(input,before);
  assert.equal(q.diagnostic.graphicsExecuted,false);assert.ok(Object.isFrozen(q.hudWords7788));
 }
});
test('initialized canonical menu cameras supply the water basis without a race-follow snapshot',()=>{
 for(const {input}of source.cases){
  const q=prepare(input),h=q.hudWords7788;
  for(let i=0;i<input.players;i++){
   const c=0x7c80+i*0x10c,f=o=>float(h[hi(c+o)]),v=o=>[f(o),f(o+4),f(o+8)];
   const camera=nativeWaterCameraBasis({eyeNative:v(0x4c),targetNative:v(0x7c),up:input.type1Template5a84.slice(6,9),
    fovDegrees:f(0x88),nearNative:f(0x9c),projectionOffset:[f(0x94),f(0x98)]});
   assert.deepEqual(camera.forward,v(0x64));assert.deepEqual(camera.up,v(0x70));
   assert.deepEqual(camera.horizontalForward,[f(0xf0),f(0xf4)]);
   assert.equal(float(h[hi(0x8108)]),Math.fround(input.datumNative));
  }
 }
});
test('invalid or late unsupported menu cameras cannot partly change caller storage',()=>{
 const input=structuredClone(source.cases.find(c=>c.input.players===2).input),before=structuredClone(input);
 input.hudWords7788[hi(0x7d8c)]=5;const invalid=structuredClone(input);
 assert.throws(()=>prepare(input),/type1/);assert.deepEqual(input,invalid);
 input.hudWords7788=before.hudWords7788;
 input.type1Template5a84[3]=input.type1Template5a84[0];input.type1Template5a84[4]=input.type1Template5a84[1];input.type1Template5a84[5]=input.type1Template5a84[2];
 const degenerate=structuredClone(input);assert.throws(()=>prepare(input),/Degenerate/);assert.deepEqual(input,degenerate);
 assert.throws(()=>prepare({...before,datumNative:1.5}),/signed water/);
});
