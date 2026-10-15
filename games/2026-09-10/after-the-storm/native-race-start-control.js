// Reconstructed numeric launch consumer. HUD storage is caller-owned raw
// words80227788..80228e10; record writes address the existing222-word slots.
// The caller retains phase ownership and the outer ordinary-race call gates.
const HUD_BASE=0x80227788,HUD_WORDS=1442;
const ADDRESS={charge:0x80228a90,latches:0x80228b58,stage:0x80228d08,offset:0x80228d0c,limit:0x80228d10};
function integer(value,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid ${name}`);return value||0;
}
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}

/** Execute one originalF03E0 call; no elapsed-time interpolation or initial
 * countdown/retraction state is supplied by this leaf. input.phase650 is an
 * actual signed source word. input.activity624 is signed16 and read only by
 * the post-countdown retraction branch. racerCount0..4 and unsigned16
 * pressedButtonsB58BySlot are needed only inside the source's launch window.
 * PressedB58 is the already-produced edge word, not heldB50 or workingB56.
 *
 * Returns only ordered partial operations. HUD offsets are bytes from7788;
 * width4 values are unsigned word bits, width1 values are bytes. Record word
 * indices are relative to canonical2938/stride378, never separate power or
 * timing owners. sourceWordWrite fields name actual source650/817c; the host
 * performs any frontend field-name conversion. Audio operations preserve raw
 * 32-bit register arguments to800c37f4; its queue/playback remains external.
 * All own arithmetic here is signed32 integer arithmetic, including abs wrap.
 * The function does not itself enforce the enclosing79528 caller eligibility.
 */
export function prepareNativeRaceStartControl(hudWords7788,input){
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==HUD_WORDS)throw new RangeError('hudWords7788 requires1442 unsigned words');
 const hud=Array.from(hudWords7788,v=>integer(v,'HUD word',0,0xffffffff));
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Expected actual source start-control inputs');
 const phase=integer(input.phase650,'phase650'),operations=[];
 const word=address=>hud[(address-HUD_BASE)/4]|0;
 const writeWord=(address,value)=>{
  const bits=value>>>0;hud[(address-HUD_BASE)/4]=bits;operations.push({kind:'hudWrite',byteOffset:address-HUD_BASE,width:4,value:bits});
 };
 const byte=address=>{
  const offset=address-HUD_BASE,n=(hud[offset>>>2]>>>(24-(offset&3)*8))&255;return n>=128?n-256:n;
 };
 const writeByte=(address,value)=>{
  const offset=address-HUD_BASE,shift=24-(offset&3)*8,index=offset>>>2;
  hud[index]=((hud[index]&~(255<<shift))|(value<<shift))>>>0;
  operations.push({kind:'hudWrite',byteOffset:offset,width:1,value});
 };
 const source=(field,value)=>operations.push({kind:'sourceWordWrite',field,value:value>>>0});
 const record=(racerIndex,wordIndex,value)=>operations.push({kind:'recordWordWrite',racerIndex,wordIndex,value:value>>>0});
 const audio=(a0,a1)=>operations.push({kind:'audioEntry',consumer:'800c37f4',arguments:[a0>>>0,a1>>>0]});
 const stage=word(ADDRESS.stage);
 if(phase===1||phase===2){
  if(stage===0){
   const next=(word(ADDRESS.offset)-3)|0;writeWord(ADDRESS.offset,next);
   if(next<=0){writeWord(ADDRESS.offset,0);writeWord(ADDRESS.stage,1);}
  }else{
   let charge=word(ADDRESS.charge);
   if(charge%15===0)audio(phase===2?0x23:0x22,phase===2?0:(Math.trunc(charge/15)-1)|0);
   // The original reload follows the external audio entry. No playback or
   // arbitrary callbacks execute inside this pure preparation function.
   charge=word(ADDRESS.charge);
   const delta=(charge-15)|0,distance=delta<0?(-delta)|0:delta;
   if(distance<15){
    const count=integer(input.racerCount,'racerCount',0,4),pressed=input.pressedButtonsB58BySlot;
    if(count>0&&(!Array.isArray(pressed)||pressed.length<count||pressed.length>4))throw new RangeError('Provide the active pressedB58 source slots');
    for(let i=0;i<count;i++){
     const edge=integer(pressed[i],'pressedButtonsB58',0,65535);
     if((edge&0xa000)===0||byte(ADDRESS.latches+i)!==0)continue;
     // INT_MIN remains negative through source negu, taking the <=0 power5
     // branch rather than turning into a large positive JS absolute value.
     if(distance<5){record(i,75,distance<=0?5:5-distance);record(i,197,1);record(i,10,1);}
     writeByte(ADDRESS.latches+i,1);
    }
   }
   const next=(charge-1)|0;writeWord(ADDRESS.charge,next);
   if(next===15){source('phase650',2);source('clockStopped817c',0);}
   else if(next<=0){source('phase650',3);writeWord(ADDRESS.stage,2);}
  }
 }else if(stage===2&&integer(input.activity624,'activity624',-32768,32767)===-1){
  const next=(word(ADDRESS.offset)+6)|0;writeWord(ADDRESS.offset,next);
  if(next>=word(ADDRESS.limit))writeWord(ADDRESS.stage,0);
 }
 return freeze({operations});
}
