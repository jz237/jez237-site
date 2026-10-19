import type R from '@dimforge/rapier3d-compat';
import type {ArenaLayout} from './derby-arena';
import {tagImpactMaterial} from './impact-material';
/** A long dirt stadium oval: two 35 m semicircles joined by 60 m straights, so derbies get
 * long run-ups down the straights and tight scraps in the turns. */
const R0=35,HALF_STRAIGHT=30;
export const MOORFIELD_OUTLINE=(()=>{const pts:{x:number;z:number}[]=[];for(const side of [1,-1])for(let i=0;i<=16;i++){const a=-Math.PI/2+i/16*Math.PI;pts.push({x:side*(HALF_STRAIGHT+R0*Math.cos(a)),z:side*R0*Math.sin(a)});}return pts;})();
export const MOORFIELD_ARENA:ArenaLayout={x:0,z:0,radius:HALF_STRAIGHT+R0,segments:34,spawnRadius:26,fenceRadius:72,outline:MOORFIELD_OUTLINE};
type Solid={material:'concrete'|'red';x:number;y:number;z:number;yaw:number;half:readonly [number,number,number]};
export const MOORFIELD_SOLIDS:readonly Solid[]=MOORFIELD_OUTLINE.flatMap((a,i)=>{
 const b=MOORFIELD_OUTLINE[(i+1)%MOORFIELD_OUTLINE.length],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz),count=Math.max(1,Math.ceil(length/3));
 return Array.from({length:count},(_,j)=>{const t=(j+.5)/count;return{material:((i+j)%6<3?'concrete':'red') as Solid['material'],x:a.x+dx*t,z:a.z+dz*t,y:1,yaw:-Math.atan2(dz,dx),half:[length/count/2+.1,1,.5]as const};});
});
export function buildMoorfieldPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const floor=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(floor.handle);
  world.createCollider(api.ColliderDesc.cuboid(110,.5,70).setTranslation(0,-.5,0).setFriction(.8),floor);
  for(const s of MOORFIELD_SOLIDS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);tagImpactMaterial(world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.55).setRestitution(.02),body),'concrete');}
  return owned;
 }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
}
export const moorfieldGround={height:(_x:number,_z:number)=>0,surface:(_x:number,_z:number):'gravel'=>'gravel',outside:(x:number,y:number,z:number)=>Math.abs(x)>80||Math.abs(z)>50||y< -8};
