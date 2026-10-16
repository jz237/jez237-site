// Direct return-entry callers. Explicit read views supply rider ordering and
// signed trait bytes; resource, audio and fade bodies remain ordered effects.
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const read=(v,k,min,max)=>int(v?.scene?.[k],`scene.${k}`,min,max);
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
const hud=(address,value)=>({kind:'hudWrite',byteOffset:address-0x7788,width:4,value});
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
