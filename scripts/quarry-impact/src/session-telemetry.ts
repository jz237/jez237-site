export type RunStats = {
  seconds:number; distance:number; damage:number; knockouts:number; drift:number;
  airtime:number; maxSpeed:number; checkpoints:number; health:number; rank:number;
  finished:boolean; won?:boolean; completed:boolean; recovered:boolean;
};
export const emptyRun = ():RunStats => ({seconds:0,distance:0,damage:0,knockouts:0,drift:0,airtime:0,maxSpeed:0,checkpoints:0,health:100,rank:0,finished:false,completed:false,recovered:false});
export type DrivingSample = {speed:number; lateral:number; grounded:number; height:number; health:number; checkpoints:number};

/** Receives fixed physics steps only. Pause, countdown, spectators and online
 * extrapolation never contribute samples. Jump time is banked only on landing. */
export class SessionTelemetry {
  readonly stats=emptyRun();
  private air=0;
  private airPeak=0;
  private knockedOut=new Set<number>();
  sample(dt:number,s:DrivingSample){
    if(!Number.isFinite(dt)||dt<=0||dt>.1||![s.speed,s.lateral,s.height,s.health,s.checkpoints,s.grounded].every(Number.isFinite))return;
    const r=this.stats,speed=Math.abs(s.speed);
    r.seconds+=dt;r.health=Math.max(0,Math.min(100,s.health));
    r.checkpoints=Math.max(r.checkpoints,Math.floor(Math.max(0,s.checkpoints)));
    if(s.health<=0||speed>90){this.air=0;this.airPeak=0;return;}
    // No spawn-settling or wheelspin score. The velocity belongs to the chassis.
    if(s.grounded>=2){
      r.distance+=Math.hypot(speed,s.lateral)*dt;
      r.maxSpeed=Math.max(r.maxSpeed,speed);
      const ratio=Math.abs(s.lateral)/Math.max(1,speed);
      if(speed>=7&&ratio>=.18&&ratio<=1.1)r.drift+=speed*dt;
      if(this.air>=.45&&this.airPeak>=.65)r.airtime+=Math.min(5,this.air);
      this.air=0;this.airPeak=0;
    }else if(s.grounded===0){this.air+=dt;this.airPeak=Math.max(this.airPeak,s.height);}
    else {this.air=0;this.airPeak=0;}
  }
  impact(id:number,before:number,after:number){
    if(!Number.isFinite(before)||!Number.isFinite(after)||before<=0)return;
    const damage=Math.max(0,Math.min(100,before)-Math.max(0,after));
    this.stats.damage+=damage;
    if(after<=0&&!this.knockedOut.has(id)){this.knockedOut.add(id);this.stats.knockouts++;}
  }
  resetOpponent(id:number){this.knockedOut.delete(id);}
  recover(){this.stats.recovered=true;this.air=0;this.airPeak=0;}
}
