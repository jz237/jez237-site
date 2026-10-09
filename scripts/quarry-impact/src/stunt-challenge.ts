import {STUNT_LOOP,stuntLoopPoint,stuntHeight} from './stunt-layout';
export type StuntTask='loop'|'gap';
export type StuntSample={x:number;y:number;z:number;up:number;grounded:number;health:number};
/** Ordered physical milestones, sampled only by the live offline challenge.
 * An airborne fall, rolling beside the loop or touching the landing alone is
 * not a completed stunt. A discontinuity cannot skip a route milestone. */
export class StuntChallengeProgress{
 private last:StuntSample|null=null;
 private stage=0;
 private inverted=0;
 private air=0;
 private invalid=false;
 completed=false;
 constructor(readonly task:StuntTask){}
 get hint(){return this.completed?'STUNT COMPLETE':this.task==='loop'?(this.stage===0?'FOLLOW THE LOOP ARROWS · BUILD SPEED':`LOOP GATES ${Math.min(this.stage,9)} / 9 · EXIT UPRIGHT`):this.stage===0?'USE THE GOLD JUMP LANE · 90–110 KM/H':this.stage===1?'CLEAR THE GAP':'LAND ON THE FAR RAMP';}
 sample(dt:number,s:StuntSample):boolean{
  if(this.completed||this.invalid)return this.completed;
  if(!Number.isFinite(dt)||dt<=0||dt>.1||!Object.values(s).every(Number.isFinite)||s.health<=0){this.invalid=true;return false;}
  if(this.last&&Math.hypot(s.x-this.last.x,s.y-this.last.y,s.z-this.last.z)>Math.max(3,dt*100)){this.invalid=true;return false;}
  this.last={...s};
  if(this.task==='loop'){
   if(this.stage>0&&s.up<-.75)this.inverted+=dt;
   if(this.stage<9){const p=stuntLoopPoint(this.stage/8);if(Math.hypot(s.x-p.x,s.y-p.y,s.z-p.z)<4.5&&(this.stage>0||s.grounded>=2&&s.up>.7))this.stage++;}
   else if(this.inverted>.25&&s.grounded>=2&&s.up>.8&&s.y<2&&s.z>STUNT_LOOP.z+6&&s.z<STUNT_LOOP.z+25&&Math.abs(s.x-STUNT_LOOP.x-STUNT_LOOP.shift)<4)this.completed=true;
  }else{
   if(this.stage===0&&Math.abs(s.x-65)<7&&s.z> -38&&s.z< -24&&s.y>1&&s.y<5&&s.grounded>=2&&s.up>.6)this.stage=1;
   if(this.stage===1&&Math.abs(s.x-65)<8&&s.z> -20&&s.z<0&&s.y>4&&s.grounded===0){this.air+=dt;if(this.air>.15)this.stage=2;}
   if(this.stage===2&&Math.abs(s.x-65)<9&&s.z>4&&s.z<50&&Math.abs(s.y-stuntHeight(s.x,s.z)-.8)<1.2&&s.grounded>=2&&s.up>.6)this.completed=true;
  }
  return this.completed;
 }
}
export const stuntChallengeSpawn=(task?:StuntTask)=>task==='gap'?{x:65,z:-145,yaw:0,next:1,passed:0}:undefined;
