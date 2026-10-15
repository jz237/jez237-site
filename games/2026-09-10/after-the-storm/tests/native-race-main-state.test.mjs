import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceMainConfigurationUpdate,
 prepareNativeRaceI1Update,prepareNativeRaceI1DisplayUpdate} from '../native-race-state.js';
const hi=a=>(a-0x7788)/4,ii=a=>(a-0x9440)/4;
function fixture({mode=4,course=1,difficulty=0,kind=0,players=1,restart=0,reverse=0,profileLength=52}={}){
 const profileWordsB330=Array.from({length:profileLength},(_,i)=>0x65000000+i);profileWordsB330[2]=difficulty;
 const i1Words9440=Array(168).fill(0);i1Words9440[ii(0x94f0)]=1;
 for(let i=0;i<33;i++)i1Words9440[ii(0x9444)+i]=0xffffffff;
 for(let i=0;i<9;i++)i1Words9440[ii(0x94c8)+i]=i>=6?0xffffffff:0;
 [5,6,7].forEach((v,i)=>i1Words9440[ii(0x9514)+i]=v);
 const state=createNativeRaceState({raceWords1f94:Array.from({length:1693},(_,i)=>0x43000000+i),
  hudWords7788:Array.from({length:1442},(_,i)=>0x54000000+i),profileWordsB330,i1Words9440,scene:{
   gameStateAb24:43,mode608:mode,pendingPlayers60c:players,participantCount60e:4,courseIndex:course,
   field61c:0x89abcdef|0,restart6f8:restart,reverseDab68:reverse,primaryHumanIndex:0,secondaryHumanIndex:1,
   variant6f4:0,variant6f6:0,metadataCb32c:0,rngState4640:0,seed6f00:31,
   players:1,racerCount:4,configuredLaps728:9,activity624:-1,event628:7,specialAb64:0,missesEnabled72e:0x8000}});
 const source={waveRowsB308:[[kind,5,3],[1,4,4],[3,3,5]],
  courseWaves1P:[12,23,14,15,16,20,18,19,21,22],courseWavesOther:[31,32,33,34,35,36,37,38,39,40],
  avatarsA9b0:[0,1,2,3],defaultRiderTraits:[[1,2,3],[-128,-1,127],[4,5,6],[7,8,9]],
  customRiderTraits:[[9,8,7],[127,-128,0],[-3,-4,-5],[1,0,-1]],
  courseRiderTraits:Array.from({length:10},(_,c)=>Array.from({length:4},(_,a)=>[100+c*4+a,0x80000000+c*4+a,0xffffffff-a])),
  courseResourcePairs:Array.from({length:9},(_,i)=>[i%8,-1]),
  fadeTemplateWords6cc0:[0x10203040,0xaabbccdd,0x50607080,0x90a0b0c0,0xd0e0f001,0x01020304,0x11121314,0x21222324,0x31323334],
  slotTemplateWords6c50:Array.from({length:11},(_,i)=>0x72000000+i)};
 return {state,source};
}

test('main configuration and reached fades share canonical owners while required resource/body/audio effects stay ordered',()=>{
 const {state,source}=fixture(),before=nativeRaceStateSnapshot(state),q=prepareNativeRaceMainConfigurationUpdate(state,source);
 assert.equal(q.state.scene.previousGameState634,43);assert.equal(q.state.scene.gameStateAb24,40);assert.equal(q.state.scene.main638,1);assert.equal(q.state.scene.initLatch63c,1);
 assert.equal(q.state.scene.configuredLaps728,9);assert.equal(q.state.scene.field4970,0xcdef);assert.equal(q.state.scene.wave49b0,23);
 assert.equal(q.state.scene.activity624,-1);assert.equal(q.state.scene.event628,7);assert.equal(q.state.scene.missesEnabled72e,0x8000);assert.equal(q.state.scene.seed6f00,31);
 assert.deepEqual(q.state.profileWordsB330.slice(50),[0,0]);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);
 assert.equal(q.effects.filter(o=>o.kind==='bodyTuneWordWrite').length,16);
 assert.deepEqual(q.effects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['80096960','8009684c','800c21f4']);
 assert.deepEqual(q.diagnostic.expandedFadeConsumers,['801e6fb0','801e6a4c']);
 assert.equal(q.operations.some(o=>o.consumer==='801e6fb0'||o.consumer==='801e6a4c'),false);
 assert.equal(q.state.hudWords7788[hi(0x8a10)],0x00020000);assert.equal(q.state.hudWords7788[hi(0x8a14)],0xaabbccdd);
 assert.deepEqual(q.state.hudWords7788.slice(hi(0x8930),hi(0x8930)+11),source.slotTemplateWords6c50);
 assert.equal(q.state.hudWords7788[hi(0x7c80)],3);assert.equal(q.state.hudWords7788[hi(0x7d8c)],state.hudWords7788[hi(0x7d8c)]);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);assert.equal(q.diagnostic.finalAudioPending,true);assert.equal(q.diagnostic.physicalInitialization,false);
});

test('Stunt consumes the old class random wave before fixed override and changes the shared difficulty afterward',()=>{
 const {state,source}=fixture({mode:11,course:5,kind:3}),q=prepareNativeRaceMainConfigurationUpdate(state,source);
 assert.equal(q.state.scene.rngState4640,12345);assert.equal(q.diagnostic.sourceMain.rngCalls,1);
 assert.deepEqual(q.operations.filter(o=>o.field==='wave610').map(o=>o.value),[17,20]);
 assert.equal(q.state.scene.wave49b0,20);assert.equal(q.state.profileWordsB330[2],0);assert.equal(q.state.scene.configuredLaps728,1);
 assert.deepEqual(q.state.profileWordsB330.slice(50),state.profileWordsB330.slice(50));assert.equal(q.effects.some(o=>o.kind==='bodyTuneWordWrite'),false);
});

test('Reverse keeps the old wave choice and the following prepared initializer reads the new canonical class',()=>{
 const {state,source}=fixture({course:0,kind:2,reverse:65535}),configured=prepareNativeRaceMainConfigurationUpdate(state,source);
 assert.equal(configured.state.scene.wave49b0,40);assert.equal(configured.state.profileWordsB330[2],2);
 assert.equal(configured.state.scene.phase650,3);assert.equal(configured.state.scene.simulation648,3);
 const updated=prepareNativeRaceI1Update(configured.state);
 assert.equal(updated.state.i1Words9440[ii(0x96cc)],7);assert.equal(updated.state.scene.initLatch63c,1);
 const shown=prepareNativeRaceI1DisplayUpdate(updated.state);
 assert.equal(shown.state.scene.initLatch63c,0);assert.equal(shown.displayListHead,null);
 assert.deepEqual(shown.effects,[{kind:'externalCall',consumer:'80093c44',arguments:[]}]);
 assert.equal(state.profileWordsB330[2],0);
});

test('two-player aliased source selectors retain independent variants and both actual camera mode words',()=>{
 const {state,source}=fixture({mode:1,players:2,profileLength:50}),copy=nativeRaceStateSnapshot(state);
 Object.assign(copy.scene,{primaryHumanIndex:2,secondaryHumanIndex:2,variant6f4:-1});
 const q=prepareNativeRaceMainConfigurationUpdate(createNativeRaceState(copy),source);
 assert.deepEqual(q.effects.find(o=>o.consumer==='80096960').arguments,[4,6,2,6,2]);
 assert.equal(q.state.scene.players,2);assert.equal(q.state.hudWords7788[hi(0x7c80)],3);assert.equal(q.state.hudWords7788[hi(0x7d8c)],3);
 assert.equal(q.state.profileWordsB330.length,50);assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);
});

test('only restart mode4 overwrites retained configured laps and all stored body slots still receive tune effects',()=>{
 const {state,source}=fixture({restart:-1}),copy=nativeRaceStateSnapshot(state);copy.scene.participantCount60e=0;
 const q=prepareNativeRaceMainConfigurationUpdate(createNativeRaceState(copy),source);
 assert.equal(q.state.scene.configuredLaps728,3);assert.equal(q.state.scene.racerCount,0);
 assert.deepEqual([...new Set(q.effects.filter(o=>o.kind==='bodyTuneWordWrite').map(o=>o.racerIndex))],[0,1,2,3]);
});

test('bounded canonical race storage rejects unsupported signed pending-count transport without clamping',()=>{
 const {state,source}=fixture({players:0}),before=nativeRaceStateSnapshot(state);
 assert.throws(()=>prepareNativeRaceMainConfigurationUpdate(state,source),/source word players/);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 const next=nativeRaceStateSnapshot(state);next.scene.pendingPlayers60c=1;next.scene.participantCount60e=-32768;
 const invalid=createNativeRaceState(next),saved=nativeRaceStateSnapshot(invalid);
 assert.throws(()=>prepareNativeRaceMainConfigurationUpdate(invalid,source),/source word racerCount/);assert.deepEqual(nativeRaceStateSnapshot(invalid),saved);
});

test('late fade dependencies cannot commit previous flag/tune/RNG/configuration writes',()=>{
 const {state,source}=fixture({kind:3}),before=nativeRaceStateSnapshot(state);delete source.slotTemplateWords6c50;
 assert.throws(()=>prepareNativeRaceMainConfigurationUpdate(state,source),/slotTemplateWords6c50/);assert.deepEqual(nativeRaceStateSnapshot(state),before);
 assert.equal(state.scene.rngState4640,0);assert.notDeepEqual(state.profileWordsB330.slice(50),[0,0]);
});

test('prepared configuration detaches inputs and never freezes caller tables or invents a persistent body owner',()=>{
 const {state,source}=fixture(),saved=structuredClone(source),q=prepareNativeRaceMainConfigurationUpdate(state,source);
 assert.deepEqual(source,saved);assert.equal(Object.isFrozen(source.fadeTemplateWords6cc0),false);
 source.fadeTemplateWords6cc0[1]=0;assert.equal(q.state.hudWords7788[hi(0x8a14)],0xaabbccdd);
 assert.ok(Object.isFrozen(q.effects[0]));assert.ok(Object.isFrozen(q.state.profileWordsB330));assert.equal(Object.hasOwn(q.state,'bodyTuneWordsB68'),false);
});
