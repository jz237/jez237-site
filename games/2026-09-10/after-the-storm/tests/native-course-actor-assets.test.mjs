import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeHighResolutionCourseBank as bank,prepareNativeCourseActorAssets as setup} from '../native-course-actor-assets.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {NATIVE_COURSE_ANIMATION_ASSETS as layouts} from '../source-course-actor-animation-assets.js';
import {NATIVE_TITLE_MENU_DATA} from '../native-title-menu-data.js';
import {NATIVE_COURSE_ACTOR_RESOURCE_DATA as source} from '../source-course-actor-resource-data.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-high-resolution-course-bank-reference.json',import.meta.url)));
const assets=Object.fromEntries(Object.entries(layouts).map(([key,l])=>[key,new Uint8Array(readFileSync(new URL('../'+l.asset,import.meta.url)))]));
const segmentWordsE6b0=Array(16).fill(0);segmentWordsE6b0[8]=0x316800;
function memory(courseIndex){const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex,players:1,mode620:0}));state.resourceWordsE73c=Array.from({length:43},(_,i)=>(0x15263748+i*0x1010101)>>>0);state.resourceWordsB538=Array.from({length:8},(_,i)=>i*0x11111111);return state;}

test('high-resolution bank metadata matches every actual original bank in both loaded slots',()=>{
 assert.equal(reference.length,18);
 for(const c of reference){
  const before=[...c.resourceWordsE73c],q=bank(c.resourceWordsE73c,{...c.input,bytes:assets[c.bankIndex]});
  assert.deepEqual(q.operations,c.resourceOperations,`bank ${c.bankIndex} slot ${c.input.slot}`);assert.deepEqual(q.resourceWordsE73c,c.expectedResourceWords);assert.deepEqual(c.resourceWordsE73c,before);
  assert.equal(q.animationBank!==null,!!layouts[c.bankIndex]);assert.equal(q.diagnostic.lowResolutionGraphicsLoaded,false);
 }
});

test('all nine course selections retain canonical mappings and install separate providers for their selected banks',()=>{
 for(let course=0;course<9;course++){
  const state=memory(course),before=structuredClone(state),q=setup(state,{assets,segmentWordsE6b0}),pair=NATIVE_TITLE_MENU_DATA.courseResourcePairs[course],retained=q.state.resourceWordsE73c;
  let cursor=0x08060000,animated=0;
  for(let slot=0;slot<2;slot++){
   const id=pair[slot],record=(0x44+slot*44)/4;assert.equal(retained[(0x9c+slot*8)/4]|0,id);assert.equal(retained[(0xa0+slot*8)/4],cursor);
   if(id===-1){assert.deepEqual(retained.slice(record,record+11),state.resourceWordsE73c.slice(record,record+11));continue;}
   assert.equal(retained[record],source.coursePartRootsB484[id].length);
   assert.deepEqual(retained.slice(record+2,record+2+retained[record]),source.coursePartRootsB484[id].map(root=>(root+(cursor&0xffffff))>>>0));
   if(layouts[id]){const base=0x80316800+(cursor&0xffffff);assert.equal(q.loadedBanks[slot].baseAddress,base+layouts[id].dataOffset);assert.ok(q.animationResources.getAnimation(slot,0,retained).frameCount>0);animated++;}
   else{assert.equal(retained[record+1],state.resourceWordsE73c[record+1]);assert.throws(()=>q.animationResources.getAnimation(slot,0,retained),/no loaded/);}
   cursor=(cursor+source.courseByteLengthWordsCE18[id]+63)&0xffffffc0;cursor>>>=0;
  }
  assert.equal(Object.keys(q.loadedBanks).length,animated);assert.deepEqual(state,before);assert.equal(Object.hasOwn(q.state,'loadedBanks'),false);
 }
});

test('complete selected resource owners match the original main40 loader for all nine courses',()=>{
 const e=JSON.parse(readFileSync(new URL('./fixtures/native-course-actor-setup-reference.json',import.meta.url)));assert.equal(e.cases.length,9);
 for(const c of e.cases){
  const state=memory(c.courseIndex);state.resourceWordsE73c=c.resourceWordsE73c;state.resourceWordsB538=c.resourceWordsB538;
  const q=setup(state,{assets,segmentWordsE6b0:c.segmentWordsE6b0});
  assert.deepEqual(q.state.resourceWordsE73c,c.expectedResourceWordsE73c,`complete retained course resource owner ${c.courseIndex}`);
  assert.deepEqual(q.state.resourceWordsB538,c.expectedResourceWordsB538,`complete selected descriptor owner ${c.courseIndex}`);
 }
});

test('missing second-bank assets cannot commit the first bank and static/empty courses need no assets or segments',()=>{
 const state=memory(0),before=structuredClone(state);assert.throws(()=>setup(state,{assets:{0:assets[0]},segmentWordsE6b0}),/asset length/);assert.deepEqual(state,before);
 assert.throws(()=>setup(state,{assets,segmentWordsE6b0:null}),/segment words/);assert.deepEqual(state,before);
 for(const course of [5,6]){const s=memory(course),q=setup(s);assert.deepEqual(q.loadedBanks,{});assert.equal(q.state.scene.courseIndex,course);}
});
