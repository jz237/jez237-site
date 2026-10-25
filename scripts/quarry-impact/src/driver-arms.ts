import * as T from 'three';
/** The driver's hands follow the steering wheel (cosmetic): turning right, the left arm pitches up about its shoulder
 * and the right arm down (the hands riding round the rim), by up to STEER_ARMS.reach radians at STEER_ARMS.lock radians of
 * front-wheel steer; turning left, the other way. The arms are the figure's own cylinders reaching for the wheel (as
 * driverFigure makes them, and as bailOut finds them); a driver out of the car has none left to move. */
export const STEER_ARMS={lock:.6,reach:.5} as const;
/** The right hand leaves the wheel for the levers: held down at the handbrake while it is pulled, and down for HAND.shift s
 * at each gear change; reaching, the arm pitches down HAND.down and swings in HAND.inward radians toward the tunnel,
 * moving at HAND.rate a second. */
export const HAND={down:.75,inward:.55,rate:9,shift:.35} as const;
export type HandState={reach:number;gear:number;shift:number};
export const newHandState=(gear=1):HandState=>({reach:0,gear,shift:0});
/** Advance the right hand: the handbrake held, the gear now, over dt seconds; returns how far it is off the wheel, 0–1. */
export function handReach(s:HandState,handbrake:boolean,gear:number,dt:number){
  if(!(dt>0))return s.reach;
  if(Number.isFinite(gear)&&gear!==s.gear){if(Number.isFinite(s.gear))s.shift=HAND.shift;s.gear=gear;}
  s.shift=Math.max(0,s.shift-dt);const want=handbrake||s.shift>0?1:0;
  s.reach+=Math.max(-HAND.rate*dt,Math.min(HAND.rate*dt,want-s.reach));return s.reach;
}
type Rest={position:T.Vector3;shoulder:T.Vector3;tilt:number};
const along=new T.Vector3(),turn=new T.Euler(0,0,0,'YXZ');
/** How far the arms pitch for this much front-wheel steer (radians, + is right). */
export const armLift=(steering:number)=>Math.max(-1,Math.min(1,(Number.isFinite(steering)?steering:0)/STEER_ARMS.lock))*STEER_ARMS.reach;
export function steerArms(figure:T.Object3D,steering:number,reach=0){
  const lift=armLift(steering),off=Math.max(0,Math.min(1,Number.isFinite(reach)?reach:0));
  for(const arm of figure.children){
    if(!(arm instanceof T.Mesh)||!(arm.geometry instanceof T.CylinderGeometry)||Math.abs(arm.rotation.x)<=.5)continue;
    let rest=arm.userData.steerRest as Rest|undefined;
    if(!rest){
      // The shoulder is the arm's back end: half its length back along the tilted axis from its middle.
      const tilt=arm.rotation.x,half=arm.geometry.parameters.height/2;
      rest={position:arm.position.clone(),tilt,shoulder:arm.position.clone().sub(along.set(0,Math.cos(tilt),Math.sin(tilt)).multiplyScalar(half))};
      arm.userData.steerRest=rest;arm.rotation.order='YXZ';
    }
    // Less tilt raises the hand: the left arm (−x) lifts turning right. The right arm (+x) goes to the levers when it reaches.
    const side=Math.sign(rest.position.x||1),right=side>0?off:0,pitch=side*lift*(1-right)+HAND.down*right,yaw=-HAND.inward*right;
    arm.rotation.set(rest.tilt+pitch,yaw,0);
    arm.position.copy(rest.position).sub(rest.shoulder).applyEuler(turn.set(pitch,yaw,0,'YXZ')).add(rest.shoulder);
  }
}
