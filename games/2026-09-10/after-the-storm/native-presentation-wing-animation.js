import {prepareNativePresentationAnimationParts} from './native-presentation-animation-parts.js';
import {nativePresentationAnimationForResource} from './native-presentation-animation-resource.js';
import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
const parts=[[0x14,0xc],[0x10,0x10],[0xc,0x14],[0x20,0xc],[0x1c,0x10],[0x18,0x14],[8,8]];
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}

/** Complete9DC10/9E814 numeric bird draw and semantic graphics order. The selected
 *resource view supplies actual frameCount, per-part signed frame keys and
 *12-byte transform rows; these are not inferred from elapsed browser time.
 *tracks[offset][signedFrame] and transforms[signedKey] can include negative
 *indices if that retained frame reaches bytes before a source table pointer.
 *High-resolution geometry is selected by resourceIndex/partOffset effects.
 */
export function prepareNativePresentationWingAnimation(input){
 const drawType=input?.drawType??1;if(drawType!==1&&drawType!==3)throw new RangeError('Invalid wing draw type');
 const pool=input?.actorWordsF060,actorIndex=integer(input?.actorIndex,'wing actor index',0,29),bufferIndex=integer(input?.bufferIndex,'wing buffer',0,1),resourceIndex=integer(input?.resourceIndex,'wing resource index',0,32767);
 if(!Array.isArray(pool)||pool.length!==NATIVE_PRESENTATION_ACTOR_WORDS||pool.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained actorWordsF060');
 const activity=integer(input.activity624,'wing display activity',-32768,32767),resource=input.animationResources?nativePresentationAnimationForResource(input,resourceIndex,0):input.animation;
 const frameCount=integer(resource?.frameCount,'wing animation frame count',1,32767),actorWordsF060=[...pool],base=actorIndex*47,operations=[];
 const put=(byteOffset,value)=>{actorWordsF060[byteOffset/4]=value>>>0;operations.push({kind:'presentationActorWrite',byteOffset,width:4,value:value>>>0});};
 const remainder=v=>v%frameCount;
 if(activity===-1)put((base+0x78/4)*4,remainder(((actorWordsF060[base+0x78/4]|0)+1)|0));
 const frame=remainder(actorWordsF060[base+0x78/4]|0);
 const draw=prepareNativePresentationAnimationParts({...input,actorWordsF060,frame,animation:resource,scale:Math.fround(drawType===1?.1:.2)},parts);
 return freeze({actorWordsF060:draw.actorWordsF060,operations:[...operations,...draw.operations],diagnostic:{actorIndex,drawType,frame,frameCount,resourceIndex,...draw.diagnostic}});
}
