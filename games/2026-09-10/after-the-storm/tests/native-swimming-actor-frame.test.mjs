import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeCourseActorFrameUpdate as update} from '../native-race-state.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
import {createNativeWaterField} from '../native-water-field.js';
import {loadedAnimationBank} from './helpers/loaded-animation-bank.mjs';
import {createNativePresentationAnimationResources} from '../native-presentation-animation-resource.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-swimming-actor-frame.json.gz',import.meta.url))));
function setup(c,evidence=e){
 const a=c.input,state=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),players:a.players,courseIndex:a.courseIndex,mode620:4}));
 state.actorWordsF060=[...evidence.baseActorWords];for(const [i,w]of a.actorOverrides)state.actorWordsF060[i]=w;
 state.hudWords7788=[...evidence.baseHudWords];state.actorControlWords62c4=[...a.actorControlWords62c4];
 Object.assign(state.scene,{displayCamera3930:a.cameraIndex,activity624:a.activity624,primaryHumanIndex:a.primaryHumanIndex,secondaryHumanIndex:a.secondaryHumanIndex,rngState4640:a.rngState4640});
 if(a.audioScene7c9c!==undefined)state.scene.audioScene7c9c=a.audioScene7c9c;
 if(a.state650!==undefined)state.scene.phase650=a.state650;
 if(a.reverse!==undefined)state.scene.reverseDab68=a.reverse&65535;
 if(a.configuredLaps728!==undefined)state.scene.configuredLaps728=a.configuredLaps728;
 if(a.championshipCountAa00!==undefined)state.scene.championshipCountAa00=a.championshipCountAa00;
 if(a.primaryCount!==undefined)state.scene.primaryCount=a.primaryCount;
 if(a.secondaryCount!==undefined)state.scene.secondaryCount=a.secondaryCount;
 if(a.actorControlWords62d0!==undefined)state.actorControlWords62d0=[...a.actorControlWords62d0];
 if(evidence.resourceWordsE73c)state.resourceWordsE73c=[...evidence.resourceWordsE73c];
 for(let slot=0;slot<4;slot++)for(const [i,o]of [0,4,0xc,0x2f4].entries())state.raceWords1f94[(0x2938+slot*0x378+o-0x1f94)/4]=a.racerRecordWordsBySlot[slot][i];
 return {state,input:{random4562c:1,...a,sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS}};
}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('canonical outer frame executes original swimmer motion with sequential shared RNG and linked targets',()=>{
 assert.equal(e.cases.length,16);assert.equal(e.instructions,24716);let multipleDraws=0;
 for(const [i,c]of e.cases.entries()){
  const {state,input}=setup(c),before=structuredClone(state),callbacks=[];
  const q=update(state,{...input,actorWordsF060:null,hudWords7788:null,courseIndex:99,players:99,activity624:99,cameraIndex:99,rngState4640:99,racerRecordWordsBySlot:null,
   consumeMotion:call=>{assert.equal(call.consumer,'800bf8c8');assert.ok(Object.isFrozen(call.state));callbacks.push(call.consumer);return {operations:[]};}});
  assert.deepEqual(callbacks,[]);assert.deepEqual(q.operations,c.operations,'case '+i);
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  if(q.operations.filter(o=>o.kind==='sourceWordWrite').length>=4)multipleDraws++;
  assert.deepEqual(q.effects,[]);assert.deepEqual(q.state.hudWords7788,state.hudWords7788);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(state,before);
 }
 assert.ok(multipleDraws>0);
});
test('missing reached resources reject atomically, including after earlier swimmers have advanced',()=>{
 const c=e.cases.find(c=>c.input.activity624===-1&&c.operations.filter(o=>o.kind==='sourceWordWrite').length>=4),{state,input}=setup(c);
 assert.throws(()=>update(state,{...input,random4562c:undefined}),/bird audio timing word/);
 state.scene.courseIndex=0;state.actorWordsF060[29*47]=6;state.actorWordsF060[29*47+0xb8/4]=0;const before=structuredClone(state);
 assert.throws(()=>update(state,{...input,audioContext:{audioMode:0}}),/actor root resource words/);
 assert.deepEqual(state,before);
});
test('canonical mixed bird and swimmer frames preserve original sequential motion and random draws',()=>{
 const mixed=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-swimming-bird-frame.json.gz',import.meta.url))));
 assert.equal(mixed.cases.length,16);assert.equal(mixed.instructions,38144);let active=0;
 for(const [i,c]of mixed.cases.entries()){
  const {state,input}=setup(c,mixed),before=structuredClone(state),calls=[];
  const q=update(state,{...input,actorWordsF060:null,courseIndex:8,activity624:0,rngState4640:0,
   consumeMotion:call=>{assert.equal(call.consumer,'800bf8c8');calls.push(call.consumer);return {operations:[]};}});
  assert.deepEqual(calls,[]);assert.deepEqual(q.operations,c.operations,'mixed case '+i);
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(state,before);
  if(c.input.activity624===-1){assert.ok(q.operations.some(o=>o.kind==='presentationActorWrite'&&o.byteOffset>=6*0xbc&&o.byteOffset<12*0xbc));active++;}
 }
 assert.equal(active,8);
});
test('canonical course3 frame carries original takeoff, burst and return updates across twelve birds',()=>{
 const perching=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-perching-bird-frame.json.gz',import.meta.url))));
 assert.equal(perching.cases.length,16);assert.equal(perching.instructions,27103);
 for(const [i,c]of perching.cases.entries()){
  const {state,input}=setup(c,perching),before=structuredClone(state),calls=[];
  const q=update(state,{...input,actorWordsF060:null,courseIndex:1,mode620:11,activity624:0,rngState4640:99,
   consumeMotion:call=>{assert.equal(call.consumer,'800bf8c8');calls.push(call.consumer);return {operations:[]};}});
  assert.deepEqual(calls,[]);assert.deepEqual(q.operations,c.operations,'perching case '+i);
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(state,before);
 }
});
test('course ambience executes at the original frame position and queues each command once',()=>{
 const audio=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-bird-audio-frame.json.gz',import.meta.url))));
 assert.equal(audio.cases.length,16);assert.equal(audio.instructions,25136);let audible=0;
 for(const [i,c]of audio.cases.entries()){
  const {state,input}=setup(c,audio),before=structuredClone(state);
  const q=update(state,input),commands=c.operations.filter(o=>o.kind==='externalCall');
  assert.deepEqual(q.operations,c.operations,'audio frame '+i);assert.deepEqual(q.effects,commands);
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(state,before);
  if(commands.length){assert.equal(commands.length,5);audible++;}
 }
 assert.equal(audible,12);
});
test('dolphin packet bytes and audio context remain independent inside the canonical course frame',()=>{
 const audio=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-audio-frame.json.gz',import.meta.url))));
 assert.equal(audio.cases.length,16);assert.equal(audio.instructions,25532);let audible=0,gated=0;
 for(const [i,c]of audio.cases.entries()){
  const {state,input}=setup(c,audio),before=structuredClone(state),q=update(state,input);
  const commands=c.operations.filter(o=>o.kind==='externalCall');
  assert.deepEqual(q.operations,c.operations,'dolphin audio frame '+i);assert.deepEqual(q.effects,commands);
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(state,before);
  if(commands.length)audible++;else gated++;
 }
 assert.equal(audible,8);assert.equal(gated,8);
});
test('ice actor distance audio reads its retained latch before source swimmer motion',()=>{
 const ice=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-ice-audio-frame.json.gz',import.meta.url))));
 assert.equal(ice.cases.length,16);assert.equal(ice.instructions,25880);
 for(const [i,c]of ice.cases.entries()){
  const {state,input}=setup(c,ice),before=structuredClone(state),q=update(state,{...input,audioScene7c9c:123});
  assert.deepEqual(q.operations,c.operations,'ice frame '+i);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='externalCall'));
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.equal(q.state.scene.audioScene7c9c,c.audioScene7c9c);assert.deepEqual(state,before);
 }
 const c=ice.cases.find(c=>c.input.activity624===-1&&c.operations.some(o=>o.kind==='externalCall')),{state,input}=setup(c,ice);
 state.actorWordsF060[6*47+0xb8/4]=0;state.actorWordsF060[6*47+2]=2;const before=structuredClone(state);
 assert.throws(()=>update(state,input),/ice actor routeWords/);assert.deepEqual(state,before);
});

test('complete ice course frame shares group movement, water reads and audio state in original order',()=>{
 const ice=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-ice-motion-frame.json.gz',import.meta.url))));
 assert.equal(ice.cases.length,16);assert.equal(ice.instructions,42564);
 for(const [i,c]of ice.cases.entries()){
  const {state,input}=setup(c,ice),before=structuredClone(state),waterField=createNativeWaterField({datumNative:c.input.waterDatumNative});
  waterField.heightQ.forEach((_,j)=>waterField.heightQ[j]=c.input.waterPattern?((j*7919+37)%20001)-10000:768);
  const waterBefore=structuredClone(waterField);
  const q=update(state,{...input,routeWords:ice.routeWords,waterField,audioScene7c9c:123,rngState4640:123,actorWordsF060:null});
  assert.deepEqual(q.operations,c.operations,'ice motion frame '+i);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='externalCall'));
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.equal(q.state.scene.audioScene7c9c,c.audioScene7c9c);assert.deepEqual(state,before);assert.deepEqual(waterField,waterBefore);
 }
});

test('complete special course frames retain canonical phase, control clock and shared audio ownership',()=>{
 const special=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-special-course-actor-frame.json.gz',import.meta.url))));
 assert.equal(special.cases.length,32);assert.equal(special.instructions,71210);
 for(const [i,c]of special.cases.entries()){
  const {state,input}=setup(c,special),before=structuredClone(state),waterField=createNativeWaterField({datumNative:c.input.waterDatumNative});
  waterField.heightQ.forEach((_,j)=>waterField.heightQ[j]=c.input.waterPattern?((j*7919+37)%20001)-10000:768);
  const waterBefore=structuredClone(waterField);
  const q=update(state,{...input,routeWords:special.routeWords,waterField,audioScene7c9c:123,state650:99,activity624:99,reverse:99,actorControlWords62c4:null,actorWordsF060:null,hudWords7788:null,cameraIndex:99});
  assert.deepEqual(q.operations,c.operations,'special frame '+i);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='externalCall'));
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.equal(q.state.scene.audioScene7c9c,c.audioScene7c9c);
  assert.deepEqual(state,before);assert.deepEqual(waterField,waterBefore);
 }
 const c=special.cases.find(c=>c.input.courseIndex===5&&c.input.activity624===-1),{state,input}=setup(c,special),before=structuredClone(state);
 assert.throws(()=>update(state,{...input,routeWords:null}),/routeWords/);assert.deepEqual(state,before);
});

test('following course frames observe earlier leader movement and original final-lap transitions',()=>{
 const following=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-following-actor-frame.json.gz',import.meta.url))));
 assert.equal(following.cases.length,32);assert.equal(following.instructions,61880);
 for(const [i,c]of following.cases.entries()){
  const {state,input}=setup(c,following),before=structuredClone(state),waterField=createNativeWaterField({datumNative:c.input.waterDatumNative});
  waterField.heightQ.forEach((_,j)=>waterField.heightQ[j]=c.input.waterPattern?((j*7919+37)%20001)-10000:768);
  const waterBefore=structuredClone(waterField);
  const q=update(state,{...input,routeWords:following.routeWords,waterField,state650:99,activity624:99,configuredLaps728:99,reverse:99,actorControlWords62c4:null,actorWordsF060:null,hudWords7788:null,cameraIndex:99});
  assert.deepEqual(q.operations,c.operations,'following frame '+i);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='externalCall'));
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(state,before);assert.deepEqual(waterField,waterBefore);
 }
});

test('complete dolphin course frames preserve shared scratch, follower unlocks, collisions and sound order',()=>{
 const dolphins=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-motion-frame.json.gz',import.meta.url))));
 assert.equal(dolphins.cases.length,32);assert.equal(dolphins.instructions,134874);let unlocked=0;
 for(const [i,c]of dolphins.cases.entries()){
  const {state,input}=setup(c,dolphins);
  // The original searches use B124, even when B120 holds a different count.
  state.scene.primaryCount=60;
  const before=structuredClone(state),waterField=createNativeWaterField({datumNative:c.input.waterDatumNative});
  waterField.heightQ.forEach((_,j)=>waterField.heightQ[j]=c.input.waterPattern?((j*7919+37)%20001)-10000:768);
  const waterBefore=structuredClone(waterField);
  const q=update(state,{...input,courseWordsEe20:dolphins.courseWordsEe20,animationsByResourceIndex:dolphins.animationsByResourceIndex,collisionGeometry:dolphins.collisionGeometry,waterField,
   actorWordsF060:null,actorControlWords62c4:null,actorControlWords62d0:null,resourceWordsE73c:null,hudWords7788:null,cameraIndex:99,state650:99,activity624:99,mode620:99,primaryCount:99,secondaryCount:99,championshipCountAa00:99});
  assert.deepEqual(q.operations,c.operations,'dolphin frame '+i);assert.deepEqual(q.effects,c.operations.filter(o=>o.kind==='externalCall'));
  assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.equal(q.state.scene.rngState4640,c.rngState4640);
  assert.deepEqual(q.state.actorControlWords62c4,c.actorControlWords62c4);assert.deepEqual(q.state.actorControlWords62d0,c.actorControlWords62d0);
  assert.deepEqual(state,before);assert.deepEqual(waterField,waterBefore);
  const spawn=q.operations.findIndex(o=>o.kind==='presentationActorWrite'&&[0xbc,0xbc*2,0xbc*3].includes(o.byteOffset)&&o.value===6);
  if(spawn>=0){const base=q.operations[spawn].byteOffset;assert.ok(q.operations.slice(spawn+1).some(o=>o.kind==='presentationActorWrite'&&o.byteOffset===base+0x64));unlocked++;}
 }
 assert.ok(unlocked>0);
});

test('whole dolphin course frames consume retained loaded animation banks in the same original order',()=>{
 const dolphins=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-motion-frame.json.gz',import.meta.url))));
 const bank=loadedAnimationBank(dolphins.animationsByResourceIndex[5]),resourceWordsE73c=Array(43).fill(0);resourceWordsE73c[0xa4/4]=0xffffffff;resourceWordsE73c[0x48/4]=bank.animationTableAddress;
 const animationResources=createNativePresentationAnimationResources({resourceWordsE73c,loadedBanks:{0:bank}});
 for(const [i,c]of dolphins.cases.entries()){
  const {state,input}=setup(c,dolphins);state.resourceWordsE73c=[...resourceWordsE73c];const before=structuredClone(state),waterField=createNativeWaterField({datumNative:c.input.waterDatumNative});
  waterField.heightQ.forEach((_,j)=>waterField.heightQ[j]=c.input.waterPattern?((j*7919+37)%20001)-10000:768);
  const q=update(state,{...input,animationResources,courseWordsEe20:dolphins.courseWordsEe20,collisionGeometry:dolphins.collisionGeometry,waterField,resourceWordsE73c:null});
  assert.deepEqual(q.operations,c.operations,'loaded whole frame '+i);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256);assert.deepEqual(state,before);
 }
});
