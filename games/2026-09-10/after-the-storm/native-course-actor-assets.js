import {NATIVE_COURSE_ACTOR_RESOURCE_DATA as data} from './source-course-actor-resource-data.js';
import {NATIVE_TITLE_MENU_DATA} from './native-title-menu-data.js';
import {prepareNativeCourseAnimationAssetBank} from './native-course-animation-assets.js';
import {createNativePresentationAnimationResources} from './native-presentation-animation-resource.js';
import {prepareNativeRaceCourseResourceConfigurationUpdate,prepareNativeRaceStateOperations} from './native-race-state.js';

function words(value){if(!Array.isArray(value)||value.length!==43||value.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained course actor resource words');return [...value];}

/** High-resolution geometry replaces the cartridge display lists. Retain the
 * original96048 part identities/count/table stores so all numeric animation,
 * visibility and actor code still selects the same resource/part. The original
 * full display-list relocation remains in native-course-resource-relocation;
 * this adaptation neither loads nor executes those low-resolution commands.
 */
export function prepareNativeHighResolutionCourseBank(resourceWords,input){
 const next=words(resourceWords),slot=input?.slot;if(slot!==0&&slot!==1)throw new RangeError('Invalid course actor resource slot');
 const bankIndex=next[(0x9c+slot*8)/4]|0,roots=data.coursePartRootsB484[bankIndex];
 if(!roots)throw new RangeError('Select a loaded course actor bank');
 const baseOffset=next[(0xa0+slot*8)/4]&0xffffff,record=0x44+slot*44,operations=[];
 const write=(byteOffset,value)=>{next[byteOffset/4]=value;operations.push(Object.freeze({kind:'resourceWrite',owner:'resourceWordsE73c',byteOffset,width:4,value}));};
 roots.forEach((root,i)=>write(record+8+i*4,(root+baseOffset)>>>0));write(record,roots.length);
 let animationBank=null;
 if(bankIndex!==5&&bankIndex!==7){
  animationBank=prepareNativeCourseAnimationAssetBank({bankIndex,bytes:input.bytes,baseAddress:input.baseAddress,baseOffset,segmentWordsE6b0:input.segmentWordsE6b0});
  write(record+4,animationBank.animationTableAddress);
 }
 return Object.freeze({resourceWordsE73c:Object.freeze(next),operations:Object.freeze(operations),animationBank,
  diagnostic:Object.freeze({slot,bankIndex,partCount:roots.length,lowResolutionGraphicsLoaded:false})});
}

/** Original9684C selection followed by high-resolution bank binding. Hosts
 * provide explicit retained owners and downloaded animation assets. State and
 * provider install together only after both slots succeed; large immutable
 * animation data remains outside canonical per-frame copies.
 */
export function prepareNativeCourseActorAssets(state,{baseWord=0x08060000,segmentWordsE6b0,assets}={}){
 const courseIndex=state?.scene?.courseIndex;
 if(!Number.isInteger(courseIndex)||courseIndex<0||courseIndex>8)throw new RangeError('Select an original course actor scene');
 const configured=prepareNativeRaceCourseResourceConfigurationUpdate(state,{baseWord,resourceIndices:NATIVE_TITLE_MENU_DATA.courseResourcePairs[courseIndex]},data);
 let next=configured.state;const operations=[...configured.operations],loadedBanks={};
 for(let slot=0;slot<2;slot++){
  const retained=next.resourceWordsE73c,bankIndex=retained[(0x9c+slot*8)/4]|0;if(bankIndex===-1)continue;
  let baseAddress;
  if(bankIndex!==5&&bankIndex!==7){
   if(!Array.isArray(segmentWordsE6b0)||segmentWordsE6b0.length!==16||segmentWordsE6b0.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply selected course actor segment words');
   baseAddress=(segmentWordsE6b0[8]+(retained[(0xa0+slot*8)/4]&0xffffff)+0x80000000)>>>0;
  }
  const q=prepareNativeHighResolutionCourseBank(retained,{slot,baseAddress,segmentWordsE6b0,bytes:assets?.[bankIndex]});
  next=prepareNativeRaceStateOperations(next,q.operations).state;operations.push(...q.operations);if(q.animationBank)loadedBanks[slot]=q.animationBank;
 }
 const animationResources=createNativePresentationAnimationResources({resourceWordsE73c:next.resourceWordsE73c,loadedBanks});
 return Object.freeze({state:next,operations:Object.freeze(operations),loadedBanks:Object.freeze(loadedBanks),animationResources,
  diagnostic:Object.freeze({courseIndex,lowResolutionGraphicsLoaded:false,canonicalStateInstalled:false})});
}
