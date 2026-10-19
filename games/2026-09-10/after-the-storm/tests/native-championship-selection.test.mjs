import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeChampionshipSelectionUpdate as prepare} from '../native-championship-selection.js';
import {prepareNativeChampionshipSelectionFrameUpdate as update,prepareNativeRaceStateOperations} from '../native-race-state.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-championship-selection-update.json',import.meta.url)));
function state(c){
 const m=[...fixture.baseMenu],p=[...fixture.baseProfile];m[(0x7028-0x6f84)/4]=c.menuStage>>>0;
 p.splice(0,3,...c.profile);p.splice(4,4,...c.points.map(v=>v>>>0));
 return {championshipSelectionWords6f84:m,profileWordsB330:p,raceWords1f94:[...fixture.baseRace],hudWords7788:Array(1442).fill(0),scene:{...c.scene}};
}
function digest(words){const b=Buffer.alloc(words.length*4);words.forEach((v,i)=>b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
test('336 whole original introduction updates match ordered writes, resource calls and retained owners',()=>{
 for(const [i,c]of fixture.cases.entries()){
  const s=state(c.input),before=structuredClone(s),q=prepare(s,fixture.sourceViews),out=update(s,fixture.sourceViews);
  assert.deepEqual(q.operations,c.operations,'original operation order case '+i);
  assert.deepEqual(out.state.profileWordsB330,c.finalProfile);
  assert.deepEqual(out.state.championshipSelectionWords6f84,c.finalMenu);
  assert.equal(digest(out.state.raceWords1f94),c.raceSHA256);
  assert.deepEqual(out.effects,q.operations.filter(o=>o.kind==='externalCall'));
  assert.deepEqual(s,before);assert.equal(out.diagnostic.graphicsExecuted,false);
 }
});
test('only the loaded first racing round clears totals; later rounds retain scores and record canaries',()=>{
 for(const difficulty of [0,1,2]){
  const c=fixture.cases.find(c=>c.input.profile[0]===1&&c.input.profile[1]===3&&c.input.profile[2]===difficulty);
  const later=state(c.input),out=update(later,fixture.sourceViews);
  assert.deepEqual(out.state.profileWordsB330,later.profileWordsB330);assert.deepEqual(out.state.raceWords1f94,later.raceWords1f94);
  const first=state(c.input);first.profileWordsB330[1]=[1,0,0][difficulty];
  const reset=update(first,fixture.sourceViews);
  assert.deepEqual(reset.state.profileWordsB330.slice(4,48),Array(44).fill(0));
  assert.deepEqual(reset.state.profileWordsB330.slice(48),first.profileWordsB330.slice(48));
  assert.equal(reset.state.championshipSelectionWords6f84[(0x702c-0x6f84)/4],240);
  assert.equal(reset.diagnostic.stage,0);
  // The display, not this updater, releases the entry latch.
  assert.equal(reset.state.scene.initLatch63c,1);
 }
});
test('late malformed resource or buffer inputs cannot commit reset, qualification or menu writes',()=>{
 const c=fixture.cases.find(c=>c.input.profile[0]===1&&c.input.profile[1]===1&&c.input.profile[2]===0);
 const s=state(c.input),before=structuredClone(s);
 assert.throws(()=>update(s,{...fixture.sourceViews,courseTransformAddresses:[]}),/transform/);assert.deepEqual(s,before);
 s.profileWordsB330[1]=3;const later=structuredClone(s);
 assert.throws(()=>update(s,{...fixture.sourceViews,graphicsBufferAddress:undefined}),/buffer/);assert.deepEqual(s,later);
 assert.throws(()=>prepareNativeRaceStateOperations(s,[{kind:'championshipSelectionWrite',byteOffset:172,width:4,value:0}]),/offset/);
 assert.deepEqual(s,later);
});
test('unlatched inactive stages do not read profile, qualification, course or graphics data',()=>{
 for(const stage of [-1,0,2]){
  const menu=[...fixture.baseMenu];menu[(0x7028-0x6f84)/4]=stage>>>0;
  const s={championshipSelectionWords6f84:menu,scene:{initLatch63c:0}};
  assert.deepEqual(prepare(s).operations,[]);
 }
});
