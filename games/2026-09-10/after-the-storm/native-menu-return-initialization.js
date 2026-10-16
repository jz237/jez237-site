// Direct return-entry callers. Explicit read views supply rider ordering and
// signed trait bytes; resource, audio and fade bodies remain ordered effects.
import {stepNativeAIRandom} from './native-ai-initialization.js';
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const read=(v,k,min,max)=>int(v?.scene?.[k],`scene.${k}`,min,max);
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
const hud=(address,value)=>({kind:'hudWrite',byteOffset:address-0x7788,width:4,value});
const half=(field,value)=>({kind:'sourceHalfwordWrite',field,value:value&65535});
const profile=(byteOffset,value)=>({kind:'profileWrite',byteOffset,width:4,value:value>>>0});
const body=(racerIndex,wordIndex,value)=>({kind:'bodyTuneWordWrite',racerIndex,wordIndex,value:value>>>0});
function array(v,n,length){if(!Array.isArray(v)||v.length!==length)throw new RangeError(`Expected ${n}[${length}]`);return v;}
function row(v,n,index,length,width){return array(array(v,n,length)[int(index,`${n} index`,0,length-1)],`${n} row`,width);}
function saveByte(value,offset){const words=array(value.saveWordsB280,'saveWordsB280',34);return int(words[offset>>>2],'save word',0,0xffffffff)>>>((3-(offset&3))*8)&255;}
function resourcePair(views,course){return Array.from(row(views.courseResourcePairs,'courseResourcePairs',Math.max(0,Math.min(8,course)),9,2),v=>int(v,'resource pair',-32768,32767));}
function entry(v,game,main,field){return [word('previousGameState634',read(v,'gameStateAb24')),word('returnState630',0),
 word('gameStateAb24',game),word('main638',main),word('initLatch63c',1),word('field640',0),word('field644',0),word('fieldAb1c',0),word('field461c',field)];}

/** Complete801EBFE4 course-menu entry. The signed A9AC test is nonzero, so
 * the canonical unsigned halfword retains the exact predicate. No source
 * course-selection screen or audio consumer is silently executed here. */
export function prepareNativeCourseMenuReturn(value){
 const operations=[...entry(value,20,5,2),word('players',1),word('courseIndex',1),word('simulation648',1),word('field64c',1),word('phase650',0),
  call('801e6fb0',[2,4,0]),call('801e6a4c',[0,0]),hud(0x7c80,1)];
 if(read(value,'fieldA9ac',0,65535)!==0)operations.push(word('courseSelectionA9d0',0));
 operations.push(call('800c21f4',[10,0]),call('800c6ad0',[1]));
 return freeze({operations,diagnostic:{consumer:'801ebfe4',menuLoopExecuted:false}});
}

/** Complete801EBD28 rider-menu entry. Pending player count equals1 selects
 * one player; all other signed-halfword values select two. Body writes are
 * explicit effects against the physical owner, including aliasing human slots.
 * sourceViews supplies riderOrder6ef0[4] and defaultRiderTraits[4][3] signed8.
 * A fresh-menu latch resets both selections and flags before looking up riders.
 */
export function prepareNativeRiderMenuReturn(value,sourceViews={}){
 const operations=[...entry(value,10,4,3),word('mode620',0)],players=read(value,'pendingPlayers60c',-32768,32767)===1?1:2;
 operations.push(word('players',players),word('racerCount',players),word('wave49b0',10),word('missLimit8174',5),word('configuredLaps728',3),word('courseIndex',9));
 const fresh=read(value,'fieldA9ac',0,65535)!==0;
 if(fresh)operations.push(word('riderSelectionA9c0',0),word('secondRiderSelectionA9c4',3),word('secondRiderFlagA9cc',0),word('riderFlagA9c8',0));
 function body(slotField,selectionField,freshSelection){
  const slot=read(value,slotField,0,3),selection=fresh?freshSelection:read(value,selectionField,0,3),order=sourceViews.riderOrder6ef0;
  if(!Array.isArray(order)||order.length!==4)throw new RangeError('Expected riderOrder6ef0[4]');
  const avatar=int(order[selection],'selected rider',0,3),traits=sourceViews.defaultRiderTraits;
  if(!Array.isArray(traits)||traits.length!==4||!Array.isArray(traits[avatar])||traits[avatar].length!==3)throw new RangeError('Expected selected rider traits[3]');
  const values=[avatar,...traits[avatar].map(v=>int(v,'signed rider trait',-128,127))];
  values.forEach((v,i)=>operations.push({kind:'bodyTuneWordWrite',racerIndex:slot,wordIndex:i,value:v>>>0}));
 }
 body('primaryHumanIndex','riderSelectionA9c0',0);
 if(players===2)body('secondaryHumanIndex','secondRiderSelectionA9c4',3);
 operations.push(word('simulation648',2),word('field64c',2),word('phase650',3),{kind:'sourceHalfwordWrite',field:'specialAb64',value:0},
  call('80096960',[3,0,1,2,3]),call('801e6fb0',[2,4,0]),call('801e6a4c',[0,0]),hud(0x7c80,2),hud(0x7d8c,2));
 const sound=new Map([[0,2],[1,1],[4,0],[11,3]]).get(read(value,'mode608'));
 if(sound!==undefined)operations.push(call('800c21f4',[1,sound]));
 return freeze({operations,diagnostic:{consumer:'801ebd28',physicalInitialization:false,menuLoopExecuted:false}});
}

/** Complete801EB180 title/demo return caller. Numeric tables are explicit
 * read views: titleAvatarPairsAc44[4][2] signed16, courseRiderTraits[1..12][4][3]
 * raw32 and courseResourcePairs[9][2] signed16 from this caller's B568 table.
 * Both demo counters retain the source increment-then-reset writes. A counter
 * wrapping into an unavailable negative pair row rejects instead of repairing
 * the source read. Save flags come from the existing canonical byte owner.
 * Controller reset8004A208, resources, physical tunes and audio remain pending effects.
 */
export function prepareNativeTitleMenuReturn(value,sourceViews={}){
 const operations=[...entry(value,2,0,3),word('mode620',0),word('players',1),word('racerCount',2),word('wave49b0',20),
  word('missLimit8174',5),word('configuredLaps728',3),word('noFinish8178',1),word('state600',0),word('restart6f8',0),profile(4,0)];
 const course=read(value,'fortressD8240')===0?0:read(value,'courseIndex',0,11);
 if(read(value,'fortressD8240')===0)operations.push(word('courseIndex',0));
 operations.push(half('result6f0',0),half('reverseDab68',0),half('fieldAb0c',0),half('unlockAb60',(saveByte(value,0)&16)?1:0),
  half('specialAb64',0),word('fieldAa08',0));
 function counter(field,limit){let v=(read(value,field)+1)|0;operations.push(word(field,v));if(v>=limit){v=0;operations.push(word(field,0));}return v;}
 counter('trainingSelectionDa9f8',3);
 const selection=counter('titlePairSelectionA9fc',4),pair=row(sourceViews.titleAvatarPairsAc44,'titleAvatarPairsAc44',selection,4,2),
  avatar=int(pair[0],'title primary avatar',0,3),other=int(pair[1],'title other avatar',0,3);
 function traits(id){const rows=sourceViews.courseRiderTraits;
  if(!Array.isArray(rows)||rows.length<1||rows.length>12)throw new RangeError('Expected1..12 course rider rows');
  return Array.from(row(rows[int(course,'course rider row',0,rows.length-1)],'course rider traits',id,4,3),v=>int(v,'course rider trait',0,0xffffffff));}
 const otherTraits=traits(other);
 for(let slot=0;slot<2;slot++)[other,...otherTraits].forEach((v,i)=>operations.push(body(slot,i,v)));
 const primary=read(value,'primaryHumanIndex',0,3);
 operations.push(body(primary,0,avatar),half('variant6f6',0));
 traits(avatar).forEach((v,i)=>operations.push(body(primary,i+1,v)));
 operations.push(half('variant6f4',0),word('simulation648',1),word('field64c',0),word('phase650',3),
  call('80096960',[1,avatar,other,0,0]),call('8009684c',[0x08060000,...resourcePair(sourceViews,course)]),call('8004a208'),
  call('801e6fb0',[0,0,0]),call('801e6a4c',[0,0]),hud(0x7c80,5),half('fieldA9ac',1),call('800c21f4',[0,0]));
 return freeze({operations,diagnostic:{consumer:'801eb180',menuLoopExecuted:false,physicalInitialization:false,controllerResetExecuted:false}});
}

/** Complete801EB91C championship-return caller with the shared RNG expanded.
 * sourceViews supplies championshipCourseOrderAc14[3][8], courseWaves[12],
 * otherAvatarsA9b4[3] and this caller's B58C courseResourcePairs[9][2]. Rider0
 * is the existing metadataD9b0 owner; signed custom traits are read directly
 * from saveWordsB280, not duplicated in a parallel profile. The temporary
 * fortress profile write, signed16 counter and aliased body writes retain
 * instruction order even when a later write replaces their value.
 */
export function prepareNativeChampionshipMenuReturn(value,sourceViews={}){
 const operations=[...entry(value,30,8,3),word('players',1)],p=value.profileWordsB330;
 if(!Array.isArray(p)||(p.length!==50&&p.length!==52))throw new RangeError('Expected profileWordsB330[50|52]');
 if(read(value,'fortressD8240')!==0)operations.push(profile(0,read(value,'fortressCourse3a10')));
 const difficulty=int(p[2],'profile difficulty word',0,0xffffffff)|0,round=int(p[1],'profile round word',0,0xffffffff)|0;
 const course=int(row(sourceViews.championshipCourseOrderAc14,'championshipCourseOrderAc14',difficulty,3,8)[int(round,'championship round',0,7)],'championship course',0,11);
 operations.push(profile(0,course),word('courseIndex',course));
 if(course===0){const count=read(value,'championshipCountAa00',-32768,32767);if(count<9999)operations.push(half('championshipCountAa00',count+1));}
 const wave=int(array(sourceViews.courseWaves,'courseWaves',12)[course],'course wave',-32768,32767);
 operations.push(word('mode620',10),word('wave49b0',wave),word('missLimit8174',5),word('racerCount',course===1?4:course===2?2:1),hud(0x7c80,5),
  word('simulation648',course===1||course===4?1:2),word('field64c',0),word('phase650',3),word('noFinish8178',1),
  call('801e6fb0',[4,0,0]),call('801e6a4c',[0,0]),word('fieldAa08',0));
 const avatars=[read(value,'metadataD9b0',0,3),...Array.from(array(sourceViews.otherAvatarsA9b4,'otherAvatarsA9b4',3),v=>int(v,'other avatar',0,3))],
  primary=read(value,'primaryHumanIndex',0,3),secondary=read(value,'secondaryHumanIndex',0,3),avatar=avatars[primary],
  rng=stepNativeAIRandom(read(value,'rngState4640',0,0xffffffff));
 operations.push(word('rngState4640',rng.rngState));
 let other=rng.value&3;if(other===avatar)other=(other+1)&3;
 const resourceAvatar=avatar+(read(value,'variant6f4',-32768,32767)!==0?4:0);
 operations.push(call('80096960',course===1?[0,resourceAvatar,...avatars.slice(1)]:[1,resourceAvatar,other,0,0]));
 function tune(slot,id){operations.push(body(slot,0,id));for(let i=0;i<3;i++){const b=saveByte(value,24+id*14+11+i);operations.push(body(slot,i+1,b<<24>>24));}}
 tune(primary,avatar);tune(secondary,course===2?avatar:avatars[secondary]);tune(2,avatars[2]);tune(3,avatars[3]);
 operations.push(call('8009684c',[0x08060000,...resourcePair(sourceViews,course)]),call('800c21f4',[2,course]));
 return freeze({operations,diagnostic:{consumer:'801eb91c',rngCalls:1,menuLoopExecuted:false,physicalInitialization:false}});
}
