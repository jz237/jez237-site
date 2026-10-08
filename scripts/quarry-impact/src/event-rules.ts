import {isDamageRule,type DamageRule} from './damage-rules';
import {isGridLineup,isGridPerformance,type GridLineup,type GridPerformance} from './grid-rules';
import {isAIDifficulty,type AIDifficulty} from './ai-difficulty';
import {isCourseId,type CourseId} from './course-id';
import {CHECKPOINTS,trackPoint,clamp,derbyOrder} from './rules';
import type {ArenaLayout} from './derby-arena';
export type EventOptions={version:1;damage?:DamageRule;difficulty?:AIDifficulty;course?:CourseId;lineup?:GridLineup;performance?:GridPerformance;field:number;laps:number;raceDuration?:number;direction:'forward'|'reverse'|'opposing';race:'laps'|'ordered'|'free'|'random';derby:'survival'|'score';duration:number};
export const EVENT_KEY='quarry-impact-events-v1';
export const DEFAULT_EVENT:EventOptions={version:1,field:8,laps:3,direction:'forward',race:'laps',derby:'survival',duration:300};
const integer=(value:unknown,fallback:number,min:number,max:number)=>typeof value==='number'&&Number.isFinite(value)?Math.round(clamp(value,min,max)):fallback;
export function readEventOptions(json?:string|null):EventOptions{
  try{const v=JSON.parse(json??'{}');if(!v||v.version!==1)return {...DEFAULT_EVENT};return {version:1,...(isDamageRule(v.damage)?{damage:v.damage}:{}),...(isAIDifficulty(v.difficulty)?{difficulty:v.difficulty}:{}),...(isCourseId(v.course)?{course:v.course}:{}),...(typeof v.raceDuration==='number'&&Number.isFinite(v.raceDuration)?{raceDuration:integer(v.raceDuration,120,60,1200)}:{}),...(isGridLineup(v.lineup)?{lineup:v.lineup}:{}),...(isGridPerformance(v.performance)?{performance:v.performance}:{}),field:integer(v.field,8,2,24),laps:integer(v.laps,3,1,20),direction:v.direction==='opposing'?'opposing':v.direction==='reverse'?'reverse':'forward',race:['ordered','free','random'].includes(v.race)?v.race:'laps',derby:v.derby==='score'?'score':'survival',duration:integer(v.duration,300,60,1200)};}catch{return {...DEFAULT_EVENT};}
}
export type RoutePoint={x:number;z:number};
const reverse=[CHECKPOINTS[0],...CHECKPOINTS.slice(1).reverse()];
export const circuitRoute=(direction:EventOptions['direction']):readonly RoutePoint[]=>direction==='reverse'?reverse:CHECKPOINTS;
/** Two-wide grid on the existing road. Tail cars must cross pre-line gates before
 * scoring their first lap; otherwise a 24-car grid would cut across the circuit. */
export function raceGridSlot(index:number,direction:EventOptions['direction']):{x:number;z:number;yaw:number;next:number;passed:number}{
  if(direction==='opposing')return raceGridSlot(Math.floor(index/2)*2,index%2?'reverse':'forward');
  const sign=direction==='reverse'?-1:1,back=Math.floor(index/2)*7;
  let t=0,walked=0,p=trackPoint(0);
  while(walked<back){t-=1/4096;const next=trackPoint(t*sign);walked+=Math.hypot(next.x-p.x,next.z-p.z);p=next;}
  const q=trackPoint(t*sign+.0001*sign),yaw=Math.atan2(q.x-p.x,q.z-p.z),lane=index%2?2:-2;
  const behind=back===0?0:Math.floor(-t*24)+1;
  return {x:p.x+Math.cos(yaw)*lane,z:p.z-Math.sin(yaw)*lane,yaw,next:back===0?1:(25-behind)%24,passed:-behind};
}
export function derbyGridSlot(index:number,count:number,arena:ArenaLayout){
  const a=index/count*Math.PI*2;
  return {x:arena.x+Math.sin(a)*arena.spawnRadius,z:arena.z-Math.cos(a)*arena.spawnRadius,yaw:Math.atan2(-Math.sin(a),Math.cos(a))};
}
export function checkRoute(route:readonly RoutePoint[],x:number,z:number,next:number,lastDistance:number,radius=12){
  const p=route[next],distance=Math.hypot(x-p.x,z-p.z);
  return {passed:distance<radius&&distance<lastDistance,distance};
}
export function lapProgress(passed:number,laps:number){return {lap:Math.max(1,Math.floor(passed/24)+1),finished:passed>=laps*24};}
export type CombatRecord={damage:number;knockouts:number;deaths:number;respawnAt:number};
/** Collision damage uses actual health loss; a disabled opponent pays out once per life. */
export class CombatScoreboard {
  readonly records=new Map<number,CombatRecord>();
  reset(){this.records.clear();}
  get(id:number){let r=this.records.get(id);if(!r){r={damage:0,knockouts:0,deaths:0,respawnAt:0};this.records.set(id,r);}return r;}
  hit(attacker:number,victim:number,before:number,after:number,time:number){
    if(attacker===victim||before<=0||![before,after,time].every(Number.isFinite))return;
    const target=this.get(victim);if(target.respawnAt>0)return;
    this.get(attacker).damage+=Math.max(0,Math.min(100,before)-Math.max(0,after));
    if(after<=0){this.get(attacker).knockouts++;this.disable(victim,time);}
  }
  disable(id:number,time:number){const r=this.get(id);if(r.respawnAt<=0){r.deaths++;r.respawnAt=time+4;}}
  respawn(id:number){this.get(id).respawnAt=0;}
  points(id:number){const r=this.get(id);return Math.floor(r.damage)+r.knockouts*100;}
  order<T extends {id:number;health:number;inflicted:number}>(cars:T[]){return [...cars].sort((a,b)=>this.points(b.id)-this.points(a.id)||this.get(b.id).knockouts-this.get(a.id).knockouts||b.health-a.health||a.id-b.id);}
}
export function eventDerbyOrder<T extends {id:number;health:number;inflicted:number}>(cars:T[],score:boolean,board:CombatScoreboard){return score?board.order(cars):derbyOrder(cars);}
export function clearRespawnSlot(cars:readonly {id:number;current:RoutePoint}[],id:number,arena:ArenaLayout){
  let best:ReturnType<typeof derbyGridSlot>|null=null,gap=-Infinity;
  for(let i=0;i<32;i++){
    const p=derbyGridSlot(i,32,arena),nearest=Math.min(...cars.filter(c=>c.id!==id).map(c=>Math.hypot(c.current.x-p.x,c.current.z-p.z)));
    if(nearest>gap){gap=nearest;best=p;}
  }
  return gap>=8?best:null;
}

export type RespawnCar={id:number;health:number;current:RoutePoint;place:(x:number,z:number,yaw:number,repair:boolean)=>void};
export function stepScoreRespawns(board:CombatScoreboard,cars:readonly RespawnCar[],time:number,limit:number,arena:ArenaLayout,onRespawn:(id:number)=>void){
  for(const car of cars){
    if(car.health>0)continue;board.disable(car.id,time);
    if(time<board.get(car.id).respawnAt||time>=limit)continue;
    const spawn=clearRespawnSlot(cars,car.id,arena);
    if(spawn){car.place(spawn.x,spawn.z,spawn.yaw,true);board.respawn(car.id);onRespawn(car.id);}
  }
}

export const directionForCar=(direction:EventOptions['direction'],id:number):'forward'|'reverse'=>direction==='opposing'?(id%2?'reverse':'forward'):direction;
export const RACE_NAMES={laps:'Circuit laps',ordered:'Waypoint tour',free:'Free-order waypoints',random:'Random waypoints'};
