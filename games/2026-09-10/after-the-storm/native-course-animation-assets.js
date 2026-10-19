import {NATIVE_COURSE_ANIMATION_ASSETS as layouts} from './source-course-actor-animation-assets.js';
import {prepareNativeCourseAnimationRelocation} from './native-course-animation-relocation.js';
import {createNativePresentationAnimationResources} from './native-presentation-animation-resource.js';
import {assetURL,fetchAsset} from './asset-store.js';

function layout(bankIndex){
 if(!Number.isInteger(bankIndex)||!Object.hasOwn(layouts,bankIndex))throw new RangeError('Select an animated course asset bank');return layouts[bankIndex];
}

/** Run the original numeric animation parser over its extracted data block.
 * The zero prefix is address-space padding, never a fallback for geometry or
 * missing animation reads. Only the data span is returned to animation readers.
 * Original pointer stores (including aliases read later as numeric data) keep
 * their source order and the caller's actual loaded address/segment placement.
 */
export function prepareNativeCourseAnimationAssetBank(input){
 const info=layout(input?.bankIndex),bytes=input.bytes;
 if(!(bytes instanceof Uint8Array)||bytes.length!==info.byteLength)throw new RangeError('Invalid course animation asset length');
 const source=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),loadedAssetWords=Array((info.dataOffset+info.byteLength)/4).fill(0);
 for(let at=0;at<bytes.length;at+=4)loadedAssetWords[(info.dataOffset+at)/4]=source.getUint32(at);
 const q=prepareNativeCourseAnimationRelocation({...input,loadedAssetWords});
 if(q.animationTableAddress!==input.baseAddress+info.tableOffset)throw new RangeError('Animation asset placement disagrees with the selected segment');
 if(q.operations.some(o=>o.byteOffset<info.dataOffset||o.byteOffset+o.width>info.dataOffset+info.byteLength))throw new RangeError('Animation asset relocation reached outside its data block');
 const loadedBytes=new Uint8Array(info.byteLength),target=new DataView(loadedBytes.buffer);
 for(let at=0;at<loadedBytes.length;at+=4)target.setUint32(at,q.loadedAssetWords[(info.dataOffset+at)/4]);
 return Object.freeze({loadedBytes,baseAddress:input.baseAddress+info.dataOffset,animationTableAddress:q.animationTableAddress,
  operations:q.operations,diagnostic:Object.freeze({bankIndex:input.bankIndex,dataOffset:info.dataOffset,byteLength:info.byteLength,animationCount:info.animationCount,graphicsLoaded:false})});
}

/** Bind the selected data assets to already-prepared canonical resource slots.
 * Loaded addresses come from the host's actual load plan. A mismatched table
 * rejects the entire preparation; this function never rewrites retained
 * selectors or silently repairs metadata belonging to another course.
 */
export function createNativeCourseAnimationAssetResources(input){
 const words=input?.resourceWordsE73c;
 if(!Array.isArray(words)||words.length!==43||words.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained course animation resource words');
 const loadedBanks={};
 for(let slot=0;slot<2;slot++){
  const bankIndex=words[(0x9c+slot*8)/4]|0;if(bankIndex===-1||bankIndex===5||bankIndex===7)continue;
  layout(bankIndex);
  const q=prepareNativeCourseAnimationAssetBank({bankIndex,bytes:input.assets?.[bankIndex],baseAddress:input.loadedBasesBySlot?.[slot],
   baseOffset:words[(0xa0+slot*8)/4]&0xffffff,segmentWordsE6b0:input.segmentWordsE6b0});
  if(words[(0x48+slot*44)/4]!==q.animationTableAddress)throw new RangeError('Course animation asset does not match retained table ownership');loadedBanks[slot]=q;
 }
 const animationResources=createNativePresentationAnimationResources({resourceWordsE73c:words,loadedBanks});
 return Object.freeze({animationResources,loadedBanks:Object.freeze(loadedBanks)});
}

/** Fetch only selected animated banks through the existing versioned cache.
 * Static/absent slots require no animation download. Hashes reject truncated,
 * stale or misrouted responses before any canonical resource owner is touched.
 */
export async function loadNativeCourseAnimationAssets(bankIndices,{fetcher=fetchAsset,url=assetURL}={}){
 if(!Array.isArray(bankIndices)||bankIndices.length>9||bankIndices.some(i=>!Number.isInteger(i)||i< -1||i>8))throw new RangeError('Supply selected course animation bank indices');
 if(typeof fetcher!=='function'||typeof url!=='function')throw new TypeError('Supply course animation asset fetch functions');
 const selected=[...new Set(bankIndices)].filter(i=>i!==-1&&i!==5&&i!==7);
 const loaded=await Promise.all(selected.map(async bankIndex=>{
  const info=layout(bankIndex),response=await fetcher(url(info.asset));
  if(!response?.ok)throw new Error(`Could not load course animation bank ${bankIndex}`);
  const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length!==info.byteLength)throw new RangeError('Invalid course animation asset length');
  const digest=Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!==info.sha256)throw new Error(`Course animation bank ${bankIndex} failed its content check`);
  return [bankIndex,bytes];
 }));
 return Object.freeze(Object.fromEntries(loaded));
}
