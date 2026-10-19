import {prepareNativeDisplayListRelocation} from './native-rider-resource-relocation.js';
import {prepareNativeCourseAnimationRelocation} from './native-course-animation-relocation.js';
const word=(v,name)=>{if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError(`Invalid course resource ${name}`);return v;};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Complete96048 for the two retained course resource slots. Part lists and
 * decoded memory are explicit source inputs. Display-list and animation
 * relocation read prior writes in source order; static banks retain their
 * previous animation pointer. No renderer or transfer is invoked here.
 */
export function prepareNativeCourseResourceRelocation(value,input={},sourceViews={}){
 const slot=input.slot;if(slot!==0&&slot!==1)throw new RangeError('Invalid course resource slot');
 if(!Array.isArray(value?.resourceWordsE73c)||value.resourceWordsE73c.length!==43)throw new RangeError('Supply resourceWordsE73c[43]');
 const resourceWordsE73c=Array.from(value.resourceWordsE73c,w=>word(w,'retained word'));
 if(!Array.isArray(value.loadedAssetWords)||value.loadedAssetWords.length===0||value.loadedAssetWords.length>0x200000)throw new RangeError('Supply bounded course loadedAssetWords');
 let loadedAssetWords=Array.from(value.loadedAssetWords,w=>word(w,'loaded word'));
 const baseAddress=word(input.baseAddress,'base address');
 if(baseAddress%4||baseAddress+loadedAssetWords.length*4>0x100000000)throw new RangeError('Invalid course resource loaded span');
 if(baseAddress<0x801ce7e8&&baseAddress+loadedAssetWords.length*4>0x801ce73c)throw new RangeError('Course resource owners overlap');
 const descriptor=(0x9c+slot*8)/4,bankIndex=resourceWordsE73c[descriptor]|0,baseOffset=resourceWordsE73c[descriptor+1]&0xffffff;
 if(bankIndex<0||bankIndex>8)throw new RangeError('Invalid selected course resource bank');
 const roots=sourceViews.coursePartRootListsB484?.[bankIndex];
 if(!Array.isArray(roots))throw new RangeError('Supply selected course part root list');
 const operations=[],record=0x44+slot*44;
 function writeResource(byteOffset,value){if(byteOffset<0||byteOffset+4>172)throw new RangeError('Course resource part list exceeds retained owner');
  resourceWordsE73c[byteOffset/4]=value;operations.push({kind:'resourceWrite',owner:'resourceWordsE73c',byteOffset,width:4,value});
 }
 let partCount=0;
 for(;;partCount++){
  const root=word(roots[partCount],'part root');if(root===0)break;
  const q=prepareNativeDisplayListRelocation({loadedAssetWords},{byteOffset:root&0xffffff,baseWord:baseOffset});
  for(const op of q.operations){loadedAssetWords[op.byteOffset/4]=op.value;operations.push(op);}
  writeResource(record+8+partCount*4,(root+baseOffset)>>>0);
 }
 writeResource(record,partCount);
 const animated=bankIndex!==5&&bankIndex!==7;
 if(animated){
  const q=prepareNativeCourseAnimationRelocation({loadedAssetWords,baseAddress,baseOffset,bankIndex,segmentWordsE6b0:input.segmentWordsE6b0});
  loadedAssetWords=[...q.loadedAssetWords];operations.push(...q.operations);writeResource(record+4,q.animationTableAddress);
 }
 return freeze({resourceWordsE73c,loadedAssetWords,operations,diagnostic:{slot,bankIndex,partCount,animated,rendered:false}});
}
