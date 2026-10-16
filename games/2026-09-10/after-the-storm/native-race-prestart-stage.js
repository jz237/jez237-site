// Reconstructed original prestart numeric consumers. These are source-frame
// calls, not presentation-frame updates. Storage and initialization remain
// caller-owned; opaque source callees are returned as ordered dependencies.
import {prepareNativeRaceFadePropertiesInitialization,prepareNativeRaceFadeSlotsReset,prepareNativeRaceFadeSlotInitialization} from './native-race-fade-initialization.js';
const MIN=-2147483648,MAX=2147483647;
const SPANS={i1Words9440:[0x9440,168,'i1Write'],hudWords7788:[0x7788,1442,'hudWrite'],
 profileWordsB330:[0xb330,50,'profileWrite'],raceWords1f94:[0x1f94,1693,null],saveWordsB280:[0xb280,34,'saveByteWrite']};
const POINTS=[7,4,2,1,0,0];
const REQUIRED_POINTS=[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]];
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function context(value){record(value,'prestart source sample');record(value.scene,'prestart scene');
 if(value.expandTransitions!==undefined&&typeof value.expandTransitions!=='boolean')throw new TypeError('expandTransitions must be boolean');
 if(value.expandWidgets!==undefined&&typeof value.expandWidgets!=='boolean')throw new TypeError('expandWidgets must be boolean');
 if(value.profileWordsB330!==undefined&&Object.hasOwn(value.scene,'difficulty'))throw new RangeError('scene.difficulty overlaps profileWordsB330');
 return {value,scene:{...value.scene},spans:{},operations:[]};}
function span(c,key){
 if(!c.spans[key]){const n=SPANS[key][1],v=c.value[key];
  if(!Array.isArray(v)||(key==='profileWordsB330'?v.length!==50&&v.length!==52:v.length!==n))
   throw new RangeError(`${key} requires${key==='profileWordsB330'?'50 or52':n} retained unsigned words`);
  c.spans[key]=Array.from(v,x=>integer(x,`${key} word`,0,0xffffffff));}
 return c.spans[key];
}
function word(c,key,address){return span(c,key)[(address-SPANS[key][0])/4]|0;}
function bits(c,key,address){return span(c,key)[(address-SPANS[key][0])/4];}
function write(c,key,address,value){
 const [base,count,kind]=SPANS[key],offset=integer(address-base,`${key} byte offset`,0,count*4-4);
 if(!kind||offset%4)throw new RangeError('Invalid source span write');
 const valueBits=value>>>0;span(c,key)[offset/4]=valueBits;c.operations.push({kind,byteOffset:offset,width:4,value:valueBits});
}
function s(c,key,min=MIN,max=MAX){return integer(c.scene[key],`scene.${key}`,min,max);}
function source(c,field,value,width=4){
 const valueBits=width===2?value&65535:value>>>0;
 c.scene[field]=width===2?valueBits<<16>>16:valueBits|0;
 c.operations.push({kind:width===2?'sourceHalfwordWrite':'sourceWordWrite',field,value:valueBits});
}
function hudHalfword(c,address){const offset=address-0x7788,v=span(c,'hudWords7788')[offset>>>2];
 return ((v>>>(offset&2?0:16))&65535)<<16>>16;}
function call(c,consumer,args=[],returns=false){
 if(c.value.expandWidgets===true&&consumer==='801e6a4c'){
  const prepared=prepareNativeRaceFadeSlotInitialization({hudWords7788:span(c,'hudWords7788'),
   slotTemplateWords6c50:c.value.slotTemplateWords6c50,type:args[0],selector:args[1]});
  for(const op of prepared.operations){
   const words=span(c,'hudWords7788'),index=op.byteOffset>>>2;
   if(op.width===4)words[index]=op.value;
   else{const shift=(2-(op.byteOffset&2))*8;words[index]=((words[index]&~(65535<<shift))|(op.value<<shift))>>>0;}
   c.operations.push(op);
  }
  return;
 }
 if(c.expandResults){
  if(consumer==='802c6b38'){
   // This helper does not draw: every return preserves the supplied head.
   // In state41 it stops the clock for counters<30, then increments with
   // signed32 wrap and arms the result fade after counter60. Its result6F0
   // branches reconverge without changing any of those writes.
   if(s(c,'gameStateAb24')===41){
    const before=word(c,'i1Words9440',0x96a4),next=(before+1)|0;
    if(before<30)source(c,'clockStopped817c',1);
    write(c,'i1Words9440',0x96a4,next);
    if(next>=61&&word(c,'i1Words9440',0x96a0)===0)write(c,'i1Words9440',0x96a0,1);
   }
   return args[0];
  }
  if(['802c6dcc','802c6fe0','802c7394'].includes(consumer)){initializeResult(c,consumer);return;}
  if(['802c63b4','802c6550','802c6b00'].includes(consumer)){updateResult(c,consumer);return;}
 }
 if(c.value.expandTransitions===true){
  let prepared;
  if(consumer==='801e6fb0')prepared=prepareNativeRaceFadePropertiesInitialization({
   fadeTemplateWords6cc0:c.value.fadeTemplateWords6cc0,type:args[0],rate:args[1],selector:args[2]});
  else if(consumer==='801e6a4c'&&args[0]===0&&args[1]===0)prepared=prepareNativeRaceFadeSlotsReset({slotTemplateWords6c50:c.value.slotTemplateWords6c50});
  else if(consumer==='802c7570'){
   source(c,'previousGameState634',s(c,'gameStateAb24'));source(c,'returnState630',args[0]);source(c,'gameStateAb24',45);
   source(c,'main638',1);source(c,'initLatch63c',1);source(c,'field640',0);source(c,'field644',0);source(c,'fieldAb1c',0);source(c,'field461c',3);
   call(c,'801e6a4c',[0,0]);write(c,'hudWords7788',0x8aa4,1);call(c,'800c21f4',[3,0]);return;
  }
  if(prepared){
   for(const op of prepared.operations){
    const words=span(c,'hudWords7788'),offset=op.byteOffset,index=offset>>>2;
    if(op.width===4)words[index]=op.value;
    else{const shift=(4-op.width-(offset&3))*8,mask=op.width===2?65535:255;
     words[index]=((words[index]&~(mask<<shift))|(op.value<<shift))>>>0;}
    c.operations.push(op);
   }
   return;
  }
 }
 const op={kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)};
 if(returns){
  const value=integer(c.value.externalReturns?.[consumer],`actual return from${consumer}`,0,0xffffffff);
  if(value%4)throw new RangeError('Source display-list head must be word-aligned');
  op.returnWord=value;c.operations.push(op);return value;
 }
 c.operations.push(op);
}
function profile(c,address){return word(c,'profileWordsB330',address);}
function selected(c,secondary=false){return s(c,secondary?'secondaryHumanIndex':'primaryHumanIndex',0,3);}
function racer(c,index,offset){return word(c,'raceWords1f94',0x2938+index*0x378+offset);}
function round(c){return integer(profile(c,0xb334),'source roundB334',0,7);}
function difficulty(c){return integer(profile(c,0xb338),'source difficultyB338',0,2);}
function initialize(c){
 write(c,'i1Words9440',0x9440,0);
 if(s(c,'mode608')!==4)return;
 if(s(c,'courseIndex')===0)for(let i=0;i<9;i++)write(c,'i1Words9440',0x96a8+i*4,bits(c,'i1Words9440',0x94c8+i*4));
 write(c,'i1Words9440',0x96cc,bits(c,'i1Words9440',0x9514+difficulty(c)*4));
}
function addWin(c,secondary){
 const address=secondary?0xb3f4:0xb3f0,v=profile(c,address);
 if(v<99)write(c,'profileWordsB330',address,(v+1)|0);
}
function cupResult(c,index,finished){
 if(s(c,'mode608')!==4)return;
 const current=round(c),last=word(c,'i1Words9440',0x96cc),time=racer(c,index,0x19c);
 write(c,'profileWordsB330',0xb3d0+current*4,time);
 if(current!==last)return;
 const classIndex=difficulty(c),threshold=REQUIRED_POINTS[classIndex][current];
 let points=profile(c,0xb340);
 if(finished){const place=integer(racer(c,index,4),'finished place293c',0,5);points=(POINTS[place]+points)|0;}
 if(points>=threshold)write(c,'i1Words9440',0x9510,1);
}
function status(c){
 if(hudHalfword(c,0x8a16)===1&&s(c,'gameStateAb24')===40){
  const alternate=s(c,'specialAb64',-32768,32767)!==0&&s(c,'mode620')===4&&s(c,'courseIndex')===0;
  call(c,alternate?'800bfe70':'800bfdd0',[0x80192610]);call(c,'800bfef8',[0x80192630]);
 }
 if(s(c,'courseIndex')===0){
  if(s(c,'ready6fc',-32768,32767)!==0){
   if(word(c,'i1Words9440',0x9440)===0){source(c,'phase650',1);write(c,'i1Words9440',0x9440,-1);}
   if(s(c,'phase650')===2&&s(c,'activity624',-32768,32767)===-1)source(c,'simulation648',3);
  }
 }else{
  const counter=word(c,'i1Words9440',0x9440);
  if(counter>=0){
   const next=(counter+1)|0;write(c,'i1Words9440',0x9440,next);
   let threshold=46;
   if(s(c,'players',1,2)===1){const mode=s(c,'mode620');threshold=mode===0||mode===11?10:50;}
   if(next>=threshold){source(c,'phase650',1);write(c,'i1Words9440',0x9440,-1);}
  }
  if(s(c,'phase650')===2&&s(c,'activity624',-32768,32767)===-1)source(c,'simulation648',3);
 }
 const primary=selected(c),pFinished=racer(c,primary,0x2f4);
 if(s(c,'players',1,2)===1){
  if(pFinished!==0){cupResult(c,primary,true);call(c,'802c6fe0');}
  else if(s(c,'missesEnabled72e',0,65535)!==0&&racer(c,primary,0x2ec)!==0){
   cupResult(c,primary,false);source(c,'result6f0',1,2);call(c,'802c6dcc');
  }
  return;
 }
 const secondary=selected(c,true),sFinished=racer(c,secondary,0x2f4);
 if(pFinished!==0&&sFinished!==0){
  const pTime=racer(c,primary,0x19c),sTime=racer(c,secondary,0x19c);
  if(pTime===sTime){source(c,'result6f0',3,2);call(c,'802c7394');write(c,'hudWords7788',0x8aa8,3);return;}
  const secondWins=pTime>=sTime;source(c,'result6f0',secondWins?1:2,2);addWin(c,secondWins);
  call(c,'802c6fe0');write(c,'hudWords7788',0x8aa8,secondWins?2:1);return;
 }
 if(pFinished!==0||sFinished!==0){
  const secondWins=pFinished===0;source(c,'result6f0',secondWins?1:2,2);addWin(c,secondWins);
  call(c,'802c6fe0');write(c,'hudWords7788',0x8aa8,secondWins?2:1);return;
 }
 if(s(c,'missesEnabled72e',0,65535)===0)return;
 const pDq=racer(c,primary,0x2ec),sDq=racer(c,secondary,0x2ec);
 if(pDq!==0&&sDq!==0){source(c,'result6f0',3,2);call(c,'802c7394');write(c,'hudWords7788',0x8aa8,3);}
 else if(pDq!==0){source(c,'result6f0',1,2);addWin(c,true);write(c,'hudWords7788',0x8aa8,2);}
 else if(sDq!==0){source(c,'result6f0',2,2);addWin(c,false);write(c,'hudWords7788',0x8aa8,1);}
 const result=s(c,'result6f0',-32768,32767);if(result===1||result===2)call(c,'802c6dcc');
}
function nextCup(c){
 if(profile(c,0xb330)===0){
  source(c,'participantCount60e',4,2);const current=round(c);
  for(let i=0;i<4;i++)write(c,'profileWordsB330',0xb350+current*16+i*4,0);
  write(c,'profileWordsB330',0xb334,(current+1)|0);
 }else{
  source(c,'restart6f8',1);write(c,'profileWordsB330',0xb334,0);
  if(profile(c,0xb338)===0)write(c,'profileWordsB330',0xb334,1);
 }
 call(c,'801eb91c');call(c,'800ad3c4');
}
function dispatch(c){
 if(s(c,'initLatch63c')!==0){
  source(c,'initLatch63c',0);if(s(c,'gameStateAb24')===40){call(c,'80093c44');return null;}
 }
 let head=call(c,'8009328c',[],true);
 if(s(c,'activity624',-32768,32767)===-1)head=call(c,'801e5554',[head],true);
 const players=s(c,'players',1,2);if(players===2)head=call(c,'802c6b38',[head],true);
 if(s(c,'courseIndex')===0&&s(c,'mode608')===4&&s(c,'specialAb64',-32768,32767)===0)head=call(c,'802c6bd8',[head],true);
 c.operations.push({kind:'presentationWordWrite',address:head,width:4,value:0x06000000},
  {kind:'presentationWordWrite',address:(head+4)>>>0,width:4,value:players===1?0x0106f168:0x0106f1b8});
 const nextHead=(head+8)>>>0,game=s(c,'gameStateAb24');
 if(game===40){call(c,'801de3cc');status(c);}
 else if(game===41)call(c,'802c63b4');
 else if(game===42)call(c,'802c6550');
 else if(game===44)call(c,'802c6b00');
 else if(game===43&&hudHalfword(c,0x8a16)===1){
  source(c,'activity624',-1,2);source(c,'event628',0,2);
  const selector=(s(c,'returnState630')-2)>>>0;
  if(selector<39){
   const target=bits(c,'i1Words9440',0x959c+selector*4);
   const consumer={0x802c5ce0:'801eb180',0x802c5cf8:'8009345c',0x802c5d10:'801ebd28',0x802c5d28:'801ebfe4'}[target];
   if(consumer){call(c,consumer);call(c,'800ad3c4');}
   else if(target===0x802c5d40)nextCup(c);
   else if(target!==0x802c5de0)throw new RangeError('Unsupported retained i1 dispatch target');
  }
 }
 return nextHead;
}

/** Complete587C numeric initializer. Call only at the actual source update
 * site: initLatch63c!=0 and gameStateAb24==40. It clears counter9440, uses the
 * pending mode608, conditionally copies nine caller-owned i1 setup words and
 * selects last-round96cc from the loaded three-class table. It does not clear
 * initLatch63c; the later display dispatcher owns that write. Profile difficulty
 * is theB338 word, with source Reverse selection owned separately by the caller.
 */
export function prepareNativeRacePrestartInitialization(value){const c=context(value);initialize(c);return freeze({operations:c.operations});}

/** Complete5DF4 numeric status consumer through63B4. Counters use signed32
 * wrap; the ten/fifty/forty-six-call delays are source calls, not milliseconds.
 * Source phase650 remains distinct from simulation648. Records are read only
 * from the canonical race span: finish2c2c, DQ2c24, place293c and time2ad4.
 * All profile/scene/HUD patches retain source width and order. The small award
 * rules come from800EABB0/800EABBC, not a browser scoring estimate.
 *
 * externalCall recipes6dcc/6fe0/7394 are REQUIRED source stage transitions,
 * not already executed cosmetic events. Their internal scene/audio/HUD writes
 * remain outside this leaf. No external callback runs during preparation.
 */
export function prepareNativeRacePrestartStatus(value){const c=context(value);status(c);return freeze({operations:c.operations});}

/** Complete5AE4 dispatcher, expanding5DF4 once when selected. Each consumed
 * source presentation return is supplied as externalReturns[consumer]: an
 * actual unsigned word-aligned GPU head. Returned presentationWordWrite
 * operations target that separate caller-owned memory; they do not mutate any
 * canonical state span. Other original callees remain ordered externalCall
 * recipes. displayListHead is null on the93c44 initialization early return.
 *
 * i1Words9440[168] is802C9440..96E0; profileWordsB330[50 or52] is801CB330
 * through B3F8 or B400,
 * end exclusive. HUD[1442] and race[1693] share the existing canonical owners.
 * Inputs are branch-lazy, copied and never mutated. The original CPU update
 * (including79528/F03E0) precedes this display-stage call; a renderer must not
 * invoke it additionally to interpolate frames. Other overlay identities and
 * helper internals are not reconstructed here.
 */
export function prepareNativeRacePrestartStage(value){const c=context(value),displayListHead=dispatch(c);return freeze({operations:c.operations,displayListHead});}

/** Actual5AE4 dispatch with6B38 timing and result initialization/update bodies executed at
 * their call sites against the same local owners. A newly selected result
 * state is NOT dispatched again during this call. Graphics-head returns and
 * menu/audio/persistence consumers retain their explicit boundary contract.
 * Transition expansion is opt-in and requires reached retained templates. */
export function prepareNativeRaceResultDisplay(value){
 if(value?.expandTransitions!==undefined&&typeof value.expandTransitions!=='boolean')throw new TypeError('expandTransitions must be boolean');
 const c=context(value);c.expandResults=true;
 const displayListHead=dispatch(c);return freeze({operations:c.operations,displayListHead});
}

/** Complete numeric result-entry bodies6DCC/6FE0/7394. These execute once at
 * the status consumer's selected call site, before subsequent HUD writes.
 * Audio calls remain ordered external recipes. expandWidgets/expandTransitions
 * execute numeric HUD-slot/fade initialization with explicit templates. The
 * following result UPDATE bodies63B4/6550/6B00 are separate dependencies.
 * field704..714 and field62a are actual external scene addresses; B3F8 flags
 * share the extended profile owner. bodyResultCode16c8BySlot supplies actual
 * body words only on the solo-finish branch; it is not a second body owner.
 */
export function prepareNativeRaceResultInitialization(value,consumer){
 if(!['802c6dcc','802c6fe0','802c7394'].includes(consumer))throw new RangeError('Unknown source result initializer');
 const c=context(value);initializeResult(c,consumer);return freeze({operations:c.operations});
}
function initializeResult(c,consumer){
 const finish=consumer==='802c6fe0',tie=consumer==='802c7394';
 source(c,'previousGameState634',s(c,'gameStateAb24'));
 source(c,'returnState630',0);source(c,'gameStateAb24',tie?44:finish?42:41);
 source(c,'main638',1);source(c,'initLatch63c',1);source(c,'field640',0);source(c,'field644',0);
 source(c,'fieldAb1c',0);source(c,'field461c',3);
 if(!tie){
  if(finish)write(c,'i1Words9440',0x9500,0);
  else{write(c,'i1Words9440',0x96a4,0);write(c,'i1Words9440',0x96a0,0);}
  if(s(c,'mode608')===4){
   if(span(c,'profileWordsB330').length!==52)throw new RangeError('Result rider flags require extended profileWordsB330');
   for(let i=0;i<4;i++){
    const flag=Number(s(c,['field708','field70c','field710','field714'][i])>=racer(c,i,4));
    c.operations.push({kind:'profileWrite',byteOffset:0xb3f8-0xb330+i*2,width:2,value:flag});
   }
  }
 }
 if(tie)call(c,'801e6fb0',[1,4,100]);
 else if(finish){
  if(s(c,'players',1,2)===1){
   const code=integer(c.value.bodyResultCode16c8BySlot?.[selected(c)],'actual body result code16c8');
   const duration=({1:130,2:140,3:100,4:120,5:110})[code]??100;
   write(c,'i1Words9440',0x9504,duration);
   if(s(c,'mode620')===11)call(c,'801e6fb0',[1,4,duration]);
   write(c,'i1Words9440',0x9508,0);
  }else call(c,'801e6fb0',[1,4,100]);
 }else if(s(c,'players',1,2)===1){
  if(word(c,'i1Words9440',0x9510)!==0)write(c,'i1Words9440',0x950c,120);
  else call(c,'801e6fb0',[1,4,120]);
 }
 call(c,'801e6a4c',[0,0]);
 if(!tie&&s(c,'players',1,2)===1){
  if(finish)call(c,'801e6a4c',[1,1]);
  else call(c,'801e6a4c',[4,Number(racer(c,selected(c),0x2ec)===2)]);
 }
 source(c,'field62a',0,2);
 if(!finish){
  if(!tie){call(c,'800bfd34');call(c,'800bfd68');}
  call(c,'800c1f60',[4]);call(c,'800c21f4',[4,0]);
  if(tie){call(c,'800bfd34');call(c,'800bfd68');}
 }else{
  const mode=s(c,'mode608');
  if(mode!==11){
   call(c,'800c1f60',[6]);let choice;
   if(mode===0)choice=word(c,'raceWords1f94',0x2650)===1?0:1;
   else if(mode===1){const result=s(c,'result6f0',-32768,32767);choice=result===3?0:result===1?2:1;}
   else{const place=racer(c,selected(c),4);choice=s(c,'field704')>=place?(place+1)|0:5;}
   call(c,'800c21f4',[6,choice]);
  }
  call(c,'800bfd34');call(c,'800bfd68');
 }
}

function byte(c,key,address){
 const offset=integer(address-SPANS[key][0],`${key} byte offset`,0,span(c,key).length*4-1);
 return (span(c,key)[offset>>>2]>>>(24-(offset&3)*8))&255;
}
function writeByte(c,key,address,value){
 const offset=integer(address-SPANS[key][0],`${key} byte offset`,0,span(c,key).length*4-1),shift=24-(offset&3)*8;
 const bits=integer(value,'source byte',0,255),kind=key==='raceWords1f94'?'raceByteWrite':'saveByteWrite';
 span(c,key)[offset>>>2]=((span(c,key)[offset>>>2]&~(255<<shift))|(bits<<shift))>>>0;
 c.operations.push({kind,byteOffset:offset,width:1,value:bits});
}
function recordName(c,address){
 // The retained B280..B308 owner contains these source bytes. This validates
 // the actual byte addresses; it does not invent a selectable-profile count.
 const from=0xb298+s(c,'nameIndexA9b0',0)*14;
 for(let i=0;i<3;i++)writeByte(c,'raceWords1f94',address+i,byte(c,'saveWordsB280',from+i));
 writeByte(c,'raceWords1f94',address+3,0);
}
function timedRecordNames(c){
 const place=word(c,'raceWords1f94',0x2650);
 if(place!==0){const course=s(c,'courseIndex');
  recordName(c,s(c,'reverseDab68',0,65535)!==0?0x23b0+course*20+16:0x1ff0+course*60+place*20-4);}
 const lap=word(c,'raceWords1f94',0x2654);
 if(lap!==0)recordName(c,0x22c0+s(c,'courseIndex')*20+16);
 return place!==0||lap!==0;
}
function persistTimedRecord(c){call(c,s(c,'reverseDab68',0,65535)!==0?'8007c204':'8007bea4',[s(c,'courseIndex')]);}

/** Entire numeric63B4/6550/6B00 result updates. Retained saveWordsB280[34]
 * covers801CB280..B308 exclusively and never aliases profileWordsB330.
 * Record-name stores remain individual big-endian byte operations. The source
 * result timer runs once per source display/update call, not per render frame.
 * Default calls remain ordered dependencies. expandTransitions:true executes
 * numeric7570, the fade property setter and its reached slot reset inline,
 * using explicit retained templates BEFORE later caller HUD predicates.
 * 77F5C, storage, other fade branches and menu callees remain dependencies;
 * these recipes are not proof that persistence or the outer schedule ran.
 */
export function prepareNativeRaceResultUpdate(value,consumer){
 if(!['802c63b4','802c6550','802c6b00'].includes(consumer))throw new RangeError('Unknown source result update');
 if(value.expandTransitions!==undefined&&typeof value.expandTransitions!=='boolean')throw new TypeError('expandTransitions must be boolean');
 const c=context(value);updateResult(c,consumer);return freeze({operations:c.operations});
}
function updateResult(c,consumer){
 if(consumer==='802c6b00'){
  if(hudHalfword(c,0x8a16)===1){call(c,'800ad3c4');call(c,'801ece50');}
 }else if(consumer==='802c63b4'){
  if(s(c,'players',1,2)===1){
   if(word(c,'i1Words9440',0x9510)!==0){
    let delay=word(c,'i1Words9440',0x950c);
    if(delay>0){delay=(delay-1)|0;write(c,'i1Words9440',0x950c,delay);}
    if(delay===0)call(c,'802c7570',[102]);
   }
  }else if(word(c,'i1Words9440',0x96a0)===1){write(c,'i1Words9440',0x96a0,2);call(c,'801e6fb0',[1,4,0]);}
  if(hudHalfword(c,0x8a16)===1){
   if(s(c,'players',1,2)===1){
    const mode=s(c,'mode608');
    if(mode===4){
     if(profile(c,0xb330)===0){
      source(c,'participantCount60e',4,2);const current=round(c);
      for(let i=0;i<4;i++)write(c,'profileWordsB330',0xb350+current*16+i*4,0);
      write(c,'profileWordsB330',0xb334,(current+1)|0);call(c,'801eb91c');
     }else{call(c,'80077f5c');call(c,'801ec0d4');}
    }else call(c,mode===0||mode===11?'801ec830':'801eb180');
   }else call(c,'801ece50');
   call(c,'800ad3c4');
  }
 }else{
  const mode=s(c,'mode608');
  if((mode===0||mode===4)&&word(c,'i1Words9440',0x9500)===0){
   let delay=(word(c,'i1Words9440',0x9504)-1)|0;write(c,'i1Words9440',0x9504,delay);
   if(delay<0){delay=0;write(c,'i1Words9440',0x9504,0);}
   if(delay===0){
    if(word(c,'i1Words9440',0x9510)!==0)call(c,'802c7570',[102]);
    else{
     const wait=word(c,'i1Words9440',0x9508);if(wait<1200)write(c,'i1Words9440',0x9508,(wait+1)|0);
     if((s(c,'pressed65a',0,65535)&0xb000)!==0||word(c,'i1Words9440',0x9508)===1200){
      write(c,'i1Words9440',0x9500,1);call(c,'801e6fb0',[1,4,0]);
     }
    }
   }
  }
  if(hudHalfword(c,0x8a16)===1){
   call(c,'800ad3c4');
   if(mode===4&&profile(c,0xb330)===0){source(c,'participantCount60e',4,2);call(c,'801eb91c');}
   else if(mode===0||mode===4){
    const record=timedRecordNames(c);
    if(mode===4)call(c,'80077f5c');
    //77F5C changes unfinished-racer estimates/places and1FD4/26C0, not2650/2654.
    if(record)persistTimedRecord(c);
    call(c,mode===4?'801ec0d4':record?'801ec9c8':'801ec20c');
   }else if(mode===11){
    const place=word(c,'raceWords1f94',0x2928);
    if(place!==0){recordName(c,0x26e8+s(c,'courseIndex')*48+place*16-4);call(c,'8007c0b8',[s(c,'courseIndex')]);}
    if(word(c,'raceWords1f94',0x2930)!==0&&s(c,'unlockAb60',-32768,32767)===0){
     const old=byte(c,'saveWordsB280',0xb280);source(c,'unlockAb60',1,2);
     writeByte(c,'saveWordsB280',0xb280,old|0x10);call(c,'8007c494');
    }
    call(c,'801ecf18');
   }else call(c,'801ece50');
  }
 }
}
