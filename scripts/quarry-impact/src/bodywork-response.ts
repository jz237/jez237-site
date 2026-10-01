import {clamp} from './rules';

/** Durable bodywork: normal contact does little harm; fast crashes still count. */
export function structuralDamage(impulse:number,closingSpeed:number){
  if(!Number.isFinite(impulse)||!Number.isFinite(closingSpeed))return 0;
  const speedGate=clamp((closingSpeed-1.8)/3,0,1);
  return clamp((impulse-3100)/1320,0,23)*speedGate;
}
export function bodyworkDentDamage(damage:number){return Math.max(0,damage-1.8)*.68;}
export function impactAudioSeverity(impulse:number){return clamp((impulse-1100)/900,0,28);}
