import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeSprayUpdate as prepare} from '../native-spray-update.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeSprayUpdateState as update} from '../native-race-state.js';
import {prepareNativeSprayLevels} from '../native-spray-levels.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-spray-update.json.gz',import.meta.url))));
function input(c){const effectWords0790=[...evidence.baseEffectWords];for(const [i,w]of c.input.effectOverrides)effectWords0790[i]=w;return {...c.input,effectWords0790,hudWords7788:evidence.hudWords7788,angleTableWords6f08:evidence.angleTableWords6f08,sineTableWords4350:evidence.sineTableWords4350};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
const off=a=>(a-0x790)/4,b=new DataView(new ArrayBuffer(4)),number=w=>{b.setUint32(0,w);return b.getFloat32(0);};

test('whole original spray update matches ordered owner/RNG writes and retained state',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),before=structuredClone(a),q=prepare(a);
  const mismatch=q.operations.findIndex((o,j)=>JSON.stringify(o)!==JSON.stringify(c.operations[j]));
  assert.equal(mismatch,-1,JSON.stringify({case:i,index:mismatch,actual:q.operations[mismatch],expected:c.operations[mismatch]}));
  assert.equal(q.operations.length,c.operations.length,'operation count case '+i);
  assert.equal(digest(q.effectWords0790),c.effectSHA256,'effect hash case '+i);assert.deepEqual(q.effectControlWords6d60,c.effectControlWords6d60,'controls case '+i);assert.equal(q.seed6f00,c.seed6f00,'seed case '+i);assert.deepEqual(a,before);
 }
});

test('existing scalar audio results agree with complete particle updates using the same retained source inputs',()=>{
 for(const c of evidence.cases){
  const a=input(c),p=a.effectWords0790,entry=0x798+a.racerIndex*0x1c74,f=o=>number(p[off(o)]),v=o=>Object.fromEntries(['x','y','z'].map((k,j)=>[k,f(o+j*4)])),previous={};
  for(const [name,o]of Object.entries({wet:0x1c2c,dryFrames:0x1c3c,cooldown:0x1c40,left:0x1c5c,right:0x1c60}))previous[name]=p[off(entry+o)]|0;
  for(const [name,o]of Object.entries({intensity:0x1c64,previousSpeed:0x1c68,previousVertical:0x1c70}))previous[name]=f(entry+o);
  const scalar=prepareNativeSprayLevels(previous,{racerIndex:a.racerIndex,primaryIndex:a.primaryHumanIndex,secondaryIndex:a.secondaryHumanIndex,players:a.players,scene638:a.main638,
   extraRacer:p[off(0x7a08)]|0,racerCount:a.racerCount,frameCounter:a.frameCounter,record2f4:a.record2f4,special:p[off(entry+0x1c54)]|0,
   position:v(0x79bc),velocity:v(0x79c8),forward:v(0x79e0),cameraEye:{x:0,y:0,z:0},cameraForward:v(0x7974),speed:f(0x79d4),lateral:f(0x79d8),referenceMotion:f(0x79dc),water:f(0x7a00)}),q=prepare(a);
  for(const [name,o]of Object.entries({wet:0x1c2c,dryFrames:0x1c3c,cooldown:0x1c40,left:0x1c5c,right:0x1c60}))assert.equal(q.effectWords0790[off(entry+o)]|0,scalar[name],name);
  for(const [name,o]of Object.entries({intensity:0x1c64,previousSpeed:0x1c68,previousVertical:0x1c70}))assert.equal(number(q.effectWords0790[off(entry+o)]),scalar[name],name);
 }
});

test('failed late sine lookup preserves all caller owners after earlier motion and random draws',()=>{
 const c=evidence.cases.find(c=>c.input.players===1&&c.input.racerIndex===c.input.primaryHumanIndex&&c.operations.filter(o=>o.kind==='sourceHalfwordWrite').length>20),a=input(c);
 delete a.sineTableWords4350;const before=structuredClone(a);assert.throws(()=>prepare(a),/sineTableWords/);assert.deepEqual(a,before);
});

test('canonical full spray update uses actual scene, score record, body halfword, camera and separate random owner',()=>{
 const c=evidence.cases.find(c=>c.input.players===1&&c.input.racerIndex===0&&c.operations.filter(o=>o.kind==='sourceHalfwordWrite').length>20),a=input(c);
 const state=structuredClone(createNativeRaceMemory({racers:Array.from({length:a.racerCount},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:0,players:a.players,mode620:4}));
 state.effectWords0790=a.effectWords0790;state.effectControlWords6d60=a.effectControlWords6d60;state.hudWords7788=a.hudWords7788;
 Object.assign(state.scene,{main638:a.main638,primaryHumanIndex:a.primaryHumanIndex,secondaryHumanIndex:a.secondaryHumanIndex,ambientD4b00:a.frameCounter,seed6f00:a.seed6f00});
 state.raceWords1f94[(0x2938+a.racerIndex*0x378+0x2f4-0x1f94)/4]=a.record2f4>>>0;
 const body=Array(1478).fill(0);body[0xc64/4]=(0xabcd0000|a.bodyC66)>>>0;const bodies=[];bodies[a.racerIndex]=body;const before=structuredClone(state);
 const q=update(state,{...a,bodyWordsBySlot:bodies,effectWords0790:null,effectControlWords6d60:null,hudWords7788:null,seed6f00:999,record2f4:99,players:2,main638:0});
 assert.equal(digest(q.state.effectWords0790),c.effectSHA256);assert.deepEqual(q.state.effectControlWords6d60,c.effectControlWords6d60);assert.equal(q.state.scene.seed6f00,c.seed6f00);assert.deepEqual(q.effects,[]);
 const fields=[];fields[a.racerIndex]={engineMaskC66:a.bodyC66};
 assert.deepEqual(update(state,{...a,bodyFieldsBySlot:fields}),q,'spray reads only the actual structured engine halfword');
 for(const k of Object.keys(state))if(!['effectWords0790','effectControlWords6d60','scene'].includes(k))assert.deepEqual(q.state[k],state[k],k);
 assert.deepEqual({...q.state.scene,seed6f00:a.seed6f00},state.scene);assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.state.effectWords0790));
 assert.throws(()=>update(state,{...a,bodyWordsBySlot:bodies,sineTableWords4350:undefined}),/sineTableWords/);assert.deepEqual(state,before);
});
