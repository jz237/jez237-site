import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeBodyWrap as prepare,prepareNativeBodyWrapCamera} from '../native-body-wrap.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeRaceBodyWrap as update,prepareNativeRaceStateOperations as commit} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-body-wrap.json.gz',import.meta.url))));
const input=c=>{const bodyWords=[...evidence.baseBodyWords];for(const [i,w]of c.input.bodyOverrides)bodyWords[i]=w;return {...structuredClone(c.input),bodyWords,hudWords7788:[...evidence.baseHudWords]};};
const hash=words=>{const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');};

test('complete boundary stage matches original body and selected-camera stores in order',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(hash(q.bodyWords),c.bodySHA256);assert.equal(hash(q.hudWords7788),c.hudSHA256);assert.deepEqual(a,before);
  const camera=prepareNativeBodyWrapCamera({...a,driftNative:q.driftNative});
  assert.deepEqual(camera.operations,c.operations.filter(o=>o.kind==='hudWrite'));assert.equal(hash(camera.hudWords7788),c.hudSHA256);
 }
});

test('wrapping moves current and previous positions together without inventing frame displacement',()=>{
 const a=input(evidence.cases.find(c=>c.input.racerIndex===0&&c.input.primaryHumanIndex===0&&c.input.bodyOverrides.some(([i,w])=>i===0x44/4&&w===0xc2ca0000))),q=prepare(a);
 assert.deepEqual(q.driftNative,{x:201,z:101});
 for(const at of [0xb78,0xb7c,0xb80,0x50,0x54,0x58])assert.equal(q.bodyWords[at/4],a.bodyWords[at/4]);
 assert.notEqual(q.bodyWords[0x44/4],a.bodyWords[0x44/4]);assert.notEqual(q.bodyWords[0xbe4/4],a.bodyWords[0xbe4/4]);
 assert.equal(q.diagnostic.remainingPhysicalWorkExecuted,false);assert.ok(Object.isFrozen(q.hudWords7788));
});

test('unused camera selectors stay lazy; a late body failure cannot commit the earlier HUD shift',()=>{
 const cpu=input(evidence.cases.find(c=>c.input.players===1&&c.input.racerIndex!==c.input.primaryHumanIndex));delete cpu.displayCamera3930;delete cpu.displayCamera3934;delete cpu.secondaryHumanIndex;
 assert.equal(prepare(cpu).diagnostic.cameraIndex,null);
 const a=input(evidence.cases.find(c=>c.input.racerIndex===c.input.primaryHumanIndex));a.bodyWords[(0x1198+3*0x24+8)/4]=0x7fc00000;const before=structuredClone(a);
 assert.throws(()=>prepare(a),/Nonfinite/);assert.deepEqual(a,before);
});

test('canonical wrapper derives actual camera owners and returns validated physical writes without changing race records',()=>{
 const c=evidence.cases.find(c=>c.input.racerIndex===c.input.primaryHumanIndex),a=input(c),state=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:0,players:a.players,mode620:4}));
 state.hudWords7788=a.hudWords7788;for(const key of ['players','primaryHumanIndex','secondaryHumanIndex','displayCamera3930','displayCamera3934'])state.scene[key]=a[key];
 const before=structuredClone(state),q=update(state,{...a,hudWords7788:null,players:2,primaryHumanIndex:99,displayCamera3930:99,displayCamera3934:99});
 assert.equal(hash(q.bodyWords),c.bodySHA256);assert.equal(hash(q.state.hudWords7788),c.hudSHA256);assert.deepEqual({...q.state,hudWords7788:state.hudWords7788},state);
 assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='bodyWordWrite'));assert.deepEqual(state,before);
 for(const bad of [
  {kind:'bodyWordWrite',racerIndex:4,byteOffset:0,width:4,value:0},
  {kind:'bodyWordWrite',racerIndex:0,byteOffset:1,width:4,value:0},
  {kind:'bodyWordWrite',racerIndex:0,byteOffset:0x1718,width:4,value:0},
  {kind:'bodyWordWrite',racerIndex:0,byteOffset:0,width:2,value:0}
 ]){assert.throws(()=>commit(state,[{kind:'hudWrite',byteOffset:0,width:4,value:9},bad]));assert.deepEqual(state,before);}
});
