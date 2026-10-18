import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeTrainingEntry as entry} from '../native-menu-return-initialization.js';
import {prepareNativeMenuReturnUpdate as update} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-training-entry.json',import.meta.url),'utf8'));
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
function input(c){const s=structuredClone(seed);Object.assign(s.scene,{gameStateAb24:42,primaryHumanIndex:c.primary,variant6f4:c.variant});
 c.lessons.forEach((n,i)=>s.raceWords1f94[(0x2c70-0x1f94)/4+i*222]=n);return s;}
function views(c){return {avatarsA9b0:c.avatars,courseRiderTraits:fixture.courseRiderTraits,
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};}

test('training entry matches all ordered writes and calls in288 original executions',()=>{
 for(const c of fixture.cases){
  const state=input(c),before=structuredClone(state),p=entry(state,views(c));
  assert.deepEqual(p.operations,c.operations);assert.deepEqual(state,before);
  assert.equal(p.operations.filter(o=>o.kind==='bodyTuneWordWrite').length,16);
  assert.ok(Object.isFrozen(p.operations));assert.equal(p.diagnostic.lessonLoopExecuted,false);
 }
});

test('canonical training entry expands fades, retains lesson data and leaves physical/audio dependencies explicit',()=>{
 for(const c of [fixture.cases[0],fixture.cases.at(-1)]){
  const state=input(c),before=structuredClone(state),p=update(state,'training',views(c)),g=p.state.scene;
  assert.deepEqual([g.previousGameState634,g.gameStateAb24,g.main638,g.courseIndex,g.mode620,g.players,g.racerCount,
   g.phase650,g.simulation648,g.wave49b0,g.noFinish8178],[42,102,21,7,0,1,4,3,2,10,1]);
  assert.deepEqual(p.state.raceWords1f94,state.raceWords1f94);
  assert.deepEqual(p.state.profileWordsB330,state.profileWordsB330);
  assert.equal(p.state.hudWords7788[(0x7c80-0x7788)/4],8);
  assert.deepEqual(p.effects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['80096960','8009684c','800c21f4']);
  assert.equal(p.effects.filter(o=>o.kind==='bodyTuneWordWrite').length,16);
  assert.equal(p.diagnostic.physicalInitialization,false);assert.equal(p.diagnostic.audioExecuted,false);
  assert.deepEqual(state,before);assert.ok(Object.isFrozen(p.state));
 }
});

test('training validates consumed trait/record fields and rejects late fade failure atomically',()=>{
 const c=fixture.cases[0],state=input(c),before=structuredClone(state),v=views(c);
 const sparse=structuredClone(v);delete sparse.courseRiderTraits[7][0][1];
 for(const bad of [{...v,avatarsA9b0:[0,1,2,4]},{...v,courseRiderTraits:[]},sparse,{...v,slotTemplateWords6c50:[]}]){
  assert.throws(()=>update(state,'training',bad),RangeError);assert.deepEqual(state,before);
 }
 const missing=structuredClone(state);delete missing.raceWords1f94[(0x2c70-0x1f94)/4];
 assert.throws(()=>entry(missing,v),/retained training lesson/);
 // The source selects four avatar slots independently; duplicates are legal
 // in this numeric entry and must not be replaced with an invented roster.
 const repeated=entry(state,{...v,avatarsA9b0:[2,2,2,2]});
 assert.deepEqual(repeated.operations.filter(o=>o.kind==='bodyTuneWordWrite'&&o.wordIndex===0).map(o=>o.value),[2,2,2,2]);
});
