import type R from '@dimforge/rapier3d-compat';
import type {ArenaLayout} from './derby-arena';
import {tagImpactMaterial} from './impact-material';
/** A chamfered concrete container yard; container stacks line each corner chamfer flush, so no car can be trapped behind them. */
export const GULLHAVEN_OUTLINE=[{x:-50,z:-44},{x:50,z:-44},{x:58,z:-36},{x:58,z:36},{x:50,z:44},{x:-50,z:44},{x:-58,z:36},{x:-58,z:-36}] as const;
export const GULLHAVEN_ARENA:ArenaLayout={x:0,z:0,radius:58,segments:8,spawnRadius:32,fenceRadius:66,outline:GULLHAVEN_OUTLINE};
type Solid={material:'concrete'|'yellow'|'container';x:number;y:number;z:number;yaw:number;half:readonly [number,number,number]};
const wall:Solid[]=GULLHAVEN_OUTLINE.flatMap((a,i)=>{
 const b=GULLHAVEN_OUTLINE[(i+1)%GULLHAVEN_OUTLINE.length],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz),count=Math.ceil(length/3);
 return Array.from({length:count},(_,j)=>{const t=(j+.5)/count;return{material:(j%8<4?'concrete':'yellow') as Solid['material'],x:a.x+dx*t,z:a.z+dz*t,y:1,yaw:-Math.atan2(dz,dx),half:[length/count/2+.08,1,.5]as const};});
});
/** Two-high stacks of 12 m containers laid flush along each corner chamfer. */
const stacks:Solid[]=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sz])=>({material:'container' as const,x:sx*(54-1.25),z:sz*(40-1.25),y:2.6,yaw:-Math.atan2(sz,-sx),half:[6.1,2.6,1.22]as const}));
export const GULLHAVEN_SOLIDS:readonly Solid[]=[...wall,...stacks];
export function buildGullhavenPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const floor=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(floor.handle);
  world.createCollider(api.ColliderDesc.cuboid(90,.5,90).setTranslation(0,-.5,0).setFriction(.88),floor);
  for(const s of GULLHAVEN_SOLIDS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);tagImpactMaterial(world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(s.material==='container'?.5:.55).setRestitution(.02),body),s.material==='container'?'metal':'concrete');}
  return owned;
 }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
}
export const gullhavenGround={height:(_x:number,_z:number)=>0,surface:(_x:number,_z:number):'asphalt'=>'asphalt',outside:(x:number,y:number,z:number)=>Math.abs(x)>72||Math.abs(z)>60||y< -8};
