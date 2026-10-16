// Numeric fade initialization. Templates are explicit caller-owned raw words;
// no original art, template image, animation timing or rendering is embedded.
const MIN=-2147483648,MAX=2147483647,HUD=0x7788;
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const store=(operations,address,width,value)=>operations.push({kind:'hudWrite',byteOffset:address-HUD,width,value:width===2?value&65535:value>>>0});

/** Complete1E6FB0 numeric property setter. All nine retained template words
 * copy first. Only source types1..7 reach the rate/selector reads; other signed
 * words retain that copy without a guessed fallback. Types4/6 both install
 * kind4, but only6 first clears the template's8A30 halfword. Halfword stores
 * preserve neighboring fields and exact order, including the reverse channel
 * order for types3/7. rate/selector are signed32 source words truncated to16
 * bits at their actual stores. This does not advance or draw any fade.
 */
export function prepareNativeRaceFadePropertiesInitialization(value){
 record(value,'fade property initialization');const template=words(value.fadeTemplateWords6cc0,'fadeTemplateWords6cc0',9),operations=[];
 for(let i=0;i<9;i++)store(operations,0x8a10+i*4,4,template[i]);
 const type=integer(value.type,'fade type');
 if(type<1||type>7)return freeze({operations,diagnostic:{sourceType:type,propertiesSet:false}});
 const rate=integer(value.rate,'fade rate'),selector=integer(value.selector,'fade selector'),write=(a,v)=>store(operations,a,2,v);
 if(type===6)write(0x8a30,0);
 const kind=type===6?4:type;
 write(0x8a10,kind);write(0x8a12,0);write(0x8a1a,selector);write(0x8a1c,rate);
 if(type===4||type===5||type===6){
  write(0x8a1e,1);write(0x8a28,type===5?-265:70);write(0x8a2a,65);write(0x8a32,1);
 }else{
  write(0x8a1e,0);
  if(type===3||type===7){write(0x8a24,255);write(0x8a22,255);write(0x8a20,255);}
  else{write(0x8a20,0);write(0x8a22,0);write(0x8a24,0);}
  write(0x8a26,type===2||type===7?255:0);
 }
 return freeze({operations,diagnostic:{sourceType:type,propertiesSet:true}});
}

/** The full reached1E6A4C(0,0) reset branch copies one explicit11-word template
 * into each of five44-byte HUD slots, in source slot/word order. The other
 * allocation/update branches of that source entry are outside this reset API.
 * No HUD read, implicit zero template, persistent second owner or draw occurs.
 */
export function prepareNativeRaceFadeSlotsReset(value){
 record(value,'fade slot reset');const template=words(value.slotTemplateWords6c50,'slotTemplateWords6c50',11),operations=[];
 for(let slot=0;slot<5;slot++)for(let word=0;word<11;word++)store(operations,0x8930+slot*44+word*4,4,template[word]);
 return freeze({operations,diagnostic:{slotsReset:5}});
}


/** Complete1E6A4C slot initialization, including its actual1E6F6C first-free
 * allocator. Both source arguments truncate to unsigned16 before dispatch.
 * Unknown kinds and reset-with-nonzero-selector do nothing. Allocation scans
 * only each slot's kind halfword; a full pool needs no template and writes
 * nothing. Template copies and subsequent halfword/word stores retain order.
 * These are numeric HUD slots, not drawings or a second animation owner. */
export function prepareNativeRaceFadeSlotInitialization(value){
 record(value,'fade slot initialization');
 const type=integer(value.type,'slot type')&65535,selector=integer(value.selector,'slot selector')&65535;
 if(type>4||type===0&&selector!==0)return freeze({operations:[],diagnostic:{type,selector,slot:null}});
 if(type===0){const reset=prepareNativeRaceFadeSlotsReset(value);return freeze({...reset,diagnostic:{type,selector,slot:null,slotsReset:5}});}
 const hud=words(value.hudWords7788,'hudWords7788',1442);
 let slot=0;while(slot<5&&(hud[(0x8930+slot*44-HUD)/4]>>>16)!==0)slot++;
 if(slot===5)return freeze({operations:[],diagnostic:{type,selector,slot:null,full:true}});
 const template=words(value.slotTemplateWords6c50,'slotTemplateWords6c50',11),operations=[],base=0x8930+slot*44;
 const put=(offset,width,v)=>store(operations,base+offset,width,v);
 template.forEach((w,i)=>put(i*4,4,w));put(4,2,slot);put(0,2,type);
 if(type===1){put(2,2,0);put(8,4,80);put(12,4,93);put(24,4,0);}
 else if(type===2){put(2,2,0);put(8,4,selector===0?120:58);put(12,4,93);put(40,4,selector);}
 else if(type===3){
  if(selector<8){
   put(2,2,selector<2?0:1);put(8,4,selector<2?(selector===0?82:239):(selector%2===0?80:240));
   const y=selector<2?84:selector<4?101:selector<6?76:186;put(12,4,y);
   if(selector>=2)put(36,4,y);
  }
  put(32,4,255);
 }else{put(2,2,0);put(8,4,80);put(12,4,-40);put(40,4,selector);}
 return freeze({operations,diagnostic:{type,selector,slot,full:false}});
}
