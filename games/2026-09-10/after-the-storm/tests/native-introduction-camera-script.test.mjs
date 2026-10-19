import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeIntroductionCameraScript as script} from '../native-introduction-camera-script.js';
import {NATIVE_INTRODUCTION_CAMERA_SCRIPTS as data} from '../native-introduction-camera-data.js';
import {prepareNativeIntroductionCameraScriptUpdate as update} from '../native-race-state.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-introduction-camera-scripts.json',import.meta.url)));
const hi=a=>(a-0x7788)/4;
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
function initial(cameraIndex=0,scriptAddress=data.scriptAddresses[0]){
 const hud=[...source.baseHud],s=0x8058+cameraIndex*0x38;hud[hi(s+4)]=scriptAddress;hud[hi(s+8)]=0;return hud;
}
test('all eleven complete introduction scripts match original callbacks, ordered writes and every frame hash',()=>{
 assert.equal(source.sequences.length,22);assert.equal(source.sequences.reduce((n,s)=>n+s.frames.length,0),5160);
 const reached=new Set();
 for(const sequence of source.sequences){
  let hud=initial(sequence.cameraIndex,sequence.scriptAddress);
  for(const [frame,expected]of sequence.frames.entries()){
   const q=script({hudWords7788:hud,cameraIndex:sequence.cameraIndex}),label=`script ${sequence.scriptAddress.toString(16)} camera ${sequence.cameraIndex} frame ${frame}`;
   assert.deepEqual(q.operations,expected.operations,label);assert.equal(digest(q.hudWords7788),expected.hudSHA256,label);
   q.callbacks.forEach(c=>reached.add(c.consumer));hud=q.hudWords7788;
  }
 }
 assert.deepEqual([...reached].sort(),['801dfdf0','801dfe10','801dfe58','801dff5c','801e01cc','801e0218','801e0264','801e02b4']);
});
test('zero-duration setup and the first timed sample share one frame, with independent camera slots',()=>{
 const hud=initial(),before=[...hud],q=script({hudWords7788:hud});
 assert.deepEqual(q.callbacks.map(c=>c.consumer),['801dfe58','801dfdf0','801e0264']);
 assert.equal(q.hudWords7788[hi(0x8060)],1);assert.deepEqual(hud,before);
 for(const [start,count]of [[0x7f78,56],[0x8090,14],[0x80e8,8]])assert.deepEqual(q.hudWords7788.slice(hi(start),hi(start)+count),before.slice(hi(start),hi(start)+count));
 assert.ok(Object.isFrozen(q.hudWords7788));assert.equal(q.diagnostic.cameraSmoothed,false);
});
test('source hold and stop sentinels preserve exact counter semantics, including signed wrap',()=>{
 const hud=initial(),cursor=0x80223a54;hud[hi(0x805c)]=cursor;hud[hi(0x8060)]=0x7fffffff;
 let q=script({hudWords7788:hud});assert.equal(q.hudWords7788[hi(0x8060)],0x80000000);assert.equal(q.hudWords7788[hi(0x805c)],cursor);
 const resources={...data,commands:{...data.commands,[cursor]:{duration:-1,consumer:null,argument:0}}};
 q=script({hudWords7788:q.hudWords7788,resources});assert.equal(q.hudWords7788[hi(0x8060)],0);assert.equal(q.hudWords7788[hi(0x805c)],0);
 assert.deepEqual(script({hudWords7788:q.hudWords7788}).operations,[]);
});
test('canonical script phase preserves race, championship and water owners and fails atomically on missing late data',()=>{
 const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:1,players:1,mode620:0}));
 state.scene.main638=8;state.hudWords7788=initial();state.profileWordsB330.splice(4,4,7,4,2,1);
 const before=structuredClone(state),q=update(state);
 assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.state.scene,state.scene);assert.deepEqual(q.effects,[]);
 assert.deepEqual(state,before);
 // Template and path resets would precede this missing final FOV descriptor.
 const paths={...data.paths};delete paths[0x802239fc+0x28];
 assert.throws(()=>update(state,{resources:{...data,paths}}),/path descriptor/);assert.deepEqual(state,before);
 const hud=initial();hud[hi(0x8058)]=0;const invalid=[...hud];assert.throws(()=>script({hudWords7788:hud}),/owner address/);assert.deepEqual(hud,invalid);
});
