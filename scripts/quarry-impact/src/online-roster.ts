import {DEFINITIONS,CAR_KINDS,type CarKind} from './rules';
export const LEGACY_ONLINE_CARS:readonly CarKind[]=['coupe','sedan','hatch'];
export const ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='kite'&&kind!=='morrow'&&kind!=='alder'&&kind!=='saber'&&kind!=='starfin');
export const validOnlineCar=(kind:unknown):kind is CarKind=>typeof kind==='string'&&ALDER_ONLINE_CARS.includes(kind as CarKind);
export const extendedOnlineCar=(kind:unknown)=>validOnlineCar(kind)&&!LEGACY_ONLINE_CARS.includes(kind);

export const KITE_ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='morrow'&&kind!=='alder'&&kind!=='saber'&&kind!=='starfin');
export const MORROW_ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='alder'&&kind!=='saber'&&kind!=='starfin');
// The Saber and Starfin are solo/demo/career only until a server negotiates them.
export const ALDER_ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='saber'&&kind!=='starfin');
export const onlineCarChoices=(s:{rosterSupport?:true;kiteSupport?:true;morrowSupport?:true;alderSupport?:true})=>s.rosterSupport?(s.kiteSupport?(s.morrowSupport?(s.alderSupport?ALDER_ONLINE_CARS:MORROW_ONLINE_CARS):KITE_ONLINE_CARS):ONLINE_CARS):LEGACY_ONLINE_CARS;
