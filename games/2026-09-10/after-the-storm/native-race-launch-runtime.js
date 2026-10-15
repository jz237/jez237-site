import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceCountdown,prepareNativeRacePrestartInitializationUpdate,prepareNativeRacePrestartStatusUpdate} from './native-race-state.js';
import {prepareNativeRaceStartupOverlay} from './native-race-startup-overlay.js';
import {prepareNativePrimaryRaceClock} from './native-primary-race-clock.js';

// One canonical owner for the admitted ordinary launch, record clocks and the
// existing browser judge's overlapping progress fields. DOM/racer properties
// below are views, never periodically synchronized copies. Full source primary
// judging/result stages remain separate work; this does not claim cold ROM boot.
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
export function createNativeRaceLaunchRuntime({racers,courseIndex,players,initialState}={}){
 if(!Array.isArray(racers)||racers.length<1||racers.length>4)throw new TypeError('Launch requires one to four initialized racers');
 integer(players,'players',1,2);integer(courseIndex,'courseIndex',1,9);
 if(players>racers.length)throw new RangeError('Launch requires each human source slot');
 let current;
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
  current=createNativeRaceState({raceWords1f94,hudWords7788,profileWordsB330,i1Words9440,scene:{
   players,racerCount:racers.length,primaryHumanIndex:0,secondaryHumanIndex:1,courseIndex,
   mode620:players===2?1:0,mode608:players===2?1:0,main638:1,phase650:0,simulation648:1,
   clockStopped817c:1,activity624:-1,event628:0,gameStateAb24:40,specialAb64:0,ready6fc:0,
   missesEnabled72e:1,result6f0:0,ambientD4b00:0}});
  const startup=prepareNativeRaceStartupOverlay({raceWords1f94:current.raceWords1f94,hudWords7788:current.hudWords7788,globals:current.scene});
  commit(startup.operations);
  current=prepareNativeRacePrestartInitializationUpdate(current).state;
 }
 if(current.scene.players!==players||current.scene.racerCount!==racers.length||current.scene.courseIndex!==courseIndex)
  throw new RangeError('Retained launch scene must match the live participants/course');
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
  Object.defineProperty(r,'dq',{configurable:true,enumerable:true,get:()=>word(slot,187)!==0?(extra[slot].dqLabel||'Race time limit'): '',set:label=>{
   if(typeof label!=='string')throw new TypeError('Native disqualification label must be text');
   setWord(slot,187,label?(word(slot,103)>=599999?2:1):0);extra[slot].dqLabel=label;
  }});
 }
 const runtime={
  scene:()=>({simulationState:current.scene.simulation648,phase650:current.scene.phase650}),
  snapshot:()=>nativeRaceStateSnapshot(current),
  view(){const g=current.scene,h=current.hudWords7788,charge=h[hi(0x8a90)]|0,stage=h[hi(0x8d08)]|0;
   return {phase650:g.phase650,simulation648:g.simulation648,clockStopped:g.clockStopped817c!==0,charge,stage,
    label:g.phase650<2?(g.phase650===0||stage===0?'READY':String(Math.max(1,Math.ceil((charge-15)/15)))):g.phase650===2?'GO':'',
    countdown:g.phase650<2?Math.max(1,Math.ceil((charge-15)/15)):0};},
  advanceClock(){
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
   const before=current.scene.phase650,launch=prepareNativeRaceCountdown(current,{pressedButtonsB58BySlot});current=launch.state;
   // This admitted portion owns prestart status only. Result-stage dispatch
   // belongs to the separate full i1 integration, not another countdown call.
   const status=before<3?prepareNativeRacePrestartStatusUpdate(current):null;
   if(status)current=status.state;
   return {effects:[...launch.effects,...(status?.effects??[])],operations:launch.operations,
    started:before<2&&current.scene.phase650>=2,view:runtime.view()};
  }
 };
 return Object.freeze(runtime);
}
