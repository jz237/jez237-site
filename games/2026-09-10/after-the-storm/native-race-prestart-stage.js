// Reconstructed original prestart numeric consumers. These are source-frame
// calls, not presentation-frame updates. Storage and initialization remain
// caller-owned; opaque source callees are returned as ordered dependencies.
const MIN=-2147483648,MAX=2147483647;
const SPANS={i1Words9440:[0x9440,168,'i1Write'],hudWords7788:[0x7788,1442,'hudWrite'],
 profileWordsB330:[0xb330,50,'profileWrite'],raceWords1f94:[0x1f94,1693,null]};
const POINTS=[7,4,2,1,0,0];
const REQUIRED_POINTS=[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]];
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function context(value){record(value,'prestart source sample');record(value.scene,'prestart scene');
 if(value.profileWordsB330!==undefined&&Object.hasOwn(value.scene,'difficulty'))throw new RangeError('scene.difficulty overlaps profileWordsB330');
 return {value,scene:{...value.scene},spans:{},operations:[]};}
function span(c,key){
 if(!c.spans[key]){const n=SPANS[key][1],v=c.value[key];
  if(!Array.isArray(v)||v.length!==n)throw new RangeError(`${key} requires${n} retained unsigned words`);
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
 * i1Words9440[168] is802C9440..96E0; profileWordsB330[50] is801CB330..B3F8,
 * end exclusive. HUD[1442] and race[1693] share the existing canonical owners.
 * Inputs are branch-lazy, copied and never mutated. The original CPU update
 * (including79528/F03E0) precedes this display-stage call; a renderer must not
 * invoke it additionally to interpolate frames. Other overlay identities and
 * helper internals are not reconstructed here.
 */
export function prepareNativeRacePrestartStage(value){const c=context(value),displayListHead=dispatch(c);return freeze({operations:c.operations,displayListHead});}
