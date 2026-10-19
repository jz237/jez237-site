import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createNativeCourseActorHost} from '../native-course-actor-host.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {createNativeRaceState,prepareNativeCourseDisplayInitializationUpdate,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {NATIVE_COURSE_ANIMATION_ASSETS} from '../source-course-actor-animation-assets.js';
const fixture=name=>JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/'+name+'.json.gz',import.meta.url))));
const startup=fixture('native-course-actor-initialization'),motion=fixture('native-course-actor-frame');
const assets=Object.fromEntries(Object.entries(NATIVE_COURSE_ANIMATION_ASSETS).map(([key,l])=>[key,new Uint8Array(readFileSync(new URL('../'+l.asset,import.meta.url)))]));
const segmentWordsE6b0=Array(16).fill(0);segmentWordsE6b0[8]=0x316800;
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');};
const buffers=()=>({matrixBuffers:Array.from({length:2},()=>Array(192*16).fill(0x12345678)),lightBuffers:Array.from({length:2},()=>Array(96).fill(17))});
const selected=course=>startup.cases.find(c=>c.input.courseIndex===course&&c.input.main638===1&&c.input.players===1);
function owner(course,initialBuffers=buffers()){
 const c=selected(course),a=c.input;
 let state=structuredClone(createNativeRaceMemory({racers:Array.from({length:4},()=>({lap:0,grid:0,power:0,misses:0})),courseIndex:course,players:1,mode620:a.mode620})),commits=0;
 state.resourceWordsE73c=Array(43).fill(0);state.resourceWordsB538=Array(8).fill(0);
 Object.assign(state.scene,{main638:a.main638,fieldAb2c:0,primaryHumanIndex:a.primaryHumanIndex,secondaryHumanIndex:a.secondaryHumanIndex,reverseDab68:a.reverseAB68&65535,rngState4640:a.rngState4640,audioScene7c9c:a.audioScene7c9c});
 state.actorWordsF060=[...startup.baseActorWords];for(const [i,w]of a.actorOverrides)state.actorWordsF060[i]=w;
 for(const k of ['actorControlWords62c4','actorControlWords62d0'])state[k]=[...a[k]];
 state.profileWordsB330[4]=a.profileB340;
 for(let slot=0;slot<4;slot++)for(const [i,o]of [0,4,0xc,0x2f4].entries())state.raceWords1f94[(0x2938+slot*0x378+o-0x1f94)/4]=a.racerRecordWordsBySlot[slot][i];
 state=prepareNativeCourseDisplayInitializationUpdate(state,{waterExtent2498:768}).state;
 const readRaceState=()=>state,commitRaceState=next=>{state=createNativeRaceState(next);commits++;};
 const host=createNativeCourseActorHost({readRaceState,commitRaceState,buffers:initialBuffers,worldScale:.025});
 return {c,input:{...a,sineTableWords4350:startup.sineTableWords4350},resources:{assets,segmentWordsE6b0},host,read:readRaceState,replace:commitRaceState,commits:()=>commits,initialBuffers};
}

test('canonical actor hosts initialize all nine courses with original pools, controls, RNG and audio effects',()=>{
 for(let course=0;course<9;course++){
  const o=owner(course),before=o.read(),q=o.host.initialize(o.input,o.resources),c=o.c;
  assert.equal(o.commits(),1);assert.notEqual(o.read(),before);
  assert.equal(digest(o.read().actorWordsF060),c.actorSHA256,'course '+course);
  for(const k of ['actorControlWords62c4','actorControlWords62d0'])assert.deepEqual(o.read()[k],c[k]);
  for(const k of ['rngState4640','audioScene7c9c'])assert.equal(o.read().scene[k],c[k]);
  assert.deepEqual(q.operations.slice(-c.operations.length),c.operations);
  assert.deepEqual(q.effects,c.operations.filter(op=>op.kind==='externalCall'));
  assert.throws(()=>o.host.initialize(o.input,o.resources),/only once/);assert.equal(o.commits(),1);
  assert.deepEqual(o.host.presentation().matrixBuffers,o.initialBuffers.matrixBuffers);
 }
});

test('late startup and second-bank asset failures leave the shared owner untouched and allow retry',()=>{
 const o=owner(0),before=o.read();
 assert.throws(()=>o.host.advanceMotion(o.input),/Initialize course actors/);
 assert.throws(()=>o.host.prepareDisplay({}),/Initialize course actors/);
 assert.throws(()=>o.host.initialize(o.input,{...o.resources,assets:{0:assets[0]}}),/asset length/);
 assert.throws(()=>o.host.initialize({...o.input,firstCourseNodeWords:null},o.resources),/first course node/);
 assert.equal(o.read(),before);assert.equal(o.commits(),0);
 o.host.initialize(o.input,o.resources);assert.equal(o.commits(),1);
});

test('motion reads current canonical body records and matches all original course6 frame cases',()=>{
 const o=owner(6);o.host.initialize(o.input,o.resources);
 for(const c of motion.cases.filter(c=>c.input.courseIndex===6)){
  const a=c.input,state=structuredClone(o.read());state.actorWordsF060=[...motion.baseActorWords];
  for(const [i,w]of a.actorOverrides)state.actorWordsF060[i]=w;
  state.actorControlWords62c4=[...a.actorControlWords62c4];
  Object.assign(state.scene,{players:a.players,primaryHumanIndex:a.primaryHumanIndex,secondaryHumanIndex:a.secondaryHumanIndex,activity624:a.activity624});
  for(let slot=0;slot<4;slot++)for(const [i,offset]of [0,4,0xc,0x2f4].entries())state.raceWords1f94[(0x2938+slot*0x378+offset-0x1f94)/4]=a.racerRecordWordsBySlot[slot][i];
  o.replace(state);const before=o.read();
  const q=o.host.advanceMotion({...a,racerRecordWordsBySlot:null,actorWordsF060:null,courseIndex:0});
  assert.deepEqual(q.operations,c.operations);assert.equal(digest(o.read().actorWordsF060),c.actorSHA256);
  assert.deepEqual(o.read().actorControlWords62c4,c.actorControlWords62c4);assert.notEqual(o.read(),before);
 }
 const before=o.read();assert.throws(()=>o.host.advanceMotion({}),/body pose/);assert.equal(o.read(),before);
});

test('display commits atomically with its retained buffers and rejects stale, foreign and reused tickets',()=>{
 const o=owner(6);o.host.initialize(o.input,o.resources);
 const before=o.read(),p=o.host.presentation(),ticket=o.host.prepareDisplay({});
 assert.equal(o.read(),before);assert.equal(o.host.presentation(),p);
 assert.ok(ticket.effects.some(op=>op.kind==='presentationLightByteWrite'));
 assert.throws(()=>o.host.commitDisplay({...ticket}),/this host/);
 // A renderer may reject its geometry without consuming the prepared state.
 assert.equal(o.read(),before);assert.equal(o.host.presentation(),p);
 o.replace(prepareNativeRaceStateOperations(o.read(),[{kind:'sourceWordWrite',field:'rngState4640',value:123}]).state);
 const newer=o.read();assert.throws(()=>o.host.commitDisplay(ticket),/stale/);
 assert.equal(o.read(),newer);assert.equal(o.host.presentation(),p);
 const next=o.host.prepareDisplay({}),parallel=o.host.prepareDisplay({});o.host.commitDisplay(next);
 assert.equal(o.host.presentation(),next.presentation);assert.equal(o.read().scene.rngState4640,123);
 assert.deepEqual(o.read().actorWordsF060,next.state.actorWordsF060);
 assert.throws(()=>o.host.commitDisplay(next),/this host/);assert.throws(()=>o.host.commitDisplay(parallel),/stale/);
 const corrupt=structuredClone(o.read());corrupt.resourceWordsE73c[20]^=1;o.replace(corrupt);
 assert.throws(()=>o.host.prepareDisplay({}),/resources changed/);
});

test('all485 original dolphin poses pass through the canonical host and extracted asset provider unchanged',()=>{
 const reference=JSON.parse(readFileSync(new URL('./fixtures/native-dolphin-host-draw-reference.json',import.meta.url))),display=fixture('native-presentation-actor-display');
 const o=owner(0,{matrixBuffers:Array.from({length:2},()=>Array(192*16).fill(0)),lightBuffers:Array.from({length:2},()=>Array(96).fill(0))});
 o.host.initialize(o.input,o.resources);
 const bits=new DataView(new ArrayBuffer(4));bits.setFloat32(0,90);const ninety=bits.getUint32(0);
 assert.equal(reference.frames.flat().length,485);
 for(const [animationIndex,frames]of reference.frames.entries())for(const [frame,expected]of frames.entries()){
  const state=structuredClone(o.read());state.actorWordsF060=Array(1484).fill(0);state.actorWordsF060[0]=6;
  state.actorWordsF060[0x18/4]=ninety;state.actorWordsF060[0x74/4]=animationIndex;state.actorWordsF060[0x78/4]=frame;state.actorWordsF060[0x7c/4]=255;
  state.hudWords7788=[...display.baseHudWords];state.courseDisplayWordsB058=[...display.baseDisplayWords];
  state.graphicsCorners.renderBufferIndex=0;Object.assign(state.scene,{fieldAb2c:0,displayCamera3930:0,activity624:0,championshipCountAa00:0});
  o.replace(state);const q=o.host.prepareDisplay({});
  assert.equal(createHash('sha256').update(JSON.stringify(q.presentation.draws)).digest('hex'),expected,`animation ${animationIndex} frame ${frame}`);
  o.host.commitDisplay(q);
 }
});
