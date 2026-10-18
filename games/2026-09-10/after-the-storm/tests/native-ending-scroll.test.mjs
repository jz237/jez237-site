import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeEndingMenuScroll} from '../native-ending-menu.js';
import {prepareNativeEndingMenuScrollUpdate} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ending-scroll.json',import.meta.url),'utf8'));
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const ix=a=>(a-0x6d50)/4;
function input(c){
 const s=structuredClone(seed);s.endingMenuWords6d50=[...c.ending];
 Object.assign(s.scene,{initLatch63c:c.latch,gameStateAb24:c.gameState,primaryHumanIndex:c.primary});
 s.profileWordsB330[1]=c.round>>>0;s.profileWordsB330[2]=c.difficulty;
 c.courseAvatars.forEach((id,i)=>s.profileWordsB330[8+i*4]=id>>>0);
 for(const [key,base] of [['records',0x2660],['lapRecords',0x2690]])c[key].forEach((v,i)=>s.raceWords1f94[(base-0x1f94)/4+i]=v>>>0);
 s.raceWords1f94[(0x2c70-0x1f94)/4+c.primary*222]=c.rank>>>0;return s;
}
const views=c=>({riderOrderEabb0:c.order,courseOrderEac14:c.courseOrder});

test('ending scroll matches184 raw original cases including initialization, overflow, shared fades and viewport ordering',()=>{
 for(const c of reference.cases){
  const s=input(c.input),before=structuredClone(s),p=prepareNativeEndingMenuScroll(s,views(c.input));
  assert.deepEqual(p.operations,c.operations);assert.deepEqual(p.presentation,c.presentation);
  assert.deepEqual(s,before);assert.ok(Object.isFrozen(p.presentation));
  assert.equal(p.diagnostic.matrixHelpersExecuted,false);assert.equal(p.diagnostic.graphicsExecuted,false);
 }
});

test('650 successive updates reproduce the original complete schedule and readiness frame',()=>{
 const c=reference.sequence;let s=input(c.input),readyFrame=null,cues=0;const digest=createHash('sha256');
 for(let frame=0;frame<c.frames;frame++){
  const p=prepareNativeEndingMenuScrollUpdate(s,views(c.input));
  digest.update(JSON.stringify({operations:p.operations,presentation:p.presentation})+'\n');
  if(readyFrame===null&&p.state.endingMenuWords6d50[ix(0x6df4)]!==0)readyFrame=frame;
  cues+=p.effects.filter(o=>o.consumer==='800c489c').length;
  s=structuredClone(p.state);s.scene.initLatch63c=0;
 }
 assert.equal(digest.digest('hex'),c.sha256);assert.equal(readyFrame,c.readyFrame);assert.equal(cues,1);
 assert.deepEqual(s.endingMenuWords6d50,c.finalEnding);assert.equal(s.endingMenuWords6d50[ix(0x6d68)],0xffffffff);
 assert.equal(s.endingMenuWords6d50[ix(0x6dd4)],255);assert.equal(s.endingMenuWords6d50[ix(0x6dd8)],170);
});

test('canonical scroll leaves simulation and profile owners untouched and keeps presentation separate',()=>{
 const c=reference.cases.find(c=>c.input.latch===0&&c.input.ending[ix(0x6e80)]===3);
 const s=input(c.input),before=structuredClone(s),p=prepareNativeEndingMenuScrollUpdate(s);
 assert.deepEqual(p.state.raceWords1f94,s.raceWords1f94);assert.deepEqual(p.state.profileWordsB330,s.profileWordsB330);
 assert.deepEqual(p.state.scene,s.scene);assert.deepEqual(s,before);
 assert.equal(p.presentation.filter(v=>v.kind==='riderViewport').length,4);assert.deepEqual(p.effects,[]);
 assert.ok(Object.isFrozen(p.state.endingMenuWords6d50));
});

test('late malformed viewport data and invalid course counts fail without changing the supplied owner',()=>{
 const c=reference.cases.find(c=>c.input.latch===0&&c.input.ending[ix(0x6e80)]===3),s=input(c.input);
 delete s.endingMenuWords6d50[ix(0x6de8)];const before=structuredClone(s);
 assert.throws(()=>prepareNativeEndingMenuScroll(s),/endingMenuWords6d50/);assert.deepEqual(s,before);
 const initial=input(reference.sequence.input);initial.profileWordsB330[1]=8;const unchanged=structuredClone(initial);
 assert.throws(()=>prepareNativeEndingMenuScrollUpdate(initial,views(reference.sequence.input)),/eight-course/);assert.deepEqual(initial,unchanged);
 // A zero entry latch must not consume game-state, profile, or source tables.
 const idle={scene:{initLatch63c:0},endingMenuWords6d50:Array(126).fill(0)};idle.endingMenuWords6d50[ix(0x6d6c)]=1;
 assert.equal(prepareNativeEndingMenuScroll(idle).diagnostic.initialized,false);
});
