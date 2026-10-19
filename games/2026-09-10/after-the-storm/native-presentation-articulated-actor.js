import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {prepareNativePresentationAnimationParts} from './native-presentation-animation-parts.js';
import {nativePresentationAnimationForResource} from './native-presentation-animation-resource.js';
const parts5=[[0x10,8],[0x18,0xc],[0x14,0x10],[0xc,0x14],[8,0x14]],parts6=[[8,0x18],[0x18,0x1c],[0x14,0x10],[0xc,0x14],[0x10,0x14]];
const otherParts={7:[[12,8],[8,16],[16,12]],8:[[12,20],[8,28],[16,24]],9:[[12,32],[8,40],[16,36]],10:[[12,8],[8,16],[16,12]]};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}

/** Complete numeric9F398/9FCB0 and A10E4/A16F0/A1CFC/A2308. Types5/6 retain the animation selected BEFORE
 * frame advancement resets the stored animation number. Their reset rules
 * differ, especially for submitted actors and out-of-range signed frames.
 */
export function prepareNativePresentationArticulatedActor(input){
 const drawType=integer(input?.drawType,'articulated actor draw type',5,10);
 const pool=input.actorWordsF060,actorIndex=integer(input.actorIndex,'articulated actor index',0,29);
 if(!Array.isArray(pool)||pool.length!==NATIVE_PRESENTATION_ACTOR_WORDS||pool.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained actorWordsF060');
 const activity=integer(input.activity624,'articulated actor activity',-32768,32767),base=actorIndex*47,actorWordsF060=[...pool],operations=[];
 const animationIndex=drawType>=7?(drawType===8?1:0):(pool[base+0x74/4]|0)%(drawType===5?3:8),animation=nativePresentationAnimationForResource(input,input.resourceIndex,animationIndex);
 const frameCount=integer(animation?.frameCount,'articulated animation frame count',1,32767);
 const put=(offset,value)=>{actorWordsF060[base+offset/4]=value>>>0;operations.push({kind:'presentationActorWrite',byteOffset:base*4+offset,width:4,value:value>>>0});};
 const oldFrame=pool[base+0x78/4]|0;
 if(activity===-1){
  if(drawType===5||drawType>=7){const next=((oldFrame+1)|0)%frameCount;put(0x78,next);if(drawType===5&&next===0)put(0x74,0);}
  else if(pool[base+0xb8/4]===0){put(0x78,(oldFrame+1)|0);if(oldFrame>=frameCount-1){put(0x74,0);put(0x78,0);}}
 }
 const frame=(actorWordsF060[base+0x78/4]|0)%frameCount;
 let scale;
 if(drawType>=7)scale=drawType===10?.1:actorIndex<12?.3:.2;
 else if(drawType===5)scale=pool[base+0x7c/4]===255?.2:.05;
 else{
  const course=integer(input.courseIndex,'articulated course',0,11);
  if(course!==0)scale=.15;
  else if(pool[base+0x7c/4]!==255)scale=.07;
  else scale=integer(input.championshipCountAa00,'articulated championship count',-32768,32767)%100<20?.15:.25;
 }
 const draw=prepareNativePresentationAnimationParts({...input,actorWordsF060,frame,animation,scale:Math.fround(scale)},drawType===5?parts5:drawType===6?parts6:otherParts[drawType],{materialPreset:drawType>=7?'actor-alternate':'actor'});
 return freeze({actorWordsF060:draw.actorWordsF060,operations:[...operations,...draw.operations],diagnostic:{actorIndex,drawType,animationIndex,frame,frameCount,resourceIndex:input.resourceIndex,...draw.diagnostic}});
}
