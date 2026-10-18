import {NATIVE_TITLE_MENU_DATA} from './native-title-menu-data.js';
import {createNativeRaceState,prepareNativeRaceMainConfigurationUpdate,prepareNativeRaceStartup,
 prepareNativeRacePrestartInitializationUpdate,nativeRaceGridTransformView,nativeRaceComputerProfileView} from './native-race-state.js';
import {prepareNativeHullStartFromMatrix} from './native-hull.js';

const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const preparedCourses=new WeakMap();
// A prepared handoff belongs to the exact initialized course used to create
// its reset/grid/profile data. Rebuild from retained state after serialization.
export const isNativeChampionshipLaunch=(value,courseRuntime)=>!!value&&preparedCourses.get(value)===courseRuntime&&!!courseRuntime;
// Numeric defaults copied by original91F50 from A988 into the three B308 rows.
// Runtime menu settings may replace these rows; they are not difficulty guesses.
export const NATIVE_CHAMPIONSHIP_SETUP_DATA=freeze({
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
 const bodyProfiles=profiles(configured.effects);
 // Main selection precedes course loading/reset. Install this selected numeric
 // startup, not a previous race's moving objects or record navigation counts.
 const loaded=createNativeRaceState({...configured.state,...courseRuntime.objectStartup.storage,scene:{...configured.state.scene,
  ...courseRuntime.objectStartup.counts,primaryCount:courseRuntime.data.nodes.length,finishSourceRow:courseRuntime.data.finishSourceRow,
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
  pendingEffects:[...configured.effects.filter(o=>o.kind!=='bodyTuneWordWrite'),...reset.effects,...initialized.effects],
  diagnostic:{sourceMain:configured.diagnostic,reset:reset.diagnostic,physicalWorldCreated:false,
   liveAIAdmitted:false,bodyTuneWritesConsumed:16,gridTransformsPrepared:4}});
 preparedCourses.set(launch,courseRuntime);return launch;
}
