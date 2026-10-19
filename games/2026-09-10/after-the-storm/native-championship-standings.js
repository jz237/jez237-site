// Original ovl_i5 standings. Numeric control only; detailed rendering and
// actual course transitions remain explicit consumers of the resulting state.
const required=[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]];
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid championship standings ${n}`);return v;}
function at(v,key,sizes,index){const a=v?.[key];if(!Array.isArray(a)||!sizes.includes(a.length))throw new RangeError(`Expected ${key} words`);return int(a[index],key,0,0xffffffff);}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const write=(address,value)=>({kind:'championshipMenuWrite',byteOffset:address-0x7a00,width:4,value:value>>>0});
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
const scene=(v,k)=>int(v?.scene?.[k],k);
const data=(v,a)=>at(v,'championshipMenuWords7a00',[68],(a-0x7a00)/4);

/** Exact5800 call order.5850 is a graphics boundary; its numerical offset
 * projection below is separate from matrix, viewport and vertex consumers. */
export function prepareNativeChampionshipStandingsUpdate(value){
 const operations=[],initialize=scene(value,'initLatch63c')!==0&&scene(value,'gameStateAb24')===52;
 if(initialize)operations.push(call('80094acc'),call('802c5a98'));
 operations.push(call('802c5850'));
 return freeze({operations,diagnostic:{consumer:'802c5800',initialize}});
}
export function prepareNativeChampionshipStandingsOffsets(value){
 const x=data(value,0x7a00)>>16;
 return freeze({operations:[{kind:'championshipMenuWrite',byteOffset:0x7b04-0x7a00,width:2,value:(40-x)&65535}],
  diagnostic:{scope:'5850 offset projection only',graphicsExecuted:false}});
}

/** Numeric5C1C display prefix. The first52 display clears the latch and
 * presents black after releasing VI blanking; it never draws or reads input.
 * Other frames render the scene before calling the post-display suffix. */
export function prepareNativeChampionshipStandingsDisplayEntry(value){
 const operations=[],latch=scene(value,'initLatch63c');
 if(latch!==0)operations.push(word('initLatch63c',0));
 const first=latch!==0&&scene(value,'gameStateAb24')===52;
 if(first)operations.push(call('800c6ad0',[0]));else operations.push(word('fieldAb2c',0));
 return freeze({operations,drawKind:first?'black':'standings',diagnostic:{firstEntry:first}});
}

/**5CA0..5D90 after drawing. The source applies the next-round/save writes
 * BEFORE selecting its target. The caller must expand that target and only
 * then run SaveCheck, since the initializer changes main638. */
export function prepareNativeChampionshipStandingsPostDisplay(value){
 const operations=[];
 if(scene(value,'gameStateAb24')===52)operations.push(call('802c6cc4'));
 else if((at(value,'hudWords7788',[1442],(0x8a14-0x7788)/4)<<16>>16)===1){
  const target=scene(value,'returnState630');
  if(target===102)operations.push(call('801ecb98'));
  else if(target===30){
   const profile=i=>at(value,'profileWordsB330',[50,52],i)|0;
   const round=(profile(1)+1)|0;operations.push({kind:'profileWrite',byteOffset:4,width:4,value:round>>>0});
   const index=scene(value,'reverseDab68')!==0?3:int(profile(2),'save difficulty',0,2);
   if((at(value,'saveWordsB280',[34],2+index)|0)<round)operations.push({kind:'saveWordWrite',byteOffset:8+index*4,width:4,value:round>>>0});
   operations.push(call('801eb91c'));
  }else operations.push(call('801eb180'));
 }
 return freeze({operations,diagnostic:{consumer:'802c5ca0',targetInitialized:false}});
}
export function prepareNativeChampionshipStandingsSaveCheck(value){
 return freeze({operations:scene(value,'main638')===9?[]:[call('8007c494')],diagnostic:{consumer:'802c5d90',recordsPersisted:false}});
}

/** Complete5A98 outcome setup, AFTER94ACC awards and cumulative ordering.
 * The last-round table is loaded state, not an inferred course count. Unlock
 * writes patch only the first save byte, including two separate Expert writes.
 * Audio is returned in original order for the host, never played by a read.
 */
export function prepareNativeChampionshipStandingsInitialization(value){
 const profile=i=>at(value,'profileWordsB330',[50,52],i)|0;
 const difficulty=int(profile(2),'difficulty',0,2),round=int(profile(1),'round',0,7),primary=int(value?.scene?.primaryHumanIndex,'primary',0,3);
 const threshold=required[difficulty][round],total=profile(4+primary),last=at(value,'championshipMenuWords7a00',[68],(0x7a2c-0x7a00)/4+difficulty)|0;
 const operations=[];let outcome,destination;
 if(total<threshold){outcome=0;destination=90;}
 else if(round<last){outcome=1;destination=30;}
 else{
  let flags=at(value,'saveWordsB280',[34],0)>>>24;
  const save=bits=>{flags|=bits;operations.push({kind:'saveByteWrite',byteOffset:0,width:1,value:flags});};
  save(1<<difficulty);
  if(difficulty===2&&(at(value,'raceWords1f94',[1693],(0x2c70-0x1f94)/4+primary*222)|0)===0)save(8);
  outcome=2;destination=102;
 }
 operations.push(write(0x7b08,destination),write(0x7b00,outcome),{kind:'externalCall',consumer:'800c21f4',arguments:[3,outcome===0?1:0]});
 return freeze({operations,diagnostic:{consumer:'802c5a98',outcome,destination,requiredPoints:threshold,totalPoints:total,roundAdvanced:false,recordsPersisted:false}});
}

/** Complete6CC4 input/slide schedule. Inputs are already sampled player-one
 * pressed edges; this does not synthesize edges or advance the shared fade.
 * Both sliding halfwords and counters wrap before the source comparisons.
 */
export function prepareNativeChampionshipStandingsInput(value){
 const phase=scene(value,'field640'),operations=[];let click=false;
 const setPhase=v=>operations.push(word('field640',v));
 const slide=delta=>{const x=((data(value,0x7a00)>>16)+delta)<<16>>16;operations.push({kind:'championshipMenuWrite',byteOffset:0,width:2,value:x&65535});return x;};
 const clamp=x=>operations.push({kind:'championshipMenuWrite',byteOffset:0,width:2,value:x&65535});
 const pressed=()=>at(value,'menuWordsE658',[21],0)&0xb000;
 if(phase===0){
  const fade=at(value,'hudWords7788',[1442],(0x8a14-0x7788)/4)<<16>>16;
  if(fade===1){setPhase(1);click=true;}
 }else if(phase===1){
  if(slide(-20)<20){setPhase(2);clamp(20);operations.push(word('field644',0));}
 }else if(phase===2){
  let ticks=scene(value,'field644');if(ticks<60){ticks=(ticks+1)|0;operations.push(word('field644',ticks));}
  if(ticks>=31&&pressed()){setPhase(3);click=true;}
 }else if(phase===3){
  if(slide(-20)<-265){setPhase(4);clamp(-265);click=true;}
 }else if(phase===4){
  if(slide(20)>20){setPhase(5);clamp(20);operations.push(write(0x7b0c,0));}
 }else if(phase===5){
  let ticks=data(value,0x7b0c)|0;if(ticks<16){ticks=(ticks+1)|0;operations.push(write(0x7b0c,ticks));}
  if(ticks===6&&data(value,0x7b00)===1)operations.push(call('800c3e4c'));
  if(ticks>=6&&pressed()){setPhase(6);operations.push(word('field644',0),call('800c37f4',[17,0]));}
 }else if(phase===6){
  const ticks=(scene(value,'field644')+1)|0;operations.push(word('field644',ticks));
  if(ticks>=30){const destination=data(value,0x7b08)|0;
   if(destination!==90)operations.push(call('802c6f84',[destination]));
   else{setPhase(7);click=true;operations.push(call('800c1f60',[5]));}
  }
 }else if(phase===7){
  if(slide(20)>320){clamp(320);operations.push(call('801ec944'));}
 }
 if(click)operations.push(call('800c37f4',[49,0]));
 return freeze({operations,diagnostic:{consumer:'802c6cc4',phase,graphicsExecuted:false}});
}

/** Complete6F84 exit entry. Unlike other menu initializers it deliberately
 * retains field640. Shared fade and audio calls remain ordered consumers.
 */
export function prepareNativeChampionshipStandingsExit(value,destination){
 int(destination,'destination');
 const operations=[word('previousGameState634',scene(value,'gameStateAb24')),word('returnState630',destination),
  word('gameStateAb24',53),word('main638',9),word('initLatch63c',1),word('field644',0),word('fieldAb1c',0),word('field461c',2),
  call('801e6fb0',destination===102?[1,4,0]:destination===30?[5,2,0]:[5,1,0])];
 if(destination===102||destination===30)operations.push(call('800c1f60',[destination===102?11:2]));
 return freeze({operations,diagnostic:{consumer:'802c6f84',destination}});
}
