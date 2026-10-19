import {createNativeRaceState,prepareNativeMenuReturnUpdate} from './native-race-state.js';
import {prepareNativeChampionshipIntroductionPhase} from './native-championship-introduction-runtime.js';
import {createNativeChampionshipIntroductionStorage} from './native-championship-introduction-data.js';
import {NATIVE_CHAMPIONSHIP_SETUP_DATA as setup} from './native-championship-setup.js';
import {NATIVE_CHAMPIONSHIP_STANDINGS_DATA as standings} from './native-championship-standings-data.js';

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
 * the browser shows its own next-round screen instead of the course preview.
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
