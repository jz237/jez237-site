import type R from '@dimforge/rapier3d-compat';
type Vec={x:number;y:number;z:number};
/** Relative tyre-contact velocity in the steered, ground-tangent wheel frame.
 * This measures lateral scrub, not longitudinal wheelspin: the raycast vehicle
 * does not expose an independently simulated driven-wheel angular velocity. */
export function wheelContactMotion(body:R.RigidBody,controller:R.DynamicRayCastVehicleController,index:number,forward:Vec,right:Vec){
 if(!controller.wheelIsInContact(index))return{lateral:0,longitudinal:0,angle:0};
 const point=controller.wheelContactPoint(index),normal=controller.wheelContactNormal(index);
 if(!point||!normal)return{lateral:0,longitudinal:0,angle:0};
 const steer=controller.wheelSteering(index)??0,c=Math.cos(steer),s=Math.sin(steer);
 let x=right.x*c-forward.x*s,y=right.y*c-forward.y*s,z=right.z*c-forward.z*s;
 const projection=x*normal.x+y*normal.y+z*normal.z;x-=normal.x*projection;y-=normal.y*projection;z-=normal.z*projection;
 const length=Math.hypot(x,y,z);if(length<1e-6)return{lateral:0,longitudinal:0,angle:0};x/=length;y/=length;z/=length;
 const velocity=body.velocityAtPoint(point),ground=controller.wheelGroundObject(index)?.parent()?.velocityAtPoint(point);
 const vx=velocity.x-(ground?.x??0),vy=velocity.y-(ground?.y??0),vz=velocity.z-(ground?.z??0);
 const lateral=vx*x+vy*y+vz*z;
 // side × normal points along the tyre's rolling direction.
 const longitudinal=vx*(y*normal.z-z*normal.y)+vy*(z*normal.x-x*normal.z)+vz*(x*normal.y-y*normal.x);
 return{lateral,longitudinal,angle:Math.atan2(lateral,Math.max(.01,Math.abs(longitudinal)))};
}
