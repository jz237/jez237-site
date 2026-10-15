import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceRiderResourceConfigurationUpdate,prepareNativeRaceCourseResourceConfigurationUpdate,
 prepareNativeRaceMainConfigurationUpdate} from '../native-race-state.js';

const hi=a=>(a-0x7788)/4,ei=a=>(a-0xe73c)/4;
function half(state,address){const offset=address-0xe73c;return state.resourceWordsE73c[offset>>>2]>>>(offset&2?0:16)&65535;}
function fixture({mode=4,players=1}={}){
 const profileWordsB330=Array.from({length:52},(_,i)=>0x64000000+i);profileWordsB330[2]=0;
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array.from({length:1442},(_,i)=>0x55000000+i),
  i1Words9440:Array.from({length:168},(_,i)=>0x66000000+i),profileWordsB330,
  resourceWordsB330:Array.from({length:20},(_,i)=>0x11000000+i),resourceWordsB538:Array.from({length:8},(_,i)=>0x22000000+i),
  resourceWordsE73c:Array.from({length:43},(_,i)=>0x33000000+i),scene:{gameStateAb24:43,mode608:mode,pendingPlayers60c:players,
   participantCount60e:4,courseIndex:1,field61c:0x89abcdef|0,restart6f8:0,reverseDab68:0,primaryHumanIndex:0,secondaryHumanIndex:1,
   variant6f4:0,variant6f6:0,metadataCb32c:0,rngState4640:0,seed6f00:31,players:1,racerCount:4,configuredLaps728:9,
   activity624:-1,event628:7,missesEnabled72e:32768}});
 const source={waveRowsB308:[[0,5,3],[1,4,4],[3,3,5]],courseWaves1P:Array(9).fill(21),courseWavesOther:Array(9).fill(32),
  avatarsA9b0:[0,1,2,3],defaultRiderTraits:Array.from({length:4},()=>[1,2,3]),
  courseRiderTraits:Array.from({length:9},()=>Array.from({length:4},()=>[4,5,6])),
  courseResourcePairs:Array.from({length:9},()=>[1,-1]),fadeTemplateWords6cc0:Array.from({length:9},(_,i)=>0x71000000+i),
  slotTemplateWords6c50:Array.from({length:11},(_,i)=>0x72000000+i),
  riderDescriptorRowsABD0:Array.from({length:16},(_,i)=>[100+i,200+i,300+i,400+i]),
  avatarLookupWordsACD0:Array.from({length:8},(_,i)=>Array.from({length:51},(_,j)=>j%8?i*100+j:0)),
  mode0BaseWordsAB90:[0xffffff80,0x01000000,0x02000000,0x03000000],mode4BaseWordsABC0:[0x04000000,0x05000000,0x06000000,0x07000000],
  courseDescriptorRowsB4a8:Array.from({length:9},(_,i)=>[500+i,600+i,700+i,800+i]),courseByteLengthWordsCE18:Array(9).fill(65)};
 return {state,source};
}

test('resource descriptors retain three independent canonical owners, including the distinct profileB330 address',()=>{
 const {state}=fixture(),copy=nativeRaceStateSnapshot(state);
 assert.equal(copy.profileWordsB330[0],0x64000000);assert.equal(copy.resourceWordsB330[0],0x11000000);
 copy.resourceWordsB330[0]=0;copy.resourceWordsE73c[0]=4;
 assert.equal(state.resourceWordsB330[0],0x11000000);assert.equal(state.resourceWordsE73c[0],0x33000000);
 assert.ok(Object.isFrozen(state.resourceWordsB538));
 for(const [key,length]of [['resourceWordsB330',20],['resourceWordsB538',8],['resourceWordsE73c',43]]){
  const bad=nativeRaceStateSnapshot(state);bad[key]=Array(length-1).fill(0);assert.throws(()=>createNativeRaceState(bad),RangeError);
 }
});

test('resource halfword patches preserve their adjacent flags and reject invalid late operations atomically',()=>{
 const {state}=fixture(),before=nativeRaceStateSnapshot(state),q=prepareNativeRaceStateOperations(state,[
  {kind:'resourceWrite',owner:'resourceWordsE73c',byteOffset:4,width:2,value:65535},
  {kind:'resourceWrite',owner:'resourceWordsE73c',byteOffset:6,width:2,value:1}]);
 assert.equal(q.state.resourceWordsE73c[1],0xffff0001);assert.deepEqual(q.effects,[]);
 for(const bad of [{owner:'profileWordsB330',byteOffset:0,width:4,value:0},{owner:'resourceWordsB330',byteOffset:2,width:4,value:0},
  {owner:'resourceWordsB538',byteOffset:32,width:2,value:0},{owner:'resourceWordsE73c',byteOffset:0,width:1,value:0},
  {owner:'resourceWordsE73c',byteOffset:0,width:2,value:65536}]){
  assert.throws(()=>prepareNativeRaceStateOperations(state,[{kind:'resourceWrite',owner:'resourceWordsB330',byteOffset:0,width:4,value:0},{kind:'resourceWrite',...bad}]));
  assert.deepEqual(nativeRaceStateSnapshot(state),before);
 }
});

test('rider resources keep logical avatar IDs separate from shifted descriptor rows and relocate zero words',()=>{
 const {state,source}=fixture(),q=prepareNativeRaceRiderResourceConfigurationUpdate(state,{kind:0,avatarIndices:[2,6,2,6]},source);
 assert.equal(q.state.resourceWordsB330[0],102);assert.equal(q.state.resourceWordsB330[4],114);
 assert.equal(q.state.resourceWordsB330[2],4);assert.equal(q.state.resourceWordsB330[3],0xffffff80);
 assert.deepEqual(q.state.resourceWordsB330.slice(16),[0,0,0,0]);
 assert.deepEqual([0,1,2,3].map(i=>half(q.state,0xe740+i*4)),[2,6,2,6]);
 assert.deepEqual([0,1,2,3].map(i=>half(q.state,0xe742+i*4)),[0,1,1,1]);
 assert.equal(q.state.resourceWordsE73c[ei(0xe760)],3);assert.equal(q.state.resourceWordsE73c[ei(0xe764)],5);
 assert.equal(q.state.hudWords7788[hi(0x7a60)],0xffffff80);
 assert.equal(q.state.hudWords7788[hi(0x7a60)+12],(source.avatarLookupWordsACD0[2][12]+0xffffff80)>>>0);
 assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);assert.deepEqual(q.state.resourceWordsB538,state.resourceWordsB538);assert.deepEqual(q.effects,[]);
});

test('course sentinels retain descriptor prefixes and skip absent readonly tables',()=>{
 const {state}=fixture(),q=prepareNativeRaceCourseResourceConfigurationUpdate(state,{baseWord:0xfedcba98,resourceIndices:[-1,-1]});
 assert.deepEqual(q.state.resourceWordsB538,[state.resourceWordsB538[0],state.resourceWordsB538[1],0,0,state.resourceWordsB538[4],state.resourceWordsB538[5],0,0]);
 assert.deepEqual(q.state.resourceWordsE73c.slice(ei(0xe7d8)),[0xffffffff,0xfedcba98,0xffffffff,0xfedcba98]);
 assert.deepEqual(q.state.hudWords7788,state.hudWords7788);assert.deepEqual(q.effects,[]);
});

test('duplicate course indices keep both stores, full cursor pairs and low24 descriptor addresses through wrapping',()=>{
 const {state,source}=fixture();source.courseByteLengthWordsCE18[2]=0xffffffff;
 const q=prepareNativeRaceCourseResourceConfigurationUpdate(state,{baseWord:0xffffffe0,resourceIndices:[2,2]},source);
 assert.equal(half(q.state,0xe76c),1);
 assert.deepEqual(q.state.resourceWordsE73c.slice(ei(0xe7d8)),[2,0xffffffe0,2,0]);
 assert.equal(q.state.resourceWordsB538[3],0x00ffffe0);assert.equal(q.state.resourceWordsB538[7],0);
 const duplicateStores=q.operations.filter(o=>o.kind==='resourceWrite'&&o.owner==='resourceWordsE73c'&&o.byteOffset===0xe76c-0xe73c);
 assert.deepEqual(duplicateStores.map(o=>o.value),[0,1]);
});

test('explicit main resource expansion consumes each initializer once before fades and camera writes',()=>{
 const {state,source}=fixture(),before=nativeRaceStateSnapshot(state),q=prepareNativeRaceMainConfigurationUpdate(state,source,{expandResourceInitializers:true});
 assert.deepEqual(q.diagnostic.expandedResourceConsumers,['80096960','8009684c']);assert.deepEqual(q.diagnostic.pendingResourceConsumers,[]);
 assert.deepEqual(q.effects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['800c21f4']);assert.equal(q.effects.filter(o=>o.kind==='bodyTuneWordWrite').length,16);
 assert.equal(q.operations.some(o=>o.consumer==='80096960'||o.consumer==='8009684c'),false);
 const lastResource=q.operations.findLastIndex(o=>o.kind==='resourceWrite'),firstFade=q.operations.findIndex(o=>o.kind==='hudWrite'&&o.byteOffset===0x8a10-0x7788);
 assert.ok(lastResource<firstFade);assert.equal(q.state.hudWords7788[hi(0x7c80)],3);
 assert.equal(q.state.hudWords7788[hi(0x7a60)],source.mode0BaseWordsAB90[0]);
 assert.equal(q.state.resourceWordsB538[3],0x00060000);assert.equal(q.state.scene.configuredLaps728,9);
 assert.equal(q.diagnostic.resourceLoadingPerformed,false);assert.equal(q.diagnostic.finalAudioPending,true);assert.equal(q.diagnostic.physicalInitialization,false);
 assert.deepEqual(nativeRaceStateSnapshot(state),before);assert.deepEqual(q.state.raceWords1f94,state.raceWords1f94);assert.deepEqual(q.state.i1Words9440,state.i1Words9440);
});

test('two-player main expansion selects kind4 presentation blocks and retains canonical resource neighbors',()=>{
 const {state,source}=fixture({mode:1,players:2}),q=prepareNativeRaceMainConfigurationUpdate(state,source,{expandResourceInitializers:true});
 assert.equal(q.state.resourceWordsE73c[0],4);assert.equal(q.state.resourceWordsB330[3],source.mode4BaseWordsABC0[0]);
 assert.deepEqual([0,1,2,3].map(i=>half(q.state,0xe742+i*4)),[0,0,1,1]);
 assert.equal(q.state.hudWords7788[hi(0x7c80)],3);assert.equal(q.state.hudWords7788[hi(0x7d8c)],3);
 assert.deepEqual(q.state.profileWordsB330,state.profileWordsB330);assert.equal(q.effects.some(o=>o.kind==='bodyTuneWordWrite'),false);
 assert.equal(q.state.resourceWordsE73c[ei(0xe7a0)],state.resourceWordsE73c[ei(0xe7a0)]);
});

test('the default main contract leaves resources pending and needs no descriptor owners or source tables',()=>{
 const {state,source}=fixture(),copy=nativeRaceStateSnapshot(state);
 for(const key of ['resourceWordsB330','resourceWordsB538','resourceWordsE73c'])delete copy[key];
 for(const key of ['riderDescriptorRowsABD0','avatarLookupWordsACD0','mode0BaseWordsAB90','mode4BaseWordsABC0','courseDescriptorRowsB4a8','courseByteLengthWordsCE18'])delete source[key];
 const q=prepareNativeRaceMainConfigurationUpdate(createNativeRaceState(copy),source);
 assert.deepEqual(q.diagnostic.expandedResourceConsumers,[]);assert.deepEqual(q.diagnostic.pendingResourceConsumers,['80096960','8009684c']);
 assert.deepEqual(q.effects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['80096960','8009684c','800c21f4']);
});

test('missing retained owners or late invalid source resource transport cannot commit earlier main writes',()=>{
 for(const change of [(copy,source)=>delete copy.resourceWordsB538,(copy,source)=>source.courseResourcePairs[1]=[-2,-1],
  (copy,source)=>source.courseDescriptorRowsB4a8[1][3]=NaN,(copy,source)=>source.slotTemplateWords6c50[10]=NaN]){
  const {state,source}=fixture(),copy=nativeRaceStateSnapshot(state);source.waveRowsB308[0][0]=3;change(copy,source);
  const input=createNativeRaceState(copy),before=nativeRaceStateSnapshot(input),views=structuredClone(source);
  assert.throws(()=>prepareNativeRaceMainConfigurationUpdate(input,source,{expandResourceInitializers:true}));
  assert.deepEqual(nativeRaceStateSnapshot(input),before);assert.deepEqual(source,views);assert.equal(input.scene.rngState4640,0);
 }
 const {state,source}=fixture();assert.throws(()=>prepareNativeRaceMainConfigurationUpdate(state,source,{expandResourceInitializers:1}),TypeError);
});
