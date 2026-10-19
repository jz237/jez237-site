import {prepareNativePresentationLighting} from './native-presentation-lighting.js';
import {prepareNativePresentationActorBounds,prepareNativePresentationActorRetirement} from './native-presentation-actor-pool.js';
import {prepareNativePresentationActorVisibility,nativePresentationActorMatrixEstimate} from './native-presentation-actor-visibility.js';
import {prepareNativePresentationWingAnimation} from './native-presentation-wing-animation.js';
import {prepareNativePresentationStaticActor} from './native-presentation-static-actor.js';
import {prepareNativePresentationArticulatedActor} from './native-presentation-articulated-actor.js';
import {prepareNativePresentationSpecialActor} from './native-presentation-special-actor.js';
const countOffset=0x801d06b8-0x801cf060;
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Whole ADF90 preparation. The capacity estimate is checked BEFORE visibility;
 * only actual draws allocate matrices. Retirement occurs after drawing even
 * when capacity terminates the loop. Renderer effects retain source order.
 */
export function prepareNativePresentationActorDisplay(input){
 const phase=input?.actorDisplayPhase62c0;
 if(!Number.isInteger(phase)||phase< -2147483648||phase>2147483647)throw new RangeError('Supply retained actor display phase');
 const actorDisplayPhase62c0=phase===1?0:1,operations=[{kind:'sourceWordWrite',field:'actorDisplayPhase62c0',value:actorDisplayPhase62c0}];
 const lighting=prepareNativePresentationLighting(input);operations.push(...lighting.operations);
 const bounded=prepareNativePresentationActorBounds(input);let actorWordsF060=[...bounded.actorWordsF060],actorControlWords62c4=bounded.actorControlWords62c4;
 operations.push(...bounded.operations);actorWordsF060[countOffset/4]=0;operations.push({kind:'presentationActorWrite',byteOffset:countOffset,width:4,value:0});
 const drawn=[];let stoppedAt=null;
 function resource(type){
  const words=input.resourceWordsE73c;
  if(!Array.isArray(words)||words.length!==43||words.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained resourceWordsE73c[43]');
  const offsets={1:0x38,2:0x38,3:0x32,4:0x32,5:0x2e,6:0x2c,7:0x30,8:0x30,9:0x30,10:0x34,12:0x3a,13:0x3c},at=offsets[type];
  return (at&2)?(words[at>>>2]<<16)>>16:words[at>>>2]>>16;
 }
 for(let actorIndex=0;actorIndex<30;actorIndex++){
  const base=actorIndex*47,drawType=(actorWordsF060[base]+actorWordsF060[base+1])|0;
  if(nativePresentationActorMatrixEstimate(drawType,actorWordsF060[countOffset/4]|0)>=192){stoppedAt=actorIndex;break;}
  const visibility=prepareNativePresentationActorVisibility({...input,actorWordsF060,actorIndex});
  actorWordsF060=[...visibility.actorWordsF060];operations.push(...visibility.operations);
  if(!visibility.visible||drawType<1||drawType>13||drawType===11)continue;
  const resourceIndex=resource(drawType),animationsByIndex=input.animationsByResourceIndex?.[resourceIndex];
  const args={...input,actorWordsF060,actorIndex,drawType,resourceIndex,animationsByIndex,animation:animationsByIndex?.[0]};
  const q=drawType===1||drawType===3?prepareNativePresentationWingAnimation(args):drawType===2||drawType===4?prepareNativePresentationStaticActor(args):drawType<=10?prepareNativePresentationArticulatedActor(args):prepareNativePresentationSpecialActor(args);
  actorWordsF060=[...q.actorWordsF060];operations.push(...q.operations);drawn.push(actorIndex);
 }
 const retired=prepareNativePresentationActorRetirement({actorWordsF060,actorControlWords62c4});operations.push(...retired.operations);
 return freeze({actorWordsF060:retired.actorWordsF060,actorControlWords62c4:retired.actorControlWords62c4,actorDisplayPhase62c0,operations,
  diagnostic:{drawn,stoppedAt,matricesUsed:actorWordsF060[countOffset/4],graphicsExecuted:false}});
}
