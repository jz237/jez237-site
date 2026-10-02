import {DEFINITIONS,clamp,type CarKind} from './rules';
import type {DamageVector} from './component-damage';

/** Mechanical damage uses chassis-local contact coordinates and structural
 * damage after armor. Bodywork deformation strength is a separate response. */
export function accumulateEngineDamage(current:number,kind:CarKind,point:DamageVector,damage:number){
 const before=clamp(Number.isFinite(current)?current:0,0,1);
 if(!Number.isFinite(damage)||damage<=1.8||![point.x,point.y,point.z].every(Number.isFinite))return before;
 const d=DEFINITIONS[kind],bayZ=point.z*(kind==='marten'?-1:1);
 // The cabin and opposite luggage/cargo compartment do not injure the engine.
 // A blow reaches the whole engine bay through the surrounding front/rear steel.
 const longitudinal=clamp((bayZ-d.wheelbase*.20)/(.48*d.halfLength-d.wheelbase*.20),0,1);
 const lateral=clamp((d.halfWidth+.12-Math.abs(point.x))/(d.halfWidth*.55),0,1);
 const vertical=clamp((.72-Math.abs(point.y+.08))/.35,0,1);
 if(Math.abs(point.z)>d.halfLength+.35)return before;
 return Math.min(1,before+(damage-1.8)/60*longitudinal*lateral*vertical);
}

/** Undefined mechanical condition belongs to a legacy authority. Preserve its
 * health-based power law rather than inventing component state from lost hits. */
export function enginePowerFactor(health:number,engineDamage?:number){
 if(!(health>0))return 0;
 if(engineDamage===undefined||!Number.isFinite(engineDamage))return .45+.55*clamp(health,0,100)/100;
 return 1-.70*clamp(engineDamage,0,1);
}
export function engineDamageLevel(health:number,engineDamage?:number){
 if(!(health>0))return 1;
 return engineDamage===undefined||!Number.isFinite(engineDamage)?clamp((40-health)/40,0,1):clamp(engineDamage,0,1);
}
export function engineStatus(health:number,engineDamage?:number){
 if(!(health>0))return 'ENGINE OFF';
 if(engineDamage===undefined)return health<40?'ENGINE DAMAGED':'ENGINE OK';
 const damage=engineDamageLevel(health,engineDamage);
 return damage>=.65?'ENGINE POWER LOW':damage>=.25?'ENGINE DAMAGED':'ENGINE OK';
}
