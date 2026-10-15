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
import {prepareNativeWaterInitialization} from './native-water-initialization.js';
import {prepareNativeRacePlacementFeedback} from './native-race-placement-feedback.js';
import {prepareNativeRaceRivalIndicators} from './native-race-rival-indicators.js';
import {prepareNativeRaceWaveSelection} from './native-race-wave-selection.js';
import {prepareNativeRaceGridPlacement,selectNativeRaceComputerProfile} from './native-race-grid-placement.js';
import {prepareNativeRaceCourseZeroSequenceUpdate,prepareNativeRaceCourseZeroSequenceDisplay} from './native-race-coursezero-sequence.js';
import {prepareNativeRaceStartTransform,decodeNativeRaceStartTransform} from './native-race-start-transform.js';
import {prepareNativeRaceFadePropertiesInitialization,prepareNativeRaceFadeSlotsReset} from './native-race-fade-initialization.js';
import {prepareNativeRaceMainConfiguration} from './native-race-main-configuration.js';

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
 pendingPlayers60c:[-32768,32767],participantCount60e:[-32768,32767],result6f0:[-32768,32767],specialAb64:[-32768,32767],ready6fc:[-32768,32767],field4964:[0,65535],
 reverseDab68:[0,65535],missesEnabled72e:[0,65535],seed6f00:[0,65535],rngState4640:[0,0xffffffff],style6e28:[0,65535],
 field4970:[0,65535],field72c:[0,65535],fieldA9ac:[0,65535],variant6f4:[-32768,32767],variant6f6:[-32768,32767]};
const sceneWords=new Set(['cold8224','clockStopped817c','phase650','simulation648','main638','mode620','state600',
 'missLimit8174','noFinish8178','configuredLaps728','difficulty','directionFlag1f90','ambientD4b00','fortressD8240',
 'metadataD9b0','metadataCb32c','restart6f8','initLatch63c','gameStateAb24','mode608','returnState630','forceFirst8228','demoOffset5438','rngState4640','style6e2c',
 'previousGameState634','field640','field644','fieldAb1c','field461c','wave610','missLimit614','lapCount618','field61c','wave49b0','field64c','players','racerCount']);
const sceneHalves=new Set(['activity624','event628','pendingPlayers60c','participantCount60e','result6f0','specialAb64','ready6fc','reverseDab68','missesEnabled72e','seed6f00','field4964','style6e28',
 'field4970','field72c','fieldA9ac','variant6f4','variant6f6']);
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
 if(Object.hasOwn(value,'riderFlagsB3f8'))throw new RangeError('riderFlagsB3f8 overlaps the extended profileWordsB330 owner');
 for(const [k,v]of Object.entries(value.scene)){
  if(!sceneWords.has(k)&&!Object.hasOwn(sceneRanges,k))throw new RangeError(`Unknown or overlapping scene field ${k}`);
  scene[k]=integer(v,`scene.${k}`,...(sceneRanges[k]??[MIN,MAX]));
 }
 const s={raceWords1f94:words(value.raceWords1f94,'raceWords1f94',RACE_WORDS),
  hudWords7788:words(value.hudWords7788,'hudWords7788',HUD_WORDS),scene};
 if(value.i1Words9440!==undefined)s.i1Words9440=words(value.i1Words9440,'i1Words9440',168);
 if(value.profileWordsB330!==undefined){
  if(Object.hasOwn(scene,'difficulty'))throw new RangeError('difficulty overlaps profileWordsB330');
  const count=value.profileWordsB330?.length;
  if(count!==50&&count!==52)throw new RangeError('profileWordsB330 requires50 or52 unsigned words');
  s.profileWordsB330=words(value.profileWordsB330,'profileWordsB330',count);
 }
 return s;
}

/** Runtime words must be supplied; this is not a ROM-image/BSS initializer.
 * Four complete222-word records and every course table have ONE race span.
 * The single HUD span also retains loaded opaque data and byte latches.
 * scene contains actual external fields only, with phase650/main638 names.
 * rngState4640 is unsigned32; seed6f00 and field4964 are separate unsigned
 * halfwords. Pending signed-halfword players60c is distinct from active players.
 * Partial scene samples are allowed; each entry point requires its real reads.
 * Optional i1Words9440 retains that overlay's separate168-word data/BSS span.
 * Optional profileWordsB330[50 or52] owns B330..B3F8 or B330..B400 exclusive.
 * The extended view includes the four adjacent B3F8..B3FE rider halfwords;
 * no second flag owner is accepted. Older bounded leaves retain50-word input.
 * when supplied, difficulty comes from itsB338 word, never scene.difficulty.
 */
export function createNativeRaceState(value){return freeze(copy(value));}
export function nativeRaceStateSnapshot(value){return copy(value);}

function patchHud(s,op){
 const width=integer(op.width,'HUD width',1,4),offset=integer(op.byteOffset,'HUD byteOffset',0,HUD_WORDS*4-width);
 if(![1,2,4].includes(width)||offset%width)throw new RangeError('Invalid HUD patch width/alignment');
 const value=integer(op.value,'HUD patch bits',0,width===1?255:width===2?65535:0xffffffff),i=offset>>>2;
 if(width===4)s.hudWords7788[i]=value;
 else{const shift=(4-width-(offset&3))*8,mask=width===1?255:65535;
  s.hudWords7788[i]=((s.hudWords7788[i]&~(mask<<shift))|(value<<shift))>>>0;}
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
   if(op.field==='difficulty'&&s.profileWordsB330!==undefined)s.profileWordsB330[2]=bits;
   else{const value=op.field==='rngState4640'?bits:bits|0;
    s.scene[op.field]=integer(value,`source word ${op.field}`,...(sceneRanges[op.field]??[MIN,MAX]));}
  }else if(op.kind==='sourceHalfwordWrite'){
   if(!sceneHalves.has(op.field))throw new RangeError(`Unsupported external source halfword ${op.field}`);
   const bits=integer(op.value,'source halfword bits',0,65535);
   s.scene[op.field]=sceneRanges[op.field][0]<0?bits<<16>>16:bits;
  }else if(op.kind==='i1Write'||op.kind==='profileWrite'){
   const key=op.kind==='i1Write'?'i1Words9440':'profileWordsB330';
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   const width=op.width,count=s[key].length;
   if(width!==4&&(op.kind!=='profileWrite'||width!==2))throw new RangeError(`Invalid ${key} patch width`);
   const offset=integer(op.byteOffset,`${key} byteOffset`,0,count*4-width);
   if(offset%width)throw new RangeError(`Invalid ${key} word alignment`);
   const value=integer(op.value,`${key} bits`,0,width===2?65535:0xffffffff),index=offset>>>2;
   if(width===4)s[key][index]=value;
   else{const shift=offset&2?0:16;s[key][index]=((s[key][index]&~(65535<<shift))|(value<<shift))>>>0;}
  }else if(op.kind==='bodyTuneWordWrite'){
   integer(op.racerIndex,'body tune racerIndex',0,3);integer(op.wordIndex,'body tune wordIndex',0,3);
   integer(op.value,'body tune raw word',0,0xffffffff);effects.push(structuredClone(op));
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

/** Source fade initialization writes the existing shared HUD owner. Advancing
 * or drawing the fade is separate; these preparations neither execute an
 * original initializer again nor create a parallel decoded fade state.
 */
export function prepareNativeRaceFadePropertiesUpdate(state,input){
 const next=copy(state),prepared=prepareNativeRaceFadePropertiesInitialization(input),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceFadeSlotsResetUpdate(state,input){
 const next=copy(state),prepared=prepareNativeRaceFadeSlotsReset(input),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

/** Direct9345C configuration and its two reached fade initializers, with one
 * canonical profile/HUD/scene owner. The source's resource96960/9684C writes,
 * physical body-tune writes and finalC21F4 audio entry remain ordered REQUIRED
 * pending effects. They must be resolved at their call positions before this
 * preparation can become a complete live main bootstrap. No callback runs or
 * resource descriptor is fabricated here. Earlier resource writes do not
 * overlap the later direct caller predicates/fade spans in this bounded path.
 *
 * sourceViews supplies the main leaf's readonly data and actual raw9/11-word
 * fade templates. The replaced fade entries never remain pending for replay.
 * Mode4 requires52 profile words; other branches retain50-word compatibility.
 * Canonical players/racerCount remain bounded even when the standalone direct
 * leaf can describe wider signed-halfword transport. Invalid late input leaves
 * every supplied owner unchanged, including the profile's flag tail and RNG.
 */
export function prepareNativeRaceMainConfigurationUpdate(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeRaceMainConfiguration(next,sourceViews),operations=[],effects=[],expandedFadeConsumers=[];
 for(const operation of prepared.operations){
  let batch=[operation];
  if(operation.kind==='externalCall'&&operation.consumer==='801e6fb0'){
   const [type,rate,selector]=operation.arguments;
   batch=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,
    type:type|0,rate:rate|0,selector:selector|0}).operations;
   expandedFadeConsumers.push(operation.consumer);
  }else if(operation.kind==='externalCall'&&operation.consumer==='801e6a4c'){
   if(operation.arguments[0]!==0||operation.arguments[1]!==0)throw new RangeError('Unreconstructed main fade slot arguments');
   batch=prepareNativeRaceFadeSlotsReset({slotTemplateWords6c50:sourceViews.slotTemplateWords6c50}).operations;
   expandedFadeConsumers.push(operation.consumer);
  }
  operations.push(...batch);effects.push(...apply(next,batch));
 }
 return freeze({state:next,operations,effects,diagnostic:{sourceMain:prepared.diagnostic,expandedFadeConsumers,
  pendingResourceConsumers:['80096960','8009684c'],finalAudioPending:true,physicalInitialization:false}});
}

/** Complete numeric water-noise initialization from the canonical shared RNG.
 * Return the replacement water arrays and canonical state as one preparation;
 * the live field owner commits both together. No other scene setup or caller
 * of the shared stream is skipped, and the separate HUD seed6f00 is retained.
 */
export function prepareNativeRaceWaterInitialization(state,input={}){
 const next=copy(state),water=prepareNativeWaterInitialization({amplitudeNative:input.amplitudeNative,
  rngState4640:sceneValue(next,'rngState4640')});
 const operations=[{kind:'sourceWordWrite',field:'rngState4640',value:water.rngState4640}];
 const effects=apply(next,operations);
 return freeze({state:next,water:{heightQ:water.heightQ,velocityQ:water.velocityQ},operations,effects,
  diagnostic:{rngCalls:water.rngCalls}});
}

/** One actual948DC wave-kind selection. Pending60c and the shared32-bit RNG
 * come from canonical scene storage; course tables are explicit readonly data.
 * The enclosing main initializer still owns selecting kind and committing the
 * returned waveValue to its pending/active wave parameters.
 */
export function prepareNativeRaceWaveSelectionUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceWaveSelection({kind:input.kind,courseWaves1P:input.courseWaves1P,
  courseWavesOther:input.courseWavesOther,pendingPlayers60c:next.scene.pendingPlayers60c,
  courseIndex:next.scene.courseIndex,rngState4640:next.scene.rngState4640});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Readonly grid/matrix arguments from the canonical source order and scene.
 * Supplied rows/anchors are actual geometry views. This does not initialize
 * a hull/rider, evaluate48854, change its actor or copy camera histories.
 */
export function nativeRaceGridPlacementView(state,input){
 record(input,'source grid geometry input');const s=copy(state),racerIndex=integer(input.racerIndex,'racerIndex',0,3);
 return prepareNativeRaceGridPlacement({...s.scene,racerIndex,primaryNodes:input.primaryNodes,secondaryNodes:input.secondaryNodes,
  trainingAnchorsNative:input.trainingAnchorsNative,order26c0:s.raceWords1f94.slice(ri(0x26c0),ri(0x26c0)+4).map(v=>v|0),
  training2c70:s.raceWords1f94[ri(0x2c70)+racerIndex*222]|0});
}
/** Transient grid-to-physical matrix view: evaluate the actual constructor,
 * pack its16.16 destination, then decode that quantized destination as62E50
 * does. Never substitute the pre-pack axes for decoded.frameNative. Partial
 * constructor outcomes retain their scratch writes and leave decoded null;
 * the existing packed destination has not been supplied or overwritten.
 * This prepares no hull/rider, point histories, centroid, actor or camera and
 * writes no canonical state. The physical initializer remains a separate call.
 */
export function nativeRaceGridTransformView(state,input){
 const placement=nativeRaceGridPlacementView(state,input),transform=prepareNativeRaceStartTransform(placement),
  decoded=transform.complete?decodeNativeRaceStartTransform(transform):null;
 return freeze({placement,transform,decoded});
}
/** The separate16ce physics selector reads actual canonical scene half4964;
 * no control-origin or inferred human/AI identity replaces it. */
export function nativeRaceComputerProfileView(state,racerIndex){
 const s=copy(state);return selectNativeRaceComputerProfile({...s.scene,racerIndex});
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
// Both original camera records live INSIDE the canonical HUD span. These are
// temporary readonly views of its current words, never another camera owner.
function cameraViews(s,kind,input){
 if(Object.hasOwn(input,'camerasByIndex'))throw new RangeError('camerasByIndex overlaps canonical hudWords7788');
 return Array.from({length:2},(_,index)=>{
  const base=0x7c80+index*0x10c,f=offset=>readFloat(s.hudWords7788[hi(base+offset)]);
  return kind==='direction'?{positionNativeXZ:{x:f(0x4c),z:f(0x54)},directionXZ:{x:f(0x64),z:f(0x6c)}}:
   {field4c:f(0x4c),field54:f(0x54),field7c:f(0x7c),field84:f(0x84),fieldF0:f(0xf0),fieldF4:f(0xf4)};
 });
}
export function prepareNativeRaceDirectionWarningUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceDirectionWarning({...input,camerasByIndex:cameraViews(next,'direction',input),
  raceWords1f94:next.raceWords1f94,scene:next.scene}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRacePlacementFeedbackUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRacePlacementFeedback({...input,raceWords1f94:next.raceWords1f94,
  hudWords7788:next.hudWords7788,scene:next.scene}),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceRivalIndicatorsUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceRivalIndicators({...input,camerasByIndex:cameraViews(next,'rivals',input),
  raceWords1f94:next.raceWords1f94,hudWords7788:next.hudWords7788,scene:next.scene}),effects=apply(next,prepared.operations);
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

/** Complete5800 numeric i1 update. The first-update587C initializer precedes
 * the independent course0/pendingmode4/special0 sequence gate. It retains the
 * one-shot latch for the later display stage; neither players nor activity
 * adds a gate here. Loaded table/template words remain in canonical i1 state.
 */
export function prepareNativeRaceI1Update(state,input={}){
 const next=copy(state),operations=[],effects=[],diagnostic={initializationCalled:false,sequenceCalled:false,sequence:null};
 function commit(prepared){operations.push(...prepared.operations);effects.push(...apply(next,prepared.operations));}
 if(sceneValue(next,'initLatch63c')!==0&&sceneValue(next,'gameStateAb24')===40){
  commit(prepareNativeRacePrestartInitialization(next));diagnostic.initializationCalled=true;
 }
 if(sceneValue(next,'courseIndex')===0&&sceneValue(next,'mode608')===4&&sceneValue(next,'specialAb64')===0){
  const sequence=prepareNativeRaceCourseZeroSequenceUpdate({...next,descriptorLengthWords6894:input.descriptorLengthWords6894});
  commit(sequence);diagnostic.sequenceCalled=true;diagnostic.sequence=sequence.diagnostic;
 }
 return freeze({state:next,operations,effects,diagnostic});
}

/** A single admitted6BD8 numeric display call, including style0 shared writes.
 * Named draw recipes are logical screen-space work for the high-resolution
 * renderer; they contain no original image or display-list payload. Do not
 * replay the original6BD8 after applying these already-prepared numeric writes.
 */
export function prepareNativeRaceCourseZeroSequenceDisplayUpdate(state){
 const next=copy(state),prepared=prepareNativeRaceCourseZeroSequenceDisplay(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

/** Prepared5AE4 stage with6BD8 numeric/draw recipes expanded at its actual
 * call site. The older PrestartStageUpdate retains its explicit opaque6BD8
 * contract. This entry removes that original call, preserving the once-only
 * movement, style stores and final glyph before expiry. Other stage helpers
 * remain ordered pending recipes under the existing explicit-return contract.
 *
 * externalReturns still supplies actual consumed graphics-head values. The
 * replaced6BD8 input/return are retained in diagnostics; no synthetic head is
 * produced by a high-resolution drawing recipe. Its retained writes are
 * disjoint from the subsequent5DF4 predicates, so that existing dispatcher
 * can prepare those predicates before this ordered local expansion.
 */
export function prepareNativeRaceI1DisplayUpdate(state,input={}){
 const next=copy(state),stage=prepareNativeRacePrestartStage({...next,externalReturns:input.externalReturns}),
  operations=[],effects=[],sequenceCalls=[];
 for(const op of stage.operations){
  if(op.kind==='externalCall'&&op.consumer==='802c6bd8'){
   const sequence=prepareNativeRaceCourseZeroSequenceDisplay(next);
   operations.push(...sequence.operations);effects.push(...apply(next,sequence.operations));
   sequenceCalls.push({sourceHead:op.arguments[0],sourceReturnWord:op.returnWord,diagnostic:sequence.diagnostic});
  }else{operations.push(op);effects.push(...apply(next,[op]));}
 }
 return freeze({state:next,operations,effects,displayListHead:stage.displayListHead,diagnostic:{sequenceCalls}});
}

function currentPrimaryNodes(layout,primary){
 const changes=new Map((primary?.nodePositionsNative??[]).map(p=>[p.sourceRow,p]));
 const rows=[];
 for(const n of layout.nodes){const p=changes.get(n.sourceRow);
  rows[n.sourceRow]=p?{...n,centerNativeXZ:{x:p.x,z:p.z}}:n;}
 return rows;
}

/** Complete ordinary79528 numeric composition through its eight HUD consumers.
 * Physical movement and input have already run. input.primary is the existing
 * primary phase sample; bodiesBySlot is ONE coherent native body view shared
 * by direction, speed, placement, rivals and boundary warnings. Native camera
 * records derive from canonical HUD words; only their external view indices
 * and readonly angle/sine tables are supplied. The primary Fortress cue reads
 * those same selected HUD positions, never a second gate-camera input. Current primary node centers
 * use the same input.primary.nodePositionsNative override as race judging.
 *
 * Source order is FC39C→EF504→F23A0→[F03E0]→F8DD0→F9EA0→F0E7C→F1CFC.
 * The conditional start gate reads fresh post-prelude canonical status. All
 * overlay writes commit immediately to the next local consumer. tailOperations
 * describes these overlay stores/effects only; earlier phase writes are already
 * reflected in state. Audio/profiling remain the existing explicit boundaries.
 * This does not run physics, i1 update/display, saving or renderer interpolation.
 * A failed later consumer leaves the supplied state entirely unchanged.
 */
export function prepareNativeRaceOrdinaryUpdate(layout,state,input={}){
 record(input,'ordinary source update input');
 if(Object.hasOwn(input,'camerasByIndex'))throw new RangeError('camerasByIndex overlaps canonical hudWords7788');
 const current=copy(state);let primaryInput=input.primary;
 if(sceneValue(current,'activity624')===-1){
  if(primaryInput!==undefined){record(primaryInput,'primary source samples');
   if(Object.hasOwn(primaryInput,'gateCamerasNativeXZ'))throw new RangeError('gateCamerasNativeXZ overlaps canonical hudWords7788');}
  const indices=input.cameraIndicesByView,cameras=cameraViews(current,'direction',input),players=sceneValue(current,'players');
  if(!Array.isArray(indices)||indices.length>2)throw new RangeError('Supply actual source camera view indices');
  const gateCamerasNativeXZ=Array.from({length:players},(_,view)=>cameras[integer(indices[view],'camera view index',0,1)].positionNativeXZ);
  primaryInput={...primaryInput,gateCamerasNativeXZ};
 }
 const primary=prepareNativeRacePrimaryUpdate(layout,current,primaryInput);
 let next=primary.state;
 const diagnostic={primary:primary.diagnostic,consumers:[],conditionalStart:false};
 if(!primary.applied)return freeze({state:next,applied:false,effects:primary.effects,tailOperations:[],diagnostic});
 const pending=['overlayFc39c','overlayEf504','overlayF23a0'],prefix=primary.effects.slice(0,-3);
 if(!primary.effects.slice(-3).every((op,i)=>op.kind==='externalCall'&&op.consumer===pending[i])||primary.effects.length<3)
  throw new RangeError('Missing ordinary source prelude recipes');
 const effects=[...prefix],tailOperations=[];
 function consume(consumer,result){
  next=result.state;effects.push(...result.effects);tailOperations.push(...result.operations);
  diagnostic.consumers.push({consumer,diagnostic:result.diagnostic??null});
 }
 consume('overlayFc39c',prepareNativeRaceStatusPreludeUpdate(next));
 consume('overlayEf504',prepareNativeRaceDirectionWarningUpdate(next,{
  bodiesBySlot:input.bodiesBySlot,cameraIndicesByView:input.cameraIndicesByView,
  primaryNodesBySourceRow:currentPrimaryNodes(layout,input.primary),angleTableWords6f08:input.angleTableWords6f08,
  warningSuppressionRegionsNative:input.warningSuppressionRegionsNative,
  genericObjectCountFa40:input.genericObjectCountFa40,genericObjects:input.genericObjects}));
 consume('overlayF23a0',prepareNativeRaceSpeedDisplayUpdate(next,{bodyFieldsBySlot:input.bodiesBySlot}));
 const continuation=prepareNativeRacePresentationContinuation(next);
 diagnostic.conditionalStart=continuation.conditionalCalled;
 if(continuation.conditionalCalled)
  consume('overlayF03e0',prepareNativeRaceCountdown(next,{pressedButtonsB58BySlot:input.pressedButtonsB58BySlot}));
 consume('overlayF8dd0',prepareNativeRacePlacementFeedbackUpdate(next,{bodiesBySlot:input.bodiesBySlot}));
 consume('overlayF9ea0',prepareNativeRaceRivalIndicatorsUpdate(next,{bodiesBySlot:input.bodiesBySlot,
  cameraIndicesByView:input.cameraIndicesByView,angleTableWords6f08:input.angleTableWords6f08,sineTableWords4350:input.sineTableWords4350}));
 consume('overlayF0e7c',prepareNativeRaceMissFeedbackUpdate(next));
 consume('overlayF1cfc',prepareNativeRaceBoundaryWarningUpdate(next,{bodiesBySlot:input.bodiesBySlot,allowedRegionsNative:input.allowedRegionsNative}));
 return freeze({state:next,applied:true,effects,tailOperations,diagnostic});
}
