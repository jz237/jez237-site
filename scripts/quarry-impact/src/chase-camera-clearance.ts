import * as T from 'three';
import type {CameraObstruction} from './demo-camera-visibility';
/** Shorten the existing chase boom; never rotate to another side of the car.
 * Parallel aperture rays keep the near plane clear of thin walls and posts. */
export function clearChasePosition(anchor:T.Vector3,desired:T.Vector3,obstruction:CameraObstruction){
 const delta=desired.clone().sub(anchor),length=delta.length();if(length<.001)return desired.clone();
 const direction=delta.clone().divideScalar(length),right=new T.Vector3().crossVectors(direction,new T.Vector3(0,1,0));
 if(right.lengthSq()<.001)right.set(1,0,0);else right.normalize();
 const up=new T.Vector3().crossVectors(right,direction).normalize();let distance=length;
 for(const [x,y]of [[0,0],[-.25,0],[.25,0],[0,-.25],[0,.25]]){
  const offset=right.clone().multiplyScalar(x).addScaledVector(up,y);
  const hit=obstruction(anchor.clone().add(offset),desired.clone().add(offset));
  if(hit!==null&&Number.isFinite(hit)&&hit>=0)distance=Math.min(distance,Math.max(0,hit-.35));
 }
 return distance===length?desired.clone():anchor.clone().addScaledVector(direction,distance);
}
