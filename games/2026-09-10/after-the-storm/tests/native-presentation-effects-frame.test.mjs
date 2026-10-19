import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativePresentationEffectsFrame as prepare} from '../native-presentation-effects-frame.js';
import {structuredEffectBodies} from './helpers/native-effect-body-fields.mjs';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationEffectsFrameUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-effects-frame.json.gz',import.meta.url))));
const input=c=>({...structuredClone(c.input),angleTableWords6f08:evidence.angleTableWords6f08,sineTableWords4350:evidence.sineTableWords4350,queryNative:()=>c.input.waterValue});
const hash=b=>createHash('sha256').update(b).digest('hex');
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return hash(b);}
const off=a=>(a-0x790)/4;

test('complete original scene-effects parent matches every write, query, clock boundary and both vertex buffers',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(c.input),q=prepare(a);
  const mismatch=q.operations.findIndex((o,j)=>JSON.stringify(o)!==JSON.stringify(c.operations[j]));
  assert.equal(mismatch,-1,JSON.stringify({case:i,index:mismatch,actual:q.operations[mismatch],expected:c.operations[mismatch]}));
  assert.equal(q.operations.length,c.operations.length,'operation count case '+i);
  assert.deepEqual(prepare(structuredEffectBodies(input(c))),q,'structured physical fields case '+i);
  assert.equal(digest(q.effectWords0790),c.effectSHA256,'effect hash case '+i);assert.deepEqual(q.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.seed6f00,c.seed6f00);
  assert.deepEqual(q.diagnostic.queries,c.queries);assert.deepEqual(q.diagnostic.queryOffsets,c.queryOffsets);assert.deepEqual(q.diagnostic.clockOffsets,c.clockOffsets);
  const gfx=c.baseGraphicsBytes.map(v=>Buffer.from(v));
  for(const o of q.operations)if(o.kind==='presentationEffectVertexWrite'){if(o.width===1)gfx[o.bufferIndex].writeUInt8(o.value,o.byteOffset);else gfx[o.bufferIndex].writeUInt16BE(o.value,o.byteOffset);}
  assert.deepEqual(gfx.map(hash),c.graphicsSHA256,'graphics hash case '+i);
  for(const k of Object.keys(before))assert.deepEqual(a[k],before[k]);
 }
});

test('held gameplay still ages wake geometry and transients, without evolving spray',()=>{
 const c=evidence.cases.find(c=>c.input.activity624===0&&c.input.effectWords0790[0]>0),a=input(c),q=prepare(a),count=a.effectWords0790[0];
 assert.equal(q.diagnostic.stages.filter(s=>s.name==='spray').length,0);assert.equal(q.diagnostic.stages.filter(s=>s.name==='geometry').length,count);
 for(let slot=0;slot<count;slot++){
  const entry=0x798+slot*0x1c74;
  for(let row=0;row<8;row++)assert.equal(q.effectWords0790[off(entry+0x1aa0+row*48+0x28)],(a.effectWords0790[off(entry+0x1aa0+row*48+0x28)]+1)>>>0);
  for(let row=0;row<64;row++)assert.equal(q.effectWords0790[off(entry+row*64+0x3c)],a.effectWords0790[off(entry+row*64+0x3c)]);
 }
 assert.equal(q.diagnostic.stages.at(-1).name,'transients');assert.notEqual(q.seed6f00,a.seed6f00);
});

test('twenty successive original frames carry particle, control, random and vertex state forward',()=>{
 let previous,gfx;
 for(const c of evidence.cases.slice(64)){
  const a=input(c);
  if(previous){
   assert.deepEqual(a.effectWords0790,previous.effectWords0790);assert.deepEqual(a.effectControlWords6d60,previous.effectControlWords6d60);assert.equal(a.seed6f00,previous.seed6f00);
   assert.deepEqual(gfx.map(v=>[...v]),c.baseGraphicsBytes);
   a.effectWords0790=previous.effectWords0790;a.effectControlWords6d60=previous.effectControlWords6d60;a.seed6f00=previous.seed6f00;
  }else gfx=c.baseGraphicsBytes.map(v=>Buffer.from(v));
  previous=prepare(a);
  for(const o of previous.operations)if(o.kind==='presentationEffectVertexWrite'){if(o.width===1)gfx[o.bufferIndex].writeUInt8(o.value,o.byteOffset);else gfx[o.bufferIndex].writeUInt16BE(o.value,o.byteOffset);}
  assert.equal(digest(previous.effectWords0790),c.effectSHA256);assert.deepEqual(gfx.map(hash),c.graphicsSHA256);
 }
});

test('64-bit timing subtraction, carries and maximum tracking match original unsigned wrap',()=>{
 const u=(a,o)=>(BigInt(a[off(o)])<<32n)|BigInt(a[off(o+4)]),mask=(1n<<64n)-1n;
 for(const c of evidence.cases){
  const a=input(c),q=prepare(a),start=(BigInt(a.clockStartWords[0])<<32n)|BigInt(a.clockStartWords[1]),end=(BigInt(a.clockEndWords[0])<<32n)|BigInt(a.clockEndWords[1]),d=(end-start)&mask;
  assert.equal(u(q.effectWords0790,0x7b18),d);assert.equal(u(q.effectWords0790,0x7b28),(u(a.effectWords0790,0x7b28)+d)&mask);
  assert.equal(u(q.effectWords0790,0x7b30),(u(a.effectWords0790,0x7b30)+1n)&mask);const max=u(a.effectWords0790,0x7b20);assert.equal(u(q.effectWords0790,0x7b20),d>max?d:max);
 }
});

test('a later participant water failure leaves all caller owners untouched',()=>{
 const c=evidence.cases.find(c=>c.input.racerCount===4&&c.input.activity624===-1),a=input(c),before=structuredClone(c.input);let calls=0;
 a.queryNative=()=>{if(++calls===3)throw new Error('missing later plane');return c.input.waterValue;};
 assert.throws(()=>prepare(a),/missing later plane/);assert.equal(calls,3);for(const k of Object.keys(before))assert.deepEqual(a[k],before[k]);
});

test('canonical frame derives owners and scene fields while forwarding only semantic vertex effects',()=>{
 const c=evidence.cases.find(c=>c.input.players===1&&c.input.activity624===-1&&c.input.racerCount===4),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:Array.from({length:a.racerCount},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:0,players:a.players,mode620:4}));
 for(const k of ['effectWords0790','effectControlWords6d60','actorWordsF060','hudWords7788'])state[k]=a[k];
 for(const k of ['main638','activity624','primaryHumanIndex','secondaryHumanIndex','displayCamera3930','displayCamera3934','seed6f00'])state.scene[k]=a[k];
 state.scene.ambientD4b00=a.frameCounter;state.scene.graphicsPointerE948=(0x80198368+a.bufferIndex*0xb2f0)|0;state.graphicsCorners.renderBufferIndex=a.bufferIndex^1;
 a.record2f4BySlot.forEach((v,s)=>state.raceWords1f94[(0x2938+s*0x378+0x2f4-0x1f94)/4]=v>>>0);const before=structuredClone(state);
 const q=update(state,{...a,effectWords0790:null,effectControlWords6d60:null,actorWordsF060:null,hudWords7788:null,players:2,activity624:0,seed6f00:999,record2f4BySlot:null,displayCamera3930:99,displayCamera3934:99});
 assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.deepEqual(q.state.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.state.scene.seed6f00,c.seed6f00);
 assert.deepEqual(update(state,structuredEffectBodies(a)),q,'canonical structured physical fields');
 assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='presentationEffectVertexWrite'));assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.state.effectWords0790));
 delete state.scene.displayCamera3934;const missing=structuredClone(state);assert.throws(()=>update(state,a),/second effect camera/);assert.deepEqual(state,missing);
});
