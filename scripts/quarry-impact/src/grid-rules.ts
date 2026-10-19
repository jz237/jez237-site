import {CAR_KINDS,DEFINITIONS,type CarKind} from './rules';
export const GRID_LINEUPS={mixed:'Mixed vehicles',selected:'Same model',drivetrain:'Same drivetrain',weight:'Same weight class',fwd:'Front-wheel-drive opponents',rwd:'Rear-wheel-drive opponents',american:'American-style opponents',european:'European-style opponents',muscle:'Muscle-car opponents'} as const;
export type GridLineup=keyof typeof GRID_LINEUPS;
export type GridPerformance='open'|'stock'|'matched'|'class';
export const GRID_PERFORMANCE={class:'Class-matched engines · garage chassis',open:'My garage vs factory opponents',stock:'Factory performance for everyone',matched:'Same upgrades and tuning for everyone'} as const;
export const isGridLineup=(v:unknown):v is GridLineup=>typeof v==='string'&&Object.hasOwn(GRID_LINEUPS,v);
export const isGridPerformance=(v:unknown):v is GridPerformance=>typeof v==='string'&&Object.hasOwn(GRID_PERFORMANCE,v);
/** Match the actual driven axles; weight classes use factory chassis mass so
 * fitting armor never silently changes the eligible field. */
export const vehicleDrivetrain=(kind:CarKind)=>(kind==='tern'||kind==='kite')?'FWD':kind==='sedan'||kind==='hatch'||kind==='trail'?'AWD':'RWD';
export const vehicleWeightClass=(kind:CarKind)=>DEFINITIONS[kind].mass<1200?'Light':DEFINITIONS[kind].mass<1700?'Middle':'Heavy';
/** Original fictional roster groupings; these describe each design's styling. */
export const VEHICLE_GROUPS:Record<CarKind,{region:'american'|'european';muscle:boolean}>={
 ravenhill:{region:'american',muscle:false},pipit:{region:'european',muscle:false},linnet:{region:'european',muscle:false},tordal:{region:'european',muscle:false},starfin:{region:'american',muscle:false},saber:{region:'european',muscle:false},alder:{region:'european',muscle:false},morrow:{region:'american',muscle:true},kite:{region:'european',muscle:false},coupe:{region:'american',muscle:true},sedan:{region:'european',muscle:false},hatch:{region:'european',muscle:false},muscle:{region:'american',muscle:true},wagon:{region:'american',muscle:false},utility:{region:'american',muscle:false},compact:{region:'european',muscle:false},van:{region:'european',muscle:false},tern:{region:'european',muscle:false},marten:{region:'european',muscle:false},buggy:{region:'american',muscle:false},shuttle:{region:'european',muscle:false},regent:{region:'american',muscle:false},trail:{region:'european',muscle:false},
};
export const fixedOpponentSet=(lineup:GridLineup|undefined)=>lineup==='fwd'||lineup==='rwd'||lineup==='american'||lineup==='european'||lineup==='muscle';
export function gridPool(selected:CarKind,lineup:GridLineup='mixed'):CarKind[]{
 return CAR_KINDS.filter(k=>lineup==='selected'?k===selected:lineup==='drivetrain'?vehicleDrivetrain(k)===vehicleDrivetrain(selected):lineup==='weight'?vehicleWeightClass(k)===vehicleWeightClass(selected):lineup==='fwd'?vehicleDrivetrain(k)==='FWD':lineup==='rwd'?vehicleDrivetrain(k)==='RWD':lineup==='american'||lineup==='european'?VEHICLE_GROUPS[k].region===lineup:lineup==='muscle'?VEHICLE_GROUPS[k].muscle:true);
}
export function gridCarKind(index:number,selected:CarKind,lineup:GridLineup='mixed',rotateMixed=false):CarKind{
 const pool=gridPool(selected,lineup);
 if(fixedOpponentSet(lineup)&&rotateMixed){const start=Math.max(0,pool.indexOf(selected));return pool[(index+start)%pool.length];}
 if(index===0)return selected;
return pool[(index+(rotateMixed||lineup!=='mixed'?pool.indexOf(selected):0))%pool.length];
}
export function gridDescription(selected:CarKind,lineup:GridLineup='mixed'):string{
 const pool=gridPool(selected,lineup),group=lineup==='selected'?DEFINITIONS[selected].name:lineup==='drivetrain'?vehicleDrivetrain(selected):lineup==='weight'?vehicleWeightClass(selected)+' class · factory mass '+(vehicleWeightClass(selected)==='Light'?'under 1,200 kg':vehicleWeightClass(selected)==='Middle'?'1,200–1,699 kg':'1,700 kg and over'):fixedOpponentSet(lineup)?GRID_LINEUPS[lineup]:'All vehicles';
 return `${group}. ${pool.length} eligible ${pool.length===1?'model':'models'}: ${pool.map(k=>DEFINITIONS[k].name).join(', ')}. Larger fields repeat eligible models.${fixedOpponentSet(lineup)?' Solo events keep your chosen car; demos use only this set.':''}`;
}
export function gridRecordKey(key:string,selected:CarKind,lineup:GridLineup='mixed',performance:GridPerformance='open'):string{
 return lineup==='mixed'&&performance==='open'?key:`${key}:grid:${lineup}:${performance}:${selected}`;
}
