import {ROOKVALE} from './rookvale-course';
import {FENWICK_OVAL,FENWICK_EIGHT} from './fenwick-course';
import {STUNT_PARK} from './stunt-course';
import {MILLHAVEN} from './millhaven-course';
import {MEREFIELD} from './merefield-course';
import {DOCKSIDE,FAIRGROUND} from './county-courses';
import {PINECREST} from './pinecrest-course';
import {ASHFORD} from './ashford-course';
import {REDBANK} from './redbank-course';
import type R from '@dimforge/rapier3d-compat';
import {COURSE_NAMES,type CourseId} from './course-id';
import {CHECKPOINTS,trackPoint,surfaceAt} from './rules';
import {landscapeHeight} from './quarry-layout';
import {circuitRoute,raceGridSlot,type EventOptions,type RoutePoint} from './event-rules';
import {IRONFIELD} from './ironfield-course';
import {BRACKEN} from './bracken-course';
import {CINDERBANK} from './cinderbank-course';

export type CourseDirection=EventOptions['direction'];
export type RaceCourse={
 readonly id:CourseId;readonly name:string;readonly length:number;readonly halfWidth:number;
 /** Wide circuits include their usable shoulders; legacy courses keep 12m. */
 readonly checkpointRadius?:number;readonly mapExtent?:number;
 /** Open venues let waypoint drivers cross the infield directly. */
 readonly practiceOpen?:boolean;readonly practiceSpawn?:RoutePoint&{yaw:number;next:number;passed:number};
 readonly waypointStations?:readonly RoutePoint[];
 readonly mapLines?:readonly {points:readonly RoutePoint[];width:number}[];
 readonly checkpoints:readonly RoutePoint[];readonly samples:readonly RoutePoint[];
 point(t:number):RoutePoint;height(x:number,z:number):number;distance(x:number,z:number):number;
 surface(x:number,z:number):'asphalt'|'gravel';outside(x:number,y:number,z:number):boolean;
 /** Optional drivable-surface filter for horizontal steering probes, never physical collisions. */
 isDrivingObstacle?:(collider:R.Collider)=>boolean;
 /** Quarry continues to use its existing world lifecycle. */
 buildPhysics?:(api:typeof R,world:R.World)=>number[];
};
// Match the original main-AI off-road query, including its sampling resolution.
const quarrySamples=Array.from({length:100},(_,i)=>trackPoint(i/100));
export const QUARRY_COURSE:RaceCourse={
 id:'quarry-v1',name:COURSE_NAMES['quarry-v1'],checkpoints:CHECKPOINTS,samples:quarrySamples,
 // This sampled length is descriptive only: Quarry grid/scoring arithmetic
 // continues through the original helpers below.
 length:quarrySamples.reduce((n,p,i)=>{const next=quarrySamples[(i+1)%quarrySamples.length];return n+Math.hypot(next.x-p.x,next.z-p.z);},0),halfWidth:7,
 point:trackPoint,height:landscapeHeight,surface:surfaceAt,
 distance:(x,z)=>{let nearest=Infinity;for(const p of quarrySamples)nearest=Math.min(nearest,Math.hypot(x-p.x,z-p.z));return nearest;},
 outside:(x,y,z)=>Math.hypot(x,z)>255||y< -8,
};
const COURSES:Record<CourseId,RaceCourse>={'rookvale-yard-v1':ROOKVALE,'fenwick-oval-v1':FENWICK_OVAL,'fenwick-eight-v1':FENWICK_EIGHT,'alderwick-stunt-v1':STUNT_PARK,'millhaven-rally-v1':MILLHAVEN,'merefield-airfield-v1':MEREFIELD,'dockside-loop-v1':DOCKSIDE,'fairground-scramble-v1':FAIRGROUND,'pinecrest-ridge-v1':PINECREST,'ashford-autodrome-v1':ASHFORD,'quarry-v1':QUARRY_COURSE,'ironfield-figure-eight-v1':IRONFIELD,'cinderbank-oval-v1':CINDERBANK,'bracken-rallycross-v1':BRACKEN,'redbank-jump-v1':REDBANK};
export const getRaceCourse=(id:CourseId='quarry-v1'):RaceCourse=>COURSES[id];
const reverseRoutes=new WeakMap<RaceCourse,readonly RoutePoint[]>();
export function courseRoute(course:RaceCourse,direction:CourseDirection):readonly RoutePoint[]{
 if(course.id==='quarry-v1')return circuitRoute(direction);
 if(direction!=='reverse')return course.checkpoints;
 let route=reverseRoutes.get(course);
 if(!route){route=[course.checkpoints[0],...course.checkpoints.slice(1).reverse()];reverseRoutes.set(course,route);}
 return route;
}
/** Keep every old Quarry grid value exact. Other circuits are arc-length sampled. */
export function courseGridSlot(course:RaceCourse,index:number,direction:CourseDirection):RoutePoint&{yaw:number;next:number;passed:number}{
 if(course.id==='quarry-v1')return raceGridSlot(index,direction);
 if(direction==='opposing')return courseGridSlot(course,Math.floor(index/2)*2,index%2?'reverse':'forward');
 const sign=direction==='reverse'?-1:1,back=Math.floor(index/2)*7,t=-back/course.length;
 const p=course.point(t*sign),q=course.point(t*sign+sign*.0001),yaw=Math.atan2(q.x-p.x,q.z-p.z),lane=index%2?2.4:-2.4,n=course.checkpoints.length;
 const behind=back===0?0:Math.floor(-t*n)+1;
 return{x:p.x+Math.cos(yaw)*lane,z:p.z-Math.sin(yaw)*lane,yaw,next:back===0?1:((n+1-behind)%n+n)%n,passed:-behind};
}
/** Recovery follows checkpoint order, never the nearest crossing branch. */
export function courseRecoverySlot(course:RaceCourse,next:number,direction:CourseDirection){
 const route=courseRoute(course,direction),at=route[(next+route.length-1)%route.length],to=route[next];
 return{x:at.x,z:at.z,yaw:Math.atan2(to.x-at.x,to.z-at.z)};
}

/** Open waypoint recoveries can use the infield; physical obstacles and other
 * vehicles are still rejected by the caller's clearance query. */
export function courseRecoveryArea(course:RaceCourse,waypoints=false){
 return waypoints&&course.waypointStations?{halfWidth:course.halfWidth,distance:(x:number,z:number)=>course.outside(x,0,z)?Infinity:0}:course;
}
