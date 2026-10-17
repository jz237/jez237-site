import {ENGINE_RESTRICTIONS,type EngineRestriction} from './engine-packages';
import {vehicleSpecification,type PhysicsTuning} from './vehicle-physics';
import {CLASS_LIMITS,type ClassLimit,type PerformanceClass} from './performance-class-id';
import type {CarKind} from './rules';
/** Shared authority/client calculation. Input must already be normalized or
 * validated; no rendering, garage storage or browser dependencies belong here. */
export function physicsPerformanceRating(kind:CarKind,input:PhysicsTuning){
 const p=vehicleSpecification(kind,input),points=Math.max(1,Math.round(.6*p.force*p.speedLimit/p.mass*Math.sqrt(p.grip)));
 const grade:PerformanceClass=points<=99?'D':points<=164?'C':points<=234?'B':'A';return{points,grade};
}
export function selectClassEngine<T extends PhysicsTuning>(kind:CarKind,input:T,limit:ClassLimit):T{
 const {engineRestriction:_,...base}=input;
 const candidates=[...Array.from({length:4},(_,engine)=>({...base,engine})),...Object.keys(ENGINE_RESTRICTIONS).map(engineRestriction=>({...base,engine:0,engineRestriction:engineRestriction as EngineRestriction}))]as T[];
 const eligible=candidates.map(setup=>({setup,points:physicsPerformanceRating(kind,setup).points})).filter(c=>c.points<=CLASS_LIMITS[limit]);eligible.sort((a,b)=>b.points-a.points);
 if(!eligible.length)throw new Error('No engine package fits the selected class.');return eligible[0].setup;
}
