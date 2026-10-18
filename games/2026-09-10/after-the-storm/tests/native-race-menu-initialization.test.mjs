import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceMenuInitialization as entry} from '../native-race-menu-initialization.js';
import {createNativeRaceState,prepareNativeRaceMenuInitializationUpdate as update} from '../native-race-state.js';
const run=(consumer,gameStateAb24=42,mode608=0)=>entry({scene:{gameStateAb24,mode608}},{consumer});
const calls=q=>q.operations.filter(o=>o.kind==='externalCall');
const names=q=>calls(q).map(o=>o.consumer);
const templates={fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
const h=a=>(a-0x7788)/4;
function fixture(game=42,mode=0){return createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0x12345678),
 scene:{gameStateAb24:game,mode608:mode,players:2,racerCount:4,activity624:-1},
 resourceWordsB330:Array(20).fill(0),resourceWordsE73c:Array(43).fill(0)});}
function resources(){return {...templates,mode2BaseWordsABA0:[100,200,300,400],
 riderDescriptorRowsABD0:Array.from({length:16},(_,i)=>[10+i,20+i,30+i,40+i]),
 avatarLookupWordsACD0:Array.from({length:8},(_,i)=>Array.from({length:51},(_,j)=>i*1000+j))};}

test('normal results skip resource and fade initialization when returning from name entry',()=>{
 assert.deepEqual(names(run('801ec20c',100)),['800c21f4']);
 assert.deepEqual(calls(run('801ec20c')), [
  {kind:'externalCall',consumer:'80096960',arguments:[2,0,1,2,3]},
  {kind:'externalCall',consumer:'801e6fb0',arguments:[4,1,0]},
  {kind:'externalCall',consumer:'801e6a4c',arguments:[0,0]},
  {kind:'externalCall',consumer:'800c21f4',arguments:[3,0]}]);
});

test('retirement curtain distinguishes championship state67 from result states50/57',()=>{
 for(const mode of [0,1,4,11])for(const game of [42,50,57,67,100]){
  const q=run('801ec830',game,mode),curtain=mode===4?game===67:game!==50&&game!==57;
  assert.deepEqual(names(q),curtain?['801e6fb0','800c6ad0','801e6a4c']:['801e6a4c']);
  assert.equal(q.operations.at(-1).kind,'hudWrite');
 }
});

test('name entry resources depend on mode and fade depends independently on previous state',()=>{
 for(const mode of [0,1,4,11])for(const game of [41,42,103]){
  const q=run('801ec9c8',game,mode),cs=calls(q);
  assert.equal(cs.some(o=>o.consumer==='80096960'),mode===0||mode===11);
  assert.deepEqual(cs.find(o=>o.consumer==='801e6fb0')?.arguments,game===103?[7,20,0]:game===42?[4,1,0]:undefined);
  assert.deepEqual(cs.at(-1),{kind:'externalCall',consumer:'800c21f4',arguments:[12,0]});
 }
});

test('versus initializes phase fields after both fade calls; other menus do so before calls',()=>{
 for(const [consumer,game,main]of [['801ec20c',50,3],['801ec830',80,13],['801ec9c8',100,6],['801ece50',54,18]]){
  const q=run(consumer),ops=q.operations;
  assert.deepEqual(ops.slice(0,3),[
   {kind:'sourceWordWrite',field:'previousGameState634',value:42},
   {kind:'sourceWordWrite',field:'returnState630',value:0},
   {kind:'sourceWordWrite',field:'gameStateAb24',value:game}]);
  assert.equal(ops.find(o=>o.field==='main638').value,main);
  const phase=ops.findIndex(o=>o.field==='simulation648'),firstCall=ops.findIndex(o=>o.kind==='externalCall');
  assert.equal(phase>firstCall,consumer==='801ece50');
  if(consumer==='801ece50')assert.deepEqual(ops.slice(10,12).map(o=>o.consumer),['801e6fb0','801e6a4c']);
 }
});

test('only reached scene values are read and detached patches are deeply frozen',()=>{
 const scene={gameStateAb24:100};Object.defineProperty(scene,'mode608',{get(){throw Error('unreached');}});
 for(const consumer of ['801ec20c','801ece50']){
  const q=entry({scene},{consumer});assert.ok(Object.isFrozen(q.operations));assert.ok(Object.isFrozen(calls(q)[0].arguments));
  assert.equal(scene.gameStateAb24,100);
 }
 assert.throws(()=>entry({scene},{consumer:'801ec830'}),/unreached/);
 for(const consumer of ['__proto__','unknown',null])assert.throws(()=>run(consumer),/consumer/);
 assert.throws(()=>run('801ec20c',NaN),/gameState/);
});

test('canonical menus share scene and HUD owners while retaining pending resource/audio effects',()=>{
 const state=fixture(),before=structuredClone(state),q=update(state,{consumer:'801ec9c8'},templates);
 assert.equal(q.state.scene.gameStateAb24,100);assert.equal(q.state.scene.previousGameState634,42);
 assert.equal(q.state.scene.players,1);assert.equal(q.state.scene.racerCount,4);
 assert.equal(q.state.hudWords7788[h(0x7c80)],1);assert.equal(q.state.hudWords7788[h(0x8a10)]>>>16,4);
 assert.deepEqual(q.diagnostic.expandedConsumers,['801e6fb0','801e6a4c']);
 assert.deepEqual(q.diagnostic.pendingConsumers,['80096960','800c21f4']);
 assert.deepEqual(q.state.resourceWordsB330,state.resourceWordsB330);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);
 assert.deepEqual(state,before);assert.equal(q.diagnostic.menuLoopExecuted,false);assert.equal(q.diagnostic.recordsPersisted,false);
});

test('explicit resource expansion occurs once before fade reset and preserves unrelated presentation blocks',()=>{
 const state=fixture(),q=update(state,{consumer:'801ec20c'},resources(),{expandResourceInitializers:true});
 assert.deepEqual(q.diagnostic.expandedConsumers,['80096960','801e6fb0','801e6a4c']);
 assert.deepEqual(q.diagnostic.pendingConsumers,['800c21f4']);
 assert.equal(q.operations.some(o=>o.consumer==='80096960'),false);
 assert.equal(q.state.resourceWordsE73c[0],2);
 assert.deepEqual([0,1,2,3].map(i=>q.state.resourceWordsB330[i*4]),[10,11,12,13]);
 assert.equal(q.state.hudWords7788[h(0x7a60)],100);
 assert.equal(q.state.hudWords7788[h(0x7a60)+68],state.hudWords7788[h(0x7a60)+68]);
 const lastResource=q.operations.findLastIndex(o=>o.kind==='resourceWrite'),fade=q.operations.findIndex(o=>o.kind==='hudWrite'&&o.byteOffset===0x8a10-0x7788);
 assert.ok(lastResource<fade);assert.equal(q.diagnostic.resourceLoadingPerformed,false);
});

test('returning from name entry needs no templates or resources; late failures cannot commit scene changes',()=>{
 assert.doesNotThrow(()=>update(fixture(100),{consumer:'801ec20c'},{},{expandResourceInitializers:true}));
 for(const change of [v=>delete v.mode2BaseWordsABA0,v=>v.avatarLookupWordsACD0[3][16]=NaN,v=>v.slotTemplateWords6c50=Array(10).fill(0)]){
  const state=fixture(),before=structuredClone(state),views=resources();change(views);
  assert.throws(()=>update(state,{consumer:'801ec9c8'},views,{expandResourceInitializers:true}));assert.deepEqual(state,before);
 }
 assert.throws(()=>update(fixture(),{consumer:'801ece50'},templates,{expandResourceInitializers:1}),TypeError);
});


test('Stunt result-menu entry matches 105 original executions with every ordered write and call',()=>{
 const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-result-menu-reference.json',import.meta.url)));
 assert.equal(reference.cases.length,105);
 for(const c of reference.cases)assert.deepEqual(entry(c.value,c.input).operations,c.operations);
 const q=update(fixture(42,11),{consumer:'801ecf18'},resources(),{expandResourceInitializers:true});
 assert.equal(q.state.scene.gameStateAb24,56);assert.equal(q.state.scene.main638,22);
 assert.equal(q.state.scene.phase650,0);assert.equal(q.state.scene.simulation648,1);
 assert.deepEqual(q.diagnostic.expandedConsumers,['80096960','801e6fb0','801e6a4c']);
 assert.deepEqual(q.diagnostic.pendingConsumers,['800c21f4','800c6ad0']);
});
