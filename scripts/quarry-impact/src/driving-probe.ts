import {DEFINITIONS} from './rules';
import type {DriverCar} from './driving-brain';

/** Cast from the centre, excluding the driver's body, then remove its projected
 * footprint. Starting a ray ahead of the bonnet can skip a touching barrier. */
export function drivingObstacleClearance(car:Pick<DriverCar,'kind'>,angle:number,distance:number){
 const d=car.kind?DEFINITIONS[car.kind]:{halfLength:2.5,halfWidth:1};
 return Math.max(0,distance-Math.abs(Math.cos(angle))*d.halfLength-Math.abs(Math.sin(angle))*d.halfWidth-.12);
}
