import type R from '@dimforge/rapier3d-compat';
export type SurfaceContact={key:string;impulse:number;speed:number};
/** A new moving contact always leaves a mark. Continuing rubs are sampled at
 * 4 Hz; separating and touching again starts another mark immediately. */
export class CollisionScars {
 private lastSeen=new Map<string,number>();
 private lastMarked=new Map<string,number>();
 clear(){this.lastSeen.clear();this.lastMarked.clear();}
 adjudicate<C extends SurfaceContact>(contacts:Iterable<C>,time:number):C[]{
  if(!Number.isFinite(time))return[];
  const strongest=new Map<string,C>();
  for(const c of contacts){
   if(!Number.isFinite(c.impulse)||!Number.isFinite(c.speed)||c.impulse<=0||c.speed<=1e-5)continue;
   const previous=strongest.get(c.key);if(!previous||c.impulse>previous.impulse||c.impulse===previous.impulse&&c.speed>previous.speed)strongest.set(c.key,c);
  }
  const result:C[]=[];
  for(const [key,c]of strongest){
   const separate=time-(this.lastSeen.get(key)??-Infinity)>1/60+1e-6;
   this.lastSeen.set(key,time);
   if(separate||time-(this.lastMarked.get(key)??-Infinity)>=.25){this.lastMarked.set(key,time);result.push(c);}
  }
  // Removed cars and scenery pairs must not accumulate for a long free drive.
  for(const [key,seen]of this.lastSeen)if(time-seen>2){this.lastSeen.delete(key);this.lastMarked.delete(key);}
  return result;
 }
}

type Vec={x:number;y:number;z:number};
type Motion={v:Vec;w:Vec};
/** Sample before the solver removes closing velocity, including moving props. */
export function captureCollisionMotion(world:R.World){
 const motion=new Map<number,Motion>();
 world.forEachRigidBody(body=>{if(!body.isFixed())motion.set(body.handle,{v:{...body.linvel()},w:{...body.angvel()}});});
 return motion;
}
/** Angular motion matters for a stationary car struck on a spinning corner. */
export function collisionPointVelocity(world:R.World,motion:ReadonlyMap<number,Motion>,handle:number,point:Vec):Vec{
 const body=world.getCollider(handle)?.parent(),state=body&&motion.get(body.handle);
 if(!body||!state)return{x:0,y:0,z:0};
 const center=body.worldCom(),r={x:point.x-center.x,y:point.y-center.y,z:point.z-center.z},{v,w}=state;
 return{x:v.x+w.y*r.z-w.z*r.y,y:v.y+w.z*r.x-w.x*r.z,z:v.z+w.x*r.y-w.y*r.x};
}
