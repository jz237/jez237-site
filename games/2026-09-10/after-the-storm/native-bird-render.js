import {makeNativeBirdParts,nativeBirdSpeciesForBank} from './native-bird-model.js';
import {makeNativeActorRenderer} from './native-actor-render.js';

/** Render original bank3 gulls and bank6 mallards in their loaded slots. Bird
 * parts are rigid, so one shared high-resolution part set per species serves
 * every actor; validation completes before any visible draw changes.
 */
export function makeNativeBirdRenderer(root){
 const models=new Map();let slotSpecies=new Map(),disposed=false;
 const renderer=makeNativeActorRenderer(root,{renderOrder:12,getPart:draw=>models.get(slotSpecies.get(draw.resourceIndex))?.part(draw.partOffset)});
 return {
  update(presentation,resourceWordsE73c){
   if(disposed)throw new Error('Native bird renderer is disposed');
   if(!Array.isArray(presentation?.draws))throw new TypeError('Supply prepared actor presentation');
   if(!Array.isArray(resourceWordsE73c)||resourceWordsE73c.length!==43||resourceWordsE73c.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError('Supply retained bird resource metadata');
   const species=new Map();
   for(let slot=0;slot<2;slot++){const kind=nativeBirdSpeciesForBank(resourceWordsE73c[(0x9c+slot*8)/4]|0);
    if(!kind)continue;if(resourceWordsE73c[(0x44+slot*44)/4]!==5)throw new RangeError('Bird bank requires all five loaded geometry slots');species.set(slot,kind);}
   const draws=presentation.draws.filter(d=>{if(!Number.isInteger(d?.resourceIndex)||d.resourceIndex<0||d.resourceIndex>1)throw new RangeError('Actor draw selects an unloaded resource slot');return species.has(d.resourceIndex);});
   for(const kind of species.values())if(!models.has(kind))models.set(kind,makeNativeBirdParts(kind));
   const previous=slotSpecies;slotSpecies=species;
   try{return renderer.update({draws});}catch(error){slotSpecies=previous;throw error;}
  },
  snapshot:()=>({species:[...models.keys()]}),
  dispose(){if(disposed)return;disposed=true;renderer.dispose();models.forEach(m=>m.dispose());models.clear();}
 };
}
