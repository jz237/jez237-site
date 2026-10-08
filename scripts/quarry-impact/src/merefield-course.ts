import type R from '@dimforge/rapier3d-compat';
import {createCountyCourse} from './county-course';

const loop=createCountyCourse({id:'merefield-airfield-v1',name:'Merefield Airfield',startZ:-115,
 controls:[[-130,-115],[0,-115],[130,-115],[180,-70],[180,70],[130,115],[0,115],[-130,115],[-180,70],[-180,-70]],height:()=>0,asphalt:()=>true});
export const MEREFIELD_RUNWAYS=[
 {points:[{x:-190,z:0},{x:190,z:0}],width:28},
 {points:[{x:0,z:-145},{x:0,z:145}],width:24},
 {points:[{x:-150,z:-100},{x:150,z:100}],width:20},
] as const;
export const MEREFIELD_STATIONS=[{x:0,z:-115},{x:145,z:-50},{x:-125,z:75},{x:15,z:15},{x:125,z:100},{x:-150,z:-75}] as const;
const segmentDistance=(x:number,z:number,a:{x:number;z:number},b:{x:number;z:number})=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-dx*t,z-a.z-dz*t);};
export const MEREFIELD_BARRIERS=Array.from({length:160},(_,i)=>{
 const side=Math.floor(i/40),offset=-1+(i%40+.5)/20,vertical=side%2===0;
 return{x:vertical?(side===0?-215:215):offset*215,z:vertical?offset*175:(side===1?-175:175),y:1,yaw:vertical?0:Math.PI/2,half:[.45,1,vertical?4.43:5.43]as const};
});
export const MEREFIELD={...loop,solids:MEREFIELD_BARRIERS,halfWidth:12,mapExtent:235,waypointStations:MEREFIELD_STATIONS,mapLines:MEREFIELD_RUNWAYS,
 surface:(x:number,z:number):'asphalt'|'gravel'=>loop.distance(x,z)<=12||MEREFIELD_RUNWAYS.some(r=>segmentDistance(x,z,r.points[0],r.points[1])<=r.width/2)?'asphalt':'gravel',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>230||Math.abs(z)>190||y< -8,
 buildPhysics(api:typeof R,world:R.World){
  const owned:number[]=[];
  try{
   const floor=world.createRigidBody(api.RigidBodyDesc.fixed());floor.userData={courseSurface:'merefield-airfield-v1'};owned.push(floor.handle);
   world.createCollider(api.ColliderDesc.cuboid(250,.5,210).setTranslation(0,-.5,0).setFriction(.85),floor);
   for(const s of MEREFIELD_BARRIERS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.5),body);}
   return owned;
  }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
 },
};
