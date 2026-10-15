// Shared source race/HUD storage. Decoded leaf views are temporary, and all
// overlapping records, tables, timers and flags return to these same owners.
import {createNativeRaceResetState,prepareNativeRaceReset} from './native-race-reset.js';
import {prepareNativeRaceStartupOverlay} from './native-race-startup-overlay.js';
import {prepareNativeRaceStartControl} from './native-race-start-control.js';
import {createNativePrimaryRacePhaseState,prepareNativePrimaryRacePhase} from './native-primary-race-phase.js';
import {prepareNativeRacePresentationTail} from './native-race-finalization.js';
import {prepareNativeRaceBoundaryWarning} from './native-race-boundary-warning.js';
import {prepareNativeRaceStatusPrelude} from './native-race-status-prelude.js';
import {prepareNativeRacePrestartInitialization,prepareNativeRacePrestartStatus,prepareNativeRacePrestartStage} from './native-race-prestart-stage.js';
import {prepareNativeRaceSpeedDisplay} from './native-race-speed-display.js';
import {prepareNativeRaceMissFeedback,prepareNativeRaceMissFeedbackPalette} from './native-race-miss-feedback.js';
import {prepareNativeRaceDirectionWarning} from './native-race-direction-warning.js';

const MIN=-2147483648,MAX=2147483647,RACE_BASE=0x1f94,RACE_WORDS=1693,HUD_BASE=0x7788,HUD_WORDS=1442;
const floatBits=new DataView(new ArrayBuffer(4));
const raceInts={fortressFlag1fc8:0x1fc8,southernLap1fcc:0x1fcc,drakeFog1fd0:0x1fd0,flag1fc4:0x1fc4,
 flag1fd4:0x1fd4,flag1fd8:0x1fd8,bestTime1fe0:0x1fe0,bestLapFlag2658:0x2658,finishWait1fdc:0x1fdc,
 recordPlace2650:0x2650,bestLapFlag2654:0x2654};
const raceFloats={finishMetric39b0:0x39b0,dqMetric39b4:0x39b4,checkpointSlackNative39c4:0x39c4};
const hudInts={recordFlag8a98:0x8a98,placeChanged8a9c:0x8a9c};
// Only words physically outside both spans belong in scene. The same actual
// reverse halfword is viewed as unsigned by progress and signed by reset.
const sceneRanges={primaryHumanIndex:[0,3],secondaryHumanIndex:[0,3],players:[1,2],courseIndex:[0,11],
 racerCount:[0,4],primaryCount:[0,64],finishSourceRow:[0,63],activity624:[-32768,32767],event628:[-32768,32767],
 participantCount60e:[-32768,32767],result6f0:[-32768,32767],specialAb64:[-32768,32767],ready6fc:[-32768,32767],
 reverseDab68:[0,65535],missesEnabled72e:[0,65535],seed6f00:[0,65535]};
const sceneWords=new Set(['cold8224','clockStopped817c','phase650','simulation648','main638','mode620','state600',
 'missLimit8174','noFinish8178','configuredLaps728','difficulty','directionFlag1f90','ambientD4b00','fortressD8240',
 'metadataD9b0','metadataCb32c','restart6f8','initLatch63c','gameStateAb24','mode608','returnState630','forceFirst8228','demoOffset5438']);
const sceneHalves=new Set(['activity624','event628','participantCount60e','result6f0','specialAb64','ready6fc','reverseDab68','missesEnabled72e','seed6f00']);
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const ri=a=>(a-RACE_BASE)/4,hi=a=>(a-HUD_BASE)/4;
function readFloat(v){floatBits.setUint32(0,v,false);return floatBits.getFloat32(0,false);}
function floatWord(v){if(!Number.isFinite(v)||!Number.isFinite(Math.fround(v)))throw new RangeError('Canonical float write must fit finite float32');
 floatBits.setFloat32(0,v,false);return floatBits.getUint32(0,false);}
function sceneValue(s,k){
 if(k==='difficulty'&&s.profileWordsB330!==undefined)return s.profileWordsB330[2]|0;
 const range=sceneRanges[k]??[MIN,MAX];return integer(s.scene[k],`scene.${k}`,...range);
}
function copy(value){
 record(value,'canonical native race state');record(value.scene,'external scene words');const scene={};
 for(const [k,v]of Object.entries(value.scene)){
  if(!sceneWords.has(k)&&!Object.hasOwn(sceneRanges,k))throw new RangeError(`Unknown or overlapping scene field ${k}`);
  scene[k]=integer(v,`scene.${k}`,...(sceneRanges[k]??[MIN,MAX]));
 }
 const s={raceWords1f94:words(value.raceWords1f94,'raceWords1f94',RACE_WORDS),
  hudWords7788:words(value.hudWords7788,'hudWords7788',HUD_WORDS),scene};
 if(value.i1Words9440!==undefined)s.i1Words9440=words(value.i1Words9440,'i1Words9440',168);
 if(value.profileWordsB330!==undefined){
  if(Object.hasOwn(scene,'difficulty'))throw new RangeError('difficulty overlaps profileWordsB330');
  s.profileWordsB330=words(value.profileWordsB330,'profileWordsB330',50);
 }
 return s;
}

/** Runtime words must be supplied; this is not a ROM-image/BSS initializer.
 * Four complete222-word records and every course table have ONE race span.
 * The single HUD span also retains loaded opaque data and byte latches.
 * scene contains actual external fields only, with phase650/main638 names.
 * Partial scene samples are allowed; each entry point requires its real reads.
 * Optional i1Words9440 retains that overlay's separate168-word data/BSS span.
 * Optional profileWordsB330[50] owns the cup/results/points windowB330..B3F4;
 * when supplied, difficulty comes from itsB338 word, never scene.difficulty.
 */
export function createNativeRaceState(value){return freeze(copy(value));}
export function nativeRaceStateSnapshot(value){return copy(value);}

function patchHud(s,op){
 const width=integer(op.width,'HUD width',1,4),offset=integer(op.byteOffset,'HUD byteOffset',0,HUD_WORDS*4-width);
 if(width!==1&&width!==4||width===4&&offset%4)throw new RangeError('Invalid HUD patch width/alignment');
 const value=integer(op.value,'HUD patch bits',0,width===1?255:0xffffffff),i=offset>>>2;
 if(width===4)s.hudWords7788[i]=value;
 else{const shift=24-(offset&3)*8;s.hudWords7788[i]=((s.hudWords7788[i]&~(255<<shift))|(value<<shift))>>>0;}
}
function apply(s,operations){
 if(!Array.isArray(operations))throw new TypeError('Expected ordered native operations');const effects=[];
 for(const op of operations){
  record(op,'native operation');
  if(op.kind==='hudWrite')patchHud(s,op);
  else if(op.kind==='raceWordWrite')s.raceWords1f94[integer(op.wordIndex,'race wordIndex',0,RACE_WORDS-1)]=integer(op.value,'race word bits',0,0xffffffff);
  else if(op.kind==='recordWordWrite'){
   const slot=integer(op.racerIndex,'record racerIndex',0,3),word=integer(op.wordIndex,'record wordIndex',0,221);
   s.raceWords1f94[ri(0x2938)+slot*222+word]=integer(op.value,'record word bits',0,0xffffffff);
  }else if(op.kind==='sourceWordWrite'){
   if(!sceneWords.has(op.field))throw new RangeError(`Unsupported external source word ${op.field}`);
   const bits=integer(op.value,'source word bits',0,0xffffffff);
   if(op.field==='difficulty'&&s.profileWordsB330!==undefined)s.profileWordsB330[2]=bits;else s.scene[op.field]=bits|0;
  }else if(op.kind==='sourceHalfwordWrite'){
   if(!sceneHalves.has(op.field))throw new RangeError(`Unsupported external source halfword ${op.field}`);
   const bits=integer(op.value,'source halfword bits',0,65535);
   s.scene[op.field]=sceneRanges[op.field][0]<0?bits<<16>>16:bits;
  }else if(op.kind==='i1Write'||op.kind==='profileWrite'){
   const key=op.kind==='i1Write'?'i1Words9440':'profileWordsB330',count=op.kind==='i1Write'?168:50;
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   const offset=integer(op.byteOffset,`${key} byteOffset`,0,count*4-4);
   if(op.width!==4||offset%4)throw new RangeError(`Invalid ${key} word alignment`);
   s[key][offset/4]=integer(op.value,`${key} bits`,0,0xffffffff);
  }else if(op.kind==='presentationBufferWrite'){
   integer(op.bufferIndex,'presentation bufferIndex',0,1);integer(op.byteOffset,'presentation byteOffset',0,252);
   if(op.width!==4||op.byteOffset%4)throw new RangeError('Invalid presentation buffer word');
   integer(op.value,'presentation word bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='presentationWordWrite'){
   integer(op.address,'presentation address',0,0xffffffff);
   if(op.width!==4||op.address%4)throw new RangeError('Invalid presentation memory word');
   integer(op.value,'presentation word bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='audioEntry'||op.kind==='externalCall')effects.push(structuredClone(op));
  else throw new RangeError(`Unsupported native operation ${op.kind}`);
 }
 return effects;
}

/** Commit prepared partial operations to a detached canonical copy in order.
 * Presentation buffers/audio remain explicit effects for their own consumers;
 * no callback executes during numeric preparation. Invalid late operations
 * leave the supplied state untouched, including mixed byte/word patches.
 */
export function prepareNativeRaceStateOperations(state,operations){
 const next=copy(state),effects=apply(next,operations);return freeze({state:next,effects});
}

/** Full numeric75310 followed immediately by its actual EED70 terminal. Prior
 * HUD phase/bank survives until the terminal's first palette helper reads it.
 * Upstream course loading, geometry and physical grid placement are external.
 * The reset does not set scene.phase650; main initialization owns that word.
 */
export function prepareNativeRaceStartup(layout,state){
 const next=copy(state),get=k=>sceneValue(next,k);
 const reset=prepareNativeRaceReset(layout,createNativeRaceResetState({raceWords1f94:next.raceWords1f94,
  cold8224:get('cold8224'),clockStopped817c:get('clockStopped817c')}),{
  ...Object.fromEntries(['primaryCount','racerCount','courseIndex','mode620','main638','finishSourceRow','difficulty',
   'forceFirst8228','primaryHumanIndex','demoOffset5438'].map(k=>[k,get(k)])),stateE6f8:get('restart6f8'),reverseDab68:get('reverseDab68')<<16>>16});
 next.raceWords1f94=[...reset.state.raceWords1f94];next.scene.cold8224=reset.state.cold8224;
 next.scene.clockStopped817c=reset.state.clockStopped817c;
 const terminal=prepareNativeRaceStartupOverlay({raceWords1f94:next.raceWords1f94,hudWords7788:next.hudWords7788,
  globals:{...Object.fromEntries(['activity624','players','mode620','courseIndex','racerCount','primaryHumanIndex'].map(k=>[k,get(k)])),
   secondaryHumanIndex:next.scene.secondaryHumanIndex}});
 const effects=apply(next,terminal.operations);
 return freeze({state:next,effects,operations:terminal.operations,diagnostic:{reset:reset.diagnostic,terminal:terminal.diagnostic}});
}

/** One F03E0 invocation after the enclosing79528 eligibility gate. Countdown,
 * launch power and the next primary timing pass use the same raw records and
 * scene clock. This does not run any other ordinary overlay or display stage.
 */
export function prepareNativeRaceCountdown(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceStartControl(next.hudWords7788,{phase650:sceneValue(next,'phase650'),
  activity624:next.scene.activity624,racerCount:next.scene.racerCount,pressedButtonsB58BySlot:input.pressedButtonsB58BySlot});
 const effects=apply(next,prepared.operations);return freeze({state:next,effects,operations:prepared.operations});
}

const externalPhase=['primaryHumanIndex','secondaryHumanIndex','players','courseIndex','missLimit8174','noFinish8178',
 'clockStopped817c','event628','mode620','configuredLaps728','difficulty','directionFlag1f90','ambientD4b00','fortressD8240',
 'primaryCount','finishSourceRow','activity624','racerCount','state600','metadataD9b0','metadataCb32c'];
function phaseView(s){
 const a=s.raceWords1f94,g=Object.fromEntries(externalPhase.map(k=>[k,sceneValue(s,k)]));
 Object.assign(g,{state638:sceneValue(s,'main638'),state650:sceneValue(s,'phase650'),
  reverse:sceneValue(s,'reverseDab68'),missesEnabled72e:sceneValue(s,'missesEnabled72e')});
 for(const [k,address]of Object.entries(raceInts))g[k]=a[ri(address)]|0;
 for(const [k,address]of Object.entries(raceFloats))g[k]=readFloat(a[ri(address)]);
 for(const [k,address]of Object.entries(hudInts))g[k]=s.hudWords7788[hi(address)]|0;
 const course=g.courseIndex,readWords=(address,n)=>a.slice(ri(address),ri(address)+n).map(v=>v|0);
 return createNativePrimaryRacePhaseState({globals:g,recordWords2938BySlot:Array.from({length:4},(_,i)=>a.slice(ri(0x2938)+i*222,ri(0x2938)+(i+1)*222)),
  projectionDistance39a0BySlot:Array.from({length:4},(_,i)=>readFloat(a[ri(0x39a0)+i])),orderByPlace:readWords(0x3990,4),
  scratchPositionNative:Object.fromEntries(['x','y','z'].map((k,i)=>[k,readFloat(a[ri(0x3780)+i])])),
  courseRecords:{fastLap22c0:readWords(0x22c0+course*20,5),normalTimes1ff0:Array.from({length:3},(_,i)=>readWords(0x1ff0+course*60+i*20,5)),
   reverseTime23b0:readWords(0x23b0+course*20,5),bestSplits24a0:readWords(0x24a0+course*36,9),
   recordPlace2660:a[ri(0x2660)+course]|0,bestLapFlag2690:a[ri(0x2690)+course]|0}});
}
/** Detached, temporary compatibility view for the ordinary primary leaf. The
 * host persists only canonical spans/scene, never this decoded table copy. */
export function nativeRacePrimaryPhaseView(state){return phaseView(copy(state));}

function commitPhase(s,v){
 const a=s.raceWords1f94,g=v.globals,put=(address,values)=>values.forEach((x,i)=>a[ri(address)+i]=x>>>0);
 v.recordWords2938BySlot.forEach((row,i)=>put(0x2938+i*0x378,row));
 put(0x3990,v.orderByPlace);put(0x39a0,v.projectionDistance39a0BySlot.map(floatWord));
 put(0x3780,['x','y','z'].map(k=>floatWord(v.scratchPositionNative[k])));
 for(const [k,address]of Object.entries(raceInts))a[ri(address)]=g[k]>>>0;
 for(const [k,address]of Object.entries(raceFloats))a[ri(address)]=floatWord(g[k]);
 for(const [k,address]of Object.entries(hudInts))s.hudWords7788[hi(address)]=g[k]>>>0;
 for(const k of externalPhase)if(k==='difficulty'&&s.profileWordsB330!==undefined)s.profileWordsB330[2]=g[k]>>>0;else s.scene[k]=g[k];
 s.scene.main638=g.state638;s.scene.phase650=g.state650;
 s.scene.reverseDab68=g.reverse;s.scene.missesEnabled72e=g.missesEnabled72e;
 const c=v.courseRecords,course=g.courseIndex;
 if(c){put(0x22c0+course*20,c.fastLap22c0);c.normalTimes1ff0.forEach((row,i)=>put(0x1ff0+course*60+i*20,row));
  put(0x23b0+course*20,c.reverseTime23b0);put(0x24a0+course*36,c.bestSplits24a0);
  a[ri(0x2660)+course]=c.recordPlace2660>>>0;a[ri(0x2690)+course]=c.bestLapFlag2690>>>0;}
}

/** Execute the ordinary numeric phase after actual movement/input, then commit
 * its records, selected-course tables and globals to their original owners.
 * Returned overlay recipes remain pending and ordered. Use a fresh canonical
 * snapshot for the presentation-tail gate after those consumers run.
 */
export function prepareNativeRacePrimaryUpdate(layout,state,input){
 const next=copy(state),prepared=prepareNativePrimaryRacePhase(layout,phaseView(next),input);commitPhase(next,prepared.state);
 return freeze({...prepared,state:next});
}
export function prepareNativeRacePresentationContinuation(state){
 const s=copy(state);return prepareNativeRacePresentationTail({record2c24BySlot:Array.from({length:4},(_,i)=>s.raceWords1f94[ri(0x2c24)+i*222]|0),
  primaryHumanIndex:sceneValue(s,'primaryHumanIndex'),secondaryHumanIndex:s.scene.secondaryHumanIndex,
  playerCountDab28:sceneValue(s,'players'),state628:s.scene.event628});
}

/** Shared canonical adapters for individual source call sites. They do not
 * invent the enclosing dispatcher gates, reorder pending callees or execute
 * callbacks. All remaining source-stage recipes are visible in effects.
 */
export function prepareNativeRaceStatusPreludeUpdate(state){
 const next=copy(state),prepared=prepareNativeRaceStatusPrelude(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceBoundaryWarningUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceBoundaryWarning({...input,raceWords1f94:next.raceWords1f94,
  hudWords7788:next.hudWords7788,globals:next.scene}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceSpeedDisplayUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceSpeedDisplay(next,input),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceDirectionWarningUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceDirectionWarning({...input,raceWords1f94:next.raceWords1f94,scene:next.scene}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceMissFeedbackUpdate(state){
 const next=copy(state),prepared=prepareNativeRaceMissFeedback({raceWords1f94:next.raceWords1f94,
  hudWords7788:next.hudWords7788,globals:next.scene}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
/** Only the admitted source-display counter block, once per shared draw. Its
 * returned drawRecipe remains unimplemented presentation metadata; executing
 * the original F14B4 as well would advance the same canonical counters twice.
 */
export function prepareNativeRaceMissFeedbackPaletteUpdate(state){
 const next=copy(state),prepared=prepareNativeRaceMissFeedbackPalette(next.hudWords7788,{activity624:sceneValue(next,'activity624')}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRacePrestartInitializationUpdate(state){
 const next=copy(state),prepared=prepareNativeRacePrestartInitialization(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRacePrestartStatusUpdate(state){
 const next=copy(state),prepared=prepareNativeRacePrestartStatus(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
/** The actual display-stage dispatcher follows79528 once per source frame.
 * externalReturns supplies genuine consumed opaque presentation return words;
 * high-resolution render/interpolation calls must never advance this stage.
 */
export function prepareNativeRacePrestartStageUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRacePrestartStage({...next,externalReturns:input.externalReturns}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
