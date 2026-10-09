import type R from '@dimforge/rapier3d-compat';
import {createCountyCourse} from './county-course';
import {registerTerrainContacts} from './terrain-collision';

const smooth=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
// A broad loading apron is approached from every direction through gradual banks.
const loop=createCountyCourse({id:'rookvale-yard-v1',name:'Rookvale Freight Yard',startZ:-108,
 controls:[[-120,-108],[0,-108],[120,-108],[168,-65],[168,65],[120,108],[0,108],[-120,108],[-168,65],[-168,-65]],
 height:(x,z)=>4*smooth((110-Math.abs(x))/45)*smooth((95-Math.abs(z))/40),asphalt:(_x,z)=>z<35});
export const ROOKVALE_LANES=[
 {points:[{x:-180,z:-38},{x:180,z:-38}],width:18},
 {points:[{x:-180,z:38},{x:180,z:38}],width:18},
 {points:[{x:-130,z:-110},{x:130,z:110}],width:16},
] as const;
export const ROOKVALE_STATIONS=[{x:0,z:-108},{x:135,z:-48},{x:-130,z:62},{x:0,z:35},{x:125,z:95},{x:-135,z:-75}] as const;
const segmentDistance=(x:number,z:number,a:{x:number;z:number},b:{x:number;z:number})=>{
 const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));
 return Math.hypot(x-a.x-dx*t,z-a.z-dz*t);
};
export const ROOKVALE_BARRIERS=Array.from({length:160},(_,i)=>{
 const side=Math.floor(i/40),offset=-1+(i%40+.5)/20,vertical=side%2===0;
 const x=vertical?(side===0?-205:205):offset*205,z=vertical?offset*165:(side===1?-165:165);
 return{x,z,y:loop.height(x,z)+1,yaw:vertical?0:Math.PI/2,half:[.45,1,vertical?4.18:5.18]as const};
});
export const ROOKVALE={...loop,solids:ROOKVALE_BARRIERS,mapExtent:225,waypointStations:ROOKVALE_STATIONS,mapLines:ROOKVALE_LANES,
 surface:(x:number,z:number):'asphalt'|'gravel'=>(z<35&&loop.distance(x,z)<=12)||ROOKVALE_LANES.some(r=>segmentDistance(x,z,r.points[0],r.points[1])<=r.width/2)?'asphalt':'gravel',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>215||Math.abs(z)>175||y< -8,
 buildPhysics(api:typeof R,world:R.World){
  const owned:number[]=[];
  try{
   const ground=world.createRigidBody(api.RigidBodyDesc.fixed());ground.userData={courseSurface:'rookvale-yard-v1'};owned.push(ground.handle);
   const tiles:R.Collider[]=[],{columns,rows}=loop.terrain;
   for(let z=0;z<rows-1;z+=16)for(let x=0;x<columns-1;x+=16){
    const p=loop.terrainPatch(x,z,Math.min(16,columns-1-x),Math.min(16,rows-1-z));
    tiles.push(world.createCollider(api.ColliderDesc.trimesh(p.positions,p.indices).setFriction(.85),ground));
   }
   registerTerrainContacts(world,tiles);
   for(const s of ROOKVALE_BARRIERS){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.5),body);}
   return owned;
  }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
 },
};
