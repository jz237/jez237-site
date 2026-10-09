import type R from '@dimforge/rapier3d-compat';
import {createCountyCourse} from './county-course';
export type FenwickId='fenwick-oval-v1'|'fenwick-eight-v1';
const configurations=[
 {id:'fenwick-oval-v1' as const,name:'Fenwick Banger Oval',startX:0,startZ:-80,controls:[[-100,-80],[0,-80],[100,-80],[155,-55],[180,0],[155,55],[100,80],[0,80],[-100,80],[-155,55],[-180,0],[-155,-55]]},
 {id:'fenwick-eight-v1' as const,name:'Fenwick Figure Eight',startX:125,startZ:70,controls:[[-125,-70],[-55,-40],[0,0],[55,40],[125,70],[175,45],[185,0],[175,-45],[125,-70],[55,-40],[0,0],[-55,40],[-125,70],[-175,45],[-185,0],[-175,-45]]},
];
export const FENWICK_COURSES=configurations.map(config=>{
 const route=createCountyCourse({...config,height:()=>0,asphalt:()=>false});
 // A crossing needs open lanes through both branches. Check the full wall,
 // including its end corners, against the complete route before placing it.
 const solids=route.solids.filter(s=>s.id.startsWith('barrier_')&&[-1,0,1].every(t=>route.distance(s.x+Math.sin(s.yaw)*s.half[2]*t,s.z+Math.cos(s.yaw)*s.half[2]*t)>15));
 const p=route.point(0),q=route.point(.0001),yaw=Math.atan2(q.x-p.x,q.z-p.z);
 for(const side of [-1,1])solids.push({id:'start_post_'+side,x:p.x+Math.cos(yaw)*side*18,y:4,z:p.z-Math.sin(yaw)*side*18,half:[.25,4,.25],yaw,material:'steel',collision:true});
 solids.push({id:'start_gantry',x:p.x,y:8.2,z:p.z,half:[18.25,.2,.3],yaw,material:'steel',collision:true});
 return {...route,solids,buildPhysics(api:typeof R,world:R.World){
  const owned:number[]=[];
  try{
   const ground=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(ground.handle);ground.userData={courseSurface:config.id};
   world.createCollider(api.ColliderDesc.cuboid(220,.5,180).setTranslation(0,-.5,0).setFriction(.85),ground);
   for(const s of solids){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.35),body);}
   return owned;
  }catch(error){for(const h of owned){const b=world.getRigidBody(h);if(b)world.removeRigidBody(b);}throw error;}
 }};
});
export const [FENWICK_OVAL,FENWICK_EIGHT]=FENWICK_COURSES;
export const getFenwickCourse=(id:FenwickId)=>FENWICK_COURSES.find(c=>c.id===id)!;
