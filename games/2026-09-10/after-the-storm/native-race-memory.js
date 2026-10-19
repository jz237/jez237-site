import {createNativeRaceState} from './native-race-state.js';
import {NATIVE_TUNE_KEYS,nativeMenuTune} from './native-rider-tuning.js';
import {NATIVE_TITLE_INITIAL_PAIR} from './native-title-menu-data.js';
import {NATIVE_RIDER_MENU_ORDER} from './native-rider-controls.js';
import {NATIVE_AI_STORAGE_WORDS} from './native-ai-storage.js';
import {createNativeGraphicsCornerBootState,advanceNativeGraphicsCornerState} from './native-graphics-corner-state.js';
import {NATIVE_SPECIAL_WATER_DATA} from './native-special-water-update.js';
import {prepareNativeCameraBoot} from './native-camera-boot.js';
import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';

const BASE=(0x2938-0x1f94)/4,STRIDE=222,hi=a=>(a-0x7788)/4,ri=a=>(a-0x1f94)/4;
const sourceFields={nextSourceRow:3,side:7,armed:8,power:75,lapMisses:76,totalMisses:77,missLimitReached:79};
const booleans=new Set(['armed','missLimitReached']);
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid fresh race ${name}`);return v;}
const numberBits=new DataView(new ArrayBuffer(4));
function floatBits(v){numberBits.setFloat32(0,v);return numberBits.getUint32(0);}

/** Explicit fresh WEB memory, before main configuration/reset/prestart.
 * Initializes independent numeric owners and empty web record defaults; no
 * race, physical host, water, audio, source loader or RNG call is performed.
 * Retained records/settings are installed by the caller before its reset.
 * This is not a restored cartridge memory image or a completed source launch.
 */
export function createNativeRaceMemory({racers,courseIndex,players,courseRuntime,mode620,laps=3,reverse=false,rngSeed=17,handicap=false}={}){
 if(!Array.isArray(racers)||racers.length<1||racers.length>4)throw new TypeError('Fresh memory requires one to four racers');
 integer(players,'players',1,2);integer(courseIndex,'courseIndex',0,9);
 if(players>racers.length||![0,1,4,11].includes(mode620))throw new RangeError('Invalid fresh race mode/participants');
 if(typeof reverse!=='boolean'||typeof handicap!=='boolean')throw new TypeError('Fresh race switches must be boolean');
 const stunt=mode620===11,practice=courseRuntime?.courseView?.nativeSceneMode==='practice';
  const raceWords1f94=Array(1693).fill(0),
   // DD85C installs numeric script links once at boot. Warm scene handoffs
   // retain these camera/auxiliary/path owners instead of bootstrapping again.
   hudWords7788=[...prepareNativeCameraBoot({hudWords7788:Array(1442).fill(0)}).hudWords7788],
   profileWordsB330=Array(52).fill(0),i1Words9440=Array(168).fill(0);
  raceWords1f94[ri(0x39b0)]=floatBits(100000);raceWords1f94[ri(0x39b4)]=floatBits(-100000);
  for(let i=0;i<racers.length;i++){
   const r=racers[i],at=BASE+i*STRIDE,source=r.sourceBuoys;
   raceWords1f94[at]=r.lap;raceWords1f94[at+1]=r.grid;raceWords1f94[at+75]=r.power;
   raceWords1f94[at+77]=r.misses;raceWords1f94[at+212]=0x801aee20;
   if(source)for(const [k,index]of Object.entries(sourceFields))raceWords1f94[at+index]=(booleans.has(k)?Number(source[k]):source[k])>>>0;
  }
  if(courseRuntime){
   profileWordsB330[2]=courseRuntime.sourceDifficulty;
   // Numeric constants7A24..7A50 in the loaded readonly HUD interval,
   // including direction-warning thresholds. They also make original-body
   // comparisons use the same constants as the reconstructed numeric leaves.
   // Opaque palettes/resources and BSS are not copied from a ROM address alias.
   [0x44bb8000,0x3f333333,0x3f333333,0x3f333333,0x3f333333,0xc51c4000,0x48ef4200,0x3fe66666,
    0x3da3d70a,0x3f333333,0x3fe66666,0x3f2aaaab].forEach((bits,i)=>hudWords7788[hi(0x7a24)+i]=bits);
   // Declared fresh WEB record-book policy. Source reset retains much of this
   // table; zero times would incorrectly prevent legitimate record insertion.
   for(let c=0;c<12;c++)for(const base of [0x1ff0+c*60,0x1ff0+c*60+20,0x1ff0+c*60+40,
    0x22c0+c*20,0x23b0+c*20])raceWords1f94[ri(base)]=599999;
  }
  return createNativeRaceState({raceWords1f94,hudWords7788,profileWordsB330,i1Words9440,aiWords3c60:Array(NATIVE_AI_STORAGE_WORDS).fill(0),
   // Fresh web camera environment flags. Warm menus retain this owner; main9
   // clears only the byte selected by each canonical camera's E8 index.
   cameraEnvironmentBytesEaa4:[0,0],
   // Fresh web allocation only. Warm scene reset preserves source-selected
   // row fields and adjacent actor/body scratch through these retained owners.
   actorWordsF060:Array(NATIVE_PRESENTATION_ACTOR_WORDS).fill(0),actorControlWords62c4:[0,0,0],
   // Loaded numeric auxiliary actor controls800E62D0/D4; preserve on warm setup.
   actorControlWords62d0:[0,0],
   // Loaded numeric motion defaults, retained across warm water scene setup.
   menuWaterMotionWords47c4:[...NATIVE_SPECIAL_WATER_DATA.bootMotionWords47c4],
   //46DA0 performs one46D2C call after boot, before its first outer iteration.
   // Restored initialState bypasses this constructor and keeps its index.
   graphicsCorners:advanceNativeGraphicsCornerState(createNativeGraphicsCornerBootState()),
   ...courseRuntime?.objectStartup?.storage,
   ...(courseRuntime?{menuWordsE658:Array(21).fill(0),deviceWords4308:Array(10).fill(0),
    // Fresh web profile policy: YOU initials for each rider/variant. No
    // cartridge save data; these14-byte entries cross u32 word boundaries.
    saveWordsB280:(()=>{const bytes=new DataView(new ArrayBuffer(136));for(let i=0;i<8;i++){for(const [j,b]of [89,79,85].entries())bytes.setUint8(24+i*14+j,b);const tune=nativeMenuTune();for(const [j,key]of NATIVE_TUNE_KEYS.entries())bytes.setUint8(24+i*14+11+j,tune[key]);}return Array.from({length:34},(_,i)=>bytes.getUint32(i*4));})(),nameEntryWords61c4:Array(14).fill(0),resultsMenuWords6d30:Array(4).fill(0),stuntResultsMenuWords5d80:Array(4).fill(0),
    continuationMenuWords61e0:Array(4).fill(0),
    // Fresh web menu selection/latch, plus verified numeric return tables.
    continuationDataWords60f0:Array.from({length:20},(_,i)=>[40,10,20,2,30,2][i-13]??0)}:{}),scene:{
   players,racerCount:racers.length,primaryHumanIndex:0,secondaryHumanIndex:1,courseIndex,
   ...(courseRuntime?.courseActorRoutes?{secondaryCount:courseRuntime.courseActorRoutes.secondary?.nodes.length??0}:{}),
   ...(courseRuntime?.objectStartup?{...courseRuntime.objectStartup.counts,forceStunt824c:0,rampFilterOverride8254:0,alternate8250:0}:{}),
   //9345C enters ordinary Dolphin Park directly in physical free play.
   mode620,mode608:mode620,main638:1,phase650:practice?3:0,simulation648:practice?3:1,
   // Loaded codeseg camera selectors80223930/34 (ROM0F1F60/64) are0/1.
   clockStopped817c:1,activity624:-1,event628:0,gameStateAb24:40,specialAb64:0,ready6fc:Number(stunt&&courseIndex===0),displayCamera3930:0,displayCamera3934:1,actorDisplayPhase62c0:0,
   // Loaded codeseg word80223938 (ROM0F1F68) enables introduction display.
   missesEnabled72e:1,result6f0:0,ambientD4b00:0,field4964:0,field4970:Number(handicap),field3938:1,resultEffect393c:0,toggleD9914:0,
   // Loaded6A264 counters/latch/selector at800D4B04/08/0C, independently
   // retained from the AI/actor graphicsCorners selector. No buffer is
   // selected and no matrix allocator reset until the actual outer call.
   graphicsFrame4b04:0,graphicsLatch4b08:1,graphicsSelector4b0c:0,audioScene7c9c:0,
   rngState4640:integer(rngSeed,'web shared RNG seed',0,0xffffffff),inputTick1960:0,previousNavigationD9874:0,trainingSelectionDa9f8:0,
   ...(courseRuntime?{primaryCount:courseRuntime.data.nodes.length,finishSourceRow:courseRuntime.data.finishSourceRow,
    cold8224:1,forceFirst8228:0,demoOffset5438:0,restart6f8:0,reverseDab68:Number(reverse),state600:0,
    freshNameAb6c:1,field700:0,fieldAb2c:0,titlePairSelectionA9fc:NATIVE_TITLE_INITIAL_PAIR,fieldA9ac:0,courseSelectionA9d0:0,pendingPlayers60c:players,
    riderSelectionA9c0:NATIVE_RIDER_MENU_ORDER.indexOf(racers[0].id),
    secondRiderSelectionA9c4:NATIVE_RIDER_MENU_ORDER.indexOf(racers[1]?.id??1),riderFlagA9c8:0,secondRiderFlagA9cc:0,
    //6AACC clears the shared ring chain after loaded objects/reset. These
    // words are unrelated to75310's collected-ring/award totals in raceWords.
    ...(stunt?{ringNext0cb0:0,ringStreak0cb4:0,unlockAb60:0}:{}),
    missLimit8174:5,noFinish8178:0,configuredLaps728:stunt?1:integer(laps,'configured laps',3,9),
    directionFlag1f90:courseRuntime.directionFlag1f90,fortressD8240:0,metadataD9b0:racers[0].id,metadataCb32c:0,seed6f00:0}:{} )}});
}
