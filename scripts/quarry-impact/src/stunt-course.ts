import {createCountyCourse} from './county-course';
import {STUNT_LOOP,STUNT_BARRIERS,STUNT_SUPPORTS,stuntLoopPoint,stuntHeight,buildStuntPhysics} from './stunt-layout';
const perimeter=createCountyCourse({id:'alderwick-stunt-v1',name:'Alderwick Stunt Park',startZ:-135,controls:[[-135,-135],[0,-135],[135,-135],[180,-90],[172,-15],[185,75],[130,130],[30,140],[-65,125],[-150,140],[-185,70],[-175,-65]],height:()=>0,asphalt:()=>true});
const yaw=Math.atan(STUNT_LOOP.shift/(2*Math.PI*STUNT_LOOP.radius));
export const STUNT_PARK={...perimeter,mapExtent:235,height:stuntHeight,solids:[...STUNT_BARRIERS,...STUNT_SUPPORTS.map(s=>({...s,yaw:0}))],
 mapLines:[{points:Array.from({length:73},(_,i)=>stuntLoopPoint(i/72)),width:8},{points:[{x:65,z:-115},{x:65,z:90}],width:20},{points:[{x:125,z:-75},{x:125,z:65}],width:14}],
 // The open practice area is deliberately separate from the ordered racing route.
 practiceOpen:true,practiceSpawn:{x:STUNT_LOOP.x-150*Math.tan(yaw),z:STUNT_LOOP.z-150,yaw,next:1,passed:0},
 surface:(_x:number,_z:number):'asphalt'|'gravel'=>'asphalt',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>230||Math.abs(z)>200||y< -8,
 buildPhysics:buildStuntPhysics,
};
