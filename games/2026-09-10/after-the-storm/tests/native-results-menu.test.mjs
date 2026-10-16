import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeResultsMenuInitialization as initialize,prepareNativeResultsMenuInput as input,prepareNativeResultsMenuDisplay as display} from '../native-results-menu.js';
import {createNativeRaceState,prepareNativeResultsMenuInitializationUpdate as initUpdate,prepareNativeResultsMenuDisplayUpdate as displayUpdate,prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const u=v=>v>>>0;
function fixture(){return {raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),resultsMenuWords6d30:[0,0,0,123],
 menuWordsE658:Array(21).fill(0),scene:{initLatch63c:1,gameStateAb24:50,previousGameState634:100,fieldAb2c:8,courseIndex:1,mode608:0}};}
const views={externalReturns:{'80093c44':0x81000000,'8008fb74':0x81000020,'800949b8':0x81000040,'80090f58':0x81000060,'802c5c2c':0x81000080},
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
const advance=s=>apply(s,input(s).operations).state;

test('name return slides in while direct results open centered; delay and latch are retained',()=>{
 for(const previous of [100,42]){const state=fixture();state.scene.previousGameState634=previous;
  const q=initUpdate(createNativeRaceState(state));assert.deepEqual(q.state.resultsMenuWords6d30,previous===100?[0,320,u(-264),123]:[2,20,20,123]);
  assert.equal(q.state.scene.initLatch63c,1);assert.deepEqual(state.resultsMenuWords6d30,[0,0,0,123]);
  assert.deepEqual(q.operations.map(o=>o.byteOffset),[0,4,8]);}
});

test('inactive initialization and invalid unsigned phases do not read unneeded owners',()=>{
 assert.deepEqual(initialize({scene:{initLatch63c:0}}).operations,[]);
 assert.deepEqual(initialize({scene:{initLatch63c:1,gameStateAb24:80}}).operations,[]);
 for(const phase of [5,6,0xffffffff])assert.deepEqual(input({resultsMenuWords6d30:[phase,0,0,0]}).operations,[]);
});

test('slide-in equality waits one more tick, then clamps with complementary offsets',()=>{
 let state=initUpdate(fixture()).state;state=advance(state);assert.equal(state.resultsMenuWords6d30[0],1);
 for(let i=0;i<15;i++)state=advance(state);
 assert.deepEqual(state.resultsMenuWords6d30,[1,20,20,123]);state=advance(state);
 assert.deepEqual(state.resultsMenuWords6d30,[2,20,20,123]);
});

test('confirmation reads only the combined third controller pressed word and rejects B',()=>{
 for(const [combined,accepted]of [[0,false],[0x4000,false],[0x8000,true],[0x1000,true],[0x2000,true],[0xb000,true]]){
  const state=fixture();state.resultsMenuWords6d30[0]=2;state.menuWordsE658[0]=0xb000;state.menuWordsE658[14]=0x43210000|combined;
  const q=input(state);assert.equal(q.operations.length,accepted?2:0);
  if(accepted)assert.deepEqual(q.operations.at(-1),{kind:'externalCall',consumer:'800c37f4',arguments:[0x31,0]});
 }
});

test('slide-out strict threshold resets delay before three ticks request the next menu',()=>{
 const state=fixture();state.resultsMenuWords6d30=[3,u(-244),284,123];let next=advance(state);
 assert.deepEqual(next.resultsMenuWords6d30,[3,u(-264),304,123]);next=advance(next);
 assert.deepEqual(next.resultsMenuWords6d30,[4,u(-264),304,0]);
 for(let i=0;i<2;i++){assert.equal(input(next).operations.some(o=>o.consumer==='801ec830'),false);next=advance(next);}
 assert.equal(input(next).operations.at(-1).consumer,'801ec830');
});

test('signed arithmetic wraps before slide and delay comparisons',()=>{
 for(const phase of [1,3]){const state=fixture();state.resultsMenuWords6d30=[phase,0x80000000,0,123];
  const q=advance(state);assert.equal(q.resultsMenuWords6d30[0],phase);assert.equal(q.resultsMenuWords6d30[1],0x7fffffec);
  assert.equal(q.resultsMenuWords6d30[2],u(40-0x7fffffec));}
 const state=fixture();state.resultsMenuWords6d30=[4,0,0,0x7fffffff];
 assert.deepEqual(input(state).operations,[{kind:'resultsMenuWrite',byteOffset:12,width:4,value:0x80000000}]);
});

test('ordinary first display skips controls and field reset; name return draws then dispatches',()=>{
 const state=fixture();state.scene.previousGameState634=42;const first=displayUpdate(state,views,{expandInput:true});
 assert.equal(first.state.scene.initLatch63c,0);assert.equal(first.state.scene.fieldAb2c,8);
 assert.deepEqual(first.effects.map(o=>o.consumer),['80093c44']);assert.equal(first.displayListHead,views.externalReturns['80093c44']);
 const second=displayUpdate(first.state,views,{expandInput:true});assert.equal(second.state.scene.fieldAb2c,0);assert.equal(second.state.resultsMenuWords6d30[0],1);
 const named=displayUpdate(fixture(),views,{expandInput:true});assert.deepEqual(named.effects.map(o=>o.consumer),['8008fb74','800949b8','80090f58','802c5c2c']);
 assert.equal(named.displayListHead,views.externalReturns['802c5c2c']);assert.equal(named.state.resultsMenuWords6d30[0],1);
});

test('display return heads are chained and retained through the expanded game80 exit',()=>{
 const state=fixture();state.scene.initLatch63c=0;state.resultsMenuWords6d30=[4,u(-264),304,2];
 const q=displayUpdate(state,views,{expandInput:true,expandExit:true});
 assert.equal(q.state.scene.gameStateAb24,80);assert.equal(q.state.scene.previousGameState634,50);assert.equal(q.state.scene.main638,13);
 assert.equal(q.state.scene.initLatch63c,1);assert.equal(q.displayListHead,views.externalReturns['802c5c2c']);
 assert.equal(q.operations.some(o=>['802c6b34','801ec830'].includes(o.consumer)),false);
 assert.deepEqual(q.effects.slice(0,4).map(o=>o.arguments),[[],[views.externalReturns['8008fb74'],1],[views.externalReturns['800949b8']],[views.externalReturns['80090f58']]]);
 assert.equal(state.scene.gameStateAb24,50);
});

test('invalid late graphics return or exit template leaves input state unchanged',()=>{
 const state=fixture();state.resultsMenuWords6d30=[4,0,0,2];const before=structuredClone(state);
 assert.throws(()=>displayUpdate(state,{...views,externalReturns:{...views.externalReturns,'802c5c2c':3}},{expandInput:true}),/aligned/);
 assert.throws(()=>displayUpdate(state,{externalReturns:views.externalReturns},{expandInput:true,expandExit:true}));
 assert.deepEqual(state,before);assert.throws(()=>displayUpdate(state,views,{expandExit:true}),TypeError);
 assert.throws(()=>apply(state,[{kind:'resultsMenuWrite',byteOffset:0,width:2,value:1}]),RangeError);
});

test('prepared output is deeply frozen and inactive display leaves controls untouched',()=>{
 const state=fixture();state.scene.gameStateAb24=80;const q=display(state,views);
 assert.ok(Object.isFrozen(q.operations));assert.ok(Object.isFrozen(q.operations.at(-1).arguments));
 assert.equal(q.operations.some(o=>o.consumer==='802c6b34'),false);
});
