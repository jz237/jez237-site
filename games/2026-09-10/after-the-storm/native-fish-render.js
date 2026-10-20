import {makeNativeFishParts,nativeFishSpeciesForPart} from './native-fish-model.js';
import {makeNativeActorRenderer} from './native-actor-render.js';

/** Render original bank2 swimmers wherever the retained loader placed them.
 * Each actor owns its skin uniforms and species model; every reached actor is
 * validated before any pose is installed, and models leave with their actors.
 * The caller owns canonical motion/display and supplies the prepared frame.
 */
export function makeNativeFishRenderer(root,{map}={}){
 let models=new Map(),preparedModels=models,disposed=false;
 const renderer=makeNativeActorRenderer(root,{renderOrder:11,getPart:draw=>preparedModels.get(draw.actorIndex)?.part(draw.partOffset)});
 return {
  update(presentation,resourceWordsE73c){
   if(disposed)throw new Error('Native fish renderer is disposed');
   if(!Array.isArray(presentation?.draws))throw new TypeError('Supply prepared actor presentation');
   if(!Array.isArray(resourceWordsE73c)||resourceWordsE73c.length!==43||resourceWordsE73c.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained swimmer resource metadata');
   const slots=new Set();
   // Bank2 reef fish need nine loaded geometry slots; bank4's lake fish three.
   const banks=new Map();
   for(let slot=0;slot<2;slot++){const bank=resourceWordsE73c[(0x9c+slot*8)/4]|0;if(bank!==2&&bank!==4)continue;
    if(resourceWordsE73c[(0x44+slot*44)/4]!==(bank===2?9:3))throw new RangeError(bank===2?'Swimmer bank requires all nine loaded geometry slots':'Lake fish bank requires all three loaded geometry slots');slots.add(slot);banks.set(slot,bank);
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
     const bank=banks.get(parts[0].resourceIndex),species=nativeFishSpeciesForPart(parts[0].partOffset,{bank});
     if(!species||parts.some(d=>nativeFishSpeciesForPart(d.partOffset,{bank:banks.get(d.resourceIndex)})!==species))throw new RangeError('Swimmer draws must select one fish species');
     // A changed species for the same actor slot receives a new model.
     let model=models.get(actorIndex);if(model?.species!==species){model=makeNativeFishParts(species,{map});fresh.push(model);}
     poses.set(actorIndex,model.preparePose(parts));staged.set(actorIndex,model);
    }
    preparedModels=staged;const result=renderer.update({draws});
    for(const [actorIndex,model]of staged)model.commitPose(poses.get(actorIndex));
    for(const [actorIndex,model]of models)if(staged.get(actorIndex)!==model)model.dispose();models=staged;
    return result;
   }catch(error){fresh.forEach(model=>model.dispose());throw error;}
   finally{preparedModels=models;}
  },
  snapshot:()=>({actors:models.size,species:[...models.values()].map(m=>m.species)}),
  dispose(){if(disposed)return;disposed=true;renderer.dispose();models.forEach(model=>model.dispose());models.clear();}
 };
}
