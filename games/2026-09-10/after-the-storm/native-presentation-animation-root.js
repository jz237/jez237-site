import {nativePresentationAnimationForResource,nativePresentationAnimationTransform} from './native-presentation-animation-resource.js';
function integer(v,min,max,name){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid actor root ${name}`);return v;}
const tracks={1:[6,8],3:[3,8],5:[1,16],6:[0,8],7:[2,12],8:[2,12],9:[2,12],10:[4,12]};
/** Numeric9D6B0 root lookup for its supported animated actor types. Unlike
 * drawing, this lookup does not reduce the animation or frame modulo a count.
 * Resource selectors come from the retained E768 halfwords; tracks and rows
 * belong to the selected loaded resource. Static/undefined branches reject. */
export function selectNativePresentationAnimationRoot(input){
 const selected=tracks[integer(input?.actorType,-2147483648,2147483647,'type')];
 if(!selected)throw new RangeError('Actor type has no animation root');
 const words=input.resourceWordsE73c;
 if(!Array.isArray(words)||words.length!==43)throw new RangeError('Supply retained actor root resource words');
 const [slot,trackOffset]=selected,at=0x2c+slot*2,w=integer(words[at>>>2],0,0xffffffff,'resource word');
 const resourceIndex=(at&2)?w<<16>>16:w>>16;
 const animationIndex=integer(input.animationIndex,-2147483648,2147483647,'animation index'),frame=integer(input.frame,-2147483648,2147483647,'frame');
 const animation=nativePresentationAnimationForResource(input,resourceIndex,animationIndex);
 const transformIndex=integer(nativePresentationAnimationTransform(animation,trackOffset,frame).transformIndex,-32768,32767,'transform key');
 return Object.freeze({resourceIndex,animationIndex,frame,trackOffset,transformIndex});
}
