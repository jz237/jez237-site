import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeEndingMenuInitialization,prepareNativeEndingPanelEnqueue,prepareNativeEndingMenuInput} from '../native-ending-menu.js';
import {prepareNativeEndingMenuInitializationUpdate,prepareNativeEndingPanelEnqueueUpdate,prepareNativeEndingMenuInputUpdate} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ending-menu.json',import.meta.url),'utf8'));
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const ix=a=>(a-0x6d50)/4;
const fade={fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]};
function input(c){const s=structuredClone(seed);s.scene.gameStateAb24=102;s.endingMenuWords6d50=[...c.ending];
 if(c.difficulty!==undefined){s.profileWordsB330[2]=c.difficulty;s.scene.primaryHumanIndex=c.primary;
  s.raceWords1f94[(0x2c70-0x1f94)/4+c.primary*222]=c.rank>>>0;
  c.courseAvatars.forEach((id,i)=>s.profileWordsB330[8+i*4]=id>>>0);}
 if(c.pressed!==undefined)s.menuWordsE658[0]=0xa5000000|c.pressed;
 s.menuWordsE658[0]>>>=0;return s;}

test('ending initialization matches420 original executions across final ranks, classes, slots and wrapped counts',()=>{
 for(const c of reference.initialization){const s=input(c),before=structuredClone(s);
  const p=prepareNativeEndingMenuInitialization(s,{riderOrderEabb0:c.order});assert.deepEqual(p.operations,c.operations);
  assert.deepEqual(s,before);assert.ok(Object.isFrozen(p.operations));}
});

test('ending panel allocation matches66 original full-pool, first-free and signed-type cases',()=>{
 for(const c of reference.enqueue){const s=input(c),p=prepareNativeEndingPanelEnqueue(s,c.panelType);
  assert.deepEqual(p.operations,c.operations);assert.equal(p.operations.length===0,p.diagnostic.slot===null);}
});

test('ending input and exit match360 original counter, ready, button and record-flag cases',()=>{
 for(const c of reference.controls){const s=input(c),before=structuredClone(s),p=prepareNativeEndingMenuInput(s);
  assert.deepEqual(p.operations,c.operations);assert.deepEqual(s,before);}
});

test('canonical ending owner preserves neighbors and expands exit fade before the optional audio stop',()=>{
 const c=reference.initialization.find(c=>c.difficulty===2&&c.rank===1&&c.primary===3&&c.ending[ix(0x6d5c)]===7);
 const s=input(c),before=structuredClone(s),p=prepareNativeEndingMenuInitializationUpdate(s,{riderOrderEabb0:c.order});
 assert.equal(p.state.endingMenuWords6d50[ix(0x6f44)],4);
 assert.deepEqual(p.state.endingMenuWords6d50.slice(ix(0x6f20),ix(0x6f20)+8),[0,3,4,2,1,3,4,0]);
 assert.deepEqual(p.state.profileWordsB330,s.profileWordsB330);assert.deepEqual(p.state.raceWords1f94,s.raceWords1f94);
 assert.equal(p.state.endingMenuWords6d50[0],s.endingMenuWords6d50[0]);
 const allocated=prepareNativeEndingPanelEnqueueUpdate(p.state,10),row=allocated.state.endingMenuWords6d50.slice(ix(0x6e80),ix(0x6e80)+4);
 assert.deepEqual(row,[1,10,28,235]);
 const ready=structuredClone(allocated.state);ready.endingMenuWords6d50[ix(0x6df4)]=1;ready.endingMenuWords6d50[ix(0x6df8)]=599;
 ready.endingMenuWords6d50[ix(0x6e74)]=0;ready.endingMenuWords6d50[ix(0x6e78)]=0;ready.menuWordsE658[0]=0;
 const wait=prepareNativeEndingMenuInputUpdate(ready);assert.equal(wait.state.scene.gameStateAb24,102);assert.equal(wait.diagnostic.destination,null);
 const exit=prepareNativeEndingMenuInputUpdate(wait.state,fade);assert.equal(exit.state.scene.gameStateAb24,103);
 assert.equal(exit.state.scene.returnState630,2);assert.equal(exit.state.endingMenuWords6d50[ix(0x6df8)],601);
 assert.deepEqual(exit.effects,[{kind:'externalCall',consumer:'800c1f60',arguments:[0]}]);
 assert.ok(exit.operations.findIndex(o=>o.kind==='hudWrite')<exit.operations.findIndex(o=>o.consumer==='800c1f60'));
 ready.menuWordsE658[0]=0x1000;ready.endingMenuWords6d50[ix(0x6e78)]=1;
 const records=prepareNativeEndingMenuInputUpdate(ready,fade);assert.equal(records.state.scene.returnState630,100);assert.deepEqual(records.effects,[]);
 assert.deepEqual(s,before);assert.ok(Object.isFrozen(exit.state.endingMenuWords6d50));
});

test('invalid consumed data and late fades reject atomically; unread controller and lookup data stay optional',()=>{
 const c=reference.initialization[0],s=input(c),before=structuredClone(s);
 const bad=structuredClone(s);bad.profileWordsB330[2]=3;
 assert.throws(()=>prepareNativeEndingMenuInitializationUpdate(bad,{riderOrderEabb0:c.order}),/difficulty/);
 bad.profileWordsB330[2]=0;bad.endingMenuWords6d50[ix(0x6d54)]=8;
 assert.throws(()=>prepareNativeEndingMenuInitializationUpdate(bad,{riderOrderEabb0:c.order}),/eight-course/);
 const noRows=prepareNativeEndingMenuInitializationUpdate(s);assert.equal(noRows.state.endingMenuWords6d50[ix(0x6e7c)],0xffffffff);
 const inactive={endingMenuWords6d50:Array(126).fill(0)};assert.deepEqual(prepareNativeEndingMenuInput(inactive).operations,[]);
 bad.endingMenuWords6d50[ix(0x6df4)]=1;bad.menuWordsE658[0]=0x8000;const unchanged=structuredClone(bad);
 assert.throws(()=>prepareNativeEndingMenuInputUpdate(bad),/fadeTemplate/);assert.deepEqual(bad,unchanged);assert.deepEqual(s,before);
});
