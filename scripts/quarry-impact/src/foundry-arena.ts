import type R from '@dimforge/rapier3d-compat';
import type {ArenaLayout} from './derby-arena';
import {registerTerrainContacts} from './terrain-collision';

export const FOUNDRY_OUTLINE=[{x:-43,z:-50},{x:43,z:-50},{x:58,z:-35},{x:58,z:35},{x:43,z:50},{x:-43,z:50},{x:-58,z:35},{x:-58,z:-35}] as const;
export const FOUNDRY_ARENA:ArenaLayout={x:0,z:0,radius:56,segments:8,spawnRadius:34,fenceRadius:65,outline:FOUNDRY_OUTLINE};
const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
const span=160,step=2,columns=81;
// Level central yard and start ring, with shallow raised loading banks at each side.
const heights=Float32Array.from({length:columns*columns},(_,i)=>{
 const x=i%columns*step-span/2;
 return 2.4*smooth((Math.abs(x)-38)/15);
});
export function foundryHeight(x:number,z:number){
 const gx=Math.max(0,Math.min(columns-1-1e-7,(x+span/2)/step)),gz=Math.max(0,Math.min(columns-1-1e-7,(z+span/2)/step)),ix=Math.floor(gx),iz=Math.floor(gz),u=gx-ix,v=gz-iz;
 const a=heights[iz*columns+ix],b=heights[iz*columns+ix+1],c=heights[(iz+1)*columns+ix],d=heights[(iz+1)*columns+ix+1];
 return u+v<=1?a+(b-a)*u+(c-a)*v:d+(c-d)*(1-u)+(b-d)*(1-v);
}
/** Rendering, suspension rays and collision tiles use the same triangles. */
export function foundryPatch(x0=0,z0=0,nx=80,nz=80){
 const positions=new Float32Array((nx+1)*(nz+1)*3),uv=new Float32Array((nx+1)*(nz+1)*2),indices=new Uint32Array(nx*nz*6);
 for(let z=0;z<=nz;z++)for(let x=0;x<=nx;x++){const i=z*(nx+1)+x,gx=x+x0,gz=z+z0;positions.set([gx*step-span/2,heights[gz*columns+gx],gz*step-span/2],i*3);uv.set([gx/80,1-gz/80],i*2);}
 let at=0;for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const a=z*(nx+1)+x,b=a+1,c=a+nx+1;indices.set([a,c,b,b,c,c+1],at);at+=6;}
 return{positions,uv,indices};
}
export const FOUNDRY_BARRIERS=FOUNDRY_OUTLINE.flatMap((a,i)=>{
 const b=FOUNDRY_OUTLINE[(i+1)%FOUNDRY_OUTLINE.length],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz),count=Math.ceil(length/3);
 return Array.from({length:count},(_,j)=>{const t=(j+.5)/count,x=a.x+dx*t,z=a.z+dz*t;return{x,z,y:foundryHeight(x,z)+1.2,yaw:-Math.atan2(dz,dx),half:[length/count/2+.12,1.35,.55]as const};});
});
export const foundrySurface=(x:number,z:number):'gravel'|'asphalt'=>Math.abs(z+.3*x)<12?'gravel':'asphalt';
export const foundryGround={height:foundryHeight,surface:foundrySurface,outside:(x:number,y:number,z:number)=>Math.abs(x)>70||Math.abs(z)>65||y< -8,
 isDrivingObstacle:(c:R.Collider)=>(c.parent()?.userData as {arenaSurface?:string}|undefined)?.arenaSurface!=='foundry-yard-v1'};
export function buildFoundryPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const ground=world.createRigidBody(api.RigidBodyDesc.fixed());ground.userData={arenaSurface:'foundry-yard-v1'};owned.push(ground.handle);
  const tiles:R.Collider[]=[];
  for(let z=0;z<80;z+=16)for(let x=0;x<80;x+=16){const p=foundryPatch(x,z,16,16);tiles.push(world.createCollider(api.ColliderDesc.trimesh(p.positions,p.indices).setFriction(.85),ground));}
  registerTerrainContacts(world,tiles);
  for(const s of FOUNDRY_BARRIERS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.55).setRestitution(.02),body);}
  return owned;
 }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
}
