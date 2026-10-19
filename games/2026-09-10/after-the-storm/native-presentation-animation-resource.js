const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,min,max,name){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid animation resource ${name}`);return v;}

/** Read a selected, already-relocated animation descriptor from a bounded
 * big-endian loaded memory span. The caller chooses the actual source frames
 * and track offsets: motion can read a raw frame while display uses its own
 * modulo rule. Neither frames nor signed transform keys are normalized here.
 * Geometry and executable display lists are not decoded by this reader.
 */
export function readNativePresentationAnimationResource(input){
 const bytes=input?.loadedBytes;
 if(!(bytes instanceof Uint8Array)||bytes.length===0||bytes.length>0x800000)throw new RangeError('Supply bounded animation resource loadedBytes');
 const base=integer(input.baseAddress,0,0xffffffff,'base address');
 if(base+bytes.length>0x100000000)throw new RangeError('Animation resource span wraps address space');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 function at(address,width){integer(address,0,0xffffffff,'read address');const offset=address-base;
  if(offset<0||offset+width>bytes.length)throw new RangeError('Selected animation resource read is outside loaded span');
  if(width>1&&address%width)throw new RangeError('Unaligned animation resource read');return offset;
 }
 const word=a=>view.getUint32(at(a,4)),half=a=>view.getInt16(at(a,2)),byte=a=>view.getInt8(at(a,1));
 const table=integer(input.animationTableAddress,0,0xffffffff,'table address'),index=integer(input.animationIndex,-2147483648,2147483647,'animation index');
 const descriptor=word((table+Math.imul(index,4))>>>0),frameCount=half(descriptor),transformBase=word((descriptor+4)>>>0);
 if(!Array.isArray(input.frames)||input.frames.length===0||input.frames.length>65536)throw new RangeError('Supply selected animation resource frames');
 if(!Array.isArray(input.trackOffsets)||input.trackOffsets.length===0||input.trackOffsets.length>32)throw new RangeError('Supply selected animation resource tracks');
 const frames=input.frames.map(f=>integer(f,-2147483648,2147483647,'frame')),tracks={},transforms={};
 for(const selectedOffset of input.trackOffsets){
  const offset=integer(selectedOffset,8,132,'track offset');if(offset%4)throw new RangeError('Unaligned animation track offset');
  const pointer=word((descriptor+offset)>>>0),keys={};
  for(const frame of frames){
   const key=half((pointer+Math.imul(frame,2))>>>0);keys[frame]=key;
   if(Object.hasOwn(transforms,key))continue;
   const row=(transformBase+Math.imul(key,12))>>>0;
   const vector=(offset,stride,read)=>Object.fromEntries(['x','y','z'].map((axis,i)=>[axis,read((row+offset+i*stride)>>>0)]));
   transforms[key]={positionNative:vector(0,2,half),forwardUnits:vector(6,1,byte),upUnits:vector(9,1,byte)};
  }
  tracks[offset]=keys;
 }
 return freeze({frameCount,tracks,transforms});
}

/** Snapshot one loaded bank once. Descriptor and transform reads remain lazy,
 * so an unused track or a raw motion frame is never replaced by a guessed
 * frame range. Small immutable samples are cached independently of race state.
 */
export function createNativePresentationAnimationBank(input){
 const bytes=input?.loadedBytes;
 if(!(bytes instanceof Uint8Array)||bytes.length===0||bytes.length>0x800000)throw new RangeError('Supply bounded animation bank loadedBytes');
 const loadedBytes=bytes.slice(),baseAddress=integer(input.baseAddress,0,0xffffffff,'bank base address'),animationTableAddress=integer(input.animationTableAddress,0,0xffffffff,'bank table address');
 if(baseAddress+bytes.length>0x100000000)throw new RangeError('Animation bank span wraps address space');
 const view=new DataView(loadedBytes.buffer),animations=new Map();
 function at(address,width){const offset=address-baseAddress;if(address%width||offset<0||offset+width>loadedBytes.length)throw new RangeError('Animation bank descriptor is outside loaded span');return offset;}
 function animation(animationIndex){
  integer(animationIndex,-2147483648,2147483647,'animation index');if(animations.has(animationIndex))return animations.get(animationIndex);
  const address=view.getUint32(at((animationTableAddress+Math.imul(animationIndex,4))>>>0,4)),frameCount=view.getInt16(at(address,2)),samples=new Map();
  const result=Object.freeze({frameCount,sampleTransform(trackOffset,frame){
   integer(trackOffset,8,132,'track offset');integer(frame,-2147483648,2147483647,'frame');if(trackOffset%4)throw new RangeError('Unaligned animation track offset');
   const key=trackOffset+'/'+frame;if(samples.has(key))return samples.get(key);
   const decoded=readNativePresentationAnimationResource({loadedBytes,baseAddress,animationTableAddress,animationIndex,frames:[frame],trackOffsets:[trackOffset]});
   const transformIndex=decoded.tracks[trackOffset][frame],sample=freeze({transformIndex,transform:decoded.transforms[transformIndex]});samples.set(key,sample);return sample;
  }});
  animations.set(animationIndex,result);return result;
 }
 return Object.freeze({animation});
}

/** Source slots own their loaded banks; selector words choose a slot later.
 * Install this provider with the matching canonical resource metadata. Static
 * banks retain stale animation pointers but never decode them.
 */
export function createNativePresentationAnimationResources(input){
 const words=input?.resourceWordsE73c;
 if(!Array.isArray(words)||words.length!==43)throw new RangeError('Supply animation resourceWordsE73c[43]');
 const retained=Array.from(words,w=>integer(w,0,0xffffffff,'retained resource word')),banks=new Map();
 for(let slot=0;slot<2;slot++){
  const bankIndex=retained[(0x9c+slot*8)/4]|0;if(bankIndex===-1)continue;
  integer(bankIndex,0,8,'bank index');if(bankIndex===5||bankIndex===7)continue;
  const bank=input.loadedBanks?.[slot];if(!bank)throw new RangeError('Missing selected loaded animation bank');
  banks.set(slot,createNativePresentationAnimationBank({...bank,animationTableAddress:retained[(0x48+slot*44)/4]}));
 }
 return Object.freeze({getAnimation(resourceIndex,animationIndex,currentWords){
  integer(resourceIndex,0,1,'resource slot');
  if(currentWords!==undefined){
   if(!Array.isArray(currentWords)||currentWords.length!==43)throw new RangeError('Supply current animation resource words');
   for(const offset of [0x9c+resourceIndex*8,0xa0+resourceIndex*8,0x48+resourceIndex*44])if(currentWords[offset/4]!==retained[offset/4])throw new RangeError('Loaded animation bank no longer matches retained resource');
  }
  const bank=banks.get(resourceIndex);if(!bank)throw new RangeError('Selected resource has no loaded animation bank');return bank.animation(animationIndex);
 }});
}

export function nativePresentationAnimationForResource(input,resourceIndex,animationIndex){
 return input.animationResources?input.animationResources.getAnimation(resourceIndex,animationIndex,input.resourceWordsE73c):input.animationsByIndex?.[animationIndex]??input.animationsByResourceIndex?.[resourceIndex]?.[animationIndex];
}

export function nativePresentationAnimationTransform(animation,trackOffset,frame){
 if(typeof animation?.sampleTransform==='function')return animation.sampleTransform(trackOffset,frame);
 const transformIndex=animation?.tracks?.[trackOffset]?.[frame];return {transformIndex,transform:animation?.transforms?.[transformIndex]};
}
