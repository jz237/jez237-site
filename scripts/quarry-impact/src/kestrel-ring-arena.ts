import type R from '@dimforge/rapier3d-compat';
import type {ArenaLayout} from './derby-arena';
/** A ring arena: an asphalt track around a walled central island, so every run-up chooses a side. */
export const KESTREL_RING_ARENA:ArenaLayout={x:0,z:0,radius:50,segments:120,spawnRadius:32,fenceRadius:55,island:14};
const ring=(radius:number,segments:number)=>Array.from({length:segments},(_,i)=>{
 const yaw=i/segments*Math.PI*2;
 return{x:Math.sin(yaw)*radius,z:Math.cos(yaw)*radius,y:1,yaw,half:[radius*Math.PI/segments+.07,1,.45]as const};
});
/** Outer wall and island wall, one continuous ring each. */
export const KESTREL_RING_BARRIERS=[...ring(KESTREL_RING_ARENA.radius,KESTREL_RING_ARENA.segments),...ring(KESTREL_RING_ARENA.island!,36)];
export function buildKestrelRingPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const floor=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(floor.handle);
  world.createCollider(api.ColliderDesc.cuboid(90,.5,90).setTranslation(0,-.5,0).setFriction(.9),floor);
  for(const s of KESTREL_RING_BARRIERS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.55).setRestitution(.02),body);}
  // The island itself is solid behind its wall.
  const island=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(0,1,0));owned.push(island.handle);
  world.createCollider(api.ColliderDesc.cylinder(1,KESTREL_RING_ARENA.island!-.5).setFriction(.55),island);
  return owned;
 }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
}
export const kestrelRingGround={height:(_x:number,_z:number)=>0,surface:(_x:number,_z:number):'asphalt'=>'asphalt',outside:(x:number,y:number,z:number)=>Math.hypot(x,z)>66||y< -8};
