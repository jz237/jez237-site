import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeCourseResourceRelocation as prepare} from '../native-course-resource-relocation.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativeCourseResourceRelocationUpdate as update} from '../native-race-state.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-course-resource-relocation.json.gz',import.meta.url))));
const digest=words=>{const bytes=Buffer.alloc(words.length*4);words.forEach((w,i)=>bytes.writeUInt32BE(w,i*4));return createHash('sha256').update(bytes).digest('hex');};
const views=c=>({coursePartRootListsB484:{[c.bankIndex]:c.roots}});
test('whole course bank assembly matches source part relocation, metadata and animation pointer ordering',()=>{
 assert.equal(e.cases.length,72);assert.equal(e.instructions,32756);
 for(const [i,c]of e.cases.entries()){
  const before=structuredClone(c),q=prepare(c.value,c.input,views(c));
  assert.deepEqual(q.operations,c.operations,'course bank '+i);assert.deepEqual(q.resourceWordsE73c,c.resourceWordsE73c);
  assert.equal(digest(q.loadedAssetWords),c.sha256);assert.deepEqual(c,before);assert.ok(Object.isFrozen(q.operations));
 }
});
test('static banks retain animation words and avoid unused segment data',()=>{
 for(const bankIndex of [5,7]){
  const c=e.cases.find(c=>c.bankIndex===bankIndex&&c.roots.length===10),q=prepare(c.value,{...c.input,segmentWordsE6b0:null},views(c));
  assert.deepEqual(q.operations,c.operations);assert.equal(q.resourceWordsE73c[(0x48+c.input.slot*44)/4],c.value.resourceWordsE73c[(0x48+c.input.slot*44)/4]);
 }
});
test('a missing late part or animation pointer leaves both owners untouched',()=>{
 const c=structuredClone(e.cases.find(c=>c.bankIndex===0&&c.roots.length===4)),before=structuredClone(c);
 assert.throws(()=>prepare(c.value,c.input,{coursePartRootListsB484:{0:[c.roots[0],0x08fffffc,0]}}),/terminator/);
 assert.throws(()=>prepare(c.value,{...c.input,segmentWordsE6b0:null},views(c)),/segmentWords/);
 assert.throws(()=>prepare(c.value,c.input,{coursePartRootListsB484:{0:[c.roots[0]]}}),/part root/);
 assert.deepEqual(c,before);
});

test('canonical relocation keeps selected metadata authoritative and loaded banks outside frame state',()=>{
 for(const bankIndex of [0,5,8]){
  const c=e.cases.find(c=>c.bankIndex===bankIndex&&c.input.slot===1&&c.roots.length===4);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:0,players:1,mode620:4}));
  state.resourceWordsE73c=[...c.value.resourceWordsE73c];const before=structuredClone(state),loadedBefore=[...c.value.loadedAssetWords];
  const q=update(state,{...c.input,loadedAssetWords:c.value.loadedAssetWords,resourceWordsE73c:Array(43).fill(0),bankIndex:99},views(c));
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(q.state.resourceWordsE73c,c.resourceWordsE73c);assert.equal(digest(q.loadedAssetWords),c.sha256);
  assert.deepEqual(q.effects,[]);assert.equal(Object.hasOwn(q.state,'loadedAssetWords'),false);
  assert.deepEqual(state,before);assert.deepEqual(c.value.loadedAssetWords,loadedBefore);
  assert.throws(()=>update(state,{...c.input,loadedAssetWords:c.value.loadedAssetWords},{coursePartRootListsB484:{[bankIndex]:[c.roots[0],0x08fffffc,0]}}));
  assert.deepEqual(state,before);assert.deepEqual(c.value.loadedAssetWords,loadedBefore);
 }
});
