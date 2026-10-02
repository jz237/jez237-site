import type R from '@dimforge/rapier3d-compat';
import {COURSE_NAMES} from './course-id';
import {createIronfieldSolids} from './ironfield-venue';

type Point={x:number;z:number};
export type CourseBarrier=Point&{yaw:number;length:number};
const TAU=Math.PI*2,wrap=(t:number)=>((t%1)+1)%1;
// An original at-grade figure eight. Its start is on the eastern approach,
// clear of the crossing; equal-distance parameterization controls every grid.
const raw=(t:number)=>{const a=(t+.125)*TAU;return{x:110*Math.sin(a),z:64*Math.sin(a*2)};};
const dense=Array.from({length:4097},(_,i)=>raw(i/4096)),lengths=[0];
for(let i=1;i<dense.length;i++)lengths.push(lengths[i-1]+Math.hypot(dense[i].x-dense[i-1].x,dense[i].z-dense[i-1].z));
const length=lengths.at(-1)!;
function point(t:number):Point{
 const s=wrap(t)*length;let lo=0,hi=4096;
 while(lo+1<hi){const m=(lo+hi)>>1;if(lengths[m]<=s)lo=m;else hi=m;}
 const f=(s-lengths[lo])/(lengths[hi]-lengths[lo]);
 return{x:dense[lo].x+(dense[hi].x-dense[lo].x)*f,z:dense[lo].z+(dense[hi].z-dense[lo].z)*f};
}
const samples=Array.from({length:512},(_,i)=>point(i/512));
function distance(x:number,z:number){
 let best=Infinity;
 for(let i=0;i<samples.length;i++){
  const a=samples[i],b=samples[(i+1)%samples.length],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));
  best=Math.min(best,(x-a.x-dx*t)**2+(z-a.z-dz*t)**2);
 }
 return Math.sqrt(best);
}
export const IRONFIELD_BARRIERS:readonly CourseBarrier[]=(()=>{
 const result:CourseBarrier[]=[];
 for(let i=0;i<256;i++)for(const side of [-1,1]){
  const edge=(t:number)=>{const p=point(t),q=point(t+.00001),yaw=Math.atan2(q.x-p.x,q.z-p.z);return{x:p.x+Math.cos(yaw)*11*side,z:p.z-Math.sin(yaw)*11*side};};
  const a=edge(i/256),b=edge((i+1)/256),yaw=Math.atan2(b.x-a.x,b.z-a.z),x=(a.x+b.x)/2,z=(a.z+b.z)/2,len=Math.hypot(b.x-a.x,b.z-a.z);
  // Check both segment ends as well as its centre: a concrete corner must not
  // intrude into the other branch of the crossing.
  if(Math.hypot(x,z)<30&&[-.5,0,.5].some(f=>distance(x+Math.sin(yaw)*len*f,z+Math.cos(yaw)*len*f)<9.2))continue;
  result.push({x,z,yaw,length:len+.12});
 }
 return result;
})();
const finish=point(0),ahead=point(.0001);
/** Rendering and collisions use the same reachable solid records. */
export const IRONFIELD_SOLIDS=createIronfieldSolids(IRONFIELD_BARRIERS,{...finish,yaw:Math.atan2(ahead.x-finish.x,ahead.z-finish.z)});
export const IRONFIELD={
 id:'ironfield-figure-eight-v1' as const,name:COURSE_NAMES['ironfield-figure-eight-v1'],length,halfWidth:8.5,
 point,samples,checkpoints:Array.from({length:24},(_,i)=>point(i/24)),height:(_x:number,_z:number)=>0,distance,
 surface:(x:number,z:number):'asphalt'|'gravel'=>distance(x,z)<=8.5?'asphalt':'gravel',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>170||Math.abs(z)>125||y< -8,
 /** The caller owns every returned body, including the floor. Removing those
  * bodies removes all course colliders; no anonymous fixed bodies are created. */
 buildPhysics(api:typeof R,world:R.World):number[]{
  const owned:number[]=[];
  try{
   const ground=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(ground.handle);
   world.createCollider(api.ColliderDesc.cuboid(180,.5,135).setTranslation(0,-.5,0).setFriction(.85),ground);
   for(const solid of IRONFIELD_SOLIDS){
    if(!solid.collision)continue;
    const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(solid.x,solid.y,solid.z).setRotation({x:0,y:Math.sin(solid.yaw/2),z:0,w:Math.cos(solid.yaw/2)}));owned.push(body.handle);
    world.createCollider(api.ColliderDesc.cuboid(...solid.half).setFriction(.35),body);
   }
   return owned;
  }catch(error){
   for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}
   throw error;
  }
 },
};
