import {physicsPerformanceRating} from './class-engine-physics';
import {normalizeSetup,type Setup} from './garage';
import type {CarKind} from './rules';
import {CLASS_LIMITS,type ClassLimit,type PerformanceClass} from './performance-class-id';
export {CLASS_LIMITS,CLASS_CHOICES,isClassLimit,type ClassLimit,type PerformanceClass} from './performance-class-id';
/** Quarry's version-one build rating: gearing-independent drive envelope per
 * kilogram, adjusted for tyre grip. This is a classification estimate, not a
 * measured lap time. Chassis tuning remains free within the same class. */
export function performanceRating(kind:CarKind,input?:Setup){
 return physicsPerformanceRating(kind,normalizeSetup(input,kind));
}
export function classEligible(kind:CarKind,setup:Setup|undefined,limit?:ClassLimit){return !limit||performanceRating(kind,setup).points<=CLASS_LIMITS[limit];}
export const classLimitLabel=(limit?:ClassLimit)=>limit?`Class ${limit} limit · ${CLASS_LIMITS[limit]} PP`:'Open class';
export const performanceLabel=(kind:CarKind,setup?:Setup)=>{const r=performanceRating(kind,setup);return `Class ${r.grade} · ${r.points} PP`;};
export const classRecordKey=(key:string,limit?:ClassLimit)=>limit?`${key}:pp1:${limit}`:key;
