import type {Setup} from './garage';
import {gridCarKind,gridPool,fixedOpponentSet,type GridLineup} from './grid-rules';
import {DEFINITIONS,type CarKind} from './rules';
import {classEligible,classLimitLabel,performanceLabel,type ClassLimit} from './performance-class';
/** Resolve eligibility from the same build policy that constructs each car.
 * Player and opponent builds can differ in an open-garage solo event. */
export function performanceGrid(selected:CarKind,lineup:GridLineup|undefined,limit:ClassLimit|undefined,setup:(kind:CarKind,player:boolean)=>Setup|undefined,rotateMixed=false){
 const pool=gridPool(selected,lineup).filter(kind=>classEligible(kind,setup(kind,false),limit));
 const demoSet=rotateMixed&&fixedOpponentSet(lineup),lead=demoSet&&!pool.includes(selected)?pool[0]??selected:selected;
 const label=performanceLabel(lead,setup(lead,!demoSet));
 const error=!demoSet&&!classEligible(selected,setup(selected,true),limit)?`${DEFINITIONS[selected].name}: ${label} exceeds the ${classLimitLabel(limit)}. Choose another car, change its garage build, or raise the event limit.`:!pool.length?'No opponent builds qualify for this class and lineup. Change the lineup, build rule or class limit.':'';
 return {pool,label,error,description:error||`${label}. ${classLimitLabel(limit)}. ${pool.length} eligible opponent models: ${pool.map(k=>DEFINITIONS[k].name).join(', ')}. Larger fields repeat eligible models.`,
  at(index:number):CarKind{
   if(error)throw Error(error);
   if(demoSet){const start=Math.max(0,pool.indexOf(selected));return pool[(index+start)%pool.length];}
   if(!limit)return gridCarKind(index,selected,lineup,rotateMixed);
   if(index===0)return selected;
   const offset=Math.max(0,pool.indexOf(selected));return pool[(index+offset)%pool.length];
  }};
}
