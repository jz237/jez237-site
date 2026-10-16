// Independent control reconstruction for ovl_i14, ROM1CF180 -> RAM802C5800.
// Source-selected loaded data and BSS have separate retained owners.
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const scene=(v,k)=>integer(v?.scene?.[k],`scene.${k}`);
function at(v,key,count,index){const a=v[key];if(!Array.isArray(a)||a.length!==count)throw new RangeError(`Expected ${key}[${count}]`);return integer(a[index],`${key}[${index}]`,0,0xffffffff);}
const control=(v,i)=>at(v,'continuationMenuWords61e0',4,i);
const data=(v,i)=>at(v,'continuationDataWords60f0',20,i);
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args});
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const write=(i,value,kind='continuationMenuWrite')=>({kind,byteOffset:i*4,width:4,value:value>>>0});

/** Complete5800 with its5840 initializer expanded. Selection60F0 and the
 * once-only audio latch613C survive initialization. Store order is retained,
 * including the initial count4 before championship overwrites it with2. */
export function prepareNativeContinuationMenuInitialization(value){
 const operations=[];
 if(scene(value,'initLatch63c')!==0&&scene(value,'gameStateAb24')===80){
  const mode=scene(value,'mode608'),previous=scene(value,'previousGameState634');
  control(value,0);operations.push(write(3,4));
  const immediate=mode===4?previous===67:![100,50,57].includes(previous);
  if(mode===4)operations.push(write(3,2));
  if(immediate)operations.push(write(0,1),write(2,76),write(1,76));
  else operations.push(write(0,0),write(1,320),write(2,-169),call('800c37f4',[0x31,0]));
 }
 return freeze({operations,diagnostic:{consumer:'802c5800',expandedConsumers:operations.length?['802c5840']:[]}});
}

/** Complete5F60 controls. It reads the first pressed halfwordE65A. Any
 * nonzero phase accepts controls. Offset and selection arithmetic is signed32
 * after wrapping; ordinary/championship return tables live in the data owner. */
export function prepareNativeContinuationMenuInput(value){
 const operations=[],phase=control(value,0);
 if(phase===0){
  let x=((control(value,1)|0)-20)|0;operations.push(write(1,x));
  if(x<76){x=76;operations.push(write(0,1),write(1,x));}
  operations.push(write(2,(152-x)|0));
 }else{
  if(data(value,19)===0)operations.push(write(19,1,'continuationDataWrite'),call('800c30f8'));
  const pressed=at(value,'menuWordsE658',21,0)&65535;
  if(pressed&0xb000){
   const base=scene(value,'mode608')===4?17:13,offset=((data(value,0)<<2)+base*4)>>>0;
   if(offset>=80)throw new RangeError('Continuation selection reads outside the supplied data owner');
   operations.push(call('802c5e5c',[data(value,offset/4)]),call('800c37f4',[0x11,0]));
  }else if(pressed&0x800){
   const next=((data(value,0)|0)-1)|0;operations.push(write(0,next,'continuationDataWrite'));
   if(next<0)operations.push(write(0,((control(value,3)|0)-1)|0,'continuationDataWrite'));
   operations.push(call('800c37f4',[0x10,0]));
  }else if(pressed&0x400){
   const next=((data(value,0)|0)+1)|0;operations.push(write(0,next,'continuationDataWrite'));
   if(next>=(control(value,3)|0))operations.push(write(0,0,'continuationDataWrite'));
   operations.push(call('800c37f4',[0x10,0]));
  }
 }
 return freeze({operations,diagnostic:{consumer:'802c5f60'}});
}

/** Complete5E5C exit caller. Fades and audio are ordered effects here. */
export function prepareNativeContinuationMenuExit(value,{returnState630}={}){
 const target=integer(returnState630,'returnState630'),previous=scene(value,'gameStateAb24');
 const operations=[word('previousGameState634',previous),word('returnState630',target),word('gameStateAb24',81),
  word('main638',13),word('initLatch63c',1),word('field640',0),word('field644',0),word('fieldAb1c',0),word('field461c',2),
  call('801e6fb0',[5,1,0]),call('801e6a4c',[0,0])];
 const sound=new Map([[2,0],[20,10],[10,1],[40,7]]).get(target);
 if(sound!==undefined)operations.push(call('800c1f60',[sound]));
 return freeze({operations,diagnostic:{consumer:'802c5e5c',nextMenuLoopExecuted:false}});
}

/** Complete5924 caller, including the return-state jump-table branches missed
 * by partial decompilation. GPU heads are explicit; draw/save/target routines
 * remain call recipes. A signed fade completion of exactly1 permits saving.
 */
export function prepareNativeContinuationMenuDisplay(value,sourceViews={}){
 const operations=[];let head=integer(sourceViews.displayListHead,'incoming displayListHead',0,0xffffffff);
 if(head%4)throw new RangeError('Display-list head must be word-aligned');
 const draw=(consumer,args)=>{head=integer(sourceViews.externalReturns?.[consumer],`return from ${consumer}`,0,0xffffffff);
  if(head%4)throw new RangeError('Display-list head must be word-aligned');operations.push({...call(consumer,args),returnWord:head});};
 let first=false;
 if(scene(value,'initLatch63c')!==0){
  operations.push(word('initLatch63c',0));
  if(scene(value,'gameStateAb24')===80){const previous=scene(value,'previousGameState634');
   if(![50,57,100].includes(previous))first=scene(value,'mode608')!==4||previous===67;}
 }
 if(first){operations.push(call('800c6ad0',[0]));draw('80093c44',[head]);}
 else{
  operations.push(word('fieldAb2c',0));draw('8008fb74',[head]);draw('800949b8',[head,scene(value,'courseIndex')>>>0]);
  draw('80090f58',[head]);draw('802c5b70',[head]);
  if(scene(value,'gameStateAb24')===80)operations.push(call('802c5f60'));
  else if((at(value,'hudWords7788',1442,(0x8a14-0x7788)/4)<<16>>16)===1){
   const mode=scene(value,'mode608'),race=a=>at(value,'raceWords1f94',1693,(a-0x1f94)/4);
   if(mode===0&&(race(0x2650)!==0||race(0x2654)!==0)){
    const reverse=integer(value.scene.reverseDab68,'reverseDab68',0,65535);
    operations.push(call(reverse===0?'8007bea4':'8007c204',[scene(value,'courseIndex')>>>0]));
   }else if(mode===11&&race(0x2928)!==0)operations.push(call('8007c0b8',[scene(value,'courseIndex')>>>0]));
   const target=scene(value,'returnState630');
   if(target===30){operations.push(word('restart6f8',1),{kind:'profileWrite',byteOffset:4,width:4,value:0});
    const profile=value.profileWordsB330;if(!Array.isArray(profile)||![50,52].includes(profile.length))throw new RangeError('Expected retained profile words');
    if(integer(profile[2],'profile difficulty',0,0xffffffff)===0)operations.push({kind:'profileWrite',byteOffset:4,width:4,value:1});
    operations.push(call('801eb91c'));
   }else{const consumer=new Map([[2,'801eb180'],[10,'801ebd28'],[20,'801ebfe4'],[40,'8009345c']]).get(target);if(consumer)operations.push(call(consumer));}
  }
 }
 return freeze({operations,displayListHead:head,diagnostic:{consumer:'802c5924',firstEntry:first,renderingPerformed:false,recordsPersisted:false}});
}
