// Independent numeric resource preparation. All descriptor/presentation data
// is supplied; no original tables, assets, transfer or decompression is here.
const U32=0xffffffff,MIN=-2147483648,MAX=2147483647;
const sizes={resourceWordsB330:20,resourceWordsB538:8,resourceWordsE73c:43,hudWords7788:1442};
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function array(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} entries`);return v;}
function words(v,n,count){return Array.from(array(v,n,count),(x,i)=>integer(x,`${n}[${i}]`,0,U32));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function context(value,keys){
 record(value,'retained resource owners');const owners={};for(const key of keys){
  let count=sizes[key];if(key==='resourceWordsB330'){count=value[key]?.length;if(count!==20&&count!==36)throw new RangeError('resourceWordsB330 requires20 or36 words');}
  owners[key]=words(value[key],key,count);
 }
 return {owners,operations:[]};
}
function write(c,owner,byteOffset,width,value){
 const bits=width===2?value&65535:value>>>0,words=c.owners[owner];
 if(!words||![2,4].includes(width)||byteOffset%width||byteOffset<0||byteOffset+width>words.length*4)throw new RangeError('Invalid resource write');
 c.operations.push(owner==='hudWords7788'?{kind:'hudWrite',byteOffset,width,value:bits}:{kind:'resourceWrite',owner,byteOffset,width,value:bits});
 const i=byteOffset>>>2;if(width===4)words[i]=bits;
 else{const shift=byteOffset&2?0:16;words[i]=((words[i]&~(65535<<shift))|(bits<<shift))>>>0;}
}
function tableRow(v,n,index,count,width){return array(array(v,n,count)[index],`${n}[${index}]`,width);}

/** Full bounded96960 kinds0..4. Input is {kind,avatarIndices:[signed32 x4]}.
 * Negative source arguments clamp to0; positive IDs must0..7. Logical IDs and
 * descriptor indices differ: slot variant flags add8 only for the descriptor
 * template, never for the presentation lookup row. Kind1 reads only the first
 * two supplied IDs. Kind3 requires IDs0..3 after negative clamping, repeats
 * them with4 added for slots4..7, and keeps all eight logical identities.
 *
 * Retained owners are resourceWordsB330[20|36],resourceWordsE73c[43], and existing
 * hudWords7788[1442], all dense rawu32. These do not overlap profile801CB330.
 * Readonly sourceViews: riderDescriptorRowsABD0[16][4],
 * avatarLookupWordsACD0[8][51] (three17-word blocks per logical ID), and the
 * selected mode0BaseWordsAB90[4], mode2BaseWordsABA0[4], or
 * mode4BaseWordsABC0[4], all rawu32. Kind3 requires36 retained descriptor
 * words and mode2BaseWordsABA0[8], whose tail is the adjacent ABC0 bank.
 * Kind1 reads only the first two AB90 bases and retains the unused owner tail.
 * Kind2 uses four leading presentation
 * parts and unshifted descriptors; special selectors retain physical slots.
 * Unselected rows/parts and the other base bank are not read.
 *
 * Returns ordered resourceWrite{owner,byteOffset,width:2|4,value} and hudWrite
 * operations. Duplicate stores, partial flags, last matching special selectors
 * and modulo32 relocations remain explicit. No load, queue, RNG, body/pose or
 * physical initialization runs; later95050 post-load fixups are separate.
 */
export function prepareNativeRaceRiderResourceConfiguration(value,input,sourceViews={}){
 record(input,'rider resource arguments');record(sourceViews,'resource source views');const kind=integer(input.kind,'resource kind');
 if(kind<0||kind>4)throw new RangeError('Only resource kinds0..4 are reconstructed');
 const descriptorCount=kind===1?2:kind===3?8:4,sourceCount=kind===1?2:4,inputIds=input.avatarIndices;
 if(!Array.isArray(inputIds)||(kind===1?![2,4].includes(inputIds.length):inputIds.length!==4))throw new RangeError('Invalid avatarIndices length');
 const selectedIds=Array.from({length:sourceCount},(_,i)=>{const x=inputIds[i];
  const v=integer(x,`avatarIndices[${i}]`);return v<0?0:integer(v,`avatarIndices[${i}]`,0,kind===3?3:7);
 });
 const avatars=Array.from({length:descriptorCount},(_,i)=>selectedIds[i%4]+(i>=4?4:0));
 const c=context(value,['resourceWordsB330','resourceWordsE73c','hudWords7788']);
 if(kind===3&&c.owners.resourceWordsB330.length!==36)throw new RangeError('Kind3 requires36 retained descriptor words');
 const selected=kind===0||kind===1?'mode0BaseWordsAB90':kind===2||kind===3?'mode2BaseWordsABA0':'mode4BaseWordsABC0',sourceBases=sourceViews[selected];
 if(!Array.isArray(sourceBases)||!(kind===1?[2,4]:kind===2?[4,8]:[descriptorCount]).includes(sourceBases.length))throw new RangeError(`Invalid ${selected} length`);
 const bases=Array.from({length:descriptorCount},(_,i)=>integer(sourceBases[i],`${selected}[${i}]`,0,U32));
 const selector=(offset,width,value)=>write(c,'resourceWordsE73c',offset,width,value);
 for(let slot=0;slot<8;slot++)selector(6+slot*4,2,1);
 selector(0x28,4,U32);selector(0x24,4,U32);selector(0,4,kind);
 if(kind===2||kind===3){for(let slot=0;slot<descriptorCount;slot++)selector(6+slot*4,2,0);}
 else{if(kind===1||kind===4)selector(10,2,0);selector(6,2,0);}
 for(let slot=0;slot<descriptorCount;slot++){
  const id=avatars[slot];selector(4+slot*4,2,id);
  const templateIndex=id+((kind===0&&slot>=1)||(kind===4&&slot>=2)?8:0),row=words(tableRow(sourceViews.riderDescriptorRowsABD0,
   'riderDescriptorRowsABD0',templateIndex,16,4),'selected rider descriptor',4),offset=slot*16;
  write(c,'resourceWordsB330',offset,4,row[0]);write(c,'resourceWordsB330',offset+4,4,row[1]);
  write(c,'resourceWordsB330',offset+8,4,row[2]);write(c,'resourceWordsB330',offset+8,4,4);
  write(c,'resourceWordsB330',offset+12,4,row[3]);write(c,'resourceWordsB330',offset+12,4,bases[slot]);
 }
 for(let j=0;j<4;j++)write(c,'resourceWordsB330',descriptorCount*16+j*4,4,0);
 const blocks=kind===0?[[0,0],[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]]:kind===4?[[0,0],[1,0],[2,1],[3,1],[2,2],[3,2]]:Array.from({length:descriptorCount},(_,i)=>[i,0]),start=0x7a60-0x7788;
 for(let block=0;block<blocks.length;block++){
  const [slot,part]=blocks[block],id=avatars[slot],row=tableRow(sourceViews.avatarLookupWordsACD0,'avatarLookupWordsACD0',id,8,51);
  for(let j=0;j<17;j++)write(c,'hudWords7788',start+block*68+j*4,4,integer(row[part*17+j],`source lookup[${id}][${part*17+j}]`,0,U32));
 }
 for(let slot=0;slot<(kind===4?2:descriptorCount);slot++){
  const id=avatars[slot];if(id===2||id===6)selector(id===2?0x24:0x28,4,kind===0?(slot===0?0:slot*2-1):slot);
 }
 for(let block=0;block<blocks.length;block++){
  const [slot]=blocks[block],id=avatars[slot],offset=start+block*68;
  for(let j=0;j<(id===2||id===6?17:12);j++)write(c,'hudWords7788',offset+j*4,4,(c.owners.hudWords7788[(offset+j*4)/4]+bases[slot])>>>0);
 }
 return freeze({operations:c.operations,diagnostic:{scope:'bounded96960-kinds0-4',kind,logicalAvatarIndices:avatars,
  presentationBlockCount:blocks.length,descriptorCount,loaderExecuted:false,queueCalls:0,rngCalls:0,physicalInitialization:false}});
}

/** Complete9684C numeric preparation for {baseWord:rawu32,
 * resourceIndices:[-1|0..8,-1|0..8]}. Retained owners resourceWordsB538[8] and
 * resourceWordsE73c[43] are disjoint rawu32 spans. SourceViews supplies
 * courseDescriptorRowsB4a8[9][4] and courseByteLengthWordsCE18[9] rawu32;
 * sentinel entries read neither table, and two sentinels need no sourceViews.
 *
 * A sentinel zeros descriptor words2/3 while retaining0/1. Present entries
 * copy all four template words, then overwrite word3 with cursor's low24 bits;
 * the pair record retains its full32 bits. Cursor advance wraps before64-byte
 * alignment. Equal indices write slot-map0 then1 in source order. finalCursorWord
 * is transient provenance, not a new canonical state or a consumed main return.
 * No transfer, decompression, loading or later resource parser is executed.
 */
export function prepareNativeRaceCourseResourceConfiguration(value,input,sourceViews={}){
 record(input,'course resource arguments');record(sourceViews,'resource source views');
 let cursor=integer(input.baseWord,'baseWord',0,U32);const indices=Array.from(array(input.resourceIndices,'resourceIndices',2),(x,i)=>integer(x,`resourceIndices[${i}]`,-1,8));
 const c=context(value,['resourceWordsB538','resourceWordsE73c']);let present=0;
 for(let slot=0;slot<2;slot++){
  const index=indices[slot],offset=slot*16;
  if(index!==-1)write(c,'resourceWordsE73c',0x2c+index*2,2,slot);
  write(c,'resourceWordsE73c',0x9c+slot*8,4,index);write(c,'resourceWordsE73c',0xa0+slot*8,4,cursor);
  if(index===-1){write(c,'resourceWordsB538',offset+8,4,0);write(c,'resourceWordsB538',offset+12,4,0);continue;}
  const row=words(tableRow(sourceViews.courseDescriptorRowsB4a8,'courseDescriptorRowsB4a8',index,9,4),'selected course descriptor',4);
  for(let j=0;j<4;j++)write(c,'resourceWordsB538',offset+j*4,4,row[j]);
  write(c,'resourceWordsB538',offset+12,4,cursor&0xffffff);
  const bytes=integer(array(sourceViews.courseByteLengthWordsCE18,'courseByteLengthWordsCE18',9)[index],`courseByteLengthWordsCE18[${index}]`,0,U32);
  cursor=((cursor+bytes+63)>>>0)&0xffffffc0;cursor>>>=0;present++;
 }
 return freeze({operations:c.operations,diagnostic:{scope:'bounded9684c',finalCursorWord:cursor,presentDescriptors:present,
  loaderExecuted:false,queueCalls:0,rngCalls:0,physicalInitialization:false}});
}
