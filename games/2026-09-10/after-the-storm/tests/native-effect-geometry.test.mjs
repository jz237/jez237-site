import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeEffectGeometry as prepare} from '../native-effect-geometry.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeEffectGeometryUpdate as update} from '../native-race-state.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-effect-geometry.json.gz',import.meta.url))));
const off=a=>(a-0x790)/4;
function input(c){const effectWords0790=[...evidence.baseEffectWords];for(const [i,w]of c.input.effectOverrides)effectWords0790[i]=w;return {...c.input,effectWords0790,hudWords7788:evidence.hudWords7788};}
const hash=b=>createHash('sha256').update(b).digest('hex');
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return hash(b);}

test('complete effect geometry matches original vertex/store order, retained owners and both full graphics buffers',()=>{
 assert.equal(evidence.cases.length,96);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a),buffers=[Buffer.from(evidence.baseGraphicsBytes),Buffer.from(evidence.baseGraphicsBytes)];
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.effectWords0790),c.effectSHA256,'case '+i);
  assert.deepEqual(q.effectControlWords6d60,c.effectControlWords6d60,'case '+i);
  for(const o of q.operations.filter(o=>o.kind==='presentationEffectVertexWrite')){const b=buffers[o.bufferIndex];if(o.width===1)b.writeUInt8(o.value,o.byteOffset);else b.writeUInt16BE(o.value,o.byteOffset);}
  assert.deepEqual(buffers.map(hash),c.graphicsSHA256,'case '+i);assert.deepEqual(a,before);
 }
});

test('inactive particles preserve vertex bytes and need no camera, while wake history still advances',()=>{
 const a=input(evidence.cases[0]);delete a.hudWords7788;const q=prepare(a),vertices=q.operations.filter(o=>o.kind==='presentationEffectVertexWrite');
 assert.equal(q.diagnostic.triangles,0);assert.equal(q.diagnostic.sharedTriangles,0);assert.equal(vertices.length,64);
 assert.ok(vertices.every(o=>o.byteOffset>=0x91c0&&o.byteOffset<0x92c0));
 for(let i=0;i<8;i++){const n=off(0x798+0x1aa0+i*48+0x28);assert.equal(q.effectWords0790[n],(a.effectWords0790[n]+1)>>>0);}
});

test('late invalid history and selected camera pointers fail without modifying input owners',()=>{
 const a=input(evidence.cases[0]);a.effectControlWords6d60=[...a.effectControlWords6d60];a.effectControlWords6d60[8]=0x801d7b68;
 const before=structuredClone(a);assert.throws(()=>prepare(a),/storage offset/);assert.deepEqual(a,before);
 const active=input(evidence.cases[2]);active.effectWords0790[off(0x796c)]=0x80227c84;const saved=structuredClone(active);
 assert.throws(()=>prepare(active),/camera pointer/);assert.deepEqual(active,saved);
});

test('canonical geometry uses retained controls, HUD cameras and selected graphics buffer without touching physical or score owners',()=>{
 const c=evidence.cases.find(c=>c.input.racerIndex===2&&c.input.players===1&&c.input.bufferIndex===1&&c.operations.some(o=>o.kind==='presentationEffectVertexWrite'&&o.byteOffset<0x81c0)),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:Array.from({length:a.racerCount},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:0,players:a.players,mode620:4}));
 state.effectWords0790=a.effectWords0790;state.effectControlWords6d60=a.effectControlWords6d60;state.hudWords7788=a.hudWords7788;
 state.scene.primaryHumanIndex=a.primaryHumanIndex;state.scene.graphicsPointerE948=(0x80198368+a.bufferIndex*0xb2f0)|0;state.graphicsCorners={...state.graphicsCorners,renderBufferIndex:a.bufferIndex^1};
 const before=structuredClone(state),q=update(state,{racerIndex:a.racerIndex,players:2,bufferIndex:0,effectWords0790:null,hudWords7788:null});
 assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.deepEqual(q.state.effectControlWords6d60,c.effectControlWords6d60);
 assert.deepEqual(q.effects,q.operations.filter(o=>o.kind==='presentationEffectVertexWrite'));
 for(const k of Object.keys(state))if(!['effectWords0790','effectControlWords6d60'].includes(k))assert.deepEqual(q.state[k],state[k],k);
 assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.state.effectWords0790));
});
