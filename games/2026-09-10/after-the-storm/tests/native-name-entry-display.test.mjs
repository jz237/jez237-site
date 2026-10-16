import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeNameEntryDisplay as prepare} from '../native-name-entry.js';
import {createNativeRaceState,prepareNativeNameEntryDisplayUpdate as update,prepareNativeRaceMenuInitializationUpdate as menu} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4;
function fixture(){
 const state={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),profileWordsB330:Array(52).fill(0),
  nameEntryWords61c4:Array(14).fill(0),menuWordsE658:Array(21).fill(0),deviceWords4308:Array(10).fill(0),saveWordsB280:Array(34).fill(0),
  scene:{initLatch63c:1,fieldAb2c:8,gameStateAb24:100,courseIndex:1,mode608:0,reverseDab68:0,nameIndexA9b0:0,freshNameAb6c:0}};
 state.hudWords7788[hi(0x88e8)]=0x41424300;
 const views={controllerPort4330:0,externalReturns:Object.fromEntries(['80093f78','8008fb74','801e2058','80094a44','80090f58','801e229c'].map((v,i)=>[v,0x81000000+i*0x20])),
  championshipCourseRowsAc14:[[0,1,2,3,4,5,6,7],[1,1,1,1,1,1,1,1],[2,3,4,5,6,7,8,9]],
  fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
 return {state,views};
}

test('display clears the latch before drawing and retains the last drawing head across input',()=>{
 const {state,views}=fixture(),q=update(createNativeRaceState(state),views);
 assert.deepEqual(q.operations.slice(0,2),[{kind:'sourceWordWrite',field:'initLatch63c',value:0},{kind:'sourceWordWrite',field:'fieldAb2c',value:0}]);
 assert.equal(q.displayListHead,views.externalReturns['801e229c']);assert.equal(q.operations.at(-1).consumer,'801e2530');
 assert.deepEqual(q.operations.filter(o=>o.kind==='presentationWordWrite'),[
  {kind:'presentationWordWrite',address:views.externalReturns['801e2058'],width:4,value:0x01020040},
  {kind:'presentationWordWrite',address:views.externalReturns['801e2058']+4,width:4,value:0x8011f820}]);
 assert.equal(q.state.scene.initLatch63c,0);assert.equal(state.scene.initLatch63c,1);
});

test('only signed fade completion1 permits the championship save loop and continuation',()=>{
 for(const fade of [0,1,2,65535]){
  const {state,views}=fixture();state.scene.gameStateAb24=101;state.scene.mode608=4;state.hudWords7788[hi(0x8a14)]=0x88880000+fade;
  state.profileWordsB330[1]=2;state.profileWordsB330[2]=1;state.raceWords1f94[ri(0x2664)]=2;
  const q=update(state,views),saveCalls=q.effects.filter(o=>['8007bea4','801ec500'].includes(o.consumer));
  assert.deepEqual(saveCalls.map(o=>o.consumer),fade===1?['8007bea4','8007bea4','8007bea4','801ec500']:[]);
  if(fade===1)assert.deepEqual(saveCalls.slice(0,3).map(o=>o.arguments),[[1],[1],[1]]);
 }
});

test('reverse chooses the alternate storage call and either nonzero rank or lap qualifies',()=>{
 const {state,views}=fixture();state.scene.gameStateAb24=101;state.scene.mode608=4;state.scene.reverseDab68=65535;
 state.hudWords7788[hi(0x8a14)]=1;state.profileWordsB330[1]=1;state.raceWords1f94[ri(0x2690)]=0xffffffff;state.raceWords1f94[ri(0x2664)]=2;
 assert.deepEqual(update(state,views).effects.filter(o=>o.consumer==='8007c204').map(o=>o.arguments),[[0],[1]]);
});

test('expanded input and record bytes execute after drawing and before pending formatting/menu calls',()=>{
 const {state,views}=fixture();state.nameEntryWords61c4[1]=5;state.raceWords1f94[ri(0x2664)]=1;
 const q=update(state,views,{expandInput:true,expandRecords:true}),ops=q.operations;
 assert.equal(ops.some(o=>['801e2530','801e2c14'].includes(o.consumer)),false);
 const lastDraw=ops.findIndex(o=>o.consumer==='801e229c'),write=ops.findIndex(o=>o.kind==='raceByteWrite'),format=ops.findIndex(o=>o.consumer==='800ca210');
 assert.ok(lastDraw<write&&write<format);assert.equal(ops.at(-1).consumer,'801ec20c');assert.equal(q.displayListHead,views.externalReturns['801e229c']);
 assert.equal(q.state.raceWords1f94[ri(0x1ff0+60+16)],0x41424300);assert.equal(q.diagnostic.recordsPersisted,false);
});

test('blank expanded exit restores profile initials before formatting is requested',()=>{
 const {state,views}=fixture();state.hudWords7788[hi(0x88e8)]=0;state.saveWordsB280[6]=0x58495a00;state.nameEntryWords61c4[1]=5;
 const q=update(state,views,{expandInput:true,expandRecords:true});assert.equal(q.state.hudWords7788[hi(0x88e8)],0x58495a00);
 assert.equal(q.state.scene.freshNameAb6c,1);assert.equal(q.effects.at(-2).consumer,'800ca210');
});

test('unreached fade/profile state is not read while game100 dispatches input',()=>{
 const {state,views}=fixture();Object.defineProperty(state,'hudWords7788',{get(){throw Error('unreached');}});
 Object.defineProperty(state.scene,'mode608',{get(){throw Error('unreached');}});assert.equal(prepare(state,views).operations.at(-1).consumer,'801e2530');
});

test('late malformed display return or record data rejects without committing the cleared latch',()=>{
 const {state,views}=fixture(),before=structuredClone(state);views.externalReturns['801e229c']++;
 assert.throws(()=>update(state,views),/aligned/);assert.deepEqual(state,before);
 assert.throws(()=>update(state,views,{expandRecords:true}),TypeError);
 views.externalReturns['801e229c']--;state.nameEntryWords61c4[1]=5;state.raceWords1f94[ri(0x2664)]=4;
 const beforeRecord=structuredClone(state);assert.throws(()=>update(state,views,{expandInput:true,expandRecords:true}),RangeError);assert.deepEqual(state,beforeRecord);
});

test('championship name exit preserves phase/players and starts its delayed fade',()=>{
 const {state,views}=fixture();state.scene.players=2;state.scene.phase650=3;state.scene.simulation648=7;
 const q=menu(state,{consumer:'801e2b8c',returnState630:66},views);
 assert.equal(q.state.scene.gameStateAb24,101);assert.equal(q.state.scene.main638,6);assert.equal(q.state.scene.returnState630,66);
 assert.equal(q.state.scene.players,2);assert.equal(q.state.scene.phase650,3);assert.equal(q.state.scene.simulation648,7);
 assert.equal(q.state.hudWords7788[hi(0x8a18)]&65535,20);assert.equal(q.state.hudWords7788[hi(0x8a1c)]>>>16,14);
 assert.deepEqual(q.effects,[]);
});

test('completed name exit initializes championship standings without adding race phase or camera resets',()=>{
 const {state,views}=fixture();state.scene.gameStateAb24=101;state.scene.players=2;state.scene.phase650=3;state.hudWords7788[hi(0x7c80)]=99;
 const q=menu(state,{consumer:'801ec500'},views);
 assert.equal(q.state.scene.gameStateAb24,66);assert.equal(q.state.scene.main638,12);assert.equal(q.state.scene.previousGameState634,101);
 assert.equal(q.state.scene.players,1);assert.equal(q.state.scene.phase650,3);assert.equal(q.state.hudWords7788[hi(0x7c80)],99);
 assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'80096960',arguments:[2,0,1,2,3]}]);
});
