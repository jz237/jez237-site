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
