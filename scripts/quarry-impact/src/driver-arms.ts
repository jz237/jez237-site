import * as T from 'three';
/** The driver's hands follow the steering wheel (cosmetic): turning right, the left arm pitches up about its shoulder
 * and the right arm down (the hands riding round the rim), by up to STEER_ARMS.reach radians at STEER_ARMS.lock radians of
 * front-wheel steer; turning left, the other way. The arms are the figure's own cylinders reaching for the wheel (as
 * driverFigure makes them, and as bailOut finds them); a driver out of the car has none left to move. */
export const STEER_ARMS={lock:.6,reach:.5} as const;
type Rest={position:T.Vector3;shoulder:T.Vector3;tilt:number};
const X=new T.Vector3(1,0,0),along=new T.Vector3();
/** How far the arms pitch for this much front-wheel steer (radians, + is right). */
export const armLift=(steering:number)=>Math.max(-1,Math.min(1,(Number.isFinite(steering)?steering:0)/STEER_ARMS.lock))*STEER_ARMS.reach;
export function steerArms(figure:T.Object3D,steering:number){
  const lift=armLift(steering);
  for(const arm of figure.children){
    if(!(arm instanceof T.Mesh)||!(arm.geometry instanceof T.CylinderGeometry)||Math.abs(arm.rotation.x)<=.5)continue;
    let rest=arm.userData.steerRest as Rest|undefined;
    if(!rest){
      // The shoulder is the arm's back end: half its length back along the tilted axis from its middle.
      const tilt=arm.rotation.x,half=arm.geometry.parameters.height/2;
      rest={position:arm.position.clone(),tilt,shoulder:arm.position.clone().sub(along.set(0,Math.cos(tilt),Math.sin(tilt)).multiplyScalar(half))};
      arm.userData.steerRest=rest;
    }
    // Less tilt raises the hand: the left arm (−x) lifts turning right.
    const pitch=Math.sign(rest.position.x||1)*lift;
    arm.rotation.x=rest.tilt+pitch;
    arm.position.copy(rest.position).sub(rest.shoulder).applyAxisAngle(X,pitch).add(rest.shoulder);
  }
}
