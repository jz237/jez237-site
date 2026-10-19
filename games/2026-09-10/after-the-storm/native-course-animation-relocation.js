const layouts={0:[0xc1fc,8,0x18],1:[0x30ec,3,0x18],2:[0x3578,2,0x10],3:[0x2fa8,1,0x20],4:[0xd9c,1,0x10],6:[0x2c00,1,0x20],8:[0x1c58,2,0x1c]};
const word=(v,name)=>{if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError(`Invalid animation relocation ${name}`);return v;};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Complete reached 961B8/962F0/963CC/964CC/965B8 parsers, with94088
 * address resolution. Only the seven animated banks enter these routines.
 * Operates on detached loaded words and retains every ordered pointer store;
 * repeated descriptors read earlier stores rather than a cached source copy.
 */
export function prepareNativeCourseAnimationRelocation(input){
 const bank=word(input?.bankIndex,'bank index'),layout=layouts[bank];
 if(!layout)throw new RangeError('Select an animated course bank');
 const source=input.loadedAssetWords,segments=input.segmentWordsE6b0;
 if(!Array.isArray(source)||source.length===0||source.length>0x200000)throw new RangeError('Supply bounded animation loadedAssetWords');
 if(!Array.isArray(segments)||segments.length!==16)throw new RangeError('Supply animation segmentWordsE6b0[16]');
 const loadedAssetWords=Array.from(source,w=>word(w,'loaded word')),segmentWords=Array.from(segments,w=>word(w,'segment word'));
 const base=word(input.baseAddress,'base address'),offset=word(input.baseOffset,'base offset');
 if(base%4||base+source.length*4>0x100000000)throw new RangeError('Invalid animation loaded span');
 const operations=[];
 function index(address){const at=address-base;if(address%4||at<0||at+4>loadedAssetWords.length*4)throw new RangeError('Animation relocation reached outside loaded span');return at/4;}
 const read=address=>loadedAssetWords[index(address)];
 function write(address,value){const i=index(address);loadedAssetWords[i]=value;operations.push({kind:'loadedAssetWrite',byteOffset:i*4,width:4,value});}
 function resolve(pointer){const selected=pointer>>>24,segment=selected<16?selected:0;return (segmentWords[segment]+(pointer&0xffffff)+0x80000000+offset)>>>0;}
 const [tableOffset,count,lastField]=layout,animationTableAddress=resolve(0x08000000+tableOffset);
 for(let i=0;i<count;i++){
  const entry=(animationTableAddress+i*4)>>>0,descriptor=resolve(read(entry));write(entry,descriptor);
  for(let field=4;field<=lastField;field+=4){const address=(descriptor+field)>>>0;write(address,resolve(read(address)));}
 }
 return freeze({loadedAssetWords,animationTableAddress,operations,diagnostic:{bankIndex:bank,animationCount:count,pointerFieldsPerAnimation:lastField/4}});
}
