// Numeric ovl_i15 championship ending. Loaded words and retained BSS share
// one explicit owner; this module does not substitute a lesson or practice mode.
const MIN=-2147483648,MAX=2147483647;
function int(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function at(v,key,n,i){const a=v[key];if(!Array.isArray(a)||a.length!==n)throw new RangeError(`Expected ${key}[${n}]`);return int(a[i],`${key}[${i}]`,0,0xffffffff);}
const data=(v,a)=>at(v,'endingMenuWords6d50',126,(a-0x6d50)/4);
const scene=(v,k)=>int(v.scene?.[k],`scene.${k}`);
const write=(a,value)=>({kind:'endingMenuWrite',byteOffset:a-0x6d50,width:4,value:value>>>0});
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function profile(v,i){const a=v.profileWordsB330;if(!Array.isArray(a)||![50,52].includes(a.length))throw new RangeError('Expected retained profile');return int(a[i],'profile word',0,0xffffffff);}

/** Exact5CE8 initial panel schedule and per-course avatar-to-row lookup.
 * The source's missing-avatar sentinel is4. Difficulty selects the loaded
 * course count, while final rank selects one of seven ending-message delays.
 * Graphics/assets and the outer5800 scroll/update remain separate consumers. */
export function prepareNativeEndingMenuInitialization(value,{riderOrderEabb0}={}){
 const operations=[];
 for(let row=0;row<10;row++)for(let col=0;col<4;col++)operations.push(write(0x6e80+row*16+col*4,data(value,0x6d8c+col*4)));
 const difficulty=profile(value,2)|0;int(difficulty,'ending difficulty',0,2);
 const count=data(value,0x6d54+difficulty*4)|0;
 operations.push(write(0x6e7c,count));
 const primary=int(scene(value,'primaryHumanIndex'),'primaryHumanIndex',0,3);
 const rank=at(value,'raceWords1f94',1693,(0x2c70-0x1f94)/4+primary*222)|0;
 const message=rank===3?6:(difficulty===2?3:0)+(rank===0?0:rank===1?1:2);
 operations.push(write(0x6f44,message),write(0x6d6c,data(value,0x6d70+message*4)),write(0x6d68,Number(difficulty===0)));
 // Source ADDIU wraps before its signed BLEZ, including INT_MAX overflow.
 const length=(count+1)|0;
 if(length>0){
  if(length>8)throw new RangeError('Ending course lookup exceeds its eight-course owner');
  if(!Array.isArray(riderOrderEabb0)||riderOrderEabb0.length!==4)throw new RangeError('Expected original riderOrderEabb0[4]');
  for(let row=0;row<length;row++){
   const avatar=profile(value,8+row*4)|0;let index=0;
   while(index<4&&int(riderOrderEabb0[index],'signed rider order',-32768,32767)!==avatar)index++;
   operations.push(write(0x6f20+row*4,index));
  }
 }
 operations.push(word('fieldAa08',1));
 return freeze({operations,diagnostic:{consumer:'802c5ce8',messageIndex:message,panelScrollExecuted:false}});
}

/** Exact5EE4 first-free panel allocation. A full pool returns without writes;
 * type10 uses height28, all other signed input types use32, initialY235. */
export function prepareNativeEndingPanelEnqueue(value,panelType){
 int(panelType,'panelType');let slot=0;
 while(slot<10&&data(value,0x6e80+slot*16)!==0)slot++;
 const base=0x6e80+slot*16,operations=slot===10?[]:[write(base,1),write(base+4,panelType),write(base+12,235),write(base+8,panelType===10?28:32)];
 return freeze({operations,diagnostic:{consumer:'802c5ee4',slot:slot===10?null:slot}});
}

/** Exact6CAC exit entry. Fade properties stay ordered before the optional
 * music stop. Returning to title2 stops music; the record path100 does not. */
export function prepareNativeEndingMenuExit(value,destination){
 int(destination,'ending destination');
 const operations=[word('previousGameState634',scene(value,'gameStateAb24')),word('returnState630',destination),
  word('gameStateAb24',103),word('main638',21),word('initLatch63c',1),word('field640',0),word('field644',0),
  word('fieldAb1c',0),word('field461c',3),call('801e6fb0',[3,20,0])];
 if(destination===2)operations.push(call('800c1f60',[0]));
 return freeze({operations,diagnostic:{consumer:'802c6cac',destination}});
}

/** Exact6C1C controls. Only a nonzero ready flag consumes input/time. Timeout
 * accepts at incremented601; A/Z/Start accept sooner. Record flags choose100
 * instead of2. The signed counter wraps rather than saturating. */
export function prepareNativeEndingMenuInput(value){
 const operations=[];let destination=null;
 if(data(value,0x6df4)!==0){
  const timer=((data(value,0x6df8)|0)+1)|0;operations.push(write(0x6df8,timer));
  const pressed=at(value,'menuWordsE658',21,0)&65535;
  if((pressed&0xb000)!==0||timer>=601){
   destination=data(value,0x6e74)!==0||data(value,0x6e78)!==0?100:2;
   operations.push(...prepareNativeEndingMenuExit(value,destination).operations);
  }
 }
 return freeze({operations,diagnostic:{consumer:'802c6c1c',destination}});
}
