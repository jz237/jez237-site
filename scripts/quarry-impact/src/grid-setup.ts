import {classEngineSetup,classEngineDescription} from './class-engine';
import {performanceGrid} from './performance-grid';
import type {ClassLimit} from './performance-class';
import type {GridLineup} from './grid-rules';
import {DEFINITIONS,type CarKind} from './rules';
import {normalizeSetup,stockSetup,type Garage,type Setup} from './garage';
import type {GridPerformance} from './grid-rules';
/** Copy performance only; every returned setup owns its tuning and paint data. */
export function performanceSetup(kind:CarKind,cosmetics:Setup,performance:Setup):Setup{
 const {engineRestriction:_,...appearance}=cosmetics;
 return normalizeSetup({...appearance,...(performance.engineRestriction?{engineRestriction:performance.engineRestriction}:{}),engine:performance.engine,tires:performance.tires,armor:performance.armor,tune:{...performance.tune}},kind);
}
export function eventGridSetup(kind:CarKind,selected:CarKind,garage:Garage,rule:GridPerformance='open',player=false,paint=DEFINITIONS[kind].color,classLimit?:ClassLimit):Setup|undefined{
 if(rule==='class')return classEngineSetup(kind,garage.cars[kind].setup,classLimit);
 if(rule==='open')return player?garage.cars[kind].setup:undefined;
 const cosmetics=player?garage.cars[kind].setup:{...stockSetup(kind),paint};
 return performanceSetup(kind,cosmetics,rule==='stock'?stockSetup(kind):garage.cars[selected].setup);
}

export function eventPerformanceGrid(selected:CarKind,options:{lineup?:GridLineup;performance?:GridPerformance;classLimit?:ClassLimit},garage:Garage){
 const grid=performanceGrid(selected,options.lineup,options.classLimit,(kind,player)=>eventGridSetup(kind,selected,garage,options.performance,player,undefined,options.classLimit));
 if(options.performance==='class'){if(!options.classLimit)return {...grid,error:'Choose a maximum performance class for class-matched engines.',description:'Choose a maximum performance class for class-matched engines.'};grid.description+=' '+classEngineDescription(selected,garage.cars[selected].setup,options.classLimit);}
 return grid;
}
