import type {TetraSwim} from './TetraSwimming.ts';
import {behaviorRandom} from './BehaviorVariation.ts';
const distance=(a:TetraSwim,b:TetraSwim)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z-b.z)*180);
const angle=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
/** An occasional illustrative display, not a spawning or fertility simulation.
 * Choose an already adjacent, aligned pair: never pull fish through scenery. */
export class TetraCourtship {
 private random:()=>number;
 remaining:number;
 private pair:TetraSwim[]=[];
 constructor(seed:number){this.random=behaviorRandom(seed);this.remaining=25+this.random()*40;}
 update(dt:number,fish:TetraSwim[],interrupted:boolean){
  if(dt<=0)return;
  const eligible=(s:TetraSwim)=>s.feedingPhase==='search'&&s.brain.biteIn<=0&&s.startleRemaining<=0&&s.avoidanceRemaining<=0;
  if(this.pair.length){
   const [a,b]=this.pair,d=distance(a,b);
   if(interrupted||!this.pair.every(eligible)||this.pair.some(s=>s.courtship<=0)||d<52||d>125||Math.abs(angle(a.yaw+a.depthHeading-b.yaw-b.depthHeading))>.65){
    this.pair.forEach(s=>{s.courtship=0;s.behavior='gliding';s.remaining=.8;});this.pair=[];
   }
   return;
  }
  if(interrupted){this.remaining=Math.max(this.remaining,18);return;}
  this.remaining-=dt;if(this.remaining>0)return;
  const candidates:[TetraSwim,TetraSwim][]=[];
  for(let i=0;i<fish.length;i++)for(let j=i+1;j<fish.length;j++){
   const a=fish[i],b=fish[j],d=distance(a,b),yaw=a.yaw+a.depthHeading;
   const along=(b.x-a.x)*Math.cos(yaw)-(b.z-a.z)*180*Math.sin(yaw);
   if(eligible(a)&&eligible(b)&&d>55&&d<115&&Math.abs(along)<45&&Math.abs(a.y-b.y)<35&&a.speed<60&&b.speed<60&&Math.abs(angle(yaw-b.yaw-b.depthHeading))<.5&&fish.every(s=>s===a||s===b||Math.min(distance(s,a),distance(s,b))>52))candidates.push([a,b]);
  }
  if(!candidates.length){this.remaining=1+this.random()*2;return;}
  this.pair=candidates[Math.floor(this.random()*candidates.length)];
  const duration=1.4+this.random()*.7;
  this.pair.forEach(s=>{s.courtship=duration;s.courtshipAge=0;s.browsing=false;});
  this.remaining=55+this.random()*95;
 }
}
/** Steady heading with a short posterior wave; normal solid/pair constraints run afterward. */
export function advanceCourtshipSwim(s:TetraSwim,dt:number){
 if(s.startleRemaining>0||s.avoidanceRemaining>0){s.courtship=0;return false;}
 s.courtship=Math.max(0,s.courtship-dt);s.courtshipAge+=dt;s.elapsed+=dt;s.sinceTurn+=dt;
 const envelope=Math.min(1,s.courtshipAge/.3,s.courtship/.35);
 s.effort+=(envelope*.95+.025-s.effort)*(1-Math.exp(-dt*12));
 s.pectoralEffort+=(.7-s.pectoralEffort)*(1-Math.exp(-dt*8));
 s.speed+=(7-s.speed)*(1-Math.exp(-dt*5));s.pitch*=Math.exp(-dt*4);
 const yaw=s.yaw+s.depthHeading;
 s.vx=Math.cos(yaw)*s.speed;s.vy=0;s.vz=-Math.sin(yaw)*s.speed/180;
 s.x+=s.vx*dt;s.z+=s.vz*dt;s.behavior='gliding';s.remaining=1;
 return true;
}
