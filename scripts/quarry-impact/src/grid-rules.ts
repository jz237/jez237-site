import {CAR_KINDS,DEFINITIONS,type CarKind} from './rules';
export const GRID_LINEUPS={mixed:'Mixed vehicles',selected:'Same model',drivetrain:'Same drivetrain',weight:'Same weight class'} as const;
export type GridLineup=keyof typeof GRID_LINEUPS;
export type GridPerformance='open'|'stock'|'matched';
export const GRID_PERFORMANCE={open:'My garage vs factory opponents',stock:'Factory performance for everyone',matched:'Same upgrades and tuning for everyone'} as const;
export const isGridLineup=(v:unknown):v is GridLineup=>typeof v==='string'&&Object.hasOwn(GRID_LINEUPS,v);
export const isGridPerformance=(v:unknown):v is GridPerformance=>typeof v==='string'&&Object.hasOwn(GRID_PERFORMANCE,v);
/** Match the actual driven axles; weight classes use factory chassis mass so
 * fitting armor never silently changes the eligible field. */
export const vehicleDrivetrain=(kind:CarKind)=>kind==='tern'?'FWD':kind==='sedan'||kind==='hatch'?'AWD':'RWD';
export const vehicleWeightClass=(kind:CarKind)=>DEFINITIONS[kind].mass<1200?'Light':DEFINITIONS[kind].mass<1700?'Middle':'Heavy';
export function gridPool(selected:CarKind,lineup:GridLineup='mixed'):CarKind[]{
 return CAR_KINDS.filter(k=>lineup==='selected'?k===selected:lineup==='drivetrain'?vehicleDrivetrain(k)===vehicleDrivetrain(selected):lineup==='weight'?vehicleWeightClass(k)===vehicleWeightClass(selected):true);
}
export function gridCarKind(index:number,selected:CarKind,lineup:GridLineup='mixed',rotateMixed=false):CarKind{
 if(index===0)return selected;
 const pool=gridPool(selected,lineup);return pool[(index+(rotateMixed||lineup!=='mixed'?pool.indexOf(selected):0))%pool.length];
}
export function gridDescription(selected:CarKind,lineup:GridLineup='mixed'):string{
 const pool=gridPool(selected,lineup),group=lineup==='selected'?DEFINITIONS[selected].name:lineup==='drivetrain'?vehicleDrivetrain(selected):lineup==='weight'?vehicleWeightClass(selected)+' class · factory mass '+(vehicleWeightClass(selected)==='Light'?'under 1,200 kg':vehicleWeightClass(selected)==='Middle'?'1,200–1,699 kg':'1,700 kg and over'):'All vehicles';
 return `${group}. ${pool.length} eligible ${pool.length===1?'model':'models'}: ${pool.map(k=>DEFINITIONS[k].name).join(', ')}. Larger fields repeat eligible models.`;
}
export function gridRecordKey(key:string,selected:CarKind,lineup:GridLineup='mixed',performance:GridPerformance='open'):string{
 return lineup==='mixed'&&performance==='open'?key:`${key}:grid:${lineup}:${performance}:${selected}`;
}
