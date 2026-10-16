import {DEFINITIONS,CAR_KINDS,type CarKind} from './rules';
export const LEGACY_ONLINE_CARS:readonly CarKind[]=['coupe','sedan','hatch'];
export const ONLINE_CARS:readonly CarKind[]=CAR_KINDS.filter(kind=>kind!=='kite');
export const validOnlineCar=(kind:unknown):kind is CarKind=>typeof kind==='string'&&ONLINE_CARS.includes(kind as CarKind);
export const extendedOnlineCar=(kind:unknown)=>validOnlineCar(kind)&&!LEGACY_ONLINE_CARS.includes(kind);
