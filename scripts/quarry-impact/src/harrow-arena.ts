import type R from '@dimforge/rapier3d-compat';
import type {ArenaLayout} from './derby-arena';
/** A compact hard-surface arena, with shorter run-ups than the Quarry floor. */
export const HARROW_ARENA:ArenaLayout={x:0,z:0,radius:48,segments:96,spawnRadius:34,fenceRadius:53};
export const HARROW_BARRIERS=Array.from({length:HARROW_ARENA.segments},(_,i)=>{
 const yaw=i/HARROW_ARENA.segments*Math.PI*2;
 return{x:Math.sin(yaw)*HARROW_ARENA.radius,z:Math.cos(yaw)*HARROW_ARENA.radius,y:1,yaw,half:[1.65,1,.45]as const};
});
export function buildHarrowPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const floor=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(floor.handle);
  world.createCollider(api.ColliderDesc.cuboid(90,.5,90).setTranslation(0,-.5,0).setFriction(.85),floor);
  for(const s of HARROW_BARRIERS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.55).setRestitution(.02),body);}
  return owned;
 }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
}
export const harrowGround={height:(_x:number,_z:number)=>0,surface:(_x:number,_z:number):'asphalt'=>'asphalt',outside:(x:number,y:number,z:number)=>Math.hypot(x,z)>68||y< -8};
