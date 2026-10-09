import {performanceGrid} from './performance-grid';
import type {ClassLimit} from './performance-class';
import type {GridLineup} from './grid-rules';
import {DEFINITIONS,type CarKind} from './rules';
import {normalizeSetup,stockSetup,type Garage,type Setup} from './garage';
import type {GridPerformance} from './grid-rules';
/** Copy performance only; every returned setup owns its tuning and paint data. */
export function performanceSetup(kind:CarKind,cosmetics:Setup,performance:Setup):Setup{
 return normalizeSetup({...cosmetics,engine:performance.engine,tires:performance.tires,armor:performance.armor,tune:{...performance.tune}},kind);
}
export function eventGridSetup(kind:CarKind,selected:CarKind,garage:Garage,rule:GridPerformance='open',player=false,paint=DEFINITIONS[kind].color):Setup|undefined{
 if(rule==='open')return player?garage.cars[kind].setup:undefined;
 const cosmetics=player?garage.cars[kind].setup:{...stockSetup(kind),paint};
 return performanceSetup(kind,cosmetics,rule==='stock'?stockSetup(kind):garage.cars[selected].setup);
}

export function eventPerformanceGrid(selected:CarKind,options:{lineup?:GridLineup;performance?:GridPerformance;classLimit?:ClassLimit},garage:Garage){return performanceGrid(selected,options.lineup,options.classLimit,(kind,player)=>eventGridSetup(kind,selected,garage,options.performance,player));}
