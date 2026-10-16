// Post-decompression rider display-list fixups (80095CE8 and 800967EC).
// Decoded bytes and lookup tables are explicit caller data, never bundled assets.
const U32=0xffffffff;
function word(v,name){if(!Number.isInteger(v)||v<0||v>U32)throw new RangeError(`Invalid ${name}`);return v||0;}
function array(v,name,length){if(!Array.isArray(v)||v.length!==length)throw new RangeError(`Invalid ${name} length`);return v;}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function context(value){
 const input=value?.loadedAssetWords;
 if(!Array.isArray(input)||input.length===0||input.length>0x400000)throw new RangeError('A bounded decoded loadedAssetWords span is required');
 return {words:Array.from(input,(v,i)=>word(v,`loadedAssetWords[${i}]`)),operations:[],lists:[]};
}
function relocate(c,byteOffset,baseWord){
 word(byteOffset,'display-list byteOffset');word(baseWord,'display-list baseWord');
 if(byteOffset%4)throw new RangeError('Display-list words must be aligned');
 let offset=byteOffset,commands=0,writes=0;
 for(;;offset+=8){
  if(offset>=c.words.length*4)throw new RangeError('Display list has no terminator in the supplied decoded span');
  const opcode=c.words[offset/4]>>>24;
  if(opcode===0xb8)break;
  commands++;
  if(opcode!==0x04&&opcode!==0xfd)continue;
  if(offset+4>=c.words.length*4)throw new RangeError('Relocation operand is outside the supplied decoded span');
  const value=(c.words[offset/4+1]+baseWord)>>>0;
  c.operations.push({kind:'loadedAssetWrite',byteOffset:offset+4,width:4,value});
  c.words[offset/4+1]=value;writes++;
 }
 return {byteOffset,baseWord,terminatorByteOffset:offset,commands,writes};
}

/** Complete 800967EC over a caller-owned decoded word span. Only vertex (04)
 * and texture-image (FD) operands relocate, modulo32, up to the first B8.
 * Other commands, including nested-list references, remain untouched. Returns
 * ordered writes; the caller applies them to that same decoded asset owner.
 * Missing terminators reject atomically. No graphics, transfer or decode runs.
 */
export function prepareNativeDisplayListRelocation(value,input={}){
 const c=context(value),list=relocate(c,input.byteOffset,input.baseWord);
 return freeze({operations:c.operations,diagnostic:{scope:'800967ec',...list,rendered:false}});
}

/** Bounded complete 80095CE8 with its 800967EC callee expanded in order.
 * resourceWordsE73c is the existing 43-word canonical selector owner. Its slot
 * record contains logical avatar ID in the high half and variant in the low
 * half. Initializer-produced variants0/1 select part0 or parts1+2 respectively.
 * Readonly avatarLookupWordsACD0[8][51] and the selected AB90/ABA0/ABC0 base
 * bank use the same shape as native-race-resource-configuration.js. Kind3
 * admits eight slots; kinds0/2/4 four, kind1 two. Other retained combinations
 * are deliberately outside this initializer-produced contract.
 *
 * loadedAssetWords starts at the decompressed address passed to95CE8. Lookup
 * pointers use their low24-bit offset into it. The memory span must be distinct
 * from selectors and readonly lookup/base banks. Repeated/overlapping lists
 * execute again against earlier writes; they are never deduplicated. Original
 * display-list data is neither required by this module nor provided by it.
 */
export function prepareNativeRiderResourceRelocation(value,input={},sourceViews={}){
 const selectors=Array.from(array(value?.resourceWordsE73c,'resourceWordsE73c',43),(v,i)=>word(v,`resourceWordsE73c[${i}]`));
 const kind=selectors[0];if(kind>4)throw new RangeError('Only resource kinds0..4 are reconstructed');
 const count=kind===3?8:kind===1?2:4,slot=input.slot;
 if(!Number.isInteger(slot)||slot<0||slot>=count)throw new RangeError('Invalid rider resource slot');
 const record=selectors[slot+1],avatar=record>>>16,variant=record&65535;
 if(avatar>7||variant>1)throw new RangeError('Unsupported retained avatar or variant');
 const row=array(array(sourceViews.avatarLookupWordsACD0,'avatarLookupWordsACD0',8)[avatar],'selected avatar lookup',51);
 const bankName=kind===2||kind===3?'mode2BaseWordsABA0':kind===4?'mode4BaseWordsABC0':'mode0BaseWordsAB90';
 const bank=sourceViews[bankName],allowed=kind===1?[2,4]:kind===2?[4,8]:[count];
 if(!Array.isArray(bank)||!allowed.includes(bank.length))throw new RangeError(`Invalid ${bankName} length`);
 const baseWord=word(bank[slot],`${bankName}[${slot}]`),c=context(value);
 for(let part=variant;part<(variant===0?1:3);part++){
  for(let index=0;index<17;index++){
   const offset=word(row[part*17+index],`selected avatar lookup[${part*17+index}]`)&0xffffff;
   if(index>=12&&avatar!==2&&avatar!==6)continue;
   c.lists.push({part,index,...relocate(c,offset,baseWord)});
  }
 }
 return freeze({operations:c.operations,diagnostic:{scope:'bounded80095ce8-with800967ec',slot,kind,avatar,variant,
  lists:c.lists,loaderExecuted:false,decompressionPerformed:false,rendered:false}});
}
