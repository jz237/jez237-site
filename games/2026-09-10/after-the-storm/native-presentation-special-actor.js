import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {prepareNativePresentationActorRootMatrix} from './native-presentation-actor-transform.js';
import {prepareNativePresentationAnimationParts} from './native-presentation-animation-parts.js';
import {nativePresentationAnimationForResource} from './native-presentation-animation-resource.js';
const parts13=[[8,8],[12,16],[20,20],[24,20],[28,12],[16,16]],retainedMatrixWord=(0x801d0678-0x801cf060)/4;
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}

/** Complete numeric A28F4/A063C. Surface changes remain explicit renderer
 * effects at the original display-list positions. The final type13 part also
 * multiplies the retained0678 matrix without pushing another stack entry.
 */
export function prepareNativePresentationSpecialActor(input){
 const drawType=input?.drawType;if(drawType!==12&&drawType!==13)throw new RangeError('Invalid special actor draw type');
 const actorIndex=integer(input.actorIndex,'special actor index',0,29),resourceIndex=integer(input.resourceIndex,'special actor resource index',0,32767);
 const activity=integer(input.activity624,'special actor activity',-32768,32767),pool=input.actorWordsF060;
 if(!Array.isArray(pool)||pool.length!==NATIVE_PRESENTATION_ACTOR_WORDS||pool.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained actorWordsF060');
 const actorWordsF060=[...pool],base=actorIndex*47,operations=[];
 const put=(offset,value)=>{actorWordsF060[base+offset/4]=value>>>0;operations.push({kind:'presentationActorWrite',byteOffset:base*4+offset,width:4,value:value>>>0});};
 const surface=preset=>({kind:'presentationActorSurface',preset}),draw=partOffset=>({kind:'presentationActorPartDraw',bufferIndex:input.bufferIndex,actorIndex,resourceIndex,partOffset});
 if(drawType===12){
  if(activity===-1)put(0x78,(((pool[base+0x78/4]|0)+1)|0)%2);
  const root=prepareNativePresentationActorRootMatrix({...input,actorWordsF060,scale:Math.fround(.4)}),frame=actorWordsF060[base+0x78/4]|0;
  operations.push({kind:'presentationActorMaterial',preset:'actor'},surface('actor12-base'),...root.operations,draw(8),surface('actor12-overlay'),draw(frame===0?12:16));
  return freeze({actorWordsF060:root.actorWordsF060,operations,diagnostic:{...root.diagnostic,drawType,resourceIndex,frame,partCount:2}});
 }
 const animationIndex=(pool[base+0x74/4]|0)%2,animation=nativePresentationAnimationForResource(input,resourceIndex,animationIndex);
 const frameCount=integer(animation?.frameCount,'special animation frame count',1,32767);
 if(activity===-1&&(pool[base+0x78/4]|0)>=frameCount)put(0x78,0);
 const frame=(actorWordsF060[base+0x78/4]|0)%frameCount;
 const prepared=prepareNativePresentationAnimationParts({...input,actorWordsF060,animation,frame,scale:Math.fround(pool[base+2]===2?.15:.6)},parts13);
 const drawing=[...prepared.operations],lastDraw=drawing.findLastIndex(o=>o.kind==='presentationActorPartDraw');
 drawing.splice(lastDraw,0,surface('actor13-final'),{kind:'presentationActorRetainedMatrixMultiply',bufferIndex:input.bufferIndex,actorIndex,matrixWords:prepared.actorWordsF060.slice(retainedMatrixWord,retainedMatrixWord+16)});
 return freeze({actorWordsF060:prepared.actorWordsF060,operations:[...operations,...drawing],diagnostic:{...prepared.diagnostic,actorIndex,drawType,resourceIndex,animationIndex,frame,frameCount}});
}
