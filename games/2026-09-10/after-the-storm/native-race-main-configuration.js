// Independent direct main-configuration caller. Runtime tables are supplied
// read views; resource, fade and audio bodies remain required external effects.
import {prepareNativeRaceWaveSelection} from './native-race-wave-selection.js';

const MIN=-2147483648,MAX=2147483647,U32=0xffffffff;
function integer(v,n,min=MIN,max=MAX){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;
}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function array(v,n,min,max=min){if(!Array.isArray(v)||v.length<min||v.length>max)throw new RangeError(`Invalid ${n} length`);return v;}
function words(v,n,min,max=min){return Array.from(array(v,n,min,max),(x,i)=>integer(x,`${n}[${i}]`,0,U32));}
function row(v,n,index,count,width){
 const rows=array(v,n,count);integer(index,`${n} index`,0,count-1);return array(rows[index],`${n}[${index}]`,width);
}
function halfTableAt(v,n,index){
 const values=Array.from(array(v,n,1,12),(x,i)=>integer(x,`${n}[${i}]`,-32768,32767));
 return values[integer(index,`${n} course index`,0,values.length-1)];
}
const externalConsumers=['80096960','8009684c','801e6fb0','801e6a4c','800c21f4'];

/** Complete direct9345C numeric caller; this is not whole main bootstrap.
 * value contains canonical scene, profileWordsB330[50|52] and hudWords7788[1442].
 * Difficulty is the signed view of profile word2; scene.difficulty is rejected
 * as an overlapping owner. Mode4 alone requires52 profile words for its four
 * halfword flags at byte offsets c8/ca/cc/ce. Body tune writes are pending
 * effects for the caller's physical owner, not a second body state.
 *
 * sourceViews uses waveRowsB308[3][3] rawu32(kind,limit,laps), signed16 course
 * wave tables1P/Other, avatarsA9b0[4] source indices0..3, defaultRiderTraits and
 * customRiderTraits[4][3] signed8, courseRiderTraits[1..12][4][3] rawu32, and
 * courseResourcePairs[9][2] signed16. Only reached rows/fields are read.
 * No original tables or source asset data is embedded. Reverse is canonical
 * rawu16; its signed16 source comparison against zero has the same result.
 * Pending60c and participant60e retain signed16 transport without clamping;
 * admission into a configured live race remains the canonical adapter's job.
 *
 * Source order includes any kind3 RNG draw BEFORE later Stunt/Reverse profile
 * overrides. Resource96960/9684C, fade1E6FB0/1E6A4C and final audioC21F4 are
 * explicit externalCall recipes. Their numeric HUD/descriptor effects are NOT
 * executed here, and their return values do not feed this caller's decisions.
 * No phase/activity/record/physical reset beyond the returned writes is implied.
 */
export function prepareNativeRaceMainConfiguration(value,sourceViews={}){
 record(value,'main configuration value');const scene=record(value.scene,'canonical scene'),views=record(sourceViews,'source views');
 if(Object.hasOwn(scene,'difficulty'))throw new RangeError('difficulty overlaps profileWordsB330');
 const profile=words(value.profileWordsB330,'profileWordsB330',50,52);
 if(profile.length===51)throw new RangeError('profileWordsB330 requires50 or52 words');
 words(value.hudWords7788,'hudWords7788',1442);
 const operations=[],read=(k,min=MIN,max=MAX)=>integer(scene[k],`scene.${k}`,min,max);
 const word=(field,v)=>operations.push({kind:'sourceWordWrite',field,value:v>>>0});
 const half=(field,v)=>operations.push({kind:'sourceHalfwordWrite',field,value:v&65535});
 const profileWord=v=>operations.push({kind:'profileWrite',byteOffset:8,width:4,value:v>>>0});
 const call=(consumer,args)=>operations.push({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
 const hud=address=>operations.push({kind:'hudWrite',byteOffset:address-0x7788,width:4,value:3});
 const body=(racerIndex,wordIndex,v)=>operations.push({kind:'bodyTuneWordWrite',racerIndex,wordIndex,value:v>>>0});
 word('previousGameState634',read('gameStateAb24'));word('returnState630',0);word('gameStateAb24',40);
 for(const [field,v]of [['main638',1],['initLatch63c',1],['field640',0],['field644',0],['fieldAb1c',0],['field461c',3],['state600',0]])word(field,v);
 const difficulty=profile[2]|0,course=read('courseIndex');
 let wave,missLimit,laps,waveKind,rowIndex,rngCalls=0;
 if(difficulty!==0&&difficulty!==1&&read('reverseDab68',0,65535)!==0){
  missLimit=5;laps=3;word('missLimit614',missLimit);word('lapCount618',laps);half('field72c',0);
  wave=halfTableAt(views.courseWaves1P,'courseWaves1P',course);word('wave610',wave);
 }else{
  rowIndex=difficulty===0?0:difficulty===1?1:2;
  const selected=row(views.waveRowsB308,'waveRowsB308',rowIndex,3,3);
  waveKind=integer(selected[0],'selected wave kind',0,3);const input={kind:waveKind};
  if(waveKind===0){
   input.pendingPlayers60c=read('pendingPlayers60c',-32768,32767);input.courseIndex=course;
   const key=input.pendingPlayers60c===1?'courseWaves1P':'courseWavesOther';input[key]=views[key];
  }else if(waveKind===3)input.rngState4640=read('rngState4640',0,U32);
  const selectedWave=prepareNativeRaceWaveSelection(input);operations.push(...selectedWave.operations);wave=selectedWave.waveValue;rngCalls=selectedWave.rngCalls;
  missLimit=integer(selected[1],'selected miss limit word',0,U32);laps=integer(selected[2],'selected lap count word',0,U32);
  word('wave610',wave);word('missLimit614',missLimit);word('lapCount618',laps);half('field72c',waveKind);
 }
 const mode=read('mode608'),players=read('pendingPlayers60c',-32768,32767);
 word('mode620',mode);word('players',players);word('racerCount',read('participantCount60e',-32768,32767));
 word('missLimit8174',missLimit);half('field4970',read('field61c'));word('wave49b0',wave);
 if(mode===4){if(read('restart6f8')!==0)word('configuredLaps728',laps);}
 else if(mode===11){
  word('state600',0);word('configuredLaps728',1);word('lapCount618',1);half('field72c',0);
  wave=halfTableAt(views.courseWaves1P,'courseWaves1P',course);word('wave610',wave);word('wave49b0',wave);
 }else word('configuredLaps728',laps);
 word('noFinish8178',0);word('field64c',0);half('ready6fc',0);
 if(course===0&&mode===11)half('ready6fc',1);
 const ready=course===0&&mode!==11;word('phase650',ready?3:0);word('simulation648',ready?3:1);half('result6f0',0);
 function avatar(index){return integer(array(views.avatarsA9b0,'avatarsA9b0',4)[index],`avatarsA9b0[${index}]`,0,3);}
 function primaryAvatar(){const slot=read('primaryHumanIndex',0,3);return avatar(slot)+(read('variant6f4',-32768,32767)!==0?4:0);}
 if(mode===0||mode===4){
  if(read('reverseDab68',0,65535)!==0)profileWord(2);
  if(mode===4){
   if(profile.length!==52)throw new RangeError('Mode4 requires52 profile words for source slot flags');
   const primary=read('primaryHumanIndex',0,3);word('fortressD8240',0);
   for(let slot=0;slot<4;slot++){
    const selectedAvatar=avatar(slot);operations.push({kind:'profileWrite',byteOffset:0xc8+slot*2,width:2,value:0});body(slot,0,selectedAvatar);
    let traits,minimum,maximum;
    if(slot===primary){
     const key=read('metadataCb32c')!==0?'customRiderTraits':'defaultRiderTraits';traits=row(views[key],key,selectedAvatar,4,3);minimum=-128;maximum=127;
    }else{
     const courses=array(views.courseRiderTraits,'courseRiderTraits',1,12);
     integer(course,'courseRiderTraits course index',0,courses.length-1);
     traits=row(courses[course],`courseRiderTraits[${course}]`,selectedAvatar,4,3);minimum=0;maximum=U32;
    }
    for(let i=0;i<3;i++)body(slot,i+1,integer(traits[i],`source trait[${i}]`,minimum,maximum));
   }
  }
  call('80096960',[0,primaryAvatar(),avatar(1),avatar(2),avatar(3)]);
 }else if(mode===11){
  profileWord(course===5?0:2);call('80096960',[0,primaryAvatar(),avatar(1),avatar(2),avatar(3)]);
 }else if(mode===1){
  const primary=primaryAvatar(),secondary=avatar(read('secondaryHumanIndex',0,3))+(read('variant6f6',-32768,32767)!==0?4:0);
  call('80096960',[4,primary,secondary,primary,secondary]);
 }else call('80096960',[0,0,1,1,1]);
 const pair=row(views.courseResourcePairs,'courseResourcePairs',Math.max(0,Math.min(8,course)),9,2);
 call('8009684c',[0x08060000,integer(pair[0],'course resource first',-32768,32767),integer(pair[1],'course resource second',-32768,32767)]);
 call('801e6fb0',[2,4,0]);call('801e6a4c',[0,0]);hud(0x7c80);if(players===2)hud(0x7d8c);
 half('fieldA9ac',0);call('800c21f4',[7,course]);
 return freeze({operations,diagnostic:{scope:'bounded9345c-direct-caller',rngCalls,
  ...(rowIndex===undefined?{waveBranch:'reverse-other-difficulty'}:{waveBranch:'selected-row',waveRowIndex:rowIndex,waveKind}),
  requiredExternalConsumers:[...externalConsumers],externalHelpersExecuted:false,physicalInitialization:false,
  pendingBodyTuneWords:mode===4?16:0}});
}
