import test from 'node:test';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeIntroductionCourseEffects as effects} from '../native-introduction-course-effects.js';
import {prepareNativeIntroductionCourseEffectsUpdate as update,prepareNativeIntroductionCameraScriptUpdate as scriptUpdate,prepareNativeCameraAuxiliaryMotionUpdate as motionUpdate} from '../native-race-state.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {NATIVE_INTRODUCTION_COURSE_EFFECTS as data} from '../native-introduction-course-effects-data.js';
const source=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-introduction-course-effects.json.gz',import.meta.url))));
function input(c){const hud=[...source.baseHud];for(const[i,w]of c.input.hudOverrides)hud[i]=w;return {...c.input,hudWords7788:hud};}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}
test('all six introduction actor callbacks match original ordered numeric writes and explicit pool boundaries',()=>{
 assert.equal(source.cases.length,3766);
 const courses=new Set();
 for(const [i,c]of source.cases.entries()){
  const label='case '+i+' course '+c.input.courseIndex+' camera '+c.input.cameraIndex,q=effects(input(c));
  assert.deepEqual(q.operations,c.operations,label);assert.equal(digest(q.hudWords7788),c.hudSHA256,label);courses.add(c.input.courseIndex);
 }
 assert.equal(courses.size,9);
});
function stateFor(c){const a=input(c),state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:a.courseIndex,players:1,mode620:4}));state.scene.main638=8;state.scene.rngState4640=a.rngState4640;state.profileWordsB330[2]=a.difficulty;state.hudWords7788=a.hudWords7788;return state;}
test('the actual first camera-script frame precedes actors and smoothing, with canonical RNG and points retained',()=>{
 const c=source.cases.find(c=>c.input.courseIndex===1&&c.input.difficulty===2&&c.input.cameraIndex===0),state=stateFor(c);
 state.hudWords7788=[...createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:1,players:1,mode620:4}).hudWords7788];
 state.hudWords7788[(0x805c-0x7788)/4]=0x80224b14;state.hudWords7788[(0x8060-0x7788)/4]=0;
 const before=structuredClone(state),script=scriptUpdate(state),actors=update(script.state,{courseIndex:8,difficulty:0,rngState4640:0,hudWords7788:null}),motion=motionUpdate(actors.state);
 assert.equal(script.state.hudWords7788[(0x8060-0x7788)/4],1);assert.equal(actors.state.hudWords7788[(0x87a8-0x7788)/4],8);
 assert.deepEqual(actors.effects.map(e=>e.consumer),['800ab92c','800ac098']);
 assert.deepEqual(actors.effects[1].arguments,[0x80228190,8]);assert.notEqual(actors.state.scene.rngState4640,script.state.scene.rngState4640);
 assert.equal(motion.state.scene.rngState4640,actors.state.scene.rngState4640);assert.deepEqual(motion.state.profileWordsB330,state.profileWordsB330);assert.deepEqual(motion.state.raceWords1f94,state.raceWords1f94);
 assert.deepEqual(state,before);assert.ok(Object.isFrozen(actors.state.hudWords7788));assert.equal(actors.diagnostic.actorsSubmitted,false);
});
test('courses without callbacks clear only the actor count and Sunny uses its Expert-only branch',()=>{
 for(const [course,difficulty]of [[3,0],[6,0],[8,0],[1,0],[1,1]]){
  const c=source.cases.find(c=>c.input.courseIndex===course&&c.input.difficulty===difficulty),q=effects(input(c));
  assert.deepEqual(q.operations,[{kind:'hudWrite',byteOffset:0x87a8-0x7788,width:4,value:0}]);
  assert.equal(q.rngState4640,c.input.rngState4640);
 }
 const c=source.cases.find(c=>c.input.courseIndex===2&&c.operations.some(o=>o.consumer==='800ab95c'));
 assert.deepEqual(effects(input(c)).operations.filter(o=>o.kind==='externalCall').map(o=>[o.consumer,o.arguments]),[['800ab92c',[]],['800ab95c',[1,0]],['800ac098',[0x80228190,0]]]);
});
test('late missing course resources cannot commit reset requests, actor writes or shared RNG changes',()=>{
 const c=source.cases.find(c=>c.input.courseIndex===7&&c.operations.some(o=>o.consumer==='800ab92c')),state=stateFor(c),before=structuredClone(state),constants={...data.constants};delete constants[0x80225f64];
 assert.throws(()=>update(state,{resources:{...data,constants}}),/constant/);assert.deepEqual(state,before);
 const badGroups=[...data.southernFlocks];badGroups[16]=0xffffffff;
 assert.throws(()=>update(state,{resources:{...data,southernFlocks:badGroups}}),/actor slice/);assert.deepEqual(state,before);
 state.scene.main638=9;assert.throws(()=>update(state),/main8/);
});
