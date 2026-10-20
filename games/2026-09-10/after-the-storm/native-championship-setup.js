import {NATIVE_TITLE_MENU_DATA} from './native-title-menu-data.js';
import {createNativeRaceState,prepareNativeRaceMainConfigurationUpdate,prepareNativeRaceStartup,
 prepareNativeRacePrestartInitializationUpdate,nativeRaceGridTransformView,nativeRaceComputerProfileView} from './native-race-state.js';
import {prepareNativeHullStartFromMatrix} from './native-hull.js';
import {createNativeRaceMemory} from './native-race-memory.js';
import {prepareNativeRaceStateOperations} from './native-race-state.js';
import {restoreNativeRecordSession} from './native-record-session.js';
import {nativeTuneLaunchOperations} from './native-rider-tuning.js';
import {nativeChampionshipQualificationView} from './native-championship-qualification.js';

const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const preparedCourses=new WeakMap();
// A prepared handoff belongs to the exact initialized course used to create
// its reset/grid/profile data. Rebuild from retained state after serialization.
export const isNativeChampionshipLaunch=(value,courseRuntime)=>!!value&&preparedCourses.get(value)===courseRuntime&&!!courseRuntime;
// Numeric defaults copied by original91F50 from A988 into the three B308 rows.
// Runtime menu settings may replace these rows; they are not difficulty guesses.
export const NATIVE_CHAMPIONSHIP_SETUP_DATA=freeze({
 // Resident AC14 signed-halfword rows. Normal includes Dolphin warmup at0;
 // Hard/Expert start atSunny. -1 is the unused final entry, not a course.
 courseOrderAc14:[[0,1,2,4,3,5,7,-1],[1,2,4,3,5,6,7,-1],[1,2,4,3,5,6,8,7]],
 // Loaded i1 words9514..951C consumed by587C (overlay ROM1B55A0).
 lastRound9514:[6,6,7],
 waveRowsByClass:[[0,5,3],[0,5,3],[0,5,3]],
 courseWaves1P:[20,20,20,40,10,30,20,25,25],courseWavesOther:[15,15,15,35,5,20,15,20,20],
 defaultRiderTraits:Array.from({length:4},()=>[5,5,5]),
 courseRiderTraits:NATIVE_TITLE_MENU_DATA.courseRiderTraits,courseResourcePairs:NATIVE_TITLE_MENU_DATA.courseResourcePairs,
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)
});
function profiles(effects){
 const rows=Array.from({length:4},()=>Array(4).fill(null));
 for(const op of effects)if(op.kind==='bodyTuneWordWrite')rows[op.racerIndex][op.wordIndex]=op.value|0;
 return rows.map(([riderIndex,tuneB6c,tuneB70,tuneB74])=>{
  if(!Number.isInteger(riderIndex)||riderIndex<0||riderIndex>3||[tuneB6c,tuneB70,tuneB74].some(v=>!Number.isInteger(v)||v<0||v>11))
   throw new RangeError('Championship body profile requires a rider and three source tuning indices');
  return {riderIndex,tuneB6c,tuneB70,tuneB74};
 });
}

/** Application selection -> fresh championship handoff. No solo race is
 * created to obtain memory. Install retained web records, then the current
 * human tuning selection, before main configuration/reset/prestart. This
 * constructs no physical world, performs no water RNG pass and plays no audio.
 * Resource/audio dependencies remain explicit in the returned pendingEffects.
 */
export function prepareNativeChampionshipWebLaunch({racers,courseRuntime,recordSession,tunes=[],tuneModes=[],rngSeed=17}={}){
 if(courseRuntime?.mode620!==4)throw new RangeError('Fresh championship selection requires its prepared mode4 course');
 if(!Array.isArray(racers)||racers.length!==4||racers.some((r,i)=>r?.human!==(i===0)||i===0&&r.player!==0))
  throw new RangeError('Fresh championship selection requires four racers with the primary human in slot0');
 const round=NATIVE_CHAMPIONSHIP_SETUP_DATA.courseOrderAc14[courseRuntime.sourceDifficulty]?.indexOf(courseRuntime.courseIndex);
 if(round===undefined||round<0)throw new RangeError('Selected course does not belong to this championship class');
 let state=createNativeRaceMemory({racers,courseRuntime,courseIndex:courseRuntime.courseIndex,players:1,mode620:4,
  reverse:!!courseRuntime.courseView.reverse,rngSeed});
 if(recordSession!==undefined)state=createNativeRaceState(restoreNativeRecordSession(state,recordSession));
 state=createNativeRaceState({...state,roundOrderE718:[0,0,0,0],racerOrderA9dc:[0,0,0,0],
  scene:{...state.scene,participantCount60e:4,field61c:0,variant6f4:0}});
 // This is an isolated selected round with empty prior standings. Leaving
 // B330 atzero incorrectly routes a completed race through Dolphin warmup.
 // A full cup must carry its existing profile/standings instead of reseeding.
 state=prepareNativeRaceStateOperations(state,[
  {kind:'profileWrite',byteOffset:0,width:4,value:courseRuntime.courseIndex},
  {kind:'profileWrite',byteOffset:4,width:4,value:round},
  ...NATIVE_CHAMPIONSHIP_SETUP_DATA.lastRound9514.map((value,i)=>
   ({kind:'i1Write',byteOffset:0x9514-0x9440+i*4,width:4,value}))]).state;
 const qualification=nativeChampionshipQualificationView(state);
 state=prepareNativeRaceStateOperations(state,[
  ...qualification.requiredPlaceBySlot.map((value,i)=>({kind:'sourceWordWrite',field:['field708','field70c','field710','field714'][i],value})),
  {kind:'sourceWordWrite',field:'field704',value:qualification.primaryRequiredPlace}]).state;
 state=prepareNativeRaceStateOperations(state,nativeTuneLaunchOperations(racers,1,tunes,tuneModes)).state;
 return prepareNativeChampionshipLaunch(state,{courseRuntime,avatarsBySlot:racers.map(r=>r.id)});
}

/** Prepared four-rider launch, before attaching any physical world or AI.
 * The caller supplies the retained canonical scene/records/profile/save owners.
 * Source main configuration, reset and prestart initialization run in order;
 * body tune writes select each decoded grid/hull recipe. Unexecuted resource,
 * audio and presentation effects remain explicit. No live mode is admitted.
 */
export function prepareNativeChampionshipLaunch(state,{courseRuntime,avatarsBySlot,waveRowsByClass=NATIVE_CHAMPIONSHIP_SETUP_DATA.waveRowsByClass}={}){
 if(courseRuntime?.mode620!==4||!courseRuntime.objectStartup||courseRuntime.courseIndex<1||courseRuntime.courseIndex>8)
  throw new RangeError('Supply a prepared championship race course');
 const initial=createNativeRaceState(state),g=initial.scene;
 if(g.mode608!==4||g.pendingPlayers60c!==1||g.participantCount60e!==4||g.courseIndex!==courseRuntime.courseIndex||
  initial.profileWordsB330?.length!==52||initial.profileWordsB330[2]!==courseRuntime.sourceDifficulty||
  !!g.reverseDab68!==!!courseRuntime.courseView.reverse)
  throw new RangeError('Championship selection must match the prepared course, class and four-rider solo mode');
 if(!Array.isArray(avatarsBySlot)||avatarsBySlot.length!==4||new Set(avatarsBySlot).size!==4||avatarsBySlot.some(v=>!Number.isInteger(v)||v<0||v>3))
  throw new RangeError('Supply the four selected source avatars in slot order');
 if(!initial.saveWordsB280)throw new RangeError('Championship requires the retained rider profiles');
 const byte=offset=>(initial.saveWordsB280[offset>>>2]>>>((3-(offset&3))*8))&255;
 const customRiderTraits=Array.from({length:4},(_,i)=>Array.from({length:3},(_,j)=>byte(24+i*14+11+j)<<24>>24));
 const configured=prepareNativeRaceMainConfigurationUpdate(initial,{...NATIVE_CHAMPIONSHIP_SETUP_DATA,
  waveRowsB308:waveRowsByClass,avatarsA9b0:avatarsBySlot,customRiderTraits});
 return prepareNativeChampionshipConfiguredLaunch(configured,{courseRuntime,configurationEffectsPending:true});
}

/** Consume the9345C result produced by the original introduction display exit.
 * This loads/resets the selected course and prepares its physical grid without
 * reconfiguring the scene, reseeding championship points or replaying9345C.
 * The caller must explicitly state whether configuration effects are pending.
 * An introduction phase already returns them in its effects; consuming that
 * phase uses false here so resources/audio do not play twice. Fresh setup
 * uses true because no separate phase has delivered those effects.
 */
export function prepareNativeChampionshipConfiguredLaunch(configured,{courseRuntime,configurationEffectsPending}={}){
 if(typeof configurationEffectsPending!=='boolean')throw new TypeError('Specify whether configuration effects are still pending');
 const initial=createNativeRaceState(configured?.state),g=initial.scene;
 if(courseRuntime?.mode620!==4||!courseRuntime.objectStartup||courseRuntime.courseIndex<1||courseRuntime.courseIndex>8||
  g.mode608!==4||g.mode620!==4||g.players!==1||g.racerCount!==4||g.courseIndex!==courseRuntime.courseIndex||
  initial.profileWordsB330?.length!==52||initial.profileWordsB330[2]!==courseRuntime.sourceDifficulty||
  !!g.reverseDab68!==!!courseRuntime.courseView.reverse||!Array.isArray(configured.effects))
  throw new RangeError('Configured championship handoff must match its prepared course and four-rider solo state');
 const bodyProfiles=profiles(configured.effects);
 // Main selection precedes course loading/reset. Install this selected numeric
 // startup, not a previous race's moving objects or record navigation counts.
 const loaded=createNativeRaceState({...initial,...courseRuntime.objectStartup.storage,scene:{...initial.scene,
  ...courseRuntime.objectStartup.counts,primaryCount:courseRuntime.data.nodes.length,finishSourceRow:courseRuntime.data.finishSourceRow,
  // Course loading also installs this course's alternate-route row count, as
  // a fresh launch does; a continued round must not keep the previous course's.
  ...(courseRuntime.courseActorRoutes?{secondaryCount:courseRuntime.courseActorRoutes.secondary?.nodes.length??0}:{}),
  directionFlag1f90:courseRuntime.directionFlag1f90}});
 const reset=prepareNativeRaceStartup(courseRuntime.resetLayout,loaded);
 const initialized=prepareNativeRacePrestartInitializationUpdate(reset.state);
 const bits=new DataView(new ArrayBuffer(4)),number=v=>{bits.setUint32(0,v);return bits.getFloat32(0);};
 const primaryNodes=courseRuntime.data.recordWordsBySourceRow.map((row,sourceRow)=>({sourceRow,
  centerNativeXZ:{x:number(row[0]),z:number(row[2])},forwardXZ:{x:number(row[28]),z:number(row[29])},
  rightXZ:{x:number(row[30]),z:number(row[31])},classification98:row[38]|0}));
 const hullStarts=bodyProfiles.map((profile,racerIndex)=>{
  const grid=nativeRaceGridTransformView(initialized.state,{racerIndex,primaryNodes});
  if(!grid.transform.complete)throw new RangeError('Championship grid transform must be complete');
  const computerProfile=nativeRaceComputerProfileView(initialized.state,racerIndex);
  return {grid,computerProfile,prepared:prepareNativeHullStartFromMatrix({matrixWords:grid.transform.matrixWords,rider:profile.riderIndex,computerProfile})};
 });
 const launch=freeze({state:initialized.state,bodyProfiles,hullStarts,
  pendingEffects:[...(configurationEffectsPending?configured.effects.filter(o=>o.kind!=='bodyTuneWordWrite'):[]),...reset.effects,...initialized.effects],
  diagnostic:{sourceMain:configured.diagnostic,reset:reset.diagnostic,physicalWorldCreated:false,
   liveAIAdmitted:false,bodyTuneWritesConsumed:16,gridTransformsPrepared:4}});
 preparedCourses.set(launch,courseRuntime);return launch;
}
