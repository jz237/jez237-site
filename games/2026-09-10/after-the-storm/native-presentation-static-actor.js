import {prepareNativePresentationActorRootMatrix} from './native-presentation-actor-transform.js';
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};

/** Complete9DB90/9E794: selected static geometry shares the animated bird's
 * resource row but reads part+18, without advancing animation or allocating
 * child transforms. Submitted actors still use their retained basis/scale.
 */
export function prepareNativePresentationStaticActor(input){
 const drawType=input?.drawType,resourceIndex=input?.resourceIndex;
 if(drawType!==2&&drawType!==4)throw new RangeError('Invalid static actor draw type');
 if(!Number.isInteger(resourceIndex)||resourceIndex<0||resourceIndex>32767)throw new RangeError('Invalid static actor resource index');
 const root=prepareNativePresentationActorRootMatrix({...input,scale:Math.fround(drawType===2?.1:.2)});
 return freeze({actorWordsF060:root.actorWordsF060,operations:[{kind:'presentationActorMaterial',preset:'actor'},...root.operations,
  {kind:'presentationActorPartDraw',bufferIndex:input.bufferIndex,actorIndex:input.actorIndex,resourceIndex,partOffset:24}],
  diagnostic:{...root.diagnostic,drawType,resourceIndex,partCount:1}});
}
