/** Scoring is observational: it never changes contacts, damage or vehicle motion. */
export type CombatMotion={id:number;x:number;z:number;yaw:number;speed:number;vx:number;vz:number;angular:number;up:number;grounded:number;health:number};
export type CombatAward={kind:'solid'|'heavy'|'massive'|'spin';points:number;time:number};
export const COMBAT_AWARDS={solid:{label:'SOLID HIT',points:10},heavy:{label:'HEAVY HIT',points:25},massive:{label:'MASSIVE HIT',points:50},spin:{label:'SPIN OUT',points:75}} as const;
type Pending={attacker:number;victim:number;until:number;yaw:number;turn:number;x:number;z:number;time:number;started:number;angular:number;armed:boolean};
export type CombatFeatState={pending:Pending[];cooldowns:[string,number][]};
const wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
export class CombatFeats{
 private pending=new Map<number,Pending>();
 private cooldowns=new Map<string,number>();
 reset(){this.pending.clear();this.cooldowns.clear();}
 remove(id:number){this.pending.delete(id);for(const [victim,p]of this.pending)if(p.attacker===id)this.pending.delete(victim);}
 private claim(key:string,time:number,duration:number){if((this.cooldowns.get(key)??-Infinity)>time)return false;this.cooldowns.set(key,time+duration);return true;}
 contact(attacker:CombatMotion,victim:CombatMotion,damage:number,time:number):CombatAward|null{
  if(attacker.id===victim.id||attacker.health<=0||victim.health<=0||damage<=0)return null;
  const dx=victim.x-attacker.x,dz=victim.z-attacker.z,distance=Math.hypot(dx,dz);
  // A parked car being rammed cannot earn an offensive bonus for reciprocal damage.
  if(distance<.01||(attacker.vx*dx+attacker.vz*dz)/distance<2)return null;
  if(damage>=2&&victim.speed>=4&&Math.abs(victim.angular)<.8&&victim.up>.6&&victim.grounded>=2&&!this.pending.has(victim.id)&&(this.cooldowns.get('spin:'+attacker.id+':'+victim.id)??0)<=time)
   this.pending.set(victim.id,{attacker:attacker.id,victim:victim.id,until:time+2.5,yaw:victim.yaw,turn:0,x:victim.x,z:victim.z,time,started:time,angular:Math.abs(victim.angular),armed:false});
  const kind=damage>=20?'massive':damage>=10?'heavy':damage>=4?'solid':null;
  return kind&&this.claim('hit:'+attacker.id+':'+victim.id,time,2)?{kind,points:COMBAT_AWARDS[kind].points,time}:null;
 }
 sample(cars:readonly CombatMotion[],time:number):{id:number;award:CombatAward}[]{
  const result:{id:number;award:CombatAward}[]=[];
  for(const [key,until]of this.cooldowns)if(until<=time)this.cooldowns.delete(key);
  for(const [id,p]of this.pending){const car=cars.find(c=>c.id===id),dt=time-p.time;
   if(!car||car.health<=0||time>p.until||dt<0||dt>.25||car.up<.6||car.grounded<2||Math.hypot(car.x-p.x,car.z-p.z)>Math.max(4,dt*90)){this.pending.delete(id);continue;}
   if(time-p.started<=.4&&Math.abs(car.angular)>Math.max(.8,p.angular+.5))p.armed=true;
   if(!p.armed&&time-p.started>.4){this.pending.delete(id);continue;}
   const turn=wrap(car.yaw-p.yaw);if(Math.abs(turn)>Math.max(.2,dt*12)){this.pending.delete(id);continue;}
   p.turn+=turn;p.yaw=car.yaw;p.time=time;p.x=car.x;p.z=car.z;
   if(p.armed&&Math.abs(p.turn)>=Math.PI/2){
    this.pending.delete(id);
    if(this.claim('spin:'+p.attacker+':'+id,time,8))result.push({id:p.attacker,award:{kind:'spin',points:COMBAT_AWARDS.spin.points,time}});
   }
  }
  return result;
 }
 snapshot():CombatFeatState{return{pending:[...this.pending.values()].map(p=>({...p})),cooldowns:[...this.cooldowns]};}
 restore(state?:CombatFeatState){this.reset();if(state){for(const p of state.pending)this.pending.set(p.victim,{...p});for(const entry of state.cooldowns)this.cooldowns.set(...entry);}}
}
/** Shared orientation conversion for rendered and authoritative physics. */
export function combatMotion(id:number,p:{x:number;z:number},q:{x:number;y:number;z:number;w:number},v:{x:number;z:number},angular:number,health:number,grounded:number):CombatMotion{
 return{id,x:p.x,z:p.z,yaw:Math.atan2(2*(q.x*q.z+q.w*q.y),1-2*(q.x*q.x+q.y*q.y)),speed:Math.hypot(v.x,v.z),vx:v.x,vz:v.z,angular,health,grounded,up:1-2*(q.x*q.x+q.z*q.z)};
}

export function validCombatFeats(v:unknown,count:number,duration:number):v is CombatFeatState{
 const s=v as CombatFeatState,finite=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max,id=(n:unknown)=>finite(n,0,count-1)&&Number.isInteger(n);
 return !!s&&Array.isArray(s.pending)&&s.pending.length<=count&&new Set(s.pending.map(p=>p?.victim)).size===s.pending.length&&s.pending.every(p=>p&&id(p.attacker)&&id(p.victim)&&p.attacker!==p.victim&&finite(p.started,0,duration+1)&&finite(p.time,p.started,duration+1)&&finite(p.until,p.time,duration+3.5)&&Math.abs(p.until-p.started-2.5)<1e-6&&finite(p.yaw,-Math.PI,Math.PI)&&finite(p.turn,-Math.PI/2,Math.PI/2)&&finite(p.x,-300,300)&&finite(p.z,-300,300)&&finite(p.angular,0,.8)&&typeof p.armed==='boolean')&&Array.isArray(s.cooldowns)&&s.cooldowns.length<=count*(count-1)*2&&new Set(s.cooldowns.map(e=>e?.[0])).size===s.cooldowns.length&&s.cooldowns.every(e=>Array.isArray(e)&&e.length===2&&typeof e[0]==='string'&&/^(hit|spin):\d+:\d+$/.test(e[0])&&e[0].split(':').slice(1).every(n=>id(Number(n)))&&finite(e[1],0,duration+9));
}
