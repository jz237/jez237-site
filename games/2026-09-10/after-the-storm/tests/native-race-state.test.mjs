import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceResetLayout} from '../native-race-reset.js';
import {createNativePrimaryRacePhaseLayout} from '../native-primary-race-phase.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,prepareNativeRaceStartup,
 prepareNativeRaceCountdown,nativeRacePrimaryPhaseView,prepareNativeRacePrimaryUpdate,
 prepareNativeRacePresentationContinuation,prepareNativeRaceStatusPreludeUpdate,prepareNativeRaceBoundaryWarningUpdate,
 prepareNativeRacePrestartInitializationUpdate,prepareNativeRacePrestartStatusUpdate,prepareNativeRacePrestartStageUpdate,
 prepareNativeRaceSpeedDisplayUpdate,prepareNativeRaceMissFeedbackUpdate,prepareNativeRaceMissFeedbackPaletteUpdate,
 prepareNativeRaceDirectionWarningUpdate} from '../native-race-state.js';

const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4;
function fixture(){
 const nodes=Array.from({length:4},(_,i)=>({sourceRow:i,referenceNativeXZ:{x:0,z:i*1000},centerNativeXZ:{x:0,z:i*1000},
  forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},endpointANativeXZ:{x:100,z:i*1000},endpointBNativeXZ:{x:-100,z:i*1000},
  halfWidthNative8c:100,length88:1000,classification98:i===0?3:i%2,checkpointFlag9c:i===0?1:0,enabledC8:1,
  nextSourceRowA0:(i+1)%4,previousSourceRowA8:(i+3)%4,previousSourceRowB4:(i+3)%4,alternateNextSourceRowA4:-1,routeGroupC0:0}));
 const raceWords1f94=Array.from({length:1693},(_,i)=>0x17000000+i),hudWords7788=Array.from({length:1442},(_,i)=>0x11000000+i);
 [2,0,3,1].forEach((v,i)=>raceWords1f94[ri(0x26c0)+i]=v);
 for(const a of [0x7888,0x78c4,0x7900,0x793c])for(let i=0;i<15;i++)hudWords7788[hi(a)+i]=i*20;
 hudWords7788[hi(0x8d20)]=1;hudWords7788[hi(0x8d1c)]=2;
 const scene={cold8224:0,clockStopped817c:0,phase650:0,simulation648:1,main638:1,mode620:0,activity624:-1,
  primaryHumanIndex:0,secondaryHumanIndex:1,players:1,courseIndex:1,racerCount:4,primaryCount:4,finishSourceRow:0,
  difficulty:1,reverseDab68:0,restart6f8:0,forceFirst8228:0,demoOffset5438:0,event628:0,
  configuredLaps728:3,missLimit8174:5,noFinish8178:0,missesEnabled72e:1,state600:0,directionFlag1f90:0,
  ambientD4b00:0,fortressD8240:0,metadataD9b0:7,metadataCb32c:8};
 const reset=createNativeRaceResetLayout({nodes,boundaryNativeXZ:[],objectKinds4c:[],checkpointSeconds:90,
  checkpointSlackNative:256,recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const primary=createNativePrimaryRacePhaseLayout({nodes,regionsNative:[[-100000,100000,-100000,100000]],fortressRegionsNative:[],
  weedCentersNativeXZ:Array.from({length:6},(_,i)=>({x:50000+i*100,z:50000})),weedRadiusSquaredNative:22500,
  portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]});
 const input={samplesBySlot:Array.from({length:4},()=>({bodyPositionNative:{x:5000,y:0,z:-1000},priorBodyPointNative:{x:5000,z:-1000}}))};
 return {state:createNativeRaceState({raceWords1f94,hudWords7788,scene}),reset,primary,input};
}

test('numeric reset and its terminal share fresh places and reset flags while preserving unrelated owners',()=>{
 const c=fixture(),before=nativeRaceStateSnapshot(c.state),r=prepareNativeRaceStartup(c.reset,c.state);
 assert.deepEqual(nativeRaceStateSnapshot(c.state),before);assert.equal(r.state.scene.phase650,0);
 assert.equal(r.state.scene.clockStopped817c,1);assert.equal(r.state.hudWords7788[hi(0x8a90)],60);
 assert.equal(r.state.hudWords7788[hi(0x8d08)],0);assert.equal(r.state.hudWords7788[hi(0x8d0c)],0);
 assert.equal(r.state.hudWords7788[hi(0x8b58)],0);
 assert.deepEqual(Array.from({length:4},(_,i)=>r.state.raceWords1f94[ri(0x293c)+i*222]),[2,0,3,1]);
 assert.deepEqual(Array.from({length:4},(_,i)=>r.state.hudWords7788[hi(0x8d34)+i*5]),[48,0,76,24]);
 assert.equal(r.state.hudWords7788[hi(0x8aac)],150,'prior bank2/phase1 interpolates before the terminal clears them');
 assert.equal(r.state.hudWords7788[hi(0x8d20)],0);assert.equal(r.state.hudWords7788[hi(0x8d1c)],0);
 assert.equal(r.effects.length,128);assert(r.effects.every(v=>v.kind==='presentationBufferWrite'));
 assert.equal(Object.hasOwn(r.state,'records'),false);assert.equal(Object.hasOwn(r.state.scene,'placeChanged8a9c'),false);
});

test('one canonical clock starts after the primary phase on the launch transition',()=>{
 const c=fixture();let s=prepareNativeRaceStartup(c.reset,c.state).state;
 // A prepared original prestart setter supplies this external write. The test
 // controls that boundary explicitly; startup75310 does not invent phase1.
 s=prepareNativeRaceStateOperations(s,[{kind:'sourceWordWrite',field:'phase650',value:1}]).state;
 for(let frame=1;frame<=47;frame++){
  s=prepareNativeRacePrimaryUpdate(c.primary,s,c.input).state;
  assert.equal(prepareNativeRacePresentationContinuation(s).conditionalCalled,true);
  s=prepareNativeRaceCountdown(s,{pressedButtonsB58BySlot:[frame===47?0x8000:0,0,0,0]}).state;
  if(frame===45){assert.equal(s.scene.phase650,1);assert.equal(s.scene.clockStopped817c,1);}
  if(frame===46){assert.equal(s.scene.phase650,2);assert.equal(s.scene.clockStopped817c,0);
   assert.equal(s.raceWords1f94[ri(0x2ad4)],0,'same-frame earlier timing pass still observed stopped clock');}
 }
 assert.equal(s.raceWords1f94[ri(0x2ad4)],50);assert.equal(s.raceWords1f94[ri(0x2aa0)],50);
 assert.equal(s.raceWords1f94[ri(0x2a64)],5);assert.equal(s.raceWords1f94[ri(0x2960)],1);
 assert.equal(s.raceWords1f94[ri(0x2c4c)],1);assert.equal(s.hudWords7788[hi(0x8b58)],0x01000000);
 const view=nativeRacePrimaryPhaseView(s);assert.equal(view.recordWords2938BySlot[0][75],5);
 assert.equal(view.globals.clockStopped817c,0);assert.equal(view.globals.state650,s.scene.phase650);
});

test('rank order, per-slot projection and selected record tables return to their original addresses',()=>{
 const c=fixture();let s=prepareNativeRaceStartup(c.reset,c.state).state;
 const patch=nativeRaceStateSnapshot(s);patch.scene.mode620=4;patch.scene.phase650=3;patch.scene.configuredLaps728=1;patch.scene.clockStopped817c=0;
 for(let i=0;i<4;i++){
  const base=ri(0x2938)+i*222,put=(a,v)=>patch.raceWords1f94[base+(a-0x2938)/4]=v>>>0;
  for(const [a,v]of [[0x2938,1],[0x2958,1],[0x2aa0,65000+i*1000],[0x2aa8,70000],[0x2ad4,190000+i*1000],[0x2c58,1]])put(a,v);
 }
 const input={samplesBySlot:Array.from({length:4},()=>({bodyPositionNative:{x:-10,y:0,z:10},priorBodyPointNative:{x:-10,z:-10}}))};
 const r=prepareNativeRacePrimaryUpdate(c.primary,createNativeRaceState(patch),input),v=nativeRacePrimaryPhaseView(r.state);
 assert.deepEqual(v.orderByPlace,[0,1,2,3]);assert.deepEqual(r.state.raceWords1f94.slice(ri(0x3990),ri(0x39a0)),[0,1,2,3]);
 assert.equal(v.courseRecords.normalTimes1ff0[0][0],65025);assert.equal(r.state.raceWords1f94[ri(0x1ff0+60)],65025);
 assert.deepEqual(v.courseRecords.normalTimes1ff0[0].slice(1,4),[7,8,1]);
 assert.equal(v.courseRecords.fastLap22c0[0],65025);assert.equal(r.state.raceWords1f94[ri(0x22c0+20)],65025);
 assert.equal(v.globals.flag1fd8,1);assert.equal(r.state.raceWords1f94[ri(0x1fd8)],1);
 assert.equal(r.state.hudWords7788[hi(0x8a9c)],1);assert.equal(v.globals.placeChanged8a9c,1);
 assert.equal(r.state.raceWords1f94[ri(0x26c0)],2,'setup/grid order is not the ranking array');
});

test('post-overlay continuation reads fresh statuses and does not consume the start control itself',()=>{
 const c=fixture(),start=prepareNativeRaceStartup(c.reset,c.state).state;
 const blocked=prepareNativeRaceStateOperations(start,[{kind:'recordWordWrite',racerIndex:0,wordIndex:(0x2c24-0x2938)/4,value:1}]).state;
 assert.equal(prepareNativeRacePresentationContinuation(start).conditionalCalled,true);
 assert.equal(prepareNativeRacePresentationContinuation(blocked).conditionalCalled,false);
 assert.equal(blocked.hudWords7788[hi(0x8a90)],60);
});

test('ordered mixed patches preserve byte neighbors, record aliases and separate effects',()=>{
 const c=fixture(),ops=[{kind:'hudWrite',byteOffset:hi(0x8b58)*4,width:4,value:0x12345678},
  {kind:'hudWrite',byteOffset:hi(0x8b58)*4+2,width:1,value:0xff},
  {kind:'recordWordWrite',racerIndex:3,wordIndex:75,value:5},
  {kind:'raceWordWrite',wordIndex:ri(0x2a64+3*0x378),value:2},
  {kind:'sourceWordWrite',field:'clockStopped817c',value:0xffffffff},
  {kind:'audioEntry',consumer:'800c37f4',arguments:[0x23,0]}];
 const r=prepareNativeRaceStateOperations(c.state,ops);
 assert.equal(r.state.hudWords7788[hi(0x8b58)],0x1234ff78);
 assert.equal(r.state.raceWords1f94[ri(0x2a64)+3*222],2);assert.equal(r.state.scene.clockStopped817c,-1);
 assert.deepEqual(r.effects,[ops.at(-1)]);assert(Object.isFrozen(r.effects[0].arguments));
 assert.notEqual(c.state.hudWords7788[hi(0x8b58)],0x1234ff78);
});

test('reverse has one unsigned-halfword owner with signed reset and unsigned progress views',()=>{
 const c=fixture(),patch=nativeRaceStateSnapshot(c.state);patch.scene.reverseDab68=0xffff;
 const r=prepareNativeRaceStartup(c.reset,createNativeRaceState(patch));
 assert.equal(r.state.raceWords1f94[ri(0x1fe8)],0);assert.equal(nativeRacePrimaryPhaseView(r.state).globals.reverse,65535);
 assert.equal(r.state.scene.reverseDab68,65535);assert.equal(Object.hasOwn(r.state.scene,'reverse'),false);
});

test('the optional profile owns difficulty and halfword operations retain their actual signed views',()=>{
 const c=fixture(),patch=nativeRaceStateSnapshot(c.state);delete patch.scene.difficulty;
 patch.profileWordsB330=Array.from({length:50},(_,i)=>0x33000000+i);patch.profileWordsB330[2]=2;
 patch.i1Words9440=Array.from({length:168},(_,i)=>0x44000000+i);
 const initial=createNativeRaceState(patch),started=prepareNativeRaceStartup(c.reset,initial).state;
 assert.equal(started.raceWords1f94[ri(0x39b8)],5);assert.equal(nativeRacePrimaryPhaseView(started).globals.difficulty,2);
 const r=prepareNativeRaceStateOperations(started,[{kind:'profileWrite',byteOffset:8,width:4,value:1},
  {kind:'i1Write',byteOffset:0,width:4,value:50},{kind:'sourceHalfwordWrite',field:'activity624',value:65535},
  {kind:'sourceHalfwordWrite',field:'seed6f00',value:65535}]);
 assert.equal(nativeRacePrimaryPhaseView(r.state).globals.difficulty,1);assert.equal(r.state.i1Words9440[0],50);
 assert.equal(r.state.scene.activity624,-1);assert.equal(r.state.scene.seed6f00,65535);
 assert.equal(Object.hasOwn(r.state.scene,'difficulty'),false);assert.equal(started.profileWordsB330[2],2);
 const duplicate=nativeRaceStateSnapshot(initial);duplicate.scene.difficulty=2;
 assert.throws(()=>createNativeRaceState(duplicate),/overlaps profile/);
 assert.throws(()=>prepareNativeRaceStateOperations(initial,[{kind:'sourceHalfwordWrite',field:'players',value:2}]),/source halfword/);
});

test('source prestart waits ten display-stage calls and sees the countdown transition after update',()=>{
 const c=fixture(),patch=nativeRaceStateSnapshot(c.state);patch.i1Words9440=Array(168).fill(0x44000000);
 Object.assign(patch.scene,{mode608:0,gameStateAb24:40,initLatch63c:1});
 let s=prepareNativeRaceStartup(c.reset,createNativeRaceState(patch)).state;
 s=prepareNativeRacePrestartInitializationUpdate(s).state;assert.equal(s.i1Words9440[0],0);
 const first=prepareNativeRacePrestartStageUpdate(s);s=first.state;
 assert.equal(s.scene.initLatch63c,0);assert.equal(first.displayListHead,null);
 assert.deepEqual(first.effects,[{kind:'externalCall',consumer:'80093c44',arguments:[]}]);
 assert.equal(s.i1Words9440[0],0,'early source initialization is not a countdown call');
 for(let frame=1;frame<=57;frame++){
  s=prepareNativeRaceCountdown(s,{pressedButtonsB58BySlot:[0,0,0,0]}).state;
  s=prepareNativeRacePrestartStatusUpdate(s).state;
  if(frame===9){assert.equal(s.scene.phase650,0);assert.equal(s.i1Words9440[0],9);}
  if(frame===10){assert.equal(s.scene.phase650,1);assert.equal(s.i1Words9440[0],0xffffffff);}
  if(frame===11)assert.equal(s.hudWords7788[hi(0x8a90)],60,'first launch consumer retracts before charge');
  if(frame===55){assert.equal(s.scene.phase650,1);assert.equal(s.scene.simulation648,1);}
  if(frame===56){assert.equal(s.scene.phase650,2);assert.equal(s.scene.clockStopped817c,0);assert.equal(s.scene.simulation648,3);}
 }
 assert.equal(s.i1Words9440[0],0xffffffff);assert.equal(s.hudWords7788[hi(0x8a90)],14);
});

test('display-stage versus result event reaches the next source prelude through the same HUD owner',()=>{
 const c=fixture(),patch=nativeRaceStateSnapshot(c.state);delete patch.scene.difficulty;
 patch.profileWordsB330=Array(50).fill(0);patch.profileWordsB330[2]=1;patch.i1Words9440=Array(168).fill(0);
 Object.assign(patch.scene,{players:2,mode620:1,mode608:1,gameStateAb24:40,result6f0:0});
 let s=prepareNativeRaceStartup(c.reset,createNativeRaceState(patch)).state;
 s=prepareNativeRaceStateOperations(s,[{kind:'recordWordWrite',racerIndex:0,wordIndex:(0x2c2c-0x2938)/4,value:1},
  {kind:'recordWordWrite',racerIndex:1,wordIndex:(0x2c2c-0x2938)/4,value:1},
  {kind:'recordWordWrite',racerIndex:0,wordIndex:(0x2ad4-0x2938)/4,value:2000},
  {kind:'recordWordWrite',racerIndex:1,wordIndex:(0x2ad4-0x2938)/4,value:1000}]).state;
 const stage=prepareNativeRacePrestartStatusUpdate(s);s=stage.state;
 assert.equal(s.scene.result6f0,1);assert.equal(s.profileWordsB330[(0xb3f4-0xb330)/4],1);
 assert.equal(s.hudWords7788[hi(0x8aa8)],2);assert.equal(s.hudWords7788[hi(0x8e08)],c.state.hudWords7788[hi(0x8e08)]);
 assert.deepEqual(stage.effects,[{kind:'externalCall',consumer:'802c6fe0',arguments:[]}]);
 s=prepareNativeRaceStatusPreludeUpdate(s).state;
 assert.equal(s.hudWords7788[hi(0x8aa8)],0);assert.equal(s.hudWords7788[hi(0x8e00)],2);
 assert.equal(s.hudWords7788[hi(0x8e04)],1);assert.equal(s.hudWords7788[hi(0x8e08)],1);assert.equal(s.hudWords7788[hi(0x8e0c)],1);
});

test('actual warning expiry retires first, then the post-update status stage observes the canonical DQ',()=>{
 const c=fixture(),patch=nativeRaceStateSnapshot(c.state);patch.i1Words9440=Array(168).fill(0);
 Object.assign(patch.scene,{mode608:0,gameStateAb24:40,result6f0:0});
 let s=prepareNativeRaceStartup(c.reset,createNativeRaceState(patch)).state;
 s=prepareNativeRaceStateOperations(s,[{kind:'recordWordWrite',racerIndex:0,wordIndex:185,value:1},
  {kind:'recordWordWrite',racerIndex:0,wordIndex:186,value:1}]).state;
 const input={bodiesBySlot:[{positionNativeXZ:{x:100,z:100},field16d0:0,actorState:22}],allowedRegionsNative:[[-10,10,-10,10]]};
 s=prepareNativeRaceBoundaryWarningUpdate(s,input).state;assert.equal(s.raceWords1f94[ri(0x2c24)],0);
 s=prepareNativeRacePrestartStatusUpdate(s).state;assert.equal(s.scene.result6f0,0);
 s=prepareNativeRaceBoundaryWarningUpdate(s,input).state;assert.equal(s.raceWords1f94[ri(0x2c24)],1);
 assert.equal(nativeRacePrimaryPhaseView(s).globals.dqMetric39b4,-90000);
 const stage=prepareNativeRacePrestartStatusUpdate(s);assert.equal(stage.state.scene.result6f0,1);
 assert.deepEqual(stage.effects,[{kind:'externalCall',consumer:'802c6dcc',arguments:[]}]);
 assert.equal(prepareNativeRacePresentationContinuation(stage.state).conditionalCalled,false);
 assert.equal(stage.state.scene.clockStopped817c,1,'retirement does not invent a clock/phase transition');
});

test('speed display carries its separate16-bit seed across calls without touching canonical race power',()=>{
 const c=fixture(),patch=nativeRaceStateSnapshot(c.state);patch.scene.seed6f00=1;
 let s=prepareNativeRaceStartup(c.reset,createNativeRaceState(patch)).state;
 const input={bodyFieldsBySlot:Array.from({length:4},()=>({frameSpeedB98:10,speedBbc:20,speedBc0:10}))};
 const first=prepareNativeRaceSpeedDisplayUpdate(s,input);s=first.state;
 assert.equal(first.diagnostic.randomDraws,4);assert.equal(s.scene.seed6f00,781);
 assert.equal(s.raceWords1f94[ri(0x2c04)],28);assert.equal(s.raceWords1f94[ri(0x2c00)],4);
 assert.equal(s.raceWords1f94[ri(0x2a64)],0);assert.equal(Object.hasOwn(s.scene,'randomSeed'),false);
 const second=prepareNativeRaceSpeedDisplayUpdate(s,input);assert.equal(second.state.scene.seed6f00,29529);
 assert.equal(second.state.raceWords1f94[ri(0x2c00)],8);assert.equal(s.scene.seed6f00,781);
});

test('a last allowed buoy miss retires on the seventeenth feedback call through the shared record',()=>{
 const c=fixture();let s=prepareNativeRaceStartup(c.reset,c.state).state;
 s=prepareNativeRaceStateOperations(s,[{kind:'recordWordWrite',racerIndex:0,wordIndex:10,value:2},
  {kind:'recordWordWrite',racerIndex:0,wordIndex:77,value:5},{kind:'recordWordWrite',racerIndex:0,wordIndex:79,value:1}]).state;
 for(let frame=1;frame<=17;frame++){
  const step=prepareNativeRaceMissFeedbackUpdate(s);s=step.state;
  if(frame===1)assert.equal(s.hudWords7788[hi(0x8c44)],15);
  if(frame===16){assert.equal(s.hudWords7788[hi(0x8c44)],0);assert.equal(s.raceWords1f94[ri(0x2c24)],0);}
  if(frame===17){assert.equal(s.raceWords1f94[ri(0x2c24)],1);assert.equal(step.diagnostic.numericCalls.length,1);}
 }
 assert.equal(nativeRacePrimaryPhaseView(s).globals.dqMetric39b4,-90000);
 assert.equal(prepareNativeRacePresentationContinuation(s).conditionalCalled,false);
});

test('the separate admitted display counter advances once and keeps drawing explicitly pending',()=>{
 const c=fixture(),s=prepareNativeRaceStartup(c.reset,c.state).state;
 const first=prepareNativeRaceMissFeedbackPaletteUpdate(s),second=prepareNativeRaceMissFeedbackPaletteUpdate(first.state);
 assert.equal(first.state.hudWords7788[hi(0x8c28)],1);assert.equal(first.state.hudWords7788[hi(0x8c2c)],0);
 assert.equal(second.state.hudWords7788[hi(0x8c28)],0);assert.equal(second.state.hudWords7788[hi(0x8c2c)],1);
 assert.deepEqual(second.drawRecipe.paletteBeforeAdvance,{phase8c28:1,bank8c2c:0});
 assert.equal(second.drawRecipe.canonicalAdvancePrepared,true);assert.equal(second.diagnostic.drawingImplemented,false);
 assert.equal(second.effects.length,0);assert.deepEqual(second.state.raceWords1f94,s.raceWords1f94);
});

test('wrong-way counter audio and next-call warning share the canonical timing history',()=>{
 const c=fixture();let s=prepareNativeRaceStartup(c.reset,c.state).state;
 s=prepareNativeRaceStateOperations(s,[{kind:'recordWordWrite',racerIndex:0,wordIndex:(0x2c60-0x2938)/4,value:39},
  {kind:'sourceWordWrite',field:'phase650',value:3}]).state;
 const input={bodiesBySlot:[{positionNativeXZ:{x:0,z:-1000},forwardXZ:{x:0,z:-1},speedB90Native:20}],
  cameraIndicesByView:[0],camerasByIndex:[{positionNativeXZ:{x:0,z:-2000},directionXZ:{x:0,z:1}}],
  primaryNodesBySourceRow:c.primary.nodes,warningSuppressionRegionsNative:[],
  // Authored endpoint-only input: cosine+/-1 reads word511=0 degrees.
  // A real admitted source view must supply its actual readonly lookup table.
  angleTableWords6f08:Array(512).fill(0)};
 const first=prepareNativeRaceDirectionWarningUpdate(s,input);s=first.state;
 assert.equal(s.raceWords1f94[ri(0x2c60)],40);assert.equal(s.raceWords1f94[ri(0x2c10)],0);
 assert.equal(first.diagnostic.racers[0].priorWrongDirection2c60,39);
 assert.deepEqual(first.effects,[{kind:'audioEntry',consumer:'800c37f4',arguments:[0x35,0]}]);
 const second=prepareNativeRaceDirectionWarningUpdate(s,input);
 assert.equal(second.state.raceWords1f94[ri(0x2c60)],41);assert.equal(second.state.raceWords1f94[ri(0x2c10)],1);
 assert.equal(second.diagnostic.racers[0].priorWrongDirection2c60,40);assert.equal(second.effects.length,0);
 assert.equal(s.raceWords1f94[ri(0x2c10)],0);
});

test('the canonical owner rejects overlapping scalar aliases and applies no partial failed patch',()=>{
 const c=fixture(),before=nativeRaceStateSnapshot(c.state);
 for(const [field,value]of [['state650',1],['power2a64',5],['recordFlag8a98',1],['bestTime1fe0',1]]){
  const patch=nativeRaceStateSnapshot(c.state);patch.scene[field]=value;assert.throws(()=>createNativeRaceState(patch),/overlapping scene/);
 }
 assert.throws(()=>prepareNativeRaceStateOperations(c.state,[{kind:'recordWordWrite',racerIndex:0,wordIndex:75,value:5},
  {kind:'recordWordWrite',racerIndex:4,wordIndex:75,value:1}]),/racerIndex/);
 assert.deepEqual(nativeRaceStateSnapshot(c.state),before);
 assert.throws(()=>prepareNativeRaceStateOperations(c.state,[{kind:'hudWrite',byteOffset:1,width:4,value:0}]),/alignment/);
 assert.throws(()=>prepareNativeRaceStateOperations(c.state,[{kind:'sourceWordWrite',field:'recordFlag8a98',value:0}]),/source word/);
 const copy=nativeRaceStateSnapshot(c.state);copy.raceWords1f94[0]=0;assert.notEqual(c.state.raceWords1f94[0],0);
 for(const owner of ['raceWords1f94','hudWords7788']){const sparse=nativeRaceStateSnapshot(c.state);delete sparse[owner][13];assert.throws(()=>createNativeRaceState(sparse),new RegExp(owner));}
});
