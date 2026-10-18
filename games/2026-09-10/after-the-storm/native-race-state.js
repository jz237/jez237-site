import {prepareNativeRaceFadeUpdate} from './native-race-fade-update.js';
import {prepareNativeMenuInput,prepareNativeDeviceSample,prepareNativeDeviceReset} from './native-menu-input.js';
import {prepareNativeRaceResultCPUDisplay} from './native-race-prestart-stage.js';
import {prepareNativeRaceWidgetUpdate,prepareNativeRaceHUDAnimationUpdate} from './native-race-widget-update.js';
import {NATIVE_AI_STORAGE_WORDS} from './native-ai-storage.js';
import {prepareNativeRaceCameraInput} from './native-race-camera-input.js';
// Shared source race/HUD storage. Decoded leaf views are temporary, and all
// overlapping records, tables, timers and flags return to these same owners.
import {createNativeRaceResetState,prepareNativeRaceReset} from './native-race-reset.js';
import {prepareNativeRaceStartupOverlay} from './native-race-startup-overlay.js';
import {prepareNativeRaceStartControl} from './native-race-start-control.js';
import {createNativePrimaryRacePhaseState,prepareNativePrimaryRacePhase} from './native-primary-race-phase.js';
import {prepareNativeRacePresentationTail} from './native-race-finalization.js';
import {prepareNativeRaceBoundaryWarning} from './native-race-boundary-warning.js';
import {prepareNativeRaceStatusPrelude} from './native-race-status-prelude.js';
import {prepareNativeRacePrestartInitialization,prepareNativeRacePrestartStatus,prepareNativeRacePrestartStage,prepareNativeRaceResultInitialization,prepareNativeRaceResultUpdate,prepareNativeRaceResultDisplay} from './native-race-prestart-stage.js';
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
import {prepareNativeCourseMenuReturn,prepareNativeRiderMenuReturn,prepareNativeTitleMenuReturn,prepareNativeChampionshipMenuReturn} from './native-menu-return-initialization.js';
import {prepareNativeRaceMenuInitialization} from './native-race-menu-initialization.js';
import {prepareNativeNameEntryInitialization,prepareNativeNameEntryInput,prepareNativeNameEntryAnimationPhase,prepareNativeNameEntryRecordUpdate,prepareNativeNameEntryDisplay} from './native-name-entry.js';
import {prepareNativeNameEntryPresentation} from './native-name-presentation.js';
import {prepareNativeResultsMenuInitialization,prepareNativeResultsMenuInput,prepareNativeResultsMenuDisplay} from './native-results-menu.js';
import {prepareNativeContinuationMenuInitialization,prepareNativeContinuationMenuInput,prepareNativeContinuationMenuExit,prepareNativeContinuationMenuDisplay} from './native-continuation-menu.js';
import {prepareNativeRaceRiderResourceConfiguration,prepareNativeRaceCourseResourceConfiguration} from './native-race-resource-configuration.js';
import {prepareNativeRaceResultCodeSelection} from './native-race-body-fields.js';
import {prepareNativePrimaryResultEstimates} from './native-primary-standings.js';
import {enqueueNativeStuntAward,displayNativeStuntAwards} from './native-stunt-awards.js';
import {prepareNativeStuntRecords} from './native-stunt-records.js';
import {createNativeStuntScoring,stepNativeStuntScoring} from './native-stunt-scoring.js';
import {prepareNativeStuntPrelude} from './native-stunt-prelude.js';
import {prepareNativeStuntCheckpoint} from './native-stunt-checkpoint.js';
import {prepareNativeStuntFinish} from './native-stunt-finish.js';
import {prepareNativeStuntRings} from './native-stunt-rings.js';
import {prepareNativeObjectInitialization} from './native-object-initialization.js';
import {prepareNativePrimaryScratchContext} from './native-primary-scratch-context.js';

const MIN=-2147483648,MAX=2147483647,RACE_BASE=0x1f94,RACE_WORDS=1693,HUD_BASE=0x7788,HUD_WORDS=1442;
const resourceOwnerWords={resourceWordsB330:20,resourceWordsB538:8,resourceWordsE73c:43};
const floatBits=new DataView(new ArrayBuffer(4));
const raceInts={fortressFlag1fc8:0x1fc8,southernLap1fcc:0x1fcc,drakeFog1fd0:0x1fd0,flag1fc4:0x1fc4,
 flag1fd4:0x1fd4,flag1fd8:0x1fd8,bestTime1fe0:0x1fe0,bestLapFlag2658:0x2658,finishWait1fdc:0x1fdc,
 recordPlace2650:0x2650,bestLapFlag2654:0x2654};
const raceFloats={finishMetric39b0:0x39b0,dqMetric39b4:0x39b4,checkpointSlackNative39c4:0x39c4};
const hudInts={recordFlag8a98:0x8a98,placeChanged8a9c:0x8a9c};
// Only words physically outside both spans belong in scene. The same actual
// reverse halfword is viewed as unsigned by progress and signed by reset.
// metadataD9b0 is the one800DA9B0 owner for both record rider attribution and
// fallback initials. A separate nameIndexA9b0 would diverge on rider changes.
const sceneRanges={fieldAb0c:[-32768,32767],championshipCountAa00:[-32768,32767],primaryHumanIndex:[0,3],secondaryHumanIndex:[0,3],players:[1,2],courseIndex:[0,11],
 racerCount:[0,4],primaryCount:[0,64],finishSourceRow:[0,63],activity624:[-32768,32767],event628:[-32768,32767],
 pendingPlayers60c:[-32768,32767],participantCount60e:[-32768,32767],result6f0:[-32768,32767],field62a:[-32768,32767],specialAb64:[-32768,32767],ready6fc:[-32768,32767],field4964:[0,65535],
 reverseDab68:[0,65535],missesEnabled72e:[0,65535],seed6f00:[0,65535],rngState4640:[0,0xffffffff],inputTick1960:[0,0xffffffff],style6e28:[0,65535],
 field4970:[0,65535],field72c:[0,65535],fieldA9ac:[0,65535],pressed65a:[0,65535],unlockAb60:[-32768,32767],freshNameAb6c:[-32768,32767],variant6f4:[-32768,32767],variant6f6:[-32768,32767]};
const sceneWords=new Set(['collisionPlaneCount0578','alternate8250','ringNext0cb0','ringStreak0cb4','objectCountFa40','ringCountB134','titlePairSelectionA9fc','fieldAa08','fortressCourse3a10','cold8224','clockStopped817c','phase650','simulation648','main638','mode620','state600',
 'missLimit8174','noFinish8178','configuredLaps728','difficulty','directionFlag1f90','ambientD4b00','fortressD8240',
 'metadataD9b0','metadataCb32c','restart6f8','initLatch63c','gameStateAb24','mode608','returnState630','forceFirst8228','demoOffset5438','rngState4640','inputTick1960','style6e2c',
 'previousGameState634','field640','field644','fieldAb1c','fieldAb2c','field461c','field700','field704','field708','field70c','field710','field714','resultEffect393c','wave610','missLimit614','lapCount618','field61c','wave49b0','field64c','players','racerCount','toggleD9914','previousNavigationD9874','trainingSelectionDa9f8',
 'riderSelectionA9c0','secondRiderSelectionA9c4','riderFlagA9c8','secondRiderFlagA9cc','courseSelectionA9d0','courseIndex']);
const sceneHalves=new Set(['fieldAb0c','championshipCountAa00','activity624','event628','field62a','pendingPlayers60c','participantCount60e','result6f0','specialAb64','ready6fc','reverseDab68','missesEnabled72e','seed6f00','field4964','style6e28',
 'field4970','field72c','fieldA9ac','pressed65a','unlockAb60','freshNameAb6c','variant6f4','variant6f6']);
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
 if(k==='pressed65a'&&s.menuWordsE658!==undefined)return s.menuWordsE658[0]&65535;
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
 if(value.objectWordsC940!==undefined)s.objectWordsC940=words(value.objectWordsC940,'objectWordsC940',3136);
 if(value.collisionPlaneWordsFd78!==undefined)s.collisionPlaneWordsFd78=words(value.collisionPlaneWordsFd78,'collisionPlaneWordsFd78',512);
 if(value.packedObjectMatrixWords0cd0!==undefined)s.packedObjectMatrixWords0cd0=words(value.packedObjectMatrixWords0cd0,'packedObjectMatrixWords0cd0',1024);
 if(value.aiWords3c60!==undefined)s.aiWords3c60=words(value.aiWords3c60,'aiWords3c60',NATIVE_AI_STORAGE_WORDS);
 if(value.saveWordsB280!==undefined)s.saveWordsB280=words(value.saveWordsB280,'saveWordsB280',34);
 if(value.menuWordsE658!==undefined){
  if(Object.hasOwn(scene,'pressed65a'))throw new RangeError('pressed65a overlaps menuWordsE658');
  s.menuWordsE658=words(value.menuWordsE658,'menuWordsE658',21);
 }
 if(value.deviceWords4308!==undefined)s.deviceWords4308=words(value.deviceWords4308,'deviceWords4308',10);
 if(value.nameEntryWords61c4!==undefined)s.nameEntryWords61c4=words(value.nameEntryWords61c4,'nameEntryWords61c4',14);
 if(value.resultsMenuWords6d30!==undefined)s.resultsMenuWords6d30=words(value.resultsMenuWords6d30,'resultsMenuWords6d30',4);
 if(value.continuationMenuWords61e0!==undefined)s.continuationMenuWords61e0=words(value.continuationMenuWords61e0,'continuationMenuWords61e0',4);
 if(value.continuationDataWords60f0!==undefined)s.continuationDataWords60f0=words(value.continuationDataWords60f0,'continuationDataWords60f0',20);
 if(value.profileWordsB330!==undefined){
  if(Object.hasOwn(scene,'difficulty'))throw new RangeError('difficulty overlaps profileWordsB330');
  const count=value.profileWordsB330?.length;
  if(count!==50&&count!==52)throw new RangeError('profileWordsB330 requires50 or52 unsigned words');
  s.profileWordsB330=words(value.profileWordsB330,'profileWordsB330',count);
 }
 for(const [key,count]of Object.entries(resourceOwnerWords))if(value[key]!==undefined){
  const size=key==='resourceWordsB330'&&value[key]?.length===36?36:count;s[key]=words(value[key],key,size);
 }
 return s;
}

/** Runtime words must be supplied; this is not a ROM-image/BSS initializer.
 * Four complete222-word records and every course table have ONE race span.
 * The single HUD span also retains loaded opaque data and byte latches.
 * scene contains actual external fields only, with phase650/main638 names.
 * Optional aiWords3c60 owns the four retained AI contexts and adjacent target/
 * order/proximity scratch through4218. Its slot4 role alias is in this same
 * span. Decoded driver states are temporary views, never a second saved bank.
 * rngState4640 is unsigned32; seed6f00 and field4964 are separate unsigned
 * halfwords. Pending signed-halfword players60c is distinct from active players.
 * Partial scene samples are allowed; each entry point requires its real reads.
 * Optional i1Words9440 retains that overlay's separate168-word data/BSS span.
 * Optional objectWordsC940[3136] owns all64 retained49-word source objects at
 * 801BC940..FA40, exclusive. objectCountFa40 and ringNext0cb0/ringStreak0cb4
 * are separate external words; total collected ring count292C is in raceWords.
 * Optional collisionPlaneWordsFd78[512] owns32 retained16-word planes at
 * 801BFD78..801C0578; collisionPlaneCount0578 stays in scene. Optional
 * packedObjectMatrixWords0cd0[1024] owns64 packed matrices at801C0CD0..1CD0.
 * These are separate from the float matrices inside objectWordsC940 records.
 * Optional nameEntryWords61c4[14] owns shared name-menu scratch802261C4..61FC;
 * it does not overlap the HUD wheel/name bytes or the i1 overlay. field700 is
 * signed32 transport of four retained name bytes; freshNameAb6c is signed16.
 * Optional resultsMenuWords6d30[4] owns normal-results overlay phase, two
 * signed sliding offsets and delay at802C6D30..6D40, exclusive. It is separate
 * from the race overlay and reads the combined menu record's pressedE692.
 * Optional continuationMenuWords61e0[4] owns ovl_i14 phase/offsets/count BSS.
 * continuationDataWords60f0[20] retains its loaded selection, numeric choice
 * tables and audio-once latch through6140, exclusive. Intervening untouched
 * descriptor words are opaque; original graphics assets are not implied.
 * Optional profileWordsB330[50 or52] owns B330..B3F8 or B330..B400 exclusive.
 * The extended view includes the four adjacent B3F8..B3FE rider halfwords;
 * no second flag owner is accepted. Older bounded leaves retain50-word input.
 * When supplied, difficulty comes from itsB338 word, never scene.difficulty.
 * Optional saveWordsB280[34] owns801CB280..B308, ending before the wave-row
 * regionB308 and metadataB32C. Result initials and unlock bytes share it.
 * Optional resourceWordsB330[20|36] owns800DB330..B380 or..B3C0, distinct from profile
 * 801CB330. resourceWordsB538[8] owns800DB538..B558; resourceWordsE73c[43]
 * owns801CE73C..E7E8. These raw descriptors/selectors retain source data;
 * they do not imply loaded resources or duplicate named scene slot fields.
 * Optional menuWordsE658[21] owns all three28-byte menu input records; pressed65a
 * is a view of its first record, never a second scene field. deviceWords4308[10]
 * owns the separate four10-byte sampled device records, independently of rider AI.
 */
export function createNativeRaceState(value){return freeze(copy(value));}
export function nativeRaceStateSnapshot(value){return copy(value);}

/** Actual744EC initialization using the same object owner consumed by rings.
 * Readonly templates/table inputs are external selected-course resources.
 * This does not load71E70 rows or infer75274/6AACC startup scheduling. */
export function prepareNativeRaceObjectInitialization(state,input={}){
 const next=copy(state);record(input,'object initialization resources');
 for(const key of ['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0','objectCountFa40','courseIndex','players','mode620','difficulty','reverseDab68','alternate8250'])
  if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const scene=Object.fromEntries(['objectCountFa40','courseIndex','players','mode620','difficulty','reverseDab68','alternate8250'].map(k=>[k,sceneValue(next,k)]));
 const initialized=prepareNativeObjectInitialization({...input,...scene,objectWordsC940:next.objectWordsC940,
  collisionPlaneWordsFd78:next.collisionPlaneWordsFd78,packedObjectMatrixWords0cd0:next.packedObjectMatrixWords0cd0});
 for(const key of ['objectWordsC940','collisionPlaneWordsFd78','packedObjectMatrixWords0cd0'])next[key]=initialized[key];
 next.scene.collisionPlaneCount0578=initialized.collisionPlaneCount0578;
 return freeze({state:next,effects:[]});
}

const stuntSlotFields=['type','amount','age','x','y','velocityY','finishOffset'];
const stuntTotalFields={total:0x26d0,time:0x26d4,ring:0x26d8,trick:0x26dc};
function stuntAwardsView(s){
 return {slots:Array.from({length:4},(_,i)=>Object.fromEntries(stuntSlotFields.map((k,j)=>[k,s.hudWords7788[hi(0x8ae0)+i*7+j]|0]))),
  pulsePhase:s.hudWords7788[hi(0x8d14)]|0,pulseTick:s.hudWords7788[hi(0x8d18)]|0,
  totals:Object.fromEntries(Object.entries(stuntTotalFields).map(([k,a])=>[k,s.raceWords1f94[ri(a)]|0]))};
}
function commitStuntAwards(s,awards){
 awards.slots.forEach((slot,i)=>stuntSlotFields.forEach((k,j)=>s.hudWords7788[hi(0x8ae0)+i*7+j]=slot[k]>>>0));
 s.hudWords7788[hi(0x8d14)]=awards.pulsePhase>>>0;s.hudWords7788[hi(0x8d18)]=awards.pulseTick>>>0;
 for(const [k,a]of Object.entries(stuntTotalFields))s.raceWords1f94[ri(a)]=awards.totals[k]>>>0;
}

/** Detached read view, never an additional saved score/queue bank. The source
 * startup already clears the four type words through its shared HUD owner;
 * all other slot fields and pulse words retain their actual prior contents. */
export function nativeRaceStuntAwardsView(state){return freeze(stuntAwardsView(copy(state)));}

/** Consume qualified enqueue events in original producer order. This leaf has
 * no mode/contact gate, just like FB488: callers must establish eligibility.
 * Invalid later events leave the supplied canonical state unchanged. */
export function prepareNativeRaceStuntAwardEnqueue(state,awards){
 if(!Array.isArray(awards))throw new TypeError('Supply ordered qualified stunt award events');
 const next=copy(state),diagnostic=[];let queue=stuntAwardsView(next);
 for(const award of awards){const result=enqueueNativeStuntAward(queue,award);queue=result.state;
  diagnostic.push({slot:result.slot,replaced:result.replaced});}
 commitStuntAwards(next,queue);
 return freeze({state:next,diagnostic});
}

/** Reached source9328C display-stage consumer, after gameplay updates. The
 * gate reads the actual scene and HUD words, including overlay8aa4. Never run
 * this from the independent high-resolution render/interpolation callback. */
export function prepareNativeRaceStuntAwardDisplay(state){
 const next=copy(state),prepared=displayNativeStuntAwards(stuntAwardsView(next),{
  mainState638:sceneValue(next,'main638'),activity624:sceneValue(next,'activity624'),mode620:sceneValue(next,'mode620'),
  gameStateDab24:sceneValue(next,'gameStateAb24'),overlayMode8aa4:next.hudWords7788[hi(0x8aa4)]|0});
 commitStuntAwards(next,prepared.state);
 return freeze({...prepared,state:next});
}

/** Post-scoring79528 record branch, before the later display/transfer stage.
 * Selected primary finish status, delayed bonus AMOUNT39cc, totals and course
 * rows all come from the same race span. This does not persist records or
 * advance result menus. No caller-provided redundant score/finish fields. */
export function prepareNativeRaceStuntRecords(state){
 const next=copy(state),a=next.raceWords1f94,course=sceneValue(next,'courseIndex'),primary=sceneValue(next,'primaryHumanIndex');
 const base=ri(0x26e8)+course*12;
 const prepared=prepareNativeStuntRecords({flag1fd8:a[ri(0x1fd8)]|0,recordPlace2928:a[ri(0x2928)]|0,
  courseRecords:Array.from({length:3},(_,i)=>a.slice(base+i*4,base+(i+1)*4).map(v=>v|0))},
  {awards:stuntAwardsView(next),mainState638:sceneValue(next,'main638'),mode620:sceneValue(next,'mode620'),
   activity624:sceneValue(next,'activity624'),state600:sceneValue(next,'state600'),delayedAward39cc:a[ri(0x39cc)]|0,
   finished2c2c:a[ri(0x2c2c)+primary*222]|0,metadataD9b0:sceneValue(next,'metadataD9b0'),metadataCb32c:sceneValue(next,'metadataCb32c')});
 a[ri(0x1fd8)]=prepared.state.flag1fd8>>>0;a[ri(0x2928)]=prepared.state.recordPlace2928>>>0;
 prepared.state.courseRecords.forEach((row,i)=>row.forEach((v,j)=>a[base+i*4+j]=v>>>0));
 return freeze({...prepared,state:next});
}

const stuntMoveWords={previousMove:0x39c8,rotationGroup:0x26e0,pending:0x26e4};
const stuntRepeatWords={handstand:0x39d8,backwards:0x39dc,standing:0x39e0,dive:0x39e4};
const stuntCompletedWords={handstand:0x39e8,backwards:0x39ec,standing:0x39f0,somersault:0x39f4,dive:0x39f8,
 negativeRoll:0x39fc,positiveRoll:0x3a00,flip:0x3a04};
const stuntModeActive=s=>sceneValue(s,'activity624')===-1&&sceneValue(s,'mode620')===11;

/** Source783AC prelude in the shared state, including its delayed-award call.
 * Do not also call prepareNativeRaceStuntDelayedAwardUpdate for this racer.
 * On earlyReturn, skip that racer's later move AND checkpoint consumers. */
export function prepareNativeRaceStuntPreludeUpdate(state,input){
 const next=copy(state);
 if(!stuntModeActive(next))return freeze({state:next,applied:false,effects:[],diagnostic:{earlyReturn:false,reason:null}});
 const prepared=prepareNativeStuntPrelude({raceWords1f94:next.raceWords1f94,globals:next.scene},input),effects=[];
 for(const op of prepared.operations){
  if(op.kind==='stuntAwardEnqueue')commitStuntAwards(next,enqueueNativeStuntAward(stuntAwardsView(next),op.award).state);
  else effects.push(...apply(next,[op]));
 }
 return freeze({...prepared,state:next,applied:true,effects});
}

/** Reached geometry/checkpoint slice after move scoring. Current source node
 * selection comes from2944; scratch3780/3788 already came from76378. Terminal
 * finish/lap/visited-flag/unlock work is still required after continueFinish. */
export function prepareNativeRaceStuntCheckpointUpdate(state,input={}){
 const next=copy(state);
 if(!stuntModeActive(next))return freeze({state:next,applied:false,effects:[],diagnostic:{crossed:false,continueFinish:false}});
 const slot=integer(input.racerIndex,'racerIndex',0,3),row=next.raceWords1f94[ri(0x2944)+slot*222]|0;
 if(!Array.isArray(input.nodes)||row<0||row>=input.nodes.length)throw new RangeError('Supply the actual primary node selected by2944');
 const prepared=prepareNativeStuntCheckpoint({raceWords1f94:next.raceWords1f94,globals:next.scene},{...input,selectedNode:input.nodes[row]}),effects=[];
 for(const op of prepared.operations){
  if(op.kind==='stuntAwardEnqueue')commitStuntAwards(next,enqueueNativeStuntAward(stuntAwardsView(next),op.award).state);
  else effects.push(...apply(next,[op]));
 }
 return freeze({...prepared,state:next,applied:true,effects});
}

/** Source6E3A8 ring stage follows79528 judging/record checks, before7DBC0
 * object motion. Run once per reached world update, never per racer or render. */
export function prepareNativeRaceStuntRingUpdate(state,input={}){
 const next=copy(state);
 if(!stuntModeActive(next))return freeze({state:next,applied:false,effects:[],diagnostic:{collectedRows:[],fadedRows:[]}});
 const prepared=prepareNativeStuntRings({...next,globals:next.scene},input),effects=[];
 for(const op of prepared.operations){
  if(op.kind==='stuntAwardEnqueue')commitStuntAwards(next,enqueueNativeStuntAward(stuntAwardsView(next),op.award).state);
  else effects.push(...apply(next,[op]));
 }
 return freeze({...prepared,state:next,applied:true,effects});
}

export function prepareNativeRaceStuntFinishUpdate(state,input){
 const next=copy(state);
 if(!stuntModeActive(next))return freeze({state:next,applied:false,effects:[],diagnostic:{finished:false,masteryGranted:false}});
 const prepared=prepareNativeStuntFinish({raceWords1f94:next.raceWords1f94,globals:next.scene},input),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,applied:true,effects});
}

/** One actual76378/783AC racer invocation. All branches share canonical state:
 * scratch -> prelude/delayed/clock -> move -> checkpoint -> finish/lap/mastery.
 * A prelude early return skips the remainder. Call in original racer order;
 * the later79528 record check and source display stage are separate. Physics,
 * ring-object contacts, course initialization and live mode admission remain
 * the enclosing host's responsibility. */
export function prepareNativeRaceStuntRacerUpdate(state,input={}){
 let next=copy(state);const diagnostic={},effects=[];
 if(!stuntModeActive(next))return freeze({state:next,applied:false,effects,diagnostic});
 const slot=integer(input.racerIndex,'racerIndex',0,3),scratch=prepareNativePrimaryScratchContext(input.primaryScratchLayout,
  Object.fromEntries(['postJudgeSourceRow2c48','weed2c50','region2c54'].map(k=>[k,next.raceWords1f94[ri(parseInt(k.slice(-4),16))+slot*222]|0])),
  {...input,state638:sceneValue(next,'main638'),players:sceneValue(next,'players'),courseIndex:sceneValue(next,'courseIndex'),
   primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
   ...(next.scene.courseIndex===4?{difficulty:sceneValue(next,'difficulty')}:{})});
 ['x','y','z'].forEach((k,i)=>next.raceWords1f94[ri(0x3780)+i]=floatWord(scratch.positionNative[k]));
 for(const [key,value]of Object.entries(scratch.recordWrites))next.raceWords1f94[ri(parseInt(key.slice(-4),16))+slot*222]=value>>>0;
 effects.push(...scratch.effects);diagnostic.scratch=scratch.diagnostic;
 const prelude=prepareNativeRaceStuntPreludeUpdate(next,input);next=prelude.state;effects.push(...prelude.effects);diagnostic.prelude=prelude.diagnostic;
 if(prelude.diagnostic.earlyReturn)return freeze({state:next,applied:true,effects,diagnostic});
 const move=prepareNativeRaceStuntMoveUpdate(next,input);next=move.state;diagnostic.moveAwards=move.awards;
 const checkpoint=prepareNativeRaceStuntCheckpointUpdate(next,input);next=checkpoint.state;effects.push(...checkpoint.effects);diagnostic.checkpoint=checkpoint.diagnostic;
 const finish=prepareNativeRaceStuntFinishUpdate(next,{racerIndex:input.racerIndex,continueFinish:checkpoint.diagnostic.continueFinish,
  sourceRow:checkpoint.diagnostic.sourceRow,crossingOffsetNative:checkpoint.diagnostic.crossingOffsetNative,move1604:input.move});
 next=finish.state;effects.push(...finish.effects);diagnostic.finish=finish.diagnostic;
 return freeze({state:next,applied:true,effects,diagnostic});
}

/** Reached delayed-award slice78490..784D4, before the later clock/retirement
 * and move branches. The enclosing783AC event-retirement early return must
 * already have been handled by its caller. Does not run that prelude itself.
 * Amount39cc and signed countdown39d0 remain separate canonical words. */
export function prepareNativeRaceStuntDelayedAwardUpdate(state){
 const next=copy(state),a=next.raceWords1f94;
 if(!stuntModeActive(next))return freeze({state:next,applied:false,awards:[]});
 const ticks=a[ri(0x39d0)]|0,awards=[];
 if(ticks>0){
  a[ri(0x39d0)]=(ticks-1)>>>0;
  if(ticks===1){
   const award={kind:'trick',points:a[ri(0x39cc)]|0,finish:true};
   commitStuntAwards(next,enqueueNativeStuntAward(stuntAwardsView(next),award).state);
   a[ri(0x39cc)]=0;awards.push(award);
  }
 }
 return freeze({state:next,applied:true,awards});
}

/** Reached pose/rotation score slice, after the clock/retirement producer and
 * before checkpoint qualification. Inputs are the actual racer move1604 and
 * PRIMARY body's15ec arc (the original score branch uses that selected arc).
 * This is not the full783AC caller: no timers, checkpoint crossing, repeat
 * resets, ring contacts, finish bookkeeping or result menus are invented.
 * Delayed awards have their own earlier call above and never tick here.
 * Fresh reset produces0/1 flags; reject other retained flag encodings rather
 * than silently normalizing unknown raw state through boolean leaf views. */
export function prepareNativeRaceStuntMoveUpdate(state,{racerIndex,move,primaryArcNative}={}){
 const next=copy(state),a=next.raceWords1f94;
 if(!stuntModeActive(next))return freeze({state:next,applied:false,awards:[]});
 const slot=integer(racerIndex,'scoring racerIndex',0,3);
 if(a[ri(0x2c2c)+slot*222]!==0||a[ri(0x2c24)+slot*222]!==0)return freeze({state:next,applied:false,awards:[]});
 const scoring=createNativeStuntScoring();
 for(const [k,address]of Object.entries(stuntMoveWords))scoring[k]=a[ri(address)]|0;
 for(const [name,fields]of [['repeat',stuntRepeatWords],['completed',stuntCompletedWords]])
  for(const [k,address]of Object.entries(fields))scoring[name][k]=integer(a[ri(address)],`stunt flag${address.toString(16)}`,0,1)!==0;
 const prepared=stepNativeStuntScoring(scoring,{move,arcNative:primaryArcNative});
 for(const [k,address]of Object.entries(stuntMoveWords))a[ri(address)]=prepared.state[k]>>>0;
 for(const [name,fields]of [['repeat',stuntRepeatWords],['completed',stuntCompletedWords]])
  for(const [k,address]of Object.entries(fields))a[ri(address)]=Number(prepared.state[name][k]);
 let queue=stuntAwardsView(next);
 for(const award of prepared.awards)queue=enqueueNativeStuntAward(queue,award).state;
 commitStuntAwards(next,queue);
 return freeze({state:next,applied:true,awards:prepared.awards});
}

/** Read-only source actor result view. Apply its ordered body writes to the
 * real body owners at the actor phase, before later primary judging. Source
 * simulation0 never reaches this subsection of5DE24; no proxy result is made.
 */
export function nativeRaceResultCodeView(state,input={}){
 const current=copy(state);
 if(sceneValue(current,'simulation648')===0)return freeze({operations:[],diagnostic:{selected:false,reason:'zero-simulation'}});
 return prepareNativeRaceResultCodeSelection({...current,racerIndex:input.racerIndex,
  bodyResultCodes16c8:input.bodyResultCodes16c8,resultTableWords47fc:input.resultTableWords47fc,supportProbe:input.supportProbe});
}

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
  else if(op.kind==='menuInputWrite'||op.kind==='deviceInputWrite'){
   const key=op.kind==='menuInputWrite'?'menuWordsE658':'deviceWords4308';
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying input writes`);
   const width=integer(op.width,'input write width',1,4),offset=integer(op.byteOffset,'input byte offset',0,s[key].length*4-width),
    value=integer(op.value,'input write bits',0,2**(width*8)-1);
   for(let j=0;j<width;j++){const at=offset+j,index=at>>>2,shift=24-(at&3)*8,bits=(value>>>((width-j-1)*8))&255;
    s[key][index]=((s[key][index]&~(255<<shift))|(bits<<shift))>>>0;}
  }
  else if(op.kind==='raceByteWrite'||op.kind==='saveByteWrite'){
   const key=op.kind==='raceByteWrite'?'raceWords1f94':'saveWordsB280';
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   if(op.width!==1)throw new RangeError('Invalid source byte patch width');
   const offset=integer(op.byteOffset,`${key} byte offset`,0,s[key].length*4-1),shift=24-(offset&3)*8;
   const value=integer(op.value,'source byte bits',0,255),index=offset>>>2;
   s[key][index]=((s[key][index]&~(255<<shift))|(value<<shift))>>>0;
  }
  else if(op.kind==='aiWordWrite'){
   if(!s.aiWords3c60)throw new TypeError('Supply retained aiWords3c60 before applying AI writes');
   s.aiWords3c60[integer(op.wordIndex,'AI wordIndex',0,NATIVE_AI_STORAGE_WORDS-1)]=integer(op.value,'AI word bits',0,0xffffffff);
  }
  else if(op.kind==='raceWordWrite')s.raceWords1f94[integer(op.wordIndex,'race wordIndex',0,RACE_WORDS-1)]=integer(op.value,'race word bits',0,0xffffffff);
  else if(op.kind==='objectWordWrite'){
   if(!s.objectWordsC940)throw new TypeError('Supply retained objectWordsC940 before applying object writes');
   s.objectWordsC940[integer(op.wordIndex,'object wordIndex',0,3135)]=integer(op.value,'object word bits',0,0xffffffff);
  }
  else if(op.kind==='recordWordWrite'){
   const slot=integer(op.racerIndex,'record racerIndex',0,3),word=integer(op.wordIndex,'record wordIndex',0,221);
   s.raceWords1f94[ri(0x2938)+slot*222+word]=integer(op.value,'record word bits',0,0xffffffff);
  }else if(op.kind==='sourceWordWrite'){
   if(!sceneWords.has(op.field))throw new RangeError(`Unsupported external source word ${op.field}`);
   const bits=integer(op.value,'source word bits',0,0xffffffff);
   if(op.field==='difficulty'&&s.profileWordsB330!==undefined)s.profileWordsB330[2]=bits;
   else{const value=op.field==='rngState4640'||op.field==='inputTick1960'?bits:bits|0;
    s.scene[op.field]=integer(value,`source word ${op.field}`,...(sceneRanges[op.field]??[MIN,MAX]));}
  }else if(op.kind==='sourceHalfwordWrite'){
   if(!sceneHalves.has(op.field))throw new RangeError(`Unsupported external source halfword ${op.field}`);
   const bits=integer(op.value,'source halfword bits',0,65535);
   if(op.field==='pressed65a'&&s.menuWordsE658!==undefined)s.menuWordsE658[0]=((s.menuWordsE658[0]&0xffff0000)|bits)>>>0;
   else s.scene[op.field]=sceneRanges[op.field][0]<0?bits<<16>>16:bits;
  }else if(op.kind==='i1Write'||op.kind==='profileWrite'||op.kind==='nameEntryWrite'||op.kind==='resultsMenuWrite'||op.kind==='continuationMenuWrite'||op.kind==='continuationDataWrite'){
   const key=op.kind==='i1Write'?'i1Words9440':op.kind==='nameEntryWrite'?'nameEntryWords61c4':op.kind==='resultsMenuWrite'?'resultsMenuWords6d30':
    op.kind==='continuationMenuWrite'?'continuationMenuWords61e0':op.kind==='continuationDataWrite'?'continuationDataWords60f0':'profileWordsB330';
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   const width=op.width,count=s[key].length;
   if(width!==4&&(!['profileWrite','nameEntryWrite'].includes(op.kind)||width!==2))throw new RangeError(`Invalid ${key} patch width`);
   const offset=integer(op.byteOffset,`${key} byteOffset`,0,count*4-width);
   if(offset%width)throw new RangeError(`Invalid ${key} word alignment`);
   const value=integer(op.value,`${key} bits`,0,width===2?65535:0xffffffff),index=offset>>>2;
   if(width===4)s[key][index]=value;
   else{const shift=offset&2?0:16;s[key][index]=((s[key][index]&~(65535<<shift))|(value<<shift))>>>0;}
  }else if(op.kind==='bodyTuneWordWrite'){
   integer(op.racerIndex,'body tune racerIndex',0,3);integer(op.wordIndex,'body tune wordIndex',0,3);
   integer(op.value,'body tune raw word',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='resourceWrite'){
   const key=op.owner;
   if(!Object.hasOwn(resourceOwnerWords,key))throw new RangeError('Unknown resource owner');
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   const width=op.width;if(width!==2&&width!==4)throw new RangeError('Invalid resource patch width');
   const offset=integer(op.byteOffset,'resource byteOffset',0,s[key].length*4-width);
   if(offset%width)throw new RangeError('Invalid resource patch alignment');
   const value=integer(op.value,'resource bits',0,width===2?65535:0xffffffff),index=offset>>>2;
   if(width===4)s[key][index]=value;
   else{const shift=offset&2?0:16;s[key][index]=((s[key][index]&~(65535<<shift))|(value<<shift))>>>0;}
  }else if(op.kind==='presentationBufferWrite'){
   integer(op.bufferIndex,'presentation bufferIndex',0,1);integer(op.byteOffset,'presentation byteOffset',0,252);
   if(op.width!==4||op.byteOffset%4)throw new RangeError('Invalid presentation buffer word');
   integer(op.value,'presentation word bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='presentationWordWrite'){
   integer(op.address,'presentation address',0,0xffffffff);
   if(op.width!==4||op.address%4)throw new RangeError('Invalid presentation memory word');
   integer(op.value,'presentation word bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='nameEntryMatrix'){
   integer(op.slot,'name matrix slot',0,15);words(op.matrixWords,'name matrix words',16);effects.push(structuredClone(op));
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

/** Once-per-outer-frame device and menu input preparation. Physical samples
 * precede source menu adaptation and are independent of61708's AI selection.
 * All writes, including prior records and counters, commit atomically. */
export function prepareNativeRaceMenuInputAdvance(state,input={}){
 const next=copy(state);
 if(!next.deviceWords4308||!next.menuWordsE658)throw new TypeError('Supply retained deviceWords4308 and menuWordsE658');
 const deviceBytes4308=Array.from({length:4},(_,port)=>Array.from({length:10},(_,i)=>{
  const a=port*10+i;return (next.deviceWords4308[a>>>2]>>>(24-(a&3)*8))&255;
 }));
 const sampled=prepareNativeDeviceSample({...input,deviceBytes4308});
 const adapted=prepareNativeMenuInput({...input,deviceBytes4308:sampled.deviceBytes4308,menuWordsE658:next.menuWordsE658});
 const operations=[...sampled.operations,...adapted.operations],effects=apply(next,operations);
 return freeze({state:next,operations,effects});
}

export function nativeRaceMenuInputView(state,slot=0){
 integer(slot,'menu input slot',0,2);const storage=words(state.menuWordsE658,'menuWordsE658',21),base=slot*28;
 const half=o=>(storage[(base+o)>>>2]>>>((base+o)&2?0:16))&65535;
 const axis=o=>((storage[(base+o)>>>2]>>>(24-((base+o)&3)*8))&255)<<24>>24;
 return freeze({heldButtons:half(0),pressedButtons:half(2),releasedButtons:half(4),priorHeldButtons:half(6),
  rawXNative:axis(8),rawYNative:axis(9),horizontalHoldFrames:storage[(base+20)/4]|0,verticalHoldFrames:storage[(base+24)/4]|0});
}

// Leaf result APIs accept legacy prepared scene samples. Runtime callers with
// full menu storage expose the overlapping halfword only in this temporary view.
function resultInputView(state){return state.menuWordsE658===undefined?state:{...state,scene:{...state.scene,pressed65a:sceneValue(state,'pressed65a')}};}

/** Source fade initialization writes the existing shared HUD owner. Advancing
 * or drawing the fade is separate; these preparations neither execute an
 * original initializer again nor create a parallel decoded fade state.
 */
export function prepareNativeRaceFadePropertiesUpdate(state,input){
 const next=copy(state),prepared=prepareNativeRaceFadePropertiesInitialization(input),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
/** Advance the existing fade owner once; matrix/audio consumers remain effects. */
export function prepareNativeRaceFadeAdvance(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceFadeUpdate({hudWords7788:next.hudWords7788,
  main638:next.scene.main638,fadeTemplateWords6cc0:input.fadeTemplateWords6cc0,frameBufferBase:input.frameBufferBase,matrixTargets:input.matrixTargets});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}
/** Original5470 thenAFB4 numeric HUD updates share the canonical owner.
 * Matrix and audio effects are retained in source order for presentation. */
export function prepareNativeRaceWidgetAdvance(state,input={}){
 const next=copy(state),widgets=prepareNativeRaceWidgetUpdate({...input,hudWords7788:next.hudWords7788,
  mode608:next.scene.mode608,activity624:next.scene.activity624,recordPlace2650:next.raceWords1f94[ri(0x2650)]|0});
 const operations=[...widgets.operations],effects=apply(next,widgets.operations);
 const animation=prepareNativeRaceHUDAnimationUpdate({hudWords7788:next.hudWords7788});
 operations.push(...animation.operations);effects.push(...apply(next,animation.operations));
 return freeze({state:next,operations,effects,diagnostic:widgets.diagnostic});
}
export function prepareNativeRaceFadeSlotsResetUpdate(state,input){
 const next=copy(state),prepared=prepareNativeRaceFadeSlotsReset(input),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

/** Numeric descriptor/selector preparation only. Both helpers write the
 * retained resource spans and, for riders, the existing HUD owner. No DMA,
 * decompression, relocation of loaded assets, queue or RNG executes here.
 */
export function prepareNativeRaceRiderResourceConfigurationUpdate(state,input,sourceViews={}){
 const next=copy(state),prepared=prepareNativeRaceRiderResourceConfiguration(next,input,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeRaceCourseResourceConfigurationUpdate(state,input,sourceViews={}){
 const next=copy(state),prepared=prepareNativeRaceCourseResourceConfiguration(next,input,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

/** Source1E1BA8 shares the retained name scratch and existing HUD/race owners.
 * The subsequent animation, physical input and record save loop is separate. */
export function prepareNativeNameEntryInitializationUpdate(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeNameEntryInitialization(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

export function prepareNativeNameEntryInputUpdate(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeNameEntryInput(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({state:next,operations:prepared.operations,effects,diagnostic:prepared.diagnostic});
}

export function prepareNativeNameEntryAnimationPhaseUpdate(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeNameEntryAnimationPhase(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

/** Original1290 initialization gate followed by its numeric animation prefix.
 * The latch stays set until the separate1E8C display caller clears it. Matrix
 * projection and crossing effects after183C remain the next required stage. */
export function prepareNativeNameEntryAnimationUpdate(state,sourceViews={}){
 const next=copy(state),operations=[],effects=[];
 const initialized=sceneValue(next,'initLatch63c')!==0&&sceneValue(next,'gameStateAb24')===100;
 if(initialized){const q=prepareNativeNameEntryInitialization(next,sourceViews);operations.push(...q.operations);effects.push(...apply(next,q.operations));}
 const phase=prepareNativeNameEntryAnimationPhase(next,sourceViews);operations.push(...phase.operations);effects.push(...apply(next,phase.operations));
 return freeze({...phase,state:next,operations,effects,diagnostic:{...phase.diagnostic,consumer:'801e1290..801e183c',initialized}});
}

/** Full1290 numeric update including all16 presentation transforms. Crossing
 * disturbances remain ordered effects for their separate water owner. */
export function prepareNativeNameEntryUpdate(state,sourceViews={}){
 const phase=prepareNativeNameEntryAnimationUpdate(state,sourceViews),next=copy(phase.state);
 const presentation=prepareNativeNameEntryPresentation(next,phase,sourceViews),effects=apply(next,presentation.operations);
 return freeze({state:next,operations:[...phase.operations,...presentation.operations],effects:[...phase.effects,...effects],matrices:presentation.matrices,
  diagnostic:{...phase.diagnostic,...presentation.diagnostic,consumer:'801e1290',initialized:phase.diagnostic.initialized}});
}

export function prepareNativeNameEntryRecordCommit(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeNameEntryRecordUpdate(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

export function prepareNativeResultsMenuInitializationUpdate(state){
 const next=copy(state),prepared=prepareNativeResultsMenuInitialization(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

function continuationResult(next,prepared,sourceViews,{expandInput=false,expandExit=false,expandFade=false}={}){
 const pending=[...prepared.operations],operations=[],effects=[];
 while(pending.length){
  const op=pending.shift();let expanded;
  if(op.kind==='externalCall'){
   if(expandInput&&op.consumer==='802c5f60')expanded=prepareNativeContinuationMenuInput(next).operations;
   else if(expandExit&&op.consumer==='802c5e5c')expanded=prepareNativeContinuationMenuExit(next,{returnState630:op.arguments[0]|0}).operations;
   else if(expandFade&&op.consumer==='801e6fb0'){
    const [type,rate,selector]=op.arguments;
    expanded=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,type:type|0,rate:rate|0,selector:selector|0}).operations;
   }else if(expandFade&&op.consumer==='801e6a4c')expanded=prepareNativeRaceFadeSlotsReset({slotTemplateWords6c50:sourceViews.slotTemplateWords6c50}).operations;
  }
  if(expanded){pending.unshift(...expanded);continue;}
  operations.push(op);effects.push(...apply(next,[op]));
 }
 return freeze({...prepared,state:next,operations,effects,diagnostic:{...prepared.diagnostic,inputExpanded:expandInput,exitExpanded:expandExit,fadeExpansionEnabled:expandFade}});
}

export function prepareNativeContinuationMenuInitializationUpdate(state){
 const next=copy(state);return continuationResult(next,prepareNativeContinuationMenuInitialization(next),{});
}
export function prepareNativeContinuationMenuExitUpdate(state,input,sourceViews={}){
 const next=copy(state);return continuationResult(next,prepareNativeContinuationMenuExit(next,input),sourceViews,{expandFade:true});
}
export function prepareNativeContinuationMenuInputUpdate(state,sourceViews={}, {expandExit=false}={}){
 if(typeof expandExit!=='boolean')throw new TypeError('expandExit must be boolean');
 const next=copy(state);return continuationResult(next,prepareNativeContinuationMenuInput(next),sourceViews,{expandExit,expandFade:expandExit});
}
export function prepareNativeContinuationMenuDisplayUpdate(state,sourceViews={}, {expandInput=false,expandExit=false}={}){
 if(typeof expandInput!=='boolean'||typeof expandExit!=='boolean'||expandExit&&!expandInput)throw new TypeError('Exit expansion requires input expansion');
 const next=copy(state);return continuationResult(next,prepareNativeContinuationMenuDisplay(next,sourceViews),sourceViews,{expandInput,expandExit,expandFade:expandExit});
}

/** Expand input and the numericC830 exit at their original call positions.
 * Menu graphics/resource/audio recipes retain explicit presentation effects. */
export function prepareNativeResultsMenuDisplayUpdate(state,sourceViews={}, {expandInput=false,expandExit=false}={}){
 if(typeof expandInput!=='boolean'||typeof expandExit!=='boolean'||expandExit&&!expandInput)throw new TypeError('Exit expansion requires input expansion');
 const next=copy(state),prepared=prepareNativeResultsMenuDisplay(next,sourceViews),operations=[],effects=[];
 for(const op of prepared.operations){
  const batch=expandInput&&op.kind==='externalCall'&&op.consumer==='802c6b34'?prepareNativeResultsMenuInput(next).operations:[op];
  for(const entry of batch){
   const expanded=expandExit&&entry.kind==='externalCall'&&entry.consumer==='801ec830'?prepareNativeRaceMenuInitializationUpdate(next,{consumer:entry.consumer},sourceViews).operations:[entry];
   operations.push(...expanded);effects.push(...apply(next,expanded));
  }
 }
 return freeze({...prepared,state:next,operations,effects,diagnostic:{...prepared.diagnostic,inputExpanded:expandInput,exitExpanded:expandExit}});
}

export function prepareNativeNameEntryDisplayUpdate(state,sourceViews={}, {expandInput=false,expandRecords=false}={}){
 if(typeof expandInput!=='boolean'||typeof expandRecords!=='boolean'||expandRecords&&!expandInput)throw new TypeError('Record expansion requires input expansion');
 const next=copy(state),prepared=prepareNativeNameEntryDisplay(next,sourceViews),operations=[],effects=[];
 for(const op of prepared.operations){
  const batch=expandInput&&op.kind==='externalCall'&&op.consumer==='801e2530'?prepareNativeNameEntryInput(next,sourceViews).operations:[op];
  for(const entry of batch){
   const expanded=expandRecords&&entry.kind==='externalCall'&&entry.consumer==='801e2c14'?prepareNativeNameEntryRecordUpdate(next,sourceViews).operations:[entry];
   operations.push(...expanded);effects.push(...apply(next,expanded));
  }
 }
 return freeze({...prepared,state:next,operations,effects,diagnostic:{...prepared.diagnostic,inputExpanded:expandInput,recordsExpanded:expandRecords}});
}

/** Original result-menu entry with numeric fades in the canonical HUD owner.
 * Resource descriptors expand only when explicitly requested with retained
 * resource owners and supplied tables. Transfers, rendering, audio playback,
 * subsequent menu loops and record persistence do not execute here.
 * Pending effects retain their call positions in operations; callers must not
 * treat this preparation as a complete menu bootstrap while effects remain.
 */
export function prepareNativeRaceMenuInitializationUpdate(state,input,sourceViews={}, {expandResourceInitializers=false}={}){
 if(typeof expandResourceInitializers!=='boolean')throw new TypeError('expandResourceInitializers must be boolean');
 const next=copy(state),prepared=prepareNativeRaceMenuInitialization(next,input),operations=[],effects=[],expandedConsumers=[];
 for(const operation of prepared.operations){
  let batch=[operation];
  if(operation.kind==='externalCall'){
   const {consumer,arguments:args}=operation;
   if(consumer==='80096960'&&expandResourceInitializers){
    batch=prepareNativeRaceRiderResourceConfiguration(next,{kind:args[0],avatarIndices:args.slice(1)},sourceViews).operations;
    expandedConsumers.push(consumer);
   }else if(consumer==='801e6fb0'){
    batch=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,
     type:args[0],rate:args[1],selector:args[2]}).operations;
    expandedConsumers.push(consumer);
   }else if(consumer==='801e6a4c'){
    batch=prepareNativeRaceFadeSlotsReset({slotTemplateWords6c50:sourceViews.slotTemplateWords6c50}).operations;
    expandedConsumers.push(consumer);
   }
  }
  operations.push(...batch);effects.push(...apply(next,batch));
 }
 return freeze({state:next,operations,effects,diagnostic:{sourceMenu:prepared.diagnostic,expandedConsumers,
  pendingConsumers:effects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),
  resourceLoadingPerformed:false,menuLoopExecuted:false,recordsPersisted:false}});
}

/** Direct9345C configuration and its two reached fade initializers, with one
 * canonical profile/HUD/scene owner. The source's resource96960/9684C writes,
 * physical body-tune writes and finalC21F4 audio entry remain ordered REQUIRED
 * pending effects by default. They must be resolved at their call positions before this
 * preparation can become a complete live main bootstrap. No callback runs or
 * resource descriptor is fabricated here. Earlier resource writes do not
 * overlap the later direct caller predicates/fade spans in this bounded path.
 *
 * sourceViews supplies the main leaf's readonly data and actual raw9/11-word
 * fade templates. The replaced fade entries never remain pending for replay.
 * Mode4 requires52 profile words; other branches retain50-word compatibility.
 * With explicit options.expandResourceInitializers=true, both resource
 * descriptor helpers expand into this same owner at their exact call positions.
 * All three retained resource spans and selected readonly table views must then
 * be supplied. Their replaced entries never remain pending for a second replay.
 * Later95050 resource loading, physical tunes and final audio remain separate.
 * Canonical players/racerCount remain bounded even when the standalone direct
 * leaf can describe wider signed-halfword transport. Invalid late input leaves
 * every supplied owner unchanged, including the profile's flag tail and RNG.
 */
export function prepareNativeRaceMainConfigurationUpdate(state,sourceViews={}, {expandResourceInitializers=false}={}){
 if(typeof expandResourceInitializers!=='boolean')throw new TypeError('expandResourceInitializers must be boolean');
 const next=copy(state),prepared=prepareNativeRaceMainConfiguration(next,sourceViews),operations=[],effects=[],expandedFadeConsumers=[],expandedResourceConsumers=[];
 for(const operation of prepared.operations){
  let batch=[operation];
  if(expandResourceInitializers&&operation.kind==='externalCall'&&operation.consumer==='80096960'){
   const [kind,...avatarIndices]=operation.arguments;
   batch=prepareNativeRaceRiderResourceConfiguration(next,{kind:kind|0,avatarIndices:avatarIndices.map(v=>v|0)},sourceViews).operations;
   expandedResourceConsumers.push(operation.consumer);
  }else if(expandResourceInitializers&&operation.kind==='externalCall'&&operation.consumer==='8009684c'){
   const [baseWord,...indices]=operation.arguments;
   batch=prepareNativeRaceCourseResourceConfiguration(next,{baseWord,resourceIndices:indices.map(v=>v|0)},sourceViews).operations;
   expandedResourceConsumers.push(operation.consumer);
  }else if(operation.kind==='externalCall'&&operation.consumer==='801e6fb0'){
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
 return freeze({state:next,operations,effects,diagnostic:{sourceMain:prepared.diagnostic,expandedFadeConsumers,expandedResourceConsumers,
  pendingResourceConsumers:['80096960','8009684c'].filter(v=>!expandedResourceConsumers.includes(v)),resourceLoadingPerformed:false,
  finalAudioPending:true,physicalInitialization:false}});
}

/** Numeric title/championship/rider/course return entry, with fades expanded in
 * source order into the same canonical HUD owner. Physical rider tunes,
 * resources and audio remain required effects. The original selection-menu
 * loops and rendering are separate; no target entry remains for replay.
 * Explicit expandResourceInitializers consumes96960/9684C at their source
 * positions, requiring actual retained owners and readonly views. Rider menu
 * kind3 needs the36-word descriptor owner; no missing state is synthesized. */
export function prepareNativeMenuReturnUpdate(state,destination,sourceViews={}, {expandResourceInitializers=false}={}){
 if(typeof expandResourceInitializers!=='boolean')throw new TypeError('expandResourceInitializers must be boolean');
 const prepare={course:prepareNativeCourseMenuReturn,rider:prepareNativeRiderMenuReturn,title:prepareNativeTitleMenuReturn,championship:prepareNativeChampionshipMenuReturn}[destination];
 if(typeof prepare!=='function'||!['course','rider','title','championship'].includes(destination))throw new RangeError('Unreconstructed menu return destination');
 const next=copy(state),prepared=prepare(next,sourceViews),operations=[],effects=[],expandedResourceConsumers=[];
 for(const op of prepared.operations){
  let batch=[op];
  if(expandResourceInitializers&&op.kind==='externalCall'&&op.consumer==='80096960'){
   const [kind,...ids]=op.arguments;
   batch=prepareNativeRaceRiderResourceConfiguration(next,{kind:kind|0,avatarIndices:ids.map(v=>v|0)},sourceViews).operations;expandedResourceConsumers.push(op.consumer);
  }else if(expandResourceInitializers&&op.kind==='externalCall'&&op.consumer==='8009684c'){
   const [baseWord,...ids]=op.arguments;
   batch=prepareNativeRaceCourseResourceConfiguration(next,{baseWord,resourceIndices:ids.map(v=>v|0)},sourceViews).operations;expandedResourceConsumers.push(op.consumer);
  }else if(op.kind==='externalCall'&&op.consumer==='801e6fb0'){
   const [type,rate,selector]=op.arguments;
   batch=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,type,rate,selector}).operations;
  }else if(op.kind==='externalCall'&&op.consumer==='801e6a4c'){
   batch=prepareNativeRaceFadeSlotsReset({slotTemplateWords6c50:sourceViews.slotTemplateWords6c50}).operations;
  }else if(op.kind==='externalCall'&&op.consumer==='8004a208'){
   batch=prepareNativeDeviceReset({connectedMask4340:sourceViews.connectedMask4340}).operations;
  }
  operations.push(...batch);effects.push(...apply(next,batch));
 }
 return freeze({state:next,operations,effects,diagnostic:{consumer:prepared.diagnostic.consumer,expandedFadeConsumers:['801e6fb0','801e6a4c'],expandedResourceConsumers,
  menuLoopExecuted:false,controllerResetExecuted:destination==='title',physicalInitialization:false,resourceLoadingPerformed:false,audioExecuted:false}});
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
/** Ordered result-entry expansion against the same canonical owners. Existing
 * status-only consumers retain their explicit pending-call contract. This
 * expanded entry requires the caller to schedule the following result stages;
 * it must not be run as an extra status call on an already advanced frame. */
export function prepareNativeRaceResultStatusUpdate(state,input={}){
 const next=copy(state),status=prepareNativeRacePrestartStatus(next),operations=[],effects=[];
 for(const op of status.operations){
  const expanded=op.kind==='externalCall'&&['802c6dcc','802c6fe0','802c7394'].includes(op.consumer)?
   prepareNativeRaceResultInitialization({...next,bodyResultCode16c8BySlot:input.bodyResultCode16c8BySlot,
    expandTransitions:input.expandTransitions,expandWidgets:input.expandWidgets,fadeTemplateWords6cc0:input.fadeTemplateWords6cc0,slotTemplateWords6c50:input.slotTemplateWords6c50},op.consumer).operations:[op];
  operations.push(...expanded);effects.push(...apply(next,expanded));
 }
 return freeze({state:next,operations,effects});
}
export function prepareNativeRaceResultStageUpdate(state,consumer,input={}){
 if(input.expandEstimates!==undefined&&typeof input.expandEstimates!=='boolean')throw new TypeError('expandEstimates must be boolean');
 const next=copy(state),prepared=prepareNativeRaceResultUpdate({...resultInputView(next),expandTransitions:input.expandTransitions,expandWidgets:input.expandWidgets,
  fadeTemplateWords6cc0:input.fadeTemplateWords6cc0,slotTemplateWords6c50:input.slotTemplateWords6c50},consumer),operations=[],effects=[];
 for(const op of prepared.operations){
  const expanded=input.expandEstimates&&op.kind==='externalCall'&&op.consumer==='80077f5c'?
   prepareNativePrimaryResultEstimates({...next,primaryRecordWordsBySourceRow:input.primaryRecordWordsBySourceRow,
    bodyPositionsNativeBySlot:input.bodyPositionsNativeBySlot}).operations:[op];
  operations.push(...expanded);effects.push(...apply(next,expanded));
 }
 return freeze({...prepared,operations,state:next,effects});
}
export function prepareNativeRaceResultCPUDisplayUpdate(state,input={}){
 if(input.expandMenus!==undefined&&typeof input.expandMenus!=='boolean')throw new TypeError('expandMenus must be boolean');
 const next=copy(state),prepared=prepareNativeRaceResultCPUDisplay({...resultInputView(next),
  expandTransitions:true,expandWidgets:true,fadeTemplateWords6cc0:input.fadeTemplateWords6cc0,
  slotTemplateWords6c50:input.slotTemplateWords6c50});
 const operations=[],effects=[],menus=[];
 for(const operation of prepared.operations){
  if(input.expandMenus&&operation.kind==='externalCall'&&['801ec20c','801ec830','801ec9c8','801ece50'].includes(operation.consumer)){
   // Apply at the original call position. In retirement63B4 the following
   // AD3C4 effect must stay after this entire menu initializer.
   const menu=prepareNativeRaceMenuInitializationUpdate(next,{consumer:operation.consumer},input);
   operations.push(...menu.operations);effects.push(...apply(next,menu.operations));
   menus.push({consumer:operation.consumer,gameState:menu.state.scene.gameStateAb24,main:menu.state.scene.main638,
    pendingConsumers:menu.diagnostic.pendingConsumers});
  }else{operations.push(operation);effects.push(...apply(next,[operation]));}
 }
 return freeze({operations,state:next,effects,menus});
}
/** One-shot result estimate against the same records used by the race and HUD.
 * No live phase is inferred; the caller must schedule actual77F5C invocation. */
export function prepareNativeRaceUnfinishedEstimates(state,input={}){
 const next=copy(state),prepared=prepareNativePrimaryResultEstimates({...next,
  primaryRecordWordsBySourceRow:input.primaryRecordWordsBySourceRow,bodyPositionsNativeBySlot:input.bodyPositionsNativeBySlot});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
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

/** Original display-stage camera inputs commit to the same HUD/camera words
 * used by water and direction consumers. No visual camera snapshot is written
 * back into these retained selection/auxiliary/blend fields. */
export function prepareNativeRaceCameraInputUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeRaceCameraInput({...input,players:sceneValue(next,'players'),hudWords7788:next.hudWords7788});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
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
 return prepareDisplayUpdate(state,input,false);
}

/** Source display dispatcher plus result entry/update and course0 sequence
 * against canonical storage. Invoke once AFTER the CPU world and fade update,
 * never as an extra render/interpolation call. Real supplied graphics-head
 * returns remain required; this does not fabricate original display memory.
 * Menu/reset/save/audio effects still require consumers. expandTransitions, expandWidgets,
 * expandEstimates and expandCameraInput retain their explicit branch-lazy
 * source dependencies. Camera input reads the supplied cameraInput sample. */
export function prepareNativeRaceResultDisplayUpdate(state,input={}){
 if(input.expandEstimates!==undefined&&typeof input.expandEstimates!=='boolean')throw new TypeError('expandEstimates must be boolean');
 if(input.expandCameraInput!==undefined&&typeof input.expandCameraInput!=='boolean')throw new TypeError('expandCameraInput must be boolean');
 return prepareDisplayUpdate(state,input,true);
}
function prepareDisplayUpdate(state,input,results){
 const next=copy(state),stage=results?prepareNativeRaceResultDisplay({...resultInputView(next),externalReturns:input.externalReturns,
  bodyResultCode16c8BySlot:input.bodyResultCode16c8BySlot,expandTransitions:input.expandTransitions,expandWidgets:input.expandWidgets,
  fadeTemplateWords6cc0:input.fadeTemplateWords6cc0,slotTemplateWords6c50:input.slotTemplateWords6c50}):
  prepareNativeRacePrestartStage({...next,externalReturns:input.externalReturns}),
  operations=[],effects=[],sequenceCalls=[];
 for(const op of stage.operations){
  if(op.kind==='externalCall'&&op.consumer==='802c6bd8'){
   const sequence=prepareNativeRaceCourseZeroSequenceDisplay(next);
   operations.push(...sequence.operations);effects.push(...apply(next,sequence.operations));
   sequenceCalls.push({sourceHead:op.arguments[0],sourceReturnWord:op.returnWord,diagnostic:sequence.diagnostic});
  }else if(results&&input.expandEstimates&&op.kind==='externalCall'&&op.consumer==='80077f5c'){
   const estimate=prepareNativePrimaryResultEstimates({...next,primaryRecordWordsBySourceRow:input.primaryRecordWordsBySourceRow,
    bodyPositionsNativeBySlot:input.bodyPositionsNativeBySlot});
   operations.push(...estimate.operations);effects.push(...apply(next,estimate.operations));
  }else if(results&&input.expandCameraInput&&op.kind==='externalCall'&&op.consumer==='801de3cc'){
   // This consumer writes only camera/auxiliary HUD fields, disjoint from
   //5DF4's later predicates. Commit them at the original pre-status call site.
   const cameraInput=prepareNativeRaceCameraInput({...input.cameraInput,players:sceneValue(next,'players'),hudWords7788:next.hudWords7788});
   operations.push(...cameraInput.operations);effects.push(...apply(next,cameraInput.operations));
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
 return consumeNativeRaceHudTail(next,input,currentPrimaryNodes(layout,input.primary),prefix,diagnostic);
}

/** Shared79528 presentation tail. Each consumer receives the preceding writes;
 * ordinary and Stunt mode use the same actual eight source routines. */
function consumeNativeRaceHudTail(next,input,primaryNodes,effectPrefix,diagnostic){
 const effects=[...effectPrefix],tailOperations=[];
 function consume(consumer,result){
  next=result.state;effects.push(...result.effects);tailOperations.push(...result.operations);
  diagnostic.consumers.push({consumer,diagnostic:result.diagnostic??null});
 }
 consume('overlayFc39c',prepareNativeRaceStatusPreludeUpdate(next));
 consume('overlayEf504',prepareNativeRaceDirectionWarningUpdate(next,{
  bodiesBySlot:input.bodiesBySlot,cameraIndicesByView:input.cameraIndicesByView,
  primaryNodesBySourceRow:primaryNodes,angleTableWords6f08:input.angleTableWords6f08,
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

/** Complete Stunt79528 numeric update through the shared HUD consumers.
 * bodiesBySlot is one completed physical sample: positionNative, prior body
 * point, classifier stuntMove1604 and retained stuntArc15ecNative. Every racer
 * scores against the PRIMARY body's arc, as the original does. Scratch layout,
 * full primary nodes and checkpoint refill bytes come from selected course
 * initialization. The later6E3A8 ring stage and display transfer are separate.
 * Profiling clocks, physics, object motion, rendering and persistence are not
 * advanced here. All preparation is atomic with respect to the supplied state.
 */
export function prepareNativeRaceStuntUpdate(state,input={}){
 let next=copy(state);const diagnostic={racers:[],records:null,consumers:[],conditionalStart:false},effects=[];
 if(!stuntModeActive(next))return freeze({state:next,applied:false,effects,tailOperations:[],diagnostic});
 record(input,'Stunt source update input');
 for(const key of ['camerasByIndex','genericObjects','genericObjectCountFa40'])
  if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const count=integer(sceneValue(next,'racerCount'),'racerCount',0,4),primary=sceneValue(next,'primaryHumanIndex');
 if(!Array.isArray(input.bodiesBySlot)||input.bodiesBySlot.length<count||input.bodiesBySlot.length>4)
  throw new RangeError('Supply actual completed Stunt bodiesBySlot');
 const bodies=input.bodiesBySlot.map(b=>{
  record(b,'completed Stunt body');const p=record(b.positionNative,'completed body position');
  return {...b,positionNativeXZ:{x:p.x,z:p.z}};
 });
 const nodes=currentPrimaryNodes({nodes:input.nodes},input);
 for(let slot=0;slot<count;slot++){
  const body=bodies[slot],out=prepareNativeRaceStuntRacerUpdate(next,{
   racerIndex:slot,primaryScratchLayout:input.primaryScratchLayout,nodes,nodePositionsNative:input.nodePositionsNative,
   bodyPositionNative:body.positionNative,alternatePositionNativeXZ:body.alternatePositionNativeXZ,
   priorBodyPointNativeXZ:body.priorBodyPointNative,speedB90Native:body.speedB90Native,
   move:body.stuntMove1604,primaryArcNative:bodies[primary]?.stuntArc15ecNative,
   checkpointSecondsByIndex:input.checkpointSecondsByIndex});
  next=out.state;effects.push(...out.effects);diagnostic.racers.push({racerIndex:slot,...out.diagnostic});
 }
 const records=prepareNativeRaceStuntRecords(next);next=records.state;diagnostic.records={applied:records.applied,...records.diagnostic};
 const objectCount=integer(sceneValue(next,'objectCountFa40'),'objectCountFa40',-2147483648,64);
 if(objectCount>0&&!next.objectWordsC940)throw new TypeError('Supply retained objectWordsC940 for Stunt direction warnings');
 const genericObjects=Array.from({length:Math.max(0,objectCount)},(_,i)=>{
  const base=i*49,kind=next.objectWordsC940[base+0x4c/4]|0;
  return {runtimeType4c:kind,...(kind===8?{centerNativeXZ:{x:readFloat(next.objectWordsC940[base]),z:readFloat(next.objectWordsC940[base+2])}}:{})};
 });
 return consumeNativeRaceHudTail(next,{...input,bodiesBySlot:bodies,genericObjectCountFa40:objectCount,genericObjects},nodes,effects,diagnostic);
}
