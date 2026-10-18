import {NATIVE_TUNE_KEYS,nativeMenuTune,nativeTuneLaunchOperations} from './native-rider-tuning.js';
import {NATIVE_TITLE_INITIAL_PAIR} from './native-title-menu-data.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceCountdown,prepareNativeRacePrestartInitializationUpdate,prepareNativeRacePrestartStatusUpdate,prepareNativeRaceResultStatusUpdate,
 prepareNativeRaceCameraInputUpdate,prepareNativeRaceStartup,prepareNativeRaceOrdinaryUpdate,nativeRaceGridTransformView,nativeRaceComputerProfileView,nativeRaceResultCodeView} from './native-race-state.js';
import {prepareNativeRaceStartupOverlay} from './native-race-startup-overlay.js';
import {prepareNativePrimaryRaceClock} from './native-primary-race-clock.js';
import {createNativeRaceCameraStorage} from './native-race-camera-storage.js';
import {NATIVE_ANGLE_TABLE_WORDS,nativeSineTableWords} from './native-math-tables.js';
import {sourceBuoyVisibleRow} from './source-buoy-progress.js';
import {createNativeAIRouteState,stepNativeAIRoute} from './native-ai-route.js';
import {prepareNativeAIInitialization,stepNativeAIRandom} from './native-ai-initialization.js';
import {prepareNativeRiderActionStartup,NATIVE_RIDER_ACTION_LIMITS} from './native-rider-action-startup.js';
import {prepareNativeAIDriver} from './native-ai-driver.js';
import {NATIVE_AI_STORAGE_WORDS,nativeAIDriverStateFromWords,nativeAIDriverStateWrites} from './native-ai-storage.js';
import {prepareNativeRaceWaterInitialization} from './native-race-state.js';
import {prepareNativeRaceWidgetAdvance,prepareNativeRaceFadeAdvance,prepareNativeRaceFadePropertiesUpdate} from './native-race-state.js';
import {prepareNativeWidgetPresentation,nativeWidgetDrawView} from './native-widget-presentation.js';
import {prepareNativeRaceMenuInputAdvance,nativeRaceMenuInputView} from './native-race-state.js';
import {prepareNativeRaceResultCPUDisplayUpdate} from './native-race-state.js';
import {prepareNativeNameMenuFrame,nativeNameMenuView} from './native-name-menu-runtime.js';
import {prepareNativeResultsMenuFrame,nativeResultsMenuView} from './native-results-menu-runtime.js';
import {prepareNativeStuntResultsMenuFrame,nativeStuntResultsMenuView} from './native-stunt-results-menu-runtime.js';
import {prepareNativeStuntRecordMenuFrame,nativeStuntRecordMenuView} from './native-stunt-record-menu-runtime.js';
import {nativeStuntRecordView} from './native-stunt-record-view.js';
import {prepareNativeContinuationMenuFrame,nativeContinuationMenuView} from './native-continuation-menu-runtime.js';
import {nativeResultsRecordView} from './native-results-record-view.js';
import {captureNativeRecordSession,restoreNativeRecordSession,copyNativeRecordSession} from './native-record-session.js';
import {NATIVE_RIDER_MENU_ORDER} from './native-rider-controls.js';
import {nativeCourseDatumAfterPhysics} from './native-course-datum.js';
import {spawnNativeIceFragments} from './native-ice-fragments.js';
import {stepNativeIceSplashes} from './native-ice-splashes.js';
import {nextNativeSprayFrameCounter} from './native-spray-levels.js';
import {createNativeGenericObjectWorld} from './native-generic-object-world.js';
import {prepareNativeRaceStuntUpdate,prepareNativeRaceStuntRingUpdate,prepareNativeRaceStuntAwardDisplay,nativeRaceStuntAwardsView} from './native-race-state.js';

// Overlapping effect47FC, solo4800 and two-player4818 numeric entries. Ordinary
// two-player place indices are0/1; other mode tables remain separate admission.
const RESULT_TABLE_WORDS=Object.freeze([0,1,2,3,4,5,6,1,4]);

// One canonical owner for admitted ordinary races and prepared Stunt launches.
// Numeric HUD and racer properties below are views, never synchronized copies.
// Result entry, CPU result updates and menu entry share this owner. Original
// resource loading, menu loops and cartridge persistence remain boundaries.
const BASE=(0x2938-0x1f94)/4,STRIDE=222,hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4;
const sourceFields={nextSourceRow:3,side:7,armed:8,power:75,lapMisses:76,totalMisses:77,missLimitReached:79};
const booleans=new Set(['armed','missLimitReached']);
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid launch ${name}`);return v;}
const write=(slot,word,value)=>({kind:'recordWordWrite',racerIndex:slot,wordIndex:word,value:value>>>0});
const numberBits=new DataView(new ArrayBuffer(4));
function floatBits(v){numberBits.setFloat32(0,v);return numberBits.getUint32(0);}
function readFloat(v){numberBits.setUint32(0,v);return numberBits.getFloat32(0);}

/** Fresh WEB memory policy: unrelated native-layout words start explicitly0.
 * Actual source HUD startup and i1 initialization then supply their numeric
 * writes. This is an equivalent high-resolution runtime, not a claim that
 * opaque original loaded palettes/resources/BSS had these same initial bits.
 * Current physical time/versus previews use source modes0/1. Prepared solo
 * Stunt course runtimes also own numeric startup/scoring, before host admission.
 * A retained canonical state may instead be supplied for exact prepared tests. */
export function createNativeRaceLaunchRuntime({racers,courseIndex,players,initialState,recordSession,tunes=[],tuneModes=[],courseRuntime,course,laps=3,reverse=false,rngSeed=17,handicap=false}={}){
 if(!Array.isArray(racers)||racers.length<1||racers.length>4)throw new TypeError('Launch requires one to four initialized racers');
 const stunt=courseRuntime?.mode620===11,mode620=stunt?11:players===2?1:0;
 integer(players,'players',1,2);integer(courseIndex,'courseIndex',stunt?0:1,stunt?8:9);
 if(stunt&&(players!==1||racers.length!==1||reverse))throw new RangeError('Prepared Stunt launch requires one rider and a forward course');
 if(stunt&&courseRuntime.courseIndex!==courseIndex)throw new RangeError('Stunt launch must use its selected source course');
 if(stunt)course=courseRuntime.courseView;
 if(typeof handicap!=='boolean')throw new TypeError('handicap must be boolean');
 if(players>racers.length)throw new RangeError('Launch requires each human source slot');
 if(recordSession!==undefined&&(initialState||!courseRuntime))throw new RangeError('Record session requires a fresh source launch');
 const retainedRecords=recordSession===undefined?null:copyNativeRecordSession(recordSession);
 let current,resultExit=null,continuationHandoff=null,objectWorldCreated=false;
 // Browser commands are queued edges, consumed once at the source display stage.
 const cameraCommands=Array.from({length:players},()=>[]);
 const extra=racers.map(r=>({logicalTicks:r.sourceBuoys?.logicalTicks??0,missedCheckpoint:r.sourceBuoys?.missedCheckpoint??false,dqLabel:r.dq||''}));
 function word(slot,index){integer(slot,'source slot',0,racers.length-1);return current.raceWords1f94[BASE+slot*STRIDE+index]|0;}
 function commit(operations){if(operations.length)current=prepareNativeRaceStateOperations(current,operations).state;}
 if(initialState)current=createNativeRaceState(initialState);
 else{
  const raceWords1f94=Array(1693).fill(0),hudWords7788=Array(1442).fill(0),profileWordsB330=Array(52).fill(0),i1Words9440=Array(168).fill(0);
  raceWords1f94[ri(0x39b0)]=floatBits(100000);raceWords1f94[ri(0x39b4)]=floatBits(-100000);
  for(let i=0;i<racers.length;i++){
   const r=racers[i],at=BASE+i*STRIDE,source=r.sourceBuoys;
   raceWords1f94[at]=r.lap;raceWords1f94[at+1]=r.grid;raceWords1f94[at+75]=r.power;
   raceWords1f94[at+77]=r.misses;raceWords1f94[at+212]=0x801aee20;
   if(source)for(const [k,index]of Object.entries(sourceFields))raceWords1f94[at+index]=(booleans.has(k)?Number(source[k]):source[k])>>>0;
  }
  if(courseRuntime){
   profileWordsB330[2]=courseRuntime.sourceDifficulty;
   // Numeric constants7A24..7A50 in the loaded readonly HUD interval,
   // including direction-warning thresholds. They also make original-body
   // comparisons use the same constants as the reconstructed numeric leaves.
   // Opaque palettes/resources and BSS are not copied from a ROM address alias.
   [0x44bb8000,0x3f333333,0x3f333333,0x3f333333,0x3f333333,0xc51c4000,0x48ef4200,0x3fe66666,
    0x3da3d70a,0x3f333333,0x3fe66666,0x3f2aaaab].forEach((bits,i)=>hudWords7788[hi(0x7a24)+i]=bits);
   // Declared fresh WEB record-book policy. Source reset retains much of this
   // table; zero times would incorrectly prevent legitimate record insertion.
   for(let c=0;c<12;c++)for(const base of [0x1ff0+c*60,0x1ff0+c*60+20,0x1ff0+c*60+40,
    0x22c0+c*20,0x23b0+c*20])raceWords1f94[ri(base)]=599999;
  }
  current=createNativeRaceState({raceWords1f94,hudWords7788,profileWordsB330,i1Words9440,aiWords3c60:Array(NATIVE_AI_STORAGE_WORDS).fill(0),
   ...courseRuntime?.objectStartup?.storage,
   ...(courseRuntime?{menuWordsE658:Array(21).fill(0),deviceWords4308:Array(10).fill(0),
    // Fresh web profile policy: YOU initials for each rider/variant. No
    // cartridge save data; these14-byte entries cross u32 word boundaries.
    saveWordsB280:(()=>{const bytes=new DataView(new ArrayBuffer(136));for(let i=0;i<8;i++){for(const [j,b]of [89,79,85].entries())bytes.setUint8(24+i*14+j,b);const tune=nativeMenuTune();for(const [j,key]of NATIVE_TUNE_KEYS.entries())bytes.setUint8(24+i*14+11+j,tune[key]);}return Array.from({length:34},(_,i)=>bytes.getUint32(i*4));})(),nameEntryWords61c4:Array(14).fill(0),resultsMenuWords6d30:Array(4).fill(0),stuntResultsMenuWords5d80:Array(4).fill(0),
    continuationMenuWords61e0:Array(4).fill(0),
    // Fresh web menu selection/latch, plus verified numeric return tables.
    continuationDataWords60f0:Array.from({length:20},(_,i)=>[40,10,20,2,30,2][i-13]??0)}:{}),scene:{
   players,racerCount:racers.length,primaryHumanIndex:0,secondaryHumanIndex:1,courseIndex,
   ...(courseRuntime?.objectStartup?{...courseRuntime.objectStartup.counts,forceStunt824c:0,rampFilterOverride8254:0,alternate8250:0}:{}),
   mode620,mode608:mode620,main638:1,phase650:0,simulation648:1,
   clockStopped817c:1,activity624:-1,event628:0,gameStateAb24:40,specialAb64:0,ready6fc:Number(stunt&&courseIndex===0),
   missesEnabled72e:1,result6f0:0,ambientD4b00:0,field4964:0,field4970:Number(handicap),resultEffect393c:0,toggleD9914:0,
   rngState4640:integer(rngSeed,'web shared RNG seed',0,0xffffffff),inputTick1960:0,previousNavigationD9874:0,trainingSelectionDa9f8:0,
   ...(courseRuntime?{primaryCount:courseRuntime.data.nodes.length,finishSourceRow:courseRuntime.data.finishSourceRow,
    cold8224:1,forceFirst8228:0,demoOffset5438:0,restart6f8:0,reverseDab68:Number(reverse),state600:0,
    freshNameAb6c:1,field700:0,fieldAb2c:0,titlePairSelectionA9fc:NATIVE_TITLE_INITIAL_PAIR,fieldA9ac:0,courseSelectionA9d0:0,pendingPlayers60c:players,
    riderSelectionA9c0:NATIVE_RIDER_MENU_ORDER.indexOf(racers[0].id),
    secondRiderSelectionA9c4:NATIVE_RIDER_MENU_ORDER.indexOf(racers[1]?.id??1),riderFlagA9c8:0,secondRiderFlagA9cc:0,
    //6AACC clears the shared ring chain after loaded objects/reset. These
    // words are unrelated to75310's collected-ring/award totals in raceWords.
    ...(stunt?{ringNext0cb0:0,ringStreak0cb4:0,unlockAb60:0}:{}),
    missLimit8174:5,noFinish8178:0,configuredLaps728:stunt?1:integer(laps,'configured laps',3,9),
    directionFlag1f90:courseRuntime.directionFlag1f90,fortressD8240:0,metadataD9b0:racers[0].id,metadataCb32c:0,seed6f00:0}:{} )}});
  if(courseRuntime){
   if(retainedRecords)current=createNativeRaceState(restoreNativeRecordSession(current,retainedRecords));
   commit(nativeTuneLaunchOperations(racers,players,tunes,tuneModes));
   current=prepareNativeRaceStartup(courseRuntime.resetLayout,current).state;
   //9345C's ordinary race entry calls6FB0(2,4,0). Its completed fade
   // pulse8A16 is what5DF4 uses to start both source audio channels.
   // Retained diagnostic states above keep their supplied fade untouched.
   current=prepareNativeRaceFadePropertiesUpdate(current,{type:2,rate:4,selector:0,
    fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]}).state;
  }
  else{
   const startup=prepareNativeRaceStartupOverlay({raceWords1f94:current.raceWords1f94,hudWords7788:current.hudWords7788,globals:current.scene});
   commit(startup.operations);
  }
  current=prepareNativeRacePrestartInitializationUpdate(current).state;
 }
 if(current.scene.players!==players||current.scene.racerCount!==racers.length||current.scene.courseIndex!==courseIndex)
  throw new RangeError('Retained launch scene must match the live participants/course');
 if(stunt&&(current.scene.mode620!==11||current.scene.mode608!==11||current.scene.configuredLaps728!==1||current.scene.reverseDab68!==0||current.scene.primaryHumanIndex!==0))
  throw new RangeError('Retained Stunt scene must match the selected mode, lap, direction and primary rider');
 if(stunt)for(const key of ['ringNext0cb0','ringStreak0cb4','unlockAb60'])integer(current.scene[key],`retained ${key}`);
 if(courseRuntime&&(current.scene.primaryCount!==courseRuntime.data.nodes.length||current.scene.finishSourceRow!==courseRuntime.data.finishSourceRow))
  throw new RangeError('Retained source state must match the initialized primary course');
 if(courseRuntime?.objectStartup&&Object.keys(courseRuntime.objectStartup.storage).some(key=>!current[key]))
  throw new RangeError('Source object layout requires all retained object, plane and fixed-grid owners');
 function setWord(slot,index,value,min=0,max=2147483647){integer(value,'record value',min,max);if(word(slot,index)!==value)commit([write(slot,index,value)]);}
 function sourceView(slot){
  const view={};
  for(const [k,index]of Object.entries(sourceFields))Object.defineProperty(view,k,{enumerable:true,
   get:()=>booleans.has(k)?word(slot,index)!==0:word(slot,index),set:v=>{
    if(booleans.has(k)){if(typeof v!=='boolean')throw new TypeError(`Launch ${k} must be boolean`);v=Number(v);}
    setWord(slot,index,v,k==='side'?-1:0,k==='power'?5:k==='side'?1:2147483647);
   }});
  for(const k of ['logicalTicks','missedCheckpoint'])Object.defineProperty(view,k,{enumerable:true,get:()=>extra[slot][k],set:v=>{
   if(k==='logicalTicks')integer(v,k,0);else if(typeof v!=='boolean')throw new TypeError('missedCheckpoint must be boolean');extra[slot][k]=v;
  }});
  return Object.freeze(view);
 }
 for(let slot=0;slot<racers.length;slot++){
  const r=racers[slot],view=sourceView(slot);
  for(const [k,index]of Object.entries({power:75,misses:77,lap:0}))Object.defineProperty(r,k,{configurable:true,enumerable:true,
   get:()=>word(slot,index),set:v=>setWord(slot,index,v,0,k==='power'?5:2147483647)});
  Object.defineProperty(r,'sourceBuoys',{configurable:true,enumerable:true,get:()=>view,set:value=>{
   const operations=[];
   for(const [k,index]of Object.entries(sourceFields)){
    let v=value[k];if(booleans.has(k)){if(typeof v!=='boolean')throw new TypeError(`Launch ${k} must be boolean`);v=Number(v);}
    integer(v,k,k==='side'?-1:0,k==='power'?5:k==='side'?1:2147483647);operations.push(write(slot,index,v));
   }
   integer(value.logicalTicks,'logicalTicks',0);if(typeof value.missedCheckpoint!=='boolean')throw new TypeError('missedCheckpoint must be boolean');
   commit(operations);extra[slot].logicalTicks=value.logicalTicks;extra[slot].missedCheckpoint=value.missedCheckpoint;
  }});
  Object.defineProperty(r,'raceTime',{configurable:true,enumerable:true,get:()=>word(slot,103)/1000});
  Object.defineProperty(r,'lapStart',{configurable:true,enumerable:true,get:()=>(word(slot,103)-word(slot,90))/1000,set:seconds=>{
   if(!Number.isFinite(seconds))throw new RangeError('Native lap start must be finite');setWord(slot,90,word(slot,103)-Math.round(seconds*1000));
  }});
  Object.defineProperty(r,'finishTime',{configurable:true,enumerable:true,get:()=>word(slot,189)!==0?word(slot,103)/1000:null,set:seconds=>{
   if(seconds===null){setWord(slot,189,0);return;}
   if(!Number.isFinite(seconds)||seconds<0)throw new RangeError('Native finish time must be finite');
   const ms=integer(Math.round(seconds*1000),'finish milliseconds',0);commit([write(slot,103,ms),write(slot,189,1)]);
  }});
  Object.defineProperty(r,'dq',{configurable:true,enumerable:true,get:()=>word(slot,187)!==0?
   (extra[slot].dqLabel||(word(slot,79)!==0?'Five missed buoys':word(slot,185)!==0?'Outside course or grounded':'Race time limit')):'',set:label=>{
   if(typeof label!=='string')throw new TypeError('Native disqualification label must be text');
   setWord(slot,187,label?(word(slot,103)>=599999?2:1):0);extra[slot].dqLabel=label;
  }});
  if(courseRuntime){
   Object.defineProperty(r,'nativePlace',{configurable:true,enumerable:true,get:()=>word(slot,1)});
   Object.defineProperty(r,'nativeBoundaryFrames',{configurable:true,enumerable:true,get:()=>word(slot,185)!==0?word(slot,186):-1});
   Object.defineProperty(r,'nativeWrongWay',{configurable:true,enumerable:true,get:()=>word(slot,202)>=40});
   Object.defineProperty(r,'lapTimes',{configurable:true,enumerable:true,get:()=>{
    const saved=word(slot,189)!==0?word(slot,0):Math.max(0,word(slot,0)-1);
    return Array.from({length:Math.min(9,saved)},(_,i)=>word(slot,94+i)/1000);
   }});
   Object.defineProperty(r,'next',{configurable:true,enumerable:true,get:()=>{
    const row=sourceBuoyVisibleRow(courseRuntime.sourceBuoyLayout,word(slot,3));return course.sourceVisibleGateIndices[row]??0;
   }});
   Object.defineProperty(r,'passed',{configurable:true,enumerable:true,get:()=>{
    const finished=word(slot,189)!==0,lap=word(slot,0),completed=finished?lap:Math.max(0,lap-1);
    return completed*course.gates.length+(finished||lap===0?0:courseRuntime.data.nodes.reduce((count,n)=>
     count+Number(n.enabledC8!==0&&n.sourceRow!==courseRuntime.data.finishSourceRow&&word(slot,11+n.sourceRow)!==0),0));
   }});
  }
 }
 const runtime={
  ordinary:!!courseRuntime&&!stunt,
  stunt,
  canonicalObjects:!!courseRuntime?.objectStartup,
  objectTransformResources:courseRuntime?.objectStartup?.transformResources??null,
  createObjectWorld({water,objectIds}){
   if(!runtime.canonicalObjects)throw new Error('Source object world requires initialized source storage');
   if(objectWorldCreated)throw new Error('Source object world may be attached only once');
   const world=createNativeGenericObjectWorld({water,objectIds,readRaceState:()=>current,
    commitRaceState:next=>{current=createNativeRaceState(next);},fragmentBurst:runtime.spawnIceFragments,splashAdvance:runtime.advanceIceSplashes});
   objectWorldCreated=true;return world;
  },
  scene:()=>({simulationState:current.scene.simulation648,phase650:current.scene.phase650}),
  inputClock:()=>integer(current.scene.inputTick1960,'shared input clock',0,0xffffffff),
  advanceInputClock(){
   //46DA0 increments1960 after922E4 and display/resource work, including
   // simulation0. Browser pause does not run an outer source frame.
   const previous=runtime.inputClock(),value=(previous+1)>>>0;
   commit([{kind:'sourceWordWrite',field:'inputTick1960',value}]);return {previous,value};
  },
  riderActionStartup(retained){return prepareNativeRiderActionStartup(retained,runtime.inputClock());},
  riderActionContext(slot){
   integer(slot,'rider action slot',0,racers.length-1);
   const g=current.scene;
   return {...NATIVE_RIDER_ACTION_LIMITS,state650:g.phase650,
    poseCompletion:{finished2c2c:word(slot,189),record2c24:word(slot,187),racerIndex:slot,
     primaryRacerIndex:g.primaryHumanIndex,gameMode648:g.simulation648},
    randomUnsigned32:()=>{
     // Called conditionally at the descending actor stage, not while the
     // input view is captured. Other consumers share this same4640 word.
     const next=stepNativeAIRandom(current.scene.rngState4640);
     commit([{kind:'sourceWordWrite',field:'rngState4640',value:next.rngState}]);return next.value;
    }};
  },
  contactAudioInputs(){
   const slots=[current.scene.primaryHumanIndex,...(players===2?[current.scene.secondaryHumanIndex]:[])];
   return {slots,recordFlags318:slots.map(slot=>word(slot,0x318/4)),recordMotion2c8:slots.map(slot=>word(slot,0x2c8/4)),
    recordPower12c:slots.map(slot=>word(slot,0x12c/4)),recordPlace4:slots.map(slot=>word(slot,1))};
  },
  sprayInputs(){
   const g=current.scene;
   return {players:g.players,primaryIndex:g.primaryHumanIndex,secondaryIndex:g.secondaryHumanIndex,
    scene638:g.main638,activity624:g.activity624,frameCounter:g.ambientD4b00,racerCount:g.racerCount,
    // This runtime admits actual human hulls; the extra spectator craft has
    // a separate AE210 branch and is not constructed in these native previews.
    extraRacer:0,records2f4:racers.map((_,slot)=>word(slot,0x2f4/4))};
  },
  advanceSourceFrameCounter(){
   const g=current.scene,value=nextNativeSprayFrameCounter(g.ambientD4b00,g.activity624);
   commit([{kind:'sourceWordWrite',field:'ambientD4b00',value:value>>>0}]);return value;
  },
  // Read the same source rank/checkpoint clock and human slot selectors used
  // by63C88. The host supplies preceding physical centers before any hull tick.
  catchupContext(slot,positionsBySlot){
   const g=current.scene;
   if(g.players!==2||!g.field4970)return undefined;
   if(!Array.isArray(positionsBySlot)||positionsBySlot.length!==racers.length)throw new TypeError('Catch-up requires all physical centers');
   return {players:g.players,enabled4970:g.field4970,place293c:word(slot,1),checkpointClock2c4:word(slot,177),
    primaryPositionNative:{...positionsBySlot[g.primaryHumanIndex]},secondaryPositionNative:{...positionsBySlot[g.secondaryHumanIndex]}};
  },
  // Source6E3A8 reads this signed halfword AFTER79528. It gates the shared
  // primary/generic object motion call7DBC0 independently of simulation648.
  objectMotionActive:()=>current.scene.activity624===-1,
  spawnIceFragments(pool,event){
   const result=spawnNativeIceFragments(pool,{...event,seed6f00:current.scene.seed6f00});
   commit([{kind:'sourceHalfwordWrite',field:'seed6f00',value:result.seed6f00}]);
   return result;
  },
  advanceIceSplashes(pool){
   const result=stepNativeIceSplashes(pool,current.scene.seed6f00);
   if(result.randomDraws)commit([{kind:'sourceHalfwordWrite',field:'seed6f00',value:result.seed6f00}]);
   return result;
  },
  courseRollerState:()=>(current.scene.field72c<<16)>>16,
  waterAmplitudeThreshold:()=>readFloat(current.raceWords1f94[ri(0x1fb4)]),
  waterDatumAfterPhysics:datumNative=>nativeCourseDatumAfterPhysics(datumNative,{
   ...current.scene,southernLap1fcc:current.raceWords1f94[ri(0x1fcc)]|0}),
  snapshot:()=>nativeRaceStateSnapshot(current),
  recordSessionSnapshot:()=>captureNativeRecordSession(current),
  nameEntryView:()=>nativeNameMenuView(current),
  resultsMenuView:()=>nativeResultsMenuView(current),
  stuntResultsMenuView:()=>nativeStuntResultsMenuView(current),
  stuntRecordMenuView:()=>nativeStuntRecordMenuView(current),
  stuntRecordView:()=>nativeStuntRecordView(current,{ridersBySlot:racers.map(r=>r.id)}),
  advanceStuntRecordMenu(rawControllers){
   const prepared=prepareNativeStuntRecordMenuFrame(current,rawControllers);current=prepared.state;return prepared;
  },
  advanceStuntResultsMenu(rawControllers){
   const prepared=prepareNativeStuntResultsMenuFrame(current,rawControllers);current=prepared.state;return prepared;
  },
  continuationMenuView:()=>({...nativeContinuationMenuView(current),active:!continuationHandoff&&nativeContinuationMenuView(current).active}),
  advanceContinuationMenu(rawControllers){
   if(continuationHandoff)throw new Error('Continuation menu already handed off');
   const prepared=prepareNativeContinuationMenuFrame(current,rawControllers);current=prepared.state;
   if(prepared.handoff)continuationHandoff=prepared.handoff;
   return prepared;
  },
  resultsRecordView:()=>nativeResultsRecordView(current,{ridersBySlot:racers.map(r=>r.id)}),
  advanceResultsMenu(rawControllers){
   const prepared=prepareNativeResultsMenuFrame(current,rawControllers);current=prepared.state;return prepared;
  },
  advanceNameEntry(rawController){
   const prepared=prepareNativeNameMenuFrame(current,rawController);current=prepared.state;return prepared;
  },
  menuInputView:(slot=0)=>nativeRaceMenuInputView(current,slot),
  advanceMenuInput(rawControllers){
   if(!courseRuntime)throw new Error('Menu input requires ordinary race');
   if(!Array.isArray(rawControllers)||rawControllers.length>players)throw new RangeError('Supply menu input for each connected human');
   const count=rawControllers.length;
   const prepared=prepareNativeRaceMenuInputAdvance(current,{rawControllers,controllerCount4344:count,
    connectedMask4340:(1<<count)-1,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),
    // Original92348..92390 sets35 on both axes each active update, with
    // horizontal50 for record-name state100 and60 for state10.
    thresholdXb400:current.scene.gameStateAb24===100?50:current.scene.gameStateAb24===10?60:35,thresholdYb401:35});
   current=prepared.state;return {operations:prepared.operations,view:nativeRaceMenuInputView(current)};
  },
  initializeWater(field,amplitudeNative){
   if(!(field?.heightQ instanceof Int16Array)||!(field?.velocityQ instanceof Int16Array)||
      field.heightQ.length!==49152||field.velocityQ.length!==49152)throw new TypeError('Supply the actual native water lattice');
   const prepared=prepareNativeRaceWaterInitialization(current,{amplitudeNative});
   field.heightQ.set(prepared.water.heightQ);field.velocityQ.set(prepared.water.velocityQ);current=prepared.state;
   return prepared.diagnostic;
  },
  initializeAI({hullProfilesB64,avatarsB68,objectTypes4c}){
   const words=current.aiWords3c60;if(!words)throw new TypeError('Supply retained AI storage before initialization');
   const prepared=prepareNativeAIInitialization({rngState:current.scene.rngState4640,racerCount:racers.length,
    primaryHumanIndex:current.scene.primaryHumanIndex,hullProfilesB64,avatarsB68,objectTypes4c,
    retainedRoleWords:Array.from({length:4},(_,slot)=>words[(slot*0xe8+0x5c)/4]|0),
    adjacentRoleWord:words[(0x405c-0x3c60)/4]|0,
    sourceOrder:current.raceWords1f94.slice(ri(0x26c0),ri(0x26c0)+racers.length).map(v=>v|0)});
   const operations=prepared.nativeWordPatches.map(p=>({kind:'aiWordWrite',wordIndex:(p.slot*0xe8+p.offset)/4,value:p.bits}));
   const put=(address,value)=>operations.push({kind:'aiWordWrite',wordIndex:(address-0x3c60)/4,value:value>>>0});
   if(prepared.adjacentRoleWordPatch)put(0x405c,prepared.adjacentRoleWordPatch.bits);
   for(const p of prepared.inverseOrderPatches)put(0x4100+p.index*4,p.value);
   put(0x4110,prepared.proximityCount);
   prepared.proximityObjectIndicesPrefix.forEach((value,i)=>put(0x4118+i*4,value));
   operations.push({kind:'sourceWordWrite',field:'rngState4640',value:prepared.rngState});
   commit(operations);return prepared;
  },
  aiDriverState:slot=>nativeAIDriverStateFromWords(current.aiWords3c60,slot),
  sampleAI(slot,{bodiesBySlot,geometry,waterField}){
   if(!courseRuntime)throw new Error('Live AI requires initialized source course geometry');
   if(!Array.isArray(bodiesBySlot)||bodiesBySlot.length!==racers.length)throw new TypeError('Supply all preceding AI body snapshots');
   const g=current.scene,family=runtime.aiFamilyFor(slot),prepared=prepareNativeAIDriver(family.targetTable,runtime.aiDriverState(slot),{
    globals:{state650:g.phase650,state638:g.main638,mode620:g.mode620,difficulty:current.profileWordsB330[2]|0,
     courseIndex:g.courseIndex,reverse:g.reverseDab68!==0,players:g.players,primaryHumanIndex:g.primaryHumanIndex,
     datumNative:waterField.datumNative,toggleD9914:g.toggleD9914,trainingSelection:g.trainingSelectionDa9f8,
     previousNavigationGlobal:g.previousNavigationD9874,chargeTimerNative:current.hudWords7788[hi(0x8a90)]|0},
    racers:runtime.aiRecords().map((record,i)=>({record,body:bodiesBySlot[i]})),
    geometry:{...geometry,nodePositionsNative:family.family==='primary'?geometry?.nodePositionsNative:undefined,
     proximityCount:current.aiWords3c60[(0x4110-0x3c60)/4]|0},waterField});
   const operations=prepared.frame.phase==='driving'?nativeAIDriverStateWrites(prepared.state,slot):[];
   if(Object.hasOwn(prepared.globalWrites,'previousNavigationGlobal'))operations.push({kind:'sourceWordWrite',
    field:'previousNavigationD9874',value:prepared.globalWrites.previousNavigationGlobal>>>0});
   commit(operations);return prepared;
  },
  advanceDisplayClock(){
   // Source8E794 increments the shared button cadence AFTER input, hull,
   // camera and water, BEFORE ordinary judging6E3A8. It also runs with
   // simulation648==0. Preserve retained bits; never derive it from frame IDs.
   const previous=integer(current.scene.toggleD9914,'retained display cadence');
   const value=(previous+1)&3;
   commit([{kind:'sourceWordWrite',field:'toggleD9914',value}]);
   return {previous,value};
  },
  advanceHUD(){
   if(!courseRuntime)throw new Error('Source HUD update requires ordinary race');
   // Source922E4 reaches5470,AFB4,71A8 after world/overlay CPU updates and
   // before the display-stage camera/status/result consumers. Resolve modern
   // matrix slots atomically; no guest GPU address or original art is invented.
   const widget=prepareNativeRaceWidgetAdvance(current,{matrixTargets:'slots',slotTemplateWords6c50:Array(11).fill(0),
    rotationWord6c80:0x40490fdb,rotationWord6c84:0x40490fdb,bounceWord6c88:0x3f333333});
   const presentation=prepareNativeWidgetPresentation(widget.effects),widgets=nativeWidgetDrawView(widget.state.hudWords7788,presentation);
   const fade=prepareNativeRaceFadeAdvance(widget.state,{fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]});
   const h=fade.state.hudWords7788,half=a=>((h[(a-0x7788)>>>2]>>>(a%4?0:16))&65535)<<16>>16;
   const value={widgets,fade:{kind:half(0x8a10),completion:half(0x8a16),alpha:half(0x8a26),
    red:half(0x8a20),green:half(0x8a22),blue:half(0x8a24)},
    effects:[...presentation.operations.filter(op=>op.kind!=='widgetMatrix'),...fade.effects]};
   current=fade.state;return value;
  },
  aiTargetTable:courseRuntime?.aiTargetTable??null,
  aiFamilyFor(slot){
   if(!courseRuntime)throw new Error('Source AI selection requires initialized course geometry');
   integer(slot,'AI racer slot',0,racers.length-1);
   // Original85EEC: main21 and mode1 force primary without overwriting the
   // retained record2C88 family. Ordinary Southern uses that retained pointer.
   const pointer=current.scene.main638===21||current.scene.mode620===1?0x801aee20:word(slot,212)>>>0;
   const name=({[0x801aee20]:'primary',[0x801b2f20]:'secondary',[0x801b7020]:'tertiary'})[pointer];
   const selected=courseRuntime.aiFamilies?.[name];
   if(!selected)throw new Error('Source AI navigation requires the selected initialized route family');
   return selected;
  },
  aiRecords:()=>racers.map((_,slot)=>({sourceLap:word(slot,0),place293c:word(slot,1),
   navigationSourceRow:word(slot,4),finished2c2c:word(slot,189),record2c24:word(slot,187)})),
  advanceNavigation({bodiesBySlot,nodePositions}){
   if(!courseRuntime)throw new Error('Source AI navigation needs initialized course geometry');
   if(!Array.isArray(bodiesBySlot)||bodiesBySlot.length!==racers.length)throw new TypeError('Supply every source body for navigation');
   const operations=[],diagnostics=[];
   // Original86148 visits ALL racers ascending before any input producer.
   // No simulation, finish or human-only gate occurs inside this prepass.
   for(let slot=0;slot<racers.length;slot++){
    const family=runtime.aiFamilyFor(slot),body=bodiesBySlot[slot],previous=createNativeAIRouteState(family.route,{
     avatar:body.avatar,navigationSourceRow:word(slot,4)});
    const next=stepNativeAIRoute(family.route,previous,{position:body.position,nodePositions:family.family==='primary'?nodePositions:undefined});
    if(next.state.navigationSourceRow!==word(slot,4))operations.push(write(slot,4,next.state.navigationSourceRow));
    diagnostics.push({racerIndex:slot,...next.diagnostic});
   }
   commit(operations);return {operations,diagnostics};
  },
  resultCodeFor(racerIndex,{bodyResultCodes16c8,point90Native,datum2458}){
   if(!courseRuntime?.retirementGeometry||courseRuntime.courseIndex!==current.scene.courseIndex||![0,1,11].includes(current.scene.mode620))
    throw new Error('Rider results require selected source support geometry');
   //5E2A0 calls7FAE4 on the CURRENT FD78 rows. Ramps can move after startup;
   // an ordinary-course box snapshot would also select the wrong Stunt layout.
   const count=current.scene.collisionPlaneCount0578;
   const geometry=runtime.canonicalObjects?{floor:courseRuntime.retirementGeometry.floor,
    boxes:{count0578:count,rows:Array.from({length:count},(_,i)=>current.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(readFloat))}}:
    courseRuntime.retirementGeometry;
   return nativeRaceResultCodeView(current,{racerIndex,bodyResultCodes16c8,resultTableWords47fc:RESULT_TABLE_WORDS,
    supportProbe:{point90Native,datum2458,geometry}});
  },
  gridStart(racerIndex){
   if(!courseRuntime)throw new Error('Source grid requires initialized primary course geometry');
   // Grid6AC84 reads the tangent78/7C. The judging view's color-aligned80/84
   // is a separate source field and is zero at the finish row.
   const primaryNodes=courseRuntime.data.recordWordsBySourceRow.map((row,sourceRow)=>{
    const pair=(a,b)=>({x:readFloat(row[a/4]),z:readFloat(row[b/4])});
    return {sourceRow,centerNativeXZ:pair(0,8),forwardXZ:pair(0x70,0x74),rightXZ:pair(0x78,0x7c),classification98:row[0x98/4]|0};
   });
   return Object.freeze({...nativeRaceGridTransformView(current,{racerIndex,primaryNodes}),
    computerProfile:nativeRaceComputerProfileView(current,racerIndex)});
  },
  records:()=>racers.map((r,slot)=>({slot,lap:word(slot,0),place:word(slot,1),nextSourceRow:word(slot,3),
   totalMs:word(slot,103),lapMs:word(slot,90),savedLapsMs:(r.lapTimes??[]).map(s=>Math.round(s*1000)),
   power:word(slot,75),misses:word(slot,77),finished:word(slot,189)!==0,disqualification:word(slot,187),
   legalLapCounter:word(slot,200),boundaryActive:word(slot,185),boundaryFrames:word(slot,186)})),
  view(){const g=current.scene,h=current.hudWords7788,charge=h[hi(0x8a90)]|0,stage=h[hi(0x8d08)]|0;
   return {phase650:g.phase650,simulation648:g.simulation648,clockStopped:g.clockStopped817c!==0,charge,stage,
    label:g.phase650<2?(g.phase650===0||stage===0?'READY':String(Math.max(1,Math.ceil((charge-15)/15)))):g.phase650===2?'GO':'',
    countdown:g.phase650<2?Math.max(1,Math.ceil((charge-15)/15)):0};},
  advanceClock(){
   if(courseRuntime)throw new Error('Full source update already owns the record clock');
   const g=current.scene,ops=[];let dqMetric=readFloat(current.raceWords1f94[ri(0x39b4)]);
   for(let slot=0;slot<racers.length;slot++){
    // The enclosing event/DQ handler is separate from this timing subsection.
    if(g.event628===1&&slot===g.primaryHumanIndex||g.players===2&&g.event628===2&&slot===g.secondaryHumanIndex)continue;
    const clock=prepareNativePrimaryRaceClock({main638:g.main638,finished2c2c:word(slot,189),record2c24:word(slot,187),
     clockStopped817c:g.clockStopped817c,flag1fd4:current.raceWords1f94[ri(0x1fd4)]|0,courseIndex:g.courseIndex,
     lapMs:word(slot,90),totalMs:word(slot,103),ambientWord:word(slot,91),ambientD4b00:g.ambientD4b00});
    if(!clock.advanced)continue;
    ops.push(write(slot,90,clock.lapMs),write(slot,103,clock.totalMs));
    if(clock.totalLimit){
     ops.push(write(slot,187,2));
     if(g.mode620!==1){
      ops.push(write(slot,203,floatBits(dqMetric)));dqMetric=Math.fround(dqMetric+10000);
      ops.push({kind:'raceWordWrite',wordIndex:ri(0x39b4),value:floatBits(dqMetric)});
     }
    }else ops.push(write(slot,91,clock.ambientWord));
   }
   commit(ops);return runtime;
  },
  advanceLaunch(pressedButtonsB58BySlot){
   if(courseRuntime)throw new Error('Full source update already owns the countdown');
   const before=current.scene.phase650,launch=prepareNativeRaceCountdown(current,{pressedButtonsB58BySlot});current=launch.state;
   // This admitted portion owns prestart status only. Result-stage dispatch
   // belongs to the separate full i1 integration, not another countdown call.
   const status=before<3?prepareNativeRacePrestartStatusUpdate(current):null;
   if(status)current=status.state;
   return {effects:[...launch.effects,...(status?.effects??[])],operations:launch.operations,
    started:before<2&&current.scene.phase650>=2,view:runtime.view()};
  },
  advanceOrdinary({bodiesBySlot,nodePositionsNative,pressedButtonsB58BySlot}){
   if(!courseRuntime||stunt)throw new Error('Ordinary race needs its initialized ordinary source course');
   const before=racers.map((_,slot)=>({row:word(slot,3),lap:word(slot,0),misses:word(slot,77),finished:word(slot,189),dq:word(slot,187)}));
   const prepared=prepareNativeRaceOrdinaryUpdate(courseRuntime.primaryLayout,current,{
    primary:{samplesBySlot:bodiesBySlot.map(body=>({bodyPositionNative:body.positionNative,priorBodyPointNative:body.priorBodyPointNative})),nodePositionsNative},
    bodiesBySlot,cameraIndicesByView:Array.from({length:players},(_,i)=>i),pressedButtonsB58BySlot,
    angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS,sineTableWords4350:nativeSineTableWords(),
    allowedRegionsNative:courseRuntime.allowedRegionsNative,warningSuppressionRegionsNative:courseRuntime.warningSuppressionRegionsNative});
   current=prepared.state;
   before.forEach((_,i)=>extra[i].logicalTicks++);
   return {effects:prepared.effects,operations:prepared.tailOperations,diagnostic:prepared.diagnostic,before,view:runtime.view()};
  },
  advanceStunt({bodiesBySlot,nodePositionsNative,pressedButtonsB58BySlot}){
   if(!stunt)throw new Error('Stunt update requires initialized mode11 course data');
   const prepared=prepareNativeRaceStuntUpdate(current,{nodes:courseRuntime.data.nodes,
    primaryScratchLayout:courseRuntime.primaryScratchLayout,checkpointSecondsByIndex:courseRuntime.checkpointSecondsByIndex,
    bodiesBySlot,nodePositionsNative,pressedButtonsB58BySlot,cameraIndicesByView:[0],
    angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS,sineTableWords4350:nativeSineTableWords(),
    allowedRegionsNative:courseRuntime.allowedRegionsNative,warningSuppressionRegionsNative:courseRuntime.warningSuppressionRegionsNative});
   current=prepared.state;if(prepared.applied)extra[0].logicalTicks++;
   return {applied:prepared.applied,effects:prepared.effects,operations:prepared.tailOperations,diagnostic:prepared.diagnostic,view:runtime.view()};
  },
  advanceStuntRings(primaryBodyPositionNative){
   if(!stunt)throw new Error('Stunt ring stage requires initialized mode11 course data');
   // Reached6E3A8 stage, AFTER79528 and BEFORE primary/generic motion. The
   // supplied point must be the actual primary physical body's44/48/4C.
   const prepared=prepareNativeRaceStuntRingUpdate(current,{primaryBodyPositionNative});current=prepared.state;
   return {applied:prepared.applied,effects:prepared.effects,diagnostic:prepared.diagnostic};
  },
  advanceStuntDisplay(){
   if(!stunt)throw new Error('Stunt display requires initialized mode11 course data');
   //9328C once per source frame; an independent render must only read views.
   const {state,...prepared}=prepareNativeRaceStuntAwardDisplay(current);current=state;return prepared;
  },
  stuntView(){
   if(!stunt)throw new Error('Stunt view requires initialized mode11 course data');
   return Object.freeze({remainingMs:word(0,0x2c4/4),checkpointIndex:word(0,0x164/4),nextSourceRow:word(0,3),
    rings:current.raceWords1f94[ri(0x292c)]|0,ringCount:current.scene.ringCountB134,
    nextRing:current.scene.ringNext0cb0,chain:current.scene.ringStreak0cb4,
    pendingTrick:current.raceWords1f94[ri(0x26e4)]|0,delayedBonus:current.raceWords1f94[ri(0x39cc)]|0,
    delayedFrames:current.raceWords1f94[ri(0x39d0)]|0,finished:word(0,189)!==0,disqualification:word(0,187),
    awards:nativeRaceStuntAwardsView(current)});
  },
  queueCamera(view,command='next'){
   integer(view,'camera view',0,players-1);
   const mask=command==='next'?8:command==='previous'?4:command==='tilt'?1:undefined;
   if(mask===undefined)throw new RangeError('Unknown source camera command');
   if(!courseRuntime)throw new Error('Source camera controls require ordinary race');
   if(cameraCommands[view].length<16)cameraCommands[view].push(mask);
  },
  advanceCameraInput(bodyStatesBySlot){
   if(!courseRuntime)throw new Error('Source camera controls require ordinary race');
   if(current.scene.gameStateAb24!==40)return {effects:[],diagnostic:{views:[]}};
   const prepared=prepareNativeRaceCameraInputUpdate(current,{
    controllerPortsByView:Array.from({length:players},(_,i)=>i),
    pressedButtonsByController:Array.from({length:4},(_,i)=>cameraCommands[i]?.[0]??0),bodyStatesBySlot,
    cameraModeWords3940:[72,75,90,90,200,140,90,80,23,23,23,30,0,0,12,62].map(floatBits),
    cameraBlendWords6018:[.3,.2,.07,.15].map(floatBits)});
   current=prepared.state;cameraCommands.forEach(q=>q.shift());
   return {effects:prepared.effects,diagnostic:prepared.diagnostic};
  },
  resultView(){
   const g=current.scene,i=a=>current.i1Words9440[(a-0x9440)/4]|0;
   return {gameState:g.gameStateAb24,active:[41,42,44].includes(g.gameStateAb24)&&!resultExit,
    delay:g.gameStateAb24===42?i(0x9504):0,waitingFrames:i(0x9508),
    canContinue:g.gameStateAb24===42&&g.players===1&&g.mode608===0&&i(0x9504)===0&&i(0x9500)===0&&!resultExit,
    exit:resultExit};
  },
  advanceResult(){
   if(!courseRuntime)throw new Error('Source result schedule requires ordinary race');
   if(!runtime.resultView().active)return {effects:[],view:runtime.view(),result:runtime.resultView()};
   const prepared=prepareNativeRaceResultCPUDisplayUpdate(current,{
    expandMenus:true,slotTemplateWords6c50:Array(11).fill(0),fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]});
   // Commit the actual numeric menu entry before the high-resolution handoff.
   // The race host stops here: resource installation, the subsequent menu loop
   // and cartridge persistence are still separate from this numeric entry.
   const menu=prepared.menus[0];
   current=prepared.state;
   if(menu)resultExit=menu;
   return {effects:prepared.effects,view:runtime.view(),result:runtime.resultView()};
  },
  advanceStatus(bodyResultCode16c8BySlot){
   // Execute result entry once; the following source frame uses advanceResult.
   // Repeated status calls cannot award another win or reset the result timer.
   if(current.scene.gameStateAb24!==40)return {effects:[],view:runtime.view()};
   const prepared=prepareNativeRaceResultStatusUpdate(current,{bodyResultCode16c8BySlot,
    expandTransitions:true,expandWidgets:true,
    // Verified numeric defaults6C50/6CC0: no art or resource pointers.
    slotTemplateWords6c50:Array(11).fill(0),fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]});
   current=prepared.state;
   return {effects:prepared.effects,view:runtime.view()};
  }
 };
 if(courseRuntime)runtime.cameraStorage=createNativeRaceCameraStorage({players,readState:()=>current,commit});
 return Object.freeze(runtime);
}
