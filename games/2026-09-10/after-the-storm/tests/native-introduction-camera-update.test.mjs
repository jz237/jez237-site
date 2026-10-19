import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeIntroductionCameraUpdate as prepare} from '../native-introduction-camera-update.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeIntroductionCameraFrameUpdate as update} from '../native-race-state.js';
import {createNativeRaceCameraStorage} from '../native-race-camera-storage.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-introduction-camera-update.json.gz',import.meta.url))));
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4;
function input(c){const hud=[...evidence.baseHud],pool=[...evidence.basePool];for(const [i,w]of c.input.hudOverrides)hud[i]=w;for(const [i,w]of c.input.actorOverrides)pool[i]=w;return {...c.input,hudWords7788:hud,actorWordsF060:pool};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
function stateFor(a){
 const state=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:a.courseIndex,players:a.players,mode620:4}));
 Object.assign(state.scene,{main638:8,rngState4640:a.rngState4640,primaryHumanIndex:a.primaryHumanIndex,secondaryHumanIndex:a.secondaryHumanIndex});
 for(const k of ['hudWords7788','actorWordsF060','actorControlWords62c4','cameraEnvironmentBytesEaa4'])state[k]=[...a[k]];
 state.profileWordsB330[2]=a.difficulty;state.profileWordsB330.splice(4,4,7,4,2,1);
 a.racerRecordWordsBySlot.forEach((r,slot)=>r.forEach((w,j)=>state.raceWords1f94[ri(0x2938+slot*0x378+[0,4,0xc,0x2f4][j])]=w));
 return state;
}

test('complete introduction camera frames match original ordered writes and retained state across all courses',()=>{
 assert.equal(evidence.cases.length,2602);assert.equal(evidence.sequences,44);
 for(const [i,c]of evidence.cases.entries()){
  const a=input(c),q=prepare(a);
  assert.deepEqual(q.operations,c.operations,'case '+i);assert.equal(digest(q.hudWords7788),c.hudSHA256,'HUD case '+i);
  assert.equal(digest(q.actorWordsF060),c.actorSHA256,'actors case '+i);
  assert.deepEqual(q.actorControlWords62c4,c.actorControlWords62c4);assert.equal(q.rngState4640,c.rngState4640);
  assert.deepEqual(q.cameraEnvironmentBytesEaa4,c.cameraEnvironmentBytesEaa4);
 }
});

test('canonical frame consumes actor writes and preserves cup records, using actual retained camera and scene owners',()=>{
 const seen=new Set();
 for(const c of evidence.cases){
  const key=[c.input.courseIndex,c.input.difficulty,c.input.players,c.input.bufferIndex].join('/');if(seen.has(key))continue;seen.add(key);
  const a=input(c),state=stateFor(a),before=structuredClone(state),q=update(state,{...a,main638:9,players:8,courseIndex:99,difficulty:99,
   hudWords7788:[],actorWordsF060:[],actorControlWords62c4:[],cameraEnvironmentBytesEaa4:[],rngState4640:0,racerRecordWordsBySlot:[]});
  assert.deepEqual(q.operations,c.operations,key);assert.equal(digest(q.state.hudWords7788),c.hudSHA256,key);
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256,key);assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);
  assert.equal(q.state.scene.rngState4640,c.rngState4640);assert.deepEqual(q.state.cameraEnvironmentBytesEaa4,c.cameraEnvironmentBytesEaa4);
  assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);
  assert.deepEqual(q.effects,Array.from({length:a.players},(_,cameraIndex)=>({kind:'cameraMatrixRequest',bufferIndex:a.bufferIndex,cameraIndex})));
  assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.state.actorWordsF060));
 }
 assert.equal(seen.size,44);
});

test('invalid later camera or Sunset source vertex cannot commit a partial introduction frame',()=>{
 const a=input(evidence.cases.find(c=>c.input.players===2)),state=stateFor(a);
 state.hudWords7788[hi(0x7d8c)]=1;let before=structuredClone(state);
 assert.throws(()=>update(state,a),/type6/);assert.deepEqual(state,before);
 const c=evidence.cases.find(c=>c.input.courseIndex===2&&c.operations.some(o=>o.kind==='presentationActorControlWrite'&&o.byteOffset===0));
 const sunset=input(c),s=stateFor(sunset);before=structuredClone(s);
 assert.throws(()=>update(s,{...sunset,selectedWaterVertexXZ:[]}),/water vertex/);assert.deepEqual(s,before);
});

test('introduction lens values reach the camera view while ordinary follow views retain their own projection',()=>{
 const state=stateFor(input(evidence.cases[0])),view={eyeNative:[1,2,3],forward:[0,0,1],up:[0,1,0],targetNative:[1,2,4],horizontalForward:[0,1],fovDegrees:61,nearNative:12,projectionOffset:[.1,.2]};
 const storage=createNativeRaceCameraStorage({players:1,readState:()=>state,commit:ops=>ops.forEach(o=>state.hudWords7788[o.byteOffset/4]=o.value)});
 storage.write([view]);const b=new DataView(new ArrayBuffer(4)),word=v=>{b.setFloat32(0,v);return b.getUint32(0);};
 for(const [o,v]of [[0x88,45],[0x9c,7],[0x94,.25],[0x98,-.5]])state.hudWords7788[hi(0x7c80+o)]=word(v);
 for(const type of [1,6]){state.hudWords7788[hi(0x7c80)]=type;const q=storage.read()[0];assert.equal(q.fovDegrees,45);assert.equal(q.nearNative,7);assert.deepEqual(q.projectionOffset,[.25,-.5]);}
 state.hudWords7788[hi(0x7c80)]=3;const q=storage.read()[0];assert.equal(q.fovDegrees,61);assert.equal(q.nearNative,12);assert.deepEqual(q.projectionOffset,view.projectionOffset.map(Math.fround));
});
