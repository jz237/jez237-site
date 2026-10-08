import type R from '@dimforge/rapier3d-compat';
import type {ArenaLayout} from './derby-arena';
import {registerTerrainContacts} from './terrain-collision';

export const BRIARHILL_ARENA:ArenaLayout={x:0,z:0,radius:58,segments:128,spawnRadius:34,fenceRadius:63};
const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
const span=160,step=2,columns=81;
// A flat starting ring separates the central crest from the banked perimeter.
const heights=Float32Array.from({length:columns*columns},(_,i)=>{
 const r=Math.hypot(i%columns*step-span/2,Math.floor(i/columns)*step-span/2);
 return 2.2*(1-smooth(r/18))+4.5*smooth((r-40)/16);
});
export function briarhillHeight(x:number,z:number){
 const gx=Math.max(0,Math.min(columns-1-1e-7,(x+span/2)/step)),gz=Math.max(0,Math.min(columns-1-1e-7,(z+span/2)/step)),ix=Math.floor(gx),iz=Math.floor(gz),u=gx-ix,v=gz-iz;
 const a=heights[iz*columns+ix],b=heights[iz*columns+ix+1],c=heights[(iz+1)*columns+ix],d=heights[(iz+1)*columns+ix+1];
 return u+v<=1?a+(b-a)*u+(c-a)*v:d+(c-d)*(1-u)+(b-d)*(1-v);
}
/** Rendering, suspension rays and collision tiles use the same triangles. */
export function briarhillPatch(x0=0,z0=0,nx=80,nz=80){
 const positions=new Float32Array((nx+1)*(nz+1)*3),uv=new Float32Array((nx+1)*(nz+1)*2),indices=new Uint32Array(nx*nz*6);
 for(let z=0;z<=nz;z++)for(let x=0;x<=nx;x++){const i=z*(nx+1)+x,gx=x+x0,gz=z+z0;positions.set([gx*step-span/2,heights[gz*columns+gx],gz*step-span/2],i*3);uv.set([gx/80,1-gz/80],i*2);}
 let at=0;for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const a=z*(nx+1)+x,b=a+1,c=a+nx+1;indices.set([a,c,b,b,c,c+1],at);at+=6;}
 return{positions,uv,indices};
}
export const BRIARHILL_BARRIERS=Array.from({length:128},(_,i)=>{
 const yaw=i/128*Math.PI*2,x=Math.sin(yaw)*58,z=Math.cos(yaw)*58;
 return{x,z,y:briarhillHeight(x,z)+1,yaw,half:[1.48,1.2,.45]as const};
});
export const briarhillGround={height:briarhillHeight,surface:(_x:number,_z:number):'gravel'=>'gravel',outside:(x:number,y:number,z:number)=>Math.hypot(x,z)>70||y< -8,
 isDrivingObstacle:(c:R.Collider)=>(c.parent()?.userData as {arenaSurface?:string}|undefined)?.arenaSurface!=='briarhill-bowl-v1'};
export function buildBriarhillPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const ground=world.createRigidBody(api.RigidBodyDesc.fixed());ground.userData={arenaSurface:'briarhill-bowl-v1'};owned.push(ground.handle);
  const tiles:R.Collider[]=[];
  for(let z=0;z<80;z+=16)for(let x=0;x<80;x+=16){const p=briarhillPatch(x,z,16,16);tiles.push(world.createCollider(api.ColliderDesc.trimesh(p.positions,p.indices).setFriction(.85),ground));}
  registerTerrainContacts(world,tiles);
  for(const s of BRIARHILL_BARRIERS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.55).setRestitution(.02),body);}
  return owned;
 }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
}
