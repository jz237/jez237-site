import * as T from 'three';

/** One composition shared by the playable chase camera and comparison captures. */
export const CHASE_VIEW={distance:8.6,height:2.8,lookAhead:5.1,lookHeight:-.34,fov:52,speedDistance:.025} as const;
export function chaseComposition(position:T.Vector3,forward:T.Vector3,speed=0){
  return {position:position.clone().addScaledVector(forward,-CHASE_VIEW.distance-Math.abs(speed)*CHASE_VIEW.speedDistance).add(new T.Vector3(0,CHASE_VIEW.height,0)),
    target:position.clone().addScaledVector(forward,CHASE_VIEW.lookAhead).add(new T.Vector3(0,CHASE_VIEW.lookHeight,0))};
}
/** Clear midday: a strong sun over a modest sky fill, so sunlit ground and shadow read apart as in a photograph
 * (until r431 the fill was .38 and the sun 3.35, which flattened the picture). */
export const QUARRY_DAYLIGHT={sun:3.6,sky:.5,ambient:.22,exposure:1,fog:.0006,sunColor:0xffe8c9,skyColor:0xb6ccef,groundColor:0x75644b} as const;
