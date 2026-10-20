import {makeNativeBirdParts} from './native-bird-model.js';
import {makeNativeActorRenderer} from './native-actor-render.js';
import {makeNativePenguinParts} from './native-penguin-model.js';
import {makeNativeSubmarineParts} from './native-submarine-model.js';

// Rigid-part banks: geometry slot count and the shared model for each.
const RIGID_BANKS=new Map([[3,{slots:5,make:()=>makeNativeBirdParts('gull')}],[6,{slots:5,make:()=>makeNativeBirdParts('mallard')}],[8,{slots:4,make:makeNativePenguinParts}],[7,{slots:3,make:()=>makeNativeSubmarineParts()}]]);

/** Render original rigid-part actors: bank3 gulls, bank6 mallards, bank7 the
 * Port Blue submarine and bank8 penguins.
 * Parts are rigid, so one shared high-resolution part set per species serves
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
   for(let slot=0;slot<2;slot++){const bank=resourceWordsE73c[(0x9c+slot*8)/4]|0,spec=RIGID_BANKS.get(bank);
    if(!spec)continue;if(resourceWordsE73c[(0x44+slot*44)/4]!==spec.slots)throw new RangeError(bank===8?'Penguin bank requires all four loaded geometry slots':bank===7?'Submarine bank requires all three loaded geometry slots':'Bird bank requires all five loaded geometry slots');species.set(slot,bank);}
   const draws=presentation.draws.filter(d=>{if(!Number.isInteger(d?.resourceIndex)||d.resourceIndex<0||d.resourceIndex>1)throw new RangeError('Actor draw selects an unloaded resource slot');return species.has(d.resourceIndex);});
   for(const bank of species.values())if(!models.has(bank))models.set(bank,RIGID_BANKS.get(bank).make());
   const previous=slotSpecies;slotSpecies=species;
   try{return renderer.update({draws});}catch(error){slotSpecies=previous;throw error;}
  },
  snapshot:()=>({species:[...models.values()].map(m=>m.species)}),
  dispose(){if(disposed)return;disposed=true;renderer.dispose();models.forEach(m=>m.dispose());models.clear();}
 };
}
