import {PursuitSession,validPursuitSnapshot,type PursuitCar,type PursuitSnapshot} from './pursuit';
import {pursuitGridOrder} from './pursuit-teams';
import {validCapacity,type OnlineCapacity} from './online-capacity';

/** Runner IDs are car slots, never connection IDs. Reconnecting keeps the same team. */
export type ChaseRules={version:1;runners:number[];duration:number};
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
export function validChaseRules(value:unknown,capacity:OnlineCapacity):value is ChaseRules{
 if(!validCapacity(capacity)||!object(value)||Object.keys(value).length!==3||value.version!==1||!Number.isInteger(value.duration)||Number(value.duration)<60||Number(value.duration)>1200)return false;
 return Array.isArray(value.runners)&&value.runners.length>0&&value.runners.length<capacity&&new Set(value.runners).size===value.runners.length&&value.runners.every(id=>Number.isInteger(id)&&id>=0&&id<capacity);
}
export function validChaseState(rules:ChaseRules,capacity:OnlineCapacity,value:unknown){
 if(!validChaseRules(rules,capacity)||!validPursuitSnapshot(value))return false;
 return value.rules.duration===rules.duration&&value.rules.members.length===capacity&&value.rules.members.every(m=>m.id<capacity&&m.role===(rules.runners.includes(m.id)?'runner':'chaser'));
}
function roster(cars:readonly PursuitCar[],capacity:OnlineCapacity){
 return cars.length===capacity&&new Set(cars.map(c=>c.id)).size===capacity&&cars.every(c=>Number.isInteger(c.id)&&c.id>=0&&c.id<capacity&&Number.isFinite(c.health)&&c.health>=0&&c.health<=100&&typeof c.finished==='boolean'&&Number.isFinite(c.finishTime)&&c.finishTime>=0);
}

/** Validate the event and physics together before accepting a network or saved state. */
export function validChasePhysics(rules:ChaseRules,capacity:OnlineCapacity,value:unknown,cars:readonly PursuitCar[],elapsed:number):value is PursuitSnapshot{
 if(!validChaseState(rules,capacity,value)||!roster(cars,capacity)||!Number.isFinite(elapsed)||elapsed<0)return false;
 const snapshot=value as PursuitSnapshot;if(snapshot.elapsed!==Math.min(elapsed,rules.duration))return false;
 return snapshot.results.every(result=>{
  const car=cars.find(c=>c.id===result.id)!;
  return result.outcome==='running'?car.health>0&&!car.finished:result.outcome==='escaped'?car.finished&&car.finishTime===result.time:result.time===rules.duration||car.health<=0;
 });
}

/** Server-owned Chase state. Only the physics simulation supplies progress and damage. */
export class ChaseRound{
 private state:PursuitSession;
 get session(){return this.state;}
 private readonly slots:number[];
 constructor(rules:ChaseRules,readonly capacity:OnlineCapacity){
  if(!validChaseRules(rules,capacity))throw Error('Invalid online chase teams');
  this.state=new PursuitSession({version:1,duration:rules.duration,members:Array.from({length:capacity},(_,id)=>({id,role:rules.runners.includes(id)?'runner':'chaser'}))});
  this.slots=pursuitGridOrder(this.session.snapshot().rules);
 }
 /** Place every runner ahead of every pursuer without changing persistent car IDs. */
 gridSlot(id:number){const slot=this.slots.indexOf(id);if(slot<0)throw Error('Unknown chase car');return slot;}
 canFinish(id:number){return !this.session.complete&&this.session.result(id)?.outcome==='running';}
 stopped(id:number){return this.session.complete||this.session.result(id)?.outcome==='escaped'||this.session.result(id)?.outcome==='caught';}
 update(cars:readonly PursuitCar[],elapsed:number){
  // A disconnected member still has an AI-driven car. Missing cars indicate a broken
  // authority snapshot, not a reason to eliminate or silently reassign that member.
  if(!roster(cars,this.capacity))throw Error('Incomplete online chase roster');
  this.session.update(cars,elapsed);
 }
 ranking(cars:readonly (PursuitCar&{passed:number})[]){
  if(!roster(cars,this.capacity))throw Error('Incomplete online chase roster');
  const winningRole=this.session.winner==='runners'?'runner':this.session.winner==='chasers'?'chaser':null;
  return [...cars].sort((a,b)=>{
   if(winningRole){const team=Number(this.session.role(b.id)===winningRole)-Number(this.session.role(a.id)===winningRole);if(team)return team;}
   const ar=this.session.result(a.id),br=this.session.result(b.id);
   const escaped=Number(br?.outcome==='escaped')-Number(ar?.outcome==='escaped');
   return escaped||(ar?.outcome==='escaped'&&br?.outcome==='escaped'?ar.time-br.time:0)||Number(b.health>0)-Number(a.health>0)||b.passed-a.passed||a.id-b.id;
  }).map(c=>c.id);
 }
 snapshot(){return this.session.snapshot();}
 static restoreState(rules:ChaseRules,capacity:OnlineCapacity,snapshot:unknown){
  if(!validChaseState(rules,capacity,snapshot))throw Error('Invalid online chase state');
  const round=new ChaseRound(rules,capacity);round.state=PursuitSession.restore(snapshot);return round;
 }
 static restore(rules:ChaseRules,capacity:OnlineCapacity,snapshot:unknown,cars:readonly PursuitCar[],elapsed:number){
  const round=new ChaseRound(rules,capacity);
  if(!validChasePhysics(rules,capacity,snapshot,cars,elapsed))throw Error('Invalid online chase save');
  // Preserve terminal outcomes exactly; replaying current damage could turn an
  // escaped runner into a capture while other runners are still in the event.
  round.state=PursuitSession.restore(snapshot);
  return round;
 }
}
