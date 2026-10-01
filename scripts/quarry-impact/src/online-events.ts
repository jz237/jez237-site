import {CombatScoreboard,DEFAULT_EVENT,RACE_NAMES,type EventOptions} from './event-rules';
import {WaypointRace,waypointSequence,type WaypointOrder} from './waypoint-race';
import type {Mode} from './rules';

export type OnlineEventRules=Omit<EventOptions,'field'>;
export const DEFAULT_ONLINE_EVENT:OnlineEventRules=(({field,...rules})=>rules)(DEFAULT_EVENT);
export type WaypointRecord={id:number;round:number;visited:number[];passed:number;finished:boolean};
export type CombatRecord={id:number;damage:number;knockouts:number;deaths:number;respawnAt:number};
export type OnlineEventState={rules:OnlineEventRules;seed:number;waypoints?:WaypointRecord[];combat?:CombatRecord[]};
const integer=(v:unknown,min:number,max:number):v is number=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
/** Network rules are rejected rather than silently clamped to a different event. */
export function validOnlineEventRules(v:unknown):v is OnlineEventRules{
  return object(v)&&Object.keys(v).length===6&&v.version===1&&integer(v.laps,1,20)&&integer(v.duration,60,1200)&&
    ['forward','reverse','opposing'].includes(v.direction as string)&&['laps','ordered','free','random'].includes(v.race as string)&&['survival','score'].includes(v.derby as string);
}
export function copyOnlineEventRules(v:OnlineEventRules):OnlineEventRules{return{version:1,laps:v.laps,direction:v.direction,race:v.race,derby:v.derby,duration:v.duration};}
export function defaultOnlineEvent(v:OnlineEventRules){return (Object.keys(DEFAULT_ONLINE_EVENT)as (keyof OnlineEventRules)[]).every(k=>v[k]===DEFAULT_ONLINE_EVENT[k]);}
export function validOnlineEventState(v:unknown,mode:Mode,count:number):v is OnlineEventState{
  if(!object(v)||!validOnlineEventRules(v.rules)||!integer(v.seed,0,0xffffffff))return false;
  const rules=v.rules,rows=(r:unknown):r is Record<string,unknown>[]=>Array.isArray(r)&&r.length===count&&new Set(r.map(x=>x?.id)).size===count&&r.every(x=>object(x)&&integer(x.id,0,count-1));
  if(mode==='race'&&rules.race!=='laps'){
    if(!rows(v.waypoints)||!v.waypoints.every(p=>{
      if(!integer(p.round,0,rules.laps)||!Array.isArray(p.visited)||p.visited.length>5||new Set(p.visited).size!==p.visited.length||!p.visited.every(i=>integer(i,1,5))||p.passed!==Number(p.round)*6+p.visited.length||p.finished!==(p.round===rules.laps)||p.finished&&p.visited.length!==0)return false;
      const sequence=rules.race==='random'?waypointSequence(v.seed as number,p.round):[1,2,3,4,5];
      return rules.race==='free'||p.visited.every((id,i)=>id===sequence[i]);
    }))return false;
  }else if(v.waypoints!==undefined)return false;
  if(mode==='derby'&&rules.derby==='score'){
    if(!rows(v.combat)||!v.combat.every(p=>typeof p.damage==='number'&&Number.isFinite(p.damage)&&p.damage>=0&&p.damage<=1e9&&integer(p.knockouts,0,1e6)&&integer(p.deaths,0,1e6)&&typeof p.respawnAt==='number'&&Number.isFinite(p.respawnAt)&&p.respawnAt>=0&&p.respawnAt<=rules.duration+5))return false;
  }else if(v.combat!==undefined)return false;
  return true;
}
export function restoreOnlineProgress(state:OnlineEventState,waypoints:WaypointRace|null,combat:CombatScoreboard){
  combat.reset();for(const {id,...r}of state.combat??[])combat.records.set(id,{...r});
  if(waypoints){waypoints.progress.clear();for(const r of state.waypoints??[])Object.assign(waypoints.get(r.id),{round:r.round,visited:new Set(r.visited),passed:r.passed,finished:r.finished});}
}
export class OnlineEvent {
  readonly rules:OnlineEventRules;
  readonly waypoints:WaypointRace|null;
  readonly combat=new CombatScoreboard();
  constructor(readonly mode:Mode,rules:OnlineEventRules,readonly seed:number){
    if(!validOnlineEventRules(rules)||!integer(seed,0,0xffffffff))throw Error('Invalid event rules');
    this.rules=copyOnlineEventRules(rules);this.waypoints=mode==='race'&&rules.race!=='laps'?new WaypointRace(rules.race as WaypointOrder,rules.laps,seed):null;
  }
  get score(){return this.mode==='derby'&&this.rules.derby==='score';}
  snapshot(count:number):OnlineEventState{return{rules:copyOnlineEventRules(this.rules),seed:this.seed,
    ...(this.waypoints?{waypoints:Array.from({length:count},(_,id)=>{const p=this.waypoints!.get(id);return{id,round:p.round,visited:[...p.visited],passed:p.passed,finished:p.finished};})}:{}),
    ...(this.score?{combat:Array.from({length:count},(_,id)=>({id,...this.combat.get(id)}))}:{})};}
  restore(state:OnlineEventState,count:number){if(!validOnlineEventState(state,this.mode,count)||!(Object.keys(this.rules)as (keyof OnlineEventRules)[]).every(k=>state.rules[k]===this.rules[k])||state.seed!==this.seed)throw Error('Invalid saved event');restoreOnlineProgress(state,this.waypoints,this.combat);}
}
export function onlineEventLabel(mode:Mode,rules:OnlineEventRules){return mode==='race'?`${RACE_NAMES[rules.race]} · ${rules.laps} ${rules.race==='laps'?'laps · '+rules.direction:'rounds'}`:mode==='derby'?`${rules.derby==='score'?'Score derby · respawns':'Survival derby'} · ${rules.duration/60} min`:'Destruction playground';}
