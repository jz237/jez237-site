import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRecordsBrowserInput as input,prepareNativeRecordsBrowserUpdate as update,prepareNativeRecordsBrowserPostDisplay as post} from '../native-records-browser.js';
import {prepareNativeRecordsBrowserInputUpdate,prepareNativeRecordsBrowserAdvance,prepareNativeRecordsBrowserPostDisplayUpdate,prepareNativeRaceStateOperations} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-records-browser.json',import.meta.url),'utf8'));
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const ix=a=>(a-0x80c0)/4,views={courseOrderAad8:reference.courseOrderAad8,transformWord821c:0x3f000000,
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]};
function fixture(){
 const s=structuredClone(seed);Object.assign(s.scene,{gameStateAb24:66,main638:12,initLatch63c:0,fieldAa08:0});
 s.recordsBrowserWords80c0=Array(62).fill(0);s.recordsBrowserWords80c0[ix(0x80ec)]=10;return s;
}

test('records controls match2196 original executions including descriptors, exit writes and sound order',()=>{
 for(const c of reference.controls){
  const words=[...reference.baseRecords];for(const [i,v]of c.overrides)words[i]=v;
  const s={recordsBrowserWords80c0:words,menuWordsE658:[c.pressed,...Array(20).fill(0)],scene:{gameStateAb24:66,fieldAa08:c.fieldAa08}},before=structuredClone(s);
  assert.deepEqual(input(s,views).operations,c.operations);assert.deepEqual(s,before);
 }
});

test('entry, signed slides and all ordered viewport recipes match240 original executions',()=>{
 for(const c of reference.updates){
  const a=c.input,s={recordsBrowserWords80c0:a.recordsBrowserWords80c0,
   scene:{gameStateAb24:a.state,initLatch63c:a.latch,previousGameState634:a.previous,reverseDab68:a.reverse},saveWordsB280:[(a.flags<<24)>>>0,...Array(33).fill(0)]};
  const before=structuredClone(s),q=update(s,a);
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(q.presentation,c.presentation);assert.deepEqual(s,before);
 }
});

test('post-display matches96 original executions and reads only the reached slide or fade owner',()=>{
 for(const c of reference.post){
  const s=fixture();s.scene.gameStateAb24=c.state;s.scene.returnState630=c.destination;
  s.recordsBrowserWords80c0[ix(0x80dc)]=c.slide>>>0;s.hudWords7788[(0x8a14-0x7788)/4]=c.fade;
  assert.deepEqual(post(s).operations,c.operations);
 }
 assert.deepEqual(post({scene:{gameStateAb24:66},recordsBrowserWords80c0:Array(62).fill(0)}).operations,[{kind:'externalCall',consumer:'802c5e5c',arguments:[]}]);
});

test('horizontal slides take11 updates, block controls in transit and accept new input on the settling frame',()=>{
 let s=fixture();s.menuWordsE658[0]=0x8000;
 let q=prepareNativeRecordsBrowserInputUpdate(s,views);assert.equal(q.state.recordsBrowserWords80c0[ix(0x80c0)],1);
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x80c8)],1);
 q=prepareNativeRecordsBrowserInputUpdate(q.state,views);s=q.state;
 assert.equal(s.recordsBrowserWords80c0[ix(0x80dc)],2);
 for(let tick=1;tick<=11;tick++){
  const advance=prepareNativeRecordsBrowserAdvance(s,views);s=advance.state;
  assert.equal(s.recordsBrowserWords80c0[ix(0x80dc)],tick<11?2:0);
  assert.equal(advance.presentation.filter(o=>o.kind==='riderViewport').length,8);
  if(tick<11)assert.deepEqual(prepareNativeRecordsBrowserPostDisplayUpdate(s,views,{expandInput:true}).operations,[]);
 }
 assert.equal(s.recordsBrowserWords80c0[ix(0x80ec)],views.courseOrderAad8[1]);
 assert.equal(s.recordsBrowserWords80c0[ix(0x80f0)],1);assert.equal(s.recordsBrowserWords80c0[ix(0x80e0)],0);
 s=structuredClone(s);s.menuWordsE658[0]=0x100;
 q=prepareNativeRecordsBrowserPostDisplayUpdate(s,views,{expandInput:true});
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x80dc)],2);assert.equal(q.state.recordsBrowserWords80c0[ix(0x8100)],2);
 assert.equal(q.operations.some(o=>o.consumer==='802c5e5c'),false);
});

test('vertical slides settle in8 updates and preserve the original descriptor-axis quirk',()=>{
 const s=fixture();s.recordsBrowserWords80c0[ix(0x80ec)]=1;s.recordsBrowserWords80c0[ix(0x80f0)]=1;s.recordsBrowserWords80c0[ix(0x80c8)]=1;s.menuWordsE658[0]=0x400;
 let q=prepareNativeRecordsBrowserInputUpdate(s,views);
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x80f8)],240);
 for(let tick=1;tick<=8;tick++){
  q=prepareNativeRecordsBrowserAdvance(q.state,views);
  const p=q.presentation.filter(o=>o.kind==='riderViewport');
  assert.deepEqual(p[0].viewportWords,p[4].viewportWords,'source reads descriptor X for Y too');
  assert.equal(q.state.recordsBrowserWords80c0[ix(0x80dc)],tick<8?3:0);
 }
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x80ec)],views.courseOrderAad8[2]);
});

test('post-name entry retains loaded neighbors and initializes reverse browsing without changing records',()=>{
 const s=fixture();s.scene.initLatch63c=1;s.scene.previousGameState634=101;s.scene.reverseDab68=1;
 s.saveWordsB280[0]=0x08000000;s.recordsBrowserWords80c0[ix(0x81b0)]=0xabcdef01;
 const before=structuredClone(s),q=prepareNativeRecordsBrowserAdvance(s,views);
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x81b4)],1);assert.equal(q.state.recordsBrowserWords80c0[ix(0x81a4)],1);
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x80f0)],3);assert.equal(q.state.recordsBrowserWords80c0[ix(0x8100)],3);
 assert.equal(q.state.recordsBrowserWords80c0[ix(0x81b0)],0xabcdef01);
 assert.deepEqual(q.state.raceWords1f94,s.raceWords1f94);assert.deepEqual(q.state.profileWordsB330,s.profileWordsB330);assert.deepEqual(s,before);
});

test('late missing course/fade data and invalid canonical writes reject without partial state',()=>{
 const s=fixture();s.recordsBrowserWords80c0[ix(0x80c0)]=1;s.recordsBrowserWords80c0[ix(0x80c8)]=1;s.menuWordsE658[0]=0x8000;
 let before=structuredClone(s);assert.throws(()=>prepareNativeRecordsBrowserInputUpdate(s,{}),/courseOrder/);assert.deepEqual(s,before);
 s.recordsBrowserWords80c0[ix(0x80ec)]=1;s.recordsBrowserWords80c0[ix(0x81a4)]=1;before=structuredClone(s);
 assert.throws(()=>prepareNativeRecordsBrowserInputUpdate(s,{...views,fadeTemplateWords6cc0:[]}),/fadeTemplate/);assert.deepEqual(s,before);
 const q=prepareNativeRecordsBrowserInputUpdate(s,views);
 assert.equal(q.state.scene.gameStateAb24,67);assert.equal(q.state.scene.returnState630,80);
 assert.equal(q.state.hudWords7788[(0x8a10-0x7788)/4]>>>16,1);assert.equal(q.operations.some(o=>o.consumer==='801e6fb0'),false);
 for(const byteOffset of [-4,2,248])assert.throws(()=>prepareNativeRaceStateOperations(s,[{kind:'recordsBrowserWrite',byteOffset,width:4,value:1}]),RangeError);
 assert.deepEqual(s,before);
});
