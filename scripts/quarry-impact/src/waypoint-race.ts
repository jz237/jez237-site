import {CHECKPOINTS} from './rules';
import {circuitRoute,type RoutePoint} from './event-rules';
export type WaypointOrder='ordered'|'free'|'random';
export const WAYPOINTS=[0,3,7,11,15,19].map((checkpoint,id)=>({id,checkpoint,...CHECKPOINTS[checkpoint],label:id===0?'FINISH':String(id)}));
const distance=(a:RoutePoint,b:RoutePoint)=>Math.hypot(a.x-b.x,a.z-b.z);
export function waypointSequence(seed:number,round=0){
  const order=[1,2,3,4,5];let state=(seed+Math.imul(round+1,0x9e3779b9))>>>0;
  for(let i=order.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[order[i],order[j]]=[order[j],order[i]];}return order;
}
export function nearestRoad(position:RoutePoint){
  let best={segment:0,fraction:0,distance:Infinity,x:0,z:0};
  CHECKPOINTS.forEach((a,i)=>{const b=CHECKPOINTS[(i+1)%24],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((position.x-a.x)*dx+(position.z-a.z)*dz)/(dx*dx+dz*dz))),p={x:a.x+dx*t,z:a.z+dz*t},d=distance(position,p);if(d<best.distance)best={segment:i,fraction:t,distance:d,...p};});return best;
}
const lengths=CHECKPOINTS.map((p,i)=>distance(p,CHECKPOINTS[(i+1)%24])),total=lengths.reduce((a,b)=>a+b,0),offsets=lengths.map((_,i)=>lengths.slice(0,i).reduce((a,b)=>a+b,0));
export function roadNavigation(position:RoutePoint,target:number){
  const at=nearestRoad(position),origin=offsets[at.segment]+at.fraction*lengths[at.segment],end=offsets[WAYPOINTS[target].checkpoint],forward=(end-origin+total)%total,reverse=forward>total/2;
  const next=reverse?(24-at.segment)%24:(at.segment+1)%24;
  return {reverse,next,route:circuitRoute(reverse?'reverse':'forward'),distance:Math.min(forward,total-forward)};
}
export type WaypointProgress={round:number;visited:Set<number>;passed:number;finished:boolean;target:number;nav:ReturnType<typeof roadNavigation>|null;navDistance:number};
/** Waypoints score independently from the road nodes used by AI navigation. */
export class WaypointRace {
  readonly progress=new Map<number,WaypointProgress>();
  constructor(readonly order:WaypointOrder,readonly rounds:number,readonly seed:number){}
  get(id:number){let p=this.progress.get(id);if(!p){p={round:0,visited:new Set(),passed:0,finished:false,target:-1,nav:null,navDistance:Infinity};this.progress.set(id,p);}return p;}
  available(id:number){const p=this.get(id);if(p.finished)return [];if(p.visited.size===5)return [0];if(this.order==='free')return WAYPOINTS.slice(1).map(p=>p.id).filter(id=>!p.visited.has(id));return [(this.order==='random'?waypointSequence(this.seed,p.round):[1,2,3,4,5])[p.visited.size]];}
  target(id:number,position:RoutePoint){const p=this.get(id),available=this.available(id);if(!available.length)return 0;if(available.includes(p.target))return p.target;return available.reduce((best,id)=>roadNavigation(position,id).distance<roadNavigation(position,best).distance?id:best,available[0]);}
  navigation(id:number,position:RoutePoint){
    const p=this.get(id),target=this.target(id,position);
    if(!p.nav||p.target!==target){p.target=target;p.nav=roadNavigation(position,target);p.navDistance=Infinity;}
    const node=p.nav.route[p.nav.next],d=distance(position,node);
    if(d<10&&d<p.navDistance){p.nav.next=(p.nav.next+1)%24;p.navDistance=Infinity;}else p.navDistance=d;
    return p.nav;
  }
  sample(id:number,position:RoutePoint){
    const p=this.get(id);if(p.finished)return null;
    // One station per update, in a non-overlapping 10m zone. A respawn cannot score intermediate gates.
    const hit=this.available(id).find(target=>distance(position,WAYPOINTS[target])<=10);if(hit===undefined)return null;
    p.passed++;p.nav=null;p.target=-1;
    if(hit===0){p.round++;p.visited.clear();p.finished=p.round>=this.rounds;}else p.visited.add(hit);
    return {id:hit,round:p.round,finished:p.finished};
  }
  remainingDistance(id:number,position:RoutePoint){return Math.min(...this.available(id).map(target=>distance(position,WAYPOINTS[target])));}
}
