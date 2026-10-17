import {ENGINE_RESTRICTIONS,isEngineRestriction} from './engine-packages';
import {normalizeSetup,type Setup} from './garage';
import type {CarKind} from './rules';
export const GARAGE_ENGINES=[...Object.entries(ENGINE_RESTRICTIONS).reverse().map(([value,p])=>({value,label:`${p.label} · ${Math.round(p.output*100)}% factory output`})),...['Stock','Club','Sport','Competition'].map((label,i)=>({value:String(i),label}))];
export const garageEngineValue=(setup:Setup)=>setup.engineRestriction??String(setup.engine);
/** A package replaces the complete engine choice; it never stacks with upgrades. */
export function chooseGarageEngine(kind:CarKind,setup:Setup,value:string):Setup{
 if(!GARAGE_ENGINES.some(e=>e.value===value))return normalizeSetup(setup,kind);
 const {engineRestriction:_,...base}=setup;
 return normalizeSetup(isEngineRestriction(value)?{...base,engine:0,engineRestriction:value}:{...base,engine:Number(value)},kind);
}
