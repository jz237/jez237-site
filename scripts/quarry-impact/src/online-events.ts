import {validRivalState,type RivalState} from './derby-rivals';
import {DERBY_FORMATS} from './derby-policy';
import {validCombatFeats,type CombatFeatState,COMBAT_AWARDS} from './combat-feats';
import type {CombatRecord as ScoreRecord} from './event-rules';
import {CombatScoreboard,DEFAULT_EVENT,RACE_NAMES,type EventOptions} from './event-rules';
import {WaypointRace,waypointSequence,type WaypointOrder} from './waypoint-race';
import type {Mode} from './rules';

export type OnlineEventRules=Pick<EventOptions,'version'|'laps'|'direction'|'race'|'derby'|'duration'|'raceDuration'>;
export const DEFAULT_ONLINE_EVENT:OnlineEventRules=(({field,...rules})=>rules)(DEFAULT_EVENT);
export type WaypointRecord={id:number;round:number;visited:number[];passed:number;finished:boolean};
export type CombatRecord=ScoreRecord&{id:number};
export type OnlineEventState={rules:OnlineEventRules;seed:number;waypoints?:WaypointRecord[];combat?:CombatRecord[];feats?:CombatFeatState;rivals?:RivalState};
const integer=(v:unknown,min:number,max:number):v is number=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
/** Network rules are rejected rather than silently clamped to a different event. */
export function validOnlineEventRules(v:unknown):v is OnlineEventRules{
  return object(v)&&Object.keys(v).length===(v.raceDuration===undefined?6:7)&&Object.keys(v).every(k=>['version','laps','direction','race','derby','duration','raceDuration'].includes(k))&&(v.raceDuration===undefined||v.race==='laps'&&integer(v.raceDuration,60,1200))&&v.version===1&&integer(v.laps,1,20)&&integer(v.duration,60,1200)&&
    ['forward','reverse','opposing'].includes(v.direction as string)&&['laps','ordered','free','random'].includes(v.race as string)&&['survival','score','score-no-respawn'].includes(v.derby as string);
}
export function copyOnlineEventRules(v:OnlineEventRules):OnlineEventRules{return{version:1,laps:v.laps,direction:v.direction,race:v.race,derby:v.derby,duration:v.duration,...(v.raceDuration===undefined?{}:{raceDuration:v.raceDuration})};}
export function defaultOnlineEvent(v:OnlineEventRules){return v.raceDuration===undefined&&(Object.keys(DEFAULT_ONLINE_EVENT)as (keyof OnlineEventRules)[]).every(k=>v[k]===DEFAULT_ONLINE_EVENT[k]);}
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
  if(mode==='derby'&&DERBY_FORMATS[rules.derby].scored){
    if(!rows(v.combat)||!v.combat.every(p=>typeof p.damage==='number'&&Number.isFinite(p.damage)&&p.damage>=0&&p.damage<=1e9&&integer(p.knockouts,0,1e6)&&integer(p.deaths,0,1e6)&&typeof p.respawnAt==='number'&&Number.isFinite(p.respawnAt)&&p.respawnAt>=0&&p.respawnAt<=rules.duration+5&&validBonus(p,rules.duration)))return false;
    if(v.rivals!==undefined&&(!validRivalState(v.rivals,rules.duration)||v.rivals.count!==count))return false;
    if(v.rivals===undefined&&v.combat.some(p=>p.rivalHits!==undefined||object(p.award)&&p.award.kind==='rival'))return false;
    if(v.feats!==undefined&&!validCombatFeats(v.feats,count,rules.duration))return false;
  }else if(v.combat!==undefined||v.feats!==undefined||v.rivals!==undefined)return false;
  return true;
}
export function restoreOnlineProgress(state:OnlineEventState,waypoints:WaypointRace|null,combat:CombatScoreboard){
  combat.reset();for(const {id,...r}of state.combat??[])combat.records.set(id,{...r,...(r.impacts?{impacts:[...r.impacts] as [number,number,number]}:{}),...(r.award?{award:{...r.award}}:{})});combat.feats.restore(state.feats);if(state.rivals){combat.enableRivals(state.rivals.count);combat.rivals!.restore(state.rivals,state.rules.duration);}
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
  get score(){return this.mode==='derby'&&DERBY_FORMATS[this.rules.derby].scored;}
  get respawns(){return this.score&&DERBY_FORMATS[this.rules.derby].respawns;}
  snapshot(count:number):OnlineEventState{return{rules:copyOnlineEventRules(this.rules),seed:this.seed,
    ...(this.waypoints?{waypoints:Array.from({length:count},(_,id)=>{const p=this.waypoints!.get(id);return{id,round:p.round,visited:[...p.visited],passed:p.passed,finished:p.finished};})}:{}),
    ...(this.score?{combat:Array.from({length:count},(_,id)=>({id,...structuredClone(this.combat.get(id))})),feats:this.combat.feats.snapshot(),...(this.combat.rivals?{rivals:this.combat.rivals.snapshot()}:{})}:{})};}
  restore(state:OnlineEventState,count:number){if(!validOnlineEventState(state,this.mode,count)||!(Object.keys(this.rules)as (keyof OnlineEventRules)[]).every(k=>state.rules[k]===this.rules[k])||state.seed!==this.seed)throw Error('Invalid saved event');restoreOnlineProgress(state,this.waypoints,this.combat);}
}
export function onlineEventLabel(mode:Mode,rules:OnlineEventRules){return mode==='race'&&rules.raceDuration?`Timed circuit · ${rules.raceDuration/60} min · finish current lap · ${rules.direction}`:mode==='race'?`${RACE_NAMES[rules.race]} · ${rules.laps} ${rules.race==='laps'?'laps · '+rules.direction:'rounds'}`:mode==='derby'?`${DERBY_FORMATS[rules.derby].label} · ${rules.duration/60} min`:'Destruction playground';}

function validBonus(p:Record<string,unknown>,duration:number){
 if(p.bonus===undefined&&p.rivalHits===undefined&&p.spins===undefined&&p.impacts===undefined&&p.award===undefined)return true;
 if(!integer(p.bonus,0,1e9)||(p.rivalHits!==undefined&&!integer(p.rivalHits,0,1e6))||(p.spins!==undefined&&!integer(p.spins,0,1e6))||(p.impacts!==undefined&&(!Array.isArray(p.impacts)||p.impacts.length!==3||!p.impacts.every(n=>integer(n,0,1e6)))))return false;
 const hits=(p.impacts??[0,0,0])as number[];
 if(p.bonus!==hits[0]*10+hits[1]*25+hits[2]*50+Number(p.spins??0)*75+Number(p.rivalHits??0)*25)return false;
 const a=p.award as Record<string,unknown>|undefined;
 return a===undefined||!!a&&(a.kind!=='rival'||Number(p.rivalHits??0)>0)&&Object.hasOwn(COMBAT_AWARDS,String(a.kind))&&a.points===COMBAT_AWARDS[a.kind as keyof typeof COMBAT_AWARDS].points&&typeof a.time==='number'&&Number.isFinite(a.time)&&a.time>=0&&a.time<=duration+1;
}
