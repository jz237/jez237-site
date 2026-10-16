import {DEFINITIONS,CAR_KINDS,type CarKind} from './rules';
export const LEGACY_ONLINE_CARS:readonly CarKind[]=['coupe','sedan','hatch'];
export const ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='kite'&&kind!=='morrow');
export const validOnlineCar=(kind:unknown):kind is CarKind=>typeof kind==='string'&&MORROW_ONLINE_CARS.includes(kind as CarKind);
export const extendedOnlineCar=(kind:unknown)=>validOnlineCar(kind)&&!LEGACY_ONLINE_CARS.includes(kind);

export const KITE_ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='morrow');
export const MORROW_ONLINE_CARS:readonly CarKind[]=CAR_KINDS;
export const onlineCarChoices=(s:{rosterSupport?:true;kiteSupport?:true;morrowSupport?:true})=>s.rosterSupport?(s.kiteSupport?(s.morrowSupport?MORROW_ONLINE_CARS:KITE_ONLINE_CARS):ONLINE_CARS):LEGACY_ONLINE_CARS;
