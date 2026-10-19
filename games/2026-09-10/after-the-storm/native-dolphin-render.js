import {makeNativeDolphinParts} from './native-dolphin-model.js';
import {makeNativeActorRenderer} from './native-actor-render.js';

/** Render original dolphin bank0 wherever the retained loader placed it.
 * Each actor owns its skin uniforms. Validate every reached actor before
 * installing any pose, and release models when actors leave the draw list.
 * The caller owns canonical motion/display and supplies their prepared frame.
 */
export function makeNativeDolphinRenderer(root){
 let models=new Map(),preparedModels=models,disposed=false;
 const renderer=makeNativeActorRenderer(root,{getPart:draw=>preparedModels.get(draw.actorIndex)?.part(draw.partOffset)});
 return {
  update(presentation,resourceWordsE73c){
   if(disposed)throw new Error('Native dolphin renderer is disposed');
   if(!Array.isArray(presentation?.draws))throw new TypeError('Supply prepared actor presentation');
   if(!Array.isArray(resourceWordsE73c)||resourceWordsE73c.length!==43||resourceWordsE73c.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained dolphin resource metadata');
   const slots=new Set();
   for(let slot=0;slot<2;slot++)if((resourceWordsE73c[(0x9c+slot*8)/4]|0)===0){
    if(resourceWordsE73c[(0x44+slot*44)/4]!==6)throw new RangeError('Dolphin bank requires all six loaded geometry slots');slots.add(slot);
   }
   const draws=[],groups=new Map();
   for(const draw of presentation.draws){
    if(!Number.isInteger(draw?.resourceIndex)||draw.resourceIndex<0||draw.resourceIndex>1)throw new RangeError('Actor draw selects an unloaded resource slot');
    if(!slots.has(draw.resourceIndex))continue;
    draws.push(draw);if(!groups.has(draw.actorIndex))groups.set(draw.actorIndex,[]);groups.get(draw.actorIndex).push(draw);
   }
   const staged=new Map(),fresh=[],poses=new Map();
   try{
    for(const [actorIndex,parts]of groups){
     const model=models.get(actorIndex)??makeNativeDolphinParts();if(!models.has(actorIndex))fresh.push(model);
     poses.set(actorIndex,model.preparePose(parts));staged.set(actorIndex,model);
    }
    preparedModels=staged;const result=renderer.update({draws});
    for(const [actorIndex,model]of staged)model.commitPose(poses.get(actorIndex));
    for(const [actorIndex,model]of models)if(!staged.has(actorIndex))model.dispose();models=staged;
    return result;
   }catch(error){fresh.forEach(model=>model.dispose());throw error;}
   finally{preparedModels=models;}
  },
  dispose(){if(disposed)return;disposed=true;renderer.dispose();models.forEach(model=>model.dispose());models.clear();}
 };
}
