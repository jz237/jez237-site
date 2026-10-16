import {DEFINITIONS,CAR_KINDS,type CarKind} from './rules';
export const LEGACY_ONLINE_CARS:readonly CarKind[]=['coupe','sedan','hatch'];
export const ONLINE_CARS=CAR_KINDS;
export const validOnlineCar=(kind:unknown):kind is CarKind=>typeof kind==='string'&&Object.hasOwn(DEFINITIONS,kind);
export const extendedOnlineCar=(kind:unknown)=>validOnlineCar(kind)&&!LEGACY_ONLINE_CARS.includes(kind);
