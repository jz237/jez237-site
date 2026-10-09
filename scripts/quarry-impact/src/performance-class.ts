import {normalizeSetup,setupPhysics,type Setup} from './garage';
import type {CarKind} from './rules';
import {CLASS_LIMITS,type ClassLimit,type PerformanceClass} from './performance-class-id';
export {CLASS_LIMITS,CLASS_CHOICES,isClassLimit,type ClassLimit,type PerformanceClass} from './performance-class-id';
/** Quarry's version-one build rating: gearing-independent drive envelope per
 * kilogram, adjusted for tyre grip. This is a classification estimate, not a
 * measured lap time. Chassis tuning remains free within the same class. */
export function performanceRating(kind:CarKind,input?:Setup){
 const setup=normalizeSetup(input,kind),p=setupPhysics(kind,setup);
 const points=Math.max(1,Math.round(.6*p.force*p.speedLimit/p.mass*Math.sqrt(p.grip)));
 const grade:PerformanceClass=points<=99?'D':points<=164?'C':points<=234?'B':'A';
 return {points,grade};
}
export function classEligible(kind:CarKind,setup:Setup|undefined,limit?:ClassLimit){return !limit||performanceRating(kind,setup).points<=CLASS_LIMITS[limit];}
export const classLimitLabel=(limit?:ClassLimit)=>limit?`Class ${limit} limit · ${CLASS_LIMITS[limit]} PP`:'Open class';
export const performanceLabel=(kind:CarKind,setup?:Setup)=>{const r=performanceRating(kind,setup);return `Class ${r.grade} · ${r.points} PP`;};
export const classRecordKey=(key:string,limit?:ClassLimit)=>limit?`${key}:pp1:${limit}`:key;
