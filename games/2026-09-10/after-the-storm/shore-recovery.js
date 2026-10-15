import {hazardBroken} from './breakable-hazards.js';
import {barrierCollision} from './course-barriers.js';
import {iceSurfaceAt} from './ice-surfaces.js';
import {ground,waterLevel} from './simulation.js';
import {obstaclePosition} from './course-environment.js';
import {passageCollision} from './course-passages.js';
import {createHydro} from './hydrodynamics.js';
import {polygonDistance} from './classic-courses.js';
import {volumeContact} from './clipped-volumes.js';
import {HULL_PROBES} from './hull-probes.js';

function safeWater(s,x,z){
 if(s.course.iceSheets&&iceSurfaceAt(s.course,x,z))return false;
 if(s.course.sourceShores?.some(q=>{
  if(q.sourceClosed!==false){const d=polygonDistance(q.outline,x,z);return q.waterInside?d> -1.2:d<1.2;}
  // An open coast has no invented closing edge or filled interior. Keep a
  // rescue hull away from its actual finite segments on either side.
  return q.outline.slice(1).some((b,i)=>{const a=q.outline[i],dx=b[0]-a[0],dz=b[1]-a[1],n=dx*dx+dz*dz,t=n?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/n)):0;return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)<1.2;});
 }))return false;
 if(s.course.contactVolumes)for(const p of HULL_PROBES)for(const [dx,dz] of [[p.x,p.z],[p.z,-p.x]]){
  const point={x:x+dx,y:waterLevel.value+.025+p.y,z:z+dz};
  if(s.course.contactVolumes.query(point).some(q=>volumeContact(q,point)))return false;
 }
 const floor=s.course.ground||ground;
 for(const [dx,dz] of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]])
  if(floor(x+dx,z+dz)>waterLevel.value-1.2)return false;
 if((s.course.rocks||[]).some(q=>{if(hazardBroken(s.breakables,q))return false;const p=obstaclePosition(q,s.time);return Math.hypot(x-p.x,z-p.z)<q.r+2;}))return false;
 return !barrierCollision(s.course.crossbars,x,waterLevel.value,z)&&!passageCollision(s.course.passage,x,waterLevel.value,z,s.time,s.passageOpenedAt);
}

export function rememberWater(s,r){
 if(safeWater(s,r.x,r.z))r.lastWater={x:r.x,z:r.z,heading:r.heading};
}

export function recoverToWater(s,r){
 let target=r.lastWater&&safeWater(s,r.lastWater.x,r.lastWater.z)?r.lastWater:null;
 // Search locally if a receding tide has exposed the last safe position.
 if(!target)for(let radius=2;radius<=40&&!target;radius+=2)for(let i=0;i<24;i++){
  const angle=i*Math.PI/12,x=r.x+Math.sin(angle)*radius,z=r.z+Math.cos(angle)*radius;
  if(safeWater(s,x,z)){target={x,z,heading:angle};break;}
 }
 if(!target)return false;
 const heading=Math.atan2(target.x-r.x,target.z-r.z);
 Object.assign(r,{x:target.x,z:target.z,heading:Number.isFinite(heading)?heading:target.heading,
  vx:0,vz:0,speed:0,turn:0,throttle:0,recover:0,collision:0,out:0,groundedTime:0,wipeout:null,staticFloorId:'',staticFloorExposed:false,onIce:'',sourceRampContact:null,hydro:createHydro()});
 if(r.stunt)Object.assign(r.stunt,{trick:null,angle:0,airDuration:0,pose:null,poseTime:0,poseAward:0,lastCommand:'',lastLanding:r.hydro.landingId});
 return true;
}

export function shoreRecovery(s,r,landHit,request,dt){
 const grounded=landHit||!!r.onIce&&r.speed<1;
 const pinned=r.groundedTime>0&&r.speed<3&&!safeWater(s,r.x,r.z);
 r.groundedTime=landHit||grounded||pinned?(r.groundedTime||0)+dt:Math.max(0,(r.groundedTime||0)-dt*2);
 if((r.groundedTime>=1.5||request&&(landHit||grounded||r.groundedTime>0))&&recoverToWater(s,r))return true;
 if(!landHit&&!grounded)rememberWater(s,r);
 return false;
}
