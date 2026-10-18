import {prepareNativeRaceMenuInputAdvance,prepareNativeNameEntryUpdate,prepareNativeNameEntryInputUpdate,
 prepareNativeNameEntryRecordCommit,prepareNativeRaceStateOperations,prepareNativeRaceMenuInitializationUpdate} from './native-race-state.js';
import {nativeSineTableWords} from './native-math-tables.js';
const hi=a=>(a-0x7788)/4,characters='ABCDEFGHIJKLMNOPQRSTUVWXYZ-. ';
let views;
function sourceViews(){
 return views??=Object.freeze({controllerPort4330:0,sineTableWords4350:nativeSineTableWords(),anglePeriodWords9254:[0x40c90fdc,0x40c90fdc,0x40c90fdc],
  introRadiusWord62b0:0x443b8000,outroRadiusWord62e0:0x443b8000,confirmEndRadiusWord62d8:0x443b8000,confirmStartRadiusWord62dc:0x443b8000,
  queuedLeftSpeedWord62b4:0x3e99999a,queuedRightSpeedWord62c0:0x3e99999a,leftSpeedWord62b8:0x3d4ccccd,rightSpeedWord62c4:0x3d4ccccd,
  minimumSpeedWord6334:0x3f4ccccd,leftWrapWord62bc:0x40c90fdb,rightWrapThresholdWord62c8:0x40c90fdb,rightWrapWord62cc:0x40c90fdb,
  wheelAngleWord62f4:0x40c90fdb,wheelAngleWord6324:0x40c90fdb,wheelAngleWord6328:0x40c90fdb,wheelAngleWord632c:0x40c90fdb,wheelAngleWord6330:0x40c90fdb,
  confirmAngleWords62d0:[0x401921fb,0x60000000],characterBytes60bc:Array.from(characters,c=>c.charCodeAt(0)),
  wheelPeriodWord62e4:0x40c90fdb,confirmTiltWord62e8:0xbfc90fdb,wheelTiltWord62ec:0xbfc90fdb,wheelScaleWord62f0:0x3dcccccd,crossingAmplitudeWord61fc:0x42480000});
}
export function nativeNameMenuView(state){
 const n=state.nameEntryWords61c4,h=state.hudWords7788,word=h[hi(0x88e8)]>>>0;
 const bytes=Array.from({length:4},(_,i)=>word>>>(24-i*8)&255),end=bytes.indexOf(0),initials=String.fromCharCode(...bytes.slice(0,end<0?4:end));
 return {active:state.scene.gameStateAb24===100&&[0,11].includes(state.scene.mode608),phase:n?.[1]??0,selected:n?.[0]??0,
  initials,length:n?.[8]??0,symbols:h.slice(hi(0x87e8),hi(0x87e8)+16),labels:h.slice(hi(0x87e8),hi(0x87e8)+16).map(v=>v===30?'END':v===29?'DEL':characters[v]??''),
  first:h[hi(0x87e0)],last:h[hi(0x87e4)]};
}

/** Browser menu boundary for admitted solo ordinary and Stunt races. The original
 * numeric update runs before display/input, with one canonical owner. Modern
 * drawing replaces the display-list callees; it does not invent their return
 * pointers. Source1E8C latch writes still precede2530 input. Phase5 expands
 * RAM records, the verified literal%s name copy, then C20C or D004 menu entry.
 * GPU art, water disturbances, audio and durable saving are host effects.
 */
export function prepareNativeNameMenuFrame(state,rawController){
 if(state.scene.gameStateAb24!==100||![0,11].includes(state.scene.mode608))throw new RangeError('Name menu requires admitted solo result state100');
 const constants=sourceViews(),sample=prepareNativeRaceMenuInputAdvance(state,{rawControllers:[rawController],controllerCount4344:1,
  connectedMask4340:1,controllerPorts4330:[0,1],neutralBytesAb10:Array(10).fill(0),thresholdXb400:50,thresholdYb401:35});
 const update=prepareNativeNameEntryUpdate(sample.state,constants),draw=nativeNameMenuView(update.state);
 let current=update.state;const operations=[...sample.operations,...update.operations],effects=[...sample.effects,...update.effects];
 function apply(ops){const q=prepareNativeRaceStateOperations(current,ops);current=q.state;operations.push(...ops);effects.push(...q.effects);}
 const clear=[];
 if(current.scene.initLatch63c!==0)clear.push({kind:'sourceWordWrite',field:'initLatch63c',value:0});
 clear.push({kind:'sourceWordWrite',field:'fieldAb2c',value:0});apply(clear);
 const input=prepareNativeNameEntryInputUpdate(current,constants);
 for(const op of input.operations){
  if(op.kind==='externalCall'&&op.consumer==='801e2c14')apply(prepareNativeNameEntryRecordCommit(current,constants).operations);
  else if(op.kind==='externalCall'&&op.consumer==='800ca210'){
   // The original format at80226284 is%s. Its terminating byte is copied;
   // bytes beyond that terminator in the four-byte destination are retained.
   const src=current.hudWords7788[hi(0x88e8)]>>>0;let dest=current.scene.field700>>>0,terminated=false;
   for(let i=0;i<4;i++){const shift=24-i*8,byte=src>>>shift&255;dest=((dest&~(255<<shift))|(byte<<shift))>>>0;if(byte===0){terminated=true;break;}}
   if(!terminated)throw new RangeError('Name must terminate inside its four-byte owner');
   apply([{kind:'sourceWordWrite',field:'field700',value:dest}]);
  }else if(op.kind==='externalCall'&&['801ec20c','801ed004'].includes(op.consumer))apply(prepareNativeRaceMenuInitializationUpdate(current,{consumer:op.consumer}).operations);
  else apply([op]);
 }
 return {state:current,operations,effects,matrices:update.matrices,draw,view:nativeNameMenuView(current),
  diagnostic:{originalNumericUpdate:true,modernPresentation:true,recordsPersisted:false}};
}

/** Independent20Hz menu clock; race physics remains stopped. Pausing discards
 * partial time so hidden tabs/options cannot catch up or consume input. */
export function createNativeNameMenuClock(){
 let accumulated=0;
 return {reset(){accumulated=0;},advance(seconds,active,step){
  if(!Number.isFinite(seconds)||seconds<0)throw new RangeError('Expected nonnegative menu elapsed time');
  if(!active){accumulated=0;return 0;}accumulated+=Math.min(seconds,.25);let ticks=0;
  while(accumulated+1e-9>=.05){accumulated=Math.max(0,accumulated-.05);ticks++;if(step()===false){accumulated=0;break;}}
  return ticks;
 }};
}
