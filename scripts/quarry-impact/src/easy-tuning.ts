import {normalizeSetup,TUNE_FIELDS,type Setup} from './garage';
import type {CarKind} from './rules';
export const EASY_TUNE_KEYS=['gearing','suspension','differential','brakeBias'] as const;
export type EasyTuneKey=typeof EASY_TUNE_KEYS[number];
export const EASY_TUNE_FIELDS=EASY_TUNE_KEYS.map(key=>TUNE_FIELDS.find(field=>field.key===key)!);
export const customSuspension=(setup:Setup)=>['compression','rebound','rideHeight'].some(key=>(setup.tune[key as keyof Setup['tune']]??0)!==0);
/** Easy suspension uses the existing linked spring/damper/height preset.
 * Merely changing the view never calls this function or rewrites a setup. */
export function applyEasyTune(setup:Setup,kind:CarKind,key:EasyTuneKey,value:number):Setup{
 const next=normalizeSetup(setup,kind);
 if(!EASY_TUNE_KEYS.includes(key)||!Number.isFinite(value))return next;
 next.tune[key]=Math.max(-1,Math.min(1,value));
 if(key==='suspension')for(const field of ['compression','rebound','rideHeight'] as const)delete next.tune[field];
 return next;
}
