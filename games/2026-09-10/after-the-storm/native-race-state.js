import {prepareNativeChampionshipSelectionUpdate} from './native-championship-selection.js';
import {prepareNativeCourseResourceRelocation} from './native-course-resource-relocation.js';
import {prepareNativeRaceFadeUpdate} from './native-race-fade-update.js';
import {prepareNativeMenuInput,prepareNativeDeviceSample,prepareNativeDeviceReset} from './native-menu-input.js';
import {prepareNativeRaceResultCPUDisplay} from './native-race-prestart-stage.js';
import {prepareNativeChampionshipScore} from './native-championship-score.js';
import {prepareNativeChampionshipStandingsInitialization,prepareNativeChampionshipStandingsInput,prepareNativeChampionshipStandingsExit} from './native-championship-standings.js';
import {prepareNativeRaceWidgetUpdate,prepareNativeRaceHUDAnimationUpdate} from './native-race-widget-update.js';
import {NATIVE_AI_STORAGE_WORDS} from './native-ai-storage.js';
import {createNativeGraphicsCornerState,patchNativeGraphicsCornerState,advanceNativeGraphicsCornerState} from './native-graphics-corner-state.js';
import {prepareNativeRaceCameraInput} from './native-race-camera-input.js';
import {prepareNativeMenuCameraInitialization} from './native-menu-camera-initialization.js';
import {prepareNativeIntroductionCameraInitialization} from './native-introduction-camera-initialization.js';
import {prepareNativeIntroductionCameraScript} from './native-introduction-camera-script.js';
import {prepareNativeCameraAuxiliaryMotion} from './native-camera-auxiliary-motion.js';
import {prepareNativeIntroductionFlock} from './native-introduction-flock.js';
import {prepareNativeIntroductionCourseEffects} from './native-introduction-course-effects.js';
import {prepareNativeIntroductionActors,prepareNativeIntroductionActorInitialization,prepareNativeCourseActorInitialization,prepareNativePresentationActorBounds,prepareNativePresentationActorRetirement,NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {prepareNativeIntroductionCameraUpdate} from './native-introduction-camera-update.js';
import {prepareNativePresentationActorVisibility} from './native-presentation-actor-visibility.js';
import {prepareNativePresentationActorRootMatrix} from './native-presentation-actor-transform.js';
import {prepareNativePresentationWingAnimation} from './native-presentation-wing-animation.js';
import {prepareNativePresentationStaticActor} from './native-presentation-static-actor.js';
import {prepareNativePresentationArticulatedActor} from './native-presentation-articulated-actor.js';
import {prepareNativePresentationSpecialActor} from './native-presentation-special-actor.js';
import {prepareNativeSwimmingActorMotion} from './native-swimming-actor-motion.js';
import {prepareNativeCourseBirdMotion,prepareNativeCourseBirdAudio} from './native-course-bird-motion.js';
import {prepareNativePerchingBirdMotion} from './native-perching-bird-motion.js';
import {prepareNativeDolphinAudio} from './native-dolphin-audio.js';
import {prepareNativeDolphinActorMotion} from './native-dolphin-actor-motion.js';
import {prepareNativeIceActorAudio} from './native-ice-actor-audio.js';
import {prepareNativeIceActorMotion} from './native-ice-actor-motion.js';
import {prepareNativeSpecialCourseActorMotion} from './native-special-course-actor-motion.js';
import {prepareNativeFollowingActorMotion} from './native-following-actor-motion.js';
import {prepareNativeCourseActorFrame} from './native-course-actor-frame.js';
import {prepareNativePresentationLighting} from './native-presentation-lighting.js';
import {prepareNativePresentationActorDisplay} from './native-presentation-actor-display.js';
import {prepareNativePresentationEffectInputs,prepareNativeTransientEffects,NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
import {nativeEffectEngineMask} from './native-effect-body-view.js';
import {prepareNativePresentationEffectsInitialization} from './native-presentation-effects-initialization.js';
import {prepareNativeEffectGeometry} from './native-effect-geometry.js';
import {prepareNativeSprayUpdate} from './native-spray-update.js';
import {prepareNativePresentationEffectsFrame} from './native-presentation-effects-frame.js';
import {prepareNativeTransientDisplay} from './native-transient-display.js';
import {prepareNativePresentationEffectsDisplay} from './native-presentation-effects-display.js';
import {prepareNativeSceneGraphicsFrame,nativeSceneGraphicsBufferIndex} from './native-scene-graphics-frame.js';
import {prepareNativeBodyWrap} from './native-body-wrap.js';
import {prepareNativeMenuCameraUpdate} from './native-menu-camera-update.js';
import {prepareNativeSpecialWaterUpdate} from './native-special-water-update.js';
import {prepareNativeWaterSceneInitialization} from './native-water-scene-initialization.js';
import {prepareNativeCourseDisplayInitialization} from './native-course-display-initialization.js';
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
import {prepareNativeCourseMenuReturn,prepareNativeRiderMenuReturn,prepareNativeTitleMenuReturn,prepareNativeChampionshipMenuReturn,prepareNativeEndingCeremonyEntry} from './native-menu-return-initialization.js';
import {prepareNativeRaceMenuInitialization} from './native-race-menu-initialization.js';
import {prepareNativeNameEntryInitialization,prepareNativeNameEntryInput,prepareNativeNameEntryAnimationPhase,prepareNativeNameEntryRecordUpdate,prepareNativeNameEntryDisplay} from './native-name-entry.js';
import {prepareNativeNameEntryPresentation} from './native-name-presentation.js';
import {prepareNativeResultsMenuInitialization,prepareNativeResultsMenuInput,prepareNativeResultsMenuDisplay} from './native-results-menu.js';
import {prepareNativeStuntResultsMenuInitialization,prepareNativeStuntResultsMenuInput,prepareNativeStuntResultsMenuDisplay} from './native-stunt-results-menu.js';
import {prepareNativeContinuationMenuInitialization,prepareNativeContinuationMenuInput,prepareNativeContinuationMenuExit,prepareNativeContinuationMenuDisplay} from './native-continuation-menu.js';
import {prepareNativeEndingMenuInitialization,prepareNativeEndingPanelEnqueue,prepareNativeEndingMenuInput,prepareNativeEndingMenuScroll,prepareNativeEndingMenuDisplay,prepareNativeEndingMenuPostDisplay} from './native-ending-menu.js';
import {prepareNativeRecordsBrowserInput,prepareNativeRecordsBrowserUpdate,prepareNativeRecordsBrowserPostDisplay} from './native-records-browser.js';
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
import {prepareNativeObjectLoading} from './native-object-loading.js';
import {prepareNativeObjectMotion} from './native-object-motion.js';
import {prepareNativeObjectUpdate} from './native-object-update.js';
import {prepareNativeGenericObjectContacts} from './native-generic-spheres.js';
import {queryNativeWaterField} from './native-water-field.js';
import {prepareNativeFixedSphereLoading,prepareNativeFixedSphereInitialization} from './native-fixed-sphere-startup.js';
import {prepareNativeFixedSphereUpdate} from './native-fixed-sphere-update.js';
import {prepareNativeFixedSphereContacts} from './native-fixed-sphere-contacts.js';
import {prepareNativeBoxContacts} from './native-static-contacts.js';
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
const sceneRanges={fieldE5134:[0,255],fieldAb0c:[-32768,32767],championshipCountAa00:[-32768,32767],primaryHumanIndex:[0,3],secondaryHumanIndex:[0,3],players:[1,2],courseIndex:[0,11],
 racerCount:[0,4],primaryCount:[0,64],secondaryCount:[0,64],finishSourceRow:[0,63],activity624:[-32768,32767],event628:[-32768,32767],
 pendingPlayers60c:[-32768,32767],participantCount60e:[-32768,32767],result6f0:[-32768,32767],field62a:[-32768,32767],specialAb64:[-32768,32767],ready6fc:[-32768,32767],field4964:[0,65535],
 reverseDab68:[0,65535],missesEnabled72e:[0,65535],seed6f00:[0,65535],rngState4640:[0,0xffffffff],inputTick1960:[0,0xffffffff],style6e28:[0,65535],
 field4970:[0,65535],field72c:[0,65535],fieldA9ac:[0,65535],pressed65a:[0,65535],unlockAb60:[-32768,32767],freshNameAb6c:[-32768,32767],variant6f4:[-32768,32767],variant6f6:[-32768,32767]};
const sceneWords=new Set(['secondaryCount','field3938','fixedSphereCountC938','forceStunt824c','rampFilterOverride8254','collisionPlaneCount0578','alternate8250','ringNext0cb0','ringStreak0cb4','objectCountFa40','ringCountB134','titlePairSelectionA9fc','fieldAa08','fortressCourse3a10','cold8224','clockStopped817c','phase650','simulation648','main638','mode620','state600',
 'missLimit8174','noFinish8178','configuredLaps728','difficulty','directionFlag1f90','ambientD4b00','fortressD8240',
 'metadataD9b0','metadataCb32c','restart6f8','initLatch63c','gameStateAb24','mode608','returnState630','forceFirst8228','demoOffset5438','rngState4640','inputTick1960','style6e2c',
 'previousGameState634','field640','field644','fieldAb1c','fieldAb2c','field461c','field700','field704','field708','field70c','field710','field714','resultEffect393c','wave610','missLimit614','lapCount618','field61c','wave49b0','field64c','players','racerCount','toggleD9914','previousNavigationD9874','trainingSelectionDa9f8',
 'riderSelectionA9c0','secondRiderSelectionA9c4','riderFlagA9c8','secondRiderFlagA9cc','courseSelectionA9d0','courseIndex','displayCamera3930','displayCamera3934','aiContextPointer3c58','actorDisplayPhase62c0','matrixCountE950',
 'graphicsFrame4b04','graphicsLatch4b08','graphicsSelector4b0c','graphicsPointerE948','graphicsPointerE94c','audioScene7c9c']);
const sceneHalves=new Set(['fieldAb0c','championshipCountAa00','activity624','event628','field62a','pendingPlayers60c','participantCount60e','result6f0','specialAb64','ready6fc','reverseDab68','missesEnabled72e','seed6f00','field4964','style6e28',
 'field4970','field72c','fieldA9ac','pressed65a','unlockAb60','freshNameAb6c','variant6f4','variant6f6']);
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
// Every canonical copy validates each owned word; keep these loops tight.
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 // A fresh packed array, not a slice of a frozen one: V8 keeps it unboxed.
 const r=[];for(let i=0;i<count;i++){const x=v[i];if(!Number.isInteger(x)||x<0||x>0xffffffff)throw new RangeError(`Invalid ${n}`);r.push(x||0);}return r;}
// Large presentation owners are copy-on-write: a frozen array this module
// already validated is shared by later copies, and only apply() writes take
// a private copy first. Every other owner is still copied and validated.
const sharedWords=new WeakSet();
function shared(v,n,count){if(sharedWords.has(v)&&Object.isFrozen(v)&&v.length===count)return v;const r=words(v,n,count);sharedWords.add(r);return r;}
function own(s,key){const v=s[key];if(!Object.isFrozen(v))return v;const r=[];for(let i=0;i<v.length;i++)r.push(v[i]);sharedWords.add(r);return s[key]=r;}
function freeze(v){
 if(v&&typeof v==='object'&&!Object.isFrozen(v)){
  if(Array.isArray(v)){for(let i=0;i<v.length;i++){const x=v[i];if(x&&typeof x==='object')freeze(x);}}else for(const x of Object.values(v))freeze(x);
  Object.freeze(v);
 }
 return v;
}
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
 if(value.fixedSphereWordsB138!==undefined)s.fixedSphereWordsB138=words(value.fixedSphereWordsB138,'fixedSphereWordsB138',1536);
 if(value.fixedSphereGridWords1ce8!==undefined)s.fixedSphereGridWords1ce8=words(value.fixedSphereGridWords1ce8,'fixedSphereGridWords1ce8',166);
 if(value.collisionPlaneWordsFd78!==undefined)s.collisionPlaneWordsFd78=words(value.collisionPlaneWordsFd78,'collisionPlaneWordsFd78',512);
 if(value.packedObjectMatrixWords0cd0!==undefined)s.packedObjectMatrixWords0cd0=words(value.packedObjectMatrixWords0cd0,'packedObjectMatrixWords0cd0',1024);
 if(value.aiWords3c60!==undefined)s.aiWords3c60=words(value.aiWords3c60,'aiWords3c60',NATIVE_AI_STORAGE_WORDS);
 if(value.graphicsCorners!==undefined)s.graphicsCorners=structuredClone(createNativeGraphicsCornerState(value.graphicsCorners));
 if(value.saveWordsB280!==undefined)s.saveWordsB280=words(value.saveWordsB280,'saveWordsB280',34);
 if(value.menuWordsE658!==undefined){
  if(Object.hasOwn(scene,'pressed65a'))throw new RangeError('pressed65a overlaps menuWordsE658');
  s.menuWordsE658=words(value.menuWordsE658,'menuWordsE658',21);
 }
 if(value.deviceWords4308!==undefined)s.deviceWords4308=words(value.deviceWords4308,'deviceWords4308',10);
 if(value.nameEntryWords61c4!==undefined)s.nameEntryWords61c4=words(value.nameEntryWords61c4,'nameEntryWords61c4',14);
 if(value.resultsMenuWords6d30!==undefined)s.resultsMenuWords6d30=words(value.resultsMenuWords6d30,'resultsMenuWords6d30',4);
 if(value.stuntResultsMenuWords5d80!==undefined)s.stuntResultsMenuWords5d80=words(value.stuntResultsMenuWords5d80,'stuntResultsMenuWords5d80',4);
 if(value.continuationMenuWords61e0!==undefined)s.continuationMenuWords61e0=words(value.continuationMenuWords61e0,'continuationMenuWords61e0',4);
 if(value.endingMenuWords6d50!==undefined)s.endingMenuWords6d50=words(value.endingMenuWords6d50,'endingMenuWords6d50',126);
 if(value.recordsBrowserWords80c0!==undefined)s.recordsBrowserWords80c0=words(value.recordsBrowserWords80c0,'recordsBrowserWords80c0',62);
 for(const key of ['roundOrderE718','racerOrderA9dc'])if(value[key]!==undefined)s[key]=words(value[key],key,4);
 if(value.championshipIntroPanelWords6f64!==undefined)s.championshipIntroPanelWords6f64=words(value.championshipIntroPanelWords6f64,'championshipIntroPanelWords6f64',8);
 if(value.championshipSelectionWords6f84!==undefined)s.championshipSelectionWords6f84=words(value.championshipSelectionWords6f84,'championshipSelectionWords6f84',43);
 if(value.championshipMenuWords7a00!==undefined)s.championshipMenuWords7a00=words(value.championshipMenuWords7a00,'championshipMenuWords7a00',68);
 if(value.courseDisplayWordsB058!==undefined)s.courseDisplayWordsB058=words(value.courseDisplayWordsB058,'courseDisplayWordsB058',136);
 if(value.courseLightWords4160!==undefined)s.courseLightWords4160=words(value.courseLightWords4160,'courseLightWords4160',3);
 if(value.menuWaterMotionWords47c4!==undefined)s.menuWaterMotionWords47c4=words(value.menuWaterMotionWords47c4,'menuWaterMotionWords47c4',4);
 if(value.actorWordsF060!==undefined)s.actorWordsF060=shared(value.actorWordsF060,'actorWordsF060',NATIVE_PRESENTATION_ACTOR_WORDS);
 if(value.actorControlWords62c4!==undefined)s.actorControlWords62c4=words(value.actorControlWords62c4,'actorControlWords62c4',3);
 if(value.actorControlWords62d0!==undefined)s.actorControlWords62d0=words(value.actorControlWords62d0,'actorControlWords62d0',2);
 if(value.effectWords0790!==undefined)s.effectWords0790=shared(value.effectWords0790,'effectWords0790',NATIVE_PRESENTATION_EFFECT_WORDS);
 if(value.effectControlWords6d60!==undefined)s.effectControlWords6d60=words(value.effectControlWords6d60,'effectControlWords6d60',22);
 if(value.cameraEnvironmentBytesEaa4!==undefined){
  if(!Array.isArray(value.cameraEnvironmentBytesEaa4)||value.cameraEnvironmentBytesEaa4.length!==2)throw new RangeError('Supply cameraEnvironmentBytesEaa4[2]');
  s.cameraEnvironmentBytesEaa4=value.cameraEnvironmentBytesEaa4.map(v=>integer(v,'camera environment byte',0,255));
 }
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
 * Optional fixedSphereWordsB138[1536] owns256 six-word fixed-sphere records at
 * 801BB138..C938; its count stays in scene. fixedSphereGridWords1ce8[166] owns
 * the six bounds,512 list bytes,16 starts and16 counts at801C1CE8..1F80.
 * Optional nameEntryWords61c4[14] owns shared name-menu scratch802261C4..61FC;
 * it does not overlap the HUD wheel/name bytes or the i1 overlay. field700 is
 * signed32 transport of four retained name bytes; freshNameAb6c is signed16.
 * Optional resultsMenuWords6d30[4] owns normal-results overlay phase, two
 * signed sliding offsets and delay at802C6D30..6D40, exclusive. It is separate
 * from the race overlay and reads the combined menu record's pressedE692.
 * Optional stuntResultsMenuWords5d80[4] owns Stunt-results phase, delay and
 * two signed sliding offsets at802C5D80..5D90, exclusive. It reads player1.
 * Optional continuationMenuWords61e0[4] owns ovl_i14 phase/offsets/count BSS.
 * Optional endingMenuWords6d50[126] owns ovl_i15 loaded control tables and BSS,
 * ending at6F48, including ten four-word panel rows and course/rank selectors.
 * continuationDataWords60f0[20] retains its loaded selection, numeric choice
 * tables and audio-once latch through6140, exclusive. Intervening untouched
 * descriptor words are opaque; original graphics assets are not implied.
 * Optional profileWordsB330[50 or52] owns B330..B3F8 or B330..B400 exclusive.
 * The extended view includes the four adjacent B3F8..B3FE rider halfwords;
 * no second flag owner is accepted. Older bounded leaves retain50-word input.
 * When supplied, difficulty comes from itsB338 word, never scene.difficulty.
 * Optional roundOrderE718[4] and racerOrderA9dc[4] own the independent round
 * and cumulative slot-order arrays at801CE718 and800DA9DC. They store racer
 * slots, not avatar IDs. Championship94ACC rebuilds both and writes each
 * cumulative rank into its existing race-record2C70 word.
 * championshipMenuWords7a00[68] retains ovl_i5 802C7A00..7B10, exclusive,
 * including its loaded last-round table and outcome/slide controls. Opaque
 * presentation words remain retained data, not an executed graphics pipeline.
 * Optional effectWords0790 owns scene effects801D0790..801D7B6C, exclusive,
 * including four1C74-byte rider-effect entries and shared wake/spray scratch.
 * It is adjacent to actorWordsF060, distinct from the overlay menu at802C7A00.
 * Retained allocation and particle history are not inferred from audio levels.
 * effectControlWords6d60[22] owns800E6D60..6DB8, exclusive, including retained
 * pointers, selected colors, the course palette and initialization latch. It
 * does not overlap802C6D50 ending-menu storage despite similar low addresses.
 * championshipSelectionWords6f84[43] retains the separate ovl_i3 introduction
 * owner6F84..7030, including first-round data and its stage/timer controls.
 * Supply loaded/retained words explicitly; this is not standings7A00 storage.
 * championshipIntroPanelWords6f64[8] owns its adjacent panel phase, timers,
 * opacities and diagram flag through6F84, exclusive. field3938 retains the
 * independent codeseg display-enable word, initialized only in fresh memory.
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

/** Detached original course-introduction numeric update; resources/GPU remain effects. */
export function prepareNativeChampionshipSelectionFrameUpdate(state,sourceViews={}){
 const current=createNativeRaceState(state),q=prepareNativeChampionshipSelectionUpdate(current,sourceViews);
 return freeze({...prepareNativeRaceStateOperations(current,q.operations),operations:q.operations,diagnostic:q.diagnostic});
}

/** Apply94ACC to the actual profile/racer/order owners. The standings entry
 * latch must schedule it once; renderers must use read-only views afterward. */
export function prepareNativeChampionshipScoreUpdate(state){
 const next=copy(state),prepared=prepareNativeChampionshipScore(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeChampionshipStandingsInitializationUpdate(state){
 const next=copy(state),prepared=prepareNativeChampionshipStandingsInitialization(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
function championshipStandingsControlResult(next,prepared,sourceViews,expandExit){
 const operations=[],effects=[],pending=[...prepared.operations];
 while(pending.length){
  const op=pending.shift();let batch=[op];
  if(expandExit&&op.kind==='externalCall'&&op.consumer==='802c6f84'){
   pending.unshift(...prepareNativeChampionshipStandingsExit(next,op.arguments[0]|0).operations);continue;
  }
  if(expandExit&&op.kind==='externalCall'&&op.consumer==='801e6fb0'){
   const [type,rate,selector]=op.arguments;
   batch=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,type,rate,selector}).operations;
  }
  operations.push(...batch);effects.push(...apply(next,batch));
 }
 return freeze({...prepared,state:next,operations,effects});
}
export function prepareNativeChampionshipStandingsInputUpdate(state,sourceViews={}, {expandExit=false}={}){
 if(typeof expandExit!=='boolean')throw new TypeError('expandExit must be boolean');
 const next=copy(state);return championshipStandingsControlResult(next,prepareNativeChampionshipStandingsInput(next),sourceViews,expandExit);
}
export function prepareNativeChampionshipStandingsExitUpdate(state,destination,sourceViews={}){
 const next=copy(state);return championshipStandingsControlResult(next,prepareNativeChampionshipStandingsExit(next,destination),sourceViews,true);
}

/** Selected71E70 fixed-sphere rows use one retained sphere span. The enclosing
 * loader supplies already selected rows and canonical reset/prefix counts. */
export function prepareNativeRaceFixedSphereLoading(state,input={}){
 const next=copy(state);record(input,'selected fixed sphere rows');
 const keys=['fixedSphereCountC938','objectCountFa40','courseIndex','difficulty','main638','reverseDab68','alternate8250','rampFilterOverride8254'];
 for(const key of ['fixedSphereWordsB138',...keys])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const loaded=prepareNativeFixedSphereLoading({...input,fixedSphereWordsB138:next.fixedSphereWordsB138,...Object.fromEntries(keys.map(k=>[k,sceneValue(next,k)]))});
 next.fixedSphereWordsB138=loaded.fixedSphereWordsB138;next.scene.fixedSphereCountC938=loaded.fixedSphereCountC938;next.scene.objectCountFa40=loaded.objectCountFa40;
 return freeze({state:next,effects:[],diagnostic:loaded.diagnostic});
}

/** Original73E6C prepares fields and the shared fixed-sphere grid in place. */
export function prepareNativeRaceFixedSphereInitialization(state){
 const next=copy(state),initialized=prepareNativeFixedSphereInitialization({fixedSphereWordsB138:next.fixedSphereWordsB138,
  fixedSphereGridWords1ce8:next.fixedSphereGridWords1ce8,fixedSphereCountC938:sceneValue(next,'fixedSphereCountC938')});
 Object.assign(next,initialized);return freeze({state:next,effects:[]});
}

/** Reached generic-row subsection of71E70. The earlier loader owns table
 * selection and count resets; this consumes those actual counts and selected
 * rows, preserving any prior object prefix and all untouched words. */
export function prepareNativeRaceObjectLoading(state,input={}){
 const next=copy(state);record(input,'selected generic object rows');
 const keys=['objectCountFa40','ringCountB134','difficulty','mode620','players','rampFilterOverride8254','forceStunt824c'];
 for(const key of ['objectWordsC940',...keys])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const loaded=prepareNativeObjectLoading({...input,objectWordsC940:next.objectWordsC940,...Object.fromEntries(keys.map(k=>[k,sceneValue(next,k)]))});
 next.objectWordsC940=loaded.objectWordsC940;next.scene.objectCountFa40=loaded.objectCountFa40;next.scene.ringCountB134=loaded.ringCountB134;
 return freeze({state:next,effects:[],diagnostic:loaded.diagnostic});
}

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

/** Generic half of7DBC0, once after primary motion. The source activity gate
 * is independent of simulation648; rings/fixed objects remain in this owner
 * but move only if their actual motion58 word is4. Water is the shared field. */
export function prepareNativeRaceObjectMotionUpdate(state,input={}){
 const next=copy(state);record(input,'object motion resources');
 for(const key of ['objectWordsC940','objectCountFa40','activity624'])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 if(sceneValue(next,'activity624')!==-1)return freeze({state:next,applied:false,effects:[],diagnostic:{queries:[]}});
 const prepared=prepareNativeObjectMotion({objectWordsC940:next.objectWordsC940,objectCountFa40:sceneValue(next,'objectCountFa40'),
  queryNative:(x,z)=>queryNativeWaterField(input.waterField,x,z).sourcePlaneQueryNative});
 next.objectWordsC940=prepared.objectWordsC940;
 return freeze({state:next,applied:true,effects:[],diagnostic:prepared.diagnostic});
}

/** Source6E3F4..6E468, with the enclosing activity gate. Datum2458 is supplied
 * by the water field owner, separate from the race span's unrelated2458 word.
 * No fixed-sphere storage is read outside Southern or during inactive frames. */
export function prepareNativeRaceFixedSphereUpdate(state,input={}){
 const next=copy(state);record(input,'fixed sphere water datum');
 for(const key of ['fixedSphereWordsB138','fixedSphereCountC938','courseIndex','activity624'])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 if(sceneValue(next,'activity624')!==-1||sceneValue(next,'courseIndex')!==7)return freeze({state:next,applied:false,effects:[],diagnostic:{updatedRows:[]}});
 const count=sceneValue(next,'fixedSphereCountC938');
 if(count<=0)return freeze({state:next,applied:false,effects:[],diagnostic:{updatedRows:[]}});
 const prepared=prepareNativeFixedSphereUpdate({...input,fixedSphereWordsB138:next.fixedSphereWordsB138,fixedSphereCountC938:count,courseIndex:7});
 next.fixedSphereWordsB138=prepared.fixedSphereWordsB138;
 return freeze({state:next,applied:true,effects:[],diagnostic:prepared.diagnostic});
}

/** Source6E0F4 after object motion and fixed-sphere tide writes. Fortress1FC8
 * comes from raceWords, not a parallel scene flag. Only float matrices and
 * collision origins change; draw-time packed matrices are a later stage. */
export function prepareNativeRaceObjectUpdate(state,input={}){
 const next=copy(state);record(input,'object update resources');
 for(const key of ['objectWordsC940','collisionPlaneWordsFd78','objectCountFa40','fortressFlag1fc8','activity624'])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 if(sceneValue(next,'activity624')!==-1)return freeze({state:next,applied:false,effects:[],diagnostic:{hiddenIceRows:[],matrixRows:[],planeOrigins:[]}});
 const prepared=prepareNativeObjectUpdate({...input,objectWordsC940:next.objectWordsC940,collisionPlaneWordsFd78:next.collisionPlaneWordsFd78,
  objectCountFa40:sceneValue(next,'objectCountFa40'),fortressFlag1fc8:next.raceWords1f94[ri(0x1fc8)]|0});
 next.objectWordsC940=prepared.objectWordsC940;next.collisionPlaneWordsFd78=prepared.collisionPlaneWordsFd78;
 return freeze({state:next,applied:true,effects:[],diagnostic:prepared.diagnostic});
}

/** Full7F700 reads the latest canonical collision rows, including origins
 * changed by6E0F4. Decoded rows are temporary; contact never writes geometry.
 * The returned body holds the prepared physical point/impact state separately
 * from the canonical race owner. This reached phase has no activity gate. */
export function prepareNativeRaceObjectPlaneContacts(state,input={}){
 const next=copy(state);record(input,'object plane contact body');
 for(const key of ['collisionPlaneWordsFd78','collisionPlaneCount0578','boxes'])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const count=integer(sceneValue(next,'collisionPlaneCount0578'),'collisionPlaneCount0578',0,32);
 if(count>0&&!next.collisionPlaneWordsFd78)throw new TypeError('Supply retained collisionPlaneWordsFd78');
 const rows=Array.from({length:count},(_,i)=>next.collisionPlaneWordsFd78.slice(i*16,(i+1)*16).map(readFloat));
 const prepared=prepareNativeBoxContacts(input,{count0578:count,rows});
 return freeze({state:next,body:prepared.state,contacts:prepared.contacts,effects:[]});
}

/** Full7EF80 fixed-sphere phase. The original query owns candidate selection;
 * the body owns cached probes and C3C. No activity gate or sphere-count filter
 * is inserted here, and neither fixed storage nor its grid is modified. */
export function prepareNativeRaceFixedSphereContacts(state,input={}){
 const next=copy(state);record(input,'fixed contact body');
 for(const key of ['fixedSphereWordsB138','fixedSphereGridWords1ce8'])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const result=prepareNativeFixedSphereContacts({...input,fixedSphereWordsB138:next.fixedSphereWordsB138,fixedSphereGridWords1ce8:next.fixedSphereGridWords1ce8});
 return freeze({...result,state:next,effects:[]});
}

/** Source65C18 boundary stage shares actual HUD cameras with the race owner.
 * The physical host must commit returned bodyWords with state. Body writes
 * remain validated effects; they never create another canonical body copy.
 */
export function prepareNativeRaceBodyWrap(state,input={}){
 const next=copy(state),prepared=prepareNativeBodyWrap({...input,hudWords7788:next.hudWords7788,
  players:sceneValue(next,'players'),primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:next.scene.secondaryHumanIndex,
  displayCamera3930:next.scene.displayCamera3930,displayCamera3934:next.scene.displayCamera3934});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Reached7E938 front/rear probe calls. Body/impact are prepared views of the
 * current physical rider; object contacts commit to the same owner used by
 * loading, initialization, rings and motion. Fragment events remain an ordered
 * caller boundary. No world activity gate is inferred inside a hull phase. */
export function prepareNativeRaceGenericObjectContacts(state,input={}){
 const next=copy(state);record(input,'generic contact body');
 for(const key of ['objectWordsC940','objectCountFa40'])if(Object.hasOwn(input,key))throw new RangeError(`${key} overlaps canonical native state`);
 const prepared=prepareNativeGenericObjectContacts({...input,objectWordsC940:next.objectWordsC940,objectCountFa40:sceneValue(next,'objectCountFa40')});
 next.objectWordsC940=prepared.objectWordsC940;
 const {objectWordsC940,...result}=prepared;return freeze({...result,state:next,effects:[]});
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
  else if(op.kind==='saveWordWrite'){
   if(!s.saveWordsB280)throw new TypeError('Supply retained saveWordsB280 before applying its writes');
   if(op.width!==4)throw new RangeError('Invalid save word width');
   const offset=integer(op.byteOffset,'save word offset',0,132);if(offset%4)throw new RangeError('Invalid save word alignment');
   s.saveWordsB280[offset/4]=integer(op.value,'save word bits',0,0xffffffff);
  }
  else if(op.kind==='raceByteWrite'||op.kind==='saveByteWrite'){
   const key=op.kind==='raceByteWrite'?'raceWords1f94':'saveWordsB280';
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   if(op.width!==1)throw new RangeError('Invalid source byte patch width');
   const offset=integer(op.byteOffset,`${key} byte offset`,0,s[key].length*4-1),shift=24-(offset&3)*8;
   const value=integer(op.value,'source byte bits',0,255),index=offset>>>2;
   s[key][index]=((s[key][index]&~(255<<shift))|(value<<shift))>>>0;
  }
  else if(op.kind==='graphicsCornerPatch'||op.kind==='graphicsBufferAdvance'){
   if(!s.graphicsCorners)throw new TypeError('Supply retained graphicsCorners before applying graphics writes');
   s.graphicsCorners=op.kind==='graphicsCornerPatch'?patchNativeGraphicsCornerState(s.graphicsCorners,op.patches):advanceNativeGraphicsCornerState(s.graphicsCorners);
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
  }else if(op.kind==='sourceByteWrite'){
   //800E5134 is outside the retained race/HUD/profile spans. It is a byte,
   // not an alias of a neighboring word or another overlay's loaded data.
   if(op.field!=='fieldE5134')throw new RangeError(`Unsupported external source byte ${op.field}`);
   s.scene[op.field]=integer(op.value,'source byte bits',0,255);
  }else if(op.kind==='sourceHalfwordWrite'){
   if(!sceneHalves.has(op.field))throw new RangeError(`Unsupported external source halfword ${op.field}`);
   const bits=integer(op.value,'source halfword bits',0,65535);
   if(op.field==='pressed65a'&&s.menuWordsE658!==undefined)s.menuWordsE658[0]=((s.menuWordsE658[0]&0xffff0000)|bits)>>>0;
   else s.scene[op.field]=sceneRanges[op.field][0]<0?bits<<16>>16:bits;
  }else if(op.kind==='i1Write'||op.kind==='profileWrite'||op.kind==='nameEntryWrite'||op.kind==='resultsMenuWrite'||op.kind==='stuntResultsMenuWrite'||op.kind==='continuationMenuWrite'||op.kind==='continuationDataWrite'||op.kind==='endingMenuWrite'||op.kind==='recordsBrowserWrite'){
   const key=op.kind==='i1Write'?'i1Words9440':op.kind==='nameEntryWrite'?'nameEntryWords61c4':op.kind==='resultsMenuWrite'?'resultsMenuWords6d30':op.kind==='stuntResultsMenuWrite'?'stuntResultsMenuWords5d80':
    op.kind==='continuationMenuWrite'?'continuationMenuWords61e0':op.kind==='continuationDataWrite'?'continuationDataWords60f0':op.kind==='endingMenuWrite'?'endingMenuWords6d50':op.kind==='recordsBrowserWrite'?'recordsBrowserWords80c0':'profileWordsB330';
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying its writes`);
   const width=op.width,count=s[key].length;
   if(width!==4&&(!['profileWrite','nameEntryWrite'].includes(op.kind)||width!==2))throw new RangeError(`Invalid ${key} patch width`);
   const offset=integer(op.byteOffset,`${key} byteOffset`,0,count*4-width);
   if(offset%width)throw new RangeError(`Invalid ${key} word alignment`);
   const value=integer(op.value,`${key} bits`,0,width===2?65535:0xffffffff),index=offset>>>2;
   if(width===4)s[key][index]=value;
   else{const shift=offset&2?0:16;s[key][index]=((s[key][index]&~(65535<<shift))|(value<<shift))>>>0;}
  }else if(op.kind==='bodyWordWrite'){
   integer(op.racerIndex,'physical body racerIndex',0,3);
   const at=integer(op.byteOffset,'physical body offset',0,0x1718-4);
   if(op.width!==4||at%4)throw new RangeError('Invalid physical body word alignment');
   integer(op.value,'physical body bits',0,0xffffffff);effects.push(structuredClone(op));
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
  }else if(op.kind==='championshipIntroPanelWrite'){
   const key='championshipIntroPanelWords6f64';if(!s[key])throw new TypeError('Supply retained championshipIntroPanelWords6f64 before its writes');
   if(op.width!==4)throw new RangeError('Invalid championship panel width');
   const offset=integer(op.byteOffset,'championship panel offset',0,28);if(offset%4)throw new RangeError('Unaligned championship panel write');
   s[key][offset>>>2]=integer(op.value,'championship panel bits',0,0xffffffff);
  }else if(op.kind==='championshipSelectionWrite'){
   const key='championshipSelectionWords6f84';if(!s[key])throw new TypeError('Supply retained championshipSelectionWords6f84 before its writes');
   if(op.width!==4)throw new RangeError('Invalid championship introduction width');
   const offset=integer(op.byteOffset,'championship introduction offset',0,168);if(offset%4)throw new RangeError('Unaligned championship introduction write');
   s[key][offset>>>2]=integer(op.value,'championship introduction bits',0,0xffffffff);
  }else if(op.kind==='championshipMenuWrite'){
   const key='championshipMenuWords7a00';if(!s[key])throw new TypeError('Supply retained championshipMenuWords7a00 before its writes');
   const width=integer(op.width,'championship menu width',2,4);if(width!==2&&width!==4)throw new RangeError('Invalid championship menu width');
   const offset=integer(op.byteOffset,'championship menu offset',0,272-width);if(offset%width)throw new RangeError('Unaligned championship menu write');
   const bits=integer(op.value,'championship menu bits',0,width===2?65535:0xffffffff),index=offset>>>2;
   if(width===4)s[key][index]=bits;else{const shift=offset&2?0:16;s[key][index]=((s[key][index]&~(65535<<shift))|(bits<<shift))>>>0;}
  }else if(op.kind==='championshipOrderWrite'){
   const key=op.owner;if(!['roundOrderE718','racerOrderA9dc'].includes(key)||!s[key])throw new TypeError('Supply the selected championship order owner');
   const index=integer(op.wordIndex,'championship order index',0,3);s[key][index]=integer(op.value,'championship order slot',0,3);
  }else if(op.kind==='presentationBufferWrite'){
   integer(op.bufferIndex,'presentation bufferIndex',0,1);integer(op.byteOffset,'presentation byteOffset',0,252);
   if(op.width!==4||op.byteOffset%4)throw new RangeError('Invalid presentation buffer word');
   integer(op.value,'presentation word bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='presentationWordWrite'){
   integer(op.address,'presentation address',0,0xffffffff);
   if(op.width!==4||op.address%4)throw new RangeError('Invalid presentation memory word');
   integer(op.value,'presentation word bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='courseDisplayWrite'||op.kind==='courseLightWrite'){
   const key=op.kind==='courseDisplayWrite'?'courseDisplayWordsB058':'courseLightWords4160',count=op.kind==='courseDisplayWrite'?136:3;
   if(!s[key])throw new TypeError(`Supply retained ${key} before applying display writes`);
   const offset=integer(op.byteOffset,'course display offset',0,count*4-4);
   if(op.width!==4||offset%4)throw new RangeError('Invalid course display word alignment');
   s[key][offset/4]=integer(op.value,'course display bits',0,0xffffffff);
  }else if(op.kind==='courseDisplayGraphicsWrite'){
   integer(op.bufferIndex,'course graphics buffer',0,1);
   if(op.width!==1&&op.width!==2)throw new RangeError('Invalid course graphics width');
   const offset=integer(op.byteOffset,'course graphics byte offset',0xe0,0x1c0-op.width);
   if(offset%op.width)throw new RangeError('Invalid course graphics alignment');
   integer(op.value,'course graphics bits',0,op.width===1?255:65535);effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectWrite'||op.kind==='presentationEffectControlWrite'){
   const key=op.kind==='presentationEffectWrite'?'effectWords0790':'effectControlWords6d60',count=op.kind==='presentationEffectWrite'?NATIVE_PRESENTATION_EFFECT_WORDS:22;
   if(!s[key])throw new TypeError(`Supply retained ${key} before effect updates`);
   if(op.width!==4)throw new RangeError('Invalid presentation effect width');
   const offset=integer(op.byteOffset,'effect owner offset',0,count*4-4);
   if(offset%4)throw new RangeError('Invalid presentation effect alignment');
   own(s,key)[offset/4]=integer(op.value,'effect owner word',0,0xffffffff);
  }else if(op.kind==='presentationSceneMatrixWrite'||op.kind==='presentationSceneMatrixBind'){
   integer(op.bufferIndex,'scene matrix buffer',0,1);integer(op.matrixIndex,'scene matrix index',0,Math.floor((0xb2f0-0x4140)/64)-1);
   if(op.kind==='presentationSceneMatrixWrite'){
    if(op.width!==2)throw new RangeError('Invalid scene matrix width');const offset=integer(op.byteOffset,'scene matrix offset',0,62);
    if(offset%2)throw new RangeError('Invalid scene matrix alignment');integer(op.value,'scene matrix bits',0,65535);
   }else if(!['load','multiply'].includes(op.mode))throw new RangeError('Invalid scene matrix binding');
   effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectListBegin'){
   integer(op.bufferIndex,'effect list buffer',0,1);const offset=integer(op.byteOffset,'effect list offset',0,0x4140-8);
   if(offset%8)throw new RangeError('Invalid effect list alignment');effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectListEnd'){
   effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectPipeline'){
   if(!['surface','droplet'].includes(op.mode))throw new RangeError('Invalid effect pipeline');effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectTexture'){
   const frames={spray:4,splash:7,wake:4,droplet:1};if(!Object.hasOwn(frames,op.family))throw new RangeError('Invalid effect texture family');
   integer(op.textureFrame,'effect texture frame',0,frames[op.family]-1);effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectVertices'){
   integer(op.bufferIndex,'effect vertex buffer',0,1);const count=integer(op.vertexCount,'effect vertex count',1,16),offset=integer(op.byteOffset,'effect vertex offset',0,0xb2f0-count*16);
   if(offset%16)throw new RangeError('Invalid effect vertex alignment');effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectPrimitive'){
   if(!Array.isArray(op.indices)||![3,4].includes(op.indices.length))throw new RangeError('Invalid effect primitive');op.indices.forEach(v=>integer(v,'effect primitive index',0,15));effects.push(structuredClone(op));
  }else if(op.kind==='presentationTransientMaterial'||op.kind==='presentationEffectColor'){
   if(!Array.isArray(op.rgba)||op.rgba.length!==4)throw new RangeError('Invalid transient material');op.rgba.forEach(v=>integer(v,'transient color',0,255));effects.push(structuredClone(op));
  }else if(op.kind==='presentationTransientDraw'){
   integer(op.slot,'transient slot',0,7);integer(op.textureFrame,'transient texture frame',0,6);effects.push(structuredClone(op));
  }else if(op.kind==='presentationEffectVertexWrite'){
   integer(op.bufferIndex,'effect vertex buffer',0,1);if(op.width!==1&&op.width!==2)throw new RangeError('Invalid effect vertex width');
   const offset=integer(op.byteOffset,'effect vertex offset',0,0xb2f0-op.width);if(offset%op.width)throw new RangeError('Invalid effect vertex alignment');
   integer(op.value,'effect vertex bits',0,op.width===1?255:65535);effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorWrite'||op.kind==='presentationActorControlWrite'||op.kind==='presentationActorAuxControlWrite'){
   const key=op.kind==='presentationActorWrite'?'actorWordsF060':op.kind==='presentationActorControlWrite'?'actorControlWords62c4':'actorControlWords62d0',count=op.kind==='presentationActorWrite'?NATIVE_PRESENTATION_ACTOR_WORDS:op.kind==='presentationActorControlWrite'?3:2;
   if(!s[key])throw new TypeError(`Supply retained ${key} before actor updates`);
   if(op.width!==4&&(op.kind!=='presentationActorWrite'||![1,2].includes(op.width)))throw new RangeError('Invalid actor owner width');
   const offset=integer(op.byteOffset,'actor owner offset',0,count*4-op.width);
   if(offset%op.width)throw new RangeError('Invalid actor owner alignment');
   own(s,key);
   if(op.width===4)s[key][offset/4]=integer(op.value,'actor owner word',0,0xffffffff);
   else{const mask=op.width===1?255:65535,value=integer(op.value,'actor owner bits',0,mask),i=offset>>>2,shift=(4-op.width-(offset&3))*8;s[key][i]=((s[key][i]&~(mask<<shift))|(value<<shift))>>>0;}
  }else if(op.kind==='presentationLightByteWrite'||op.kind==='presentationLightBind'){
   integer(op.bufferIndex,'light buffer',0,1);integer(op.viewIndex,'light view',0,1);integer(op.lightIndex,'light index',0,1);
   if(op.kind==='presentationLightByteWrite'){
    if(op.width!==1)throw new RangeError('Invalid light byte width');integer(op.byteOffset,'light byte offset',0,23);integer(op.value,'light byte',0,255);
   }else{integer(op.slot,'light slot',0,2);if(op.byteOffset!==0&&op.byteOffset!==8)throw new RangeError('Invalid light bind offset');}
   effects.push(structuredClone(op));
  }else if(op.kind==='presentationLightCount'){
   integer(op.count,'light count',1,2);effects.push(structuredClone(op));
  }else if(op.kind==='presentationGraphicsSync'){
   effects.push(structuredClone(op));
  }else if(op.kind==='presentationFogColor'){
   if(!Array.isArray(op.rgba)||op.rgba.length!==4)throw new RangeError('Supply fog RGBA');op.rgba.forEach(v=>integer(v,'fog byte',0,255));effects.push(structuredClone(op));
  }else if(op.kind==='presentationFogFactors'){
   integer(op.packedWord,'fog coefficient bits',0,0xffffffff);effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorSurface'){
   if(!['actor12-base','actor12-overlay','actor13-final'].includes(op.preset))throw new RangeError('Invalid actor surface preset');effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorRetainedMatrixMultiply'){
   integer(op.bufferIndex,'retained actor matrix buffer',0,1);integer(op.actorIndex,'retained actor matrix index',0,29);
   words(op.matrixWords,'retained actor matrix words',16);effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorMaterial'){
   if(!['actor','actor-alternate'].includes(op.preset))throw new RangeError('Invalid actor material preset');effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorPartDraw'){
   integer(op.bufferIndex,'actor draw buffer',0,1);integer(op.actorIndex,'actor draw index',0,29);
   integer(op.resourceIndex,'actor draw resource',0,32767);
   if(![8,12,16,20,24,28,32,36,40].includes(op.partOffset))throw new RangeError('Invalid actor resource part');effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorMatrixPop'){
   integer(op.bufferIndex,'actor pop buffer',0,1);effects.push(structuredClone(op));
  }else if(op.kind==='presentationActorMatrixWrite'||op.kind==='presentationActorMatrixBind'||op.kind==='presentationActorPartBind'){
   integer(op.bufferIndex,'actor matrix buffer',0,1);integer(op.matrixIndex,'actor matrix index',0,191);
   if(op.kind==='presentationActorMatrixWrite'){
    if(op.width!==2&&op.width!==4)throw new RangeError('Invalid actor matrix width');
    const offset=integer(op.byteOffset,'actor matrix offset',0,64-op.width);
    if(offset%op.width)throw new RangeError('Invalid actor matrix alignment');
    integer(op.value,'actor matrix bits',0,op.width===2?65535:0xffffffff);
   }else{
    integer(op.actorIndex,'actor matrix bind index',0,29);
    if(op.kind==='presentationActorPartBind')integer(op.parentMatrixIndex,'actor parent matrix index',0,191);
   }
   effects.push(structuredClone(op));
  }else if(op.kind==='menuWaterMotionWrite'){
   if(!s.menuWaterMotionWords47c4)throw new TypeError('Supply retained menuWaterMotionWords47c4');
   const offset=integer(op.byteOffset,'menu water motion offset',0,12);
   if(op.width!==4||offset%4)throw new RangeError('Invalid menu water motion alignment');
   s.menuWaterMotionWords47c4[offset/4]=integer(op.value,'menu water motion bits',0,0xffffffff);
  }else if(op.kind==='waterCellWrite'){
   integer(op.index,'water cell index',0,49151);integer(op.value,'water cell bits',0,65535);
   if(!['heightQ','velocityQ'].includes(op.field))throw new RangeError('Invalid water cell field');effects.push(structuredClone(op));
  }else if(op.kind==='waterPatchRequest'){
   if(op.playerIndex!==0||op.xNative!==0||op.zNative!==0||op.radius!==16||typeof op.evolve!=='boolean')throw new RangeError('Invalid special water patch');
   effects.push(structuredClone(op));
  }else if(op.kind==='cameraEnvironmentWrite'){
   if(!s.cameraEnvironmentBytesEaa4)throw new TypeError('Supply retained cameraEnvironmentBytesEaa4 before camera updates');
   if(op.width!==1)throw new RangeError('Invalid camera environment write width');
   s.cameraEnvironmentBytesEaa4[integer(op.byteOffset,'camera environment offset',0,1)]=integer(op.value,'camera environment byte',0,255);
  }else if(op.kind==='cameraMatrixRequest'){
   integer(op.bufferIndex,'camera matrix buffer',0,1);integer(op.cameraIndex,'camera matrix index',0,1);effects.push(structuredClone(op));
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
 const sample=prepareNativeRaceDeviceSampleUpdate(state,input),adapted=prepareNativeRaceMenuInputUpdate(sample.state,input);
 return freeze({state:adapted.state,operations:[...sample.operations,...adapted.operations],effects:[...sample.effects,...adapted.effects]});
}
function deviceBytes(next){
 return Array.from({length:4},(_,port)=>Array.from({length:10},(_,i)=>{
  const a=port*10+i;return (next.deviceWords4308[a>>>2]>>>(24-(a&3)*8))&255;
 }));
}
/**4A2B4 sampling is separate from92938 adaptation: scene setup can occur
 * between them in the common dispatcher without polling a controller twice. */
export function prepareNativeRaceDeviceSampleUpdate(state,input={}){
 const next=copy(state);
 if(!next.deviceWords4308||!next.menuWordsE658)throw new TypeError('Supply retained deviceWords4308 and menuWordsE658');
 const sampled=prepareNativeDeviceSample({...input,deviceBytes4308:deviceBytes(next)});
 const operations=sampled.operations,effects=apply(next,operations);
 return freeze({state:next,operations,effects});
}
export function prepareNativeRaceMenuInputUpdate(state,input={}){
 const next=copy(state);
 if(!next.deviceWords4308||!next.menuWordsE658)throw new TypeError('Supply retained deviceWords4308 and menuWordsE658');
 const adapted=prepareNativeMenuInput({...input,deviceBytes4308:deviceBytes(next),menuWordsE658:next.menuWordsE658});
 const operations=adapted.operations,effects=apply(next,operations);
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

/** Prepare metadata and its loaded bank as one detached result. The host must
 * install state and loadedAssetWords together. Large immutable loaded banks
 * stay outside the per-frame canonical state, which copies retained variables.
 */
export function prepareNativeCourseResourceRelocationUpdate(state,input,sourceViews={}){
 const next=copy(state),prepared=prepareNativeCourseResourceRelocation({resourceWordsE73c:next.resourceWordsE73c,loadedAssetWords:input?.loadedAssetWords},input,sourceViews);
 const effects=apply(next,prepared.operations.filter(op=>op.kind==='resourceWrite'));
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

export function prepareNativeStuntResultsMenuInitializationUpdate(state){
 const next=copy(state),prepared=prepareNativeStuntResultsMenuInitialization(next),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}

export function prepareNativeStuntResultsMenuDisplayUpdate(state,sourceViews={}, {expandInput=false,expandExit=false}={}){
 if(typeof expandInput!=='boolean'||typeof expandExit!=='boolean'||expandExit&&!expandInput)throw new TypeError('Exit expansion requires input expansion');
 const next=copy(state),prepared=prepareNativeStuntResultsMenuDisplay(next,sourceViews),operations=[],effects=[];
 for(const op of prepared.operations){
  const batch=expandInput&&op.kind==='externalCall'&&op.consumer==='802c5bd8'?prepareNativeStuntResultsMenuInput(next).operations:[op];
  for(const entry of batch){
   const expanded=expandExit&&entry.kind==='externalCall'&&['801ed004','801ec9c8'].includes(entry.consumer)?prepareNativeRaceMenuInitializationUpdate(next,{consumer:entry.consumer},sourceViews).operations:[entry];
   operations.push(...expanded);effects.push(...apply(next,expanded));
  }
 }
 return freeze({...prepared,state:next,operations,effects,diagnostic:{...prepared.diagnostic,inputExpanded:expandInput,exitExpanded:expandExit}});
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

/** Prepared ending controls with one retained overlay owner. Presentation
 * recipes and the physical podium scene remain separate consumers. */
export function prepareNativeEndingMenuInitializationUpdate(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeEndingMenuInitialization(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
/** Retained ovl_i9 records browser control/slide owner, separate from other
 * overlays sharing its VRAM base. No missing loaded data is synthesized. */
export function prepareNativeRecordsBrowserAdvance(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeRecordsBrowserUpdate(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
function recordsBrowserControlResult(next,prepared,sourceViews,expandInput){
 const pending=[...prepared.operations],operations=[],effects=[];
 while(pending.length){
  const op=pending.shift();let batch=[op];
  if(expandInput&&op.kind==='externalCall'&&op.consumer==='802c5e5c'){
   pending.unshift(...prepareNativeRecordsBrowserInput(next,sourceViews).operations);continue;
  }
  if(expandInput&&op.kind==='externalCall'&&op.consumer==='801e6fb0'){
   const [type,rate,selector]=op.arguments;
   batch=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,type,rate,selector}).operations;
  }
  operations.push(...batch);effects.push(...apply(next,batch));
 }
 return freeze({...prepared,state:next,operations,effects});
}
export function prepareNativeRecordsBrowserInputUpdate(state,sourceViews={}){
 const next=copy(state);return recordsBrowserControlResult(next,prepareNativeRecordsBrowserInput(next,sourceViews),sourceViews,true);
}
export function prepareNativeRecordsBrowserPostDisplayUpdate(state,sourceViews={}, {expandInput=false}={}){
 if(typeof expandInput!=='boolean')throw new TypeError('expandInput must be boolean');
 const next=copy(state);return recordsBrowserControlResult(next,prepareNativeRecordsBrowserPostDisplay(next),sourceViews,expandInput);
}
export function prepareNativeEndingPanelEnqueueUpdate(state,panelType){
 const next=copy(state),prepared=prepareNativeEndingPanelEnqueue(next,panelType),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeEndingMenuScrollUpdate(state,sourceViews={}){
 const next=copy(state),prepared=prepareNativeEndingMenuScroll(next,sourceViews),effects=apply(next,prepared.operations);
 return freeze({...prepared,state:next,effects});
}
export function prepareNativeEndingMenuInputUpdate(state,sourceViews={}){
 const next=copy(state);return endingControlResult(next,prepareNativeEndingMenuInput(next),sourceViews,true);
}
function endingControlResult(next,prepared,sourceViews,expandInput){
 const operations=[],effects=[],pending=[...prepared.operations];
 while(pending.length){
  const op=pending.shift();let batch=[op];
  if(expandInput&&op.kind==='externalCall'&&op.consumer==='802c6c1c'){
   pending.unshift(...prepareNativeEndingMenuInput(next).operations);continue;
  }
  if(expandInput&&op.kind==='externalCall'&&op.consumer==='801e6fb0'){
   const [type,rate,selector]=op.arguments;
   batch=prepareNativeRaceFadePropertiesInitialization({fadeTemplateWords6cc0:sourceViews.fadeTemplateWords6cc0,type,rate,selector}).operations;
  }
  operations.push(...batch);effects.push(...apply(next,batch));
 }
 return freeze({...prepared,state:next,operations,effects});
}
export function prepareNativeEndingMenuDisplayUpdate(state,sourceViews={}, {expandInput=false}={}){
 if(typeof expandInput!=='boolean')throw new TypeError('expandInput must be boolean');
 const next=copy(state);return endingControlResult(next,prepareNativeEndingMenuDisplay(next,sourceViews),sourceViews,expandInput);
}
export function prepareNativeEndingMenuPostDisplayUpdate(state,sourceViews={}, {expandInput=false}={}){
 if(typeof expandInput!=='boolean')throw new TypeError('expandInput must be boolean');
 const next=copy(state);return endingControlResult(next,prepareNativeEndingMenuPostDisplay(next),sourceViews,expandInput);
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

/** Numeric title/championship/rider/course return or ending ceremony entry, with fades expanded in
 * source order into the same canonical HUD owner. Physical rider tunes,
 * resources and audio remain required effects. The original selection-menu
 * loops and rendering are separate; no target entry remains for replay.
 * Explicit expandResourceInitializers consumes96960/9684C at their source
 * positions, requiring actual retained owners and readonly views. Rider menu
 * kind3 needs the36-word descriptor owner; no missing state is synthesized. */
export function prepareNativeMenuReturnUpdate(state,destination,sourceViews={}, {expandResourceInitializers=false}={}){
 if(typeof expandResourceInitializers!=='boolean')throw new TypeError('expandResourceInitializers must be boolean');
 const prepare={course:prepareNativeCourseMenuReturn,rider:prepareNativeRiderMenuReturn,title:prepareNativeTitleMenuReturn,championship:prepareNativeChampionshipMenuReturn,ending:prepareNativeEndingCeremonyEntry}[destination];
 if(typeof prepare!=='function'||!['course','rider','title','championship','ending'].includes(destination))throw new RangeError('Unreconstructed menu return destination');
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

/** Full4F9E0 preparation uses retained scene selection and the shared random
 * stream. Commit returned waterScene together with state at the scene boundary.
 * Unlike fresh web startup,4F9E0 does not reset forcing phase47C0: the field
 * host must retain it. Display buffers and the live field are not mutated here.
 */
export function prepareNativeRaceWaterSceneInitialization(state,{datumNative}={}){
 const next=copy(state),waterScene=prepareNativeWaterSceneInitialization({variant:sceneValue(next,'field64c'),
  players:sceneValue(next,'players'),amplitudeNative:sceneValue(next,'wave49b0'),datumNative,rngState4640:sceneValue(next,'rngState4640')});
 const operations=[{kind:'sourceWordWrite',field:'rngState4640',value:waterScene.noise.rngState4640}],effects=apply(next,operations);
 return freeze({state:next,waterScene,operations,effects,diagnostic:{rngCalls:waterScene.noise.rngCalls,liveFieldUpdated:false,forcingPhase47c0Retained:true}});
}

/** Original course display setup fully overwrites these new owners. It runs
 * after water setup and before menu cameras; only graphics-buffer consumption
 * remains external. Supplied scene/HUD aliases cannot override retained state.
 */
export function prepareNativeCourseDisplayInitializationUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeCourseDisplayInitialization({...input,courseIndex:sceneValue(next,'courseIndex'),main638:sceneValue(next,'main638')});
 next.courseDisplayWordsB058=Array(136).fill(0);next.courseLightWords4160=Array(3).fill(0);
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
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
  endingAnchorsNative:input.endingAnchorsNative??input.trainingAnchorsNative,order26c0:s.raceWords1f94.slice(ri(0x26c0),ri(0x26c0)+4).map(v=>v|0),
  endingRank2c70:s.raceWords1f94[ri(0x2c70)+racerIndex*222]|0});
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
 if(input.expandEstimates!==undefined&&typeof input.expandEstimates!=='boolean')throw new TypeError('expandEstimates must be boolean');
 const next=copy(state),prepared=prepareNativeRaceResultCPUDisplay({...resultInputView(next),
  expandTransitions:true,expandWidgets:true,fadeTemplateWords6cc0:input.fadeTemplateWords6cc0,
  slotTemplateWords6c50:input.slotTemplateWords6c50});
 const operations=[],effects=[],menus=[];
 for(const operation of prepared.operations){
  if(input.expandEstimates&&operation.kind==='externalCall'&&operation.consumer==='80077f5c'){
   const estimate=prepareNativePrimaryResultEstimates({...next,primaryRecordWordsBySourceRow:input.primaryRecordWordsBySourceRow,
    bodyPositionsNativeBySlot:input.bodyPositionsNativeBySlot});
   operations.push(...estimate.operations);effects.push(...apply(next,estimate.operations));
  }else if(input.expandMenus&&operation.kind==='externalCall'&&['801ec0d4','801ec20c','801ec830','801ec9c8','801ece50','801ecf18'].includes(operation.consumer)){
   // Apply at the original call position. In retirement63B4 the following
   // AD3C4 effect must stay after this entire menu initializer.
   const menu=prepareNativeRaceMenuInitializationUpdate(next,{consumer:operation.consumer,avatarsA9b0:input.avatarsA9b0},input);
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

/** Selected type1 menu-camera setup after water initialization supplies datum.
 * Canonical scene/player and HUD storage are authoritative. Matrix requests
 * remain ordered effects; this does not initialize water or advance a frame.
 */
export function prepareNativeMenuCameraInitializationUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeMenuCameraInitialization({...input,players:sceneValue(next,'players'),hudWords7788:next.hudWords7788});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Main8 type5 setup consumes the retained class and camera owners. The source
 * scene initializer calls this after water initialization and body placement.
 * Effects are prepared atomically; no live physical or graphics owner changes.
 */
export function prepareNativeIntroductionCameraInitializationUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeIntroductionCameraInitialization({...input,
  players:sceneValue(next,'players'),main638:sceneValue(next,'main638'),courseIndex:sceneValue(next,'courseIndex'),
  difficulty:next.profileWordsB330?.[2],hudWords7788:next.hudWords7788});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** DFCB8 script phase only. The main8 host must follow with course effects,
 * auxiliary camera smoothing and environment/basis/matrix updates in order.
 */
export function prepareNativeIntroductionCameraScriptUpdate(state,input={}){
 const next=copy(state);
 if(sceneValue(next,'main638')!==8)throw new RangeError('Introduction camera script requires main8');
 const prepared=prepareNativeIntroductionCameraScript({...input,hudWords7788:next.hudWords7788});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeCameraAuxiliaryMotionUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeCameraAuxiliaryMotion({...input,hudWords7788:next.hudWords7788});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeIntroductionFlockUpdate(state,input={}){
 const next=copy(state);
 if(sceneValue(next,'main638')!==8)throw new RangeError('Introduction flock requires main8');
 const prepared=prepareNativeIntroductionFlock({...input,hudWords7788:next.hudWords7788,rngState4640:next.scene.rngState4640});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeIntroductionCourseEffectsUpdate(state,input={}){
 const next=copy(state);
 if(sceneValue(next,'main638')!==8)throw new RangeError('Introduction course effects require main8');
 const prepared=prepareNativeIntroductionCourseEffects({...input,hudWords7788:next.hudWords7788,rngState4640:next.scene.rngState4640,
  courseIndex:sceneValue(next,'courseIndex'),difficulty:next.profileWordsB330[2]|0});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeIntroductionActorInitializationUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeIntroductionActorInitialization({...input,
  main638:sceneValue(next,'main638'),actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,
  players:sceneValue(next,'players'),primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  racerRecordWordsBySlot:Array.from({length:4},(_,slot)=>[0,4,0xc,0x2f4].map(offset=>next.raceWords1f94[ri(0x2938+slot*0x378+offset)]))});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeCourseActorInitializationUpdate(state,input={}){
 const next=copy(state);
 if(!next.profileWordsB330)throw new TypeError('Supply retained profile before course actor startup');
 const prepared=prepareNativeCourseActorInitialization({...input,
  main638:sceneValue(next,'main638'),courseIndex:sceneValue(next,'courseIndex'),mode620:sceneValue(next,'mode620'),
  profileB340:next.profileWordsB330[4]|0,reverseAB68:sceneValue(next,'reverseDab68')<<16>>16,
  rngState4640:sceneValue(next,'rngState4640'),audioScene7c9c:sceneValue(next,'audioScene7c9c')>>>0,
  actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,actorControlWords62d0:next.actorControlWords62d0,
  players:sceneValue(next,'players'),primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  racerRecordWordsBySlot:Array.from({length:4},(_,slot)=>[0,4,0xc,0x2f4].map(offset=>next.raceWords1f94[ri(0x2938+slot*0x378+offset)]))});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeIntroductionActorsUpdate(state,input={}){
 const next=copy(state);
 if(sceneValue(next,'main638')!==8)throw new RangeError('Introduction actors require main8');
 const prepared=prepareNativeIntroductionActors({...input,hudWords7788:next.hudWords7788,rngState4640:next.scene.rngState4640,
  actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,
  courseIndex:sceneValue(next,'courseIndex'),difficulty:next.profileWordsB330[2]|0,
  players:sceneValue(next,'players'),primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  racerRecordWordsBySlot:Array.from({length:4},(_,slot)=>[0,4,0xc,0x2f4].map(offset=>next.raceWords1f94[ri(0x2938+slot*0x378+offset)]))});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeIntroductionCameraFrameUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeIntroductionCameraUpdate({...input,
  main638:sceneValue(next,'main638'),players:sceneValue(next,'players'),hudWords7788:next.hudWords7788,rngState4640:next.scene.rngState4640,
  actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,cameraEnvironmentBytesEaa4:next.cameraEnvironmentBytesEaa4,
  courseIndex:sceneValue(next,'courseIndex'),difficulty:next.profileWordsB330[2]|0,
  primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  racerRecordWordsBySlot:Array.from({length:4},(_,slot)=>[0,4,0xc,0x2f4].map(offset=>next.raceWords1f94[ri(0x2938+slot*0x378+offset)]))});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Numeric boundaries around actor drawing. The display scheduler must call
 * bounds before drawing and retirement after it, not during camera submission.
 */
export function prepareNativePresentationActorDisplayBoundary(state,{phase}={}){
 const next=copy(state),prepare=phase==='bounds'?prepareNativePresentationActorBounds:phase==='retire'?prepareNativePresentationActorRetirement:null;
 if(!prepare)throw new RangeError('Supply actor display boundary bounds or retire');
 const prepared=prepare({actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationActorVisibilityUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativePresentationActorVisibility({...input,
  actorWordsF060:next.actorWordsF060,hudWords7788:next.hudWords7788,cameraIndex:next.scene.displayCamera3930});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationActorRootMatrixUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativePresentationActorRootMatrix({...input,
  actorWordsF060:next.actorWordsF060,bufferIndex:next.graphicsCorners?.renderBufferIndex});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Original bird animation uses the retained signed E774/E76E resource selector,
 * E624 activity flag and active graphics buffer. The host supplies decoded
 * animation resources by index, not substitute frame timing or selection.
 */
export function prepareNativePresentationWingAnimationUpdate(state,input={}){
 const next=copy(state);
 if(!next.resourceWordsE73c)throw new TypeError('Supply retained resourceWordsE73c before wing animation');
 if(!next.actorWordsF060)throw new TypeError('Supply retained actorWordsF060 before wing animation');
 const actorIndex=integer(input.actorIndex,'wing actor index',0,29),base=actorIndex*47;
 const drawType=(next.actorWordsF060[base]+next.actorWordsF060[base+1])|0;
 if(drawType!==1&&drawType!==3)throw new RangeError('Actor does not select a wing draw type');
 const resourceIndex=drawType===1?next.resourceWordsE73c[14]>>16:(next.resourceWordsE73c[12]<<16)>>16;
 const prepared=prepareNativePresentationWingAnimation({...input,
  actorIndex,drawType,actorWordsF060:next.actorWordsF060,resourceWordsE73c:next.resourceWordsE73c,bufferIndex:next.graphicsCorners?.renderBufferIndex,
  activity624:sceneValue(next,'activity624'),resourceIndex,animation:input.animationResourcesByIndex?.[resourceIndex]});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationStaticActorUpdate(state,input={}){
 const next=copy(state);
 if(!next.resourceWordsE73c||!next.actorWordsF060)throw new TypeError('Supply retained resource and actor owners before static drawing');
 const actorIndex=integer(input.actorIndex,'static actor index',0,29),base=actorIndex*47;
 const drawType=(next.actorWordsF060[base]+next.actorWordsF060[base+1])|0;
 if(drawType!==2&&drawType!==4)throw new RangeError('Actor does not select a static draw type');
 const resourceIndex=drawType===2?next.resourceWordsE73c[14]>>16:(next.resourceWordsE73c[12]<<16)>>16;
 const prepared=prepareNativePresentationStaticActor({...input,actorIndex,drawType,resourceIndex,
  actorWordsF060:next.actorWordsF060,bufferIndex:next.graphicsCorners?.renderBufferIndex});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** The selected resource owns several animations. Selection uses retained74
 * before any reset, while draw type, activity, course and count remain canonical.
 */
export function prepareNativePresentationArticulatedActorUpdate(state,input={}){
 const next=copy(state);
 if(!next.resourceWordsE73c||!next.actorWordsF060)throw new TypeError('Supply retained resource and actor owners before articulated drawing');
 const actorIndex=integer(input.actorIndex,'articulated actor index',0,29),base=actorIndex*47;
 const drawType=(next.actorWordsF060[base]+next.actorWordsF060[base+1])|0;
 if(drawType<5||drawType>10)throw new RangeError('Actor does not select an articulated draw type');
 const resourceIndex=drawType===5?(next.resourceWordsE73c[11]<<16)>>16:next.resourceWordsE73c[drawType===6?11:drawType===10?13:12]>>16;
 const prepared=prepareNativePresentationArticulatedActor({...input,actorIndex,drawType,resourceIndex,
  actorWordsF060:next.actorWordsF060,resourceWordsE73c:next.resourceWordsE73c,bufferIndex:next.graphicsCorners?.renderBufferIndex,
  activity624:sceneValue(next,'activity624'),courseIndex:sceneValue(next,'courseIndex'),championshipCountAa00:next.scene.championshipCountAa00,
  animationsByIndex:input.animationsByResourceIndex?.[resourceIndex]});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationSpecialActorUpdate(state,input={}){
 const next=copy(state);
 if(!next.resourceWordsE73c||!next.actorWordsF060)throw new TypeError('Supply retained resource and actor owners before special drawing');
 const actorIndex=integer(input.actorIndex,'special actor index',0,29),base=actorIndex*47;
 const drawType=(next.actorWordsF060[base]+next.actorWordsF060[base+1])|0;
 if(drawType!==12&&drawType!==13)throw new RangeError('Actor does not select a special draw type');
 const resourceIndex=drawType===12?(next.resourceWordsE73c[14]<<16)>>16:next.resourceWordsE73c[15]>>16;
 const prepared=prepareNativePresentationSpecialActor({...input,actorIndex,drawType,resourceIndex,
  actorWordsF060:next.actorWordsF060,resourceWordsE73c:next.resourceWordsE73c,bufferIndex:next.graphicsCorners?.renderBufferIndex,
  activity624:sceneValue(next,'activity624'),animationsByIndex:input.animationsByResourceIndex?.[resourceIndex]});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationEffectsInitializationUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativePresentationEffectsInitialization({...input,
  effectWords0790:next.effectWords0790,effectControlWords6d60:next.effectControlWords6d60,actorWordsF060:next.actorWordsF060,
  courseIndex:sceneValue(next,'courseIndex'),racerCount:sceneValue(next,'racerCount')});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeSceneGraphicsFrameUpdate(state){
 const next=copy(state),prepared=prepareNativeSceneGraphicsFrame(next.scene);
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationEffectsFrameUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativePresentationEffectsFrame({...input,
  effectWords0790:next.effectWords0790,effectControlWords6d60:next.effectControlWords6d60,actorWordsF060:next.actorWordsF060,hudWords7788:next.hudWords7788,
  players:sceneValue(next,'players'),racerCount:sceneValue(next,'racerCount'),main638:sceneValue(next,'main638'),activity624:sceneValue(next,'activity624'),
  primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  displayCamera3930:next.scene.displayCamera3930,displayCamera3934:next.scene.displayCamera3934,
  frameCounter:sceneValue(next,'ambientD4b00'),seed6f00:sceneValue(next,'seed6f00'),bufferIndex:nativeSceneGraphicsBufferIndex(next.scene.graphicsPointerE948),
  record2f4BySlot:Array.from({length:4},(_,slot)=>next.raceWords1f94[ri(0x2938+slot*0x378+0x2f4)]|0)});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationEffectsDisplayUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativePresentationEffectsDisplay({...input,
  effectWords0790:next.effectWords0790,effectControlWords6d60:next.effectControlWords6d60,hudWords7788:next.hudWords7788,
  bufferIndex:nativeSceneGraphicsBufferIndex(next.scene.graphicsPointerE948),graphicsPointerE94c:next.scene.graphicsPointerE94c,
  // 9328C/933C4 set AB2C to each view around B305C and restore0 afterwards;
  // a two-player host passes the view it is drawing while the stored word stays0.
  matrixCountE950:sceneValue(next,'matrixCountE950'),fieldAb2c:input.view===undefined?sceneValue(next,'fieldAb2c'):(sceneValue(next,'fieldAb2c')===0&&[0,1].includes(input.view)?input.view:-1),players:sceneValue(next,'players'),main638:sceneValue(next,'main638'),
  primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),frameCounter:sceneValue(next,'ambientD4b00'),
  displayCamera3930:next.scene.displayCamera3930,displayCamera3934:next.scene.displayCamera3934});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeTransientDisplayUpdate(state){
 const next=copy(state),prepared=prepareNativeTransientDisplay({effectWords0790:next.effectWords0790,effectControlWords6d60:next.effectControlWords6d60,
  hudWords7788:next.hudWords7788,bufferIndex:nativeSceneGraphicsBufferIndex(next.scene.graphicsPointerE948),fieldAb2c:sceneValue(next,'fieldAb2c'),
  displayCamera3930:next.scene.displayCamera3930,displayCamera3934:next.scene.displayCamera3934,matrixCountE950:sceneValue(next,'matrixCountE950')});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeTransientEffectsUpdate(state){
 const next=copy(state),prepared=prepareNativeTransientEffects({effectWords0790:next.effectWords0790,seed6f00:sceneValue(next,'seed6f00')});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeSprayUpdateState(state,input={}){
 const next=copy(state),slot=integer(input.racerIndex,'spray racer',0,3),prepared=prepareNativeSprayUpdate({...input,
  effectWords0790:next.effectWords0790,effectControlWords6d60:next.effectControlWords6d60,hudWords7788:next.hudWords7788,
  players:sceneValue(next,'players'),racerCount:sceneValue(next,'racerCount'),main638:sceneValue(next,'main638'),
  primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  frameCounter:sceneValue(next,'ambientD4b00'),seed6f00:sceneValue(next,'seed6f00'),record2f4:next.raceWords1f94[ri(0x2938+slot*0x378+0x2f4)]|0,
  bodyC66:nativeEffectEngineMask(input,slot)});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeEffectGeometryUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeEffectGeometry({...input,effectWords0790:next.effectWords0790,
  effectControlWords6d60:next.effectControlWords6d60,hudWords7788:next.hudWords7788,bufferIndex:nativeSceneGraphicsBufferIndex(next.scene.graphicsPointerE948),
  players:sceneValue(next,'players'),racerCount:sceneValue(next,'racerCount'),primaryHumanIndex:sceneValue(next,'primaryHumanIndex')});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationEffectInputsUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativePresentationEffectInputs({...input,
  effectWords0790:next.effectWords0790,actorWordsF060:next.actorWordsF060,racerCount:sceneValue(next,'racerCount')});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationLightingUpdate(state){
 const next=copy(state),viewIndex=integer(sceneValue(next,'fieldAb2c'),'lighting view',0,1),courseIndex=sceneValue(next,'courseIndex');
 if(courseIndex===6&&!next.aiWords3c60)throw new TypeError('Supply retained aiWords3c60 for course lighting');
 const prepared=prepareNativePresentationLighting({bufferIndex:next.graphicsCorners?.renderBufferIndex,viewIndex,courseIndex,
  courseDisplayWordsB058:next.courseDisplayWordsB058,aiLightActive78:next.aiWords3c60?.[(viewIndex*0xe8+0x78)/4]});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativeSwimmingActorMotionUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeSwimmingActorMotion({...input,
  actorWordsF060:next.actorWordsF060,hudWords7788:next.hudWords7788,
  cameraIndex:sceneValue(next,'displayCamera3930'),activity624:sceneValue(next,'activity624'),rngState4640:sceneValue(next,'rngState4640')});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Compose recovered motion against a detached canonical owner. Every actor
 * sees prior actors' RNG writes; pending consumers must provide their real
 * prepared operations. The live host must not admit an incomplete registry.
 */
export function prepareNativeCourseActorFrameUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeCourseActorFrame({...input,
  actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,
  courseIndex:sceneValue(next,'courseIndex'),activity624:sceneValue(next,'activity624'),players:sceneValue(next,'players'),
  primaryHumanIndex:sceneValue(next,'primaryHumanIndex'),secondaryHumanIndex:sceneValue(next,'secondaryHumanIndex'),
  racerRecordWordsBySlot:Array.from({length:4},(_,slot)=>[0,4,0xc,0x2f4].map(offset=>next.raceWords1f94[ri(0x2938+slot*0x378+offset)])),
  consumeMotion:call=>{
   next.actorWordsF060=[...call.actorWordsF060];next.actorControlWords62c4=[...call.actorControlWords62c4];
   let motion;
   if(call.consumer==='800bf8c8')motion=prepareNativeCourseBirdAudio({random4562c:input.random4562c});
   else if(call.consumer==='800c1268')motion=prepareNativeDolphinAudio({actorWordsF060:next.actorWordsF060,audioContext:input.audioContext});
   else if(call.consumer==='800a68a4')motion=prepareNativeDolphinActorMotion({...input,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,actorControlWords62d0:next.actorControlWords62d0,
    hudWords7788:next.hudWords7788,resourceWordsE73c:next.resourceWordsE73c,
    cameraIndex:sceneValue(next,'displayCamera3930'),state650:sceneValue(next,'phase650'),activity624:sceneValue(next,'activity624'),
    mode620:sceneValue(next,'mode620'),championshipCountAa00:next.scene.championshipCountAa00,secondaryCount:next.scene.secondaryCount});
   else if(call.consumer==='800a5c74')motion=prepareNativeIceActorAudio({entry:call.consumer,
    actorWordsF060:next.actorWordsF060,hudWords7788:next.hudWords7788,cameraIndex:sceneValue(next,'displayCamera3930'),
    audioScene7c9c:sceneValue(next,'audioScene7c9c')});
   else if(call.consumer==='800aaac8')motion=prepareNativeIceActorMotion({...input,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,audioScene7c9c:sceneValue(next,'audioScene7c9c'),
    activity624:sceneValue(next,'activity624'),rngState4640:sceneValue(next,'rngState4640')});
   else if(call.consumer==='800a93c8'||call.consumer==='800ab890')motion=prepareNativeSpecialCourseActorMotion({...input,entry:call.consumer,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,hudWords7788:next.hudWords7788,
    cameraIndex:sceneValue(next,'displayCamera3930'),state650:sceneValue(next,'phase650'),activity624:sceneValue(next,'activity624'),
    reverse:sceneValue(next,'reverseDab68')<<16>>16,audioScene7c9c:sceneValue(next,'audioScene7c9c')});
   else if(call.consumer==='800a9130'||call.consumer==='800ab25c')motion=prepareNativeFollowingActorMotion({...input,entry:call.consumer,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,hudWords7788:next.hudWords7788,
    cameraIndex:sceneValue(next,'displayCamera3930'),state650:sceneValue(next,'phase650'),activity624:sceneValue(next,'activity624'),
    configuredLaps728:sceneValue(next,'configuredLaps728'),reverse:sceneValue(next,'reverseDab68')<<16>>16});
   else if(call.consumer==='800a5d70')motion=prepareNativeSwimmingActorMotion({...input,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,hudWords7788:next.hudWords7788,cameraIndex:sceneValue(next,'displayCamera3930'),
    activity624:sceneValue(next,'activity624'),rngState4640:sceneValue(next,'rngState4640')});
   else if(call.consumer==='800a9494')motion=prepareNativeCourseBirdMotion({...input,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,courseIndex:sceneValue(next,'courseIndex'),
    activity624:sceneValue(next,'activity624'),rngState4640:sceneValue(next,'rngState4640')});
   else if(call.consumer==='800a9d48')motion=prepareNativePerchingBirdMotion({...input,actorIndex:call.actorIndex,
    actorWordsF060:next.actorWordsF060,objectWordsC940:next.objectWordsC940,
    courseIndex:sceneValue(next,'courseIndex'),mode620:sceneValue(next,'mode620'),
    activity624:sceneValue(next,'activity624'),rngState4640:sceneValue(next,'rngState4640')});
   else{
    if(typeof input.consumeMotion!=='function')throw new TypeError(`Missing recovered actor consumer ${call.consumer}`);
    motion=input.consumeMotion({...call,state:freeze(copy(next))});
    if(!motion||!Array.isArray(motion.operations))throw new TypeError(`Invalid recovered actor consumer ${call.consumer}`);
   }
   apply(next,motion.operations);return motion;
  }});
 // Replay absolute numeric stores into the detached owner and collect effects
 // once. No audio/render command executes during either preparation phase.
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

export function prepareNativePresentationActorDisplayUpdate(state,input={}){
 const next=copy(state),viewIndex=integer(sceneValue(next,'fieldAb2c'),'actor lighting view',0,1),courseIndex=sceneValue(next,'courseIndex');
 if(courseIndex===6&&!next.aiWords3c60)throw new TypeError('Supply retained aiWords3c60 for actor lighting');
 const prepared=prepareNativePresentationActorDisplay({...input,bufferIndex:next.graphicsCorners?.renderBufferIndex,viewIndex,courseIndex,
  courseDisplayWordsB058:next.courseDisplayWordsB058,aiLightActive78:next.aiWords3c60?.[(viewIndex*0xe8+0x78)/4],
  actorDisplayPhase62c0:sceneValue(next,'actorDisplayPhase62c0'),actorWordsF060:next.actorWordsF060,actorControlWords62c4:next.actorControlWords62c4,
  resourceWordsE73c:next.resourceWordsE73c,hudWords7788:next.hudWords7788,cameraIndex:next.scene.displayCamera3930,
  activity624:sceneValue(next,'activity624'),championshipCountAa00:next.scene.championshipCountAa00});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** One original main9 camera frame. Camera/environment owners come from the
 * retained state; the host supplies the actual water datum and active buffer.
 * No ordinary race input, physical world or water clock advances here.
 */
export function prepareNativeMenuCameraFrameUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeMenuCameraUpdate({...input,
  players:sceneValue(next,'players'),main638:sceneValue(next,'main638'),hudWords7788:next.hudWords7788,
  cameraEnvironmentBytesEaa4:next.cameraEnvironmentBytesEaa4});
 const effects=apply(next,prepared.operations);return freeze({...prepared,state:next,effects});
}

/** Special menu motion and shared RNG preparation. The returned field effects
 * must be committed with this state before standings consumes the frame.
 * This does not run the race water/physics coordinator or course rollers.
 */
export function prepareNativeSpecialWaterFrameUpdate(state,input={}){
 const next=copy(state),prepared=prepareNativeSpecialWaterUpdate({...input,
  main638:sceneValue(next,'main638'),simulation648:sceneValue(next,'simulation648'),field64c:sceneValue(next,'field64c'),
  motionWords47c4:next.menuWaterMotionWords47c4,rngState4640:next.scene.rngState4640});
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
 * Source order is FC39Câ†’EF504â†’F23A0â†’[F03E0]â†’F8DD0â†’F9EA0â†’F0E7Câ†’F1CFC.
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
  if(sceneValue(current,'courseIndex')===3){
   if(Object.hasOwn(primaryInput,'gateObjectNativeXZ'))throw new RangeError('gateObjectNativeXZ overlaps canonical objectWordsC940');
   const gate=current.raceWords1f94[(0x39c0-0x1f94)/4]|0;
   integer(gate,'canonical Fortress gate index',0,sceneValue(current,'objectCountFa40')-1);
   const bits=new DataView(new ArrayBuffer(4)),read=i=>{bits.setUint32(0,current.objectWordsC940[gate*49+i]);return bits.getFloat32(0);};
   primaryInput={...primaryInput,gateObjectNativeXZ:{x:read(0),z:read(2)}};
  }
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
