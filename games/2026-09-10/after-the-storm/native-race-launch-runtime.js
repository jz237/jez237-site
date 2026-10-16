import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceCountdown,prepareNativeRacePrestartInitializationUpdate,prepareNativeRacePrestartStatusUpdate,prepareNativeRaceResultStatusUpdate,
 prepareNativeRaceCameraInputUpdate,prepareNativeRaceStartup,prepareNativeRaceOrdinaryUpdate,nativeRaceGridTransformView,nativeRaceComputerProfileView,nativeRaceResultCodeView} from './native-race-state.js';
import {prepareNativeRaceStartupOverlay} from './native-race-startup-overlay.js';
import {prepareNativePrimaryRaceClock} from './native-primary-race-clock.js';
import {createNativeRaceCameraStorage} from './native-race-camera-storage.js';
import {NATIVE_ANGLE_TABLE_WORDS,nativeSineTableWords} from './native-math-tables.js';
import {sourceBuoyVisibleRow} from './source-buoy-progress.js';
import {SUNNY_NATIVE_RETIREMENT_GEOMETRY} from './native-sunny-support.js';
import {createNativeAIRouteState,stepNativeAIRoute} from './native-ai-route.js';

// Overlapping effect47FC, solo4800 and two-player4818 numeric entries. Ordinary
// two-player place indices are0/1; other mode tables remain separate admission.
const RESULT_TABLE_WORDS=Object.freeze([0,1,2,3,4,5,6,1,4]);

// One canonical owner for the admitted ordinary launch, primary race and numeric
// HUD fields. DOM/racer properties below are views, never synchronized copies.
// Result entry shares this owner; subsequent result updates and menu transitions
// still require their complete world/input/presentation schedule.
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
 * Current ordinary time/versus previews use source modes0/1 and nonzero courses.
 * A retained canonical state may instead be supplied for exact prepared tests. */
export function createNativeRaceLaunchRuntime({racers,courseIndex,players,initialState,courseRuntime,course,laps=3,reverse=false}={}){
 if(!Array.isArray(racers)||racers.length<1||racers.length>4)throw new TypeError('Launch requires one to four initialized racers');
 integer(players,'players',1,2);integer(courseIndex,'courseIndex',1,9);
 if(players>racers.length)throw new RangeError('Launch requires each human source slot');
 let current;
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
   // Three numeric constants in the actual loaded readonly HUD interval.
   // Opaque palettes/resources and BSS are not copied from a ROM address alias.
   for(const [address,bits]of [[0x7a44,0x3da3d70a],[0x7a48,0x3f333333],[0x7a50,0x3f2aaaab]])
    hudWords7788[hi(address)]=bits;
   // Declared fresh WEB record-book policy. Source reset retains much of this
   // table; zero times would incorrectly prevent legitimate record insertion.
   for(const base of [0x1ff0+courseIndex*60,0x1ff0+courseIndex*60+20,0x1ff0+courseIndex*60+40,
    0x22c0+courseIndex*20,0x23b0+courseIndex*20])raceWords1f94[ri(base)]=599999;
  }
  current=createNativeRaceState({raceWords1f94,hudWords7788,profileWordsB330,i1Words9440,scene:{
   players,racerCount:racers.length,primaryHumanIndex:0,secondaryHumanIndex:1,courseIndex,
   mode620:players===2?1:0,mode608:players===2?1:0,main638:1,phase650:0,simulation648:1,
   clockStopped817c:1,activity624:-1,event628:0,gameStateAb24:40,specialAb64:0,ready6fc:0,
   missesEnabled72e:1,result6f0:0,ambientD4b00:0,field4964:0,resultEffect393c:0,toggleD9914:0,
   ...(courseRuntime?{primaryCount:courseRuntime.data.nodes.length,finishSourceRow:courseRuntime.data.finishSourceRow,
    cold8224:1,forceFirst8228:0,demoOffset5438:0,restart6f8:0,reverseDab68:Number(reverse),state600:0,
    missLimit8174:5,noFinish8178:0,configuredLaps728:integer(laps,'configured laps',3,9),
    directionFlag1f90:courseRuntime.directionFlag1f90,fortressD8240:0,metadataD9b0:0,metadataCb32c:0,seed6f00:0}:{} )}});
  if(courseRuntime)current=prepareNativeRaceStartup(courseRuntime.resetLayout,current).state;
  else{
   const startup=prepareNativeRaceStartupOverlay({raceWords1f94:current.raceWords1f94,hudWords7788:current.hudWords7788,globals:current.scene});
   commit(startup.operations);
  }
  current=prepareNativeRacePrestartInitializationUpdate(current).state;
 }
 if(current.scene.players!==players||current.scene.racerCount!==racers.length||current.scene.courseIndex!==courseIndex)
  throw new RangeError('Retained launch scene must match the live participants/course');
 if(courseRuntime&&(current.scene.primaryCount!==courseRuntime.data.nodes.length||current.scene.finishSourceRow!==courseRuntime.data.finishSourceRow))
  throw new RangeError('Retained ordinary state must match the initialized primary course');
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
  ordinary:!!courseRuntime,
  scene:()=>({simulationState:current.scene.simulation648,phase650:current.scene.phase650}),
  // Source6E3A8 reads this signed halfword AFTER79528. It gates the shared
  // primary/generic object motion call7DBC0 independently of simulation648.
  objectMotionActive:()=>current.scene.activity624===-1,
  snapshot:()=>nativeRaceStateSnapshot(current),
  advanceDisplayClock(){
   // Source8E794 increments the shared button cadence AFTER input, hull,
   // camera and water, BEFORE ordinary judging6E3A8. It also runs with
   // simulation648==0. Preserve retained bits; never derive it from frame IDs.
   const previous=integer(current.scene.toggleD9914,'retained display cadence');
   const value=(previous+1)&3;
   commit([{kind:'sourceWordWrite',field:'toggleD9914',value}]);
   return {previous,value};
  },
  aiTargetTable:courseRuntime?.aiTargetTable??null,
  aiRecords:()=>racers.map((_,slot)=>({sourceLap:word(slot,0),place293c:word(slot,1),
   navigationSourceRow:word(slot,4),finished2c2c:word(slot,189),record2c24:word(slot,187)})),
  advanceNavigation({bodiesBySlot,nodePositions}){
   if(!courseRuntime)throw new Error('Source AI navigation needs initialized course geometry');
   if(!Array.isArray(bodiesBySlot)||bodiesBySlot.length!==racers.length)throw new TypeError('Supply every source body for navigation');
   const operations=[],diagnostics=[];
   // Original86148 visits ALL racers ascending before any input producer.
   // No simulation, finish or human-only gate occurs inside this prepass.
   for(let slot=0;slot<racers.length;slot++){
    if(current.scene.main638!==21&&current.scene.mode620!==1&&word(slot,212)!==(0x801aee20|0))
     throw new Error('Sunny AI navigation requires the retained primary table');
    const body=bodiesBySlot[slot],previous=createNativeAIRouteState(courseRuntime.aiRoute,{
     avatar:body.avatar,navigationSourceRow:word(slot,4)});
    const next=stepNativeAIRoute(courseRuntime.aiRoute,previous,{position:body.position,nodePositions});
    if(next.state.navigationSourceRow!==word(slot,4))operations.push(write(slot,4,next.state.navigationSourceRow));
    diagnostics.push({racerIndex:slot,...next.diagnostic});
   }
   commit(operations);return {operations,diagnostics};
  },
  resultCodeFor(racerIndex,{bodyResultCodes16c8,point90Native,datum2458}){
   if(!courseRuntime||current.scene.courseIndex!==1||![0,1].includes(current.scene.mode620))
    throw new Error('Live rider results require admitted ordinary Sunny geometry');
   return nativeRaceResultCodeView(current,{racerIndex,bodyResultCodes16c8,resultTableWords47fc:RESULT_TABLE_WORDS,
    supportProbe:{point90Native,datum2458,geometry:SUNNY_NATIVE_RETIREMENT_GEOMETRY}});
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
   if(courseRuntime)throw new Error('Full ordinary update already owns the source record clock');
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
   if(courseRuntime)throw new Error('Full ordinary update already owns the source countdown');
   const before=current.scene.phase650,launch=prepareNativeRaceCountdown(current,{pressedButtonsB58BySlot});current=launch.state;
   // This admitted portion owns prestart status only. Result-stage dispatch
   // belongs to the separate full i1 integration, not another countdown call.
   const status=before<3?prepareNativeRacePrestartStatusUpdate(current):null;
   if(status)current=status.state;
   return {effects:[...launch.effects,...(status?.effects??[])],operations:launch.operations,
    started:before<2&&current.scene.phase650>=2,view:runtime.view()};
  },
  advanceOrdinary({bodiesBySlot,nodePositionsNative,pressedButtonsB58BySlot}){
   if(!courseRuntime)throw new Error('Ordinary race needs its initialized source course');
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
  advanceStatus(bodyResultCode16c8BySlot){
   // Live ordinary admission stops at its result boundary. Execute the real
   // entry once; repeated status calls must not award another win or re-enter.
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
