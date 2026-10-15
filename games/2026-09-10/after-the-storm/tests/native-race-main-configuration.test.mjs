import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceMainConfiguration as prepare} from '../native-race-main-configuration.js';

const sw=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const sh=(field,value)=>({kind:'sourceHalfwordWrite',field,value:value&65535});
const call=(consumer,...args)=>({kind:'externalCall',consumer,arguments:args.map(x=>x>>>0)});
const bodies=q=>q.operations.filter(o=>o.kind==='bodyTuneWordWrite');
const writes=(q,field)=>q.operations.filter(o=>o.field===field).map(o=>o.value);
const unused=()=>{throw new Error('unreached source read');};
function fixture({mode=4,course=1,difficulty=0,kind=0,players=1,profileLength=52}={}){
 const profileWordsB330=Array.from({length:profileLength},(_,i)=>0x61230000+i);profileWordsB330[2]=difficulty>>>0;
 const value={profileWordsB330,hudWords7788:Array.from({length:1442},(_,i)=>0x51230000+i),scene:{
  gameStateAb24:43,courseIndex:course,mode608:mode,pendingPlayers60c:players,participantCount60e:4,
  field61c:-1985229329,restart6f8:0,reverseDab68:0,primaryHumanIndex:0,secondaryHumanIndex:1,
  variant6f4:0,variant6f6:0,metadataCb32c:0,rngState4640:0,activity624:-1,event628:-32768,missesEnabled72e:1}};
 const source={waveRowsB308:[[kind,5,3],[1,4,4],[3,3,5]],
  courseWaves1P:[12,23,14,15,16,20,18,19,21,22],courseWavesOther:[31,32,33,34,35,36,37,38,39,40],
  avatarsA9b0:[0,1,2,3],defaultRiderTraits:[[1,2,3],[-128,-1,127],[4,5,6],[7,8,9]],
  customRiderTraits:[[9,8,7],[127,-128,0],[-3,-4,-5],[1,0,-1]],
  courseRiderTraits:Array.from({length:10},(_,c)=>Array.from({length:4},(_,a)=>[100+c*4+a,0x80000000+c*4+a,0xffffffff-a])),
  courseResourcePairs:Array.from({length:9},(_,i)=>[i,-1])};
 return {value,source};
}

test('complete direct prefix preserves prior game state and repeats state600 wave write in source order',()=>{
 const {value,source}=fixture(),q=prepare(value,source);
 assert.deepEqual(q.operations.slice(0,15),[
  sw('previousGameState634',43),sw('returnState630',0),sw('gameStateAb24',40),sw('main638',1),sw('initLatch63c',1),
  sw('field640',0),sw('field644',0),sw('fieldAb1c',0),sw('field461c',3),sw('state600',0),sw('state600',0),
  sw('wave610',23),sw('missLimit614',5),sw('lapCount618',3),sh('field72c',0)]);
 assert.equal(q.diagnostic.rngCalls,0);
});

test('kind0 selects pending signed count rather than an active-player alias and leaves RNG unread',()=>{
 for(const [pending,expected]of [[1,23],[2,32],[0,32],[-1,32],[-32768,32]]){
  const {value,source}=fixture({players:pending});value.scene.players=pending===1?2:1;
  Object.defineProperty(value.scene,'rngState4640',{get:unused});
  Object.defineProperty(source,pending===1?'courseWavesOther':'courseWaves1P',{get:unused});
  assert.deepEqual(writes(prepare(value,source),'wave610'),[expected]);
 }
});

test('constant kinds need no wave table or RNG and read only their selected configuration row',()=>{
 for(const [kind,expected]of [[1,10],[2,40]]){
  const {value,source}=fixture({mode:2,difficulty:1});source.waveRowsB308[1][0]=kind;
  for(const key of ['courseWaves1P','courseWavesOther','avatarsA9b0','defaultRiderTraits','customRiderTraits','courseRiderTraits'])Object.defineProperty(source,key,{get:unused});
  Object.defineProperty(source.waveRowsB308,0,{get:unused});Object.defineProperty(source.waveRowsB308,2,{get:unused});
  for(const key of ['rngState4640','reverseDab68','restart6f8','metadataCb32c','primaryHumanIndex','secondaryHumanIndex','variant6f4','variant6f6'])Object.defineProperty(value.scene,key,{get:unused});
  assert.deepEqual(writes(prepare(value,source),'wave610'),[expected]);
 }
});

test('kind3 consumes shared RNG before Stunt fixed-wave override and preserves every intermediate write',()=>{
 const {value,source}=fixture({mode:11,course:5,kind:3}),q=prepare(value,source);
 assert.deepEqual(q.operations.slice(9,16),[sw('state600',0),sw('state600',1),sw('rngState4640',12345),
  sw('wave610',17),sw('missLimit614',5),sw('lapCount618',3),sh('field72c',3)]);
 assert.deepEqual(writes(q,'wave610'),[17,20]);assert.deepEqual(writes(q,'wave49b0'),[17,20]);
 assert.deepEqual(writes(q,'state600'),[0,1,0]);assert.equal(q.diagnostic.rngCalls,1);
 assert.deepEqual(q.operations.filter(o=>o.kind==='profileWrite'),[{kind:'profileWrite',byteOffset:8,width:4,value:0}]);
});

test('other-difficulty Reverse bypasses wave rows/RNG and uses exact alternate-store order',()=>{
 const {value,source}=fixture({mode:0,difficulty:2});value.scene.reverseDab68=0x8000;
 for(const key of ['waveRowsB308','courseWavesOther'])Object.defineProperty(source,key,{get:unused});
 Object.defineProperty(value.scene,'rngState4640',{get:unused});
 const q=prepare(value,source);
 assert.deepEqual(q.operations.slice(10,14),[sw('missLimit614',5),sw('lapCount618',3),sh('field72c',0),sw('wave610',23)]);
 assert.equal(q.diagnostic.waveBranch,'reverse-other-difficulty');assert.equal(q.diagnostic.rngCalls,0);
});

test('Reverse difficulty0 keeps its original wave row before later difficulty2 overwrite',()=>{
 const {value,source}=fixture({kind:2});value.scene.reverseDab68=65535;
 const q=prepare(value,source),profileIndex=q.operations.findIndex(o=>o.kind==='profileWrite'&&o.width===4);
 assert.deepEqual(writes(q,'wave610'),[40]);assert.ok(profileIndex>q.operations.findIndex(o=>o.field==='wave49b0'));
 assert.deepEqual(q.operations[profileIndex],{kind:'profileWrite',byteOffset:8,width:4,value:2});
});

test('mode4 retains configured laps on ordinary entry and copies the raw word only on restart',()=>{
 const {value,source}=fixture();source.waveRowsB308[0][2]=0xfffffffd;
 assert.deepEqual(writes(prepare(value,source),'configuredLaps728'),[]);
 value.scene.restart6f8=-1;assert.deepEqual(writes(prepare(value,source),'configuredLaps728'),[0xfffffffd]);
 assert.deepEqual(writes(prepare(value,source),'field4970'),[0xcdef]);
});

test('course0 phase/simulation and Stunt readiness are distinct from activity/misses and profile selection',()=>{
 for(const [mode,course,phase,simulation,ready]of [[4,0,3,3,[0]],[0,0,3,3,[0]],[11,0,0,1,[0,1]],[11,5,0,1,[0]],[4,9,0,1,[0]]]){
  const {value,source}=fixture({mode,course}),q=prepare(value,source);
  assert.deepEqual(writes(q,'phase650'),[phase]);assert.deepEqual(writes(q,'simulation648'),[simulation]);assert.deepEqual(writes(q,'ready6fc'),ready);
  for(const field of ['activity624','event628','missesEnabled72e'])assert.deepEqual(writes(q,field),[]);
 }
});

test('all four stored body slots receive flags/avatar/traits even with zero active participants',()=>{
 const {value,source}=fixture();value.scene.participantCount60e=0;value.scene.primaryHumanIndex=2;source.avatarsA9b0=[3,2,1,0];
 const q=prepare(value,source),start=q.operations.findIndex(o=>o.kind==='profileWrite'&&o.width===2),slice=q.operations.slice(start,start+20);
 assert.equal(bodies(q).length,16);assert.equal(q.diagnostic.pendingBodyTuneWords,16);
 assert.deepEqual(slice.slice(10,15),[
  {kind:'profileWrite',byteOffset:0xcc,width:2,value:0},
  {kind:'bodyTuneWordWrite',racerIndex:2,wordIndex:0,value:1},
  {kind:'bodyTuneWordWrite',racerIndex:2,wordIndex:1,value:0xffffff80},
  {kind:'bodyTuneWordWrite',racerIndex:2,wordIndex:2,value:0xffffffff},
  {kind:'bodyTuneWordWrite',racerIndex:2,wordIndex:3,value:127}]);
 assert.deepEqual(slice.filter(o=>o.kind==='profileWrite').map(o=>o.byteOffset),[0xc8,0xca,0xcc,0xce]);
 assert.deepEqual(bodies(q).filter(o=>o.racerIndex===0).map(o=>o.value),[3,107,0x80000007,0xfffffffc]);
});

test('nonzero metadata chooses signed custom traits by selected avatar, not slot ordinal',()=>{
 const {value,source}=fixture();value.scene.primaryHumanIndex=2;value.scene.metadataCb32c=-1;source.avatarsA9b0=[3,2,1,0];
 Object.defineProperty(source,'defaultRiderTraits',{get:unused});
 assert.deepEqual(bodies(prepare(value,source)).filter(o=>o.racerIndex===2).map(o=>o.value),[1,127,0xffffff80,0]);
});

test('signed pending counts are extended to word bits; second camera requires exactly2',()=>{
 const {value,source}=fixture({players:-32768});value.scene.participantCount60e=-1;
 let q=prepare(value,source);assert.deepEqual(writes(q,'players'),[0xffff8000]);assert.deepEqual(writes(q,'racerCount'),[0xffffffff]);
 assert.equal(q.operations.filter(o=>o.kind==='hudWrite').length,1);
 value.scene.pendingPlayers60c=2;q=prepare(value,source);
 assert.deepEqual(q.operations.filter(o=>o.kind==='hudWrite'),[
  {kind:'hudWrite',byteOffset:0x7c80-0x7788,width:4,value:3},{kind:'hudWrite',byteOffset:0x7d8c-0x7788,width:4,value:3}]);
});

test('versus resource selection preserves aliased selected humans and independent variant flags',()=>{
 const {value,source}=fixture({mode:1,profileLength:50});value.scene.primaryHumanIndex=2;value.scene.secondaryHumanIndex=2;
 value.scene.variant6f4=-1;value.scene.variant6f6=0;
 const q=prepare(value,source);assert.deepEqual(q.operations.find(o=>o.consumer==='80096960'),call('80096960',4,6,2,6,2));
 assert.equal(bodies(q).length,0);assert.equal(q.operations.some(o=>o.kind==='profileWrite'),false);
});

test('other-mode resource fallback clamps only the descriptor lookup, preserving the actual audio course',()=>{
 for(const [course,row]of [[-2,0],[12,8]]){
  const {value,source}=fixture({mode:2,course,kind:2,profileLength:50});
  for(const key of ['avatarsA9b0','courseWaves1P','courseWavesOther'])Object.defineProperty(source,key,{get:unused});
  const q=prepare(value,source);assert.deepEqual(q.operations.find(o=>o.consumer==='80096960'),call('80096960',0,0,1,1,1));
  assert.deepEqual(q.operations.find(o=>o.consumer==='8009684c'),call('8009684c',0x08060000,row,-1));
  assert.deepEqual(q.operations.at(-1),call('800c21f4',7,course));assert.deepEqual(writes(q,'courseIndex'),[]);
 }
});

test('required helpers remain pending recipes at their exact positions without invented HUD writes',()=>{
 const {value,source}=fixture({players:2}),q=prepare(value,source);
 assert.deepEqual(q.operations.slice(-8),[
  call('80096960',0,0,1,2,3),call('8009684c',0x08060000,1,-1),call('801e6fb0',2,4,0),call('801e6a4c',0,0),
  {kind:'hudWrite',byteOffset:0x4f8,width:4,value:3},{kind:'hudWrite',byteOffset:0x604,width:4,value:3},sh('fieldA9ac',0),call('800c21f4',7,1)]);
 assert.equal(q.diagnostic.externalHelpersExecuted,false);assert.equal(q.diagnostic.physicalInitialization,false);
 assert.equal(q.operations.filter(o=>o.numericPrepared).length,0);
});

test('50-word profiles remain valid outside mode4; reached slot flags need52 and use big-endian halfword offsets',()=>{
 const {value,source}=fixture({mode:0,profileLength:50});assert.doesNotThrow(()=>prepare(value,source));
 value.scene.mode608=4;assert.throws(()=>prepare(value,source),/52/);
 value.profileWordsB330.push(0xa123b456,0xc789dabc);const q=prepare(value,source),flags=q.operations.filter(o=>o.kind==='profileWrite'&&o.width===2);
 assert.deepEqual(flags.map(o=>o.byteOffset),[200,202,204,206]);
 const patched=value.profileWordsB330.slice(),first=flags[0],i=first.byteOffset>>2,shift=16-(first.byteOffset&2)*8;
 patched[i]=((patched[i]&~(65535<<shift))|(first.value<<shift))>>>0;assert.equal(patched[50],0xb456);assert.equal(patched[51],0xc789dabc);
});

test('malformed late traits and indices reject atomically without mutating or freezing input owners',()=>{
 const {value,source}=fixture();source.customRiderTraits[0][2]=NaN;value.scene.metadataCb32c=1;
 const beforeValue=structuredClone(value),beforeSource=structuredClone(source);assert.throws(()=>prepare(value,source),/trait/);
 assert.deepEqual(value,beforeValue);assert.deepEqual(source,beforeSource);assert.equal(Object.isFrozen(value.profileWordsB330),false);
 source.customRiderTraits[0][2]=0;value.scene.primaryHumanIndex=4;assert.throws(()=>prepare(value,source),/primaryHumanIndex/);
});

test('sparse raw owners, unsupported kinds, unsigned Reverse violations and overlapping difficulty reject',()=>{
 for(const key of ['profileWordsB330','hudWords7788']){
  const {value,source}=fixture();delete value[key][4];assert.throws(()=>prepare(value,source),/Invalid/);
 }
 let {value,source}=fixture({kind:4});assert.throws(()=>prepare(value,source),/wave kind/);
 ({value,source}=fixture());value.scene.reverseDab68=-1;assert.throws(()=>prepare(value,source),/reverseDab68/);
 ({value,source}=fixture());value.scene.difficulty=0;assert.throws(()=>prepare(value,source),/overlap/);
 ({value,source}=fixture());source.defaultRiderTraits[0][0]=128;assert.throws(()=>prepare(value,source),/trait/);
});

test('result is detached/deeply frozen and does not add a body or duplicate persistent state',()=>{
 const {value,source}=fixture(),beforeValue=structuredClone(value),beforeSource=structuredClone(source),q=prepare(value,source);
 assert.deepEqual(Object.keys(q),['operations','diagnostic']);assert.equal(Object.isFrozen(q),true);assert.equal(Object.isFrozen(q.operations[0]),true);
 assert.equal(Object.isFrozen(q.operations.find(o=>o.kind==='externalCall').arguments),true);assert.equal(Object.isFrozen(q.diagnostic.requiredExternalConsumers),true);
 assert.deepEqual(value,beforeValue);assert.deepEqual(source,beforeSource);assert.equal(Object.isFrozen(source.avatarsA9b0),false);
});
