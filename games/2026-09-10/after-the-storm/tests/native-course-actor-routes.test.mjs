import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {snapshotNativeCourseActorRoutes as snapshot} from '../native-course-actor-routes.js';
import {createSourcePrimaryBuoys,stepSourcePrimaryBuoys} from '../source-primary-buoys.js';
import {nativeDolphinPracticeScene} from '../source-dolphin-practice-course.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {createNativeStuntCourseRuntime} from '../native-stunt-course-runtime.js';
import {getCourse} from '../courses.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-actor-routes.json.gz',import.meta.url))));
const runtime=createNativeRaceCourseRuntime({course:nativeDolphinPracticeScene(getCourse('practice')),difficulty:0,players:1});
const args=()=>({routes:runtime.courseActorRoutes,primaryState:createSourcePrimaryBuoys(runtime.sourceBuoyLayout),retainedWordsEe20:evidence.retainedWordsEe20});
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');}

test('current primary actor views match all12480 original words through39 prepared frames',()=>{
 assert.equal(evidence.cases.reduce((n,c)=>n+c.instructions,0),25258);
 let frames=0;
 for(const c of evidence.cases){
  const input=args(),state=input.primaryState;
  Object.assign(state.nodes[c.changes.sourceRow],structuredClone(c.changes));
  state.nodes[0].endpointsNative[0].y=c.fixedEndpointY;
  for(const frame of c.frames){
   if(frame.frame)stepSourcePrimaryBuoys(state,{queryNative:()=>c.height});
   const before=structuredClone(input),q=snapshot(input);
   assert.equal(digest(q),frame.wordsSHA256,`water ${c.height}, frame ${frame.frame}`);
   assert.deepEqual(input,before);assert.ok(Object.isFrozen(q));frames++;
  }
 }
 assert.equal(frames,39);
});

test('unused primary rows and absent families retain their actual neighboring words',()=>{
 const input=args(),q=snapshot(input),secondaryStart=64*65;
 assert.deepEqual(q.slice(60*65,secondaryStart),evidence.retainedWordsEe20.slice(60*65,secondaryStart));
 // A68A4's negative offset at secondary row0 reads primary row63's class.
 assert.equal(q[secondaryStart-0x6c/4],evidence.retainedWordsEe20[secondaryStart-0x6c/4]);
 assert.deepEqual(q.slice(128*65),evidence.retainedWordsEe20.slice(128*65));
 input.primaryState.nodes[1].positionNative.y=123;
 const next=snapshot(input);assert.notEqual(next[65+1],q[65+1]);
 assert.deepEqual(next.slice(secondaryStart),q.slice(secondaryStart));
});

test('all nine Stunt selections preserve absent families and physical fixed endpoints',()=>{
 for(let courseIndex=0;courseIndex<9;courseIndex++){
  const course=createNativeStuntCourseRuntime({courseIndex});
  const input={routes:course.courseActorRoutes,primaryState:createSourcePrimaryBuoys(course.sourceBuoyLayout),retainedWordsEe20:evidence.retainedWordsEe20};
  const q=snapshot(input),n=course.data.nodes.length;
  assert.deepEqual(q.slice(0,n*65),course.data.recordWordsBySourceRow.flat(),`course ${courseIndex}`);
  assert.deepEqual(q.slice(n*65),evidence.retainedWordsEe20.slice(n*65));
 }
});

test('missing padding, wrong physical owners and late invalid fields fail without changing inputs',()=>{
 for(const mutate of [
  v=>v.retainedWordsEe20.pop(),
  v=>{v.routes.secondary=undefined;},
  v=>v.primaryState.nodes.pop(),
  v=>{delete v.primaryState.nodes[2];},
  v=>{delete v.routes.secondary.recordWordsBySourceRow[2];},
  v=>{v.primaryState.nodes[1].sourceRow=0;},
  v=>{v.primaryState.nodes[1].sourceIndex=4;},
  v=>{v.primaryState.nodes.at(-1).positionNative.z=NaN;},
  v=>{v.primaryState.nodes.at(-1).renderEnabled=1;},
  v=>{v.primaryState.nodes.at(-1).fixed=true;},
 ]){
  const input=structuredClone(args());mutate(input);const before=structuredClone(input);
  assert.throws(()=>snapshot(input));assert.deepEqual(input,before);
 }
});
