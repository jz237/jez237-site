import {createNativeRaceState,prepareNativeMenuReturnUpdate,prepareNativeIntroductionCameraInitializationUpdate,
 prepareNativeIntroductionCameraFrameUpdate,prepareNativeMenuCameraInitializationUpdate} from './native-race-state.js';
import {prepareNativeChampionshipIntroductionPhase} from './native-championship-introduction-runtime.js';
import {createNativeChampionshipIntroductionStorage} from './native-championship-introduction-data.js';
import {NATIVE_CHAMPIONSHIP_SETUP_DATA as setup} from './native-championship-setup.js';
import {NATIVE_CHAMPIONSHIP_STANDINGS_DATA as standings} from './native-championship-standings-data.js';
import {createNativeCourseActorHost} from './native-course-actor-host.js';
import {NATIVE_ANGLE_TABLE_WORDS} from './native-math-tables.js';

// Arguments the original introduction passes to its course-preview graphics
// helpers (loaded transforms at800E9870 + 64*course, scene buffer81010000),
// as observed in the original i3 executions. The browser does not execute
// those helpers; they only appear as external-call arguments.
export const NATIVE_CHAMPIONSHIP_INTRODUCTION_VIEWS=Object.freeze({
 courseTransformAddresses:Object.freeze(Array.from({length:9},(_,course)=>0x800e9870+course*64)),graphicsBufferAddress:0x81010000});

function views(state,avatarsBySlot){
 if(!Array.isArray(avatarsBySlot)||avatarsBySlot.length!==4||new Set(avatarsBySlot).size!==4||avatarsBySlot.some(v=>!Number.isInteger(v)||v<0||v>3))
  throw new RangeError('Supply the four championship avatars in slot order');
 const save=state.saveWordsB280;if(!Array.isArray(save)||save.length!==34)throw new RangeError('Championship continuation requires retained rider profiles');
 // Signed custom traits stay in their save owner, exactly as the first launch reads them.
 const byte=offset=>(save[offset>>>2]>>>((3-(offset&3))*8))&255;
 const customRiderTraits=Array.from({length:4},(_,i)=>Array.from({length:3},(_,j)=>byte(24+i*14+11+j)<<24>>24));
 return {...setup,...NATIVE_CHAMPIONSHIP_INTRODUCTION_VIEWS,courseWaves:standings.courseWaves,championshipCourseOrderAc14:setup.courseOrderAc14,
  waveRowsB308:setup.waveRowsByClass,avatarsA9b0:avatarsBySlot,otherAvatarsA9b4:avatarsBySlot.slice(1),customRiderTraits};
}

/** Original801EB91C return to the championship, then the i3 introduction
 * until it hands off the next race. The player's skip (A) is pressed on
 * alternate frames, which the original accepts once each panel allows it;
 * the browser plays the unskipped flyover from prepareNativeChampionshipFlyover.
 * Returns the already-executed9345C configuration for the next course loader.
 * Points, records, RNG and profiles continue from the finished round.
 */
export function prepareNativeChampionshipContinuation(finishedState,{avatarsBySlot,maxFrames=900}={}){
 let state=createNativeRaceState(finishedState);
 if(state.scene.mode608!==4)throw new RangeError('Championship continuation requires a finished championship round');
 const sourceViews=views(state,avatarsBySlot);
 if(state.championshipSelectionWords6f84===undefined)state=createNativeRaceState({...state,...createNativeChampionshipIntroductionStorage()});
 const returned=prepareNativeMenuReturnUpdate(state,'championship',sourceViews);
 const effects=[...returned.effects];state=returned.state;
 let q=null,frames=0;
 while(frames<maxFrames){
  const next=structuredClone(state);next.menuWordsE658[14]=(next.menuWordsE658[14]&0xffff0000)|(frames%2?0:0x8000);
  q=prepareNativeChampionshipIntroductionPhase(next,sourceViews);effects.push(...q.effects);state=q.state;frames++;
  if(q.handoff)break;
 }
 if(q?.handoff?.destination!=='race')throw new Error('Championship introduction did not hand off a race'+(q?.handoff?` (${q.handoff.destination})`:''));
 const configuration=q.handoff.configuration,g=configuration.state.scene;
 return Object.freeze({configuration,configurationEffectsPending:q.handoff.configurationEffectsPending,
  courseIndex:g.courseIndex,sourceDifficulty:configuration.state.profileWordsB330[2],reverse:g.reverseDab68!==0,
  round:configuration.state.profileWordsB330[1],points:Object.freeze(configuration.state.profileWordsB330.slice(4,8)),frames,effects:Object.freeze(effects)});
}

const hi=a=>(a-0x7788)/4,bits=new DataView(new ArrayBuffer(4)),float=w=>{bits.setUint32(0,w);return bits.getFloat32(0);};
const triple=(hud,base,offsets)=>offsets.map(o=>float(hud[hi(base+o)]));

/** The original main8 course-introduction flyover, for presentation only.
 * Runs the same return and i3 introduction without a skip, with the main8
 * type5->6 camera initialization at entry and the DDE48 camera frame (script,
 * introduction actors, smoothing) before each overlay update, as the original
 * 922E4 orders them. Body poses, water datum and selected water vertices come
 * from the caller's freshly placed next-course scene. Four courses' actors use
 * the shared RNG, so this runs on a copy: the race configuration still comes
 * from prepareNativeChampionshipContinuation. Returns world-free native camera
 * records, one per main8 frame, until the introduction hands off the race.
 */
export function prepareNativeChampionshipFlyover(finishedState,{avatarsBySlot,datumNative,bodyPoseWordsBySlot,selectedWaterVertexXZ,actors,maxFrames=900}={}){
 let state=createNativeRaceState(finishedState);
 if(state.scene.mode608!==4)throw new RangeError('Championship flyover requires a finished championship round');
 const sourceViews=views(state,avatarsBySlot);
 if(state.championshipSelectionWords6f84===undefined)state=createNativeRaceState({...state,...createNativeChampionshipIntroductionStorage()});
 // A fresh selection has no preceding scene camera. The cup selection menu
 // before it leaves a type1 menu camera (DDA24/DDAB8 template), which the
 // introduction's type5 setup copies from; set that up first, on this copy.
 if(state.hudWords7788[hi(0x7e98)]===0){
  const hud=[...state.hudWords7788];hud[hi(0x7c80)]=1;
  state=prepareNativeMenuCameraInitializationUpdate(createNativeRaceState({...state,hudWords7788:hud}),{datumNative}).state;
 }
 state=prepareNativeMenuReturnUpdate(state,'championship',sourceViews).state;
 if(state.scene.main638!==8)throw new Error('Championship return did not enter the course introduction');
 // Main8 entry loads this course's actor banks and runs AC184 as a race scene
 // does (the caller supplies the same startup inputs). The camera script then
 // spawns and moves its introduction actors in that pool; ADF90 draws them.
 let actorHost=null;
 if(actors){
  actorHost=createNativeCourseActorHost({readRaceState:()=>state,commitRaceState:next=>{state=createNativeRaceState(next);},worldScale:actors.worldScale,
   buffers:{matrixBuffers:Array.from({length:2},()=>Array(192*16).fill(0)),lightBuffers:Array.from({length:2},()=>Array(96).fill(0))}});
  actorHost.initialize(actors.input,actors.resources,{freshWebScene:state.resourceWordsE73c===undefined,courseLoad:true,waterExtent2498:actors.waterExtent2498});
 }
 state=prepareNativeIntroductionCameraInitializationUpdate(state,{datumNative}).state;
 const frames=[],physical={datumNative,bodyPoseWordsBySlot,selectedWaterVertexXZ};
 let q=null;
 while(frames.length<maxFrames){
  state=prepareNativeIntroductionCameraFrameUpdate(state,{...physical,bufferIndex:frames.length&1}).state;
  const hud=state.hudWords7788,c=0x7c80;
  let actorDisplay=null;
  if(actorHost){const ticket=actorHost.prepareDisplay({angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS});actorHost.commitDisplay(ticket);
   actorDisplay=Object.freeze({presentation:ticket.presentation,resourceWordsE73c:ticket.state.resourceWordsE73c});}
  frames.push(Object.freeze({eyeNative:Object.freeze(triple(hud,c,[0x4c,0x50,0x54])),targetNative:Object.freeze(triple(hud,c,[0x7c,0x80,0x84])),
   up:Object.freeze(triple(hud,c,[0x70,0x74,0x78])),fovDegrees:float(hud[hi(0x7e98+0x38)]),actors:actorDisplay}));
  const next=structuredClone(state);next.menuWordsE658[14]&=0xffff0000;
  q=prepareNativeChampionshipIntroductionPhase(next,sourceViews);state=q.state;
  if(q.handoff||state.scene.main638!==8)break;
 }
 if(q?.handoff?.destination!=='race')throw new Error('Championship flyover did not reach the race handoff');
 return Object.freeze({courseIndex:state.scene.courseIndex,frames:Object.freeze(frames)});
}
