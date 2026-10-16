/** Chase event state. Physics owns damage and ordered checkpoint completion. */
export type PursuitRole='runner'|'chaser';
export type PursuitOutcome='running'|'escaped'|'caught';
export type PursuitMember={id:number;role:PursuitRole};
export type PursuitRules={version:1;members:PursuitMember[];duration:number};
export type PursuitCar={id:number;health:number;finished:boolean;finishTime:number};
export type PursuitResult={id:number;outcome:PursuitOutcome;time:number};
export type PursuitSnapshot={version:1;rules:PursuitRules;elapsed:number;results:PursuitResult[]};
const integer=(n:unknown,min:number,max:number):n is number=>typeof n==='number'&&Number.isInteger(n)&&n>=min&&n<=max;
const finite=(n:unknown,min:number,max:number):n is number=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
export function validPursuitRules(value:unknown):value is PursuitRules{
 const r=value as PursuitRules;
 return !!r&&r.version===1&&integer(r.duration,60,1200)&&Array.isArray(r.members)&&r.members.length>=2&&r.members.length<=24&&
  r.members.every(m=>m&&integer(m.id,0,23)&&(m.role==='runner'||m.role==='chaser'))&&
  new Set(r.members.map(m=>m.id)).size===r.members.length&&r.members.some(m=>m.role==='runner')&&r.members.some(m=>m.role==='chaser');
}
export function soloPursuitRules(ids:readonly number[],player:number,duration=300):PursuitRules{
 const rules:PursuitRules={version:1,duration,members:ids.map(id=>({id,role:id===player?'runner':'chaser'}))};
 if(!validPursuitRules(rules))throw Error('A chase requires one player runner and at least one pursuer.');return rules;
}
export function validPursuitSnapshot(value:unknown):value is PursuitSnapshot{
 const s=value as PursuitSnapshot;if(!s||s.version!==1||!validPursuitRules(s.rules)||!finite(s.elapsed,0,s.rules.duration)||!Array.isArray(s.results))return false;
 const runners=s.rules.members.filter(m=>m.role==='runner');
 return s.results.length===runners.length&&new Set(s.results.map(r=>r?.id)).size===runners.length&&s.results.every(r=>r&&runners.some(m=>m.id===r.id)&&
  ['running','escaped','caught'].includes(r.outcome)&&finite(r.time,0,s.elapsed)&&(r.outcome!=='running'||r.time===0&&s.elapsed<s.rules.duration));
}
export class PursuitSession{
 private readonly config:PursuitRules;
 private clock=0;
 private readonly outcomes=new Map<number,PursuitResult>();
 constructor(rules:PursuitRules){
  if(!validPursuitRules(rules))throw Error('Invalid chase rules');this.config=structuredClone(rules);
  for(const m of this.config.members)if(m.role==='runner')this.outcomes.set(m.id,{id:m.id,outcome:'running',time:0});
 }
 get elapsed(){return this.clock;}
 get complete(){return [...this.outcomes.values()].every(r=>r.outcome!=='running');}
 get winner():'runners'|'chasers'|null{return !this.complete?null:[...this.outcomes.values()].some(r=>r.outcome==='escaped')?'runners':'chasers';}
 role(id:number){return this.config.members.find(m=>m.id===id)?.role;}
 result(id:number){const r=this.outcomes.get(id);return r?{...r}:undefined;}
 /** Missing bodies are not captures. A disconnect must retain its authoritative car. */
 update(cars:readonly PursuitCar[],elapsed:number){
  if(!Number.isFinite(elapsed)||elapsed<this.clock)throw Error('Chase time must advance monotonically');
  if(this.complete)return;
  this.clock=Math.min(elapsed,this.config.duration);
  for(const [id,result]of this.outcomes){
   if(result.outcome!=='running')continue;
   const car=cars.find(c=>c.id===id);
   if(car&&Number.isFinite(car.health)&&car.health<=0){this.outcomes.set(id,{id,outcome:'caught',time:this.clock});continue;}
   // A valid earlier crossing still wins when a simulation step reaches the deadline.
   if(car&&car.health>0&&car.finished&&finite(car.finishTime,0,this.clock)&&car.finishTime<=this.config.duration){this.outcomes.set(id,{id,outcome:'escaped',time:car.finishTime});continue;}
   if(this.clock>=this.config.duration)this.outcomes.set(id,{id,outcome:'caught',time:this.config.duration});
  }
 }
 snapshot():PursuitSnapshot{return{version:1,rules:structuredClone(this.config),elapsed:this.clock,results:[...this.outcomes.values()].map(r=>({...r}))};}
 static restore(snapshot:unknown){
  if(!validPursuitSnapshot(snapshot))throw Error('Invalid saved chase');
  const session=new PursuitSession(snapshot.rules);session.clock=snapshot.elapsed;
  for(const r of snapshot.results)session.outcomes.set(r.id,{...r});return session;
 }
}
