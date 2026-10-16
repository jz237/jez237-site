import {DEFINITIONS,CAR_KINDS,type CarKind} from './rules';
export const LEGACY_ONLINE_CARS:readonly CarKind[]=['coupe','sedan','hatch'];
export const ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='kite'&&kind!=='morrow');
export const validOnlineCar=(kind:unknown):kind is CarKind=>typeof kind==='string'&&KITE_ONLINE_CARS.includes(kind as CarKind);
export const extendedOnlineCar=(kind:unknown)=>validOnlineCar(kind)&&!LEGACY_ONLINE_CARS.includes(kind);

export const KITE_ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='morrow');
export const onlineCarChoices=(s:{rosterSupport?:true;kiteSupport?:true})=>s.rosterSupport?(s.kiteSupport?KITE_ONLINE_CARS:ONLINE_CARS):LEGACY_ONLINE_CARS;
