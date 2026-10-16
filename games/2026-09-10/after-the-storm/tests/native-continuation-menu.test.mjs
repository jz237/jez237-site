import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeContinuationMenuInitialization as initialize,prepareNativeContinuationMenuInput as input,prepareNativeContinuationMenuDisplay as display} from '../native-continuation-menu.js';
import {prepareNativeContinuationMenuInitializationUpdate as initUpdate,prepareNativeContinuationMenuInputUpdate as inputUpdate,
 prepareNativeContinuationMenuExitUpdate as exitUpdate,prepareNativeContinuationMenuDisplayUpdate as displayUpdate,prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4;
function fixture(){const data=Array(20).fill(0);data.splice(13,6,40,10,20,2,30,2);
 return {raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),profileWordsB330:Array(52).fill(0),
  continuationMenuWords61e0:[1,76,76,4],continuationDataWords60f0:data,menuWordsE658:Array(21).fill(0),
  scene:{gameStateAb24:80,previousGameState634:50,initLatch63c:1,mode608:0,courseIndex:1,reverseDab68:0,returnState630:40,fieldAb2c:8}};}
const views={displayListHead:0x81000000,externalReturns:{'80093c44':0x81010000,'8008fb74':0x81010020,'800949b8':0x81010040,'80090f58':0x81010060,'802c5b70':0x81010080},
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};

test('initialization preserves loaded selection/audio and writes count4 before championship count2',()=>{
 for(const mode of [0,4])for(const previous of [42,50,57,67,100]){
  const state=fixture();state.scene.mode608=mode;state.scene.previousGameState634=previous;state.continuationDataWords60f0[0]=1;state.continuationDataWords60f0[19]=1;
  const q=initUpdate(state),immediate=mode===4?previous===67:![50,57,100].includes(previous);
  assert.deepEqual(q.state.continuationMenuWords61e0,immediate?[1,76,76,mode===4?2:4]:[0,320,(-169)>>>0,mode===4?2:4]);
  assert.deepEqual(q.state.continuationDataWords60f0,state.continuationDataWords60f0);assert.equal(q.state.scene.initLatch63c,1);
  assert.equal(q.operations[0].value,4);if(mode===4)assert.equal(q.operations[1].value,2);
 }
 assert.deepEqual(initialize({scene:{initLatch63c:0}}).operations,[]);
});

test('slide equality waits an extra tick and does not read input or loaded data',()=>{
 let state={continuationMenuWords61e0:[0,96,56,4]};let q=input(state);
 assert.deepEqual(q.operations.map(o=>o.value),[76,76]);
 state.continuationMenuWords61e0=[0,76,76,4];q=input(state);assert.deepEqual(q.operations.map(o=>o.value),[56,1,76,76]);
 state.continuationMenuWords61e0=[0,0x80000000,0,4];q=input(state);assert.equal(q.operations[0].value,0x7fffffec);assert.equal(q.operations.length,2);
});

test('first-controller confirmation precedes up/down and starts the audio latch once',()=>{
 const state=fixture();state.menuWordsE658[14]=0xb000;let q=inputUpdate(state);assert.equal(q.state.continuationMenuWords61e0[0],1);
 assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'800c30f8',arguments:[]}]);
 q=inputUpdate(q.state);assert.deepEqual(q.effects,[]);
 const confirmed=structuredClone(q.state);confirmed.menuWordsE658[0]=0xbc00;confirmed.continuationDataWords60f0[0]=2;
 q=inputUpdate(confirmed);assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'802c5e5c',arguments:[20]},{kind:'externalCall',consumer:'800c37f4',arguments:[17,0]}]);
 assert.equal(q.state.continuationDataWords60f0[0],2);
});

test('up wins simultaneous directions and selection wraps at the retained choice count',()=>{
 const state=fixture();state.continuationDataWords60f0[19]=1;state.menuWordsE658[0]=0xc00;let q=inputUpdate(state);
 assert.deepEqual(q.operations.filter(o=>o.kind==='continuationDataWrite').map(o=>o.value),[0xffffffff,3]);
 const next=structuredClone(q.state);next.menuWordsE658[0]=0x400;q=inputUpdate(next);assert.equal(q.state.continuationDataWords60f0[0],0);
 next.continuationDataWords60f0[0]=0x7fffffff;q=inputUpdate(next);assert.equal(q.state.continuationDataWords60f0[0],0x80000000);
});

test('selected ordinary and championship destinations expand into game81 plus numeric fade once',()=>{
 for(const [mode,destinations]of [[0,[40,10,20,2]],[4,[30,2]]])for(const [selected,target]of destinations.entries()){
  const state=fixture();state.scene.mode608=mode;state.continuationDataWords60f0[0]=selected;state.menuWordsE658[0]=0x8000;
  const before=structuredClone(state),q=inputUpdate(state,views,{expandExit:true});
  assert.equal(q.state.scene.previousGameState634,80);assert.equal(q.state.scene.gameStateAb24,81);assert.equal(q.state.scene.returnState630,target);
  assert.equal(q.state.scene.main638,13);assert.equal(q.state.hudWords7788[hi(0x8a10)]>>>16,5);
  assert.equal(q.operations.some(o=>['802c5e5c','801e6fb0','801e6a4c'].includes(o.consumer)),false);
  assert.equal(q.effects.at(-1).consumer,'800c37f4');assert.deepEqual(state,before);
 }
});

test('special first display calls audio then initial drawing and does not consume confirmation',()=>{
 const state=fixture();state.scene.previousGameState634=42;state.menuWordsE658[0]=0x8000;
 const q=displayUpdate(state,views,{expandInput:true,expandExit:true});assert.equal(q.state.scene.gameStateAb24,80);assert.equal(q.state.scene.fieldAb2c,8);
 assert.equal(q.state.scene.initLatch63c,0);assert.deepEqual(q.effects.map(o=>o.consumer),['800c6ad0','80093c44']);
 assert.deepEqual(q.effects[1].arguments,[views.displayListHead]);assert.equal(q.displayListHead,views.externalReturns['80093c44']);
});

test('signed fade completion exactly1 saves qualifying ordinary/reverse/stunt records before target dispatch',()=>{
 for(const [mode,reverse,consumer]of [[0,0,'8007bea4'],[0,65535,'8007c204'],[11,0,'8007c0b8'],[4,0,null]])for(const fade of [0,1,2,65535]){
  const state=fixture();state.scene.gameStateAb24=81;state.scene.mode608=mode;state.scene.reverseDab68=reverse;
  state.hudWords7788[hi(0x8a14)]=0x12340000|fade;state.raceWords1f94[ri(0x2654)]=1;state.raceWords1f94[ri(0x2928)]=1;
  const q=display(state,views);assert.equal(q.operations.some(o=>o.consumer==='8009345c'),fade===1);
  const saves=q.operations.filter(o=>['8007bea4','8007c204','8007c0b8'].includes(o.consumer));assert.deepEqual(saves.map(o=>o.consumer),fade===1&&consumer?[consumer]:[]);
  if(saves.length)assert.ok(q.operations.indexOf(saves[0])<q.operations.findIndex(o=>o.consumer==='8009345c'));
  assert.equal(q.displayListHead,views.externalReturns['802c5b70']);
 }
});

test('championship continuation retains separate zero then one profile stores for normal difficulty',()=>{
 for(const difficulty of [0,2,0xffffffff]){
  const state=fixture();state.scene.gameStateAb24=81;state.scene.mode608=4;state.scene.returnState630=30;state.hudWords7788[hi(0x8a14)]=1;state.profileWordsB330[1]=8;state.profileWordsB330[2]=difficulty;
  const q=displayUpdate(state,views);assert.equal(q.state.scene.restart6f8,1);
  assert.deepEqual(q.operations.filter(o=>o.kind==='profileWrite').map(o=>o.value),difficulty===0?[0,1]:[0]);
  assert.equal(q.effects.at(-1).consumer,'801eb91c');
 }
});

test('nested confirmation preserves the drawn head and late failures cannot commit input or fade',()=>{
 const state=fixture();state.menuWordsE658[0]=0x8000;const before=structuredClone(state);
 const q=displayUpdate(state,views,{expandInput:true,expandExit:true});assert.equal(q.state.scene.gameStateAb24,81);assert.equal(q.displayListHead,views.externalReturns['802c5b70']);
 assert.throws(()=>displayUpdate(state,{...views,slotTemplateWords6c50:[]},{expandInput:true,expandExit:true}));
 assert.deepEqual(state,before);assert.throws(()=>displayUpdate(state,views,{expandExit:true}),TypeError);
 assert.throws(()=>apply(state,[{kind:'continuationMenuWrite',width:2,byteOffset:0,value:1}]),RangeError);
 assert.throws(()=>apply(state,[{kind:'continuationDataWrite',width:4,byteOffset:80,value:1}]),RangeError);
 assert.throws(()=>exitUpdate(state,{returnState630:40},{}));
});
