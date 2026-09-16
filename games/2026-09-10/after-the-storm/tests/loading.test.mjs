import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {packedAssets} from '../packed-assets.js';
import {loadBinary} from '../asset-binary.js';
import {courseWorldKey} from '../course-cache.js';
import {createRecorder,recordMoment} from '../instant-replay.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';

test('all packed models restore the exact original vertices, normals and indices',async()=>{
 let original=0,packed=0;
 for(const [name,entry] of Object.entries(packedAssets)){
  const raw=await readFile(new URL('../'+name,import.meta.url));
  const compressed=await readFile(new URL('../'+entry.url,import.meta.url));
  assert.deepEqual(gunzipSync(compressed),raw,name);
  assert.equal(raw.length,entry.bytes);assert.equal(compressed.length,entry.packedBytes);
  original+=raw.length;packed+=compressed.length;
 }
 assert.ok(packed<original*.25,'at least 75% smaller model transport');
});
test('streaming browser loader inflates a real shipped model',async()=>{
 const path='assets/tideline-r01-lod.bin',requests=[];
 const result=await loadBinary(path,{fetcher:async url=>{requests.push(url);return new Response(await readFile(url));}});
 assert.deepEqual(new Uint8Array(result),new Uint8Array(await readFile(new URL('../'+path,import.meta.url))));
 assert.equal(requests.length,1);assert.ok(requests[0].pathname.includes('/packed/'));
});
test('old browsers load the original directly without wasting a packed request',async()=>{
 const path='assets/tideline-r01-lod.bin',requests=[];
 const result=await loadBinary(path,{Inflater:null,fetcher:async url=>{requests.push(url);return new Response(await readFile(url));}});
 assert.equal(result.byteLength,packedAssets[path].bytes);assert.equal(requests.length,1);
 assert.ok(requests[0].pathname.endsWith(path));
});
test('damaged packed responses recover through the uncompressed source',async()=>{
 const path='assets/tideline-r01-lod.bin',requests=[];
 const warn=console.warn;console.warn=()=>{};
 try{
  const result=await loadBinary(path,{fetcher:async url=>{requests.push(url);return new Response(requests.length===1?new Uint8Array([0,1,2]):await readFile(url));}});
  assert.equal(result.byteLength,packedAssets[path].bytes);assert.equal(requests.length,2);
 }finally{console.warn=warn;}
});
test('world reuse follows authored mode and difficulty, independent of rider or waves',()=>{
 for(const id of ['greyhaven','amber','reed','citadel','port','neon','glacier','tempest','practice']){
  const key=(mode,difficulty=0,rider=0)=>courseWorldKey(createRace({course:getCourse(id,difficulty),mode,rider}).course,mode==='practice');
  assert.equal(key('practice'),key('practice',0,2));
  assert.equal(key('race'),key('time'));assert.equal(key('race'),key('versus'));
  assert.notEqual(key('practice'),key('race'));assert.notEqual(key('practice'),key('stunt'));
  assert.notEqual(key('stunt'),key('race'));
  for(const difficulty of [1,2,3])assert.notEqual(key('race'),key('race',difficulty));
 }
});
test('lazy replay capture allocates only recorded frames, preserving the snapshot',()=>{
 const recorder=createRecorder(),state={phase:'running',time:0,racers:[],weather:{storm:.3}};
 let waterCalls=0,beadCalls=0;
 const water={wake:[{x:4}]},beads=[{wet:.7}];
 for(let i=0;i<60;i++){state.time=i/60;recordMoment(recorder,state,()=>{waterCalls++;return water;},()=>{beadCalls++;return beads;});}
 assert.equal(waterCalls,20);assert.equal(beadCalls,20);assert.equal(recorder.frames.length,20);
 water.wake[0].x=100;beads[0].wet=0;
 assert.equal(recorder.frames[0].water.wake[0].x,4);assert.equal(recorder.frames[0].beads[0].wet,.7);
 state.phase='paused';state.time=2;recordMoment(recorder,state,()=>{throw Error('paused capture');});
});
