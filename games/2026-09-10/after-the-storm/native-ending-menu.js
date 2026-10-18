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
 * Graphics/assets remain separate consumers. */
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

/** Numeric5800 update, including reached initialization and first-free enqueue.
 * Panel positions retain the source's 320x240 coordinate system; this does not
 * change output resolution. Matrix helpers are an explicit rendering boundary.
 * Viewport words and their operation positions preserve each rider preview's
 * writes without exporting guest pointers or pretending to execute N64 drawing.
 */
export function prepareNativeEndingMenuScroll(value,sourceViews={}){
 const ending=value.endingMenuWords6d50;
 if(!Array.isArray(ending)||ending.length!==126)throw new RangeError('Expected endingMenuWords6d50[126]');
 const working={...value,endingMenuWords6d50:ending.slice()},operations=[],presentation=[];
 const read=a=>data(working,a)|0;
 const append=ops=>{for(const op of ops){operations.push(op);if(op.kind==='endingMenuWrite')working.endingMenuWords6d50[op.byteOffset/4]=op.value;}};
 const put=(a,v)=>append([write(a,v)]);
 let initialized=false;
 if(scene(value,'initLatch63c')!==0&&scene(value,'gameStateAb24')===102){
  append(prepareNativeEndingMenuInitialization(working,sourceViews).operations);initialized=true;
  put(0x6e78,0);put(0x6e74,0);
  const count=((profile(value,1)|0)+1)|0;
  if(count>0){
   if(count>8)throw new RangeError('Ending records exceed the eight-course owner');
   const difficulty=int(profile(value,2)|0,'ending difficulty',0,2),order=sourceViews.courseOrderEac14;
   if(!Array.isArray(order)||order.length!==3||!Array.isArray(order[difficulty])||order[difficulty].length!==8)throw new RangeError('Expected courseOrderEac14[3][8]');
   for(let i=0;i<count;i++){
    const course=int(order[difficulty][i],'ending record course',-32768,32767);
    if(at(value,'raceWords1f94',1693,(0x2660-0x1f94)/4+course)!==0)put(0x6e74,1);
    if(at(value,'raceWords1f94',1693,(0x2690-0x1f94)/4+course)!==0)put(0x6e78,1);
   }
  }
 }
 const delay=(read(0x6d6c)-1)|0;put(0x6d6c,delay);
 if(delay<0&&read(0x6d68)!==-1){
  append(prepareNativeEndingPanelEnqueue(working,read(0x6d68)).operations);put(0x6d6c,40);
  const next=read(0x6d68);
  if(next===read(0x6e7c)){put(0x6d68,10);put(0x6d6c,110);}
  else put(0x6d68,next===10?-1:(next+1)|0);
 }
 presentation.push({kind:'matrixSetup',afterOperation:operations.length,transformWord6e34:data(working,0x6e34)});
 for(let slot=0;slot<10;slot++){
  const base=0x6e80+slot*16,active=read(base);let preview=false;
  if(active===0)continue;
  if(active===1){
   const y=(read(base+12)-2)|0;put(base+12,y);
   if(read(base+4)===10){if(y<26){put(base,2);put(base+12,25);}preview=true;}
   else if(y< -12)put(base,0);
  }else if(active===2){
   preview=true;let timer=read(0x6df0);
   if(timer<20){timer=(timer+1)|0;put(0x6df0,timer);}
   if(timer>=11){
    const fade=(read(0x6ddc)+1)|0;put(0x6ddc,fade);
    if(fade===20){put(base,3);put(0x6dd4,255);put(0x6dd8,170);put(0x6df4,1);append([call('800c489c')]);}
    else{put(0x6dd8,Math.trunc(Math.imul(fade,170)/20));put(0x6dd4,Math.trunc(Math.imul(fade,255)/20));}
   }
  }else if(active===3)preview=true;
  if(preview){
   const template=Array.from({length:4},(_,i)=>data(working,0x6de0+i*4));
   for(let rider=0;rider<4;rider++){
    const viewportWords=[...template];
    viewportWords[2]=((((read(base+8)+58)<<2)&65535)*65536+(((read(base+12)+rider*32+65)<<2)&65535))>>>0;
    presentation.push({kind:'riderViewport',afterOperation:operations.length,panelSlot:slot,riderIndex:rider,viewportWords});
   }
  }
 }
 return freeze({operations,presentation,diagnostic:{consumer:'802c5800',initialized,matrixHelpersExecuted:false,graphicsExecuted:false}});
}

/** Exact5F50 display caller. Returned display-list heads are supplied by the
 * explicit render boundary. The first entry clears the latch and draws white;
 * ordinary frames draw the scene and ending HUD before input or exit handoff.
 */
export function prepareNativeEndingMenuDisplay(value,sourceViews={}){
 const operations=[];let head=int(sourceViews.displayListHead,'incoming displayListHead',0,0xffffffff);
 if(head%4)throw new RangeError('Display-list head must be word-aligned');
 const draw=(consumer,args)=>{
  head=int(sourceViews.externalReturns?.[consumer],`return from ${consumer}`,0,0xffffffff);
  if(head%4)throw new RangeError('Display-list head must be word-aligned');
  operations.push({...call(consumer,args),returnWord:head});
 };
 let firstEntry=false;
 if(scene(value,'initLatch63c')!==0){
  operations.push(word('initLatch63c',0));firstEntry=scene(value,'gameStateAb24')===102;
 }
 if(firstEntry)draw('80093dbc',[head,255,255,255]);
 else{
  operations.push(word('fieldAb2c',0));draw('80091dbc',[head]);draw('8009328c',[head]);draw('802c602c',[head]);
  operations.push(...prepareNativeEndingMenuPostDisplay(value).operations);
 }
 return freeze({operations,displayListHead:head,diagnostic:{consumer:'802c5f50',firstEntry,renderingPerformed:false,targetMenuEntered:false}});
}

/** Numeric suffix shared with a high-resolution renderer, requiring no guest
 * display-list addresses. Only signed fade completion exactly1 enters the next
 * menu. Every destination other than title2 follows the source records route.
 */
export function prepareNativeEndingMenuPostDisplay(value){
 const operations=[];
 if(scene(value,'gameStateAb24')===102)operations.push(call('802c6c1c'));
 else if((at(value,'hudWords7788',1442,(0x8a14-0x7788)/4)<<16>>16)===1){
  operations.push(call(scene(value,'returnState630')===2?'801eb180':'801ec9c8'));
 }
 return freeze({operations,diagnostic:{consumer:'802c5f50 post-display',targetMenuEntered:false}});
}
